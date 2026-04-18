# AutoDeliver — Web App (Next.js 14)

## هيكل المشروع

```
src/
├── app/
│   ├── layout.tsx               ← Root layout
│   ├── (marketing)/
│   │   ├── layout.tsx           ← Navbar + Footer
│   │   └── page.tsx             ← 🏠 الصفحة الرئيسية
│   ├── (auth)/
│   │   ├── login/page.tsx       ← 🔐 تسجيل الدخول
│   │   └── register/page.tsx    ← 📝 إنشاء حساب
│   ├── (client)/
│   │   ├── layout.tsx           ← Sidebar العميل
│   │   ├── dashboard/page.tsx   ← 📊 لوحة العميل
│   │   └── orders/
│   │       ├── new/page.tsx     ← ➕ طلب جديد (4 خطوات)
│   │       └── [id]/page.tsx    ← 📦 تفاصيل + عروض + تتبع
│   ├── (driver)/
│   │   └── dashboard/page.tsx   ← 🚗 لوحة الموصّل
│   └── (admin)/
│       └── dashboard/page.tsx   ← 👑 لوحة الإدارة
├── components/
│   ├── Navbar.tsx               ← Navigation + Language switcher
│   ├── Footer.tsx               ← Footer
│   └── Providers.tsx            ← React Query + Toaster
├── hooks/
│   ├── useAuth.ts               ← Zustand auth store
│   └── useWebSocket.ts          ← WebSocket للتتبع المباشر
├── lib/
│   └── api.ts                   ← كل طلبات الـ Backend
└── styles/
    └── globals.css              ← Design system + DM Serif Display
```

## البدء السريع

```bash
# 1. نسخ متغيرات البيئة
cp .env.local.example .env.local
# عدّل NEXT_PUBLIC_API_URL بعنوان الـ Backend

# 2. تثبيت
npm install

# 3. تشغيل
npm run dev
# → http://localhost:3000
```

## الصفحات

| الصفحة | الوصف |
|--------|-------|
| `/` | صفحة ترويجية + كيف يعمل + شهادات |
| `/login` | تسجيل دخول |
| `/register` | إنشاء حساب (عميل أو موصّل) |
| `/dashboard` | لوحة تحكم العميل |
| `/orders/new` | نموذج طلب جديد (4 خطوات) |
| `/orders/:id` | تفاصيل + عروض + تتبع + رسائل |
| `/driver/dashboard` | لوحة الموصّل + الطلبات المتاحة |
| `/admin/dashboard` | إحصائيات + تحقق موصّلين |

## النشر على Vercel

```bash
npx vercel deploy
# أضف Environment Variables في لوحة Vercel
```

## ربط الـ Backend

```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
NEXT_PUBLIC_WS_URL=wss://your-api.onrender.com/ws
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```
