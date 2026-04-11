const MainCanvas = function (props) {
  var step = props.step;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onUpdateTexts = props.onUpdateTexts;
  var onAdvanceStep = props.onAdvanceStep;

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useLayoutEffect = React.useLayoutEffect;
  var useRef = React.useRef;

  // ── Grid Constants ──
  var gridSize = 50;
  var gridCells = 11;
  var svgW = gridCells * gridSize;
  var svgH = gridCells * gridSize;

  // ── Points: math coords → SVG coords (y-flipped) ──
  var toSvg = function (mx, my) {
    return { x: mx * gridSize, y: (gridCells - my) * gridSize };
  };

  var ptA = toSvg(2, 7);
  var ptB = toSvg(2, 5);
  var ptC = toSvg(4, 3);
  var ptD = toSvg(10, 3);
  var ptE = toSvg(10, 7);
  var ptF = toSvg(10, 9);
  var ptG = toSvg(8, 9);
  var ptH = toSvg(8, 7);
  var ptI = toSvg(4, 7);

  // ── Colors ──
  var poolFill = "#A6F0FF";
  var poolStroke = "#7CC8D8";
  var trapFill = "#FFF2E5";
  var rectFill = "#D1F7FF";
  var sqFill = "#F4FFE8";
  var trapColor = "#d46401";
  var rectColor = "#00ACC1";
  var sqColor = "#4CAF50";
  var gridLineColor = "rgba(148, 163, 184, 0.45)";
  var gridDotColor = "rgba(148, 163, 184, 0.5)";
  var decompBorderColor = "#aa81f8";

  // ── State ──
  var decomposingState = useState(false);
  var decomposing = decomposingState[0];
  var setDecomposing = decomposingState[1];

  var decompDoneState = useState(false);
  var decompDone = decompDoneState[0];
  var setDecompDone = decompDoneState[1];

  var numpadValueState = useState("");
  var numpadValue = numpadValueState[0];
  var setNumpadValue = numpadValueState[1];

  var boxStateState = useState("default");
  var boxState = boxStateState[0];
  var setBoxState = boxStateState[1];

  var tlRef = useRef(null);
  var wrongTimerRef = useRef(null);
  var svgRef = useRef(null);
  var clickGuardRef = useRef(false);

  // ── Helpers ──
  var pts = function () {
    var r = "";
    for (var i = 0; i < arguments.length; i++) {
      if (i > 0) r += " ";
      r += arguments[i].x + "," + arguments[i].y;
    }
    return r;
  };

  var pathD = function () {
    var d = "M" + arguments[0].x + "," + arguments[0].y;
    for (var i = 1; i < arguments.length; i++) {
      d += " L" + arguments[i].x + "," + arguments[i].y;
    }
    d += " Z";
    return d;
  };

  var centroid = function () {
    var sx = 0,
      sy = 0;
    for (var i = 0; i < arguments.length; i++) {
      sx += arguments[i].x;
      sy += arguments[i].y;
    }
    return { x: sx / arguments.length, y: sy / arguments.length };
  };

  var trapCentroid = centroid(ptA, ptB, ptC, ptI);
  var rectCentroid = centroid(ptI, ptC, ptD, ptE);
  var sqCentroid = centroid(ptE, ptF, ptG, ptH);

  // ── Cleanup ──
  var killTimeline = function () {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
  };

  var clearWrongTimer = function () {
    if (wrongTimerRef.current) {
      clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = null;
    }
  };

  // ── Step Init ──
  useEffect(
    function () {
      killTimeline();
      clearWrongTimer();
      setNumpadValue("");
      setBoxState("default");
      clickGuardRef.current = false;

      if (step === 1) {
        setDecomposing(false);
        setDecompDone(false);
        onSetNextEnabled(true);
      } else if (step === 2) {
        setDecomposing(false);
        setDecompDone(false);
        onSetNextEnabled(false);
      } else if (step === 3 || step === 5 || step === 7) {
        onSetNextEnabled(false);
      } else if (step === 4 || step === 6 || step === 8) {
        onSetNextEnabled(false);
      } else if (step === 9) {
        onSetNextEnabled(true);
      }

      return function () {
        killTimeline();
        clearWrongTimer();
      };
    },
    [step],
  );

  // ── Decompose Animation (runs after DOM update) ──
  useLayoutEffect(
    function () {
      if (step !== 2 || !decomposing || decompDone) return;

      var trapPath = document.getElementById("trap-border-path");
      var rectPath = document.getElementById("rect-border-path");
      var sqPath = document.getElementById("sq-border-path");
      var trapFillEl = document.getElementById("trap-fill-poly");
      var rectFillEl = document.getElementById("rect-fill-poly");
      var sqFillEl = document.getElementById("sq-fill-poly");
      var trapLbl = document.getElementById("trap-label");
      var rectLbl = document.getElementById("rect-label");
      var sqLbl = document.getElementById("sq-label");

      if (!trapPath || !rectPath || !sqPath) return;

      var trapLen = trapPath.getTotalLength();
      var rectLen = rectPath.getTotalLength();
      var sqLen = sqPath.getTotalLength();

      gsap.set(trapPath, {
        strokeDasharray: trapLen,
        strokeDashoffset: trapLen,
        opacity: 1,
      });
      gsap.set(rectPath, {
        strokeDasharray: rectLen,
        strokeDashoffset: rectLen,
        opacity: 1,
      });
      gsap.set(sqPath, {
        strokeDasharray: sqLen,
        strokeDashoffset: sqLen,
        opacity: 1,
      });

      var tl = gsap.timeline({
        onComplete: function () {
          setDecompDone(true);
          onSetNextEnabled(true);
          onUpdateTexts(APP_DATA.steps[2].navTextAfter);
        },
      });

      tl.to(trapPath, { strokeDashoffset: 0, duration: 0.7, ease: "none" });
      tl.to(
        rectPath,
        { strokeDashoffset: 0, duration: 0.7, ease: "none" },
        "+=0.15",
      );
      tl.to(
        sqPath,
        { strokeDashoffset: 0, duration: 0.5, ease: "none" },
        "+=0.15",
      );

      tl.to(trapFillEl, { opacity: 1, duration: 0.3 }, "+=0.2");
      tl.to(trapLbl, { opacity: 1, duration: 0.3 }, "<");
      tl.to(rectFillEl, { opacity: 1, duration: 0.3 }, "+=0.15");
      tl.to(rectLbl, { opacity: 1, duration: 0.3 }, "<");
      tl.to(sqFillEl, { opacity: 1, duration: 0.3 }, "+=0.15");
      tl.to(sqLbl, { opacity: 1, duration: 0.3 }, "<");

      tlRef.current = tl;
    },
    [decomposing, step, decompDone],
  );

  // ── Decompose Button Handler ──
  var handleDecompose = function () {
    if (typeof playSound === "function") playSound("click");
    setDecomposing(true);
    onUpdateTexts(undefined, APP_DATA.steps[2].questionTextAfter);
  };

  // ── Shape Click ──
  var handleShapeClick = function () {
    if (clickGuardRef.current) return;
    clickGuardRef.current = true;
    if (typeof playSound === "function") playSound("click");
    onAdvanceStep();
  };

  // ── Numpad Handlers ──
  var handleNumpadNumber = function (num) {
    if (boxState !== "default") return;
    if (numpadValue.length >= 3) return;
    setNumpadValue(function (prev) {
      return prev + num;
    });
  };

  var handleNumpadClear = function () {
    if (boxState !== "default") return;
    setNumpadValue(function (prev) {
      return prev.slice(0, -1);
    });
  };

  var handleNumpadSubmit = function () {
    if (boxState !== "default" || numpadValue === "") return;
    var answers = { 4: "6", 6: "24", 8: "4" };
    var correct = answers[step];

    if (numpadValue === correct) {
      if (typeof playSound === "function") playSound("correct");
      setBoxState("correct");
      onSetNextEnabled(true);
      onUpdateTexts(APP_DATA.steps[step].navTextCorrect);
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setBoxState("wrong");
      wrongTimerRef.current = setTimeout(function () {
        setBoxState("default");
        setNumpadValue("");
      }, 800);
    }
  };

  // ── Visibility flags ──
  var showNumpad = step === 4 || step === 6 || step === 8;
  var showPoolShape = step === 1 || (step === 2 && !decomposing);
  var showDecomposed = (step === 2 && decomposing) || step >= 3;
  var fillsVisible = step >= 3 || decompDone;
  var clickableShape =
    step === 3 ? "trap" : step === 5 ? "rect" : step === 7 ? "sq" : null;

  // ════════════════════════════════════════
  //  SVG RENDERING
  // ════════════════════════════════════════

  // ── Grid ──
  var showGridLines = step >= 2;

  var renderGrid = function () {
    var els = [];
    if (showGridLines) {
      for (var i = 0; i <= gridCells; i++) {
        els.push(
          React.createElement("line", {
            key: "v" + i,
            x1: i * gridSize,
            y1: 0,
            x2: i * gridSize,
            y2: svgH,
            stroke: gridLineColor,
            strokeWidth: "1",
          }),
        );
        els.push(
          React.createElement("line", {
            key: "h" + i,
            x1: 0,
            y1: i * gridSize,
            x2: svgW,
            y2: i * gridSize,
            stroke: gridLineColor,
            strokeWidth: "1",
          }),
        );
      }
      for (var gx = 0; gx <= gridCells; gx++) {
        for (var gy = 0; gy <= gridCells; gy++) {
          els.push(
            React.createElement("circle", {
              key: "dot-" + gx + "-" + gy,
              cx: gx * gridSize,
              cy: (gridCells - gy) * gridSize,
              r: "2.5",
              fill: gridDotColor,
            }),
          );
        }
      }
    }
    return els;
  };

  // ── Pool as raster (step 1 only) ──
  var renderPoolImage = function () {
    return React.createElement("image", {
      key: "pool-image",
      href: "assets/pool.svg",
      x: 0,
      y: 0,
      width: svgW,
      height: svgH,
      preserveAspectRatio: "none",
    });
  };

  // ── Pool Shape (vector, step 2+ when pool is shown) ──
  var renderPoolShape = function () {
    return React.createElement("polygon", {
      key: "pool-shape",
      points: pts(ptA, ptB, ptC, ptD, ptF, ptG, ptH),
      fill: poolFill,
      fillOpacity: 0.8,
      stroke: poolStroke,
      strokeWidth: 2.5,
      strokeLinejoin: "round",
    });
  };

  // ── Decomposed Shapes ──
  var renderDecomposed = function () {
    var els = [];

    if (step === 2) {
      els.push(
        React.createElement("polygon", {
          key: "pool-behind",
          points: pts(ptA, ptB, ptC, ptD, ptF, ptG, ptH),
          fill: poolFill,
          fillOpacity: 0.8,
          stroke: poolStroke,
          strokeWidth: 2.5,
          strokeLinejoin: "round",
        }),
      );
    }

    var hiddenClass = fillsVisible ? "" : "decomp-hidden";

    els.push(
      React.createElement("polygon", {
        key: "trap-fill",
        id: "trap-fill-poly",
        points: pts(ptA, ptB, ptC, ptI),
        fill: trapFill,
        fillOpacity: 0.8,
        stroke: "none",
        className: hiddenClass,
      }),
    );
    els.push(
      React.createElement("polygon", {
        key: "rect-fill",
        id: "rect-fill-poly",
        points: pts(ptI, ptC, ptD, ptE),
        fill: rectFill,
        fillOpacity: 0.8,
        stroke: "none",
        className: hiddenClass,
      }),
    );
    els.push(
      React.createElement("polygon", {
        key: "sq-fill",
        id: "sq-fill-poly",
        points: pts(ptE, ptF, ptG, ptH),
        fill: sqFill,
        fillOpacity: 0.8,
        stroke: "none",
        className: hiddenClass,
      }),
    );

    var borderHidden = step === 2 && !decompDone ? "decomp-hidden" : "";

    els.push(
      React.createElement("path", {
        key: "trap-border",
        id: "trap-border-path",
        d: pathD(ptA, ptB, ptC, ptI),
        fill: "none",
        stroke: decompBorderColor,
        strokeWidth: 5,
        strokeLinejoin: "round",
        className: borderHidden,
      }),
    );
    els.push(
      React.createElement("path", {
        key: "rect-border",
        id: "rect-border-path",
        d: pathD(ptI, ptC, ptD, ptE),
        fill: "none",
        stroke: decompBorderColor,
        strokeWidth: 5,
        strokeLinejoin: "round",
        className: borderHidden,
      }),
    );
    els.push(
      React.createElement("path", {
        key: "sq-border",
        id: "sq-border-path",
        d: pathD(ptE, ptF, ptG, ptH),
        fill: "none",
        stroke: decompBorderColor,
        strokeWidth: 5,
        strokeLinejoin: "round",
        className: borderHidden,
      }),
    );

    els.push(
      React.createElement(
        "text",
        {
          key: "trap-lbl",
          id: "trap-label",
          x: trapCentroid.x,
          y: trapCentroid.y + 5,
          textAnchor: "middle",
          dominantBaseline: "middle",
          fill: trapColor,
          fontSize: "20",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          className: hiddenClass,
          pointerEvents: "none",
        },
        APP_DATA.labels.trapezoid,
      ),
    );
    els.push(
      React.createElement(
        "text",
        {
          key: "rect-lbl",
          id: "rect-label",
          x: rectCentroid.x,
          y: rectCentroid.y,
          textAnchor: "middle",
          dominantBaseline: "middle",
          fill: rectColor,
          fontSize: "22",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          className: hiddenClass,
          pointerEvents: "none",
        },
        APP_DATA.labels.rectangle,
      ),
    );
    els.push(
      React.createElement(
        "text",
        {
          key: "sq-lbl",
          id: "sq-label",
          x: sqCentroid.x,
          y: sqCentroid.y,
          textAnchor: "middle",
          dominantBaseline: "middle",
          fill: sqColor,
          fontSize: "20",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          className: hiddenClass,
          pointerEvents: "none",
        },
        APP_DATA.labels.square,
      ),
    );

    return React.createElement("g", { key: "decomp-group" }, els);
  };

  // ── Clickable Overlay + Tap GIF Indicator ──
  var tapGifSize = 1.5 * gridSize;

  var renderClickable = function () {
    if (!clickableShape) return null;

    var shapePoints, cx, cy;
    if (clickableShape === "trap") {
      shapePoints = pts(ptA, ptB, ptC, ptI);
      cx = trapCentroid.x;
      cy = trapCentroid.y;
    } else if (clickableShape === "rect") {
      shapePoints = pts(ptI, ptC, ptD, ptE);
      cx = rectCentroid.x;
      cy = rectCentroid.y;
    } else {
      shapePoints = pts(ptE, ptF, ptG, ptH);
      cx = sqCentroid.x;
      cy = sqCentroid.y;
    }

    return React.createElement(
      "g",
      { key: "clickable-group" },
      React.createElement("polygon", {
        key: "click-overlay",
        points: shapePoints,
        fill: "rgba(255,255,255,0.01)",
        stroke: "none",
        style: { cursor: "pointer" },
        className: "shape-clickable",
        onClick: handleShapeClick,
      }),
      React.createElement("image", {
        key: "tap-gif",
        href: "assets/tap.gif",
        x: cx - tapGifSize / 2,
        y: cy + tapGifSize / 3,
        width: tapGifSize,
        height: tapGifSize,
        pointerEvents: "none",
      }),
    );
  };

  // ── Assemble SVG ──
  var renderSvgContent = function () {
    var els = renderGrid();

    if (step === 1) {
      els.push(renderPoolImage());
    } else if (showPoolShape) {
      els.push(renderPoolShape());
    }

    if (showDecomposed) {
      els.push(renderDecomposed());
      var clickable = renderClickable();
      if (clickable) els.push(clickable);
    }

    return els;
  };

  // ════════════════════════════════════════
  //  ACTION ROW
  // ════════════════════════════════════════

  var renderActionRow = function () {
    var L = APP_DATA.labels;

    if (step === 1) {
      return React.createElement("div", { className: "action-content" });
    }

    if (step === 2) {
      if (!decomposing) {
        return React.createElement(
          "div",
          { className: "action-content" },
          React.createElement(
            "button",
            { className: "action-btn", onClick: handleDecompose },
            APP_DATA.steps[2].decomposeButton,
          ),
        );
      }
      return React.createElement("div", { className: "action-content" });
    }

    if (step === 3 || step === 5 || step === 7) {
      var trapVal =
        step >= 5
          ? React.createElement(
              "span",
              { style: { color: trapColor } },
              "6 " + L.sqUnits,
            )
          : React.createElement(
              "span",
              { style: { color: trapColor } },
              L.trapezoid,
            );
      var rectVal =
        step >= 7
          ? React.createElement(
              "span",
              { style: { color: rectColor } },
              "24 " + L.sqUnits,
            )
          : React.createElement(
              "span",
              { style: { color: rectColor } },
              L.rectangle,
            );
      var sqVal = React.createElement(
        "span",
        { style: { color: sqColor } },
        L.square,
      );

      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement(
          "span",
          { className: "action-text" },
          L.areaOfComposite + " = " + L.areaOf + " (",
          trapVal,
          " + ",
          rectVal,
          " + ",
          sqVal,
          ")",
        ),
      );
    }

    if (step === 4 || step === 6 || step === 8) {
      var shapeName, shapeColor;
      if (step === 4) {
        shapeName = L.trapezoid;
        shapeColor = trapColor;
      } else if (step === 6) {
        shapeName = L.rectangle;
        shapeColor = rectColor;
      } else {
        shapeName = L.square;
        shapeColor = sqColor;
      }

      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement(
          "span",
          { className: "action-text" },
          L.areaOf + " ",
          React.createElement(
            "span",
            { style: { color: shapeColor } },
            shapeName,
          ),
          " = ",
          React.createElement(
            "span",
            { className: "answer-box " + boxState },
            numpadValue || "\u00A0\u00A0",
          ),
          " " + L.sqUnits,
        ),
      );
    }

    if (step === 9) {
      return React.createElement(
        "div",
        { className: "action-content" },
        React.createElement(
          "span",
          {
            className: "action-text" + (current_language === "id" ? " id" : ""),
          },
          L.areaOfComposite + " = ",
          React.createElement(
            "span",
            { style: { color: trapColor } },
            "6 " + L.sqUnits,
          ),
          " + ",
          React.createElement(
            "span",
            { style: { color: rectColor } },
            "24 " + L.sqUnits,
          ),
          " + ",
          React.createElement(
            "span",
            { style: { color: sqColor } },
            "4 " + L.sqUnits,
          ),
          " = 34 " + L.sqUnits,
        ),
      );
    }

    return null;
  };

  // ════════════════════════════════════════
  //  MAIN RENDER
  // ════════════════════════════════════════

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "visual-row" },
      React.createElement(
        "div",
        { className: "svg-column" + (showNumpad ? "" : " centered") },
        React.createElement(
          "svg",
          {
            ref: svgRef,
            viewBox: "0 0 " + svgW + " " + svgH,
            className: "grid-svg",
            preserveAspectRatio: "xMidYMid meet",
          },
          renderSvgContent(),
        ),
      ),
      showNumpad &&
        React.createElement(
          "div",
          { className: "numpad-column" },
          React.createElement(Numpad, {
            onNumberClick: handleNumpadNumber,
            onClear: handleNumpadClear,
            onSubmit: handleNumpadSubmit,
            disabled: boxState === "correct",
          }),
        ),
    ),
    React.createElement("div", { className: "action-row" }, renderActionRow()),
  );
};
