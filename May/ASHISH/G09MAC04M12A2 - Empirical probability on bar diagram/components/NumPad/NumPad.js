const NumPad = ({ value, onChange, onSubmit, disabled, onKeyTap, freshStartOnNextKey = false }) => {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const handleKey = (key) => {
    if (disabled) return;
    if (onKeyTap) onKeyTap();
    if (freshStartOnNextKey || value === "?") onChange(key);
    else if (value.length < 2) onChange(`${value}${key}`);
  };

  const handleBackspace = () => {
    if (disabled) return;
    if (onKeyTap) onKeyTap();
    if (value === "?" || value.length <= 1) onChange("?");
    else onChange(value.slice(0, -1));
  };

  const handleSubmit = () => {
    if (disabled) return;
    if (onKeyTap) onKeyTap();
    onSubmit();
  };

  return React.createElement(
    "div",
    { className: "numpad-panel" },
    React.createElement(
      "div",
      { className: "numpad-grid" },
      keys.map((key) =>
        React.createElement(
          "button",
          {
            key,
            type: "button",
            className: "numpad-key",
            disabled: disabled,
            onClick: () => handleKey(key),
          },
          key
        )
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-key numpad-back",
          disabled: disabled,
          onClick: handleBackspace,
        },
        "⌫"
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-submit",
          disabled: disabled,
          onClick: handleSubmit,
        },
        "✓"
      )
    )
  );
};
