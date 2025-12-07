
const categoryFilters = document.querySelectorAll('.category-filter');
const priceFilter = document.getElementById('priceFilter');
const priceValue = document.getElementById('priceValue');
const products = document.querySelectorAll('.product-card');
const clearFiltersBtn = document.getElementById('clearFilters');

// Update price display and gradient
priceFilter.addEventListener('input', () => {
    priceValue.textContent = priceFilter.value;
    updatePriceSliderGradient();
    filterProducts();
});

// Clear all filters
clearFiltersBtn.addEventListener('click', () => {
    categoryFilters.forEach(filter => filter.checked = false);
    priceFilter.value = 1500;
    priceValue.textContent = '1500';
    updatePriceSliderGradient();
    filterProducts();
});

// Update price slider gradient based on value
function updatePriceSliderGradient() {
    const value = priceFilter.value;
    const min = priceFilter.min;
    const max = priceFilter.max;
    const percentage = ((value - min) / (max - min)) * 100;
    priceFilter.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
}

categoryFilters.forEach(filter => {
    filter.addEventListener('change', filterProducts);
});

function filterProducts() {
    const selectedCategories = [...categoryFilters]
        .filter(c => c.checked)
        .map(c => c.value);

    const maxPrice = parseInt(priceFilter.value);

    products.forEach(product => {
        const productCategory = product.dataset.category;
        const productPrice = parseInt(product.dataset.price);

        const matchCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(productCategory);

        const matchPrice = productPrice <= maxPrice;

        if (matchCategory && matchPrice) {
            product.style.display = "";  
        } else {
            product.style.display = "none";
        }
    });
}

document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();  

        const card = btn.closest('.product-card');

        const product = {
            title: card.querySelector('.product-title').textContent,
            price: card.querySelector('.product-price').textContent,
            img: card.querySelector('img').src
        };

        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        const exists = wishlist.some(item => item.title === product.title);

        if (!exists) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } else {
            wishlist = wishlist.filter(item => item.title !== product.title);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

        const icon = btn.querySelector('i');
        icon.classList.toggle('fa-regular');
        icon.classList.toggle('fa-solid');
    });
});
window.addEventListener("DOMContentLoaded", () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.product-title').textContent;
        const btn = card.querySelector('.wishlist-btn i');

        const exists = wishlist.some(item => item.title === title);

        if (exists) {
            btn.classList.remove("fa-regular");
            btn.classList.add("fa-solid");
        }
    });
    
    // Initialize price slider gradient
    updatePriceSliderGradient();
    
    // Add click handlers to navigate to product detail page
    addProductClickHandlers();
});

// Add click handlers to product cards for navigation
function addProductClickHandlers() {
    document.querySelectorAll('.product-card').forEach(card => {
        // Make the entire card clickable except for the wishlist button
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the wishlist button
            if (e.target.closest('.wishlist-btn')) {
                return;
            }
            
            // Get product ID from data attribute
            const productId = card.dataset.id;
            if (productId) {
                window.location.href = `prdct_dtl.html?id=${productId}`;
            }
        });
    });
}
