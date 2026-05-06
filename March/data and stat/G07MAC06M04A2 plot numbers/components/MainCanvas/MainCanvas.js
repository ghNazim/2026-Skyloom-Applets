const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateNavText } = props;
  const { useState, useMemo, useEffect } = React;

  const tableData = APP_DATA.table;
  const mcqStep3 = APP_DATA.step3;
  const mcqStep4 = APP_DATA.step4;
  const plotStep = APP_DATA.step6;
  const mcqStep8 = APP_DATA.step8;

  const makeBlockMeta = () => {
    const sorted = tableData.sortedNumbers.slice();
    const used = {};
    return tableData.initialNumbers.map((value, initialIndex) => {
      if (!used[value]) used[value] = 0;
      const occurrence = used[value];
      let count = -1;
      let targetIndex = 0;
      for (let i = 0; i < sorted.length; i += 1) {
        if (sorted[i] === value) {
          count += 1;
          if (count === occurrence) {
            targetIndex = i;
            break;
          }
        }
      }
      used[value] += 1;
      return { id: "block-" + initialIndex, value, initialIndex, targetIndex };
    });
  };

  const blockMeta = useMemo(makeBlockMeta, []);
  const targetCounts = useMemo(() => {
    const map = {};
    for (let i = 140; i <= 150; i += 1) map[i] = 0;
    tableData.sortedNumbers.forEach((v) => {
      map[v] = (map[v] || 0) + 1;
    });
    return map;
  }, [tableData.sortedNumbers]);

  const [sortedVisual, setSortedVisual] = useState(step === 2 || step >= 3);
  const [sortStarted, setSortStarted] = useState(false);
  const [sortDone, setSortDone] = useState(step === 2 || step >= 3);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState("none");

  const [step3WrongIndices, setStep3WrongIndices] = useState([]);
  const [step3LastWrong, setStep3LastWrong] = useState(null);
  const [step3Correct, setStep3Correct] = useState(false);
  const [rangeVisual, setRangeVisual] = useState("plain");

  const [step4WrongIndices, setStep4WrongIndices] = useState([]);
  const [step4LastWrong, setStep4LastWrong] = useState(null);
  const [step4Correct, setStep4Correct] = useState(false);

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [disabledBlocks, setDisabledBlocks] = useState([]);
  const [placedCounts, setPlacedCounts] = useState(() => {
    const initial = {};
    for (let i = 140; i <= 150; i += 1) initial[i] = 0;
    return initial;
  });
  const [wrongBlockId, setWrongBlockId] = useState(null);
  const [wrongColValue, setWrongColValue] = useState(null);
  const [plotCompleted, setPlotCompleted] = useState(false);
  const [step8WrongIndices, setStep8WrongIndices] = useState([]);
  const [step8LastWrong, setStep8LastWrong] = useState(null);
  const [step8Correct, setStep8Correct] = useState(false);

  useEffect(() => {
    if (!onSetNextEnabled) return;
    onSetNextEnabled(false);
    if (onUpdateNavText && APP_DATA.steps[step]) {
      onUpdateNavText(APP_DATA.steps[step].navText);
    }
  }, [step]);

  const getPosition = (index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    return { left: `${col * 25}%`, top: `${row * 25}%` };
  };

  const clearWrongPlotVisuals = (clearFeedback) => {
    setWrongBlockId(null);
    setWrongColValue(null);
    if (clearFeedback) {
      setFeedbackType("none");
      setFeedbackText("");
    }
  };

  const handleSort = () => {
    if (sortStarted) return;
    if (typeof playSound === "function") playSound("click");
    setSortStarted(true);
    setSortedVisual(true);

    window.setTimeout(() => {
      setSortDone(true);
      setFeedbackType("correct");
      setFeedbackText(APP_DATA.step1.feedbackCorrect);
      if (onSetNextEnabled) onSetNextEnabled(true);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[1].navDone);
    }, 1050);
  };

  const handleStep3OptionClick = (index) => {
    if (step3Correct) return;
    if (step3WrongIndices.indexOf(index) !== -1) return;

    if (index === mcqStep3.correctIndex) {
      if (typeof playSound === "function") playSound("correct");
      setStep3Correct(true);
      setFeedbackType("correct");
      setFeedbackText(mcqStep3.feedbacks[index]);
      setRangeVisual("correct");
      if (onSetNextEnabled) onSetNextEnabled(true);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[3].navDone);
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    const newWrong = step3WrongIndices.concat([index]);
    setStep3WrongIndices(newWrong);
    setStep3LastWrong(index);
    setFeedbackType("wrong");
    setFeedbackText(mcqStep3.feedbacks[index]);

    if (index === 0) setRangeVisual("narrow145");
    if (index === 1) setRangeVisual("wide");
  };

  const handleStep4OptionClick = (index) => {
    if (step4Correct) return;
    if (step4WrongIndices.indexOf(index) !== -1) return;

    if (index === mcqStep4.correctIndex) {
      if (typeof playSound === "function") playSound("correct");
      setStep4Correct(true);
      setFeedbackType("correct");
      setFeedbackText(mcqStep4.feedbacks[index]);
      if (onSetNextEnabled) onSetNextEnabled(true);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[4].navDone);
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    const newWrong = step4WrongIndices.concat([index]);
    setStep4WrongIndices(newWrong);
    setStep4LastWrong(index);
    setFeedbackType("wrong");
    setFeedbackText(mcqStep4.feedbacks[index]);
  };

  const handlePlotBlockSelect = (block) => {
    if (disabledBlocks.indexOf(block.id) !== -1) return;
    clearWrongPlotVisuals(true);
    setSelectedBlockId(block.id);
  };

  const handlePlotColumnClick = (value) => {
    if (!selectedBlockId || plotCompleted) return;
    clearWrongPlotVisuals(false);

    const selectedBlock = blockMeta.find((b) => b.id === selectedBlockId);
    if (!selectedBlock) return;

    if (selectedBlock.value === value) {
      if (typeof playSound === "function") playSound("correct");

      const nextPlaced = {
        ...placedCounts,
        [value]: (placedCounts[value] || 0) + 1,
      };
      const nextDisabled = disabledBlocks.concat([selectedBlockId]);
      const isFinal = nextDisabled.length === blockMeta.length;

      setPlacedCounts(nextPlaced);
      setDisabledBlocks(nextDisabled);
      setSelectedBlockId(null);

      if (isFinal) {
        setPlotCompleted(true);
        setFeedbackType("correct");
        setFeedbackText(plotStep.finalFeedback);
        if (onSetNextEnabled) onSetNextEnabled(true);
        if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[6].navDone);
      } else {
        const feedbacks = plotStep.correctFeedbacks;
        setFeedbackType("correct");
        setFeedbackText(
          feedbacks[Math.floor(Math.random() * feedbacks.length)],
        );
      }
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    setWrongBlockId(selectedBlockId);
    setWrongColValue(value);
    setFeedbackType("wrong");
    setFeedbackText(plotStep.wrongFeedback);
  };

  const handleStep8OptionClick = (index) => {
    if (step8Correct) return;
    if (step8WrongIndices.indexOf(index) !== -1) return;

    if (index === mcqStep8.correctIndex) {
      if (typeof playSound === "function") playSound("correct");
      setStep8Correct(true);
      setFeedbackType("correct");
      setFeedbackText(mcqStep8.feedbacks[index]);
      if (onSetNextEnabled) onSetNextEnabled(true);
      if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[8].navDone);
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    const newWrong = step8WrongIndices.concat([index]);
    setStep8WrongIndices(newWrong);
    setStep8LastWrong(index);
    setFeedbackType("wrong");
    setFeedbackText(mcqStep8.feedbacks[index]);
  };

  const renderDataBlocks = ({
    sortedMode,
    highlightLow,
    addShake,
    showLabels,
    plottingMode,
  }) =>
    React.createElement(
      "div",
      {
        className: "plot-data-wrapper" + (plottingMode ? " plotting-mode" : ""),
      },
      React.createElement(
        "div",
        { className: "plot-table-title" },
        tableData.title,
      ),
      React.createElement(
        "div",
        { className: "plot-blocks-area" },
        blockMeta.map((block) => {
          const indexToUse = sortedMode
            ? block.targetIndex
            : block.initialIndex;
          const pos = getPosition(indexToUse);
          const isLow = block.value < 145;
          const isDisabled = disabledBlocks.indexOf(block.id) !== -1;
          const isSelected = selectedBlockId === block.id;
          const isWrong = wrongBlockId === block.id;

          const className =
            "plot-number-block" +
            (sortedMode ? " sorted" : " unsorted") +
            (highlightLow && isLow ? " low-highlight" : "") +
            (addShake && highlightLow && isLow ? " shake" : "") +
            (plottingMode && isDisabled ? " plotted-disabled" : "") +
            (plottingMode && isSelected ? " selected-for-plot" : "") +
            (plottingMode && isWrong ? " wrong-plot shake-rotate-3" : "");

          return React.createElement(
            "div",
            {
              key: block.id,
              className,
              onClick: plottingMode
                ? () => handlePlotBlockSelect(block)
                : undefined,
              style: { left: pos.left, top: pos.top },
            },
            block.value,
          );
        }),
        showLabels &&
          React.createElement(
            "div",
            { className: "smallest-label" },
            APP_DATA.common.smallest,
          ),
        showLabels &&
          React.createElement(
            "div",
            { className: "largest-label" },
            APP_DATA.common.largest,
          ),
      ),
    );

  const renderPlotMark = (idx) =>
    React.createElement(
      "div",
      { className: "plot-cross", key: "plot-cross-" + idx },
      React.createElement("span", { className: "cross-line cross-a" }),
      React.createElement("span", { className: "cross-line cross-b" }),
    );

  const renderNumberLine = ({
    mode,
    showLabel,
    showPlaceholder,
    greenLabel,
    showHeading = true,
    plotting = false,
    completedCounts = null,
    isReadOnlyPlot = false,
    showTitleBox = false,
    titleText = "",
    titleFilled = false,
    showInnerSegmentHint = false,
  }) => {
    let min = 140;
    let max = 150;
    let ticksVisible = false;
    let tiny = false;

    if (mode === "wide") {
      min = 130;
      max = 160;
      ticksVisible = true;
      tiny = true;
    } else if (mode === "narrow145") {
      min = 145;
      max = 150;
      ticksVisible = true;
      tiny = false;
    } else if (mode === "correct" || plotting) {
      min = 140;
      max = 150;
      ticksVisible = true;
      tiny = false;
    }

    const values = [];
    for (let i = min; i <= max; i += 1) values.push(i);
    const countsToUse = completedCounts || placedCounts;

    return React.createElement(
      "div",
      { className: "number-line-panel" + (mode === "wide" ? " wiggle" : "") },
      showHeading &&
        React.createElement(
          "div",
          { className: "number-line-heading" },
          APP_DATA.common.numberLine,
        ),
      showTitleBox &&
        React.createElement(
          "div",
          {
            className:
              "line-plot-title-box" + (titleFilled ? " filled" : " dashed"),
          },
          titleText || "",
        ),
      React.createElement(
        "div",
        { className: "line-wrap" },
        React.createElement("div", { className: "line-arrow-left" }),
        React.createElement(
          "div",
          { className: "line-track" },
          showInnerSegmentHint &&
            React.createElement("div", {
              className: "line-inner-segment-dash",
            }),
          ticksVisible &&
            React.createElement(
              "div",
              {
                className: "ticks-row",
                style: { "--tick-count": values.length },
              },
              values.map((value) => {
                const canClick =
                  plotting && !isReadOnlyPlot && !!selectedBlockId;
                const isWrongTick = plotting && wrongColValue === value;
                const plottedCount = countsToUse[value] || 0;
                return React.createElement(
                  "div",
                  { className: "tick-holder", key: "tick-" + value },
                  plotting &&
                    React.createElement(
                      "div",
                      {
                        className:
                          "plot-column-hitbox" +
                          (canClick ? " active" : "") +
                          (plotCompleted || isReadOnlyPlot
                            ? " borderless"
                            : "") +
                          (isWrongTick ? " wrong-col shake-3" : ""),
                        onClick: canClick
                          ? () => handlePlotColumnClick(value)
                          : undefined,
                      },
                      plottedCount > 0 &&
                        React.createElement(
                          "div",
                          { className: "plot-cross-stack" },
                          Array.from({ length: plottedCount }).map((_, idx) =>
                            renderPlotMark(idx),
                          ),
                        ),
                    ),
                  React.createElement("div", { className: "tick-mark" }),
                  React.createElement(
                    "div",
                    {
                      className:
                        "tick-label" +
                        (tiny ? " tiny" : "") +
                        (isWrongTick ? " wrong-label" : ""),
                    },
                    value,
                  ),
                );
              }),
            ),
        ),
        React.createElement("div", { className: "line-arrow-right" }),
      ),
      showPlaceholder &&
        React.createElement("div", { className: "unit-placeholder" }),
      showLabel &&
        React.createElement(
          "div",
          { className: "unit-label" + (greenLabel ? " green" : "") },
          APP_DATA.common.unit,
        ),
    );
  };

  const renderOptionButtons = (
    mcqData,
    wrongIndices,
    lastWrong,
    correctState,
    clickHandler,
  ) =>
    React.createElement(
      "div",
      { className: "mcq-options-row" },
      mcqData.options.map((option, index) => {
        let className = "mcq-option";
        let disabled = false;
        if (correctState) {
          disabled = true;
          className +=
            index === mcqData.correctIndex ? " correct" : " disabled";
        } else if (wrongIndices.indexOf(index) !== -1) {
          disabled = true;
          className += index === lastWrong ? " wrong" : " disabled";
        }
        return React.createElement(
          "button",
          {
            key: "option-" + index,
            className,
            type: "button",
            onClick: () => clickHandler(index),
            disabled,
          },
          option,
        );
      }),
    );

  if (step === 0) {
    return React.createElement(
      "div",
      { className: "main-canvas-container start-preview" },
      renderDataBlocks({
        sortedMode: false,
        highlightLow: false,
        addShake: false,
        showLabels: false,
        plottingMode: false,
      }),
    );
  }

  if (step === 2) {
    return React.createElement(
      "div",
      { className: "main-canvas-container start-preview" },
      renderDataBlocks({
        sortedMode: true,
        highlightLow: false,
        addShake: false,
        showLabels: true,
        plottingMode: false,
      }),
    );
  }

  if (step === 5) {
    return React.createElement(
      "div",
      { className: "main-canvas-container step5-canvas" },
      React.createElement(
        "div",
        { className: "step5-line-box" },
        renderNumberLine({
          mode: "correct",
          showLabel: true,
          showPlaceholder: false,
          greenLabel: false,
          showHeading: false,
        }),
      ),
    );
  }

  if (step === 7) {
    return React.createElement(
      "div",
      { className: "main-canvas-container step7-preview" },
      React.createElement(
        "div",
        { className: "col-right" },
        renderNumberLine({
          mode: "correct",
          showLabel: true,
          showPlaceholder: false,
          greenLabel: false,
          showHeading: false,
          plotting: true,
          completedCounts: targetCounts,
          isReadOnlyPlot: true,
        }),
      ),
    );
  }

  if (step === 9) {
    return React.createElement(
      "div",
      { className: "main-canvas-container step7-preview" },
      React.createElement(
        "div",
        { className: "col-right" },
        renderNumberLine({
          mode: "correct",
          showLabel: true,
          showPlaceholder: false,
          greenLabel: false,
          showHeading: false,
          plotting: true,
          completedCounts: targetCounts,
          isReadOnlyPlot: true,
          showTitleBox: true,
          titleText: mcqStep8.finalTitle,
          titleFilled: true,
        }),
      ),
    );
  }

  if (step === 1) {
    return React.createElement(
      "div",
      { className: "main-canvas-container two-row-layout no-action-row" },
      React.createElement(
        "div",
        { className: "row-main" },
        React.createElement(
          "div",
          { className: "col-left" },
          !sortDone &&
            React.createElement("div", {
              className: "info-text",
              dangerouslySetInnerHTML: { __html: APP_DATA.step1.leftText },
            }),
          sortDone &&
            React.createElement("div", {
              className: "feedback-box correct",
              dangerouslySetInnerHTML: { __html: feedbackText },
            }),
        ),
        React.createElement(
          "div",
          { className: "col-right" },
          renderDataBlocks({
            sortedMode: sortedVisual,
            highlightLow: false,
            addShake: false,
            showLabels: sortDone,
            plottingMode: false,
          }),
          React.createElement(
            "div",
            { className: "sort-btn-wrap" },
            React.createElement(
              "button",
              {
                className: "sort-btn",
                onClick: handleSort,
                disabled: sortStarted,
                type: "button",
              },
              APP_DATA.step1.sortButton,
            ),
            !sortStarted &&
              React.createElement("img", {
                src: "assets/tap.gif",
                alt: "",
                className: "sort-btn-tap-hint",
              }),
          ),
        ),
      ),
    );
  }

  if (step === 3) {
    return React.createElement(
      "div",
      { className: "main-canvas-container two-row-layout" },
      React.createElement(
        "div",
        { className: "row-main" },
        React.createElement(
          "div",
          { className: "col-left" },
          renderDataBlocks({
            sortedMode: true,
            highlightLow: rangeVisual === "narrow145",
            addShake: rangeVisual === "narrow145",
            showLabels: true,
            plottingMode: false,
          }),
        ),
        React.createElement(
          "div",
          { className: "col-right" },
          renderNumberLine({
            mode:
              rangeVisual === "wide"
                ? "wide"
                : rangeVisual === "correct"
                  ? "correct"
                  : rangeVisual === "narrow145"
                    ? "narrow145"
                    : "plain",
            showLabel: false,
            showPlaceholder: false,
            greenLabel: false,
            showHeading: true,
            showInnerSegmentHint:
              rangeVisual === "plain" &&
              step3WrongIndices.length === 0 &&
              !step3Correct,
          }),
        ),
      ),
      React.createElement(
        "div",
        { className: "row-action" },
        React.createElement(
          "div",
          { className: "col-left" },
          React.createElement(
            "div",
            {
              className:
                "feedback-box " +
                (feedbackType === "correct"
                  ? "correct"
                  : feedbackType === "wrong"
                    ? "wrong"
                    : "none"),
            },
            feedbackText || "",
          ),
        ),
        React.createElement(
          "div",
          { className: "col-right" },
          React.createElement(
            "div",
            { className: "mcq-title" },
            mcqStep3.title,
          ),
          renderOptionButtons(
            mcqStep3,
            step3WrongIndices,
            step3LastWrong,
            step3Correct,
            handleStep3OptionClick,
          ),
        ),
      ),
    );
  }

  if (step === 4) {
    return React.createElement(
      "div",
      { className: "main-canvas-container two-row-layout" },
      React.createElement(
        "div",
        { className: "row-main" },
        React.createElement(
          "div",
          { className: "col-left" },
          renderDataBlocks({
            sortedMode: true,
            highlightLow: false,
            addShake: false,
            showLabels: true,
            plottingMode: false,
          }),
        ),
        React.createElement(
          "div",
          { className: "col-right" },
          renderNumberLine({
            mode: "correct",
            showLabel: step4Correct,
            showPlaceholder: !step4Correct,
            greenLabel: true,
            showHeading: false,
          }),
        ),
      ),
      React.createElement(
        "div",
        { className: "row-action" },
        React.createElement(
          "div",
          { className: "col-left" },
          React.createElement(
            "div",
            {
              className:
                "feedback-box " +
                (feedbackType === "correct"
                  ? "correct"
                  : feedbackType === "wrong"
                    ? "wrong"
                    : "none"),
            },
            feedbackText || "",
          ),
        ),
        React.createElement(
          "div",
          { className: "col-right" },
          React.createElement(
            "div",
            { className: "mcq-title" },
            mcqStep4.title,
          ),
          renderOptionButtons(
            mcqStep4,
            step4WrongIndices,
            step4LastWrong,
            step4Correct,
            handleStep4OptionClick,
          ),
        ),
      ),
    );
  }

  if (step === 8) {
    return React.createElement(
      "div",
      { className: "main-canvas-container two-row-layout" },
      React.createElement(
        "div",
        { className: "row-main" },
        React.createElement(
          "div",
          { className: "col-left" },
          React.createElement(
            "div",
            { className: "mcq-title step8-title" },
            mcqStep8.title,
          ),
          React.createElement(
            "div",
            { className: "mcq-options-column" },
            mcqStep8.options.map((option, index) => {
              let className = "mcq-option";
              let disabled = false;
              if (step8Correct) {
                disabled = true;
                className +=
                  index === mcqStep8.correctIndex ? " correct" : " disabled";
              } else if (step8WrongIndices.indexOf(index) !== -1) {
                disabled = true;
                className += index === step8LastWrong ? " wrong" : " disabled";
              }
              return React.createElement(
                "button",
                {
                  key: "step8-option-" + index,
                  className,
                  type: "button",
                  onClick: () => handleStep8OptionClick(index),
                  disabled,
                },
                option,
              );
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "col-right" },
          renderNumberLine({
            mode: "correct",
            showLabel: true,
            showPlaceholder: false,
            greenLabel: false,
            showHeading: false,
            plotting: true,
            completedCounts: targetCounts,
            isReadOnlyPlot: true,
            showTitleBox: true,
            titleText: step8Correct ? mcqStep8.finalTitle : "",
            titleFilled: step8Correct,
          }),
        ),
      ),
      React.createElement(
        "div",
        { className: "row-action row-action-single" },
        React.createElement(
          "div",
          {
            className:
              "feedback-box " +
              (feedbackType === "correct"
                ? "correct"
                : feedbackType === "wrong"
                  ? "wrong"
                  : "none"),
          },
          feedbackText || "",
        ),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container two-row-layout" },
    React.createElement(
      "div",
      { className: "row-main" },
      React.createElement(
        "div",
        { className: "col-left" },
        renderDataBlocks({
          sortedMode: true,
          highlightLow: false,
          addShake: false,
          showLabels: false,
          plottingMode: true,
        }),
      ),
      React.createElement(
        "div",
        { className: "col-right" },
        renderNumberLine({
          mode: "correct",
          showLabel: true,
          showPlaceholder: false,
          greenLabel: false,
          showHeading: false,
          plotting: true,
        }),
      ),
    ),
    React.createElement(
      "div",
      { className: "row-action row-action-single" },
      React.createElement(
        "div",
        {
          className:
            "feedback-box " +
            (feedbackType === "correct"
              ? "correct"
              : feedbackType === "wrong"
                ? "wrong"
                : "none"),
        },
        feedbackText || "",
      ),
    ),
  );
};
