const MainCanvas = (props) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const {
    step,
    step3Phase,
    question,
    dndPlacements,
    dndSourceItems,
    dndWrongItemId,
    dndWrongZone,
    onDndDrop,
    onDndDragStart,
    showDndFeedback,
    simplifyPhase,
    onSimplifyPhaseChange,
    onSimplifyComplete,
    questionIndex,
  } = props;

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });
  const [mathBoxVisible, setMathBoxVisible] = useState(false);
  const [actionPanelVisible, setActionPanelVisible] = useState(false);

  const draggedItemRef = useRef(null);
  const isDraggingRef = useRef(false);

  const getLabel = useCallback(
    (itemId) => getDndLabel(question, itemId),
    [question],
  );

  useEffect(() => {
    if (step !== 3) {
      setMathBoxVisible(false);
      setActionPanelVisible(false);
      return;
    }
    setMathBoxVisible(false);
    setActionPanelVisible(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMathBoxVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [step, questionIndex]);

  useEffect(() => {
    if (step3Phase !== "dnd" && step3Phase !== "done") {
      setActionPanelVisible(false);
      return;
    }
    setActionPanelVisible(false);
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setActionPanelVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [step3Phase]);

  const findZoneAtPoint = useCallback((x, y) => {
    const zones = document.querySelectorAll(".expr-dnd-drop-zone");
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
    if (dndWrongItemId) return;
    e.preventDefault();
    if (typeof onDndDragStart === "function") onDndDragStart();
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
      if (zoneId && typeof onDndDrop === "function") {
        onDndDrop(itemId, zoneId);
      }
      draggedItemRef.current = null;
      isDraggingRef.current = false;
      setDraggedItem(null);
      setIsDragging(false);
      setHoveredZone(null);
    },
    [findZoneAtPoint, onDndDrop],
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

  const renderDragGhost = () => {
    if (!isDragging || !draggedItem) return null;
    return React.createElement(
      "div",
      {
        className: "action-dnd-chip action-dnd-ghost",
        style: {
          left: dragPosition.x,
          top: dragPosition.y,
          width: ghostSize.width ? ghostSize.width + "px" : undefined,
          height: ghostSize.height ? ghostSize.height + "px" : undefined,
          transform: "translate(-50%, -50%)",
        },
      },
      getLabel(draggedItem),
    );
  };

  const showRightPanel = step === 3 && step3Phase !== "hold";
  const showDndAction =
    step === 3 && (step3Phase === "dnd" || step3Phase === "done");

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-canvas-left" },
      step === 3
        ? React.createElement(MathDndBox, {
            key: "dnd-" + questionIndex,
            mathDnd: question.mathDnd,
            placements: dndPlacements,
            hoveredZone: hoveredZone,
            wrongZone: dndWrongZone,
            wrongItemId: dndWrongItemId,
            showFeedback: showDndFeedback,
            feedbackHtml: APP_DATA.steps[3].feedbackText,
            boxVisible: mathBoxVisible,
            getLabel: getLabel,
          })
        : step === 4
          ? React.createElement(
              "div",
              { className: "math-column-stack" },
              React.createElement(SimplifyExpression, {
                key: "simp-" + questionIndex,
                simplifyConfig: question.simplify,
                phase: simplifyPhase,
                onHighlightClick: onSimplifyPhaseChange,
                onFinalReached: onSimplifyComplete,
              }),
            )
          : null,
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right" + (showRightPanel ? "" : " is-empty") },
      showDndAction
        ? React.createElement(ActionDndPanel, {
            title: APP_DATA.steps[3].actionTitle,
            sourceItems: dndSourceItems,
            onPointerDown: handlePointerDown,
            draggedItem: draggedItem,
            dragGhost: renderDragGhost(),
            visible: actionPanelVisible,
            getLabel: getLabel,
          })
        : null,
    ),
  );
};
