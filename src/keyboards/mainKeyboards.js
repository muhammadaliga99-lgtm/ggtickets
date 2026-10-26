/**
 * Main navigation keyboards
 */

const { Markup } = require('telegraf');
const { t } = require('../i18n');
const { CATEGORIES, LANGUAGES } = require('../config/constants');
const { isAdmin } = require('../config/env');

/**
 * Generate Main Reply Keyboard
 * @param {string} lang
 * @param {number|string} userId
 */
function getMainKeyboard(lang = 'uz', userId = null) {
  const isUserAdmin = isAdmin(userId);

  const rows = [
    [t(lang, 'menu_events'), t(lang, 'menu_categories')],
    [t(lang, 'menu_my_tickets'), t(lang, 'menu_search')],
    [t(lang, 'menu_venues'), t(lang, 'menu_help')]
  ];

  const bottomRow = [t(lang, 'menu_lang')];
  if (isUserAdmin) {
    bottomRow.push(t(lang, 'menu_admin'));
  }
  rows.push(bottomRow);

  return Markup.keyboard(rows).resize();
}

/**
 * Language Selection Inline Keyboard
 */
function getLanguageInlineKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(`${LANGUAGES.uz.flag} ${LANGUAGES.uz.name}`, 'lang_uz'),
      Markup.button.callback(`${LANGUAGES.ru.flag} ${LANGUAGES.ru.name}`, 'lang_ru'),
      Markup.button.callback(`${LANGUAGES.en.flag} ${LANGUAGES.en.name}`, 'lang_en')
    ]
  ]);
}

/**
 * Categories Selection Inline Keyboard
 * @param {string} lang
 */
function getCategoriesKeyboard(lang = 'uz') {
  const catList = Object.values(CATEGORIES);
  const buttons = [];

  for (let i = 0; i < catList.length; i += 2) {
    const row = [];
    const cat1 = catList[i];
    row.push(Markup.button.callback(`${cat1.icon} ${cat1[`name_${lang}`] || cat1.name_uz}`, `cat_${cat1.id}`));

    if (catList[i + 1]) {
      const cat2 = catList[i + 1];
      row.push(Markup.button.callback(`${cat2.icon} ${cat2[`name_${lang}`] || cat2.name_uz}`, `cat_${cat2.id}`));
    }
    buttons.push(row);
  }

  buttons.push([Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')]);

  return Markup.inlineKeyboard(buttons);
}

module.exports = {
  getMainKeyboard,
  getLanguageInlineKeyboard,
  getCategoriesKeyboard
};
