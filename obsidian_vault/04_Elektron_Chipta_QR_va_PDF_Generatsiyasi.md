# 🎫 04. Elektron Chipta, QR Kod va PDF Generatsiyasi

**ggtickets** tizimida yaratiladigan har bir chipta haqiqiy iTicket.uz standartlariga mos ravishda rasmiy hujjat hisoblanadi.

---

## 📱 1. QR Kod Struktura va Xavfsizligi

Chipta uchun yaratiladigan QR kod tarkibida quyidagi JSON tuzilmasi mavjud:
```json
{
  "app": "ggtickets",
  "code": "GG-7K2X9P",
  "tid": "tkt_1729944000000_0",
  "eid": "evt_xamdam",
  "sec": "VIP Parter",
  "seat": 42
}
```

- **Format:** PNG Buffer (Yuqori aniqlikdagi 400x400 px, H-darajali xatoliklarni to'g'rilash kodi).
- **Ishlatilishi:** Telegram orqali alohida fotosurat sifatida foydalanuvchiga taqdim etiladi hamda PDF chiptaning ichiga avtomatik tarzda joylashtiriladi.
- **Xavfsizlik:** Har bir kod tizimda ro'yxatga olingan unikal kodga (`GG-XXXXXX`) bog'langan. Bir marta kirish amalga oshirilgach, chipta holati `USED` ga o'zgaradi va ikkinchi marta kirish qat'iyan man etiladi.

---

## 📄 2. Rasmiy PDF E-Chipta Dizayni (PDFKit)

PDF hujjat Node.js ning `pdfkit` kutubxonasi orqali to'liq dasturiy tarzda xotirada generatsiya qilinadi. Bu serverda qo'shimcha og'ir brauzer (Puppeteer) yoki shriftlar o'rnatmasdan sekundning bir qismida chipta chiqarish imkonini beradi.

### PDF Strukturasi:
- **Format:** A5 Landscape (595 x 420 pt).
- **Brending:**
  - Yuqori qismida zamonaviy `ggtickets` logotipi va `OFFICIAL ELECTRONIC ENTRY PASS (iTicket Edition)` belgisi.
  - O'ng burchakda himoyalangan chipta kodi (`GG-XXXXXX`) ko'k ramkada.
- **Asosiy Ma'lumotlar Bloki:**
  - Tadbir nomi (Katta qalin shriftda)
  - Sana va vaqt (`15-Noyabr, 2026 | ⏰ 19:00`)
  - Maydon nomi va shahri (`Humo Arena, Toshkent`)
  - Sektor va O'rin raqami (`VIP Parter | O'rin: #42`)
  - Chipta egasi (Foydalanuvchining ismi va Telegram profili)
- **O'ng Blok (Tekshiruv punkti):**
  - O'rnatilgan rasmiy QR kod (130x130 pt).
  - Ostida "Kirishda skaner qiling" ko'rsatmasi.
- **Pastki Qism:**
  - To'langan summa yashil rangda (`800 000 so'm`).
  - Yashil `● VERIFIED ACTIVE` xavfsizlik nishoni.
  - "Elektron chipta faqat bir martalik kirish uchun amal qiladi" ogohlantirishi.

---

## 📥 Foydalanuvchiga Yetkazish Mexanizmi

To'lov tasdiqlangach:
1. `ctx.replyWithHTML(t(lang, 'payment_success'))` — tabrik xabari.
2. `ctx.replyWithPhoto({ source: qrBuffer }, ...)` — QR kodli chipta kartochkasi.
3. `ctx.replyWithDocument({ source: pdfBuffer, filename: 'ggticket_GG-XXXXXX.pdf' })` — Rasmiy PDF hujjat yuklab olish uchun taqdim etiladi.

Keyingi bo'lim: [[05_Admin_Paneli_va_QR_Nazorati]]
