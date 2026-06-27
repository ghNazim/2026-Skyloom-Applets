const ActionDndPanel = ({
  title,
  sourceItems,
  onPointerDown,
  draggedItem,
  dragGhost,
  visible,
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
      id,
    );
  };

  return React.createElement(
    "div",
    { className: "action-dnd-panel" + (visible ? " is-visible" : "") },
    React.createElement("div", { className: "action-dnd-title" }, title),
    React.createElement(
      "div",
      { className: "action-dnd-grid" },
      sourceItems.map((id) => renderDraggable(id)),
    ),
    dragGhost,
  );
};
