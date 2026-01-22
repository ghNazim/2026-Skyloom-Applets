const FractionPanel = ({
  step,
  showPercentBox,
  showFractionBox,
  showDecimalBox,
  percentValue,
  showBlinkingCursor,
  boxState,  // 'default', 'correct', 'wrong'
  showLabels,
}) => {
  const { useState, useEffect } = React;
  
  const percentLabel = APP_DATA.labels.percent;
  const fractionLabel = APP_DATA.labels.fraction;
  const decimalLabel = APP_DATA.labels.decimal;
  const partsText = APP_DATA.labels.partsOutOf100(percentValue || 0);
  
  // Calculate decimal value from percent
  const decimalValue = percentValue !== null && percentValue !== undefined
    ? (percentValue / 100).toFixed(2).replace(".", decimalSymbol)
    : `0${decimalSymbol}00`;
  
  // Get box class based on state
  const getBoxClass = (baseClass) => {
    let cls = baseClass;
    if (boxState === 'correct') cls += ' box-correct';
    if (boxState === 'wrong') cls += ' box-wrong shake';
    return cls;
  };
  
  // Render the decimal text above boxes
  const renderDecimalText = () => {
    // Add color class based on boxState in step 3
    let textClass = "decimal-text";
    if (step === 3) {
      if (boxState === 'correct') textClass += ' decimal-text-correct';
      if (boxState === 'wrong') textClass += ' decimal-text-wrong';
    }
    return React.createElement(
      "div",
      { className: textClass },
      partsText
    );
  };
  
  // Render percent box: "7%"
  const renderPercentBox = () => {
    return React.createElement(
      "div",
      { className: "fraction-block-wrapper" },
      showLabels && React.createElement(
        "div",
        { className: "label-box label-percent" },
        percentLabel
      ),
      React.createElement(
        "div",
        { className: getBoxClass("box percent-box") },
        React.createElement(
          "span",
          { className: "percent-number" },
          showBlinkingCursor && (percentValue === 0 || percentValue === null)
            ? React.createElement("span", { className: "blinking-cursor" })
            : percentValue
        ),
        React.createElement("span", { className: "percent-symbol" }, "%")
      )
    );
  };
  
  // Render fraction box: "7/100"
  const renderFractionBox = () => {
    return React.createElement(
      "div",
      { className: "fraction-block-wrapper" },
      showLabels && React.createElement(
        "div",
        { className: "label-box label-fraction" },
        fractionLabel
      ),
      React.createElement(
        "div",
        { className: "box fraction-box" },
        React.createElement(
          "div",
          { className: "fraction-display fraction-display-col" },
          React.createElement("span", null, percentValue || 0),
          React.createElement("div", { className: "fraction-line" }),
          React.createElement("span", null, "100")
        )
      )
    );
  };
  
  // Render decimal box: "0.07"
  const renderDecimalBox = () => {
    return React.createElement(
      "div",
      { className: "fraction-block-wrapper" },
      showLabels && React.createElement(
        "div",
        { className: "label-box label-decimal" },
        decimalLabel
      ),
      React.createElement(
        "div",
        { className: getBoxClass("box decimal-box"), 
          dangerouslySetInnerHTML: { __html: handleComma(decimalValue) }
         },
        // decimalValue
      )
    );
  };
  
  // Don't render if nothing to show
  if (!showPercentBox && !showFractionBox && !showDecimalBox) {
    return null;
  }
  
  return React.createElement(
    "div",
    { className: "fractions-panel-content" },
    renderDecimalText(),
    React.createElement(
      "div",
      { className: "equation-row" },
      showPercentBox && renderPercentBox(),
      showFractionBox && React.createElement("div", { className: "equal-sign" }, "="),
      showFractionBox && renderFractionBox(),
      showDecimalBox && React.createElement("div", { className: "equal-sign" }, "="),
      showDecimalBox && renderDecimalBox()
    )
  );
};
