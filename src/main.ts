import recordButtonUrl from "./Anime Girl on Vinyl Record.png"; // <-- rename to your actual file name
import "./style.css";

let counter = 0; // total spins
let lastTime = performance.now();

interface Item {
  name: string;
  cost: number;
  rate: number; // spins/sec
  count: number;
}
const PRICE_FACTOR = 1.15;

// Themed upgrades (vinyl studio vibe)
const items: Item[] = [
  { name: "Extra Stylus", cost: 10, rate: 0.1, count: 0 },
  { name: "Preamp Boost", cost: 100, rate: 2.0, count: 0 },
  { name: "Motor Upgrade", cost: 1000, rate: 50, count: 0 },
];

interface Song {
  name: string;
  cost: number;
  file: string; // url or local mp3 path
  unlocked: boolean;
}

const songs: Song[] = [
  { name: "No More Mambo", cost: 10, file: "song/mambo1.mp3", unlocked: false },
  {
    name: "Space Mambo",
    cost: 20,
    file: "song/SpaceMambo.mp3",
    unlocked: false,
  },
  {
    name: "Wake Up Hajimi",
    cost: 30,
    file: "song/WakeUpHajimi.mp3",
    unlocked: false,
  },
];

// ---------- UI ----------
document.body.innerHTML = `
  <div class="main-layout">
    <div class="game-container">
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

let currentVolume = 0.6; // default 60%
audioPlayer.volume = currentVolume;

songs.forEach((song, i) => {
  const btn = document.createElement("button");
  btn.textContent = `🔒 ${song.name} — Cost: ${song.cost} spins`;
  btn.id = `song-${i}`;
  btn.disabled = true;
  songsEl.appendChild(btn);

  btn.addEventListener("click", () => {
    if (song.unlocked) {
      // play using the shared player at current volume
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

const songTab = document.querySelector(".song-tab")!;
const volumeWrap = document.createElement("div");
volumeWrap.className = "volume";
volumeWrap.innerHTML = `
  <label for="volumeSlider">Volume: <span id="volVal">${
  Math.round(currentVolume * 100)
}%</span></label>
  <input id="volumeSlider" type="range" min="0" max="1" step="0.01" value="${currentVolume}">
`;
songTab.appendChild(volumeWrap);

const volumeSlider = document.getElementById(
  "volumeSlider",
) as HTMLInputElement;
const volVal = document.getElementById("volVal") as HTMLSpanElement;

volumeSlider.addEventListener("input", () => {
  currentVolume = parseFloat(volumeSlider.value);
  audioPlayer.volume = currentVolume;
  volVal.textContent = `${Math.round(currentVolume * 100)}%`;
});

// Build shop buttons
items.forEach((item, i) => {
  const btn = document.createElement("button");
  btn.id = `buy-${i}`;
  shop.appendChild(btn);

  btn.addEventListener("click", () => {
    if (counter >= item.cost) {
      counter -= item.cost;
      item.count += 1;
      item.cost = item.cost * PRICE_FACTOR;
      refreshUI();
    }
  });
});

function refreshUI() {
  const rate = computeRate();
  counterEl.textContent = counter.toFixed(2);
  rateEl.textContent = rate.toFixed(2);

  items.forEach((item, i) => {
    const btn = document.getElementById(`buy-${i}`) as HTMLButtonElement;
    btn.disabled = counter < item.cost;
    btn.textContent = `${item.name} (+${item.rate}/sec) — Cost: ${
      item.cost.toFixed(2)
    } spins | Owned: ${item.count}`;
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

// Click = +1 spin
clickBtn.addEventListener("click", () => {
  counter += 1;
  refreshUI();
});

function computeRate(): number {
  return items.reduce((sum, it) => sum + it.rate * it.count, 0);
}

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
