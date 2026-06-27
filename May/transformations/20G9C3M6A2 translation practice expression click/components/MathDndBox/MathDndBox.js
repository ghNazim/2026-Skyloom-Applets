const MathDndBox = ({
  mathDnd,
  placements,
  hoveredZone,
  wrongZone,
  wrongItemId,
  showFeedback,
  feedbackHtml,
  boxVisible,
  getLabel,
}) => {
  const renderZone = (zoneId, placeholder) => {
    const placedId = placements[zoneId];
    const isHovered = hoveredZone === zoneId && !placedId;
    const isWrong = wrongZone === zoneId && wrongItemId;
    const isFilled = !!placedId;

    let zoneClass = "expr-dnd-drop-zone";
    if (isHovered) zoneClass += " is-hovered";
    if (isFilled) zoneClass += " is-filled";
    if (isWrong) zoneClass += " is-wrong-drop";

    return React.createElement(
      "span",
      {
        key: zoneId,
        className: zoneClass,
        "data-zoneid": zoneId,
      },
      isWrong
        ? React.createElement(
            "span",
            { className: "wrong-return-chip" },
            getLabel(wrongItemId),
          )
        : placedId
          ? React.createElement(
              "span",
              { className: "placed-label" },
              getLabel(placedId),
            )
          : React.createElement("span", { className: "placeholder" }, placeholder),
    );
  };

  const renderPart = (part, index) => {
    if (part.type === "zone") {
      return renderZone(part.id, part.placeholder);
    }
    return React.createElement("span", { key: "t-" + index }, part.value);
  };

  return React.createElement(
    "div",
    { className: "math-column-stack" },
    React.createElement(
      "div",
      { className: "math-dnd-box" + (boxVisible ? " is-visible" : "") },
      React.createElement(
        "div",
        { className: "math-dnd-expression" },
        mathDnd.parts.map((part, index) => renderPart(part, index)),
      ),
    ),
    showFeedback
      ? React.createElement("div", {
          className: "feedback-box is-visible",
          dangerouslySetInnerHTML: { __html: feedbackHtml },
        })
      : null,
  );
};
