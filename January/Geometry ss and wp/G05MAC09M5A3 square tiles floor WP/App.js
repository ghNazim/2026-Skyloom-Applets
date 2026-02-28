const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  // Substep for comprehend step
  const [comprehendSubstep, setComprehendSubstep] = useState(-1);
  // Comprehend substep 0: Show Floor button — next disabled until video ends
  const [showFloorRevealed, setShowFloorRevealed] = useState(false);
  const [showFloorVideoPlaying, setShowFloorVideoPlaying] = useState(false);

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
    setShowFloorRevealed(false);
    setShowFloorVideoPlaying(false);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    setCurrentImage("");
    setInteractiveBoxState1({ 0: false });
    setInteractiveBoxState2({ 0: false, 1: false });
    setCalcState({
      calc1BoxesDone: false,
      calc1NumpadAnswered: false,
      calc1NumpadValue: "",
      calc2BoxesDone: false,
      calc2NumpadAnswered: false,
      calc2NumpadValue: "",
      findings: []
    });
  };

  // Reset all state so that targetStep appears as if reached for the first time.
  // Steps: 0 question, 1 comprehend, 2 splash, 3 drag, 4 interactive box, 5 numpad, 6 final.
  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    if (targetStep <= 0) {
      setComprehendSubstep(0);
      setInteractiveBoxState1({ 0: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep === 1) {
      setComprehendSubstep(-1);
      setShowFloorRevealed(false);
      setShowFloorVideoPlaying(false);
      setInteractiveBoxState1({ 0: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep <= 3) {
      setInteractiveBoxState1({ 0: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep === 4) {
      setInteractiveBoxState1({ 0: false });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: false,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep === 5) {
      setInteractiveBoxState1({ 0: true });
      setInteractiveBoxState2({ 0: false, 1: false });
      setCalcState({
        calc1BoxesDone: true,
        calc1NumpadAnswered: false,
        calc1NumpadValue: "",
        calc2BoxesDone: false,
        calc2NumpadAnswered: false,
        calc2NumpadValue: "",
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
    
    // Reset interactive box state when entering step 4 (interactive box step)
    if (currentStep === 4) {
      setInteractiveBoxState1({ 0: false });
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

      // Comprehend substep 0: Show Floor — next disabled until user taps button and video ends
      if (comprehendSubstep === 0) {
        setCurrentHighlights([comprehendData.given.highlights[0]]);
        setHighlightColor("orange");
        if (showFloorRevealed) {
          if (comprehendData.imageAfterVideo) setCurrentImage(comprehendData.imageAfterVideo);
          if (stepData.navText) setDynamicNavText(stepData.navText);
          setIsNextDisabled(false);
        } else {
          if (comprehendData.navTextShowFloor) setDynamicNavText(comprehendData.navTextShowFloor);
          setIsNextDisabled(true);
          if (comprehendData.images && comprehendData.images[0]) {
            setCurrentImage(comprehendData.images[0]);
          }
        }
        return;
      }

      // Update highlights based on substep - one at a time
      if (comprehendSubstep < givenCount) {
        setCurrentHighlights([comprehendData.given.highlights[comprehendSubstep]]);
        setHighlightColor("orange");
      } else if (comprehendSubstep === givenCount) {
        setCurrentHighlights(comprehendData.toFind.highlights);
        setHighlightColor("purple");
      } else {
        setCurrentHighlights(null);
        setHighlightColor(null);
      }
      
      if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
        setCurrentImage(comprehendData.images[comprehendSubstep]);
      }
      
      setIsNextDisabled(false);
      
      const isLastSubstep = comprehendSubstep === total - 1;
      const isFirstToFindStep = comprehendSubstep === givenCount;
      const isLastGivenStep = comprehendSubstep === givenCount - 1;
      
      if (isLastSubstep) {
        if (stepData.navTextCorrect) setDynamicNavText(stepData.navTextCorrect);
      } else if (isLastGivenStep) {
        if (stepData.navToFind) setDynamicNavText(stepData.navToFind);
      } else {
        if (stepData.navText) setDynamicNavText(stepData.navText);
      }
    }
  }, [currentStep, comprehendSubstep, showFloorRevealed]);

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
      // Play congrats sound when moving from numpad (step 5) to final (step 6)
      if (currentStep === 5) {
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

  // Comprehend substep 0: start Show Floor video
  const onShowFloorClick = useCallback(() => {
    setShowFloorVideoPlaying(true);
    const comprehendData = APP_DATA.comprehend;
    if (comprehendData && comprehendData.imageAfterVideo) {
      setCurrentImage(comprehendData.imageAfterVideo);
    }
  }, []);

  // Comprehend substep 0: video ended — show image, enable next
  const onShowFloorVideoEnded = useCallback(() => {
    setShowFloorVideoPlaying(false);
    const comprehendData = APP_DATA.comprehend;
    if (comprehendData && comprehendData.imageAfterVideo) {
      setCurrentImage(comprehendData.imageAfterVideo);
    }
    setShowFloorRevealed(true);
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
        showFloorVideoPlaying: showFloorVideoPlaying,
        onShowFloorClick: (!showFloorVideoPlaying && !showFloorRevealed) ? onShowFloorClick : null,
        onShowFloorVideoEnded: onShowFloorVideoEnded,
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
