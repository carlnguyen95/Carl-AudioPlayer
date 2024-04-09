export const LoopType = {
  None: 0,
  LoopAll: 1,
  LoopOne: 2,
};

export class MusicController {
  // Private Fields
  #trackList = [];
  #shuffleList = [];
  #trackIndex = 0;
  #audioElement = document.createElement("audio");
  #isShuffle = false;
  #isPlaying = false;
  #loopType = LoopType.None;
  #updateTimer;

  #progressElement = document.querySelector(".track-progress");

  constructor(list, startIndex = 0) {
    this.#trackList = list;
    this.#trackIndex = startIndex;
    this.#loopType = LoopType.None;
    this.shuffle();
    this.autoPlay();
  }

  /*** Play/Pause methods ***/
  getPlayStatus = () => {
    return this.#isPlaying;
  };

  playTrack = () => {
    this.#isPlaying = true;
    this.#audioElement.play();
  };

  pauseTrack = () => {
    this.#isPlaying = false;
    this.#audioElement.pause();
  };
  /*** End Play/Pause methods ***/

  /***Index methods ***/
  isIndexValid = (index) => {
    return index >= 0 && index < this.#trackList.length;
  };

  getTrackIndex = () => {
    return this.#trackIndex;
  };

  setTrackIndex = (index) => {
    if (!this.isIndexValid(index)) throw new Error("Invalid track Index");
    this.#trackIndex = index;
  };
  /*** End Index methods ***/

  /*** Shuffle mode methods ***/
  getShuffle = () => {
    return this.#isShuffle;
  };

  setShuffle = () => {
    this.#isShuffle = true;
    this.shuffle();
    this.setTrackIndex(0);
  };

  unsetShuffle = () => {
    this.#isShuffle = false;
    for (let i = 0; i < this.#trackList.length; i++) {
      if (this.#trackList[i].name == this.#shuffleList[this.#trackIndex].name) {
        this.setTrackIndex(i);
        return;
      }
    }
    throw new Error(
      `Can't find ${this.#shuffleList[this.#trackIndex].name} in trackList!!!`
    );
  };

  /**
   * Create shuffle list for shuffle mode
   */
  shuffle = () => {
    this.#shuffleList = [...this.#trackList];
    /**
     * First swap the current track with the track on top of the list
     * Random swap ramaining elements
     */
    this.swap(this.#shuffleList, 0, this.#trackIndex);
    for (let i = 1; i < this.#shuffleList.length - 1; i++) {
      const swapIndex = this.getRandomRange(i, this.#shuffleList.length - 1);
      this.swap(this.#shuffleList, i, swapIndex);
    }
  };

  swap = (list, index1, index2, valid) => {
    if (!this.isIndexValid(index1))
      throw new Error("Can't swap because of Invalid track Index");
    if (!this.isIndexValid(index2))
      throw new Error("Can't swap because of Invalid track Index");
    const tmp = list[index1];
    list[index1] = list[index2];
    list[index2] = tmp;
  };

  getRandomRange = (fromIndex, toIndex) => {
    const randomStep = Math.round(Math.random() * (toIndex - fromIndex));
    return fromIndex + randomStep;
  };
  /*** End Shuffle mode methods ***/

  /*** Loop Mode Methods ***/
  getLoopType = () => {
    return this.#loopType;
  };

  setLoopType = (val) => {
    for (let key in LoopType) {
      if (val == LoopType[key]) {
        this.#loopType = LoopType[key];
        return;
      }
    }
    throw new Error(`${val} is not a valid loop type`);
  };
  /*** End Loop Mode Methods ***/

  /*** Ready state Methods ***/
  isTrackReady = () => {
    return this.#audioElement.readyState === 4;
  };
  /*** End Ready state Methods ***/

  /*** For Display Methods ***/
  getCurrentTime = () => {
    return this.#audioElement.currentTime;
  };

  getTrackDuration = () => {
    return this.#audioElement.duration;
  };

  setCurrenTime = (time) => {
    if (time > this.#audioElement.duration) throw new Error("Set invalid time");
    this.#audioElement.currentTime = time;
  };
  /*** End For Display Methods ***/

  /*** Handle Track methods ***/
  /**
   * Load the track with index to the audio
   * @param {*} index must be between 0 and (trackList.length - 1)
   */
  loadTrack = (index) => {
    clearInterval(this.#updateTimer);
    if (!this.#isShuffle) {
      this.#audioElement.src = this.#trackList[index].link;
    } else {
      this.#audioElement.src = this.#shuffleList[index].link;
    }
    this.#audioElement.load();
    this.#isPlaying = !this.#audioElement.paused;
    console.log(`Playing ${this.#audioElement.src}`);
  };

  nextTrack = () => {
    if (this.#trackIndex < this.#trackList.length - 1)
      this.setTrackIndex(this.#trackIndex + 1);
    else this.setTrackIndex(0);
    this.loadTrack(this.#trackIndex);
    this.playTrack();
  };

  prevTrack = () => {
    if (this.#trackIndex > 0) this.setTrackIndex(this.#trackIndex - 1);
    else this.setTrackIndex(this.#trackList.length - 1);
    this.loadTrack(this.#trackIndex);
    this.playTrack();
  };

  /**
   * Logic to handle tracks when the track ends
   */
  autoPlay = () => {
    this.#audioElement.addEventListener("ended", () => {
      switch (this.#loopType) {
        case LoopType.LoopOne:
          this.loadTrack(this.#trackIndex);
          this.playTrack();
          break;

        case LoopType.None:
          if (this.#trackIndex === this.#trackList.length - 1) {
            this.setTrackIndex(0);
            this.loadTrack(this.#trackIndex);
          } else {
            this.nextTrack();
          }
          break;

        case LoopType.LoopAll:
          this.nextTrack();
          break;

        default:
          throw new Error(`${this.#loopType} is not a valid type of loop`);
      }
    });
  };
}
