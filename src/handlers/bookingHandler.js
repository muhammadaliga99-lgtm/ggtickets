/**
 * Ticket Booking, Sector Selection, Quantity Stepper, and Checkout Flow
 */

const storage = require('../db/storage');
const { t } = require('../i18n');
const { formatUZS, formatDate, generateOrderNumber } = require('../utils/formatter');
const {
  getSectorSelectionKeyboard,
  getQuantityKeyboard,
  getPaymentKeyboard
} = require('../keyboards/eventKeyboards');
const sessionManager = require('../utils/sessionManager');
const logger = require('../utils/logger');

/**
 * Step 1: Show sector selection for an event
 */
async function handleSectorSelection(ctx, eventId) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const event = storage.getEventById(eventId);
    if (!event) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Tadbir topilmadi!');
      return;
    }

    const title = event[`title_${lang}`] || event.title_uz;
    const text = t(lang, 'select_sector', { title });
    const keyboard = getSectorSelectionKeyboard(event, lang);

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
      await ctx.replyWithHTML(text, keyboard);
    } else {
      await ctx.replyWithHTML(text, keyboard);
    }
  } catch (err) {
    logger.error('Error in handleSectorSelection:', err.message);
  }
}

/**
 * Step 2: Show quantity selection with counter
 */
async function handleQuantitySelection(ctx, eventId, sectorIndex, delta = 0) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const event = storage.getEventById(eventId);
    if (!event || !event.sectors || !event.sectors[sectorIndex]) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Sektor topilmadi!');
      return;
    }

    const sector = event.sectors[sectorIndex];
    if (sector.available_seats <= 0) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery(t(lang, 'sector_full'), { show_alert: true });
      return;
    }

    // Get current session or init
    const session = sessionManager.get(ctx.from.id);
    let currentQty = (session.quantity || 1) + delta;

    // Bounds: 1 <= qty <= Math.min(sector.available_seats, 10)
    const maxQty = Math.min(sector.available_seats, 10);
    if (currentQty < 1) currentQty = 1;
    if (currentQty > maxQty) currentQty = maxQty;

    sessionManager.set(ctx.from.id, {
      eventId,
      sectorIndex,
      quantity: currentQty
    });

    const totalBeforePromo = sector.price * currentQty;
    let discount = 0;

    if (session.promoCode) {
      const promo = storage.getPromo(session.promoCode);
      if (promo) {
        if (promo.discount_percent > 0) {
          discount = Math.round((totalBeforePromo * promo.discount_percent) / 100);
        } else if (promo.discount_uzs > 0) {
          discount = promo.discount_uzs;
        }
      }
    }

    const finalTotal = Math.max(0, totalBeforePromo - discount);

    const title = event[`title_${lang}`] || event.title_uz;
    const text = t(lang, 'select_quantity', {
      title,
      sector: sector.name,
      price: formatUZS(sector.price),
      count: currentQty,
      total: formatUZS(finalTotal)
    });

    const keyboard = getQuantityKeyboard(
      eventId,
      sectorIndex,
      currentQty,
      lang,
      Boolean(session.promoCode)
    );

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
      try {
        await ctx.editMessageText(text, { parse_mode: 'HTML', ...keyboard });
      } catch {
        await ctx.replyWithHTML(text, keyboard);
      }
    } else {
      await ctx.replyWithHTML(text, keyboard);
    }
  } catch (err) {
    logger.error('Error in handleQuantitySelection:', err.message);
  }
}

/**
 * Step 3: Prompt for promo code
 */
async function promptPromoCode(ctx, eventId, sectorIndex) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    sessionManager.set(ctx.from.id, {
      step: 'awaiting_promo_code',
      eventId,
      sectorIndex
    });

    if (ctx.callbackQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(t(lang, 'promo_prompt'));
  } catch (err) {
    logger.error('Error in promptPromoCode:', err.message);
  }
}

/**
 * Handle promo code text submission
 */
async function processPromoCodeInput(ctx, promoText) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';
    const session = sessionManager.get(ctx.from.id);

    const promo = storage.getPromo(promoText);
    if (!promo) {
      sessionManager.clearStep(ctx.from.id);
      await ctx.replyWithHTML(t(lang, 'promo_invalid'));
      return await handleQuantitySelection(ctx, session.eventId, session.sectorIndex, 0);
    }

    sessionManager.set(ctx.from.id, {
      promoCode: promo.code,
      step: null
    });

    const discountStr = promo.discount_percent > 0 ? `${promo.discount_percent}%` : formatUZS(promo.discount_uzs);
    await ctx.replyWithHTML(t(lang, 'promo_success', { discount: discountStr }));

    await handleQuantitySelection(ctx, session.eventId, session.sectorIndex, 0);
  } catch (err) {
    logger.error('Error in processPromoCodeInput:', err.message);
  }
}

/**
 * Step 4: Checkout - Summary and Payment Options
 */
async function handleCheckout(ctx, eventId, sectorIndex) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const event = storage.getEventById(eventId);
    const sector = event?.sectors?.[sectorIndex];

    if (!event || !sector) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Xatolik yuz berdi!');
      return;
    }

    const session = sessionManager.get(ctx.from.id);
    const quantity = session.quantity || 1;

    // Check availability
    if (sector.available_seats < quantity) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery(t(lang, 'sector_full'), { show_alert: true });
      return;
    }

    const totalBeforeDiscount = sector.price * quantity;
    let discount = 0;

    if (session.promoCode) {
      const promo = storage.getPromo(session.promoCode);
      if (promo) {
        if (promo.discount_percent > 0) {
          discount = Math.round((totalBeforeDiscount * promo.discount_percent) / 100);
        } else if (promo.discount_uzs > 0) {
          discount = promo.discount_uzs;
        }
      }
    }

    const finalAmount = Math.max(0, totalBeforeDiscount - discount);
    const venue = storage.getVenueById(event.venue_id);

    // Create Order Record in DB
    const order = storage.saveOrder({
      id: `ord_${Date.now()}`,
      order_number: generateOrderNumber(),
      user_id: ctx.from.id,
      event_id: event.id,
      sector_name: sector.name,
      quantity,
      unit_price: sector.price,
      total_amount: finalAmount,
      discount_amount: discount,
      promo_code: session.promoCode || null,
      status: 'PENDING',
      created_at: new Date().toISOString()
    });

    const title = event[`title_${lang}`] || event.title_uz;
    const venueName = venue ? (venue[`name_${lang}`] || venue.name_uz) : 'Toshkent Saroyi';
    const dateFormatted = formatDate(event.date, event.time, lang);

    const text = t(lang, 'checkout_title', {
      title,
      date: dateFormatted,
      venue: venueName,
      sector: sector.name,
      quantity,
      unit_price: formatUZS(sector.price),
      discount: discount > 0 ? formatUZS(discount) : '0 so\'m',
      total_amount: formatUZS(finalAmount)
    });

    const keyboard = getPaymentKeyboard(order.id, lang);

    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
      await ctx.replyWithHTML(text, keyboard);
    } else {
      await ctx.replyWithHTML(text, keyboard);
    }
  } catch (err) {
    logger.error('Error in handleCheckout:', err.message);
  }
}

module.exports = {
  handleSectorSelection,
  handleQuantitySelection,
  promptPromoCode,
  processPromoCodeInput,
  handleCheckout
};
