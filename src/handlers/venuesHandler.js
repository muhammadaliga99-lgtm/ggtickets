/**
 * Venues Directory Handler
 */

const { Markup } = require('telegraf');
const storage = require('../db/storage');
const { t } = require('../i18n');
const logger = require('../utils/logger');

/**
 * Show list of all venues
 */
async function showVenuesList(ctx) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const venues = storage.getVenues();
    if (venues.length === 0) {
      return await ctx.reply('Maydonlar ro\'yxati bo\'sh.');
    }

    const buttons = venues.map(v => {
      const name = v[`name_${lang}`] || v.name_uz;
      return [Markup.button.callback(`🏛️ ${name}`, `venue_${v.id}`)];
    });

    buttons.push([Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')]);

    await ctx.replyWithHTML(t(lang, 'venues_title'), Markup.inlineKeyboard(buttons));
  } catch (err) {
    logger.error('Error in showVenuesList:', err.message);
  }
}

/**
 * Show single venue details card
 */
async function showVenueDetails(ctx, venueId) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const venue = storage.getVenueById(venueId);
    if (!venue) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Maydon topilmadi!');
      return;
    }

    const name = venue[`name_${lang}`] || venue.name_uz;
    const address = venue[`address_${lang}`] || venue.address_uz;

    const text = t(lang, 'venue_detail', {
      name,
      address,
      city: venue.city || 'Toshkent',
      capacity: venue.capacity ? venue.capacity.toLocaleString() : '1 000+',
      phone: venue.phone || '+998 71 200 00 00',
      map_url: venue.map_url || 'https://maps.google.com'
    });

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(t(lang, 'btn_venue_events'), `events_at_venue_${venue.id}`)],
      [
        Markup.button.callback(t(lang, 'btn_back'), 'nav_venues'),
        Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')
      ]
    ]);

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
    }

    if (venue.image_url) {
      try {
        await ctx.replyWithPhoto(venue.image_url, {
          caption: text,
          parse_mode: 'HTML',
          ...keyboard
        });
        return;
      } catch (err) {
        logger.debug('Failed to send venue photo, fallback to text:', err.message);
      }
    }

    await ctx.replyWithHTML(text, keyboard);
  } catch (err) {
    logger.error('Error in showVenueDetails:', err.message);
  }
}

/**
 * Show events scheduled at a specific venue
 */
async function showEventsAtVenue(ctx, venueId) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const events = storage.getEvents({ venue_id: venueId, active_only: true });
    if (events.length === 0) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Ushbu maydonda yaqin orada tadbirlar yo\'q!');
      return await ctx.replyWithHTML(t(lang, 'events_empty'));
    }

    const buttons = events.map(e => {
      const title = e[`title_${lang}`] || e.title_uz;
      return [Markup.button.callback(`🎟 ${title}`, `view_evt_${e.id}`)];
    });

    buttons.push([
      Markup.button.callback(t(lang, 'btn_back'), `venue_${venueId}`),
      Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')
    ]);

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(t(lang, 'events_title'), Markup.inlineKeyboard(buttons));
  } catch (err) {
    logger.error('Error in showEventsAtVenue:', err.message);
  }
}

module.exports = {
  showVenuesList,
  showVenueDetails,
  showEventsAtVenue
};
