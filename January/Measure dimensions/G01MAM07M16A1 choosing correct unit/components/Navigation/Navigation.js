const Navigation = ({ onNav, isNextDisabled, isPrevDisabled, navText, nextSymbol = "»", nextButtonRef = null }) => {
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
    React.createElement(
      "div",
      { className: "nav-text-container" },
      navText || ""
    ),
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
    )
  );
};
