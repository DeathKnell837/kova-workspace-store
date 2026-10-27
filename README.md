# KOVA Workspace Store

KOVA is being prepared as a Philippine desk-organization storefront. The collection and checkout remain disabled until product availability, supplier fulfillment, shipping charges, store policies, and merchant payment credentials are confirmed.

## Commerce architecture

- Static storefront in `index.html` and `storefront.js`.
- Shared Vercel API handlers under `api/` for the catalog, checkout, PayMongo webhook, order tracking, and admin operations.
- Netlify function wrappers under `netlify/functions/` serve the same `/api/*` routes. `netlify.toml` configures Node 20, and `scripts/build-netlify.mjs` copies only public files to `dist/`.
- Supabase Postgres schema in `supabase/schema.sql`; all tables have RLS enabled and no public policies. The Supabase secret key belongs only in server environment variables.
- PayMongo v2 hosted checkout; payment state changes only after a signed webhook validated against the order number, checkout session, amount, and currency.
- `/admin.html` provides a token-protected order desk for supplier handoff, tracking updates, and product management. Supplier orders are entered manually until a suitable supplier integration is confirmed.

## Netlify deployment

1. In Netlify, choose **Add new project → Import an existing project → GitHub**, then select this repository. Keep the team on the Free plan.
2. Netlify reads `netlify.toml`: build command `npm run build:netlify`, publish directory `dist`, Node.js 20, and functions in `netlify/functions`.
3. Set the server environment variables from `.env.example` in the Netlify project settings. Keep checkout and confirmation flags `false` until launch prerequisites are met. Never commit real keys or put server secrets in frontend variables.
4. After deploying, set `STORE_BASE_URL` to the HTTPS `netlify.app` URL. Keep checkout disabled while setting this up.
5. Once a dedicated KOVA Supabase project is approved, run `supabase/schema.sql` in it and add its URL and secret key as server-only variables in Netlify.
6. Once a PayMongo merchant account and test keys are available, register `<STORE_BASE_URL>/api/paymongo-webhook` for `checkout_session.payment.paid` and add the signing secret as a server-only variable.
7. Complete `docs/launch-checklist.md`. Do not enable live checkout until stock, supplier fulfillment, shipping, policies, and merchant approval are confirmed.

The Netlify publish folder contains only public HTML and JavaScript. API source files are bundled into server functions and are not copied into the static site. The Vercel API handlers remain available for the existing Vercel preview.

See `docs/launch-checklist.md` and `docs/dropship-research.md` for prerequisites and current niche research.
