const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  // Substep for comprehend step
  const [comprehendSubstep, setComprehendSubstep] = useState(0);
  
  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");
  
  // Highlight state for question panel
  const [currentHighlights, setCurrentHighlights] = useState(null);
  const [highlightColor, setHighlightColor] = useState(null);
  
  // Image state for visual panel
  const [currentImage, setCurrentImage] = useState("");
  
  // Interactive box state for Step 4 and Step 7 (persistent across re-renders)
  const [interactiveBoxState1, setInteractiveBoxState1] = useState({ 0: false, 1: false });
  const [interactiveBoxState2, setInteractiveBoxState2] = useState({ 0: false, 1: false });
  
  // Calculation state (persistent)
  const [calcState, setCalcState] = useState({
    // First calculation (steps 4-5)
    calc1BoxesDone: false,
    calc1NumpadAnswered: false,
    calc1NumpadValue: "",
    // Second calculation (steps 7-8)
    calc2BoxesDone: false,
    calc2NumpadAnswered: false,
    calc2NumpadValue: "",
    // MCQ (step 9)
    mcqAnswered: false,
    // Findings list
    findings: []
  });

  const handleRestart = () => {
    if (window.playSound) window.playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setComprehendSubstep(0);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    setCurrentImage("");
    setInteractiveBoxState1({ 0: false, 1: false });
    setInteractiveBoxState2({ 0: false, 1: false });
    setCalcState({
      calc1BoxesDone: false,
      calc1NumpadAnswered: false,
      calc1NumpadValue: "",
      calc2BoxesDone: false,
      calc2NumpadAnswered: false,
      calc2NumpadValue: "",
      mcqAnswered: false,
      findings: []
    });
  };

  // Reset all state so that targetStep appears as if reached for the first time.
  // Clears any state that was set during or after targetStep.
  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    if (targetStep <= 0) {
      setComprehendSubstep(0);
      setInteractiveBoxState1({ 0: false, 1: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        mcqAnswered: false,
        findings: []
      });
      return;
    }

    if (targetStep === 1) {
      setComprehendSubstep(-1);
      setInteractiveBoxState1({ 0: false, 1: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        mcqAnswered: false,
        findings: []
      });
      return;
    }

    if (targetStep <= 3) {
      setInteractiveBoxState1({ 0: false, 1: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        mcqAnswered: false,
        findings: []
      });
      return;
    }

    if (targetStep === 4) {
      setInteractiveBoxState1({ 0: false, 1: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        mcqAnswered: false,
        findings: []
      });
      return;
    }

    if (targetStep === 5) {
      setInteractiveBoxState1({ 0: true, 1: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: true,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        mcqAnswered: false,
        findings: []
      });
      return;
    }

    if (targetStep === 6) {
      const calc1Finding = APP_DATA.calculation1.findings.areaFinding;
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: APP_DATA.calculation1.numpad.answer,
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        mcqAnswered: false,
        findings: [calc1Finding]
      });
      return;
    }

    if (targetStep === 7) {
      const calc1Finding = APP_DATA.calculation1.findings.areaFinding;
      setCalcState({
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: APP_DATA.calculation1.numpad.answer,
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        mcqAnswered: true,
        findings: [calc1Finding]
      });
    }
  };
  
  // Calculate total comprehend substeps
  const getTotalComprehendSubsteps = () => {
    const comprehendData = APP_DATA.comprehend;
    return comprehendData.given.data.length + comprehendData.toFind.data.length;
  };
  
  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;
    
    // Set initial image
    if (stepData.image) {
      setCurrentImage(`${stepData.image}`);
    }
    
    // Handle next button state based on step type
    if (stepData.nextEnabled) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
    
    // Reset comprehend substep when entering step 1 (start at -1: question only, no list)
    if (currentStep === 1) {
      setComprehendSubstep(-1);
    }
    
    // Reset interactive box state when entering step 5
    if (currentStep === 5) {
      setInteractiveBoxState1({ 0: false, 1: false });
    }
  }, [currentStep]);

  // Update nav text for comprehend substeps
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      const comprehendData = APP_DATA.comprehend;
      const givenCount = comprehendData.given.data.length;

      // Comprehend -1: no highlights, only question and title
      if (comprehendSubstep < 0) {
        setCurrentHighlights(null);
        setHighlightColor(null);
        if (stepData.navText) setDynamicNavText(stepData.navText);
        setIsNextDisabled(false);
        if (comprehendData.images && comprehendData.images[0]) {
          setCurrentImage(comprehendData.images[0]);
        }
        return;
      }

      // Update highlights based on substep - one at a time
      if (comprehendSubstep < givenCount) {
        // Given items - show orange highlight for current item
        setCurrentHighlights([comprehendData.given.highlights[comprehendSubstep]]);
        setHighlightColor("orange");
      } else if (comprehendSubstep === givenCount) {
        // First toFind item - show purple highlight
        setCurrentHighlights(comprehendData.toFind.highlights);
        setHighlightColor("purple");
      } else {
        // Remove highlights for subsequent substeps
        setCurrentHighlights(null);
        setHighlightColor(null);
      }
      
      // Update image based on substep
      if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
        setCurrentImage(comprehendData.images[comprehendSubstep]);
      }
      
      // Enable next button for comprehend substeps
      setIsNextDisabled(false);
      
      // Update nav text based on substep
      const isLastSubstep = comprehendSubstep === total - 1;
      const isFirstToFindStep = comprehendSubstep === givenCount;
      const isLastGivenStep = comprehendSubstep === givenCount - 1;
      
      if (isLastSubstep) {
        // Last substep - show navTextCorrect (takes priority)
        if (stepData.navTextCorrect) {
          setDynamicNavText(stepData.navTextCorrect);
        }
      } else if (isLastGivenStep) {
        // First toFind step (but not last) - show navToFind
        if (stepData.navToFind) {
          setDynamicNavText(stepData.navToFind);
        }
      } else {
        // Given steps (including last given step) - show navText
        if (stepData.navText) {
          setDynamicNavText(stepData.navText);
        }
      }
    }
  }, [currentStep, comprehendSubstep]);

  const handleNext = () => {
    const stepData = APP_DATA.steps[currentStep];
    
    // Handle step 1 - comprehend with substeps (including -1 → 0)
    if (currentStep === 1 && stepData.isSubstepComprehend) {
      const totalSubsteps = getTotalComprehendSubsteps();
      if (comprehendSubstep < totalSubsteps - 1) {
        if (window.playSound) window.playSound("click");
        setComprehendSubstep(prev => prev + 1);
        return;
      }
    }
    
    // Final step - play congrats and restart
    if (stepData && stepData.isFinalStep) {
      handleRestart();
    } else {
      // Play congrats sound when reaching final step (step 6, before step 7)
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
    
    // Handle step 1 - comprehend with substeps (stay on step 1, just go back one substep)
    if (currentStep === 1) {
      if (comprehendSubstep > -1) {
        setComprehendSubstep(prev => prev - 1);
        return;
      }
    }
    
    if (currentStep <= 0) return;
    
    const targetStep = currentStep - 1;
    // Reset all state so the previous step appears as if reached for the first time
    resetStateForStep(targetStep);
    setCurrentStep(targetStep);
    // Next button: previous step typically requires completion, so disable until they complete it
    setIsNextDisabled(true);
  };

  // Callback from components to enable Next button
  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  // Callback to update image
  const updateImage = useCallback((imageSrc) => {
    setCurrentImage(imageSrc);
  }, []);

  // Handlers for dynamic text updates
  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  // Content Selection
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
  
  // Get highlights for current step (none when comprehend substep -1)
  const getHighlights = () => {
    if (currentStep === 1 && comprehendSubstep >= 0) {
      return currentHighlights;
    }
    return null;
  };
  
  // Get highlight color for current step (none when comprehend substep -1)
  const getHighlightColor = () => {
    if (currentStep === 1 && comprehendSubstep >= 0) {
      return highlightColor;
    }
    return null;
  };

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
          isPrevDisabled: currentStep <= 0,
          navText: getNavText(),
          nextSymbol: "»"
        })
      )
    );
  }

  // Step 0: Comprehend question only - full width content column
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
          )
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

  // Main Canvas Steps
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
      highlights: getHighlights(),
      highlightColor: getHighlightColor()
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
        interactiveBoxState1: interactiveBoxState1,
        setInteractiveBoxState1: setInteractiveBoxState1,
        interactiveBoxState2: interactiveBoxState2,
        setInteractiveBoxState2: setInteractiveBoxState2,
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
        isPrevDisabled: currentStep <= 0,
        navText: getNavText(),
          nextSymbol: (APP_DATA.steps[currentStep] && APP_DATA.steps[currentStep].isFinalStep) ? APP_DATA.start_over : "»"
      })
    )
  );
};
