const AngleSlider = ({ value, min, max, step, disabled, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;

  const handleInput = (e) => {
    if (disabled) return;
    const next = parseInt(e.target.value, 10);
    if (typeof onChange === "function") onChange(next);
  };

  return React.createElement(
    "div",
    { className: "angle-slider-wrap" },
    React.createElement(
      "div",
      {
        className: "angle-slider-track" + (disabled ? " is-disabled" : ""),
        style: { "--pct": pct },
      },
      React.createElement("div", { className: "angle-slider-track-bg" }),
      React.createElement(
        "div",
        { className: "angle-slider-thumb" },
        value + "°",
      ),
      React.createElement("input", {
        type: "range",
        className: "angle-range-input",
        min: min,
        max: max,
        step: step,
        value: value,
        disabled: disabled,
        onInput: handleInput,
        onChange: handleInput,
      }),
    ),
  );
};
