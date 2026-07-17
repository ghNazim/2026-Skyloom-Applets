const Problem = ({ ingredientIndex = 0, estimates = {} }) => {
  const data = APP_DATA.problem;
  const flow = APP_DATA.ingredientFlows[ingredientIndex];
  const tools = flow.tools || data.cups;
  const line2 = flow.problemLine2 || data.line2;
  const prompt = flow.prompt || data.prompt;

  return React.createElement(
    "div",
    { className: "problem-layout" },
    React.createElement(
      "div",
      { className: "problem-recipe-column" },
      React.createElement(RecipePaper, {
        highlightIndex: flow.itemIndex,
        fadedExceptIndex: flow.itemIndex,
        estimates,
      }),
    ),
    React.createElement(
      "div",
      { className: "problem-card" },
      React.createElement("div", {
        className: "problem-line problem-line-main",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(flow.problemLine) },
      }),
      React.createElement("div", {
        className: "problem-line",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(line2) },
      }),
      React.createElement(
        "div",
        {
          className: "measure-cup-row",
          style: {
            gridTemplateColumns: `repeat(${tools.length}, minmax(0, 1fr))`,
            width: tools.length === 2 ? "48%" : "100%",
          },
        },
        tools.map((cup, index) =>
          React.createElement("div", {
            key: index,
            className: "measure-cup-box",
            dangerouslySetInnerHTML: { __html: formatFractionsInText(cup.label) },
          }),
        ),
      ),
      React.createElement("div", {
        className: "problem-prompt",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(prompt) },
      }),
    ),
  );
};
