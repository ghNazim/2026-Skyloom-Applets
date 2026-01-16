const VisualPanel = ({
  step,
  regions,
  locationPointers,
  points,
  onRegionClick,
  sliderValue,
  onSliderChange,
  showSlider,
  quadrilateral,
  pointNames,
  pointColors,
  showDragGif,
}) => {
  const { useRef, useEffect, useState } = React;
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate viewBox based on aspect ratio 100/70
  // Aspect ratio: width 100, height 70
  const [viewBox, setViewBox] = useState("0 0 100 70");

  useEffect(() => {
    const updateViewBox = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width > 0 && height > 0) {
          // Use normalized viewBox with aspect ratio 100/70
          const normalizedWidth = 100;
          const normalizedHeight = 70;
          setViewBox(`0 0 ${normalizedWidth} ${normalizedHeight}`);
        }
      }
    };

    // Use requestAnimationFrame to ensure container is rendered
    const rafId = requestAnimationFrame(updateViewBox);
    updateViewBox();
    window.addEventListener("resize", updateViewBox);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateViewBox);
    };
  }, []);

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

  const handleCanvasClick = (e) => {
    if (!onRegionClick) return;
    const coords = getSVGCoordinates(e);
    onRegionClick(coords);
  };

  // Create location pointer function
  const createLocationPointer = (x, y, color) => {
    const lineLength = 15;
    const circleRadius = 3;
    const smallCircleRadius = 1.5;

    return React.createElement(
      "g",
      { key: `pointer-${x}-${y}`, className: "location-pointer" },
      // Horizontal dashed line
      React.createElement("line", {
        x1: x - lineLength,
        y1: y,
        x2: x + lineLength,
        y2: y,
        stroke: color,
        strokeWidth: 0.3,
        strokeDasharray: "1,1",
      }),
      // Vertical dashed line
      React.createElement("line", {
        x1: x,
        y1: y - lineLength,
        x2: x,
        y2: y + lineLength,
        stroke: color,
        strokeWidth: 0.3,
        strokeDasharray: "1,1",
      }),
      // Big circle (will fade out)
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: circleRadius,
        fill: color,
        className: "location-pointer-big-circle",
      }),
      // Small white circle (will fade out)
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: smallCircleRadius,
        fill: "white",
        className: "location-pointer-small-circle",
      })
    );
  };

  // Create point (dot representation)
  const createPoint = (
    x,
    y,
    color = "#FFEB3B",
    name = null,
    showLocationLines = false,
    usePropsColors = false
  ) => {
    const pointColor =
      usePropsColors && pointColors && pointColors[`${x}-${y}`]
        ? pointColors[`${x}-${y}`]
        : color || "#FFEB3B";
    const pointName =
      usePropsColors && pointNames && pointNames[`${x}-${y}`]
        ? pointNames[`${x}-${y}`]
        : name;

    return React.createElement(
      "g",
      { key: `point-${x}-${y}` },
      // Location marker lines (for splash screens) - much bigger, white, exceed canvas
      showLocationLines &&
        React.createElement(
          "g",
          { className: "point-location-lines" },
          React.createElement("line", {
            x1: -10, // Exceed canvas to the left
            y1: y,
            x2: 110, // Exceed canvas to the right
            y2: y,
            stroke: "white", // White color
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          React.createElement("line", {
            x1: x,
            y1: -10, // Exceed canvas to the top
            x2: x,
            y2: 110, // Exceed canvas to the bottom
            stroke: "white", // White color
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          })
        ),
      // Big circle (outer) - smaller for main visual panel, keep splash screen size
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: showLocationLines ? 4 : 3, // Smaller in main panel (2.5), keep 4 for splash screens
        fill: pointColor,
        className: "point-outer-circle",
      }),
      // Small white circle (inner) - smaller for main visual panel, keep splash screen size
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: showLocationLines ? 1.92 : 1.5, // Smaller in main panel (1.2), keep 1.92 for splash screens
        fill: "white",
        className: "point-inner-circle",
      }),
      // Point name label - positioned at top-left, twice the size, moved more to the left
      pointName &&
        React.createElement(
          "text",
          {
            x: x - 5, // Moved more to the left (was x - 3)
            y: y - 6,
            fill: "#4CAF50",
            fontSize: 8, // Twice the current size (was 4)
            fontWeight: "bold",
            textAnchor: "start",
            className: "point-name-label",
          },
          pointName
        )
    );
  };

  // Fade out circles after 1 second, keeping only the crossing lines
  useEffect(() => {
    const circles = svgRef.current?.querySelectorAll(
      ".location-pointer-big-circle, .location-pointer-small-circle"
    );
    if (circles && circles.length > 0) {
      const timer = setTimeout(() => {
        circles.forEach((circle) => {
          circle.style.transition = "opacity 0.5s ease-out";
          circle.style.opacity = "0";
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [locationPointers]);

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: "visual-panel-container",
    },
    React.createElement(
      "svg",
      {
        ref: svgRef,
        className: "visual-panel-svg",
        viewBox: viewBox,
        onClick: handleCanvasClick,
        onTouchStart: handleCanvasClick,
      },
      // Render regions (rectangles)
      regions &&
        regions.map((region, index) =>
          React.createElement("rect", {
            key: `region-${index}`,
            x: region.x,
            y: region.y,
            width: region.width,
            height: region.height,
            fill: region.fillColor,
            stroke: region.borderColor,
            strokeWidth: 0.5,
            rx: 1,
            className: "region-rectangle",
            style: { cursor: "pointer" },
          })
        ),
      // Render quadrilateral (for step 4) - scale from center
      quadrilateral &&
        sliderValue > 0.05 &&
        React.createElement("polygon", {
          points: quadrilateral.points,
          fill: quadrilateral.fillColor || "#A88E10",
          stroke: quadrilateral.strokeColor || "white",
          strokeWidth: 1.2,
          transform: `translate(${quadrilateral.center.x}, ${
            quadrilateral.center.y
          }) scale(${sliderValue || 1}) translate(${-quadrilateral.center
            .x}, ${-quadrilateral.center.y})`,
          className:
            sliderValue <= 0.1
              ? "quadrilateral-shape quadrilateral-to-point"
              : "quadrilateral-shape",
        }),
      // Render point from quadrilateral (when shrunk to 0)
      quadrilateral &&
        sliderValue <= 0.05 &&
        createPoint(
          quadrilateral.center.x,
          quadrilateral.center.y,
          "#FFEB3B",
          null,
          false
        ),
      // Render location pointers
      locationPointers &&
        locationPointers.map((pointer) =>
          createLocationPointer(pointer.x, pointer.y, pointer.color)
        ),
      // Render points
      points &&
        points.map((point) =>
          createPoint(
            point.x,
            point.y,
            point.color,
            point.name,
            point.showLocationLines,
            true // Use props for colors and names
          )
        )
    ),
    // Render slider (for step 4)
    showSlider &&
      React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            bottom: "5%",
            width: "70%",
            left: "15%",
          },
        },
        React.createElement("input", {
          type: "range",
          min: 0.05,
          max: 1,
          step: 0.01,
          value: sliderValue || 1,
          onChange: (e) =>
            onSliderChange && onSliderChange(parseFloat(e.target.value)),
          className: "visual-panel-slider",
          style: {
            width: "100%",
          },
        }),
        // Show drag GIF on slider thumb when needed
        showDragGif &&
          React.createElement("img", {
            src: "assets/horizontalDrag.gif",
            alt: "Drag hint",
            className: "slider-drag-gif",
            style: {
              position: "absolute",
              top: "50%",
              left: `${(((sliderValue || 1) - 0.05) / (1 - 0.05)) * 100}%`,
              transform: "translate(-60%, -40%)",
              width: "8vw",
              height: "4vw",
              pointerEvents: "none",
              zIndex: 10,
            },
          })
      )
  );
};
