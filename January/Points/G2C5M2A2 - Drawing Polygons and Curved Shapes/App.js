const App = () => {
  const { useState, useCallback, useEffect, useRef } = React;

  const [step, setStep] = useState(-1);
  const [key, setKey] = useState(Date.now());

  // Line drawing states
  const [drawnLines, setDrawnLines] = useState([]); // Array of {start, end, type, color}
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPoint, setDrawStartPoint] = useState(null);
  const [drawCurrentCoords, setDrawCurrentCoords] = useState(null);
  const [activeLineType, setActiveLineType] = useState(null); // "straight" or "curved"
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFeedbackCorrect, setIsFeedbackCorrect] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [wrongButtonType, setWrongButtonType] = useState(null); // Track which button is in wrong state
  const [isActivityComplete, setIsActivityComplete] = useState(false);

  // Store timeout IDs
  const feedbackTimeoutRef = useRef(null);

  // Point positions for Step 0 (Rectangle - 4 points: A bottom-left, B top-left, C top-right, D bottom-right)
  const step0Points = [
    { name: "A", x: 22, y: 52, labelPos: "bottom-left" },
    { name: "B", x: 22, y: 18, labelPos: "top-left" },
    { name: "C", x: 78, y: 18, labelPos: "top-right" },
    { name: "D", x: 78, y: 52, labelPos: "bottom-right" },
  ];

  // Point positions for Step 1 (Triangle - 3 points: A bottom-left, B top, C bottom-right)
  const step1Points = [
    { name: "A", x: 30, y: 52, labelPos: "bottom" },
    { name: "B", x: 50, y: 15, labelPos: "top" },
    { name: "C", x: 70, y: 52, labelPos: "bottom" },
  ];

  // Get current points based on step
  const getCurrentPoints = () => {
    if (step === 0) return step0Points;
    if (step === 1) return step1Points;
    return [];
  };

  // Reset states for a new step
  const resetStepStates = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    setDrawnLines([]);
    setIsDrawing(false);
    setDrawStartPoint(null);
    setDrawCurrentCoords(null);
    setActiveLineType(null);
    setFeedbackText("");
    setShowFeedback(false);
    setIsFeedbackCorrect(false);
    setShowWrongFeedback(false);
    setWrongButtonType(null);
    setIsActivityComplete(false);
  };

  useEffect(() => {
    resetStepStates();
  }, [step]);

  // Handle button click in ButtonsColumn
  const handleButtonClick = (type) => {
    if (isDrawing) return;
    
    // If clicking a different button while in wrong state, clear wrong feedback
    if (wrongButtonType && type !== wrongButtonType) {
      // Clear wrong feedback state
      setShowWrongFeedback(false);
      setWrongButtonType(null);
      setShowFeedback(false);
      setFeedbackText("");
      
      // Remove red lines (keep only valid lines)
      setDrawnLines((prevLines) => 
        prevLines.filter((line) => line.color !== "#F44336")
      );
    }
    
    // Don't allow clicking if this button is in wrong state
    if (wrongButtonType === type) {
      return;
    }
    
    playSound("click");
    setActiveLineType(type === activeLineType ? null : type);
  };

  // Get line name from two points
  const getLineName = (start, end) => {
    return `${start}${end}`.split("").sort().join("");
  };

  // Handle line drawing start
  const handleLineDrawStart = useCallback(
    (coords, startPoint) => {
      if (!activeLineType || isDrawing || showFeedback || wrongButtonType) return;
      setIsDrawing(true);
      setDrawStartPoint(startPoint);
      playSound("click");
    },
    [activeLineType, isDrawing, showFeedback, wrongButtonType]
  );

  // Handle line drawing
  const handleLineDraw = useCallback(
    (coords) => {
      if (!isDrawing || !drawStartPoint) return;
      setDrawCurrentCoords(coords);
    },
    [isDrawing, drawStartPoint]
  );

  // Handle line drawing end
  const handleLineDrawEnd = useCallback(
    (coords, endPoint) => {
      if (!isDrawing || !drawStartPoint) return;
      setIsDrawing(false);

      if (!endPoint) {
        // Line didn't end at a valid point - cancel
        setDrawStartPoint(null);
        setDrawCurrentCoords(null);
        setActiveLineType(null);
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
        setActiveLineType(null);
        return;
      }

      const currentLineType = activeLineType;
      const stepData = step === 0 ? APP_DATA.step0 : APP_DATA.step1;
      const requiredLines = stepData.requiredLines;

      // Step 0: Check for invalid lines (curved lines or diagonals)
      if (step === 0) {
        // Check for curved line - not allowed in polygon
        if (currentLineType === "curved") {
          playSound("wrong");
          setShowWrongFeedback(true);
          setWrongButtonType("curved"); // Mark curved button as wrong

          // Add line with red color (keep it visible)
          const wrongLine = {
            start: drawStartPoint,
            end: endPoint,
            type: currentLineType,
            color: "#F44336", // Red
          };
          setDrawnLines([...drawnLines, wrongLine]);

          // Show feedback for curved line (persist until button click)
          setFeedbackText(stepData.feedbackWrong);
          setShowFeedback(true);
          setIsFeedbackCorrect(false);

          // Don't auto-remove - wait for button click
          setActiveLineType(null);
          setDrawStartPoint(null);
          setDrawCurrentCoords(null);
          return;
        }

        // Check for diagonal lines (A-C or B-D) - not allowed
        const isDiagonal = lineName === "AC" || lineName === "BD";
        if (isDiagonal) {
          playSound("wrong");

          // Add line temporarily with red color
          const wrongLine = {
            start: drawStartPoint,
            end: endPoint,
            type: currentLineType,
            color: "#F44336", // Red
          };
          setDrawnLines([...drawnLines, wrongLine]);

          // After 0.5 seconds, remove the line (no button red, no feedback)
          feedbackTimeoutRef.current = setTimeout(() => {
            setDrawnLines(drawnLines); // Remove the wrong line
            setActiveLineType(null);
            feedbackTimeoutRef.current = null;
          }, 500);

          setDrawStartPoint(null);
          setDrawCurrentCoords(null);
          return;
        }
      }

      // Add the line
      playSound("tick");
      const newLine = {
        start: drawStartPoint,
        end: endPoint,
        type: currentLineType,
        color: "white",
      };
      const updatedLines = [...drawnLines, newLine];
      setDrawnLines(updatedLines);

      // Deselect button after drawing
      setActiveLineType(null);
      setDrawStartPoint(null);
      setDrawCurrentCoords(null);

      // Check if step is complete
      if (updatedLines.length === requiredLines) {
        // Step 1: Check if at least one curved line exists
        if (step === 1) {
          const hasCurvedLine = updatedLines.some(
            (line) => line.type === "curved"
          );
          if (!hasCurvedLine) {
            // All lines are straight - wrong
            playSound("wrong");
            setShowWrongFeedback(true);
            setWrongButtonType("straight"); // Mark straight button as wrong

            // Mark last line as red (keep it visible)
            const lastLineIndex = updatedLines.length - 1;
            updatedLines[lastLineIndex] = {
              ...updatedLines[lastLineIndex],
              color: "#F44336",
            };
            setDrawnLines([...updatedLines]);

            // Show feedback (persist until button click)
            setFeedbackText(stepData.feedbackWrong);
            setShowFeedback(true);
            setIsFeedbackCorrect(false);

            // Don't auto-remove - wait for button click
            setActiveLineType(null);
            return;
          }
        }

        // Shape completed - make all lines green
        const greenLines = updatedLines.map((line) => ({
          ...line,
          color: "#4CAF50", // Green
        }));
        setDrawnLines(greenLines);
        setIsActivityComplete(true);
        playSound("congrats");
      }
    },
    [step, activeLineType, isDrawing, drawStartPoint, drawnLines, showFeedback]
  );

  // Check if next button should be enabled
  const isNextEnabled = () => {
    if (step === -1) return true;
    if (step === 0) return isActivityComplete;
    if (step === 1) return isActivityComplete;
    return false;
  };

  // Handle navigation
  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (step === -1) {
        setStep(0);
        setKey(Date.now());
      } else if (step === 0) {
        setStep(1);
        setKey(Date.now());
      } else if (step === 1) {
        // Start Over
        setStep(-1);
        setKey(Date.now());
      }
    } else {
      playSound("click");
      if (step > -1) {
        setStep(step - 1);
        setKey(Date.now());
      }
    }
  };

  // Get question text
  const getQuestionText = () => {
    if (step === -1) return APP_DATA.stepIntro.question;
    if (step === 0) return APP_DATA.step0.question;
    if (step === 1) return APP_DATA.step1.question;
    return "";
  };

  // Get nav text
  const getNavText = () => {
    if (step === -1) return APP_DATA.stepIntro.navText;
    if (step === 0) {
      return isActivityComplete
        ? APP_DATA.step0.navTextComplete
        : APP_DATA.step0.navText;
    }
    if (step === 1) {
      return isActivityComplete
        ? APP_DATA.step1.navTextComplete
        : APP_DATA.step1.navText;
    }
    return "";
  };

  // Get next button text
  const getNextButtonText = () => {
    if (step === -1) return APP_DATA.navButtonStart;
    if (step === 1 && isActivityComplete) return APP_DATA.navButtonStartOver;
    return null;
  };

  // Render content based on step
  const renderContent = () => {
    if (step === -1) {
      // Splash screen
      return React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(SplashScreen, {
          contentText: APP_DATA.stepIntro.contentText,
        })
      );
    }

    // Drawing steps (0 and 1)
    return React.createElement(
      "div",
      { className: "app-main-content" },
      // Left column - Buttons
      React.createElement(
        "div",
        { className: "buttons-panel" },
        React.createElement(ButtonsColumn, {
          activeButton: activeLineType,
          onButtonClick: handleButtonClick,
          wrongButtonType: wrongButtonType,
        })
      ),
      // Right column - Visual
      React.createElement(
        "div",
        { className: "visual-panel" },
        React.createElement(VisualPanel, {
          key: key,
          step,
          points: getCurrentPoints(),
          drawnLines,
          isDrawing,
          drawCurrentCoords,
          drawStartPoint,
          activeLineType,
          feedbackText,
          showFeedback,
          isFeedbackCorrect,
          onLineDrawStart: handleLineDrawStart,
          onLineDraw: handleLineDraw,
          onLineDrawEnd: handleLineDrawEnd,
        })
      )
    );
  };

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      text2: step === 0 ? APP_DATA.step0.text2 :  null,
    }),
    renderContent(),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: !isNextEnabled(),
        isPrevDisabled: step === -1,
        nextButtonText: getNextButtonText(),
        navText: getNavText(),
        showTapGif: step === -1,
      })
    )
  );
};
