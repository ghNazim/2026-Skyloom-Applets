const NavigationBottom = ({ text }) => {
  return React.createElement(
    "div",
    { className: "navigation-bottom" },
    React.createElement("div", {
      className: "nav-text-container",
      dangerouslySetInnerHTML: { __html: text || "" },
    })
  );
};
