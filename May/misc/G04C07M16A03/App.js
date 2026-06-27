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
  
  // Video state for comprehend step
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    showVideo: false,
    showLastFrame: false,
    hasEnded: false
  });
  
  // Interactive box state for Step 4 (persistent across re-renders)
  const [interactiveBoxState, setInteractiveBoxState] = useState({ 0: false, 1: false });
  
  const initialCalcState = {
    mcq1Answered: false,
    showNumpad1: false,
    numpad1Answered: false,
    numpad1Value: "",
    numpad2Answered: false,
    numpad2Value: "",
    mcq2Answered: false,
    showFinalRow: false,
    findings: []
  };

  const [calcState, setCalcState] = useState(initialCalcState);

  const getCalcStateForStep = (stepNum) => {
    const calcData = APP_DATA.calculation;
    if (stepNum < 5) return initialCalcState;
    if (stepNum === 5) return { ...initialCalcState };
    if (stepNum === 6) {
      return {
        ...initialCalcState,
        mcq1Answered: true,
        showNumpad1: true,
        numpad1Answered: true,
        numpad1Value: calcData.numpad1.answer,
        findings: calcData.mcq1 ? [calcData.mcq1.finding] : []
      };
    }
    if (stepNum === 7) {
      return {
        ...initialCalcState,
        mcq1Answered: true,
        showNumpad1: true,
        numpad1Answered: true,
        numpad1Value: calcData.numpad1.answer,
        numpad2Answered: true,
        numpad2Value: calcData.numpad2.answer,
        findings: calcData.mcq1 ? [calcData.mcq1.finding] : []
      };
    }
    if (stepNum === 8) {
      return {
        ...initialCalcState,
        mcq1Answered: true,
        showNumpad1: true,
        numpad1Answered: true,
        numpad1Value: calcData.numpad1.answer,
        numpad2Answered: true,
        numpad2Value: calcData.numpad2.answer,
        mcq2Answered: false,
        showFinalRow: false,
        findings: calcData.mcq1 ? [calcData.mcq1.finding] : []
      };
    }
    if (stepNum >= 9) {
      return {
        ...initialCalcState,
        mcq1Answered: true,
        showNumpad1: true,
        numpad1Answered: true,
        numpad1Value: calcData.numpad1.answer,
        numpad2Answered: true,
        numpad2Value: calcData.numpad2.answer,
        mcq2Answered: true,
        showFinalRow: true,
        findings: calcData.mcq1 ? [calcData.mcq1.finding] : []
      };
    }
    return initialCalcState;
  };

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
    setVideoState({
      isPlaying: false,
      showVideo: false,
      showLastFrame: false,
      hasEnded: false
    });
    setInteractiveBoxState({ 0: false, 1: false });
    setCalcState(initialCalcState);
  };
  
  // Total comprehend substeps: 1 blank + given + toFind
  const getTotalComprehendSubsteps = () => {
    const comprehendData = APP_DATA.comprehend;
    return 1 + comprehendData.given.data.length + comprehendData.toFind.data.length;
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
      // Reset video state
      setVideoState({
        isPlaying: false,
        showVideo: false,
        showLastFrame: false,
        hasEnded: false
      });
    }
    
    // Reset interactive box state when entering step 4
    if (currentStep === 4) {
      setInteractiveBoxState({ 0: false, 1: false });
    }
  }, [currentStep]);

  // Update nav text and highlights for comprehend substeps
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      const comprehendData = APP_DATA.comprehend;
      const givenCount = comprehendData.given.data.length;
      
      if (comprehendSubstep === 0) {
        setCurrentHighlights(comprehendData.blankSubstepHighlight ? [comprehendData.blankSubstepHighlight] : null);
        setHighlightColor("orange");
      } else if (comprehendSubstep >= 1 && comprehendSubstep <= givenCount) {
        const idx = comprehendSubstep - 1;
        setCurrentHighlights(comprehendData.given.highlights[idx] ? [comprehendData.given.highlights[idx]] : null);
        setHighlightColor("orange");
      } else if (comprehendSubstep > givenCount) {
        setCurrentHighlights(comprehendData.toFind.highlights);
        setHighlightColor("purple");
      } else {
        setCurrentHighlights(null);
        setHighlightColor(null);
      }
      
      if (comprehendData.images && comprehendSubstep > 0 && comprehendData.images[comprehendSubstep]) {
        setCurrentImage(comprehendData.images[comprehendSubstep]);
      }
      
      if (comprehendData.video && comprehendData.video.substeps[comprehendSubstep]) {
        const videoConfig = comprehendData.video.substeps[comprehendSubstep];
        const isPlayingSubstep = videoConfig.isPlaying;
        setVideoState(prev => {
          const hasEnded = isPlayingSubstep ? prev.hasEnded : false;
          const videoEndedOnThisSubstep = isPlayingSubstep && hasEnded;
          return {
            ...prev,
            isPlaying: videoEndedOnThisSubstep ? false : videoConfig.isPlaying,
            showVideo: videoConfig.showVideo,
            showLastFrame: videoEndedOnThisSubstep ? true : videoConfig.showLastFrame,
            hasEnded: hasEnded
          };
        });
        if (isPlayingSubstep) {
          if (!videoState.hasEnded) {
            setIsNextDisabled(true);
          }
        } else {
          setIsNextDisabled(false);
        }
      } else {
        setIsNextDisabled(false);
      }
      
      if (comprehendSubstep === total - 1) {
        setDynamicNavText(stepData.navTextCorrect || stepData.navText);
      } else if (comprehendSubstep === givenCount && stepData.navToFind) {
        setDynamicNavText(stepData.navToFind);
      } else {
        setDynamicNavText(stepData.navText || "");
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
    
    if (currentStep === 1) {
      if (comprehendSubstep > 0) {
        setComprehendSubstep(prev => prev - 1);
        return;
      }
    }
    
    if (currentStep > 0) {
      const targetStep = currentStep - 1;
      if (targetStep <= 4) {
        setInteractiveBoxState({ 0: false, 1: false });
      }
      setCalcState(getCalcStateForStep(targetStep));
      setIsNextDisabled(true);
      setDynamicQuestionText("");
      setDynamicNavText("");
      setCurrentHighlights(null);
      setHighlightColor(null);
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
  
  // Callback when video ends (playing substep in comprehend)
  const handleVideoEnded = useCallback(() => {
    setVideoState(prev => ({
      ...prev,
      isPlaying: false,
      hasEnded: true,
      showLastFrame: true
    }));
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
        setCalcState: setCalcState,
        videoState: videoState,
        onVideoEnded: handleVideoEnded
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
