
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
   MAX時の表示切り替え
================================= */

function showCompleteButton() {

  const foodArea = document.getElementById("foodSlideArea");
  const btn = document.getElementById("completeButton");

  if (!foodArea || !btn) return;

  const gauge = parseInt(localStorage.getItem("gauge"), 10) || 0;

  if (gauge >= 10) {

    // 食べ物スライドを非表示
    foodArea.style.display = "none";

    // 完了ボタンを表示
    btn.style.display = "block";

  } else {

    // 食べ物スライドを表示
    foodArea.style.display = "";

    // 完了ボタンを非表示
    btn.style.display = "none";

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
  let resultImage = "";
  let message = "";

  switch (type) {
    case "favorite":
      change = 3;
      resultImage = "./images/01.png";
      message = "卵いっぱい使って作るの大好き！";
      break;

    case "like":
      change = 2;
      resultImage = "./images/02.png";
      message = "お寿司はネギトロばかり頼んじゃう！";
      break;

    case "normal":
      change = 1;
      resultImage = "./images/03.png";
      message = "ジュワ～ってして美味しいよね！";
      break;

    case "dislike":
      change = -2;
      resultImage = "./images/04.png";
      message = "パスタとかうどんとかも苦手...";
      break;
  }

  gauge = Math.max(0, Math.min(10, gauge + change));

  localStorage.setItem("gauge", String(gauge));
  localStorage.setItem("resultProcessed", "true");

  if (gauge === 10) {
    localStorage.setItem("isComplete", "true");
  }

// 結果表示
const result = document.getElementById("result");

if (result && resultImage) {
  result.innerHTML = `
    <div class="result_img">
      <img src="${resultImage}" alt="result">
    </div>
    <p>${message}</p>
  `;
}

  // ゲージ更新
  renderGauge();

  // MAX判定
  if (gauge === 10) {
    localStorage.setItem("isComplete", "true");
  }

}



/* =================================
   YouTube API 読み込み
================================= */

if (!document.getElementById("youtube-api")) {
  const tag = document.createElement("script");
  tag.id = "youtube-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}


/* =================================
   プレイヤー管理
================================= */

let modalPlayer = null;
let pendingVideoId = null;


/* =================================
   YouTube API 準備完了
================================= */

function onYouTubeIframeAPIReady() {

  // API読み込み前に動画を開こうとした場合
  if (pendingVideoId) {
    const videoId = pendingVideoId;
    pendingVideoId = null;
    createModalPlayer(videoId);
  }

}


/* =================================
   モーダルを開く
================================= */

function openModal(videoId) {

  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");

  if (!modal || !modalVideo || !videoId) return;

  // 古いプレイヤーを削除
  if (modalPlayer) {
    modalPlayer.destroy();
    modalPlayer = null;
  }

  modalVideo.innerHTML = '<div id="youtubePlayer"></div>';

  modal.style.display = "block";

  requestAnimationFrame(() => {
    modal.classList.add("is-open");
  });

  // APIの準備ができているか確認
  if (window.YT && YT.Player) {
    createModalPlayer(videoId);
  } else {
    pendingVideoId = videoId;
  }

}


/* =================================
   YouTubeプレイヤー作成
================================= */

function createModalPlayer(videoId) {

  const playerElement = document.getElementById("youtubePlayer");

  if (!playerElement) return;

  modalPlayer = new YT.Player("youtubePlayer", {

  videoId: videoId,

  playerVars: {
    autoplay: 1,
    controls: 0,
    loop: 0,
    rel: 0,
    disablekb: 1,
    fs: 0,
    playsinline: 1
  },

  events: {
    onReady: function(event) {
      event.target.getIframe().classList.add("shortVideo");
    },

    onStateChange: function(event) {
      if (event.data === YT.PlayerState.ENDED) {
        closeModal();
      }
    }
  }

});

}


/* =================================
   モーダルを閉じる
================================= */
function closeModal() {

  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");

  if (!modal || !modalVideo) return;

  if (!modal.classList.contains("is-open")) return;

// フェードアウト開始
modal.classList.remove("is-open");

// ゲージとメッセージを更新
feedCharacter();

pendingVideoId = null;

// アニメーション終了後に削除
setTimeout(() => {

  if (!modal.classList.contains("is-open")) {

    if (modalPlayer) {
      modalPlayer.destroy();
      modalPlayer = null;
    }

    modal.style.display = "none";
    modalVideo.innerHTML = "";

  }

}, 500);

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
    <div class="videoThumb">もう一度見る</div>
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
