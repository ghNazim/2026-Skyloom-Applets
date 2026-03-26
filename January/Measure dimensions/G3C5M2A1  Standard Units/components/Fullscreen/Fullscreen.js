const Button = ({ onClick, text, className, id }) => {
  return React.createElement(
    "button",
    {
      className: `btn ${className || ""}`,
      onClick: onClick,
      id,
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
  isFinal = false,
  imageSrc,
  buttonId,
}) => {
  const hasTwoColumns = isFinal && imageSrc;
  const contentArea = hasTwoColumns
    ? React.createElement(
        "div",
        { className: "fullscreen-two-column" },
        React.createElement("div", { className: "fullscreen-image-col" },
          React.createElement("img", { src: imageSrc, alt: "", className: "fullscreen-final-image" })
        ),
        React.createElement("div", {
          className: "fullscreen-text-col fullscreen-content center",
          dangerouslySetInnerHTML: { __html: text },
        })
      )
    : React.createElement("p", {
        className: "fullscreen-content " + (left ? "left" : "center"),
        dangerouslySetInnerHTML: { __html: text },
      });
  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    contentArea,
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
      id: buttonId,
    })
  );
};
