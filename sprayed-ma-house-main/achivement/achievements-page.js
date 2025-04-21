const achievements = [
    { id: "first-click", name: "🖱 First Click", description: "Click once." },
    { id: "sixty-nine", name: "💋 69 Nice", description: "Get exactly 69 score." },
    { id: "hundred-score", name: "💯 100 Points!", description: "Reach 100 score." },
    { id: "four-twenty", name: "🌿 420 Blaze It", description: "Hit a score of 420." },
    { id: "anniversary", name: "🎉 Happy Anniversary", description: "The Jefferina Maverick Server Launch" },
    { id: "auto-army", name: "⚡ Auto Army", description: "Own at least 5 autoclickers." },
    { id: "multiplier-madness", name: "✖️ Multiplier Madness", description: "Get a click multiplier of 3 or higher." },
    { id: "golden-touch", name: "✨ Golden Touch", description: "Reach 50 score to unlock golden power." },
    { id: "wealthy-player", name: "💰 Wealthy Player", description: "Reach 10,000 score." },
    { id: "click-commander", name: "🎖 Click Commander", description: "Earn 1,000 total score." },
    { id: "millionaire", name: "🏆 Millionaire", description: "Earn 1,000,000 score." },
    { id: "fast-fingers", name: "🚀 Fast Fingers", description: "Reach 10,000 score quickly." },
    { id: "auto-king", name: "🤖 Auto King", description: "Own 50 autoclickers." },
    { id: "multiplier-overload", name: "🔥 Multiplier Overload", description: "Get a multiplier of 10." },
    { id: "golden-legend", name: "👑 Golden Legend", description: "Reach 500 score while glowing." },
    { id: "billionaire", name: "💎 Billionaire", description: "Reach 1,000,000,000 score." },
    { id: "click-overlord", name: "🏅 Click Overlord", description: "Reach 1,000,000 score." },
    { id: "trillionaire", name: "🏦 Trillionaire", description: "Reach 1 trillion score." },
    { id: "unstoppable-clicker", name: "💥 Unstoppable Clicker", description: "Reach 10,000,000 score." },
    { id: "golden-god", name: "🌟 Golden God", description: "Score 5,000 with golden boost." },
    { id: "quadrillionaire", name: "🏰 Quadrillionaire", description: "Score 1 quadrillion." },
    { id: "time-traveler", name: "⏳ Time Traveler", description: "Own 500 autoclickers." },
    { id: "upgrade-specialist", name: "🛠 Upgrade Specialist", description: "Buy tons of upgrades." },
    { id: "factory-owner", name: "🏭 Factory Owner", description: "Own 100 autoclickers." },
    { id: "global-clicker", name: "🌎 Global Clicker", description: "Reach 1 sextillion score." },
    { id: "jackpot", name: "🎰 Jackpot!", description: "Win big from a spin!" },
    { id: "alien-clicker", name: "🛸 Alien Clicker", description: "Reach 1e24 score." },
    { id: "galactic-clicker", name: "🌌 Galactic Clicker", description: "Reach 1e27 score." },
    { id: "ultimate-clicker", name: "🏆 Ultimate Clicker", description: "Reach 1e30 score." },
    { id: "richer-than-a-country", name: "💵 Richer than a Country", description: "Reach 1e33 score." },
    { id: "infinite-clicker", name: "☠️ Infinite Clicker", description: "Reach 1e36 score." },
    { id: "final-click", name: "🔲 The Final Click", description: "Reach infinite score... somehow." },
    { id: "destroyer-of-keyboards", name: "💀 Destroyer of Keyboards", description: "Reach 1e28 score." },
    { id: "intergalactic-clicker", name: "🛸 Intergalactic Clicker", description: "Reach 1e100 score." },
    { id: "exponential-growth", name: "📈 Exponential Growth", description: "Reach an exponentially high score of 1e150." },
    { id: "diamond-hands", name: "💎 Diamond Hands", description: "Hold on to reach 1e100 score." },
    { id: "rhythm-clicker", name: "🎼 Rhythm Clicker", description: "Click to the beat for a massive score." }, // Updated from new list
    { id: "timeless-clicks", name: "⏳ Timeless Clicks", description: "Click beyond time to reach 1e100 score." },
    { id: "click-speedrun", name: "🚀 Click Speedrun", description: "Speed through to 1e100 score." },
    { id: "god-of-clicks", name: "🔱 God of Clicks", description: "Ascend to click divinity at 1e100 score." },
    { id: "beyond-reality", name: "🌀 Beyond Reality", description: "Transcend reality with 1e100 score." },
    { id: "clicker-legend", name: "👾 Clicker Legend", description: "Become a legend with 1e100 score." },
    { id: "old-school-clicker", name: "🕹 Old School Clicker", description: "Click like it’s the old days to 1e100 score." },
    { id: "click-king", name: "👑 Click King", description: "Rule the clicks with 1e100 score." },
    { id: "keyboard-annihilator", name: "☠️ Keyboard Annihilator", description: "Destroy your keyboard reaching 1e100 score." },
    { id: "engineer-of-clicks", name: "🛠 Engineer of Clicks", description: "Engineer a score of 1e100." },
    { id: "memory-leak", name: "💾 Memory Leak", description: "Overflow the system with 1e100 score." },
    { id: "curious-clicker", name: "🕵️ Curious Clicker", description: "Click while the game is hidden." },
    { id: "wrong-button", name: "🚪 Click the Wrong Button", description: "Click the wrong thing." },
    { id: "slow-but-steady", name: "🐢 Slow but Steady", description: "Slow and steady wins the game." },
    { id: "error-404", name: "⚠️ Error 404", description: "Click a missing button." },
    { id: "guitar-hero", name: "🎸 Guitar Hero", description: "Enter music mode." },
    { id: "crash-economy", name: "📉 Crash the Economy", description: "Click too fast." },
    { id: "magician", name: "🎩 The Magician", description: "Use a secret combo." },
    { id: "bird-clicker", name: "🐦 Bird Clicker", description: "Click a golden bird." },
    { id: "hacker", name: "🕶 The Hacker", description: "Open dev tools." },
    { id: "virus-detected", name: "🦠 Virus Detected", description: "Unlock too many too fast." },
    { id: "radioactive-clicks", name: "📡 Radioactive Clicks", description: "Click a glowing button." },
    { id: "secret-code", name: "🔑 Secret Code", description: "Type in the secret code." },
    { id: "sleep-mode", name: "💤 Sleep Mode", description: "Stay AFK too long." },
    { id: "final-boss", name: "🐉 The Final Boss", description: "Beat all challenges." },
    { id: "no-clicker-mode", name: "🚫 No Clicker Mode", description: "Disable clicking." },
    { id: "fly-high", name: "🔄 Fly High", description: "Reach prestige level 1." }, // Added from clicker.js
    { id: "reset-universe", name: "🔄 Reset the Universe", description: "Reach prestige level 10." },
    { id: "hidden-eye", name: "👁 Hidden Eye", description: "Click a hidden pixel." },
    { id: "infinite-loop", name: "🔁 Infinite Loop", description: "Cause animation overload." },
    { id: "abyss", name: "🕳 The Abyss", description: "Hover over the void." },
    { id: "double-agent", name: "🎭 Double Agent", description: "Trigger conflicting actions." },
    { id: "party-clicker", name: "🎉 The Party Clicker", description: "Activate confetti mode." },
    { id: "no-internet", name: "📵 No Internet", description: "Click while offline." },
    { id: "click-symphony", name: "🔊 Click Symphony", description: "Click in rhythm." },
    { id: "pixel-perfect", name: "🖼 Pixel Perfect", description: "Click the perfect pixel." },
    { id: "op-clicker", name: "⚡ OP Clicker", description: "Reach x1000 multiplier." }
];

function loadAchievementsPage() {
    const container = document.getElementById("achievement-container");
    if (!container) {
        console.error("Achievement container not found!");
        return;
    }

    achievements.forEach(achievement => {
        const div = document.createElement("div");
        div.className = "achievement";
        div.innerHTML = `
            <h3>${achievement.name}</h3>
            <div class="achievement-description">${achievement.description}</div>
        `;
        container.appendChild(div);
    });
}

window.onload = loadAchievementsPage;

document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "../jeffclicker.html"; // Adjust if your game file is named differently
});