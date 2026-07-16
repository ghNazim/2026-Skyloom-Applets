

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

const SLIDER_SNAP_THRESHOLD = 0.15;




const DILATION_ANIM_DURATION = 700;

function handleComma(sentence) {
  if (typeof sentence !== "string") return sentence;

  return sentence.replace(
    /(^|[^A-Za-z0-9>])([xy])(?=[^A-Za-z0-9<]|$)/g,
    '$1<span class="math-var">$2</span>',
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
