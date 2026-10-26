/**
 * Application Constants
 */

const CATEGORIES = {
  concerts: {
    id: 'concerts',
    name_uz: 'Konsertlar',
    name_ru: 'Концерты',
    name_en: 'Concerts',
    icon: '🎵'
  },
  theater: {
    id: 'theater',
    name_uz: 'Teatr & Spektakl',
    name_ru: 'Театр & Спектакли',
    name_en: 'Theater & Plays',
    icon: '🎭'
  },
  sports: {
    id: 'sports',
    name_uz: 'Sport & Futbol',
    name_ru: 'Спорт & Футбол',
    name_en: 'Sports & Football',
    icon: '⚽'
  },
  kids: {
    id: 'kids',
    name_uz: 'Bolalar & Sirk',
    name_ru: 'Детям & Цирк',
    name_en: 'Kids & Circus',
    icon: '🎪'
  },
  culture: {
    id: 'culture',
    name_uz: 'Madaniyat & Muzey',
    name_ru: 'Культура & Музеи',
    name_en: 'Culture & Museums',
    icon: '🏛️'
  },
  festivals: {
    id: 'festivals',
    name_uz: 'Shou & Festivallar',
    name_ru: 'Шоу & Фестивали',
    name_en: 'Shows & Festivals',
    icon: '🎡'
  }
};

const TICKET_STATUSES = {
  ACTIVE: 'ACTIVE',
  USED: 'USED',
  CANCELLED: 'CANCELLED'
};

const ORDER_STATUSES = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

const PAYMENT_METHODS = {
  CLICK: { id: 'click', name: 'Click Up', icon: '🔹' },
  PAYME: { id: 'payme', name: 'Payme', icon: '🟢' },
  UZUM: { id: 'uzum', name: 'Uzum Bank', icon: '🍇' },
  DEMO: { id: 'demo', name: 'Tezkor Sinov To\'lovi (Demo)', icon: '⚡' }
};

const LANGUAGES = {
  uz: { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
  ru: { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  en: { code: 'en', name: 'English', flag: '🇬🇧' }
};

const DEFAULT_LANG = 'uz';
const ITEMS_PER_PAGE = 4;

module.exports = {
  CATEGORIES,
  TICKET_STATUSES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  LANGUAGES,
  DEFAULT_LANG,
  ITEMS_PER_PAGE
};
