const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextButtonText = "\u00BB",
  navFadeIn = false,
  step,
}) => {
  const isTextButton = nextButtonText.length > 2;
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
      "\u00AB",
    ),
    React.createElement("div", {
      className: "nav-text-container" + (navFadeIn ? " panel-fade-in" : ""),
      style: step === 4 && !navText ? { opacity: 0 } : undefined,
      dangerouslySetInnerHTML: { __html: navText || "" },
    }),
    React.createElement(
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
