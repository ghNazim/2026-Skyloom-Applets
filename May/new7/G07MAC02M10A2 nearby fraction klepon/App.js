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

const FinalScreen = ({ onStartOver, estimates }) => {
  return React.createElement(
    "div",
    { className: "klepon-start klepon-final" },
    React.createElement("div", { className: "klepon-start-title" }, APP_DATA.final.heading),
    React.createElement(
      "div",
      { className: "klepon-start-content klepon-final-content" },
      React.createElement(
        "div",
        { className: "klepon-start-recipe" },
        React.createElement(RecipePaper, { estimates }),
      ),
      React.createElement(
        "div",
        { className: "klepon-start-card klepon-final-card" },
        React.createElement("div", {
          className: "klepon-start-copy klepon-final-copy",
          dangerouslySetInnerHTML: { __html: formatFractionsInText(APP_DATA.final.body) },
        }),
      ),
    ),
    React.createElement(
      "button",
      {
        id: "start-over-button",
        className: "btn klepon-start-button klepon-final-button",
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
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [nextButtonText, setNextButtonText] = useState("\u00BB");
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [nudgeKind, setNudgeKind] = useState("tap");
  const [panelsHidden, setPanelsHidden] = useState(false);
  const [panelsFadeIn, setPanelsFadeIn] = useState(false);
  const [canvasFadeIn, setCanvasFadeIn] = useState(false);
  const transitionRef = useRef(false);
  const transitionClonesRef = useRef([]);
  const finalStep = 1 + APP_DATA.ingredientFlows.length * 3;

  const clearTransitionClones = useCallback(() => {
    transitionClonesRef.current.forEach((node) => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
    transitionClonesRef.current = [];
    if (typeof gsap !== "undefined") {
      gsap.killTweensOf("#transition-recipe-clone");
      gsap.killTweensOf("#transition-text-clone");
    }
  }, []);

  const hideNudge = useCallback(() => {
    setShowNudge(false);
    setNudgePosition(null);
    setNudgeKind("tap");
  }, []);

  const showNudgeAtElement = useCallback((id, kind = "tap") => {
    const el = document.getElementById(id);
    if (!el) {
      hideNudge();
      return;
    }
    setNudgePosition(el.getBoundingClientRect());
    setNudgeKind(kind);
    setShowNudge(true);
  }, [hideNudge]);

  const playSnd = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const getIngredientIndex = useCallback(() => {
    if (currentStep <= 0) return 0;
    if (currentStep >= finalStep) return APP_DATA.ingredientFlows.length - 1;
    return Math.floor((currentStep - 1) / 3);
  }, [currentStep, finalStep]);

  const getPhase = useCallback(() => {
    if (currentStep <= 0) return -1;
    return (currentStep - 1) % 3;
  }, [currentStep]);

  const getEstimatesForStep = useCallback(() => {
    const completedCount =
      currentStep >= finalStep
        ? APP_DATA.ingredientFlows.length
        : currentStep <= 0
          ? 0
          : Math.floor((currentStep - 1) / 3);
    return APP_DATA.ingredientFlows.slice(0, completedCount).reduce((acc, flow) => {
      acc[flow.itemKey] = flow.estimateText;
      return acc;
    }, {});
  }, [currentStep, finalStep]);

  const handleStart = () => {
    playSnd("click");
    hideNudge();
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    playSnd("click");
    hideNudge();
    clearTransitionClones();
    transitionRef.current = false;
    setPanelsHidden(false);
    setPanelsFadeIn(false);
    setCanvasFadeIn(false);
    setCurrentStep(0);
  };

  const runProblemToPlaceTransition = useCallback(() => {
    const recipeEl = document.getElementById("problem-recipe-paper");
    const textEl = document.getElementById("problem-line-main");
    if (!recipeEl || !textEl || typeof gsap === "undefined") {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    clearTransitionClones();

    const recipeRect = recipeEl.getBoundingClientRect();
    const textRect = textEl.getBoundingClientRect();
    const textStyles = window.getComputedStyle(textEl);

    const recipeClone = recipeEl.cloneNode(true);
    recipeClone.id = "transition-recipe-clone";
    recipeClone.classList.add("transition-clone");
    Object.assign(recipeClone.style, {
      position: "fixed",
      left: recipeRect.left + "px",
      top: recipeRect.top + "px",
      width: recipeRect.width + "px",
      height: recipeRect.height + "px",
      margin: "0",
      zIndex: "2200",
      pointerEvents: "none",
    });

    const textClone = textEl.cloneNode(true);
    textClone.id = "transition-text-clone";
    textClone.classList.add("transition-clone", "transition-text-clone");
    Object.assign(textClone.style, {
      position: "fixed",
      left: textRect.left + textRect.width / 2 + "px",
      top: textRect.top + "px",
      width: "auto",
      margin: "0",
      zIndex: "2201",
      pointerEvents: "none",
      color: textStyles.color,
      fontSize: textStyles.fontSize,
      fontWeight: textStyles.fontWeight,
      lineHeight: textStyles.lineHeight,
      textAlign: "center",
      whiteSpace: "nowrap",
      textShadow: "0.1vw 0.14vw 0.25vw rgba(0, 0, 0, 0.4)",
      transform: "translateX(-50%)",
    });

    document.body.appendChild(recipeClone);
    document.body.appendChild(textClone);
    transitionClonesRef.current = [recipeClone, textClone];

    transitionRef.current = true;
    setPanelsHidden(true);
    setPanelsFadeIn(false);
    setCanvasFadeIn(false);
    setCurrentStep((prev) => prev + 1);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const questionPanel = document.getElementById("question-panel");
        const questionHeading = questionPanel ? questionPanel.querySelector("h2") : null;
        const targetRect = questionHeading
          ? questionHeading.getBoundingClientRect()
          : questionPanel
            ? questionPanel.getBoundingClientRect()
            : textRect;
        const targetStyles = questionHeading
          ? window.getComputedStyle(questionHeading)
          : textStyles;

        gsap.to(recipeClone, {
          x: -(recipeRect.right + 80),
          duration: 0.5,
          ease: "power2.inOut",
        });

        gsap.to(textClone, {
          left: targetRect.left + targetRect.width / 2,
          top: targetRect.top + Math.max(0, (targetRect.height - textClone.getBoundingClientRect().height) / 2),
          fontSize: targetStyles.fontSize,
          lineHeight: targetStyles.lineHeight,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            clearTransitionClones();
            transitionRef.current = false;
            setPanelsHidden(false);
            setPanelsFadeIn(true);
            setCanvasFadeIn(true);
            window.setTimeout(() => showNudgeAtElement("tenths-dot", "drag"), 200);
          },
        });
      });
    });
  }, [clearTransitionClones, showNudgeAtElement]);

  const handleNext = () => {
    if (isNextDisabled || transitionRef.current) return;
    playSnd("click");
    hideNudge();
    const phase = getPhase();
    const ingredientIndex = getIngredientIndex();
    if (phase === 0) {
      runProblemToPlaceTransition();
      return;
    }
    if (phase === 2) {
      setPanelsHidden(false);
      setPanelsFadeIn(false);
      setCanvasFadeIn(false);
      if (ingredientIndex < APP_DATA.ingredientFlows.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setCurrentStep(finalStep);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep <= 1 || transitionRef.current) return;
    playSnd("click");
    hideNudge();
    clearTransitionClones();
    setPanelsHidden(false);
    setPanelsFadeIn(false);
    setCanvasFadeIn(false);
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
      setCurrentStep((prev) => prev + 1);
    }, 2000);
  }, []);

  useEffect(() => {
    hideNudge();
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setNextButtonText("\u00BB");

    if (currentStep === 0) {
      setIsNextDisabled(true);
      setPanelsHidden(false);
      setPanelsFadeIn(false);
      setCanvasFadeIn(false);
      const tid = window.setTimeout(() => showNudgeAtElement("start-button"), 500);
      return () => window.clearTimeout(tid);
    }

    if (currentStep === finalStep) {
      setIsNextDisabled(true);
      setPanelsHidden(false);
      setPanelsFadeIn(false);
      setCanvasFadeIn(false);
      const tid = window.setTimeout(() => showNudgeAtElement("start-over-button"), 500);
      return () => window.clearTimeout(tid);
    }

    const phase = getPhase();

    if (phase === 0) {
      setIsNextDisabled(false);
      setPanelsHidden(false);
      setPanelsFadeIn(false);
      setCanvasFadeIn(false);
      const tid = window.setTimeout(() => showNudgeAtElement("next-button"), 600);
      return () => window.clearTimeout(tid);
    }

    if (phase === 1) {
      setIsNextDisabled(true);
      if (transitionRef.current) {
        return undefined;
      }
      const tid = window.setTimeout(() => showNudgeAtElement("tenths-dot", "drag"), 600);
      return () => window.clearTimeout(tid);
    }

    if (phase === 2) {
      setIsNextDisabled(true);
      setPanelsHidden(false);
      setPanelsFadeIn(false);
      setCanvasFadeIn(false);
      const tid = window.setTimeout(() => showNudgeAtElement("show-benchmarks-button"), 600);
      return () => window.clearTimeout(tid);
    }
  }, [currentStep, finalStep, getPhase, hideNudge, showNudgeAtElement]);

  useEffect(() => {
    const updateNudge = () => {
      if (!showNudge || transitionRef.current) return;
      if (currentStep === finalStep) {
        showNudgeAtElement("start-over-button");
        return;
      }
      const phase = getPhase();
      if (currentStep === 0) showNudgeAtElement("start-button");
      if (phase === 0 && !isNextDisabled) showNudgeAtElement("next-button");
      if (phase === 1) showNudgeAtElement("tenths-dot", "drag");
      if (phase === 2) {
        if (!isNextDisabled) {
          showNudgeAtElement("next-button");
        } else {
          showNudgeAtElement("show-benchmarks-button");
        }
      }
    };
    window.addEventListener("resize", updateNudge);
    return () => window.removeEventListener("resize", updateNudge);
  }, [currentStep, finalStep, getPhase, isNextDisabled, showNudge, showNudgeAtElement]);

  useEffect(() => {
    return () => clearTransitionClones();
  }, [clearTransitionClones]);

  const ingredientIndex = getIngredientIndex();
  const phase = getPhase();
  const flow = APP_DATA.ingredientFlows[ingredientIndex] || APP_DATA.ingredientFlows[0];
  const estimates = getEstimatesForStep();
  const phaseQuestion =
    phase === 0 ? "" :
    phase === 1 ? flow.placeQuestion :
    phase === 2 ? flow.benchmarkQuestion : "";
  const phaseNav =
    phase === 0 ? flow.problemNav :
    phase === 1 ? flow.placeNav :
    phase === 2 ? APP_DATA.steps[3].navText : "";
  const questionText = dynamicQuestionText !== null ? dynamicQuestionText : phaseQuestion;
  const navText = dynamicNavText !== null ? dynamicNavText : phaseNav;

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(StartScreen, { onStart: handleStart }),
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition, kind: nudgeKind }),
    );
  }

  if (currentStep === finalStep) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(FinalScreen, { onStartOver: handleStartOver, estimates }),
      ),
      React.createElement(Nudge, { show: showNudge, position: nudgePosition, kind: nudgeKind }),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    questionText
      ? React.createElement(QuestionPanel, {
          text: formatFractionsInText(questionText),
          step: currentStep,
          hidden: panelsHidden,
          fadeIn: panelsFadeIn,
        })
      : null,
    React.createElement(
      "div",
      { className: "app-main-content" },
      phase === 0
        ? React.createElement(Problem, { ingredientIndex, estimates })
        : React.createElement(
            "div",
            {
              className:
                "canvas-host" +
                (panelsHidden ? " canvas-host-hidden" : "") +
                (canvasFadeIn ? " canvas-host-fade-in" : ""),
            },
            React.createElement(MainCanvas, {
              step: currentStep,
              ingredientIndex,
              onSetNextEnabled: setNextEnabled,
              onUpdateTexts: updateTexts,
              onSetNextLabel: setNextLabel,
              onCompleteTenthsPlacement: completeTenthsPlacement,
              onHideNudge: hideNudge,
              onShowNudgeAtElement: showNudgeAtElement,
            }),
          ),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled || transitionRef.current,
        isPrevDisabled: currentStep <= 1 || transitionRef.current,
        navText: formatFractionsInText(navText),
        nextButtonText: nextButtonText,
        step: currentStep,
        navHidden: panelsHidden,
        navFadeIn: panelsFadeIn,
      }),
    ),
    React.createElement(Nudge, { show: showNudge && !panelsHidden, position: nudgePosition, kind: nudgeKind }),
  );
};
