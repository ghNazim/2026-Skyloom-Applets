const App = () => {
  const { useState, useMemo, useEffect, useRef, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [problemIndex, setProblemIndex] = useState(0);

  // Step 1 state
  const [mcqPhase, setMcqPhase] = useState(1);
  const [ruleStatus, setRuleStatus] = useState("pending");
  const [ruleSelected, setRuleSelected] = useState(null);
  const [coordAStatus, setCoordAStatus] = useState("pending");
  const [coordASelected, setCoordASelected] = useState(null);
  const [coordBStatus, setCoordBStatus] = useState("pending");
  const [coordBSelected, setCoordBSelected] = useState(null);
  const [showCoordFeedback, setShowCoordFeedback] = useState(false);
  const [step1Complete, setStep1Complete] = useState(false);

  // Step 2 state
  const [step2Ready, setStep2Ready] = useState(false);
  const [substAnimStarted, setSubstAnimStarted] = useState(false);
  const [substAnimDone, setSubstAnimDone] = useState(false);

  // Step 3 state
  const [simplifyStatus, setSimplifyStatus] = useState("pending");
  const [simplifySelected, setSimplifySelected] = useState(null);
  const [showSimplifyFeedback, setShowSimplifyFeedback] = useState(false);

  // Step 4 state
  const [step4AnimDone, setStep4AnimDone] = useState(false);

  // Transition fly clones (step 1 → step 2)
  const [transitionClones, setTransitionClones] = useState([]);
  const [step2CoordsVisible, setStep2CoordsVisible] = useState(false);
  const [step2LeftVisible, setStep2LeftVisible] = useState(false);

  // Nudge
  const [nudgePositions, setNudgePositions] = useState([]);

  // Timers
  const ruleHoldTimerRef = useRef(null);

  const clearRuleHoldTimer = useCallback(() => {
    if (ruleHoldTimerRef.current) {
      clearTimeout(ruleHoldTimerRef.current);
      ruleHoldTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearRuleHoldTimer();
  }, [clearRuleHoldTimer]);

  const resetStepState = useCallback(function () {
    setMcqPhase(1);
    setRuleStatus("pending");
    setRuleSelected(null);
    setCoordAStatus("pending");
    setCoordASelected(null);
    setCoordBStatus("pending");
    setCoordBSelected(null);
    setShowCoordFeedback(false);
    setStep1Complete(false);
    setStep2Ready(false);
    setSubstAnimStarted(false);
    setSubstAnimDone(false);
    setSimplifyStatus("pending");
    setSimplifySelected(null);
    setShowSimplifyFeedback(false);
    setStep4AnimDone(false);
    setTransitionClones([]);
    setStep2CoordsVisible(false);
    setStep2LeftVisible(false);
  }, []);

  const loadProblem = useCallback(
    function (index) {
      setActiveProblem(index);
      setProblemIndex(index);
      resetStepState();
    },
    [resetStepState],
  );

  // ── Step 0 handlers ──

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    loadProblem(0);
    setCurrentStep(1);
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    loadProblem(0);
    setCurrentStep(0);
  };

  // ── Step 1 handlers ──

  const handleRuleSelect = useCallback(
    (index) => {
      if (ruleStatus !== "pending") return;
      const isCorrect = index === APP_DATA.ruleCorrectIndex;
      setRuleSelected(index);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        setRuleStatus("animating");
      } else {
        setRuleStatus("wrong");
        setTimeout(() => {
          setRuleSelected(null);
          setRuleStatus("pending");
        }, 650);
      }
    },
    [ruleStatus],
  );

  const handleRuleAnimDone = useCallback(() => {
    setRuleStatus("hold");
    clearRuleHoldTimer();
    ruleHoldTimerRef.current = setTimeout(() => {
      setRuleStatus("correct");
      setMcqPhase(2);
      ruleHoldTimerRef.current = null;
    }, 1000);
  }, [clearRuleHoldTimer]);

  const handleCoordASelect = useCallback(
    (index) => {
      if (coordAStatus === "correct" || coordAStatus === "animating") return;
      const isCorrect = index === APP_DATA.coordCorrectIndexA;
      setCoordASelected(index);
      setShowCoordFeedback(false);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        setCoordAStatus("animating");
      } else {
        setCoordAStatus("wrong");
        setShowCoordFeedback(true);
      }
    },
    [coordAStatus],
  );

  const handleCoordAAnimDone = useCallback(() => {
    setCoordAStatus("correct");
    setShowCoordFeedback(false);
    setTimeout(() => {
      setMcqPhase(3);
      setCoordBSelected(null);
    }, 200);
  }, []);

  const handleCoordBSelect = useCallback(
    (index) => {
      if (coordBStatus === "correct" || coordBStatus === "animating") return;
      const isCorrect = index === APP_DATA.coordCorrectIndexB;
      setCoordBSelected(index);
      setShowCoordFeedback(false);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        setCoordBStatus("animating");
      } else {
        setCoordBStatus("wrong");
        setShowCoordFeedback(true);
      }
    },
    [coordBStatus],
  );

  const handleCoordBAnimDone = useCallback(() => {
    setCoordBStatus("correct");
    setShowCoordFeedback(false);
    setStep1Complete(true);
  }, []);

  // ── Step 2 handlers ──

  const handleSubstitute = useCallback(() => {
    if (typeof playSound === "function") playSound("click");
    setSubstAnimStarted(true);
  }, []);

  const handleSubstAnimDone = useCallback(() => {
    setSubstAnimDone(true);
  }, []);

  const handleStep2Ready = useCallback(() => {
    setStep2Ready(true);
  }, []);

  const handleStep4AnimDone = useCallback(() => {
    setStep4AnimDone(true);
  }, []);

  // ── Step 3 handlers ──

  const handleSimplifySelect = useCallback(
    (index) => {
      if (simplifyStatus === "correct") return;
      const isCorrect = index === APP_DATA.step3.correctIndex;
      setSimplifySelected(index);
      setShowSimplifyFeedback(false);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        setSimplifyStatus("correct");
      } else {
        setSimplifyStatus("wrong");
        setShowSimplifyFeedback(true);
      }
    },
    [simplifyStatus],
  );

  // ── Navigation ──

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1 && step1Complete) {
      var aEl = document.getElementById("coord-a-answer");
      var bEl = document.getElementById("coord-b-answer");
      var aRect = aEl ? aEl.getBoundingClientRect() : null;
      var bRect = bEl ? bEl.getBoundingClientRect() : null;
      var aText = aEl ? aEl.textContent : APP_DATA.imageA;
      var bText = bEl ? bEl.textContent : APP_DATA.imageB;

      if (aRect && bRect) {
        var aCs = window.getComputedStyle(aEl);
        var bCs = window.getComputedStyle(bEl);
        setTransitionClones([
          {
            id: "a",
            text: aText,
            srcLeft: aRect.left,
            srcTop: aRect.top,
            dstLeft: null,
            dstTop: null,
            active: false,
            color: aCs.color,
            fontSize: aCs.fontSize,
            fontWeight: aCs.fontWeight,
            fontFamily: aCs.fontFamily,
            lineHeight: aCs.lineHeight,
          },
          {
            id: "b",
            text: bText,
            srcLeft: bRect.left,
            srcTop: bRect.top,
            dstLeft: null,
            dstTop: null,
            active: false,
            color: bCs.color,
            fontSize: bCs.fontSize,
            fontWeight: bCs.fontWeight,
            fontFamily: bCs.fontFamily,
            lineHeight: bCs.lineHeight,
          },
        ]);
      }

      setStep2Ready(false);
      setSubstAnimStarted(false);
      setSubstAnimDone(false);
      setStep2CoordsVisible(false);
      setStep2LeftVisible(false);
      setCurrentStep(2);

      // Wait for question panel collapse (0.55s) before measuring destinations
      setTimeout(function () {
        var targetA = document.getElementById("step2-coord-a");
        var targetB = document.getElementById("step2-coord-b");
        if (targetA && targetB) {
          var tAR = targetA.getBoundingClientRect();
          var tBR = targetB.getBoundingClientRect();
          setTransitionClones(function (prev) {
            return prev.map(function (c) {
              return Object.assign({}, c, {
                dstLeft: c.id === "a" ? tAR.left : tBR.left,
                dstTop: c.id === "a" ? tAR.top : tBR.top,
              });
            });
          });
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              setTransitionClones(function (prev) {
                return prev.map(function (c) {
                  return Object.assign({}, c, { active: true });
                });
              });
              setStep2LeftVisible(true);
            });
          });
        }

        setTimeout(function () {
          setTransitionClones([]);
          setStep2CoordsVisible(true);
        }, 850);
      }, 600);
      return;
    }

    if (currentStep === 2 && substAnimDone) {
      setCurrentStep(3);
      setSimplifyStatus("pending");
      setSimplifySelected(null);
      setShowSimplifyFeedback(false);
      return;
    }

    if (currentStep === 3 && simplifyStatus === "correct") {
      setStep4AnimDone(false);
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4 && step4AnimDone) {
      if (problemIndex < PROBLEMS.length - 1) {
        loadProblem(problemIndex + 1);
        setCurrentStep(1);
        return;
      }
      setCurrentStep(5);
      return;
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  // ── Derived nav state ──

  const navText = useMemo(() => {
    if (currentStep === 1) {
      if (step1Complete) return APP_DATA.nav.tapNext;
      return APP_DATA.nav.tapOption;
    }
    if (currentStep === 2) {
      if (substAnimDone) return APP_DATA.nav.tapNext;
      if (step2Ready && !substAnimStarted) return APP_DATA.nav.tapSubstitute;
      return "";
    }
    if (currentStep === 3) {
      if (simplifyStatus === "correct") return APP_DATA.nav.tapVisualize;
      return APP_DATA.nav.tapOption;
    }
    if (currentStep === 4) {
      if (!step4AnimDone) return "";
      if (problemIndex < PROBLEMS.length - 1) return APP_DATA.nav.tapChallenge;
      return APP_DATA.nav.tapSummarize;
    }
    return "";
  }, [
    currentStep,
    step1Complete,
    step2Ready,
    substAnimStarted,
    substAnimDone,
    simplifyStatus,
    step4AnimDone,
    problemIndex,
  ]);

  const navTextHidden = useMemo(() => {
    if (currentStep === 2) {
      return !step2Ready || (substAnimStarted && !substAnimDone);
    }
    if (currentStep === 4) {
      return !step4AnimDone;
    }
    return false;
  }, [currentStep, step2Ready, substAnimStarted, substAnimDone, step4AnimDone]);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 1) return !step1Complete;
    if (currentStep === 2) return !substAnimDone;
    if (currentStep === 3) return simplifyStatus !== "correct";
    if (currentStep === 4) return !step4AnimDone;
    return true;
  }, [currentStep, step1Complete, substAnimDone, simplifyStatus, step4AnimDone]);

  // ── Nudge positioning ──

  useEffect(() => {
    var updateNudges = function () {
      var positions = [];
      if (currentStep === 0) {
        var btn = document.getElementById("start-button");
        if (btn) positions.push(btn.getBoundingClientRect());
      } else if (currentStep === 1 && step1Complete) {
        var btn = document.getElementById("next-button");
        if (btn && !btn.disabled) positions.push(btn.getBoundingClientRect());
      } else if (currentStep === 2) {
        if (step2Ready && !substAnimStarted) {
          var btn = document.getElementById("substitute-button");
          if (btn) positions.push(btn.getBoundingClientRect());
        } else if (substAnimDone) {
          var btn = document.getElementById("next-button");
          if (btn && !btn.disabled) positions.push(btn.getBoundingClientRect());
        }
      } else if (currentStep === 3 && simplifyStatus === "correct") {
        var btn = document.getElementById("next-button");
        if (btn && !btn.disabled) positions.push(btn.getBoundingClientRect());
      } else if (currentStep === 4 && step4AnimDone) {
        var btn = document.getElementById("next-button");
        if (btn && !btn.disabled) positions.push(btn.getBoundingClientRect());
      }
      setNudgePositions(positions);
    };

    var tid = setTimeout(updateNudges, 50);
    window.addEventListener("resize", updateNudges);
    return function () {
      clearTimeout(tid);
      window.removeEventListener("resize", updateNudges);
    };
  }, [
    currentStep,
    step1Complete,
    step2Ready,
    substAnimStarted,
    substAnimDone,
    simplifyStatus,
    step4AnimDone,
  ]);

  // ── Render helpers ──

  var renderNudges = function () {
    return nudgePositions.map(function (pos, i) {
      return React.createElement(Nudge, {
        key: i,
        show: true,
        position: pos,
      });
    });
  };

  var renderTransitionClones = function () {
    return transitionClones.map(function (clone) {
      var left =
        clone.active && clone.dstLeft !== null ? clone.dstLeft : clone.srcLeft;
      var top =
        clone.active && clone.dstTop !== null ? clone.dstTop : clone.srcTop;
      return React.createElement(
        "div",
        {
          key: clone.id,
          className: "transition-fly-clone formula-coordinate",
          style: {
            position: "fixed",
            left: left + "px",
            top: top + "px",
            color: clone.color || "#ffffff",
            fontSize: clone.fontSize || "3vw",
            fontWeight: clone.fontWeight || "400",
            fontFamily: clone.fontFamily || "inherit",
            lineHeight: clone.lineHeight || "1",
            zIndex: 10000,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            transition: clone.active
              ? "left 0.78s cubic-bezier(0.4,0,0.2,1), top 0.78s cubic-bezier(0.4,0,0.2,1)"
              : "none",
          },
        },
        clone.text,
      );
    });
  };

  // ── Render ──

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content-splash" },
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

  if (currentStep === 5) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content app-main-content-splash" },
        React.createElement(Fullscreen, {
          heading: APP_DATA.complete.heading,
          text: APP_DATA.complete.text,
          buttonText: APP_DATA.complete.buttonText,
          onButtonClick: handleStartOver,
          buttonId: "start-over-button",
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      html: APP_DATA.question,
      collapsed: currentStep >= 2,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        currentStep: currentStep,
        mcqPhase: mcqPhase,
        ruleStatus: ruleStatus,
        ruleSelected: ruleSelected,
        coordAStatus: coordAStatus,
        coordASelected: coordASelected,
        coordBStatus: coordBStatus,
        coordBSelected: coordBSelected,
        showCoordFeedback: showCoordFeedback,
        onRuleSelect: handleRuleSelect,
        onRuleAnimDone: handleRuleAnimDone,
        onCoordASelect: handleCoordASelect,
        onCoordAAnimDone: handleCoordAAnimDone,
        onCoordBSelect: handleCoordBSelect,
        onCoordBAnimDone: handleCoordBAnimDone,
        step2CoordsVisible: step2CoordsVisible,
        step2LeftVisible: step2LeftVisible,
        step2Ready: step2Ready,
        substAnimStarted: substAnimStarted,
        onSubstitute: handleSubstitute,
        onSubstAnimDone: handleSubstAnimDone,
        onStep2Ready: handleStep2Ready,
        simplifyStatus: simplifyStatus,
        simplifySelected: simplifySelected,
        showSimplifyFeedback: showSimplifyFeedback,
        onSimplifySelect: handleSimplifySelect,
        onStep4AnimDone: handleStep4AnimDone,
        problemIndex: problemIndex,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: function (dir) {
          if (dir === "next") handleNext();
          else if (dir === "prev") handlePrev();
        },
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep >= 2,
        navText: navText,
        navTextHidden: navTextHidden,
      }),
    ),
    renderNudges(),
    renderTransitionClones(),
  );
};
