const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

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
  
  // Interactive box states for substitution steps
  const [interactiveBoxState1, setInteractiveBoxState1] = useState({ 0: false, 1: false });
  const [interactiveBoxState2, setInteractiveBoxState2] = useState({ 0: false, 1: false });
  
  // Calculation state (persistent)
  const [calcState, setCalcState] = useState({
    finalNumpadAnswered: false,
    finalNumpadValue: "",
  });

  const comprehendCutSubstepIndex =
    APP_DATA.comprehend.cutSubstepIndex != null
      ? APP_DATA.comprehend.cutSubstepIndex
      : APP_DATA.comprehend.given.data.length - 1;
  const [cutAnimationEnded, setCutAnimationEnded] = useState(false);
  const [cutVisualKey, setCutVisualKey] = useState(0);
  const prevComprehendSubRef = useRef(comprehendSubstep);

  const handleCutVideoEnded = useCallback(() => {
    setCutAnimationEnded(true);
  }, []);

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
      finalNumpadAnswered: false,
      finalNumpadValue: "",
    });
    setCutAnimationEnded(false);
    setCutVisualKey(0);
    prevComprehendSubRef.current = 0;
  };

  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    setComprehendSubstep(targetStep === 1 ? -1 : 0);
    setInteractiveBoxState1({ 0: false, 1: false });
    setInteractiveBoxState2({ 0: false, 1: false });
    setCalcState({
      finalNumpadAnswered: false,
      finalNumpadValue: "",
    });
    setCutAnimationEnded(false);
    prevComprehendSubRef.current = targetStep === 1 ? -1 : 0;
    setCutVisualKey(0);
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
    
    // Reset substitution states when entering each substitution step
    if (currentStep === 5) {
      setInteractiveBoxState1({ 0: false, 1: false });
    }
    if (currentStep === 6) {
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
      const cutAnim = comprehendData.cutAnimation || {};
      const isCutSubstep = comprehendSubstep === comprehendCutSubstepIndex;
      const enteredCutSubstep =
        isCutSubstep && prevComprehendSubRef.current !== comprehendCutSubstepIndex;

      if (enteredCutSubstep) {
        setCutAnimationEnded(false);
        setCutVisualKey((k) => k + 1);
      }

      // Comprehend -1: no highlights, only question and title
      if (comprehendSubstep < 0) {
        setCurrentHighlights(null);
        setHighlightColor(null);
        if (stepData.navText) setDynamicNavText(stepData.navText);
        setIsNextDisabled(false);
        if (comprehendData.images && comprehendData.images[0]) {
          setCurrentImage(comprehendData.images[0]);
        }
        prevComprehendSubRef.current = comprehendSubstep;
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
      
      // Update image based on substep (cut substep uses video in Visual, not compre3)
      if (comprehendSubstep < givenCount && !isCutSubstep) {
        if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
          setCurrentImage(comprehendData.images[comprehendSubstep]);
        }
      } else if (comprehendSubstep >= givenCount) {
        if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
          setCurrentImage(comprehendData.images[comprehendSubstep]);
        }
      }
      
      const isLastSubstep = comprehendSubstep === total - 1;
      const isLastGivenStep = comprehendSubstep === givenCount - 1;

      if (isCutSubstep) {
        if (enteredCutSubstep || !cutAnimationEnded) {
          if (cutAnim.navTapCutter) setDynamicNavText(cutAnim.navTapCutter);
          setIsNextDisabled(true);
        } else {
          if (stepData.navToFind) setDynamicNavText(stepData.navToFind);
          setIsNextDisabled(false);
        }
        prevComprehendSubRef.current = comprehendSubstep;
        return;
      }

      // Enable next button for other comprehend substeps
      setIsNextDisabled(false);
      
      // Update nav text based on substep
      if (isLastSubstep) {
        // Last substep - show navTextCorrect (takes priority)
        if (stepData.navTextCorrect) {
          setDynamicNavText(stepData.navTextCorrect);
        }
      } else if (isLastGivenStep) {
        // Last given before cut substep is handled above; if no cut config, fall back
        if (stepData.navToFind) {
          setDynamicNavText(stepData.navToFind);
        }
      } else {
        // Given steps - show navText
        if (stepData.navText) {
          setDynamicNavText(stepData.navText);
        }
      }

      prevComprehendSubRef.current = comprehendSubstep;
    }
  }, [currentStep, comprehendSubstep, cutAnimationEnded, comprehendCutSubstepIndex]);

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
      // Play congrats sound when entering final step
      if (currentStep === 7) {
        if (window.playSound) window.playSound("congrats");
      } else {
        if (window.playSound) window.playSound("click");
      }
      // Pre-set comprehend substep before entering step 1 so both updates
      // are batched into a single render (prevents flash of substep-0 content)
      if (currentStep === 0) {
        setComprehendSubstep(-1);
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
          ),
          React.createElement("img", {
            src: APP_DATA.questionImage,
            alt: "Question figure",
            className: "comprehend-question-image",
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
        comprehendCutSubstepIndex: comprehendCutSubstepIndex,
        cutVisualKey: cutVisualKey,
        onCutVideoEnded: handleCutVideoEnded,
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
