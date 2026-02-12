const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Question index: which question (0, 1, ...) is active
  const [questionIdx, setQuestionIdx] = useState(0);
  setAppDataQuestionIdx(questionIdx);

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  // Substep for comprehend step (0 = section title only, 1+ = given/toFind items)
  const [comprehendSubstep, setComprehendSubstep] = useState(0);

  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  // Highlight state for question-row in visual (step 1 only)
  const [currentHighlights, setCurrentHighlights] = useState(null);
  const [highlightColor, setHighlightColor] = useState(null);

  // Image state for visual panel
  const [currentImage, setCurrentImage] = useState("");

  // Calculation state (persistent) for perimeter applet
  const [calcState, setCalcState] = useState({
    formulaRowAdded: false,
    numpad1Answered: false,
    numpad1Value: "",
    numpad2Answered: false,
    numpad2Value: "",
    triangleMcqAnswered: false,
    formulaMcqAnswered: false
  });

  const getEmptyCalcState = () => ({
    formulaRowAdded: false,
    numpad1Answered: false,
    numpad1Value: "",
    numpad1BoxValues: [],
    numpad1CurrentBoxIndex: 0,
    numpad2Answered: false,
    numpad2Value: "",
    triangleMcqAnswered: false,
    formulaMcqAnswered: false
  });

  const resetQuestionState = () => {
    setCurrentStep(0);
    setIsNextDisabled(true);
    setComprehendSubstep(0);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    setCurrentImage("");
    setCalcState(getEmptyCalcState());
  };

  // When going "previous" to targetStep, return calcState as if we just landed on that step (reset all progress after it).
  const getCalcStateForTargetStep = (targetStep, currentCalcState) => {
    if (targetStep <= 2) return getEmptyCalcState();
    if (targetStep === 3) return getEmptyCalcState();
    if (targetStep === 4) {
      return {
        ...getEmptyCalcState(),
        triangleMcqAnswered: true
      };
    }
    if (targetStep === 5) {
      return {
        ...getEmptyCalcState(),
        triangleMcqAnswered: true,
        formulaRowAdded: true,
        formulaMcqAnswered: true
      };
    }
    if (targetStep === 6) {
      return {
        ...currentCalcState,
        numpad2Answered: false,
        numpad2Value: ""
      };
    }
    // step 7 or other: keep current
    return currentCalcState;
  };

  const handleRestart = () => {
    if (window.playSound) window.playSound("click");
    setQuestionIdx(0);
    resetQuestionState();
  };

  // Total comprehend substeps: 1 (section only) + given.length + toFind.length
  const getTotalComprehendSubsteps = () => {
    const comprehendData = APP_DATA.comprehend;
    return 1 + comprehendData.given.data.length + comprehendData.toFind.data.length;
  };

  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;

    if (stepData.image) {
      setCurrentImage(`${stepData.image}`);
    }

    if (stepData.nextEnabled) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }

    if (currentStep === 1) {
      setComprehendSubstep(0);
    }
  }, [currentStep]);

  // Update highlights for step 1 - in question-row (visual), not question panel
  useEffect(() => {
    if (currentStep === 1) {
      const comprehendData = APP_DATA.comprehend;
      const givenCount = comprehendData.given.data.length;

      // substep 0 = section title only -> no highlight. Start highlighting from substep 1 (when first given appears).
      if (comprehendSubstep === 0) {
        setCurrentHighlights(null);
        setHighlightColor(null);
      } else if (comprehendSubstep <= givenCount) {
        // Showing given item(s) - highlight for the current given (index = substep - 1)
        const hl = comprehendData.given.highlights[comprehendSubstep - 1];
        if (hl && hl !== "null") {
          setCurrentHighlights([hl]);
          setHighlightColor("orange");
        } else {
          setCurrentHighlights(null);
          setHighlightColor(null);
        }
      } else {
        // Showing toFind - purple highlight (e.g. "perimeter")
        setCurrentHighlights(comprehendData.toFind.highlights);
        setHighlightColor("purple");
      }

      if (comprehendData.images && comprehendData.images[comprehendSubstep - 1]) {
        setCurrentImage(comprehendData.images[comprehendSubstep - 1]);
      } else if (comprehendSubstep === 0) {
        setCurrentImage(APP_DATA.steps[1].image || "");
      }

      setIsNextDisabled(false);

      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      const totalGiven = comprehendData.given.data.length;
      if (comprehendSubstep === total - 1) {
        if (stepData.navTextCorrect) setDynamicNavText(stepData.navTextCorrect);
      } else if (comprehendSubstep === totalGiven && stepData.navToFind) {
        setDynamicNavText(stepData.navToFind);
      } else {
        if (stepData.navText) setDynamicNavText(stepData.navText);
      }
    }
  }, [currentStep, comprehendSubstep]);

  const handleNext = () => {
    const stepData = APP_DATA.steps[currentStep];

    if (currentStep === 1 && stepData.isSubstepComprehend) {
      const totalSubsteps = getTotalComprehendSubsteps();
      if (comprehendSubstep < totalSubsteps - 1) {
        if (window.playSound) window.playSound("click");
        setComprehendSubstep(prev => prev + 1);
        return;
      }
    }

    if (currentStep === 7) {
      if (questionIdx < questions.length - 1) {
        if (window.playSound) window.playSound("click");
        setQuestionIdx(prev => prev + 1);
        resetQuestionState();
      } else {
        handleRestart();
      }
    } else {
      if (currentStep === 6) {
        if (window.playSound) window.playSound("congrats");
      } else {
        if (window.playSound) window.playSound("click");
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (window.playSound) window.playSound("click");

    // Step 1: go back within comprehend substeps
    if (currentStep === 1) {
      if (comprehendSubstep > 0) {
        setComprehendSubstep(prev => prev - 1);
        return;
      }
    }

    // Step 0 with previous question: go to previous question's last step
    if (currentStep === 0 && questionIdx > 0) {
      setQuestionIdx(prev => prev - 1);
      setCurrentStep(7);
      setIsNextDisabled(false);
      return;
    }

    // Go back to previous step: reset all progress after the target step so it looks like first time
    if (currentStep > 0) {
      const targetStep = currentStep - 1;

      setCalcState(prev => getCalcStateForTargetStep(targetStep, prev));

      setDynamicQuestionText("");
      setDynamicNavText("");
      setCurrentHighlights(null);
      setHighlightColor(null);

      if (targetStep === 1) {
        setCurrentStep(1);
        setComprehendSubstep(getTotalComprehendSubsteps() - 1);
        setIsNextDisabled(false);
      } else {
        setCurrentStep(targetStep);
        setIsNextDisabled(true);
      }
    }
  };

  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  const updateImage = useCallback((imageSrc) => {
    setCurrentImage(imageSrc);
  }, []);

  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  const getQuestionText = () => {
    if (dynamicQuestionText) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };

  // Highlights for step 1 go to Visual (question-row), not QuestionPanel
  const getHighlights = () => (currentStep === 1 ? currentHighlights : null);
  const getHighlightColor = () => (currentStep === 1 ? highlightColor : null);

  const stepData = APP_DATA.steps[currentStep];

  // Splash Steps
  if (stepData?.isSplash) {
    const splashKey = stepData.splashKey;
    const splashData = APP_DATA.splash[splashKey];

    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
        step: currentStep,
      }),
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(SplashScreen, {
          imageSrc: `${splashData.image}`,
          text: splashData.text,
          step: currentStep,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
          isNextDisabled: isNextDisabled,
          isPrevDisabled: currentStep <= 0 && questionIdx <= 0,
          navText: getNavText(),
          nextSymbol: APP_DATA.nextSymbol || "»"
        })
      )
    );
  }

  // Step 0: Comprehend question + image - full width content column
  if (currentStep === 0 && stepData?.isComprehendQuestion) {
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
        React.createElement(
          "div",
          { className: "full-width-content-column" },
          React.createElement(
            "div",
            { className: "comprehend-question-text" },
            APP_DATA.questionText
          ),
          APP_DATA.questionImage && React.createElement("img", {
            src: APP_DATA.questionImage,
            alt: APP_DATA.imageAlts?.questionFigure || "",
            className: "comprehend-question-image"
          })
        )
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
          isNextDisabled: isNextDisabled,
          isPrevDisabled: currentStep <= 0 && questionIdx <= 0,
          navText: getNavText(),
          nextSymbol: APP_DATA.nextSymbol || "»"
        })
      )
    );
  }

  // Main Canvas Steps (1, 3–7)
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
      highlights: null,
      highlightColor: null
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        onEnableNext: enableNext,
        onUpdateTexts: updateTexts,
        onUpdateImage: updateImage,
        currentImage: currentImage,
        comprehendSubstep: comprehendSubstep,
        statementInVisual: stepData?.statementInVisual || "",
        questionRowHighlights: getHighlights(),
        questionRowHighlightColor: getHighlightColor(),
        calcState: calcState,
        setCalcState: setCalcState
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 0 && questionIdx <= 0,
        navText: getNavText(),
        nextSymbol: currentStep === 7 ? APP_DATA.start_over : (APP_DATA.nextSymbol || "»")
      })
    )
  );
};
