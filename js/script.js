console.log("Welcome to SpotifyClone");

// finding HTML elements  starts ======================================
let body = document.querySelector("body");
let footer = document.querySelector("footer");

let main = document.querySelector("main");
let togle = document.querySelector(".togleItem");
let toglebar = document.querySelector("#togle");
let togleItems = document.querySelectorAll(".toggleItem");
// togle ends------------

let viewPort = document.querySelector("#viewport");

// togle manue ----------------
const quran = togle.querySelector("#quran");
const islamicSong = togle.querySelector("#islamicSong");
const music = togle.querySelector("#music");

// audio list starts here -------------------------------
let audioList = document.querySelector(".audioList");
// -------------------------------------------------------

// icons here-----------
let playIcon = `/img/icons/circle-play-regular.svg`;
let pauseIcon = `/img/icons/circle-pause-regular.svg`;
let quranTheme = `/img/quran.png`;
let islamicSongTheme = `/img/islamic.png`;
let musicTheme = `/img/music.jpg`;
// finding HTML elements ends =========================

// calling local api==================
let audioFiles;
const getAudio = async (url) => {
  return await axios
    .get(url)
    .then((res) => res.data.quran)
    .catch((err) => err.status);
};

const makeRequest = async (url, thems) => {
  let audioData = await getAudio(url);

  audioFiles = audioData;
  console.log(audioFiles);
  //   showing list of audio-----------------
  audioFiles.map((audio) => {
    let audioItem = document.createElement("div");
    audioItem.classList.add("audioItem");
    audioItem.innerHTML = `
        <span class="themeName" id="${audio.file}">
          <span class="audioTheme"
            ><img src="${thems}" alt="" />
          </span>
          <span class="audioName">${audio.title}</span>
        </span>
        <span class="durationPlaypause">
          <span class="duration"></span>
          <span class="playPause" id="${audio.id}">
            <img src="${playIcon}" alt="" />
          </span>
        </span>`;
    audioList.appendChild(audioItem);
  });
  // showing audio ends here ----------------------

  //audio controler  starts here ----------------------------
  let currentSongName = document.querySelector("#currentSongName");
  let progressbar = document.querySelector("#progressbar");
  let continueCheckBox = document.querySelector("#continue");
  let previus = document.querySelector("#backward");
  let mainPlayPause = document.querySelector("#mainPlayPause");
  let next = document.querySelector("#forward");
  let volume = document.querySelector("#volumeProgress");
  // audio controler ends here -----------------------------

  // ============ showing and hiding toggle ==============

  const hideToggel = () => {
    togleItems.forEach((item) => {
      item.style.transform = "scale(0)";
    });
  };
  const showToggle = () => {
    togleItems.forEach((item) => {
      if (screen.width >= 696) {
        item.style.transform = "translate(90px, 0)";
        item.addEventListener("mouseover", () => {
          item.style.transform = "scale(1.1)";
        });
        item.addEventListener("mouseout", () => {
          item.style.transform = "translate(90px, 0)";
        });
      } else {
        item.style.transform = "translate(0, 0)";
        item.addEventListener("mouseover", () => {
          item.style.transform = "scale(1.1)";
        });
        item.addEventListener("mouseout", () => {
          item.style.transform = "translate(0, 0)";
        });
      }
    });
  };

  // ======================================

  // === get audio from html ============

  const getFromHTML = () => {
    // ----- audio from list starts here -----

    const playFromList = (e) => {
      let selectedItem = e.target.parentElement;
      audioIndex = parseInt(selectedItem.id) - 1;
      playAudio();

      let selectList = audioList.querySelectorAll(".playPause");
      listIconHendler(selectList);
      selectedItem.innerHTML = `<img src="${pauseIcon}" alt="" />`;
    };
    // audio from list ends here ----------------

    //--- finding audio from html =======================================
    const audioElements = Array.from(
      document.getElementsByClassName("audioItem")
    );

    console.log(audioElements[0]);
    audioElements.forEach((element) => {
      let playBtn = element.querySelector(".playPause");
      playBtn.addEventListener("click", playFromList);
    });

    // ========================
    //   audio play pause control-------------

    let len = audioElements.length;
    let audioIndex = 0;
    let currentSong = audioElements[audioIndex].children[0].id;
    let audio = new Audio(currentSong);

    // function for playing audio
    const playAudio = () => {
      let playingSongName = audioElements[audioIndex].children[0].innerText;
      audio.src = `${audioElements[audioIndex].children[0].id}`;
      currentSongName.innerText = `${playingSongName}`;
      audio.play();
      mainPlayPause.innerHTML = `<img src="${pauseIcon}" alt="" />`;
      if (!audio.paused) {
        hideToggel();
        mainPlayPause.innerHTML = `<img src="${pauseIcon}" alt="" />`;
      }
    };

    const listIconHendler = (value) => {
      value.forEach((element) => {
        element.innerHTML = `<img src="${playIcon}" alt="" />`;
      });
    };
    // preveus play-----------------------------
    previus.addEventListener("click", () => {
      audioIndex--;
      if (audioIndex < 0) {
        audioIndex = len - 1;
      }
      playAudio();
      let selectList = audioList.querySelectorAll(".playPause");
      listIconHendler(selectList);
    });

    mainPlayPause.addEventListener("click", () => {
      let selectList = audioList.querySelectorAll(".playPause");
      if (audio.paused) {
        audio.play();
        // mainPlayPause.innerHTML = `<img src="${pauseIcon}" alt="" />`;
        let playingSongName = audioFiles[audioIndex].title;
        currentSongName.innerText = `${playingSongName}`;
      } else {
        audio.pause();
        // mainPlayPause.innerHTML = `<img src="${playIcon}" alt="Play" />`;
        listIconHendler(selectList);
      }

      if (!audio.paused) {
        mainPlayPause.innerHTML = `<img src="${pauseIcon}" alt="" />`;
        hideToggel();
      }
      if (audio.paused) {
        mainPlayPause.innerHTML = `<img src="${playIcon}" alt="" />`;
        showToggle();
      }
    });

    //   next audio play-----------------------------
    const nextPlay = () => {
      audioIndex++;
      if (audioIndex >= len) {
        audioIndex = 0;
      }
      playAudio();
      let selectList = audioList.querySelectorAll(".playPause");
      listIconHendler(selectList);
    };

    next.addEventListener("click", nextPlay);

    //   progress bar start here ----------------
    progressbar.value = 0;
    audio.addEventListener("timeupdate", () => {
      progressbar.value = (audio.currentTime / audio.duration) * 100;
      if (progressbar.value == 100) {
        if (continueCheckBox.checked) {
          mainPlayPause.innerHTML = `<img src="${pauseIcon}" alt="" />`;
          nextPlay();
        } else {
          mainPlayPause.innerHTML = `<img src="${playIcon}" alt="Play" />`;
        }
        progressbar.value = 0;
      }
    });

    progressbar.addEventListener("change", () => {
      let audioCT = (progressbar.value * audio.duration) / 100;
      audio.currentTime = audioCT;
      // console.log(audioCT);
    });
    // progress bar eds here -------------

    //volume change here -----------------

    volume.addEventListener("change", () => {
      audio.volume = volume.value / 100;
      console.log(audio.volume);
    });
    //   volume change end here -------
    console.log(audio.currentSrc);
  };

  // =================================
  getFromHTML();
};

