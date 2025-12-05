// Product Detail Page - Dynamic Loading and Recommendations

let currentProduct = null; // Store current product globally

document.addEventListener("DOMContentLoaded", async function() {
  await loadProductDetails();
  await loadRecommendations();
  setupCartButtons();
});

// Get URL parameter by name
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Load product details based on URL parameter
async function loadProductDetails() {
  try {
    const productId = getURLParameter('id');
    
    if (!productId) {
      console.warn("No product ID in URL, showing default product");
      return; // Keep default HTML content
    }
    
    const response = await fetch('resources/data/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allProducts = await response.json();
    
    // Find the product by ID
    const product = allProducts.find(p => p.id === parseInt(productId));
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return;
    }
    
    // Populate page with product data
    populateProductData(product);
    
    // Store product globally for cart functionality
    currentProduct = product;
    
  } catch (error) {
    console.error("❌ Could not load product details:", error);
  }
}

// Populate the page with product data
function populateProductData(product) {
  // Update product image
  const productImg = document.getElementById('product-img');
  if (productImg) {
    productImg.src = product.image;
    productImg.alt = product.name;
  }
  
  // Update product name
  const productName = document.getElementById('product-name');
  if (productName) {
    productName.textContent = product.name;
  }
  
  // Update page title
  document.title = `${product.name} | Lume`;
  
  // Update stock status
  const stockCount = document.getElementById('stock-count');
  if (stockCount) {
    stockCount.textContent = `${product.stock} Available In Stock`;
    stockCount.className = product.stock > 5 ? 'highlight' : 'highlight low-stock';
  }
  
  // Update category
  const productCategory = document.getElementById('product-category');
  if (productCategory) {
    productCategory.textContent = product.category;
  }
  
  // Update price
  const productPrice = document.getElementById('product-price');
  if (productPrice) {
    productPrice.textContent = `$${product.price.toFixed(2)}`;
  }
  
  // Update description
  const productDesc = document.getElementById('product-desc');
  if (productDesc) {
    productDesc.textContent = product.description;
  }
  
  // Update dimensions if available
  const dimsContent = document.getElementById('dims-content');
  if (dimsContent && product.dimensions) {
    dimsContent.innerHTML = `
      <strong>Width:</strong> ${product.dimensions.width_cm} cm<br>
      <strong>Height:</strong> ${product.dimensions.height_cm} cm<br>
      <strong>Depth:</strong> ${product.dimensions.depth_cm} cm
    `;
  }
  
  // Update material if available
  const materialInfo = document.getElementById('material-info');
  if (materialInfo && product.material) {
    materialInfo.textContent = product.material;
  }
  
  // Update colors if available
  const colorsInfo = document.getElementById('colors-info');
  if (colorsInfo && product.colors) {
    colorsInfo.textContent = product.colors.join(', ');
  }
}

// Load recommended products (similar category or random selection)
async function loadRecommendations() {
  try {
    const response = await fetch('resources/data/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allProducts = await response.json();
    
    // Get current product ID from URL
    const currentProductId = getURLParameter('id');
    const currentCategory = document.getElementById('product-category')?.textContent;
    
    // Filter out current product and get recommendations
    let recommendations = allProducts.filter(product => 
      product.id !== parseInt(currentProductId)
    );
    
    // Prioritize same category products
    if (currentCategory) {
      const sameCategoryProducts = recommendations.filter(product => 
        product.category === currentCategory
      );
      
      const otherProducts = recommendations.filter(product => 
        product.category !== currentCategory
      );
      
      // Mix: prefer same category but include variety
      recommendations = [
        ...sameCategoryProducts.slice(0, 2),
        ...otherProducts.slice(0, 2)
      ];
    } else {
      // Random selection if no category info
      recommendations = recommendations.slice(0, 4);
    }
    
    // Shuffle for variety
    recommendations = recommendations.sort(() => Math.random() - 0.5).slice(0, 4);
    
    displayRecommendations(recommendations);
    
  } catch (error) {
    console.error("❌ Could not load recommendations:", error);
  }
}

// Display recommendations in the grid
function displayRecommendations(products) {
  const grid = document.getElementById('recommendations-grid');
  
  if (!grid) {
    console.error("Recommendations grid not found");
    return;
  }
  
  grid.innerHTML = '';
  
  products.forEach((product, index) => {
    const card = createRecommendationCard(product, index);
    grid.appendChild(card);
  });
}

// Create a recommendation card element
function createRecommendationCard(product, index) {
  const card = document.createElement('div');
  card.className = 'recommendation-card';
  
  // Determine badge text based on product properties
  let badgeText = '';
  if (product.stock < 5) {
    badgeText = 'Limited';
  } else if (index === 0) {
    badgeText = 'Popular';
  } else if (product.price < 300) {
    badgeText = 'Best Value';
  } else {
    badgeText = 'Premium';
  }
  
  card.innerHTML = `
    <div class="recommendation-card-img">
      <img src="${product.image}" alt="${product.name}">
      <div class="recommendation-badge">${badgeText}</div>
    </div>
    <div class="recommendation-card-body">
      <div class="recommendation-card-category">${product.category}</div>
      <h3 class="recommendation-card-title">${product.name}</h3>
      <div class="recommendation-card-footer">
        <span class="recommendation-card-price">$${product.price}</span>
        <button class="recommendation-card-btn" onclick="viewProduct('${product.id}')">
          View <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
  
  // Add click event to navigate to product detail (on card click)
  card.addEventListener('click', (e) => {
    // Don't trigger if clicking the button
    if (!e.target.closest('.recommendation-card-btn')) {
      viewProduct(product.id);
    }
  });
  
  return card;
}

// Navigate to product detail page
function viewProduct(productId) {
  // For now, just reload the page - you can implement proper routing later
  window.location.href = `prdct_dtl.html?id=${productId}`;
}

// Setup cart button handlers
function setupCartButtons() {
  const addToCartBtn = document.querySelector('.btn-add-cart');
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      addCurrentProductToCart();
    });
  }
}

// Quantity selector functions
function updateQty(change) {
  const qtyElement = document.getElementById('qtyValue');
  if (!qtyElement) return;
  
  let currentQty = parseInt(qtyElement.textContent) || 1;
  currentQty += change;
  
  if (currentQty < 1) currentQty = 1;
  if (currentProduct && currentQty > currentProduct.stock) {
    currentQty = currentProduct.stock;
    alert(`Sorry, only ${currentProduct.stock} items available in stock.`);
  }
  
  qtyElement.textContent = currentQty;
}

// Add current product to cart
function addCurrentProductToCart() {
  const quantity = parseInt(document.getElementById('qtyValue')?.textContent) || 1;
  
  // Use current product if available, otherwise use default data
  const product = currentProduct || {
    id: 401,
    name: document.getElementById('product-name')?.textContent || 'Arco Floor Lamp',
    price: parseFloat(document.getElementById('product-price')?.textContent.replace('$', '')) || 299.00,
    image: document.getElementById('product-img')?.src || 'resources/img/arco-lamp.jpg',
    category: document.getElementById('product-category')?.textContent || 'Lighting'
  };
  
  // Use the addToCart function from cart.js
  if (typeof window.addToCart === 'function') {
    const success = window.addToCart({
      ...product,
      quantity: quantity
    });
    
    if (success) {
      // Visual feedback
      const btn = document.querySelector('.btn-add-cart');
      const originalText = btn.textContent;
      btn.textContent = '✓ ADDED TO CART';
      btn.style.background = '#5e6f5e';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    }
  } else {
    console.error('Cart functionality not loaded');
  }
}

// Make functions globally available
window.updateQty = updateQty;
