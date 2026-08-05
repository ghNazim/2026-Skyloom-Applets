const FINAL_STEP = 10;
const BENCHMARK_STEP = 6;
const LAST_NAV_STEP = 9;

const StartScreen = ({ onStart }) => {
  return React.createElement(
    "div",
    { className: "cupfrac-start" },
    React.createElement("div", { className: "cupfrac-start-title" }, APP_DATA.start.heading),
    React.createElement(
      "div",
      { className: "cupfrac-start-content" },
      React.createElement(
        "div",
        { className: "cupfrac-start-card" },
        React.createElement("div", {
          className: "cupfrac-start-copy",
          dangerouslySetInnerHTML: { __html: APP_DATA.start.body },
        }),
      ),
      React.createElement(
        "div",
        { className: "cupfrac-start-image-card" },
        React.createElement("img", {
          src: APP_DATA.start.imageSrc,
          alt: "",
          className: "cupfrac-start-image",
        }),
      ),
    ),
    React.createElement(
      "button",
      {
        id: "start-button",
        className: "btn cupfrac-start-button",
        onClick: onStart,
      },
      APP_DATA.start.buttonText,
    ),
  );
};

const BenchmarkScreen = ({ onContinue }) => {
  const config = APP_DATA.steps[BENCHMARK_STEP];
  return React.createElement(
    "div",
    { className: "cupfrac-benchmark" },
    React.createElement("div", { className: "cupfrac-benchmark-title" }, config.heading),
    React.createElement(
      "div",
      { className: "cupfrac-benchmark-content" },
      React.createElement(
        "div",
        { className: "cupfrac-benchmark-glass-card" },
        React.createElement(Glass, {
          fill: 0,
          fillDuration: 0,
          ticks: [0, 0.25, 1 / 3, 0.5, 1],
          unitLabel: APP_DATA.meterUnit,
        }),
      ),
      React.createElement(
        "div",
        { className: "cupfrac-benchmark-text-card" },
        React.createElement("div", {
          className: "cupfrac-benchmark-copy",
          dangerouslySetInnerHTML: { __html: config.body },
        }),
        React.createElement(
          "button",
          {
            id: "benchmark-continue-button",
            className: "btn cupfrac-benchmark-button",
            onClick: onContinue,
          },
          config.buttonText,
        ),
      ),
    ),
  );
};

const FinalScreen = ({ onStartOver }) => {
  return React.createElement(
    "div",
    { className: "cupfrac-final" },
    React.createElement("div", { className: "cupfrac-final-title" }, APP_DATA.final.heading),
    React.createElement(
      "div",
      { className: "cupfrac-final-card" },
      React.createElement("div", {
        className: "cupfrac-final-copy",
        dangerouslySetInnerHTML: { __html: APP_DATA.final.body },
      }),
    ),
    React.createElement(
      "button",
      {
        id: "start-over-button",
        className: "btn cupfrac-final-button",
        onClick: onStartOver,
      },
      APP_DATA.final.buttonText,
    ),
  );
};

const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [navText, setNavText] = useState("");
  const [nudge, setNudge] = useState(null);
  const nudgeIdRef = useRef(null);

  const playSnd = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const hideNudge = useCallback(() => {
    nudgeIdRef.current = null;
    setNudge(null);
  }, []);

  const showNudgeAtElement = useCallback((id, kind = "tap") => {
    const el = document.getElementById(id);
    if (!el) {
      nudgeIdRef.current = null;
      setNudge(null);
      return;
    }
    nudgeIdRef.current = id;
    setNudge({ kind: kind, rect: el.getBoundingClientRect() });
  }, []);

  useEffect(() => {
    const onResize = () => {
      const id = nudgeIdRef.current;
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setNudge((prev) => (prev ? { kind: prev.kind, rect: rect } : prev));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateNav = useCallback((text) => {
    setNavText(text || "");
  }, []);

  const advanceStep = useCallback(() => {
    hideNudge();
    setCurrentStep((prev) => (prev < LAST_NAV_STEP ? prev + 1 : prev));
  }, [hideNudge]);

  const handleStart = () => {
    playSnd("click");
    hideNudge();
    setCurrentStep(1);
  };

  const handleBenchmarkContinue = () => {
    playSnd("click");
    hideNudge();
    setCurrentStep(7);
  };

  const handleStartOver = () => {
    playSnd("click");
    hideNudge();
    setCurrentStep(0);
    setIsNextDisabled(true);
    setNavText("");
  };

  const handleNext = () => {
    if (isNextDisabled || currentStep >= FINAL_STEP) return;
    playSnd("click");
    hideNudge();
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentStep !== 0) return undefined;
    setIsNextDisabled(true);
    setNavText("");
    const tid = window.setTimeout(() => showNudgeAtElement("start-button"), 500);
    return () => window.clearTimeout(tid);
  }, [currentStep, showNudgeAtElement]);

  useEffect(() => {
    if (currentStep !== BENCHMARK_STEP) return undefined;
    const tid = window.setTimeout(() => showNudgeAtElement("benchmark-continue-button"), 500);
    return () => window.clearTimeout(tid);
  }, [currentStep, showNudgeAtElement]);

  useEffect(() => {
    if (currentStep !== FINAL_STEP) return undefined;
    const tid = window.setTimeout(() => showNudgeAtElement("start-over-button"), 500);
    return () => window.clearTimeout(tid);
  }, [currentStep, showNudgeAtElement]);

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(StartScreen, { onStart: handleStart }),
      ),
      React.createElement(Nudge, {
        show: !!nudge,
        position: nudge ? nudge.rect : null,
        kind: nudge ? nudge.kind : "tap",
      }),
    );
  }

  if (currentStep === BENCHMARK_STEP) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(BenchmarkScreen, { onContinue: handleBenchmarkContinue }),
      ),
      React.createElement(Nudge, {
        show: !!nudge,
        position: nudge ? nudge.rect : null,
        kind: nudge ? nudge.kind : "tap",
      }),
    );
  }

  if (currentStep === FINAL_STEP) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(FinalScreen, { onStartOver: handleStartOver }),
      ),
      React.createElement(Nudge, {
        show: !!nudge,
        position: nudge ? nudge.rect : null,
        kind: nudge ? nudge.kind : "tap",
      }),
    );
  }

  const stepConfig = APP_DATA.steps[currentStep] || {};

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: formatFractionsInText(stepConfig.questionText),
      subText: formatFractionsInText(stepConfig.questionSub),
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        onSetNextEnabled: setNextEnabled,
        onUpdateNav: updateNav,
        onAdvance: advanceStep,
        onHideNudge: hideNudge,
        onShowNudgeAtElement: showNudgeAtElement,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => {
          if (dir === "next") handleNext();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: formatFractionsInText(navText),
      }),
    ),
    React.createElement(Nudge, {
      show: !!nudge,
      position: nudge ? nudge.rect : null,
      kind: nudge ? nudge.kind : "tap",
    }),
  );
};
