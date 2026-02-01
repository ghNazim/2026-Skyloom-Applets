const CalculationPanel = ({ 
  step, 
  onEnableNext, 
  onUpdateNavText,
  calcState,
  setCalcState
}) => {
  const { useState, useEffect } = React;
  
  const stepData = APP_DATA.steps[step];
  
  // Local state for numpad input
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);
  const [inputCorrectBoxIndex, setInputCorrectBoxIndex] = useState(null);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  
  // MCQ state for step 13
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);
  const [showPostMcq, setShowPostMcq] = useState(false);
  
  // Reset states on step change
  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
    setInputCorrectBoxIndex(null);
    setCurrentBoxIndex(0);
    setSelectedMcqOption(null);
    setMcqCorrect(false);
    setShowPostMcq(calcState.mcqStep13Answered && step === 13);
  }, [step]);

  // When step 13 enters numpad phase (after MCQ), update nav text
  useEffect(() => {
    if (step === 13 && showPostMcq && stepData.navTextNumpad && onUpdateNavText) {
      onUpdateNavText(stepData.navTextNumpad);
    }
  }, [step, showPostMcq]);
  
  // Handle numpad input
  const handleNumberClick = (num) => {
    const calcKey = stepData.calcKey;
    const calcData = APP_DATA[calcKey];
    
    let maxLength;
    if (calcData.boxes) {
      maxLength = calcData.boxes[currentBoxIndex].maxLength;
    } else if (calcData.box) {
      maxLength = calcData.box.maxLength;
    } else {
      maxLength = 5;
    }
    
    if (numpadValue.length < maxLength) {
      setNumpadValue(prev => prev + num);
    }
  };
  
  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    const calcKey = stepData.calcKey;
    const calcData = APP_DATA[calcKey];
    
    let correctAnswer;
    if (calcData.boxes) {
      correctAnswer = calcData.boxes[currentBoxIndex].answer;
    } else if (calcData.box) {
      correctAnswer = calcData.box.answer;
    }
    
    if (numpadValue === correctAnswer) {
      setInputCorrect(true);
      setInputCorrectBoxIndex(currentBoxIndex);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setInputCorrect(false);
        setInputCorrectBoxIndex(null);
        
        // Handle multi-box steps
        if (calcData.boxes && currentBoxIndex < calcData.boxes.length - 1) {
          // Move to next box
          updateCalcStateValue(numpadValue);
          setCurrentBoxIndex(prev => prev + 1);
          setNumpadValue("");
        } else {
          // All boxes filled or single box step
          updateCalcStateValue(numpadValue);
          
          // Add finding if applicable
          if (calcData.findingOnCorrect) {
            setCalcState(prev => ({
              ...prev,
              findings: [...prev.findings, calcData.findingOnCorrect]
            }));
          }
          
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText) {
            onUpdateNavText(stepData.navTextCorrect);
          }
        }
      }, 800);
    } else {
      setInputError(true);
      if (window.playSound) window.playSound("wrong");
      setTimeout(() => {
        setInputError(false);
        setNumpadValue("");
      }, 300);
    }
  };
  
  // Update calc state with current value
  const updateCalcStateValue = (value) => {
    const stateKey = `step${step}Value${currentBoxIndex > 0 ? 's' : ''}`;
    
    if (step === 4) {
      setCalcState(prev => {
        const newValues = [...prev.step4Values];
        newValues[currentBoxIndex] = value;
        return { ...prev, step4Values: newValues };
      });
    } else if (step === 5) {
      setCalcState(prev => ({ ...prev, step5Value: value }));
    } else if (step === 6) {
      setCalcState(prev => ({ ...prev, step6Value: value }));
    } else if (step === 7) {
      setCalcState(prev => ({ ...prev, step7Value: value }));
    } else if (step === 8) {
      setCalcState(prev => ({ ...prev, step8Value: value }));
    } else if (step === 10) {
      setCalcState(prev => ({ ...prev, step10Value: value }));
    } else if (step === 12) {
      setCalcState(prev => ({ ...prev, step12Value: value }));
    } else if (step === 13) {
      setCalcState(prev => {
        const newValues = [...prev.step13Values];
        newValues[currentBoxIndex] = value;
        return { ...prev, step13Values: newValues };
      });
    }
  };
  
  // Handle MCQ click for step 13
  const handleMcqOptionClick = (index) => {
    if (mcqCorrect) return;
    
    const mcqData = APP_DATA[stepData.mcqKey];
    setSelectedMcqOption(index);
    
    if (index === mcqData.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, mcqStep13Answered: true }));
        setShowPostMcq(true);
        setCurrentBoxIndex(0);
      }, 1000);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  // Get findings list for right panel
  const getFindings = () => {
    // Step 13 should not show findings
    if (step === 13) {
      return [];
    }
    if (stepData.findingsList) {
      return stepData.findingsList;
    }
    if (stepData.showEmptyFindings) {
      return calcState.findings;
    }
    return calcState.findings;
  };
  
  // Check if there's an active input box
  const hasActiveInputBox = () => {
    if (step === 13 && !showPostMcq) {
      return false; // MCQ phase, no input box
    }
    
    const calcKey = stepData.calcKey;
    if (!calcKey) return false;
    
    const calcData = APP_DATA[calcKey];
    if (!calcData) return false;
    
    if (calcData.boxes) {
      // Multi-box step - check if current box is not filled
      const stateKey = `step${step}Values`;
      const values = calcState[stateKey] || [];
      return currentBoxIndex < calcData.boxes.length && !values[currentBoxIndex];
    } else if (calcData.box) {
      // Single box step - check if not filled
      const stateKey = `step${step}Value`;
      return !calcState[stateKey];
    }
    
    return false;
  };
  
  // Render calculation rows for Steps 4-5 (Monday conversion)
  const renderStep4Rows = () => {
    const calcData = APP_DATA.calcStep4;
    const rows = [];
    
    rows.push(
      React.createElement("div", { key: "day-label", className: "calc-row calc-day-label" }, 
        calcData.dayLabel
      )
    );
    
    rows.push(
      React.createElement("div", { key: "initial-line", className: "calc-row" }, 
        calcData.initialLine
      )
    );
    
    // Input line with two boxes
    const box1Filled = calcState.step4Values[0] !== "";
    const box2Filled = calcState.step4Values[1] !== "";
    
    rows.push(
      React.createElement("div", { key: "input-line", className: "calc-row" },
        "= ",
        React.createElement(
          "span",
          { 
            className: `calc-input-box ${currentBoxIndex === 0 && !box1Filled ? 'active' : ''} ${inputError && currentBoxIndex === 0 ? 'error shake' : ''} ${inputCorrectBoxIndex === 0 ? 'correct' : ''} ${box1Filled ? 'filled' : ''}` 
          },
          box1Filled ? calcState.step4Values[0] : (currentBoxIndex === 0 ? numpadValue : "")
        ),
        " × 1000 + ",
        React.createElement(
          "span",
          { 
            className: `calc-input-box ${currentBoxIndex === 1 && !box2Filled ? 'active' : ''} ${inputError && currentBoxIndex === 1 ? 'error shake' : ''} ${inputCorrectBoxIndex === 1 ? 'correct' : ''} ${box2Filled ? 'filled' : ''}` 
          },
          box2Filled ? calcState.step4Values[1] : (currentBoxIndex === 1 ? numpadValue : "")
        ),
        APP_DATA.labels.unitMl
      )
    );
    
    return rows;
  };
  
  // Render calculation rows for Step 5 (Monday result)
  const renderStep5Rows = () => {
    const calcData4 = APP_DATA.calcStep4;
    const calcData5 = APP_DATA.calcStep5;
    const rows = [];
    
    // Show completed Step 4 rows
    rows.push(
      React.createElement("div", { key: "day-label", className: "calc-row calc-day-label" }, 
        calcData4.dayLabel
      )
    );
    
    rows.push(
      React.createElement("div", { key: "initial-line", className: "calc-row" }, 
        calcData4.initialLine
      )
    );
    
    rows.push(
      React.createElement("div", { key: "filled-line", className: "calc-row" },
        `= ${calcState.step4Values[0]} × 1000 + ${calcState.step4Values[1]} mL`
      )
    );
    
    // Result input
    const resultFilled = calcState.step5Value !== "";
    rows.push(
      React.createElement("div", { key: "result-line", className: "calc-row" },
        "= ",
        React.createElement(
          "span",
          { 
            className: `calc-input-box ${!resultFilled ? 'active' : ''} ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''} ${resultFilled ? 'filled' : ''}` 
          },
          resultFilled ? calcState.step5Value : numpadValue
        ),
        APP_DATA.labels.unitMl
      )
    );
    
    return rows;
  };
  
  // Render calculation rows for Steps 6-8 (Tuesday, Wednesday, Thursday)
  const renderDayCalcRows = (calcKey) => {
    const calcData = APP_DATA[calcKey];
    const stateKey = `step${step}Value`;
    const filledValue = calcState[stateKey];
    const rows = [];
    
    rows.push(
      React.createElement("div", { key: "day-label", className: "calc-row calc-day-label" }, 
        calcData.dayLabel
      )
    );
    
    rows.push(
      React.createElement("div", { key: "initial-line", className: "calc-row" }, 
        calcData.initialLine
      )
    );
    
    const resultFilled = filledValue !== "";
    rows.push(
      React.createElement("div", { key: "result-line", className: "calc-row" },
        "= ",
        React.createElement(
          "span",
          { 
            className: `calc-input-box ${!resultFilled ? 'active' : ''} ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''} ${resultFilled ? 'filled' : ''}` 
          },
          resultFilled ? filledValue : numpadValue
        ),
        APP_DATA.labels.unitMl
      )
    );
    
    return rows;
  };
  
  // Render addition/subtraction format rows (Steps 10, 12)
  const renderAdditionFormatRows = () => {
    const calcData = APP_DATA[stepData.calcKey];
    const stateKey = `step${step}Value`;
    const filledValue = calcState[stateKey];
    const resultFilled = filledValue !== "";
    
    return React.createElement(
      "div",
      { className: "addition-format-container" },
      // Label
      React.createElement("div", { className: "addition-label" }, calcData.label),
      // Values in addition format
      React.createElement(
        "div",
        { className: "addition-rows" },
        calcData.values.map((value, index) => 
          React.createElement(
            "div",
            { key: `value-${index}`, className: "addition-row" },
            React.createElement("span", { className: "addition-operator" }, 
              index === 0 ? "=" : calcData.operator
            ),
            React.createElement("span", { className: "addition-value" }, value)
          )
        ),
        // Separator line
        React.createElement("div", { className: "addition-separator" }),
        // Result row
        React.createElement(
          "div",
          { className: "addition-row result-row" },
          React.createElement("span", { className: "addition-operator" }, ""),
          React.createElement(
            "span",
            { 
              className: resultFilled?"":`calc-input-box addition-input ${!resultFilled ? 'active' : ''} ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''} ${resultFilled ? 'filled' : ''}` 
            },
            resultFilled ? filledValue : numpadValue
          ),
          React.createElement("span", { className: "addition-unit" }, APP_DATA.labels.unitMl)
        )
      )
    );
  };
  
  // Render Step 13 (MCQ then conversion)
  const renderStep13 = () => {
    const mcqData = APP_DATA.conversionMcq;
    const rows = [];
    
    // Initial result line
    rows.push(
      React.createElement("div", { key: "result-line", className: "calc-row" },
        mcqData.firstLine
      )
    );
    
    if (showPostMcq) {
      // Show post-MCQ conversion inputs
      const box1Filled = calcState.step13Values[0] !== "";
      const box2Filled = calcState.step13Values[1] !== "";
      
      rows.push(
        React.createElement("div", { key: "conv-line", className: "calc-row" },
          mcqData.postMcqLines[0]
        )
      );
      
      rows.push(
        React.createElement("div", { key: "final-line", className: "calc-row" },
          mcqData.finalLinePrefix,
          React.createElement(
            "span",
            { 
              className: `calc-input-box ${currentBoxIndex === 0 && !box1Filled ? 'active' : ''} ${inputError && currentBoxIndex === 0 ? 'error shake' : ''} ${inputCorrectBoxIndex === 0 ? 'correct' : ''} ${box1Filled ? 'filled' : ''}` 
            },
            box1Filled ? calcState.step13Values[0] : (currentBoxIndex === 0 ? numpadValue : "")
          ),
          APP_DATA.labels.unitL,
          React.createElement(
            "span",
            { 
              className: `calc-input-box ${currentBoxIndex === 1 && !box2Filled ? 'active' : ''} ${inputError && currentBoxIndex === 1 ? 'error shake' : ''} ${inputCorrectBoxIndex === 1 ? 'correct' : ''} ${box2Filled ? 'filled' : ''}` 
            },
            box2Filled ? calcState.step13Values[1] : (currentBoxIndex === 1 ? numpadValue : "")
          ),
          APP_DATA.labels.unitMl
        )
      );
    }
    
    return React.createElement(
      "div",
      { className: "calc-left-panel with-question" },
      React.createElement(
        "div",
        { className: "calc-question-row" },
        APP_DATA.questionText
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        React.createElement(
          "div",
          { className: "calc-rows-container" },
          rows
        )
      )
    );
  };
  
  // Render right panel with findings and numpad
  const renderRightPanel = () => {
    const findings = getFindings();
    const showFindings = findings.length > 0 || (step === 3);
    const showNumpad = hasActiveInputBox();
    const showMcq = step === 13 && !showPostMcq;
    
    return React.createElement(
      "div",
      { className: "calc-input-panel" },
      // Findings div (hide for step 13)
      showFindings && !showMcq && React.createElement(
        "div",
        { className: "calc-findings-div" },
        React.createElement("div", { className: "findings-title" }, APP_DATA.labels.findings),
        React.createElement(
          "ul",
          { className: "findings-list" },
          findings.map((finding, index) =>
            React.createElement("li", { key: `finding-${index}` }, finding)
          )
        )
      ),
      // MCQ for step 13 (in right panel)
      showMcq && React.createElement(
        "div",
        { className: "calc-mcq-div" },
        React.createElement("div", { className: "calc-mcq-title" }, APP_DATA.conversionMcq.title),
        React.createElement(
          "div",
          { className: "calc-mcq-options" },
          APP_DATA.conversionMcq.options.map((option, index) => {
            let className = "calc-mcq-option";
            if (selectedMcqOption === index) {
              className += index === APP_DATA.conversionMcq.answerIndex ? " correct" : " incorrect";
            }
            if (mcqCorrect && index !== APP_DATA.conversionMcq.answerIndex) {
              className += " disabled";
            }
            
            return React.createElement(
              "button",
              {
                key: `mcq-${index}`,
                className: className,
                onClick: () => handleMcqOptionClick(index),
                disabled: mcqCorrect
              },
              option
            );
          })
        )
      ),
      // Numpad (only show when there's an active input box)
      showNumpad && React.createElement(
        "div",
        { className: "calc-input-div" },
        React.createElement(Numpad, {
          onNumberClick: handleNumberClick,
          onClear: handleClear,
          onSubmit: handleSubmit
        })
      )
    );
  };
  
  // Step 14: Final step - keep step 13 layout and add final answer at bottom of left panel
  const renderStep14Final = () => {
    const step13Values = calcState.step13Values || ["7", "800"];
    const rows = [
      React.createElement("div", { key: "result-line", className: "calc-row" }, APP_DATA.conversionMcq.firstLine),
      React.createElement("div", { key: "conv-line", className: "calc-row" }, APP_DATA.conversionMcq.postMcqLines[0]),
      React.createElement("div", { key: "final-line", className: "calc-row" },
        APP_DATA.conversionMcq.finalLinePrefix,
        step13Values[0], APP_DATA.labels.unitL, step13Values[1], APP_DATA.labels.unitMl
      )
    ];
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      // Left panel: question + calc rows from step 13 + final answer div
      React.createElement(
        "div",
        { className: "calc-left-panel with-question final" },
        React.createElement("div", { className: "calc-question-row" }, APP_DATA.questionText),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, rows),
          React.createElement("div", { className: "final-answer-div" }, APP_DATA.finalAnswer)
        )
      ),
      // Right panel: keep same structure, empty
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        React.createElement("div", { className: "calc-input-panel" })
      )
    );
  };

  // Render left panel based on step
  const renderLeftPanel = () => {
    // Steps 10, 12 - Addition format
    if (stepData.isAdditionFormat) {
      return React.createElement(
        "div",
        { className: "calc-left-panel with-question" },
        React.createElement(
          "div",
          { className: "calc-question-row" },
          APP_DATA.questionText
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          renderAdditionFormatRows()
        )
      );
    }
    
    // Step 13 - MCQ then calc
    if (stepData.isMcqThenCalc) {
      return renderStep13();
    }
    
    // Steps 4-8 - Day conversions
    let calcRows;
    if (step === 4) {
      calcRows = renderStep4Rows();
    } else if (step === 5) {
      calcRows = renderStep5Rows();
    } else if (step === 6 || step === 7 || step === 8) {
      calcRows = renderDayCalcRows(stepData.calcKey);
    }
    
    return React.createElement(
      "div",
      { className: "calc-left-panel with-question" },
      React.createElement(
        "div",
        { className: "calc-question-row" },
        APP_DATA.questionText
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        React.createElement(
          "div",
          { className: "calc-rows-container" },
          calcRows
        )
      )
    );
  };
  
  if (step === 14) {
    return renderStep14Final();
  }

  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    renderLeftPanel(),
    React.createElement(
      "div",
      { className: "calc-right-panel" },
      renderRightPanel()
    )
  );
};

