import { MusicController, LoopType } from "./MusicController.js";

let songList = [];
let controller = {};
window.onload = () => {
  fetch("./js/music_list.json")
    .then((res) => res.text())
    .then((data) => {
      songList = JSON.parse(data);
      controller = new MusicController(songList);
      controller.loadTrack(0);
      setInterval(() => {
        updateProgress();
      }, 500);
    })
    .catch((e) => console.error(e));
};

const playBtn = document.querySelector(".play-pause");
const nextBtn = document.querySelector(".fa-forward-step");
const prevBtn = document.querySelector(".fa-backward-step");
const repeatBtn = document.querySelector(".repeat-mode");
const shuffleBtn = document.querySelector(".shuffle-mode");

/**
 * Play or pause
 */
playBtn.addEventListener("click", () => {
  if (controller.getPlayStatus()) {
    controller.pauseTrack();
    playBtn.classList.add("fa-play");
    playBtn.classList.remove("fa-pause");
  } else {
    controller.playTrack();
    playBtn.classList.add("fa-pause");
    playBtn.classList.remove("fa-play");
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code == "Space") {
    if (controller.getPlayStatus()) {
      controller.pauseTrack();
      playBtn.classList.add("fa-play");
      playBtn.classList.remove("fa-pause");
    } else {
      controller.playTrack();
      playBtn.classList.add("fa-pause");
      playBtn.classList.remove("fa-play");
    }
  }
});

/**
 * Next track, auto play
 */
nextBtn.addEventListener("click", () => {
  controller.nextTrack();
  playBtn.classList.add("fa-pause");
  playBtn.classList.remove("fa-play");
});

/**
 * Previous track, auto play
 */
prevBtn.addEventListener("click", () => {
  controller.prevTrack();
  playBtn.classList.add("fa-pause");
  playBtn.classList.remove("fa-play");
});

/**
 * Set Loop type
 */
repeatBtn.addEventListener("click", () => {
  switch (controller.getLoopType()) {
    case LoopType.None:
      controller.setLoopType(LoopType.LoopAll);
      repeatBtn.textContent = "repeat_on";
      break;

    case LoopType.LoopAll:
      controller.setLoopType(LoopType.LoopOne);
      repeatBtn.textContent = "repeat_one_on";
      break;

    case LoopType.LoopOne:
      controller.setLoopType(LoopType.None);
      repeatBtn.textContent = "repeat";
      break;

    default:
      throw new Error("Do not regconize the loop type");
  }
});

/**
 * Shuffle mode
 */
shuffleBtn.addEventListener("click", () => {
  if (controller.getShuffle()) {
    controller.unsetShuffle();
    shuffleBtn.textContent = "shuffle";
  } else {
    controller.setShuffle();
    shuffleBtn.textContent = "shuffle_on";
  }
});

function updateProgress() {
  if (!isNaN(controller.getTrackDuration())) {
    const progress =
      (controller.getCurrentTime() / controller.getTrackDuration()) * 100;
    document.querySelector("#trackProgressId").value = progress;
  }
}
