import { MusicController, LoopType } from "./MusicController.js";

let songList = [];
let controller = {};
window.onload = () => {
  document.querySelector(".loader").classList.add("d-none");
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

const progressBar = document.querySelector(".track-progress");

function updateProgress() {
  if (!isNaN(controller.getTrackDuration())) {
    const progress =
      (controller.getCurrentTime() / controller.getTrackDuration()) * 100;
    progressBar.value = progress;
  }
}

progressBar.addEventListener("change", () => {
  const time = (progressBar.value / 100) * controller.getTrackDuration();
  controller.setCurrentTime(time);
});
