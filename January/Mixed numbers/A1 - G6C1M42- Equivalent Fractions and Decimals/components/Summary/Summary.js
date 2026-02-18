const Summary = ({ question, onContinue }) => {
  if (!question) return null;

  const q = question;
  // Get common text/data
  const steps = APP_DATA.summaryCardTexts || [];
  
  // Replace dynamic values in step descriptions
  const step1Text = steps[0] ? steps[0].replace("{{targetDen}}", q.targetDenominator) : "";
  const step2Text = steps[1] || "";

  // Helper for subheading
  const subheading = APP_DATA.summarySubheading 
    ? APP_DATA.summarySubheading.replace("{{targetDen}}", q.targetDenominator) 
    : "";

  // The operation symbol (x or ÷)
  const opSymbol = q.operationSymbol; 
  // Wait, the images show 'x'. For division questions (30/60 -> 5/10), it will use '÷'. 
  // My previous code handled this via q.operationSymbol.

  // Render Functions

  // 1. Initial Fraction (Card 1)
  const renderCard1 = () => {
    return React.createElement(
      "div",
      { className: "summary-card" },
      React.createElement(
        "div",
        { className: "summary-fraction" },
        React.createElement("div", { className: "summary-fraction-num text-white" }, q.numerator),
        React.createElement("div", { className: "summary-fraction-line" }),
        React.createElement("div", { className: "summary-fraction-den text-white" }, q.denominator)
      )
    );
  };

  // 2. Operation Step (Card 2)
  const renderCard2 = () => {
    // Left side: 2 x 2 / 5 x 2
    // Right side: = 4 / 10

    // Colors:
    // Numerator op/mult: purple
    // Denominator op/mult: orange
    // Result Numerator: purple
    // Result Denominator: orange
    
    // Note: The base number (2 and 5) seem to be white in the image for the left side
    // and the multiplier and operator are colored.
    // Let's assume:
    // Num: [2 (white)] [x 2 (purple)]
    // Den: [5 (white)] [x 2 (orange)]

    return React.createElement(
      "div",
      { className: "summary-card summary-card-wide" },
      // Left Fraction: Operation
      React.createElement(
        "div",
        { className: "summary-fraction" },
        React.createElement(
          "div",
          { className: "summary-fraction-num" },
          React.createElement("span", { className: "text-white" }, q.numerator),
          React.createElement("span", { className: "text-purple" }, opSymbol + q.multiplier)
        ),
        React.createElement("div", { className: "summary-fraction-line" }),
        React.createElement(
          "div",
          { className: "summary-fraction-den" },
          React.createElement("span", { className: "text-white" }, q.denominator),
          React.createElement("span", { className: "text-orange" }, opSymbol + q.multiplier)
        )
      ),
      // Equals
      React.createElement("div", { className: "fraction-eq-sign" }, "="),
      // Right Fraction: Result
      React.createElement(
        "div",
        { className: "summary-fraction" },
        React.createElement("div", { className: "summary-fraction-num text-purple" }, q.convertedNumerator),
        React.createElement("div", { className: "summary-fraction-line" }),
        React.createElement("div", { className: "summary-fraction-den text-orange" }, q.convertedDenominator)
      )
    );
  };

  // 3. Final Decimal (Card 3)
  const renderCard3 = () => {
    // 0.4 -> 0 (white) . (pink) 4 (skyblue)
    const valStr = String(q.decimalValue);
    const parts = valStr.split(".");
    const whole = parts[0];
    const decimal = parts[1] || "";

    return React.createElement(
      "div",
      { className: "summary-card" },
      React.createElement(
        "div",
        { className: "summary-final-decimal" },
        React.createElement("span", { className: "text-white" }, whole),
        React.createElement("span", { className: "text-pink decimal-point" }, "."),
        React.createElement("span", { className: "text-skyblue" }, decimal)
      )
    );
  };

  // Step Bubble & Text
  const renderStepInfo = (num, text) => {
    return React.createElement(
      "div",
      { className: "summary-step-container" },
       React.createElement(
        "div",
        { className: "summary-step-text-box" },
        text
      ),
      React.createElement(
        "div",
        { className: "summary-step-bubble" },
        num
      )
    );
  };

  return React.createElement(
    "div",
    { className: "summary-panel" },
    React.createElement(
      "p",
      { className: "summary-subheading text-orange" },
      subheading
    ),
    React.createElement(
      "div",
      { className: "summary-layout" },
      // Col 1: Original
      React.createElement(
        "div",
         { className: "summary-column" },
         renderCard1()
      ),
      // Arrow
      React.createElement(
        "div",
        { className: "summary-arrow" },
        "→"
      ),
      // Col 2: Operation (Center)
      React.createElement(
        "div",
         { className: "summary-column" },
         renderCard2(),
         renderStepInfo(1, step1Text)
      ),
      // Arrow
       React.createElement(
        "div",
        { className: "summary-arrow" },
        "→"
      ),
      // Col 3: Result
      React.createElement(
         "div",
         { className: "summary-column" },
         renderCard3(),
         renderStepInfo(2, step2Text)
      )
    ),
    React.createElement(
      "button",
      {
        className: "btn fullscreen-button summary-continue-btn",
        onClick: () => {
          playSound("click");
          if (typeof onContinue === "function") onContinue();
        },
      },
      APP_DATA.summaryContinueButton
    )
  );
};
