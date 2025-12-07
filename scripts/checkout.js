// Checkout Process - Load cart and display order summary

document.addEventListener("DOMContentLoaded", function() {
    // Load cart data and display in order summary
    loadCheckoutCart();
    
    // Auto-fill user information if logged in
    autoFillUserInfo();
    
    // Update cart counter
    if (typeof window.updateCartCounter === 'function') {
        window.updateCartCounter();
    }
});

// Get current logged in user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Auto-fill shipping form with user registration data
function autoFillUserInfo() {
    if (!window.location.pathname.includes('shipping')) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // If not logged in, redirect to login
        if (confirm('Please log in to continue with checkout.')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'cart.html';
        }
        return;
    }
    
    // Fill in name and email from registration
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    
    if (fullNameInput) fullNameInput.value = currentUser.name || '';
    if (emailInput) emailInput.value = currentUser.email || '';
    
    // Try to load saved shipping info if exists
    const savedShipping = getShippingInfo();
    if (savedShipping) {
        const phoneInput = document.getElementById('phone');
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');
        const zipInput = document.getElementById('zip');
        
        if (phoneInput && savedShipping.phone) phoneInput.value = savedShipping.phone;
        if (addressInput && savedShipping.address) addressInput.value = savedShipping.address;
        if (cityInput && savedShipping.city) cityInput.value = savedShipping.city;
        if (zipInput && savedShipping.zip) zipInput.value = savedShipping.zip;
    }
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Calculate cart totals
function calculateTotals() {
    const cart = getCart();
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0;
    const total = subtotal + shipping;
    
    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        freeShipping: subtotal > 500
    };
}

// Load cart items into checkout order summary
function loadCheckoutCart() {
    const cart = getCart();
    
    // If cart is empty, redirect back to cart page
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before checking out.');
        window.location.href = 'cart.html';
        return;
    }
    
    // Find all summary containers on the page
    const summaryContainers = document.querySelectorAll('.summary-items-container');
    
    summaryContainers.forEach(container => {
        // Clear existing items
        container.innerHTML = '';
        
        // Add cart items
        cart.forEach(item => {
            const itemElement = createSummaryItem(item);
            container.appendChild(itemElement);
        });
    });
    
    // Update totals
    updateCheckoutSummary();
}

