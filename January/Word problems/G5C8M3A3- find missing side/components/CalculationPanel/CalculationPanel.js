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

  const data = appData || APP_DATA;
  const findingsFormat = data.findingsFormat || {};
  const mcqs = data.mcqs || [];
  const calcRows = data.calcRows || [];
  const calcRowMarginLeft = data.calcRowMargin || undefined;
  const triangleAltText =
    data && data.alts && typeof data.alts.triangleImage === "string"
      ? data.alts.triangleImage
      : "";

  const stripMcqOptionPrefix = (option) => {
    if (option === null || option === undefined) return option;
    const s = String(option);
    // Remove leading "A. ", "B) ", etc (display-only)
    return s.replace(/^\s*[A-D]\s*[\.\)]\s*/i, "");
  };

  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);

  const [selectedMcqIndex, setSelectedMcqIndex] = useState(null);
  const [currentMcqCorrect, setCurrentMcqCorrect] = useState(false);

  const currentMcqIndex = calcState.mcqAnsweredCount;
  const currentMcqData = mcqs[currentMcqIndex] || null;

  // Build flat list of boxes for step 5: [{ rowIndex, boxIndex, answer }, ...]
  const boxList = useMemo(() => {
    const list = [];
    (calcRows || []).forEach((row, rowIndex) => {
      const answers = row.answers;
      if (answers && answers.length) {
        answers.forEach((ans, boxIndex) => list.push({ rowIndex, boxIndex, answer: ans }));
      }
    });
    return list;
  }, [calcRows]);

  // Start box index for row r (number of boxes in rows 0..r-1)
  const startBoxIndexForRow = useMemo(() => {
    const arr = [];
    let sum = 0;
    (calcRows || []).forEach((row) => {
      arr.push(sum);
      sum += (row.answers && row.answers.length) ? row.answers.length : 0;
    });
    arr.push(sum);
    return (r) => arr[r];
  }, [calcRows]);

  const totalBoxes = boxList.length;
  const filledCount = (calcState.calcBoxAnswers || []).length;
  const currentBoxInfo = boxList[filledCount] || null;

  // Only consider rows 0..visibleCalcRowIndex; "current row done" = all boxes in current row filled (or row has no boxes)
  const currentRowData = calcRows[visibleCalcRowIndex];
  const currentRowBoxCount = (currentRowData && currentRowData.answers && currentRowData.answers.length) ? currentRowData.answers.length : 0;
  const currentRowStartBox = startBoxIndexForRow(visibleCalcRowIndex);
  const currentRowFilled = currentRowBoxCount === 0
    ? true
    : filledCount >= currentRowStartBox + currentRowBoxCount;
  const allBoxesFilled = totalBoxes > 0 && filledCount >= totalBoxes;
