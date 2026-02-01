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
  
  // Calculation state (persistent across steps)
  const [calcState, setCalcState] = useState({
    // Findings list that accumulates through steps
    findings: [],
    // Track which steps have been completed
    completedSteps: {},
    // MCQ states
    mcqStep3Answered: false,
    mcqStep13Answered: false,
    // Step-specific values
    step4Values: ["", ""],
    step5Value: "",
    step6Value: "",
    step7Value: "",
    step8Value: "",
    step10Value: "",
    step12Value: "",
    step13Values: ["", ""],
    // Current box index for multi-box steps
    currentBoxIndex: 0
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
    setCalcState({
      findings: [],
      completedSteps: {},
      mcqStep3Answered: false,
      mcqStep13Answered: false,
      step4Values: ["", ""],
      step5Value: "",
      step6Value: "",
      step7Value: "",
      step8Value: "",
      step10Value: "",
      step12Value: "",
      step13Values: ["", ""],
      currentBoxIndex: 0
    });
  };
  
  // Calculate total comprehend substeps based on nested structure
  const getTotalComprehendSubsteps = () => {
    const comprehendData = APP_DATA.comprehend;
    let total = 0;
    
    // Count all subitems in given data
    comprehendData.given.data.forEach(item => {
      total += item.subitems.length;
    });
    
    // Add toFind items
    total += comprehendData.toFind.data.length;
    
    return total;
  };
  
  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;
    
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
    
    // Reset current box index for multi-box steps
    if (currentStep === 4 || currentStep === 13) {
      setCalcState(prev => ({ ...prev, currentBoxIndex: 0 }));
    }
  }, [currentStep]);

  // Update highlights for comprehend substeps
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      const comprehendData = APP_DATA.comprehend;
      
      // Calculate which highlight to show based on substep
      // Flatten the structure: count subitems cumulatively
      let cumulativeIndex = 0;
      let highlightIndex = -1;
      let isToFind = false;
      
      for (let i = 0; i < comprehendData.given.data.length; i++) {
        const item = comprehendData.given.data[i];
        for (let j = 0; j < item.subitems.length; j++) {
          if (cumulativeIndex === comprehendSubstep) {
            highlightIndex = cumulativeIndex;
          }
          cumulativeIndex++;
        }
      }
      
      // Check if we're in toFind section
      const givenTotal = cumulativeIndex;
      if (comprehendSubstep >= givenTotal) {
        isToFind = true;
        highlightIndex = comprehendSubstep - givenTotal;
      }
      
      // Set highlights
      if (!isToFind && highlightIndex >= 0 && highlightIndex < comprehendData.given.highlights.length) {
        setCurrentHighlights([comprehendData.given.highlights[highlightIndex]]);
        setHighlightColor("orange");
      } else if (isToFind) {
        setCurrentHighlights(comprehendData.toFind.highlights);
        setHighlightColor("purple");
      } else {
        setCurrentHighlights(null);
        setHighlightColor(null);
      }
      
      // Enable next button for comprehend substeps
      setIsNextDisabled(false);
      
      // Update nav text
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
          text: splashData.text,
          step: currentStep,
          showQuestion: stepData.splashWithQuestion,
          questionText: APP_DATA.questionText
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
        nextSymbol: currentStep === 14 ? APP_DATA.start_over : "»"
      })
    )
  );
};
