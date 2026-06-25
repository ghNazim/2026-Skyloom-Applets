const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [sliderK, setSliderK] = useState(INTRO_SLIDER.default);
  const [visualK, setVisualK] = useState(INTRO_SLIDER.default);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sliderLocked, setSliderLocked] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [mcqVisible, setMcqVisible] = useState(false);
  const [mcqKey, setMcqKey] = useState(null);
  const [mcqWrongIndices, setMcqWrongIndices] = useState([]);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [step3Reduced, setStep3Reduced] = useState(false);
  const [step1Enlarged, setStep1Enlarged] = useState(false);
  const [sliderDragStarted, setSliderDragStarted] = useState(false);
  const [step7Answered, setStep7Answered] = useState(false);
  const [pointStates, setPointStates] = useState({});
  const [pointFeedback, setPointFeedback] = useState(null);
  const [step8Answered, setStep8Answered] = useState(false);
  const [nudgePositions, setNudgePositions] = useState([]);

  const cancelAnimRef = useRef(null);
  const pulseTweenRef = useRef(null);
  const stepRef = useRef(currentStep);
  const visualKRef = useRef(visualK);
  const mcqVisibleRef = useRef(mcqVisible);
  const mcqAnsweredRef = useRef(mcqAnswered);
  stepRef.current = currentStep;
  visualKRef.current = visualK;
  mcqVisibleRef.current = mcqVisible;
  mcqAnsweredRef.current = mcqAnswered;

  const cancelAnimation = useCallback(() => {
    if (typeof cancelAnimRef.current === "function") {
      cancelAnimRef.current();
      cancelAnimRef.current = null;
    }
  }, []);

  const cancelPulse = useCallback(() => {
    if (pulseTweenRef.current) {
      pulseTweenRef.current.kill();
      pulseTweenRef.current = null;
    }
  }, []);

  const runDilationAnim = useCallback(
    (fromK, toK, onComplete) => {
      cancelAnimation();
      setIsAnimating(true);
      playDilationSweep(DILATION_ANIM_DURATION);
      cancelAnimRef.current = animateKWithGsap(
        fromK,
        toK,
        DILATION_ANIM_DURATION,
        (k) => {
          setVisualK(k);
          setShowGhost(Math.abs(k - 1) > 0.02);
        },
        () => {
          setVisualK(toK);
          setShowGhost(Math.abs(toK - 1) > 0.02);
          setIsAnimating(false);
          cancelAnimRef.current = null;
          if (typeof onComplete === "function") onComplete(toK);
        },
      );
    },
    [cancelAnimation],
  );

  const snapVisualK = useCallback((k) => {
    cancelAnimation();
    setVisualK(k);
    visualKRef.current = k;
    setShowGhost(Math.abs(k - 1) > 0.02);
    setIsAnimating(false);
  }, [cancelAnimation]);

  const handleSliderReleaseComplete = useCallback((finalK) => {
    const step = stepRef.current;
    const cfg =
      step >= 1 && step <= 3
        ? INTRO_SLIDER
        : step >= 5 && step <= 8
          ? SCALE_SLIDER
          : { min: 1, max: 1, center: 1 };

    if (step === 1 && Math.abs(finalK - cfg.max) < 0.02) {
      setTimeout(() => setCurrentStep(2), 300);
    } else if (step === 2 && Math.abs(finalK - cfg.center) < 0.02) {
      setTimeout(() => setCurrentStep(3), 300);
    } else if (step === 3 && finalK < 0.98) {
      if (Math.abs(finalK - cfg.min) < 0.02) {
        setStep3Done(true);
      }
    } else if (
      step === 5 &&
      finalK > 1 &&
      !mcqVisibleRef.current &&
      !mcqAnsweredRef.current
    ) {
      setMcqKey("gt1");
      setMcqVisible(true);
      mcqVisibleRef.current = true;
      setSliderLocked(true);
    } else if (
      step === 6 &&
      Math.abs(finalK - cfg.center) < 0.02 &&
      !mcqVisibleRef.current &&
      !mcqAnsweredRef.current
    ) {
      setMcqKey("eq1");
      setMcqVisible(true);
      mcqVisibleRef.current = true;
      setSliderLocked(true);
    } else if (
      step === 7 &&
      finalK < 0.98 &&
      !mcqVisibleRef.current &&
      !mcqAnsweredRef.current
    ) {
      setMcqKey("lt1");
      setMcqVisible(true);
      mcqVisibleRef.current = true;
      setSliderLocked(true);
    }
  }, []);

  const resetMcq = useCallback(() => {
    setMcqVisible(false);
    mcqVisibleRef.current = false;
    setMcqKey(null);
    setMcqWrongIndices([]);
    setMcqAnswered(false);
    mcqAnsweredRef.current = false;
    setSliderLocked(false);
  }, []);

  const resetEverything = useCallback(() => {
    cancelAnimation();
    cancelPulse();
    setCurrentStep(0);
    setSliderK(INTRO_SLIDER.default);
    setVisualK(INTRO_SLIDER.default);
    setIsAnimating(false);
    setSliderLocked(false);
    setShowGhost(false);
    resetMcq();
    setStep3Done(false);
    setStep3Reduced(false);
    setStep1Enlarged(false);
    setSliderDragStarted(false);
    setStep7Answered(false);
    setPointStates({});
    setPointFeedback(null);
    setStep8Answered(false);
  }, [cancelAnimation, cancelPulse, resetMcq]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setSliderK(INTRO_SLIDER.default);
    setVisualK(INTRO_SLIDER.default);
    setShowGhost(false);
    resetMcq();
    setStep3Reduced(false);
    setStep1Enlarged(false);
    setSliderDragStarted(false);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const getSliderConfig = useCallback(() => {
    if (currentStep >= 1 && currentStep <= 3) {
      return {
        min: INTRO_SLIDER.min,
        max: INTRO_SLIDER.max,
        center: INTRO_SLIDER.center,
      };
    }
    if (currentStep >= 5 && currentStep <= 8) {
      return {
        min: SCALE_SLIDER.min,
        max: SCALE_SLIDER.max,
        center: SCALE_SLIDER.center,
      };
    }
    return { min: 1, max: 1, center: 1 };
  }, [currentStep]);

  const handleKChange = useCallback((val) => {
    setSliderK(val);
  }, []);

  const handleKDragStart = useCallback(() => {
    setSliderDragStarted(true);
  }, []);

  const handleKRelease = useCallback(
    (rawVal) => {
      const cfg = getSliderConfig();
      let val = rawVal;
      const step = stepRef.current;

      if (step === 1) {
        val = snapKNearEdge(val, cfg.min, cfg.max);
        if (Math.abs(val - cfg.max) <= SLIDER_EDGE_SNAP_THRESHOLD) val = cfg.max;
        if (val > 1) setStep1Enlarged(true);
      } else if (step === 2 || step === 6) {
        val = snapKToTarget(val, cfg.center);
      } else if (step === 3) {
        val = snapKNearEdge(val, cfg.min, cfg.max);
        if (Math.abs(val - cfg.min) <= SLIDER_EDGE_SNAP_THRESHOLD) val = cfg.min;
        if (val < 0.98) setStep3Reduced(true);
      }

      setSliderK(val);

      runDilationAnim(visualKRef.current, val, (finalK) => {
        const stepAtEnd = stepRef.current;
        const introCfg = INTRO_SLIDER;
        const atStep3Goal =
          stepAtEnd === 3 && Math.abs(finalK - introCfg.min) < 0.02;

        handleSliderReleaseComplete(finalK);

        if (!atStep3Goal) {
          setSliderDragStarted(false);
        }
      });
    },
    [getSliderConfig, runDilationAnim, handleSliderReleaseComplete],
  );

  const handleMcqSelect = useCallback(
    (index) => {
      const step = stepRef.current;
      const mcqData = mcqKey ? APP_DATA.mcq[mcqKey] : null;
      if (!mcqData) return;

      if (index === mcqData.correctIndex) {
        if (typeof playSound === "function") playSound("correct");
        setMcqAnswered(true);
        mcqAnsweredRef.current = true;
        setSliderLocked(false);
        cancelAnimation();

        if (step === 5) {
          setTimeout(() => {
            resetMcq();
            setCurrentStep(6);
          }, 500);
        } else if (step === 6) {
          setTimeout(() => {
            resetMcq();
            setCurrentStep(7);
          }, 500);
        } else if (step === 7) {
          setStep7Answered(true);
        }
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setMcqWrongIndices((prev) =>
          prev.includes(index) ? prev : [...prev, index],
        );

        const targetK = sliderK;
        if (step === 5 || step === 7) {
          snapVisualK(1);
          runDilationAnim(1, targetK, null);
        }
      }
    },
    [mcqKey, resetMcq, runDilationAnim, sliderK, snapVisualK, cancelAnimation],
  );

  const handlePointClick = useCallback(
    (pointId) => {
      if (stepRef.current !== 8 || step8Answered) return;

      if (pointId === "center") {
        if (typeof playSound === "function") playSound("correct");
        setPointStates({ center: "correct" });
        setPointFeedback({
          type: "correct",
          html: APP_DATA.feedback.pointCorrect,
        });
        setStep8Answered(true);
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setPointStates((prev) => ({ ...prev, [pointId]: "wrong" }));
        setPointFeedback({
          type: "wrong",
          html: APP_DATA.feedback.pointWrong,
        });
      }
    },
    [step8Answered],
  );

  useEffect(() => {
    if (currentStep === 4) {
      cancelPulse();
      cancelAnimation();
      setSliderK(INTRO_SLIDER.min);
      setShowGhost(true);
      const state = { k: INTRO_SLIDER.min };
      setVisualK(INTRO_SLIDER.min);
      const tl = gsap.timeline({ repeat: -1 });
      const seq = PULSE_K_SEQUENCE;
      for (let i = 0; i < seq.length - 1; i++) {
        tl.to(state, {
          k: seq[i + 1],
          duration: 1.4,
          ease: "power1.inOut",
          onUpdate: () => {
            setVisualK(state.k);
            setShowGhost(Math.abs(state.k - 1) > 0.02);
          },
        });
      }
      pulseTweenRef.current = tl;
      return () => cancelPulse();
    }
    cancelPulse();
    return undefined;
  }, [currentStep, cancelPulse, cancelAnimation]);

  useEffect(() => {
    setSliderDragStarted(false);
    cancelAnimation();
    if (currentStep === 5) {
      cancelPulse();
      setSliderK(SCALE_SLIDER.default);
      setVisualK(SCALE_SLIDER.default);
      visualKRef.current = SCALE_SLIDER.default;
      setShowGhost(false);
      resetMcq();
    }
    if (currentStep === 6) {
      resetMcq();
    }
    if (currentStep === 7) {
      resetMcq();
      setStep7Answered(false);
    }
    if (currentStep === 8) {
      resetMcq();
      setMcqVisible(false);
      setSliderK(STEP8_DEFAULT_K);
      setVisualK(STEP8_DEFAULT_K);
      visualKRef.current = STEP8_DEFAULT_K;
      setShowGhost(true);
      setPointStates({});
      setPointFeedback(null);
      setStep8Answered(false);
    }
  }, [currentStep, resetMcq, cancelPulse, cancelAnimation]);

  const sliderCfg = getSliderConfig();

  const questionText = useMemo(() => {
    if (currentStep === 1 && step1Enlarged) {
      return APP_DATA.steps[1].questionTextAfter;
    }
    if (currentStep === 3 && step3Reduced) {
      return APP_DATA.steps[3].questionTextAfter;
    }
    if (currentStep === 7 && step7Answered) {
      return APP_DATA.steps[7].questionTextAfter;
    }
    if (currentStep === 8 && step8Answered) {
      return APP_DATA.steps[8].questionTextAfter;
    }
    const s = APP_DATA.steps[currentStep];
    return s ? s.questionText : "";
  }, [currentStep, step1Enlarged, step3Reduced, step7Answered, step8Answered]);

  const navText = useMemo(() => {
    if (currentStep === 3) {
      return handleComma(
        step3Done
          ? APP_DATA.steps[3].navTextDone
          : APP_DATA.steps[3].navTextInitial,
      );
    }
    if (currentStep === 7 && step7Answered) {
      return handleComma(APP_DATA.steps[7].navTextAfter);
    }
    if (currentStep === 8) {
      return handleComma(
        step8Answered
          ? APP_DATA.steps[8].navTextAfter
          : APP_DATA.steps[8].navTextInitial,
      );
    }
    const s = APP_DATA.steps[currentStep];
    return s && s.navText ? handleComma(s.navText) : s && s.navTextInitial ? handleComma(s.navTextInitial) : "";
  }, [currentStep, step3Done, step7Answered, step8Answered]);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 1 || currentStep === 2) return true;
    if (currentStep === 3 && !step3Done) return true;
    if (currentStep === 5 || currentStep === 6) return true;
    if (currentStep === 7 && !step7Answered) return true;
    if (currentStep === 8 && !step8Answered) return true;
    return false;
  }, [currentStep, step3Done, step7Answered, step8Answered]);

  const isPrevDisabled = currentStep <= 1;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (isNextDisabled) return;
    setNudgePositions([]);
    if (currentStep === 7 || currentStep === 8) {
      resetMcq();
    }
    if (currentStep < 9) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      resetEverything();
      return;
    }
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const rightPanelVisible =
    currentStep >= 4 &&
    currentStep <= 7 &&
    (currentStep === 4 ||
      currentStep === 5 ||
      ((currentStep === 6 || currentStep === 7) && mcqVisible));

  const rightPanelText = useMemo(() => {
    if (currentStep === 4) return APP_DATA.steps[4].rightText;
    if (currentStep === 5 && !mcqVisible) return APP_DATA.steps[5].rightText;
    return "";
  }, [currentStep, mcqVisible]);

  const activeMcq = mcqKey ? APP_DATA.mcq[mcqKey] : null;

  const sliderMode = useMemo(() => {
    if (currentStep === 1 || currentStep === 2) return "positive";
    if (currentStep === 3) return "negative";
    return "both";
  }, [currentStep]);

  const SLIDER_NUDGE_STEPS = [1, 2, 3, 5, 6, 7];

  const showSliderDragNudge = useMemo(() => {
    if (!SLIDER_NUDGE_STEPS.includes(currentStep)) return false;
    if (currentStep === 3 && step3Done) return false;
    if (sliderDragStarted) return false;
    if (sliderLocked || isAnimating) return false;
    if (mcqVisible && currentStep >= 5) return false;
    return true;
  }, [
    currentStep,
    step3Done,
    sliderDragStarted,
    sliderLocked,
    isAnimating,
    mcqVisible,
  ]);

  const sliderDragNudgeRange = useMemo(() => {
    if (!showSliderDragNudge) return null;

    const cfg = currentStep <= 3 ? INTRO_SLIDER : SCALE_SLIDER;
    const fromPct = pctFromK(sliderK, cfg.min, cfg.max);

    let targetK;
    if (currentStep === 1) targetK = cfg.max;
    else if (currentStep === 2) targetK = cfg.center;
    else if (currentStep === 3) targetK = cfg.min;
    else if (currentStep === 5) targetK = cfg.max;
    else if (currentStep === 6) targetK = cfg.center;
    else if (currentStep === 7) targetK = cfg.min;
    else return null;

    const toPct = pctFromK(targetK, cfg.min, cfg.max);
    if (Math.abs(fromPct - toPct) < 0.3) return null;

    return { fromPct, toPct };
  }, [showSliderDragNudge, currentStep, sliderK]);

  useEffect(() => {
    const updateNudges = () => {
      const positions = [];
      const addNudgeFor = (id) => {
        const el = document.getElementById(id);
        if (el && !el.disabled) positions.push(el.getBoundingClientRect());
      };
      if (currentStep === 0) addNudgeFor("start-button");
      else if (currentStep === 9) addNudgeFor("start-over-button");
      else if (!isNextDisabled) addNudgeFor("next-button");
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

  if (currentStep === 9) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.finish.heading,
          text: renderRichHtml(APP_DATA.finish.text),
          buttonText: APP_DATA.finish.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
          isFinal: true,
          imageSrc: "assets/dilation.png",
          left: true,
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
        sliderK: sliderK,
        visualK: visualK,
        kMin: sliderCfg.min,
        kMax: sliderCfg.max,
        kCenter: sliderCfg.center,
        sliderMode: sliderMode,
        sliderLocked:
          sliderLocked ||
          isAnimating ||
          (currentStep === 3 && step3Done),
        sliderHidden: currentStep === 4,
        showThumbValue: currentStep >= 5,
        smallThumb: currentStep <= 3,
        showCenterMarker: currentStep >= 1 && currentStep <= 7,
        showGhostTriangle: showGhost,
        showZoomLabels: currentStep >= 1 && currentStep <= 3,
        zoomOutDimmed: currentStep === 1,
        zoomInDimmed: currentStep === 2 || currentStep === 3,
        scaleFactorLabel: currentStep >= 5,
        showClickPoints: currentStep === 8,
        pointStates: pointStates,
        rightPanelVisible: rightPanelVisible,
        rightPanelText: rightPanelText,
        mcq: mcqVisible ? activeMcq : null,
        mcqWrongIndices: mcqWrongIndices,
        mcqCorrectIndex: activeMcq ? activeMcq.correctIndex : -1,
        mcqAnswered: mcqAnswered,
        pointFeedback: pointFeedback,
        showDragNudge:
          showSliderDragNudge &&
          currentStep !== 4 &&
          sliderDragNudgeRange != null,
        dragNudgeFromPct: sliderDragNudgeRange
          ? sliderDragNudgeRange.fromPct
          : null,
        dragNudgeToPct: sliderDragNudgeRange
          ? sliderDragNudgeRange.toPct
          : null,
        onKChange: handleKChange,
        onKRelease: handleKRelease,
        onKDragStart: handleKDragStart,
        onMcqSelect: handleMcqSelect,
        onPointClick: handlePointClick,
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
