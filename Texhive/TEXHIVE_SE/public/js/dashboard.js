async function initDashboard(){
    if(!ensureUser()) return;
    const u=user();
    if(u.role==='SUPPLIER'){location.href='supplier-dashboard.html';return;}
    if(u.role==='ADMIN'){location.href='admin.html';return;}
    nav();

    try {
        const [rfqs, quotes, orders, products] = await Promise.all([
            apiGet('/rfqs/buyer/'+encodeURIComponent(u.id)),
            apiGet('/quotations/buyer/'+encodeURIComponent(u.id)),
            apiGet('/orders/buyer/'+encodeURIComponent(u.id)),
            apiGet('/products')
        ]);

        activeRfqs.textContent=rfqs.filter(x=>!['CLOSED','CANCELLED','REJECTED','ORDERED'].includes(x.status)).length;
        quotations.textContent=quotes.filter(x=>x.status!=='REJECTED').length;
        activeOrders.textContent=orders.filter(x=>!['COMPLETED','CANCELLED'].includes(x.status)).length;
        totalOrders.textContent=orders.length;

        rfqList.innerHTML=rfqs.length
            ? rfqs.slice(0,5).map(x=>`<div class="activity-row"><span><b>${escapeHtml(x.productName)}</b><br><small class="muted">RFQ #${escapeHtml(x.id)} · ${escapeHtml(x.quantity)} ${escapeHtml(x.unit)} · Supplier ${escapeHtml(x.supplierId)}</small></span><span class="badge">${escapeHtml(x.status||'PENDING')}</span></div>`).join('')
            : `No RFQs yet.<br><a class="primary" href="marketplace.html" style="margin-top:14px">Find Products</a>`;

        const activeProducts=products.filter(p=>(p.status||'').toUpperCase()==='ACTIVE');
        const lp=latest(activeProducts);
        productSnapshot.innerHTML=lp
            ? `<div class="mini-product"><img src="${escapeHtml(lp.image||'images/products/premium-cotton.svg')}" alt="${escapeHtml(lp.name)}"><div><span class="badge">${escapeHtml(lp.category||'Textile')}</span><h3>${escapeHtml(lp.name)}</h3><small class="muted">Product ID: ${escapeHtml(lp.id)}</small><br><small class="muted">MOQ ${escapeHtml(lp.moq)} ${escapeHtml(lp.unit||'')}</small></div></div>`
            : 'No products available.';

        const lo=latest(orders);
        orderList.innerHTML=lo
            ? `<div class="activity-row"><span><b>Order #${escapeHtml(lo.id)}</b><br><small class="muted">${escapeHtml(lo.productName)} · ${escapeHtml(lo.quantity)} ${escapeHtml(lo.unit)}</small><br><small class="muted">Supplier: ${escapeHtml(lo.supplierCompany||lo.supplierName||lo.supplierId||'—')}</small></span><span class="badge good">${escapeHtml(lo.status||'CONFIRMED')}</span></div>`
            : 'No orders yet.';
    } catch(e) {
        rfqList.innerHTML = '<div class="empty">Unable to load dashboard data.</div>';
    }
}
