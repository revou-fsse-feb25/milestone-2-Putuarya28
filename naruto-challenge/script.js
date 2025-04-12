// Get all image elements from the DOM
const images = document.querySelectorAll('#indomie img, #sedaap img');
const feedbackImage = document.getElementById('feedback-image');
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

// Randomly select one image
let imageIds = Array.from(images).map(img => img.id);
let selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
console.log(selectedImageId);

let attempt = 3
let isGameOver = false
let currentScore = 0
let playingTime = 0


// Function to update the score on the webpage
function updateScore() {
  scoreValue.innerText = currentScore; // Update the score value in the HTML
}
function finalScore() {
  finalScoreValue.innerText = currentScore;
}


//feedback pictures
const feedbackPictures = {
  correct: './asset/naruto-correct.gif',
  gameover: './asset/naruto-gameover.gif', 
  wrong: './asset/naruto-wrong.gif',
  narutoEating: './asset/naruto-eating.gif'
};


// restart game



// Add click event listeners to each image

let feedbackTimeout;

images.forEach(img => {
  img.addEventListener('click', () => {
    playingTime++
    console.log ("playing time :", playingTime);
    if (isGameOver) return;

    const clickedImageId = img.id;
    if (clickedImageId === selectedImageId) {
      currentScore += 10;
      console.log ("score: ", currentScore);
      updateScore();
      
  
      
      ichirakuMenu.style.display = "none";
      setTimeout(() => {
        ichirakuMenu.style.display = "flex"
      }, 4000);
      feedbackContainer.style.display = "flex"
      setTimeout(() => {
        feedbackContainer.style.display = "none"
      }, 4000);


      feedbackImage.src = feedbackPictures.correct;
      feedbackImage.style.display = "block";
      

      setTimeout(() => {
        feedbackImage.src = feedbackPictures.narutoEating;

        // Reset the game state and select a new target
        setTimeout(() => {
          restartGame(); // Restart the game to continue guessing
        }, 2000); // Delay to show the transition image
      }, 2000);
    } else {
      attempt--;
      if (attempt > 0) {

        ichirakuMenu.style.display = "none";
        setTimeout(() => {
        ichirakuMenu.style.display = "flex"
        }, 2000);
        feedbackContainer.style.display = "flex"
        setTimeout(() => {
        feedbackContainer.style.display = "none"
        }, 2000);
        

        feedbackImage.src = feedbackPictures.wrong;
        feedbackImage.style.display = "block"

        if (clueIndomie.contains(document.getElementById(selectedImageId))) {
          console.log("Indomie selected! Time to enjoy some legendary noodles.");
          showclueIndomie.style.display = "block"
          setTimeout (() => {
            showclueIndomie.style.display = "none";
          }, 3000)
          
        } else if (clueSedaap.contains(document.getElementById(selectedImageId))) {
          console.log("Sedaap selected! Get ready for a delicious experience.");
          showclueSedaap.style.display = "block"
          setTimeout (() => {
            showclueSedaap.style.display = "none";
          }, 3000)
        } else {
          console.log("No valid image found.");
        }

        console.log(attempt)
        feedbackTimeout = setTimeout(() => {
          feedbackImage.src = ""; // Hide the feedback image
        }, 2000);
      } else {
        ichirakuMenu.style.display = "none";
        feedbackImage.src = feedbackPictures.gameover;
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
    attempt = 5; // Reset attempts
    feedbackImage.src = ""; // Clear any feedback images
    feedbackImage.style.display = "none"; // Hide feedback image
  
  
    // Randomly select a new target image
    const newImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
  
    while (newImageId === selectedImageId) {
      selectedImageId = imageIds[Math.floor(Math.random() * imageIds.length)];
    }
    selectedImageId = newImageId;
    console.log("New target image ID:", selectedImageId);
  }

});