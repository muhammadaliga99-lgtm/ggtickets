/**
 * Professional PDF E-Ticket Generator using PDFKit
 */

const PDFDocument = require('pdfkit');
const { generateQRCodeBuffer } = require('./qrService');
const { formatUZS, formatDate } = require('../utils/formatter');
const logger = require('../utils/logger');

/**
 * Generate PDF E-Ticket Buffer
 * @param {object} ticket
 * @param {object} event
 * @param {object} venue
 * @param {object} user
 * @returns {Promise<Buffer>}
 */
async function generateTicketPDF(ticket, event, venue, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A5',
        layout: 'landscape', // 595.28 x 419.53
        margins: { top: 25, bottom: 25, left: 30, right: 30 }
      });

      const buffers = [];
      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', err => reject(err));

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // 1. Background styling
      doc.rect(0, 0, pageWidth, pageHeight).fill('#F8FAFC');

      // Decorative top bar (Gradient style purple / indigo)
      doc.rect(0, 0, pageWidth, 8).fill('#4F46E5');

      // 2. White ticket card with rounded corners
      const cardX = 25;
      const cardY = 25;
      const cardW = pageWidth - 50;
      const cardH = pageHeight - 50;

      doc.roundedRect(cardX, cardY, cardW, cardH, 8)
        .fill('#FFFFFF')
        .strokeColor('#E2E8F0')
        .lineWidth(1)
        .stroke();

      // 3. Header Section
      // Brand Logo / Title
      doc.fillColor('#4F46E5')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('ggtickets', cardX + 20, cardY + 18);

      doc.fillColor('#64748B')
        .fontSize(9)
        .font('Helvetica')
        .text('OFFICIAL ELECTRONIC ENTRY PASS (iTicket Edition)', cardX + 115, cardY + 26);

      // Ticket Code Badge (Top Right)
      const badgeX = cardX + cardW - 140;
      const badgeY = cardY + 15;
      doc.roundedRect(badgeX, badgeY, 120, 26, 4)
        .fill('#EEF2FF');

      doc.fillColor('#4F46E5')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(ticket.ticket_code || 'GG-TICKET', badgeX, badgeY + 7, {
          width: 120,
          align: 'center'
        });

      // Divider line
      doc.moveTo(cardX + 20, cardY + 52)
        .lineTo(cardX + cardW - 20, cardY + 52)
        .strokeColor('#F1F5F9')
        .lineWidth(1.5)
        .stroke();

      // 4. Event Title
      const eventTitle = (event && (event.title_uz || event.title_ru || event.title_en)) || 'Special Cultural Event';
      doc.fillColor('#0F172A')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(eventTitle, cardX + 20, cardY + 65, {
          width: cardW - 190,
          ellipsis: true
        });

      // 5. Left Info Column (Event Details)
      const colX = cardX + 20;
      let curY = cardY + 105;

      const infoRow = (label, value) => {
        doc.fillColor('#64748B')
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(label.toUpperCase(), colX, curY);

        doc.fillColor('#1E293B')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(value || '-', colX, curY + 11, { width: cardW - 210 });

        curY += 32;
      };

      const dateStr = formatDate(event.date, event.time, 'uz');
      infoRow('Sana va Vaqt / Date & Time', dateStr);

      const venueName = (venue && (venue.name_uz || venue.name_en)) || 'Toshkent Konsert Saroyi';
      infoRow('Maydon / Venue', `${venueName} (${(venue && venue.city) || 'Toshkent'})`);

      const sectorStr = `${ticket.sector_name || 'Standard'}   |   O'rin / Seat: #${ticket.seat_number || 1}`;
      infoRow('Sektor va O\'rin / Sector & Seat', sectorStr);

      const buyerName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || `@${user.username || 'user'}` : 'Hurmatli Mehmon';
      infoRow('Chipta Egasi / Attendee', buyerName);

      // 6. Right Column (QR Code & Verification)
      const qrBoxX = cardX + cardW - 150;
      const qrBoxY = cardY + 65;

      try {
        const qrPayload = {
          app: 'ggtickets',
          code: ticket.ticket_code,
          tid: ticket.id,
          eid: event.id,
          sec: ticket.sector_name,
          seat: ticket.seat_number
        };
        const qrBuffer = await generateQRCodeBuffer(qrPayload);
        doc.image(qrBuffer, qrBoxX, qrBoxY, { width: 130, height: 130 });
      } catch (err) {
        logger.error('Error drawing QR code on PDF:', err.message);
      }

      // QR label
      doc.fillColor('#64748B')
        .fontSize(8)
        .font('Helvetica')
        .text('Kirishda skaner qiling', qrBoxX, qrBoxY + 134, { width: 130, align: 'center' });

      // Price Tag Box
      const priceBoxY = cardY + cardH - 65;
      doc.roundedRect(colX, priceBoxY, 150, 32, 4)
        .fill('#F8FAFC')
        .strokeColor('#E2E8F0')
        .stroke();

      doc.fillColor('#64748B')
        .fontSize(8)
        .font('Helvetica')
        .text('To\'langan summa / Price:', colX + 10, priceBoxY + 5);

      doc.fillColor('#10B981')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(formatUZS(ticket.price), colX + 10, priceBoxY + 16);

      // Status indicator
      const statusX = colX + 165;
      doc.roundedRect(statusX, priceBoxY, 120, 32, 4)
        .fill('#ECFDF5');

      doc.fillColor('#059669')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('● VERIFIED ACTIVE', statusX, priceBoxY + 11, { width: 120, align: 'center' });

      // Security footer disclaimer
      doc.fillColor('#94A3B8')
        .fontSize(7)
        .font('Helvetica')
        .text(
          'Elektron chipta faqat bir martalik kirish uchun amal qiladi. Qayta nusxalash va begonalarga uzatish taqiqlanadi. iticket.uz / ggtickets 2026',
          cardX + 20,
          cardY + cardH - 18,
          { width: cardW - 40, align: 'center' }
        );

      doc.end();
    } catch (err) {
      logger.error('Failed to generate ticket PDF:', err.message);
      reject(err);
    }
  });
}

module.exports = {
  generateTicketPDF
};
