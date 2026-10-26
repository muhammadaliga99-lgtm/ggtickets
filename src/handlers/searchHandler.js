/**
 * Event Search Handler
 */

const { Markup } = require('telegraf');
const storage = require('../db/storage');
const { t } = require('../i18n');
const sessionManager = require('../utils/sessionManager');
const logger = require('../utils/logger');

/**
 * Prompt user to enter search keyword
 */
async function promptSearch(ctx) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    sessionManager.set(ctx.from.id, { step: 'awaiting_search_query' });

    await ctx.replyWithHTML(t(lang, 'search_prompt'));
  } catch (err) {
    logger.error('Error in promptSearch:', err.message);
  }
}

/**
 * Execute search query against events and venues
 */
async function executeSearch(ctx, query) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';
    sessionManager.clearStep(ctx.from.id);

    const clean = (query || '').trim().toLowerCase();
    if (!clean) {
      return await ctx.replyWithHTML(t(lang, 'search_prompt'));
    }

    const allEvents = storage.getEvents({ active_only: true });
    const matching = allEvents.filter(e => {
      const titleUz = (e.title_uz || '').toLowerCase();
      const titleRu = (e.title_ru || '').toLowerCase();
      const titleEn = (e.title_en || '').toLowerCase();
      const descUz = (e.description_uz || '').toLowerCase();
      const venue = storage.getVenueById(e.venue_id);
      const venueName = venue ? (venue.name_uz || '').toLowerCase() : '';

      return (
        titleUz.includes(clean) ||
        titleRu.includes(clean) ||
        titleEn.includes(clean) ||
        descUz.includes(clean) ||
        venueName.includes(clean)
      );
    });

    if (matching.length === 0) {
      return await ctx.replyWithHTML(t(lang, 'search_empty', { query }));
    }

    const buttons = matching.map(e => {
      const title = e[`title_${lang}`] || e.title_uz;
      return [Markup.button.callback(`🎟 ${title}`, `view_evt_${e.id}`)];
    });

    buttons.push([Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')]);

    await ctx.replyWithHTML(
      t(lang, 'search_results', { query }),
      Markup.inlineKeyboard(buttons)
    );
  } catch (err) {
    logger.error('Error in executeSearch:', err.message);
  }
}

module.exports = {
  promptSearch,
  executeSearch
};
