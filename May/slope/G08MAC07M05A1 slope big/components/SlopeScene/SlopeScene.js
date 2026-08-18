const SlopeScene = (props) => {
  const { useEffect, useMemo, useRef, useState } = React;
  const {
    step,
    scenario = "positive",
    arrowSigns,
    slopeComplete,
    onIntroComplete,
    onRideComplete,
    onArrowTap,
    onSlopeComplete,
    onClearNudges,
  } = props;

  const [introClicked, setIntroClicked] = useState(false);
  const [rideClicked, setRideClicked] = useState(false);
  const [motionSpriteFrame, setMotionSpriteFrame] = useState(0);
  const [spriteAnimating, setSpriteAnimating] = useState(false);
  const [formulaPhase, setFormulaPhase] = useState("idle");
  const [progress, setProgress] = useState(
    scenario === "negative"
      ? 0.9
      : scenario === "zero" || scenario === "nondefined"
        ? 0.2
        : SLOPE_SCENE.ride.startT,
  );
  const [cloneMotion, setCloneMotion] = useState({ x: null, y: null });
  const [cloneTravel, setCloneTravel] = useState({ x: false, y: false });
  const [formulaMotion, setFormulaMotion] = useState(null);
  const [formulaTravel, setFormulaTravel] = useState(false);
  const sceneRef = useRef(null);
  const svgRef = useRef(null);
  const formulaCloneRef = useRef(null);
  const blueTextRef = useRef(null);
  const yellowTextRef = useRef(null);
  const numeratorRef = useRef(null);
  const denominatorRef = useRef(null);
  const frameRef = useRef(null);
  const timeoutsRef = useRef([]);

  const isNegativeScenario = scenario === "negative";
  const isZeroScenario = scenario === "zero";
  const isUndefinedScenario = scenario === "nondefined";
  const scenarioOffset = isUndefinedScenario
    ? 15
    : isZeroScenario
      ? 10
      : isNegativeScenario
        ? 5
        : 0;
  const stage = step - scenarioOffset;
  const introStep = 2 + scenarioOffset;
  const movementStep = 3 + scenarioOffset;
  const arrowStep = 4 + scenarioOffset;
  const ySignWord = isNegativeScenario
    ? APP_DATA.formula.negative
    : isZeroScenario
      ? APP_DATA.formula.zero
      : APP_DATA.formula.positive;
  const xSignWord = isUndefinedScenario
    ? APP_DATA.formula.zero
    : APP_DATA.formula.positive;
  const resultSignWord = isNegativeScenario
    ? APP_DATA.formula.negative
    : isZeroScenario
      ? APP_DATA.formula.zero
      : isUndefinedScenario
        ? APP_DATA.formula.undefined
        : APP_DATA.formula.positive;
  const rideLine = isNegativeScenario
    ? {
        a: SLOPE_SCENE.hill.rightBase,
        b: SLOPE_SCENE.hill.peak,
        startT: 0.9,
        endT: 0.25,
      }
    : isZeroScenario
      ? {
          a: { x: 120, y: 360 },
          b: { x: 900, y: 360 },
          startT: 0.2,
          endT: 0.8,
        }
      : isUndefinedScenario
        ? {
            a: { x: 650, y: 500 },
            b: { x: 650, y: 40 },
            startT: 0.2,
            endT: 0.8,
          }
    : {
        a: SLOPE_SCENE.hill.leftBase,
        b: SLOPE_SCENE.hill.peak,
        startT: SLOPE_SCENE.ride.startT,
        endT: SLOPE_SCENE.ride.endT,
      };
  const startPoint = useMemo(
    () => pointOnLine(rideLine.a, rideLine.b, rideLine.startT),
    [scenario],
  );
  const endPoint = useMemo(
    () => pointOnLine(rideLine.a, rideLine.b, rideLine.endT),
    [scenario],
  );
  const currentPoint = useMemo(
    () => pointOnLine(rideLine.a, rideLine.b, progress),
    [progress, scenario],
  );
  const hillAngle = useMemo(
    () => {
      const a = isNegativeScenario
        ? SLOPE_SCENE.hill.peak
        : isZeroScenario || isUndefinedScenario
          ? rideLine.a
        : SLOPE_SCENE.hill.leftBase;
      const b = isNegativeScenario
        ? SLOPE_SCENE.hill.rightBase
        : isZeroScenario || isUndefinedScenario
          ? rideLine.b
        : SLOPE_SCENE.hill.peak;
      return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    },
    [scenario],
  );
  const rideIsNearlyDone = isNegativeScenario
    ? progress <= rideLine.endT + 0.03
    : progress >= rideLine.endT - 0.03;
  const showGrid = stage >= 3 || introClicked;
  const showLine = stage >= 3 || introClicked;
  const showMovement = stage >= 4 || rideClicked || stage === 5;
  const showMovementText = stage >= 4 || (rideClicked && rideIsNearlyDone);
  const showSurfaceIntroLabel =
    showLine && stage < 4 && !(stage === 3 && rideClicked);
  const showFinalSurfaceLabel = formulaPhase === "done" || slopeComplete;
  const mutedScene = stage === 5;
  const surfaceLineStart = isZeroScenario
    ? {
        x: rideLine.a.x,
        y: rideLine.a.y,
      }
    : isUndefinedScenario
      ? {
          x: rideLine.b.x,
          y: rideLine.b.y,
        }
    : isNegativeScenario
    ? {
        x: SLOPE_SCENE.hill.peak.x + 3,
        y: SLOPE_SCENE.hill.peak.y + 2,
      }
    : {
        x: SLOPE_SCENE.hill.leftBase.x + 8,
        y: SLOPE_SCENE.hill.leftBase.y - 4,
      };
  const surfaceLineEnd = isZeroScenario
    ? {
        x: rideLine.b.x,
        y: rideLine.b.y,
      }
    : isUndefinedScenario
      ? {
          x: rideLine.a.x,
          y: rideLine.a.y,
        }
    : isNegativeScenario
    ? {
        x: SLOPE_SCENE.hill.rightBase.x - 8,
        y: SLOPE_SCENE.hill.rightBase.y - 4,
      }
    : {
        x: SLOPE_SCENE.hill.peak.x - 3,
        y: SLOPE_SCENE.hill.peak.y + 2,
      };
  const surfaceMid = {
    x: (surfaceLineStart.x + surfaceLineEnd.x) / 2,
    y: (surfaceLineStart.y + surfaceLineEnd.y) / 2,
  };
  const zeroYellowTextOffset = { x: 34, y: -8 };
  const undefinedBlueTextOffset = { x: 42, y: -46 };
  const undefinedFinalLabelOffset = { x: -52, y: 0, angle: -90 };
  const movementArrowHeadLength = 40;
  const movementArrowHeadWidth = 40;
  const surfaceArrowHeadLength = 18;
  const surfaceArrowHeadWidth = 18;
  const rideAnimationDuration = 2000;
  const cycleFrames = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) =>
        "assets/cycle/" + String(index).padStart(2, "0") + ".png",
      ),
    [],
  );
  const climbFrames = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) =>
        "assets/climb/" + String(index).padStart(2, "0") + ".png",
      ),
    [],
  );

  const renderMathSvgSegments = (text, keyPrefix) =>
    String(text || "")
      .split(/(\b[xy]\b)/gi)
      .filter((segment) => segment !== "")
      .map((segment, index) =>
        /^[xy]$/i.test(segment)
          ? React.createElement(
              "tspan",
              {
                key: keyPrefix + "-math-" + index,
                className: "math-variable",
              },
              segment.toLowerCase(),
            )
          : segment,
      );

  const renderMathHtmlSegments = (text, keyPrefix) =>
    String(text || "")
      .split(/(\b[xy]\b)/gi)
      .filter((segment) => segment !== "")
      .map((segment, index) =>
        /^[xy]$/i.test(segment)
          ? React.createElement(
              "span",
              {
                key: keyPrefix + "-math-" + index,
                className: "math-variable",
              },
              segment.toLowerCase(),
            )
          : segment,
      );

  const getArrowGeometry = (start, end, headLength, headWidth) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (!length) return null;
    const ux = dx / length;
    const uy = dy / length;
    const shaftEnd = {
      x: end.x - ux * headLength,
      y: end.y - uy * headLength,
    };
    const halfWidth = headWidth / 2;
    const left = {
      x: shaftEnd.x - uy * halfWidth,
      y: shaftEnd.y + ux * halfWidth,
    };
    const right = {
      x: shaftEnd.x + uy * halfWidth,
      y: shaftEnd.y - ux * halfWidth,
    };
    return {
      shaftStart: start,
      shaftEnd,
      headPoints:
        end.x +
        "," +
        end.y +
        " " +
        left.x +
        "," +
        left.y +
        " " +
        right.x +
        "," +
        right.y,
    };
  };

  const renderSingleHeadArrow = (
    start,
    end,
    shaftClassName,
    headClassName,
    onClick,
  ) => {
    const geometry = getArrowGeometry(
      start,
      end,
      movementArrowHeadLength,
      movementArrowHeadWidth,
    );
    if (!geometry) return null;
    return React.createElement(
      "g",
      { onClick: onClick },
      React.createElement("line", {
        x1: geometry.shaftStart.x,
        y1: geometry.shaftStart.y,
        x2: geometry.shaftEnd.x,
        y2: geometry.shaftEnd.y,
        className: shaftClassName,
      }),
      React.createElement("polygon", {
        points: geometry.headPoints,
        className: headClassName,
      }),
    );
  };

  const renderDoubleHeadArrow = (
    start,
    end,
    shaftClassName,
    headClassName,
  ) => {
    const forward = getArrowGeometry(
      start,
      end,
      surfaceArrowHeadLength,
      surfaceArrowHeadWidth,
    );
    const backward = getArrowGeometry(
      end,
      start,
      surfaceArrowHeadLength,
      surfaceArrowHeadWidth,
    );
    if (!forward || !backward) return null;
    return React.createElement(
      "g",
      null,
      React.createElement("line", {
        x1: backward.shaftEnd.x,
        y1: backward.shaftEnd.y,
        x2: forward.shaftEnd.x,
        y2: forward.shaftEnd.y,
        className: shaftClassName,
      }),
      React.createElement("polygon", {
        points: forward.headPoints,
        className: headClassName,
      }),
      React.createElement("polygon", {
        points: backward.headPoints,
        className: headClassName,
      }),
    );
  };

  const renderSvgLines = (text, lineHeight) =>
    String(text || "")
      .split("<br>")
      .map((line, index) =>
        React.createElement(
          "tspan",
          {
            key: index,
            x: 0,
            dy: index === 0 ? 0 : lineHeight,
          },
          line,
        ),
      );

  const renderMovementLabelText = (
    text,
    lineHeight,
    signWord,
    signRef,
    shouldBlink,
  ) => {
    return String(text || "")
      .split("<br>")
      .map((line, index) => {
        const signIndex = line.indexOf(signWord);
        const children =
          signIndex >= 0
            ? [
                ...renderMathSvgSegments(
                  line.slice(0, signIndex),
                  "line-" + index + "-before",
                ),
                React.createElement(
                  "tspan",
                  {
                    key: "sign",
                    ref: signRef,
                    className:
                      "movement-positive-word" +
                      (shouldBlink ? " blink-source" : ""),
                  },
                  signWord,
                ),
                ...renderMathSvgSegments(
                  line.slice(signIndex + signWord.length),
                  "line-" + index + "-after",
                ),
              ]
            : renderMathSvgSegments(line, "line-" + index);
        return React.createElement(
          "tspan",
          {
            key: index,
            x: 0,
            dy: index === 0 ? 0 : lineHeight,
          },
          children,
        );
      });
  };

  const clearTimers = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  const getCloneMotion = (sourceEl, targetEl) => {
    const sceneEl = sceneRef.current;
    if (!sceneEl || !sourceEl || !targetEl) return null;
    const sceneRect = sceneEl.getBoundingClientRect();
    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const startX = sourceRect.left - sceneRect.left;
    const startY = sourceRect.top - sceneRect.top;
    const endX =
      targetRect.left -
      sceneRect.left +
      targetRect.width * 0.5 -
      sourceRect.width * 0.5;
    const endY =
      targetRect.top -
      sceneRect.top +
      targetRect.height * 0.5 -
      sourceRect.height * 0.5;
    return {
      left: startX,
      top: startY,
      dx: endX - startX,
      dy: endY - startY,
    };
  };

  const addTimer = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const animateCycle = (fromT, toT, duration, done) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const tick = (now) => {
      const raw = Math.min(1, (now - start) / duration);
      setProgress(fromT + (toT - fromT) * raw);
      if (raw < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        setProgress(toT);
        if (done) done();
      }
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    clearTimers();
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (stage === 2) {
      setIntroClicked(false);
      setRideClicked(false);
      setFormulaPhase("idle");
      setCloneMotion({ x: null, y: null });
      setCloneTravel({ x: false, y: false });
      setFormulaMotion(null);
      setFormulaTravel(false);
      setProgress(rideLine.startT);
      setSpriteAnimating(false);
      setMotionSpriteFrame(0);
    }
    if (stage === 3) {
      setRideClicked(false);
      setFormulaPhase("idle");
      setCloneMotion({ x: null, y: null });
      setCloneTravel({ x: false, y: false });
      setFormulaMotion(null);
      setFormulaTravel(false);
      setProgress(rideLine.startT);
      setSpriteAnimating(false);
      setMotionSpriteFrame(0);
    }
    if (stage === 4 || stage === 5) {
      setProgress(rideLine.endT);
      setSpriteAnimating(false);
    }
    return () => {
      clearTimers();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [step, scenario]);

  useEffect(() => {
    if (!spriteAnimating) return undefined;
    const frameCount = isUndefinedScenario ? climbFrames.length : cycleFrames.length;
    const intervalId = setInterval(() => {
      setMotionSpriteFrame((prev) => (prev + 1) % frameCount);
    }, 1000 / 30);
    return () => clearInterval(intervalId);
  }, [spriteAnimating, isUndefinedScenario, climbFrames.length, cycleFrames.length]);

  useEffect(() => {
    if (formulaPhase !== "clone-y" && formulaPhase !== "clone-x") return;
    const axis = formulaPhase === "clone-y" ? "y" : "x";
    setCloneMotion((prev) => ({ ...prev, [axis]: null }));
    setCloneTravel((prev) => ({ ...prev, [axis]: false }));
    const rafId = requestAnimationFrame(() => {
      const motion =
        formulaPhase === "clone-y"
          ? getCloneMotion(yellowTextRef.current, numeratorRef.current)
          : getCloneMotion(blueTextRef.current, denominatorRef.current);
      if (motion) {
        setCloneMotion((prev) => ({
          ...prev,
          [formulaPhase === "clone-y" ? "y" : "x"]: motion,
        }));
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [formulaPhase]);

  useEffect(() => {
    const axis =
      formulaPhase === "clone-y" ? "y" : formulaPhase === "clone-x" ? "x" : null;
    if (!axis || !cloneMotion[axis]) return undefined;
    let secondFrame = null;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setCloneTravel((prev) => ({ ...prev, [axis]: true }));
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [formulaPhase, cloneMotion]);

  useEffect(() => {
    if (formulaPhase !== "move-label") return undefined;
    setFormulaMotion(null);
    setFormulaTravel(false);
    let secondFrame = null;
    const firstFrame = requestAnimationFrame(() => {
      const sceneEl = sceneRef.current;
      const svgEl = svgRef.current;
      const cloneEl = formulaCloneRef.current;
      if (!sceneEl || !svgEl || !cloneEl || !svgEl.createSVGPoint) return;
      const sceneRect = sceneEl.getBoundingClientRect();
      const cloneRect = cloneEl.getBoundingClientRect();
      const svgPoint = svgEl.createSVGPoint();
      svgPoint.x = isUndefinedScenario
        ? surfaceMid.x + undefinedFinalLabelOffset.x
        : surfaceMid.x;
      svgPoint.y = isUndefinedScenario
        ? surfaceMid.y + undefinedFinalLabelOffset.y
        : surfaceMid.y - 34;
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return;
      const target = svgPoint.matrixTransform(ctm);
      const startX = cloneRect.left - sceneRect.left;
      const startY = cloneRect.top - sceneRect.top;
      const endX = target.x - sceneRect.left - cloneRect.width * 0.5;
      const endY = target.y - sceneRect.top - cloneRect.height * 0.5;
      setFormulaMotion({
        dx: endX - startX,
        dy: endY - startY,
      });
      secondFrame = requestAnimationFrame(() => {
        setFormulaTravel(true);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [formulaPhase, surfaceMid.x, surfaceMid.y, isUndefinedScenario]);

  const handleHillClick = () => {
    if (introClicked || stage !== 2) return;
    if (typeof playSound === "function") playSound("click");
    if (typeof onClearNudges === "function") onClearNudges();
    setIntroClicked(true);
    addTimer(onIntroComplete, 1000);
  };

  const handleCycleClick = () => {
    if (rideClicked || stage !== 3) return;
    if (typeof playSound === "function") playSound("click");
    if (typeof onClearNudges === "function") onClearNudges();
    setRideClicked(true);
    setSpriteAnimating(true);
    setMotionSpriteFrame(0);
    animateCycle(rideLine.startT, rideLine.endT, rideAnimationDuration, () => {
      setSpriteAnimating(false);
      addTimer(onRideComplete, 600);
    });
  };

  const handleGreenLineClick = () => {
    if (stage !== 5 || formulaPhase !== "idle" || slopeComplete) return;
    if (typeof playSound === "function") playSound("click");
    if (typeof onClearNudges === "function") onClearNudges();
    setFormulaPhase("slide");
    addTimer(() => setFormulaPhase("blink-y"), 650);
    addTimer(() => setFormulaPhase("clone-y"), 2100);
    addTimer(() => setFormulaPhase("numerator-positive"), 3000);
    addTimer(() => setFormulaPhase("blink-x"), 3550);
    addTimer(() => setFormulaPhase("clone-x"), 5000);
    addTimer(() => setFormulaPhase("denominator-positive"), 5900);
    addTimer(() => setFormulaPhase("blink-fraction"), 6550);
    addTimer(() => setFormulaPhase("result-positive"), 7950);
    addTimer(() => setFormulaPhase("move-label"), 8650);
    addTimer(() => {
      setFormulaPhase("done");
      onSlopeComplete();
    }, 9750);
  };

  const renderGrid = () => {
    if (!showGrid) return null;
    const els = [];
    const left = 115;
    const top = 36;
    const width = 700;
    const height = 425;
    for (let i = 0; i <= 40; i++) {
      const x = left + (width / 40) * i;
      els.push(
        React.createElement("line", {
          key: "minor-v-" + i,
          x1: x,
          y1: top,
          x2: x,
          y2: top + height,
          className: "grid-line minor",
        }),
      );
    }
    for (let j = 0; j <= 24; j++) {
      const y = top + (height / 24) * j;
      els.push(
        React.createElement("line", {
          key: "minor-h-" + j,
          x1: left,
          y1: y,
          x2: left + width,
          y2: y,
          className: "grid-line minor",
        }),
      );
    }
    for (let i = 0; i <= 8; i++) {
      const x = left + (width / 8) * i;
      els.push(
        React.createElement("line", {
          key: "major-v-" + i,
          x1: x,
          y1: top,
          x2: x,
          y2: top + height,
          className: "grid-line major",
        }),
      );
    }
    for (let j = 0; j <= 5; j++) {
      const y = top + (height / 5) * j;
      els.push(
        React.createElement("line", {
          key: "major-h-" + j,
          x1: left,
          y1: y,
          x2: left + width,
          y2: y,
          className: "grid-line major",
        }),
      );
    }
    els.push(
      React.createElement("line", {
        key: "x-axis",
        x1: left - 18,
        y1: 248,
        x2: left + width + 22,
        y2: 248,
        className: "axis-line",
      }),
      React.createElement("line", {
        key: "y-axis",
        x1: 465,
        y1: top - 18,
        x2: 465,
        y2: top + height + 22,
        className: "axis-line",
      }),
      React.createElement(
        "text",
        { key: "x-label", x: 825, y: 256, className: "axis-label math-variable" },
        "x",
      ),
      React.createElement(
        "text",
        { key: "y-label", x: 444, y: 35, className: "axis-label math-variable" },
        "y",
      ),
      React.createElement("text", { key: "origin-label", x: 444, y: 270, className: "axis-number" }, "O"),
      React.createElement("text", { key: "ten-label", x: 432, y: 112, className: "axis-number" }, "10"),
      React.createElement("text", { key: "minus-ten-label", x: 425, y: 407, className: "axis-number" }, "-10"),
    );
    return React.createElement("g", { className: mutedScene ? "grid muted" : "grid" }, els);
  };

  const renderCycle = () => {
    const w = isUndefinedScenario ? 150 : SLOPE_SCENE.ride.cycleWidth;
    const h = isUndefinedScenario ? 220 : SLOPE_SCENE.ride.cycleHeight;
    const x = isUndefinedScenario
      ? currentPoint.x - w * 0.82
      : currentPoint.x - w * 0.53;
    const y = isUndefinedScenario ? currentPoint.y - h * 0.52 : currentPoint.y - h;
    const spriteHref = isUndefinedScenario
      ? climbFrames[motionSpriteFrame] || climbFrames[0]
      : cycleFrames[motionSpriteFrame] || cycleFrames[0];
    return React.createElement(
      "g",
      {
        id: stage === 3 && !rideClicked ? "cycle-click-target" : undefined,
        className:
          "cycle-group" +
          (stage === 3 && !rideClicked ? " clickable" : "") +
          (mutedScene ? " muted-strong" : ""),
        onClick: handleCycleClick,
      },
      React.createElement("image", {
        href: spriteHref,
        x: x,
        y: y,
        width: w,
        height: h,
        className: isUndefinedScenario
          ? "scene-climber-sprite"
          : undefined,
        transform: isUndefinedScenario
          ? undefined
          : "rotate(" +
            hillAngle +
            " " +
            currentPoint.x +
            " " +
            currentPoint.y +
            ")",
      }),
    );
  };

  const renderMovementArrows = () => {
    if (!showMovement) return null;
    const corner =
      isNegativeScenario || isUndefinedScenario
        ? { x: startPoint.x, y: currentPoint.y }
        : { x: currentPoint.x, y: startPoint.y };
    const showBlueArrow = !isUndefinedScenario;
    const showYellowArrow = !isZeroScenario;
    const blueText =
      stage >= 4 && arrowSigns.x
        ? isUndefinedScenario
          ? APP_DATA.steps[arrowStep].blueZero
          : APP_DATA.steps[arrowStep].bluePositive
        : APP_DATA.steps[movementStep].blueMovement;
    const yellowText =
      stage >= 4 && arrowSigns.y
        ? isNegativeScenario
          ? APP_DATA.steps[arrowStep].yellowNegative
          : isZeroScenario
            ? APP_DATA.steps[arrowStep].yellowZero
            : APP_DATA.steps[arrowStep].yellowPositive
        : APP_DATA.steps[movementStep].yellowMovement;
    const blueArrowStart = isZeroScenario
      ? { x: startPoint.x, y: startPoint.y + 58 }
      : isNegativeScenario
        ? { x: corner.x, y: corner.y }
        : { x: startPoint.x, y: startPoint.y };
    const blueArrowEnd = isZeroScenario
      ? { x: currentPoint.x, y: startPoint.y + 58 }
      : isNegativeScenario
        ? { x: currentPoint.x, y: currentPoint.y }
        : { x: corner.x, y: corner.y };
    const yellowArrowStart = isUndefinedScenario
      ? { x: startPoint.x + 76, y: startPoint.y }
      : isNegativeScenario
        ? { x: startPoint.x, y: startPoint.y }
        : { x: corner.x, y: corner.y };
    const yellowArrowEnd = isUndefinedScenario
      ? { x: currentPoint.x + 76, y: currentPoint.y }
      : isNegativeScenario
        ? { x: corner.x, y: currentPoint.y }
        : { x: currentPoint.x, y: currentPoint.y };
    const blueTextPosition = isUndefinedScenario
      ? {
          x: yellowArrowEnd.x + undefinedBlueTextOffset.x,
          y: yellowArrowEnd.y + undefinedBlueTextOffset.y,
        }
      : isZeroScenario
        ? {
            x: (blueArrowStart.x + blueArrowEnd.x) / 2,
            y: blueArrowStart.y + 44,
          }
        : {
            x: isNegativeScenario ? (corner.x + currentPoint.x) / 2 : startPoint.x + 105,
            y: isNegativeScenario ? corner.y + 36 : startPoint.y + 58,
          };
    const yellowTextPosition = isUndefinedScenario
      ? {
          x: yellowArrowStart.x + 48,
          y: (yellowArrowStart.y + yellowArrowEnd.y) / 2 - 8,
        }
      : isZeroScenario
        ? {
            x: blueArrowEnd.x + zeroYellowTextOffset.x,
            y: blueArrowEnd.y + zeroYellowTextOffset.y,
          }
        : isNegativeScenario
          ? {
              x: startPoint.x - 300,
              y: (startPoint.y + corner.y) / 2 - 8,
            }
          : {
              x: corner.x + 44,
              y: (corner.y + currentPoint.y) / 2 + 4,
            };
    const blueTargetActive = stage === 4 && !arrowSigns.x;
    const yellowTargetActive = stage === 4 && !arrowSigns.y;
    return React.createElement(
      "g",
      { className: "movement-layer" },
      showBlueArrow
        ? renderSingleHeadArrow(
            blueArrowStart,
            blueArrowEnd,
            "movement-arrow blue-arrow",
            "movement-arrow-head blue-arrow-head",
            () => onArrowTap("x"),
          )
        : null,
      showBlueArrow
        ? React.createElement("line", {
            id:
              blueTargetActive
                ? "blue-arrow-click-target"
                : undefined,
            x1: blueArrowStart.x,
            y1: blueArrowStart.y,
            x2: blueArrowEnd.x,
            y2: blueArrowEnd.y,
            className: "arrow-hit-zone",
            onClick: () => onArrowTap("x"),
          })
        : null,
      showYellowArrow
        ? renderSingleHeadArrow(
            yellowArrowStart,
            yellowArrowEnd,
            "movement-arrow yellow-arrow",
            "movement-arrow-head yellow-arrow-head",
            () => onArrowTap("y"),
          )
        : null,
      showYellowArrow
        ? React.createElement("line", {
            id:
              yellowTargetActive
                ? "yellow-arrow-click-target"
                : undefined,
            x1: yellowArrowStart.x,
            y1: yellowArrowStart.y,
            x2: yellowArrowEnd.x,
            y2: yellowArrowEnd.y,
            className: "arrow-hit-zone",
            onClick: () => onArrowTap("y"),
          })
        : null,
      showMovementText
        ? React.createElement(
            "text",
            {
              id:
                blueTargetActive
                  ? "blue-text-click-target"
                  : undefined,
              transform:
                "translate(" + blueTextPosition.x + " " + blueTextPosition.y + ")",
              className:
                "movement-text blue-text" +
                (isNegativeScenario || isZeroScenario
                  ? " centered-movement-text"
                  : "") +
                (blueTargetActive ? " clickable-movement-text" : ""),
              onClick:
                blueTargetActive ? () => onArrowTap("x") : undefined,
            },
            renderMovementLabelText(
              blueText,
              35,
              xSignWord,
              blueTextRef,
              formulaPhase === "blink-x",
            ),
          )
        : null,
      showMovementText
        ? React.createElement(
            "text",
            {
              id:
                yellowTargetActive
                  ? "yellow-text-click-target"
                  : undefined,
              transform:
                "translate(" +
                yellowTextPosition.x +
                " " +
                yellowTextPosition.y +
                ")",
              className:
                "movement-text yellow-text" +
                (yellowTargetActive ? " clickable-movement-text" : ""),
              onClick:
                yellowTargetActive ? () => onArrowTap("y") : undefined,
            },
            renderMovementLabelText(
              yellowText,
              35,
              ySignWord,
              yellowTextRef,
              formulaPhase === "blink-y",
            ),
          )
        : null,
    );
  };

  const renderSurfaceLabel = () => {
    if (!showSurfaceIntroLabel && !showFinalSurfaceLabel) return null;
    if (showFinalSurfaceLabel) {
      const finalLabelX = isUndefinedScenario
        ? surfaceMid.x + undefinedFinalLabelOffset.x
        : surfaceMid.x;
      const finalLabelY = isUndefinedScenario
        ? surfaceMid.y + undefinedFinalLabelOffset.y
        : surfaceMid.y - 34;
      const finalLabelAngle = isUndefinedScenario
        ? undefinedFinalLabelOffset.angle
        : hillAngle;
      return React.createElement(
        "g",
        {
          className: "surface-final-label-group",
          transform:
            "translate(" +
            finalLabelX +
            " " +
            finalLabelY +
            ") rotate(" +
            finalLabelAngle +
            ")",
        },
        React.createElement(
          "text",
          { className: "surface-final-label" },
          renderSvgLines(
          APP_DATA.formula.slope + " = " + resultSignWord,
            38,
          ),
        ),
      );
    }

    const introLabelX = isNegativeScenario
      ? surfaceMid.x - 80
      : isZeroScenario
        ? surfaceMid.x
        : isUndefinedScenario
          ? surfaceMid.x + 190
          : 560;
    const introLabelY = isNegativeScenario
      ? surfaceMid.y + 78
      : isZeroScenario
        ? surfaceMid.y + 82
        : isUndefinedScenario
          ? surfaceMid.y
          : 310;
    const introLabelAngle = isUndefinedScenario ? 0 : hillAngle;

    return React.createElement(
      "g",
      {
        className: "surface-label-group",
        transform:
          "translate(" +
          introLabelX +
          " " +
          introLabelY +
          ") rotate(" +
          introLabelAngle +
          ")",
      },
      React.createElement("rect", {
        className: "surface-label-box",
        x: showFinalSurfaceLabel ? -150 : -190,
        y: showFinalSurfaceLabel ? -48 : -72,
        width: showFinalSurfaceLabel ? 300 : 380,
        height: showFinalSurfaceLabel ? 76 : 118,
        rx: 10,
      }),
      React.createElement(
        "text",
        { className: "surface-label", transform: "translate(0 -30)" },
        renderSvgLines(APP_DATA.steps[introStep].hillLabel, 30),
      ),
    );
  };

  const renderFormula = () => {
    if (stage !== 5 || formulaPhase === "idle" || formulaPhase === "done") {
      return null;
    }
    const numeratorSigned =
      formulaPhase === "numerator-positive" ||
      formulaPhase === "blink-x" ||
      formulaPhase === "clone-x" ||
      formulaPhase === "denominator-positive" ||
      formulaPhase === "blink-fraction" ||
      formulaPhase === "result-positive" ||
      formulaPhase === "move-label";
    const denominatorSigned =
      formulaPhase === "denominator-positive" ||
      formulaPhase === "blink-fraction" ||
      formulaPhase === "result-positive" ||
      formulaPhase === "move-label";
    const resultSigned =
      formulaPhase === "result-positive" || formulaPhase === "move-label";
    const movingLabelAngle = isUndefinedScenario
      ? undefinedFinalLabelOffset.angle
      : hillAngle;
    const numeratorText = numeratorSigned
      ? ySignWord
      : renderMathHtmlSegments(APP_DATA.formula.changeY, "formula-y");
    const denominatorText = denominatorSigned
      ? xSignWord
      : renderMathHtmlSegments(APP_DATA.formula.changeX, "formula-x");
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          className:
            "slope-formula " +
            formulaPhase +
            (formulaPhase === "move-label" ? " hidden-formula" : ""),
        },
        React.createElement("span", { className: "formula-name" }, APP_DATA.formula.slope),
        React.createElement("span", { className: "formula-equals" }, "="),
        resultSigned
          ? React.createElement("span", { className: "formula-result" }, resultSignWord)
          : React.createElement(
              "span",
              { className: "formula-fraction" },
              React.createElement(
                "span",
                {
                  className:
                    "formula-part numerator" +
                    (formulaPhase === "blink-y" ? " blink-word" : ""),
                  ref: numeratorRef,
                },
                numeratorText,
              ),
              React.createElement("span", { className: "fraction-bar" }),
              React.createElement(
                "span",
                {
                  className:
                    "formula-part denominator" +
                    (formulaPhase === "blink-x" ? " blink-word" : ""),
                  ref: denominatorRef,
                },
                denominatorText,
              ),
            ),
      ),
      formulaPhase === "move-label"
        ? React.createElement(
            "div",
            {
              ref: formulaCloneRef,
              className: "formula-moving-clone",
              style: formulaMotion
                ? {
                    transform: formulaTravel
                      ? "translate(" +
                        formulaMotion.dx +
                        "px, " +
                        formulaMotion.dy +
                        "px) rotate(" +
                        movingLabelAngle +
                        "deg)"
                      : "translate(0, 0) rotate(0deg)",
                  }
                : undefined,
            },
            APP_DATA.formula.slope + " = " + resultSignWord,
          )
        : null,
      formulaPhase === "clone-y" && cloneMotion.y
        ? React.createElement(
            "div",
            {
              className: "positive-word-clone yellow-word-clone",
              style: {
                left: cloneMotion.y.left + "px",
                top: cloneMotion.y.top + "px",
                transform: cloneTravel.y
                  ? "translate(" +
                    cloneMotion.y.dx +
                    "px, " +
                    cloneMotion.y.dy +
                    "px)"
                  : "translate(0, 0)",
              },
            },
            ySignWord,
          )
        : null,
      formulaPhase === "clone-x" && cloneMotion.x
        ? React.createElement(
            "div",
            {
              className: "positive-word-clone blue-word-clone",
              style: {
                left: cloneMotion.x.left + "px",
                top: cloneMotion.x.top + "px",
                transform: cloneTravel.x
                  ? "translate(" +
                    cloneMotion.x.dx +
                    "px, " +
                    cloneMotion.x.dy +
                    "px)"
                  : "translate(0, 0)",
              },
            },
            xSignWord,
          )
        : null,
    );
  };

  const hillPath =
    "M " +
    SLOPE_SCENE.hill.leftBase.x +
    " " +
    SLOPE_SCENE.hill.leftBase.y +
    " L " +
    SLOPE_SCENE.hill.peak.x +
    " " +
    SLOPE_SCENE.hill.peak.y +
    " L " +
    SLOPE_SCENE.hill.rightBase.x +
    " " +
    SLOPE_SCENE.hill.rightBase.y +
    " Z";
  const renderTerrain = () => {
    const terrainProps = {
      id:
        stage === 2 && !introClicked && !isUndefinedScenario
          ? "hill-click-target"
          : undefined,
      className:
        "hill-shape" +
        (showLine ? " dehighlighted" : "") +
        (mutedScene ? " muted" : ""),
      onClick: handleHillClick,
    };

    if (isZeroScenario) {
      return React.createElement(
        "g",
        terrainProps,
        React.createElement("rect", {
          x: -320,
          y: rideLine.a.y,
          width: 1640,
          height: 260,
          fill: "url(#grassPattern)",
        }),
        React.createElement("path", {
          d: "M -320 362 C -20 350 280 372 540 360 C 820 348 1040 368 1320 356 L 1320 620 L -320 620 Z",
          fill: "url(#grassPattern)",
          opacity: 0.92,
        }),
      );
    }

    if (isUndefinedScenario) {
      return React.createElement(
        "g",
        terrainProps,
        React.createElement("rect", {
          x: -320,
          y: 430,
          width: rideLine.a.x + 360,
          height: 150,
          fill: "url(#grassPattern)",
        }),
        React.createElement("image", {
          id: stage === 2 && !introClicked ? "hill-click-target" : undefined,
          href: "assets/mountain.png",
          x: rideLine.a.x - 4,
          y: -20,
          width: 460,
          height: 600,
          preserveAspectRatio: "none",
        }),
      );
    }

    return React.createElement("path", {
      ...terrainProps,
      d: hillPath,
    });
  };

  return React.createElement(
    "div",
    { className: "slope-scene-wrap", ref: sceneRef },
    renderFormula(),
    React.createElement(
      "svg",
      {
        ref: svgRef,
        className: "slope-scene-svg",
        viewBox:
          "0 0 " + SLOPE_SCENE.viewBox.width + " " + SLOPE_SCENE.viewBox.height,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "pattern",
          {
            id: "grassPattern",
            width: "56",
            height: "56",
            patternUnits: "userSpaceOnUse",
          },
          React.createElement("rect", { width: "56", height: "56", fill: "#9dc85d" }),
          React.createElement("path", {
            d: "M0 20 C12 14 21 17 33 12 C43 8 49 9 56 5 L56 21 C44 26 33 22 21 28 C12 33 6 31 0 36 Z",
            fill: "#d7df67",
            opacity: "0.85",
          }),
          React.createElement("path", {
            d: "M0 45 C14 39 23 42 36 35 C44 31 50 31 56 29 L56 56 L0 56 Z",
            fill: "#699f4b",
            opacity: "0.72",
          }),
          React.createElement("circle", { cx: "9", cy: "8", r: "1.2", fill: "#476f34", opacity: "0.5" }),
          React.createElement("circle", { cx: "26", cy: "31", r: "1", fill: "#476f34", opacity: "0.45" }),
          React.createElement("circle", { cx: "44", cy: "17", r: "1.1", fill: "#476f34", opacity: "0.42" }),
        ),
        React.createElement("marker", {
          id: "arrow-green",
          markerWidth: "18",
          markerHeight: "18",
          refX: "15",
          refY: "9",
          orient: "auto-start-reverse",
          markerUnits: "userSpaceOnUse",
        }, React.createElement("path", { d: "M 0 0 L 18 9 L 0 18 z", fill: "#b6dd69" })),
        React.createElement("marker", {
          id: "arrow-blue",
          markerWidth: "27",
          markerHeight: "27",
          refX: "22.5",
          refY: "13.5",
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        }, React.createElement("path", { d: "M 0 0 L 27 13.5 L 0 27 z", fill: "#82c9ed" })),
        React.createElement("marker", {
          id: "arrow-yellow",
          markerWidth: "27",
          markerHeight: "27",
          refX: "22.5",
          refY: "13.5",
          orient: "auto",
          markerUnits: "userSpaceOnUse",
        }, React.createElement("path", { d: "M 0 0 L 27 13.5 L 0 27 z", fill: "#f7c534" })),
      ),
      renderGrid(),
      renderTerrain(),
      showLine
        ? React.createElement(
            "g",
            {
              id: stage === 5 && formulaPhase === "idle" ? "green-line-click-target" : undefined,
              className: "slope-line-group" + (stage === 5 ? " clickable" : ""),
              onClick: handleGreenLineClick,
            },
            renderDoubleHeadArrow(
              surfaceLineStart,
              surfaceLineEnd,
              "surface-line",
              "surface-arrow-head",
            ),
            React.createElement("line", {
              x1: surfaceLineStart.x,
              y1: surfaceLineStart.y,
              x2: surfaceLineEnd.x,
              y2: surfaceLineEnd.y,
              className: "arrow-hit-zone surface-hit-zone",
            }),
            renderSurfaceLabel(),
          )
        : null,
      renderMovementArrows(),
      renderCycle(),
    ),
  );
};
