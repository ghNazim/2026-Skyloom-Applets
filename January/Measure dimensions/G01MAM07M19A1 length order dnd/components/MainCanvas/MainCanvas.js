const MainCanvas = (props) => {
  const {
    question,
    questionIndex,
    onSetNextEnabled,
    onUpdateTexts,
    hasMoreQuestions,
  } = props;
  const { useState, useEffect, useRef, useCallback } = React;

  const [order, setOrder] = useState([0, 1, 2]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [optionBgClass, setOptionBgClass] = useState("");
  const [lockDrag, setLockDrag] = useState(false);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [ghostDimensions, setGhostDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [hoverIndex, setHoverIndex] = useState(null);
  const optionRefs = useRef([]);

  const step1 = APP_DATA.step1 || {};

  useEffect(() => {
    if (!question) return;
    setOrder([0, 1, 2]);
    setHasChecked(false);
    setIsCorrect(null);
    setFeedbackVisible(false);
    setOptionBgClass("");
    setLockDrag(false);
    setDraggedIndex(null);
    setHoverIndex(null);
    onSetNextEnabled(false);
    onUpdateTexts(step1.navText);
  }, [question, questionIndex]);

  const getCorrectOrder = useCallback(() => {
    if (!question) return [];
    const isL2s = question.question_type === "l2s";
    return question.options
      .map((opt, i) => ({ i, count: opt.count }))
      .sort((a, b) => (isL2s ? b.count - a.count : a.count - b.count))
      .map((x) => x.i);
  }, [question]);

  const checkAnswer = useCallback(() => {
    if (!question || (hasChecked && isCorrect)) return;
    const correct = getCorrectOrder();
    const currentCounts = order.map((i) => question.options[i].count);
    const correctCounts = correct.map((i) => question.options[i].count);
    const correctArr =
      JSON.stringify(currentCounts) === JSON.stringify(correctCounts);

    setHasChecked(true);
    setFeedbackVisible(true);
    setIsCorrect(correctArr);

    if (correctArr) {
      if (typeof playSound === "function") playSound("correct");
      setOptionBgClass("option-correct");
      setLockDrag(true);
      onSetNextEnabled(true);
      onUpdateTexts(hasMoreQuestions ? step1.navCorrect : step1.navLast);
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setOptionBgClass("option-wrong");
    }
  }, [
    question,
    order,
    hasChecked,
    isCorrect,
    getCorrectOrder,
    hasMoreQuestions,
    step1,
  ]);

  const handlePointerDown = useCallback(
    (e, index) => {
      if (!question || lockDrag || (hasChecked && isCorrect)) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = e.currentTarget.getBoundingClientRect();
      setDraggedIndex(index);
      setDragPosition({ x: e.clientX, y: e.clientY });
      setGhostDimensions({ width: rect.width, height: rect.height });
      if (isCorrect === false) {
        setFeedbackVisible(false);
        setOptionBgClass("");
      }
    },
    [question, lockDrag, hasChecked, isCorrect],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (draggedIndex === null) return;
      setDragPosition({ x: e.clientX, y: e.clientY });

      const container = document.querySelector(".ordering-options-container");
      const optionDivs = container
        ? container.querySelectorAll(".ordering-option")
        : [];
      let foundIndex = null;
      optionDivs.forEach((div, i) => {
        const rect = div.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          foundIndex = i;
        }
      });
      setHoverIndex(foundIndex);
    },
    [draggedIndex],
  );

  const handlePointerUp = useCallback(() => {
    if (draggedIndex === null) return;

    if (hoverIndex !== null && hoverIndex !== draggedIndex) {
      setOrder((prev) => {
        const next = [...prev];
        const temp = next[draggedIndex];
        next[draggedIndex] = next[hoverIndex];
        next[hoverIndex] = temp;
        return next;
      });
    }

    setDraggedIndex(null);
    setHoverIndex(null);
  }, [draggedIndex, hoverIndex]);

  useEffect(() => {
    if (draggedIndex === null) return;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [draggedIndex, handlePointerMove, handlePointerUp]);

  if (!question) {
    return React.createElement("div", {
      className: "main-canvas-container ordering-main-canvas",
    });
  }

  const unitLength = question.unit_length || "6vw";
  const unitNamePlural = question.unit_name_plural || "";
  const unitImage = question.unit_image || "";

  const getOptionForSlot = (slotIndex) => {
    if (draggedIndex !== null && hoverIndex !== null) {
      if (slotIndex === hoverIndex) return null;
      if (slotIndex === draggedIndex) return order[hoverIndex];
    }
    return order[slotIndex];
  };

  const renderOption = (displayIndex, optionDataIndex) => {
    if (optionDataIndex === null) {
      return React.createElement(
        "div",
        {
          key: displayIndex,
          className: "ordering-option ordering-option-placeholder",
          "data-index": displayIndex,
        },
        React.createElement("div", { className: "ordering-main-image-row" }),
        React.createElement("div", { className: "ordering-unit-image-row" }),
        React.createElement("div", { className: "ordering-count-row" }),
      );
    }
    const opt = question.options[optionDataIndex];
    if (!opt) return null;

    const count = opt.count;
    const mainImageLen = `calc(${count} * ${unitLength})`;
    const isDragging =
      draggedIndex === displayIndex && optionDataIndex === order[draggedIndex];

    const unitImages = [];
    for (let i = 0; i < count; i++) {
      unitImages.push(
        React.createElement("img", {
          key: i,
          src: unitImage,
          alt: "",
          className: "ordering-unit-image",
          style: { width: unitLength, height: unitLength, flexShrink: 0 },
        }),
      );
    }

    const countCells = [];
    for (let i = 0; i < count; i++) {
      countCells.push(
        React.createElement(
          "div",
          {
            key: i,
            className: "ordering-count-cell",
            style: { width: unitLength, minWidth: unitLength },
          },
          React.createElement(
            "span",
            {
              className: `ordering-count-badge ${i === count - 1 ? "ordering-count-badge-final" : ""} ${hasChecked ? "ordering-count-visible" : ""}`,
            },
            i + 1,
          ),
        ),
      );
    }

    const textCount = React.createElement(
      "div",
      {
        className: `ordering-text-count ${hasChecked ? "ordering-text-count-visible" : ""}`,
      },
      `${count} ${unitNamePlural} long`,
    );

    const optionClass = "ordering-option " + (optionBgClass || "");

    return React.createElement(
      "div",
      {
        key: displayIndex,
        ref: (el) => {
          optionRefs.current[displayIndex] = el;
        },
        className: optionClass,
        style: isDragging ? { opacity: 0.4 } : {},
        onPointerDown: !lockDrag
          ? (e) => handlePointerDown(e, displayIndex)
          : undefined,
        "data-index": displayIndex,
      },
      React.createElement(
        "div",
        { className: "ordering-main-image-row" },
        React.createElement("img", {
          src: opt.big_image,
          alt: "",
          className: "ordering-big-image",
          style: {
            width: mainImageLen,
          },
        }),
      ),
      React.createElement(
        "div",
        { className: "ordering-unit-image-row" },
        ...unitImages,
      ),
      React.createElement(
        "div",
        { className: "ordering-count-row" },
        ...countCells,
      ),
      textCount,
    );
  };

  const optionElements = [0, 1, 2].map((slotIdx) => {
    const optIdx = getOptionForSlot(slotIdx);
    return renderOption(slotIdx, optIdx);
  });

  const feedbackBox = feedbackVisible
    ? React.createElement(
        "div",
        {
          className: `ordering-feedback-box ${isCorrect ? "correct" : "wrong"}`,
        },
        isCorrect ? step1.feedbackCorrect : step1.feedbackWrong,
      )
    : null;

  const checkButton = React.createElement(
    "button",
    {
      className: "ordering-check-btn",
      onClick: checkAnswer,
      disabled: hasChecked && isCorrect,
    },
    step1.checkButton || "Check",
  );

  const dragGhost =
    draggedIndex !== null
      ? React.createElement(
          "div",
          {
            className: "ordering-drag-ghost",
            style: {
              position: "fixed",
              left: dragPosition.x,
              top: dragPosition.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 9999,
            },
          },
          (() => {
            const opt = question.options[order[draggedIndex]];
            if (!opt) return null;
            const count = opt.count;
            const mainImageLen = `calc(${count} * ${unitLength})`;
            const unitImages = [];
            for (let i = 0; i < count; i++) {
              unitImages.push(
                React.createElement("img", {
                  key: i,
                  src: unitImage,
                  alt: "",
                  className: "ordering-unit-image",
                  style: {
                    width: unitLength,
                    height: unitLength,
                    flexShrink: 0,
                  },
                }),
              );
            }
            const countCells = [];
            for (let i = 0; i < count; i++) {
              countCells.push(
                React.createElement(
                  "div",
                  {
                    key: i,
                    className: "ordering-count-cell",
                    style: { width: unitLength, minWidth: unitLength },
                  },
                  React.createElement(
                    "span",
                    {
                      className: `ordering-count-badge ${i === count - 1 ? "ordering-count-badge-final" : ""}`,
                    },
                    i + 1,
                  ),
                ),
              );
            }
            return React.createElement(
              "div",
              {
                className: "ordering-option ordering-drag-ghost-inner",
                style: {
                  width: ghostDimensions.width,
                  height: ghostDimensions.height,
                  minWidth: ghostDimensions.width,
                  minHeight: ghostDimensions.height,
                },
              },
              React.createElement(
                "div",
                { className: "ordering-main-image-row" },
                React.createElement("img", {
                  src: opt.big_image,
                  alt: "",
                  className: "ordering-big-image",
                  style: {
                    width: mainImageLen,
                  },
                }),
              ),
              React.createElement(
                "div",
                { className: "ordering-unit-image-row" },
                ...unitImages,
              ),
              React.createElement(
                "div",
                { className: "ordering-count-row" },
                ...countCells,
              ),
              React.createElement(
                "div",
                { className: "ordering-text-count" },
                `${count} ${unitNamePlural} long`,
              ),
            );
          })(),
        )
      : null;

  return React.createElement(
    "div",
    { className: "main-canvas-container ordering-main-canvas" },
    React.createElement(
      "div",
      { className: "ordering-options-container" },
      optionElements,
    ),
    React.createElement(
      "div",
      { className: "ordering-check-container" },
      React.createElement(
        "div",
        { className: "ordering-text-column" },
        feedbackBox,
      ),
      React.createElement(
        "div",
        { className: "ordering-button-column" },
        checkButton,
      ),
    ),
    dragGhost,
  );
};
