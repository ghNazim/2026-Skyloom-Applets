const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextButtonText,
  nextButtonRef,
}) => {
  return React.createElement(
    "div",
    { className: "navigation-wrapper" },

    React.createElement(
      "div",
      { className: "navigation" + (nextButtonText ? " navigation-wide-next" : "") },
      React.createElement(
        "button",
        {
          className: "nav-chevron",
          onClick: () => onNav("prev"),
          disabled: isPrevDisabled,
        },
        "\u00AB"
      ),
      React.createElement("div", { className: "nav-text" }, navText),
      React.createElement(
        "button",
        {
          ref: nextButtonRef,
          className: "nav-chevron" + (nextButtonText ? " nav-chevron-wide" : ""),
          onClick: () => onNav("next"),
          disabled: isNextDisabled,
          id: "next-button",
        },
        nextButtonText || "\u00BB"
      )
    )
  );
};
