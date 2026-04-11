var Splash2 = function () {
  var d = APP_DATA.splash2;

  var children = [
    React.createElement("h2", {
      key: "h",
      className: "splash2-heading",
    }, d.heading),
    React.createElement(
      "div",
      { key: "s", className: "splash2-scale-wrap" },
      React.createElement(Scalebg, {
        columns: d.scaleColumns,
        imageSrcs: d.visualImages,
      })
    ),
  ];

  if (d.arrowLeftLabel) {
    children.push(
      React.createElement(
        "div",
        { key: "arrow", className: "splash2-arrow-block" },
        React.createElement(
          "div",
          { className: "splash2-arrow-row" },
          React.createElement("div", { className: "splash2-arrow-head" }),
          React.createElement("div", { className: "splash2-arrow-shaft" })
        ),
        React.createElement(
          "div",
          { className: "splash2-arrow-labels" },
          React.createElement(
            "span",
            { className: "splash2-arrow-label splash2-arrow-label--left" },
            d.arrowLeftLabel
          ),
          React.createElement(
            "span",
            { className: "splash2-arrow-label splash2-arrow-label--right" },
            d.arrowRightLabel
          )
        )
      )
    );
  }

  children.push(
    React.createElement("div", {
      key: "t",
      className: "splash2-text-box",
      dangerouslySetInnerHTML: { __html: d.summaryHtml },
    })
  );

  return React.createElement("div", { className: "splash2-panel" }, children);
};
