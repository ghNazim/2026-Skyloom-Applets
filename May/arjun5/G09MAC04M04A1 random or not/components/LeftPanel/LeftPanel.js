const LeftPanel = ({ children, className = "" }) => {
  const e = React.createElement;

  return e(
    "div",
    { className: `left-panel ${className}`.trim() },
    children,
  );
};
