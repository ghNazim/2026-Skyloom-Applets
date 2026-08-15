const EndScreen = ({ onStartOver, startOverButtonRef }) => {
  const sondang = T.people.find((p) => p.id === "sondang");
  return React.createElement(
    "div",
    { className: "end-screen" },
    React.createElement("div", {
      className: "end-summary",
      dangerouslySetInnerHTML: { __html: T.ui.mistakeExplain },
    }),
    React.createElement(
      "div",
      { className: "end-table-wrap" },
      React.createElement(
        "table",
        { className: "end-table" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement("th", null, T.ui.trialCol),
            React.createElement("th", { dangerouslySetInnerHTML: { __html: T.ui.rfCol } }),
            React.createElement("th", { dangerouslySetInnerHTML: { __html: T.ui.freqCol } }),
            React.createElement("th", { dangerouslySetInnerHTML: { __html: T.ui.changeCol } })
          )
        ),
        React.createElement(
          "tbody",
          null,
          [1, 2, 3, 4, 5].map((trial, idx) =>
            React.createElement(
              "tr",
              { key: trial, className: idx === 4 ? "end-mistake-row" : "" },
              React.createElement("td", null, trial),
              React.createElement("td", null, sondang.rf[idx]),
              React.createElement("td", null, sondang.freq[idx]),
              React.createElement("td", null, sondang.changes[idx])
            )
          )
        )
      )
    ),
    React.createElement("p", { className: "tap-start-over-text" }, T.ui.instructionStartOver),
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
};
