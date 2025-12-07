// I have used the modern `async/await` syntax, which is cleaner than using old promise chains 
// (`.then`). It also includes error handling in case the file name is wrong or the server is down.

// Function to fetch product data
async function fetchProducts() {
    try {
        const response = await fetch('resources/data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        console.log("✅ Connection Successful! Data loaded:", products);
        return products;

    } catch (error) {
        console.error("❌ Could not fetch products:", error);
    }
}

fetchProducts();

// Mobile Menu Toggle - Works on all pages
document.addEventListener("DOMContentLoaded", function() {
  const mobileMenuBtn = document.getElementById("mobile-menu");
  const navMenu = document.querySelector(".nav_menu_tab");
  const body = document.body;
  
  // Initialize cart counter on all pages
  initializeCartCounter();
  
  // Update user icon link based on login status
  updateUserIconLink();
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", function() {
      navMenu.classList.toggle("mobile-active");
      mobileMenuBtn.classList.toggle("active");
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains("mobile-active")) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
      }
      
      // Animate hamburger icon
      const bars = mobileMenuBtn.querySelectorAll(".bar");
      if (mobileMenuBtn.classList.contains("active")) {
        bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
        bars[1].style.opacity = "0";
        bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
      } else {
        bars[0].style.transform = "";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "";
      }
    });
    
    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll(".navbar_links");
    navLinks.forEach(link => {
      link.addEventListener("click", function() {
        navMenu.classList.remove("mobile-active");
        mobileMenuBtn.classList.remove("active");
        body.style.overflow = "";
        
        const bars = mobileMenuBtn.querySelectorAll(".bar");
        bars[0].style.transform = "";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "";
      });
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener("resize", function() {
      if (window.innerWidth > 820) {
        navMenu.classList.remove("mobile-active");
        mobileMenuBtn.classList.remove("active");
        body.style.overflow = "";
        
        const bars = mobileMenuBtn.querySelectorAll(".bar");
        bars[0].style.transform = "";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "";
      }
    });
  }
});
// Cart Counter Functions
function initializeCartCounter() {
  updateCartCounterDisplay();
}

function updateCartCounterDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

// Make cart counter update globally available
window.updateCartCounter = updateCartCounterDisplay;

// User Icon Link Update Function
function updateUserIconLink() {
  const currentUser = localStorage.getItem('currentUser');
  const userIconButtons = document.querySelectorAll('.icon-btn[aria-label="account"]');
  
  userIconButtons.forEach(button => {
    const link = button.querySelector('a');
    if (link) {
      if (currentUser) {
        // User is logged in, link to profile
        link.href = 'profile.html';
      } else {
        // User is not logged in, link to login
        link.href = 'login.html';
      }
    }
  });
}

// Make it globally available
window.updateUserIconLink = updateUserIconLink;
