

const FinalScreen = ({ text, onPrevious, onStartOver, heading, buttonTextPrevious, buttonTextStartOver }) => {
  return React.createElement(
    "div",
    { className: "final-screen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    React.createElement(
      "div",
      { className: "final-screen-content" },
      // Left column with image
      React.createElement(
        "div",
        { className: "final-screen-left-column" },
        React.createElement(
          "div",
          { className: "final-screen-image-container" },
          React.createElement("img", {
            src: `assets/final${current_language}.png`,
            alt: "Final",
            draggable: false,
            className: "final-screen-image",
          })
        )
      ),
      // Right column with text
      React.createElement(
        "div",
        { className: "final-screen-right-column" },
        React.createElement("p", {
          className: "final-screen-text",
          dangerouslySetInnerHTML: { __html: text },
        })
      )
    ),
    // Previous button (bottom left)
    React.createElement(Button, {
      text: buttonTextPrevious,
      onClick: onPrevious,
      className: "final-screen-button final-screen-button-previous",
    }),
    // Start Over button (bottom right)
    React.createElement(Button, {
      text: buttonTextStartOver,
      onClick: onStartOver,
      className: "final-screen-button final-screen-button-start-over",
    })
  );
};
