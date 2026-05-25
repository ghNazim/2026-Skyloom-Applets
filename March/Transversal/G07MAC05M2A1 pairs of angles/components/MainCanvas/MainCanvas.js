/* ── helpers ── */
const polarToXY = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const arcPath = (cx, cy, r, startDeg, endDeg) => {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return ["M", cx, cy, "L", s.x, s.y, "A", r, r, 0, large, 1, e.x, e.y, "Z"].join(" ");
};
const lineArcPath = (cx, cy, r, startDeg, endDeg) => {
  if (Math.abs(endDeg - startDeg) < 0.1) return "";
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return ["M", s.x, s.y, "A", r, r, 0, large, sweep, e.x, e.y].join(" ");
};

/* Line geometry */
const CX = 300, CY = 250, LINE_LEN = 220;
const HORIZ_ANGLE = 0, TILTED_ANGLE = -65;

const lineEnd = (angle, side) => {
  const a = (angle * Math.PI) / 180;
  const s = side === "left" ? -1 : 1;
  return { x: CX + s * LINE_LEN * Math.cos(a), y: CY + s * LINE_LEN * Math.sin(a) };
};

/* Angle arc data — 1=top-left, 2=top-right, 3=bottom-right, 4=bottom-left */
const ANG_R = 35, LABEL_R = 50;
const angStartEnd = [
  { id: 1, start: 180, end: 295 },
  { id: 2, start: 295, end: 360 },
  { id: 3, start: 0,   end: 115 },
  { id: 4, start: 115, end: 180 },
];
const angColors = ["#7dd3fc", "#fddcb0", "#7dd3fc", "#fddcb0"];
const labelColors = ["#7dd3fc", "#fddcb0", "#7dd3fc", "#fddcb0"];

/* Ray mapping: 0=tilted-upper, 1=horiz-right, 2=tilted-lower, 3=horiz-left */
const rayEndpoints = [
  lineEnd(TILTED_ANGLE, "right"), // actually upper right quadrant
  lineEnd(HORIZ_ANGLE, "right"),
  lineEnd(TILTED_ANGLE, "left"), // lower left quadrant
  lineEnd(HORIZ_ANGLE, "left"),
];
const rayToPair = { 0: [1, 2], 1: [2, 3], 2: [3, 4], 3: [4, 1] };
const oppositeRay = { 0: 2, 1: 3, 2: 0, 3: 1 };
const oppositeAngles = { 0: [3, 4], 1: [4, 1], 2: [1, 2], 3: [2, 3] };

