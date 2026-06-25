const MainCanvas = (props) => {
  const { step, onStepChange, onUpdateNavText } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const VB_W = 1000;
  const VB_H = 562;
  const CENTER_CARD_W = VB_W * 0.2;
  const CENTER_CARD_H = CENTER_CARD_W;
  const BIG_CARD_W = VB_W * 0.35;
  const BIG_CARD_H = VB_H * 0.45;
  const CARD_RX = 14;

  // Card positions in SVG viewBox coords (origin top-left, size 1000 × 562).
  // Each entry is the CENTER (x, y) of that card — not its top-left corner.
  //
  // How to tweak big-card positions:
  // • Move left column outward  → decrease x on translation & bottomLeft
  // • Move right column outward → increase x on reflection & bottomRight
  // • Move top row up/down       → change y on translation & reflection
  // • Move bottom row up/down    → change y on bottomLeft & bottomRight
  //
  // Avoid overlapping the center card:
  //   left card:  x ≤ 500 − CENTER_CARD_W/2 − gap − BIG_CARD_W/2  (≈ 205 with 20px gap)
  //   right card: x ≥ 500 + CENTER_CARD_W/2 + gap + BIG_CARD_W/2  (≈ 795 with 20px gap)
  //   left/right edge: x ± BIG_CARD_W/2 should stay inside 0 … 1000
  const CARD_GAP_FROM_CENTER = 22;

  const CENTER_X = VB_W / 2;
  const CENTER_Y = VB_H / 2;
  const LEFT_BIG_X =
    CENTER_X - CENTER_CARD_W / 2 - CARD_GAP_FROM_CENTER - BIG_CARD_W / 2;
  const RIGHT_BIG_X =
    CENTER_X + CENTER_CARD_W / 2 + CARD_GAP_FROM_CENTER + BIG_CARD_W / 2;

  const CARD_CENTERS = {
    center: { x: CENTER_X, y: CENTER_Y },
    translation: { x: LEFT_BIG_X, y: 150 },
    reflection: { x: RIGHT_BIG_X, y: 150 },
    bottomLeft: { x: LEFT_BIG_X, y: 412 },
    bottomRight: { x: RIGHT_BIG_X, y: 412 },
  };

  const BIG_CARD_KEYS = ["translation", "reflection", "bottomLeft", "bottomRight"];

  const COLORS = {
    card: "#1c3358",
    cardStroke: "#2a4a75",
    highlight: "#f5c542",
    triBlue: "#6ecfff",
    triGreen: "#8ef58e",
    axisPurple: "#c77dff",
    redStroke: "#ff4444",
    heading: "#f5c542",
    instructionBg: "rgba(28, 51, 88, 0.92)",
    instructionText: "#f5c542",
  };

  const TRI_LEG = CENTER_CARD_W * 0.42 * 1.2;
  const CARD_PAD_X = 0.11;
  const CARD_PAD_Y = 0.11;
  const HEADING_PAD_TOP = 0.2;
  const CONTENT_TOP = 0.28;
  const DILATION_SCALE = 1.25;
  const ROTATION_DEGREES = 60;
  const PIVOT_R = 5;

  const [bigCardsVisible, setBigCardsVisible] = useState(false);
  const [cloneProgress, setCloneProgress] = useState(0);
  const [bigTrianglesVisible, setBigTrianglesVisible] = useState(false);
  const [translationDone, setTranslationDone] = useState(false);
  const [reflectionDone, setReflectionDone] = useState(false);
  const [rotationDone, setRotationDone] = useState(false);
  const [dilationDone, setDilationDone] = useState(false);

  const [transBlueT, setTransBlueT] = useState(0);
  const [transGreenT, setTransGreenT] = useState(0);
  const [transHeadingT, setTransHeadingT] = useState(0);

  const [reflBlueT, setReflBlueT] = useState(0);
  const [reflGreenT, setReflGreenT] = useState(0);
  const [reflAxisT, setReflAxisT] = useState(0);
  const [reflHeadingT, setReflHeadingT] = useState(0);

  const [rotBlueT, setRotBlueT] = useState(0);
  const [rotGreenVisible, setRotGreenVisible] = useState(false);
  const [rotPivotT, setRotPivotT] = useState(0);
  const [rotGreenRotT, setRotGreenRotT] = useState(0);
  const [rotHeadingT, setRotHeadingT] = useState(0);

  const [dilBlueT, setDilBlueT] = useState(0);
  const [dilGreenVisible, setDilGreenVisible] = useState(false);
  const [dilPivotT, setDilPivotT] = useState(0);
  const [dilScaleT, setDilScaleT] = useState(0);
  const [dilHeadingT, setDilHeadingT] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [bigCardsOpacity, setBigCardsOpacity] = useState(0);
  const [instructionPhase, setInstructionPhase] = useState("hidden");

  const [exploredCardKeys, setExploredCardKeys] = useState([]);
  const [rigidOverlayItems, setRigidOverlayItems] = useState([]);
  const [nonRigidOverlayItems, setNonRigidOverlayItems] = useState([]);
  const [compareKey, setCompareKey] = useState(null);
  const [compareMoveT, setCompareMoveT] = useState(0);
  const [compareSourcePts, setCompareSourcePts] = useState(null);
  const [compareTargetPts, setCompareTargetPts] = useState(null);
  const [showRedStroke, setShowRedStroke] = useState(false);
  const [redScaleT, setRedScaleT] = useState(0);
  const [showCompareText, setShowCompareText] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpKey, setOverlayOpKey] = useState(null);
  const [overlayMode, setOverlayMode] = useState("standard");
  const [summaryPhase, setSummaryPhase] = useState(null);
  const [showOverlayHeading, setShowOverlayHeading] = useState(true);
  const [leftHeaderRevealed, setLeftHeaderRevealed] = useState(false);
  const [rightHeaderRevealed, setRightHeaderRevealed] = useState(false);
  const overlayFinalRef = useRef(false);
  const overlayOpKeyRef = useRef(null);
  const finalAnimDoneRef = useRef(false);

  const canvasContainerRef = useRef(null);
  const triNudgeAnchorRef = useRef(null);
  const greenNudgeTranslationRef = useRef(null);
  const greenNudgeReflectionRef = useRef(null);
  const greenNudgeBottomRightRef = useRef(null);
  const greenNudgeBottomLeftRef = useRef(null);

  const greenNudgeRefs = {
    translation: greenNudgeTranslationRef,
    reflection: greenNudgeReflectionRef,
    bottomRight: greenNudgeBottomRightRef,
    bottomLeft: greenNudgeBottomLeftRef,
  };

  const [triNudgeDismissed, setTriNudgeDismissed] = useState(false);
  const [greenNudgesDismissed, setGreenNudgesDismissed] = useState(false);

  const gsapTweenRef = useRef(null);

  const killTween = () => {
    if (gsapTweenRef.current) {
      gsapTweenRef.current.kill();
      gsapTweenRef.current = null;
    }
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpPt = (p1, p2, t) => ({
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
  });

  const getCardRect = (cx, cy, w, h) => ({
    x: cx - w / 2,
    y: cy - h / 2,
    width: w,
    height: h,
  });

  const getTriOriginCentered = (cx, cy, leg) => ({
    x: cx - leg / 2,
    y: cy + leg / 2,
  });

  const getTriOriginBottom = (cx, cy, w, h, leg, side) => {
    const rect = getCardRect(cx, cy, w, h);
    const padX = w * CARD_PAD_X;
    const padY = h * CARD_PAD_Y;
    if (side === "left") {
      return { x: rect.x + padX, y: rect.y + rect.height - padY };
    }
    if (side === "right") {
      return { x: rect.x + rect.width - padX - leg, y: rect.y + rect.height - padY };
    }
    return {
      x: rect.x + (rect.width - leg) / 2,
      y: rect.y + rect.height - padY,
    };
  };

  const getReflBlueOrigin = (cx, cy, w, h, leg) => {
    const rect = getCardRect(cx, cy, w, h);
    const padY = h * CARD_PAD_Y;
    return { x: cx - leg, y: rect.y + rect.height - padY };
  };

  const getReflAxisX = (blueOrigin, leg) => blueOrigin.x + leg;

  const getRotBlueOrigin = (cx, cy, w, h, leg) => {
    const rect = getCardRect(cx, cy, w, h);
    const padY = h * CARD_PAD_Y;
    return { x: cx - leg / 2, y: rect.y + rect.height - padY };
  };

  const getTopVertex = (ox, oy, leg) => ({ x: ox, y: oy - leg });

  const getDilBlueOrigin = (cx, cy, w, h, leg) => {
    const rect = getCardRect(cx, cy, w, h);
    const padY = h * CARD_PAD_Y;
    const scaledWidth = leg * DILATION_SCALE;
    return {
      x: cx - scaledWidth / 2,
      y: rect.y + rect.height - padY,
    };
  };

  const rotatePtCcw = (p, pivot, degrees) => {
    const rad = (degrees * Math.PI) / 180;
    const dx = p.x - pivot.x;
    const dy = p.y - pivot.y;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: pivot.x + dx * cos + dy * sin,
      y: pivot.y - dx * sin + dy * cos,
    };
  };

  const rotateTriPointsCcw = (ox, oy, leg, pivot, t) => {
    const pts = triPoints(ox, oy, leg);
    const angle = ROTATION_DEGREES * t;
    return pts.map((p) => rotatePtCcw(p, pivot, angle));
  };

  const scaleTriPoints = (ox, oy, leg, anchor, scale) => {
    return triPoints(ox, oy, leg).map((p) => ({
      x: anchor.x + scale * (p.x - anchor.x),
      y: anchor.y + scale * (p.y - anchor.y),
    }));
  };

  const triPoints = (ox, oy, leg) => [
    { x: ox, y: oy },
    { x: ox + leg, y: oy },
    { x: ox, y: oy - leg },
  ];

  const triPointsStr = (ox, oy, leg) =>
    triPoints(ox, oy, leg)
      .map((p) => p.x + "," + p.y)
      .join(" ");

  const getTriCentroid = (ox, oy, leg) => ({
    x: ox + leg / 3,
    y: oy - leg / 3,
  });

  const getPointsCentroid = (pts) => ({
    x: (pts[0].x + pts[1].x + pts[2].x) / 3,
    y: (pts[0].y + pts[1].y + pts[2].y) / 3,
  });

  const getNudgeAnchorStyle = (point) => ({
    position: "absolute",
    left: (point.x / VB_W) * 100 + "%",
    top: (point.y / VB_H) * 100 + "%",
    width: 0,
    height: 0,
    pointerEvents: "none",
  });

  const getActiveTriangleNudgePoint = () => {
    if (step === 1 && !bigCardsVisible) {
      const origin = getTriOriginCentered(CENTER_X, CENTER_Y, TRI_LEG);
      return getTriCentroid(origin.x, origin.y, TRI_LEG);
    }
    if (step === 2 && bigTrianglesVisible && !translationDone) {
      const cx = CARD_CENTERS.translation.x;
      const cy = CARD_CENTERS.translation.y;
      const origin = getTriOriginCentered(cx, cy, TRI_LEG);
      return getTriCentroid(origin.x, origin.y, TRI_LEG);
    }
    if (step === 3 && bigTrianglesVisible && !reflectionDone) {
      const cx = CARD_CENTERS.reflection.x;
      const cy = CARD_CENTERS.reflection.y;
      const origin = getTriOriginCentered(cx, cy, TRI_LEG);
      return getTriCentroid(origin.x, origin.y, TRI_LEG);
    }
    if (step === 4 && bigTrianglesVisible && !rotationDone) {
      const cx = CARD_CENTERS.bottomRight.x;
      const cy = CARD_CENTERS.bottomRight.y;
      const origin = getTriOriginCentered(cx, cy, TRI_LEG);
      return getTriCentroid(origin.x, origin.y, TRI_LEG);
    }
    if (step === 5 && bigTrianglesVisible && !dilationDone) {
      const cx = CARD_CENTERS.bottomLeft.x;
      const cy = CARD_CENTERS.bottomLeft.y;
      const origin = getTriOriginCentered(cx, cy, TRI_LEG);
      return getTriCentroid(origin.x, origin.y, TRI_LEG);
    }
    return null;
  };

  const dismissTriNudge = () => setTriNudgeDismissed(true);
  const dismissGreenNudges = () => setGreenNudgesDismissed(true);

  const showTriNudge =
    !triNudgeDismissed &&
    !isAnimating &&
    step >= 1 &&
    step <= 5 &&
    !!getActiveTriangleNudgePoint();

  const showGreenNudges =
    step === 6 &&
    !greenNudgesDismissed &&
    !compareKey &&
    !isAnimating &&
    !overlayVisible;

  const reflectTriPointsHoriz = (ox, oy, leg, axisX) => {
    return triPoints(ox, oy, leg).map((p) => ({
      x: 2 * axisX - p.x,
      y: p.y,
    }));
  };

  const reflectPointsStr = (pts) =>
    pts.map((p) => p.x + "," + p.y).join(" ");

  const isCardDimmed = (key) => {
    if (step === 6) return false;
    if (step < 2 || step > 5) return false;
    if (key === "center") return true;
    if (step === 2 && key !== "translation") return true;
    if (step === 3 && key !== "reflection") return true;
    if (step === 4 && key !== "bottomRight") return true;
    if (step === 5 && key !== "bottomLeft") return true;
    return false;
  };

  const isCardHighlighted = (key) => {
    if (step === 6) return false;
    if (step === 2 && key === "translation" && !translationDone) return true;
    if (step === 3 && key === "reflection" && !reflectionDone) return true;
    if (step === 4 && key === "bottomRight" && !rotationDone) return true;
    if (step === 5 && key === "bottomLeft" && !dilationDone) return true;
    return false;
  };

  const isRigidCard = (key) => key !== "bottomLeft";

  const getCenterBlueOrigin = () =>
    getTriOriginCentered(CENTER_X, CENTER_Y, TRI_LEG);

  const getOpLabel = (key) => {
    if (key === "translation") return APP_DATA.steps[2].translationHeading;
    if (key === "reflection") return APP_DATA.steps[3].reflectionHeading;
    if (key === "bottomRight") return APP_DATA.steps[4].rotationHeading;
    if (key === "bottomLeft") return APP_DATA.steps[5].dilationHeading;
    return "";
  };

  const getGreenPointsForCard = (key) => {
    const cx = CARD_CENTERS[key].x;
    const cy = CARD_CENTERS[key].y;

    if (key === "translation") {
      const g = getTriOriginBottom(
        cx,
        cy,
        BIG_CARD_W,
        BIG_CARD_H,
        TRI_LEG,
        "right"
      );
      return triPoints(g.x, g.y, TRI_LEG);
    }
    if (key === "reflection") {
      const blue = getReflBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);
      const axisX = getReflAxisX(blue, TRI_LEG);
      return reflectTriPointsHoriz(blue.x, blue.y, TRI_LEG, axisX);
    }
    if (key === "bottomRight") {
      const blue = getRotBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);
      const pivot = getTopVertex(blue.x, blue.y, TRI_LEG);
      return rotateTriPointsCcw(blue.x, blue.y, TRI_LEG, pivot, 1);
    }
    if (key === "bottomLeft") {
      const blue = getDilBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);
      const anchor = { x: blue.x, y: blue.y };
      return scaleTriPoints(blue.x, blue.y, TRI_LEG, anchor, DILATION_SCALE);
    }
    return triPoints(0, 0, TRI_LEG);
  };

  const getCompareTargetPoints = (key) => {
    const co = getCenterBlueOrigin();
    if (isRigidCard(key)) {
      return triPoints(co.x, co.y, TRI_LEG);
    }
    const anchor = { x: co.x, y: co.y };
    return scaleTriPoints(co.x, co.y, TRI_LEG, anchor, DILATION_SCALE);
  };

  const lerpPoints = (a, b, t) =>
    a.map((p, i) => ({
      x: lerp(p.x, b[i].x, t),
      y: lerp(p.y, b[i].y, t),
    }));

  const getHeadingY = (cardRect) =>
    cardRect.y + BIG_CARD_H * HEADING_PAD_TOP;

  const setAnimating = (val) => {
    setIsAnimating(val);
    if (val) onUpdateNavText(" ");
  };

  const runTween = (proxy, to, duration, ease, onUpdate, onComplete) => {
    killTween();
    gsapTweenRef.current = gsap.to(proxy, {
      ...to,
      duration: duration,
      ease: ease || "power2.inOut",
      onUpdate: onUpdate,
      onComplete: onComplete,
    });
  };

  const handleCenterTap = () => {
    if (step !== 1 || bigCardsVisible || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    dismissTriNudge();

    setInstructionPhase("leaving");
    setBigCardsVisible(true);
    setBigCardsOpacity(0);
    setAnimating(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setBigCardsOpacity(1));
    });

    const proxy = { t: 0 };
    runTween(
      proxy,
      { t: 1 },
      1.0,
      "power2.inOut",
      () => setCloneProgress(proxy.t),
      () => {
        setBigTrianglesVisible(true);
        setCloneProgress(1);
        setAnimating(false);
        gsap.delayedCall(1, () => onStepChange(2));
      }
    );
  };

  const handleTranslationTap = () => {
    if (step !== 2 || translationDone || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    dismissTriNudge();

    setAnimating(true);

    const cx = CARD_CENTERS.translation.x;
    const cy = CARD_CENTERS.translation.y;

    const blueProxy = { t: 0 };
    runTween(
      blueProxy,
      { t: 1 },
      0.5,
      "power2.inOut",
      () => setTransBlueT(blueProxy.t),
      () => {
        gsap.delayedCall(0.2, () => {
          const greenProxy = { t: 0 };
          runTween(
            greenProxy,
            { t: 1 },
            0.6,
            "power2.inOut",
            () => setTransGreenT(greenProxy.t),
            () => {
              const headProxy = { t: 0 };
              runTween(
                headProxy,
                { t: 1 },
                0.3,
                "power1.out",
                () => setTransHeadingT(headProxy.t),
                () => {
                  setTranslationDone(true);
                  setAnimating(false);
                  gsap.delayedCall(1, () => onStepChange(3));
                }
              );
            }
          );
        });
      }
    );
  };

  const handleReflectionTap = () => {
    if (step !== 3 || reflectionDone || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    dismissTriNudge();

    setAnimating(true);

    const cx = CARD_CENTERS.reflection.x;
    const cy = CARD_CENTERS.reflection.y;
    const blueEnd = getReflBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);

    const blueProxy = { t: 0 };
    runTween(
      blueProxy,
      { t: 1 },
      0.5,
      "power2.inOut",
      () => setReflBlueT(blueProxy.t),
      () => {
        setReflGreenT(0.001);
        const greenProxy = { t: 0 };
        runTween(
          greenProxy,
          { t: 1 },
          0.7,
          "power2.inOut",
          () => {
            setReflGreenT(greenProxy.t);
            setReflAxisT(Math.min(1, greenProxy.t * 1.4));
          },
          () => {
            setReflAxisT(1);
            const headProxy = { t: 0 };
            runTween(
              headProxy,
              { t: 1 },
              0.3,
              "power1.out",
              () => setReflHeadingT(headProxy.t),
              () => {
                setReflectionDone(true);
                setAnimating(false);
                gsap.delayedCall(1, () => onStepChange(4));
              }
            );
          }
        );
      }
    );
  };

  const handleRotationTap = () => {
    if (step !== 4 || rotationDone || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    dismissTriNudge();

    setAnimating(true);

    const blueProxy = { t: 0 };
    runTween(
      blueProxy,
      { t: 1 },
      0.5,
      "power2.inOut",
      () => setRotBlueT(blueProxy.t),
      () => {
        setRotGreenVisible(true);
        gsap.delayedCall(0.15, () => {
          const pivotProxy = { t: 0 };
          runTween(
            pivotProxy,
            { t: 1 },
            0.25,
            "power1.out",
            () => setRotPivotT(pivotProxy.t),
            () => {
              const rotProxy = { t: 0 };
              runTween(
                rotProxy,
                { t: 1 },
                0.75,
                "power2.inOut",
                () => setRotGreenRotT(rotProxy.t),
                () => {
                  const headProxy = { t: 0 };
                  runTween(
                    headProxy,
                    { t: 1 },
                    0.3,
                    "power1.out",
                    () => setRotHeadingT(headProxy.t),
                    () => {
                      setRotationDone(true);
                      setAnimating(false);
                      gsap.delayedCall(1, () => onStepChange(5));
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  };

  const handleDilationTap = () => {
    if (step !== 5 || dilationDone || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    dismissTriNudge();

    setAnimating(true);

    const blueProxy = { t: 0 };
    runTween(
      blueProxy,
      { t: 1 },
      0.5,
      "power2.inOut",
      () => setDilBlueT(blueProxy.t),
      () => {
        setDilGreenVisible(true);
        gsap.delayedCall(0.15, () => {
          const pivotProxy = { t: 0 };
          runTween(
            pivotProxy,
            { t: 1 },
            0.25,
            "power1.out",
            () => setDilPivotT(pivotProxy.t),
            () => {
              const scaleProxy = { t: 0 };
              runTween(
                scaleProxy,
                { t: 1 },
                0.75,
                "power2.inOut",
                () => setDilScaleT(scaleProxy.t),
                () => {
                  const headProxy = { t: 0 };
                  runTween(
                    headProxy,
                    { t: 1 },
                    0.3,
                    "power1.out",
                    () => setDilHeadingT(headProxy.t),
                    () => {
                      setDilationDone(true);
                      setAnimating(false);
                      gsap.delayedCall(1, () => onStepChange(6));
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  };

  const openCompareOverlay = (key) => {
    overlayOpKeyRef.current = key;
    setOverlayOpKey(key);
    setOverlayVisible(true);
    setShowOverlayHeading(true);
    setLeftHeaderRevealed(false);
    setRightHeaderRevealed(false);
    setSummaryPhase(null);
    const isFinal = exploredCardKeys.length === 3;
    overlayFinalRef.current = isFinal;
    finalAnimDoneRef.current = false;
    if (isFinal) {
      setOverlayMode("final");
    } else {
      setOverlayMode("standard");
    }
    onUpdateNavText(" ");
  };

  const handleOverlayAnimComplete = () => {
    if (!overlayFinalRef.current || finalAnimDoneRef.current) return;
    finalAnimDoneRef.current = true;

    const key = overlayOpKeyRef.current;
    if (!key) return;

    const opName = getOpLabel(key);

    if (isRigidCard(key)) {
      setRigidOverlayItems((prev) =>
        prev.includes(opName) ? prev : [...prev, opName]
      );
    } else {
      setNonRigidOverlayItems((prev) =>
        prev.includes(opName) ? prev : [...prev, opName]
      );
    }
    setExploredCardKeys((prev) =>
      prev.includes(key) ? prev : [...prev, key]
    );

    setCompareKey(null);
    setCompareMoveT(0);
    setCompareSourcePts(null);
    setCompareTargetPts(null);
    setShowRedStroke(false);
    setRedScaleT(0);
    setShowCompareText(false);
    setAnimating(false);

    gsap.delayedCall(2, () => {
      setShowOverlayHeading(false);
      setSummaryPhase("left-prompt");
      onUpdateNavText(APP_DATA.steps[6].navTapLeft);
    });
  };

  const handleLeftHeaderClick = () => {
    if (summaryPhase !== "left-prompt") return;
    if (typeof playSound === "function") playSound("click");
    setLeftHeaderRevealed(true);
    setSummaryPhase("right-prompt");
    onUpdateNavText(APP_DATA.steps[6].navTapRight);
  };

  const handleRightHeaderClick = () => {
    if (summaryPhase !== "right-prompt") return;
    if (typeof playSound === "function") playSound("click");
    setRightHeaderRevealed(true);
    setSummaryPhase("complete");
    onUpdateNavText(" ");
  };

  const handleGreenCompareClick = (key) => {
    if (
      step !== 6 ||
      isAnimating ||
      overlayVisible ||
      compareKey ||
      exploredCardKeys.includes(key)
    )
      return;
    if (typeof playSound === "function") playSound("click");
    dismissGreenNudges();

    const sourcePts = getGreenPointsForCard(key);
    const targetPts = getCompareTargetPoints(key);
    const rigid = isRigidCard(key);

    setCompareKey(key);
    setCompareSourcePts(sourcePts);
    setCompareTargetPts(targetPts);
    setCompareMoveT(0);
    setShowRedStroke(false);
    setRedScaleT(0);
    setShowCompareText(false);
    setAnimating(true);
    onUpdateNavText(" ");

    const moveProxy = { t: 0 };
    gsap.to(moveProxy, {
      t: 1,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => setCompareMoveT(moveProxy.t),
      onComplete: () => {
        if (rigid) {
          setShowRedStroke(true);
          setShowCompareText(true);
          gsap.delayedCall(2, () => openCompareOverlay(key));
        } else {
          setShowRedStroke(true);
          setRedScaleT(0);
          const scaleProxy = { t: 0 };
          gsap.to(scaleProxy, {
            t: 1,
            duration: 0.7,
            ease: "power2.inOut",
            onUpdate: () => setRedScaleT(scaleProxy.t),
            onComplete: () => {
              setShowCompareText(true);
              gsap.delayedCall(2, () => openCompareOverlay(key));
            },
          });
        }
      },
    });
  };

  const handleOverlayClose = () => {
    if (typeof playSound === "function") playSound("click");

    if (overlayMode === "final") {
      if (summaryPhase !== "complete") return;
      setOverlayVisible(false);
      setOverlayMode("standard");
      overlayFinalRef.current = false;
      overlayOpKeyRef.current = null;
      setOverlayOpKey(null);
      finalAnimDoneRef.current = false;
      setSummaryPhase(null);
      setShowOverlayHeading(true);
      setLeftHeaderRevealed(false);
      setRightHeaderRevealed(false);
      setAnimating(false);
      onStepChange(7);
      return;
    }

    const key = compareKey;
    const opName = getOpLabel(key);

    if (key && isRigidCard(key)) {
      setRigidOverlayItems((prev) =>
        prev.includes(opName) ? prev : [...prev, opName]
      );
    } else if (key) {
      setNonRigidOverlayItems((prev) =>
        prev.includes(opName) ? prev : [...prev, opName]
      );
    }

    if (key) {
      setExploredCardKeys((prev) =>
        prev.includes(key) ? prev : [...prev, key]
      );
    }

    setOverlayVisible(false);
    overlayOpKeyRef.current = null;
    setOverlayOpKey(null);
    setCompareKey(null);
    setCompareMoveT(0);
    setCompareSourcePts(null);
    setCompareTargetPts(null);
    setShowRedStroke(false);
    setRedScaleT(0);
    setShowCompareText(false);
    setAnimating(false);
    onUpdateNavText(APP_DATA.steps[6].navText);
  };

  const getGreenStep6Props = (key) => {
    if (
      step === 6 &&
      !exploredCardKeys.includes(key) &&
      !compareKey &&
      !isAnimating &&
      !overlayVisible
    ) {
      return {
        onClick: (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          handleGreenCompareClick(key);
        },
        className: "green-triangle-clickable",
        style: { cursor: "pointer" },
      };
    }
    return {};
  };

  useEffect(() => {
    return killTween;
  }, []);

  useEffect(() => {
    setTriNudgeDismissed(false);
    if (step === 6) {
      setGreenNudgesDismissed(false);
    }
  }, [step]);

  useEffect(() => {
    if (step === 1 && !bigCardsVisible) {
      setInstructionPhase("entering");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setInstructionPhase("shown"));
      });
    } else if (step !== 1) {
      setInstructionPhase("hidden");
    }
  }, [step]);

  useEffect(() => {
    if (step === 1 && !isAnimating) {
      onUpdateNavText(APP_DATA.steps[1].navText);
    }
    if (step === 2 && !isAnimating && !translationDone) {
      onUpdateNavText(APP_DATA.steps[2].navText);
    }
    if (step === 3 && !isAnimating && !reflectionDone) {
      onUpdateNavText(APP_DATA.steps[3].navText);
    }
    if (step === 4 && !isAnimating && !rotationDone) {
      onUpdateNavText(APP_DATA.steps[4].navText);
    }
    if (step === 5 && !isAnimating && !dilationDone) {
      onUpdateNavText(APP_DATA.steps[5].navText);
    }
    if (step === 6 && !isAnimating) {
      onUpdateNavText(APP_DATA.steps[6].navText);
    }
  }, [step]);

  const renderCardRect = (key, w, h, highlighted) => {
    const center = CARD_CENTERS[key];
    const rect = getCardRect(center.x, center.y, w, h);

    return React.createElement("rect", {
      key: "card-bg-" + key,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      rx: CARD_RX,
      ry: CARD_RX,
      fill: COLORS.card,
      stroke: highlighted ? COLORS.highlight : COLORS.cardStroke,
      strokeWidth: highlighted ? 3 : 1.5,
    });
  };

  const renderTriangle = (ox, oy, leg, color, key, extra) => {
    return React.createElement(
      "polygon",
      Object.assign(
        {
          key: key,
          points: triPointsStr(ox, oy, leg),
          fill: color,
          stroke: "none",
        },
        extra || {}
      )
    );
  };

  const renderPivotDot = (x, y, opacity, key) =>
    React.createElement("circle", {
      key: key,
      cx: x,
      cy: y,
      r: PIVOT_R,
      fill: COLORS.axisPurple,
      opacity: opacity,
    });

  const renderHeading = (cx, cy, opacity, key, text) => {
    const cardRect = getCardRect(cx, cy, BIG_CARD_W, BIG_CARD_H);
    return React.createElement(
      "text",
      {
        key: key,
        x: cx,
        y: getHeadingY(cardRect),
        textAnchor: "middle",
        fill: COLORS.heading,
        fontSize: BIG_CARD_W * 0.08,
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        opacity: opacity,
      },
      text
    );
  };

  const renderCenterCard = () => {
    const cx = CARD_CENTERS.center.x;
    const cy = CARD_CENTERS.center.y;
    const origin = getTriOriginCentered(cx, cy, TRI_LEG);
    const tappable = step === 1 && !bigCardsVisible && !isAnimating;
    const dimmed = isCardDimmed("center");

    return React.createElement(
      "g",
      {
        key: "center-group",
        opacity: dimmed ? 0.5 : 1,
        filter: dimmed ? "brightness(0.55)" : "none",
        style: { transition: "opacity 0.4s, filter 0.4s" },
      },
      renderCardRect("center", CENTER_CARD_W, CENTER_CARD_H, isCardHighlighted("center")),
      renderTriangle(
        origin.x,
        origin.y,
        TRI_LEG,
        COLORS.triBlue,
        "center-tri",
        tappable
          ? {
              onClick: handleCenterTap,
              className: "triangle-clickable",
            }
          : {}
      )
    );
  };

  const renderCloneTriangles = () => {
    if (!bigCardsVisible || bigTrianglesVisible) return null;

    const centerOrigin = getTriOriginCentered(
      CARD_CENTERS.center.x,
      CARD_CENTERS.center.y,
      TRI_LEG
    );

    return React.createElement(
      "g",
      { key: "clones" },
      BIG_CARD_KEYS.map((key) => {
        const target = getTriOriginCentered(
          CARD_CENTERS[key].x,
          CARD_CENTERS[key].y,
          TRI_LEG
        );
        const pos = lerpPt(centerOrigin, target, cloneProgress);
        return renderTriangle(
          pos.x,
          pos.y,
          TRI_LEG,
          COLORS.triBlue,
          "clone-" + key
        );
      })
    );
  };

  const renderBigCardTriangle = (key, triClickable, onTriClick) => {
    if (!bigTrianglesVisible) return null;

    const cx = CARD_CENTERS[key].x;
    const cy = CARD_CENTERS[key].y;
    const triClickProps =
      triClickable && onTriClick
        ? { onClick: onTriClick, className: "triangle-clickable" }
        : {};

    if (key === "translation") {
      const startOrigin = getTriOriginCentered(cx, cy, TRI_LEG);
      const blueEnd = getTriOriginBottom(
        cx,
        cy,
        BIG_CARD_W,
        BIG_CARD_H,
        TRI_LEG,
        "left"
      );
      const greenEnd = getTriOriginBottom(
        cx,
        cy,
        BIG_CARD_W,
        BIG_CARD_H,
        TRI_LEG,
        "right"
      );

      const blueOx = translationDone
        ? blueEnd.x
        : lerp(startOrigin.x, blueEnd.x, transBlueT);
      const blueOy = translationDone
        ? blueEnd.y
        : lerp(startOrigin.y, blueEnd.y, transBlueT);

      const elements = [
        renderTriangle(
          blueOx,
          blueOy,
          TRI_LEG,
          COLORS.triBlue,
          "tl-blue",
          !translationDone && transBlueT === 0 && transGreenT === 0
            ? triClickProps
            : {}
        ),
      ];

      if (transGreenT > 0 || translationDone) {
        if (compareKey !== "translation") {
          const gOx = translationDone
            ? greenEnd.x
            : lerp(blueOx, greenEnd.x, transGreenT);
          const gOy = translationDone ? greenEnd.y : blueOy;
          elements.push(
            renderTriangle(
              gOx,
              gOy,
              TRI_LEG,
              COLORS.triGreen,
              "tl-green",
              getGreenStep6Props("translation")
            )
          );
        }
      }

      if (transHeadingT > 0 || translationDone) {
        const cardRect = getCardRect(cx, cy, BIG_CARD_W, BIG_CARD_H);
        elements.push(
          React.createElement(
            "text",
            {
              key: "tl-heading",
              x: cx,
              y: getHeadingY(cardRect),
              textAnchor: "middle",
              fill: COLORS.heading,
              fontSize: BIG_CARD_W * 0.08,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
              opacity: translationDone ? 1 : transHeadingT,
            },
            APP_DATA.steps[2].translationHeading
          )
        );
      }

      return React.createElement("g", { key: "tri-" + key }, elements);
    }

    if (key === "reflection") {
      const startOrigin = getTriOriginCentered(cx, cy, TRI_LEG);
      const blueEnd = getReflBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);

      const blueOx = reflectionDone
        ? blueEnd.x
        : reflBlueT > 0
        ? lerp(startOrigin.x, blueEnd.x, reflBlueT)
        : startOrigin.x;
      const blueOy = reflectionDone
        ? blueEnd.y
        : reflBlueT > 0
        ? lerp(startOrigin.y, blueEnd.y, reflBlueT)
        : startOrigin.y;

      const axisX = getReflAxisX({ x: blueOx, y: blueOy }, TRI_LEG);

      const elements = [
        renderTriangle(
          blueOx,
          blueOy,
          TRI_LEG,
          COLORS.triBlue,
          "rf-blue",
          !reflectionDone && reflBlueT === 0 && reflGreenT === 0
            ? triClickProps
            : {}
        ),
      ];

      if (reflGreenT > 0 || reflectionDone) {
        const t = reflectionDone ? 1 : reflGreenT;
        const finalPts = reflectTriPointsHoriz(blueOx, blueOy, TRI_LEG, axisX);
        const startPts = triPoints(blueOx, blueOy, TRI_LEG);
        const animPts = startPts.map((p, i) => ({
          x: lerp(p.x, finalPts[i].x, t),
          y: lerp(p.y, finalPts[i].y, t),
        }));

        if (compareKey !== "reflection") {
          elements.push(
            React.createElement(
              "polygon",
              Object.assign(
                {
                  key: "rf-green",
                  points: reflectPointsStr(animPts),
                  fill: COLORS.triGreen,
                },
                getGreenStep6Props("reflection")
              )
            )
          );
        }

        if (reflAxisT > 0 || reflectionDone) {
          const rect = getCardRect(cx, cy, BIG_CARD_W, BIG_CARD_H);
          elements.push(
            React.createElement("line", {
              key: "rf-axis",
              x1: axisX,
              y1: rect.y + BIG_CARD_H * CONTENT_TOP,
              x2: axisX,
              y2: rect.y + rect.height - BIG_CARD_H * CARD_PAD_Y,
              stroke: COLORS.axisPurple,
              strokeWidth: 2,
              strokeDasharray: "8 6",
              opacity: reflectionDone ? 1 : reflAxisT,
            })
          );
        }
      }

      if (reflHeadingT > 0 || reflectionDone) {
        const cardRect = getCardRect(cx, cy, BIG_CARD_W, BIG_CARD_H);
        elements.push(
          React.createElement(
            "text",
            {
              key: "rf-heading",
              x: cx,
              y: getHeadingY(cardRect),
              textAnchor: "middle",
              fill: COLORS.heading,
              fontSize: BIG_CARD_W * 0.08,
              fontWeight: "bold",
              fontFamily: "Arial, sans-serif",
              opacity: reflectionDone ? 1 : reflHeadingT,
            },
            APP_DATA.steps[3].reflectionHeading
          )
        );
      }

      return React.createElement("g", { key: "tri-" + key }, elements);
    }

    if (key === "bottomRight") {
      const startOrigin = getTriOriginCentered(cx, cy, TRI_LEG);
      const blueEnd = getRotBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);

      const blueOx = rotationDone
        ? blueEnd.x
        : lerp(startOrigin.x, blueEnd.x, rotBlueT);
      const blueOy = rotationDone
        ? blueEnd.y
        : lerp(startOrigin.y, blueEnd.y, rotBlueT);

      const pivot = getTopVertex(blueOx, blueOy, TRI_LEG);
      const elements = [
        renderTriangle(
          blueOx,
          blueOy,
          TRI_LEG,
          COLORS.triBlue,
          "rot-blue",
          !rotationDone && rotBlueT === 0 && !rotGreenVisible
            ? triClickProps
            : {}
        ),
      ];

      if (rotGreenVisible || rotationDone) {
        const rotT = rotationDone ? 1 : rotGreenRotT;
        const greenPts = rotateTriPointsCcw(
          blueOx,
          blueOy,
          TRI_LEG,
          pivot,
          rotT
        );
        if (compareKey !== "bottomRight") {
          elements.push(
            React.createElement(
              "polygon",
              Object.assign(
                {
                  key: "rot-green",
                  points: reflectPointsStr(greenPts),
                  fill: COLORS.triGreen,
                },
                getGreenStep6Props("bottomRight")
              )
            )
          );
        }
      }

      if (rotPivotT > 0 || rotationDone) {
        elements.push(
          renderPivotDot(
            pivot.x,
            pivot.y,
            rotationDone ? 1 : rotPivotT,
            "rot-pivot"
          )
        );
      }

      if (rotHeadingT > 0 || rotationDone) {
        elements.push(
          renderHeading(
            cx,
            cy,
            rotationDone ? 1 : rotHeadingT,
            "rot-heading",
            APP_DATA.steps[4].rotationHeading
          )
        );
      }

      return React.createElement("g", { key: "tri-" + key }, elements);
    }

    if (key === "bottomLeft") {
      const startOrigin = getTriOriginCentered(cx, cy, TRI_LEG);
      const blueEnd = getDilBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);

      const blueOx = dilationDone
        ? blueEnd.x
        : lerp(startOrigin.x, blueEnd.x, dilBlueT);
      const blueOy = dilationDone
        ? blueEnd.y
        : lerp(startOrigin.y, blueEnd.y, dilBlueT);

      const anchor = { x: blueOx, y: blueOy };
      const elements = [
        renderTriangle(
          blueOx,
          blueOy,
          TRI_LEG,
          COLORS.triBlue,
          "dil-blue",
          !dilationDone && dilBlueT === 0 && !dilGreenVisible
            ? triClickProps
            : {}
        ),
      ];

      if (dilGreenVisible || dilationDone) {
        const scale = dilationDone
          ? DILATION_SCALE
          : lerp(1, DILATION_SCALE, dilScaleT);
        const greenPts = scaleTriPoints(blueOx, blueOy, TRI_LEG, anchor, scale);
        if (compareKey !== "bottomLeft") {
          elements.push(
            React.createElement(
              "polygon",
              Object.assign(
                {
                  key: "dil-green",
                  points: reflectPointsStr(greenPts),
                  fill: COLORS.triGreen,
                  fillOpacity: 0.5,
                },
                getGreenStep6Props("bottomLeft")
              )
            )
          );
        }
      }

      if (dilPivotT > 0 || dilationDone) {
        elements.push(
          renderPivotDot(
            anchor.x,
            anchor.y,
            dilationDone ? 1 : dilPivotT,
            "dil-pivot"
          )
        );
      }

      if (dilHeadingT > 0 || dilationDone) {
        elements.push(
          renderHeading(
            cx,
            cy,
            dilationDone ? 1 : dilHeadingT,
            "dil-heading",
            APP_DATA.steps[5].dilationHeading
          )
        );
      }

      return React.createElement("g", { key: "tri-" + key }, elements);
    }

    const origin = getTriOriginCentered(cx, cy, TRI_LEG);
    return renderTriangle(origin.x, origin.y, TRI_LEG, COLORS.triBlue, "tri-" + key);
  };

  const renderCompareLayer = () => {
    if (!compareKey || !compareSourcePts || !compareTargetPts) return null;

    const pts =
      compareMoveT >= 1
        ? compareTargetPts
        : lerpPoints(compareSourcePts, compareTargetPts, compareMoveT);

    const elements = [
      React.createElement("polygon", {
        key: "compare-green",
        points: reflectPointsStr(pts),
        fill: COLORS.triGreen,
        fillOpacity: compareKey === "bottomLeft" ? 0.5 : 1,
      }),
    ];

    if (showRedStroke) {
      const co = getCenterBlueOrigin();
      const anchor = { x: co.x, y: co.y };
      let redPts;
      if (isRigidCard(compareKey)) {
        redPts = triPoints(co.x, co.y, TRI_LEG);
      } else {
        const scale = redScaleT >= 1 ? DILATION_SCALE : lerp(1, DILATION_SCALE, redScaleT);
        redPts = scaleTriPoints(co.x, co.y, TRI_LEG, anchor, scale);
      }
      elements.push(
        React.createElement("polygon", {
          key: "compare-red",
          points: reflectPointsStr(redPts),
          fill: "none",
          stroke: COLORS.redStroke,
          strokeWidth: 4,
          strokeLinejoin: "round",
        })
      );
    }

    return React.createElement("g", { key: "compare-layer" }, elements);
  };

  const renderBigCards = () => {
    if (!bigCardsVisible) return null;

    return React.createElement(
      "g",
      {
        key: "big-cards",
        opacity: bigCardsOpacity,
        style: { transition: "opacity 0.55s ease-out" },
      },
      BIG_CARD_KEYS.map((key) => {
        const highlighted = isCardHighlighted(key);
        const triClickable =
          (step === 2 &&
            key === "translation" &&
            !translationDone &&
            !isAnimating) ||
          (step === 3 &&
            key === "reflection" &&
            !reflectionDone &&
            !isAnimating) ||
          (step === 4 &&
            key === "bottomRight" &&
            !rotationDone &&
            !isAnimating) ||
          (step === 5 &&
            key === "bottomLeft" &&
            !dilationDone &&
            !isAnimating);

        const onTriClick =
          key === "translation"
            ? handleTranslationTap
            : key === "reflection"
            ? handleReflectionTap
            : key === "bottomRight"
            ? handleRotationTap
            : key === "bottomLeft"
            ? handleDilationTap
            : null;

        const dimmed = isCardDimmed(key);

        return React.createElement(
          "g",
          {
            key: "big-" + key,
            opacity: dimmed ? 0.5 : 1,
            filter: dimmed ? "brightness(0.55)" : "none",
            style: { transition: "opacity 0.4s, filter 0.4s" },
          },
          renderCardRect(key, BIG_CARD_W, BIG_CARD_H, highlighted),
          renderBigCardTriangle(key, triClickable, onTriClick)
        );
      })
    );
  };

  const instructionClassName =
    "instruction-box" +
    (instructionPhase === "shown" ? " is-shown" : "") +
    (instructionPhase === "leaving" ? " is-leaving" : "");

  const handleInstructionTransitionEnd = (e) => {
    if (e.propertyName !== "opacity") return;
    if (instructionPhase === "leaving") {
      setInstructionPhase("hidden");
    }
  };

  const activeTriNudgePoint = getActiveTriangleNudgePoint();

  const renderTriNudge = () => {
    if (!showTriNudge || !activeTriNudgePoint) return null;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", {
        ref: triNudgeAnchorRef,
        className: "nudge-anchor",
        style: getNudgeAnchorStyle(activeTriNudgePoint),
      }),
      React.createElement(NudgeAtTarget, {
        targetRef: triNudgeAnchorRef,
        active: true,
        containerRef: canvasContainerRef,
        updateKey: step + "-" + activeTriNudgePoint.x + "-" + activeTriNudgePoint.y,
      })
    );
  };

  const renderGreenNudges = () => {
    if (!showGreenNudges) return null;
    return BIG_CARD_KEYS.map(function (key) {
      var centroid = getPointsCentroid(getGreenPointsForCard(key));
      return React.createElement(
        React.Fragment,
        { key: "green-nudge-" + key },
        React.createElement("div", {
          ref: greenNudgeRefs[key],
          className: "nudge-anchor",
          style: getNudgeAnchorStyle(centroid),
        }),
        React.createElement(NudgeAtTarget, {
          targetRef: greenNudgeRefs[key],
          active: true,
          containerRef: canvasContainerRef,
          updateKey: key,
        })
      );
    });
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container", ref: canvasContainerRef },
    instructionPhase !== "hidden" &&
      React.createElement("div", {
        className: instructionClassName,
        onTransitionEnd: handleInstructionTransitionEnd,
        dangerouslySetInnerHTML: {
          __html: APP_DATA.steps[1].instructionText,
        },
      }),
    React.createElement(
      "svg",
      {
        viewBox: "0 0 " + VB_W + " " + VB_H,
        className: "transform-svg",
        preserveAspectRatio: "xMidYMid meet",
      },
      renderCenterCard(),
      renderBigCards(),
      renderCloneTriangles(),
      renderCompareLayer()
    ),
    renderTriNudge(),
    renderGreenNudges(),
    showCompareText &&
      compareKey &&
      React.createElement("div", {
        className: "compare-text",
        dangerouslySetInnerHTML: {
          __html: isRigidCard(compareKey)
            ? APP_DATA.steps[6].overlapTextYes
            : APP_DATA.steps[6].overlapTextNo,
        },
      }),
    overlayVisible &&
      overlayOpKey &&
      React.createElement(Overlay, {
        key:
          overlayMode === "final"
            ? "final-overlay"
            : overlayOpKey + "-overlay",
        operationName: getOpLabel(overlayOpKey),
        isRigid: isRigidCard(overlayOpKey),
        headingBefore: isRigidCard(overlayOpKey)
          ? APP_DATA.steps[6].overlayHeadingRigidBefore
          : APP_DATA.steps[6].overlayHeadingDilationBefore,
        headingAfter: isRigidCard(overlayOpKey)
          ? APP_DATA.steps[6].overlayHeadingRigidAfter
          : APP_DATA.steps[6].overlayHeadingDilationAfter,
        leftHeading:
          leftHeaderRevealed && overlayMode === "final"
            ? APP_DATA.steps[6].rigidGroupHeading
            : APP_DATA.steps[6].overlayLeftHeading,
        rightHeading:
          rightHeaderRevealed && overlayMode === "final"
            ? APP_DATA.steps[6].nonRigidGroupHeading
            : APP_DATA.steps[6].overlayRightHeading,
        footerText: APP_DATA.steps[6].overlayFooter,
        leftItems: rigidOverlayItems,
        rightItems: nonRigidOverlayItems,
        onClose: handleOverlayClose,
        onAnimComplete: handleOverlayAnimComplete,
        showHeading: showOverlayHeading,
        showFooter: overlayMode === "standard" || summaryPhase === "complete",
        allowClose:
          overlayMode === "standard" || summaryPhase === "complete",
        leftHeaderClickable: summaryPhase === "left-prompt",
        rightHeaderClickable: summaryPhase === "right-prompt",
        onLeftHeaderClick: handleLeftHeaderClick,
        onRightHeaderClick: handleRightHeaderClick,
      })
  );
};
