const Splash = ({ onButtonClick }) => {
  const splashData = APP_DATA.splash;

  return React.createElement(
    "div",
    { className: "splash-panel" },
    React.createElement(
      "div",
      { className: "splash-content" },
      // Left Column - Equation Box
      React.createElement(
        "div",
        { className: "splash-equation-box" },
        // Percent display
        React.createElement(
          "div",
          { className: "splash-percent-display" },
          React.createElement(
            "span",
            { className: "splash-percent-number" },
            splashData.leftText
          ),
          React.createElement(
            "span",
            { className: "splash-percent-symbol" },
            splashData.percentSymbol
          )
        ),
        // Equals sign
        React.createElement(
          "span",
          { className: "splash-equals" },
          splashData.equals
        ),
        // Fraction display
        React.createElement(
          "div",
          { className: "splash-fraction" },
          React.createElement(
            "span",
            { className: "splash-numerator" },
            splashData.numerator
          ),
          React.createElement("div", { className: "splash-fraction-line" }),
          React.createElement(
            "span",
            { className: "splash-denominator" },
            splashData.denominator
          )
        )
      ),
      // Right Column - Text
      React.createElement(
        "div",
        { className: "splash-right-text" },
        splashData.rightText
      )
    ),
    // Button
    React.createElement(
      "button",
      {
        className: "btn splash-button",
        onClick: onButtonClick,
      },
      splashData.buttonText
    )
  );
};
