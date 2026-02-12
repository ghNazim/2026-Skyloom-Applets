const DragDropPanel = ({ onComplete, onEnableNext, onUpdateNavText, imageSrc, dragDropKey, step }) => {
  const { useState, useEffect, useRef } = React;

  const dragDropData = APP_DATA[dragDropKey] || APP_DATA.dragDrop1;

  const [filledZones, setFilledZones] = useState({});
  const [availableDraggables, setAvailableDraggables] = useState(
    dragDropData.draggables.map(d => d.id)
  );
  const [shakeZone, setShakeZone] = useState(null);
  const [allComplete, setAllComplete] = useState(false);
  const [showFinalState, setShowFinalState] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);

  // Unified pointer-based drag state
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragGhostRef = useRef(null);

  const [usedTextValues, setUsedTextValues] = useState([]);

  useEffect(() => {
    setFilledZones({});
    setAvailableDraggables(dragDropData.draggables.map(d => d.id));
    setAllComplete(false);
    setShowFinalState(false);
    setUsedTextValues([]);
    setHoveredZone(null);
    setDraggedItem(null);
    setIsDragging(false);
  }, [dragDropKey]);

  useEffect(() => {
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

  // Pointer-only drag: start
  const handlePointerDown = (e, draggableId) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggedItem(draggableId);
    setIsDragging(true);
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !draggedItem) return;

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
  };

  const handlePointerUp = (e) => {
    if (!isDragging || !draggedItem) return;

    const dropZones = document.querySelectorAll('.dd-drop-zone');
    let droppedOnZone = null;

    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        droppedOnZone = zone.dataset.zoneid;
      }
    });

    if (droppedOnZone) processDrop(draggedItem, droppedOnZone);

    setDraggedItem(null);
    setIsDragging(false);
    setHoveredZone(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, draggedItem, filledZones]);

  const processDrop = (draggableId, zoneId) => {
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
  };

  const renderDropZone = (zone, index) => {
    const isFilled = !!filledZones[zone.id];
    const isShaking = shakeZone === zone.id;
    const isHovered = hoveredZone === zone.id && !isFilled && draggedItem;
    const isOperator = zone.placeholder && zone.placeholder.length <= 2;

    let className = "dd-drop-zone";
    if (isFilled && !showFinalState) className += " correct";
    if (isShaking) className += " shake wrong";
    if (showFinalState && isFilled) className += " final";
    if (isHovered) className += " hovered";
    if (isOperator) className += " operator-zone";

    const filledText = isFilled ? getDraggableText(filledZones[zone.id]) : zone.placeholder;

    return React.createElement(
      "span",
      {
        key: zone.id,
        className: className,
        "data-zoneid": zone.id
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
        onPointerDown: (e) => handlePointerDown(e, draggable.id)
      },
      draggable.text
    );
  };

  const renderDragGhost = () => {
    if (!isDragging || !draggedItem) return null;
    const draggable = dragDropData.draggables.find(d => d.id === draggedItem);
    if (!draggable) return null;

    return React.createElement("div", {
      ref: dragGhostRef,
      className: "dd-drag-ghost",
      style: {
        position: "fixed",
        left: dragPosition.x,
        top: dragPosition.y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 9999
      }
    }, draggable.text);
  };

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
          src: imageSrc || "assets/compute1.png",
          alt: APP_DATA.calculation?.altTexts?.flowerPots || APP_DATA.altTexts?.calculationVisual,
          className: "dd-image"
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
        React.createElement(
          "div",
          { className: "dd-equation-line" },
          "= ",
          dragDropData.dropZones.map((zone, i) =>
            React.createElement(React.Fragment, { key: zone.id },
              renderDropZone(zone, i),
              i < dragDropData.dropZones.length - 1 ? " " : null
            )
          )
        )
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
        React.createElement(
          "div",
          { className: "dd-draggables-row" },
          dragDropData.draggables.filter(d => d.text.length > 2).map(renderDraggable)
        ),
        React.createElement(
          "div",
          { className: "dd-draggables-row operators" },
          dragDropData.draggables.filter(d => d.text.length <= 2).map(renderDraggable)
        )
      )
    ),
    renderDragGhost()
  );
};
