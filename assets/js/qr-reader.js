
// 要素を取得する関数
function getEle(id) {
  return document.getElementById(id);
}

// 画像をトリミング
const logoImage = getEle('logoImage');
const cropButton = getEle('cropButton');
let cropper;
let croppedImageBase64 = "";

logoImage.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const preview = getEle('preview');
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      if (cropper) cropper.destroy();
      cropper = new Cropper(preview, { viewMode: 1 });
      cropButton.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

cropButton.addEventListener('click', () => {
  const croppedCanvas = getEle('croppedCanvas');
  const croppedImage = cropper.getCroppedCanvas();
  croppedImageBase64 = croppedImage.toDataURL();
  let size = getDataMapVal("size");

  // QRコードの基本オプション
  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    data: "https://example.com",
    dotsOptions: { color: "#999" },
    image: croppedImageBase64,
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
  });

  document.getElementById("qrCode").innerHTML = "";
  qrCode.append(document.getElementById("qrCode"));
});

// tabの切り替え
function switchTab(index) {
  const tabs = [...document.querySelectorAll(".tab")];
  const forms = [...document.querySelectorAll(".form-container")];

  tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
  forms.forEach((form, i) => form.classList.toggle("active", i === index));
}

// tabの切り替え2
function switchTab2(index) {
  const logoTabs = [...document.querySelectorAll(".logo-tab")];
  const container = [...document.querySelectorAll(".logo-container")];

  logoTabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
  container.forEach((form, i) => form.classList.toggle("active", i === index));
}

// ロゴタイプの切り替え
function changeLogoType() {
  const addLogo = getEle("addLogo");
  const errorLevel = getEle("errorLevel");
  // ロゴ追加時に耐久度をHにする
  if (addLogo.value === "0") {
    errorLevel.disabled = false;
  } else {
    errorLevel.value = "H";
    errorLevel.disabled = true;
  }

  if (addLogo.value === "tx") {
    switchTab2(0);
  } else if (addLogo.value === "im") {
    switchTab2(1);
  }
}

// フォント切り替え
function changeFont(selectId) {
  const selectBox = getEle(selectId);
  const fontClassMap = {
    m: "f-m", yg: "f-yg", pg: "f-pg",
    pm: "f-pm", hk: "f-hk", hm: "f-hm"
  };
  selectBox.className = fontClassMap[selectBox.value] || "";
}

// グラデーションパターン
document.querySelectorAll('#dotColor, #gradEnd, #gradientType, #rotation').forEach(el => {
  el.addEventListener('input', drawPattern);
});
function drawPattern() {
  const patternCanvas = getEle("patternCanvas");
  const dotColor = getEle("dotColor").value;
  const gradEnd = getEle("gradEnd").value;
  const gradientType = getEle("gradientType").value;
  const rotation = parseInt(getEle("rotation").value);

  patternCanvas.innerHTML = "";

  if (gradientType === "linear") {
    const pattern = document.createElement("div");
    pattern.className = "pattern";
    pattern.style.transform = "rotate(" + rotation + "deg)";

    const left = document.createElement("div");
    left.className = "half left";
    left.style.backgroundColor = dotColor;

    const right = document.createElement("div");
    right.className = "half right";
    right.style.backgroundColor = gradEnd;

    pattern.appendChild(left);
    pattern.appendChild(right);
    patternCanvas.appendChild(pattern);
  } else if (gradientType === "radial") {
    const squareContainer = document.createElement("div");
    squareContainer.className = "square-container";
    squareContainer.style.setProperty("--gradEnd", gradEnd);

    const square = document.createElement("div");
    square.className = "square";
    square.style.setProperty("--dotColor", dotColor);

    squareContainer.appendChild(square);
    patternCanvas.appendChild(squareContainer);
  }
}
drawPattern();

// 色の同期
function syncColor() {
  if (getEle("selectLc").checked) {
    getEle("logoColor").value = getEle("dotColor").value;
  }
}
// 色の同期
getEle("dotColor").addEventListener('input', syncColor);
getEle("selectLc").addEventListener('change', function () {
  if (this.checked) {
    getEle("logoColor").disabled = true;
    getEle("logoColor").value = getEle("dotColor").value;
  } else {
    getEle("logoColor").disabled = false;
  }
});
syncColor()

