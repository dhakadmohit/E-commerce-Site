// Toggle category dropdown
function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdownContent");
    if (dropdownContent) {
        dropdownContent.classList.toggle("show");
    }
}

// Set selected category
function selectCategory(category) {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.getElementById('dropdownContent');

    if (dropdownBtn) {
        dropdownBtn.textContent = category;
    }
    if (dropdownContent) {
        dropdownContent.classList.remove('show');
    }
}

// Close dropdown when clicking outside
window.onclick = function (e) {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!e.target.matches('.dropdown-btn') && dropdownContent) {
        dropdownContent.classList.remove('show');
    }
};

// Toggle Cart
document.querySelector(".ri-shopping-cart-line").addEventListener("click", () => {
    document.querySelector(".cart-container").style.display = "block";
    document.querySelector(".container").style.display = "none";
});

// Close Cart
document.querySelector(".cart-container").addEventListener("click", function (e) {
    if (e.target.classList.contains("cart-close-btn")) {
        document.querySelector(".cart-container").style.display = "none";
        document.querySelector(".container").style.display = "block";
    }
});

// Load products from API
let all_product_arr = [];
fetch('https://fakestoreapi.com/products/')
    .then(res => res.json())
    .then(product => {
        all_product_arr = product;
        renderProducts(product);
    });

// Render all products
function renderProducts(products) {
    const Cat = document.querySelector(".Category");
    Cat.innerHTML = "";
    products.forEach(element => {
        Cat.innerHTML += `
        <div class="categoryy">
            <div id="${element.id - 1}" class="categoryy item-card">
                <img src="${element.image}" alt="Product Image" />
                <h3 class="product-title">${element.title}</h3>
                <p class="product-price">Price: ${element.price}</p>
                <p class="product-category">Category: ${element.category}</p>
                <p class="product-description">${element.description}</p>
            </div>
        </div>`;
    });
}

// Home button reloads all products
document.querySelector("#home").addEventListener("click", () => {
    renderProducts(all_product_arr);
    document.querySelector('.dropdown-btn').textContent = "Select Category";
});

// Load categories
let selectedCategory = "";
fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(category => {
        const dropdown = document.querySelector(".dropdown");
        let dropdownHTML = `
            <div class="dropdown-btn" onclick="toggleDropdown()">Select Category</div>
            <div class="dropdown-content" id="dropdownContent">`;

        category.forEach(cat => {
            dropdownHTML += `<div class="dropdown-item" data-category="${cat}">${cat}</div>`;
        });

        dropdownHTML += `</div>`;
        dropdown.innerHTML = dropdownHTML;

        const dropdownBtn = dropdown.querySelector('.dropdown-btn');
        const dropdownContent = dropdown.querySelector('#dropdownContent');

        dropdownContent.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            if (category) {
                selectedCategory = category;
                dropdownBtn.textContent = category;
                dropdownContent.classList.remove('show');
                filterProductsByCategory(category);
            }
        });
    });

// Filter by category
function filterProductsByCategory(category) {
    const filtered = all_product_arr.filter(item => item.category === category);
    renderProducts(filtered);
}

// Show product details
const product_dibba = document.querySelector(".Category");
product_dibba.addEventListener("click", function (e) {
    const data = e.target.closest(".item-card");
    if (data) {
        renderProductPage(data.id);
    }
});

let cartItems = [];

// Render single product page
function renderProductPage(id) {
    const product = all_product_arr[id];
    const show_product_page = document.querySelector(".show-product-page");

    show_product_page.innerHTML = `
    <div class="show-product">
        <button class="show-close-btn">×</button>
        <img src="${product.image}" alt="Product Image" />
        <div class="show-product-info">
            <p class="show-product-title">${product.title}</p>
            <p class="show-product-price">Price: ${product.price}</p>
            <p class="show-product-description">${product.description}</p>
            <button class="product-button-buy">Buy Now</button>
            <button id="${id}" class="product-button-cart">Add to Cart</button>
        </div>
    </div>`;

    document.querySelector(".container").style.display = "none";
    document.querySelector(".show-product-page").style.display = "block";

    // Close detail view
    document.querySelector(".show-close-btn").addEventListener("click", () => {
        document.querySelector(".container").style.display = "block";
        document.querySelector(".show-product-page").style.display = "none";
    });

    // Add to Cart
    document.querySelector(".product-button-cart").addEventListener("click", function (item) {
        const cart_container = document.querySelector(".cart-container");
        const product = all_product_arr[item.target.id];
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
            const cartItem = document.querySelector(`#cart-item-${product.id}`);
            const qtyCount = cartItem.querySelector(".qty-count");
            qtyCount.textContent = existingItem.quantity;
        } else {
            product.quantity = 1;
            cartItems.push(product);
            cart_container.innerHTML += `
            <div class="cart-item" id="cart-item-${product.id}">
                <img src="${product.image}" alt="Product Image" class="cart-img" />
                <div class="cart-details">
                    <p class="cart-name">${product.title}</p>
                    <p class="cart-price">${product.price}</p>
                </div>
                <div class="cart-quantity-controls">
                    <button class="qty-btn decrease">−</button>
                    <span class="qty-count">${product.quantity}</span>
                    <button class="qty-btn increase">+</button>
                </div>
            </div>`;
        }

        document.querySelector(".container").style.display = "block";
        document.querySelector(".show-product-page").style.display = "none";
    });
}

// Cart quantity increase/decrease
document.querySelector(".cart-container").addEventListener("click", function (e) {
    const parent = e.target.closest(".cart-item");
    if (!parent) return;

    const id = parent.id.split("cart-item-")[1];
    const product = cartItems.find(p => p.id == id);

    if (e.target.classList.contains("increase")) {
        product.quantity++;
        parent.querySelector(".qty-count").textContent = product.quantity;
    }

    if (e.target.classList.contains("decrease")) {
        if (product.quantity > 1) {
            product.quantity--;
            parent.querySelector(".qty-count").textContent = product.quantity;
        } else {
            cartItems = cartItems.filter(p => p.id != id);
            parent.remove();
        }
    }
});

// Hamburger toggle for mobile nav
const hamburger = document.querySelector('.hamburger');
const rightDiv = document.querySelector('.right-div');

hamburger.addEventListener('click', () => {
    rightDiv.classList.toggle('show-menu');
});
