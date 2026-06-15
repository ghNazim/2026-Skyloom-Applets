const Numpad = ({ disabled = false, onNumberClick, onClear, onSubmit }) => {
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

  const e = React.createElement;

  return e(
    "div",
    { className: "numpad-container " + (disabled ? "disabled" : "") },
    e(
      "div",
      { className: "numpad-grid" },
      ["1", "2", "3", "4", "5"].map(function (num) {
        return e(
          "button",
          { key: num, className: "numpad-button", onClick: function () { handleNumberClick(num); }, disabled: disabled },
          num
        );
      }),
      e("button", { key: "submit", className: "numpad-button submit-button", onClick: handleSubmit, disabled: disabled }, "\u2713"),
      ["6", "7", "8", "9", "0"].map(function (num) {
        return e(
          "button",
          { key: num, className: "numpad-button", onClick: function () { handleNumberClick(num); }, disabled: disabled },
          num
        );
      }),
      e("button", { key: "clear", className: "numpad-button clear-button", onClick: handleClear, disabled: disabled }, "\u232B")
    )
  );
};
