const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [comprehendSubstep, setComprehendSubstep] = useState(-1);
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  // MCQ state (steps 1, 4, 5)
  const [mcqSelectedIndex, setMcqSelectedIndex] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);

  // Step 3: perpendicular dots
  const [perpLeftClicked, setPerpLeftClicked] = useState(false);
  const [perpRightClicked, setPerpRightClicked] = useState(false);
  const perpBothComplete = perpLeftClicked && perpRightClicked;

  // Step 12: when Compute2 completes, show "Number of cans of paint = 13.84" in visual info list
  const [step12ShowCansInfo, setStep12ShowCansInfo] = useState(false);

  const handleRestart = () => {
    if (window.playSound) window.playSound("click");
    setCurrentStep(0);
    setComprehendSubstep(-1);
    setIsNextDisabled(false);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentImage("");
    setMcqSelectedIndex(null);
    setMcqCorrect(false);
    setPerpLeftClicked(false);
    setPerpRightClicked(false);
    setStep12ShowCansInfo(false);
  };

  const getTotalComprehendSubsteps = () => {
    const data = APP_DATA.comprehend;
    return (data.infoList && data.infoList.length) ? data.infoList.length : 0;
  };

  // On step change: set initial image and next state
  useEffect(() => {
    setDynamicQuestionText("");
    setDynamicNavText("");

    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;

    if (currentStep === 0) {
      setComprehendSubstep(-1);
      setCurrentImage(APP_DATA.comprehend.defaultImage || "");
      setIsNextDisabled(false);
      setDynamicQuestionText(APP_DATA.comprehend.q || "");
      setDynamicNavText(APP_DATA.comprehend.nav || "");
    } else if (currentStep === 1) {
      setCurrentImage(APP_DATA.mcq.defaultImage || "");
      setIsNextDisabled(true);
      setDynamicNavText(APP_DATA.mcq.nav || "");
    } else if (currentStep === 3) {
      setPerpLeftClicked(false);
      setPerpRightClicked(false);
      setCurrentImage(APP_DATA.perpendiculars.defaultImage || "");
      const onlyTextData = APP_DATA.onlyText.step3;
      setDynamicQuestionText(onlyTextData.q || "");
      setDynamicNavText(onlyTextData.nav || "");
      setIsNextDisabled(true);
    } else if (currentStep === 4) {
      setMcqSelectedIndex(null);
      setMcqCorrect(false);
      setCurrentImage(APP_DATA.mcq2.defaultImage || "");
      setDynamicNavText(APP_DATA.mcq2.nav || "");
      setIsNextDisabled(true);
    } else if (currentStep === 5) {
      setMcqSelectedIndex(null);
      setMcqCorrect(false);
      setCurrentImage(APP_DATA.mcq3.defaultImage || "");
      setDynamicNavText(APP_DATA.mcq3.nav || "");
      setIsNextDisabled(true);
    } else if (currentStep === 6) {
      const tableStep = APP_DATA.tableStep || {};
      setCurrentImage(tableStep.image || "");
      setDynamicNavText(tableStep.nav || "");
      setIsNextDisabled(true);
    } else if (currentStep === 7) {
      setMcqSelectedIndex(null);
      setMcqCorrect(false);
      setCurrentImage(APP_DATA.mcq4.defaultImage || "");
      setDynamicNavText(APP_DATA.mcq4.nav || "");
      setIsNextDisabled(true);
    } else if (currentStep === 8) {
      setMcqSelectedIndex(null);
      setMcqCorrect(false);
      setCurrentImage(APP_DATA.mcq5.defaultImage || "");
      setDynamicNavText(APP_DATA.mcq5.nav || "");
      setIsNextDisabled(true);
    } else if (currentStep === 9) {
      const computeConfig = APP_DATA.compute1Config || {};
      setCurrentImage(computeConfig.defaultImage || "assets/mcq5.svg");
      setDynamicNavText("");
      setIsNextDisabled(true);
    } else if (currentStep === 10) {
      // Splash step – next enabled by config
    } else if (currentStep === 11) {
      setMcqSelectedIndex(null);
      setMcqCorrect(false);
      const visual = APP_DATA.compute2Visual || {};
      setCurrentImage(visual.image || "assets/compute2.svg");
      setDynamicNavText((APP_DATA.mcq6 && APP_DATA.mcq6.nav) || "");
      setIsNextDisabled(true);
    } else if (currentStep === 12) {
      setStep12ShowCansInfo(false);
      const visual = APP_DATA.compute2Visual || {};
      setCurrentImage(visual.image || "assets/compute2.svg");
      setDynamicNavText("");
      setIsNextDisabled(true);
    } else if (currentStep === 13) {
      setMcqSelectedIndex(null);
      setMcqCorrect(false);
      const visual = APP_DATA.compute2Visual || {};
      setCurrentImage(visual.image || "assets/compute2.svg");
      setDynamicNavText((APP_DATA.mcq7 && APP_DATA.mcq7.nav) || "");
      setIsNextDisabled(true);
    } else if (currentStep === 14) {
      const summary = APP_DATA.step14 || {};
      setCurrentImage(summary.image || "assets/compre0.svg");
      setIsNextDisabled(false);
    }
  }, [currentStep]);

  // Comprehend substep: update image, nav, question panel
  useEffect(() => {
    if (currentStep !== 0) return;

    const comprehendData = APP_DATA.comprehend;
    const total = getTotalComprehendSubsteps();

    if (comprehendSubstep < 0) {
      setCurrentImage(comprehendData.defaultImage || "");
      setDynamicNavText(comprehendData.nav || "");
      setIsNextDisabled(false);
      return;
    }

    if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
      setCurrentImage(comprehendData.images[comprehendSubstep]);
    }
    const isLastSubstep = comprehendSubstep === total - 1;
    setDynamicNavText(isLastSubstep ? (comprehendData.navFinal || "") : (comprehendData.nav || ""));
    setIsNextDisabled(false);
  }, [currentStep, comprehendSubstep]);

  // Step 1, 4, 5: when MCQ correct, update nav (image only changes for step 1)
  const getMcqData = (s) => {
    const stepData = APP_DATA.steps[s];
    if (!stepData || !stepData.mcqKey) return null;
    return APP_DATA[stepData.mcqKey] || null;
  };

  useEffect(() => {
    if (!mcqCorrect) return;
    const mcqData = getMcqData(currentStep);
    if (!mcqData) return;
    setDynamicNavText(mcqData.navFinal || "");
    if (currentStep === 1) {
      setCurrentImage(mcqData.correctImage || mcqData.defaultImage || "");
    }
    // Step 8: no image change on correct
  }, [currentStep, mcqCorrect]);

  // Step 7: show image per selected option
  useEffect(() => {
    if (currentStep !== 7) return;
    const mcqData = APP_DATA.mcq4;
    if (!mcqData || !mcqData.imagesForEachOption) return;
    if (mcqSelectedIndex !== null && mcqSelectedIndex !== undefined) {
      const src = mcqData.imagesForEachOption[mcqSelectedIndex] || mcqData.defaultImage;
      setCurrentImage(src || "");
    }
  }, [currentStep, mcqSelectedIndex]);

  const handleNext = () => {
    const stepData = APP_DATA.steps[currentStep];

    if (currentStep === 0 && stepData.isSubstepComprehend) {
      const total = getTotalComprehendSubsteps();
      if (comprehendSubstep < total - 1) {
        if (window.playSound) window.playSound("click");
        setComprehendSubstep((prev) => prev + 1);
        return;
      }
    }

    if (currentStep === 14) {
      if (window.playSound) window.playSound("click");
      handleRestart();
      return;
    }

    if (window.playSound) window.playSound("click");
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (window.playSound) window.playSound("click");

    if (currentStep === 0) {
      if (comprehendSubstep > -1) {
        setComprehendSubstep((prev) => prev - 1);
        return;
      }
    }

    if (currentStep <= 0) return;

    // Reset all progress made on steps after the one we're going back to, so landing looks like first time
    setMcqSelectedIndex(null);
    setMcqCorrect(false);
    setStep12ShowCansInfo(false);
    setPerpLeftClicked(false);
    setPerpRightClicked(false);

    setCurrentStep((prev) => prev - 1);
  };

  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  const updateImage = useCallback((src) => {
    setCurrentImage(src);
  }, []);

  const updateNav = useCallback((text) => {
    setDynamicNavText(text);
  }, []);

  const handlePerpLeftClick = useCallback(() => {
    if (perpLeftClicked) return;
    if (window.playSound) window.playSound("click");
    setPerpLeftClicked(true);
    if (perpRightClicked) {
      setCurrentImage(APP_DATA.perpendiculars.perp2 || "");
      setDynamicNavText(APP_DATA.onlyText.step3.navFinal || "");
      enableNext();
    } else {
      setCurrentImage(APP_DATA.perpendiculars.perp1left || "");
    }
  }, [perpLeftClicked, perpRightClicked, enableNext]);

  const handlePerpRightClick = useCallback(() => {
    if (perpRightClicked) return;
    if (window.playSound) window.playSound("click");
    setPerpRightClicked(true);
    if (perpLeftClicked) {
      setCurrentImage(APP_DATA.perpendiculars.perp2 || "");
      setDynamicNavText(APP_DATA.onlyText.step3.navFinal || "");
      enableNext();
    } else {
      setCurrentImage(APP_DATA.perpendiculars.perp1right || "");
    }
  }, [perpLeftClicked, perpRightClicked, enableNext]);

  const handleMcqOptionClick = useCallback((index) => {
    if (mcqCorrect) return;
    const mcqData = getMcqData(currentStep);
    if (!mcqData) return;
    setMcqSelectedIndex(index);
    const correct = index === mcqData.correctIndex;
    if (correct) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => enableNext(), 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  }, [currentStep, mcqCorrect, enableNext]);

  const getQuestionText = () => {
    if (dynamicQuestionText) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    if (currentStep === 0) return APP_DATA.comprehend.q || "";
    return stepData ? stepData.questionText || "" : "";
  };

  const getNavText = () => {
    const stepData = APP_DATA.steps[currentStep];
    if (currentStep === 6 && stepData && stepData.isTable) {
      return dynamicNavText != null ? dynamicNavText : (APP_DATA.tableStep && APP_DATA.tableStep.nav) || "";
    }
    if (currentStep === 9 && stepData && stepData.isCompute) {
      return dynamicNavText != null ? dynamicNavText : "";
    }
    if (dynamicNavText) return dynamicNavText;
    if (currentStep === 2 && stepData.splashKey) {
      const splashData = APP_DATA.splash[stepData.splashKey];
      return (splashData && splashData.nav) || "";
    }
    if (currentStep === 3 && perpBothComplete) {
      return APP_DATA.onlyText.step3.navFinal || "";
    }
    return stepData ? stepData.navText || "" : "";
  };

  const stepData = APP_DATA.steps[currentStep];

  // Step 2: Splash (full width)
  if (stepData && stepData.isSplash) {
    const splashKey = stepData.splashKey;
    const splashData = APP_DATA.splash[splashKey] || {};
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
          imageSrc: splashData.image,
          text: splashData.text,
          dataList: splashData.dataList || [],
          step: currentStep,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
          isNextDisabled: isNextDisabled,
          isPrevDisabled:
          currentStep === 0
            ? comprehendSubstep <= -1
            : currentStep <= 0,
          navText: getNavText(),
          nextSymbol: "»",
        })
      )
    );
  }

  // Steps 0, 1, 3, 4, 5, … 14: two-column main canvas (step 14 hides question panel)
  return React.createElement(
    "div",
    { className: "applet-container" },
    stepData && !stepData.hideQuestionPanel &&
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
        step: currentStep,
      }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        comprehendSubstep: comprehendSubstep,
        currentImage: currentImage,
        onEnableNext: enableNext,
        onUpdateTexts: () => {},
        onUpdateImage: updateImage,
        onUpdateNav: updateNav,
        mcqSelectedIndex: mcqSelectedIndex,
        mcqCorrect: mcqCorrect,
        onMcqOptionClick: handleMcqOptionClick,
        perpLeftClicked: perpLeftClicked,
        perpRightClicked: perpRightClicked,
        onPerpLeftClick: handlePerpLeftClick,
        onPerpRightClick: handlePerpRightClick,
        perpBothComplete: perpBothComplete,
        step12ShowCansInfo: step12ShowCansInfo,
        onStep12AppendInfo: () => setStep12ShowCansInfo(true),
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled:
          currentStep === 0
            ? comprehendSubstep <= -1
            : currentStep <= 0,
        navText: getNavText(),
        nextSymbol: "»",
      })
    )
  );
};
