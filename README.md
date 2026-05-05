# NewEffect MTD ITSA — Frontend

Next.js 15 + TypeScript frontend for the MTD ITSA agent platform.

---

## Quick start

### 1. Clone and install

```bash
git clone <repo-url>
cd mtd-app
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=NewEffect MTD ITSA
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3500/api/v1
```

### 3. Run in development

```bash
npm run dev
```

App runs at **http://localhost:3000**

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Build for production |
| `npm run start` | Start production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## Project structure

```
src/
  app/                    Next.js App Router pages
    (public)/             Login, register, forgot/reset password
    (protected)/          Authenticated app routes (dashboard, clients, etc.)

  features/               Feature screens (dashboard, clients, chase, settings…)
  components/             Shared UI components (layout, auth, ui primitives)
  services/               API service layer (auth.service.ts)
  hooks/                  Custom hooks (useAuth)
  providers/              React context providers (QueryProvider)
  lib/
    api/                  Axios client + interceptors
    auth/                 Session + protected route helpers
    helpers/              Shared utility functions
  mocks/                  Mock data (replaced by real API in next phase)
  validations/            Form validation — custom validators + Zod schemas
  constants/              Filter options and shared constants
  config/                 Routes and navigation config
  styles/                 Theme tokens
  types/                  Shared TypeScript types
```

---

## Notes

- Backend API (`mtd-api`) must be running on port **3500** for API calls to work. Auth pages currently use mock stubs — real API integration is the next phase.
- All pages are pre-built as static during `next build` since auth is mocked. This will change once real JWT auth is wired.
