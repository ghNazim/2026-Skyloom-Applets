const MainCanvas = () => {
  const { useState, useEffect, useRef } = React;

  var gridSize = 50;
  var hPoints = 11;
  var vPoints = 7;
  var svgWidth = (hPoints - 1) * gridSize;
  var svgHeight = (vPoints - 1) * gridSize;

  var gridLineColor = "rgba(148, 163, 184, 0.3)";
  var gridDotColor = "rgba(148, 163, 184, 0.45)";
  var shapeFill = "#87CEEB";
  var shapeStroke = "white";
  var shapeStrokeWidth = 3;
  var outlineStrokeWidth = 4;
  var pointFill = "#facc15";
  var pointStroke = "white";
  var pointStrokeWidth = 2;

  var toSvg = function (gx, gy) {
    return { x: gx * gridSize, y: (6 - gy) * gridSize };
  };

  var shapes = [
    [toSvg(1, 1), toSvg(7, 1), toSvg(9, 5), toSvg(3, 5)],
    [toSvg(1, 1), toSvg(5.3, 1), toSvg(7.3, 5), toSvg(3, 5)],
    [toSvg(1, 1), toSvg(5, 1), toSvg(5, 5), toSvg(1, 5)],
    [toSvg(1, 1), toSvg(7, 1), toSvg(7, 5), toSvg(1, 5)],
  ];

  var _cs = useState(0);
  var currentIndex = _cs[0];
  var setCurrentIndex = _cs[1];

  var _pi = useState(null);
  var prevIndex = _pi[0];
  var setPrevIndex = _pi[1];

  var _an = useState(false);
  var isAnimating = _an[0];
  var setIsAnimating = _an[1];

  var _ap = useState(0);
  var animProgress = _ap[0];
  var setAnimProgress = _ap[1];

  var _at = useState(-1);
  var animTarget = _at[0];
  var setAnimTarget = _at[1];

  var _tg = useState(true);
  var showTapGif = _tg[0];
  var setShowTapGif = _tg[1];

  var gsapTweenRef = useRef(null);

  var nextActiveIndex = (currentIndex + 1) % 4;

  var lerp = function (a, b, t) {
    return a + (b - a) * t;
  };

  var getButtonState = function (index) {
    if (isAnimating) {
      if (index === currentIndex) return "current";
      return "disabled";
    }
    if (index === currentIndex) return "current";
    if (index === nextActiveIndex) return "next-active";
    return "disabled";
  };

  var handleButtonClick = function (index) {
    if (isAnimating || index !== nextActiveIndex) return;
    if (typeof playSound === "function") playSound("click");

    // Remove previous-outline immediately; show outline for the current shape while animating
    setIsAnimating(true);
    setShowTapGif(false);
    setAnimTarget(index);
    setPrevIndex(null);

    var proxy = { t: 0 };
    gsapTweenRef.current = gsap.to(proxy, {
      t: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: function () {
        setAnimProgress(proxy.t);
      },
      onComplete: function () {
        // New current is the clicked (next) shape; previous becomes the old current
        setPrevIndex(currentIndex);
        setCurrentIndex(index);
        setIsAnimating(false);
        setAnimProgress(0);
        setAnimTarget(-1);
        setShowTapGif(true);
      },
    });
  };

  useEffect(function () {
    return function () {
      if (gsapTweenRef.current) gsapTweenRef.current.kill();
    };
  }, []);

  var getDisplayPoints = function () {
    if (isAnimating && animTarget >= 0) {
      return shapes[currentIndex].map(function (fp, i) {
        return {
          x: lerp(fp.x, shapes[animTarget][i].x, animProgress),
          y: lerp(fp.y, shapes[animTarget][i].y, animProgress),
        };
      });
    }
    return shapes[currentIndex];
  };

  // Grid
  var renderGrid = function () {
    var elements = [];
    for (var i = 0; i < hPoints; i++) {
      elements.push(
        React.createElement("line", {
          key: "v" + i,
          x1: i * gridSize,
          y1: 0,
          x2: i * gridSize,
          y2: svgHeight,
          stroke: gridLineColor,
          strokeWidth: 1,
        })
      );
    }
    for (var i = 0; i < vPoints; i++) {
      elements.push(
        React.createElement("line", {
          key: "h" + i,
          x1: 0,
          y1: i * gridSize,
          x2: svgWidth,
          y2: i * gridSize,
          stroke: gridLineColor,
          strokeWidth: 1,
        })
      );
    }
    for (var i = 0; i < hPoints; i++) {
      for (var j = 0; j < vPoints; j++) {
        elements.push(
          React.createElement("circle", {
            key: "d" + i + "-" + j,
            cx: i * gridSize,
            cy: j * gridSize,
            r: 2,
            fill: gridDotColor,
          })
        );
      }
    }
    return elements;
  };

  // Shape polygon
  var renderShape = function () {
    var pts = getDisplayPoints();
    var pointsStr = pts
      .map(function (p) {
        return p.x + "," + p.y;
      })
      .join(" ");
    return React.createElement("polygon", {
      key: "shape",
      points: pointsStr,
      fill: shapeFill,
      fillOpacity: 0.85,
      stroke: shapeStroke,
      strokeWidth: shapeStrokeWidth,
      strokeLinejoin: "round",
    });
  };

  // Outline of previous shape (except at start), and during animation outline = current shape
  var renderOutline = function () {
    var outlinePts = null;
    if (isAnimating) {
      outlinePts = shapes[currentIndex];
    } else if (prevIndex !== null && prevIndex !== undefined) {
      // Special case: when we just transitioned Rectangle → Parallelogram,
      // hide the previous-outline entirely.
      if (currentIndex === 0 && prevIndex === 3) return null;
      outlinePts = shapes[prevIndex];
    }

    if (!outlinePts) return null;

    var pointsStr = outlinePts
      .map(function (p) {
        return p.x + "," + p.y;
      })
      .join(" ");

    return React.createElement("polygon", {
      key: "outline",
      points: pointsStr,
      fill: "none",
      stroke: "rgba(255, 255, 255, 0.7)",
      strokeWidth: outlineStrokeWidth,
      strokeDasharray: "10 7",
      strokeLinejoin: "round",
      pointerEvents: "none",
    });
  };

  // Points (yellow) for the current shape, including during animation
  // Parallelogram/Square/Rectangle: show B and C. Rhombus: show D.
  var renderShapePoints = function () {
    var pts = getDisplayPoints();
    var idxs = currentIndex === 1 ? [3] : [1, 2];

    return React.createElement(
      "g",
      { key: "shape-points", pointerEvents: "none" },
      idxs.map(function (i) {
        var p = pts[i];
        return React.createElement("circle", {
          key: "pt-" + i,
          cx: p.x,
          cy: p.y,
          r: 7,
          fill: pointFill,
          stroke: pointStroke,
          strokeWidth: pointStrokeWidth,
          style: { filter: "drop-shadow(0 0 6px rgba(250, 204, 21, 0.65))" },
        });
      })
    );
  };

  // Buttons
  var renderButtons = function () {
    return DATA.buttons.map(function (text, index) {
      var state = getButtonState(index);
      var isClickable = state === "next-active";

      return React.createElement(
        "div",
        { key: "bw" + index, className: "btn-wrapper" },
        React.createElement("button", {
          className: "shape-btn shape-btn-" + state,
          disabled: !isClickable,
          onClick: function () {
            handleButtonClick(index);
          },
          dangerouslySetInnerHTML: { __html: text },
        }),
        state === "next-active" &&
          showTapGif &&
          React.createElement("img", {
            src: "assets/tap.gif",
            alt: "",
            className: "tap-gif",
          })
      );
    });
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "buttons-column" },
      renderButtons()
    ),
    React.createElement(
      "div",
      { className: "visual-column" },
      React.createElement(
        "div",
        { className: "heading-row" },
        React.createElement(
          "h2",
          { className: "shape-heading" },
          DATA.headings[currentIndex]
        )
      ),
      React.createElement(
        "div",
        { className: "svg-row" },
        React.createElement(
          "div",
          { className: "svg-panel" },
          React.createElement(
            "svg",
            {
              viewBox: "0 0 " + svgWidth + " " + svgHeight,
              className: "grid-svg",
              preserveAspectRatio: "xMidYMid meet",
            },
            renderGrid(),
            renderShape(),
            renderOutline(),
            renderShapePoints()
          )
        )
      ),
      React.createElement(
        "div",
        { className: "formula-row" },
        React.createElement(
          "p",
          { className: "formula-text" },
          DATA.formulas[currentIndex]
        )
      )
    )
  );
};
