import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

const registerView = () => {
    const videoId = window.location.href.split("/videos/")[1];
    fetch(`/api/${videoId}/view`, {
        method: "POST"
    });
};

function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function handleVolumeClick() {
    if (videoPlayer.muted) {
        videoPlayer.muted = false;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeRange.value = videoPlayer.volume; //볼륨값이 이미 저장되어 있어서 가능.
    } else {
        volumeRange.value = 0; // 이렇게만 해줘도 이벤트 리스너가 말을 들음
        videoPlayer.muted = true;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } // 모든 종류의 브라우저에서 작동하게, 만약 이게 동작하면 하고 아니면 딴걸로 넘어가라.
    fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScrnBtn.addEventListener("click", goFullScreen);
}

function goFullScreen() {
    if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
    }
    fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScrnBtn.removeEventListener("click", goFullScreen);
    fullScrnBtn.addEventListener("click", exitFullScreen);
}

// 누군가가 미리 만들어둔 함수, 시간 반환
const formatDate = seconds => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }
    return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
    // floor를 하는 이유는 동영상이 52.49 짜리인데 51.9에서 0으로 세팅되는걸 막기 위해서.
}

async function setTotalTime() {
    const blob = await fetch(videoPlayer.src).then(response => response.blob());
    const duration = await getBlobDuration(blob);
    const totalTimeString = formatDate(duration);
    totalTime.innerHTML = totalTimeString; //토탈 타임 프린트
    setInterval(getCurrentTime, 1000);
}

function handleEnded() {
    videoPlayer.currentTime = 0;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
    const {
        target: { value }
    } = event;
    videoPlayer.volume = value;
    if (value >= 0.6) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (value >= 0.2) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
}

function init() {
    registerView();
    videoPlayer.volume = 0.5;
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    fullScrnBtn.addEventListener("click", goFullScreen);
    videoPlayer.addEventListener("loadedmetadata", setTotalTime); //로드를 해야지만 듀레이션을 알 수 있다.
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag);
}

if (videoContainer) {
    init();
}