const Problem = () => {
  const data = APP_DATA.problem;

  return React.createElement(
    "div",
    { className: "problem-layout" },
    React.createElement(
      "div",
      { className: "problem-recipe-column" },
      React.createElement(RecipePaper, {
        highlightIndex: 0,
        fadedExceptIndex: 0,
      }),
    ),
    React.createElement(
      "div",
      { className: "problem-card" },
      React.createElement("div", {
        className: "problem-line problem-line-main",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(data.line1) },
      }),
      React.createElement("div", {
        className: "problem-line",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(data.line2) },
      }),
      React.createElement(
        "div",
        { className: "measure-cup-row" },
        data.cups.map((cup, index) =>
          React.createElement("div", {
            key: index,
            className: "measure-cup-box",
            dangerouslySetInnerHTML: { __html: formatFractionsInText(cup.label) },
          }),
        ),
      ),
      React.createElement("div", {
        className: "problem-prompt",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(data.prompt) },
      }),
    ),
  );
};
