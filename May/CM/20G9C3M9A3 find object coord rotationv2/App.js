const DEV_START_STEP = 0; // Set to 0 for full flow from start; 7–14 to test part 2

function getPart2AppSync(step) {
  if (step < 7) return null;

  const qv = APP_DATA.questionVisual2;
  const sync = {
    visualMode: "rect",
    showQuestionVisual: false,
    questionVisualVisible: false,
    rectImageBoxes: {},
    rectObjectBoxes: {},
    step8Phase: "initial",
    step9Phase: "initial",
    step10Phase: "waiting",
    step11Phase: "waiting",
    step12Phase: "waiting",
    step13Phase: "waiting",
    step14Phase: "initial",
  };

  if (step >= 8) {
    sync.showQuestionVisual = true;
    sync.questionVisualVisible = true;
    sync.step8Phase = step === 8 ? "initial" : "done";
    qv.keys.forEach((key) => {
      sync.rectImageBoxes[key] = qv.image[key];
    });
    qv.keys.forEach((key) => {
      sync.rectObjectBoxes[key] = qv.objectUnknown[key];
    });
  }

  if (step >= 9) {
    sync.step9Phase = step === 9 ? "initial" : "complete";
  }

  if (step >= 11) sync.rectObjectBoxes.A = qv.objectFound.A;
  if (step >= 12) sync.rectObjectBoxes.B = qv.objectFound.B;
  if (step >= 13) sync.rectObjectBoxes.C = qv.objectFound.C;
  if (step >= 14) {
    qv.keys.forEach((key) => {
      sync.rectObjectBoxes[key] = qv.objectFound[key];
    });
    sync.step14Phase = step === 14 ? "initial" : "done";
  }

  return sync;
}

