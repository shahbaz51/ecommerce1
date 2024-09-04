// Select DOM elements
const thingsContainer = document.querySelector('.container');
const filterContainer = document.querySelector('.filter');
const loadMoreBtn = document.querySelector('.loadMoreBtn');
const searchInput = document.querySelector('#inputt');
const srchBtn = document.querySelector('.srch-btn');
const resultList = document.querySelector('.ull');
const slide = document.querySelectorAll('.slide');

// Initialize variables
let allProducts = [];
let displayedProducts = []; // Products currently displayed
let filteredProducts = []; // To store filtered products
let productsToShow = 8;
let currentIndex = 0;
let productDetails = [];

// Function to fetch data
const getData = async () => {
    try {
        const res = await fetch('https://dummyjson.com/products');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        console.log('Fetched data:', data); // Log fetched data
        allProducts = data.products;
        productDetails = allProducts.flatMap(product => [product.title, product.category]); // Update productDetails

        // Display initial products
        loadMore();
        // Ensure the button is hidden if there are no more products to show initially
        updateLoadMoreButton(allProducts);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Function to display products
// Function to open the product details modal
// Function to open the product details modal
function openProductDetails(productId) {
    const selectedProduct = allProducts.find(product => product.id == productId);
    if (!selectedProduct) return;

    // Populate the modal with the product details
    document.getElementById('modalThumbnail').src = selectedProduct.thumbnail;
    document.getElementById('modalTitle').innerText = selectedProduct.title;
    document.getElementById('modalDescription').innerText = selectedProduct.description;
    document.getElementById('modalPrice').innerText = `$${selectedProduct.price}`;

    // Disable body scrolling and show the modal
    document.body.style.overflow = "hidden";
    const modal = document.getElementById('productModal');
    modal.style.display = "block";

    // Close the modal when the 'X' is clicked
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Re-enable body scrolling
    };

    // Close the modal when clicking outside of the modal content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Re-enable body scrolling
        }
    };
}
// ----------------//
const showData = (products, container) => {
    if (!container) return; // Ensure container exists
    if (products.length === 0) {
        container.innerHTML = '<p class="internet">Check Your Internet Connection.</p>';
        return;
    }
    products.forEach(product => {
        const html = `
        <div class="content" data-id="${product.id}">
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title.slice(0, 8)}</h3>
            <p>${product.description.slice(0, 80)}</p>
            <h6>$${product.price}</h6>
            <ul>
                <li><i class="fa fa-star checked"></i></li>
                <li><i class="fa fa-star checked"></i></li>
                <li><i class="fa fa-star checked"></i></li>
                <li><i class="fa fa-star checked"></i></li>
                <li><i class="fa fa-star checked"></i></li>
            </ul>
            <button class="buy">Buy Now</button>
        </div>`;
        container.insertAdjacentHTML("beforeend", html);
    });

    // Add click event listeners to each product card
    const productCards = container.querySelectorAll('.content');
    productCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const productId = event.currentTarget.getAttribute('data-id');
            openProductDetails(productId);
        });
    });

    currentIndex += products.length;
};

// Function to update the visibility of the "Load More" button
const updateLoadMoreButton = (products) => {
    if (products.length > currentIndex) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
};

// Function to filter products
const filterProducts = () => {
    const searchValue = searchInput.value.toLowerCase();
    resultList.innerHTML = ""; // Clear previous suggestions

    filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue)
    );

    currentIndex = 0;
    thingsContainer.style.display = 'none';
    filterContainer.style.display = 'block';
    filterContainer.innerHTML = ''; // Clear previous filtered content
    showData(filteredProducts.slice(currentIndex, productsToShow), filterContainer);

    // Show or hide the "Load More" button based on filteredProducts length
    updateLoadMoreButton(filteredProducts);
};

// Function to load more products
const loadMore = () => {
    const nextProducts = allProducts.slice(currentIndex, currentIndex + productsToShow);
    displayedProducts = [...displayedProducts, ...nextProducts]; // Append new products
    showData(nextProducts, thingsContainer);
    updateLoadMoreButton(allProducts);
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    getData();

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    } else {
        console.error('Load More button not found.');
    }

    if (srchBtn) {
        srchBtn.addEventListener('click', filterProducts);
    } else {
        console.error('Search button not found.');
    }
});

searchInput.addEventListener('keyup', (e) => {
    removeElements();
    const searchValue = searchInput.value.toLowerCase();

    if (searchValue !== "") {
        resultList.innerHTML = "";

        for (let i of productDetails) {
            if (i.toLowerCase().startsWith(searchValue)) {
                let listItem = document.createElement("li");
                listItem.classList.add('list-items');
                listItem.style.cursor = "pointer";
                listItem.setAttribute("onclick", "displayNames('" + i + "')");

                let wor = "<b>" + i.substr(0, searchValue.length) + "</b>";
                wor += i.substr(searchValue.length);

                listItem.innerHTML = wor;
                resultList.appendChild(listItem);
            }
        }
    }
});

// Function to display selected suggestion
function displayNames(value) {
    searchInput.value = value;
    filterProducts(); // Filter products when a suggestion is clicked
}

// Function to remove suggestion elements
function removeElements() {
    let items = document.querySelectorAll('.list-items');
    items.forEach((i) => {
        i.remove();
    });
}

// Image slider functionality
let counter = 0;
slide.forEach((sl, i) => {
    sl.style.left = `${i * 100}%`;
});

const next = () => {
    counter = (counter + 1) % slide.length;
    imgSlider();
};

const imgSlider = () => {
    slide.forEach(sl => {
        sl.style.transform = `translateX(-${counter * 100}%)`;
    });
};

setInterval(next, 2500);
