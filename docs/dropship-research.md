# KOVA dropshipping launch research

**Prepared:** 27 October 2026
**Initial market assumption:** Philippines (the current storefront was configured for PHP and PayMongo).

## Recommendation

Keep KOVA’s desk/workspace identity and run a small **desk organization** pilot: cable organizers, compact laptop stands, and small desktop storage. Prefer products that are compact, non-electrical, simple to demonstrate in short videos, and available from a Philippine warehouse. Treat this as a test niche, not a proven “winning product” claim.

There is a trade-off: Philippine data shows strong demand in clothing/accessories, consumer electronics, and beauty/personal care, but not a specific breakout in desk organizers. Those categories also carry more sizing/returns, safety, authenticity, or compliance risk. Desk organization is a reasonable brand fit and lower-complexity pilot, but validate it with supplier inventory, samples, and actual customer response before buying ads or promising stock.

## What the evidence says

- HKTDC’s 2025 survey says electronics, fashion, and cosmetics/personal care were the most commonly purchased categories among Filipino online shoppers it surveyed. The same survey says product quality and seller information matter, and over 70% expected delivery within three days. [HKTDC, Philippines e-commerce opportunities](https://beltandroad.hktdc.com/en/insights/insights-e-commerce-opportunities-philippines-positioning-hong-kong-products)
- The Philippine Statistics Authority’s 2024 NICTHS says clothing, footwear, sporting goods, or accessories were the most common goods bought online; it also reports that 97.6% of online buyers preferred cash on delivery and 87.9% of online sellers accepted COD. This is broad household survey evidence, not proof that COD will work with a particular supplier or courier. [PSA, 2024 NICTHS highlights](https://rsso02.psa.gov.ph/content/highlights-2024-national-information-and-communications-technology-household-survey-2024-2)
- Dropify advertises local and international suppliers, warehouse fulfillment, COD, and product catalogs. Its public catalog names footwear, bags, baby, kitchen, sleep/bath, and general deals; it does not publicly establish desk-organization SKUs. Ask for current catalog access, actual stock locations, item-level costs, delivery SLAs, return-to-seller rules, and unbranded packaging before choosing it. [Dropify PH](https://dropify.ph/)
- BilisBenta says its dropshippers can view inventory linked to Lazada Seller Center, and that orders can be pushed to a supplier’s system. Confirm which SKUs and sales channels are currently supported, whether its service fits an independent Vercel website, and all per-order fees before relying on that workflow. [BilisBenta FAQ](https://direct.bilisbenta.com/homepage/faqs)
- PayMongo’s hosted checkout can take cards, e-wallets, QR, BNPL, and online banking. Current listed Philippine rates include GCash 2.23%, Maya 1.79%, QR Ph online 1.34%, and cards 3.125% + ₱13.39 (VAT excluded); verify rates and merchant eligibility in the dashboard before pricing. [PayMongo pricing](https://www.paymongo.com/en/pricing) · [Hosted Checkout](https://www.paymongo.com/en/products/payment-channels/hosted-checkout)
- DTI states that online merchants, e-retailers, e-marketplaces, and digital platforms must register for the Philippine E-Commerce Trustmark; its announcement set a 30 September 2025 deadline. DTI lists business registration details and a BIR Certificate of Registration among the application documents. Check current requirements and your business situation directly with DTI before accepting orders. [DTI Trustmark announcement](https://www.dti.gov.ph/dti-archives/dti-news-archived/dti-sets-sept-30-deadline-mandatory-trustmark-registration) · [DTI Trustmark portal](https://trustmark.dti.gov.ph/)
- DTI’s ecommerce FAQ says domestic online sellers need BIR registration, invoices/receipts, transaction books, and tax filings. Confirm the exact requirements with DTI/BIR for your seller structure. [DTI eCommerce FAQ](https://ecommerce.dti.gov.ph/faqs/)

## Pilot assortment to validate (not yet supplier-confirmed)

1. Cable clips / cable-management kit
2. Foldable laptop stand (non-powered)
3. Compact desk drawer or pen organizer
4. Desk mat, only if a local supplier can ship it flat and provide accurate material/size specifications

Ask suppliers for SKU, cost including fulfillment, stock location, shipping fee and delivery range by destination, COD remittance timing, failed-delivery/return fee, packaging photos, product dimensions/materials, and sample-order terms. Order samples before publishing product photos or claims. Set retail prices only after calculating landed cost, payment fees, advertising allowance, taxes, and expected returns.

## Launch gates

- Confirm exact catalog items, permission to resell, inventory, and shipping/return terms with the supplier.
- Place and inspect sample orders. Do not copy supplier photos or product claims unless authorized.
- Choose the initial shipping area, actual delivery fee, support email, legal seller identity, and store policies.
- Check Trustmark registration and BIR obligations with DTI/BIR; do not display a Trustmark badge until it is issued.
- Activate a merchant account and live payment methods with PayMongo; keep API keys in Vercel environment variables, never in browser code.
- Connect a dedicated KOVA order database. The currently connected Supabase account only exposes unrelated projects, so I’m waiting for the separate organization you said you would connect.
- Test a complete checkout with PayMongo test keys and signed webhook events before enabling live checkout.
- Start with a small organic content / preorder signal test before committing to paid ads or subscription supplier costs.

**Current status:** the public storefront is live, but it is not a completed commerce system. It has no verified supplier catalog, production payment credentials, order database, fulfillment integration, or verified business contact/policies. Those details cannot be truthfully invented. The plan is intentionally set up to finish those as your accounts and supplier terms become available.
