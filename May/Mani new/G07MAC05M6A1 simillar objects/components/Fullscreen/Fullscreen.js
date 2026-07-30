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
  table = null,
  showNudge = false,
}) => {
  const contentArea = React.createElement(
    "div",
    { className: "fullscreen-content-wrap" },
    text &&
      React.createElement("p", {
        className: "fullscreen-content " + (left ? "left" : "center"),
        dangerouslySetInnerHTML: { __html: text },
      }),
    isFinal &&
      table &&
      React.createElement(
        "div",
        { className: "final-table-wrap" },
        React.createElement(
          "table",
          { className: "final-summary-table" },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              table.headers.map((header, index) =>
                React.createElement("th", {
                  key: "final-header-" + index,
                  dangerouslySetInnerHTML: { __html: header },
                }),
              ),
            ),
          ),
          React.createElement(
            "tbody",
            null,
            table.rows.map((row, rowIndex) =>
              React.createElement(
                "tr",
                { key: "final-row-" + rowIndex },
                row.map((cell, cellIndex) =>
                  React.createElement("td", { key: "final-cell-" + cellIndex }, cell),
                ),
              ),
            ),
          ),
        ),
      ),
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
    }),
    showNudge &&
      React.createElement("img", {
        src: "assets/tap.gif",
        alt: "",
        className: "tap-nudge fullscreen-tap-nudge",
      })
  );
};
