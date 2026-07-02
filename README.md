# Marchand — Ecommerce Site (Next.js + TypeScript + Tailwind)

A small ecommerce site with role-based dashboards, a cart, and admin product management —
all persisted in the browser's `localStorage` (no backend required).

## Features

- **Product list** on the home page, seeded with 3 sample products
- **Two roles**: `admin` and `customer`, chosen at registration
- **Cart**: add to cart, remove, increment/decrement quantity — saved to `localStorage`
- **Admin**: add new products with an image picked from your computer (stored as base64),
  name, and price
- **Role-based dashboard** (only visible/accessible when logged in):
  - Admin: total registered users + a bar chart of products created in the last 7 days
  - Customer: their cart summary
- **Navbar**: logo (left), nav links (center, active link highlighted), cart + user info (right),
  fully responsive with a mobile menu
- **Auth**: register/login saved to `localStorage` (demo-level, not hashed — fine for an assignment,
  not production-ready)

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

A demo admin account is auto-created the first time you load the app:

- Email: `admin@shop.com`
- Password: `admin123`

Or register your own account and pick "admin" or "customer" as the account type.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Hand-rolled shadcn/ui-style components (Button, Input, Label, Card) — the shadcn CLI
  registry wasn't reachable from this environment, so these were written by hand in the
  same style; you can swap them for `npx shadcn add ...` locally if you want the originals
- `recharts` for the dashboard bar chart
- `lucide-react` for icons

## Deploying (for your "Live Link")

The easiest option is Vercel:

1. Push this project to a GitHub repo
2. Go to vercel.com/new, import the repo
3. Leave the defaults (Next.js is auto-detected) and click Deploy
4. You'll get a live URL to submit

## Notes / things to know

- All data (users, products, cart) lives in the browser's `localStorage`, so it's
  per-device/per-browser, not shared across users — that matches the assignment spec.
- Images are stored as base64 strings in `localStorage`. Fine for a demo, not efficient for
  a real app with many/large images.
- Passwords are stored in plain text in `localStorage` for demo purposes only. Never do this
  in a real production app.