// MCQ Panel component for Step 3
const MCQPanelStep3 = ({ step, mcqKey, onEnableNext, onUpdateNavText, calcState, setCalcState, showFindings }) => {
  const { useState } = React;
  const mcqData = APP_DATA[mcqKey];
  const stepData = APP_DATA.steps[step];
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleOptionClick = (index) => {
    if (isCorrect) return;
    
    setSelectedOption(index);
    
    if (index === mcqData.answerIndex) {
      setIsCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        // Add finding
        if (mcqData.findingOnCorrect) {
          setCalcState(prev => ({
            ...prev,
            findings: [...prev.findings, mcqData.findingOnCorrect],
            mcqStep3Answered: true
          }));
        }
        
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    // Left panel with question
    React.createElement(
      "div",
      { className: "calc-left-panel with-question" },
      React.createElement(
        "div",
        { className: "calc-question-row" },
        APP_DATA.questionText
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        // Empty - just showing question
      )
    ),
    // Right panel with MCQ and findings
    React.createElement(
      "div",
      { className: "calc-right-panel" },
      React.createElement(
        "div",
        { className: "calc-input-panel" },
        // Findings div
        React.createElement(
          "div",
          { className: "calc-findings-div" },
          React.createElement("div", { className: "findings-title" }, APP_DATA.labels.findings),
          React.createElement(
            "ul",
            { className: "findings-list" },
            calcState.findings.map((finding, index) =>
              React.createElement("li", { key: `finding-${index}` }, finding)
            )
          )
        ),
        // MCQ
        React.createElement(
          "div",
          { className: "calc-mcq-div" },
          React.createElement("div", { className: "calc-mcq-title" }, mcqData.title),
          React.createElement(
            "div",
            { className: "calc-mcq-options" },
            mcqData.options.map((option, index) => {
              let className = "calc-mcq-option";
              if (selectedOption === index) {
                className += index === mcqData.answerIndex ? " correct" : " incorrect";
              }
              if (isCorrect && index !== mcqData.answerIndex) {
                className += " disabled";
              }
              
              return React.createElement(
                "button",
                {
                  key: `mcq-${index}`,
                  className: className,
                  onClick: () => handleOptionClick(index),
                  disabled: isCorrect
                },
                option
              );
            })
          )
        )
      )
    )
  );
};
