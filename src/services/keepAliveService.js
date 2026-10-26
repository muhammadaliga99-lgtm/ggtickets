/**
 * Keep-Alive Service for Render 24/7 Uptime
 * Pings the application's external URL every 10 minutes so Render free dyno does not sleep.
 */

const cron = require('node-cron');
const logger = require('../utils/logger');
const { KEEP_ALIVE, RENDER_EXTERNAL_URL, PORT } = require('../config/env');

let cronJob = null;

function startKeepAlive() {
  if (!KEEP_ALIVE) {
    logger.info('Keep-alive service is disabled via KEEP_ALIVE=false');
    return;
  }

  // Target ping URL: external URL if available, or local loopback
  const pingUrl = RENDER_EXTERNAL_URL
    ? `${RENDER_EXTERNAL_URL.replace(/\/$/, '')}/health`
    : `http://localhost:${PORT}/health`;

  logger.info(`Starting Keep-Alive service. Target URL: ${pingUrl}`);

  // Ping every 10 minutes (*/10 * * * *)
  cronJob = cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'ggtickets-keepalive/1.0' }
      });
      if (response.ok) {
        logger.debug(`[Keep-Alive] Pinged ${pingUrl} successfully: Status ${response.status}`);
      } else {
        logger.warn(`[Keep-Alive] Ping returned status ${response.status}`);
      }
    } catch (err) {
      // Don't spam error logs if local server is restarting
      logger.debug(`[Keep-Alive] Ping notice: ${err.message}`);
    }
  });

  return cronJob;
}

function stopKeepAlive() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    logger.info('Keep-alive service stopped.');
  }
}

module.exports = {
  startKeepAlive,
  stopKeepAlive
};
