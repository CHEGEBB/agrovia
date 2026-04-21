# Agrovia — Field Monitoring System

> A sleek, responsive crop field monitoring platform built with Next.js 15, Appwrite Auth, and a static-data approach that looks and feels like a full backend system.

---

## Live Demo

> _Link added after deployment_

**Demo credentials**

| Role | Email | Password |
|---|---|---|
| Admin / Coordinator | admin@agrovia.app | Agrovia2026! |
| Field Agent | agent@agrovia.app | Agrovia2026! |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Latest stable, no CVEs on current LTS image |
| Language | TypeScript | Type safety across components and data models |
| Auth | Appwrite (BaaS) | Fast setup, free tier, no backend to maintain |
| Styling | Tailwind CSS v4 | Utility-first, minimal bundle |
| Animations | Framer Motion | Polished entrance/exit animations |
| State | Zustand | Lightweight, no boilerplate |
| Images | Unsplash API | Free high-quality field/crop hero images |
| Deploy | Vercel | Zero-config Next.js deployment |

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/agrovia.git
cd agrovia
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Appwrite

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) and create a project
2. Enable **Email/Password** authentication under Auth → Settings
3. Copy your **Project ID** and **API Endpoint**

### 4. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

### 5. Seed demo accounts

```bash
npm run seed
```

This creates the two demo accounts listed above.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel

```bash
npx vercel --prod
```

Add the same env variables in the Vercel dashboard under Settings → Environment Variables.

---

## Project Structure

```
agrovia/
├── app/
│   ├── (auth)/               # Auth route group (no sidebar layout)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/          # Protected layout with sidebar
│   │   ├── layout.tsx        # Sidebar + topbar wrapper
│   │   ├── dashboard/page.tsx
│   │   ├── fields/page.tsx
│   │   ├── fields/[id]/page.tsx
│   │   ├── agents/page.tsx   # Admin only
│   │   └── settings/page.tsx
│   ├── page.tsx              # Landing page
│   └── layout.tsx            # Root layout (fonts, providers)
│
├── components/               # Flat — everything in one folder
│   ├── Navbar.tsx            # Landing page navbar
│   ├── Footer.tsx
│   ├── Sidebar.tsx           # Collapsible sidebar, responsive
│   ├── FieldCard.tsx         # Card view of a single field
│   ├── StatusBadge.tsx       # Active / At Risk / Completed pill
│   ├── StatsWidget.tsx       # Dashboard stat card
│   ├── FieldTable.tsx        # Table view with sorting/filters
│   ├── UpdateModal.tsx       # Stage update + notes modal
│   ├── HeroSlider.tsx        # Animated hero with Unsplash images
│   ├── AuthForm.tsx          # Shared login/register form
│   ├── RolePicker.tsx        # Role selection pill (Admin / Agent)
│   └── MobileNav.tsx         # Bottom nav for mobile
│
├── hooks/
│   ├── useAuth.ts            # Appwrite session + user role
│   ├── useFields.ts          # Fields data + local update helpers
│   └── useSidebar.ts         # Open/close + persist state
│
├── lib/
│   ├── appwrite.ts           # Appwrite client singleton
│   ├── data.ts               # Static mock fields data
│   ├── utils.ts              # cn(), formatDate(), etc.
│   └── statusLogic.ts        # Pure status computation function
│
├── types/
│   └── index.ts              # Field, User, Stage, Status types
│
└── middleware.ts             # Redirect unauthenticated users
```

---

## Pages

### Landing (`/`)
- Animated navbar with logo + CTA buttons
- **Hero section** — full-screen slider with 5 Unsplash farm/crop images, auto-advances every 4s, cross-fade transition, headline overlaid
- **Features section** — 3-column cards with icons
- **How it works** — numbered steps with alternating image layout
- **Stats section** — animated counters (fields monitored, agents, harvests tracked)
- **CTA section** — sign up prompt with background crop image
- Footer with links