const App = () => {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;

  const part2BootSync = getPart2AppSync(DEV_START_STEP);
  const bootstrappedRef = useRef(false);

  const [currentStep, setCurrentStep] = useState(DEV_START_STEP);
  const [step2Phase, setStep2Phase] = useState("initial");
  const [step3Phase, setStep3Phase] = useState("initial");
  const [step4Phase, setStep4Phase] = useState("waiting");
  const [step5Phase, setStep5Phase] = useState("waiting");
  const [step6Phase, setStep6Phase] = useState("initial");
  const [step8Phase, setStep8Phase] = useState(
    part2BootSync ? part2BootSync.step8Phase : "initial",
  );
  const [step9Phase, setStep9Phase] = useState(
    part2BootSync ? part2BootSync.step9Phase : "initial",
  );
  const [step10Phase, setStep10Phase] = useState(
    part2BootSync ? part2BootSync.step10Phase : "waiting",
  );
  const [step11Phase, setStep11Phase] = useState(
    part2BootSync ? part2BootSync.step11Phase : "waiting",
  );
  const [step12Phase, setStep12Phase] = useState(
    part2BootSync ? part2BootSync.step12Phase : "waiting",
  );
  const [step13Phase, setStep13Phase] = useState(
    part2BootSync ? part2BootSync.step13Phase : "waiting",
  );
  const [step14Phase, setStep14Phase] = useState(
    part2BootSync ? part2BootSync.step14Phase : "initial",
  );
  const [visibleHighlights, setVisibleHighlights] = useState([]);
  const [showQuestionVisual, setShowQuestionVisual] = useState(
    part2BootSync ? part2BootSync.showQuestionVisual : false,
  );
  const [questionVisualVisible, setQuestionVisualVisible] = useState(
    part2BootSync ? part2BootSync.questionVisualVisible : false,
  );
  const [questionVisualForming, setQuestionVisualForming] = useState(false);
  const [questionVisualClones, setQuestionVisualClones] = useState([]);
  const [visualMode, setVisualMode] = useState(
    part2BootSync ? part2BootSync.visualMode : "segment",
  );
  const [objectBoxA, setObjectBoxA] = useState(null);
  const [objectBoxB, setObjectBoxB] = useState(null);
  const [rectObjectBoxes, setRectObjectBoxes] = useState(
    part2BootSync ? part2BootSync.rectObjectBoxes : {},
  );
  const [rectImageBoxes, setRectImageBoxes] = useState(
    part2BootSync ? part2BootSync.rectImageBoxes : {},
  );
  const [nudgePositions, setNudgePositions] = useState([]);
  const [resetEpoch, setResetEpoch] = useState(0);

  const applyPart2Sync = useCallback((step) => {
    const sync = getPart2AppSync(step);
    if (!sync) return;
    setVisualMode(sync.visualMode);
    setShowQuestionVisual(sync.showQuestionVisual);
    setQuestionVisualVisible(sync.questionVisualVisible);
    setRectImageBoxes(sync.rectImageBoxes);
    setRectObjectBoxes(sync.rectObjectBoxes);
    setStep8Phase(sync.step8Phase);
    setStep9Phase(sync.step9Phase);
    setStep10Phase(sync.step10Phase);
    setStep11Phase(sync.step11Phase);
    setStep12Phase(sync.step12Phase);
    setStep13Phase(sync.step13Phase);
    setStep14Phase(sync.step14Phase);
  }, []);

  useEffect(() => {
    if (bootstrappedRef.current || DEV_START_STEP < 7) return;
    bootstrappedRef.current = true;
    applyPart2Sync(DEV_START_STEP);
  }, [applyPart2Sync]);

  const ALL_HIGHLIGHTS = [
    "highlight-rotation",
    "highlight-a-prime",
    "highlight-b-prime",
    "highlight-find",
  ];

  const resetPart1States = useCallback(() => {
    setStep2Phase("initial");
    setStep3Phase("initial");
    setStep4Phase("waiting");
    setStep5Phase("waiting");
    setStep6Phase("initial");
    setVisibleHighlights([]);
    setShowQuestionVisual(false);
    setQuestionVisualVisible(false);
    setQuestionVisualForming(false);
    setQuestionVisualClones([]);
    setVisualMode("segment");
    setObjectBoxA(null);
    setObjectBoxB(null);
  }, []);

  const resetPart2States = useCallback(() => {
    setStep8Phase("initial");
    setStep9Phase("initial");
    setStep10Phase("waiting");
    setStep11Phase("waiting");
    setStep12Phase("waiting");
    setStep13Phase("waiting");
    setStep14Phase("initial");
    setRectObjectBoxes({});
    setRectImageBoxes({});
  }, []);

  const resetStepStates = useCallback(() => {
    resetPart1States();
    resetPart2States();
  }, [resetPart1States, resetPart2States]);

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setResetEpoch((epoch) => epoch + 1);
    resetStepStates();
  }, [resetStepStates]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetStepStates();
    setCurrentStep(1);
  };

  const handleStep2AnimComplete = useCallback(() => {
    setStep2Phase("done");
  }, []);

  const handleVisibleHighlightsChange = useCallback((id) => {
    if (id === "all") {
      setVisibleHighlights(ALL_HIGHLIGHTS.slice());
      return;
    }
    setVisibleHighlights((prev) =>
      prev.indexOf(id) === -1 ? prev.concat([id]) : prev,
    );
  }, []);

  const handleQuestionVisualChange = useCallback((show, visible, phase) => {
    setShowQuestionVisual(show);
    setQuestionVisualVisible(visible);
    if (phase === "forming") {
      setQuestionVisualForming(true);
    } else if (!show) {
      setQuestionVisualForming(false);
      setQuestionVisualClones([]);
    }
  }, []);

  const handleObjectBoxChange = useCallback((key, text) => {
    if (key === "A") setObjectBoxA(text);
    if (key === "B") setObjectBoxB(text);
  }, []);

  const handleRectImageBoxChange = useCallback((key, text) => {
    setRectImageBoxes((prev) => ({ ...prev, [key]: text }));
  }, []);

  const handleRectObjectBoxChange = useCallback((key, text) => {
    setRectObjectBoxes((prev) => ({ ...prev, [key]: text }));
  }, []);

  const handleStepAdvance = useCallback((nextStep) => {
    if (nextStep === 5) setStep5Phase("waiting");
    if (nextStep === 6) setStep6Phase("initial");
    if (nextStep === 11) setStep11Phase("waiting");
    if (nextStep === 12) setStep12Phase("waiting");
    if (nextStep === 13) setStep13Phase("waiting");
    if (nextStep === 14) setStep14Phase("initial");
    setCurrentStep(nextStep);
  }, []);

  const restoreFreshStep = useCallback(
    (targetStep) => {
      setNudgePositions([]);
      setResetEpoch((epoch) => epoch + 1);

      if (targetStep < 7) {
        resetStepStates();
        if (targetStep === 1) {
          setCurrentStep(1);
          return;
        }

        setStep2Phase(targetStep === 2 ? "initial" : "done");
        setVisibleHighlights(targetStep >= 3 ? ALL_HIGHLIGHTS.slice() : []);
        setShowQuestionVisual(targetStep >= 3);
        setQuestionVisualVisible(targetStep >= 3);
        setVisualMode("segment");

        if (targetStep >= 3) setStep3Phase("initial");
        if (targetStep === 4) setStep4Phase("waiting");
        if (targetStep === 5) {
          setStep4Phase("done");
          setStep5Phase("waiting");
          setObjectBoxA(APP_DATA.questionVisual.objectAFound);
        }
        if (targetStep === 6) {
          setStep4Phase("done");
          setStep5Phase("done");
          setStep6Phase("initial");
          setObjectBoxA(APP_DATA.questionVisual.objectAFound);
          setObjectBoxB(APP_DATA.questionVisual.objectBFound);
        }

        setCurrentStep(targetStep);
        return;
      }

      resetPart1States();
      const sync = getPart2AppSync(targetStep);
      if (sync) {
        setVisualMode(sync.visualMode);
        setShowQuestionVisual(
          targetStep === 8 ? false : sync.showQuestionVisual,
        );
        setQuestionVisualVisible(
          targetStep === 8 ? false : sync.questionVisualVisible,
        );
        setRectImageBoxes(targetStep === 8 ? {} : sync.rectImageBoxes);
        setRectObjectBoxes(targetStep === 8 ? {} : sync.rectObjectBoxes);
        setStep8Phase(sync.step8Phase);
        setStep9Phase(sync.step9Phase);
        setStep10Phase(sync.step10Phase);
        setStep11Phase(sync.step11Phase);
        setStep12Phase(sync.step12Phase);
        setStep13Phase(sync.step13Phase);
        setStep14Phase(sync.step14Phase);
      }
      setCurrentStep(targetStep);
    },
    [ALL_HIGHLIGHTS, resetPart1States, resetStepStates],
  );

  useEffect(() => {
    if (currentStep !== 3 || step3Phase !== "complete") return undefined;
    const id = setTimeout(() => {
      setStep4Phase("waiting");
      setCurrentStep(4);
    }, 1000);
    return () => clearTimeout(id);
  }, [currentStep, step3Phase]);

  useEffect(() => {
    if (currentStep !== 9 || step9Phase !== "complete") return undefined;
    const id = setTimeout(() => {
      setStep10Phase("waiting");
      setCurrentStep(10);
    }, 1000);
    return () => clearTimeout(id);
  }, [currentStep, step9Phase]);

  const questionHtml = useMemo(() => {
    if (currentStep < 1 || (showQuestionVisual && !questionVisualForming)) {
      return "";
    }
    if (currentStep === 1) return APP_DATA.question.textPlain;
    if (currentStep >= 7 && currentStep <= 14) {
      return APP_DATA.question2.textPlain;
    }
    return APP_DATA.question.text;
  }, [currentStep, showQuestionVisual, questionVisualForming]);

  useEffect(() => {
    if (!questionVisualForming || (currentStep !== 2 && currentStep !== 8)) {
      return undefined;
    }

    const cloneConfigs =
      currentStep === 8
        ? [
            {
              sourceId: "highlight-rect-rotation",
              targetId: "qv-arrow-text",
              text: APP_DATA.questionVisual2.rotation,
            },
          ]
        : [
            {
              sourceId: "highlight-rotation",
              targetId: "qv-arrow-text",
              text: APP_DATA.questionVisual.rotation,
            },
            {
              sourceId: "highlight-a-prime",
              targetId: "qv-image-a-text",
              text: APP_DATA.questionVisual.imageA,
            },
            {
              sourceId: "highlight-b-prime",
              targetId: "qv-image-b-text",
              text: APP_DATA.questionVisual.imageB,
            },
          ];

    let timeoutId = null;
    let rafId = null;
    let secondRafId = null;
    const soundTimeoutIds = [];

    const finish = () => {
      setQuestionVisualClones([]);
      setQuestionVisualForming(false);
      setQuestionVisualVisible(true);
    };

    rafId = requestAnimationFrame(() => {
      setQuestionVisualVisible(true);

      const clones = cloneConfigs.map((config) => {
        const sourceEl = document.getElementById(config.sourceId);
        const targetEl = document.getElementById(config.targetId);
        if (!sourceEl || !targetEl) return null;

        const src = sourceEl.getBoundingClientRect();
        const tgt = targetEl.getBoundingClientRect();
        const style = window.getComputedStyle(sourceEl);

        return {
          id: config.sourceId + "-to-" + config.targetId,
          text: config.text,
          startX: src.left + src.width / 2,
          startY: src.top + src.height / 2,
          dx: tgt.left + tgt.width / 2 - (src.left + src.width / 2),
          dy: tgt.top + tgt.height / 2 - (src.top + src.height / 2),
          animating: false,
          style: {
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            color: style.color,
            backgroundColor: style.backgroundColor,
            borderRadius: style.borderRadius,
            padding: style.padding,
          },
        };
      });

      if (clones.some((clone) => clone == null)) {
        finish();
        return;
      }

      setQuestionVisualClones(clones);
      secondRafId = requestAnimationFrame(() => {
        setQuestionVisualClones((prev) =>
          prev.map((clone) => ({ ...clone, animating: true })),
        );
        clones.forEach((clone) => {
          if (clone && typeof playSoundDelayed === "function") {
            soundTimeoutIds.push(playSoundDelayed("swoosh", 200));
          }
        });
      });

      timeoutId = setTimeout(finish, 820);
    });

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (secondRafId != null) cancelAnimationFrame(secondRafId);
      if (timeoutId != null) clearTimeout(timeoutId);
      soundTimeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [currentStep, questionVisualForming]);

  const navText = useMemo(() => {
    if (currentStep === 1) return APP_DATA.steps[1].navText;
    if (currentStep === 2 && step2Phase === "done") {
      return APP_DATA.steps[2].navTextDone;
    }
    if (currentStep === 3) return APP_DATA.steps[3].navText;
    if (currentStep === 4 && step4Phase === "waiting") {
      return APP_DATA.steps[4].navText;
    }
    if (currentStep === 5 && step5Phase === "waiting") {
      return APP_DATA.steps[5].navText;
    }
    if (currentStep === 6) {
      if (step6Phase === "done") return APP_DATA.steps[6].navTextDone;
      if (step6Phase === "panelVisible") return APP_DATA.steps[6].navText;
    }
    if (currentStep === 7) return APP_DATA.steps[7].navText;
    if (currentStep === 8 && step8Phase === "done") {
      return APP_DATA.steps[8].navTextDone;
    }
    if (currentStep === 9) return APP_DATA.steps[9].navText;
    if (currentStep === 10 && step10Phase === "waiting") {
      return APP_DATA.steps[10].navText;
    }
    if (currentStep === 11 && step11Phase === "waiting") {
      return APP_DATA.steps[11].navText;
    }
    if (currentStep === 12 && step12Phase === "waiting") {
      return APP_DATA.steps[12].navText;
    }
    if (currentStep === 13 && step13Phase === "waiting") {
      return APP_DATA.steps[13].navText;
    }
    if (currentStep === 14) {
      if (step14Phase === "done") return APP_DATA.steps[14].navTextDone;
      if (step14Phase === "panelVisible") return APP_DATA.steps[14].navText;
    }
    return "";
  }, [
    currentStep,
    step2Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    step8Phase,
    step9Phase,
    step10Phase,
    step11Phase,
    step12Phase,
    step13Phase,
    step14Phase,
  ]);

  const navTextHidden =
    (currentStep === 2 && step2Phase === "initial") ||
    (currentStep === 4 && step4Phase === "animating") ||
    (currentStep === 5 && step5Phase === "animating") ||
    (currentStep === 6 &&
      (step6Phase === "initial" || step6Phase === "rotating")) ||
    (currentStep === 8 && step8Phase !== "done") ||
    (currentStep === 10 && step10Phase === "animating") ||
    (currentStep === 11 && step11Phase === "animating") ||
    (currentStep === 12 && step12Phase === "animating") ||
    (currentStep === 13 && step13Phase === "animating") ||
    (currentStep === 14 &&
      (step14Phase === "initial" || step14Phase === "rotating"));

  const isAnimationRunning =
    navTextHidden ||
    (currentStep === 3 && step3Phase === "entering") ||
    (currentStep === 9 && step9Phase === "entering");

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep >= 3 && currentStep <= 5) ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 8 && step8Phase !== "done") ||
    currentStep === 9 ||
    (currentStep >= 10 && currentStep <= 13) ||
    (currentStep === 14 && step14Phase !== "done");

  const isPrevDisabled = currentStep <= 1 || isAnimationRunning;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setNudgePositions([]);
    if (isNextDisabled) return;

    if (currentStep === 1) {
      resetPart1States();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setStep3Phase("initial");
      setCurrentStep(3);
    } else if (currentStep === 6) {
      resetPart2States();
      setVisualMode("rect");
      setShowQuestionVisual(false);
      setQuestionVisualVisible(false);
      setCurrentStep(7);
    } else if (currentStep === 7) {
      setStep8Phase("initial");
      setRectImageBoxes({});
      setRectObjectBoxes({});
      setShowQuestionVisual(false);
      setQuestionVisualVisible(false);
      setCurrentStep(8);
    } else if (currentStep === 8) {
      setStep9Phase("initial");
      setCurrentStep(9);
    } else if (currentStep === 14) {
      setCurrentStep(15);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (isPrevDisabled) return;
    restoreFreshStep(currentStep - 1);
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

      if (currentStep === 0 || currentStep === 15) {
        addNudgeFor("start-button");
      } else if (currentStep === 4 && step4Phase === "waiting") {
        addNudgeFor("graph-point-aprime");
      } else if (currentStep === 5 && step5Phase === "waiting") {
        addNudgeFor("graph-point-bprime");
      } else if (currentStep === 6 && step6Phase === "panelVisible") {
        addNudgeFor("rotate-button");
      } else if (currentStep === 10 && step10Phase === "waiting") {
        addNudgeFor("graph-point-aprime");
      } else if (currentStep === 11 && step11Phase === "waiting") {
        addNudgeFor("graph-point-bprime");
      } else if (currentStep === 12 && step12Phase === "waiting") {
        addNudgeFor("graph-point-cprime");
      } else if (currentStep === 13 && step13Phase === "waiting") {
        addNudgeFor("graph-point-dprime");
      } else if (currentStep === 14 && step14Phase === "panelVisible") {
        addNudgeFor("rotate-button");
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
  }, [
    currentStep,
    isNextDisabled,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    step6Phase,
    step8Phase,
    step10Phase,
    step11Phase,
    step12Phase,
    step13Phase,
    step14Phase,
  ]);

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

  if (currentStep === 15) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: resetEverything,
          buttonId: "start-button",
        }),
      ),
      renderNudges(),
    );
  }

  const isPart2 = currentStep >= 7;

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      html: questionHtml,
      visibleHighlights: visibleHighlights,
      showQuestionVisual: showQuestionVisual,
      questionVisualVisible: questionVisualVisible,
      questionVisualForming: questionVisualForming,
      visualMode: visualMode,
      objectBoxA: objectBoxA,
      objectBoxB: objectBoxB,
      rectObjectBoxes: rectObjectBoxes,
      rectImageBoxes: rectImageBoxes,
    }),
    questionVisualClones.map((clone) =>
      React.createElement(
        "div",
        {
          key: clone.id,
          className: "qv-forming-clone",
          style: {
            ...clone.style,
            left: clone.startX + "px",
            top: clone.startY + "px",
            transform: clone.animating
              ? "translate(calc(-50% + " +
                clone.dx +
                "px), calc(-50% + " +
                clone.dy +
                "px))"
              : "translate(-50%, -50%)",
          },
        },
        clone.text,
      ),
    ),
    React.createElement(
      "div",
      { className: "app-main-content" },
      isPart2
        ? React.createElement(RectMainCanvas, {
            key: "rect-" + resetEpoch,
            step: currentStep,
            devStartStep: DEV_START_STEP,
            step8Phase: step8Phase,
            onStep8PhaseChange: setStep8Phase,
            step9Phase: step9Phase,
            onStep9PhaseChange: setStep9Phase,
            step10Phase: step10Phase,
            onStep10PhaseChange: setStep10Phase,
            step11Phase: step11Phase,
            onStep11PhaseChange: setStep11Phase,
            step12Phase: step12Phase,
            onStep12PhaseChange: setStep12Phase,
            step13Phase: step13Phase,
            onStep13PhaseChange: setStep13Phase,
            step14Phase: step14Phase,
            onStep14PhaseChange: setStep14Phase,
            onQuestionVisualChange: handleQuestionVisualChange,
            onRectImageBoxChange: handleRectImageBoxChange,
            onRectObjectBoxChange: handleRectObjectBoxChange,
            onStepAdvance: handleStepAdvance,
          })
        : React.createElement(MainCanvas, {
            key: "main-" + resetEpoch,
            step: currentStep,
            step2Phase: step2Phase,
            onStep2AnimComplete: handleStep2AnimComplete,
            onVisibleHighlightsChange: handleVisibleHighlightsChange,
            onQuestionVisualChange: handleQuestionVisualChange,
            step3Phase: step3Phase,
            onStep3PhaseChange: setStep3Phase,
            step4Phase: step4Phase,
            onStep4PhaseChange: setStep4Phase,
            step5Phase: step5Phase,
            onStep5PhaseChange: setStep5Phase,
            step6Phase: step6Phase,
            onStep6PhaseChange: setStep6Phase,
            onObjectBoxChange: handleObjectBoxChange,
            onStepAdvance: handleStepAdvance,
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
        navTextHidden: navTextHidden,
      }),
    ),
    renderNudges(),
  );
};
