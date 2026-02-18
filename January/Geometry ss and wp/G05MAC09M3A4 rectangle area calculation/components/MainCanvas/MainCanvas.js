const MainCanvas = () => {
  const { useState, useRef } = React;
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(1);
  const [showUnitSquares, setShowUnitSquares] = useState(false);
  const svgRef = useRef(null);

  const gridCols = 14;
  const gridRows = 8;
  const arrowSpace = 60;
  // Calculate to fill available height - use height as primary constraint
  const viewBoxHeight = 600;
  const gridVisualHeight = viewBoxHeight - arrowSpace;
  const stepY = gridVisualHeight / gridRows;
  // Make cells square by using stepY for both dimensions
  const stepX = stepY;
  const gridVisualWidth = stepX * gridCols;
  const viewBoxWidth = gridVisualWidth + arrowSpace;

  // Rectangle position: top-left at (5, 2) in grid coordinates
  const rectGridX = 1;
  const rectGridY = 1;
  const rectX = arrowSpace + rectGridX * stepX;
  const rectY = rectGridY * stepY;
  const rectWidth = width * stepX;
  const rectHeight = height * stepY;

  const gridLineColor = "rgba(148, 163, 184, 0.45)";
  const gridDotColor = "rgba(148, 163, 184, 0.5)";

  // Generate grid lines - grid starts at (arrowSpace, 0)
  const gridStartX = arrowSpace;
  const gridStartY = 0;
  const gridLines = [];
  for (let i = 0; i <= gridCols; i++) {
    const pos = gridStartX + i * stepX;
    gridLines.push(
      React.createElement("line", {
        key: "v-" + i,
        x1: pos, y1: gridStartY, x2: pos, y2: gridStartY + gridVisualHeight,
        stroke: gridLineColor, strokeWidth: "1",
      })
    );
  }
  for (let i = 0; i <= gridRows; i++) {
    const pos = gridStartY + i * stepY;
    gridLines.push(
      React.createElement("line", {
        key: "h-" + i,
        x1: gridStartX, y1: pos, x2: gridStartX + gridVisualWidth, y2: pos,
        stroke: gridLineColor, strokeWidth: "1",
      })
    );
  }

  // Generate grid dots
  const gridDots = [];
  for (let i = 0; i <= gridCols; i++) {
    for (let j = 0; j <= gridRows; j++) {
      const cx = gridStartX + i * stepX;
      const cy = gridStartY + j * stepY;
      gridDots.push(
        React.createElement("circle", {
          key: "dot-" + i + "-" + j,
          cx: cx, cy: cy, r: "2",
          fill: gridDotColor,
        })
      );
    }
  }

  // Generate unit square divider lines and labels (only when Area button is clicked)
  const unitSquareElements = [];
  if (showUnitSquares) {
    let labelNum = 1;
    // Draw divider lines between unit squares
    for (let r = 0; r <= height; r++) {
      const y = rectY + r * stepY;
      unitSquareElements.push(
        React.createElement("line", {
          key: "div-h-" + r,
          x1: rectX, y1: y, x2: rectX + rectWidth, y2: y,
          stroke: "white", strokeWidth: "2",
        })
      );
    }
    for (let c = 0; c <= width; c++) {
      const x = rectX + c * stepX;
      unitSquareElements.push(
        React.createElement("line", {
          key: "div-v-" + c,
          x1: x, y1: rectY, x2: x, y2: rectY + rectHeight,
          stroke: "white", strokeWidth: "2",
        })
      );
    }
    // Draw unit square labels
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const x = rectX + c * stepX + stepX / 2;
        const y = rectY + r * stepY + stepY / 2;
        const unitFontSize = Math.min(stepX, stepY) * 0.6;
        unitSquareElements.push(
          React.createElement("text", {
            key: "label-" + r + "-" + c,
            x: x, y: y,
            textAnchor: "middle",
            dominantBaseline: "middle",
            className: "grid-unit-label",
            fontSize: unitFontSize,
          }, labelNum++)
        );
      }
    }
  }

  const calc = (typeof APP_DATA !== "undefined" && APP_DATA.calc) ? APP_DATA.calc : { 
    areaOfRectangle: "Area of Rectangle", 
    length: "Length", 
    breadth: "Breadth", 
    squareUnits: "sq. units", 
    unit: "unit", 
    units: "units",
    areaButton: "Area",
    resetButton: "Reset"
  };
  const lengthUnitStr = width === 1 ? calc.unit : calc.units;
  const breadthUnitStr = height === 1 ? calc.unit : calc.units;

  const handleWidthIncrement = () => {
    if (rectGridX + width < gridCols) {
      playSound("tick");
      setWidth(width + 1);
    }
  };

  const handleWidthDecrement = () => {
    if (width > 1) {
      playSound("tick");
      setWidth(width - 1);
    }
  };

  const handleHeightIncrement = () => {
    if (rectGridY + height < gridRows) {
      playSound("tick");
      setHeight(height + 1);
    }
  };

  const handleHeightDecrement = () => {
    if (height > 1) {
      playSound("tick");
      setHeight(height - 1);
    }
  };

  const handleAreaClick = () => {
    playSound("click");
    setShowUnitSquares(!showUnitSquares);
  };

  const handleResetClick = () => {
    playSound("click");
    setWidth(2);
    setHeight(1);
    setShowUnitSquares(false);
  };

  // Arrow markers
  const arrowMarkers = React.createElement("defs", null,
    React.createElement("marker", {
      id: "arrow-green",
      markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto",
    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#10b981" })),
    React.createElement("marker", {
      id: "arrow-green-rev",
      markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto-start-reverse",
    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#10b981" })),
    React.createElement("marker", {
      id: "arrow-blue",
      markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto",
    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#0ea5e9" })),
    React.createElement("marker", {
      id: "arrow-blue-rev",
      markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto-start-reverse",
    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#0ea5e9" }))
  );

  // Width arrow (sea green) - horizontal
  const widthArrow = React.createElement("g", { key: "arrow-width" },
    React.createElement("line", {
      x1: rectX, y1: rectY + rectHeight + 20,
      x2: rectX + rectWidth, y2: rectY + rectHeight + 20,
      stroke: "#10b981", strokeWidth: "3",
      markerEnd: "url(#arrow-green)", markerStart: "url(#arrow-green-rev)",
    }),
    React.createElement("text", {
      x: rectX + rectWidth / 2,
      y: rectY + rectHeight + 55,
      textAnchor: "middle",
      className: "grid-arrow-label grid-arrow-label-green",
      fontSize: 36,
    }, width)
  );

  // Height arrow (sea blue) - vertical
  const heightArrow = React.createElement("g", { key: "arrow-height" },
    React.createElement("line", {
      x1: rectX - 20, y1: rectY,
      x2: rectX - 20, y2: rectY + rectHeight,
      stroke: "#0ea5e9", strokeWidth: "3",
      markerEnd: "url(#arrow-blue)", markerStart: "url(#arrow-blue-rev)",
    }),
    React.createElement("text", {
      x: rectX - 50,
      y: rectY + rectHeight / 2,
      textAnchor: "middle",
      transform: "rotate(-90, " + (rectX - 50) + ", " + (rectY + rectHeight / 2) + ")",
      className: "grid-arrow-label grid-arrow-label-blue",
      fontSize: 36,
    }, height)
  );

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    
    // Visual Row (75% height)
    React.createElement(
      "div",
      { className: "visual-row" },
      
      // Left Column - SVG Grid (60% width)
      React.createElement(
        "div",
        { className: "grid-column" },
        React.createElement(
          "svg",
          {
            ref: svgRef,
            viewBox: "0 0 " + viewBoxWidth + " " + viewBoxHeight,
            className: "grid-svg",
          },
          React.createElement("rect", {
            x: gridStartX, y: gridStartY,
            width: gridVisualWidth, height: gridVisualHeight,
            fill: "none",
            stroke: "none",
          }),
          gridLines,
          gridDots,
          React.createElement("rect", {
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            fill: "#7dd3fc",
            stroke: "white",
            strokeWidth: "3",
          }),
          unitSquareElements,
          arrowMarkers,
          widthArrow,
          heightArrow
        )
      ),

      // Right Column - Calculation Panel (40% width)
      React.createElement(
        "div",
        { className: "calc-column" },
        React.createElement("div", { className: "calc-row" },
          React.createElement("span", { className: "calc-text" }, calc.areaOfRectangle)
        ),
        React.createElement("div", { className: "calc-row" },
          React.createElement("span", { className: "calc-text" }, "= "),
          React.createElement("span", { className: "calc-green" }, calc.length),
          React.createElement("span", { className: "calc-text" }, " × "),
          React.createElement("span", { className: "calc-teal" }, calc.breadth)
        ),
        React.createElement("div", { className: "calc-row" },
          React.createElement("span", { className: "calc-text" }, "= "),
          React.createElement("span", { className: "calc-green" }, width + " " + lengthUnitStr),
          React.createElement("span", { className: "calc-text" }, " × "),
          React.createElement("span", { className: "calc-teal" }, height + " " + breadthUnitStr)
        ),
        React.createElement("div", { className: "calc-row" },
          React.createElement("span", { className: "calc-text" }, "= "),
          React.createElement("span", { className: "calc-result" }, (width * height) + " " + calc.squareUnits)
        )
      )
    ),

    // Action Row (25% height)
    React.createElement(
      "div",
      { className: "action-row" },
      
      // Width Stepper
      React.createElement(
        "div",
        { className: "stepper-container" },
        React.createElement("label", { className: "stepper-label" }, calc.length),
        React.createElement("div", { className: "stepper-controls" },
          React.createElement("button", {
            className: "stepper-btn stepper-btn-minus",
            onClick: handleWidthDecrement,
          }, "−"),
          React.createElement("div", { className: "stepper-value" }, width),
          React.createElement("button", {
            className: "stepper-btn stepper-btn-plus",
            onClick: handleWidthIncrement,
          }, "+")
        )
      ),

      // Height Stepper
      React.createElement(
        "div",
        { className: "stepper-container" },
        React.createElement("label", { className: "stepper-label" }, calc.breadth),
        React.createElement("div", { className: "stepper-controls" },
          React.createElement("button", {
            className: "stepper-btn stepper-btn-minus",
            onClick: handleHeightDecrement,
          }, "−"),
          React.createElement("div", { className: "stepper-value" }, height),
          React.createElement("button", {
            className: "stepper-btn stepper-btn-plus",
            onClick: handleHeightIncrement,
          }, "+")
        )
      ),

      // Area Button
      React.createElement("button", {
        className: "action-btn area-btn",
        onClick: handleAreaClick,
      }, calc.areaButton),

      // Reset Button
      React.createElement("button", {
        className: "action-btn reset-btn",
        onClick: handleResetClick,
      }, calc.resetButton)
    )
  );
};
