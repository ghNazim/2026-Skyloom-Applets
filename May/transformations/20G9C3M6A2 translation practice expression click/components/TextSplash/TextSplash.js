const TextSplash = ({ heading, content }) => {
  return React.createElement(
    "div",
    { className: "textsplash-panel" },
    React.createElement("h2", { className: "textsplash-heading" }, heading),
    React.createElement("div", {
      className: "textsplash-content",
      dangerouslySetInnerHTML: { __html: content },
    }),
  );
};
