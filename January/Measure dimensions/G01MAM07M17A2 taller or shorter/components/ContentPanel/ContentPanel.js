const ContentPanel = ({ children, step }) => {
  return React.createElement(
    "div",
    { className: "content-panel" + (step === 1 ? " step1" : "") },
    children,
  );
};
