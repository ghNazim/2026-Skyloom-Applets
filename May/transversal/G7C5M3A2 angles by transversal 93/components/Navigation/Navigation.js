const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextSymbol = "»",
  nextLabel,
  hidePrev = false,
}) => {
  return React.createElement(
    "div",
    { className: "navigation" },
    hidePrev ? null : React.createElement(
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
        className: `nav-chevron${nextLabel ? " nav-chevron--label" : ""}`,
        onClick: () => onNav("next"),
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextLabel || nextSymbol
    )
  );
};
