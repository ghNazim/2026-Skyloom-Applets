const App = () => {
  const { useState, useCallback, useEffect } = React;

  const [step, setStep] = useState(-1);
  const [key, setKey] = useState(Date.now());

  // Step 0 states - Draggable points and animations
  const [pointAPos, setPointAPos] = useState({ x: 30, y: 35 });
  const [pointBPos, setPointBPos] = useState({ x: 70, y: 35 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPoint, setDraggedPoint] = useState(null);
  const [step0SubStep, setStep0SubStep] = useState("initial"); // "initial", "connected", "extended", "slider"
  const [animationComplete, setAnimationComplete] = useState(false);
  const [extendAnimationComplete, setExtendAnimationComplete] = useState(false);
  const [sliderValue, setSliderValue] = useState(1); // Persist across steps
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [showLineSegmentAB, setShowLineSegmentAB] = useState(false);
  const [showLineSegmentBC, setShowLineSegmentBC] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [arrowBlinking, setArrowBlinking] = useState(false);
  const [showLineNameStep0, setShowLineNameStep0] = useState(false);

  // Step 1-2 states - Ray introduction
  // (no special states needed)

  // Step 3 states - Naming ray - starting point
  const [selectedStartingPoint, setSelectedStartingPoint] = useState(null);
  const [showStartingPointFeedback, setShowStartingPointFeedback] =
    useState(false);
  const [isStartingPointCorrect, setIsStartingPointCorrect] = useState(false);
  const [pointAColor, setPointAColor] = useState("#FFEB3B");
  const [pointBColor, setPointBColor] = useState("#FFEB3B");
  const [pointALabelColor, setPointALabelColor] = useState("white"); // White for step 3
  const [pointBLabelColor, setPointBLabelColor] = useState("white"); // White for step 3
  const [showPointCircles, setShowPointCircles] = useState(false);
  const [pointACircleColor, setPointACircleColor] = useState("white"); // Circle color for step 3
  const [pointBCircleColor, setPointBCircleColor] = useState("white"); // Circle color for step 3

  // Step 4 states - Naming ray - direction point
  const [labelABlinking, setLabelABlinking] = useState(false);
  const [labelAAnimationComplete, setLabelAAnimationComplete] = useState(false);
  const [labelBAnimationComplete, setLabelBAnimationComplete] = useState(false);

  // Step 5 states - Naming ray - arrow symbol
  const [rayName, setRayName] = useState("");
  const [showArrowSymbol, setShowArrowSymbol] = useState(false);
  const [showArrowCircle, setShowArrowCircle] = useState(false);
  const [overlinedBlinking, setOverlinedBlinking] = useState(false);

  // Step 6 states - MCQ about order
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBAArrow, setShowBAArrow] = useState(false);
  const [baArrowBlinking, setBaArrowBlinking] = useState(false);
  const [originalArrowColor, setOriginalArrowColor] = useState("white");

  // Step data structure for determining splash screens
  const stepData = [
    { showSplash: false }, // Step 0
    { showSplash: false }, // Step 1
    { showSplash: false }, // Step 2
    { showSplash: false }, // Step 3
    { showSplash: false }, // Step 4
    { showSplash: false }, // Step 5
    { showSplash: false }, // Step 6
    { showSplash: true }, // Step 7
  ];

  // Reset all states when step changes
  const resetStepStates = (newStep) => {
    if (newStep === 0) {
      // Only reset if coming from splash screen
      if (step === -1) {
        setStep0SubStep("initial");
        setAnimationComplete(false);
        setExtendAnimationComplete(false);
        setSliderValue(1);
        setShowDottedLine(false);
        setShowLineSegmentAB(false);
        setShowLineSegmentBC(false);
        setShowArrow(false);
        setArrowBlinking(false);
        setShowLineNameStep0(false);
        setPointAPos({ x: 30, y: 35 });
        setPointBPos({ x: 70, y: 35 });
        setIsDragging(false);
        setDraggedPoint(null);
      }
      // Otherwise, keep the visual state from previous step
    } else if (newStep === 1) {
      // Keep visual state from step 0 - don't reset anything
      // The visual (zoomed positions, lines, etc.) will persist
    } else if (newStep === 3) {
      setSelectedStartingPoint(null);
      setShowStartingPointFeedback(false);
      setIsStartingPointCorrect(false);
      setPointAColor("#FFEB3B");
      setPointBColor("#FFEB3B");
      setPointALabelColor("white"); // White labels in step 3
      setPointBLabelColor("white"); // White labels in step 3
      setShowPointCircles(false);
      // Initialize circle colors to white when entering step 3
      // They will be set to green/red when user clicks
      setPointACircleColor("white");
      setPointBCircleColor("white");
      setRayName("");
    } else if (newStep === 4) {
      setLabelABlinking(true);
      setShowPointCircles(false);
      setPointAColor("#FFEB3B");
      setPointBColor("#FFEB3B");
      setPointALabelColor("white"); // Reset to white when moving to step 4
      setPointBLabelColor("white"); // Reset to white when moving to step 4
      // Reset circle colors when leaving step 3
      setPointACircleColor("white");
      setPointBCircleColor("white");
      setLabelBAnimationComplete(false); // Reset for step 5 animation
      // Ray name should already be "A_" from step 3
    } else if (newStep === 5) {
      setRayName("A_"); // Start with "A_" in step 5, will become "AB" after animation
      setLabelBAnimationComplete(false); // Reset for step 5 animation
      // Don't reset showArrowSymbol - it will be set when user clicks
      // setShowArrowSymbol(false);
      setShowArrowCircle(false);
      setLabelABlinking(false);
    } else if (newStep === 6) {
      setSelectedOption(null);
      setIsCorrect(false);
      setShowFeedback(false);
      setShowBAArrow(false);
      setBaArrowBlinking(false);
      setOriginalArrowColor("white");
      setOverlinedBlinking(false); // Stop blinking overlined div when moving to step 6
    }
  };

  useEffect(() => {
    resetStepStates(step);
  }, [step]); // Only reset when step actually changes, not on every render

  // Handle point drag in step 0
  const handlePointDrag = useCallback(
    (pointId, newPos) => {
      if (step !== 0 || step0SubStep !== "initial") return;
      // Snap to grid (grid spacing of 5 units)
      const snappedX = Math.round(newPos.x / 5) * 5;
      const snappedY = Math.round(newPos.y / 5) * 5;
      const snappedPos = { x: snappedX, y: snappedY };

      if (pointId === "A") {
        setPointAPos(snappedPos);
      } else {
        setPointBPos(snappedPos);
      }
    },
    [step, step0SubStep]
  );

  // Handle connect button click
  const handleConnectClick = useCallback(() => {
    if (step !== 0 || step0SubStep !== "initial") return;
    setStep0SubStep("connecting");
    // Animation will be handled in VisualPanel
    // Button will be disabled during animation (step0SubStep === "connecting")
  }, [step, step0SubStep]);

  // Handle animation complete (connect A to B)
  const handleConnectAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
    setShowLineSegmentAB(true);
    setShowDottedLine(true);
    setShowLineNameStep0(true); // Show line name div
    setStep0SubStep("connected");
  }, []);

  // Handle extend button click
  const handleExtendClick = useCallback(() => {
    if (step !== 0 || step0SubStep !== "connected") return;
    setShowLineNameStep0(false); // Hide line name div when Extend button is clicked
    setStep0SubStep("extending");
    // Animation will be handled in VisualPanel
    // Button will be disabled during animation (step0SubStep === "extending")
  }, [step, step0SubStep]);

  // Handle extend animation complete
  const handleExtendAnimationComplete = useCallback(() => {
    setExtendAnimationComplete(true);
    setShowLineSegmentBC(true);
    setStep0SubStep("extended");
  }, []);

  // Handle slider change
  const handleSliderChange = useCallback((value) => {
    setSliderValue(value);
    if (value === 2) {
      // Enable next button when slider reaches 2
      setStep0SubStep("slider");
    }
  }, []);

  // Handle starting point click in step 3
  const handleStartingPointClick = useCallback(
    (pointId) => {
      if (
        step !== 3 ||
        (selectedStartingPoint !== null && isStartingPointCorrect)
      )
        return;
      setSelectedStartingPoint(pointId);
      setShowStartingPointFeedback(true);
      const correct = pointId === "A";
      setIsStartingPointCorrect(correct);

      if (correct) {
        playSound("correct");
        setPointAColor("#4CAF50"); // Green point for correct
        setPointACircleColor("#4CAF50"); // Green circle for correct
        setPointALabelColor("#4CAF50"); // Green label for correct
        // Don't set rayName immediately - wait for animation to complete
        // setRayName("A_");
        // Trigger animation - VisualPanel will handle it
        setLabelAAnimationComplete(false); // Reset to trigger animation
      } else {
        playSound("wrong");
        setPointBColor("#F44336"); // Red point for wrong
        setPointBCircleColor("#F44336"); // Red circle for wrong
        setPointBLabelColor("#F44336"); // Red label for wrong
        // Don't auto-hide feedback - it persists until correct answer
        // Reset point B color after 1 second, but keep feedback visible
        setTimeout(() => {
          setPointBColor("#FFEB3B");
          setPointBCircleColor("white"); // Reset circle color
          setPointBLabelColor("white"); // Reset label color
        }, 1000);
        // Feedback stays visible - don't reset selectedStartingPoint or showStartingPointFeedback
      }
    },
    [step, selectedStartingPoint, isStartingPointCorrect]
  );

  // Handle arrow circle click in step 5
  const handleArrowCircleClick = useCallback(() => {
    if (step !== 5 || showArrowSymbol) return;
    playSound("click");
    setShowArrowSymbol(true);
    setShowArrowCircle(false); // Remove circle immediately when tapped
    setArrowBlinking(false); // Stop blinking arrow when clicked
    setOverlinedBlinking(true); // Start blinking overlined div
  }, [step, showArrowSymbol]);

  // Handle MCQ option click in step 6
  const handleOptionClick = useCallback(
    (option) => {
      if (step !== 6 || isCorrect) return;
      setSelectedOption(option);
      setShowFeedback(true);
      const correct =
        option === APP_DATA.step6.mcq.options[APP_DATA.step6.mcq.correctAnswer];
      setIsCorrect(correct);

      if (correct) {
        playSound("correct");
        setShowBAArrow(true);
        setBaArrowBlinking(true);
        setOriginalArrowColor("white");
      } else {
        playSound("wrong");
        setShowBAArrow(true);
        setOriginalArrowColor("gray");
      }
    },
    [step, isCorrect]
  );

  // Check if next button should be enabled
  const isNextEnabled = () => {
    if (step === -1) {
      return true; // Intro splash screen - always enabled
    } else if (step === 0) {
      return step0SubStep === "slider";
    } else if (step === 1) {
      return true;
    } else if (step === 2) {
      return true;
    } else if (step === 3) {
      return isStartingPointCorrect && labelAAnimationComplete; // Wait for animation to complete
    } else if (step === 4) {
      return true; // Enabled in step 4
    } else if (step === 5) {
      return showArrowSymbol;
    } else if (step === 6) {
      return isCorrect;
    } else if (step === 7) {
      return true; // Last step
    }
    return false;
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
      } else if (step === 7) {
        // Start Over - reset to step -1
        setStep(-1);
        setKey(Date.now());
        // Reset all states
        resetStepStates(-1);
        setStep0SubStep("initial");
        setAnimationComplete(false);
        setExtendAnimationComplete(false);
        setSliderValue(1);
        setShowDottedLine(false);
        setShowLineSegmentAB(false);
        setShowLineSegmentBC(false);
        setShowArrow(false);
        setArrowBlinking(false);
        setSelectedStartingPoint(null);
        setShowStartingPointFeedback(false);
        setIsStartingPointCorrect(false);
        setPointAColor("#FFEB3B");
        setPointBColor("#FFEB3B");
        setPointALabelColor("white"); // Always white
        setPointBLabelColor("white"); // Always white
        setShowPointCircles(false);
        setRayName("");
        setLabelABlinking(false);
        setShowArrowSymbol(false);
        setShowArrowCircle(false);
        setSelectedOption(null);
        setIsCorrect(false);
        setShowFeedback(false);
        setShowBAArrow(false);
        setBaArrowBlinking(false);
        setOriginalArrowColor("white");
      } else if (step < stepData.length) {
        setStep(step + 1);
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
      // Points positioned with one 10px up, one 10px down from center
      const pointAY = 35 - 10; // 10px up
      const pointBY = 35 + 10; // 10px down
      const pointAX = 30;
      const pointBX = 70;

      // Calculate arrow direction and position (like step 2)
      const arrowDx = pointBX - pointAX;
      const arrowDy = pointBY - pointAY;
      const arrowDist = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
      const ARROW_LENGTH = 13;
      const arrowRatio = ARROW_LENGTH / arrowDist;
      const angle = Math.atan2(arrowDy, arrowDx);
      const arrowHeadSize = 6;
      const arrowHeadAngle = Math.PI / 5;

      // Arrowhead tip position
      const arrowEnd = {
        x: pointBX + arrowDx * arrowRatio,
        y: pointBY + arrowDy * arrowRatio,
      };

      // Line should end slightly before arrowhead tip
      const lineEndOffset = arrowHeadSize * 0.5;
      const arrowLineEnd = {
        x: arrowEnd.x - lineEndOffset * Math.cos(angle),
        y: arrowEnd.y - lineEndOffset * Math.sin(angle),
      };

      // Arrowhead base points
      const arrowHead1 = {
        x: arrowEnd.x - arrowHeadSize * Math.cos(angle - arrowHeadAngle),
        y: arrowEnd.y - arrowHeadSize * Math.sin(angle - arrowHeadAngle),
      };
      const arrowHead2 = {
        x: arrowEnd.x - arrowHeadSize * Math.cos(angle + arrowHeadAngle),
        y: arrowEnd.y - arrowHeadSize * Math.sin(angle + arrowHeadAngle),
      };

      const svgContent = React.createElement(
        "svg",
        {
          viewBox: "0 0 100 70",
          className: "splash-svg",
          style: { width: "100%", height: "100%" },
        },
        // Line segment AB
        React.createElement("line", {
          x1: pointAX,
          y1: pointAY,
          x2: pointBX,
          y2: pointBY,
          stroke: "white",
          strokeWidth: 1.2,
        }),
        // Arrow from B (orange color, like step 2)
        React.createElement("line", {
          x1: pointBX,
          y1: pointBY,
          x2: arrowLineEnd.x,
          y2: arrowLineEnd.y,
          stroke: "#FF9800", // Orange color
          strokeWidth: 1.2,
        }),
        React.createElement("path", {
          d: `M ${arrowEnd.x} ${arrowEnd.y} L ${arrowHead1.x} ${arrowHead1.y} L ${arrowHead2.x} ${arrowHead2.y} Z`,
          fill: "#FF9800", // Orange color
        }),
        // Point A
        React.createElement("circle", {
          cx: pointAX,
          cy: pointAY,
          r: 3,
          fill: "#FFEB3B",
        }),
        React.createElement("circle", {
          cx: pointAX,
          cy: pointAY,
          r: 1.5,
          fill: "white",
        }),
        React.createElement(
          "text",
          {
            x: pointAX - 5,
            y: pointAY - 6,
            fill: "white",
            fontSize: 6,
            fontWeight: "bold",
            textAnchor: "middle",
          },
          "A"
        ),
        // Point B
        React.createElement("circle", {
          cx: pointBX,
          cy: pointBY,
          r: 3,
          fill: "#FFEB3B",
        }),
        React.createElement("circle", {
          cx: pointBX,
          cy: pointBY,
          r: 1.5,
          fill: "white",
        }),
        React.createElement(
          "text",
          {
            x: pointBX - 5,
            y: pointBY - 6,
            fill: "white",
            fontSize: 6,
            fontWeight: "bold",
            textAnchor: "middle",
          },
          "B"
        )
      );

      return React.createElement(SplashScreen, {
        svgContent,
        contentText: APP_DATA.stepIntro.contentText,
        boxes: null,
      });
    }

    if (step >= 0 && stepData[step] && stepData[step].showSplash) {
      // Step 7: Final splash screen
      if (step === 7) {
        // Use actual point positions from previous steps (where user placed them)
        // Calculate arrow direction and position (like step 2)
        const arrowDx = pointBPos.x - pointAPos.x;
        const arrowDy = pointBPos.y - pointAPos.y;
        const arrowDist = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
        const ARROW_LENGTH = 13;
        const arrowRatio = ARROW_LENGTH / arrowDist;
        const angle = Math.atan2(arrowDy, arrowDx);
        const arrowHeadSize = 6;
        const arrowHeadAngle = Math.PI / 5;

        // Arrowhead tip position
        const arrowEnd = {
          x: pointBPos.x + arrowDx * arrowRatio,
          y: pointBPos.y + arrowDy * arrowRatio,
        };

        // Line should end slightly before arrowhead tip
        const lineEndOffset = arrowHeadSize * 0.5;
        const arrowLineEnd = {
          x: arrowEnd.x - lineEndOffset * Math.cos(angle),
          y: arrowEnd.y - lineEndOffset * Math.sin(angle),
        };

        // Arrowhead base points
        const arrowHead1 = {
          x: arrowEnd.x - arrowHeadSize * Math.cos(angle - arrowHeadAngle),
          y: arrowEnd.y - arrowHeadSize * Math.sin(angle - arrowHeadAngle),
        };
        const arrowHead2 = {
          x: arrowEnd.x - arrowHeadSize * Math.cos(angle + arrowHeadAngle),
          y: arrowEnd.y - arrowHeadSize * Math.sin(angle + arrowHeadAngle),
        };

        const svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 70",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Dotted grey line extending through AB
          (() => {
            const dx = pointBPos.x - pointAPos.x;
            const dy = pointBPos.y - pointAPos.y;
            const extendLeft = -10;
            const extendRight = 110;
            let x1, y1, x2, y2;
            if (Math.abs(dx) < 0.001) {
              // Vertical line
              x1 = pointAPos.x;
              y1 = -10;
              x2 = pointAPos.x;
              y2 = 110;
            } else {
              const tLeft = (extendLeft - pointAPos.x) / dx;
              const tRight = (extendRight - pointAPos.x) / dx;
              x1 = extendLeft;
              y1 = pointAPos.y + dy * tLeft;
              x2 = extendRight;
              y2 = pointAPos.y + dy * tRight;
            }
            return React.createElement("line", {
              x1,
              y1,
              x2,
              y2,
              stroke: "gray",
              strokeWidth: 0.5,
              strokeDasharray: "1,1",
            });
          })(),
          // Line segment AB
          React.createElement("line", {
            x1: pointAPos.x,
            y1: pointAPos.y,
            x2: pointBPos.x,
            y2: pointBPos.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          // Arrow from B (orange color, like step 2)
          React.createElement("line", {
            x1: pointBPos.x,
            y1: pointBPos.y,
            x2: arrowLineEnd.x,
            y2: arrowLineEnd.y,
            stroke: "#FF9800", // Orange color
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${arrowEnd.x} ${arrowEnd.y} L ${arrowHead1.x} ${arrowHead1.y} L ${arrowHead2.x} ${arrowHead2.y} Z`,
            fill: "#FF9800", // Orange color
          }),
          // Point A - Yellow
          React.createElement("circle", {
            cx: pointAPos.x,
            cy: pointAPos.y,
            r: 3,
            fill: "#FFEB3B", // Yellow
          }),
          React.createElement("circle", {
            cx: pointAPos.x,
            cy: pointAPos.y,
            r: 1.5,
            fill: "white",
          }),
          React.createElement(
            "text",
            {
              x: pointAPos.x - 5,
              y: pointAPos.y - 6,
              fill: "#FFEB3B", // Yellow label
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "middle",
            },
            "A"
          ),
          // Point B - Blue
          React.createElement("circle", {
            cx: pointBPos.x,
            cy: pointBPos.y,
            r: 3,
            fill: "#2196F3", // Blue
          }),
          React.createElement("circle", {
            cx: pointBPos.x,
            cy: pointBPos.y,
            r: 1.5,
            fill: "white",
          }),
          React.createElement(
            "text",
            {
              x: pointBPos.x - 5,
              y: pointBPos.y - 6,
              fill: "#2196F3", // Blue label
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "middle",
            },
            "B"
          )
        );

        // Create ray name div for step 7
        // AB with A in yellow and B in blue
        const abWithColors = arrow(
          '<span style="color: #FFEB3B;display:inline;">A</span><span style="color: #2196F3;display:inline;">B</span>',
          true
        );
        const lineNameDiv = React.createElement(
          "div",
          {
            className: "line-name line-name-orange",
            style: {
              position: "absolute",
              width: "100%",
              top: 0,
              padding: "1vw",
            },
          },
          APP_DATA.rayLabel,
          React.createElement("span", {
            className: "line-segment-name-splash",
            dangerouslySetInnerHTML: { __html: abWithColors },
          })
        );

        return React.createElement(
          "div",
          { style: { position: "relative", width: "100%", height: "100%" } },
          React.createElement(SplashScreen, {
            svgContent,
            contentText: APP_DATA.step7.contentText,
            boxes: null,
          }),
          lineNameDiv
        );
      }
    } else {
      // Regular visual panel steps
      return React.createElement(VisualPanel, {
        key: key,
        step,
        pointAPos,
        pointBPos,
        isDragging: step === 0 ? isDragging : false,
        onPointDrag: step === 0 ? handlePointDrag : null,
        onDragStart:
          step === 0
            ? (pointId) => {
                setIsDragging(true);
                setDraggedPoint(pointId);
              }
            : null,
        onDragEnd:
          step === 0
            ? () => {
                setIsDragging(false);
                setDraggedPoint(null);
              }
            : null,
        draggedPoint: step === 0 ? draggedPoint : null,
        step0SubStep,
        onConnectClick: step === 0 ? handleConnectClick : null,
        animationComplete: step === 0 ? animationComplete : false,
        onConnectAnimationComplete:
          step === 0 ? handleConnectAnimationComplete : null,
        onExtendClick: step === 0 ? handleExtendClick : null,
        extendAnimationComplete: step === 0 ? extendAnimationComplete : false,
        onExtendAnimationComplete:
          step === 0 ? handleExtendAnimationComplete : null,
        sliderValue: step === 0 ? sliderValue : 1,
        onSliderChange: step === 0 ? handleSliderChange : null,
        showDottedLine,
        showLineSegmentAB,
        showLineSegmentBC,
        showLineNameStep0: step === 0 ? showLineNameStep0 : false,
        showArrow: step >= 2 ? showArrow : false,
        arrowBlinking: step === 2 || step === 5 ? arrowBlinking : false,
        selectedStartingPoint: step === 3 ? selectedStartingPoint : null,
        onStartingPointClick: step === 3 ? handleStartingPointClick : null,
        showStartingPointFeedback:
          step === 3 ? showStartingPointFeedback : false,
        isStartingPointCorrect: step === 3 ? isStartingPointCorrect : false,
        pointAColor: step === 3 ? pointAColor : "#FFEB3B",
        pointBColor: step === 3 ? pointBColor : "#FFEB3B",
        pointALabelColor: step === 3 ? pointALabelColor : "white", // Always white
        pointBLabelColor: step === 3 ? pointBLabelColor : "white", // Always white
        showPointCircles: step === 3 ? showPointCircles : false,
        pointACircleColor: step === 3 ? pointACircleColor : "white",
        pointBCircleColor: step === 3 ? pointBCircleColor : "white",
        labelABlinking: step === 4 ? labelABlinking : false,
        rayName: step >= 3 ? rayName : "",
        labelAAnimationComplete: step === 3 ? labelAAnimationComplete : false,
        labelBAnimationComplete: step === 5 ? labelBAnimationComplete : false,
        onLabelAAnimationComplete:
          step === 3
            ? () => {
                setRayName("A_");
                setLabelAAnimationComplete(true);
              }
            : null,
        onLabelBAnimationComplete:
          step === 5
            ? () => {
                setRayName("AB");
                setLabelBAnimationComplete(true);
                // After B animation completes, start blinking arrow and show circle
                setTimeout(() => {
                  setArrowBlinking(true);
                  setShowArrowCircle(true);
                }, 100);
              }
            : null,
        showArrowSymbol: step >= 5 ? showArrowSymbol : false, // Persist arrow symbol for steps 5+
        showArrowCircle: step === 5 ? showArrowCircle : false,
        onArrowCircleClick: step === 5 ? handleArrowCircleClick : null,
        selectedOption: step === 6 ? selectedOption : null,
        isCorrect: step === 6 ? isCorrect : false,
        showFeedback: step === 6 ? showFeedback : false,
        onOptionClick: step === 6 ? handleOptionClick : null,
        showBAArrow: step === 6 ? showBAArrow : false,
        baArrowBlinking: step === 6 ? baArrowBlinking : false,
        originalArrowColor: step === 6 ? originalArrowColor : "white",
        sliderValue: step >= 1 ? sliderValue : step === 0 ? sliderValue : 1, // Persist slider value
      });
    }
  };

  // Update MCQ content based on step state
  const getMCQContent = () => {
    if (step === 0) {
      if (step0SubStep === "initial" || step0SubStep === "connecting") {
        return APP_DATA.step0.infoText;
      } else if (step0SubStep === "connected") {
        return APP_DATA.step0.infoTextAfterConnect;
      } else if (step0SubStep === "extended" || step0SubStep === "slider") {
        return APP_DATA.step0.infoTextAfterExtend;
      }
    } else if (step === 1) {
      return APP_DATA.step1.infoText;
    } else if (step === 2) {
      return APP_DATA.step2.infoText;
    } else if (step === 3) {
      return APP_DATA.step3.infoText;
    } else if (step === 4) {
      return APP_DATA.step4.infoText;
    } else if (step === 5) {
      return showArrowSymbol
        ? APP_DATA.step5.infoTextAfter
        : APP_DATA.step5.infoText;
    } else if (step === 6) {
      return APP_DATA.step6.infoText;
    }
    return null;
  };

  // Update question text based on step state
  const getQuestionText = () => {
    if (step === -1) {
      return APP_DATA.stepIntro.question;
    } else if (step === 0) {
      return APP_DATA.step0.question;
    } else if (step === 1) {
      return APP_DATA.step1.question;
    } else if (step === 2) {
      return APP_DATA.step2.question;
    } else if (step === 3) {
      return APP_DATA.step3.question;
    } else if (step === 4) {
      return APP_DATA.step4.question;
    } else if (step === 5) {
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
      if (step0SubStep === "initial" || step0SubStep === "connecting") {
        return APP_DATA.step0.navText;
      } else if (step0SubStep === "connected") {
        return APP_DATA.step0.navTextAfterConnect;
      } else if (step0SubStep === "extended") {
        return APP_DATA.step0.navTextAfterExtend;
      } else if (step0SubStep === "slider") {
        return APP_DATA.step0.navTextAfterSlider;
      }
    } else if (step === 1) {
      return APP_DATA.step1.navText;
    } else if (step === 2) {
      return APP_DATA.step2.navText;
    } else if (step === 3) {
      return isStartingPointCorrect
        ? APP_DATA.step3.navTextAfter
        : APP_DATA.step3.navText;
    } else if (step === 4) {
      return APP_DATA.step4.navText;
    } else if (step === 5) {
      return showArrowSymbol
        ? APP_DATA.step5.navTextAfter
        : APP_DATA.step5.navText;
    } else if (step === 6) {
      return isCorrect ? APP_DATA.step6.navTextAfter : APP_DATA.step6.navText;
    } else if (step === 7) {
      return APP_DATA.step7.navText;
    }
    return "";
  };

  // Update showPointCircles when entering step 3
  useEffect(() => {
    if (step === 3) {
      setShowPointCircles(true);
      setRayName(""); // Start with empty name, will show "RAY" "__"
      // Circle colors are initialized in resetStepStates when entering step 3
      // They will be set to green/red when user clicks
    }
  }, [step]);

  // Update showArrow when entering step 2
  useEffect(() => {
    if (step === 2) {
      // Hide BC line segment and show arrow
      setShowLineSegmentBC(false);
      setShowArrow(true);
      setArrowBlinking(true);
      // Blink indefinitely until user moves to next step
    } else if (step !== 2) {
      // Stop blinking when leaving step 2
      setArrowBlinking(false);
    }
  }, [step]);

  // Update when entering step 5 - don't set rayName or show circle/blinking yet
  useEffect(() => {
    if (step === 5) {
      // Don't set rayName, circle, or blinking here - wait for B animation to complete
      // These will be set after B animation completes in onLabelBAnimationComplete
      setShowArrowCircle(false);
      setArrowBlinking(false);
    }
  }, [step]);

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
    }),
    step === -1 || (step >= 0 && stepData[step] && stepData[step].showSplash)
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
              content: getMCQContent(),
              mcqData: step === 6 ? APP_DATA.step6.mcq : null,
              selectedOption: step === 6 ? selectedOption : null,
              isCorrect: step === 6 ? isCorrect : false,
              onOptionClick: step === 6 ? handleOptionClick : null,
              showFeedback: step === 6 ? showFeedback : false,
              feedbackOverride:
                step === 3 && showStartingPointFeedback
                  ? isStartingPointCorrect
                    ? APP_DATA.step3.feedbackCorrect
                    : APP_DATA.step3.feedbackWrong
                  : null,
              showFeedbackOverride:
                step === 3 ? showStartingPointFeedback : false,
              isCorrectOverride:
                step === 3 ? isStartingPointCorrect : undefined,
              actionButtonText:
                step === 0 && step0SubStep === "initial"
                  ? APP_DATA.step0.actionButtonText
                  : step === 0 && step0SubStep === "connected"
                  ? APP_DATA.step0.actionButtonTextExtend
                  : null,
              onActionButtonClick:
                step === 0 && step0SubStep === "initial"
                  ? handleConnectClick
                  : step === 0 && step0SubStep === "connected"
                  ? handleExtendClick
                  : null,
              actionButtonDisabled:
                step === 0 &&
                (step0SubStep === "connecting" || step0SubStep === "extending"),
              sliderValue: step === 0 ? sliderValue : null,
              onSliderChange: step === 0 ? handleSliderChange : null,
              showSlider:
                step === 0 &&
                (step0SubStep === "extended" || step0SubStep === "slider"),
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