// URLのクリアボタン
function clearInput() {
  getEle("data").value = "";
}

// ポップアップを開閉
function togglePopup(popup, state) {
  popup.style.display = state ? "flex" : "none";
}

// QRコードの拡大ボタン
function zoomQRCode() {
  getEle("errorMessage").textContent = "";

  if (window.getComputedStyle(getEle("qrContainer")).display === "none") {
    getEle("errorMessage").textContent = "QRコードを生成してください";
    return;
  }
  getEle("popupImage").src = getEle("qrCodeImage").src;
  togglePopup(getEle("popup"), true);
}

function clearDetails() {
  document.querySelectorAll(":is(input, select, textarea)").forEach((el) => {
    if (el.type === "checkbox") {
      el.checked = el.defaultChecked;
    } else if (el.tagName === "SELECT") {
      // デフォルト選択されたオプションを探して設定
      const defaultOption = Array.from(el.options).find(opt => opt.defaultSelected);
      el.value = defaultOption ? defaultOption.value : el.dataset.defaultValue ?? el.defaultValue;
    } else {
      el.value = el.dataset.defaultValue ?? el.defaultValue;
    }
  });

  updateSectionVisibility();
  history.replaceState({}, "", location.pathname);
  generateQRCode();
}

// URLのクエリパラメータを削除してページをリロード
function resetAll() {
  history.replaceState(null, "", location.pathname);
  clearDetails();
  getEle("data").value = "https://example.com";
  getEle("qrContainer").style.display = "none";

  // location.reload();
}

// 各セクションの表示・非表示を更新
function updateSectionVisibility() {
  Object.entries({
    "gradient-area": "gradient",
    "title-area": "addTitle",
    "bgColor-area": "transparentBg"
  }).forEach(([areaId, checkboxId]) => toggleElement(checkboxId, areaId));
}

function toggleElement(checkboxId, areaId, inverse = false) {
  const checkbox = getEle(checkboxId);
  const area = getEle(areaId);

  const updateDisplay = () => area.style.display = (inverse !== checkbox.checked) ? "block" : "none";

  checkbox.addEventListener("change", updateDisplay);
  updateDisplay();
}

// 各要素の統合オブジェクト
const dataMap = {
  size: { k: "s", val: null, def: "300" },
  dotColor: { k: "dc", val: null, def: "#000000", pre: "#" },
  gradient: { k: "ig", val: null, def: "0" },
  gradEnd: { k: "gc", val: null, def: "#0000ff", pre: "#", flg: "gradient" },
  gradientType: { k: "gt", val: null, def: "linear", flg: "gradient" },
  rotation: { k: "gr", val: null, def: "90", flg: "gradient" },
  dotShape: { k: "ds", val: null, def: "square" },
  transparentBg: { k: "tb", val: null, def: "0" },
  bgColor: { k: "bg", val: null, def: "#ffffff", pre: "#", flg: "transparentBg" },
  margin: { k: "m", val: null, def: "10" },
  errorLevel: { k: "e", val: null, def: "M" },

  addLogo: { k: "al", val: null, def: "0" },
  logoText: { k: "lt", val: null, def: "", flg: "tx" },
  logoSize: { k: "ls", val: null, def: "50", flg: "tx" },
  logoFontFamily: { k: "lf", val: null, def: "m", flg: "tx" },
  logoLineHeight: { k: "lh", val: null, def: "1.1", flg: "tx" },
  selectLc: { k: "sl", val: null, def: "0", flg: "tX" },
  logoColor: { k: "lc", val: null, def: "#000000", pre: "#", flg: "tx" },

  addTitle: { k: "at", val: null, def: "0" },
  titleText: { k: "tt", val: null, def: "", flg: "addTitle" },
  titleSize: { k: "ts", val: null, def: "16", flg: "addTitle" },
  titleFontFamily: { k: "tf", val: null, def: "m", flg: "addTitle" },
  titleLineHeight: { k: "th", val: null, def: "1.1", flg: "addTitle" },
  titleColor: { k: "tc", val: null, def: "#000000", pre: "#", flg: "addTitle" }
}

