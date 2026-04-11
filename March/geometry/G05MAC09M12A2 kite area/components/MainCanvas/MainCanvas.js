const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onTransformClick } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  // ─── Grid constants ───
  const gridSize = 50;
  const cols = 11;
  const rows = 8;
  const svgWidth = (cols - 1) * gridSize;
  const svgHeight = (rows - 1) * gridSize;

  // Center X: 1 gridpoint below exact middle
  const cx = 5 * gridSize;
  const cy = 4 * gridSize;

  // Kite vertices (SVG coords, y increases downward)
  const ptA = { x: cx, y: cy - 3 * gridSize };
  const ptB = { x: cx + 2 * gridSize, y: cy };
  const ptC = { x: cx, y: cy + 2 * gridSize };
  const ptD = { x: cx - 2 * gridSize, y: cy };
  const ptX = { x: cx, y: cy };

  // Rectangle extension vertices
  const ptM = { x: cx + 2 * gridSize, y: cy - 3 * gridSize };
  const ptN = { x: cx + 2 * gridSize, y: cy + 2 * gridSize };

  // ─── Colors ───
  const d1Color = "#ff9800";
  const d2Color = "#00ffff";
  const kiteFill = "#9878d6";
  const kiteOpacity = 0.8;
  const kiteStroke = "white";
  const kiteStrokeWidth = 2.5;
  const ghostDash = "8 4";
  const ghostOpacity = 0.5;
  const highlightColor = "#ffeb3b";
  const grayColor = "#888888";
  const gridLineColor = "rgba(148, 163, 184, 0.45)";
  const gridDotColor = "rgba(148, 163, 184, 0.5)";

  // ─── State ───
  const [phase, setPhase] = useState("initial");
  const [dxaProgress, setDxaProgress] = useState(0);
  const [cxdProgress, setCxdProgress] = useState(0);
  const [showTicks, setShowTicks] = useState(true);
  const [isReplaying, setIsReplaying] = useState(false);
  const [formulaStage, setFormulaStage] = useState(0);

  const svgRef = useRef(null);
  const gsapTweenRef = useRef(null);

  // ─── Helpers ───
  const lerp = (a, b, t) => a + (b - a) * t;

  // Vertical line x = const through a point (SVG y-down; “vertical” = parallel to y-axis)
  const reflectVertThrough = (p, lineX) => ({
    x: 2 * lineX - p.x,
    y: p.y,
  });

  // Clockwise rotation (positive angle) in SVG coordinates
  const rotateVecSvgCw = (vx, vy, ang) => {
    var c = Math.cos(ang);
    var s = Math.sin(ang);
    return {
      x: vx * c + vy * s,
      y: -vx * s + vy * c,
    };
  };

  // Two-phase animation: flip fraction sets the boundary between phase 1 and phase 2
  const flipFraction = 0.35;

  // Precomputed centroids of the reflected triangles (after flip through x = ptD.x)
  const dxaRefCentroid = (() => {
    var rX = reflectVertThrough(ptX, ptD.x);
    var rA = reflectVertThrough(ptA, ptD.x);
    return { x: (ptD.x + rX.x + rA.x) / 3, y: (ptD.y + rX.y + rA.y) / 3 };
  })();
  const dxaTargetCentroid = {
    x: (ptA.x + ptM.x + ptB.x) / 3,
    y: (ptA.y + ptM.y + ptB.y) / 3,
  };
  const cxdRefCentroid = (() => {
    var rC = reflectVertThrough(ptC, ptD.x);
    var rX = reflectVertThrough(ptX, ptD.x);
    return { x: (rC.x + rX.x + ptD.x) / 3, y: (rC.y + rX.y + ptD.y) / 3 };
  })();
  const cxdTargetCentroid = {
    x: (ptB.x + ptN.x + ptC.x) / 3,
    y: (ptB.y + ptN.y + ptC.y) / 3,
  };

  // DXA: Phase 1 → flip through x = ptD.x; Phase 2 → rotate π around centroid + reposition
  const dxaRigidAt = (p, t) => {
    var reflected = reflectVertThrough(p, ptD.x);
    if (t <= flipFraction) {
      var tF = t / flipFraction;
      return { x: lerp(p.x, reflected.x, tF), y: lerp(p.y, reflected.y, tF) };
    }
    var tR = (t - flipFraction) / (1 - flipFraction);
    var vx = reflected.x - dxaRefCentroid.x;
    var vy = reflected.y - dxaRefCentroid.y;
    var rot = rotateVecSvgCw(vx, vy, Math.PI * tR);
    return {
      x: lerp(dxaRefCentroid.x, dxaTargetCentroid.x, tR) + rot.x,
      y: lerp(dxaRefCentroid.y, dxaTargetCentroid.y, tR) + rot.y,
    };
  };

  // CXD: Phase 1 → flip through x = ptD.x; Phase 2 → rotate π around centroid + reposition
  const cxdRigidAt = (p, t) => {
    var reflected = reflectVertThrough(p, ptD.x);
    if (t <= flipFraction) {
      var tF = t / flipFraction;
      return { x: lerp(p.x, reflected.x, tF), y: lerp(p.y, reflected.y, tF) };
    }
    var tR = (t - flipFraction) / (1 - flipFraction);
    var vx = reflected.x - cxdRefCentroid.x;
    var vy = reflected.y - cxdRefCentroid.y;
    var rot = rotateVecSvgCw(vx, vy, Math.PI * tR);
    return {
      x: lerp(cxdRefCentroid.x, cxdTargetCentroid.x, tR) + rot.x,
      y: lerp(cxdRefCentroid.y, cxdTargetCentroid.y, tR) + rot.y,
    };
  };

  const pts = function () {
    var result = "";
    for (var i = 0; i < arguments.length; i++) {
      if (i > 0) result += " ";
      result += arguments[i].x + "," + arguments[i].y;
    }
    return result;
  };

  const createTickLines = (p1, p2, count) => {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const px = -dy / len;
    const py = dx / len;
    const ux = dx / len;
    const uy = dy / len;
    const tickLen = 10;
    const tickSpacing = 6;
    const lines = [];

    if (count === 1) {
      lines.push({
        x1: mx - px * tickLen,
        y1: my - py * tickLen,
        x2: mx + px * tickLen,
        y2: my + py * tickLen,
      });
    } else if (count === 2) {
      for (var i = -1; i <= 1; i += 2) {
        var tx = mx + ux * tickSpacing * i * 0.5;
        var ty = my + uy * tickSpacing * i * 0.5;
        lines.push({
          x1: tx - px * tickLen,
          y1: ty - py * tickLen,
          x2: tx + px * tickLen,
          y2: ty + py * tickLen,
        });
      }
    }
    return lines;
  };

  // ─── Grid ───
  const gridLines = [];
  for (var i = 0; i < cols; i++) {
    gridLines.push(
      React.createElement("line", {
        key: "v-" + i,
        x1: i * gridSize,
        y1: 0,
        x2: i * gridSize,
        y2: svgHeight,
        stroke: gridLineColor,
        strokeWidth: "1",
      }),
    );
  }
  for (var i = 0; i < rows; i++) {
    gridLines.push(
      React.createElement("line", {
        key: "h-" + i,
        x1: 0,
        y1: i * gridSize,
        x2: svgWidth,
        y2: i * gridSize,
        stroke: gridLineColor,
        strokeWidth: "1",
      }),
    );
  }

  const gridDots = [];
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      gridDots.push(
        React.createElement("circle", {
          key: "dot-" + i + "-" + j,
          cx: i * gridSize,
          cy: j * gridSize,
          r: "2.5",
          fill: gridDotColor,
        }),
      );
    }
  }

  // ─── Kill any running tween ───
  const killTween = () => {
    if (gsapTweenRef.current) {
      gsapTweenRef.current.kill();
      gsapTweenRef.current = null;
    }
  };

  // ─── Click handlers ───
  const handleDxaClick = () => {
    if (phase !== "clickDxa") return;
    if (typeof playSound === "function") playSound("click");
    setPhase("dxaAnimating");
    setShowTicks(false);

    var proxy = { t: 0 };
    gsapTweenRef.current = gsap.to(proxy, {
      t: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: function () {
        setDxaProgress(proxy.t);
      },
      onComplete: function () {
        if (typeof playSound === "function") playSound("tick");
        setPhase("clickCxd");
      },
    });
  };

  const handleCxdClick = () => {
    if (phase !== "clickCxd") return;
    if (typeof playSound === "function") playSound("click");
    setPhase("cxdAnimating");

    var proxy = { t: 0 };
    gsapTweenRef.current = gsap.to(proxy, {
      t: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: function () {
        setCxdProgress(proxy.t);
      },
      onComplete: function () {
        if (typeof playSound === "function") playSound("correct");
        setPhase("transformed");
        onSetNextEnabled(true);
        onUpdateTexts(APP_DATA.steps[2].navNext);
      },
    });
  };

  const handleReplayClick = () => {
    killTween();
    if (typeof playSound === "function") playSound("click");
    setDxaProgress(0);
    setCxdProgress(0);
    setIsReplaying(true);
  };

  const handleTransformBtnClick = () => {
    if (typeof playSound === "function") playSound("click");
    onTransformClick();
  };

  const handleAreaClick = () => {
    if (step === 3 && formulaStage === 0) {
      if (typeof playSound === "function") playSound("click");
      setFormulaStage(1);
      onUpdateTexts(
        APP_DATA.steps[3].navNext,
        APP_DATA.steps[3].questionTextAfter,
      );
      onSetNextEnabled(true);
    }
  };

  // ─── Replay animation effect ───
  useEffect(() => {
    if (!isReplaying) return;
    var proxy = { t: 0 };
    var tween = gsap.to(proxy, {
      t: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: function () {
        setDxaProgress(proxy.t);
        setCxdProgress(proxy.t);
      },
      onComplete: function () {
        if (typeof playSound === "function") playSound("correct");
        setIsReplaying(false);
      },
    });
    gsapTweenRef.current = tween;
    return function () {
      tween.kill();
    };
  }, [isReplaying]);

  // ─── Step initialization ───
  useEffect(() => {
    killTween();

    if (step === 1) {
      setPhase("initial");
      setShowTicks(true);
      setDxaProgress(0);
      setCxdProgress(0);
      setIsReplaying(false);
      onSetNextEnabled(false);
    }
    if (step === 2) {
      setPhase("clickDxa");
      setShowTicks(true);
      setDxaProgress(0);
      setCxdProgress(0);
      setIsReplaying(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[2].navText);
    }
    if (step === 3) {
      setPhase("rectangle");
      setFormulaStage(0);
      setIsReplaying(false);
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[3].navText);
    }
    if (step === 4) {
      setPhase("summary");
      setShowTicks(true);
      setIsReplaying(false);
      onSetNextEnabled(true);
    }
  }, [step]);

  // Cleanup on unmount
  useEffect(() => {
    return killTween;
  }, []);

  // ═══════════════════════════════════════════
  //  SVG RENDERING HELPERS
  // ═══════════════════════════════════════════

  const renderFilledTriangle = (key, p1, p2, p3, extraProps) => {
    return React.createElement(
      "polygon",
      Object.assign(
        {
          key: key,
          points: pts(p1, p2, p3),
          fill: kiteFill,
          fillOpacity: kiteOpacity,
          stroke: kiteStroke,
          strokeWidth: kiteStrokeWidth,
        },
        extraProps || {},
      ),
    );
  };

  const renderGhostTriangle = (key, p1, p2, p3, opacity) => {
    return React.createElement("polygon", {
      key: key,
      points: pts(p1, p2, p3),
      fill: "none",
      stroke: "white",
      strokeWidth: 2,
      strokeDasharray: ghostDash,
      opacity: opacity !== undefined ? opacity : ghostOpacity,
    });
  };

  // ─── Kite polygon (steps 1 & 4) ───
  const renderKite = () => {
    return React.createElement("polygon", {
      key: "kite",
      points: pts(ptA, ptB, ptC, ptD),
      fill: kiteFill,
      fillOpacity: kiteOpacity,
      stroke: kiteStroke,
      strokeWidth: kiteStrokeWidth,
    });
  };

  // ─── Diagonal lines and labels ───
  const renderDiagonals = (d2Gray) => {
    var d2Clr = d2Gray ? grayColor : d2Color;
    return React.createElement(
      "g",
      { key: "diagonals", pointerEvents: "none" },
      React.createElement("line", {
        x1: ptA.x,
        y1: ptA.y,
        x2: ptC.x,
        y2: ptC.y,
        stroke: d1Color,
        strokeWidth: 3,
        strokeDasharray: "10 6",
      }),
      React.createElement("line", {
        x1: ptD.x,
        y1: ptD.y,
        x2: ptB.x,
        y2: ptB.y,
        stroke: d2Clr,
        strokeWidth: 3,
        strokeDasharray: "10 6",
      }),
      React.createElement(
        "text",
        {
          x: ptX.x + 5,
          y: (ptA.y + ptX.y) / 2 + 5,
          fill: d1Color,
          fontSize: "22",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
        },
        APP_DATA.labels.d1,
      ),
      React.createElement(
        "text",
        {
          x: (ptD.x + ptX.x) / 2,
          y: ptX.y - 14,
          fill: d2Clr,
          fontSize: "22",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          textAnchor: "middle",
        },
        APP_DATA.labels.d2,
      ),
    );
  };

  // ─── Tick marks ───
  const renderTickMarks = () => {
    if (!showTicks) return null;
    var allTicks = [].concat(
      createTickLines(ptA, ptD, 2),
      createTickLines(ptA, ptB, 2),
      createTickLines(ptB, ptC, 1),
      createTickLines(ptC, ptD, 1),
    );
    return React.createElement(
      "g",
      { key: "ticks", pointerEvents: "none" },
      allTicks.map(function (tick, idx) {
        return React.createElement("line", {
          key: "tick-" + idx,
          x1: tick.x1,
          y1: tick.y1,
          x2: tick.x2,
          y2: tick.y2,
          stroke: "white",
          strokeWidth: 2.5,
        });
      }),
    );
  };

  // ─── ½ d₂ line (A → M) ───
  const renderHalfD2Line = (glowing) => {
    var lineProps = {
      x1: ptA.x,
      y1: ptA.y,
      x2: ptM.x,
      y2: ptM.y,
      stroke: d2Color,
      strokeWidth: glowing ? 4 : 3,
    };
    if (!glowing) lineProps.strokeDasharray = "10 6";
    if (glowing) lineProps.className = "glow-pulse-cyan";
    var textProps = {
      x: (ptA.x + ptM.x) / 2,
      y: ptA.y - 14,
      fill: d2Color,
      fontSize: "20",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      textAnchor: "middle",
    };
    if (glowing) textProps.className = "glow-pulse-cyan-label";
    return React.createElement(
      "g",
      { key: "half-d2", pointerEvents: "none" },
      React.createElement("line", lineProps),
      React.createElement(
        "text",
        textProps,
        APP_DATA.labels.halfD2,
      ),
    );
  };

  // ═══════════════════════════════════════════
  //  STEP 2: Four triangles + animations
  // ═══════════════════════════════════════════
  const renderStep2Triangles = () => {
    var elements = [];

    // Ghost target outlines (show until triangle arrives)
    if (dxaProgress < 1) {
      elements.push(
        renderGhostTriangle("ghost-amb-target", ptA, ptM, ptB, ghostOpacity),
      );
    }
    if (cxdProgress < 1) {
      elements.push(
        renderGhostTriangle("ghost-bnc-target", ptB, ptN, ptC, ghostOpacity),
      );
    }

    // Ghost at original positions (appear once triangle moves away)
    if (dxaProgress > 0) {
      elements.push(
        renderGhostTriangle("ghost-dxa-orig", ptD, ptX, ptA, ghostOpacity),
      );
    }
    if (cxdProgress > 0) {
      elements.push(
        renderGhostTriangle("ghost-cxd-orig", ptC, ptX, ptD, ghostOpacity),
      );
    }

    // Static triangles AXB and BXC (always present)
    elements.push(renderFilledTriangle("tri-axb", ptA, ptX, ptB));
    elements.push(renderFilledTriangle("tri-bxc", ptB, ptX, ptC));

    // ── CXD triangle ──
    if (cxdProgress > 0) {
      var c1 = cxdRigidAt(ptC, cxdProgress);
      var cx1 = cxdRigidAt(ptX, cxdProgress);
      var cd1 = cxdRigidAt(ptD, cxdProgress);
      elements.push(renderFilledTriangle("tri-cxd-anim", c1, cx1, cd1));
    } else if (phase === "clickCxd") {
      elements.push(
        React.createElement("polygon", {
          key: "tri-cxd-click",
          points: pts(ptC, ptX, ptD),
          fill: kiteFill,
          fillOpacity: 0.9,
          stroke: highlightColor,
          strokeWidth: 3,
          className: "triangle-clickable",
          onClick: handleCxdClick,
        }),
      );
    } else {
      elements.push(renderFilledTriangle("tri-cxd", ptC, ptX, ptD));
    }

    // ── DXA triangle ──
    if (dxaProgress > 0) {
      var dd1 = dxaRigidAt(ptD, dxaProgress);
      var dx1 = dxaRigidAt(ptX, dxaProgress);
      var da1 = dxaRigidAt(ptA, dxaProgress);
      elements.push(renderFilledTriangle("tri-dxa-anim", dd1, dx1, da1));
    } else if (phase === "clickDxa") {
      elements.push(
        React.createElement("polygon", {
          key: "tri-dxa-click",
          points: pts(ptD, ptX, ptA),
          fill: kiteFill,
          fillOpacity: 0.9,
          stroke: highlightColor,
          strokeWidth: 3,
          className: "triangle-clickable",
          onClick: handleDxaClick,
        }),
      );
    } else {
      elements.push(renderFilledTriangle("tri-dxa", ptD, ptX, ptA));
    }

    return React.createElement("g", { key: "step2-triangles" }, elements);
  };

  // ═══════════════════════════════════════════
  //  STEP 3: Rectangle view
  // ═══════════════════════════════════════════
  const renderStep3 = () => {
    var glowing = formulaStage >= 1;
    var d1LineProps = {
      key: "d1-line-s3",
      x1: ptA.x,
      y1: ptA.y,
      x2: ptC.x,
      y2: ptC.y,
      stroke: d1Color,
      strokeWidth: glowing ? 4 : 3,
      pointerEvents: "none",
    };
    if (!glowing) d1LineProps.strokeDasharray = "10 6";
    if (glowing) d1LineProps.className = "glow-pulse-orange";

    var d1LabelProps = {
      key: "d1-label-s3",
      x: ptX.x + 18,
      y: (ptA.y + ptX.y) / 2 + 5,
      fill: d1Color,
      fontSize: "22",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      pointerEvents: "none",
    };
    if (glowing) d1LabelProps.className = "glow-pulse-orange-label";

    return React.createElement(
      "g",
      { key: "step3-content" },
      renderGhostTriangle("ghost-dxa-s3", ptD, ptX, ptA, ghostOpacity),
      renderGhostTriangle("ghost-cxd-s3", ptC, ptX, ptD, ghostOpacity),
      React.createElement("polygon", {
        key: "rectangle",
        points: pts(ptA, ptM, ptN, ptC),
        fill: kiteFill,
        fillOpacity: kiteOpacity,
        stroke: kiteStroke,
        strokeWidth: kiteStrokeWidth,
      }),
      React.createElement("line", d1LineProps),
      React.createElement(
        "text",
        d1LabelProps,
        APP_DATA.labels.d1,
      ),
      renderHalfD2Line(glowing),
    );
  };

  // ═══════════════════════════════════════════
  //  Assemble all SVG content
  // ═══════════════════════════════════════════
  const renderSvgContent = () => {
    var elements = gridLines.concat(gridDots);

    if (step === 1) {
      elements.push(renderKite());
      elements.push(renderDiagonals(false));
      elements.push(renderTickMarks());
    }

    if (step === 2) {
      elements.push(renderStep2Triangles());
      var showD2Gray = phase === "transformed" && !isReplaying;
      elements.push(renderDiagonals(showD2Gray));
      if (showTicks && phase === "clickDxa") {
        elements.push(renderTickMarks());
      }
      if (phase === "transformed" && !isReplaying) {
        elements.push(renderHalfD2Line());
      }
    }

    if (step === 3) {
      elements.push(renderStep3());
    }

    if (step === 4) {
      elements.push(renderKite());
      elements.push(renderDiagonals(false));
      elements.push(renderTickMarks());
      elements.push(
        renderGhostTriangle("ghost-amb-s4", ptA, ptM, ptB, ghostOpacity),
      );
      elements.push(
        renderGhostTriangle("ghost-bnc-s4", ptB, ptN, ptC, ghostOpacity),
      );
      elements.push(renderHalfD2Line());
    }

    return elements;
  };

  // ═══════════════════════════════════════════
  //  ACTION ROW
  // ═══════════════════════════════════════════
  const renderActionRow = () => {
    if (step === 1) {
      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement(
          "button",
          {
            className: "action-btn",
            onClick: handleTransformBtnClick,
          },
          APP_DATA.steps[1].actionButton,
        ),
      );
    }

    if (step === 2) {
      if (phase === "transformed" && !isReplaying) {
        return React.createElement(
          "div",
          { className: "action-content" },
          React.createElement(
            "button",
            {
              className: "replay-btn",
              onClick: handleReplayClick,
            },
            APP_DATA.steps[2].replayButton,
          ),
        );
      }
      return React.createElement("div", {
        className: "action-content",
        style: { height: "46px" },
      });
    }

    if (step === 3) {
      var formulaHtml = APP_DATA.steps[3].formulaText
        .replace(/d₁/g, '<span class="highlight-orange">d₁</span>')
        .replace(/½ d₂/g, '<span class="highlight-cyan">½ d₂</span>');

      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement(
          "span",
          { className: "action-text" },
          APP_DATA.steps[3].textBefore,
          formulaStage === 0
            ? React.createElement(
                "span",
                {
                  className: "clickable-box",
                  onClick: handleAreaClick,
                },
                APP_DATA.steps[3].textAfter,
              )
            : React.createElement("span", {
                dangerouslySetInnerHTML: { __html: formulaHtml },
              }),
        ),
      );
    }

    if (step === 4) {
      var fHtml = APP_DATA.steps[4].formulaText
        .replace(/d₁/g, '<span class="highlight-orange">d₁</span>')
        .replace(/d₂/g, '<span class="highlight-cyan">d₂</span>');

      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement("span", {
          className: "action-text",
          dangerouslySetInnerHTML: { __html: fHtml },
        }),
      );
    }

    return null;
  };

  // ═══════════════════════════════════════════
  //  MAIN RENDER
  // ═══════════════════════════════════════════
  var showSvg = step >= 1 && step <= 4;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "visual-row" },
      showSvg &&
        React.createElement(
          "svg",
          {
            ref: svgRef,
            viewBox: "0 0 " + svgWidth + " " + svgHeight,
            className: "grid-svg",
          },
          renderSvgContent(),
        ),
    ),
    React.createElement("div", { className: "action-row" }, renderActionRow()),
  );
};
