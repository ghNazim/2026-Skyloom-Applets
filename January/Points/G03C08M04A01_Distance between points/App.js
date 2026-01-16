const App = () => {
  const { useState, useCallback, useEffect, useRef } = React;

  const [step, setStep] = useState(-1);
  const [key, setKey] = useState(Date.now());

  // Point positions - 2 points: A, B (horizontal, same Y)
  const [pointAPos, setPointAPos] = useState({ x: 25, y: 35 });
  const [pointBPos, setPointBPos] = useState({ x: 75, y: 35 });

  // Step 0 states - Line drawing
  const [lineSegmentDrawn, setLineSegmentDrawn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPoint, setDrawStartPoint] = useState(null);
  const [drawCurrentCoords, setDrawCurrentCoords] = useState(null);

  // Curves state
  const [upperCurve, setUpperCurve] = useState([]); // Pink curve (above line)
  const [lowerCurve, setLowerCurve] = useState([]); // Blue curve (below line)
  const [straightenedUpperCurve, setStraightenedUpperCurve] = useState([]);
  const [straightenedLowerCurve, setStraightenedLowerCurve] = useState([]);

  // Scribble drawing states (Step 2)
  const [userScribbles, setUserScribbles] = useState([]); // Array of scribble point arrays
  const [currentScribble, setCurrentScribble] = useState([]);
  const [isScribbling, setIsScribbling] = useState(false);
  const [scribbleStartPoint, setScribbleStartPoint] = useState(null); // "A" or "B"

  // Animation states
  const [isStraightening, setIsStraightening] = useState(false);
  const [straighteningProgress, setStraighteningProgress] = useState(0);
  const [isReversing, setIsReversing] = useState(false);
  const [showGraphLine, setShowGraphLine] = useState(false);
  const [pointsLowOpacity, setPointsLowOpacity] = useState(false);

  // MCQ states
  const [showActionButton, setShowActionButton] = useState(false);
  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [wrongSelection, setWrongSelection] = useState(null);

  // Step-specific phase states
  const [step0Phase, setStep0Phase] = useState(0); // 0: drawing, 1: line drawn, show button
  const [step1Phase, setStep1Phase] = useState(0); // 0: initial (curves shown), 1: comparison, 2: mcq, 3: final
  const [step2Phase, setStep2Phase] = useState(0); // 0: drawing scribbles, 1: comparison, 2: mcq, 3: final

  // Animation refs
  const animationRef = useRef(null);
  const straightenStartTime = useRef(null);

  // Step data structure for determining splash screens
  const stepData = [
    { showSplash: false }, // Step 0
    { showSplash: false }, // Step 1
    { showSplash: false }, // Step 2
    { showSplash: true }, // Step 3
  ];

  // Constants
  const ANIMATION_DURATION = 1500;
  const GRAPH_LINE_X = 10;
  const LINE_SPACING = 12;

  // Reset all states when step changes
  const resetStepStates = (newStep) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (newStep === 0) {
      setLineSegmentDrawn(false);
      setIsDrawing(false);
      setDrawStartPoint(null);
      setDrawCurrentCoords(null);
      setUpperCurve([]);
      setLowerCurve([]);
      setStraightenedUpperCurve([]);
      setStraightenedLowerCurve([]);
      setShowActionButton(false);
      setActionButtonDisabled(false);
      setStep0Phase(0);
      setPointsLowOpacity(false);
      setShowGraphLine(false);
      setIsStraightening(false);
      setStraighteningProgress(0);
      setIsReversing(false);
      setSelectedLine(null);
      setWrongSelection(null);
    } else if (newStep === 1) {
      setStep1Phase(0);
      setPointsLowOpacity(false);
      setShowGraphLine(false);
      setIsStraightening(false);
      setStraighteningProgress(0);
      setIsReversing(false);
      setSelectedLine(null);
      setWrongSelection(null);
      setShowActionButton(true);
      setActionButtonDisabled(false);
    } else if (newStep === 2) {
      setUserScribbles([]);
      setCurrentScribble([]);
      setIsScribbling(false);
      setScribbleStartPoint(null);
      setUpperCurve([]); // Clear generated curves from step 1
      setLowerCurve([]); // Clear generated curves from step 1
      setStraightenedUpperCurve([]); // Clear straightened curves
      setStraightenedLowerCurve([]); // Clear straightened curves
      setStep2Phase(0);
      setPointsLowOpacity(false);
      setShowGraphLine(false);
      setIsStraightening(false);
      setStraighteningProgress(0);
      setIsReversing(false);
      setSelectedLine(null);
      setWrongSelection(null);
      setShowActionButton(false);
      setActionButtonDisabled(true);
    }
  };

  useEffect(() => {
    resetStepStates(step);
  }, [step]);

  // Generate random curve points
  const generateRandomCurve = useCallback((side) => {
    const pointsCount = 80;
    const newCurve = [];
    const P1 = pointAPos;
    const P2 = pointBPos;

    const freq1 = 1.5 + Math.random() * 2;
    const amp1 = 4 + Math.random() * 4;
    const freq2 = 5 + Math.random() * 5;
    const amp2 = 2 + Math.random() * 2;

    const MIN_GAP = 4;

    const dx = P2.x - P1.x;
    const dy = P2.y - P1.y;
    const angle = Math.atan2(dy, dx);

    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const lx = P1.x + dx * t;
      const ly = P1.y + dy * t;

      const envelope = Math.sin(t * Math.PI);

      let rawOffset =
        Math.sin(t * Math.PI * freq1) * amp1 +
        Math.sin(t * Math.PI * freq2) * amp2;

      if (side === "upper") {
        rawOffset = -(Math.abs(rawOffset) + MIN_GAP);
      } else if (side === "lower") {
        rawOffset = Math.abs(rawOffset) + MIN_GAP;
      }

      const offset = rawOffset * envelope;
      const px = -Math.sin(angle) * offset;
      const py = Math.cos(angle) * offset;

      if (i === 0) newCurve.push({ ...P1 });
      else if (i === pointsCount) newCurve.push({ ...P2 });
      else newCurve.push({ x: lx + px, y: ly + py });
    }

    return newCurve;
  }, [pointAPos, pointBPos]);

  // Calculate path length
  const getPathLength = (points) => {
    if (!points || points.length < 2) return 0;
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  };

  // Get straight target for a curve (from sample.js)
  const getStraightTarget = useCallback((points, targetY) => {
    if (!points || points.length < 2) return [];
    const totalLength = getPathLength(points);
    const count = points.length;

    // Line starts at graph line X and extends horizontally
    const lineStart = { x: GRAPH_LINE_X, y: targetY };
    const lineEnd = { x: GRAPH_LINE_X + totalLength, y: targetY };

    return points.map((_, i) => ({
      x: lineStart.x + (lineEnd.x - lineStart.x) * (i / (count - 1)),
      y: lineStart.y + (lineEnd.y - lineStart.y) * (i / (count - 1)),
    }));
  }, []);

  // Handle line drawing start (Step 0)
  const handleLineDrawStart = useCallback(
    (coords, startPoint) => {
      if (step !== 0 || step0Phase !== 0 || isDrawing) return;
      setIsDrawing(true);
      setDrawStartPoint(startPoint);
      playSound("click");
    },
    [step, step0Phase, isDrawing]
  );

  // Handle line drawing (Step 0)
  const handleLineDraw = useCallback(
    (coords) => {
      if (step !== 0 || step0Phase !== 0 || !isDrawing) return;
      setDrawCurrentCoords(coords);
    },
    [step, step0Phase, isDrawing]
  );

  // Handle line drawing end (Step 0)
  const handleLineDrawEnd = useCallback(
    (coords, endPoint) => {
      if (step !== 0 || step0Phase !== 0 || !isDrawing) return;
      setIsDrawing(false);
      setDrawCurrentCoords(null);

      if (endPoint && endPoint !== drawStartPoint) {
        // Valid line drawn between A and B
        setLineSegmentDrawn(true);
        setStep0Phase(1);
        setShowActionButton(true);
        playSound("correct");
      }
      setDrawStartPoint(null);
    },
    [step, step0Phase, isDrawing, drawStartPoint]
  );

  // Handle scribble drawing start (Step 2)
  const handleScribbleStart = useCallback(
    (coords, startPointName) => {
      if (step !== 2 || step2Phase !== 0 || userScribbles.length >= 2) return;
      if (isScribbling) return;
      if (!coords || typeof coords.x !== 'number' || typeof coords.y !== 'number') return;

      // coords is already snapped to the point position from VisualPanel
      setIsScribbling(true);
      setScribbleStartPoint(startPointName);
      setCurrentScribble([{ x: coords.x, y: coords.y }]);
      playSound("click");
    },
    [step, step2Phase, userScribbles.length, isScribbling]
  );

  // Handle scribble drawing move (Step 2)
  const handleScribbleMove = useCallback(
    (coords) => {
      if (step !== 2 || !isScribbling) return;
      if (!coords || typeof coords.x !== 'number' || typeof coords.y !== 'number') return;
      
      setCurrentScribble((prev) => {
        if (!prev || prev.length === 0) return prev;
        const lastPoint = prev[prev.length - 1];
        if (!lastPoint) return prev;
        
        const dx = coords.x - lastPoint.x;
        const dy = coords.y - lastPoint.y;
        if (Math.sqrt(dx * dx + dy * dy) > 0.5) {
          return [...prev, { x: coords.x, y: coords.y }];
        }
        return prev;
      });
    },
    [step, isScribbling]
  );

  // Handle scribble drawing end (Step 2)
  const handleScribbleEnd = useCallback(
    (coords, endPoint) => {
      if (step !== 2 || !isScribbling) return;
      setIsScribbling(false);

      // Need at least 3 points for a valid scribble
      if (currentScribble.length < 3) {
        setCurrentScribble([]);
        setScribbleStartPoint(null);
        return;
      }

      // Check if scribble ends near the target point (the opposite of start point)
      const THRESHOLD = 8;
      const startedAtA = scribbleStartPoint === "A";
      const startedAtB = scribbleStartPoint === "B";

      if (!startedAtA && !startedAtB) {
        setCurrentScribble([]);
        setScribbleStartPoint(null);
        return;
      }

      const lastPoint = currentScribble[currentScribble.length - 1];
      const targetPoint = startedAtA ? pointBPos : pointAPos;
      const startPointPos = startedAtA ? pointAPos : pointBPos;
      const distToTarget = Math.sqrt(
        Math.pow(lastPoint.x - targetPoint.x, 2) +
        Math.pow(lastPoint.y - targetPoint.y, 2)
      );

      if (distToTarget < THRESHOLD) {
        // Valid scribble - snap endpoints
        const finalScribble = [...currentScribble];
        finalScribble[0] = { ...startPointPos };
        finalScribble[finalScribble.length - 1] = { ...targetPoint };

        const newScribbles = [...userScribbles, finalScribble];
        setUserScribbles(newScribbles);
        playSound("correct");

        // Enable compare button when at least 1 scribble is done
        if (newScribbles.length >= 1) {
          setShowActionButton(true);
          setActionButtonDisabled(false);
        }
      }
      setCurrentScribble([]);
      setScribbleStartPoint(null);
    },
    [step, isScribbling, currentScribble, scribbleStartPoint, pointAPos, pointBPos, userScribbles]
  );

  // Straightening animation for step 1
  const startStraighteningAnimation = useCallback(() => {
    setStep1Phase(1);
    setPointsLowOpacity(true);
    setShowActionButton(false);

    // Calculate straightened targets
    // Line segment (white) - Y position at top
    const whiteLine = [{ ...pointAPos }, { ...pointBPos }];
    const whiteLength = getPathLength(whiteLine);

    // Upper curve (pink) - position in middle
    const pinkLength = getPathLength(upperCurve);

    // Lower curve (blue) - position at bottom
    const blueLength = getPathLength(lowerCurve);

    // Calculate Y positions - white on top, pink in middle, blue at bottom
    const baseY = 25;
    const straightWhite = getStraightTarget(whiteLine, baseY);
    const straightPink = getStraightTarget(upperCurve, baseY + LINE_SPACING);
    const straightBlue = getStraightTarget(lowerCurve, baseY + LINE_SPACING * 2);

    setStraightenedUpperCurve(straightPink);
    setStraightenedLowerCurve(straightBlue);

    setIsStraightening(true);
    setStraighteningProgress(0);
    straightenStartTime.current = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - straightenStartTime.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Easing function
      const ease =
        progress < 0.5
          ? 8 * Math.pow(progress, 4)
          : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      setStraighteningProgress(ease);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsStraightening(false);
        setShowGraphLine(true);
        setStep1Phase(2); // MCQ phase
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [pointAPos, pointBPos, upperCurve, lowerCurve, getStraightTarget]);

  // Straightening animation for step 2 (user scribbles)
  const startScribbleStraighteningAnimation = useCallback(() => {
    setStep2Phase(1);
    setPointsLowOpacity(true);
    setShowActionButton(false);

    // Calculate straightened targets for scribbles
    const baseY = 25;

    // White line is always first
    const whiteLine = [{ ...pointAPos }, { ...pointBPos }];

    // Scribbles
    const straightScribbles = userScribbles.map((scribble, index) => {
      return getStraightTarget(scribble, baseY + LINE_SPACING * (index + 1));
    });

    // Store the straightened versions
    if (userScribbles.length >= 1) {
      setStraightenedUpperCurve(straightScribbles[0] || []);
    }
    if (userScribbles.length >= 2) {
      setStraightenedLowerCurve(straightScribbles[1] || []);
    }

    setIsStraightening(true);
    setStraighteningProgress(0);
    straightenStartTime.current = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - straightenStartTime.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      const ease =
        progress < 0.5
          ? 8 * Math.pow(progress, 4)
          : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      setStraighteningProgress(ease);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsStraightening(false);
        setShowGraphLine(true);
        setStep2Phase(2); // MCQ phase
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [pointAPos, pointBPos, userScribbles, getStraightTarget]);

  // Handle action button click (Connect/Compare button)
  const handleActionButtonClick = useCallback(() => {
    if (step === 0 && step0Phase === 1) {
      // Generate random curves and move to step 1
      const upper = generateRandomCurve("upper");
      const lower = generateRandomCurve("lower");
      setUpperCurve(upper);
      setLowerCurve(lower);
      playSound("click");
      setStep(1);
      setKey(Date.now());
    } else if (step === 1 && step1Phase === 0) {
      // Start comparison animation
      playSound("click");
      startStraighteningAnimation();
    } else if (step === 2 && step2Phase === 0) {
      // Start comparison animation for scribbles
      playSound("click");
      startScribbleStraighteningAnimation();
    }
  }, [step, step0Phase, step1Phase, step2Phase, generateRandomCurve, startStraighteningAnimation, startScribbleStraighteningAnimation]);

  // Handle line selection in MCQ
  const handleLineClick = useCallback((lineType) => {
    if (step === 1 && step1Phase === 2) {
      if (lineType === "white") {
        // Correct answer
        playSound("correct");
        setSelectedLine("white");
        // First hide the circles by changing phase, then start reverse animation
        setStep1Phase(1.5); // Intermediate phase - no MCQ circles
        setTimeout(() => {
          startReverseAnimation(1);
        }, 200);
      } else {
        // Wrong answer
        playSound("wrong");
        setWrongSelection(lineType);
        setTimeout(() => setWrongSelection(null), 1000);
      }
    } else if (step === 2 && step2Phase === 2) {
      if (lineType === "white") {
        // Correct answer
        playSound("correct");
        setSelectedLine("white");
        // First hide the circles by changing phase, then start reverse animation
        setStep2Phase(1.5); // Intermediate phase - no MCQ circles
        setTimeout(() => {
          startReverseAnimation(2);
        }, 200);
      } else {
        // Wrong answer
        playSound("wrong");
        setWrongSelection(lineType);
        setTimeout(() => setWrongSelection(null), 1000);
      }
    }
  }, [step, step1Phase, step2Phase]);

  // Reverse animation (unstraighten curves)
  const startReverseAnimation = useCallback((fromStep) => {
    setShowGraphLine(false);
    setIsReversing(true);
    setStraighteningProgress(1);
    straightenStartTime.current = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - straightenStartTime.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      const ease =
        progress < 0.5
          ? 8 * Math.pow(progress, 4)
          : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      setStraighteningProgress(1 - ease);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsReversing(false);
        setStraighteningProgress(0);
        setPointsLowOpacity(false);
        setSelectedLine(null);
        animationRef.current = null;

        // Move to final phase
        if (fromStep === 1) {
          setStep1Phase(3);
          setShowActionButton(true);
          setActionButtonDisabled(true);
        } else if (fromStep === 2) {
          setStep2Phase(3);
          setShowActionButton(false);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Check if next button should be enabled
  const isNextEnabled = () => {
    if (step === -1) {
      return true; // Intro splash screen - always enabled
    } else if (step === 0) {
      return false; // Line drawing step
    } else if (step === 1) {
      return step1Phase === 3; // After final animation
    } else if (step === 2) {
      return step2Phase === 3; // After final animation
    } else if (step === 3) {
      return true; // Last step
    }
    return false;
  };

  // Handle navigation
  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (step === -1) {
        setStep(0);
        setKey(Date.now());
      } else if (step === 3) {
        // Start Over - reset to step 0
        setStep(0);
        setKey(Date.now());
        // Also reset curves
        setUpperCurve([]);
        setLowerCurve([]);
        setLineSegmentDrawn(false);
      } else if (step < stepData.length - 1) {
        setStep(step + 1);
        setKey(Date.now());
      }
    } else {
      playSound("click");
      if (step > -1) {
        setStep(step - 1);
        setKey(Date.now());
      }
    }
  };

  // Create splash SVG with points and curves
  const createSplashSVG = () => {
    const P1 = pointAPos;
    const P2 = pointBPos;

    // Generate curves for splash screen
    const splashUpperCurve = generateRandomCurve("upper");
    const splashLowerCurve = generateRandomCurve("lower");

    const upperPath =
      splashUpperCurve.length > 0
        ? `M ${splashUpperCurve[0].x.toFixed(2)} ${splashUpperCurve[0].y.toFixed(2)} ` +
          splashUpperCurve
            .slice(1)
            .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(" ")
        : "";

    const lowerPath =
      splashLowerCurve.length > 0
        ? `M ${splashLowerCurve[0].x.toFixed(2)} ${splashLowerCurve[0].y.toFixed(2)} ` +
          splashLowerCurve
            .slice(1)
            .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(" ")
        : "";

    return React.createElement(
      "svg",
      {
        viewBox: "0 0 100 70",
        className: "splash-svg",
        style: { width: "100%", height: "100%" },
      },
      // Greyish rectangle surrounding points
      React.createElement("rect", {
        x: P1.x - 10,
        y: 10,
        width: P2.x - P1.x + 20,
        height: 50,
        fill: "rgba(128, 128, 128, 0.2)",
        stroke: "rgba(200, 200, 200, 0.6)",
        strokeWidth: 0.5,
        strokeDasharray: "2,2",
        rx: 3,
        ry: 3,
      }),
      // Straight line (yellow/golden)
      React.createElement("line", {
        x1: P1.x,
        y1: P1.y,
        x2: P2.x,
        y2: P2.y,
        stroke: "#FFD700",
        strokeWidth: 1.5,
      }),
      // Upper curve (blue)
      upperPath &&
        React.createElement("path", {
          d: upperPath,
          fill: "none",
          stroke: "#64B5F6",
          strokeWidth: 1.5,
        }),
      // Lower curve (pink)
      lowerPath &&
        React.createElement("path", {
          d: lowerPath,
          fill: "none",
          stroke: "#FF69B4",
          strokeWidth: 1.5,
        }),
      // Point A
      React.createElement("circle", {
        cx: P1.x,
        cy: P1.y,
        r: 3,
        fill: "#FFEB3B",
      }),
      React.createElement("circle", {
        cx: P1.x,
        cy: P1.y,
        r: 1.5,
        fill: "white",
      }),
      React.createElement(
        "text",
        {
          x: P1.x - 2,
          y: P1.y - 6,
          fill: "white",
          fontSize: 6,
          fontWeight: "bold",
          textAnchor: "middle",
        },
        "A"
      ),
      // Point B
      React.createElement("circle", {
        cx: P2.x,
        cy: P2.y,
        r: 3,
        fill: "#FFEB3B",
      }),
      React.createElement("circle", {
        cx: P2.x,
        cy: P2.y,
        r: 1.5,
        fill: "white",
      }),
      React.createElement(
        "text",
        {
          x: P2.x + 2,
          y: P2.y - 6,
          fill: "white",
          fontSize: 6,
          fontWeight: "bold",
          textAnchor: "middle",
        },
        "B"
      )
    );
  };

  // Render visual panel content based on step
  const renderVisualPanel = () => {
    // Handle step -1 (intro splash screen)
    if (step === -1) {
      return React.createElement(SplashScreen, {
        svgContent: createSplashSVG(),
        contentText: APP_DATA.stepIntro.contentText,
        boxes: null,
      });
    }

    // Step 3: Final splash screen
    if (step === 3) {
      return React.createElement(SplashScreen, {
        svgContent: createSplashSVG(),
        contentText: APP_DATA.step3.contentText,
        boxes: null,
      });
    }

    // Regular visual panel steps (0, 1, 2)
    return React.createElement(VisualPanel, {
      key: key,
      step,
      pointAPos,
      pointBPos,
      lineSegmentDrawn,
      isDrawing,
      drawCurrentCoords,
      drawStartPoint,
      upperCurve,
      lowerCurve,
      straightenedUpperCurve,
      straightenedLowerCurve,
      userScribbles,
      currentScribble,
      isScribbling,
      isStraightening,
      straighteningProgress,
      isReversing,
      showGraphLine,
      pointsLowOpacity,
      step0Phase,
      step1Phase,
      step2Phase,
      selectedLine,
      wrongSelection,
      onLineDrawStart: step === 0 && step0Phase === 0 ? handleLineDrawStart : null,
      onLineDraw: step === 0 && step0Phase === 0 ? handleLineDraw : null,
      onLineDrawEnd: step === 0 && step0Phase === 0 ? handleLineDrawEnd : null,
      onScribbleStart: step === 2 && step2Phase === 0 ? handleScribbleStart : null,
      onScribbleMove: step === 2 && step2Phase === 0 ? handleScribbleMove : null,
      onScribbleEnd: step === 2 && step2Phase === 0 ? handleScribbleEnd : null,
      onLineClick: (step === 1 && step1Phase === 2) || (step === 2 && step2Phase === 2) ? handleLineClick : null,
    });
  };

  // Get MCQ content based on step state
  const getMCQContent = () => {
    if (step === 0) {
      return step0Phase === 0
        ? APP_DATA.step0.infoText
        : APP_DATA.step0.infoTextAfterDraw;
    } else if (step === 1) {
      if (step1Phase === 0) return APP_DATA.step1.infoText;
      if (step1Phase === 2) return APP_DATA.step1.infoTextCompare;
      if (step1Phase === 3) return APP_DATA.step1.infoTextFinal;
      return null;
    } else if (step === 2) {
      if (step2Phase === 0) return APP_DATA.step2.infoText;
      if (step2Phase === 2) return APP_DATA.step2.infoTextCompare;
      if (step2Phase === 3) return APP_DATA.step2.infoTextFinal;
      return null;
    }
    return null;
  };

  // Get action button text
  const getActionButtonText = () => {
    if (step === 0 && step0Phase === 1) {
      return APP_DATA.step0.actionButtonText;
    } else if (step === 1 && step1Phase === 0) {
      return APP_DATA.step1.actionButtonText;
    } else if (step === 2 && step2Phase === 0) {
      return APP_DATA.step1.actionButtonText;
    }
    return null;
  };

  // Update question text based on step state
  const getQuestionText = () => {
    if (step === -1) {
      return APP_DATA.stepIntro.question;
    } else if (step === 0) {
      return step0Phase === 0
        ? APP_DATA.step0.question
        : APP_DATA.step0.questionAfterDraw;
    } else if (step === 1) {
      if (step1Phase === 2) return APP_DATA.step1.questionCompare;
      if (step1Phase === 3) return APP_DATA.step1.questionFinal;
      return APP_DATA.step1.question;
    } else if (step === 2) {
      if (step2Phase === 2) return APP_DATA.step2.questionCompare;
      if (step2Phase === 3) return APP_DATA.step2.questionFinal;
      return APP_DATA.step2.question;
    } else if (step === 3) {
      return APP_DATA.step3.question;
    }
    return "";
  };

  const getNavText = () => {
    if (step === -1) {
      return APP_DATA.stepIntro.navText;
    } else if (step === 0) {
      return step0Phase === 0
        ? APP_DATA.step0.navText
        : APP_DATA.step0.navTextAfterDraw;
    } else if (step === 1) {
      if (step1Phase === 0) return APP_DATA.step1.navText;
      if (step1Phase === 2) return APP_DATA.step1.navTextCompare;
      if (step1Phase === 3) return APP_DATA.step1.navTextFinal;
      return APP_DATA.step1.navText;
    } else if (step === 2) {
      if (step2Phase === 0) {
        if (userScribbles.length === 0) return APP_DATA.step2.navText;
        if (userScribbles.length === 1) return APP_DATA.step2.navTextOneScribble;
        return APP_DATA.step2.navTextTwoScribbles;
      }
      if (step2Phase === 2) return APP_DATA.step2.navTextCompare;
      if (step2Phase === 3) return APP_DATA.step2.navTextFinal;
      return APP_DATA.step2.navText;
    } else if (step === 3) {
      return APP_DATA.step3.navText;
    }
    return "";
  };

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
    }),
    step === -1 || step === 3
      ? React.createElement(
          "div",
          {
            className: "app-main-content",
            style: { display: "flex", flexDirection: "row" },
          },
          renderVisualPanel()
        )
      : React.createElement(
          "div",
          { className: "app-main-content" },
          React.createElement(
            "div",
            { className: "visual-panel" },
            renderVisualPanel()
          ),
          React.createElement(
            "div",
            { className: "mcq-panel-wrapper" },
            React.createElement(MCQPanel, {
              content: getMCQContent(),
              showActionButton: showActionButton,
              actionButtonText: getActionButtonText(),
              actionButtonDisabled: actionButtonDisabled,
              onActionButtonClick: handleActionButtonClick,
              step1Phase: step === 1 ? step1Phase : null,
              step2Phase: step === 2 ? step2Phase : null,
            })
          )
        ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: !isNextEnabled(),
        isPrevDisabled: step === -1,
        nextButtonText:
          step === -1
            ? APP_DATA.navButtonStart
            : step === 3
            ? APP_DATA.navButtonStartOver
            : null,
        navText: getNavText(),
        showTapGif: step === -1,
      })
    )
  );
};
