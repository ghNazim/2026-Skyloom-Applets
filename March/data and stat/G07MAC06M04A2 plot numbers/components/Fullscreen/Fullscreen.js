const Button = ({ onClick, text, className }) => {
  return React.createElement(
    "button",
    {
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
  rightContent = null,
  topContent = null,
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
    { className: `fullscreen-panel ${rightContent ? "split-layout" : ""}` },
    React.createElement("p", { className: "heading" }, heading),
    rightContent
      ? React.createElement(
          "div",
          { className: "fullscreen-split-container" },
          React.createElement(
            "div",
            { className: "fullscreen-left-pane" },
            contentArea
          ),
          React.createElement(
            "div",
            { className: "fullscreen-right-pane" },
            rightContent
          )
        )
      : React.createElement(
          "div",
          { className: "fullscreen-single-container" },
          topContent &&
            React.createElement(
              "div",
              { className: "fullscreen-top-content" },
              topContent
            ),
          contentArea
        ),
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
    })
  );
};
