const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onGoToFinal } = props;
  const { useState, useEffect, useRef } = React;

  const questions = APP_DATA.questions;
  const totalCards = questions.length;
  const cardColors = ["#f8d7da", "#d1ecf1", "#d4edda", "#fff3cd"];
  const ROTATION_STEP = 5;

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [phase, setPhase] = useState("dragging");
  const [baseZoneLabel, setBaseZoneLabel] = useState(null);
  const [expZoneLabel, setExpZoneLabel] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [cardExiting, setCardExiting] = useState(false);
  const [draggingLabel, setDraggingLabel] = useState(null);

  const dragRef = useRef(null);
  const ghostRef = useRef(null);
  const containerRef = useRef(null);
  const baseDropRef = useRef(null);
  const expDropRef = useRef(null);

  useEffect(() => {
    window.__cardDeckNext = () => {
      if (!animationDone) return;
      handleNextCard();
    };
    return () => {
      delete window.__cardDeckNext;
    };
  }, [animationDone, currentCardIndex]);

  const handleNextCard = () => {
    if (currentCardIndex >= totalCards - 1) {
      onGoToFinal();
      return;
    }
    setCardExiting(true);
    setTimeout(() => {
      setCardExiting(false);
      setCurrentCardIndex((prev) => prev + 1);
      resetInteraction();
    }, 400);
  };

  const resetInteraction = () => {
    setPhase("dragging");
    setBaseZoneLabel(null);
    setExpZoneLabel(null);
    setFeedbackType(null);
    setIsFlipped(false);
    setAnimationDone(false);
    setDraggingLabel(null);
    onSetNextEnabled(false);
    onUpdateTexts(APP_DATA.steps[1].navText);
  };

  const checkDropValidity = (newBaseZone, newExpZone) => {
    if (newBaseZone === null || newExpZone === null) return;

    setPhase("checking");
    onUpdateTexts("");

    const isCorrect = newBaseZone === "base" && newExpZone === "exponent";
    setFeedbackType(isCorrect ? "correct" : "wrong");

    if (isCorrect && typeof playSound === "function") playSound("correct");
    if (!isCorrect && typeof playSound === "function") playSound("wrong");

    setTimeout(() => {
      setIsFlipped(true);
      setTimeout(() => {
        setAnimationDone(true);
        onSetNextEnabled(true);
        const isLast = currentCardIndex >= totalCards - 1;
        onUpdateTexts(
          isLast ? APP_DATA.steps[1].navLast : APP_DATA.steps[1].navDone
        );
      }, 600);
    }, 500);
  };

  const getDropZoneRect = (ref) => {
    if (!ref.current) return null;
    return ref.current.getBoundingClientRect();
  };

  const isInsideRect = (x, y, rect) => {
    if (!rect) return false;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const createGhost = (el, x, y, offsetX, offsetY) => {
    const ghost = el.cloneNode(true);
    const rect = el.getBoundingClientRect();
    ghost.style.position = "fixed";
    ghost.style.left = (x - offsetX) + "px";
    ghost.style.top = (y - offsetY) + "px";
    ghost.style.width = rect.width + "px";
    ghost.style.zIndex = "1000";
    ghost.style.margin = "0";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0.9";
    ghost.classList.add("drag-ghost");
    document.body.appendChild(ghost);
    return ghost;
  };

  const handlePointerDown = (e, labelType) => {
    if (phase !== "dragging") return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const ghost = createGhost(el, e.clientX, e.clientY, offsetX, offsetY);
    ghostRef.current = ghost;

    dragRef.current = {
      labelType,
      element: el,
      offsetX,
      offsetY,
    };

    setDraggingLabel(labelType);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current || !ghostRef.current) return;
    const d = dragRef.current;
    const newX = e.clientX - d.offsetX;
    const newY = e.clientY - d.offsetY;
    ghostRef.current.style.left = newX + "px";
    ghostRef.current.style.top = newY + "px";
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    d.element.releasePointerCapture(e.pointerId);

    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }

    const centerX = e.clientX;
    const centerY = e.clientY;

    const baseRect = getDropZoneRect(baseDropRef);
    const expRect = getDropZoneRect(expDropRef);

    let droppedOnZone = null;
    if (isInsideRect(centerX, centerY, baseRect)) {
      droppedOnZone = "base";
    } else if (isInsideRect(centerX, centerY, expRect)) {
      droppedOnZone = "exponent";
    }

    if (droppedOnZone) {
      const zoneOccupied =
        (droppedOnZone === "base" && baseZoneLabel !== null) ||
        (droppedOnZone === "exponent" && expZoneLabel !== null);

      if (!zoneOccupied) {
        if (typeof playSound === "function") playSound("tick");

        if (droppedOnZone === "base") {
          setBaseZoneLabel(d.labelType);
          checkDropValidity(d.labelType, expZoneLabel);
        } else {
          setExpZoneLabel(d.labelType);
          checkDropValidity(baseZoneLabel, d.labelType);
        }
      }
    }

    setDraggingLabel(null);
    dragRef.current = null;
  };

  const getDropZoneFill = (zone) => {
    const label = zone === "base" ? baseZoneLabel : expZoneLabel;
    if (label === null) return "transparent";
    if (feedbackType === null) return "#b0bec5";
    if (feedbackType === "correct") return "#81c784";
    return "#e57373";
  };

  const getDropZoneDisplayText = (zone) => {
    const label = zone === "base" ? baseZoneLabel : expZoneLabel;
    if (label === null) return null;
    return label === "base" ? APP_DATA.labels.base : APP_DATA.labels.exponent;
  };

  const isLabelUsed = (labelType) => {
    return baseZoneLabel === labelType || expZoneLabel === labelType;
  };

  const renderCardFront = (q, isTop, expNumClass) => {
    const baseZoneFill = isTop ? getDropZoneFill("base") : "transparent";
    const expZoneFill = isTop ? getDropZoneFill("exponent") : "transparent";
    const baseText = isTop ? getDropZoneDisplayText("base") : null;
    const expText = isTop ? getDropZoneDisplayText("exponent") : null;

    return React.createElement(
      "div",
      { className: "flip-card-front" },
      React.createElement(
        "div",
        { className: "card-expression" },
        React.createElement(
          "div",
          {
            ref: isTop ? baseDropRef : null,
            className: "card-base-zone",
            style: {
              backgroundColor: baseZoneFill,
              borderColor:
                isTop
                  ? feedbackType === "correct"
                    ? "#388e3c"
                    : feedbackType === "wrong"
                    ? "#c62828"
                    : "#666"
                  : "#666",
            },
          },
          baseText &&
            React.createElement(
              "span",
              { className: "dropped-label" },
              baseText
            ),
          React.createElement(
            "span",
            {
              className: "card-base-number",
              style: {
                visibility: baseText ? "hidden" : "visible",
              },
            },
            q.base
          )
        ),
        React.createElement(
          "div",
          {
            ref: isTop ? expDropRef : null,
            className: "card-exp-zone",
            style: {
              backgroundColor: expZoneFill,
              borderColor:
                isTop
                  ? feedbackType === "correct"
                    ? "#388e3c"
                    : feedbackType === "wrong"
                    ? "#c62828"
                    : "#666"
                  : "#666",
            },
          },
          expText &&
            React.createElement(
              "span",
              { className: "dropped-label" },
              expText
            ),
          React.createElement(
            "span",
            {
              className: expNumClass,
              style: {
                visibility: expText ? "hidden" : "visible",
              },
            },
            q.exponent
          )
        )
      )
    );
  };

  const renderCardBack = (q, colorIdx, expNumClass) => {
    return React.createElement(
      "div",
      {
        className: "flip-card-back",
        style: { backgroundColor: cardColors[colorIdx] },
      },
      React.createElement(
        "div",
        { className: "card-expression" },
        React.createElement(
          "div",
          { className: "card-base-zone zone-revealed" },
          React.createElement(
            "span",
            { className: "zone-label-anim" },
            APP_DATA.labels.base + " \u2192"
          ),
          React.createElement(
            "span",
            { className: "card-base-number" },
            q.base
          )
        ),
        React.createElement(
          "div",
          { className: "card-exp-zone zone-revealed" },
          React.createElement(
            "span",
            { className: "zone-label-anim" },
            APP_DATA.labels.exponent + " \u2192"
          ),
          React.createElement(
            "span",
            { className: expNumClass },
            q.exponent
          )
        )
      )
    );
  };

  const renderCardDeck = () => {
    const cards = [];
    const visibleCount = Math.min(totalCards - currentCardIndex, 5);

    for (let i = visibleCount - 1; i >= 0; i--) {
      const cardIdx = currentCardIndex + i;
      if (cardIdx >= totalCards) continue;

      const isTop = i === 0;
      const rotation = i * ROTATION_STEP;
      const colorIdx = cardIdx % cardColors.length;
      const zIndex = 10 + (visibleCount - i);
      const scale = 1 - i * 0.02;
      const offsetY = i * 3;

      const q = questions[cardIdx];
      const isTwoDigitBase = String(q.base).length >= 2;
      const expNumClass = "card-exp-number" + (isTwoDigitBase ? " two-digit" : "");

      const outerStyle = {
        position: "absolute",
        zIndex: zIndex,
        transform: `rotate(${rotation}deg) scale(${scale}) translateY(${offsetY}px)`,
        transition: "transform 0.4s ease, opacity 0.4s ease",
      };

      if (isTop && cardExiting) {
        outerStyle.transform = "translateX(-120%) rotate(-15deg)";
        outerStyle.opacity = "0";
      }

      const innerClass =
        "flip-card-inner" + (isTop && isFlipped ? " flipped" : "");

      cards.push(
        React.createElement(
          "div",
          {
            key: "card-" + cardIdx,
            className: "flip-card",
            style: outerStyle,
          },
          React.createElement(
            "div",
            {
              className: innerClass,
              style: { backgroundColor: cardColors[colorIdx] },
            },
            renderCardFront(q, isTop, expNumClass),
            isTop && renderCardBack(q, colorIdx, expNumClass)
          )
        )
      );
    }

    return React.createElement(
      "div",
      { className: "card-deck-container" },
      cards
    );
  };

  const renderRightPanel = () => {
    if (animationDone) {
      const isCorrect = feedbackType === "correct";
      return React.createElement(
        "div",
        { className: "right-panel" },
        React.createElement(
          "div",
          {
            className:
              "feedback-box " +
              (isCorrect ? "feedback-correct" : "feedback-wrong"),
          },
          isCorrect ? APP_DATA.feedback.correct : APP_DATA.feedback.wrong
        )
      );
    }

    const currentQ = questions[currentCardIndex];
    const labelOrder = currentQ.optionFlip
      ? ["exponent", "base"]
      : ["base", "exponent"];

    const renderDragLabel = (labelType) => {
      const isUsed = isLabelUsed(labelType);
      const labelText =
        labelType === "base"
          ? APP_DATA.labels.base
          : APP_DATA.labels.exponent;

      return React.createElement(
        "div",
        {
          key: labelType,
          className: "drag-label",
          onPointerDown: (e) => !isUsed && handlePointerDown(e, labelType),
          onPointerMove: handlePointerMove,
          onPointerUp: handlePointerUp,
          style: {
            touchAction: "none",
            opacity: isUsed || draggingLabel === labelType ? 0 : 1,
          },
        },
        labelText
      );
    };

    return React.createElement(
      "div",
      { className: "right-panel" },
      React.createElement(
        "div",
        { className: "draggable-labels" },
        labelOrder.map(renderDragLabel)
      )
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container", ref: containerRef },
    React.createElement(
      "div",
      { className: "canvas-two-col" },
      React.createElement(
        "div",
        { className: "left-panel" },
        renderCardDeck()
      ),
      renderRightPanel()
    )
  );
};
