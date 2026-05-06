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
const sounds = ["correct", "wrong", "click", "congrats", "tick"];
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

function sqrt(n) {
  return katex.renderToString(`\\sqrt{${n}}`);
}

/** Same colors as MainCanvas point2 (blue) / point1 (yellow); used inside \\sqrt{…}. */
function sqrtXyDistanceFormula() {
  if (typeof katex === "undefined") return "";
  var blue = "#64C7FF";
  var yellow = "#FFD34D";
  var inner =
    "(\\textcolor{" +
    blue +
    "}{x_2} - \\textcolor{" +
    yellow +
    "}{x_1})^2 + (\\textcolor{" +
    blue +
    "}{y_2} - \\textcolor{" +
    yellow +
    "}{y_1})^2";
  return katex.renderToString("\\sqrt{" + inner + "}", {
    throwOnError: false,
    displayMode: false,
    trust: true,
  });
}