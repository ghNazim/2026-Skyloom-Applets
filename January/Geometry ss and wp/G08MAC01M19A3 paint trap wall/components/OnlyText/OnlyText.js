/**
 * OnlyText: displays a single info text block centered in the panel.
 */
const OnlyText = ({ text }) => {
  return React.createElement(
    "div",
    { className: "only-text-panel" },
    React.createElement("p", { className: "only-text-content", dangerouslySetInnerHTML: { __html: text } })
  );
};
