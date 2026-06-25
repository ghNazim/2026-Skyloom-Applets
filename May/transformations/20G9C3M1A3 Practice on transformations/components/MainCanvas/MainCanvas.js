const MainCanvas = (props) => {
  const {
    step,
    showGray,
    animProgress,
    showReplay,
    onReplay,
    mcqOptions,
    mcqSelectedIndex,
    mcqResultState,
    mcqShowFeedback,
    mcqFeedbackText,
    mcqFeedbackType,
    mcqDisabled,
    showMcqOptions,
    onMcqSelect,
    dndPlacements,
    dndSourceItems,
    dndWrongItemId,
    dndWrongZone,
    dndReady,
    onDndDrop,
  } = props;

  const GRAPH_BY_STEP = {
    1: TranslationGraph,
    3: RotationGraph,
    5: ReflectionGraph,
    7: DilationGraph,
  };

  const GraphComponent = GRAPH_BY_STEP[step];

  if (GraphComponent) {
    return React.createElement(
      "div",
      { className: "main-canvas-container two-col-layout" },
      React.createElement(
        "div",
        { className: "canvas-left-col" },
        React.createElement(
          "div",
          { className: "translation-graph-panel" },
          React.createElement(GraphComponent, {
            showGray: showGray,
            animProgress: animProgress,
          }),
          showReplay
            ? React.createElement(
                "button",
                {
                  type: "button",
                  className: "translation-replay-btn",
                  onClick: onReplay,
                },
                APP_DATA.replay,
              )
            : null,
        ),
      ),
      React.createElement(
        "div",
        { className: "canvas-right-col" },
        showMcqOptions
          ? React.createElement(McqPanel, {
              options: mcqOptions,
              selectedIndex: mcqSelectedIndex,
              resultState: mcqResultState,
              showFeedback: mcqShowFeedback,
              feedbackText: mcqFeedbackText,
              feedbackType: mcqFeedbackType,
              disabled: mcqDisabled,
              onSelect: onMcqSelect,
            })
          : null,
      ),
    );
  }

  if (isLabelStep(step)) {
    return React.createElement(
      "div",
      { className: "main-canvas-container label-dnd-layout" },
      React.createElement(LabelDndPanel, {
        animProgress: animProgress,
        showGray: showGray,
        placements: dndPlacements,
        sourceItems: dndSourceItems,
        wrongItemId: dndWrongItemId,
        wrongZone: dndWrongZone,
        dndReady: dndReady,
        onDrop: onDndDrop,
      }),
    );
  }

  if (isTransformationDndStep(step)) {
    return React.createElement(
      "div",
      { className: "main-canvas-container dnd-layout" },
      React.createElement(TransformationDndPanel, {
        placements: dndPlacements,
        sourceItems: dndSourceItems,
        wrongItemId: dndWrongItemId,
        wrongZone: dndWrongZone,
        onDrop: onDndDrop,
      }),
    );
  }

  if (isDndStep(step)) {
    return React.createElement(
      "div",
      { className: "main-canvas-container dnd-layout" },
      React.createElement(DndPanel, {
        placements: dndPlacements,
        sourceItems: dndSourceItems,
        wrongItemId: dndWrongItemId,
        wrongZone: dndWrongZone,
        onDrop: onDndDrop,
      }),
    );
  }

  return null;
};
