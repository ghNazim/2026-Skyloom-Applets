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

  // Calculation state (persistent) for missing-side applet
  const [calcState, setCalcState] = useState({
    formulaRowAdded: false,
    mcqAnsweredCount: 0,
    calcBoxAnswers: [],
    calcBoxFilledIndex: { row: 0, box: 0 }
  });

  // Step 5: which calc row is visible (0 = first row only; increment when user clicks Next)
  const [visibleCalcRowIndex, setVisibleCalcRowIndex] = useState(0);

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
    setVisibleCalcRowIndex(0);
    setCalcState({
      formulaRowAdded: false,
      mcqAnsweredCount: 0,
      calcBoxAnswers: [],
      calcBoxFilledIndex: { row: 0, box: 0 }
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
    setVisibleCalcRowIndex(0);
    setCalcState({
      formulaRowAdded: false,
      mcqAnsweredCount: 0,
      calcBoxAnswers: [],
      calcBoxFilledIndex: { row: 0, box: 0 }
    });
  };

  // Total comprehend substeps: 1 (section only) + given.length + toFind.length
  const getTotalComprehendSubsteps = () => {
    const comprehendData = appData.comprehend;
    return 1 + comprehendData.given.data.length + comprehendData.toFind.data.length;
  };

  // Number of answer boxes in calc rows 0..r (inclusive); for r < 0 returns 0. Used to truncate calcBoxAnswers when going back.
  const getBoxCountThroughRow = (calcRows, r) => {
    if (r < 0) return 0;
    const rows = calcRows || [];
    let count = 0;
    for (let i = 0; i <= r && i < rows.length; i++) {
      count += (rows[i].answers && rows[i].answers.length) ? rows[i].answers.length : 0;
    }
    return count;
  };

  // Reset next button and dynamic texts on step change (do NOT reset comprehendSubstep/visibleCalcRowIndex here; those are set in handleNext/handlePrev)
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
    } else {
      setIsNextDisabled(true);
    }
  }, [currentStep, questionIdx, appData]);

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

    // Step 5: Next reveals next calc row, or goes to step 6 when last row done
    if (currentStep === 5) {
      const calcRows = appData.calcRows || [];
      if (visibleCalcRowIndex < calcRows.length - 1) {
        if (window.playSound) window.playSound("click");
        setVisibleCalcRowIndex(prev => prev + 1);
        setIsNextDisabled(true);
        return;
      }
      if (window.playSound) window.playSound("congrats");
      setCurrentStep(6);
      return;
    }

    // Step 6: Next question or Restart
    if (currentStep === 6) {
      if (questionIdx < questions.length - 1) {
        goToNextQuestion();
      } else {
        handleRestart();
      }
      return;
    }

    if (window.playSound) window.playSound("click");
    // Skip step 3: from step 2 go directly to step 4
    if (currentStep === 0) {
      setComprehendSubstep(0);
      setCurrentStep(1);
    } else if (currentStep === 2) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setVisibleCalcRowIndex(0);
      setCurrentStep(5);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (window.playSound) window.playSound("click");

    const resetCalcStateToInitial = () => {
      setCalcState({
        formulaRowAdded: false,
        mcqAnsweredCount: 0,
        calcBoxAnswers: [],
        calcBoxFilledIndex: { row: 0, box: 0 }
      });
      setVisibleCalcRowIndex(0);
    };

    // Step 1: previous substep, and reset any progress after step 1
    if (currentStep === 1) {
      if (comprehendSubstep > 0) {
        setComprehendSubstep(prev => prev - 1);
        resetCalcStateToInitial();
        setIsNextDisabled(false);
        setDynamicQuestionText("");
        setDynamicNavText("");
        return;
      }
    }

    // Step 5: previous calc row; keep only answers for rows *before* the row we're landing on (so that row's boxes are unanswered and numpad is active)
    if (currentStep === 5) {
      const calcRows = appData.calcRows || [];
      if (visibleCalcRowIndex > 0) {
        const newVisibleIdx = visibleCalcRowIndex - 1;
        const keepCount = getBoxCountThroughRow(calcRows, newVisibleIdx - 1);
        setVisibleCalcRowIndex(newVisibleIdx);
        setCalcState(prev => ({
          ...prev,
          calcBoxAnswers: (prev.calcBoxAnswers || []).slice(0, keepCount)
        }));
        setIsNextDisabled(true);
        setDynamicQuestionText("");
        setDynamicNavText("");
        return;
      }
      // visibleCalcRowIndex === 0: go back to step 4 and reset so step 4 looks fresh
      resetCalcStateToInitial();
      setCurrentStep(4);
      setIsNextDisabled(false);
      setDynamicQuestionText("");
      setDynamicNavText("");
      return;
    }

    // Step 6: go back to step 5 (last calc row visible, all answers kept)
    if (currentStep === 6) {
      const calcRows = appData.calcRows || [];
      setCurrentStep(5);
      setVisibleCalcRowIndex(Math.max(0, calcRows.length - 1));
      setIsNextDisabled(false);
      setDynamicQuestionText("");
      setDynamicNavText("");
      return;
    }

    // Go back to previous step and reset all progress made after that step
    if (currentStep > 0) {
      setIsNextDisabled(true);
      setDynamicQuestionText("");
      setDynamicNavText("");
      setCurrentHighlights(null);
      setHighlightColor(null);

      if (currentStep === 4) {
        resetCalcStateToInitial();
        setCurrentStep(2);
        return;
      }
      if (currentStep === 2) {
        resetCalcStateToInitial();
        setCurrentStep(1);
        setComprehendSubstep(getTotalComprehendSubsteps() - 1);
        return;
      }
      if (currentStep === 1) {
        resetCalcStateToInitial();
        setCurrentStep(0);
        return;
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
    // Step 5 (calc rows): show question text for the visible calc row index when available
    if (currentStep === 5 && appData.questionTextsWithCalcRows && appData.questionTextsWithCalcRows[visibleCalcRowIndex] != null) {
      return appData.questionTextsWithCalcRows[visibleCalcRowIndex];
    }
    const stepData = appData.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };

  const getNavText = () => {
    const stepData = appData.steps[currentStep];
    // Step 5: when numpad is active (Next disabled) show numpad instruction; when Next active show navTextCorrect
    if (currentStep === 5 && stepData) {
      return isNextDisabled ? (stepData.navText || "") : (dynamicNavText || stepData.navTextCorrect || "");
    }
    if (dynamicNavText) return dynamicNavText;
    return stepData ? stepData.navText : "";
  };

  // Highlights for step 1 go to Visual (question-row), not QuestionPanel
  const getHighlights = () => (currentStep === 1 ? currentHighlights : null);
  const getHighlightColor = () => (currentStep === 1 ? highlightColor : null);

  const stepData = appData.steps[currentStep];

  // Step 6 button label: "Next" if more questions, else "Restart"
  const step6ButtonLabel = questionIdx < questions.length - 1 ? "»" : appData.start_over;

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
        nextSymbol: currentStep === 6 ? step6ButtonLabel : "»"
      })
    )
  );
};
