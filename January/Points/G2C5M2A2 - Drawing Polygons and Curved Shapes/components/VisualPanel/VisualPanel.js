const VisualPanel = ({
  step,
  points,
  drawnLines,
  isDrawing,
  drawCurrentCoords,
  drawStartPoint,
  activeLineType,
  feedbackText,
  showFeedback,
  isFeedbackCorrect,
  onLineDrawStart,
  onLineDraw,
  onLineDrawEnd,
}) => {
  const { useRef, useEffect, useState } = React;
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const [viewBox, setViewBox] = useState("0 0 100 70");

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
    } else if (event.changedTouches && event.changedTouches[0]) {
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
    for (const point of points) {
      const dist = getDistance(coords.x, coords.y, point.x, point.y);
      if (dist < THRESHOLD) {
        return point.name;
      }
    }
    return null;
  };

  // Get point position by name
  const getPointPos = (pointName) => {
    const point = points.find((p) => p.name === pointName);
    return point ? { x: point.x, y: point.y } : null;
  };

  // Line drawing handlers
  const handleMouseDown = (e) => {
    if (!activeLineType || isDrawing) return;
    const coords = getSVGCoordinates(e);
    const pointName = getPointAt(coords);
    if (pointName) {
      onLineDrawStart && onLineDrawStart(coords, pointName);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const coords = getSVGCoordinates(e);
    onLineDraw && onLineDraw(coords);
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !drawStartPoint) return;
    const coords = getSVGCoordinates(e);
    const endPoint = getPointAt(coords);
    if (endPoint && endPoint !== drawStartPoint) {
      onLineDrawEnd && onLineDrawEnd(coords, endPoint);
    } else {
      // Reset if didn't end at a valid point
      onLineDrawEnd && onLineDrawEnd(coords, null);
    }
  };

  // Generate sine wave path between two points
  const generateSineWavePath = (startX, startY, endX, endY, amplitude = 4) => {
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Generate points along sine wave
    const numPoints = 50;
    const pathPoints = [];

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      // Position along the line
      const x = t * length;
      // Sine wave offset (one full wave from 0 to 2PI)
      const y = amplitude * Math.sin(t * 2 * Math.PI);

      // Rotate point back to the line's actual angle
      const rotatedX = startX + x * Math.cos(angle) - y * Math.sin(angle);
      const rotatedY = startY + x * Math.sin(angle) + y * Math.cos(angle);

      pathPoints.push({ x: rotatedX, y: rotatedY });
    }

    // Build SVG path
    let pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      pathD += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }

    return pathD;
  };

  // Create point element
  const createPoint = (point) => {
    const { x, y, name, labelPos } = point;
    const pointColor = "#FFEB3B";

    // Determine label position
    let labelX = x;
    let labelY = y;
    let textAnchor = "middle";

    if (labelPos === "top") {
      labelY = y - 6;
    } else if (labelPos === "bottom") {
      labelY = y + 10;
    } else if (labelPos === "left") {
      labelX = x - 6;
      textAnchor = "end";
    } else if (labelPos === "right") {
      labelX = x + 6;
      textAnchor = "start";
    } else if (labelPos === "top-left") {
      labelX = x - 4;
      labelY = y - 4;
      textAnchor = "end";
    } else if (labelPos === "top-right") {
      labelX = x + 4;
      labelY = y - 4;
      textAnchor = "start";
    } else if (labelPos === "bottom-left") {
      labelX = x - 4;
      labelY = y + 10;
      textAnchor = "end";
    } else if (labelPos === "bottom-right") {
      labelX = x + 4;
      labelY = y + 10;
      textAnchor = "start";
    }

    return React.createElement(
      "g",
      { key: `point-${name}` },
      // Outer circle (colored)
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 3,
        fill: pointColor,
      }),
      // Inner white circle
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 1.5,
        fill: "white",
      }),
      // Point label
      React.createElement(
        "text",
        {
          x: labelX,
          y: labelY,
          fill: "white",
          fontSize: 6,
          fontWeight: "bold",
          textAnchor: textAnchor,
          style: {
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            pointerEvents: "none",
          },
        },
        name
      )
    );
  };

  // Get cursor style based on active line type
  const getCursorStyle = () => {
    if (activeLineType) {
      return { cursor: 'url("assets/pencil.png") 0 32, crosshair' };
    }
    return { cursor: "default" };
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
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: (e) => {
          if (isDrawing) {
            handleMouseUp(e);
          }
        },
        onTouchStart: (e) => {
          handleMouseDown(e);
        },
        onTouchMove: (e) => {
          handleMouseMove(e);
        },
        onTouchEnd: (e) => {
          handleMouseUp(e);
        },
        style: getCursorStyle(),
      },
      // Draw permanent lines
      drawnLines.map((line, index) => {
        const startPos = getPointPos(line.start);
        const endPos = getPointPos(line.end);
        if (!startPos || !endPos) return null;

        if (line.type === "curved") {
          // Draw sine wave
          const pathD = generateSineWavePath(
            startPos.x,
            startPos.y,
            endPos.x,
            endPos.y
          );
          return React.createElement("path", {
            key: `line-${index}`,
            d: pathD,
            stroke: line.color,
            strokeWidth: 1.2,
            fill: "none",
          });
        } else {
          // Draw straight line
          return React.createElement("line", {
            key: `line-${index}`,
            x1: startPos.x,
            y1: startPos.y,
            x2: endPos.x,
            y2: endPos.y,
            stroke: line.color,
            strokeWidth: 1.2,
          });
        }
      }),
      // Current drawing line
      isDrawing &&
        drawStartPoint &&
        drawCurrentCoords &&
        (() => {
          const startPos = getPointPos(drawStartPoint);
          if (!startPos) return null;

          if (activeLineType === "curved") {
            // Draw sine wave preview
            const pathD = generateSineWavePath(
              startPos.x,
              startPos.y,
              drawCurrentCoords.x,
              drawCurrentCoords.y
            );
            return React.createElement("path", {
              key: "current-line",
              d: pathD,
              stroke: "white",
              strokeWidth: 1.2,
              fill: "none",
            });
          } else {
            // Draw straight line preview
            return React.createElement("line", {
              key: "current-line",
              x1: startPos.x,
              y1: startPos.y,
              x2: drawCurrentCoords.x,
              y2: drawCurrentCoords.y,
              stroke: "white",
              strokeWidth: 1.2,
            });
          }
        })(),
      // Points
      points.map((point) => createPoint(point))
    ),
    // Feedback overlay
    showFeedback &&
      feedbackText &&
      React.createElement("div", {
        className: `line-feedback ${
          isFeedbackCorrect ? "line-feedback-correct" : "line-feedback-incorrect"
        }`,
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "1.5vw 2vw",
          borderRadius: "0.8vw",
          // color: "white",
          fontSize: "2vw",
          whiteSpace: "pre-line",
          textAlign: "center",
          zIndex: 100,
          pointerEvents: "none",
          opacity: showFeedback ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        },
        dangerouslySetInnerHTML: { __html: feedbackText },
      })
  );
};
