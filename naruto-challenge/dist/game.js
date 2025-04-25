"use strict";
const images = document.querySelectorAll('#indomie img, #sedaap img');
const feedbackImage = document.getElementById('feedback-image');
const feedbackVideo = document.getElementById('feedback-video');
const feedbackContainer = document.getElementById('naruto-feedback');
const ichirakuMenu = document.getElementById('ichiraku-menu');
const gameOver = document.getElementById('game-over');
const scoreValue = document.getElementById("score-value");
const finalScoreValue = document.getElementById("finalScore-value");
const scoreDisplay = document.getElementById('score');
const clueIndomie = document.getElementById('indomie');
const clueSedaap = document.getElementById('sedaap');
const showclueIndomie = document.getElementById('clue-indomie');
const showclueSedaap = document.getElementById('clue-sedaap');
let imageIds = Array.from(images).map(img => img.id);
let selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
let attempt = 4;
let isGameOver = false;
let currentScore = 0;
let playingTime = 0;
let feedbackTimeout;
const pictures = {
    correct: 'naruto-challenge-assets/naruto-correct-static.jpg',
    gameover: 'naruto-challenge-assets/naruto-gameover-static.png',
    wrong: 'naruto-challenge-assets/naruto-wrong-static.png',
    narutoEating: 'naruto-challenge-assets/naruto-eating-static.png'
};
const video = {
    correct: 'naruto-challenge-assets/naruto-correct.mp4',
    gameover: 'naruto-challenge-assets/naruto-gameover.mp4',
    wrong: 'naruto-challenge-assets/naruto-wrong.mp4',
    narutoEating: 'naruto-challenge-assets/naruto-eating.mp4'
};
function updateScore() {
    if (scoreValue) {
        scoreValue.innerText = currentScore.toString();
    }
}
function finalScore() {
    if (finalScoreValue) {
        finalScoreValue.innerText = currentScore.toString();
    }
}
function switchFormat() {
    if (!feedbackImage || !feedbackVideo)
        return;
    if (window.innerWidth < 1024) {
        feedbackImage.style.display = "block";
        feedbackVideo.style.display = "none";
        feedbackVideo.src = "";
    }
    else {
        feedbackVideo.style.display = "block";
        feedbackImage.style.display = "none";
    }
}
window.onload = switchFormat;
window.addEventListener("resize", switchFormat);
images.forEach(img => {
    img.addEventListener('click', () => {
        if (isGameOver)
            return;
        const clickedImageId = img.id;
        if (clickedImageId === selectedImageId) {
            currentScore += 100;
            console.log("score: ", currentScore);
            updateScore();
            if (ichirakuMenu)
                ichirakuMenu.style.opacity = "0";
            setTimeout(() => { if (ichirakuMenu)
                ichirakuMenu.style.opacity = "1"; }, 4000);
            if (feedbackContainer)
                feedbackContainer.style.display = "flex";
            setTimeout(() => { if (feedbackContainer)
                feedbackContainer.style.display = "none"; }, 4000);
            switchFormat();
            if (feedbackImage)
                feedbackImage.src = pictures.correct;
            if (feedbackVideo)
                feedbackVideo.src = video.correct;
            setTimeout(() => {
                switchFormat();
                if (feedbackImage)
                    feedbackImage.src = pictures.narutoEating;
                if (feedbackVideo)
                    feedbackVideo.src = video.narutoEating;
                setTimeout(() => {
                    restartGame();
                }, 2000);
            }, 2000);
        }
        else {
            attempt--;
            if (attempt > 0) {
                if (ichirakuMenu)
                    ichirakuMenu.style.opacity = "0";
                setTimeout(() => { if (ichirakuMenu)
                    ichirakuMenu.style.opacity = "1"; }, 2000);
                if (feedbackContainer)
                    feedbackContainer.style.display = "flex";
                setTimeout(() => { if (feedbackContainer)
                    feedbackContainer.style.display = "none"; }, 2000);
                switchFormat();
                if (feedbackImage)
                    feedbackImage.src = pictures.wrong;
                if (feedbackVideo)
                    feedbackVideo.src = video.wrong;
                const selectedElement = document.getElementById(selectedImageId);
                if (selectedElement && clueIndomie?.contains(selectedElement)) {
                    console.log("Indomie selected! Time to enjoy some legendary noodles.");
                    if (showclueIndomie)
                        showclueIndomie.style.display = "block";
                    setTimeout(() => { if (showclueIndomie)
                        showclueIndomie.style.display = "none"; }, 2000);
                }
                else if (selectedElement && clueSedaap?.contains(selectedElement)) {
                    console.log("Sedaap selected! Get ready for a delicious experience.");
                    if (showclueSedaap)
                        showclueSedaap.style.display = "block";
                    setTimeout(() => { if (showclueSedaap)
                        showclueSedaap.style.display = "none"; }, 2000);
                }
                else {
                    console.log("No valid image found.");
                }
                console.log(attempt);
                feedbackTimeout = window.setTimeout(() => {
                    if (feedbackImage)
                        feedbackImage.src = "";
                }, 2000);
            }
            else {
                if (ichirakuMenu)
                    ichirakuMenu.style.display = "none";
                switchFormat();
                if (feedbackImage)
                    feedbackImage.src = pictures.gameover;
                if (feedbackVideo)
                    feedbackVideo.src = video.gameover;
                isGameOver = true;
                if (gameOver)
                    gameOver.style.display = "flex";
                if (scoreDisplay)
                    scoreDisplay.style.display = "none";
                if (feedbackContainer)
                    feedbackContainer.style.display = "flex";
                finalScore();
            }
        }
    });
});
function restartGame() {
    isGameOver = false;
    attempt = 5;
    if (feedbackImage)
        feedbackImage.src = "";
    if (feedbackImage)
        feedbackImage.style.display = "none";
    switchFormat();
    let newImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
    while (newImageId === selectedImageId) {
        selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
    }
    selectedImageId = newImageId;
}
