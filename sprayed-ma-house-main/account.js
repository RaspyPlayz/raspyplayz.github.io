import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXjVbJ3GGfaQqiICdHU055xaRyj2-axCA",
    authDomain: "jefferina-clicker.firebaseapp.com",
    projectId: "jefferina-clicker",
    storageBucket: "jefferina-clicker.firebasestorage.app",
    messagingSenderId: "633664881263",
    appId: "1:633664881263:web:2f32aeff06932a785c439a",
    measurementId: "G-QDGQT525NG",
    databaseURL: "https://jefferina-clicker-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// DOM Elements
const gameContainer = document.querySelector('.game-container');
const menuBox = document.getElementById('menu-box');
const leaderboardList = document.getElementById('leaderboard-list');
const leaderboardDisplay = document.getElementById('leaderboard-display');
const closeLeaderboardBtn = document.getElementById('close-leaderboard');

// Authentication State
let currentUser = null;
let lastAchievements = []; // Track the last known achievements to prevent unnecessary UI updates

// Hide game until auth resolves
if (gameContainer) {
    gameContainer.classList.add('hidden');
} else {
    console.error('Game container not found');
}

// Ensure leaderboard is hidden on load
if (leaderboardDisplay) {
    leaderboardDisplay.classList.add('hidden');
}

// Debounce utility
function debounce(fn, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
    };
}

// Immediate save function (no debounce)
function saveGameStateImmediate() {
    if (!currentUser) {
        console.warn('Cannot save game state: No user logged in');
        return;
    }
    const userData = {
        score: window.GameState.score,
        clickPower: window.GameState.clickPower,
        autoClickers: window.GameState.autoClickers,
        multiplier: window.GameState.multiplier,
        totalClicks: window.GameState.totalClicks,
        upgradeClickCost: window.GameState.upgradeClickCost,
        upgradeAutoCost: window.GameState.upgradeAutoCost,
        upgradeMultiplierCost: window.GameState.upgradeMultiplierCost,
        prestigePoints: window.GameState.prestigePoints,
        prestigeThreshold: window.GameState.prestigeThreshold,
        prestigeBoost: window.GameState.prestigeBoost,
        clickedWrongButton: window.GameState.clickedWrongButton,
        clickedMissingElement: window.GameState.clickedMissingElement,
        musicModeActivated: window.GameState.musicModeActivated,
        clickedTooFastTooMuch: window.GameState.clickedTooFastTooMuch,
        usedSecretCombo: window.GameState.usedSecretCombo,
        unlockedTooFast: window.GameState.unlockedTooFast,
        clickedGreenGlowButton: window.GameState.clickedGreenGlowButton,
        enteredSecretCode: window.GameState.enteredSecretCode,
        afkTooLong: window.GameState.afkTooLong,
        toggledClickerOff: window.GameState.toggledClickerOff,
        clickedHiddenPixel: window.GameState.clickedHiddenPixel,
        hoveredTooLongOnVoid: window.GameState.hoveredTooLongOnVoid,
        confettiModeActivated: window.GameState.confettiModeActivated,
        clickedInRhythm: window.GameState.clickedInRhythm,
        hasBonusCode: window.GameState.hasBonusCode,
        isSuperCharged: window.GameState.isSuperCharged,
        achievements: window.GameState.achievements,
        usedCodes: window.GameState.usedCodes // Add usedCodes
    };
    return set(ref(database, 'users/' + currentUser.uid), userData)
        .then(() => {
            console.log('Game state saved immediately');
            updateLeaderboardScore(currentUser.uid, window.GameState.score, currentUser.email);
        })
        .catch((error) => {
            console.error('Failed to save game state immediately:', error);
        });
}

