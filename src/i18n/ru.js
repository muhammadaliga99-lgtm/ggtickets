/**
 * Russian language dictionary
 */

module.exports = {
  welcome: "Здравствуйте, <b>{name}</b>!\n\n<b>ggtickets</b> — официальный бот для покупки билетов на крупнейшие культурные и спортивные события, концерты и театры Узбекистана!\n\nПокупайте билеты без очередей, быстро и безопасно! 🎟✨",
  select_language: "Пожалуйста, выберите удобный язык:\nIltimos, o'zingizga qulay tilni tanlang:\nPlease select your language:",
  language_changed: "Язык успешно изменен: <b>Русский 🇷🇺</b>",

  // Main menu buttons
  menu_events: "🎟 Все события",
  menu_categories: "📂 Категории",
  menu_search: "🔍 Поиск",
  menu_my_tickets: "🎫 Мои билеты",
  menu_venues: "🏛️ Площадки",
  menu_help: "ℹ️ Помощь & FAQ",
  menu_lang: "🌐 Язык (Til)",
  menu_admin: "⚙️ Админ панель",

  main_menu_title: "Главное меню. Выберите нужный раздел:",

  // Categories
  categories_title: "📂 <b>Выберите категорию мероприятий:</b>",
  cat_concerts: "🎵 Концерты",
  cat_theater: "🎭 Театр & Спектакли",
  cat_sports: "⚽ Спорт & Футбол",
  cat_kids: "🎪 Детям & Цирк",
  cat_culture: "🏛️ Культура & Музеи",
  cat_festivals: "🎡 Шоу & Фестивали",

  // Events
  events_title: "🎟 <b>Доступные мероприятия:</b>",
  events_empty: "В данной категории пока нет активных мероприятий.",
  event_detail: "🎭 <b>{title}</b>\n\n📅 <b>Дата:</b> {date}\n🏛️ <b>Площадка:</b> {venue}\n📍 <b>Адрес:</b> {address}\n💰 <b>Цены:</b> {price_range}\n\n📝 <b>О мероприятии:</b>\n{description}",
  btn_buy_ticket: "🎟 Купить билет",
  btn_venue_info: "📍 Локация площадки",
  btn_back: "⬅️ Назад",
  btn_next: "Далее ➡️",
  btn_prev: "⬅️ Назад",
  btn_main_menu: "🏠 Главное меню",
  page_info: "Страница: {current} / {total}",

  // Search
  search_prompt: "🔍 <b>Введите название мероприятия, артиста или площадки:</b>\n<i>(Например: Xamdam, Пахтакор, Хумо, Ромео)</i>",
  search_results: "🔍 <b>Результаты поиска по запросу '{query}':</b>",
  search_empty: "😔 К сожалению, по запросу '{query}' ничего не найдено. Попробуйте другой запрос.",

  // Booking Flow
  select_sector: "🎟 <b>Выберите сектор для мероприятия '{title}':</b>\n\n<i>В каждом секторе указана стоимость и свободные места:</i>",
  sector_item: "{name} — {price} ({seats} мест)",
  sector_full: "⚠️ К сожалению, билеты в этот сектор закончились!",
  select_quantity: "🔢 <b>Выберите количество билетов:</b>\n\nСобытие: <b>{title}</b>\nСектор: <b>{sector}</b>\nЦена за билет: <b>{price}</b>\n\nВыбрано: <b>{count} шт.</b>\nИтоговая сумма: <b>{total}</b>",
  btn_minus: "➖ 1",
  btn_plus: "➕ 1",
  btn_confirm_qty: "✅ Продолжить ({count} шт.)",
  btn_promo: "🏷 Ввести промокод",
  promo_prompt: "🏷 <b>Введите ваш промокод:</b>\n<i>(Например: GG2026)</i>",
  promo_success: "🎉 Промокод успешно применен! Скидка: <b>{discount}</b>",
  promo_invalid: "❌ Неверный или просроченный промокод!",

  // Checkout & Payment
  checkout_title: "🧾 <b>Подтверждение заказа и оплата</b>\n\n🎭 Событие: <b>{title}</b>\n📅 Дата: <b>{date}</b>\n🏛️ Площадка: <b>{venue}</b>\n📍 Сектор: <b>{sector}</b>\n🔢 Количество: <b>{quantity} шт.</b>\n💰 Цена за билет: <b>{unit_price}</b>\n🏷 Скидка: <b>{discount}</b>\n━━━━━━━━━━━━━━━\n💳 <b>ИТОГО К ОПЛАТЕ: {total_amount}</b>\n\n<i>Выберите способ оплаты:</i>",
  payment_processing: "⏳ Обработка платежа...",
  payment_success: "🎉 <b>Поздравляем! Оплата прошла успешно!</b>\n\nВаш электронный билет сформирован. Код билета и QR-код представлены ниже. Предъявите QR-код при входе на мероприятие.",

  // Tickets
  my_tickets_title: "🎫 <b>Мои билеты:</b>",
  my_tickets_empty: "У вас пока нет активных билетов.\nВы можете приобрести билет на интересующее мероприятие в разделе 'Все события'! 🎟",
  ticket_item_card: "🎫 <b>Билет:</b> <code>{code}</code>\n🎭 <b>Событие:</b> {title}\n📅 <b>Дата:</b> {date}\n🏛️ <b>Площадка:</b> {venue}\n📍 <b>Сектор:</b> {sector} | Место: #{seat}\n💰 <b>Цена:</b> {price}\n📊 <b>Статус:</b> {status}\n━━━━━━━━━━━━━━━",
  btn_download_pdf: "📄 Скачать PDF билет",
  btn_show_qr: "📲 Показать QR-код",
  btn_cancel_ticket: "❌ Отменить билет",
  ticket_status_active: "🟢 Активен",
  ticket_status_used: "🔵 Использован",
  ticket_status_cancelled: "🔴 Отменен",
  ticket_cancelled_success: "✅ Билет успешно отменен.",

  // Venues
  venues_title: "🏛️ <b>Главные концертные залы и арены Узбекистана:</b>",
  venue_detail: "🏛️ <b>{name}</b>\n\n📍 <b>Адрес:</b> {address}\n🏙️ <b>Город:</b> {city}\n👥 <b>Вместимость:</b> {capacity} зрителей\n📞 <b>Контакты:</b> {phone}\n\n🗺 <a href=\"{map_url}\">Открыть на карте (Google / Yandex)</a>",
  btn_venue_events: "🎟 События на этой площадке",

  // Help & FAQ
  help_text: "ℹ️ <b>Часто задаваемые вопросы (FAQ):</b>\n\n<b>1. Как купить билет?</b>\nВ главном меню нажмите '🎟 Все события' или '📂 Категории', выберите мероприятие, укажите сектор и количество билетов, затем оплатите через Click, Payme или Uzum.\n\n<b>2. Как я получу билет?</b>\nСразу после оплаты бот отправит вам электронный билет с защищенным QR-кодом и официальный PDF-файл.\n\n<b>3. Как пройти на мероприятие?</b>\nПридите за 30 минут до начала и покажите контролеру QR-код в боте либо распечатанный PDF-билет.\n\n<b>4. Можно ли вернуть билет?</b>\nЕсли до начала мероприятия более 24 часов, вы можете отменить билет в разделе 'Мои билеты'.\n\n📞 <b>Служба поддержки:</b> @ggtickets_support\n🌐 <b>Официальный сайт:</b> iticket.uz",

  // Admin
  admin_panel_title: "⚙️ <b>Панель управления ggtickets (Админ)</b>\n\nДобро пожаловать, администратор!",
  admin_stats: "📊 <b>Статистика системы:</b>\n\n👥 <b>Всего пользователей:</b> {total_users}\n🎟 <b>Продано билетов:</b> {total_tickets}\n💰 <b>Общая выручка:</b> {total_revenue}\n🎭 <b>Активных мероприятий:</b> {active_events}\n📦 <b>Всего заказов:</b> {total_orders}",
  btn_admin_stats: "📊 Статистика",
  btn_admin_events: "🎭 Управление событиями",
  btn_admin_add_event: "➕ Добавить событие",
  btn_admin_broadcast: "📢 Рассылка сообщений",
  btn_admin_scanner: "🔍 Проверка билета (QR/Код)",
  btn_admin_promos: "🏷 Промокоды",
  admin_access_denied: "⛔ Извините, у вас нет прав доступа к этому разделу.",
  admin_enter_ticket_code: "🔍 <b>Введите код билета для проверки:</b>\n<i>(Например: GG-ABC123)</i>",
  admin_ticket_valid: "✅ <b>БИЛЕТ ПОДЛИННЫЙ И ПРИНЯТ!</b>\n\n🎫 Код: <code>{code}</code>\n🎭 Событие: <b>{title}</b>\n👤 Покупатель: <b>{buyer}</b>\n📍 Сектор: <b>{sector}</b> | Место: #{seat}\n💰 Цена: <b>{price}</b>\n\nСтатус билета: <b>ИСПОЛЬЗОВАН (USED)</b>.",
  admin_ticket_already_used: "⚠️ <b>ВНИМАНИЕ! БИЛЕТ УЖЕ ИСПОЛЬЗОВАН!</b>\n\n🎫 Код: <code>{code}</code>\nПо данному билету уже был совершен вход. Повторный вход запрещен.",
  admin_ticket_not_found: "❌ <b>Билет не найден!</b> Возможно, код введен с ошибкой.",
  admin_broadcast_prompt: "📢 <b>Отправьте текст для рассылки всем пользователям бота:</b>",
  admin_broadcast_sent: "✅ Рассылка завершена! Успешно: <b>{success}</b>, Ошибок: <b>{failed}</b>.",

  // Common
  error_generic: "⚠️ Произошла ошибка. Пожалуйста, попробуйте снова.",
  action_cancelled: "Действие отменено."
};
