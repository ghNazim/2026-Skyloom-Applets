const Numpad = ({ disabled = false, onNumberClick, onClear, onSubmit, layout = "3x4" }) => {
  const handleNumberClick = (num) => {
    if (!disabled) {
      if (typeof playSound === "function") playSound("click");
      else if (window.playSound) window.playSound("click");
      onNumberClick && onNumberClick(num);
    }
  };

  const handleClear = () => {
    if (!disabled) {
      if (typeof playSound === "function") playSound("click");
      else if (window.playSound) window.playSound("click");
      onClear && onClear();
    }
  };

  const handleSubmit = () => {
    if (!disabled) onSubmit && onSubmit();
  };

  if (layout === "2x6") {
    return React.createElement(
      "div",
      { className: `numpad-container ${disabled ? "disabled" : ""}` },
      React.createElement(
        "div",
        { className: "numpad-grid numpad-grid-2x6" },
        ["1", "2", "3", "4", "5"].map((num) =>
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
            key: "clear",
            className: "numpad-button clear-button",
            onClick: handleClear,
            disabled: disabled,
          },
          "⌫"
        ),
        ["6", "7", "8", "9", "0"].map((num) =>
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
            key: "submit",
            className: "numpad-button submit-button",
            onClick: handleSubmit,
            disabled: disabled,
          },
          "✓"
        )
      )
    );
  }

  return React.createElement(
    "div",
    { className: `numpad-container ${disabled ? "disabled" : ""}` },
    React.createElement(
      "div",
      { className: "numpad-grid" },
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) =>
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
};
