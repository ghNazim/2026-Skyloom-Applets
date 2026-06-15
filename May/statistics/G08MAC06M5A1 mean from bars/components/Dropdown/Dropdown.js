const Dropdown = ({
  id,
  theme,
  placeholder,
  value,
  options,
  disabled,
  locked,
  isOpen,
  wrongKey,
  buttonRef,
  onToggle,
  onSelect,
}) => {
  const e = React.createElement;
  var hasValue = value !== null && value !== undefined && value !== "";
  var isWrong = wrongKey && wrongKey.indexOf(id) === 0;
  var buttonClasses = [
    "custom-select-button",
    theme || "",
    disabled ? "disabled" : "",
    locked ? "locked" : "",
    isWrong ? "wrong" : "",
  ].join(" ");

  return e(
    "div",
    { className: "custom-select-wrap " + (theme || "") },
    e(
      "button",
      {
        type: "button",
        ref: buttonRef,
        className: buttonClasses,
        disabled: disabled || locked,
        onClick: function () {
          if (!disabled && !locked && onToggle) onToggle(id);
        },
      },
      e(
        "span",
        { className: hasValue ? "select-value" : "select-placeholder" },
        hasValue ? value : placeholder
      ),
      !locked
        ? e("span", { className: "select-arrow" }, isOpen ? "\u25B2" : "\u25BC")
        : null
    ),
    isOpen
      ? e(
          "div",
          { className: "custom-options" },
          options.map(function (option) {
            var optionWrong = wrongKey === id + "-" + option;
            return e(
              "button",
              {
                type: "button",
                className: "custom-option" + (optionWrong ? " wrong-option" : ""),
                key: id + "-option-" + option,
                onClick: function () {
                  if (onSelect) onSelect(option);
                },
              },
              option
            );
          })
        )
      : null
  );
};
