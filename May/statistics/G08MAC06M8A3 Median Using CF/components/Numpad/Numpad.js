const Numpad = ({ disabled = false, onNumberClick, onClear, onSubmit }) => {
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const handleNumberClick = (num) => {
    if (!disabled) {
      playSound("click");
      onNumberClick && onNumberClick(num);
    }
  };

  const handleClear = () => {
    if (!disabled) {
      onClear && onClear();
    }
  };

  const handleSubmit = () => {
    if (!disabled) {
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
        "\u232b"
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
        "\u2713"
      )
    )
  );
};
