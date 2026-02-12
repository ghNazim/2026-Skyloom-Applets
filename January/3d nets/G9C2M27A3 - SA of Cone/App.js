const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [navText, setNavText] = useState("");
  const [step1MediaState, setStep1MediaState] = useState("folded");
  const [hasUnfoldedOnce, setHasUnfoldedOnce] = useState(false);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [substitutedTerms, setSubstitutedTerms] = useState({
    arcLength: false,
    circumference: false,
    areaOfCircle: false,
  });
  const [step10Correct, setStep10Correct] = useState(false);

  const stepData = APP_DATA.steps[currentStep];

  useEffect(() => {
    if (!stepData) return;
    setQuestionText(stepData.q);
    setNavText(stepData.n);

    if (currentStep === 2 || currentStep === 10) {
      setMcqAnswered(false);
    }
    if (currentStep === 10) {
      setStep10Correct(false);
    }
    if (currentStep === 7) {
      setSubstitutedTerms({ arcLength: false, circumference: false, areaOfCircle: false });
    }

    const enableNextSteps = [3, 4, 5, 6, 9, 11];
    if (enableNextSteps.includes(currentStep)) {
      setIsNextDisabled(false);
    } else if (currentStep === 1) {
      setIsNextDisabled(true);
    } else if (currentStep === 2 || currentStep === 10) {
      setIsNextDisabled(true);
    } else if (currentStep === 7 || currentStep === 8) {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2 && mcqAnswered && stepData) {
      if (stepData.nAfterCorrect) setNavText(stepData.nAfterCorrect);
      setIsNextDisabled(false);
    }
    if (currentStep === 7) {
      const all = substitutedTerms.arcLength && substitutedTerms.circumference && substitutedTerms.areaOfCircle;
      if (all && stepData && stepData.nAfterAllSubstituted) setNavText(stepData.nAfterAllSubstituted);
      setIsNextDisabled(!all);
    }
    if (currentStep === 10 && mcqAnswered && stepData) {
      if (stepData.nAfterCorrect) setNavText(stepData.nAfterCorrect);
      setIsNextDisabled(false);
    }
  }, [currentStep, mcqAnswered, substitutedTerms, stepData]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setStep1MediaState("folded");
    setHasUnfoldedOnce(false);
    setIsNextDisabled(true);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setStep1MediaState("folded");
    setHasUnfoldedOnce(false);
    setIsNextDisabled(true);
    setMcqAnswered(false);
    setSubstitutedTerms({ arcLength: false, circumference: false, areaOfCircle: false });
    setStep10Correct(false);
  };

  const handleUnfold = () => {
    if (typeof playSound === "function") playSound("click");
    setStep1MediaState("video");
  };

  const handleVideoEnded = () => {
    const step1 = APP_DATA.steps[1];
    setStep1MediaState("unfolded");
    setHasUnfoldedOnce(true);
    if (step1 && step1.qAfterUnfold) setQuestionText(step1.qAfterUnfold);
    if (step1 && step1.nAfterUnfold) setNavText(step1.nAfterUnfold);
    setIsNextDisabled(false);
  };

  const handleMcqCorrect = () => {
    setMcqAnswered(true);
    if (currentStep === 10) setStep10Correct(true);
  };

  const handleInteractiveTermClick = (key) => {
    setSubstitutedTerms((prev) => ({ ...prev, [key]: true }));
  };

  const handleStep8AnimationComplete = () => {
    setIsNextDisabled(false);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 12) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {};

  const getMediaSrc = () => {
    if (currentStep === 1) {
      if (step1MediaState === "folded") return (APP_DATA.steps[1] && APP_DATA.steps[1].mediaSrc) || "";
      if (step1MediaState === "video") return (APP_DATA.steps[1] && APP_DATA.steps[1].videoSrc) || "";
      if (step1MediaState === "unfolded") return (APP_DATA.steps[1] && APP_DATA.steps[1].imageAfterVideo) || "";
    }
    return stepData && stepData.mediaSrc ? stepData.mediaSrc : "";
  };

  const getIsVideo = () => currentStep === 1 && step1MediaState === "video";

  const getPreloadVideoSrc = () => {
    if (currentStep === 1 && step1MediaState === "folded") {
      const step1 = APP_DATA.steps[1];
      return (step1 && step1.videoSrc) || "";
    }
    return "";
  };

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        })
      )
    );
  }

  if (currentStep === 12) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Final, {
          onRestart: handleRestart,
        })
      )
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, { text: questionText }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        mediaSrc: getMediaSrc(),
        isVideo: getIsVideo(),
        preloadVideoSrc: getPreloadVideoSrc() || undefined,
        onVideoEnded: handleVideoEnded,
        hasUnfoldedOnce: hasUnfoldedOnce,
        onUnfold: handleUnfold,
        mcqAnswered: mcqAnswered,
        onMcqCorrect: handleMcqCorrect,
        onMcqWrong: () => {},
        substitutedTerms: substitutedTerms,
        onInteractiveTermClick: handleInteractiveTermClick,
        onStep8AnimationComplete: handleStep8AnimationComplete,
        step10Correct: step10Correct,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: navText,
        nextSymbol: "»",
      })
    )
  );
};
