
/* =================================
   初期化
================================= */

if (localStorage.getItem("gauge") === null) {
  localStorage.setItem("gauge", "0");
}

let hasFed = false;


/* =================================
   ゲージ描画
================================= */

function renderGauge() {

  const container = document.getElementById("gaugeContainer");
  if (!container) return;

  container.innerHTML = "";

  let gauge = parseInt(localStorage.getItem("gauge"), 10);

  if (isNaN(gauge)) gauge = 0;

  gauge = Math.max(0, Math.min(10, gauge));

  // ゲージ生成
  for (let i = 0; i < 10; i++) {

    const box = document.createElement("div");
    box.classList.add("gaugeBox");

    if (i < gauge) {

      box.classList.add("filled");

      if (i < 3) {
        box.classList.add("level3");
      } else if (i < 6) {
        box.classList.add("level6");
      } else if (i < 9) {
        box.classList.add("level9");
      } else {
        box.classList.add("level10");
      }

    }

    container.appendChild(box);
  }

  // キャラ画像切り替え
  const image = document.getElementById("gaugeImage");

  if (image) {

    if (gauge === 0) {
      image.src = "./images/gage_chara/gage_chara_00.png";

    } else if (gauge <= 3) {
      image.src = "./images/gage_chara/gage_chara_01.png";

    } else if (gauge <= 6) {
      image.src = "./images/gage_chara/gage_chara_02.png";

    } else if (gauge <= 9) {
      image.src = "./images/gage_chara/gage_chara_03.png";

    } else {
      image.src = "./images/gage_chara/gage_chara_04.png";
    }

  }

}


/* =================================
   COMPLETEボタン
================================= */

function showCompleteButton() {

  const btn = document.getElementById("completeButton");
  if (!btn) return;

  if (localStorage.getItem("isComplete") === "true") {
    btn.style.display = "block";
  }

}


/* =================================
   食べ物選択
================================= */

function selectFood(btn) {
  const type = btn.dataset.type;
  const video = btn.dataset.video;

  localStorage.setItem("selectedFood", type);
  localStorage.setItem("videoId", video);
  localStorage.setItem("resultProcessed", "false");

  location.href = "result.html";
}


/* =================================
   食べ物画像
================================= */

function renderFoodImage() {

  const image = document.getElementById("foodImage");
  if (!image) return;

  const type = localStorage.getItem("selectedFood");

  if (typeof foodImages !== "undefined" && foodImages[type]) {
    image.src = foodImages[type];
  }

}


/* =================================
   食べる
================================= */
function feedCharacter() {
  // すでに処理済みなら何もしない
  if (localStorage.getItem("resultProcessed") === "true") return;

  const type = localStorage.getItem("selectedFood");
  let gauge = parseInt(localStorage.getItem("gauge"), 10);

  if (isNaN(gauge)) gauge = 0;

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

  gauge = Math.max(0, Math.min(10, gauge + change));

  localStorage.setItem("gauge", String(gauge));
  localStorage.setItem("resultProcessed", "true");

  if (gauge === 10) {
    localStorage.setItem("isComplete", "true");
  }

  const result = document.getElementById("result");

  if (result) {
    result.textContent = message + "（ゲージ：" + gauge + "）";
  }

  // ゲージ更新
  renderGauge();

  // MAX判定
  if (gauge === 10) {
    localStorage.setItem("isComplete", "true");
  }

}


/* =================================
   モーダルを開く
================================= */
function openModal(videoId) {
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");

  if (!modal || !modalVideo || !videoId) return;

  modalVideo.innerHTML = `
    <iframe class="shortVideo"
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0"
      allow="autoplay" allowfullscreen>
    </iframe>`;

  modal.style.display = "block";

  requestAnimationFrame(() => {
    modal.classList.add("is-open");
  });
}



/* =================================
   モーダルを閉じる
================================= */
function closeModal() {
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");

  if (!modal || !modalVideo) return;

  // すでに閉じている場合は何もしない
  if (!modal.classList.contains("is-open")) return;

  // ふわっと消す
  modal.classList.remove("is-open");

  // ゲージとメッセージを更新
  feedCharacter();

  // アニメーションが終わってから動画を停止
  setTimeout(() => {
    if (!modal.classList.contains("is-open")) {
      modal.style.display = "none";
      modalVideo.innerHTML = "";
    }
  }, 350);
}

/* =================================
   resultページ：動画自動表示
================================= */

function initResultVideo() {

  const video = document.getElementById("video");
  const modal = document.getElementById("videoModal");

  // resultページ以外では実行しない
  if (!video || !modal) return;

  // 保存された動画IDを取得
  const videoId = localStorage.getItem("videoId");

  if (!videoId || videoId === "null") {
    console.log("動画IDがありません");
    return;
  }

  // サムネイル表示
  video.innerHTML = `
    <img
      src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
      class="videoThumb"
      alt="動画サムネイル"
    >
  `;

  // サムネイルからも再生できるようにする
  video.querySelector(".videoThumb").addEventListener("click", function() {
    openModal(videoId);
  });

  // ページを開いたら自動再生
  openModal(videoId);

  console.log("動画ID:", videoId);

}


/* =================================
   戻る
================================= */

function goBack() {
  location.href = "index.html";
}


/* =================================
   リセット
================================= */

function resetGame() {
  // ゲージを初期値に戻す
  localStorage.setItem("gauge", "0");

  // 完了状態を解除
  localStorage.removeItem("isComplete");

  // 前回の選択情報をリセット
  localStorage.removeItem("selectedFood");
  localStorage.removeItem("videoId");
  localStorage.setItem("resultProcessed", "false");

  // index.htmlへ戻る
  location.href = "index.html";
}

/* =================================
   ページ読み込み時の初期処理
================================= */

function initPage() {

  renderGauge();

  showCompleteButton();

  renderFoodImage();

  initResultVideo();

}


/* =================================
   Splide
================================= */

function initSplide() {

  const splideElement = document.getElementById("foodSplide");

  if (!splideElement) return;

  if (typeof Splide === "undefined") return;

  const splide = new Splide("#foodSplide", {

    type: "loop",
    perPage: 1,
    focus: "center",
    gap: "15px",
    padding: "5%",
    arrows: false,
    pagination: false,

  });

  // スライド開始
  splide.on("move", function(newIndex) {

    const slide = splide.Components.Slides.getAt(newIndex);

    if (!slide) return;

    const el = slide.slide;

    el.classList.remove("tilt", "settle");
    el.classList.add("tilt");

  });

  // スライド終了
  splide.on("moved", function(newIndex) {

    const slide = splide.Components.Slides.getAt(newIndex);

    if (!slide) return;

    const el = slide.slide;

    el.classList.remove("tilt");

    void el.offsetWidth;

    el.classList.add("settle");

  });

  splide.mount();

}


/* =================================
   DOM読み込み完了
================================= */

if (document.readyState === "loading") {

  document.addEventListener("DOMContentLoaded", function() {

    initPage();
    initSplide();

  });

} else {

  initPage();
  initSplide();

}