// Add authentication UI to menu
function setupAuthUI() {
    if (!menuBox) {
        console.error('Menu box not found');
        return;
    }

    // Clear existing auth-related menu content to prevent duplicates
    const authElements = menuBox.querySelectorAll('.auth-element');
    authElements.forEach(element => element.remove());

    if (currentUser) {
        const userInfo = document.createElement('p');
        userInfo.textContent = `Logged in as: ${currentUser.email}`;
        userInfo.classList.add('auth-element');
        menuBox.insertBefore(userInfo, menuBox.firstChild);

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.classList.add('menu-btn', 'auth-element');
        logoutBtn.addEventListener('click', logout);
        menuBox.insertBefore(logoutBtn, menuBox.firstChild);

        const leaderboardBtn = document.createElement('button');
        leaderboardBtn.textContent = 'View Leaderboard';
        leaderboardBtn.classList.add('menu-btn', 'auth-element');
        leaderboardBtn.addEventListener('click', showLeaderboard);
        menuBox.insertBefore(leaderboardBtn, menuBox.firstChild);
    } else {
        const loginEmail = document.createElement('input');
        loginEmail.id = 'login-email';
        loginEmail.type = 'email';
        loginEmail.placeholder = 'Email';
        loginEmail.classList.add('menu-input', 'auth-element');
        menuBox.insertBefore(loginEmail, menuBox.firstChild);

        const loginPassword = document.createElement('input');
        loginPassword.id = 'login-password';
        loginPassword.type = 'password';
        loginPassword.placeholder = 'Password';
        loginPassword.classList.add('menu-input', 'auth-element');
        menuBox.insertBefore(loginPassword, menuBox.firstChild);

        const loginBtn = document.createElement('button');
        loginBtn.textContent = 'Login';
        loginBtn.classList.add('menu-btn', 'auth-element');
        loginBtn.addEventListener('click', login);
        menuBox.insertBefore(loginBtn, menuBox.firstChild);

        const registerBtn = document.createElement('button');
        registerBtn.textContent = 'Register';
        registerBtn.classList.add('menu-btn', 'auth-element');
        registerBtn.addEventListener('click', register);
        menuBox.insertBefore(registerBtn, menuBox.firstChild);
    }
}

// Login Function
function login() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    if (!emailInput || !passwordInput) {
        alert('Input fields not found');
        return;
    }
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            window.GameState.userId = currentUser.uid;
            loadGameState();
            setupAuthUI();
            if (gameContainer) gameContainer.classList.remove('hidden');
        })
        .catch((error) => {
            console.error('Login error:', error.code, error.message);
            alert(`Login failed: ${error.message} (Code: ${error.code})`);
        });
}

// Register Function
function register() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    if (!emailInput || !passwordInput) {
        alert('Input fields not found');
        return;
    }
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            window.GameState.userId = currentUser.uid;
            saveGameStateImmediate(); // Use immediate save for registration
            setupAuthUI();
            if (gameContainer) gameContainer.classList.remove('hidden');
            alert('Registration successful!');
        })
        .catch((error) => {
            console.error('Registration error:', error.code, error.message);
            alert(`Registration failed: ${error.message} (Code: ${error.code})`);
        });
}

// Logout Function
function logout() {
    signOut(auth).then(() => {
        currentUser = null;
        window.GameState.userId = null;
        resetGameState();
        setupAuthUI();
        if (gameContainer) gameContainer.classList.add('hidden');
    }).catch((error) => {
        console.error('Logout error:', error.code, error.message);
        alert(`Logout failed: ${error.message} (Code: ${error.code})`);
    });
}

// Update Achievements UI
function updateAchievementsUI(newAchievements) {
    const achievementList = document.getElementById('achievement-list');
    if (!achievementList) return;

    // Check if the achievements array has changed
    const achievementsChanged = JSON.stringify(newAchievements) !== JSON.stringify(lastAchievements);
    if (!achievementsChanged) {
        console.log('Achievements unchanged, skipping UI update');
        return;
    }

    console.log('Achievements changed, updating UI');
    lastAchievements = [...newAchievements]; // Update the last known achievements

    achievementList.innerHTML = ''; // Clear the list
    if (window.achievements && Array.isArray(window.achievements)) {
        newAchievements.forEach(achId => {
            const ach = window.achievements.find(a => a.id === achId);
            if (ach) {
                const item = document.createElement('li');
                item.id = ach.id;
                item.textContent = ach.name;
                item.classList.add('achievement-unlocked');
                achievementList.appendChild(item);
            } else {
                console.warn(`Achievement with ID ${achId} not found in window.achievements`);
            }
        });
    } else {
        console.warn('window.achievements is undefined or not an array');
    }
}

