
const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats", "tick"];
sounds.forEach((name) => {
  const audio = new Audio(`sound/${name}.mp3`);
  audio.load();
  audioCache[name] = audio;
});
function playSound(filename) {
  if (!audioCache[filename]) {
    const audio = new Audio(`sound/${filename}.mp3`);
    audioCache[filename] = audio;
  }
  const sound = audioCache[filename].cloneNode();
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

/**
 * Typewriter effect: reveals text character by character.
 * @param {string} fullText - The complete text to type out.
 * @param {function} setDisplayFn - React setState function to update displayed text.
 * @param {number} charDelay - Milliseconds between each character (e.g. 30).
 * @param {function} [onComplete] - Callback when typing finishes.
 * @returns {number} interval ID (use clearInterval to cancel).
 */
function typewriterEffect(fullText, setDisplayFn, charDelay, onComplete) {
  let index = 0;
  setDisplayFn("");
  const interval = setInterval(() => {
    index++;
    setDisplayFn(fullText.substring(0, index));
    if (index >= fullText.length) {
      clearInterval(interval);
      if (onComplete) onComplete();
    }
  }, charDelay);
  return interval;
}
