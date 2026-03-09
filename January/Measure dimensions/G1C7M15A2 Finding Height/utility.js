

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


function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }
  
  return sentence.replace(/,/g, "<cm>,</cm>");
}


/**
 * Creates a bidirectional SVG arrow (line with arrowheads on both ends).
 * Returns an SVG <g> element. Use inside an SVG with appropriate viewBox.
 * Based on sample.html createBiDirectionalArrow logic.
 */
function createBiDirectionalArrow(x1, y1, x2, y2, options = {}) {
  const {
    color = "black",
    width = 2,
    headSize = 20,
    opacity = 1
  } = options;

  const svgNS = "http://www.w3.org/2000/svg";
  const group = document.createElementNS(svgNS, "g");
  group.setAttribute("opacity", opacity);

  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const headAngle = Math.PI / 7;

  const offset = headSize * 0.5;
  const lx1 = x1 + Math.cos(angle) * offset;
  const ly1 = y1 + Math.sin(angle) * offset;
  const lx2 = x2 - Math.cos(angle) * offset;
  const ly2 = y2 - Math.sin(angle) * offset;

  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("class", "arrow-line-non-scaling");
  line.setAttribute("x1", lx1);
  line.setAttribute("y1", ly1);
  line.setAttribute("x2", lx2);
  line.setAttribute("y2", ly2);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", width);
  line.setAttribute("stroke-linecap", "butt");
  line.setAttribute("vector-effect", "non-scaling-stroke");

  const calculatePoints = (px, py, rotationAngle) => {
    const xA = px + headSize * Math.cos(rotationAngle + headAngle);
    const yA = py + headSize * Math.sin(rotationAngle + headAngle);
    const xB = px + headSize * Math.cos(rotationAngle - headAngle);
    const yB = py + headSize * Math.sin(rotationAngle - headAngle);
    return `${px},${py} ${xA},${yA} ${xB},${yB}`;
  };

  const polyEnd = document.createElementNS(svgNS, "polygon");
  polyEnd.setAttribute("points", calculatePoints(x2, y2, angle + Math.PI));
  polyEnd.setAttribute("fill", color);

  const polyStart = document.createElementNS(svgNS, "polygon");
  polyStart.setAttribute("points", calculatePoints(x1, y1, angle));
  polyStart.setAttribute("fill", color);

  group.appendChild(line);
  group.appendChild(polyEnd);
  group.appendChild(polyStart);

  return group;
}

