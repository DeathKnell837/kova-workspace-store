# KOVA launch checklist

## Current plan: affiliate first

- [x] Choose a no-inventory, no-camera business model for the zero-budget start. KOVA is an editorial guide; it does not take payment or fulfill products.
- [x] Publish three practical desk setup guides and add affiliate disclosure, search metadata, `robots.txt`, and `sitemap.xml`.
- [ ] Rogie: apply directly to the [Lazada Philippines Affiliate Program](https://pages.lazada.com.ph/wow/i/ph/corp/affiliate-howitworks?hybrid=1). Use accurate legal identity, tax, and bank payout information on Lazada only. Program approval is not guaranteed.
- [ ] Register KOVA's website as an affiliate promotional media placement in Lazada if required, and wait for Lazada to approve that placement before publishing promotional materials or affiliate links. Personal account review and website/media approval may be separate steps.
- [ ] After both required approvals, generate tracked product links and send only those links to Codex. Do not send passwords, identity documents, or banking details.
- [ ] Check each retailer listing, item specs, price, permitted images, and terms; then add a visible affiliate disclosure next to recommendations.
- [ ] Publish optional written/static posts after links are live. No founder video or personal appearance is required. Organic traffic and earnings are not guaranteed.
- [ ] Confirm the current Philippine payout methods, supported bank list, required tax details, and payout minimum in the signed-in Lazada dashboard or with affiliate support before entering payment details. Lazada's public affiliate pages currently conflict on bank-only vs. bank/PayPal payment and the minimum; do not guess.

The direct-sale checklist below is retained for a possible future return to dropshipping. It is not the active plan and checkout must remain disabled.

## Store and supplier

- [ ] Confirm the legal seller name, contact email, customer support hours, and return address.
- [ ] Choose the initial delivery area (assumed Philippines) and verify delivery coverage and fee by province/postal zone.
- [ ] Select a supplier only after reviewing exact SKU costs, live stock, fulfillment timelines, COD remittance/fees, failed-delivery return costs, packaging, and reselling/photo permissions.
- [ ] Order samples and verify quality, dimensions, materials, packaging, and actual delivery time.
- [ ] Enter supplier-confirmed products, retail prices, photos, stock states, and terms in the KOVA products table. Keep unverified products inactive.
- [ ] Publish shipping, returns/refunds, privacy, terms, and customer service policies with real business details.
- [ ] Check Trustmark registration and BIR obligations with DTI/BIR; do not display a Trustmark badge until it is issued.

## Accounts and deployment

- [x] Create a dedicated Supabase project for KOVA in the Singapore region and apply `supabase/schema.sql` with RLS enabled and no public policies.
- [x] Configure Netlify production `SUPABASE_URL` and the secret `SUPABASE_SECRET_KEY`; configure `STORE_BASE_URL` as `https://kova-workspace-store.netlify.app`. Never expose server secrets in frontend variables.
- [x] Verify the live catalog endpoint responds successfully and checkout remains disabled. Deploy previews use their preview URL automatically.
- [ ] Create a PayMongo test key and webhook secret. Register `<STORE_BASE_URL>/api/paymongo-webhook` for `checkout_session.payment.paid`; keep checkout disabled until the full test journey works.
- [ ] Set a long random admin token; keep it private. Use `/admin.html` to view orders and enter fulfillment/tracking details.
- [ ] Configure and verify buyer order tracking, checkout, email receipt, payment webhook, and supplier handoff in test mode before launch.
- [ ] Only after the seller account is approved, switch production to the PayMongo live key and live webhook secret, set `PAYMONGO_MODE=live`, set verified shipping and supplier details, confirm the store policies, and finally enable `STORE_CHECKOUT_ENABLED=true`.

## Current implementation boundary

The supplier step is deliberately a manual order-desk handoff until KOVA has a supplier account or API that supports this custom storefront. COD is not enabled because no carrier or supplier account is connected. Do not accept live payments until product availability, shipping costs, business policies, and merchant approval are confirmed.

## Current status

The live Netlify site is `https://kova-workspace-store.netlify.app/`. The KOVA database is connected, but the catalog is empty because no supplier-confirmed items have been added. Checkout remains disabled. See `dropship-research.md` for the current zero-budget supplier assessment.
