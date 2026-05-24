import { songThumbnail } from "../constants.js";
import { SongController } from "./songController.class.js";

export default class SongItem {
  /**
   * @param {File} songFile - The audio file representing the song
   */

  constructor(songFile) {
    if (songFile.type.split("/")[0] !== "audio") {
      throw new Error("Provided file is not an audio file");
    }

    this.songFile = songFile;
    this.nextSong = null;
    this.audioURL = URL.createObjectURL(songFile);
    this.div = document.createElement("div");
    this.title = "Loading...";
    this.artist = "Unknown Artist";
    this.album = "Unknown Album";
    this.coverImage = songThumbnail;

    jsmediatags.read(songFile, {
      onSuccess: (tag) => {
        const tags = tag.tags;
        // Handle title
        this.title = tags.title || songFile.name.split(".")[0];
        this.artist = tags.artist || "Unknown Artist";
        this.album = tags.album || "Unknown Album";

        // Handle image
        const picture = tag.tags.picture;
        // check if image exists
        if (picture) {
          const { data, format } = picture;

          // convert byte array to base64
          let base64String = "";

          for (let i = 0; i < data.length; i++) {
            base64String += String.fromCharCode(data[i]);
          }

          // final image url
          const imageUrl = `data:image/jpeg;base64,${window.btoa(base64String)}`;

          this.coverImage = imageUrl;
        } else {
          this.coverImage = songThumbnail;
        }
        SongController.updateUI();
      },
    });
  }
}
