let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder = folder;

    let res = await fetch(`/${folder}/songs.json`);
    let data = await res.json();

    songs = data.songs;

    let songsUL = document.querySelector(".songlist ul");
    songsUL.innerHTML = "";

    for (const song of songs) {
        songsUL.innerHTML += `
        <li>
          <div class="msvg">
            <img src="/svg/music.svg">
          </div>
          <div class="sname">
            <div>${song}</div>
            <div>artist</div>
          </div>
          <div>
            <img src="/svg/playbtn.svg">
          </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(".songlist li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".sname div").innerText);
        });
    });
}


//playmusic

const playMusic = (music, pause = false) => {
    // let audio= new Audio("/songs/"+music)
    currentSong.src = `/${currFolder}/` + music;
    if (!pause) {
        currentSong.play()
        play.src = "svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(music).split(".mp3")[0]
    document.querySelector(".songTime").innerHTML = "00:00"


}

//display album
const albums = [
  "arijit",
  "ar_rahman",
  "atif_aslam",
  "jubin_nautiyal",
  "pritam",
  "sachin-jigar"
];

async function displayalbums() {
    let cardcontainer = document.querySelector(".card");
    cardcontainer.innerHTML = "";

    for (const folder of albums) {
        let res = await fetch(`/songs/${folder}/info.json`);
        let data = await res.json();

        cardcontainer.innerHTML += `
        <div data-folder="${folder}" class="card1 cardc">
          <div class="play">▶</div>
          <div class="card_img">
            <img src="songs/${folder}/cover.jpeg">
          </div>
          <div class="pritam">${data.title}</div>
          <div class="pritam-des">${data.description}</div>
        </div>`;
    }

    Array.from(document.getElementsByClassName("cardc")).forEach(e => {
        e.addEventListener("click", async item => {
            await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

function getCurrentSongName() {
    return decodeURIComponent(currentSong.src.split("/").pop());
}


//MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN

async function main() {
    await getsongs("songs/pritam")
    playMusic(songs[0], true)
    displayalbums()


    //attach an eventlistener to play,next,previous
    if (window.innerWidth < 610) {
        if (document.querySelector(".songTime").innerHTML == "") {
            document.querySelector(".circle").style.display = "none"
        }
    }
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "svg/playbtn.svg"
        }
        document.querySelector(".circle").style.display = "inline"
    })

    //previous
    document.querySelector("#previous").addEventListener("click", () => {
    let current = getCurrentSongName();
    let ind = songs.indexOf(current);

    if (ind === -1) return;

    ind = (ind === 0) ? songs.length - 1 : ind - 1;

    playMusic(songs[ind]);
});


    //forward
    document.querySelector("#forward").addEventListener("click", () => {
    let current = getCurrentSongName();
    let ind = songs.indexOf(current);

    if (ind === -1) return;

    ind = (ind === songs.length - 1) ? 0 : ind + 1;

    playMusic(songs[ind]);
});


    //update time of song

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (((currentSong.currentTime) / (currentSong.duration) * 98.5)) + "%"
        if (currentSong.currentTime === currentSong.duration) {
            let current = getCurrentSongName();
            let ind = songs.indexOf(current);

            if (ind === -1) return;

            ind = (ind === songs.length - 1) ? 0 : ind + 1;
            playMusic(songs[ind]);
        }

    }
    )


    //mute
    document.querySelector(".v").addEventListener("click", () => {
        if (currentSong.muted == true) {
            currentSong.muted = false;
            document.querySelector(".vol").style.display = "inline"
            document.querySelector(".v").src = "svg/volume.svg"
        }
        else {
            currentSong.muted = true;
            document.querySelector(".v").src = "svg/mute.svg"
            document.querySelector(".vol").style.display = "none"
            // document.querySelector(".circle").style.top = 102 + "px"
        }
    })

    //volume range show
    document.querySelector(".volsvg").addEventListener("mouseover", () => {
        if (!currentSong.muted) {
            document.querySelector(".vol").style.display = "inline"
            // document.querySelector(".circle").style.top = 129.5 + "px"
        }
    })
    document.querySelector(".volsvg").addEventListener("mouseout", () => {
        document.querySelector(".vol").style.display = "none"
        // document.querySelector(".circle").style.top = 102 + "px"
    })

    //open hamburger
    document.querySelector(".inside_hb").addEventListener("click", () => {
        document.querySelector(".left").style.position = "absolute"
        document.querySelector(".left").style.zIndex = "10"
        document.querySelector(".cross").style.position = "static"
        document.querySelector(".hamburger").style.opacity = 0
        document.querySelector(".cross").style.opacity = 1
        document.querySelector(".left").style.left = 0 + "%"
    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".hamburger").style.position = "static"
        document.querySelector(".hamburger").style.opacity = 1
        document.querySelector(".left").style.position = "absolute"
        document.querySelector(".left").style.left = -100 + "%"
        document.querySelector(".cross").style.opacity = 0
        document.querySelector(".cross").style.position = "absolute"
    })

    //update seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (percent * currentSong.duration) / 100;
        document.querySelector(".songTime").innerHTML = `${(currentSong.currentTime)}/${(currentSong.duration)}`
    })

    //volume
    document.querySelector(".volsvg").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

}
main()