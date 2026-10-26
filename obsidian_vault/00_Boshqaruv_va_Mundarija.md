# 🎫 ggtickets — iTicket.uz Telegram Bot Tizimi

> **Loyiha nomi:** ggtickets  
> **Bot Foydalanuvchi nomi:** [@ggtickets_bot](https://t.me/ggtickets_bot)  
> **Bot ID:** `8740667959`  
> **Dasturlash tili:** Node.js (v18+)  
> **Asosiy kutubxonalar:** Telegraf v4, Express, PDFKit, QRCode, Node-Cron  
> **Deployment muhiti:** Render.com (24/7 Web Service)  
> **Holati:** Ishga tushirilgan, to'liq testdan o'tgan, ishlab chiqarishga tayyor (Production Ready)

---

## 🗺 Mundarija (Map of Content - MOC)

Ushbu Obsidian Vault tizimi **ggtickets** loyihasining to'liq me'moriy, dasturiy, xavfsizlik va server konfiguratsiyalarini o'z ichiga oladi:

1. [[01_Tizim_Arxitekturasi]] — Bot arxitekturasi, komponentlar o'zaro bog'liqligi va Express-Telegraf gibrid ishlashi.
2. [[02_Malumotlar_Bazasi_va_Modellar]] — Foydalanuvchilar, tadbirlar, chiptalar, buyurtmalar, saroylar va promokodlar tuzilmasi.
3. [[03_Telegram_Bot_UX_va_Foydalanuvchi_Yoli]] — Foydalanuvchi tajribasi (UX), qidiruv, toifalar bo'yicha saralash, interaktiv sektor va miqdor hisoblagich.
4. [[04_Elektron_Chipta_QR_va_PDF_Generatsiyasi]] — Himoyalangan QR kod strukturasi hamda PDFKit orqali chipta generatsiyasi.
5. [[05_Admin_Paneli_va_QR_Nazorati]] — Administrator boshqaruv paneli, real vaqt statistikasi, tadbir holatini o'zgartirish, ommaviy xabarnoma va nazoratchi uchun QR kod tekshiruvi.
6. [[06_Render_24-7_Deploy_Qollanmasi]] — Render.com platformasiga bepul 24/7 deploy qilish, Webhook sozlash va Keep-Alive tizimi.
7. [[07_Xavfsizlik_va_Muhit_Sozlamalari]] — `.env` konfiguratsiyasi, token xavfsizligi, chiptalarni ikki marta sotilishidan himoya.
8. [[08_Kelajak_Rejalari_va_Tolov_Integratsiyasi]] — Click, Payme va Uzum Bank rasmiy to'lov tizimlarini ulash bo'yicha tavsiyalar.

---

## 🎯 Loyihaning Asosiy Maqsadi va Afzalliklari

- **To'liq iTicket.uz tajribasi:** Konsertlar, teatr spektakllari, futbol va sport o'yinlari, sirk, muzey va festivallar uchun yagona platforma.
- **Tezkor va silliq interfeys:** Hech qanday murakkabliklarsiz, 3 ta bosishda xarid qilish imkoniyati.
- **3 ta tilda xizmat:** O'zbekcha (🇺🇿), Ruscha (🇷🇺) va Inglizcha (🇬🇧) tillari to'liq qo'llab-quvvatlanadi.
- **Rasmiy E-Chipta formati:** Xariddan so'ng foydalanuvchiga darhol maxsus QR-kodli fotosurat hamda rasmiy PDF chipta taqdim etiladi.
- **24/7 Uzluksiz ishlash kafolati:** Render bepul tarifidagi uyqu (sleep) rejimini yengish uchun o'rnatilgan Keep-Alive mexanizmi.
- **QR-Skaner Nazoratchi:** Admin maydon eshigida turib, kelgan mehmonlarning chiptasini bot orqali tekshirishi va bir martalik kirishni tasdiqlashi mumkin.

---
*Yaratilgan sana: 2026-yil | Muallif: ggtickets muhandislik guruhi*
