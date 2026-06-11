const Fullscreen = ({
  text,
  buttonText,
  onButtonClick,
  heading,
  topContent,
  left = false,
  showNudge = true,
}) => {
  var useRef = React.useRef;
  var buttonRef = useRef(null);

  var contentArea = React.createElement(
    "div",
    { className: "fullscreen-content-wrap" },
    topContent || null,
    React.createElement("p", {
      className: "fullscreen-content " + (left ? "left" : "center"),
      dangerouslySetInnerHTML: { __html: text },
    })
  );

  return React.createElement(
    "div",
    { className: "fullscreen-panel" },
    React.createElement("p", { className: "heading" }, heading),
    contentArea,
    React.createElement(
      "button",
      {
        ref: buttonRef,
        type: "button",
        className: "btn fullscreen-button",
        onClick: onButtonClick,
      },
      buttonText
    ),
    React.createElement(Nudge, { targetRef: buttonRef, show: showNudge })
  );
};
