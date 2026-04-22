# Agrovia — SmartSeason Field Monitoring System

> A responsive, full-featured crop field monitoring platform built with Next.js 15 and Appwrite, implementing all core requirements of the SmartSeason Field Monitoring System assessment.

---

## Live Demo

**[https://agrovia-five.vercel.app/](https://agrovia-five.vercel.app/)**

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin / Coordinator | admin@agrovia.com | admin@1234 |
| Field Agent | johndoe@agrovia.com | Johndoe@1234 |

> Both accounts are pre-seeded. Log in with either to explore the respective dashboard.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Production-grade React framework with server components and file-based routing |
| Language | TypeScript | End-to-end type safety across data models, hooks, and components |
| Auth & Users | Appwrite (BaaS) | Handles sessions, user creation, and role storage — no custom auth backend needed |
| Styling | Tailwind CSS v4 | Utility-first, minimal bundle, consistent design tokens |
| Animations | Framer Motion | Entrance animations, scroll-triggered reveals, and page transitions |
| State | Zustand | Lightweight client state for field data — no boilerplate |
| Deploy | Vercel | Zero-config Next.js deployment with environment variable support |

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/CHEGEBB/agrovia.git
cd agrovia
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=agrovia
NEXT_PUBLIC_APPWRITE_DATABASE_ID=agrovia
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the demo credentials above.

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Add the same environment variables under **Settings → Environment Variables** in your Vercel project dashboard.

---

## Project Structure

```
agrovia/
├── app/
│   ├── auth/                 # Unified auth page (login + agent register)
│   ├── admin/                # Admin-only routes (dashboard, agents, fields, settings)
│   ├── agent/                # Agent routes (dashboard, fields, settings)
│   ├── page.tsx              # Public landing page
│   └── layout.tsx            # Root layout (fonts, providers)
│
├── components/
│   ├── Navbar.tsx            # Landing page navigation
│   ├── HeroSlider.tsx        # Animated full-screen hero with slide transitions
│   ├── Footer.tsx
│   ├── AdminSidebar.tsx      # Collapsible sidebar for admin routes
│   ├── Sidebar.tsx           # Collapsible sidebar with field submenu for agents
│   ├── FieldCard.tsx
│   ├── StatusBadge.tsx
│   └── UpdateModal.tsx
│
├── hooks/
│   ├── useAuth.ts            # Appwrite session, user object, role from DB
│   └── useFields.ts          # Fields data + update helpers
│
├── lib/
│   ├── appwrite.ts           # Appwrite client — account + databases instances
│   ├── data.ts               # Typed static field records (mock data)
│   └── utils.ts              # cn(), formatDate(), helpers
│
├── services/
│   └── authService.ts        # login(), register(), logout(), getUser() — reads role from Appwrite DB
│
└── types/
    └── index.ts              # Field, AppwriteUser, Role, Stage, Status types
```

---

## Pages

### Landing (`/`)
Full-screen hero slider, features grid, how-it-works steps, stats section, testimonials, and CTA — all with scroll-triggered Framer Motion animations.

### Auth (`/auth`)
Split-panel layout. A single form handles both agent sign-up and login for all roles. After login, the user's role is read from the `users` collection and they are redirected to the correct dashboard automatically — admins to `/admin/dashboard`, agents to `/agent/dashboard`.

### Admin Dashboard (`/admin/dashboard`)
Overview of all fields across all agents — total count, stage breakdown, at-risk count, and a live activity feed of recent updates.

### Agent Dashboard (`/agent/dashboard`)
Scoped to the logged-in agent's assigned fields only — same structure as admin but filtered by `assignedTo`.

### Fields (`/fields`)
Card and table view toggle, filter by stage/status, search by name or crop type.

### Field Detail (`/fields/[id]`)
Current stage with progress bar, status badge with explanation, full notes history, and an "Update Stage / Add Note" modal.

### Agents (`/admin/agents`) — Admin only
Agent cards showing assigned field count. Click-through to view an agent's fields.

### Settings (`/settings`)
Profile display (name, email from Appwrite), role label, logout.

---

## Field Status Logic

Computed by a pure function in `lib/statusLogic.ts` — no side effects, fully unit-testable:

```ts
computeStatus(field: Field): 'Active' | 'At Risk' | 'Completed'
```

Rules applied in order:

1. **Completed** — `stage === 'Harvested'`
2. **At Risk** — `stage === 'Ready'` (overdue for harvest), OR `stage === 'Growing'` and `daysSincePlanting > 90` (beyond typical growing window), OR `daysSinceLastUpdate > 14` (field has been neglected by agent)
3. **Active** — all other cases

The logic is isolated in one file so it is easy to adjust thresholds or add new rules without touching any UI component.

---

## Design Decisions

**Appwrite for authentication and user roles** — The assessment required auth with two distinct roles but did not specify a backend language. Appwrite is a BaaS (Backend-as-a-Service) that provides a production-ready auth system, session management, and a database — all without maintaining a custom server. This was the most practical choice given the timeline: it let me focus on the field management logic and UI rather than building auth infrastructure from scratch. Appwrite stores each user's role (`admin` or `agent`) in a `users` collection, which is queried on every login to determine routing.

**Static field data with dynamic feel** — All field records live in `lib/data.ts` as a typed array. Zustand holds them in memory and all updates (stage changes, notes) mutate local state only. The UI behaves as a fully interactive system within a session — modals, filters, stage transitions, and at-risk calculations all work — without requiring a database write layer. This is an honest trade-off for a timed assessment.

**Single auth page for all roles** — Rather than separate `/login` and `/admin-auth` routes, one page serves everyone. After authentication, the app reads the user's role and redirects accordingly. This is simpler, less error-prone, and more realistic — it mirrors how most production SaaS apps handle multi-role auth.

**Role stored in Appwrite database, not just preferences** — User roles are saved to a `users` collection (not just Appwrite account preferences) so that role lookups are consistent, queryable, and easy to update manually in the Appwrite console without touching code.

**Flat component structure** — No deeply nested `components/dashboard/fields/` folders. At this project scale, a flat `components/` directory is faster to navigate and avoids premature architecture. Components are named clearly enough to find without folder hierarchy.

---

## Assumptions

- Field data does not need to persist across browser sessions (in-memory state is acceptable for this assessment)
- Role is assigned at registration and only changes via the Appwrite console (no in-app role management UI required)
- Admin can see all fields; agents see only fields where `assignedTo` matches their user ID
- "At Risk" threshold of 14 days without an update is a reasonable default for most crop types in active seasons
- Notes are text-only — no file/image uploads required

---

## What I Would Add With More Time

- PostgreSQL backend with Prisma ORM for real data persistence across sessions
- Field assignment drag-and-drop UI (admin assigns fields to agents visually)
- CSV/PDF export for field reports and season summaries
- Push notifications when a field transitions to At Risk
- Mapbox map view showing all fields with GPS coordinates
- Unit tests for `computeStatus()` and the auth service layer
- Image upload support for field observation notes
