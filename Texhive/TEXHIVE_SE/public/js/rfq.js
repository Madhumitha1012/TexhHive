async function initRfq() {
    if (!ensureUser()) return;
    if (user().role !== 'BUYER') { location.href = 'dashboard.html'; return; }
    nav();

    try {
        const ps = await fetchProducts(false);
        const sel = document.getElementById('product');
        sel.innerHTML = ps.map(p => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join('');

        const q = new URLSearchParams(location.search).get('productId');
        if (q) sel.value = q;

        await renderPreviousRfqs();

        document.getElementById('rfqForm').onsubmit = async e => {
            e.preventDefault();
            const p = ps.find(x => String(x.id) === String(sel.value));
            if (!p) return;

            const u = user();
            const r = {
                id: 'RFQ-' + Date.now(),
                buyerId: String(u.id),
                productId: p.id,
                supplierId: String(p.supplierId),
                productName: p.name,
                quantity: Number(document.getElementById('quantity').value),
                unit: document.getElementById('unit').value,
                requiredDeliveryDate: document.getElementById('date').value,
                deliveryLocation: document.getElementById('location').value,
                requirements: document.getElementById('requirements').value,
                status: 'PENDING'
            };

            try {
                await apiPost('/rfqs', r);
                document.getElementById('msg').textContent = 'RFQ sent successfully.';
                setTimeout(() => location.href = 'dashboard.html', 700);
            } catch (err) {
                document.getElementById('msg').textContent = err.message || 'Unable to send RFQ.';
            }
        };
    } catch (e) {
        document.getElementById('msg').textContent = 'Unable to load TexHive products.';
    }
}

async function renderPreviousRfqs() {
    const a = await apiGet('/rfqs/buyer/' + encodeURIComponent(user().id));
    const box = document.getElementById('previousRfqs');
    box.innerHTML = a.length
        ? a.map(r => `<div class="activity-row"><span><b>${escapeHtml(r.productName)}</b><br><small class="muted">RFQ #${escapeHtml(r.id)} · Product ${escapeHtml(r.productId)} · Supplier ${escapeHtml(r.supplierId)} · ${escapeHtml(r.quantity)} ${escapeHtml(r.unit)}</small></span><span class="badge">${escapeHtml(r.status || 'PENDING')}</span></div>`).join('')
        : 'No RFQs yet.';
}
