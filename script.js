const compare = document.querySelector("[data-compare]");
const before = document.querySelector("[data-before]");
const divider = document.querySelector("[data-divider]");
const range = document.querySelector("[data-range]");

function setSplit(value) {
  const clamped = Math.min(92, Math.max(8, Number(value)));
  before.style.width = `${clamped}%`;
  divider.style.left = `${clamped}%`;
  range.style.left = `${clamped}%`;
}

range.addEventListener("input", (event) => {
  setSplit(event.target.value);
});

compare.addEventListener("pointermove", (event) => {
  if (event.buttons !== 1) {
    return;
  }

  const rect = compare.getBoundingClientRect();
  const position = ((event.clientX - rect.left) / rect.width) * 100;
  range.value = position;
  setSplit(position);
});

setSplit(range.value);
