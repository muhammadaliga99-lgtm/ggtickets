/**
 * English language dictionary
 */

module.exports = {
  welcome: "Hello, <b>{name}</b>!\n\nWelcome to <b>ggtickets</b> — your official bot for booking tickets to Uzbekistan's premier concerts, theater shows, sports matches, and cultural events!\n\nBuy tickets smoothly, safely, and queue-free! 🎟✨",
  select_language: "Please choose your language:\nIltimos, o'zingizga qulay tilni tanlang:\nПожалуйста, выберите язык:",
  language_changed: "Language successfully changed to: <b>English 🇬🇧</b>",

  // Main menu buttons
  menu_events: "🎟 All Events",
  menu_categories: "📂 Categories",
  menu_search: "🔍 Search",
  menu_my_tickets: "🎫 My Tickets",
  menu_venues: "🏛️ Venues",
  menu_help: "ℹ️ Help & FAQ",
  menu_lang: "🌐 Language (Til)",
  menu_admin: "⚙️ Admin Panel",

  main_menu_title: "Main menu. Please select an option:",

  // Categories
  categories_title: "📂 <b>Select an Event Category:</b>",
  cat_concerts: "🎵 Concerts",
  cat_theater: "🎭 Theater & Plays",
  cat_sports: "⚽ Sports & Football",
  cat_kids: "🎪 Kids & Circus",
  cat_culture: "🏛️ Culture & Museums",
  cat_festivals: "🎡 Shows & Festivals",

  // Events
  events_title: "🎟 <b>Available Events:</b>",
  events_empty: "There are currently no active events in this category.",
  event_detail: "🎭 <b>{title}</b>\n\n📅 <b>Date:</b> {date}\n🏛️ <b>Venue:</b> {venue}\n📍 <b>Address:</b> {address}\n💰 <b>Prices:</b> {price_range}\n\n📝 <b>Description:</b>\n{description}",
  btn_buy_ticket: "🎟 Book Ticket",
  btn_venue_info: "📍 Venue Map & Info",
  btn_back: "⬅️ Back",
  btn_next: "Next ➡️",
  btn_prev: "⬅️ Prev",
  btn_main_menu: "🏠 Main Menu",
  page_info: "Page: {current} / {total}",

  // Search
  search_prompt: "🔍 <b>Enter event title, artist name, or venue:</b>\n<i>(e.g.: Xamdam, Pakhtakor, Humo, Romeo)</i>",
  search_results: "🔍 <b>Search results for '{query}':</b>",
  search_empty: "😔 Sorry, no events found for '{query}'. Try different keywords.",

  // Booking Flow
  select_sector: "🎟 <b>Select your sector for '{title}':</b>\n\n<i>Each sector displays price and available seats:</i>",
  sector_item: "{name} — {price} ({seats} seats left)",
  sector_full: "⚠️ Sorry, tickets in this sector are sold out!",
  select_quantity: "🔢 <b>Select number of tickets:</b>\n\nEvent: <b>{title}</b>\nSector: <b>{sector}</b>\nPrice per ticket: <b>{price}</b>\n\nSelected count: <b>{count} pcs</b>\nTotal amount: <b>{total}</b>",
  btn_minus: "➖ 1",
  btn_plus: "➕ 1",
  btn_confirm_qty: "✅ Proceed ({count} pcs)",
  btn_promo: "🏷 Enter Promo Code",
  promo_prompt: "🏷 <b>Enter your promo code:</b>\n<i>(e.g.: GG2026)</i>",
  promo_success: "🎉 Promo code applied! Discount: <b>{discount}</b>",
  promo_invalid: "❌ Invalid or expired promo code!",

  // Checkout & Payment
  checkout_title: "🧾 <b>Order Confirmation & Checkout</b>\n\n🎭 Event: <b>{title}</b>\n📅 Date: <b>{date}</b>\n🏛️ Venue: <b>{venue}</b>\n📍 Sector: <b>{sector}</b>\n🔢 Quantity: <b>{quantity} pcs</b>\n💰 Unit price: <b>{unit_price}</b>\n🏷 Discount: <b>{discount}</b>\n━━━━━━━━━━━━━━━\n💳 <b>TOTAL DUE: {total_amount}</b>\n\n<i>Select payment method:</i>",
  payment_processing: "⏳ Processing payment...",
  payment_success: "🎉 <b>Congratulations! Payment successful!</b>\n\nYour electronic ticket has been generated. The ticket code and QR code are provided below. Present this QR code at the entrance.",

  // Tickets
  my_tickets_title: "🎫 <b>My Tickets:</b>",
  my_tickets_empty: "You have no active tickets yet.\nExplore upcoming events in 'All Events' to book your seat! 🎟",
  ticket_item_card: "🎫 <b>Ticket:</b> <code>{code}</code>\n🎭 <b>Event:</b> {title}\n📅 <b>Date:</b> {date}\n🏛️ <b>Venue:</b> {venue}\n📍 <b>Sector:</b> {sector} | Seat: #{seat}\n💰 <b>Price:</b> {price}\n📊 <b>Status:</b> {status}\n━━━━━━━━━━━━━━━",
  btn_download_pdf: "📄 Download PDF Ticket",
  btn_show_qr: "📲 Show QR Code",
  btn_cancel_ticket: "❌ Cancel Ticket",
  ticket_status_active: "🟢 Active (Valid)",
  ticket_status_used: "🔵 Used (Checked In)",
  ticket_status_cancelled: "🔴 Cancelled",
  ticket_cancelled_success: "✅ Ticket was successfully cancelled.",

  // Venues
  venues_title: "🏛️ <b>Major arenas, palaces and theaters in Uzbekistan:</b>",
  venue_detail: "🏛️ <b>{name}</b>\n\n📍 <b>Address:</b> {address}\n🏙️ <b>City:</b> {city}\n👥 <b>Capacity:</b> {capacity} spectators\n📞 <b>Phone:</b> {phone}\n\n🗺 <a href=\"{map_url}\">Open in Google / Yandex Maps</a>",
  btn_venue_events: "🎟 Events at this venue",

  // Help & FAQ
  help_text: "ℹ️ <b>Frequently Asked Questions (FAQ):</b>\n\n<b>1. How do I purchase a ticket?</b>\nFrom the main menu tap '🎟 All Events' or '📂 Categories', choose an event, select sector and quantity, then pay via Click, Payme, or Uzum.\n\n<b>2. How will I receive my ticket?</b>\nImmediately upon payment, the bot delivers an encrypted QR-code ticket and an official PDF download directly into this chat.\n\n<b>3. How do I enter the venue?</b>\nArrive 30 minutes before showtime and present your QR code or printed PDF ticket to the gate validator.\n\n<b>4. Can I refund a ticket?</b>\nTickets can be cancelled up to 24 hours prior to the event via the 'My Tickets' section.\n\n📞 <b>Support Team:</b> @ggtickets_support\n🌐 <b>Official Website:</b> iticket.uz",

  // Admin
  admin_panel_title: "⚙️ <b>ggtickets Admin Control Panel</b>\n\nWelcome back, administrator!",
  admin_stats: "📊 <b>System Overview:</b>\n\n👥 <b>Total Users:</b> {total_users}\n🎟 <b>Tickets Sold:</b> {total_tickets}\n💰 <b>Total Revenue:</b> {total_revenue}\n🎭 <b>Active Events:</b> {active_events}\n📦 <b>Total Orders:</b> {total_orders}",
  btn_admin_stats: "📊 Statistics",
  btn_admin_events: "🎭 Manage Events",
  btn_admin_add_event: "➕ Add New Event",
  btn_admin_broadcast: "📢 Broadcast Announcement",
  btn_admin_scanner: "🔍 Validate Ticket (QR/Code)",
  btn_admin_promos: "🏷 Promo Codes",
  admin_access_denied: "⛔ Sorry, you do not have permission to access the admin panel.",
  admin_enter_ticket_code: "🔍 <b>Enter ticket code to validate:</b>\n<i>(e.g.: GG-ABC123)</i>",
  admin_ticket_valid: "✅ <b>TICKET VALID & VERIFIED!</b>\n\n🎫 Code: <code>{code}</code>\n🎭 Event: <b>{title}</b>\n👤 Buyer: <b>{buyer}</b>\n📍 Sector: <b>{sector}</b> | Seat: #{seat}\n💰 Price: <b>{price}</b>\n\nStatus marked as: <b>USED (CHECKED IN)</b>.",
  admin_ticket_already_used: "⚠️ <b>WARNING! TICKET ALREADY USED!</b>\n\n🎫 Code: <code>{code}</code>\nThis ticket was already scanned earlier. Entry rejected.",
  admin_ticket_not_found: "❌ <b>Ticket not found!</b> Please verify the code entered.",
  admin_broadcast_prompt: "📢 <b>Send the message text you wish to broadcast to all bot users:</b>",
  admin_broadcast_sent: "✅ Broadcast completed! Sent: <b>{success}</b>, Failed: <b>{failed}</b>.",

  // Common
  error_generic: "⚠️ An error occurred. Please try again.",
  action_cancelled: "Action cancelled."
};
