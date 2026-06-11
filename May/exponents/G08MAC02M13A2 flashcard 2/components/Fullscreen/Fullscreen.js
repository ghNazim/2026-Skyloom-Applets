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

const Fullscreen = ({ text, buttonText, onButtonClick, heading, left = false, isFinal = false, imageSrc }) => {
  const formattedText = text ? text.replace(/\n/g, "<br>") : "";

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
          dangerouslySetInnerHTML: { __html: formattedText },
        })
      )
    : React.createElement("p", {
        className: "fullscreen-content " + (left ? "left" : "center"),
        dangerouslySetInnerHTML: { __html: formattedText },
      });

  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    contentArea,
    React.createElement(
      "div",
      { className: "fullscreen-button-wrapper" },
      React.createElement(Button, {
        text: buttonText,
        onClick: onButtonClick,
      }),
      React.createElement("img", {
        src: "assets/tap.gif",
        className: "tap-nudge tap-nudge--fullscreen",
        alt: "",
      })
    )
  );
};
