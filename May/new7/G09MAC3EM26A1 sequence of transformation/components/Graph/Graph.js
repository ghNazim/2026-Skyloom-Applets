function graphPolygonPoints(vertices, toSvg) {
  return vertices
    .map(function (vertex) {
      const point = toSvg(vertex);
      return point.x + "," + point.y;
    })
    .join(" ");
}

function extendRayToGridEdge(origin, through, xMin, xMax, yMin, yMax) {
  const dx = through.x - origin.x;
  const dy = through.y - origin.y;
  if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
    return null;
  }

  const candidates = [];
  if (Math.abs(dx) > 0.0001) {
    [xMin, xMax].forEach(function (x) {
      const t = (x - origin.x) / dx;
      if (t > 0.001) {
        const y = origin.y + t * dy;
        if (y >= yMin && y <= yMax) {
          candidates.push({ x: x, y: y, t: t });
        }
      }
    });
  }
  if (Math.abs(dy) > 0.0001) {
    [yMin, yMax].forEach(function (y) {
      const t = (y - origin.y) / dy;
      if (t > 0.001) {
        const x = origin.x + t * dx;
        if (x >= xMin && x <= xMax) {
          candidates.push({ x: x, y: y, t: t });
        }
      }
    });
  }

  if (!candidates.length) return through;
  candidates.sort(function (a, b) {
    return b.t - a.t;
  });
  return { x: candidates[0].x, y: candidates[0].y };
}

