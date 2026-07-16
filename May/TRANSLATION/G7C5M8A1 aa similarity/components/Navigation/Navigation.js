const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextButtonText = "\u00BB",
  hidePrev = false,
  centerButton = null,
}) => {
  const isTextButton = nextButtonText.length > 2;
  if (centerButton) {
    return React.createElement(
      "div",
      { className: "navigation navigation--center-only" },
      React.createElement(
        "button",
        {
          className: centerButton.className || "nav-center-button",
          onClick: centerButton.onClick,
          id: centerButton.id || "nav-center-button",
        },
        centerButton.text
      )
    );
  }
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
          "\u00AB"
        ),
    React.createElement("div", {
      className: "nav-text-container",
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
      nextButtonText
    )
  );
};
