// App.js

const App = () => {
  const { useState, useEffect } = React;
  const h = React.createElement;

  // Unified flow step management
  const [currentStep, setCurrentStep] = useState(-1);
  const [maxStep, setMaxStep] = useState(-1);

  // Comprehend stage states
  const [videoPlayed, setVideoPlayed] = useState(false);

  // Connect stage states
  const [connectAnswers, setConnectAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [incorrectConnectAnswer, setIncorrectConnectAnswer] = useState(false);

  // Compute stage states
  const [computeInteractions, setComputeInteractions] = useState({});
  const [tableAnswer, setTableAnswer] = useState("");
  const [computeStepIndex, setComputeStepIndex] = useState(0);
  const [computeMCQAnswers, setComputeMCQAnswers] = useState({});

  // Audio
  const audio = {
    click: new Audio("assets/sfx/click.mp3"),
    correct: new Audio("assets/sfx/correct.mp3"),
    wrong: new Audio("assets/sfx/wrong.mp3"),
    swoosh: new Audio("assets/sfx/swoosh.mp3"),
  };
  const playAudio = (sound) =>
    audio[sound]?.play().catch((e) => console.error("Audio play failed", e));

  // Get current flow step
  const getCurrentFlowStep = () => {
    // Map step -1 to index 0, step 0 to index 1, etc.
    const flowIndex = currentStep + 1;
    return T.flow[flowIndex] || null;
  };

  // Handlers for Comprehend stage
  const handleShowPyramid = () => {
    playAudio("click");
  };

  const handleVideoEnd = () => {
    setVideoPlayed(true);
  };

  // Handlers for Connect stage
  const handleConnectAnswer = (answerIndex) => {
    const flowStep = getCurrentFlowStep();
    if (!flowStep || flowStep.type !== "connect") return;

    setConnectAnswers((prev) => ({ ...prev, [currentStep]: answerIndex }));

    if (answerIndex === flowStep.stage.correctAnswer) {
      playAudio("correct");
      setIncorrectConnectAnswer(false);
    } else {
      playAudio("wrong");
      setIncorrectConnectAnswer(true);
      setTimeout(() => setIncorrectConnectAnswer(false), 1500);
    }
  };

  // Handlers for Compute stage
  const handleTableAnswer = (answer) => {
    setTableAnswer(answer);
  };

  const handleTableSubmit = () => {
    const flowStep = getCurrentFlowStep();
    if (
      flowStep &&
      flowStep.type === "compute" &&
      flowStep.stage.type === "findBTable"
    ) {
      if (tableAnswer === flowStep.stage.tableData.correctAnswer) {
        playAudio("correct");
        setComputeInteractions((prev) => ({ ...prev, [currentStep]: true }));
      } else {
        playAudio("wrong");
      }
    }
  };

  const handleComputeMCQAnswer = (stepIdx, answerIndex) => {
    const flowStep = getCurrentFlowStep();
    if (!flowStep || flowStep.type !== "compute" || !flowStep.stage.steps)
      return;

    const step = flowStep.stage.steps[stepIdx];
    if (!step || !step.mcq) return;

    const key = `${currentStep}_${stepIdx}`;
    setComputeMCQAnswers((prev) => ({ ...prev, [key]: answerIndex }));

    if (answerIndex === step.mcq.correctAnswer) {
      playAudio("correct");
      // Hold correct state for 0.5 seconds before moving to next step
      setTimeout(() => {
        if (stepIdx < flowStep.stage.steps.length - 1) {
          setComputeStepIndex(stepIdx + 1);
        } else {
          setComputeInteractions((prev) => ({ ...prev, [currentStep]: true }));
          setComputeStepIndex(0);
        }
      }, 500);
    } else {
      playAudio("wrong");
    }
  };

  const handleHighlightClick = () => {
    const flowStep = getCurrentFlowStep();
    if (!flowStep || flowStep.type !== "compute" || !flowStep.stage.steps)
      return;

    if (computeStepIndex < flowStep.stage.steps.length - 1) {
      playAudio("click");
      setComputeStepIndex(computeStepIndex + 1);
    }
  };

  // Reset states when changing steps
  useEffect(() => {
    const flowStep = getCurrentFlowStep();
    if (flowStep) {
      if (
        flowStep.type === "comprehend" &&
        flowStep.stage.type === "showPyramid"
      ) {
        setVideoPlayed(false);
      }
      setShowHint(false);
      setIncorrectConnectAnswer(false);
      setComputeStepIndex(0);
    }
  }, [currentStep]);

  // Navigation handlers
  const handleNext = () => {
    playAudio("click");
    // Allow navigation from step -1 to step 0, and beyond
    // Since currentStep maps to flowIndex with +1, max currentStep is flow.length - 2
    // With step -1 added, we have steps -1 through (flow.length - 2)
    if (currentStep < T.flow.length - 2) {
      setCurrentStep(currentStep + 1);
      setMaxStep(Math.max(maxStep, currentStep + 1));
    }
  };

  const handleBack = () => {
    playAudio("click");
    // Allow going back from step 0 to step -1, but not before step -1
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTabClick = (index) => {
    // Map tab index to step range
    // Tab 0 (Comprehend): steps -1, 0, 1, 6
    // Tab 1 (Connect): steps 2, 3, 7, 8, 10, 12, 13
    // Tab 2 (Compute): steps 4, 5, 9, 11, 14, 15
    const comprehendSteps = [-1, 0, 1, 6];
    const connectSteps = [2, 3, 7, 8, 10, 12, 13];
    const computeSteps = [4, 5, 9, 11, 14, 15];

    let targetSteps = [];
    if (index === 0) targetSteps = comprehendSteps;
    else if (index === 1) targetSteps = connectSteps;
    else if (index === 2) targetSteps = computeSteps;

    // Find the closest step in the target tab that's <= maxStep
    const availableSteps = targetSteps.filter((s) => s <= maxStep);
    if (availableSteps.length > 0) {
      const targetStep = availableSteps[availableSteps.length - 1];
      playAudio("click");
      setCurrentStep(targetStep);
    }
  };

  const handleRestart = () => {
    playAudio("click");
    setCurrentStep(-1);
    setMaxStep(-1);
    setVideoPlayed(false);
    setConnectAnswers({});
    setComputeInteractions({});
    setTableAnswer("");
    setComputeStepIndex(0);
    setComputeMCQAnswers({});
    setShowHint(false);
    setIncorrectConnectAnswer(false);
  };

  // Check if next button should be disabled
  const isNextDisabled = () => {
    const flowStep = getCurrentFlowStep();
    if (!flowStep) return true;

    if (flowStep.type === "comprehend") {
      if (flowStep.stage.type === "showPyramid") {
        return !videoPlayed;
      }
      // showLabelled type (step -1) - always allow next
      if (flowStep.stage.type === "showLabelled") {
        return false;
      }
      return false;
    } else if (flowStep.type === "connect") {
      const selected = connectAnswers[currentStep];
      return selected !== flowStep.stage.correctAnswer;
    } else if (flowStep.type === "compute") {
      if (flowStep.stage.type === "findBTable") {
        return !computeInteractions[currentStep];
      } else if (
        flowStep.stage.type === "findBResult" ||
        flowStep.stage.type === "findAreaCompute4"
      ) {
        return false;
      } else if (flowStep.stage.steps) {
        return !computeInteractions[currentStep];
      }
      return false;
    } else if (flowStep.type === "summary") {
      return true; // Disable next on summary
    }
    return false;
  };

  // Get current tab based on flow step type
  const getCurrentTab = () => {
    const flowStep = getCurrentFlowStep();
    if (!flowStep) return 0;
    if (flowStep.type === "comprehend") return 0;
    if (flowStep.type === "connect") return 1;
    if (flowStep.type === "compute" || flowStep.type === "summary") return 2;
    return 0;
  };

  // Render main content based on current step
  const renderMainContent = () => {
    const flowStep = getCurrentFlowStep();
    if (!flowStep) return null;

    if (flowStep.type === "comprehend") {
      return h(ComprehendScreen, {
        stage: flowStep.stage,
        videoPlayed,
        onShowPyramid: handleShowPyramid,
        onVideoEnd: handleVideoEnd,
      });
    } else if (flowStep.type === "connect") {
      return h(ConnectScreen, {
        stage: flowStep.stage,
        connectAnswer: connectAnswers[currentStep],
        onAnswer: handleConnectAnswer,
        showHint,
        onToggleHint: () => setShowHint(!showHint),
        incorrectAnswer: incorrectConnectAnswer,
      });
    } else if (flowStep.type === "compute") {
      return h(ComputeScreen, {
        stage: flowStep.stage,
        computeInteraction: computeInteractions[currentStep],
        tableAnswer,
        onTableAnswer: handleTableAnswer,
        onTableSubmit: handleTableSubmit,
        computeStepIndex,
        computeMCQAnswers,
        onComputeMCQAnswer: handleComputeMCQAnswer,
        onHighlightClick: handleHighlightClick,
        currentFlowStep: currentStep,
      });
    } else if (flowStep.type === "summary") {
      return h(ComputeScreen, {
        stage: flowStep.stage,
        isSummary: true,
      });
    }
    return null;
  };

  // Render header with tabs
  const renderHeader = () => {
    const flowStep = getCurrentFlowStep();
    return h(Header, {
      question: T.problem.question,
      tabs: T.ui.tabs,
      activeTab: getCurrentTab(),
      onTabClick: handleTabClick,
      maxStep: maxStep,
      currentStep: currentStep,
      step: getCurrentTab(),
      stageData: flowStep?.stage,
    });
  };

  // Get instruction text for lower panel
  const getInstruction = () => {
    const flowStep = getCurrentFlowStep();
    if (!flowStep) return "";

    if (flowStep.type === "comprehend") {
      if (flowStep.stage.type === "showPyramid") {
        if (videoPlayed) {
          return T.ui.instructions.tapToContinue;
        }
        return flowStep.stage.instruction;
      }
      if (flowStep.stage.type === "showLabelled") {
        return flowStep.stage.instruction;
      }
      return T.ui.instructions.tapToContinue;
    } else if (flowStep.type === "connect") {
      const selected = connectAnswers[currentStep];
      if (selected === flowStep.stage.correctAnswer) {
        // Use custom nextInstruction if defined, otherwise use default
        return (
          flowStep.stage.nextInstruction || T.ui.instructions.tapToContinue
        );
      }
      return T.ui.instructions.tapCorrectOption;
    } else if (flowStep.type === "compute") {
      if (flowStep.stage.type === "findBTable") {
        if (computeInteractions[currentStep]) {
          // Use custom nextInstruction if defined, otherwise use default
          return (
            flowStep.stage.nextInstruction || T.ui.instructions.tapToContinue
          );
        }
        return T.ui.instructions.useNumpad;
      } else if (
        flowStep.stage.type === "findBResult" ||
        flowStep.stage.type === "findAreaCompute4"
      ) {
        // Use custom nextInstruction if defined, otherwise use instruction, then default
        return (
          flowStep.stage.nextInstruction ||
          flowStep.stage.instruction ||
          T.ui.instructions.tapToContinue
        );
      } else if (flowStep.stage.steps) {
        // Check if all steps are complete
        if (computeInteractions[currentStep]) {
          // Check for nextInstruction at stage level first, then default
          return (
            flowStep.stage.nextInstruction || T.ui.instructions.tapToContinue
          );
        }
        const currentStepData = flowStep.stage.steps[computeStepIndex];
        if (!currentStepData) return "";
        // Check if current step is completed (answer is correct)
        const stepAnswerKey = `${currentStep}_${computeStepIndex}`;
        const stepSelected = computeMCQAnswers[stepAnswerKey];
        const stepFilled =
          stepSelected !== undefined &&
          stepSelected === currentStepData.mcq?.correctAnswer;
        // If step is completed and has nextInstruction, show it
        if (stepFilled && currentStepData.nextInstruction) {
          return currentStepData.nextInstruction;
        }
        // If step is completed but no nextInstruction, check stage level
        if (stepFilled) {
          return (
            flowStep.stage.nextInstruction || T.ui.instructions.tapToContinue
          );
        }
        // Step not completed yet - show appropriate instruction
        if (currentStepData.highlightText) {
          return T.ui.instructions.tapHighlightedBox;
        } else if (currentStepData.mcq) {
          return T.ui.instructions.tapCorrectOption;
        }
        return flowStep.stage.instruction;
      }
      return flowStep.stage.instruction || "";
    } else if (flowStep.type === "summary") {
      return flowStep.stage.instruction || T.ui.instructions.activityComplete;
    }
    return "";
  };

  const stageClasses = ["step-comprehend", "step-connect", "step-compute"];

  return h(
    "div",
    { className: `applet-container ${stageClasses[getCurrentTab()]}` },
    renderHeader(),
    h("div", { className: "main-content" }, renderMainContent()),
    h(
      Navigation,
      {
        onBack: handleBack,
        onNext: handleNext,
        step: getCurrentTab(),
        subStep: currentStep,
        totalSteps: 3,
        subStepsCount: T.flow.length,
        nextLabel: T.ui.navigation.next,
        disabled: isNextDisabled() || getCurrentFlowStep()?.type === "summary",
      },
      h("div", {
        className: "lower-text",
        dangerouslySetInnerHTML: { __html: getInstruction() },
      })
    )
  );
};
