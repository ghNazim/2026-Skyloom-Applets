const App = () => {
  const { useEffect, useMemo, useRef, useState } = React;

  const [step, setStep] = useState(0);
  const [rotationComplete, setRotationComplete] = useState(false);
  const [translationComplete, setTranslationComplete] = useState(false);
  const [reflectionXComplete, setReflectionXComplete] = useState(false);
  const [reflectionYComplete, setReflectionYComplete] = useState(false);
  const [reflectionY2Complete, setReflectionY2Complete] = useState(false);
  const [translation2Complete, setTranslation2Complete] = useState(false);
  const [preservedRotationPoints, setPreservedRotationPoints] = useState({});
  const [preservedReflectionXPoints, setPreservedReflectionXPoints] = useState({});
  const [preservedReflectionY2Points, setPreservedReflectionY2Points] = useState({});
  const [nudgePosition, setNudgePosition] = useState(null);
  const [stageTransitioning, setStageTransitioning] = useState(false);
  const canvasRef = useRef(null);

  const resetLesson = () => {
    setStep(0);
    setRotationComplete(false);
    setTranslationComplete(false);
    setReflectionXComplete(false);
    setReflectionYComplete(false);
    setReflectionY2Complete(false);
    setTranslation2Complete(false);
    setPreservedRotationPoints({});
    setPreservedReflectionXPoints({});
    setPreservedReflectionY2Points({});
    setStageTransitioning(false);
  };

  const startLesson = () => {
    if (typeof playSound === "function") playSound("click");
    setRotationComplete(false);
    setTranslationComplete(false);
    setReflectionXComplete(false);
    setReflectionYComplete(false);
    setReflectionY2Complete(false);
    setTranslation2Complete(false);
    setPreservedRotationPoints({});
    setPreservedReflectionXPoints({});
    setPreservedReflectionY2Points({});
    setStageTransitioning(false);
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
    if (stageKey === "reflectionX") {
      setReflectionXComplete(true);
      setPreservedReflectionXPoints(completedPoints || {});
    }
    if (stageKey === "reflectionY") {
      setReflectionYComplete(true);
    }
    if (stageKey === "reflectionY2") {
      setReflectionY2Complete(true);
      setPreservedReflectionY2Points(completedPoints || {});
    }
    if (stageKey === "translation2") {
      setTranslation2Complete(true);
    }
  };

  const navText = useMemo(() => {
    if (step === 1) {
      return rotationComplete ? APP_DATA.nav.rotationDone : APP_DATA.nav.answer;
    }
    if (step === 2) {
      return translationComplete ? APP_DATA.nav.translationDone : APP_DATA.nav.answer;
    }
    if (step === 3) {
      return reflectionXComplete ? APP_DATA.nav.reflectionXDone : APP_DATA.nav.answer;
    }
    if (step === 4) {
      return reflectionYComplete ? APP_DATA.nav.reflectionYDone : APP_DATA.nav.answer;
    }
    if (step === 5) {
      return reflectionY2Complete ? APP_DATA.nav.reflectionY2Done : APP_DATA.nav.answer;
    }
    if (step === 6) {
      return translation2Complete ? APP_DATA.nav.translation2Done : APP_DATA.nav.answer;
    }
    return "";
  }, [
    reflectionXComplete,
    reflectionY2Complete,
    reflectionYComplete,
    rotationComplete,
    step,
    translation2Complete,
    translationComplete,
  ]);

  const isNextDisabled =
    (step === 1 && !rotationComplete) ||
    (step === 2 && !translationComplete) ||
    (step === 3 && !reflectionXComplete) ||
    (step === 4 && !reflectionYComplete) ||
    (step === 5 && !reflectionY2Complete) ||
    (step === 6 && !translation2Complete) ||
    stageTransitioning;
  const isPrevDisabled = step <= 1 || stageTransitioning;

  useEffect(() => {
    const updateNudge = () => {
      let targetId = null;
      if (step === 0 || step === 7) {
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

  const playOddToEvenTransition = async () => {
    if (canvasRef.current && canvasRef.current.playAnswerToGivenTransition) {
      setStageTransitioning(true);
      try {
        await canvasRef.current.playAnswerToGivenTransition();
      } finally {
        setStageTransitioning(false);
      }
    }
  };

  const handleNext = async () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;
    if (step === 1) {
      await playOddToEvenTransition();
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      await playOddToEvenTransition();
      setStep(4);
      return;
    }
    if (step === 4) {
      setStep(5);
      return;
    }
    if (step === 5) {
      await playOddToEvenTransition();
      setStep(6);
      return;
    }
    if (step === 6) {
      setStep(7);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (isPrevDisabled) return;
    if (step === 2) {
      setTranslationComplete(false);
      setStep(1);
    }
    if (step === 3) {
      setReflectionXComplete(false);
      setPreservedReflectionXPoints({});
      setStep(2);
    }
    if (step === 4) {
      setReflectionYComplete(false);
      setStep(3);
    }
    if (step === 5) {
      setReflectionY2Complete(false);
      setPreservedReflectionY2Points({});
      setStep(4);
    }
    if (step === 6) {
      setTranslation2Complete(false);
      setStep(5);
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

  if (step === 7) {
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

  const stageKey =
    step === 1
      ? "rotation"
      : step === 2
        ? "translation"
        : step === 3
          ? "reflectionX"
          : step === 4
            ? "reflectionY"
            : step === 5
              ? "reflectionY2"
              : "translation2";
  const questionKey = stageKey;
  const preservedPoints =
    stageKey === "translation"
      ? preservedRotationPoints
      : stageKey === "reflectionY"
        ? preservedReflectionXPoints
        : stageKey === "translation2"
          ? preservedReflectionY2Points
          : {};

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement("div", {
      className: "seq-question-panel",
      dangerouslySetInnerHTML: {
        __html: APP_DATA.question[questionKey],
      },
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(SequenceTransformCanvas, {
        key: stageKey,
        ref: canvasRef,
        stageKey: stageKey,
        preservedPoints: preservedPoints,
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
