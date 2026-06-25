const PropertyPanel = ({
  activeProperty,
  exploredProperties,
  disabled,
  onSelect,
}) => {
  return React.createElement(
    "div",
    { className: "property-panel" },
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
  );
};
