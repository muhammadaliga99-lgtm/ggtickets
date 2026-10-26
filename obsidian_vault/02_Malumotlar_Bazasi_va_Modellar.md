# 💾 02. Ma'lumotlar Bazasi va Sxemalar

**ggtickets** tizimi tezkor, xotirada keshlanuvchi va diskka xavfsiz yoziluvchi JSON arxitekturasidan foydalanadi. Bu arxitektura Render yoki boshqa har qanday Linux/Windows serverda hech qanday qo'shimcha tashqi drayverlarsiz yoki C++ kompilyatsiyasisiz (zero native-compilation errors) 100% barqaror ishlaydi.

---

## 🗄️ Kolleksiyalar va Maydonlar Tuzilmasi

### 1. `users` (Foydalanuvchilar)
Har bir botga kirgan foydalanuvchi profili:
```json
{
  "id": 123456789,
  "username": "muhammadali",
  "first_name": "Muhammadali",
  "last_name": "",
  "language": "uz",
  "role": "admin", // "admin" yoki "user"
  "created_at": "2026-10-26T12:00:00.000Z",
  "last_active": "2026-10-26T12:20:00.000Z"
}
```

### 2. `events` (Tadbirlar)
Konsertlar, teatrlar, o'yinlar va ularning sektorlari:
```json
{
  "id": "evt_xamdam",
  "title_uz": "Xamdam Sobirov — Katta Yakkaxon Konsert Dasturi",
  "title_ru": "Хамдам Собиров — Большой сольный концерт",
  "title_en": "Khamdam Sobirov — Grand Solo Concert Live",
  "category": "concerts", // concerts | theater | sports | kids | culture | festivals
  "venue_id": "venue_humo",
  "date": "2026-11-15",
  "time": "19:00",
  "banner_url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
  "description_uz": "Jonli ijro, maxsus yorug'lik shoulari...",
  "min_price": 150000,
  "max_price": 800000,
  "sectors": [
    {
      "name": "VIP Parter",
      "price": 800000,
      "available_seats": 48,
      "total_seats": 50
    },
    {
      "name": "Fan-Zona",
      "price": 450000,
      "available_seats": 195,
      "total_seats": 200
    }
  ],
  "is_featured": true,
  "is_active": true
}
```

### 3. `venues` (Konsert saroylari va Arenalar)
O'zbekistondagi asosiy maydonlar:
```json
{
  "id": "venue_humo",
  "name_uz": "Humo Arena ko'p tarmoqli muz majmuasi",
  "name_ru": "Многофункциональный ледовый комплекс Humo Arena",
  "name_en": "Humo Arena Multi-Purpose Complex",
  "city": "Toshkent",
  "address_uz": "Chilonzor tumani, Beshyog'och ko'chasi",
  "capacity": 12500,
  "map_url": "https://maps.google.com/?q=Humo+Arena+Tashkent",
  "image_url": "https://...",
  "phone": "+998 71 207 10 71"
}
```

### 4. `tickets` (Xarid qilingan chiptalar)
Har bir individual chipta yozuvi:
```json
{
  "id": "tkt_1729944000000_0",
  "ticket_code": "GG-7K2X9P",
  "order_id": "ord_1729944000000",
  "user_id": 123456789,
  "event_id": "evt_xamdam",
  "sector_name": "VIP Parter",
  "seat_number": 42,
  "price": 800000,
  "status": "ACTIVE", // ACTIVE | USED | CANCELLED
  "created_at": "2026-10-26T12:20:00.000Z",
  "used_at": null,
  "used_by": null
}
```

### 5. `orders` (Buyurtmalar jurnali)
Xarid tranzaksiyasi:
```json
{
  "id": "ord_1729944000000",
  "order_number": "ORD-944000-842",
  "user_id": 123456789,
  "event_id": "evt_xamdam",
  "sector_name": "VIP Parter",
  "quantity": 2,
  "unit_price": 800000,
  "total_amount": 1440000,
  "discount_amount": 160000,
  "promo_code": "GG2026",
  "payment_method": "click",
  "status": "COMPLETED", // PENDING | COMPLETED | CANCELLED
  "ticket_ids": ["tkt_1729944000000_0", "tkt_1729944000000_1"],
  "created_at": "2026-10-26T12:20:00.000Z"
}
```

### 6. `promos` (Chegirma promokodlari)
```json
{
  "code": "GG2026",
  "discount_percent": 10,
  "discount_uzs": 0,
  "min_order": 100000,
  "max_uses": 1000,
  "current_uses": 1,
  "expires_at": "2027-01-01",
  "is_active": true
}
```

---

## 🔒 Tranzaksiya Xavfsizligi va Bo'sh O'rinlarni Boshqarish

- `bookSectorSeats(eventId, sectorName, count)`: Xarid vaqtida o'rinlar sonini avtomatik kamaytiradi. Agar bo'sh o'rin qolmagan bo'lsa, xaridni to'xtatadi.
- `restoreSectorSeats(eventId, sectorName, count)`: Agar foydalanuvchi chiptani bekor qilsa, o'sha o'rin avtomatik tarzda bo'sh o'rinlar qatoriga qaytariladi.

Keyingi bo'lim: [[03_Telegram_Bot_UX_va_Foydalanuvchi_Yoli]]
