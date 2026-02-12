const DragDropPanel = ({ appData, onComplete, onEnableNext, onUpdateNavText, imageSrc, dragDropKey, step, findingInstance }) => {
  const { useState, useEffect, useRef } = React;

  const dataSource = appData || (typeof APP_DATA !== "undefined" ? APP_DATA : {});
  const dragDropData = dataSource[dragDropKey] || dataSource.dragDrop1 || {};

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

  const draggablesList = dragDropData.draggables || [];
  const dropZonesList = dragDropData.dropZones || [];

  useEffect(() => {
    setFilledZones({});
    setAvailableDraggables((dragDropData.draggables || []).map(d => d.id));
    setAllComplete(false);
    setShowFinalState(false);
    setUsedTextValues([]);
    setHoveredZone(null);
    setDraggedItem(null);
    setIsDragging(false);
  }, [dragDropKey, appData]);

  useEffect(() => {
    if (dropZonesList.length === 0) return;
    const allFilled = dropZonesList.every(zone => filledZones[zone.id]);
    if (allFilled && !allComplete) {
      setAllComplete(true);
      if (window.playSound) window.playSound("correct");
      const stepData = (dataSource.steps && dataSource.steps[step]) || {};
      setTimeout(() => {
        setShowFinalState(true);
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText && stepData.navTextCorrect) onUpdateNavText(stepData.navTextCorrect);
      }, 1000);
    }
  }, [filledZones, allComplete, step, dropZonesList.length]);

  const getDraggableText = (id) => {
    const draggable = dragDropData.draggables.find(d => d.id === id);
    return draggable ? draggable.text : "";
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

  const processDrop = (draggableId, zoneId) => {
    if (!draggableId || filledZones[zoneId]) return;

    const zone = dropZonesList.find(z => z.id === zoneId);
    const draggable = draggablesList.find(d => d.id === draggableId);
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

    let className = "dd-drop-zone";
    if (!isFilled) className += " empty";
    if (isFilled && !showFinalState) className += " correct";
    if (isShaking) className += " shake wrong";
    if (showFinalState && isFilled) className += " final";
    if (isHovered) className += " hovered";

    const displayText = isFilled ? getDraggableText(filledZones[zone.id]) : (zone.placeholder || "");

    return React.createElement(
      "span",
      {
        key: zone.id,
        className: className,
        "data-zoneid": zone.id,
      },
      displayText
    );
  };

  const renderEquationLine = () => {
    const segments = dragDropData.equationLineSegments;
    if (segments && segments.length > 0 && dropZonesList.length > 0) {
      const parts = [];
      segments.forEach((seg, i) => {
        parts.push(React.createElement("span", { key: `seg-${i}` }, seg));
        if (i < dropZonesList.length) {
          parts.push(renderDropZone(dropZonesList[i], i));
        }
      });
      return parts;
    }
    return [
      "= ",
      renderDropZone(dropZonesList[0], 0),
      " ",
      renderDropZone(dropZonesList[1], 1),
      " ",
      dropZonesList[2] ? renderDropZone(dropZonesList[2], 2) : null
    ].filter(Boolean);
  };

  const renderEquationWithAlignedEquals = () => {
    const label = dragDropData.equationLabel || "";
    const labelIdx = label.indexOf("=");
    const labelLhs = labelIdx >= 0 ? label.slice(0, labelIdx).trim() : label;
    const labelRhs = labelIdx >= 0 ? label.slice(labelIdx + 1).trim() : "";

    const segments = dragDropData.equationLineSegments;
    let lineLhs = [];
    let lineRhs = [];
    if (segments && segments.length > 0 && dropZonesList.length > 0) {
      let beforeEq = true;
      segments.forEach((seg, i) => {
        const eqPos = seg.indexOf("=");
        if (eqPos >= 0) {
          const before = seg.slice(0, eqPos);
          const after = seg.slice(eqPos + 1);
          if (beforeEq) {
            if (before.length) lineLhs.push(React.createElement("span", { key: `ls-${i}-b` }, before));
            beforeEq = false;
            if (after.length) lineRhs.push(React.createElement("span", { key: `rs-${i}-a` }, after));
          } else {
            lineRhs.push(React.createElement("span", { key: `rs-${i}` }, seg));
          }
        } else {
          if (beforeEq) lineLhs.push(React.createElement("span", { key: `ls-${i}` }, seg));
          else lineRhs.push(React.createElement("span", { key: `rs-${i}` }, seg));
        }
        if (i < dropZonesList.length) {
          const zoneEl = renderDropZone(dropZonesList[i], i);
          if (beforeEq) lineLhs.push(zoneEl);
          else lineRhs.push(zoneEl);
        }
      });
    } else {
      const fallback = renderEquationLine();
      const joined = (Array.isArray(fallback) ? fallback : [fallback]).filter(Boolean);
      let found = false;
      joined.forEach((el, i) => {
        const s = typeof el === "string" ? el : "";
        const eqPos = s.indexOf("=");
        if (eqPos >= 0 && !found) {
          if (eqPos > 0) lineLhs.push(React.createElement("span", { key: `leg-b-${i}` }, s.slice(0, eqPos)));
          found = true;
          if (eqPos < s.length - 1) lineRhs.push(React.createElement("span", { key: `leg-a-${i}` }, s.slice(eqPos + 1)));
        } else if (!found) {
          lineLhs.push(React.isValidElement(el) ? el : React.createElement("span", { key: `leg-l-${i}` }, el));
        } else {
          lineRhs.push(React.isValidElement(el) ? el : React.createElement("span", { key: `leg-r-${i}` }, el));
        }
      });
    }

    return React.createElement(
      "div",
      { className: "dd-equation-table" },
      React.createElement(
        "div",
        { className: "dd-equation-table-row" },
        React.createElement("div", { className: "dd-cell-lhs dd-equation-label" }, labelLhs),
        React.createElement("div", { className: "dd-cell-eq" }, "="),
        React.createElement("div", { className: "dd-cell-rhs dd-equation-label" }, labelRhs)
      ),
      React.createElement(
        "div",
        { className: "dd-equation-table-row" },
        React.createElement("div", { className: "dd-cell-lhs dd-equation-line" }, ...lineLhs),
        React.createElement("div", { className: "dd-cell-eq" }, "="),
        React.createElement("div", { className: "dd-cell-rhs dd-equation-line" }, ...lineRhs)
      )
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
    const draggable = draggablesList.find(d => d.id === draggedItem);
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
        zIndex: 9999,
      },
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
          alt: dataSource.altComputeImage || "Figure",
          className: "dd-image",
        })
      ),
      React.createElement(
        "div",
        { className: "dd-equation-row" },
        renderEquationWithAlignedEquals()
      )
    ),
    React.createElement(
      "div",
      { className: "dd-right-column" },
      React.createElement(
        "div",
        { className: "dd-findings-div" },
        findingInstance
          ? (function () {
              const givenLabel = (dataSource.givenLabel != null) ? dataSource.givenLabel : "Given:";
              const findingsLabel = (dataSource.findingsLabel != null) ? dataSource.findingsLabel : "Findings:";
              const givenList = findingInstance.givenList || [];
              const findingsList = findingInstance.findingsList || [];
              return React.createElement(
                React.Fragment,
                null,
                React.createElement("div", { className: "dd-findings-format-section" },
                  React.createElement("div", { className: "dd-findings-label" }, givenLabel),
                  React.createElement("ul", { className: "dd-findings-list" },
                    givenList.map((item, i) => React.createElement("li", { key: `g-${i}` }, item))
                  )
                ),
                findingsList.length > 0 && React.createElement("div", { className: "dd-findings-format-section" },
                  React.createElement("div", { className: "dd-findings-label" }, findingsLabel),
                  React.createElement("ul", { className: "dd-findings-list" },
                    findingsList.map((item, i) => React.createElement("li", { key: `f-${i}` }, item))
                  )
                )
              );
            })()
          : React.createElement(React.Fragment, null,
              dragDropData.findingsTitle != null && React.createElement("div", { className: "dd-findings-title" }, dragDropData.findingsTitle),
              React.createElement(
                "ul",
                { className: "dd-findings-list" },
                (dragDropData.findingsList || []).map((item, index) =>
                  React.createElement("li", { key: `finding-${index}` }, item)
                )
              )
            )
      ),
      React.createElement(
        "div",
        { className: "dd-draggables-container" },
        React.createElement(
          "div",
          { className: "dd-draggables-row" },
          draggablesList.filter(d => d.text.length > 2).map(renderDraggable)
        ),
        React.createElement(
          "div",
          { className: "dd-draggables-row operators" },
          draggablesList.filter(d => d.text.length <= 2).map(renderDraggable)
        )
      )
    ),
    renderDragGhost()
  );
};
