/**
 * String and currency formatters
 */

function formatUZS(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 so\'m';
  const num = Math.round(Number(amount));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so\'m';
}

function formatDate(dateStr, timeStr = '', lang = 'uz') {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return `${dateStr} ${timeStr}`.trim();

    const months = {
      uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
      ru: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    const selectedMonths = months[lang] || months.uz;
    const day = d.getDate();
    const month = selectedMonths[d.getMonth()];
    const year = d.getFullYear();

    let formatted = `${day}-${month}, ${year}`;
    if (timeStr) {
      formatted += ` | ⏰ ${timeStr}`;
    }
    return formatted;
  } catch {
    return `${dateStr} ${timeStr}`.trim();
  }
}

function generateTicketCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GG-${randomPart}`;
}

function generateOrderNumber() {
  const ts = Date.now().toString().slice(-6);
  const rand = Math.floor(100 + Math.random() * 900);
  return `ORD-${ts}-${rand}`;
}

module.exports = {
  formatUZS,
  formatDate,
  generateTicketCode,
  generateOrderNumber
};
