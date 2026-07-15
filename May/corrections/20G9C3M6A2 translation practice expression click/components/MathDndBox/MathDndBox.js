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
  blinkUnfilled,
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
    if (blinkUnfilled && !isFilled && !isWrong) zoneClass += " is-blink-highlight";

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
            typeof renderMathVars === "function"
              ? renderMathVars(getLabel(wrongItemId), "wrong-" + wrongItemId)
              : getLabel(wrongItemId),
          )
        : placedId
          ? React.createElement(
              "span",
              { className: "placed-label" },
              typeof renderMathVars === "function"
                ? renderMathVars(getLabel(placedId), "placed-" + placedId)
                : getLabel(placedId),
            )
          : React.createElement(
              "span",
              { className: "placeholder" },
              typeof renderMathVars === "function"
                ? renderMathVars(placeholder, "placeholder-" + zoneId)
                : placeholder,
            ),
    );
  };

  const renderPart = (part, index) => {
    if (part.type === "zone") {
      return renderZone(part.id, part.placeholder);
    }
    return React.createElement(
      "span",
      { key: "t-" + index },
      typeof renderMathVars === "function"
        ? renderMathVars(part.value, "part-" + index)
        : part.value,
    );
  };

  const processedFeedbackHtml =
    typeof formatMathVarsInHtml === "function"
      ? formatMathVarsInHtml(feedbackHtml)
      : feedbackHtml;

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
          dangerouslySetInnerHTML: { __html: processedFeedbackHtml },
        })
      : null,
  );
};
