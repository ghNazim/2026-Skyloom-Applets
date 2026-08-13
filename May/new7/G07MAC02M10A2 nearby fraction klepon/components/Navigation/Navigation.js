const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextButtonText = "\u00BB",
  hidePrev = false,
  hideNext = false,
  navFadeIn = false,
  navHidden = false,
  step,
}) => {
  const isTextButton = nextButtonText.length > 2;
  return React.createElement(
    "div",
    { className: "navigation" },
    hidePrev
      ? null
      : React.createElement(
          "button",
          {
            className: "nav-chevron",
            onClick: () => onNav("prev"),
            disabled: isPrevDisabled,
          },
          "\u00AB",
        ),
    React.createElement("div", {
      id: "nav-text",
      className: "nav-text-container" + (navFadeIn ? " panel-fade-in" : ""),
      style: navHidden ? { opacity: 0 } : undefined,
      dangerouslySetInnerHTML: { __html: navText || "" },
    }),
    hideNext
      ? React.createElement("div", { className: "nav-chevron-spacer" })
      : React.createElement(
          "button",
          {
            className: "nav-chevron" + (isTextButton ? " nav-text-button" : ""),
            onClick: () => onNav("next"),
            disabled: isNextDisabled,
            id: "next-button",
          },
          nextButtonText,
        ),
  );
};
