# Jewellery store — separate frontend and backend

## Folder layout

frontend/ — Next.js UI, styling, cart and checkout form. Own package.json and .env.local.
backend/ — Express HTTP API, product catalogue, Prisma schema and database connection. Own package.json and .env.

The frontend never accesses PostgreSQL. It calls the independent backend over HTTP. The backend validates orders and calculates prices from its own catalogue. No API routes remain in Next.js.

## Local setup

Use two PowerShell terminals.

### Terminal 1: backend

cd backend
npm ci
Copy-Item .env.example .env

Edit backend/.env. Set DATABASE_URL to your free Neon PostgreSQL connection string. Keep FRONTEND_URL=http://localhost:3000 and PORT=4000.

npm run db:push
npm run dev

Backend: http://localhost:4000. Products: /api/products. Health: /api/health. Orders: POST /api/orders.

### Terminal 2: frontend

cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev

Frontend: http://localhost:3000. NEXT_PUBLIC_API_URL must be http://localhost:4000, without /api at the end. Always start the backend to load the catalogue. Browsing works without DATABASE_URL; saving orders requires it.

## Free Render deployment: two services

1. Push the repository to GitHub. From the repository root: git push -u origin main.
2. Create a free Neon database at https://neon.com. Put the SSL-enabled connection string in backend/.env locally and run npm run db:push from backend/ to create the Order table. Do not commit credentials.
3. Render backend: New > Web Service, connect this repository, root directory backend, Node runtime, Free instance. Build: npm ci && npm run build. Start: npm start. Set DATABASE_URL to the Neon secret. Set FRONTEND_URL to your frontend's exact public HTTPS origin, with no trailing slash. Once deployed, copy its public URL.
4. Render frontend: New > Static Site, same repository, root directory frontend. Build: npm ci && npm run build. Publish directory: out. Set NEXT_PUBLIC_API_URL to your backend's public HTTPS URL. Optionally set NEXT_PUBLIC_CONTACT_EMAIL to your public store email.
5. Update backend FRONTEND_URL to the actual frontend URL after Render assigns it and redeploy the backend. If NEXT_PUBLIC_API_URL changes, rebuild the frontend because Next.js embeds it at build time.
6. Test checkout and verify the order in Neon SQL Editor or run npx prisma studio locally from backend/.

render.yaml also declares these two services for a Render Blueprint. It creates a free backend and static frontend, with no paid Render database. Enter each public URL in the environment variables as above.

The free backend sleeps after inactivity and can take about a minute to wake. Both services count toward applicable free quotas. Keep all services on free plans to avoid upfront hosting costs. PostgreSQL is on Neon, not Render's expiring free database.

## Content and limits

This is a starter inspired by Aura Lifestyle, with sample products and illustrative Unsplash photos. It is not a pixel-identical copy or a Shopify integration. Edit backend/src/products.ts for catalogue and prices; frontend/lib/products.ts contains presentation sample images and formatting helpers. The shop catalogue comes from the backend API.

Replace branding, photos, prices, business contact and policies before taking orders. No customer accounts, admin dashboard, stock reservation, online payment or email/SMS notifications are included. Cash on delivery only. Add abuse protection and idempotency before significant public traffic. Never store card details. All order amounts are whole rupees.

## Verification

backend: npm run build and npm test. API tests cover CORS, input validation, invalid products, duplicate lines, server-controlled prices and free shipping using an injected test persistence function. Real Neon order persistence still needs your database.
frontend: npm run build and npm run typecheck. The frontend exports static files to out/.

Prisma 6.12.0 is pinned to avoid a reported transitive dependency issue in later Prisma 6 CLI releases at setup time. Maintain dependencies and run npm audit regularly.
