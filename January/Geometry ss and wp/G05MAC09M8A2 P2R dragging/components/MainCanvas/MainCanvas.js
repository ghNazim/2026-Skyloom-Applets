const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onTransformClick } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  // phases: "initial" (full parallelogram), "dragging", "animating", "completed"
  const [phase, setPhase] = useState("initial");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showParallelogramOutline, setShowParallelogramOutline] = useState(false);
  const [formulaStage, setFormulaStage] = useState(0);
  const [showReplay, setShowReplay] = useState(false);
  const [handAnimProgress, setHandAnimProgress] = useState(0);

  const svgRef = useRef(null);
  const handAnimRef = useRef(null);
  const dragStartXRef = useRef(0);
  const dragStartProgressRef = useRef(0);
  const animationRef = useRef(null);

  // Grid constants (from MainCanvasRef)
  const gridSize = 50;
  const cols = 12;
  const rows = 8;
  const svgWidth = (cols - 1) * gridSize;
  const svgHeight = (rows - 1) * gridSize;

  const rectW = 5 * gridSize;
  const rectH = 3 * gridSize;
  const startX = 2 * gridSize;
  const startY = 2 * gridSize;
  const maxTiltOffset = 1 * gridSize;

  const gridLineColor = "rgba(148, 163, 184, 0.45)";
  const gridDotColor = "rgba(148, 163, 184, 0.5)";

  const handleSliderMove = useCallback(
    (enabled) => {
      onSetNextEnabled(enabled);
      onUpdateTexts(APP_DATA.steps[2].navNext);
      setShowReplay(true);
    },
    [onSetNextEnabled, onUpdateTexts]
  );

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

  // Animation logic (replay)
  useEffect(() => {
    if (phase !== "animating" || step !== 2) return;
    const startTime = performance.now();
    const duration = 1800;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const p = Math.min(elapsed / duration, 1);
      const easedP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setProgress(easedP);

      if (p < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("completed");
        handleSliderMove(true);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase, step, handleSliderMove]);

  // Dragging logic
  useEffect(() => {
    if (!isDragging || step !== 2) return;

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
        let newProgress = dragStartProgressRef.current + svgDeltaX / rectW;
        newProgress = Math.max(0, Math.min(newProgress, 1));
        setProgress(newProgress);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setProgress((prev) => {
        if (prev >= 0.95) {
          if (typeof playSound === "function") playSound("correct");
          setPhase("completed");
          handleSliderMove(true);
          return 1;
        }
        return prev;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
    window.addEventListener("touchcancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("touchcancel", handlePointerUp);
    };
  }, [isDragging, step]);

  const handlePointerDown = (e) => {
    if (phase !== "dragging" || step !== 2) return;
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
    if (typeof playSound === "function") playSound("click");
    onTransformClick();
  };

  const handleReplayClick = () => {
    if (typeof playSound === "function") playSound("click");
    setPhase("animating");
    setProgress(0);
  };

  const handleAreaClick = () => {
    if (step === 3 && formulaStage === 0) {
      if (typeof playSound === "function") playSound("click");
      setFormulaStage(1);
      onUpdateTexts(APP_DATA.steps[3].navNext);
      onSetNextEnabled(true);
    }
  };

  // Hand FTUE animation: move from triangle start to end in SVG coords
  const showHandFtue = step === 2 && phase === "dragging" && !isDragging;
  const triCentroidX = startX + (2 / 3) * maxTiltOffset;
  const triCentroidY = startY + (2 / 3) * rectH;
  const handStartX = triCentroidX;
  const handEndX = triCentroidX + rectW;
  const handSize = 55;

  useEffect(() => {
    if (!showHandFtue) return;
    let startTime = null;
    const duration = 2000;
    const animate = (now) => {
      if (!startTime) startTime = now;
      let elapsed = now - startTime;
      if (elapsed >= duration) {
        startTime = now;
        elapsed = 0;
      }
      const p = elapsed / duration;
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setHandAnimProgress(eased);
      handAnimRef.current = requestAnimationFrame(animate);
    };
    handAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (handAnimRef.current) cancelAnimationFrame(handAnimRef.current);
    };
  }, [showHandFtue]);

  // Step initialization
  useEffect(() => {
    if (step === 1) {
      setPhase("initial");
      setProgress(0);
      setShowParallelogramOutline(false);
      setShowReplay(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[1].navText);
    }
    if (step === 2) {
      setPhase("dragging");
      setProgress(0);
      setShowParallelogramOutline(true);
      setShowReplay(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[2].navText);
    }
    if (step === 3) {
      setPhase("completed");
      setProgress(1);
      setFormulaStage(0);
      setShowReplay(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[3].navText);
    }
  }, [step]);

  // Dotted parallelogram outline
  const dottedParallelogramOutline =
    showParallelogramOutline &&
    React.createElement("polygon", {
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
    });

  const initialShape =
    phase === "initial" &&
    React.createElement("polygon", {
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
    });

  const destinationTriangle =
    (phase === "dragging" || phase === "animating") &&
    React.createElement("polygon", {
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
    });

  const heightLineColor = "#00ffff";
  const baseX1 = phase === "initial" ? startX : startX + maxTiltOffset;
  const baseX2 = phase === "completed" ? startX + maxTiltOffset + rectW : startX + rectW;

  const labels = React.createElement(
    "g",
    { pointerEvents: "none" },
    React.createElement("line", {
      x1: startX + maxTiltOffset,
      y1: startY,
      x2: startX + maxTiltOffset,
      y2: startY + rectH,
      stroke: heightLineColor,
      strokeWidth: phase === "completed" ? "2.5" : "2",
      strokeDasharray: phase === "completed" ? "none" : "6",
    }),
    React.createElement("line", {
      x1: baseX1,
      y1: startY + rectH,
      x2: baseX2,
      y2: startY + rectH,
      stroke: "#facc15",
      strokeWidth: "2.5",
    }),
    React.createElement("text", {
      x: startX + maxTiltOffset + 15,
      y: startY + rectH / 2 + 5,
      fill: heightLineColor,
      fontSize: "20",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
    }, APP_DATA.labels?.height || "Height (t)"),
    React.createElement("text", {
      x: startX + maxTiltOffset / 2 + rectW / 2,
      y: startY + rectH + 30,
      fill: "#facc15",
      fontSize: "20",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      textAnchor: "middle",
    }, APP_DATA.labels?.base || "Base (b)")
  );

  const splitShapes =
    (phase === "dragging" || phase === "animating") &&
    React.createElement(
      "g",
      null,
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
      React.createElement(
        "g",
        { transform: `translate(${rectW * progress}, 0)` },
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
          style: phase === "dragging" ? { cursor: isDragging ? "grabbing" : "grab" } : {},
          onPointerDown: handlePointerDown,
          onTouchStart: handlePointerDown,
        })
      )
    );

  const completedShape =
    phase === "completed" &&
    React.createElement("rect", {
      x: startX + maxTiltOffset,
      y: startY,
      width: rectW,
      height: rectH,
      fill: "#9878d6",
      fillOpacity: "0.8",
      stroke: "white",
      strokeWidth: "3",
    });

  const renderActionRow = () => {
    // Step 1: Transform button
    if (step === 1) {
      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement("button", {
          className: "action-btn",
          onClick: handleTransformClick,
        }, APP_DATA.steps[1].actionButton)
      );
    }

    // Step 2: Transform (hidden) then Replay when completed
    if (step === 2) {
      if (phase === "initial") return null;
      if (phase === "dragging" || phase === "animating") {
        return React.createElement("div", { className: "action-content", style: { height: "46px" } });
      }
      if (phase === "completed" && showReplay) {
        return React.createElement(
          "div",
          { className: "action-content" },
          React.createElement("button", {
            className: "replay-btn",
            onClick: handleReplayClick,
          }, APP_DATA.steps[2].replayButton)
        );
      }
      return React.createElement("div", { className: "action-content", style: { height: "46px" } });
    }

    // Step 3: Action text with clickable box
    if (step === 3) {
      let formulaHtml = APP_DATA.steps[3].formulaText;
      formulaHtml = formulaHtml.replace(/ b /g, ' <span class="highlight-yellow">b</span> ');
      formulaHtml = formulaHtml.replace(/ t$/g, ' <span class="highlight-blue">t</span>');

      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement("span", { className: "action-text" },
          APP_DATA.steps[3].textBefore,
          formulaStage === 0
            ? React.createElement("span", {
                className: "clickable-box",
                onClick: handleAreaClick,
              }, APP_DATA.steps[3].textAfter)
            : React.createElement("span", {
                dangerouslySetInnerHTML: { __html: formulaHtml },
              })
        )
      );
    }

    return null;
  };

  const showSvg = step === 1 || step === 2 || step === 3;

  const handFtueImage =
    showHandFtue &&
    React.createElement("image", {
      href: "assets/tap.png",
      x: handStartX + (handEndX - handStartX) * handAnimProgress - handSize / 2,
      y: triCentroidY - handSize / 2,
      width: handSize,
      height: handSize,
      style: { pointerEvents: "none" },
      className: "hand-ftue-svg",
    });

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "visual-row" },
      showSvg &&
        React.createElement("svg", {
          ref: svgRef,
          viewBox: `0 0 ${svgWidth} ${svgHeight}`,
          className: "grid-svg",
          style: { touchAction: phase === "dragging" && step === 2 ? "none" : "auto" },
        }, gridLines, gridDots, initialShape, destinationTriangle, splitShapes, completedShape, dottedParallelogramOutline, labels, handFtueImage)
    ),
    React.createElement("div", { className: "action-row" }, renderActionRow())
  );
};
