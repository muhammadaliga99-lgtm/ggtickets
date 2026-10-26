# 💳 08. Kelajak Rejalari va Haqiqiy To'lov Integratsiyasi

Hozirgi bosqichda **ggtickets** boti to'liq xarid va to'lov simulyatsiyasiga (Click, Payme, Uzum Bank, Tezkor Demo) ega bo'lib, har bir xarid uchun real chipta, QR kod va PDF yaratadi.

Kelgusida rasmiy yuridik shaxs (MCHJ/YaTT) orqali O'zbekiston banklari bilan shartnoma tuzilganda, to'lovlarni to'liq avtomatlashtirish mumkin.

---

## 🔹 1. Click Merchant API Integratsiyasi

Click bilan integratsiya qilish uchun:
1. `service_id`, `merchant_id` va `secret_key` olinadi.
2. Bot foydalanuvchiga Click invoice linkini generatsiya qiladi:
   ```
   https://my.click.uz/services/pay?service_id=XXXX&merchant_id=YYYY&amount=800000&transaction_param=ORD-944000-842
   ```
3. Express serverda ikkita endpoint ochiladi:
   - `POST /api/click/prepare` — Click so'rovini qabul qilish va buyurtmani tekshirish.
   - `POST /api/click/complete` — To'lov muvaffaqiyatli yakunlangach, buyurtmani `COMPLETED` qilish va foydalanuvchiga chiptani avtomatik yuborish.

---

## 🟢 2. Payme Merchant API Integratsiyasi

Payme bilan ishlashda JSON-RPC 2.0 protokoli qo'llaniladi:
1. Payme Business kabinetidan `merchant_id` va `test/production secret key` olinadi.
2. Endpoint ochiladi:
   - `POST /api/payme`
3. Payme yuborgan metodlarni qayta ishlash:
   - `CheckPerformTransaction`
   - `CreateTransaction`
   - `PerformTransaction`
   - `CancelTransaction`
   - `CheckTransaction`
4. Foydalanuvchiga to'lov uchun havola beriladi:
   ```
   https://checkout.paycom.uz/base64(encoded_data)
   ```

---

## 🍇 3. Uzum Bank Integratsiyasi

Uzum Bank (Uzum Pay) orqali to'lovlar uchun:
1. Partner API orqali `order/create` so'rovi yuboriladi.
2. Olingan `paymentUrl` foydalanuvchiga inline tugma sifatida yuboriladi.
3. Uzum Webhook orqali to'lov holati qabul qilinadi.

---

## 🌟 4. Kelgusi Rivojlanish Bosqichlari (Roadmap)

- [ ] **Interaktiv Zal Xaritasi (Interactive Seating Map):** Telegram WebApp (Mini App) orqali Humo Arena va Navoiy teatri zallarini interaktiv 2D/3D ko'rinishda tanlash.
- [ ] **SMS Xabarnoma:** Tadbirdan 3 soat oldin foydalanuvchi telefoniga eslatma SMS yuborish (PlayMobile / Eskiz SMS API).
- [ ] **Do'stlarga Chipta Sovg'a Qilish (Gift Ticket):** Xarid qilingan chiptani do'stining Telegram profili yoki telefon raqamiga o'tkazish.
- [ ] **Apple Wallet & Google Wallet:** Chiptani iPhone Apple Wallet yoki Android Google Wallet ilovalariga qo'shish (.pkpass fayli).

---
*Barcha hujjatlar yakunlandi. Muvaffaqiyatli loyiha tilaymiz!*
