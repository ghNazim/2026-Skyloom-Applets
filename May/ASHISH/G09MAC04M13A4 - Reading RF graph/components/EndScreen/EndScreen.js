const EndScreen = ({ onStartOver, startOverButtonRef }) =>
  React.createElement(
    "div",
    { className: "end-screen" },
    React.createElement("h2", { className: "end-title" }, T.ui.endTitle),
    React.createElement(
      "div",
      { className: "end-content" },
      React.createElement("p", { className: "end-line" }, T.ui.endTeachLine),
      React.createElement("p", {
        className: "end-formula",
        dangerouslySetInnerHTML: { __html: T.ui.endFormula },
      }),
      React.createElement("p", { className: "end-line" }, T.ui.endWatchLine),
      React.createElement(
        "ul",
        { className: "end-rules" },
        React.createElement("li", {
          dangerouslySetInnerHTML: { __html: T.ui.endRuleUp },
        }),
        React.createElement("li", {
          dangerouslySetInnerHTML: { __html: T.ui.endRuleSame },
        })
      ),
      React.createElement("p", { className: "end-big-rule" }, T.ui.endBigRule)
    ),
    React.createElement(
      "button",
      {
        ref: startOverButtonRef,
        className: "start-over-button ftue-target",
        onClick: onStartOver,
      },
      T.ui.startOverButton
    )
  );
