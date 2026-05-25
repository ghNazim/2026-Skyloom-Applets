const MainCanvas = ({
  step,
  userSegment,
  onUserSegmentChange,
  onSetNextEnabled,
  onUpdateTexts,
  onAnimatingChange,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } =
    React;

  const SVG_W = 400;
  const SVG_GRID_H = 280;
  const GRID_FRAC = 0.66;
  const SVG_TOTAL_H = SVG_GRID_H / GRID_FRAC;
  const GRID_FRAME_STROKE = 2;
  const GRID_FRAME_RX = 14;
  const PAD = 28;
  const GV = 10;
  const STEP1_ARROW_COUNT = 10;
  const STEP1_START_DELAY_MS = 500;
  const STEP1_ARROW_GROW_MS = 500;
  const STEP1_HEAD_FADE_MS = 100;
  const STEP1_LABEL_FADE_MS = 100;
  const STEP3_CM_COUNT = 5;
  const STEP3_MM_PER_CM = 10;
  const STEP3_START_DELAY_MS = 500;
  const STEP3_CM_GROW_MS = 500;
  const STEP3_CM_HEAD_FADE_MS = 200;
  const STEP3_MM_GROW_MS = 200;
  const STEP7_ARROW_COUNT = 10;
  const STEP7_START_DELAY_MS = 500;
  const STEP7_ARROW_GROW_MS = 500;
  const STEP7_HEAD_FADE_MS = 100;
  const STEP7_LABEL_FADE_MS = 100;
  const STEP9_START_DELAY_MS = 500;
  const STEP9_CM_GROW_MS = 500;
  const STEP9_CM_HEAD_FADE_MS = 200;
  const STEP9_MM_GROW_MS = 200;

  /** Fixed PQ (step 10–11); same diagram scale as original lesson. */
  const FP = [PAD + 40, SVG_GRID_H - PAD - 50];
  const FQ = [SVG_W - PAD - 40, PAD + 70];

  const RULER = { w: 309, h: 54, zeroX: 8.95, cm: 19 };
  const SEGMENT_CM = APP_DATA.measure.correctCm;
  const SLIDER_MAX = APP_DATA.measure.sliderMax;
  const SLIDER_MAX_CM = APP_DATA.measure.sliderMaxCm || 20;
  const S13_CM_DRAG_MAX = 15;
  const S13_MM_DRAG_MAX = 10;
  const DRAG_NUDGE_SRC = "assets/drag.gif";
  const DRAG_NUDGE_SIZE = 78;
  const DRAG_NUDGE_X = -DRAG_NUDGE_SIZE / 2;
  /** Horizontally centered; sits just above marker circle (r=22, cy≈1). */
  const DRAG_NUDGE_Y = -34;

  /** Matches step 10: px per mm along any segment in this grid world. */
  const refDistPx = Math.hypot(FQ[0] - FP[0], FQ[1] - FP[1]);
  const pxPerMm = refDistPx / (SEGMENT_CM * 10);

  const isPqSteps = step === 10 || step === 11;
  const isDrawStep = step === 12;
  const isUserLesson = step >= 13 && step <= 15;

  const s10 = APP_DATA.steps[10];
  const s11 = APP_DATA.steps[11];
  const s13 = APP_DATA.steps[13];

  const [draftA, setDraftA] = useState(null);
  const [draftB, setDraftB] = useState(null);
  const [drawActive, setDrawActive] = useState(false);

  const [alignPhase, setAlignPhase] = useState("idle");
  const [measureOpen, setMeasureOpen] = useState(false);
  const [phase2Started, setPhase2Started] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);
  const [sliderCm, setSliderCm] = useState(0);
  const [sliderMm, setSliderMm] = useState(0);
  const [locked, setLocked] = useState(false);
  const [movingCorrect, setMovingCorrect] = useState(false);
  /** Step 13: cm slider until correct; then button 3; then mm slider. */
  const [s13SubPhase, setS13SubPhase] = useState("cm");
  const [s13CmLocked, setS13CmLocked] = useState(null);
  const [s13CmConfirmed, setS13CmConfirmed] = useState(false);
  const [s13Phase3Started, setS13Phase3Started] = useState(false);
  const [s13CmError, setS13CmError] = useState(false);
  const [s13MmError, setS13MmError] = useState(false);
  const [introHighlightVisible, setIntroHighlightVisible] = useState(false);
  const [step6HighlightVisible, setStep6HighlightVisible] = useState(false);
  const [introZoomActive, setIntroZoomActive] = useState(false);
  const [step10EntryPhase, setStep10EntryPhase] = useState("done");
  const [step9SelectedOption, setStep9SelectedOption] = useState(null);
  const [step9IsCorrect, setStep9IsCorrect] = useState(false);
  const [step9Shake, setStep9Shake] = useState(false);
  const [step1RevealIndex, setStep1RevealIndex] = useState(-1);
  const [step1RevealPhase, setStep1RevealPhase] = useState("idle");
  const [step1AnimDone, setStep1AnimDone] = useState(false);
  const [step3CmIndex, setStep3CmIndex] = useState(-1);
  const [step3Phase, setStep3Phase] = useState("idle");
  const [step3MmIndex, setStep3MmIndex] = useState(0);
  const [step3AnimDone, setStep3AnimDone] = useState(false);
  const [step7RevealIndex, setStep7RevealIndex] = useState(-1);
  const [step7RevealPhase, setStep7RevealPhase] = useState("idle");
  const [step7AnimDone, setStep7AnimDone] = useState(false);
  const [step9IntroDone, setStep9IntroDone] = useState(false);
  const [step9Phase, setStep9Phase] = useState("idle");
  const [step9MmIndex, setStep9MmIndex] = useState(0);

  const rulerGRef = useRef(null);
  const rulerImgRef = useRef(null);
  const tlRef = useRef(null);
  const unifiedSvgRef = useRef(null);
  const sceneWrapRef = useRef(null);
  const [gridOffset, setGridOffset] = useState({ dx: 0, dy: 0 });
  const markerDragRef = useRef(null);
  const [dragNudgeSeen, setDragNudgeSeen] = useState({
    pq: false,
    cm: false,
    mm: false,
  });
  const drawPointerIdRef = useRef(null);
  const drawTouchActiveRef = useRef(false);
  const drawMovedRef = useRef(false);
  const step10EntryTimersRef = useRef([]);
  const step9ShakeTimeoutRef = useRef(null);
  const step1AnimTimerRef = useRef(null);
  const step3AnimTimerRef = useRef(null);
  const step7AnimTimerRef = useRef(null);
  const step9AnimTimerRef = useRef(null);

  const snap = useCallback((x, y) => {
    return [Math.round(x / GV) * GV, Math.round(y / GV) * GV];
  }, []);

  const P = useMemo(() => {
    if (isPqSteps) return FP;
    if (isUserLesson && userSegment) return [userSegment.ax, userSegment.ay];
    return FP;
  }, [isPqSteps, isUserLesson, userSegment]);

  const Q = useMemo(() => {
    if (isPqSteps) return FQ;
    if (isUserLesson && userSegment) return [userSegment.bx, userSegment.by];
    return FQ;
  }, [isPqSteps, isUserLesson, userSegment]);

  const lengthMm = useMemo(() => {
    if (isPqSteps) return SEGMENT_CM * 10;
    if (userSegment) return userSegment.lengthMm;
    return SEGMENT_CM * 10;
  }, [isPqSteps, userSegment]);

  const sliderCmMax = Math.max(SLIDER_MAX_CM, Math.ceil(lengthMm / 10));

  const lengthCm = lengthMm / 10;

  const dx = Q[0] - P[0];
  const dy = Q[1] - P[1];
  const distPx = Math.hypot(dx, dy);
  const u = distPx > 1e-6 ? [dx / distPx, dy / distPx] : [1, 0];
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  const perpUp = [-u[1], u[0]];
  /** Same scaling rule as step 10: rs = distPx / (lengthCm × ruler.cmPerSvgCm). */
  const rs = distPx / (lengthCm * RULER.cm);
  const rW = RULER.w * rs;
  const rH = RULER.h * rs;
  const roX = -RULER.zeroX * rs;

  const dashLen = 115;
  const markerOffset = 18;
  /** Short end of each dash (toward ruler body); long end is +dashLen toward grid. */
  const dashShortLen = 12;
  /** Distance from tick to cm marker center along +perpUp (below ruler; long dash end). */
  const cmMarkerPerp = dashLen - markerOffset;
  /**
   * MM: ray from tick along **−perpUp** (opposite to cm), so cm stays below the ruler and
   * mm stays above. Same length/inset as before so the bubble clears the ruler face.
   */
  const mmDashLift = dashShortLen;
  /** Extra length along −perp (above ruler); halved vs earlier so mm sits closer to cm spacing. */
  const mmPerpExtra = -65;
  const mmLongEnd = dashLen + mmDashLift + mmPerpExtra;
  const mmMarkerPerp = mmLongEnd - markerOffset;
  /** From mm tick along +perpUp (ruler / “below” side): extends dashed line toward the edge like cm’s short stub, but longer. */
  const mmDashBelowLen = 48;

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = 0; x <= SVG_W; x += GV) {
      lines.push(
        React.createElement("line", {
          key: `gv-${x}`,
          x1: x,
          y1: 0,
          x2: x,
          y2: SVG_GRID_H,
          stroke: "rgba(255,255,255,0.08)",
          strokeWidth: 1,
        }),
      );
    }
    for (let y = 0; y <= SVG_GRID_H; y += GV) {
      lines.push(
        React.createElement("line", {
          key: `gh-${y}`,
          x1: 0,
          y1: y,
          x2: SVG_W,
          y2: y,
          stroke: "rgba(255,255,255,0.08)",
          strokeWidth: 1,
        }),
      );
    }
    return lines;
  }, []);

  const initialRulerTransform = useMemo(() => {
    const cx = SVG_W / 2 - (RULER.w * rs) / 2 + RULER.zeroX * rs;
    const cy = SVG_TOTAL_H - rH - 14;
    return { x: cx, y: cy, rot: 0 };
  }, [rs, rH]);

  const applyRulerGeometry = useCallback(() => {
    const ri = rulerImgRef.current;
    if (!ri) return;
    ri.setAttribute("x", String(roX));
    ri.setAttribute("y", "0");
    ri.setAttribute("width", String(rW));
    ri.setAttribute("height", String(rH));
  }, [roX, rW, rH]);

  const setRulerTransform = useCallback((x, y, rot) => {
    const rg = rulerGRef.current;
    if (!rg) return;
    rg.setAttribute("transform", `translate(${x}, ${y}) rotate(${rot})`);
  }, []);

  const showRulerGraphic =
    !isDrawStep && (isPqSteps || (isUserLesson && userSegment));

  const rulerAlignX = P[0] + gridOffset.dx;
  const rulerAlignY = P[1] + gridOffset.dy;

  const updateGridCenterOffset = useCallback(() => {
    const wrap = sceneWrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    if (wr.width < 1 || wr.height < 1) return;
    const s = Math.min(wr.width / SVG_W, wr.height / SVG_TOTAL_H);
    const offsetX = (wr.width - SVG_W * s) / 2;
    const offsetY = (wr.height - SVG_TOTAL_H * s) / 2;
    const dx = (wr.width / 2 - (offsetX + (SVG_W / 2) * s)) / s;
    const dy = (wr.height / 2 - (offsetY + (SVG_GRID_H / 2) * s)) / s;
    setGridOffset({ dx, dy });
  }, []);

  useLayoutEffect(() => {
    updateGridCenterOffset();
    const wrap = sceneWrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateGridCenterOffset);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [updateGridCenterOffset, step]);

  useEffect(() => {
    if (!showRulerGraphic) return;
    applyRulerGeometry();
    if (alignPhase === "idle") {
      setRulerTransform(initialRulerTransform.x, initialRulerTransform.y, 0);
    } else if (alignPhase === "done") {
      setRulerTransform(rulerAlignX, rulerAlignY, angleDeg);
    }
  }, [
    showRulerGraphic,
    alignPhase,
    applyRulerGeometry,
    initialRulerTransform,
    setRulerTransform,
    rulerAlignX,
    rulerAlignY,
    angleDeg,
  ]);

  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
      if (step10EntryTimersRef.current.length) {
        step10EntryTimersRef.current.forEach((id) => clearTimeout(id));
        step10EntryTimersRef.current = [];
      }
      if (step9ShakeTimeoutRef.current)
        clearTimeout(step9ShakeTimeoutRef.current);
      if (step1AnimTimerRef.current) clearTimeout(step1AnimTimerRef.current);
      if (step3AnimTimerRef.current) clearTimeout(step3AnimTimerRef.current);
      if (step7AnimTimerRef.current) clearTimeout(step7AnimTimerRef.current);
      if (step9AnimTimerRef.current) clearTimeout(step9AnimTimerRef.current);
      if (typeof onAnimatingChange === "function") onAnimatingChange(false);
    };
  }, [onAnimatingChange]);

  useEffect(() => {
    if (step === 9) return;
    setStep9SelectedOption(null);
    setStep9IsCorrect(false);
    setStep9Shake(false);
    if (step9ShakeTimeoutRef.current) {
      clearTimeout(step9ShakeTimeoutRef.current);
      step9ShakeTimeoutRef.current = null;
    }
  }, [step]);

  useEffect(() => {
    if (isDrawStep) {
      if (typeof onSetNextEnabled === "function")
        onSetNextEnabled(!!userSegment);
    }
  }, [isDrawStep, userSegment, onSetNextEnabled]);

  useEffect(() => {
    if (step === 13 && userSegment) {
      setAlignPhase("idle");
      setMeasureOpen(false);
      setPhase2Started(false);
      setSliderCm(0);
      setSliderMm(0);
      setLocked(false);
      setMovingCorrect(false);
      setS13SubPhase("cm");
      setS13CmLocked(null);
      setS13CmConfirmed(false);
      setS13Phase3Started(false);
      setS13CmError(false);
      setS13MmError(false);
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
    }
  }, [step, userSegment, onSetNextEnabled]);

  useEffect(() => {
    if (step !== 14 && step !== 15) return;
    setAlignPhase("done");
    setMeasureOpen(true);
    setPhase2Started(true);
    setLocked(true);
    setMovingCorrect(true);
    setS13SubPhase("mm");
    setS13Phase3Started(true);
    setS13CmConfirmed(true);
    setS13CmLocked(Math.floor(lengthMm / 10));
    setSliderCm(Math.floor(lengthMm / 10));
    setSliderMm(lengthMm % 10);
    setS13CmError(false);
    setS13MmError(false);
  }, [step, lengthMm]);

  useEffect(() => {
    if (step3AnimTimerRef.current) clearTimeout(step3AnimTimerRef.current);
    step3AnimTimerRef.current = null;
    if (step !== 3) {
      setStep3CmIndex(-1);
      setStep3Phase("idle");
      setStep3MmIndex(0);
      setStep3AnimDone(false);
      return;
    }
    setStep3CmIndex(-1);
    setStep3Phase("idle");
    setStep3MmIndex(0);
    setStep3AnimDone(false);
    const runCm = (cmIdx) => {
      if (cmIdx >= STEP3_CM_COUNT) {
        setStep3CmIndex(STEP3_CM_COUNT);
        setStep3Phase("done");
        setStep3MmIndex(STEP3_MM_PER_CM);
        setStep3AnimDone(true);
        step3AnimTimerRef.current = null;
        return;
      }
      setStep3CmIndex(cmIdx);
      setStep3MmIndex(0);
      setStep3Phase("cmLine");
      step3AnimTimerRef.current = setTimeout(() => {
        setStep3Phase("cmHead");
        step3AnimTimerRef.current = setTimeout(() => {
          if (typeof playSound === "function") playSound("tick");
          setStep3Phase("mm");
          const runMm = (mmIdx) => {
            if (mmIdx >= STEP3_MM_PER_CM) {
              setStep3MmIndex(STEP3_MM_PER_CM);
              runCm(cmIdx + 1);
              return;
            }
            setStep3MmIndex(mmIdx);
            step3AnimTimerRef.current = setTimeout(() => {
              if (typeof playSound === "function") playSound("tick");
              runMm(mmIdx + 1);
            }, STEP3_MM_GROW_MS);
          };
          runMm(0);
        }, STEP3_CM_HEAD_FADE_MS);
      }, STEP3_CM_GROW_MS);
    };
    step3AnimTimerRef.current = setTimeout(() => {
      runCm(0);
    }, STEP3_START_DELAY_MS);
    return () => {
      if (step3AnimTimerRef.current) clearTimeout(step3AnimTimerRef.current);
      step3AnimTimerRef.current = null;
    };
  }, [
    step,
    STEP3_CM_COUNT,
    STEP3_MM_PER_CM,
    STEP3_START_DELAY_MS,
    STEP3_CM_GROW_MS,
    STEP3_CM_HEAD_FADE_MS,
    STEP3_MM_GROW_MS,
  ]);

  useEffect(() => {
    if (step9AnimTimerRef.current) clearTimeout(step9AnimTimerRef.current);
    step9AnimTimerRef.current = null;
    if (step !== 9) {
      setStep9IntroDone(false);
      setStep9Phase("idle");
      setStep9MmIndex(0);
      return;
    }
    setStep9IntroDone(false);
    setStep9Phase("idle");
    setStep9MmIndex(0);
    if (typeof onUpdateTexts === "function") onUpdateTexts("", "");
    step9AnimTimerRef.current = setTimeout(() => {
      setStep9Phase("cmLine");
      step9AnimTimerRef.current = setTimeout(() => {
        setStep9Phase("cmHead");
        step9AnimTimerRef.current = setTimeout(() => {
          if (typeof playSound === "function") playSound("tick");
          setStep9Phase("mm");
          const runMm = (mmIdx) => {
            if (mmIdx >= STEP3_MM_PER_CM) {
              setStep9MmIndex(STEP3_MM_PER_CM);
              setStep9Phase("done");
              setStep9IntroDone(true);
              if (typeof onUpdateTexts === "function") {
                onUpdateTexts(
                  APP_DATA.steps[9].navText,
                  APP_DATA.steps[9].questionText,
                );
              }
              step9AnimTimerRef.current = null;
              return;
            }
            setStep9MmIndex(mmIdx);
            step9AnimTimerRef.current = setTimeout(() => {
              if (typeof playSound === "function") playSound("tick");
              runMm(mmIdx + 1);
            }, STEP9_MM_GROW_MS);
          };
          runMm(0);
        }, STEP9_CM_HEAD_FADE_MS);
      }, STEP9_CM_GROW_MS);
    }, STEP9_START_DELAY_MS);
    return () => {
      if (step9AnimTimerRef.current) clearTimeout(step9AnimTimerRef.current);
      step9AnimTimerRef.current = null;
    };
  }, [
    step,
    onUpdateTexts,
    STEP3_MM_PER_CM,
    STEP9_START_DELAY_MS,
    STEP9_CM_GROW_MS,
    STEP9_CM_HEAD_FADE_MS,
    STEP9_MM_GROW_MS,
  ]);

  useEffect(() => {
    if (step7AnimTimerRef.current) clearTimeout(step7AnimTimerRef.current);
    step7AnimTimerRef.current = null;
    if (step !== 7) {
      setStep7RevealIndex(-1);
      setStep7RevealPhase("idle");
      setStep7AnimDone(false);
      return;
    }
    setStep7RevealIndex(-1);
    setStep7RevealPhase("idle");
    setStep7AnimDone(false);
    const runArrow = (idx) => {
      if (idx >= STEP7_ARROW_COUNT) {
        setStep7RevealIndex(STEP7_ARROW_COUNT);
        setStep7RevealPhase("done");
        setStep7AnimDone(true);
        step7AnimTimerRef.current = null;
        return;
      }
      setStep7RevealIndex(idx);
      setStep7RevealPhase("drawing");
      step7AnimTimerRef.current = setTimeout(() => {
        setStep7RevealPhase("head");
        step7AnimTimerRef.current = setTimeout(() => {
          if (typeof playSound === "function") playSound("tick");
          setStep7RevealPhase("label");
          step7AnimTimerRef.current = setTimeout(() => {
            runArrow(idx + 1);
          }, STEP7_LABEL_FADE_MS);
        }, STEP7_HEAD_FADE_MS);
      }, STEP7_ARROW_GROW_MS);
    };
    step7AnimTimerRef.current = setTimeout(() => {
      runArrow(0);
    }, STEP7_START_DELAY_MS);
    return () => {
      if (step7AnimTimerRef.current) clearTimeout(step7AnimTimerRef.current);
      step7AnimTimerRef.current = null;
    };
  }, [
    step,
    STEP7_ARROW_COUNT,
    STEP7_START_DELAY_MS,
    STEP7_ARROW_GROW_MS,
    STEP7_HEAD_FADE_MS,
    STEP7_LABEL_FADE_MS,
  ]);

  useEffect(() => {
    if (step1AnimTimerRef.current) clearTimeout(step1AnimTimerRef.current);
    step1AnimTimerRef.current = null;
    if (step !== 1) {
      setStep1RevealIndex(-1);
      setStep1RevealPhase("idle");
      setStep1AnimDone(false);
      return;
    }
    setStep1RevealIndex(-1);
    setStep1RevealPhase("idle");
    setStep1AnimDone(false);
    const runArrow = (idx) => {
      if (idx >= STEP1_ARROW_COUNT) {
        setStep1RevealIndex(STEP1_ARROW_COUNT);
        setStep1RevealPhase("done");
        setStep1AnimDone(true);
        step1AnimTimerRef.current = null;
        return;
      }
      setStep1RevealIndex(idx);
      setStep1RevealPhase("drawing");
      step1AnimTimerRef.current = setTimeout(() => {
        setStep1RevealPhase("head");
        step1AnimTimerRef.current = setTimeout(() => {
          if (typeof playSound === "function") playSound("tick");
          setStep1RevealPhase("label");
          step1AnimTimerRef.current = setTimeout(() => {
            runArrow(idx + 1);
          }, STEP1_LABEL_FADE_MS);
        }, STEP1_HEAD_FADE_MS);
      }, STEP1_ARROW_GROW_MS);
    };
    step1AnimTimerRef.current = setTimeout(() => {
      runArrow(0);
    }, STEP1_START_DELAY_MS);
    return () => {
      if (step1AnimTimerRef.current) clearTimeout(step1AnimTimerRef.current);
      step1AnimTimerRef.current = null;
    };
  }, [
    step,
    STEP1_ARROW_COUNT,
    STEP1_START_DELAY_MS,
    STEP1_ARROW_GROW_MS,
    STEP1_HEAD_FADE_MS,
    STEP1_LABEL_FADE_MS,
  ]);

  useEffect(() => {
    if (step < 1 || step > 9) return;
    if (typeof onSetNextEnabled !== "function") return;
    if (step === 1) {
      onSetNextEnabled(step1AnimDone);
      return;
    }
    if (step === 3) {
      onSetNextEnabled(step3AnimDone);
      return;
    }
    if (step === 7) {
      onSetNextEnabled(step7AnimDone);
      return;
    }
    if (step === 9) {
      onSetNextEnabled(step9IntroDone && step9IsCorrect);
      return;
    }
    onSetNextEnabled(true);
  }, [
    step,
    step1AnimDone,
    step3AnimDone,
    step7AnimDone,
    step9IntroDone,
    step9IsCorrect,
    onSetNextEnabled,
  ]);

  useEffect(() => {
    if (step !== 2) {
      setIntroHighlightVisible(false);
      setIntroZoomActive(false);
      return;
    }
    setIntroHighlightVisible(false);
    setIntroZoomActive(false);
    const tid = setTimeout(() => setIntroZoomActive(true), 50);
    return () => clearTimeout(tid);
  }, [step]);

  useEffect(() => {
    if (step !== 2 || !introZoomActive) return;
    const fb = setTimeout(() => setIntroHighlightVisible(true), 1600);
    return () => clearTimeout(fb);
  }, [step, introZoomActive]);

  useEffect(() => {
    if (step10EntryTimersRef.current.length) {
      step10EntryTimersRef.current.forEach((id) => clearTimeout(id));
      step10EntryTimersRef.current = [];
    }
    if (step !== 10) {
      setStep10EntryPhase("done");
      return;
    }
    setStep10EntryPhase("blank");
    const t1 = setTimeout(() => setStep10EntryPhase("scene"), 120);
    const t2 = setTimeout(() => setStep10EntryPhase("ruler"), 460);
    const t3 = setTimeout(() => setStep10EntryPhase("done"), 980);
    step10EntryTimersRef.current = [t1, t2, t3];
    return () => {
      step10EntryTimersRef.current.forEach((id) => clearTimeout(id));
      step10EntryTimersRef.current = [];
    };
  }, [step]);

  useEffect(() => {
    if (step !== 6) {
      setStep6HighlightVisible(false);
      return;
    }
    setStep6HighlightVisible(false);
    const tid = setTimeout(() => setStep6HighlightVisible(true), 900);
    return () => clearTimeout(tid);
  }, [step]);

  useEffect(() => {
    setDragNudgeSeen({ pq: false, cm: false, mm: false });
  }, [step]);

  const handleStep9OptionClick = useCallback(
    (option) => {
      if (step !== 9 || !step9IntroDone || step9IsCorrect) return;
      const selected = String(option);
      const isCorrect = selected === String(APP_DATA.steps[9].mcqCorrect);
      setStep9SelectedOption(selected);
      setStep9IsCorrect(isCorrect);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(APP_DATA.steps[9].navTextCorrect);
        }
        return;
      }
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
      setStep9Shake(true);
      if (step9ShakeTimeoutRef.current)
        clearTimeout(step9ShakeTimeoutRef.current);
      step9ShakeTimeoutRef.current = setTimeout(() => {
        setStep9Shake(false);
        step9ShakeTimeoutRef.current = null;
      }, 550);
    },
    [step, step9IntroDone, step9IsCorrect, onSetNextEnabled, onUpdateTexts],
  );

  const posAtCm = useCallback(
    (cm) => {
      const t = (cm / lengthCm) * distPx;
      return [P[0] + u[0] * t, P[1] + u[1] * t];
    },
    [P, u, distPx, lengthCm],
  );

  const pointerCmOnSegment = useCallback(
    (clientX, clientY, clampToSegmentEnd = true) => {
      const svg = unifiedSvgRef.current;
      if (!svg || distPx < 1e-6) return 0;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return 0;
      const loc = pt.matrixTransform(ctm.inverse());
      const gx = loc.x - gridOffset.dx;
      const gy = loc.y - gridOffset.dy;
      const relX = gx - P[0];
      const relY = gy - P[1];
      const along = relX * u[0] + relY * u[1];
      const t = clampToSegmentEnd
        ? Math.max(0, Math.min(distPx, along))
        : Math.max(0, along);
      return (t / distPx) * lengthCm;
    },
    [P, u, distPx, lengthCm, gridOffset.dx, gridOffset.dy],
  );

  const clientToCmAlongSegment = useCallback(
    (clientX, clientY) => pointerCmOnSegment(clientX, clientY, true),
    [pointerCmOnSegment],
  );

  const lessonCfg = step === 13 ? s13 : s10;

  const runAlignAnimation = useCallback(() => {
    const rg = rulerGRef.current;
    if (!rg) return;

    if (typeof onAnimatingChange === "function") onAnimatingChange(true);
    applyRulerGeometry();

    if (tlRef.current) tlRef.current.kill();
    const navAfter =
      step === 13 ? s13.navAfterAlign : APP_DATA.steps[10].navAfterAlign;
    const tl = gsap.timeline({
      onComplete: () => {
        if (typeof onAnimatingChange === "function") onAnimatingChange(false);
        setAlignPhase("done");
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(navAfter);
        }
      },
    });

    const from = {
      x: initialRulerTransform.x,
      y: initialRulerTransform.y,
      rot: 0,
    };
    const to = { x: rulerAlignX, y: rulerAlignY, rot: angleDeg };

    const state = { ...from };
    tl.to(state, {
      duration: 1.25,
      ease: "power2.inOut",
      x: to.x,
      y: to.y,
      rot: to.rot,
      onUpdate: () => {
        setRulerTransform(state.x, state.y, state.rot);
      },
    });

    tlRef.current = tl;
  }, [
    applyRulerGeometry,
    angleDeg,
    initialRulerTransform,
    onAnimatingChange,
    onUpdateTexts,
    rulerAlignX,
    rulerAlignY,
    setRulerTransform,
    step,
    s13.navAfterAlign,
  ]);

  const handleButton1 = () => {
    if (step !== 10 && step !== 13) return;
    if (step === 10 && step10EntryPhase !== "done") return;
    if (alignPhase !== "idle") return;
    if (typeof playSound === "function") playSound("click");
    setAlignPhase("animating");
    runAlignAnimation();
  };

  const handleButton2 = () => {
    if (step !== 10 && step !== 13) return;
    if (alignPhase !== "done" || phase2Started || locked) return;
    if (typeof playSound === "function") playSound("click");
    setPhase2Started(true);
    setMeasureOpen(true);
    if (step === 10) {
      setSliderVal(0);
      setDragNudgeSeen((prev) => ({ ...prev, pq: false }));
    }
    if (step === 13) {
      setSliderCm(0);
      setSliderMm(0);
      setS13SubPhase("cm");
      setS13CmLocked(null);
      setS13CmConfirmed(false);
      setS13Phase3Started(false);
      setS13CmError(false);
      setS13MmError(false);
      setDragNudgeSeen((prev) => ({ ...prev, cm: false }));
    }
    if (typeof onUpdateTexts === "function") {
      if (step === 13) {
        onUpdateTexts(s13.navSliderCm || s13.navSlider);
      } else {
        onUpdateTexts(lessonCfg.navSlider);
      }
    }
  };

  const applyStep10CmValue = useCallback(
    (cmRaw, playTick) => {
      if (locked || step !== 10) return;
      const v = Math.max(0, Math.min(SLIDER_MAX, Math.round(cmRaw)));
      if (v >= SEGMENT_CM) {
        setSliderVal(SEGMENT_CM);
        setLocked(true);
        setMovingCorrect(true);
        if (typeof playSound === "function") playSound("correct");
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(APP_DATA.steps[10].navReadMeasure);
        }
      } else {
        setSliderVal((prev) => {
          if (playTick && v !== prev && typeof playSound === "function")
            playSound("tick");
          return v;
        });
      }
    },
    [locked, step, onSetNextEnabled, onUpdateTexts],
  );

  const targetWholeCm = Math.floor(lengthMm / 10);

  const tryS13CmPhaseComplete = useCallback(
    (cmValue) => {
      if (
        locked ||
        step !== 13 ||
        s13SubPhase !== "cm" ||
        s13Phase3Started ||
        s13CmConfirmed
      )
        return;
      const v =
        typeof cmValue === "number" && !Number.isNaN(cmValue)
          ? cmValue
          : sliderCm;
      if (typeof playSound === "function") {
        playSound(v === targetWholeCm ? "correct" : "wrong");
      }
      if (v !== targetWholeCm) {
        setS13CmError(true);
        return;
      }
      setS13CmError(false);
      setSliderCm(v);
      setS13CmLocked(v);
      setS13CmConfirmed(true);
      if (typeof onUpdateTexts === "function") {
        onUpdateTexts(s13.navAfterCmCorrect || s13.navSliderCm);
      }
    },
    [
      locked,
      step,
      s13SubPhase,
      s13Phase3Started,
      s13CmConfirmed,
      sliderCm,
      targetWholeCm,
      onUpdateTexts,
      s13.navAfterCmCorrect,
      s13.navSliderCm,
    ],
  );

  const handleButton3 = () => {
    if (step !== 13) return;
    if (
      alignPhase !== "done" ||
      !measureOpen ||
      !phase2Started ||
      !s13CmConfirmed ||
      s13Phase3Started ||
      locked
    )
      return;
    if (typeof playSound === "function") playSound("click");
    setS13Phase3Started(true);
    setS13SubPhase("mm");
    setSliderMm(0);
    setS13MmError(false);
    setDragNudgeSeen((prev) => ({ ...prev, mm: false }));
    if (typeof onUpdateTexts === "function") {
      const wc = Math.floor(lengthMm / 10);
      const navMm =
        typeof fillTemplate === "function"
          ? fillTemplate(s13.navSliderMm, {
              wholeCm: String(wc),
              wholeCmPlus1: String(wc + 1),
            })
          : s13.navSliderMm;
      onUpdateTexts(navMm);
    }
  };

  const tryS13MmPhaseComplete = useCallback(
    (mmValue) => {
      if (locked || step !== 13 || s13SubPhase !== "mm" || !s13Phase3Started)
        return;
      if (s13CmLocked === null) return;
      const mmV =
        typeof mmValue === "number" && !Number.isNaN(mmValue)
          ? mmValue
          : sliderMm;
      const ok = s13CmLocked * 10 + mmV === lengthMm;
      if (typeof playSound === "function") {
        playSound(ok ? "correct" : "wrong");
      }
      if (!ok) {
        setS13MmError(true);
        return;
      }
      setS13MmError(false);
      setSliderMm(mmV);
      setLocked(true);
      setMovingCorrect(true);
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
      if (typeof onUpdateTexts === "function") {
        onUpdateTexts(s13.navReadMeasure);
      }
    },
    [
      locked,
      step,
      s13SubPhase,
      s13Phase3Started,
      s13CmLocked,
      sliderMm,
      lengthMm,
      onSetNextEnabled,
      onUpdateTexts,
      s13.navReadMeasure,
    ],
  );

  if (step >= 1 && step <= 9) {
    const sd = APP_DATA.steps[step];
    const sea = "#3d9b84";
    const cyan = "#5EADEB";
    /** Baseline highlight for 1 cm / 1 mm measure segments (steps 5 & 8). */
    const introMeasureLineOrange = "#ff8c00";
    /** Top of long cm ticks in ruler.svg (viewBox 0 0 309 54). */
    const yBase = 2.75;
    const yPeakStep1 = -40;
    const yLabelStep1 = (yBase + yPeakStep1) / 2 - 10;
    const yPeakCmZoom = -40;
    const yPeakMm = -8;
    const xAtCm = (cm) => RULER.zeroX + cm * RULER.cm;
    /** Cm arc stroke in zoom steps (3–4); arrowhead scales vs this reference. */
    const INTRO_CM_STROKE_ZOOM = 0.88;
    const INTRO_CM_STROKE_ZOOM_REF = 0.48;
    const zoomArrowheadScale = INTRO_CM_STROKE_ZOOM / INTRO_CM_STROKE_ZOOM_REF;

    const introZoomed =
      (step === 2 && introZoomActive) || step === 3 || step === 4 || step === 6;
    const scalerZoomClass =
      step === 8
        ? " ruler-intro-scaler--zoom780"
        : step === 7 || step === 9
          ? " ruler-intro-scaler--zoom650"
          : step === 5
            ? " ruler-intro-scaler--zoom350"
            : introZoomed
              ? " ruler-intro-scaler--zoom"
              : "";

    const introDefs = React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "rulerIntroArrow",
          markerWidth: "10",
          markerHeight: "10",
          refX: "8",
          refY: "3",
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        },
        React.createElement("path", {
          d: "M0,0 L0,6 L9,3 z",
          fill: sea,
        }),
      ),
    );
    /**
     * Mini triangle (⅕ of rulerIntroArrow) tuned for INTRO_CM_STROKE_ZOOM_REF, then scaled by
     * zoomArrowheadScale so the head stays proportional to INTRO_CM_STROKE_ZOOM.
     */
    const zw = 2 * zoomArrowheadScale;
    const introDefsZoom = React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "rulerIntroArrowZoom",
          markerWidth: String(zw),
          markerHeight: String(zw),
          refX: String(1.6 * zoomArrowheadScale),
          refY: String(0.6 * zoomArrowheadScale),
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        },
        React.createElement("path", {
          d: `M0,0 L0,${1.2 * zoomArrowheadScale} L${1.8 * zoomArrowheadScale},${0.6 * zoomArrowheadScale} z`,
          fill: sea,
        }),
      ),
    );

    const zwMm = zoomArrowheadScale * 0.52;
    const zwMmS7 = zoomArrowheadScale * 0.28;
    const introDefsMmZoomCyan = React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "rulerIntroMmArrowZoomCyan",
          markerWidth: String(zwMm * 2),
          markerHeight: String(zwMm * 2),
          refX: String(1.6 * zwMm),
          refY: String(0.6 * zwMm),
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        },
        React.createElement("path", {
          d: `M0,0 L0,${1.2 * zwMm} L${1.8 * zwMm},${0.6 * zwMm} z`,
          fill: cyan,
        }),
      ),
      React.createElement(
        "marker",
        {
          id: "rulerIntroMmArrowZoomCyanS7",
          markerWidth: String(zwMmS7 * 2),
          markerHeight: String(zwMmS7 * 2),
          refX: String(1.6 * zwMmS7),
          refY: String(0.6 * zwMmS7),
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        },
        React.createElement("path", {
          d: `M0,0 L0,${1.2 * zwMmS7} L${1.8 * zwMmS7},${0.6 * zwMmS7} z`,
          fill: cyan,
        }),
      ),
    );

    let introSvgOverlay = null;
    if (step === 1) {
      const step1Children = [];
      for (let i = 0; i < STEP1_ARROW_COUNT; i++) {
        const x0 = xAtCm(i);
        const x1 = xAtCm(i + 1);
        const xm = (x0 + x1) / 2;
        const d = `M ${x0} ${yBase} Q ${xm} ${yPeakStep1} ${x1} ${yBase}`;
        const isDoneArrow = i < step1RevealIndex;
        const isCurrentArrow = i === step1RevealIndex;
        const step1ArcPhase = isDoneArrow
          ? "completed"
          : isCurrentArrow && step1RevealPhase === "drawing"
            ? "drawing"
            : "pending";
        const showHead =
          isDoneArrow ||
          (isCurrentArrow &&
            (step1RevealPhase === "head" ||
              step1RevealPhase === "label" ||
              step1RevealPhase === "done"));
        const showLabel =
          isDoneArrow ||
          (isCurrentArrow &&
            (step1RevealPhase === "label" || step1RevealPhase === "done"));
        const headAngleDeg =
          (Math.atan2(yBase - yPeakStep1, x1 - xm) * 180) / Math.PI;
        step1Children.push(
          React.createElement("path", {
            key: `intro-arc-${i}`,
            d,
            fill: "none",
            stroke: sea,
            strokeWidth: 1.75,
            strokeLinecap: "round",
            className: `ruler-intro-step1-arc ruler-intro-step1-arc--${step1ArcPhase}`,
          }),
        );
        step1Children.push(
          React.createElement("polygon", {
            key: `intro-head-${i}`,
            points: "-8,-3 -8,3 1,0",
            fill: sea,
            className: `ruler-intro-step1-head${
              showHead ? " ruler-intro-step1-head--visible" : ""
            }`,
            transform: `translate(${x1}, ${yBase}) rotate(${headAngleDeg})`,
          }),
        );
        step1Children.push(
          React.createElement(
            "text",
            {
              key: `intro-lbl-${i}`,
              x: xm,
              y: yLabelStep1,
              fill: sea,
              fontSize: 11,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "central",
              fontFamily: "system-ui, sans-serif",
              className: `ruler-intro-step1-label${
                showLabel ? " ruler-intro-step1-label--visible" : ""
              }`,
            },
            String(i + 1),
          ),
        );
      }
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefs,
        React.createElement(
          "g",
          { className: "ruler-intro-arrows-layer" },
          step1Children,
        ),
      );
    } else if (step === 3) {
      const mmNodes = [];
      const cmNodes = [];
      for (let c = 0; c < STEP3_CM_COUNT; c++) {
        for (let j = 0; j < STEP3_MM_PER_CM; j++) {
          const t0 = c + j * 0.1;
          const t1 = c + (j + 1) * 0.1;
          const xa = xAtCm(t0);
          const xb = xAtCm(t1);
          const xm = (xa + xb) / 2;
          const d = `M ${xa} ${yBase} Q ${xm} ${yPeakMm} ${xb} ${yBase}`;
          const mmPhase =
            c < step3CmIndex
              ? "completed"
              : c > step3CmIndex
                ? "pending"
                : step3Phase !== "mm"
                  ? "pending"
                  : j < step3MmIndex
                    ? "completed"
                    : j === step3MmIndex
                      ? "drawing"
                      : "pending";
          mmNodes.push(
            React.createElement("path", {
              key: `intro-mm-${c}-${j}`,
              d,
              fill: "none",
              stroke: cyan,
              strokeWidth: 0.32,
              strokeLinecap: "round",
              className: `ruler-intro-step3-mm ruler-intro-step3-mm--${mmPhase}`,
            }),
          );
        }
      }
      for (let i = 0; i < STEP3_CM_COUNT; i++) {
        const x0 = xAtCm(i);
        const x1 = xAtCm(i + 1);
        const xm = (x0 + x1) / 2;
        const d = `M ${x0} ${yBase} Q ${xm} ${yPeakCmZoom} ${x1} ${yBase}`;
        const cmPhase =
          i < step3CmIndex
            ? "completed"
            : i > step3CmIndex
              ? "pending"
              : step3Phase === "cmLine"
                ? "drawing"
                : step3Phase === "cmHead" ||
                    step3Phase === "mm" ||
                    step3Phase === "done"
                  ? "completed"
                  : "pending";
        const showCmHead =
          i < step3CmIndex ||
          (i === step3CmIndex &&
            (step3Phase === "cmHead" ||
              step3Phase === "mm" ||
              step3Phase === "done"));
        const cmHeadAngleDeg =
          (Math.atan2(yBase - yPeakCmZoom, x1 - xm) * 180) / Math.PI;
        cmNodes.push(
          React.createElement("path", {
            key: `intro-cm-${i}`,
            d,
            fill: "none",
            stroke: sea,
            strokeWidth: INTRO_CM_STROKE_ZOOM,
            strokeLinecap: "round",
            className: `ruler-intro-step3-cm ruler-intro-step3-cm--${cmPhase}`,
          }),
        );
        cmNodes.push(
          React.createElement("polygon", {
            key: `intro-cm-head-${i}`,
            points: `-${1.8 * zoomArrowheadScale},-${0.6 * zoomArrowheadScale} -${1.8 * zoomArrowheadScale},${0.6 * zoomArrowheadScale} 0,0`,
            fill: sea,
            className: `ruler-intro-step3-cm-head${
              showCmHead ? " ruler-intro-step3-cm-head--visible" : ""
            }`,
            transform: `translate(${x1}, ${yBase}) rotate(${cmHeadAngleDeg})`,
          }),
        );
      }
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefsZoom,
        React.createElement(
          "g",
          { className: "ruler-intro-arrows-layer" },
          cmNodes,
          mmNodes,
        ),
      );
    } else if (step === 4) {
      const mmNodes = [];
      const cmNodes = [];
      for (let c = 0; c < 5; c++) {
        for (let j = 0; j < 10; j++) {
          const t0 = c + j * 0.1;
          const t1 = c + (j + 1) * 0.1;
          const xa = xAtCm(t0);
          const xb = xAtCm(t1);
          const xm = (xa + xb) / 2;
          const d = `M ${xa} ${yBase} Q ${xm} ${yPeakMm} ${xb} ${yBase}`;
          mmNodes.push(
            React.createElement("path", {
              key: `intro-mm-${c}-${j}`,
              d,
              fill: "none",
              stroke: cyan,
              strokeWidth: 0.32,
              strokeLinecap: "round",
            }),
          );
        }
      }
      for (let i = 0; i < 5; i++) {
        const x0 = xAtCm(i);
        const x1 = xAtCm(i + 1);
        const xm = (x0 + x1) / 2;
        const d = `M ${x0} ${yBase} Q ${xm} ${yPeakCmZoom} ${x1} ${yBase}`;
        cmNodes.push(
          React.createElement("path", {
            key: `intro-cm-${i}`,
            d,
            fill: "none",
            stroke: sea,
            strokeWidth: INTRO_CM_STROKE_ZOOM,
            strokeLinecap: "round",
            markerEnd: "url(#rulerIntroArrowZoom)",
          }),
        );
      }
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefsZoom,
        React.createElement(
          "g",
          { className: "ruler-intro-arrows-layer" },
          mmNodes,
          cmNodes,
        ),
      );
    } else if (step === 5) {
      const x0 = xAtCm(0);
      const x1 = xAtCm(1);
      const xm = (x0 + x1) / 2;
      const d = `M ${x0} ${yBase} Q ${xm} ${yPeakCmZoom} ${x1} ${yBase}`;
      const yLbl5 = yBase / 2 - 5;
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefsZoom,
        React.createElement(
          "g",
          { className: "ruler-intro-arrows-layer" },
          React.createElement("line", {
            x1: x0,
            y1: yBase,
            x2: x1,
            y2: yBase,
            stroke: introMeasureLineOrange,
            strokeWidth: 1.2,
            strokeLinecap: "round",
            className: "ruler-intro-arrows-layer--fade-in",
          }),
          React.createElement("path", {
            key: "s5-cm",
            d,
            fill: "none",
            stroke: sea,
            strokeWidth: INTRO_CM_STROKE_ZOOM,
            strokeLinecap: "round",
            markerEnd: "url(#rulerIntroArrowZoom)",
          }),
          React.createElement(
            "text",
            {
              x: xm,
              y: yLbl5,
              fill: "#ffffff",
              fontSize: 5,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "central",
              fontFamily: "system-ui, sans-serif",
              className: "ruler-intro-arrows-layer--fade-in",
            },
            "1 cm",
          ),
        ),
      );
    } else if (step === 6) {
      const cmNodes6 = [];
      const yLbl6 = (yBase + yPeakCmZoom) / 2 + 6;
      for (let i = 0; i < 5; i++) {
        const xa = xAtCm(i);
        const xb = xAtCm(i + 1);
        const xm = (xa + xb) / 2;
        const d = `M ${xa} ${yBase} Q ${xm} ${yPeakCmZoom} ${xb} ${yBase}`;
        cmNodes6.push(
          React.createElement("path", {
            key: `intro-s6-cm-${i}`,
            d,
            fill: "none",
            stroke: sea,
            strokeWidth: INTRO_CM_STROKE_ZOOM,
            strokeLinecap: "round",
            markerEnd: "url(#rulerIntroArrowZoom)",
          }),
        );
        cmNodes6.push(
          React.createElement(
            "text",
            {
              key: `intro-s6-lbl-${i}`,
              x: xm,
              y: yLbl6,
              fill: sea,
              fontSize: 10,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "central",
              fontFamily: "system-ui, sans-serif",
            },
            String(i + 1),
          ),
        );
      }
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefsZoom,
        React.createElement(
          "g",
          {
            className:
              "ruler-intro-arrows-layer ruler-intro-arrows-layer--fade-in",
          },
          cmNodes6,
        ),
      );
    } else if (step === 7) {
      const mmNodes7 = [];
      const yLblMm7 = (yBase + yPeakMm) / 2 - 1.5;
      const mmStrokeS7 = 0.38;
      for (let j = 0; j < 10; j++) {
        const t0 = j * 0.1;
        const t1 = (j + 1) * 0.1;
        const xa = xAtCm(t0);
        const xb = xAtCm(t1);
        const xm = (xa + xb) / 2;
        const d = `M ${xa} ${yBase} Q ${xm} ${yPeakMm} ${xb} ${yBase}`;
        const isDoneArrow = j < step7RevealIndex;
        const isCurrentArrow = j === step7RevealIndex;
        const mmPhase = isDoneArrow
          ? "completed"
          : isCurrentArrow
            ? step7RevealPhase === "drawing"
              ? "drawing"
              : step7RevealPhase === "head" ||
                  step7RevealPhase === "label" ||
                  step7RevealPhase === "done"
                ? "completed"
                : "pending"
            : "pending";
        const showHead =
          isDoneArrow ||
          (isCurrentArrow &&
            (step7RevealPhase === "head" ||
              step7RevealPhase === "label" ||
              step7RevealPhase === "done"));
        const showLabel =
          isDoneArrow ||
          (isCurrentArrow &&
            (step7RevealPhase === "label" || step7RevealPhase === "done"));
        const mmHeadAngleDeg =
          (Math.atan2(yBase - yPeakMm, xb - xm) * 180) / Math.PI;
        mmNodes7.push(
          React.createElement("path", {
            key: `intro-s7-mm-${j}`,
            d,
            fill: "none",
            stroke: cyan,
            strokeWidth: mmStrokeS7,
            strokeLinecap: "round",
            className: `ruler-intro-step7-mm ruler-intro-step7-mm--${mmPhase}`,
          }),
        );
        mmNodes7.push(
          React.createElement("polygon", {
            key: `intro-s7-head-${j}`,
            points: `-${1.8 * zwMm},-${0.6 * zwMm} -${1.8 * zwMm},${0.6 * zwMm} 0,0`,
            fill: cyan,
            className: `ruler-intro-step7-head${
              showHead ? " ruler-intro-step7-head--visible" : ""
            }`,
            transform: `translate(${xb}, ${yBase}) rotate(${mmHeadAngleDeg})`,
          }),
        );
        mmNodes7.push(
          React.createElement(
            "text",
            {
              key: `intro-s7-lbl-${j}`,
              x: xm,
              y: yLblMm7,
              fill: cyan,
              fontSize: 2,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "central",
              fontFamily: "system-ui, sans-serif",
              className: `ruler-intro-step7-label${
                showLabel ? " ruler-intro-step7-label--visible" : ""
              }`,
            },
            String(j + 1),
          ),
        );
      }
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefsMmZoomCyan,
        React.createElement(
          "g",
          { className: "ruler-intro-arrows-layer" },
          mmNodes7,
        ),
      );
    } else if (step === 8) {
      const x0 = xAtCm(0);
      const x1 = xAtCm(0.1);
      const xm = (x0 + x1) / 2;
      const d = `M ${x0} ${yBase} Q ${xm} ${yPeakMm} ${x1} ${yBase}`;
      const yLbl7 = yBase / 2 - 5;
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefsMmZoomCyan,
        React.createElement(
          "g",
          { className: "ruler-intro-arrows-layer" },
          React.createElement("line", {
            x1: x0,
            y1: yBase,
            x2: x1,
            y2: yBase,
            stroke: introMeasureLineOrange,
            strokeWidth: 0.3,
            strokeLinecap: "round",
            className: "ruler-intro-arrows-layer--fade-in",
          }),
          React.createElement("path", {
            key: "s8-mm",
            d,
            fill: "none",
            stroke: cyan,
            strokeWidth: 0.22,
            strokeLinecap: "round",
            markerEnd: "url(#rulerIntroMmArrowZoomCyanS7)",
          }),
          React.createElement(
            "text",
            {
              x: xm,
              y: yLbl7,
              fill: "#ffffff",
              fontSize: 1.2,
              fontWeight: 400,
              textAnchor: "middle",
              dominantBaseline: "central",
              fontFamily: "system-ui, sans-serif",
              className: "ruler-intro-arrows-layer--fade-in",
            },
            "1 mm",
          ),
        ),
      );
    } else if (step === 9) {
      const mmNodes9 = [];
      const mmLabelNodes9 = [];
      const xCm0 = xAtCm(0);
      const xCm1 = xAtCm(1);
      const xCmMid = (xCm0 + xCm1) / 2;
      const yPeakCm9 = -28;
      const cmStroke9 = INTRO_CM_STROKE_ZOOM * 0.6;
      const dCm = `M ${xCm0} ${yBase} Q ${xCmMid} ${yPeakCm9} ${xCm1} ${yBase}`;
      const yLblMm9 = (yBase + yPeakMm) / 2 - 1.5;
      const showMmLabels9 = step9IntroDone && step9SelectedOption !== null;
      const showCmArrow9 = step9SelectedOption === null;
      const cmPhase9 =
        step9Phase === "cmLine"
          ? "drawing"
          : step9Phase === "cmHead" ||
              step9Phase === "mm" ||
              step9Phase === "done"
            ? "completed"
            : "pending";
      const showCmHead9 =
        step9Phase === "cmHead" || step9Phase === "mm" || step9Phase === "done";
      const cmHeadAngleDeg9 =
        (Math.atan2(yBase - yPeakCm9, xCm1 - xCmMid) * 180) / Math.PI;
      for (let j = 0; j < 10; j++) {
        const t0 = j * 0.1;
        const t1 = (j + 1) * 0.1;
        const xa = xAtCm(t0);
        const xb = xAtCm(t1);
        const xm = (xa + xb) / 2;
        const d = `M ${xa} ${yBase} Q ${xm} ${yPeakMm} ${xb} ${yBase}`;
        const mmPhase9 =
          step9Phase !== "mm" && step9Phase !== "done"
            ? "pending"
            : step9Phase === "done" || j < step9MmIndex
              ? "completed"
              : j === step9MmIndex
                ? "drawing"
                : "pending";
        const mmHeadAngleDeg9 =
          (Math.atan2(yBase - yPeakMm, xb - xm) * 180) / Math.PI;
        const showMmHead9 =
          step9Phase === "done" || (step9Phase === "mm" && j < step9MmIndex);
        mmNodes9.push(
          React.createElement("path", {
            key: `intro-s9-mm-${j}`,
            d,
            fill: "none",
            stroke: cyan,
            strokeWidth: 0.19,
            strokeLinecap: "round",
            className: `ruler-intro-step9-mm ruler-intro-step9-mm--${mmPhase9}`,
          }),
        );
        mmNodes9.push(
          React.createElement("polygon", {
            key: `intro-s9-mm-head-${j}`,
            points: `-${1.8 * zwMm},-${0.6 * zwMm} -${1.8 * zwMm},${0.6 * zwMm} 0,0`,
            fill: cyan,
            className: `ruler-intro-step9-mm-head${
              showMmHead9 ? " ruler-intro-step9-mm-head--visible" : ""
            }`,
            transform: `translate(${xb}, ${yBase}) rotate(${mmHeadAngleDeg9})`,
          }),
        );
        if (showMmLabels9) {
          mmLabelNodes9.push(
            React.createElement(
              "text",
              {
                key: `intro-s9-lbl-${j + 1}`,
                x: xm,
                y: yLblMm9,
                fill: cyan,
                fontSize: 2,
                fontWeight: 700,
                textAnchor: "middle",
                dominantBaseline: "central",
                fontFamily: "system-ui, sans-serif",
              },
              String(j + 1),
            ),
          );
        }
      }
      introSvgOverlay = React.createElement(
        "svg",
        {
          className: "ruler-intro-arrows-svg",
          viewBox: "0 0 309 54",
          preserveAspectRatio: "xMinYMin meet",
          xmlns: "http://www.w3.org/2000/svg",
          style: { overflow: "visible" },
          "aria-hidden": true,
        },
        introDefsZoom,
        introDefsMmZoomCyan,
        React.createElement(
          "g",
          { className: "ruler-intro-arrows-layer" },
          showCmArrow9 &&
            React.createElement("path", {
              key: "s9-cm",
              d: dCm,
              fill: "none",
              stroke: sea,
              strokeWidth: cmStroke9,
              strokeLinecap: "round",
              className: `ruler-intro-step9-cm ruler-intro-step9-cm--${cmPhase9}`,
            }),
          showCmArrow9 &&
            React.createElement("polygon", {
              key: "s9-cm-head",
              points: `-${1.8 * zoomArrowheadScale},-${0.6 * zoomArrowheadScale} -${1.8 * zoomArrowheadScale},${0.6 * zoomArrowheadScale} 0,0`,
              fill: sea,
              className: `ruler-intro-step9-cm-head${
                showCmHead9 ? " ruler-intro-step9-cm-head--visible" : ""
              }`,
              transform: `translate(${xCm1}, ${yBase}) rotate(${cmHeadAngleDeg9})`,
            }),
          mmNodes9,
          mmLabelNodes9,
        ),
      );
    }

    const handleIntroScalerTransitionEnd = (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== "width" && e.propertyName !== "transform") return;
      if (step === 2 && introZoomActive) {
        setIntroHighlightVisible(true);
        return;
      }
      if (step === 6) {
        setStep6HighlightVisible(true);
      }
    };

    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        {
          className: "canvas-left-panel ruler-lesson-left ruler-intro-stage",
        },
        React.createElement(
          "div",
          { className: "ruler-intro-viewport" },
          React.createElement(
            "div",
            {
              className: `ruler-intro-scaler${scalerZoomClass}`,
              onTransitionEnd: handleIntroScalerTransitionEnd,
            },
            React.createElement(
              "div",
              {
                className: `ruler-intro-inner${
                  step === 8
                    ? " ruler-intro-inner--lower-step7"
                    : step === 7 || step === 9
                      ? " ruler-intro-inner--lower-step6"
                      : step === 5
                        ? " ruler-intro-inner--lower-step5"
                        : step >= 3
                          ? " ruler-intro-inner--lower"
                          : ""
                }`,
              },
              React.createElement("img", {
                className: "ruler-intro-ruler-img",
                src: "assets/ruler.svg",
                alt: "",
              }),
              introSvgOverlay,
              step === 2 &&
                introHighlightVisible &&
                React.createElement("div", {
                  className: "ruler-cm-highlight-box",
                  "aria-hidden": true,
                }),
              step === 6 &&
                React.createElement("div", {
                  className: `ruler-step6-highlight-box${
                    step6HighlightVisible
                      ? " ruler-step6-highlight-box--visible"
                      : ""
                  }`,
                  "aria-hidden": true,
                }),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "canvas-right-panel ruler-action-panel" },
        step === 9
          ? !step9IntroDone
            ? null
            : React.createElement(
                "div",
                { className: "mcq-panel" },
                step9SelectedOption === null &&
                  React.createElement(
                    "div",
                    {
                      className: "mcq-feedback",
                      style: {
                        visibility: "visible",
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "2px dashed rgba(255, 255, 255, 0.8)",
                        color: "#ffffff",
                      },
                    },
                    sd.feedbackNeutral || "",
                  ),
                React.createElement(MCQPanel, {
                  content: null,
                  mcqData: {
                    title: "",
                    options: sd.mcqOptions || [],
                    feedbacks: {
                      wrong: sd.feedbackWrong || "",
                      correct: sd.feedbackCorrect || "",
                    },
                  },
                  selectedOption: step9SelectedOption,
                  isCorrect: step9IsCorrect,
                  onOptionClick: handleStep9OptionClick,
                  showFeedback: true,
                  feedbackOverride: null,
                  shake: step9Shake,
                }),
              )
          : React.createElement(
              "div",
              {
                className: `ruler-feedback-box${
                  step === 5 || step === 6
                    ? " ruler-feedback-box--sea"
                    : step === 7 || step === 8
                      ? " ruler-feedback-box--cyan"
                      : ""
                }`,
              },
              React.createElement("div", {
                className: "ruler-feedback-line",
                dangerouslySetInnerHTML: { __html: sd.feedbackText || "" },
              }),
            ),
      ),
    );
  }

  const applyS13CmDrag = useCallback(
    (cmRaw, playTick) => {
      if (locked || step !== 13 || s13SubPhase !== "cm" || s13CmConfirmed) return;
      const v = Math.max(0, Math.min(S13_CM_DRAG_MAX, Math.round(cmRaw)));
      setS13CmError(false);
      setSliderCm((prev) => {
        if (playTick && v !== prev && typeof playSound === "function")
          playSound("tick");
        return v;
      });
    },
    [locked, step, s13SubPhase, s13CmConfirmed],
  );

  const applyS13MmDrag = useCallback(
    (cmRaw, playTick) => {
      if (
        locked ||
        step !== 13 ||
        s13SubPhase !== "mm" ||
        !s13Phase3Started ||
        s13CmLocked === null
      )
        return;
      const frac = cmRaw - s13CmLocked;
      const v = Math.max(0, Math.min(S13_MM_DRAG_MAX, Math.round(frac * 10)));
      setS13MmError(false);
      setSliderMm((prev) => {
        if (playTick && v !== prev && typeof playSound === "function")
          playSound("tick");
        return v;
      });
    },
    [locked, step, s13SubPhase, s13Phase3Started, s13CmLocked],
  );

  const dragNudgeImage = (visible) =>
    visible
      ? React.createElement("image", {
          key: "drag-nudge",
          href: DRAG_NUDGE_SRC,
          x: DRAG_NUDGE_X,
          y: DRAG_NUDGE_Y,
          width: DRAG_NUDGE_SIZE,
          height: DRAG_NUDGE_SIZE,
          preserveAspectRatio: "xMidYMid meet",
          opacity: 0.65,
          style: { pointerEvents: "none" },
        })
      : null;

  const dismissDragNudge = (kind) => {
    setDragNudgeSeen((prev) =>
      prev[kind] ? prev : { ...prev, [kind]: true },
    );
  };

  const handleMarkerPointerDown = (e, kind) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    if (kind === "pq" || kind === "cm" || kind === "mm") dismissDragNudge(kind);
    if (typeof e.currentTarget?.setPointerCapture === "function") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    markerDragRef.current = { kind, pointerId: e.pointerId };
    if (kind === "pq") {
      applyStep10CmValue(clientToCmAlongSegment(e.clientX, e.clientY), false);
    } else if (kind === "cm") {
      applyS13CmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), false);
    } else if (kind === "mm") {
      applyS13MmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), false);
    }
  };

  const handleMarkerPointerMove = (e) => {
    const drag = markerDragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.kind === "pq") {
      applyStep10CmValue(clientToCmAlongSegment(e.clientX, e.clientY), true);
    } else if (drag.kind === "cm") {
      applyS13CmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), true);
    } else if (drag.kind === "mm") {
      applyS13MmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), true);
    }
  };

  const handleMarkerPointerUp = (e) => {
    const drag = markerDragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.kind === "cm") {
      const cmV = Math.max(
        0,
        Math.min(
          S13_CM_DRAG_MAX,
          Math.round(pointerCmOnSegment(e.clientX, e.clientY, false)),
        ),
      );
      tryS13CmPhaseComplete(cmV);
    } else if (drag.kind === "mm" && s13CmLocked !== null) {
      const cmAlong = pointerCmOnSegment(e.clientX, e.clientY, false);
      const mmV = Math.max(
        0,
        Math.min(S13_MM_DRAG_MAX, Math.round((cmAlong - s13CmLocked) * 10)),
      );
      tryS13MmPhaseComplete(mmV);
    }
    if (typeof e.currentTarget?.releasePointerCapture === "function") {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    markerDragRef.current = null;
  };

  const pqMarkerDraggable = step === 10 && measureOpen && !locked;
  const cmMarkerDraggable =
    step === 13 &&
    measureOpen &&
    s13SubPhase === "cm" &&
    !s13CmConfirmed &&
    !locked;
  const mmMarkerDraggable =
    step === 13 &&
    measureOpen &&
    s13Phase3Started &&
    s13SubPhase === "mm" &&
    !locked;

  const showPqDragNudge = pqMarkerDraggable && !dragNudgeSeen.pq;
  const showCmDragNudge = cmMarkerDraggable && !dragNudgeSeen.cm;
  const showMmDragNudge = mmMarkerDraggable && !dragNudgeSeen.mm;

  const markerDragProps = (draggable, kind) =>
    draggable
      ? {
          className: "measure-marker measure-marker--draggable",
          style: { cursor: "grab", touchAction: "none" },
          onPointerDown: (e) => handleMarkerPointerDown(e, kind),
          onPointerMove: handleMarkerPointerMove,
          onPointerUp: handleMarkerPointerUp,
          onPointerCancel: handleMarkerPointerUp,
        }
      : { className: "measure-marker" };

  const handleGridPointerDown = (e) => {
    if (!isDrawStep || userSegment) return;
    if (e.pointerType === "touch") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault?.();
    if (typeof e.currentTarget?.setPointerCapture === "function") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
        drawPointerIdRef.current = e.pointerId;
      } catch (_) {
        drawPointerIdRef.current = e.pointerId;
      }
    } else {
      drawPointerIdRef.current = e.pointerId;
    }
    const svg = e.currentTarget.ownerSVGElement || e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());
    const gx = loc.x - gridOffset.dx;
    const gy = loc.y - gridOffset.dy;
    if (gy > SVG_GRID_H) return;
    const [sx, sy] = snap(gx, gy);
    drawMovedRef.current = false;
    setDraftA([sx, sy]);
    setDraftB([sx, sy]);
    setDrawActive(true);
  };

  const handleGridPointerMove = (e) => {
    if (!isDrawStep || !drawActive || userSegment) return;
    if (e.pointerType === "touch") return;
    if (
      drawPointerIdRef.current !== null &&
      e.pointerId !== drawPointerIdRef.current
    )
      return;
    const svg = e.currentTarget.ownerSVGElement || e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());
    const gx = loc.x - gridOffset.dx;
    const gy = loc.y - gridOffset.dy;
    const [sx, sy] = snap(gx, gy);
    if (draftA) {
      const moved = Math.hypot(sx - draftA[0], sy - draftA[1]) >= 6;
      if (moved) drawMovedRef.current = true;
    }
    setDraftB([sx, sy]);
  };

  const commitDraw = () => {
    if (!isDrawStep || !draftA || !draftB || userSegment) return;
    if (!drawMovedRef.current) {
      setDraftA(null);
      setDraftB(null);
      return;
    }
    const d = Math.hypot(draftB[0] - draftA[0], draftB[1] - draftA[1]);
    if (d < 1e-6) {
      setDraftA(null);
      setDraftB(null);
      setDrawActive(false);
      return;
    }
    const mm = Math.round(d / pxPerMm);
    if (mm < 10) {
      if (typeof playSound === "function") playSound("wrong");
      setDraftA(null);
      setDraftB(null);
      setDrawActive(false);
      return;
    }
    if (typeof onUserSegmentChange === "function") {
      onUserSegmentChange({
        ax: draftA[0],
        ay: draftA[1],
        bx: draftB[0],
        by: draftB[1],
        lengthMm: mm,
      });
    }
    if (typeof playSound === "function") playSound("click");
    if (typeof onUpdateTexts === "function" && APP_DATA.steps[12].navTextDone) {
      onUpdateTexts(APP_DATA.steps[12].navTextDone);
    }
    setDraftA(null);
    setDraftB(null);
    setDrawActive(false);
  };

  const handleGridPointerUp = (e) => {
    if (!isDrawStep) return;
    if (e?.pointerType === "touch") return;
    if (
      drawPointerIdRef.current !== null &&
      e?.pointerId !== undefined &&
      e.pointerId !== drawPointerIdRef.current
    )
      return;
    if (drawActive) {
      commitDraw();
    }
    if (
      e &&
      typeof e.currentTarget?.releasePointerCapture === "function" &&
      e.pointerId !== undefined
    ) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    drawPointerIdRef.current = null;
    drawMovedRef.current = false;
    setDrawActive(false);
  };

  const handleGridPointerLeave = (e) => {
    if (!isDrawStep) return;
    // Touch drawing should continue until pointerup/cancel; leave can fire while dragging.
    if (e?.pointerType && e.pointerType !== "mouse") return;
    handleGridPointerUp(e);
  };

  const getTouchPoint = (evt) => {
    const touch = evt.touches?.[0] || evt.changedTouches?.[0];
    if (!touch) return null;
    const svg = evt.currentTarget.ownerSVGElement || evt.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = touch.clientX;
    pt.y = touch.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const loc = pt.matrixTransform(ctm.inverse());
    return { x: loc.x - gridOffset.dx, y: loc.y - gridOffset.dy };
  };

  const handleGridTouchStart = (e) => {
    if (!isDrawStep || userSegment) return;
    const loc = getTouchPoint(e);
    if (!loc || loc.y > SVG_GRID_H) return;
    const [sx, sy] = snap(loc.x, loc.y);
    drawTouchActiveRef.current = true;
    drawMovedRef.current = false;
    setDraftA([sx, sy]);
    setDraftB([sx, sy]);
    setDrawActive(true);
  };

  const handleGridTouchMove = (e) => {
    if (
      !isDrawStep ||
      !drawTouchActiveRef.current ||
      !drawActive ||
      userSegment
    )
      return;
    const loc = getTouchPoint(e);
    if (!loc) return;
    const [sx, sy] = snap(loc.x, loc.y);
    if (draftA) {
      const moved = Math.hypot(sx - draftA[0], sy - draftA[1]) >= 6;
      if (moved) drawMovedRef.current = true;
    }
    setDraftB([sx, sy]);
  };

  const handleGridTouchEnd = (e) => {
    if (!isDrawStep || !drawTouchActiveRef.current) return;
    if (drawActive) commitDraw();
    drawTouchActiveRef.current = false;
    drawMovedRef.current = false;
    setDrawActive(false);
  };

  const btn1Class =
    step === 10 && step10EntryPhase !== "done"
      ? "disabled"
      : alignPhase === "idle"
        ? "active"
        : alignPhase === "animating"
          ? "ongoing"
          : "completed";

  const btn2Class =
    alignPhase !== "done"
      ? "disabled"
      : !phase2Started
        ? "active"
        : step === 13
          ? s13CmConfirmed
            ? "completed"
            : "ongoing"
          : locked
            ? "completed"
            : "ongoing";

  const btn3Class =
    step !== 13
      ? "disabled"
      : locked
        ? "completed"
        : alignPhase !== "done" ||
            !measureOpen ||
            !phase2Started ||
            !s13CmConfirmed
          ? "disabled"
          : !s13Phase3Started
            ? "active"
            : "ongoing";

  const showMeasureGraphicsPQ =
    measureOpen && (step === 10 || step === 11) && isPqSteps;
  const showMeasureGraphicsUser =
    userSegment && ((step === 13 && measureOpen) || step === 14 || step === 15);
  const showMeasureGraphics = showMeasureGraphicsPQ || showMeasureGraphicsUser;

  const dualMarkerMode =
    userSegment && ((step === 13 && measureOpen) || step === 14 || step === 15);

  const posMovePq = posAtCm(sliderVal);

  const posZero = posAtCm(0);
  const z1 = posZero[0] + perpUp[0] * dashLen;
  const z2 = posZero[1] + perpUp[1] * dashLen;
  const z3 = posZero[0] - perpUp[0] * dashShortLen;
  const z4 = posZero[1] - perpUp[1] * dashShortLen;

  const dualShowMmMarker =
    (step === 13 &&
      measureOpen &&
      s13Phase3Started &&
      (s13SubPhase === "mm" || locked)) ||
    step === 14 ||
    step === 15;

  let cmAlongDual = targetWholeCm;
  if (step === 13 && measureOpen) {
    cmAlongDual = s13CmLocked !== null ? s13CmLocked : sliderCm;
  }
  const posCmPt = posAtCm(cmAlongDual);

  let posMmPt = null;
  if (dualShowMmMarker) {
    let effDualCm = lengthMm / 10;
    if (
      step === 13 &&
      measureOpen &&
      !locked &&
      s13SubPhase === "mm" &&
      s13Phase3Started
    ) {
      effDualCm = (s13CmLocked ?? targetWholeCm) + sliderMm / 10;
    }
    posMmPt = posAtCm(effDualCm);
  }

  const m1 = posMovePq[0] + perpUp[0] * dashLen;
  const m2 = posMovePq[1] + perpUp[1] * dashLen;
  const m3 = posMovePq[0] - perpUp[0] * dashShortLen;
  const m4 = posMovePq[1] - perpUp[1] * dashShortLen;

  const mk = posMovePq[0] + perpUp[0] * (dashLen - markerOffset);
  const mk2 = posMovePq[1] + perpUp[1] * (dashLen - markerOffset);

  const cmDash1 = posCmPt[0] + perpUp[0] * dashLen;
  const cmDash2 = posCmPt[1] + perpUp[1] * dashLen;
  const cmDash3 = posCmPt[0] - perpUp[0] * dashShortLen;
  const cmDash4 = posCmPt[1] - perpUp[1] * dashShortLen;

  /** From mm tick along −perpUp (above ruler); cm uses +perpUp (below ruler). */
  const mmDash1 = posMmPt && posMmPt[0] - perpUp[0] * mmLongEnd;
  const mmDash2 = posMmPt && posMmPt[1] - perpUp[1] * mmLongEnd;
  const mmDash3 = posMmPt && posMmPt[0];
  const mmDash4 = posMmPt && posMmPt[1];
  const mmDashBelow1 = posMmPt && posMmPt[0] + perpUp[0] * mmDashBelowLen;
  const mmDashBelow2 = posMmPt && posMmPt[1] + perpUp[1] * mmDashBelowLen;

  const mkCm = posCmPt[0] + perpUp[0] * cmMarkerPerp;
  const mkCm2 = posCmPt[1] + perpUp[1] * cmMarkerPerp;
  const mkMm = posMmPt && posMmPt[0] - perpUp[0] * mmMarkerPerp;
  const mkMm2 = posMmPt && posMmPt[1] - perpUp[1] * mmMarkerPerp;

  const moveLineColor = movingCorrect ? "#4C9F7A" : "#E878A8";
  const moveMarkerFill = movingCorrect ? "#4C9F7A" : "#E878A8";

  const COL_CM_OK = "#4C9F7A";
  const COL_MM_OK = "#5EADEB";
  const COL_WRONG = "#C75C5C";

  const cmDualStroke =
    step === 13 && measureOpen && !locked && s13CmError ? COL_WRONG : COL_CM_OK;
  const mmDualStroke =
    step === 13 && measureOpen && s13Phase3Started && !locked && s13MmError
      ? COL_WRONG
      : COL_MM_OK;

  const mmPartDisplay =
    step === 13 &&
    measureOpen &&
    s13Phase3Started &&
    s13SubPhase === "mm" &&
    !locked
      ? sliderMm
      : lengthMm % 10;

  const gridSceneBackChildren = [];
  const gridSceneFrontChildren = [];

  gridSceneBackChildren.push(...gridLines);

  gridSceneBackChildren.push(
    React.createElement("rect", {
      key: "grid-frame",
      x: GRID_FRAME_STROKE / 2,
      y: GRID_FRAME_STROKE / 2,
      width: SVG_W - GRID_FRAME_STROKE,
      height: SVG_GRID_H - GRID_FRAME_STROKE,
      fill: "none",
      stroke: "#ffffff",
      strokeWidth: GRID_FRAME_STROKE,
      rx: GRID_FRAME_RX,
      ry: GRID_FRAME_RX,
      style: { pointerEvents: "none" },
    }),
  );

  if (showMeasureGraphics) {
    gridSceneFrontChildren.push(
      React.createElement("line", {
        key: "static-dash",
        x1: z3,
        y1: z4,
        x2: z1,
        y2: z2,
        stroke: "#E8943A",
        strokeWidth: 2,
        strokeDasharray: "8 6",
      }),
    );
    if (showMeasureGraphicsPQ) {
      gridSceneFrontChildren.push(
        React.createElement("line", {
          key: "move-dash-pq",
          x1: m3,
          y1: m4,
          x2: m1,
          y2: m2,
          stroke: moveLineColor,
          strokeWidth: 2,
          strokeDasharray: "8 6",
        }),
      );
    }
    if (dualMarkerMode) {
      gridSceneFrontChildren.push(
        React.createElement("line", {
          key: "move-dash-cm",
          x1: cmDash3,
          y1: cmDash4,
          x2: cmDash1,
          y2: cmDash2,
          stroke: cmDualStroke,
          strokeWidth: 2,
          strokeDasharray: "8 6",
        }),
      );
      if (dualShowMmMarker && posMmPt) {
        gridSceneFrontChildren.push(
          React.createElement("line", {
            key: "move-dash-mm",
            x1: mmDash3,
            y1: mmDash4,
            x2: mmDash1,
            y2: mmDash2,
            stroke: mmDualStroke,
            strokeWidth: 2,
            strokeDasharray: "8 6",
          }),
          React.createElement("line", {
            key: "move-dash-mm-below",
            x1: mmDash3,
            y1: mmDash4,
            x2: mmDashBelow1,
            y2: mmDashBelow2,
            stroke: mmDualStroke,
            strokeWidth: 2,
            strokeDasharray: "8 6",
          }),
        );
      }
    }
  }

  let segDrawA = P;
  let segDrawB = Q;
  if (isDrawStep) {
    if (userSegment) {
      segDrawA = [userSegment.ax, userSegment.ay];
      segDrawB = [userSegment.bx, userSegment.by];
    } else if (draftA && draftB) {
      segDrawA = draftA;
      segDrawB = draftB;
    }
  }

  const dSegX = segDrawB[0] - segDrawA[0];
  const dSegY = segDrawB[1] - segDrawA[1];
  const dSegLen = Math.hypot(dSegX, dSegY);
  const uSeg = dSegLen > 1e-6 ? [dSegX / dSegLen, dSegY / dSegLen] : u;

  const showSegmentLine =
    isPqSteps ||
    (isUserLesson && userSegment) ||
    (isDrawStep && userSegment) ||
    (isDrawStep && draftA && draftB);

  const segmentStrokeColor = step >= 10 ? "#FFEB3B" : "#ffffff";

  if (showSegmentLine && (!isDrawStep || userSegment || (draftA && draftB))) {
    gridSceneFrontChildren.push(
      React.createElement("line", {
        key: "seg",
        x1: segDrawA[0],
        y1: segDrawA[1],
        x2: segDrawB[0],
        y2: segDrawB[1],
        stroke: segmentStrokeColor,
        strokeWidth: 5,
        strokeLinecap: "butt",
      }),
    );
  }

  const labelOff = 22;
  const l1 = isPqSteps ? "P" : "A";
  const l2 = isPqSteps ? "Q" : "B";
  const uLab = isDrawStep ? uSeg : u;

  if (showSegmentLine && (!isDrawStep || userSegment || (draftA && draftB))) {
    gridSceneFrontChildren.push(
      React.createElement(
        "text",
        {
          key: "la",
          x: segDrawA[0] - uLab[0] * labelOff,
          y: segDrawA[1] - uLab[1] * labelOff,
          fill: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        l1,
      ),
    );
    gridSceneFrontChildren.push(
      React.createElement(
        "text",
        {
          key: "lb",
          x: segDrawB[0] + uLab[0] * labelOff,
          y: segDrawB[1] + uLab[1] * labelOff,
          fill: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        l2,
      ),
    );
  }

  if (showMeasureGraphics && showMeasureGraphicsPQ) {
    gridSceneFrontChildren.push(
      React.createElement(
        "g",
        {
          key: "marker-pq",
          transform: `translate(${mk}, ${mk2}) rotate(${angleDeg})`,
          ...markerDragProps(pqMarkerDraggable, "pq"),
        },
        pqMarkerDraggable &&
          React.createElement("circle", {
            r: 32,
            fill: "transparent",
            stroke: "none",
            style: { pointerEvents: "all" },
          }),
        React.createElement("circle", {
          r: 22,
          fill: moveMarkerFill,
          stroke: "rgba(255,255,255,0.35)",
          strokeWidth: 2,
          style: { pointerEvents: pqMarkerDraggable ? "none" : "auto" },
        }),
        dragNudgeImage(showPqDragNudge),
        React.createElement(
          "text",
          {
            x: 0,
            y: 1,
            textAnchor: "middle",
            dominantBaseline: "middle",
            fill: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            style: { pointerEvents: "none" },
          },
          String(sliderVal),
        ),
        React.createElement(
          "text",
          {
            x: 30,
            y: 1,
            textAnchor: "start",
            dominantBaseline: "middle",
            fill: moveMarkerFill,
            fontSize: 20,
            fontWeight: 600,
            style: { pointerEvents: "none" },
          },
          "cm",
        ),
      ),
    );
  }

  if (showMeasureGraphics && dualMarkerMode) {
    gridSceneFrontChildren.push(
      React.createElement(
        "g",
        {
          key: "marker-cm",
          transform: `translate(${mkCm}, ${mkCm2}) rotate(${angleDeg})`,
          ...markerDragProps(cmMarkerDraggable, "cm"),
        },
        cmMarkerDraggable &&
          React.createElement("circle", {
            r: 32,
            fill: "transparent",
            stroke: "none",
            style: { pointerEvents: "all" },
          }),
        React.createElement("circle", {
          r: 22,
          fill: cmDualStroke,
          stroke: "rgba(255,255,255,0.35)",
          strokeWidth: 2,
          style: { pointerEvents: cmMarkerDraggable ? "none" : "auto" },
        }),
        dragNudgeImage(showCmDragNudge),
        React.createElement(
          "text",
          {
            x: 0,
            y: 1,
            textAnchor: "middle",
            dominantBaseline: "middle",
            fill: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            style: { pointerEvents: "none" },
          },
          String(cmAlongDual),
        ),
        React.createElement(
          "text",
          {
            x: 30,
            y: 1,
            textAnchor: "start",
            dominantBaseline: "middle",
            fill: cmDualStroke,
            fontSize: 20,
            fontWeight: 600,
            style: { pointerEvents: "none" },
          },
          "cm",
        ),
      ),
    );
    if (dualShowMmMarker && posMmPt) {
      gridSceneFrontChildren.push(
        React.createElement(
          "g",
          {
            key: "marker-mm",
            transform: `translate(${mkMm}, ${mkMm2}) rotate(${angleDeg})`,
            ...markerDragProps(mmMarkerDraggable, "mm"),
          },
          mmMarkerDraggable &&
            React.createElement("circle", {
              r: 32,
              fill: "transparent",
              stroke: "none",
              style: { pointerEvents: "all" },
            }),
          React.createElement("circle", {
            r: 22,
            fill: mmDualStroke,
            stroke: "rgba(255,255,255,0.35)",
            strokeWidth: 2,
            style: { pointerEvents: mmMarkerDraggable ? "none" : "auto" },
          }),
          dragNudgeImage(showMmDragNudge),
          React.createElement(
            "text",
            {
              x: 0,
              y: 1,
              textAnchor: "middle",
              dominantBaseline: "middle",
              fill: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              style: { pointerEvents: "none" },
            },
            String(mmPartDisplay),
          ),
          React.createElement(
            "text",
            {
              x: 30,
              y: 1,
              textAnchor: "start",
              dominantBaseline: "middle",
              fill: mmDualStroke,
              fontSize: 14,
              fontWeight: 600,
              style: { pointerEvents: "none" },
            },
            "mm",
          ),
        ),
      );
    }
  }

  if (isDrawStep) {
    gridSceneFrontChildren.push(
      React.createElement("rect", {
        key: "draw-hit",
        x: 0,
        y: 0,
        width: SVG_W,
        height: SVG_GRID_H,
        fill: "transparent",
        style: {
          cursor: userSegment ? "default" : "crosshair",
          touchAction: "none",
        },
        onPointerDown: handleGridPointerDown,
        onPointerMove: handleGridPointerMove,
        onPointerUp: handleGridPointerUp,
        onPointerLeave: handleGridPointerLeave,
        onPointerCancel: handleGridPointerUp,
        onTouchStart: handleGridTouchStart,
        onTouchMove: handleGridTouchMove,
        onTouchEnd: handleGridTouchEnd,
        onTouchCancel: handleGridTouchEnd,
      }),
    );
  }

  let rulerLayer = null;
  if (showRulerGraphic) {
    const initialTransform =
      alignPhase === "done"
        ? `translate(${rulerAlignX}, ${rulerAlignY}) rotate(${angleDeg})`
        : `translate(${initialRulerTransform.x}, ${initialRulerTransform.y}) rotate(0)`;
    const step10RulerEnterStyle =
      step === 10
        ? {
            opacity:
              step10EntryPhase === "ruler" || step10EntryPhase === "done"
                ? 1
                : 0,
            transform:
              step10EntryPhase === "ruler" || step10EntryPhase === "done"
                ? "translateY(0px)"
                : "translateY(140px)",
            transition: "opacity 0.3s ease, transform 0.45s ease",
          }
        : null;
    rulerLayer = React.createElement(
      "g",
      {
        key: "ruler-entry-wrap",
        style: step10RulerEnterStyle || undefined,
      },
      React.createElement(
        "g",
        {
          key: "ruler-g",
          ref: rulerGRef,
          transform: initialTransform,
        },
        React.createElement("image", {
          ref: rulerImgRef,
          href: "assets/ruler.svg",
          x: roX,
          y: 0,
          width: rW,
          height: rH,
          preserveAspectRatio: "none",
        }),
      ),
    );
  }

  const gridSceneTransform = `translate(${gridOffset.dx}, ${gridOffset.dy})`;
  const svgChildren = [
    React.createElement(
      "g",
      { key: "grid-scene-back", transform: gridSceneTransform },
      ...gridSceneBackChildren,
    ),
  ];
  if (rulerLayer) svgChildren.push(rulerLayer);
  if (gridSceneFrontChildren.length) {
    svgChildren.push(
      React.createElement(
        "g",
        { key: "grid-scene-front", transform: gridSceneTransform },
        ...gridSceneFrontChildren,
      ),
    );
  }

  const leftPanel = React.createElement(
    "div",
    { className: "canvas-left-panel ruler-lesson-left" },
    React.createElement(
      "div",
      { ref: sceneWrapRef, className: "ruler-unified-svg-wrap" },
      React.createElement(
        "svg",
        {
          ref: unifiedSvgRef,
          viewBox: `0 0 ${SVG_W} ${SVG_TOTAL_H}`,
          preserveAspectRatio: "xMidYMid meet",
          className: "triangle-svg ruler-line-svg ruler-unified-svg",
          xmlns: "http://www.w3.org/2000/svg",
          style:
            step === 10
              ? {
                  opacity: step10EntryPhase === "blank" ? 0 : 1,
                  transition: "opacity 0.35s ease",
                }
              : undefined,
        },
        svgChildren,
      ),
    ),
  );

  let rightContent = null;

  if (step === 10) {
    rightContent = React.createElement(
      "div",
      { className: "ruler-action-stack" },
      React.createElement("p", {
        className: "ruler-action-intro",
        dangerouslySetInnerHTML: { __html: s10.actionIntro },
      }),
      React.createElement(
        "button",
        {
          type: "button",
          className: `action-step-btn ${btn1Class}`,
          onClick: handleButton1,
          disabled: alignPhase !== "idle" || step10EntryPhase !== "done",
        },
        s10.button1,
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: `action-step-btn ${btn2Class}`,
          onClick: handleButton2,
          disabled: alignPhase !== "done" || phase2Started,
        },
        s10.button2,
      ),
    );
  } else if (step === 11) {
    rightContent = React.createElement(
      "div",
      { className: "ruler-feedback-box" },
      React.createElement("div", {
        className: "ruler-feedback-line",
        dangerouslySetInnerHTML: { __html: s11.feedbackLine },
      }),
    );
  } else if (step === 12) {
    const s12 = APP_DATA.steps[12];
    rightContent = React.createElement(
      "div",
      { className: "ruler-feedback-box" },
      React.createElement("div", {
        className: "ruler-feedback-line",
        dangerouslySetInnerHTML: {
          __html: userSegment ? s12.feedbackFinal : s12.feedbackIntro,
        },
      }),
    );
  } else if (step === 13) {
    rightContent = React.createElement(
      "div",
      { className: "ruler-action-stack" },
      React.createElement(
        "button",
        {
          type: "button",
          className: `action-step-btn ${btn1Class}`,
          onClick: handleButton1,
          disabled: alignPhase !== "idle" || !userSegment,
        },
        s13.button1,
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: `action-step-btn ${btn2Class}`,
          onClick: handleButton2,
          disabled: alignPhase !== "done" || phase2Started || !userSegment,
        },
        s13.button2,
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: `action-step-btn ${btn3Class}`,
          onClick: handleButton3,
          disabled:
            alignPhase !== "done" ||
            !measureOpen ||
            !phase2Started ||
            !s13CmConfirmed ||
            s13Phase3Started ||
            locked ||
            !userSegment,
        },
        s13.button3,
      ),
    );
  } else if (step === 14 || step === 15) {
    const st = APP_DATA.steps[step];
    const cmWhole = Math.floor(lengthMm / 10);
    const mmPart = lengthMm % 10;
    const sep = typeof decimalSymbol !== "undefined" ? decimalSymbol : ".";
    const lengthCmFormatted =
      mmPart === 0 ? String(cmWhole) : `${cmWhole}${sep}${mmPart}`;
    const tpl = st.feedbackLine || st.questionText;
    const html =
      typeof fillTemplate === "function"
        ? fillTemplate(tpl, {
            lengthMm: String(lengthMm),
            lengthCmFormatted,
            wholeCm: String(cmWhole),
            cmWhole: String(cmWhole),
            mmPart: String(mmPart),
          })
        : tpl;
    rightContent = React.createElement(
      "div",
      { className: "ruler-feedback-box" },
      React.createElement("div", {
        className: "ruler-feedback-line",
        dangerouslySetInnerHTML: { __html: html },
      }),
    );
  }

  const rightPanel = React.createElement(
    "div",
    { className: "canvas-right-panel ruler-action-panel" },
    rightContent,
  );

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    leftPanel,
    rightPanel,
  );
};
