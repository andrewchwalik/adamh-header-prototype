const compare = document.querySelector("[data-compare]");
const before = document.querySelector("[data-before]");
const divider = document.querySelector("[data-divider]");
const range = document.querySelector("[data-range]");
let isDragging = false;
let queuedSplit = Number(range.value);
let frameId = null;

function setSplit(value) {
  const clamped = Math.min(92, Math.max(8, Number(value)));
  compare.style.setProperty("--split", `${clamped}%`);
  range.value = clamped;
}

function scheduleSplit(value) {
  queuedSplit = value;

  if (frameId !== null) {
    return;
  }

  frameId = requestAnimationFrame(() => {
    setSplit(queuedSplit);
    frameId = null;
  });
}

function scheduleSplitFromPointer(clientX) {
  const rect = compare.getBoundingClientRect();
  const position = ((clientX - rect.left) / rect.width) * 100;
  scheduleSplit(position);
}

range.addEventListener("input", (event) => {
  scheduleSplit(event.target.value);
});

divider.addEventListener("pointerdown", (event) => {
  isDragging = true;
  divider.setPointerCapture(event.pointerId);
  scheduleSplitFromPointer(event.clientX);
});

window.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }

  scheduleSplitFromPointer(event.clientX);
});

window.addEventListener("pointerup", (event) => {
  isDragging = false;
  if (divider.hasPointerCapture(event.pointerId)) {
    divider.releasePointerCapture(event.pointerId);
  }
});

window.addEventListener("pointercancel", (event) => {
  isDragging = false;
  if (divider.hasPointerCapture(event.pointerId)) {
    divider.releasePointerCapture(event.pointerId);
  }
});

setSplit(range.value);
