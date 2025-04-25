const images = document.querySelectorAll('#indomie img, #sedaap img');
const feedbackImage = document.getElementById('feedback-image');
const feedbackVideo = document.getElementById('feedback-video');
const feedbackContainer = document.getElementById ('naruto-feedback')
const ichirakuMenu = document.getElementById ('ichiraku-menu'); 
const gameOver = document.getElementById ('game-over')
const scoreValue = document.getElementById("score-value");
const finalScoreValue = document.getElementById("finalScore-value");
const scoreDisplay = document.getElementById ('score');
const clueIndomie = document.getElementById ('indomie');
const clueSedaap = document.getElementById ('sedaap');
let showclueIndomie = document.getElementById ('clue-indomie')
let showclueSedaap = document.getElementById ('clue-sedaap')
let attempt = 4
let isGameOver = false
let currentScore = 0
let playingTime = 0
let imageIds = Array.from(images).map(img => img.id);
let selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
console.log(selectedImageId);

function updateScore() {
  scoreValue.innerText = currentScore;
}
function finalScore() {
  finalScoreValue.innerText = currentScore;
}

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

function switchFormat() {
  
  if (window.innerWidth < 1024) {
    feedbackImage.style.display = "block"
    feedbackVideo.style.display = "none"
  } else {
    feedbackVideo.style.display = "block"
    feedbackImage.style.display = "none"
  }
}

window.onload = switchFormat;
window.addEventListener("resize", switchFormat);

let feedbackTimeout;

images.forEach(img => {
  img.addEventListener('click', () => {
    if (isGameOver) return;

    const clickedImageId = img.id;
    if (clickedImageId === selectedImageId) {
      currentScore += 100;
      console.log ("score: ", currentScore);
      updateScore();
      
      ichirakuMenu.style.opacity = "0";
      setTimeout(() => {
        ichirakuMenu.style.opacity = "1"
      }, 4000);
      feedbackContainer.style.display = "flex"
      setTimeout(() => {
        feedbackContainer.style.display = "none"
      }, 4000);
      feedbackImage.src = pictures.correct;    
      feedbackVideo.src = video.correct
      switchFormat();

      setTimeout(() => {
        feedbackImage.src = pictures.narutoEating;
        feedbackVideo.src = video.narutoEating;

        // Reset the game state and select a new target
        setTimeout(() => {
          restartGame();
        }, 2000); // Delay to show the transition image
      }, 2000);
    } else {
      attempt--;
      if (attempt > 0) {

        ichirakuMenu.style.opacity = "0";
        setTimeout(() => {
        ichirakuMenu.style.opacity = "1"
        }, 2000);
        feedbackContainer.style.display = "flex"
        setTimeout(() => {
        feedbackContainer.style.display = "none"
        }, 2000);

        feedbackImage.src = pictures.wrong;
        feedbackVideo.src = video.wrong;
        switchFormat();

        if (clueIndomie.contains(document.getElementById(selectedImageId))) {
          console.log("Indomie selected! Time to enjoy some legendary noodles.");
          showclueIndomie.style.display = "block"
          setTimeout (() => {
            showclueIndomie.style.display = "none";
          }, 2000)
          
        } else if (clueSedaap.contains(document.getElementById(selectedImageId))) {
          console.log("Sedaap selected! Get ready for a delicious experience.");
          showclueSedaap.style.display = "block"
          setTimeout (() => {
            showclueSedaap.style.display = "none";
          }, 2000)
        } else {
          console.log("No valid image found.");
        }

        console.log(attempt)
        feedbackTimeout = setTimeout(() => {
          feedbackImage.src = "";
        }, 2000);
      } else {
        ichirakuMenu.style.display = "none";
        feedbackImage.src = pictures.gameover;
        feedbackVideo.src = video.gameover;
        isGameOver = true;
        gameOver.style.display = "flex"
        scoreDisplay.style.display = "none"
        feedbackContainer.style.display = "flex"
        finalScore();     
      }
    }
  })

  function restartGame() {
    isGameOver = false; // Unlock the game state
    attempt = 5;
    feedbackImage.src = "";
    feedbackImage.style.display = "none";
    switchFormat();
    const newImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
    while (newImageId === selectedImageId) {
      selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
    }
    selectedImageId = newImageId;
    console.log("New target image ID:", selectedImageId);
  }

});