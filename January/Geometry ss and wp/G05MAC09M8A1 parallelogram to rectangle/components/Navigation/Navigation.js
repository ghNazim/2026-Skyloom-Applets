const Navigation = ({ navText }) => {
  return React.createElement(
    "div",
    { className: "navigation" },
    React.createElement("div", {
      className: "nav-text-container",
      dangerouslySetInnerHTML: { __html: navText || "" },
    })
  );
};
