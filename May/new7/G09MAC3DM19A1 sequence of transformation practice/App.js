const App = () => {
  const { useEffect, useMemo, useState } = React;

  const [step, setStep] = useState(0);
  const [rotationComplete, setRotationComplete] = useState(false);
  const [translationComplete, setTranslationComplete] = useState(false);
  const [preservedRotationPoints, setPreservedRotationPoints] = useState({});
  const [nudgePosition, setNudgePosition] = useState(null);

  const resetLesson = () => {
    setStep(0);
    setRotationComplete(false);
    setTranslationComplete(false);
    setPreservedRotationPoints({});
  };

  const startLesson = () => {
    if (typeof playSound === "function") playSound("click");
    setRotationComplete(false);
    setTranslationComplete(false);
    setPreservedRotationPoints({});
    setStep(1);
  };

  const handleStageComplete = (stageKey, completedPoints) => {
    if (stageKey === "rotation") {
      setRotationComplete(true);
      setPreservedRotationPoints(completedPoints || {});
    }
    if (stageKey === "translation") {
      setTranslationComplete(true);
    }
  };

  const navText = useMemo(() => {
    if (step === 1) {
      return rotationComplete ? APP_DATA.nav.rotationDone : APP_DATA.nav.answer;
    }
    if (step === 2) {
      return translationComplete ? APP_DATA.nav.translationDone : APP_DATA.nav.answer;
    }
    return "";
  }, [rotationComplete, step, translationComplete]);

  const isNextDisabled =
    (step === 1 && !rotationComplete) || (step === 2 && !translationComplete);
  const isPrevDisabled = step <= 1;

  useEffect(() => {
    const updateNudge = () => {
      let targetId = null;
      if (step === 0 || step === 3) {
        targetId = "start-button";
      } else if (!isNextDisabled) {
        targetId = "next-button";
      }
      if (!targetId) {
        setNudgePosition(null);
        return;
      }
      const el = document.getElementById(targetId);
      setNudgePosition(el ? el.getBoundingClientRect() : null);
    };

    const rafId = requestAnimationFrame(updateNudge);
    window.addEventListener("resize", updateNudge);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateNudge);
    };
  }, [isNextDisabled, step]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (isPrevDisabled) return;
    if (step === 2) {
      setTranslationComplete(false);
      setStep(1);
    }
  };

  if (step === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: startLesson,
          buttonId: "start-button",
        }),
      ),
      React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition }),
    );
  }

  if (step === 3) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: resetLesson,
          buttonId: "start-button",
        }),
      ),
      React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition }),
    );
  }

  const stageKey = step === 1 ? "rotation" : "translation";

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement("div", {
      className: "seq-question-panel",
      dangerouslySetInnerHTML: {
        __html:
          step === 1
            ? APP_DATA.question.rotation
            : APP_DATA.question.translation,
      },
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(SequenceTransformCanvas, {
        key: stageKey,
        stageKey: stageKey,
        preservedPoints: step === 2 ? preservedRotationPoints : {},
        onStageComplete: handleStageComplete,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (direction) =>
          direction === "next" ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: navText,
      }),
    ),
    React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition }),
  );
};
