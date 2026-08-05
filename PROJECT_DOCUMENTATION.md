# Raju Food Court — Full Project Documentation

> A complete guide to understanding your website project: what it is, how it works, what technologies are used, and how every piece connects.

---

## 1. What Is This Project?

This is a **restaurant website** for Raju Food Court, Rajkot. It is a full-stack web application — meaning it has both a frontend (what customers see) and a backend (data, database, admin control). It was built using modern web technologies and deployed on Vercel (cloud hosting).

---

## 2. Technology Stack — What Is Being Used

| Technology | What It Does |
|---|---|
| **Next.js 15** | The main framework. Handles pages, routing, and API endpoints |
| **React 19** | UI library. Everything you see on screen is built with React components |
| **TypeScript** | A superset of JavaScript that adds type safety (catches errors before they happen) |
| **Tailwind CSS** | A utility-first CSS framework. Provides ready-made CSS classes like `text-sm`, `flex`, `bg-charcoal` |
| **Framer Motion** | Animation library. Powers all smooth transitions, hover effects, and scroll animations |
| **Prisma ORM** | Database toolkit. Lets you talk to the database using JavaScript code instead of SQL |
| **Supabase** | Two things: (1) PostgreSQL database hosting, (2) Storage bucket for image uploads |
| **Zustand** | State management library. Used for the shopping cart state |
| **Lucide React** | Icon library. All icons (coffee cup, search, trash, etc.) come from here |
| **Lenis** | Smooth scroll library. Makes the page scrolling feel silky |
| **GSAP + ScrollTrigger** | Animation library. Used for scroll-based animations |
| **Vercel** | Cloud hosting platform. Your website runs here after deployment |
| **GitHub** | Code version control. Stores your code history and triggers Vercel deployments |

---

## 3. Project Folder Structure — Every Folder Explained

```
raju-madras-cafe/
│
├── app/                    ← All pages and API routes (Next.js App Router)
│   ├── page.tsx            ← Home page (/)
│   ├── layout.tsx          ← Root layout — wraps ALL pages (navbar, footer, etc.)
│   ├── globals.css         ← Global CSS styles applied to the whole site
│   │
│   ├── about/
│   │   └── page.tsx        ← About page (/about)
│   ├── contact/
│   │   └── page.tsx        ← Contact page (/contact)
│   ├── gallery/
│   │   └── page.tsx        ← Gallery page (/gallery)
│   ├── menu/
│   │   └── page.tsx        ← Menu page (/menu)
│   ├── reviews/
│   │   └── page.tsx        ← Reviews page (/reviews)
│   │
│   ├── admin/
│   │   ├── page.tsx        ← Admin dashboard (/admin) — password protected
│   │   └── login/
│   │       └── page.tsx    ← Admin login page (/admin/login)
│   │
│   └── api/                ← Backend API routes (server-side code)
│       ├── menu/
│       │   └── route.ts    ← GET/POST/PATCH/DELETE menu items
│       ├── reviews/
│       │   └── route.ts    ← GET/POST/PUT/DELETE reviews
│       ├── gallery/
│       │   └── route.ts    ← GET/POST/DELETE gallery photos
│       ├── upload/
│       │   └── route.ts    ← POST image uploads to Supabase Storage
│       └── admin/
│           ├── login/
│           │   └── route.ts ← POST admin login (checks credentials)
│           ├── logout/
│           │   └── route.ts ← POST admin logout (clears session)
│           └── check/
│               └── route.ts ← GET auth check (is session valid?)
│
├── components/             ← Reusable UI building blocks
│   ├── Navbar.tsx          ← Top navigation bar
│   ├── Footer.tsx          ← Footer (accordion on mobile)
│   ├── HeroSection.tsx     ← Big hero banner on the home page
│   ├── MenuCard.tsx        ← Individual dish card with modal popup
│   ├── ReviewCard.tsx      ← Individual review card
│   ├── GalleryGrid.tsx     ← Masonry photo grid with lightbox
│   ├── LoadingScreen.tsx   ← Splash screen shown when site first loads
│   ├── ScrollAnimations.tsx ← Wraps app with Lenis smooth scroll + GSAP
│   └── WhatsAppButton.tsx  ← Floating WhatsApp button (bottom-left)
│
├── lib/                    ← Utility/helper files
│   ├── db.ts               ← Prisma database client (singleton)
│   ├── auth.ts             ← Admin session management (cookies, HMAC signing)
│   ├── animations.ts       ← Reusable Framer Motion animation variants
│   ├── supabase.ts         ← Supabase client setup
│   └── utils.ts            ← Helper functions (formatPrice, cn)
│
├── store/
│   └── cartStore.ts        ← Zustand cart state (add/remove items, totals)
│
├── data/
│   ├── menu.ts             ← Old static menu data (no longer used — DB is used now)
│   └── reviews.ts          ← Old static reviews data (no longer used)
│
├── prisma/
│   ├── schema.prisma       ← Database schema — defines tables and columns
│   └── seed.ts             ← Script to insert all 116 menu items into DB
│
├── styles/
│   └── animations.css      ← Additional CSS animation keyframes
│
├── public/                 ← Static files served directly
│   └── images/
│       └── uploads/        ← Local image uploads (only for local dev)
│
├── .env.local              ← Environment variables (secrets — NOT pushed to Git)
├── .env                    ← Prisma-specific env (DATABASE_URL, DIRECT_URL)
├── .gitignore              ← Files Git ignores (.env.local, node_modules, etc.)
├── .npmrc                  ← npm configuration (legacy-peer-deps=true for Vercel)
├── next.config.js          ← Next.js configuration (image domains, headers, etc.)
├── tailwind.config.js      ← Tailwind custom colors, fonts, animations
├── postcss.config.js       ← PostCSS (required for Tailwind to work)
└── tsconfig.json           ← TypeScript compiler configuration
```

