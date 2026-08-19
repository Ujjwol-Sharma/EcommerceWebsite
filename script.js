// ===== Galaxy Biz Store - Full Shopping Experience =====
// NOTE: Pay button is non-functional (display only)

document.addEventListener('DOMContentLoaded', function() {

    // ===== CART STATE =====
    let cart = [];
    let cartOpen = false;
    let checkoutOpen = false;
    let checkoutStep = 1; // 1=cart, 2=shipping, 3=payment

    // ===== Product Data =====
    const productData = {
        'macbook-air': { name: 'Apple MacBook Air 13" M1', price: 880, cat: 'Apple MacBook', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=250&h=250&fit=crop' },
        'macbook-pro-m2': { name: 'Apple MacBook Pro 13" M2', price: 1299, cat: 'Apple MacBook', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=250&h=250&fit=crop' },
        'macbook-16-max': { name: 'Apple MacBook Pro 16″ M1 Max', price: 3499, cat: 'Apple MacBook', img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=250&h=250&fit=crop' },
        'macbook-16-pro': { name: 'Apple MacBook Pro 16″ M1 Pro', price: 2499, cat: 'Apple MacBook', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=250&h=250&fit=crop' },
        'zenbook-oled': { name: 'ASUS ZenBook OLED 13', price: 1600, cat: 'Business Laptop', img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=250&h=250&fit=crop' },
        'zenbook-pro': { name: 'ASUS ZenBook Pro 15 Flip', price: 2320, cat: 'Ultrabook', img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=250&h=250&fit=crop' },
        'bamix': { name: 'Bamix Luxurylin M200', price: 605, cat: 'Blenders', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=250&h=250&fit=crop' },
        'bosch-fridge': { name: 'Bosch KUW20VHF0G', price: 745, cat: 'Fridges', img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=250&h=250&fit=crop' },
        'bosch-blender': { name: 'Bosch MS64M6170', price: 100, cat: 'Blenders', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=250&h=250&fit=crop' },
        'bosch-dishwasher': { name: 'Bosch Serie 2 SMV2ITX18G', price: 520, cat: 'Dishwashers', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=250&h=250&fit=crop' },
        'cyberpunk': { name: 'Cyberpunk 2077', price: 60, cat: 'Games', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=250&h=250&fit=crop' },
        'horizon': { name: 'Horizon Zero Dawn', price: 39, cat: 'Games', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=250&h=250&fit=crop' },
        'mafia': { name: 'Mafia: Definitive Edition', price: 60, cat: 'Games', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=250&h=250&fit=crop' },
        'cat-tent': { name: 'Cat Teetee Tent', price: 69, cat: 'Textiles', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=250&h=250&fit=crop', oldPrice: 92 },
        'galaxy-flip': { name: 'Samsung Galaxy Flip5', price: 999, cat: 'Mobile', img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=250&h=250&fit=crop' },
        'washing-machine': { name: 'Washing Machine LG', price: 799, cat: 'Appliances', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=250&h=250&fit=crop' },
        'hp-probook': { name: 'HP ProBook 430 G8', price: 1420, cat: 'Business Laptop', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=250&h=250&fit=crop' },
        'bosch-serie4': { name: 'Bosch Serie 4 KSV36VLEP', price: 830, cat: 'Fridges', img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=250&h=250&fit=crop' },
    };

    // Load custom products from localStorage
    const customProductsRaw = localStorage.getItem('galaxy_products');
    let customProducts = [];
    if (customProductsRaw) {
        customProducts = JSON.parse(customProductsRaw);
        customProducts.forEach(cp => {
            productData[cp.id] = { name: cp.name, price: parseFloat(cp.price), cat: cp.category, img: cp.image };
        });
    }

    // Inject custom products into homepage
    const featureGrid = document.querySelector('.products-grid');
    if (featureGrid && customProducts.length > 0) {
        customProducts.forEach(cp => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.id = `product-${cp.id}`;
            card.innerHTML = `
                <div class="product-badge new">New</div>
                <div class="product-image">
                    <img src="${cp.image}" alt="${cp.name}">
                    <div class="product-actions">
                        <button class="action-btn"><i class="far fa-heart"></i></button>
                        <button class="action-btn"><i class="fas fa-search"></i></button>
                        <button class="action-btn"><i class="fas fa-sync-alt"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-cat">${cp.category}</span>
                    <h5 class="product-title"><a href="#">${cp.name}</a></h5>
                    <div class="product-rating">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                    </div>
                    <div class="product-price-wrapper">
                        <span class="product-price">${parseFloat(cp.price).toFixed(2)} ر.ع.</span>
                    </div>
                </div>
            `;
            featureGrid.prepend(card); // Add to beginning
            
            // Make clickable
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    addToCart(cp.id);
                }
            });
        });
    }

    // ===== CREATE CART SIDEBAR =====
    const cartSidebar = document.createElement('div');
    cartSidebar.id = 'cart-sidebar';
    cartSidebar.className = 'cart-sidebar';
    cartSidebar.innerHTML = `
        <div class="cart-sidebar-overlay" id="cart-overlay"></div>
        <div class="cart-sidebar-panel">
            <div class="cart-sidebar-header">
                <h3><i class="fas fa-shopping-bag"></i> Shopping Cart</h3>
                <button class="cart-close-btn" id="cart-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-items" id="cart-items">
                <div class="cart-empty" id="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <span>Browse products and add items to your cart</span>
                </div>
            </div>
            <div class="cart-sidebar-footer" id="cart-footer" style="display:none;">
                <div class="cart-subtotal">
                    <span>Subtotal:</span>
                    <span class="cart-subtotal-amount" id="cart-subtotal">0.00 ر.ع.</span>
                </div>
                <button class="btn btn-checkout" id="checkout-btn">
                    <i class="fas fa-arrow-right"></i> Proceed to Checkout
                </button>
                <button class="btn btn-continue" id="continue-shopping-btn">Continue Shopping</button>
            </div>
        </div>
    `;
    document.body.appendChild(cartSidebar);

    // ===== CREATE CHECKOUT MODAL =====
    const checkoutModal = document.createElement('div');
    checkoutModal.id = 'checkout-modal';
    checkoutModal.className = 'checkout-modal';
    checkoutModal.innerHTML = `
        <div class="checkout-overlay" id="checkout-overlay"></div>
        <div class="checkout-container">
            <button class="checkout-back-btn" id="checkout-back"><i class="fas fa-arrow-left"></i> Back</button>
            <button class="checkout-close-btn" id="checkout-close"><i class="fas fa-times"></i></button>

            <!-- Progress Steps -->
            <div class="checkout-progress">
                <div class="progress-step active" data-step="1">
                    <div class="progress-circle">1</div>
                    <span>Cart Review</span>
                </div>
                <div class="progress-line active"></div>
                <div class="progress-step" data-step="2">
                    <div class="progress-circle">2</div>
                    <span>Shipping</span>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step" data-step="3">
                    <div class="progress-circle">3</div>
                    <span>Payment</span>
                </div>
            </div>

            <!-- Step 1: Cart Review -->
            <div class="checkout-step" id="checkout-step-1">
                <h3>Review Your Order</h3>
                <div class="checkout-items" id="checkout-items"></div>
                <div class="checkout-summary" id="checkout-summary-1">
                    <div class="summary-row"><span>Subtotal</span><span id="summary-subtotal">0.00 ر.ع.</span></div>
                    <div class="summary-row"><span>Shipping</span><span class="free-tag">FREE</span></div>
                    <div class="summary-row total"><span>Total</span><span id="summary-total">0.00 ر.ع.</span></div>
                </div>
                <button class="btn btn-checkout-next" id="to-shipping-btn">
                    Continue to Shipping <i class="fas fa-arrow-right"></i>
                </button>
            </div>

            <!-- Step 2: Shipping Info -->
            <div class="checkout-step hidden" id="checkout-step-2">
                <h3>Shipping Information</h3>
                <form class="shipping-form" id="shipping-form">
                    <div class="form-row-2">
                        <div class="form-group-2">
                            <label>First Name *</label>
                            <input type="text" id="ship-first" placeholder="John" required>
                        </div>
                        <div class="form-group-2">
                            <label>Last Name *</label>
                            <input type="text" id="ship-last" placeholder="Doe" required>
                        </div>
                    </div>
                    <div class="form-group-2">
                        <label>Email Address *</label>
                        <input type="email" id="ship-email" placeholder="john@example.com" required>
                    </div>
                    <div class="form-group-2">
                        <label>Phone Number *</label>
                        <input type="tel" id="ship-phone" placeholder="+1 (505) 285-5028" required>
                    </div>
                    <div class="form-group-2">
                        <label>Street Address *</label>
                        <input type="text" id="ship-address" placeholder="123 Main Street, Apt 4B" required>
                    </div>
                    <div class="form-row-2">
                        <div class="form-group-2">
                            <label>City *</label>
                            <input type="text" id="ship-city" placeholder="New York" required>
                        </div>
                        <div class="form-group-2">
                            <label>State / Province</label>
                            <input type="text" id="ship-state" placeholder="NY">
                        </div>
                    </div>
                    <div class="form-row-2">
                        <div class="form-group-2">
                            <label>Zip / Postal Code *</label>
                            <input type="text" id="ship-zip" placeholder="10001" required>
                        </div>
                        <div class="form-group-2">
                            <label>Country *</label>
                            <select id="ship-country" required>
                                <option value="">Select Country</option>
                                <option value="np">Nepal</option>
                                <option value="us">United States</option>
                                <option value="uk">United Kingdom</option>
                                <option value="om">Oman</option>
                                <option value="in">India</option>
                                <option value="au">Australia</option>
                                <option value="ca">Canada</option>
                                <option value="ae">UAE</option>
                            </select>
                        </div>
                    </div>
                    <div class="shipping-methods">
                        <h4>Shipping Method</h4>
                        <label class="shipping-option selected">
                            <input type="radio" name="shipping" value="free" checked>
                            <div class="shipping-option-content">
                                <div>
                                    <strong>Free Standard Shipping</strong>
                                    <span>5-7 business days</span>
                                </div>
                                <span class="shipping-price free-tag">FREE</span>
                            </div>
                        </label>
                        <label class="shipping-option">
                            <input type="radio" name="shipping" value="express">
                            <div class="shipping-option-content">
                                <div>
                                    <strong>Express Shipping</strong>
                                    <span>2-3 business days</span>
                                </div>
                                <span class="shipping-price">15.00 ر.ع.</span>
                            </div>
                        </label>
                        <label class="shipping-option">
                            <input type="radio" name="shipping" value="next-day">
                            <div class="shipping-option-content">
                                <div>
                                    <strong>Next Day Delivery</strong>
                                    <span>Next business day</span>
                                </div>
                                <span class="shipping-price">30.00 ر.ع.</span>
                            </div>
                        </label>
                    </div>
                    <button type="button" class="btn btn-checkout-next" id="to-payment-btn">
                        Continue to Payment <i class="fas fa-arrow-right"></i>
                    </button>
                </form>
            </div>

            <!-- Step 3: Payment -->
            <div class="checkout-step hidden" id="checkout-step-3">
                <h3>Payment Details</h3>
                <div class="payment-methods-select">
                    <label class="pay-method active" data-method="card">
                        <i class="far fa-credit-card"></i> Credit / Debit Card
                    </label>
                    <label class="pay-method" data-method="paypal">
                        <i class="fab fa-paypal"></i> PayPal
                    </label>
                    <label class="pay-method" data-method="gpay">
                        <i class="fab fa-google-pay"></i> Google Pay
                    </label>
                    <label class="pay-method" data-method="applepay">
                        <i class="fab fa-apple-pay"></i> Apple Pay
                    </label>
                </div>

                <!-- Card Visual -->
                <div class="ck-card-visual" id="ck-card-visual">
                    <div class="ck-card-chip"></div>
                    <div class="ck-card-brand"><i class="fab fa-cc-visa"></i></div>
                    <div class="ck-card-number">•••• •••• •••• ••••</div>
                    <div class="ck-card-bottom">
                        <div>
                            <span class="ck-card-label">CARD HOLDER</span>
                            <span class="ck-card-holder">YOUR NAME</span>
                        </div>
                        <div>
                            <span class="ck-card-label">EXPIRES</span>
                            <span class="ck-card-expiry">MM/YY</span>
                        </div>
                    </div>
                </div>

                <form class="ck-payment-form" id="ck-payment-form" onsubmit="return false;">
                    <div class="form-group-2">
                        <label>Card Number *</label>
                        <div class="input-icon-wrap">
                            <i class="far fa-credit-card"></i>
                            <input type="text" id="ck-card-num" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                    </div>
                    <div class="form-group-2">
                        <label>Cardholder Name *</label>
                        <div class="input-icon-wrap">
                            <i class="far fa-user"></i>
                            <input type="text" id="ck-card-name" placeholder="John Doe">
                        </div>
                    </div>
                    <div class="form-row-2">
                        <div class="form-group-2">
                            <label>Expiry Date *</label>
                            <div class="input-icon-wrap">
                                <i class="far fa-calendar-alt"></i>
                                <input type="text" id="ck-card-exp" placeholder="MM/YY" maxlength="5">
                            </div>
                        </div>
                        <div class="form-group-2">
                            <label>CVV *</label>
                            <div class="input-icon-wrap">
                                <i class="fas fa-shield-alt"></i>
                                <input type="password" id="ck-card-cvv" placeholder="•••" maxlength="4">
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary in Payment -->
                    <div class="ck-order-summary">
                        <h4>Order Summary</h4>
                        <div class="ck-summary-items" id="ck-summary-items"></div>
                        <div class="ck-summary-totals">
                            <div class="summary-row"><span>Subtotal</span><span id="ck-subtotal">0.00 ر.ع.</span></div>
                            <div class="summary-row"><span>Shipping</span><span id="ck-shipping">FREE</span></div>
                            <div class="summary-row"><span>Tax (5%)</span><span id="ck-tax">0.00 ر.ع.</span></div>
                            <div class="summary-row total"><span>Total</span><span id="ck-total">0.00 ر.ع.</span></div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-pay-now" id="ck-pay-btn">
                        <i class="fas fa-lock"></i> Pay Now – <span id="ck-pay-amount">0.00</span> ر.ع.
                    </button>

                    <div class="ck-security">
                        <span><i class="fas fa-shield-alt"></i> SSL Secured</span>
                        <span><i class="fas fa-lock"></i> 256-bit Encryption</span>
                        <span><i class="fas fa-check-circle"></i> PCI Compliant</span>
                    </div>

                    <div class="ck-accepted">
                        <i class="fab fa-cc-visa"></i>
                        <i class="fab fa-cc-mastercard"></i>
                        <i class="fab fa-cc-paypal"></i>
                        <i class="fab fa-cc-amex"></i>
                        <i class="fab fa-cc-stripe"></i>
                        <i class="fab fa-google-pay"></i>
                        <i class="fab fa-cc-apple-pay"></i>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(checkoutModal);

    // ===== ADD TO CART TOAST =====
    const toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    toast.innerHTML = '<i class="fas fa-check-circle"></i> <span></span>';
    document.body.appendChild(toast);

    // ===== PREVENT NAV LINKS (but not Buy/Cart/Admin buttons) =====
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href !== '') {
                return; // Allow real links like admin.html to work naturally
            }
            e.preventDefault();
        });
    });

    // ===== SHOW TOAST =====
    function showToast(message) {
        const toastEl = document.getElementById('cart-toast');
        toastEl.querySelector('span').textContent = message;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2500);
    }

    // ===== ADD TO CART =====
    function addToCart(productId) {
        const product = productData[productId];
        if (!product) return;

        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: productId, ...product, qty: 1 });
        }

        updateCartUI();
        showToast(`${product.name} added to cart!`);
        openCart();
    }

    // ===== UPDATE CART UI =====
    function updateCartUI() {
        // Update header cart count
        const cartCountEl = document.querySelector('.cart-count');
        const cartTotalEl = document.querySelector('.cart-total');
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        if (cartCountEl) cartCountEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
        if (cartTotalEl) cartTotalEl.textContent = `${totalPrice.toFixed(2)} ر.ع.`;

        // Update sidebar
        const cartItemsEl = document.getElementById('cart-items');
        const cartEmptyEl = document.getElementById('cart-empty');
        const cartFooterEl = document.getElementById('cart-footer');
        const cartSubtotalEl = document.getElementById('cart-subtotal');

        if (cart.length === 0) {
            cartEmptyEl.style.display = 'flex';
            cartFooterEl.style.display = 'none';
            cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
        } else {
            cartEmptyEl.style.display = 'none';
            cartFooterEl.style.display = 'block';
            cartSubtotalEl.textContent = `${totalPrice.toFixed(2)} ر.ع.`;

            // Rebuild items
            cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <span class="cart-item-cat">${item.cat}</span>
                        <span class="cart-item-price">${item.price.toFixed(2)} ر.ع.</span>
                        <div class="cart-item-qty">
                            <button class="qty-btn minus" data-id="${item.id}">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsEl.appendChild(itemEl);
            });

            // Qty buttons
            cartItemsEl.querySelectorAll('.qty-btn.plus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = cart.find(i => i.id === btn.dataset.id);
                    if (item) { item.qty++; updateCartUI(); }
                });
            });
            cartItemsEl.querySelectorAll('.qty-btn.minus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = cart.find(i => i.id === btn.dataset.id);
                    if (item) {
                        item.qty--;
                        if (item.qty <= 0) cart = cart.filter(i => i.id !== btn.dataset.id);
                        updateCartUI();
                    }
                });
            });
            cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    cart = cart.filter(i => i.id !== btn.dataset.id);
                    updateCartUI();
                });
            });
        }
    }

    // ===== OPEN/CLOSE CART =====
    function openCart() {
        document.getElementById('cart-sidebar').classList.add('open');
        document.body.style.overflow = 'hidden';
        cartOpen = true;
    }

    function closeCart() {
        document.getElementById('cart-sidebar').classList.remove('open');
        document.body.style.overflow = '';
        cartOpen = false;
    }

    document.getElementById('cart-close').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    document.getElementById('continue-shopping-btn').addEventListener('click', closeCart);

    // Open cart from header
    document.getElementById('cart-icon').addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    // ===== CHECKOUT MODAL =====
    function openCheckout() {
        closeCart();
        checkoutStep = 1;
        updateCheckoutUI();
        document.getElementById('checkout-modal').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        document.getElementById('checkout-modal').classList.remove('open');
        document.body.style.overflow = '';
    }

    document.getElementById('checkout-btn').addEventListener('click', openCheckout);
    document.getElementById('checkout-close').addEventListener('click', closeCheckout);
    document.getElementById('checkout-overlay').addEventListener('click', closeCheckout);

    document.getElementById('checkout-back').addEventListener('click', () => {
        if (checkoutStep > 1) {
            checkoutStep--;
            updateCheckoutUI();
        } else {
            closeCheckout();
            openCart();
        }
    });

    document.getElementById('to-shipping-btn').addEventListener('click', () => {
        checkoutStep = 2;
        updateCheckoutUI();
    });

    document.getElementById('to-payment-btn').addEventListener('click', () => {
        checkoutStep = 3;
        updateCheckoutUI();
    });

    // Shipping options
    document.querySelectorAll('.shipping-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input').checked = true;
        });
    });

    // Payment method tabs
    document.querySelectorAll('.pay-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });

    function updateCheckoutUI() {
        // Steps visibility
        document.getElementById('checkout-step-1').classList.toggle('hidden', checkoutStep !== 1);
        document.getElementById('checkout-step-2').classList.toggle('hidden', checkoutStep !== 2);
        document.getElementById('checkout-step-3').classList.toggle('hidden', checkoutStep !== 3);

        // Progress bar
        document.querySelectorAll('.progress-step').forEach((el, i) => {
            el.classList.toggle('active', i < checkoutStep);
            el.classList.toggle('completed', i < checkoutStep - 1);
        });
        document.querySelectorAll('.progress-line').forEach((el, i) => {
            el.classList.toggle('active', i < checkoutStep - 1);
        });

        // Back button text
        const backBtn = document.getElementById('checkout-back');
        if (checkoutStep === 1) backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Cart';
        else if (checkoutStep === 2) backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Review';
        else backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Shipping';

        // Totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const shippingRadio = document.querySelector('input[name="shipping"]:checked');
        let shippingCost = 0;
        if (shippingRadio) {
            if (shippingRadio.value === 'express') shippingCost = 15;
            else if (shippingRadio.value === 'next-day') shippingCost = 30;
        }
        const tax = subtotal * 0.05;
        const total = subtotal + shippingCost + tax;

        // Step 1 summary
        document.getElementById('summary-subtotal').textContent = `${subtotal.toFixed(2)} ر.ع.`;
        document.getElementById('summary-total').textContent = `${(subtotal + shippingCost).toFixed(2)} ر.ع.`;

        // Step 1 items
        const checkoutItemsEl = document.getElementById('checkout-items');
        checkoutItemsEl.innerHTML = '';
        cart.forEach(item => {
            checkoutItemsEl.innerHTML += `
                <div class="ck-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="ck-item-info">
                        <h5>${item.name}</h5>
                        <span class="ck-item-cat">${item.cat}</span>
                    </div>
                    <div class="ck-item-qty">× ${item.qty}</div>
                    <div class="ck-item-price">${(item.price * item.qty).toFixed(2)} ر.ع.</div>
                </div>
            `;
        });

        // Step 3 summary
        const ckSummaryItems = document.getElementById('ck-summary-items');
        ckSummaryItems.innerHTML = '';
        cart.forEach(item => {
            ckSummaryItems.innerHTML += `
                <div class="ck-mini-item">
                    <span>${item.name} × ${item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)} ر.ع.</span>
                </div>
            `;
        });

        document.getElementById('ck-subtotal').textContent = `${subtotal.toFixed(2)} ر.ع.`;
        document.getElementById('ck-shipping').textContent = shippingCost === 0 ? 'FREE' : `${shippingCost.toFixed(2)} ر.ع.`;
        document.getElementById('ck-tax').textContent = `${tax.toFixed(2)} ر.ع.`;
        document.getElementById('ck-total').textContent = `${total.toFixed(2)} ر.ع.`;
        document.getElementById('ck-pay-amount').textContent = total.toFixed(2);
    }

    // ===== ATTACH BUY BUTTONS TO PRODUCTS =====
    function attachBuyButtons() {
        // "Buy Now" buttons in hero slides
        document.querySelectorAll('.slide .btn').forEach(btn => {
            const slideEl = btn.closest('.slide');
            let productId = null;
            if (slideEl.id === 'slide-1') productId = 'galaxy-flip';
            else if (slideEl.id === 'slide-2') productId = 'cat-tent';
            else if (slideEl.id === 'slide-3') productId = 'bamix';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (productId) addToCart(productId);
            });
        });

        // Washing machine banner
        const washBanner = document.getElementById('washing-banner');
        if (washBanner) {
            washBanner.style.cursor = 'pointer';
            washBanner.addEventListener('click', () => addToCart('washing-machine'));
        }

        // PS5 banner buy now
        const ps5Btn = document.querySelector('.ps5-banner .btn');
        if (ps5Btn) {
            ps5Btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart('cyberpunk');
            });
        }

        // Product cards - map them
        const cardMappings = {
            'product-macbook-air': 'macbook-air',
            'product-macbook-pro-m2': 'macbook-pro-m2',
            'product-macbook-pro-16-max': 'macbook-16-max',
            'product-macbook-pro-16-pro': 'macbook-16-pro',
            'product-zenbook-oled': 'zenbook-oled',
            'product-cyberpunk': 'cyberpunk',
            'product-horizon': 'horizon',
            'product-mafia': 'mafia',
        };

        Object.entries(cardMappings).forEach(([elId, prodId]) => {
            const card = document.getElementById(elId);
            if (card) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.action-btn')) {
                        addToCart(prodId);
                    }
                });
            }
        });

        // All product cards without specific IDs - make clickable
        document.querySelectorAll('.product-card').forEach(card => {
            if (!card.id || !cardMappings[card.id]) {
                const titleEl = card.querySelector('h5 a') || card.querySelector('h5');
                if (titleEl) {
                    const name = titleEl.textContent.trim();
                    // Find matching product
                    const matchId = Object.entries(productData).find(([id, p]) =>
                        name.toLowerCase().includes(p.name.toLowerCase().substring(0, 15))
                    );
                    if (matchId) {
                        card.style.cursor = 'pointer';
                        card.addEventListener('click', (e) => {
                            if (!e.target.closest('.action-btn')) {
                                addToCart(matchId[0]);
                            }
                        });
                    }
                }
            }
        });

        // Mini product cards
        document.querySelectorAll('.product-mini-card').forEach(card => {
            const name = card.querySelector('h5')?.textContent.trim();
            if (name) {
                const matchId = Object.entries(productData).find(([id, p]) =>
                    name.toLowerCase().includes(p.name.toLowerCase().substring(0, 12))
                );
                if (matchId) {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => addToCart(matchId[0]));
                }
            }
        });

        // Promo card "Shop Now" buttons
        document.querySelectorAll('.promo-card .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart('zenbook-pro'); // generic product
            });
        });

        // Showcase card (cat tent)
        const showcaseCard = document.getElementById('product-showcase');
        if (showcaseCard) {
            showcaseCard.style.cursor = 'pointer';
            showcaseCard.addEventListener('click', () => addToCart('cat-tent'));
        }

        // Recent items
        document.querySelectorAll('.recent-item').forEach(item => {
            item.style.cursor = 'pointer';
            const name = item.querySelector('.recent-cat')?.textContent.trim();
            if (name) {
                const matchId = Object.entries(productData).find(([id, p]) =>
                    name.toLowerCase().includes(p.name.toLowerCase().substring(0, 10)) ||
                    p.name.toLowerCase().includes(name.toLowerCase().substring(0, 10))
                );
                if (matchId) {
                    item.addEventListener('click', () => addToCart(matchId[0]));
                }
            }
        });
    }

    attachBuyButtons();

    // ===== CHECKOUT CARD FORM - LIVE PREVIEW =====
    const ckCardNum = document.getElementById('ck-card-num');
    const ckCardName = document.getElementById('ck-card-name');
    const ckCardExp = document.getElementById('ck-card-exp');
    const ckCardCvv = document.getElementById('ck-card-cvv');

    if (ckCardNum) {
        ckCardNum.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, '');
            val = val.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = val;
            document.querySelector('.ck-card-number').textContent = val || '•••• •••• •••• ••••';

            const num = val.replace(/\s/g, '');
            const brand = document.querySelector('.ck-card-brand');
            if (num.startsWith('4')) brand.innerHTML = '<i class="fab fa-cc-visa"></i>';
            else if (num.startsWith('5') || num.startsWith('2')) brand.innerHTML = '<i class="fab fa-cc-mastercard"></i>';
            else if (num.startsWith('3')) brand.innerHTML = '<i class="fab fa-cc-amex"></i>';
            else brand.innerHTML = '<i class="fab fa-cc-visa"></i>';
        });
    }

    if (ckCardName) {
        ckCardName.addEventListener('input', function(e) {
            document.querySelector('.ck-card-holder').textContent = e.target.value || 'YOUR NAME';
        });
    }

    if (ckCardExp) {
        ckCardExp.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
            e.target.value = val;
            document.querySelector('.ck-card-expiry').textContent = val || 'MM/YY';
        });
    }

    if (ckCardCvv) {
        ckCardCvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // ===== PAY NOW BUTTON (save mock order) =====
    document.getElementById('ck-pay-btn').addEventListener('click', function(e) {
        e.preventDefault();
        const original = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing payment...';
        this.style.opacity = '0.7';
        this.disabled = true;
        
        setTimeout(() => {
            this.innerHTML = original;
            this.style.opacity = '1';
            this.disabled = false;
            
            // Save mock order to localStorage
            const nameInput = document.getElementById('ship-first');
            const totalStr = document.getElementById('ck-total').textContent;
            const newOrder = {
                id: '#ORD-' + Math.floor(1000 + Math.random() * 9000),
                customer: nameInput && nameInput.value ? (nameInput.value + ' ' + (document.getElementById('ship-last').value || '')) : 'Guest Customer',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                amount: totalStr.replace('ر.ع.', '').trim() ? '$' + parseFloat(totalStr).toFixed(2) : '$0.00',
                status: 'processing'
            };
            
            const existingOrders = JSON.parse(localStorage.getItem('galaxy_orders') || '[]');
            
            // Include default ones if empty
            if(existingOrders.length === 0) {
                existingOrders.push(
                    { id: '#ORD-7352', customer: 'Sarah Smith', date: 'Oct 24, 2026', amount: '$999.00', status: 'completed' },
                    { id: '#ORD-7351', customer: 'Mike Johnson', date: 'Oct 24, 2026', amount: '$120.50', status: 'pending' },
                    { id: '#ORD-7350', customer: 'Emma Davis', date: 'Oct 23, 2026', amount: '$3,499.00', status: 'shipped' }
                );
            }
            
            existingOrders.unshift(newOrder);
            localStorage.setItem('galaxy_orders', JSON.stringify(existingOrders));
            
            // Empty cart and show success
            cart = [];
            updateCartUI();
            closeCheckout();
            showToast('Order placed successfully! Check Admin Panel.');
        }, 1500);
    });

    // ===== HERO SLIDER =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.getElementById('slider-next');
    const prevBtn = document.getElementById('slider-prev');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startAutoSlide() { slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000); }
    function resetAutoSlide() { clearInterval(slideInterval); startAutoSlide(); }

    if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoSlide(); });
    dots.forEach(dot => dot.addEventListener('click', () => { showSlide(parseInt(dot.dataset.slide)); resetAutoSlide(); }));
    startAutoSlide();

    // ===== PRODUCT TABS =====
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ===== SCROLL TO TOP =====
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ===== SECTION ANIMATIONS =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(
        '.features-bar, .featured-section, .urbanears-section, .ps5-section, ' +
        '.articles-section, .categories-section, .promo-cards-section, ' +
        '.recommended-section, .payment-section'
    ).forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ===== SEARCH PLACEHOLDER =====
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const placeholders = ['Search for products', 'Search electronics...', 'Search fashion...', 'Search home & kitchen...'];
        let pi = 0;
        setInterval(() => { pi = (pi + 1) % placeholders.length; searchInput.placeholder = placeholders[pi]; }, 3000);
    }

    // ===== ALSO HANDLE OLD PAYMENT SECTION PAY BUTTON =====
    const oldPayBtn = document.getElementById('pay-now-btn');
    if (oldPayBtn) {
        oldPayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.textContent = 'Processing...';
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-lock"></i> Pay Now – 0.00 ر.ع.';
                this.style.opacity = '1';
            }, 2000);
        });
    }

    // Old payment form card preview
    const oldCardNum = document.getElementById('card-number');
    if (oldCardNum) {
        oldCardNum.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            v = v.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = v;
            const d = document.querySelector('.card-number-display');
            if (d) d.textContent = v || '•••• •••• •••• ••••';
        });
    }
    const oldCardHolder = document.getElementById('card-holder');
    if (oldCardHolder) {
        oldCardHolder.addEventListener('input', function(e) {
            const d = document.querySelector('.card-holder-display');
            if (d) d.textContent = e.target.value || 'YOUR NAME';
        });
    }
    const oldCardExpiry = document.getElementById('card-expiry');
    if (oldCardExpiry) {
        oldCardExpiry.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
            e.target.value = v;
            const d = document.querySelector('.card-expiry-display');
            if (d) d.textContent = v || 'MM/YY';
        });
    }

    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mainNav.classList.toggle('active');
        });
    }

    // Toggle submenus on mobile
    document.querySelectorAll('.has-submenu > a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    });
});
