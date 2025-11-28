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