const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [comprehendSubstep, setComprehendSubstep] = useState(-1);
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");
  const [currentHighlights, setCurrentHighlights] = useState(null);
  const [highlightColor, setHighlightColor] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  // Kept for compatibility with existing child props.
  const [showFloorButtonClicked, setShowFloorButtonClicked] = useState(false);
  const [showFloorVideoEnded, setShowFloorVideoEnded] = useState(false);

  const [comprehendTileMagnifyClicked, setComprehendTileMagnifyClicked] = useState(false);
  const [comprehendTileMagnifyVideoEnded, setComprehendTileMagnifyVideoEnded] = useState(false);
  const [step3FractionTapped, setStep3FractionTapped] = useState(false);
  const [step3McqAnswered, setStep3McqAnswered] = useState(false);

  const [calcState, setCalcState] = useState({
    step4Revealed: false,
    step4Answered: false,
    step4Value: "",
    step5Revealed: false,
    step5Answered: false,
    step5Value: "",
    step6McqAnswered: false,
    step7NumpadAnswered: false,
    step7Value: "",
    step7Simplified: false,
    step8NumpadAnswered: false,
    step8Value: "",
  });

  const handleRestart = () => {
    if (window.playSound) window.playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setComprehendSubstep(-1);
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
      step4Revealed: false,
      step4Answered: false,
      step4Value: "",
      step5Revealed: false,
      step5Answered: false,
      step5Value: "",
      step6McqAnswered: false,
      step7NumpadAnswered: false,
      step7Value: "",
      step7Simplified: false,
      step8NumpadAnswered: false,
      step8Value: "",
    });
  };

  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    const defaultCalcState = {
      step4Revealed: false,
      step4Answered: false,
      step4Value: "",
      step5Revealed: false,
      step5Answered: false,
      step5Value: "",
      step6McqAnswered: false,
      step7NumpadAnswered: false,
      step7Value: "",
      step7Simplified: false,
      step8NumpadAnswered: false,
      step8Value: "",
    };

    if (targetStep <= 1) {
      setComprehendSubstep(targetStep === 1 ? -1 : 0);
      setShowFloorButtonClicked(false);
      setShowFloorVideoEnded(false);
      setComprehendTileMagnifyClicked(false);
      setComprehendTileMagnifyVideoEnded(false);
      setCalcState(defaultCalcState);
      return;
    }
    if (targetStep <= 3) return;
    if (targetStep === 4) return setCalcState(defaultCalcState);
    if (targetStep === 5) return setCalcState({ ...defaultCalcState, step4Answered: true, step4Revealed: true, step4Value: APP_DATA.step4Calc.answer });
    if (targetStep === 6) {
      return setCalcState({
        ...defaultCalcState,
        step4Answered: true,
        step4Revealed: true,
        step4Value: APP_DATA.step4Calc.answer,
        step5Answered: true,
        step5Revealed: true,
        step5Value: APP_DATA.step5Calc.answer,
      });
    }
    if (targetStep === 7) {
      return setCalcState({
        ...defaultCalcState,
        step4Answered: true,
        step4Revealed: true,
        step4Value: APP_DATA.step4Calc.answer,
        step5Answered: true,
        step5Revealed: true,
        step5Value: APP_DATA.step5Calc.answer,
        step6McqAnswered: true,
      });
    }
    if (targetStep === 8) {
      return setCalcState({
        ...defaultCalcState,
        step4Answered: true,
        step4Revealed: true,
        step4Value: APP_DATA.step4Calc.answer,
        step5Answered: true,
        step5Revealed: true,
        step5Value: APP_DATA.step5Calc.answer,
        step6McqAnswered: true,
        step7NumpadAnswered: true,
        step7Value: APP_DATA.step7Calc.numpadAnswer,
        step7Simplified: true,
      });
    }
    if (targetStep === 9) {
      return setCalcState({
        ...defaultCalcState,
        step4Answered: true,
        step4Revealed: true,
        step4Value: APP_DATA.step4Calc.answer,
        step5Answered: true,
        step5Revealed: true,
        step5Value: APP_DATA.step5Calc.answer,
        step6McqAnswered: true,
        step7NumpadAnswered: true,
        step7Value: APP_DATA.step7Calc.numpadAnswer,
        step7Simplified: true,
        step8NumpadAnswered: true,
        step8Value: APP_DATA.step8Calc.numpadAnswer,
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
    
    if (currentStep === 1) {
      setComprehendSubstep(-1);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      const comprehendData = APP_DATA.comprehend;
      const givenCount = comprehendData.given.data.length;

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

      // Substep 2: tile magnify (show scale.mp4 and gate next)
      if (comprehendSubstep === 2) {
        const substep2Highlight = comprehendTileMagnifyClicked
          ? comprehendData.given.highlights[2]
          : (comprehendData.substep2InitialHighlight || comprehendData.given.highlights[2]);
        setCurrentHighlights([substep2Highlight]);
        setHighlightColor("orange");
        if (!comprehendTileMagnifyClicked) {
          setCurrentImage(comprehendData.imageSubstep2Before || comprehendData.images[2]);
          setDynamicNavText(comprehendData.navSubstep2TapTile || stepData.navText);
          setIsNextDisabled(true);
        } else if (!comprehendTileMagnifyVideoEnded) {
          setDynamicNavText(comprehendData.navSubstep2TapTile || stepData.navText);
          setIsNextDisabled(true);
        } else {
          setCurrentImage(comprehendData.images[2] || "");
          setDynamicNavText(stepData.navToFind || stepData.navText || "");
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
  }, [currentStep, comprehendSubstep, comprehendTileMagnifyClicked, comprehendTileMagnifyVideoEnded]);

  const handleNext = () => {
    const stepData = APP_DATA.steps[currentStep];
    
    if (currentStep === 1 && stepData.isSubstepComprehend) {
      const totalSubsteps = getTotalComprehendSubsteps();
      if (comprehendSubstep < totalSubsteps - 1) {
        if (window.playSound) window.playSound("click");
        setComprehendSubstep(prev => prev + 1);
        return;
      }
    }
    
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
    
    if (currentStep === 1) {
      if (comprehendSubstep > -1) {
        setComprehendSubstep(prev => prev - 1);
        return;
      }
    }
    
    if (currentStep <= 0) return;
    
    const targetStep = currentStep - 1;
    resetStateForStep(targetStep);
    setCurrentStep(targetStep);
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

  const onVideoEnded = useCallback(() => {
    setShowFloorVideoEnded(true);
  }, []);

  const onTileMagnifyClick = useCallback(() => {
    setComprehendTileMagnifyClicked(true);
  }, []);

  const onTileMagnifyVideoEnded = useCallback(() => {
    setComprehendTileMagnifyVideoEnded(true);
  }, []);

  // Handlers for dynamic text updates
  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

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
  
  const getHighlights = () => {
    if (currentStep === 1 && comprehendSubstep >= 0) {
      return currentHighlights;
    }
    return null;
  };
  
  const getHighlightColor = () => {
    if (currentStep === 1 && comprehendSubstep >= 0) {
      return highlightColor;
    }
    return null;
  };

  const stepData = APP_DATA.steps[currentStep];

  if (stepData?.isSplash) {
    const splashKey = stepData.splashKey;
    const splashData = APP_DATA.splash[splashKey];
    let splashText = splashData.text || "";
    if (splashKey === "step2") splashText = splashData.text || "";
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
