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
  const [foldedImageIndex, setFoldedImageIndex] = useState(0);
  const [step34MediaState, setStep34MediaState] = useState("unfoldedImage");
  const [coneUnfolded, setConeUnfolded] = useState(true);
  const [step5MediaState, setStep5MediaState] = useState("video");
  const [step8Animating, setStep8Animating] = useState(false);
  const [step1ShowUnfoldButton, setStep1ShowUnfoldButton] = useState(false);

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
    if (currentStep === 3 || currentStep === 4) {
      setStep34MediaState("unfoldedImage");
      setConeUnfolded(true);
    }
    if (currentStep === 5) {
      setStep5MediaState("video");
    }
    if (currentStep === 8) {
      setStep8Animating(true);
    }

    const enableNextSteps = [5, 6, 9, 11];
    if (enableNextSteps.includes(currentStep)) {
      setIsNextDisabled(false);
    } else if (currentStep === 3 || currentStep === 4) {
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

  useEffect(() => {
    if (currentStep === 3 || currentStep === 4) {
      setIsNextDisabled(!coneUnfolded);
    }
  }, [currentStep, coneUnfolded]);

  useEffect(() => {
    if (currentStep !== 1 || step1MediaState !== "folded") return;
    const step1 = APP_DATA.steps[1];
    const images = (step1 && step1.foldedImages) || ["assets/folded.png"];
    const interval = setInterval(() => {
      setFoldedImageIndex((prev) => (prev + 1) % images.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep, step1MediaState]);

  useEffect(() => {
    if (currentStep !== 1) {
      setStep1ShowUnfoldButton(false);
      return;
    }
    const t = setTimeout(() => setStep1ShowUnfoldButton(true), 3000);
    return () => clearTimeout(t);
  }, [currentStep]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setStep1MediaState("folded");
    setHasUnfoldedOnce(false);
    setFoldedImageIndex(0);
    setStep1ShowUnfoldButton(false);
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
    if (currentStep === 1) {
      const step1 = APP_DATA.steps[1];
      setStep1MediaState("unfolded");
      setHasUnfoldedOnce(true);
      if (step1 && step1.qAfterUnfold) setQuestionText(step1.qAfterUnfold);
      if (step1 && step1.nAfterUnfold) setNavText(step1.nAfterUnfold);
      setIsNextDisabled(false);
    } else if (currentStep === 3 || currentStep === 4) {
      handleStep34VideoEnded();
    } else if (currentStep === 5) {
      setStep5MediaState("image");
    }
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
    setStep8Animating(false);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 12) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep <= 0) return;
    if (typeof playSound === "function") playSound("click");
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    if (newStep < 10) setStep10Correct(false);
    if (newStep < 7) setSubstitutedTerms({ arcLength: false, circumference: false, areaOfCircle: false });
    if (newStep < 5) setStep5MediaState("video");
    if (newStep < 4) {
      setStep34MediaState("unfoldedImage");
      setConeUnfolded(true);
    }
    if (newStep < 2) setMcqAnswered(false);
    if (newStep < 1) {
      setStep1MediaState("folded");
      setHasUnfoldedOnce(false);
      setFoldedImageIndex(0);
    }
    setStep8Animating(false);
  };

  const getMediaSrc = () => {
    if (currentStep === 1) {
      if (step1MediaState === "folded") {
        const step1 = APP_DATA.steps[1];
        const images = (step1 && step1.foldedImages) || ["assets/folded.png"];
        return images[foldedImageIndex % images.length] || "assets/folded.png";
      }
      if (step1MediaState === "video") return (APP_DATA.steps[1] && APP_DATA.steps[1].videoSrc) || "";
      if (step1MediaState === "unfolded") return (APP_DATA.steps[1] && APP_DATA.steps[1].imageAfterVideo) || "";
    }
    if (currentStep === 3 || currentStep === 4) {
      const sd = APP_DATA.steps[currentStep];
      if (!sd) return stepData && stepData.mediaSrc ? stepData.mediaSrc : "";
      if (step34MediaState === "unfoldedImage") return sd.unfoldedImage || sd.mediaSrc || "";
      if (step34MediaState === "foldedImage") return sd.foldedImage || "assets/folded.png";
      if (step34MediaState === "videoUnfolding" || step34MediaState === "videoFolding") return sd.videoSrc || "";
    }
    if (currentStep === 5) {
      const sd = APP_DATA.steps[5];
      if (step5MediaState === "video") return (sd && sd.videoSrc) || "assets/translation.mp4";
      return (sd && sd.mediaSrc) || "assets/sector.png";
    }
    return stepData && stepData.mediaSrc ? stepData.mediaSrc : "";
  };

  const getIsVideo = () =>
    (currentStep === 1 && step1MediaState === "video") ||
    (currentStep === 5 && step5MediaState === "video") ||
    (currentStep >= 3 && currentStep <= 4 && (step34MediaState === "videoUnfolding" || step34MediaState === "videoFolding"));

  const getPlayReverse = () => currentStep >= 3 && currentStep <= 4 && step34MediaState === "videoFolding";

  const handleStep34VideoEnded = () => {
    if (step34MediaState === "videoFolding") {
      setStep34MediaState("foldedImage");
      setConeUnfolded(false);
    } else if (step34MediaState === "videoUnfolding") {
      setStep34MediaState("unfoldedImage");
      setConeUnfolded(true);
    }
  };

  const handleToggleFold = () => {
    if (typeof playSound === "function") playSound("click");
    if (coneUnfolded) {
      setStep34MediaState("videoFolding");
    } else {
      setStep34MediaState("videoUnfolding");
    }
  };

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
        preloadVideoSrc: (currentStep === 1 ? getPreloadVideoSrc() : "") || undefined,
        playReverse: getPlayReverse(),
        onVideoEnded: handleVideoEnded,
        hasUnfoldedOnce: hasUnfoldedOnce,
        showStep1Legend: currentStep === 1 && step1MediaState === "folded",
        showStep1UnfoldButton: step1ShowUnfoldButton,
        onUnfold: handleUnfold,
        showStep34Toggle: currentStep === 3 || currentStep === 4,
        onToggleFold: handleToggleFold,
        step34Animating:
          (currentStep === 3 || currentStep === 4) &&
          (step34MediaState === "videoFolding" || step34MediaState === "videoUnfolding"),
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
        isPrevDisabled:
          currentStep === 0 ||
          (currentStep === 1 && step1MediaState === "video") ||
          ((currentStep === 3 || currentStep === 4) &&
            (step34MediaState === "videoFolding" || step34MediaState === "videoUnfolding")) ||
          step8Animating,
        navText: navText,
        nextSymbol: "»",
      })
    )
  );
};
