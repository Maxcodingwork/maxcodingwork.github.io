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


// Finder SDK
window.collectEvent('init', {
    app_id: 10000047, // 参考2.1节获取，注意类型是number而非字符串
    channel_domain: 'https://cdp.altatech.tw', // 设置私有化部署数据上送地址，参考2.2节获取
    log: true, // true:开启日志，false:关闭日志
    autotrack: true, // 全埋点开关，true开启，false关闭
  });
  // 此处可添加设置uuid、设置公共属性等代码
  window.collectEvent('start'); // 通知SDK设置完毕，可以真正开始发送事件了

// 資源位 SDK
const sdk = new GmpResourceSDK({ 
    host: 'https://ma.altatech.tw', 
    appid: 8, // number
    uuid: '578237563093909526', 
    idType: 'baseid', // 根據實際情況設置
    webId: '578237563093909526',
    onEvent: function(eventName, eventParams) {
      eventParams.activity_id = '';
      window.collectEvent(eventName, eventParams);
    }
  });


const resourceId = '7606814bd9d27b3fd5b191448fa61516';
// 後備 API Host（與資源位 SDK 同源）
const GMP_API_HOST = 'https://ma.altatech.tw';

// 彈窗相關變數
let popupData = null;
let popupShown = false;

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
const popupOverlay = document.getElementById('popupOverlay');
const popupContent = document.getElementById('popupContent');

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
    
    // 初始化彈窗功能
    initPopup();
});


// ==================== 彈窗功能 ====================

// 初始化彈窗
function initPopup() {
    // 檢查是否已經顯示過彈窗（使用localStorage記錄）
    const popupShownToday = localStorage.getItem('popupShownToday');
    const today = new Date().toDateString();
    
    // 添加調試信息
    console.log('彈窗初始化檢查:', {
        popupShownToday,
        today,
        shouldShow: popupShownToday !== today,
        sdkStatus: typeof sdk,
        resourceId
    });
    
    if (popupShownToday !== today) {
        // 延遲2秒後顯示彈窗，讓頁面完全載入
        setTimeout(() => {
            loadPopupContent();
        }, 2000);
    }
}

