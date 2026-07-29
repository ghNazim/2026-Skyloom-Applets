const Numpad = ({
  disabled = false,
  submitLabel = "Enter",
  backspaceLabel = "Backspace",
  plusLabel = "Plus",
  minusLabel = "Minus",
  onNumberClick,
  onBackspace,
  onSubmit,
}) => {
  const digitButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const press = (value) => {
    if (disabled) return;
    if (typeof playSound === "function") playSound("click");
    onNumberClick && onNumberClick(value);
  };

  const backspace = () => {
    if (disabled) return;
    if (typeof playSound === "function") playSound("click");
    onBackspace && onBackspace();
  };

  const submit = () => {
    if (disabled) return;
    if (typeof playSound === "function") playSound("click");
    onSubmit && onSubmit();
  };

  return React.createElement(
    "div",
    { className: "numpad-container" + (disabled ? " disabled" : "") },
    React.createElement(
      "div",
      { className: "numpad-grid" },
      digitButtons.map((num) =>
        React.createElement(
          "button",
          {
            key: num,
            type: "button",
            className: "numpad-button digit-button",
            onClick: () => press(num),
            disabled: disabled,
          },
          num,
        ),
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button utility-button",
          onClick: () => press("+"),
          disabled: disabled,
          "aria-label": plusLabel,
        },
        "+",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button digit-button",
          onClick: () => press("0"),
          disabled: disabled,
        },
        "0",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button utility-button",
          onClick: () => press("-"),
          disabled: disabled,
          "aria-label": minusLabel,
        },
        "-",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button backspace-button",
          onClick: backspace,
          disabled: disabled,
          "aria-label": backspaceLabel,
        },
        "\u232b",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button submit-button",
          onClick: submit,
          disabled: disabled,
        },
        "✔",
      ),
    ),
  );
};
