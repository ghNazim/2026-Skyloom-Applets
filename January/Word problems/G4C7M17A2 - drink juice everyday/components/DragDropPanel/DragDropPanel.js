const DragDropPanel = ({ onComplete, onEnableNext, onUpdateNavText, dragDropKey, step, showQuestionInLeft }) => {
  const { useState, useEffect, useRef } = React;
  
  // Get the correct drag drop data based on key
  const dragDropData = APP_DATA[dragDropKey] || APP_DATA.dragDrop1;
  
  // Track filled drop zones
  const [filledZones, setFilledZones] = useState({});
  // Track which draggables are still available
  const [availableDraggables, setAvailableDraggables] = useState(
    dragDropData.draggables.map(d => d.id)
  );
  // Track shake animation for wrong drops
  const [shakeZone, setShakeZone] = useState(null);
  // Track if all complete
  const [allComplete, setAllComplete] = useState(false);
  // Track if showing final state (no green boxes)
  const [showFinalState, setShowFinalState] = useState(false);
  // Track which drop zone is being hovered over
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // Drag state for touch devices
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragGhostRef = useRef(null);
  
  // Track which text values have been used (for swappable zones)
  const [usedTextValues, setUsedTextValues] = useState([]);
  
  // Reset state when dragDropKey changes
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
  
  // Check if all zones are filled correctly
  useEffect(() => {
    const allFilled = dragDropData.dropZones.every(zone => filledZones[zone.id]);
    if (allFilled && !allComplete) {
      setAllComplete(true);
      if (window.playSound) window.playSound("correct");
      
      // After 1 second, remove green boxes and show final state
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
  
  // Get draggable text by id
  const getDraggableText = (id) => {
    const draggable = dragDropData.draggables.find(d => d.id === id);
    return draggable ? draggable.text : "";
  };
  
  // Handle drag start (mouse)
  const handleDragStart = (e, draggableId) => {
    e.dataTransfer.setData("text/plain", draggableId);
    e.dataTransfer.effectAllowed = "move";
    
    // Create custom drag image
    const dragElement = e.target.cloneNode(true);
    dragElement.style.position = "absolute";
    dragElement.style.top = "-9999px";
    dragElement.style.opacity = "1";
    document.body.appendChild(dragElement);
    e.dataTransfer.setDragImage(dragElement, e.target.offsetWidth / 2, e.target.offsetHeight / 2);
    
    setTimeout(() => {
      document.body.removeChild(dragElement);
    }, 0);
    
    // Hide original during drag
    setTimeout(() => {
      e.target.style.opacity = "0";
    }, 0);
    
    setDraggedItem(draggableId);
  };
  
  // Handle drag end (mouse)
  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    setHoveredZone(null);
  };
  
  // Handle drag over
  const handleDragOver = (e, zoneId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!filledZones[zoneId]) {
      setHoveredZone(zoneId);
    }
  };
  
  // Handle drag enter
  const handleDragEnter = (e, zoneId) => {
    e.preventDefault();
    if (!filledZones[zoneId]) {
      setHoveredZone(zoneId);
    }
  };
  
  // Handle drag leave
  const handleDragLeave = (e, zoneId) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setHoveredZone(null);
    }
  };
  
  // Handle drop
  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    setHoveredZone(null);
    const draggableId = e.dataTransfer.getData("text/plain");
    processDrop(draggableId, zoneId);
  };
  
  // Process drop logic (shared between mouse and touch)
  const processDrop = (draggableId, zoneId) => {
    if (!draggableId || filledZones[zoneId]) return;
    
    const zone = dragDropData.dropZones.find(z => z.id === zoneId);
    const draggable = dragDropData.draggables.find(d => d.id === draggableId);
    
    if (!zone || !draggable) return;
    
    // Check if correct
    let isCorrect = false;
    
    if (zone.correctAnswers) {
      // Swappable zone - check if text is in correct answers and not used
      if (zone.correctAnswers.includes(draggable.text) && !usedTextValues.includes(draggable.text)) {
        isCorrect = true;
      }
    } else {
      // Exact match required
      isCorrect = draggable.text === zone.correctAnswer;
    }
    
    if (isCorrect) {
      // Correct drop
      if (window.playSound) window.playSound("tick");
      setFilledZones(prev => ({
        ...prev,
        [zoneId]: draggableId
      }));
      setAvailableDraggables(prev => prev.filter(id => id !== draggableId));
      
      // Track used text value for swappable zones
      if (zone.correctAnswers) {
        setUsedTextValues(prev => [...prev, draggable.text]);
      }
    } else {
      // Wrong drop
      if (window.playSound) window.playSound("wrong");
      setShakeZone(zoneId);
      setTimeout(() => setShakeZone(null), 300);
    }
    
    setDraggedItem(null);
    setIsDragging(false);
  };
  
  // Touch event handlers
  const handleTouchStart = (e, draggableId) => {
    e.preventDefault();
    const touch = e.touches[0];
    setDraggedItem(draggableId);
    setIsDragging(true);
    setDragPosition({
      x: touch.clientX,
      y: touch.clientY
    });
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging || !draggedItem) return;
    e.preventDefault();
    const touch = e.touches[0];
    setDragPosition({
      x: touch.clientX,
      y: touch.clientY
    });
    
    // Check which drop zone we're hovering over
    const dropZones = document.querySelectorAll('.dd-drop-zone');
    let hoveredZoneId = null;
    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        const zoneId = zone.dataset.zoneid;
        if (!filledZones[zoneId]) {
          hoveredZoneId = zoneId;
        }
      }
    });
    setHoveredZone(hoveredZoneId);
  };
  
  const handleTouchEnd = (e) => {
    if (!isDragging || !draggedItem) return;
    e.preventDefault();
    
    // Find which drop zone we're over
    const dropZones = document.querySelectorAll('.dd-drop-zone');
    const touch = e.changedTouches[0];
    
    let droppedOnZone = null;
    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        droppedOnZone = zone.dataset.zoneid;
      }
    });
    
    if (droppedOnZone) {
      processDrop(draggedItem, droppedOnZone);
    }
    
    setDraggedItem(null);
    setIsDragging(false);
    setHoveredZone(null);
  };
  
  // Add global touch move/end listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, draggedItem]);
  
  // Render drop zone
  const renderDropZone = (zone, index) => {
    const isFilled = !!filledZones[zone.id];
    const isShaking = shakeZone === zone.id;
    const isHovered = hoveredZone === zone.id && !isFilled && draggedItem;
    const isOperator = zone.placeholder.length <= 2;
    
    let className = "dd-drop-zone";
    if (isFilled) className += " correct";
    if (isShaking) className += " shake wrong";
    // if (showFinalState && isFilled) className += " final";
    if (isHovered) className += " hovered";
    if (isOperator) className += " operator-zone";
    
    const filledText = isFilled ? getDraggableText(filledZones[zone.id]) : zone.placeholder;
    
    return React.createElement(
      "span",
      {
        key: zone.id,
        className: className,
        "data-zoneid": zone.id,
        onDragOver: (e) => handleDragOver(e, zone.id),
        onDragEnter: (e) => handleDragEnter(e, zone.id),
        onDragLeave: (e) => handleDragLeave(e, zone.id),
        onDrop: (e) => handleDrop(e, zone.id)
      },
      filledText
    );
  };
  
  // Render draggable item
  const renderDraggable = (draggable) => {
    const isAvailable = availableDraggables.includes(draggable.id);
    const isBeingDragged = draggedItem === draggable.id;
    
    if (!isAvailable) return null;
    
    return React.createElement(
      "span",
      {
        key: draggable.id,
        className: `dd-draggable ${isBeingDragged ? 'dragging' : ''}`,
        draggable: true,
        onDragStart: (e) => handleDragStart(e, draggable.id),
        onDragEnd: handleDragEnd,
        onTouchStart: (e) => handleTouchStart(e, draggable.id)
      },
      draggable.text
    );
  };
  
  // Render drag ghost for touch
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
          zIndex: 9999
        }
      },
      draggable.text
    );
  };
  
  // Render vertical layout for drop zones (Step 9, 11)
  const renderVerticalDropZones = () => {
    const isThreeRows = dragDropData.dropZones.length === 5; // 3 values + 2 operators
    const isTwoRows = dragDropData.dropZones.length === 3; // 2 values + 1 operator
    
    if (isThreeRows) {
      // Layout: = [zone1] / [+] [zone3] / [+] [zone5]
      return React.createElement(
        "div",
        { className: "dd-vertical-zones" },
        // Row 1: = [zone1]
        React.createElement(
          "div",
          { className: "dd-vertical-row" },
          React.createElement("span", { className: "dd-row-operator" }, "="),
          renderDropZone(dragDropData.dropZones[0], 0)
        ),
        // Row 2: [+] [zone3]
        React.createElement(
          "div",
          { className: "dd-vertical-row" },
          renderDropZone(dragDropData.dropZones[1], 1),
          renderDropZone(dragDropData.dropZones[2], 2)
        ),
        // Row 3: [+] [zone5]
        React.createElement(
          "div",
          { className: "dd-vertical-row" },
          renderDropZone(dragDropData.dropZones[3], 3),
          renderDropZone(dragDropData.dropZones[4], 4)
        )
      );
    } else if (isTwoRows) {
      // Layout: = [zone1] / [-] [zone3]
      return React.createElement(
        "div",
        { className: "dd-vertical-zones" },
        // Row 1: = [zone1]
        React.createElement(
          "div",
          { className: "dd-vertical-row" },
          React.createElement("span", { className: "dd-row-operator" }, "="),
          renderDropZone(dragDropData.dropZones[0], 0)
        ),
        // Row 2: [-] [zone3]
        React.createElement(
          "div",
          { className: "dd-vertical-row" },
          renderDropZone(dragDropData.dropZones[1], 1),
          renderDropZone(dragDropData.dropZones[2], 2)
        )
      );
    }
    
    // Fallback horizontal layout
    return React.createElement(
      "div",
      { className: "dd-equation-line" },
      "= ",
      dragDropData.dropZones.map((zone, index) => 
        React.createElement(
          React.Fragment,
          { key: zone.id },
          renderDropZone(zone, index),
          index < dragDropData.dropZones.length - 1 ? " " : null
        )
      )
    );
  };
  
  return React.createElement(
    "div",
    { className: "drag-drop-panel" },
    // Left column - Question and Equation
    React.createElement(
      "div",
      { className: "dd-left-column" },
      // Question row (if showQuestionInLeft)
      showQuestionInLeft && React.createElement(
        "div",
        { className: "dd-question-row" },
        APP_DATA.questionText
      ),
      // Equation row
      React.createElement(
        "div",
        { className: `dd-equation-row ${showQuestionInLeft ? 'with-question' : ''}` },
        React.createElement(
          "div",
          { className: "dd-equation-label" },
          dragDropData.equationLabel
        ),
        dragDropData.isVerticalLayout ? 
          renderVerticalDropZones() :
          React.createElement(
            "div",
            { className: "dd-equation-line" },
            "= ",
            dragDropData.dropZones.map((zone, index) => 
              React.createElement(
                React.Fragment,
                { key: zone.id },
                renderDropZone(zone, index),
                index < dragDropData.dropZones.length - 1 ? " " : null
              )
            )
          )
      )
    ),
    // Right column - Draggables only (no findings for this applet)
    React.createElement(
      "div",
      { className: "dd-right-column no-findings" },
      // Draggables container
      React.createElement(
        "div",
        { className: "dd-draggables-container full-height" },
        // Text items (statements)
        React.createElement(
          "div",
          { className: "dd-draggables-row statements" },
          dragDropData.draggables.filter(d => d.text.length > 2).map(renderDraggable)
        ),
        // Operators
        React.createElement(
          "div",
          { className: "dd-draggables-row operators" },
          dragDropData.draggables.filter(d => d.text.length <= 2).map(renderDraggable)
        )
      )
    ),
    // Drag ghost for touch
    renderDragGhost()
  );
};
