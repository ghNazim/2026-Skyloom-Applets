const App = () => {
  const { useState, useMemo, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState("outside");
  const [exploredCards, setExploredCards] = useState([]);
  const [interactionDone, setInteractionDone] = useState(false);
  const [dilationK, setDilationK] = useState(1);
  const [showDilated, setShowDilated] = useState(false);
  const [freeCenter, setFreeCenter] = useState({
    ...FREE_EXPLORE_GEOMETRY.center,
  });
  const [nudgePositions, setNudgePositions] = useState([]);

  const resetInteraction = useCallback(() => {
    setInteractionDone(false);
    setDilationK(1);
    setShowDilated(false);
  }, []);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setSelectedCard("outside");
    setExploredCards([]);
    setInteractionDone(false);
    setDilationK(1);
    setShowDilated(false);
    setFreeCenter({ ...FREE_EXPLORE_GEOMETRY.center });
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setExploredCards([]);
    resetInteraction();
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const handleSelectCard = (cardId) => {
    setSelectedCard(cardId);
    resetInteraction();
    setCurrentStep(2);
  };

  const handleKDragStart = useCallback(() => {
    setShowDilated(true);
  }, []);

  const handleKChange = useCallback((val) => {
    setDilationK(val);
    if (Math.abs(val - 1) > 0.02) {
      setShowDilated(true);
    }
  }, []);

  const handleKRelease = useCallback((val) => {
    setDilationK(val);
    if (!interactionDone) {
      setInteractionDone(true);
    }
  }, [interactionDone]);

  const handleCenterChange = useCallback((pt) => {
    setFreeCenter(pt);
    setShowDilated(true);
  }, []);

  const allCardsExplored = exploredCards.length >= CARD_IDS.length;

  const willCompleteAll =
    currentStep === 2 &&
    interactionDone &&
    !exploredCards.includes(selectedCard) &&
    exploredCards.length === CARD_IDS.length - 1;

  const questionText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].questionText;
    if (currentStep === 2 && selectedCard) {
      return APP_DATA.cards[selectedCard].questionText;
    }
    if (currentStep === 3) return APP_DATA.steps[3].questionText;
    return "";
  }, [currentStep, selectedCard]);

  const navText = useMemo(() => {
    if (currentStep === 1) return handleComma(APP_DATA.steps[1].navText);
    if (currentStep === 2) {
      if (!interactionDone) {
        return handleComma(APP_DATA.steps[2].navTextInitial);
      }
      if (willCompleteAll || allCardsExplored) {
        return handleComma(APP_DATA.steps[2].navTextAllDone);
      }
      return handleComma(APP_DATA.steps[2].navTextDone);
    }
    if (currentStep === 3) {
      return handleComma(APP_DATA.steps[3].navText);
    }
    return "";
  }, [currentStep, interactionDone, willCompleteAll, allCardsExplored]);

  const feedbackHtml = useMemo(() => {
    if (currentStep !== 2 || !selectedCard) return "";
    const card = APP_DATA.cards[selectedCard];
    const raw = interactionDone ? card.feedbackAfter : card.feedbackInitial;
    return renderFeedbackHtml(handleComma(raw));
  }, [currentStep, selectedCard, interactionDone]);

  const isNextDisabled =
    currentStep === 1 ||
    (currentStep === 2 && !interactionDone);

  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;

    if (currentStep === 2) {
      const updatedExplored = exploredCards.includes(selectedCard)
        ? exploredCards
        : [...exploredCards, selectedCard];
      setExploredCards(updatedExplored);

      if (updatedExplored.length >= CARD_IDS.length) {
        setCurrentStep(3);
        setDilationK(1);
        setShowDilated(false);
        setFreeCenter({ ...FREE_EXPLORE_GEOMETRY.center });
      } else {
        setCurrentStep(1);
        resetInteraction();
      }
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 3) {
      setCurrentStep(1);
      resetInteraction();
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
      resetInteraction();
      return;
    }
    if (currentStep === 1) {
      setCurrentStep(0);
      resetEverything();
    }
  };

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
      } else if (currentStep === 4) {
        addNudgeFor("start-over-button");
      } else if (!isNextDisabled) {
        addNudgeFor("next-button");
      }

      setNudgePositions(positions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, isNextDisabled]);

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

  if (currentStep === 4) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.finish.heading,
          text: APP_DATA.finish.text,
          buttonText: APP_DATA.finish.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
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
        selectedCard: selectedCard,
        exploredCards: exploredCards,
        interactionDone: interactionDone,
        dilationK: dilationK,
        showDilated: showDilated,
        center: freeCenter,
        feedbackHtml: feedbackHtml,
        onSelectCard: handleSelectCard,
        onKChange: handleKChange,
        onKDragStart: handleKDragStart,
        onKRelease: handleKRelease,
        onCenterChange: handleCenterChange,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: navText,
      }),
    ),
    renderNudges(),
  );
};
