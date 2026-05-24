import { defaultSongImageUrl } from "../constants.js";
import SongItem from "./songItem.class.js";
const container = document.getElementById("songContainer");
const controller = document.getElementById("controller");

export class SongController {
  static lastSong;
  static currentSong;
  static firstSong;
  /**
   * @param {HTMLAudioElement} audio - The audio element to control
   */
  static initController(audio) {
    SongController.audio = audio;
    SongController.#listenForEnd();
    SongController.updateUI();
  }

  /**
   * @param {SongItem} songItem - The song item to select and play
   */
  static selectSong(songItem) {
    if (!songItem || !songItem.audioURL) return;
    SongController.currentSong = songItem;
    SongController.audio.src = songItem.audioURL;
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
        const songItem = new SongItem(file);
        SongController.updateUI();
        if (!SongController.firstSong) SongController.firstSong = songItem;
        if (SongController.lastSong)
          SongController.lastSong.nextSong = songItem;
        else {
          SongController.currentSong = songItem;
          SongController.lastSong = songItem;
        }
        SongController.lastSong = songItem;
        if (SongController.audio.currentSrc === "") {
          SongController.audio.src = SongController.currentSong.audioURL;
          // SongController.audio.play();
        }
        SongController.updateUI();
      }
      fileInput.remove();
    });

    // delete the created input element after use
    fileInput.remove();
  }

  static removeSong(songItemToRemove) {
    if (!songItemToRemove || !SongController.firstSong) return;

    // Removing the head node
    if (SongController.firstSong === songItemToRemove) {
      SongController.firstSong = songItemToRemove.nextSong;

      if (SongController.currentSong === songItemToRemove) {
        SongController.currentSong = SongController.firstSong;
        SongController.audio.src = SongController.currentSong
          ? SongController.currentSong.audioURL
          : "";
      }

      if (SongController.lastSong === songItemToRemove) {
        SongController.lastSong = SongController.firstSong;
      }

      songItemToRemove.nextSong = null;
      URL.revokeObjectURL(songItemToRemove.audioURL);
      SongController.updateUI();
      return;
    }

    // Removing any non-head node
    let previousSong = SongController.firstSong;

    while (
      previousSong.nextSong &&
      previousSong.nextSong !== songItemToRemove
    ) {
      previousSong = previousSong.nextSong;
    }

    // Song was not found in the list
    if (!previousSong.nextSong) return;

    previousSong.nextSong = songItemToRemove.nextSong;

    if (SongController.lastSong === songItemToRemove) {
      SongController.lastSong = previousSong;
    }

    if (SongController.currentSong === songItemToRemove) {
      SongController.currentSong =
        songItemToRemove.nextSong || SongController.firstSong;
      SongController.audio.src = SongController.currentSong
        ? SongController.currentSong.audioURL
        : "";
    }

    songItemToRemove.nextSong = null;
    URL.revokeObjectURL(songItemToRemove.audioURL);
    SongController.updateUI();
  }

  static updateUI() {
    container.innerHTML = "";
    let currSong = SongController.firstSong;
    while (currSong) {
      const songDiv = SongController.#createSongDiv(currSong);
      container.appendChild(songDiv);
      if (currSong.nextSong !== null) {
        let bridge = document.createElement("p");
        bridge.classList.add(
          "text-amber-300",
          "text-7xl",
          "flex",
          "justify-center",
          "items-center",
        );
        bridge.innerHTML = ` &darr;
            <span class="text-base font-mono text-amber-300/40">
              (next node)
            </span>`;
        container.appendChild(bridge);
      }
      currSong = currSong.nextSong;
    }
    SongController.#updateControllerUI();
    lucide.createIcons();
  }

  static #createSongDiv(songItem) {
    const songDiv = document.createElement("div");
    songDiv.classList.add(
      "flex",
      "items-center",
      "gap-4",
      "rounded-md",
      "bg-black/80",
      "p-3",
      "shadow-lg",
      "w-full",
    );

    // Create and append image
    const songImage = document.createElement("img");
    songImage.classList.add("h-16", "w-16", "rounded-md", "object-cover");
    songImage.setAttribute("alt", songItem.title);
    songImage.setAttribute("src", songItem.coverImage);
    songDiv.appendChild(songImage);

    // Create and append song name and title div
    const songNameDiv = document.createElement("div");
    songNameDiv.classList.add("min-w-0", "flex-1");
    const songName = document.createElement("h3");
    songName.textContent = songItem.title;
    const songArtist = document.createElement("p");
    songArtist.textContent = `${songItem.album} • ${songItem.artist}`;
    songNameDiv.appendChild(songName);
    songNameDiv.appendChild(songArtist);
    songDiv.appendChild(songNameDiv);

    // Create and append remove button
    const removeButton = document.createElement("button");
    removeButton.classList.add(
      "bg-red-500",
      "text-white",
      "font-bold",
      "py-1",
      "px-3",
      "rounded-md",
      "hover:bg-red-600",
      "uppercase",
    );
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      SongController.removeSong(songItem);
    });
    songDiv.appendChild(removeButton);

    return songDiv;
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
    SongController.updateUI();
  }

  static #updateControllerUI() {
    controller.innerHTML = `<section
          class="w-full max-w-3xl rounded-lg bg-black/80 p-4 text-white shadow-xl"
          aria-label="Current music player"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src="${SongController.currentSong ? SongController.currentSong.coverImage : defaultSongImageUrl}"
              alt="Album cover for Midnight Drive"
              class="h-28 w-full rounded-md object-cover sm:w-28"
            />
            <div class="min-w-0 flex-1">
             ${SongController.currentSong ? '<p class="text-xs font-bold uppercase tracking-widest text-amber-300">Now playing</p>' : ""}
              <h2 class="truncate text-2xl font-extrabold">${SongController.currentSong ? SongController.currentSong.title : "No song selected"}</h2>
              <p class="text-sm text-white/70">${SongController.currentSong ? SongController.currentSong.artist : "Unknown Artist"} • ${SongController.currentSong ? SongController.currentSong.album : "Unknown Album"}</p>
            </div>

            <div
              class="flex items-center justify-center gap-3 sm:flex-col sm:gap-2 "
              aria-label="Player controls"
            >
      
              <button
                class="grid h-12 w-12 place-items-center rounded-full bg-amber-300 text-xl font-extrabold text-black transition hover:bg-amber-200"
                aria-label="Pause song"
                onclick="(function (){globalThis.toggle()})()"
              >
                ${SongController.audio.paused || SongController.audio.readyState < 4 ? '<i data-lucide="play" ></i>' : '<i data-lucide="pause" ></i>'}
              </button>
              <button
                class="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 font-bold transition hover:bg-white/20 text-white"
                aria-label="Next song"
                onclick="(function (){globalThis.playNextSong()})()"
              >
                <i data-lucide="skip-forward" ></i>
              </button>
            </div>
          </div>
        </section>`;
  }

  static play() {
    if (SongController.audio.currentSrc) SongController.audio.play();
  }
  static pause() {
    if (SongController.audio.currentSrc) SongController.audio.pause();
  }

  static toggle() {
    if (!SongController.currentSong) {
      SongController.addSongToPlaylist();
    }
    if (SongController.audio.currentSrc) {
      SongController.audio.paused
        ? SongController.audio.play()
        : SongController.audio.pause();
    }
    SongController.updateUI();
  }

  /**
   * @param {SongItem} nextSong - The next song to play
   */
  static next() {
    if (SongController.currentSong.nextSong) {
      SongController.selectSong(SongController.currentSong.nextSong);
    } else {
      SongController.addSongToPlaylist();
    }
    SongController.updateUI();
  }
}
