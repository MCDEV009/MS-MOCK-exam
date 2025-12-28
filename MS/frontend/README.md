# Frontend - Milliy Cert Mock

## O'rnatish

```bash
npm install
```

## Ishga Tushirish

```bash
npm run dev
```

Ilova `http://localhost:3000` da ochiladi.

## Build

Production build uchun:

```bash
npm run build
```

Build fayllar `dist/` papkasida bo'ladi.

## Vercel'ga Deploy Qilish

### 1. Vercel'ga ulash

Vercel dashboard'da yoki CLI orqali:

```bash
npm i -g vercel
vercel
```

### 2. Environment Variables

Vercel dashboard'da yoki `vercel.json` orqali quyidagi environment variable'ni qo'shing:

- **VITE_API_URL**: Backend API URL (masalan: `https://your-backend.railway.app` yoki `https://your-backend.render.com`)

**Muhim:** Backend alohida deploy qilingan bo'lishi kerak (Railway, Render, Heroku, yoki boshqa platforma).

### 3. Deploy

GitHub repository'ni Vercel'ga ulang yoki `vercel --prod` buyrug'ini ishlating.

### Eslatma

- Frontend Vercel'da deploy qilinadi
- Backend alohida platformada deploy qilinishi kerak (masalan: Railway, Render)
- `VITE_API_URL` environment variable'da backend URL'ni to'g'ri ko'rsating