# 中信育樂商城

一個現代化的中信兄弟官方商品展示網站，參考了 [中信兄弟官方商城](https://www.brothers-shop.com.tw/brothers/) 的設計風格。

## 功能特色

### 🛍️ 商品展示
- 響應式商品網格布局
- 商品分類篩選（球衣、服飾、配件、週邊商品）
- 即時搜尋功能
- 商品詳細資訊展示

### 📢 進站彈窗（整合資源位 SDK）
- 進站時自動顯示彈窗（每次進入都顯示）
- 圖片來源整合資源位 SDK，使用 `material.image_url`
- 點擊彈窗圖片可於新分頁開啟跳轉連結（使用 `material.navigate_url`）
- 支援點擊遮罩、關閉按鈕、ESC 鍵關閉

### 🛒 購物車功能
- 側邊欄購物車
- 商品數量調整
- 即時價格計算
- 購物車商品管理

### 📱 響應式設計
- 支援桌面、平板、手機等各種設備
- 現代化的UI/UX設計
- 流暢的動畫效果

### 🎨 視覺設計
- 中信兄弟經典黃色主題
- 現代化卡片式設計
- 優雅的懸停效果
- 清晰的視覺層次

## 文件結構

```
中信育樂/
├── main.html           # 主頁面（含彈窗與 SDK script）
├── styles.css          # 樣式文件
├── script.js           # JavaScript 功能（含購物車/搜尋/彈窗邏輯）
└── README.md           # 說明文件
```

## 使用方法

1. 直接在瀏覽器中打開 `main.html` 文件
2. 或使用本地服務器運行（推薦）

### 使用本地服務器（推薦）

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx http-server

# 使用PHP
php -S localhost:8000
```

然後在瀏覽器中訪問 `http://localhost:8000`

> 注意：主頁 `main.html` 已引入資源位 SDK：
> `<script src="https://unpkg.com/gmp-resource-sdk@0.0.2-alpha.17/dist/gmp-resource-sdk.js"></script>`
> 並於 `script.js` 內初始化與取用 `image_url`、`navigate_url`。

## 主要功能說明

### 商品管理
- 商品數據存儲在 `script.js` 中的 `products` 數組
- 支援添加、編輯、刪除商品
- 商品包含：名稱、價格、分類、圖片、描述

### 購物車系統
- 本地存儲購物車數據
- 支援商品數量調整
- 即時計算總價
- 結帳功能

### 進站彈窗
- 在 `main.html` 中加入彈窗結構與遮罩
- 在 `styles.css` 中定義 `.modal-overlay`、`.modal` 等樣式與動畫
- 在 `script.js` 中：
  - 初始化並呼叫 SDK 取得 `material.image_url` 設為彈窗圖片
  - 若存在 `material.navigate_url`，點擊圖片於新分頁開啟
  - 使用 `checkModalDisplay()` 控制每次載入延遲 1 秒顯示彈窗

### 搜尋與篩選
- 即時搜尋商品名稱和描述
- 按分類篩選商品
- 動態更新商品列表

## 技術特點

- **純前端實現**：無需後端服務器
- **現代CSS**：使用Grid和Flexbox布局
- **原生JavaScript**：無需額外框架
- **響應式設計**：適配各種屏幕尺寸
- **優雅動畫**：CSS3動畫和過渡效果
 - **第三方整合**：資源位 SDK 圖片與跳轉連結自動渲染

## 自定義說明

### 修改商品數據
在 `script.js` 文件中找到 `products` 數組，可以：
- 添加新商品
- 修改現有商品資訊
- 調整商品分類

### 修改樣式
在 `styles.css` 文件中可以：
- 調整顏色主題
- 修改布局樣式
- 自定義動畫效果

### 添加新功能
在 `script.js` 文件中可以：
- 添加新的交互功能
- 擴展購物車功能
- 整合第三方服務

## 瀏覽器支援

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 授權

此項目僅供學習和展示用途。中信兄弟相關商標和品牌歸中國信託育樂股份有限公司所有。

## 聯絡資訊

如有問題或建議，歡迎聯繫開發團隊。

---

**注意**：此網站為展示用途，實際商品資訊請以官方商城為準。
