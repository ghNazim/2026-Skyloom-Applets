const MainCanvas = ({
  points,
  onTriangleComplete,
  isComplete: isInitiallyComplete,
}) => {
  const { useState, useRef, useEffect } = React;
  const svgRef = useRef(null);
  // If the canvas is told to be complete from the start, initialize the lines array accordingly.
  const [lines, setLines] = useState(
    isInitiallyComplete
      ? ["AB", "BC", "AC"].map((k) => k.split("").sort().join(""))
      : []
  );
  const [dragLine, setDragLine] = useState(null);
  const [draggingPoint, setDraggingPoint] = useState(null);

  const SNAP_RADIUS = 25; // Radius to snap to another point

  const getPointCoordinates = (pointName) => points[pointName];
  const { labels } = points;

  // Function to get mouse position relative to SVG
  const getSVGCoordinates = (event) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    if (event.touches && event.touches[0]) {
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY;
    } else {
      pt.x = event.clientX;
      pt.y = event.clientY;
    }
    const ctm = svg.getScreenCTM();
    if (ctm) {
      return pt.matrixTransform(ctm.inverse());
    }
    return pt;
  };

  const getPointAt = (coords) => {
    for (const name in points) {
      if (name === "labels") continue;
      const point = points[name];
      const distance = Math.sqrt(
        Math.pow(point.x - coords.x, 2) + Math.pow(point.y - coords.y, 2)
      );
      if (distance < SNAP_RADIUS) {
        return name;
      }
    }
    return null;
  };

  const lineExists = (p1, p2) => {
    const key1 = `${p1}${p2}`.split("").sort().join("");
    return lines.includes(key1);
  };

  const handleMouseDown = (e, pointName) => {
    e.preventDefault();
    if (isInitiallyComplete) return; // Don't allow drawing on an already complete triangle
    const startCoords = getPointCoordinates(pointName);
    setDraggingPoint(pointName);
    setDragLine({
      x1: startCoords.x,
      y1: startCoords.y,
      x2: startCoords.x,
      y2: startCoords.y,
    });
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (!draggingPoint) return;
    const coords = getSVGCoordinates(e);
    setDragLine((prev) => ({ ...prev, x2: coords.x, y2: coords.y }));
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    if (!draggingPoint) return;

    const coords = getSVGCoordinates(
      e.changedTouches ? e.changedTouches[0] : e
    );
    const endPoint = getPointAt(coords);

    if (
      endPoint &&
      endPoint !== draggingPoint &&
      !lineExists(draggingPoint, endPoint)
    ) {
      setLines((prev) => [
        ...prev,
        `${draggingPoint}${endPoint}`.split("").sort().join(""),
      ]);
      playSound("click");
    }

    setDraggingPoint(null);
    setDragLine(null);
  };

  useEffect(() => {
    // Only call the onTriangleComplete callback if the user drew the lines,
    // not if it was complete from the beginning.
    if (lines.length === 3 && !isInitiallyComplete) {
      onTriangleComplete();
    }
  }, [lines, onTriangleComplete, isInitiallyComplete]);

  const isComplete = lines.length === 3;

  const getMidpoint = (p1, p2) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  const getAngle = (p1, p2) => {
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
  };

  const sideLabelData = isComplete
    ? [
        {
          point: getMidpoint(points.A, points.B),
          text: APP_DATA.side,
          angle: getAngle(points.A, points.B),
          config: labels.sideAB,
        },
        {
          point: getMidpoint(points.B, points.C),
          text: APP_DATA.side,
          angle: getAngle(points.B, points.C),
          config: labels.sideBC,
        },
        {
          point: getMidpoint(points.C, points.A),
          text: APP_DATA.side,
          angle: getAngle(points.C, points.A),
          config: labels.sideCA,
        },
      ]
    : [];

  const cornerLabelData = isComplete
    ? [
        {
          point: points.A,
          text: APP_DATA.corner,
          config: labels.cornerA,
        },
        {
          point: points.B,
          text: APP_DATA.corner,
          config: labels.cornerB,
        },
        {
          point: points.C,
          text: APP_DATA.corner,
          config: labels.cornerC,
        },
      ]
    : [];

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "svg",
      {
        ref: svgRef,
        className: "main-canvas",
        viewBox: "0 0 100 100",
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onTouchMove: handleMouseMove,
        onTouchEnd: handleMouseUp,
      },
      // Render permanent lines
      lines.map((lineKey) => {
        const p1 = lineKey[0];
        const p2 = lineKey[1];
        const start = getPointCoordinates(p1);
        const end = getPointCoordinates(p2);
        return React.createElement("line", {
          key: lineKey,
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          className: "permanent-line",
        });
      }),
      // Render temporary dragging line
      dragLine &&
        React.createElement("line", {
          x1: dragLine.x1,
          y1: dragLine.y1,
          x2: dragLine.x2,
          y2: dragLine.y2,
          className: "drag-line",
        }),
      // Render points and their labels
      Object.keys(points).map((pointName) => {
        if (pointName === "labels") return null;
        const point = getPointCoordinates(pointName);
        return React.createElement(
          "g",
          { key: pointName },
          React.createElement("circle", {
            cx: point.x,
            cy: point.y,
            r: "2",
            className: "point-circle",
            onMouseDown: (e) => handleMouseDown(e, pointName),
            onTouchStart: (e) => handleMouseDown(e, pointName),
          }),
          // Conditionally render the A, B, C labels
          !isComplete &&
            React.createElement(
              "text",
              {
                x: point.x + labels[`corner${pointName}`].x,
                y: point.y + labels[`corner${pointName}`].y,
                className: "point-label",
              },
              pointName
            )
        );
      }),

      // Render side and corner labels when complete
      sideLabelData.map((label, index) => {
        const finalX = label.point.x + label.config.x;
        const finalY = label.point.y + label.config.y;
        const finalRotation = label.angle + label.config.rotate;
        return React.createElement(
          "text",
          {
            key: `side-${index}`,
            x: finalX,
            y: finalY,
            className: "side-label",
            transform: `rotate(${finalRotation} ${finalX} ${finalY})`,
          },
          label.text
        );
      }),
      cornerLabelData.map((label, index) =>
        React.createElement(
          "text",
          {
            key: `corner-${index}`,
            x: label.point.x + label.config.x,
            y: label.point.y + label.config.y,
            className: "corner-label",
          },
          label.text
        )
      )
    )
  );
};
