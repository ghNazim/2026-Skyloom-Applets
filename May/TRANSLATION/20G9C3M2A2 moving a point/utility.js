/** Normalize typed radical answers for comparison (√74, √(74), sqrt(74), spaces). */
function normalizeRadicalAnswer(s) {
  if (s == null || String(s).trim() === "") return "";
  var t = String(s)
    .trim()
    .replace(/\s/g, "")
    .toLowerCase()
    .replace(/\u221a/g, "√");
  t = t.replace(/sqrt\s*\(\s*(\d+)\s*\)/g, "√$1");
  t = t.replace(/√\s*\(\s*(\d+)\s*\)/g, "√$1");
  return t;
}

const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats", "tick", "swoosh", "slider", "zoom"];
sounds.forEach((name) => {
  const audio = new Audio(`sound/${name}.mp3`);
  audio.load(); // Preloads the audio
  audioCache[name] = audio;
});
function playSound(filename) {
  if (!audioCache[filename]) {
    const audio = new Audio(`sound/${filename}.mp3`);
    audioCache[filename] = audio;
  }
  const sound = audioCache[filename].cloneNode(); // Clone so it can overlap itself
  sound.play();
}

let sliderDragActive = false;
let sliderDragReleaseListener = null;

function clearSliderDragReleaseListener() {
  if (!sliderDragReleaseListener) return;
  window.removeEventListener("pointerup", sliderDragReleaseListener);
  window.removeEventListener("pointercancel", sliderDragReleaseListener);
  window.removeEventListener("mouseup", sliderDragReleaseListener);
  window.removeEventListener("touchend", sliderDragReleaseListener);
  sliderDragReleaseListener = null;
}

function startSliderDragSound() {
  if (sliderDragActive) return;
  sliderDragActive = true;
  playSound("tick");

  sliderDragReleaseListener = function () {
    stopSliderDragSound();
  };
  window.addEventListener("pointerup", sliderDragReleaseListener);
  window.addEventListener("pointercancel", sliderDragReleaseListener);
  window.addEventListener("mouseup", sliderDragReleaseListener);
  window.addEventListener("touchend", sliderDragReleaseListener);
}

function stopSliderDragSound() {
  clearSliderDragReleaseListener();
  if (!sliderDragActive) return;
  sliderDragActive = false;
  playSound("tick");
}

let autoSliderSound = null;
let autoSliderSoundActive = false;

function ensureAutoSliderSound() {
  if (autoSliderSound) return autoSliderSound;
  autoSliderSound = new Audio("sound/slider.mp3");
  autoSliderSound.loop = true;
  autoSliderSound.preload = "auto";
  autoSliderSound.addEventListener("ended", function () {
    if (autoSliderSoundActive) {
      autoSliderSound.currentTime = 0;
      autoSliderSound.play().catch(function () {});
    }
  });
  autoSliderSound.load();
  return autoSliderSound;
}

function startAutoSliderSound() {
  if (autoSliderSoundActive) return;
  autoSliderSoundActive = true;
  const sound = ensureAutoSliderSound();
  sound.currentTime = 0;
  const playPromise = sound.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(function () {});
  }
}

function stopAutoSliderSound() {
  if (!autoSliderSoundActive) return;
  autoSliderSoundActive = false;
  if (!autoSliderSound) return;
  autoSliderSound.pause();
}

const SLIDER_SNAP_THRESHOLD = 0.15;

function clampSliderRaw(val, mode, min, max) {
  let v = parseFloat(val);
  if (isNaN(v)) v = 0;
  if (mode === "positive") v = Math.max(0, v);
  if (mode === "negative") v = Math.min(0, v);
  const lo = min !== undefined ? min : -3;
  const hi = max !== undefined ? max : 3;
  return Math.max(lo, Math.min(hi, v));
}

function snapNearInteger(val, mode, min, max) {
  let v = clampSliderRaw(val, mode, min, max);
  const nearest = Math.round(v);
  if (Math.abs(v - nearest) <= SLIDER_SNAP_THRESHOLD) {
    v = nearest;
    if (mode === "positive") v = Math.max(0, v);
    if (mode === "negative") v = Math.min(0, v);
  }
  return clampSliderRaw(v, mode, min, max);
}

function finalizeSliderValue(val, mode, min, max) {
  let v = snapNearInteger(val, mode, min, max);
  if (!Number.isInteger(v)) {
    v = Math.round(v);
  }
  return clampSliderRaw(v, mode, min, max);
}

function getSliderDisplayValue(val) {
  return Math.round(val);
}

function formatSliderThumbValue(val, symbolicText) {
  if (symbolicText) return symbolicText;
  const n = getSliderDisplayValue(val);
  if (n === 0) return "0";
  return n > 0 ? "+" + n : String(n);
}

function snapPositive(val) {
  const n = Math.abs(val);
  const whole = Math.floor(n);
  const dec = n - whole;
  const snapped = dec < 0.1 ? whole : whole + 1;
  return val >= 0 ? snapped : -snapped;
}

function snapNegative(val) {
  if (val >= 0) return 0;
  const n = Math.abs(val);
  const whole = Math.floor(n);
  const dec = n - whole;
  const snapped = dec < 0.1 ? whole : whole + 1;
  return -snapped;
}

function formatMovementLabel(template, n) {
  const absN = Math.abs(n);
  let text = String(template || "").replace("{n}", String(absN));
  if (
    typeof current_language !== "undefined" &&
    current_language === "en" &&
    absN === 1
  ) {
    text = text.replace(/\bunits\b/g, "unit");
  }
  return text;
}

function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }

  return sentence.replace(/,/g, "<cm>,</cm>");
}

function confettiBurst() {
  const duration = 1 * 600;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
