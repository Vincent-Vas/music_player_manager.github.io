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
  }
  removeFile() {
    URL.revokeObjectURL(this.audioURL);
  }
}
