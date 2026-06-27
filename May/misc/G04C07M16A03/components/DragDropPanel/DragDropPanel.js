const DragDropPanel = ({ onComplete, onEnableNext, onUpdateNavText, imageSrc }) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const videoRef = useRef(null);

  const dragDropData = APP_DATA.dragDrop;
  const stepData = APP_DATA.steps[3];
  const useVideoLastFrame = stepData && stepData.useVideoLastFrame;
  const videoSrc = stepData && stepData.videoSrc;
  const zoomImageSrc = stepData && stepData.zoomImageSrc;

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

  useEffect(() => {
    if (videoRef.current && useVideoLastFrame) {
      const video = videoRef.current;
      const setToLastFrame = () => {
        video.currentTime = video.duration;
      };
      if (video.readyState >= 1) {
        setToLastFrame();
      } else {
        video.addEventListener('loadedmetadata', setToLastFrame);
        return () => video.removeEventListener('loadedmetadata', setToLastFrame);
      }
    }
  }, [useVideoLastFrame]);

  useEffect(() => {
    const allFilled = dragDropData.dropZones.every(zone => filledZones[zone.id]);
    if (allFilled && !allComplete) {
      setAllComplete(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setShowFinalState(true);
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[3];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 1000);
    }
  }, [filledZones, allComplete]);

  const getDraggableText = (id) => {
    const draggable = dragDropData.draggables.find(d => d.id === id);
    return draggable ? draggable.text : "";
  };

  const processDrop = useCallback((draggableId, zoneId) => {
    if (!draggableId || filledZones[zoneId]) return;
    const zone = dragDropData.dropZones.find(z => z.id === zoneId);
    const draggable = dragDropData.draggables.find(d => d.id === draggableId);
    if (!zone || !draggable) return;
    if (draggable.text === zone.correctAnswer) {
      if (window.playSound) window.playSound("tick");
      setFilledZones(prev => ({ ...prev, [zoneId]: draggableId }));
      setAvailableDraggables(prev => prev.filter(id => id !== draggableId));
    } else {
      if (window.playSound) window.playSound("wrong");
      setShakeZone(zoneId);
      setTimeout(() => setShakeZone(null), 300);
    }
  }, [filledZones]);

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
  }, [draggedItem, processDrop]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const renderDropZone = (zone) => {
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

  const altWaterTank = (APP_DATA.labels && APP_DATA.labels.waterTankAlt) || "Water tank";
  const altZoom = (APP_DATA.labels && APP_DATA.labels.zoomIndicatorAlt) || "Zoom indicator";

  return React.createElement(
    "div",
    { className: "drag-drop-panel" },
    React.createElement(
      "div",
      { className: "dd-left-column" },
      React.createElement(
        "div",
        { className: "dd-image-row", style: { position: 'relative' } },
        useVideoLastFrame ? React.createElement("video", {
          ref: videoRef,
          src: videoSrc,
          className: "dd-image",
          muted: true,
          playsInline: true,
          preload: "metadata"
        }) : React.createElement("img", {
          src: imageSrc || "assets/compre1.svg",
          alt: altWaterTank,
          className: "dd-image"
        }),
        zoomImageSrc && React.createElement("img", {
          src: zoomImageSrc,
          alt: altZoom,
          className: "zoom-img",
          style: {
            position: 'absolute',
            width: '22vw',
            height: '22vw',
            right: '-2vw',
            top: '-2vw',
            zIndex: 10
          }
        })
      ),
      React.createElement(
        "div",
        { className: "dd-equation-row" },
        React.createElement("div", { className: "dd-equation-label" }, dragDropData.equationLabel),
        React.createElement(
          "div",
          { className: "dd-equation-line" },
          "= ",
          renderDropZone(dragDropData.dropZones[0]),
          " ",
          renderDropZone(dragDropData.dropZones[1]),
          " ",
          renderDropZone(dragDropData.dropZones[2])
        )
      )
    ),
    React.createElement(
      "div",
      { className: "dd-right-column" },
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
