const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextSymbol = "»",
  nextButtonRef,
  showNextNudge = false,
}) => {
  const localNextRef = React.useRef(null);
  const nextRef = nextButtonRef || localNextRef;

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
      "«"
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
