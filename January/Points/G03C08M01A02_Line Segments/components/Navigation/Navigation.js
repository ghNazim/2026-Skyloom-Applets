const Navigation = ({
  onNav,
  isNextDisabled,
  isPrevDisabled,
  navText,
  nextButtonText,
  showTapGif,
}) => {
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
    React.createElement("div", { className: "nav-text" }, navText || ""),
    React.createElement(
      "div",
      {
        style: {
          position: "relative",
          display: "inline-block",
        },
      },
      React.createElement(
        "button",
        {
          className: "nav-chevron" + (nextButtonText ? " text-button" : ""),
          onClick: () => onNav("next"),
          disabled: isNextDisabled,
          id: "next-button",
        },
        nextButtonText || "»"
      ),
      // Show tap GIF on next button when needed
      showTapGif &&
        !isNextDisabled &&
        React.createElement("img", {
          src: "assets/tap.gif",
          alt: "Tap hint",
          className: "nav-tap-gif",
          style: {
            position: "absolute",
            top: "70%",
            left: "90%",
            transform: "translate(-50%, -50%)",
            width: "5vw",
            height: "5vw",
            pointerEvents: "none",
            zIndex: 10,
          },
        })
    )
  );
};
