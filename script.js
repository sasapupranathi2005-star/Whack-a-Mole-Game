"use strict";

// ===============================
// 1. SELECT HTML ELEMENTS
// ===============================

const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");

const playBtn = document.getElementById("playBtn");
const startBtn = document.getElementById("startBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const holes = document.querySelectorAll(".hole");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const bestDisplay = document.getElementById("best");
const message = document.getElementById("message");

const coinBalance = document.getElementById("coinBalance");
const welcomeCoins = document.getElementById("welcomeCoins");
const welcomeBest = document.getElementById("welcomeBest");

const levelDisplay = document.getElementById("levelDisplay");
const targetDisplay = document.getElementById("targetDisplay");
const levelProgressFill = document.getElementById("levelProgressFill");

const difficulty = document.getElementById("difficulty");
const gameStatus = document.getElementById("gameStatus");

// ===============================
// 2. GAME VARIABLES
// ===============================

let score = 0;
let levelScore = 0;
let level = 1;
let target = 100;
let timeLeft = 60;

let coins = Number(localStorage.getItem("whackMoleCoins")) || 0;
let best = Number(localStorage.getItem("whackMoleBest")) || 0;

let activeHole = -1;
let moleTimer = null;
let countdownTimer = null;

let isPlaying = false;
let levelCompleted = false;

// ===============================
// 3. UPDATE COINS AND BEST SCORE
// ===============================

function updateWallet() {
    coinBalance.textContent = coins;
    welcomeCoins.textContent = coins;
    welcomeBest.textContent = best;
    bestDisplay.textContent = best;

    localStorage.setItem("whackMoleCoins", coins);
    localStorage.setItem("whackMoleBest", best);
}

// ===============================
// 4. UPDATE GAME DISPLAY
// ===============================

function updateStats() {
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    levelDisplay.textContent = "LEVEL " + level;
    targetDisplay.textContent = target + " PTS";

    const progress = Math.min(
        (levelScore / target) * 100,
        100
    );

    levelProgressFill.style.width = progress + "%";

    updateWallet();
}

// ===============================
// 5. CLEAR TIMERS AND MOLES
// ===============================

function clearMoles() {
    holes.forEach(function (hole) {
        hole.classList.remove("active");
        hole.textContent = "";
    });

    activeHole = -1;
}

function stopRound() {
    clearInterval(moleTimer);
    clearInterval(countdownTimer);

    moleTimer = null;
    countdownTimer = null;

    isPlaying = false;

    clearMoles();
}

// ===============================
// 6. OPEN WELCOME SCREEN
// ===============================

function goHome() {
    stopRound();

    welcomeScreen.hidden = false;
    gameScreen.hidden = true;

    updateWallet();
}

// ===============================
// 7. START GAME
// ===============================

function startGame() {
    welcomeScreen.hidden = true;
    gameScreen.hidden = false;

    level = 1;
    score = 0;

    startRound();
}

// ===============================
// 8. START A LEVEL
// ===============================

function startRound() {
    stopRound();

    levelScore = 0;
    target = 100 + (level - 1) * 50;
    timeLeft = 60;

    isPlaying = true;
    levelCompleted = false;

    startBtn.hidden = true;
    nextLevelBtn.hidden = true;
    restartBtn.hidden = false;

    gameStatus.textContent = "PLAYING";
    message.textContent = "Catch the mole to earn points and coins!";

    updateStats();
    spawnMole();

    startMoleTimer();
    startCountdown();
}

// ===============================
// 9. SHOW MOLE
// ===============================

function spawnMole() {
    if (!isPlaying || holes.length === 0) {
        return;
    }

    clearMoles();

    activeHole = Math.floor(
        Math.random() * holes.length
    );

    holes[activeHole].textContent = "🐹";
    holes[activeHole].classList.add("active");
}

// ===============================
// 10. MOLE MOVEMENT TIMER
// ===============================

function startMoleTimer() {
    clearInterval(moleTimer);

    const speed = Number(difficulty.value) || 750;

    moleTimer = setInterval(function () {
        if (isPlaying) {
            spawnMole();
        }
    }, speed);
}

// ===============================
// 11. COUNTDOWN TIMER
// ===============================

function startCountdown() {
    clearInterval(countdownTimer);

    countdownTimer = setInterval(function () {
        if (!isPlaying) {
            return;
        }

        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// ===============================
// 12. HIT MOLE
// ===============================

function hitMole(index) {
    if (!isPlaying || index !== activeHole) {
        return;
    }

    score += 10;
    levelScore += 10;
    coins += 1;

    clearMoles();

    if (score > best) {
        best = score;
    }

    updateStats();

    if (levelScore >= target) {
        completeLevel();
    } else {
        message.textContent = "+10 POINTS! +1 COIN!";
    }
}

// ===============================
// 13. COMPLETE LEVEL
// ===============================

function completeLevel() {
    if (levelCompleted) {
        return;
    }

    levelCompleted = true;

    stopRound();

    coins += 50;

    updateStats();

    gameStatus.textContent = "LEVEL COMPLETE!";
    message.textContent =
        "Amazing! You earned 50 bonus coins!";

    nextLevelBtn.hidden = false;
    startBtn.hidden = true;
}

// ===============================
// 14. GAME OVER
// ===============================

function endGame() {
    if (!isPlaying) {
        return;
    }

    stopRound();

    gameStatus.textContent = "GAME OVER";

    message.textContent =
        "Time is up! Your score: " + score;

    startBtn.textContent = "PLAY AGAIN";
    startBtn.hidden = false;

    nextLevelBtn.hidden = true;

    updateStats();
}

// ===============================
// 15. MOLE CLICK EVENTS
// ===============================

holes.forEach(function (hole, index) {
    hole.addEventListener("click", function () {
        hitMole(index);
    });
});

// ===============================
// 16. BUTTON EVENTS
// ===============================

playBtn.addEventListener("click", startGame);

startBtn.addEventListener("click", startGame);

nextLevelBtn.addEventListener("click", function () {
    level++;
    startRound();
});

restartBtn.addEventListener("click", function () {
    level = 1;
    score = 0;

    startRound();
});

homeBtn.addEventListener("click", goHome);

// ===============================
// 17. DIFFICULTY CONTROL
// ===============================

difficulty.addEventListener("change", function () {
    if (isPlaying) {
        startMoleTimer();
    }
});

// ===============================
// 18. INITIAL SETUP
// ===============================

updateWallet();
updateStats();

welcomeScreen.hidden = false;
gameScreen.hidden = true;