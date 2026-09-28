# MaWa African Market — Website + Admin Dashboard + Customer Accounts

Next.js 14 (App Router) · TypeScript · Tailwind · Prisma · Neon Postgres · ImageKit · NextAuth

## 1. Setup

```bash
npm install
cp .env.example .env      # then fill in the values (see below)
npx prisma db push        # creates the tables in Neon
npm run seed              # loads 6 admin defaults + 13 categories + 449 products (safe to re-run)
npm run dev
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon dashboard → **pooled** connection string |
| `DIRECT_URL` | Neon dashboard → **direct** (non-pooled) connection string |
| `NEXTAUTH_SECRET` | run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | your live URL (or `http://localhost:3000`) |
| `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` | ImageKit → Developer Options |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | first admin login — **change the password right away** |

## 2. Deploy (Vercel)

Push to GitHub → import in Vercel → add the same env vars → deploy. Run
`npx prisma db push && npm run seed` once against the production database.

## 3. Pages

**Public:** Home · Shop (search, category filter, add-to-cart) · Cart · Checkout · About · Contact
**Customer accounts:** `/account/register`, `/account/login`, `/account` (profile), `/account/orders`
(order history). A logged-in customer's cart is saved to their account and follows them across devices.
**Admin (`/admin`):** Dashboard · Orders (status updates, call customer) · Products (search, photo upload,
availability, featured) · Categories · Homepage · About · Store Info · Hours · Ordering (delivery fee/minimum,
tax as % or flat fee) · Settings

Admin and customers share one login system but have separate roles — middleware keeps customers out of
`/admin` and admins out of customer-only pages.

## 4. Things to know before launch

- **Prices are enforced on the server.** The order API recomputes every price, the delivery fee and tax
  from the database, so a browser can't tamper with totals.
- **6 products have no fixed price** (weight/register-priced: Yam, Tilapia, Cat Fish, Tomatoes, Onion 2.5lb
  bag, Dry Chicken). They're hidden from the shop until a price is set in **Admin → Products**.
- **~139 products sit in "Other / Specialty Items"** — re-categorize anytime from Admin → Products.
- **Tax:** the client's Clover data lists Atlanta sales tax at **8.9%** — set it in Admin → Ordering
  (percentage mode) once confirmed.
- Delivery is **off** until a delivery fee is configured. No online payment — orders are paid at pickup/delivery.
- **Security note:** this project is on Next.js 14.2.35 (latest 14.x). Some newer advisories are only fixed in
  Next 16, so plan a supervised upgrade to Next 16 as a follow-up. Deploying on Vercel provides platform-level
  mitigation in the meantime.
- Product photos aren't included yet — upload them in Admin → Products (works from a phone).
