const MainCanvas = ({
  step,
  step1QuestionIndex = 0,
  step3QuestionIndex = 0,
  step5QuestionIndex = 0,
  onSetNextEnabled,
  onUpdateTexts,
  onAnimatingChange,
}) => {
  const { useState, useEffect, useRef, useMemo, useCallback } = React;

  const SVG_W = 620;
  const SVG_GRID_H = 280;
  const GRID_FRAC = 0.66;
  const SVG_TOTAL_H = SVG_GRID_H / GRID_FRAC;
  const RULER = { w: 309, h: 54, zeroX: 8.95, cm: 19 };
  const SNAP_D = 20;
  const SNAP_DEG = 2.4;
  const HANDLE_FRAC = 0.3;
  const ROT_HANDLE_RADIUS = 24;
  const CM_MARKER_MAX = 15;
  const MEASURE_LINE_COLOR = "#FFD44D";
  const ROT_HANDLE_IMG = "assets/rot-handle.png";
  const DRAG_NUDGE_SRC = "assets/drag.gif";
  const DRAG_NUDGE_SIZE = 78;
  const DRAG_NUDGE_X = -DRAG_NUDGE_SIZE / 2;
  const DRAG_NUDGE_Y = -34;

  const mCfg = APP_DATA.measure;
  const s1 = APP_DATA.steps[1];
  const s3 = APP_DATA.steps[3];
  const s5 = APP_DATA.steps[5];
  const s7 = APP_DATA.steps[7];
  const s8 = APP_DATA.steps[8];
  const s9 = APP_DATA.steps[9];
  const s10 = APP_DATA.steps[10];
  const step1Questions = s1?.questions || [];
  const step1Question =
    step1Questions[
      Math.min(step1Questions.length - 1, Math.max(0, step1QuestionIndex))
    ] || null;
  const step3Questions = s3?.questions || [];
  const step5Questions = s5?.questions || [];
  const step3Question =
    step3Questions[
      Math.min(step3Questions.length - 1, Math.max(0, step3QuestionIndex))
    ] || null;
  const step5Question =
    step5Questions[
      Math.min(step5Questions.length - 1, Math.max(0, step5QuestionIndex))
    ] || null;

  const segP = mCfg.segmentPQ;
  const segA = mCfg.segmentAB;
  if (!segP || !segA) {
    console.error("data.measure.segmentPQ / segmentAB are required");
  }

  const FPQ = useMemo(
    () => [segP.p[0], segP.p[1], segP.q[0], segP.q[1]],
    [segP],
  );
  const FAB = useMemo(
    () => [segA.a[0], segA.a[1], segA.b[0], segA.b[1]],
    [segA],
  );

  const isStep3 = step === 3;
  const isStep5 = step === 5;
  const isStep7 = step === 7;
  const isStep8 = step === 8;
  const isStep9 = step === 9;
  const isStep10 = step === 10;
  const isShapeMeasureStep = isStep7 || isStep9;
  const isShapeSummaryStep = isStep8 || isStep10;
  const [step7SelectedSideKey, setStep7SelectedSideKey] = useState(null);
  const [step7HoverSideKey, setStep7HoverSideKey] = useState(null);
  const [step7Measured, setStep7Measured] = useState({});

  const activeShapeMeasureCfg =
    isStep7 || isStep8 ? s7 : isStep9 || isStep10 ? s9 : null;
  const activeShapeSummaryCfg = isStep8 ? s8 : isStep10 ? s10 : null;
  const activeShapeDef =
    activeShapeMeasureCfg?.shape ||
    activeShapeMeasureCfg?.triangle ||
    activeShapeMeasureCfg?.square ||
    null;
  const step7Points = activeShapeDef?.points || {};
  const step7Sides = activeShapeDef?.sides || {};
  const step7SummaryOrder = activeShapeDef?.summaryOrder || [];
  const activeStep7Side =
    isShapeMeasureStep &&
    step7SelectedSideKey &&
    step7Sides[step7SelectedSideKey]
      ? step7Sides[step7SelectedSideKey]
      : null;
  const activeStep7Start = useMemo(() => {
    if (!activeStep7Side?.startLabel) return null;
    const p = step7Points[activeStep7Side.startLabel];
    return Array.isArray(p) && p.length === 2 ? p : null;
  }, [activeStep7Side, step7Points]);
  const activeStep7End = useMemo(() => {
    if (!activeStep7Side?.endLabel) return null;
    const p = step7Points[activeStep7Side.endLabel];
    return Array.isArray(p) && p.length === 2 ? p : null;
  }, [activeStep7Side, step7Points]);
  const isStep7Measure = isShapeMeasureStep && !!activeStep7Side;
  const isRulerStep = isStep3 || isStep5 || isStep7Measure;
  const isStep7HorizontalSide =
    isStep7Measure &&
    !!activeStep7Start &&
    !!activeStep7End &&
    Math.abs(activeStep7Start[1] - activeStep7End[1]) < 0.5;

  const targetLengthMm = isStep3
    ? Number(step3Question?.lengthMm ?? mCfg.pqLengthMm)
    : isStep5
      ? Number(step5Question?.lengthMm ?? mCfg.abLengthMm)
      : Number(activeStep7Side?.lengthMm ?? mCfg.abLengthMm);
  const SLIDER_MAX = mCfg.sliderMax;
  const SLIDER_MAX_CM = mCfg.sliderMaxCm || 30;

  const pqDistPxBase = useMemo(
    () => Math.hypot(FPQ[2] - FPQ[0], FPQ[3] - FPQ[1]),
    [FPQ],
  );
  /** Keep step-3 ruler scale as reference for all ruler steps. */
  const fixedPxPerMm = useMemo(() => {
    const refMm = Math.max(1, Number(mCfg.pqLengthMm) || 1);
    return pqDistPxBase / refMm;
  }, [pqDistPxBase, mCfg.pqLengthMm]);

  const P = useMemo(
    () =>
      isStep3
        ? step3Question?.points?.start || [FPQ[0], FPQ[1]]
        : isStep5
          ? step5Question?.points?.start || [FAB[0], FAB[1]]
          : activeStep7Start || [FAB[0], FAB[1]],
    [
      isStep3,
      isStep5,
      FPQ,
      FAB,
      step3Question,
      step5Question,
      activeStep7Start,
    ],
  );
  const dirSource = useMemo(
    () =>
      isStep3
        ? (() => {
            const st = step3Question?.points?.start || [FPQ[0], FPQ[1]];
            const en = step3Question?.points?.end || [FPQ[2], FPQ[3]];
            return [en[0] - st[0], en[1] - st[1]];
          })()
        : isStep5
          ? (() => {
              const st = step5Question?.points?.start || [FAB[0], FAB[1]];
              const en = step5Question?.points?.end || [FAB[2], FAB[3]];
              return [en[0] - st[0], en[1] - st[1]];
            })()
          : (() => {
              const st = activeStep7Start || [FAB[0], FAB[1]];
              const en = activeStep7End || [FAB[2], FAB[3]];
              return [en[0] - st[0], en[1] - st[1]];
            })(),
    [
      isStep3,
      isStep5,
      FPQ,
      FAB,
      step3Question,
      step5Question,
      activeStep7Start,
      activeStep7End,
    ],
  );
  const dirLen = Math.hypot(dirSource[0], dirSource[1]);
  const u =
    dirLen > 1e-6 ? [dirSource[0] / dirLen, dirSource[1] / dirLen] : [1, 0];
  const step7End = activeStep7End;
  const distPx = isStep7Measure
    ? Math.hypot((step7End?.[0] || P[0]) - P[0], (step7End?.[1] || P[1]) - P[1])
    : targetLengthMm * fixedPxPerMm;
  const Q = useMemo(
    () =>
      isStep7Measure && step7End
        ? [step7End[0], step7End[1]]
        : [P[0] + u[0] * distPx, P[1] + u[1] * distPx],
    [P, u, distPx, isStep7Measure, step7End],
  );
  const angleDeg = (Math.atan2(u[1], u[0]) * 180) / Math.PI;

  /** Target length in mm (with segment endpoints, change `pqLengthMm` / `abLengthMm` in data to match the exercise). */
  const refLengthMm = targetLengthMm;
  const lengthCmValue = refLengthMm / 10;
  const targetWholeCm = Math.floor(refLengthMm / 10);
  const targetMmPart = refLengthMm % 10;

  const perpUp = useMemo(() => {
    return [-u[1], u[0]];
  }, [u]);

  const rs = useMemo(() => (fixedPxPerMm * 10) / RULER.cm, [fixedPxPerMm]);
  const rW = RULER.w * rs;
  const rH = RULER.h * rs;
  const roX = -RULER.zeroX * rs;

  const gridStep = useMemo(() => Math.max(1, RULER.cm * rs), [RULER.cm, rs]);
  /** Snap viewBox height to whole grid rows so the bottom cell is not squished. */
  const svgViewH = useMemo(
    () => Math.ceil(SVG_TOTAL_H / gridStep) * gridStep,
    [SVG_TOTAL_H, gridStep],
  );

  const [rX, setRX] = useState(0);
  const [rY, setRY] = useState(0);
  const [rRot, setRRot] = useState(0);
  const [posLocked, setPosLocked] = useState(false);
  const [rotLocked, setRotLocked] = useState(false);
  const [dragMode, setDragMode] = useState(null);
  const [sliderVal, setSliderVal] = useState(0);
  const [msLocked, setMsLocked] = useState(false);
  const [sliderCm, setSliderCm] = useState(0);
  const [sliderMm, setSliderMm] = useState(0);
  const [cmPartDone, setCmPartDone] = useState(false);
  const [s5mmDone, setS5mmDone] = useState(false);
  const [cmError, setCmError] = useState(false);
  const [mmError, setMmError] = useState(false);
  const [step1Input, setStep1Input] = useState("");
  const [step1Wrong, setStep1Wrong] = useState(false);
  const [step1WrongFeedback, setStep1WrongFeedback] = useState(false);
  const [step1Correct, setStep1Correct] = useState(false);
  const [step1VisualState, setStep1VisualState] = useState("none");
  const [step1RevealCount, setStep1RevealCount] = useState(0);
  const [rotateHintDismissed, setRotateHintDismissed] = useState(false);
  const [dragNudgeSeen, setDragNudgeSeen] = useState({
    pq: false,
    cm: false,
    mm: false,
  });

  const rulerGRef = useRef(null);
  const rulerImgRef = useRef(null);
  const unifiedSvgRef = useRef(null);
  const markerDragRef = useRef(null);
  const lastPointerIdRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const rotateOffsetRef = useRef(0);
  const step1ClearTimerRef = useRef(null);
  const step1TickTimerRef = useRef(null);
  const prevStepRef = useRef(step);
  const sliderCmMax = Math.max(SLIDER_MAX_CM, Math.ceil(refLengthMm / 10));
  const segmentStartLabel = isStep3
    ? step3Question?.startLabel || "P"
    : isStep5
      ? step5Question?.startLabel || "A"
      : activeStep7Side?.startLabel || "A";
  const segmentEndLabel = isStep3
    ? step3Question?.endLabel || "Q"
    : isStep5
      ? step5Question?.endLabel || "B"
      : activeStep7Side?.endLabel || "B";

  const initialRulerTransform = useMemo(() => {
    const cx = SVG_W / 2 - (RULER.w * rs) / 2 + RULER.zeroX * rs;
    const cy = svgViewH - rH - 14;
    return { x: cx, y: cy, rot: 0 };
  }, [rs, rH, SVG_W, svgViewH]);

  const angNorm = (a) => {
    let x = a % 360;
    if (x < 0) x += 360;
    return x;
  };
  const angShortestDiff = (a, b) => {
    let d = angNorm(a) - angNorm(b);
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return d;
  };

  const setRulerTransform = useCallback((x, y, rot) => {
    const rg = rulerGRef.current;
    if (!rg) return;
    rg.setAttribute("transform", `translate(${x}, ${y}) rotate(${rot})`);
  }, []);

  const applyRulerGeometry = useCallback(() => {
    const ri = rulerImgRef.current;
    if (!ri) return;
    ri.setAttribute("x", String(roX));
    ri.setAttribute("y", "0");
    ri.setAttribute("width", String(rW));
    ri.setAttribute("height", String(rH));
  }, [roX, rW, rH]);

  useEffect(() => {
    if (!isRulerStep) return;
    applyRulerGeometry();
  }, [isRulerStep, applyRulerGeometry]);

  useEffect(() => {
    if (typeof onAnimatingChange === "function") onAnimatingChange(false);
  }, [step, onAnimatingChange]);

  useEffect(() => {
    if (step === 1) return;
    if (step !== 3 && step !== 5) return;
    if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
  }, [step, onSetNextEnabled]);

  useEffect(() => {
    if (step !== 1) return;
    if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
  }, [step, onSetNextEnabled]);

  useEffect(() => {
    if (step !== 1 || !step1Question) return;
    if (step1ClearTimerRef.current) {
      clearTimeout(step1ClearTimerRef.current);
      step1ClearTimerRef.current = null;
    }
    setStep1Input("");
    setStep1Wrong(false);
    setStep1WrongFeedback(false);
    setStep1Correct(false);
    setStep1VisualState("none");
    setStep1RevealCount(0);
    if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
    if (typeof onUpdateTexts === "function") {
      onUpdateTexts(step1Question.navTextInitial, step1Question.questionText);
    }
  }, [
    step,
    step1QuestionIndex,
    step1Question,
    onSetNextEnabled,
    onUpdateTexts,
  ]);

  useEffect(() => {
    return () => {
      if (step1ClearTimerRef.current) clearTimeout(step1ClearTimerRef.current);
      if (step1TickTimerRef.current) clearTimeout(step1TickTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (step !== 1 || !step1Question) return;
    if (step1TickTimerRef.current) {
      clearTimeout(step1TickTimerRef.current);
      step1TickTimerRef.current = null;
    }
    if (step1VisualState === "none") {
      setStep1RevealCount(0);
      return;
    }
    const targetTicks = Math.max(0, Number(step1Question.answer) || 0);
    if (step1RevealCount >= targetTicks) return;
    step1TickTimerRef.current = setTimeout(() => {
      setStep1RevealCount((prev) => {
        const next = Math.min(targetTicks, prev + 1);
        if (typeof playSound === "function") playSound("tick");
        return next;
      });
      step1TickTimerRef.current = null;
    }, 140);
  }, [step, step1Question, step1VisualState, step1RevealCount]);

  useEffect(() => {
    if (!isShapeMeasureStep) return;
    const expectedSummaryStep = step === 7 ? 8 : 10;
    const cameFromSummary = prevStepRef.current === expectedSummaryStep;
    if (!cameFromSummary) {
      const resetMeasured = step7SummaryOrder.reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setStep7SelectedSideKey(null);
      setStep7HoverSideKey(null);
      setStep7Measured(resetMeasured);
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
      if (typeof onUpdateTexts === "function") {
        onUpdateTexts(
          activeShapeMeasureCfg?.navTextSelect,
          activeShapeMeasureCfg?.questionText,
        );
      }
      return;
    }
    const allDone = step7SummaryOrder.every((k) => step7Measured[k]);
    if (typeof onSetNextEnabled === "function") onSetNextEnabled(allDone);
    if (typeof onUpdateTexts === "function") {
      onUpdateTexts(
        allDone
          ? activeShapeMeasureCfg?.navTextDone
          : activeShapeMeasureCfg?.navTextSelectAnother,
        activeShapeMeasureCfg?.questionText,
      );
    }
  }, [
    isShapeMeasureStep,
    step,
    step7SummaryOrder,
    activeShapeMeasureCfg,
    onSetNextEnabled,
    onUpdateTexts,
  ]);

  useEffect(() => {
    if (!isShapeSummaryStep) return;
    if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
    if (typeof onUpdateTexts === "function") {
      onUpdateTexts(
        activeShapeSummaryCfg?.navText,
        activeShapeSummaryCfg?.questionText,
      );
    }
  }, [
    isShapeSummaryStep,
    activeShapeSummaryCfg,
    onSetNextEnabled,
    onUpdateTexts,
  ]);

  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (!isRulerStep) return;
    if (isStep3) {
      setRX(initialRulerTransform.x);
      setRY(initialRulerTransform.y);
      setRRot(0);
      setPosLocked(false);
      setRotLocked(false);
      setDragMode(null);
      setRotateHintDismissed(false);
      setSliderVal(0);
      setMsLocked(false);
      setDragNudgeSeen({ pq: false, cm: false, mm: false });
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
      if (typeof onUpdateTexts === "function") {
        onUpdateTexts(
          step3Question?.navTextDrag || s3.navTextDrag,
          step3Question?.questionText,
        );
      }
    } else {
      setRX(initialRulerTransform.x);
      setRY(initialRulerTransform.y);
      setRRot(0);
      setPosLocked(false);
      setRotLocked(false);
      setDragMode(null);
      setRotateHintDismissed(false);
      setSliderCm(0);
      setSliderMm(0);
      setSliderVal(0);
      setCmPartDone(false);
      setS5mmDone(false);
      setMsLocked(false);
      setCmError(false);
      setMmError(false);
      setDragNudgeSeen({ pq: false, cm: false, mm: false });
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
      if (typeof onUpdateTexts === "function") {
        if (isStep5) {
          onUpdateTexts(
            step5Question?.navTextDrag || s5.navTextDrag,
            step5Question?.questionText,
          );
        } else {
          const dragText =
            typeof fillTemplate === "function"
              ? fillTemplate(activeShapeMeasureCfg?.navTextDrag, {
                  startLabel: activeStep7Side?.startLabel || "",
                })
              : activeShapeMeasureCfg?.navTextDrag;
          onUpdateTexts(dragText, activeShapeMeasureCfg?.questionText);
        }
      }
    }
  }, [
    isRulerStep,
    isStep3,
    isStep5,
    initialRulerTransform,
    onSetNextEnabled,
    onUpdateTexts,
    s3,
    s5,
    activeShapeMeasureCfg,
    step3QuestionIndex,
    step5QuestionIndex,
    step3Question,
    step5Question,
    activeStep7Side,
  ]);

  useEffect(() => {
    if (!isRulerStep) return;
    applyRulerGeometry();
    if (rotLocked) {
      setRulerTransform(P[0], P[1], angleDeg);
    } else if (posLocked) {
      setRulerTransform(P[0], P[1], rRot);
    } else {
      setRulerTransform(rX, rY, rRot);
    }
  }, [
    isRulerStep,
    applyRulerGeometry,
    setRulerTransform,
    rotLocked,
    posLocked,
    P,
    angleDeg,
    rX,
    rY,
    rRot,
  ]);

  const canDragRuler = isRulerStep && !posLocked;
  const canDragRotate = isRulerStep && posLocked && !rotLocked;
  const showRotateHint = canDragRotate && !rotateHintDismissed;
  const measureOpen = isRulerStep && rotLocked;
  const showAlignHint = isRulerStep && !posLocked;
  const pqMarkerDraggable = isStep3 && measureOpen && !msLocked;
  const cmMarkerDraggable =
    (isStep5 || isStep7Measure) && measureOpen && !cmPartDone;
  const mmMarkerDraggable =
    (isStep5 || isStep7Measure) && measureOpen && cmPartDone && !s5mmDone;

  const posAtCm = useCallback(
    (cm) => {
      const t = (cm / lengthCmValue) * distPx;
      return [P[0] + u[0] * t, P[1] + u[1] * t];
    },
    [P, u, distPx, lengthCmValue],
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
      const relX = loc.x - P[0];
      const relY = loc.y - P[1];
      const along = relX * u[0] + relY * u[1];
      const t = clampToSegmentEnd
        ? Math.max(0, Math.min(distPx, along))
        : Math.max(0, along);
      return (t / distPx) * lengthCmValue;
    },
    [P, u, distPx, lengthCmValue],
  );

  const getSvgPoint = (evt) => {
    const svg = evt.currentTarget?.ownerSVGElement || evt.currentTarget;
    if (!svg || !svg.createSVGPoint) return null;
    const pt = svg.createSVGPoint();
    const c =
      (evt.touches && evt.touches[0]) ||
      (evt.changedTouches && evt.changedTouches[0]) ||
      evt;
    pt.x = c.clientX;
    pt.y = c.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  const clientToSvg = useCallback((clientX, clientY) => {
    const svg = rulerGRef.current?.ownerSVGElement;
    if (!svg || !svg.createSVGPoint) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  }, []);

  const onRulerPointerDown = (e) => {
    if (!canDragRuler) return;
    e.stopPropagation();
    if (e?.cancelable) e.preventDefault();
    const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
    if (!p) return;
    dragOffsetRef.current = {
      x: rX - p.x,
      y: rY - p.y,
    };
    if (e.pointerId !== undefined) {
      if (typeof e.currentTarget?.setPointerCapture === "function") {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
      lastPointerIdRef.current = e.pointerId;
    }
    setDragMode("move");
  };

  const onRotateHandleDown = (e) => {
    if (!canDragRotate) return;
    setRotateHintDismissed(true);
    e.stopPropagation();
    if (e?.cancelable) e.preventDefault();
    const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
    if (!p) return;
    const pointerDeg = (Math.atan2(p.y - P[1], p.x - P[0]) * 180) / Math.PI;
    rotateOffsetRef.current = pointerDeg - rRot;
    if (e.pointerId !== undefined) {
      if (typeof e.currentTarget?.setPointerCapture === "function") {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
      lastPointerIdRef.current = e.pointerId;
    }
    setDragMode("rot");
  };

  const onRulerPointerMove = (e) => {
    if (dragMode !== "move" || !canDragRuler) return;
    if (
      e.pointerId !== undefined &&
      lastPointerIdRef.current !== null &&
      e.pointerId !== lastPointerIdRef.current
    )
      return;
    const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
    if (!p) return;
    const nx = p.x + dragOffsetRef.current.x;
    const ny = p.y + dragOffsetRef.current.y;
    setRX(nx);
    setRY(ny);
  };

  const onRulerPointerUp = (e) => {
    if (dragMode !== "move" || !canDragRuler) {
      if (e.pointerId !== undefined)
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      setDragMode(null);
      lastPointerIdRef.current = null;
      return;
    }
    setDragMode(null);
    if (e.pointerId !== undefined)
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
    if (!p) return;
    const nx = p.x + dragOffsetRef.current.x;
    const ny = p.y + dragOffsetRef.current.y;
    const d = Math.hypot(nx - P[0], ny - P[1]);
    if (d < SNAP_D) {
      setRX(P[0]);
      setRY(P[1]);
      setPosLocked(true);
      if (isStep7HorizontalSide) {
        setRRot(angleDeg);
        setRotLocked(true);
      } else {
        setRRot(0);
      }
      if (typeof playSound === "function") playSound("correct");
      if (typeof onUpdateTexts === "function") {
        if (isStep3) {
          onUpdateTexts(step3Question?.navTextRotate || s3.navTextRotate);
        } else if (isStep5) {
          onUpdateTexts(step5Question?.navTextRotate || s5.navTextRotate);
        } else {
          if (isStep7HorizontalSide) {
            const nav =
              typeof fillTemplate === "function"
                ? fillTemplate(activeShapeMeasureCfg?.navTextSliderCm, {
                    startLabel: activeStep7Side?.startLabel || "",
                    endLabel: activeStep7Side?.endLabel || "",
                  })
                : activeShapeMeasureCfg?.navTextSliderCm;
            onUpdateTexts(nav);
          } else {
            const rotateText =
              typeof fillTemplate === "function"
                ? fillTemplate(activeShapeMeasureCfg?.navTextRotate, {
                    sideLabel: activeStep7Side?.sideLabel || "",
                  })
                : activeShapeMeasureCfg?.navTextRotate;
            onUpdateTexts(rotateText);
          }
        }
      }
    } else {
      setRX(nx);
      setRY(ny);
    }
    lastPointerIdRef.current = null;
  };

  const onHandlePointerMove = (e) => {
    if (dragMode !== "rot" || !posLocked) return;
    if (
      e.pointerId !== undefined &&
      lastPointerIdRef.current !== null &&
      e.pointerId !== lastPointerIdRef.current
    )
      return;
    const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
    if (!p) return;
    const pointerDeg = (Math.atan2(p.y - P[1], p.x - P[0]) * 180) / Math.PI;
    const deg = pointerDeg - rotateOffsetRef.current;
    setRRot(deg);
  };

  const onHandlePointerUp = (e) => {
    if (dragMode !== "rot" || !posLocked) {
      if (e.pointerId !== undefined)
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      setDragMode(null);
      lastPointerIdRef.current = null;
      return;
    }
    if (e.pointerId !== undefined)
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    setDragMode(null);
    const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
    if (!p) return;
    const pointerDeg = (Math.atan2(p.y - P[1], p.x - P[0]) * 180) / Math.PI;
    const tryDeg = pointerDeg - rotateOffsetRef.current;
    if (Math.abs(angShortestDiff(tryDeg, angleDeg)) < SNAP_DEG) {
      setRRot(angleDeg);
      setRotLocked(true);
      if (typeof playSound === "function") playSound("correct");
      if (isStep3) {
        setDragNudgeSeen((prev) => ({ ...prev, pq: false }));
        if (typeof onUpdateTexts === "function")
          onUpdateTexts(step3Question?.navTextSlider || s3.navTextSlider);
      } else if (isStep5) {
        setDragNudgeSeen((prev) => ({ ...prev, cm: false }));
        if (typeof onUpdateTexts === "function")
          onUpdateTexts(step5Question?.navTextSliderCm || s5.navTextSliderCm);
      } else {
        setDragNudgeSeen((prev) => ({ ...prev, cm: false }));
        if (typeof onUpdateTexts === "function") {
          const nav =
            typeof fillTemplate === "function"
              ? fillTemplate(activeShapeMeasureCfg?.navTextSliderCm, {
                  startLabel: activeStep7Side?.startLabel || "",
                  endLabel: activeStep7Side?.endLabel || "",
                })
              : activeShapeMeasureCfg?.navTextSliderCm;
          onUpdateTexts(nav);
        }
      }
    } else {
      setRRot(tryDeg);
    }
    lastPointerIdRef.current = null;
  };

  const applyStep3PqDrag = useCallback(
    (cmRaw, playTick) => {
      if (msLocked || !isStep3) return;
      const v = Math.max(0, Math.min(CM_MARKER_MAX, Math.round(cmRaw)));
      const needCm = Math.floor(refLengthMm / 10);
      if (v >= needCm) {
        setSliderVal(needCm);
        setMsLocked(true);
        if (typeof playSound === "function") playSound("correct");
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
        if (typeof onUpdateTexts === "function")
          onUpdateTexts(step3Question?.navTextDone || s3.navTextAnother);
      } else {
        setSliderVal((prev) => {
          if (playTick && v !== prev && typeof playSound === "function")
            playSound("tick");
          return v;
        });
      }
    },
    [
      msLocked,
      isStep3,
      refLengthMm,
      SLIDER_MAX,
      onSetNextEnabled,
      onUpdateTexts,
      step3Question,
      s3.navTextAnother,
    ],
  );

  const applyS5CmDrag = useCallback(
    (cmRaw, playTick) => {
      if ((!isStep5 && !isStep7Measure) || !measureOpen || cmPartDone) return;
      const v = Math.max(0, Math.min(CM_MARKER_MAX, Math.round(cmRaw)));
      setCmError(false);
      setSliderCm((prev) => {
        if (playTick && v !== prev && typeof playSound === "function")
          playSound("tick");
        return v;
      });
    },
    [isStep5, isStep7Measure, measureOpen, cmPartDone],
  );

  const applyS5MmDrag = useCallback(
    (cmAlongRaw, playTick) => {
      if ((!isStep5 && !isStep7Measure) || !cmPartDone || s5mmDone) return;
      const frac = cmAlongRaw - targetWholeCm;
      const v = Math.max(0, Math.min(9, Math.round(frac * 10)));
      setMmError(false);
      setSliderMm((prev) => {
        if (playTick && v !== prev && typeof playSound === "function")
          playSound("tick");
        return v;
      });
    },
    [isStep5, isStep7Measure, cmPartDone, s5mmDone, targetWholeCm],
  );

  const formatLengthCmMm = useCallback(
    (lengthMm) => {
      const cm = Math.floor(lengthMm / 10);
      const mm = lengthMm % 10;
      return `${cm} ${activeShapeMeasureCfg?.cmLabel || "cm"} ${activeShapeMeasureCfg?.cmAnd || "and"} ${mm} ${activeShapeMeasureCfg?.mmLabel || "mm"}`;
    },
    [activeShapeMeasureCfg],
  );

  const finalizeStep7Measurement = useCallback(() => {
    if (!activeStep7Side || !step7SelectedSideKey) return;
    setStep7Measured((prev) => {
      const next = { ...prev, [step7SelectedSideKey]: true };
      const allDone = step7SummaryOrder.every((k) => next[k]);
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(allDone);
      if (typeof onUpdateTexts === "function") {
        onUpdateTexts(
          allDone
            ? activeShapeMeasureCfg?.navTextDone
            : activeShapeMeasureCfg?.navTextSelectAnother,
          activeShapeMeasureCfg?.questionText,
        );
      }
      return next;
    });
    setStep7SelectedSideKey(null);
  }, [
    activeStep7Side,
    step7SelectedSideKey,
    step7SummaryOrder,
    onSetNextEnabled,
    onUpdateTexts,
    activeShapeMeasureCfg,
  ]);

  const tryS5Cm = useCallback(
    (rawCm) => {
      if (cmPartDone) return;
      const v = Number.isNaN(rawCm) ? sliderCm : rawCm;
      if (v !== targetWholeCm) {
        if (typeof playSound === "function") playSound("wrong");
        setCmError(true);
        return;
      }
      if (typeof playSound === "function") playSound("correct");
      setCmError(false);
      setSliderCm(v);
      setCmPartDone(true);
      if (targetMmPart === 0) {
        setS5mmDone(true);
        if (isStep7Measure) {
          finalizeStep7Measurement();
        } else {
          if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
          if (typeof onUpdateTexts === "function")
            onUpdateTexts(step5Question?.navTextDone || s5.navTextDone);
        }
      } else {
        setDragNudgeSeen((prev) => ({ ...prev, mm: false }));
        if (typeof onUpdateTexts === "function") {
          const nav =
            typeof fillTemplate === "function"
              ? fillTemplate(
                  isStep7Measure
                    ? activeShapeMeasureCfg?.navTextSliderMm
                    : step5Question?.navTextSliderMm || s5.navTextSliderMm,
                  {
                    wholeCm: String(targetWholeCm),
                    wholeCmPlus1: String(targetWholeCm + 1),
                  },
                )
              : isStep7Measure
                ? activeShapeMeasureCfg?.navTextSliderMm
                : step5Question?.navTextSliderMm || s5.navTextSliderMm;
          onUpdateTexts(nav);
        }
      }
    },
    [
      cmPartDone,
      sliderCm,
      targetWholeCm,
      targetMmPart,
      s5,
      s7,
      onSetNextEnabled,
      onUpdateTexts,
      isStep7Measure,
      finalizeStep7Measurement,
      step5Question,
    ],
  );

  const tryS5Mm = useCallback(
    (rawMm) => {
      if (!cmPartDone || s5mmDone) return;
      const v = Number.isNaN(rawMm) ? sliderMm : rawMm;
      if (targetWholeCm * 10 + v !== refLengthMm) {
        if (typeof playSound === "function") playSound("wrong");
        setMmError(true);
        return;
      }
      if (typeof playSound === "function") playSound("correct");
      setMmError(false);
      setSliderMm(v);
      setS5mmDone(true);
      if (isStep7Measure) {
        finalizeStep7Measurement();
      } else {
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
        if (typeof onUpdateTexts === "function")
          onUpdateTexts(step5Question?.navTextDone || s5.navTextDone);
      }
    },
    [
      cmPartDone,
      s5mmDone,
      sliderMm,
      targetWholeCm,
      refLengthMm,
      s5,
      onSetNextEnabled,
      onUpdateTexts,
      isStep7Measure,
      finalizeStep7Measurement,
      step5Question,
    ],
  );

  const dismissDragNudge = (kind) => {
    setDragNudgeSeen((prev) => (prev[kind] ? prev : { ...prev, [kind]: true }));
  };

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

  const showPqDragNudge = pqMarkerDraggable && !dragNudgeSeen.pq;
  const showCmDragNudge = cmMarkerDraggable && !dragNudgeSeen.cm;
  const showMmDragNudge = mmMarkerDraggable && !dragNudgeSeen.mm;

  const handleMarkerPointerDown = (e, kind) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    if (kind === "pq" || kind === "cm" || kind === "mm") dismissDragNudge(kind);
    if (typeof e.currentTarget?.setPointerCapture === "function") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    markerDragRef.current = { kind, pointerId: e.pointerId, moved: false };
    if (kind === "pq") {
      applyStep3PqDrag(pointerCmOnSegment(e.clientX, e.clientY, true), false);
    } else if (kind === "cm") {
      applyS5CmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), false);
    } else if (kind === "mm") {
      applyS5MmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), false);
    }
  };

  const handleMarkerPointerMove = (e) => {
    const drag = markerDragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (
      (drag.kind === "pq" || drag.kind === "cm" || drag.kind === "mm") &&
      !drag.moved
    ) {
      dismissDragNudge(drag.kind);
      drag.moved = true;
    }
    if (drag.kind === "pq") {
      applyStep3PqDrag(pointerCmOnSegment(e.clientX, e.clientY, true), true);
    } else if (drag.kind === "cm") {
      applyS5CmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), true);
    } else if (drag.kind === "mm") {
      applyS5MmDrag(pointerCmOnSegment(e.clientX, e.clientY, false), true);
    }
  };

  const handleMarkerPointerUp = (e) => {
    const drag = markerDragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.kind === "cm") {
      const cmV = Math.max(
        0,
        Math.min(
          CM_MARKER_MAX,
          Math.round(pointerCmOnSegment(e.clientX, e.clientY, false)),
        ),
      );
      tryS5Cm(cmV);
    } else if (drag.kind === "mm") {
      const cmAlong = pointerCmOnSegment(e.clientX, e.clientY, false);
      const mmV = Math.max(
        0,
        Math.min(9, Math.round((cmAlong - targetWholeCm) * 10)),
      );
      tryS5Mm(mmV);
    }
    if (typeof e.currentTarget?.releasePointerCapture === "function") {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    markerDragRef.current = null;
  };

  const markerDragProps = (draggable, kind) =>
    draggable
      ? {
          className: "measure-marker measure-marker--draggable",
          style: { cursor: "grab", touchAction: "none" },
          onPointerDown: (ev) => handleMarkerPointerDown(ev, kind),
          onPointerMove: handleMarkerPointerMove,
          onPointerUp: handleMarkerPointerUp,
          onPointerCancel: handleMarkerPointerUp,
        }
      : { className: "measure-marker", style: { pointerEvents: "none" } };

  const clearStep1WrongState = useCallback(() => {
    setStep1Wrong(false);
    setStep1WrongFeedback(false);
  }, []);

  const handleStep1Number = useCallback(
    (num) => {
      if (step !== 1 || step1Correct) return;
      clearStep1WrongState();
      setStep1Input((prev) => {
        if ((prev || "").length >= 2) return prev;
        return `${prev || ""}${num}`;
      });
    },
    [step, step1Correct, clearStep1WrongState],
  );

  const handleStep1Clear = useCallback(() => {
    if (step !== 1 || step1Correct) return;
    clearStep1WrongState();
    setStep1Input((prev) => (prev || "").slice(0, -1));
  }, [step, step1Correct, clearStep1WrongState]);

  const handleStep1Submit = useCallback(() => {
    if (step !== 1 || step1Correct || !step1Question) return;
    const parsed = parseInt(step1Input, 10);
    if (!Number.isFinite(parsed) || parsed !== Number(step1Question.answer)) {
      if (typeof playSound === "function") playSound("wrong");
      setStep1Wrong(true);
      setStep1WrongFeedback(true);
      setStep1VisualState("wrong");
      setStep1RevealCount(0);
      if (step1ClearTimerRef.current) clearTimeout(step1ClearTimerRef.current);
      step1ClearTimerRef.current = setTimeout(() => {
        setStep1Input("");
        setStep1Wrong(false);
        step1ClearTimerRef.current = null;
      }, 500);
      return;
    }

    if (typeof playSound === "function") playSound("correct");
    clearStep1WrongState();
    setStep1Correct(true);
    setStep1VisualState("correct");
    setStep1RevealCount(0);
    setStep1Input(String(step1Question.answer));
    if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
    if (typeof onUpdateTexts === "function") {
      onUpdateTexts(step1Question.navTextCorrect, step1Question.questionText);
    }
  }, [
    step,
    step1Correct,
    step1Question,
    step1Input,
    onSetNextEnabled,
    onUpdateTexts,
    clearStep1WrongState,
  ]);

  const gridLines = useMemo(() => {
    const lines = [];
    const eps = 0.5;
    for (let i = 0; ; i += 1) {
      const x = i * gridStep;
      if (x > SVG_W + eps) break;
      lines.push(
        React.createElement("line", {
          key: `gv-${x}`,
          x1: x,
          y1: 0,
          x2: x,
          y2: svgViewH,
          stroke: "rgba(255,255,255,0.22)",
          strokeWidth: 1.8,
        }),
      );
    }
    for (let i = 0; ; i += 1) {
      const y = i * gridStep;
      if (y > svgViewH + eps) break;
      lines.push(
        React.createElement("line", {
          key: `gh-${y}`,
          x1: 0,
          y1: y,
          x2: SVG_W,
          y2: y,
          stroke: "rgba(255,255,255,0.22)",
          strokeWidth: 1.8,
        }),
      );
    }
    lines.push(
      React.createElement("line", {
        key: "gh-bottom-edge",
        x1: 0,
        y1: svgViewH,
        x2: SVG_W,
        y2: svgViewH,
        stroke: "rgba(255,255,255,0.22)",
        strokeWidth: 1.8,
      }),
    );
    return lines;
  }, [SVG_W, svgViewH, gridStep]);

  const dashLen = 115;
  const markerOffset = 18;
  const dashShortLen = 12;
  const cmMarkerPerp = dashLen - markerOffset;
  const mmDashLift = dashShortLen;
  const mmPerpExtra = -65;
  const mmLongEnd = dashLen + mmDashLift + mmPerpExtra;
  const mmMarkerPerp = mmLongEnd - markerOffset;
  const mmDashBelowLen = 48;

  const zPos = posAtCm(0);
  const z1 = zPos[0] + perpUp[0] * dashLen;
  const z2 = zPos[1] + perpUp[1] * dashLen;
  const z3 = zPos[0] - perpUp[0] * dashShortLen;
  const z4 = zPos[1] - perpUp[1] * dashShortLen;

  const posPq = posAtCm(isStep3 ? sliderVal : 0);
  const m1 = posPq[0] + perpUp[0] * dashLen;
  const m2 = posPq[1] + perpUp[1] * dashLen;
  const m3 = posPq[0] - perpUp[0] * dashShortLen;
  const m4 = posPq[1] - perpUp[1] * dashShortLen;
  const mkx = posPq[0] + perpUp[0] * cmMarkerPerp;
  const mky = posPq[1] + perpUp[1] * cmMarkerPerp;
  const movingOk =
    (isStep3 && msLocked) ||
    ((isStep5 || isStep7Measure) && s5mmDone) ||
    ((isStep5 || isStep7Measure) && targetMmPart === 0 && cmPartDone);
  const moveColor = movingOk ? "#4C9F7A" : "#E878A8";

  const posCmB = posAtCm(
    !(isStep5 || isStep7Measure) || cmPartDone ? targetWholeCm : sliderCm,
  );
  const cmD1 = posCmB[0] + perpUp[0] * dashLen;
  const cmD2 = posCmB[1] + perpUp[1] * dashLen;
  const cmD3 = posCmB[0] - perpUp[0] * dashShortLen;
  const cmD4 = posCmB[1] - perpUp[1] * dashShortLen;
  const mkCmX = posCmB[0] + perpUp[0] * cmMarkerPerp;
  const mkCmY = posCmB[1] + perpUp[1] * cmMarkerPerp;
  const colCmB =
    (isStep5 || isStep7Measure) && (cmError ? "#C75C5C" : "#4C9F7A");
  const effMm =
    (isStep5 || isStep7Measure) && cmPartDone && !s5mmDone
      ? sliderMm
      : targetMmPart;
  const posForMm = posAtCm(
    (targetWholeCm * 10 + (cmPartDone && !s5mmDone ? sliderMm : targetMmPart)) /
      10,
  );
  const mmD1 = posForMm[0] - perpUp[0] * mmLongEnd;
  const mmD2 = posForMm[1] - perpUp[1] * mmLongEnd;
  const mmD3 = posForMm[0];
  const mmD4 = posForMm[1];
  const mmBelow1 = posForMm[0] + perpUp[0] * mmDashBelowLen;
  const mmBelow2 = posForMm[1] + perpUp[1] * mmDashBelowLen;
  const mkMmX = posForMm[0] - perpUp[0] * mmMarkerPerp;
  const mkMmY = posForMm[1] - perpUp[1] * mmMarkerPerp;
  const colMmB =
    (isStep5 || isStep7Measure) && (mmError ? "#C75C5C" : "#5EADEB");

  const showMeasureGr =
    (isStep3 && measureOpen) || ((isStep5 || isStep7Measure) && measureOpen);
  const showPqOnly = isStep3 && measureOpen && rotLocked;

  const showS5CmGr = (isStep5 || isStep7Measure) && measureOpen && rotLocked;
  const showS5MmGr =
    (isStep5 || isStep7Measure) &&
    measureOpen &&
    rotLocked &&
    cmPartDone &&
    targetMmPart > 0;
  const handleLocalX = HANDLE_FRAC * (rW + roX);

  const svgChildren = [];
  svgChildren.push(...gridLines);

  if (isShapeMeasureStep || isShapeSummaryStep) {
    const tp = step7Points || {};
    const vertices = Object.keys(tp).length
      ? tp
      : { A: [130, 220], B: [470, 220], C: [300, 85] };
    const centroid = [
      Object.values(vertices).reduce((acc, p) => acc + p[0], 0) /
        Math.max(1, Object.keys(vertices).length),
      Object.values(vertices).reduce((acc, p) => acc + p[1], 0) /
        Math.max(1, Object.keys(vertices).length),
    ];
    const sideKeys = step7SummaryOrder;
    sideKeys.forEach((sideKey) => {
      const sideCfg = step7Sides[sideKey];
      if (!sideCfg) return;
      const p1 = vertices[sideKey[0]];
      const p2 = vertices[sideKey[1]];
      if (!p1 || !p2) return;
      const isMeasured = !!step7Measured[sideKey];
      const isActive = step7SelectedSideKey === sideKey;
      const fadeOthers =
        isShapeMeasureStep && !!step7SelectedSideKey && !isActive;
      const sideColor = isMeasured
        ? "#E8943A"
        : isActive && isStep7Measure
          ? MEASURE_LINE_COLOR
          : "#ffffff";
      const sideOpacity = fadeOthers ? 0.22 : 1;
      const clickable =
        isShapeMeasureStep &&
        !isMeasured &&
        (!step7SelectedSideKey || isActive);
      const hovered =
        clickable && !step7SelectedSideKey && step7HoverSideKey === sideKey;
      const vx = p2[0] - p1[0];
      const vy = p2[1] - p1[1];
      const vl = Math.hypot(vx, vy) || 1;
      const n1 = [-vy / vl, vx / vl];
      const midX = (p1[0] + p2[0]) / 2;
      const midY = (p1[1] + p2[1]) / 2;
      const fromCentroid = [midX - centroid[0], midY - centroid[1]];
      const dot = n1[0] * fromCentroid[0] + n1[1] * fromCentroid[1];
      const nOut = dot >= 0 ? n1 : [-n1[0], -n1[1]];
      const labelDistance = 30;
      const rawAngle = (Math.atan2(vy, vx) * 180) / Math.PI;
      const textAngle =
        rawAngle > 90
          ? rawAngle - 180
          : rawAngle < -90
            ? rawAngle + 180
            : rawAngle;
      const labelText = formatLengthCmMm(sideCfg.lengthMm || 0);
      if (hovered) {
        svgChildren.push(
          React.createElement("line", {
            key: `tri-side-glow-${sideKey}`,
            x1: p1[0],
            y1: p1[1],
            x2: p2[0],
            y2: p2[1],
            stroke: "#FFD44D",
            strokeWidth: 12,
            strokeLinecap: "butt",
            opacity: 0.48,
          }),
        );
      }
      svgChildren.push(
        React.createElement("line", {
          key: `tri-side-${sideKey}`,
          x1: p1[0],
          y1: p1[1],
          x2: p2[0],
          y2: p2[1],
          stroke: sideColor,
          strokeWidth: 6,
          strokeLinecap: "butt",
          opacity: sideOpacity,
        }),
      );
      if (clickable) {
        svgChildren.push(
          React.createElement("line", {
            key: `tri-side-hit-${sideKey}`,
            x1: p1[0],
            y1: p1[1],
            x2: p2[0],
            y2: p2[1],
            stroke: "rgba(0,0,0,0.001)",
            strokeWidth: 24,
            strokeLinecap: "round",
            style: { cursor: "pointer" },
            onClick: () => {
              setStep7HoverSideKey(null);
              setStep7SelectedSideKey(sideKey);
            },
            onMouseEnter: () => setStep7HoverSideKey(sideKey),
            onMouseLeave: () =>
              setStep7HoverSideKey((prev) => (prev === sideKey ? null : prev)),
          }),
        );
      }
      if (isMeasured) {
        svgChildren.push(
          React.createElement(
            "text",
            {
              key: `tri-side-label-${sideKey}`,
              x: midX + nOut[0] * labelDistance,
              y: midY + nOut[1] * labelDistance,
              fill: "#E8943A",
              fontSize: 16,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
              transform: `rotate(${textAngle} ${midX + nOut[0] * labelDistance} ${
                midY + nOut[1] * labelDistance
              })`,
              opacity: sideOpacity,
            },
            labelText,
          ),
        );
      }
    });
    Object.keys(vertices).forEach((label, idx) => {
      const p = vertices[label];
      if (!p) return;
      const shift =
        label === "A" || label === "P"
          ? [-18, 12]
          : label === "B" || label === "Q"
            ? [16, 12]
            : label === "C" || label === "R"
              ? [0, -16]
              : idx % 2 === 0
                ? [-12, -12]
                : [12, -12];
      svgChildren.push(
        React.createElement(
          "text",
          {
            key: `tri-vertex-${label}`,
            x: p[0] + shift[0],
            y: p[1] + shift[1],
            fill: "#fff",
            fontSize: 22,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          label,
        ),
      );
    });
  }

  if (isStep3 || isStep5) {
    svgChildren.push(
      React.createElement("line", {
        key: "seg",
        x1: P[0],
        y1: P[1],
        x2: Q[0],
        y2: Q[1],
        stroke: MEASURE_LINE_COLOR,
        strokeWidth: 5,
        strokeLinecap: "butt",
      }),
    );
    const labelOff = 22;
    const l1 = segmentStartLabel;
    const l2 = segmentEndLabel;
    svgChildren.push(
      React.createElement(
        "text",
        {
          key: "t1",
          x: P[0] - u[0] * labelOff,
          y: P[1] - u[1] * labelOff,
          fill: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          textAnchor: "middle",
          dominantBaseline: "middle",
        },
        l1,
      ),
      React.createElement(
        "text",
        {
          key: "t2",
          x: Q[0] + u[0] * labelOff,
          y: Q[1] + u[1] * labelOff,
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

  if (isRulerStep) {
    if (showAlignHint) {
      svgChildren.push(
        React.createElement("circle", {
          key: "align-hint-circle",
          cx: P[0],
          cy: P[1],
          r: 16,
          className: "align-hint-circle",
        }),
      );
    }
    svgChildren.push(
      React.createElement(
        "g",
        {
          key: "ruler-g",
          ref: rulerGRef,
          transform: `translate(${initialRulerTransform.x},${initialRulerTransform.y}) rotate(0)`,
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
        canDragRuler &&
          React.createElement("rect", {
            key: "ruler-hit",
            x: 0,
            y: 0,
            width: rW + roX,
            height: rH,
            fill: "rgba(0,0,0,0.001)",
            style: { cursor: "grab", touchAction: "none" },
            onPointerDown: onRulerPointerDown,
            onPointerMove: onRulerPointerMove,
            onPointerUp: onRulerPointerUp,
            onPointerCancel: onRulerPointerUp,
          }),
        canDragRotate &&
          React.createElement(
            "g",
            {
              key: "rot-handle",
              style: { pointerEvents: "none" },
            },
            showRotateHint &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement("circle", {
                  cx: handleLocalX,
                  cy: rH * 0.5,
                  r: ROT_HANDLE_RADIUS + 5,
                  className: "rot-handle-wave rot-handle-wave--one",
                }),
                React.createElement("circle", {
                  cx: handleLocalX,
                  cy: rH * 0.5,
                  r: ROT_HANDLE_RADIUS + 5,
                  className: "rot-handle-wave rot-handle-wave--two",
                }),
              ),
            React.createElement("image", {
              key: "rot-handle-img",
              href: ROT_HANDLE_IMG,
              x: handleLocalX - ROT_HANDLE_RADIUS,
              y: rH * 0.5 - ROT_HANDLE_RADIUS,
              width: ROT_HANDLE_RADIUS * 2,
              height: ROT_HANDLE_RADIUS * 2,
              preserveAspectRatio: "xMidYMid meet",
              style: { pointerEvents: "none" },
            }),
            React.createElement("circle", {
              cx: handleLocalX,
              cy: rH * 0.5,
              r: ROT_HANDLE_RADIUS,
              fill: "rgba(0,0,0,0.001)",
              stroke: "none",
              style: {
                cursor: "alias",
                touchAction: "none",
                pointerEvents: "all",
              },
              onPointerDown: onRotateHandleDown,
              onPointerMove: onHandlePointerMove,
              onPointerUp: onHandlePointerUp,
              onPointerCancel: onHandlePointerUp,
            }),
          ),
      ),
    );
  }

  if (showMeasureGr && rotLocked) {
    svgChildren.push(
      React.createElement("line", {
        key: "zero-dash",
        style: { pointerEvents: "none" },
        x1: z3,
        y1: z4,
        x2: z1,
        y2: z2,
        stroke: "#E8943A",
        strokeWidth: 2,
        strokeDasharray: "8 6",
      }),
    );
  }

  if (showPqOnly) {
    svgChildren.push(
      React.createElement("line", {
        key: "mov-dash",
        style: { pointerEvents: "none" },
        x1: m3,
        y1: m4,
        x2: m1,
        y2: m2,
        stroke: moveColor,
        strokeWidth: 2,
        strokeDasharray: "8 6",
      }),
      React.createElement(
        "g",
        {
          key: "mk-pq",
          transform: `translate(${mkx}, ${mky}) rotate(${angleDeg})`,
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
          fill: moveColor,
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
        isStep3 &&
          (sliderVal > 0 || msLocked) &&
          React.createElement(
            "text",
            {
              x: 30,
              y: 1,
              textAnchor: "start",
              dominantBaseline: "middle",
              fill: moveColor,
              fontSize: 20,
              fontWeight: 600,
              style: { pointerEvents: "none" },
            },
            step3Question?.lengthUnit || s3.lengthUnit,
          ),
      ),
    );
  }

  if (showS5CmGr) {
    svgChildren.push(
      React.createElement("line", {
        key: "cmB-dash",
        style: { pointerEvents: "none" },
        x1: cmD3,
        y1: cmD4,
        x2: cmD1,
        y2: cmD2,
        stroke: colCmB,
        strokeWidth: 2,
        strokeDasharray: "8 6",
      }),
    );
  }

  if (showS5MmGr) {
    svgChildren.push(
      React.createElement("line", {
        key: "mmB-dash-1",
        style: { pointerEvents: "none" },
        x1: mmD3,
        y1: mmD4,
        x2: mmD1,
        y2: mmD2,
        stroke: colMmB,
        strokeWidth: 2,
        strokeDasharray: "8 6",
      }),
      React.createElement("line", {
        key: "mmB-dash-2",
        style: { pointerEvents: "none" },
        x1: mmD3,
        y1: mmD4,
        x2: mmBelow1,
        y2: mmBelow2,
        stroke: colMmB,
        strokeWidth: 2,
        strokeDasharray: "8 6",
      }),
    );
  }

  if (showS5CmGr) {
    const cmValShow = cmPartDone ? targetWholeCm : sliderCm;
    svgChildren.push(
      React.createElement(
        "g",
        {
          key: "cm-mk",
          transform: `translate(${mkCmX}, ${mkCmY}) rotate(${angleDeg})`,
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
          fill: colCmB,
          stroke: "rgba(255,255,255,0.35)",
          strokeWidth: 2,
          style: { pointerEvents: cmMarkerDraggable ? "none" : "auto" },
        }),
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
          String(cmValShow),
        ),
        React.createElement(
          "text",
          {
            x: 32,
            y: 1,
            textAnchor: "start",
            dominantBaseline: "middle",
            fill: colCmB,
            fontSize: 20,
            fontWeight: 600,
            style: { pointerEvents: "none" },
          },
          isStep7Measure
            ? activeShapeMeasureCfg?.cmLabel
            : step5Question?.cmLabel || s5.cmLabel,
        ),
        dragNudgeImage(showCmDragNudge),
      ),
    );
  }
  if (showS5MmGr) {
    const mmValShow = !s5mmDone ? sliderMm : targetMmPart;
    svgChildren.push(
      React.createElement(
        "g",
        {
          key: "mm-mk",
          transform: `translate(${mkMmX}, ${mkMmY}) rotate(${angleDeg})`,
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
          fill: colMmB,
          stroke: "rgba(255,255,255,0.35)",
          strokeWidth: 2,
          style: { pointerEvents: mmMarkerDraggable ? "none" : "auto" },
        }),
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
          String(s5mmDone ? targetMmPart : mmValShow),
        ),
        React.createElement(
          "text",
          {
            x: 30,
            y: 1,
            textAnchor: "start",
            dominantBaseline: "middle",
            fill: colMmB,
            fontSize: 14,
            fontWeight: 600,
            style: { pointerEvents: "none" },
          },
          isStep7Measure
            ? activeShapeMeasureCfg?.mmLabel
            : step5Question?.mmLabel || s5.mmLabel,
        ),
        dragNudgeImage(showMmDragNudge),
      ),
    );
  }

  const leftPanel = React.createElement(
    "div",
    { className: "canvas-left-panel ruler-lesson-left" },
    step === 1
      ? null
      : React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "div",
            { className: "ruler-unified-svg-wrap" },
            React.createElement(
              "svg",
              {
                ref: unifiedSvgRef,
                viewBox: `0 0 ${SVG_W} ${svgViewH}`,
                className: "triangle-svg ruler-line-svg ruler-unified-svg",
                xmlns: "http://www.w3.org/2000/svg",
                preserveAspectRatio: "xMinYMin slice",
                style: { touchAction: "none" },
              },
              svgChildren,
            ),
          ),
        ),
  );

  const div1ClassPq = !rotLocked
    ? "status-step ongoing"
    : "status-step completed";
  const div2ClassPq = !rotLocked
    ? "status-step disabled"
    : msLocked
      ? "status-step completed"
      : "status-step ongoing";

  const s5a = (() => {
    if (!isStep5) return { d1: "", d2: "", d3: "" };
    if (!rotLocked) {
      return {
        d1: "status-step ongoing",
        d2: "status-step disabled",
        d3: "status-step disabled",
      };
    }
    if (rotLocked && !cmPartDone) {
      return {
        d1: "status-step completed",
        d2: "status-step ongoing",
        d3: "status-step disabled",
      };
    }
    if (cmPartDone && !s5mmDone && targetMmPart > 0) {
      return {
        d1: "status-step completed",
        d2: "status-step completed",
        d3: "status-step ongoing",
      };
    }
    if (s5mmDone) {
      return {
        d1: "status-step completed",
        d2: "status-step completed",
        d3: "status-step completed",
      };
    }
    if (targetMmPart === 0 && cmPartDone) {
      return {
        d1: "status-step completed",
        d2: "status-step completed",
        d3: "status-step completed",
      };
    }
    return { d1: "", d2: "", d3: "" };
  })();

  const s7a = (() => {
    if (!isStep7Measure)
      return {
        d1: "status-step disabled",
        d2: "status-step disabled",
        d3: "status-step disabled",
      };
    if (!rotLocked) {
      return {
        d1: "status-step ongoing",
        d2: "status-step disabled",
        d3: "status-step disabled",
      };
    }
    if (rotLocked && !cmPartDone) {
      return {
        d1: "status-step completed",
        d2: "status-step ongoing",
        d3: "status-step disabled",
      };
    }
    if (cmPartDone && !s5mmDone && targetMmPart > 0) {
      return {
        d1: "status-step completed",
        d2: "status-step completed",
        d3: "status-step ongoing",
      };
    }
    return {
      d1: "status-step completed",
      d2: "status-step completed",
      d3: "status-step completed",
    };
  })();

  const rightPanel =
    step === 1
      ? React.createElement("div", {
          className: "canvas-right-panel ruler-action-panel",
        })
      : isStep3
        ? React.createElement(
            "div",
            { className: "canvas-right-panel ruler-action-panel" },
            React.createElement(
              "div",
              { className: "ruler-action-stack ruler-action-stack--static" },
              React.createElement("p", {
                className: "ruler-action-intro",
                dangerouslySetInnerHTML: {
                  __html: step3Question?.actionIntro || s3.actionIntro,
                },
              }),
              React.createElement(
                "div",
                { className: div1ClassPq },
                step3Question?.step1 || s3.step1,
              ),
              React.createElement(
                "div",
                { className: div2ClassPq },
                step3Question?.step2 || s3.step2,
              ),
              measureOpen &&
                rotLocked &&
                React.createElement(
                  "div",
                  { className: "ruler-length-row" },
                  React.createElement("p", {
                    className: "ruler-length-text",
                    dangerouslySetInnerHTML: {
                      __html:
                        (step3Question?.lengthLabel || s3.lengthLabel) + " ",
                    },
                  }),
                  React.createElement(
                    "span",
                    {
                      className:
                        "length-value-box" +
                        (msLocked
                          ? " length-value-box--complete"
                          : " length-value-box--active"),
                    },
                    sliderVal === 0 && !msLocked ? "\u00a0" : String(sliderVal),
                  ),
                  React.createElement(
                    "span",
                    { className: "ruler-length-unit" },
                    (step3Question?.lengthUnit || s3.lengthUnit) + " ",
                  ),
                ),
            ),
          )
        : isStep5
          ? React.createElement(
              "div",
              { className: "canvas-right-panel ruler-action-panel" },
              React.createElement(
                "div",
                { className: "ruler-action-stack ruler-action-stack--static" },
                React.createElement("p", {
                  className: "ruler-action-intro ruler-action-intro--sm",
                  dangerouslySetInnerHTML: {
                    __html: step5Question?.actionIntro || s5.actionIntro,
                  },
                }),
                React.createElement(
                  "div",
                  { className: s5a.d1 },
                  step5Question?.step1 || s5.step1,
                ),
                React.createElement(
                  "div",
                  { className: s5a.d2 },
                  step5Question?.step2 || s5.step2,
                ),
                React.createElement(
                  "div",
                  { className: s5a.d3 },
                  step5Question?.step3 || s5.step3,
                ),
                measureOpen &&
                  rotLocked &&
                  React.createElement(
                    "div",
                    { className: "ruler-dual-length-block" },
                    React.createElement("p", {
                      className: "ruler-dual-length-line",
                      dangerouslySetInnerHTML: {
                        __html:
                          step5Question?.lengthLinePrefix ||
                          s5.lengthLinePrefix,
                      },
                    }),
                    React.createElement(
                      "div",
                      { className: "ruler-cm-mm-row" },
                      React.createElement(
                        "span",
                        {
                          className:
                            "length-value-box length-tiny" +
                            (cmPartDone
                              ? " length-value-box--complete"
                              : " length-value-box--active"),
                        },
                        String(cmPartDone ? targetWholeCm : sliderCm),
                      ),
                      React.createElement(
                        "span",
                        { className: "ruler-cm-and" },
                        " " +
                          (step5Question?.cmLabel || s5.cmLabel) +
                          " " +
                          (step5Question?.cmAnd || s5.cmAnd) +
                          " ",
                      ),
                      React.createElement(
                        "span",
                        {
                          className:
                            "length-value-box length-tiny" +
                            (s5mmDone
                              ? " length-value-box--complete-mm"
                              : !cmPartDone
                                ? " length-value-box--off"
                                : " length-value-box--active-mm"),
                        },
                        (() => {
                          if (targetMmPart === 0) return "0";
                          if (!cmPartDone) return "—";
                          return s5mmDone
                            ? String(targetMmPart)
                            : String(sliderMm);
                        })(),
                      ),
                      React.createElement(
                        "span",
                        { className: "ruler-cm-and" },
                        " " + (step5Question?.mmLabel || s5.mmLabel),
                      ),
                    ),
                    s5mmDone &&
                      React.createElement(
                        "div",
                        { className: "ruler-total-eq" },
                        React.createElement(
                          "span",
                          { className: "ruler-total-eq-sym" },
                          (step5Question?.totalEquals || s5.totalEquals) + " ",
                        ),
                        React.createElement(
                          "span",
                          {
                            className:
                              "length-value-box length-tiny length-value-box--total",
                          },
                          String(refLengthMm),
                        ),
                        React.createElement(
                          "span",
                          { className: "ruler-total-unit" },
                          (step5Question?.totalUnit || s5.totalUnit) + " ",
                        ),
                      ),
                  ),
              ),
            )
          : isShapeMeasureStep
            ? React.createElement(
                "div",
                { className: "canvas-right-panel ruler-action-panel" },
                React.createElement(
                  "div",
                  {
                    className: "ruler-action-stack ruler-action-stack--static",
                  },
                  React.createElement(
                    "p",
                    { className: "ruler-action-intro ruler-action-intro--sm" },
                    activeShapeMeasureCfg?.actionIntro,
                  ),
                  React.createElement(
                    "div",
                    { className: s7a.d1 },
                    activeShapeMeasureCfg?.step1,
                  ),
                  React.createElement(
                    "div",
                    { className: s7a.d2 },
                    activeShapeMeasureCfg?.step2,
                  ),
                  React.createElement(
                    "div",
                    { className: s7a.d3 },
                    activeShapeMeasureCfg?.step3,
                  ),
                  isStep7Measure &&
                    measureOpen &&
                    rotLocked &&
                    React.createElement(
                      "div",
                      { className: "ruler-dual-length-block" },
                      React.createElement(
                        "p",
                        { className: "ruler-dual-length-line" },
                        `${activeShapeMeasureCfg?.summaryPrefix || "Length of"} ${activeStep7Side?.sideLabel || ""} ${
                          activeShapeMeasureCfg?.summaryEquals || "="
                        }`,
                      ),
                      React.createElement(
                        "div",
                        { className: "ruler-cm-mm-row" },
                        React.createElement(
                          "span",
                          {
                            className:
                              "length-value-box length-tiny" +
                              (cmPartDone
                                ? " length-value-box--complete"
                                : " length-value-box--active"),
                          },
                          String(cmPartDone ? targetWholeCm : sliderCm),
                        ),
                        React.createElement(
                          "span",
                          { className: "ruler-cm-and" },
                          ` ${activeShapeMeasureCfg?.cmLabel || "cm"} ${activeShapeMeasureCfg?.cmAnd || "and"} `,
                        ),
                        React.createElement(
                          "span",
                          {
                            className:
                              "length-value-box length-tiny" +
                              (s5mmDone
                                ? " length-value-box--complete-mm"
                                : !cmPartDone
                                  ? " length-value-box--off"
                                  : " length-value-box--active-mm"),
                          },
                          (() => {
                            if (targetMmPart === 0) return "0";
                            if (!cmPartDone) return "—";
                            return s5mmDone
                              ? String(targetMmPart)
                              : String(sliderMm);
                          })(),
                        ),
                        React.createElement(
                          "span",
                          { className: "ruler-cm-and" },
                          ` ${activeShapeMeasureCfg?.mmLabel || "mm"}`,
                        ),
                      ),
                    ),
                ),
              )
            : isShapeSummaryStep
              ? React.createElement(
                  "div",
                  { className: "canvas-right-panel ruler-action-panel" },
                  React.createElement(
                    "div",
                    { className: "step8-summary-panel" },
                    step7SummaryOrder.map((sideKey) => {
                      const sideCfg = step7Sides[sideKey];
                      if (!sideCfg) return null;
                      return React.createElement(
                        "div",
                        {
                          key: `summary-${sideKey}`,
                          className: "step8-summary-row",
                        },
                        `${activeShapeMeasureCfg?.summaryPrefix || "Length of"} ${sideKey} ${activeShapeMeasureCfg?.summaryEquals || "="} ${formatLengthCmMm(
                          sideCfg.lengthMm || 0,
                        )}`,
                      );
                    }),
                  ),
                )
              : null;

  if (step === 1 && step1Question) {
    const q = step1Question;
    const legendBase = [1 * gridStep, 1 * gridStep];
    const isVerticalLegend =
      q.shape === "segment" &&
      q.points &&
      Array.isArray(q.points.p) &&
      Array.isArray(q.points.q) &&
      q.points.p[0] === q.points.q[0];
    const legendStart = [legendBase[0], legendBase[1]];
    const legendEnd = isVerticalLegend
      ? [legendBase[0], legendBase[1] + gridStep]
      : [legendBase[0] + gridStep, legendBase[1]];

    const toPoint = (pt) => [pt[0] * gridStep, pt[1] * gridStep];

    const lineStroke = Math.max(4, gridStep * 0.14);
    const labelSize = Math.max(20, gridStep * 0.66);

    let drawNodes = [];
    let measureA = [0, 0];
    let measureB = [0, 0];

    if (q.shape === "square") {
      const A = toPoint(q.points.a);
      const B = toPoint(q.points.b);
      const C = toPoint(q.points.c);
      const D = toPoint(q.points.d);
      measureA = A;
      measureB = B;
      drawNodes = [
        React.createElement("line", {
          key: "sq-ab",
          x1: A[0],
          y1: A[1],
          x2: B[0],
          y2: B[1],
          stroke: "#ffffff",
          strokeWidth: lineStroke,
        }),
        React.createElement("line", {
          key: "sq-bc",
          x1: B[0],
          y1: B[1],
          x2: C[0],
          y2: C[1],
          stroke: "#ffffff",
          strokeWidth: lineStroke,
        }),
        React.createElement("line", {
          key: "sq-cd",
          x1: C[0],
          y1: C[1],
          x2: D[0],
          y2: D[1],
          stroke: "#ffffff",
          strokeWidth: lineStroke,
        }),
        React.createElement("line", {
          key: "sq-da",
          x1: D[0],
          y1: D[1],
          x2: A[0],
          y2: A[1],
          stroke: "#ffffff",
          strokeWidth: lineStroke,
        }),
        React.createElement(
          "text",
          {
            key: "la",
            x: A[0] - 20,
            y: A[1] - 8,
            fill: "#fff",
            fontSize: labelSize,
            fontWeight: 700,
          },
          "A",
        ),
        React.createElement(
          "text",
          {
            key: "lb",
            x: B[0] + 8,
            y: B[1] - 8,
            fill: "#fff",
            fontSize: labelSize,
            fontWeight: 700,
          },
          "B",
        ),
        React.createElement(
          "text",
          {
            key: "lc",
            x: C[0] + 8,
            y: C[1] + 12,
            fill: "#fff",
            fontSize: labelSize,
            fontWeight: 700,
          },
          "C",
        ),
        React.createElement(
          "text",
          {
            key: "ld",
            x: D[0] - 20,
            y: D[1] + 16,
            fill: "#fff",
            fontSize: labelSize,
            fontWeight: 700,
          },
          "D",
        ),
      ];
    } else {
      const A = toPoint(q.points.p);
      const B = toPoint(q.points.q);
      measureA = A;
      measureB = B;
      const ux = B[0] - A[0];
      const uy = B[1] - A[1];
      const ul = Math.hypot(ux, uy) || 1;
      const off = 14;
      drawNodes = [
        React.createElement("line", {
          key: "seg-main",
          x1: A[0],
          y1: A[1],
          x2: B[0],
          y2: B[1],
          stroke: "#ffffff",
          strokeWidth: lineStroke,
        }),
        React.createElement(
          "text",
          {
            key: "seg-l1",
            x: A[0] - (ux / ul) * off,
            y: A[1] - (uy / ul) * off,
            fill: "#fff",
            fontSize: labelSize,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          q.measureSegment[0],
        ),
        React.createElement(
          "text",
          {
            key: "seg-l2",
            x: B[0] + (ux / ul) * off,
            y: B[1] + (uy / ul) * off,
            fill: "#fff",
            fontSize: labelSize,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          q.measureSegment[1],
        ),
      ];
    }

    const feedbackTicks = [];
    if (step1VisualState !== "none") {
      const ux = measureB[0] - measureA[0];
      const uy = measureB[1] - measureA[1];
      const ul = Math.hypot(ux, uy) || 1;
      const tx = ux / ul;
      const ty = uy / ul;
      const nx = ty;
      const ny = -tx;
      const tickColor = step1VisualState === "correct" ? "#4ce589" : "#ff7f73";
      const n = Number(q.answer) || 0;
      const shownTicks = Math.max(0, Math.min(step1RevealCount, n));
      const tickLen = 0.8 * gridStep;
      const unit = gridStep;
      const startInset = 0.1 * gridStep;
      const markerOffset = 0.9 * gridStep;

      for (let i = 0; i < shownTicks; i += 1) {
        const base = startInset + i * unit;
        const x1t = measureA[0] + tx * base + nx * markerOffset;
        const y1t = measureA[1] + ty * base + ny * markerOffset;
        const x2t = x1t + tx * tickLen;
        const y2t = y1t + ty * tickLen;
        feedbackTicks.push(
          React.createElement("line", {
            key: `tick-${i}`,
            x1: x1t,
            y1: y1t,
            x2: x2t,
            y2: y2t,
            stroke: tickColor,
            strokeWidth: Math.max(3, gridStep * 0.16),
          }),
        );
        if (step1VisualState === "correct") {
          feedbackTicks.push(
            React.createElement(
              "text",
              {
                key: `tick-label-${i}`,
                x: (x1t + x2t) / 2 + nx * (0.55 * gridStep),
                y: (y1t + y2t) / 2 + ny * (0.55 * gridStep),
                fill: tickColor,
                fontSize: Math.max(14, gridStep * 0.58),
                fontWeight: 700,
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              String(i + 1),
            ),
          );
        }
      }
    }

    const step1GridLines = [];
    const epsStep1 = 0.5;
    for (let i = 0; ; i += 1) {
      const x = i * gridStep;
      if (x > SVG_W + epsStep1) break;
      step1GridLines.push(
        React.createElement("line", {
          key: `s1-gv-${x}`,
          x1: x,
          y1: 0,
          x2: x,
          y2: svgViewH,
          stroke: "rgba(255,255,255,0.22)",
          strokeWidth: 1.8,
        }),
      );
    }
    for (let i = 0; ; i += 1) {
      const y = i * gridStep;
      if (y > svgViewH + epsStep1) break;
      step1GridLines.push(
        React.createElement("line", {
          key: `s1-gh-${y}`,
          x1: 0,
          y1: y,
          x2: SVG_W,
          y2: y,
          stroke: "rgba(255,255,255,0.22)",
          strokeWidth: 1.8,
        }),
      );
    }
    step1GridLines.push(
      React.createElement("line", {
        key: "s1-gh-bottom-edge",
        x1: 0,
        y1: svgViewH,
        x2: SVG_W,
        y2: svgViewH,
        stroke: "rgba(255,255,255,0.22)",
        strokeWidth: 1.8,
      }),
    );

    const step1SvgChildren = [
      ...step1GridLines,
      React.createElement("line", {
        key: "legend-line",
        x1: legendStart[0],
        y1: legendStart[1],
        x2: legendEnd[0],
        y2: legendEnd[1],
        stroke: "#f5d95a",
        strokeWidth: Math.max(3, gridStep * 0.16),
      }),
      React.createElement(
        "text",
        {
          key: "legend-text",
          x: isVerticalLegend
            ? legendStart[0] + 0.62 * gridStep
            : legendStart[0] + 0.5 * gridStep,
          y: isVerticalLegend
            ? legendStart[1] + 0.5 * gridStep
            : legendStart[1] + 0.7 * gridStep,
          fill: "#f5d95a",
          fontSize: Math.max(14, gridStep * 0.58),
          fontWeight: 700,
          textAnchor: isVerticalLegend ? "start" : "middle",
          dominantBaseline: "middle",
        },
        "1 cm",
      ),
      ...feedbackTicks,
      ...drawNodes,
    ];

    const entryClass = `step1-entry-box${
      step1Correct
        ? " step1-entry-box--correct"
        : step1Wrong
          ? " step1-entry-box--wrong step1-entry-box--shake"
          : ""
    }`;

    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "canvas-left-panel ruler-lesson-left" },
        React.createElement(
          "div",
          { className: "ruler-unified-svg-wrap" },
          React.createElement(
            "svg",
            {
              viewBox: `0 0 ${SVG_W} ${svgViewH}`,
              className: "triangle-svg ruler-line-svg ruler-unified-svg",
              xmlns: "http://www.w3.org/2000/svg",
              preserveAspectRatio: "xMinYMin slice",
            },
            step1SvgChildren,
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "canvas-right-panel ruler-action-panel step1-right-panel",
        },
        React.createElement(
          "div",
          { className: "step1-top-panel" },
          React.createElement(
            "div",
            { className: "step1-statement-row" },
            React.createElement("p", {
              className: "step1-statement",
              dangerouslySetInnerHTML: { __html: q.statementLabel },
            }),
            React.createElement(
              "span",
              { className: entryClass },
              step1Input || "\u00a0",
            ),
            React.createElement(
              "span",
              { className: "step1-unit" },
              " " + q.unit,
            ),
          ),
          step1WrongFeedback &&
            !step1Correct &&
            React.createElement(
              "div",
              { className: "step1-wrong-feedback" },
              q.wrongFeedback,
            ),
        ),
        React.createElement(
          "div",
          { className: "step1-bottom-panel" },
          step1Correct
            ? React.createElement("div", {
                className: "step1-correct-feedback",
                dangerouslySetInnerHTML: { __html: q.correctFeedback || "" },
              })
            : React.createElement(Numpad, {
                onNumberClick: handleStep1Number,
                onClear: handleStep1Clear,
                onSubmit: handleStep1Submit,
              }),
        ),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    leftPanel,
    rightPanel,
  );
};
