/**
 * QR Code Generation Service
 */

const QRCode = require('qrcode');
const logger = require('../utils/logger');

/**
 * Generate QR code Buffer (PNG) from ticket data
 * @param {object} payload - ticket data
 * @returns {Promise<Buffer>} PNG image buffer
 */
async function generateQRCodeBuffer(payload) {
  try {
    const textData = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const buffer = await QRCode.toBuffer(textData, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
    return buffer;
  } catch (err) {
    logger.error('Failed to generate QR code buffer:', err.message);
    throw err;
  }
}

/**
 * Generate QR code Data URL (base64)
 * @param {object} payload
 * @returns {Promise<string>}
 */
async function generateQRCodeDataUrl(payload) {
  try {
    const textData = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return await QRCode.toDataURL(textData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    logger.error('Failed to generate QR code DataURL:', err.message);
    throw err;
  }
}

module.exports = {
  generateQRCodeBuffer,
  generateQRCodeDataUrl
};
