# 🚀 06. Render.com Platformasiga 24/7 Deploy Qilish Qo'llanmasi

Ushbu qo'llanmada **ggtickets** botini Render platformasiga qadamma-qadam bepul joylashtirish va uni 24/7 uzluksiz ishlatish bo'yicha to'liq ko'rsatma berilgan.

---

## 📋 Tayyorgarlik

Loyihada Render uchun barcha zarur fayllar oldindan sozlangan:
- `render.yaml` — Render Blueprint konfiguratsiyasi
- `package.json` — `"start": "node src/index.js"` buyrug'i
- `Dockerfile` — ixtiyoriy konteynerizatsiya
- Health Check: `GET /health` yo'li (200 OK qaytaradi)

---

## 🛠️ Qadamma-qadam Joylashtirish (Deploy)

### 1-qadam: GitHub Repositoriyga Push Qilish
Barcha kodlarni o'zingizning GitHub repongizga push qiling:
```bash
git add .
git commit -m "feat: complete professional ggtickets bot with 24/7 render ready architecture"
git branch -M main
git push -u origin main
```

### 2-qadam: Render.com da Yangi Web Service Ochish
1. [dashboard.render.com](https://dashboard.render.com/) sahifasiga kiring.
2. **New +** tugmasini bosing va **Web Service** ni tanlang.
3. GitHub hisobingizni ulab, `muhammadaliga99-lgtm/ggtickets` repozitoriyasini tanlang (**Connect**).

### 3-qadam: Sozlamalarni Belgilash
Quyidagi parametrlarni kiriting:
- **Name:** `ggtickets-bot`
- **Region:** `Frankfurt (EU Central)`
- **Branch:** `main`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node src/index.js`
- **Plan:** `Free`

### 4-qadam: Muhit O'zgaruvchilarini (Environment Variables) Kiritish
Pastdagi **Environment Variables** bo'limiga quyidagi kalitlarni qo'shing:

| Kalit (Key) | Qiymat (Value) | Izoh |
| :--- | :--- | :--- |
| `BOT_TOKEN` | `8740667959:AAGYYIfOlQRXdCf3RVtpQbqhhgmvB9rmfhg` | Telegram Bot Tokeni |
| `NODE_ENV` | `production` | Ishlab chiqarish muhiti |
| `KEEP_ALIVE` | `true` | 24/7 uyg'oq turish xizmati |
| `ADMIN_IDS` | `Sizning_Telegram_IDingiz` | Masalan: `12345678` |

> [!NOTE]
> `PORT` parametrini kiritish shart emas, Render uni avtomatik tarzda o'zi belgilaydi (odatda 10000).

### 5-qadam: Deployni Boshlash
**Create Web Service** tugmasini bosing. Render avtomatik ravishda:
1. Loyihani yuklab oladi.
2. `npm install` ni bajaradi.
3. `node src/index.js` orqali bot va veb-serverni ishga tushiradi.
4. Loglarda quyidagilarni ko'rasiz:
   ```
   🚀 HTTP Web Server listening on port 10000
   🤖 Telegraf started in Long Polling mode.
   Starting Keep-Alive service...
   ```

---

## ⚡ 24/7 Uzluksiz Ishlash Qanday Ta'minlanadi?

Render bepul tarifida 15 daqiqa davomida tashqaridan so'rov kelmasa, serverni "uyqu" (sleep) rejimiga o'tkazadi. 

**ggtickets** botida bu muammo ikki xil usulda 100% yechilgan:

1. **Ichki Keep-Alive Avto-Ping:**
   - Bot har 10 daqiqada (`*/10 * * * *`) o'zining `/health` manziliga so'rov yuborib turadi. Bu Render serveriga faollik signalini beradi.
2. **Tashqi Monitor (Tavsiya etiladi - 100% kafolat):**
   - [UptimeRobot.com](https://uptimerobot.com) saytiga bepul a'zo bo'ling.
   - **Add New Monitor** bosing.
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `ggtickets Render`
   - URL: `https://ggtickets-bot.onrender.com/health` (o'zingizning Render linkingiz)
   - Monitoring Interval: `5 minutes`
   - Bu orqali Render bepul serveringiz oyiga 730 soat, haftasiga 7 kun, kuniga 24 soat bir soniya ham to'xtamasdan ishlaydi!

---

## 📡 Webhook Rejimiga O'tish (Ixtiyoriy)

Agar Telegram Long Polling o'rniga Webhook rejimini xohlasangiz:
- Render bergan tashqi URL ni (masalan: `https://ggtickets-bot.onrender.com`) oling.
- Render Environment Variables bo'limiga `WEBHOOK_URL` deb shu URLni qo'shing.
- Bot avtomatik ravishda Webhook rejimiga o'tadi va barcha yangilanishlarni Render orqali qabul qiladi.

Keyingi bo'lim: [[07_Xavfsizlik_va_Muhit_Sozlamalari]]
