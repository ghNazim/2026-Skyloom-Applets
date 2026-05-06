const MainCanvas = ({
  step,
  questionIndex,
  onStart,
  onAnswerState,
}) => {
  const { useEffect, useMemo, useRef, useState } = React;

  const questions = APP_DATA.questions || [];
  const currentQuestion = questions[questionIndex] || null;

  const [placedItems, setPlacedItems] = useState({
    categorical: [],
    numerical: [],
  });
  const [wrongDrop, setWrongDrop] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null);

  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const categoricalRef = useRef(null);
  const numericalRef = useRef(null);

  const hasCurrentPlacedItem = () =>
    placedItems.categorical.some((item) => item.questionIndex === questionIndex) ||
    placedItems.numerical.some((item) => item.questionIndex === questionIndex);

  useEffect(() => {
    const alreadyPlaced = hasCurrentPlacedItem();
    setWrongDrop(null);
    setDraggedItem(null);
    setIsDragging(false);
    setHoveredColumn(null);

    if (step !== 1 || !currentQuestion) {
      setFeedbackState(null);
      return;
    }

    if (alreadyPlaced) {
      setFeedbackState({
        type: "correct",
        text: currentQuestion.correct_feedback,
      });
      if (typeof onAnswerState === "function") {
        onAnswerState({ status: "correct" });
      }
    } else {
      setFeedbackState(null);
      if (typeof onAnswerState === "function") {
        onAnswerState({ status: "reset" });
      }
    }
  }, [questionIndex, step]);

  const getColumnFromPosition = (x, y) => {
    const catRect = categoricalRef.current
      ? categoricalRef.current.getBoundingClientRect()
      : null;
    const numRect = numericalRef.current
      ? numericalRef.current.getBoundingClientRect()
      : null;

    if (
      catRect &&
      x >= catRect.left &&
      x <= catRect.right &&
      y >= catRect.top &&
      y <= catRect.bottom
    ) {
      return "categorical";
    }

    if (
      numRect &&
      x >= numRect.left &&
      x <= numRect.right &&
      y >= numRect.top &&
      y <= numRect.bottom
    ) {
      return "numerical";
    }

    return null;
  };

  const processDrop = (targetColumn) => {
    if (!currentQuestion || !targetColumn || !draggedItem) return;
    if (feedbackState && feedbackState.type === "correct") return;
    if (wrongDrop) return;
    if (hasCurrentPlacedItem()) return;

    if (currentQuestion.correct_place === targetColumn) {
      if (typeof playSound === "function") playSound("correct");

      const newPlacedItem = {
        id: `q-${questionIndex}`,
        questionIndex,
        html: currentQuestion.correctInfo,
      };

      setPlacedItems((prev) => ({
        ...prev,
        [targetColumn]: [...prev[targetColumn], newPlacedItem],
      }));

      setFeedbackState({
        type: "correct",
        text: currentQuestion.correct_feedback,
      });

      if (typeof onAnswerState === "function") {
        onAnswerState({ status: "correct" });
      }
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    setWrongDrop({
      column: targetColumn,
      text: currentQuestion.item,
    });
    setFeedbackState({
      type: "wrong",
      text: currentQuestion.wrong_feedback,
    });

    if (typeof onAnswerState === "function") {
      onAnswerState({ status: "wrong" });
    }
  };

  const handlePointerDown = (event) => {
    if (step !== 1 || !currentQuestion) return;
    if (feedbackState && feedbackState.type === "correct") return;
    if (wrongDrop) return;
    if (hasCurrentPlacedItem()) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    setDraggedItem(currentQuestion.item);
    setIsDragging(true);
    setDragPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    if (!isDragging || !draggedItem) return;

    const handlePointerMove = (event) => {
      setDragPosition({ x: event.clientX, y: event.clientY });
      setHoveredColumn(getColumnFromPosition(event.clientX, event.clientY));
    };

    const handlePointerUp = (event) => {
      const targetColumn = getColumnFromPosition(event.clientX, event.clientY);
      processDrop(targetColumn);

      setIsDragging(false);
      setDraggedItem(null);
      setHoveredColumn(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, draggedItem, currentQuestion, feedbackState, wrongDrop]);

  const onTryAgain = () => {
    if (typeof playSound === "function") playSound("click");
    setWrongDrop(null);
    setFeedbackState(null);
    setHoveredColumn(null);
    if (typeof onAnswerState === "function") {
      onAnswerState({ status: "reset" });
    }
  };

  const renderColumnItem = (columnKey, item) => {
    const faded = step === 1 && item.questionIndex < questionIndex;
    const itemClass = [
      "placed-item",
      "placed-correct",
      columnKey === "categorical" ? "categorical-item" : "numerical-item",
      faded ? "faded-item" : "",
    ]
      .join(" ")
      .trim();

    return React.createElement("div", {
      key: item.id,
      className: itemClass,
      dangerouslySetInnerHTML: { __html: item.html },
    });
  };

  const renderWrongDropItem = (columnKey) => {
    if (!wrongDrop || wrongDrop.column !== columnKey) return null;
    return React.createElement(
      "div",
      {
        className: "placed-item placed-wrong",
      },
      wrongDrop.text
    );
  };

  const renderColumn = (columnKey, ref) => {
    const title =
      columnKey === "categorical"
        ? APP_DATA.columns.categorical
        : APP_DATA.columns.numerical;
    const panelClass = [
      "sort-column",
      columnKey,
      isDragging && hoveredColumn === columnKey ? "drop-hovered" : "",
    ]
      .join(" ")
      .trim();

    const placedNodes = placedItems[columnKey].map((item) =>
      renderColumnItem(columnKey, item)
    );
    const wrongNode = renderWrongDropItem(columnKey);

    return React.createElement(
      "div",
      {
        className: panelClass,
        ref,
      },
      React.createElement("h3", { className: "sort-column-title" }, title),
      React.createElement(
        "div",
        { className: "sort-column-body" },
        ...placedNodes,
        wrongNode
      )
    );
  };

  const actionFeedback = useMemo(() => {
    if (!feedbackState) return null;
    return React.createElement(
      "div",
      {
        className:
          feedbackState.type === "wrong"
            ? "action-feedback wrong-feedback"
            : "action-feedback correct-feedback",
      },
      feedbackState.text
    );
  }, [feedbackState]);

  const dragGhost =
    isDragging && draggedItem
      ? React.createElement(
          "div",
          {
            className: "drag-ghost",
            style: {
              left: dragPosition.x,
              top: dragPosition.y,
            },
          },
          draggedItem
        )
      : null;

  if (step === 0) {
    return React.createElement(Fullscreen, {
      heading: APP_DATA.steps[0].heading,
      text: APP_DATA.steps[0].text,
      buttonText: APP_DATA.steps[0].startButton,
      onButtonClick: onStart,
    });
  }

  const showActionRow = step === 1 || step === 2;

  return React.createElement(
    "div",
    { className: `main-canvas-container ${step === 2 ? "summary-mode" : ""}` },
    React.createElement(
      "div",
      { className: "main-row" },
      renderColumn("categorical", categoricalRef),
      renderColumn("numerical", numericalRef)
    ),
    showActionRow
      ? React.createElement(
          "div",
          { className: "action-row" },
          step === 1
            ? feedbackState && feedbackState.type === "wrong"
              ? React.createElement(
                  "div",
                  { className: "action-row-feedback-wrap" },
                  actionFeedback,
                  React.createElement(
                    "button",
                    {
                      className: "primary-btn try-again-btn",
                      type: "button",
                      onClick: onTryAgain,
                    },
                    APP_DATA.feedback.tryAgainButton
                  )
                )
              : React.createElement(
                  "div",
                  { className: "action-row-main" },
                  !feedbackState
                    ? React.createElement(
                        "div",
                        {
                          className: `draggable-item ${isDragging ? "dragging" : ""}`,
                          onPointerDown: handlePointerDown,
                        },
                        currentQuestion ? currentQuestion.item : ""
                      )
                    : null,
                  actionFeedback
                )
            : React.createElement("div", { className: "action-row-empty" })
        )
      : null,
    dragGhost
  );
};
