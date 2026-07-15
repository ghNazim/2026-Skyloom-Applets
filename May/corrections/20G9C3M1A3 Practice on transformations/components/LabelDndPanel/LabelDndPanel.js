const LabelDndPanel = ({
  animProgress,
  showGray,
  placements,
  sourceItems,
  wrongItemId,
  wrongZone,
  dndReady,
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

  const getLabel = (id) => APP_DATA.labels[id].label;

  const findZoneAtPoint = useCallback((x, y) => {
    const zones = document.querySelectorAll(".label-drop-zone");
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
    if (!dndReady || wrongItemId) return;
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

  const renderDropZone = (zoneId, extraClass) => {
    const items = placements[zoneId] || [];
    const isFilled = items.length > 0;
    const isWrongTarget = wrongZone === zoneId && wrongItemId;
    const isHovered = hoveredZone === zoneId && draggedItem && !isWrongTarget;

    let cls = "label-drop-zone " + extraClass;
    if (isFilled) cls += " is-correct has-label";
    else if (dndReady && !isWrongTarget) cls += " is-blinking";
    if (isHovered) cls += " is-hovered";
    if (isWrongTarget) cls += " is-wrong-drop";

    return React.createElement(
      "div",
      {
        key: zoneId,
        className: cls,
        "data-zoneid": zoneId,
      },
      isFilled
        ? React.createElement(
            "div",
            { className: "label-drop-chip" },
            getLabel(items[0]),
          )
        : null,
      isWrongTarget
        ? React.createElement(
            "div",
            { className: "label-drop-chip is-wrong-return" },
            getLabel(wrongItemId),
          )
        : null,
    );
  };

  const renderDraggable = (id) => {
    const isBeingDragged = draggedItem === id;
    return React.createElement(
      "div",
      {
        key: id,
        className:
          "label-draggable-chip" + (isBeingDragged ? " is-dragging" : ""),
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
        className: "label-draggable-chip label-drag-ghost",
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
    { className: "label-dnd-panel" },
    React.createElement(
      "div",
      { className: "label-dnd-left" },
      React.createElement(HexagonLabelGraph, {
        showGray: showGray,
        animProgress: animProgress,
      }),
      dndReady
        ? renderDropZone("preimage", "label-drop-preimage")
        : null,
      dndReady ? renderDropZone("image", "label-drop-image") : null,
    ),
    React.createElement(
      "div",
      { className: "label-dnd-right" },
      React.createElement(
        "div",
        { className: "label-dnd-source" },
        sourceItems.map((id) => renderDraggable(id)),
      ),
    ),
    renderDragGhost(),
  );
};
