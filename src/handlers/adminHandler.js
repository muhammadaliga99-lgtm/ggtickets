/**
 * Admin Panel & Ticket Check-In Validator Handler
 */

const { Markup } = require('telegraf');
const storage = require('../db/storage');
const { t } = require('../i18n');
const { isAdmin } = require('../config/env');
const { formatUZS, formatDate } = require('../utils/formatter');
const { getAdminMenuKeyboard, getAdminBackKeyboard } = require('../keyboards/adminKeyboards');
const sessionManager = require('../utils/sessionManager');
const logger = require('../utils/logger');

/**
 * Check if user is authorized as admin
 */
function checkAdminAccess(ctx) {
  const userId = ctx.from.id;
  const user = storage.getUser(userId);

  // If user role is admin in DB or in env ADMIN_IDS
  if (user?.role === 'admin' || isAdmin(userId)) {
    return true;
  }

  // Auto-promote first user if no admins exist in DB
  const allUsers = storage.getAllUsers();
  const existingAdmins = allUsers.filter(u => u.role === 'admin');
  if (existingAdmins.length === 0) {
    storage.saveUser({ id: userId, role: 'admin' });
    logger.info(`User ${userId} auto-promoted to Admin (first system admin).`);
    return true;
  }

  return false;
}

/**
 * Show Admin Panel Dashboard
 */
async function showAdminPanel(ctx) {
  try {
    if (!checkAdminAccess(ctx)) {
      const user = storage.getUser(ctx.from.id);
      const lang = user?.language || 'uz';
      return await ctx.replyWithHTML(t(lang, 'admin_access_denied'));
    }

    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
      try {
        await ctx.editMessageText(t(lang, 'admin_panel_title'), {
          parse_mode: 'HTML',
          ...getAdminMenuKeyboard(lang)
        });
      } catch {
        await ctx.replyWithHTML(t(lang, 'admin_panel_title'), getAdminMenuKeyboard(lang));
      }
    } else {
      await ctx.replyWithHTML(t(lang, 'admin_panel_title'), getAdminMenuKeyboard(lang));
    }
  } catch (err) {
    logger.error('Error in showAdminPanel:', err.message);
  }
}

/**
 * Show System Statistics
 */
async function showAdminStats(ctx) {
  try {
    if (!checkAdminAccess(ctx)) return;
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const stats = storage.getStats();
    const text = t(lang, 'admin_stats', {
      total_users: stats.total_users,
      total_tickets: stats.total_tickets,
      total_revenue: formatUZS(stats.total_revenue),
      active_events: stats.active_events,
      total_orders: stats.total_orders
    });

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(text, getAdminBackKeyboard(lang));
  } catch (err) {
    logger.error('Error in showAdminStats:', err.message);
  }
}

/**
 * Prompt Admin to Enter Ticket Code for Check-In Validation
 */
async function promptTicketValidation(ctx) {
  try {
    if (!checkAdminAccess(ctx)) return;
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    sessionManager.set(ctx.from.id, { step: 'awaiting_admin_ticket_code' });

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(t(lang, 'admin_enter_ticket_code'), getAdminBackKeyboard(lang));
  } catch (err) {
    logger.error('Error in promptTicketValidation:', err.message);
  }
}

/**
 * Process Ticket Code Check-In Validation
 */
