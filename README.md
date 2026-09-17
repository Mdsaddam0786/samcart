# SamCart

A marketplace where sellers list products and buyers can browse, add to cart, and check out.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **PostgreSQL** + **Prisma**
- **NextAuth.js (Auth.js v5)** — credentials login, JWT sessions, role-based access
- **Tailwind CSS** for styling
- **Stripe Checkout** for payments (optional — see below)

## Roles

- **Admin** — manages all users, products, and orders
- **Seller** — lists and manages their own products, views and fulfills their orders
- **Buyer** — browses products, purchases, views their own order history

## Getting started

1. **Start a local Postgres database** (Docker required):

   ```bash
   docker compose up -d
   ```

   This starts Postgres on `localhost:5433` (5432 was already in use on this machine by another project — adjust the port in `docker-compose.yml` and `.env` if needed).

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**: copy `.env.example` to `.env` and fill in `AUTH_SECRET` (generate one with `npx auth secret`). `DATABASE_URL` already matches the Docker setup above.

4. **Push the schema and seed demo data**:

   ```bash
   npm run db:push
   npm run db:seed
   ```

   Seed creates three demo accounts (password `password123` for all):
   - `admin@samcart.dev` — Admin
   - `seller@samcart.dev` — Seller (owns the seeded demo products)
   - `buyer@samcart.dev` — Buyer

5. **Run the dev server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Payments

Checkout works out of the box without any payment provider configured — it simulates an instant successful payment so you can test the full buyer flow immediately.

To enable real Stripe Checkout, set `STRIPE_SECRET_KEY` (and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) in `.env` with your Stripe test keys. When configured, checkout redirects to a real Stripe Checkout session and the order is marked paid once Stripe confirms the payment.

## Project structure

- `src/app` — pages and API routes (App Router)
- `src/components/ui` — base UI primitives (Button, Input, Card, Badge)
- `src/components/shared` — feature components (forms, navbar, cart, dashboards)
- `src/lib` — Prisma client, auth config, validation schemas, Stripe client
- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — demo data seed script
