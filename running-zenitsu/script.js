const elements = {
    gameContainer: document.querySelector(".game-container"),
    character: document.getElementById("character"),
    gameOverText: document.getElementById("gameover-text"),
    goldValue: document.getElementById("gold-value")
  };

  let isGameOver = false;
  let gameStarted = false;

  const characterState = {
    idleGif: "running-zenitsu-assets/idle.gif",
    runningGif: "running-zenitsu-assets/running.gif",
    positionX: 50,
    positionY: 5,
    speed: 4,
    facingLeft: true,
    isRunning: false,
    movementInterval: null
  };

  let keysPressed = {};
  let currentGold = 0;
  let highestGold = 0;
  let lastGold = 0;
  let spawnGoldInterval;
  let spawnAkazaInterval;

  if (/Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.body.innerHTML = "<h2>Sorry, this game is not available on mobile devices.</h2>";
    throw new Error("This game is under development for mobile users");
}

function startGame() {
    gameStarted = true;
    resumeIntervals();
    document.getElementsByClassName("start-button")[0].style.display = "none"; 
    document.getElementById("game-container").style.display = "flex"
    document.getElementById("bg-portrait").style.display = "none"
    document.getElementById("bg-landscape").style.display = "none"
    document.getElementById("image-bg").style.display = "flex"
}
const startButton = document.getElementsByClassName("start-button")[0];
startButton.addEventListener("click", startGame);

document.body.appendChild(startButton);

setTimeout (() => {
    startButton.style.opacity = "1";
},2000)

function stopIntervals() {
    clearInterval(spawnAkazaInterval);
    clearInterval(spawnGoldInterval);
}

function resumeIntervals() {
    stopIntervals();
    spawnAkazaInterval = setInterval(createAkazaHead, 1000);
    spawnGoldInterval = setInterval(createFallingObject, 1000);
}

function gameOver() {
    stopIntervals();
    document.removeEventListener("keydown", handleKeydown);
    isRunning = false;
    activeKey = null;
    character.src = "running-zenitsu-assets/gameOver.gif";
    character.style.width = "15%"
    elements.gameOverText.style.display = "block";  
    document.getElementById("arena-bg").style.opacity = "0.5";

    const restartButton = document.getElementsByClassName("restart")[0];
    restartButton.style.display = "flex"
    restartButton.addEventListener("click", restartGame);
    updateHighestGold();
}

let lastPositionX = 50;

function restartGame() {
    lastPositionX = characterState.positionX;
    positionY = 5;
    currentGold = 0;
    updateGold();
    elements.gameOverText.style.display = "none";
    document.getElementById("arena-bg").style.opacity = "1";
    character.src = characterState.idleGif;
    character.style.width = "10%"

    document.querySelectorAll(".falling-object, .akaza").forEach(object => object.remove());

    document.addEventListener("keydown", handleKeydown);
    resumeIntervals();
    characterState.positionX = lastPositionX;
}

function updateGold () {
    elements.goldValue.innerHTML = currentGold;
}

function updateHighestGold() {
    console.log("Current Gold:", currentGold);
    console.log("Previous Highest Gold:", highestGold);

    if (currentGold > highestGold) {
        highestGold = currentGold;
        localStorage.setItem("highest-value", highestGold);
        document.getElementById("highest-value").innerHTML = highestGold;
    }
}

let activeKey = null;

document.addEventListener("keydown", handleKeydown);
function handleKeydown(event) {
    if (activeKey !== event.key) {
        activeKey = event.key;
        if (!characterState.isRunning) {
            character.src = characterState.runningGif;
            isRunning = true;
        };

        clearInterval(characterState.movementInterval);
        characterState.movementInterval = setInterval(() => {
            switch (activeKey) {
                case "ArrowLeft":
                    characterState.positionX -= characterState.speed;
                    character.style.left = `${characterState.positionX}%`;
                    if (characterState.facingLeft) {
                        character.style.transform = "scaleX(1)";
                        characterState.facingLeft = false;
                    }
                    break;

                case "ArrowRight":
                    character.style.transform = "scaleX(-1)";
                    characterState.positionX += characterState.speed;
                    character.style.left = `${characterState.positionX}%`;
                    if (!characterState.facingLeft) {
                        
                        characterState.facingLeft = true;
                    }
                    break;
            }
        }, 50);
    }
}



