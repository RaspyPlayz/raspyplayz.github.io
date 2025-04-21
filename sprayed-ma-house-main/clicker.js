// === Game State ===
const GameState = {
    score: 0,
    clickPower: 1,
    autoClickers: 0,
    multiplier: 1,
    totalClicks: 0,
    lastClickTime: Date.now(),
    clickRate: 0,
    clickedWrongButton: false,
    clickedMissingElement: false,
    musicModeActivated: false,
    clickedTooFastTooMuch: false,
    usedSecretCombo: false,
    unlockedTooFast: false,
    clickedGreenGlowButton: false,
    enteredSecretCode: false,
    afkTooLong: false,
    toggledClickerOff: false,
    clickedHiddenPixel: false,
    loopedAnimationTooMuch: false,
    hoveredTooLongOnVoid: false,
    conflictingActionsPerformed: false,
    confettiModeActivated: false,
    clickedInRhythm: false,
    clickedExactPixel: false,
    hasBonusCode: false,
    isSuperCharged: false,
    upgradeClickCost: 10,
    upgradeAutoCost: 50,
    upgradeMultiplierCost: 100,
    prestigePoints: 0,
    prestigeThreshold: 1000000,
    prestigeBoost: 1,
    achievements: [],
    userId: null,
    usedCodes: [], // New property to track used codes
    updateDisplay: function () {
        const formattedScore = formatScore(GameState.score);
        scoreDisplay.textContent = formattedScore;
        document.title = `(${formattedScore}) Jefferina Clicker`;
        costClickDisplay.textContent = GameState.upgradeClickCost;
        costAutoDisplay.textContent = GameState.upgradeAutoCost;
        costMultiplierDisplay.textContent = GameState.upgradeMultiplierCost;
        prestigePointsDisplay.textContent = GameState.prestigePoints;
        prestigeThresholdDisplay.textContent = formatScore(GameState.prestigeThreshold);
        checkAchievements();
    },
    saveGameState: function () {
        // Overridden by account.js
    },
    saveAchievement: function () {
        // Overridden by account.js
    },
    redeemCode: function (code) { // New function to handle code redemption
        if (!GameState.userId) {
            console.error("Cannot redeem code: User not logged in.");
            alert("Please log in to use codes!");
            return false;
        }

        if (GameState.usedCodes.includes(code)) {
            console.log(`Code '${code}' has already been used by this account.`);
            alert(`The code '${code}' has already been used on this account!`);
            return false;
        }

        const secretCode = window.secretCodes[code];
        if (secretCode) {
            secretCode.effect();
            GameState.usedCodes.push(code);
            GameState.saveGameState(); // Save the updated usedCodes to Firebase
            console.log(`Code '${code}' redeemed successfully. Used codes:`, GameState.usedCodes);
            return true;
        } else {
            console.log(`Invalid code: ${code}`);
            alert("Invalid code!");
            return false;
        }
    }
};