// 通過SDK載入彈窗內容
function loadPopupContent() {
    try {
        console.log('開始請求彈窗資源，resourceId:', resourceId);
        
        // 根據文檔3.2節，使用正確的SDK調用方式
        // 檢查SDK是否已初始化
        if (!sdk || typeof sdk.getResource !== 'function') {
            console.warn('SDK未正確初始化或getResource方法不存在，改用HTTP後備請求');
            fetchResourceSpaceDefaultMaterial();
            return;
        }
        
        // 構建請求參數，根據文檔3.1的數據結構
        const requestParams = {
            resource_id: resourceId,
            position: 'popup',
            page: 'homepage',
            user_agent: navigator.userAgent,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            timestamp: Date.now(),
            // 添加更多必要的參數
            device_type: 'web',
            platform: 'browser',
            version: '1.0.0'
        };
        
        console.log('SDK請求參數:', requestParams);
        
        sdk.getResource(resourceId, requestParams).then(response => {
            console.log('SDK彈窗響應:', response);
            
            // 根據文檔3.1的數據結構處理響應
            if (response) {
                // 檢查響應結構
                if (response.code === 0 || response.success === true) {
                    // 成功響應
                    const data = response.data || response.result;
                    
                    if (data && (data.image_url || data.html_content || data.content)) {
                        popupData = data;
                        
                        // 記錄彈窗曝光事件
                        window.collectEvent('popup_exposure', {
                            resource_id: resourceId,
                            popup_type: 'sdk_popup',
                            timestamp: Date.now(),
                            response_code: response.code || 0
                        });
                        
                        // 執行自渲染
                        renderPopupContent(popupData);
                        showPopup();
                    } else {
                        console.warn('SDK返回的數據格式不正確:', data);
                        showDefaultPopup();
                    }
                } else {
                    // 失敗響應
                    console.warn('SDK返回失敗狀態:', response.message || response.msg);
                    showDefaultPopup();
                }
            } else {
                console.warn('SDK返回空響應');
                showDefaultPopup();
            }
        }).catch(error => {
            console.error('SDK彈窗請求失敗:', error);
            console.error('錯誤詳情:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // 記錄錯誤事件
            window.collectEvent('popup_error', {
                resource_id: resourceId,
                error_message: error.message,
                error_type: error.name,
                timestamp: Date.now()
            });
            
            // 請求失敗時嘗試後備HTTP請求
            fetchResourceSpaceDefaultMaterial();
        });
    } catch (error) {
        console.error('彈窗初始化錯誤:', error);
        // 發生異常時嘗試後備HTTP請求
        fetchResourceSpaceDefaultMaterial();
    }
}

// 後備：透過 HTTP 調用 getResourceSpaceDefaultMaterial 並自渲染
async function fetchResourceSpaceDefaultMaterial() {
    try {
        const url = `${GMP_API_HOST}/gmp/openapi/v3/resource_space/getResourceSpaceDefaultMaterial`;
        console.log('後備HTTP請求:', url);
        const resp = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'omit'
        });
        if (!resp.ok) {
            console.error('HTTP請求失敗，狀態碼:', resp.status);
            showDefaultPopup();
            return;
        }
        const json = await resp.json();
        console.log('HTTP回應資料:', json);
        if (!json || (json.code !== 0) || !json.data || !Array.isArray(json.data.full_data)) {
            console.warn('HTTP回應結構不符合預期');
            showDefaultPopup();
            return;
        }
        const match = json.data.full_data.find(item => item && item.key === resourceId);
        if (!match || !Array.isArray(match.customer_material_list) || match.customer_material_list.length === 0) {
            console.warn('找不到對應資源位或素材列表為空');
            showDefaultPopup();
            return;
        }
        const material = match.customer_material_list[0];
        // 對齊自渲染結構
        const mapped = {
            image_url: material.image_url,
            click_url: material.navigate_url,
            title: material.text || '活動推薦',
            extra: material.extra || {},
            material_id: material.material_id,
            frame_id: material.frame_id,
            type: material.type
        };

        // 上報曝光事件
        window.collectEvent('popup_exposure', {
            resource_id: resourceId,
            popup_type: 'http_fallback',
            timestamp: Date.now(),
            material_id: material.material_id,
            frame_id: material.frame_id
        });

        renderPopupContent(mapped);
        showPopup();
    } catch (err) {
        console.error('後備HTTP請求異常:', err);
        window.collectEvent('popup_error', {
            resource_id: resourceId,
            error_message: err.message,
            error_type: err.name,
            timestamp: Date.now()
        });
        showDefaultPopup();
    }
}

// 自渲染彈窗內容
function renderPopupContent(data) {
    if (!data || !popupContent) return;
    
    console.log('開始渲染彈窗內容:', data);
    
    // 清空現有內容
    popupContent.innerHTML = '';
    
    // 根據文檔3.1的數據結構渲染內容
    if (data.image_url || data.imageUrl) {
        // 如果有圖片URL，創建圖片元素
        const imageUrl = data.image_url || data.imageUrl;
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = data.title || data.alt || '彈窗廣告';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.maxHeight = '80vh';
        img.style.objectFit = 'contain';
        
        // 添加點擊事件
        const clickUrl = data.click_url || data.clickUrl || data.link_url;
        if (clickUrl) {
            img.style.cursor = 'pointer';
            img.onclick = () => {
                handlePopupClick({
                    click_url: clickUrl,
                    title: data.title,
                    resource_id: resourceId
                });
            };
        }
        
        // 添加載入錯誤處理
        img.onerror = () => {
            console.error('彈窗圖片載入失敗:', imageUrl);
            showDefaultPopup();
        };
        
        // 添加載入成功處理
        img.onload = () => {
            console.log('彈窗圖片載入成功:', imageUrl);
        };
        
        popupContent.appendChild(img);
        
    } else if (data.html_content || data.htmlContent) {
        // 如果有HTML內容，直接插入
        const htmlContent = data.html_content || data.htmlContent;
        popupContent.innerHTML = htmlContent;
        
        // 為HTML內容中的連結添加點擊事件
        const links = popupContent.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handlePopupClick({
                    click_url: link.href,
                    title: data.title,
                    resource_id: resourceId
                });
            });
        });
        
    } else if (data.content) {
        // 如果有純文本內容
        const contentDiv = document.createElement('div');
        contentDiv.style.padding = '40px';
        contentDiv.style.textAlign = 'center';
        contentDiv.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        contentDiv.style.color = '#000';
        contentDiv.style.borderRadius = '15px';
        
        contentDiv.innerHTML = `
            <h2 style="margin-bottom: 20px; font-size: 2rem;">${data.title || '中信兄弟商城'}</h2>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${data.content}</p>
            ${data.click_url || data.clickUrl ? `
                <button onclick="handlePopupClick({click_url: '${data.click_url || data.clickUrl}', title: '${data.title}', resource_id: '${resourceId}'})" 
                        style="background: #000; color: #fff; padding: 12px 30px; border: none; border-radius: 25px; font-size: 1.1rem; cursor: pointer; margin-top: 10px;">
                    ${data.button_text || data.buttonText || '立即查看'}
                </button>
            ` : ''}
        `;
        
        popupContent.appendChild(contentDiv);
        
    } else if (data.template_type || data.templateType) {
        // 如果有模板類型，根據模板渲染
        renderTemplateContent(data);
        
    } else {
        // 如果沒有有效內容，顯示預設彈窗
        console.warn('未識別的數據格式:', data);
        showDefaultPopup();
    }
}

