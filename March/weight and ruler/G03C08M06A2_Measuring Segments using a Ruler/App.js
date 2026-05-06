const App = () => {
  const { useState, useCallback, useEffect } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextSymbol, setNextSymbol] = useState("»");
  const [resetKey, setResetKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [step1QuestionIndex, setStep1QuestionIndex] = useState(0);
  const [step3QuestionIndex, setStep3QuestionIndex] = useState(0);
  const [step5QuestionIndex, setStep5QuestionIndex] = useState(0);

  const s = (k) => {
    const st = APP_DATA.steps[k];
    return st || {};
  };

  const goStep3 = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(3);
    setStep3QuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(s(3).questions?.[0]?.navTextDrag || s(3).navTextDrag);
    setDynamicQuestionText(
      s(3).questions?.[0]?.questionText || s(3).questionText || null,
    );
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  }, []);

  const goStep5 = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(5);
    setStep5QuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(s(5).questions?.[0]?.navTextDrag || s(5).navTextDrag);
    setDynamicQuestionText(
      s(5).questions?.[0]?.questionText || s(5).questionText || null,
    );
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  }, []);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav, question, nextSym) => {
    if (nav !== undefined) setDynamicNavText(nav);
    if (question !== undefined) setDynamicQuestionText(question);
    if (nextSym !== undefined) setNextSymbol(nextSym);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setStep1QuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(s(1).questions?.[0]?.navTextInitial || null);
    setDynamicQuestionText(s(1).questions?.[0]?.questionText || null);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  };

  const handleInterludeRuler = () => {
    goStep3();
  };

  const handleInterludeMm = () => {
    goStep5();
  };

  useEffect(() => {
    if (currentStep !== 1) return;
    if (!APP_DATA.steps[1]?.questions?.[step1QuestionIndex]) return;
    setIsNextDisabled(true);
    setDynamicNavText(
      APP_DATA.steps[1].questions[step1QuestionIndex].navTextInitial || null,
    );
    setDynamicQuestionText(
      APP_DATA.steps[1].questions[step1QuestionIndex].questionText || null,
    );
  }, [currentStep, step1QuestionIndex]);

  useEffect(() => {
    if (currentStep !== 3) return;
    const q = APP_DATA.steps[3]?.questions?.[step3QuestionIndex];
    if (!q) return;
    setIsNextDisabled(true);
    setDynamicNavText(q.navTextDrag || APP_DATA.steps[3].navTextDrag || null);
    setDynamicQuestionText(
      q.questionText || APP_DATA.steps[3].questionText || null,
    );
  }, [currentStep, step3QuestionIndex]);

  useEffect(() => {
    if (currentStep !== 5) return;
    const q = APP_DATA.steps[5]?.questions?.[step5QuestionIndex];
    if (!q) return;
    setIsNextDisabled(true);
    setDynamicNavText(q.navTextDrag || APP_DATA.steps[5].navTextDrag || null);
    setDynamicQuestionText(
      q.questionText || APP_DATA.steps[5].questionText || null,
    );
  }, [currentStep, step5QuestionIndex]);

  const handleEndContinue = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(7);
    setIsNextDisabled(true);
    setDynamicNavText(s(7).navTextSelect || null);
    setDynamicQuestionText(s(7).questionText || null);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setStep1QuestionIndex(0);
    setStep3QuestionIndex(0);
    setStep5QuestionIndex(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      const qCount = s(1).questions?.length || 0;
      if (step1QuestionIndex < qCount - 1) {
        setStep1QuestionIndex((i) => i + 1);
        setIsNextDisabled(true);
        setDynamicNavText(
          s(1).questions?.[step1QuestionIndex + 1]?.navTextInitial || null,
        );
        setDynamicQuestionText(
          s(1).questions?.[step1QuestionIndex + 1]?.questionText || null,
        );
        setResetKey((k) => k + 1);
      } else {
        setCurrentStep(2);
        setIsNextDisabled(true);
        setDynamicNavText(null);
        setDynamicQuestionText(null);
      }
    } else if (currentStep === 3) {
      const qCount = s(3).questions?.length || 0;
      if (step3QuestionIndex < qCount - 1) {
        setStep3QuestionIndex((i) => i + 1);
        setIsNextDisabled(true);
        setDynamicNavText(
          s(3).questions?.[step3QuestionIndex + 1]?.navTextDrag || null,
        );
        setDynamicQuestionText(
          s(3).questions?.[step3QuestionIndex + 1]?.questionText || null,
        );
        setResetKey((k) => k + 1);
      } else {
        setCurrentStep(4);
        setIsNextDisabled(true);
        setDynamicNavText(null);
        setDynamicQuestionText(null);
      }
    } else if (currentStep === 5) {
      const qCount = s(5).questions?.length || 0;
      if (step5QuestionIndex < qCount - 1) {
        setStep5QuestionIndex((i) => i + 1);
        setIsNextDisabled(true);
        setDynamicNavText(
          s(5).questions?.[step5QuestionIndex + 1]?.navTextDrag || null,
        );
        setDynamicQuestionText(
          s(5).questions?.[step5QuestionIndex + 1]?.questionText || null,
        );
        setResetKey((k) => k + 1);
      } else {
        setCurrentStep(6);
        setIsNextDisabled(true);
        setDynamicNavText(null);
        setDynamicQuestionText(null);
      }
    } else if (currentStep === 7) {
      setCurrentStep(8);
      setIsNextDisabled(false);
      setDynamicNavText(s(8).navText || null);
      setDynamicQuestionText(s(8).questionText || null);
    } else if (currentStep === 8) {
      setCurrentStep(9);
      setIsNextDisabled(true);
      setDynamicNavText(s(9).navTextSelect || null);
      setDynamicQuestionText(s(9).questionText || null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 9) {
      setCurrentStep(10);
      setIsNextDisabled(false);
      setDynamicNavText(s(10).navText || null);
      setDynamicQuestionText(s(10).questionText || null);
    } else if (currentStep === 10) {
      setCurrentStep(11);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
    }
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setCurrentStep(0);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
    } else if (currentStep === 2) {
      setCurrentStep(1);
      const qCount = s(1).questions?.length || 1;
      const lastIdx = Math.max(0, qCount - 1);
      setStep1QuestionIndex(lastIdx);
      setIsNextDisabled(true);
      setDynamicNavText(s(1).questions?.[lastIdx]?.navTextInitial || null);
      setDynamicQuestionText(s(1).questions?.[lastIdx]?.questionText || null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 4) {
      setCurrentStep(3);
      const qCount = s(3).questions?.length || 1;
      const lastIdx = Math.max(0, qCount - 1);
      setStep3QuestionIndex(lastIdx);
      setIsNextDisabled(true);
      setDynamicNavText(s(3).questions?.[lastIdx]?.navTextDrag || null);
      setDynamicQuestionText(s(3).questions?.[lastIdx]?.questionText || null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 5) {
      setCurrentStep(4);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 6) {
      setCurrentStep(5);
      const qCount = s(5).questions?.length || 1;
      const lastIdx = Math.max(0, qCount - 1);
      setStep5QuestionIndex(lastIdx);
      setIsNextDisabled(true);
      setDynamicNavText(s(5).questions?.[lastIdx]?.navTextDrag || null);
      setDynamicQuestionText(s(5).questions?.[lastIdx]?.questionText || null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 7) {
      setCurrentStep(6);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 8) {
      setCurrentStep(7);
      setIsNextDisabled(false);
      setDynamicNavText(s(7).navTextDone || s(7).navTextSelect || null);
      setDynamicQuestionText(s(7).questionText || null);
    } else if (currentStep === 9) {
      setCurrentStep(8);
      setIsNextDisabled(false);
      setDynamicNavText(s(8).navText || null);
      setDynamicQuestionText(s(8).questionText || null);
    } else if (currentStep === 10) {
      setCurrentStep(9);
      setIsNextDisabled(false);
      setDynamicNavText(s(9).navTextDone || s(9).navTextSelect || null);
      setDynamicQuestionText(s(9).questionText || null);
    } else if (currentStep === 11) {
      setCurrentStep(10);
      setIsNextDisabled(false);
      setDynamicNavText(s(10).navText || null);
      setDynamicQuestionText(s(10).questionText || null);
    }
  };

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {
      return dynamicQuestionText;
    }
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return "";
    return stepData.questionText != null ? stepData.questionText : "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
    }
    const stepData = APP_DATA.steps[currentStep];
    return stepData && stepData.navText != null ? stepData.navText : "";
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
          imageSrc: APP_DATA.start.imageSrc,
          left: true,
        }),
      ),
    );
  }

  if (currentStep === 2) {
    const m = APP_DATA.interludeRuler;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: m.heading,
          text: m.text,
          buttonText: m.buttonText,
          onButtonClick: handleInterludeRuler,
          imageSrc: m.imageSrc,
          left: true,
        }),
      ),
    );
  }

  if (currentStep === 4) {
    const m = APP_DATA.interludeMm;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: m.heading,
          text: m.text,
          buttonText: m.buttonText,
          onButtonClick: handleInterludeMm,
          imageSrc: m.imageSrc,
          left: true,
        }),
      ),
    );
  }

  if (currentStep === 6) {
    const m = APP_DATA.endShapes;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: m.heading,
          text: m.text,
          buttonText: m.buttonText,
          onButtonClick: handleEndContinue,
          imageSrc: m.imageSrc,
          left: true,
        }),
      ),
    );
  }

  if (currentStep === 11) {
    const m = APP_DATA.endRuler;
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: m.heading,
          text: m.text,
          buttonText: m.buttonText,
          onButtonClick: handleStartOver,
          imageSrc: m.imageSrc,
          left: true,
        }),
      ),
    );
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
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        step1QuestionIndex: step1QuestionIndex,
        step3QuestionIndex: step3QuestionIndex,
        step5QuestionIndex: step5QuestionIndex,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onAnimatingChange: setIsAnimating,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrevious();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isAnimating,
        navText: getNavText(),
        nextSymbol: nextSymbol,
        nextBtnClass: nextSymbol.length > 2 ? "text-button" : "",
      }),
    ),
  );
};
