const Numpad = ({
  disabled = false,
  submitLabel = "Submit",
  onNumberClick,
  onClear,
  onSqrt,
  onSubmit,
}) => {
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

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

  const handleSqrt = () => {
    if (!disabled) {
      playSound("click");
      onSqrt && onSqrt();
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
      buttons.map((num) =>
        React.createElement(
          "button",
          {
            key: num,
            className: "numpad-button",
            onClick: () => handleNumberClick(num),
            disabled: disabled,
          },
          num,
        ),
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button clear-button",
          onClick: handleClear,
          disabled: disabled,
        },
        "⌫",
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button",
          onClick: () => handleNumberClick("0"),
          disabled: disabled,
        },
        "0",
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button sqrt-button",
          onClick: handleSqrt,
          disabled: disabled,
        },
        "√",
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button submit-button numpad-submit-full",
          onClick: handleSubmit,
          disabled: disabled,
        },
        submitLabel,
      ),
    ),
  );
};