// Save Game State to Firebase (debounced)
window.GameState.saveGameState = debounce(function () {
    if (!currentUser) {
        console.warn('Cannot save game state: No user logged in');
        return;
    }
    const userData = {
        score: window.GameState.score,
        clickPower: window.GameState.clickPower,
        autoClickers: window.GameState.autoClickers,
        multiplier: window.GameState.multiplier,
        totalClicks: window.GameState.totalClicks,
        upgradeClickCost: window.GameState.upgradeClickCost,
        upgradeAutoCost: window.GameState.upgradeAutoCost,
        upgradeMultiplierCost: window.GameState.upgradeMultiplierCost,
        prestigePoints: window.GameState.prestigePoints,
        prestigeThreshold: window.GameState.prestigeThreshold,
        prestigeBoost: window.GameState.prestigeBoost,
        clickedWrongButton: window.GameState.clickedWrongButton,
        clickedMissingElement: window.GameState.clickedMissingElement,
        musicModeActivated: window.GameState.musicModeActivated,
        clickedTooFastTooMuch: window.GameState.clickedTooFastTooMuch,
        usedSecretCombo: window.GameState.usedSecretCombo,
        unlockedTooFast: window.GameState.unlockedTooFast,
        clickedGreenGlowButton: window.GameState.clickedGreenGlowButton,
        enteredSecretCode: window.GameState.enteredSecretCode,
        afkTooLong: window.GameState.afkTooLong,
        toggledClickerOff: window.GameState.toggledClickerOff,
        clickedHiddenPixel: window.GameState.clickedHiddenPixel,
        hoveredTooLongOnVoid: window.GameState.hoveredTooLongOnVoid,
        confettiModeActivated: window.GameState.confettiModeActivated,
        clickedInRhythm: window.GameState.clickedInRhythm,
        hasBonusCode: window.GameState.hasBonusCode,
        isSuperCharged: window.GameState.isSuperCharged,
        achievements: window.GameState.achievements,
        usedCodes: window.GameState.usedCodes // Add usedCodes
    };
    set(ref(database, 'users/' + currentUser.uid), userData)
        .then(() => {
            console.log('Game state saved successfully');
            updateLeaderboardScore(currentUser.uid, window.GameState.score, currentUser.email);
        })
        .catch((error) => {
            console.error('Failed to save game state:', error);
        });
}, 500);

// Save Achievement Immediately
window.GameState.saveAchievement = function (achId) {
    if (!currentUser) {
        console.warn('Cannot save achievement: No user logged in');
        return;
    }
    if (!window.GameState.achievements.includes(achId)) {
        window.GameState.achievements.push(achId);
        const userData = {
            score: window.GameState.score,
            clickPower: window.GameState.clickPower,
            autoClickers: window.GameState.autoClickers,
            multiplier: window.GameState.multiplier,
            totalClicks: window.GameState.totalClicks,
            upgradeClickCost: window.GameState.upgradeClickCost,
            upgradeAutoCost: window.GameState.upgradeAutoCost,
            upgradeMultiplierCost: window.GameState.upgradeMultiplierCost,
            prestigePoints: window.GameState.prestigePoints,
            prestigeThreshold: window.GameState.prestigeThreshold,
            prestigeBoost: window.GameState.prestigeBoost,
            clickedWrongButton: window.GameState.clickedWrongButton,
            clickedMissingElement: window.GameState.clickedMissingElement,
            musicModeActivated: window.GameState.musicModeActivated,
            clickedTooFastTooMuch: window.GameState.clickedTooFastTooMuch,
            usedSecretCombo: window.GameState.usedSecretCombo,
            unlockedTooFast: window.GameState.unlockedTooFast,
            clickedGreenGlowButton: window.GameState.clickedGreenGlowButton,
            enteredSecretCode: window.GameState.enteredSecretCode,
            afkTooLong: window.GameState.afkTooLong,
            toggledClickerOff: window.GameState.toggledClickerOff,
            clickedHiddenPixel: window.GameState.clickedHiddenPixel,
            hoveredTooLongOnVoid: window.GameState.hoveredTooLongOnVoid,
            confettiModeActivated: window.GameState.confettiModeActivated,
            clickedInRhythm: window.GameState.clickedInRhythm,
            hasBonusCode: window.GameState.hasBonusCode,
            isSuperCharged: window.GameState.isSuperCharged,
            achievements: window.GameState.achievements,
            usedCodes: window.GameState.usedCodes // Add usedCodes
        };
        set(ref(database, 'users/' + currentUser.uid), userData)
            .then(() => {
                console.log(`Achievement ${achId} saved successfully`);
                updateLeaderboardScore(currentUser.uid, window.GameState.score, currentUser.email);
                // Update UI immediately
                updateAchievementsUI(window.GameState.achievements);
            })
            .catch((error) => {
                console.error(`Failed to save achievement ${achId}:`, error);
            });
    }
};