document.addEventListener("keyup", (event) => {
    if (event.key === activeKey) {
        clearInterval(characterState.movementInterval);
        isRunning = false;
        activeKey = null; 

        character.src = characterState.idleGif;
    }
});
    

// // MOBILE MOVEMENTS (UNDER DEVELOPMENT)
// let moveInterval;
// let activeTouches = new Set(); // Track active touch inputs

// function startMoving(direction) {
//     activeTouches.add(direction); // Store active button press

//     if (!isRunning) {
//         character.src = runningGif; // Set running animation
//         isRunning = true;
//     }

//     if (!moveInterval) {
//         moveInterval = setInterval(() => {
//             if (activeTouches.has("left") && !activeTouches.has("right")) {
//                 positionX -= speed;
//                 character.style.left = `${positionX}%`;
//                 character.style.transform = "scaleX(1)";
//             } else if (activeTouches.has("right") && !activeTouches.has("left")) {
//                 positionX += speed;
//                 character.style.left = `${positionX}%`;
//                 character.style.transform = "scaleX(-1)";
//             }
//         }, 70); // Adjusted interval for smoother speed
//     }
// }

// function stopMoving(direction) {
//     activeTouches.delete(direction); // Remove button press

//     if (activeTouches.size === 0) { // Stop movement only when no buttons are held
//         clearInterval(moveInterval);
//         moveInterval = null;
//         isRunning = false;
//         character.src = idleGif; // Reset to idle when stopping
//     }
// }
// Attach event listeners for touch controls
// document.getElementById("arrow-left").addEventListener("touchstart", () => startMoving("left"));
// document.getElementById("arrow-left").addEventListener("touchend", () => stopMoving("left"));

// document.getElementById("arrow-right").addEventListener("touchstart", () => startMoving("right"));
// document.getElementById("arrow-right").addEventListener("touchend", () => stopMoving("right"));



// falling objects

setInterval(() => {
    document.querySelectorAll(".falling-object, .akaza").forEach(object => {
        if (object && document.body.contains(object)) {
            checkCollision(object);
        }
    });
}, 50);

function createAkazaHead() {
    const akaza = document.createElement("img");
    akaza.src = "running-zenitsu-assets/akaza-head.gif";
    akaza.classList.add("akaza");

    akaza.style.left = `${Math.random() * 90}%`;
    akaza.style.top = "-50px";

    elements.gameContainer.appendChild(akaza);

    let fallSpeed = 8;
    let positionY = -50;

    const fallInterval = setInterval(() => {
        positionY += fallSpeed;
        akaza.style.top = `${positionY}px`;

        if (positionY > window.innerHeight) {
            clearInterval(fallInterval);
            akaza.remove();
        }
    }, 30);
}

function checkCollision(object) {
    if (!object) return;
    const characterRect = character.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();
    if (
        characterRect.left < objectRect.right &&
        characterRect.right > objectRect.left &&
        characterRect.top < objectRect.bottom &&
        characterRect.bottom > objectRect.top
    ) {
        if (object.classList.contains("akaza")) {
            gameOver();
        } else if (object.classList.contains("falling-object")) {
        }
    }
}

let collisionInterval = setInterval(() => {
    document.querySelectorAll(".falling-object, .akaza").forEach(object => checkCollision(object));
}, 50);

function createFallingObject() {
    const fallingObject = document.createElement("img");
    fallingObject.src = "running-zenitsu-assets/gold.png"; 
    fallingObject.classList.add("falling-object");

    fallingObject.style.left = `${Math.random() * 90}%`;
    fallingObject.style.top = "-50px";

    elements.gameContainer.appendChild(fallingObject);

    let fallSpeed = 5;
    let positionY = -50;

    const fallInterval = setInterval(() => {
        positionY += fallSpeed;
        fallingObject.style.top = `${positionY}px`;

        if (positionY > window.innerHeight) {
            clearInterval(fallInterval);
            fallingObject.remove();
        }
    }, 30);

    function checkCollision() {
        const characterRect = character.getBoundingClientRect();
        const fallingObjectRect = fallingObject.getBoundingClientRect();
    
        if (
            characterRect.left < fallingObjectRect.right &&
            characterRect.right > fallingObjectRect.left &&
            characterRect.top < fallingObjectRect.bottom &&
            characterRect.bottom > fallingObjectRect.top
        ) {
            collectItem();
        }
    }
    
    function collectItem() {
        currentGold += 10;
        updateGold();
        fallingObject.style.display = "none";
    }
    setInterval(checkCollision, 50);
}

