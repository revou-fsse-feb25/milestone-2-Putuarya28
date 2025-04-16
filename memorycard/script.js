const cards = document.querySelectorAll('.memory-card');
let lockBoard = false;
let hasFlippedCard = false;
let firstCard, secondCard;
let timeLeft = 5;
const timerElement = document.getElementById("timer");
const score = document.getElementById("score-value");
let scoreCount = 0;
let finalScore = 0
let countdown


startCountdown();
function startCountdown() {
    clearInterval(countdown);

    countdown = setInterval(() => {
        if (timeLeft >= 0) {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        } else {
            clearInterval(countdown); // Stop the timer when it reaches 0
            
            // Make all cards unclickable
            cards.forEach(card => card.removeEventListener('click', flipcard));

            document.getElementById("endGame").style.display = "flex";
            document.getElementById("lose").style.display = "block";
            document.getElementById("restart").style.display = "block";
        }
    }, 1000);
}



function flipcard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;

    checkMatch();
}

function checkMatch() {
    let isMatched = firstCard.dataset.romangods === secondCard.dataset.romangods;
    isMatched ? disableCard() : unflipCard();
    if (isMatched) {
        scoreCount += 10;
        bonusScore();
        score.innerHTML = finalScore;
        endGame();
    }
}

function disableCard() {
    firstCard.removeEventListener('click', flipcard);
    secondCard.removeEventListener('click', flipcard);
    resetBoard();
}

function unflipCard() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
        }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]
    [firstCard, secondCard] = [null, null]
}

function shuffleCard() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

// Call it initially to shuffle cards at the start
shuffleCard();


function bonusScore () {
    finalScore = scoreCount * (timeLeft + 1)
}

function endGame() {
    if (scoreCount === 80) {
        clearInterval(countdown);
        finalScore = scoreCount * (timeLeft + 1);        
    } else {
        score.innerHTML = scoreCount;
    }
}

function restartGame() {
    cards.forEach(card => {
        card.classList.remove('flip'); // Flip cards back
        card.addEventListener('click', flipcard); // Re-enable clicking
    });

    scoreCount = 0;
    timeLeft = 30;
    score.innerHTML = scoreCount;

    shuffleCard(); // Shuffle cards

    clearInterval(countdown);
    startCountdown();

    // Hide the endGame elements when restarting
    document.getElementById("endGame").style.display = "none";
    document.getElementById("lose").style.display = "none";
    document.getElementById("restart").style.display = "none";
}

const restartButton = document.getElementById("restart");
restartButton.addEventListener('click', restartGame)
cards.forEach(card => card.addEventListener('click', flipcard));

