const ActionDndPanel = ({
  title,
  sourceItems,
  onPointerDown,
  draggedItem,
  dragGhost,
  visible,
  getLabel,
  gridRef,
}) => {
  const renderDraggable = (id) => {
    const isBeingDragged = draggedItem === id;
    return React.createElement(
      "div",
      {
        key: id,
        className: "action-dnd-chip" + (isBeingDragged ? " is-dragging" : ""),
        onPointerDown: (e) => onPointerDown(e, id),
      },
      typeof renderMathVars === "function"
        ? renderMathVars(getLabel(id), "action-" + id)
        : getLabel(id),
    );
  };

  return React.createElement(
    "div",
    { className: "action-dnd-panel" + (visible ? " is-visible" : "") },
    React.createElement(
      "div",
      { className: "action-dnd-title" },
      typeof renderMathVars === "function"
        ? renderMathVars(title, "action-title")
        : title,
    ),
    React.createElement(
      "div",
      { className: "action-dnd-grid", ref: gridRef },
      sourceItems.map((id) => renderDraggable(id)),
    ),
    dragGhost,
  );
};
