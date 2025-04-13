const gameContainer = document.querySelector(".game-container");
const character = document.getElementById("character");
const gameOverText = document.getElementById("gameover-text")
const idleGif = "assets/idle.gif";
const runningGif = "assets/running.gif";
let positionX = 50;
let positionY = 5;
const speed = 4;
let facingLeft = true; // Tracks direction
let isRunning = false;
let movementInterval;
let keysPressed = {}; // Track pressed keys
let goldValue = document.getElementById("gold-value")
let currentGold = 0;
let spawnCometInterval;
let spawnGoldInterval;
let gameStarted = false;
let highestGold = 0;
let lastGold = 0

// Start game function
function startGame() {
    gameStarted = true;
    resumeIntervals();
    document.getElementsByClassName("start-button")[0].style.display = "none"; 
    document.getElementById("game-container").style.display = "flex"
    document.getElementById("video-bg").style.display = "none"
    document.getElementById("image-bg").style.display = "flex"
    document.getElementById("arrow-button").style.display = "flex"
}

const startButton = document.getElementsByClassName("start-button")[0];
startButton.addEventListener("click", startGame);


document.body.appendChild(startButton);

setTimeout (() => {
    startButton.style.opacity = "1";
},2000)

// Stop all intervals before restarting
function stopIntervals() {
    clearInterval(spawnCometInterval);
    clearInterval(spawnGoldInterval);
}

// Resume existing intervals without multiplying them
function resumeIntervals() {
    stopIntervals(); // Clear any existing intervals first
    spawnCometInterval = setInterval(createDeadlyComet, 1000);
    spawnGoldInterval = setInterval(createFallingObject, 1000);
}

// Game Over function
function gameOver() {
    stopIntervals(); // Stop intervals properly
    document.removeEventListener("keydown", handleKeydown);
    isRunning = false;
    activeKey = null;
    character.src = "assets/gameOver.gif";
    character.style.width = "15%"
    gameOverText.style.display = "block";  
    document.getElementById("arena-bg").style.opacity = "0.5";

    // Show restart button

    const restartButton = document.getElementsByClassName("restart")[0];
    restartButton.style.display = "flex"
    restartButton.addEventListener("click", restartGame);
    updateHighestGold();

    
 
}

// Restart Game without multiplying intervals
let lastPositionX = 50; // Default start position

function restartGame() {
    lastPositionX = positionX; // Save where the character was last

    // Reset necessary variables
    positionY = 5;
    currentGold = 0;
    updateGold();
    gameOverText.style.display = "none";
    document.getElementById("arena-bg").style.opacity = "1";
    character.src = idleGif;
    character.style.width = "10%"

    document.querySelectorAll(".falling-object, .comet").forEach(object => object.remove());

    document.addEventListener("keydown", handleKeydown);
    resumeIntervals();
    positionX = lastPositionX;
}




