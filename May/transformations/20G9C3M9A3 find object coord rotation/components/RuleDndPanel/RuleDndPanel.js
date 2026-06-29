const RuleDndPanel = ({
  phase,
  onComplete,
  dndConfig,
  rulePanelConfig,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const [slots, setSlots] = useState({ slot1: null, slot2: null });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });
  const [wrongItemId, setWrongItemId] = useState(null);
  const [wrongZone, setWrongZone] = useState(null);
  const [titleHidden, setTitleHidden] = useState(false);
  const [showStyledResult, setShowStyledResult] = useState(false);

  const draggedItemRef = useRef(null);
  const isDraggingRef = useRef(false);
  const completeCalledRef = useRef(false);

  const dnd = dndConfig || APP_DATA.dnd;
  const items = dnd.items;
  const correct = dnd.correctSlots;
  const sourceIds = ["x", "negX", "y", "negY"];

  const usedIds = [slots.slot1, slots.slot2].filter(Boolean);
  const availableIds = sourceIds.filter((id) => usedIds.indexOf(id) === -1);
  const bothCorrect =
    slots.slot1 === correct.slot1 && slots.slot2 === correct.slot2;

  const findZoneAtPoint = useCallback((x, y) => {
    const zones = document.querySelectorAll(".rule-dnd-drop");
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
    if (bothCorrect || showStyledResult || wrongItemId) return;
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

  const handleWrongDrop = useCallback((itemId, zoneId) => {
    if (typeof playSound === "function") playSound("wrong");
    setWrongItemId(itemId);
    setWrongZone(zoneId);
    setTimeout(() => {
      setWrongItemId(null);
      setWrongZone(null);
    }, 550);
  }, []);

  const finishDrag = useCallback(
    (e) => {
      if (!isDraggingRef.current || !draggedItemRef.current) return;
      const itemId = draggedItemRef.current;
      const zoneId = findZoneAtPoint(e.clientX, e.clientY);

      if (zoneId && !bothCorrect && !showStyledResult) {
        const expected = correct[zoneId];
        if (itemId === expected) {
          if (typeof playSound === "function") playSound("correct");
          setSlots((prev) => ({ ...prev, [zoneId]: itemId }));
        } else {
          handleWrongDrop(itemId, zoneId);
        }
      }

      draggedItemRef.current = null;
      isDraggingRef.current = false;
      setDraggedItem(null);
      setIsDragging(false);
      setHoveredZone(null);
    },
    [findZoneAtPoint, bothCorrect, showStyledResult, correct, handleWrongDrop],
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

  useEffect(() => {
    if (!bothCorrect || completeCalledRef.current) return;
    completeCalledRef.current = true;

    const runComplete = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      setTitleHidden(true);
      await new Promise((r) => setTimeout(r, 450));
      setShowStyledResult(true);
      if (typeof onComplete === "function") onComplete();
    };
    runComplete();
  }, [bothCorrect, onComplete]);

  const renderDropSlot = (zoneId) => {
    const placed = slots[zoneId];
    const isWrongTarget = wrongZone === zoneId && wrongItemId;
    const isHovered =
      hoveredZone === zoneId &&
      draggedItem &&
      !isWrongTarget &&
      !bothCorrect;
    const isCorrectPlaced = placed && placed === correct[zoneId];

    return React.createElement(
      "span",
      {
        key: zoneId,
        className:
          "rule-dnd-drop" +
          (isHovered ? " is-hovered" : "") +
          (isWrongTarget ? " is-wrong" : "") +
          (isCorrectPlaced ? " is-correct" : ""),
        "data-zoneid": zoneId,
      },
      placed
        ? React.createElement(
            "span",
            { className: "rule-dnd-placed" },
            items[placed].label,
          )
        : null,
      isWrongTarget
        ? React.createElement(
            "span",
            { className: "rule-dnd-placed is-wrong-chip" },
            items[wrongItemId].label,
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
          "rule-dnd-chip" + (isBeingDragged ? " is-dragging" : ""),
        onPointerDown: (e) => handlePointerDown(e, id),
      },
      items[id].label,
    );
  };

  const renderGhost = () => {
    if (!isDragging || !draggedItem) return null;
    return React.createElement(
      "div",
      {
        className: "rule-dnd-chip rule-dnd-ghost",
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
      items[draggedItem].label,
    );
  };

  const panel = rulePanelConfig || APP_DATA.rulePanel;

  return React.createElement(
    "div",
    {
      className:
        "rule-dnd-panel" + (phase !== "initial" ? " is-visible-panel" : ""),
    },
    React.createElement(
      "div",
      {
        className: "rule-dnd-title-wrap" + (titleHidden ? " is-hidden" : ""),
      },
      React.createElement("div", {
        className: "rule-dnd-title",
        dangerouslySetInnerHTML: { __html: panel.title },
      }),
    ),
    showStyledResult
      ? React.createElement("div", {
          className: "rule-dnd-result-box is-styled",
          dangerouslySetInnerHTML: { __html: panel.resultRule },
        })
      : React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "div",
            { className: "rule-dnd-blue-box" },
            React.createElement(
              "span",
              { className: "rule-dnd-math" },
              panel.rulePrefix,
            ),
            renderDropSlot("slot1"),
            React.createElement(
              "span",
              { className: "rule-dnd-math" },
              ", ",
            ),
            renderDropSlot("slot2"),
            React.createElement(
              "span",
              { className: "rule-dnd-math" },
              panel.ruleSuffix,
            ),
          ),
          !bothCorrect
            ? React.createElement(
                "div",
                { className: "rule-dnd-source" },
                availableIds.map((id) => renderDraggable(id)),
              )
            : null,
        ),
    renderGhost(),
  );
};
