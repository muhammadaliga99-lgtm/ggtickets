# 🎟️ ggtickets — Professional iTicket.uz Telegram Bot

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Telegraf](https://img.shields.io/badge/Telegraf-v4.16-blue.svg)](https://telegraf.js.org/)
[![Deploy to Render](https://img.shields.io/badge/Deploy-Render-46E3B7.svg)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Bot](https://img.shields.io/badge/Telegram-@ggtickets__bot-2CA5E0.svg)](https://t.me/ggtickets_bot)

**ggtickets** — O'zbekistondagi eng yirik madaniy, konsert, teatr va sport tadbirlari uchun rasmiy **iTicket.uz** platformasining Telegram bot versiyasi. Render.com bepul tarifida **24/7 uzluksiz** ishlash uchun optimallashtirilgan.

---

## ✨ Asosiy Imkoniyatlar (Features)

* 🎵 **Keng qamrovli tadbirlar katalogi:**
  * Konsertlar (Humo Arena, Xalqlar Do'stligi, Turkiston)
  * Teatr va Balet (Alisher Navoiy nomidagi DAKT)
  * Sport va Futbol (Milliy Stadioni, Superliga derbilari)
  * Bolalar va Sirk tomoshalari
  * Festivallar va Ochiq osmon ostidagi shoular
* 🌐 **3 ta tilda to'liq qo'llab-quvvatlash:** O'zbekcha (🇺🇿), Русский (🇷🇺), English (🇬🇧).
* 🎟 **Interaktiv Chipta Tanlash:**
  * Sektorlar (VIP, Fan-zona, Parter, Balkon) va narxlar
  * Jonli bo'sh o'rinlar hisobi
  * Interaktiv miqdor hisoblagich `[ ➖ ]  2 ta  [ ➕ ]`
  * Chegirma promokodlari tizimi (`GG2026`, `NAVROZ`, `ITICKET`)
* 📱 **Himoyalangan QR Kod & Rasmiy PDF E-Chipta:**
  * Xariddan so'ng darhol Telegram orqali QR-kod fotosurati
  * Chop etish yoki ko'rsatish uchun yuqori sifatli rasmiy PDF chipta hujjati
* 🏛️ **Maydonlar Katalogi:** Arenalar manzili, sig'imi, aloqa raqami va Google/Yandex xaritalari.
* 🎫 **Mening Chiptalarim:** Faol chiptalarni ko'rish, PDF ni qayta yuklab olish va chiptani bekor qilish.
* 🔍 **Tezkor Qidiruv:** Tadbir, san'atkor yoki maydon nomi bo'yicha qidirish.
* ⚙️ **Administrator Paneli (`/admin`):**
  * Tizim statistikasi (Foydalanuvchilar, sotilgan chiptalar, umumiy tushum, faol tadbirlar)
  * Maydon eshigi nazoratchisi uchun **QR / Chipta K стек (Gate Scanner)** (bir martalik kirish nazorati)
  * Barcha bot foydalanuvchilariga ommaviy xabarnoma (Broadcast) yuborish
  * Tadbirlar holatini o'zgartirish (Faol / Nofaol)
* ⚡ **24/7 Render Uptime:** O'rnatilgan Keep-Alive avto-ping servisi orqali Render Web Service uyquga ketmaydi.
* 📚 **Obsidian Vault:** Tizimning to'liq arxitekturasi va qo'llanmalari `obsidian_vault/` jildida taqdim etilgan.

---

## 🚀 O'rnatish va Lokal Ishga Tushirish (Quick Start)

### 1. Talablar
* Node.js v18 yoki undan yuqori
* npm (yoki yarn/pnpm)

### 2. Repozitoriyani klonlash va paketlarni o'rnatish
```bash
git clone https://github.com/muhammadaliga99-lgtm/ggtickets.git
cd ggtickets
npm install
```

### 3. Konfiguratsiya
`.env` faylini yarating yoki mavjud `.env` ni tekshiring:
```ini
BOT_TOKEN=your_bot_token_here
PORT=3000
NODE_ENV=development
ADMIN_IDS=
WEBHOOK_URL=
KEEP_ALIVE=true
```

### 4. Baza dastlabki ma'lumotlarini yuklash (Seed)
```bash
npm run seed
```

### 5. Botni ishga tushirish
```bash
npm start
```
Yoki o'zgarishlarni kuzatib boruvchi dev-rejimda:
```bash
npm run dev
```

Server ishga tushgach:
* Bot: Telegramda [@ggtickets_bot](https://t.me/ggtickets_bot) orqali `/start` bosing.
* Veb-server: `http://localhost:3000/` va `http://localhost:3000/health` orqali tekshiring.

---

## ☁️ Render.com ga 24/7 Bepul Deploy Qilish

Loyihada Render uchun maxsus `render.yaml` fayli tayyorlangan:

1. Repozitoriyangizni GitHub-ga yuklang (`git push origin main`).
2. [dashboard.render.com](https://dashboard.render.com/) sahifasiga kiring.
3. **New +** -> **Web Service** ni tanlang va `ggtickets` repozitoriyasini ulang.
4. Parametrlarni belgilang:
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node src/index.js`
   * **Health Check Path:** `/health`
5. **Environment Variables** ga quyidagilarni kiriting:
   * `BOT_TOKEN`: `your_bot_token_here`
   * `NODE_ENV`: `production`
   * `KEEP_ALIVE`: `true`
   * `ADMIN_IDS`: *Sizning Telegram ID raqamingiz*
6. **Create Web Service** tugmasini bosing.
7. Bot 24/7 ishlaydi! Uzluksizlikni 100% kafolatlash uchun [UptimeRobot](https://uptimerobot.com) orqali `https://your-app.onrender.com/health` manziliga 5 daqiqalik bepul monitor qo'yish tavsiya etiladi.

To'liq qo'llanma: `obsidian_vault/06_Render_24-7_Deploy_Qollanmasi.md`.

---

## 📂 Loyiha Tuzilmasi

```
gg_tickets/
├── src/
│   ├── index.js               # Entry point (Express + Telegraf)
│   ├── config/                # Muhit sozlamalari va konstantalar
│   ├── db/                    # Tranzaksiyali ma'lumotlar bazasi va seed
│   ├── i18n/                  # Ko'p tilli lug'at (uz, ru, en)
│   ├── services/              # QR kod, PDF chipta va Keep-alive xizmatlari
│   ├── keyboards/             # Reply va Inline klaviaturalar
│   ├── handlers/              # Start, Events, Booking, Payment, Tickets, Admin
│   └── utils/                 # Formatter, Logger, Session boshqaruvi
├── obsidian_vault/            # Obsidian formatidagi to'liq bilimlar bazasi
├── data/                      # Baza JSON fayllari
├── render.yaml                # Render Blueprint
├── Dockerfile                 # Docker konfiguratsiyasi
└── package.json
```

---

## 📑 Obsidian Hujjatlari (Knowledge Base)

`obsidian_vault/` jildida quyidagi to'liq qo'llanmalar mavjud:
* `00_Boshqaruv_va_Mundarija.md` — Umumiy kirish va mundarija
* `01_Tizim_Arxitekturasi.md` — Modulli arxitektura va diagrammalar
* `02_Malumotlar_Bazasi_va_Modellar.md` — JSON kolleksiyalari sxemasi
* `03_Telegram_Bot_UX_va_Foydalanuvchi_Yoli.md` — Foydalanuvchi yo'li va interfeys
* `04_Elektron_Chipta_QR_va_PDF_Generatsiyasi.md` — QR kod va PDF yaratish mexanizmi
* `05_Admin_Paneli_va_QR_Nazorati.md` — Admin paneli va chipta validatori
* `06_Render_24-7_Deploy_Qollanmasi.md` — Render 24/7 deploy yo'riqnomasi
* `07_Xavfsizlik_va_Muhit_Sozlamalari.md` — Xavfsizlik choralari
* `08_Kelajak_Rejalari_va_Tolov_Integratsiyasi.md` — Click/Payme/Uzum integratsiyasi

---

## 📜 Litsenziya

MIT Litsenziyasi asosida taqdim etiladi.
Maksimal sifat bilan ishlab chiqilgan © 2026 ggtickets.
