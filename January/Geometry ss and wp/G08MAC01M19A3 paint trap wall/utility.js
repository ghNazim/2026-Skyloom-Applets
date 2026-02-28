


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

function replaceRoot3(sentence){
  return sentence.replace("√3", sqrt(3));
}

function frac(num, den) {
  return '<span class="inline-frac"><span class="inline-frac-num">' + num + '</span><span class="inline-frac-line"></span><span class="inline-frac-den">' + den + '</span></span>';
}
