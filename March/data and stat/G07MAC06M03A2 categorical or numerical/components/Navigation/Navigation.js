const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  showPrev = true,
  nextSymbol = "»",
  nextBtnClass = "",
}) => {
  return React.createElement(
    "div",
    { className: "navigation" },
    showPrev
      ? React.createElement(
          "button",
          {
            className: "nav-chevron",
            onClick: () => onNav("prev"),
            disabled: isPrevDisabled,
          },
          "«"
        )
      : React.createElement("div", { className: "nav-spacer" }),
    React.createElement("div", {
      className: "nav-text-container",
      dangerouslySetInnerHTML: { __html: navText || "" },
    }),
    React.createElement(
      "button",
      {
        className: `nav-chevron ${nextBtnClass}`.trim(),
        onClick: () => onNav("next"),
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextSymbol
    )
  );
};
