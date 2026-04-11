


const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats","tick"];
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

// Expose playSound globally
window.playSound = playSound;


function handleComma(sentence) {
  // if (current_language !== "id" || !sentence) {
  //   return sentence;
  // }
  
  return sentence
}

function sqrt(n) {
    return katex.renderToString(`\\sqrt{${n}}`);
}

/**
 * Returns HTML string for fraction notation (numerator, fraction bar, denominator).
 * Use in splash text or anywhere that accepts HTML (e.g. dangerouslySetInnerHTML).
 * @param {string} numHtml - Numerator content (plain text or HTML)
 * @param {string} denHtml - Denominator content (plain text or HTML)
 * @returns {string}
 */
function getFractionNotationHtml(numHtml, denHtml) {
  return (
    '<span class="calc-fraction">' +
    '<span class="calc-fraction-num">' + (numHtml || "") + '</span>' +
    '<span class="calc-fraction-bar"></span>' +
    '<span class="calc-fraction-den">' + (denHtml || "") + '</span>' +
    '</span>'
  );
}
if (typeof window !== "undefined") window.getFractionNotationHtml = getFractionNotationHtml;