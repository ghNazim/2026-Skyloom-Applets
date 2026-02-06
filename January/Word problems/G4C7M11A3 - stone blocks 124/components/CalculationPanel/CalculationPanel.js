const CalculationPanel = ({
  step,
  onEnableNext,
  onUpdateNavText,
  interactiveBoxState1,
  setInteractiveBoxState1,
  interactiveBoxState2,
  setInteractiveBoxState2,
  calcState,
  setCalcState,
  imageSrc,
  onUpdateImage
}) => {
  const { useState, useEffect } = React;

  const calc1Data = APP_DATA.calculation1;
  const calc2Data = APP_DATA.calculation2;
  const mcqData = APP_DATA.conversionMcq;
  const calc3Data = APP_DATA.calculation3;
  const finalData = APP_DATA.calculationFinal;
  const labels = APP_DATA.labels || {};
  const calculation = APP_DATA.calculation || {};

  const [numpadValue, setNumpadValue] = useState("");
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);

  useEffect(() => {
    setNumpadValue("");
    setActiveBoxIndex(0);
    setInputError(false);
    setInputCorrect(false);
    setSelectedMcqOption(null);
    setMcqCorrect(false);
  }, [step]);

  // Step 4: First substep – 3 boxes (1, 2, 4); second substep – 1 box (7)
  const handleCalc1NumberClick = (num) => {
    const substep = calcState.calc1Substep || 0;
    const maxLength = 1;
    if (substep === 0) {
      const boxIndex = activeBoxIndex;
      const current = calcState.calc1BoxValues || [null, null, null];
      const next = [...current];
      next[boxIndex] = String(num);
      setCalcState(prev => ({ ...prev, calc1BoxValues: next }));
    } else {
      if ((calcState.calc1ResultValue || "").length < maxLength) {
        setCalcState(prev => ({ ...prev, calc1ResultValue: (prev.calc1ResultValue || "") + num }));
      }
    }
  };

  const handleCalc1Clear = () => {
    const substep = calcState.calc1Substep || 0;
    if (substep === 0) {
      const current = calcState.calc1BoxValues || [null, null, null];
      const boxIndex = activeBoxIndex;
      const next = [...current];
      next[boxIndex] = null;
      setCalcState(prev => ({ ...prev, calc1BoxValues: next }));
    } else {
      setCalcState(prev => ({ ...prev, calc1ResultValue: (prev.calc1ResultValue || "").slice(0, -1) }));
    }
  };

  const handleCalc1Submit = () => {
    const substep = calcState.calc1Substep || 0;
    const answers = calc1Data.rows[2].answers;
    if (substep === 0) {
      const vals = calcState.calc1BoxValues || [null, null, null];
      const idx = activeBoxIndex;
      const correct = vals[idx] === answers[idx];
      if (correct) {
        if (window.playSound) window.playSound("correct");
        setInputCorrect(true);
        setInputError(false);
        if (idx < 2) {
          setTimeout(() => {
            setInputCorrect(false);
            setActiveBoxIndex(idx + 1);
          }, 300);
        } else {
          setTimeout(() => {
            setInputCorrect(false);
            setCalcState(prev => ({ ...prev, calc1BoxesFinal: true }));
            if (onEnableNext) onEnableNext();
            if (onUpdateNavText) {
              const stepData = APP_DATA.steps[4];
              onUpdateNavText(stepData.navTextCorrect);
            }
          }, 800);
        }
      } else {
        if (window.playSound) window.playSound("wrong");
        setInputError(true);
        setTimeout(() => setInputError(false), 300);
      }
    } else {
      const val = calcState.calc1ResultValue || "";
      const correctAnswer = calc1Data.rows[3].answer;
      if (val === correctAnswer) {
        if (window.playSound) window.playSound("correct");
        setInputCorrect(true);
        setTimeout(() => {
          setInputCorrect(false);
          setCalcState(prev => ({
            ...prev,
            calc1ResultFinal: true,
            findings: [calc1Data.findingsListStep5[0]]
          }));
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText) {
            const stepData = APP_DATA.steps[4];
            onUpdateNavText(stepData.navTextCorrect);
          }
        }, 800);
      } else {
        if (window.playSound) window.playSound("wrong");
        setInputError(true);
        setTimeout(() => setInputError(false), 300);
      }
    }
  };

  // Step 6: One box (7), then show result row
  const handleCalc2NumberClick = (num) => {
    if ((calcState.calc2BoxValue || "").length < (calc2Data.numpadMaxLength || 1)) {
      setCalcState(prev => ({ ...prev, calc2BoxValue: (prev.calc2BoxValue || "") + num }));
    }
  };

  const handleCalc2Clear = () => {
    setCalcState(prev => ({ ...prev, calc2BoxValue: (prev.calc2BoxValue || "").slice(0, -1) }));
  };

  const handleCalc2Submit = () => {
    const correct = (calcState.calc2BoxValue || "") === calc2Data.numpadAnswer;
    if (correct) {
      if (window.playSound) window.playSound("correct");
      setInputCorrect(true);
      setTimeout(() => {
        setInputCorrect(false);
        setCalcState(prev => ({ ...prev, calc2BoxFinal: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[6];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 800);
    } else {
      if (window.playSound) window.playSound("wrong");
      setInputError(true);
      setTimeout(() => setInputError(false), 300);
    }
  };

  // Step 7: MCQ
  const handleMcqOptionClick = (index) => {
    if (mcqCorrect) return;
    setSelectedMcqOption(index);
    if (index === mcqData.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setCalcState(prev => ({
          ...prev,
          mcqAnswered: true,
          findings: [
            ...(prev.findings || []),
            mcqData.conversionFinding
          ]
        }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[7];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  // Step 8: Substitute box click
  const handleSubstituteClick = () => {
    if (calcState.calc3Substituted) return;
    if (window.playSound) window.playSound("tick");
    setCalcState(prev => ({ ...prev, calc3Substituted: true }));
    setTimeout(() => {
      if (onEnableNext) onEnableNext();
      if (onUpdateNavText) {
        const stepData = APP_DATA.steps[8];
        onUpdateNavText(stepData.navTextCorrect);
      }
    }, 500);
  };

  // ----- Findings -----
  const getFindings = () => {
    const title = labels.findings || "Findings";
    if (step === 4) {
      return { title: calc1Data.findingsTitle || title, list: calc1Data.findingsListStep4 || [] };
    }
    if (step === 6) {
      return { title: labels.findings || title, list: calcState.findings || calc2Data.findingsList || [] };
    }
    if (step === 7 || step === 8 || step === 9) {
      return { title: labels.findings || title, list: calcState.findings || [] };
    }
    return { title: title, list: [] };
  };

  // ----- Step 4 rows -----
  const renderStep4Rows = () => {
    const rows = [];
    const substep = calcState.calc1Substep || 0;
    const r0 = calc1Data.rows[0];
    const r1 = calc1Data.rows[1];
    const r2 = calc1Data.rows[2];
    const r3 = calc1Data.rows[3];
    rows.push(React.createElement("div", { key: "r0", className: "calc-row" }, r0.text));
    rows.push(React.createElement("div", { key: "r1", className: "calc-row" }, r1.text));
    const boxVals = calcState.calc1BoxValues || [null, null, null];
    const answers = r2.answers;
    const showFinalState = calcState.calc1BoxesFinal === true;
    if (showFinalState) {
      rows.push(
        React.createElement("div", { key: "r2", className: "calc-row calc-row-final" },
          "= ", answers[0], " + ", answers[1], " + ", answers[2], r2.unit || " m³"
        )
      );
    } else {
      const boxEls = [0, 1, 2].flatMap(i => {
        const isActive = activeBoxIndex === i;
        const isDone = i < activeBoxIndex && boxVals[i] != null;
        let className = "calc-input-box";
        if (isDone) className += " correct";
        else if (isActive) className += " active";
        if (inputError && isActive) className += " error shake";
        if (inputCorrect && isActive) className += " correct";
        return [
          i > 0 ? " + " : null,
          React.createElement(
            "span",
            {
              key: i,
              className: className,
              onClick: () => { if (i <= activeBoxIndex) setActiveBoxIndex(i); }
            },
            boxVals[i] != null ? boxVals[i] : ""
          )
        ];
      }).filter(Boolean);
      rows.push(
        React.createElement("div", { key: "r2", className: "calc-row" }, "= ", ...boxEls, r2.unit || " m³")
      );
    }
    if (substep === 1) {
      const resultFinal = calcState.calc1ResultFinal === true;
      if (resultFinal) {
        rows.push(
          React.createElement("div", { key: "r3", className: "calc-row calc-row-final" },
            "= ", calc1Data.rows[3].answer, " " + (r3.unit || " m³")
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "r3", className: "calc-row" },
            "= ",
            React.createElement("span", {
              className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrect ? "correct" : ""}`
            }, calcState.calc1ResultValue || ""),
            " " + (r3.unit || " m³")
          )
        );
      }
    }
    return rows;
  };

  // ----- Step 6 rows -----
  const renderStep6Rows = () => {
    const rows = [];
    const substep = calcState.calc2Substep || 0;
    const boxFinal = calcState.calc2BoxFinal === true;
    rows.push(React.createElement("div", { key: "r0", className: "calc-row" }, calc2Data.rows[0].text));
    if (boxFinal) {
      rows.push(
        React.createElement("div", { key: "r1", className: "calc-row calc-row-final" },
          calc2Data.rows[1].parts[0], calc2Data.numpadAnswer, calc2Data.rows[1].parts[2]
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "r1", className: "calc-row" },
          calc2Data.rows[1].parts[0],
          React.createElement("span", {
            className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrect ? "correct" : ""}`
          }, calcState.calc2BoxValue || ""),
          calc2Data.rows[1].parts[2]
        )
      );
    }
    if (substep === 1) {
      rows.push(React.createElement("div", { key: "r2", className: "calc-row" }, calc2Data.rows[2].text));
    }
    return rows;
  };

  // ----- Step 7: question div + calc rows after MCQ -----
  const renderStep7Left = () => {
    const leftPanelQuestion = APP_DATA.questionText || "";
    const rows = [];
    if (calcState.mcqAnswered && mcqData.calcRowsOnAnswer) {
      mcqData.calcRowsOnAnswer.forEach((line, i) => {
        rows.push(React.createElement("div", { key: `mcq-row-${i}`, className: "calc-row" }, line));
      });
    }
    return React.createElement(
      "div",
      { className: "calc-left-panel with-question" },
      React.createElement("div", { className: "calc-question-row" }, leftPanelQuestion),
      rows.length > 0
        ? React.createElement("div", { className: "calc-equation-row" }, React.createElement("div", { className: "calc-rows-container" }, rows))
        : null
    );
  };

  // ----- Step 8: previous rows + substitute row -----
  const renderStep8Rows = () => {
    const rows = [];
    if (mcqData.calcRowsOnAnswer) {
      mcqData.calcRowsOnAnswer.forEach((line, i) => {
        rows.push(React.createElement("div", { key: `r-${i}`, className: "calc-row" }, line));
      });
    }
    const substituted = calcState.calc3Substituted;
    const rowText = substituted ? calc3Data.substitutedRow : calc3Data.substituteRow;
    if (substituted) {
      rows.push(React.createElement("div", { key: "sub", className: "calc-row" }, rowText));
    } else {
      const parts = rowText.split("[[Volume in m³]]");
      rows.push(
        React.createElement("div", { key: "sub", className: "calc-row" },
          parts[0],
          React.createElement("span", { className: "calc-interactive-box clickable", onClick: handleSubstituteClick }, calc3Data.substitutePlaceholder),
          parts[1]
        )
      );
    }
    return rows;
  };

  // ----- Step 9: all 4 calc rows + final answer -----
  const renderStep9Rows = () => {
    const rows = [];
    if (mcqData.calcRowsOnAnswer) {
      mcqData.calcRowsOnAnswer.forEach((line, i) => {
        rows.push(React.createElement("div", { key: `r-${i}`, className: "calc-row" }, line));
      });
    }
    rows.push(React.createElement("div", { key: "sub", className: "calc-row" }, calc3Data.substitutedRow));
    rows.push(React.createElement("div", { key: "final", className: "calc-row" }, finalData.finalRow));
    return rows;
  };

  const findingsData = getFindings();
  const rightPanel = React.createElement(
    "div",
    { className: "calc-input-panel" },
    React.createElement(
      "div",
      { className: "calc-findings-div" },
      React.createElement("div", { className: "findings-title" }, findingsData.title),
      React.createElement("ul", { className: "findings-list" }, findingsData.list.map((item, i) => React.createElement("li", { key: i }, item)))
    ),
    React.createElement("div", { className: "calc-input-div" }, renderInputContent())
  );

  function renderInputContent() {
    // Step 4: numpad (3 boxes or 1 box) – hide when that substep is done (final state shown)
    if (step === 4) {
      const substep = calcState.calc1Substep || 0;
      if (substep === 0) {
        if (calcState.calc1BoxesFinal) return null;
        return React.createElement(Numpad, {
          onNumberClick: handleCalc1NumberClick,
          onClear: handleCalc1Clear,
          onSubmit: handleCalc1Submit
        });
      }
      if (calcState.calc1ResultFinal) return null;
      return React.createElement(Numpad, {
        onNumberClick: (num) => setCalcState(prev => ({ ...prev, calc1ResultValue: (prev.calc1ResultValue || "") + num })),
        onClear: () => setCalcState(prev => ({ ...prev, calc1ResultValue: (prev.calc1ResultValue || "").slice(0, -1) })),
        onSubmit: handleCalc1Submit
      });
    }
    // Step 6: numpad – hide when answer correct and final state shown
    if (step === 6 && (calcState.calc2Substep || 0) === 0) {
      if (calcState.calc2BoxFinal) return null;
      return React.createElement(Numpad, {
        onNumberClick: handleCalc2NumberClick,
        onClear: handleCalc2Clear,
        onSubmit: handleCalc2Submit
      });
    }
    // Step 7: MCQ
    if (step === 7 && !calcState.mcqAnswered) {
      return React.createElement(
        "div",
        { className: "calc-mcq" },
        React.createElement("div", { className: "calc-mcq-title" }, mcqData.title),
        React.createElement(
          "div",
          { className: "calc-mcq-options" },
          mcqData.options.map((option, index) => {
            let className = "calc-mcq-option";
            if (selectedMcqOption === index) className += index === mcqData.answerIndex ? " correct" : " incorrect";
            if (mcqCorrect && index !== mcqData.answerIndex) className += " disabled";
            return React.createElement("button", {
              key: index,
              className,
              onClick: () => handleMcqOptionClick(index),
              disabled: mcqCorrect
            }, option);
          })
        )
      );
    }
    return null;
  }

  function leftPanelWithQuestion(equationContent, finalAnswerContent, isFinal) {
    const questionText = APP_DATA.questionText || "";
    const panelClass = "calc-left-panel with-question" + (isFinal ? " final" : "");
    return React.createElement(
      "div",
      { className: panelClass },
      React.createElement("div", { className: "calc-question-row" }, questionText),
      React.createElement("div", { className: "calc-equation-row" }, equationContent, finalAnswerContent || null)
    );
  }

  // Step 4
  if (step === 4) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        React.createElement("div", { className: "calc-image-row" }, imageSrc && React.createElement("img", { src: imageSrc, alt: (calculation.altTexts && calculation.altTexts.stones) || "Stones", className: "calc-image" })),
        React.createElement("div", { className: "calc-equation-row" }, React.createElement("div", { className: "calc-rows-container" }, renderStep4Rows()))
      ),
      React.createElement("div", { className: "calc-right-panel" }, rightPanel)
    );
  }

  // Step 6 – question row instead of image
  if (step === 6) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      leftPanelWithQuestion(React.createElement("div", { className: "calc-rows-container" }, renderStep6Rows())),
      React.createElement("div", { className: "calc-right-panel" }, rightPanel)
    );
  }

  // Step 7
  if (step === 7) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      renderStep7Left(),
      React.createElement("div", { className: "calc-right-panel" }, rightPanel)
    );
  }

  // Step 8 – question row instead of image
  if (step === 8) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      leftPanelWithQuestion(React.createElement("div", { className: "calc-rows-container" }, renderStep8Rows())),
      React.createElement("div", { className: "calc-right-panel" }, rightPanel)
    );
  }

  // Step 9 (final) – question row instead of image
  if (step === 9) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      leftPanelWithQuestion(
        React.createElement("div", { className: "calc-rows-container" }, renderStep9Rows()),
        React.createElement("div", { className: "final-answer-div" }, finalData.finalAnswer),
        true
      ),
      React.createElement("div", { className: "calc-right-panel" }, rightPanel)
    );
  }

  return null;
};
