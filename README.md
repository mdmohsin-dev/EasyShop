# Marchand — Full-Stack Ecommerce (Next.js + Prisma + Better Auth)

## Stack
- Next.js 16 (App Router) + TypeScript
- PostgreSQL + Prisma ORM
- Better Auth (email/password, DB-backed sessions)
- Cloudinary (product + profile images)
- SSLCommerz (sandbox payment gateway)
- Tailwind CSS v4 + hand-rolled shadcn-style components
- recharts, lucide-react

## Setup

```bash
npm install
cp .env.example .env   # fill in real values, see below
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed     # creates the one ADMIN account from SEED_ADMIN_* env vars
npm run dev
```

## Environment variables (see `.env.example`)

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | NeonDB (or any Postgres) connection string |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your real domain in prod |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `CLOUDINARY_*` | cloudinary.com dashboard |
| `SSLCOMMERZ_*` | developer.sslcommerz.com sandbox registration |
| `SEED_ADMIN_*` | whatever you want the one seeded admin's login to be |

## How auth/roles work

- Everyone who registers through `/register` becomes a `CUSTOMER` — the `role`
  field is explicitly blocked from client input in `lib/auth.ts`
  (`input: false`) so nobody can promote themselves to `ADMIN` by tampering
  with the signup request.
- The one `ADMIN` account is created by `npx prisma db seed`, from
  `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`. To promote someone
  else later, update their `role` directly in the DB (Prisma Studio: `npx
  prisma studio`).

## How the guest cart → DB cart merge works

- Not logged in: cart lives in `localStorage` (`CartContext.tsx`).
- The moment `useSession()` reports a logged-in user, `CartContext` POSTs the
  guest cart to `/api/cart/merge` once, then switches to reading/writing the
  DB-backed cart for the rest of the session.

## Payment flow (SSLCommerz)

1. `/checkout` → `POST /api/orders` turns the cart into a `PENDING` order.
2. `POST /api/payment/init` starts an SSLCommerz session for that order and
   returns a `GatewayPageURL`; the browser is redirected there.
3. SSLCommerz's servers POST back to `/api/payment/success` (or `/fail`,
   `/cancel`) directly — not through the user's browser, so those routes
   don't check a session cookie; they re-validate the payment with
   SSLCommerz itself using `val_id` before trusting it, then update the
   order and redirect the user to `/checkout/success` or `/checkout/fail`.

## Things worth knowing before you deploy

- This sandbox couldn't run `npx prisma generate` or connect to a real
  Postgres instance (its network is restricted), so the Prisma-dependent
  code was written and type-checked as carefully as possible but never run
  end-to-end. Run it locally first and watch for anything Prisma-specific.
- SSLCommerz sandbox credentials are required to test payment — real charges
  won't happen in sandbox mode (`SSLCOMMERZ_IS_LIVE=false`).
- Image uploads go straight to Cloudinary; nothing is stored as base64
  anymore.
