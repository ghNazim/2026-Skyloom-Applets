const App = () => {
  const { useState, useMemo, useEffect, useCallback } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [stepOnePhase, setStepOnePhase] = useState("rule");
  const [ruleStatus, setRuleStatus] = useState("pending");
  const [ruleSelected, setRuleSelected] = useState(null);
  const [pointStatuses, setPointStatuses] = useState({ A: "pending", B: "pending" });
  const [pointSelected, setPointSelected] = useState({ A: null, B: null });
  const [showCoordinateFeedback, setShowCoordinateFeedback] = useState(false);
  const [substitutionStarted, setSubstitutionStarted] = useState(false);
  const [substitutionPhase, setSubstitutionPhase] = useState(0);
  const [substitutionDone, setSubstitutionDone] = useState(false);
  const [simplifyStatus, setSimplifyStatus] = useState("pending");
  const [simplifySelected, setSimplifySelected] = useState(null);
  const [stepTwoEntrySources, setStepTwoEntrySources] = useState(null);
  const [nudgePositions, setNudgePositions] = useState([]);

  const resetApplet = useCallback(() => {
    setStepOnePhase("rule");
    setRuleStatus("pending");
    setRuleSelected(null);
    setPointStatuses({ A: "pending", B: "pending" });
    setPointSelected({ A: null, B: null });
    setShowCoordinateFeedback(false);
    setSubstitutionStarted(false);
    setSubstitutionPhase(0);
    setSubstitutionDone(false);
    setSimplifyStatus("pending");
    setSimplifySelected(null);
    setStepTwoEntrySources(null);
  }, []);

  useEffect(() => {
    document.title = APP_DATA.title;
  }, []);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    resetApplet();
    setCurrentStep(1);
  };

  const handleRuleSelect = useCallback((index) => {
    if (ruleStatus === "correct" || ruleStatus === "animating") return;

    const isCorrect = index === APP_DATA.problem.ruleCorrectIndex;
    setRuleSelected(index);

    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }

    if (isCorrect) {
      setRuleStatus("animating");
    } else {
      setRuleStatus("wrong");
      setTimeout(() => {
        setRuleSelected(null);
        setRuleStatus("pending");
      }, 650);
    }
  }, [ruleStatus]);

  const handleRuleAnimationDone = useCallback(() => {
    setRuleStatus("correct");
    setStepOnePhase("pointA");
  }, []);

  const handlePointSelect = useCallback((pointKey, index) => {
    if (ruleStatus !== "correct") return;
    if (pointStatuses[pointKey] === "correct" || pointStatuses[pointKey] === "animating") return;

    const point = APP_DATA.problem.points.find((item) => item.key === pointKey);
    const isCorrect = point && index === point.correctIndex;
    setPointSelected((selected) => ({ ...selected, [pointKey]: index }));
    setShowCoordinateFeedback(false);

    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }

    if (isCorrect) {
      setPointStatuses((statuses) => ({ ...statuses, [pointKey]: "animating" }));
    } else {
      setPointStatuses((statuses) => ({ ...statuses, [pointKey]: "wrong" }));
      setShowCoordinateFeedback(true);
    }
  }, [pointStatuses, ruleStatus]);

  const handlePointAnimationDone = useCallback((pointKey) => {
    setPointStatuses((statuses) => ({ ...statuses, [pointKey]: "correct" }));
    setShowCoordinateFeedback(false);
    setStepOnePhase(pointKey === "A" ? "pointB" : "done");
  }, []);

  const handleSubstitute = useCallback(() => {
    if (substitutionStarted) return;
    if (typeof playSound === "function") playSound("click");
    setSubstitutionStarted(true);
    setSubstitutionPhase(1);
  }, [substitutionStarted]);

  const handleSubstitutionDone = useCallback(() => {
    setSubstitutionDone(true);
  }, []);

  const handleSimplifySelect = useCallback((index) => {
    if (simplifyStatus === "correct") return;

    const isCorrect = index === APP_DATA.problem.simplifyCorrectIndex;
    setSimplifySelected(index);

    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }

    setSimplifyStatus(isCorrect ? "correct" : "wrong");
  }, [simplifyStatus]);

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1 && stepOnePhase === "done") {
      const sourceEls = document.querySelectorAll(".point-answer.is-visible");
      const nextSources = Array.from(sourceEls).map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          html: el.innerHTML,
          left: rect.left + rect.width / 2,
          top: rect.top + rect.height / 2,
        };
      });
      setStepTwoEntrySources(nextSources);
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2 && substitutionDone) {
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 0) return;
    if (currentStep === 1) {
      resetApplet();
      setCurrentStep(0);
      return;
    }
    if (currentStep === 2) {
      setSubstitutionStarted(false);
      setSubstitutionPhase(0);
      setSubstitutionDone(false);
      setStepTwoEntrySources(null);
      setCurrentStep(1);
      return;
    }
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const navState = useMemo(() => {
    if (currentStep === 1) {
      return {
        text: stepOnePhase === "done" ? APP_DATA.nav.continue : APP_DATA.nav.choose,
        nextDisabled: stepOnePhase !== "done",
        hidden: false,
      };
    }

    if (currentStep === 2) {
      if (!substitutionStarted) {
        return { text: APP_DATA.nav.substitute, nextDisabled: true, hidden: false };
      }
      return {
        text: substitutionDone ? APP_DATA.nav.continue : "",
        nextDisabled: !substitutionDone,
        hidden: !substitutionDone,
      };
    }

    return {
      text: simplifyStatus === "correct" ? APP_DATA.nav.visualise : APP_DATA.nav.choose,
      nextDisabled: simplifyStatus !== "correct",
      hidden: false,
    };
  }, [currentStep, stepOnePhase, substitutionStarted, substitutionDone, simplifyStatus]);

  useEffect(() => {
    const updateNudges = () => {
      const nextPositions = [];
      let targetId = null;

      if (currentStep === 0) {
        targetId = "start-button";
      } else if (currentStep === 1 && stepOnePhase === "done") {
        targetId = "next-button";
      } else if (currentStep === 2 && !substitutionStarted) {
        targetId = "substitute-button";
      } else if (currentStep === 2 && substitutionDone) {
        targetId = "next-button";
      } else if (currentStep === 3 && simplifyStatus === "correct") {
        targetId = "next-button";
      }

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el && !el.disabled) {
          nextPositions.push(el.getBoundingClientRect());
        }
      }

      setNudgePositions(nextPositions);
    };

    const timeoutId = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateNudges);
    };
  }, [currentStep, stepOnePhase, substitutionStarted, substitutionDone, simplifyStatus]);

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

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      html: APP_DATA.question,
      collapsed: currentStep !== 1,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        currentStep: currentStep,
        stepOnePhase: stepOnePhase,
        ruleStatus: ruleStatus,
        ruleSelected: ruleSelected,
        pointStatuses: pointStatuses,
        pointSelected: pointSelected,
        showCoordinateFeedback: showCoordinateFeedback,
        substitutionStarted: substitutionStarted,
        substitutionPhase: substitutionPhase,
        substitutionDone: substitutionDone,
        simplifyStatus: simplifyStatus,
        simplifySelected: simplifySelected,
        onRuleSelect: handleRuleSelect,
        onRuleAnimationDone: handleRuleAnimationDone,
        onPointSelect: handlePointSelect,
        onPointAnimationDone: handlePointAnimationDone,
        onSubstitute: handleSubstitute,
        onSubstitutionPhaseChange: setSubstitutionPhase,
        onSubstitutionDone: handleSubstitutionDone,
        onSimplifySelect: handleSimplifySelect,
        stepTwoEntrySources: stepTwoEntrySources,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: navState.nextDisabled,
        isPrevDisabled: false,
        navText: navState.text,
        navTextHidden: navState.hidden,
      }),
    ),
    renderNudges(),
  );
};
