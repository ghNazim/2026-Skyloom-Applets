const DilationGraph = (props) => {
  const { useMemo, useCallback, useState, useEffect } = React;
  const {
    center = DILATION_ORIGIN,
    rayPolygons,
    polygons = [],
    dilationK = 1,
    showRays = false,
    rayProgress = 1,
    showNegativeRays = false,
    showSlider = false,
    sliderEnabled = true,
    kMin = 0.1,
    kMax = 1.8,
    onKChange,
    onKDragStart,
    onKRelease,
    dimmed = false,
    orientationClone = null,
    labelsJitter = false,
    strokeHighlight = null,
    blinkHighlight = null,
    feedbackHtml = "",
  } = props;

  const GRID_COLOR = "#1a4b6d";
  const PRE_IMAGE_FILL = "rgba(52, 152, 219, 0.75)";
  const IMAGE_FILL = "rgba(46, 204, 113, 0.75)";
  const WHITE = "#ffffff";
  const YELLOW = "#f1c40f";

  const PAD = 24;
  const UNIT = 38;
  const PLOT_W = DILATION_GRID_COLS * UNIT;
  const PLOT_H = DILATION_GRID_ROWS * UNIT;
  const SVG_W = PAD * 2 + PLOT_W;
  const SVG_H = PAD * 2 + PLOT_H + 8;

  const dimOpacity = dimmed ? 0.28 : 1;

  const toSvg = useCallback(
    (mx, my) => ({
      x: PAD + mx * UNIT,
      y: PAD + (DILATION_GRID_ROWS - my) * UNIT,
    }),
    [PAD, UNIT],
  );

  const centerPt = toSvg(center.x, center.y);

  const pointsToPath = (pts) =>
    "M " +
    pts.map((p, i) => (i === 0 ? "" : "L ") + p.x + "," + p.y).join(" ") +
    " Z";

  const gridEls = useMemo(() => {
    const els = [];
    for (let i = 0; i <= DILATION_GRID_COLS; i++) {
      const x = PAD + i * UNIT;
      els.push(
        React.createElement("line", {
          key: "gv-" + i,
          x1: x,
          y1: PAD,
          x2: x,
          y2: PAD + PLOT_H,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    for (let j = 0; j <= DILATION_GRID_ROWS; j++) {
      const y = PAD + j * UNIT;
      els.push(
        React.createElement("line", {
          key: "gh-" + j,
          x1: PAD,
          y1: y,
          x2: PAD + PLOT_W,
          y2: y,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    return els;
  }, [PAD, UNIT, PLOT_W, PLOT_H, GRID_COLOR]);

  const renderAxes = () => {
    const o = centerPt;
    const left = toSvg(0, center.y);
    const right = toSvg(DILATION_GRID_COLS, center.y);
    const bottom = toSvg(center.x, 0);
    const top = toSvg(center.x, DILATION_GRID_ROWS);

    const axisLine = (x2, y2, key) =>
      React.createElement("line", {
        key: key,
        x1: o.x,
        y1: o.y,
        x2: x2,
        y2: y2,
        stroke: WHITE,
        strokeWidth: 2,
        markerEnd: "url(#axis-arrow)",
        opacity: dimOpacity,
      });

    return React.createElement(
      React.Fragment,
      null,
      axisLine(right.x, o.y, "axis-pos-x"),
      axisLine(left.x, o.y, "axis-neg-x"),
      axisLine(o.x, top.y, "axis-pos-y"),
      axisLine(o.x, bottom.y, "axis-neg-y"),
    );
  };

  const renderRaysForPolygon = (poly) => {
    if (!showRays || !poly.points || !poly.points.length) return null;
    const lines = [];
    const length = RAY_LENGTH * rayProgress;

    poly.points.forEach((pt, i) => {
      const posEnd = rayEndpoint(center, pt, length);
      const negEnd = rayEndpoint(center, pt, -length);
      const posSvg = toSvg(posEnd.x, posEnd.y);
      const negSvg = toSvg(negEnd.x, negEnd.y);

      lines.push(
        React.createElement("line", {
          key: poly.id + "-ray-pos-" + i,
          x1: centerPt.x,
          y1: centerPt.y,
          x2: posSvg.x,
          y2: posSvg.y,
          stroke: YELLOW,
          strokeWidth: 2,
          strokeDasharray: "8 6",
          opacity: 0.95 * dimOpacity,
        }),
      );

      if (showNegativeRays) {
        lines.push(
          React.createElement("line", {
            key: poly.id + "-ray-neg-" + i,
            x1: centerPt.x,
            y1: centerPt.y,
            x2: negSvg.x,
            y2: negSvg.y,
            stroke: YELLOW,
            strokeWidth: 2,
            strokeDasharray: "8 6",
            opacity: 0.95 * dimOpacity,
          }),
        );
      }
    });

    return lines;
  };

  const getStrokeWidth = (poly, isDilated) => {
    const base = isDilated ? 2.5 : 2.5;
    if (!strokeHighlight && !blinkHighlight) return base;
    const target = isDilated ? "dilated" : "original";
    const polyId = poly.id;

    if (strokeHighlight) {
      const sh = strokeHighlight;
      if (
        (sh === "original" && !isDilated) ||
        (sh === "dilated" && isDilated) ||
        sh === "both"
      ) {
        return 5;
      }
    }

    if (blinkHighlight) {
      const bh = blinkHighlight;
      if (bh.polyId && bh.polyId !== polyId) return base;
      if (
        (bh.mode === "original" && !isDilated) ||
        (bh.mode === "dilated" && isDilated) ||
        bh.mode === "both"
      ) {
        return bh.on ? 5 : 2.5;
      }
    }

    return base;
  };

  const renderPolygon = (poly) => {
    if (!poly.visible) return null;

    const k = poly.dilationK !== undefined ? poly.dilationK : dilationK;
    const dilPtsMath = poly.points.map((p) => dilatePoint(p, center, k));
    const triSvg = poly.points.map((p) => toSvg(p.x, p.y));
    const dilSvg = dilPtsMath.map((p) => toSvg(p.x, p.y));
    const showDil = poly.showDilated;

    const preimageCentroid = polygonCentroid(poly.points);
    const imageCentroid = polygonCentroid(dilPtsMath);

    const labelOffset = (vertexMath, label, isPrime) => {
      const centroid = isPrime ? imageCentroid : preimageCentroid;
      const labelMath = radialLabelMathPoint(vertexMath, centroid, 0.35);
      const labelSvg = toSvg(labelMath.x, labelMath.y);
      const jitter = isPrime && labelsJitter;

      return React.createElement(
        "g",
        {
          key: label,
          transform:
            "translate(" + labelSvg.x + "," + labelSvg.y + ")",
          opacity: dimOpacity,
        },
        React.createElement(
          "g",
          { className: jitter ? "vertex-label-jitter" : undefined },
          React.createElement(
            "text",
            {
              x: 0,
              y: 0,
              dy: "0.35em",
              fill: WHITE,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "system-ui, sans-serif",
              textAnchor: "middle",
              className: "vertex-label",
            },
            label,
          ),
        ),
      );
    };

    const clickHandler =
      poly.clickable && typeof poly.onClick === "function"
        ? poly.onClick
        : undefined;

    return React.createElement(
      React.Fragment,
      { key: poly.id },
      showDil
        ? React.createElement("path", {
            d: pointsToPath(dilSvg),
            fill: IMAGE_FILL,
            stroke: WHITE,
            strokeWidth: getStrokeWidth(poly, true),
            opacity: dimOpacity,
            pointerEvents: "none",
          })
        : null,
      showDil && poly.primeLabels
        ? dilPtsMath.map((p, i) =>
            labelOffset(p, poly.primeLabels[i] || "", true),
          )
        : null,
      React.createElement("path", {
        d: pointsToPath(triSvg),
        fill: PRE_IMAGE_FILL,
        stroke: WHITE,
        strokeWidth: getStrokeWidth(poly, false),
        opacity: dimOpacity,
        style: clickHandler ? { cursor: "pointer" } : undefined,
        onClick: clickHandler,
      }),
      poly.labels
        ? poly.points.map((p, i) => labelOffset(p, poly.labels[i] || "", false))
        : null,
    );
  };

  const renderOrientationClone = () => {
    if (!orientationClone || !orientationClone.active) return null;
    const poly = orientationClone.polygon;
    if (!poly) return null;

    const pts = getOrientationClonePoints(
      orientationClone.progress,
      poly.points,
      center,
      orientationClone.targetK,
    );
    const svgPts = pts.map((p) => toSvg(p.x, p.y));

    return React.createElement("path", {
      d: pointsToPath(svgPts),
      fill: PRE_IMAGE_FILL,
      stroke: WHITE,
      strokeWidth: 3,
      opacity: 1,
    });
  };

  const kPct = ((dilationK - kMin) / (kMax - kMin)) * 100;

  const handleKInput = (e) => {
    if (typeof onKChange === "function") {
      onKChange(clampDilationK(e.target.value, kMin, kMax));
    }
  };

  const handleKPointerDown = () => {
    if (!sliderEnabled) return;
    if (typeof onKDragStart === "function") onKDragStart();
  };

  const handleKPointerUp = (e) => {
    if (!sliderEnabled) return;
    if (typeof onKRelease === "function") {
      onKRelease(clampDilationK(e.target.value, kMin, kMax));
    }
  };

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [displayFeedbackHtml, setDisplayFeedbackHtml] = useState("");

  useEffect(() => {
    if (feedbackHtml) {
      setDisplayFeedbackHtml(feedbackHtml);
      const frameId = requestAnimationFrame(() => setFeedbackVisible(true));
      return () => cancelAnimationFrame(frameId);
    }
    setFeedbackVisible(false);
    const timeoutId = setTimeout(() => setDisplayFeedbackHtml(""), 350);
    return () => clearTimeout(timeoutId);
  }, [feedbackHtml]);

  return React.createElement(
    "div",
    { className: "dilation-graph-panel dilation-graph-panel-overlay" },
    React.createElement(
      "div",
      { className: "dilation-graph-row" },
      React.createElement(
        "div",
        { className: "dilation-svg-wrap" },
        React.createElement(
          "svg",
          {
            viewBox: "0 0 " + SVG_W + " " + SVG_H,
            className: "dilation-coordinate-svg",
            preserveAspectRatio: "xMidYMid meet",
          },
          React.createElement(
            "defs",
            null,
            React.createElement(
              "marker",
              {
                id: "axis-arrow",
                markerWidth: 8,
                markerHeight: 8,
                refX: 4,
                refY: 4,
                orient: "auto",
              },
              React.createElement("path", {
                d: "M0,0 L8,4 L0,8 Z",
                fill: WHITE,
              }),
            ),
          ),
          gridEls,
          renderAxes(),
          (rayPolygons || polygons).flatMap((poly) => renderRaysForPolygon(poly)),
          polygons.map((poly) => renderPolygon(poly)),
          renderOrientationClone(),
          React.createElement("circle", {
            cx: centerPt.x,
            cy: centerPt.y,
            r: 5,
            fill: WHITE,
            stroke: "none",
            opacity: dimOpacity,
          }),
          React.createElement(
            "text",
            {
              x: centerPt.x -20,
              y: centerPt.y -14,
              fill: WHITE,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "system-ui, sans-serif",
              opacity: dimOpacity,
            },
            "O",
          ),
        ),
      ),
    ),
    showSlider
      ? React.createElement(
          "div",
          {
            className:
              "dilation-k-slider-overlay" +
              (sliderEnabled ? "" : " slider-disabled"),
          },
          React.createElement(
            "div",
            { className: "dilation-k-slider-label" },
            APP_DATA.slider.label,
          ),
          React.createElement(
            "div",
            {
              className:
                "gp-slider-track-wrap horizontal dilation-k-track dilation-k-track-overlay",
            },
            React.createElement("div", {
              className:
                "gp-slider-track-bg horizontal gp-slider-track-active",
              style: { width: "100%" },
            }),
            React.createElement(
              "div",
              {
                className: "gp-slider-thumb horizontal",
                style: { left: kPct + "%" },
              },
              formatDilationThumbValue(dilationK),
            ),
            React.createElement("input", {
              type: "range",
              className: "gp-range-input",
              min: kMin,
              max: kMax,
              step: 0.01,
              value: dilationK,
              disabled: !sliderEnabled,
              onMouseDown: handleKPointerDown,
              onTouchStart: handleKPointerDown,
              onInput: handleKInput,
              onChange: handleKInput,
              onMouseUp: handleKPointerUp,
              onTouchEnd: handleKPointerUp,
            }),
          ),
        )
      : null,
    displayFeedbackHtml
      ? React.createElement("div", {
          className:
            "feedback-box feedback-box-top-left" +
            (feedbackVisible ? " feedback-box-visible" : ""),
          dangerouslySetInnerHTML: { __html: displayFeedbackHtml },
        })
      : null,
  );
};
