const App = () => {
  const { useState, useMemo, useEffect, useRef, useCallback } = React;

  const BASE_X = 3;
  const BASE_Y = 3;

  const [currentStep, setCurrentStep] = useState(0);
  const [step1Phase, setStep1Phase] = useState("initial");
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [step4Phase, setStep4Phase] = useState("initial");
  const [step5Phase, setStep5Phase] = useState("initial");
  const [exploreH, setExploreH] = useState(1);
  const [exploreV, setExploreV] = useState(1);
  const [step6UsedH, setStep6UsedH] = useState(false);
  const [step6UsedV, setStep6UsedV] = useState(false);
  const [step6Dragging, setStep6Dragging] = useState(false);
  const [step6LinePhase, setStep6LinePhase] = useState(null);
  const [step1Snapped, setStep1Snapped] = useState(0);
  const [step2Snapped, setStep2Snapped] = useState(0);
  const [step3Snapped, setStep3Snapped] = useState(0);
  const [step4Snapped, setStep4Snapped] = useState(0);

  const [hValue, setHValue] = useState(0);
  const [vValue, setVValue] = useState(0);
  const [snappedH, setSnappedH] = useState(0);
  const [snappedV, setSnappedV] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderLocked, setSliderLocked] = useState(false);
  const [showDynamicBox, setShowDynamicBox] = useState(false);
  const [dynamicCoordPhase, setDynamicCoordPhase] = useState("expression");
  const [symbolicMode, setSymbolicMode] = useState(false);
  const [highlightStaticX, setHighlightStaticX] = useState(false);
  const [highlightStaticY, setHighlightStaticY] = useState(false);

  const [nudgePositions, setNudgePositions] = useState([]);
  const animRef = useRef(null);

  const resetGraph = () => {
    setHValue(0);
    setVValue(0);
    setSnappedH(0);
    setSnappedV(0);
    setIsDragging(false);
    setSliderLocked(false);
    setShowDynamicBox(false);
    setDynamicCoordPhase("expression");
    setSymbolicMode(false);
    setHighlightStaticX(false);
    setHighlightStaticY(false);
  };

  const resetEverything = () => {
    setCurrentStep(0);
    setStep1Phase("initial");
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4Phase("initial");
    setStep5Phase("initial");
    setExploreH(1);
    setExploreV(1);
    setStep6UsedH(false);
    setStep6UsedV(false);
    setStep6Dragging(false);
    setStep6LinePhase(null);
    setStep1Snapped(0);
    setStep2Snapped(0);
    setStep3Snapped(0);
    setStep4Snapped(0);
    resetGraph();
  };

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setStep1Phase("initial");
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4Phase("initial");
    setStep5Phase("initial");
    setExploreH(1);
    setExploreV(1);
    setStep6UsedH(false);
    setStep6UsedV(false);
    setStep6Dragging(false);
    setStep6LinePhase(null);
    setStep1Snapped(0);
    setStep2Snapped(0);
    setStep3Snapped(0);
    setStep4Snapped(0);
    resetGraph();
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const getHSliderMode = useCallback(() => {
    if (currentStep === 1) return "positive";
    if (
      currentStep === 2 &&
      step2Phase !== "animating" &&
      step2Phase !== "ruleShown"
    ) {
      return "negative";
    }
    if (currentStep === 2) return "positive";
    return "both";
  }, [currentStep, step2Phase]);

  const getVSliderMode = useCallback(() => {
    if (currentStep === 3) return "positive";
    if (currentStep === 4 && step4Phase === "animating") return "both";
    if (currentStep === 4 && step4Phase === "ruleShown") return "positive";
    if (currentStep === 4) return "negative";
    return "both";
  }, [currentStep, step4Phase]);

  const handleHDragStart = useCallback(() => {
    setIsDragging(true);
    setHighlightStaticX(true);
  }, []);

  const handleVDragStart = useCallback(() => {
    setIsDragging(true);
    setHighlightStaticY(true);
  }, []);

  const handleHChange = useCallback(
    (val) => {
      setHValue(snapNearInteger(val, getHSliderMode()));
    },
    [getHSliderMode],
  );

  const handleVChange = useCallback(
    (val) => {
      setVValue(snapNearInteger(val, getVSliderMode()));
    },
    [getVSliderMode],
  );

  const handleHReleaseStep1 = useCallback((val) => {
    setIsDragging(false);
    const snapped = finalizeSliderValue(val, "positive");
    if (snapped <= 0) {
      setHValue(0);
      setSnappedH(0);
      setShowDynamicBox(false);
      return;
    }
    setHValue(snapped);
    setSnappedH(snapped);
    setShowDynamicBox(true);
    setDynamicCoordPhase("expression");
    setSliderLocked(true);

    setTimeout(() => {
      setDynamicCoordPhase("merged");
      setStep1Phase("done");
      setStep1Snapped(snapped);
    }, 1000);
  }, []);

  const handleHReleaseStep2 = useCallback((val) => {
    setIsDragging(false);
    const snapped = finalizeSliderValue(val, "negative");
    if (snapped >= 0) {
      setHValue(0);
      setSnappedH(0);
      setShowDynamicBox(false);
      return;
    }
    setHValue(snapped);
    setSnappedH(snapped);
    setShowDynamicBox(true);
    setDynamicCoordPhase("expression");
    setSliderLocked(true);

    setTimeout(() => {
      setDynamicCoordPhase("minus");
      setTimeout(() => {
        setDynamicCoordPhase("merged");
        setStep2Phase("done");
        setStep2Snapped(snapped);
      }, 800);
    }, 800);
  }, []);

  const handleVReleaseStep3 = useCallback((val) => {
    setIsDragging(false);
    const snapped = finalizeSliderValue(val, "positive");
    if (snapped <= 0) {
      setVValue(0);
      setSnappedV(0);
      setShowDynamicBox(false);
      return;
    }
    setVValue(snapped);
    setSnappedV(snapped);
    setShowDynamicBox(true);
    setDynamicCoordPhase("expression");
    setSliderLocked(true);

    setTimeout(() => {
      setDynamicCoordPhase("merged");
      setStep3Phase("done");
      setStep3Snapped(snapped);
    }, 1000);
  }, []);

  const handleVReleaseStep4 = useCallback((val) => {
    setIsDragging(false);
    const snapped = finalizeSliderValue(val, "negative");
    if (snapped >= 0) {
      setVValue(0);
      setSnappedV(0);
      setShowDynamicBox(false);
      return;
    }
    setVValue(snapped);
    setSnappedV(snapped);
    setShowDynamicBox(true);
    setDynamicCoordPhase("expression");
    setSliderLocked(true);

    setTimeout(() => {
      setDynamicCoordPhase("minus");
      setTimeout(() => {
        setDynamicCoordPhase("merged");
        setStep4Phase("done");
        setStep4Snapped(snapped);
      }, 800);
    }, 800);
  }, []);

  const handleHRelease = useCallback(
    (val) => {
      if (currentStep === 1 && step1Phase !== "done") {
        handleHReleaseStep1(val);
      } else if (
        currentStep === 2 &&
        step2Phase !== "done" &&
        step2Phase !== "animating" &&
        step2Phase !== "ruleShown"
      ) {
        handleHReleaseStep2(val);
      }
    },
    [currentStep, step1Phase, step2Phase, handleHReleaseStep1, handleHReleaseStep2],
  );

  const handleVRelease = useCallback(
    (val) => {
      if (currentStep === 3 && step3Phase !== "done") {
        handleVReleaseStep3(val);
      } else if (
        currentStep === 4 &&
        step4Phase !== "done" &&
        step4Phase !== "animating" &&
        step4Phase !== "ruleShown"
      ) {
        handleVReleaseStep4(val);
      }
    },
    [currentStep, step3Phase, step4Phase, handleVReleaseStep3, handleVReleaseStep4],
  );

  const runGeneralRuleAnimation = useCallback((startVal, endVal, axis, onComplete) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    setSliderLocked(false);
    setShowDynamicBox(true);
    setDynamicCoordPhase("expression");
    setSymbolicMode(false);

    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const current = startVal + (endVal - startVal) * eased;

      if (axis === "y") {
        setVValue(clampSliderRaw(current, "both"));
        setSnappedV(getSliderDisplayValue(current));
      } else {
        setHValue(clampSliderRaw(current, "both"));
        setSnappedH(getSliderDisplayValue(current));
      }
      setDynamicCoordPhase("expression");

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        if (axis === "y") {
          setVValue(endVal);
          setSnappedV(endVal);
        } else {
          setHValue(endVal);
          setSnappedH(endVal);
        }
        setDynamicCoordPhase("expression");
        setTimeout(onComplete, 600);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  }, []);

  const runStep6LineAnim = useCallback((hVal, vVal) => {
    const dx = hVal - 1;
    const dy = vVal - 1;

    const showVertical = () => {
      if (Math.abs(dy) > 0.05) {
        setStep6LinePhase("v");
        setTimeout(() => setStep6LinePhase("done"), 600);
      } else {
        setStep6LinePhase("done");
      }
    };

    if (Math.abs(dx) > 0.05) {
      setStep6LinePhase("h");
      setTimeout(showVertical, 600);
    } else {
      showVertical();
    }
  }, []);

  const handleExploreHDragStart = useCallback(() => {
    setStep6Dragging(true);
    setStep6LinePhase(null);
  }, []);

  const handleExploreVDragStart = useCallback(() => {
    setStep6Dragging(true);
    setStep6LinePhase(null);
  }, []);

  const handleExploreHChange = useCallback((val) => {
    setExploreH(snapNearInteger(val, "both", -8, 8));
  }, []);

  const handleExploreVChange = useCallback((val) => {
    setExploreV(snapNearInteger(val, "both", -3, 3));
  }, []);

  const handleExploreHRelease = useCallback(
    (val) => {
      const snapped = finalizeSliderValue(val, "both", -8, 8);
      setExploreH(snapped);
      setStep6UsedH(true);
      setStep6Dragging(false);
      runStep6LineAnim(snapped, exploreV);
    },
    [exploreV, runStep6LineAnim],
  );

  const handleExploreVRelease = useCallback(
    (val) => {
      const snapped = finalizeSliderValue(val, "both", -3, 3);
      setExploreV(snapped);
      setStep6UsedV(true);
      setStep6Dragging(false);
      runStep6LineAnim(exploreH, snapped);
    },
    [exploreH, runStep6LineAnim],
  );

  const handleCombineClick = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setStep5Phase("combining");
  }, []);

  const handleCombineComplete = useCallback(() => {
    setStep5Phase("done");
  }, []);

  const handleGeneralRuleClick = useCallback(() => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 2) {
      setStep2Phase("animating");
      runGeneralRuleAnimation(hValue, 2, "x", () => {
        setSymbolicMode(true);
        setStep2Phase("ruleShown");
        setSliderLocked(true);
      });
    } else if (currentStep === 4) {
      setStep4Phase("animating");
      runGeneralRuleAnimation(vValue, 2, "y", () => {
        setSymbolicMode(true);
        setStep4Phase("ruleShown");
        setSliderLocked(true);
      });
    }
  }, [currentStep, hValue, vValue, runGeneralRuleAnimation]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentStep === 2 && step2Phase === "initial") {
      resetGraph();
    }
    if (currentStep === 3 && step3Phase === "initial") {
      resetGraph();
    }
    if (currentStep === 4 && step4Phase === "initial") {
      resetGraph();
    }
  }, [currentStep]);

  const questionText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].questionText;
    if (currentStep === 2) {
      return step2Phase === "ruleShown"
        ? APP_DATA.steps[2].questionTextRule
        : APP_DATA.steps[2].questionTextInitial;
    }
    if (currentStep === 3) return APP_DATA.steps[3].questionText;
    if (currentStep === 4) {
      return step4Phase === "ruleShown"
        ? APP_DATA.steps[4].questionTextRule
        : APP_DATA.steps[4].questionTextInitial;
    }
    if (currentStep === 5) return APP_DATA.steps[5].questionText;
    return "";
  }, [currentStep, step2Phase, step4Phase]);

  const navText = useMemo(() => {
    if (currentStep === 1) {
      return step1Phase === "done"
        ? APP_DATA.steps[1].navTextDone
        : APP_DATA.steps[1].navTextInitial;
    }
    if (currentStep === 2) {
      return step2Phase === "ruleShown"
        ? APP_DATA.steps[2].navTextDone
        : APP_DATA.steps[2].navTextInitial;
    }
    if (currentStep === 3) {
      return step3Phase === "done"
        ? APP_DATA.steps[3].navTextDone
        : APP_DATA.steps[3].navTextInitial;
    }
    if (currentStep === 4) {
      return step4Phase === "ruleShown"
        ? APP_DATA.steps[4].navTextDone
        : APP_DATA.steps[4].navTextInitial;
    }
    if (currentStep === 5) {
      return step5Phase === "done"
        ? APP_DATA.steps[5].navTextDone
        : APP_DATA.steps[5].navTextInitial;
    }
    if (currentStep === 6) return APP_DATA.steps[6].navText;
    return "";
  }, [currentStep, step1Phase, step2Phase, step3Phase, step4Phase, step5Phase]);

  const isNextDisabled =
    (currentStep === 1 && step1Phase !== "done") ||
    (currentStep === 2 && step2Phase !== "ruleShown") ||
    (currentStep === 3 && step3Phase !== "done") ||
    (currentStep === 4 && step4Phase !== "ruleShown") ||
    (currentStep === 5 && step5Phase !== "done") ||
    (currentStep === 6 && (!step6UsedH || !step6UsedV));

  const isPrevDisabled = currentStep <= 1;

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
      } else if (currentStep === 7) {
        addNudgeFor("start-over-button");
      } else {
        if (currentStep === 2 && step2Phase === "done") {
          addNudgeFor("general-rule-button");
        }
        if (currentStep === 4 && step4Phase === "done") {
          addNudgeFor("general-rule-button");
        }
        if (currentStep === 5 && step5Phase === "initial") {
          addNudgeFor("combine-button");
        }
        if (!isNextDisabled) {
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
  }, [currentStep, isNextDisabled, step1Phase, step2Phase, step3Phase, step4Phase, step5Phase, step6UsedH, step6UsedV]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;
    if (currentStep === 1) {
      setCurrentStep(2);
      setStep2Phase("initial");
      resetGraph();
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setStep3Phase("initial");
      resetGraph();
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setStep4Phase("initial");
      resetGraph();
    } else if (currentStep === 4) {
      setCurrentStep(5);
      setStep5Phase("initial");
    } else if (currentStep === 5) {
      setCurrentStep(6);
      setExploreH(1);
      setExploreV(1);
      setStep6UsedH(false);
      setStep6UsedV(false);
      setStep6Dragging(false);
      setStep6LinePhase(null);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 6) {
      setCurrentStep(5);
      setStep5Phase("done");
      setExploreH(1);
      setExploreV(1);
      setStep6UsedH(false);
      setStep6UsedV(false);
      setStep6Dragging(false);
      setStep6LinePhase(null);
      return;
    }
    if (currentStep === 5) {
      setCurrentStep(4);
      setStep5Phase("initial");
      setVValue(2);
      setSnappedV(2);
      setShowDynamicBox(true);
      setDynamicCoordPhase("expression");
      setSliderLocked(true);
      setStep4Phase("ruleShown");
      setSymbolicMode(true);
      setHighlightStaticY(true);
      return;
    }
    if (currentStep === 4) {
      setCurrentStep(3);
      setStep4Phase("initial");
      setStep5Phase("initial");
      setVValue(step3Snapped);
      setSnappedV(step3Snapped);
      setShowDynamicBox(true);
      setDynamicCoordPhase("merged");
      setSliderLocked(true);
      setStep3Phase("done");
      setSymbolicMode(false);
      setHighlightStaticY(true);
      return;
    }
    if (currentStep === 3) {
      setCurrentStep(2);
      setStep3Phase("initial");
      setVValue(0);
      setSnappedV(0);
      setHValue(0);
      setSnappedH(0);
      setShowDynamicBox(false);
      setSliderLocked(false);
      setStep2Phase("ruleShown");
      setSymbolicMode(true);
      setHValue(2);
      setSnappedH(2);
      setShowDynamicBox(true);
      setDynamicCoordPhase("merged");
      setSliderLocked(true);
      setHighlightStaticX(true);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
      setStep2Phase("initial");
      setHValue(step1Snapped);
      setSnappedH(step1Snapped);
      setShowDynamicBox(true);
      setDynamicCoordPhase("merged");
      setSliderLocked(true);
      setStep1Phase("done");
      setSymbolicMode(false);
      setHighlightStaticX(true);
    } else if (currentStep === 1) {
      setCurrentStep(0);
      resetEverything();
    }
  };

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

  if (currentStep === 7) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: null,
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
    currentStep !== 6
      ? React.createElement(QuestionPanel, {
          text: questionText,
          step: currentStep,
        })
      : null,
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        step1Phase: step1Phase,
        step2Phase: step2Phase,
        step3Phase: step3Phase,
        step4Phase: step4Phase,
        step5Phase: step5Phase,
        hValue: hValue,
        vValue: vValue,
        snappedH: snappedH,
        snappedV: snappedV,
        isDragging: isDragging,
        sliderLocked: sliderLocked,
        showDynamicBox: showDynamicBox,
        dynamicCoordPhase: dynamicCoordPhase,
        symbolicMode: symbolicMode,
        step1Snapped: step1Snapped,
        step2Snapped: step2Snapped,
        step3Snapped: step3Snapped,
        step4Snapped: step4Snapped,
        highlightStaticX: highlightStaticX,
        highlightStaticY: highlightStaticY,
        onHChange: handleHChange,
        onHRelease: handleHRelease,
        onHDragStart: handleHDragStart,
        onVChange: handleVChange,
        onVRelease: handleVRelease,
        onVDragStart: handleVDragStart,
        onGeneralRuleClick: handleGeneralRuleClick,
        onCombineClick: handleCombineClick,
        onCombineComplete: handleCombineComplete,
        exploreH: exploreH,
        exploreV: exploreV,
        step6Dragging: step6Dragging,
        step6LinePhase: step6LinePhase,
        onExploreHChange: handleExploreHChange,
        onExploreVChange: handleExploreVChange,
        onExploreHDragStart: handleExploreHDragStart,
        onExploreVDragStart: handleExploreVDragStart,
        onExploreHRelease: handleExploreHRelease,
        onExploreVRelease: handleExploreVRelease,
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
