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

  const handleQuestionVisualChange = useCallback((show, visible) => {
    setShowQuestionVisual(show);
    setQuestionVisualVisible(visible);
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
    if (currentStep < 1 || showQuestionVisual) return "";
    if (currentStep === 1) return APP_DATA.question.textPlain;
    if (currentStep >= 7 && currentStep <= 14) {
      return APP_DATA.question2.textPlain;
    }
    return APP_DATA.question.text;
  }, [currentStep, showQuestionVisual]);

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

  const isNextDisabled =
    (currentStep === 2 && step2Phase !== "done") ||
    (currentStep >= 3 && currentStep <= 5) ||
    (currentStep === 6 && step6Phase !== "done") ||
    (currentStep === 8 && step8Phase !== "done") ||
    currentStep === 9 ||
    (currentStep >= 10 && currentStep <= 13) ||
    (currentStep === 14 && step14Phase !== "done");

  const isPrevDisabled = currentStep <= 1;

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
    setNudgePositions([]);

    if (currentStep === 2) {
      setStep2Phase("initial");
      setVisibleHighlights([]);
      setShowQuestionVisual(false);
      setQuestionVisualVisible(false);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setStep2Phase("done");
      setStep3Phase("initial");
      setShowQuestionVisual(true);
      setQuestionVisualVisible(true);
      setVisibleHighlights(ALL_HIGHLIGHTS.slice());
      setCurrentStep(2);
    } else if (currentStep === 1) {
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
      visualMode: visualMode,
      objectBoxA: objectBoxA,
      objectBoxB: objectBoxB,
      rectObjectBoxes: rectObjectBoxes,
      rectImageBoxes: rectImageBoxes,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      isPart2
        ? React.createElement(RectMainCanvas, {
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
