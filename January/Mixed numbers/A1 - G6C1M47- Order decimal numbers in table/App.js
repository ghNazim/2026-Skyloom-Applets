const App = () => {
  const { useState, useCallback, useRef } = React;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentStep, setCurrentStep] = useState(0); // 0: start, 1: questions, 2: final
  const [isCorrectCurrent, setIsCorrectCurrent] = useState(false);
  const [showHint, setShowHint] = useState(false); // whether hint btn is visible
  const [isHintMode, setIsHintMode] = useState(false); // big table mode
  const [selectedRow, setSelectedRow] = useState(null);
  const [arrangement, setArrangement] = useState([]); // current order of numbers
  const [feedbackType, setFeedbackType] = useState(null); // 'correct', 'wrong', or null
  const [hasSubmittedWrong, setHasSubmittedWrong] = useState(false);
  const [hintUsedThisQuestion, setHintUsedThisQuestion] = useState(false);
  const [animatingRowValue, setAnimatingRowValue] = useState(null); // Track which row value is animating

  const questions = APP_DATA.questions;
  const totalQuestions = questions.length;

  const getCurrentQuestion = () => questions[currentQuestion];

  // Initialize arrangement when question changes
  React.useEffect(() => {
    const q = questions[currentQuestion];
    if (q) {
      setArrangement([...q.numbers]);
    }
    setSelectedRow(null);
    setFeedbackType(null);
    setIsCorrectCurrent(false);
    setShowHint(false);
    // For first question (index 0), default to big table (hint mode)
    // For others, default to small table
    setIsHintMode(currentQuestion === 0);
    setHasSubmittedWrong(false);
    setHintUsedThisQuestion(false);
  }, [currentQuestion]);

  const handleRowClick = useCallback((index) => {
    if (isCorrectCurrent) return;

    // If there's feedback showing, clear it when user starts interacting again
    if (feedbackType === "wrong") {
      setFeedbackType(null);
    }

    if (selectedRow === index) {
      setSelectedRow(null);
    } else {
      setSelectedRow(index);
    }
  }, [isCorrectCurrent, selectedRow, feedbackType]);

  const handleSwap = useCallback((targetIndex) => {
    if (selectedRow === null || selectedRow === targetIndex) return;
    playSound("click");
    
    setArrangement(prev => {
      const newArr = [...prev];
      const selectedValue = newArr[selectedRow];
      
      // Track which row is animating
      setAnimatingRowValue(selectedValue);
      
      // Remove the selected row from its current position
      newArr.splice(selectedRow, 1);
      
      // Calculate the new position based on where the button was placed
      let newIndex;
      if (targetIndex < selectedRow) {
        // Button was above target row, move selected row to that position (above target)
        // After removing selectedRow, targetIndex remains the same
        newIndex = targetIndex;
      } else {
        // Button was below target row, move selected row to position below target
        // After removing selectedRow, targetIndex becomes targetIndex - 1
        // To place below the target, insert at (targetIndex - 1) + 1 = targetIndex
        newIndex = targetIndex;
      }
      
      // Insert the selected row at the new position
      newArr.splice(newIndex, 0, selectedValue);
      
      return newArr;
    });
    
    setSelectedRow(null);
    
    // Clear animating row after animation completes
    setTimeout(() => {
      setAnimatingRowValue(null);
    }, 500);
  }, [selectedRow]);

  const handleCheck = useCallback(() => {
    if (isCorrectCurrent) return;
    const q = getCurrentQuestion();
    const sorted = [...q.numbers].sort((a, b) =>
      q.arrangement === "s2l" ? a - b : b - a
    );

    const isCorrect = arrangement.every((val, i) => val === sorted[i]);

    if (isCorrect) {
      setFeedbackType("correct");
      setIsCorrectCurrent(true);
      setSelectedRow(null);
      playSound("correct");
    } else {
      setFeedbackType("wrong");
      setHasSubmittedWrong(true);
      if (!hintUsedThisQuestion) {
        setShowHint(true);
      }
      setSelectedRow(null);
      playSound("wrong");
    }
  }, [isCorrectCurrent, arrangement, currentQuestion, hintUsedThisQuestion]);

  const handleHint = useCallback(() => {
    setIsHintMode(true);
    setShowHint(false);
    setHintUsedThisQuestion(true);
    setFeedbackType(null);
    playSound("click");
  }, []);

  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (currentStep === 1 && isCorrectCurrent) {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setCurrentStep(2);
        }
      }
    } else if (direction === "prev") {
      playSound("click");
      if (currentStep === 1 && currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
    }
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setCurrentQuestion(0);
  };

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
    setCurrentQuestion(0);
  };

  function getNavText() {
    if (currentStep === 0 || currentStep === 2) return "";
    if (currentStep === 1) {
      if (isCorrectCurrent) {
        if (currentQuestion < totalQuestions - 1) {
          return APP_DATA.step1.navTextNext;
        } else {
          return APP_DATA.step1.navTextComplete;
        }
      }
      return APP_DATA.step1.navText;
    }
    return "";
  }

  function getQuestionText() {
    if (currentStep === 0 || currentStep === 2) return "";
    if (currentStep === 1) {
      const q = getCurrentQuestion();
      return q.arrangement === "s2l"
        ? APP_DATA.step1.questionS2L
        : APP_DATA.step1.questionL2S;
    }
    return "";
  }

  function isNextDisabled() {
    if (currentStep === 0 || currentStep === 2) return true;
    if (currentStep === 1) return !isCorrectCurrent;
    return true;
  }

  function isPrevDisabled() {
    if (currentStep === 0 || currentStep === 2) return true;
    if (currentStep === 1) return currentQuestion === 0;
    return false;
  }

  function getCorrectFeedbackText() {
    const q = getCurrentQuestion();
    return q.arrangement === "s2l"
      ? APP_DATA.correctFeedbackS2L
      : APP_DATA.correctFeedbackL2S;
  }

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        })
      )
    );
  }

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleStartOver,
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        question: getCurrentQuestion(),
        questionIndex: currentQuestion,
        totalQuestions: totalQuestions,
        isCorrectCurrent: isCorrectCurrent,
        selectedRow: selectedRow,
        arrangement: arrangement,
        feedbackType: feedbackType,
        showHint: showHint,
        isHintMode: isHintMode,
        hasSubmittedWrong: hasSubmittedWrong,
        animatingRowValue: animatingRowValue,
        onRowClick: handleRowClick,
        onSwap: handleSwap,
        onCheck: handleCheck,
        onHint: handleHint,
        correctFeedbackText: getCorrectFeedbackText(),
        wrongFeedbackText: APP_DATA.wrongFeedback,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: handleNav,
        isNextDisabled: isNextDisabled(),
        isPrevDisabled: isPrevDisabled(),
        navText: getNavText(),
        totalDots: totalQuestions,
        currentDot: currentQuestion + 1,
      })
    )
  );
};
