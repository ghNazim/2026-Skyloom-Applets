const TransformationDndPanel = ({
  placements,
  sourceItems,
  wrongItemId,
  wrongZone,
  onDrop,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });

  const draggedItemRef = useRef(null);
  const isDraggingRef = useRef(false);

  const getLabel = (id) => APP_DATA.transformations[id].label;

  const findZoneAtPoint = useCallback((x, y) => {
    const zones = document.querySelectorAll(".transform-dnd-drop-zone");
    let found = null;
    zones.forEach((zone) => {
      const rect = zone.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        found = zone.dataset.zoneid;
      }
    });
    return found;
  }, []);

  const handlePointerDown = (e, itemId) => {
    if (wrongItemId) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setGhostSize({ width: rect.width, height: rect.height });
    draggedItemRef.current = itemId;
    isDraggingRef.current = true;
    setDraggedItem(itemId);
    setIsDragging(true);
    setDragPosition({ x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || !draggedItemRef.current) return;
      setDragPosition({ x: e.clientX, y: e.clientY });
      setHoveredZone(findZoneAtPoint(e.clientX, e.clientY));
    },
    [findZoneAtPoint],
  );

  const finishDrag = useCallback(
    (e) => {
      if (!isDraggingRef.current || !draggedItemRef.current) return;
      const itemId = draggedItemRef.current;
      const zoneId = findZoneAtPoint(e.clientX, e.clientY);
      if (zoneId && typeof onDrop === "function") {
        onDrop(itemId, zoneId);
      }
      draggedItemRef.current = null;
      isDraggingRef.current = false;
      setDraggedItem(null);
      setIsDragging(false);
      setHoveredZone(null);
    },
    [findZoneAtPoint, onDrop],
  );

  useEffect(() => {
    if (!isDragging) return undefined;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, [isDragging, handlePointerMove, finishDrag]);

  const renderDropCard = (zoneId, title) => {
    const items = placements[zoneId] || [];
    const isWrongTarget = wrongZone === zoneId && wrongItemId;
    const isHovered = hoveredZone === zoneId && draggedItem && !isWrongTarget;

    return React.createElement(
      "div",
      {
        className: "dnd-card" + (isHovered ? " is-hovered" : ""),
        key: zoneId,
      },
      React.createElement("div", { className: "dnd-card-header" }, title),
      React.createElement(
        "div",
        {
          className:
            "dnd-drop-zone transform-dnd-drop-zone" +
            (isWrongTarget ? " is-wrong-drop" : ""),
          "data-zoneid": zoneId,
        },
        items.map((id) =>
          React.createElement(
            "div",
            { key: id, className: "dnd-chip is-placed-correct" },
            getLabel(id),
          ),
        ),
        isWrongTarget
          ? React.createElement(
              "div",
              { className: "dnd-chip is-wrong-return" },
              getLabel(wrongItemId),
            )
          : null,
      ),
    );
  };

  const renderDraggable = (id) => {
    const isBeingDragged = draggedItem === id;
    return React.createElement(
      "div",
      {
        key: id,
        className: "dnd-chip is-draggable" + (isBeingDragged ? " is-dragging" : ""),
        onPointerDown: (e) => handlePointerDown(e, id),
      },
      getLabel(id),
    );
  };

  const renderDragGhost = () => {
    if (!isDragging || !draggedItem) return null;
    return React.createElement(
      "div",
      {
        className: "dnd-chip is-draggable dnd-drag-ghost",
        style: {
          position: "fixed",
          left: dragPosition.x,
          top: dragPosition.y,
          width: ghostSize.width ? ghostSize.width + "px" : undefined,
          height: ghostSize.height ? ghostSize.height + "px" : undefined,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
        },
      },
      getLabel(draggedItem),
    );
  };

  return React.createElement(
    "div",
    { className: "dnd-panel" },
    React.createElement(
      "div",
      { className: "dnd-cards-col" },
      renderDropCard("rigid", APP_DATA.transformationDnd.rigidTitle),
      renderDropCard("nonrigid", APP_DATA.transformationDnd.nonrigidTitle),
    ),
    React.createElement(
      "div",
      { className: "dnd-source-col" },
      React.createElement(
        "div",
        { className: "dnd-source-zone" },
        sourceItems.map((id) => renderDraggable(id)),
      ),
    ),
    renderDragGhost(),
  );
};
