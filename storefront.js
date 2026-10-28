let products = [];
let cart = {};
try {
  const savedCart = JSON.parse(localStorage.getItem("kova-cart") || "{}");
  if (savedCart && typeof savedCart === "object" && !Array.isArray(savedCart)) {
    cart = Object.fromEntries(Object.entries(savedCart).filter(([id, quantity]) => /^[0-9a-f-]{36}$/i.test(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 10));
  }
} catch { cart = {}; }
let checkoutEnabled = false;
let categoryFilter = "";
let searchFilter = "";
const peso = (amount) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(amount);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);

async function startStore() {
  const grid = document.getElementById("products");
  grid.innerHTML = '<p class="empty-state">Loading the collection…</p>';
  try {
    const [catalogResponse, configResponse] = await Promise.all([fetch("/api/catalog"), fetch("/api/store-config")]);
    const catalog = await catalogResponse.json();
    const config = await configResponse.json();
    if (!catalogResponse.ok) throw new Error(catalog.error || "Catalog is unavailable.");
    products = catalog.products || [];
    checkoutEnabled = config.checkoutEnabled === true;
    renderCategoryOptions();
    renderProducts();
    renderCart();
    if (!checkoutEnabled) showStoreNotice("We’re preparing the first verified collection. Orders will open after products, shipping, and payments are confirmed.");
    if (new URLSearchParams(location.search).get("checkout") === "cancelled") showStoreNotice("Checkout was cancelled. Your bag is still saved.");
    const order = new URLSearchParams(location.search).get("order");
    if (order) {
      document.getElementById("lookup-number").value = order;
      document.getElementById("order-status").scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    grid.innerHTML = '<p class="empty-state">The collection is temporarily unavailable. Please check back soon.</p>';
    showStoreNotice("The store catalog is being set up.");
  }
}

function showStoreNotice(message) {
  const node = document.getElementById("store-notice");
  node.textContent = message;
  node.hidden = false;
}

function renderProducts() {
  const grid = document.getElementById("products");
  if (!products.length) {
    grid.innerHTML = '<div class="empty-state"><h3>Our first collection is in the works.</h3><p>We’re confirming product quality and local delivery details before listing anything for sale.</p></div>';
    return;
  }
  const sort = document.getElementById("catalog-sort").value;
  const query = searchFilter.trim().toLowerCase();
  let shown = products.filter((p) => (!categoryFilter || p.category === categoryFilter)
    && (!query || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query)));
  if (sort === "low") shown.sort((a, b) => a.price_php - b.price_php);
  if (sort === "high") shown.sort((a, b) => b.price_php - a.price_php);
  if (!shown.length) {
    grid.innerHTML = '<div class="empty-state">No products match those filters.</div>';
    return;
  }
  grid.innerHTML = shown.map((p) => {
    const photo = p.image_url && /^https:\/\//i.test(p.image_url) ? p.image_url : "";
    return `<article class="card"><div class="product-image">${photo ? `<img loading="lazy" src="${escapeHtml(photo)}" alt="${escapeHtml(p.name)}">` : '<div class="no-photo">DeskLaya</div>'}<span class="tag">${escapeHtml(p.category)}</span><button class="add" aria-label="Add ${escapeHtml(p.name)} to bag" onclick="addToCart('${escapeHtml(p.id)}')">+</button></div><div class="product-info"><button class="product-title" onclick="openProduct('${escapeHtml(p.id)}')">${escapeHtml(p.name)}</button><div class="product-sub">${escapeHtml(p.description)}</div><div class="price">${peso(p.price_php)}</div></div></article>`;
  }).join("");
}

function renderCategoryOptions() {
  const select = document.getElementById("catalog-category");
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  select.innerHTML = '<option value="">All categories</option>' + categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
}

function cartLines() { return products.filter((p) => cart[p.id]).map((p) => ({ ...p, quantity: cart[p.id] })); }
function renderCart() {
  const lines = cartLines();
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("count").textContent = `(${count})`;
  document.getElementById("drawer-count").textContent = `(${count})`;
  document.getElementById("cart-list").innerHTML = lines.length ? lines.map((p) => `<div class="cart-row"><div class="cart-line-image">DeskLaya</div><div><h3>${escapeHtml(p.name)}</h3><small>${peso(p.price_php)}</small><div class="qty"><button onclick="changeQty('${escapeHtml(p.id)}',-1)" aria-label="Remove one">−</button><span>${p.quantity}</span><button onclick="changeQty('${escapeHtml(p.id)}',1)" aria-label="Add one">+</button></div></div><strong>${peso(p.price_php * p.quantity)}</strong></div>`).join("") : '<div class="empty">Your bag is empty.</div>';
  const subtotal = lines.reduce((sum, p) => sum + p.price_php * p.quantity, 0);
  document.getElementById("subtotal").textContent = peso(subtotal);
  localStorage.setItem("kova-cart", JSON.stringify(cart));
  document.getElementById("checkout-button").disabled = !count || !checkoutEnabled;
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product || product.stock_status !== "available") return;
  if ((cart[id] || 0) >= 10) return showStoreNotice("The maximum quantity per item is 10.");
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  toggleCart(true);
}

