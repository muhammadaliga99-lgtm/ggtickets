/**
 * Start & Language Selection Handlers
 */

const storage = require('../db/storage');
const { t } = require('../i18n');
const { getMainKeyboard, getLanguageInlineKeyboard } = require('../keyboards/mainKeyboards');
const sessionManager = require('../utils/sessionManager');
const logger = require('../utils/logger');

/**
 * Handle /start command and deep links
 */
async function handleStart(ctx) {
  try {
    const from = ctx.from;
    let user = storage.getUser(from.id);

    // Save or update user
    if (!user) {
      user = storage.saveUser({
        id: from.id,
        username: from.username || '',
        first_name: from.first_name || '',
        last_name: from.last_name || '',
        language: 'uz',
        role: 'user'
      });
    }

    sessionManager.clear(from.id);

    // Deep linking payload check: /start evt_xxx or /start ticket_xxx
    const text = ctx.message?.text || '';
    const payload = text.split(' ')[1];

    if (payload) {
      if (payload.startsWith('evt_')) {
        const eventId = payload;
        const { showEventDetails } = require('./eventHandler');
        return await showEventDetails(ctx, eventId, false);
      }
      if (payload.startsWith('ticket_')) {
        const ticketCode = payload.replace('ticket_', '');
        const { showTicketByCode } = require('./myTicketsHandler');
        return await showTicketByCode(ctx, ticketCode);
      }
    }

    const lang = user.language || 'uz';
    const welcomeMsg = t(lang, 'welcome', { name: from.first_name || 'Mehmon' });

    await ctx.replyWithHTML(welcomeMsg, getMainKeyboard(lang, from.id));
  } catch (err) {
    logger.error('Error in handleStart:', err.message);
    await ctx.reply(t('uz', 'error_generic'));
  }
}

/**
 * Show Language Selection prompt
 */
async function showLanguagePrompt(ctx) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';
    await ctx.replyWithHTML(t(lang, 'select_language'), getLanguageInlineKeyboard());
  } catch (err) {
    logger.error('Error in showLanguagePrompt:', err.message);
  }
}

/**
 * Handle Language Callback (lang_uz, lang_ru, lang_en)
 */
async function handleLanguageSelect(ctx) {
  try {
    const callbackData = ctx.callbackQuery?.data;
    const lang = callbackData.replace('lang_', '');

    storage.saveUser({
      id: ctx.from.id,
      language: lang
    });

    await ctx.answerCbQuery();
    await ctx.replyWithHTML(t(lang, 'language_changed'), getMainKeyboard(lang, ctx.from.id));
  } catch (err) {
    logger.error('Error in handleLanguageSelect:', err.message);
  }
}

module.exports = {
  handleStart,
  showLanguagePrompt,
  handleLanguageSelect
};
