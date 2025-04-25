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

const video = {
    correct: document.createElement("video"),
    gameover: document.createElement("video"),
    wrong: document.createElement("video"),
    narutoEating: document.createElement("video")
};

video.correct.src = "naruto-challenge-assets/naruto-correct.mp4";
video.gameover.src = "naruto-challenge-assets/naruto-gameover.mp4";
video.wrong.src = "naruto-challenge-assets/naruto-wrong.mp4";
video.narutoEating.src = "naruto-challenge-assets/naruto-eating.mp4";

video.correct.preload = "auto";
video.gameover.preload = "auto";
video.wrong.preload = "auto";
video.narutoEating.preload = "auto";

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
            if (feedbackVideo)
                feedbackVideo.replaceWith(video.correct);
                video.correct.currentTime = 0;
                video.correct.play();
            setTimeout(() => {
                if (feedbackVideo)
                    feedbackVideo.replaceWith(video.narutoEating);
                    video.narutoEating.currentTime = 0;
                    video.narutoEating.play();
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
                if (feedbackVideo)
                    feedbackVideo.replaceWith(video.wrong);
                    video.wrong.currentTime = 0;
                    video.wrong.play();
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

                console.log(attempt);
                feedbackTimeout = window.setTimeout(() => {
                    if (feedbackImage)
                        feedbackImage.src = "";
                }, 2000);
            }
            else {
                if (ichirakuMenu)
                    ichirakuMenu.style.display = "none";
                if (feedbackVideo)
                    feedbackVideo.replaceWith(video.narutoEating);
                    video.gameover.play();
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
    
    let newImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
    while (newImageId === selectedImageId) {
        selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
    }
    selectedImageId = newImageId;
}
