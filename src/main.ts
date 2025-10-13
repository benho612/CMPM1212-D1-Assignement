import "./style.css";

let counter = 0;
let growthRate = 0;
let lastTime = performance.now();

interface Item {
  name: string;
  cost: number; // current cost (will rise after each purchase)
  rate: number; // units/sec added per purchase
  count: number; // how many owned
}

const PRICE_FACTOR = 1.15;

const items: Item[] = [
  { name: "Upgrade A", cost: 10, rate: 0.1, count: 0 },
  { name: "Upgrade B", cost: 100, rate: 2.0, count: 0 },
  { name: "Upgrade C", cost: 1000, rate: 50, count: 0 },
];

// --- Build HTML ---
document.body.innerHTML = `
  <div class="game-container">
    <h1>CMPM 121 Project</h1>
    <p>Counter: <span id="counter">0.00</span></p>
    <p>Growth: <span id="rate">0.00</span> / sec</p>
    <button id="increment">Click Me!</button>
    <div id="shop"></div>
  </div>
`;

const counterEl = document.getElementById("counter")!;
const rateEl = document.getElementById("rate")!;
const clickBtn = document.getElementById("increment") as HTMLButtonElement;
const shop = document.getElementById("shop")!;

// Create upgrade buttons
items.forEach((item, i) => {
  const btn = document.createElement("button");
  btn.id = `buy-${i}`;
  shop.appendChild(btn);

  btn.addEventListener("click", () => {
    if (counter >= item.cost) {
      // pay and apply effect
      counter -= item.cost;
      item.count += 1;
      growthRate += item.rate;

      // 🔼 Step 7: raise price by 15% for next purchase
      item.cost = item.cost * PRICE_FACTOR;

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
    } | Owned: ${item.count}`;
  });
}

clickBtn.addEventListener("click", () => {
  counter += 1;
  refreshUI();
});

function loop(now: number) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;
  counter += growthRate * dt;
  refreshUI();
  requestAnimationFrame(loop);
}

refreshUI();
requestAnimationFrame(loop);
