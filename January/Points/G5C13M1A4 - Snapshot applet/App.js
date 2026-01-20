const App = () => {
  const { useState, useCallback } = React;

  // Main state: current question index (0-2) and step (0, 1, 2, or 3)
  // step 0: Start screen
  // step 1: Division sentence input
  // step 2: Visual transfer
  // step 3: Final screen
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isTransferComplete, setIsTransferComplete] = useState(false);
  const [transfersDone, setTransfersDone] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleAnswerSubmit = useCallback((isCorrect) => {
    setIsAnswerCorrect(isCorrect);
  }, []);

  const handleTransferComplete = useCallback(() => {
    setIsTransferComplete(true);
  }, []);

  const handleTransferClick = useCallback(() => {
    setTransfersDone((prev) => prev + 1);
  }, []);

  const handleNav = (direction) => {
    playSound("click");

    if (direction === "next") {
      if (currentStep === 1 && isAnswerCorrect) {
        // Move to next question's step 1
        if (currentQuestionIndex < QUESTIONS.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setIsAnswerCorrect(false);
          setIsTransferComplete(false);
          setTransfersDone(0);
        } else {
          // All questions done, show final screen
          setCurrentStep(3); // Step 3 = Final screen
        }
      } else if (currentStep === 2 && isAnswerCorrect) {
        // After step 2 answer is correct, move to next question
        if (currentQuestionIndex < QUESTIONS.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setCurrentStep(1);
          setIsAnswerCorrect(false);
          setIsTransferComplete(false);
          setTransfersDone(0);
        } else {
          // All questions done, show final screen
          setCurrentStep(3); // Step 3 = Final screen
        }
      }
    }
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentQuestionIndex(0);
    setCurrentStep(0); // Go to start screen
    setIsAnswerCorrect(false);
    setIsTransferComplete(false);
    setTransfersDone(0);
  };

  const handleStart = () => {
    playSound("click");
    setCurrentQuestionIndex(0);
    setCurrentStep(1); // Start with first question
    setIsAnswerCorrect(false);
    setIsTransferComplete(false);
    setTransfersDone(0);
  };

  const handleSolveVisually = () => {
    playSound("click");
    setCurrentStep(2);
    setIsAnswerCorrect(false);
  };

  function getNavText() {
    if (currentStep === 0 || currentStep === 3) {
      return ""; // No nav text on Start/Final screens
    }
    if (currentStep === 1) {
      return APP_DATA.nav.step1;
    }
    if (currentStep === 2) {
      if (isTransferComplete && isAnswerCorrect) {
        return APP_DATA.nav.next;
      }
      if (isTransferComplete) {
        return APP_DATA.nav.step1;
      }
      return APP_DATA.nav.step2;
    }
    return "";
  }

  function getQuestionText() {
    if (currentStep === 0 || currentStep === 3) {
      return "";
    }
    return APP_DATA.question(
      currentQuestion.total,
      currentQuestion.box_count,
      currentQuestion.type,
      currentQuestion.result
    );
  }

  function isNextDisabled() {
    if (currentStep === 0 || currentStep === 3) {
      return true; // Disabled on Start/Final screens
    }
    if (currentStep === 1) {
      return !isAnswerCorrect;
    }
    if (currentStep === 2) {
      return !isAnswerCorrect || !isTransferComplete;
    }
    return true;
  }

  function isPrevDisabled() {
    return true; // Always disabled as per requirements
  }

  // Show Start screen at step 0
  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Start, {
          onButtonClick: handleStart,
        })
      )
    );
  }

  // Show Final screen at step 3
  if (currentStep === 3) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Final, {
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
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        question: currentQuestion,
        step: currentStep,
        onAnswerSubmit: handleAnswerSubmit,
        onTransferComplete: handleTransferComplete,
        onTransferClick: handleTransferClick,
        onSolveVisually: handleSolveVisually,
        transfersDone: transfersDone,
        isAnswerCorrect: isAnswerCorrect,
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
      })
    )
  );
};
