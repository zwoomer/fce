const startBtn = document.getElementById("startBtn");
const testArea = document.getElementById("testArea");
const result = document.getElementById("result");

let startTime = null;
let timeoutId = null;

startBtn.addEventListener("click", () => {
  result.textContent = "";
  startBtn.disabled = true;
  testArea.classList.remove("hidden");
  testArea.style.background = "red";
  testArea.textContent = "Wait...";

  const delay = Math.random() * 2000 + 1000; // 1–3 seconds

  timeoutId = setTimeout(() => {
    testArea.style.background = "green";
    testArea.textContent = "CLICK!";
    startTime = performance.now();
  }, delay);
});

testArea.addEventListener("click", () => {
  if (!startTime) {
    // clicked too early
    clearTimeout(timeoutId);
    result.textContent = "Too early. Try again.";
    reset();
    return;
  }

  const reactionTime = Math.round(performance.now() - startTime);
  result.textContent = `Reaction time: ${reactionTime} ms`;
  reset();
});

function reset() {
  startTime = null;
  startBtn.disabled = false;
  testArea.classList.add("hidden");
  testArea.textContent = "";
}