const Numpad = ({
  disabled = false,
  onNumberClick,
  onClear,
  onSubmit,
  playClickOnSubmit = true,
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

  const handleSubmit = () => {
    if (!disabled) {
      if (playClickOnSubmit) playSound("click");
      onSubmit && onSubmit();
    }
  };

  const ce = React.createElement;

  const numberButtons = buttons.map((num) =>
    ce("button", {
      key: num,
      className: "numpad-button",
      onClick: () => handleNumberClick(num),
      disabled: disabled,
    }, num)
  );

  const extraButtons = [
    ce("button", {
      key: "clear",
      className: "numpad-button clear-button",
      onClick: handleClear,
      disabled: disabled,
    }, "\u232B"),
    ce("button", {
      key: "zero",
      className: "numpad-button",
      onClick: () => handleNumberClick("0"),
      disabled: disabled,
    }, "0"),
    ce("button", {
      key: "submit",
      className: "numpad-button submit-button",
      onClick: handleSubmit,
      disabled: disabled,
    }, "\u2713")
  ];

  return ce("div",
    { className: "numpad-container" + (disabled ? " disabled" : "") },
    ce("div", { className: "numpad-grid" },
      numberButtons.concat(extraButtons)
    )
  );
};
