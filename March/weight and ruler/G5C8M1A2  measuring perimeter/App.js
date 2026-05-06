const App = () => {
  const { useState, useCallback, useRef } = React;

  const TOTAL_SHAPES = (APP_DATA.shapes || []).length;

  const [currentStep, setCurrentStep] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextSymbol, setNextSymbol] = useState("»");
  const [resetKey, setResetKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const mainCanvasRef = useRef(null);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((nav, question, nextSym) => {
    if (nav !== undefined) setDynamicNavText(nav);
    if (question !== undefined) setDynamicQuestionText(question);
    if (nextSym !== undefined) setNextSymbol(nextSym);
  }, []);

  const goToStep = useCallback((nextStep, opts = {}) => {
    if (typeof playSound === "function" && opts.silent !== true) {
      playSound("click");
    }
    setCurrentStep(nextStep);
    if (opts.bumpResetKey) setResetKey((k) => k + 1);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setShapeIndex(0);
    setCurrentStep(1);
    setIsNextDisabled(false);
    setDynamicNavText(APP_DATA.steps.intro.navText);
    setDynamicQuestionText(APP_DATA.steps.intro.questionText);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setShapeIndex(0);
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextSymbol("»");
    setResetKey((k) => k + 1);
  };

  const handleNext = () => {
    if (isAnimating) return;

    if (currentStep === 1) {
      if (typeof playSound === "function") playSound("click");
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2 || currentStep === 3) {
      const handler = mainCanvasRef.current?.tryAdvance;
      if (typeof handler === "function") handler();
      return;
    }
    if (currentStep === 4) {
      if (typeof playSound === "function") playSound("click");
      const handler = mainCanvasRef.current?.tryAdvance;
      if (typeof handler === "function") handler();
      return;
    }
    if (currentStep === 5) {
      if (typeof playSound === "function") playSound("click");
      setCurrentStep(6);
      return;
    }
    if (currentStep === 6) {
      if (typeof playSound === "function") playSound("click");
      if (shapeIndex < TOTAL_SHAPES - 1) {
        setShapeIndex((i) => i + 1);
        setCurrentStep(1);
        setIsNextDisabled(false);
        setDynamicNavText(APP_DATA.steps.intro.navText);
        setDynamicQuestionText(APP_DATA.steps.intro.questionText);
        setResetKey((k) => k + 1);
      } else {
        setCurrentStep(7);
      }
      return;
    }
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1) {
      setShapeIndex(0);
      setCurrentStep(0);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((k) => k + 1);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setCurrentStep(1);
    } else if (currentStep === 6) {
      setCurrentStep(5);
    } else if (currentStep === 7) {
      setCurrentStep(6);
    }
  };

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined) {
      return dynamicQuestionText;
    }
    return "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined) {
      return dynamicNavText;
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
          imageSrc: APP_DATA.start.imageSrc,
          left: true,
        }),
      ),
    );
  }

  if (currentStep === 7) {
    const m = APP_DATA.steps.end;
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
        ref: mainCanvasRef,
        step: currentStep,
        shapeIndex: shapeIndex,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onAnimatingChange: setIsAnimating,
        onAdvanceStep: (nextStep) => setCurrentStep(nextStep),
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
