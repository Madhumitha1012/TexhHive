function renderSidebar() {
    const current = typeof user === 'function' ? user() : null;
    const path = location.pathname.split('/').pop() || 'index.html';

    if (!current) return;

    const role = current.role || 'BUYER';

    const menus = {
        BUYER: [
            ['dashboard.html', 'Dashboard', '▦'],
            ['marketplace.html', 'Marketplace', '▤'],
            ['rfq.html', 'My RFQs', '◈'],
            ['quotations.html', 'Quotations', '◇'],
            ['orders.html', 'My Orders', '□'],
            ['price-intelligence.html', 'Market Prices', '◉'],
            ['profile.html', 'My Profile', '○']
        ],
        SUPPLIER: [
            ['supplier-dashboard.html', 'Dashboard', '▦'],
            ['supplier-products.html', 'My Products', '□'],
            ['supplier-rfqs.html', 'RFQs', '◈'],
            ['supplier-quotations.html', 'My Quotations', '◇'],
            ['supplier-orders.html', 'My Orders', '□'],
            ['price-intelligence.html', 'Market Prices', '◉'],
            ['profile.html', 'My Profile', '○']
        ],
        ADMIN: [
            ['admin.html', 'Dashboard', '▦'],
            ['profile.html', 'Profile', '○']
        ]
    };

    const items = menus[role] || menus.BUYER;

    const links = items.map(item => {
        const href = item[0];
        const base = href.split('#')[0];
        const active = base === path ? ' active' : '';
        return `<a class="side-link${active}" href="${href}">
                    <span class="side-icon">${item[2]}</span>
                    <span>${item[1]}</span>
                </a>`;
    }).join('');

    const sidebar = document.createElement('aside');
    sidebar.className = 'texhive-sidebar';
    sidebar.innerHTML = `
        <div class="side-brand">
            <a class="logo" href="${role === 'SUPPLIER' ? 'supplier-dashboard.html' : role === 'ADMIN' ? 'admin.html' : 'dashboard.html'}">
                TEX<span>HIVE</span>
            </a>
            <small>${role === 'ADMIN' ? 'ADMIN' : role === 'SUPPLIER' ? 'SUPPLIER' : 'BUYER'}</small>
        </div>

        <div class="side-section-title">MAIN MENU</div>
        <nav class="side-nav">${links}</nav>

        <div class="side-spacer"></div>

        ${role !== 'ADMIN' ? `<div class="side-section-title">ACCOUNT</div>
        <nav class="side-nav">
            <a class="side-link${path === 'profile.html' ? ' active' : ''}" href="profile.html">
                <span class="side-icon">○</span>
                <span>Profile</span>
            </a>
        </nav>` : ''}

        <button class="side-logout" type="button" onclick="logout()">
            <span class="side-icon">↪</span>
            <span>Logout</span>
        </button>
    `;

    document.body.prepend(sidebar);
    document.body.classList.add('has-texhive-sidebar');
}

document.addEventListener('DOMContentLoaded', renderSidebar);
