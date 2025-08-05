// 共通パーツを読み込む関数
document.addEventListener("DOMContentLoaded", () => {
  includeHtml();
});

function includeHtml() {
  const includeTargets = document.querySelectorAll("[data-include]");
  const promises = [];

  includeTargets.forEach(el => {
    const file = el.getAttribute("data-include");
    const p = fetch(file)
      .then(response => response.text())
      .then(data => {
        el.innerHTML = data;
      });
    promises.push(p);
  });

  return Promise.all(promises);
}