/**
 * Admin Panel Keyboards
 */

const { Markup } = require('telegraf');
const { t } = require('../i18n');

function getAdminMenuKeyboard(lang = 'uz') {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(t(lang, 'btn_admin_stats'), 'admin_stats'),
      Markup.button.callback(t(lang, 'btn_admin_scanner'), 'admin_scanner')
    ],
    [
      Markup.button.callback(t(lang, 'btn_admin_events'), 'admin_events'),
      Markup.button.callback(t(lang, 'btn_admin_add_event'), 'admin_add_event')
    ],
    [
      Markup.button.callback(t(lang, 'btn_admin_broadcast'), 'admin_broadcast'),
      Markup.button.callback(t(lang, 'btn_admin_promos'), 'admin_promos')
    ],
    [Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')]
  ]);
}

function getAdminBackKeyboard(lang = 'uz') {
  return Markup.inlineKeyboard([
    [Markup.button.callback(`⬅️ Admin Menyusi`, 'admin_menu')]
  ]);
}

module.exports = {
  getAdminMenuKeyboard,
  getAdminBackKeyboard
};