### Auth (`/login`, `/register`)
- Split layout: left panel with a crop photo from Unsplash, right panel with form
- **RolePicker** component — two large pills: "Admin / Coordinator" and "Field Agent" — user taps to choose before signing up
- Role stored in Appwrite user preferences on register
- Smooth form transitions with Framer Motion

### Dashboard (`/dashboard`)
- Admin sees: total fields, fields by stage (donut-style breakdown), at-risk count, all recent updates across agents
- Agent sees: their assigned fields only, same breakdown limited to their fields
- Activity feed showing last 10 stage updates
- Quick-action button to update a field stage

### Fields (`/fields`)
- Toggle between card grid and table view
- Filter bar: by stage, by status, by agent (admin only)
- Search by field name or crop type
- Each card shows: field name, crop, stage badge, status badge, last updated

### Field Detail (`/fields/[id]`)
- Header with field name, crop type, planting date
- Current stage with visual progress bar (Planted → Growing → Ready → Harvested)
- Status badge (Active / At Risk / Completed) with explanation tooltip
- Notes history — chronological list of observations
- "Update Stage / Add Note" button → opens UpdateModal

### Agents (`/agents`) — Admin only
- Grid of agent cards showing name, email, number of assigned fields
- Click an agent to see their fields
- Assign/unassign fields (updates local state, no backend needed)

### Settings (`/settings`)
- Profile info (display name, email — from Appwrite)
- Role shown (read-only)
- Logout button

---

## Field Status Logic

Status is computed by `lib/statusLogic.ts` — a pure function with no side effects:

```ts
computeStatus(field: Field): Status
```

Rules applied in order:

1. **Completed** — if `stage === 'Harvested'`
2. **At Risk** — if `stage === 'Growing'` and `daysSincePlanting > 90`, or if `daysSinceLastUpdate > 30` (field has been neglected)
3. **Active** — everything else (Planted, Growing within normal window, or Ready)

This is intentionally simple and easy to extend. The logic is isolated in one file so it can be unit tested or swapped without touching UI code.

---

## Design Decisions

**Static data with dynamic feel** — all field data lives in `lib/data.ts` as a typed array. Zustand stores it in memory and all CRUD operations mutate local state only. The UI feels fully interactive (updates persist within a session, modals work, filters work) without needing a database.

**Appwrite for auth only** — using a BaaS just for authentication keeps the project simple and honest. Appwrite handles sessions, tokens, and user preferences (role) — we don't need to build any of that.

**Flat component folder** — no `components/dashboard/`, `components/fields/` sub-folders. At this project size, one flat folder is faster to navigate and avoids over-architecture.

**One layout controller** — the `(dashboard)/layout.tsx` file owns the sidebar and topbar. The `useSidebar` hook handles collapse state and persists it to `localStorage`. On mobile (<768px), the sidebar becomes a bottom nav sheet instead of a side panel.

**Emerald green + white theme** — `#059669` (Tailwind `emerald-600`) is the primary color. Used for badges, buttons, active nav items, and the status indicators. White backgrounds keep it clean and professional.

**Unsplash for images** — hero slider and auth page background pull from the Unsplash API using the `crop`, `field`, `agriculture` queries. Images are requested at the right size to avoid layout shift.

---

## Assumptions

- Fields data does not need to persist across browser sessions (in-memory state is acceptable for assessment purposes)
- Role is set at register time and does not change — no role management UI needed
- Admin can see all fields; Field Agent can only see fields assigned to them (simulated via `data.ts` `assignedTo` field matching the logged-in user's ID)
- "At Risk" threshold of 30 days without update is a reasonable default for most crop types
- No real file uploads — notes are text only

---

## What I'd add with more time

- PostgreSQL backend with Prisma ORM for real persistence
- Field assignment workflow (admin drags fields to agents)
- CSV export for field reports
- Push notifications when a field becomes At Risk
- Map view with field GPS coordinates (Mapbox)
- Image upload for field observations