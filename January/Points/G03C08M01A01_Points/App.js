const App = () => {
  const { useState, useCallback, useEffect } = React;

  const [step, setStep] = useState(-1);
  const [key, setKey] = useState(Date.now());

  // Calculate region dimensions: wider rectangles, less height
  // Aspect ratio: 100/70 (width 100, height 70)
  const SVG_CONTAINER_WIDTH = 100; // Normalized viewBox width
  const SVG_CONTAINER_HEIGHT = 70; // Aspect ratio 100/70

  const GAP = 2; // Same gap for horizontal and vertical
  // Calculate width: (container width - 3*gap) / 2
  // 3 gaps: left padding, middle gap, right padding
  const REGION_WIDTH = (SVG_CONTAINER_WIDTH - 3 * GAP) / 2;

  // Calculate height: (container height - 3*gap) / 2
  // Same logic as width calculation
  const REGION_HEIGHT = (SVG_CONTAINER_HEIGHT - 3 * GAP) / 2;
  const VERTICAL_GAP = GAP; // Same as horizontal gap

  // Position rectangles: 2 gaps for padding, 1 gap in the middle
  const REGION_X1 = GAP;
  const REGION_Y1 = GAP;
  const REGION_X2 = GAP + REGION_WIDTH + GAP;
  const REGION_Y2 = GAP + REGION_HEIGHT + GAP;

  // Step 1 states
  const [regions, setRegions] = useState([
    {
      x: REGION_X1,
      y: REGION_Y1,
      width: REGION_WIDTH,
      height: REGION_HEIGHT,
      fillColor: "#0662A4", // 50% opaque blue
      borderColor: "#1565C0",
      color: "blue",
    },
    {
      x: REGION_X2,
      y: REGION_Y1,
      width: REGION_WIDTH,
      height: REGION_HEIGHT,
      fillColor: "#A88C05", // 50% opaque yellow
      borderColor: "#F9A825",
      color: "yellow",
    },
    {
      x: REGION_X1,
      y: REGION_Y2,
      width: REGION_WIDTH,
      height: REGION_HEIGHT,
      fillColor: "#AC5407", // 50% opaque orange
      borderColor: "#E65100",
      color: "orange",
    },
    {
      x: REGION_X2,
      y: REGION_Y2,
      width: REGION_WIDTH,
      height: REGION_HEIGHT,
      fillColor: "#4B0E84", // 50% opaque purple
      borderColor: "#6A1B9A",
      color: "purple",
    },
  ]);
  const [locationPointers, setLocationPointers] = useState([]);
  const [clickedRegions, setClickedRegions] = useState([]);
  const [step1State, setStep1State] = useState("blue"); // blue, purple, yellow-orange, complete

  // Step 4 states
  const [sliderValue, setSliderValue] = useState(1);
  const [showSlider, setShowSlider] = useState(false);
  const [quadrilateral, setQuadrilateral] = useState(null);
  const [sliderMoved, setSliderMoved] = useState(false); // Track if slider has been moved

  // Step 7 to 8 transition state - track point positions for animation
  const [pointAPos, setPointAPos] = useState({ x: 30, y: 50 }); // Start at same level
  const [pointBPos, setPointBPos] = useState({ x: 70, y: 50 }); // Start at same level
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPointFromQuad, setShowPointFromQuad] = useState(false);

  // Step 6 states
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pointColors, setPointColors] = useState({});
  const [pointNames, setPointNames] = useState({});

  // Step data structure for determining splash screens
  const stepData = [
    { showSplash: false }, // Step 0
    { showSplash: false }, // Step 1
    { showSplash: true }, // Step 2
    { showSplash: false }, // Step 3
    { showSplash: true }, // Step 4
    { showSplash: false }, // Step 5
    { showSplash: true }, // Step 6
    { showSplash: true }, // Step 7
  ];

  // Reset all states when step changes
  const resetStepStates = (newStep) => {
    if (newStep === 0) {
      // Reset step 1
      setRegions([
        {
          x: REGION_X1,
          y: REGION_Y1,
          width: REGION_WIDTH,
          height: REGION_HEIGHT,
          fillColor: "#0662A4", // Updated color
          borderColor: "#1565C0",
          color: "blue",
        },
        {
          x: REGION_X2,
          y: REGION_Y1,
          width: REGION_WIDTH,
          height: REGION_HEIGHT,
          fillColor: "#A88C05", // Updated color
          borderColor: "#F9A825",
          color: "yellow",
        },
        {
          x: REGION_X1,
          y: REGION_Y2,
          width: REGION_WIDTH,
          height: REGION_HEIGHT,
          fillColor: "#AC5407", // Updated color
          borderColor: "#E65100",
          color: "orange",
        },
        {
          x: REGION_X2,
          y: REGION_Y2,
          width: REGION_WIDTH,
          height: REGION_HEIGHT,
          fillColor: "#4B0E84", // Updated color
          borderColor: "#6A1B9A",
          color: "purple",
        },
      ]);
      setLocationPointers([]);
      setClickedRegions([]);
      setStep1State("blue");
    }
    // Don't reset locationPointers when going to step 1 (step 2) - preserve them to show the 4 points
    else if (newStep === 3) {
      // Reset step 4
      setSliderValue(1);
      setShowSlider(true);
      setSliderMoved(false); // Reset slider moved state
      setQuadrilateral({
        points: "25,18 72,15 48,48 22,45", // Irregular quadrilateral (not a parallelogram)
        fillColor: "rgba(255, 235, 59, 0.5)", // 0.5 opacity yellow
        strokeColor: "white",
        center: { x: 49.25, y: 31.5 }, // Calculated center of irregular shape
      });
      setShowPointFromQuad(false);
    } else if (newStep === 4) {
      // Reset step 5 - nothing needed for splash screen
    } else if (newStep === 6) {
      // Reset step 7 - reset point positions to same level
      setPointAPos({ x: 30, y: 50 });
      setPointBPos({ x: 70, y: 50 });
      setIsTransitioning(false);
    } else if (newStep === 7) {
      // Reset step 8 - reset point positions to final positions (no transition)
      setPointAPos({ x: 30, y: 35 });
      setPointBPos({ x: 70, y: 65 });
      setIsTransitioning(false);
    } else if (newStep === 5) {
      // Reset step 6
      setSelectedOption(null);
      setIsCorrect(false);
      setShowFeedback(false);
      setPointColors({});
      setPointNames({});
    }
  };

  useEffect(() => {
    resetStepStates(step);
    // Initialize quadrilateral for step 4
    if (step === 3) {
      setQuadrilateral({
        points: "45,10 65,35 48,55 22,45", // Irregular quadrilateral (not a parallelogram)
        fillColor: "rgba(255, 235, 59, 0.5)", // 0.5 opacity yellow
        strokeColor: "white",
        center: { x: 49.25, y: 31.5 }, // Calculated center of irregular shape
      });
      setShowSlider(true);
      setSliderValue(1);
      setSliderMoved(false); // Reset slider moved state
      setShowPointFromQuad(false);
    }
  }, [step]);

  // Handle step 7 transition animation - ensure all elements animate together
  useEffect(() => {
    if (step === 7 && isTransitioning) {
      // Ensure positions start at y=50 (same level) for initial render
      // This ensures the first render of step 7 has points at same level
      if (pointAPos.y !== 50 || pointBPos.y !== 50) {
        setPointAPos({ x: 30, y: 50 });
        setPointBPos({ x: 70, y: 50 });
        return; // Wait for next render cycle
      }

      // Now positions are at y=50, animate to final positions
      // Use requestAnimationFrame to ensure DOM is ready
      const animationFrame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Small delay to ensure initial render with starting positions (y=50) is complete
          setTimeout(() => {
            setPointAPos({ x: 30, y: 35 }); // Move to top-left
            setPointBPos({ x: 70, y: 65 }); // Move to bottom-right
          }, 100); // Delay to ensure CSS transitions can start
        });
      });

      // Reset transition flag after animation completes
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000); // 100ms delay + 800ms transition + 100ms buffer

      return () => {
        cancelAnimationFrame(animationFrame);
        clearTimeout(timeout);
      };
    }
  }, [step, isTransitioning, pointAPos.y, pointBPos.y]);

  // Handle region click in step 1
  const handleRegionClick = useCallback(
    (coords) => {
      if (step !== 0) return;

      // Find which region was clicked
      const clickedRegion = regions.find((region) => {
        return (
          coords.x >= region.x &&
          coords.x <= region.x + region.width &&
          coords.y >= region.y &&
          coords.y <= region.y + region.height
        );
      });

      if (!clickedRegion || clickedRegions.includes(clickedRegion.color))
        return;

      // Check if it's the correct region to click
      if (step1State === "blue" && clickedRegion.color !== "blue") return;
      if (step1State === "purple" && clickedRegion.color !== "purple") return;
      if (
        step1State === "yellow-orange" &&
        !["yellow", "orange"].includes(clickedRegion.color)
      )
        return;

      // Play click sound for valid click
      playSound("click");

      // Add location pointer
      const colorMap = {
        blue: "#2196F3",
        yellow: "#FFEB3B",
        orange: "#FF9800",
        purple: "#9C27B0",
      };
      setLocationPointers((prev) => [
        ...prev,
        { x: coords.x, y: coords.y, color: colorMap[clickedRegion.color] },
      ]);

      // Remove region
      setRegions((prev) => prev.filter((r) => r.color !== clickedRegion.color));
      setClickedRegions((prev) => [...prev, clickedRegion.color]);

      // Update state
      if (step1State === "blue") {
        setStep1State("purple");
      } else if (step1State === "purple") {
        setStep1State("yellow-orange");
      } else if (step1State === "yellow-orange") {
        // Check if both yellow and orange are now clicked
        const newClickedRegions = [...clickedRegions, clickedRegion.color];
        if (
          newClickedRegions.includes("yellow") &&
          newClickedRegions.includes("orange")
        ) {
          setStep1State("complete");
        }
      }
    },
    [step, regions, clickedRegions, step1State]
  );

  // Handle slider change in step 4
  const handleSliderChange = useCallback(
    (value) => {
      if (step !== 3) return;
      // Mark slider as moved to hide the drag GIF
      if (!sliderMoved) {
        setSliderMoved(true);
      }
      setSliderValue(value);
      if (value <= 0.05 && !showPointFromQuad) {
        // Shrink to point
        setTimeout(() => {
          setShowPointFromQuad(true);
          setShowSlider(false);
          playSound("correct");
        }, 300);
      }
    },
    [step, showPointFromQuad, sliderMoved]
  );

  // Handle MCQ option click in step 6
  const handleOptionClick = useCallback(
    (option) => {
      if (step !== 5 || isCorrect) return;
      setSelectedOption(option);
      setShowFeedback(true);
      const correct = option === APP_DATA.step5.mcq.correctAnswer;
      setIsCorrect(correct);

      if (correct) {
        playSound("correct");
        // Show point names
        const points =
          step === 5
            ? [
                { x: 25, y: 35 }, // Adjusted for 100/70 viewBox
                { x: 75, y: 35 }, // Adjusted for 100/70 viewBox
              ]
            : [];
        const newPointNames = {};
        points.forEach((point, index) => {
          newPointNames[`${point.x}-${point.y}`] = index === 0 ? "A" : "B";
        });
        setPointNames(newPointNames);
      } else {
        playSound("wrong");
        // Visual feedback for wrong options
        if (option === "Color the points") {
          const points =
            step === 5
              ? [
                  { x: 25, y: 35 }, // Adjusted for 100/70 viewBox
                  { x: 75, y: 35 }, // Adjusted for 100/70 viewBox
                ]
              : [];
          const newPointColors = {};
          points.forEach((point, index) => {
            newPointColors[`${point.x}-${point.y}`] =
              index === 0 ? "#2196F3" : "#E91E63";
          });
          setPointColors(newPointColors);
          // Revert after showing feedback
          setTimeout(() => {
            setPointColors({});
          }, 2000);
        }
      }
    },
    [step, isCorrect]
  );

  // Check if next button should be enabled
  const isNextEnabled = () => {
    if (step === -1) {
      return true; // Intro splash screen - always enabled
    } else if (step === 0) {
      return step1State === "complete";
    } else if (step === 1) {
      return true; // Always enabled after step 1
    } else if (step === 3) {
      return showPointFromQuad;
    } else if (step === 5) {
      return isCorrect;
    } else if (step === 7) {
      return true; // Last step
    }
    return true;
  };

  // Handle navigation
  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (step === -1) {
        // From intro splash, go to step 0
        setStep(0);
        setKey(Date.now());
        resetStepStates(0);
      } else if (step === 6) {
        // Transition from step 7 to step 8 - animate points
        // First, ensure positions are at starting point (same level) before changing step
        setPointAPos({ x: 30, y: 50 });
        setPointBPos({ x: 70, y: 50 });
        setIsTransitioning(true);
        // Change step immediately - useEffect will handle the animation
        setStep(7);
        setKey(Date.now());
      } else if (step < stepData.length - 1) {
        setStep(step + 1);
        setKey(Date.now());
      } else {
        // Loop back to step -1 (intro splash)
        setStep(-1);
        setKey(Date.now());
      }
    } else {
      // Previous
      playSound("click");
      if (step > -1) {
        setStep(step - 1);
        setKey(Date.now());
      }
    }
  };

  // Render visual panel content based on step
  const renderVisualPanel = () => {
    // Handle step -1 (intro splash screen)
    if (step === -1) {
      // Step -1: Intro splash screen - same as step 3
      const svgContent = React.createElement(
        "svg",
        {
          viewBox: "0 0 100 100",
          className: "splash-svg",
          style: { width: "100%", height: "100%" },
        },
        // Gray rectangle in the middle (70x55, not square)
        React.createElement("rect", {
          x: 15,
          y: 22.5,
          width: 70,
          height: 55,
          fill: "rgba(60, 60, 60, 0.4)",
          stroke: "rgb(255, 255, 255)",
          strokeWidth: 0.5,
          rx: 1,
        }),
        // Location lines - much bigger, white, exceed canvas
        React.createElement("line", {
          x1: -10,
          y1: 58,
          x2: 110,
          y2: 58,
          stroke: "white",
          strokeWidth: 0.3,
          strokeDasharray: "1,1",
        }),
        React.createElement("line", {
          x1: 58,
          y1: -10,
          x2: 58,
          y2: 110,
          stroke: "white",
          strokeWidth: 0.3,
          strokeDasharray: "1,1",
        }),
        // Point shifted towards bottom-right (not centered)
        React.createElement("circle", {
          cx: 58,
          cy: 58,
          r: 4, // 1.6x larger
          fill: "#FFEB3B",
        }),
        React.createElement("circle", {
          cx: 58,
          cy: 58,
          r: 1.92, // 1.6x larger
          fill: "white",
        })
      );

      return React.createElement(SplashScreen, {
        svgContent,
        contentText: APP_DATA.stepIntro.contentText,
        boxes: null,
      });
    }

    if (step >= 0 && stepData[step].showSplash) {
      // Splash screen steps (2, 4, 6, 7)
      let svgContent = null;
      if (step === 2) {
        // Step 3: Yellow point with location lines - point shifted towards bottom-right
        svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 100",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Gray rectangle in the middle (70x55, not square)
          React.createElement("rect", {
            x: 15,
            y: 22.5,
            width: 70,
            height: 55,
            fill: "rgba(60, 60, 60, 0.4)",
            stroke: "rgb(255, 255, 255)",
            strokeWidth: 0.5,
            rx: 1,
          }),
          // Location lines - much bigger, white, exceed canvas
          React.createElement("line", {
            x1: -10,
            y1: 58,
            x2: 110,
            y2: 58,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          React.createElement("line", {
            x1: 58,
            y1: -10,
            x2: 58,
            y2: 110,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          // Point shifted towards bottom-right (not centered)
          React.createElement("circle", {
            cx: 58,
            cy: 58,
            r: 4, // 1.6x larger
            fill: "#FFEB3B",
          }),
          React.createElement("circle", {
            cx: 58,
            cy: 58,
            r: 1.92, // 1.6x larger
            fill: "white",
          })
        );
      } else if (step === 4) {
        // Step 5: Same as step 3, but point shifted towards bottom-right
        svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 100",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Gray rectangle in the middle (70x55, not square)
          React.createElement("rect", {
            x: 15,
            y: 22.5,
            width: 70,
            height: 55,
            fill: "rgba(60, 60, 60, 0.4)",
            stroke: "rgb(255, 255, 255)",
            strokeWidth: 0.5,
            rx: 1,
          }),
          // Location lines - much bigger, white, exceed canvas
          React.createElement("line", {
            x1: -10,
            y1: 58,
            x2: 110,
            y2: 58,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          React.createElement("line", {
            x1: 58,
            y1: -10,
            x2: 58,
            y2: 110,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          // Point shifted towards bottom-right (not centered)
          React.createElement("circle", {
            cx: 58,
            cy: 58,
            r: 4, // 1.6x larger
            fill: "#FFEB3B",
          }),
          React.createElement("circle", {
            cx: 58,
            cy: 58,
            r: 1.92, // 1.6x larger
            fill: "white",
          })
        );
      } else if (step === 6) {
        // Step 7: Two named points at same horizontal level
        svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 100",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Gray rectangle in the middle (70x55, not square)
          React.createElement("rect", {
            x: 15,
            y: 22.5,
            width: 70,
            height: 55,
            fill: "rgba(60, 60, 60, 0.4)",
            stroke: "rgb(255, 255, 255)",
            strokeWidth: 0.5,
            rx: 1,
          }),
          // Point A - same horizontal level as B (y = 50)
          React.createElement("line", {
            x1: -10,
            y1: 50, // Same horizontal level
            x2: 110,
            y2: 50,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          React.createElement("line", {
            x1: 30,
            y1: -10,
            x2: 30,
            y2: 110,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          React.createElement("circle", {
            cx: 30,
            cy: 50, // Same horizontal level
            r: 4,
            fill: "#FFEB3B",
          }),
          React.createElement("circle", {
            cx: 30,
            cy: 50, // Same horizontal level
            r: 1.92,
            fill: "white",
          }),
          React.createElement(
            "text",
            {
              x: 25,
              y: 44, // Adjusted for y = 50
              fill: "#4CAF50",
              fontSize: 8,
              fontWeight: "bold",
              textAnchor: "start",
            },
            "A"
          ),
          // Point B - same horizontal level as A (y = 50)
          React.createElement("line", {
            x1: -10,
            y1: 50, // Same horizontal level
            x2: 110,
            y2: 50,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          React.createElement("line", {
            x1: 70,
            y1: -10,
            x2: 70,
            y2: 110,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
          }),
          React.createElement("circle", {
            cx: 70,
            cy: 50, // Same horizontal level
            r: 4,
            fill: "#FFEB3B",
          }),
          React.createElement("circle", {
            cx: 70,
            cy: 50, // Same horizontal level
            r: 1.92,
            fill: "white",
          }),
          React.createElement(
            "text",
            {
              x: 65,
              y: 44, // Adjusted for y = 50
              fill: "#4CAF50",
              fontSize: 8,
              fontWeight: "bold",
              textAnchor: "start",
            },
            "B"
          )
        );
      } else if (step === 7) {
        // Step 8: Two named points (top-left and bottom-right) with transition animation
        svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 100",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Gray rectangle in the middle (70x55, not square)
          React.createElement("rect", {
            x: 15,
            y: 22.5,
            width: 70,
            height: 55,
            fill: "rgba(60, 60, 60, 0.4)",
            stroke: "rgb(255, 255, 255)",
            strokeWidth: 0.5,
            rx: 1,
          }),
          // Point A - transitions from same level (y=50) to top-left (y=35)
          React.createElement("line", {
            x1: -10,
            y1: pointAPos.y,
            x2: 110,
            y2: pointAPos.y,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
            className: isTransitioning ? "point-transition-line" : "",
          }),
          React.createElement("line", {
            x1: pointAPos.x,
            y1: -10,
            x2: pointAPos.x,
            y2: 110,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
            className: isTransitioning ? "point-transition-line" : "",
          }),
          React.createElement("circle", {
            cx: pointAPos.x,
            cy: pointAPos.y,
            r: 4,
            fill: "#FFEB3B",
            className: isTransitioning ? "point-transition-circle" : "",
          }),
          React.createElement("circle", {
            cx: pointAPos.x,
            cy: pointAPos.y,
            r: 1.92,
            fill: "white",
            className: isTransitioning ? "point-transition-circle" : "",
          }),
          React.createElement(
            "text",
            {
              x: pointAPos.x - 5,
              y: pointAPos.y - 6,
              fill: "#4CAF50",
              fontSize: 8,
              fontWeight: "bold",
              textAnchor: "start",
              className: isTransitioning ? "point-transition-text" : "",
            },
            "A"
          ),
          // Point B - transitions from same level (y=50) to bottom-right (y=65)
          React.createElement("line", {
            x1: -10,
            y1: pointBPos.y,
            x2: 110,
            y2: pointBPos.y,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
            className: isTransitioning ? "point-transition-line" : "",
          }),
          React.createElement("line", {
            x1: pointBPos.x,
            y1: -10,
            x2: pointBPos.x,
            y2: 110,
            stroke: "white",
            strokeWidth: 0.3,
            strokeDasharray: "1,1",
            className: isTransitioning ? "point-transition-line" : "",
          }),
          React.createElement("circle", {
            cx: pointBPos.x,
            cy: pointBPos.y,
            r: 4,
            fill: "#FFEB3B",
            className: isTransitioning ? "point-transition-circle" : "",
          }),
          React.createElement("circle", {
            cx: pointBPos.x,
            cy: pointBPos.y,
            r: 1.92,
            fill: "white",
            className: isTransitioning ? "point-transition-circle" : "",
          }),
          React.createElement(
            "text",
            {
              x: pointBPos.x - 5,
              y: pointBPos.y - 6,
              fill: "#4CAF50",
              fontSize: 8,
              fontWeight: "bold",
              textAnchor: "start",
              className: isTransitioning ? "point-transition-text" : "",
            },
            "B"
          )
        );
      }

      let contentText = null;
      let boxes = null;
      if (step === 2) {
        contentText = APP_DATA.step2.contentText;
      } else if (step === 4) {
        contentText = APP_DATA.step4.contentText;
      } else if (step === 6) {
        contentText = APP_DATA.step6.contentText;
      } else if (step === 7) {
        boxes = APP_DATA.step7.boxes;
      }

      return React.createElement(SplashScreen, {
        svgContent,
        contentText,
        boxes,
      });
    } else {
      // Regular visual panel steps
      let points = [];
      if (step === 1) {
        // Step 2: Show points instead of location markers - all points should be yellow/orange
        points = locationPointers.map((pointer) => ({
          x: pointer.x,
          y: pointer.y,
          color: "#FFEB3B", // All points are yellow/orange in step 2
        }));
      } else if (step === 5) {
        // Step 6: Two points for MCQ - adjusted for 100/70 viewBox (centered at y=35)
        points = [
          {
            x: 25,
            y: 35, // Adjusted for 100/70 viewBox
            color: pointColors["25-35"] || "#FFEB3B",
            name: pointNames["25-35"] || null,
            showLocationLines: false,
          },
          {
            x: 75,
            y: 35, // Adjusted for 100/70 viewBox
            color: pointColors["75-35"] || "#FFEB3B",
            name: pointNames["75-35"] || null,
            showLocationLines: false,
          },
        ];
      }

      return React.createElement(VisualPanel, {
        key: key,
        step,
        regions: step === 0 ? regions : null,
        locationPointers: step === 0 ? locationPointers : null,
        points: points.length > 0 ? points : null,
        onRegionClick: step === 0 ? handleRegionClick : null,
        sliderValue: step === 3 ? sliderValue : null,
        onSliderChange: step === 3 ? handleSliderChange : null,
        showSlider: step === 3 ? showSlider : false,
        quadrilateral: step === 3 ? quadrilateral : null,
        pointNames: step === 5 ? pointNames : null,
        pointColors: step === 5 ? pointColors : null,
        showDragGif: step === 3 && !sliderMoved, // Show drag GIF when slider hasn't been moved
      });
    }
  };

  // Update MCQ content based on step state
  const getMCQContent = () => {
    if (step === 0) {
      if (step1State === "blue") {
        return APP_DATA.step0.blue.infoText;
      } else if (step1State === "purple") {
        return APP_DATA.step0.purple.infoText;
      } else if (step1State === "yellow-orange") {
        return APP_DATA.step0.yellowOrange.infoText;
      } else if (step1State === "complete") {
        return APP_DATA.step0.complete.infoText;
      }
    } else if (step === 1) {
      return APP_DATA.step1.infoText;
    } else if (step === 3) {
      if (showPointFromQuad) {
        return APP_DATA.step3.infoTextAfter;
      }
      return APP_DATA.step3.infoText;
    }
    return null;
  };

  // Update question text based on step state
  const getQuestionText = () => {
    if (step === -1) {
      return APP_DATA.stepIntro.question;
    } else if (step === 0) {
      if (step1State === "blue") {
        return APP_DATA.step0.blue.question;
      } else if (step1State === "purple") {
        return APP_DATA.step0.purple.question;
      } else if (step1State === "yellow-orange") {
        return APP_DATA.step0.yellowOrange.question;
      } else if (step1State === "complete") {
        return APP_DATA.step0.complete.question;
      }
    } else if (step === 1) {
      return APP_DATA.step1.question;
    } else if (step === 2) {
      return APP_DATA.step2.question;
    } else if (step === 3) {
      return APP_DATA.step3.question;
    } else if (step === 4) {
      return APP_DATA.step4.question;
    } else if (step === 5) {
      if (isCorrect) {
        return APP_DATA.step5.questionAfter;
      }
      return APP_DATA.step5.question;
    } else if (step === 6) {
      return APP_DATA.step6.question;
    } else if (step === 7) {
      return APP_DATA.step7.question;
    }
    return "";
  };

  const getNavText = () => {
    if (step === -1) {
      return APP_DATA.stepIntro.navText; // Empty string
    } else if (step === 0) {
      if (step1State === "blue") {
        return APP_DATA.step0.blue.navText;
      } else if (step1State === "purple") {
        return APP_DATA.step0.purple.navText;
      } else if (step1State === "yellow-orange") {
        return APP_DATA.step0.yellowOrange.navText;
      } else if (step1State === "complete") {
        return APP_DATA.step0.complete.navText;
      }
    } else if (step === 1) {
      return APP_DATA.step1.navText;
    } else if (step === 2) {
      return APP_DATA.step2.navText;
    } else if (step === 3) {
      return showPointFromQuad
        ? APP_DATA.step3.navTextAfter
        : APP_DATA.step3.navText;
    } else if (step === 4) {
      return APP_DATA.step4.navText;
    } else if (step === 5) {
      if (isCorrect) {
        return APP_DATA.step5.navTextAfter;
      }
      return APP_DATA.step5.navText;
    } else if (step === 6) {
      return APP_DATA.step6.navText;
    } else if (step === 7) {
      return APP_DATA.step7.navText;
    }
    return "";
  };

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
    }),
    step === -1 || (step >= 0 && stepData[step].showSplash)
      ? React.createElement(
          "div",
          {
            className: "app-main-content",
            style: { display: "flex", flexDirection: "row" },
          },
          renderVisualPanel()
        )
      : React.createElement(
          "div",
          { className: "app-main-content" },
          React.createElement(
            "div",
            { className: "visual-panel" },
            renderVisualPanel()
          ),
          React.createElement(
            "div",
            { className: "mcq-panel-wrapper" },
            React.createElement(MCQPanel, {
              content:
                step === 0 || step === 1 || step === 3 ? getMCQContent() : null,
              mcqData: step === 5 ? APP_DATA.step5.mcq : null,
              selectedOption: step === 5 ? selectedOption : null,
              isCorrect: step === 5 ? isCorrect : false,
              onOptionClick: step === 5 ? handleOptionClick : null,
              showFeedback: step === 5 ? showFeedback : false,
            })
          )
        ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: !isNextEnabled(),
        isPrevDisabled: step === -1,
        nextButtonText:
          step === -1
            ? APP_DATA.navButtonStart
            : step === 7
            ? APP_DATA.navButtonStartOver
            : null,
        navText: getNavText(),
        showTapGif: step === -1, // Show tap GIF on next button in step -1
      })
    )
  );
};
