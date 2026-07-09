
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
