const VisualPanel = ({
  step,
  pointAPos,
  pointBPos,
  scribblePath,
  isDrawing,
  scribbleComplete,
  showDragGif,
  onScribbleStart,
  onScribbleDraw,
  onScribbleEnd,
  scribbleColor,
  showStraightLine,
  scribblePathForAnimation,
  animationComplete,
  onAnimationComplete,
  showPointsOnLine,
  showDottedLine,
  animationStarted,
  onAnimationStart,
  isDragging,
  onPointDrag,
  onDragStart,
  onDragEnd,
  draggedPoint: draggedPointProp,
  pointMoved,
  clickedLabels,
  lineSegmentName,
  showDashSymbol,
  showLineClickHint,
  onLabelClick,
  onLineSegmentClick,
}) => {
  const { useRef, useEffect, useState } = React;
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const lineNameRef = useRef(null);

  const [viewBox, setViewBox] = useState("0 0 100 70");
  const [currentPath, setCurrentPath] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [pointsOnLine, setPointsOnLine] = useState([]);
  const [draggedPoint, setDraggedPoint] = useState(draggedPointProp || null);
  const [cursorNearPoint, setCursorNearPoint] = useState(false);
  const [lineHovered, setLineHovered] = useState(false);

  // Update draggedPoint when prop changes
  useEffect(() => {
    setDraggedPoint(draggedPointProp || null);
  }, [draggedPointProp]);

  const THRESHOLD = 5; // Distance threshold for point detection

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

  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Step 0: Scribble drawing handlers
  const handleMouseDown = (e) => {
    if (step !== 0 || scribbleComplete) return;
    const coords = getSVGCoordinates(e);
    const distA = getDistance(coords.x, coords.y, pointAPos.x, pointAPos.y);
    const distB = getDistance(coords.x, coords.y, pointBPos.x, pointBPos.y);

    if (distA < THRESHOLD) {
      onScribbleStart && onScribbleStart(coords, "A");
      setCurrentPath(`M ${pointAPos.x} ${pointAPos.y}`);
    } else if (distB < THRESHOLD) {
      onScribbleStart && onScribbleStart(coords, "B");
      setCurrentPath(`M ${pointBPos.x} ${pointBPos.y}`);
    }
  };

  const handleMouseMove = (e) => {
    if (step !== 0 || !isDrawing || scribbleComplete) return;
    const coords = getSVGCoordinates(e);
    setCurrentPath(
      (prev) => `${prev} L ${coords.x.toFixed(2)} ${coords.y.toFixed(2)}`
    );
    onScribbleDraw && onScribbleDraw(coords);
  };

  const handleMouseUp = (e) => {
    if (step !== 0 || !isDrawing || scribbleComplete) return;
    const coords = getSVGCoordinates(e);
    const distA = getDistance(coords.x, coords.y, pointAPos.x, pointAPos.y);
    const distB = getDistance(coords.x, coords.y, pointBPos.x, pointBPos.y);

    // Determine which point we started from by checking the path
    const startedFromA = currentPath.includes(
      `M ${pointAPos.x} ${pointAPos.y}`
    );
    const targetPoint = startedFromA ? "B" : "A";
    const targetDist = startedFromA ? distB : distA;

    if (targetDist < THRESHOLD) {
      const endPos = startedFromA ? pointBPos : pointAPos;
      setCurrentPath((prev) => `${prev} L ${endPos.x} ${endPos.y}`);
      onScribbleEnd && onScribbleEnd(coords, targetPoint);
    } else {
      // Reset if didn't end at the other point
      setCurrentPath("");
      // Note: isDrawing state is managed by parent
    }
  };

  // Step 3: Point dragging handlers
  const handlePointMouseDown = (e, pointId) => {
    if (step !== 3) return;
    e.stopPropagation();
    setDraggedPoint(pointId);
    onDragStart && onDragStart(pointId);
  };

  const handlePointMouseMove = (e) => {
    if (step !== 3 || !isDragging || !draggedPoint) return;
    const coords = getSVGCoordinates(e);
    onPointDrag && onPointDrag(draggedPoint, coords);
  };

  const handlePointMouseUp = () => {
    if (step !== 3) return;
    setDraggedPoint(null);
    onDragEnd && onDragEnd();
  };

  // Step 2: Animation effect
  useEffect(() => {
    // Only start animation if we're on step 2, haven't completed, and haven't started
    if (step !== 2 || animationComplete || animationStarted) {
      return;
    }

    onAnimationStart && onAnimationStart();

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const numPoints = 11; // Number of points to show on the line
    let lastPointCount = 0; // Track number of points shown to play sound for new ones

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      // Calculate points along the line (excluding endpoints A and B to avoid duplicate keys)
      const points = [];
      for (let i = 1; i < numPoints; i++) {
        const t = i / numPoints;
        const x = pointAPos.x + (pointBPos.x - pointAPos.x) * t;
        const y = pointAPos.y + (pointBPos.y - pointAPos.y) * t;
        // Only show points that have been "wiped in"
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
        // Use setTimeout to ensure state updates happen in the next tick
        setTimeout(() => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }, 0);
      }
    };

    // Small delay before starting animation
    const timeoutId = setTimeout(() => {
      animate();
    }, 300);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    step,
    animationComplete,
    animationStarted,
    pointAPos.x,
    pointAPos.y,
    pointBPos.x,
    pointBPos.y,
    onAnimationStart,
    onAnimationComplete,
  ]);

  // Step 4: Handle label clicks
  const handleLabelClick = (e, label) => {
    if (step !== 4 || clickedLabels[label]) return;
    e.stopPropagation();
    onLabelClick && onLabelClick(label);
  };

  // Step 4: Handle line segment click - improved detection
  const handleLineClick = (e) => {
    if (step !== 4 || !clickedLabels.A || !clickedLabels.B || showDashSymbol)
      return;
    e.stopPropagation();
    const coords = getSVGCoordinates(e);

    // Calculate distance from point to line segment using cross product
    const dx = pointBPos.x - pointAPos.x;
    const dy = pointBPos.y - pointAPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < 0.001) return; // Degenerate line

    // Vector from A to click point
    const toClickX = coords.x - pointAPos.x;
    const toClickY = coords.y - pointAPos.y;

    // Project click point onto line
    const t = Math.max(
      0,
      Math.min(1, (toClickX * dx + toClickY * dy) / (length * length))
    );

    // Closest point on line segment
    const closestX = pointAPos.x + t * dx;
    const closestY = pointAPos.y + t * dy;

    // Distance from click to line
    const distToLine = getDistance(coords.x, coords.y, closestX, closestY);

    // Allow click if within 2 units of the line
    if (distToLine < 2) {
      onLineSegmentClick && onLineSegmentClick();
    }
  };

  // Step 4: Handle line segment hover
  const handleLineHover = (e) => {
    if (step !== 4 || !showLineClickHint || showDashSymbol) {
      setLineHovered(false);
      return;
    }
    if (step === 4 && showLineClickHint && !showDashSymbol) {
      const coords = getSVGCoordinates(e);
      const dx = pointBPos.x - pointAPos.x;
      const dy = pointBPos.y - pointAPos.y;
      const length = Math.sqrt(dx * dx + dy * dy);

      if (length < 0.001) {
        setLineHovered(false);
        return;
      }

      const toClickX = coords.x - pointAPos.x;
      const toClickY = coords.y - pointAPos.y;
      const t = Math.max(
        0,
        Math.min(1, (toClickX * dx + toClickY * dy) / (length * length))
      );
      const closestX = pointAPos.x + t * dx;
      const closestY = pointAPos.y + t * dy;
      const distToLine = getDistance(coords.x, coords.y, closestX, closestY);

      setLineHovered(distToLine < 2);
    } else {
      setLineHovered(false);
    }
  };

  // Create point element
  const createPoint = (
    x,
    y,
    name,
    isDraggable = false,
    showHintCircle = false
  ) => {
    const pointId = name === "A" ? "A" : "B";
    const isDragged = isDragging && draggedPoint === pointId;

    return React.createElement(
      "g",
      { key: `point-${pointId}` },
      // Outer circle (hint circle for step 3)
      showHintCircle &&
        React.createElement("circle", {
          cx: x,
          cy: y,
          r: 6,
          fill: "white",
          opacity: 0.15,
        }),
      // Transparent larger circle for easier dragging in step 3 (covers entire point area)
      isDraggable &&
        React.createElement("circle", {
          cx: x,
          cy: y,
          r: 6, // Larger hit area
          fill: "transparent",
          style: {
            cursor: "move",
          },
          onMouseDown: (e) => handlePointMouseDown(e, pointId),
        }),
      // Point circles - make entire point draggable in step 3
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 3,
        fill: "#FFEB3B",
        className: isDraggable ? "draggable-point" : "",
        style: {
          cursor: isDraggable ? "move" : step === 0 ? "pointer" : "default",
        },
        onMouseDown: isDraggable
          ? (e) => handlePointMouseDown(e, pointId)
          : null,
      }),
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 1.5,
        fill: "white",
        style: {
          cursor: isDraggable ? "move" : "default",
        },
        onMouseDown: isDraggable
          ? (e) => handlePointMouseDown(e, pointId)
          : null,
      }),
      // Point label
      name &&
        React.createElement(
          "text",
          {
            x: x - 5,
            y: y - 6,
            fill: "#4CAF50",
            fontSize: 6,
            fontWeight: "bold",
            textAnchor: "middle",
            className:
              step === 4 && !clickedLabels[name] ? "clickable-label" : "",
            style: {
              cursor:
                step === 4 && !clickedLabels[name] ? "pointer" : "default",
            },
            onClick: step === 4 ? (e) => handleLabelClick(e, name) : null,
          },
          name
        ),
      // Clickable hint circle around label (step 4) - centered on text
      step === 4 &&
        !clickedLabels[name] &&
        React.createElement("circle", {
          // Text is positioned at (x - 5, y - 6) with fontSize 6
          // Text anchor is "start", so x - 5 is the left edge
          // For a single capital letter with fontSize 6, approximate width is 4-5 units
          // Center x: x - 5 + (width/2) ≈ x - 5 + 2.5 = x - 2.5
          // Text baseline is at y - 6, character height is ~6 units
          // Center y: y - 6 + (height/2) = y - 6 + 3 = y - 3
          cx: x - 5, // Center of the text character horizontally
          cy: y - 9, // Center of the text character vertically
          r: 6,
          fill: "white",
          opacity: 0.15,
          style: { cursor: "pointer" },
          onClick: (e) => handleLabelClick(e, name),
        })
    );
  };

  // Handle mouse move for cursor detection (step 0)
  const handleMouseMoveForCursor = (e) => {
    if (step === 0 && !scribbleComplete && !isDrawing) {
      const coords = getSVGCoordinates(e);
      const distA = getDistance(coords.x, coords.y, pointAPos.x, pointAPos.y);
      const distB = getDistance(coords.x, coords.y, pointBPos.x, pointBPos.y);
      const nearPoint = distA < THRESHOLD || distB < THRESHOLD;
      setCursorNearPoint(nearPoint);
    } else {
      setCursorNearPoint(false);
    }
  };

  // Get cursor style based on proximity to points (step 0)
  const getCursorStyle = () => {
    if (step === 0 && !scribbleComplete && !isDrawing) {
      return { cursor: cursorNearPoint ? "pointer" : "default" };
    }
    return {};
  };

  // Calculate line segment midpoint for dash symbol
  const getLineMidpoint = () => {
    return {
      x: (pointAPos.x + pointBPos.x) / 2,
      y: (pointAPos.y + pointBPos.y) / 2,
    };
  };

  // Calculate extended dotted line coordinates
  const getExtendedDottedLine = () => {
    if (
      !showDottedLine ||
      (step !== 2 && step !== 3 && step !== 4 && step !== 5)
    ) {
      return null;
    }
    const dx = pointBPos.x - pointAPos.x;
    const dy = pointBPos.y - pointAPos.y;
    // Extend line to x = -10 and x = 110
    const extendLeft = -10;
    const extendRight = 110;
    // Avoid division by zero
    if (Math.abs(dx) < 0.001) {
      // Vertical line
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
        onMouseDown: step === 0 ? handleMouseDown : null,
        onMouseMove:
          step === 0
            ? (e) => {
                handleMouseMove(e);
                handleMouseMoveForCursor(e);
              }
            : step === 3
            ? handlePointMouseMove
            : step === 4 && showLineClickHint
            ? handleLineHover
            : null,
        onMouseUp:
          step === 0 ? handleMouseUp : step === 3 ? handlePointMouseUp : null,
        onTouchStart:
          step === 0
            ? (e) => {
                e.preventDefault();
                handleMouseDown(e);
              }
            : null,
        onTouchMove:
          step === 0
            ? (e) => {
                e.preventDefault();
                handleMouseMove(e);
              }
            : null,
        onTouchEnd:
          step === 0
            ? (e) => {
                e.preventDefault();
                handleMouseUp(e);
              }
            : null,
        onMouseLeave:
          step === 0 && !scribbleComplete && !isDrawing
            ? () => {
                setCursorNearPoint(false);
              }
            : step === 4 && showLineClickHint
            ? () => {
                setLineHovered(false);
              }
            : null,
        style: getCursorStyle(),
      },
      // Dotted line extending beyond canvas (steps 2, 3, 4, 5)
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
      // Step 1: Straight line feedback
      step === 1 &&
        showStraightLine &&
        React.createElement("line", {
          x1: pointAPos.x,
          y1: pointAPos.y,
          x2: pointBPos.x,
          y2: pointBPos.y,
          stroke: scribbleColor === "#F44336" ? "#4CAF50" : "#4CAF50",
          strokeWidth: 0.5,
          strokeDasharray: "2,2",
        }),
      // Step 2: Points on line (animation)
      step === 2 &&
        pointsOnLine.map((point) =>
          React.createElement(
            "g",
            { key: point.id || `line-point-${point.x}-${point.y}` },
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 2.25, // 75% of 3
              fill: "#FFEB3B",
            }),
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 1.125, // 75% of 1.5
              fill: "white",
            })
          )
        ),
      // Step 3: Solid line segment
      (step === 3 || step === 4 || step === 5) &&
        React.createElement("line", {
          x1: pointAPos.x,
          y1: pointAPos.y,
          x2: pointBPos.x,
          y2: pointBPos.y,
          stroke: "white",
          strokeWidth: step === 4 && showLineClickHint && lineHovered ? 2 : 1.2, // Increase thickness by 3px on hover (1.2 + 3 = 4.2)
          style: {
            cursor: step === 4 && showLineClickHint ? "pointer" : "default",
            transition: "stroke-width 0.2s ease",
          },
          onClick: step === 4 && showLineClickHint ? handleLineClick : null,
        }),
      // Step 4: Click hint circle on line segment (non-interactive, just visual)
      step === 4 &&
        showLineClickHint &&
        React.createElement("circle", {
          cx: getLineMidpoint().x,
          cy: getLineMidpoint().y,
          r: 6,
          fill: "white",
          opacity: 0.15,
          style: { cursor: "pointer", pointerEvents: "none" }, // Don't intercept clicks
        }),
      // Scribble path (step 0, step 1, and step 2 - with wipe animation)
      (step === 0 || step === 1 || (step === 2 && animationProgress < 1)) &&
        (step === 0
          ? currentPath
          : step === 1
          ? scribblePath
          : scribblePathForAnimation) &&
        React.createElement("path", {
          d:
            step === 0
              ? currentPath
              : step === 1
              ? scribblePath
              : scribblePathForAnimation,
          fill: "none",
          stroke: step === 1 ? scribbleColor : "white",
          strokeWidth: 0.8, // 3px equivalent in viewBox units
          strokeLinecap: "round",
          strokeLinejoin: "round",
          opacity: step === 2 ? 1 : 1,
          style:
            step === 2
              ? {
                  // Clip from left: hide the left portion that matches the progress
                  // When progress is 0.25, hide left 25%, show right 75%
                  // When progress is 1.0, hide left 100% (entire line)
                  clipPath: `inset(0 0 0 ${animationProgress * 100}%)`,
                }
              : {},
        }),
      // Points A and B (show in steps 0, 1, 2, 3, 4, 5)
      createPoint(
        pointAPos.x,
        pointAPos.y,
        step === 0 || step === 1 ? null : "A", // Show label in steps 2+
        step === 3,
        step === 3
      ),
      createPoint(
        pointBPos.x,
        pointBPos.y,
        step === 0 || step === 1 ? null : "B", // Show label in steps 2+
        step === 3,
        step === 3
      )
    ),
    // Step 0: Drag GIF on point A
    step === 0 &&
      showDragGif &&
      !isDrawing &&
      React.createElement("img", {
        src: "assets/drag.gif",
        alt: "Drag hint",
        className: "point-drag-gif",
        style: {
          position: "absolute",
          left: `${(pointAPos.x / 100) * 100}%`,
          top: `${(pointAPos.y / 70) * 100}%`,
          transform: "translate(-40%, 0%)",
          width: "12vw",
          height: "6vw",
          pointerEvents: "none",
          zIndex: 10,
        },
      }),
    // Line name div (steps 2, 3, 4, 5)
    (step === 2 || step === 3 || step === 4 || step === 5) &&
      React.createElement(
        "div",
        {
          ref: lineNameRef,
          className: `line-name ${
            (step === 4 && showDashSymbol) || step === 5
              ? "line-name-orange"
              : ""
          }`,
        },
        APP_DATA.lineSegmentLabel,
        // Only show span in steps 4 and 5
        (step === 4 || step === 5) &&
          React.createElement(
            "span",
            {
              className: `line-segment-name ${
                step === 4 && showDashSymbol
                  ? "line-segment-name-overlined"
                  : ""
              }`,
            },
            step === 5
              ? // Step 5: Show both AB and BA with overlines
                React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "span",
                    { className: "line-segment-name-overlined" },
                    lineSegmentName
                  ),
                  APP_DATA.lineSegmentOr,
                  React.createElement(
                    "span",
                    { className: "line-segment-name-overlined" },
                    lineSegmentName === "AB" ? "BA" : "AB"
                  )
                )
              : // Step 4: Show current name with underscore if incomplete
                lineSegmentName || APP_DATA.lineSegmentPlaceholder
          )
      )
  );
};
