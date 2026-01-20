const App = () => {
  const { useState, useCallback, useEffect } = React;

  const [step, setStep] = useState(-1);
  const [key, setKey] = useState(Date.now());

  // Step 0 states - Scribble drawing
  const [scribblePath, setScribblePath] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [scribbleComplete, setScribbleComplete] = useState(false);
  const [showDragGif, setShowDragGif] = useState(true);
  const [pointAPos, setPointAPos] = useState({ x: 30, y: 35 });
  const [pointBPos, setPointBPos] = useState({ x: 70, y: 35 });

  // Step 1 states - MCQ
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scribbleColor, setScribbleColor] = useState("white");
  const [showStraightLine, setShowStraightLine] = useState(false);

  // Step 2 states - Animation
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showPointsOnLine, setShowPointsOnLine] = useState(false);
  const [showDottedLine, setShowDottedLine] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Step 3 states - Draggable points
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPoint, setDraggedPoint] = useState(null);
  const [pointMoved, setPointMoved] = useState(false);

  // Step 4 states - Naming
  const [clickedLabels, setClickedLabels] = useState({ A: false, B: false });
  const [lineSegmentName, setLineSegmentName] = useState("");
  const [showDashSymbol, setShowDashSymbol] = useState(false);
  const [showLineClickHint, setShowLineClickHint] = useState(false);

  // Step data structure for determining splash screens
  const stepData = [
    { showSplash: false }, // Step 0
    { showSplash: false }, // Step 1
    { showSplash: false }, // Step 2
    { showSplash: false }, // Step 3
    { showSplash: false }, // Step 4
    { showSplash: false }, // Step 5
    { showSplash: true }, // Step 6
  ];

  // Reset all states when step changes
  const resetStepStates = (newStep) => {
    if (newStep === 0) {
      setScribblePath("");
      setIsDrawing(false);
      setScribbleComplete(false);
      setShowDragGif(true);
      setPointAPos({ x: 30, y: 35 });
      setPointBPos({ x: 70, y: 35 });
    } else if (newStep === 1) {
      setSelectedOption(null);
      setIsCorrect(false);
      setShowFeedback(false);
      setScribbleColor("white");
      setShowStraightLine(false);
    } else if (newStep === 2) {
      setAnimationComplete(false);
      setShowPointsOnLine(false);
      setAnimationStarted(false);
      // Don't reset showDottedLine - it will be set when animation completes
    } else if (newStep === 3) {
      setIsDragging(false);
      setDraggedPoint(null);
      setPointMoved(false);
    } else if (newStep === 4) {
      setClickedLabels({ A: false, B: false });
      setLineSegmentName("");
      setShowDashSymbol(false);
      setShowLineClickHint(false);
    }
  };

  useEffect(() => {
    resetStepStates(step);
  }, [step]);

  // Handle scribble drawing start
  const handleScribbleStart = useCallback(
    (coords, startPoint) => {
      if (step !== 0 || scribbleComplete) return;
      setIsDrawing(true);
      setShowDragGif(false);
      const start = startPoint === "A" ? pointAPos : pointBPos;
      setScribblePath(`M ${start.x} ${start.y}`);
      playSound("click");
    },
    [step, scribbleComplete, pointAPos, pointBPos]
  );

  // Handle scribble drawing
  const handleScribbleDraw = useCallback(
    (coords) => {
      if (step !== 0 || !isDrawing || scribbleComplete) return;
      setScribblePath(
        (prev) => `${prev} L ${coords.x.toFixed(2)} ${coords.y.toFixed(2)}`
      );
    },
    [step, isDrawing, scribbleComplete]
  );

  // Handle scribble end
  const handleScribbleEnd = useCallback(
    (coords, endPoint) => {
      if (step !== 0 || !isDrawing || scribbleComplete) return;
      setIsDrawing(false);
      const end = endPoint === "A" ? pointAPos : pointBPos;
      setScribblePath((prev) => `${prev} L ${end.x} ${end.y}`);
      setScribbleComplete(true);
      playSound("correct");
      // Move to next step after a short delay
      setTimeout(() => {
        setStep(1);
        setKey(Date.now());
      }, 500);
    },
    [step, isDrawing, scribbleComplete, pointAPos, pointBPos]
  );

  // Handle MCQ option click in step 1
  const handleOptionClick = useCallback(
    (option) => {
      if (step !== 1 || isCorrect) return;
      setSelectedOption(option);
      setShowFeedback(true);
      const correct =
        option === APP_DATA.step1.mcq.options[APP_DATA.step1.mcq.correctAnswer];
      setIsCorrect(correct);

      if (correct) {
        playSound("correct");
        setScribbleColor("#4CAF50"); // Green
        setShowStraightLine(true);
      } else {
        playSound("wrong");
        setScribbleColor("#F44336"); // Red
        setShowStraightLine(true);
      }
    },
    [step, isCorrect]
  );

  // Handle point drag in step 3
  const handlePointDrag = useCallback(
    (pointId, newPos) => {
      if (step !== 3) return;
      if (pointId === "A") {
        setPointAPos(newPos);
      } else {
        setPointBPos(newPos);
      }
      if (!pointMoved) {
        setPointMoved(true);
      }
    },
    [step, pointMoved]
  );

  // Handle animation start
  const handleAnimationStart = useCallback(() => {
    setAnimationStarted(true);
  }, []);

  // Handle animation complete
  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
    setShowDottedLine(true);
  }, []);

  // Handle point label click in step 4
  const handleLabelClick = useCallback(
    (label) => {
      if (step !== 4 || clickedLabels[label]) return;
      playSound("click");
      setClickedLabels((prev) => ({ ...prev, [label]: true }));
      // Add label with underscore if only one label clicked, otherwise just add label
      const currentName = lineSegmentName;
      if (currentName === "") {
        setLineSegmentName(label + "_");
      } else {
        // Replace the underscore with the second label
        setLineSegmentName(currentName.replace("_", label));
      }
    },
    [step, clickedLabels, lineSegmentName]
  );

  // Handle line segment click in step 4
  const handleLineSegmentClick = useCallback(() => {
    if (step !== 4 || !clickedLabels.A || !clickedLabels.B || showDashSymbol)
      return;
    playSound("click");
    setShowDashSymbol(true);
    setShowLineClickHint(false);
  }, [step, clickedLabels, showDashSymbol]);

  // Check if next button should be enabled
  const isNextEnabled = () => {
    if (step === -1) {
      return true; // Intro splash screen - always enabled
    } else if (step === 0) {
      return scribbleComplete;
    } else if (step === 1) {
      return isCorrect;
    } else if (step === 2) {
      return animationComplete;
    } else if (step === 3) {
      return pointMoved;
    } else if (step === 4) {
      return showDashSymbol;
    } else if (step === 5) {
      return true;
    } else if (step === 6) {
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
      } else if (step === 6) {
        // Start Over - reset to step -1 and reset all states
        // Reset all states first
        setScribblePath("");
        setIsDrawing(false);
        setScribbleComplete(false);
        setShowDragGif(true);
        setPointAPos({ x: 30, y: 35 });
        setPointBPos({ x: 70, y: 35 });
        setSelectedOption(null);
        setIsCorrect(false);
        setShowFeedback(false);
        setScribbleColor("white");
        setShowStraightLine(false);
        setAnimationComplete(false);
        setShowPointsOnLine(false);
        setShowDottedLine(false);
        setAnimationStarted(false);
        setIsDragging(false);
        setDraggedPoint(null);
        setPointMoved(false);
        setClickedLabels({ A: false, B: false });
        setLineSegmentName("");
        setShowDashSymbol(false);
        setShowLineClickHint(false);
        // Then set step to -1
        setStep(-1);
        setKey(Date.now());
      } else if (step < stepData.length) {
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
      // Step -1: 9 points arranged diagonally with different colors, very close together
      const pointColors = [
        "#FFFFFF", // White
        "#808080", // Dark gray
        "#8B7355", // Brownish-gray
        "#F5F5DC", // Light beige/off-white
        "#FF9800", // Orange
        "#8B7355", // Brownish-gray
        "#808080", // Dark gray
        "#FFFFFF", // White
        "#FFEB3B", // Yellow (added for 9th point)
      ];
      const points = [];
      // Arrange 9 points diagonally from bottom-left to top-right, very close together
      // Points have radius 3, so diameter is 6. To have no visible gaps, spacing should be ~6
      const spacing = 6; // Minimal spacing to avoid gaps
      const startX = 25;
      const startY = 45;
      for (let i = 0; i < 9; i++) {
        const x = startX + i * spacing;
        const y = startY - i * (spacing * 0.4); // Diagonal arrangement
        points.push({ x, y, color: pointColors[i] });
      }

      const svgContent = React.createElement(
        "svg",
        {
          viewBox: "0 0 100 70",
          className: "splash-svg",
          style: { width: "100%", height: "100%" },
        },
        points.map((point, index) =>
          React.createElement(
            "g",
            { key: `point-${index}` },
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 3,
              fill: point.color,
            }),
            React.createElement("circle", {
              cx: point.x,
              cy: point.y,
              r: 1.5,
              fill: "white",
            })
          )
        )
      );

      return React.createElement(SplashScreen, {
        svgContent,
        contentText: APP_DATA.stepIntro.contentText,
        boxes: null,
      });
    }

    if (step >= 0 && stepData[step] && stepData[step].showSplash) {
      // Step 6: Final splash screen
      if (step === 6) {
        const svgContent = React.createElement(
          "svg",
          {
            viewBox: "0 0 100 70",
            className: "splash-svg",
            style: { width: "100%", height: "100%" },
          },
          // Line segment (no dotted line in final splash)
          React.createElement("line", {
            x1: pointAPos.x,
            y1: pointAPos.y,
            x2: pointBPos.x,
            y2: pointBPos.y,
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
              fill: "#4CAF50",
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
              fill: "#4CAF50",
              fontSize: 6,
              fontWeight: "bold",
              textAnchor: "start",
            },
            "B"
          )
        );

        // Create line name div for step 6
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
          APP_DATA.lineSegmentLabel,
          React.createElement(
            "span",
            {
              className: "line-segment-name",
            },
            React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "span",
                { className: "line-segment-name-overlined" },
                lineSegmentName
              ),
              APP_DATA.lineSegmentOr,
              React.createElement(
                "span",
                { className: "line-segment-name-overlined" },
                lineSegmentName === "AB" ? "BA" : "AB"
              )
            )
          )
        );

        return React.createElement(
          "div",
          { style: { position: "relative", width: "100%", height: "100%" } },
          React.createElement(SplashScreen, {
            svgContent,
            contentText: APP_DATA.step6.contentText,
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
        scribblePath,
        isDrawing,
        scribbleComplete,
        showDragGif: step === 0 ? showDragGif : false,
        onScribbleStart: step === 0 ? handleScribbleStart : null,
        onScribbleDraw: step === 0 ? handleScribbleDraw : null,
        onScribbleEnd: step === 0 ? handleScribbleEnd : null,
        scribbleColor: step === 1 ? scribbleColor : "white",
        showStraightLine: step === 1 ? showStraightLine : false,
        scribblePathForAnimation: step === 2 ? scribblePath : null,
        animationComplete: step === 2 ? animationComplete : false,
        onAnimationComplete: step === 2 ? handleAnimationComplete : null,
        showPointsOnLine: step === 2 ? showPointsOnLine : false,
        showDottedLine:
          step === 2 || step === 3 || step === 4 || step === 5
            ? showDottedLine
            : false,
        animationStarted: step === 2 ? animationStarted : false,
        onAnimationStart: step === 2 ? handleAnimationStart : null,
        isDragging: step === 3 ? isDragging : false,
        onPointDrag: step === 3 ? handlePointDrag : null,
        onDragStart:
          step === 3
            ? (pointId) => {
                setIsDragging(true);
                setDraggedPoint(pointId);
              }
            : null,
        onDragEnd:
          step === 3
            ? () => {
                setIsDragging(false);
                setDraggedPoint(null);
              }
            : null,
        draggedPoint: step === 3 ? draggedPoint : null,
        pointMoved: step === 3 ? pointMoved : false,
        clickedLabels: step === 4 ? clickedLabels : null,
        lineSegmentName: step === 4 || step === 5 ? lineSegmentName : "",
        showDashSymbol: step === 4 ? showDashSymbol : false,
        showLineClickHint: step === 4 ? showLineClickHint : false,
        onLabelClick: step === 4 ? handleLabelClick : null,
        onLineSegmentClick: step === 4 ? handleLineSegmentClick : null,
      });
    }
  };

  // Update MCQ content based on step state
  const getMCQContent = () => {
    if (step === 0) {
      return APP_DATA.step0.infoText;
    } else if (step === 2) {
      return APP_DATA.step2.infoText;
    } else if (step === 3) {
      return pointMoved
        ? APP_DATA.step3.infoTextAfter
        : APP_DATA.step3.infoText;
    } else if (step === 4) {
      if (showDashSymbol) {
        return APP_DATA.step4.infoTextFinal;
      } else if (clickedLabels.A && clickedLabels.B) {
        return APP_DATA.step4.infoTextAfter;
      }
      return APP_DATA.step4.infoText;
    } else if (step === 5) {
      return APP_DATA.step5.infoText;
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
    }
    return "";
  };

  const getNavText = () => {
    if (step === -1) {
      return APP_DATA.stepIntro.navText; // Empty string
    } else if (step === 0) {
      return APP_DATA.step0.navText;
    } else if (step === 1) {
      return isCorrect ? APP_DATA.step1.navTextAfter : APP_DATA.step1.navText;
    } else if (step === 2) {
      return APP_DATA.step2.navText;
    } else if (step === 3) {
      return pointMoved ? APP_DATA.step3.navTextAfter : APP_DATA.step3.navText;
    } else if (step === 4) {
      if (showDashSymbol) {
        return APP_DATA.step4.navTextFinal;
      } else if (clickedLabels.A && clickedLabels.B) {
        return APP_DATA.step4.navTextAfter;
      }
      return APP_DATA.step4.navText;
    } else if (step === 5) {
      return APP_DATA.step5.navText;
    } else if (step === 6) {
      return APP_DATA.step6.navText;
    }
    return "";
  };

  // Update showLineClickHint when both labels are clicked
  useEffect(() => {
    if (step === 4 && clickedLabels.A && clickedLabels.B && !showDashSymbol) {
      setShowLineClickHint(true);
    }
  }, [step, clickedLabels, showDashSymbol]);

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
              mcqData: step === 1 ? APP_DATA.step1.mcq : null,
              selectedOption: step === 1 ? selectedOption : null,
              isCorrect: step === 1 ? isCorrect : false,
              onOptionClick: step === 1 ? handleOptionClick : null,
              showFeedback: step === 1 ? showFeedback : false,
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
            : step === 6
            ? APP_DATA.navButtonStartOver
            : null,
        navText: getNavText(),
        showTapGif: step === -1, // Show tap GIF on next button in step -1
      })
    )
  );
};
