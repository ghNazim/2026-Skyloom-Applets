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

function arrow(text, colored = null) {
  if (!colored) {
    return `<math>
    <mover>
      <mtext "font-family: inherit;">${text}</mtext>
      <mo stretchy="true">→</mo>
    </mover>
  </math>`;
  }
  if (colored) {
    return `<math>
    <mover>
      <mrow>
          <mtext style="color: #FFEB3B;">A</mtext>
          <mtext style="color: #2196F3;">B</mtext>
      </mrow>
      <mo stretchy="true">→</mo>
    </mover>
  </math>`;
  }
}
