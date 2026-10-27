# KOVA launch checklist

## Store and supplier

- [ ] Confirm the legal seller name, contact email, customer support hours, and return address.
- [ ] Choose the initial delivery area (assumed Philippines) and verify delivery coverage and fee by province/postal zone.
- [ ] Select a supplier only after reviewing exact SKU costs, live stock, fulfillment timelines, COD remittance/fees, failed-delivery return costs, packaging, and reselling/photo permissions.
- [ ] Order samples and verify quality, dimensions, materials, packaging, and actual delivery time.
- [ ] Enter supplier-confirmed products, retail prices, photos, stock states, and terms in the KOVA products table. Keep unverified products inactive.
- [ ] Publish shipping, returns/refunds, privacy, terms, and customer service policies with real business details.
- [ ] Check Trustmark registration and BIR obligations with DTI/BIR; do not display a Trustmark badge until it is issued.

## Accounts and deployment

- [ ] Create/authorize a dedicated Supabase project for KOVA and run `supabase/schema.sql`.
- [ ] Set Vercel server environment variables from `.env.example`; never expose server secrets in frontend variables. Keep `STORE_CHECKOUT_ENABLED=false` until all launch gates pass.
- [ ] Create a PayMongo **test** key and webhook secret. For preview testing, register the current Vercel preview URL plus `/api/paymongo-webhook` for `checkout_session.payment.paid`; preview checkout returns to its own preview deployment.
- [ ] For production, register `https://kova-workspace-store.vercel.app/api/paymongo-webhook` with the live webhook secret after the production payment setup is approved.
- [ ] Set a long random admin token; keep it private. Use `/admin.html` to view orders and enter fulfillment/tracking details.
- [ ] Configure and test buyer order tracking, checkout, email receipt, payment webhook, and supplier handoff using test mode.
- [ ] Only after the seller account is approved, switch Vercel to the PayMongo live key and live webhook secret, set `PAYMONGO_MODE=live`, set a verified shipping fee, set `STORE_SHIPPING_CONFIRMED=true`, `STORE_POLICIES_CONFIRMED=true`, `SUPPLIER_FULFILLMENT_CONFIRMED=true`, and finally set `STORE_CHECKOUT_ENABLED=true`.

## Current implementation boundary

The supplier step is deliberately a manual order-desk handoff until KOVA has a supplier account/API that supports this custom Vercel storefront. COD is not enabled because no carrier/supplier account is connected. Do not accept live payments until product availability, shipping costs, business policies, and merchant approval are confirmed.
