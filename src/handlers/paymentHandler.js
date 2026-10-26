/**
 * Payment Execution & Ticket Issuance Handler
 */

const storage = require('../db/storage');
const { t } = require('../i18n');
const { generateTicketCode, formatUZS, formatDate } = require('../utils/formatter');
const { generateQRCodeBuffer } = require('../services/qrService');
const { generateTicketPDF } = require('../services/pdfService');
const { getTicketActionKeyboard } = require('../keyboards/eventKeyboards');
const sessionManager = require('../utils/sessionManager');
const logger = require('../utils/logger');

/**
 * Process payment callback (Click, Payme, Uzum, Demo)
 */
async function processPayment(ctx, orderId, method) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const order = storage.getOrderById(orderId);
    if (!order || order.status !== 'PENDING') {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Buyurtma topilmadi yoki to\'langan!');
      return;
    }

    const event = storage.getEventById(order.event_id);
    const venue = storage.getVenueById(event?.venue_id);

    if (!event) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Tadbir topilmadi!');
      return;
    }

    // Book seats in database
    const booked = storage.bookSectorSeats(order.event_id, order.sector_name, order.quantity);
    if (!booked) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery(t(lang, 'sector_full'), { show_alert: true });
      return;
    }

    if (ctx.answerCbQuery) {
      await ctx.answerCbQuery(t(lang, 'payment_processing'));
    }

    // Update order status
    order.status = 'COMPLETED';
    order.payment_method = method;
    order.paid_at = new Date().toISOString();

    const createdTicketIds = [];
    const generatedTickets = [];

    // Issue each ticket with unique code and seat
    for (let i = 0; i < order.quantity; i++) {
      const ticketCode = generateTicketCode();
      const seatNumber = Math.floor(10 + Math.random() * 80);

      const ticket = storage.saveTicket({
        id: `tkt_${Date.now()}_${i}`,
        ticket_code: ticketCode,
        order_id: order.id,
        user_id: ctx.from.id,
        event_id: event.id,
        sector_name: order.sector_name,
        seat_number: seatNumber,
        price: order.unit_price,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        used_at: null
      });

      createdTicketIds.push(ticket.id);
      generatedTickets.push(ticket);
    }

    order.ticket_ids = createdTicketIds;
    storage.saveOrder(order);
    sessionManager.clear(ctx.from.id);

    // Send Success Message
    await ctx.replyWithHTML(t(lang, 'payment_success'));

    // Send each ticket with QR code photo and PDF
    for (const ticket of generatedTickets) {
      const title = event[`title_${lang}`] || event.title_uz;
      const venueName = venue ? (venue[`name_${lang}`] || venue.name_uz) : 'Toshkent Saroyi';
      const dateFormatted = formatDate(event.date, event.time, lang);

      const cardText = t(lang, 'ticket_item_card', {
        code: ticket.ticket_code,
        title,
        date: dateFormatted,
        venue: venueName,
        sector: ticket.sector_name,
        seat: ticket.seat_number,
        price: formatUZS(ticket.price),
        status: t(lang, 'ticket_status_active')
      });

      // Generate QR Code Buffer
      const qrPayload = {
        app: 'ggtickets',
        code: ticket.ticket_code,
        tid: ticket.id,
        eid: event.id,
        sec: ticket.sector_name,
        seat: ticket.seat_number
      };

      const qrBuffer = await generateQRCodeBuffer(qrPayload);

      // Send QR Code Photo
      await ctx.replyWithPhoto(
        { source: qrBuffer },
        {
          caption: cardText,
          parse_mode: 'HTML',
          ...getTicketActionKeyboard(ticket.id, lang)
        }
      );

      // Generate & Send official PDF Ticket
      try {
        const pdfBuffer = await generateTicketPDF(ticket, event, venue, user);
        await ctx.replyWithDocument(
          {
            source: pdfBuffer,
            filename: `ggticket_${ticket.ticket_code}.pdf`
          },
          {
            caption: `📄 <b>Rasmiy E-Chipta PDF:</b> <code>${ticket.ticket_code}</code>`,
            parse_mode: 'HTML'
          }
        );
      } catch (pdfErr) {
        logger.error('Error sending PDF document:', pdfErr.message);
      }
    }
  } catch (err) {
    logger.error('Error in processPayment:', err.message);
  }
}

/**
 * Handle Order Cancellation
 */
async function cancelOrder(ctx, orderId) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const order = storage.getOrderById(orderId);
    if (order && order.status === 'PENDING') {
      order.status = 'CANCELLED';
      storage.saveOrder(order);
    }

    sessionManager.clear(ctx.from.id);

    if (ctx.answerCbQuery) await ctx.answerCbQuery();
    await ctx.replyWithHTML(t(lang, 'action_cancelled'));
  } catch (err) {
    logger.error('Error in cancelOrder:', err.message);
  }
}

module.exports = {
  processPayment,
  cancelOrder
};
