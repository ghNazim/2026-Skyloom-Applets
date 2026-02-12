const App = () => {
  const { useState, useEffect, useRef } = React;

  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [navText, setNavText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Step 1 specific state
  const [horizontalExplored, setHorizontalExplored] = useState(false);
  const [verticalExplored, setVerticalExplored] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [sliceAction, setSliceAction] = useState(null);
  const [sliceCounter, setSliceCounter] = useState(0);
  const [labelMode, setLabelMode] = useState("initial");

  // ---- Initialize step texts & state ----
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      setQuestionText(stepData.q);
      setNavText(stepData.n);
      setIsNextDisabled(true);
      setHorizontalExplored(false);
      setVerticalExplored(false);
      setSelectedButton(null);
      setSliceAction(null);
      setSliceCounter(0);
      setLabelMode("initial");
      setIsAnimating(false);
    }
  }, [currentStep]);

  // ---- Handlers ----
  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
  };

  const handleSlice = (type) => {
    if (isAnimating) return;
    if (typeof playSound === "function") playSound("click");
    setIsAnimating(true);
    setSelectedButton(type);
    setLabelMode("none");

    const newCounter = sliceCounter + 1;
    setSliceCounter(newCounter);
    setSliceAction({ type: type, key: newCounter });
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setLabelMode("hemispheres");
    setQuestionText(APP_DATA.steps[1].qAfterSlice);

    const newH = selectedButton === "horizontal" || horizontalExplored;
    const newV = selectedButton === "vertical" || verticalExplored;

    if (selectedButton === "horizontal") setHorizontalExplored(true);
    if (selectedButton === "vertical") setVerticalExplored(true);

    if (newH && newV) {
      setNavText("Tap » to summarise.");
      setIsNextDisabled(false);
    } else if (selectedButton === "horizontal") {
      setNavText(
        'Tap "' + APP_DATA.buttons.sliceVertically + '" to slice the sphere.'
      );
    } else {
      setNavText(
        'Tap "' +
          APP_DATA.buttons.sliceHorizontally +
          '" to slice the sphere.'
      );
    }
  };

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    // No prev navigation in this applet
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

  // ==== STEP 2: Final fullscreen ====
  if (currentStep === 2) {
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

  // ==== STEP 1: Main interactive layout ====
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
        sliceAction: sliceAction,
        labelMode: labelMode,
        isAnimating: isAnimating,
        selectedButton: selectedButton,
        horizontalExplored: horizontalExplored,
        verticalExplored: verticalExplored,
        onSlice: handleSlice,
        onAnimationComplete: handleAnimationComplete,
      })
    ),

    // Navigation
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: navText,
        nextSymbol: "»",
      })
    )
  );
};
