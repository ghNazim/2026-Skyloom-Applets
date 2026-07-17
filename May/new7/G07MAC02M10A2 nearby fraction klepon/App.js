const StartScreen = ({ onStart }) => {
  return React.createElement(
    "div",
    { className: "klepon-start" },
    React.createElement("div", { className: "klepon-start-title" }, APP_DATA.start.heading),
    React.createElement(
      "div",
      { className: "klepon-start-content" },
      React.createElement(
        "div",
        { className: "klepon-start-recipe" },
        React.createElement(RecipePaper, null),
      ),
      React.createElement(
        "div",
        { className: "klepon-start-card" },
        React.createElement("img", {
          src: "assets/klepon.png",
          alt: "",
          className: "klepon-start-image",
        }),
        React.createElement("div", {
          className: "klepon-start-copy",
          dangerouslySetInnerHTML: { __html: formatFractionsInText(APP_DATA.start.body) },
        }),
      ),
    ),
    React.createElement(
      "button",
      {
        id: "start-button",
        className: "btn klepon-start-button",
        onClick: onStart,
      },
      APP_DATA.start.buttonText,
    ),
  );
};

const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
  }, []);

  const showNudgeAtElement = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) {
      hideNudge();
      return;
    }
    setNudgePosition(el.getBoundingClientRect());
    setShowNudge(true);
  }, [hideNudge]);

  const playSnd = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const handleStart = () => {
    playSnd("click");
    hideNudge();
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    playSnd("click");
    hideNudge();
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 3) {
      setIsNextDisabled(true);
    }
  };

  const handlePrev = () => {
    if (currentStep <= 1) return;
    playSnd("click");
    hideNudge();
    setCurrentStep((prev) => prev - 1);
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined) setDynamicQuestionText(question);
    if (nav !== undefined) setDynamicNavText(nav);
  }, []);

  const setNextLabel = useCallback((text) => {
    if (text !== undefined) setNextButtonText(text);
  }, []);

  const completeTenthsPlacement = useCallback(() => {
    setDynamicNavText("");
    setIsNextDisabled(true);
    window.setTimeout(() => {
      setCurrentStep(3);
    }, 2000);
  }, []);

  useEffect(() => {
    hideNudge();
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");

    if (currentStep === 0) {
      setIsNextDisabled(true);
      const tid = window.setTimeout(() => showNudgeAtElement("start-button"), 500);
      return () => window.clearTimeout(tid);
    }

    if (currentStep === 1) {
      setIsNextDisabled(false);
      const tid = window.setTimeout(() => showNudgeAtElement("next-button"), 600);
      return () => window.clearTimeout(tid);
    }

    if (currentStep === 2) {
      setIsNextDisabled(true);
    }

    if (currentStep === 3) {
      setIsNextDisabled(true);
      const tid = window.setTimeout(() => showNudgeAtElement("show-benchmarks-button"), 600);
      return () => window.clearTimeout(tid);
    }
  }, [currentStep, hideNudge, showNudgeAtElement]);

  useEffect(() => {
    const updateNudge = () => {
      if (!showNudge) return;
      if (currentStep === 0) showNudgeAtElement("start-button");
      if (currentStep === 1 && !isNextDisabled) showNudgeAtElement("next-button");
      if (currentStep === 3) {
        if (!isNextDisabled) {
          showNudgeAtElement("next-button");
        } else {
          showNudgeAtElement("show-benchmarks-button");
        }
      }
    };
    window.addEventListener("resize", updateNudge);
    return () => window.removeEventListener("resize", updateNudge);
  }, [currentStep, isNextDisabled, showNudge, showNudgeAtElement]);

  const stepData = APP_DATA.steps[currentStep] || {};
  const questionText = dynamicQuestionText !== null ? dynamicQuestionText : stepData.questionText || "";
  const navText = dynamicNavText !== null ? dynamicNavText : stepData.navText || "";

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(StartScreen, { onStart: handleStart }),
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    questionText
      ? React.createElement(QuestionPanel, {
          text: formatFractionsInText(questionText),
          step: currentStep,
        })
      : null,
    React.createElement(
      "div",
      { className: "app-main-content" },
      currentStep === 1
        ? React.createElement(Problem, null)
        : React.createElement(MainCanvas, {
            step: currentStep,
            onSetNextEnabled: setNextEnabled,
            onUpdateTexts: updateTexts,
            onSetNextLabel: setNextLabel,
            onCompleteTenthsPlacement: completeTenthsPlacement,
            onHideNudge: hideNudge,
            onShowNudgeAtElement: showNudgeAtElement,
          }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        navText: formatFractionsInText(navText),
        nextButtonText: nextButtonText,
        step: currentStep,
      }),
    ),
    React.createElement(Nudge, { show: showNudge, position: nudgePosition }),
  );
};
