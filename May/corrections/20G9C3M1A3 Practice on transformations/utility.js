

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

function renderFeedbackHtml(html) {
  if (!html) return "";
  return html.replace(
    /<hl>([\s\S]*?)<\/hl>/g,
    '<span class="feedback-highlight">$1</span>',
  );
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

function playDilationPickup() {
  if (!dilationAudioCtx) return;
  resumeDilationAudio();
  const osc = dilationAudioCtx.createOscillator();
  const gain = dilationAudioCtx.createGain();
  osc.connect(gain);
  gain.connect(dilationAudioCtx.destination);
  osc.type = "sine";
  const t = dilationAudioCtx.currentTime;
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(620, t + 0.13);
  gain.gain.setValueAtTime(0.35, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.start(t);
  osc.stop(t + 0.15);
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

  const noiseBuf = dilationAudioCtx.createBuffer(
    1,
    dilationAudioCtx.sampleRate * 0.06,
    dilationAudioCtx.sampleRate,
  );
  const nd = noiseBuf.getChannelData(0);
  for (let i = 0; i < nd.length; i++) {
    nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 2);
  }
  const noiseSrc = dilationAudioCtx.createBufferSource();
  const noiseGain = dilationAudioCtx.createGain();
  const noiseFilter = dilationAudioCtx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 2000;
  noiseSrc.buffer = noiseBuf;
  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseGain.gain.setValueAtTime(0.3, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

  const sparkOsc = dilationAudioCtx.createOscillator();
  const sparkGain = dilationAudioCtx.createGain();
  sparkOsc.type = "sine";
  sparkOsc.frequency.setValueAtTime(1200, t + dur * 0.8);
  sparkOsc.frequency.exponentialRampToValueAtTime(1800, t + dur);
  sparkGain.gain.setValueAtTime(0.001, t + dur * 0.8);
  sparkGain.gain.linearRampToValueAtTime(0.18, t + dur * 0.88);
  sparkGain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.1);
  sparkOsc.connect(sparkGain);
  sparkGain.connect(masterGain);

  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc2.connect(gain2);
  gain2.connect(masterGain);
  masterGain.connect(dilationAudioCtx.destination);

  osc1.start(t);
  osc1.stop(t + dur + 0.05);
  osc2.start(t);
  osc2.stop(t + dur + 0.05);
  noiseSrc.start(t);
  sparkOsc.start(t + dur * 0.8);
  sparkOsc.stop(t + dur + 0.15);
}

const DILATION_ANIM_DURATION = 700;

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

function delay(ms, callback) {
  const id = setTimeout(callback, ms);
  return () => clearTimeout(id);
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
