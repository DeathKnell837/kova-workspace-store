# KOVA Workspace Store

KOVA is now taking an affiliate-first path for a zero-budget start. It is an editorial workspace guide, not a direct-sale dropshipping shop. The site currently has no affiliate approval or tracked product links, so it does not accept orders or represent products as available from KOVA.

## Commerce architecture

- Public editorial pages in `index.html` and `guides/`, with `robots.txt` and `sitemap.xml` for search discovery. Pages make no earnings, testing, stock, or delivery guarantees.
- `docs/quiet-launch-kit.md` contains researched launch guidance and post drafts that do not require the owner to appear on camera.
- The earlier direct-sale backend remains dormant in `api/`, `netlify/functions/`, and Supabase. PayMongo checkout is disabled; the affiliate-first site does not use those endpoints.
- Netlify reads `netlify.toml`; `scripts/build-netlify.mjs` publishes only the editorial site, its guides, policy page, robots file, and sitemap. It intentionally does not publish the old cart/order UI or admin desk.
- Supabase Postgres schema in `supabase/schema.sql`; all tables have RLS enabled and no public policies. The Supabase secret key belongs only in server environment variables.
- PayMongo v2 hosted checkout; payment state changes only after a signed webhook validated against the order number, checkout session, amount, and currency.
- Old direct-sale order/admin handlers are retained only in source pending any future product model decision; they are not published as site pages.

## Netlify deployment

1. In Netlify, choose **Add new project → Import an existing project → GitHub**, then select this repository. Keep the team on the Free plan.
2. Netlify reads `netlify.toml`: build command `npm run build:netlify`, publish directory `dist`, Node.js 20, and functions in `netlify/functions`.
3. Set the server environment variables from `.env.example` in the Netlify project settings. Keep checkout and confirmation flags `false` until launch prerequisites are met. Never commit real keys or put server secrets in frontend variables.
4. After deploying, set `STORE_BASE_URL` to the HTTPS `netlify.app` URL. Keep checkout disabled while setting this up.
5. The dedicated KOVA Supabase project is `kova-workspace-store` in Singapore. Its schema is applied; `SUPABASE_URL` and the production-only `SUPABASE_SECRET_KEY` are configured in Netlify. Never add the secret key to Git or frontend code.
6. Once a PayMongo merchant account and test keys are available, register `<STORE_BASE_URL>/api/paymongo-webhook` for `checkout_session.payment.paid` and add the signing secret as a server-only variable.
7. Complete `docs/launch-checklist.md`. Do not enable live checkout until stock, supplier fulfillment, shipping, policies, and merchant approval are confirmed.

The Netlify publish folder contains only public HTML and JavaScript. API source files are bundled into server functions and are not copied into the static site. The Vercel API handlers remain available for the existing Vercel preview.

The remaining human step is applying to Lazada's affiliate program using accurate identity, payout, and tax information. After approval, register KOVA's website as a promotional media placement if Lazada requires it, and wait for that media placement to be approved before publishing affiliate links. The homepage currently shows editorial recommendations as pending and has no product purchase links. After the channel is approved, provide KOVA with generated product tracking links so they can be reviewed and added. Never put account passwords, ID documents, or bank details in this repository.

The responsive homepage includes a no-signup setup finder, filters for workspace ideas, guide cards, FAQs, mobile navigation, and an affiliate disclosure. The setup finder runs locally in the browser and does not collect visitor information.

See `docs/launch-checklist.md`, `docs/dropship-research.md`, and `docs/quiet-launch-kit.md` for the current plan and research.
