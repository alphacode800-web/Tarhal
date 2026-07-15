# CIAR Tourism

**A full-stack travel commerce platform built for scale, localization, and operational control.**

CIAR Tourism is a production-grade web application that unifies destination discovery, multi-service booking, and distributed content management for international travel agencies. Engineered as a single-repo full-stack system, it delivers a polished consumer experience in Arabic, English, and French—while giving admins and regional supervisors granular control over countries, offices, offers, and media assets.

<!-- Replace with a high-quality screenshot or demo GIF -->
![CIAR Tourism — Homepage & Admin Dashboard](./docs/screenshot-placeholder.png)
> **Demo media:** Add a 1440×900 screenshot or short GIF showcasing the hero, country grid, and admin dashboard.

---

## Tech Stack & Key Highlights

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18 · TypeScript · Vite 6 · React Router 6 · Tailwind CSS 3 |
| **UI System** | Radix UI · shadcn/ui patterns · Framer Motion · Lucide Icons |
| **State & Data** | TanStack Query · React Context · React Hook Form · Zod |
| **Backend** | Express 4 · SQLite (WAL mode) · Zod validation |
| **Payments** | Stripe Checkout · Webhook handling · Local payment rails |
| **Maps & Geo** | Google Maps API · OpenStreetMap/Leaflet fallback · IP geolocation |
| **Tooling** | Vitest · Prettier · SWC · Serverless HTTP (Netlify) |

### Engineering Highlights

- **Tiered persistence architecture** — SQLite primary store with atomic JSON backups and seed-data bootstrapping; writes survive partial failures without corrupting state.
- **Static–dynamic data fusion** — A 7,000+ line static country catalog merges seamlessly with live admin edits, rendering instantly from cache while syncing in the background.
- **Role-based operations layer** — Admin and supervisor dashboards with scoped permissions, activity logging, and per-country content isolation.
- **Unified dev/prod pipeline** — Vite-integrated Express server for single-port development; dual-build output (`dist/spa` + `dist/server`) for self-hosted or serverless deployment.

---

## Core Features

- **Multi-service booking engine** — Hotels, car rentals, flight tickets, visa applications, travel insurance, and taxi/delivery services share a consistent booking flow with localized checkout panels and Stripe integration.

- **Admin CMS with live sync** — Countries, offices, tour offers, hero typography, announcement bars, and site settings are editable from a full admin dashboard. Changes persist to SQLite and replicate to JSON backups on every save.

- **Supervisor permission model** — Regional supervisors operate within scoped roles (`canAddCities`, `canEditOffers`, etc.) with session management and multilingual activity audit trails—designed for distributed teams managing content across dozens of destinations.

- **Trilingual i18n + RTL** — A custom `LanguageContext` drives 500+ translation keys across Arabic, English, and French. Layout, typography (Cairo, Amiri, Inter), and direction flip automatically for RTL locales.

- **Multi-currency display** — `CurrencyContext` converts and formats prices across 12 regional currencies (SDG, SAR, AED, EGP, USD, EUR, and more) with `localStorage` persistence and locale-aware formatting.

- **Geo-personalized discovery** — IP-based country detection (with API fallbacks and timezone heuristics) highlights the visitor's home destination on the homepage and filters local vs. international tour offers.

- **Resilient media pipeline** — Server-side image and video upload (up to 200 MB) with base64 batch support, `OptimizedImage` lazy-loading with CDN URL compression, and graceful fallback chains.

- **Adaptive maps** — `GoogleMap` component auto-selects Google Maps when an API key is present, otherwise loads Leaflet + OpenStreetMap tiles—zero config degradation.

- **Theme engine** — Dark/light mode via `next-themes` with flash-free initialization (inline script in `index.html`) and a custom Tarhal brand palette defined in CSS variables.

---

## Architecture & Folder Structure

```
CIAR-Tourism/
├── client/                    # React SPA — pages, components, hooks, contexts
│   ├── pages/                 # Route-level views (40+ routes: public, admin, supervisor)
│   ├── components/            # Shared UI, layout, admin editors, payment widgets
│   │   ├── ui/                # Radix-based design system (button, dialog, form, etc.)
│   │   └── admin/             # Admin-specific editors (color picker, typography)
│   ├── contexts/              # Language, currency, and theme providers
│   ├── services/              # dataManager, supervisorManager, payments, geoLocation
│   ├── data/                  # Static catalogs (countries, offers, payment methods)
│   ├── hooks/                 # Reusable React hooks (toast, mobile detection)
│   ├── utils/                 # Image/video optimization helpers
│   └── global.css             # Tailwind theme tokens and brand color system
├── server/                    # Express API — routes, database, models, middleware
│   ├── routes/                # REST handlers (admin-data, payments, upload)
│   ├── database/              # SQLite init, admin key-value store, schema
│   ├── models/                # Payment, Country, TravelOffice data models
│   ├── middleware/            # Request validation
│   ├── data/                  # JSON backup files (auto-written on every save)
│   ├── seed/                  # Bootstrap data for first-run deployments
│   └── utils/                 # Path resolution for uploads and data dirs
├── public/uploads/            # User-uploaded images and videos (writable at runtime)
├── netlify/functions/         # Serverless Express adapter for Netlify deployment
├── scripts/                   # Build-time seed export utilities
├── vite.config.ts             # Vite + Express dev middleware plugin
└── vite.config.server.ts      # Server-side production bundle config
```

