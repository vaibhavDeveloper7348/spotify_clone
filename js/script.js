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
    currFolder = folder
    let a = await fetch(`/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }

    }
    let songsUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songsUL.innerHTML = "";
    for (const song of songs) {
        songsUL.innerHTML += `<li>
        <div class="msvg">
        <img src="/svg/music.svg">
        </div>
        <div class="sname"><div>${song.replaceAll("%20", " ")}</div>
        <div>artist</div></div>
        <div style="align-items:center;justify-content:center"><img src="/svg/playbtn.svg" style="margin-top: 5px;"></div></li>`
    }
    // var audio = new Audio(songs[2]);
    // audio.play();

    // addEventListener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".sname").firstElementChild.innerHTML.trim())
        })
    })


}

//playmusic

const playMusic = (music, pause = false) => {
    // let audio= new Audio("/songs/"+music)
    currentSong.src = `/${currFolder}/` + music;
    if (!pause) {
        currentSong.play()
        play.src = "/svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(music).split(".mp3")[0]
    document.querySelector(".songTime").innerHTML = "00:00"


}

//display album
async function displayalbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let cardcontainer = document.querySelector(".card")
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/songs/")[1];
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            cardcontainer.innerHTML += `<div data-folder="${folder}" class="card1 cardc">
                  <div class="play"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45" fill="none">
                    <!-- Green Circle Background -->
                    <circle cx="12" cy="12" r="10" fill="#00FF00" />
                
                    <!-- Black Play Button -->
                    <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
                </svg></div>
                  <div class="card_img"><img src="/songs/${folder}/cover.jpeg">
                
                </div>
                  <div class="pritam"><a href="/">${response.title}</a></div>
                  <div class="pritam-des">${response.description}</div>  
                </div>`
        }
    }

    //load folder
    Array.from(document.getElementsByClassName("cardc")).forEach(e => {
        e.addEventListener("click", async item => {
            await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
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
            play.src = "/svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/svg/playbtn.svg"
        }
        document.querySelector(".circle").style.display = "inline"
    })

    //previous
    document.querySelector("#previous").addEventListener("click", e => {
        let ind;
        let s = currentSong.src.split("/").slice(-1)
        for (let index = 0; index < songs.length; index++) {
            if (songs[index] == s) {
                ind = index
            }
        }
        if (ind == 0) {
            ind = songs.length
        }
        ind = ind - 1
        let pause = false
        currentSong.src = `/${currFolder}/` + songs[ind];
        if (!pause) {
            currentSong.play()
            play.src = "/svg/pause.svg"
        }
        document.querySelector(".songinfo").innerHTML = decodeURI(songs[ind]).split(".mp3")[0]
        document.querySelector(".songTime").innerHTML = "00:00"
    })

    //forward
    document.querySelector("#forward").addEventListener("click", e => {
        let ind;
        let s = currentSong.src.split("/").slice(-1)
        for (let index = 0; index < songs.length; index++) {
            if (songs[index] == s) {
                ind = index
            }
        }
        if (ind == songs.length - 1) {
            ind = -1
        }
        ind = ind + 1
        let pause = false
        currentSong.src = `/${currFolder}/` + songs[ind];
        if (!pause) {
            currentSong.play()
            play.src = "/svg/pause.svg"
        }
        document.querySelector(".songinfo").innerHTML = decodeURI(songs[ind]).split(".mp3")[0]
        document.querySelector(".songTime").innerHTML = "00:00"
    })
    //update time of song
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (((currentSong.currentTime) / (currentSong.duration) * 98.5)) + "%"
        if (currentSong.currentTime == currentSong.duration) {
            play.src = "/svg/playbtn.svg"
            let s = currentSong.src.split("/").slice(-1)
            for (let index = 0; index < songs.length; index++) {
            if (songs[index] == s) {
                ind = index
            }
        }
        if (ind == songs.length - 1) {
            ind = -1
        }
        ind = ind + 1
        let pause = false
        currentSong.src = `/${currFolder}/` + songs[ind];
        if (!pause) {
            currentSong.play()
            play.src = "/svg/pause.svg"
        }
        document.querySelector(".songinfo").innerHTML = decodeURI(songs[ind]).split(".mp3")[0]
        document.querySelector(".songTime").innerHTML = "00:00"
        }
    }
    )


    //mute
    document.querySelector(".v").addEventListener("click", () => {
        if (currentSong.muted == true) {
            currentSong.muted = false;
            document.querySelector(".vol").style.display = "inline"
            document.querySelector(".v").src = "/svg/volume.svg"
        }
        else {
            currentSong.muted = true;
            document.querySelector(".v").src = "/svg/mute.svg"
            document.querySelector(".vol").style.display = "none"
        }
    })

    //volume range show
    document.querySelector(".volsvg").addEventListener("mouseover", () => {
        if (!currentSong.muted) {
            document.querySelector(".vol").style.display = "inline"
        }
    })
    document.querySelector(".volsvg").addEventListener("mouseout", () => {
        document.querySelector(".vol").style.display = "none"
    })

    //open hamburger
    document.querySelector(".inside_hb").addEventListener("click", () => {
        document.querySelector(".left").style.position = "fixed"
        document.querySelector(".cross").style.position = "static"
        document.querySelector(".hamburger").style.position = "absolute"
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