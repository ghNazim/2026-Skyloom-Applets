const PropertyPanel = ({
  activeReflector,
  exploredReflectors,
  disabled,
  onSelect,
  showSummarize,
  onSummarize,
}) => {
  return React.createElement(
    "div",
    { className: "property-panel" },
    React.createElement(
      "h2",
      { className: "property-panel-title" },
      APP_DATA.panel.title,
    ),
    React.createElement(
      "div",
      { className: "property-panel-buttons" },
      REFLECTION_IDS.map((id) => {
        const isImplemented = IMPLEMENTED_REFLECTION_IDS.includes(id);
        return React.createElement(
          "button",
          {
            key: id,
            id: "reflection-btn-" + id,
            className:
              "property-btn" +
              (activeReflector === id ? " active" : "") +
              (exploredReflectors.includes(id) ? " explored" : "") +
              (!isImplemented ? " pending" : ""),
            disabled: disabled || !isImplemented,
            onClick: () => {
              if (!disabled && isImplemented && typeof onSelect === "function") {
                onSelect(id);
              }
            },
          },
          renderPanelMathText(APP_DATA.reflectors[id].label),
        );
      }),
    ),
    React.createElement(
      "button",
      {
        id: "summarize-button",
        className: "property-summarize-btn",
        disabled: disabled || !showSummarize,
        style: { opacity: showSummarize ? 1 : 0 },
        onClick: () => {
          if (!disabled && showSummarize && typeof onSummarize === "function") {
            onSummarize();
          }
        },
      },
      APP_DATA.panel.summarize,
    ),
  );
};

function renderPanelMathText(text) {
  const parts = String(text).split(/\b([xy])\b/g);
  return parts.map((part, index) =>
    part === "x" || part === "y"
      ? React.createElement(
          "span",
          { key: index, className: "math-var" },
          part,
        )
      : part,
  );
}
