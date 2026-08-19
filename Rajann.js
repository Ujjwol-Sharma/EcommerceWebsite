// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && closeSidebar && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.add('active'));
        closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    // --- View Switching ---
    const navLinks = document.querySelectorAll('#sidebar-nav li[data-target]');
    const views = document.querySelectorAll('.admin-view');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            // Update active nav
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Update active view
            views.forEach(v => {
                if (v.id === targetId) {
                    v.classList.add('active');
                } else {
                    v.classList.remove('active');
                }
            });

            if (window.innerWidth <= 900) {
                sidebar.classList.remove('active');
            }

            if (targetId === 'view-orders') renderOrders();
            if (targetId === 'view-products') renderProducts();
        });
    });

    // --- Modal Logic ---
    const modal = document.getElementById('product-modal');
    const openBtns = document.querySelectorAll('.open-product-modal');
    const closeBtn = document.getElementById('close-product-modal');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('open');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    // --- Data Management (LocalStorage) ---
    const defaultOrders = [
        { id: '#ORD-7352', customer: 'Sarah Smith', date: 'Oct 24, 2026', amount: '$999.00', status: 'completed' },
        { id: '#ORD-7351', customer: 'Mike Johnson', date: 'Oct 24, 2026', amount: '$120.50', status: 'pending' },
        { id: '#ORD-7350', customer: 'Emma Davis', date: 'Oct 23, 2026', amount: '$3,499.00', status: 'shipped' }
    ];

    function getOrders() {
        const stored = localStorage.getItem('galaxy_orders');
        return stored ? JSON.parse(stored) : defaultOrders;
    }

    function getProducts() {
        const stored = localStorage.getItem('galaxy_products');
        return stored ? JSON.parse(stored) : [];
    }

    function renderOrders() {
        const orders = getOrders();
        const tbody = document.querySelector('#orders-table tbody');
        if (!tbody) return;

        const rowsHtml = orders.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>
                    <div class="customer-info">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(o.customer)}&background=f0f0f0&color=333" alt="${o.customer}">
                        <span>${o.customer}</span>
                    </div>
                </td>
                <td>${o.date}</td>
                <td>${o.amount}</td>
                <td>
                    <select class="status-select" data-id="${o.id}">
                        <option value="pending" ${o.status === 'pending' || o.status === 'processing' ? 'selected' : ''}>Pending</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn delete-order-btn" data-id="${o.id}" title="Delete Order">
                        <i class="fas fa-trash" style="color: #ff4d4f;"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = rowsHtml;

        // Update Dashboard table too
        const dashTbody = document.getElementById('dashboard-recent-orders');
        if (dashTbody) dashTbody.innerHTML = rowsHtml;

        // Update badge
        const badge = document.getElementById('order-badge');
        if (badge) badge.textContent = orders.length;

        // --- UPDATE DYNAMIC STATS ---
        let totalSales = 0;
        orders.forEach(o => {
            let amount = parseFloat(o.amount.replace(/[^0-9.-]+/g, ""));
            if (!isNaN(amount)) totalSales += amount;
        });

        const statSales = document.getElementById('stat-total-sales');
        const statOrders = document.getElementById('stat-total-orders');
        const statCustomers = document.getElementById('stat-active-customers');
        const statProducts = document.getElementById('stat-products-sold');

        if (statSales) statSales.textContent = '$' + totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (statOrders) statOrders.textContent = orders.length;

        const uniqueCustomers = new Set(orders.map(o => o.customer)).size;
        if (statCustomers) statCustomers.textContent = uniqueCustomers;
        if (statProducts) statProducts.textContent = Math.floor(orders.length * 2.5); // Estimate

        // --- ATTACH LISTENERS ---
        document.querySelectorAll('.delete-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this order?')) {
                    const newOrders = orders.filter(o => o.id !== id);
                    localStorage.setItem('galaxy_orders', JSON.stringify(newOrders));
                    renderOrders();
                }
            });
        });

        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const newStatus = e.target.value;
                const orderIndex = orders.findIndex(o => o.id === id);
                if (orderIndex > -1) {
                    orders[orderIndex].status = newStatus;
                    localStorage.setItem('galaxy_orders', JSON.stringify(orders));

                    // Update classes dynamically
                    e.target.className = 'status-select ' + newStatus;
                }
            });
            // Set initial class
            select.className = 'status-select ' + select.value;
        });
    }

    function renderProducts() {
        const products = getProducts();
        const grid = document.getElementById('admin-products-grid');
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = '<div class="empty-state">No custom products added yet. Add one!</div>';
            return;
        }

        grid.innerHTML = products.map(p => `
            <div class="admin-product-card">
                <img src="${p.image}" alt="${p.name}">
                <div class="info">
                    <h4>${p.name}</h4>
                    <span class="cat">${p.category}</span>
                    <strong class="price">$${parseFloat(p.price).toFixed(2)}</strong>
                </div>
                <button class="delete-product-btn action-btn" data-id="${p.id}" style="position:absolute; top:10px; right:10px; background:white; border-radius:50%; box-shadow:0 2px 5px rgba(0,0,0,0.2);" title="Delete Product">
                    <i class="fas fa-trash" style="color: #ff4d4f;"></i>
                </button>
            </div>
        `).join('');

        document.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this product?')) {
                    const newProducts = products.filter(p => p.id !== id);
                    localStorage.setItem('galaxy_products', JSON.stringify(newProducts));
                    renderProducts();
                }
            });
        });
    }

    // Initialize Dashboard
    renderOrders();

    // --- Add Product Form Submit ---
    const addForm = document.getElementById('add-product-form');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newProduct = {
                id: 'PROD-' + Math.floor(Math.random() * 10000),
                name: document.getElementById('prod-name').value,
                price: document.getElementById('prod-price').value,
                category: document.getElementById('prod-category').value,
                image: document.getElementById('prod-image').value
            };

            const products = getProducts();
            products.unshift(newProduct); // Add to beginning
            localStorage.setItem('galaxy_products', JSON.stringify(products));

            // Reset and close
            addForm.reset();
            modal.classList.remove('open');
            renderProducts();
            alert('Product added successfully! It will now appear on the main website.');
        });
    }

    // Prevent default links
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', e => e.preventDefault());
    });
});
