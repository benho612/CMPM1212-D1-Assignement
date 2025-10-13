let lastTime = performance.now(); // record the last frame time

let counter: number = 0;

// Create basic HTML structure
document.body.innerHTML = `
  <h1>CMPM 121 Project</h1>
  <p>Counter: <span id="counter">0</span></p>
  <button id="increment">Click Me!</button>
`;

// Add click handler
const button = document.getElementById("increment")!;
const counterElement = document.getElementById("counter")!;

button.addEventListener("click", () => {
  counter += 1;
  counterElement.textContent = counter.toString();
  console.log("I have these thingies:", button, counterElement, counter);
});

function update(currentTime: number) {
  // compute time passed (in seconds)
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // add 1 per second (scaled by delta time)
  counter += deltaTime * 1.0;

  // update display
  counterElement.textContent = counter.toFixed(2);

  // loop again
  requestAnimationFrame(update);
}

// start animation loop
requestAnimationFrame(update);
