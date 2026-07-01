const POINT_STYLES = {
  red: { fill: "#e53935", stroke: "#ffffff", arc: "#e53935" },
  purple: { fill: "#9c27b0", stroke: "#ffffff", arc: "#9c27b0" },
  green: { fill: "#4caf50", stroke: "#ffffff", arc: "#4caf50" },
};

const ARROW_COLOR = POINT_STYLES.purple.arc;
const SECTOR_RADIUS = 30;
const SECTOR_FILL = "rgba(156, 39, 176, 0.35)";
const SECTOR_STROKE = POINT_STYLES.purple.arc;
const CLOCK_SIZE = 225;

function normalizeAngleDelta(delta) {
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

function describeSector(cx, cy, r, startRad, rotationDeg) {
  if (Math.abs(rotationDeg) < 0.5) return "";
  const rotationRad = (rotationDeg * Math.PI) / 180;
  const sweep = rotationDeg >= 0 ? 1 : 0;
  const absRot = Math.abs(rotationRad);
  const largeArc = absRot > Math.PI ? 1 : 0;
  const endRad = startRad + rotationRad;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2} Z`;
}

function renderArrow(fromX, fromY, toX, toY, color, extraProps) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLen = 10;
  const tipExtend = 3;
  const spread = Math.PI / 7;

  const tipX = toX + tipExtend * Math.cos(angle);
  const tipY = toY + tipExtend * Math.sin(angle);

  const baseMidX = tipX - headLen * Math.cos(angle);
  const baseMidY = tipY - headLen * Math.sin(angle);

  const wing1X = tipX - headLen * Math.cos(angle - spread);
  const wing1Y = tipY - headLen * Math.sin(angle - spread);
  const wing2X = tipX - headLen * Math.cos(angle + spread);
  const wing2Y = tipY - headLen * Math.sin(angle + spread);

  return React.createElement(
    "g",
    extraProps || {},
    React.createElement("line", {
      x1: fromX,
      y1: fromY,
      x2: baseMidX,
      y2: baseMidY,
      stroke: color,
      strokeWidth: 2.5,
      strokeLinecap: "butt",
    }),
    React.createElement("polygon", {
      points: `${tipX},${tipY} ${wing1X},${wing1Y} ${wing2X},${wing2Y}`,
      fill: color,
      stroke: color,
      strokeWidth: 0.5,
      strokeLinejoin: "round",
    })
  );
}

const MainCanvas = (props) => {
  const { useState, useRef, useEffect, useCallback } = React;
  const {
    step,
    step1Phase,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    rightText,
    onStep1PinPlaced,
    onStep1RotationDone,
    onStep2PointPlaced,
    onStep2RotationDone,
    onStep2PurplePlaced,
    onStep2GreenPlaced,
    onStep3RotationDone,
    onStep3CentreTapped,
    onStep4DragStart,
    onStep4Drop,
    onStep5LeftDone,
    onStep5RightDone,
  } = props;

  const svgRef = useRef(null);
  const svgLeftRef = useRef(null);
  const svgRightRef = useRef(null);

  const VB_W = 400;
  const VB_H = 340;
  const CB_W = 148*0.7;
  const CB_H = 205*0.7;
  const CB_CX = VB_W / 2;
  const CB_CY = VB_H / 2;
  // Anchor offset from cardboard top-left (tweak ANCHOR_OFFSET_Y to move anchor up/down)
  const ANCHOR_OFFSET_X = 30;
  const ANCHOR_OFFSET_Y = CB_H - 30;
  const ANCHOR_X = CB_CX - CB_W / 2 + ANCHOR_OFFSET_X;
  const ANCHOR_Y = CB_CY - CB_H / 2 + ANCHOR_OFFSET_Y;
  const PIN1_INIT_X = CB_CX - 10;
  const PIN1_INIT_Y = CB_CY + CB_H / 2 + 80;
  const PIN1_W = 48;
  const PIN1_H = 76;

  const CB_LEFT = CB_CX - CB_W / 2;
  const CB_TOP = CB_CY - CB_H / 2;
  const CB_RIGHT = CB_LEFT + CB_W;
  const CB_BOTTOM = CB_TOP + CB_H;
  const CROSSHAIR_MARGIN = 12;

  const [pin1Pos, setPin1Pos] = useState({ x: PIN1_INIT_X, y: PIN1_INIT_Y });
  const pin1PosRef = useRef({ x: PIN1_INIT_X, y: PIN1_INIT_Y });
  const pinGrabOffsetRef = useRef({ x: 0, y: 0 });
  const [isDraggingPin, setIsDraggingPin] = useState(false);
  const [pinPlaced, setPinPlaced] = useState(false);

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const dragStartAngleRef = useRef(0);
  const lastPointerAngleRef = useRef(0);
  const rotationStartRef = useRef(0);

  const [points, setPoints] = useState({ red: null, purple: null, green: null });
  const [arcAngles, setArcAngles] = useState({ red: [], purple: [], green: [] });
  const [arcBlinking, setArcBlinking] = useState({ red: false, purple: false, green: false });
  const [showRedArc, setShowRedArc] = useState(false);
  const [centreRevealed, setCentreRevealed] = useState(false);
  const [step4ArcAngles, setStep4ArcAngles] = useState([]);
  const step4DragStartedRef = useRef(false);

  const [rotationLeft, setRotationLeft] = useState(0);
  const [rotationRight, setRotationRight] = useState(0);
  const rotationLeftRef = useRef(0);
  const rotationRightRef = useRef(0);
  const [showLeftArrows, setShowLeftArrows] = useState(false);
  const [showRightArrows, setShowRightArrows] = useState(false);
  const [step5ArcAngles, setStep5ArcAngles] = useState({ left: [], right: [] });
  const step5PhaseRef = useRef(step5Phase);

  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const animFrameRef = useRef(null);

  const stepRef = useRef(step);
  const step2PhaseRef = useRef(step2Phase);
  const step3PhaseRef = useRef(step3Phase);
  const step4PhaseRef = useRef(step4Phase);
  const pointsRef = useRef(points);
  const showRedArcRef = useRef(showRedArc);
  stepRef.current = step;
  step2PhaseRef.current = step2Phase;
  step3PhaseRef.current = step3Phase;
  step4PhaseRef.current = step4Phase;
  step5PhaseRef.current = step5Phase;
  pointsRef.current = points;
  showRedArcRef.current = showRedArc;
  rotationLeftRef.current = rotationLeft;
  rotationRightRef.current = rotationRight;

  const [displayedRightText, setDisplayedRightText] = useState(rightText);
  const [rightTextOpacity, setRightTextOpacity] = useState(1);
  const rightTextTimeoutRef = useRef(null);

  useEffect(() => {
    pin1PosRef.current = pin1Pos;
  }, [pin1Pos]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    if (rightText === displayedRightText) return;
    setRightTextOpacity(0);
    if (rightTextTimeoutRef.current) clearTimeout(rightTextTimeoutRef.current);
    rightTextTimeoutRef.current = setTimeout(() => {
      setDisplayedRightText(rightText);
      setRightTextOpacity(1);
    }, 350);
    return () => {
      if (rightTextTimeoutRef.current) clearTimeout(rightTextTimeoutRef.current);
    };
  }, [rightText]);

  useEffect(() => {
    if (step === 1 && step1Phase === "initial") {
      setPin1Pos({ x: PIN1_INIT_X, y: PIN1_INIT_Y });
      setPinPlaced(false);
      setRotation(0);
      rotationRef.current = 0;
      setIsDraggingCard(false);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setPoints({ red: null, purple: null, green: null });
      setArcAngles({ red: [], purple: [], green: [] });
      setArcBlinking({ red: false, purple: false, green: false });
      setShowRedArc(false);
      setCentreRevealed(false);
    }
    if (step === 2 && step2Phase === "initial") {
      setRotation(0);
      rotationRef.current = 0;
      setIsDraggingCard(false);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setPoints({ red: null, purple: null, green: null });
      setArcAngles({ red: [], purple: [], green: [] });
      setArcBlinking({ red: false, purple: false, green: false });
      setShowRedArc(false);
      setCentreRevealed(false);
    }
    if (step === 3 && step3Phase === "initial") {
      setRotation(0);
      rotationRef.current = 0;
      setIsDraggingCard(false);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setArcAngles({ red: [], purple: [], green: [] });
      setArcBlinking({ red: false, purple: false, green: false });
      setCentreRevealed(false);
    }
    if (step === 4 && step4Phase === "initial") {
      setRotation(0);
      rotationRef.current = 0;
      setIsDraggingCard(false);
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setStep4ArcAngles([]);
      setCentreRevealed(true);
      step4DragStartedRef.current = false;
    }
    if (step === 5 && step5Phase === "initial") {
      setRotationLeft(0);
      setRotationRight(0);
      rotationLeftRef.current = 0;
      rotationRightRef.current = 0;
      setShowLeftArrows(false);
      setShowRightArrows(false);
      setStep5ArcAngles({ left: [], right: [] });
      setCentreRevealed(true);
    }
  }, [step, step1Phase, step2Phase, step3Phase, step4Phase, step5Phase]);

  const getSVGPoint = useCallback((e, ref) => {
    const svg = ref && ref.current ? ref.current : svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    const touch = e.touches && e.touches[0]
      ? e.touches[0]
      : e.changedTouches && e.changedTouches[0]
        ? e.changedTouches[0]
        : null;
    pt.x = touch ? touch.clientX : e.clientX;
    pt.y = touch ? touch.clientY : e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  const getAngleFromAnchor = useCallback((svgPoint) => {
    const dx = svgPoint.x - ANCHOR_X;
    const dy = svgPoint.y - ANCHOR_Y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  const isPointOnCardboard = useCallback((pt) => {
    return (
      pt.x >= CB_LEFT &&
      pt.x <= CB_RIGHT &&
      pt.y >= CB_TOP &&
      pt.y <= CB_BOTTOM
    );
  }, []);

  const handlePinDown = useCallback((e) => {
    if (pinPlaced || step1Phase !== "initial") return;
    e.preventDefault();
    e.stopPropagation();
    const pt = getSVGPoint(e);
    const pos = pin1PosRef.current;
    pinGrabOffsetRef.current = { x: pt.x - pos.x, y: pt.y - pos.y };
    setIsDraggingPin(true);
  }, [pinPlaced, step1Phase, getSVGPoint]);

  useEffect(() => {
    if (!isDraggingPin) return;

    const handleMove = (e) => {
      e.preventDefault();
      const pt = getSVGPoint(e);
      const offset = pinGrabOffsetRef.current;
      setPin1Pos({ x: pt.x - offset.x, y: pt.y - offset.y });
    };

    const handleUp = (e) => {
      const pt = getSVGPoint(e);
      setIsDraggingPin(false);
      if (isPointOnCardboard(pt)) {
        setPinPlaced(true);
        onStep1PinPlaced();
      } else {
        setPin1Pos({ x: PIN1_INIT_X, y: PIN1_INIT_Y });
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDraggingPin, getSVGPoint, onStep1PinPlaced, isPointOnCardboard]);

  const animateFullRotation = useCallback(() => {
    setIsAnimating(true);
    isAnimatingRef.current = true;

    const startRot = rotationRef.current;
    let normalizedStart = ((startRot % 360) + 360) % 360;
    if (normalizedStart < 1) normalizedStart = 0;
    const remaining = normalizedStart === 0 ? 360 : 360 - normalizedStart;
    const duration = Math.max(800, (remaining / 360) * 2000);
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const current = startRot + remaining * eased;
      setRotation(current);
      rotationRef.current = current;

      if (stepRef.current === 2 && step2PhaseRef.current === "pointPlaced" && showRedArcRef.current) {
        setArcAngles((prev) => ({ ...prev, red: [...prev.red, current] }));
      }
      if (stepRef.current === 3 && step3PhaseRef.current === "initial") {
        setArcAngles((prev) => {
          const next = { ...prev };
          ["red", "purple", "green"].forEach((color) => {
            if (pointsRef.current[color]) {
              next[color] = [...next[color], current];
            }
          });
          return next;
        });
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setRotation(0);
        rotationRef.current = 0;
        setIsAnimating(false);
        isAnimatingRef.current = false;

        if (stepRef.current === 1) {
          onStep1RotationDone();
        } else if (stepRef.current === 2) {
          onStep2RotationDone();
        } else if (stepRef.current === 3) {
          onStep3RotationDone();
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [onStep1RotationDone, onStep2RotationDone, onStep3RotationDone]);

  const handleCardDown = useCallback((e) => {
    if (isAnimatingRef.current) return;
    if (stepRef.current === 1 && step1Phase !== "pinPlaced") return;
    if (stepRef.current === 2 && step2PhaseRef.current !== "pointPlaced") return;
    if (stepRef.current === 3 && step3PhaseRef.current !== "initial") return;
    if (stepRef.current === 4 && step4PhaseRef.current === "done") return;

    e.preventDefault();
    e.stopPropagation();

    const pt = getSVGPoint(e);
    const angle = getAngleFromAnchor(pt);
    dragStartAngleRef.current = angle;
    lastPointerAngleRef.current = angle;
    rotationStartRef.current = rotationRef.current;
    setIsDraggingCard(true);

    const onMove = (moveE) => {
      moveE.preventDefault();
      const movePt = getSVGPoint(moveE);
      const currentAngle = getAngleFromAnchor(movePt);
      const frameDelta = normalizeAngleDelta(currentAngle - lastPointerAngleRef.current);
      lastPointerAngleRef.current = currentAngle;

      const newRotation = rotationRef.current + frameDelta;
      setRotation(newRotation);
      rotationRef.current = newRotation;

      if (stepRef.current === 2 && step2PhaseRef.current === "pointPlaced") {
        setShowRedArc(true);
        setArcAngles((prev) => {
          if (prev.red.length === 0) {
            return { ...prev, red: [rotationStartRef.current, newRotation] };
          }
          return { ...prev, red: [...prev.red, newRotation] };
        });
      }

      if (stepRef.current === 3 && step3PhaseRef.current === "initial") {
        setArcAngles((prev) => {
          const next = { ...prev };
          ["red", "purple", "green"].forEach((color) => {
            if (!pointsRef.current[color]) return;
            if (next[color].length === 0) {
              next[color] = [rotationStartRef.current, newRotation];
            } else {
              next[color] = [...next[color], newRotation];
            }
          });
          return next;
        });
      }

      if (stepRef.current === 4) {
        if (!step4DragStartedRef.current) {
          step4DragStartedRef.current = true;
          if (typeof onStep4DragStart === "function") onStep4DragStart();
        }
        setStep4ArcAngles((prev) => {
          if (prev.length === 0) {
            return [rotationStartRef.current, newRotation];
          }
          return [...prev, newRotation];
        });
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);

      setIsDraggingCard(false);

      if (stepRef.current === 4) {
        step4DragStartedRef.current = false;
        if (typeof onStep4Drop === "function") onStep4Drop();
        return;
      }

      if (stepRef.current === 2 && step2PhaseRef.current === "pointPlaced") {
        setArcBlinking((prev) => ({ ...prev, red: true }));
      }
      if (stepRef.current === 3 && step3PhaseRef.current === "initial") {
        setArcBlinking({ red: true, purple: true, green: true });
      }

      animateFullRotation();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  }, [step1Phase, getSVGPoint, getAngleFromAnchor, animateFullRotation, onStep4DragStart, onStep4Drop]);

  const handleCardDownStep5 = useCallback((side, e, panelSvgRef) => {
    if (isAnimatingRef.current) return;
    const isLeft = side === "left";
    if (isLeft && step5PhaseRef.current !== "initial") return;
    if (!isLeft && step5PhaseRef.current !== "leftDone") return;

    e.preventDefault();
    e.stopPropagation();

    const pt = getSVGPoint(e, panelSvgRef);
    const angle = getAngleFromAnchor(pt);
    dragStartAngleRef.current = angle;
    lastPointerAngleRef.current = angle;
    rotationStartRef.current = isLeft ? rotationLeftRef.current : rotationRightRef.current;
    if (isLeft) setShowLeftArrows(true);
    else setShowRightArrows(true);
    setIsDraggingCard(true);

    const onMove = (moveE) => {
      moveE.preventDefault();
      const movePt = getSVGPoint(moveE, panelSvgRef);
      const currentAngle = getAngleFromAnchor(movePt);
      let frameDelta = normalizeAngleDelta(currentAngle - lastPointerAngleRef.current);
      lastPointerAngleRef.current = currentAngle;

      if (isLeft) {
        if (frameDelta <= 0) return;
        const newRotation = rotationLeftRef.current + frameDelta;
        setRotationLeft(newRotation);
        rotationLeftRef.current = newRotation;
        setShowLeftArrows(true);
        setStep5ArcAngles((prev) => {
          const angles = prev.left;
          if (angles.length === 0) {
            return { ...prev, left: [rotationStartRef.current, newRotation] };
          }
          return { ...prev, left: [...angles, newRotation] };
        });
      } else {
        if (frameDelta >= 0) return;
        const newRotation = rotationRightRef.current + frameDelta;
        setRotationRight(newRotation);
        rotationRightRef.current = newRotation;
        setShowRightArrows(true);
        setStep5ArcAngles((prev) => {
          const angles = prev.right;
          if (angles.length === 0) {
            return { ...prev, right: [rotationStartRef.current, newRotation] };
          }
          return { ...prev, right: [...angles, newRotation] };
        });
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      setIsDraggingCard(false);
      if (isLeft && typeof onStep5LeftDone === "function") onStep5LeftDone();
      if (!isLeft && typeof onStep5RightDone === "function") onStep5RightDone();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  }, [getSVGPoint, getAngleFromAnchor, onStep5LeftDone, onStep5RightDone]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleCardClick = useCallback((e) => {
    if (isAnimatingRef.current) return;
    const pt = getSVGPoint(e);
    if (!isPointOnCardboard(pt)) return;

    const rel = { relX: pt.x - CB_LEFT, relY: pt.y - CB_TOP };

    if (stepRef.current === 2 && step2PhaseRef.current === "initial") {
      setPoints((prev) => ({ ...prev, red: rel }));
      onStep2PointPlaced();
      return;
    }
    if (stepRef.current === 2 && step2PhaseRef.current === "done") {
      setPoints((prev) => ({ ...prev, purple: rel }));
      setShowRedArc(false);
      setArcAngles((prev) => ({ ...prev, red: [] }));
      setArcBlinking((prev) => ({ ...prev, red: false }));
      onStep2PurplePlaced();
      return;
    }
    if (stepRef.current === 2 && step2PhaseRef.current === "purplePlaced") {
      setPoints((prev) => ({ ...prev, green: rel }));
      onStep2GreenPlaced();
    }
  }, [
    getSVGPoint,
    isPointOnCardboard,
    onStep2PointPlaced,
    onStep2PurplePlaced,
    onStep2GreenPlaced,
  ]);

  const handlePin2Click = useCallback((e) => {
    if (stepRef.current !== 3 || step3PhaseRef.current !== "done") return;
    if (centreRevealed) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof playSound === "function") playSound("click");
    setArcBlinking({ red: false, purple: false, green: false });
    setCentreRevealed(true);
    onStep3CentreTapped();
  }, [centreRevealed, onStep3CentreTapped]);

  const getArcPath = useCallback((pointRel, angles) => {
    if (!pointRel || angles.length < 2) return "";

    const absX = CB_LEFT + pointRel.relX;
    const absY = CB_TOP + pointRel.relY;
    const dx = absX - ANCHOR_X;
    const dy = absY - ANCHOR_Y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);
    const sampleStep = Math.max(1, Math.floor(angles.length / 150));
    let pathD = "";

    for (let i = 0; i < angles.length; i += sampleStep) {
      const angleRad = baseAngle + (angles[i] * Math.PI) / 180;
      const px = ANCHOR_X + radius * Math.cos(angleRad);
      const py = ANCHOR_Y + radius * Math.sin(angleRad);
      pathD += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
    }

    const lastAngle = angles[angles.length - 1];
    const lastRad = baseAngle + (lastAngle * Math.PI) / 180;
    pathD += ` L ${ANCHOR_X + radius * Math.cos(lastRad)} ${ANCHOR_Y + radius * Math.sin(lastRad)}`;

    return pathD;
  }, []);

  const getRedPointWorld = useCallback((rotDeg) => {
    const pt = points.red;
    if (!pt) return null;
    const absX = CB_LEFT + pt.relX;
    const absY = CB_TOP + pt.relY;
    const rad = (rotDeg * Math.PI) / 180;
    const dx = absX - ANCHOR_X;
    const dy = absY - ANCHOR_Y;
    return {
      x: ANCHOR_X + dx * Math.cos(rad) - dy * Math.sin(rad),
      y: ANCHOR_Y + dx * Math.sin(rad) + dy * Math.cos(rad),
    };
  }, [points.red]);

  const getRedBaseAngle = useCallback(() => {
    const pt = points.red;
    if (!pt) return 0;
    const absX = CB_LEFT + pt.relX;
    const absY = CB_TOP + pt.relY;
    return Math.atan2(absY - ANCHOR_Y, absX - ANCHOR_X);
  }, [points.red]);

  const renderAngleOverlay = useCallback((panelRotation, showArrows) => {
    if (!showArrows || !points.red) return null;

    const baseAngle = getRedBaseAngle();
    const initialPos = getRedPointWorld(0);
    const currentPos = getRedPointWorld(panelRotation);
    if (!initialPos || !currentPos) return null;

    const sectorPath = describeSector(ANCHOR_X, ANCHOR_Y, SECTOR_RADIUS, baseAngle, panelRotation);
    const items = [];

    if (sectorPath && Math.abs(panelRotation) > 0.5) {
      items.push(
        React.createElement("path", {
          key: "angle-sector",
          d: sectorPath,
          fill: SECTOR_FILL,
          stroke: SECTOR_STROKE,
          strokeWidth: 1.5,
        })
      );
    }

    items.push(
      renderArrow(ANCHOR_X, ANCHOR_Y, initialPos.x, initialPos.y, ARROW_COLOR, {
        key: "ghost-arrow",
        opacity: 0.75,
      })
    );

    items.push(
      renderArrow(ANCHOR_X, ANCHOR_Y, currentPos.x, currentPos.y, ARROW_COLOR, {
        key: "live-arrow",
      })
    );

    return React.createElement("g", { key: "angle-overlay" }, items);
  }, [points.red, getRedBaseAngle, getRedPointWorld]);

  const renderStep4Overlay = () => {
    if (step !== 4 || !points.red) return null;

    const items = [];
    const overlay = renderAngleOverlay(rotation, true);
    if (overlay) items.push(overlay);

    if (step4ArcAngles.length > 1) {
      const arcPath = getArcPath(points.red, step4ArcAngles);
      if (arcPath) {
        items.push(
          React.createElement("path", {
            key: "step4-red-arc",
            d: arcPath,
            fill: "none",
            stroke: "#e53935",
            strokeWidth: 2.5,
            strokeDasharray: "6 4",
            strokeLinecap: "round",
          })
        );
      }
    }

    return items.length ? React.createElement("g", { key: "step4-overlay" }, items) : null;
  };

  const renderStep5PanelSVG = (side, panelSvgRef) => {
    const isLeft = side === "left";
    const panelRotation = isLeft ? rotationLeft : rotationRight;
    const canDrag = isLeft ? step5Phase === "initial" : step5Phase === "leftDone";
    const showClock = isLeft ? step5Phase !== "initial" : step5Phase === "done";
    const showArrows = isLeft ? showLeftArrows : showRightArrows;
    const cardboardTransform = `rotate(${panelRotation} ${ANCHOR_X} ${ANCHOR_Y})`;
    const elements = [];

    if (showClock) {
      elements.push(
        React.createElement("image", {
          key: "clock",
          href: "assets/clock.gif",
          x: ANCHOR_X - CLOCK_SIZE / 2,
          y: ANCHOR_Y - CLOCK_SIZE / 2,
          width: CLOCK_SIZE,
          height: CLOCK_SIZE,
          opacity: 0.4,
        })
      );
    }

    const cardboardElements = [
      React.createElement("image", {
        key: "cardboard",
        href: "assets/cardboard.png",
        x: CB_LEFT,
        y: CB_TOP,
        width: CB_W,
        height: CB_H,
        style: { cursor: canDrag ? "grab" : "default" },
      }),
    ];

    if (points.red) {
      cardboardElements.push(
        React.createElement("circle", {
          key: "red-point",
          cx: CB_LEFT + points.red.relX,
          cy: CB_TOP + points.red.relY,
          r: 6,
          fill: "#e53935",
          stroke: "#ffffff",
          strokeWidth: 2,
        })
      );
    }

    cardboardElements.push(
      React.createElement("rect", {
        key: "overlay",
        x: CB_LEFT,
        y: CB_TOP,
        width: CB_W,
        height: CB_H,
        fill: "transparent",
        style: { cursor: canDrag ? "grab" : "default" },
        onMouseDown: canDrag
          ? (e) => handleCardDownStep5(side, e, panelSvgRef)
          : undefined,
        onTouchStart: canDrag
          ? (e) => handleCardDownStep5(side, e, panelSvgRef)
          : undefined,
      })
    );

    elements.push(
      React.createElement(
        "g",
        { key: "cb-group", transform: cardboardTransform },
        cardboardElements
      )
    );

    const crosshairs = renderCrosshairs();
    if (crosshairs) elements.push(crosshairs);

    const panelArcAngles = isLeft ? step5ArcAngles.left : step5ArcAngles.right;
    if (panelArcAngles.length > 1 && points.red) {
      const arcPath = getArcPath(points.red, panelArcAngles);
      if (arcPath) {
        elements.push(
          React.createElement("path", {
            key: "step5-arc",
            d: arcPath,
            fill: "none",
            stroke: ARROW_COLOR,
            strokeWidth: 2.5,
            strokeDasharray: "6 4",
            strokeLinecap: "round",
          })
        );
      }
    }

    const angleOverlay = renderAngleOverlay(panelRotation, showArrows);
    if (angleOverlay) elements.push(angleOverlay);

    elements.push(
      React.createElement("circle", {
        key: "centre-point",
        cx: ANCHOR_X,
        cy: ANCHOR_Y,
        r: 8,
        fill: "#ffd700",
        stroke: "#ffffff",
        strokeWidth: 2,
      })
    );

    return elements;
  };

  const renderCrosshairs = () => {
    if (!(pinPlaced || step >= 2)) return null;

    return React.createElement(
      "g",
      { key: "crosshairs", className: "crosshair-lines deemphasizable" },
      React.createElement("line", {
        key: "cross-h",
        x1: CB_LEFT - CROSSHAIR_MARGIN,
        y1: ANCHOR_Y,
        x2: CB_RIGHT + CROSSHAIR_MARGIN,
        y2: ANCHOR_Y,
        stroke: "#ff9800",
        strokeWidth: 1.2,
        strokeDasharray: "4 3",
      }),
      React.createElement("line", {
        key: "cross-v",
        x1: ANCHOR_X,
        y1: CB_TOP - CROSSHAIR_MARGIN,
        x2: ANCHOR_X,
        y2: CB_BOTTOM + CROSSHAIR_MARGIN,
        stroke: "#ff9800",
        strokeWidth: 1.2,
        strokeDasharray: "4 3",
      })
    );
  };

  const renderMarkedPoints = () => {
    const items = [];
    const colors =
      step === 4 ? ["red"] : ["red", "purple", "green"];
    colors.forEach((color) => {
      const pt = points[color];
      if (!pt) return;
      const style = POINT_STYLES[color];
      const blink =
        color === "red" && step === 2 && step2Phase === "pointPlaced";
      items.push(
        React.createElement("circle", {
          key: "point-" + color,
          className: blink ? "marked-point-circle" : undefined,
          cx: CB_LEFT + pt.relX,
          cy: CB_TOP + pt.relY,
          r: 6,
          fill: style.fill,
          stroke: style.stroke,
          strokeWidth: 2,
        })
      );
    });
    return items;
  };

  const renderArcs = () => {
    if (step === 4) return [];
    const arcs = [];
    ["red", "purple", "green"].forEach((color) => {
      const pt = points[color];
      const angles = arcAngles[color];
      if (!pt || angles.length < 2) return;

      if (color === "red" && step === 2 && !showRedArc) return;

      const pathD = getArcPath(pt, angles);
      if (!pathD) return;

      arcs.push(
        React.createElement("path", {
          key: "arc-" + color,
          className: [
            "deemphasizable",
            arcBlinking[color] && !centreRevealed ? "arc-trace-blink" : "",
          ]
            .filter(Boolean)
            .join(" ") || undefined,
          d: pathD,
          fill: "none",
          stroke: POINT_STYLES[color].arc,
          strokeWidth: 2.5,
          strokeDasharray: "6 4",
          strokeLinecap: "round",
        })
      );
    });
    return arcs;
  };

  const renderSVG = () => {
    const elements = [];
    const cardboardTransform = `rotate(${rotation} ${ANCHOR_X} ${ANCHOR_Y})`;
    const deemphasized = centreRevealed && step < 4;

    const canDrag =
      (step === 1 && step1Phase === "pinPlaced") ||
      (step === 2 && step2Phase === "pointPlaced") ||
      (step === 3 && step3Phase === "initial") ||
      (step === 4 && step4Phase !== "done");
    const canClick =
      (step === 2 && (step2Phase === "initial" || step2Phase === "done" || step2Phase === "purplePlaced"));
    const cursor = canDrag ? "grab" : canClick ? "crosshair" : "default";

    const cardboardElements = [
      React.createElement("image", {
        key: "cardboard",
        href: "assets/cardboard.png",
        x: CB_LEFT,
        y: CB_TOP,
        width: CB_W,
        height: CB_H,
        style: { cursor },
      }),
      ...renderMarkedPoints(),
      React.createElement("rect", {
        key: "overlay",
        x: CB_LEFT,
        y: CB_TOP,
        width: CB_W,
        height: CB_H,
        fill: "transparent",
        style: { cursor },
        onMouseDown: canDrag ? handleCardDown : undefined,
        onTouchStart: canDrag ? handleCardDown : undefined,
        onClick: canClick ? handleCardClick : undefined,
      }),
    ];

    elements.push(
      React.createElement(
        "g",
        {
          key: "cb-group",
          className: deemphasized ? "deemphasizable" : undefined,
          transform: cardboardTransform,
        },
        cardboardElements
      )
    );

    const arcEls = renderArcs();
    if (arcEls.length) {
      elements.push(
        React.createElement("g", { key: "arcs-group", className: deemphasized ? "deemphasizable" : undefined }, arcEls)
      );
    }

    const step4Overlay = renderStep4Overlay();
    if (step4Overlay) elements.push(step4Overlay);

    const crosshairs = renderCrosshairs();
    if (crosshairs) {
      elements.push(
        React.createElement(
          "g",
          { key: "crosshairs-wrap", className: deemphasized ? "deemphasizable" : undefined },
          crosshairs
        )
      );
    }

    if ((pinPlaced || step >= 2) && !centreRevealed) {
      elements.push(
        React.createElement("image", {
          key: "pin2",
          id: step === 3 && step3Phase === "done" ? "pin2-tap" : undefined,
          className: deemphasized ? "deemphasizable" : undefined,
          href: "assets/pin2.png",
          x: ANCHOR_X - 10,
          y: ANCHOR_Y - 10,
          width: 20,
          height: 20,
          style: {
            cursor: step === 3 && step3Phase === "done" ? "pointer" : "default",
          },
          onClick: step === 3 && step3Phase === "done" ? handlePin2Click : undefined,
          onTouchEnd: step === 3 && step3Phase === "done" ? handlePin2Click : undefined,
        })
      );
    }

    if (centreRevealed || step >= 4) {
      const centreBlink = centreRevealed && step < 4;
      elements.push(
        React.createElement("circle", {
          key: "centre-point",
          className: centreBlink ? "centre-point-blink" : undefined,
          cx: ANCHOR_X,
          cy: ANCHOR_Y,
          r: 8,
          fill: "#ffd700",
          stroke: "#ffffff",
          strokeWidth: 2,
        })
      );
    }

    if (step === 1 && !pinPlaced) {
      elements.push(
        React.createElement("image", {
          key: "pin1",
          href: "assets/pin1.png",
          x: pin1Pos.x - PIN1_W / 2,
          y: pin1Pos.y - PIN1_H,
          width: PIN1_W,
          height: PIN1_H,
          style: { cursor: "grab" },
          onMouseDown: handlePinDown,
          onTouchStart: handlePinDown,
        })
      );
    }

    return elements;
  };

  if (step === 5) {
    const step5Data = APP_DATA.steps[5];
    return React.createElement(
      "div",
      { className: "main-canvas-container step5-layout" },
      React.createElement("div", {
        id: "page-5-title",
        className: "page-5-title",
        dangerouslySetInnerHTML: { __html: step5Data.pageTitle },
      }),
      React.createElement(
        "div",
        { className: "step5-panels" },
        React.createElement(
          "div",
          { className: "step5-panel step5-panel-left" },
          React.createElement(
            "svg",
            {
              ref: svgLeftRef,
              className: "canvas-svg",
              viewBox: `0 40 ${VB_W} ${VB_H}`,
              preserveAspectRatio: "xMidYMid meet",
            },
            renderStep5PanelSVG("left", svgLeftRef)
          ),
          step5Phase !== "initial" &&
            React.createElement("div", {
              className: "step5-footer step5-footer-left",
              dangerouslySetInnerHTML: { __html: step5Data.footerClockwise },
            })
        ),
        React.createElement(
          "div",
          { className: "step5-panel step5-panel-right" },
          React.createElement(
            "svg",
            {
              ref: svgRightRef,
              className: "canvas-svg",
              viewBox: `0 40 ${VB_W} ${VB_H}`,
              preserveAspectRatio: "xMidYMid meet",
            },
            renderStep5PanelSVG("right", svgRightRef)
          ),
          step5Phase === "done" &&
            React.createElement("div", {
              className: "step5-footer step5-footer-right",
              dangerouslySetInnerHTML: { __html: step5Data.footerAnticlockwise },
            })
        )
      )
    );
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-canvas-left" },
      React.createElement(
        "svg",
        {
          ref: svgRef,
          className: "canvas-svg" + (centreRevealed && step < 4 ? " svg-deemphasized" : ""),
          viewBox: `0 40 ${VB_W} ${VB_H}`,
          preserveAspectRatio: "xMidYMid meet",
        },
        renderSVG()
      )
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right" },
      React.createElement("div", {
        className: "right-panel-text",
        style: { opacity: rightTextOpacity, transition: "opacity 0.35s ease" },
        dangerouslySetInnerHTML: { __html: displayedRightText },
      })
    )
  );
};
