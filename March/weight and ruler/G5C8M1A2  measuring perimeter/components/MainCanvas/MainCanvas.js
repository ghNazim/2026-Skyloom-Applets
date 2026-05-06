const MainCanvas = React.forwardRef(
  (
    {
      step,
      shapeIndex = 0,
      onSetNextEnabled,
      onUpdateTexts,
      onAnimatingChange,
      onAdvanceStep,
    },
    ref,
  ) => {
    const {
      useState,
      useEffect,
      useRef,
      useMemo,
      useCallback,
      useImperativeHandle,
    } = React;

    const SVG_W = APP_DATA.svg?.w || 620;
    const SVG_TOTAL_H = APP_DATA.svg?.h || 420;
    const PX_PER_MM = APP_DATA.pxPerMm || 4.5;
    const RULER = APP_DATA.ruler;
    const SNAP_D = 24;
    const SNAP_DEG = 5.5;
    const ROT_HANDLE_RADIUS = 22;

    const rs = useMemo(() => (PX_PER_MM * 10) / RULER.cm, [PX_PER_MM, RULER.cm]);
    const rW = RULER.w * rs;
    const rH = RULER.h * rs;
    const roX = -RULER.zeroX * rs;
    const maxMm = useMemo(
      () => Math.floor(((RULER.w - RULER.zeroX) * 10) / RULER.cm),
      [RULER.w, RULER.zeroX, RULER.cm],
    );

    const shape = APP_DATA.shapes[shapeIndex] || APP_DATA.shapes[0];
    const points = shape.points;
    const sidesData = shape.sides;
    const sideKeys = useMemo(() => Object.keys(sidesData), [sidesData]);
    const summaryOrder = shape.summaryOrder || sideKeys;
    const totalPerimeterMm = useMemo(
      () => sideKeys.reduce((acc, k) => acc + (sidesData[k]?.lengthMm || 0), 0),
      [sideKeys, sidesData],
    );
    const totalPerimeterCm = totalPerimeterMm / 10;

    const initialRulerTransform = useMemo(() => {
      const cx = SVG_W / 2 - (RULER.w * rs) / 2 + RULER.zeroX * rs;
      const cy = SVG_TOTAL_H - rH - (RULER.bottomGapPx ?? 18);
      return { x: cx, y: cy, rot: 0 };
    }, [rs, rH, SVG_W, SVG_TOTAL_H, RULER.w, RULER.zeroX, RULER.bottomGapPx]);

    const [rX, setRX] = useState(initialRulerTransform.x);
    const [rY, setRY] = useState(initialRulerTransform.y);
    const [rRot, setRRot] = useState(0);
    const [snappedVertex, setSnappedVertex] = useState(null);
    const [alignedSide, setAlignedSide] = useState(null);
    const [markerMm, setMarkerMm] = useState(0);
    const [markerLocked, setMarkerLocked] = useState(false);
    const [measuredSides, setMeasuredSides] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [dragMode, setDragMode] = useState(null);

    const [animRevealedCount, setAnimRevealedCount] = useState(0);
    const [animDone, setAnimDone] = useState(false);

    const [numpadInput, setNumpadInput] = useState("");
    const [numpadCorrect, setNumpadCorrect] = useState(false);
    const [numpadWrong, setNumpadWrong] = useState(false);
    const [rulerImageSrc, setRulerImageSrc] = useState(
      RULER.imageSrc || "assets/ruler.svg",
    );
    const [guidedDemoDone, setGuidedDemoDone] = useState(false);
    const [guidedTap, setGuidedTap] = useState({ visible: false, x: 0, y: 0 });
    const [guidedArrowVisible, setGuidedArrowVisible] = useState(false);

    const rulerGRef = useRef(null);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const rotateOffsetRef = useRef(0);
    const lastPointerIdRef = useRef(null);
    const animTimerRef = useRef(null);
    const numpadWrongTimerRef = useRef(null);
    const guidedRunRef = useRef({ 2: false, 3: false, 4: false });
    const guidedCancelRef = useRef(false);
    const measuredSidesRef = useRef(measuredSides);
    const alignedSideRef = useRef(alignedSide);
    const markerLockedRef = useRef(markerLocked);

    useEffect(() => {
      measuredSidesRef.current = measuredSides;
    }, [measuredSides]);
    useEffect(() => {
      alignedSideRef.current = alignedSide;
    }, [alignedSide]);
    useEffect(() => {
      markerLockedRef.current = markerLocked;
    }, [markerLocked]);

    useEffect(() => {
      setRulerImageSrc(RULER.imageSrc || "assets/ruler.svg");
    }, [RULER.imageSrc]);

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

    const getIncidentSides = useCallback(
      (vertex) => sideKeys.filter((k) => k.indexOf(vertex) !== -1),
      [sideKeys],
    );
    const getOtherEndpoint = (sideKey, vertex) =>
      sideKey[0] === vertex ? sideKey[1] : sideKey[0];
    const sideAngle = (V, W) =>
      (Math.atan2(W[1] - V[1], W[0] - V[0]) * 180) / Math.PI;
    const getAlignedSideForRotation = useCallback(
      (vertex, tryDeg) => {
        if (!vertex) return null;
        const incident = getIncidentSides(vertex);
        let bestSide = null;
        let bestDiff = Infinity;
        let bestAngle = 0;
        incident.forEach((sideKey) => {
          const other = getOtherEndpoint(sideKey, vertex);
          const W = points[other];
          const V = points[vertex];
          if (!W || !V) return;
          const ang = sideAngle(V, W);
          const diff = Math.abs(angShortestDiff(tryDeg, ang));
          if (diff < bestDiff) {
            bestDiff = diff;
            bestSide = sideKey;
            bestAngle = ang;
          }
        });
        if (bestSide && bestDiff < SNAP_DEG) {
          return { sideKey: bestSide, angle: bestAngle };
        }
        return null;
      },
      [getIncidentSides, points],
    );

    const isVertexBlocked = useCallback(
      (vertex) => {
        const incident = getIncidentSides(vertex);
        if (incident.length === 0) return true;
        return incident.every((k) => measuredSidesRef.current[k]);
      },
      [getIncidentSides],
    );

    const resetRulerToInitial = useCallback(() => {
      setRX(initialRulerTransform.x);
      setRY(initialRulerTransform.y);
      setRRot(0);
      setSnappedVertex(null);
      setAlignedSide(null);
      setMarkerMm(0);
      setMarkerLocked(false);
      setDragMode(null);
    }, [initialRulerTransform]);

    const formatCmFromMm = useCallback(
      (mm) => {
        const cm = mm / 10;
        const cmStr = Number.isInteger(cm)
          ? String(cm)
          : cm.toFixed(1).replace(".", decimalSymbol);
        return cmStr;
      },
      [],
    );

    const isGuidedDemo =
      shapeIndex === 0 &&
      !guidedDemoDone &&
      !measuredSidesRef.current.AB &&
      (step === 2 || step === 3 || step === 4);
    const guidedCfg = APP_DATA.steps.guidedFirstSide || {};

    const sleep = useCallback((ms) => new Promise((resolve) => setTimeout(resolve, ms)), []);
    const localToGlobal = useCallback(
      (lx, ly, ox = rX, oy = rY, rotDeg = rRot) => {
        const rad = (rotDeg * Math.PI) / 180;
        const cs = Math.cos(rad);
        const sn = Math.sin(rad);
        return [ox + lx * cs - ly * sn, oy + lx * sn + ly * cs];
      },
      [rX, rY, rRot],
    );
    const animateTapLine = useCallback(
      async (from, to, duration = 650, steps = 24) => {
        for (let i = 0; i <= steps; i += 1) {
          if (guidedCancelRef.current) return;
          const t = i / steps;
          const x = from[0] + (to[0] - from[0]) * t;
          const y = from[1] + (to[1] - from[1]) * t;
          setGuidedTap({ visible: true, x, y });
          // eslint-disable-next-line no-await-in-loop
          await sleep(duration / steps);
        }
      },
      [sleep],
    );
    const animateTapArc = useCallback(
      async (center, radius, startAng, endAng, duration = 700, steps = 28) => {
        for (let i = 0; i <= steps; i += 1) {
          if (guidedCancelRef.current) return;
          const t = i / steps;
          const a = startAng + (endAng - startAng) * t;
          const x = center[0] + Math.cos(a) * radius;
          const y = center[1] + Math.sin(a) * radius;
          setGuidedTap({ visible: true, x, y });
          // eslint-disable-next-line no-await-in-loop
          await sleep(duration / steps);
        }
      },
      [sleep],
    );
    const animateRulerTo = useCallback(
      async (toX, toY, toRot, duration = 550, steps = 24) => {
        const sx = rX;
        const sy = rY;
        const sr = rRot;
        for (let i = 0; i <= steps; i += 1) {
          if (guidedCancelRef.current) return;
          const t = i / steps;
          setRX(sx + (toX - sx) * t);
          setRY(sy + (toY - sy) * t);
          setRRot(sr + (toRot - sr) * t);
          // eslint-disable-next-line no-await-in-loop
          await sleep(duration / steps);
        }
      },
      [rX, rY, rRot, sleep],
    );
    const animateMarkerTo = useCallback(
      async (toMm, duration = 700, steps = 24) => {
        const from = markerMm;
        for (let i = 0; i <= steps; i += 1) {
          if (guidedCancelRef.current) return;
          const t = i / steps;
          const v = Math.round(from + (toMm - from) * t);
          setMarkerMm(v);
          // eslint-disable-next-line no-await-in-loop
          await sleep(duration / steps);
        }
      },
      [markerMm, sleep],
    );

    useEffect(() => {
      if (step === 1) {
        setFeedback(null);
        setNumpadInput("");
        setNumpadCorrect(false);
        setNumpadWrong(false);
        setAnimRevealedCount(0);
        setAnimDone(false);
        setGuidedTap({ visible: false, x: 0, y: 0 });
        setGuidedArrowVisible(false);
        guidedRunRef.current = { 2: false, 3: false, 4: false };
        if (shapeIndex === 0) setGuidedDemoDone(false);
        resetRulerToInitial();
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(
            APP_DATA.steps.intro.navText,
            APP_DATA.steps.intro.questionText,
          );
        }
        return;
      }

      if (step === 2) {
        if (isGuidedDemo && guidedRunRef.current[2]) {
          return;
        }
        resetRulerToInitial();
        setFeedback(null);
        setGuidedTap({ visible: false, x: 0, y: 0 });
        setGuidedArrowVisible(false);
        if (typeof onSetNextEnabled === "function")
          onSetNextEnabled(!isGuidedDemo);
        if (typeof onUpdateTexts === "function") {
          if (isGuidedDemo) {
            onUpdateTexts(guidedCfg.navText, guidedCfg.questionText);
          } else {
            const measuredCount = Object.keys(measuredSidesRef.current).length;
            const remaining = sideKeys.length - measuredCount;
            let qt;
            if (measuredCount === 0)
              qt = APP_DATA.steps.snap.questionTextAll;
            else if (remaining === 1)
              qt = APP_DATA.steps.snap.questionTextOne;
            else qt = APP_DATA.steps.snap.questionTextRemaining;
            onUpdateTexts(APP_DATA.steps.snap.navText, qt);
          }
        }
        return;
      }

      if (step === 3) {
        if (isGuidedDemo && guidedRunRef.current[3]) {
          return;
        }
        setRRot(0);
        const autoAligned = getAlignedSideForRotation(snappedVertex, 0);
        if (autoAligned && !measuredSidesRef.current[autoAligned.sideKey]) {
          setAlignedSide(autoAligned.sideKey);
        } else {
          setAlignedSide(null);
        }
        setMarkerMm(0);
        setMarkerLocked(false);
        setDragMode(null);
        setFeedback(null);
        setGuidedTap({ visible: false, x: 0, y: 0 });
        setGuidedArrowVisible(isGuidedDemo);
        if (typeof onSetNextEnabled === "function")
          onSetNextEnabled(!isGuidedDemo);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(
            isGuidedDemo ? guidedCfg.navText : APP_DATA.steps.rotate.navText,
            isGuidedDemo ? guidedCfg.questionText : undefined,
          );
        }
        return;
      }

      if (step === 4) {
        if (isGuidedDemo && guidedRunRef.current[4]) {
          return;
        }
        setMarkerMm(0);
        setMarkerLocked(false);
        setDragMode(null);
        setFeedback(null);
        setGuidedTap({ visible: false, x: 0, y: 0 });
        setGuidedArrowVisible(false);
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(
            isGuidedDemo ? guidedCfg.navText : APP_DATA.steps.slide.navText,
            isGuidedDemo ? guidedCfg.questionText : undefined,
          );
        }
        return;
      }

      if (step === 5) {
        setFeedback(null);
        setAnimRevealedCount(0);
        setAnimDone(false);
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(
            APP_DATA.steps.animate.navText || "",
            APP_DATA.steps.animate.questionText,
          );
        }
        if (typeof onAnimatingChange === "function") onAnimatingChange(true);
        let i = 0;
        const order = summaryOrder;
        const tick = () => {
          if (i >= order.length) {
            if (typeof onAnimatingChange === "function")
              onAnimatingChange(false);
            setAnimDone(true);
            if (typeof onSetNextEnabled === "function")
              onSetNextEnabled(true);
            if (typeof onUpdateTexts === "function") {
              onUpdateTexts(APP_DATA.steps.animate.navTextEnd);
            }
            return;
          }
          setAnimRevealedCount((c) => c + 1);
          if (typeof playSound === "function") playSound("tick");
          i += 1;
          animTimerRef.current = setTimeout(tick, 700);
        };
        animTimerRef.current = setTimeout(tick, 500);
        return () => {
          if (animTimerRef.current) {
            clearTimeout(animTimerRef.current);
            animTimerRef.current = null;
          }
          if (typeof onAnimatingChange === "function")
            onAnimatingChange(false);
        };
      }

      if (step === 6) {
        setNumpadInput("");
        setNumpadCorrect(false);
        setNumpadWrong(false);
        setFeedback(null);
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(
            APP_DATA.steps.sum.navText,
            APP_DATA.steps.sum.questionText,
          );
        }
        return;
      }
    }, [
      step,
      shapeIndex,
      isGuidedDemo,
      guidedCfg.navText,
      guidedCfg.questionText,
      onSetNextEnabled,
      onUpdateTexts,
      onAnimatingChange,
      resetRulerToInitial,
      getAlignedSideForRotation,
    ]);

    useEffect(() => {
      return () => {
        if (animTimerRef.current) {
          clearTimeout(animTimerRef.current);
          animTimerRef.current = null;
        }
        if (numpadWrongTimerRef.current) {
          clearTimeout(numpadWrongTimerRef.current);
          numpadWrongTimerRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      guidedCancelRef.current = false;
      if (!isGuidedDemo) {
        setGuidedTap({ visible: false, x: 0, y: 0 });
        setGuidedArrowVisible(false);
        return () => {
          guidedCancelRef.current = true;
        };
      }
      const run = async () => {
        if (guidedRunRef.current[step]) return;
        guidedRunRef.current[step] = true;

        if (step === 2) {
          if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
          await sleep(500);
          const pointA = points.A;
          for (let i = 0; i < 2; i += 1) {
            if (guidedCancelRef.current) return;
            const zeroStart = [rX, rY];
            setGuidedTap({ visible: true, x: zeroStart[0], y: zeroStart[1] });
            await sleep(100);
            // eslint-disable-next-line no-await-in-loop
            await animateTapLine(zeroStart, pointA, 680);
            await sleep(170);
          }
          setGuidedTap({ visible: false, x: 0, y: 0 });
          await animateRulerTo(pointA[0], pointA[1], 0, 520);
          if (guidedCancelRef.current) return;
          setSnappedVertex("A");
          if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
          return;
        }

        if (step === 3) {
          if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
          setGuidedArrowVisible(true);
          await sleep(250);
          const handleLocalX = 0.4 * (rW + roX);
          const handleLocalY = rH * 0.5;
          const [hx, hy] = localToGlobal(handleLocalX, handleLocalY);
          const radius = Math.hypot(hx - rX, hy - rY);
          const startAng = Math.atan2(hy - rY, hx - rX);
          const endAng = startAng + Math.PI / 2;
          for (let i = 0; i < 2; i += 1) {
            if (guidedCancelRef.current) return;
            setGuidedTap({ visible: true, x: hx, y: hy });
            await sleep(100);
            // eslint-disable-next-line no-await-in-loop
            await animateTapArc([rX, rY], radius, startAng, endAng, 700);
            await sleep(170);
          }
          setGuidedTap({ visible: false, x: 0, y: 0 });
          setGuidedArrowVisible(false);
          const AB = getAlignedSideForRotation("A", 90) || { angle: 90 };
          await animateRulerTo(rX, rY, AB.angle, 650);
          if (guidedCancelRef.current) return;
          setAlignedSide("AB");
          if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
          return;
        }

        if (step === 4) {
          if (typeof onSetNextEnabled === "function") onSetNextEnabled(false);
          const movingMidY = (rH - 3 + (rH - 25)) / 2;
          const currentGlobal = localToGlobal(markerMm * PX_PER_MM, movingMidY);
          const targetMm = sidesData.AB?.lengthMm || 0;
          const targetGlobal = localToGlobal(targetMm * PX_PER_MM, movingMidY);
          for (let i = 0; i < 2; i += 1) {
            if (guidedCancelRef.current) return;
            setGuidedTap({ visible: true, x: currentGlobal[0], y: currentGlobal[1] });
            await sleep(100);
            // eslint-disable-next-line no-await-in-loop
            await animateTapLine(currentGlobal, targetGlobal, 650);
            await sleep(160);
          }
          setGuidedTap({ visible: false, x: 0, y: 0 });
          await animateMarkerTo(targetMm, 720);
          if (guidedCancelRef.current) return;
          setMarkerLocked(true);
          setAlignedSide("AB");
          setFeedback(null);
          if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
        }
      };
      run();
      return () => {
        guidedCancelRef.current = true;
      };
    }, [
      isGuidedDemo,
      step,
      onSetNextEnabled,
      points,
      rX,
      rY,
      rW,
      rH,
      roX,
      localToGlobal,
      animateTapLine,
      animateTapArc,
      animateRulerTo,
      animateMarkerTo,
      markerMm,
      sidesData,
      sleep,
      getAlignedSideForRotation,
    ]);

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

    const svgToRulerLocal = useCallback(
      (sx, sy) => {
        const dx = sx - rX;
        const dy = sy - rY;
        const radNeg = (-rRot * Math.PI) / 180;
        const cs = Math.cos(radNeg);
        const sn = Math.sin(radNeg);
        return { x: dx * cs - dy * sn, y: dx * sn + dy * cs };
      },
      [rX, rY, rRot],
    );

    const canDragRuler = step === 2 && !isGuidedDemo;
    const canDragRotate = step === 3 && !!snappedVertex && !isGuidedDemo;
    const canDragMarker = step === 4 && !markerLocked && !isGuidedDemo;
    const showStaticMarker = step === 2 || step === 3 || step === 4;
    const showMovingMarker = step === 4;
    const showRuler = step === 2 || step === 3 || step === 4;

    const onRulerPointerDown = (e) => {
      if (!canDragRuler) return;
      e.stopPropagation();
      if (e?.cancelable) e.preventDefault();
      const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
      if (!p) return;
      dragOffsetRef.current = { x: rX - p.x, y: rY - p.y };
      if (e.pointerId !== undefined) {
        if (typeof e.currentTarget?.setPointerCapture === "function") {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch (_) {}
        }
        lastPointerIdRef.current = e.pointerId;
      }
      setDragMode("move");
      setFeedback(null);
      if (snappedVertex) setSnappedVertex(null);
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
      setRX(p.x + dragOffsetRef.current.x);
      setRY(p.y + dragOffsetRef.current.y);
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
      const finalX = p.x + dragOffsetRef.current.x;
      const finalY = p.y + dragOffsetRef.current.y;

      let nearestVertex = null;
      let nearestDist = Infinity;
      shape.vertices.forEach((vLabel) => {
        const v = points[vLabel];
        if (!v) return;
        const d = Math.hypot(finalX - v[0], finalY - v[1]);
        if (d < nearestDist) {
          nearestDist = d;
          nearestVertex = vLabel;
        }
      });

      if (nearestVertex && nearestDist < SNAP_D) {
        if (isVertexBlocked(nearestVertex)) {
          const incident = getIncidentSides(nearestVertex);
          const fb = fillTemplate(
            APP_DATA.steps.snap.wrongFeedbackBothMeasured,
            { side1: incident[0] || "", side2: incident[1] || "" },
          );
          setFeedback({ type: "wrong", text: fb });
          if (typeof playSound === "function") playSound("wrong");
          setRX(finalX);
          setRY(finalY);
        } else {
          const v = points[nearestVertex];
          setRX(v[0]);
          setRY(v[1]);
          setSnappedVertex(nearestVertex);
          setFeedback(null);
          if (typeof playSound === "function") playSound("tick");
        }
      } else {
        setRX(finalX);
        setRY(finalY);
      }
      lastPointerIdRef.current = null;
    };

    const onRotateHandleDown = (e) => {
      if (!canDragRotate) return;
      e.stopPropagation();
      if (e?.cancelable) e.preventDefault();
      const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
      if (!p) return;
      const pointerDeg =
        (Math.atan2(p.y - rY, p.x - rX) * 180) / Math.PI;
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
      setFeedback(null);
      if (alignedSide) setAlignedSide(null);
    };

    const onRotateHandleMove = (e) => {
      if (dragMode !== "rot" || !canDragRotate) return;
      if (
        e.pointerId !== undefined &&
        lastPointerIdRef.current !== null &&
        e.pointerId !== lastPointerIdRef.current
      )
        return;
      const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
      if (!p) return;
      const pointerDeg =
        (Math.atan2(p.y - rY, p.x - rX) * 180) / Math.PI;
      setRRot(pointerDeg - rotateOffsetRef.current);
    };

    const onRotateHandleUp = (e) => {
      if (dragMode !== "rot" || !canDragRotate) {
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
      const pointerDeg =
        (Math.atan2(p.y - rY, p.x - rX) * 180) / Math.PI;
      const tryDeg = pointerDeg - rotateOffsetRef.current;
      const aligned = getAlignedSideForRotation(snappedVertex, tryDeg);
      if (aligned) {
        if (measuredSidesRef.current[aligned.sideKey]) {
          const fb = fillTemplate(
            APP_DATA.steps.rotate.wrongFeedbackAlreadyMeasured,
            { side: aligned.sideKey },
          );
          setFeedback({ type: "wrong", text: fb });
          if (typeof playSound === "function") playSound("wrong");
          setRRot(tryDeg);
        } else {
          setRRot(aligned.angle);
          setAlignedSide(aligned.sideKey);
          setFeedback(null);
          if (typeof playSound === "function") playSound("tick");
        }
      } else {
        setRRot(tryDeg);
      }
      lastPointerIdRef.current = null;
    };

    const onMarkerDown = (e) => {
      if (!canDragMarker) return;
      e.stopPropagation();
      if (e?.cancelable) e.preventDefault();
      if (e.pointerId !== undefined) {
        if (typeof e.currentTarget?.setPointerCapture === "function") {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch (_) {}
        }
        lastPointerIdRef.current = e.pointerId;
      }
      setDragMode("marker");
      setFeedback(null);
    };

    const onMarkerMove = (e) => {
      if (dragMode !== "marker" || !canDragMarker) return;
      if (
        e.pointerId !== undefined &&
        lastPointerIdRef.current !== null &&
        e.pointerId !== lastPointerIdRef.current
      )
        return;
      const p = getSvgPoint(e) || clientToSvg(e.clientX, e.clientY);
      if (!p) return;
      const local = svgToRulerLocal(p.x, p.y);
      const mm = Math.round(local.x / PX_PER_MM);
      const clamped = Math.max(0, Math.min(maxMm, mm));
      if (clamped !== markerMm) {
        setMarkerMm(clamped);
        if (typeof playSound === "function") playSound("tick");
      }
    };

    const onMarkerUp = (e) => {
      if (dragMode !== "marker" || !canDragMarker) {
        if (e.pointerId !== undefined)
          e.currentTarget.releasePointerCapture?.(e.pointerId);
        setDragMode(null);
        lastPointerIdRef.current = null;
        return;
      }
      setDragMode(null);
      if (e.pointerId !== undefined)
        e.currentTarget.releasePointerCapture?.(e.pointerId);

      const targetMm = sidesData[alignedSide]?.lengthMm || 0;
      if (markerMm === targetMm && markerMm > 0) {
        setMarkerLocked(true);
        setFeedback({
          type: "correct",
          text: APP_DATA.steps.slide.correctFeedback,
        });
        if (typeof playSound === "function") playSound("correct");
        if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
        if (typeof onUpdateTexts === "function") {
          onUpdateTexts(APP_DATA.steps.slide.navTextDone);
        }
      } else {
        setFeedback({
          type: "wrong",
          text: APP_DATA.steps.slide.wrongFeedback,
        });
        if (typeof playSound === "function") playSound("wrong");
      }
      lastPointerIdRef.current = null;
    };

    useImperativeHandle(
      ref,
      () => ({
        tryAdvance: () => {
          if (step === 2) {
            if (snappedVertex) {
              setFeedback(null);
              if (typeof playSound === "function") playSound("correct");
              if (typeof onAdvanceStep === "function") onAdvanceStep(3);
              return true;
            }
            setFeedback({
              type: "wrong",
              text: APP_DATA.steps.snap.wrongFeedbackNoSnap,
            });
            if (typeof playSound === "function") playSound("wrong");
            return false;
          }
          if (step === 3) {
            if (alignedSide) {
              setFeedback(null);
              if (typeof playSound === "function") playSound("correct");
              if (typeof onAdvanceStep === "function") onAdvanceStep(4);
              return true;
            }
            setFeedback({
              type: "wrong",
              text: APP_DATA.steps.rotate.wrongFeedbackNotAligned,
            });
            if (typeof playSound === "function") playSound("wrong");
            return false;
          }
          if (step === 4) {
            if (markerLocked && alignedSide) {
              const sk = alignedSide;
              const newMeasured = {
                ...measuredSidesRef.current,
                [sk]: sidesData[sk]?.lengthMm || 0,
              };
              setMeasuredSides(newMeasured);
              measuredSidesRef.current = newMeasured;
              if (isGuidedDemo) setGuidedDemoDone(true);
              const allDone = sideKeys.every((k) => newMeasured[k]);
              if (typeof onAdvanceStep === "function") {
                onAdvanceStep(allDone ? 5 : 2);
              }
              return true;
            }
            return false;
          }
          return false;
        },
      }),
      [
        step,
        snappedVertex,
        alignedSide,
        markerLocked,
        isGuidedDemo,
        sidesData,
        sideKeys,
        onAdvanceStep,
      ],
    );

    const handleNumpadNumber = useCallback(
      (num) => {
        if (step !== 6 || numpadCorrect) return;
        setNumpadWrong(false);
        setFeedback(null);
        setNumpadInput((prev) => {
          if ((prev || "").length >= 3) return prev;
          return `${prev || ""}${num}`;
        });
      },
      [step, numpadCorrect],
    );

    const handleNumpadClear = useCallback(() => {
      if (step !== 6 || numpadCorrect) return;
      setNumpadWrong(false);
      setFeedback(null);
      setNumpadInput((prev) => (prev || "").slice(0, -1));
    }, [step, numpadCorrect]);

    const handleNumpadSubmit = useCallback(() => {
      if (step !== 6 || numpadCorrect) return;
      const parsed = parseInt(numpadInput, 10);
      if (!Number.isFinite(parsed) || parsed !== totalPerimeterCm) {
        if (typeof playSound === "function") playSound("wrong");
        setNumpadWrong(true);
        setFeedback({
          type: "wrong",
          text: APP_DATA.steps.sum.wrongFeedback,
        });
        if (numpadWrongTimerRef.current) {
          clearTimeout(numpadWrongTimerRef.current);
        }
        numpadWrongTimerRef.current = setTimeout(() => {
          setNumpadInput("");
          setNumpadWrong(false);
          numpadWrongTimerRef.current = null;
        }, 520);
        return;
      }
      if (typeof playSound === "function") playSound("correct");
      setNumpadCorrect(true);
      setNumpadWrong(false);
      setFeedback({
        type: "correct",
        text: APP_DATA.steps.sum.correctFeedback,
      });
      if (typeof onSetNextEnabled === "function") onSetNextEnabled(true);
      if (typeof onUpdateTexts === "function") {
        onUpdateTexts(APP_DATA.steps.sum.navTextDone);
      }
    }, [
      step,
      numpadCorrect,
      numpadInput,
      totalPerimeterCm,
      onSetNextEnabled,
      onUpdateTexts,
    ]);

    const svgChildren = [];

    const polygonPoints = (shape.vertices || [])
      .map((vLabel) => points[vLabel])
      .filter((p) => Array.isArray(p) && p.length === 2);
    if (polygonPoints.length >= 3) {
      svgChildren.push(
        React.createElement("polygon", {
          key: "shape-fill",
          points: polygonPoints.map((p) => `${p[0]},${p[1]}`).join(" "),
          fill: "rgba(232, 148, 58, 0.22)",
          stroke: "none",
        }),
      );
    }

    sideKeys.forEach((sideKey) => {
      const v1 = sideKey[0];
      const v2 = sideKey[1];
      const p1 = points[v1];
      const p2 = points[v2];
      if (!p1 || !p2) return;
      const isMeasured = !!measuredSides[sideKey];
      const isAligned = alignedSide === sideKey && step === 4;

      let revealedInAnim = false;
      if (step === 5 || step === 6) {
        const order = summaryOrder;
        const idx = order.indexOf(sideKey);
        if (idx !== -1 && idx < animRevealedCount) revealedInAnim = true;
        if (step === 6) revealedInAnim = true;
      }

      let stroke = "#ffffff";
      let strokeWidth = 5;
      if (isMeasured) {
        stroke = "#E8943A";
        strokeWidth = 6;
      }
      if (isAligned) {
        stroke = "#5EADEB";
        strokeWidth = 7;
      }
      if (revealedInAnim) {
        stroke = "#4FC8F8";
        strokeWidth = 7;
      }

      svgChildren.push(
        React.createElement("line", {
          key: `side-${sideKey}`,
          x1: p1[0],
          y1: p1[1],
          x2: p2[0],
          y2: p2[1],
          stroke: stroke,
          strokeWidth: strokeWidth,
          // strokeLinecap: "round",
        }),
      );

      if (isMeasured) {
        const mx = (p1[0] + p2[0]) / 2;
        const my = (p1[1] + p2[1]) / 2;
        const vx = p2[0] - p1[0];
        const vy = p2[1] - p1[1];
        const vl = Math.hypot(vx, vy) || 1;
        let nx = -vy / vl;
        let ny = vx / vl;
        const cx = (points.A[0] + points.B[0] + points.C[0] + points.D[0]) / 4;
        const cy = (points.A[1] + points.B[1] + points.C[1] + points.D[1]) / 4;
        const dot = nx * (mx - cx) + ny * (my - cy);
        if (dot < 0) {
          nx = -nx;
          ny = -ny;
        }
        const labelDist = 22;
        const lx = mx + nx * labelDist;
        const ly = my + ny * labelDist;
        const rawAngle = (Math.atan2(vy, vx) * 180) / Math.PI;
        const textAngle =
          rawAngle > 90
            ? rawAngle - 180
            : rawAngle < -90
              ? rawAngle + 180
              : rawAngle;
        svgChildren.push(
          React.createElement(
            "text",
            {
              key: `side-label-${sideKey}`,
              x: lx,
              y: ly,
              fill: revealedInAnim ? "#4FC8F8" : "#E8943A",
              fontSize: 18,
              fontWeight: 700,
              textAnchor: "middle",
              dominantBaseline: "middle",
              transform: `rotate(${textAngle} ${lx} ${ly})`,
            },
            `${formatCmFromMm(sidesData[sideKey].lengthMm)} cm`,
          ),
        );
      }
    });

    if (step === 2 && !snappedVertex) {
      shape.vertices.forEach((vLabel) => {
        if (isVertexBlocked(vLabel)) return;
        const v = points[vLabel];
        if (!v) return;
        svgChildren.push(
          React.createElement("circle", {
            key: `vhint-${vLabel}`,
            cx: v[0],
            cy: v[1],
            r: 14,
            className: "vertex-hint-circle",
          }),
        );
      });
    }

    Object.keys(points).forEach((label) => {
      const p = points[label];
      if (!p) return;
      const cx =
        (points.A[0] + points.B[0] + points.C[0] + points.D[0]) / 4;
      const cy =
        (points.A[1] + points.B[1] + points.C[1] + points.D[1]) / 4;
      const dx = p[0] - cx;
      const dy = p[1] - cy;
      const dl = Math.hypot(dx, dy) || 1;
      const off = 18;
      const lx = p[0] + (dx / dl) * off;
      const ly = p[1] + (dy / dl) * off;
      svgChildren.push(
        React.createElement(
          "text",
          {
            key: `vertex-${label}`,
            x: lx,
            y: ly,
            fill: "#fff",
            fontSize: 20,
            fontWeight: 700,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          label,
        ),
      );
    });

    if (showRuler) {
      const rulerChildren = [
        React.createElement("image", {
          key: "ruler-img",
          href: rulerImageSrc,
          x: roX,
          y: 0,
          width: rW,
          height: rH,
          preserveAspectRatio: "none",
          onError: () => {
            if (rulerImageSrc !== "assets/ruler.svg") {
              setRulerImageSrc("assets/ruler.svg");
            }
          },
        }),
      ];

      if (canDragRuler) {
        rulerChildren.push(
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
        );
      }

      if (showStaticMarker) {
        const staticTipY = rH - 3;
        const staticBaseY = rH - 22;
        const staticMidY = (staticTipY + staticBaseY) / 2;
        rulerChildren.push(
          React.createElement(
            "g",
            { key: "marker-static", style: { pointerEvents: "none" } },
            React.createElement("line", {
              x1: 0,
              y1: 2,
              x2: 0,
              y2: staticMidY,
              stroke: "#E53935",
              strokeWidth: 1.6,
              strokeDasharray: "4 3",
            }),
            React.createElement("polygon", {
              points: `0,${staticTipY} -12,${staticBaseY} 12,${staticBaseY}`,
              fill: "#E53935",
              stroke: "#ffffff",
              strokeWidth: 1.2,
            }),
          ),
        );
      }

      if (showMovingMarker) {
        const mkX = markerMm * PX_PER_MM;
        const mkColor = markerLocked ? "#4C9F7A" : "#E53935";
        const movingTipY = rH - 3;
        const movingBaseY = rH - 25;
        const movingMidY = (movingTipY + movingBaseY) / 2;
        rulerChildren.push(
          React.createElement(
            "g",
            {
              key: "marker-moving",
              transform: `translate(${mkX}, 0)`,
            },
            React.createElement("line", {
              x1: 0,
              y1: 2,
              x2: 0,
              y2: movingMidY,
              stroke: mkColor,
              strokeWidth: 1.8,
              strokeDasharray: "4 3",
            }),
            React.createElement("polygon", {
              points: `0,${movingTipY} -14,${movingBaseY} 14,${movingBaseY}`,
              fill: mkColor,
              stroke: "#ffffff",
              strokeWidth: 1.4,
              style: canDragMarker
                ? { cursor: "grab", touchAction: "none" }
                : { pointerEvents: "none" },
              onPointerDown: canDragMarker ? onMarkerDown : undefined,
              onPointerMove: canDragMarker ? onMarkerMove : undefined,
              onPointerUp: canDragMarker ? onMarkerUp : undefined,
              onPointerCancel: canDragMarker ? onMarkerUp : undefined,
            }),
            React.createElement("circle", {
              cx: 0,
              cy: movingMidY,
              r: 18,
              fill: "rgba(0,0,0,0.001)",
              style: canDragMarker
                ? { cursor: "grab", touchAction: "none" }
                : { pointerEvents: "none" },
              onPointerDown: canDragMarker ? onMarkerDown : undefined,
              onPointerMove: canDragMarker ? onMarkerMove : undefined,
              onPointerUp: canDragMarker ? onMarkerUp : undefined,
              onPointerCancel: canDragMarker ? onMarkerUp : undefined,
            }),
            React.createElement(
              "text",
              {
                x: 0,
                y: rH + 12,
                textAnchor: "middle",
                dominantBaseline: "hanging",
                fill: "#E53935",
                fontSize: 18,
                fontWeight: 700,
                style: { pointerEvents: "none", userSelect: "none" },
              },
              `${formatCmFromMm(markerMm)} ${APP_DATA.cmLabel || "cm"}`,
            ),
          ),
        );
      }

      if (canDragRotate) {
        const handleLocalX = 0.4 * (rW + roX);
        rulerChildren.push(
          React.createElement(
            "g",
            { key: "rot-handle", style: { pointerEvents: "none" } },
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
            React.createElement("circle", {
              cx: handleLocalX,
              cy: rH * 0.5,
              r: ROT_HANDLE_RADIUS,
              fill: "rgba(80, 180, 200, 0.95)",
              stroke: "rgba(255,255,255,0.7)",
              strokeWidth: 2,
              style: {
                cursor: "alias",
                touchAction: "none",
                pointerEvents: "all",
              },
              onPointerDown: onRotateHandleDown,
              onPointerMove: onRotateHandleMove,
              onPointerUp: onRotateHandleUp,
              onPointerCancel: onRotateHandleUp,
            }),
            React.createElement(
              "text",
              {
                x: handleLocalX,
                y: rH * 0.5 + 1,
                textAnchor: "middle",
                dominantBaseline: "middle",
                fontSize: 24,
                fontWeight: 700,
                fill: "#ffffff",
                style: { pointerEvents: "none", userSelect: "none" },
              },
              "↻",
            ),
          ),
        );
      }

      svgChildren.push(
        React.createElement(
          "g",
          {
            key: "ruler-g",
            ref: rulerGRef,
            transform: `translate(${rX}, ${rY}) rotate(${rRot})`,
          },
          rulerChildren,
        ),
      );
    }

    if (isGuidedDemo && step === 3 && guidedArrowVisible) {
      const handleLocalX = 0.4 * (rW + roX);
      const handleLocalY = rH * 0.5;
      const [hx, hy] = localToGlobal(handleLocalX, handleLocalY);
      const radius = Math.hypot(hx - rX, hy - rY);
      const startAng = Math.atan2(hy - rY, hx - rX);
      const endAng = startAng + Math.PI / 2;
      const sx = rX + radius * Math.cos(startAng);
      const sy = rY + radius * Math.sin(startAng);
      const ex = rX + radius * Math.cos(endAng);
      const ey = rY + radius * Math.sin(endAng);
      const largeArc = Math.abs(endAng - startAng) > Math.PI ? 1 : 0;
      const sweep = endAng > startAng ? 1 : 0;
      const pathD = `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${ex} ${ey}`;
      const tangentAng = endAng + (sweep ? Math.PI / 2 : -Math.PI / 2);
      const ahLen = 12;
      const ahSpread = 0.55;
      const ax1 = ex - ahLen * Math.cos(tangentAng - ahSpread);
      const ay1 = ey - ahLen * Math.sin(tangentAng - ahSpread);
      const ax2 = ex - ahLen * Math.cos(tangentAng + ahSpread);
      const ay2 = ey - ahLen * Math.sin(tangentAng + ahSpread);
      svgChildren.push(
        React.createElement(
          "g",
          { key: "guided-rot-arrow", className: "guided-rot-arrow-blink" },
          React.createElement("path", {
            d: pathD,
            fill: "none",
            stroke: "#4FC8F8",
            strokeWidth: 4,
            strokeLinecap: "round",
            strokeDasharray: "8 6",
          }),
          React.createElement("polygon", {
            points: `${ex},${ey} ${ax1},${ay1} ${ax2},${ay2}`,
            fill: "#4FC8F8",
          }),
        ),
      );
    }

    if (isGuidedDemo && guidedTap.visible) {
      const tapW = 42;
      const tapH = 42;
      svgChildren.push(
        React.createElement("image", {
          key: "guided-tap",
          href: "assets/tap.png",
          x: guidedTap.x - tapW / 2,
          y: guidedTap.y - tapH / 2,
          width: tapW,
          height: tapH,
          preserveAspectRatio: "xMidYMid meet",
        }),
      );
    }

    if (step === 1) {
      svgChildren.push(
        React.createElement(
          "foreignObject",
          {
            key: "perimeter-fo-step1",
            x: 10,
            y: SVG_TOTAL_H - 110,
            width: SVG_W - 20,
            height: 100,
          },
          React.createElement(
            "div",
            {
              xmlns: "http://www.w3.org/1999/xhtml",
              className: "perimeter-fo-host",
            },
            React.createElement(
              "div",
              { className: "perimeter-text" },
              React.createElement(
                "span",
                { className: "perimeter-prefix" },
                `${APP_DATA.steps.animate.perimeterPrefix || "Perimeter"} = `,
              ),
              React.createElement(
                "span",
                { className: "perimeter-expr" },
                "AB + BC + CD + AD",
              ),
            ),
          ),
        ),
      );
    }

    if (step === 5 || step === 6) {
      const order = summaryOrder;
      const revealed =
        step === 6
          ? order.length
          : Math.min(animRevealedCount, order.length);
      const items = order.map((k, idx) =>
        idx < revealed
          ? `${formatCmFromMm(sidesData[k]?.lengthMm || 0)} ${APP_DATA.cmLabel || "cm"}`
          : k,
      );
      const prefix = APP_DATA.steps.animate.perimeterPrefix || "Perimeter";
      const exprNodes = [];
      items.forEach((item, idx) => {
        const isValue = idx < revealed;
        exprNodes.push(
          React.createElement(
            "span",
            {
              key: `expr-item-${idx}`,
              className: isValue
                ? "perimeter-expr-value"
                : "perimeter-expr-side",
            },
            item,
          ),
        );
        if (idx < items.length - 1) {
          exprNodes.push(
            React.createElement(
              "span",
              { key: `expr-plus-${idx}`, className: "perimeter-expr-plus" },
              " + ",
            ),
          );
        }
      });

      let innerNode;
      if (step === 5) {
        innerNode = React.createElement(
          "div",
          { className: "perimeter-text" },
          React.createElement(
            "span",
            { className: "perimeter-prefix" },
            `${prefix} = `,
          ),
          React.createElement(
            "span",
            { className: "perimeter-expr" },
            exprNodes.length > 0 ? exprNodes : "\u00a0",
          ),
        );
      } else {
        const entryClass = `perimeter-entry-box${
          numpadCorrect
            ? " perimeter-entry-box--correct"
            : numpadWrong
              ? " perimeter-entry-box--wrong perimeter-entry-box--shake"
              : ""
        }`;
        innerNode = React.createElement(
          "div",
          { className: "perimeter-text perimeter-text--sum" },
          React.createElement(
            "span",
            { className: "perimeter-prefix" },
            `${prefix} = `,
          ),
          React.createElement(
            "span",
            { className: "perimeter-expr" },
            exprNodes.length > 0
              ? [
                  ...exprNodes,
                  React.createElement(
                    "span",
                    { key: "expr-equals", className: "perimeter-expr-plus" },
                    " = ",
                  ),
                ]
              : "\u00a0",
          ),
          React.createElement(
            "span",
            { className: entryClass },
            numpadCorrect
              ? String(totalPerimeterCm)
              : numpadInput || "\u00a0",
          ),
          React.createElement(
            "span",
            { className: "perimeter-unit" },
            ` ${APP_DATA.cmLabel || "cm"}`,
          ),
        );
      }

      svgChildren.push(
        React.createElement(
          "foreignObject",
          {
            key: "perimeter-fo",
            x: 10,
            y: SVG_TOTAL_H - 110,
            width: SVG_W - 20,
            height: 100,
          },
          React.createElement(
            "div",
            {
              xmlns: "http://www.w3.org/1999/xhtml",
              className: "perimeter-fo-host",
            },
            innerNode,
          ),
        ),
      );
    }

    const leftPanel = React.createElement(
      "div",
      { className: "canvas-left-panel ruler-lesson-left" },
      React.createElement(
        "div",
        { className: "ruler-unified-svg-wrap" },
        React.createElement(
          "svg",
          {
            viewBox: `0 0 ${SVG_W} ${SVG_TOTAL_H}`,
            className: "triangle-svg ruler-line-svg ruler-unified-svg",
            xmlns: "http://www.w3.org/2000/svg",
            preserveAspectRatio: "xMidYMid meet",
            style: { touchAction: "none" },
          },
          svgChildren,
        ),
      ),
    );

    let rightPanelContent = null;

    if (step === 1) {
      rightPanelContent = null;
    } else if (step === 2 || step === 3 || step === 4) {
      const guidedText =
        step === 2
          ? guidedCfg.step1Text
          : step === 3
            ? guidedCfg.step2Text
            : guidedCfg.step3Text;
      rightPanelContent = React.createElement(
        "div",
        { className: "perimeter-feedback-area" },
        isGuidedDemo &&
          React.createElement("div", {
            className: "guided-step-text",
            dangerouslySetInnerHTML: { __html: guidedText || "" },
          }),
        feedback &&
          React.createElement(
            "div",
            {
              className: `perimeter-feedback perimeter-feedback--${feedback.type}`,
            },
            feedback.text,
          ),
      );
    } else if (step === 5) {
      rightPanelContent = React.createElement("div", {
        className: "perimeter-feedback-area",
      });
    } else if (step === 6) {
      rightPanelContent = React.createElement(
        "div",
        { className: "perimeter-sum-panel" },
        React.createElement(
          "div",
          { className: "perimeter-feedback-area perimeter-feedback-area--top" },
          feedback &&
            React.createElement(
              "div",
              {
                className: `perimeter-feedback perimeter-feedback--${feedback.type}`,
              },
              feedback.text,
            ),
        ),
        React.createElement(
          "div",
          { className: "perimeter-numpad-wrap" },
          React.createElement(Numpad, {
            disabled: numpadCorrect,
            onNumberClick: handleNumpadNumber,
            onClear: handleNumpadClear,
            onSubmit: handleNumpadSubmit,
          }),
        ),
      );
    }

    const rightPanel =
      step === 1
        ? null
        : React.createElement(
            "div",
            {
              className: `canvas-right-panel ruler-action-panel${
                step === 6 ? " ruler-action-panel--sum" : ""
              }`,
            },
            rightPanelContent,
          );

    return React.createElement(
      "div",
      {
        className: `main-canvas-container${
          step === 1 ? " main-canvas-container--single" : ""
        }`,
      },
      leftPanel,
      rightPanel,
    );
  },
);