async function validateTicketCode(ctx, code) {
  try {
    if (!checkAdminAccess(ctx)) return;
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';
    sessionManager.clearStep(ctx.from.id);

    const ticket = storage.getTicketByCode(code);
    if (!ticket) {
      return await ctx.replyWithHTML(t(lang, 'admin_ticket_not_found'), getAdminBackKeyboard(lang));
    }

    const event = storage.getEventById(ticket.event_id);
    const buyer = storage.getUser(ticket.user_id);
    const title = event ? (event[`title_${lang}`] || event.title_uz) : 'Tadbir';
    const buyerName = buyer ? `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() || `@${buyer.username || 'user'}` : 'Noma\'lum';

    if (ticket.status === 'USED') {
      return await ctx.replyWithHTML(
        t(lang, 'admin_ticket_already_used', { code: ticket.ticket_code }),
        getAdminBackKeyboard(lang)
      );
    }

    if (ticket.status === 'CANCELLED') {
      return await ctx.replyWithHTML(
        `🔴 <b>Chipta bekor qilingan!</b>\n\nChipta kodi: <code>${ticket.ticket_code}</code>\nKirish taqiqlanadi!`,
        getAdminBackKeyboard(lang)
      );
    }

    // Mark as USED
    ticket.status = 'USED';
    ticket.used_at = new Date().toISOString();
    ticket.used_by = ctx.from.id;
    storage.saveTicket(ticket);

    const validText = t(lang, 'admin_ticket_valid', {
      code: ticket.ticket_code,
      title,
      buyer: buyerName,
      sector: ticket.sector_name,
      seat: ticket.seat_number,
      price: formatUZS(ticket.price)
    });

    await ctx.replyWithHTML(validText, getAdminBackKeyboard(lang));
  } catch (err) {
    logger.error('Error in validateTicketCode:', err.message);
  }
}

/**
 * Prompt Admin for Broadcast Announcement
 */
async function promptBroadcast(ctx) {
  try {
    if (!checkAdminAccess(ctx)) return;
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    sessionManager.set(ctx.from.id, { step: 'awaiting_admin_broadcast' });

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(t(lang, 'admin_broadcast_prompt'), getAdminBackKeyboard(lang));
  } catch (err) {
    logger.error('Error in promptBroadcast:', err.message);
  }
}

/**
 * Execute Broadcast to all users
 */
async function executeBroadcast(ctx, broadcastText) {
  try {
    if (!checkAdminAccess(ctx)) return;
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';
    sessionManager.clearStep(ctx.from.id);

    const allUsers = storage.getAllUsers();
    let successCount = 0;
    let failCount = 0;

    await ctx.reply(`📢 Xabarnoma yuborilmoqda (${allUsers.length} ta foydalanuvchiga)...`);

    for (const u of allUsers) {
      try {
        await ctx.telegram.sendMessage(u.id, broadcastText, { parse_mode: 'HTML' });
        successCount++;
      } catch (sendErr) {
        failCount++;
        logger.debug(`Broadcast failed for user ${u.id}:`, sendErr.message);
      }
    }

    await ctx.replyWithHTML(
      t(lang, 'admin_broadcast_sent', { success: successCount, failed: failCount }),
      getAdminBackKeyboard(lang)
    );
  } catch (err) {
    logger.error('Error in executeBroadcast:', err.message);
  }
}

/**
 * Manage Events (Toggle Active / Inactive)
 */
async function showManageEvents(ctx) {
  try {
    if (!checkAdminAccess(ctx)) return;
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const events = storage.getEvents();
    if (events.length === 0) {
      return await ctx.reply('Tadbirlar mavjud emas.');
    }

    const buttons = events.map(e => {
      const statusIcon = e.is_active !== false ? '🟢' : '🔴';
      const title = e[`title_${lang}`] || e.title_uz;
      const short = title.length > 30 ? `${title.substring(0, 27)}...` : title;
      return [Markup.button.callback(`${statusIcon} ${short}`, `admin_toggle_evt_${e.id}`)];
    });

    buttons.push([Markup.button.callback(`⬅️ Admin Menyusi`, 'admin_menu')]);

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(
      '🎭 <b>Tadbirlarni boshqarish</b>\n\n<i>Holatni o\'zgartirish (Faol / Nofaol) uchun tadbirni bosing:</i>',
      Markup.inlineKeyboard(buttons)
    );
  } catch (err) {
    logger.error('Error in showManageEvents:', err.message);
  }
}

/**
 * Toggle Event Active Status
 */
async function toggleEventStatus(ctx, eventId) {
  try {
    if (!checkAdminAccess(ctx)) return;

    const event = storage.getEventById(eventId);
    if (!event) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Tadbir topilmadi!');
      return;
    }

    event.is_active = event.is_active === false;
    storage.saveEvent(event);

    const statusText = event.is_active ? 'Faollashtirildi 🟢' : 'Nofaol qilindi 🔴';
    if (ctx.answerCbQuery) await ctx.answerCbQuery(statusText);

    await showManageEvents(ctx);
  } catch (err) {
    logger.error('Error in toggleEventStatus:', err.message);
  }
}

/**
 * Show Promo Codes List
 */
async function showAdminPromos(ctx) {
  try {
    if (!checkAdminAccess(ctx)) return;
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const promos = storage.cache.promos || [];
    let text = '🏷 <b>Mavjud promokodlar:</b>\n\n';

    promos.forEach((p, idx) => {
      const discount = p.discount_percent > 0 ? `${p.discount_percent}%` : formatUZS(p.discount_uzs);
      text += `${idx + 1}. <code>${p.code}</code> — Chegirma: <b>${discount}</b> (Min: ${formatUZS(p.min_order)})\n`;
    });

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(text, getAdminBackKeyboard(lang));
  } catch (err) {
    logger.error('Error in showAdminPromos:', err.message);
  }
}

module.exports = {
  checkAdminAccess,
  showAdminPanel,
  showAdminStats,
  promptTicketValidation,
  validateTicketCode,
  promptBroadcast,
  executeBroadcast,
  showManageEvents,
  toggleEventStatus,
  showAdminPromos
};
