const Navigation = ({
  buttonText,
  onButtonClick,
  isButtonDisabled,
  navText,
  navFeedbackType,
  showNudge,
}) => {
  var navTextClass = "nav-text-box";
  if (navFeedbackType === "correct") navTextClass += " nav-text--correct";
  else if (navFeedbackType === "incorrect")
    navTextClass += " nav-text--incorrect";

  return React.createElement(
    "div",
    { className: "navigation" },
    React.createElement(
      "div",
      { className: "nav-button-container" },
      React.createElement(
        "button",
        {
          className: "nav-button",
          onClick: onButtonClick,
          disabled: isButtonDisabled,
        },
        buttonText,
      ),
      showNudge &&
        React.createElement("img", {
          src: "assets/tap.gif",
          className: "tap-nudge tap-nudge--nav",
          alt: "",
        }),
    ),
    React.createElement("div", {
      className: navTextClass,
      dangerouslySetInnerHTML: {
        __html: "" + (navText ? "<p>" + navText + "</p>" : ""),
      },
    }),
  );
};
