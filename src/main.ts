import recordButtonUrl from "./Anime Girl on Vinyl Record.png"; // <-- rename to your actual file name
import "./style.css";

/* =========================
   Data & constants (top)
   ========================= */
let counter = 0; // total spins
let lastTime = performance.now();

interface Item {
  name: string;
  cost: number;
  rate: number;
  count: number;
  description: string;
}

interface Song {
  name: string;
  cost: number;
  file: string;
  unlocked: boolean;
}

const PRICE_FACTOR = 1.15;

// Themed upgrades (vinyl studio vibe)
const items: Item[] = [
  { name: "Extra Stylus",     cost: 10,    rate: 0.1,  count: 0, description: "A fresh needle for smoother grooves. (+0.1 spins/sec each)" },
  { name: "Preamp Boost",     cost: 100,   rate: 2.0,  count: 0, description: "Hotter signal, louder room. (+2 spins/sec each)" },
  { name: "Motor Upgrade",    cost: 1000,  rate: 50,   count: 0, description: "High-torque platter motor. (+50 spins/sec each)" },
  { name: "Balanced Tonearm", cost: 7500,  rate: 160,  count: 0, description: "Precision-balanced arm cuts wow & flutter. (+160 spins/sec each)" },
  { name: "Studio Press",     cost: 20000, rate: 500,  count: 0, description: "Your own micro-press for constant output. (+500 spins/sec each)" },
];

const songs: Song[] = [
  { name: "No More Mambo",  cost: 10,     file: "song/mambo1.mp3",      unlocked: false },
  { name: "Space Mambo",    cost: 20000,  file: "song/SpaceMambo.mp3",  unlocked: false },
  { name: "Wake Up Hajimi", cost: 50000,  file: "song/WakeUpHajimi.mp3",unlocked: false },
  { name: "GG Bond",        cost: 70000,  file: "song/GGBond.mp3",      unlocked: false },
];

/* =========================
   Helper functions (logic)
   ========================= */
function fmt(n: number): string {
  return n.toFixed(2);
}

function computeRate(): number {
  return items.reduce((sum, it) => sum + it.rate * it.count, 0);
}

/* =========================
   UI refresh (uses helpers)
   ========================= */
// (Declared before UI setup so it’s easy to find; executed only after elements exist.)
function refreshUI() {
  const rate = computeRate();
  counterEl.textContent = fmt(counter);
  rateEl.textContent = fmt(rate);

  items.forEach((item, i) => {
    const btn = document.getElementById(`buy-${i}`) as HTMLButtonElement;
    btn.disabled = counter < item.cost;
    btn.textContent = `${item.name} (+${item.rate}/sec) — Cost: ${fmt(item.cost)} spins | Owned: ${item.count}`;
  });

  songs.forEach((song, i) => {
    const btn = document.getElementById(`song-${i}`) as HTMLButtonElement;
    if (song.unlocked) {
      btn.disabled = false;
      btn.textContent = `🎵 ${song.name} (Click to Play)`;
    } else {
      btn.disabled = counter < song.cost;
    }
  });
}

/* =========================
   UI setup (DOM & wiring)
   ========================= */
document.body.innerHTML = `
  <div class="main-layout">
    <div class="game-container">
      <label class="sfx-toggle">
        <input type="checkbox" id="sfxToggle" checked>
        Click sound
      </label>

      <h1>Mambo Studio</h1>

      <p>Spins: <span id="counter">0.00</span></p>
      <p>Production: <span id="rate">0.00</span> spins/sec</p>

      <button id="increment" class="record-btn" aria-label="Spin the record">
        <img src="${recordButtonUrl}" alt="Record click button" />
      </button>

      <div id="shop"></div>
    </div>

    <div class="song-tab">
      <h2>Song Collection</h2>
      <div id="songs"></div>
    </div>
  </div>
`;

const counterEl = document.getElementById("counter")!;
const rateEl = document.getElementById("rate")!;
const clickBtn = document.getElementById("increment") as HTMLButtonElement;
const shop = document.getElementById("shop")!;
const songsEl = document.getElementById("songs")!;

const audioPlayer = new Audio();
audioPlayer.loop = false;

const sfxPlayer = new Audio("song/mamboClick.mp3");
sfxPlayer.loop = false;

let currentVolume = 0.6;
audioPlayer.volume = currentVolume;
sfxPlayer.volume = currentVolume;

// Checkbox state
let sfxEnabled = true;
const sfxToggle = document.getElementById("sfxToggle") as HTMLInputElement;
sfxToggle.addEventListener("change", () => {
  sfxEnabled = sfxToggle.checked;
});

// Build song buttons
songs.forEach((song, i) => {
  const btn = document.createElement("button");
  btn.textContent = `🔒 ${song.name} — Cost: ${song.cost} spins`;
  btn.id = `song-${i}`;
  btn.disabled = true;
  songsEl.appendChild(btn);

  btn.addEventListener("click", () => {
    if (song.unlocked) {
      audioPlayer.pause();
      audioPlayer.src = song.file;
      audioPlayer.currentTime = 0;
      audioPlayer.play();
    } else if (counter >= song.cost) {
      counter -= song.cost;
      song.unlocked = true;
      btn.textContent = `🎵 ${song.name} (Click to Play)`;
      refreshUI();
    }
  });
});

// Volume UI
const songTab = document.querySelector(".song-tab")!;
const volumeWrap = document.createElement("div");
volumeWrap.className = "volume";
volumeWrap.innerHTML = `
  <label for="volumeSlider">Volume: <span id="volVal">${Math.round(currentVolume * 100)}%</span></label>
  <input id="volumeSlider" type="range" min="0" max="1" step="0.01" value="${currentVolume}">
`;
songTab.appendChild(volumeWrap);

const volumeSlider = document.getElementById("volumeSlider") as HTMLInputElement;
const volVal = document.getElementById("volVal") as HTMLSpanElement;

volumeSlider.addEventListener("input", () => {
  currentVolume = parseFloat(volumeSlider.value);
  audioPlayer.volume = currentVolume;
  sfxPlayer.volume = currentVolume;
  volVal.textContent = `${Math.round(currentVolume * 100)}%`;
});

// Build shop buttons
items.forEach((item, i) => {
  const btn = document.createElement("button");
  btn.id = `buy-${i}`;
  btn.title = item.description;
  shop.appendChild(btn);

  btn.addEventListener("click", () => {
    if (counter >= item.cost) {
      counter -= item.cost;
      item.count += 1;
      item.cost = item.cost * PRICE_FACTOR;

      if (sfxEnabled) {
        try {
          sfxPlayer.currentTime = 0;
          void sfxPlayer.play();
        } catch {
          console.log("sfx got cancelled by player");
        }
      }
      refreshUI();
    }
  });
});

/* =========================
   Behavior (events & loop)
   ========================= */
clickBtn.addEventListener("click", () => {
  counter += 1;
  refreshUI();
});

// Frame-rate independent auto growth
function loop(now: number) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  counter += computeRate() * dt;
  refreshUI();
  requestAnimationFrame(loop);
}

refreshUI();
requestAnimationFrame(loop);
