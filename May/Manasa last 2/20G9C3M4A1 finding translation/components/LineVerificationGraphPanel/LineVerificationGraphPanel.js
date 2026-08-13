const LineVerificationGraphPanel = ({ onComplete }) => {
  const { useState, useEffect, useMemo, useRef } = React;
  const [progress, setProgress] = useState(0);
  const completeRef = useRef(false);
  const data = APP_DATA.verification;
  const colors = APP_DATA.colors;

  const cfg = {
    cols: 13,
    rows: 9,
    unit: 44,
    padLeft: 40,
    padRight: 40,
    padTop: 28,
    padBottom: 32,
  };

  const GRID_W = cfg.cols * cfg.unit;
  const GRID_H = cfg.rows * cfg.unit;
  const SVG_W = cfg.padLeft + GRID_W + cfg.padRight;
  const SVG_H = cfg.padTop + GRID_H + cfg.padBottom;
  const ORIGIN_X = cfg.padLeft + cfg.unit;
  const ORIGIN_Y = cfg.padTop + (cfg.rows - 1) * cfg.unit;
  const GRID_COLOR = "#3a6d8c";
  const AXIS_COLOR = "#ffffff";

  const M = { x: 2, y: 1 };
  const N = { x: 4, y: 5 };
  const MP = { x: 8, y: 3 };
  const NP = { x: 10, y: 7 };

  const toSvg = (gx, gy) => ({
    x: ORIGIN_X + gx * cfg.unit,
    y: ORIGIN_Y - gy * cfg.unit,
  });

  useEffect(() => {
    completeRef.current = false;
    setProgress(0);
    const duration = 6200;
    const startTime = performance.now();
    let rafId = null;
    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      setProgress(t);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else if (!completeRef.current) {
        completeRef.current = true;
        if (typeof onComplete === "function") onComplete();
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  const gridLines = useMemo(() => {
    const els = [];
    const gridRight = cfg.padLeft + GRID_W;
    const gridBottom = cfg.padTop + GRID_H;
    for (let c = 0; c <= cfg.cols; c++) {
      const x = cfg.padLeft + c * cfg.unit;
      els.push(React.createElement("line", {
        key: "vc-" + c,
        x1: x,
        y1: cfg.padTop,
        x2: x,
        y2: gridBottom,
        stroke: GRID_COLOR,
        strokeWidth: 1,
      }));
    }
    for (let r = 0; r <= cfg.rows; r++) {
      const y = cfg.padTop + r * cfg.unit;
      els.push(React.createElement("line", {
        key: "hr-" + r,
        x1: cfg.padLeft,
        y1: y,
        x2: gridRight,
        y2: y,
        stroke: GRID_COLOR,
        strokeWidth: 1,
      }));
    }
    return els;
  }, [GRID_W, GRID_H]);

  const axisLabels = useMemo(() => {
    const els = [];
    const gridRight = cfg.padLeft + GRID_W;
    const axisProps = {
      fill: AXIS_COLOR,
      fontSize: 18,
      fontWeight: "700",
      textAnchor: "middle",
      fontFamily: '"Times New Roman", Times, serif',
      fontStyle: "italic",
    };
    for (let i = 1; i <= 11; i++) {
      els.push(React.createElement("text", {
        key: "xl-" + i,
        x: ORIGIN_X + i * cfg.unit,
        y: ORIGIN_Y + 28,
        fill: AXIS_COLOR,
        fontSize: 18,
        fontWeight: "600",
        textAnchor: "middle",
        fontFamily: "system-ui, sans-serif",
      }, String(i)));
    }
    for (let i = 1; i <= 7; i++) {
      els.push(React.createElement("text", {
        key: "yl-" + i,
        x: ORIGIN_X - 24,
        y: ORIGIN_Y - i * cfg.unit + 6,
        fill: AXIS_COLOR,
        fontSize: 18,
        fontWeight: "600",
        textAnchor: "middle",
        fontFamily: "system-ui, sans-serif",
      }, String(i)));
    }
    els.push(
      React.createElement("text", { key: "origin-o", x: ORIGIN_X - 20, y: ORIGIN_Y + 24, ...axisProps }, "O"),
      React.createElement("text", { key: "axis-x", x: gridRight + 14, y: ORIGIN_Y + 6, ...axisProps }, "x"),
      React.createElement("text", { key: "axis-y", x: ORIGIN_X - 4, y: cfg.padTop - 8, ...axisProps }, "y"),
    );
    return els;
  }, [GRID_W]);

  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const segmentProgress = (start, end) => clamp01((progress - start) / (end - start));
  const mProgress = segmentProgress(0.14, 0.46);
  const nProgress = segmentProgress(0.52, 0.84);
  const showMPrime = progress >= 0.46;
  const showNPrime = progress >= 0.84;
  const showImageLine = progress >= 0.92;

  const liveTranslatedPoint = (pt, p) => {
    const total = 8;
    const traveled = p * total;
    const h = Math.min(6, traveled);
    const v = Math.max(0, traveled - 6);
    return traveled <= 6
      ? { x: pt.x + h, y: pt.y }
      : { x: pt.x + 6, y: pt.y + v };
  };

  const renderPoint = (pt, label, color, options = {}) => {
    const pos = toSvg(pt.x, pt.y);
    return React.createElement(
      "g",
      { key: label },
      React.createElement("text", {
        x: pos.x + (options.labelDx || 0),
        y: pos.y + (options.labelDy || -18),
        fill: color,
        fontSize: 18,
        fontWeight: "700",
        textAnchor: options.anchor || "middle",
        fontFamily: "system-ui, sans-serif",
      }, label),
      React.createElement("circle", {
        cx: pos.x,
        cy: pos.y,
        r: 8,
        fill: color,
        stroke: "#ffffff",
        strokeWidth: 1.5,
      }),
    );
  };

  const renderLine = (fromPt, toPt, color, key, dashed) => {
    const from = toSvg(fromPt.x, fromPt.y);
    const to = toSvg(toPt.x, toPt.y);
    return React.createElement("line", {
      key: key,
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: color,
      strokeWidth: 2.8,
      strokeDasharray: dashed ? "5 5" : undefined,
    });
  };

  const renderTranslationPath = (pt, p, keyPrefix) => {
    if (p <= 0) return null;
    const h = Math.min(6, p * 8);
    const v = Math.max(0, p * 8 - 6);
    const start = toSvg(pt.x, pt.y);
    const hEnd = toSvg(pt.x + h, pt.y);
    const turn = toSvg(pt.x + 6, pt.y);
    const live = toSvg(pt.x + 6, pt.y + v);
    const shownH = Math.min(6, Math.floor(h + 0.05));
    const shownV = Math.min(2, Math.floor(v + 0.05));
    const livePt = liveTranslatedPoint(pt, p);
    const liveSvg = toSvg(livePt.x, livePt.y);

    return React.createElement(
      "g",
      { key: keyPrefix },
      React.createElement("line", {
        x1: start.x,
        y1: start.y,
        x2: hEnd.x,
        y2: hEnd.y,
        stroke: colors.transformation,
        strokeWidth: 2.5,
        strokeDasharray: "5 5",
      }),
      v > 0
        ? React.createElement("line", {
            x1: turn.x,
            y1: turn.y,
            x2: live.x,
            y2: live.y,
            stroke: colors.transformation,
            strokeWidth: 2.5,
            strokeDasharray: "5 5",
          })
        : null,
      data.positiveSteps.slice(0, shownH).map((label, index) => {
        const pos = toSvg(pt.x + index + 1, pt.y);
        return React.createElement("text", {
          key: keyPrefix + "-h-" + index,
          x: pos.x - cfg.unit / 2,
          y: pos.y - 14,
          fill: colors.transformation,
          fontSize: 14,
          fontWeight: "700",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        }, label);
      }),
      data.upwardSteps.slice(0, shownV).map((label, index) => {
        const pos = toSvg(pt.x + 6, pt.y + index + 0.5);
        return React.createElement("text", {
          key: keyPrefix + "-v-" + index,
          x: pos.x + 16,
          y: pos.y,
          fill: colors.transformation,
          fontSize: 14,
          fontWeight: "700",
          dominantBaseline: "middle",
          fontFamily: "system-ui, sans-serif",
        }, label);
      }),
      !((keyPrefix === "m" && showMPrime) || (keyPrefix === "n" && showNPrime))
        ? React.createElement("circle", {
            cx: liveSvg.x,
            cy: liveSvg.y,
            r: 7,
            fill: colors.image,
            stroke: "#ffffff",
            strokeWidth: 1.4,
          })
        : null,
    );
  };

  return React.createElement(
    "div",
    { className: "line-verification-graph-panel" },
    React.createElement(
      "svg",
      {
        className: "line-verification-graph-svg",
        viewBox: "0 0 " + SVG_W + " " + SVG_H,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: "line-verify-arrow-end",
            markerWidth: 8,
            markerHeight: 8,
            refX: 6,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", { d: "M0,0 L6,3 L0,6 z", fill: AXIS_COLOR }),
        ),
        React.createElement(
          "marker",
          {
            id: "line-verify-arrow-start",
            markerWidth: 8,
            markerHeight: 8,
            refX: 0,
            refY: 3,
            orient: "auto-start-reverse",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", { d: "M0,0 L6,3 L0,6 z", fill: AXIS_COLOR }),
        ),
      ),
      gridLines,
      React.createElement("line", {
        x1: ORIGIN_X - 14,
        y1: ORIGIN_Y,
        x2: cfg.padLeft + GRID_W + 6,
        y2: ORIGIN_Y,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#line-verify-arrow-start)",
        markerEnd: "url(#line-verify-arrow-end)",
      }),
      React.createElement("line", {
        x1: ORIGIN_X,
        y1: ORIGIN_Y + 14,
        x2: ORIGIN_X,
        y2: cfg.padTop - 4,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#line-verify-arrow-start)",
        markerEnd: "url(#line-verify-arrow-end)",
      }),
      axisLabels,
      renderLine(M, N, colors.object, "mn"),
      renderTranslationPath(M, mProgress, "m"),
      showMPrime
        ? renderPoint(MP, data.mPrimeLabel, colors.image, {
            labelDx: -18,
            labelDy: -18,
            anchor: "end",
          })
        : null,
      renderTranslationPath(N, nProgress, "n"),
      showNPrime ? renderPoint(NP, data.nPrimeLabel, colors.image, { labelDy: -20 }) : null,
      showImageLine ? renderLine(MP, NP, colors.image, "mnp") : null,
      renderPoint(M, data.mLabel, colors.object, { labelDx: -18, labelDy: -18, anchor: "end" }),
      renderPoint(N, data.nLabel, colors.object, { labelDy: -18 }),
    ),
  );
};
