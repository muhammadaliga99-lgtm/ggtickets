/**
 * Keyboards for Event Listing, Details, Sector Selection, Quantity, and Checkout
 */

const { Markup } = require('telegraf');
const { t } = require('../i18n');
const { formatUZS } = require('../utils/formatter');
const { PAYMENT_METHODS } = require('../config/constants');

/**
 * Event List Keyboard with pagination and event buttons
 */
function getEventListKeyboard(events, page, totalPages, lang = 'uz', category = '') {
  const buttons = [];

  events.forEach(evt => {
    const title = evt[`title_${lang}`] || evt.title_uz;
    const shortTitle = title.length > 34 ? `${title.substring(0, 31)}...` : title;
    buttons.push([Markup.button.callback(`🎟 ${shortTitle}`, `view_evt_${evt.id}`)]);
  });

  // Pagination navigation row
  const navRow = [];
  if (page > 1) {
    navRow.push(Markup.button.callback(t(lang, 'btn_prev'), `page_${page - 1}_${category}`));
  }
  navRow.push(Markup.button.callback(`📄 ${page}/${totalPages || 1}`, 'noop'));
  if (page < totalPages) {
    navRow.push(Markup.button.callback(t(lang, 'btn_next'), `page_${page + 1}_${category}`));
  }
  buttons.push(navRow);

  // Return to categories / main menu
  buttons.push([
    Markup.button.callback(`📂 ${t(lang, 'menu_categories')}`, 'nav_categories'),
    Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')
  ]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Single Event Details Keyboard
 */
function getEventDetailKeyboard(eventId, venueId, lang = 'uz') {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_buy_ticket'), `book_evt_${eventId}`)],
    [
      Markup.button.callback(t(lang, 'btn_venue_info'), `venue_${venueId}`),
      Markup.button.callback(t(lang, 'btn_back'), 'nav_events')
    ],
    [Markup.button.callback(`🏠 ${t(lang, 'btn_main_menu')}`, 'nav_main_menu')]
  ]);
}

/**
 * Sector / Tier Selection Keyboard
 */
function getSectorSelectionKeyboard(event, lang = 'uz') {
  const buttons = [];

  if (event.sectors && event.sectors.length > 0) {
    event.sectors.forEach((sec, idx) => {
      const isSoldOut = sec.available_seats <= 0;
      const label = isSoldOut
        ? `❌ ${sec.name} (Tugagan / Sold out)`
        : `🎟 ${sec.name} — ${formatUZS(sec.price)} (${sec.available_seats} ta)`;

      const callback = isSoldOut ? 'sector_soldout' : `select_sec_${event.id}_${idx}`;
      buttons.push([Markup.button.callback(label, callback)]);
    });
  }

  buttons.push([Markup.button.callback(t(lang, 'btn_back'), `view_evt_${event.id}`)]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Quantity Stepper Keyboard
 */
function getQuantityKeyboard(eventId, sectorIndex, count, lang = 'uz', hasPromo = false) {
  const buttons = [
    [
      Markup.button.callback('➖', `qty_dec_${eventId}_${sectorIndex}`),
      Markup.button.callback(`🔢 ${count} ta`, 'noop'),
      Markup.button.callback('➕', `qty_inc_${eventId}_${sectorIndex}`)
    ],
    [
      Markup.button.callback(
        hasPromo ? '✅ Promokod faol' : t(lang, 'btn_promo'),
        hasPromo ? 'noop' : `enter_promo_${eventId}_${sectorIndex}`
      )
    ],
    [
      Markup.button.callback(
        t(lang, 'btn_confirm_qty', { count }),
        `checkout_${eventId}_${sectorIndex}`
      )
    ],
    [Markup.button.callback(t(lang, 'btn_back'), `book_evt_${eventId}`)]
  ];

  return Markup.inlineKeyboard(buttons);
}

/**
 * Payment Methods Keyboard
 */
function getPaymentKeyboard(orderId, lang = 'uz') {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(`🔹 ${PAYMENT_METHODS.CLICK.name}`, `pay_click_${orderId}`),
      Markup.button.callback(`🟢 ${PAYMENT_METHODS.PAYME.name}`, `pay_payme_${orderId}`)
    ],
    [
      Markup.button.callback(`🍇 ${PAYMENT_METHODS.UZUM.name}`, `pay_uzum_${orderId}`),
      Markup.button.callback(`⚡ ${PAYMENT_METHODS.DEMO.name}`, `pay_demo_${orderId}`)
    ],
    [Markup.button.callback(`❌ ${t(lang, 'action_cancelled')}`, `cancel_order_${orderId}`)]
  ]);
}

/**
 * My Tickets item action keyboard
 */
function getTicketActionKeyboard(ticketId, lang = 'uz') {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_download_pdf'), `ticket_pdf_${ticketId}`)],
    [Markup.button.callback(t(lang, 'btn_show_qr'), `ticket_qr_${ticketId}`)],
    [Markup.button.callback(t(lang, 'btn_cancel_ticket'), `ticket_cancel_${ticketId}`)]
  ]);
}

module.exports = {
  getEventListKeyboard,
  getEventDetailKeyboard,
  getSectorSelectionKeyboard,
  getQuantityKeyboard,
  getPaymentKeyboard,
  getTicketActionKeyboard
};