function changeQty(id, change) {
  if (change > 0 && (cart[id] || 0) >= 10) return showStoreNotice("The maximum quantity per item is 10.");
  cart[id] = (cart[id] || 0) + change;
  if (cart[id] < 1) delete cart[id];
  renderCart();
}

function toggleCart(open) {
  const active = open === undefined ? !document.getElementById("drawer").classList.contains("open") : open;
  document.getElementById("drawer").classList.toggle("open", active);
  document.getElementById("shade").classList.toggle("open", active);
}

function openCheckout() {
  if (!checkoutEnabled) return showStoreNotice("Online ordering is not open yet.");
  if (!cartLines().length) return;
  document.getElementById("checkout-modal").classList.add("open");
  document.getElementById("checkout-error").textContent = "";
}

function openProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const image = document.getElementById("detail-image");
  image.src = product.image_url && /^https:\/\//i.test(product.image_url) ? product.image_url : "";
  image.alt = product.name;
  document.getElementById("detail-category").textContent = product.category;
  document.getElementById("product-modal-title").textContent = product.name;
  document.getElementById("detail-description").textContent = product.description;
  document.getElementById("detail-price").textContent = peso(product.price_php);
  document.getElementById("detail-add").onclick = () => { addToCart(product.id); closeProduct(); };
  document.getElementById("product-modal").classList.add("open");
}

function closeProduct() { document.getElementById("product-modal").classList.remove("open"); }

function closeCheckout() { document.getElementById("checkout-modal").classList.remove("open"); }

async function submitCheckout(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = document.getElementById("pay-button");
  const error = document.getElementById("checkout-error");
  if (!form.reportValidity()) return;
  button.disabled = true;
  button.textContent = "Opening secure checkout…";
  error.textContent = "";
  const values = new FormData(form);
  const payload = {
    customer: {
      name: values.get("name"), email: values.get("email"), phone: values.get("phone"),
      address: { line1: values.get("line1"), line2: values.get("line2"), city: values.get("city"), province: values.get("province"), postal_code: values.get("postal_code") },
      notes: values.get("notes"),
    },
    items: cartLines().map((item) => ({ productId: item.id, quantity: item.quantity })),
  };
  try {
    const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Checkout could not be started.");
    localStorage.setItem("kova-pending-order", result.orderNumber);
    location.assign(result.checkoutUrl);
  } catch (e) {
    error.textContent = e.message;
    button.disabled = false;
    button.textContent = "Continue to secure payment";
  }
}

async function lookupOrder(event) {
  event.preventDefault();
  const button = document.getElementById("lookup-button");
  const resultBox = document.getElementById("lookup-result");
  button.disabled = true;
  resultBox.textContent = "Looking up your order…";
  try {
    const response = await fetch("/api/order-status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderNumber: document.getElementById("lookup-number").value, email: document.getElementById("lookup-email").value }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Order lookup failed.");
    const o = data.order;
    if (o.payment_status === "paid" && localStorage.getItem("kova-pending-order") === o.order_number) {
      cart = {};
      localStorage.removeItem("kova-pending-order");
      renderCart();
    }
    resultBox.innerHTML = `<strong>${escapeHtml(o.order_number)}</strong><p>Payment: ${escapeHtml(o.payment_status)} · Fulfillment: ${escapeHtml(o.fulfillment_status)}</p>${o.tracking_number ? `<p>Tracking number: ${escapeHtml(o.tracking_number)}</p>` : ""}${o.tracking_url ? `<a target="_blank" rel="noopener" href="${escapeHtml(o.tracking_url)}">Open carrier tracking ↗</a>` : ""}`;
  } catch (e) { resultBox.textContent = e.message; }
  finally { button.disabled = false; }
}

document.getElementById("checkout-button").addEventListener("click", openCheckout);
document.getElementById("checkout-form").addEventListener("submit", submitCheckout);
document.getElementById("lookup-form").addEventListener("submit", lookupOrder);
document.getElementById("catalog-search").addEventListener("input", (event) => { searchFilter = event.target.value; renderProducts(); });
document.getElementById("catalog-category").addEventListener("change", (event) => { categoryFilter = event.target.value; renderProducts(); });
document.getElementById("catalog-sort").addEventListener("change", renderProducts);
startStore();
