/**
 * Fullscreen-style intro before a question: mixed number box (40%) + text and Continue (60%).
 * No heading.
 */
const DecimalIntro = ({
  integerPart,
  decimalPoint,
  fractionalDigits,
  introText,
  buttonText,
  onContinue,
}) => {
  const handleClick = () => {
    playSound("click");
    if (typeof onContinue === "function") onContinue();
  };

  return React.createElement(
    "div",
    { className: "decimal-intro-panel" },
    React.createElement(
      "div",
      { className: "decimal-intro-left" },
      React.createElement(
        "div",
        { className: "mixed-number-box decimal-intro-box" },
        React.createElement("span", { className: "integer-part" }, integerPart),
        React.createElement("span", { className: "decimal-point" }, decimalPoint),
        React.createElement("span", { className: "fractional-digits" }, fractionalDigits)
      )
    ),
    React.createElement(
      "div",
      { className: "decimal-intro-right" },
      React.createElement("p", {
        className: "decimal-intro-text",
        dangerouslySetInnerHTML: { __html: introText || "Convert the decimal number<br>into a mixed number." },
      })
    ),
    React.createElement("button", {
      className: "btn fullscreen-button decimal-intro-button",
      onClick: handleClick,
    }, buttonText || "Continue")
  );
};
