const TOOL_COLORS = {
  rotate: "tool-rotate",
  reflect: "tool-reflect",
  translate: "tool-translate",
  dilate: "tool-dilate",
};

function formatCount(value) {
  if (value > 0) return "+" + value;
  return String(value);
}

const DilateControls = ({
  scaleFactor,
  sliderPulse,
  disabled,
  onSliderChange,
  onSliderDragStart,
  onSliderCommit,
}) => {
  const labels = APP_DATA.labels;
  const thumbPct = (scaleFactor / 3) * 100;
  return React.createElement(
    "div",
    { className: "dilate-controls" },
    React.createElement(
      "label",
      { className: "scale-factor-label", htmlFor: "dilate-slider" },
      labels.scaleFactor,
    ),
    React.createElement(
      "div",
      { id: "dilate-slider-wrap", className: "slider-wrap dilate-slider-wrap" },
      React.createElement(
        "div",
        { className: "degree-slider-shell" },
        React.createElement("div", { className: "degree-slider-track" }),
        React.createElement("div", {
          className: "degree-slider-track-active dilate-track-active",
          style: { width: thumbPct + "%" },
        }),
        React.createElement(
          "div",
          {
            className:
              "degree-slider-thumb dilate-slider-thumb" +
              (disabled ? " is-disabled" : ""),
            style: { left: thumbPct + "%" },
          },
          Math.round(scaleFactor * 10) / 10,
        ),
        !disabled && sliderPulse
          ? React.createElement("img", {
              src: "assets/drag.gif",
              alt: "",
              className: "degree-slider-drag-nudge",
              style: { left: thumbPct + "%" },
            })
          : null,
        React.createElement("input", {
          id: "dilate-slider",
          className: "degree-slider",
          type: "range",
          min: 0,
          max: 3,
          step: 0.01,
          value: scaleFactor,
          disabled: disabled,
          onChange: function (event) {
            onSliderChange(Number(event.target.value));
          },
          onPointerDown: onSliderDragStart,
          onMouseDown: onSliderDragStart,
          onMouseUp: onSliderCommit,
          onTouchEnd: onSliderCommit,
          onKeyUp: onSliderCommit,
          onBlur: onSliderCommit,
        }),
      ),
    ),
  );
};

const RotateControls = ({
  direction,
  sliderValue,
  sliderDisabled,
  controlsDisabled,
  showSliderPulse,
  enabledDirection,
  onDirection,
  onSliderChange,
  onSliderDragStart,
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
          step: 1,
          value: sliderValue,
          disabled: sliderDisabled || controlsDisabled,
          onChange: function (event) {
            onSliderChange(Number(event.target.value));
          },
          onPointerDown: onSliderDragStart,
          onMouseDown: onSliderDragStart,
          onMouseUp: onSliderCommit,
          onTouchEnd: onSliderCommit,
          onKeyUp: onSliderCommit,
          onBlur: onSliderCommit,
        }),
      ),
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
  scaleFactor,
  sliderPulse,
  translationVector,
  enabledArrow,
  canRotate,
  canReflect,
  canTranslate,
  canDilate,
  reflectionAxis,
  enabledDirection,
  enabledReflectAxis,
  toolsHidden,
  mainControlsHidden,
  showStartButton,
  showDilateOptions,
  onStartClick,
  onDilateOption,
  onToolClick,
  onDirection,
  onSliderChange,
  onSliderDragStart,
  onSliderCommit,
  onScaleChange,
  onScaleDragStart,
  onScaleCommit,
  onReflect,
  onMove,
}) => {
  const labels = APP_DATA.labels;

  const renderMainControls = function () {
    if (
      activeTool === "dilate" &&
      (stage === "dilateSlider" ||
        stage === "dilateBSlider" ||
        stage === "dilateSuccess")
    ) {
      return React.createElement(DilateControls, {
        scaleFactor: scaleFactor,
        sliderPulse: sliderPulse,
        disabled: stage === "dilateSuccess",
        onSliderChange: onScaleChange,
        onSliderDragStart: onScaleDragStart,
        onSliderCommit: onScaleCommit,
      });
    }

    if (activeTool === "rotate") {
      return React.createElement(RotateControls, {
        direction: rotationDirection,
        sliderValue: rotationDegrees,
        sliderDisabled: !rotationDirection,
        controlsDisabled: false,
        showSliderPulse: sliderPulse,
        enabledDirection: enabledDirection,
        onDirection: onDirection,
        onSliderChange: onSliderChange,
        onSliderDragStart: onSliderDragStart,
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
    {
      className:
        "control-row" +
        (stage === "step1" ? " is-step1" : "") +
        (toolsHidden ? " tools-hidden" : ""),
    },
    showStartButton
      ? React.createElement(
          "button",
          {
            id: "start-button",
            className: "control-start-button",
            onClick: onStartClick,
          },
          labels.start,
        )
      : null,
    showDilateOptions
      ? React.createElement(
          "div",
          { className: "dilate-options-overlay" },
          React.createElement(
            "button",
            {
              id: "dilate-origin",
              className: "dilate-option-button",
              onClick: function () {
                onDilateOption("origin");
              },
            },
            labels.dilateAboutOrigin,
          ),
          React.createElement(
            "button",
            {
              id: "dilate-vertex",
              className: "dilate-option-button",
              onClick: function () {
                onDilateOption("vertex");
              },
            },
            labels.dilateAboutVertex,
          ),
        )
      : null,
    React.createElement(
      "div",
      {
        className:
          "main-controls" + (mainControlsHidden ? " is-hidden" : ""),
      },
      renderMainControls(),
    ),
    React.createElement(
      "div",
      {
        className:
          "tool-buttons" + (mainControlsHidden && showDilateOptions ? " is-hidden" : ""),
      },
      ["rotate", "reflect", "translate", "dilate"].map(function (tool) {
        const enabled =
          (tool === "rotate" && canRotate) ||
          (tool === "reflect" && canReflect) ||
          (tool === "translate" && canTranslate) ||
          (tool === "dilate" && canDilate);
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
