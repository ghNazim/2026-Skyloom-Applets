var SVG_W = 760;
var POP_SVG_H = 400;
var SAM_SVG_H = 270;
var ML = 70;
var MR = 16;
var MT = 12;
var MB = 44;
var XMIN = 0;
var XMAX = 12.7;
var AXIS_LABEL_SIZE = 24;
var Y_TICK_STROKE = 2.4;

function toData(values) {
  var out = [];
  for (var i = 0; i < values.length; i++) {
    out.push({ x: i + 1, y: values[i] });
  }
  return out;
}

function graphLayout(svgH, yMax) {
  var pW = SVG_W - ML - MR;
  var pH = svgH - MT - MB;
  var xSc = pW / (XMAX - XMIN);
  var ySc = pH / yMax;
  var barW = Math.round(xSc * 0.64);
  function xP(x) {
    return ML + (x - XMIN) * xSc;
  }
  function yP(y) {
    return MT + (yMax - y) * ySc;
  }
  return {
    pW: pW,
    pH: pH,
    xSc: xSc,
    ySc: ySc,
    barW: barW,
    xP: xP,
    yP: yP,
    baseY: yP(0),
    svgH: svgH,
    yMax: yMax,
  };
}

function getPathPoints(data, layout) {
  var nonzero = data.filter(function (d) {
    return d.y > 0;
  });
  var n = nonzero.length;
  if (n === 0) return [];
  var bars = nonzero.map(function (d) {
    return {
      bl: layout.xP(d.x) - layout.barW / 2,
      br: layout.xP(d.x) + layout.barW / 2,
      bt: layout.yP(d.y),
      h: d.y,
    };
  });
  function pushPt(pts, x, y) {
    var last = pts[pts.length - 1];
    if (!last || last[0] !== x || last[1] !== y) pts.push([x, y]);
  }
  var pts = [];
  var curX = bars[0].bl;
  var curY = bars[0].bt;
  pushPt(pts, curX, curY);
  for (var i = 0; i < n - 1; i++) {
    var b = bars[i];
    var next = bars[i + 1];
    if (next.h > b.h) {
      pushPt(pts, next.bl, next.bt);
      curX = next.bl;
      curY = next.bt;
    } else if (next.h < b.h) {
      if (curX !== b.br || curY !== b.bt) {
        pushPt(pts, b.br, b.bt);
        curX = b.br;
        curY = b.bt;
      }
      pushPt(pts, next.bl, next.bt);
      curX = next.bl;
      curY = next.bt;
    } else {
      pushPt(pts, next.bl, next.bt);
      curX = next.bl;
      curY = next.bt;
    }
  }
  var lastBar = bars[n - 1];
  if (curX !== lastBar.br || curY !== lastBar.bt) {
    pushPt(pts, lastBar.br, lastBar.bt);
  }
  return pts;
}

function ptsToPathD(pts) {
  if (!pts.length) return "";
  return (
    "M " +
    pts[0][0] +
    " " +
    pts[0][1] +
    pts
      .slice(1)
      .map(function (p) {
        return " L " + p[0] + " " + p[1];
      })
      .join("")
  );
}

function fillPathD(pts, baseY) {
  if (!pts.length) return "";
  var first = pts[0];
  var last = pts[pts.length - 1];
  return (
    "M " +
    first[0] +
    " " +
    baseY +
    pts
      .map(function (p) {
        return " L " + p[0] + " " + p[1];
      })
      .join("") +
    " L " +
    last[0] +
    " " +
    baseY +
    " Z"
  );
}

function originRect(svgEl) {
  if (!svgEl) return null;
  var origin = svgEl.querySelector(".plot-origin");
  return origin ? origin.getBoundingClientRect() : svgEl.getBoundingClientRect();
}

function pixelsPerY(svgEl) {
  if (!svgEl) return 1;
  var origin = svgEl.querySelector(".plot-origin");
  var unit = svgEl.querySelector(".plot-y-unit");
  if (!origin || !unit) return 1;
  return Math.abs(
    origin.getBoundingClientRect().top - unit.getBoundingClientRect().top,
  );
}

