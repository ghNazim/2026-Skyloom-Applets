const App = () => {
  const { useState, useEffect, useMemo, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [exploredCards, setExploredCards] = useState([]);
  const [arrowSigns, setArrowSigns] = useState({ x: false, y: false });
  const [slopeComplete, setSlopeComplete] = useState(false);
  const [summaryComplete, setSummaryComplete] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);

  const resetSlopeScenario = useCallback(() => {
    setArrowSigns({ x: false, y: false });
    setSlopeComplete(false);
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    setExploredCards([]);
    setSummaryComplete(false);
    resetSlopeScenario();
    setCurrentStep(1);
  };

  const handleSummaryComplete = useCallback(() => {
    setSummaryComplete(true);
  }, []);

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
    if (currentStep === 11 && cardId === "zero") {
      if (typeof playSound === "function") playSound("click");
      resetSlopeScenario();
      setCurrentStep(12);
      return;
    }
    if (currentStep === 16 && cardId === "nondefined") {
      if (typeof playSound === "function") playSound("click");
      resetSlopeScenario();
      setCurrentStep(17);
      return;
    }
  };

  const handleIntroComplete = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleRideComplete = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleArrowTap = (axis) => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    setArrowSigns((prev) => ({ ...prev, [axis]: true }));
  };

  useEffect(() => {
    if (
      (currentStep === 4 ||
        currentStep === 9 ||
        currentStep === 14 ||
        currentStep === 19) &&
      arrowSigns.x &&
      arrowSigns.y
    ) {
      const id = setTimeout(() => setCurrentStep(currentStep + 1), 350);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [currentStep, arrowSigns]);

  const handleSlopeComplete = () => {
    setSlopeComplete(true);
    const completedCard =
      currentStep === 10
        ? "negative"
        : currentStep === 15
          ? "zero"
          : currentStep === 20
            ? "nondefined"
            : "positive";
    setExploredCards((prev) =>
      prev.includes(completedCard) ? prev : [...prev, completedCard],
    );
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (currentStep === 5 && slopeComplete) {
      setCurrentStep(6);
      return;
    }
    if (currentStep === 10 && slopeComplete) {
      setCurrentStep(11);
      return;
    }
    if (currentStep === 15 && slopeComplete) {
      setCurrentStep(16);
      return;
    }
    if (currentStep === 20 && slopeComplete) {
      resetSlopeScenario();
      setSummaryComplete(false);
      setCurrentStep(21);
      return;
    }
    if (currentStep === 21 && summaryComplete) {
      setExploredCards([]);
      setSummaryComplete(false);
      resetSlopeScenario();
      setCurrentStep(0);
    }
  };

  const questionText = useMemo(() => {
    if (currentStep === 0) return "";
    if (currentStep === 5 && slopeComplete) {
      return APP_DATA.steps[5].doneQuestionText;
    }
    if (currentStep === 10 && slopeComplete) {
      return APP_DATA.steps[10].doneQuestionText;
    }
    if (currentStep === 15 && slopeComplete) {
      return APP_DATA.steps[15].doneQuestionText;
    }
    if (currentStep === 20 && slopeComplete) {
      return APP_DATA.steps[20].doneQuestionText;
    }
    if (currentStep === 21 && summaryComplete) {
      return APP_DATA.steps[21].doneQuestionText;
    }
    return APP_DATA.steps[currentStep]
      ? APP_DATA.steps[currentStep].questionText
      : "";
  }, [currentStep, slopeComplete, summaryComplete]);

  const navText = useMemo(() => {
    if (currentStep === 0) return "";
    if (currentStep === 5 && slopeComplete) {
      return handleComma(APP_DATA.steps[5].doneNavText);
    }
    if (currentStep === 10 && slopeComplete) {
      return handleComma(APP_DATA.steps[10].doneNavText);
    }
    if (currentStep === 15 && slopeComplete) {
      return handleComma(APP_DATA.steps[15].doneNavText);
    }
    if (currentStep === 20 && slopeComplete) {
      return handleComma(APP_DATA.steps[20].doneNavText);
    }
    if (currentStep === 21 && summaryComplete) {
      return handleComma(APP_DATA.steps[21].doneNavText);
    }
    return APP_DATA.steps[currentStep]
      ? handleComma(APP_DATA.steps[currentStep].navText)
      : "";
  }, [currentStep, slopeComplete, summaryComplete]);

  const isNextDisabled = !(
    (currentStep === 5 && slopeComplete) ||
    (currentStep === 10 && slopeComplete) ||
    (currentStep === 15 && slopeComplete) ||
    (currentStep === 20 && slopeComplete) ||
    (currentStep === 21 && summaryComplete)
  );

  const nextSymbol =
    currentStep === 21 && summaryComplete
      ? APP_DATA.steps[21].nextText
      : "&raquo;";

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
      } else if (currentStep === 10 && slopeComplete) {
        addNudgeFor("next-button");
      } else if (currentStep === 11) {
        addNudgeFor("card-zero");
      } else if (currentStep === 12) {
        addNudgeFor("hill-click-target");
      } else if (currentStep === 13) {
        addNudgeFor("cycle-click-target");
      } else if (currentStep === 14) {
        if (!arrowSigns.x) addNudgeFor("blue-arrow-click-target");
        if (!arrowSigns.y) addNudgeFor("yellow-text-click-target");
      } else if (currentStep === 15 && !slopeComplete) {
        addNudgeFor("green-line-click-target");
      } else if (currentStep === 15 && slopeComplete) {
        addNudgeFor("next-button");
      } else if (currentStep === 16) {
        addNudgeFor("card-nondefined");
      } else if (currentStep === 17) {
        addNudgeFor("hill-click-target");
      } else if (currentStep === 18) {
        addNudgeFor("cycle-click-target");
      } else if (currentStep === 19) {
        if (!arrowSigns.x) addNudgeFor("blue-text-click-target");
        if (!arrowSigns.y) addNudgeFor("yellow-arrow-click-target");
      } else if (currentStep === 20 && !slopeComplete) {
        addNudgeFor("green-line-click-target");
      } else if (currentStep === 20 && slopeComplete) {
        addNudgeFor("next-button");
      } else if (currentStep === 21 && summaryComplete) {
        addNudgeFor("next-button");
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
        onSummaryComplete: handleSummaryComplete,
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
        nextSymbol: nextSymbol,
      }),
    ),
    renderNudges(),
  );
};