// Create order summary item element
function createSummaryItem(item) {
    const div = document.createElement('div');
    div.className = 'summary-item';
    
    const subtotal = (item.price * item.quantity).toFixed(2);
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="summary-item-details">
            <h3>${item.name}</h3>
            <p>Qty: ${item.quantity}</p>
        </div>
        <div class="price">$${subtotal}</div>
    `;
    
    return div;
}

// Update checkout summary totals
function updateCheckoutSummary() {
    const totals = calculateTotals();
    
    // Update subtotal
    const subtotalElements = document.querySelectorAll('.total p:first-child span, .total span:first-of-type');
    subtotalElements.forEach(el => {
        if (el.parentElement.textContent.includes('Subtotal')) {
            el.textContent = `$${totals.subtotal}`;
        }
    });
    
    // Update shipping
    const shippingElements = document.querySelectorAll('.total p span');
    shippingElements.forEach(el => {
        if (el.parentElement.textContent.includes('Shipping')) {
            el.textContent = totals.shipping === '0.00' ? 'FREE' : `$${totals.shipping}`;
        }
    });
    
    // Update total
    const totalElements = document.querySelectorAll('.total strong span, .total p:last-child strong span, .total p strong span');
    totalElements.forEach(el => {
        if (el.closest('p').textContent.includes('Total')) {
            el.textContent = `$${totals.total}`;
        }
    });
    
    // Update free shipping message
    const freeShippingBox = document.querySelector('.free-shipping-box');
    if (freeShippingBox) {
        if (totals.freeShipping) {
            freeShippingBox.innerHTML = '🚚 You have FREE shipping!';
            freeShippingBox.style.color = '#4caf50';
        } else {
            const needed = (500 - parseFloat(totals.subtotal)).toFixed(2);
            freeShippingBox.innerHTML = `🚚 Add $${needed} more for FREE shipping!`;
        }
    }
}

// Store shipping information
function saveShippingInfo(formData) {
    localStorage.setItem('shippingInfo', JSON.stringify(formData));
}

// Get shipping information
function getShippingInfo() {
    const info = localStorage.getItem('shippingInfo');
    return info ? JSON.parse(info) : null;
}

// Store payment information (only last 4 digits for security)
function savePaymentInfo(formData) {
    localStorage.setItem('paymentInfo', JSON.stringify(formData));
}

// Get payment information
function getPaymentInfo() {
    const info = localStorage.getItem('paymentInfo');
    return info ? JSON.parse(info) : null;
}

// Load review page data
function loadReviewData() {
    const shippingInfo = getShippingInfo();
    const paymentInfo = getPaymentInfo();
    
    if (shippingInfo) {
        const reviewName = document.querySelector('#review-name span');
        const reviewEmail = document.querySelector('#review-email span');
        const reviewPhone = document.querySelector('#review-phone span');
        const reviewAddress = document.querySelector('#review-address span');
        const reviewCity = document.querySelector('#review-city span');
        const reviewZip = document.querySelector('#review-zip span');
        const reviewDelivery = document.querySelector('#review-delivery span');
        
        if (reviewName) reviewName.textContent = shippingInfo.fullName || '';
        if (reviewEmail) reviewEmail.textContent = shippingInfo.email || '';
        if (reviewPhone) reviewPhone.textContent = shippingInfo.phone || '';
        if (reviewAddress) reviewAddress.textContent = shippingInfo.address || '';
        if (reviewCity) reviewCity.textContent = shippingInfo.city || '';
        if (reviewZip) reviewZip.textContent = shippingInfo.zip || '';
        if (reviewDelivery) reviewDelivery.textContent = shippingInfo.deliveryDate || '';
    }
    
    if (paymentInfo) {
        const reviewCard = document.querySelector('#review-card span');
        const reviewExpiry = document.querySelector('#review-expiry span');
        
        if (reviewCard) reviewCard.textContent = paymentInfo.lastFourDigits || '';
        if (reviewExpiry) reviewExpiry.textContent = paymentInfo.expiry || '';
    }
}

// Handle shipping form submission
const shippingForm = document.querySelector('#shipping-form');
if (shippingForm && window.location.pathname.includes('shipping')) {
    const continueBtn = document.querySelector('.continue-to-payment');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values by ID
            const fullName = document.getElementById('fullName')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            const address = document.getElementById('address')?.value || '';
            const city = document.getElementById('city')?.value || '';
            const zip = document.getElementById('zip')?.value || '';
            const deliveryDate = document.getElementById('deliveryDate')?.value || '';
            
            const formData = {
                fullName,
                email,
                phone,
                address,
                city,
                zip,
                deliveryDate
            };
            
            // Basic validation
            if (!fullName || !email || !phone || !address || !city || !zip) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Validate phone number format (basic)
            const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid phone number');
                return;
            }
            
            // Save shipping info
            saveShippingInfo(formData);
            
            // Redirect to payment
            window.location.href = 'payment.html';
        });
    }
}

// Handle payment form submission
const paymentForm = document.querySelector('#payment-form');
if (paymentForm && window.location.pathname.includes('payment')) {
    const continueBtn = document.querySelector('#review, a[href*="review"]');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cardNumber = document.querySelector('#card-number')?.value || '';
            const expiryDate = document.querySelector('#expiry-date')?.value || '';
            const cvv = document.querySelector('#cvv')?.value || '';
            
            // Basic validation
            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all payment fields');
                return;
            }
            
            // Validate card number (basic - should be 13-19 digits)
            const cleanCardNumber = cardNumber.replace(/\s/g, '');
            if (!/^\d{13,19}$/.test(cleanCardNumber)) {
                alert('Please enter a valid card number');
                return;
            }
            
            // Validate expiry date format (MM/YY)
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert('Please enter expiry date in MM/YY format');
                return;
            }
            
            // Validate CVV (3-4 digits)
            if (!/^\d{3,4}$/.test(cvv)) {
                alert('Please enter a valid CVV (3 or 4 digits)');
                return;
            }
            
            // Store only last 4 digits for security
            const lastFourDigits = cleanCardNumber.slice(-4);
            const formData = {
                lastFourDigits: lastFourDigits,
                expiry: expiryDate,
                cardType: detectCardType(cleanCardNumber)
            };
            
            // Save payment info
            savePaymentInfo(formData);
            
            // Redirect to review
            window.location.href = 'review.html';
        });
    }
}

// Detect card type based on card number
function detectCardType(cardNumber) {
    if (/^4/.test(cardNumber)) return 'Visa';
    if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
    if (/^3[47]/.test(cardNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
    return 'Card';
}

// Handle place order button
const placeOrderBtn = document.querySelector('#place-order');
if (placeOrderBtn && window.location.pathname.includes('review')) {
    // Load review data when on review page
    loadReviewData();
    
    placeOrderBtn.addEventListener('click', function() {
        const currentUser = getCurrentUser();
        const shippingInfo = getShippingInfo();
        const paymentInfo = getPaymentInfo();
        
        if (!currentUser || !shippingInfo || !paymentInfo) {
            alert('Missing checkout information. Please complete all steps.');
            window.location.href = 'shipping.html';
            return;
        }
        
        // Create order object
        const order = {
            orderNumber: 'LM' + Date.now().toString().slice(-8),
            user: currentUser,
            shipping: shippingInfo,
            payment: {
                lastFourDigits: paymentInfo.lastFourDigits,
                cardType: paymentInfo.cardType || 'Card'
            },
            items: getCart(),
            totals: calculateTotals(),
            orderDate: new Date().toISOString()
        };
        
        // Save order to order history (optional)
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        orderHistory.push(order);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        // Clear cart and checkout data
        localStorage.removeItem('cart');
        localStorage.removeItem('shippingInfo');
        localStorage.removeItem('paymentInfo');
        
        // Show success message
        alert(`Order placed successfully! ✓\n\nOrder Number: ${order.orderNumber}\nTotal: $${order.totals.total}\n\nThank you for shopping with Lume!`);
        
        // Update cart counter
        if (typeof window.updateCartCounter === 'function') {
            window.updateCartCounter();
        }
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Make functions globally available
window.getCart = getCart;
window.loadCheckoutCart = loadCheckoutCart;
window.calculateTotals = calculateTotals;
window.getCurrentUser = getCurrentUser;
