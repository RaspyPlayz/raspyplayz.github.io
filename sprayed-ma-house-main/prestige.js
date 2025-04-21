// === Prestige Logic ===
const prestigeBtn = document.getElementById('prestige-btn');
const prestigeMessage = document.getElementById('prestige-message');
const prestigeConfirmPopup = document.getElementById('prestige-confirm-popup');
const confirmPrestigeBtn = document.getElementById('confirm-prestige');
const cancelPrestigeBtn = document.getElementById('cancel-prestige');

// Debug: Check if elements exist
if (prestigeBtn) {
    console.log('Prestige button found in DOM:', prestigeBtn);
} else {
    console.error('Prestige button not found! Check if element with id="prestige-btn" exists in index.html');
}

if (prestigeMessage) {
    console.log('Prestige message found in DOM:', prestigeMessage);
} else {
    console.warn('Prestige message not found! Confirmation message will not display after prestiging.');
}

if (prestigeConfirmPopup && confirmPrestigeBtn && cancelPrestigeBtn) {
    console.log('Prestige confirmation popup elements found.');
} else {
    console.error('Prestige confirmation popup elements missing! Check index.html for id="prestige-confirm-popup", id="confirm-prestige", and id="cancel-prestige".');
}

// Check if prestige is available
function checkPrestige() {
    console.log(`Checking prestige: score=${GameState.score}, threshold=${GameState.prestigeThreshold}`);
    if (GameState.score >= GameState.prestigeThreshold) {
        console.log('Prestige available! Showing prestige button.');
        if (prestigeBtn) {
            prestigeBtn.classList.remove('hidden');
            // Ensure visibility
            prestigeBtn.style.display = 'block';
            prestigeBtn.style.visibility = 'visible';
            console.log('Prestige button styles after showing:', {
                display: prestigeBtn.style.display,
                visibility: prestigeBtn.style.visibility,
                computedStyle: window.getComputedStyle(prestigeBtn).display
            });
        }
    } else {
        console.log('Prestige not available. Hiding prestige button.');
        if (prestigeBtn) {
            prestigeBtn.classList.add('hidden');
            prestigeBtn.style.display = 'none';
        }
    }
}

// Apply prestige scaling
window.applyPrestigeScaling = function () {
    GameState.prestigeBoost = 1 + (GameState.prestigePoints * 0.1);
    console.log(`Prestige scaling applied: prestigePoints=${GameState.prestigePoints}, prestigeBoost=${GameState.prestigeBoost}`);
};

// Prestige action
function prestige() {
    console.log('Prestige triggered!');
    GameState.prestigePoints += Math.floor(GameState.score / GameState.prestigeThreshold);
    console.log(`Prestige points updated: ${GameState.prestigePoints}`);

    // Reset game state
    GameState.score = 0;
    GameState.clickPower = 1;
    GameState.autoClickers = 0;
    GameState.multiplier = 1;
    GameState.totalClicks = 0;
    GameState.upgradeClickCost = 10;
    GameState.upgradeAutoCost = 50;
    GameState.upgradeMultiplierCost = 100;
    GameState.prestigeThreshold = Math.floor(GameState.prestigeThreshold * 1.5);
    console.log(`New prestige threshold: ${GameState.prestigeThreshold}`);

    applyPrestigeScaling();
    GameState.updateDisplay();
    GameState.saveGameState(); // Save the new state to Firebase
    if (prestigeBtn) {
        prestigeBtn.classList.add('hidden');
        prestigeBtn.style.display = 'none';
    }

    // Hide the confirmation popup
    if (prestigeConfirmPopup) {
        prestigeConfirmPopup.classList.add('hidden');
    }

    // Show prestige message
    if (prestigeMessage) {
        prestigeMessage.classList.remove('hidden');
        setTimeout(() => {
            prestigeMessage.classList.add('hidden');
        }, 3000);
    }
}

// Event listener for prestige button (show confirmation popup)
if (prestigeBtn) {
    prestigeBtn.addEventListener('click', () => {
        console.log(`Prestige button clicked: score=${GameState.score}, threshold=${GameState.prestigeThreshold}`);
        if (GameState.score >= GameState.prestigeThreshold) {
            if (prestigeConfirmPopup) {
                prestigeConfirmPopup.classList.remove('hidden');
            } else {
                console.warn('Prestige confirmation popup not found, proceeding directly to prestige.');
                prestige();
            }
        } else {
            console.log('Cannot prestige: Score below threshold.');
        }
    });
}

// Event listener for confirm prestige
if (confirmPrestigeBtn) {
    confirmPrestigeBtn.addEventListener('click', () => {
        console.log('Confirm prestige clicked.');
        prestige();
    });
}

// Event listener for cancel prestige
if (cancelPrestigeBtn) {
    cancelPrestigeBtn.addEventListener('click', () => {
        console.log('Cancel prestige clicked.');
        if (prestigeConfirmPopup) {
            prestigeConfirmPopup.classList.add('hidden');
        }
    });
}

// Periodically check for prestige availability
setInterval(checkPrestige, 1000);