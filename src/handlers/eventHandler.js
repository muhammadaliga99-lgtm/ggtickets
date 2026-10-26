/**
 * Event Browsing & Details Handler
 */

const storage = require('../db/storage');
const { t } = require('../i18n');
const { ITEMS_PER_PAGE } = require('../config/constants');
const { formatUZS, formatDate } = require('../utils/formatter');
const { getEventListKeyboard, getEventDetailKeyboard } = require('../keyboards/eventKeyboards');
const { getCategoriesKeyboard } = require('../keyboards/mainKeyboards');
const logger = require('../utils/logger');

/**
 * List events with pagination and optional category filter
 */
async function showEventsList(ctx, page = 1, category = '') {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const filter = { active_only: true };
    if (category) filter.category = category;

    const allEvents = storage.getEvents(filter);

    if (allEvents.length === 0) {
      const msg = t(lang, 'events_empty');
      if (ctx.callbackQuery) {
        await ctx.answerCbQuery();
        return await ctx.editMessageText(msg, getCategoriesKeyboard(lang));
      }
      return await ctx.replyWithHTML(msg, getCategoriesKeyboard(lang));
    }

    const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE) || 1;
    const safePage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = allEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    let headerText = `${t(lang, 'events_title')}\n`;
    if (category) {
      headerText += `📂 Bo'lim / Категория: <b>${category.toUpperCase()}</b>\n`;
    }
    headerText += `\n<i>${t(lang, 'page_info', { current: safePage, total: totalPages })}</i>`;

    const keyboard = getEventListKeyboard(paginatedEvents, safePage, totalPages, lang, category);

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
      // If previous message was a photo, editMessageText fails; so we delete and send or try edit
      try {
        await ctx.editMessageText(headerText, { parse_mode: 'HTML', ...keyboard });
      } catch {
        await ctx.replyWithHTML(headerText, keyboard);
      }
    } else {
      await ctx.replyWithHTML(headerText, keyboard);
    }
  } catch (err) {
    logger.error('Error in showEventsList:', err.message);
  }
}

/**
 * Show Categories Selection Menu
 */
async function showCategoriesMenu(ctx) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';
    const text = t(lang, 'categories_title');

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
      try {
        await ctx.editMessageText(text, { parse_mode: 'HTML', ...getCategoriesKeyboard(lang) });
      } catch {
        await ctx.replyWithHTML(text, getCategoriesKeyboard(lang));
      }
    } else {
      await ctx.replyWithHTML(text, getCategoriesKeyboard(lang));
    }
  } catch (err) {
    logger.error('Error in showCategoriesMenu:', err.message);
  }
}

/**
 * Show Detailed Event Card with poster & action buttons
 */
async function showEventDetails(ctx, eventId, isCallback = true) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const event = storage.getEventById(eventId);
    if (!event) {
      if (isCallback && ctx.answerCbQuery) await ctx.answerCbQuery('Tadbir topilmadi!');
      return await ctx.replyWithHTML(t(lang, 'events_empty'));
    }

    const venue = storage.getVenueById(event.venue_id);
    const title = event[`title_${lang}`] || event.title_uz;
    const desc = event[`description_${lang}`] || event.description_uz;
    const venueName = venue ? (venue[`name_${lang}`] || venue.name_uz) : 'Saroy';
    const address = venue ? (venue[`address_${lang}`] || venue.address_uz) : 'Toshkent';

    const dateFormatted = formatDate(event.date, event.time, lang);
    const priceRange = `${formatUZS(event.min_price)} — ${formatUZS(event.max_price)}`;

    const text = t(lang, 'event_detail', {
      title,
      date: dateFormatted,
      venue: venueName,
      address,
      price_range: priceRange,
      description: desc
    });

    const keyboard = getEventDetailKeyboard(event.id, event.venue_id, lang);

    if (isCallback && ctx.callbackQuery) {
      await ctx.answerCbQuery();
    }

    // Attempt to send poster photo with caption
    if (event.banner_url) {
      try {
        await ctx.replyWithPhoto(event.banner_url, {
          caption: text,
          parse_mode: 'HTML',
          ...keyboard
        });
        return;
      } catch (photoErr) {
        logger.debug('Failed to send image, fallback to text:', photoErr.message);
      }
    }

    await ctx.replyWithHTML(text, keyboard);
  } catch (err) {
    logger.error('Error in showEventDetails:', err.message);
  }
}

module.exports = {
  showEventsList,
  showCategoriesMenu,
  showEventDetails
};
