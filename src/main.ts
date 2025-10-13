import recordButtonUrl from "./Anime Girl on Vinyl Record.png"; // <-- rename to your actual file name
import "./style.css";

let counter = 0; // total spins
let growthRate = 0; // spins per second
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

// ---------- UI ----------
document.body.innerHTML = `
  <div class="game-container">
    <h1>Spin Studio</h1>

    <p>Spins: <span id="counter">0.00</span></p>
    <p>Production: <span id="rate">0.00</span> spins/sec</p>

    <!-- Image-as-button -->
    <button id="increment" class="record-btn" aria-label="Spin the record">
      <img src="${recordButtonUrl}" alt="Record click button" />
    </button>

    <div id="shop"></div>
  </div>
`;

const counterEl = document.getElementById("counter")!;
const rateEl = document.getElementById("rate")!;
const clickBtn = document.getElementById("increment") as HTMLButtonElement;
const shop = document.getElementById("shop")!;

// Build shop buttons
items.forEach((item, i) => {
  const btn = document.createElement("button");
  btn.id = `buy-${i}`;
  shop.appendChild(btn);

  btn.addEventListener("click", () => {
    if (counter >= item.cost) {
      counter -= item.cost;
      item.count += 1;
      growthRate += item.rate;
      item.cost = item.cost * PRICE_FACTOR; // Step 7 price scaling kept
      refreshUI();
    }
  });
});

function refreshUI() {
  counterEl.textContent = counter.toFixed(2);
  rateEl.textContent = growthRate.toFixed(2);

  items.forEach((item, i) => {
    const btn = document.getElementById(`buy-${i}`) as HTMLButtonElement;
    btn.disabled = counter < item.cost;
    btn.textContent = `${item.name} (+${item.rate}/sec) — Cost: ${
      item.cost.toFixed(2)
    } spins | Owned: ${item.count}`;
  });
}

// Click = +1 spin
clickBtn.addEventListener("click", () => {
  counter += 1;
  refreshUI();
});

// Frame-rate independent auto growth
function loop(now: number) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  counter += growthRate * dt;
  refreshUI();
  requestAnimationFrame(loop);
}
refreshUI();
requestAnimationFrame(loop);
