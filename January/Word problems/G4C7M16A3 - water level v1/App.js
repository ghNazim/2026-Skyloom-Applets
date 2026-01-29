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
  
  // Interactive box state for Step 4 (persistent across re-renders)
  const [interactiveBoxState, setInteractiveBoxState] = useState({ 0: false, 1: false });
  
  // Calculation state for Steps 5-9 (persistent)
  const [calcState, setCalcState] = useState({
    mcq1Answered: false,
    showNumpad1: false,
    numpad1Answered: false,
    numpad1Value: "",
    numpad2Answered: false,
    numpad2Value: "",
    mcq2Answered: false,
    showFinalRow: false,
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
    setInteractiveBoxState({ 0: false, 1: false });
    setCalcState({
      mcq1Answered: false,
      showNumpad1: false,
      numpad1Answered: false,
      numpad1Value: "",
      numpad2Answered: false,
      numpad2Value: "",
      mcq2Answered: false,
      showFinalRow: false,
      findings: []
    });
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
    
    // Reset interactive box state when entering step 4
    if (currentStep === 4) {
      setInteractiveBoxState({ 0: false, 1: false });
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
      if (comprehendSubstep === 0) {
        // First given item - show first orange highlight only
        setCurrentHighlights([comprehendData.given.highlights[0]]);
        setHighlightColor("orange");
      } else if (comprehendSubstep === 1) {
        // Second given item - show second orange highlight only
        setCurrentHighlights([comprehendData.given.highlights[1]]);
        setHighlightColor("orange");
      } else if (comprehendSubstep === givenCount) {
        // First toFind item - show purple highlight (remove orange)
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
      
      // If last substep, update nav text
      if (comprehendSubstep === total - 1) {
        if (stepData.navTextCorrect) {
          setDynamicNavText(stepData.navTextCorrect);
        }
      } else {
        if (stepData.navText) {
          setDynamicNavText(stepData.navText);
        }
      }
    }
  }, [currentStep, comprehendSubstep]);

  const handleNext = () => {
    if (window.playSound) window.playSound("click");
    const stepData = APP_DATA.steps[currentStep];
    
    // Handle step 1 - comprehend with substeps
    if (currentStep === 1 && stepData.isSubstepComprehend) {
      const totalSubsteps = getTotalComprehendSubsteps();
      if (comprehendSubstep < totalSubsteps - 1) {
        // Move to next substep
        setComprehendSubstep(prev => prev + 1);
        return;
      }
    }
    
    // Final step - restart
    if (currentStep === 9) {
      handleRestart();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (window.playSound) window.playSound("click");
    
    // Handle step 1 - comprehend with substeps
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
        interactiveBoxState: interactiveBoxState,
        setInteractiveBoxState: setInteractiveBoxState,
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
        nextSymbol: currentStep === 9 ? APP_DATA.start_over : "»"
      })
    )
  );
};
