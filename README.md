# Raju Madras Cafe - Ultra-Premium Full-Stack Web Application

This is a complete, production-ready, full-stack digital experience for **Raju Madras Cafe**, a premium pure vegetarian South Indian brand located in Gujarat. The website leverages modern motion design, smooth storytelling interactions, and a clean database-backed takeaway ordering flow.

---

## 🚀 Technology Stack

* **Frontend Framework**: Next.js 15+ (App Router)
* **Programming Language**: TypeScript
* **Styling & Theme**: Tailwind CSS
* **Animations**: Framer Motion, GSAP (ScrollTrigger), & Lenis Smooth Scroll
* **Database Integration**: Supabase (PostgreSQL)
* **ORM Schema Mapping**: Prisma ORM
* **Global State Management**: Zustand

---

## 📂 Project Architecture

```text
raju-madras-cafe/
│
├── prisma/
│   └── schema.prisma          # Database schema declaration
│
├── public/
│   ├── images/
│   │   └── uploads/           # Holds locally uploaded recipe images
│   └── videos/
│
├── app/
│   ├── layout.tsx             # Root layout with loaders, cursors, & lenis providers
│   ├── page.tsx               # Cinematic homepage sections
│   ├── globals.css            # Styles definitions, buttons, and scrollbar classes
│   │
│   ├── about/page.tsx         # Legacy timeline narrative
│   ├── menu/page.tsx          # Real-time category-search dish interface
│   ├── takeaway/page.tsx      # Ordering dashboard
│   ├── gallery/page.tsx       # Masonry visual showcase
│   ├── reviews/page.tsx       # Verified feedback submission portal
│   ├── contact/page.tsx       # Address details & customized Maps embed
│   ├── admin/page.tsx         # Commands Dashboard (Orders, Moderation, Menu Items)
│   │
│   └── api/
│       ├── menu/route.ts      # Menu item creation and query APIs
│       ├── orders/route.ts    # Booking state and list handlers
│       ├── reviews/route.ts   # Moderation approvals, posts, and deletes
│       └── upload/route.ts    # Multi-part binary image writes
│
├── components/
│   ├── Navbar.tsx             # Floating glassmorphic navigation
│   ├── Footer.tsx             # High-end footer details
│   ├── HeroSection.tsx        # Cinematic introduction slides
│   ├── MenuCard.tsx           # Recipe display & info modal
│   ├── GalleryGrid.tsx        # Responsive image layout
│   ├── ReviewCard.tsx         # Guest testimonial widget
│   ├── FloatingCart.tsx       # Checkout details and WhatsApp redirection builder
│   ├── LoadingScreen.tsx      # Preloader loading counter
│   ├── ScrollAnimations.tsx   # GSAP and smooth scroll wrapper
│   └── WhatsAppButton.tsx     # Floating quick inquiry CTA
│
├── lib/
│   ├── db.ts                  # Single-instance Prisma Client
│   ├── supabase.ts            # Supabase instance config
│   ├── utils.ts               # Merge utils & INR price formatters
│   └── animations.ts          # Page stagger animations variants
│
├── store/
│   └── cartStore.ts           # Zustand shopping cart state & localStorage persistence
│
├── styles/
│   └── animations.css         # Keyframes, cursor styling, and Lenis CSS rules
│
└── data/
    ├── menu.ts                # Static menu items seed backup
    └── reviews.ts             # Static testimonials seed backup
```

---

## 🛠️ Step-by-Step Installation & Local Setup

### 1. Initialize local repository & Install dependencies
Navigate to your project directory and run:
```bash
# Install NPM packages
npm install
```

### 2. Configure Environment Variables
Rename the template `.env.local` or create a new one at the root directory:
```bash
# Database connections
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase Auth/Storage keys (optional)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# WhatsApp Number for Takeaway forwards
NEXT_PUBLIC_WHATSAPP_PHONE="+919876543210"
```

### 3. Sync Database Schema using Prisma
We configure Prisma ORM to map structural tables to the Supabase database. Run:
```bash
# Generate Prisma JavaScript Client
npx prisma generate

# Create and push tables schema directly to PostgreSQL database
npx prisma db push
```

### 4. Run Development Server
```bash
# Start local Next.js hot-reload environment
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## ⚡ Supabase Database Setup Steps

1. Create a free account at [Supabase.com](https://supabase.com/).
2. Create a new project called `raju-madras-cafe` and configure a database password.
3. Once provisioned, navigate to **Project Settings -> Database**.
4. Retrieve the **Connection string** (select the **URI** format). 
   * Copy the **Transaction** mode connection pool string (port 5432) to `DATABASE_URL` (add `&connection_limit=1` to the end).
   * Copy the **Session** direct connection string (usually port 5432 or 6543) to `DIRECT_URL`.
5. Run `npx prisma db push` locally to generate the `MenuItem`, `Order`, and `Review` tables in your Supabase database.

---

## 📦 Production Deployment

### 1. Push to GitHub
Initialize your Git repository, commit files, and push to GitHub:
```bash
git init
git add .
git commit -m "feat: initial commit for Raju Madras Cafe web application"
git branch -M main
git remote add origin https://github.com/your-username/raju-madras-cafe.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com/) and click **Add New -> Project**.
2. Connect your GitHub repository.
3. Add your Environment variables under **Environment Variables** (DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_WHATSAPP_PHONE, etc.).
4. Click **Deploy**. Vercel will build the project automatically.
