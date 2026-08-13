const ActivityGraph = ({
  points = [],
  rectangles = [],
  paths = [],
}) => {
  const { useMemo } = React;
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

  const toSvg = (gx, gy) => ({
    x: ORIGIN_X + gx * cfg.unit,
    y: ORIGIN_Y - gy * cfg.unit,
  });

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

  const renderPoint = (pt) => {
    const pos = toSvg(pt.x, pt.y);
    return React.createElement(
      "g",
      { key: pt.id, className: "activity-point" },
      React.createElement(
        "text",
        {
          x: pos.x + (pt.labelDx || 0),
          y: pos.y + (pt.labelDy || -18),
          fill: pt.labelColor || pt.color,
          fontSize: pt.labelFontSize || 20,
          fontWeight: "700",
          textAnchor: pt.labelAnchor || "middle",
          fontFamily: "system-ui, sans-serif",
        },
        pt.label,
      ),
      React.createElement("circle", {
        cx: pos.x,
        cy: pos.y,
        r: pt.radius || 8,
        fill: pt.color,
        stroke: pt.stroke || "#ffffff",
        strokeWidth: pt.strokeWidth == null ? 1.5 : pt.strokeWidth,
      }),
    );
  };

  const renderRect = (rect) => {
    const topLeft = toSvg(rect.x, rect.y + rect.height);
    return React.createElement(
      "g",
      {
        key: rect.id,
        className: rect.className || "",
      },
      React.createElement("rect", {
        x: topLeft.x,
        y: topLeft.y,
        width: rect.width * cfg.unit,
        height: rect.height * cfg.unit,
        fill: rect.fill,
        fillOpacity: rect.fillOpacity == null ? 1 : rect.fillOpacity,
        stroke: rect.stroke || "#ffffff",
        strokeOpacity: rect.strokeOpacity == null ? 1 : rect.strokeOpacity,
        strokeWidth: rect.strokeWidth == null ? 2 : rect.strokeWidth,
      }),
      rect.html
        ? React.createElement(
            "text",
            {
              x: topLeft.x + (rect.width * cfg.unit) / 2,
              y:
                topLeft.y +
                (rect.height * cfg.unit) / 2 -
                (rect.html.split("<br>").length - 1) * 10,
              fill: rect.textColor || "#ffffff",
              fillOpacity: rect.textOpacity == null ? 1 : rect.textOpacity,
              fontSize: rect.fontSize || 17,
              fontWeight: "600",
              textAnchor: "middle",
              fontFamily: "system-ui, sans-serif",
            },
            rect.html.split("<br>").map((line, index) =>
              React.createElement(
                "tspan",
                {
                  key: index,
                  x: topLeft.x + (rect.width * cfg.unit) / 2,
                  dy: index === 0 ? 0 : "1.2em",
                },
                line,
              ),
            ),
          )
        : null,
    );
  };

  const renderPath = (path) => {
    const from = toSvg(path.from.x, path.from.y);
    const to = toSvg(path.to.x, path.to.y);
    if (path.via) {
      const via = toSvg(path.via.x, path.via.y);
      return React.createElement("polyline", {
        key: path.id,
        points:
          from.x +
          "," +
          from.y +
          " " +
          via.x +
          "," +
          via.y +
          " " +
          to.x +
          "," +
          to.y,
        fill: "none",
        stroke: path.color,
        strokeWidth: path.strokeWidth || 2.5,
        strokeDasharray: path.dashed ? "5 5" : undefined,
      });
    }
    return React.createElement("line", {
      key: path.id,
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: path.color,
      strokeWidth: path.strokeWidth || 2.5,
      strokeDasharray: path.dashed ? "5 5" : undefined,
    });
  };

  return React.createElement(
    "div",
    { className: "activity-graph-panel" },
    React.createElement(
      "svg",
      {
        className: "activity-graph-svg",
        viewBox: "0 0 " + SVG_W + " " + SVG_H,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: "activity-arrow-end",
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
            id: "activity-arrow-start",
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
        markerStart: "url(#activity-arrow-start)",
        markerEnd: "url(#activity-arrow-end)",
      }),
      React.createElement("line", {
        x1: ORIGIN_X,
        y1: ORIGIN_Y + 14,
        x2: ORIGIN_X,
        y2: cfg.padTop - 4,
        stroke: AXIS_COLOR,
        strokeWidth: 2,
        markerStart: "url(#activity-arrow-start)",
        markerEnd: "url(#activity-arrow-end)",
      }),
      axisLabels,
      paths.map(renderPath),
      rectangles.map(renderRect),
      points.map(renderPoint),
    ),
  );
};