// 根據模板類型渲染內容
function renderTemplateContent(data) {
    const templateType = data.template_type || data.templateType;
    
    switch (templateType) {
        case 'banner':
            renderBannerTemplate(data);
            break;
        case 'promotion':
            renderPromotionTemplate(data);
            break;
        case 'news':
            renderNewsTemplate(data);
            break;
        default:
            console.warn('未知的模板類型:', templateType);
            showDefaultPopup();
    }
}

// 橫幅模板
function renderBannerTemplate(data) {
    const bannerDiv = document.createElement('div');
    bannerDiv.style.position = 'relative';
    bannerDiv.style.width = '100%';
    bannerDiv.style.height = '400px';
    bannerDiv.style.background = `url('${data.background_image || data.backgroundImage}') center/cover`;
    bannerDiv.style.borderRadius = '15px';
    bannerDiv.style.overflow = 'hidden';
    
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(0,0,0,0.3)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = '#fff';
    overlay.style.textAlign = 'center';
    
    overlay.innerHTML = `
        <div>
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">${data.title || '中信兄弟'}</h2>
            <p style="font-size: 1.3rem; margin-bottom: 30px;">${data.subtitle || data.sub_title || ''}</p>
            ${data.button_text || data.buttonText ? `
                <button onclick="handlePopupClick({click_url: '${data.click_url || data.clickUrl}', title: '${data.title}', resource_id: '${resourceId}'})" 
                        style="background: #FFD700; color: #000; padding: 15px 30px; border: none; border-radius: 30px; font-size: 1.1rem; cursor: pointer; font-weight: bold;">
                    ${data.button_text || data.buttonText}
                </button>
            ` : ''}
        </div>
    `;
    
    bannerDiv.appendChild(overlay);
    popupContent.appendChild(bannerDiv);
}

// 促銷模板
function renderPromotionTemplate(data) {
    const promoDiv = document.createElement('div');
    promoDiv.style.padding = '40px';
    promoDiv.style.textAlign = 'center';
    promoDiv.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
    promoDiv.style.color = '#000';
    promoDiv.style.borderRadius = '15px';
    
    promoDiv.innerHTML = `
        <div style="background: rgba(255,255,255,0.9); padding: 30px; border-radius: 15px; margin: 20px 0;">
            <h2 style="margin-bottom: 15px; font-size: 2rem;">${data.title || '限時優惠'}</h2>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">${data.description || data.desc || ''}</p>
            <div style="font-size: 2rem; font-weight: bold; color: #ff4444; margin: 20px 0;">
                ${data.discount || data.discount_text || '8折優惠'}
            </div>
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 20px;">
                ${data.valid_time || data.validTime || '活動時間有限，立即搶購！'}
            </p>
            <button onclick="handlePopupClick({click_url: '${data.click_url || data.clickUrl}', title: '${data.title}', resource_id: '${resourceId}'})" 
                    style="background: #000; color: #fff; padding: 15px 40px; border: none; border-radius: 30px; font-size: 1.2rem; cursor: pointer; font-weight: bold;">
                ${data.button_text || data.buttonText || '立即搶購'}
            </button>
        </div>
    `;
    
    popupContent.appendChild(promoDiv);
}

