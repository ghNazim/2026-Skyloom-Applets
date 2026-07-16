const ApplyTranslationPanel = ({ onApply, disabled }) => {
  const t = APP_DATA.applyPanel;
  return React.createElement(
    "div",
    { className: "apply-translation-panel" },
    React.createElement("p", { className: "apply-translation-text" }, t.text),
    React.createElement(
      "button",
      {
        className: "apply-translation-btn",
        id: "apply-translation-btn",
        disabled: disabled,
        onClick: onApply,
      },
      t.buttonText,
    ),
  );
};
