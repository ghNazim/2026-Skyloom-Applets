const MainCanvas = ({
  step,
  currentObject,
  onSelectObject,
  dropProgress = 0,
  onDropProgressChange,
  completedObjects,
  calculationSubstep,
  visibleCalculationLines,
}) => {
  const { useState } = React;

  // Render object selection cards
  const renderObjectCards = () => {
    const objects = ["coconut", "pumpkin", "watermelon"];

    return React.createElement(
      "div",
      { className: "object-cards-container" },
      objects.map((obj) => {
        const isSelected = currentObject === obj;
        const isCompleted = completedObjects && completedObjects.includes(obj);
        const isDisabled =
          isCompleted || (currentObject && currentObject !== obj);

        return React.createElement(
          "div",
          {
            key: obj,
            className: `object-card ${isSelected ? "selected" : ""} ${
              isDisabled ? "disabled" : ""
            } ${isCompleted ? "completed" : ""}`,
            onClick: () => {
              if (!isDisabled && !currentObject) {
                if (typeof playSound === "function") playSound("click");
                onSelectObject(obj);
              }
            },
          },
          React.createElement("img", {
            src: `assets/${obj}.png`,
            alt: obj,
            className: "object-card-image",
          }),
          isCompleted &&
            React.createElement(
              "div",
              { className: "completed-checkmark" },
              "✓"
            )
        );
      })
    );
  };

  // Render calculation text rows
  const renderCalculationTexts = () => {
    if (!currentObject || step !== 2) return null;

    const texts = APP_DATA.calculationTexts[currentObject];
    if (!texts) return null;

    return React.createElement(
      "div",
      { className: "calculation-container" },
      texts.slice(0, visibleCalculationLines).map((text, index) =>
        React.createElement(
          "div",
          {
            key: index,
            className: `calculation-row ${
              index === visibleCalculationLines - 1 ? "new" : ""
            }`,
            dangerouslySetInnerHTML: { __html: text },
          },
          // text
        )
      )
    );
  };

  // Step 1: Show SVG canvas + slider + Object cards
  if (step === 1) {
    return React.createElement(
      "div",
      { className: "main-canvas-container main-canvas-sink" },
      // Left column - SVG Canvas (50%) + slider
      React.createElement(
        "div",
        { className: "column canvas-column" },
        React.createElement(SvgCanvas, {
          currentObject: currentObject,
          dropProgress: dropProgress,
        }),
        currentObject &&
          React.createElement(
            "div",
            { className: "sink-slider-wrapper" },
            React.createElement("input", {
              type: "range",
              min: 0,
              max: 1,
              step: 0.01,
              value: dropProgress,
              className: "sink-slider",
              onChange: (e) =>
                onDropProgressChange &&
                onDropProgressChange(parseFloat(e.target.value)),
            })
          )
      ),
      // Right column - Object cards (50%)
      React.createElement(
        "div",
        { className: "column action-column" },
        renderObjectCards()
      )
    );
  }

  // Step 2: Show SVG canvas + Calculation texts (no slider)
  if (step === 2) {
    return React.createElement(
      "div",
      { className: "main-canvas-container main-canvas-sink" },
      // Left column - SVG Canvas (50%)
      React.createElement(
        "div",
        { className: "column canvas-column" },
        React.createElement(SvgCanvas, {
          step: 2,
          currentObject: currentObject,
          dropProgress: 1,
        })
      ),
      // Right column - Calculation texts (50%)
      React.createElement(
        "div",
        { className: "column action-column" },
        renderCalculationTexts()
      )
    );
  }

  return null;
};
