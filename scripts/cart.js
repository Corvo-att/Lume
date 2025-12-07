// Shopping Cart Functionality

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function() {
  loadCart();
  // Use global updateCartCounter if available
  if (typeof window.updateCartCounter === 'function') {
    window.updateCartCounter();
  } else {
    updateCartCounterLocal();
  }
});

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  // Use global updateCartCounter if available, otherwise use local
  if (typeof window.updateCartCounter === 'function') {
    window.updateCartCounter();
  } else {
    updateCartCounterLocal();
  }
}

// Add item to cart
function addToCart(product) {
  let cart = getCart();
  
  // Check if product already exists in cart
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex !== -1) {
    // Product exists, increase quantity
    cart[existingIndex].quantity += product.quantity || 1;
  } else {
    // New product, add to cart
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: product.quantity || 1
    });
  }
  
  saveCart(cart);
  return true;
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  loadCart(); // Reload the cart display
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId);
    return;
  }
  
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  
  if (itemIndex !== -1) {
    cart[itemIndex].quantity = newQuantity;
    saveCart(cart);
    loadCart(); // Reload the cart display
  }
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('cart');
    loadCart();
    if (typeof window.updateCartCounter === 'function') {
      window.updateCartCounter();
    } else {
      updateCartCounterLocal();
    }
  }
}

// Calculate cart totals
function calculateTotals() {
  const cart = getCart();
  
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0;
  const tax = subtotal * 0.10; // 10% tax
  const total = subtotal + shipping + tax;
  
  return {
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  };
}

// Update cart counter in navbar (local version as fallback)
function updateCartCounterLocal() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const counters = document.querySelectorAll('.cart-counter');
  counters.forEach(counter => {
    counter.textContent = totalItems;
    if (totalItems > 0) {
      counter.classList.remove('hidden');
    } else {
      counter.classList.add('hidden');
    }
  });
}

// Load and display cart items
function loadCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');
  
  if (!cartItemsContainer) return; // Not on cart page
  
  // Show/hide empty state
  if (cart.length === 0) {
    emptyCart.style.display = 'flex';
    cartContent.style.display = 'none';
    return;
  } else {
    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';
  }
  
  // Clear existing items
  cartItemsContainer.innerHTML = '';
  
  // Render cart items
  cart.forEach(item => {
    const row = createCartRow(item);
    cartItemsContainer.appendChild(row);
  });
  
  // Update summary
  updateOrderSummary();
}

// Create cart table row
function createCartRow(item) {
  const row = document.createElement('tr');
  row.dataset.id = item.id;
  
  const subtotal = (item.price * item.quantity).toFixed(2);
  
  row.innerHTML = `
    <td>
      <div class="cart-product">
        <div class="cart-product-img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-product-info">
          <div class="cart-product-name">${item.name}</div>
          <div class="cart-product-category">${item.category}</div>
        </div>
      </div>
    </td>
    <td data-label="Price">
      <span class="cart-price">$${item.price.toFixed(2)}</span>
    </td>
    <td data-label="Quantity">
      <div class="cart-quantity">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
          <i class="fas fa-minus"></i>
        </button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </td>
    <td data-label="Subtotal">
      <span class="cart-subtotal">$${subtotal}</span>
    </td>
    <td class="cart-remove" data-label="Remove">
      <button class="btn-remove" onclick="removeFromCart(${item.id})" title="Remove item">
        <i class="fas fa-times"></i>
      </button>
    </td>
  `;
  
  return row;
}

// Update order summary
function updateOrderSummary() {
  const totals = calculateTotals();
  
  document.getElementById('summary-subtotal').textContent = `$${totals.subtotal}`;
  document.getElementById('summary-shipping').textContent = totals.shipping === '0.00' ? 'FREE' : `$${totals.shipping}`;
  document.getElementById('summary-tax').textContent = `$${totals.tax}`;
  document.getElementById('summary-total').textContent = `$${totals.total}`;
}

// Clear cart button handler
const clearCartBtn = document.getElementById('clear-cart-btn');
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', clearCart);
}

// Checkout button handler
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function() {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      // Show login modal/popup
      showLoginModal();
      return;
    }
    
    // Redirect to shipping page (first step of checkout)
    window.location.href = 'shipping.html';
  });
}

// Show login modal for checkout
function showLoginModal() {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'login-modal-overlay';
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'login-modal-content';
  modalContent.style.cssText = `
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    max-width: 450px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
    position: relative;
  `;
  
  modalContent.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <i class="fas fa-user-lock" style="font-size: 4rem; color: #8B7355; margin-bottom: 1rem;"></i>
      <h2 style="font-family: 'Playfair Display', serif; color: #2c2c2c; margin-bottom: 0.5rem; font-size: 1.8rem;">Login Required</h2>
      <p style="color: #666; font-size: 1rem; line-height: 1.6;">Please log in to your account to proceed with checkout. If you don't have an account, you can create one.</p>
    </div>
    <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; justify-content: center;">
      <button id="modal-login-btn" style="
        background: #8B7355;
        color: white;
        border: none;
        padding: 0.875rem 2rem;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
        min-width: 140px;
      ">
        <i class="fas fa-sign-in-alt"></i> Login
      </button>
      <button id="modal-register-btn" style="
        background: white;
        color: #8B7355;
        border: 2px solid #8B7355;
        padding: 0.875rem 2rem;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
        min-width: 140px;
      ">
        <i class="fas fa-user-plus"></i> Register
      </button>
    </div>
    <button id="modal-close-btn" style="
      background: transparent;
      border: none;
      color: #999;
      margin-top: 1.5rem;
      cursor: pointer;
      font-size: 0.95rem;
      text-decoration: underline;
      padding: 0.5rem;
    ">Continue Shopping</button>
  `;
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Add hover effects
  const loginBtn = modalContent.querySelector('#modal-login-btn');
  const registerBtn = modalContent.querySelector('#modal-register-btn');
  
  loginBtn.addEventListener('mouseenter', function() {
    this.style.background = '#6d5a42';
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 4px 12px rgba(139, 115, 85, 0.3)';
  });
  loginBtn.addEventListener('mouseleave', function() {
    this.style.background = '#8B7355';
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'none';
  });
  
  registerBtn.addEventListener('mouseenter', function() {
    this.style.background = '#f8f5f2';
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 4px 12px rgba(139, 115, 85, 0.2)';
  });
  registerBtn.addEventListener('mouseleave', function() {
    this.style.background = 'white';
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'none';
  });
  
  // Event listeners
  loginBtn.addEventListener('click', function() {
    window.location.href = 'login.html';
  });
  
  registerBtn.addEventListener('click', function() {
    window.location.href = 'register.html';
  });
  
  modalContent.querySelector('#modal-close-btn').addEventListener('click', function() {
    closeLoginModal();
  });
  
  // Close on overlay click
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeLoginModal();
    }
  });
  
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLoginModal();
    }
  });
  
  function closeLoginModal() {
    modalOverlay.style.animation = 'fadeOut 0.3s ease';
    modalContent.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      modalOverlay.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(30px);
    }
  }
`;
document.head.appendChild(style);

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.getCart = getCart;
window.updateCartCounter = updateCartCounter;
