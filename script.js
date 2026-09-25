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
  event.preventDefault();
  isDragging = true;
  document.body.classList.add("is-comparing");
  divider.setPointerCapture(event.pointerId);
  scheduleSplitFromPointer(event.clientX);
});

window.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }

  event.preventDefault();
  scheduleSplitFromPointer(event.clientX);
});

window.addEventListener("pointerup", (event) => {
  isDragging = false;
  document.body.classList.remove("is-comparing");
  if (divider.hasPointerCapture(event.pointerId)) {
    divider.releasePointerCapture(event.pointerId);
  }
});

window.addEventListener("pointercancel", (event) => {
  isDragging = false;
  document.body.classList.remove("is-comparing");
  if (divider.hasPointerCapture(event.pointerId)) {
    divider.releasePointerCapture(event.pointerId);
  }
});

setSplit(range.value);

if (window.lucide) {
  window.lucide.createIcons();
}

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const banner = document.querySelector(".community-banner");
const bannerToggle = document.querySelector(".banner-toggle");
let bannerPaused = motionPreference.matches;
function updateBanner() {
  banner.classList.toggle("is-paused", bannerPaused);
  bannerToggle.hidden = motionPreference.matches;
  const label = bannerPaused ? "Resume scrolling banner" : "Pause scrolling banner";
  bannerToggle.setAttribute("aria-label", label);
  bannerToggle.title = label;
  bannerToggle.innerHTML = bannerPaused ? '<i data-lucide="play"></i>' : '<i data-lucide="pause"></i>';
  if (window.lucide) window.lucide.createIcons();
}
bannerToggle.addEventListener("click", () => {
  bannerPaused = !bannerPaused;
  updateBanner();
});
motionPreference.addEventListener("change", () => {
  bannerPaused = motionPreference.matches;
  updateBanner();
});
updateBanner();

const videoTrack = document.querySelector(".video-track");
const previousVideos = document.querySelector("[data-video-prev]");
const nextVideos = document.querySelector("[data-video-next]");
function updateVideoControls() {
  previousVideos.disabled = videoTrack.scrollLeft <= 2;
  nextVideos.disabled = videoTrack.scrollLeft >= videoTrack.scrollWidth - videoTrack.clientWidth - 2;
}
function scrollVideos(direction) {
  const card = videoTrack.querySelector(".video-card");
  const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(videoTrack).columnGap);
  videoTrack.scrollBy({ left: direction * step, behavior: motionPreference.matches ? "instant" : "smooth" });
}
previousVideos.addEventListener("click", () => scrollVideos(-1));
nextVideos.addEventListener("click", () => scrollVideos(1));
videoTrack.addEventListener("scroll", updateVideoControls, { passive: true });
window.addEventListener("resize", updateVideoControls);
updateVideoControls();

const videoDialog = document.querySelector(".video-dialog");
const videoPlayer = document.querySelector(".video-player");
let videoTrigger = null;
document.querySelectorAll("[data-video]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof videoDialog.showModal !== "function") return;
    event.preventDefault();
    videoTrigger = link;
    document.querySelector("#video-dialog-title").textContent = link.dataset.title;
    document.querySelector(".video-fallback").href = link.href;
    const player = document.createElement("iframe");
    player.src = "https://www.youtube-nocookie.com/embed/" + link.dataset.video + "?autoplay=1&rel=0";
    player.title = link.dataset.title;
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    videoPlayer.replaceChildren(player);
    videoDialog.showModal();
    document.body.classList.add("video-open");
  });
});
document.querySelector("[data-video-close]").addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("click", (event) => {
  const bounds = videoDialog.getBoundingClientRect();
  if (event.target === videoDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) videoDialog.close();
});
videoDialog.addEventListener("close", () => {
  videoPlayer.replaceChildren();
  document.body.classList.remove("video-open");
  videoTrigger?.focus();
});

if ("IntersectionObserver" in window) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (!motionPreference.matches) entry.target.classList.add("is-revealing");
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".stat-item").forEach((stat) => statsObserver.observe(stat));
}
