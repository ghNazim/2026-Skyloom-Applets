const MainCanvas = (props) => {
  const { step, step2SubStep, onSetNextEnabled, onUpdateTexts, onUpdateQuestionText, onForceNext } = props;
  const { useState, useEffect, useRef } = React;

  // SVG and Grid Constants - matching sample.js
  const gridSize = 40;
  const cols = 24;
  const rows = 10;
  const svgWidth = cols * gridSize;
  const svgHeight = rows * gridSize;
  
  // Fixed Base parameters (triangle centered in grid: cols=24, center at col 12)
  const startX = 9 * gridSize;
  const startY = 8 * gridSize;
  const b = 6 * gridSize;
  const copyGap = 1.5 * gridSize; // Gap between original and copied triangle in sub-step 2a

  // State for top vertex position
  const [topVertex, setTopVertex] = useState({ x: startX + 2.5 * gridSize, y: startY - 5 * gridSize });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  // Animation States:
  //   'initial'          – before any action in step 2
  //   'copy-appearing'   – clone sliding in from right (sub-step 2a button click)
  //   'copied'           – clone sitting to the right, static (sub-step 2a done)
  //   'cloning'          – clone flipping/moving left (sub-step 2b animation)
  //   'parallelogram'    – flip done, parallelogram formed
  //   'rect-transform'   – step 3 animation in progress
  //   'final-rect'       – rect formed
  const [animationStep, setAnimationStep] = useState('initial');
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const svgRef = useRef(null);

  // Step 2 & 3 replay state
  const [showReplay, setShowReplay] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [actionButtonClicked, setActionButtonClicked] = useState(false);

  // Step 4 & 5 state
  const [formulaStage, setFormulaStage] = useState(0);

  // Constraints for the top vertex
  const minHeight = 2 * gridSize;
  const maxHeight = 7 * gridSize;
  const minX = startX;
  const maxX = startX + b;

  // Derived dimensions
  const t = startY - topVertex.y;
  const p1 = { x: startX, y: startY };
  const p2 = { x: startX + b, y: startY };
  const p3 = { ...topVertex };

  // Color Palette
  const colorOrig = "#7c3aed";
  const opOrig = 0.7;
  const colorClone = "#7c3aed";
  const opClone = 0.35;
  const colorB = "#facc15";
  const colorT = "#22d3ee";

  // Pointer Event Handlers
  const handlePointerDown = () => {
    if (step === 1 && animationStep === 'initial') {
      setIsDragging(true);
      if (typeof playSound === "function") playSound("tick");
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setHasDragged(true);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || step !== 1 || animationStep !== 'initial' || !svgRef.current) return;
    const CTM = svgRef.current.getScreenCTM();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const x = (clientX - CTM.e) / CTM.a;
    const y = (clientY - CTM.f) / CTM.d;
    setTopVertex({
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(startY - maxHeight, Math.min(startY - minHeight, y))
    });
  };

  // Animation Controller
  const animate = (targetStep, duration, onComplete) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsAnimating(true);
    let startTime = null;
    const frame = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      setProgress(ease);
      if (p < 1) {
        animationRef.current = requestAnimationFrame(frame);
      } else {
        setAnimationStep(targetStep);
        setProgress(0);
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    };
    animationRef.current = requestAnimationFrame(frame);
  };

  // Sub-step 2a: copy button — clone slides in to the right, no flip
  const handleCopy = () => {
    if (isAnimating || actionButtonClicked) return;
    if (typeof playSound === "function") playSound("click");
    setActionButtonClicked(true);
    setAnimationStep('copy-appearing');
    animate('copied', 600, () => {
      onUpdateTexts(APP_DATA.steps[2].navTextAfterCopy);
      if (onUpdateQuestionText) onUpdateQuestionText(APP_DATA.steps[2].questionTextAfterCopy);
      onSetNextEnabled(true);
    });
  };

  const handleMakeRectangle = () => {
    if (isAnimating || actionButtonClicked) return;
    if (typeof playSound === "function") playSound("click");
    setActionButtonClicked(true);
    setAnimationStep('rect-transform');
    animate('final-rect', 1500, () => {
      setShowReplay(true);
      onUpdateTexts(APP_DATA.steps[3].navNext);
      if (onUpdateQuestionText) onUpdateQuestionText(APP_DATA.steps[3].navNextAfterAnimation);
      onSetNextEnabled(true);
    });
  };

  // Replay: in sub-step 2b replays the flip; in step 3 replays rect transform
  const handleReplay = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    if (step === 2) {
      setShowReplay(false);
      onUpdateTexts("");
      if (onUpdateQuestionText) onUpdateQuestionText("");
      onSetNextEnabled(false);
      setAnimationStep('cloning');
      setProgress(0);
      animate('parallelogram', 1500, () => {
        setShowReplay(true);
        onUpdateTexts(APP_DATA.steps[2].navNext);
        if (onUpdateQuestionText) onUpdateQuestionText(APP_DATA.steps[2].navNextAfterAnimation);
        onSetNextEnabled(true);
      });
    } else if (step === 3) {
      setAnimationStep('rect-transform');
      setProgress(0);
      animate('final-rect', 1500, () => {
        setShowReplay(true);
      });
    }
  };

  const handleAreaClick = () => {
    if (step === 5 && formulaStage === 0) {
      if (typeof playSound === "function") playSound("click");
      setFormulaStage(1);
      onUpdateTexts(APP_DATA.steps[5].navNext);
      if (onUpdateQuestionText) onUpdateQuestionText(APP_DATA.steps[5].questionTextAfter);
      onSetNextEnabled(true);
    }
  };

  // Step initialization
  useEffect(() => {
    if (step === 1) {
      setAnimationStep('initial');
      setProgress(0);
      setHasDragged(false);
      setIsDragging(false);
      setShowReplay(false);
      setIsAnimating(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[1].navText);
    }
    if (step === 2) {
      setAnimationStep('initial');
      setProgress(0);
      setShowReplay(false);
      setIsAnimating(false);
      setActionButtonClicked(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[2].navText);
    }
    if (step === 3) {
      setAnimationStep('parallelogram');
      setProgress(0);
      setShowReplay(false);
      setIsAnimating(false);
      setActionButtonClicked(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[3].navText);
    }
    if (step === 4) {
      setAnimationStep('final-rect');
      setProgress(0);
      setShowReplay(false);
      setIsAnimating(false);
      onSetNextEnabled(true);
      onUpdateTexts(APP_DATA.steps[4].navText);
    }
    if (step === 5) {
      setAnimationStep('final-rect');
      setProgress(0);
      setFormulaStage(0);
      setShowReplay(false);
      setIsAnimating(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[5].navText);
    }
  }, [step]);

  // Sub-step 2b: auto-start the flip animation when step2SubStep becomes 1
  useEffect(() => {
    if (step === 2 && step2SubStep === 1) {
      setShowReplay(false);
      onSetNextEnabled(false);
      onUpdateTexts("");
      if (onUpdateQuestionText) onUpdateQuestionText("");
      setAnimationStep('cloning');
      setProgress(0);
      animate('parallelogram', 1500, () => {
        setShowReplay(true);
        onUpdateTexts(APP_DATA.steps[2].navNext);
        if (onUpdateQuestionText) onUpdateQuestionText(APP_DATA.steps[2].navNextAfterAnimation);
        onSetNextEnabled(true);
      });
    }
  }, [step2SubStep]);

  // Validation for step 1 drag
  useEffect(() => {
    if (step === 1) {
      if (hasDragged) {
        onSetNextEnabled(true);
        onUpdateTexts(APP_DATA.steps[1].navNext);
      } else {
        onSetNextEnabled(false);
        onUpdateTexts(APP_DATA.steps[1].navText);
      }
    }
  }, [step, hasDragged]);

  const ptsStr = (pts) => pts.map(p => `${p.x},${p.y}`).join(' ');

  // Rendering Helpers
  const renderGrid = () => {
    const lines = [];
    const dots = [];
    for (let c = 0; c <= cols; c++) {
      const x = c * gridSize;
      lines.push(
        React.createElement("line", {
          key: `v-${c}`, x1: x, y1: 0, x2: x, y2: svgHeight,
          stroke: "#1e293b", strokeWidth: 1
        })
      );
      for (let r = 0; r <= rows; r++) {
        const y = r * gridSize;
        dots.push(React.createElement("circle", {
          key: `d-${c}-${r}`, cx: x, cy: y, r: 1.5, fill: "#334155"
        }));
      }
    }
    for (let r = 0; r <= rows; r++) {
      const y = r * gridSize;
      lines.push(
        React.createElement("line", {
          key: `h-${r}`, x1: 0, y1: y, x2: svgWidth, y2: y,
          stroke: "#1e293b", strokeWidth: 1
        })
      );
    }
    return React.createElement("g", null, ...lines, ...dots);
  };

  const renderTriangle = () => {
    // STAGE 1: INITIAL (before copy button is clicked)
    if (animationStep === 'initial') {
      return React.createElement("g", null,
        React.createElement("polygon", {
          points: ptsStr([p1, p2, p3]),
          fill: colorOrig, fillOpacity: opOrig,
          stroke: "#a78bfa", strokeWidth: 3
        }),
        React.createElement("line", {
          x1: p3.x, y1: p1.y, x2: p3.x, y2: p3.y,
          stroke: colorT, strokeWidth: 2.5
        }),
        React.createElement("text", {
          x: p3.x - 15, y: (p1.y + p3.y) / 2,
          textAnchor: "middle", fill: colorT, fontSize: 27, fontWeight: "bold"
        }, "t"),
        React.createElement("text", {
          x: startX + b / 2, y: startY + 25,
          textAnchor: "middle", fill: colorB, fontSize: 27, fontWeight: "bold"
        }, "b")
      );
    }

    // STAGE 2a: COPY-APPEARING / COPIED
    // Clone originates from the original triangle and slides rightward to its position
    if (animationStep === 'copy-appearing' || animationStep === 'copied') {
      const txFinal = b + copyGap;
      const tx = animationStep === 'copy-appearing'
        ? txFinal * progress
        : txFinal;

      return React.createElement("g", null,
        // Original triangle with height line
        React.createElement("polygon", {
          points: ptsStr([p1, p2, p3]),
          fill: colorOrig, fillOpacity: opOrig,
          stroke: "#a78bfa", strokeWidth: 3
        }),
        React.createElement("line", {
          x1: p3.x, y1: p1.y, x2: p3.x, y2: p3.y,
          stroke: colorT, strokeWidth: 2.5
        }),
        React.createElement("text", {
          x: p3.x - 15, y: (p1.y + p3.y) / 2,
          textAnchor: "middle", fill: colorT, fontSize: 27, fontWeight: "bold"
        }, "t"),
        // Base label
        React.createElement("text", {
          x: startX + b / 2, y: startY + 25,
          textAnchor: "middle", fill: colorB, fontSize: 27, fontWeight: "bold"
        }, "b"),
        // Clone group: translated right, not rotated
        React.createElement("g", { transform: `translate(${tx}, 0)` },
          React.createElement("polygon", {
            points: ptsStr([p1, p2, p3]),
            fill: colorClone, fillOpacity: opClone,
            stroke: "#a78bfa", strokeWidth: 3
          }),
          React.createElement("line", {
            x1: p3.x, y1: p1.y, x2: p3.x, y2: p3.y,
            stroke: colorT, strokeWidth: 2.5
          }),
          React.createElement("text", {
            x: p3.x - 15, y: (p1.y + p3.y) / 2,
            textAnchor: "middle", fill: colorT, fontSize: 27, fontWeight: "bold"
          }, "t")
        )
      );
    }

    // STAGE 2b: CLONING (flip animation) / PARALLELOGRAM
    // Clone starts at tx=b+copyGap, rotates 180° while moving left to tx=0
    if (animationStep === 'cloning' || animationStep === 'parallelogram') {
      const midX = (p2.x + p3.x) / 2;
      const midY = (p2.y + p3.y) / 2;
      const rot = animationStep === 'cloning' ? 180 * progress : 180;
      const tx  = animationStep === 'cloning' ? (b + copyGap) * (1 - progress) : 0;
      const labelX = p3.x - 15;
      const labelY = (p1.y + p3.y) / 2;

      return React.createElement("g", null,
        React.createElement("polygon", {
          points: ptsStr([p1, p2, p3]),
          fill: colorOrig, fillOpacity: opOrig,
          stroke: "#a78bfa", strokeWidth: 3
        }),
        React.createElement("text", {
          x: startX + b / 2, y: startY + 25,
          textAnchor: "middle", fill: colorB, fontSize: 27, fontWeight: "bold"
        }, "b"),
        React.createElement("g", {
          transform: `rotate(${rot}, ${midX + tx}, ${midY}) translate(${tx}, 0)`
        },
          React.createElement("polygon", {
            points: ptsStr([p1, p2, p3]),
            fill: colorClone, fillOpacity: opClone,
            stroke: "#a78bfa", strokeWidth: 3
          }),
          React.createElement("line", {
            x1: p3.x, y1: p1.y, x2: p3.x, y2: p3.y,
            stroke: colorT, strokeWidth: 2.5
          }),
          React.createElement("text", {
            x: labelX, y: labelY,
            textAnchor: "middle", fill: colorT, fontSize: 27, fontWeight: "bold",
            transform: `rotate(${-rot}, ${labelX}, ${labelY})`
          }, "t")
        )
      );
    }

    // STAGE 3: RECTANGLE TRANSFORMATION
    if (animationStep === 'rect-transform' || animationStep === 'final-rect') {
      const C = { x: p2.x + (p3.x - p1.x), y: p3.y };
      const D = p3;
      const sliceX = p2.x;
      const moveX = (animationStep === 'rect-transform') ? -b * progress : -b;

      return React.createElement("g", null,
        React.createElement("polygon", {
          points: ptsStr([p1, p2, p3]),
          fill: colorOrig, fillOpacity: opOrig,
          stroke: "#a78bfa", strokeWidth: 3
        }),
        React.createElement("polygon", {
          points: ptsStr([p2, { x: sliceX, y: D.y }, D]),
          fill: colorClone, fillOpacity: opClone,
          stroke: "#a78bfa", strokeWidth: 3
        }),
        React.createElement("g", { transform: `translate(${moveX}, 0)` },
          React.createElement("polygon", {
            points: ptsStr([p2, C, { x: sliceX, y: D.y }]),
            fill: colorClone, fillOpacity: opClone,
            stroke: "#a78bfa", strokeWidth: 3
          })
        ),
        React.createElement("line", {
          x1: sliceX, y1: startY, x2: sliceX, y2: startY - t,
          stroke: colorT, strokeWidth: 2.5
        }),
        React.createElement("text", {
          x: sliceX - 15, y: startY - t / 2,
          textAnchor: "middle", fill: colorT, fontSize: 27, fontWeight: "bold"
        }, "t"),
        React.createElement("text", {
          x: startX + b / 2, y: startY + 25,
          textAnchor: "middle", fill: colorB, fontSize: 27, fontWeight: "bold"
        }, "b")
      );
    }

    return null;
  };

  const renderDragPointer = () => {
    if (step === 1 && animationStep === 'initial') {
      return React.createElement("g", {
        onPointerDown: handlePointerDown,
        onTouchStart: handlePointerDown,
        style: { cursor: isDragging ? 'grabbing' : 'grab', touchAction: "none" }
      },
        React.createElement("circle", {
          cx: p3.x, cy: p3.y, r: 18,
          fill: "rgba(250, 204, 21, 0.15)"
        }),
        React.createElement("circle", {
          cx: p3.x, cy: p3.y, r: 8,
          fill: colorB,
          stroke: "white",
          strokeWidth: 2,
          className: isDragging ? "" : "animate-pulse"
        })
      );
    }
    return null;
  };

  // Action Row Content
  const renderActionRow = () => {
    if (step === 1) return null;

    // Step 2
    if (step === 2) {
      // Sub-step 0: show action button until clicked, then nothing
      if (step2SubStep === 0) {
        if (actionButtonClicked) return null; // button gone after click
        return React.createElement("div", { className: "action-content", style: { position: "relative", width: "100%" } },
          React.createElement("button", {
            className: "action-btn",
            onClick: handleCopy,
            disabled: isAnimating
          }, APP_DATA.steps[2].actionButton)
        );
      }
      // Sub-step 1: show replay button only after animation ends
      return React.createElement("div", { className: "action-content", style: { position: "relative", width: "100%" } },
        showReplay && React.createElement("button", {
          className: "replay-btn",
          onClick: handleReplay,
          disabled: isAnimating
        }, "⟲")
      );
    }

    // Step 3: hide Make rectangle button when clicked; show only replay when ready
    if (step === 3) {
      if (actionButtonClicked) {
        return React.createElement("div", { className: "action-content", style: { position: "relative", width: "100%", justifyContent: "center" } },
          showReplay && React.createElement("button", {
            className: "replay-btn",
            onClick: handleReplay,
            disabled: isAnimating
          }, "⟲")
        );
      }
      return React.createElement("div", { className: "action-content", style: { position: "relative", width: "100%" } },
        React.createElement("button", {
          className: "action-btn",
          onClick: handleMakeRectangle,
          disabled: isAnimating
        }, APP_DATA.steps[3].actionButton)
      );
    }

    // Step 4
    if (step === 4) {
      return React.createElement("div", { className: "action-content" },
        React.createElement("span", { className: "action-text" },
          APP_DATA.steps[4].textBefore,
          APP_DATA.steps[4].textAfter
        )
      );
    }

    // Step 5
    if (step === 5) {
      let formulaHtml = APP_DATA.steps[5].formulaText;
      formulaHtml = formulaHtml.replace(/ b /g, '<span class="highlight-yellow"> b </span>');
      formulaHtml = formulaHtml.replace(/ t$/g, '<span class="highlight-blue"> t </span>');

      return React.createElement("div", { className: "action-content" },
        React.createElement("span", { className: "action-text" },
          APP_DATA.steps[5].textBefore,
          formulaStage === 0
            ? React.createElement("span", {
                className: "clickable-box",
                onClick: handleAreaClick
              }, APP_DATA.steps[5].textAfter)
            : React.createElement("span", {
                dangerouslySetInnerHTML: { __html: formulaHtml }
              })
        )
      );
    }

    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    // VISUAL ROW
    React.createElement(
      "div",
      { className: "visual-row" },
      React.createElement(
        "svg",
        {
          ref: svgRef,
          width: "100%",
          height: "100%",
          viewBox: `0 0 ${svgWidth} ${svgHeight}`,
          className: "grid-svg",
          style: { display: "block", touchAction: "none" },
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp,
          onPointerLeave: handlePointerUp,
          onTouchMove: handlePointerMove,
          onTouchEnd: handlePointerUp,
          onTouchCancel: handlePointerUp
        },
        renderGrid(),
        renderTriangle(),
        renderDragPointer()
      )
    ),

    // ACTION ROW
    React.createElement(
      "div",
      { className: "action-row" },
      renderActionRow()
    )
  );
};
