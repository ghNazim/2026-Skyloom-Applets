const DilationGraph = (props) => {
  const { useMemo, useCallback, useRef, useEffect } = React;
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
  const thumbRef = useRef(null);
  const draggingRef = useRef(false);
  const dragListenersRef = useRef(null);
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

  const getValueTrackRect = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;
    return track.getBoundingClientRect();
  }, []);

  const valueFromClientX = useCallback(
    (clientX) => {
      const rect = getValueTrackRect();
      if (!rect || rect.width <= 0) return kCenter;
      const pct = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      return kMin + pct * (kMax - kMin);
    },
    [getValueTrackRect, kMin, kMax, kCenter],
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

  const isClientXOnActiveHalf = useCallback(
    (clientX) => {
      if (sliderMode === "both") return true;
      const rect = getValueTrackRect();
      if (!rect || rect.width <= 0) return true;
      const pct = (clientX - rect.left) / rect.width;
      const centerPctValue = (kCenter - kMin) / (kMax - kMin);
      if (sliderMode === "positive") return pct >= centerPctValue - 0.005;
      if (sliderMode === "negative") return pct <= centerPctValue + 0.005;
      return true;
    },
    [sliderMode, kMin, kMax, kCenter, getValueTrackRect],
  );

  const isNearCurrentThumb = useCallback(
    (clientX) => {
      const thumb = thumbRef.current;
      const rect = getValueTrackRect();
      if (!thumb || !rect || rect.width <= 0) return false;
      const thumbHalf =
        thumb.offsetWidth > 0 ? thumb.offsetWidth / 2 : 0;
      const thumbCenterX = rect.left + (kPct / 100) * rect.width;
      return Math.abs(clientX - thumbCenterX) <= thumbHalf + 2;
    },
    [kPct, getValueTrackRect],
  );

  const detachDocumentDragListeners = useCallback(() => {
    const listeners = dragListenersRef.current;
    if (!listeners) return;
    document.removeEventListener("pointermove", listeners.onMove);
    document.removeEventListener("pointerup", listeners.onUp);
    document.removeEventListener("pointercancel", listeners.onUp);
    dragListenersRef.current = null;
  }, []);

  const endDrag = useCallback(
    (e) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      detachDocumentDragListeners();
      const captureEl = thumbRef.current || trackRef.current;
      if (captureEl) {
        try {
          captureEl.releasePointerCapture(e.pointerId);
        } catch (err) {
          /* ignore */
        }
      }
      applySliderValue(valueFromClientX(e.clientX));
      const v = clampSliderK(
        valueFromClientX(e.clientX),
        kMin,
        kMax,
        sliderMode,
        kCenter,
      );
      if (typeof onKRelease === "function") onKRelease(v);
    },
    [
      detachDocumentDragListeners,
      applySliderValue,
      valueFromClientX,
      onKRelease,
      kMin,
      kMax,
      sliderMode,
      kCenter,
    ],
  );

  const attachDocumentDragListeners = useCallback(() => {
    detachDocumentDragListeners();
    const onMove = (e) => {
      if (!draggingRef.current || sliderLocked) return;
      applySliderValue(valueFromClientX(e.clientX));
    };
    const onUp = (e) => {
      endDrag(e);
    };
    dragListenersRef.current = { onMove, onUp };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  }, [
    detachDocumentDragListeners,
    sliderLocked,
    applySliderValue,
    valueFromClientX,
    endDrag,
  ]);

  const beginDrag = useCallback(
    (e) => {
      if (sliderLocked) return false;
      if (
        sliderMode !== "both" &&
        !isClientXOnActiveHalf(e.clientX) &&
        !isNearCurrentThumb(e.clientX)
      ) {
        return false;
      }
      e.preventDefault();
      draggingRef.current = true;
      const captureEl = thumbRef.current || trackRef.current;
      if (captureEl) captureEl.setPointerCapture(e.pointerId);
      attachDocumentDragListeners();
      if (typeof onKDragStart === "function") onKDragStart();
      return true;
    },
    [
      sliderLocked,
      sliderMode,
      isClientXOnActiveHalf,
      isNearCurrentThumb,
      onKDragStart,
      attachDocumentDragListeners,
    ],
  );

  const handleThumbPointerDown = useCallback(
    (e) => {
      if (sliderLocked) return;
      e.preventDefault();
      e.stopPropagation();
      draggingRef.current = true;
      if (thumbRef.current) thumbRef.current.setPointerCapture(e.pointerId);
      attachDocumentDragListeners();
      if (typeof onKDragStart === "function") onKDragStart();
    },
    [sliderLocked, onKDragStart, attachDocumentDragListeners],
  );

  const handleTrackPointerDown = useCallback(
    (e) => {
      if (e.target.closest(".gp-slider-thumb")) return;
      if (!beginDrag(e)) return;
      applySliderValue(valueFromClientX(e.clientX));
    },
    [beginDrag, applySliderValue, valueFromClientX],
  );

  useEffect(() => {
    if (sliderLocked) {
      draggingRef.current = false;
      detachDocumentDragListeners();
    }
  }, [sliderLocked, detachDocumentDragListeners]);

  useEffect(() => {
    return () => detachDocumentDragListeners();
  }, [detachDocumentDragListeners]);

  useEffect(() => {
    hasMovedRef.current = false;
    draggingRef.current = false;
  }, [sliderMode, kMin, kMax, showThumbValue]);

  useEffect(() => {
    const thumb = thumbRef.current;
    const outer = thumb && thumb.closest(".dilation-k-track-outer");
    if (!thumb || !outer) return undefined;

    const syncThumbHalf = () => {
      const half = thumb.offsetWidth / 2;
      if (half > 0) {
        outer.style.setProperty("--thumb-half", half + "px");
      }
    };

    syncThumbHalf();
    const observer = new ResizeObserver(syncThumbHalf);
    observer.observe(thumb);
    window.addEventListener("resize", syncThumbHalf);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncThumbHalf);
    };
  }, [smallThumb, showThumbValue, sliderHidden]);

  const thumbClass =
    "gp-slider-thumb horizontal" +
    (smallThumb ? " dilation-thumb-small" : "") +
    (showThumbValue ? " dilation-thumb-value" : "") +
    (sliderLocked ? " slider-thumb-locked" : "");

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
            {
              className: "dilation-scale-label",
              dangerouslySetInnerHTML: {
                __html: renderRichHtml(APP_DATA.slider.scaleFactor),
              },
            },
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
          className:
            "dilation-k-track-outer" + (sliderLocked ? " slider-locked" : ""),
        },
        React.createElement(
          "div",
          {
            className: "gp-slider-track-wrap horizontal dilation-k-track",
            ref: trackRef,
            onPointerDown: handleTrackPointerDown,
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
            {
              ref: thumbRef,
              className: thumbClass,
              style: { left: kPct + "%" },
              onPointerDown: handleThumbPointerDown,
            },
            showThumbValue ? formatDilationThumbValue(sliderK) : null,
          ),
          React.createElement(SliderDragNudge, {
            show: showDragNudge,
            fromPct: dragNudgeFromPct,
            toPct: dragNudgeToPct,
          }),
        ),
      ),
    ),
  );
};
