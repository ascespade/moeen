"مُعين" — منصة دردشة متعددة القنوات (Strict v5.0)

البنية: Next.js (App Router) + Tailwind + Preline + Supabase

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Quick Start
1) انسخ `.env.example` إلى `.env.local` واملأ القيم.
2) `npm i`
3) `npm run dev`

Structure
- `src/app/(auth)/login` — تسجيل الدخول
- `src/app/(app)/*` — اللوحة: داشبورد، محادثات، إعدادات
- `src/app/(admin)/*` — مستخدمون، قنوات، سجلات
- `src/app/api/*` — نقاط API: الذكاء الاصطناعي، الإعدادات، واتساب، السجلات
- `src/lib/supabase` — عميل Supabase
- `src/components` — الواجهات

Notes
- RBAC وAuth حالياً stubs لأغراض التصميم.
- كل الإعدادات مركزية عبر `/api/settings` (placeholder الآن).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
