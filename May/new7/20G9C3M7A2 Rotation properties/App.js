const App = () => {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;

  const [currentStep, setCurrentStep] = useState(0);

  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [topTextHtml, setTopTextHtml] = useState("");
  const [bottomTextHtml, setBottomTextHtml] = useState("");
  const [topTextVisible, setTopTextVisible] = useState(false);
  const [bottomTextVisible, setBottomTextVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [introRotationProgress, setIntroRotationProgress] = useState(0);
  const [showPurpleArrow, setShowPurpleArrow] = useState(false);
  const [purpleArrowDrawProgress, setPurpleArrowDrawProgress] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);

  const [activeProperty, setActiveProperty] = useState(null);
  const [exploredProperties, setExploredProperties] = useState([]);

  const [sizeOverlapProgress, setSizeOverlapProgress] = useState(0);
  const [showSizeStroke, setShowSizeStroke] = useState(false);

  const [shapeOnOrange, setShapeOnOrange] = useState(false);
  const [shapeGroupAngle, setShapeGroupAngle] = useState(0);

  const [positionMode, setPositionMode] = useState(false);
  const [positionBlueProgress, setPositionBlueProgress] = useState(0);
  const [positionPointOpacity, setPositionPointOpacity] = useState(0);
  const [positionCallout, setPositionCallout] = useState(null);
  const [positionCalloutOpacity, setPositionCalloutOpacity] = useState(0);

  const [orientationMode, setOrientationMode] = useState(false);
  const [orientationProgress, setOrientationProgress] = useState(0);
  const [showOrientationArrows, setShowOrientationArrows] = useState(false);

  const [propertyShowBlue, setPropertyShowBlue] = useState(true);
  const [propertyShowPurple, setPropertyShowPurple] = useState(true);

  const [nudgePositions, setNudgePositions] = useState([]);
  const cancelRef = useRef(null);

  const cancelAnimations = useCallback(() => {
    if (typeof cancelRef.current === "function") {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  const hideTexts = useCallback(() => {
    setTopTextVisible(false);
    setBottomTextVisible(false);
  }, []);

  const showTexts = useCallback((top, bottom) => {
    if (top !== undefined) setTopTextHtml(top);
    if (bottom !== undefined) setBottomTextHtml(bottom);
    requestAnimationFrame(() => {
      if (top !== undefined) setTopTextVisible(true);
      if (bottom !== undefined) setBottomTextVisible(true);
    });
  }, []);

  const resetPropertyVisuals = useCallback(() => {
    setSizeOverlapProgress(0);
    setShowSizeStroke(false);
    setShapeOnOrange(false);
    setShapeGroupAngle(0);
    setPositionMode(false);
    setPositionBlueProgress(0);
    setPositionPointOpacity(0);
    setPositionCallout(null);
    setPositionCalloutOpacity(0);
    setOrientationMode(false);
    setOrientationProgress(0);
    setShowOrientationArrows(false);
    setPropertyShowBlue(true);
    setPropertyShowPurple(true);
  }, []);

  const resetIntro = useCallback(() => {
    setShowPropertyPanel(false);
    setTopTextHtml("");
    setBottomTextHtml(APP_DATA.steps[1].bottomTextInitial);
    setTopTextVisible(false);
    setBottomTextVisible(true);
    setIntroRotationProgress(0);
    setShowPurpleArrow(false);
    setPurpleArrowDrawProgress(0);
    setIntroComplete(false);
    setIsAnimating(false);
  }, []);

  const resetStep2 = useCallback(() => {
    setActiveProperty(null);
    setExploredProperties([]);
    resetPropertyVisuals();
  }, [resetPropertyVisuals]);

  const resetEverything = useCallback(() => {
    cancelAnimations();
    resetIntro();
    resetStep2();
    setCurrentStep(0);
  }, [cancelAnimations, resetIntro, resetStep2]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    resetIntro();
    resetStep2();
    setCurrentStep(1);
    setBottomTextHtml(APP_DATA.steps[1].bottomTextInitial);
    setBottomTextVisible(true);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const runIntroAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    hideTexts();

    const cleanups = [];
    cleanups.push(
      animateValue(
        0,
        1,
        ROTATION_DURATION,
        setIntroRotationProgress,
        () => {
          setShowPurpleArrow(true);
          setPurpleArrowDrawProgress(0);
          cleanups.push(
            animateValue(
              0,
              1,
              PURPLE_ARROW_GROW_DURATION,
              setPurpleArrowDrawProgress,
              () => {
                setTopTextHtml(APP_DATA.steps[1].topTextAfterRotation);
                setTopTextVisible(true);
                setShowPropertyPanel(true);
                setBottomTextHtml(APP_DATA.steps[1].bottomTextAfterRotation);
                setBottomTextVisible(true);
                setIntroComplete(true);
                setIsAnimating(false);
                setCurrentStep(2);
              },
              easeInOutCubic,
            ),
          );
        },
        easeInOutCubic,
      ),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, hideTexts]);

  const handleOrangeClick = useCallback(() => {
    if (currentStep !== 1 || isAnimating || introComplete) return;
    if (typeof playSound === "function") playSound("click");
    runIntroAnimation();
  }, [currentStep, isAnimating, introComplete, runIntroAnimation]);

  const loadIdleView = useCallback(() => {
    resetPropertyVisuals();
    setPropertyShowBlue(true);
    setPropertyShowPurple(true);
    setShowPurpleArrow(true);
    setPurpleArrowDrawProgress(1);
  }, [resetPropertyVisuals]);

  const runSizeAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    hideTexts();
    loadIdleView();
    setShowSizeStroke(false);
    setSizeOverlapProgress(0);

    const cleanups = [];
    cleanups.push(
      delay(PROPERTY_ANIM_DELAY, () => {
        cleanups.push(
          animateValue(
            0,
            1,
            SIZE_OVERLAP_DURATION,
            setSizeOverlapProgress,
            () => {
              setShowSizeStroke(true);
              showTexts(
                APP_DATA.steps[2].feedbackSize,
                APP_DATA.steps[2].bottomText,
              );
              setIsAnimating(false);
            },
            easeInOutCubic,
          ),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, hideTexts, loadIdleView, showTexts]);

  const runShapeAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    hideTexts();
    loadIdleView();
    setShapeOnOrange(true);
    setShapeGroupAngle(0);

    const cleanups = [];
    cleanups.push(
      delay(PROPERTY_ANIM_DELAY, () => {
        cleanups.push(
          animateValue(
            0,
            90,
            SHAPE_ROTATE_DURATION,
            setShapeGroupAngle,
            () => {
              showTexts(
                APP_DATA.steps[2].feedbackShape,
                APP_DATA.steps[2].bottomText,
              );
              setIsAnimating(false);
            },
            easeInOutCubic,
          ),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, hideTexts, loadIdleView, showTexts]);

  const runPositionAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    hideTexts();
    resetPropertyVisuals();
    setPropertyShowBlue(false);
    setPropertyShowPurple(false);
    setShowPurpleArrow(false);
    setPositionMode(true);
    setPositionBlueProgress(0);
    setPositionPointOpacity(0);
    setPositionCallout(null);
    setPositionCalloutOpacity(0);

    const cleanups = [];
    cleanups.push(
      delay(PROPERTY_ANIM_DELAY, () => {
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
                  setPropertyShowBlue(true);
                  cleanups.push(
                    animateValue(
                      0,
                      1,
                      POSITION_MOVE_DURATION,
                      setPositionBlueProgress,
                      () => {
                        setPositionCallout("final");
                        setPositionCalloutOpacity(0);
                        setShowPurpleArrow(true);
                        setPropertyShowPurple(true);
                        setPurpleArrowDrawProgress(0);
                        cleanups.push(
                          animateValue(
                            0,
                            1,
                            PURPLE_ARROW_GROW_DURATION,
                            setPurpleArrowDrawProgress,
                            () => {
                              cleanups.push(
                                animateValue(
                                  0,
                                  1,
                                  POSITION_MARKER_FADE_DURATION,
                                  setPositionCalloutOpacity,
                                  () => {
                                    showTexts(
                                      APP_DATA.steps[2].feedbackPosition,
                                      APP_DATA.steps[2].bottomText,
                                    );
                                    setIsAnimating(false);
                                  },
                                ),
                              );
                            },
                            easeInOutCubic,
                          ),
                        );
                      },
                      easeInOutCubic,
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
  }, [cancelAnimations, hideTexts, resetPropertyVisuals, showTexts]);

  const runOrientationAnimation = useCallback(() => {
    cancelAnimations();
    setIsAnimating(true);
    hideTexts();
    resetPropertyVisuals();
    setPropertyShowBlue(false);
    setPropertyShowPurple(false);
    setShowPurpleArrow(false);
    setOrientationMode(true);
    setOrientationProgress(0);
    setShowOrientationArrows(true);

    const cleanups = [];
    cleanups.push(
      delay(PROPERTY_ANIM_DELAY, () => {
        setPropertyShowBlue(true);
        cleanups.push(
          animateValue(
            0,
            1,
            ORIENTATION_ROTATE_DURATION,
            setOrientationProgress,
            () => {
              setShowPurpleArrow(true);
              setPropertyShowPurple(true);
              setPurpleArrowDrawProgress(0);
              cleanups.push(
                animateValue(
                  0,
                  1,
                  PURPLE_ARROW_GROW_DURATION,
                  setPurpleArrowDrawProgress,
                  () => {
                    showTexts(
                      APP_DATA.steps[2].feedbackOrientation,
                      APP_DATA.steps[2].bottomText,
                    );
                    setIsAnimating(false);
                  },
                  easeInOutCubic,
                ),
              );
            },
            easeInOutCubic,
          ),
        );
      }),
    );

    cancelRef.current = () => cleanups.forEach((fn) => fn());
  }, [cancelAnimations, hideTexts, resetPropertyVisuals, showTexts]);

  const handleSelectProperty = useCallback(
    (propId) => {
      if (isAnimating || currentStep < 2) return;
      if (typeof playSound === "function") playSound("click");
      setActiveProperty(propId);
      setExploredProperties((prev) =>
        prev.includes(propId) ? prev : [...prev, propId],
      );

      if (propId === "size") runSizeAnimation();
      else if (propId === "shape") runShapeAnimation();
      else if (propId === "position") runPositionAnimation();
      else if (propId === "orientation") runOrientationAnimation();
    },
    [
      isAnimating,
      currentStep,
      runSizeAnimation,
      runShapeAnimation,
      runPositionAnimation,
      runOrientationAnimation,
    ],
  );

  const handleSummarize = () => {
    if (typeof playSound === "function") playSound("click");
    cancelAnimations();
    setCurrentStep(3);
  };

  const allPropertiesExplored =
    exploredProperties.length >= PROPERTY_IDS.length;
  const showSummarize = allPropertiesExplored && !isAnimating && currentStep === 2;
  const buttonsDisabled = isAnimating || currentStep < 2;

  const introBlueAngle = introRotationProgress * 90;
  const introBlueOpacity = introRotationProgress > 0 ? 1 : 0;

  const isPropertyActive = currentStep === 2 && activeProperty !== null;

  const graphProps = useMemo(() => {
    if (currentStep === 1 && !introComplete) {
      return {
        orangeAngle: 0,
        blueAngle: introBlueAngle,
        blueOpacity: introBlueOpacity,
        showOrange: true,
        showBlue: introRotationProgress > 0,
        showPurpleArrow: showPurpleArrow,
        purpleArrowDrawProgress: purpleArrowDrawProgress,
        orangeClickable: !isAnimating && !introComplete,
        onOrangeClick: handleOrangeClick,
      };
    }

    if (isPropertyActive) {
      return {
        orangeAngle: 0,
        blueAngle: 90,
        blueOpacity: propertyShowBlue ? 1 : 0,
        showOrange: true,
        showBlue: propertyShowBlue,
        showPurpleArrow: propertyShowPurple && showPurpleArrow,
        purpleArrowDrawProgress: propertyShowPurple ? purpleArrowDrawProgress : 0,
        sizeOverlapProgress: sizeOverlapProgress,
        showSizeStroke: showSizeStroke,
        shapeOnOrange: shapeOnOrange,
        shapeGroupAngle: shapeGroupAngle,
        positionMode: positionMode,
        positionBlueProgress: positionBlueProgress,
        positionPointOpacity: positionPointOpacity,
        positionCallout: positionCallout,
        positionCalloutOpacity: positionCalloutOpacity,
        orientationMode: orientationMode,
        orientationProgress: orientationProgress,
        showOrientationArrows: showOrientationArrows,
      };
    }

    return {
      orangeAngle: 0,
      blueAngle: 90,
      blueOpacity: 1,
      showOrange: true,
      showBlue: true,
      showPurpleArrow: true,
      purpleArrowDrawProgress: 1,
    };
  }, [
    currentStep,
    introComplete,
    introRotationProgress,
    introBlueAngle,
    introBlueOpacity,
    showPurpleArrow,
    purpleArrowDrawProgress,
    isAnimating,
    handleOrangeClick,
    isPropertyActive,
    propertyShowBlue,
    propertyShowPurple,
    sizeOverlapProgress,
    showSizeStroke,
    shapeOnOrange,
    shapeGroupAngle,
    positionMode,
    positionBlueProgress,
    positionPointOpacity,
    positionCallout,
    positionCalloutOpacity,
    orientationMode,
    orientationProgress,
    showOrientationArrows,
  ]);

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
      } else if (currentStep === 1 && !isAnimating && !introComplete) {
        const svg = document.querySelector(".rotation-svg");
        const rect = getSvgPointClientRect(svg, ANCHOR.x - TRI_W / 2, ANCHOR.y - TRI_H / 2, 56);
        if (rect) positions.push(rect);
      } else if (currentStep === 2 && !isAnimating) {
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
    isAnimating,
    introComplete,
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

  const canvasTopText =
    currentStep === 1 && !introComplete
      ? APP_DATA.steps[1].topTextInitial
      : currentStep >= 2 && !isPropertyActive
        ? APP_DATA.steps[1].topTextAfterRotation
        : topTextHtml;

  const canvasBottomText =
    currentStep === 1 && !introComplete
      ? APP_DATA.steps[1].bottomTextInitial
      : currentStep >= 2 && !isPropertyActive
        ? APP_DATA.steps[1].bottomTextAfterRotation
        : bottomTextHtml;

  const canvasTopVisible =
    currentStep === 1
      ? introComplete || topTextVisible
      : isPropertyActive
        ? topTextVisible
        : true;

  const canvasBottomVisible =
    currentStep === 1
      ? !isAnimating && (introComplete || bottomTextVisible)
      : isPropertyActive
        ? bottomTextVisible
        : !isAnimating;

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(RotationCanvas, {
        showPropertyPanel: showPropertyPanel,
        activeProperty: activeProperty,
        exploredProperties: exploredProperties,
        buttonsDisabled: buttonsDisabled,
        showSummarize: showSummarize,
        onSelectProperty: handleSelectProperty,
        onSummarize: handleSummarize,
        topTextHtml: canvasTopText,
        bottomTextHtml: canvasBottomText,
        topTextVisible: canvasTopVisible,
        bottomTextVisible: canvasBottomVisible,
        graphProps: graphProps,
      }),
    ),
    renderNudges(),
  );
};
