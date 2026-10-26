/**
 * Internationalization (i18n) Manager
 */

const uz = require('./uz');
const ru = require('./ru');
const en = require('./en');
const { DEFAULT_LANG } = require('../config/constants');

const dictionaries = { uz, ru, en };

/**
 * Translate a key into target language with parameter replacement
 * @param {string} lang - 'uz' | 'ru' | 'en'
 * @param {string} key - translation key
 * @param {object} params - interpolation parameters { param: 'value' }
 * @returns {string} translated text
 */
function t(lang = DEFAULT_LANG, key, params = {}) {
  const selectedLang = dictionaries[lang] ? lang : DEFAULT_LANG;
  let text = dictionaries[selectedLang][key];

  // Fallback to default language if key missing
  if (text === undefined) {
    text = dictionaries[DEFAULT_LANG][key] || key;
  }

  // Replace params {key}
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(param => {
      const reg = new RegExp(`{${param}}`, 'g');
      text = text.replace(reg, params[param] !== undefined ? params[param] : '');
    });
  }

  return text;
}

module.exports = {
  t,
  dictionaries
};
