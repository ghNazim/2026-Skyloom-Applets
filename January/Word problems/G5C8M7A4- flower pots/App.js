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
  
  // Interactive box state for Step 5 (perimeter - 4 boxes) and Step 12 (total cost - 2 boxes)
  const [interactiveBoxState1, setInteractiveBoxState1] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [interactiveBoxState2, setInteractiveBoxState2] = useState({ 0: false, 1: false });
  
  // Calculation state (persistent)
  const [calcState, setCalcState] = useState({
    // Perimeter calculation (steps 5-6)
    calc1BoxesDone: false,
    calc1NumpadAnswered: false,
    calc1NumpadValue: "",
    // Number of pots calculation (steps 8-9)
    calc2Numpad1Answered: false,
    calc2Numpad1Value: "",
    calc2Numpad2Answered: false,
    calc2Numpad2Value: "",
    // Total cost calculation (steps 12-13)
    calc3BoxesDone: false,
    calc3NumpadAnswered: false,
    calc3NumpadValue: "",
    // MCQs (steps 3, 4, 10)
    mcq1Answered: false,
    mcq2Answered: false,
    mcq3Answered: false,
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
    setInteractiveBoxState1({ 0: false, 1: false, 2: false, 3: false });
    setInteractiveBoxState2({ 0: false, 1: false });
    setCalcState({
      calc1BoxesDone: false,
      calc1NumpadAnswered: false,
      calc1NumpadValue: "",
      calc2Numpad1Answered: false,
      calc2Numpad1Value: "",
      calc2Numpad2Answered: false,
      calc2Numpad2Value: "",
      calc3BoxesDone: false,
      calc3NumpadAnswered: false,
      calc3NumpadValue: "",
      mcq1Answered: false,
      mcq2Answered: false,
      mcq3Answered: false,
      findings: []
    });
  };

  // Reset all state so that targetStep appears as if reached for the first time.
  // Clears any progress made at targetStep or any later step.
  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    const calc1 = APP_DATA.calculation1;
    const calc2 = APP_DATA.calculation2;
    const calc = APP_DATA.calculation;
    const labels = APP_DATA.labels;

    const emptyCalcState = {
      calc1BoxesDone: false,
      calc1NumpadAnswered: false,
      calc1NumpadValue: "",
      calc2Numpad1Answered: false,
      calc2Numpad1Value: "",
      calc2Numpad2Answered: false,
      calc2Numpad2Value: "",
      calc3BoxesDone: false,
      calc3NumpadAnswered: false,
      calc3NumpadValue: "",
      mcq1Answered: false,
      mcq2Answered: false,
      mcq3Answered: false,
      findings: []
    };

    if (targetStep <= 0) {
      setComprehendSubstep(0);
      setInteractiveBoxState1({ 0: false, 1: false, 2: false, 3: false, 4: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState(emptyCalcState);
      return;
    }

    if (targetStep === 1) {
      setComprehendSubstep(0);
      setInteractiveBoxState1({ 0: false, 1: false, 2: false, 3: false, 4: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState(emptyCalcState);
      return;
    }

    if (targetStep <= 3) {
      setInteractiveBoxState1({ 0: false, 1: false, 2: false, 3: false, 4: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState(emptyCalcState);
      return;
    }

    if (targetStep === 4) {
      setInteractiveBoxState1({ 0: false, 1: false, 2: false, 3: false, 4: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step3 },
          { title: labels.findings, list: calc.defaultFindings.step3to4 }
        ]
      });
      return;
    }

    if (targetStep === 5) {
      setInteractiveBoxState1({ 0: false, 1: false, 2: false, 3: false, 4: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step3 },
          { title: labels.findings, list: calc.defaultFindings.step3to4 }
        ]
      });
      return;
    }

    if (targetStep === 6) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        calc1BoxesDone: true,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step6 },
          { title: labels.findings, list: calc.defaultFindings.step3to4 }
        ]
      });
      return;
    }

    if (targetStep === 7) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step6 },
          { title: labels.findings, list: [calc1.findings.perimeter] }
        ]
      });
      return;
    }

    if (targetStep === 8) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step7to13 },
          { title: labels.findings, list: [calc1.findings.perimeter] }
        ]
      });
      return;
    }

    if (targetStep === 9) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        calc2Numpad1Answered: true,
        calc2Numpad1Value: calc2.numpad1.answer,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step7to13 },
          { title: labels.findings, list: [calc1.findings.perimeter] }
        ]
      });
      return;
    }

    if (targetStep === 10) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        calc2Numpad1Answered: true,
        calc2Numpad1Value: calc2.numpad1.answer,
        calc2Numpad2Answered: true,
        calc2Numpad2Value: calc2.numpad2.answer,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step7to13 },
          { title: labels.findings, list: [calc1.findings.perimeter, calc2.findings.numberOfPots] }
        ]
      });
      return;
    }

    if (targetStep === 11) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        mcq3Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        calc2Numpad1Answered: true,
        calc2Numpad1Value: calc2.numpad1.answer,
        calc2Numpad2Answered: true,
        calc2Numpad2Value: calc2.numpad2.answer,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step7to13 },
          { title: labels.findings, list: [calc1.findings.perimeter, calc2.findings.numberOfPots] }
        ]
      });
      return;
    }

    if (targetStep === 12) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        mcq3Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        calc2Numpad1Answered: true,
        calc2Numpad1Value: calc2.numpad1.answer,
        calc2Numpad2Answered: true,
        calc2Numpad2Value: calc2.numpad2.answer,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step7to13 },
          { title: labels.findings, list: [calc1.findings.perimeter, calc2.findings.numberOfPots] }
        ]
      });
      return;
    }

    if (targetStep === 13) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: true, 1: true });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        mcq3Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        calc2Numpad1Answered: true,
        calc2Numpad1Value: calc2.numpad1.answer,
        calc2Numpad2Answered: true,
        calc2Numpad2Value: calc2.numpad2.answer,
        calc3BoxesDone: true,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step7to13 },
          { title: labels.findings, list: [calc1.findings.perimeter, calc2.findings.numberOfPots] }
        ]
      });
      return;
    }

    if (targetStep === 14) {
      setInteractiveBoxState1({ 0: true, 1: true, 2: true, 3: true, 4: true });
      setInteractiveBoxState2({ 0: true, 1: true });
      setCalcState({
        ...emptyCalcState,
        mcq1Answered: true,
        mcq2Answered: true,
        mcq3Answered: true,
        calc1BoxesDone: true,
        calc1NumpadAnswered: true,
        calc1NumpadValue: calc1.numpad.answer,
        calc2Numpad1Answered: true,
        calc2Numpad1Value: calc2.numpad1.answer,
        calc2Numpad2Answered: true,
        calc2Numpad2Value: calc2.numpad2.answer,
        calc3BoxesDone: true,
        calc3NumpadAnswered: true,
        calc3NumpadValue: APP_DATA.calculation3.numpad.answer,
        findings: [
          { title: labels.given, list: calc.defaultGiven.step7to13 },
          { title: labels.findings, list: [calc1.findings.perimeter, calc2.findings.numberOfPots] }
        ]
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
    
    // Reset comprehend substep when entering step 1
    if (currentStep === 1) {
      setComprehendSubstep(0);
    }
    
    // Reset interactive box state when entering step 5 (perimeter boxes)
    if (currentStep === 5) {
      setInteractiveBoxState1({ 0: false, 1: false, 2: false, 3: false });
    }
    
    // Reset interactive box state when entering step 12 (total cost boxes)
    if (currentStep === 12) {
      setInteractiveBoxState2({ 0: false, 1: false });
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
    
    // Final step - play congrats and restart
    if (currentStep === 14) {
      handleRestart();
    } else {
      // Play congrats sound when reaching final step
      if (currentStep === 13) {
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
      if (comprehendSubstep > 0) {
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
            { className: "comprehend-question-text", style: { fontSize: "2vw" } },
            APP_DATA.questionText
          ),
          React.createElement(
            "div",
            { className: "comprehend-question-image" },
            React.createElement("img", {
              src: APP_DATA.step0Image || "assets/question.png",
              alt: APP_DATA.altTexts?.questionImage,
              className: "question-image"
            })
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
        nextSymbol: currentStep === 14 ? APP_DATA.start_over : "»"
      })
    )
  );
};
