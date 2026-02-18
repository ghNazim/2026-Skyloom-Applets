const MainCanvas = ({ navText, setNavText, feedbackText, setFeedbackText }) => {
  const { useState } = React;

  // Step states: 0 = initial, 1 = AB base shown, 2 = AB height shown, 3 = BC base shown, 
  // 4 = BC height shown, 5 = AC base shown, 7 = AC height shown + restart
  const [step, setStep] = useState(0);
  const [showTapBase, setShowTapBase] = useState(true);
  const [showTapHeight, setShowTapHeight] = useState(false);

  // Determine which frame image to show based on step
  const getFrameImage = () => {
    let frameNumber;
    if (step === 0) {
      frameNumber = 1; // Initial triangle, no highlights
    } else if (step === 1) {
      frameNumber = 2; // AB base highlighted
    } else if (step === 2) {
      frameNumber = 3; // AB height shown
    } else if (step === 3) {
      frameNumber = 4; // BC base highlighted
    } else if (step === 4) {
      frameNumber = 5; // BC height shown
    } else if (step === 5) {
      frameNumber = 6; // AC base highlighted
    } else if (step === 7) {
      frameNumber = 7; // AC height shown + restart
    } else {
      frameNumber = 1; // default
    }

    // Handle language-specific images
    const langSuffix = (typeof current_language !== "undefined" && current_language === "id") ? " id" : "";
    return `assets/Frame ${frameNumber}${langSuffix}.svg`;
  };

  const handleBaseClick = () => {
    playSound("click");
    setShowTapBase(false);
    
    if (step === 0) {
      // Step 1: Show AB base
      setStep(1);
      // Nav text stays as "Tap on the button to highlight pair 1."
      setFeedbackText(APP_DATA.feedback.baseSelected);
      setShowTapHeight(true);
    } else if (step === 2) {
      // Step 3: Show BC base
      setStep(3);
      
      setFeedbackText(APP_DATA.feedback.baseSelected);
      setShowTapHeight(true);
    } else if (step === 4) {
      // Step 5: Show AC base
      setStep(5);
      
      setFeedbackText(APP_DATA.feedback.baseSelected);
      setShowTapHeight(true);
    }
  };

  const handleHeightClick = () => {
    playSound("click");
    setShowTapHeight(false);
    
    if (step === 1) {
      // Step 2: Show AB height
      setNavText(APP_DATA.nav.pair2);
      setStep(2);
      setFeedbackText(APP_DATA.feedback.heightSelected);
      setShowTapBase(true);
    } else if (step === 3) {
      // Step 4: Show BC height
      setNavText(APP_DATA.nav.pair3);
      setStep(4);
      setFeedbackText(APP_DATA.feedback.heightSelected);
      setShowTapBase(true);
    } else if (step === 5) {
      // Step 7: Show AC height and restart (final step uses frame 7)
      setStep(7);
      setFeedbackText(APP_DATA.feedback.heightSelected);
      setNavText(APP_DATA.nav.restart);
      setShowTapBase(false);
      setShowTapHeight(false);
    }
  };

  const handleRestartClick = () => {
    playSound("click");
    setStep(0);
    setNavText(APP_DATA.initial.n);
    setFeedbackText("");
    setShowTapBase(true);
    setShowTapHeight(false);
  };

  const isBaseEnabled = (step === 0 || step === 2 || step === 4) && step !== 7;
  const isHeightEnabled = (step === 1 || step === 3 || step === 5) && step !== 7;
  const showRestart = step === 7;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    
    // Visual Row (75% height)
    React.createElement(
      "div",
      { className: "visual-row" },
      
      // Left Column - Buttons (40% width)
      React.createElement(
        "div",
        { className: "button-column" },
        React.createElement(
          "div",
          { className: "button-container" },
          React.createElement("button", {
            className: `base-height-btn base-btn ${!isBaseEnabled ? "disabled" : ""}`,
            onClick: handleBaseClick,
            disabled: !isBaseEnabled,
            style: { position: "relative" }
          },
            React.createElement("span", null, APP_DATA.buttons.base),
            showTapBase && isBaseEnabled && React.createElement("img", {
              src: "assets/tap.gif",
              className: "tap-indicator",
              alt: ""
            })
          ),
          React.createElement("button", {
            className: `base-height-btn height-btn ${!isHeightEnabled ? "disabled" : ""}`,
            onClick: handleHeightClick,
            disabled: !isHeightEnabled,
            style: { position: "relative" }
          },
            React.createElement("span", null, APP_DATA.buttons.height),
            showTapHeight && isHeightEnabled && React.createElement("img", {
              src: "assets/tap.gif",
              className: "tap-indicator",
              alt: ""
            })
          ),
          showRestart && React.createElement("button", {
            className: "base-height-btn restart-btn",
            onClick: handleRestartClick,
            style: { position: "relative" }
          },
            React.createElement("span", null, APP_DATA.buttons.restart),
            React.createElement("img", {
              src: "assets/tap.gif",
              className: "tap-indicator",
              alt: ""
            })
          )
        )
      ),

      // Right Column - Frame Image (60% width)
      React.createElement(
        "div",
        { className: "grid-column" },
        React.createElement("img", {
          src: getFrameImage(),
          alt: "Triangle base-height pair visualization",
          className: "frame-image"
        })
      )
    ),

    // Action Row (25% height) - Feedback text only
    React.createElement(
      "div",
      { className: "action-row" },
      step>0 && React.createElement("div", { className: "feedback-text" , dangerouslySetInnerHTML: { __html: feedbackText } }))
    )
  
};
