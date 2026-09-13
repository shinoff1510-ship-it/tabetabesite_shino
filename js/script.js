// ===== 初期化 =====
if (localStorage.getItem("gauge") === null) {
  localStorage.setItem("gauge", 0);
}

let hasFed = false;

// / ===== ゲージ描画 =====
function renderGauge() {
  const container = document.getElementById("gaugeContainer");
  if (!container) return;

  container.innerHTML = "";

  // ゲージの値を取得
  let gauge = parseInt(localStorage.getItem("gauge"), 10);

  // 数値としておかしい場合は0
  if (isNaN(gauge)) {
    gauge = 0;
  }

  // 0～10の範囲にする
  gauge = Math.max(0, Math.min(10, gauge));

  // ===== ゲージ10個生成 =====
  for (let i = 0; i < 10; i++) {

    const box = document.createElement("div");
    box.classList.add("gaugeBox");

    // 埋まっている部分
    if (i < gauge) {
      box.classList.add("filled");

      // 1～3個目 → 緑
      if (i < 3) {
        box.classList.add("level3");

      // 4～6個目 → 青
      } else if (i < 6) {
        box.classList.add("level6");

      // 7～9個目 → 紫
      } else if (i < 9) {
        box.classList.add("level9");

      // 10個目 → オレンジ
      } else {
        box.classList.add("level10");
      }
    }

    container.appendChild(box);
  }

// ===== 画像切り替え =====
const image = document.getElementById("gaugeImage");

if (image) {

  // ゲージ0
  if (gauge === 0) {
    image.src = "./images/gage_chara/gage_chara_00.png";

  // ゲージ1～3
  } else if (gauge <= 3) {
    image.src = "./images/gage_chara/gage_chara_01.png";

  // ゲージ4～6
  } else if (gauge <= 6) {
    image.src = "./images/gage_chara/gage_chara_02.png";

  // ゲージ7～9
  } else if (gauge <= 9) {
    image.src = "./images/gage_chara/gage_chara_03.png";

  // ゲージ10
  } else {
    image.src = "./images/gage_chara/gage_chara_04.png";
  }
}
}

renderGauge();


// ===== completeボタン =====
function showCompleteButton() {
  const btn = document.getElementById("completeButton");
  if (!btn) return;

  if (localStorage.getItem("isComplete") === "true") {
    btn.style.display = "block";
  }
}
showCompleteButton();

// ===== 食べ物選択（ここがポイント）=====
function selectFood(btn) {
  const type = btn.dataset.type;
  const video = btn.dataset.video;

  localStorage.setItem("selectedFood", type);
  localStorage.setItem("videoId", video);

  location.href = "result.html";
}

// ===== 食べ物画像 =====


if (document.getElementById("foodImage")) {
  const type = localStorage.getItem("selectedFood");
  document.getElementById("foodImage").src = foodImages[type];
}


// ===== 食べる =====
function feedCharacter() {
  if (hasFed) return;
  hasFed = true;

  const plate = document.getElementById("plate");
  if (plate) plate.style.pointerEvents = "none";

  let type = localStorage.getItem("selectedFood");
  let gauge = parseInt(localStorage.getItem("gauge"), 10);

if (isNaN(gauge)) {
  gauge = 0;
}
  let videoId = localStorage.getItem("videoId");

  let change = 0;
  let message = "";

  switch (type) {
    case "favorite":
      change = 3;
      message = "😍 大好物！";
      break;

    case "like":
      change = 2;
      message = "😊 好き！";
      break;

    case "normal":
      change = 1;
      message = "😐 普通";
      break;

    case "dislike":
      change = -2;
      message = "😫 苦手...";
      break;
  }

// ===== ゲージ計算 =====
gauge += change;

// 0～10の範囲に収める
gauge = Math.max(0, Math.min(10, gauge));

// 保存
localStorage.setItem("gauge", String(gauge));

console.log("現在のゲージ:", gauge);

  document.getElementById("result").textContent =
    message + "（ゲージ：" + gauge + "）";


  // ===== ゲージ更新 =====
  renderGauge();


  // ===== 動画 =====
  const video = document.getElementById("video");

  if (video && videoId) {
    video.innerHTML = `
      <img
        src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
        class="videoThumb"
      >
    `;

    openModal(videoId);
  }


  // ===== MAX =====
  if (gauge === 10) {
    localStorage.setItem("isComplete", "true");
  }
}

// ===== モーダル =====
function openModal(videoId) {
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");

  if (!modal || !modalVideo) return;

  modal.style.display = "block";

  modalVideo.innerHTML = `

    <iframe
      class="shortVideo"
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0"
      allow="autoplay"
      allowfullscreen>
    </iframe>
  `;
}

function closeModal() {
  document.getElementById("videoModal").style.display = "none";
  document.getElementById("modalVideo").innerHTML = "";
}

// ===== 戻る =====
function goBack() {
  location.href = "index.html";
}

// ===== リセット =====
function resetGame() {
  localStorage.setItem("gauge", 0);
  localStorage.removeItem("isComplete");
  location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", function () {
  const splideElement = document.getElementById("foodSplide");
  if (!splideElement) return;

  const splide = new Splide("#foodSplide", {
    type: "loop",
    perPage: 1,
    focus: "center",
    gap: "15px",
    padding: "5%",
    arrows: false,
    pagination: false,
  });

  // ===== スライド開始 =====
  splide.on("move", function (newIndex) {
    const slide = splide.Components.Slides.getAt(newIndex);
    if (!slide) return;

    const el = slide.slide;

    el.classList.remove("tilt", "settle");
    el.classList.add("tilt"); // 常に左回転
  });

  // ===== スライド終了 =====
  splide.on("moved", function (newIndex) {
    const slide = splide.Components.Slides.getAt(newIndex);
    if (!slide) return;

    const el = slide.slide;

    el.classList.remove("tilt");

    // アニメ再発火
    void el.offsetWidth;

    el.classList.add("settle");
  });

  splide.mount();
});