// Make GameState, secretCodes, and achievements globally accessible
window.GameState = GameState;
window.secretCodes = {
    jefferina: {
        effect: () => {
            GameState.enteredSecretCode = true;
            GameState.score += 1000;
            alert("Jefferina code unlocked! +1000 score!");
            GameState.updateDisplay();
            GameState.saveAchievement('secret-code');
        },
        message: "Jefferina code accepted!"
    },
    bald: {
        effect: () => {
            GameState.hasBonusCode = true;
            GameState.score += 10000;
            alert("Bonus code activated! +10000 score!");
            GameState.updateDisplay();
            GameState.saveAchievement('secret-code');
        },
        message: "Bonus code unlocked!"
    },
    raspyplayzistherealkeesh: {
        effect: () => {
            GameState.isSuperCharged = true;
            GameState.multiplier *= 2;
            alert("Supercharge code activated! Multiplier doubled!");
            GameState.updateDisplay();
            GameState.saveAchievement('secret-code');
        },
        message: "Supercharge activated!"
    },
    konami: { // Added Konami code as a secret code
        effect: () => {
            GameState.usedSecretCombo = true;
            alert("Konami code activated! Unlocked 'The Magician' achievement!");
            GameState.updateDisplay();
            GameState.saveAchievement('magician');
        },
        message: "Konami code activated!"
    }
};
window.achievements = [
    { id: "first-click", name: "🖱 First Click", condition: () => GameState.score >= 1 },
    { id: "hundred-score", name: "💯 100 Points!", condition: () => GameState.score >= 100 },
    { id: "sixty-nine", name: "💋 69 Nice", condition: () => GameState.score >= 69 },
    { id: "four-twenty", name: "🌿 420 Blaze It", condition: () => GameState.score >= 420 },
    { id: "anniversary", name: "🎉 Happy Anniversary", condition: () => GameState.score >= 421 },
    { id: "auto-army", name: "⚡ Auto Army", condition: () => GameState.autoClickers >= 5 },
    { id: "multiplier-madness", name: "✖️ Multiplier Madness", condition: () => GameState.multiplier >= 3 },
    { id: "wealthy-player", name: "💰 Wealthy Player", condition: () => GameState.score >= 10000 },
    { id: "click-commander", name: "🎖 Click Commander", condition: () => GameState.score >= 1000 },
    { id: "millionaire", name: "🏆 Millionaire", condition: () => GameState.score >= 1000000 },
    { id: "fast-fingers", name: "🚀 Fast Fingers", condition: () => GameState.score >= 10000 },
    { id: "auto-king", name: "🤖 Auto King", condition: () => GameState.autoClickers >= 50 },
    { id: "multiplier-overload", name: "🔥 Multiplier Overload", condition: () => GameState.multiplier >= 10 },
    { id: "billionaire", name: "💎 Billionaire", condition: () => GameState.score >= 1000000000 },
    { id: "click-overlord", name: "🏅 Click Overlord", condition: () => GameState.score >= 1000000 },
    { id: "trillionaire", name: "🏦 Trillionaire", condition: () => GameState.score >= 1000000000000 },
    { id: "unstoppable-clicker", name: "💥 Unstoppable Clicker", condition: () => GameState.score >= 10000000 },
    { id: "quadrillionaire", name: "🏰 Quadrillionaire", condition: () => GameState.score >= 1e15 },
    { id: "time-traveler", name: "⏳ Time Traveler", condition: () => GameState.autoClickers >= 500 },
    { id: "upgrade-specialist", name: "🛠 Upgrade Specialist", condition: () => GameState.score >= 10000 },
    { id: "factory-owner", name: "🏭 Factory Owner", condition: () => GameState.autoClickers >= 100 },
    { id: "global-clicker", name: "🌎 Global Clicker", condition: () => GameState.score >= 1e21 },
    { id: "jackpot", name: "🎰 Jackpot!", condition: () => GameState.score >= 5000 },
    { id: "alien-clicker", name: "🛸 Alien Clicker", condition: () => GameState.score >= 1e24 },
    { id: "galactic-clicker", name: "🌌 Galactic Clicker", condition: () => GameState.score >= 1e27 },
    { id: "ultimate-clicker", name: "🏆 Ultimate Clicker", condition: () => GameState.score >= 1e30 },
    { id: "richer-than-a-country", name: "💵 Richer than a Country", condition: () => GameState.score >= 1e33 },
    { id: "infinite-clicker", name: "☠️ Infinite Clicker", condition: () => GameState.score >= 1e36 },
    { id: "final-click", name: "🔲 The Final Click", condition: () => GameState.score >= Infinity },
    { id: "destroyer-of-keyboards", name: "💀 Destroyer of Keyboards", condition: () => GameState.score >= 1e28 },
    { id: "intergalactic-clicker", name: "🛸 Intergalactic Clicker", condition: () => GameState.score >= 1e100 },
    { id: "exponential-growth", name: "📈 Exponential Growth", condition: () => GameState.score >= 1e150 },
    { id: "diamond-hands", name: "💎 Diamond Hands", condition: () => GameState.score >= 1e100 },
    { id: "rhythm-clicker", name: "🎼 Rhythm Clicker", condition: () => GameState.score >= 1e100 },
    { id: "timeless-clicks", name: "⏳ Timeless Clicks", condition: () => GameState.score >= 1e100 },
    { id: "click-speedrun", name: "🚀 Click Speedrun", condition: () => GameState.score >= 1e100 },
    { id: "god-of-clicks", name: "🔱 God of Clicks", condition: () => GameState.score >= 1e100 },
    { id: "beyond-reality", name: "🌀 Beyond Reality", condition: () => GameState.score >= 1e100 },
    { id: "clicker-legend", name: "👾 Clicker Legend", condition: () => GameState.score >= 1e100 },
    { id: "old-school-clicker", name: "🕹 Old School Clicker", condition: () => GameState.score >= 1e100 },
    { id: "click-king", name: "👑 Click King", condition: () => GameState.score >= 1e100 },
    { id: "keyboard-annihilator", name: "☠️ Keyboard Annihilator", condition: () => GameState.score >= 1e100 },
    { id: "engineer-of-clicks", name: "🛠 Engineer of Clicks", condition: () => GameState.score >= 1e100 },
    { id: "memory-leak", name: "💾 Memory Leak", condition: () => GameState.score >= 1e100 },
    { id: "curious-clicker", name: "🕵️ Curious Clicker", condition: () => GameState.totalClicks >= 1 && document.hidden },
    { id: "wrong-button", name: "🚪 Click the Wrong Button", condition: () => GameState.clickedWrongButton },
    { id: "slow-but-steady", name: "🐢 Slow but Steady", condition: () => GameState.totalClicks >= 500 && GameState.clickRate <= 1 },
    { id: "error-404", name: "⚠️ Error 404", condition: () => GameState.clickedMissingElement },
    { id: "guitar-hero", name: "🎸 Guitar Hero", condition: () => GameState.musicModeActivated },
    { id: "crash-economy", name: "📉 Crash the Economy", condition: () => GameState.clickedTooFastTooMuch },
    { id: "magician", name: "🎩 The Magician", condition: () => GameState.usedSecretCombo },
    { id: "hacker", name: "🕶 The Hacker", condition: () => GameState.score >= 1e10 },
    { id: "virus-detected", name: "🦠 Virus Detected", condition: () => GameState.unlockedTooFast },
    { id: "radioactive-clicks", name: "📡 Radioactive Clicks", condition: () => GameState.clickedGreenGlowButton },
    { id: "secret-code", name: "🔑 Secret Code", condition: () => GameState.enteredSecretCode },
    { id: "sleep-mode", name: "💤 Sleep Mode", condition: () => GameState.afkTooLong },
    { id: "final-boss", name: "🐉 The Final Boss", condition: () => document.querySelectorAll(".achievement-unlocked").length >= 30 },
    { id: "no-clicker-mode", name: "🚫 No Clicker Mode", condition: () => GameState.toggledClickerOff },
    { id: "hidden-eye", name: "👁 Hidden Eye", condition: () => GameState.clickedHiddenPixel },
    { id: "infinite-loop", name: "🔁 Infinite Loop", condition: () => GameState.totalClicks >= 1000 },
    { id: "abyss", name: "🕳 The Abyss", condition: () => GameState.hoveredTooLongOnVoid },
    { id: "double-agent", name: "🎭 Double Agent", condition: () => GameState.multiplier >= 10 && GameState.autoClickers === 0 },
    { id: "party-clicker", name: "🎉 The Party Clicker", condition: () => GameState.confettiModeActivated },
    { id: "no-internet", name: "📵 No Internet", condition: () => !navigator.onLine },
    { id: "click-symphony", name: "🔊 Click Symphony", condition: () => GameState.clickedInRhythm },
    { id: "pixel-perfect", name: "🖼 Pixel Perfect", condition: () => GameState.clickedHiddenPixel },
    { id: "op-clicker", name: "⚡ OP Clicker", condition: () => GameState.multiplier >= 1000 }
];

