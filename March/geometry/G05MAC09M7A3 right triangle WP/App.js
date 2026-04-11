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
  };

  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
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
        setCurrentImage("assets/question.svg");
        return;
      }

      // Update highlights for substeps
      if (comprehendSubstep < givenCount) {
        setCurrentHighlights([comprehendData.given.highlights[comprehendSubstep]]);
        setHighlightColor("orange");
      } else if (comprehendSubstep >= givenCount) {
        const toFindIdx = comprehendSubstep - givenCount;
        if (toFindIdx < comprehendData.toFind.highlights.length) {
          setCurrentHighlights([comprehendData.toFind.highlights[toFindIdx]]);
        } else {
          setCurrentHighlights(comprehendData.toFind.highlights);
        }
        setHighlightColor("purple");
      } else {
        setCurrentHighlights(null);
        setHighlightColor(null);
      }

      // Update image for substeps
      if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
        setCurrentImage(comprehendData.images[comprehendSubstep]);
      }

      setIsNextDisabled(false);

      const isLastSubstep = comprehendSubstep === total - 1;

      if (isLastSubstep && stepData.navTextCorrect) {
        setDynamicNavText(stepData.navTextCorrect);
      } else if (comprehendSubstep >= givenCount - 1 && stepData.navToFind) {
        setDynamicNavText(stepData.navToFind);
      } else if (stepData.navText) {
        setDynamicNavText(stepData.navText);
      }
    }
  }, [currentStep, comprehendSubstep]);

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

    const totalSteps = Object.keys(APP_DATA.steps).length - 1;
    if (currentStep === totalSteps) {
      handleRestart();
    } else {
      if (currentStep === totalSteps - 1) {
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
            { className: "comprehend-question-wrapper" },
            React.createElement(
              "div",
              { className: "comprehend-question-text" },
              APP_DATA.questionText
            ),
            React.createElement("img", {
              src: "assets/question.svg",
              alt: "Question diagram",
              className: "comprehend-question-image"
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
  const totalSteps = Object.keys(APP_DATA.steps).length - 1;
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
        nextSymbol: currentStep === totalSteps ? APP_DATA.start_over : "»"
      })
    )
  );
};
