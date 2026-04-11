const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onUpdateQuestionText, onForceNext, onHideNudge, onShowNudge } = props;
  const { useState, useEffect, useRef } = React;

  // ── Grid constants ──
  const gridSize = 40;
  const cols = 24;
  const rows = 10;
  const svgWidth = cols * gridSize;
  const svgHeight = rows * gridSize;

  // ── Trapezoid ABCD (SVG coords, y-down) ──
  // User coords (origin bottom-left): A(4,2) B(12,2) C(11,7) D(6,7)
  const A = { x: 4 * gridSize, y: 8 * gridSize };   // (160, 320)
  const B = { x: 12 * gridSize, y: 8 * gridSize };  // (480, 320)
  const C = { x: 10 * gridSize, y: 3 * gridSize };  // (440, 120)
  const D = { x: 6 * gridSize, y: 3 * gridSize };   // (240, 120)

  // Rotation center = midpoint of BC (the edge where clone joins original)
  const RC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }; // (460, 220)

  // Parallelogram vertices after 180° rotation of clone around RC
  const Ep = { x: 2 * RC.x - A.x, y: 2 * RC.y - A.y }; // (760, 120)
  const Hp = { x: 2 * RC.x - D.x, y: 2 * RC.y - D.y }; // (680, 320)

  const cloneGap = 10 * gridSize; // 400px horizontal shift for side-by-side view

  // ── Colors ──
  const FILL = "#8900CD";
  const FILL_OP = 0.55;
  const STROKE = "white";
  const STROKE_W = 2.5;
  const YELLOW = "#facc15";
  const CYAN = "#22d3ee";

  // Arrow y-positions
  const ARROW_Y_TOP = D.y - 25;
  const ARROW_Y_BOT = A.y + 25;

  // Localised labels
  const labelBaseA = APP_DATA.labels.baseA;
  const labelBaseB = APP_DATA.labels.baseB;
  const labelHeightT = APP_DATA.labels.heightT;

  // ── State ──
  const [phase, setPhase] = useState("entering");
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [substep, setSubstep] = useState(0);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [heightVisible, setHeightVisible] = useState(false);
  const [actionVisible, setActionVisible] = useState(false);

  const animRef = useRef(null);
  const timersRef = useRef([]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // ── Animation helper (cubic ease-in-out) ──
  const animate = (duration, onComplete) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setIsAnimating(true);
    setProgress(0);
    let start = null;
    const frame = (now) => {
      if (!start) start = now;
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(ease);
      if (t < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }
    };
    animRef.current = requestAnimationFrame(frame);
  };

  // ── Step initialisation ──
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (step === 1) {
      setPhase("entering");
      setLabelsVisible(false);
      setHeightVisible(false);
      setActionVisible(false);
      setProgress(0);
      timersRef.current.push(
        setTimeout(() => setLabelsVisible(true), 600),
        setTimeout(() => setHeightVisible(true), 1200),
        setTimeout(() => setActionVisible(true), 1700)
      );
    } else if (step === 2) {
      setPhase("cloned");
      setLabelsVisible(true);
      setHeightVisible(true);
      setActionVisible(true);
      setShowReplay(false);
      setProgress(0);
    } else if (step === 3) {
      setPhase("parallelogram");
      setSubstep(0);
      setProgress(0);
      setShowReplay(false);
    } else if (step === 4) {
      setPhase("two-trapezoids");
      setProgress(0);
    }
  }, [step]);

  // Inform App when actionable buttons are visible so it can show nudge
  useEffect(() => {
    if (!onShowNudge) return;
    if (step === 1 && actionVisible) {
      const el = document.getElementById("create-button");
      if (el) onShowNudge(el);
    }
    if (step === 2 && actionVisible && phase === "cloned") {
      const el = document.getElementById("transform-button");
      if (el) onShowNudge(el);
    }
  }, [step, actionVisible, phase, onShowNudge]);

  // ── Handlers ──
  const handleCreate = () => {
    if (isAnimating) return;
    if (onHideNudge) onHideNudge();
    if (typeof playSound === "function") playSound("click");
    setPhase("cloning");
    setActionVisible(false);
    animate(800, () => {
      setPhase("cloned");
      onForceNext();
    });
  };

  const handleTransform = () => {
    if (isAnimating) return;
    if (onHideNudge) onHideNudge();
    if (typeof playSound === "function") playSound("click");
    setPhase("transforming");
    setActionVisible(false);
    animate(1200, () => {
      setPhase("parallelogram");
      setShowReplay(true);
      onUpdateTexts(APP_DATA.steps[2].navNext);
      onSetNextEnabled(true);
    });
  };

  const handleReplay = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    setShowReplay(false);
    onSetNextEnabled(false);
    onUpdateTexts("");
    setPhase("cloned");
    timersRef.current.push(
      setTimeout(() => {
        setPhase("transforming");
        animate(1200, () => {
          setPhase("parallelogram");
          setShowReplay(true);
          onUpdateTexts(APP_DATA.steps[2].navNext);
          onSetNextEnabled(true);
        });
      }, 300)
    );
  };

  const handleSubstepClick = () => {
    if (step !== 3 || substep >= 3 || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    const next = substep + 1;
    setSubstep(next);
    const s3 = APP_DATA.steps[3];
    if (next === 1) {
      onUpdateQuestionText(s3.questionTextDeriving);
      onUpdateTexts(s3.navMiddle);
    } else if (next === 2) {
      onUpdateTexts(s3.navMiddle);
    } else if (next === 3) {
      onUpdateTexts(s3.navLast);
      onSetNextEnabled(true);
    }
  };

  // ── SVG helpers ──
  const ptsStr = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  const renderGrid = () => {
    const els = [];
    for (let c = 0; c <= cols; c++) {
      els.push(
        React.createElement("line", {
          key: `v${c}`, x1: c * gridSize, y1: 0, x2: c * gridSize, y2: svgHeight,
          stroke: "#1e293b", strokeWidth: 1,
        })
      );
    }
    for (let r = 0; r <= rows; r++) {
      els.push(
        React.createElement("line", {
          key: `h${r}`, x1: 0, y1: r * gridSize, x2: svgWidth, y2: r * gridSize,
          stroke: "#1e293b", strokeWidth: 1,
        })
      );
    }
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        els.push(
          React.createElement("circle", {
            key: `d${c}-${r}`, cx: c * gridSize, cy: r * gridSize, r: 1.5, fill: "#334155",
          })
        );
      }
    }
    return React.createElement("g", null, ...els);
  };

  // Bidirectional arrow with label
  const renderArrow = (x1, y, x2, label, below, opacity, key) => {
    if (opacity === undefined) opacity = 1;
    const sz = 8;
    const labelY = below ? y + 20 : y - 10;
    const mx = (x1 + x2) / 2;
    return React.createElement(
      "g", { key, opacity, style: { transition: "opacity 0.5s" } },
      React.createElement("line", { x1, y1: y, x2, y2: y, stroke: "white", strokeWidth: 1.5 }),
      React.createElement("polygon", {
        points: `${x1},${y} ${x1 + sz},${y - sz / 2} ${x1 + sz},${y + sz / 2}`, fill: "white",
      }),
      React.createElement("polygon", {
        points: `${x2},${y} ${x2 - sz},${y - sz / 2} ${x2 - sz},${y + sz / 2}`, fill: "white",
      }),
      React.createElement("text", {
        x: mx, y: labelY, textAnchor: "middle", fill: YELLOW, fontSize: 22, fontWeight: "bold",
      }, label)
    );
  };

  // Arrow variant where text is counter-rotated (used inside a rotated group)
  const renderArrowCR = (x1, y, x2, label, below, rot, key) => {
    const sz = 8;
    const labelY = below ? y + 20 : y - 10;
    const mx = (x1 + x2) / 2;
    return React.createElement(
      "g", { key },
      React.createElement("line", { x1, y1: y, x2, y2: y, stroke: "white", strokeWidth: 1.5 }),
      React.createElement("polygon", {
        points: `${x1},${y} ${x1 + sz},${y - sz / 2} ${x1 + sz},${y + sz / 2}`, fill: "white",
      }),
      React.createElement("polygon", {
        points: `${x2},${y} ${x2 - sz},${y - sz / 2} ${x2 - sz},${y + sz / 2}`, fill: "white",
      }),
      React.createElement("text", {
        x: mx, y: labelY, textAnchor: "middle", fill: YELLOW, fontSize: 22, fontWeight: "bold",
        transform: `rotate(${-rot}, ${mx}, ${labelY})`,
      }, label)
    );
  };

  // Height dashed line with label
  const renderHeight = (x, y1, y2, opacity, key) => {
    if (opacity === undefined) opacity = 1;
    const lx = x + 15;
    const ly = (y1 + y2) / 2 + 5;
    return React.createElement(
      "g", { key, opacity, style: { transition: "opacity 0.5s" } },
      React.createElement("line", {
        x1: x, y1, x2: x, y2,
        stroke: CYAN, strokeWidth: 2.5, strokeDasharray: "8,6",
      }),
      React.createElement("text", {
        x: lx, y: ly, textAnchor: "start", fill: CYAN, fontSize: 20, fontWeight: "bold",
      }, labelHeightT)
    );
  };

  // Height variant with counter-rotated text
  const renderHeightCR = (x, y1, y2, rot, key) => {
    const lx = x + 15;
    const ly = (y1 + y2) / 2 + 5;
    return React.createElement(
      "g", { key },
      React.createElement("line", {
        x1: x, y1, x2: x, y2,
        stroke: CYAN, strokeWidth: 2.5, strokeDasharray: "8,6",
      }),
      React.createElement("text", {
        x: lx, y: ly, textAnchor: "start", fill: CYAN, fontSize: 20, fontWeight: "bold",
        transform: `rotate(${-rot}, ${lx}, ${ly})`,
      }, labelHeightT)
    );
  };

  // ── Visual rendering (SVG content based on phase) ──
  const renderVisual = () => {
    // ─── Step 1: entering / cloning ───
    if (phase === "entering" || phase === "cloning") {
      const showClone = phase === "cloning";
      const cloneTx = showClone ? cloneGap * progress : 0;

      return React.createElement(
        "g", null,
        // Original trapezoid
        React.createElement("polygon", {
          points: ptsStr([A, B, C, D]),
          fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W,
        }),
        // Base arrows (fade in)
        renderArrow(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, labelsVisible ? 1 : 0, "ba-o"),
        renderArrow(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, labelsVisible ? 1 : 0, "bb-o"),
        // Height line (fade in)
        renderHeight(D.x, D.y, A.y, heightVisible ? 1 : 0, "ht-o"),
        // Clone (slides right during cloning)
        showClone &&
          React.createElement(
            "g", { transform: `translate(${cloneTx}, 0)` },
            React.createElement("polygon", {
              points: ptsStr([A, B, C, D]),
              fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W,
            }),
            renderArrow(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, 1, "ba-c"),
            renderArrow(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, 1, "bb-c"),
            renderHeight(D.x, D.y, A.y, 1, "ht-c")
          )
      );
    }

    // ─── Two trapezoids side-by-side (before Transform) ───
    if (phase === "cloned") {
      return React.createElement(
        "g", null,
        React.createElement("polygon", {
          points: ptsStr([A, B, C, D]),
          fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W,
        }),
        renderArrow(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, 1, "ba-o"),
        renderArrow(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, 1, "bb-o"),
        renderHeight(D.x, D.y, A.y, 1, "ht-o"),
        React.createElement(
          "g", { transform: `translate(${cloneGap}, 0)` },
          React.createElement("polygon", {
            points: ptsStr([A, B, C, D]),
            fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W,
          }),
          renderArrow(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, 1, "ba-c"),
          renderArrow(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, 1, "bb-c"),
          renderHeight(D.x, D.y, A.y, 1, "ht-c")
        )
      );
    }

    // ─── Transform animation ───
    if (phase === "transforming") {
      const rot = 180 * progress;
      const tx = cloneGap * (1 - progress);

      return React.createElement(
        "g", null,
        // Original stays put
        React.createElement("polygon", {
          points: ptsStr([A, B, C, D]),
          fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W,
        }),
        renderArrow(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, 1, "ba-o"),
        renderArrow(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, 1, "bb-o"),
        renderHeight(D.x, D.y, A.y, 1, "ht-o"),
        // Clone rotates + translates; labels counter-rotated for readability
        React.createElement(
          "g",
          { transform: `rotate(${rot}, ${RC.x + tx}, ${RC.y}) translate(${tx}, 0)` },
          React.createElement("polygon", {
            points: ptsStr([A, B, C, D]),
            fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W,
          }),
          renderArrowCR(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, rot, "ba-ct"),
          renderArrowCR(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, rot, "bb-ct"),
          renderHeightCR(D.x, D.y, A.y, rot, "ht-ct")
        )
      );
    }

    // ─── Parallelogram (step 2 result / step 3 formula) ───
    if (phase === "parallelogram") {
      const edgeColor = step === 2 ? YELLOW : STROKE;
      const edgeW = step === 2 ? 4 : STROKE_W;
      const highlightBase = step === 3 && substep >= 1;

      return React.createElement(
        "g", null,
        // Parallelogram shape
        React.createElement("polygon", {
          points: ptsStr([A, Hp, Ep, D]),
          fill: FILL, fillOpacity: FILL_OP, stroke: edgeColor, strokeWidth: edgeW,
        }),
        // Dashed joining line BC
        React.createElement("line", {
          x1: B.x, y1: B.y, x2: C.x, y2: C.y,
          stroke: "white", strokeWidth: 2, strokeDasharray: "8,6", opacity: 0.7,
        }),
        // Base AH highlight (step 3 substep >= 1)
        highlightBase &&
          React.createElement("line", {
            x1: A.x, y1: A.y, x2: Hp.x, y2: Hp.y,
            stroke: YELLOW, strokeWidth: 5,
          }),
        // Bottom arrows
        renderArrow(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, 1, "ba-pl"),
        renderArrow(B.x, ARROW_Y_BOT, Hp.x, labelBaseB, true, 1, "bb-pr"),
        // Top arrows
        renderArrow(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, 1, "bb-tl"),
        renderArrow(C.x, ARROW_Y_TOP, Ep.x, labelBaseA, false, 1, "ba-tr"),
        // Original height only
        renderHeight(D.x, D.y, A.y, 1, "ht-p")
      );
    }

    // ─── Two trapezoids – step 4 (first bright, second faded; no height on second) ───
    if (phase === "two-trapezoids") {
      return React.createElement(
        "g", null,
        // Original – full opacity, AB edge yellow
        React.createElement("polygon", {
          points: ptsStr([A, B, C, D]),
          fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W,
        }),
        React.createElement("line", {
          x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: YELLOW, strokeWidth: 5,
        }),
        renderArrow(A.x, ARROW_Y_BOT, B.x, labelBaseA, true, 1, "ba-o4"),
        renderArrow(D.x, ARROW_Y_TOP, C.x, labelBaseB, false, 1, "bb-o4"),
        renderHeight(D.x, D.y, A.y, 1, "ht-o4"),
        // Clone – 0.3 opacity
        React.createElement("polygon", {
          points: ptsStr([B, Hp, Ep, C]),
          fill: FILL, fillOpacity: FILL_OP, stroke: STROKE, strokeWidth: STROKE_W, opacity: 0.3,
        }),
        renderArrow(B.x, ARROW_Y_BOT, Hp.x, labelBaseB, true, 0.3, "bb-c4"),
        renderArrow(C.x, ARROW_Y_TOP, Ep.x, labelBaseA, false, 0.3, "ba-c4")
      );
    }

    return null;
  };

  // ── Action-row rendering ──
  const renderActionRow = () => {
    // Step 1: Create button
    if (step === 1) {
      if (!actionVisible || phase === "cloning") return null;
      return React.createElement(
        "div", { className: "action-content" },
        React.createElement(
          "button",
          { className: "action-btn", id: "create-button", onClick: handleCreate, disabled: isAnimating },
          APP_DATA.steps[1].actionButton
        )
      );
    }

    // Step 2: Transform / Replay
    if (step === 2) {
      if (phase === "parallelogram" && showReplay) {
        return React.createElement(
          "div", { className: "action-content" },
          React.createElement(
            "button",
            { className: "replay-btn", onClick: handleReplay, disabled: isAnimating },
            "\u27F2"
          )
        );
      }
      if (phase === "cloned" && actionVisible) {
        return React.createElement(
          "div", { className: "action-content" },
          React.createElement(
            "button",
            { className: "action-btn", id: "transform-button", onClick: handleTransform, disabled: isAnimating },
            APP_DATA.steps[2].actionButton
          )
        );
      }
      return null;
    }

    // Step 3: Formula substeps
    if (step === 3) {
      return renderFormulaSubstep();
    }

    // Step 4: Final formula
    if (step === 4) {
      return React.createElement(
        "div", { className: "action-content" },
        React.createElement(
          "span", { className: "action-text" },
          APP_DATA.steps[4].areaOfTrapezoid + " = \u00BD \u00D7 ",
          React.createElement("yl", null, "(a + b)"),
          " \u00D7 ",
          React.createElement("bl", null, "t")
        )
      );
    }

    return null;
  };

  const renderFormulaSubstep = () => {
    const s3 = APP_DATA.steps[3];
    const prefix = "2 \u00D7 " + s3.areaOfTrapezoid + " = ";

    if (substep === 0) {
      return React.createElement(
        "div", { className: "action-content" },
        React.createElement(
          "span", { className: "action-text" },
          prefix,
          React.createElement(
            "span", { className: "clickable-box", onClick: handleSubstepClick },
            s3.areaOfParallelogram
          )
        )
      );
    }

    if (substep === 1) {
      return React.createElement(
        "div", { className: "action-content" },
        React.createElement(
          "span", { className: "action-text" },
          prefix,
          React.createElement(
            "span", { className: "clickable-box", onClick: handleSubstepClick },
            React.createElement("yl", null, s3.base)
          ),
          " \u00D7 " + s3.height
        )
      );
    }

    if (substep === 2) {
      return React.createElement(
        "div", { className: "action-content" },
        React.createElement(
          "span", { className: "action-text" },
          prefix,
          React.createElement("yl", null, "(a + b)"),
          " \u00D7 ",
          React.createElement(
            "span", { className: "clickable-box", onClick: handleSubstepClick },
            React.createElement("bl", null, s3.height)
          )
        )
      );
    }

    if (substep === 3) {
      return React.createElement(
        "div", { className: "action-content" },
        React.createElement(
          "span", { className: "action-text" },
          prefix,
          React.createElement("yl", null, "(a + b)"),
          " \u00D7 ",
          React.createElement("bl", null, "t")
        )
      );
    }

    return null;
  };

  // ── Main render ──
  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    // Visual row
    React.createElement(
      "div",
      { className: "visual-row" },
      React.createElement(
        "svg",
        {
          width: "100%",
          height: "100%",
          viewBox: `0 0 ${svgWidth} ${svgHeight}`,
          className: "grid-svg",
          style: { display: "block" },
        },
        renderGrid(),
        renderVisual()
      )
    ),
    // Action row
    React.createElement(
      "div",
      { className: "action-row" },
      renderActionRow()
    )
  );
};