const calcPanel = document.querySelector(".calc-equation-row");
  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
    setSelectedMcqIndex(null);
    setCurrentMcqCorrect(false);
    if (calcPanel) {
    calcPanel.scrollTo({
        top: calcPanel.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, visibleCalcRowIndex]);

  // Step 5: enable Next when current visible row has no boxes (display-only row)
  useEffect(() => {
    if (step === 5 && currentRowBoxCount === 0 && onEnableNext) {
      onEnableNext();
    }
  }, [step, visibleCalcRowIndex, currentRowBoxCount, onEnableNext]);

  useEffect(() => {
    if (step === 4) {
      // Whenever MCQ index changes (forward/back), treat it like a fresh MCQ.
      setSelectedMcqIndex(null);
      setCurrentMcqCorrect(false);
    }
  }, [step, currentMcqIndex]);

  const handleMcqClick = (index) => {
    if (currentMcqCorrect || !currentMcqData) return;
    setSelectedMcqIndex(index);
    if (index === currentMcqData.answerIndex) {
      setCurrentMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      const isLastMcq = currentMcqIndex === mcqs.length - 1;
      const formulaRow = currentMcqData.formulaRow;
      setTimeout(() => {
        setCalcState(prev => ({
          ...prev,
          mcqAnsweredCount: prev.mcqAnsweredCount + 1,
          formulaRowAdded: prev.formulaRowAdded || (isLastMcq && !!formulaRow)
        }));
        if (isLastMcq) {
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText && data.steps[4]) onUpdateNavText(data.steps[4].navTextCorrect);
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
    if (!currentBoxInfo) return;
    if (numpadValue === currentBoxInfo.answer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setInputCorrect(false);
        setNumpadValue("");
        const nextAnswers = [...(calcState.calcBoxAnswers || []), numpadValue];
        setCalcState(prev => ({ ...prev, calcBoxAnswers: nextAnswers }));
        // Enable Next when current row is fully filled (so user can click Next to reveal next row)
        const rowJustFilled = nextAnswers.length >= currentRowStartBox + currentRowBoxCount;
        if (rowJustFilled) {
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText && data.steps[5]) onUpdateNavText(data.steps[5].navTextCorrect);
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
    const title = findingsFormat.title || (data.comprehend && data.comprehend.sectionTitle) || "";
    const givenLabel = findingsFormat.givenLabel || (data.labels && data.labels.given ? `${data.labels.given}:` : "");
    const givenList = findingsFormat.givenList || [];
    const toFindLabel = findingsFormat.toFindLabel || (data.labels && data.labels.toFind ? `${data.labels.toFind}:` : "");
    const toFindList = findingsFormat.toFindList || [];

    return React.createElement(
      "div",
      { className: "calc-findings-div findings-format" },
      React.createElement("div", { className: "findings-format-title" }, title),
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
            stripMcqOptionPrefix(option)
          );
        })
      )
    );
  };

  const getFormulaRowText = () => {
    const lastMcq = mcqs[mcqs.length - 1];
    return (lastMcq && lastMcq.formulaRow) || "";
  };

  // Build content for one side (lhs or rhs) of a row: text with [box] placeholders replaced by box elements
  const buildSideContent = (sideText, boxIndicesInSide, rowStartBox, rowBoxCount, rowFullyFilled) => {
    const parts = sideText.split("[box]");
    const elements = [];
    parts.forEach((part, i) => {
      elements.push(React.createElement("span", { key: `p-${i}` }, part));
      if (i < parts.length - 1) {
        const boxIdx = boxIndicesInSide[i];
        const isFilled = boxIdx < filledCount;
        const isCurrent = boxIdx === filledCount;
        const value = isFilled ? (calcState.calcBoxAnswers || [])[boxIdx] : (isCurrent ? numpadValue : "");
        if (rowFullyFilled) {
          elements.push(
            React.createElement("span", { key: `box-${boxIdx}`, className: "calc-filled-inline" }, value)
          );
        } else {
          const boxClass = [
            "calc-input-box",
            inputError && isCurrent ? "error shake" : "",
            (inputCorrect && isCurrent) || isFilled ? "correct" : "",
            isCurrent ? "highlight" : ""
          ].filter(Boolean).join(" ");
          elements.push(
            React.createElement("span", {
              key: `box-${boxIdx}`,
              className: boxClass
            }, value)
          );
        }
      }
    });
    return elements;
  };

  const renderCalcRows = () => {
    const rows = [];
    const filledAnswers = calcState.calcBoxAnswers || [];
    let boxGlobalIndex = 0;

    if (calcState.formulaRowAdded) {
      const formulaText = getFormulaRowText();
      if (formulaText) {
        const eqIdx = formulaText.indexOf("=");
        const lhs = eqIdx >= 0 ? formulaText.slice(0, eqIdx) : formulaText;
        const rhs = eqIdx >= 0 ? formulaText.slice(eqIdx + 1) : "";
        const eqCell = eqIdx >= 0 ? "=" : "";
        rows.push(
          React.createElement("div", { key: "formula", className: "calc-row" },
            React.createElement("div", { className: "calc-cell-lhs" }, lhs),
            React.createElement("div", { className: "calc-cell-eq" }, eqCell),
            React.createElement("div", { className: "calc-cell-rhs" }, rhs)
          )
        );
      }
    }

    // Only show calc rows when on step 5; on step 4 only formula row is shown (first row appears after Next)
    if (step === 5) {
      const visibleRows = calcRows.slice(0, visibleCalcRowIndex + 1);
      visibleRows.forEach((rowDef, rowIndex) => {
        const text = rowDef.text || "";
        const answers = rowDef.answers;
        const eqIdx = text.indexOf("=");
        const lhsText = eqIdx >= 0 ? text.slice(0, eqIdx) : text;
        const rhsText = eqIdx >= 0 ? text.slice(eqIdx + 1) : "";

        if (!answers || !answers.length) {
          rows.push(
            React.createElement("div", { key: `row-${rowIndex}`, className: "calc-row" },
              React.createElement("div", { className: "calc-cell-lhs" }, lhsText),
              React.createElement("div", { className: "calc-cell-eq" }, eqIdx >= 0 ? "=" : ""),
              React.createElement("div", { className: "calc-cell-rhs" }, rhsText)
            )
          );
          return;
        }

        const lhsParts = lhsText.split("[box]");
        const rhsParts = rhsText.split("[box]");
        const nLhsBoxes = Math.max(0, lhsParts.length - 1);
        const nRhsBoxes = Math.max(0, rhsParts.length - 1);
        const rowStartBox = startBoxIndexForRow(rowIndex);
        const rowBoxCount = answers.length;
        const rowFullyFilled = filledAnswers.length >= rowStartBox + rowBoxCount;

        const lhsBoxIndices = [];
        for (let i = 0; i < nLhsBoxes; i++) lhsBoxIndices.push(rowStartBox + i);
        const rhsBoxIndices = [];
        for (let i = 0; i < nRhsBoxes; i++) rhsBoxIndices.push(rowStartBox + nLhsBoxes + i);

        const lhsContent = buildSideContent(lhsText, lhsBoxIndices, rowStartBox, rowBoxCount, rowFullyFilled);
        const rhsContent = buildSideContent(rhsText, rhsBoxIndices, rowStartBox, rowBoxCount, rowFullyFilled);
        boxGlobalIndex += rowBoxCount;

        rows.push(
          React.createElement("div", { key: `row-${rowIndex}`, className: "calc-row" },
            React.createElement("div", { className: "calc-cell-lhs" }, ...lhsContent),
            React.createElement("div", { className: "calc-cell-eq" }, "="),
            React.createElement("div", { className: "calc-cell-rhs" }, ...rhsContent)
          )
        );
      });
    }

    return rows;
  };

  const renderRightPanelContent = () => {
    if (step === 3) return null;
    if (step === 4) return currentMcqData ? renderCurrentMcq() : null;
    if (step === 5) {
      // Disable numpad when current row is fully filled (user must click Next to reveal next row)
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

  // Step 6: Final step - image + final answer only (no calculation rows)
  if (step === 6) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final with-image" },
        React.createElement("div", { className: "calc-image-row" },
          imageSrc && React.createElement("img", { src: imageSrc, alt: triangleAltText, className: "calc-image" })
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

  // Step 3: image + findings only, no calc rows
  if (step === 3) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        React.createElement("div", { className: "calc-image-row" },
        imageSrc && React.createElement("img", { src: imageSrc, alt: triangleAltText, className: "calc-image" })
        ),
        React.createElement("div", { className: "calc-equation-row" })
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  // Steps 4–5: Left = image + (formula row when added) + calc rows for step 5; Right = findings + MCQ or numpad
  const showFormulaRow = step >= 4 && calcState.formulaRowAdded;
  const showCalcRows = step === 5;
  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    React.createElement(
      "div",
      { className: "calc-left-panel with-image" },
      React.createElement("div", { className: "calc-image-row" },
        imageSrc && React.createElement("img", { src: imageSrc, alt: triangleAltText, className: "calc-image" })
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        (showFormulaRow || showCalcRows) && React.createElement(
          "div",
          { className: "calc-rows-container" },
          React.createElement(
            "div",
            { className: "calc-rows-table" },
            ...renderCalcRows()
          )
        )
      )
    ),
    React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
  );
};
