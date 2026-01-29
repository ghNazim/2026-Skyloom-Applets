const Numpad = ({ 
  disabled = false, 
  onNumberClick, 
  onDecimalClick, 
  onClear, 
  onSubmit,
  showDecimal = false 
}) => {
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const handleNumberClick = (num) => {
    if (!disabled) {
      playSound("click");
      onNumberClick && onNumberClick(num);
    }
  };

  const handleDecimalClick = () => {
    if (!disabled) {
      playSound("click");
      onDecimalClick && onDecimalClick();
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
      onSubmit && onSubmit();
    }
  };

  // Standard numpad without decimal
  if (!showDecimal) {
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
            num
          )
        ),
        React.createElement(
          "button",
          {
            className: "numpad-button clear-button",
            onClick: handleClear,
            disabled: disabled,
          },
          "⌫"
        ),
        React.createElement(
          "button",
          {
            className: "numpad-button",
            onClick: () => handleNumberClick("0"),
            disabled: disabled,
          },
          "0"
        ),
        React.createElement(
          "button",
          {
            className: "numpad-button submit-button",
            onClick: handleSubmit,
            disabled: disabled,
          },
          "✓"
        )
      )
    );
  }

  // Numpad with decimal button
  // Layout: 1-9, clear, 0, decimal, submit (spans full row)
  // Sequence: 1-9, then clear, 0, decimal, then submit button
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
          num
        )
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button clear-button",
          onClick: handleClear,
          disabled: disabled,
        },
        "⌫"
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button",
          onClick: () => handleNumberClick("0"),
          disabled: disabled,
        },
        "0"
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button decimal-button",
          onClick: handleDecimalClick,
          disabled: disabled,
        },
        decimalSymbol
      ),
      React.createElement(
        "button",
        {
          className: "numpad-button submit-button wide-submit",
          onClick: handleSubmit,
          disabled: disabled,
        },
        "✓"
      )
    )
  );
};
