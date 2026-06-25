const App = () => {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;

  const [currentStep, setCurrentStep] = useState(0);

  // Step 1 visual state
  const [showGray, setShowGray] = useState(false);
  const [yellowProgress, setYellowProgress] = useState(0);
  const [arrowProgress, setArrowProgress] = useState(0);
  const [arrowMerge, setArrowMerge] = useState(0);
  const [showArrowLabels, setShowArrowLabels] = useState(false);
  const [showPreimagePoints, setShowPreimagePoints] = useState(false);
  const [showImagePoints, setShowImagePoints] = useState(false);
  const [showPillLabels, setShowPillLabels] = useState(false);
  const [pillLabelsOpacity, setPillLabelsOpacity] = useState(0);
  const [step1TextHtml, setStep1TextHtml] = useState("");
  const [step1Phase, setStep1Phase] = useState("initial");
  const [isAnimating, setIsAnimating] = useState(false);

  // Step 2 state
  const [activeProperty, setActiveProperty] = useState(null);
  const [exploredProperties, setExploredProperties] = useState([]);
  const [completedProperties, setCompletedProperties] = useState([]);
  const [step2IntroProgress, setStep2IntroProgress] = useState(0);
  const [step2IntroDone, setStep2IntroDone] = useState(false);
  const [sizeOverlap, setSizeOverlap] = useState(0);
  const [showSizeStroke, setShowSizeStroke] = useState(false);
  const [shapeHighlightOnGray, setShapeHighlightOnGray] = useState(false);
  const [shapeCloneProgress, setShapeCloneProgress] = useState(null);
  const [shapeCloneSettled, setShapeCloneSettled] = useState(false);
  const [step2Feedback, setStep2Feedback] = useState("");
  const [positionActive, setPositionActive] = useState(false);
  const [positionYellowProgress, setPositionYellowProgress] = useState(1);
  const [positionCallout, setPositionCallout] = useState(null);
  const [positionShowImageLabel, setPositionShowImageLabel] = useState(true);
  const [positionShowPurplePoint, setPositionShowPurplePoint] = useState(false);
  const [positionPointOpacity, setPositionPointOpacity] = useState(0);
  const [positionCalloutOpacity, setPositionCalloutOpacity] = useState(0);
  const [orientationActive, setOrientationActive] = useState(false);
  const [orientationArrowProgress, setOrientationArrowProgress] = useState(0);
  const [orientationArrowMerge, setOrientationArrowMerge] = useState(0);
  const [orientationShowPoints, setOrientationShowPoints] = useState(false);

  const [nudgePositions, setNudgePositions] = useState([]);
  const cancelRef = useRef(null);

  const cancelAnimations = useCallback(() => {
    if (typeof cancelRef.current === "function") {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  const markPropertyComplete = useCallback((propId) => {
    setCompletedProperties((prev) =>
      prev.includes(propId) ? prev : [...prev, propId],
    );
  }, []);

  const resetPropertyVisuals = useCallback(() => {
    setSizeOverlap(0);
    setShowSizeStroke(false);
    setShapeCloneProgress(null);
    setShapeCloneSettled(false);
    setShapeHighlightOnGray(false);
    setPositionActive(false);
    setPositionYellowProgress(1);
    setPositionCallout(null);
    setPositionShowImageLabel(true);
    setPositionShowPurplePoint(false);
    setPositionPointOpacity(0);
    setPositionCalloutOpacity(0);
    setOrientationActive(false);
    setOrientationArrowProgress(0);
    setOrientationArrowMerge(0);
    setOrientationShowPoints(false);
  }, []);

  const resetStep1 = useCallback(() => {
    setShowGray(false);
    setYellowProgress(0);
    setArrowProgress(0);
    setArrowMerge(0);
    setShowArrowLabels(false);
    setShowPreimagePoints(false);
    setShowImagePoints(false);
    setShowPillLabels(false);
    setPillLabelsOpacity(0);
    setStep1TextHtml("");
    setStep1Phase("initial");
    setIsAnimating(false);
  }, []);

  const resetStep2 = useCallback(() => {
    setActiveProperty(null);
    setExploredProperties([]);
    setCompletedProperties([]);
    setStep2IntroProgress(0);
    setStep2IntroDone(false);
    setStep2Feedback("");
    resetPropertyVisuals();
    setIsAnimating(false);
  }, [resetPropertyVisuals]);

  const resetEverything = useCallback(() => {
    cancelAnimations();
    resetStep1();
    resetStep2();
    setCurrentStep(0);
  }, [cancelAnimations, resetStep1, resetStep2]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    resetStep1();
    resetStep2();
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const runFirstTranslationAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    setStep1Phase("animating");
    setShowGray(true);

    const cleanups = [];
    cleanups.push(
      animateValue(0, 1, TRANSLATION_MOVE_DURATION, setYellowProgress, () => {
        cleanups.push(
          animateValue(0, 1, ARROW_GROW_DURATION, setArrowProgress, () => {
            setShowArrowLabels(true);
            cleanups.push(
              animateValue(
                0,
                1,
                ARROW_MERGE_DURATION,
                setArrowMerge,
                () => {
                  setIsAnimating(false);
                  setStep1Phase("merged");
                },
                easeInOutCubic,
              ),
            );
          }),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations]);

  const handleYellowClickInitial = useCallback(() => {
    if (step1Phase !== "initial" || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    runFirstTranslationAnimation();
  }, [step1Phase, isAnimating, runFirstTranslationAnimation]);

  const handleGrayClick = useCallback(() => {
    if (step1Phase !== "merged" || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    setIsAnimating(true);
    setShowArrowLabels(false);

    const cleanups = [];
    cleanups.push(
      animateValue(arrowMerge, 0, ARROW_MERGE_DURATION, setArrowMerge, () => {
        setArrowProgress(1);
        setShowPreimagePoints(true);
        setShowPillLabels(true);
        setStep1TextHtml(APP_DATA.steps[1].textPreimage);

        cleanups.push(
          animateValue(0, 1, 600, setPillLabelsOpacity, () => {
            setIsAnimating(false);
            setStep1Phase("preimageLabeled");
          }),
        );
      }, easeInOutCubic),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [step1Phase, isAnimating, arrowMerge, cancelAnimations]);

  const handleYellowClickSecond = useCallback(() => {
    if (step1Phase !== "preimageLabeled" || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    setShowImagePoints(true);
    setStep1TextHtml(APP_DATA.steps[1].textImage);
    setStep1Phase("complete");
  }, [step1Phase, isAnimating]);

  const runStep2Intro = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    setStep2IntroProgress(0);
    setStep2IntroDone(false);

    const cleanups = [];
    cleanups.push(
      animateValue(0, 1, STEP2_INTRO_DURATION, setStep2IntroProgress, () => {
        setStep2IntroDone(true);
        setIsAnimating(false);
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations]);

  useEffect(() => {
    if (currentStep === 2 && !step2IntroDone && step2IntroProgress === 0) {
      runStep2Intro();
    }
  }, [currentStep, step2IntroDone, step2IntroProgress, runStep2Intro]);

  const runSizeAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    setShowSizeStroke(false);
    setSizeOverlap(0);
    setStep2Feedback("");

    const cleanups = [];
    cleanups.push(
      delay(PROPERTY_ANIM_DELAY, () => {
        cleanups.push(
          animateValue(0, 1, SIZE_OVERLAP_DURATION, setSizeOverlap, () => {
            setShowSizeStroke(true);
            setStep2Feedback(APP_DATA.steps[2].feedbackSize);
            cleanups.push(
              delay(SIZE_HOLD_DURATION, () => {
                setShowSizeStroke(false);
                cleanups.push(
                  animateValue(1, 0, SIZE_OVERLAP_DURATION, setSizeOverlap, () => {
                    markPropertyComplete("size");
                    setIsAnimating(false);
                  }),
                );
              }),
            );
          }),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, markPropertyComplete]);

  const runShapeAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    setShapeHighlightOnGray(true);
    setShapeCloneProgress(0);
    setShapeCloneSettled(false);
    setStep2Feedback("");

    const cleanups = [];
    cleanups.push(
      delay(400, () => {
        cleanups.push(
          animateValue(
            0,
            1,
            SHAPE_CLONE_DURATION,
            setShapeCloneProgress,
            () => {
              setShapeCloneSettled(true);
              setStep2Feedback(APP_DATA.steps[2].feedbackShape);
              markPropertyComplete("shape");
              setIsAnimating(false);
            },
            easeInOutCubic,
          ),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, markPropertyComplete]);

  const runPositionAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    setStep2Feedback("");
    setPositionActive(true);
    setPositionYellowProgress(0);
    setPositionShowImageLabel(false);
    setPositionShowPurplePoint(false);
    setPositionCallout(null);
    setPositionPointOpacity(0);
    setPositionCalloutOpacity(0);

    const cleanups = [];
    cleanups.push(
      delay(POSITION_INITIAL_DELAY, () => {
        setPositionShowPurplePoint(true);
        setPositionCallout("original");
        cleanups.push(
          animateValue(
            0,
            1,
            POSITION_MARKER_FADE_DURATION,
            (v) => {
              setPositionPointOpacity(v);
              setPositionCalloutOpacity(v);
            },
            () => {
              cleanups.push(
                delay(POSITION_CALLOUT_HOLD, () => {
                  setPositionCallout(null);
                  setPositionCalloutOpacity(0);
                  cleanups.push(
                    animateValue(
                      0,
                      1,
                      POSITION_MOVE_DURATION,
                      setPositionYellowProgress,
                      () => {
                        setPositionShowImageLabel(true);
                        setPositionCallout("final");
                        setPositionCalloutOpacity(0);
                        cleanups.push(
                          animateValue(
                            0,
                            1,
                            POSITION_MARKER_FADE_DURATION,
                            setPositionCalloutOpacity,
                            () => {
                              setStep2Feedback(
                                APP_DATA.steps[2].feedbackPosition,
                              );
                              markPropertyComplete("position");
                              setIsAnimating(false);
                            },
                          ),
                        );
                      },
                    ),
                  );
                }),
              );
            },
          ),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, markPropertyComplete]);

  const runOrientationAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    setStep2Feedback("");
    setOrientationActive(true);
    setOrientationShowPoints(false);
    setOrientationArrowProgress(0);
    setOrientationArrowMerge(0);

    const cleanups = [];
    cleanups.push(
      delay(PROPERTY_ANIM_DELAY, () => {
        setOrientationShowPoints(true);
        cleanups.push(
          animateValue(
            0,
            1,
            ORIENTATION_ARROW_GROW_DURATION,
            setOrientationArrowProgress,
            () => {
              cleanups.push(
                animateValue(
                  0,
                  1,
                  ORIENTATION_ARROW_MERGE_DURATION,
                  setOrientationArrowMerge,
                  () => {
                    setStep2Feedback(APP_DATA.steps[2].feedbackOrientation);
                    markPropertyComplete("orientation");
                    setIsAnimating(false);
                  },
                  easeInOutCubic,
                ),
              );
            },
          ),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, markPropertyComplete]);

  const handleSelectProperty = useCallback(
    (propId) => {
      if (isAnimating || !step2IntroDone) return;
      if (typeof playSound === "function") playSound("click");
      setActiveProperty(propId);
      setExploredProperties((prev) =>
        prev.includes(propId) ? prev : [...prev, propId],
      );
      resetPropertyVisuals();
      setStep2Feedback("");

      if (propId === "size") runSizeAnimation();
      else if (propId === "shape") runShapeAnimation();
      else if (propId === "position") runPositionAnimation();
      else if (propId === "orientation") runOrientationAnimation();
    },
    [
      isAnimating,
      step2IntroDone,
      resetPropertyVisuals,
      runSizeAnimation,
      runShapeAnimation,
      runPositionAnimation,
      runOrientationAnimation,
    ],
  );

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1 || step1Phase !== "complete") return;
    cancelAnimations();
    resetStep2();
    setCurrentStep(2);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      cancelAnimations();
      resetStep1();
      setCurrentStep(0);
    }
  };

  const handleSummarize = () => {
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    setCurrentStep(3);
  };

  const step1NavText = useMemo(() => {
    if (currentStep !== 1) return "";
    if (isAnimating && step1Phase !== "complete") return "";
    if (step1Phase === "complete") {
      return handleComma(APP_DATA.steps[1].navTextNext);
    }
    return handleComma(APP_DATA.steps[1].navTextTapShape);
  }, [currentStep, isAnimating, step1Phase]);

  const isNextDisabled = currentStep !== 1 || step1Phase !== "complete";
  const isPrevDisabled = currentStep <= 1;
  const step2ButtonsDisabled = isAnimating || !step2IntroDone;
  const allPropertiesComplete =
    completedProperties.length >= PROPERTY_IDS.length;
  const showSummarize = allPropertiesComplete && !isAnimating;

  const step1GraphProps = {
    showGray: showGray,
    yellowProgress: yellowProgress,
    arrowProgress: arrowProgress,
    arrowMerge: arrowMerge,
    showArrowLabels: showArrowLabels,
    showPreimagePoints: showPreimagePoints,
    showImagePoints: showImagePoints,
    showPillLabels: showPillLabels,
    pillLabelsOpacity: pillLabelsOpacity,
    grayClickable: step1Phase === "merged" && !isAnimating,
    yellowClickable:
      (step1Phase === "initial" || step1Phase === "preimageLabeled") &&
      !isAnimating,
    onGrayClick: handleGrayClick,
    onYellowClick:
      step1Phase === "initial"
        ? handleYellowClickInitial
        : step1Phase === "preimageLabeled"
          ? handleYellowClickSecond
          : undefined,
  };

  const step2GraphProps = {
    yellowProgress: step2IntroProgress,
    showLabels: step2IntroDone,
    sizeOverlap: sizeOverlap,
    showSizeStroke: showSizeStroke,
    shapeCloneProgress: shapeCloneProgress,
    shapeCloneSettled: shapeCloneSettled,
    shapeHighlightOnGray: shapeHighlightOnGray,
    positionActive: positionActive,
    positionYellowProgress: positionYellowProgress,
    positionCallout: positionCallout,
    positionShowImageLabel: positionShowImageLabel,
    positionShowPurplePoint: positionShowPurplePoint,
    positionPointOpacity: positionPointOpacity,
    positionCalloutOpacity: positionCalloutOpacity,
    orientationActive: orientationActive,
    orientationArrowProgress: orientationArrowProgress,
    orientationArrowMerge: orientationArrowMerge,
    orientationShowPoints: orientationShowPoints,
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
      } else if (currentStep === 1 && !isAnimating) {
        if (step1Phase === "initial" || step1Phase === "merged") {
          const svg = document.querySelector(".translation-intro-svg");
          const center =
            step1Phase === "merged" ? PREIMAGE_CENTER : PREIMAGE_CENTER;
          const rect = getCentroidClientRect(svg, center);
          if (rect) positions.push(rect);
        } else if (step1Phase === "preimageLabeled") {
          const svg = document.querySelector(".translation-intro-svg");
          const rect = getCentroidClientRect(svg, IMAGE_CENTER);
          if (rect) positions.push(rect);
        } else if (step1Phase === "complete") {
          addNudgeFor("next-button");
        }
      } else if (currentStep === 2 && !isAnimating && step2IntroDone) {
        if (showSummarize) {
          addNudgeFor("summarize-button");
        } else {
          const firstUnexplored = PROPERTY_IDS.find(
            (id) => !exploredProperties.includes(id),
          );
          if (firstUnexplored) {
            addNudgeFor("property-btn-" + firstUnexplored);
          }
        }
      } else if (currentStep === 3) {
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
  }, [
    currentStep,
    step1Phase,
    isAnimating,
    step2IntroDone,
    exploredProperties,
    showSummarize,
  ]);

  useEffect(() => () => cancelAnimations(), [cancelAnimations]);

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

  if (currentStep === 1) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(Step1Canvas, {
          graphProps: step1GraphProps,
          textHtml: step1TextHtml,
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
          navText: step1NavText,
        }),
      ),
      renderNudges(),
    );
  }

  if (currentStep === 3) {
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
          summaryBox: true,
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
      React.createElement(Step2Canvas, {
        activeProperty: activeProperty,
        exploredProperties: exploredProperties,
        buttonsDisabled: step2ButtonsDisabled,
        onSelectProperty: handleSelectProperty,
        graphProps: step2GraphProps,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel navigation2-panel" },
      React.createElement(Navigation2, {
        feedbackHtml: step2Feedback,
        showSummarize: showSummarize,
        onSummarize: handleSummarize,
      }),
    ),
    renderNudges(),
  );
};