---

## 4. How The Pages Work

### Home Page (`app/page.tsx`)
- Loads bestseller menu items from `/api/menu` and displays up to 3
- Loads approved reviews from `/api/reviews` and displays up to 3
- Shows live menu item count in the stats bar
- Contains: Hero, Specials, Philosophy section, Stats, Reviews, Visit Us CTA

### Menu Page (`app/menu/page.tsx`)
- Fetches ALL active menu items from `/api/menu` on load
- Has a sidebar with category filters (19 categories)
- Has a search bar to filter by name or description
- Clicking a card opens a modal with full dish details

### Reviews Page (`app/reviews/page.tsx`)
- Fetches approved reviews from `/api/reviews`
- Shows paginated review cards (6 per page)
- Submit form sends new review to `/api/reviews` (POST)
- New reviews appear immediately as "Pending Approval" — visible only to that user until admin approves

### Admin Page (`app/admin/page.tsx`)
- Protected — checks session on load, redirects to `/admin/login` if not authenticated
- **Menu Items tab**: Shows all items (active + hidden) with search/filter, toggle visibility, inline edit, delete
- **Add New Item tab**: Upload photo → fill details → submit
- **Gallery tab**: Upload gallery photos, view/delete existing ones
- **Review Moderation tab**: Approve or delete pending/published reviews

### Contact Page (`app/contact/page.tsx`)
- Static info (address, phone, hours, email)
- Send Message form → opens WhatsApp with pre-filled message
- Embedded Google Maps iframe (exact Raju Food Court location)

---

## 5. How The Database Works

### Database Provider
**Supabase PostgreSQL** — a cloud-hosted database. Your data lives here permanently.

### Tables (Models)

**MenuItem**
```
id           — Unique ID (auto-generated UUID)
name         — Dish name (e.g. "Masala Dosa")
description  — Dish description
price        — Price in rupees (decimal)
category     — Category (e.g. "Classic Dosa")
image        — Image URL (Supabase Storage URL)
isBestseller — Boolean (true/false)
isActive     — Boolean — if false, item is hidden from public menu
spiceLevel   — 0=mild, 1=low, 2=medium, 3=hot
ingredients  — Array of ingredient strings
createdAt    — Timestamp
updatedAt    — Timestamp
```

**Review**
```
id         — Unique ID
name       — Reviewer's name
rating     — 1 to 5
comment    — Review text
isApproved — Boolean — false = pending, true = visible to public
createdAt  — Timestamp
```

**GalleryPhoto**
```
id        — Unique ID
url       — Supabase Storage URL of the image
caption   — Optional caption text
createdAt — Timestamp
```

### How Prisma Works
Prisma is the bridge between your Next.js code and the database.

Instead of writing SQL like:
```sql
SELECT * FROM "MenuItem" WHERE "isActive" = true
```

