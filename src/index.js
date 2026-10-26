/**
 * ggtickets — Telegram Bot Entry Point & Express Server
 * Built for 24/7 Deployment on Render / Cloud platforms
 */

const { Telegraf } = require('telegraf');
const express = require('express');
const { BOT_TOKEN, PORT, WEBHOOK_URL, NODE_ENV } = require('./config/env');
const storage = require('./db/storage');
const { runSeed } = require('./db/seed');
const { startKeepAlive, stopKeepAlive } = require('./services/keepAliveService');
const logger = require('./utils/logger');
const sessionManager = require('./utils/sessionManager');
const { t } = require('./i18n');
const { getMainKeyboard } = require('./keyboards/mainKeyboards');

// Handlers
const { handleStart, showLanguagePrompt, handleLanguageSelect } = require('./handlers/startHandler');
const { showEventsList, showCategoriesMenu, showEventDetails } = require('./handlers/eventHandler');
const {
  handleSectorSelection,
  handleQuantitySelection,
  promptPromoCode,
  processPromoCodeInput,
  handleCheckout
} = require('./handlers/bookingHandler');
const { processPayment, cancelOrder } = require('./handlers/paymentHandler');
const {
  showMyTickets,
  sendTicketQR,
  sendTicketPDF,
  cancelTicket
} = require('./handlers/myTicketsHandler');
const {
  showVenuesList,
  showVenueDetails,
  showEventsAtVenue
} = require('./handlers/venuesHandler');
const { promptSearch, executeSearch } = require('./handlers/searchHandler');
const { handleMenuAction } = require('./handlers/menuHandler');
const {
  showAdminPanel,
  showAdminStats,
  promptTicketValidation,
  validateTicketCode,
  promptBroadcast,
  executeBroadcast,
  showManageEvents,
  toggleEventStatus,
  showAdminPromos
} = require('./handlers/adminHandler');

// 1. Initialize Seed Data
runSeed();

// 2. Initialize Telegraf Bot
const bot = new Telegraf(BOT_TOKEN);

// Bot error handling (prevents crashes from network issues or blocked users)
bot.catch((err, ctx) => {
  logger.error(`Telegraf Error encountered for update ${ctx.updateType}:`, err.message);
});

// Middleware: User tracking & activity update
bot.use(async (ctx, next) => {
  if (ctx.from) {
    const existing = storage.getUser(ctx.from.id);
    if (!existing) {
      storage.saveUser({
        id: ctx.from.id,
        username: ctx.from.username || '',
        first_name: ctx.from.first_name || '',
        last_name: ctx.from.last_name || ''
      });
    } else {
      existing.last_active = new Date().toISOString();
      if (ctx.from.username && existing.username !== ctx.from.username) {
        existing.username = ctx.from.username;
      }
      storage.saveUser(existing);
    }
  }
  return next();
});

// --- Command Handlers ---
bot.command('start', handleStart);
bot.command('events', ctx => showEventsList(ctx, 1));
bot.command('categories', showCategoriesMenu);
bot.command('search', promptSearch);
bot.command('mytickets', showMyTickets);
bot.command('venues', showVenuesList);
bot.command('lang', showLanguagePrompt);
bot.command('admin', showAdminPanel);
bot.command('help', async ctx => {
  const user = storage.getUser(ctx.from.id);
  const lang = user?.language || 'uz';
  await ctx.replyWithHTML(t(lang, 'help_text'));
});

// --- Text Messages Router (Menu buttons + Session wizards) ---
bot.on('text', async ctx => {
  const text = ctx.message.text.trim();
  const userId = ctx.from.id;
  const session = sessionManager.get(userId);

  // 1. Wizard step handling
  if (session && session.step) {
    if (session.step === 'awaiting_search_query') {
      return await executeSearch(ctx, text);
    }
    if (session.step === 'awaiting_promo_code') {
      return await processPromoCodeInput(ctx, text);
    }
    if (session.step === 'awaiting_admin_ticket_code') {
      return await validateTicketCode(ctx, text);
    }
    if (session.step === 'awaiting_admin_broadcast') {
      return await executeBroadcast(ctx, text);
    }
  }

  // 2. Main menu reply keyboard buttons
  const handled = await handleMenuAction(ctx, text);
  if (handled) return;

  // 3. Fallback for unrecognized text
  const user = storage.getUser(userId);
  const lang = user?.language || 'uz';
  await ctx.replyWithHTML(t(lang, 'main_menu_title'), getMainKeyboard(lang, userId));
});

// --- Action Callback Queries Router ---

// Navigation & Language
bot.action('nav_main_menu', async ctx => {
  const user = storage.getUser(ctx.from.id);
  const lang = user?.language || 'uz';
  if (ctx.answerCbQuery) await ctx.answerCbQuery();
  await ctx.replyWithHTML(t(lang, 'main_menu_title'), getMainKeyboard(lang, ctx.from.id));
});

bot.action('nav_events', ctx => showEventsList(ctx, 1));
bot.action('nav_categories', showCategoriesMenu);
bot.action('nav_venues', showVenuesList);

bot.action(/lang_(uz|ru|en)/, handleLanguageSelect);

// Categories
bot.action(/cat_(.+)/, ctx => {
  const cat = ctx.match[1];
  return showEventsList(ctx, 1, cat);
});

// Pagination: page_<page>_<cat>
bot.action(/page_(\d+)_(.*)/, ctx => {
  const page = parseInt(ctx.match[1], 10);
  const cat = ctx.match[2] || '';
  return showEventsList(ctx, page, cat);
});

