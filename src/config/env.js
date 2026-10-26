/**
 * Environment configuration and validation
 */

const dotenv = require('dotenv');
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || '8740667959:AAGYYIfOlQRXdCf3RVtpQbqhhgmvB9rmfhg';
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'production';
const WEBHOOK_URL = process.env.WEBHOOK_URL || process.env.RENDER_EXTERNAL_URL || '';
const KEEP_ALIVE = process.env.KEEP_ALIVE !== 'false';
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || process.env.WEBHOOK_URL || '';

// Parse admin IDs from comma separated list
const adminIdsRaw = process.env.ADMIN_IDS || '';
const ADMIN_IDS = adminIdsRaw
  .split(',')
  .map(id => id.trim())
  .filter(Boolean)
  .map(id => parseInt(id, 10))
  .filter(id => !isNaN(id));

if (!BOT_TOKEN) {
  console.error('[FATAL] BOT_TOKEN is required. Please check your .env file.');
  process.exit(1);
}

module.exports = {
  BOT_TOKEN,
  PORT,
  NODE_ENV,
  WEBHOOK_URL,
  KEEP_ALIVE,
  RENDER_EXTERNAL_URL,
  ADMIN_IDS,
  isAdmin: (userId) => {
    if (!userId) return false;
    const numId = Number(userId);
    // If no admin IDs are configured in env, allow the first user or check DB
    return ADMIN_IDS.includes(numId);
  }
};
