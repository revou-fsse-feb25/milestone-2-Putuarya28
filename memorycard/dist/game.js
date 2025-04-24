"use strict";
const cards = document.querySelectorAll('.memory-card');
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score-value");
const restartButton = document.getElementById("restart");
let lockBoard = false;
let hasFlippedCard = false;
let firstCard = null;
let secondCard = null;
let timeLeft = 60;
let scoreCount = 0;
let finalScore = 0;
let countdown;
cards.forEach(card => card.removeEventListener('click', flipcard));
window.onload = () => {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.disabled = false;
        console.log("button enabled");
    }
};
function startCountdown() {
    const startButton = document.getElementById("startButton");
    if (startButton)
        startButton.style.display = "none";
    clearInterval(countdown);
    countdown = window.setInterval(() => {
        if (timeLeft >= 0 && timerElement) {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        }
        else {
            clearInterval(countdown);
            cards.forEach(card => card.removeEventListener('click', flipcard));
            const endGameScreen = document.getElementById("endGame");
            const loseScreen = document.getElementById("lose");
            const winScreen = document.getElementById("win");
            if (endGameScreen)
                endGameScreen.style.display = "flex";
            if (loseScreen)
                loseScreen.style.display = "block";
            if (winScreen)
                winScreen.style.display = "none";
            if (restartButton)
                restartButton.style.display = "block";
        }
    }, 1000);
    cards.forEach(card => card.addEventListener('click', flipcard));
}
function flipcard() {
    if (lockBoard || this === firstCard)
        return;
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
    if (!firstCard || !secondCard)
        return;
    let isMatched = firstCard.dataset.character === secondCard.dataset.character;
    isMatched ? disableCard() : unflipCard();
    if (isMatched) {
        scoreCount += 10;
        bonusScore();
        if (scoreElement)
            scoreElement.innerHTML = finalScore.toString();
        endGame();
    }
}
function disableCard() {
    firstCard?.removeEventListener('click', flipcard);
    secondCard?.removeEventListener('click', flipcard);
    resetBoard();
}
function unflipCard() {
    lockBoard = true;
    setTimeout(() => {
        firstCard?.classList.remove('flip');
        secondCard?.classList.remove('flip');
        resetBoard();
    }, 1500);
}
function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}
function shuffleCard() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos.toString();
    });
}
shuffleCard();
function bonusScore() {
    finalScore = scoreCount * (timeLeft + 1);
}
function endGame() {
    if (scoreCount === 80) {
        clearInterval(countdown);
        finalScore = scoreCount * (timeLeft + 1);
        const endGameScreen = document.getElementById("endGame");
        const winScreen = document.getElementById("win");
        if (endGameScreen)
            endGameScreen.style.display = "flex";
        if (winScreen)
            winScreen.style.display = "block";
        if (restartButton)
            restartButton.style.display = "block";
    }
    else {
        if (scoreElement)
            scoreElement.innerHTML = scoreCount.toString();
    }
}
function restartGame() {
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipcard);
    });
    scoreCount = 0;
    timeLeft = 60;
    if (scoreElement)
        scoreElement.innerHTML = scoreCount.toString();
    shuffleCard();
    clearInterval(countdown);
    startCountdown();
    const endGameScreen = document.getElementById("endGame");
    const loseScreen = document.getElementById("lose");
    if (endGameScreen)
        endGameScreen.style.display = "none";
    if (loseScreen)
        loseScreen.style.display = "none";
    if (restartButton)
        restartButton.style.display = "none";
}
restartButton?.addEventListener('click', restartGame);
