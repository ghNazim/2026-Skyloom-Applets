const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  // Substep for comprehend step
  const [comprehendSubstep, setComprehendSubstep] = useState(-1);
  
  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");
  
  // Highlight state for question panel
  const [currentHighlights, setCurrentHighlights] = useState(null);
  const [highlightColor, setHighlightColor] = useState(null);
  
  // Image state for visual panel
  const [currentImage, setCurrentImage] = useState("");
  
  // Comprehend substep 0: Show Floor button → video → animEnd.png
  const [showFloorButtonClicked, setShowFloorButtonClicked] = useState(false);
  const [showFloorVideoEnded, setShowFloorVideoEnded] = useState(false);
  // Comprehend substep 3: tile magnify (compre4in → video → compre4)
  const [comprehendTileMagnifyClicked, setComprehendTileMagnifyClicked] = useState(false);
  const [comprehendTileMagnifyVideoEnded, setComprehendTileMagnifyVideoEnded] = useState(false);
  // Step 3: interactive box (rewrite division as fraction)
  const [step3FractionTapped, setStep3FractionTapped] = useState(false);
  const [step3McqAnswered, setStep3McqAnswered] = useState(false);
  
  // Calculation state (persistent)
  const [calcState, setCalcState] = useState({
    // Step 5: tap-to-reveal then numpad (var 0,1) or direct value (var 2)
    step5BoxIndex: 0,
    step5Revealed: [false, false, false],
    step5Filled: [false, false, false],
    step5Values: ["", "", ""],
    step5AllDone: false,
    // Step 6: conversion MCQ
    step6McqAnswered: false,
    // Step 7: numpad for 10000
    step7NumpadAnswered: false,
    step7Value: "",
    // Step 8: Simplify clicked, then numpad for final cost
    step8SimplifyClicked: false,
    step8NumpadAnswered: false,
    step8Value: "",
    // Findings list (for display in right panel)
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
    setShowFloorButtonClicked(false);
    setShowFloorVideoEnded(false);
    setComprehendTileMagnifyClicked(false);
    setComprehendTileMagnifyVideoEnded(false);
    setStep3FractionTapped(false);
    setStep3McqAnswered(false);
    setCalcState({
      step5BoxIndex: 0,
      step5Revealed: [false, false, false],
      step5Filled: [false, false, false],
      step5Values: ["", "", ""],
      step5AllDone: false,
      step6McqAnswered: false,
      step7NumpadAnswered: false,
      step7Value: "",
      step8SimplifyClicked: false,
      step8NumpadAnswered: false,
      step8Value: "",
      findings: []
    });
  };

  // Reset all state so that targetStep appears as if reached for the first time.
  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    const defaultCalcState = {
      step5BoxIndex: 0,
      step5Revealed: [false, false, false],
      step5Filled: [false, false, false],
      step5Values: ["", "", ""],
      step5AllDone: false,
      step6McqAnswered: false,
      step7NumpadAnswered: false,
      step7Value: "",
      step8SimplifyClicked: false,
      step8NumpadAnswered: false,
      step8Value: "",
      findings: []
    };

    if (targetStep <= 0) {
      setComprehendSubstep(0);
      setShowFloorButtonClicked(false);
      setShowFloorVideoEnded(false);
      setComprehendTileMagnifyClicked(false);
      setComprehendTileMagnifyVideoEnded(false);
      setStep3FractionTapped(false);
      setStep3McqAnswered(false);
      setCalcState(defaultCalcState);
      return;
    }
    if (targetStep === 1) {
      setComprehendSubstep(-1);
      setShowFloorButtonClicked(false);
      setShowFloorVideoEnded(false);
      setComprehendTileMagnifyClicked(false);
      setComprehendTileMagnifyVideoEnded(false);
      setStep3FractionTapped(false);
      setStep3McqAnswered(false);
      setCalcState(defaultCalcState);
      return;
    }
    if (targetStep <= 3) {
      setStep3FractionTapped(false);
      setStep3McqAnswered(false);
      setCalcState(defaultCalcState);
      return;
    }
    if (targetStep === 4) {
      setCalcState(defaultCalcState);
      return;
    }
    if (targetStep === 5) {
      setCalcState({
        ...defaultCalcState,
        step5BoxIndex: 0,
        step5Revealed: [false, false, false],
        step5Filled: [false, false, false],
        step5Values: ["", "", ""],
        step5AllDone: false,
        findings: []
      });
      return;
    }
    if (targetStep === 6) {
      const step7Data = APP_DATA.step7Calc;
      setCalcState({
        ...defaultCalcState,
        step5AllDone: true,
        step6McqAnswered: false,
        findings: step7Data ? step7Data.findingsList : []
      });
      return;
    }
    if (targetStep === 7) {
      const step7Data = APP_DATA.step7Calc;
      setCalcState({
        ...defaultCalcState,
        step5AllDone: true,
        step6McqAnswered: true,
        step7NumpadAnswered: false,
        step7Value: "",
        findings: step7Data ? step7Data.findingsList : []
      });
      return;
    }
    if (targetStep === 8) {
      const step7Data = APP_DATA.step7Calc;
      setCalcState({
        ...defaultCalcState,
        step5AllDone: true,
        step6McqAnswered: true,
        step7NumpadAnswered: true,
        step7Value: step7Data ? step7Data.numpadAnswer : "10000",
        step8SimplifyClicked: false,
        step8NumpadAnswered: false,
        step8Value: "",
        findings: step7Data ? step7Data.findingsList : []
      });
      return;
    }
    if (targetStep === 9) {
      const step7Data = APP_DATA.step7Calc;
      setCalcState({
        ...defaultCalcState,
        step5AllDone: true,
        step6McqAnswered: true,
        step7NumpadAnswered: true,
        step7Value: step7Data ? step7Data.numpadAnswer : "10000",
        step8SimplifyClicked: true,
        step8NumpadAnswered: true,
        step8Value: APP_DATA.step8Calc ? APP_DATA.step8Calc.numpadAnswer : "16875000",
        findings: step7Data ? step7Data.findingsList : []
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
  }, [currentStep]);

  // Step 5: image depends on which variable we're on (h1, h2, h3)
  useEffect(() => {
    if (currentStep === 5 && APP_DATA.step5Calc && APP_DATA.step5Calc.step5Images) {
      const idx = Math.min(calcState.step5BoxIndex, APP_DATA.step5Calc.step5Images.length - 1);
      setCurrentImage(APP_DATA.step5Calc.step5Images[idx] || APP_DATA.step5Calc.step5Images[0]);
    }
  }, [currentStep, calcState.step5BoxIndex]);

  // Update nav text and next state for comprehend substeps
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

      // —— Substep 0: Show Floor button → video → animEnd, then enable next ——
      if (comprehendSubstep === 0) {
        setCurrentHighlights([comprehendData.given.highlights[0]]);
        setHighlightColor("orange");
        if (!showFloorButtonClicked) {
          setCurrentImage(comprehendData.images[0] || "");
          setDynamicNavText(comprehendData.navSubstep0ShowFloor || stepData.navText);
          setIsNextDisabled(true);
        } else if (!showFloorVideoEnded) {
          setDynamicNavText(comprehendData.navSubstep0ShowFloor || stepData.navText);
          setIsNextDisabled(true);
        } else {
          setCurrentImage(comprehendData.imageAfterVideo || comprehendData.images[0]);
          setDynamicNavText(stepData.navText || "");
          setIsNextDisabled(false);
        }
        return;
      }

      // —— Substep 3: tile magnify (compre4in → video → compre4), then enable next ——
      if (comprehendSubstep === 3) {
        setCurrentHighlights([comprehendData.given.highlights[3]]);
        setHighlightColor("orange");
        if (!comprehendTileMagnifyClicked) {
          setCurrentImage(comprehendData.imageSubstep3Before || comprehendData.images[3]);
          setDynamicNavText(comprehendData.navSubstep3TapTile || stepData.navText);
          setIsNextDisabled(true);
        } else if (!comprehendTileMagnifyVideoEnded) {
          setDynamicNavText(comprehendData.navSubstep3TapTile || stepData.navText);
          setIsNextDisabled(true);
        } else {
          setCurrentImage(comprehendData.images[3] || "");
          setDynamicNavText(stepData.navText || "");
          setIsNextDisabled(false);
        }
        return;
      }

      // Update highlights for other substeps
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

      // Update image for other substeps
      if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
        setCurrentImage(comprehendData.images[comprehendSubstep]);
      }

      setIsNextDisabled(false);

      const isLastSubstep = comprehendSubstep === total - 1;
      const isFirstToFindStep = comprehendSubstep === givenCount;
      const isLastGivenStep = comprehendSubstep === givenCount - 1;

      if (isLastSubstep && stepData.navTextCorrect) {
        setDynamicNavText(stepData.navTextCorrect);
      } else if (isLastGivenStep && stepData.navToFind) {
        setDynamicNavText(stepData.navToFind);
      } else if (stepData.navText) {
        setDynamicNavText(stepData.navText);
      }
    }
  }, [currentStep, comprehendSubstep, showFloorButtonClicked, showFloorVideoEnded, comprehendTileMagnifyClicked, comprehendTileMagnifyVideoEnded]);

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
    
    // Final step (9) - play congrats and restart
    if (currentStep === 9) {
      handleRestart();
    } else {
      if (currentStep === 8) {
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

  // Comprehend substep 0: after "Show Floor" video ends — just enable Next.
  // The video stays paused on its last frame; no image switch until the user navigates.
  const onVideoEnded = useCallback(() => {
    setShowFloorVideoEnded(true);
  }, []);

  // Comprehend substep 3: after tile magnify tap, start video
  const onTileMagnifyClick = useCallback(() => {
    setComprehendTileMagnifyClicked(true);
  }, []);

  // Comprehend substep 3: after tile magnify video ends — just enable Next.
  // The video stays paused on its last frame; no image switch until the user navigates.
  const onTileMagnifyVideoEnded = useCallback(() => {
    setComprehendTileMagnifyVideoEnded(true);
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
    let splashText = splashData.text || "";
    if (splashKey === "step4" && typeof window.getFractionNotationHtml === "function") {
      const step3Data = APP_DATA.step3Calc;
      const numLabel = (step3Data && step3Data.areaOfFloor) || (APP_DATA.labels && APP_DATA.labels.areaOfFloor) || "";
      const denLabel = (step3Data && step3Data.areaOfOneTile) || (APP_DATA.labels && APP_DATA.labels.areaOfOneTile) || "";
      const costLabel = (step3Data && step3Data.costOfOneTile) || (APP_DATA.labels && APP_DATA.labels.costOfOneTile) || "";
      const fracHtml = window.getFractionNotationHtml(numLabel, denLabel);
      const textKey = splashData.textKey;
      const restText = (APP_DATA.splashText && textKey && APP_DATA.splashText[textKey]) ? APP_DATA.splashText[textKey] : "";
      const totalCostLabel = (APP_DATA.labels && APP_DATA.labels.totalCost) || "Total cost";
      splashText = totalCostLabel + " = " + fracHtml + " × " + costLabel + "<br>" + restText;
    }
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
          text: splashText,
          step: currentStep,
          alt: APP_DATA.altTexts && APP_DATA.altTexts.splashImage
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
        showFloorButtonClicked: showFloorButtonClicked,
        setShowFloorButtonClicked: setShowFloorButtonClicked,
        showFloorVideoEnded: showFloorVideoEnded,
        onVideoEnded: onVideoEnded,
        comprehendTileMagnifyClicked: comprehendTileMagnifyClicked,
        comprehendTileMagnifyVideoEnded: comprehendTileMagnifyVideoEnded,
        onTileMagnifyClick: onTileMagnifyClick,
        onTileMagnifyVideoEnded: onTileMagnifyVideoEnded,
        step3McqAnswered: step3McqAnswered,
        setStep3McqAnswered: setStep3McqAnswered,
        step3FractionTapped: step3FractionTapped,
        setStep3FractionTapped: setStep3FractionTapped,
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
