import { SongController } from "./classes/songController.class.js";

document.addEventListener("DOMContentLoaded", () => {
  initApp();

  function toggle() {
    SongController.toggle();
  }
});

const initApp = () => {
  console.log("App initialized");
  const app = document.getElementById("app");
  const audioPlayer = document.createElement("audio");
  app.appendChild(audioPlayer);
  SongController.initController(audioPlayer);

  //   Add song button logic

  const addSongBtn = document.getElementById("addSongBtn");
  addSongBtn.addEventListener("click", SongController.addSongToPlaylist);
};

globalThis.toggle = function () {
  SongController.toggle();
};

globalThis.playNextSong = function () {
  SongController.playNextSong();
};
