const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextSymbol = "»",
}) => {
  var isTextBtn = nextSymbol && nextSymbol.length > 2;
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
        className: "nav-chevron" + (isTextBtn ? " nav-text-btn" : ""),
        onClick: () => onNav("next"),
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextSymbol
    )
  );
};
