const Button = ({ onClick, text, className }) => {
  return React.createElement(
    "button",
    {
      className: `btn ${className || ""}`,
      onClick: onClick,
    },
    text
  );
};

const Fullscreen = ({
  text,
  buttonText,
  onButtonClick,
  heading,
  left = false,
  imageSrc,
}) => {
  const renderBody = () => {
    if (imageSrc) {
      return React.createElement(
        "div",
        { className: "fullscreen-two-column" },
        React.createElement(
          "div",
          { className: "fullscreen-image-col" },
          React.createElement("img", {
            src: imageSrc,
            alt: "",
            className: "fullscreen-start-image",
          })
        ),
        React.createElement(
          "div",
          { className: "fullscreen-text-col" },
          React.createElement("div", {
            className: "fullscreen-content left",
            dangerouslySetInnerHTML: { __html: text },
          })
        )
      );
    }

    return React.createElement("p", {
      className: "fullscreen-content " + (left ? "left" : "center"),
      dangerouslySetInnerHTML: { __html: text },
    });
  };

  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    React.createElement("div", { className: "fullscreen-body" }, renderBody()),
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
    })
  );
};
