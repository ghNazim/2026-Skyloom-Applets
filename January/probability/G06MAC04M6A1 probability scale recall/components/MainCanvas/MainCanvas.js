const MainCanvas = ({ step }) => {
  return React.createElement(
    "div",
    { className: "main-canvas" },

    React.createElement(
      "div",
      { className: "main-row" },
      React.createElement(Scale, { step: step })
    ),

    React.createElement(
      "div",
      { className: "text-row" },

      React.createElement("div", {
        className: "left-text",
        dangerouslySetInnerHTML: { __html: APP_DATA.leftText },
      }),

      React.createElement("div", {
        className: "right-text",
        dangerouslySetInnerHTML: {
          __html: APP_DATA.rightTextArray[step - 1],
        },
      })
    )
  );
};
