const PropertyPanel = ({
  activeProperty,
  exploredProperties,
  disabled,
  onSelect,
  showSummarize = false,
  onSummarize,
}) => {
  return React.createElement(
    "div",
    { className: "property-panel" },
    React.createElement(
      "div",
      { className: "property-panel-buttons" },
      PROPERTY_IDS.map((id) =>
        React.createElement(
          "button",
          {
            key: id,
            id: "property-btn-" + id,
            className:
              "property-btn" +
              (activeProperty === id ? " active" : "") +
              (exploredProperties.includes(id) ? " explored" : ""),
            disabled: disabled,
            onClick: () => {
              if (!disabled && typeof onSelect === "function") onSelect(id);
            },
          },
          APP_DATA.properties[id].label,
        ),
      ),
    ),
    React.createElement(
      "button",
      {
        className: "property-summarize-btn",
        id: "summarize-button",
        style: { opacity: showSummarize ? 1 : 0 },
        disabled: !showSummarize,
        onClick: () => {
          if (showSummarize && typeof onSummarize === "function") {
            onSummarize();
          }
        },
      },
      APP_DATA.summarize,
    ),
  );
};
