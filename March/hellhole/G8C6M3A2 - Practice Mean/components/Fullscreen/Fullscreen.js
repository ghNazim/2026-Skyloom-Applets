const Button = ({ onClick, text, className, buttonRef }) => {
  return React.createElement(
    "button",
    {
      ref: buttonRef,
      className: `btn ${className || ""}`,
      onClick: onClick,
    },
    text,
  );
};
const Fullscreen = ({
  text,
  buttonText,
  onButtonClick,
  buttonRef,
  heading,
  formulaHtml = "",
  formulaPrefix = "",
  topText = "",
  bottomText = "",
  left = false,
  isFinal = false,
  summaryCards = [],
}) => {
  const finalTopText = topText || text || "";
  const finalBottomText = bottomText || "";

  const contentArea = React.createElement(
    "div",
    { className: "fullscreen-content-wrap" },
    React.createElement("p", {
      className: "fullscreen-content " + (left ? "left" : "center"),
      dangerouslySetInnerHTML: { __html: finalTopText },
    }),
    formulaHtml &&
      React.createElement(
        "div",
        { className: "fullscreen-formula" },
        React.createElement("span", { className: "formula-prefix" }, formulaPrefix),
        React.createElement("span", {
          dangerouslySetInnerHTML: { __html: formulaHtml },
        }),
      ),
    finalBottomText &&
      React.createElement("p", {
        className: "fullscreen-content center",
        dangerouslySetInnerHTML: { __html: finalBottomText },
      }),
    isFinal &&
      summaryCards.length > 0 &&
      React.createElement(
        "div",
        { className: "final-cards-row" },
        summaryCards.map((card, index) =>
          React.createElement(
            "div",
            { className: "final-summary-card", key: "final-summary-" + index },
            React.createElement(
              "div",
              { className: "final-summary-icon" },
              card.icon,
            ),
            React.createElement(
              "h3",
              { className: "final-summary-heading" },
              card.heading,
            ),
            React.createElement("p", {
              className: "final-summary-text",
              dangerouslySetInnerHTML: { __html: card.text },
            }),
          ),
        ),
      ),
  );

  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    contentArea,
    React.createElement(
      "div",
      { className: "fullscreen-button-wrap" },
      React.createElement(Button, {
        text: buttonText,
        onClick: onButtonClick,
        className: "fullscreen-button",
        buttonRef: buttonRef,
      }),
    ),
  );
};