const Graph = ({
  objectVertices,
  imageVertices,
  cloneVertices,
  clone2Vertices,
  cloneIsCorrect,
  clone2IsCorrect,
  cloneIsWrong,
  imageIsCorrect,
  graphConfig,
  dilationAnchor,
  dilationLines,
  vertexPickers,
  onVertexPick,
}) => {
  const labels = APP_DATA.labels;
  const config = graphConfig || APP_DATA.graph;
  const xMin = config.xMin;
  const xMax = config.xMax;
  const yMin = config.yMin;
  const yMax = config.yMax;
  const unit = 22;
  const padLeft = 44;
  const padRight = 28;
  const padTop = 22;
  const padBottom = 30;
  const gridWidth = (xMax - xMin) * unit;
  const gridHeight = (yMax - yMin) * unit;
  const svgWidth = padLeft + gridWidth + padRight;
  const svgHeight = padTop + gridHeight + padBottom;
  const originX = padLeft + (0 - xMin) * unit;
  const originY = padTop + (yMax - 0) * unit;

  const toSvg = function (point) {
    return {
      x: padLeft + (point.x - xMin) * unit,
      y: padTop + (yMax - point.y) * unit,
    };
  };

  const gridLines = [];
  for (let x = xMin; x <= xMax; x++) {
    const pos = toSvg({ x: x, y: 0 }).x;
    gridLines.push(
      React.createElement("line", {
        key: "vx-" + x,
        x1: pos,
        y1: padTop,
        x2: pos,
        y2: padTop + gridHeight,
        className: "graph-grid-line",
      }),
    );
  }
  for (let y = yMin; y <= yMax; y++) {
    const pos = toSvg({ x: 0, y: y }).y;
    gridLines.push(
      React.createElement("line", {
        key: "hy-" + y,
        x1: padLeft,
        y1: pos,
        x2: padLeft + gridWidth,
        y2: pos,
        className: "graph-grid-line",
      }),
    );
  }


  const renderPolygon = function (className, vertices, key) {
    if (!vertices) return null;
    return React.createElement("polygon", {
      key: key,
      className: className,
      points: graphPolygonPoints(vertices, toSvg),
    });
  };

  const objectMinX = Math.min.apply(
    null,
    objectVertices.map(function (point) {
      return point.x;
    }),
  );
  const objectMinY = Math.min.apply(
    null,
    objectVertices.map(function (point) {
      return point.y;
    }),
  );
  const imageMinX = Math.min.apply(
    null,
    imageVertices.map(function (point) {
      return point.x;
    }),
  );
  const imageMinY = Math.min.apply(
    null,
    imageVertices.map(function (point) {
      return point.y;
    }),
  );

  const dilationLineElements =
    dilationAnchor && dilationLines
      ? dilationLines
          .map(function (vertex, index) {
            const end = extendRayToGridEdge(
              dilationAnchor,
              vertex,
              xMin,
              xMax,
              yMin,
              yMax,
            );
            if (!end) return null;
            const start = toSvg(dilationAnchor);
            const endSvg = toSvg(end);
            return React.createElement("line", {
              key: "dilation-line-" + index,
              x1: start.x,
              y1: start.y,
              x2: endSvg.x,
              y2: endSvg.y,
              className: "dilation-guide-line",
            });
          })
          .filter(Boolean)
      : null;

  const anchorSvg = dilationAnchor ? toSvg(dilationAnchor) : null;

  const vertexPickerElements =
    vertexPickers && vertexPickers.length
      ? vertexPickers.map(function (vertex, index) {
          const pos = toSvg(vertex);
          return React.createElement(
            "g",
            {
              key: "vertex-picker-" + index,
              className: "vertex-picker-group",
              onClick: function () {
                if (onVertexPick) onVertexPick(vertex, index);
              },
            },
            React.createElement("circle", {
              className: "vertex-picker-hit",
              cx: pos.x,
              cy: pos.y,
              r: 18,
            }),
            React.createElement("circle", {
              className: "vertex-picker",
              cx: pos.x,
              cy: pos.y,
              r: 12,
            }),
          );
        })
      : null;

  return React.createElement(
    "div",
    { className: "series-graph-panel" },
    React.createElement(
      "svg",
      {
        className: "series-graph-svg",
        viewBox: "0 0 " + svgWidth + " " + svgHeight,
        role: "img",
        "aria-label": "Coordinate graph with object and image figures",
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: "axis-arrow-end",
            markerWidth: 8,
            markerHeight: 8,
            refX: 6,
            refY: 3,
            orient: "auto",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            className: "graph-axis-arrow",
          }),
        ),
        React.createElement(
          "marker",
          {
            id: "axis-arrow-start",
            markerWidth: 8,
            markerHeight: 8,
            refX: 0,
            refY: 3,
            orient: "auto-start-reverse",
            markerUnits: "strokeWidth",
          },
          React.createElement("path", {
            d: "M0,0 L6,3 L0,6 z",
            className: "graph-axis-arrow",
          }),
        ),
      ),
      gridLines,
      React.createElement("line", {
        x1: padLeft + 10,
        y1: originY,
        x2: padLeft + gridWidth,
        y2: originY,
        className: "graph-axis-line",
        markerStart: "url(#axis-arrow-start)",
        markerEnd: "url(#axis-arrow-end)",
      }),
      React.createElement("line", {
        x1: originX,
        y1: padTop + 10,
        x2: originX,
        y2: padTop + gridHeight,
        className: "graph-axis-line",
        markerStart: "url(#axis-arrow-start)",
        markerEnd: "url(#axis-arrow-end)",
      }),
      React.createElement(
        "text",
        { x: originX - 14, y: originY + 18, className: "graph-origin-label" },
        labels.origin,
      ),
      React.createElement(
        "text",
        {
          x: padLeft + gridWidth + 14,
          y: originY + 5,
          className: "graph-axis-name",
        },
        labels.axisX,
      ),
      React.createElement(
        "text",
        { x: padLeft - 20, y: originY + 5, className: "graph-axis-name" },
        labels.axisXPrime,
      ),
      React.createElement(
        "text",
        { x: originX, y: padTop - 10, className: "graph-axis-name" },
        labels.axisY,
      ),
      React.createElement(
        "text",
        {
          x: originX,
          y: padTop + gridHeight + 18,
          className: "graph-axis-name",
        },
        labels.axisYPrime,
      ),
      dilationLineElements,
      renderPolygon(
        "image-triangle" + (imageIsCorrect ? " is-correct" : ""),
        imageVertices,
        "image",
      ),
      renderPolygon("object-triangle", objectVertices, "object"),
      renderPolygon(
        "clone-triangle clone-triangle-2" +
          (clone2IsCorrect ? " is-correct" : ""),
        clone2Vertices,
        "clone2",
      ),
      renderPolygon(
        "clone-triangle" +
          (cloneIsCorrect ? " is-correct" : "") +
          (cloneIsWrong ? " is-wrong" : ""),
        cloneVertices,
        "clone",
      ),
      anchorSvg
        ? React.createElement("circle", {
            key: "dilation-anchor",
            cx: anchorSvg.x,
            cy: anchorSvg.y,
            r: 10,
            className: "dilation-anchor",
          })
        : null,
      React.createElement(
        "text",
        {
          x: toSvg({ x: objectMinX + 0.2, y: objectMinY - 0.8 }).x,
          y: toSvg({ x: objectMinX + 0.2, y: objectMinY - 0.8 }).y,
          className: "graph-object-label",
        },
        labels.object,
      ),
      React.createElement(
        "text",
        {
          x: toSvg({ x: imageMinX + 1.15, y: imageMinY - 0.75 }).x,
          y: toSvg({ x: imageMinX + 1.15, y: imageMinY - 0.75 }).y,
          className: "graph-image-label",
        },
        labels.image,
      ),
      vertexPickerElements,
    ),
  );
};
