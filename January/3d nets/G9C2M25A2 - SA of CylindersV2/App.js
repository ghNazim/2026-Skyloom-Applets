const App = () => {
  const { useState, useEffect, useCallback, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [navText, setNavText] = useState("");
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [unfoldValue, setUnfoldValue] = useState(0);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasUnfoldedOnce, setHasUnfoldedOnce] = useState(false);
  const [highlightPhase, setHighlightPhase] = useState(null); // 'top' | 'bottom' | 'curved' | null
  const [showUnfoldButton, setShowUnfoldButton] = useState(false); // true only after step 1 highlight sequence completes
  const unfoldAnimRef = useRef(null);
  const highlightTimeoutsRef = useRef([]);

  // ---- Initialize step texts & state ----
  useEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (stepData) {
      setQuestionText(stepData.q);
      setNavText(stepData.n);
    }
    setMcqAnswered(false);

    // For steps 2+, ensure unfolded
    if (currentStep >= 2) {
      setIsUnfolded(true);
      setUnfoldValue(1);
    }

    // Step 1: hide unfold button until highlight sequence runs and completes
    if (currentStep === 1) {
      setShowUnfoldButton(false);
    } else {
      setShowUnfoldButton(false); // not needed on other steps; step 1 logic controls it
    }

    // Enable next for non-interactive steps
    if ([2, 5, 7, 8].includes(currentStep)) {
      setIsNextDisabled(false);
    } else if ([4, 6].includes(currentStep)) {
      // MCQ steps - next disabled until answered
      setIsNextDisabled(true);
    } else if (currentStep === 3) {
      // Step 3: starts unfolded (from step 2), next enabled
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [currentStep]);

  // ---- Step 1: run highlight sequence after 0.5s, then show unfold button ----
  useEffect(() => {
    if (currentStep !== 1 || hasUnfoldedOnce) return;
    clearHighlightTimeouts();
    setHighlightPhase(null);
    setShowUnfoldButton(false);

    const INITIAL_DELAY_MS = 1000;
    const HIGHLIGHT_DURATION = 1100;

    const t0 = setTimeout(() => {
      if (typeof playSound === "function") playSound("click");
      setHighlightPhase("top");
      highlightTimeoutsRef.current = [];
      highlightTimeoutsRef.current.push(
        setTimeout(() => {
          if (typeof playSound === "function") playSound("click");
          setHighlightPhase("bottom");
        }, HIGHLIGHT_DURATION)
      );
      highlightTimeoutsRef.current.push(
        setTimeout(() => {
          if (typeof playSound === "function") playSound("click");
          setHighlightPhase("curved");
        }, HIGHLIGHT_DURATION * 2)
      );
      highlightTimeoutsRef.current.push(
        setTimeout(() => {
          setHighlightPhase(null);
          highlightTimeoutsRef.current = [];
          setShowUnfoldButton(true);
        }, HIGHLIGHT_DURATION * 3)
      );
    }, INITIAL_DELAY_MS);

    return () => {
      clearTimeout(t0);
      clearHighlightTimeouts();
    };
  }, [currentStep, hasUnfoldedOnce]);

  // ---- Handlers ----
  const clearHighlightTimeouts = () => {
    (highlightTimeoutsRef.current || []).forEach(clearTimeout);
    highlightTimeoutsRef.current = [];
    setHighlightPhase(null);
  };

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setIsUnfolded(false);
    setUnfoldValue(0);
    setHasUnfoldedOnce(false);
    setShowUnfoldButton(false);
    setIsAnimating(false);
    clearHighlightTimeouts();
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsUnfolded(false);
    setUnfoldValue(0);
    setIsNextDisabled(true);
    setMcqAnswered(false);
    setHasUnfoldedOnce(false);
    setShowUnfoldButton(false);
    setIsAnimating(false);
    clearHighlightTimeouts();
  };

  const startUnfoldAnimation = () => {
    const anim = { value: unfoldValue };
    unfoldAnimRef.current = gsap.to(anim, {
      value: 1,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => setUnfoldValue(anim.value),
      onComplete: () => {
        setIsUnfolded(true);
        setUnfoldValue(1);
        setIsAnimating(false);

        // First unfold in step 1: update texts
        if (currentStep === 1 && !hasUnfoldedOnce) {
          setHasUnfoldedOnce(true);
          const stepData = APP_DATA.steps[1];
          if (stepData.qAfterUnfold) setQuestionText(stepData.qAfterUnfold);
          if (stepData.nAfterUnfold) setNavText(stepData.nAfterUnfold);
        }
        setIsNextDisabled(false);
      },
    });
  };

  const handleUnfold = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    setIsAnimating(true);
    setIsNextDisabled(true);
    // Unfold only; highlight already played when step 1 was reached
    startUnfoldAnimation();
  };

  const handleFold = () => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    clearHighlightTimeouts();
    setIsAnimating(true);
    setIsNextDisabled(true);

    const anim = { value: unfoldValue };
    unfoldAnimRef.current = gsap.to(anim, {
      value: 0,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => setUnfoldValue(anim.value),
      onComplete: () => {
        setIsUnfolded(false);
        setUnfoldValue(0);
        setIsAnimating(false);
        // Next stays disabled in folded state
      },
    });
  };

  const handleToggle = () => {
    if (isUnfolded) {
      handleFold();
    } else {
      handleUnfold();
    }
  };

  const handleMcqCorrect = () => {
    setMcqAnswered(true);
    const stepData = APP_DATA.steps[currentStep];
    if (stepData && stepData.qAfterCorrect)
      setQuestionText(stepData.qAfterCorrect);
    if (stepData && stepData.nAfterCorrect)
      setNavText(stepData.nAfterCorrect);
    setIsNextDisabled(false);
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep <= 0 || isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    clearHighlightTimeouts();
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    // When going back to step 1, reset so it feels like first time on that step
    if (prevStep === 1) {
      setIsUnfolded(false);
      setUnfoldValue(0);
      setHasUnfoldedOnce(false);
      setShowUnfoldButton(false);
    }
  };

  // ==== STEP 0: Start fullscreen ====
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
        })
      )
    );
  }

  // ==== STEP 9: Final fullscreen ====
  if (currentStep === 9) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Final, {
          onRestart: handleRestart,
        })
      )
    );
  }

  // ==== STEPS 1-8: Main layout ====
  return React.createElement(
    "div",
    { className: "applet-container" },

    // Question Panel
    React.createElement(QuestionPanel, { text: questionText }),

    // Main Content
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        unfoldValue: unfoldValue,
        isUnfolded: isUnfolded,
        mcqAnswered: mcqAnswered,
        isAnimating: isAnimating,
        hasUnfoldedOnce: hasUnfoldedOnce,
        showUnfoldButton: showUnfoldButton,
        highlightPhase: highlightPhase,
        onUnfold: handleUnfold,
        onToggle: handleToggle,
        onMcqCorrect: handleMcqCorrect,
        onMcqWrong: () => {},
      })
    ),

    // Navigation
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isAnimating,
        navText: navText,
        nextSymbol: "»",
      })
    )
  );
};
