const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state - start at step 0 (which is now the comprehend step)
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Substep for comprehend step
  const [comprehendSubstep, setComprehendSubstep] = useState(0);
  
  // Compute substep
  const [computeSubstep, setComputeSubstep] = useState(0);
  
  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");
  
  // Image state for visual panel
  const [currentImage, setCurrentImage] = useState("");

  const handleRestart = () => {
    if (window.playSound) window.playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setComprehendSubstep(0);
    setComputeSubstep(0);
    setIsAnswered(false);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentImage("");
  };
  
  // Calculate total comprehend substeps
  const getTotalComprehendSubsteps = () => {
    const comprehendData = APP_DATA.comprehend;
    return comprehendData.given.data.length + comprehendData.toFind.data.length;
  };
  
  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setIsAnswered(false);
    setDynamicQuestionText("");
    setDynamicNavText("");
    
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;
    
    // Set initial image
    if (stepData.image) {
      setCurrentImage(`${stepData.image}`);
    }
    
    // Handle next button state based on step type
    if (stepData.nextEnabled) {
      setIsNextDisabled(false);
    } else if (stepData.isMcq) {
      setIsNextDisabled(true);
    } else if (stepData.isSubstepComprehend) {
      // Enable next for comprehend substeps
      setIsNextDisabled(false);
    } else if (stepData.isCompute) {
      setIsNextDisabled(true);
    } else if (stepData.isSplash) {
      setIsNextDisabled(false);
    } else if (stepData.isFinalStep) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
    
    // Reset comprehend substep when entering step 1
    if (currentStep === 1) {
      setComprehendSubstep(0);
    }
    

    // Reset compute substep when entering step 7
    if (currentStep === 7) {
      setComputeSubstep(0);
    }
  }, [currentStep]);

  // Update nav text for reset/last substep of comprehend
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      // If last substep
      if (comprehendSubstep === total - 1) {
        if (stepData.navTextCorrect) {
          setDynamicNavText(stepData.navTextCorrect);
        }
      } else {
        // Otherwise reset to default if not set by something else
        // (Usually handled by step change, but dragging back might need this)
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
        // Update image based on substep
        const images = APP_DATA.comprehend.images;
        if (images[comprehendSubstep + 1]) {
          setCurrentImage(`${images[comprehendSubstep + 1]}`);
        }
        return;
      }
    }
    
    // Normal step progression
    if (currentStep === 8) {
      // Final step - restart
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
        const images = APP_DATA.comprehend.images;
        if (images[comprehendSubstep - 1]) {
          setCurrentImage(`${images[comprehendSubstep - 1]}`);
        }
        return;
      }
    }
    
    if (currentStep > 0) {
      setIsNextDisabled(true);
      setDynamicQuestionText("");
      setDynamicNavText("");
      setCurrentStep(prev => prev - 1);
    }
  };

  // Callback from MainCanvas to enable Next button
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
  
  // Handle compute substep update
  const updateComputeSubstep = useCallback((substep) => {
    setComputeSubstep(substep);
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

  // Splash Steps (2 and 4)
  if (APP_DATA.steps[currentStep]?.isSplash) {
    const splashKey = APP_DATA.steps[currentStep].splashKey;
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
          nextSymbol: currentStep === 8 ? APP_DATA.start_over : "»"
        })
      )
    );
  }

  // Main Canvas Steps (all steps now)
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
      React.createElement(MainCanvas, {
        step: currentStep,
        onEnableNext: enableNext,
        onUpdateTexts: updateTexts,
        onUpdateImage: updateImage,
        isAnswered: isAnswered,
        setIsAnswered: setIsAnswered,
        currentImage: currentImage,
        comprehendSubstep: comprehendSubstep,
        computeSubstep: computeSubstep,
        onUpdateComputeSubstep: updateComputeSubstep,
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