You write JavaScript:
```js
const items = await db.menuItem.findMany({ where: { isActive: true } })
```

Prisma translates this to SQL automatically.

---

## 6. How The API Routes Work

Every file in `app/api/` is a **serverless function** — code that runs on the server, not in the browser.

### Example: `GET /api/menu`
When the menu page loads, it calls `fetch('/api/menu')`. This runs the code in `app/api/menu/route.ts`:
1. Checks if request is from admin (session cookie check)
2. Fetches items from Supabase database via Prisma
3. Sorts items by the defined category order
4. Returns JSON array of menu items

### HTTP Methods Used
| Method | Purpose |
|---|---|
| GET | Fetch/read data |
| POST | Create new data |
| PUT/PATCH | Update existing data |
| DELETE | Remove data |

### Admin Protection
All write operations (POST, PATCH, DELETE) on menu, gallery, and reviews require a valid admin session cookie. Without it, the API returns `401 Unauthorized`.

---

## 7. How Admin Authentication Works

The admin login system uses **session cookies with HMAC signing** (a security technique).

**Login flow:**
1. Admin goes to `/admin/login`, enters username + password
2. Browser sends credentials to `/api/admin/login`
3. Server compares with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env.local`
4. If correct: server creates a signed session value, stores it in an `httpOnly` cookie
5. Browser redirects to `/admin`

**Every subsequent admin action:**
1. Browser automatically sends the cookie with every request
2. Server reads the cookie, verifies the HMAC signature
3. If valid and not expired (8 hours): allows the action
4. If invalid/expired: returns 401, redirects to login

**httpOnly cookie** = JavaScript in the browser cannot read it. Only the server can. This prevents XSS attacks.

**Rate limiting** = Admin login is limited to 5 attempts per 15 minutes per IP address.

---

## 8. How Image Uploads Work

When admin uploads a photo:
1. Admin selects file in browser
2. Browser sends the file to `/api/upload` (POST with FormData)
3. Server validates: file type (JPG/PNG/WEBP only), size (max 5MB)
4. Server uploads the file to **Supabase Storage** (bucket named "uploads")
5. Supabase returns a permanent public URL
6. That URL is saved to the database as the `image` field

**Why Supabase Storage?**
Vercel's filesystem is read-only. You cannot save files directly on the server. Supabase Storage is a cloud bucket that persists permanently, like Google Drive for your images.

---

## 9. How The Frontend Animations Work

### Framer Motion
Used for:
- Page entry animations (fade up on scroll)
- Hover effects on cards (lift effect)
- Modal open/close transitions
- Loading screen slide-out

Example — a card fading up when scrolled into view:
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}      // starts invisible, 40px below
  whileInView={{ opacity: 1, y: 0 }}   // animates to visible when in viewport
  viewport={{ once: true }}             // only animates once
>
```

### Lenis Smooth Scroll
Lenis intercepts normal browser scrolling and makes it feel smooth and buttery. It's initialized in `components/ScrollAnimations.tsx` and synced with GSAP's ticker for performance.

### GSAP ScrollTrigger
Used alongside Lenis for scroll-based choreography — elements that animate precisely as you scroll.

---

## 10. How Tailwind CSS Works

Tailwind provides thousands of CSS utility classes. Instead of writing:
```css
.my-button {
  padding: 12px 24px;
  border-radius: 9999px;
  font-size: 12px;
}
```

You write directly in JSX:
```tsx
<button className="py-3 px-6 rounded-full text-xs">
```

### Custom Colors Defined (in `tailwind.config.js`)
| Name | Hex | Used For |
|---|---|---|
| `saffron` | #FF7A00 | Primary orange — CTAs, highlights |
| `gold` | #C5A880 | Secondary warm gold — labels, borders |
| `cream` | #FAF6EE | Light text color |
| `charcoal` | #0F0F0F | Dark background |
| `maroon` | #5E1914 | Danger/error states |
| `leaf` | #2E6F40 | Success/approved states |

---

## 11. Environment Variables — What Each One Does

Stored in `.env.local` (never pushed to GitHub).

```
DATABASE_URL         — Supabase connection pooler URL (for app queries)
DIRECT_URL           — Supabase direct URL (for Prisma migrations)
NEXT_PUBLIC_SUPABASE_URL          — Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  — Supabase public key
SUPABASE_SERVICE_ROLE_KEY         — Supabase secret key (for server-side uploads)
ADMIN_USERNAME       — Your admin login username
ADMIN_PASSWORD       — Your admin login password
SESSION_SECRET       — Secret key for signing session cookies (keep private)
NEXT_PUBLIC_WHATSAPP_PHONE  — WhatsApp number for contact form + floating button
```

