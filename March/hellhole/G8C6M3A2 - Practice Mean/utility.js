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

function renderFractionHTML(numerator, denominator) {
  return (
    '<span class="formula-fraction">' +
    '<span class="formula-fraction-top">' +
    numerator +
    "</span>" +
    '<span class="formula-fraction-bar"></span>' +
    '<span class="formula-fraction-bottom">' +
    denominator +
    "</span>" +
    "</span>"
  );
}

function buildStartFormulaHtml(start) {
  if (!start || typeof renderFractionHTML !== "function") {
    return "";
  }
  return (
    "<span class='formula-equation'>" +
    (start.formulaLead || "") +
    renderFractionHTML(
      start.formulaSumNumerator || "",
      start.formulaSumDenominator || "",
    ) +
    " = " +
    renderFractionHTML(
      start.formulaExpandedNumerator || "",
      start.formulaExpandedDenominator || "n",
    ) +
    "</span>"
  );
}

function buildMeanFormulaFractionHtml(terms) {
  const t =
    terms ||
    (typeof APP_DATA !== "undefined" && APP_DATA.terms) ||
    {};
  if (typeof renderFractionHTML !== "function") {
    return "";
  }
  return (
    (t.meanEquals || "Mean =") +
    " " +
    renderFractionHTML(t.sumShort || "Sum", t.numberShort || "Number") +
    " = " +
    renderFractionHTML(
      t.formulaExpandedNumerator ||
        "x<sub>1</sub> + x<sub>2</sub> + &ctdot; + x<sub>n</sub>",
      t.formulaExpandedDenominator || "n",
    )
  );
}