const MainCanvas = (props) => {
  var step = props.step;
  var startAtFinal = props.startAtFinal;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onSetNavLocked = props.onSetNavLocked;
  var onUpdateNavText = props.onUpdateNavText;
  var onUpdateQuestionText = props.onUpdateQuestionText;
  var onSelectTest = props.onSelectTest;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useLayoutEffect = React.useLayoutEffect;
  var useRef = React.useRef;
  var e = React.createElement;

  var copy = APP_DATA;
  var stepCopy = copy.steps[step] || {};
  var btns = copy.buttons;
  var colors = GRAPH_COLORS;
  var PATH_W = colors.pathStrokeWidth;

  var popData = toData(GRAPH_DATA.population);
  var s1Data = toData(GRAPH_DATA.sample1);
  var s2Data = toData(GRAPH_DATA.sample2);

  var popLayout = graphLayout(POP_SVG_H, GRAPH_DATA.popYRange.max);
  var samLayout = graphLayout(SAM_SVG_H, GRAPH_DATA.sampleYRange.max);

  var popPts = getPathPoints(popData, popLayout);
  var s1Pts = getPathPoints(s1Data, popLayout);
  var s2Pts = getPathPoints(s2Data, popLayout);
  var popPathD = ptsToPathD(popPts);
  var s1PathD = ptsToPathD(s1Pts);
  var s2PathD = ptsToPathD(s2Pts);
  var popFillD = fillPathD(popPts, popLayout.baseY);
  var s1FillD = fillPathD(s1Pts, popLayout.baseY);
  var s2FillD = fillPathD(s2Pts, popLayout.baseY);

  var isStep2 = step === 2;
  var isA1 = step === "A1";
  var isA2 = step === "A2";
  var isA3 = step === "A3";
  var showOverlapDefault =
    startAtFinal || isA1 || isA2 || isA3 || (isStep2 && startAtFinal);

  var _leftPop = useState(step !== 1 && showOverlapDefault);
  var leftPopVisible = _leftPop[0];
  var setLeftPopVisible = _leftPop[1];

  var _intro = useState(step === 1 || (isStep2 && !startAtFinal));
  var showIntro = _intro[0];
  var setShowIntro = _intro[1];

  var _samples = useState(step === 1 || (isStep2 && !startAtFinal));
  var showSamplesPanel = _samples[0];
  var setShowSamplesPanel = _samples[1];

  var _overlap = useState(showOverlapDefault);
  var showOverlap = _overlap[0];
  var setShowOverlap = _overlap[1];

  var _buttons = useState((isStep2 && startAtFinal) || isA1 || isA2 || isA3);
  var showButtonRows = _buttons[0];
  var setShowButtonRows = _buttons[1];

  var _mainNudges = useState(false);
  var showMainNudges = _mainNudges[0];
  var setShowMainNudges = _mainNudges[1];

  var _drawNudges = useState(false);
  var showDrawNudges = _drawNudges[0];
  var setShowDrawNudges = _drawNudges[1];

  var _drawnPop = useState((isA1 && startAtFinal) || isA2);
  var drawnPop = _drawnPop[0];
  var setDrawnPop = _drawnPop[1];
  var _drawnS1 = useState((isA1 && startAtFinal) || isA2);
  var drawnS1 = _drawnS1[0];
  var setDrawnS1 = _drawnS1[1];
  var _drawnS2 = useState((isA1 && startAtFinal) || isA2);
  var drawnS2 = _drawnS2[0];
  var setDrawnS2 = _drawnS2[1];

  var _drawReady = useState(false);
  var drawReady = _drawReady[0];
  var setDrawReady = _drawReady[1];

  var _drawing = useState(false);
  var isDrawing = _drawing[0];
  var setIsDrawing = _drawing[1];

  var _mcqTarget = useState(isA2 && startAtFinal ? "done" : "s1");
  var mcqTarget = _mcqTarget[0];
  var setMcqTarget = _mcqTarget[1];

  var _s1Sel = useState(isA2 && startAtFinal ? "fail" : null);
  var s1Selected = _s1Sel[0];
  var setS1Selected = _s1Sel[1];
  var _s2Sel = useState(isA2 && startAtFinal ? "pass" : null);
  var s2Selected = _s2Sel[0];
  var setS2Selected = _s2Sel[1];

  var _s1Retry = useState(false);
  var s1Retry = _s1Retry[0];
  var setS1Retry = _s1Retry[1];
  var _s2Retry = useState(false);
  var s2Retry = _s2Retry[0];
  var setS2Retry = _s2Retry[1];

  var _s1Lock = useState(!!(isA2 && startAtFinal));
  var s1Locked = _s1Lock[0];
  var setS1Locked = _s1Lock[1];
  var _s2Lock = useState(!!(isA2 && startAtFinal));
  var s2Locked = _s2Lock[0];
  var setS2Locked = _s2Lock[1];

  var _fb = useState(null);
  var feedbackSide = _fb[0];
  var setFeedbackSide = _fb[1];

  var _s1Box = useState(!!(isA2 && startAtFinal) || isA3);
  var showS1Box = _s1Box[0];
  var setShowS1Box = _s1Box[1];
  var _s2Box = useState(!!(isA2 && startAtFinal) || isA3);
  var showS2Box = _s2Box[0];
  var setShowS2Box = _s2Box[1];

  var _busy = useState(false);
  var mcqBusy = _busy[0];
  var setMcqBusy = _busy[1];

  var _hideSampleSources = useState(false);
  var hideSampleSources = _hideSampleSources[0];
  var setHideSampleSources = _hideSampleSources[1];

  var introRef = useRef(null);
  var leftSvgRef = useRef(null);
  var rightSvgRef = useRef(null);
  var s1SvgRef = useRef(null);
  var s2SvgRef = useRef(null);

  var leftPopPathRef = useRef(null);
  var leftPopFillRef = useRef(null);
  var leftPopClipRef = useRef(null);
  var leftSamPathRef = useRef(null);
  var leftSamFillRef = useRef(null);
  var leftSamClipRef = useRef(null);
  var rightPopPathRef = useRef(null);
  var rightPopFillRef = useRef(null);
  var rightPopClipRef = useRef(null);
  var rightSamPathRef = useRef(null);
  var rightSamFillRef = useRef(null);
  var rightSamClipRef = useRef(null);

  var shapeBtnRef = useRef(null);
  var centreBtnRef = useRef(null);
  var spreadBtnRef = useRef(null);
  var drawPopBtnRef = useRef(null);
  var drawS1BtnRef = useRef(null);
  var drawS2BtnRef = useRef(null);
  var s1FailBtnRef = useRef(null);
  var s2PassBtnRef = useRef(null);
  var s1BoxRef = useRef(null);
  var s2BoxRef = useRef(null);

  var cloneElsRef = useRef([]);
  var mountedRef = useRef(true);
  var drawEmergedRef = useRef(false);
  var drawnRef = useRef({
    pop: (isA1 && startAtFinal) || isA2,
    s1: (isA1 && startAtFinal) || isA2,
    s2: (isA1 && startAtFinal) || isA2,
  });
  var timersRef = useRef([]);

  function addTimer(id) {
    timersRef.current.push(id);
    return id;
  }

  function flyThumbToBox(fromEl, toEl, emoji, done) {
    if (!fromEl || !toEl) {
      if (done) done();
      return;
    }
    var fromRect = fromEl.getBoundingClientRect();
    var toRect = toEl.getBoundingClientRect();
    var clone = document.createElement("div");
    clone.className = "flying-thumb";
    clone.textContent = emoji;
    clone.style.left = fromRect.left + fromRect.width / 2 + "px";
    clone.style.top = fromRect.top + fromRect.height / 2 + "px";
    document.body.appendChild(clone);
    cloneElsRef.current.push(clone);
    gsap.fromTo(
      clone,
      { xPercent: -50, yPercent: -50, scale: 1.15, opacity: 1 },
      {
        left: toRect.left + toRect.width / 2,
        top: toRect.top + toRect.height / 2,
        scale: 0.72,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: function () {
          if (clone.parentNode) clone.parentNode.removeChild(clone);
          var idx = cloneElsRef.current.indexOf(clone);
          if (idx !== -1) cloneElsRef.current.splice(idx, 1);
          if (mountedRef.current && done) done();
        },
      },
    );
  }

  function clearClones() {
    cloneElsRef.current.forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    cloneElsRef.current = [];
  }

  function appendClone(svgEl) {
    var rect = svgEl.getBoundingClientRect();
    var clone = svgEl.cloneNode(true);
    clone.classList.add("flying-clone");
    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.margin = "0";
    clone.style.padding = "0";
    clone.style.zIndex = "400";
    clone.style.pointerEvents = "none";
    clone.style.transformOrigin = "0 0";
    document.body.appendChild(clone);
    cloneElsRef.current.push(clone);
    return { clone: clone, rect: rect };
  }

  function showOutlineNow(pathEl, fillEl, clipEl, stroke) {
    if (pathEl) {
      pathEl.classList.remove("blink-green", "blink-red");
      gsap.set(pathEl, {
        opacity: 1,
        attr: {
          stroke: stroke,
          "stroke-width": PATH_W,
          "stroke-dashoffset": 0,
          "stroke-dasharray": "none",
        },
      });
    }
    if (fillEl) gsap.set(fillEl, { opacity: 1 });
    if (clipEl) gsap.set(clipEl, { attr: { height: POP_SVG_H } });
  }

  function hideOutline(pathEl, fillEl, clipEl) {
    if (pathEl) {
      pathEl.classList.remove("blink-green", "blink-red");
      gsap.set(pathEl, { opacity: 0 });
    }
    if (fillEl) gsap.set(fillEl, { opacity: 0 });
    if (clipEl) gsap.set(clipEl, { attr: { height: 0 } });
  }

  function applyBlink(pathEl, fillEl, mode, normalStroke) {
    if (!pathEl) return;
    pathEl.classList.remove("blink-green", "blink-red");
    if (mode === "red") {
      gsap.to(pathEl, {
        attr: { stroke: colors.blinkRed, "stroke-width": PATH_W },
        duration: 0.35,
      });
      pathEl.classList.add("blink-red");
    } else if (mode === "green") {
      gsap.to(pathEl, {
        attr: { stroke: colors.blinkGreen, "stroke-width": PATH_W },
        duration: 0.35,
      });
      pathEl.classList.add("blink-green");
    } else {
      gsap.to(pathEl, {
        attr: { stroke: normalStroke, "stroke-width": PATH_W },
        duration: 0.35,
      });
    }
  }

  function animateOutline(pathEl, fillEl, clipEl, done) {
    if (!pathEl) {
      if (done) done();
      return;
    }
    var len = pathEl.getTotalLength();
    gsap.set(pathEl, {
      attr: { "stroke-dasharray": len, "stroke-dashoffset": len },
      opacity: 1,
    });
    var tl = gsap.timeline({
      onComplete: function () {
        if (done) done();
      },
    });
    tl.to(pathEl, {
      attr: { "stroke-dashoffset": 0 },
      duration: 1.2,
      ease: "none",
    });
    tl.call(
      function () {
        if (fillEl) gsap.set(fillEl, { opacity: 1 });
      },
      null,
      "+=0.4",
    );
    if (clipEl) {
      tl.to(clipEl, {
        attr: { height: POP_SVG_H },
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }

  function revealAllOutlines() {
    showOutlineNow(
      leftPopPathRef.current,
      leftPopFillRef.current,
      leftPopClipRef.current,
      colors.popStroke,
    );
    showOutlineNow(
      rightPopPathRef.current,
      rightPopFillRef.current,
      rightPopClipRef.current,
      colors.popStroke,
    );
    showOutlineNow(
      leftSamPathRef.current,
      leftSamFillRef.current,
      leftSamClipRef.current,
      colors.s1Stroke,
    );
    showOutlineNow(
      rightSamPathRef.current,
      rightSamFillRef.current,
      rightSamClipRef.current,
      colors.s2Stroke,
    );
  }

  function clearAllOutlines() {
    hideOutline(
      leftPopPathRef.current,
      leftPopFillRef.current,
      leftPopClipRef.current,
    );
    hideOutline(
      rightPopPathRef.current,
      rightPopFillRef.current,
      rightPopClipRef.current,
    );
    hideOutline(
      leftSamPathRef.current,
      leftSamFillRef.current,
      leftSamClipRef.current,
    );
    hideOutline(
      rightSamPathRef.current,
      rightSamFillRef.current,
      rightSamClipRef.current,
    );
  }

  useEffect(
    function () {
      mountedRef.current = true;
      return function () {
        mountedRef.current = false;
        timersRef.current.forEach(function (id) {
          clearTimeout(id);
        });
        clearClones();
      };
    },
    [],
  );

  useEffect(
    function () {
      if (step === 1) {
        onSetNextEnabled(true);
        onSetNavLocked(false);
        return;
      }

      if (isStep2) {
        onSetNextEnabled(false);
        drawnRef.current = { pop: false, s1: false, s2: false };
        setDrawnPop(false);
        setDrawnS1(false);
        setDrawnS2(false);
        setDrawReady(false);
        drawEmergedRef.current = false;
        setShowDrawNudges(false);
        setShowMainNudges(false);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
          }, 40),
        );
        if (startAtFinal) {
          setLeftPopVisible(true);
          setShowIntro(false);
          setShowSamplesPanel(false);
          setShowOverlap(true);
          setShowButtonRows(true);
          onSetNavLocked(false);
          onUpdateQuestionText(copy.steps[2].afterAnimQuestion);
          onUpdateNavText(copy.steps[2].afterAnimNav);
          addTimer(
            setTimeout(function () {
              setShowMainNudges(true);
            }, 200),
          );
          return;
        }
        onSetNavLocked(true);
        onUpdateNavText(" ");
        addTimer(setTimeout(runStep2Animation, 140));
        return;
      }

      if (isA1) {
        setLeftPopVisible(true);
        setShowIntro(false);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        onSetNextEnabled(false);
        if (startAtFinal) {
          drawnRef.current = { pop: true, s1: true, s2: true };
          setDrawnPop(true);
          setDrawnS1(true);
          setDrawnS2(true);
          setDrawReady(true);
          drawEmergedRef.current = true;
          addTimer(
            setTimeout(function () {
              revealAllOutlines();
              onUpdateQuestionText(copy.steps.A1.afterAllDrawnQuestion);
              onUpdateNavText(copy.steps.A1.afterAllDrawnNav);
              onSetNextEnabled(true);
              onSetNavLocked(false);
            }, 80),
          );
          return;
        }
        onSetNavLocked(true);
        onUpdateNavText("");
        return;
      }

      if (isA2) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        addTimer(
          setTimeout(function () {
            revealAllOutlines();
            if (startAtFinal) {
              setLeftPathsBlink("red");
              setRightPathsBlink("green");
            }
          }, 80),
        );
        if (startAtFinal) {
          onUpdateQuestionText(copy.steps.A2.afterBothQuestion);
          onUpdateNavText(copy.steps.A2.afterBothNav);
          onSetNextEnabled(true);
          onSetNavLocked(false);
          return;
        }
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.A2.questionText);
        onUpdateNavText(copy.steps.A2.navText);
        return;
      }

      if (isA3) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
          }, 80),
        );
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.A3.questionText);
        onUpdateNavText(null);
      }
    },
    [step, startAtFinal],
  );

  useLayoutEffect(
    function () {
      if (!isA1 || startAtFinal) return;
      if (drawEmergedRef.current) return;
      runDrawButtonsEmerge();
    },
    [isA1, startAtFinal],
  );

  function runStep2Animation() {
    var intro = introRef.current;
    var tl = gsap.timeline({
      onComplete: function () {
        if (!mountedRef.current) return;
        setShowIntro(false);
        flyPopulationClone(function () {
          if (!mountedRef.current) return;
          flySampleClones(function () {
            if (!mountedRef.current) return;
            setShowOverlap(true);
            setShowSamplesPanel(false);
            setShowButtonRows(true);
            onUpdateQuestionText(copy.steps[2].afterAnimQuestion);
            onUpdateNavText(copy.steps[2].afterAnimNav);
            onSetNavLocked(false);
            setShowMainNudges(true);
          });
        });
      },
    });
    if (intro) {
      tl.to(intro, {
        x: "-120%",
        opacity: 0,
        duration: 0.55,
        ease: "power2.in",
      });
    } else {
      tl.to({}, { duration: 0.05 });
    }
  }

  function flyPopulationClone(done) {
    var src = rightSvgRef.current;
    var tgt = leftSvgRef.current;
    if (!src || !tgt) {
      setLeftPopVisible(true);
      if (done) done();
      return;
    }
    var packed = appendClone(src);
    var so = originRect(src);
    var to = originRect(tgt);
    gsap.to(packed.clone, {
      x: to.left - so.left,
      y: to.top - so.top,
      duration: 0.85,
      ease: "power2.inOut",
      onComplete: function () {
        setLeftPopVisible(true);
        gsap.to(packed.clone, {
          opacity: 0,
          duration: 0.18,
          onComplete: function () {
            if (packed.clone.parentNode) packed.clone.parentNode.removeChild(packed.clone);
            if (done) done();
          },
        });
      },
    });
  }

  function flyOneSample(srcSvg, tgtSvg, onStart, done) {
    if (!srcSvg || !tgtSvg) {
      if (done) done();
      return;
    }
    var packed = appendClone(srcSvg);
    if (onStart) onStart();
    var so = originRect(srcSvg);
    var to = originRect(tgtSvg);
    var scaleY = pixelsPerY(tgtSvg) / Math.max(pixelsPerY(srcSvg), 0.001);
    var originX = so.left - packed.rect.left;
    var originY = so.top - packed.rect.top;
    gsap.set(packed.clone, {
      transformOrigin: originX + "px " + originY + "px",
    });
    gsap.to(packed.clone, {
      x: to.left - so.left,
      y: to.top - so.top,
      scaleY: scaleY,
      duration: 1.05,
      ease: "power2.inOut",
      onComplete: function () {
        if (packed.clone.parentNode) packed.clone.parentNode.removeChild(packed.clone);
        if (done) done();
      },
    });
  }

  function flySampleClones(done) {
    var pending = 2;
    function oneDone() {
      pending -= 1;
      if (pending <= 0 && done) done();
    }
    var started = false;
    function hideSources() {
      if (started) return;
      started = true;
      setHideSampleSources(true);
    }
    flyOneSample(s1SvgRef.current, leftSvgRef.current, hideSources, oneDone);
    flyOneSample(s2SvgRef.current, rightSvgRef.current, hideSources, oneDone);
  }

  function runDrawButtonsEmerge() {
    var shape = shapeBtnRef.current;
    var buttons = [
      drawPopBtnRef.current,
      drawS1BtnRef.current,
      drawS2BtnRef.current,
    ];
    if (!shape || !buttons[0] || !buttons[1] || !buttons[2]) {
      setDrawReady(true);
      setShowDrawNudges(true);
      onUpdateNavText(copy.steps.A1.afterButtonsNav);
      onSetNavLocked(false);
      return;
    }

    drawEmergedRef.current = true;
    gsap.killTweensOf(buttons);
    gsap.set(buttons, { x: 0, y: 0, scale: 1, clearProps: "transform" });

    var sr = shape.getBoundingClientRect();
    var sx = sr.left + sr.width / 2;
    var sy = sr.top + sr.height / 2;

    var deltas = buttons.map(function (btn) {
      var r = btn.getBoundingClientRect();
      return {
        x: sx - (r.left + r.width / 2),
        y: sy - (r.top + r.height / 2),
      };
    });

    buttons.forEach(function (btn, i) {
      gsap.set(btn, {
        x: deltas[i].x,
        y: deltas[i].y,
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
      });
    });

    gsap.to(buttons, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.75,
      ease: "power2.out",
      stagger: 0.07,
      overwrite: true,
      onComplete: function () {
        if (!mountedRef.current) return;
        gsap.set(buttons, { clearProps: "transform,opacity" });
        setDrawReady(true);
        setShowDrawNudges(true);
        onUpdateNavText(copy.steps.A1.afterButtonsNav);
        onSetNavLocked(false);
      },
    });
  }

  function finishDraw() {
    if (!mountedRef.current) return;
    setIsDrawing(false);
    onSetNavLocked(false);
    if (drawnRef.current.pop && drawnRef.current.s1 && drawnRef.current.s2) {
      onUpdateQuestionText(copy.steps.A1.afterAllDrawnQuestion);
      onUpdateNavText(copy.steps.A1.afterAllDrawnNav);
      onSetNextEnabled(true);
    }
  }

  function handleDraw(kind) {
    if (isDrawing || drawnRef.current[kind]) return;
    if (typeof playSound === "function") playSound("click");
    setShowDrawNudges(false);
    setIsDrawing(true);
    drawnRef.current[kind] = true;
    if (kind === "pop") setDrawnPop(true);
    if (kind === "s1") setDrawnS1(true);
    if (kind === "s2") setDrawnS2(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    if (kind === "pop") {
      var pending = 2;
      function oneDone() {
        pending -= 1;
        if (pending <= 0) finishDraw();
      }
      animateOutline(
        leftPopPathRef.current,
        leftPopFillRef.current,
        leftPopClipRef.current,
        oneDone,
      );
      animateOutline(
        rightPopPathRef.current,
        rightPopFillRef.current,
        rightPopClipRef.current,
        oneDone,
      );
      return;
    }
    if (kind === "s1") {
      animateOutline(
        leftSamPathRef.current,
        leftSamFillRef.current,
        leftSamClipRef.current,
        function () {
          finishDraw();
        },
      );
      return;
    }
    animateOutline(
      rightSamPathRef.current,
      rightSamFillRef.current,
      rightSamClipRef.current,
      function () {
        finishDraw();
      },
    );
  }

  function handleMainClick(id) {
    if (isStep2) {
      if (typeof playSound === "function") playSound("click");
      setShowMainNudges(false);
      if (onSelectTest) onSelectTest(id);
      return;
    }
    if (isA3 && (id === "centre" || id === "spread")) {
      if (typeof playSound === "function") playSound("click");
    }
  }

  function setLeftPathsBlink(mode) {
    applyBlink(
      leftPopPathRef.current,
      leftPopFillRef.current,
      mode,
      colors.popStroke,
    );
    applyBlink(
      leftSamPathRef.current,
      leftSamFillRef.current,
      mode,
      colors.s1Stroke,
    );
  }

  function setRightPathsBlink(mode) {
    applyBlink(
      rightPopPathRef.current,
      rightPopFillRef.current,
      mode,
      colors.popStroke,
    );
    applyBlink(
      rightSamPathRef.current,
      rightSamFillRef.current,
      mode,
      colors.s2Stroke,
    );
  }

  function handleMcq(side, option) {
    if (mcqBusy) return;
    if (side === "s1") {
      if (s1Locked || mcqTarget !== "s1") return;
      if (s1Retry && option !== "fail") return;
      if (typeof playSound === "function") playSound("click");
      setS1Selected(option);
      setLeftPathsBlink("red");
      if (option !== "fail") {
        if (typeof playSound === "function") playSound("wrong");
        setS1Retry(true);
        setFeedbackSide("right");
        return;
      }
      if (typeof playSound === "function") playSound("correct");
      setFeedbackSide(null);
      setS1Locked(true);
      setMcqBusy(true);
      flyThumbToBox(s1FailBtnRef.current, s1BoxRef.current, "👎", function () {
        if (!mountedRef.current) return;
        setShowS1Box(true);
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current) return;
            setLeftPathsBlink("normal");
            setMcqTarget("s2");
            onUpdateQuestionText(copy.steps.A2.questionTextS2);
            setMcqBusy(false);
          }, 1000),
        );
      });
      return;
    }

    if (s2Locked || mcqTarget !== "s2") return;
    if (s2Retry && option !== "pass") return;
    if (typeof playSound === "function") playSound("click");
    setS2Selected(option);
    setRightPathsBlink("green");
    if (option !== "pass") {
      if (typeof playSound === "function") playSound("wrong");
      setS2Retry(true);
      setFeedbackSide("left");
      return;
    }
    if (typeof playSound === "function") playSound("correct");
    setFeedbackSide(null);
    setS2Locked(true);
    setMcqBusy(true);
    flyThumbToBox(s2PassBtnRef.current, s2BoxRef.current, "👍", function () {
      if (!mountedRef.current) return;
      setShowS2Box(true);
      setMcqTarget("done");
      setLeftPathsBlink("red");
      setRightPathsBlink("green");
      onUpdateQuestionText(copy.steps.A2.afterBothQuestion);
      onUpdateNavText(copy.steps.A2.afterBothNav);
      onSetNextEnabled(true);
      setMcqBusy(false);
    });
  }

  function renderAxes(layout, yStep) {
    var items = [];
    items.push(
      e("line", {
        key: "ya",
        x1: ML,
        y1: layout.yP(layout.yMax),
        x2: ML,
        y2: layout.baseY,
        stroke: "white",
        strokeWidth: 1.5,
      }),
    );
    items.push(
      e("line", {
        key: "xa",
        x1: ML,
        y1: layout.baseY,
        x2: ML + layout.pW,
        y2: layout.baseY,
        stroke: "white",
        strokeWidth: 1.5,
      }),
    );
    for (var yv = 0; yv <= layout.yMax; yv += yStep) {
      var yy = layout.yP(yv);
      items.push(
        e(
          "text",
          {
            key: "yl" + yv,
            x: ML - 12,
            y: yy + 8,
            textAnchor: "end",
            fill: "#ffffff",
            fontSize: AXIS_LABEL_SIZE,
            fontWeight: 600,
          },
          yv,
        ),
      );
      items.push(
        e("line", {
          key: "yt" + yv,
          x1: ML - 8,
          y1: yy,
          x2: ML,
          y2: yy,
          stroke: "white",
          strokeWidth: Y_TICK_STROKE,
        }),
      );
    }
    for (var xv = 1; xv <= 12; xv++) {
      items.push(
        e(
          "text",
          {
            key: "xl" + xv,
            x: layout.xP(xv),
            y: layout.baseY + 30,
            textAnchor: "middle",
            fill: "#ffffff",
            fontSize: AXIS_LABEL_SIZE,
            fontWeight: 600,
          },
          xv,
        ),
      );
    }
    items.push(
      e("circle", {
        key: "origin",
        className: "plot-origin",
        cx: ML,
        cy: layout.baseY,
        r: 0.5,
        fill: "none",
        opacity: 0,
      }),
    );
    items.push(
      e("circle", {
        key: "yunit",
        className: "plot-y-unit",
        cx: ML,
        cy: layout.yP(1),
        r: 0.5,
        fill: "none",
        opacity: 0,
      }),
    );
    return items;
  }

  function renderBars(data, layout, color, keyPrefix) {
    var prefix = keyPrefix || "b";
    return data.map(function (d, i) {
      if (!d.y) return null;
      return e("rect", {
        key: prefix + i,
        x: layout.xP(d.x) - layout.barW / 2,
        y: layout.yP(d.y),
        width: layout.barW,
        height: d.y * layout.ySc,
        fill: color,
      });
    });
  }

  function renderSampleGraph(kind) {
    var isS1 = kind === "s1";
    var data = isS1 ? s1Data : s2Data;
    var color = isS1 ? colors.s1Bar : colors.s2Bar;
    var svgRef = isS1 ? s1SvgRef : s2SvgRef;
    var ch = renderAxes(samLayout, GRAPH_DATA.sampleYRange.step);
    ch.push.apply(ch, renderBars(data, samLayout, color, kind + "-b"));
    return e(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_W + " " + SAM_SVG_H,
        className: "bar-graph-svg",
        preserveAspectRatio: "none",
      },
      ch,
    );
  }

  function renderPopGraph(side) {
    var isLeft = side === "left";
    var svgRef = isLeft ? leftSvgRef : rightSvgRef;
    var sampleData = isLeft ? s1Data : s2Data;
    var sampleColor = isLeft ? colors.s1Bar : colors.s2Bar;
    var sampleStroke = isLeft ? colors.s1Stroke : colors.s2Stroke;
    var sampleFill = isLeft ? colors.s1Fill : colors.s2Fill;
    var samplePathD = isLeft ? s1PathD : s2PathD;
    var sampleFillD = isLeft ? s1FillD : s2FillD;
    var popPathRef = isLeft ? leftPopPathRef : rightPopPathRef;
    var popFillRef = isLeft ? leftPopFillRef : rightPopFillRef;
    var popClipRef = isLeft ? leftPopClipRef : rightPopClipRef;
    var samPathRef = isLeft ? leftSamPathRef : rightSamPathRef;
    var samFillRef = isLeft ? leftSamFillRef : rightSamFillRef;
    var samClipRef = isLeft ? leftSamClipRef : rightSamClipRef;
    var popClipId = "pop-clip-" + side;
    var samClipId = "sam-clip-" + side;

    var ch = [];
    ch.push(
      e(
        "defs",
        { key: "defs" },
        e(
          "clipPath",
          { id: popClipId },
          e("rect", {
            ref: popClipRef,
            x: 0,
            y: 0,
            width: SVG_W,
            height: 0,
          }),
        ),
        e(
          "clipPath",
          { id: samClipId },
          e("rect", {
            ref: samClipRef,
            x: 0,
            y: 0,
            width: SVG_W,
            height: 0,
          }),
        ),
      ),
    );
    ch.push.apply(ch, renderAxes(popLayout, GRAPH_DATA.popYRange.step));
    ch.push.apply(ch, renderBars(popData, popLayout, colors.popBar, "pop-b"));
    ch.push(
      e("path", {
        key: "pf",
        ref: popFillRef,
        d: popFillD,
        fill: colors.popFill,
        opacity: 0,
        clipPath: "url(#" + popClipId + ")",
      }),
    );
    if (showOverlap) {
      ch.push.apply(
        ch,
        renderBars(sampleData, popLayout, sampleColor, "sam-b"),
      );
      ch.push(
        e("path", {
          key: "sf",
          ref: samFillRef,
          d: sampleFillD,
          fill: sampleFill,
          opacity: 0,
          clipPath: "url(#" + samClipId + ")",
        }),
      );
    }
    ch.push(
      e("path", {
        key: "pp",
        ref: popPathRef,
        d: popPathD,
        fill: "none",
        stroke: colors.popStroke,
        strokeWidth: PATH_W,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        opacity: 0,
      }),
    );
    ch.push(
      e("path", {
        key: "sp",
        ref: samPathRef,
        d: samplePathD,
        fill: "none",
        stroke: sampleStroke,
        strokeWidth: PATH_W,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        opacity: 0,
      }),
    );

    return e(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_W + " " + POP_SVG_H,
        className: "bar-graph-svg",
        preserveAspectRatio: "none",
      },
      ch,
    );
  }

  function mcqBtnClass(side, option) {
    var cls = "mcq-btn";
    var selected = side === "s1" ? s1Selected : s2Selected;
    var retry = side === "s1" ? s1Retry : s2Retry;
    var locked = side === "s1" ? s1Locked : s2Locked;
    var correct = side === "s1" ? "fail" : "pass";
    if (selected === option) {
      cls += option === correct ? " correct" : " wrong";
    }
    if (retry && option !== correct) cls += " wrong";
    if (locked || isDrawing || mcqBusy) cls += " disabled";
    return cls;
  }

  function mcqDisabled(side, option) {
    if (isDrawing || mcqBusy) return true;
    if (side === "s1") {
      if (s1Locked || mcqTarget !== "s1") return true;
      if (s1Retry && option !== "fail") return true;
      return false;
    }
    if (s2Locked || mcqTarget !== "s2") return true;
    if (s2Retry && option !== "pass") return true;
    return false;
  }

  function renderMcqHalf(side) {
    var dim =
      (mcqTarget !== "done" && side !== mcqTarget);
    var cls = "mcq-half";
    if (dim) cls += " is-dim";
    return e(
      "div",
      { className: cls },
      e(
        "button",
        {
          ref: side === "s1" ? undefined : s2PassBtnRef,
          className: mcqBtnClass(side, "pass"),
          disabled: mcqDisabled(side, "pass"),
          onClick: mcqDisabled(side, "pass")
            ? undefined
            : function () {
                handleMcq(side, "pass");
              },
        },
        btns.pass,
      ),
      e(
        "button",
        {
          ref: side === "s1" ? s1FailBtnRef : undefined,
          className: mcqBtnClass(side, "fail"),
          disabled: mcqDisabled(side, "fail"),
          onClick: mcqDisabled(side, "fail")
            ? undefined
            : function () {
                handleMcq(side, "fail");
              },
        },
        btns.fail,
      ),
    );
  }

  var leftDim = isA2 && mcqTarget === "s2";
  var rightDim = isA2 && mcqTarget === "s1";

  var shapeExplored = isA1 || isA2 || isA3;
  var shapeDehighlighted = isA3;
  var othersDehighlighted = isA1 || isA2;

  function mainBtnClass(id) {
    var cls = "main-btn " + id;
    if (id === "shape" && shapeExplored) cls += " explored";
    if (id === "shape" && shapeDehighlighted) cls += " dehighlighted";
    if (id !== "shape" && othersDehighlighted) cls += " dehighlighted";
    return cls;
  }

  var showResultBoxes = isA2 || isA3;

  var graphRow = e(
    "div",
    { className: "graph-row" },
    e(
      "div",
      { className: "graph-half" },
      e(
        "div",
        {
          className: "graph-dim-wrap",
          style: {
            opacity: leftPopVisible ? (leftDim ? 0.2 : 1) : 0,
          },
        },
        renderPopGraph("left"),
      ),
      showIntro
        ? e("div", {
            className: "intro-text-box",
            ref: introRef,
            dangerouslySetInnerHTML: { __html: copy.introBoxText },
          })
        : null,
      isA2 && feedbackSide === "left"
        ? e("div", { className: "feedback-box" }, copy.steps.A2.feedbackS2)
        : null,
    ),
    e(
      "div",
      { className: "graph-half" },
      e(
        "div",
        {
          className: "graph-dim-wrap",
          style: { opacity: rightDim ? 0.2 : 1 },
        },
        renderPopGraph("right"),
      ),
      isA2 && feedbackSide === "right"
        ? e("div", { className: "feedback-box" }, copy.steps.A2.feedbackS1)
        : null,
    ),
  );

  var samplesRow = e(
    "div",
    {
      className: "samples-panel",
      style: hideSampleSources ? { opacity: 0 } : undefined,
    },
    e(
      "div",
      { className: "graph-half" },
      e("div", { className: "sample-label" }, copy.sample1Label),
      renderSampleGraph("s1"),
    ),
    e(
      "div",
      { className: "graph-half" },
      e("div", { className: "sample-label" }, copy.sample2Label),
      renderSampleGraph("s2"),
    ),
  );

  var drawButtons =     e(
      "div",
      { className: "action-buttons-row", key: "action-btns" },
    e("button", {
      ref: drawPopBtnRef,
      className:
        "draw-btn draw-pop" + (drawnPop ? " is-hidden" : ""),
      disabled: isDrawing || drawnPop || !drawReady,
      onClick: drawnPop || isDrawing || !drawReady ? undefined : function () { handleDraw("pop"); },
      dangerouslySetInnerHTML: { __html: btns.drawPopulation },
    }),
    e("button", {
      ref: drawS1BtnRef,
      className:
        "draw-btn draw-s1" + (drawnS1 ? " is-hidden" : ""),
      disabled: isDrawing || drawnS1 || !drawReady,
      onClick: drawnS1 || isDrawing || !drawReady ? undefined : function () { handleDraw("s1"); },
      dangerouslySetInnerHTML: { __html: btns.drawSample1 },
    }),
    e("button", {
      ref: drawS2BtnRef,
      className:
        "draw-btn draw-s2" + (drawnS2 ? " is-hidden" : ""),
      disabled: isDrawing || drawnS2 || !drawReady,
      onClick: drawnS2 || isDrawing || !drawReady ? undefined : function () { handleDraw("s2"); },
      dangerouslySetInnerHTML: { __html: btns.drawSample2 },
    }),
  );

  var mcqRow =     e(
      "div",
      { className: "action-buttons-row mcq-row", key: "mcq-row" },
    renderMcqHalf("s1"),
    renderMcqHalf("s2"),
  );

  var mainButtons =     e(
      "div",
      { className: "main-buttons-row", key: "main-btns" },
    e(
      "button",
      {
        ref: shapeBtnRef,
        className: mainBtnClass("shape"),
        onClick:
          isStep2 && !shapeExplored
            ? function () {
                handleMainClick("shape");
              }
            : undefined,
      },
      e("span", {
        className: "main-btn-label",
      }, shapeExplored ? btns.shapeWithColon : btns.shape),
      showResultBoxes
        ? e(
            "span",
            {
              ref: s1BoxRef,
              className: "result-box s1",
              style: { opacity: showS1Box ? 1 : 0 },
            },
            btns.s1Fail,
          )
        : null,
      showResultBoxes
        ? e(
            "span",
            {
              ref: s2BoxRef,
              className: "result-box s2",
              style: { opacity: showS2Box ? 1 : 0 },
            },
            btns.s2Pass,
          )
        : null,
    ),
    e(
      "button",
      {
        ref: centreBtnRef,
        className: mainBtnClass("centre"),
        onClick:
          isStep2 || isA3
            ? function () {
                handleMainClick("centre");
              }
            : undefined,
      },
      btns.centre,
    ),
    e(
      "button",
      {
        ref: spreadBtnRef,
        className: mainBtnClass("spread"),
        onClick:
          isStep2 || isA3
            ? function () {
                handleMainClick("spread");
              }
            : undefined,
      },
      btns.spread,
    ),
  );

  var actionInner = null;
  if (showSamplesPanel) {
    actionInner = samplesRow;
  } else if (showButtonRows) {
    var topRow = null;
    if (isA1) topRow = drawButtons;
    else if (isA2) topRow = mcqRow;
    else topRow = e("div", { className: "action-buttons-row", key: "action-empty" });
    actionInner = [topRow, mainButtons];
  }

  var nudges = [];
  if (showMainNudges && isStep2) {
    nudges.push(
      e(Nudge, {
        key: "n-shape",
        targetRef: shapeBtnRef,
        active: true,
        onDismiss: function () {
          setShowMainNudges(false);
        },
      }),
      e(Nudge, {
        key: "n-centre",
        targetRef: centreBtnRef,
        active: true,
        onDismiss: function () {
          setShowMainNudges(false);
        },
      }),
      e(Nudge, {
        key: "n-spread",
        targetRef: spreadBtnRef,
        active: true,
        onDismiss: function () {
          setShowMainNudges(false);
        },
      }),
    );
  }
  if (showDrawNudges && isA1 && !isDrawing) {
    nudges.push(
      e(Nudge, {
        key: "n-draw-pop",
        targetRef: drawPopBtnRef,
        active: !drawnPop,
      }),
      e(Nudge, {
        key: "n-draw-s1",
        targetRef: drawS1BtnRef,
        active: !drawnS1,
      }),
      e(Nudge, {
        key: "n-draw-s2",
        targetRef: drawS2BtnRef,
        active: !drawnS2,
      }),
    );
  }
  if (isA3) {
    nudges.push(
      e(Nudge, {
        key: "n-a3-centre",
        targetRef: centreBtnRef,
        active: true,
      }),
      e(Nudge, {
        key: "n-a3-spread",
        targetRef: spreadBtnRef,
        active: true,
      }),
    );
  }

  return e(
    "div",
    { className: "main-canvas-container" },
    graphRow,
    e("div", { className: "action-row" }, actionInner),
    nudges,
  );
};
