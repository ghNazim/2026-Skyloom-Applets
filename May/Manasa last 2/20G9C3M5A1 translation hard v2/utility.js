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
const sounds = [
  "correct",
  "wrong",
  "click",
  "congrats",
  "tick",
  "swoosh",
  "swish",
];
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

function playSoundDelayed(filename, delayMs) {
  return setTimeout(() => playSound(filename), delayMs);
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

function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }

  return sentence.replace(/,/g, "<cm>,</cm>");
}

const MATH_VAR_PATTERN = /(?<![a-zA-Z])([xy])(?![a-zA-Z0-9])/g;

function splitMathVarParts(text) {
  const parts = [];
  const str = String(text);
  let lastIndex = 0;
  let match;

  MATH_VAR_PATTERN.lastIndex = 0;
  while ((match = MATH_VAR_PATTERN.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.slice(lastIndex, match.index));
    }
    parts.push(match[1]);
    lastIndex = MATH_VAR_PATTERN.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex));
  }

  return parts.length ? parts : [str];
}

function renderMathVars(text) {
  return splitMathVarParts(text).map((part, index) => {
    if (part === "x" || part === "y") {
      return React.createElement(
        "span",
        { key: index, className: "math-var" },
        part,
      );
    }
    return part;
  });
}

function formatMathVarsHtml(text) {
  return String(text).replace(
    MATH_VAR_PATTERN,
    '<span class="math-var">$1</span>',
  );
}

function renderSvgMathLabel(label) {
  return splitMathVarParts(label).map((part, index) => {
    if (part === "x" || part === "y") {
      return React.createElement(
        "tspan",
        {
          key: "mv-" + index,
          fontFamily: '"Times New Roman", Times, serif',
          fontStyle: "italic",
        },
        part,
      );
    }
    return part;
  });
}

function renderXYLineFormula(rhs) {
  const renderVar = (letter) =>
    React.createElement(
      "span",
      { className: "math-formula-var" },
      React.createElement("span", { className: "math-formula-italic" }, letter),
    );

  return React.createElement(
    "div",
    { className: "math-formula-eq" },
    React.createElement(
      "span",
      { className: "math-formula-eq-inner math-formula-final" },
      renderVar("x"),
      " + ",
      renderVar("y"),
      " = ",
      React.createElement("span", { className: "math-formula-num" }, rhs),
    ),
  );
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
