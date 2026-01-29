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
  
  // Calculation state (persistent)
  const [calcState, setCalcState] = useState({
    step5Answered: false,
    step5Value: "",
    step6Answered: false,
    step6Value: "",
    step7Answered: false,
    step7Value: ""
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
    setCalcState({
      step5Answered: false,
      step5Value: "",
      step6Answered: false,
      step6Value: "",
      step7Answered: false,
      step7Value: ""
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
    if (currentStep === 8) {
      handleRestart();
    } else {
      // Play congrats sound when reaching final step
      if (currentStep === 7) {
        if (window.playSound) window.playSound("congrats");
      } else {
        if (window.playSound) window.playSound("click");
      }
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
      // Reset calcState for the current step and all steps after it
      // This ensures when going back, all subsequent states are reset
      setCalcState(prev => {
        const newState = { ...prev };
        
        // When leaving step 7, reset step 7
        // When leaving step 6, reset step 6 and step 7
        // When leaving step 5, reset step 5, step 6, and step 7
        
        if (currentStep === 7) {
          newState.step7Answered = false;
          newState.step7Value = "";
        } else if (currentStep === 6) {
          newState.step6Answered = false;
          newState.step6Value = "";
          newState.step7Answered = false;
          newState.step7Value = "";
        } else if (currentStep === 5) {
          newState.step5Answered = false;
          newState.step5Value = "";
          newState.step6Answered = false;
          newState.step6Value = "";
          newState.step7Answered = false;
          newState.step7Value = "";
        }
        
        // If going back to a step before step 5, reset everything
        if (currentStep - 1 < 5) {
          return {
            step5Answered: false,
            step5Value: "",
            step6Answered: false,
            step6Value: "",
            step7Answered: false,
            step7Value: ""
          };
        }
        
        return newState;
      });
      
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
  
  // Check if step 1 needs smaller font
  const getSmallerFont = () => {
    const stepData = APP_DATA.steps[currentStep];
    return stepData && stepData.smallerFont;
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
      highlightColor: getHighlightColor(),
      smallerFont: getSmallerFont()
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
        nextSymbol: currentStep === 8 ? APP_DATA.start_over : "»"
      })
    )
  );
};
