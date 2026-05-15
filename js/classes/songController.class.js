import SongItem from "./songItem.class.js";

export class SongController {
  static lastSong;
  static currentSong;
  /**
   * @param {HTMLAudioElement} audio - The audio element to control
   */
  static initController(audio) {
    SongController.audio = audio;
    SongController.#listenForEnd();
  }

  /**
   * @param {SongItem} songItem - The song item to select and play
   */
  static selectSong(songItem) {
    if (!songItem || !songItem.audio) return;
    SongController.currentSong = songItem;
    SongController.audio.src = songItem.audio.src;
    SongController.audio.play();
  }

  static addSongToPlaylist() {
    // Create an HTML input element and launch an audio selection only dialog

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "audio/*";
    fileInput.click();

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log("Selected file: \n", file);
        const songItem = new SongItem(file);
        if (SongController.lastSong)
          SongController.lastSong.nextSong = songItem;
        else {
          SongController.currentSong = songItem;
          SongController.lastSong = songItem;
        }
        SongController.lastSong = songItem;
        if (SongController.audio.currentSrc === "") {
          SongController.audio.src = SongController.currentSong.audioURL;
          SongController.audio.play();
        }
      }
    });

    // delete the created input element after use
    fileInput.remove();
  }

  static #listenForEnd() {
    if (SongController.audio.currentSrc) {
      SongController.audio.addEventListener("ended", (e) => {
        SongController.playNextSong();
      });
    }
  }

  static playNextSong() {
    if (SongController.currentSong && SongController.currentSong.nextSong) {
      SongController.selectSong(SongController.currentSong.nextSong);
    }
  }

  static play() {
    if (SongController.audio.currentSrc) SongController.audio.play();
  }
  static pause() {
    if (SongController.audio.currentSrc) SongController.audio.pause();
  }
  static stop() {
    if (SongController.audio.currentSrc) {
      SongController.audio.currentTime = 0;
      SongController.audio.pause();
    }
  }
  /**
   * @param {SongItem} nextSong - The next song to play
   */
  static next(nextSong) {}
}
