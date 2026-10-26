/**
 * Uzbek language dictionary (Lotin)
 */

module.exports = {
  welcome: "Assalomu alaykum, <b>{name}</b>!\n\n<b>ggtickets</b> — O'zbekistondagi eng yirik madaniy va sport tadbirlari, konsertlar hamda teatrlar uchun rasmiy chipta xarid qilish boti!\n\nBiz bilan chiptalarni navbatsiz, qulay va xavfsiz xarid qiling! 🎟✨",
  select_language: "Iltimos, o'zingizga qulay tilni tanlang:\nПожалуйста, выберите язык:\nPlease select your language:",
  language_changed: "Til muvaffaqiyatli o'zgartirildi: <b>O'zbekcha 🇺🇿</b>",

  // Main menu buttons
  menu_events: "🎟 Barcha tadbirlar",
  menu_categories: "📂 Bo'limlar",
  menu_search: "🔍 Qidiruv",
  menu_my_tickets: "🎫 Mening chiptalarim",
  menu_venues: "🏛️ Maydonlar",
  menu_help: "ℹ️ Yordam & FAQ",
  menu_lang: "🌐 Til (Language)",
  menu_admin: "⚙️ Admin Panel",

  main_menu_title: "Bosh menyu. O'zingizga kerakli bo'limni tanlang:",

  // Categories
  categories_title: "📂 <b>Tadbirlar toifasini tanlang:</b>",
  cat_concerts: "🎵 Konsertlar",
  cat_theater: "🎭 Teatr & Spektakl",
  cat_sports: "⚽ Sport & Futbol",
  cat_kids: "🎪 Bolalar & Sirk",
  cat_culture: "🏛️ Madaniyat & Muzey",
  cat_festivals: "🎡 Shou & Festivallar",

  // Events
  events_title: "🎟 <b>Mavjud tadbirlar:</b>",
  events_empty: "Hozircha ushbu bo'limda faol tadbirlar mavjud emas.",
  event_detail: "🎭 <b>{title}</b>\n\n📅 <b>Sana:</b> {date}\n🏛️ <b>Maydon:</b> {venue}\n📍 <b>Manzil:</b> {address}\n💰 <b>Narxlar:</b> {price_range}\n\n📝 <b>Tadbir haqida:</b>\n{description}",
  btn_buy_ticket: "🎟 Chipta xarid qilish",
  btn_venue_info: "📍 Maydon joylashuvi",
  btn_back: "⬅️ Ortga",
  btn_next: "Keyingi ➡️",
  btn_prev: "⬅️ Oldingi",
  btn_main_menu: "🏠 Bosh menyu",
  page_info: "Sahifa: {current} / {total}",

  // Search
  search_prompt: "🔍 <b>Tadbir nomini, san'atkor yoki maydon nomini kiriting:</b>\n<i>(Masalan: Xamdam, Paxtakor, Humo, Romeo)</i>",
  search_results: "🔍 <b>'{query}' bo'yicha qidiruv natijalari:</b>",
  search_empty: "😔 Kechirasiz, '{query}' bo'yicha hech qanday tadbir topilmadi. Boshqa so'z bilan qidirib ko'ring.",

  // Booking Flow
  select_sector: "🎟 <b>'{title}' tadbiri uchun qator/sektorni tanlang:</b>\n\n<i>Har bir sektorda narx va bo'sh o'rinlar ko'rsatilgan:</i>",
  sector_item: "{name} — {price} ({seats} ta bo'sh)",
  sector_full: "⚠️ Kechirasiz, ushbu sektorda chiptalar tugagan!",
  select_quantity: "🔢 <b>Chiptalar sonini tanlang:</b>\n\nTadbir: <b>{title}</b>\nSektor: <b>{sector}</b>\nBir chipta narxi: <b>{price}</b>\n\nTanlangan miqdor: <b>{count} ta</b>\nJami summa: <b>{total}</b>",
  btn_minus: "➖ 1",
  btn_plus: "➕ 1",
  btn_confirm_qty: "✅ Davom etish ({count} ta)",
  btn_promo: "🏷 Promokod kiritish",
  promo_prompt: "🏷 <b>Promokodingizni kiriting:</b>\n<i>(Masalan: GG2026)</i>",
  promo_success: "🎉 Promokod muvaffaqiyatli qo'llandi! Chegirma: <b>{discount}</b>",
  promo_invalid: "❌ Noto'g'ri yoki muddati o'tgan promokod!",

  // Checkout & Payment
  checkout_title: "🧾 <b>Buyurtmani tasdiqlash va to'lov</b>\n\n🎭 Tadbir: <b>{title}</b>\n📅 Sana: <b>{date}</b>\n🏛️ Maydon: <b>{venue}</b>\n📍 Sektor: <b>{sector}</b>\n🔢 Soni: <b>{quantity} ta</b>\n💰 Chipta narxi: <b>{unit_price}</b>\n🏷 Chegirma: <b>{discount}</b>\n━━━━━━━━━━━━━━━\n💳 <b>JAMI TO'LOV: {total_amount}</b>\n\n<i>To'lov turini tanlang:</i>",
  payment_processing: "⏳ To'lov amalga oshirilmoqda...",
  payment_success: "🎉 <b>Tabriklaymiz! To'lov muvaffaqiyatli amalga oshirildi!</b>\n\nSizning elektron chiptangiz tayyorlandi. Chipta kodi va QR-kodi quyida taqdim etildi. Tadbirga kirishda ushbu QR-kodni ko'rsatishingiz lozim.",

  // Tickets
  my_tickets_title: "🎫 <b>Mening chiptalarim:</b>",
  my_tickets_empty: "Sizda hali faol chiptalar mavjud emas.\nTadbirlar bo'limidan o'zingizga yoqqan konsert yoki spektaklga chipta xarid qilishingiz mumkin! 🎟",
  ticket_item_card: "🎫 <b>Chipta:</b> <code>{code}</code>\n🎭 <b>Tadbir:</b> {title}\n📅 <b>Sana:</b> {date}\n🏛️ <b>Maydon:</b> {venue}\n📍 <b>Sektor:</b> {sector} | O'rin: #{seat}\n💰 <b>Narxi:</b> {price}\n📊 <b>Holati:</b> {status}\n━━━━━━━━━━━━━━━",
  btn_download_pdf: "📄 PDF Chiptani yuklab olish",
  btn_show_qr: "📲 QR Kodni ko'rsatish",
  btn_cancel_ticket: "❌ Chiptani bekor qilish",
  ticket_status_active: "🟢 Faol (Amalda)",
  ticket_status_used: "🔵 Foydalanilgan (Kirilgan)",
  ticket_status_cancelled: "🔴 Bekor qilingan",
  ticket_cancelled_success: "✅ Chiptangiz muvaffaqiyatli bekor qilindi.",

  // Venues
  venues_title: "🏛️ <b>O'zbekistondagi asosiy konsert saroylari va arenalar:</b>",
  venue_detail: "🏛️ <b>{name}</b>\n\n📍 <b>Manzil:</b> {address}\n🏙️ <b>Shahar:</b> {city}\n👥 <b>Sig'imi:</b> {capacity} tomoshabin\n📞 <b>Aloqa:</b> {phone}\n\n🗺 <a href=\"{map_url}\">Xaritada ochish (Google / Yandex)</a>",
  btn_venue_events: "🎟 Ushbu maydondagi tadbirlar",

  // Help & FAQ
  help_text: "ℹ️ <b>Tez-tez beriladigan savollar (FAQ):</b>\n\n<b>1. Chiptani qanday xarid qilaman?</b>\nBosh menyudan '🎟 Barcha tadbirlar' yoki '📂 Bo'limlar' tugmasini bosing, o'zingizga ma'qul tadbirni tanlang, qator/sektor va chiptalar sonini belgilab, qulay to'lov tizimi (Click, Payme, Uzum) orqali to'lang.\n\n<b>2. Chipta qanday taqdim etiladi?</b>\nTo'lovdan so'ng darhol bot sizga maxsus himoyalangan QR-kodli elektron chipta hamda rasmiy PDF faylini yuboradi.\n\n<b>3. Tadbirga qanday kiriladi?</b>\nTadbir boshlanishidan 30 daqiqa oldin maydonga kelib, nazoratchiga botdagi QR-kodni yoki chop etilgan PDF chiptani ko'rsatasiz.\n\n<b>4. Chiptani qaytarish mumkinmi?</b>\nTadbir boshlanishiga 24 soatdan ortiq vaqt qolgan bo'lsa, 'Mening chiptalarim' bo'limi orqali chiptani bekor qilish mumkin.\n\n📞 <b>Qo'llab-quvvatlash xizmati:</b> @ggtickets_support\n🌐 <b>Rasmiy veb-sayt:</b> iticket.uz",

  // Admin
  admin_panel_title: "⚙️ <b>ggtickets Boshqaruv Paneli (Admin)</b>\n\nXush kelibsiz, administrator!",
  admin_stats: "📊 <b>Tizim statistikasi:</b>\n\n👥 <b>Jami foydalanuvchilar:</b> {total_users}\n🎟 <b>Sotilgan chiptalar:</b> {total_tickets}\n💰 <b>Umumiy tushum:</b> {total_revenue}\n🎭 <b>Faol tadbirlar:</b> {active_events}\n📦 <b>Jami buyurtmalar:</b> {total_orders}",
  btn_admin_stats: "📊 Statistika",
  btn_admin_events: "🎭 Tadbirlarni boshqarish",
  btn_admin_add_event: "➕ Yangi tadbir qo'shish",
  btn_admin_broadcast: "📢 Xabarnoma yuborish",
  btn_admin_scanner: "🔍 Chiptani tekshirish (QR/Kod)",
  btn_admin_promos: "🏷 Promokodlar",
  admin_access_denied: "⛔ Kechirasiz, sizda ushbu bo'limga kirish huquqi yo'q.",
  admin_enter_ticket_code: "🔍 <b>Tekshirish uchun chipta kodini kiriting:</b>\n<i>(Masalan: GG-ABC123)</i>",
  admin_ticket_valid: "✅ <b>CHIPTA HAQIQIY VA QABUL QILINDI!</b>\n\n🎫 Kod: <code>{code}</code>\n🎭 Tadbir: <b>{title}</b>\n👤 Xaridor: <b>{buyer}</b>\n📍 Sektor: <b>{sector}</b> | O'rin: #{seat}\n💰 Narx: <b>{price}</b>\n\nChipta holati: <b>FOYDALANILDI (USED)</b> deb belgilandi.",
  admin_ticket_already_used: "⚠️ <b>DIQQAT! CHIPTA ALLAQACHON FOYDALANILGAN!</b>\n\n🎫 Kod: <code>{code}</code>\nBu chipta bilan oldinroq kirilgan! Qayta kirish taqiqlanadi.",
  admin_ticket_not_found: "❌ <b>Chipta topilmadi!</b> Kod noto'g'ri kiritilgan bo'lishi mumkin.",
  admin_broadcast_prompt: "📢 <b>Barcha bot foydalanuvchilariga yuboriladigan xabar matnini yuboring:</b>",
  admin_broadcast_sent: "✅ Xabarnoma yuborildi! Muvaffaqiyatli: <b>{success}</b> ta, Xatolar: <b>{failed}</b> ta.",

  // Common
  error_generic: "⚠️ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
  action_cancelled: "Amal bekor qilindi."
};
