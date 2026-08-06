const SummaryFinalScreen = ({ texts, onStartOver }) => {
  const renderVar = (name) =>
    React.createElement("span", { className: "summary-math-var" }, name);

  const renderOp = (text) =>
    React.createElement("span", { className: "summary-eq-token summary-eq-gap" }, text);

  const renderTerm = (text, color) => {
    const classes = ["summary-eq-token"];
    if (color === "yellow") classes.push("is-color-yellow");
    if (color === "pink") classes.push("is-color-pink");
    if (color === "orange") classes.push("is-color-orange");
    return React.createElement("span", { className: classes.join(" ") }, text);
  };

  const renderGroup = (varName, minusLetter, minusColor) =>
    React.createElement(
      "span",
      { className: "summary-eq-group is-bracketed" },
      React.createElement("span", { className: "summary-eq-bracket is-left" }, "("),
      React.createElement(
        "span",
        { className: "summary-eq-group-inner" },
        renderVar(varName),
        renderTerm("− " + minusLetter, minusColor),
      ),
      React.createElement("span", { className: "summary-eq-bracket is-right" }, ")"),
    );

  return React.createElement(
    "div",
    { className: "summary-final-screen" },
    React.createElement(
      "h1",
      { className: "summary-final-heading" },
      texts.heading,
    ),
    React.createElement(
      "div",
      { className: "summary-final-equations" },
      React.createElement(
        "div",
        { className: "summary-final-eq-box" },
        React.createElement(
          "span",
          { className: "summary-eq-inner" },
          renderVar("x"),
          renderOp("+"),
          renderVar("y"),
          renderOp("="),
          renderTerm("c", "yellow"),
        ),
      ),
      React.createElement(
        "div",
        { className: "summary-final-arrow-block" },
        React.createElement(
          "span",
          { className: "summary-final-arrow-label-top" },
          texts.translatesLabel,
        ),
        React.createElement(
          "div",
          { className: "summary-final-arrow-row" },
          React.createElement("div", { className: "summary-final-arrow-line" }),
          React.createElement("div", { className: "summary-final-arrow-head" }),
        ),
        React.createElement(
          "span",
          { className: "summary-final-arrow-coords" },
          "(",
          React.createElement("span", { className: "summary-coord-pink" }, "+ a"),
          ", ",
          React.createElement("span", { className: "summary-coord-orange" }, "+ b"),
          ")",
        ),
      ),
      React.createElement(
        "div",
        { className: "summary-final-eq-box is-wide" },
        React.createElement(
          "span",
          { className: "summary-eq-inner" },
          renderGroup("x", "a", "pink"),
          renderOp("+"),
          renderGroup("y", "b", "orange"),
          renderOp("="),
          renderTerm("c", "yellow"),
        ),
      ),
    ),
    React.createElement("div", {
      className: "summary-final-rule-box",
      dangerouslySetInnerHTML: { __html: texts.ruleText },
    }),
    React.createElement(
      "button",
      {
        type: "button",
        className: "summary-final-btn",
        id: "start-over-button",
        onClick: () => {
          if (typeof playSound === "function") playSound("click");
          onStartOver();
        },
      },
      texts.buttonText,
    ),
  );
};
