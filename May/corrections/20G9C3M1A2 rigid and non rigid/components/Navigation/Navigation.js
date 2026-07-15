const Navigation = ({ navText, buttonText, onButtonClick }) => {
  return React.createElement(
    "div",
    { className: "navigation" },
    buttonText
      ? React.createElement(
          "button",
          {
            className: "nav-action-button",
            onClick: onButtonClick,
          },
          buttonText
        )
      : React.createElement("div", {
          className: "nav-text-container",
          dangerouslySetInnerHTML: { __html: navText || "" },
        })
  );
};