`NEXT_PUBLIC_` prefix = accessible in the browser (public).
No prefix = server-side only (secret).

---

## 12. Deployment Flow — How Your Code Goes Live

```
You edit code locally
        ↓
git add . + git commit + git push
        ↓
GitHub receives the new code
        ↓
Vercel detects the push (webhook)
        ↓
Vercel runs: npm install --legacy-peer-deps
        ↓
Vercel runs: npm run build (next build)
        ↓
Vercel deploys the build to their CDN
        ↓
Your website is live at the Vercel URL
```

If a build fails, Vercel keeps the previous working deployment live. You then fix the error, push again, and promote the new deployment.

---

## 13. Security Measures In Place

| Measure | What It Protects |
|---|---|
| httpOnly session cookie | Admin session can't be stolen by JavaScript |
| HMAC-signed cookies | Session tokens can't be forged |
| Rate limiting on login | Prevents brute force password attacks |
| Rate limiting on reviews | Prevents review spam (3 per hour per IP) |
| Input validation on all API routes | Prevents malformed data from entering the DB |
| File type + size validation on uploads | Prevents malicious file uploads |
| Auth check on all write APIs | Only admin can create/edit/delete menu items |
| .gitignore on .env.local | Secrets never pushed to GitHub |
| Security headers (next.config.js) | Prevents clickjacking, XSS, MIME sniffing |

---

## 14. Key Files You Need To Know

| File | Why It Matters |
|---|---|
| `.env.local` | Your secrets live here. Never share this file |
| `prisma/schema.prisma` | Changing this changes your database structure |
| `app/layout.tsx` | Changes here affect EVERY page (title, navbar, footer) |
| `tailwind.config.js` | Add custom colors/fonts here |
| `next.config.js` | Configure image domains, security headers, build settings |
| `app/api/menu/route.ts` | Controls how menu data is fetched and sorted |
| `lib/auth.ts` | The admin authentication logic |
| `components/Navbar.tsx` | The navigation — change links here |

---

## 15. How To Make Common Changes

**Add a new page:**
Create a folder in `app/` with a `page.tsx` file. Next.js automatically creates the route.

**Change the menu category order:**
Edit the `CATEGORY_ORDER` array in `app/api/menu/route.ts`.

**Change admin credentials:**
Edit `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local`. On Vercel, update the environment variables in the dashboard.

**Add a new color to Tailwind:**
Add it to the `colors` object in `tailwind.config.js`, then use it as `text-yourcolor` or `bg-yourcolor`.

**Change opening hours or address:**
Update `app/contact/page.tsx` (INFO array) and `components/Footer.tsx`.

**Change the WhatsApp number:**
Update `NEXT_PUBLIC_WHATSAPP_PHONE` in `.env.local` and in Vercel environment variables.

---

## 16. Glossary — Terms You Should Know

| Term | Meaning |
|---|---|
| **Component** | A reusable piece of UI (like a card or button) |
| **API Route** | Server-side code that handles data operations |
| **Serverless Function** | Code that runs on demand in the cloud (no permanent server) |
| **ORM** | Object-Relational Mapper — lets you use JS to talk to a database |
| **Schema** | The blueprint/structure of your database tables |
| **Migration** | A change to the database structure |
| **CDN** | Content Delivery Network — serves your site from servers close to the user |
| **Environment Variable** | A secret configuration value stored outside your code |
| **httpOnly Cookie** | A browser cookie that JavaScript cannot access |
| **HMAC** | Hash-based Message Authentication Code — a way to verify data hasn't been tampered with |
| **UUID** | Universally Unique Identifier — a random ID like `f47ac10b-58cc-4372-a567-0e02b2c3d479` |
| **Hydration** | When React takes over a server-rendered HTML page and makes it interactive |
| **SSR** | Server-Side Rendering — the page HTML is generated on the server before being sent to browser |
| **CSR** | Client-Side Rendering — the browser builds the page using JavaScript |
| **Webhook** | An automatic notification sent from one service to another (GitHub → Vercel) |

---

*Documentation generated for Raju Food Court website project — June 2026*
