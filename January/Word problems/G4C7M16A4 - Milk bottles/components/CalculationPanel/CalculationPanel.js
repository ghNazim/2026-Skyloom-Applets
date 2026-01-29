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
  
  // Local state for numpad input
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);
  
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
  }, [step]);
  
  // Handle interactive box click (Step 4 - first calculation)
  const handleInteractiveBoxClick1 = (boxIndex) => {
    if (interactiveBoxState1[boxIndex]) return;
    
    if (window.playSound) window.playSound("tick");
    
    const newState = { ...interactiveBoxState1, [boxIndex]: true };
    setInteractiveBoxState1(newState);
    
    // Check if both boxes are clicked
    if (newState[0] && newState[1]) {
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, calc1BoxesDone: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[4];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    }
  };
  
  // Handle interactive box click (Step 7 - second calculation)
  const handleInteractiveBoxClick2 = (boxIndex) => {
    if (interactiveBoxState2[boxIndex]) return;
    
    if (window.playSound) window.playSound("tick");
    
    const newState = { ...interactiveBoxState2, [boxIndex]: true };
    setInteractiveBoxState2(newState);
    
    // Check if both boxes are clicked
    if (newState[0] && newState[1]) {
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, calc2BoxesDone: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[7];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
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
            "Total volume of milk in the small bottles = 8500 mL",
            "Volume of milk in each big bottle = 1700 mL",
            "1000 mL = 1 L"
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
            findings: ["Total volume of milk in the small bottles = 8500 mL"]
          }));
        } else {
          setCalcState(prev => ({ 
            ...prev, 
            calc2NumpadAnswered: true,
            calc2NumpadValue: numpadValue,
            findings: [
              "Total volume of milk in the small bottles = 8500 mL",
              "Volume of milk in each big bottle = 1700 mL"
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
        list: ["Total volume of milk in the small bottles = 8500 mL"]
      };
    } else if (step === 9 || step === 10) {
      return {
        title: APP_DATA.labels.findings,
        list: calcState.findings || [
          "Total volume of milk in the small bottles = 8500 mL",
          "Volume of milk in each big bottle = 1700 mL"
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
        "Total volume of milk in the small bottles"
      )
    );
    
    // Equation row
    rows.push(
      React.createElement("div", { key: "row-eq1", className: "calc-row" }, 
        "= Number of small bottles × Volume of milk in each bottle"
      )
    );
    
    // Step 4: Show interactive boxes
    if (step === 4) {
      rows.push(
        React.createElement("div", { key: "row-interactive", className: "calc-row" },
          "= ",
          React.createElement(
            "span",
            {
              className: `calc-interactive-box ${interactiveBoxState1[0] ? 'revealed' : 'clickable'}`,
              onClick: () => !interactiveBoxState1[0] && handleInteractiveBoxClick1(0)
            },
            interactiveBoxState1[0] ? calc1Data.values.smallBottleCount : "?"
          ),
          " × ",
          React.createElement(
            "span",
            {
              className: `calc-interactive-box ${interactiveBoxState1[1] ? 'revealed' : (interactiveBoxState1[0] ? 'clickable' : '')}`,
              onClick: () => interactiveBoxState1[0] && !interactiveBoxState1[1] && handleInteractiveBoxClick1(1)
            },
            interactiveBoxState1[1] ? calc1Data.values.eachVolume : "?"
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
            " mL"
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "row-result", className: "calc-row" },
            `= ${calcState.calc1NumpadValue} mL`
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
        "Volume of milk in each big bottle"
      )
    );
    
    // Equation row
    rows.push(
      React.createElement("div", { key: "row-eq1", className: "calc-row" }, 
        "= Total volume of milk ÷ Number of big bottles"
      )
    );
    
    // Step 7: Show interactive boxes
    if (step === 7) {
      rows.push(
        React.createElement("div", { key: "row-interactive", className: "calc-row" },
          "= ",
          React.createElement(
            "span",
            {
              className: `calc-interactive-box ${interactiveBoxState2[0] ? 'revealed' : 'clickable'}`,
              onClick: () => !interactiveBoxState2[0] && handleInteractiveBoxClick2(0)
            },
            interactiveBoxState2[0] ? calc2Data.values.totalVolume : "?"
          ),
          " ÷ ",
          React.createElement(
            "span",
            {
              className: `calc-interactive-box ${interactiveBoxState2[1] ? 'revealed' : (interactiveBoxState2[0] ? 'clickable' : '')}`,
              onClick: () => interactiveBoxState2[0] && !interactiveBoxState2[1] && handleInteractiveBoxClick2(1)
            },
            interactiveBoxState2[1] ? calc2Data.values.bigBottleCount : "?"
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
            " mL"
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "row-result", className: "calc-row" },
            `= ${calcState.calc2NumpadValue} mL`
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
        "Volume of milk in each big bottle = 1700 mL"
      )
    );
    
    // If MCQ answered, show conversion row
    if (calcState.mcqAnswered) {
      rows.push(
        React.createElement("div", { key: "row-conv", className: "calc-row" },
          "= (1700 ÷ 1000) L"
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
        "Volume of milk (in L) in each big bottle"
      )
    );
    
    // Conversion row
    rows.push(
      React.createElement("div", { key: "row-conv", className: "calc-row" },
        "= (1700 ÷ 1000) L"
      )
    );
    
    // Final result
    rows.push(
      React.createElement("div", { key: "row-final", className: "calc-row" },
        "= 1.7 L"
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
    // Step 5: Numpad for first calculation
    if (step === 5 && !calcState.calc1NumpadAnswered) {
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit
      });
    }
    
    // Step 8: Numpad for second calculation
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
            alt: "Milk bottles",
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
            alt: "Milk bottles",
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
        React.createElement("div", { className: "calc-row" }, "Calculation Panel")
      )
    ),
    React.createElement(
      "div",
      { className: "calc-right-panel" },
      renderRightPanel()
    )
  );
};
