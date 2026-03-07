const Scale = ({ question, onCorrectDrop, onWrongDrop, onAllComplete }) => {
  const { useState, useEffect, useRef } = React;

  const scalePositions = APP_DATA.scalePositions;
  const draggablesData = question.draggables;
  const placeholderImg = question.placeholderImage;
  const maxPerZone = question.maxPerZone || 2;
  const itemSize = question.itemSize || "8vw";

  const getCorrectFeedback = (draggable) => {
    const template = APP_DATA.correctTemplates[draggable.dropzone] || "";
    return template
      .replace(/{coloredItem}/g, draggable.coloredItem || "")
      .replace(/{items}/g, question.items || "");
  };

  const getWrongFeedback = (targetZone) => {
    const template = APP_DATA.wrongTemplates[targetZone] || "";
    return template
      .replace(/{item}/g, question.item || "")
      .replace(/{items}/g, question.items || "");
  };

  const [availableItems, setAvailableItems] = useState(
    () => draggablesData.map((d) => d.id)
  );
  const [placedItems, setPlacedItems] = useState(() => {
    const init = {};
    for (let i = 1; i <= 5; i++) init[i] = [];
    return init;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [shakeZone, setShakeZone] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const draggedRef = useRef(null);
  const placedRef = useRef(placedItems);
  const completeRef = useRef(false);

  useEffect(() => {
    placedRef.current = placedItems;
  }, [placedItems]);

  useEffect(() => {
    if (availableItems.length === 0 && !completeRef.current) {
      completeRef.current = true;
      setIsComplete(true);
      setTimeout(() => {
        playSound("congrats");
        onAllComplete(question.completeFeedback);
      }, 2000);
    }
  }, [availableItems]);

  const getIndexPct = (idx) => idx * 25;

  // ── Pointer-based drag & drop ─────────────────────────────────────
  const handlePointerDown = (e, itemId) => {
    if (completeRef.current) return;
    e.preventDefault();
    draggedRef.current = itemId;
    setDraggedItemId(itemId);
    setDragPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e) => {
      e.preventDefault();
      setDragPos({ x: e.clientX, y: e.clientY });
    };

    const onUp = (e) => {
      const itemId = draggedRef.current;
      if (!itemId) {
        finish();
        return;
      }

      const draggable = draggablesData.find((d) => d.id === itemId);
      if (!draggable) {
        finish();
        return;
      }

      const zones = document.querySelectorAll(".scale-dropzone");
      let targetZone = null;
      zones.forEach((z) => {
        const r = z.getBoundingClientRect();
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        ) {
          targetZone = parseInt(z.dataset.zone, 10);
        }
      });

      if (targetZone) {
        const currentPlaced = placedRef.current[targetZone] || [];

        if (draggable.dropzone === targetZone && currentPlaced.length < maxPerZone) {
          playSound("correct");
          setPlacedItems((prev) => ({
            ...prev,
            [targetZone]: [
              ...prev[targetZone],
              { id: draggable.id, img: draggable.img },
            ],
          }));
          setAvailableItems((prev) => prev.filter((id) => id !== itemId));
          onCorrectDrop(getCorrectFeedback(draggable));
        } else {
          playSound("wrong");
          setShakeZone(null);
          requestAnimationFrame(() => {
            setShakeZone(targetZone);
            setTimeout(() => setShakeZone(null), 450);
          });
          onWrongDrop(getWrongFeedback(targetZone));
        }
      }

      finish();
    };

    const finish = () => {
      draggedRef.current = null;
      setDraggedItemId(null);
      setIsDragging(false);
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging]);

  // ── Rendering helpers ─────────────────────────────────────────────
  const renderDropzone = (zoneIdx) => {
    const placed = placedItems[zoneIdx] || [];
    const showPlaceholder = !isComplete && placed.length < maxPerZone;
    const isShaking = shakeZone === zoneIdx;

    const children = [];
    placed.forEach((item) => {
      children.push(
        React.createElement("img", {
          key: "item-" + item.id,
          src: item.img,
          className: "scale-dropzone-item",
          draggable: false,
          alt: item.id,
        })
      );
    });

    if (showPlaceholder) {
      children.push(
        React.createElement("img", {
          key: "ph-" + zoneIdx,
          src: placeholderImg,
          className: "scale-dropzone-placeholder",
          draggable: false,
          alt: "drop here",
        })
      );
    }

    return React.createElement(
      "div",
      {
        key: "dz-" + zoneIdx,
        className: "scale-dropzone" + (isShaking ? " shake" : ""),
        "data-zone": String(zoneIdx),
        style: { left: getIndexPct(zoneIdx - 1) + "%" },
      },
      children
    );
  };

  const renderDraggable = (itemId) => {
    const item = draggablesData.find((d) => d.id === itemId);
    if (!item) return null;
    const beingDragged = draggedItemId === itemId;

    return React.createElement(
      "div",
      {
        key: item.id,
        className: "scale-draggable" + (beingDragged ? " dragging" : ""),
        onPointerDown: (e) => handlePointerDown(e, item.id),
      },
      React.createElement("img", {
        src: item.img,
        className: "scale-draggable-img",
        draggable: false,
        alt: item.id + " book",
      })
    );
  };

  const renderGhost = () => {
    if (!isDragging || !draggedItemId) return null;
    const item = draggablesData.find((d) => d.id === draggedItemId);
    if (!item) return null;

    return React.createElement(
      "div",
      {
        className: "scale-drag-ghost",
        style: {
          position: "fixed",
          left: dragPos.x + "px",
          top: dragPos.y + "px",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
        },
      },
      React.createElement("img", {
        src: item.img,
        className: "scale-ghost-img",
        draggable: false,
        alt: item.id,
      })
    );
  };

  // ── Main render ───────────────────────────────────────────────────
  return React.createElement(
    "div",
    { className: "scale-component", style: { "--item-size": itemSize } },

    React.createElement(
      "div",
      {
        className:
          "scale-main-section" + (isComplete ? " complete" : ""),
      },

      // Labels
      React.createElement(
        "div",
        { className: "scale-labels-row" },
        scalePositions.map((pos, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "scale-label" + (current_language === "id" ? " id" : ""),
              style: { left: i === 0 && current_language === "en" ? "1vw" : getIndexPct(i) + "%", },
            },
            pos.label
          )
        )
      ),

      // Track + dots
      React.createElement(
        "div",
        { className: "scale-track-row" },
        React.createElement("div", { className: "scale-track-line" }),
        scalePositions.map((pos, i) =>
          React.createElement("div", {
            key: i,
            className: "scale-dot",
            style: {
              left: getIndexPct(i) + "%",
              backgroundColor: pos.dotColor,
              boxShadow: "0 0 0.4vw " + pos.dotColor,
            },
          })
        )
      ),

      // Dropzones
      React.createElement(
        "div",
        { className: "scale-dropzones-row" },
        [1, 2, 3, 4, 5].map((zoneIdx) => renderDropzone(zoneIdx))
      )
    ),

    // Draggables
    React.createElement(
      "div",
      { className: "scale-draggables-section" },
      availableItems.map((itemId) => renderDraggable(itemId))
    ),

    renderGhost()
  );
};
