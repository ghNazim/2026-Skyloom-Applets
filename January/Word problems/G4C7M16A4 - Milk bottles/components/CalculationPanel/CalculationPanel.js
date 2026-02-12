const CalculationPanel = ({ 
  step, 
  onEnableNext, 
  onUpdateNavText,
  // State passed from parent for persistence
  interactiveBoxState1,
  setInteractiveBoxState1,
  interactiveBoxState2,
  setInteractiveBoxState2,
  calcState,
  setCalcState,
  imageSrc,
  onUpdateImage
}) => {
  const { useState, useEffect, useRef } = React;
  
  const calc1Data = APP_DATA.calculation1;
  const calc2Data = APP_DATA.calculation2;
  const mcqData = APP_DATA.conversionMcq;
  const comprehendData = APP_DATA.comprehend;
  const calcDisplayData = APP_DATA.calculation;
  
  // Local state for numpad input (steps 5, 8)
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);
  
  // Steps 4 & 7: two input boxes with numpad
  const [inputBoxValues, setInputBoxValues] = useState(["", ""]);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [inputBoxCorrect, setInputBoxCorrect] = useState([false, false]);
  const [inputBoxError, setInputBoxError] = useState(false);
  
  // MCQ state
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);
  
  // Reset states on step change
  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
    setSelectedMcqOption(null);
    setMcqCorrect(false);
    setInputBoxValues(["", ""]);
    setActiveInputIndex(0);
    setInputBoxCorrect([false, false]);
    setInputBoxError(false);
  }, [step]);
  
  // Steps 4 & 7: get current input box config
  const getInputBoxConfig = () => {
    if (step === 4) return calc1Data.inputBoxes || [];
    if (step === 7) return calc2Data.inputBoxes || [];
    return [];
  };
  
  // Steps 4 & 7: handle numpad input for active box
  const handleInputBoxNumberClick = (num) => {
    const config = getInputBoxConfig();
    if (activeInputIndex >= config.length) return;
    const maxLen = (config[activeInputIndex] && config[activeInputIndex].answer.length) || 5;
    if (inputBoxValues[activeInputIndex].length < maxLen) {
      setInputBoxValues(prev => {
        const next = [...prev];
        next[activeInputIndex] = next[activeInputIndex] + num;
        return next;
      });
      setInputBoxError(false);
    }
  };
  
  const handleInputBoxClear = () => {
    setInputBoxValues(prev => {
      const next = [...prev];
      next[activeInputIndex] = next[activeInputIndex].slice(0, -1);
      return next;
    });
    setInputBoxError(false);
  };
  
  const handleInputBoxSubmit = () => {
    const config = getInputBoxConfig();
    const stepNum = step === 4 ? 4 : 7;
    const stepData = APP_DATA.steps[stepNum];
    const correctAnswer = config[activeInputIndex] && config[activeInputIndex].answer;
    
    if (inputBoxValues[activeInputIndex] === correctAnswer) {
      if (window.playSound) window.playSound("correct");
      setInputBoxCorrect(prev => {
        const next = [...prev];
        next[activeInputIndex] = true;
        return next;
      });
      setInputBoxError(false);
      
      if (activeInputIndex + 1 >= config.length) {
        setTimeout(() => {
          if (step === 4) {
            setCalcState(prev => ({ ...prev, calc1BoxesDone: true }));
          } else {
            setCalcState(prev => ({ ...prev, calc2BoxesDone: true }));
          }
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText) onUpdateNavText(stepData.navTextCorrect);
        }, 300);
      } else {
        setActiveInputIndex(prev => prev + 1);
        setInputBoxValues(prev => [...prev]);
        if (onUpdateNavText && stepData.navTextSecondBox) {
          onUpdateNavText(stepData.navTextSecondBox);
        }
      }
    } else {
      if (window.playSound) window.playSound("wrong");
      setInputBoxError(true);
      setTimeout(() => {
        setInputBoxError(false);
        setInputBoxValues(prev => {
          const next = [...prev];
          next[activeInputIndex] = "";
          return next;
        });
      }, 300);
    }
  };
  
  // Handle MCQ option click (Step 9)
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
            calc1Data.findings.totalVolume,
            calc2Data.findings.volumePerBottle,
            mcqData.conversionFinding
          ]
        }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[9];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  // Handle numpad input
  const handleNumberClick = (num) => {
    const isStep5 = step === 5;
    const maxLength = isStep5 ? calc1Data.numpad.maxLength : calc2Data.numpad.maxLength;
    if (numpadValue.length < maxLength) {
      setNumpadValue(prev => prev + num);
    }
  };
  
  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    const isStep5 = step === 5;
    const correctAnswer = isStep5 ? calc1Data.numpad.answer : calc2Data.numpad.answer;
    
    if (numpadValue === correctAnswer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setInputCorrect(false);
        
        if (isStep5) {
          setCalcState(prev => ({ 
            ...prev, 
            calc1NumpadAnswered: true,
            calc1NumpadValue: numpadValue,
            findings: [calc1Data.findings.totalVolume]
          }));
        } else {
          setCalcState(prev => ({ 
            ...prev, 
            calc2NumpadAnswered: true,
            calc2NumpadValue: numpadValue,
            findings: [
              calc1Data.findings.totalVolume,
              calc2Data.findings.volumePerBottle
            ]
          }));
        }
        
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[step];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 300);
    } else {
      setInputError(true);
      if (window.playSound) window.playSound("wrong");
      setTimeout(() => {
        setInputError(false);
        setNumpadValue(""); // Clear input on wrong answer
      }, 300);
    }
  };
  
  // Get findings list based on current step
  const getFindings = () => {
    if (step === 4 || step === 5) {
      // Show given data as findings for first calculation
      return {
        title: APP_DATA.labels.given,
        list: comprehendData.given.data
      };
    } else if (step === 6 || step === 7 || step === 8) {
      return {
        title: APP_DATA.labels.findings,
        list: [calc1Data.findings.totalVolume]
      };
    } else if (step === 9 || step === 10) {
      return {
        title: APP_DATA.labels.findings,
        list: calcState.findings || [
          calc1Data.findings.totalVolume,
          calc2Data.findings.volumePerBottle
        ]
      };
    }
    return { title: "", list: [] };
  };
  
  // Render calculation rows for first calculation (steps 4-5)
  const renderCalc1Rows = () => {
    const rows = [];
    
    // Label row
    rows.push(
      React.createElement("div", { key: "row-label", className: "calc-row" }, 
        calcDisplayData.rows.calc1Label
      )
    );
    
    // Equation row
    rows.push(
      React.createElement("div", { key: "row-eq1", className: "calc-row" }, 
        calcDisplayData.rows.calc1Equation
      )
    );
    
    // Step 4: Two input boxes with numpad (numbers only, no placeholder, no suffix)
    if (step === 4) {
      const config = calc1Data.inputBoxes || [];
      const op = " × ";
      rows.push(
        React.createElement("div", { key: "row-interactive", className: "calc-row calc-row-input-boxes" },
          "= ",
          React.createElement(
            "span",
            {
              className: `calc-input-box ${inputBoxCorrect[0] ? 'correct' : ''} ${activeInputIndex === 0 && inputBoxError ? 'error shake' : ''} ${activeInputIndex === 0 && !inputBoxCorrect[0] ? 'highlighted' : ''}`
            },
            inputBoxCorrect[0] ? (config[0]?.answer || calc1Data.values.smallBottleCount) : (inputBoxValues[0] || "")
          ),
          op,
          React.createElement(
            "span",
            {
              className: `calc-input-box ${inputBoxCorrect[1] ? 'correct' : ''} ${activeInputIndex === 1 && inputBoxError ? 'error shake' : ''} ${activeInputIndex === 1 && !inputBoxCorrect[1] ? 'highlighted' : ''}`
            },
            inputBoxCorrect[1] ? (config[1]?.answer || "500") : (inputBoxValues[1] || "")
          )
        )
      );
    }
    
    // Step 5: Show values row and numpad row
    if (step === 5) {
      rows.push(
        React.createElement("div", { key: "row-values", className: "calc-row" },
          `= ${calc1Data.values.smallBottleCount} × ${calc1Data.values.eachVolume}`
        )
      );
      
      if (!calcState.calc1NumpadAnswered) {
        rows.push(
          React.createElement("div", { key: "row-numpad", className: "calc-row" },
            "= ",
            React.createElement(
              "span",
              { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
              numpadValue || ""
            ),
            " " + calcDisplayData.units.mL
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "row-result", className: "calc-row" },
            `= ${calcState.calc1NumpadValue} ${calcDisplayData.units.mL}`
          )
        );
      }
    }
    
    return rows;
  };
  
  // Render calculation rows for second calculation (steps 7-8)
  const renderCalc2Rows = () => {
    const rows = [];
    
    // Label row
    rows.push(
      React.createElement("div", { key: "row-label", className: "calc-row" }, 
        calcDisplayData.rows.calc2Label
      )
    );
    
    // Equation row
    rows.push(
      React.createElement("div", { key: "row-eq1", className: "calc-row" }, 
        calcDisplayData.rows.calc2Equation
      )
    );
    
    // Step 7: Two input boxes with numpad (numbers only, no placeholder, no suffix)
    if (step === 7) {
      const config = calc2Data.inputBoxes || [];
      rows.push(
        React.createElement("div", { key: "row-interactive", className: "calc-row calc-row-input-boxes" },
          "= ",
          React.createElement(
            "span",
            {
              className: `calc-input-box ${inputBoxCorrect[0] ? 'correct' : ''} ${activeInputIndex === 0 && inputBoxError ? 'error shake' : ''} ${activeInputIndex === 0 && !inputBoxCorrect[0] ? 'highlighted' : ''}`
            },
            inputBoxCorrect[0] ? (config[0]?.answer || "8500") : (inputBoxValues[0] || "")
          ),
          " ÷ ",
          React.createElement(
            "span",
            {
              className: `calc-input-box ${inputBoxCorrect[1] ? 'correct' : ''} ${activeInputIndex === 1 && inputBoxError ? 'error shake' : ''} ${activeInputIndex === 1 && !inputBoxCorrect[1] ? 'highlighted' : ''}`
            },
            inputBoxCorrect[1] ? (config[1]?.answer || calc2Data.values.bigBottleCount) : (inputBoxValues[1] || "")
          )
        )
      );
    }
    
    // Step 8: Show values row and numpad row
    if (step === 8) {
      rows.push(
        React.createElement("div", { key: "row-values", className: "calc-row" },
          `= ${calc2Data.values.totalVolume} ÷ ${calc2Data.values.bigBottleCount}`
        )
      );
      
      if (!calcState.calc2NumpadAnswered) {
        rows.push(
          React.createElement("div", { key: "row-numpad", className: "calc-row" },
            "= ",
            React.createElement(
              "span",
              { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
              numpadValue || ""
            ),
            " " + calcDisplayData.units.mL
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "row-result", className: "calc-row" },
            `= ${calcState.calc2NumpadValue} ${calcDisplayData.units.mL}`
          )
        );
      }
    }
    
    return rows;
  };
  
  // Render calculation rows for MCQ step (step 9)
  const renderMcqCalcRows = () => {
    const rows = [];
    
    // Summary of previous calculation
    rows.push(
      React.createElement("div", { key: "row-summary", className: "calc-row" }, 
        calcDisplayData.rows.summaryRow
      )
    );
    
    // If MCQ answered, show conversion row
    if (calcState.mcqAnswered) {
      rows.push(
        React.createElement("div", { key: "row-conv", className: "calc-row" },
          calcDisplayData.rows.conversionRow
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for final step (step 10)
  const renderFinalCalcRows = () => {
    const rows = [];
    
    // Label
    rows.push(
      React.createElement("div", { key: "row-label", className: "calc-row" }, 
        calcDisplayData.rows.calc2FinalLabel
      )
    );
    
    // Conversion row
    rows.push(
      React.createElement("div", { key: "row-conv", className: "calc-row" },
        calcDisplayData.rows.conversionRow
      )
    );
    
    // Final result
    rows.push(
      React.createElement("div", { key: "row-final", className: "calc-row" },
        calcDisplayData.rows.finalResult
      )
    );
    
    return rows;
  };
  
  // Render right panel content
  const renderRightPanel = () => {
    const findingsData = getFindings();
    
    // Steps 4, 5, 7 - Show findings and no input (or numpad for step 5)
    // Steps 8 - Show findings and numpad
    // Step 9 - Show findings and MCQ
    // Step 10 - Show findings only
    
    return React.createElement(
      "div",
      { className: "calc-input-panel" },
      // Findings div
      React.createElement(
        "div",
        { className: "calc-findings-div" },
        React.createElement("div", { className: "findings-title" }, findingsData.title),
        React.createElement(
          "ul",
          { className: "findings-list" },
          findingsData.list.map((finding, index) =>
            React.createElement("li", { key: `finding-${index}` }, finding)
          )
        )
      ),
      // Input div (Numpad or MCQ)
      React.createElement(
        "div",
        { className: "calc-input-div" },
        renderInputContent()
      )
    );
  };
  
  // Render input content (Numpad or MCQ)
  const renderInputContent = () => {
    // Step 4: Numpad for two input boxes (first calculation values)
    if (step === 4 && !calcState.calc1BoxesDone) {
      return React.createElement(Numpad, {
        onNumberClick: handleInputBoxNumberClick,
        onClear: handleInputBoxClear,
        onSubmit: handleInputBoxSubmit
      });
    }
    
    // Step 5: Numpad for first calculation result
    if (step === 5 && !calcState.calc1NumpadAnswered) {
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit
      });
    }
    
    // Step 7: Numpad for two input boxes (second calculation values)
    if (step === 7 && !calcState.calc2BoxesDone) {
      return React.createElement(Numpad, {
        onNumberClick: handleInputBoxNumberClick,
        onClear: handleInputBoxClear,
        onSubmit: handleInputBoxSubmit
      });
    }
    
    // Step 8: Numpad for second calculation result
    if (step === 8 && !calcState.calc2NumpadAnswered) {
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit
      });
    }
    
    // Step 9: MCQ for conversion
    if (step === 9 && !calcState.mcqAnswered) {
      return renderMcq();
    }
    
    return null;
  };
  
  // Render MCQ
  const renderMcq = () => {
    return React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, mcqData.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        mcqData.options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedMcqOption === index) {
            className += index === mcqData.answerIndex ? " correct" : " incorrect";
          }
          if (mcqCorrect && index !== mcqData.answerIndex) {
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
    );
  };
  
  // Step 10: Final answer display
  if (step === 10) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final with-image" },
        // Image row
        React.createElement(
          "div",
          { className: "calc-image-row" },
          React.createElement("img", {
            src: imageSrc,
            alt: calcDisplayData.altTexts.milkBottles,
            className: "calc-image"
          })
        ),
        // Calculation rows
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            renderFinalCalcRows()
          ),
          React.createElement(
            "div",
            { className: "final-answer-div" },
            APP_DATA.finalAnswer
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  }
  
  // Step 9: MCQ step
  if (step === 9) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        // Image row
        React.createElement(
          "div",
          { className: "calc-image-row" },
          React.createElement("img", {
            src: imageSrc,
            alt: calcDisplayData.altTexts.milkBottles,
            className: "calc-image"
          })
        ),
        // Calculation rows
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            renderMcqCalcRows()
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  }
  
  // Steps 4-5: First calculation (with image)
  if (step === 4 || step === 5) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        // Image row (35% height)
        React.createElement(
          "div",
          { className: "calc-image-row" },
          imageSrc && React.createElement("img", {
            src: imageSrc,
            alt: "Milk bottles",
            className: "calc-image"
          })
        ),
        // Equation row (65% height)
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            renderCalc1Rows()
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  }
  
  // Steps 7-8: Second calculation (with image)
  if (step === 7 || step === 8) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        // Image row (35% height)
        React.createElement(
          "div",
          { className: "calc-image-row" },
          imageSrc && React.createElement("img", {
            src: imageSrc,
            alt: "Milk bottles",
            className: "calc-image"
          })
        ),
        // Equation row (65% height)
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            renderCalc2Rows()
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  }

  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    React.createElement(
      "div",
      { className: "calc-left-panel" },
      React.createElement(
        "div",
        { className: "calc-rows-container" },
        React.createElement("div", { className: "calc-row" }, "")
      )
    ),
    React.createElement(
      "div",
      { className: "calc-right-panel" },
      renderRightPanel()
    )
  );
};
