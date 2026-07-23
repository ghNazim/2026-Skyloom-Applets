const Numpad = ({
  disabled = false,
  keys,
  clearLabel = "Clear",
  submitLabel = "Submit",
  plusLabel = "Plus",
  minusLabel = "Minus",
  onValue,
  onClear,
  onSubmit,
  onNumberClick,
  onBackspace,
}) => {
  const padKeys = keys || ["1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "0", "-", "clear", "submit"];

  const pressValue = (value) => {
    if (disabled) return;
    if (typeof playSound === "function") playSound("click");
    if (onValue) onValue(value);
    else if (onNumberClick) onNumberClick(value);
  };

  const clear = () => {
    if (disabled) return;
    if (onClear) onClear();
    else if (onBackspace) onBackspace();
  };

  const submit = () => {
    if (disabled) return;
    if (typeof playSound === "function") playSound("click");
    onSubmit && onSubmit();
  };

  const labelFor = (key) => {
    if (key === "+") return plusLabel;
    if (key === "-") return minusLabel;
    if (key === "clear") return clearLabel;
    if (key === "submit") return submitLabel;
    return key;
  };

  const contentFor = (key) => {
    if (key === "clear") return "\u232b";
    if (key === "submit") return "\u2713";
    return key;
  };

  const classFor = (key) => {
    if (key === "clear") return "numpad-button clear-button";
    if (key === "submit") return "numpad-button submit-button";
    if (key === "+" || key === "-") return "numpad-button utility-button";
    if (key === "x'" || key === "y'") return "numpad-button variable-button";
    return "numpad-button digit-button";
  };

  return React.createElement(
    "div",
    { className: "numpad-container" + (disabled ? " disabled" : "") },
    React.createElement(
      "div",
      { className: "numpad-grid" },
      padKeys.map((key) =>
        React.createElement(
          "button",
          {
            key: key,
            type: "button",
            className: classFor(key),
            onClick: () => key === "clear" ? clear() : key === "submit" ? submit() : pressValue(key),
            disabled: disabled,
            "aria-label": labelFor(key),
          },
          contentFor(key),
        ),
      ),
    ),
  );
};
