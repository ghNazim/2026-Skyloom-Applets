const VisualPanel = ({
  step,
  pointAPos,
  pointBPos,
  pointMPos,
  pointNPos,
  drawnLines,
  isDrawing,
  drawCurrentCoords,
  drawStartPoint,
  pointColors,
  feedbackText,
  showFeedback,
  onLineDrawStart,
  onLineDraw,
  onLineDrawEnd,
  showCompareButton,
  onCompareClick,
  comparisonAnimationStarted,
  comparisonAnimationComplete,
  showGraphLine,
  animatedLines,
  setAnimatedLines,
}) => {
  const { useRef, useEffect, useState } = React;
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const feedbackRef = useRef(null);

  const [viewBox, setViewBox] = useState("0 0 100 70");
  const [cursorNearPoint, setCursorNearPoint] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);

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

  // Get point position by name
  const getPointPos = (pointName) => {
    switch (pointName) {
      case "A":
        return pointAPos;
      case "B":
        return pointBPos;
      case "M":
        return pointMPos;
      case "N":
        return pointNPos;
      default:
        return null;
    }
  };

  // Get point at coordinates
  const getPointAt = (coords) => {
    const points = [
      { name: "A", pos: pointAPos },
      { name: "B", pos: pointBPos },
      { name: "M", pos: pointMPos },
      { name: "N", pos: pointNPos },
    ];
    for (const point of points) {
      const dist = getDistance(coords.x, coords.y, point.pos.x, point.pos.y);
      if (dist < THRESHOLD) {
        return point.name;
      }
    }
    return null;
  };

  // Step 0 and Step 2: Line drawing handlers
  const handleMouseDown = (e) => {
    if ((step !== 0 && step !== 2) || isDrawing) return;
    const coords = getSVGCoordinates(e);
    const pointName = getPointAt(coords);
    if (pointName) {
      onLineDrawStart && onLineDrawStart(coords, pointName);
    }
  };

  const handleMouseMove = (e) => {
    if ((step !== 0 && step !== 2) || !isDrawing) return;
    const coords = getSVGCoordinates(e);
    onLineDraw && onLineDraw(coords);
  };

  const handleMouseUp = (e) => {
    if ((step !== 0 && step !== 2) || !isDrawing || !drawStartPoint) return;
    const coords = getSVGCoordinates(e);
    const endPoint = getPointAt(coords);
    if (endPoint && endPoint !== drawStartPoint) {
      onLineDrawEnd && onLineDrawEnd(coords, endPoint);
    } else {
      // Reset if didn't end at a valid point
      onLineDrawEnd && onLineDrawEnd(coords, null);
    }
  };

  // Step 1 and Step 3: Reverse animation (when lines need to go back)
  // NOTE: This reverse animation is currently disabled - we instantly restore instead
  // Keeping this code in case we need reverse animation in the future
  useEffect(() => {
    // Don't run reverse animation - we instantly restore the state instead
    // This prevents issues when lines are drawn in different directions
    return;

    // Trigger reverse animation when comparisonAnimationComplete becomes false after being true
    if (
      (step !== 1 && step !== 3) ||
      !comparisonAnimationStarted ||
      comparisonAnimationComplete ||
      !showGraphLine ||
      animatedLines.length === 0
    ) {
      return;
    }

    // Reverse animation: animate lines back to original positions
    const validLines = drawnLines.filter((line) => line.isValid);
    if (validLines.length !== 2) return;

    // Normalize lines so common point is always the start point (same as forward animation)
    const commonPoint = step === 1 ? "A" : "N";
    const normalizedLines = validLines.map((line) => {
      // If the common point is the end point, swap start and end
      if (line.end === commonPoint) {
        return {
          ...line,
          start: line.end,
          end: line.start,
          startPos: line.endPos,
          endPos: line.startPos,
        };
      }
      return line;
    });

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const graphLineX = 10;

    const animateReverse = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const animated = normalizedLines.map((line, index) => {
        const startPos = line.startPos;
        const endPos = line.endPos;
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const targetY = 30 + index * 10;

        // Start from horizontal position (graphLineX, targetY) and animate back to original
        // When progress = 0, we're at horizontal position (graphLineX, targetY)
        // When progress = 1, we're at original position (startPos, endPos)
        const currentStartX = graphLineX + (startPos.x - graphLineX) * progress;
        const currentStartY = targetY + (startPos.y - targetY) * progress;
        const currentEndX =
          graphLineX + length + (endPos.x - (graphLineX + length)) * progress;
        const currentEndY = targetY + (endPos.y - targetY) * progress;

        return {
          ...line,
          animatedStartX: currentStartX,
          animatedStartY: currentStartY,
          animatedEndX: currentEndX,
          animatedEndY: currentEndY,
        };
      });

      setAnimatedLines(animated);

      if (progress < 1) {
        requestAnimationFrame(animateReverse);
      } else {
        // Animation back complete - lines are at original positions
        // Don't clear animatedLines here, let App.js handle cleanup
      }
    };

    // Start reverse animation immediately
    animateReverse();

    return () => {
      // Cleanup if needed
    };
  }, [
    step,
    comparisonAnimationStarted,
    comparisonAnimationComplete,
    showGraphLine,
    animatedLines.length,
    drawnLines,
    setAnimatedLines,
  ]);

  // Reset background opacity when not in animation
  useEffect(() => {
    if (
      (step !== 1 && step !== 3) ||
      !comparisonAnimationStarted ||
      !showGraphLine ||
      !comparisonAnimationComplete
    ) {
      setBackgroundOpacity(1);
    }
  }, [
    step,
    comparisonAnimationStarted,
    showGraphLine,
    comparisonAnimationComplete,
  ]);

  // Step 1 and Step 3: Comparison animation (forward)
  useEffect(() => {
    if (
      (step !== 1 && step !== 3) ||
      !comparisonAnimationStarted ||
      comparisonAnimationComplete ||
      !showGraphLine
    ) {
      return;
    }

    // Get the two valid lines (AM and AB for step 1, MN and BN for step 3)
    const validLines = drawnLines.filter((line) => line.isValid);
    if (validLines.length !== 2) return;

    // Normalize lines so common point is always the start point
    const commonPoint = step === 1 ? "A" : "N";
    const normalizedLines = validLines.map((line) => {
      // If the common point is the end point, swap start and end
      if (line.end === commonPoint) {
        return {
          ...line,
          start: line.end,
          end: line.start,
          startPos: line.endPos,
          endPos: line.startPos,
        };
      }
      return line;
    });

    // Start reducing background opacity gradually (0.3s transition)
    setBackgroundOpacity(0.1);

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      // Calculate animated line positions
      const graphLineX = 10;
      const animated = normalizedLines.map((line, index) => {
        let startPos = line.startPos;
        let endPos = line.endPos;

        // Calculate line length and direction
        let dx = endPos.x - startPos.x;
        let dy = endPos.y - startPos.y;

        // If dx is negative, the line is pointing left. Swap positions to ensure
        // the line always animates from left to right (avoiding flip)
        if (dx < 0) {
          // Swap positions so line goes from left to right
          const temp = startPos;
          startPos = endPos;
          endPos = temp;
          dx = -dx;
          dy = -dy;
        }

        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Target position: horizontal, aligned to graph line
        const targetY = 30 + index * 10; // Stack vertically
        const targetStartX = graphLineX;
        const targetEndX = graphLineX + length;

        // Interpolate from original to target
        const currentStartX =
          startPos.x + (targetStartX - startPos.x) * progress;
        const currentStartY = startPos.y + (targetY - startPos.y) * progress;
        const currentEndX = endPos.x + (targetEndX - endPos.x) * progress;
        const currentEndY = endPos.y + (targetY - endPos.y) * progress;
        const currentAngle = angle + (0 - angle) * progress; // Rotate to 0 (horizontal)

        return {
          ...line,
          animatedStartX: currentStartX,
          animatedStartY: currentStartY,
          animatedEndX: currentEndX,
          animatedEndY: currentEndY,
          animatedAngle: currentAngle,
        };
      });

      setAnimatedLines(animated);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete - ensure final positions are set
        const finalAnimated = normalizedLines.map((line, index) => {
          const length = Math.sqrt(
            Math.pow(line.endPos.x - line.startPos.x, 2) +
              Math.pow(line.endPos.y - line.startPos.y, 2)
          );
          const targetY = 30 + index * 10;
          return {
            ...line,
            animatedStartX: graphLineX,
            animatedStartY: targetY,
            animatedEndX: graphLineX + length,
            animatedEndY: targetY,
            animatedAngle: 0,
          };
        });
        setAnimatedLines(finalAnimated);
      }
    };

    // Start animation immediately (no delay)
    animate();

    return () => {
      // Cleanup if needed
    };
  }, [
    step,
    comparisonAnimationStarted,
    comparisonAnimationComplete,
    showGraphLine,
    drawnLines,
    setAnimatedLines,
  ]);

  // Create point element
  const createPoint = (x, y, name) => {
    const pointColor = pointColors[name] || "#FFEB3B";
    const labelY = name === "A" || name === "B" ? y - 6 : y + 10;

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
      // Point label (non-selectable)
      React.createElement(
        "text",
        {
          x: x - 5,
          y: labelY,
          fill: "white",
          fontSize: 6,
          fontWeight: "bold",
          textAnchor: "start",
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

  // Handle mouse move for cursor detection (step 0 and step 2)
  const handleMouseMoveForCursor = (e) => {
    if ((step === 0 || step === 2) && !isDrawing) {
      const coords = getSVGCoordinates(e);
      const pointName = getPointAt(coords);
      setCursorNearPoint(!!pointName);
    } else {
      setCursorNearPoint(false);
    }
  };

  // Get cursor style based on proximity to points (step 0 and step 2)
  const getCursorStyle = () => {
    if ((step === 0 || step === 2) && !isDrawing) {
      return { cursor: cursorNearPoint ? "pointer" : "default" };
    }
    return {};
  };

  // Determine if feedback is correct or incorrect
  const isFeedbackCorrect = () => {
    // Check if feedback text contains correct feedback messages
    if (!feedbackText) return false;
    const correctMessages = [
      APP_DATA.step0.feedbackFirstCorrect,
      APP_DATA.step0.feedbackSecondCorrect,
    ];
    return correctMessages.some((msg) => feedbackText.includes(msg));
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
        onMouseDown: step === 0 || step === 2 ? handleMouseDown : null,
        onMouseMove:
          step === 0 || step === 2
            ? (e) => {
                handleMouseMove(e);
                handleMouseMoveForCursor(e);
              }
            : null,
        onMouseUp: step === 0 || step === 2 ? handleMouseUp : null,
        onTouchStart:
          step === 0 || step === 2
            ? (e) => {
                e.preventDefault();
                handleMouseDown(e);
              }
            : null,
        onTouchMove:
          step === 0 || step === 2
            ? (e) => {
                e.preventDefault();
                handleMouseMove(e);
              }
            : null,
        onTouchEnd:
          step === 0 || step === 2
            ? (e) => {
                e.preventDefault();
                handleMouseUp(e);
              }
            : null,
        onMouseLeave:
          (step === 0 || step === 2) && !isDrawing
            ? () => {
                setCursorNearPoint(false);
              }
            : null,
        style: getCursorStyle(),
      },
      // Step 1 and Step 3: Graph line (vertical dotted line at x=10) - only show during forward animation, thinner
      (step === 1 || step === 3) &&
        showGraphLine &&
        comparisonAnimationComplete &&
        React.createElement("line", {
          x1: 10,
          y1: 0,
          x2: 10,
          y2: 70,
          stroke: "white",
          strokeWidth: 0.5,
          strokeDasharray: "2,2",
        }),
      // Step 1 and Step 3: Dashed lines in original position (low opacity) during forward animation only
      (step === 1 || step === 3) &&
        comparisonAnimationStarted &&
        showGraphLine &&
        comparisonAnimationComplete &&
        animatedLines.length > 0 &&
        drawnLines
          .filter((line) => line.isValid)
          .map((line, index) =>
            React.createElement("line", {
              key: `dashed-${index}`,
              x1: line.startPos.x,
              y1: line.startPos.y,
              x2: line.endPos.x,
              y2: line.endPos.y,
              stroke: "white",
              strokeWidth: 0.5,
              strokeDasharray: "2,2",
              opacity: backgroundOpacity,
              style: {
                transition: "opacity 0.3s ease-out",
              },
            })
          ),
      // Step 1 and Step 3: Animated lines (in comparison view or reverse animation)
      (step === 1 || step === 3) &&
        comparisonAnimationStarted &&
        animatedLines.length > 0 &&
        animatedLines.map((line, index) => {
          const graphLineX = 10;
          const targetY = 30 + index * 10;
          const length = Math.sqrt(
            Math.pow(line.endPos.x - line.startPos.x, 2) +
              Math.pow(line.endPos.y - line.startPos.y, 2)
          );

          // Determine common point and end points based on step
          // Lines are normalized so common point is always the start point
          const commonPoint = step === 1 ? "A" : "N";
          // Since lines are normalized, we can directly use line.end as the label
          const getEndPointLabel = (line) => line.end;

          if (comparisonAnimationComplete && showGraphLine) {
            // Final horizontal position with labels and vertical lines
            // Use the actual animated positions (should be set to final values)
            const finalStartX =
              line.animatedStartX !== undefined
                ? line.animatedStartX
                : graphLineX;
            const finalStartY =
              line.animatedStartY !== undefined ? line.animatedStartY : targetY;
            const finalEndX =
              line.animatedEndX !== undefined
                ? line.animatedEndX
                : graphLineX + length;
            const finalEndY =
              line.animatedEndY !== undefined ? line.animatedEndY : targetY;

            return React.createElement(
              "g",
              { key: `animated-group-${index}` },
              // Line
              React.createElement("line", {
                x1: finalStartX,
                y1: finalStartY,
                x2: finalEndX,
                y2: finalEndY,
                stroke: line.color,
                strokeWidth: 1.2,
              }),
              // Start point label (common point: A for step1, N for step3) - positioned lower, non-selectable
              React.createElement(
                "text",
                {
                  x: finalStartX - 5,
                  y: finalStartY + 3,
                  fill: "white",
                  fontSize: 5,
                  fontWeight: "bold",
                  textAnchor: "start",
                  style: {
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    pointerEvents: "none",
                  },
                },
                commonPoint
              ),
              // End point label (B or M) - positioned lower, non-selectable
              React.createElement(
                "text",
                {
                  x: finalEndX + 2,
                  y: finalEndY + 3,
                  fill: "white",
                  fontSize: 5,
                  fontWeight: "bold",
                  textAnchor: "start",
                  style: {
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    pointerEvents: "none",
                  },
                },
                getEndPointLabel(line)
              ),
              // Vertical line at end point (matches line color, longer and thinner)
              React.createElement("line", {
                x1: finalEndX,
                y1: finalEndY - 3,
                x2: finalEndX,
                y2: finalEndY + 3,
                stroke: line.color,
                strokeWidth: 0.3,
                strokeDasharray: "1,1",
              })
            );
          } else {
            // Animated position (forward or reverse)
            return React.createElement("line", {
              key: `animated-${index}`,
              x1: line.animatedStartX || line.startPos.x,
              y1: line.animatedStartY || line.startPos.y,
              x2: line.animatedEndX || line.endPos.x,
              y2: line.animatedEndY || line.endPos.y,
              stroke: line.color,
              strokeWidth: 1.2,
            });
          }
        }),
      // Step 0 and Step 2: Draw permanent lines
      (step === 0 || step === 2) &&
        drawnLines.map((line, index) =>
          React.createElement("line", {
            key: `line-${index}`,
            x1: line.startPos.x,
            y1: line.startPos.y,
            x2: line.endPos.x,
            y2: line.endPos.y,
            stroke: line.color,
            strokeWidth: 1.2,
          })
        ),
      // Step 1 and Step 3: Draw permanent lines with low opacity during forward animation only
      (step === 1 || step === 3) &&
        comparisonAnimationStarted &&
        showGraphLine &&
        comparisonAnimationComplete &&
        animatedLines.length > 0 &&
        drawnLines
          .filter((line) => line.isValid)
          .map((line, index) =>
            React.createElement("line", {
              key: `line-low-opacity-${index}`,
              x1: line.startPos.x,
              y1: line.startPos.y,
              x2: line.endPos.x,
              y2: line.endPos.y,
              stroke: line.color,
              strokeWidth: 1.2,
              opacity: backgroundOpacity,
              style: {
                transition: "opacity 0.3s ease-out",
              },
            })
          ),
      // Step 1 and Step 3: Draw permanent lines after reverse animation
      (step === 1 || step === 3) &&
        (!comparisonAnimationStarted ||
          (animatedLines.length === 0 && !showGraphLine)) &&
        drawnLines.map((line, index) =>
          React.createElement("line", {
            key: `line-${index}`,
            x1: line.startPos.x,
            y1: line.startPos.y,
            x2: line.endPos.x,
            y2: line.endPos.y,
            stroke: line.color,
            strokeWidth: 1.2,
          })
        ),
      // Step 0 and Step 2: Current drawing line (straight line from start to current mouse position)
      (step === 0 || step === 2) &&
        isDrawing &&
        drawStartPoint &&
        drawCurrentCoords &&
        (() => {
          const startPos = getPointPos(drawStartPoint);
          if (!startPos) return null;
          return React.createElement("line", {
            x1: startPos.x,
            y1: startPos.y,
            x2: drawCurrentCoords.x,
            y2: drawCurrentCoords.y,
            stroke: "white",
            strokeWidth: 1.2,
          });
        })(),
      // Points (show in all steps, with low opacity during forward comparison animation only)
      React.createElement(
        "g",
        {
          opacity:
            (step === 1 || step === 3) &&
            comparisonAnimationStarted &&
            showGraphLine &&
            comparisonAnimationComplete &&
            animatedLines.length > 0
              ? backgroundOpacity
              : 1,
          style: {
            transition: "opacity 0.3s ease-out",
          },
        },
        createPoint(pointAPos.x, pointAPos.y, "A"),
        createPoint(pointBPos.x, pointBPos.y, "B"),
        createPoint(pointMPos.x, pointMPos.y, "M"),
        createPoint(pointNPos.x, pointNPos.y, "N")
      ),
      // Labels with low opacity during forward animation only
      (step === 1 || step === 3) &&
        comparisonAnimationStarted &&
        showGraphLine &&
        comparisonAnimationComplete &&
        animatedLines.length > 0 &&
        React.createElement(
          "g",
          {
            opacity: backgroundOpacity,
            style: {
              transition: "opacity 0.3s ease-out",
            },
          },
          // Point A label (non-selectable)
          React.createElement(
            "text",
            {
              x: pointAPos.x - 5,
              y: pointAPos.y - 6,
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
              style: {
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                pointerEvents: "none",
              },
            },
            "A"
          ),
          // Point B label (non-selectable)
          React.createElement(
            "text",
            {
              x: pointBPos.x - 5,
              y: pointBPos.y - 6,
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
              style: {
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                pointerEvents: "none",
              },
            },
            "B"
          ),
          // Point M label (non-selectable)
          React.createElement(
            "text",
            {
              x: pointMPos.x - 5,
              y: pointMPos.y + 10,
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
              style: {
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                pointerEvents: "none",
              },
            },
            "M"
          ),
          // Point N label (non-selectable)
          React.createElement(
            "text",
            {
              x: pointNPos.x - 5,
              y: pointNPos.y + 10,
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
              style: {
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                pointerEvents: "none",
              },
            },
            "N"
          )
        )
    ),
    // Step 0 and Step 2: Feedback overlay (top middle, with smooth fade)
    (step === 0 || step === 2) &&
      showFeedback &&
      feedbackText &&
      React.createElement("div", {
        ref: feedbackRef,
        className: `line-feedback ${
          isFeedbackCorrect()
            ? "line-feedback-correct"
            : "line-feedback-incorrect"
        }`,
        style: {
          position: "absolute",
          top: "4%",
          left: "50%",
          transform: "translate(-50%, 0)",
          padding: "1vw",
          borderRadius: "0.5vw",
          color: "white",
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
