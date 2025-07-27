
  // メニューの表示切り替え
  function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("active");

    if (menu.classList.contains("active")) {
      // メニューが開かれた時のみクリックリスナー追加
      document.addEventListener("click", closeMenuOutsideClick);
    } else {
      document.removeEventListener("click", closeMenuOutsideClick);
    }
  }

  // メニュー以外をクリックしたら閉じる
  function closeMenuOutsideClick(e) {
    const menu = document.getElementById("menu");
    const button = document.getElementById("menuButton"); // ボタンのID（必要なら追加）

    if (!menu.contains(e.target) && !button.contains(e.target)) {
      menu.classList.remove("active");
      document.removeEventListener("click", closeMenuOutsideClick);
    }
  }





// // 新ハンバーガーメニュー
// document.addEventListener("DOMContentLoaded", () => {
//   includeHtml().then(() => {
//     // DOM確定待ち
//     requestAnimationFrame(() => {
//       initHeader();
//     });
//   });
// });

// function initHeader() {
//   const menuToggle = document.getElementById("menu-toggle"); // memuボタンのid
//   const navMenu = document.getElementById("nav-menu"); // navのid
//   const header = document.querySelector(".site-header"); // headerのクラス

//   if (menuToggle && navMenu) {
//     menuToggle.addEventListener("click", (e) => {
//       e.stopPropagation();
//       e.preventDefault(); // 必要なら
//       menuToggle.classList.toggle("active");
//       navMenu.classList.toggle("show");
//     });

//     document.addEventListener("click", (e) => {
//       if (
//         navMenu.classList.contains("show") &&
//         !navMenu.contains(e.target) &&
//         !menuToggle.contains(e.target)
//       ) {
//         navMenu.classList.remove("show");
//         menuToggle.classList.remove("active");
//       }
//     });
//   }

//   if (header) {
//     window.addEventListener("scroll", () => {
//       if (window.scrollY > 20) {
//         header.classList.add("scrolled");
//       } else {
//         header.classList.remove("scrolled");
//       }
//     });
//   }
// }
