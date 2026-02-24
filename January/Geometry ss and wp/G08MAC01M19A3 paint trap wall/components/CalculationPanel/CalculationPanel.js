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
  const mcqData = APP_DATA.mcq;
  const comprehendData = APP_DATA.comprehend;
  const calcDisplayData = APP_DATA.calculation;
  const stepData = APP_DATA.steps[step];
  
  // Local state for numpad input (step 6)
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
    // Only reset MCQ state when leaving step 3
    if (step !== 3) {
      setSelectedMcqOption(null);
      setMcqCorrect(false);
    }
  }, [step]);
  
  // Handle MCQ option click (Step 3)
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
          findings: mcqData.findingsList || []
        }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[3];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  // Handle numpad input (step 6)
  const handleNumberClick = (num) => {
    const maxLength = calc1Data.numpad.maxLength;
    if (numpadValue.length < maxLength) {
      setNumpadValue(prev => prev + num);
    }
  };
  
  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    const correctAnswer = calc1Data.numpad.answer;
    
    if (numpadValue === correctAnswer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setInputCorrect(false);
        setCalcState(prev => ({ 
          ...prev, 
          calc1NumpadAnswered: true,
          calc1NumpadValue: numpadValue,
          findings: [calc1Data.findings.areaFinding]
        }));
        
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
    if (step === 3) {
      // Step 3: MCQ - show given data
      return {
        title: mcqData.findingsTitle || APP_DATA.labels.given,
        list: mcqData.findingsList || []
      };
    } else if (step === 5) {
      // Show given data as findings
      return {
        title: APP_DATA.labels.given,
        list: comprehendData.given.data
      };
    } else if (step === 6) {
      // Show findings after numpad is answered
      if (calcState.calc1NumpadAnswered) {
        return {
          title: APP_DATA.labels.findings,
          list: [calc1Data.findings.areaFinding]
        };
      }
      return {
        title: APP_DATA.labels.given,
        list: comprehendData.given.data
      };
    } else if (step === 7) {
      return {
        title: APP_DATA.labels.findings,
        list: calcState.findings || [calc1Data.findings.areaFinding]
      };
    }
    return { title: "", list: [] };
  };
  
  // Render calculation rows for first calculation (steps 5-7)
  const renderCalc1Rows = () => {
    const rows = [];
    
    // Step 5: Interactive boxes - one row with "Area of the field = [[Length]] × [[Breadth]]"
    // This row should persist in steps 6 and 7
    if (step === 5 || step === 6 || step === 7) {
      const initialEquation = calc1Data.initialEquation[0] || "Area of the field = [[Length]] × [[Breadth]]";
      
      // Parse the equation to show interactive boxes
      const parts = initialEquation.split(/(\[\[.*?\]\])/);
      rows.push(
        React.createElement("div", { key: "row-interactive", className: "calc-row calc-row-input-boxes" },
          parts.map((part, idx) => {
            if (part.startsWith("[[") && part.endsWith("]]")) {
              const boxIndex = part.includes("Length") || part.includes("Panjang") ? 0 : 1;
              const isClicked = interactiveBoxState1[boxIndex];
              const isHighlighted = !isClicked && step === 5 && (
                (boxIndex === 0 && !interactiveBoxState1[0]) || 
                (boxIndex === 1 && interactiveBoxState1[0] && !interactiveBoxState1[1])
              );
              
              return React.createElement(
                "span",
                {
                  key: `box-${idx}`,
                  className: `calc-interactive-box-step5 ${isClicked ? 'clicked' : ''} ${isHighlighted ? 'highlighted' : ''}`,
                  onClick: () => {
                    if (!isClicked && step === 5) {
                      if (window.playSound) window.playSound("click");
                      setInteractiveBoxState1(prev => ({ ...prev, [boxIndex]: true }));
                      
                      // If both boxes are clicked, enable next
                      const newState = { ...interactiveBoxState1, [boxIndex]: true };
                      if (newState[0] && newState[1]) {
                        setTimeout(() => {
                          setCalcState(prev => ({ ...prev, calc1BoxesDone: true }));
                          if (onEnableNext) onEnableNext();
                          if (onUpdateNavText) {
                            const stepData = APP_DATA.steps[step];
                            onUpdateNavText(stepData.navTextCorrect);
                          }
                        }, 300);
                      } else if (boxIndex === 0) {
                        // First box clicked, highlight second
                        if (onUpdateNavText) {
                          const stepData = APP_DATA.steps[step];
                          onUpdateNavText(stepData.navTextSecondBox);
                        }
                      }
                    }
                  }
                },
                isClicked 
                  ? (boxIndex === 0 ? calc1Data.values.lengthFinal : calc1Data.values.breadthFinal)
                  : (part.replace(/\[\[|\]\]/g, ""))
              );
            } else {
              return React.createElement("span", { key: `text-${idx}` }, part);
            }
          })
        )
      );
    }
    
    // Step 6: Append new row with hidden "Area of the field" and numpad input
    // Step 7: Show the same row with the result
    if (step === 6 || step === 7) {
      const unit = calc1Data.numpad.unit || " m²";
      if (step === 6 && !calcState.calc1NumpadAnswered) {
        rows.push(
          React.createElement("div", { key: "row-numpad", className: "calc-row" },
            React.createElement("span", { className: "calc-hidden-text" }, calcDisplayData.rows.calc1Label),
            " = ",
            React.createElement(
              "span",
              { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
              numpadValue || ""
            ),
            unit
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "row-result", className: "calc-row" },
            React.createElement("span", { className: "calc-hidden-text" }, calcDisplayData.rows.calc1Label),
            ` = ${calcState.calc1NumpadValue}${unit}`
          )
        );
      }
    }
    
    return rows;
  };
  
  // Render calculation rows for MCQ step (step 3)
  const renderMcqCalcRows = () => {
    const rows = [];
    // For step 3, we don't need to show calculation rows, just the MCQ
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
    if (!stepData) return null;
    
    // Step 3: MCQ - keep it visible even after answering
    if (step === 3) {
      return renderMcq();
    }
    
    // Step 6: Numpad for first calculation result
    if (step === 6 && !calcState.calc1NumpadAnswered) {
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit
      });
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
  
  // Step 7: Final answer display (if isFinalStep)
  if (step === 7 && stepData && stepData.isFinalStep) {
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
            alt: calcDisplayData.altTexts.riceField || calcDisplayData.altTexts.milkBottles || "Rice field",
            className: "calc-image"
          })
        ),
        // Calculation rows (both from step 5 and step 6) and final answer div
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            renderCalc1Rows()
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
  
  // Step 3: MCQ step
  if (step === 3) {
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
            alt: calcDisplayData.altTexts.riceField || calcDisplayData.altTexts.milkBottles || "Rice field",
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
  
  // Steps 5-6: First calculation (with image)
  if (step === 5 || (step === 6 && stepData && !stepData.isFinalStep)) {
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
            alt: calcDisplayData.altTexts.riceField || calcDisplayData.altTexts.milkBottles || "Rice field",
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
