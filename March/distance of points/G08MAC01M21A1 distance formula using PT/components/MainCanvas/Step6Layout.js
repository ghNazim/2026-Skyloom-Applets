/**
 * Step 6 – split layout: grid left (like step 5), problem card right.
 */
const Step6Layout = (props) => {
  const { svgElement, problemTitle, problemStatement, continueLabel, onContinue } =
    props;

  return React.createElement(
    "div",
    {
      className:
        "main-canvas-container distance-applet-canvas s4-split-layout s6-step-layout",
    },
    React.createElement(
      "div",
      { className: "s4-grid-wrapper s4-grid-shifted" },
      React.createElement(
        "div",
        { className: "single-svg-canvas s4-svg-inner" },
        svgElement,
      ),
    ),
    React.createElement(
      "div",
      { className: "s6-problem-panel" },
      React.createElement(
        "div",
        { className: "s6-problem-pill" },
        problemTitle,
      ),
      React.createElement(
        "div",
        { className: "s6-problem-statement" },
        problemStatement,
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "s6-continue-btn",
          onClick: () => {
            if (typeof playSound === "function") playSound("click");
            if (typeof onContinue === "function") onContinue();
          },
        },
        continueLabel,
      ),
    ),
  );
};