function updateGold () {
    goldValue.innerHTML = currentGold;
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


setTimeout (() => {
gameStarted.style.display = "flex"
}, 5000) 

let activeKey = null; // Track the currently active key

document.addEventListener("keydown", handleKeydown);
function handleKeydown(event) {
    if (activeKey !== event.key) { // Only update if a new key is pressed
        activeKey = event.key;
        if (!isRunning) {
            character.src = runningGif; // Set running animation once
            isRunning = true;
        };

        clearInterval(movementInterval); // Clear previous movement before starting a new one
        movementInterval = setInterval(() => {
            switch (activeKey) {
                case "ArrowLeft":
                    positionX -= speed;
                    character.style.left = `${positionX}%`;
                    if (facingLeft) {
                        character.style.transform = "scaleX(1)";
                        facingLeft = false;
                    }
                    break;

                case "ArrowRight":
                    character.style.transform = "scaleX(-1)";
                    positionX += speed;
                    character.style.left = `${positionX}%`;
                    if (!facingLeft) {
                        
                        facingLeft = true;
                    }
                    break;
            }
        }, 50); // Adjust speed by changing the interval time
    }
}



document.addEventListener("keyup", (event) => {
    if (event.key === activeKey) { // Only stop movement if it's the released key
        clearInterval(movementInterval);
        isRunning = false;
        activeKey = null; // Reset key state

        character.src = idleGif; // Change to idle animation on key release
    }
});
    

// MOBILE MOVEMENTS
document.getElementById("arrow-left").addEventListener("touchstart", () => startMoving("left"));
document.getElementById("arrow-left").addEventListener("touchend", stopMoving);

document.getElementById("arrow-right").addEventListener("touchstart", () => startMoving("right"));
document.getElementById("arrow-right").addEventListener("touchend", stopMoving);
        

let moveInterval;
let currentDirection = null; // Track current movement direction

function startMoving(direction) {
    if (currentDirection === direction) return; // Prevent restarting same direction
    currentDirection = direction;
  
    moveInterval = setInterval(() => {
        if (direction === "left") {
            positionX -= speed;
            character.style.left = `${positionX}%`;
            character.style.transform = "scaleX(1)"; // Ensure correct facing
        } else if (direction === "right") {
            positionX += speed;
            character.style.left = `${positionX}%`;
            character.style.transform = "scaleX(-1)";
        }
    }, 50);
}

function stopMoving() {
    clearInterval(moveInterval);
    currentDirection = null; // Reset movement state
}




// falling objects

setInterval(() => {
    document.querySelectorAll(".falling-object, .comet").forEach(object => {
        if (object && document.body.contains(object)) {
            checkCollision(object);
        }
    });
}, 50);



function createDeadlyComet() {
    const comet = document.createElement("img");
    comet.src = "assets/akaza-head.gif";
    comet.classList.add("comet");

    comet.style.left = `${Math.random() * 90}%`;
    comet.style.top = "-50px";

    gameContainer.appendChild(comet);

    let fallSpeed = 8;
    let positionY = -50;

    const fallInterval = setInterval(() => {
        positionY += fallSpeed;
        comet.style.top = `${positionY}px`;

        if (positionY > window.innerHeight) {
            clearInterval(fallInterval);
            comet.remove();
        }
    }, 30);
}

function checkCollision(object) {
    if (!object) return; // Prevent errors if object is null or removed
    const characterRect = character.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    // Check collision for both types of falling objects
    if (
        characterRect.left < objectRect.right &&
        characterRect.right > objectRect.left &&
        characterRect.top < objectRect.bottom &&
        characterRect.bottom > objectRect.top
    ) {
        if (object.classList.contains("comet")) {
            gameOver();
        } else if (object.classList.contains("falling-object")) {
        }
    }
}

let collisionInterval = setInterval(() => {
    document.querySelectorAll(".falling-object, .comet").forEach(object => checkCollision(object));
}, 50);






function createFallingObject() {
    const fallingObject = document.createElement("img");
    fallingObject.src = "assets/gold.png"; // Path to your falling GIF
    fallingObject.classList.add("falling-object");

    // Random starting position
    fallingObject.style.left = `${Math.random() * 90}%`;
    fallingObject.style.top = "-50px"; // Start above the screen

    gameContainer.appendChild(fallingObject);

    // Animate fall
    let fallSpeed = 5; // Speed of falling
    let positionY = -50;

    const fallInterval = setInterval(() => {
        positionY += fallSpeed;
        fallingObject.style.top = `${positionY}px`;

        // Remove when off-screen
        if (positionY > window.innerHeight) {
            clearInterval(fallInterval);
            fallingObject.remove();
        }
    }, 30); // Adjust interval for smooth falling

    function checkCollision() {
        const characterRect = character.getBoundingClientRect();
        const fallingObjectRect = fallingObject.getBoundingClientRect();
    
        if (
            characterRect.left < fallingObjectRect.right &&
            characterRect.right > fallingObjectRect.left &&
            characterRect.top < fallingObjectRect.bottom &&
            characterRect.bottom > fallingObjectRect.top
        ) {
            collectItem(); // Trigger effects on collision
        }
    }
    
    function collectItem() {
        currentGold += 10; // Increase score
        updateGold();
        fallingObject.style.display = "none"; // Make object disappear
    }
    
    // Call `checkCollision()` regularly, e.g., inside a game loop
    setInterval(checkCollision, 50);
}


// COLLLISION