// 新聞模板
function renderNewsTemplate(data) {
    const newsDiv = document.createElement('div');
    newsDiv.style.padding = '30px';
    newsDiv.style.background = '#fff';
    newsDiv.style.borderRadius = '15px';
    newsDiv.style.border = '2px solid #FFD700';
    
    newsDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 10px; font-size: 1.8rem;">${data.title || '最新消息'}</h2>
            <div style="color: #666; font-size: 0.9rem; margin-bottom: 20px;">
                ${data.publish_time || data.publishTime || new Date().toLocaleDateString()}
            </div>
        </div>
        <div style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            ${data.content || data.description || data.desc || ''}
        </div>
        ${data.click_url || data.clickUrl ? `
            <div style="text-align: center;">
                <button onclick="handlePopupClick({click_url: '${data.click_url || data.clickUrl}', title: '${data.title}', resource_id: '${resourceId}'})" 
                        style="background: #FFD700; color: #000; padding: 10px 25px; border: none; border-radius: 20px; font-size: 1rem; cursor: pointer;">
                    ${data.button_text || data.buttonText || '查看詳情'}
                </button>
            </div>
        ` : ''}
    `;
    
    popupContent.appendChild(newsDiv);
}

// 顯示預設彈窗
function showDefaultPopup() {
    if (!popupContent) return;
    
    popupContent.innerHTML = `
        <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000;">
            <i class="fas fa-gift" style="font-size: 4rem; margin-bottom: 20px;"></i>
            <h2 style="margin-bottom: 15px; font-size: 2rem;">歡迎來到中信兄弟商城！</h2>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">新會員專享優惠</p>
            <div style="background: rgba(255,255,255,0.9); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: #000; margin-bottom: 10px;">限時優惠</h3>
                <p style="color: #333; font-size: 1.1rem;">全館商品8折優惠</p>
                <p style="color: #666; font-size: 0.9rem;">優惠碼：WELCOME20</p>
            </div>
            <button onclick="handlePopupClick({click_url: '#products'})" 
                    style="background: #000; color: #fff; padding: 12px 30px; border: none; border-radius: 25px; font-size: 1.1rem; cursor: pointer; margin-top: 10px;">
                立即選購
            </button>
        </div>
    `;
    
    showPopup();
}

// 顯示彈窗
function showPopup() {
    if (!popupOverlay || popupShown) return;
    
    popupOverlay.classList.add('show');
    popupShown = true;
    document.body.style.overflow = 'hidden';
    
    // 記錄彈窗顯示
    localStorage.setItem('popupShownToday', new Date().toDateString());
}

// 關閉彈窗
function closePopup() {
    if (!popupOverlay) return;
    
    popupOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // 記錄彈窗關閉事件
    window.collectEvent('popup_close', {
        resource_id: resourceId,
        popup_type: 'sdk_popup',
        timestamp: Date.now()
    });
}

// 處理彈窗點擊事件
function handlePopupClick(data) {
    // 記錄點擊事件
    window.collectEvent('popup_click', {
        resource_id: resourceId,
        click_url: data.click_url,
        popup_type: 'sdk_popup',
        timestamp: Date.now()
    });
    
    // 關閉彈窗
    closePopup();
    
    // 如果有跳轉URL，進行跳轉
    if (data.click_url) {
        if (data.click_url.startsWith('http')) {
            // 外部連結
            window.open(data.click_url, '_blank');
        } else if (data.click_url.startsWith('#')) {
            // 頁面內錨點
            const target = document.querySelector(data.click_url);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // 其他情況，可能需要在同一個標籤頁打開
            window.location.href = data.click_url;
        }
    }
}

// 點擊遮罩關閉彈窗
popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
        closePopup();
    }
});

// ESC鍵關閉彈窗
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popupShown) {
        closePopup();
    }
});

// 調試功能：手動觸發彈窗測試
window.testPopup = function() {
    console.log('手動觸發彈窗測試');
    loadPopupContent();
};

// 調試功能：清除彈窗顯示記錄
window.clearPopupRecord = function() {
    localStorage.removeItem('popupShownToday');
    console.log('已清除彈窗顯示記錄，下次訪問將重新顯示彈窗');
};

// 調試功能：檢查SDK狀態
window.checkSDKStatus = function() {
    console.log('SDK狀態檢查:', {
        sdk: typeof sdk,
        sdkMethods: sdk ? Object.getOwnPropertyNames(sdk) : 'SDK未定義',
        getResource: sdk && typeof sdk.getResource,
        resourceId: resourceId,
        popupContent: !!popupContent,
        popupOverlay: !!popupOverlay
    });
};


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
