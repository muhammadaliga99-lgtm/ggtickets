/**
 * My Tickets Handler: View Active Tickets, Re-download PDF, View QR, and Cancel Ticket
 */

const storage = require('../db/storage');
const { t } = require('../i18n');
const { formatUZS, formatDate } = require('../utils/formatter');
const { generateQRCodeBuffer } = require('../services/qrService');
const { generateTicketPDF } = require('../services/pdfService');
const { getTicketActionKeyboard } = require('../keyboards/eventKeyboards');
const logger = require('../utils/logger');

/**
 * Show list of user's purchased tickets
 */
async function showMyTickets(ctx) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const userTickets = storage.getTicketsByUser(ctx.from.id);
    const activeTickets = userTickets.filter(tkt => tkt.status === 'ACTIVE');

    if (activeTickets.length === 0) {
      return await ctx.replyWithHTML(t(lang, 'my_tickets_empty'));
    }

    await ctx.replyWithHTML(t(lang, 'my_tickets_title'));

    for (const ticket of activeTickets) {
      const event = storage.getEventById(ticket.event_id);
      const venue = storage.getVenueById(event?.venue_id);

      const title = event ? (event[`title_${lang}`] || event.title_uz) : 'Tadbir';
      const venueName = venue ? (venue[`name_${lang}`] || venue.name_uz) : 'Maydon';
      const dateFormatted = event ? formatDate(event.date, event.time, lang) : '-';

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

      await ctx.replyWithHTML(cardText, getTicketActionKeyboard(ticket.id, lang));
    }
  } catch (err) {
    logger.error('Error in showMyTickets:', err.message);
  }
}

/**
 * Re-send QR Code photo for ticket
 */
async function sendTicketQR(ctx, ticketId) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const ticket = storage.getTicketById(ticketId);
    if (!ticket) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Chipta topilmadi!');
      return;
    }

    const event = storage.getEventById(ticket.event_id);

    const qrPayload = {
      app: 'ggtickets',
      code: ticket.ticket_code,
      tid: ticket.id,
      eid: ticket.event_id,
      sec: ticket.sector_name,
      seat: ticket.seat_number
    };

    const qrBuffer = await generateQRCodeBuffer(qrPayload);

    if (ctx.answerCbQuery) await ctx.answerCbQuery();
    await ctx.replyWithPhoto(
      { source: qrBuffer },
      {
        caption: `📲 <b>Chipta QR-kodi:</b> <code>${ticket.ticket_code}</code>\n${event ? (event[`title_${lang}`] || event.title_uz) : ''}`,
        parse_mode: 'HTML'
      }
    );
  } catch (err) {
    logger.error('Error in sendTicketQR:', err.message);
  }
}

/**
 * Re-generate and send PDF document
 */
async function sendTicketPDF(ctx, ticketId) {
  try {
    const user = storage.getUser(ctx.from.id);

    const ticket = storage.getTicketById(ticketId);
    if (!ticket) {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Chipta topilmadi!');
      return;
    }

    const event = storage.getEventById(ticket.event_id);
    const venue = storage.getVenueById(event?.venue_id);

    if (ctx.answerCbQuery) await ctx.answerCbQuery('PDF tayyorlanmoqda...');

    const pdfBuffer = await generateTicketPDF(ticket, event, venue, user);

    await ctx.replyWithDocument(
      {
        source: pdfBuffer,
        filename: `ggticket_${ticket.ticket_code}.pdf`
      },
      {
        caption: `📄 <b>Elektron chipta PDF:</b> <code>${ticket.ticket_code}</code>`,
        parse_mode: 'HTML'
      }
    );
  } catch (err) {
    logger.error('Error in sendTicketPDF:', err.message);
  }
}

/**
 * Cancel Ticket
 */
async function cancelTicket(ctx, ticketId) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const ticket = storage.getTicketById(ticketId);
    if (!ticket || ticket.status !== 'ACTIVE') {
      if (ctx.answerCbQuery) await ctx.answerCbQuery('Chiptani bekor qilib bo\'lmaydi!');
      return;
    }

    ticket.status = 'CANCELLED';
    ticket.cancelled_at = new Date().toISOString();
    storage.saveTicket(ticket);

    // Restore 1 seat to the event sector
    storage.restoreSectorSeats(ticket.event_id, ticket.sector_name, 1);

    if (ctx.answerCbQuery) await ctx.answerCbQuery(t(lang, 'ticket_cancelled_success'));
    await ctx.replyWithHTML(t(lang, 'ticket_cancelled_success'));
  } catch (err) {
    logger.error('Error in cancelTicket:', err.message);
  }
}

/**
 * Show Ticket by Code (for deep linking or search)
 */
async function showTicketByCode(ctx, code) {
  try {
    const user = storage.getUser(ctx.from.id);
    const lang = user?.language || 'uz';

    const ticket = storage.getTicketByCode(code);
    if (!ticket) {
      return await ctx.replyWithHTML(t(lang, 'admin_ticket_not_found'));
    }

    const event = storage.getEventById(ticket.event_id);
    const venue = storage.getVenueById(event?.venue_id);

    const title = event ? (event[`title_${lang}`] || event.title_uz) : 'Tadbir';
    const venueName = venue ? (venue[`name_${lang}`] || venue.name_uz) : 'Maydon';
    const dateFormatted = event ? formatDate(event.date, event.time, lang) : '-';

    const statusMap = {
      ACTIVE: t(lang, 'ticket_status_active'),
      USED: t(lang, 'ticket_status_used'),
      CANCELLED: t(lang, 'ticket_status_cancelled')
    };

    const cardText = t(lang, 'ticket_item_card', {
      code: ticket.ticket_code,
      title,
      date: dateFormatted,
      venue: venueName,
      sector: ticket.sector_name,
      seat: ticket.seat_number,
      price: formatUZS(ticket.price),
      status: statusMap[ticket.status] || ticket.status
    });

    await ctx.replyWithHTML(cardText, getTicketActionKeyboard(ticket.id, lang));
  } catch (err) {
    logger.error('Error in showTicketByCode:', err.message);
  }
}

module.exports = {
  showMyTickets,
  sendTicketQR,
  sendTicketPDF,
  cancelTicket,
  showTicketByCode
};
