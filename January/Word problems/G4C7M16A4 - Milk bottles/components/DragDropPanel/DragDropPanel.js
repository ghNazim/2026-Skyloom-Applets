const DragDropPanel = ({ onComplete, onEnableNext, onUpdateNavText, imageSrc, dragDropKey, step }) => {
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
  
  // Check if a drop is correct
  const isDropCorrect = (zone, draggableText) => {
    // If zone has correctAnswers array (swappable), check if draggable is in the array
    if (zone.correctAnswers) {
      // Check if this text value is in the correct answers and hasn't been used yet
      if (zone.correctAnswers.includes(draggableText)) {
        // For swappable zones, make sure this value hasn't been used in another zone
        return !usedTextValues.includes(draggableText);
      }
      return false;
    }
    // Otherwise check exact match
    return draggable => draggableText === zone.correctAnswer;
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
    // Only clear hover if we're actually leaving the zone (not entering a child)
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
    // e.preventDefault();
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
    // e.preventDefault();
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
    // e.preventDefault();
    
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
  
  return React.createElement(
    "div",
    { className: "drag-drop-panel" },
    // Left column - Image and Equation
    React.createElement(
      "div",
      { className: "dd-left-column" },
      // Image row (35% height)
      React.createElement(
        "div",
        { className: "dd-image-row" },
        React.createElement("img", {
          src: imageSrc || "assets/compute1.png",
          alt: APP_DATA.calculation.altTexts.milkBottles,
          className: "dd-image"
        })
      ),
      // Equation row (rest height)
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
          renderDropZone(dragDropData.dropZones[0], 0),
          " ",
          renderDropZone(dragDropData.dropZones[1], 1),
          " ",
          renderDropZone(dragDropData.dropZones[2], 2)
        )
      )
    ),
    // Right column - Findings div + Draggables
    React.createElement(
      "div",
      { className: "dd-right-column" },
      // Findings div on top
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
      // Draggables container
      React.createElement(
        "div",
        { className: "dd-draggables-container" },
        // First row of draggables (text items)
        React.createElement(
          "div",
          { className: "dd-draggables-row" },
          dragDropData.draggables.filter(d => d.text.length > 2).map(renderDraggable)
        ),
        // Second row of draggables (operators)
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