### Architectural Patterns

| Pattern | Where it lives | Purpose |
|---------|---------------|---------|
| **Service layer** | `client/services/` | Encapsulates API calls, localStorage caching, and business logic away from UI |
| **Context providers** | `client/contexts/` | Cross-cutting concerns (language, currency) without prop drilling |
| **Key-value admin store** | `server/database/admin-store.ts` | Flexible JSON document storage in SQLite for CMS entities |
| **Read-through cache** | `server/routes/admin-data.ts` | DB → JSON file → seed fallback chain with corruption recovery |
| **Route-based code splitting** | `client/App.tsx` | 40+ lazy-ready routes organized by domain (public, admin, supervisor) |
| **Error boundaries** | `client/components/ErrorBoundary.tsx` | Graceful failure isolation at the app root |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (22 recommended)
- **npm** 9+ (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/CIAR-Tourism.git
cd CIAR-Tourism

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Edit `.env` with your configuration:

```env
# Server port (default: 3000 in production, 8080 in dev via Vite)
PORT=3000

# SQLite database path (optional)
# DATABASE_PATH=./server/database/tarhal.db

# Google Maps (optional — falls back to OpenStreetMap)
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Stripe payments (optional)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Development

```bash
npm run dev
```

Opens at **http://localhost:8080** — Vite serves the React SPA and proxies `/api` and `/uploads` to the integrated Express server.

### Production

```bash
npm run build    # Builds client (dist/spa) + server (dist/server)
npm start        # Serves on PORT (default 3000)
```

### Other Commands

```bash
npm run typecheck   # TypeScript validation
npm test            # Run Vitest tests
npm run build:seed  # Export seed data for deployment
```

---

## Key Engineering Challenges & Decisions

### 1. Tiered Persistence Without Data Loss

**Problem:** A travel CMS must survive server restarts, partial deploys, and environments where SQLite isn't available (e.g., ephemeral serverless functions). A single storage backend creates a single point of failure.

**Solution:** A three-tier read chain and dual-write save path:

```
Read:  SQLite (admin_data) → JSON file (server/data/) → Seed (server/seed/)
Write: SQLite + JSON backup (atomic temp-file rename)
```

On read, `readFromDbOrFile` checks the database first. If empty or unavailable, it falls back to the JSON file—and if that's missing, to seed data. Successful file reads are promoted into SQLite automatically. On write, `saveToDbAndFile` persists to both stores; the JSON write uses a **write-to-temp → verify JSON → atomic rename** pattern that deletes corrupted files rather than serving bad data.

SQLite is tuned for production workloads: `WAL` journal mode, `NORMAL` synchronous, in-memory temp store, and transaction wrappers with automatic rollback. The result is a system that boots with seed data on a fresh install, upgrades to persistent storage on first admin save, and never serves a half-written file.

### 2. Instant Render with Background Static–Dynamic Merge

**Problem:** The country catalog ships as a large static dataset (~7,500 lines) for instant first paint, but admins continuously edit countries, images, and metadata via the dashboard. Blocking the homepage on an API round-trip would add perceptible latency; ignoring admin edits would make the CMS feel broken.

**Solution:** A **stale-while-revalidate** merge strategy on the homepage:

1. **Synchronous first paint** — `getAllCountriesWithDynamic()` renders immediately from the static catalog merged with any cached localStorage data.
2. **Background sync** — `syncStaticWithDynamic()` and `dataManager.getCountriesAsync()` fetch fresh admin data without blocking render.
3. **Intelligent merge** — Dynamic countries are matched to static entries by ID and name, preserving static assets (flags, galleries) while overlaying admin edits. Inactive countries are filtered; ID remapping handles admin-created duplicates.

```typescript
// Homepage loads instantly, then upgrades when API responds
setCountries(getAllCountriesWithDynamic());          // sync — immediate
dataManager.getCountriesAsync().then(mergeCountries); // async — fresh
syncStaticWithDynamic().catch(console.error);         // background — cache refresh
```

This pattern keeps Largest Contentful Paint fast for SEO and mobile users while ensuring admin changes propagate within one navigation cycle—no spinners on the critical path.

---

## Deployment Notes

| Target | Approach |
|--------|----------|
| **Self-hosted (VPS)** | `npm run build && npm start` — ensure `public/uploads/` is writable |
| **Netlify** | Serverless function at `netlify/functions/api.ts` wraps the Express app |
| **Binary** | `pkg` config in `package.json` supports standalone executables |

Database file default: `server/database/tarhal.db`. Override with `DATABASE_PATH` for containerized or multi-instance setups.

---

## License

Private — All rights reserved.