// =========Create footer ========================

const createFooter = () => {
  footer.innerHTML = `
  <p id="currentSongName">--</p>
  <div id="progress">
    <input type="range" min="0" max="100" value="0" id="progressbar" />
  </div>
  <div class="container" id="footerContainer">
    <div>
      <input type="checkbox" name="continue" id="continue" />
      Continue
    </div>
    <div id="playerControl">
      <span id="backward">
        <img src="img/icons/backward-step-solid.svg" alt="" />
      </span>
      <span id="mainPlayPause"
        ><img src="img/icons/circle-play-regular.svg" alt=""
      /></span>
      <span id="forward">
        <img src="img/icons/forward-step-solid.svg" alt="" />
      </span>
    </div>
    <div id="volume">
      <input
        type="range"
        min="0"
        max="100"
        value="30"
        id="volumeProgress"
      />
    </div>
  </div>
`;
};
// =================================

const createNewFooter = () => {
  let footer = document.createElement("footer");
  footer.innerHTML = `
  <p id="currentSongName">--</p>
  <div id="progress">
    <input type="range" min="0" max="100" value="0" id="progressbar" />
  </div>
  <div class="container" id="footerContainer">
    <div>
      <input type="checkbox" name="continue" id="continue" />
      Continue
    </div>
    <div id="playerControl">
      <span id="backward">
        <img src="img/icons/backward-step-solid.svg" alt="" />
      </span>
      <span id="mainPlayPause"
        ><img src="img/icons/circle-play-regular.svg" alt=""
      /></span>
      <span id="forward">
        <img src="img/icons/forward-step-solid.svg" alt="" />
      </span>
    </div>
    <div id="volume">
      <input
        type="range"
        min="0"
        max="100"
        value="30"
        id="volumeProgress"
      />
    </div>
  </div>
`;

  body.appendChild(footer);
};

// ===============================================

  // code for togle starts here =====================================

setTimeout(() => {
  let count = 0;
  const togleHide = () => {
    count = 0;
    togle.classList.add("togleHide");
    togle.classList.remove("togleShow");
  };
  toglebar.addEventListener("click", () => {
    togle.classList.remove("togleHide");
    togle.classList.add("togleShow");
    count++;
    console.log(togle);
    if (count > 1 || count == 0) {
      togleHide();
    }
  });
  main.addEventListener("click", () => {
    togleHide();
  });
  document.querySelector("footer").addEventListener("click", () => {
    togleHide();
  });
}, 3000);
  // togle ends here ===============================
// =========================================================

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    createFooter();
    makeRequest("/api/quran.txt", quranTheme);
    viewPort.classList.remove("mainDefault");
    viewPort.classList.add("mainForQuran");
  }, 3000);
});

quran.addEventListener("click", () => {
  // window.location.reload("/api/quran.txt", quranTheme);
  let footer = document.querySelector("footer");
  footer.remove();
  createNewFooter();
  audioList.replaceChildren(makeRequest("/api/quran.txt", quranTheme));
  viewPort.classList.remove("mainForMusic");
  viewPort.classList.remove("mainDefault");
  viewPort.classList.remove("mainForIslamicSong");
  viewPort.classList.add("mainForQuran");
});

islamicSong.addEventListener("click", () => {
  let footer = document.querySelector("footer");
  footer.remove();
  createNewFooter();
  audioList.replaceChildren(
    makeRequest("/api/islamicSong.txt", islamicSongTheme)
  );
  viewPort.classList.remove("mainForQuran");
  viewPort.classList.remove("mainForMusic");
  viewPort.classList.add("mainForIslamicSong");
});
music.addEventListener("click", () => {
  let footer = document.querySelector("footer");
  footer.remove();
  createNewFooter();
  audioList.replaceChildren(makeRequest("/api/music.txt", musicTheme));
  viewPort.classList.remove("mainForQuran");
  viewPort.classList.remove("mainForIslamicSong");
  viewPort.classList.add("mainForMusic");
});
