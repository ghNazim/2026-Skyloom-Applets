const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  totalDots,
  currentDot,
  nextButtonRef,
}) => {
  return React.createElement(
    "div",
    { className: "navigation-wrapper" },

    React.createElement(
      "div",
      { className: "navigation" },
      React.createElement(
        "button",
        {
          className: "nav-chevron",
          onClick: () => onNav("prev"),
          disabled: isPrevDisabled,
        },
        "«",
      ),
      // React.createElement(Pagination, {
      //   totalDots: totalDots,
      //   currentDot: currentDot,
      // }),
      React.createElement("div", { className: "nav-text" }, navText),
      React.createElement(
        "button",
        {
          ref: nextButtonRef,
          className: "nav-chevron",
          onClick: () => onNav("next"),
          disabled: isNextDisabled,
          id: "next-button",
        },
        "»",
      ),
    ),
  );
};
