const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextSymbol = "\u00bb",
}) => {
  var nextButtonRef = React.useRef(null);

  return React.createElement(
    "div",
    { className: "navigation" },
    React.createElement(
      "button",
      {
        className: "nav-chevron",
        onClick: function () { onNav("prev"); },
        disabled: isPrevDisabled,
      },
      "\u00ab"
    ),
    React.createElement("div", {
      className: "nav-text-container",
      dangerouslySetInnerHTML: { __html: navText || "" },
    }),
    React.createElement(
      "button",
      {
        ref: nextButtonRef,
        className: "nav-chevron",
        onClick: function () { onNav("next"); },
        disabled: isNextDisabled,
        id: "next-button",
      },
      nextSymbol
    ),
    React.createElement(Nudge, {
      targetRef: nextButtonRef,
      show: !isNextDisabled,
    })
  );
};
