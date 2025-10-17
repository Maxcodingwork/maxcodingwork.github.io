// script.js

// 1. 取得需要操作的 DOM 元素
const openModalBtn = document.getElementById('open-modal-btn');
const modal = document.getElementById('modal');
const closeModalBtn = modal.querySelector('.close-btn');
const overlay = modal.querySelector('.modal-overlay');

// 2. 定義打開彈窗的函式
const openModal = () => {
    modal.classList.add('is-open');
};

// 3. 定義關閉彈窗的函式
const closeModal = () => {
    modal.classList.remove('is-open');
};

// 4. 綁定事件監聽器
// 點擊「打開按鈕」時，執行 openModal 函式
openModalBtn.addEventListener('click', openModal);

// 點擊「關閉按鈕」時，執行 closeModal 函式
closeModalBtn.addEventListener('click', closeModal);

// 點擊「背景遮罩」時，也執行 closeModal 函式
overlay.addEventListener('click', closeModal);
