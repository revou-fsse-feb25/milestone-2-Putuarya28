// Selecting elements with proper TypeScript typing
const cards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.memory-card');
const timerElement: HTMLElement | null = document.getElementById("timer");
const scoreElement: HTMLElement | null = document.getElementById("score-value");
const restartButton: HTMLElement | null = document.getElementById("restart");

let lockBoard: boolean = false;
let hasFlippedCard: boolean = false;
let firstCard: HTMLDivElement | null = null;
let secondCard: HTMLDivElement | null = null;
let timeLeft: number = 60;
let scoreCount: number = 0;
let finalScore: number = 0;
let countdown: number;

// Ensure cards are unclickable before the game starts
cards.forEach(card => card.removeEventListener('click', flipcard));

function startCountdown(): void {
    const startButton = document.getElementById("startButton");
    if (startButton) startButton.style.display = "none";

    clearInterval(countdown);
    countdown = window.setInterval(() => {
        if (timeLeft >= 0 && timerElement) {
            let minutes: number = Math.floor(timeLeft / 60);
            let seconds: number = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        } else {
            clearInterval(countdown);
            cards.forEach(card => card.removeEventListener('click', flipcard));

            const endGameScreen = document.getElementById("endGame");
            const loseScreen = document.getElementById("lose");
            const winScreen = document.getElementById("win");

            if (endGameScreen) endGameScreen.style.display = "flex";
            if (loseScreen) loseScreen.style.display = "block";
            if (winScreen) winScreen.style.display = "none";
            if (restartButton) restartButton.style.display = "block";
        }
    }, 1000);

    // Enable clicking only after the game starts
    cards.forEach(card => card.addEventListener('click', flipcard));
}

function flipcard(this: HTMLDivElement): void {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkMatch();
}

function checkMatch(): void {
    if (!firstCard || !secondCard) return;

    let isMatched: boolean = firstCard.dataset.character === secondCard.dataset.character;
    isMatched ? disableCard() : unflipCard();

    if (isMatched) {
        scoreCount += 10;
        bonusScore();
        if (scoreElement) scoreElement.innerHTML = finalScore.toString();
        endGame();
    }
}

function disableCard(): void {
    firstCard?.removeEventListener('click', flipcard);
    secondCard?.removeEventListener('click', flipcard);
    resetBoard();
}

function unflipCard(): void {
    lockBoard = true;
    setTimeout(() => {
        firstCard?.classList.remove('flip');
        secondCard?.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard(): void {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

function shuffleCard(): void {
    cards.forEach(card => {
        let randomPos: number = Math.floor(Math.random() * 12);
        card.style.order = randomPos.toString();
    });
}

shuffleCard();

function bonusScore(): void {
    finalScore = scoreCount * (timeLeft + 1);
}

function endGame(): void {
    if (scoreCount === 80) {
        clearInterval(countdown);
        finalScore = scoreCount * (timeLeft + 1);
        
        const endGameScreen = document.getElementById("endGame");
        const winScreen = document.getElementById("win");

        if (endGameScreen) endGameScreen.style.display = "flex";
        if (winScreen) winScreen.style.display = "block";
        if (restartButton) restartButton.style.display = "block";
    } else {
        if (scoreElement) scoreElement.innerHTML = scoreCount.toString();
    }
}

function restartGame(): void {
    cards.forEach(card => {
        card.classList.remove('flip'); // Flip cards back
        card.addEventListener('click', flipcard); // Re-enable clicking
    });

    scoreCount = 0;
    timeLeft = 60;
    if (scoreElement) scoreElement.innerHTML = scoreCount.toString();

    shuffleCard();
    clearInterval(countdown);
    startCountdown();

    const endGameScreen = document.getElementById("endGame");
    const loseScreen = document.getElementById("lose");

    if (endGameScreen) endGameScreen.style.display = "none";
    if (loseScreen) loseScreen.style.display = "none";
    if (restartButton) restartButton.style.display = "none";
}

restartButton?.addEventListener('click', restartGame);