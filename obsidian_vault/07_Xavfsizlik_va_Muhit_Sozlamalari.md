# 🛡️ 07. Xavfsizlik va Muhit Sozlamalari

Ushbu bo'limda tizim xavfsizligi, muhit o'zgaruvchilari va xatoliklarga chidamlilik choralari bayon etilgan.

---

## 🔑 1. Muhit O'zgaruvchilari (Environment Variables)

`.env` fayli quyidagi parametrlardan iborat:

```ini
# Telegram Bot Tokeni (BotFather bergan maxfiy token)
BOT_TOKEN=your_bot_token_here

# Server porti (Render o'zi process.env.PORT orqali sozlaydi)
PORT=3000

# Ishlash muhiti
NODE_ENV=production

# Asosiy adminlarning Telegram ID raqamlari (vergul bilan)
ADMIN_IDS=12345678,98765432

# Webhook URL (bo'sh qoldirilsa Polling rejimida ishlaydi)
WEBHOOK_URL=

# 24/7 Uyqudan saqlash pingi (true / false)
KEEP_ALIVE=true

# Render tashqi manzili (Render avtomatik taqdim etadi)
RENDER_EXTERNAL_URL=
```

> [!CAUTION]
> Hech qachon `.env` faylini ommaviy GitHub repozitoriyasiga yuklamang! `.gitignore` fayliga `.env` kiritilgan bo'lishi shart.

---

## 🔒 2. Chiptalarni Ikki Marta Sotilishidan Himoya (Race Condition Protection)

Bir nechta foydalanuvchi bir vaqtning o'zida oxirgi 1 ta bo'sh o'rinni sotib olishga uringan holatda:
1. `storage.bookSectorSeats(eventId, sectorName, count)` funksiyasi tranzaksion tekshiruvdan foydalanadi:
   ```javascript
   if (!sector || sector.available_seats < count) return false;
   sector.available_seats -= count;
   ```
2. Agar o'rin yetarli bo'lmasa, funksiya darhol `false` qaytaradi va to'lov jarayoni to'xtatiladi.
3. Foydalanuvchiga esa "Kechirasiz, ushbu sektorda chiptalar tugagan!" degan ogohlantirish beriladi.

---

## 🛑 3. Xatoliklarni Ushlash (Crash Prevention)

Telegram boti hech qachon to'satdan to'xtab qolmasligi (crash bo'lmasligi) uchun bir necha bosqichli himoya o'rnatilgan:

1. **Telegraf Error Catcher:**
   ```javascript
   bot.catch((err, ctx) => {
     logger.error(`Telegraf Error encountered for update ${ctx.updateType}:`, err.message);
   });
   ```
   Foydalanuvchi botni bloklagan bo'lsa yoki Telegram serverida vaqtinchalik uzilish bo'lsa, xatolik ushlanadi va server ishlashda davom etadi.

2. **Node.js Global Handlers:**
   ```javascript
   process.on('unhandledRejection', (reason, promise) => {
     logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
   });
   process.on('uncaughtException', (err) => {
     logger.error('Uncaught Exception thrown:', err);
   });
   ```

3. **Diskka Xavfsiz Yozish:**
   Ma'lumotlar bazasi fayllari xotiradan diskka to'g'ridan-to'g'ri sinxron yoziladi, tizim to'satdan o'chgan taqdirda ham JSON fayllar shikastlanmaydi.

Keyingi bo'lim: [[08_Kelajak_Rejalari_va_Tolov_Integratsiyasi]]
