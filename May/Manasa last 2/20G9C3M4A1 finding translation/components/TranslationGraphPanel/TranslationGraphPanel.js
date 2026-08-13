const TranslationGraphPanel = ({ phase, onAnimationComplete }) => {
  const { useState, useEffect, useMemo } = React;
  const [progress, setProgress] = useState(phase === "done" ? 1 : 0);
  const completedRef = React.useRef(false);

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
  const colors = APP_DATA.colors;

  const start = { x: 2, y: 3 };
  const turn = { x: 7, y: 3 };
  const end = { x: 7, y: 1 };
  const totalUnits = 7;

  const toSvg = (gx, gy) => ({
    x: ORIGIN_X + gx * cfg.unit,
    y: ORIGIN_Y - gy * cfg.unit,
  });

  useEffect(() => {
    if (phase === "ready") {
      completedRef.current = false;
      setProgress(0);
      return undefined;
    }

    if (phase === "done") {
      setProgress(1);
      return undefined;
    }

    if (phase !== "animating") return undefined;

    completedRef.current = false;
    const duration = 4400;
    const startTime = performance.now();
    let rafId = null;

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        setProgress(1);
        if (typeof onAnimationComplete === "function") {
          onAnimationComplete();
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [phase, onAnimationComplete]);

  const gridLines = useMemo(() => {
    const els = [];
    const gridRight = cfg.padLeft + GRID_W;
    const gridBottom = cfg.padTop + GRID_H;

    for (let c = 0; c <= cfg.cols; c++) {
      const x = cfg.padLeft + c * cfg.unit;
      els.push(
        React.createElement("line", {
          key: "vc-" + c,
          x1: x,
          y1: cfg.padTop,
          x2: x,
          y2: gridBottom,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    for (let r = 0; r <= cfg.rows; r++) {
      const y = cfg.padTop + r * cfg.unit;
      els.push(
        React.createElement("line", {
          key: "hr-" + r,
          x1: cfg.padLeft,
          y1: y,
          x2: gridRight,
          y2: y,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
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
      els.push(
        React.createElement(
          "text",
          {
            key: "xl-" + i,
            x: ORIGIN_X + i * cfg.unit,
            y: ORIGIN_Y + 28,
            fill: AXIS_COLOR,
            fontSize: 18,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }
    for (let i = 1; i <= 7; i++) {
      els.push(
        React.createElement(
          "text",
          {
            key: "yl-" + i,
            x: ORIGIN_X - 24,
            y: ORIGIN_Y - i * cfg.unit + 6,
            fill: AXIS_COLOR,
            fontSize: 18,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }

    els.push(
      React.createElement("text", { key: "origin-o", x: ORIGIN_X - 20, y: ORIGIN_Y + 24, ...axisProps }, "O"),
      React.createElement("text", { key: "axis-x", x: gridRight + 14, y: ORIGIN_Y + 6, ...axisProps }, "x"),
      React.createElement("text", { key: "axis-y", x: ORIGIN_X - 4, y: cfg.padTop - 8, ...axisProps }, "y"),
    );
    return els;
  }, [GRID_W]);

  const traveled = progress * totalUnits;
  const horizontalUnits = Math.min(5, traveled);
  const verticalUnits = Math.max(0, traveled - 5);
  const livePoint =
    traveled <= 5
      ? { x: start.x + horizontalUnits, y: start.y }
      : { x: turn.x, y: turn.y - verticalUnits };

  const startSvg = toSvg(start.x, start.y);
  const turnSvg = toSvg(turn.x, turn.y);
  const endSvg = toSvg(end.x, end.y);
  const liveSvg = toSvg(livePoint.x, livePoint.y);
  const horizontalEndSvg = toSvg(start.x + horizontalUnits, start.y);

  const positiveCount = Math.min(5, Math.floor(horizontalUnits + 0.04));
  const negativeCount = Math.min(2, Math.floor(verticalUnits + 0.04));
  const showPath = progress > 0;
  const atEnd = phase === "done" || progress >= 1;
  const showLivePoint = showPath && !atEnd;
  const showImagePoint = atEnd;

  return React.createElement(
    "div",
    { className: "translation-graph-panel" },
    React.createElement(
      "svg",
      {
        className: "translation-graph-svg",
        viewBox: "0 0 " + SVG_W + " " + SVG_H,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: "translation-arrow-end",
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
            id: "translation-arrow-start",
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
        markerStart: "url(#translation-arrow-start)",
        markerEnd: "url(#translation-arrow-end)",
      }),
      React.createElement("line", {
        x1: ORIGIN_X,
        y1: ORIGIN_Y + 14,
        x2: ORIGIN_X,
        y2: cfg.padTop - 4,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#translation-arrow-start)",
        markerEnd: "url(#translation-arrow-end)",
      }),
      axisLabels,
      React.createElement(
        "text",
        {
          x: startSvg.x - 8,
          y: startSvg.y - 16,
          fill: colors.object,
          fontSize: 22,
          fontWeight: "700",
          textAnchor: "end",
          fontFamily: "system-ui, sans-serif",
        },
        APP_DATA.graph.objectPointLabel,
      ),
      React.createElement("circle", {
        cx: startSvg.x,
        cy: startSvg.y,
        r: 9,
        fill: colors.object,
        stroke: "#ffffff",
        strokeWidth: 1.5,
      }),
      showPath
        ? React.createElement("line", {
            x1: startSvg.x,
            y1: startSvg.y,
            x2: horizontalEndSvg.x,
            y2: horizontalEndSvg.y,
            stroke: colors.transformation,
            strokeWidth: 2.6,
            strokeDasharray: "5 5",
          })
        : null,
      showPath && verticalUnits > 0
        ? React.createElement("line", {
            x1: turnSvg.x,
            y1: turnSvg.y,
            x2: liveSvg.x,
            y2: liveSvg.y,
            stroke: colors.transformation,
            strokeWidth: 2.6,
            strokeDasharray: "5 5",
          })
        : null,
      APP_DATA.graph.positiveSteps.slice(0, positiveCount).map((label, index) => {
        const pos = toSvg(start.x + index + 1, start.y);
        return React.createElement(
          "text",
          {
            key: "plus-" + index,
            x: pos.x - cfg.unit / 2,
            y: pos.y - 20,
            fill: colors.transformation,
            fontSize: 16,
            fontWeight: "700",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          label,
        );
      }),
      APP_DATA.graph.negativeSteps.slice(0, negativeCount).map((label, index) => {
        const pos = toSvg(turn.x, turn.y - index - 0.5);
        return React.createElement(
          "text",
          {
            key: "minus-" + index,
            x: pos.x + 20,
            y: pos.y,
            fill: colors.transformation,
            fontSize: 16,
            fontWeight: "700",
            textAnchor: "start",
            dominantBaseline: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          label,
        );
      }),
      showLivePoint
        ? React.createElement("circle", {
            cx: liveSvg.x,
            cy: liveSvg.y,
            r: 8,
            fill: colors.image,
            stroke: "#ffffff",
            strokeWidth: 1.4,
          })
        : null,
      showImagePoint
        ? React.createElement(
            "g",
            null,
            React.createElement(
              "text",
              {
                x: endSvg.x + 6,
                y: endSvg.y + 29,
                fill: colors.image,
                fontSize: 22,
                fontWeight: "700",
                textAnchor: "middle",
                fontFamily: "system-ui, sans-serif",
              },
              APP_DATA.graph.imagePointLabel,
            ),
            React.createElement("circle", {
              cx: endSvg.x,
              cy: endSvg.y,
              r: 9,
              fill: colors.image,
              stroke: "#ffffff",
              strokeWidth: 1.5,
            }),
          )
        : null,
    ),
  );
};
