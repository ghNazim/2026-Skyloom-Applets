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


function pyramidCoins(n) {
  if (n <= 0) return [];

  // Step 1: find nearest perfect pyramid height
  let h = 0;
  while ((h * (h + 1)) / 2 <= n) {
    h++;
  }

  let lowerH = h - 1;
  let upperH = h;

  const lowerSum = (lowerH * (lowerH + 1)) / 2;
  const upperSum = (upperH * (upperH + 1)) / 2;

  // Choose nearest pyramid
  let height, baseSum;
  if (Math.abs(n - lowerSum) <= Math.abs(upperSum - n)) {
    height = lowerH;
    baseSum = lowerSum;
  } else {
    height = upperH;
    baseSum = upperSum;
  }

  // Step 2: build perfect pyramid
  let rows = [];
  for (let i = 1; i <= height; i++) {
    rows.push(i);
  }

  // Step 3: adjust coins
  let diff = n - baseSum;

  let index = rows.length - 1;
  while (diff !== 0) {
    if (diff > 0) {
      rows[index] += 1;
      diff -= 1;
    } else {
      rows[index] -= 1;
      diff += 1;
    }

    index--;
    if (index < 0) index = rows.length - 1;
  }

  return rows;
}
