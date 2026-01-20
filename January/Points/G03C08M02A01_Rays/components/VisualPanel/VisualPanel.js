const VisualPanel = ({
  step,
  pointAPos,
  pointBPos,
  isDragging,
  onPointDrag,
  onDragStart,
  onDragEnd,
  draggedPoint,
  step0SubStep,
  onConnectClick,
  animationComplete,
  onConnectAnimationComplete,
  onExtendClick,
  extendAnimationComplete,
  onExtendAnimationComplete,
  sliderValue,
  onSliderChange,
  showDottedLine,
  showLineSegmentAB,
  showLineSegmentBC,
  showLineNameStep0,
  showArrow,
  arrowBlinking,
  selectedStartingPoint,
  onStartingPointClick,
  showStartingPointFeedback,
  isStartingPointCorrect,
  pointAColor,
  pointBColor,
  pointALabelColor,
  pointBLabelColor,
  showPointCircles,
  pointACircleColor,
  pointBCircleColor,
  labelABlinking,
  rayName,
  labelAAnimationComplete,
  labelBAnimationComplete,
  onLabelAAnimationComplete,
  onLabelBAnimationComplete,
  showArrowSymbol,
  showArrowCircle,
  onArrowCircleClick,
  overlinedBlinking,
  selectedOption,
  isCorrect,
  showFeedback,
  onOptionClick,
  showBAArrow,
  baArrowBlinking,
  originalArrowColor,
}) => {
  const { useRef, useEffect, useState } = React;
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const lineNameRef = useRef(null);
  const labelARef = useRef(null);
  const labelBRef = useRef(null);
  const [animatingLabel, setAnimatingLabel] = useState(null); // "A" or "B" or null
  const animationStartedRef = useRef(false); // Prevent double animation
  const aAnimationInProgressRef = useRef(false); // Track if A animation is actively running
  const lastProcessedAColorRef = useRef(null); // Track last processed color to prevent double triggers

  const [viewBox, setViewBox] = useState("0 0 100 70");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [extendAnimationProgress, setExtendAnimationProgress] = useState(0);
  const [pointsOnLine, setPointsOnLine] = useState([]);
  const [pointsOnBC, setPointsOnBC] = useState([]);
  const [draggedPointLocal, setDraggedPointLocal] = useState(
    draggedPoint || null
  );
  const [gridSpacing, setGridSpacing] = useState(5); // Base grid spacing

  // Update draggedPoint when prop changes
  useEffect(() => {
    setDraggedPointLocal(draggedPoint || null);
  }, [draggedPoint]);

  // Update grid spacing based on slider
  useEffect(() => {
    if (
      (step === 0 && step0SubStep === "extended") ||
      step0SubStep === "slider"
    ) {
      // Grid spacing decreases as slider increases (zooming out)
      // When slider = 1, spacing = 5
      // When slider = 2, spacing = 2.5 (double grid count)
      setGridSpacing(5 / sliderValue);
    } else {
      setGridSpacing(5);
    }
  }, [step, step0SubStep, sliderValue]);

  useEffect(() => {
    const updateViewBox = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width > 0 && height > 0) {
          const normalizedWidth = 100;
          const normalizedHeight = 70;
          setViewBox(`0 0 ${normalizedWidth} ${normalizedHeight}`);
        }
      }
    };

    const rafId = requestAnimationFrame(updateViewBox);
    updateViewBox();
    window.addEventListener("resize", updateViewBox);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateViewBox);
    };
  }, []);

  // Function to get mouse position relative to SVG
  const getSVGCoordinates = (event) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    if (event.touches && event.touches[0]) {
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY;
    } else {
      pt.x = event.clientX;
      pt.y = event.clientY;
    }
    const ctm = svg.getScreenCTM();
    if (ctm) {
      return pt.matrixTransform(ctm.inverse());
    }
    return pt;
  };

  // Step 0: Point dragging handlers
  const handlePointMouseDown = (e, pointId) => {
    if (step !== 0 || step0SubStep !== "initial") return;
    // For touch events, prevent default to stopping scrolling while dragging
    if (e.type === 'touchstart') {
      // e.preventDefault(); // Optional, depending on if we want to stop scroll entirely
    }
    e.stopPropagation();
    setDraggedPointLocal(pointId);
    onDragStart && onDragStart(pointId);
  };

  const handlePointMouseMove = (e) => {
    if (
      step !== 0 ||
      step0SubStep !== "initial" ||
      !isDragging ||
      !draggedPointLocal
    )
      return;
    const coords = getSVGCoordinates(e);
    // Snap to grid
    const snappedX = Math.round(coords.x / gridSpacing) * gridSpacing;
    const snappedY = Math.round(coords.y / gridSpacing) * gridSpacing;
    const snappedPos = { x: snappedX, y: snappedY };
    onPointDrag && onPointDrag(draggedPointLocal, snappedPos);
  };

  const handlePointMouseUp = () => {
    if (step !== 0) return;
    setDraggedPointLocal(null);
    onDragEnd && onDragEnd();
  };

  // Step 0: Connect animation effect
  useEffect(() => {
    if (step !== 0 || step0SubStep !== "connecting" || animationComplete) {
      return;
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const numPoints = 11; // Number of points to show on the line
    let lastPointCount = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      // Calculate points along the line
      const points = [];
      for (let i = 1; i < numPoints; i++) {
        const t = i / numPoints;
        const x = pointAPos.x + (pointBPos.x - pointAPos.x) * t;
        const y = pointAPos.y + (pointBPos.y - pointAPos.y) * t;
        if (t <= progress) {
          points.push({ x, y, id: `line-point-${i}` });
        }
      }

      // Play tick sound when a new point appears
      if (points.length > lastPointCount) {
        playSound("tick");
        lastPointCount = points.length;
      }

      setPointsOnLine(points);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          if (onConnectAnimationComplete) {
            onConnectAnimationComplete();
          }
        }, 0);
      }
    };

    const timeoutId = setTimeout(() => {
      animate();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    step,
    step0SubStep,
    animationComplete,
    pointAPos.x,
    pointAPos.y,
    pointBPos.x,
    pointBPos.y,
    onConnectAnimationComplete,
  ]);

  // Step 0: Extend animation effect
  useEffect(() => {
    if (step !== 0 || step0SubStep !== "extending" || extendAnimationComplete) {
      return;
    }

    // Calculate point C at the exact endpoint of dashed line (x=110)
    const dx = pointBPos.x - pointAPos.x;
    const dy = pointBPos.y - pointAPos.y;
    const extendRight = 110; // Same as dashed line endpoint
    let pointC;
    if (Math.abs(dx) < 0.001) {
      // Vertical line
      pointC = {
        x: pointAPos.x,
        y: 110,
      };
    } else {
      const tRight = (extendRight - pointAPos.x) / dx;
      pointC = {
        x: extendRight,
        y: pointAPos.y + dy * tRight,
      };
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const numPoints = 11;
    let lastPointCount = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setExtendAnimationProgress(progress);

      // Calculate points along BC
      const points = [];
      for (let i = 1; i < numPoints; i++) {
        const t = i / numPoints;
        const x = pointBPos.x + (pointC.x - pointBPos.x) * t;
        const y = pointBPos.y + (pointC.y - pointBPos.y) * t;
        if (t <= progress) {
          points.push({ x, y, id: `bc-point-${i}` });
        }
      }

      // Play tick sound when a new point appears
      if (points.length > lastPointCount) {
        playSound("tick");
        lastPointCount = points.length;
      }

      setPointsOnBC(points);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          if (onExtendAnimationComplete) {
            onExtendAnimationComplete();
          }
        }, 0);
      }
    };

    const timeoutId = setTimeout(() => {
      animate();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    step,
    step0SubStep,
    extendAnimationComplete,
    pointAPos.x,
    pointAPos.y,
    pointBPos.x,
    pointBPos.y,
    onExtendAnimationComplete,
  ]);

  // Calculate zoom effect (bring B closer to A) - applies to all steps after step 0 slider is used
  const getZoomedPointBPos = () => {
    // Use zoomed position if slider was used in step 0 (for steps 1+)
    // Or if we're still in step 0 with slider active
    if (
      (step === 0 &&
        (step0SubStep === "extended" || step0SubStep === "slider")) ||
      (step >= 1 && sliderValue > 1)
    ) {
      // Scale distance from A by 1/sliderValue to match grid scaling (which is 5/sliderValue)
      // This ensures that relative to grid units, the distance remains constant.
      const scale = 1 / sliderValue;
      const newX = pointAPos.x + (pointBPos.x - pointAPos.x) * scale;
      const newY = pointAPos.y + (pointBPos.y - pointAPos.y) * scale;
      return { x: newX, y: newY };
    }
    return pointBPos;
  };

  const zoomedBPos = getZoomedPointBPos();

  // Animation effect for label A (step 3)
  useEffect(() => {
    if (step !== 3 || labelAAnimationComplete) {
      animationStartedRef.current = false; // Reset when leaving step 3
      aAnimationInProgressRef.current = false; // Reset when leaving step 3
      lastProcessedAColorRef.current = null; // Reset when leaving step 3
      return;
    }

    // Check if A was just clicked (label color is green but animation not complete)
    // Also check if we've already processed this color change
    if (
      pointALabelColor === "#4CAF50" &&
      pointALabelColor !== lastProcessedAColorRef.current &&
      !labelAAnimationComplete &&
      !animatingLabel &&
      !animationStartedRef.current &&
      !aAnimationInProgressRef.current
    ) {
      lastProcessedAColorRef.current = pointALabelColor; // Mark this color as processed
      animationStartedRef.current = true; // Mark as started
      aAnimationInProgressRef.current = true; // Mark animation as in progress
      setAnimatingLabel("A");
      return;
    }

    // Only proceed with animation if we're actually animating and haven't started the GSAP animation yet
    if (
      !animatingLabel ||
      animatingLabel !== "A" ||
      animationStartedRef.current === false ||
      !aAnimationInProgressRef.current
    ) {
      return;
    }

    const labelAElement = labelARef.current;
    const lineNameElement = lineNameRef.current;

    if (!labelAElement || !lineNameElement) {
      return;
    }

    // Prevent double execution by checking if element already exists
    const existingCopy = document.querySelector(".animating-label-a");
    if (existingCopy) {
      return; // Animation already in progress
    }

    // Get positions
    const labelRect = labelAElement.getBoundingClientRect();
    const lineNameRect = lineNameElement.getBoundingClientRect();

    // Create animated copy
    const animatedCopy = document.createElement("div");
    animatedCopy.className = "animating-label-a"; // Add class to track
    animatedCopy.textContent = "A";
    animatedCopy.style.position = "fixed";
    animatedCopy.style.left = `${labelRect.left + labelRect.width / 2}px`;
    animatedCopy.style.top = `${labelRect.top + labelRect.height / 2}px`;
    animatedCopy.style.fontSize = `${labelRect.height}px`; // Match label size
    animatedCopy.style.fontWeight = "bold";
    animatedCopy.style.color = "#4CAF50";
    animatedCopy.style.pointerEvents = "none";
    animatedCopy.style.zIndex = "10000";
    animatedCopy.style.transform = "translate(-50%, -50%)";
    animatedCopy.style.fontFamily = "inherit";
    document.body.appendChild(animatedCopy);

    // Animate using GSAP
    const targetX = lineNameRect.left + lineNameRect.width / 2;
    const targetY = lineNameRect.top + lineNameRect.height / 2;

    const tween = gsap.to(animatedCopy, {
      x: targetX - (labelRect.left + labelRect.width / 2),
      y: targetY - (labelRect.top + labelRect.height / 2),
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        if (animatedCopy.parentNode) {
          document.body.removeChild(animatedCopy);
        }
        setAnimatingLabel(null);
        animationStartedRef.current = false; // Reset flag
        aAnimationInProgressRef.current = false; // Reset animation in progress flag
        if (onLabelAAnimationComplete) {
          onLabelAAnimationComplete();
        }
      },
    });

    // Cleanup function to kill animation if component unmounts or effect re-runs
    return () => {
      if (tween) {
        tween.kill();
      }
      if (animatedCopy && animatedCopy.parentNode) {
        document.body.removeChild(animatedCopy);
      }
    };
  }, [
    step,
    animatingLabel,
    labelAAnimationComplete,
    onLabelAAnimationComplete,
    pointALabelColor,
  ]);

  // Auto-trigger B animation when entering step 5
  useEffect(() => {
    if (step === 5 && !labelBAnimationComplete && !animatingLabel) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setAnimatingLabel("B");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [step, labelBAnimationComplete, animatingLabel]);

  // Animation effect for label B (step 5)
  useEffect(() => {
    if (
      step !== 5 ||
      !animatingLabel ||
      animatingLabel !== "B" ||
      labelBAnimationComplete
    ) {
      return;
    }

    const labelBElement = labelBRef.current;
    const lineNameElement = lineNameRef.current;

    if (!labelBElement || !lineNameElement) {
      return;
    }

    // Prevent double execution
    const existingCopy = document.querySelector(".animating-label-b");
    if (existingCopy) {
      return; // Animation already in progress
    }

    // Get positions
    const labelRect = labelBElement.getBoundingClientRect();
    const lineNameRect = lineNameElement.getBoundingClientRect();

    // Create animated copy
    const animatedCopy = document.createElement("div");
    animatedCopy.className = "animating-label-b"; // Add class to track
    animatedCopy.textContent = "B";
    animatedCopy.style.position = "fixed";
    animatedCopy.style.left = `${labelRect.left + labelRect.width / 2}px`;
    animatedCopy.style.top = `${labelRect.top + labelRect.height / 2}px`;
    animatedCopy.style.fontSize = `${labelRect.height}px`; // Match label size
    animatedCopy.style.fontWeight = "bold";
    animatedCopy.style.color = "white";
    animatedCopy.style.pointerEvents = "none";
    animatedCopy.style.zIndex = "10000";
    animatedCopy.style.transform = "translate(-50%, -50%)";
    animatedCopy.style.fontFamily = "inherit";
    document.body.appendChild(animatedCopy);

    // Animate using GSAP
    const targetX = lineNameRect.left + lineNameRect.width / 2;
    const targetY = lineNameRect.top + lineNameRect.height / 2;

    gsap.to(animatedCopy, {
      x: targetX - (labelRect.left + labelRect.width / 2),
      y: targetY - (labelRect.top + labelRect.height / 2),
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        if (animatedCopy.parentNode) {
          document.body.removeChild(animatedCopy);
        }
        setAnimatingLabel(null);
        if (onLabelBAnimationComplete) {
          onLabelBAnimationComplete();
        }
      },
    });
  }, [
    step,
    animatingLabel,
    labelBAnimationComplete,
    onLabelBAnimationComplete,
  ]);

  // Calculate extended dotted line coordinates
  // This should persist throughout all steps once it appears in step 0
  const getExtendedDottedLine = () => {
    if (!showDottedLine) {
      return null;
    }
    const dx = zoomedBPos.x - pointAPos.x;
    const dy = zoomedBPos.y - pointAPos.y;
    const extendLeft = -10;
    const extendRight = 110;
    if (Math.abs(dx) < 0.001) {
      return {
        x1: pointAPos.x,
        y1: -10,
        x2: pointAPos.x,
        y2: 110,
      };
    }
    const tLeft = (extendLeft - pointAPos.x) / dx;
    const tRight = (extendRight - pointAPos.x) / dx;
    return {
      x1: extendLeft,
      y1: pointAPos.y + dy * tLeft,
      x2: extendRight,
      y2: pointAPos.y + dy * tRight,
    };
  };

  const dottedLineCoords = getExtendedDottedLine();

  // Calculate arrow position and direction
  const getArrowData = () => {
    if (!showArrow) return null;
    // Calculate point C at the exact endpoint of dashed line (x=110)
    const dx = pointBPos.x - pointAPos.x;
    const dy = pointBPos.y - pointAPos.y;
    const extendRight = 110; // Same as dashed line endpoint
    let pointC;
    if (Math.abs(dx) < 0.001) {
      // Vertical line
      pointC = {
        x: pointAPos.x,
        y: 110,
      };
    } else {
      const tRight = (extendRight - pointAPos.x) / dx;
      pointC = {
        x: extendRight,
        y: pointAPos.y + dy * tRight,
      };
    }
    // Arrow direction is from zoomedBPos towards fixed point C
    const arrowDx = pointC.x - zoomedBPos.x;
    const arrowDy = pointC.y - zoomedBPos.y;
    const arrowDist = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
    // Arrow length is fixed at 13px (you can tweak this value to change arrow length)
    const ARROW_LENGTH = 13; // Fixed arrow length in viewBox units - tweak this value to adjust arrow length
    const arrowRatio = ARROW_LENGTH / arrowDist;
    const angle = Math.atan2(arrowDy, arrowDx);
    const arrowHeadSize = 6; // Increased from 2 to 4 for bigger arrowhead
    // Arrowhead tip should be exactly at arrowEnd
    const arrowEnd = {
      x: zoomedBPos.x + arrowDx * arrowRatio,
      y: zoomedBPos.y + arrowDy * arrowRatio,
    };
    // Line should end slightly before arrowEnd to avoid clipping through arrowhead
    // Calculate how far back the line should end based on arrowhead size
    const lineEndOffset = arrowHeadSize * 0.5; // Adjust this factor to fine-tune
    const lineEnd = {
      x: arrowEnd.x - lineEndOffset * Math.cos(angle),
      y: arrowEnd.y - lineEndOffset * Math.sin(angle),
    };
    // Arrow head points - bigger arrowhead
    // The arrowhead tip should be exactly at arrowEnd, with base points behind it
    const arrowHeadAngle = Math.PI / 5; // Slightly wider angle for better visibility
    // Calculate base points behind the tip (towards the start)
    const arrowHead1 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle - arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle - arrowHeadAngle),
    };
    const arrowHead2 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle + arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle + arrowHeadAngle),
    };
    return {
      start: zoomedBPos,
      end: arrowEnd, // Arrowhead tip position
      lineEnd: lineEnd, // Line endpoint (slightly before arrowhead tip)
      head1: arrowHead1,
      head2: arrowHead2,
      angle,
    };
  };

  const arrowData = getArrowData();

  // Calculate BA arrow (for step 6)
  // Arrow should start from B, go to A, then extend 13px from A
  const getBAArrowData = () => {
    if (!showBAArrow) return null;
    // Direction from B to A
    const dx = pointAPos.x - zoomedBPos.x;
    const dy = pointAPos.y - zoomedBPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const arrowHeadSize = 4;
    const arrowHeadAngle = Math.PI / 5;

    // Arrow extends 13px beyond point A
    const ARROW_LENGTH = 13;
    const arrowEnd = {
      x: pointAPos.x + ARROW_LENGTH * Math.cos(angle),
      y: pointAPos.y + ARROW_LENGTH * Math.sin(angle),
    };

    // Line should end slightly before arrowEnd to avoid clipping through arrowhead
    const lineEndOffset = arrowHeadSize * 0.5;
    const lineEnd = {
      x: arrowEnd.x - lineEndOffset * Math.cos(angle),
      y: arrowEnd.y - lineEndOffset * Math.sin(angle),
    };

    // Arrowhead base points
    const arrowHead1 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle - arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle - arrowHeadAngle),
    };
    const arrowHead2 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle + arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle + arrowHeadAngle),
    };

    return {
      start: zoomedBPos, // Start from B
      end: arrowEnd, // Arrowhead tip position (13px beyond A)
      lineEnd: lineEnd, // Line endpoint (slightly before arrowhead tip)
      head1: arrowHead1,
      head2: arrowHead2,
      angle,
    };
  };

  const baArrowData = getBAArrowData();

  // Create point element
  const createPoint = (
    x,
    y,
    name,
    isDraggable = false,
    showHintCircle = false,
    pointColor = "#FFEB3B",
    labelColor = "#4CAF50",
    showCircle = false,
    onCircleClick = null,
    pointIdOverride = null, // Allow explicit pointId when name is null
    circleColor = "white" // Circle color for step 3
  ) => {
    const pointId =
      pointIdOverride || (name === "A" ? "A" : name === "B" ? "B" : null);
    const isDragged = isDragging && draggedPointLocal === pointId;

    return React.createElement(
      "g",
      { key: `point-${pointId}` },
      // Outer circle (hint circle - only for dragging, not for label clicking)
      showHintCircle &&
        !showCircle &&
        React.createElement("circle", {
          cx: x,
          cy: y,
          r: 6,
          fill: "white",
          opacity: 0.15,
        }),
      // Transparent larger circle for easier dragging
      isDraggable &&
        React.createElement("circle", {
          cx: x,
          cy: y,
          r: 6,
          fill: "transparent",
          style: { cursor: "move" },
          onMouseDown: (e) => handlePointMouseDown(e, pointId),
          onTouchStart: (e) => handlePointMouseDown(e, pointId),
        }),
      // Point circles
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 3,
        fill: pointColor,
        className: isDraggable ? "draggable-point" : "",
        style: {
          cursor: isDraggable ? "move" : showCircle ? "pointer" : "default",
        },
        onMouseDown: isDraggable
          ? (e) => handlePointMouseDown(e, pointId)
          : showCircle && onCircleClick
          ? (e) => {
              e.stopPropagation();
              onCircleClick(pointId);
            }
          : null,
        onTouchStart: isDraggable
          ? (e) => handlePointMouseDown(e, pointId)
          : showCircle && onCircleClick
          ? (e) => {
              e.stopPropagation();
              onCircleClick(pointId);
            }
          : null,
      }),
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 1.5,
        fill: "white",
        style: { cursor: isDraggable ? "move" : "default" },
        onMouseDown: isDraggable
          ? (e) => handlePointMouseDown(e, pointId)
          : null,
        onTouchStart: isDraggable
          ? (e) => handlePointMouseDown(e, pointId)
          : null,
      }),
      // Point label
      name &&
        React.createElement(
          "g",
          { key: `label-${pointId}` },
          // Clickable circle on label (for step 3)
          showCircle &&
            onCircleClick &&
            React.createElement("circle", {
              cx: x - 5, // Label x position
              cy: y - 9, // Label y position (centered on text)
              r: 6,
              fill: circleColor || "white", // Use circleColor prop
              opacity: circleColor && circleColor !== "white" ? 0.3 : 0.15, // Higher opacity when colored
              style: { cursor: "pointer" },
              onClick: (e) => {
                e.stopPropagation();
                onCircleClick(pointId);
              },
            }),
          React.createElement(
            "text",
            {
              ref: name === "A" ? labelARef : name === "B" ? labelBRef : null,
              x: x - 5,
              y: y - 6,
              fill: labelColor,
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "middle",
              className: labelABlinking && name === "A" ? "blinking-text" : "",
              style:
                (showCircle && onCircleClick) || (step === 5 && name === "B")
                  ? { cursor: "pointer" }
                  : {},
              onClick:
                showCircle && onCircleClick
                  ? (e) => {
                      e.stopPropagation();
                      onCircleClick(pointId);
                    }
                  : step === 5 && name === "B" && !labelBAnimationComplete
                  ? (e) => {
                      e.stopPropagation();
                      setAnimatingLabel("B");
                    }
                  : null,
            },
            name
          )
        )
    );
  };

  // Render grid lines - Anchored to Point A
  const renderGrid = () => {
    // Show grid throughout the applet
    if (step < 0) return null;
    const gridLines = [];
    const gridColor = "rgba(173, 216, 230, 0.2)"; // Light blue, very subtle

    const minX = 0;
    const maxX = 100;
    const minY = 0;
    const maxY = 70;

    // Vertical lines aligned with pointAPos.x
    // We want lines at pointAPos.x + k * gridSpacing
    const startKX = Math.ceil((minX - pointAPos.x) / gridSpacing);
    const endKX = Math.floor((maxX - pointAPos.x) / gridSpacing);

    for (let k = startKX; k <= endKX; k++) {
      const x = pointAPos.x + k * gridSpacing;
      gridLines.push(
        React.createElement("line", {
          key: `v-${k}`,
          x1: x,
          y1: minY,
          x2: x,
          y2: maxY,
          stroke: gridColor,
          strokeWidth: 0.1,
        })
      );
    }

    // Horizontal lines aligned with pointAPos.y
    const startKY = Math.ceil((minY - pointAPos.y) / gridSpacing);
    const endKY = Math.floor((maxY - pointAPos.y) / gridSpacing);

    for (let k = startKY; k <= endKY; k++) {
      const y = pointAPos.y + k * gridSpacing;
      gridLines.push(
        React.createElement("line", {
          key: `h-${k}`,
          x1: minX,
          y1: y,
          x2: maxX,
          y2: y,
          stroke: gridColor,
          strokeWidth: 0.1,
        })
      );
    }

    return gridLines;
  };

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: "visual-panel-container",
      style: { position: "relative" },
    },
    React.createElement(
      "svg",
      {
        ref: svgRef,
        className: "visual-panel-svg",
        viewBox: viewBox,
        onMouseMove:
          step === 0 && step0SubStep === "initial"
            ? handlePointMouseMove
            : null,
        onMouseUp: step === 0 ? handlePointMouseUp : null,
        onTouchMove:
          step === 0 && step0SubStep === "initial"
            ? (e) => {
                e.preventDefault();
                handlePointMouseMove(e);
              }
            : null,
        onTouchEnd:
          step === 0
            ? (e) => {
                e.preventDefault();
                handlePointMouseUp();
              }
            : null,
      },
      // Grid lines (step 0)
      renderGrid(),
      // Dotted line extending beyond canvas (all steps once it appears in step 0)
      dottedLineCoords &&
        React.createElement("line", {
          x1: dottedLineCoords.x1,
          y1: dottedLineCoords.y1,
          x2: dottedLineCoords.x2,
          y2: dottedLineCoords.y2,
          stroke: "gray",
          strokeWidth: 0.5,
          strokeDasharray: "1,1",
        }),
      // Line segment AB (step 0, after connect animation)
      step === 0 &&
        showLineSegmentAB &&
        React.createElement("line", {
          x1: pointAPos.x,
          y1: pointAPos.y,
          x2: zoomedBPos.x,
          y2: zoomedBPos.y,
          stroke: "white",
          strokeWidth: 1.2,
        }),
      // Line segment BC (step 0, after extend animation)
      // Point C should stay at the exact endpoint of dotted line, only B moves closer
      step === 0 &&
        showLineSegmentBC &&
        (() => {
          // Calculate point C at the exact endpoint of dashed line (x=110)
          const dx = pointBPos.x - pointAPos.x;
          const dy = pointBPos.y - pointAPos.y;
          const extendRight = 110; // Same as dashed line endpoint
          let pointC;
          if (Math.abs(dx) < 0.001) {
            // Vertical line
            pointC = {
              x: pointAPos.x,
              y: 110,
            };
          } else {
            const tRight = (extendRight - pointAPos.x) / dx;
            pointC = {
              x: extendRight,
              y: pointAPos.y + dy * tRight,
            };
          }
          // Line starts from zoomedBPos (B moves closer) and ends at fixed point C
          return React.createElement("line", {
            x1: zoomedBPos.x,
            y1: zoomedBPos.y,
            x2: pointC.x,
            y2: pointC.y,
            stroke: "white",
            strokeWidth: 1.2,
          });
        })(),
      // Points on line AB (step 0, connect animation)
      step === 0 &&
        step0SubStep === "connecting" &&
        pointsOnLine.map((point) =>
          React.createElement(
            "g",
            { key: point.id },
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 2.25,
              fill: "#FFEB3B",
            }),
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 1.125,
              fill: "white",
            })
          )
        ),
      // Points on line BC (step 0, extend animation)
      step === 0 &&
        step0SubStep === "extending" &&
        pointsOnBC.map((point) =>
          React.createElement(
            "g",
            { key: point.id },
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 2.25,
              fill: "#FFEB3B",
            }),
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 1.125,
              fill: "white",
            })
          )
        ),
      // Arrow (steps 2+)
      arrowData &&
        step >= 2 &&
        React.createElement(
          "g",
          {
            className: arrowBlinking ? "blinking-arrow" : "",
            style: {
              opacity: step === 2 ? (arrowBlinking ? 1 : 1) : 1,
              transition: step === 2 ? "opacity 0.5s ease" : "none",
            },
          },
          React.createElement("line", {
            x1: arrowData.start.x,
            y1: arrowData.start.y,
            x2: arrowData.lineEnd.x,
            y2: arrowData.lineEnd.y,
            stroke: originalArrowColor,
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${arrowData.end.x} ${arrowData.end.y} L ${arrowData.head1.x} ${arrowData.head1.y} L ${arrowData.head2.x} ${arrowData.head2.y} Z`,
            fill: originalArrowColor,
          }),
          // Arrow circle for step 5
          step === 5 &&
            showArrowCircle &&
            React.createElement("circle", {
              cx: arrowData.end.x,
              cy: arrowData.end.y,
              r: 6,
              fill: "white",
              opacity: 0.15,
              style: { cursor: "pointer" },
              onClick: (e) => {
                e.stopPropagation();
                onArrowCircleClick && onArrowCircleClick();
              },
            })
        ),
      // Line segment AB (steps 1+, also show BC if it was created in step 0)
      step >= 1 &&
        React.createElement("line", {
          x1: pointAPos.x,
          y1: pointAPos.y,
          x2: zoomedBPos.x,
          y2: zoomedBPos.y,
          stroke: "white",
          strokeWidth: 1.2,
        }),
      // BA Arrow (step 6) - rendered after white line segment to appear on top
      baArrowData &&
        step === 6 &&
        showBAArrow &&
        React.createElement(
          "g",
          {
            className: baArrowBlinking ? "blinking-arrow" : "",
            style: {
              opacity: baArrowBlinking ? 1 : 1,
            },
          },
          React.createElement("line", {
            x1: baArrowData.start.x,
            y1: baArrowData.start.y,
            x2: baArrowData.lineEnd.x,
            y2: baArrowData.lineEnd.y,
            stroke: isCorrect ? "#4CAF50" : "#FFA07A", // Salmon color
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${baArrowData.end.x} ${baArrowData.end.y} L ${baArrowData.head1.x} ${baArrowData.head1.y} L ${baArrowData.head2.x} ${baArrowData.head2.y} Z`,
            fill: isCorrect ? "#4CAF50" : "#FFA07A",
          })
        ),
      // Line segment BC (steps 1+, if it was created in step 0, but hide when arrow appears in step 2+)
      // Point C stays fixed at exact endpoint of dotted line, only B moves
      step >= 1 &&
        step < 2 &&
        showLineSegmentBC &&
        (() => {
          // Calculate point C at the exact endpoint of dashed line (x=110)
          const dx = pointBPos.x - pointAPos.x;
          const dy = pointBPos.y - pointAPos.y;
          const extendRight = 110; // Same as dashed line endpoint
          let pointC;
          if (Math.abs(dx) < 0.001) {
            // Vertical line
            pointC = {
              x: pointAPos.x,
              y: 110,
            };
          } else {
            const tRight = (extendRight - pointAPos.x) / dx;
            pointC = {
              x: extendRight,
              y: pointAPos.y + dy * tRight,
            };
          }
          // Line starts from zoomedBPos (B moves closer) and ends at fixed point C
          return React.createElement("line", {
            x1: zoomedBPos.x,
            y1: zoomedBPos.y,
            x2: pointC.x,
            y2: pointC.y,
            stroke: "white",
            strokeWidth: 1.2,
          });
        })(),
      // Dotted line extending left from A (steps 1+)
      step >= 1 &&
        (() => {
          const dx = zoomedBPos.x - pointAPos.x;
          const dy = zoomedBPos.y - pointAPos.y;
          if (Math.abs(dx) < 0.001) {
            // Vertical line
            return React.createElement("line", {
              x1: pointAPos.x,
              y1: -10,
              x2: pointAPos.x,
              y2: pointAPos.y,
              stroke: "lightblue",
              strokeWidth: 0.5,
              strokeDasharray: "1,1",
              opacity: 0.5,
            });
          }
          const tLeft = (-10 - pointAPos.x) / dx;
          const yLeft = pointAPos.y + dy * tLeft;
          return React.createElement("line", {
            x1: -10,
            y1: yLeft,
            x2: pointAPos.x,
            y2: pointAPos.y,
            stroke: "lightblue",
            strokeWidth: 0.5,
            strokeDasharray: "1,1",
            opacity: 0.5,
          });
        })(),
      // Points A and B
      createPoint(
        pointAPos.x,
        pointAPos.y,
        step >= 0 ? "A" : null, // Show label from step 0
        step === 0 && step0SubStep === "initial",
        false, // Remove hint circles in step 0
        step === 3 ? pointAColor : "#FFEB3B",
        step === 3 ? pointALabelColor : "white", // Use label color for step 3
        step === 3 ? showPointCircles : false,
        step === 3 ? onStartingPointClick : null,
        "A", // Explicit pointId
        null, // labelBColor not needed for A
        step === 3 ? pointACircleColor : "white" // Circle color for step 3
      ),
      createPoint(
        zoomedBPos.x,
        zoomedBPos.y,
        step >= 0 ? "B" : null, // Show label from step 0
        step === 0 && step0SubStep === "initial",
        false, // Remove hint circles in step 0
        step === 3 ? pointBColor : "#FFEB3B",
        step === 3 ? pointBLabelColor : "white", // Use label color for step 3
        step === 3 ? showPointCircles : false,
        step === 3 ? onStartingPointClick : null,
        "B", // Explicit pointId
        step === 3 ? pointBLabelColor : null, // Separate label color for B
        step === 3 ? pointBCircleColor : "white" // Circle color for step 3
      )
    ),
    // Line name div (step 0, after animation completes)
    step === 0 &&
      showLineNameStep0 &&
      React.createElement(
        "div",
        {
          className: "line-name",
        },
        React.createElement("span", {
          dangerouslySetInnerHTML: { __html: APP_DATA.step0.lineName },
        })
      ),
    // Line name div (steps 1+)
    step >= 1 &&
      React.createElement(
        "div",
        {
          ref: lineNameRef,
          className: `line-name ${
            step >= 5 && showArrowSymbol ? "line-name-orange" : ""
          }`,
        },
        APP_DATA.rayLabel,
        step >= 3 &&
          React.createElement("span", {
            className: `line-segment-name ${
              overlinedBlinking ? "blinking-text" : ""
            }`,
            style: {
              position: "relative",
              display: "inline-block",
              // Remove background color when arrow symbol is shown
              backgroundColor: showArrowSymbol ? "transparent" : undefined,
            },
            dangerouslySetInnerHTML: {
              __html: showArrowSymbol
                ? arrow(rayName || APP_DATA.rayPlaceholder)
                : rayName || APP_DATA.rayPlaceholder,
            },
          })
      ),
    // BA label as HTML (step 6)
    step === 6 &&
      showBAArrow &&
      baArrowData &&
      React.createElement("span", {
        style: {
          position: "absolute",
          left: `${
            ((baArrowData.start.x + baArrowData.end.x) / 2 / 100) * 100
          }%`,
          top: `${
            ((baArrowData.start.y + baArrowData.end.y) / 2 / 70) * 100 + 8
          }%`,
          transform: "translate(-50%, 0)",
          color: isCorrect ? "#4CAF50" : "#FFA07A",
          fontSize: "3vw",
          fontWeight: "bold",
          pointerEvents: "none",
        },
        dangerouslySetInnerHTML: { __html: arrow("BA") },
      })
  );
};
