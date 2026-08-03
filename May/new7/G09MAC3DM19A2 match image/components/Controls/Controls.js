const TOOL_COLORS = {
  rotate: "tool-rotate",
  reflect: "tool-reflect",
  translate: "tool-translate",
};

function formatCount(value) {
  if (value > 0) return "+" + value;
  return String(value);
}

const RotateControls = ({
  direction,
  sliderValue,
  sliderDisabled,
  controlsDisabled,
  showSliderPulse,
  enabledDirection,
  onDirection,
  onSliderChange,
  onSliderCommit,
}) => {
  const labels = APP_DATA.labels;
  const thumbPct = (sliderValue / 360) * 100;
  const sliderActive = !sliderDisabled && !controlsDisabled;
  return React.createElement(
    "div",
    { className: "rotate-controls" },
    React.createElement(
      "div",
      { className: "direction-stack" },
      React.createElement(
        "button",
        {
          id: "rotate-cw",
          className:
            "mini-control rotate-accent" +
            (direction === "cw" ? " is-selected" : ""),
          disabled: controlsDisabled || (enabledDirection && enabledDirection !== "cw"),
          onClick: function () {
            onDirection("cw");
          },
        },
        labels.cw,
      ),
      React.createElement(
        "button",
        {
          id: "rotate-acw",
          className:
            "mini-control rotate-accent" +
            (direction === "acw" ? " is-selected" : ""),
          disabled: controlsDisabled || (enabledDirection && enabledDirection !== "acw"),
          onClick: function () {
            onDirection("acw");
          },
        },
        labels.acw,
      ),
    ),
    React.createElement(
      "div",
      { id: "rotate-slider-wrap", className: "slider-wrap" },
      React.createElement(
        "div",
        { className: "degree-slider-shell" },
        React.createElement("div", { className: "degree-slider-track" }),
        React.createElement("div", {
          className: "degree-slider-track-active",
          style: { width: thumbPct + "%" },
        }),
        [0, 90, 180, 270, 360].map(function (value) {
          return React.createElement("span", {
            key: "dot-" + value,
            className: "degree-slider-dot" + (sliderValue >= value ? " is-passed" : ""),
            style: { left: (value / 360) * 100 + "%" },
          });
        }),
        React.createElement(
          "div",
          {
            className:
              "degree-slider-thumb" +
              (!sliderActive ? " is-disabled" : ""),
            style: { left: thumbPct + "%" },
          },
          sliderValue + "\u00b0",
        ),
        sliderActive && showSliderPulse
          ? React.createElement("img", {
              src: "assets/drag.gif",
              alt: "",
              className: "degree-slider-drag-nudge",
              style: { left: thumbPct + "%" },
            })
          : null,
        React.createElement("input", {
          className: "degree-slider",
          type: "range",
          min: 0,
          max: 360,
          step: 90,
          value: sliderValue,
          disabled: sliderDisabled || controlsDisabled,
          onChange: function (event) {
            onSliderChange(Number(event.target.value));
          },
          onMouseUp: onSliderCommit,
          onTouchEnd: onSliderCommit,
          onKeyUp: onSliderCommit,
          onBlur: onSliderCommit,
        }),
      ),
      showSliderPulse
        ? null
        : null,
      React.createElement(
        "div",
        { className: "slider-ticks" },
        [0, 90, 180, 270, 360].map(function (value) {
          return React.createElement(
            "span",
            {
              key: value,
              style: { left: (value / 360) * 100 + "%" },
            },
            value + "\u00b0",
          );
        }),
      ),
    ),
  );
};

const ReflectControls = ({ selectedAxis, enabledAxis, disabled, onReflect }) =>
  React.createElement(
    "div",
    { className: "reflect-controls" },
    React.createElement(
      "button",
      {
        id: "reflect-x",
        className:
          "mini-control reflect-accent" +
          (selectedAxis === "x" ? " is-selected" : ""),
        disabled: disabled || (enabledAxis && enabledAxis !== "x"),
        onClick: function () {
          onReflect("x");
        },
      },
      APP_DATA.labels.xAxis,
    ),
    React.createElement(
      "button",
      {
        id: "reflect-y",
        className:
          "mini-control reflect-accent" +
          (selectedAxis === "y" ? " is-selected" : ""),
        disabled: disabled || (enabledAxis && enabledAxis !== "y"),
        onClick: function () {
          onReflect("y");
        },
      },
      APP_DATA.labels.yAxis,
    ),
  );

