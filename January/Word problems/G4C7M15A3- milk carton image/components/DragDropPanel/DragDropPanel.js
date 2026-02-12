const DragDropPanel = ({ onComplete, onEnableNext, onUpdateNavText, imageSrc, dragDropKey, step }) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const dragDropData = APP_DATA[dragDropKey] || APP_DATA.dragDrop1;
  const isSetupOnly = dragDropData.showEquationOnly && dragDropData.findingsSections;

  const [filledZones, setFilledZones] = useState({});
  const [availableDraggables, setAvailableDraggables] = useState(
    (dragDropData.draggables || []).map(d => d.id)
  );
  const [shakeZone, setShakeZone] = useState(null);
  const [allComplete, setAllComplete] = useState(false);
  const [showFinalState, setShowFinalState] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragGhostRef = useRef(null);

  const [usedTextValues, setUsedTextValues] = useState([]);

  useEffect(() => {
    setFilledZones({});
    setAvailableDraggables((dragDropData.draggables || []).map(d => d.id));
    setAllComplete(false);
    setShowFinalState(false);
    setUsedTextValues([]);
    setHoveredZone(null);
    setDraggedItem(null);
    setIsDragging(false);
  }, [dragDropKey]);

  useEffect(() => {
    if (!dragDropData.dropZones || dragDropData.dropZones.length === 0) return;
    const allFilled = dragDropData.dropZones.every(zone => filledZones[zone.id]);
    if (allFilled && !allComplete) {
      setAllComplete(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setShowFinalState(true);
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[step];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 1000);
    }
  }, [filledZones, allComplete, step]);

  const getDraggableText = (id) => {
    const draggable = dragDropData.draggables.find(d => d.id === id);
    return draggable ? draggable.text : "";
  };

  const processDrop = useCallback((draggableId, zoneId) => {
    if (!draggableId || filledZones[zoneId]) return;

    const zone = dragDropData.dropZones.find(z => z.id === zoneId);
    const draggable = dragDropData.draggables.find(d => d.id === draggableId);
    if (!zone || !draggable) return;

    let isCorrect = false;
    if (zone.correctAnswers) {
      if (zone.correctAnswers.includes(draggable.text) && !usedTextValues.includes(draggable.text)) {
        isCorrect = true;
      }
    } else {
      isCorrect = draggable.text === zone.correctAnswer;
    }

    if (isCorrect) {
      if (window.playSound) window.playSound("tick");
      setFilledZones(prev => ({ ...prev, [zoneId]: draggableId }));
      setAvailableDraggables(prev => prev.filter(id => id !== draggableId));
      if (zone.correctAnswers) setUsedTextValues(prev => [...prev, draggable.text]);
    } else {
      if (window.playSound) window.playSound("wrong");
      setShakeZone(zoneId);
      setTimeout(() => setShakeZone(null), 300);
    }
  }, [dragDropData, filledZones, usedTextValues]);

  const handlePointerDown = (e, draggableId) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggedItem(draggableId);
    setIsDragging(true);
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = useCallback((e) => {
    if (!draggedItem) return;
    setDragPosition({ x: e.clientX, y: e.clientY });

    const dropZones = document.querySelectorAll('.dd-drop-zone');
    let hoveredZoneId = null;
    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const zoneId = zone.dataset.zoneid;
        if (!filledZones[zoneId]) hoveredZoneId = zoneId;
      }
    });
    setHoveredZone(hoveredZoneId);
  }, [draggedItem, filledZones]);

  const handlePointerUp = useCallback((e) => {
    if (!draggedItem) return;

    const dropZones = document.querySelectorAll('.dd-drop-zone');
    let droppedOnZone = null;
    const x = e.clientX;
    const y = e.clientY;
    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        droppedOnZone = zone.dataset.zoneid;
      }
    });

    if (droppedOnZone) processDrop(draggedItem, droppedOnZone);

    setDraggedItem(null);
    setIsDragging(false);
    setHoveredZone(null);
  }, [draggedItem, processDrop]);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const renderDropZone = (zone, index) => {
    const isFilled = !!filledZones[zone.id];
    const isShaking = shakeZone === zone.id;
    const isHovered = hoveredZone === zone.id && !isFilled && draggedItem;

    let className = "dd-drop-zone";
    if (isFilled && !showFinalState) className += " correct";
    if (isShaking) className += " shake wrong";
    if (showFinalState && isFilled) className += " final";
    if (isHovered) className += " hovered";

    const filledText = isFilled ? getDraggableText(filledZones[zone.id]) : zone.placeholder;

    return React.createElement(
      "span",
      {
        key: zone.id,
        className: className,
        "data-zoneid": zone.id,
      },
      filledText
    );
  };

  const renderDraggable = (draggable) => {
    const isAvailable = availableDraggables.includes(draggable.id);
    const isBeingDragged = draggedItem === draggable.id;
    if (!isAvailable) return null;

    return React.createElement(
      "span",
      {
        key: draggable.id,
        className: `dd-draggable ${isBeingDragged ? 'dragging' : ''}`,
        onPointerDown: (e) => handlePointerDown(e, draggable.id),
      },
      draggable.text
    );
  };

  const renderDragGhost = () => {
    if (!isDragging || !draggedItem) return null;
    const draggable = dragDropData.draggables.find(d => d.id === draggedItem);
    if (!draggable) return null;

    return React.createElement(
      "div",
      {
        ref: dragGhostRef,
        className: "dd-drag-ghost",
        style: {
          position: "fixed",
          left: dragPosition.x,
          top: dragPosition.y,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
        },
      },
      draggable.text
    );
  };

  const renderEquationLine = () => {
    if (dragDropData.equationLineFormat === "valuesWithPlusZones" && dragDropData.fixedParts && dragDropData.dropZones.length >= 2) {
      const parts = dragDropData.fixedParts;
      return React.createElement(
        "div",
        { className: "dd-equation-line" },
        "= ",
        parts[0],
        " ",
        renderDropZone(dragDropData.dropZones[0], 0),
        " ",
        parts[1],
        " ",
        renderDropZone(dragDropData.dropZones[1], 1),
        " ",
        parts[2]
      );
    }
    if (dragDropData.dropZones && dragDropData.dropZones.length >= 3) {
      return React.createElement(
        "div",
        { className: "dd-equation-line" },
        "= ",
        renderDropZone(dragDropData.dropZones[0], 0),
        " ",
        renderDropZone(dragDropData.dropZones[1], 1),
        " ",
        renderDropZone(dragDropData.dropZones[2], 2)
      );
    }
    return null;
  };

  if (isSetupOnly) {
    return React.createElement(
      "div",
      { className: "drag-drop-panel" },
      React.createElement(
        "div",
        { className: "dd-left-column" },
        React.createElement(
          "div",
          { className: "dd-image-row" },
          React.createElement("img", {
            src: imageSrc || "assets/compre4.png",
            alt: APP_DATA.altMilkCartons,
            className: "dd-image",
          })
        ),
        React.createElement(
          "div",
          { className: "dd-equation-row" },
          React.createElement(
            "div",
            { className: "dd-equation-label" },
            dragDropData.equationLabel
          )
        )
      ),
      React.createElement(
        "div",
        { className: "dd-right-column" },
        dragDropData.findingsSections.map((section, sIdx) =>
          React.createElement(
            "div",
            { key: `section-${sIdx}`, className: "dd-findings-div" },
            React.createElement("div", { className: "dd-findings-title" }, section.title),
            React.createElement(
              "ul",
              { className: "dd-findings-list" },
              section.list.map((item, index) =>
                React.createElement("li", { key: `finding-${sIdx}-${index}` }, item)
              )
            )
          )
        )
      )
    );
  }

  return React.createElement(
    "div",
    { className: "drag-drop-panel" },
    React.createElement(
      "div",
      { className: "dd-left-column" },
      React.createElement(
        "div",
        { className: "dd-image-row" },
        React.createElement("img", {
          src: imageSrc || "assets/compre4.png",
          alt: APP_DATA.altMilkCartons,
          className: "dd-image",
        })
      ),
      React.createElement(
        "div",
        { className: "dd-equation-row" },
        React.createElement(
          "div",
          { className: "dd-equation-label" },
          dragDropData.equationLabel
        ),
        renderEquationLine()
      )
    ),
    React.createElement(
      "div",
      { className: "dd-right-column" },
      React.createElement(
        "div",
        { className: "dd-findings-div" },
        React.createElement("div", { className: "dd-findings-title" }, dragDropData.findingsTitle),
        React.createElement(
          "ul",
          { className: "dd-findings-list" },
          dragDropData.findingsList.map((item, index) =>
            React.createElement("li", { key: `finding-${index}` }, item)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "dd-draggables-container" },
        dragDropData.draggables && dragDropData.draggables.length > 0 && React.createElement(
          "div",
          { className: "dd-draggables-row operators" },
          dragDropData.draggables.map(renderDraggable)
        )
      )
    ),
    renderDragGhost()
  );
};
