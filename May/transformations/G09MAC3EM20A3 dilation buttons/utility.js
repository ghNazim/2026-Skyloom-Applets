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

function clampDilationK(val, min, max) {
  let v = parseFloat(val);
  if (isNaN(v)) v = 1;
  const lo = min !== undefined ? min : 0.1;
  const hi = max !== undefined ? max : 2;
  return Math.max(lo, Math.min(hi, v));
}

function formatDilationThumbValue(k) {
  const rounded = Math.round(k * 10) / 10;
  if (Math.abs(rounded - Math.round(rounded)) < 0.05) {
    return String(Math.round(rounded));
  }
  return rounded.toFixed(1).replace(".", decimalSymbol);
}

function dilatePoint(p, center, k) {
  return {
    x: center.x + k * (p.x - center.x),
    y: center.y + k * (p.y - center.y),
  };
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

function radialLabelMathPoint(vertex, centroid, offset) {
  const dx = vertex.x - centroid.x;
  const dy = vertex.y - centroid.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const dist = offset !== undefined ? offset : 0.35;
  return {
    x: vertex.x + (dx / len) * dist,
    y: vertex.y + (dy / len) * dist,
  };
}

const GRAPH_PAD = 24;
const GRAPH_UNIT = 38;

function mathToSvgCoords(mx, my) {
  return {
    x: GRAPH_PAD + mx * GRAPH_UNIT,
    y: GRAPH_PAD + (DILATION_GRID_ROWS - my) * GRAPH_UNIT,
  };
}

function getGraphPointClientRect(svgEl, mathX, mathY, size) {
  if (!svgEl || typeof svgEl.createSVGPoint !== "function") return null;
  const half = (size !== undefined ? size : 40) / 2;
  const svgPt = mathToSvgCoords(mathX, mathY);
  const pt = svgEl.createSVGPoint();
  pt.x = svgPt.x;
  pt.y = svgPt.y;
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

function rotatePointAbout(p, pivot, angleRad) {
  const dx = p.x - pivot.x;
  const dy = p.y - pivot.y;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: pivot.x + dx * cos - dy * sin,
    y: pivot.y + dx * sin + dy * cos,
  };
}

function getOrientationClonePoints(progress, points, center, targetK) {
  const phase1End = 0.28;
  const phase2End = 0.58;
  const shiftX = -3;
  const shiftY = 1.2;

  const translated = points.map((p) => ({
    x: p.x + shiftX,
    y: p.y + shiftY,
  }));
  const translatedCentroid = polygonCentroid(translated);
  const rotated = translated.map((p) =>
    rotatePointAbout(p, translatedCentroid, Math.PI),
  );
  const final = points.map((p) => dilatePoint(p, center, targetK));

  if (progress <= phase1End) {
    const t = easeOutCubic(progress / phase1End);
    return points.map((p, i) => ({
      x: p.x + (translated[i].x - p.x) * t,
      y: p.y + (translated[i].y - p.y) * t,
    }));
  }

  if (progress <= phase2End) {
    const t = easeInOutCubic(
      (progress - phase1End) / (phase2End - phase1End),
    );
    const angle = Math.PI * t;
    return translated.map((p) =>
      rotatePointAbout(p, translatedCentroid, angle),
    );
  }

  const t = easeInOutCubic((progress - phase2End) / (1 - phase2End));
  return rotated.map((p, i) => ({
    x: p.x + (final[i].x - p.x) * t,
    y: p.y + (final[i].y - p.y) * t,
  }));
}

function renderFeedbackHtml(html) {
  if (!html) return "";
  return html
    .replace(
      /<hl>([\s\S]*?)<\/hl>/g,
      '<span class="feedback-highlight">$1</span>',
    )
    .replace(/<b>([\s\S]*?)<\/b>/g, "<strong>$1</strong>");
}

const dilationAudioCtx =
  typeof window !== "undefined"
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null;

function resumeDilationAudio() {
  if (dilationAudioCtx && dilationAudioCtx.state === "suspended") {
    dilationAudioCtx.resume();
  }
}

function playDilationSweep(duration) {
  if (!dilationAudioCtx) return;
  resumeDilationAudio();
  const t = dilationAudioCtx.currentTime;
  const dur = duration / 1000;

  const osc1 = dilationAudioCtx.createOscillator();
  const osc2 = dilationAudioCtx.createOscillator();
  const gain1 = dilationAudioCtx.createGain();
  const gain2 = dilationAudioCtx.createGain();
  const masterGain = dilationAudioCtx.createGain();

  osc1.type = "sawtooth";
  osc2.type = "square";
  osc1.frequency.setValueAtTime(180, t);
  osc1.frequency.exponentialRampToValueAtTime(560, t + dur * 0.75);
  osc1.frequency.exponentialRampToValueAtTime(480, t + dur);
  osc2.frequency.setValueAtTime(185, t);
  osc2.frequency.exponentialRampToValueAtTime(565, t + dur * 0.75);
  osc2.frequency.exponentialRampToValueAtTime(485, t + dur);
  gain1.gain.setValueAtTime(0.22, t);
  gain1.gain.exponentialRampToValueAtTime(0.001, t + dur);
  gain2.gain.setValueAtTime(0.08, t);
  gain2.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc2.connect(gain2);
  gain2.connect(masterGain);
  masterGain.connect(dilationAudioCtx.destination);

  osc1.start(t);
  osc1.stop(t + dur + 0.05);
  osc2.start(t);
  osc2.stop(t + dur + 0.05);
}

const DILATION_ANIM_DURATION = 700;
const RAY_GROW_DURATION = 700;
const INTRO_DELAY = 500;
const ORIENTATION_ROTATE_DURATION = 4800;

function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }
  return sentence.replace(/,/g, "<cm>,</cm>");
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

function runBlinkCycle(count, onTick, onComplete) {
  let i = 0;
  const step = () => {
    if (i >= count * 2) {
      if (typeof onComplete === "function") onComplete();
      return;
    }
    onTick(i % 2 === 0);
    i += 1;
    setTimeout(step, 220);
  };
  step();
}

function runStrokeBlinkSequence(onPhase, onComplete) {
  runBlinkCycle(3, (on) => onPhase("original", on), () => {
    runBlinkCycle(3, (on) => onPhase("dilated", on), () => {
      setTimeout(() => {
        runBlinkCycle(5, (on) => onPhase("both", on), onComplete);
      }, 500);
    });
  });
}
