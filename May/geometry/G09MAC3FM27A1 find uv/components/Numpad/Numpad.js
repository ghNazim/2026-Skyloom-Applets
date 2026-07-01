const Numpad = ({
  disabled = false,
  submitLabel = "\u2713",
  onNumberClick,
  onClear,
  onSubmit,
}) => {
  const digitButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const handleNumberClick = (num) => {
    if (!disabled) {
      playSound("click");
      onNumberClick && onNumberClick(num);
    }
  };

  const handleClear = () => {
    if (!disabled) {
      playSound("click");
      onClear && onClear();
    }
  };

  const handleSubmit = () => {
    if (!disabled) {
      playSound("click");
      onSubmit && onSubmit();
    }
  };

  return React.createElement(
    "div",
    { className: `numpad-container ${disabled ? "disabled" : ""}` },
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
            onClick: () => handleNumberClick(num),
            disabled: disabled,
          },
          num,
        ),
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button digit-button",
          onClick: () => handleNumberClick("0"),
          disabled: disabled,
        },
        "0",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button clear-button",
          onClick: handleClear,
          disabled: disabled,
          "aria-label": "Clear",
        },
        "\u232B",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "numpad-button submit-button",
          onClick: handleSubmit,
          disabled: disabled,
          "aria-label": "Submit",
        },
        submitLabel,
      ),
    ),
  );
};
