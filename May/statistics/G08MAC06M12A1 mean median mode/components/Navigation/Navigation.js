const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  showNextNudge = false,
  nextSymbol = "\u00bb",
}) => {
  const nextButtonRef = React.useRef(null);

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
        ref: nextButtonRef,
        className: "nav-chevron",
        onClick: () => onNav("next"),
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextSymbol
    ),
    React.createElement(Nudge, {
      targetRef: nextButtonRef,
      show: showNextNudge,
    })
  );
};
