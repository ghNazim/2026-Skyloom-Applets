const DilationGraph = (props) => {
  const { useMemo, useCallback, useRef, useEffect, useState } = React;
  const {
    center,
    triangle,
    sliderK = 1,
    visualK = 1,
    kMin = 0.4,
    kMax = 1.6,
    kCenter = 1,
    sliderMode = "both",
    sliderLocked = false,
    sliderHidden = false,
    showThumbValue = false,
    smallThumb = false,
    showCenterMarker = false,
    showGhostTriangle = false,
    showZoomLabels = true,
    zoomOutDimmed = false,
    zoomInDimmed = false,
    scaleFactorLabel = false,
    showClickPoints = false,
    pointStates = {},
    showDragNudge = false,
    dragNudgeFromPct = null,
    dragNudgeToPct = null,
    onPointClick,
    onKChange,
    onKRelease,
    onKDragStart,
  } = props;

  const svgRef = useRef(null);
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const hasMovedRef = useRef(false);

  const ORANGE = "#e67e22";
  const WHITE = "#ffffff";
  const GREEN = "#2ecc71";
  const YELLOW = "#f1c40f";
  const RED = "#e53935";

  const PAD = 24;
  const UNIT = 38;
  const PLOT_W = DILATION_GRID_COLS * UNIT;
  const PLOT_H = DILATION_GRID_ROWS * UNIT;
  const SVG_W = PAD * 2 + PLOT_W;
  const SVG_H = PAD * 2 + PLOT_H + 8;

  const toSvg = useCallback(
    (mx, my) => ({
      x: PAD + mx * UNIT,
      y: PAD + (DILATION_GRID_ROWS - my) * UNIT,
    }),
    [PAD, UNIT],
  );

  const dilatedTriangle = useMemo(
    () => triangle.map((p) => dilatePoint(p, center, visualK)),
    [triangle, center, visualK],
  );

  const centerPt = toSvg(center.x, center.y);
  const triSvg = triangle.map((p) => toSvg(p.x, p.y));
  const dilSvg = dilatedTriangle.map((p) => toSvg(p.x, p.y));

  const pointsToPath = (pts) =>
    "M " +
    pts.map((p, i) => (i === 0 ? "" : "L ") + p.x + "," + p.y).join(" ") +
    " Z";

  const triPath = pointsToPath(triSvg);
  const dilPath = pointsToPath(dilSvg);

  const kPct = pctFromK(sliderK, kMin, kMax);
  const centerPct = pctFromK(kCenter, kMin, kMax);

  const renderTrackSegments = () => {
    const mid = centerPct;
    if (sliderMode === "positive") {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className:
            "gp-slider-track-bg horizontal gp-slider-track-inactive gp-track-seg-left",
          style: { left: 0, width: mid + "%" },
        }),
        React.createElement("div", {
          className:
            "gp-slider-track-bg horizontal gp-slider-track-active gp-track-seg-right",
          style: { left: mid + "%", width: 100 - mid + "%" },
        }),
      );
    }
    if (sliderMode === "negative") {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className:
            "gp-slider-track-bg horizontal gp-slider-track-active gp-track-seg-left",
          style: { left: 0, width: mid + "%" },
        }),
        React.createElement("div", {
          className:
            "gp-slider-track-bg horizontal gp-slider-track-inactive gp-track-seg-right",
          style: { left: mid + "%", width: 100 - mid + "%" },
        }),
      );
    }
    return React.createElement("div", {
      className: "gp-slider-track-bg horizontal gp-slider-track-active",
      style: { width: "100%" },
    });
  };

  const handleKInput = (e) => {
    if (sliderLocked) return;
    hasMovedRef.current = true;
    let v = clampSliderK(e.target.value, kMin, kMax, sliderMode, kCenter);
    if (typeof onKChange === "function") onKChange(v);
  };

  const handleKPointerDown = () => {
    if (sliderLocked) return;
    if (typeof onKDragStart === "function") onKDragStart();
  };

  const handleKPointerUp = (e) => {
    if (sliderLocked) return;
    let v = clampSliderK(e.target.value, kMin, kMax, sliderMode, kCenter);
    if (typeof onKRelease === "function") onKRelease(v);
  };

  const valueFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return kCenter;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return kMin + pct * (kMax - kMin);
    },
    [kMin, kMax, kCenter],
  );

  const applySliderValue = useCallback(
    (rawVal) => {
      hasMovedRef.current = true;
      const v = clampSliderK(rawVal, kMin, kMax, sliderMode, kCenter);
      if (typeof onKChange === "function") onKChange(v);
      return v;
    },
    [kMin, kMax, sliderMode, kCenter, onKChange],
  );

  const handleTrackPointerDown = (e) => {
    if (sliderLocked) return;
    e.preventDefault();
    draggingRef.current = true;
    trackRef.current.setPointerCapture(e.pointerId);
    if (typeof onKDragStart === "function") onKDragStart();
    applySliderValue(valueFromClientX(e.clientX));
  };

  const handleTrackPointerMove = (e) => {
    if (!draggingRef.current || sliderLocked) return;
    applySliderValue(valueFromClientX(e.clientX));
  };

  const handleTrackPointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (trackRef.current) {
      try {
        trackRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
    }
    const v = applySliderValue(valueFromClientX(e.clientX));
    if (typeof onKRelease === "function") onKRelease(v);
  };

  const getPointFill = (id) => {
    const st = pointStates[id];
    if (st === "wrong") return RED;
    if (st === "correct") return GREEN;
    return YELLOW;
  };

  const renderClickPoints = () => {
    if (!showClickPoints) return null;
    const els = [];

    triSvg.forEach((p, i) => {
      els.push(
        React.createElement("circle", {
          key: "orig-" + i,
          cx: p.x,
          cy: p.y,
          r: 8,
          fill: getPointFill("orig-" + i),
          stroke: WHITE,
          strokeWidth: 2,
          className: "dilation-click-point",
          onClick: () =>
            typeof onPointClick === "function" && onPointClick("orig-" + i),
        }),
      );
    });

    dilSvg.forEach((p, i) => {
      els.push(
        React.createElement("circle", {
          key: "dil-" + i,
          cx: p.x,
          cy: p.y,
          r: 8,
          fill: getPointFill("dil-" + i),
          stroke: WHITE,
          strokeWidth: 2,
          className: "dilation-click-point",
          onClick: () =>
            typeof onPointClick === "function" && onPointClick("dil-" + i),
        }),
      );
    });

    els.push(
      React.createElement("circle", {
        key: "center",
        cx: centerPt.x,
        cy: centerPt.y,
        r: 9,
        fill: getPointFill("center"),
        stroke: WHITE,
        strokeWidth: 2,
        className: "dilation-click-point",
        onClick: () =>
          typeof onPointClick === "function" && onPointClick("center"),
      }),
    );

    return els;
  };

  useEffect(() => {
    hasMovedRef.current = false;
  }, [sliderMode, kMin, kMax, showThumbValue]);

  const thumbClass =
    "gp-slider-thumb horizontal" +
    (smallThumb ? " dilation-thumb-small" : "") +
    (showThumbValue ? " dilation-thumb-value" : "");

  return React.createElement(
    "div",
    { className: "dilation-graph-panel" },
    React.createElement(
      "div",
      { className: "dilation-graph-row" },
      React.createElement(
        "div",
        { className: "dilation-svg-wrap" },
        React.createElement(
          "svg",
          {
            ref: svgRef,
            viewBox: "0 0 " + SVG_W + " " + SVG_H,
            className: "dilation-coordinate-svg",
            preserveAspectRatio: "xMidYMid meet",
          },
          React.createElement("path", {
            d: dilPath,
            fill: ORANGE,
            stroke: WHITE,
            strokeWidth: 2.5,
          }),
          showGhostTriangle && Math.abs(visualK - 1) > 0.02
            ? React.createElement("path", {
                d: triPath,
                fill: "none",
                stroke: WHITE,
                strokeWidth: 2,
                strokeDasharray: "8 6",
                opacity: 0.85,
              })
            : null,
          !showClickPoints
            ? React.createElement("circle", {
                cx: centerPt.x,
                cy: centerPt.y,
                r: 7,
                fill: GREEN,
                stroke: WHITE,
                strokeWidth: 2,
                className: "dilation-center",
              })
            : null,
          renderClickPoints(),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className:
          "dilation-k-slider-wrap" + (sliderHidden ? " slider-hidden" : ""),
      },
      scaleFactorLabel
        ? React.createElement(
            "div",
            { className: "dilation-scale-label" },
            APP_DATA.slider.scaleFactor,
          )
        : null,
      showZoomLabels
        ? React.createElement(
            "div",
            { className: "dilation-zoom-labels" },
            React.createElement(
              "span",
              {
                className:
                  "dilation-zoom-label left" +
                  (zoomOutDimmed ? " dimmed" : ""),
              },
              APP_DATA.slider.zoomOut,
            ),
            React.createElement(
              "span",
              {
                className:
                  "dilation-zoom-label right" + (zoomInDimmed ? " dimmed" : ""),
              },
              APP_DATA.slider.zoomIn,
            ),
          )
        : null,
      React.createElement(
        "div",
        {
          className: "gp-slider-track-wrap horizontal dilation-k-track",
          ref: trackRef,
          onPointerDown: handleTrackPointerDown,
          onPointerMove: handleTrackPointerMove,
          onPointerUp: handleTrackPointerUp,
          onPointerCancel: handleTrackPointerUp,
        },
        renderTrackSegments(),
        showCenterMarker && Math.abs(sliderK - kCenter) > 0.02
          ? React.createElement("div", {
              className: "dilation-center-marker",
              style: { left: centerPct + "%" },
            })
          : null,
        React.createElement(
          "div",
          { className: thumbClass, style: { left: kPct + "%" } },
          showThumbValue ? formatDilationThumbValue(sliderK) : null,
        ),
        React.createElement(SliderDragNudge, {
          show: showDragNudge,
          fromPct: dragNudgeFromPct,
          toPct: dragNudgeToPct,
        }),
        React.createElement("input", {
          type: "range",
          className: "gp-range-input",
          min: kMin,
          max: kMax,
          step: 0.01,
          value: sliderK,
          disabled: sliderLocked,
          tabIndex: -1,
          "aria-hidden": "true",
          onMouseDown: handleKPointerDown,
          onTouchStart: handleKPointerDown,
          onInput: handleKInput,
          onChange: handleKInput,
          onMouseUp: handleKPointerUp,
          onTouchEnd: handleKPointerUp,
        }),
      ),
    ),
  );
};
