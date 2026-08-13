function graphPolygonPoints(vertices, toSvg) {
  return vertices
    .map(function (vertex) {
      const point = toSvg(vertex);
      return point.x + "," + point.y;
    })
    .join(" ");
}

function multiplySvgMatrix(left, right) {
  return [
    left[0] * right[0] + left[2] * right[1],
    left[1] * right[0] + left[3] * right[1],
    left[0] * right[2] + left[2] * right[3],
    left[1] * right[2] + left[3] * right[3],
    left[0] * right[4] + left[2] * right[5] + left[4],
    left[1] * right[4] + left[3] * right[5] + left[5],
  ];
}

function graphMatrixToSvgMatrix(matrix, unit, originX, originY) {
  const graphToSvg = [unit, 0, 0, -unit, originX, originY];
  const svgToGraph = [1 / unit, 0, 0, -1 / unit, -originX / unit, originY / unit];
  return multiplySvgMatrix(multiplySvgMatrix(graphToSvg, matrix), svgToGraph);
}

function svgMatrixText(matrix) {
  return "matrix(" + matrix.map(function (value) {
    return Math.round(value * 1000) / 1000;
  }).join(" ") + ")";
}

function applyGraphMatrix(matrix, point) {
  return {
    x: matrix[0] * point.x + matrix[2] * point.y + matrix[4],
    y: matrix[1] * point.x + matrix[3] * point.y + matrix[5],
  };
}

