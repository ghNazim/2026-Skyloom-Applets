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
  }, [dragDropKey, step]);

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

    const dropZones = document.querySelectorAll(".dd-drop-zone");
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

    const dropZones = document.querySelectorAll(".dd-drop-zone");
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
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging, draggedItem, filledZones]);

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
        className: `dd-draggable ${isBeingDragged ? "dragging" : ""}`,
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

  const calculation = APP_DATA.calculation || {};
  const altTexts = calculation.altTexts || {};
  const altText = (dragDropData.altTextImage && altTexts[dragDropData.altTextImage])
    ? altTexts[dragDropData.altTextImage]
    : altTexts.stones || (APP_DATA.labels && APP_DATA.labels.altImage) || "";

  return React.createElement(
    "div",
    { className: "drag-drop-panel" },
    React.createElement(
      "div",
      { className: "dd-left-column" },
      dragDropData.showQuestionInsteadOfImage
        ? React.createElement(
            "div",
            { className: "dd-question-row" },
            React.createElement("div", { className: "dd-question-text" }, dragDropData.questionText || "")
          )
        : React.createElement(
            "div",
            { className: "dd-image-row" },
            React.createElement("img", {
              src: imageSrc || "assets/compute1.png",
              alt: altText,
              className: "dd-image",
            })
          ),
      React.createElement(
        "div",
        { className: "dd-equation-row" },
        dragDropData.equationLabel
          ? React.createElement("div", { className: "dd-equation-label" }, dragDropData.equationLabel)
          : null,
        React.createElement(
          "div",
          { className: "dd-equation-line" },
          dragDropData.equationLineParts
            ? dragDropData.equationLineParts.map((part, i) =>
                typeof part === "number"
                  ? renderDropZone(dragDropData.dropZones[part], part)
                  : part
              )
            : (() => {
                const pre = dragDropData.equationRowPrefix || "= ";
                const zones = dragDropData.dropZones.map((z, i) => renderDropZone(z, i));
                const out = [pre];
                zones.forEach((z, i) => {
                  if (i) out.push(" ");
                  out.push(z);
                });
                return out;
              })()
        )
      )
    ),
    React.createElement(
      "div",
      { className: "dd-right-column" },
      dragDropData.showFindings && dragDropData.findingsList && dragDropData.findingsList.length > 0
        ? React.createElement(
            "div",
            { className: "dd-findings-div" },
            React.createElement(
              "div",
              { className: "dd-findings-title" },
              dragDropData.findingsTitle || (APP_DATA.labels && APP_DATA.labels.findings) || ""
            ),
            React.createElement(
              "ul",
              { className: "dd-findings-list" },
              dragDropData.findingsList.map((item, index) =>
                React.createElement("li", { key: `finding-${index}` }, item)
              )
            )
          )
        : null,
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