// === DOM Elements ===
const scoreDisplay = document.getElementById("score");
const clickBtn = document.getElementById("clicker");
const menuToggle = document.getElementById("menu-toggle");
const menuPopup = document.getElementById("menu-popup");
const menuBox = document.getElementById("menu-box");
const upgradeClickBtn = document.getElementById("upgrade-click");
const upgradeAutoBtn = document.getElementById("upgrade-auto");
const upgradeMultiplierBtn = document.getElementById("upgrade-multiplier");
const costClickDisplay = document.getElementById("cost-click");
const costAutoDisplay = document.getElementById("cost-auto");
const costMultiplierDisplay = document.getElementById("cost-multiplier");
const prestigePointsDisplay = document.getElementById("prestige-points");
const prestigeThresholdDisplay = document.getElementById("prestige-threshold");
const achievementList = document.getElementById("achievement-list");

// Populate menuBox with game buttons
function setupMenuButtons() {
    if (!menuBox) {
        console.error("Menu box not found");
        return;
    }

    const wrongBtn = document.createElement("button");
    wrongBtn.id = "wrong-button";
    wrongBtn.textContent = "Don't Click Me!";
    wrongBtn.classList.add('menu-btn');
    menuBox.appendChild(wrongBtn);

    const errorBtn = document.createElement("button");
    errorBtn.id = "error-button";
    errorBtn.textContent = "Broken Link";
    errorBtn.classList.add('menu-btn');
    errorBtn.addEventListener("click", () => {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        GameState.clickedMissingElement = true;
        GameState.updateDisplay();
        GameState.saveAchievement('error-404');
    });
    menuBox.appendChild(errorBtn);

    const musicToggleBtn = document.createElement("button");
    musicToggleBtn.id = "music-toggle";
    musicToggleBtn.textContent = "Toggle Music";
    musicToggleBtn.classList.add('menu-btn');
    menuBox.appendChild(musicToggleBtn);

    const greenGlowBtn = document.createElement("button");
    greenGlowBtn.id = "green-glow-button";
    greenGlowBtn.textContent = "Glowing Button";
    greenGlowBtn.classList.add('menu-btn', 'hidden');
    menuBox.appendChild(greenGlowBtn);

    const noClickerToggle = document.createElement("button");
    noClickerToggle.id = "no-clicker-toggle";
    noClickerToggle.textContent = "Disable Clicker";
    noClickerToggle.classList.add('menu-btn');
    menuBox.appendChild(noClickerToggle);

    const confettiBtn = document.createElement("button");
    confettiBtn.id = "confetti-button";
    confettiBtn.textContent = "Party Time!";
    confettiBtn.classList.add('menu-btn', 'hidden');
    menuBox.appendChild(confettiBtn);

    const hiddenPixel = document.createElement("div");
    hiddenPixel.id = "hidden-pixel";
    hiddenPixel.style.width = "1px";
    hiddenPixel.style.height = "1px";
    hiddenPixel.style.position = "absolute";
    hiddenPixel.style.left = "50px";
    hiddenPixel.style.top = "50px";
    menuBox.appendChild(hiddenPixel);

    const voidArea = document.createElement("div");
    voidArea.id = "void-area";
    voidArea.textContent = "The Void";
    voidArea.style.width = "100px";
    voidArea.style.height = "100px";
    menuBox.appendChild(voidArea);

    // Add code input field and submit button
    const codeInput = document.createElement("input");
    codeInput.id = "code-input";
    codeInput.type = "text";
    codeInput.placeholder = "Enter secret code";
    codeInput.classList.add('menu-input');
    menuBox.appendChild(codeInput);

    const codeSubmitBtn = document.createElement("button");
    codeSubmitBtn.id = "code-submit";
    codeSubmitBtn.textContent = "Redeem Code";
    codeSubmitBtn.classList.add('menu-btn');
    menuBox.appendChild(codeSubmitBtn);

    // Event Listeners
    wrongBtn.addEventListener("click", () => {
        GameState.clickedWrongButton = true;
        GameState.updateDisplay();
        GameState.saveAchievement('wrong-button');
    });

    musicToggleBtn.addEventListener("click", () => {
        GameState.musicModeActivated = !GameState.musicModeActivated;
        GameState.updateDisplay();
        GameState.saveAchievement('guitar-hero');
    });

    greenGlowBtn.addEventListener("click", () => {
        GameState.clickedGreenGlowButton = true;
        greenGlowBtn.classList.add("hidden");
        GameState.updateDisplay();
        GameState.saveAchievement('radioactive-clicks');
    });

    noClickerToggle.addEventListener("click", () => {
        GameState.toggledClickerOff = !GameState.toggledClickerOff;
        noClickerToggle.textContent = GameState.toggledClickerOff ? "Enable Clicker" : "Disable Clicker";
        GameState.updateDisplay();
        GameState.saveAchievement('no-clicker-mode');
    });

    hiddenPixel.addEventListener("click", () => {
        GameState.clickedHiddenPixel = true;
        GameState.updateDisplay();
        GameState.saveAchievement('hidden-eye');
        GameState.saveAchievement('pixel-perfect');
    });

    confettiBtn.addEventListener("click", () => {
        GameState.confettiModeActivated = true;
        GameState.updateDisplay();
        GameState.saveAchievement('party-clicker');
    });

    codeSubmitBtn.addEventListener("click", () => {
        const code = codeInput.value.trim().toLowerCase();
        if (code) {
            GameState.redeemCode(code);
            codeInput.value = ""; // Clear the input field after submission
        } else {
            alert("Please enter a code!");
        }
    });
}

