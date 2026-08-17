const compare = document.querySelector("[data-compare]");
const before = document.querySelector("[data-before]");
const divider = document.querySelector("[data-divider]");
const range = document.querySelector("[data-range]");
let isDragging = false;

function setSplit(value) {
  const clamped = Math.min(92, Math.max(8, Number(value)));
  before.style.width = `${clamped}%`;
  divider.style.left = `${clamped}%`;
  range.value = clamped;
}

function setSplitFromPointer(clientX) {
  const rect = compare.getBoundingClientRect();
  const position = ((clientX - rect.left) / rect.width) * 100;
  setSplit(position);
}

range.addEventListener("input", (event) => {
  setSplit(event.target.value);
});

divider.addEventListener("pointerdown", (event) => {
  isDragging = true;
  divider.setPointerCapture(event.pointerId);
  setSplitFromPointer(event.clientX);
});

window.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }

  setSplitFromPointer(event.clientX);
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
