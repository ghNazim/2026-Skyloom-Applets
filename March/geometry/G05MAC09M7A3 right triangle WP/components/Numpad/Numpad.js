const Numpad = ({ disabled = false, onNumberClick, onClear, onSubmit, showDecimal = false }) => {
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

  const handleSubmit = () => {
    if (!disabled) {
      onSubmit && onSubmit();
    }
  };

  const bottomButtons = [];

  // Backspace
  bottomButtons.push(
    React.createElement(
      "button",
      {
        key: "clear",
        className: "numpad-button clear-button",
        onClick: handleClear,
        disabled: disabled,
      },
      "⌫"
    )
  );

  // Zero
  bottomButtons.push(
    React.createElement(
      "button",
      {
        key: "0",
        className: "numpad-button",
        onClick: () => handleNumberClick("0"),
        disabled: disabled,
      },
      "0"
    )
  );

  // Decimal button (only when showDecimal is true)
  if (showDecimal) {
    bottomButtons.push(
      React.createElement(
        "button",
        {
          key: "dot",
          className: "numpad-button decimal-button",
          onClick: () => handleNumberClick("."),
          disabled: disabled,
        },
        "."
      )
    );
    bottomButtons.push(
      React.createElement(
        "button",
        {
          key: "submit",
          className: "numpad-button submit-button full-width",
          onClick: handleSubmit,
          disabled: disabled,
        },
        "✓"
      )
    );
  } else {
    // Submit
    bottomButtons.push(
      React.createElement(
        "button",
        {
          key: "submit",
          className: "numpad-button submit-button",
          onClick: handleSubmit,
          disabled: disabled,
        },
        "✓"
      )
    );
  }

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
      ...bottomButtons
    )
  );
};
