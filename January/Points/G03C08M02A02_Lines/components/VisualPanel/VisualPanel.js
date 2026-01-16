const VisualPanel = ({
  step,
  pointAPos,
  pointBPos,
  pointPPos,
  pointQPos,
  isDragging,
  onPointDrag,
  onDragStart,
  onDragEnd,
  draggedPoint,
  step0SubStep,
  step1SubStep,
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
  showLineSegmentAE,
  showLineNameStep0,
  showArrow,
  arrowOpacity,
  arrowBlinking,
  selectedStartingPoint,
  onStartingPointClick,
  showStartingPointFeedback,
  isStartingPointCorrect,
  pointAColor,
  pointBColor,
  pointALabelColor,
  pointBLabelColor,
  showLeftArrow,
  showRightArrow,
  lineName,
  firstPointTapped,
  secondPointTapped,
  showPointCircles,
  showACircle,
  showBCircle,
  onPointTap,
  showDoubleArrowCircle,
  showDoubleArrowSymbol,
  onDoubleArrowClick,
  pointACircleColor,
  pointBCircleColor,
  labelABlinking,
  rayName,
  labelAAnimationComplete,
  labelBAnimationComplete,
  onLabelAAnimationComplete,
  onLabelBAnimationComplete,
  animationTrigger,
  showArrowSymbol,
  showArrowCircle,
  onArrowCircleClick,
  overlinedBlinking,
  lineSegmentNameBlinking,
  abBlinking,
  selectedOption,
  isCorrect,
  showFeedback,
  onOptionClick,
  showBAArrow,
  baArrowBlinking,
  originalArrowColor,
  pointsPlaced,
  showLineSegmentPQ,
  onLineClick,
  arrowLength,
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
      step0SubStep === "slider" ||
      (step === 1 &&
        (step1SubStep === "extended" || step1SubStep === "slider")) ||
      (step >= 2 && sliderValue > 1)
    ) {
      // Grid spacing decreases as slider increases (zooming out)
      // When slider = 1, spacing = 5
      // When slider = 2, spacing = 2.5 (double grid count)
      setGridSpacing(5 / sliderValue);
    } else {
      setGridSpacing(5);
    }
  }, [step, step0SubStep, step1SubStep, sliderValue]);

  // Step 1: Extend animation effect (A to E)
  const [pointsOnAE, setPointsOnAE] = useState([]);
  useEffect(() => {
    if (step !== 1 || step1SubStep !== "extending" || extendAnimationComplete) {
      return;
    }

    // Calculate point E (10px before canvas 0)
    const dx = pointBPos.x - pointAPos.x;
    const dy = pointBPos.y - pointAPos.y;
    const extendLeft = -10;
    let pointE;
    if (Math.abs(dx) < 0.001) {
      pointE = { x: pointAPos.x, y: -10 };
    } else {
      const tLeft = (extendLeft - pointAPos.x) / dx;
      pointE = {
        x: extendLeft,
        y: pointAPos.y + dy * tLeft,
      };
    }

    const duration = 2000;
    const startTime = Date.now();
    const numPoints = 11;
    let lastPointCount = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const points = [];
      for (let i = 1; i < numPoints; i++) {
        const t = i / numPoints;
        const x = pointAPos.x + (pointE.x - pointAPos.x) * t;
        const y = pointAPos.y + (pointE.y - pointAPos.y) * t;
        if (t <= progress) {
          points.push({ x, y, id: `ae-point-${i}` });
        }
      }

      if (points.length > lastPointCount) {
        playSound("tick");
        lastPointCount = points.length;
      }

      setPointsOnAE(points);

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
    step1SubStep,
    extendAnimationComplete,
    pointAPos.x,
    pointAPos.y,
    pointBPos.x,
    pointBPos.y,
    onExtendAnimationComplete,
  ]);

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

  // Calculate zoom effect (bring A and B closer together) - applies to all steps after slider is used
  const getZoomedPointAPos = () => {
    // Use zoomed position if slider was used in step 1 or if we're in step 2+ with sliderValue > 1
    const shouldZoom =
      (step === 1 &&
        (step1SubStep === "extended" || step1SubStep === "slider")) ||
      (step >= 2 && sliderValue && sliderValue > 1);
    if (shouldZoom) {
      // When slider = 1, A is at original position
      // When slider = 2, A moves towards midpoint
      const currentSliderValue = sliderValue || 1;
      const t = (currentSliderValue - 1) / 1; // 0 to 1
      const midpointX = (pointAPos.x + pointBPos.x) / 2;
      const midpointY = (pointAPos.y + pointBPos.y) / 2;
      const newX = pointAPos.x + (midpointX - pointAPos.x) * t * 0.5;
      const newY = pointAPos.y + (midpointY - pointAPos.y) * t * 0.5;
      return { x: newX, y: newY };
    }
    return pointAPos;
  };

  const getZoomedPointBPos = () => {
    // Use zoomed position if slider was used in step 1 or if we're in step 2+ with sliderValue > 1
    const shouldZoom =
      (step === 1 &&
        (step1SubStep === "extended" || step1SubStep === "slider")) ||
      (step >= 2 && sliderValue && sliderValue > 1);
    if (shouldZoom) {
      // When slider = 1, B is at original position
      // When slider = 2, B moves towards midpoint
      const currentSliderValue = sliderValue || 1;
      const t = (currentSliderValue - 1) / 1; // 0 to 1
      const midpointX = (pointAPos.x + pointBPos.x) / 2;
      const midpointY = (pointAPos.y + pointBPos.y) / 2;
      const newX = pointBPos.x + (midpointX - pointBPos.x) * t * 0.5;
      const newY = pointBPos.y + (midpointY - pointBPos.y) * t * 0.5;
      return { x: newX, y: newY };
    }
    return pointBPos;
  };

  const zoomedAPos = getZoomedPointAPos();
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

  // No auto-trigger B animation in step 5 - animation only happens in step 4

  // Animation effect for label B (step 4 only, not step 5)
  useEffect(() => {
    if (
      step !== 4 ||
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

  // Animation effect for labels in step 4
  useEffect(() => {
    if (step !== 4 || !firstPointTapped || animationTrigger === 0) return;

    const animateLabel = (pointId) => {
      const labelElement =
        pointId === "A" ? labelARef.current : labelBRef.current;
      const lineNameElement = lineNameRef.current;

      if (!labelElement || !lineNameElement) return;

      const existingCopy = document.querySelector(
        `.animating-label-${pointId.toLowerCase()}-step4`
      );
      if (existingCopy) return;

      const labelRect = labelElement.getBoundingClientRect();
      const lineNameRect = lineNameElement.getBoundingClientRect();

      const animatedCopy = document.createElement("div");
      animatedCopy.className = `animating-label-${pointId.toLowerCase()}-step4`;
      animatedCopy.textContent = pointId;
      animatedCopy.style.position = "fixed";
      animatedCopy.style.left = `${labelRect.left + labelRect.width / 2}px`;
      animatedCopy.style.top = `${labelRect.top + labelRect.height / 2}px`;
      animatedCopy.style.fontSize = `${labelRect.height}px`;
      animatedCopy.style.fontWeight = "bold";
      animatedCopy.style.color = "#FFEB3B";
      animatedCopy.style.pointerEvents = "none";
      animatedCopy.style.zIndex = "10000";
      animatedCopy.style.transform = "translate(-50%, -50%)";
      animatedCopy.style.fontFamily = "inherit";
      document.body.appendChild(animatedCopy);

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
          if (pointId === "A" && onLabelAAnimationComplete) {
            onLabelAAnimationComplete();
          } else if (pointId === "B" && onLabelBAnimationComplete) {
            onLabelBAnimationComplete();
          }
        },
      });
    };

    // Animate first point if just tapped and animation hasn't completed
    if (firstPointTapped && !secondPointTapped) {
      if (firstPointTapped === "A" && !labelAAnimationComplete) {
        const timer = setTimeout(() => animateLabel("A"), 10);
        return () => clearTimeout(timer);
      } else if (firstPointTapped === "B" && !labelBAnimationComplete) {
        const timer = setTimeout(() => animateLabel("B"), 10);
        return () => clearTimeout(timer);
      }
    }

    // Animate second point if just tapped and animation hasn't completed
    if (secondPointTapped) {
      const secondPoint = firstPointTapped === "A" ? "B" : "A";
      // Check if we need to animate the second point
      if (secondPoint === "A" && !labelAAnimationComplete) {
        const timer = setTimeout(() => {
          // Double-check the state hasn't changed
          if (!labelAAnimationComplete) {
            animateLabel("A");
          }
        }, 100);
        return () => clearTimeout(timer);
      } else if (secondPoint === "B" && !labelBAnimationComplete) {
        const timer = setTimeout(() => {
          // Double-check the state hasn't changed
          if (!labelBAnimationComplete) {
            animateLabel("B");
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [
    step,
    firstPointTapped,
    secondPointTapped,
    labelAAnimationComplete,
    labelBAnimationComplete,
    animationTrigger,
    onLabelAAnimationComplete,
    onLabelBAnimationComplete,
  ]);

  // Calculate extended dotted line coordinates
  // This should persist throughout all steps once it appears in step 0
  const getExtendedDottedLine = () => {
    if (!showDottedLine) {
      return null;
    }
    const dx = zoomedBPos.x - zoomedAPos.x;
    const dy = zoomedBPos.y - zoomedAPos.y;
    const extendLeft = -10;
    const extendRight = 110;
    if (Math.abs(dx) < 0.001) {
      return {
        x1: zoomedAPos.x,
        y1: -10,
        x2: zoomedAPos.x,
        y2: 110,
      };
    }
    const tLeft = (extendLeft - zoomedAPos.x) / dx;
    const tRight = (extendRight - zoomedAPos.x) / dx;
    return {
      x1: extendLeft,
      y1: zoomedAPos.y + dy * tLeft,
      x2: extendRight,
      y2: zoomedAPos.y + dy * tRight,
    };
  };

  const dottedLineCoords = getExtendedDottedLine();

  // Helper function to find nearest point on a line segment
  const findNearestPointOnLine = (clickPos, lineStart, lineEnd) => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const lengthSq = dx * dx + dy * dy;

    if (lengthSq === 0) return lineStart;

    const t = Math.max(
      0,
      Math.min(
        1,
        ((clickPos.x - lineStart.x) * dx + (clickPos.y - lineStart.y) * dy) /
          lengthSq
      )
    );

    return {
      x: lineStart.x + t * dx,
      y: lineStart.y + t * dy,
    };
  };

  // Helper function to find nearest point on the full line (AB segment + both arrows) for step 6
  const findNearestPointOnFullLine = (clickPos) => {
    if (!dottedLineCoords) return clickPos;

    // Get arrow data
    const leftArrowData = getLeftArrowData();
    const rightArrowData = getRightArrowData();

    // Define line segments: left arrow, AB segment, right arrow
    const segments = [];

    // Left arrow segment (from E to A)
    if (leftArrowData) {
      const dx = zoomedBPos.x - zoomedAPos.x;
      const dy = zoomedBPos.y - zoomedAPos.y;
      const extendLeft = -10;
      let pointE;
      if (Math.abs(dx) < 0.001) {
        pointE = { x: zoomedAPos.x, y: -10 };
      } else {
        const tLeft = (extendLeft - zoomedAPos.x) / dx;
        pointE = {
          x: extendLeft,
          y: zoomedAPos.y + dy * tLeft,
        };
      }
      segments.push({ start: pointE, end: zoomedAPos });
    }

    // AB segment
    segments.push({ start: zoomedAPos, end: zoomedBPos });

    // Right arrow segment (from B to C)
    if (rightArrowData) {
      const dx = zoomedBPos.x - zoomedAPos.x;
      const dy = zoomedBPos.y - zoomedAPos.y;
      const extendRight = 110;
      let pointC;
      if (Math.abs(dx) < 0.001) {
        pointC = { x: zoomedAPos.x, y: 110 };
      } else {
        const tRight = (extendRight - zoomedAPos.x) / dx;
        pointC = {
          x: extendRight,
          y: zoomedAPos.y + dy * tRight,
        };
      }
      segments.push({ start: zoomedBPos, end: pointC });
    }

    // Find nearest point across all segments
    let nearestPoint = clickPos;
    let minDistance = Infinity;

    segments.forEach((segment) => {
      const pointOnSegment = findNearestPointOnLine(
        clickPos,
        segment.start,
        segment.end
      );
      const distance = Math.sqrt(
        Math.pow(clickPos.x - pointOnSegment.x, 2) +
          Math.pow(clickPos.y - pointOnSegment.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = pointOnSegment;
      }
    });

    // Only snap if within reasonable distance (5 units)
    if (minDistance <= 5) {
      return nearestPoint;
    }

    return null; // Click too far from line
  };

  // Calculate arrow position and direction
  const getArrowData = () => {
    if (!showArrow && step !== 0) return null;
    // For step 0, use original positions; for later steps, use zoomed positions
    const aPos = step === 0 ? pointAPos : zoomedAPos;
    const bPos = step === 0 ? pointBPos : zoomedBPos;
    // Calculate point C at the exact endpoint of dashed line (x=110)
    const dx = bPos.x - aPos.x;
    const dy = bPos.y - aPos.y;
    const extendRight = 110; // Same as dashed line endpoint
    let pointC;
    if (Math.abs(dx) < 0.001) {
      // Vertical line
      pointC = {
        x: aPos.x,
        y: 110,
      };
    } else {
      const tRight = (extendRight - aPos.x) / dx;
      pointC = {
        x: extendRight,
        y: aPos.y + dy * tRight,
      };
    }
    // Arrow direction is from B towards fixed point C
    const arrowDx = pointC.x - bPos.x;
    const arrowDy = pointC.y - bPos.y;
    const arrowDist = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
    // Arrow length - use arrowLength prop if provided (for step 6), otherwise 13
    const ARROW_LENGTH = arrowLength !== undefined ? arrowLength : 13;
    const arrowRatio = ARROW_LENGTH / arrowDist;
    const angle = Math.atan2(arrowDy, arrowDx);
    const arrowHeadSize = 6;
    // Arrowhead tip should be exactly at arrowEnd
    const arrowEnd = {
      x: bPos.x + arrowDx * arrowRatio,
      y: bPos.y + arrowDy * arrowRatio,
    };
    // Line should end slightly before arrowEnd to avoid clipping through arrowhead
    const lineEndOffset = arrowHeadSize * 0.5;
    const lineEnd = {
      x: arrowEnd.x - lineEndOffset * Math.cos(angle),
      y: arrowEnd.y - lineEndOffset * Math.sin(angle),
    };
    // Arrow head points
    const arrowHeadAngle = Math.PI / 5;
    const arrowHead1 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle - arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle - arrowHeadAngle),
    };
    const arrowHead2 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle + arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle + arrowHeadAngle),
    };
    return {
      start: bPos,
      end: arrowEnd,
      lineEnd: lineEnd,
      head1: arrowHead1,
      head2: arrowHead2,
      angle,
    };
  };

  // Calculate left arrow (from A to E, 10px before canvas 0)
  const getLeftArrowData = () => {
    if (!showLeftArrow) return null;
    const dx = zoomedBPos.x - zoomedAPos.x;
    const dy = zoomedBPos.y - zoomedAPos.y;
    const extendLeft = -10; // 10px before canvas 0
    let pointE;
    if (Math.abs(dx) < 0.001) {
      pointE = { x: zoomedAPos.x, y: -10 };
    } else {
      const tLeft = (extendLeft - zoomedAPos.x) / dx;
      pointE = {
        x: extendLeft,
        y: zoomedAPos.y + dy * tLeft,
      };
    }
    const arrowDx = pointE.x - zoomedAPos.x;
    const arrowDy = pointE.y - zoomedAPos.y;
    const arrowDist = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
    const ARROW_LENGTH = arrowLength !== undefined ? arrowLength : 13;
    const arrowRatio = ARROW_LENGTH / arrowDist;
    const angle = Math.atan2(arrowDy, arrowDx);
    const arrowHeadSize = 6;
    const arrowEnd = {
      x: zoomedAPos.x + arrowDx * arrowRatio,
      y: zoomedAPos.y + arrowDy * arrowRatio,
    };
    const lineEndOffset = arrowHeadSize * 0.5;
    const lineEnd = {
      x: arrowEnd.x - lineEndOffset * Math.cos(angle),
      y: arrowEnd.y - lineEndOffset * Math.sin(angle),
    };
    const arrowHeadAngle = Math.PI / 5;
    const arrowHead1 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle - arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle - arrowHeadAngle),
    };
    const arrowHead2 = {
      x: arrowEnd.x - arrowHeadSize * Math.cos(angle + arrowHeadAngle),
      y: arrowEnd.y - arrowHeadSize * Math.sin(angle + arrowHeadAngle),
    };
    return {
      start: zoomedAPos,
      end: arrowEnd,
      lineEnd: lineEnd,
      head1: arrowHead1,
      head2: arrowHead2,
      angle,
    };
  };

  // Calculate right arrow (from B to C)
  const getRightArrowData = () => {
    if (!showRightArrow) return null;
    const dx = zoomedBPos.x - zoomedAPos.x;
    const dy = zoomedBPos.y - zoomedAPos.y;
    const extendRight = 110;
    let pointC;
    if (Math.abs(dx) < 0.001) {
      pointC = { x: zoomedAPos.x, y: 110 };
    } else {
      const tRight = (extendRight - zoomedAPos.x) / dx;
      pointC = {
        x: extendRight,
        y: zoomedAPos.y + dy * tRight,
      };
    }
    const arrowDx = pointC.x - zoomedBPos.x;
    const arrowDy = pointC.y - zoomedBPos.y;
    const arrowDist = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
    const ARROW_LENGTH = arrowLength !== undefined ? arrowLength : 13;
    const arrowRatio = ARROW_LENGTH / arrowDist;
    const angle = Math.atan2(arrowDy, arrowDx);
    const arrowHeadSize = 6;
    const arrowEnd = {
      x: zoomedBPos.x + arrowDx * arrowRatio,
      y: zoomedBPos.y + arrowDy * arrowRatio,
    };
    const lineEndOffset = arrowHeadSize * 0.5;
    const lineEnd = {
      x: arrowEnd.x - lineEndOffset * Math.cos(angle),
      y: arrowEnd.y - lineEndOffset * Math.sin(angle),
    };
    const arrowHeadAngle = Math.PI / 5;
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
      end: arrowEnd,
      lineEnd: lineEnd,
      head1: arrowHead1,
      head2: arrowHead2,
      angle,
    };
  };

  const arrowData = getArrowData();
  const leftArrowData = getLeftArrowData();
  const rightArrowData = getRightArrowData();

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
              style: showCircle && onCircleClick ? { cursor: "pointer" } : {},
              onClick:
                showCircle && onCircleClick
                  ? (e) => {
                      e.stopPropagation();
                      onCircleClick(pointId);
                    }
                  : null,
            },
            name
          )
        )
    );
  };

  // Render grid lines
  const renderGrid = () => {
    // Show grid throughout the applet
    if (step < 0) return null;
    const gridLines = [];
    const gridColor = "rgba(173, 216, 230, 0.2)"; // Light blue, very subtle

    // Calculate grid bounds
    const minX = 0;
    const maxX = 100;
    const minY = 0;
    const maxY = 70;

    // Vertical lines
    for (let x = minX; x <= maxX; x += gridSpacing) {
      gridLines.push(
        React.createElement("line", {
          key: `v-${x}`,
          x1: x,
          y1: minY,
          x2: x,
          y2: maxY,
          stroke: gridColor,
          strokeWidth: 0.1,
        })
      );
    }

    // Horizontal lines
    for (let y = minY; y <= maxY; y += gridSpacing) {
      gridLines.push(
        React.createElement("line", {
          key: `h-${y}`,
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
      // Points on line AE (step 1, extend animation)
      step === 1 &&
        step1SubStep === "extending" &&
        pointsOnAE.map((point) =>
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
      // Arrow for step 0 (white arrow from B)
      arrowData &&
        step === 0 &&
        showArrow &&
        React.createElement(
          "g",
          {
            style: {
              opacity: arrowOpacity !== undefined ? arrowOpacity : 1,
              transition: "opacity 0.5s ease",
            },
          },
          React.createElement("line", {
            x1: arrowData.start.x,
            y1: arrowData.start.y,
            x2: arrowData.lineEnd.x,
            y2: arrowData.lineEnd.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${arrowData.end.x} ${arrowData.end.y} L ${arrowData.head1.x} ${arrowData.head1.y} L ${arrowData.head2.x} ${arrowData.head2.y} Z`,
            fill: "white",
          })
        ),
      // Line segment BC (steps 1-2, hide in step 3 when arrows appear)
      step >= 1 &&
        step < 3 &&
        showLineSegmentBC &&
        (() => {
          const dx = zoomedBPos.x - zoomedAPos.x;
          const dy = zoomedBPos.y - zoomedAPos.y;
          const extendRight = 110;
          let pointC;
          if (Math.abs(dx) < 0.001) {
            pointC = { x: zoomedAPos.x, y: 110 };
          } else {
            const tRight = (extendRight - zoomedAPos.x) / dx;
            pointC = {
              x: extendRight,
              y: zoomedAPos.y + dy * tRight,
            };
          }
          return React.createElement("line", {
            x1: zoomedBPos.x,
            y1: zoomedBPos.y,
            x2: pointC.x,
            y2: pointC.y,
            stroke: "white",
            strokeWidth: 1.2,
          });
        })(),
      // Line segment AE (steps 1-2, hide in step 3 when arrows appear)
      step >= 1 &&
        step < 3 &&
        showLineSegmentAE &&
        (() => {
          const dx = zoomedBPos.x - zoomedAPos.x;
          const dy = zoomedBPos.y - zoomedAPos.y;
          const extendLeft = -10;
          let pointE;
          if (Math.abs(dx) < 0.001) {
            pointE = { x: zoomedAPos.x, y: -10 };
          } else {
            const tLeft = (extendLeft - zoomedAPos.x) / dx;
            pointE = {
              x: extendLeft,
              y: zoomedAPos.y + dy * tLeft,
            };
          }
          return React.createElement("line", {
            x1: zoomedAPos.x,
            y1: zoomedAPos.y,
            x2: pointE.x,
            y2: pointE.y,
            stroke: "white",
            strokeWidth: 1.2,
          });
        })(),
      // Double arrows (step 3+)
      leftArrowData &&
        ((step >= 3 && step < 7) || step === 7) &&
        showLeftArrow &&
        React.createElement(
          "g",
          {},
          React.createElement("line", {
            x1: leftArrowData.start.x,
            y1: leftArrowData.start.y,
            x2: leftArrowData.lineEnd.x,
            y2: leftArrowData.lineEnd.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${leftArrowData.end.x} ${leftArrowData.end.y} L ${leftArrowData.head1.x} ${leftArrowData.head1.y} L ${leftArrowData.head2.x} ${leftArrowData.head2.y} Z`,
            fill: "white",
          })
        ),
      rightArrowData &&
        ((step >= 3 && step < 7) || step === 7) &&
        showRightArrow &&
        React.createElement(
          "g",
          {},
          React.createElement("line", {
            x1: rightArrowData.start.x,
            y1: rightArrowData.start.y,
            x2: rightArrowData.lineEnd.x,
            y2: rightArrowData.lineEnd.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${rightArrowData.end.x} ${rightArrowData.end.y} L ${rightArrowData.head1.x} ${rightArrowData.head1.y} L ${rightArrowData.head2.x} ${rightArrowData.head2.y} Z`,
            fill: "white",
          }),
          // Double arrow circle for step 4 - positioned in middle of AB line segment
          step === 4 &&
            showDoubleArrowCircle &&
            React.createElement("circle", {
              cx: (zoomedAPos.x + zoomedBPos.x) / 2,
              cy: (zoomedAPos.y + zoomedBPos.y) / 2,
              r: 6,
              fill: "white",
              opacity: 0.15,
              style: { cursor: "pointer" },
              onClick: (e) => {
                e.stopPropagation();
                onDoubleArrowClick && onDoubleArrowClick();
              },
            })
        ),
      // Line segment PQ (step 6)
      step === 6 &&
        showLineSegmentPQ &&
        pointPPos &&
        pointQPos &&
        React.createElement("line", {
          x1: pointPPos.x,
          y1: pointPPos.y,
          x2: pointQPos.x,
          y2: pointQPos.y,
          stroke: "white",
          strokeWidth: 1.2,
        }),
      // Clickable line for step 6 - snap clicks to nearest point on line
      step === 6 &&
        pointsPlaced < 2 &&
        dottedLineCoords &&
        React.createElement("line", {
          x1: dottedLineCoords.x1,
          y1: dottedLineCoords.y1,
          x2: dottedLineCoords.x2,
          y2: dottedLineCoords.y2,
          stroke: "transparent",
          strokeWidth: 20, // Wider clickable area
          style: { cursor: "pointer" },
          onClick: (e) => {
            const clickCoords = getSVGCoordinates(e);
            const snappedCoords = findNearestPointOnFullLine(clickCoords);
            if (snappedCoords && onLineClick) {
              onLineClick(snappedCoords);
            }
          },
        }),
      // Line segment AB (steps 1+, also show BC if it was created in step 0)
      step >= 1 &&
        React.createElement("line", {
          x1: zoomedAPos.x,
          y1: zoomedAPos.y,
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
      // Line segment BC (steps 1-2, hide in step 3 when arrows appear)
      // Point C stays fixed at exact endpoint of dotted line, both A and B move
      step >= 1 &&
        step < 3 &&
        showLineSegmentBC &&
        (() => {
          // Calculate point C at the exact endpoint of dashed line (x=110)
          const dx = zoomedBPos.x - zoomedAPos.x;
          const dy = zoomedBPos.y - zoomedAPos.y;
          const extendRight = 110; // Same as dashed line endpoint
          let pointC;
          if (Math.abs(dx) < 0.001) {
            // Vertical line
            pointC = {
              x: zoomedAPos.x,
              y: 110,
            };
          } else {
            const tRight = (extendRight - zoomedAPos.x) / dx;
            pointC = {
              x: extendRight,
              y: zoomedAPos.y + dy * tRight,
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
          const dx = zoomedBPos.x - zoomedAPos.x;
          const dy = zoomedBPos.y - zoomedAPos.y;
          if (Math.abs(dx) < 0.001) {
            // Vertical line
            return React.createElement("line", {
              x1: zoomedAPos.x,
              y1: -10,
              x2: zoomedAPos.x,
              y2: zoomedAPos.y,
              stroke: "lightblue",
              strokeWidth: 0.5,
              strokeDasharray: "1,1",
              opacity: 0.5,
            });
          }
          const tLeft = (-10 - zoomedAPos.x) / dx;
          const yLeft = zoomedAPos.y + dy * tLeft;
          return React.createElement("line", {
            x1: -10,
            y1: yLeft,
            x2: zoomedAPos.x,
            y2: zoomedAPos.y,
            stroke: "lightblue",
            strokeWidth: 0.5,
            strokeDasharray: "1,1",
            opacity: 0.5,
          });
        })(),
      // Points A and B (hidden in step 6, shown in step 7)
      (step < 6 || step === 7) &&
        createPoint(
          zoomedAPos.x,
          zoomedAPos.y,
          (step >= 0 && step < 6) || step === 7 ? "A" : null, // Show A in step 7
          false, // No dragging in new flow
          false,
          step === 0
            ? pointAColor
            : step === 3
            ? pointAColor
            : step === 4
            ? firstPointTapped === "A"
              ? "#FFEB3B"
              : pointAColor
            : step === 7
            ? "#FFEB3B"
            : "#FFEB3B",
          step === 0
            ? pointALabelColor
            : step === 3
            ? pointALabelColor
            : step === 4
            ? firstPointTapped === "A"
              ? "#FFEB3B"
              : pointALabelColor
            : step === 7
            ? "#FFEB3B"
            : "white",
          step === 4 ? showPointCircles && showACircle : false,
          step === 4 ? onPointTap : null,
          "A",
          null,
          step === 4 ? "white" : "white"
        ),
      (step < 6 || step === 7) &&
        createPoint(
          zoomedBPos.x,
          zoomedBPos.y,
          (step >= 0 && step < 6) || step === 7 ? "B" : null, // Show B in step 7
          false,
          false,
          step === 0
            ? pointBColor
            : step === 3
            ? pointBColor
            : step === 4
            ? firstPointTapped === "B"
              ? "#FFEB3B"
              : pointBColor
            : step === 7
            ? "#2196F3"
            : "#FFEB3B",
          step === 0
            ? pointBLabelColor
            : step === 3
            ? pointBLabelColor
            : step === 4
            ? firstPointTapped === "B"
              ? "#FFEB3B"
              : pointBLabelColor
            : step === 7
            ? "#2196F3"
            : "white",
          step === 4 ? showPointCircles && showBCircle : false,
          step === 4 ? onPointTap : null,
          "B",
          null,
          step === 4 ? "white" : "white"
        ),
      // Points P and Q (step 6)
      step === 6 &&
        pointPPos &&
        createPoint(
          pointPPos.x,
          pointPPos.y,
          "P",
          false,
          false,
          "#FFEB3B", // Yellow
          "#FFEB3B",
          false,
          null,
          "P",
          null,
          "white"
        ),
      step === 6 &&
        pointQPos &&
        createPoint(
          pointQPos.x,
          pointQPos.y,
          "Q",
          false,
          false,
          "#2196F3", // Blue
          "#2196F3",
          false,
          null,
          "Q",
          null,
          "white"
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
    // Line name div (steps 2-5, hidden in step 6+)
    step >= 2 &&
      step < 6 &&
      React.createElement(
        "div",
        {
          ref: lineNameRef,
          className: `line-name ${step >= 5 ? "line-name-orange" : ""}`,
        },
        APP_DATA.lineLabel || "LINE",
        step === 4 &&
          React.createElement("span", {
            className: `line-segment-name ${
              lineSegmentNameBlinking ? "blinking-text" : ""
            }`,
            style: {
              position: "relative",
              display: "inline-block",
            },
            dangerouslySetInnerHTML: {
              __html:
                showDoubleArrowSymbol && lineName
                  ? doubleArrow(lineName)
                  : lineName || APP_DATA.linePlaceholder || "__",
            },
          }),
        step === 5 &&
          React.createElement("span", {
            className: `line-segment-name line-segment-name-no-bg ${
              abBlinking ? "blinking-text" : ""
            }`,
            style: {
              position: "relative",
              display: "inline-block",
            },
            dangerouslySetInnerHTML: {
              __html: doubleArrow("AB") + " or " + doubleArrow("BA"),
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
      }),
    // Step 7 splash screen - colored text spans
    step === 7 &&
      React.createElement("span", {
        style: {
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "4vw",
          fontWeight: "bold",
          pointerEvents: "none",
          zIndex: 1000,
        },
        dangerouslySetInnerHTML: {
          __html: "LINE " + doubleArrowColored(),
        },
      }),
    step === 7 &&
      React.createElement("span", {
        style: {
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "4vw",
          fontWeight: "bold",
          pointerEvents: "none",
          zIndex: 1000,
        },
        dangerouslySetInnerHTML: {
          __html: "LINE SEGMENT " + overlineColored(),
        },
      })
  );
};