const TranslateControls = ({ vector, enabledArrow, onMove }) =>
  React.createElement(
    "div",
    { className: "translate-controls" },
    React.createElement(
      "div",
      { className: "translate-counts" },
      React.createElement(
        "div",
        { className: "count-line" },
        React.createElement("span", null, APP_DATA.labels.xArrow),
        React.createElement("span", { className: "count-box" }, formatCount(vector.x)),
        React.createElement("span", null, APP_DATA.labels.units),
      ),
      React.createElement(
        "div",
        { className: "count-line" },
        React.createElement("span", null, APP_DATA.labels.yArrow),
        React.createElement("span", { className: "count-box" }, formatCount(vector.y)),
        React.createElement("span", null, APP_DATA.labels.units),
      ),
    ),
    React.createElement(
      "div",
      { className: "arrow-pad", "aria-label": APP_DATA.labels.translate },
      ["up", "left", "right", "down"].map(function (dir) {
        const enabled =
          enabledArrow === "all" ||
          enabledArrow === dir ||
          (Array.isArray(enabledArrow) && enabledArrow.indexOf(dir) !== -1);
        const isTarget = enabled && enabledArrow !== "all";
        return React.createElement(
          "button",
          {
            key: dir,
            id: "arrow-" + dir,
            className:
              "arrow-button arrow-" +
              dir +
              (enabled ? " is-enabled" : "") +
              (isTarget ? " is-target" : ""),
            disabled: !enabled,
            "aria-label": APP_DATA.labels[dir],
            onClick: function () {
              onMove(dir);
            },
          },
          React.createElement("span", { className: "sr-only" }, APP_DATA.labels[dir]),
        );
      }),
    ),
  );

const Controls = ({
  activeTool,
  stage,
  rotationDirection,
  rotationDegrees,
  sliderPulse,
  translationVector,
  enabledArrow,
  canRotate,
  canReflect,
  canTranslate,
  reflectionAxis,
  enabledDirection,
  enabledReflectAxis,
  onToolClick,
  onDirection,
  onSliderChange,
  onSliderCommit,
  onReflect,
  onMove,
}) => {
  const labels = APP_DATA.labels;

  const renderMainControls = function () {
    if (activeTool === "rotate" || stage === "rotationDone") {
      return React.createElement(RotateControls, {
        direction: rotationDirection,
        sliderValue: rotationDegrees,
        sliderDisabled: !rotationDirection,
        controlsDisabled: stage === "rotationDone",
        showSliderPulse:
          (stage === "rotateSlider" || stage === "freePlay") && sliderPulse,
        enabledDirection: enabledDirection,
        onDirection: onDirection,
        onSliderChange: onSliderChange,
        onSliderCommit: onSliderCommit,
      });
    }

    if (activeTool === "reflect") {
      return React.createElement(ReflectControls, {
        selectedAxis: reflectionAxis,
        enabledAxis: enabledReflectAxis,
        disabled: false,
        onReflect: onReflect,
      });
    }

    if (activeTool === "translate") {
      return React.createElement(TranslateControls, {
        vector: translationVector,
        enabledArrow: enabledArrow,
        onMove: onMove,
      });
    }

    return React.createElement("div", { className: "main-controls-placeholder" });
  };

  return React.createElement(
    "div",
    { className: "control-row" },
    React.createElement(
      "div",
      { className: "main-controls" },
      renderMainControls(),
    ),
    React.createElement(
      "div",
      { className: "tool-buttons" },
      ["rotate", "reflect", "translate"].map(function (tool) {
        const enabled =
          (tool === "rotate" && canRotate) ||
          (tool === "reflect" && canReflect) ||
          (tool === "translate" && canTranslate);
        return React.createElement(
          "button",
          {
            key: tool,
            id: "tool-" + tool,
            className:
              "tool-button " +
              TOOL_COLORS[tool] +
              (activeTool === tool ? " is-active" : "") +
              (enabled ? " is-enabled" : ""),
            disabled: !enabled,
            onClick: function () {
              onToolClick(tool);
            },
          },
          labels[tool],
        );
      }),
    ),
  );
};
