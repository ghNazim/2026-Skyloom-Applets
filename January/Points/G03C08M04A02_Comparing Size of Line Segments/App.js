const App = () => {
  const { useState, useCallback, useEffect, useRef } = React;

  const [step, setStep] = useState(-1);
  const [key, setKey] = useState(Date.now());

  // Point positions - 4 points: A, B, M, N
  const [pointAPos, setPointAPos] = useState({ x: 15, y: 25 });
  const [pointBPos, setPointBPos] = useState({ x: 75, y: 25 });
  const [pointMPos, setPointMPos] = useState({ x: 25, y: 50 });
  const [pointNPos, setPointNPos] = useState({ x: 70, y: 45 });

  // Step 0 states - Line drawing
  const [drawnLines, setDrawnLines] = useState([]); // Array of {start, end, color, isValid}
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPoint, setDrawStartPoint] = useState(null);
  const [drawCurrentCoords, setDrawCurrentCoords] = useState(null); // Current mouse position for straight line
  const [pointColors, setPointColors] = useState({
    A: "#FFEB3B",
    B: "#FFEB3B",
    M: "#FFEB3B",
    N: "#FFEB3B",
  }); // Yellow by default
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [validLinesDrawn, setValidLinesDrawn] = useState(0); // Count of valid lines (AM and AB)

  // Store timeout IDs to clear them when starting a new line
  const stabilizationTimeoutRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  // Step 1 states - Comparison animation and MCQ
  const [showCompareButton, setShowCompareButton] = useState(true);
  const [comparisonAnimationStarted, setComparisonAnimationStarted] =
    useState(false);
  const [comparisonAnimationComplete, setComparisonAnimationComplete] =
    useState(false);
  const [showGraphLine, setShowGraphLine] = useState(false);
  const [animatedLines, setAnimatedLines] = useState([]); // Lines in comparison view
  const [mcqPhase, setMcqPhase] = useState(0); // 0: no MCQ, 1: first MCQ (which is shorter), 2: second MCQ (which point is closer)
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalInfo, setShowFinalInfo] = useState(false);
  const [isReversing, setIsReversing] = useState(false);

  // Step data structure for determining splash screens
  const stepData = [
    { showSplash: false }, // Step 0
    { showSplash: false }, // Step 1
    { showSplash: false }, // Step 2
    { showSplash: false }, // Step 3
    { showSplash: true }, // Step 4
  ];

  // Reset all states when step changes
  const resetStepStates = (newStep) => {
    // Clear any pending timeouts
    if (stabilizationTimeoutRef.current) {
      clearTimeout(stabilizationTimeoutRef.current);
      stabilizationTimeoutRef.current = null;
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (newStep === 0 || newStep === 2) {
      // Step 0 and Step 2 are both line drawing steps
      setDrawnLines([]);
      setIsDrawing(false);
      setDrawStartPoint(null);
      setDrawCurrentCoords(null);
      setPointColors({
        A: "#FFEB3B",
        B: "#FFEB3B",
        M: "#FFEB3B",
        N: "#FFEB3B",
      });
      setFeedbackText("");
      setShowFeedback(false);
      setValidLinesDrawn(0);
    } else if (newStep === 1 || newStep === 3) {
      // Step 1 and Step 3 are both comparison/MCQ steps
      setShowCompareButton(true);
      setComparisonAnimationStarted(false);
      setComparisonAnimationComplete(false);
      setShowGraphLine(false);
      setAnimatedLines([]);
      setMcqPhase(0);
      setSelectedOption(null);
      setIsCorrect(false);
      setShowFinalInfo(false);
      setIsReversing(false);
    }
  };

  useEffect(() => {
    resetStepStates(step);
  }, [step]);

  // Get point position by name
  const getPointPos = (pointName) => {
    switch (pointName) {
      case "A":
        return pointAPos;
      case "B":
        return pointBPos;
      case "M":
        return pointMPos;
      case "N":
        return pointNPos;
      default:
        return null;
    }
  };

  // Get line name from two points
  const getLineName = (start, end) => {
    return `${start}${end}`.split("").sort().join("");
  };

  // Check if a line is valid based on current step
  const isValidLine = (start, end) => {
    const lineName = getLineName(start, end);
    if (step === 0) {
      // Step 0: AM or AB are valid
      return lineName === "AM" || lineName === "AB";
    } else if (step === 2) {
      // Step 2: MN or BN are valid
      return lineName === "MN" || lineName === "BN";
    }
    return false;
  };

  // Handle line drawing start (Step 0 and Step 2)
  const handleLineDrawStart = useCallback(
    (coords, startPoint) => {
      // Prevent drawing if not in correct step, already drawing, or feedback is showing
      if ((step !== 0 && step !== 2) || isDrawing || showFeedback) return;

      // Clear any pending timeouts from previous line
      if (stabilizationTimeoutRef.current) {
        clearTimeout(stabilizationTimeoutRef.current);
        stabilizationTimeoutRef.current = null;
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }

      // Reset any green lines back to their stabilized colors (blue/pink)
      setDrawnLines((prevLines) => {
        return prevLines.map((line, index) => {
          if (line.color === "#4CAF50" && line.isValid) {
            // Determine the stabilized color based on which valid line it is
            const validLinesBeforeThis = prevLines
              .slice(0, index)
              .filter((l) => l.isValid).length;
            const finalColor =
              validLinesBeforeThis === 0 ? "#4A90E2" : "#FF69B4";
            return { ...line, color: finalColor };
          }
          return line;
        });
      });

      // Clear feedback immediately
      setShowFeedback(false);
      setFeedbackText("");

      setIsDrawing(true);
      setDrawStartPoint(startPoint);
      const startPos = getPointPos(startPoint);
      if (startPos) {

        playSound("click");
      }
    },
    [step, isDrawing, showFeedback, pointAPos, pointBPos, pointMPos, pointNPos]
  );

  // Handle line drawing (Step 0 and Step 2)
  const handleLineDraw = useCallback(
    (coords) => {
      if ((step !== 0 && step !== 2) || !isDrawing || !drawStartPoint) return;
      setDrawCurrentCoords(coords); // Store current mouse position for straight line
    },
    [step, isDrawing, drawStartPoint]
  );

  // Handle line drawing end (Step 0 and Step 2)
  const handleLineDrawEnd = useCallback(
    (coords, endPoint) => {
      if ((step !== 0 && step !== 2) || !isDrawing || !drawStartPoint) return;
      setIsDrawing(false);

      const startPos = getPointPos(drawStartPoint);

      if (!startPos) {
        setDrawStartPoint(null);
        setDrawCurrentCoords(null);
        return;
      }

      // If no valid end point, just retract (don't create line)
      if (!endPoint) {
        setDrawStartPoint(null);
        setDrawCurrentCoords(null);
        return;
      }

      const endPos = getPointPos(endPoint);
      if (!endPos) {
        setDrawStartPoint(null);
        setDrawCurrentCoords(null);
        return;
      }

      // Check if line already exists
      const lineName = getLineName(drawStartPoint, endPoint);
      const lineExists = drawnLines.some(
        (line) => getLineName(line.start, line.end) === lineName
      );

      if (lineExists || drawStartPoint === endPoint) {
        setDrawStartPoint(null);
        setDrawCurrentCoords(null);
        return;
      }

      const isValid = isValidLine(drawStartPoint, endPoint);
      const newLine = {
        start: drawStartPoint,
        end: endPoint,
        startPos: { ...startPos },
        endPos: { ...endPos },
        color: isValid ? "#4CAF50" : "#F44336", // Green for valid, red for invalid
        isValid: isValid,
      };

      // Update point colors
      const newPointColors = { ...pointColors };
      if (isValid) {
        newPointColors[drawStartPoint] = "#4CAF50";
        newPointColors[endPoint] = "#4CAF50";
      } else {
        newPointColors[drawStartPoint] = "#F44336";
        newPointColors[endPoint] = "#F44336";
      }
      setPointColors(newPointColors);

      // Show feedback
      let feedback = "";
      const stepData = step === 0 ? APP_DATA.step0 : APP_DATA.step2;
      if (isValid) {
        if (validLinesDrawn === 0) {
          feedback = stepData.feedbackFirstCorrect;
        } else {
          feedback = stepData.feedbackSecondCorrect;
        }
      } else {
        feedback = stepData.feedbackWrong.replace(
          "{lineName}",
          `<ol>${lineName}</ol>`
        );
      }
      setFeedbackText(feedback);
      setShowFeedback(true);

      if (isValid) {
        playSound("correct");
        const currentValidCount = validLinesDrawn;
        setValidLinesDrawn(currentValidCount + 1);
        // Add line to drawn lines immediately with green color
        setDrawnLines([...drawnLines, newLine]);

        // After 2 seconds, remove green color and feedback, then stabilize with blue/pink
        stabilizationTimeoutRef.current = setTimeout(() => {
          // Change line color to blueish (first) or pinkish (second)
          const finalColor = currentValidCount === 0 ? "#4A90E2" : "#FF69B4";

          // Update the last line (the one we just added) to final color
          setDrawnLines((prevLines) => {
            const updated = [...prevLines];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              color: finalColor,
            };
            return updated;
          });

          // Reset point colors to default (use functional update to get current state)
          setPointColors((prevColors) => {
            const resetColors = { ...prevColors };
            resetColors[drawStartPoint] = "#FFEB3B";
            resetColors[endPoint] = "#FFEB3B";
            return resetColors;
          });

          // Fade out feedback smoothly
          setShowFeedback(false);
          // Clear feedback text after fade completes
          feedbackTimeoutRef.current = setTimeout(() => {
            setFeedbackText("");
            feedbackTimeoutRef.current = null;
          }, 300);
          stabilizationTimeoutRef.current = null;
        }, 2000);
      } else {
        playSound("wrong");
        // Add line temporarily for visual feedback
        setDrawnLines([...drawnLines, newLine]);

        // After 2 seconds, remove invalid line and reset point colors
        setTimeout(() => {
          setDrawnLines(drawnLines); // Remove the invalid line
          // Reset point colors to default (use functional update to get current state)
          setPointColors((prevColors) => {
            const resetColors = { ...prevColors };
            resetColors[drawStartPoint] = "#FFEB3B";
            resetColors[endPoint] = "#FFEB3B";
            return resetColors;
          });
          // Fade out feedback smoothly
          setShowFeedback(false);
          // Clear feedback text after fade completes
          setTimeout(() => {
            setFeedbackText("");
          }, 300);
        }, 2000);
      }

      // If both valid lines are drawn, move to next step after delay
      if (isValid && validLinesDrawn + 1 === 2) {
        setTimeout(() => {
          const nextStep = step === 0 ? 1 : 3; // Step 0 -> Step 1, Step 2 -> Step 3
          setStep(nextStep);
          setKey(Date.now());
        }, 2500);
      }

      setDrawStartPoint(null);
      setDrawCurrentCoords(null);
    },
    [step, isDrawing, drawStartPoint, drawnLines, pointColors, validLinesDrawn]
  );

  // Handle compare button click (Step 1 and Step 3)
  const handleCompareClick = useCallback(() => {
    if ((step !== 1 && step !== 3) || comparisonAnimationStarted) return;
    setShowCompareButton(false);
    playSound("click");

    // Initialize animated lines with original positions immediately
    const validLines = drawnLines.filter((line) => line.isValid);
    if (validLines.length === 2) {
      // Normalize lines so common point is always the start point
      const commonPoint = step === 1 ? "A" : "N";
      const normalizedLines = validLines.map((line) => {
        // If the common point is the end point, swap start and end
        if (line.end === commonPoint) {
          return {
            ...line,
            start: line.end,
            end: line.start,
            startPos: line.endPos,
            endPos: line.startPos,
          };
        }
        return line;
      });

      const initialAnimated = normalizedLines.map((line) => ({
        ...line,
        animatedStartX: line.startPos.x,
        animatedStartY: line.startPos.y,
        animatedEndX: line.endPos.x,
        animatedEndY: line.endPos.y,
      }));
      setAnimatedLines(initialAnimated);
    }

    // Start comparison animation
    setShowGraphLine(true);
    setComparisonAnimationStarted(true);

    // Mark animation complete after duration
    animationTimeoutRef.current = setTimeout(() => {
      setComparisonAnimationComplete(true);
      setMcqPhase(1); // Show first MCQ
      animationTimeoutRef.current = null;
    }, 1300);
  }, [step, comparisonAnimationStarted, drawnLines]);

  // Handle MCQ option click (Step 1 and Step 3)
  const handleOptionClick = useCallback(
    (option) => {
      if ((step !== 1 && step !== 3) || isCorrect) return;
      setSelectedOption(option);

      const stepData = step === 1 ? APP_DATA.step1 : APP_DATA.step3;
      let correct = false;
      if (mcqPhase === 1) {
        // First MCQ: Check answer based on step
        correct = option === stepData.mcq1.options[stepData.mcq1.correctAnswer];
      } else if (mcqPhase === 2) {
        // Second MCQ: Check answer based on step
        correct = option === stepData.mcq2.options[stepData.mcq2.correctAnswer];
      }

      setIsCorrect(correct);

      if (correct) {
        playSound("correct");
        if (mcqPhase === 1) {
          // After first MCQ is correct, trigger reverse animation
          
          setIsReversing(true);
          setComparisonAnimationComplete(false); // Stop showing static graph lines, switch to animated lines

          animationTimeoutRef.current = setTimeout(() => {
            // After animation completes
            setIsReversing(false);
            setComparisonAnimationStarted(false);
            setShowGraphLine(false);
            setAnimatedLines([]);

            // Change all lines to white for MCQ2
            const updatedLines = drawnLines.map((line) => ({
              ...line,
              color: "white",
            }));
            setDrawnLines(updatedLines);

            // Ensure all points are yellow
            setPointColors({
              A: "#FFEB3B",
              B: "#FFEB3B",
              M: "#FFEB3B",
              N: "#FFEB3B",
            });

            // Show second MCQ
            setMcqPhase(2);
            setSelectedOption(null);
            setIsCorrect(false);
            animationTimeoutRef.current = null;
          }, 1300);
        } else if (mcqPhase === 2) {
          // After second MCQ is correct, immediately show green points and lines
          // For step 1: Make AM green and points A and M green
          // For step 3: Make MN green and points M and N green
          const newPointColors = { ...pointColors };
          const targetLineName = step === 1 ? "AM" : "MN";
          const targetPoints = step === 1 ? ["A", "M"] : ["M", "N"];

          targetPoints.forEach((pt) => {
            newPointColors[pt] = "#4CAF50";
          });
          setPointColors(newPointColors);

          // Update target line to green immediately
          const updatedLines = drawnLines.map((line) => {
            const lineName = getLineName(line.start, line.end);
            if (lineName === targetLineName) {
              return { ...line, color: "#4CAF50" };
            }
            return line;
          });
          setDrawnLines(updatedLines);

          // Trigger reverse animation by clearing animated lines
          setShowGraphLine(false);
          setAnimatedLines([]);

          // After delay, show final info
          setTimeout(() => {
            setShowFinalInfo(true);
          }, 1300);
        }
      } else {
        playSound("wrong");
      }
    },
    [step, isCorrect, mcqPhase, pointColors, drawnLines]
  );

  // Check if next button should be enabled
  const isNextEnabled = () => {
    if (step === -1) {
      return true; // Intro splash screen - always enabled
    } else if (step === 0 || step === 2) {
      return false; // Step 0 and Step 2 auto-transitions, don't enable next button
    } else if (step === 1 || step === 3) {
      return showFinalInfo; // Final info shown
    } else if (step === 4) {
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
      } else if (step === 4) {
        // Start Over - reset to step -1
        setStep(-1);
        setKey(Date.now());
        resetStepStates(-1);
      } else if (step < stepData.length - 1) {
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
      // Create SVG with 4 points (A, B, M, N) with MN and AB joined
      // Calculate bounding box for all 4 points with padding
      const padding = 14;
      const minX =
        Math.min(pointAPos.x, pointBPos.x, pointMPos.x, pointNPos.x) - padding;
      const maxX =
        Math.max(pointAPos.x, pointBPos.x, pointMPos.x, pointNPos.x) + padding;
      const minY =
        Math.min(pointAPos.y, pointBPos.y, pointMPos.y, pointNPos.y) - padding;
      const maxY =
        Math.max(pointAPos.y, pointBPos.y, pointMPos.y, pointNPos.y) + padding;
      const rectWidth = maxX - minX;
      const rectHeight = maxY - minY;

      const svgContent = React.createElement(
        "svg",
        {
          viewBox: "0 0 100 70",
          className: "splash-svg",
          style: { width: "100%", height: "100%" },
        },
        // Greyish rectangle surrounding all points
        React.createElement("rect", {
          x: minX,
          y: minY,
          width: rectWidth,
          height: rectHeight,
          fill: "rgba(128, 128, 128, 0.2)",
          stroke: "rgba(200, 200, 200, 0.6)",
          strokeWidth: 0.5,
          strokeDasharray: "2,2",
          rx: 5,
          ry: 5,
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
        // Line segment MN
        React.createElement("line", {
          x1: pointMPos.x,
          y1: pointMPos.y,
          x2: pointNPos.x,
          y2: pointNPos.y,
          stroke: "white",
          strokeWidth: 1.2,
        }),
        // Point A
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
            fill: "white",
            fontSize: 6,
            fontWeight: "bold",
            textAnchor: "start",
          },
          "A"
        ),
        // Point B
        React.createElement("circle", {
          cx: pointBPos.x,
          cy: pointBPos.y,
          r: 3,
          fill: "#FFEB3B",
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
            fill: "white",
            fontSize: 6,
            fontWeight: "bold",
            textAnchor: "start",
          },
          "B"
        ),
        // Point M
        React.createElement("circle", {
          cx: pointMPos.x,
          cy: pointMPos.y,
          r: 3,
          fill: "#FFEB3B",
        }),
        React.createElement("circle", {
          cx: pointMPos.x,
          cy: pointMPos.y,
          r: 1.5,
          fill: "white",
        }),
        React.createElement(
          "text",
          {
            x: pointMPos.x - 5,
            y: pointMPos.y + 10,
            fill: "white",
            fontSize: 6,
            fontWeight: "bold",
            textAnchor: "start",
          },
          "M"
        ),
        // Point N
        React.createElement("circle", {
          cx: pointNPos.x,
          cy: pointNPos.y,
          r: 3,
          fill: "#FFEB3B",
        }),
        React.createElement("circle", {
          cx: pointNPos.x,
          cy: pointNPos.y,
          r: 1.5,
          fill: "white",
        }),
        React.createElement(
          "text",
          {
            x: pointNPos.x - 5,
            y: pointNPos.y + 10,
            fill: "white",
            fontSize: 6,
            fontWeight: "bold",
            textAnchor: "start",
          },
          "N"
        )
      );

      return React.createElement(SplashScreen, {
        svgContent,
        contentText: APP_DATA.stepIntro.contentText,
        boxes: null,
      });
    }

    if (step >= 0 && stepData[step] && stepData[step].showSplash) {
      // Step 4: Final splash screen
      if (step === 4) {
        // Calculate bounding box for all 4 points with padding
        const padding = 14;
        const minX =
          Math.min(pointAPos.x, pointBPos.x, pointMPos.x, pointNPos.x) -
          padding;
        const maxX =
          Math.max(pointAPos.x, pointBPos.x, pointMPos.x, pointNPos.x) +
          padding;
        const minY =
          Math.min(pointAPos.y, pointBPos.y, pointMPos.y, pointNPos.y) -
          padding;
        const maxY =
          Math.max(pointAPos.y, pointBPos.y, pointMPos.y, pointNPos.y) +
          padding;
        const rectWidth = maxX - minX;
        const rectHeight = maxY - minY;

        const svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 70",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Greyish rectangle surrounding all points
          React.createElement("rect", {
            x: minX,
            y: minY,
            width: rectWidth,
            height: rectHeight,
            fill: "rgba(128, 128, 128, 0.2)",
            stroke: "rgba(200, 200, 200, 0.6)",
            strokeWidth: 0.5,
            strokeDasharray: "2,2",
            rx: 5,
            ry: 5,
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
          // Line segment MN
          React.createElement("line", {
            x1: pointMPos.x,
            y1: pointMPos.y,
            x2: pointNPos.x,
            y2: pointNPos.y,
            stroke: "white",
            strokeWidth: 1.2,
          }),
          // Point A
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
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
            },
            "A"
          ),
          // Point B
          React.createElement("circle", {
            cx: pointBPos.x,
            cy: pointBPos.y,
            r: 3,
            fill: "#FFEB3B",
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
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
            },
            "B"
          ),
          // Point M
          React.createElement("circle", {
            cx: pointMPos.x,
            cy: pointMPos.y,
            r: 3,
            fill: "#FFEB3B",
          }),
          React.createElement("circle", {
            cx: pointMPos.x,
            cy: pointMPos.y,
            r: 1.5,
            fill: "white",
          }),
          React.createElement(
            "text",
            {
              x: pointMPos.x - 5,
              y: pointMPos.y + 10,
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
            },
            "M"
          ),
          // Point N
          React.createElement("circle", {
            cx: pointNPos.x,
            cy: pointNPos.y,
            r: 3,
            fill: "#FFEB3B",
          }),
          React.createElement("circle", {
            cx: pointNPos.x,
            cy: pointNPos.y,
            r: 1.5,
            fill: "white",
          }),
          React.createElement(
            "text",
            {
              x: pointNPos.x - 5,
              y: pointNPos.y + 10,
              fill: "white",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
            },
            "N"
          )
        );

        return React.createElement(SplashScreen, {
          svgContent,
          contentText: APP_DATA.step4.contentText,
          boxes: null,
        });
      }
    } else {
      // Regular visual panel steps
      return React.createElement(VisualPanel, {
        key: key,
        step,
        pointAPos,
        pointBPos,
        pointMPos,
        pointNPos,
        drawnLines,
        isDrawing,
        drawCurrentCoords,
        drawStartPoint,
        pointColors,
        feedbackText,
        showFeedback,
        onLineDrawStart: step === 0 || step === 2 ? handleLineDrawStart : null,
        onLineDraw: step === 0 || step === 2 ? handleLineDraw : null,
        onLineDrawEnd: step === 0 || step === 2 ? handleLineDrawEnd : null,
        showCompareButton: step === 1 || step === 3 ? showCompareButton : false,
        onCompareClick: step === 1 || step === 3 ? handleCompareClick : null,
        comparisonAnimationStarted:
          step === 1 || step === 3 ? comparisonAnimationStarted : false,
        comparisonAnimationComplete:
          step === 1 || step === 3 ? comparisonAnimationComplete : false,
        showGraphLine: step === 1 || step === 3 ? showGraphLine : false,
        animatedLines: step === 1 || step === 3 ? animatedLines : [],
        setAnimatedLines: step === 1 || step === 3 ? setAnimatedLines : null,
        isReversing: step === 1 || step === 3 ? isReversing : false,
      });
    }
  };

  // Update MCQ content based on step state
  // Only show content when no MCQ is displayed (step 0/2 or step 1/3 before MCQ appears)
  const getMCQContent = () => {
    if (step === 0) {
      return APP_DATA.step0.infoText;
    } else if (step === 1) {
      // Don't show content when MCQ is displayed
      if (mcqPhase > 0 || showFinalInfo) {
        return null;
      }
      return APP_DATA.step1.infoText;
    } else if (step === 2) {
      return APP_DATA.step2.infoText;
    } else if (step === 3) {
      // Don't show content when MCQ is displayed
      if (mcqPhase > 0 || showFinalInfo) {
        return null;
      }
      return APP_DATA.step3.infoText;
    }
    return null;
  };

  // Get MCQ data based on step and phase
  const getMCQData = () => {
    if (step === 1) {
      if (showFinalInfo) {
        // After MCQ2 is answered, show titleFinal but keep options (will be hidden)
        return {
          title: APP_DATA.step1.titleFinal,
          options: APP_DATA.step1.mcq2.options, // Keep options but they'll be hidden
        };
      } else if (mcqPhase === 1) {
        return APP_DATA.step1.mcq1;
      } else if (mcqPhase === 2) {
        return APP_DATA.step1.mcq2;
      }
    } else if (step === 3) {
      if (showFinalInfo) {
        // After MCQ2 is answered, show titleFinal but keep options (will be hidden)
        return {
          title: APP_DATA.step3.titleFinal,
          options: APP_DATA.step3.mcq2.options, // Keep options but they'll be hidden
        };
      } else if (mcqPhase === 1) {
        return APP_DATA.step3.mcq1;
      } else if (mcqPhase === 2) {
        return APP_DATA.step3.mcq2;
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
      if (mcqPhase === 1) {
        return "Which line segment is shorter?";
      } else if (showFinalInfo) {
        return APP_DATA.step1.questionFinal;
      } else if (mcqPhase === 2) {
        return APP_DATA.step0.question; // "Which point is closer to A - M or B?"
      }
      return APP_DATA.step1.question;
    } else if (step === 2) {
      return APP_DATA.step2.question;
    } else if (step === 3) {
      if (mcqPhase === 1) {
        return "Which line segment is longer?";
      } else if (showFinalInfo) {
        return APP_DATA.step3.questionFinal;
      } else if (mcqPhase === 2) {
        return APP_DATA.step2.question; // "Which point is farther away from N - M or B?"
      }
      return APP_DATA.step3.question;
    } else if (step === 4) {
      return APP_DATA.step4.question;
    }
    return "";
  };

  const getNavText = () => {
    if (step === -1) {
      return APP_DATA.stepIntro.navText; // Empty string
    } else if (step === 0) {
      return APP_DATA.step0.navText;
    } else if (step === 1) {
      if (showFinalInfo) {
        return APP_DATA.step1.navTextFinal;
      } else if (mcqPhase > 0) {
        return APP_DATA.step1.navTextAfter;
      }
      return APP_DATA.step1.navText;
    } else if (step === 2) {
      return APP_DATA.step2.navText;
    } else if (step === 3) {
      if (showFinalInfo) {
        return APP_DATA.step3.navTextFinal;
      } else if (mcqPhase > 0) {
        return APP_DATA.step3.navTextAfter;
      }
      return APP_DATA.step3.navText;
    } else if (step === 4) {
      return APP_DATA.step4.navText;
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
              mcqData: getMCQData(),
              selectedOption:
                (step === 1 || step === 3) && mcqPhase > 0
                  ? selectedOption
                  : null,
              isCorrect:
                (step === 1 || step === 3) && mcqPhase > 0 ? isCorrect : false,
              onOptionClick:
                (step === 1 || step === 3) && mcqPhase > 0
                  ? handleOptionClick
                  : null,
              showFeedback: false, // No feedback texts for MCQs
              showCompareButton:
                step === 1 || step === 3 ? showCompareButton : false,
              compareButtonText:
                step === 1 || step === 0
                  ? APP_DATA.step1.compareButtonText
                  : step === 3 || step === 2
                  ? APP_DATA.step3.compareButtonText
                  : null,
              onCompareClick:
                step === 1 || step === 3 ? handleCompareClick : null,
              showFinalInfo: step === 1 || step === 3 ? showFinalInfo : false,
              mcqPhase: step === 1 || step === 3 ? mcqPhase : 0,
              step: step,
              compareShown: step === 0 || step === 2 || (step ===1 && !mcqPhase) || (step === 3 && !mcqPhase)
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
            : step === 4
            ? APP_DATA.navButtonStartOver
            : null,
        navText: getNavText(),
        showTapGif: step === -1, // Show tap GIF on next button in step -1
      })
    )
  );
};
