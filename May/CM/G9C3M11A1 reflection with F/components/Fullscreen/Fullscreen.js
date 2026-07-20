const Button = ({ onClick, text, className, id, disabled }) => {
  return React.createElement(
    "button",
    {
      className: `btn ${className || ""}`,
      onClick: onClick,
      id: id,
      disabled: disabled,
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
  summaryBox = false,
  imageSrc,
  buttonId,
  textLeft = false,
}) => {
  const renderedText = summaryBox
    ? renderFinishTextHtml(handleComma(text))
    : text;

  const hasTwoColumns = isFinal && imageSrc;
  const hasTextLeftImageRight = textLeft && imageSrc;
  const contentArea = summaryBox
    ? React.createElement("div", {
        className: "fullscreen-summary-box",
        dangerouslySetInnerHTML: { __html: renderedText },
      })
    : hasTextLeftImageRight
      ? React.createElement(
          "div",
          { className: "fullscreen-two-column fullscreen-text-left" },
          React.createElement("div", {
            className: "fullscreen-text-col fullscreen-content center",
            dangerouslySetInnerHTML: { __html: text },
          }),
          React.createElement(
            "div",
            { className: "fullscreen-image-col" },
            React.createElement("img", {
              src: imageSrc,
              alt: "",
              className: "fullscreen-final-image",
            }),
          ),
        )
      : hasTwoColumns
        ? React.createElement(
            "div",
            { className: "fullscreen-two-column" },
            React.createElement(
              "div",
              { className: "fullscreen-image-col" },
              React.createElement("img", {
                src: imageSrc,
                alt: "",
                className: "fullscreen-final-image",
              }),
            ),
            React.createElement("div", {
              className: "fullscreen-text-col fullscreen-content center",
              dangerouslySetInnerHTML: { __html: text },
            }),
          )
      : React.createElement("p", {
          className: "fullscreen-content " + (left ? "left" : "center"),
          dangerouslySetInnerHTML: { __html: text },
        });
  return React.createElement(
    "div",
    { className: "fullscreen-panel" + (summaryBox ? " finish-summary" : "") },
    heading
      ? React.createElement("p", { className: "heading" }, heading)
      : null,
    contentArea,
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "fullscreen-button",
      id: buttonId,
    })
  );
};
