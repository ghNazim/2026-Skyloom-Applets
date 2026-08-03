const App = () => {
  const { useState, useEffect, useMemo, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(12);
  const [exploredCards, setExploredCards] = useState([]);
  const [arrowSigns, setArrowSigns] = useState({ x: false, y: false });
  const [slopeComplete, setSlopeComplete] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);

  const resetSlopeScenario = useCallback(() => {
    setArrowSigns({ x: false, y: false });
    setSlopeComplete(false);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    setExploredCards([]);
    resetSlopeScenario();
    setCurrentStep(1);
  };

  const handleSelectCard = (cardId) => {
    setNudgePositions([]);
    if (currentStep === 1 && cardId === "positive") {
      if (typeof playSound === "function") playSound("click");
      resetSlopeScenario();
      setCurrentStep(2);
      return;
    }
    if (currentStep === 6 && cardId === "negative") {
      if (typeof playSound === "function") playSound("click");
      resetSlopeScenario();
      setCurrentStep(7);
      return;
    }
  };

  const handleIntroComplete = () => {
    setCurrentStep((prev) => (prev === 7 ? 8 : 3));
  };

  const handleRideComplete = () => {
    setCurrentStep((prev) => (prev === 8 ? 9 : 4));
  };

  const handleArrowTap = (axis) => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    setArrowSigns((prev) => ({ ...prev, [axis]: true }));
  };

  useEffect(() => {
    if ((currentStep === 4 || currentStep === 9) && arrowSigns.x && arrowSigns.y) {
      const id = setTimeout(
        () => setCurrentStep(currentStep === 9 ? 10 : 5),
        350,
      );
      return () => clearTimeout(id);
    }
    return undefined;
  }, [currentStep, arrowSigns]);

  const handleSlopeComplete = () => {
    setSlopeComplete(true);
    const completedCard = currentStep === 10 ? "negative" : "positive";
    setExploredCards((prev) =>
      prev.includes(completedCard) ? prev : [...prev, completedCard],
    );
    if (currentStep === 10) {
      setCurrentStep(11);
    }
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (currentStep === 5 && slopeComplete) {
      setCurrentStep(6);
      return;
    }
    if (currentStep === 11 && slopeComplete) {
      setCurrentStep(12);
    }
  };

  const questionText = useMemo(() => {
    if (currentStep === 0) return "";
    if (currentStep === 5 && slopeComplete) {
      return APP_DATA.steps[5].doneQuestionText;
    }
    if (currentStep === 11 && slopeComplete) {
      return APP_DATA.steps[11].questionText;
    }
    return APP_DATA.steps[currentStep] ? APP_DATA.steps[currentStep].questionText : "";
  }, [currentStep, slopeComplete]);

  const navText = useMemo(() => {
    if (currentStep === 0) return "";
    if (currentStep === 5 && slopeComplete) {
      return handleComma(APP_DATA.steps[5].doneNavText);
    }
    if (currentStep === 11 && slopeComplete) {
      return handleComma(APP_DATA.steps[11].navText);
    }
    return APP_DATA.steps[currentStep]
      ? handleComma(APP_DATA.steps[currentStep].navText)
      : "";
  }, [currentStep, slopeComplete]);

  const isNextDisabled = !(
    (currentStep === 5 && slopeComplete) ||
    (currentStep === 11 && slopeComplete)
  );

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) {
          positions.push(el.getBoundingClientRect());
        }
      };

      if (currentStep === 0) {
        addNudgeFor("start-button");
      } else if (currentStep === 1) {
        addNudgeFor("card-positive");
      } else if (currentStep === 2) {
        addNudgeFor("hill-click-target");
      } else if (currentStep === 3) {
        addNudgeFor("cycle-click-target");
      } else if (currentStep === 4) {
        if (!arrowSigns.x) addNudgeFor("blue-arrow-click-target");
        if (!arrowSigns.y) addNudgeFor("yellow-arrow-click-target");
      } else if (currentStep === 5 && !slopeComplete) {
        addNudgeFor("green-line-click-target");
      } else if (currentStep === 5 && slopeComplete) {
        addNudgeFor("next-button");
      } else if (currentStep === 6) {
        addNudgeFor("card-negative");
      } else if (currentStep === 7) {
        addNudgeFor("hill-click-target");
      } else if (currentStep === 8) {
        addNudgeFor("cycle-click-target");
      } else if (currentStep === 9) {
        if (!arrowSigns.x) addNudgeFor("blue-arrow-click-target");
        if (!arrowSigns.y) addNudgeFor("yellow-arrow-click-target");
      } else if (currentStep === 10 && !slopeComplete) {
        addNudgeFor("green-line-click-target");
      } else if (currentStep === 11 && slopeComplete) {
        addNudgeFor("next-button");
      } else if (currentStep === 12) {
        addNudgeFor("card-zero");
      }

      setNudgePositions(positions);
    };

    const timeoutId = setTimeout(updateNudges, 60);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, arrowSigns, slopeComplete]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position: position,
      }),
    );

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
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        exploredCards: exploredCards,
        arrowSigns: arrowSigns,
        slopeComplete: slopeComplete,
        onSelectCard: handleSelectCard,
        onIntroComplete: handleIntroComplete,
        onRideComplete: handleRideComplete,
        onArrowTap: handleArrowTap,
        onSlopeComplete: handleSlopeComplete,
        onClearNudges: () => setNudgePositions([]),
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : null),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: navText,
      }),
    ),
    renderNudges(),
  );
};
