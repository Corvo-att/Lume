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
    
    alert('Checkout functionality coming soon! Total: $' + calculateTotals().total);
    // Implement actual checkout process here
  });
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.getCart = getCart;
window.updateCartCounter = updateCartCounter;
