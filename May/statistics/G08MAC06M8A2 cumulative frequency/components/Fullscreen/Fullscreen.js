const Button = ({ onClick, text, className, buttonRef }) => {
  return React.createElement(
    "button",
    {
      ref: buttonRef,
      className: `btn ${className || ""}`,
      onClick: onClick,
    },
    text
  );
};
const Fullscreen = ({
  text,
  buttonText,
  onButtonClick,
  heading,
  left = false,
  isFinal = false,
  summaryCards = [],
  buttonRef,
}) => {
  const contentArea = React.createElement(
    "div",
    { className: "fullscreen-content-wrap" },
    React.createElement("p", {
      className: "fullscreen-content " + (left ? "left" : "center"),
      dangerouslySetInnerHTML: { __html: text },
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
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
      buttonRef: buttonRef,
    })
  );
};
