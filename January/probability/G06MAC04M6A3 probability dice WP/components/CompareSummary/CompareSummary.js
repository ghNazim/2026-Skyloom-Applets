const CompareSummary = ({ onContinue }) => {
  const data = APP_DATA.compareSummary;
  const compareData = APP_DATA.compare.compareData;

  return React.createElement(
    "div",
    { className: "compare-summary-panel" },

    React.createElement("p", { className: "cs-heading" }, data.heading),

    React.createElement(
      "div",
      { className: "cs-scale-wrapper" },
      React.createElement(Scale, {
        allVisible: true,
        customImages: APP_DATA.scaleImages,
      })
    ),

    React.createElement("p", {
      className: "cs-conditions-text",
      dangerouslySetInnerHTML: { __html: data.conditionsText },
    }),

    React.createElement(
      "div",
      { className: "cs-conditions-box" },

      React.createElement("div", {
        className: "cs-condition-card",
        dangerouslySetInnerHTML: { __html: data.conditionLeft },
      }),

      compareData.map((item, i) =>
        React.createElement(
          "div",
          { key: i, className: "cs-condition-card cs-condition-compare" },
          React.createElement("img", {
            src: item.img1,
            className: "cs-ball",
            draggable: false,
          }),
          React.createElement(
            "span",
            { className: "cs-operator" },
            item.correctOperator
          ),
          React.createElement("img", {
            src: item.img2,
            className: "cs-ball",
            draggable: false,
          })
        )
      )
    ),

    React.createElement(Button, {
      text: data.buttonText,
      onClick: onContinue,
      className: "cs-button",
    })
  );
};
