const MainCanvas = ({ onSliderMove }) => {
  const { useState, useEffect, useRef } = React;

  const [tilt, setTilt] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasSliderMoved, setHasSliderMoved] = useState(false);
  const isResettingRef = useRef(false);

  // Grid constants
  const gridSize = 50;
  const cols = 12;
  const rows = 8;
  const svgWidth = (cols - 1) * gridSize;
  const svgHeight = (rows - 1) * gridSize;

  // Rectangle dimensions
  const rectW = 5 * gridSize;
  const rectH = 3 * gridSize;

  // Starting position (anchored to grid points)
  const startX = 2 * gridSize;
  const startY = 2 * gridSize;

  // Tilt logic - max tilt is 2 grid units
  const maxTiltOffset = 2 * gridSize;
  const currentTiltOffset = (tilt / 2) * maxTiltOffset;

  const gridLineColor = "rgba(148, 163, 184, 0.45)";
  const gridDotColor = "rgba(148, 163, 184, 0.5)";

  // Generate grid lines
  const gridLines = [];
  for (let i = 0; i < cols; i++) {
    gridLines.push(
      React.createElement("line", {
        key: "v-" + i,
        x1: i * gridSize,
        y1: 0,
        x2: i * gridSize,
        y2: svgHeight,
        stroke: gridLineColor,
        strokeWidth: "1",
      })
    );
  }
  for (let i = 0; i < rows; i++) {
    gridLines.push(
      React.createElement("line", {
        key: "h-" + i,
        x1: 0,
        y1: i * gridSize,
        x2: svgWidth,
        y2: i * gridSize,
        stroke: gridLineColor,
        strokeWidth: "1",
      })
    );
  }

  // Generate grid dots
  const gridDots = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      gridDots.push(
        React.createElement("circle", {
          key: "dot-" + i + "-" + j,
          cx: i * gridSize,
          cy: j * gridSize,
          r: "2",
          fill: gridDotColor,
        })
      );
    }
  }

  // Animation logic for the sliding triangle
  useEffect(() => {
    let animationFrame;
    let resetTimeout;
    if (isAnimating) {
      const startTime = performance.now();
      const duration = 1800;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const p = Math.min(elapsed / duration, 1);

        // Cubic easing for smooth movement
        const easedP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setProgress(easedP);

        if (p < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          setIsComplete(true);
          // Auto-reset after 1 second
          resetTimeout = setTimeout(() => {
            isResettingRef.current = true;
            setTilt(0);
            setIsAnimating(false);
            setProgress(0);
            setIsComplete(false);
            setHasSliderMoved(false);
            if (onSliderMove) onSliderMove(false);
            // Reset the flag after a short delay to allow state updates to complete
            setTimeout(() => {
              isResettingRef.current = false;
            }, 100);
          }, 1000);
        }
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(animationFrame);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, [isAnimating, onSliderMove]);

  const handleSliderChange = (e) => {
    const newTilt = parseFloat(e.target.value);
    setTilt(newTilt);
    if (!hasSliderMoved && newTilt > 0) {
      setHasSliderMoved(true);
      if (onSliderMove) onSliderMove(true);
    }
  };

  const handleSliderRelease = () => {
    // Trigger animation when user releases slider at maximum
    if (tilt >= 1.98 && !isAnimating && !isComplete && !isResettingRef.current) {
      setIsAnimating(true);
    }
  };

  // Stage: Interactive Tilt
  const interactiveShape = !isAnimating && !isComplete && React.createElement(
    "polygon",
    {
      points: `
        ${startX + currentTiltOffset},${startY} 
        ${startX + rectW + currentTiltOffset},${startY} 
        ${startX + rectW},${startY + rectH} 
        ${startX},${startY + rectH}
      `,
      fill: tilt === 0 ? "#b56666" : "#a2c4e0",
      fillOpacity: "0.8",
      stroke: "white",
      strokeWidth: "2.5",
    }
  );

  // Stage: Animation Phase
  const animationShape = isAnimating && React.createElement(
    "g",
    null,
    // Main Body (Trapezoid)
    React.createElement("polygon", {
      points: `
        ${startX + maxTiltOffset},${startY} 
        ${startX + rectW},${startY} 
        ${startX + rectW},${startY + rectH} 
        ${startX},${startY + rectH}
      `,
      fill: "#a2c4e0",
      fillOpacity: "0.8",
      stroke: "white",
      strokeWidth: "2.5",
    }),
    // Sliding Triangle Piece
    React.createElement(
      "g",
      { transform: `translate(${-rectW * progress}, 0)` },
      React.createElement("polygon", {
        points: `
          ${startX + rectW},${startY} 
          ${startX + rectW + maxTiltOffset},${startY} 
          ${startX + rectW},${startY + rectH}
        `,
        fill: "#a2c4e0",
        fillOpacity: "0.8",
        stroke: "white",
        strokeWidth: "2.5",
      })
    )
  );

  // Stage: Completed
  const completedShape = isComplete && React.createElement("rect", {
    x: startX,
    y: startY,
    width: rectW,
    height: rectH,
    fill: "#b56666",
    fillOpacity: "0.8",
    stroke: "white",
    strokeWidth: "3",
  });

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    // Visual Row (80% height)
    React.createElement(
      "div",
      { className: "visual-row" },
      React.createElement(
        "svg",
        {
          viewBox: `0 0 ${svgWidth} ${svgHeight}`,
          className: "grid-svg",
        },
        gridLines,
        gridDots,
        interactiveShape,
        animationShape,
        completedShape
      )
    ),

    // Action Row (20% height)
    React.createElement(
      "div",
      { className: "action-row" },
      React.createElement("input", {
        type: "range",
        min: "0",
        max: "2",
        step: "0.01",
        value: tilt,
        onChange: handleSliderChange,
        onMouseUp: handleSliderRelease,
        onTouchEnd: handleSliderRelease,
        disabled: isAnimating || isComplete,
        className: "tilt-slider",
      })
    )
  );
};
