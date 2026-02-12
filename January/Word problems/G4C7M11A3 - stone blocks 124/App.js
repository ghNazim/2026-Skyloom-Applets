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
    calc1Substep: 0,
    calc1BoxValues: [null, null, null],
    calc1BoxesFinal: false,
    calc1ResultValue: "",
    calc1ResultFinal: false,
    calc2Substep: 0,
    calc2BoxValue: "",
    calc2BoxFinal: false,
    mcqAnswered: false,
    calc3Substituted: false,
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
      calc1Substep: 0,
      calc1BoxValues: [null, null, null],
      calc1BoxesFinal: false,
      calc1ResultValue: "",
      calc1ResultFinal: false,
      calc2Substep: 0,
      calc2BoxValue: "",
      calc2BoxFinal: false,
      mcqAnswered: false,
      calc3Substituted: false,
      findings: []
    });
  };

  function resetStateAfterStep(targetStep) {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    if (targetStep < 1) setComprehendSubstep(0);
    if (targetStep <= 4) setInteractiveBoxState1({ 0: false, 1: false });
    if (targetStep <= 7) setInteractiveBoxState2({ 0: false, 1: false });

    const step4Finding = (APP_DATA.calculation1 && APP_DATA.calculation1.findingsListStep5 && APP_DATA.calculation1.findingsListStep5[0]) || (APP_DATA.fallbackStep4Finding || "");
    const halfFinding = (APP_DATA.calculation2 && APP_DATA.calculation2.findingHalf) || (APP_DATA.fallbackHalfFinding || "");

    if (targetStep <= 3) {
      setCalcState(prev => ({
        ...prev,
        calc1Substep: 0,
        calc1BoxValues: [null, null, null],
        calc1BoxesFinal: false,
        calc1ResultValue: "",
        calc1ResultFinal: false,
        calc2Substep: 0,
        calc2BoxValue: "",
        calc2BoxFinal: false,
        mcqAnswered: false,
        calc3Substituted: false,
        findings: []
      }));
    } else if (targetStep <= 4) {
      setCalcState(prev => ({
        ...prev,
        calc1Substep: 0,
        calc1BoxValues: [null, null, null],
        calc1BoxesFinal: false,
        calc1ResultValue: "",
        calc1ResultFinal: false,
        calc2Substep: 0,
        calc2BoxValue: "",
        calc2BoxFinal: false,
        mcqAnswered: false,
        calc3Substituted: false,
        findings: []
      }));
    } else if (targetStep <= 6) {
      setCalcState(prev => ({
        ...prev,
        calc2Substep: 0,
        calc2BoxValue: "",
        calc2BoxFinal: false,
        mcqAnswered: false,
        calc3Substituted: false,
        findings: [step4Finding]
      }));
    } else if (targetStep <= 7) {
      setCalcState(prev => ({
        ...prev,
        mcqAnswered: false,
        calc3Substituted: false,
        findings: [step4Finding, halfFinding]
      }));
    } else if (targetStep <= 8) {
      setCalcState(prev => ({ ...prev, calc3Substituted: false }));
    }
  }
  
  // Calculate total comprehend substeps
  const getTotalComprehendSubsteps = () => {
    const comprehendData = APP_DATA.comprehend;
    return comprehendData.given.data.length + comprehendData.toFind.data.length;
  };
  
  const prevStepRef = React.useRef(currentStep);

  // Reset next button and dynamic texts on step change; play congrats when entering step 9
  useEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;

    if (currentStep === 9 && prevStepRef.current !== 9) {
      if (window.playSound) window.playSound("congrats");
    }
    prevStepRef.current = currentStep;

    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

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

    if (currentStep === 4) {
      setInteractiveBoxState1({ 0: false, 1: false });
    }

    if (currentStep === 7) {
      setInteractiveBoxState2({ 0: false, 1: false });
      const step7Finding = (APP_DATA.calculation2 && APP_DATA.calculation2.findingHalf) || (APP_DATA.fallbackHalfFinding || "");
      setCalcState(prev => {
        const list = prev.findings || [];
        if (list.includes(step7Finding)) return prev;
        return { ...prev, findings: [...list, step7Finding] };
      });
    }
  }, [currentStep]);

  // Update nav text for comprehend substeps
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      const comprehendData = APP_DATA.comprehend;
      const givenCount = comprehendData.given.data.length;
      
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
    
    // Handle step 1 - comprehend with substeps
    if (currentStep === 1 && stepData.isSubstepComprehend) {
      const totalSubsteps = getTotalComprehendSubsteps();
      if (comprehendSubstep < totalSubsteps - 1) {
        // Move to next substep
        if (window.playSound) window.playSound("click");
        setComprehendSubstep(prev => prev + 1);
        return;
      }
    }
    
    // Step 4: first substep done (3 boxes correct) - advance to second substep (row 4)
    if (currentStep === 4 && (calcState.calc1Substep || 0) === 0) {
      if (window.playSound) window.playSound("click");
      setCalcState(prev => ({ ...prev, calc1Substep: 1 }));
      setDynamicNavText(APP_DATA.steps[4].navText);
      setIsNextDisabled(true);
      return;
    }

    // Step 6: after submitting 7, first Next shows row 3; second Next goes to step 7
    if (currentStep === 6) {
      const sub = calcState.calc2Substep || 0;
      const boxFinal = calcState.calc2BoxFinal === true;
      if (sub === 0 && boxFinal) {
        if (window.playSound) window.playSound("click");
        setCalcState(prev => ({ ...prev, calc2Substep: 1 }));
        return;
      }
      if (sub === 1) {
        if (window.playSound) window.playSound("click");
        setCurrentStep(prev => prev + 1);
        return;
      }
      if (sub === 0) return; // not yet submitted, do nothing
    }

    // Final step (9) - restart (congrats already played when entering step 9)
    if (currentStep === 9) {
      handleRestart();
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
      const targetStep = currentStep - 1;
      resetStateAfterStep(targetStep);
      const targetStepData = APP_DATA.steps[targetStep];
      setIsNextDisabled(!(targetStepData && targetStepData.nextEnabled));
      setCurrentStep(targetStep);
    }
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
  
  // Get highlights for current step
  const getHighlights = () => {
    if (currentStep === 1) {
      return currentHighlights;
    }
    return null;
  };
  
  // Get highlight color for current step
  const getHighlightColor = () => {
    if (currentStep === 1) {
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
        nextSymbol: currentStep === 9 ? (APP_DATA.start_over || "»") : "»"
      })
    )
  );
};