// Event Details
bot.action(/view_evt_(.+)/, ctx => {
  const eventId = ctx.match[1];
  return showEventDetails(ctx, eventId, true);
});

// Booking flow
bot.action(/book_evt_(.+)/, ctx => {
  const eventId = ctx.match[1];
  return handleSectorSelection(ctx, eventId);
});

bot.action(/select_sec_([^_]+)_(\d+)/, ctx => {
  const eventId = ctx.match[1];
  const sectorIndex = parseInt(ctx.match[2], 10);
  return handleQuantitySelection(ctx, eventId, sectorIndex, 0);
});

bot.action(/qty_inc_([^_]+)_(\d+)/, ctx => {
  const eventId = ctx.match[1];
  const sectorIndex = parseInt(ctx.match[2], 10);
  return handleQuantitySelection(ctx, eventId, sectorIndex, 1);
});

bot.action(/qty_dec_([^_]+)_(\d+)/, ctx => {
  const eventId = ctx.match[1];
  const sectorIndex = parseInt(ctx.match[2], 10);
  return handleQuantitySelection(ctx, eventId, sectorIndex, -1);
});

bot.action(/enter_promo_([^_]+)_(\d+)/, ctx => {
  const eventId = ctx.match[1];
  const sectorIndex = parseInt(ctx.match[2], 10);
  return promptPromoCode(ctx, eventId, sectorIndex);
});

bot.action(/checkout_([^_]+)_(\d+)/, ctx => {
  const eventId = ctx.match[1];
  const sectorIndex = parseInt(ctx.match[2], 10);
  return handleCheckout(ctx, eventId, sectorIndex);
});

// Payments
bot.action(/pay_(click|payme|uzum|demo)_(.+)/, ctx => {
  const method = ctx.match[1];
  const orderId = ctx.match[2];
  return processPayment(ctx, orderId, method);
});

bot.action(/cancel_order_(.+)/, ctx => {
  const orderId = ctx.match[1];
  return cancelOrder(ctx, orderId);
});

// My Tickets
bot.action(/ticket_pdf_(.+)/, ctx => {
  const ticketId = ctx.match[1];
  return sendTicketPDF(ctx, ticketId);
});

bot.action(/ticket_qr_(.+)/, ctx => {
  const ticketId = ctx.match[1];
  return sendTicketQR(ctx, ticketId);
});

bot.action(/ticket_cancel_(.+)/, ctx => {
  const ticketId = ctx.match[1];
  return cancelTicket(ctx, ticketId);
});

// Venues
bot.action(/venue_(.+)/, ctx => {
  const venueId = ctx.match[1];
  return showVenueDetails(ctx, venueId);
});

bot.action(/events_at_venue_(.+)/, ctx => {
  const venueId = ctx.match[1];
  return showEventsAtVenue(ctx, venueId);
});

// Admin Panel
bot.action('admin_menu', showAdminPanel);
bot.action('admin_stats', showAdminStats);
bot.action('admin_scanner', promptTicketValidation);
bot.action('admin_broadcast', promptBroadcast);
bot.action('admin_events', showManageEvents);
bot.action(/admin_toggle_evt_(.+)/, ctx => {
  const eventId = ctx.match[1];
  return toggleEventStatus(ctx, eventId);
});
bot.action('admin_promos', showAdminPromos);
bot.action('admin_add_event', async ctx => {
  await ctx.answerCbQuery('Yangi tadbirlar JSON / Admin orqali qo\'shiladi.');
  await ctx.replyWithHTML(
    'ℹ️ <b>Yangi tadbir qo\'shish:</b>\n\nTadbirlarni <code>data/events.json</code> fayliga kiritish yoki kelgusi versiyada to\'g\'ridan-to\'g\'ri bot orqali kiritish mumkin.'
  );
});

// No-op for counter buttons
bot.action('noop', async ctx => {
  if (ctx.answerCbQuery) await ctx.answerCbQuery();
});

bot.action('sector_soldout', async ctx => {
  if (ctx.answerCbQuery) await ctx.answerCbQuery('Ushbu sektorda chiptalar tugagan!', { show_alert: true });
});

// ==========================================
// 3. Express Web Server & Render 24/7 Setup
// ==========================================
const app = express();
app.use(express.json());

// Health Check endpoint for Render / UptimeRobot / Cron
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'ggtickets-bot',
    version: '1.0.0',
    mode: WEBHOOK_URL ? 'webhook' : 'polling',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Public Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json(storage.getStats());
});

// Server listener
const server = app.listen(PORT, '0.0.0.0', async () => {
  logger.success(`🚀 HTTP Web Server listening on port ${PORT}`);

  try {
    if (WEBHOOK_URL) {
      // Production Webhook Mode
      const webhookPath = '/telegram-webhook';
      const fullWebhookUrl = `${WEBHOOK_URL.replace(/\/$/, '')}${webhookPath}`;

      app.use(bot.webhookCallback(webhookPath));
      await bot.telegram.setWebhook(fullWebhookUrl);
      logger.success(`📡 Telegraf configured in Webhook mode: ${fullWebhookUrl}`);
    } else {
      // Development / Polling Mode
      await bot.telegram.deleteWebhook({ drop_pending_updates: true });
      bot.launch({
        dropPendingUpdates: true
      });
      logger.success('🤖 Telegraf started in Long Polling mode.');
    }

    // Start 24/7 Keep-Alive self-pinger
    startKeepAlive();
  } catch (err) {
    logger.error('Failed to launch Telegram bot:', err.message);
  }
});

// Graceful Shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Gracefully stopping bot and server...`);
  stopKeepAlive();
  bot.stop(signal);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err);
});
