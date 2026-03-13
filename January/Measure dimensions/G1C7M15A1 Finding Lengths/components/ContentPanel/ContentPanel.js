const ContentPanel = ({ children, step, contentRef }) => {
  return React.createElement(
    "div",
    { ref: contentRef, className: "content-panel" + (step === 1 ? " step1" : "") },
    children,
  );
};
