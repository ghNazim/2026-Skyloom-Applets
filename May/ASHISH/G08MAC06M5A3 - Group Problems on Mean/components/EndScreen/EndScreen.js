const EndScreen = ({ onStartOver, startOverButtonRef }) => {
  return React.createElement(
    "div",
    { className: "welcome-screen end-screen fade-in" },
    React.createElement("h1", { className: "welcome-title" }, T.ui.endTitle),
    React.createElement("p", {
      className: "welcome-message",
      dangerouslySetInnerHTML: { __html: T.ui.endMessage },
    }),
    React.createElement(
      "p",
      { className: "tap-start-text" },
      T.ui.instructionStartOver,
    ),
    React.createElement(
      "button",
      {
        ref: startOverButtonRef,
        className: "start-button start-over-button ftue-target",
        onClick: onStartOver,
      },
      T.ui.startOverButton,
    ),
  );
};
