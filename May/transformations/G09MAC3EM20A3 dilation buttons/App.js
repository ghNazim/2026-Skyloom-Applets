const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [activeProperty, setActiveProperty] = useState(null);
  const [exploredProperties, setExploredProperties] = useState([]);
  const [completedProperties, setCompletedProperties] = useState([]);
  const [hasClickedAnyButton, setHasClickedAnyButton] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);
  const [dilationK, setDilationK] = useState(1);
  const [showDilated, setShowDilated] = useState(false);
  const [showRays, setShowRays] = useState(false);
  const [rayProgress, setRayProgress] = useState(0);
  const [showNegativeRays, setShowNegativeRays] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderEnabled, setSliderEnabled] = useState(false);
  const [kMin, setKMin] = useState(0.1);
  const [kMax, setKMax] = useState(1.8);
  const [feedbackHtml, setFeedbackHtml] = useState("");
  const [dimmed, setDimmed] = useState(false);
  const [labelsJitter, setLabelsJitter] = useState(false);
  const [strokeHighlight, setStrokeHighlight] = useState(null);
  const [blinkHighlight, setBlinkHighlight] = useState(null);
  const [orientationClone, setOrientationClone] = useState(null);

  const [shapePhase, setShapePhase] = useState("idle");
  const [showSquare, setShowSquare] = useState(false);
  const [showTrapezium, setShowTrapezium] = useState(false);
  const [squareDilated, setSquareDilated] = useState(false);
  const [trapeziumDilated, setTrapeziumDilated] = useState(false);
  const [squareK, setSquareK] = useState(1);
  const [trapeziumK, setTrapeziumK] = useState(1);
  const [activeShapeRays, setActiveShapeRays] = useState(null);

  const [orientationPhase, setOrientationPhase] = useState("idle");
  const [nudgePositions, setNudgePositions] = useState([]);

  const cancelRef = useRef(null);
  const activePropertyRef = useRef(activeProperty);
  activePropertyRef.current = activeProperty;

  const resetVisualState = useCallback(() => {
    setDilationK(1);
    setShowDilated(false);
    setShowRays(false);
    setRayProgress(0);
    setShowNegativeRays(false);
    setShowSlider(false);
    setSliderEnabled(false);
    setFeedbackHtml("");
    setDimmed(false);
    setLabelsJitter(false);
    setStrokeHighlight(null);
    setBlinkHighlight(null);
    setOrientationClone(null);
    setShapePhase("idle");
    setShowSquare(false);
    setShowTrapezium(false);
    setSquareDilated(false);
    setTrapeziumDilated(false);
    setSquareK(1);
    setTrapeziumK(1);
    setActiveShapeRays(null);
    setOrientationPhase("idle");
  }, []);

  const cancelAnimations = useCallback(() => {
    if (typeof cancelRef.current === "function") {
      cancelRef.current();
      cancelRef.current = null;
    }
  }, []);

  const resetEverything = useCallback(() => {
    cancelAnimations();
    setCurrentStep(0);
    setActiveProperty(null);
    setExploredProperties([]);
    setCompletedProperties([]);
    setHasClickedAnyButton(false);
    setIsAnimating(false);
    resetVisualState();
  }, [cancelAnimations, resetVisualState]);

  const markPropertyComplete = useCallback((propId) => {
    setCompletedProperties((prev) =>
      prev.includes(propId) ? prev : [...prev, propId],
    );
  }, []);

  const runIntroDilation = useCallback(
    (onComplete, targetK) => {
      const endK = targetK !== undefined ? targetK : INTRO_TARGET_K;
      cancelAnimations();
      setIsAnimating(true);
      setShowRays(true);
      setRayProgress(0);
      setShowDilated(false);
      setDilationK(1);
      setSliderEnabled(false);

      const cleanups = [];
      cleanups.push(delay(INTRO_DELAY, () => {
        cleanups.push(
          animateValue(0, 1, RAY_GROW_DURATION, setRayProgress, () => {
            setShowDilated(true);
            playDilationSweep(DILATION_ANIM_DURATION);
            cleanups.push(
              animateValue(1, endK, DILATION_ANIM_DURATION, (v) => {
                setDilationK(v);
              }, () => {
                setDilationK(endK);
                setIsAnimating(false);
                if (typeof onComplete === "function") onComplete();
              }),
            );
          }),
        );
      }));

      cancelRef.current = () => {
        cleanups.forEach((fn) => fn());
      };
    },
    [cancelAnimations],
  );

  const runShapeBlink = useCallback(
    (polyId, onComplete) => {
      setIsAnimating(true);
      setStrokeHighlight(null);
      setBlinkHighlight(null);

      runStrokeBlinkSequence((mode, on) => {
        setBlinkHighlight({ mode: mode, on: on, polyId: polyId });
      }, () => {
        setBlinkHighlight(null);
        setIsAnimating(false);
        if (typeof onComplete === "function") onComplete();
      });
    },
    [],
  );

  const runOrientationRotate = useCallback(
    (targetK, onComplete) => {
      cancelAnimations();
      setIsAnimating(true);
      setDimmed(true);
      setOrientationClone({
        active: true,
        progress: 0,
        targetK: targetK,
        polygon: {
          id: "triangle",
          points: INITIAL_TRIANGLE,
        },
      });

      const cleanups = [];
      cleanups.push(
        animateValue(
          0,
          1,
          ORIENTATION_ROTATE_DURATION,
          (p) => {
            setOrientationClone({
              active: true,
              progress: p,
              targetK: targetK,
              polygon: { id: "triangle", points: INITIAL_TRIANGLE },
            });
          },
          () => {
            setOrientationClone(null);
            setDimmed(false);
            setIsAnimating(false);
            if (typeof onComplete === "function") onComplete();
          },
          linearEase,
        ),
      );

      cancelRef.current = () => cleanups.forEach((fn) => fn());
    },
    [cancelAnimations],
  );

  const startSizeFlow = useCallback(() => {
    resetVisualState();
    const slider = PROPERTY_SLIDER.size;
    setKMin(slider.min);
    setKMax(slider.max);
    setShowSlider(true);
    setDilationK(slider.default);

    runIntroDilation(() => {
      setFeedbackHtml(
        renderFeedbackHtml(handleComma(APP_DATA.feedback.size)),
      );
      setSliderEnabled(true);
      markPropertyComplete("size");
    });
  }, [resetVisualState, runIntroDilation, markPropertyComplete]);

  const startPositionFlow = useCallback(() => {
    resetVisualState();
    const slider = PROPERTY_SLIDER.position;
    setKMin(slider.min);
    setKMax(slider.max);
    setShowSlider(true);
    setDilationK(slider.default);

    runIntroDilation(() => {
      setIsAnimating(true);
      setLabelsJitter(true);
      setTimeout(() => {
        setLabelsJitter(false);
        setIsAnimating(false);
        setFeedbackHtml(
          renderFeedbackHtml(handleComma(APP_DATA.feedback.position)),
        );
        setSliderEnabled(true);
        markPropertyComplete("position");
      }, 1200);
    });
  }, [resetVisualState, runIntroDilation, markPropertyComplete]);

  const startOrientationFlow = useCallback(() => {
    resetVisualState();
    const slider = PROPERTY_SLIDER.orientation;
    setKMin(slider.min);
    setKMax(slider.max);
    setShowSlider(true);
    setDilationK(slider.default);
    setOrientationPhase("intro");

    runIntroDilation(() => {
      setOrientationPhase("interactive");
      setFeedbackHtml(
        renderFeedbackHtml(handleComma(APP_DATA.feedback.orientationInitial)),
      );
      setSliderEnabled(true);
    });
  }, [resetVisualState, runIntroDilation]);

  const startShapeFlow = useCallback(() => {
    resetVisualState();
    setShapePhase("triangle");

    runIntroDilation(() => {
      runShapeBlink("triangle", () => {
        setFeedbackHtml(
          renderFeedbackHtml(handleComma(APP_DATA.feedback.shape)),
        );
        setShowSquare(true);
        setShapePhase("square");
      });
    }, SHAPE_INTRO_TARGET_K);
  }, [resetVisualState, runIntroDilation, runShapeBlink]);

  const runShapePolygonAnim = useCallback(
    (shapeId, targetK, points, onComplete) => {
      cancelAnimations();
      setIsAnimating(true);
      setActiveShapeRays(shapeId);
      setShowRays(true);
      setRayProgress(0);
      setFeedbackHtml("");

      const setShapeK = shapeId === "square" ? setSquareK : setTrapeziumK;
      const setShapeDil =
        shapeId === "square" ? setSquareDilated : setTrapeziumDilated;

      setShapeK(1);
      setShapeDil(false);

      const cleanups = [];
      cleanups.push(
        animateValue(0, 1, RAY_GROW_DURATION, setRayProgress, () => {
          setShapeDil(true);
          playDilationSweep(DILATION_ANIM_DURATION);
          cleanups.push(
            animateValue(1, targetK, DILATION_ANIM_DURATION, setShapeK, () => {
              setShapeK(targetK);
              runShapeBlink(shapeId, () => {
                setActiveShapeRays(null);
                setIsAnimating(false);
                setFeedbackHtml(
                  renderFeedbackHtml(handleComma(APP_DATA.feedback.shape)),
                );
                if (typeof onComplete === "function") onComplete();
              });
            }),
          );
        }),
      );

      cancelRef.current = () => cleanups.forEach((fn) => fn());
    },
    [cancelAnimations, runShapeBlink],
  );

  const handleSelectProperty = useCallback(
    (propId) => {
      if (typeof playSound === "function") playSound("click");
      setHasClickedAnyButton(true);
      setExploredProperties((prev) =>
        prev.includes(propId) ? prev : [...prev, propId],
      );
      setActiveProperty(propId);
      cancelAnimations();

      if (propId === "size") startSizeFlow();
      else if (propId === "orientation") startOrientationFlow();
      else if (propId === "position") startPositionFlow();
      else if (propId === "shape") startShapeFlow();
    },
    [
      cancelAnimations,
      startSizeFlow,
      startOrientationFlow,
      startPositionFlow,
      startShapeFlow,
    ],
  );

  const handleSquareClick = useCallback(() => {
    if (shapePhase !== "square" || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    runShapePolygonAnim("square", SHAPE_INTRO_TARGET_K, SQUARE_KLMN, () => {
      setShowTrapezium(true);
      setShapePhase("trapezium");
    });
  }, [shapePhase, isAnimating, runShapePolygonAnim]);

  const handleTrapeziumClick = useCallback(() => {
    if (shapePhase !== "trapezium" || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    runShapePolygonAnim("trapezium", 0.5, TRAPEZIUM_PQRS, () => {
      setShapePhase("done");
      markPropertyComplete("shape");
    });
  }, [shapePhase, isAnimating, runShapePolygonAnim, markPropertyComplete]);

  const handleKChange = useCallback(
    (val) => {
      setDilationK(val);
      if (Math.abs(val - 1) > 0.02) setShowDilated(true);

      if (activePropertyRef.current === "orientation") {
        if (val < 0) setShowNegativeRays(true);
        else setShowNegativeRays(false);
      }
    },
    [],
  );

  const handleKDragStart = useCallback(() => {
    setShowDilated(true);
  }, []);

  const handleKRelease = useCallback(
    (val) => {
      setDilationK(val);

      if (activePropertyRef.current !== "orientation") return;
      if (orientationPhase !== "interactive") return;

      setFeedbackHtml("");

      if (val < 0) {
        if (typeof playSound === "function") playSound("correct");
        setSliderEnabled(false);
        setOrientationPhase("rotate");
        runOrientationRotate(val, () => {
          setOrientationPhase("done");
          setFeedbackHtml(
            renderFeedbackHtml(
              handleComma(APP_DATA.feedback.orientationFinal),
            ),
          );
          setSliderEnabled(true);
          markPropertyComplete("orientation");
        });
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setFeedbackHtml(
          renderFeedbackHtml(
            handleComma(APP_DATA.feedback.orientationInitial),
          ),
        );
      }
    },
    [orientationPhase, runOrientationRotate, markPropertyComplete],
  );

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    resetVisualState();
    setActiveProperty(null);
    setExploredProperties([]);
    setCompletedProperties([]);
    setHasClickedAnyButton(false);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const allPropertiesComplete =
    completedProperties.length >= PROPERTY_IDS.length &&
    exploredProperties.length >= PROPERTY_IDS.length;

  const buttonsDisabled = useMemo(() => {
    if (isAnimating || labelsJitter) return true;
    if (
      activeProperty === "orientation" &&
      orientationPhase !== "done" &&
      orientationPhase !== "idle"
    ) {
      return true;
    }
    if (
      activeProperty === "shape" &&
      shapePhase !== "done" &&
      shapePhase !== "idle"
    ) {
      return true;
    }
    return false;
  }, [
    isAnimating,
    labelsJitter,
    activeProperty,
    orientationPhase,
    shapePhase,
  ]);

  const navText = useMemo(() => {
    if (currentStep !== 1) return "";
    if (isAnimating) return "";

    if (allPropertiesComplete) {
      return handleComma(APP_DATA.steps[1].navTextSummarise);
    }

    if (activeProperty === "orientation" && orientationPhase === "interactive") {
      return handleComma(APP_DATA.steps[1].navTextDragNegative);
    }

    if (activeProperty === "shape" && (shapePhase === "square" || shapePhase === "trapezium")) {
      return handleComma(APP_DATA.steps[1].navTextTapPolygon);
    }

    return handleComma(APP_DATA.steps[1].navText);
  }, [
    currentStep,
    isAnimating,
    allPropertiesComplete,
    activeProperty,
    orientationPhase,
    shapePhase,
  ]);

  const isNextDisabled = currentStep !== 1 || !allPropertiesComplete;
  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;
    setNudgePositions([]);
    setCurrentStep(2);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      resetEverything();
    }
  };

  const polygons = useMemo(() => {
    const list = [];

    const triangleVisible =
      !activeProperty ||
      activeProperty === "size" ||
      activeProperty === "orientation" ||
      activeProperty === "position" ||
      activeProperty === "shape";

    if (triangleVisible) {
      list.push({
        id: "triangle",
        points: INITIAL_TRIANGLE,
        labels: INITIAL_TRIANGLE_LABELS,
        primeLabels: INITIAL_TRIANGLE_PRIME_LABELS,
        visible: true,
        showDilated: showDilated,
        dilationK: dilationK,
      });
    }

    if (activeProperty === "shape" && showSquare) {
      list.push({
        id: "square",
        points: SQUARE_KLMN,
        labels: SQUARE_LABELS,
        primeLabels: SQUARE_PRIME_LABELS,
        visible: true,
        showDilated: squareDilated,
        dilationK: squareK,
        clickable: shapePhase === "square" && !isAnimating,
        onClick: handleSquareClick,
      });
    }

    if (activeProperty === "shape" && showTrapezium) {
      list.push({
        id: "trapezium",
        points: TRAPEZIUM_PQRS,
        labels: TRAPEZIUM_LABELS,
        primeLabels: TRAPEZIUM_PRIME_LABELS,
        visible: true,
        showDilated: trapeziumDilated,
        dilationK: trapeziumK,
        clickable: shapePhase === "trapezium" && !isAnimating,
        onClick: handleTrapeziumClick,
      });
    }

    return list;
  }, [
    activeProperty,
    showDilated,
    dilationK,
    showSquare,
    showTrapezium,
    squareDilated,
    trapeziumDilated,
    squareK,
    trapeziumK,
    shapePhase,
    isAnimating,
    handleSquareClick,
    handleTrapeziumClick,
  ]);

  const raysPolygons = useMemo(() => {
    if (activeShapeRays) {
      return polygons.filter((p) => p.id === activeShapeRays);
    }
    if (showRays) {
      if (activeProperty === "shape") {
        const dilated = polygons.filter((p) => p.showDilated);
        if (dilated.length > 0 && rayProgress >= 1) {
          return dilated;
        }
        const targetId = activeShapeRays || "triangle";
        const target = polygons.find((p) => p.id === targetId);
        return target ? [target] : polygons.length ? [polygons[0]] : [];
      }
      if (polygons.length) return [polygons[0]];
    }
    return [];
  }, [polygons, showRays, activeShapeRays, activeProperty, rayProgress]);

  const graphProps = {
    center: DILATION_ORIGIN,
    polygons: polygons,
    rayPolygons: raysPolygons,
    dilationK: dilationK,
    showRays: showRays,
    rayProgress: rayProgress,
    showNegativeRays: showNegativeRays,
    showSlider: showSlider,
    sliderEnabled: sliderEnabled && !isAnimating,
    kMin: kMin,
    kMax: kMax,
    onKChange: handleKChange,
    onKDragStart: handleKDragStart,
    onKRelease: handleKRelease,
    dimmed: dimmed,
    orientationClone: orientationClone,
    labelsJitter: labelsJitter,
    strokeHighlight: strokeHighlight,
    blinkHighlight: blinkHighlight,
    feedbackHtml: feedbackHtml,
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
      } else if (currentStep === 2) {
        addNudgeFor("start-over-button");
      } else if (currentStep === 1) {
        if (!hasClickedAnyButton) {
          const firstUnexplored = PROPERTY_IDS.find(
            (id) => !exploredProperties.includes(id),
          );
          if (firstUnexplored) {
            addNudgeFor("property-btn-" + firstUnexplored);
          }
        } else if (shapePhase === "square" && !isAnimating) {
          const svg = document.querySelector(".dilation-coordinate-svg");
          const squareCentroid = polygonCentroid(SQUARE_KLMN);
          const nudgeRect = getGraphPointClientRect(
            svg,
            squareCentroid.x,
            squareCentroid.y,
          );
          if (nudgeRect) positions.push(nudgeRect);
        } else if (shapePhase === "trapezium" && !isAnimating) {
          const svg = document.querySelector(".dilation-coordinate-svg");
          const trapCentroid = polygonCentroid(TRAPEZIUM_PQRS);
          const nudgeRect = getGraphPointClientRect(
            svg,
            trapCentroid.x,
            trapCentroid.y,
          );
          if (nudgeRect) positions.push(nudgeRect);
        } else if (!isNextDisabled) {
          addNudgeFor("next-button");
        }
      }

      setNudgePositions(positions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [
    currentStep,
    hasClickedAnyButton,
    exploredProperties,
    shapePhase,
    isAnimating,
    isNextDisabled,
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
    React.createElement(QuestionPanel, {
      text: APP_DATA.steps[1].questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        activeProperty: activeProperty,
        exploredProperties: exploredProperties,
        buttonsDisabled: buttonsDisabled,
        onSelectProperty: handleSelectProperty,
        graphProps: graphProps,
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