// データマップの値を取得する関数
function getDataMapVal(key) {
  let value = "";
  if (getEle(key).type === "checkbox") {
    value = dataMap[key].val === "1" ? true : false;
  } else {
    value = dataMap[key].val !== null ? dataMap[key].val : dataMap[key].def;
  }
  return value;
}

// QRコードを作成
function generateQRCode() {
  const data = getEle("data").value.trim(); //URL

  if (!data) {
    getEle("errorMessage").textContent = "URLを入力してください";
    getEle("qrCodeImage").src = "";
    getEle("qrContainer").style.display = "none";
    getEle("qr-preview").style.display = "block";

    return;
  }

  // インプットをデータマップに入れる関数
  updateDataMapFromInputs()

  let size = getDataMapVal("size");
  let dotColor = getDataMapVal("dotColor");
  let gradient = getDataMapVal("gradient");
  let gradEnd = getDataMapVal("gradEnd");
  let gradientType = getDataMapVal("gradientType");
  let rotation = getDataMapVal("rotation") * Math.PI / 180;
  let dotShape = getDataMapVal("dotShape") === "circle" ? "dots" : getDataMapVal("dotShape");
  let transparentBg = getDataMapVal("transparentBg");
  let bgColor = transparentBg ? "transparent" : getDataMapVal("bgColor");
  let margin = getDataMapVal("margin");
  let errorLevel = getDataMapVal("errorLevel");
  let addLogo = getDataMapVal("addLogo");
  let logoText = getDataMapVal("logoText").trim();
  let logoSize = getDataMapVal("logoSize");
  let selectLc = getDataMapVal("selectLc");
  let logoColor = getDataMapVal("logoColor");
  let logoFontFamily = getDataMapVal("logoFontFamily");
  let logoLineHeight = getDataMapVal("logoLineHeight");
  let addTitle = getDataMapVal("addTitle");
  let titleText = getDataMapVal("titleText").trim();
  let titleSize = getDataMapVal("titleSize");
  let titleColor = getDataMapVal("titleColor");
  let titleFontFamily = getDataMapVal("titleFontFamily");
  let titleLineHeight = getDataMapVal("titleLineHeight");

  let image = ""
  if (addLogo === "im") {
    image = croppedImageBase64;
  }

  // QRコードの基本オプション
  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    data: data,
    dotsOptions: {
      color: dotColor,
      type: dotShape,
      gradient: !gradient ? null : {
        type: gradientType,
        rotation: rotation,
        colorStops: [
          { offset: 0, color: dotColor },
          { offset: 1, color: gradEnd }
        ]
      }
    },
    backgroundOptions: { color: bgColor },
    margin: margin,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: errorLevel
    },
    image: image,
    imageOptions: !image ? "" : { crossOrigin: "anonymous", margin: 5 }
  });

  // QRコードを作成
  qrCode.getRawData().then((blob) => {
    const qrImg = new Image();
    qrImg.src = URL.createObjectURL(blob);
    qrImg.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(qrImg, 0, 0, size, size);

      // ロゴを入れる
      if (addLogo === "tx") {
        const logoOption = {
          text: logoText, size: logoSize, color: logoColor, fontFamily: logoFontFamily, lineHeight: logoLineHeight
        };
        drawLogo(ctx, size, bgColor, logoOption);
      }

      // ここにタイトルを入れる処理を追加
      if (addTitle) {
        const titleOption = {
          text: titleText, size: titleSize, color: titleColor, fontFamily: titleFontFamily, lineHeight: titleLineHeight
        };
        addTitleToImage(ctx, bgColor, titleOption);
      }

      getEle("errorMessage").textContent = "";
      getEle("qrCodeImage").src = canvas.toDataURL();
      getEle("qrContainer").style.display = "block";
      getEle("qr-preview").style.display = "none";

    };
    togglePopup(getEle("settingsPopup"), false);
  });
}

