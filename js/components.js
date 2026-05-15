import { defaultSongImageUrl } from "./constants";

export const songItem = (songName, artistName, albumName, songData) => {
  const songItem = document.createElement("div");
  songItem.classList.add(
    "flex",
    "items-center",
    "gap-4",
    "rounded-md",
    "bg-black/80",
    "p-3",
    "shadow-lg",
    "w-full",
  );

  //   Song image creation
  const songImage = document.createElement("img");
  songImage.src = songData?.albumCoverUrl || defaultSongImageUrl;
  songImage.alt = `Album cover for ${songName}`;
  songImage.classList.add("h-16", "w-16", "rounded-md", "object-cover");
  //   add created song image to song item (div)
  songItem.appendChild(songImage);

  //   Song details creation
  const songDetails = document.createElement("div");
  songDetails.classList.add("min-w-0", "flex-1");

  const songTitle = document.createElement("h3");
  songTitle.textContent = songName;
  songTitle.classList.add("truncate", "text-lg", "font-bold");
  songDetails.appendChild(songTitle);

  const songArtistAlbum = document.createElement("p");
  songArtistAlbum.textContent = `${artistName} • ${albumName}`;
  songArtistAlbum.classList.add("text-sm", "text-white/70");
  songDetails.appendChild(songArtistAlbum);

  //   add created song details to song item (div)
  songItem.appendChild(songDetails);

  //   Remove button creation
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add(
    "bg-red-500",
    "text-white",
    "font-bold",
    "py-1",
    "px-3",
    "rounded-md",
    "hover:bg-red-400",
    "uppercase",
  );
  /**
   * TODO: Implement the remove functionality for the button
   *
   *
   *
   */
  //   add created remove button to song item (div)
  songItem.appendChild(removeButton);

  return songItem;
};

/*
 <div
            class="flex items-center gap-4 rounded-md bg-black/80 p-3 shadow-lg w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=320&q=80"
              alt="Album cover for Midnight Drive"
              class="h-16 w-16 rounded-md object-cover"
            />
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-lg font-bold">Midnight Drive</h3>
              <p class="text-sm text-white/70">Nova Ray • Electric Skies</p>
            </div>
            <button
              class="bg-red-500 text-white font-bold py-1 px-3 rounded-md hover:bg-red-400 uppercase"
            >
              Remove
            </button>
          </div>
*/
