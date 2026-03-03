const CalculateSummary = () => {
  var data = APP_DATA.calculateSummary;
  var calcData = APP_DATA.calculate;

  return React.createElement(
    "div",
    { className: "calc-summary-container" },

    React.createElement(
      "div",
      { className: "calc-summary-scale" },
      React.createElement(Scale, {
        allVisible: true,
        customImages: APP_DATA.scaleImages,
      })
    ),

    renderConditionsStrip(["correct", "correct", "correct"]),

    React.createElement("p", {
      className: "calc-summary-text",
      dangerouslySetInnerHTML: { __html: data.summaryText },
    }),

    React.createElement(
      "div",
      { className: "calc-summary-grid" },
      data.estimates.map(function (est, i) {
        return React.createElement("div", {
          key: i,
          className: "calc-summary-card",
          dangerouslySetInnerHTML: { __html: est },
        });
      })
    )
  );
};