/* ── component ── */
const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onNext } = props;
  const h = React.createElement;
  const { useState, useEffect, useRef } = React;

  const svgRef = useRef(null);
  const actionRef = useRef(false);
  const animatingRef = useRef(false);

  /* refs for animated SVG lines in step 1 */
  const line0VisRef = useRef(null);
  const line1VisRef = useRef(null);
  const twoLinesRef = useRef(null);

  const [phase, setPhase] = useState("init");
  const [lineColors, setLineColors] = useState({ tilted: "#ffc107", horizontal: "#ff8c42" }); // defaults, will override on click
  const [anglesVisible, setAnglesVisible] = useState([false, false, false, false]);
  const [tapTargets, setTapTargets] = useState([]);
  const [showTextColumn, setShowTextColumn] = useState(false);
  const [clickedRays, setClickedRays] = useState([]);
  const [filledRows, setFilledRows] = useState([null, null, null, null]);
  const [dehighlightedRays, setDehighlightedRays] = useState([]);
  const [tempDehighlight, setTempDehighlight] = useState(null);
  const [straightLineRay, setStraightLineRay] = useState(null);
  const [cloneAnim, setCloneAnim] = useState(null); // { rot, sourceEp, color, mkr }
  const [floatingLabels, setFloatingLabels] = useState(null); // { a1: { text, x, y, color }, a2: ... }
  
  const [clickedRows, setClickedRows] = useState([]);
  const [arcAnim, setArcAnim] = useState(null);
  const [arcTextAnim, setArcTextAnim] = useState(false);
  const [floating180, setFloating180] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [cloneAngle, setCloneAngle] = useState(null);

  const clickedRaysRef = useRef([]);
  useEffect(() => { clickedRaysRef.current = clickedRays; }, [clickedRays]);
  
  const clickedRowsRef = useRef([]);
  useEffect(() => { clickedRowsRef.current = clickedRows; }, [clickedRows]);

  const playSnd = (s) => { if (typeof playSound === "function") playSound(s); };

  /* ── TAP GIF ── */
  const showLineTaps = () => {
    setTapTargets([{ svgX: CX + 100, svgY: CY - 25 }, { svgX: CX + 100, svgY: CY + 25 }]);
  };
  const showRayTaps = (exclude) => {
    const targets = [];
    for (let i = 0; i < 4; i++) {
      if (!exclude.includes(i)) {
        const ep = rayEndpoints[i];
        targets.push({ svgX: (CX + ep.x) / 2, svgY: (CY + ep.y) / 2 });
      }
    }
    setTapTargets(targets);
  };
  const hideTaps = () => setTapTargets([]);

  const finishStepWithQuestionBlink = (stepNum) => {
    const stepData = APP_DATA.steps[stepNum];
    onUpdateTexts(stepData.navTextAfter, stepData.questionTextAfter);
    hideTaps();

    setTimeout(() => {
      const el = document.querySelector(".question-panel h2");
      if (!el) {
        onSetNextEnabled(true);
        return;
      }
      gsap.to(el, {
        opacity: 0.2,
        duration: 0.35,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          gsap.set(el, { opacity: 1 });
          onSetNextEnabled(true);
        },
      });
    }, 50);
  };

  const getTapStyles = () => {
    if (!tapTargets.length) return [];
    const svgEl = document.querySelector('.grid-svg');
    if (!svgEl) return [];
    const rect = svgEl.getBoundingClientRect();
    const pr = document.querySelector('.main-canvas-container')?.getBoundingClientRect();
    if (!pr) return [];
    const sx = rect.width / 600, sy = rect.height / 500;
    return tapTargets.map(t => ({
      left: rect.left - pr.left + t.svgX * sx,
      top: rect.top - pr.top + t.svgY * sy,
      position: 'absolute', display: 'block', pointerEvents: 'none'
    }));
  };

  /* ── STEP INIT ── */
  useEffect(() => {
    actionRef.current = false;
    animatingRef.current = false;
    if (step === 1) {
      setPhase("init");
      setAnglesVisible([false, false, false, false]);
      setShowTextColumn(false);
      setTapTargets([]);
      setLineColors({ tilted: "#ffc107", horizontal: "#ff8c42" }); // reset
      setTimeout(() => showLineTaps(), 600);
    }
    if (step === 2) {
      setPhase("rays");
      setAnglesVisible([true, true, true, true]);
      setShowTextColumn(true);
      setClickedRays([]);
      setFilledRows([null, null, null, null]);
      setDehighlightedRays([]);
      setTempDehighlight(null);
      setStraightLineRay(null);
      setTapTargets([]);
      setCloneAnim(null);
      setFloatingLabels(null);
      setTimeout(() => showRayTaps([]), 600);
    }
    if (step === 3) {
      setPhase("buttons");
      setAnglesVisible([true, true, true, true]);
      setShowTextColumn(true);
      setClickedRows([]);
      setDehighlightedRays([]);
      setTempDehighlight(null);
      setStraightLineRay(null);
      setTapTargets([]);
      setCloneAnim(null);
      setFloatingLabels(null);
      setArcAnim(null);
      setArcTextAnim(false);
      setFloating180(null);
      setActiveRow(null);
    }
    if (step === 5) {
      setPhase("angles");
      setAnglesVisible([true, true, true, true]);
      setShowTextColumn(true);
      setClickedRays([]); // Used to track clicked pairs "1,3" or "2,4"
      setFilledRows([null, null]); // Only 2 rows for Step 5
      setDehighlightedRays([]);
      setTempDehighlight(null);
      setStraightLineRay(null);
      setCloneAnim(null);
      setFloatingLabels(null);
      
      const mid2 = (angStartEnd[1].start + angStartEnd[1].end) / 2;
      const lp2 = polarToXY(CX, CY, LABEL_R + 15, mid2);
      const mid3 = (angStartEnd[2].start + angStartEnd[2].end) / 2;
      const lp3 = polarToXY(CX, CY, LABEL_R + 15, mid3);
      
      setTimeout(() => {
        setTapTargets([{ svgX: lp2.x, svgY: lp2.y }, { svgX: lp3.x, svgY: lp3.y }]);
      }, 400);
    }
    if (step === 6) {
      setPhase("angles");
      setAnglesVisible([true, true, true, true]);
      setShowTextColumn(true);
      setClickedRows([]); // Track clicked rows [0, 1]
      setTempDehighlight(null);
      setCloneAnim(null);
      setCloneAngle(null);
      setFloatingLabels(null);
      setTapTargets([]);
    }
  }, [step]);

  /* ── STEP 1: line click → animate to intersection ── */
  const handleLineClick = (lineIdx) => {
    if (step !== 1 || phase !== "init" || actionRef.current) return;
    actionRef.current = true;
    hideTaps();
    playSnd("click");

    const l0Vis = line0VisRef.current; // orange
    const l1Vis = line1VisRef.current; // yellow
    if (!l0Vis || !l1Vis) return;

    // The clicked line becomes tilted, unclicked stays horizontal
    const clickedColor = lineIdx === 0 ? "#ff8c42" : "#ffc107";
    const unclickedColor = lineIdx === 0 ? "#ffc107" : "#ff8c42";
    setLineColors({ tilted: clickedColor, horizontal: unclickedColor });

    const tl = gsap.timeline();
    if (twoLinesRef.current) {
      tl.to(twoLinesRef.current, { opacity: 0, duration: 0.3 }, 0);
    }

    const hL = lineEnd(HORIZ_ANGLE, "left"), hR = lineEnd(HORIZ_ANGLE, "right");
    const tL = lineEnd(TILTED_ANGLE, "left"), tR = lineEnd(TILTED_ANGLE, "right");

    if (lineIdx === 0) {
      // Orange tilts, Yellow horizontal
      tl.to(l0Vis, { attr: { x1: tL.x, y1: tL.y, x2: tR.x, y2: tR.y }, duration: 0.8, ease: "power2.inOut" }, 0);
      tl.to(l1Vis, { attr: { x1: hL.x, y1: hL.y, x2: hR.x, y2: hR.y }, duration: 0.8, ease: "power2.inOut" }, 0);
    } else {
      // Yellow tilts, Orange horizontal
      tl.to(l1Vis, { attr: { x1: tL.x, y1: tL.y, x2: tR.x, y2: tR.y }, duration: 0.8, ease: "power2.inOut" }, 0);
      tl.to(l0Vis, { attr: { x1: hL.x, y1: hL.y, x2: hR.x, y2: hR.y }, duration: 0.8, ease: "power2.inOut" }, 0);
    }

    tl.call(() => {
      setPhase("intersected");
      const angTl = gsap.timeline({
        onComplete: () => {
          setPhase("anglesShown");
          onUpdateTexts(APP_DATA.steps[1].navTextAfter, APP_DATA.steps[1].questionTextAfter);
          onSetNextEnabled(true);
        }
      });
      for (let i = 0; i < 4; i++) {
        angTl.call(() => {
          setAnglesVisible(prev => { const n = [...prev]; n[i] = true; return n; });
          playSnd("tick");
        }, null, i * 0.4);
      }
    });
  };

  /* ── STEP 2: ray click → full animation sequence ── */
  const handleRayClick = (rayIdx) => {
    if (step !== 2 || animatingRef.current) return;
    if (clickedRaysRef.current.includes(rayIdx)) return;
    animatingRef.current = true;
    hideTaps();
    playSnd("click");

    const pair = rayToPair[rayIdx];       
    const oppRayIdx = oppositeRay[rayIdx]; 
    const oppAngs = oppositeAngles[rayIdx]; 
    const rayColors = [lineColors.tilted, lineColors.horizontal, lineColors.tilted, lineColors.horizontal];
    const rayMkrs = ["url(#arrow-tilted-e)", "url(#arrow-horizontal-e)", "url(#arrow-tilted-e)", "url(#arrow-horizontal-e)"];

    // 1. Dehighlight the opposite ray AND the non-adjacent angles
    setTempDehighlight({ ray: oppRayIdx, angles: oppAngs });

    const tl = gsap.timeline();

    // 2. Blink the 2 adjacent angles' paths (not the labels)
    const blinkSel = pair.map(id => `.angle-arc-${id} path`).join(", ");
    tl.to(blinkSel, { fillOpacity: 0.1, duration: 0.4, yoyo: true, repeat: 5 });

    // 2.5 Add a 2 sec delay before starting the ray clone rotate animation
    tl.to({}, { duration: .5 });

    // 3. Clone ray and rotate
    tl.call(() => {
      // The clone source is the previous ray (counter-clockwise), rotating to the next ray
      const cloneSourceIdx = (rayIdx + 3) % 4; 
      const cloneTargetIdx = (rayIdx + 1) % 4; 
      
      const sourceEp = rayEndpoints[cloneSourceIdx];
      
      setCloneAnim({
        rot: 0,
        sourceEp,
        color: rayColors[cloneSourceIdx],
        mkr: rayMkrs[cloneSourceIdx]
      });

      const proxy = { rot: 0 };
      gsap.to(proxy, {
        rot: 180, duration: 0.8, ease: "power2.inOut",
        onUpdate: () => setCloneAnim(prev => prev ? { ...prev, rot: proxy.rot } : null),
        onComplete: () => {
          setCloneAnim(null);
          setStraightLineRay(cloneTargetIdx);
          
          // Wait 0.4 sec before starting the text moving animation
          setTimeout(() => {
            startLabelAnimation(pair, cloneTargetIdx, rayIdx);
          }, 400);
        }
      });
    });
  };

  const startLabelAnimation = (pair, cloneTargetIdx, rayIdx) => {
    const rowIdx = clickedRaysRef.current.length;
    const targetRow = document.querySelector(`.text-row-${rowIdx}`);
    const svgEl = document.querySelector('.grid-svg');
    const pr = document.querySelector('.main-canvas-container')?.getBoundingClientRect();

    if (!targetRow || !svgEl || !pr) {
      // fallback if DOM elements are missing
      finishRayAnimation(pair, rowIdx, rayIdx);
      return;
    }

    const rRow = targetRow.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();
    const scaleX = svgRect.width / 600;
    const scaleY = svgRect.height / 500;

    const mid1 = (angStartEnd[pair[0]-1].start + angStartEnd[pair[0]-1].end) / 2;
    const p1 = polarToXY(CX, CY, LABEL_R, mid1);
    const mid2 = (angStartEnd[pair[1]-1].start + angStartEnd[pair[1]-1].end) / 2;
    const p2 = polarToXY(CX, CY, LABEL_R, mid2);

    const startX1 = svgRect.left - pr.left + p1.x * scaleX;
    const startY1 = svgRect.top - pr.top + p1.y * scaleY;
    const startX2 = svgRect.left - pr.left + p2.x * scaleX;
    const startY2 = svgRect.top - pr.top + p2.y * scaleY;

    // Use relative coordinates for the end positions within the row
    const rowLeft = rRow.left - pr.left;
    const rowTop = rRow.top - pr.top;
    
    // Estimate end positions where the text will be
    const endX1 = rowLeft + rRow.width / 2 - 25;
    const endY1 = rowTop + rRow.height / 2 - 10;
    const endX2 = rowLeft + rRow.width / 2 + 55;
    const endY2 = rowTop + rRow.height / 2 - 10;

    setFloatingLabels({
      a1: { text: String(pair[0]), color: labelColors[pair[0]-1], x: startX1, y: startY1 },
      a2: { text: String(pair[1]), color: labelColors[pair[1]-1], x: startX2, y: startY2 },
    });

    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1, duration: 0.8, ease: "power2.inOut",
      onUpdate: () => {
        setFloatingLabels({
          a1: { text: String(pair[0]), color: labelColors[pair[0]-1], x: startX1 + (endX1 - startX1)*proxy.t, y: startY1 + (endY1 - startY1)*proxy.t },
          a2: { text: String(pair[1]), color: labelColors[pair[1]-1], x: startX2 + (endX2 - startX2)*proxy.t, y: startY2 + (endY2 - startY2)*proxy.t },
        });
      },
      onComplete: () => {
        setFloatingLabels(null);
        finishRayAnimation(pair, rowIdx, rayIdx);
      }
    });
  };

  const finishRayAnimation = (pair, rowIdx, rayIdx) => {
    const newClicked = [...clickedRaysRef.current, rayIdx];
    setFilledRows(prev => { const n = [...prev]; n[rowIdx] = pair; return n; });
    setClickedRays(newClicked);
    
    setTimeout(() => {
      animatingRef.current = false;
      setTempDehighlight(null);
      setStraightLineRay(null);
      setDehighlightedRays(prev => [...prev, rayIdx]);

      if (newClicked.length >= 4) {
        onUpdateTexts(APP_DATA.steps[2].navTextAfter);
        onSetNextEnabled(true);
        hideTaps();
      } else {
        showRayTaps(newClicked);
      }
    }, 300);
  };



  /* ── STEP 3: row click → arc animation ── */
  const handleRowClick = (rowIdx) => {
    if (step !== 3 || animatingRef.current) return;
    if (clickedRowsRef.current.includes(rowIdx)) return;
    animatingRef.current = true;
    setActiveRow(rowIdx);
    playSnd("click");

    const pair = filledRows[rowIdx];

    // Clear previous
    setArcAnim(null);
    setArcTextAnim(false);

    // 1. Dehighlight other 2 angles
    const otherAngles = [1, 2, 3, 4].filter(a => !pair.includes(a));
    setTempDehighlight({ ray: -1, angles: otherAngles }); 

    const tl = gsap.timeline();

    // 2. Blink 1 and 2 angle 4 times in 1.6 sec
    const blinkSel = pair.map(id => `.angle-arc-${id} path`).join(", ");
    tl.to(blinkSel, { fillOpacity: 0.1, duration: 0.2, yoyo: true, repeat: 7 }); 

    // 3. Create a semicircular arrow
    tl.to({}, { duration: 0.2 }); 
    tl.call(() => {
      const pairKey = pair.join(",");
      const arcs = {
        "1,2": { start: 180, end: 360 },
        "2,3": { start: 295, end: 475 },
        "3,4": { start: 0, end: 180 },
        "4,1": { start: 115, end: 295 },
      };
      const arcData = arcs[pairKey];
      
      setArcAnim({ start: arcData.start, end: arcData.start, finalEnd: arcData.end });

      const proxy = { a: arcData.start };
      gsap.to(proxy, {
        a: arcData.end,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => setArcAnim({ start: arcData.start, end: proxy.a, finalEnd: arcData.end }),
        onComplete: () => {
           setArcTextAnim(true);
           setTimeout(() => {
             start180LabelAnimation(pair, rowIdx);
           }, 200);
        }
      });
    });
  };

  const start180LabelAnimation = (pair, rowIdx) => {
    const targetRow = document.querySelector(`.text-row-${rowIdx}`);
    const svgEl = document.querySelector('.grid-svg');
    const pr = document.querySelector('.main-canvas-container')?.getBoundingClientRect();

    if (!targetRow || !svgEl || !pr) {
      finishStep3Animation(rowIdx);
      return;
    }

    const rRow = targetRow.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();
    const scaleX = svgRect.width / 600;
    const scaleY = svgRect.height / 500;

    const pairKey = pair.join(",");
    const arcs = {
      "1,2": { start: 180, end: 360 },
      "2,3": { start: 295, end: 475 },
      "3,4": { start: 0, end: 180 },
      "4,1": { start: 115, end: 295 },
    };
    const arcData = arcs[pairKey];
    const mid = (arcData.start + arcData.end) / 2;
    const TEXT_R = 95;
    const pText = polarToXY(CX, CY, TEXT_R, mid);

    const startX = svgRect.left - pr.left + pText.x * scaleX;
    const startY = svgRect.top - pr.top + pText.y * scaleY;

    const rowLeft = rRow.left - pr.left;
    const rowTop = rRow.top - pr.top;
    const endX = rowLeft + rRow.width - 50; 
    const endY = rowTop + rRow.height / 2;

    setFloating180({ text: "180°", x: startX, y: startY });

    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1, duration: 0.8, ease: "power2.inOut",
      onUpdate: () => {
        setFloating180({ text: "180°", x: startX + (endX - startX)*proxy.t, y: startY + (endY - startY)*proxy.t });
      },
      onComplete: () => {
        setFloating180(null);
        finishStep3Animation(rowIdx);
      }
    });
  };

  const finishStep3Animation = (rowIdx) => {
    const newClicked = [...clickedRowsRef.current, rowIdx];
    setClickedRows(newClicked);
    setActiveRow(null);
    animatingRef.current = false;
    
    if (newClicked.length >= 4) {
      finishStepWithQuestionBlink(3);
    }
  };

  /* ── STEP 5: angle click ── */
  const handleAngleClick = (id) => {
    if (step !== 5 || animatingRef.current) return;
    const pair = (id === 1 || id === 3) ? [1, 3] : [2, 4];
    const pairStr = pair.join(",");
    if (clickedRaysRef.current.includes(pairStr)) return;

    animatingRef.current = true;
    hideTaps();
    playSnd("click");

    const otherAngles = [1, 2, 3, 4].filter(a => !pair.includes(a));
    setTempDehighlight({ ray: -1, angles: otherAngles });

    const tl = gsap.timeline();
    const blinkSel = pair.map(a => `.angle-arc-${a} path`).join(", ");
    tl.to(blinkSel, { fillOpacity: 0.1, duration: 0.2, yoyo: true, repeat: 9 });

    tl.to({}, { duration: 0.2 });
    tl.call(() => {
      startStep5LabelAnimation(pair, pairStr);
    });
  };

  const startStep5LabelAnimation = (pair, pairStr) => {
    const rowIdx = filledRows.findIndex(r => r === null);
    if (rowIdx === -1) {
      finishStep5Animation(pairStr, 0, pair);
      return;
    }

    const targetRow = document.querySelector(`.text-row-${rowIdx}`);
    const svgEl = document.querySelector('.grid-svg');
    const pr = document.querySelector('.main-canvas-container')?.getBoundingClientRect();

    if (!targetRow || !svgEl || !pr) {
      finishStep5Animation(pairStr, rowIdx, pair);
      return;
    }

    const rRow = targetRow.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();
    const scaleX = svgRect.width / 600;
    const scaleY = svgRect.height / 500;

    const mid1 = (angStartEnd[pair[0]-1].start + angStartEnd[pair[0]-1].end) / 2;
    const lp1 = polarToXY(CX, CY, LABEL_R, mid1);
    const mid2 = (angStartEnd[pair[1]-1].start + angStartEnd[pair[1]-1].end) / 2;
    const lp2 = polarToXY(CX, CY, LABEL_R, mid2);

    const startX1 = svgRect.left - pr.left + lp1.x * scaleX;
    const startY1 = svgRect.top - pr.top + lp1.y * scaleY;
    const startX2 = svgRect.left - pr.left + lp2.x * scaleX;
    const startY2 = svgRect.top - pr.top + lp2.y * scaleY;

    const rowLeft = rRow.left - pr.left;
    const rowTop = rRow.top - pr.top;
    const endX1 = rowLeft + rRow.width * 0.35;
    const endY1 = rowTop + rRow.height / 2;
    const endX2 = rowLeft + rRow.width * 0.65;
    const endY2 = rowTop + rRow.height / 2;

    setFloatingLabels({
      a1: { text: String(pair[0]), color: labelColors[pair[0]-1], x: startX1, y: startY1 },
      a2: { text: String(pair[1]), color: labelColors[pair[1]-1], x: startX2, y: startY2 },
    });

    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1, duration: 0.8, ease: "power2.inOut",
      onUpdate: () => {
        setFloatingLabels({
          a1: { text: String(pair[0]), color: labelColors[pair[0]-1], x: startX1 + (endX1 - startX1)*proxy.t, y: startY1 + (endY1 - startY1)*proxy.t },
          a2: { text: String(pair[1]), color: labelColors[pair[1]-1], x: startX2 + (endX2 - startX2)*proxy.t, y: startY2 + (endY2 - startY2)*proxy.t },
        });
      },
      onComplete: () => {
        setFloatingLabels(null);
        finishStep5Animation(pairStr, rowIdx, pair);
      }
    });
  };

  const finishStep5Animation = (pairStr, rowIdx, pair) => {
    const newClicked = [...clickedRaysRef.current, pairStr];
    setFilledRows(prev => { const n = [...prev]; n[rowIdx] = pair; return n; });
    setClickedRays(newClicked);

    setTimeout(() => {
      animatingRef.current = false;
      setTempDehighlight(null);

      if (newClicked.length >= 2) {
        onUpdateTexts(APP_DATA.steps[5].navTextAfter);
        onSetNextEnabled(true);
        hideTaps();
      } else {
        const otherPair = pairStr === "1,3" ? [2, 4] : [1, 3];
        const mid1 = (angStartEnd[otherPair[0]-1].start + angStartEnd[otherPair[0]-1].end) / 2;
        const lp1 = polarToXY(CX, CY, LABEL_R + 15, mid1);
        const mid2 = (angStartEnd[otherPair[1]-1].start + angStartEnd[otherPair[1]-1].end) / 2;
        const lp2 = polarToXY(CX, CY, LABEL_R + 15, mid2);
        setTapTargets([{ svgX: lp1.x, svgY: lp1.y }, { svgX: lp2.x, svgY: lp2.y }]);
      }
    }, 300);
  };

  /* ── STEP 6: row click ── */
  const handleStep6RowClick = (rowIdx) => {
    if (step !== 6 || animatingRef.current || clickedRowsRef.current.includes(rowIdx)) return;
    animatingRef.current = true;
    setActiveRow(rowIdx);
    playSnd("click");

    const pair = filledRows[rowIdx];
    const otherAngles = [1, 2, 3, 4].filter(a => !pair.includes(a));

    setTempDehighlight({ ray: -1, angles: otherAngles });

    const tl = gsap.timeline();
    const blinkSel = pair.map(a => `.angle-arc-${a} path`).join(", ");
    tl.to(blinkSel, { fillOpacity: 0.1, duration: 0.4, yoyo: true, repeat: 5 });

    tl.call(() => {
      setCloneAngle({
        id: pair[0],
        rot: 0,
        r: ANG_R,
        start: angStartEnd[pair[0]-1].start,
        end: angStartEnd[pair[0]-1].end,
        color: angColors[pair[0]-1]
      });
    });

    const proxy = { r: ANG_R, rot: 0 };
    const clonePeakR = ANG_R * 4;
    tl.to(proxy, { r: clonePeakR, duration: 0.5, onUpdate: () => {
      setCloneAngle(prev => prev && { ...prev, r: proxy.r });
    }});

    tl.to(proxy, { rot: 180, duration: 1.0, ease: "power2.inOut", onUpdate: () => {
      setCloneAngle(prev => prev && { ...prev, rot: proxy.rot });
    }});

    tl.to(proxy, { r: ANG_R, duration: 0.5, onUpdate: () => {
      setCloneAngle(prev => prev && { ...prev, r: proxy.r });
    }});

    tl.call(() => {
      setCloneAngle(null);
      setClickedRows(prev => [...prev, rowIdx]);
      setActiveRow(null);

      const rowElement = document.querySelector(`.text-row-${rowIdx}`);
      if (rowElement) rowElement.classList.add('blink-border');

      setTimeout(() => {
        if (rowElement) rowElement.classList.remove('blink-border');
        setTempDehighlight(null);
        animatingRef.current = false;
        if (clickedRowsRef.current.length >= 2) {
          finishStepWithQuestionBlink(6);
        }
      }, 1500);
    });
  };

  /* ── helpers ── */
  const isRayDehi = (idx) => {
    if (tempDehighlight) {
      // During animation, ONLY the specifically opposite ray is dehighlighted.
      // This temporarily revives any previously clicked rays that are part of the straight line base.
      return tempDehighlight.ray === idx;
    }
    return dehighlightedRays.includes(idx);
  };
  const isAngDehi = (id) => tempDehighlight && tempDehighlight.angles.includes(id);

  /* ── SVG markers ── */
  const mkr = (id, color, rev) =>
    h("marker", { id, viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "5", markerHeight: "5",
      orient: rev ? "auto-start-reverse" : "auto" },
      h("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }));

  /* ── RENDER: step 1 lines ── */
  const renderStep1Lines = () => {
    const yTop = CY - 25, yBot = CY + 25;
    const xL = CX - LINE_LEN, xR = CX + LINE_LEN;
    return h("g", null,
      h("g", { className: phase === "init" ? "line-clickable-group" : "", onClick: () => handleLineClick(0) },
        h("line", { x1: xL, y1: yTop, x2: xR, y2: yTop, stroke: "transparent", strokeWidth: "30" }),
        h("line", { ref: line0VisRef, className: "visible-line", x1: xL, y1: yTop, x2: xR, y2: yTop,
          stroke: "#ff8c42", strokeWidth: "3", markerStart: "url(#arrow-orange-s)", markerEnd: "url(#arrow-orange-e)" })
      ),
      h("g", { className: phase === "init" ? "line-clickable-group" : "", onClick: () => handleLineClick(1) },
        h("line", { x1: xL, y1: yBot, x2: xR, y2: yBot, stroke: "transparent", strokeWidth: "30" }),
        h("line", { ref: line1VisRef, className: "visible-line", x1: xL, y1: yBot, x2: xR, y2: yBot,
          stroke: "#ffc107", strokeWidth: "3", markerStart: "url(#arrow-yellow-s)", markerEnd: "url(#arrow-yellow-e)" })
      ),
      h("text", { ref: twoLinesRef, x: CX, y: CY + 2, className: "two-lines-label" }, APP_DATA.steps[1].twoLinesLabel)
    );
  };

  /* ── RENDER: step 2 rays ── */
  const renderRays = () => {
    const rayColors = [lineColors.tilted, lineColors.horizontal, lineColors.tilted, lineColors.horizontal];
    const rayMkrs = ["url(#arrow-tilted-e)", "url(#arrow-horizontal-e)", "url(#arrow-tilted-e)", "url(#arrow-horizontal-e)"];
    return h("g", null, [0, 1, 2, 3].map(i => {
      const ep = rayEndpoints[i];
      const dehi = isRayDehi(i);
      const clicked = clickedRays.includes(i);
      const clickable = !clicked && !dehi && !animatingRef.current && step === 2;
      const col = dehi ? "#666" : rayColors[i];
      const op = dehi ? 0.5 : 1;
      return h("g", {
        key: `ray-${i}`,
        className: clickable ? "ray-clickable-group" : "",
        onClick: () => handleRayClick(i),
        style: { opacity: op, transition: "opacity 0.4s" },
      },
        h("line", { x1: CX, y1: CY, x2: ep.x, y2: ep.y, stroke: "transparent", strokeWidth: "30" }),
        h("line", { className: "visible-line", x1: CX, y1: CY, x2: ep.x, y2: ep.y,
          stroke: col, strokeWidth: "3",
          markerEnd: dehi ? "url(#arrow-grey-e)" : rayMkrs[i] })
      );
    }));
  };

  /* ── RENDER: clone ray animation ── */
  const renderCloneRay = () => {
    if (!cloneAnim) return null;
    return h("g", {
      style: { transform: `rotate(${cloneAnim.rot}deg)`, transformOrigin: `${CX}px ${CY}px` }
    }, h("line", {
      x1: CX, y1: CY, x2: cloneAnim.sourceEp.x, y2: cloneAnim.sourceEp.y,
      stroke: cloneAnim.color, strokeWidth: "3", markerEnd: cloneAnim.mkr
    }));
  };

  /* ── RENDER: angles ── */
  const renderAngles = () => h("g", null,
    angStartEnd.map((a, i) => {
      if (!anglesVisible[i]) return null;
      const dehi = isAngDehi(a.id);
      const mid = (a.start + a.end) / 2;
      const lp = polarToXY(CX, CY, LABEL_R, mid);
      const oddEven = a.id % 2 === 1 ? "odd" : "even";
      
      const pairStr = (a.id === 1 || a.id === 3) ? "1,3" : "2,4";
      const isClickedPair = clickedRays.includes(pairStr);
      const isHoverable = step === 5 && !isClickedPair && !animatingRef.current;
      
      return h("g", { key: `ang-${a.id}`, className: `angle-arc-${a.id} ${isHoverable ? 'step5-angle-hover' : ''}`,
        onClick: step === 5 ? () => handleAngleClick(a.id) : undefined,
        style: { opacity: dehi ? 0.2 : 1, transition: "opacity 0.4s", cursor: isHoverable ? "pointer" : "default" } },
        h("path", { d: arcPath(CX, CY, ANG_R, a.start, a.end), fill: angColors[i], className: "angle-appear" }),
        h("text", { x: lp.x, y: lp.y, className: `angle-label angle-label-${a.id} ${oddEven}`, style: { pointerEvents: isHoverable ? "auto" : "none" } }, String(a.id))
      );
    })
  );

  /* ── RENDER: straight line label ── */
  const renderStraightLabel = () => {
    if (straightLineRay === null) return null;
    const ep = rayEndpoints[straightLineRay];
    
    // Calculate angle in degrees
    let angle = Math.atan2(ep.y - CY, ep.x - CX) * 180 / Math.PI;
    
    // Keep text reading left-to-right
    let textRot = angle;
    if (angle > 90) textRot -= 180;
    else if (angle < -90) textRot += 180;
    
    // Position further along the ray and offset perpendicular so larger label clears the ray
    const along = 0.82;
    const mx = CX + (ep.x - CX) * along;
    const my = CY + (ep.y - CY) * along;
    const labelOffset = -26;

    return h("text", {
      x: 0, y: labelOffset, textAnchor: "middle", className: "straight-line-label angle-appear",
      transform: `translate(${mx}, ${my}) rotate(${textRot})`
    }, APP_DATA.steps[2].straightLineLabel);
  };

  /* ── RENDER: 180 arc ── */
  const render180Arc = () => {
    if (!arcAnim) return null;
    const ARC_R = 70;
    const d = lineArcPath(CX, CY, ARC_R, arcAnim.start, arcAnim.end);
    
    return h("g", null,
      h("path", { d, fill: "none", stroke: "#c084fc", strokeWidth: "3", markerEnd: "url(#arrow-purple-e)" }),
      arcTextAnim && render180Text()
    );
  };

  const render180Text = () => {
    const mid = (arcAnim.start + arcAnim.finalEnd) / 2;
    const TEXT_R = 95;
    const p = polarToXY(CX, CY, TEXT_R, mid);
    return h("text", {
      x: p.x, y: p.y, fill: "#c084fc", fontSize: "24", fontWeight: "bold", textAnchor: "middle", dominantBaseline: "central",
      className: "angle-appear"
    }, "180°");
  };

  /* ── RENDER: clone angle ── */
  const renderCloneAngle = () => {
    if (!cloneAngle) return null;
    const d = arcPath(CX, CY, cloneAngle.r, cloneAngle.start, cloneAngle.end);
    return h("g", { style: { transform: `rotate(${cloneAngle.rot}deg)`, transformOrigin: `${CX}px ${CY}px` } },
      h("path", { d, fill: cloneAngle.color, fillOpacity: 0.5 })
    );
  };

  /* ── RENDER: text column ── */
  const renderTextColumn = () => {
    if (!showTextColumn) return null;
    const sym = APP_DATA.labels.angle;
    const isStep3 = step === 3;
    const isStep5Or6 = step === 5 || step === 6;
    
    let titleText = APP_DATA.steps[2].textColumnTitle;
    let andText = APP_DATA.steps[2].andText;
    if (isStep3 && APP_DATA.steps[3].textColumnTitle) titleText = APP_DATA.steps[3].textColumnTitle;
    if (isStep5Or6) {
      titleText = APP_DATA.steps[5].textColumnTitle;
      andText = APP_DATA.steps[5].andText;
    }
    
    const rowIndices = isStep5Or6 ? [0, 1] : [0, 1, 2, 3];
    
    return h("div", { className: "text-column" },
      h("div", { className: "text-column-title" }, titleText),
      h("div", { className: "text-column-rows" },
        rowIndices.map(i => {
          const pair = filledRows[i];
          if (!pair) return h("div", { key: `row-${i}`, className: `text-column-row text-row-${i}` });
          
          const isClicked = clickedRows.includes(i);
          const isActive = activeRow === i;
          let rowClass = `text-column-row text-row-${i} filled`;
          if (isStep3 || step === 6) {
            rowClass += (isClicked || isActive) ? " step3-clicked" : " step3-unclicked";
          }
          
          const textColorClass = ((isStep3 || step === 6) && !(isClicked || isActive)) ? "dark-text" : "";
          const c1 = textColorClass || (pair[0] % 2 === 1 ? "odd-color" : "even-color");
          const c2 = textColorClass || (pair[1] % 2 === 1 ? "odd-color" : "even-color");
          const andColor = textColorClass || "";

          // In step 5 or 6
          if (isStep5Or6 && pair) {
             const operatorText = (step === 6 && isClicked) ? "=" : andText;
             return h("div", { key: `row-${i}`, className: rowClass, onClick: () => step === 6 && handleStep6RowClick(i) },
               h("span", { className: `angle-symbol ${c1}` }, sym),
               h("span", { className: `angle-num ${c1}` }, String(pair[0])),
               h("span", { className: `and-text ${andColor}` }, " " + operatorText + " "),
               h("span", { className: `angle-symbol ${c2}` }, sym),
               h("span", { className: `angle-num ${c2}` }, String(pair[1]))
             );
          }

          // In step 3, if clicked, text becomes "∠1 + ∠2 = 180°"
          if (isStep3 && isClicked) {
             return h("div", { key: `row-${i}`, className: rowClass },
               h("span", { className: `angle-symbol ${c1}` }, sym),
               h("span", { className: `angle-num ${c1}` }, String(pair[0])),
               h("span", { className: `and-text ${andColor}` }, " + "),
               h("span", { className: `angle-symbol ${c2}` }, sym),
               h("span", { className: `angle-num ${c2}` }, String(pair[1])),
               h("span", { className: `and-text` }, " = "),
               h("span", { className: `angle-num purple-text` }, "180°")
             );
          }

          return h("div", { key: `row-${i}`, className: rowClass, onClick: () => isStep3 && handleRowClick(i) },
            h("span", { className: `angle-symbol ${c1}` }, sym),
            h("span", { className: `angle-num ${c1}` }, String(pair[0])),
            h("span", { className: `and-text ${andColor}` }, ` ${andText} `),
            h("span", { className: `angle-symbol ${c2}` }, sym),
            h("span", { className: `angle-num ${c2}` }, String(pair[1]))
          );
        })
      )
    );
  };

  /* ── RENDER: floating labels ── */
  const renderFloatingLabels = () => {
    if (!floatingLabels) return null;
    return h("div", null,
      h("div", {
        style: { position: 'absolute', left: floatingLabels.a1.x, top: floatingLabels.a1.y,
          color: floatingLabels.a1.color, fontSize: '32px', fontWeight: 'bold', pointerEvents: 'none', zIndex: 100, transform: 'translate(-50%, -50%)' }
      }, floatingLabels.a1.text),
      h("div", {
        style: { position: 'absolute', left: floatingLabels.a2.x, top: floatingLabels.a2.y,
          color: floatingLabels.a2.color, fontSize: '32px', fontWeight: 'bold', pointerEvents: 'none', zIndex: 100, transform: 'translate(-50%, -50%)' }
      }, floatingLabels.a2.text)
    );
  };

  /* ── RENDER: floating 180 ── */
  const renderFloating180 = () => {
    if (!floating180) return null;
    return h("div", {
      style: { position: 'absolute', left: floating180.x, top: floating180.y,
        color: "#c084fc", fontSize: '32px', fontWeight: 'bold', pointerEvents: 'none', zIndex: 100, transform: 'translate(-50%, -50%)' }
    }, floating180.text);
  };

  /* ── MAIN RENDER ── */
  const isFullWidth = !showTextColumn;
  return h("div", { className: "main-canvas-container" },
    getTapStyles().map((s, i) => h("img", { key: `tap-${i}`, src: "assets/tap.gif", className: "tap-gif", style: s })),
    h("div", { className: `visual-column ${isFullWidth ? "full-width" : "with-text-col"}` },
      h("svg", { className: "grid-svg", viewBox: "0 0 600 500", ref: svgRef },
        h("defs", null,
          mkr("arrow-orange-s", "#ff8c42", true),
          mkr("arrow-orange-e", "#ff8c42", false),
          mkr("arrow-yellow-s", "#ffc107", true),
          mkr("arrow-yellow-e", "#ffc107", false),
          mkr("arrow-tilted-e", lineColors.tilted, false),
          mkr("arrow-horizontal-e", lineColors.horizontal, false),
          mkr("arrow-grey-e", "#666", false),
          h("marker", { id: "arrow-purple-e", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "5", markerHeight: "5",
            orient: "auto" },
            h("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#c084fc" }))
        ),
        renderAngles(),
        step === 1 && renderStep1Lines(),
        (step === 2 || step === 3 || step === 5 || step === 6) && renderRays(),
        renderCloneRay(),
        renderCloneAngle(),
        renderStraightLabel(),
        step === 3 && render180Arc()
      )
    ),
    renderTextColumn(),
    renderFloatingLabels(),
    renderFloating180()
  );
};
