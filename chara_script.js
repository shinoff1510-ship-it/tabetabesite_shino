const character = document.querySelector("#character");
const balloon = document.querySelector("#balloon");
const balloonText = document.querySelector("#balloonText");

const talkElements = document.querySelectorAll(".talk-data");

let lastIndex = -1;

character.addEventListener("click", () => {
  let index;

  /*
  同じセリフ連続防止
  */
  do {
    index = Math.floor(Math.random() * talkElements.length);
  } while (index === lastIndex);

  lastIndex = index;

const selected = talkElements[index];
const message = selected.innerHTML.trim();
const emotion = selected.dataset.emotion;

/*
セリフ変更
*/
balloonText.innerHTML = message;

  /*
  テキストアニメ
  */
  balloonText.classList.remove("show");
  void balloonText.offsetWidth;
  balloonText.classList.add("show");

  /*
  吹き出しアニメ
  */
  balloon.classList.remove("show");
  void balloon.offsetWidth;
  balloon.classList.add("show");

  /*
  表情切り替え
  */
  character.classList.remove(
    "is-chara_01",
    "is-chara_02",
    "is-chara_03",
    "is-chara_04",
    "is-chara_05",
    "is-chara_06"
  );

  character.classList.add(`is-${emotion}`);

  /*
  キャラぴょん
  */
  character.classList.remove("jump");
  void character.offsetWidth;
  character.classList.add("jump");
});