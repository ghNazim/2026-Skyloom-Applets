const App = () => {
  const { useState, useCallback, useEffect } = React;

  const [step, setStep] = useState(-1);
  const [key, setKey] = useState(Date.now());

  // Point positions - A down 10px, B up 10px for diagonal
  const [pointAPos, setPointAPos] = useState({ x: 30, y: 45 }); // A down 10px
  const [pointBPos, setPointBPos] = useState({ x: 70, y: 25 }); // B up 10px
  const [pointPPos, setPointPPos] = useState(null); // For step 6
  const [pointQPos, setPointQPos] = useState(null); // For step 6

  // Step 0 states - Ray AB with arrow
  const [showDottedLine, setShowDottedLine] = useState(true); // Always show grey dotted line
  const [showLineSegmentAB, setShowLineSegmentAB] = useState(true);
  const [showArrow, setShowArrow] = useState(true); // White arrow from B
  const [pointAColor, setPointAColor] = useState("#FFEB3B"); // Yellow
  const [pointBColor, setPointBColor] = useState("#2196F3"); // Blue
  const [pointALabelColor, setPointALabelColor] = useState("#FFEB3B"); // Yellow
  const [pointBLabelColor, setPointBLabelColor] = useState("#2196F3"); // Blue

  // Step 1 states - Extend beyond A
  const [step1SubStep, setStep1SubStep] = useState("initial"); // "initial", "faded", "extended", "slider"
  const [showLineSegmentBC, setShowLineSegmentBC] = useState(false);
  const [showLineSegmentAE, setShowLineSegmentAE] = useState(false);
  const [extendAnimationComplete, setExtendAnimationComplete] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [arrowOpacity, setArrowOpacity] = useState(1); // For fading arrow

  // Step 3 states - Double arrows
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Step 4 states - Naming a Line
  const [lineName, setLineName] = useState("");
  const [firstPointTapped, setFirstPointTapped] = useState(null); // "A" or "B"
  const [secondPointTapped, setSecondPointTapped] = useState(false);
  const [showPointCircles, setShowPointCircles] = useState(false);
  const [showDoubleArrowCircle, setShowDoubleArrowCircle] = useState(false);
  const [showDoubleArrowSymbol, setShowDoubleArrowSymbol] = useState(false);
  const [labelAAnimationComplete, setLabelAAnimationComplete] = useState(false);
  const [labelBAnimationComplete, setLabelBAnimationComplete] = useState(false);
  const [doubleArrowAnimationComplete, setDoubleArrowAnimationComplete] =
    useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0); // Counter to trigger animations

  // Step 4 states - Blinking when double arrow appears
  const [lineSegmentNameBlinking, setLineSegmentNameBlinking] = useState(false);

  // Step 5 states - Show LINE AB or BA
  const [abBlinking, setAbBlinking] = useState(false);

  // Step 6 states - Line and Line Segment
  const [pointsPlaced, setPointsPlaced] = useState(0); // 0, 1, or 2
  const [showLineSegmentPQ, setShowLineSegmentPQ] = useState(false);
  const [arrowLength, setArrowLength] = useState(13); // For animating arrow length

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
      // Step 0: Show ray AB with arrow
      setShowDottedLine(true);
      setShowLineSegmentAB(true);
      setShowArrow(true);
      setShowLineSegmentBC(false);
      setShowLineSegmentAE(false);
      setPointAColor("#FFEB3B"); // Yellow
      setPointBColor("#2196F3"); // Blue
      setPointALabelColor("#FFEB3B"); // Yellow
      setPointBLabelColor("#2196F3"); // Blue
      setArrowOpacity(1);
      setStep1SubStep("initial");
      setExtendAnimationComplete(false);
      setSliderValue(1);
      setShowLeftArrow(false);
      setShowRightArrow(false);
    } else if (newStep === 1) {
      // Step 1: Immediately fade arrow and show BC
      // Keep B blue until extend button is clicked
      setArrowOpacity(0);
      setShowLineSegmentBC(true);
      setShowArrow(false);
      setStep1SubStep("faded");
      // Keep point B blue and labels colored in step 1 until extend button
      setPointBColor("#2196F3"); // Blue
      setPointALabelColor("#FFEB3B"); // Yellow
      setPointBLabelColor("#2196F3"); // Blue
    } else if (newStep === 2) {
      // Step 2: Keep visual state
    } else if (newStep === 3) {
      // Step 3: Hide BC and AE, show double arrows
      setShowLineSegmentBC(false);
      setShowLineSegmentAE(false);
      setShowLeftArrow(true);
      setShowRightArrow(true);
    } else if (newStep === 4) {
      // Step 4: Reset naming states
      setLineName("");
      setFirstPointTapped(null);
      setSecondPointTapped(false);
      setShowPointCircles(true);
      setShowACircle(true);
      setShowBCircle(true);
      setShowDoubleArrowCircle(false);
      setShowDoubleArrowSymbol(false);
      setLabelAAnimationComplete(true); // Start as true, set to false when tapped
      setLabelBAnimationComplete(true); // Start as true, set to false when tapped
      setDoubleArrowAnimationComplete(false);
      setAnimationTrigger(0); // Reset animation trigger
      setLineSegmentNameBlinking(false); // Reset blinking state
      // Labels become yellow when clicked in step 4
      // But start white (they were set white after extend button)
    } else if (newStep === 5) {
      // Step 5: Show LINE AB or BA
      setAbBlinking(true);
      setTimeout(() => setAbBlinking(false), 2000);
    } else if (newStep === 6) {
      // Step 6: Reset point placement
      setPointsPlaced(0);
      setPointPPos(null);
      setPointQPos(null);
      setShowLineSegmentPQ(false);
      setArrowLength(13);
      // Remove A and B points
      // Animate arrow length from 13 to 25
      const duration = 1000;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setArrowLength(13 + (25 - 13) * progress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  useEffect(() => {
    resetStepStates(step);
  }, [step]);

  // Handle extend button click in step 1
  const handleExtendClick = useCallback(() => {
    if (step !== 1 || step1SubStep !== "faded") return;
    setStep1SubStep("extending");
    // Animation will be handled in VisualPanel
  }, [step, step1SubStep]);

  // Handle extend animation complete (A to E)
  const handleExtendAnimationComplete = useCallback(() => {
    setExtendAnimationComplete(true);
    setShowLineSegmentAE(true);
    setPointBColor("#FFEB3B"); // Change B to yellow after extend
    setPointALabelColor("white"); // Both labels white after extend
    setPointBLabelColor("white");
    setStep1SubStep("extended");
    // Update info text and show slider
    setStep1SubStep("slider");
  }, []);

  // Handle slider change in step 1
  const handleSliderChange = useCallback((value) => {
    setSliderValue(value);
    if (value === 2) {
      setStep1SubStep("slider");
    }
  }, []);

  // Step 4: Track which circles are visible
  const [showACircle, setShowACircle] = useState(true);
  const [showBCircle, setShowBCircle] = useState(true);

  // Handle point tap in step 4
  const handlePointTap = useCallback(
    (pointId) => {
      if (step !== 4 || secondPointTapped) return;
      playSound("click");

      if (firstPointTapped === null) {
        // First point tapped - don't set lineName yet, wait for animation
        setFirstPointTapped(pointId);
        // Hide only the clicked circle
        if (pointId === "A") {
          setShowACircle(false);
          setLabelAAnimationComplete(false);
          setAnimationTrigger((prev) => prev + 1); // Trigger animation
        } else {
          setShowBCircle(false);
          setLabelBAnimationComplete(false);
          setAnimationTrigger((prev) => prev + 1); // Trigger animation
        }
      } else if (firstPointTapped !== pointId) {
        // Second point tapped - don't set lineName yet, wait for animation
        setSecondPointTapped(true);
        // Hide only the second clicked circle
        if (pointId === "A") {
          setShowACircle(false);
          setLabelAAnimationComplete(false);
          setAnimationTrigger((prev) => prev + 1); // Trigger animation
        } else {
          setShowBCircle(false);
          setLabelBAnimationComplete(false);
          setAnimationTrigger((prev) => prev + 1); // Trigger animation
        }
        // Show double arrow circle after second animation completes
      }
    },
    [step, firstPointTapped, secondPointTapped]
  );

  // Handle double arrow circle click in step 4
  const handleDoubleArrowClick = useCallback(() => {
    if (step !== 4 || showDoubleArrowSymbol) return;
    playSound("click");
    setShowDoubleArrowSymbol(true);
    setShowDoubleArrowCircle(false);
    setDoubleArrowAnimationComplete(true);
    // Blink the line-segment-name div
    setLineSegmentNameBlinking(true);
    setTimeout(() => setLineSegmentNameBlinking(false), 2000);
  }, [step, showDoubleArrowSymbol]);

  // Handle line click in step 6 to place points
  const handleLineClick = useCallback(
    (clickPos) => {
      if (step !== 6 || pointsPlaced >= 2) return;
      playSound("click");

      if (pointsPlaced === 0) {
        // Place first point P (yellow)
        setPointPPos(clickPos);
        setPointsPlaced(1);
      } else if (pointsPlaced === 1) {
        // Place second point Q (blue)
        setPointQPos(clickPos);
        setPointsPlaced(2);
        setShowLineSegmentPQ(true);
      }
    },
    [step, pointsPlaced]
  );

  // Check if next button should be enabled
  const isNextEnabled = () => {
    if (step === -1) {
      return true;
    } else if (step === 0) {
      return true;
    } else if (step === 1) {
      return step1SubStep === "slider" && sliderValue === 2;
    } else if (step === 2) {
      return true;
    } else if (step === 3) {
      return true;
    } else if (step === 4) {
      return showDoubleArrowSymbol && doubleArrowAnimationComplete;
    } else if (step === 5) {
      return true;
    } else if (step === 6) {
      return pointsPlaced === 2;
    } else if (step === 7) {
      return true;
    }
    return false;
  };

  // Handle navigation
  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (step === -1) {
        setStep(0);
        setKey(Date.now());
      } else if (step === 7) {
        // Start Over
        setStep(-1);
        setKey(Date.now());
        // Reset all states
        setPointAPos({ x: 30, y: 45 }); // A down 10px
        setPointBPos({ x: 70, y: 25 }); // B up 10px
        setPointPPos(null);
        setPointQPos(null);
        setShowDottedLine(true);
        setShowLineSegmentAB(true);
        setShowArrow(true);
        setShowLineSegmentBC(false);
        setShowLineSegmentAE(false);
        setPointAColor("#FFEB3B");
        setPointBColor("#2196F3");
        setPointALabelColor("#FFEB3B");
        setPointBLabelColor("#2196F3");
        setStep1SubStep("initial");
        setExtendAnimationComplete(false);
        setSliderValue(1);
        setArrowOpacity(1);
        setShowLeftArrow(false);
        setShowRightArrow(false);
        setLineName("");
        setFirstPointTapped(null);
        setSecondPointTapped(false);
        setShowPointCircles(false);
        setShowACircle(true);
        setShowBCircle(true);
        setShowDoubleArrowCircle(false);
        setShowDoubleArrowSymbol(false);
        setAbBlinking(false);
        setPointsPlaced(0);
        setShowLineSegmentPQ(false);
        setArrowLength(13);
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
      const pointAX = 30;
      const pointAY = 45; // A down 10px
      const pointBX = 70;
      const pointBY = 25; // B up 10px

      // Calculate arrow direction
      const arrowDx = pointBX - pointAX;
      const arrowDy = pointBY - pointAY;
      const arrowDist = Math.sqrt(arrowDx * arrowDx + arrowDy * arrowDy);
      const ARROW_LENGTH = 13;
      const arrowRatio = ARROW_LENGTH / arrowDist;
      const angle = Math.atan2(arrowDy, arrowDx);
      const arrowHeadSize = 6;
      const arrowHeadAngle = Math.PI / 5;

      const arrowEnd = {
        x: pointBX + arrowDx * arrowRatio,
        y: pointBY + arrowDy * arrowRatio,
      };

      const lineEndOffset = arrowHeadSize * 0.5;
      const arrowLineEnd = {
        x: arrowEnd.x - lineEndOffset * Math.cos(angle),
        y: arrowEnd.y - lineEndOffset * Math.sin(angle),
      };

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
        // Arrow from B
        React.createElement("line", {
          x1: pointBX,
          y1: pointBY,
          x2: arrowLineEnd.x,
          y2: arrowLineEnd.y,
          stroke: "white",
          strokeWidth: 1.2,
        }),
        React.createElement("path", {
          d: `M ${arrowEnd.x} ${arrowEnd.y} L ${arrowHead1.x} ${arrowHead1.y} L ${arrowHead2.x} ${arrowHead2.y} Z`,
          fill: "white",
        }),
        // Arrow from A (left side)
        React.createElement("line", {
          x1: pointAX,
          y1: pointAY,
          x2: pointAX - arrowDx * arrowRatio,
          y2: pointAY - arrowDy * arrowRatio,
          stroke: "white",
          strokeWidth: 1.2,
        }),
        React.createElement("path", {
          d: `M ${pointAX - arrowDx * arrowRatio} ${
            pointAY - arrowDy * arrowRatio
          } L ${
            pointAX -
            arrowDx * arrowRatio -
            arrowHeadSize * Math.cos(angle + Math.PI - arrowHeadAngle)
          } ${
            pointAY -
            arrowDy * arrowRatio -
            arrowHeadSize * Math.sin(angle + Math.PI - arrowHeadAngle)
          } L ${
            pointAX -
            arrowDx * arrowRatio -
            arrowHeadSize * Math.cos(angle + Math.PI + arrowHeadAngle)
          } ${
            pointAY -
            arrowDy * arrowRatio -
            arrowHeadSize * Math.sin(angle + Math.PI + arrowHeadAngle)
          } Z`,
          fill: "white",
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
        // Calculate arrow data for step 7 (similar to step 3)
        const dx = pointBPos.x - pointAPos.x;
        const dy = pointBPos.y - pointAPos.y;
        const ARROW_LENGTH = 13;
        const arrowHeadSize = 6;
        const arrowHeadAngle = Math.PI / 5;

        // Left arrow (from A to E)
        const extendLeft = -10;
        let pointE;
        if (Math.abs(dx) < 0.001) {
          pointE = { x: pointAPos.x, y: -10 };
        } else {
          const tLeft = (extendLeft - pointAPos.x) / dx;
          pointE = {
            x: extendLeft,
            y: pointAPos.y + dy * tLeft,
          };
        }
        const leftArrowDx = pointE.x - pointAPos.x;
        const leftArrowDy = pointE.y - pointAPos.y;
        const leftArrowDist = Math.sqrt(
          leftArrowDx * leftArrowDx + leftArrowDy * leftArrowDy
        );
        const leftArrowRatio = ARROW_LENGTH / leftArrowDist;
        const leftAngle = Math.atan2(leftArrowDy, leftArrowDx);
        const leftArrowEnd = {
          x: pointAPos.x + leftArrowDx * leftArrowRatio,
          y: pointAPos.y + leftArrowDy * leftArrowRatio,
        };
        const leftLineEndOffset = arrowHeadSize * 0.5;
        const leftLineEnd = {
          x: leftArrowEnd.x - leftLineEndOffset * Math.cos(leftAngle),
          y: leftArrowEnd.y - leftLineEndOffset * Math.sin(leftAngle),
        };
        const leftArrowHead1 = {
          x:
            leftArrowEnd.x -
            arrowHeadSize * Math.cos(leftAngle - arrowHeadAngle),
          y:
            leftArrowEnd.y -
            arrowHeadSize * Math.sin(leftAngle - arrowHeadAngle),
        };
        const leftArrowHead2 = {
          x:
            leftArrowEnd.x -
            arrowHeadSize * Math.cos(leftAngle + arrowHeadAngle),
          y:
            leftArrowEnd.y -
            arrowHeadSize * Math.sin(leftAngle + arrowHeadAngle),
        };

        // Right arrow (from B to C)
        const extendRight = 110;
        let pointC;
        if (Math.abs(dx) < 0.001) {
          pointC = { x: pointAPos.x, y: 110 };
        } else {
          const tRight = (extendRight - pointAPos.x) / dx;
          pointC = {
            x: extendRight,
            y: pointAPos.y + dy * tRight,
          };
        }
        const rightArrowDx = pointC.x - pointBPos.x;
        const rightArrowDy = pointC.y - pointBPos.y;
        const rightArrowDist = Math.sqrt(
          rightArrowDx * rightArrowDx + rightArrowDy * rightArrowDy
        );
        const rightArrowRatio = ARROW_LENGTH / rightArrowDist;
        const rightAngle = Math.atan2(rightArrowDy, rightArrowDx);
        const rightArrowEnd = {
          x: pointBPos.x + rightArrowDx * rightArrowRatio,
          y: pointBPos.y + rightArrowDy * rightArrowRatio,
        };
        const rightLineEndOffset = arrowHeadSize * 0.5;
        const rightLineEnd = {
          x: rightArrowEnd.x - rightLineEndOffset * Math.cos(rightAngle),
          y: rightArrowEnd.y - rightLineEndOffset * Math.sin(rightAngle),
        };
        const rightArrowHead1 = {
          x:
            rightArrowEnd.x -
            arrowHeadSize * Math.cos(rightAngle - arrowHeadAngle),
          y:
            rightArrowEnd.y -
            arrowHeadSize * Math.sin(rightAngle - arrowHeadAngle),
        };
        const rightArrowHead2 = {
          x:
            rightArrowEnd.x -
            arrowHeadSize * Math.cos(rightAngle + arrowHeadAngle),
          y:
            rightArrowEnd.y -
            arrowHeadSize * Math.sin(rightAngle + arrowHeadAngle),
        };

        // Dotted grey line
        const extendLeft2 = -10;
        const extendRight2 = 110;
        let x1, y1, x2, y2;
        if (Math.abs(dx) < 0.001) {
          x1 = pointAPos.x;
          y1 = -10;
          x2 = pointAPos.x;
          y2 = 110;
        } else {
          const tLeft = (extendLeft2 - pointAPos.x) / dx;
          const tRight = (extendRight2 - pointAPos.x) / dx;
          x1 = extendLeft2;
          y1 = pointAPos.y + dy * tLeft;
          x2 = extendRight2;
          y2 = pointAPos.y + dy * tRight;
        }

        const svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 70",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Dotted grey line
          React.createElement("line", {
            x1,
            y1,
            x2,
            y2,
            stroke: "gray",
            strokeWidth: 0.5,
            strokeDasharray: "1,1",
          }),
          // Line segment AB
          React.createElement("line", {
            x1: pointAPos.x,
            y1: pointAPos.y,
            x2: pointBPos.x,
            y2: pointBPos.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          // Left arrow
          React.createElement("line", {
            x1: pointAPos.x,
            y1: pointAPos.y,
            x2: leftLineEnd.x,
            y2: leftLineEnd.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${leftArrowEnd.x} ${leftArrowEnd.y} L ${leftArrowHead1.x} ${leftArrowHead1.y} L ${leftArrowHead2.x} ${leftArrowHead2.y} Z`,
            fill: "white",
          }),
          // Right arrow
          React.createElement("line", {
            x1: pointBPos.x,
            y1: pointBPos.y,
            x2: rightLineEnd.x,
            y2: rightLineEnd.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          React.createElement("path", {
            d: `M ${rightArrowEnd.x} ${rightArrowEnd.y} L ${rightArrowHead1.x} ${rightArrowHead1.y} L ${rightArrowHead2.x} ${rightArrowHead2.y} Z`,
            fill: "white",
          }),
          // Point A (yellow)
          React.createElement("circle", {
            cx: pointAPos.x,
            cy: pointAPos.y,
            r: 3,
            fill: "#FFEB3B",
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
              fill: "#FFEB3B",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "middle",
            },
            "A"
          ),
          // Point B (blue)
          React.createElement("circle", {
            cx: pointBPos.x,
            cy: pointBPos.y,
            r: 3,
            fill: "#2196F3",
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
              fill: "#2196F3",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "middle",
            },
            "B"
          )
        );

        return React.createElement(SplashScreen, {
          svgContent,
          contentText: APP_DATA.step7.contentText,
          boxes: null,
          visualPanelChildren: [
            // Top span: LINE AB (arrowed, colored)
            React.createElement("span", {
              key: "top-span",
              style: {
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "3vw",
                fontWeight: "bold",
                pointerEvents: "none",
                zIndex: 1000,
                color: "white",
              },
              dangerouslySetInnerHTML: {
                __html: "LINE " + doubleArrowColored(),
              },
            }),
            // Bottom span: LINE SEGMENT AB (overlined, colored)
            React.createElement("span", {
              key: "bottom-span",
              style: {
                position: "absolute",
                width: "100%",
                textAlign: "center",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "3vw",
                fontWeight: "bold",
                pointerEvents: "none",
                zIndex: 1000,
                color: "white",
              },
              dangerouslySetInnerHTML: {
                __html:
                  "LINE SEGMENT " +
                  `<ol><span style="color: #FFEB3B;">A</span>
        <span style="color: #2196F3;">B</span></ol>`,
              },
            }),
          ],
        });
      }
    } else {
      // Regular visual panel steps
      return React.createElement(VisualPanel, {
        key: key,
        step,
        pointAPos,
        pointBPos,
        pointPPos,
        pointQPos,
        showDottedLine,
        showLineSegmentAB,
        showLineSegmentBC,
        showLineSegmentAE,
        showArrow,
        arrowOpacity,
        pointAColor,
        pointBColor,
        pointALabelColor,
        pointBLabelColor,
        step1SubStep,
        onExtendClick: step === 1 ? handleExtendClick : null,
        extendAnimationComplete: step === 1 ? extendAnimationComplete : false,
        onExtendAnimationComplete:
          step === 1 ? handleExtendAnimationComplete : null,
        sliderValue: step >= 1 ? sliderValue : 1,
        onSliderChange: step === 1 ? handleSliderChange : null,
        showLeftArrow: (step >= 3 && step < 7) || step === 7 ? true : false,
        showRightArrow: (step >= 3 && step < 7) || step === 7 ? true : false,
        lineName: step >= 4 ? lineName : "",
        firstPointTapped: step === 4 ? firstPointTapped : null,
        secondPointTapped: step === 4 ? secondPointTapped : false,
        showPointCircles: step === 4 ? showPointCircles : false,
        showACircle: step === 4 ? showACircle : true,
        showBCircle: step === 4 ? showBCircle : true,
        onPointTap: step === 4 ? handlePointTap : null,
        showDoubleArrowCircle: step === 4 ? showDoubleArrowCircle : false,
        showDoubleArrowSymbol: step >= 4 ? showDoubleArrowSymbol : false,
        onDoubleArrowClick: step === 4 ? handleDoubleArrowClick : null,
        labelAAnimationComplete: step === 4 ? labelAAnimationComplete : false,
        labelBAnimationComplete: step === 4 ? labelBAnimationComplete : false,
        animationTrigger: step === 4 ? animationTrigger : 0,
        onLabelAAnimationComplete:
          step === 4
            ? () => {
                setLabelAAnimationComplete(true);
                if (firstPointTapped === "A") {
                  setPointALabelColor("#FFEB3B"); // Yellow
                  // Update lineName after animation completes
                  if (!secondPointTapped) {
                    setLineName("A_");
                  } else {
                    // Second point was already tapped, update to full name
                    setLineName("AB");
                    // Show double arrow circle after both animations complete
                    setTimeout(() => {
                      setShowDoubleArrowCircle(true);
                    }, 100);
                  }
                } else if (secondPointTapped && firstPointTapped === "B") {
                  // A was tapped second (B was first)
                  setPointALabelColor("#FFEB3B"); // Yellow for second point
                  // Update to full name
                  setLineName("BA");
                  // Show double arrow circle after both animations complete
                  setTimeout(() => {
                    setShowDoubleArrowCircle(true);
                  }, 100);
                }
              }
            : null,
        onLabelBAnimationComplete:
          step === 4
            ? () => {
                setLabelBAnimationComplete(true);
                if (firstPointTapped === "B") {
                  setPointBLabelColor("#FFEB3B"); // Yellow
                  // Update lineName after animation completes
                  if (!secondPointTapped) {
                    setLineName("B_");
                  } else {
                    // Second point was already tapped, update to full name
                    setLineName("BA");
                    // Show double arrow circle after both animations complete
                    setTimeout(() => {
                      setShowDoubleArrowCircle(true);
                    }, 100);
                  }
                } else if (secondPointTapped && firstPointTapped === "A") {
                  // B was tapped second
                  setPointBLabelColor("#FFEB3B"); // Yellow for second point
                  // Update to full name
                  setLineName("AB");
                  // Show double arrow circle after both animations complete
                  setTimeout(() => {
                    setShowDoubleArrowCircle(true);
                  }, 100);
                } else if (secondPointTapped && firstPointTapped === "B") {
                  // A was tapped second
                  setPointALabelColor("#FFEB3B"); // Yellow for second point
                  // Update to full name
                  setLineName("BA");
                  // Show double arrow circle after both animations complete
                  setTimeout(() => {
                    setShowDoubleArrowCircle(true);
                  }, 100);
                }
              }
            : null,
        lineSegmentNameBlinking: step === 4 ? lineSegmentNameBlinking : false,
        abBlinking: step === 5 ? abBlinking : false,
        pointsPlaced: step === 6 ? pointsPlaced : 0,
        showLineSegmentPQ: step === 6 ? showLineSegmentPQ : false,
        onLineClick: step === 6 ? handleLineClick : null,
        arrowLength: step === 6 ? arrowLength : 13,
      });
    }
  };

  // Update MCQ content based on step state
  const getMCQContent = () => {
    if (step === 0) {
      return APP_DATA.step0.infoText;
    } else if (step === 1) {
      if (step1SubStep === "faded" || step1SubStep === "extending") {
        return APP_DATA.step1.infoText;
      } else if (step1SubStep === "extended" || step1SubStep === "slider") {
        return APP_DATA.step1.infoTextAfterExtend;
      }
    } else if (step === 2) {
      return APP_DATA.step2.infoText;
    } else if (step === 3) {
      return APP_DATA.step3.infoText;
    } else if (step === 4) {
      if (!secondPointTapped) {
        return APP_DATA.step4.infoText;
      } else if (!showDoubleArrowSymbol) {
        return APP_DATA.step4.infoTextAfterFirstTap;
      } else {
        return APP_DATA.step4.infoTextAfterDoubleArrow;
      }
    } else if (step === 5) {
      return APP_DATA.step5.infoText;
    } else if (step === 6) {
      if (pointsPlaced < 2) {
        return APP_DATA.step6.infoText;
      } else {
        return APP_DATA.step6.infoTextAfterPoints;
      }
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
      return APP_DATA.stepIntro.navText;
    } else if (step === 0) {
      return APP_DATA.step0.navText;
    } else if (step === 1) {
      if (step1SubStep === "faded" || step1SubStep === "extending") {
        return APP_DATA.step1.navText;
      } else if (step1SubStep === "extended") {
        return APP_DATA.step1.navTextAfterExtend;
      } else if (step1SubStep === "slider") {
        return APP_DATA.step1.navTextAfterSlider;
      }
    } else if (step === 2) {
      return APP_DATA.step2.navText;
    } else if (step === 3) {
      return APP_DATA.step3.navText;
    } else if (step === 4) {
      if (!secondPointTapped) {
        return APP_DATA.step4.navText;
      } else if (!showDoubleArrowSymbol) {
        return APP_DATA.step4.navTextAfterFirstTap;
      } else {
        return APP_DATA.step4.navTextAfterDoubleArrow;
      }
    } else if (step === 5) {
      return APP_DATA.step5.navText;
    } else if (step === 6) {
      if (pointsPlaced < 2) {
        return APP_DATA.step6.navText;
      } else {
        return APP_DATA.step6.navTextAfterPoints;
      }
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
              mcqData: null,
              actionButtonText:
                step === 1 && step1SubStep === "faded"
                  ? APP_DATA.step1.actionButtonText
                  : null,
              onActionButtonClick:
                step === 1 && step1SubStep === "faded"
                  ? handleExtendClick
                  : null,
              actionButtonDisabled: step === 1 && step1SubStep === "extending",
              sliderValue: step === 1 ? sliderValue : null,
              onSliderChange: step === 1 ? handleSliderChange : null,
              showSlider:
                step === 1 &&
                (step1SubStep === "extended" || step1SubStep === "slider"),
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
        showTapGif: step === -1,
      })
    )
  );
};
