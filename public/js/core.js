const API = 'http://localhost:8080/api';

function user() {
    try { return JSON.parse(sessionStorage.getItem('texhiveUser') || 'null'); }
    catch { return null; }
}

function setUser(value) {
    if (value) sessionStorage.setItem('texhiveUser', JSON.stringify(value));
    else sessionStorage.removeItem('texhiveUser');
}

function ensureUser() {
    const u = user();
    if (!u) {
        location.href = 'login.html';
        return false;
    }
    return true;
}

async function logout() {
    setUser(null);
    location.href = 'login.html';
}

function nav() {
    document.querySelectorAll('[data-user-name]').forEach(e => e.textContent = user()?.name || 'Guest');
    document.querySelectorAll('[data-role]').forEach(e => e.textContent = user()?.role || 'BUYER');
}

function requireRole(role) {
    if (!ensureUser()) return false;
    if (user()?.role !== role) {
        location.href = user()?.role === 'SUPPLIER' ? 'supplier-dashboard.html' :
                        user()?.role === 'ADMIN' ? 'admin.html' : 'dashboard.html';
        return false;
    }
    return true;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
    }[ch]));
}

function latest(items) {
    return (items || []).slice().sort((a,b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )[0] || null;
}

function downloadTextFile(filename, text, mime='text/plain') {
    const blob = new Blob([text], {type:mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function buildOrderReport(o) {
    return `<!doctype html><html><head><meta charset="utf-8"><title>TexHive Order Report #${escapeHtml(o.id)}</title>
<style>body{font-family:Arial,sans-serif;color:#171717;padding:40px;line-height:1.5}h1{margin:0}h2{margin-top:28px;border-bottom:2px solid #d7ff45;padding-bottom:6px}.brand{font-size:26px;font-weight:800}.brand span{color:#86a900}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 30px}.item{padding:8px 0;border-bottom:1px solid #ddd}.label{font-size:11px;color:#666;text-transform:uppercase}.value{font-weight:600}.total{font-size:20px;font-weight:800}.note{margin-top:35px;color:#666;font-size:12px}</style></head><body>
<div class="brand">TEX<span>HIVE</span></div><h1>Order Report</h1>
<p>Order ID: <b>#${escapeHtml(o.id)}</b> &nbsp; Status: <b>${escapeHtml(o.status || 'CONFIRMED')}</b></p>
<h2>Product & Order</h2><div class="grid">
<div class="item"><div class="label">Product ID</div><div class="value">${escapeHtml(o.productId)}</div></div>
<div class="item"><div class="label">Product Name</div><div class="value">${escapeHtml(o.productName)}</div></div>
<div class="item"><div class="label">Category</div><div class="value">${escapeHtml(o.category || 'Textile')}</div></div>
<div class="item"><div class="label">Quantity</div><div class="value">${escapeHtml(o.quantity)} ${escapeHtml(o.unit)}</div></div>
<div class="item"><div class="label">MOQ</div><div class="value">${escapeHtml(o.moq || '—')} ${escapeHtml(o.unit || '')}</div></div>
<div class="item"><div class="label">Total Amount</div><div class="value total">₹${escapeHtml(o.totalAmount || 0)}</div></div>
<div class="item"><div class="label">Delivery Days</div><div class="value">${escapeHtml(o.deliveryDays || '—')} days</div></div>
<div class="item"><div class="label">Expected Receiving</div><div class="value">${escapeHtml(o.expectedDate || o.requiredDeliveryDate || 'Not specified')}</div></div>
<div class="item"><div class="label">Delivery Location</div><div class="value">${escapeHtml(o.deliveryLocation || '—')}</div></div></div>
<h2>Buyer Details</h2><div class="grid">
<div class="item"><div class="label">Buyer ID</div><div class="value">${escapeHtml(o.buyerId)}</div></div>
<div class="item"><div class="label">Buyer Name</div><div class="value">${escapeHtml(o.buyerName)}</div></div>
<div class="item"><div class="label">Company</div><div class="value">${escapeHtml(o.buyerCompany)}</div></div>
<div class="item"><div class="label">Phone</div><div class="value">${escapeHtml(o.buyerPhone || '—')}</div></div></div>
<h2>Supplier Details</h2><div class="grid">
<div class="item"><div class="label">Supplier ID</div><div class="value">${escapeHtml(o.supplierId)}</div></div>
<div class="item"><div class="label">Supplier Name</div><div class="value">${escapeHtml(o.supplierName)}</div></div>
<div class="item"><div class="label">Company</div><div class="value">${escapeHtml(o.supplierCompany)}</div></div>
<div class="item"><div class="label">Location</div><div class="value">${escapeHtml(o.supplierLocation || '—')}</div></div></div>
<h2>Quotation Details</h2><div class="grid">
<div class="item"><div class="label">Quotation ID</div><div class="value">${escapeHtml(o.quotationId || '—')}</div></div>
<div class="item"><div class="label">Unit Price</div><div class="value">₹${escapeHtml(o.unitPrice || 0)}/${escapeHtml(o.unit || '')}</div></div>
<div class="item"><div class="label">Quoted MOQ</div><div class="value">${escapeHtml(o.moq || '—')}</div></div>
<div class="item"><div class="label">Delivery Days</div><div class="value">${escapeHtml(o.deliveryDays || '—')} days</div></div>
<div class="item"><div class="label">Payment Terms</div><div class="value">${escapeHtml(o.paymentTerms || '—')}</div></div>
<div class="item"><div class="label">Quotation Total</div><div class="value">₹${escapeHtml(o.totalAmount || 0)}</div></div></div>
<p class="note">Generated by TexHive B2B Textile Marketplace.</p></body></html>`;
}

function downloadOrderReport(order) {
    downloadTextFile(`TexHive_Order_Report_${order.id}.html`, buildOrderReport(order), 'text/html');
}
