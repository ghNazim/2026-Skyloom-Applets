const TextPanel = ({ textLines, enabledBoxIds, onBoxClick }) => {
  const getBoxClassName = (color) => {
    const base = "text-panel-box";
    const colorClass = `text-panel-box-${color}`;
    return `${base} ${colorClass}`;
  };

  const renderSegment = (seg, segIdx) => {
    if (seg.type === "plain") {
      return React.createElement("span", { key: segIdx, className: "text-panel-plain" }, seg.text);
    }
    if (seg.type === "box") {
      const isEnabled = enabledBoxIds.includes(seg.id);
      return React.createElement(
        "span",
        {
          key: segIdx,
          className: getBoxClassName(seg.color) + (isEnabled ? " clickable" : " disabled"),
          onClick: isEnabled ? () => onBoxClick(seg.id) : undefined,
          role: isEnabled ? "button" : undefined,
        },
        seg.text
      );
    }
    return null;
  };

  return React.createElement(
    "div",
    { className: "text-panel" },
    textLines.map((line, lineIdx) =>
      React.createElement(
        "div",
        { key: lineIdx, className: "text-panel-line" },
        line.map((seg, segIdx) => renderSegment(seg, segIdx))
      )
    )
  );
};
