async function initSupplierDashboard(){
    if(!ensureUser()) return;
    const u=user();
    if(u.role!=='SUPPLIER'){location.href='dashboard.html';return;}
    nav();

    const banner=document.getElementById('verificationBanner');
    if(banner && u.status!=='ACTIVE'){
        banner.style.display='block';
        banner.innerHTML='<h2>Supplier verification pending</h2><p class="muted">Your account is waiting for Admin verification. Products you add remain hidden from buyers until approval.</p>';
    }

    try {
        const [ps,rs,qs,os,users] = await Promise.all([
            apiGet('/products/supplier/'+encodeURIComponent(u.id)),
            apiGet('/rfqs/supplier/'+encodeURIComponent(u.id)),
            apiGet('/quotations/supplier/'+encodeURIComponent(u.id)),
            apiGet('/orders/supplier/'+encodeURIComponent(u.id)),
            apiGet('/users')
        ]);

        const visibleProducts=ps.filter(p=>(p.status||'').toUpperCase()==='ACTIVE');
        supplierProducts.textContent=ps.length;
        supplierRfqs.textContent=rs.filter(r=>['PENDING','RECEIVED'].includes(r.status||'PENDING')).length;
        supplierQuotes.textContent=qs.filter(q=>['SENT','PENDING'].includes(q.status||'PENDING')).length;
        supplierOrders.textContent=os.filter(o=>!['COMPLETED','CANCELLED'].includes(o.status||'CONFIRMED')).length;

        supplierRfqList.innerHTML=rs.length
            ? rs.slice(0,5).map(r=>{const b=users.find(x=>String(x.id)===String(r.buyerId));return `<div class="activity-row"><span><b>${escapeHtml(r.productName)}</b><br><small class="muted">RFQ #${escapeHtml(r.id)} · Buyer ${escapeHtml(b?.name||r.buyerId)} · ${escapeHtml(b?.companyName||'')}</small></span><span class="badge">${escapeHtml(r.status)}</span></div>`}).join('')
            : 'No buyer RFQs yet.';

        const lp=latest(visibleProducts);
        supplierProductSnapshot.innerHTML=lp
            ? `<div class="mini-product"><img src="${escapeHtml(lp.image||'images/products/premium-cotton.svg')}" alt="${escapeHtml(lp.name)}"><div><span class="badge">${escapeHtml(lp.category||'Textile')}</span><h3>${escapeHtml(lp.name)}</h3><small class="muted">Product ID: ${escapeHtml(lp.id)}</small><br><small class="muted">MOQ ${escapeHtml(lp.moq)} ${escapeHtml(lp.unit||'')}</small></div></div>`
            : 'No products yet.';

        const lo=latest(os);
        supplierOrderList.innerHTML=lo
            ? `<div class="activity-row"><span><b>Order #${escapeHtml(lo.id)}</b><br><small class="muted">${escapeHtml(lo.productName)} · ${escapeHtml(lo.quantity)} ${escapeHtml(lo.unit)}</small><br><small class="muted">Buyer: ${escapeHtml(lo.buyerCompany||lo.buyerName||lo.buyerId||'—')}</small></span><span class="badge good">${escapeHtml(lo.status||'CONFIRMED')}</span></div>`
            : 'No supplier orders yet.';
    } catch(e) {
        supplierRfqList.innerHTML='<div class="empty">Unable to load supplier data.</div>';
    }
}
