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

const MEASURE_CONFIG = {
  eraserWidth: 140,
  eraserStepX: 79,
  eraserStepY: 50,
  pencil: {
    correctCount: 6,
    start: { x: 261, y: 340 },
  },
  box: {
    correctCount: 7,
    start: { x: 340, y: 200 },
  },
};

function getEraserPosition(index, type) {
  const cfg = MEASURE_CONFIG[type];
  return {
    x: cfg.start.x + index * MEASURE_CONFIG.eraserStepX,
    y: cfg.start.y + index * MEASURE_CONFIG.eraserStepY,
  };
}

// Step 5/6 line segments — tweak in LINE_SEGMENT_CONFIG below.
// Per segment: cx/cy = center when tilted; length = line length;
// finalY = row Y when horizontal; lineStartX = shared left edge when horizontal.
// lineEndX is optional (defaults to lineStartX + length).
// labelBox: x/width/height/fontSize for left labels after animation.
// Object images: MainCanvas.js renderLineSegmentsSvg (box, pencil, eraser x/y).
const LINE_SEGMENT_CONFIG = {
  // Initial tilt of lines (degrees). Change to align with objects.
  startRotation: 32,
  lineWidth: 14,
  horizontalLineStartX: 400,
  segments: [
    {
      id: "box",
      color: "#d946ef",
      length: 640,
      cx: 680,
      cy: 420,
      finalY: 130,
      lineStartX: 400,
      lineEndX: 1040,
    },
    {
      id: "pencil",
      color: "#facc15",
      length: 540,
      cx: 555,
      cy: 525,
      finalY: 350,
      lineStartX: 400,
      lineEndX: 940,
    },
    {
      id: "eraser",
      color: "#f472b6",
      length: 75,
      cx: 370,
      cy: 520,
      finalY: 570,
      lineStartX: 400,
      lineEndX: 475,
    },
  ],
  labelBox: {
    x: 70,
    width: 280,
    height: 112,
    fontSize: 44,
    rx: 24,
  },
};

function getSegmentById(id) {
  return LINE_SEGMENT_CONFIG.segments.find(function (s) {
    return s.id === id;
  });
}

const MEASURE_ANIM_CONFIG = {
  pencilCount: 6,
  boxCount: 7,
  cloneRowOffset: 48,
  cloneMoveDuration: 0.45,
  countBadge: {
    cx: 365,
    radius: 34,
    fontSize: 38,
  },
  tickHeight: 20,
};

function getLineStartX(seg) {
  return seg.lineStartX != null ? seg.lineStartX : LINE_SEGMENT_CONFIG.horizontalLineStartX;
}

function getCounterBadgeCx(seg) {
  const badge = MEASURE_ANIM_CONFIG.countBadge;
  return getLineStartX(seg) - badge.radius - 1;
}

function getUnitCloneGeometry(segId, index, totalCount) {
  const seg = getSegmentById(segId);
  const eraser = getSegmentById("eraser");
  if (!seg || !eraser) return null;

  const x0 = getLineStartX(seg);
  const unitLen = seg.length / totalCount;
  const cloneY = seg.finalY + MEASURE_ANIM_CONFIG.cloneRowOffset;

  return {
    x1: x0 + index * unitLen,
    x2: x0 + (index + 1) * unitLen,
    y: cloneY,
    color: eraser.color,
  };
}

function getEraserCloneSource() {
  const eraser = getSegmentById("eraser");
  if (!eraser) return null;

  const x0 = getLineStartX(eraser);
  return {
    x1: x0,
    x2: x0 + eraser.length,
    y: eraser.finalY,
    color: eraser.color,
  };
}

function lerpCloneSegment(t, source, target) {
  return {
    x1: lerp(source.x1, target.x1, t),
    x2: lerp(source.x2, target.x2, t),
    y1: lerp(source.y, target.y, t),
    y2: lerp(source.y, target.y, t),
    color: target.color,
  };
}

function lineNotationHtml(letters) {
  return (
    '<span class="line-notation">' +
    '<svg class="line-notation-arrow" viewBox="0 0 56 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M2 6 L8 2 L8 4.5 L48 4.5 L48 2 L54 6 L48 10 L48 7.5 L8 7.5 L8 10 Z" fill="currentColor"/>' +
    "</svg>" +
    '<span class="line-notation-label">' +
    letters +
    "</span>" +
    "</span>"
  );
}

function buildLineMcqTitle() {
  if (current_language === "id") {
    return (
      "Di sini, kamu melihat 2 garis " +
      lineNotationHtml("AB") +
      " dan " +
      lineNotationHtml("MN") +
      ".<br>Mana yang lebih panjang?"
    );
  }
  return (
    "Here, you see 2 lines<br>" +
    lineNotationHtml("AB") +
    " and " +
    lineNotationHtml("MN") +
    ".<br>Which one is longer?"
  );
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getLineSegmentTransform(seg, progress) {
  const cfg = LINE_SEGMENT_CONFIG;
  const startAngle = cfg.startRotation;
  const angle = lerp(startAngle, 0, progress);
  const lineStartX = seg.lineStartX != null ? seg.lineStartX : cfg.horizontalLineStartX;
  const flatCenterX = lineStartX + seg.length / 2;
  const cx = lerp(seg.cx, flatCenterX, progress);
  const cy = lerp(seg.cy, seg.finalY, progress);
  return { cx, cy, angle, length: seg.length, lineStartX: lineStartX };
}

function getHorizontalLineEndX(seg) {
  if (seg.lineEndX != null) return seg.lineEndX;
  const lineStartX =
    seg.lineStartX != null ? seg.lineStartX : LINE_SEGMENT_CONFIG.horizontalLineStartX;
  return lineStartX + seg.length;
}

const mainsvg = `
<svg
  width="1300"
  height="800"
  viewBox="0 -40 1300 760"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  
  <image
    xlink:href="./assets/box.png"
    x="355"
    y="-130"
    width="850"
    class="pencil-box"
  />
  <image
    xlink:href="./assets/pencil.png"
    x="352"
    y="500"
    width="570"
    class="pencil"
  />
</svg>
`;
