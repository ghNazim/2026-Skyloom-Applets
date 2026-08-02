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

function polygonCentroid(points) {
  let x = 0;
  let y = 0;
  points.forEach((p) => {
    x += p.x;
    y += p.y;
  });
  return { x: x / points.length, y: y / points.length };
}

function radialLabelPoint(vertex, centroid, offset) {
  const dx = vertex.x - centroid.x;
  const dy = vertex.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const dist = offset !== undefined ? offset : 3.8;
  return {
    x: vertex.x + (dx / len) * dist,
    y: vertex.y + (dy / len) * dist,
  };
}

function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }
  return sentence.replace(/,/g, "<cm>,</cm>");
}

function renderAppTextHtml(html) {
  if (!html) return "";
  return html;
}

function renderFinishTextHtml(html) {
  if (!html) return "";
  return html
    .replace(/<r>([\s\S]*?)<\/r>/g, '<span class="finish-text-red">$1</span>')
    .replace(/<g>([\s\S]*?)<\/g>/g, '<span class="finish-text-green">$1</span>');
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateValue(from, to, duration, onUpdate, onComplete, easingFn) {
  const ease = easingFn || easeOutCubic;
  const startTime = performance.now();
  let frameId = null;

  const tick = (now) => {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = ease(t);
    onUpdate(from + (to - from) * eased);
    if (t < 1) {
      frameId = requestAnimationFrame(tick);
    } else if (typeof onComplete === "function") {
      onComplete();
    }
  };

  frameId = requestAnimationFrame(tick);
  return () => {
    if (frameId) cancelAnimationFrame(frameId);
  };
}

function linearEase(t) {
  return t;
}

function delay(ms, callback) {
  const id = setTimeout(callback, ms);
  return () => clearTimeout(id);
}

function getSvgPointClientRect(svgEl, viewX, viewY, size) {
  if (!svgEl || typeof svgEl.createSVGPoint !== "function") return null;
  const half = (size !== undefined ? size : 40) / 2;
  const pt = svgEl.createSVGPoint();
  pt.x = viewX;
  pt.y = viewY;
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return null;
  const screen = pt.matrixTransform(ctm);
  return {
    left: screen.x - half,
    top: screen.y - half,
    width: half * 2,
    height: half * 2,
  };
}

function getCentroidClientRect(svgEl, center) {
  return getSvgPointClientRect(svgEl, center.x, center.y, 48);
}
