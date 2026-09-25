async function fetchProducts(includeInactive=false) {
    const data = await apiGet('/products');
    return includeInactive ? data : data.filter(p => String(p.status || '').toUpperCase() === 'ACTIVE');
}
let cachedProducts = [];

async function products() {
    cachedProducts = await fetchProducts(false);
    return cachedProducts;
}

async function initMarket() {
    if (!ensureUser()) return;
    if (user().role !== 'BUYER') {
        location.href = user().role === 'SUPPLIER' ? 'supplier-dashboard.html' : 'admin.html';
        return;
    }
    nav();
    try {
        cachedProducts = await fetchProducts(false);
        renderProducts();
    } catch (e) {
        document.getElementById('products').innerHTML = `<div class="empty">Unable to load products from TexHive server.</div>`;
    }
}

function renderProducts() {
    const q = (document.getElementById('search')?.value || '').toLowerCase();
    const a = cachedProducts.filter(p => JSON.stringify(p).toLowerCase().includes(q));
    document.getElementById('products').innerHTML = a.length
        ? a.map(p => `<article class="product-card product-card-image">
            <img class="product-image" src="${escapeHtml(p.image || 'images/products/premium-cotton.svg')}" alt="${escapeHtml(p.name)}">
            <span class="badge">${escapeHtml(p.category || 'Textile')}</span>
            <h3>${escapeHtml(p.name)}</h3>
            <div class="price">₹${escapeHtml(p.price)} / ${escapeHtml(p.unit)}</div>
            <div class="meta">Product ID: ${escapeHtml(p.id)}<br>MOQ: ${escapeHtml(p.moq)} ${escapeHtml(p.unit)}<br>Available: ${escapeHtml(p.availableQty)} ${escapeHtml(p.unit)}<br>Supplier ID: ${escapeHtml(p.supplierId)}</div>
            <div class="actions"><a class="primary" href="product.html?id=${encodeURIComponent(p.id)}">VIEW DETAILS</a></div>
        </article>`).join('')
        : `<div class="empty" style="grid-column:1/-1">No TexHive products are available yet.<br>Products appear after an approved supplier adds them.</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const s = document.getElementById('search');
    if (s) s.addEventListener('input', renderProducts);
});

async function initProduct() {
    if (!ensureUser()) return;
    try {
        const pid = new URLSearchParams(location.search).get('id');
        const all = await fetchProducts(false);
        const p = all.find(x => String(x.id) === String(pid));
        if (!p) {
            detail.innerHTML = '<div class="empty">Product not found.</div>';
            return;
        }
        detail.innerHTML = `<div class="product-detail-grid">
            <div><img class="product-detail-image" src="${escapeHtml(p.image || 'images/products/premium-cotton.svg')}" alt="${escapeHtml(p.name)}"></div>
            <div><p class="eyebrow">PRODUCT DETAILS</p><span class="badge">${escapeHtml(p.category || 'Textile')}</span>
            <h1 style="font:700 42px 'Space Grotesk'">${escapeHtml(p.name)}</h1>
            <p class="muted">${escapeHtml(p.description || 'TexHive textile marketplace product.')}</p>
            <div class="grid">
              <div><span class="muted">PRODUCT ID</span><h3>${escapeHtml(p.id)}</h3></div>
              <div><span class="muted">PRICE</span><h2 class="price">₹${escapeHtml(p.price)}/${escapeHtml(p.unit)}</h2></div>
              <div><span class="muted">MOQ</span><h2>${escapeHtml(p.moq)} ${escapeHtml(p.unit)}</h2></div>
              <div><span class="muted">AVAILABLE</span><h2>${escapeHtml(p.availableQty)} ${escapeHtml(p.unit)}</h2></div>
            </div><hr style="border-color:#222">
            <p><b>Material:</b> ${escapeHtml(p.material || '—')} &nbsp; <b>GSM:</b> ${escapeHtml(p.gsm || '—')} &nbsp; <b>Width:</b> ${escapeHtml(p.width || '—')}</p>
            <p><b>Supplier ID:</b> ${escapeHtml(p.supplierId)} &nbsp; <b>Location:</b> ${escapeHtml(p.location || '—')}</p>
            <a class="primary" href="rfq.html?productId=${encodeURIComponent(p.id)}">REQUEST QUOTATION</a></div></div>`;
    } catch (e) {
        detail.innerHTML = '<div class="empty">Unable to load product.</div>';
    }
}