// Load Game State from Firebase
function loadGameState() {
    if (!currentUser) return;

    // Check local storage backup
    const backup = localStorage.getItem('jefferina-clicker-backup');
    if (backup) {
        const parsed = JSON.parse(backup);
        if (parsed.userId === currentUser.uid) {
            Object.assign(window.GameState, parsed.gameState);
            window.GameState.updateDisplay();
            updateAchievementsUI(window.GameState.achievements); // Initial UI update from backup
        }
    }

    const userRef = ref(database, 'users/' + currentUser.uid);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            window.GameState.score = data.score || 0;
            window.GameState.clickPower = data.clickPower || 1;
            window.GameState.autoClickers = data.autoClickers || 0;
            window.GameState.multiplier = data.multiplier || 1;
            window.GameState.totalClicks = data.totalClicks || 0;
            window.GameState.upgradeClickCost = data.upgradeClickCost || 10;
            window.GameState.upgradeAutoCost = data.upgradeAutoCost || 50;
            window.GameState.upgradeMultiplierCost = data.upgradeMultiplierCost || 100;
            window.GameState.prestigePoints = data.prestigePoints || 0;
            window.GameState.prestigeThreshold = data.prestigeThreshold || 1000000;
            window.GameState.prestigeBoost = data.prestigeBoost || 1;
            window.GameState.clickedWrongButton = data.clickedWrongButton || false;
            window.GameState.clickedMissingElement = data.clickedMissingElement || false;
            window.GameState.musicModeActivated = data.musicModeActivated || false;
            window.GameState.clickedTooFastTooMuch = data.clickedTooFastTooMuch || false;
            window.GameState.usedSecretCombo = data.usedSecretCombo || false;
            window.GameState.unlockedTooFast = data.unlockedTooFast || false;
            window.GameState.clickedGreenGlowButton = data.clickedGreenGlowButton || false;
            window.GameState.enteredSecretCode = data.enteredSecretCode || false;
            window.GameState.afkTooLong = data.afkTooLong || false;
            window.GameState.toggledClickerOff = data.toggledClickerOff || false;
            window.GameState.clickedHiddenPixel = data.clickedHiddenPixel || false;
            window.GameState.hoveredTooLongOnVoid = data.hoveredTooLongOnVoid || false;
            window.GameState.confettiModeActivated = data.confettiModeActivated || false;
            window.GameState.clickedInRhythm = data.clickedInRhythm || false;
            window.GameState.hasBonusCode = data.hasBonusCode || false;
            window.GameState.isSuperCharged = data.isSuperCharged || false;
            window.GameState.achievements = data.achievements || [];
            window.GameState.usedCodes = data.usedCodes || []; // Load usedCodes

            updateAchievementsUI(window.GameState.achievements); // Update UI only if achievements changed

            if (window.applyPrestigeScaling) {
                window.applyPrestigeScaling();
            }
            window.GameState.updateDisplay();
            // Clear backup after successful load
            localStorage.removeItem('jefferina-clicker-backup');
        }
    }, (error) => {
        console.error('Failed to load game state:', error);
    });
}

