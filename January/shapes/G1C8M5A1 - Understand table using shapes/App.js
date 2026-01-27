const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleNext = () => {
    playSound("click");
    setCurrentStep(prev => prev + 1);
  };

  const handleOK = () => {
    playSound("click");
    // Interactions will be defined later
  };

  const handleReset = () => {
    playSound("click");
    // Interactions will be defined later
  };

  // Step 0: Start Fullscreen
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

  const stepData = APP_DATA.steps[currentStep];

  // Step 1: With Character Layout
  if (stepData && stepData.layout === "with-character") {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "with-character-layout" },
        React.createElement(CharacterPanel, {
          characterImage: stepData.characterImage,
          characterText: stepData.characterText,
        }),
        React.createElement(ContentPanel, {
          mainVisualLeft: React.createElement("img", {
            src: "assets/scrambled.svg",
            alt: "Scrambled shapes",
          }),
          mainVisualRight: React.createElement(ShapesTable, {
            title: "Shapes Table",
            headers: stepData.tableData.headers,
            rows: stepData.tableData.rows,
          }),
          buttonText: "Next",
          onButtonClick: handleNext,
          bottomText: stepData.bottomText,
        })
      )
    );
  }

  // Step 2: Without Character Layout
  if (stepData && stepData.layout === "without-character") {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "without-character-layout" },
        React.createElement(QuestionPanelTop, {
          text: stepData.questionText,
        }),
        React.createElement(AppMainContentMiddle, {
          svgLeft: React.createElement("div", {
            dangerouslySetInnerHTML: { __html: house_svg },
          }),
          svgRight: React.createElement("div", {
            dangerouslySetInnerHTML: { __html: scrambled_svg },
          }),
          tableComponent: React.createElement(ShapesTable, {
            title: "Shapes Table",
            headers: stepData.tableData.headers,
            rows: stepData.tableData.rows,
          }),
          instructionRow: "",
          buttonsRow: React.createElement(
            React.Fragment,
            null,
            React.createElement(Button, {
              text: "OK",
              onClick: handleOK,
              className: "action-button",
            }),
            React.createElement(Button, {
              text: "Reset",
              onClick: handleReset,
              className: "action-button",
              disabled: true,
            }),
            React.createElement(Button, {
              text: "Next",
              onClick: handleNext,
              className: "action-button",
              disabled: true,
            })
          ),
        }),
        React.createElement(NavigationBottom, {
          text: stepData.navText,
        })
      )
    );
  }

  return null;
};
