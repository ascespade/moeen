# Mu'ayin – Static UI (Next.js + Preline + Tailwind)

Run from project root:

```bash
npm install
npm run dev
```

### Tech

- Next.js App Router
- Tailwind CSS + Preline UI
- Icons: Lucide
- Fonts: Cairo (Arabic), Inter (English)
- Supabase (i18n translations, API)

### Design Tokens

- Central tokens in `src/lib/theme.ts` and CSS vars in `src/app/globals.css`
- Tailwind theme reads CSS variables; update brand once in `globals.css`

Primary colors

- Primary: `#F58220`
- Secondary: `#009688`
- Accent: `#007BFF`
- Dark surfaces: `#0D1117` / `#1E1E2E`

### RTL/LTR & i18n

- Direction auto-derives from pathname; routes starting with `/en` render LTR English.
- I18n provider fetches strings from Supabase table `translations` (see `src/lib/i18n.sql`).
- API endpoint: `/api/i18n?locale=ar&ns=common`.

### Components

Shared UI lives in `src/components/ui/*` and is used across pages.

- `Button`, `Input`, `Card`, `Table`, `Modal`, `Tooltip`, `Toast`
- Preview at `/components`

### Layout

- Admin shell in `src/app/(admin)/layout.tsx` with `Header` and `Sidebar`.
- All admin pages follow the same shell and tokens.

### Flow Builder (UI only)

- Interactive canvas with zoom and drag for nodes.
- Static connections and AI stub areas prepared for expansion.

### Accessibility & Performance

- Semantic HTML, focus-visible rings, color contrast tokens
- Images optimized (WebP/AVIF), lazy by default

### Adding Pages

1. Create route under `src/app/.../page.tsx`
2. Use shared components and tokens
3. Verify responsiveness at sm/md/lg breakpoints

### Supabase Setup

1. Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon
SUPABASE_SERVICE_ROLE=your-service-role (server only)
```

2. Run SQL in `src/lib/i18n.sql` on your Supabase project to create `translations` and policies.
3. Visit `/api/i18n?locale=ar&ns=common` to verify.

### Saudi Vision 2030 Note

The UI tone emphasizes trust, modernity, inclusivity, and efficiency, aligning with Vision 2030 digital transformation priorities.
