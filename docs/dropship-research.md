# DeskLaya dropshipping launch research

**Prepared and refreshed:** 27 October 2026
**Initial market assumption:** Philippines (the current storefront was configured for PHP and PayMongo).

## Recommendation

Keep DeskLaya’s desk/workspace identity and run a small **desk organization** pilot: cable organizers, compact laptop stands, and small desktop storage. Prefer products that are compact, non-electrical, simple to demonstrate in short videos, and available from a Philippine warehouse. Treat this as a test niche, not a proven “winning product” claim.

There is a trade-off: Philippine data shows strong demand in clothing/accessories, consumer electronics, and beauty/personal care, but not a specific breakout in desk organizers. Those categories also carry more sizing/returns, safety, authenticity, or compliance risk. Desk organization is a reasonable brand fit and lower-complexity pilot, but validate it with supplier inventory, samples, and actual customer response before buying ads or promising stock.

## What the evidence says

- HKTDC’s 2025 survey says electronics, fashion, and cosmetics/personal care were the most commonly purchased categories among Filipino online shoppers it surveyed. The same survey says product quality and seller information matter, and over 70% expected delivery within three days. [HKTDC, Philippines e-commerce opportunities](https://beltandroad.hktdc.com/en/insights/insights-e-commerce-opportunities-philippines-positioning-hong-kong-products)
- The Philippine Statistics Authority’s 2024 NICTHS says clothing, footwear, sporting goods, or accessories were the most common goods bought online; it also reports that 97.6% of online buyers preferred cash on delivery and 87.9% of online sellers accepted COD. This is broad household survey evidence, not proof that COD will work with a particular supplier or courier. [PSA, 2024 NICTHS highlights](https://rsso02.psa.gov.ph/content/highlights-2024-national-information-and-communications-technology-household-survey-2024-2)
- Dropify advertises local and international suppliers, warehouse fulfillment, COD, and product catalogs. Its public catalog names footwear, bags, baby, kitchen, sleep/bath, and general deals; it does not publicly establish desk-organization SKUs. Ask for current catalog access, actual stock locations, item-level costs, delivery SLAs, return-to-seller rules, and unbranded packaging before choosing it. [Dropify PH](https://dropify.ph/)
- BilisBenta’s current site advertises an inventory catalog and integrations for marketplaces, but its official FAQ says a paid Negosyo Pro subscription and funded order wallet are needed. This makes it unsuitable for this zero-cash start, and it does not establish an integration for DeskLaya’s custom storefront. [BilisBenta service overview](https://direct.bilisbenta.com/) · [BilisBenta FAQ](https://direct.bilisbenta.com/homepage/faqs)
- Current product leads surfaced in BilisBenta’s public product listings (search-indexed within the past week) include cable organizers shown at ₱16–₱22, a monitor riser at ₱262, and a foldable laptop holder at ₱325. The product page timed out when opened directly, so these are leads only: check the supplier account for current price, stock, exact SKU, shipping/fulfillment fees, and permission to resell. Avoid the powered/fan-equipped stand for the first pilot. [BilisBenta product listing](https://bbdropshipping.payrecon.asia/products/1144)
- BilisBenta’s FAQ says product prices are in its account price list, inventory is shared, and not every item has healthy stock. It describes fulfillment/returns primarily through linked marketplace workflows; details may vary by program. Confirm whether fulfillment costs must be prepaid, how orders for a custom website are submitted, what failed deliveries cost, and how claims for damaged or wrong goods work. [BilisBenta FAQ](https://direct.bilisbenta.com/homepage/faqs)
- Shoppable Business currently lists desk-accessory comparables such as UGREEN cable organizers at ₱99 and a foldable stand at ₱997, plus a generic metal organizer at ₱147–₱165. This is a B2B buying marketplace, not proof of dropship fulfillment or reseller authorization; use it only as a rough price-comparison lead. [Shoppable Business desk accessories](https://business.shoppable.ph/desk-accessories-c.5544)
- PayMongo’s hosted checkout can take cards, e-wallets, QR, BNPL, and online banking. Current listed Philippine rates include GCash 2.23%, Maya 1.79%, QR Ph online 1.34%, and cards 3.125% + ₱13.39 (VAT excluded); verify rates and merchant eligibility in the dashboard before pricing. [PayMongo pricing](https://www.paymongo.com/en/pricing) · [Hosted Checkout](https://www.paymongo.com/en/products/payment-channels/hosted-checkout)
- Trustmark guidance needs a direct DTI clarification: the 2025 announcement and DAO 25-12 describe registration as mandatory, but the current DTI FAQ first says online merchants must be registered and later answers “Is the Trustmark mandatory?” with “voluntary.” The current portal also lists business and BIR registration documents and says the micro-enterprise initial fee waiver runs through 31 December 2026. Ask the DTI E-Commerce Bureau which rule applies to this store before launch; don’t display a badge unless it is issued. [DTI Trustmark FAQ](https://trustmark.dti.gov.ph/faqs) · [DTI Trustmark guidance](https://trustmark.dti.gov.ph/guideline) · [DTI 2025 announcement](https://www.dti.gov.ph/dti-latest-news/dti-sets-sept-30-deadline-mandatory-trustmark-registration)
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
- Activate a merchant account and live payment methods with PayMongo; keep API keys in Netlify server-only environment variables, never in browser code.
- [x] Connect a dedicated DeskLaya order database and configure its URL and secret in Netlify.
- Test a complete checkout with PayMongo test keys and signed webhook events before enabling live checkout.
- Start with a small organic content / preorder signal test before committing to paid ads or subscription supplier costs.

**Freshness note:** this research was refreshed on 27 October 2026. Some of the best official demand data available is from 2024 (PSA) and 2025 (HKTDC/DTI); the sources’ publication years are called out above rather than presented as 2026 survey results. Supplier stock and prices are volatile and must be rechecked before listing.

**Status at the initial research pass:** the Vercel preview was deployed, but the store was not ready to take orders. Supplier inventory, payment credentials, and business policies were unverified. The database and Netlify deployment were completed later; see the dated update below.

## Zero-budget supplier check (27 October 2026)

The dedicated DeskLaya Supabase project and Netlify backend are now connected, but no verified products are listed and checkout remains off. This check focused on suppliers that would not require the seller to pay a monthly subscription or keep a fulfillment wallet funded.

- **BilisBenta is not currently viable for this seller’s zero-cash budget.** Its official FAQ says a Negosyo Pro subscription is required, orders pause when the wallet lacks funds, and it describes a minimum wallet top-up of ₱1,000. Its marketplace workflow also asks for business documents and bank details. That is incompatible with the user's stated budget and this custom storefront’s manual checkout architecture. Do not subscribe or top up. [BilisBenta FAQ](https://direct.bilisbenta.com/homepage/faqs) · [BilisBenta terms](https://www.bilisbenta.com/homepage/terms-and-condition)
- **Hola Store advertises a no-capital reseller flow, but its current catalog does not fit DeskLaya.** Its page says customers pay Hola Store first, then Hola Store fulfills and pays the reseller’s commission. The listed categories are olive oil, baby snacks, sauces, seasonings, and snacks—not workspace goods. Applying also requires a government-issued ID and target selling location. It may be an option only if Rogie deliberately changes the store niche and submits the application himself; do not send ID or contact details on his behalf. [Hola Store reseller program](https://www.hola.com.ph/become-a-reseller)
- **Lazada affiliate is the closest zero-inventory route for the existing workspace niche, but it is not dropshipping.** Lazada’s official affiliate overview advertises commissions up to 10% and describes customers buying and paying Lazada directly; DeskLaya would refer them and may earn commission on qualified tracked purchases. The current public overview and commission pages conflict on payout method and minimum, so verify those inside the signed-in account or with affiliate support. Program terms and media approval apply. [Lazada Affiliate overview](https://pages.lazada.com.ph/wow/i/ph/corp/affiliate-overview?hybrid=1) · [Commission and payment details](https://pages.lazada.com.ph/wow/i/ph/corp/affiliate-commission) · [Affiliate terms](https://pages.lazada.com.ph/wow/i/ph/corp/affiliate-terms)
- **Shopee affiliate requires regular public social activity.** Shopee’s current help page says applicants need at least one social-media post within the previous 14 days and must provide social account details. That is a poor fit for a hands-off, introvert-friendly plan unless the account already meets the requirement. [Shopee affiliate eligibility](https://help.shopee.ph/portal/4/article/115728-How-to-join-the-Shopee-Affiliate-Program)

**Recommendation:** do not activate paid BilisBenta plans or accept live orders. Keep DeskLaya prelaunch until either (a) Rogie can fund per-order supplier costs and we confirm exact SKUs, stock, ship times, return fees, and payment timing, or (b) he chooses an affiliate pivot and completes the retailer’s application, tax, and payout setup. A free database and website do not remove the cash needed to fulfill a normal dropship order.

**Updated implementation status:** DeskLaya’s database schema is applied, its secret stays in Netlify’s production-only environment settings, and the new Netlify deployment is live. The catalog API returns an empty product list and `/api/store-config` reports checkout disabled. The old Vercel deployment has not been migrated to use the new database credentials.
