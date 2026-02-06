const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Question index (0, 1, 2) – which question's steps we're on
  const [questionIdx, setQuestionIdx] = useState(0);
  const appData = questions[questionIdx][current_language].app;

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

  // Calculation state: formulaRowAdded, mcqAnsweredCount; calc steps keyed by calcStepKey (e.g. "6", "7", "4")
  const [calcState, setCalcState] = useState({
    formulaRowAdded: false,
    mcqAnsweredCount: 0,
    calcSteps: {}
  });

  const getCalcStepData = (stepNum) => {
    const key = "calcStep" + stepNum;
    return appData[key] || null;
  };

  const handleRestart = () => {
    if (window.playSound) window.playSound("click");
    setQuestionIdx(0);
    setCurrentStep(0);
    setIsNextDisabled(true);
    setComprehendSubstep(0);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    setCurrentImage("");
    setCalcState({
      formulaRowAdded: false,
      mcqAnsweredCount: 0,
      calcSteps: {}
    });
  };

  const goToNextQuestion = () => {
    if (window.playSound) window.playSound("click");
    setQuestionIdx(prev => prev + 1);
    setCurrentStep(0);
    setIsNextDisabled(true);
    setComprehendSubstep(0);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    setCurrentImage("");
    setCalcState({
      formulaRowAdded: false,
      mcqAnsweredCount: 0,
      calcSteps: {}
    });
  };

  // Total comprehend substeps: 1 (section only) + given.length + toFind.length
  const getTotalComprehendSubsteps = () => {
    const comprehendData = appData.comprehend;
    return 1 + comprehendData.given.data.length + comprehendData.toFind.data.length;
  };

  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    const stepData = appData.steps[currentStep];
    if (!stepData) return;

    if (stepData.image) {
      setCurrentImage(`${stepData.image}`);
    }

    if (stepData.nextEnabled) {
      setIsNextDisabled(false);
    } else if (stepData.isCalcStep && stepData.calcStepKey != null) {
      // For calc steps: enable Next if current row has no [box], OR if all boxes in current row are filled
      const calcStepData = getCalcStepData(stepData.calcStepKey);
      const calcRows = (calcStepData && calcStepData.calcRows) || [];
      const stepState = (calcState.calcSteps || {})[String(stepData.calcStepKey)] || { visibleRowIndex: 0, answers: [] };
      const visibleRowIndex = stepState.visibleRowIndex ?? 0;
      const answersCount = (stepState.answers || []).length;
      const currentRow = calcRows[visibleRowIndex];
      const currentRowBoxCount = (currentRow && currentRow.answers && currentRow.answers.length) ? currentRow.answers.length : 0;
      let startBoxForRow = 0;
      for (let i = 0; i < visibleRowIndex; i++) {
        startBoxForRow += (calcRows[i] && calcRows[i].answers && calcRows[i].answers.length) ? calcRows[i].answers.length : 0;
      }
      const rowHasNoBox = currentRowBoxCount === 0;
      const rowFullyFilled = currentRowBoxCount > 0 && answersCount >= startBoxForRow + currentRowBoxCount;
      setIsNextDisabled(!(rowHasNoBox || rowFullyFilled));
    } else {
      setIsNextDisabled(true);
    }

    if (currentStep === 1) {
      setComprehendSubstep(0);
    }
  }, [currentStep, questionIdx, appData, calcState.calcSteps]);

  // Update highlights for step 1 - in question-row (visual), not question panel
  useEffect(() => {
    if (currentStep === 1) {
      const comprehendData = appData.comprehend;
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
        setCurrentImage(appData.steps[1].image || "");
      }

      setIsNextDisabled(false);

      const stepData = appData.steps[1];
      const total = getTotalComprehendSubsteps();
      if (comprehendSubstep === total - 1) {
        if (stepData.navTextCorrect) setDynamicNavText(stepData.navTextCorrect);
      } else if (comprehendSubstep === givenCount && stepData.navToFind) {
        setDynamicNavText(stepData.navToFind);
      } else {
        if (stepData.navText) setDynamicNavText(stepData.navText);
      }
    }
  }, [currentStep, comprehendSubstep, questionIdx, appData]);

  const handleNext = () => {
    const stepData = appData.steps[currentStep];

    if (currentStep === 1 && stepData.isSubstepComprehend) {
      const totalSubsteps = getTotalComprehendSubsteps();
      if (comprehendSubstep < totalSubsteps - 1) {
        if (window.playSound) window.playSound("click");
        setComprehendSubstep(prev => prev + 1);
        return;
      }
    }

    // Calc step: Next reveals next calc row, or goes to next step when last row done
    if (stepData.isCalcStep && stepData.calcStepKey != null) {
      const calcStepData = getCalcStepData(stepData.calcStepKey);
      const calcRows = (calcStepData && calcStepData.calcRows) || [];
      const key = String(stepData.calcStepKey);
      const stepState = (calcState.calcSteps || {})[key] || { visibleRowIndex: 0, answers: [] };
      const visibleRowIndex = stepState.visibleRowIndex || 0;
      if (visibleRowIndex < calcRows.length - 1) {
        if (window.playSound) window.playSound("click");
        setCalcState(prev => ({
          ...prev,
          calcSteps: {
            ...(prev.calcSteps || {}),
            [key]: { ...(prev.calcSteps || {})[key], visibleRowIndex: visibleRowIndex + 1 }
          }
        }));
        setIsNextDisabled(true);
        return;
      }
      const nextStepData = appData.steps[currentStep + 1];
      if (nextStepData && nextStepData.isFinalStep && window.playSound) window.playSound("congrats");
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Final step: Next question or Restart
    if (stepData.isFinalStep) {
      if (questionIdx < questions.length - 1) {
        goToNextQuestion();
      } else {
        handleRestart();
      }
      return;
    }

    if (window.playSound) window.playSound("click");
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (window.playSound) window.playSound("click");

    if (currentStep === 1) {
      if (comprehendSubstep > 0) {
        setComprehendSubstep(prev => prev - 1);
        return;
      }
    }

    if (currentStep > 0) {
      setIsNextDisabled(true);
      setDynamicQuestionText("");
      setDynamicNavText("");
      setCurrentHighlights(null);
      setHighlightColor(null);
      setCurrentStep(prev => prev - 1);
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
    const stepData = appData.steps[currentStep];
    if (stepData && stepData.questionTextPerMcq && stepData.questionTextPerMcq.length > 0) {
      const idx = (calcState.mcqAnsweredCount || 0);
      if (idx < stepData.questionTextPerMcq.length) return stepData.questionTextPerMcq[idx];
    }
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    const stepData = appData.steps[currentStep];
    if (stepData && stepData.isCalcStep) {
      return isNextDisabled ? (stepData.navText || "") : (dynamicNavText || stepData.navTextCorrect || "");
    }
    if (dynamicNavText) return dynamicNavText;
    return stepData ? stepData.navText : "";
  };

  // Highlights for step 1 go to Visual (question-row), not QuestionPanel
  const getHighlights = () => (currentStep === 1 ? currentHighlights : null);
  const getHighlightColor = () => (currentStep === 1 ? highlightColor : null);

  const stepData = appData.steps[currentStep];

  // For calc steps, derive visible row index from calcState.calcSteps[calcStepKey]
  const calcStepKeyForVisible = (stepData && stepData.isCalcStep && stepData.calcStepKey != null) ? stepData.calcStepKey : null;
  const visibleCalcRowIndex = calcStepKeyForVisible != null
    ? ((calcState.calcSteps || {})[String(calcStepKeyForVisible)] || {}).visibleRowIndex || 0
    : 0;

  // Step 8 button label: "Next" if more questions, else "Restart"
  const finalStepButtonLabel = questionIdx < questions.length - 1 ? "»" : appData.start_over;

  // Splash Steps
  if (stepData?.isSplash) {
    const splashKey = stepData.splashKey;
    const splashData = appData.splash[splashKey];

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
          isPrevDisabled: currentStep <= 0,
          navText: getNavText(),
          nextSymbol: "»"
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
            appData.questionText
          ),
          appData.questionImage && React.createElement("img", {
            src: appData.questionImage,
            alt: "Question figure",
            className: "comprehend-question-image " + (questionIdx === 1 ? "actual-image" : "")
          })
        )
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
          isNextDisabled: isNextDisabled,
          isPrevDisabled: currentStep <= 0,
          navText: getNavText(),
          nextSymbol: "»"
        })
      )
    );
  }

  // Main Canvas Steps (1, 3�6)
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
        appData: appData,
        onEnableNext: enableNext,
        onUpdateTexts: updateTexts,
        onUpdateImage: updateImage,
        currentImage: currentImage,
        comprehendSubstep: comprehendSubstep,
        statementInVisual: stepData?.statementInVisual || "",
        questionRowHighlights: getHighlights(),
        questionRowHighlightColor: getHighlightColor(),
        calcState: calcState,
        setCalcState: setCalcState,
        visibleCalcRowIndex: visibleCalcRowIndex
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 0,
        navText: getNavText(),
        nextSymbol: (appData.steps[currentStep] && appData.steps[currentStep].isFinalStep) ? finalStepButtonLabel : "»"
      })
    )
  );
};
