const MainCanvas = () => {
  const { useState, useRef, useEffect } = React;
  const [side, setSide] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  const audioCtxRef = useRef(null);
  const playTickSound = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  };

  const gridSize = 10;
  const padding = 50;
  const viewBoxSize = 600;
  const gridVisualSize = viewBoxSize - padding * 2;
  const step = gridVisualSize / gridSize;

  const getGridCoords = (e) => {
    if (!svgRef.current) return null;
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;
    const svgX = (x / svgRect.width) * viewBoxSize;
    const svgY = (y / svgRect.height) * viewBoxSize;
    const gridX = (svgX - padding) / step;
    const gridY = (viewBoxSize - padding - svgY) / step;
    return { x: gridX, y: gridY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || e.buttons !== 1) return;
    const coords = getGridCoords(e);
    if (!coords) return;
    let avg = (coords.x + coords.y) / 2;
    let newSide = Math.round(avg);
    newSide = Math.max(1, Math.min(10, newSide));
    if (newSide !== side) {
      playTickSound();
      setSide(newSide);
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      document.addEventListener("pointerup", handleGlobalPointerUp);
      return () => {
        document.removeEventListener("pointerup", handleGlobalPointerUp);
      };
    }
  }, [isDragging]);

  const handleX = padding + side * step;
  const handleY = viewBoxSize - padding - side * step;

  const gridLineColor = "rgba(148, 163, 184, 0.45)";
  const gridDotColor = "rgba(148, 163, 184, 0.5)";

  const gridLines = [];
  for (let i = 0; i <= gridSize; i++) {
    const pos = padding + i * step;
    gridLines.push(
      React.createElement("line", {
        key: "v-" + i,
        x1: pos, y1: padding, x2: pos, y2: viewBoxSize - padding,
        stroke: gridLineColor, strokeWidth: "1",
      })
    );
    gridLines.push(
      React.createElement("line", {
        key: "h-" + i,
        x1: padding, y1: pos, x2: viewBoxSize - padding, y2: pos,
        stroke: gridLineColor, strokeWidth: "1",
      })
    );
  }

  const gridDots = [];
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      const cx = padding + i * step;
      const cy = padding + j * step;
      gridDots.push(
        React.createElement("circle", {
          key: "dot-" + i + "-" + j,
          cx: cx, cy: cy, r: "2",
          fill: gridDotColor,
        })
      );
    }
  }

  const unitLabels = [];
  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      const x = padding + c * step + step / 2;
      const y = viewBoxSize - padding - r * step - step / 2;
      const labelValue = r * side + (c + 1);
      const unitFontSize = step * 0.45;
      unitLabels.push(
        React.createElement("text", {
          key: "label-" + r + "-" + c,
          x: x, y: y,
          textAnchor: "middle",
          dominantBaseline: "middle",
          className: "grid-unit-label",
          fontSize: unitFontSize,
        }, labelValue)
      );
    }
  }

  const calc = (typeof APP_DATA !== "undefined" && APP_DATA.calc) ? APP_DATA.calc : { areaOfSquare: "Area of square", numberOfUnitSquares: "Number of unit squares", squareUnits: "square units", unit: "unit", units: "units" };
  const unitStr = side === 1 ? calc.unit : calc.units;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    React.createElement(
      "div",
      { className: "grid-column" },
        React.createElement(
        "svg",
        {
          ref: svgRef,
          viewBox: "0 0 " + viewBoxSize + " " + (viewBoxSize + 20),
          className: "grid-svg",
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp,
          onPointerLeave: handlePointerUp,
        },
        React.createElement("rect", {
          x: padding, y: padding,
          width: gridVisualSize, height: gridVisualSize,
          fill: "none",
        }),
        gridLines,
        React.createElement("rect", {
          x: padding,
          y: handleY,
          width: side * step,
          height: side * step,
          fill: "#A855F7",
          fillOpacity: "0.5",
        }),
        unitLabels,
        React.createElement("g", { key: "arrow-h" },
          React.createElement("defs", null,
            React.createElement("marker", {
              id: "arrow-green",
              markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto",
            }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#10b981" })),
            React.createElement("marker", {
              id: "arrow-green-rev",
              markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto-start-reverse",
            }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#10b981" }))
          ),
          React.createElement("line", {
            x1: padding, y1: viewBoxSize - padding + 35,
            x2: padding + side * step, y2: viewBoxSize - padding + 35,
            stroke: "#10b981", strokeWidth: "3",
            markerEnd: "url(#arrow-green)", markerStart: "url(#arrow-green-rev)",
          }),
          React.createElement("text", {
            x: padding + (side * step) / 2,
            y: viewBoxSize - padding + 65,
            textAnchor: "middle",
            className: "grid-arrow-label grid-arrow-label-green",
            fontSize: 28,
          }, side)
        ),
        React.createElement("g", { key: "arrow-v" },
          React.createElement("defs", null,
            React.createElement("marker", {
              id: "arrow-blue",
              markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto",
            }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#0ea5e9" })),
            React.createElement("marker", {
              id: "arrow-blue-rev",
              markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto-start-reverse",
            }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#0ea5e9" }))
          ),
          React.createElement("line", {
            x1: padding - 35, y1: viewBoxSize - padding,
            x2: padding - 35, y2: handleY,
            stroke: "#0ea5e9", strokeWidth: "3",
            markerEnd: "url(#arrow-blue)", markerStart: "url(#arrow-blue-rev)",
          }),
          React.createElement("text", {
            x: padding - 55,
            y: viewBoxSize - padding - (side * step) / 2,
            textAnchor: "middle",
            transform: "rotate(-90, " + (padding - 55) + ", " + (viewBoxSize - padding - (side * step) / 2) + ")",
            className: "grid-arrow-label grid-arrow-label-blue",
            fontSize: 28,
          }, side)
        ),
        React.createElement("circle", {
          cx: handleX, cy: handleY, r: "18",
          fill: "white", stroke: "#A855F7", strokeWidth: "3",
          className: "grid-handle-outer",
          onPointerDown: handlePointerDown,
          style: { cursor: "grab" },
        }),
        React.createElement("circle", {
          cx: handleX, cy: handleY, r: "6",
          fill: "#A855F7",
          className: "grid-handle-inner",
          onPointerDown: handlePointerDown,
          style: { cursor: "grab" },
        })
      )
    ),

    React.createElement(
      "div",
      { className: "calc-column" },
      React.createElement("div", { className: "calc-row" },
        React.createElement("span", { className: "calc-left" }, calc.areaOfSquare),
        React.createElement("span", { className: "calc-eq" }, "="),
        React.createElement("span", { className: "calc-right" }, calc.numberOfUnitSquares)
      ),
      React.createElement("div", { className: "calc-row" },
        React.createElement("span", { className: "calc-left" }),
        React.createElement("span", { className: "calc-eq" }, "="),
        React.createElement("span", { className: "calc-right" },
          React.createElement("span", { className: "calc-green" }, side + " " + unitStr),
          React.createElement("span", { className: "calc-mul" }, " × "),
          React.createElement("span", { className: "calc-teal" }, side + " " + unitStr)
        )
      ),
      React.createElement("div", { className: "calc-row" },
        React.createElement("span", { className: "calc-left" }),
        React.createElement("span", { className: "calc-eq" }, "="),
        React.createElement("span", { className: "calc-right calc-result" }, side * side + " " + calc.squareUnits)
      )
    )
  );
};
