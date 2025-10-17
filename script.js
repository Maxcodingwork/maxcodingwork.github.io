// 商品數據
const products = [
    {
        id: 1,
        name: "經典黃衫中文球衣",
        price: 1980,
        category: "jerseys",
        image: "https://picsum.photos/300/250?random=1",
        fallbackIcon: "fas fa-tshirt",
        description: "中信兄弟經典黃衫球衣，展現球隊精神"
    },
    {
        id: 2,
        name: "小象側背包",
        price: 500,
        category: "accessories",
        image: "https://picsum.photos/300/250?random=2",
        fallbackIcon: "fas fa-shopping-bag",
        description: "可愛小象造型側背包，實用又時尚"
    },
    {
        id: 3,
        name: "小象手偶",
        price: 600,
        category: "merchandise",
        image: "https://picsum.photos/300/250?random=3",
        fallbackIcon: "fas fa-hand-paper",
        description: "萌趣小象手偶，陪伴您觀賽時光"
    },
    {
        id: 4,
        name: "Brothers網眼購物提袋",
        price: 350,
        category: "accessories",
        image: "https://picsum.photos/300/250?random=4",
        fallbackIcon: "fas fa-shopping-basket",
        description: "環保網眼購物提袋，輕便實用"
    },
    {
        id: 5,
        name: "手繪肖像應援手燈",
        price: 400,
        category: "merchandise",
        image: "https://picsum.photos/300/250?random=5",
        fallbackIcon: "fas fa-lightbulb",
        description: "手繪風格應援手燈，為球隊加油"
    },
    {
        id: 6,
        name: "球衣包屁衣禮盒組",
        price: 1880,
        category: "apparel",
        image: "https://picsum.photos/300/250?random=6",
        fallbackIcon: "fas fa-gift",
        description: "可愛球衣包屁衣禮盒，送禮首選"
    },
    {
        id: 7,
        name: "2025球員背號TEE",
        price: 880,
        category: "apparel",
        image: "https://picsum.photos/300/250?random=7",
        fallbackIcon: "fas fa-tshirt",
        description: "2025年最新球員背號T恤"
    },
    {
        id: 8,
        name: "2025應援毛巾",
        price: 320,
        category: "merchandise",
        image: "https://picsum.photos/300/250?random=8",
        fallbackIcon: "fas fa-square",
        description: "2025年應援毛巾，觀賽必備"
    },
    {
        id: 9,
        name: "棒球帽",
        price: 650,
        category: "accessories",
        image: "https://picsum.photos/300/250?random=9",
        fallbackIcon: "fas fa-hat-cowboy",
        description: "經典棒球帽，遮陽又時尚"
    },
    {
        id: 10,
        name: "Brothers Forever系列服飾",
        price: 1200,
        category: "apparel",
        image: "https://picsum.photos/300/250?random=10",
        fallbackIcon: "fas fa-vest",
        description: "Brothers Forever系列限定服飾"
    },
    {
        id: 11,
        name: "蠟筆小新聯名商品",
        price: 750,
        category: "merchandise",
        image: "https://picsum.photos/300/250?random=11",
        fallbackIcon: "fas fa-star",
        description: "蠟筆小新聯名限定商品"
    },
    {
        id: 12,
        name: "2025美式復古學院服飾",
        price: 1580,
        category: "apparel",
        image: "https://picsum.photos/300/250?random=12",
        fallbackIcon: "fas fa-graduation-cap",
        description: "2025年美式復古學院風格服飾"
    }
];

// 資源位 SDK
const sdk = new GmpResourceSDK({ 
    host: 'https://ma.altatech.tw', 
    appid: 8, // number
    uuid: '578237563093909526', 
    idType: 'baseid', // 根據實際情況設置
    webId: '578237563093909526'
});

