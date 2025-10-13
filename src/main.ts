let counter: number = 0;
let growthRate = 0;
let lastTime = performance.now(); // record the last frame time

// Create basic HTML structure
document.body.innerHTML = `
  <h1>MAMBO CLICKER</h1>
  <p>Counter: <span id="counter">0.00</span></p>
  <p>Growth: <span id="rate">0.00</span> / sec</p>
  <button id="increment">Click Me!</button>
  <button id="buy-upgrade" disabled>Buy Upgrade (+1/sec) — Cost: 10</button>
`;

// Add click handler
const counterEl = document.getElementById("counter")!;
const rateEl = document.getElementById("rate")!;
const clickBtn = document.getElementById("increment") as HTMLButtonElement;
const buyBtn = document.getElementById("buy-upgrade") as HTMLButtonElement;

function refreshUI() {
  counterEl.textContent = counter.toFixed(2);
  rateEl.textContent = growthRate.toFixed(2);
  // Enable purchase only if affordable
  buyBtn.disabled = counter < 10;
}

// Manual clicking: +1 per click
clickBtn.addEventListener("click", () => {
  counter += 1;
  refreshUI();
});

// Buy upgrade: costs 10, adds +1/sec
buyBtn.addEventListener("click", () => {
  if (counter >= 10) {
    counter -= 10;
    growthRate += 1;
    refreshUI();
  }
});

// Continuous growth using requestAnimationFrame
function loop(now: number) {
  const dt = (now - lastTime) / 1000; // seconds
  lastTime = now;

  // Add continuous growth (rate units per second)
  counter += growthRate * dt;

  refreshUI();
  requestAnimationFrame(loop);
}

refreshUI();
requestAnimationFrame(loop);
