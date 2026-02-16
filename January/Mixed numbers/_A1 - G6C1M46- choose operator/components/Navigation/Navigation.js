const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  totalDots,
  currentDot,
}) => {
  return React.createElement(
    "div",
    { className: "navigation-wrapper" },
    React.createElement("div", { className: "nav-text" }, navText),
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
        "«"
      ),
      React.createElement(Pagination, {
        totalDots: totalDots,
        currentDot: currentDot,
      }),
      React.createElement(
        "button",
        {
          className: "nav-chevron",
          onClick: () => onNav("next"),
          disabled: isNextDisabled,
          id: "next-button",
        },
        "»"
      )
    )
  );
};
