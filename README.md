# KOVA Workspace Store

KOVA is being prepared as a Philippine desk-organization storefront. The current collection and checkout remain disabled until product availability, supplier fulfillment, shipping charges, store policies, and merchant payment credentials are confirmed.

## Commerce architecture

- Static storefront in `index.html` and `storefront.js`.
- Vercel serverless API routes under `api/` for product catalog, checkout, PayMongo webhooks, order tracking, and admin order/product management.
- Supabase Postgres schema in `supabase/schema.sql`; all tables have RLS enabled and no public policies. The Supabase service key belongs only in Vercel server environment variables.
- PayMongo v2 hosted checkout; payment state changes only after a signed webhook, validated against the order number, checkout session, amount, and currency.
- `/admin.html` provides a token-protected order desk for supplier handoff, tracking updates, and product management. Supplier orders are entered manually until KOVA has a supplier integration suitable for this custom store.

## Setup

1. Create a dedicated Supabase project for KOVA. Run `supabase/schema.sql` there; do not use another app’s database.
2. Add the server environment variables in `.env.example` to Vercel. Never use `NEXT_PUBLIC_` for server secrets.
3. Register a PayMongo webhook at `/api/paymongo-webhook` for `checkout_session.payment.paid` and set its endpoint signing secret in Vercel.
4. Enter verified supplier products in `/admin.html`. New items start inactive and unverified; list them only after checking samples, SKU costs, inventory, image rights, shipping, and returns.
5. Complete the launch checklist in `docs/launch-checklist.md`. Keep checkout disabled and use PayMongo test mode until the full order journey works.

See `docs/launch-checklist.md` and `docs/dropship-research.md` for current prerequisites and the researched niche recommendation.
