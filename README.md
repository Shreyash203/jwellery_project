# Jewellery store

Responsive jewellery storefront inspired by Aura Lifestyle. Next.js + TypeScript + Prisma + PostgreSQL, with Tailwind tooling and custom styling. Frontend and backend are separate modules in a single project and Render service.

## Features

Collection filters, search, sorting, product detail dialogs, persistent browser cart, quantity controls, shipping totals, cash-on-delivery checkout, server-side validation, server-calculated prices, and database-backed orders. The catalogue is a sample stored in code. This is an inspired starter, not a pixel-identical copy or Shopify integration.

## Run locally (PowerShell)

1. Run npm ci.
2. Copy .env.example to .env and replace DATABASE_URL with your Neon PostgreSQL connection string.
3. Run npm run db:push to create the Order table.
4. Run npm run dev and open http://localhost:3000.

Browsing and cart work without a database. Real orders require DATABASE_URL and the table. Production commands: npm run build, then npm start.

## Your free deployment steps

1. Create an account at https://neon.com and select Free. Create a database and open Connect. Copy its PostgreSQL connection string with SSL enabled.
2. Put it in your local .env as DATABASE_URL. Never commit credentials. Run npm run db:push against that database.
3. Create an account at https://render.com, connect GitHub, and select this repository under New > Web Service.
4. Choose Node runtime and Free instance. Build: npm ci && npm run build. Start: npm start.
5. Add DATABASE_URL as a secret environment variable. Optionally set NEXT_PUBLIC_CONTACT_EMAIL to your public business email before building.
6. Deploy. Render supplies an onrender.com address and can automatically deploy later Git pushes.
7. Test checkout and verify the order in Neon SQL Editor or with npx prisma studio locally.

You can alternatively use New > Blueprint to load render.yaml. It declares only a Free web service; no paid database. Keep all services on Free if you require zero spend.

Render Free sleeps after 15 minutes without traffic and can take about a minute to wake. Neon and image hosts have free usage quotas. Render Free PostgreSQL expires after 30 days, so this project uses external Neon instead. Free hosting depends on remaining within quotas.

## Before taking real orders

- Replace lib/products.ts with your real products, prices, descriptions, and image URLs. Upload your own images to Cloudinary Free and use its HTTPS URLs. Current Unsplash photographs are illustrative samples, not guaranteed matches.
- Replace the Aura brand and page metadata if this is not your business.
- Set your business email and add accurate privacy, returns, shipping, delivery, sizing, materials, and availability information. Current policies are placeholders.
- Confirm the Rs.79 shipping fee and free shipping threshold of Rs.1,999 in lib/products.ts.
- Test a real database order. No online payment or email/SMS confirmation is included.

## Scope

Products are stored in code and updated through Git. The database currently stores orders only. No customer accounts, admin dashboard, stock reservation, or payment gateway. Use Neon SQL Editor or Prisma Studio to view orders. No public order-list API is exposed. Amounts are whole rupees, and the server ignores client-supplied prices.

Add abuse protection and request idempotency before opening checkout to significant public traffic. There is no stock enforcement yet. Never store card details.

## Structure

- app/store.tsx: frontend and cart UI
- app/globals.css: responsive styling
- app/api/orders/route.ts: backend order API
- app/api/health/route.ts: health check
- lib/products.ts: sample catalogue and pricing rules
- lib/db.ts: server-side database client
- prisma/schema.prisma: database schema
- render.yaml: Free hosting configuration

## Checks

npm run build includes TypeScript validation. npm run typecheck checks types separately. Successful order persistence requires a live database. Prisma 6.12.0 is pinned to avoid a reported vulnerable transitive dependency in later Prisma 6 CLI releases at setup time. Run npm audit and maintain dependencies regularly.
