const VisualPanel = ({
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
  onLineDrawStart,
  onLineDraw,
  onLineDrawEnd,
  onScribbleStart,
  onScribbleMove,
  onScribbleEnd,
  onLineClick,
}) => {
  const { useRef, useEffect, useState, useMemo } = React;
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const [viewBox, setViewBox] = useState("0 0 100 70");
  const [cursorNearPoint, setCursorNearPoint] = useState(false);

  const THRESHOLD = 5;
  const GRAPH_LINE_X = 10;
  const LINE_SPACING = 12;

  useEffect(() => {
    const updateViewBox = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width > 0 && height > 0) {
          setViewBox(`0 0 100 70`);
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
    
    if (event.touches && event.touches.length > 0) {
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      pt.x = event.changedTouches[0].clientX;
      pt.y = event.changedTouches[0].clientY;
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

  // Get point at coordinates
  const getPointAt = (coords) => {
    const points = [
      { name: "A", pos: pointAPos },
      { name: "B", pos: pointBPos },
    ];
    for (const point of points) {
      const dist = getDistance(coords.x, coords.y, point.pos.x, point.pos.y);
      if (dist < THRESHOLD) {
        return point.name;
      }
    }
    return null;
  };

  // Get point position by name
  const getPointPos = (pointName) => {
    if (pointName === "A") return pointAPos;
    if (pointName === "B") return pointBPos;
    return null;
  };

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

  // Interpolate between original curve and straightened version
  const interpolatePoints = (original, straightened, progress) => {
    if (!original || original.length === 0) return [];
    if (!straightened || straightened.length === 0) return original;

    return original.map((point, i) => {
      if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
        return { x: 0, y: 0 };
      }
      const target = straightened[i];
      if (!target || typeof target.x !== 'number' || typeof target.y !== 'number') {
        return point;
      }
      return {
        x: point.x + (target.x - point.x) * progress,
        y: point.y + (target.y - point.y) * progress,
      };
    });
  };

  // Generate path data from points
  const generatePath = (points) => {
    if (!points || points.length < 2) return "";
    // Filter out any invalid points
    const validPoints = points.filter(p => p && typeof p.x === 'number' && typeof p.y === 'number');
    if (validPoints.length < 2) return "";
    return (
      `M ${validPoints[0].x.toFixed(2)} ${validPoints[0].y.toFixed(2)} ` +
      validPoints
        .slice(1)
        .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ")
    );
  };

  // Step 0: Line drawing handlers
  const handleMouseDown = (e) => {
    if (step === 0 && step0Phase === 0 && !isDrawing) {
      const coords = getSVGCoordinates(e);
      const pointName = getPointAt(coords);
      if (pointName) {
        onLineDrawStart && onLineDrawStart(coords, pointName);
      }
    } else if (step === 2 && step2Phase === 0 && !isScribbling) {
      const coords = getSVGCoordinates(e);
      const pointName = getPointAt(coords);
      if (pointName && userScribbles.length < 2) {
        // Pass the actual point position for snapping
        const pointPos = getPointPos(pointName);
        onScribbleStart && onScribbleStart(pointPos, pointName);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (step === 0 && step0Phase === 0 && isDrawing) {
      const coords = getSVGCoordinates(e);
      onLineDraw && onLineDraw(coords);
    } else if (step === 2 && step2Phase === 0 && isScribbling) {
      const coords = getSVGCoordinates(e);
      onScribbleMove && onScribbleMove(coords);
    } else if ((step === 0 || step === 2) && !isDrawing && !isScribbling) {
      const coords = getSVGCoordinates(e);
      const pointName = getPointAt(coords);
      setCursorNearPoint(!!pointName);
    }
  };

  const handleMouseUp = (e) => {
    if (step === 0 && step0Phase === 0 && isDrawing) {
      const coords = getSVGCoordinates(e);
      const endPoint = getPointAt(coords);
      if (endPoint && endPoint !== drawStartPoint) {
        onLineDrawEnd && onLineDrawEnd(coords, endPoint);
      } else {
        onLineDrawEnd && onLineDrawEnd(coords, null);
      }
    } else if (step === 2 && step2Phase === 0 && isScribbling) {
      const coords = getSVGCoordinates(e);
      const endPoint = getPointAt(coords);
      onScribbleEnd && onScribbleEnd(coords, endPoint);
    }
  };

  // Handle click on lines in MCQ phase
  const handleLineElementClick = (lineType) => {
    if (onLineClick) {
      onLineClick(lineType);
    }
  };

  // Get cursor style
  const getCursorStyle = () => {
    if ((step === 0 && step0Phase === 0) || (step === 2 && step2Phase === 0)) {
      return { cursor: cursorNearPoint ? "pointer" : "crosshair" };
    }
    if ((step === 1 && step1Phase === 2) || (step === 2 && step2Phase === 2)) {
      return { cursor: "pointer" };
    }
    return {};
  };

  // Calculate straightened line positions for white line
  const getWhiteLineStraightened = () => {
    const baseY = 25;
    const length = getDistance(pointAPos.x, pointAPos.y, pointBPos.x, pointBPos.y);
    return {
      x1: GRAPH_LINE_X,
      y1: baseY,
      x2: GRAPH_LINE_X + length,
      y2: baseY,
    };
  };

  // Get current white line position based on progress
  const getCurrentWhiteLine = () => {
    const progress = straighteningProgress;
    const original = { x1: pointAPos.x, y1: pointAPos.y, x2: pointBPos.x, y2: pointBPos.y };
    const straight = getWhiteLineStraightened();

    return {
      x1: original.x1 + (straight.x1 - original.x1) * progress,
      y1: original.y1 + (straight.y1 - original.y1) * progress,
      x2: original.x2 + (straight.x2 - original.x2) * progress,
      y2: original.y2 + (straight.y2 - original.y2) * progress,
    };
  };

  // Create point element
  const createPoint = (x, y, name, opacity = 1) => {
    const pointColor = "#FFEB3B";
    const labelY = y - 6;

    return React.createElement(
      "g",
      { key: `point-${name}`, opacity: opacity },
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 3,
        fill: pointColor,
      }),
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 1.5,
        fill: "white",
      }),
      React.createElement(
        "text",
        {
          x: x,
          y: labelY,
          fill: "white",
          fontSize: 6,
          fontWeight: "bold",
          textAnchor: "middle",
          style: {
            userSelect: "none",
            pointerEvents: "none",
          },
        },
        name
      )
    );
  };

  // Get current curve position based on animation progress
  const getCurrentCurvePoints = (original, straightened) => {
    if (isStraightening || isReversing) {
      return interpolatePoints(original, straightened, straighteningProgress);
    }
    if (showGraphLine) {
      return straightened;
    }
    return original;
  };

  // Render blinking clickable circle in the MIDDLE of a line
  const renderClickableCircle = (lineType, x1, y1, x2, y2, isInMCQ) => {
    if (!isInMCQ) return null;

    // Calculate middle point of the line
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const isWrong = wrongSelection === lineType;
    const lineColor = lineType === "white" ? "white" : lineType === "pink" ? "#FF69B4" : "#64B5F6";
    const fillColor = isWrong ? "#F44336" : lineColor;

    return React.createElement(
      "g",
      {
        key: `clickable-${lineType}`,
        onClick: (e) => {
          e.stopPropagation();
          handleLineElementClick(lineType);
        },
        onTouchEnd: (e) => {
          e.stopPropagation();
          // e.preventDefault();
          handleLineElementClick(lineType);
        },
        style: { cursor: "pointer" },
      },
      React.createElement("circle", {
        cx: midX,
        cy: midY,
        r: 3,
        fill: fillColor,
        className: isWrong ? "" : "blinking-circle",
        style: {
          transition: "fill 0.3s ease",
        },
      })
    );
  };

  // Render vertical end line marker
  const renderEndLineMarker = (x, y, color) => {
    return React.createElement("line", {
      x1: x,
      y1: y - 3,
      x2: x,
      y2: y + 3,
      stroke: color,
      strokeWidth: 0.5,
      strokeDasharray: "1,1",
    });
  };

  // Determine if we're in MCQ phase
  const isInMCQPhase = (step === 1 && step1Phase === 2) || (step === 2 && step2Phase === 2);

  // Get scribble curves to use (user's or from step 1)
  const getActiveCurves = () => {
    if (step === 2 && userScribbles.length > 0) {
      return {
        upper: userScribbles[0] || [],
        lower: userScribbles[1] || [],
        upperStraight: straightenedUpperCurve,
        lowerStraight: straightenedLowerCurve,
      };
    }
    return {
      upper: upperCurve,
      lower: lowerCurve,
      upperStraight: straightenedUpperCurve,
      lowerStraight: straightenedLowerCurve,
    };
  };

  const curves = getActiveCurves();

  // Check if curves should be shown
  const shouldShowCurves = () => {
    if (step === 1) return true;
    if (step === 2 && (userScribbles.length > 0 || step2Phase > 0)) return true;
    return false;
  };

  // Determine point opacity
  const pointOpacity = pointsLowOpacity ? 0.2 : 1;

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
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onTouchStart: (e) => {
          // e.preventDefault();
          handleMouseDown(e);
        },
        onTouchMove: (e) => {
          // e.preventDefault();
          handleMouseMove(e);
        },
        onTouchEnd: (e) => {
          // e.preventDefault();
          handleMouseUp(e);
        },
        onMouseLeave: () => setCursorNearPoint(false),
        style: getCursorStyle(),
      },
      // Graph line (vertical dotted line) - shown during comparison
      showGraphLine &&
        React.createElement("line", {
          x1: GRAPH_LINE_X,
          y1: 0,
          x2: GRAPH_LINE_X,
          y2: 70,
          stroke: "white",
          strokeWidth: 0.5,
          strokeDasharray: "2,2",
        }),
      // Original position dashed lines (low opacity during animation)
      (isStraightening || isReversing || showGraphLine) &&
        lineSegmentDrawn &&
        React.createElement("line", {
          x1: pointAPos.x,
          y1: pointAPos.y,
          x2: pointBPos.x,
          y2: pointBPos.y,
          stroke: "white",
          strokeWidth: 0.5,
          strokeDasharray: "2,2",
          opacity: 0.2,
        }),
      // Upper curve dashed original position
      (isStraightening || isReversing || showGraphLine) &&
        curves.upper.length > 0 &&
        React.createElement("path", {
          d: generatePath(curves.upper),
          fill: "none",
          stroke: "#FF69B4",
          strokeWidth: 0.5,
          strokeDasharray: "2,2",
          opacity: 0.2,
        }),
      // Lower curve dashed original position
      (isStraightening || isReversing || showGraphLine) &&
        curves.lower.length > 0 &&
        React.createElement("path", {
          d: generatePath(curves.lower),
          fill: "none",
          stroke: "#64B5F6",
          strokeWidth: 0.5,
          strokeDasharray: "2,2",
          opacity: 0.2,
        }),
      // White line segment (animated or static)
      lineSegmentDrawn &&
        (() => {
          if (isStraightening || isReversing || showGraphLine) {
            const pos = getCurrentWhiteLine();
            const isWrong = wrongSelection === "white";
            return React.createElement(
              "g",
              { key: "white-line-group" },
              React.createElement("line", {
                x1: pos.x1,
                y1: pos.y1,
                x2: pos.x2,
                y2: pos.y2,
                stroke: isWrong ? "#F44336" : "white",
                strokeWidth: 1.5,
                style: { transition: isWrong ? "stroke 0.3s ease" : "none" },
              }),
              // Vertical end line marker (shown in MCQ phase)
              isInMCQPhase && renderEndLineMarker(pos.x2, pos.y2, isWrong ? "#F44336" : "white"),
              // Clickable circle in the middle
              isInMCQPhase && renderClickableCircle("white", pos.x1, pos.y1, pos.x2, pos.y2, true)
            );
          }
          return React.createElement("line", {
            x1: pointAPos.x,
            y1: pointAPos.y,
            x2: pointBPos.x,
            y2: pointBPos.y,
            stroke: "white",
            strokeWidth: 1.5,
          });
        })(),
      // Upper curve (pink) - animated or static
      shouldShowCurves() &&
        curves.upper.length > 0 &&
        (() => {
          const currentPoints = getCurrentCurvePoints(curves.upper, curves.upperStraight);
          const isWrong = wrongSelection === "pink";
          const pathData = generatePath(currentPoints);
          const startPoint = currentPoints[0];
          const endPoint = currentPoints[currentPoints.length - 1];

          return React.createElement(
            "g",
            { key: "pink-curve-group" },
            React.createElement("path", {
              d: pathData,
              fill: "none",
              stroke: isWrong ? "#F44336" : "#FF69B4",
              strokeWidth: 1.5,
              style: { transition: isWrong ? "stroke 0.3s ease" : "none" },
            }),
            // Vertical end line marker (shown in MCQ phase)
            isInMCQPhase && endPoint && renderEndLineMarker(endPoint.x, endPoint.y, isWrong ? "#F44336" : "#FF69B4"),
            // Clickable circle in the middle
            isInMCQPhase && startPoint && endPoint && renderClickableCircle("pink", startPoint.x, startPoint.y, endPoint.x, endPoint.y, true)
          );
        })(),
      // Lower curve (blue) - animated or static
      shouldShowCurves() &&
        curves.lower.length > 0 &&
        (() => {
          const currentPoints = getCurrentCurvePoints(curves.lower, curves.lowerStraight);
          const isWrong = wrongSelection === "blue";
          const pathData = generatePath(currentPoints);
          const startPoint = currentPoints[0];
          const endPoint = currentPoints[currentPoints.length - 1];

          return React.createElement(
            "g",
            { key: "blue-curve-group" },
            React.createElement("path", {
              d: pathData,
              fill: "none",
              stroke: isWrong ? "#F44336" : "#64B5F6",
              strokeWidth: 1.5,
              style: { transition: isWrong ? "stroke 0.3s ease" : "none" },
            }),
            // Vertical end line marker (shown in MCQ phase)
            isInMCQPhase && endPoint && renderEndLineMarker(endPoint.x, endPoint.y, isWrong ? "#F44336" : "#64B5F6"),
            // Clickable circle in the middle
            isInMCQPhase && startPoint && endPoint && renderClickableCircle("blue", startPoint.x, startPoint.y, endPoint.x, endPoint.y, true)
          );
        })(),
      // Current scribble being drawn
      step === 2 &&
        step2Phase === 0 &&
        isScribbling &&
        currentScribble.length > 1 &&
        React.createElement("path", {
          d: generatePath(currentScribble),
          fill: "none",
          stroke: userScribbles.length === 0 ? "#FF69B4" : "#64B5F6",
          strokeWidth: 1.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
      // Drawing line (Step 0)
      step === 0 &&
        step0Phase === 0 &&
        isDrawing &&
        drawStartPoint &&
        drawCurrentCoords &&
        React.createElement("line", {
          x1: drawStartPoint === "A" ? pointAPos.x : pointBPos.x,
          y1: drawStartPoint === "A" ? pointAPos.y : pointBPos.y,
          x2: drawCurrentCoords.x,
          y2: drawCurrentCoords.y,
          stroke: "white",
          strokeWidth: 1.5,
        }),
      // Points (A and B)
      React.createElement(
        "g",
        { opacity: pointOpacity, style: { transition: "opacity 0.3s ease" } },
        createPoint(pointAPos.x, pointAPos.y, "A"),
        createPoint(pointBPos.x, pointBPos.y, "B")
      )
    )
  );
};
