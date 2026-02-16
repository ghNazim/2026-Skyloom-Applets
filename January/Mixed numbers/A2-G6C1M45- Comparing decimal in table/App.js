const App = () => {
  const { useState, useCallback, useRef, useEffect } = React;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  // Steps: 0=start fullscreen, 1=show numbers, 2=align decimals, 3=compare digits, 4=final fullscreen

  // Step 2 sub-state
  const [alignPhase, setAlignPhase] = useState(0);
  // 0: highlight first decimal box, 1: first clicked - show row1 & highlight second, 2: both clicked - show both rows

  // Step 3 sub-state
  const [compareIndex, setCompareIndex] = useState(0); // which place we're comparing
  const [comparisonOperator, setComparisonOperator] = useState(null); // what user selected in comparison row
  const [comparisonDone, setComparisonDone] = useState(false); // final comparison done for this question
  const [feedbackText, setFeedbackText] = useState(""); // text-row feedback
  const [showFeedbackBox, setShowFeedbackBox] = useState(false); // small feedback box next to buttons
  const [feedbackBoxCorrect, setFeedbackBoxCorrect] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [leftOperatorValue, setLeftOperatorValue] = useState(""); // operator in left column
  const [animatingSymbol, setAnimatingSymbol] = useState(false);

  const wrongFeedbackTimeoutRef = useRef(null);

  const questions = APP_DATA.questions;
  const totalQuestions = questions.length;

  const getCurrentQuestion = () => questions[currentQuestion];

  // Reset states when question changes
  useEffect(() => {
    setAlignPhase(0);
    setCompareIndex(0);
    setComparisonOperator(null);
    setComparisonDone(false);
    setFeedbackText("");
    setShowFeedbackBox(false);
    setFeedbackBoxCorrect(false);
    setButtonsDisabled(false);
    setLeftOperatorValue("");
    setAnimatingSymbol(false);
    clearTimeout(wrongFeedbackTimeoutRef.current);
  }, [currentQuestion]);

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
    setCurrentQuestion(0);
  };

  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setCurrentQuestion(0);
  };

  const handleNav = (direction) => {
    if (direction === "next") {
      playSound("click");
      if (currentStep === 1) {
        setCurrentStep(2);
        setAlignPhase(0);
      } else if (currentStep === 2 && alignPhase === 2) {
        setCurrentStep(3);
        setCompareIndex(0);
        setComparisonOperator(null);
        setComparisonDone(false);
        setFeedbackText("");
        setShowFeedbackBox(false);
        setButtonsDisabled(false);
        setLeftOperatorValue("");
      } else if (currentStep === 3 && comparisonDone) {
        // Move to next question or final
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setCurrentStep(1);
        } else {
          setCurrentStep(4);
        }
      }
    } else if (direction === "prev") {
      playSound("click");
      if (currentStep === 1 && currentQuestion > 0) {
        // Go back to previous question
        setCurrentQuestion(currentQuestion - 1);
        setCurrentStep(1);
      } else if (currentStep === 2) {
        setCurrentStep(1);
      } else if (currentStep === 3) {
        setCurrentStep(2);
        setAlignPhase(2);
      }
    }
  };

  // Step 2: clicking decimal boxes
  const handleDecimalBoxClick = useCallback((boxIndex) => {
    if (currentStep !== 2) return;
    if (alignPhase === 0 && boxIndex === 0) {
      playSound("click");
      setAlignPhase(1);
    } else if (alignPhase === 1 && boxIndex === 1) {
      playSound("click");
      setAlignPhase(2);
    }
  }, [currentStep, alignPhase]);

  // Step 3: user clicks operator button in comparison row
  const handleComparisonSelect = useCallback((op) => {
    if (buttonsDisabled || comparisonDone) return;

    // Clear any existing timeout from a previous wrong answer
    if (wrongFeedbackTimeoutRef.current) {
      clearTimeout(wrongFeedbackTimeoutRef.current);
      wrongFeedbackTimeoutRef.current = null;
    }

    const q = getCurrentQuestion();
    const place = q.places[compareIndex];
    const d1 = place.d1;
    const d2 = place.d2;

    // Determine correct operator for this place
    let correctOp;
    if (d1 > d2) correctOp = ">";
    else if (d1 < d2) correctOp = "<";
    else correctOp = "=";

    setComparisonOperator(op);
    setShowFeedbackBox(true);

    if (op === correctOp) {
      playSound("correct");
      setFeedbackBoxCorrect(true);
      setButtonsDisabled(true);

      if (correctOp === "=") {
        // Digits are equal
        if (compareIndex < q.places.length - 1) {
          // Move to next digit after delay
          setTimeout(() => {
            setCompareIndex(compareIndex + 1);
            setComparisonOperator(null);
            setShowFeedbackBox(false);
            setFeedbackBoxCorrect(false);
            setButtonsDisabled(false);
          }, 1000);
        } else {
          // Last place and equal => numbers are equal
          setTimeout(() => {
            setAnimatingSymbol(true);
            setTimeout(() => {
              const placeName = APP_DATA.placeHeadings[place.name].toLowerCase();
              setFeedbackText(APP_DATA.step3.feedbackEqual);
              setLeftOperatorValue("=");
              setAnimatingSymbol(false);
              setComparisonDone(true);
            }, 800);
          }, 1000);
        }
      } else {
        // Digits are NOT equal - this is the deciding place
        setTimeout(() => {
          setAnimatingSymbol(true);
          setTimeout(() => {
            const placeName = APP_DATA.placeHeadings[place.name].toLowerCase();
            const feedText = APP_DATA.step3.feedbackGreater.replace("{{place}}", placeName);
            setFeedbackText(feedText);
            setLeftOperatorValue(correctOp);
            setAnimatingSymbol(false);
            setComparisonDone(true);
          }, 800);
        }, 1000);
      }
    } else {
      playSound("wrong");
      setFeedbackBoxCorrect(false);
      // Allow retry after brief pause
      wrongFeedbackTimeoutRef.current = setTimeout(() => {
        setComparisonOperator(null);
        setShowFeedbackBox(false);
        wrongFeedbackTimeoutRef.current = null;
      }, 1200);
    }
  }, [buttonsDisabled, comparisonDone, compareIndex, currentQuestion]);

  // Derived state
  function getQuestionText() {
    if (currentStep === 0 || currentStep === 4) return "";
    if (currentStep === 1) return APP_DATA.step1.question;
    if (currentStep === 2) {
      if (alignPhase === 2) return APP_DATA.step2.questionFinal;
      return APP_DATA.step2.question;
    }
    if (currentStep === 3) {
      const q = getCurrentQuestion();
      const place = q.places[compareIndex];
      const placeName = APP_DATA.placeHeadings[place.name].toLowerCase();

      if (comparisonDone) {
        // After final comparison is done, keep the last relevant question text
        if (feedbackText) return APP_DATA.step2.questionFinal;
        return APP_DATA.step3.questionTemplate.replace("{{place}}", placeName);
      }
      if (compareIndex > 0) {
        return APP_DATA.step3.questionEqualMove;
      }
      return APP_DATA.step3.questionTemplate.replace("{{place}}", placeName);
    }
    return "";
  }

  function getNavText() {
    if (currentStep === 0 || currentStep === 4) return "";
    if (currentStep === 1) return APP_DATA.step1.nav;
    if (currentStep === 2) {
      if (alignPhase === 2) return APP_DATA.step2.navFinal;
      return APP_DATA.step2.nav;
    }
    if (currentStep === 3) {
      if (comparisonDone) {
        if (currentQuestion < totalQuestions - 1) return APP_DATA.step3.navDone;
        return APP_DATA.step3.navComplete;
      }
      return APP_DATA.step3.nav;
    }
    return "";
  }

  function isNextDisabled() {
    if (currentStep === 0 || currentStep === 4) return true;
    if (currentStep === 1) return false; // always enabled in step 1
    if (currentStep === 2) return alignPhase !== 2;
    if (currentStep === 3) return !comparisonDone;
    return true;
  }

  function isPrevDisabled() {
    if (currentStep === 0 || currentStep === 4) return true;
    if (currentStep === 1) return currentQuestion === 0;
    return false;
  }

  // Fullscreen steps
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

  if (currentStep === 4) {
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

  // Main interactive steps (1, 2, 3)
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
        alignPhase: alignPhase,
        compareIndex: compareIndex,
        comparisonOperator: comparisonOperator,
        comparisonDone: comparisonDone,
        feedbackText: feedbackText,
        showFeedbackBox: showFeedbackBox,
        feedbackBoxCorrect: feedbackBoxCorrect,
        buttonsDisabled: buttonsDisabled,
        leftOperatorValue: leftOperatorValue,
        animatingSymbol: animatingSymbol,
        onDecimalBoxClick: handleDecimalBoxClick,
        onComparisonSelect: handleComparisonSelect,
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
