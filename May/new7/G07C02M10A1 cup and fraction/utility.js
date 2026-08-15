/** Normalize typed radical answers for comparison (√74, √(74), sqrt(74), spaces). */

const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats", "tick", "fill"];
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

function fractionHTML(num, den, className) {
  return (
    '<span class="fraction ' + (className || "") + '">' +
    '<span class="fraction-num">' + num + "</span>" +
    '<span class="fraction-bar"></span>' +
    '<span class="fraction-den">' + den + "</span>" +
    "</span>"
  );
}

function formatFractionsInText(text) {
  if (!text) return "";
  return String(text).replace(/\b(\d+)\/(\d+)\b/g, function (_, num, den) {
    return fractionHTML(num, den);
  });
}
