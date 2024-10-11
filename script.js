console.log("hello")
let currentSong = new Audio(); 

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


async function getsongs() {
    let a=await fetch("http://127.0.0.1:5500/songs/");
    let response=await a.text();
    let div=document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    console.log(as)
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return songs;
    
}
const playMusic= (music,pause=false)=>{
    // let audio= new Audio("/songs/"+music)
    currentSong.src="/songs/"+music;
    if(!pause){
        currentSong.play()
        play.src= "svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(music)
    document.querySelector(".songTime").innerHTML = "00:00"
}
async function main() {
    let songs=await getsongs()
    playMusic(songs[0],true)
    console.log(songs)
    let songsUL= document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songsUL.innerHTML+=`<li>
                          <div class="msvg">
                            <img src="/svg/music.svg">
                          </div>
                          <div class="sname"><div>${song.replaceAll("%20"," ")}</div>
                        <div>artist</div></div>
                        <div style="align-items:center;justify-content:center"><img src="/svg/playbtn.svg" style="margin-top: 5px;"></div></li>`
    }
    // var audio = new Audio(songs[2]);
    // audio.play();

    // addEventListener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",ele=>{
            console.log(e.querySelector(".sname").firstElementChild.innerHTML)
            playMusic(e.querySelector(".sname").firstElementChild.innerHTML.trim())
        })
    })

    //attach an eventlistener to play,next,previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src= "svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src= "svg/playbtn.svg"
        }
    })

    //update time of song
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songTime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime)/(currentSong.duration)*100+"%"
    }
)

//open hamburger
document.querySelector(".inside_hb").addEventListener("click",()=>{
    document.querySelector(".left").style.position= "fixed"
    // document.querySelector(".sec1").style.height= 5+"vh"
    // document.querySelector(".sec2").style.height= 35+"vh"
    // document.querySelector(".sec3").style.height= 5+"vh"
    document.querySelector(".cross").style.position= "static"
    document.querySelector(".hamburger").style.position= "absolute"
    document.querySelector(".hamburger").style.opacity= 0
    document.querySelector(".cross").style.opacity= 1
    document.querySelector(".left").style.left= 0+"%"
})
document.querySelector(".cross").addEventListener("click",()=>{
    document.querySelector(".hamburger").style.position= "static"
    document.querySelector(".hamburger").style.opacity= 1
    document.querySelector(".left").style.position= "absolute"
    document.querySelector(".left").style.left= -100+"%"
    document.querySelector(".cross").style.opacity= 0
    document.querySelector(".cross").style.position= "absolute"
})

//update seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentSong.currentTime= (percent*currentSong.duration)/100;
    document.querySelector(".songTime").innerHTML=`${(currentSong.currentTime)}/${(currentSong.duration)}`
    })
}
main()