const Graph = ({
  objectVertices,
  imageVertices,
  cloneVertices,
  flipScene,
  cloneIsCorrect,
  cloneStatus,
  cloneShaking,
  imageIsCorrect,
  showVerticalGuides,
  showRotationGuide,
  rotationGuideTarget,
  reflectionAxis,
  rasterScene,
}) => {
  const labels = APP_DATA.labels;
  const config = APP_DATA.graph;
  const xMin = config.xMin;
  const xMax = config.xMax;
  const yMin = config.yMin;
  const yMax = config.yMax;
  const unit = 46;
  const padLeft = 56;
  const padRight = 40;
  const padTop = 28;
  const padBottom = 38;
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

  const tickLabels = [];
  for (let x = xMin + 1; x <= xMax - 1; x++) {
    if (x === 0) continue;
    const pos = toSvg({ x: x, y: 0 });
    tickLabels.push(
      React.createElement(
        "text",
        {
          key: "xl-" + x,
          x: pos.x,
          y: originY + 28,
          className: "graph-axis-number",
          textAnchor: "middle",
        },
        x,
      ),
    );
  }
  for (let y = yMin + 1; y <= yMax - 1; y++) {
    if (y === 0) continue;
    const pos = toSvg({ x: 0, y: y });
    tickLabels.push(
      React.createElement(
        "text",
        {
          key: "yl-" + y,
          x: originX + 20,
          y: pos.y + 6,
          className: "graph-axis-number",
          textAnchor: "middle",
        },
        y,
      ),
    );
  }

  const renderPolygon = function (className, vertices, key, style) {
    if (!vertices) return null;
    return React.createElement("polygon", {
      key: key,
      className: className,
      points: graphPolygonPoints(vertices, toSvg),
      style: style || undefined,
    });
  };

  const renderRaster = function (className, key, matrix, isCorrect, flipAxis) {
    if (!rasterScene) return null;
    const width = rasterScene.width;
    const height = rasterScene.height || rasterScene.width;
    const topLeft = toSvg({
      x: rasterScene.center.x - width / 2,
      y: rasterScene.center.y + height / 2,
    });
    const image = React.createElement("image", {
      href: rasterScene.href,
      x: topLeft.x,
      y: topLeft.y,
      width: width * unit,
      height: height * unit,
      preserveAspectRatio: "xMidYMid meet",
      className: className + (isCorrect ? " is-correct" : ""),
    });
    const content = React.createElement(
      "g",
      { key: key + "-content" },
      image,
    );

    const flipClass = flipAxis ? "is-flipping-" + flipAxis : "";
    const flipStyle = flipClass
      ? { transformOrigin: originX + "px " + originY + "px" }
      : undefined;
    const matrixText = matrix
      ? svgMatrixText(graphMatrixToSvgMatrix(matrix, unit, originX, originY))
      : null;

    if (flipClass) {
      return React.createElement(
        "g",
        {
          key: key,
          className: "raster-clone " + flipClass,
          style: flipStyle,
        },
        React.createElement(
          "g",
          { transform: matrixText || undefined },
          content,
        ),
      );
    }

    if (matrixText) {
      return React.createElement(
        "g",
        { key: key, transform: matrixText },
        content,
      );
    }

    return React.createElement("g", { key: key }, content);
  };

  const renderFlipClone = function () {
    if (!flipScene || rasterScene) return null;
    const flipClass = "is-flipping-" + flipScene.axis;
    const flipStyle = { transformOrigin: originX + "px " + originY + "px" };

    if (flipScene.mode === "guided") {
      return renderPolygon(
        "clone-triangle " + flipClass,
        flipScene.baseVertices,
        "clone-flipping",
        flipStyle,
      );
    }

    return React.createElement(
      "g",
      {
        key: "clone-flipping",
        className: "clone-flip-wrap " + flipClass,
        style: flipStyle,
      },
      React.createElement(
        "g",
        {
          transform: svgMatrixText(
            graphMatrixToSvgMatrix(
              flipScene.matrix || [1, 0, 0, 1, 0, 0],
              unit,
              originX,
              originY,
            ),
          ),
        },
        renderPolygon(
          "clone-triangle",
          flipScene.baseVertices,
          "clone-flipping-shape",
        ),
      ),
    );
  };

  const guideY1 = toSvg({ x: 0, y: 2.35 }).y;
  const guideY2 = toSvg({ x: 0, y: -4.15 }).y;
  const imageMinY = rasterScene
    ? applyGraphMatrix(rasterScene.targetMatrix, rasterScene.center).y - 1.75
    : Math.min.apply(
        null,
        imageVertices.map(function (point) {
          return point.y;
        }),
      );
  const objectMinX = rasterScene
    ? null
    : Math.min.apply(
        null,
        objectVertices.map(function (point) {
          return point.x;
        }),
      );
  const objectMinY = rasterScene
    ? null
    : Math.min.apply(
        null,
        objectVertices.map(function (point) {
          return point.y;
        }),
      );
  const imageMinX = rasterScene
    ? null
    : Math.min.apply(
        null,
        imageVertices.map(function (point) {
          return point.x;
        }),
      );
  const rasterObjectLabel = rasterScene
    ? toSvg({
        x: rasterScene.center.x - 0.65,
        y: rasterScene.center.y - (rasterScene.height || rasterScene.width) / 2 - 0.75,
      })
    : null;
  const rasterImageCenter = rasterScene
    ? applyGraphMatrix(rasterScene.targetMatrix, rasterScene.center)
    : null;
  const rasterImageLabel = rasterScene
    ? toSvg({
        x: rasterImageCenter.x - 0.6,
        y: rasterImageCenter.y - (rasterScene.height || rasterScene.width) / 2 - 0.75,
      })
    : null;
  const rotationGuideSvgTarget = rotationGuideTarget
    ? toSvg(rotationGuideTarget)
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
        "aria-label": "Coordinate graph with object and image triangles",
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
        x1: padLeft + 12,
        y1: originY,
        x2: padLeft + gridWidth,
        y2: originY,
        className: "graph-axis-line",
        markerStart: "url(#axis-arrow-start)",
        markerEnd: "url(#axis-arrow-end)",
      }),
      React.createElement("line", {
        x1: originX,
        y1: padTop + 12,
        x2: originX,
        y2: padTop + gridHeight,
        className: "graph-axis-line",
        markerStart: "url(#axis-arrow-start)",
        markerEnd: "url(#axis-arrow-end)",
      }),
      reflectionAxis === "x"
        ? React.createElement("line", {
            x1: padLeft,
            y1: originY,
            x2: padLeft + gridWidth,
            y2: originY,
            className: "reflect-axis-line",
          })
        : null,
      reflectionAxis === "y"
        ? React.createElement("line", {
            x1: originX,
            y1: padTop,
            x2: originX,
            y2: padTop + gridHeight,
            className: "reflect-axis-line",
          })
        : null,
      tickLabels,
      React.createElement(
        "text",
        { x: originX - 16, y: originY + 22, className: "graph-origin-label" },
        labels.origin,
      ),
      React.createElement(
        "text",
        {
          x: padLeft + gridWidth + 20,
          y: originY + 6,
          className: "graph-axis-name",
        },
        labels.axisX,
      ),
      React.createElement(
        "text",
        { x: padLeft - 24, y: originY + 6, className: "graph-axis-name" },
        labels.axisXPrime,
      ),
      React.createElement(
        "text",
        { x: originX, y: padTop - 14, className: "graph-axis-name" },
        labels.axisY,
      ),
      React.createElement(
        "text",
        {
          x: originX,
          y: padTop + gridHeight + 22,
          className: "graph-axis-name",
        },
        labels.axisYPrime,
      ),
      showVerticalGuides
        ? [5, 8].map(function (x) {
            const pos = toSvg({ x: x, y: 0 }).x;
            return React.createElement("line", {
              key: "guide-" + x,
              x1: pos,
              y1: guideY2,
              x2: pos,
              y2: guideY1,
              className: "vertical-guide-line",
            });
          })
        : null,
      rasterScene
        ? renderRaster(
            "raster-shape raster-image",
            "raster-image",
            rasterScene.targetMatrix,
            imageIsCorrect,
          )
        : renderPolygon(
            "image-triangle" + (imageIsCorrect ? " is-correct" : ""),
            imageVertices,
            "image",
          ),
      rasterScene
        ? renderRaster("raster-shape raster-object", "raster-object")
        : renderPolygon("object-triangle", objectVertices, "object"),
      rasterScene && rasterScene.showClone
        ? renderRaster(
            "raster-shape raster-clone",
            "raster-clone",
            rasterScene.cloneMatrix,
            rasterScene.cloneIsCorrect,
            rasterScene.flipAxis,
          )
        : null,
      renderFlipClone(),
      !flipScene && !rasterScene && cloneVertices
        ? renderPolygon(
            "clone-triangle" +
              (cloneIsCorrect ? " is-correct" : "") +
              (cloneStatus ? " is-" + cloneStatus : "") +
              (cloneShaking ? " is-shaking" : ""),
            cloneVertices,
            "clone",
          )
        : null,
      showRotationGuide && rotationGuideSvgTarget
        ? React.createElement(
            "g",
            { key: "rotation-guide", className: "rotation-guide" },
            React.createElement("line", {
              x1: originX,
              y1: originY,
              x2: rotationGuideSvgTarget.x,
              y2: rotationGuideSvgTarget.y,
              className: "rotation-radius-line",
            }),
            React.createElement("line", {
              x1: originX - 14,
              y1: originY,
              x2: originX + 14,
              y2: originY,
              className: "rotation-center-cross",
            }),
            React.createElement("line", {
              x1: originX,
              y1: originY - 14,
              x2: originX,
              y2: originY + 14,
              className: "rotation-center-cross",
            }),
          )
        : null,
      React.createElement(
        "text",
        {
          x: rasterScene
            ? rasterObjectLabel.x
            : toSvg({ x: objectMinX + 0.2, y: objectMinY - 0.8 }).x,
          y: rasterScene
            ? rasterObjectLabel.y
            : toSvg({ x: objectMinX + 0.2, y: objectMinY - 0.8 }).y,
          className: "graph-object-label",
        },
        labels.object,
      ),
      React.createElement(
        "text",
        {
          x: rasterScene
            ? rasterImageLabel.x
            : toSvg({ x: imageMinX + 1.15, y: imageMinY - 0.75 }).x,
          y: rasterScene
            ? rasterImageLabel.y
            : toSvg({ x: imageMinX + 1.15, y: imageMinY - 0.75 }).y,
          className: "graph-image-label",
        },
        labels.image,
      ),
    ),
  );
};
