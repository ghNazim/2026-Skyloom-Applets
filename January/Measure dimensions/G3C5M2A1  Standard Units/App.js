const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState(null);
  const [dynamicQuestionText, setDynamicQuestionText] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [restoreStep2Revealed, setRestoreStep2Revealed] = useState(false);
  const [restoreStep4Revealed, setRestoreStep4Revealed] = useState(false);
  const [dismissedStartNudge, setDismissedStartNudge] = useState(false);
  const [dismissedNextNudge, setDismissedNextNudge] = useState(false);
  const [pencilNudgeDismissed, setPencilNudgeDismissed] = useState(false);
  const [eraserNudgeDismissed, setEraserNudgeDismissed] = useState(false);
  const [nudgeTargetId, setNudgeTargetId] = useState(null);
  const [nudgePosition, setNudgePosition] = useState(null);
  const [magNudgeDismissed, setMagNudgeDismissed] = useState(false);
  const [s11NudgeDismissed, setS11NudgeDismissed] = useState(false);
  const [s11NudgeRepositionTrigger, setS11NudgeRepositionTrigger] = useState(0);
  const [s12DragNudgeDismissed, setS12DragNudgeDismissed] = useState(false);
  const [s12NudgeRepositionTrigger, setS12NudgeRepositionTrigger] = useState(0);
  const [s13PencilDismissed, setS13PencilDismissed] = useState(false);
  const [s14PencilDismissed, setS14PencilDismissed] = useState(false);
  const [s15EraserDismissed, setS15EraserDismissed] = useState(false);
  const [s16EraserDismissed, setS16EraserDismissed] = useState(false);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setDismissedStartNudge(true);
    setCurrentStep(1);
    setDynamicQuestionText(null);
    setDynamicNavText(null);
    setIsNextDisabled(true);
    setResetKey((prev) => prev + 1);
  };


  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setDynamicNavText(null);
    setDynamicQuestionText(null);
    setResetKey((prev) => prev + 1);
    setRestoreStep2Revealed(false);
    setRestoreStep4Revealed(false);
    setDismissedStartNudge(false);
    setDismissedNextNudge(false);
    setPencilNudgeDismissed(false);
    setEraserNudgeDismissed(false);
    setMagNudgeDismissed(false);
    setS11NudgeDismissed(false);
    setS12DragNudgeDismissed(false);
    setS13PencilDismissed(false);
    setS14PencilDismissed(false);
    setS15EraserDismissed(false);
    setS16EraserDismissed(false);
  };

  const handleRevealRuler = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(8);
    setDynamicQuestionText(APP_DATA.step8?.q ?? null);
    setDynamicNavText(APP_DATA.step8?.n ?? null);
    setIsNextDisabled(false);
    setResetKey((prev) => prev + 1);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    setDismissedNextNudge(true);
    if (currentStep === 2) {
      setCurrentStep(3);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setRestoreStep2Revealed(false);
      setPencilNudgeDismissed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 4) {
      setCurrentStep(5);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setRestoreStep4Revealed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 5) {
      setCurrentStep(6);
      setIsNextDisabled(false);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 6) {
      setCurrentStep(7);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 8) {
      setCurrentStep(9);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 9) {
      setCurrentStep(10);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setMagNudgeDismissed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 10) {
      setCurrentStep(11);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setS11NudgeDismissed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 11) {
      setCurrentStep(12);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setS12DragNudgeDismissed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 12) {
      setCurrentStep(13);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setS13PencilDismissed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 14) {
      setCurrentStep(15);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setS15EraserDismissed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 15) {
      setCurrentStep(16);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setS16EraserDismissed(false);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 16) {
      setCurrentStep(17);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) return;
    if (currentStep === 2) {
      setCurrentStep(1);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setIsNextDisabled(false);
      setDynamicQuestionText(APP_DATA.step2Farhan.qAfter);
      setDynamicNavText(APP_DATA.step2Farhan.nAfter);
      setRestoreStep2Revealed(true);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 4) {
      setCurrentStep(3);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setRestoreStep4Revealed(true);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 5) {
      setCurrentStep(4);
      setIsNextDisabled(false);
      setDynamicQuestionText(APP_DATA.step4Aisha.qAfter);
      setDynamicNavText(APP_DATA.step4Aisha.nAfter);
      setRestoreStep4Revealed(true);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 6) {
      setCurrentStep(5);
      setIsNextDisabled(true);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 7) {
      setCurrentStep(6);
      setIsNextDisabled(false);
      setDynamicNavText(null);
      setDynamicQuestionText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 8) {
      setCurrentStep(7);
      setIsNextDisabled(true);
      setDynamicQuestionText(APP_DATA.step7?.q ?? null);
      setDynamicNavText(APP_DATA.step7?.n ?? null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 9) {
      setCurrentStep(8);
      setIsNextDisabled(false);
      setDynamicQuestionText(APP_DATA.step8?.q ?? null);
      setDynamicNavText(APP_DATA.step8?.n ?? null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 10) {
      setCurrentStep(9);
      setIsNextDisabled(true);
      setDynamicQuestionText(null);
      setDynamicNavText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 11) {
      setCurrentStep(10);
      setIsNextDisabled(false);
      // It returns to the "zoomed but just tapped" state of 10
      setDynamicQuestionText(APP_DATA.step10?.qAfter ?? null);
      setDynamicNavText(APP_DATA.step10?.nAfter ?? null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 12) {
      setCurrentStep(11);
      setIsNextDisabled(false);
      setDynamicQuestionText(APP_DATA.step11?.qFinal ?? null);
      setDynamicNavText(APP_DATA.step11?.nFinal ?? null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 13) {
      setCurrentStep(12);
      setIsNextDisabled(false);
      setS12DragNudgeDismissed(false);
      // It returns back to the interactive slider with step 12 defaults
      setDynamicQuestionText(APP_DATA.step12?.q ?? null);
      setDynamicNavText(APP_DATA.step12?.nAfterTap ?? null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 14) {
      setCurrentStep(13);
      setIsNextDisabled(true);
      setDynamicQuestionText(null);
      setDynamicNavText(null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 15) {
      setCurrentStep(14);
      setIsNextDisabled(false);
      setDynamicQuestionText(APP_DATA.step14?.qFinal ?? null);
      setDynamicNavText(APP_DATA.step14?.nFinal ?? null);
      setResetKey((prev) => prev + 1);
    } else if (currentStep === 16) {
      setCurrentStep(15);
      setIsNextDisabled(true);
      setDynamicQuestionText(null);
      setDynamicNavText(null);
      setResetKey((prev) => prev + 1);
    }
  };

  const setNextEnabled = useCallback((enabled) => {
    setIsNextDisabled(!enabled);
  }, []);

  const updateTexts = useCallback((q, n) => {
    if (q !== undefined) setDynamicQuestionText(q);
    if (n !== undefined) setDynamicNavText(n);
  }, []);

  const advanceStep = useCallback((targetStep) => {
    setCurrentStep((prev) => {
      if (targetStep !== undefined && typeof targetStep === "number") {
        return targetStep;
      }
      if (prev === 1) return 2;
      if (prev === 3) return 4;
      if (prev === 13) return 14;
      if (prev === 15) return 16;
      return prev;
    });
    setDynamicQuestionText(null);
    setDynamicNavText(null);
    setResetKey((k) => k + 1);
  }, []);

  const updateNudgePositionForId = useCallback((id) => {
    if (!id) {
      setNudgePosition(null);
      return;
    }
    const el = document.getElementById(id);
    if (!el) {
      setNudgePosition(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setNudgePosition({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useEffect(() => {
    if (isNextDisabled) setDismissedNextNudge(false);
  }, [isNextDisabled]);

  const prevStepRef = React.useRef(currentStep);
  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      prevStepRef.current = currentStep;
      if (currentStep === 2 || currentStep === 4)
        setPencilNudgeDismissed(false);
      if (currentStep === 1 || currentStep === 3)
        setEraserNudgeDismissed(false);
    }
  }, [currentStep]);

  useEffect(() => {
    let activeId = null;
    if (currentStep === 0 && !dismissedStartNudge) {
      activeId = "start-button";
    } else if (currentStep === 1 && !eraserNudgeDismissed) {
      activeId = "hand-eraser";
    } else if (currentStep === 2) {
      if (isNextDisabled && !pencilNudgeDismissed) activeId = "measure-pencil";
      else if (!isNextDisabled && !dismissedNextNudge) activeId = "next-button";
    } else if (currentStep === 3 && !eraserNudgeDismissed) {
      activeId = "hand-eraser-aisha";
    } else if (currentStep === 4) {
      if (isNextDisabled && !pencilNudgeDismissed) activeId = "measure-pencil";
      else if (!isNextDisabled && !dismissedNextNudge) activeId = "next-button";
    } else if (currentStep === 7) {
      activeId = "s7-tool-button";
    } else if (currentStep === 10 && !magNudgeDismissed) {
      activeId = "mag-glass";
    } else if (currentStep === 11 && !s11NudgeDismissed) {
      activeId = "s11-clickable-circle";
    } else if (currentStep === 12 && !s12DragNudgeDismissed) {
      activeId = "s12-slider-dot";
    } else if (currentStep === 13 && !s13PencilDismissed) {
      activeId = "s13-pencil";
    } else if (currentStep === 14 && !s14PencilDismissed) {
      // Intentionally maps to 's14-pencil' which won't appear until animation finishes internally in MainCanvas
      activeId = "s14-pencil";
    } else if (currentStep === 15 && !s15EraserDismissed) {
      activeId = "s15-eraser";
    } else if (currentStep === 16 && !s16EraserDismissed) {
      activeId = "s16-eraser";
    }

    setNudgeTargetId(activeId);

    if (!activeId) {
      setNudgePosition(null);
      return;
    }

    const raf = requestAnimationFrame(() => updateNudgePositionForId(activeId));
    const handleResize = () => updateNudgePositionForId(activeId);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    currentStep,
    isNextDisabled,
    dismissedStartNudge,
    dismissedNextNudge,
    pencilNudgeDismissed,
    eraserNudgeDismissed,
    magNudgeDismissed,
    s11NudgeDismissed,
    s11NudgeRepositionTrigger,
    s12DragNudgeDismissed,
    s12NudgeRepositionTrigger,
    s13PencilDismissed,
    s14PencilDismissed,
    s15EraserDismissed,
    s16EraserDismissed,
    updateNudgePositionForId,
  ]);

  const getQuestionText = () => {
    if (dynamicQuestionText !== null && dynamicQuestionText !== undefined)
      return dynamicQuestionText;
    if (currentStep === 1) return APP_DATA.step1Farhan?.q || "";
    if (currentStep === 2) return APP_DATA.step2Farhan?.q || "";
    if (currentStep === 3) return APP_DATA.step3Aisha?.q || "";
    if (currentStep === 4) return APP_DATA.step4Aisha?.q || "";
    if (currentStep === 5) return APP_DATA.step5?.q || "";
    if (currentStep === 6) return APP_DATA.step6?.q || "";
    if (currentStep === 7) return APP_DATA.step7?.q || "";
    if (currentStep === 8) return APP_DATA.step8?.q || "";
    if (currentStep === 9) return APP_DATA.step9?.q || "";
    if (currentStep === 10) return APP_DATA.step10?.q || "";
    if (currentStep === 11) return APP_DATA.step11?.q?.[1] || "";
    if (currentStep === 12) return APP_DATA.step12?.q || "";
    if (currentStep === 13) return APP_DATA.step13?.q || "";
    if (currentStep === 14) return APP_DATA.step14?.q || "";
    if (currentStep === 15) return APP_DATA.step15?.q || "";
    if (currentStep === 16) return APP_DATA.step16?.q || "";
    return "";
  };

  const getNavText = () => {
    if (dynamicNavText !== null && dynamicNavText !== undefined)
      return dynamicNavText;
    if (currentStep === 1) return APP_DATA.step1Farhan?.n || "";
    if (currentStep === 2) return APP_DATA.step2Farhan?.n || "";
    if (currentStep === 3) return APP_DATA.step3Aisha?.n || "";
    if (currentStep === 4) return APP_DATA.step4Aisha?.n || "";
    if (currentStep === 5) return APP_DATA.step5?.n || "";
    if (currentStep === 6) return APP_DATA.step6?.n || "";
    if (currentStep === 7) return APP_DATA.step7?.n || "";
    if (currentStep === 8) return APP_DATA.step8?.n || "";
    if (currentStep === 9) return APP_DATA.step9?.n || "";
    if (currentStep === 10) return APP_DATA.step10?.n || "";
    if (currentStep === 11) return APP_DATA.step11?.n || "";
    if (currentStep === 12) return APP_DATA.step12?.n || "";
    if (currentStep === 13) return APP_DATA.step13?.n || "";
    if (currentStep === 14) return APP_DATA.step14?.n || "";
    if (currentStep === 15) return APP_DATA.step15?.n || "";
    if (currentStep === 16) return APP_DATA.step16?.n || "";
    return "";
  };

  const nudgeVariant =
    nudgeTargetId === "s11-clickable-circle" || nudgeTargetId === "mag-glass"
      ? "tapGrey"
      : nudgeTargetId === "s12-slider-dot"
        ? "drag"
        : "tap";

  // Step 0: Start fullscreen
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
        React.createElement(Nudge, {
          show: !!nudgeTargetId,
          position: nudgePosition,
          variant: nudgeVariant,
        }),
      ),
    );
  }

  // Step 17: End fullscreen (Start Over)
  if (currentStep === 17) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.step17.heading,
          text: APP_DATA.step17.text,
          buttonText: APP_DATA.step17.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
        }),
      ),
    );
  }

  // Steps 1–16: Question + Main canvas + Navigation
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        key: resetKey,
        step: currentStep,
        restoreStep2Revealed: restoreStep2Revealed,
        restoreStep4Revealed: restoreStep4Revealed,
        onSetNextEnabled: setNextEnabled,
        onUpdateTexts: updateTexts,
        onAdvanceStep: advanceStep,
        onRevealRuler: handleRevealRuler,
        onDismissPencilNudge: () => setPencilNudgeDismissed(true),
        onDismissEraserNudge: () => setEraserNudgeDismissed(true),
        onDismissMagNudge: () => setMagNudgeDismissed(true),
        onDismissS11Nudge: () => setS11NudgeDismissed(true),
        onS11NudgeReposition: () => setS11NudgeRepositionTrigger((t) => t + 1),
        onDismissS12DragNudge: () => setS12DragNudgeDismissed(true),
        onS12NudgeReposition: () => setS12NudgeRepositionTrigger((t) => t + 1),
        onDismissS13Pencil: () => setS13PencilDismissed(true),
        onDismissS14Pencil: () => setS14PencilDismissed(true),
        onDismissS15Eraser: () => setS15EraserDismissed(true),
        onDismissS16Eraser: () => setS16EraserDismissed(true),
      }),
      React.createElement(Nudge, {
        show: !!nudgeTargetId,
        position: nudgePosition,
        variant: nudgeVariant,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 1,
        navText: getNavText(),
      }),
    ),
  );
};