// Menu Toggle Logic
if (!menuToggle || !menuPopup) {
    console.error("Menu toggle elements not found:", { menuToggle, menuPopup });
} else {
    menuToggle.addEventListener("click", () => {
        console.log("Menu toggle clicked. Current hidden state:", menuPopup.classList.contains("hidden"));
        menuPopup.classList.toggle("hidden");
    });

    menuPopup.addEventListener("click", (event) => {
        if (event.target === menuPopup) {
            console.log("Closing menu by clicking outside. Current hidden state:", menuPopup.classList.contains("hidden"));
            menuPopup.classList.add("hidden");
        }
    });
}

// === Game Logic ===

// Update click rate
function updateClickRate() {
    const now = Date.now();
    const timeDiff = (now - GameState.lastClickTime) / 1000;
    if (timeDiff < 1) {
        GameState.clickRate = 1 / timeDiff;
    } else {
        GameState.clickRate = 0;
    }
    GameState.lastClickTime = now;
}

// Track AFK time
let lastActivity = Date.now();
document.addEventListener("mousemove", () => {
    lastActivity = Date.now();
    GameState.afkTooLong = false;
    GameState.saveAchievement('sleep-mode');
});
document.addEventListener("keydown", () => {
    lastActivity = Date.now();
    GameState.afkTooLong = false;
    GameState.saveAchievement('sleep-mode');
});
setInterval(() => {
    if (Date.now() - lastActivity > 300000) {
        GameState.afkTooLong = true;
        GameState.saveAchievement('sleep-mode');
    }
}, 1000);