sdk.getResourceList(['7606814bd9d27b3fd5b191448fa61516']).then((resourceList) => {
    // 根据返回的资源位列表进行自渲染工作
    // 回调中的resourceList为ResourceData[]类型，详见资源位数据模型3.1.1
    // 從回應中取出 image_url
    if (resourceList && resourceList.length > 0) {
        const resourceData = resourceList[0];
        if (resourceData.customer_material_list && resourceData.customer_material_list.length > 0) {
            const material = resourceData.customer_material_list[0];
            const imageUrl = material.image_url;
            
            // 將圖片 URL 設定到彈窗中的圖片元素
            if (modalImage && imageUrl) {
                modalImage.src = imageUrl;
                modalImage.alt = '廣告圖片'; // 設定替代文字
                
                // 圖片載入完成後檢查是否需要顯示彈窗
                modalImage.onload = function() {
                    checkModalDisplay();
                };
                
                // 如果圖片載入失敗，也要檢查彈窗顯示
                modalImage.onerror = function() {
                    console.log('廣告圖片載入失敗，使用預設內容');
                    checkModalDisplay();
                };
            } else {
                // 如果沒有獲取到圖片，直接檢查彈窗顯示
                checkModalDisplay();
            }
        } else {
            // 如果沒有獲取到素材，直接檢查彈窗顯示
            checkModalDisplay();
        }
    } else {
        // 如果沒有獲取到資源，直接檢查彈窗顯示
        checkModalDisplay();
    }
}).catch((error) => {
    console.error('獲取廣告資源失敗:', error);
    // 即使獲取失敗也要檢查彈窗顯示
    checkModalDisplay();
});


// 購物車數據
let cart = [];

// DOM元素
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartDisplay();
    
    // 搜尋功能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });
});

// 顯示商品
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="product-fallback" style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, #FFD700, #FFA500); align-items: center; justify-content: center; color: #000; font-size: 3rem;">
                    <i class="${product.fallbackIcon}"></i>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">NT$ ${product.price.toLocaleString()}</div>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> 加入購物車
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// 商品分類篩選
function filterProducts(category) {
    // 更新按鈕狀態
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 篩選商品
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    displayProducts(filteredProducts);
}

// 加入購物車
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showAddToCartAnimation();
}

// 從購物車移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// 更新商品數量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// 更新購物車顯示
function updateCartDisplay() {
    // 更新購物車數量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // 更新購物車商品列表
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">購物車是空的</p>';
        cartTotal.textContent = '0';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="cart-fallback" style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, #FFD700, #FFA500); align-items: center; justify-content: center; color: #000; font-size: 1.5rem; border-radius: 8px;">
                        <i class="${item.fallbackIcon}"></i>
                    </div>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">NT$ ${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="background: #ff4444; color: white; margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // 更新總價
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toLocaleString();
    }
}

// 切換購物車側邊欄
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : 'auto';
}

// 結帳功能
function checkout() {
    if (cart.length === 0) {
        alert('購物車是空的！');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `感謝您的購買！\n\n訂單總計：NT$ ${total.toLocaleString()}\n\n商品數量：${cart.length} 項\n\n我們將盡快為您處理訂單。`;
    
    alert(message);
    
    // 清空購物車
    cart = [];
    updateCartDisplay();
    toggleCart();
}

// 加入購物車動畫
function showAddToCartAnimation() {
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> 已加入';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '#FFD700';
    }, 1500);
}

// 滾動到商品區域
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// 平滑滾動導航
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 滾動時導航欄效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 215, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        navbar.style.backdropFilter = 'none';
    }
});

// 商品卡片懸停效果
document.addEventListener('DOMContentLoaded', function() {
    // 為商品卡片添加懸停效果
    const style = document.createElement('style');
    style.textContent = `
        .product-card {
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .product-card:hover .add-to-cart {
            background: #FFA500;
            transform: scale(1.05);
        }
        
        .category-card:hover {
            transform: translateY(-10px) scale(1.02);
        }
        
        .news-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
});

// 響應式導航菜單
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// 添加移動端菜單按鈕（如果需要）
document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.querySelector('.nav-container');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.display = 'none';
    mobileMenuBtn.onclick = toggleMobileMenu;
    
    // 在移動端顯示菜單按鈕
    if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'block';
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });
});

// 商品圖片懶加載
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 初始化懶加載
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// 彈窗控制函數
function showModal() {
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// 顯示彈窗（每次進入都顯示）
function checkModalDisplay() {
    // 延遲顯示彈窗，讓頁面完全載入
    setTimeout(() => {
        showModal();
    }, 1000);
}

// 點擊遮罩關閉彈窗
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// ESC鍵關閉彈窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
        closeModal();
    }
});