// ロゴサイズを決める関数
function calculateTextSize(ctx, text, textOptions, maxSize) {
  ctx.font = textOptions.size + "px " + textOptions.fontFamily;

  const lines = text.split("\n");
  const textLineHeight = textOptions.lineHeight ? textOptions.lineHeight : 1.1;
  const lineHeight = textOptions.size * textOptions.lineHeight;
  const textWidths = lines.map(line => ctx.measureText(line).width);
  const textWidth = Math.min(Math.max(...textWidths), maxSize);
  const textHeight = Math.min(lineHeight * lines.length, maxSize);

  return { lines, lineHeight, textWidth, textHeight };
}

// ロゴを入れる関数
function drawLogo(ctx, size, bgColor, logoOption) {
  const maxSize = size * 0.3;
  const { lines, lineHeight, textWidth, textHeight } = calculateTextSize(ctx, logoOption.text, logoOption, maxSize);

  const centerX = size / 2;
  const centerY = size / 2;

  if (bgColor === "transparent") {
    // 透明にくり抜く
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    // 背景色を塗りつぶし（中央寄せ）
    ctx.fillStyle = bgColor;
  }
  ctx.fillRect(
    centerX - textWidth / 2, centerY - textHeight / 2,
    textWidth, textHeight
  );

  // 描画モードを戻す
  ctx.globalCompositeOperation = 'source-over';

  // 文字を描画
  ctx.fillStyle = logoOption.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.save();
  ctx.beginPath();
  ctx.rect(centerX - textWidth / 2, centerY - textHeight / 2, textWidth, textHeight);
  ctx.clip();

  lines.forEach((line, i) => {
    ctx.fillText(line, centerX, centerY - textHeight / 2 + (i + 0.5) * lineHeight);
  });
  ctx.restore();
}

// タイトルを追加する
function addTitleToImage(ctx, bgColor, titleOption) {
  // 現在のキャンバスサイズを取得
  const canvas = ctx.canvas;
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  // テキストの折り返し処理
  const { lines, lineHeight, textWidth, textHeight } = calculateTextSize(ctx, titleOption.text, titleOption, originalWidth);
  const newHeight = originalHeight + textHeight + 5;

  // 新しいキャンバスを作成（高さを増やす）
  const newCanvas = document.createElement("canvas");
  newCanvas.width = originalWidth;
  newCanvas.height = newHeight;
  const newCtx = newCanvas.getContext("2d");

  // 元のQRコード画像を描画
  newCtx.drawImage(canvas, 0, 0, originalWidth, originalHeight);

  // テキスト背景を描画
  if (bgColor === "transparent") {
    // 透明にくり抜く
    newCtx.globalCompositeOperation = 'destination-out';
  } else {
    // 背景色を塗りつぶし（中央寄せ）
    newCtx.fillStyle = bgColor;
  }
  newCtx.fillRect(0, originalHeight, originalWidth, textHeight + 5);

  // 描画モードを戻す
  newCtx.globalCompositeOperation = 'source-over';

  // テキストを描画
  newCtx.fillStyle = titleOption.color;
  newCtx.font = titleOption.size + "px " + titleOption.fontFamily;
  newCtx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = originalWidth / 2;

  lines.forEach((line, index) => {
    newCtx.fillText(line, centerX, originalHeight + 0 + (index + 0.5) * lineHeight);
  });

  // 元のキャンバスを更新
  ctx.canvas.width = newCanvas.width;
  ctx.canvas.height = newCanvas.height;
  ctx.clearRect(0, 0, newCanvas.width, newCanvas.height);
  ctx.drawImage(newCanvas, 0, 0);
}

// 取得したパラメータをデータマップに入れる関数
function collectParamsFromURL() {
  const params = getUrlParams();
  Object.keys(dataMap).forEach(key => {
    let value = "";
    if (key === "logoText" || key === "titleText") {
      value = decodeURIComponent(params.get(dataMap[key].k) || "");
    } else {
      value = params.get(dataMap[key].k);
    }

    if (getEle(key).type === "checkbox") {
      dataMap[key].val = value === "1" ? "1" : null;
    } else {
      dataMap[key].val = value ? value : null;
    }
  });
}