// Track rapid clicks
let clickTimestamps = [];
function checkRapidClicks() {
    const now = Date.now();
    clickTimestamps.push(now);
    clickTimestamps = clickTimestamps.filter(t => now - t < 5000);
    if (clickTimestamps.length > 50) {
        GameState.clickedTooFastTooMuch = true;
        GameState.saveAchievement('crash-economy');
    }
}

// Track rhythmic clicks
let clickIntervals = [];
function checkRhythm() {
    const now = Date.now();
    if (clickTimestamps.length > 1) {
        const interval = now - clickTimestamps[clickTimestamps.length - 2];
        clickIntervals.push(interval);
        if (clickIntervals.length > 5) {
            const avg = clickIntervals.reduce((a, b) => a + b, 0) / clickIntervals.length;
            const variance = clickIntervals.reduce((a, b) => a + (b - avg) ** 2, 0) / clickIntervals.length;
            if (variance < 1000) {
                GameState.clickedInRhythm = true;
                GameState.saveAchievement('click-symphony');
            }
            clickIntervals.shift();
        }
    }
}

// Clicking
if (clickBtn) {
    clickBtn.addEventListener("click", () => {
        if (!GameState.toggledClickerOff) {
            const points = GameState.clickPower * GameState.multiplier * GameState.prestigeBoost;
            GameState.score += points;
            GameState.totalClicks++;
            checkRapidClicks();
            checkRhythm();
            updateClickRate();
            GameState.updateDisplay();
            GameState.saveAchievement('first-click');
            GameState.saveAchievement('curious-clicker');
            GameState.saveAchievement('infinite-loop');
            GameState.saveGameState(); // Save the score after each click
        }
    });
}

