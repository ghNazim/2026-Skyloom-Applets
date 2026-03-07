const MainCanvas = ({ step }) => {
  const stepImage = `assets/${step}x.png`;

  return React.createElement(
    "div",
    { className: "main-canvas" },

    React.createElement(
      "div",
      { className: "text-row-above-scale" },
      React.createElement(
        "div",
        { className: "left-text" },

        React.createElement("span", {
          className: "left-text-content",
          dangerouslySetInnerHTML: { __html: APP_DATA.leftText },
        }),
      ),
    ),

    React.createElement(
      "div",
      { className: "main-row" },
      React.createElement(Scale, { step: step }),
    ),

    React.createElement(
      "div",
      { className: "text-row" },

      React.createElement(
        "div",
        {
          className: "left-text",
         
        },
        React.createElement("img", {
          src: stepImage,
          className: "left-text-image",
          alt: "",
          draggable: false,
        }),
      ),

      React.createElement("div", {
        className: "right-text",
        dangerouslySetInnerHTML: {
          __html: APP_DATA.rightTextArray[step - 1],
        },
      }),
    ),
  );
};