// Reset Game State
function resetGameState() {
    window.GameState.score = 0;
    window.GameState.clickPower = 1;
    window.GameState.autoClickers = 0;
    window.GameState.multiplier = 1;
    window.GameState.totalClicks = 0;
    window.GameState.upgradeClickCost = 10;
    window.GameState.upgradeAutoCost = 50;
    window.GameState.upgradeMultiplierCost = 100;
    window.GameState.prestigePoints = 0;
    window.GameState.prestigeThreshold = 1000000;
    window.GameState.prestigeBoost = 1;
    window.GameState.clickedWrongButton = false;
    window.GameState.clickedMissingElement = false;
    window.GameState.musicModeActivated = false;
    window.GameState.clickedTooFastTooMuch = false;
    window.GameState.usedSecretCombo = false;
    window.GameState.unlockedTooFast = false;
    window.GameState.clickedGreenGlowButton = false;
    window.GameState.enteredSecretCode = false;
    window.GameState.afkTooLong = false;
    window.GameState.toggledClickerOff = false;
    window.GameState.clickedHiddenPixel = false;
    window.GameState.hoveredTooLongOnVoid = false;
    window.GameState.confettiModeActivated = false;
    window.GameState.clickedInRhythm = false;
    window.GameState.hasBonusCode = false;
    window.GameState.isSuperCharged = false;
    window.GameState.achievements = [];
    window.GameState.usedCodes = []; // Reset usedCodes
    if (window.applyPrestigeScaling) {
        window.applyPrestigeScaling();
    }
    window.GameState.updateDisplay();
    updateAchievementsUI(window.GameState.achievements); // Update UI after reset
}

// Update Leaderboard Score
function updateLeaderboardScore(userId, score, email) {
    set(ref(database, 'leaderboard/' + userId), {
        email: email,
        score: score
    }).catch((error) => {
        console.error('Failed to update leaderboard:', error);
    });
}

// Show Leaderboard
function showLeaderboard() {
    if (!leaderboardList || !leaderboardDisplay) {
        console.error('Leaderboard elements not found');
        return;
    }
    leaderboardList.innerHTML = '';
    const leaderboardRef = ref(database, 'leaderboard');
    onValue(leaderboardRef, (snapshot) => {
        const scores = [];
        snapshot.forEach((child) => {
            scores.push(child.val());
        });
        scores.sort((a, b) => b.score - a.score).slice(0, 10).forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${entry.email}: ${formatScore(entry.score)}`;
            leaderboardList.appendChild(li);
        });
        leaderboardDisplay.classList.remove('hidden');
    }, { onlyOnce: true });
}

// Format Score for Display
function formatScore(score) {
    if (score >= 1e6) {
        return (score / 1e6).toFixed(2) + 'M';
    } else if (score >= 1e3) {
        return (score / 1e3).toFixed(2) + 'K';
    }
    return score.toString();
}

// Close Leaderboard
if (closeLeaderboardBtn) {
    closeLeaderboardBtn.addEventListener('click', () => {
        if (leaderboardDisplay) {
            console.log('Closing leaderboard');
            leaderboardDisplay.classList.add('hidden');
        }
    });
} else {
    console.error('Close leaderboard button not found');
}

// Firebase Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        window.GameState.userId = user.uid;
        loadGameState();
        if (gameContainer) {
            gameContainer.classList.remove('hidden');
            console.log('Game container shown for user:', user.uid);
        }
    } else {
        currentUser = null;
        window.GameState.userId = null;
        resetGameState();
        if (gameContainer) {
            gameContainer.classList.add('hidden');
            console.log('Game container hidden: No user');
        }
    }
    setupAuthUI();
    const loadingIndicator = document.getElementById('loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
});

// Save on page unload with immediate save
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        localStorage.setItem('jefferina-clicker-backup', JSON.stringify({
            userId: currentUser.uid,
            gameState: window.GameState
        }));
        saveGameStateImmediate();
    }
});