// データマップをインプットに入れる関数（valがnullなら初期値を設定）
function populateInputsFromDataMap() {
  for (const key in dataMap) {
    const input = getEle(key);
    if (!input) { continue }

    if (dataMap[key].val !== null) {
      if (getEle(key).type === "checkbox" && dataMap[key].val === "1") {
        input.checked = true;
        continue
      }
      input.value = dataMap[key].pre ? dataMap[key].pre + dataMap[key].val : "" + dataMap[key].val;
      continue
    }
    input.value = dataMap[key].def;
  }
}

// インプットをデータマップに入れる関数
function updateDataMapFromInputs() {
  for (const key in dataMap) {
    // ロゴがテキストモードじゃなきゃnullにする
    if (dataMap[key].flg === "tx") {
      dataMap[key].val = getEle("addLogo").value === "tx" ? getEle(key).value : null;
      continue;
    }
    // チェックボックスの判定
    if (getEle(key).type === "checkbox") {
      dataMap[key].val = getEle(key).checked ? "1" : null;
      continue;
    }
    // デフォルトならvalをnullにする
    if (getEle(key).value === dataMap[key].def) {
      dataMap[key].val = null;
      continue;
    }
    // チェックボックスの有無でvalをnullにする
    if (dataMap[key].flg === "transparentBg") {
      if (getEle(dataMap[key].flg).checked) {
        dataMap[key].val = null;
        continue;
      }
    } else if (dataMap[key].flg != null && !getEle(dataMap[key].flg).checked) {
      dataMap[key].val = null;
      continue;
    }
    dataMap[key].val = getEle(key).value;
  }

  // パラメータをURLにセットする関数
  setUrlParams()
}

// データマップのデフォルトじゃない値をパラメータにする関数
function getQueryParams() {
  const params = new URLSearchParams();
  for (const key in dataMap) {
    if (key === "logoText" || key === "titleText") {
      if (getEle(key).value !== "") {
        params.set(dataMap[key].k, encodeURIComponent(getEle(key).value));
      }
      continue;
    } else if (dataMap[key].val !== null) {
      const value = dataMap[key].pre ? dataMap[key].val.replace(dataMap[key].pre, "") : dataMap[key].val;
      params.set(dataMap[key].k, value);
    }
  }
  return params;
}

// URLからパラメータを取得する関数 ※GASと違う
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return params;
}

// パラメータをURLにセットする関数 ※GASと違う
function setUrlParams() {
  // データマップのデフォルトじゃない値をパラメータにする関数
  const params = getQueryParams();
  const newUrl = params.toString() ? "?" + params.toString() : "";

  // パラメータを更新
  window.history.pushState(null, "", newUrl); // GASじゃ動かない

  // クエリ文字列を作成
  const queryString = params.toString()
  const response = window.location.href + queryString // GASじゃ動かない

  updateURL(response); // GASじゃ動かない
}

// URLを表示 ※GASと違う
function updateURL(response) {
  // URLをページ遷移せずに表示
  getEle("result").innerHTML =
    `<p><strong>設定を保存したURL:</strong> <a href="${response}" target="_blank">${response}</a></p>`;
}

window.onload = function () {

  // 取得したパラメータをデータマップに入れる
  collectParamsFromURL();
  // データマップをインプットに入れる関数
  populateInputsFromDataMap()

  // QRコード生成
  const params = getQueryParams();
  if (params.toString()) {
    generateQRCode();
  }

  // グラデーションパターンの角度
  drawPattern();

  // 各セクションの表示・非表示を更新
  updateSectionVisibility();

  // ロゴタイプの切り替え
  changeLogoType();

  // エリアの表示・非表示を制御する関数
  function toggleSection(checkboxId, areaId, reverse = false) {
    const checkbox = getEle(checkboxId);
    const area = getEle(areaId);

    function updateDisplay() {
      area.style.display = checkbox.checked !== reverse ? "block" : "none";
    }
    checkbox.addEventListener("change", updateDisplay);
    updateDisplay(); // 初期状態を適用
  }
  // 各エリアの制御を適用
  toggleSection("gradient", "gradient-area");
  toggleSection("addTitle", "title-area");
  toggleSection("transparentBg", "bgColor-area", true);
};