// Void Area
let hoverStart = 0;
if (document.getElementById("void-area")) {
    document.getElementById("void-area").addEventListener("mouseenter", () => {
        hoverStart = Date.now();
    });
    document.getElementById("void-area").addEventListener("mouseleave", () => {
        hoverStart = 0;
    });
}
setInterval(() => {
    if (hoverStart && Date.now() - hoverStart > 10000) {
        GameState.hoveredTooLongOnVoid = true;
        GameState.updateDisplay();
        GameState.saveAchievement('abyss');
    }
}, 1000);

// Confetti button spawn at high score
setInterval(() => {
    if (GameState.score >= 1e6 && !GameState.confettiModeActivated) {
        const confettiBtn = document.getElementById("confetti-button");
        if (confettiBtn) confettiBtn.classList.remove("hidden");
    }
}, 1000);

// Click Power Upgrade
if (upgradeClickBtn) {
    upgradeClickBtn.addEventListener("click", () => {
        if (GameState.score >= GameState.upgradeClickCost) {
            GameState.score -= GameState.upgradeClickCost;
            GameState.clickPower++;
            GameState.upgradeClickCost = Math.floor(GameState.upgradeClickCost * 1.5);
            checkUpgradeSpeed();
            GameState.updateDisplay();
            GameState.saveGameState();
        }
    });
}

// Auto-Clicker Upgrade
if (upgradeAutoBtn) {
    upgradeAutoBtn.addEventListener("click", () => {
        if (GameState.score >= GameState.upgradeAutoCost) {
            GameState.score -= GameState.upgradeAutoCost;
            GameState.autoClickers++;
            GameState.upgradeAutoCost = Math.floor(GameState.upgradeAutoCost * 1.5);
            checkUpgradeSpeed();
            GameState.updateDisplay();
            GameState.saveGameState();
            GameState.saveAchievement('auto-army');
            GameState.saveAchievement('auto-king');
            GameState.saveAchievement('time-traveler');
            GameState.saveAchievement('factory-owner');
        }
    });
}

// Multiplier Upgrade
if (upgradeMultiplierBtn) {
    upgradeMultiplierBtn.addEventListener("click", () => {
        if (GameState.score >= GameState.upgradeMultiplierCost) {
            GameState.score -= GameState.upgradeMultiplierCost;
            GameState.multiplier *= 2;
            GameState.upgradeMultiplierCost = Math.floor(GameState.upgradeMultiplierCost * 2);
            checkUpgradeSpeed();
            GameState.updateDisplay();
            GameState.saveGameState();
            GameState.saveAchievement('multiplier-madness');
            GameState.saveAchievement('multiplier-overload');
            GameState.saveAchievement('op-clicker');
        }
    });
}

