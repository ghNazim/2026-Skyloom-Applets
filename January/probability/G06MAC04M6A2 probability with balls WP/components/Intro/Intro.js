const Intro = ({ heading, image, text, buttonText, onButtonClick }) => {
  return React.createElement(
    "div",
    { className: "intro-panel" },

    React.createElement("p", { className: "intro-heading" }, heading),

    React.createElement(
      "div",
      { className: "intro-body" },

      React.createElement(
        "div",
        { className: "intro-left" },
        React.createElement("img", {
          src: image,
          className: "intro-image",
          alt: "intro",
          draggable: false,
        })
      ),

      React.createElement(
        "div",
        { className: "intro-right" },
        React.createElement("p", {
          className: "intro-text",
          dangerouslySetInnerHTML: { __html: text },
        }),
        React.createElement(Button, {
          text: buttonText,
          onClick: onButtonClick,
          className: "intro-button",
        })
      )
    )
  );
};
