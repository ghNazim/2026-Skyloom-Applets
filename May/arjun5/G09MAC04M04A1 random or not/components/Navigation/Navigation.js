const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextSymbol = "\u00bb",
  nextButtonRef,
  showNextNudge = false,
  isFinalStep = false,
  startOverText = "Start Over",
  startOverButtonRef,
  showStartOverNudge = false,
  onStartOverNudgeDismiss,
  onRestart,
}) => {
  const localNextRef = React.useRef(null);
  const localStartOverRef = React.useRef(null);
  const nextRef = nextButtonRef || localNextRef;
  const startOverRef = startOverButtonRef || localStartOverRef;

  if (isFinalStep) {
    return React.createElement(
      "div",
      { className: "navigation final-navigation" },
      React.createElement(
        "button",
        {
          ref: startOverRef,
          className: "start-over-nav-button",
          onClick: onRestart,
        },
        startOverText
      ),
      React.createElement(Nudge, {
        targetRef: startOverRef,
        active: showStartOverNudge,
        onDismiss: onStartOverNudgeDismiss,
      })
    );
  }

  return React.createElement(
    "div",
    { className: "navigation" },
    React.createElement(
      "button",
      {
        className: "nav-chevron",
        onClick: () => onNav("prev"),
        disabled: isPrevDisabled,
      },
      "\u00ab"
    ),
    React.createElement("div", {
      className: "nav-text-container",
      dangerouslySetInnerHTML: { __html: navText || "" },
    }),
    React.createElement(
      "button",
      {
        ref: nextRef,
        className: "nav-chevron",
        onClick: () => onNav("next"),
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextSymbol
    ),
    React.createElement(Nudge, {
      targetRef: nextRef,
      active: showNextNudge,
    })
  );
};
