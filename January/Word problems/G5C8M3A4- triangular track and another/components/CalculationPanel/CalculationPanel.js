const CalculationPanel = ({
  step,
  appData,
  onEnableNext,
  onUpdateNavText,
  calcState,
  setCalcState,
  imageSrc,
  onUpdateImage,
  visibleCalcRowIndex = 0
}) => {
  const { useState, useEffect, useMemo } = React;

  const data = appData || (typeof APP_DATA !== "undefined" ? APP_DATA : {});
  const findingsFormat = data.findingsFormat || {};
  const findingDivInstances = data.findingDivInstances || [];
  const stepData = data.steps && data.steps[step] ? data.steps[step] : {};
  const mcqStartIndex = stepData.mcqStartIndex != null ? stepData.mcqStartIndex : 0;
  const mcqEndIndex = stepData.mcqEndIndex != null ? stepData.mcqEndIndex : (data.mcqs && data.mcqs.length) ? 1 : 0;
  const effectiveFindingIndex = (stepData.findingDivInstanceIndexPerMcq && stepData.findingDivInstanceIndexPerMcq[calcState.mcqAnsweredCount] != null)
    ? stepData.findingDivInstanceIndexPerMcq[calcState.mcqAnsweredCount]
    : stepData.findingDivInstanceIndex;
  const findingInstance = typeof effectiveFindingIndex === "number" && findingDivInstances[effectiveFindingIndex]
    ? findingDivInstances[effectiveFindingIndex]
    : null;

  const mcqs = data.mcqs || [];
  const mcqsForThisStep = mcqs.slice(mcqStartIndex, mcqEndIndex);
  const blankCalcRows = data.blankCalcRows || [];
  const calcStepKey = (stepData.calcStepKey != null) ? stepData.calcStepKey : null;
  const calcStepData = calcStepKey && data["calcStep" + calcStepKey] ? data["calcStep" + calcStepKey] : null;
  const calcRowsForStep = (calcStepData && calcStepData.calcRows) || [];
  const initialRowsForStep = (calcStepData && calcStepData.initialRows) || [];
  const stepStateForCalc = calcStepKey != null ? ((calcState.calcSteps || {})[String(calcStepKey)] || { visibleRowIndex: 0, answers: [] }) : {};
  const currentStepAnswers = (stepStateForCalc.answers || []);
  const effectiveVisibleRowIndex = calcStepKey != null ? visibleCalcRowIndex : 0;

  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);

  const [selectedMcqIndex, setSelectedMcqIndex] = useState(null);
  const [currentMcqCorrect, setCurrentMcqCorrect] = useState(false);

  const currentMcqIndexInStep = (calcState.mcqAnsweredCount || 0) - mcqStartIndex;
  const currentMcqData = mcqsForThisStep[currentMcqIndexInStep] || null;
  const isLastMcqInStep = currentMcqIndexInStep >= 0 && currentMcqIndexInStep === mcqsForThisStep.length - 1;

  // Build flat list of boxes for current calc step (6 or 7)
  const boxList = useMemo(() => {
    const list = [];
    (calcRowsForStep || []).forEach((row, rowIndex) => {
      const answers = row.answers;
      if (answers && answers.length) {
        answers.forEach((ans, boxIndex) => list.push({ rowIndex, boxIndex, answer: ans }));
      }
    });
    return list;
  }, [calcRowsForStep]);

  const startBoxIndexForRow = useMemo(() => {
    const arr = [];
    let sum = 0;
    (calcRowsForStep || []).forEach((row) => {
      arr.push(sum);
      sum += (row.answers && row.answers.length) ? row.answers.length : 0;
    });
    arr.push(sum);
    return (r) => arr[r];
  }, [calcRowsForStep]);

  const totalBoxes = boxList.length;
  const filledCount = currentStepAnswers.length;
  const currentBoxInfo = boxList[filledCount] || null;

  const currentRowData = calcRowsForStep[effectiveVisibleRowIndex];
  const currentRowBoxCount = (currentRowData && currentRowData.answers && currentRowData.answers.length) ? currentRowData.answers.length : 0;
  const currentRowStartBox = startBoxIndexForRow(effectiveVisibleRowIndex);
  const currentRowFilled = currentRowBoxCount === 0
    ? true
    : filledCount >= currentRowStartBox + currentRowBoxCount;

    useEffect(() => {
      setNumpadValue("");
      setInputError(false);
      setInputCorrect(false);
      setSelectedMcqIndex(null);
      setCurrentMcqCorrect(false);
      
  }, [step]);

  // Calc step: enable Next when current visible row has no boxes (display-only row)
  useEffect(() => {
    if (stepData.isCalcStep && currentRowBoxCount === 0 && onEnableNext) {
      onEnableNext();
    }
    const calcPanel = document.querySelector(".calc-equation-row");
    if (calcPanel) {
      calcPanel.scrollTo({ top: calcPanel.scrollHeight, behavior: "smooth" });
    }
  }, [step, stepData.isCalcStep, effectiveVisibleRowIndex, currentRowBoxCount, onEnableNext]);

  useEffect(() => {
    if (step === 3 && currentMcqCorrect && onUpdateImage && stepData.imageAnswered) {
      onUpdateImage(stepData.imageAnswered);
    }
  }, [step, currentMcqCorrect, onUpdateImage, stepData.imageAnswered]);

  useEffect(() => {
    if (stepData.isMcqStep && currentMcqCorrect) {
      setSelectedMcqIndex(null);
      setCurrentMcqCorrect(false);
    }
  }, [step, currentMcqIndexInStep]);

  const handleMcqClick = (index) => {
    if (currentMcqCorrect || !currentMcqData) return;
    setSelectedMcqIndex(index);
    if (index === currentMcqData.answerIndex) {
      setCurrentMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      const formulaRow = currentMcqData.formulaRow;
      setTimeout(() => {
        setCalcState(prev => ({
          ...prev,
          mcqAnsweredCount: prev.mcqAnsweredCount + 1,
          formulaRowAdded: prev.formulaRowAdded || (isLastMcqInStep && !!formulaRow)
        }));
        if (isLastMcqInStep) {
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText && data.steps && data.steps[step]) onUpdateNavText(data.steps[step].navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  const handleNumberClick = (num) => {
    if (numpadValue.length < 4) setNumpadValue(prev => prev + num);
  };

  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!currentBoxInfo || !calcStepKey) return;
    if (numpadValue === currentBoxInfo.answer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      const key = String(calcStepKey);
      setTimeout(() => {
        setInputCorrect(false);
        setNumpadValue("");
        const nextAnswers = [...currentStepAnswers, numpadValue];
        setCalcState(prev => ({
          ...prev,
          calcSteps: {
            ...(prev.calcSteps || {}),
            [key]: {
              visibleRowIndex: (prev.calcSteps && prev.calcSteps[key] && prev.calcSteps[key].visibleRowIndex != null)
                ? prev.calcSteps[key].visibleRowIndex
                : effectiveVisibleRowIndex,
              answers: nextAnswers
            }
          }
        }));
        const rowJustFilled = nextAnswers.length >= currentRowStartBox + currentRowBoxCount;
        if (rowJustFilled) {
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText && data.steps && data.steps[step]) onUpdateNavText(data.steps[step].navTextCorrect);
        }
      }, 600);
    } else {
      setInputError(true);
      if (window.playSound) window.playSound("wrong");
      setTimeout(() => {
        setInputError(false);
        setNumpadValue("");
      }, 500);
    }
  };

  const renderFindingsDiv = () => {
    const givenLabel = data.givenLabel || findingsFormat.givenLabel || "Given:";
    const findingsLabel = data.findingsLabel != null ? data.findingsLabel : (findingsFormat.findingsLabel || "Findings:");

    if (findingInstance) {
      const givenList = findingInstance.givenList || [];
      const findingsList = findingInstance.findingsList || [];
      return React.createElement(
        "div",
        { className: "calc-findings-div findings-format" },
        givenList.length > 0 && React.createElement("div", { className: "findings-format-section" },
          React.createElement("div", { className: "findings-format-label" }, givenLabel),
          React.createElement("ul", { className: "findings-list" },
            givenList.map((item, i) => React.createElement("li", { key: `g-${i}`, dangerouslySetInnerHTML: { __html: item } }))
          )
        ),
        findingsList.length > 0 && React.createElement("div", { className: "findings-format-section" },
          React.createElement("div", { className: "findings-format-label" }, findingsLabel),
          React.createElement("ul", { className: "findings-list" },
            findingsList.map((item, i) => React.createElement("li", { key: `f-${i}` }, item))
          )
        )
      );
    }

    const title = findingsFormat.title || "";
    const givenList = findingsFormat.givenList || [];
    const toFindLabel = findingsFormat.toFindLabel || "To Find:";
    const toFindList = findingsFormat.toFindList || [];
    return React.createElement(
      "div",
      { className: "calc-findings-div findings-format" },
      title ? React.createElement("div", { className: "findings-format-title" }, title) : null,
      React.createElement("div", { className: "findings-format-section" },
        React.createElement("div", { className: "findings-format-label" }, givenLabel),
        React.createElement("ul", { className: "findings-list" },
          givenList.map((item, i) => React.createElement("li", { key: `g-${i}` }, item))
        )
      ),
      React.createElement("div", { className: "findings-format-section" },
        React.createElement("div", { className: "findings-format-label" }, toFindLabel),
        React.createElement("ul", { className: "findings-list" },
          toFindList.map((item, i) => React.createElement("li", { key: `t-${i}` }, item))
        )
      )
    );
  };

  const renderCurrentMcq = () => {
    if (!currentMcqData) return null;
    const options = currentMcqData.options || [];
    return React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, currentMcqData.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedMcqIndex === index) {
            className += index === currentMcqData.answerIndex ? " correct" : " incorrect";
          }
          if (currentMcqCorrect && index !== currentMcqData.answerIndex) className += " disabled";
          return React.createElement(
            "button",
            {
              key: `mcq-${index}`,
              className: className,
              onClick: () => handleMcqClick(index),
              disabled: currentMcqCorrect
            },
            option
          );
        })
      )
    );
  };

  const getFormulaRowText = () => {
    for (let i = mcqsForThisStep.length - 1; i >= 0; i--) {
      if (mcqsForThisStep[i] && mcqsForThisStep[i].formulaRow) return mcqsForThisStep[i].formulaRow;
    }
    return "";
  };

  const renderCalcRows = () => {
    const rows = [];
    const filledAnswers = currentStepAnswers;
    let boxGlobalIndex = 0;

    if (stepData.isMcqStep && !stepData.isCalcStep && calcState.formulaRowAdded) {
      const formulaText = getFormulaRowText();
      if (formulaText) {
        rows.push(
          React.createElement("div", { key: "formula", className: "calc-row" }, formulaText)
        );
      }
      return rows;
    }

    if (stepData.isBlankCalcStep && blankCalcRows.length > 0) {
      blankCalcRows.forEach((line, i) => {
        rows.push(React.createElement("div", { key: `blank-${i}`, className: "calc-row" }, line));
      });
      return rows;
    }

    if (stepData.isCalcStep && calcStepData) {
      initialRowsForStep.forEach((line, i) => {
        rows.push(React.createElement("div", { key: `init-${i}`, className: "calc-row", dangerouslySetInnerHTML: { __html: line } }, ));
      });
      const visibleCalcRows = calcRowsForStep.slice(0, effectiveVisibleRowIndex + 1);
      visibleCalcRows.forEach((rowDef, rowIndex) => {
        const text = rowDef.text || "";
        const answers = rowDef.answers;
        if (!answers || !answers.length) {
          rows.push(
            React.createElement("div", { key: `row-${rowIndex}`, className: "calc-row" }, text)
          );
          return;
        }
        const parts = text.split("[box]");
        const elements = [];
        const rowStartBox = startBoxIndexForRow(rowIndex);
        const rowBoxCount = answers.length;
        const rowFullyFilled = filledAnswers.length >= rowStartBox + rowBoxCount;
        parts.forEach((part, i) => {
          elements.push(React.createElement("span", { key: `p-${i}` }, part));
          if (i < parts.length - 1) {
            const boxIdx = boxGlobalIndex++;
            const isFilled = boxIdx < filledAnswers.length;
            const isCurrent = boxIdx === filledCount;
            const value = isFilled ? filledAnswers[boxIdx] : (isCurrent ? numpadValue : "");
            if (rowFullyFilled) {
              elements.push(
                React.createElement("span", { key: `box-${boxIdx}`, className: "calc-filled-inline" }, value)
              );
            } else {
              const boxClass = [
                "calc-input-box",
                inputError && isCurrent ? "error shake" : "",
                inputCorrect && isCurrent ? "correct" : "",
                isCurrent ? "highlight" : ""
              ].filter(Boolean).join(" ");
              elements.push(
                React.createElement("span", { key: `box-${boxIdx}`, className: boxClass }, value)
              );
            }
          }
        });
        rows.push(
          React.createElement("div", { key: `row-${rowIndex}`, className: "calc-row" }, ...elements)
        );
      });
    }

    return rows;
  };

  const renderRightPanelContent = () => {
    if (stepData.isMcqStep && currentMcqData) return renderCurrentMcq();
    if (stepData.isBlankCalcStep) return null;
    if (stepData.isCalcStep) {
      const disabled = currentRowFilled;
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit,
        disabled: disabled
      });
    }
    return null;
  };

  const renderRightPanel = () => {
    return React.createElement(
      "div",
      { className: "calc-input-panel" },
      renderFindingsDiv(),
      renderRightPanelContent() && React.createElement(
        "div",
        { className: "calc-input-div" },
        renderRightPanelContent()
      )
    );
  };

  // Final step - image + final answer + finding div
  if (stepData.isFinalStep) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final with-image" },
        React.createElement("div", { className: "calc-image-row" },
          imageSrc && React.createElement("img", { src: imageSrc, alt: "Triangle", className: "calc-image" })
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement("div", { className: "final-answer-div" }, data.finalAnswer)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  // MCQ step (with optional formula row when answered): image + formula only after all MCQs in this step are answered
  if (stepData.isMcqStep && !stepData.isBlankCalcStep && !stepData.isCalcStep) {
    const showFormula = !currentMcqData && getFormulaRowText();
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        React.createElement("div", { className: "calc-image-row" },
          imageSrc && React.createElement("img", { src: imageSrc, alt: "Triangle", className: "calc-image" })
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          showFormula && React.createElement("div", { className: "calc-rows-container" }, renderCalcRows())
        )
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  // Blank calc step: image + blank calc rows + finding div
  if (stepData.isBlankCalcStep) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        React.createElement("div", { className: "calc-image-row" },
          imageSrc && React.createElement("img", { src: imageSrc, alt: "Triangle", className: "calc-image" })
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, renderCalcRows())
        )
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  // Calc step: image + initial rows + calc rows + finding div; right = numpad
  const showCalcRows = stepData.isCalcStep;
  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    React.createElement(
      "div",
      { className: "calc-left-panel with-image" },
      React.createElement("div", { className: "calc-image-row" },
        imageSrc && React.createElement("img", { src: imageSrc, alt: "Triangle", className: "calc-image" })
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        showCalcRows && React.createElement(
          "div",
          { className: "calc-rows-container" },
          renderCalcRows()
        )
      )
    ),
    React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
  );
};
