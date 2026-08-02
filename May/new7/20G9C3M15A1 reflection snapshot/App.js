const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const emptyVisual = {
    caseId: null,
    pointOpacity: 0,
    initialGuideProgress: 0,
    reflectorProgress: 0,
    projectionProgress: 0,
    foldProgress: 0,
    showProjection: false,
    showFoldOverlay: false,
    showGhost: false,
    finalGuideProgress: 0,
    showFinalLabel: false,
    showResultBoxes: false,
    hMeasureProgress: 0,
  };

  const prefoldVisualFor = (caseId) => ({
    ...emptyVisual,
    caseId,
    pointOpacity: 1,
    initialGuideProgress: 1,
    reflectorProgress: 1,
    hMeasureProgress: caseId === "lineYH" || caseId === "lineXK" ? 1 : 0,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [activeReflector, setActiveReflector] = useState(null);
  const [exploredReflectors, setExploredReflectors] = useState([]);
  const [visual, setVisual] = useState(emptyVisual);
  const [navStage, setNavStage] = useState("idle");
  const [isAnimating, setIsAnimating] = useState(false);
  const [postFoldPromptReady, setPostFoldPromptReady] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);
  const cancelRef = useRef(null);
  const postFoldPromptRef = useRef(null);

  const cancelAnimations = useCallback(() => {
    if (typeof cancelRef.current === "function") {
      cancelRef.current();
      cancelRef.current = null;
    }
    if (postFoldPromptRef.current) {
      clearTimeout(postFoldPromptRef.current);
      postFoldPromptRef.current = null;
    }
  }, []);

  const setVisualPart = useCallback((part) => {
    setVisual((prev) => ({ ...prev, ...part }));
  }, []);

  const wait = useCallback((ms, cleanups, callback) => {
    cleanups.push(delay(ms, callback));
  }, []);

  const animateVisualValue = useCallback(
    (key, from, to, duration, cleanups, onComplete) => {
      cleanups.push(
        animateValue(
          from,
          to,
          duration,
          (value) => setVisualPart({ [key]: value }),
          onComplete,
          easeInOutCubic,
        ),
      );
    },
    [setVisualPart],
  );

  const resetGraph = useCallback(() => {
    cancelAnimations();
    setActiveReflector(null);
    setVisual(emptyVisual);
    setNavStage("idle");
    setIsAnimating(false);
    setPostFoldPromptReady(false);
  }, [cancelAnimations]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetGraph();
    setCurrentStep(1);
  };

  const finishPrefold = useCallback((caseId, cleanups) => {
    wait(ANIMATION_PAUSE, cleanups, () => {
      animateVisualValue(
        "pointOpacity",
        0,
        1,
        PREFOLD_POINT_DURATION,
        cleanups,
        () => {
          wait(ANIMATION_PAUSE, cleanups, () => {
            animateVisualValue(
              "initialGuideProgress",
              0,
              1,
              PREFOLD_GUIDE_DURATION,
              cleanups,
              () => {
                wait(ANIMATION_PAUSE, cleanups, () => {
                  animateVisualValue(
                    "reflectorProgress",
                    0,
                    1,
                    REFLECTOR_GROW_DURATION,
                    cleanups,
                    () => {
                      const completePrefold = () => {
                        setNavStage("prefold");
                        setExploredReflectors((prev) =>
                          prev.includes(caseId) ? prev : [...prev, caseId],
                        );
                        setIsAnimating(false);
                      };

                      if (caseId === "lineYH" || caseId === "lineXK") {
                        wait(ANIMATION_PAUSE, cleanups, () => {
                          animateVisualValue(
                            "hMeasureProgress",
                            0,
                            1,
                            OFFSET_MEASURE_DURATION,
                            cleanups,
                            completePrefold,
                          );
                        });
                      } else {
                        completePrefold();
                      }
                    },
                  );
                });
              },
            );
          });
        },
      );
    });
  }, [animateVisualValue, wait]);

  const runPrefoldAnimation = useCallback(
    (caseId) => {
      cancelAnimations();
      setIsAnimating(true);
      setPostFoldPromptReady(false);
      setActiveReflector(caseId);
      setNavStage("idle");
      setVisual({ ...emptyVisual, caseId });
      const cleanups = [];
      finishPrefold(caseId, cleanups);
      cancelRef.current = () => cleanups.forEach((fn) => fn());
    },
    [cancelAnimations, finishPrefold],
  );

  const runFoldAnimation = useCallback(() => {
    if (!activeReflector || navStage !== "prefold" || isAnimating) return;
    cancelAnimations();
    if (typeof playSound === "function") playSound("click");
    setIsAnimating(true);
    setPostFoldPromptReady(false);
    setVisual(prefoldVisualFor(activeReflector));

    const cleanups = [];
    setVisualPart({ showProjection: true, projectionProgress: 0 });
    animateVisualValue(
      "projectionProgress",
      0,
      1,
      PROJECTION_GROW_DURATION,
      cleanups,
      () => {
        wait(ANIMATION_PAUSE, cleanups, () => {
          setVisualPart({ showFoldOverlay: true, foldProgress: 0 });
          animateVisualValue(
            "foldProgress",
            0,
            1,
            FOLD_DURATION,
            cleanups,
            () => {
              setVisualPart({
                showGhost: true,
                showFoldOverlay: false,
                finalGuideProgress: 0,
              });
              wait(ANIMATION_PAUSE, cleanups, () => {
                animateVisualValue(
                  "finalGuideProgress",
                  0,
                  1,
                  FINAL_GUIDE_DURATION,
                  cleanups,
                  () => {
                    setVisualPart({
                      showFinalLabel: true,
                      showResultBoxes: true,
                    });
                    setNavStage("folded");
                    setIsAnimating(false);
                    postFoldPromptRef.current = setTimeout(() => {
                      postFoldPromptRef.current = null;
                      setPostFoldPromptReady(true);
                    }, POST_FOLD_PROMPT_DELAY);
                  },
                );
              });
            },
          );
        });
      },
    );
    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [
    activeReflector,
    animateVisualValue,
    cancelAnimations,
    isAnimating,
    navStage,
    setVisualPart,
    wait,
  ]);

  const handleSelectReflector = useCallback(
    (reflectorId) => {
      if (isAnimating || currentStep !== 1) return;
      if (!IMPLEMENTED_REFLECTION_IDS.includes(reflectorId)) return;
      if (typeof playSound === "function") playSound("click");
      setPostFoldPromptReady(false);
      runPrefoldAnimation(reflectorId);
    },
    [currentStep, isAnimating, runPrefoldAnimation],
  );

  const handlePrevious = useCallback(() => {
    if (isAnimating || !activeReflector) return;
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    setPostFoldPromptReady(false);
    if (navStage === "folded") {
      setVisual(prefoldVisualFor(activeReflector));
      setNavStage("prefold");
    } else if (navStage === "prefold") {
      setActiveReflector(null);
      setVisual(emptyVisual);
      setNavStage("idle");
    }
  }, [activeReflector, cancelAnimations, isAnimating, navStage]);

  const handleSummarize = useCallback(() => {
    if (isAnimating || exploredReflectors.length < REFLECTION_IDS.length) return;
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    setPostFoldPromptReady(false);
    setCurrentStep(2);
  }, [cancelAnimations, exploredReflectors.length, isAnimating]);

  const handleStartOver = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    setCurrentStep(0);
    setActiveReflector(null);
    setExploredReflectors([]);
    setVisual(emptyVisual);
    setNavStage("idle");
    setIsAnimating(false);
    setPostFoldPromptReady(false);
  }, [cancelAnimations]);

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
      } else if (currentStep === 1 && !isAnimating) {
        const allExplored = exploredReflectors.length >= REFLECTION_IDS.length;
        if (allExplored && postFoldPromptReady) {
          addNudgeFor("summarize-button");
        } else if (navStage === "folded" && postFoldPromptReady) {
          const firstUnexplored = REFLECTION_IDS.find(
            (id) => !exploredReflectors.includes(id),
          );
          if (firstUnexplored) {
            addNudgeFor("reflection-btn-" + firstUnexplored);
          }
        } else if (navStage === "prefold") {
          addNudgeFor("reflection-next-button");
        } else if (navStage === "idle") {
          const firstUnexplored = REFLECTION_IDS.find(
            (id) => !exploredReflectors.includes(id),
          );
          if (firstUnexplored) {
            addNudgeFor("reflection-btn-" + firstUnexplored);
          } else {
            addNudgeFor("summarize-button");
          }
        }
      } else if (currentStep === 2) {
        addNudgeFor("start-over-button");
      }

      setNudgePositions(positions);
    };

    const timeoutId = setTimeout(updateNudges, 50);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, exploredReflectors, isAnimating, navStage, postFoldPromptReady]);

  useEffect(() => () => cancelAnimations(), [cancelAnimations]);

  const renderNudges = () =>
    nudgePositions.map((position, index) =>
      React.createElement(Nudge, {
        key: index,
        show: true,
        position,
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

  if (currentStep === 2) {
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
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(ReflectionCanvas, {
        activeReflector,
        exploredReflectors,
        visual,
        isAnimating,
        navStage,
        onSelectReflector: handleSelectReflector,
        onPrevious: handlePrevious,
        onNext: runFoldAnimation,
        showSummarize:
          exploredReflectors.length >= REFLECTION_IDS.length &&
          !isAnimating &&
          postFoldPromptReady,
        onSummarize: handleSummarize,
      }),
    ),
    renderNudges(),
  );
};
