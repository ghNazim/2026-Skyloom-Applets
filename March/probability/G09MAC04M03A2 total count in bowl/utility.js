function showFtue(element) {
  if (!element) return;
  const handFtue = document.getElementById("hand-ftue");

  handFtue.classList.remove("hand-animating");
  element.classList.remove("ftue-highlight");

  const rect = element.getBoundingClientRect();

  handFtue.style.top = `${rect.top + rect.height / 2}px`;
  handFtue.style.left = `${rect.left + rect.width / 2}px`;
  handFtue.classList.add("hand-animating");
}

function hideFtue() {
  const handFtue = document.getElementById("hand-ftue");
  handFtue.classList.remove("hand-animating");
}

function tapNext() {
  showFtue(document.getElementById("next-button"));
}


const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats"];
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


/**
 * Formats a decimal number or string to use the correct decimal separator
 * based on the current language.
 * @param {number|string} value - The decimal number or string to format
 * @returns {string} - The formatted decimal string with the correct separator
 */
function formatDecimal(value) {
  if (value === null || value === undefined) return "";
  
  // Get the decimal separator for current language
  const separator = decimal[current_language] || ".";
  
  // Convert to string if it's a number
  let decimalStr = typeof value === "number" ? value.toString() : String(value);
  
  // Replace any decimal separator (both . and ,) with the correct one
  // This handles cases where the value might already have a separator
  decimalStr = decimalStr.replace(/[,.]/, separator);
  
  return decimalStr;
}