// Track upgrade speed
let lastUpgradeTime = 0;
function checkUpgradeSpeed() {
    const now = Date.now();
    if (now - lastUpgradeTime < 1000) {
        GameState.unlockedTooFast = true;
        GameState.saveAchievement('virus-detected');
    }
    lastUpgradeTime = now;
}

// Auto-clicker interval
setInterval(() => {
    GameState.score += GameState.autoClickers * GameState.multiplier * GameState.prestigeBoost;
    GameState.updateDisplay();
    GameState.saveGameState();
}, 1000);

// Green glow button spawn every 10 seconds (10% chance)
setInterval(() => {
    if (Math.random() < 0.1) {
        const greenGlowBtn = document.getElementById("green-glow-button");
        if (greenGlowBtn) greenGlowBtn.classList.remove("hidden");
    }
}, 10000);

// Secret combo (Konami code)
const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiProgress = 0;
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === konamiCode[konamiProgress]) {
        konamiProgress++;
        if (konamiProgress === konamiCode.length) {
            GameState.redeemCode('konami'); // Use redeemCode to handle one-time usage
            konamiProgress = 0;
        }
    } else {
        konamiProgress = 0;
    }
});

// Format score
function formatScore(number) {
    const units = [
        { value: 1e10000, symbol: "X" },
        { value: 1e1000, symbol: "W" },
        { value: 10 ** (10 ** 100), symbol: "DB" },
        { value: 1e303, symbol: "Ct" },
        { value: 1e300, symbol: "Uc" },
        { value: 1e297, symbol: "Nc" },
        { value: 1e294, symbol: "Og" },
        { value: 1e291, symbol: "Sg" },
        { value: 1e288, symbol: "Hg" },
        { value: 1e285, symbol: "Pg" },
        { value: 1e282, symbol: "Qg" },
        { value: 1e279, symbol: "Rg" },
        { value: 1e276, symbol: "Vc" },
        { value: 1e273, symbol: "Un" },
        { value: 1e270, symbol: "Dc" },
        { value: 1e267, symbol: "Nn" },
        { value: 1e264, symbol: "Oc" },
        { value: 1e261, symbol: "Sp" },
        { value: 1e258, symbol: "Sx" },
        { value: 1e255, symbol: "Qi" },
        { value: 1e252, symbol: "Qd" },
        { value: 1e249, symbol: "Td" },
        { value: 1e246, symbol: "Bd" },
        { value: 1e243, symbol: "Md" },
        { value: 1e240, symbol: "Ud" },
        { value: 1e237, symbol: "Dd" },
        { value: 1e234, symbol: "Tr" },
        { value: 1e231, symbol: "Qt" },
        { value: 1e228, symbol: "Pd" },
        { value: 1e225, symbol: "Sd" },
        { value: 1e222, symbol: "St" },
        { value: 1e219, symbol: "Od" },
        { value: 1e216, symbol: "Nd" },
        { value: 1e213, symbol: "Vg" },
        { value: 1e210, symbol: "Uv" },
        { value: 1e207, symbol: "Dv" },
        { value: 1e204, symbol: "Tv" },
        { value: 1e201, symbol: "Qv" },
        { value: 1e198, symbol: "Pv" },
        { value: 1e195, symbol: "Sv" },
        { value: 1e192, symbol: "Se" },
        { value: 1e189, symbol: "Ov" },
        { value: 1e186, symbol: "Nv" },
        { value: 1e183, symbol: "Tg" },
        { value: 1e180, symbol: "Ut" },
        { value: 1e177, symbol: "De" },
        { value: 1e174, symbol: "No" },
        { value: 1e171, symbol: "Ot" },
        { value: 1e168, symbol: "Sn" },
        { value: 1e165, symbol: "Si" },
        { value: 1e162, symbol: "Qn" },
        { value: 1e159, symbol: "Qu" },
        { value: 1e156, symbol: "Tn" },
        { value: 1e153, symbol: "Bn" },
        { value: 1e150, symbol: "Mn" },
        { value: 1e147, symbol: "U" },
        { value: 1e144, symbol: "D" },
        { value: 1e141, symbol: "T" },
        { value: 1e138, symbol: "Q" },
        { value: 1e135, symbol: "P" },
        { value: 1e132, symbol: "S" },
        { value: 1e129, symbol: "E" },
        { value: 1e126, symbol: "O" },
        { value: 1e123, symbol: "N" },
        { value: 1e120, symbol: "V" },
        { value: 1e117, symbol: "Uv" },
        { value: 1e114, symbol: "Dv" },
        { value: 1e111, symbol: "Tv" },
        { value: 1e108, symbol: "Qv" },
        { value: 1e105, symbol: "Pv" },
        { value: 1e102, symbol: "Sv" },
        { value: 1e100, symbol: "G" },
        { value: 1e96, symbol: "Ud" },
        { value: 1e93, symbol: "Dd" },
        { value: 1e90, symbol: "Td" },
        { value: 1e87, symbol: "Qd" },
        { value: 1e84, symbol: "Pd" },
        { value: 1e81, symbol: "Sd" },
        { value: 1e78, symbol: "St" },
        { value: 1e75, symbol: "Od" },
        { value: 1e72, symbol: "Nd" },
        { value: 1e69, symbol: "Vg" },
        { value: 1e66, symbol: "Uv" },
        { value: 1e63, symbol: "Dv" },
        { value: 1e60, symbol: "Tv" },
        { value: 1e57, symbol: "Qv" },
        { value: 1e54, symbol: "Pv" },
        { value: 1e51, symbol: "Sv" },
        { value: 1e48, symbol: "Se" },
        { value: 1e45, symbol: "Ov" },
        { value: 1e42, symbol: "Nv" },
        { value: 1e39, symbol: "Tg" },
        { value: 1e36, symbol: "Ut" },
        { value: 1e33, symbol: "De" },
        { value: 1e30, symbol: "No" },
        { value: 1e27, symbol: "Oc" },
        { value: 1e24, symbol: "Sp" },
        { value: 1e21, symbol: "Sx" },
        { value: 1e18, symbol: "Qi" },
        { value: 1e15, symbol: "Qd" },
        { value: 1e12, symbol: "Td" },
        { value: 1e9, symbol: "Bd" },
        { value: 1e6, symbol: "M" },
    ];
    for (const unit of units) {
        if (number >= unit.value) {
            return (number / unit.value).toFixed(1).replace(/\.0$/, "") + unit.symbol;
        }
    }
    return Math.floor(number).toString();
}

