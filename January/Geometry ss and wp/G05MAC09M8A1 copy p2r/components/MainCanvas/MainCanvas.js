const MainCanvas = ({ onSliderMove }) => {
  const { useState, useEffect, useRef } = React;

  // phases: "initial", "dragging", "animating", "completed"
  const [phase, setPhase] = useState("initial");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showParallelogramOutline, setShowParallelogramOutline] = useState(false);

  const svgRef = useRef(null);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);

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

  // Tilt logic
  const maxTiltOffset = 1 * gridSize;

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

  // Animation logic
  useEffect(() => {
    let animationFrame;
    if (phase === "animating") {
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
          setPhase("completed");
          if (onSliderMove) onSliderMove(true);
        }
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [phase, onSliderMove]);

  // Dragging logic
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      let clientX = e.clientX;
      let clientY = e.clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      
      if (svgRef.current) {
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgPoint = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
        
        const svgDeltaX = svgPoint.x - dragStartXRef.current;
        
        let newProgress = dragStartProgressRef.current + (svgDeltaX / rectW);
        newProgress = Math.max(0, Math.min(newProgress, 1));
        setProgress(newProgress);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setProgress((prev) => {
        if (prev >= 0.95) {
          setPhase("completed");
          if (onSliderMove) onSliderMove(true);
          return 1;
        }
        return prev;
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [isDragging, rectW, onSliderMove]);

  const handlePointerDown = (e) => {
    if (phase !== "dragging") return;
    e.preventDefault();
    setIsDragging(true);
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    if (svgRef.current) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const svgPoint = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
      dragStartXRef.current = svgPoint.x;
      dragStartProgressRef.current = progress;
    }
  };

  const handleTransformClick = () => {
    setPhase("dragging");
    setShowParallelogramOutline(true);
    setProgress(0);
  };

  const handleReplayClick = () => {
    setPhase("animating");
    setProgress(0);
  };

  // Dotted parallelogram outline
  const dottedParallelogramOutline = showParallelogramOutline && React.createElement(
    "polygon",
    {
      points: `
        ${startX + maxTiltOffset},${startY} 
        ${startX + rectW + maxTiltOffset},${startY} 
        ${startX + rectW},${startY + rectH} 
        ${startX},${startY + rectH}
      `,
      fill: "none",
      stroke: "white",
      strokeWidth: "2.5",
      strokeDasharray: "6",
      opacity: "0.6",
    }
  );

  // Initial shape (parallelogram)
  const initialShape = phase === "initial" && React.createElement(
    "polygon",
    {
      points: `
        ${startX + maxTiltOffset},${startY} 
        ${startX + rectW + maxTiltOffset},${startY} 
        ${startX + rectW},${startY + rectH} 
        ${startX},${startY + rectH}
      `,
      fill: "#9878d6",
      fillOpacity: "0.8",
      stroke: "white",
      strokeWidth: "2.5",
    }
  );

  // Destination triangle outline
  const destinationTriangle = (phase === "dragging" || phase === "animating") && React.createElement(
    "polygon",
    {
      points: `
        ${startX + rectW + maxTiltOffset},${startY} 
        ${startX + rectW},${startY + rectH} 
        ${startX + rectW + maxTiltOffset},${startY + rectH}
      `,
      fill: "none",
      stroke: "white",
      strokeWidth: "2",
      strokeDasharray: "6",
      opacity: "0.6",
    }
  );

  // Labels (Height and Base)
  const labels = React.createElement(
    "g",
    { pointerEvents: "none" },
    // Height line
    React.createElement("line", {
      x1: startX + maxTiltOffset,
      y1: startY,
      x2: startX + maxTiltOffset,
      y2: startY + rectH,
      stroke: "#00ffff",
      strokeWidth: "2",
      strokeDasharray: "6",
    }),
    // Height text
    React.createElement("text", {
      x: startX + maxTiltOffset + 15,
      y: startY + rectH / 2 + 5,
      fill: "#00ffff",
      fontSize: "20",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif"
    }, "Height (t)"),
    // Base text
    React.createElement("text", {
      x: startX + maxTiltOffset / 2 + rectW / 2,
      y: startY + rectH + 30,
      fill: "#ffff00",
      fontSize: "20",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      textAnchor: "middle"
    }, "Base (b)")
  );

  // Animation Phase or Dragging Phase shapes
  const splitShapes = (phase === "dragging" || phase === "animating") && React.createElement(
    "g",
    null,
    // Right part (Trapezoid)
    React.createElement("polygon", {
      points: `
        ${startX + maxTiltOffset},${startY} 
        ${startX + rectW + maxTiltOffset},${startY} 
        ${startX + rectW},${startY + rectH} 
        ${startX + maxTiltOffset},${startY + rectH}
      `,
      fill: "#9878d6",
      fillOpacity: "0.8",
      stroke: "white",
      strokeWidth: "2.5",
    }),
    // Left part (Sliding Triangle)
    React.createElement(
      "g",
      { 
        transform: `translate(${rectW * progress}, 0)`,
      },
      React.createElement("polygon", {
        points: `
          ${startX + maxTiltOffset},${startY} 
          ${startX},${startY + rectH} 
          ${startX + maxTiltOffset},${startY + rectH}
        `,
        fill: phase === "dragging" ? "#553396" : "#6b43b3",
        fillOpacity: "0.8",
        stroke: "white",
        strokeWidth: "2.5",
        style: phase === "dragging" ? { cursor: isDragging ? 'grabbing' : 'grab' } : {},
        onPointerDown: handlePointerDown,
        onTouchStart: handlePointerDown,
      })
    )
  );

  const completedShape = phase === "completed" && React.createElement("rect", {
    x: startX + maxTiltOffset,
    y: startY,
    width: rectW,
    height: rectH,
    fill: "#9878d6",
    fillOpacity: "0.8",
    stroke: "white",
    strokeWidth: "3",
  });

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "visual-row" },
      React.createElement(
        "svg",
        {
          ref: svgRef,
          viewBox: `0 0 ${svgWidth} ${svgHeight}`,
          className: "grid-svg",
          style: { touchAction: phase === "dragging" ? "none" : "auto" }
        },
        gridLines,
        gridDots,
        initialShape,
        destinationTriangle,
        splitShapes,
        completedShape,
        dottedParallelogramOutline,
        labels
      )
    ),
    React.createElement(
      "div",
      { className: "action-row", style: { display: 'flex', justifyContent: 'center', alignItems: 'center'} },
      phase === "initial" && React.createElement(
        "button",
        {
          onClick: handleTransformClick,
          style: {
            padding: "10px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }
        },
        "Transform"
      ),
      phase === "completed" && React.createElement(
        "button",
        {
          onClick: handleReplayClick,
          style: {
            padding: "10px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#475569",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }
        },
        "Replay"
      ),
      (phase === "dragging" || phase === "animating") && React.createElement(
        "div",
        { style: { height: "46px" } } // Placeholder space so buttons don't jump around
      )
    )
  );
};
