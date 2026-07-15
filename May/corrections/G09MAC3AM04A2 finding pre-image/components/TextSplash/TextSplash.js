const TextSplash = ({ content }) => {
  return React.createElement(
    "div",
    { className: "textsplash-panel" },
    React.createElement("div", {
      className: "textsplash-content",
      dangerouslySetInnerHTML: { __html: content },
    }),
  );
};