// Check Achievements
function checkAchievements() {
    window.achievements.forEach(ach => {
        if (ach.condition() && !GameState.achievements.includes(ach.id)) {
            GameState.achievements.push(ach.id);
            GameState.saveAchievement(ach.id);
            console.log(`Achievement unlocked: ${ach.name} (ID: ${ach.id})`);
        }
    });
}

// Re-evaluate Achievements on Load
function reEvaluateAchievements() {
    if (achievementList) {
        achievementList.innerHTML = '';
        window.GameState.achievements.forEach(achId => {
            const ach = window.achievements.find(a => a.id === achId);
            if (ach) {
                const item = document.createElement("li");
                item.id = ach.id;
                item.textContent = ach.name;
                item.classList.add("achievement-unlocked");
                achievementList.appendChild(item);
            } else {
                console.warn(`Achievement with ID ${achId} not found in window.achievements`);
            }
        });
    }
}

// Achievement button
const achievementsButton = document.getElementById("achievements-button");
if (achievementsButton) {
    achievementsButton.addEventListener("click", () => {
        GameState.saveGameState(); // Ensure state is saved before redirect
        window.location.href = "achivement/achievements.html";
    });
}

// Initialize menu buttons and game state
setupMenuButtons();
GameState.updateDisplay();
reEvaluateAchievements();