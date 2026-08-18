const NumPad = ({ value, onChange, onSubmit, disabled, resetOnNextKey }) => {
  const topKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-"];

  const handleKey = (key) => {
    if (disabled) return;
    const shouldReset = resetOnNextKey && key !== "⌫";
    const currentValue = shouldReset ? "?" : value;

    if (key === "⌫") {
      if (currentValue === "?" || currentValue.length <= 1) onChange("?");
      else onChange(currentValue.slice(0, -1));
      return;
    }
    if (key === "+" || key === "-") {
      const digits =
        currentValue === "?" ? "" : currentValue.replace(/[+-]/g, "").slice(0, 1);
      onChange(`${key}${digits}`);
      return;
    }
    const nextValue = currentValue === "?" ? key : `${currentValue}${key}`;
    if (nextValue.length > 2) return;
    onChange(nextValue);
  };

  return React.createElement(
    "div",
    { className: "numpad-panel" },
    React.createElement(
      "div",
      { className: "numpad-grid" },
      topKeys.map((key) =>
        React.createElement(
          "button",
          {
            key,
            type: "button",
            className: `numpad-key ${key === "+" ? "numpad-key--plus" : ""} ${key === "-" ? "numpad-key--minus" : ""}`,
            disabled,
            onClick: () => handleKey(key),
          },
          key
        )
      )
    ),
    React.createElement(
      "div",
      { className: "numpad-bottom-row" },
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-key numpad-key--backspace",
          disabled,
          onClick: () => handleKey("⌫"),
        },
        "⌫"
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-submit",
          disabled,
          onClick: onSubmit,
        },
        "✓"
      )
    )
  );
};
