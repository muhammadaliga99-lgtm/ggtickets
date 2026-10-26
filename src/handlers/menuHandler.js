/**
 * Main Menu Router: handles Reply Keyboard button clicks across all languages
 */

const { showEventsList, showCategoriesMenu } = require('./eventHandler');
const { showMyTickets } = require('./myTicketsHandler');
const { showVenuesList } = require('./venuesHandler');
const { promptSearch } = require('./searchHandler');
const { showLanguagePrompt } = require('./startHandler');
const { showAdminPanel } = require('./adminHandler');
const storage = require('../db/storage');
const { t } = require('../i18n');
const logger = require('../utils/logger');

async function handleMenuAction(ctx, text) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    // 1. Events
    if (text.includes('Barcha tadbirlar') || text.includes('Все события') || text.includes('All Events')) {
      return await showEventsList(ctx, 1);
    }

    // 2. Categories
    if (text.includes('Bo\'limlar') || text.includes('Категории') || text.includes('Categories')) {
      return await showCategoriesMenu(ctx);
    }

    // 3. Search
    if (text.includes('Qidiruv') || text.includes('Поиск') || text.includes('Search')) {
      return await promptSearch(ctx);
    }

    // 4. My Tickets
    if (text.includes('Mening chiptalarim') || text.includes('Мои билеты') || text.includes('My Tickets')) {
      return await showMyTickets(ctx);
    }

    // 5. Venues
    if (text.includes('Maydonlar') || text.includes('Площадки') || text.includes('Venues')) {
      return await showVenuesList(ctx);
    }

    // 6. Help / FAQ
    if (text.includes('Yordam') || text.includes('Помощь') || text.includes('Help')) {
      return await ctx.replyWithHTML(t(lang, 'help_text'));
    }

    // 7. Language
    if (text.includes('Til') || text.includes('Язык') || text.includes('Language')) {
      return await showLanguagePrompt(ctx);
    }

    // 8. Admin Panel
    if (text.includes('Admin Panel') || text.includes('Админ панель')) {
      return await showAdminPanel(ctx);
    }

    return false;
  } catch (err) {
    logger.error('Error in handleMenuAction:', err.message);
    return false;
  }
}

module.exports = {
  handleMenuAction
};
