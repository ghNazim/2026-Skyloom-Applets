const CalculationPanel = ({ 
  step, 
  onEnableNext, 
  onUpdateNavText,
  onUpdateQuestionText,
  calcState,
  setCalcState,
  imageSrc
}) => {
  const { useState, useEffect } = React;
  
  const step4Data = APP_DATA.step4Data;
  const step5Data = APP_DATA.step5Data;
  const step6Data = APP_DATA.step6Data;
  const step7Data = APP_DATA.step7Data;
  const comprehendData = APP_DATA.comprehend;
  
  // Local state for numpad input
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);
  
  // Interactive box state for step 7
  const [box1Clicked, setBox1Clicked] = useState(false);
  const [box2Clicked, setBox2Clicked] = useState(false);
  const [showFinalCalcRow, setShowFinalCalcRow] = useState(false);
  
  // Reset states on step change
  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
    setBox1Clicked(false);
    setBox2Clicked(false);
    setShowFinalCalcRow(false);
  }, [step]);
  
  // Handle interactive box click for step 7
  const handleBox1Click = () => {
    if (box1Clicked) return;
    if (window.playSound) window.playSound("tick");
    setBox1Clicked(true);
  };
  
  const handleBox2Click = () => {
    if (!box1Clicked || box2Clicked) return;
    if (window.playSound) window.playSound("tick");
    setBox2Clicked(true);
    
    // After both boxes clicked, show the final calculation row
    setTimeout(() => {
      setShowFinalCalcRow(true);
      // Update question text and nav text
      const stepData = APP_DATA.steps[7];
      if (onUpdateQuestionText && stepData.questionTextAfterBoxes) {
        onUpdateQuestionText(stepData.questionTextAfterBoxes);
      }
      if (onUpdateNavText && stepData.navTextAfterBoxes) {
        onUpdateNavText(stepData.navTextAfterBoxes);
      }
    }, 500);
  };
  
  // Handle numpad input
  const handleNumberClick = (num) => {
    let maxLength;
    if (step === 5) {
      maxLength = step5Data.numpad.maxLength;
    } else if (step === 6) {
      maxLength = step6Data.numpad.maxLength;
    } else if (step === 7) {
      maxLength = step7Data.numpad.maxLength;
    }
    
    if (numpadValue.length < maxLength) {
      setNumpadValue(prev => prev + num);
    }
  };
  
  const handleDecimalClick = () => {
    // Only allow one decimal point
    if (!numpadValue.includes(decimalSymbol)) {
      const maxLength = step7Data.numpad.maxLength;
      if (numpadValue.length < maxLength) {
        setNumpadValue(prev => prev + decimalSymbol);
      }
    }
  };
  
  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    let correctAnswer, altAnswer;
    
    if (step === 5) {
      correctAnswer = step5Data.numpad.answer;
    } else if (step === 6) {
      correctAnswer = step6Data.numpad.answer;
    } else if (step === 7) {
      correctAnswer = step7Data.numpad.answer;
      altAnswer = step7Data.numpad.altAnswer;
    }
    
    const isCorrect = numpadValue === correctAnswer || (altAnswer && numpadValue === altAnswer);
    
    if (isCorrect) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setInputCorrect(false);
        
        if (step === 5) {
          setCalcState(prev => ({ 
            ...prev, 
            step5Answered: true,
            step5Value: numpadValue
          }));
        } else if (step === 6) {
          setCalcState(prev => ({ 
            ...prev, 
            step6Answered: true,
            step6Value: numpadValue
          }));
        } else if (step === 7) {
          // Normalize ".5" to "0.5" for display
          const normalizedValue = numpadValue.startsWith(decimalSymbol) 
            ? "0" + numpadValue 
            : numpadValue;
          setCalcState(prev => ({ 
            ...prev, 
            step7Answered: true,
            step7Value: normalizedValue
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
        setNumpadValue("");
      }, 300);
    }
  };
  
  // Get findings list based on current step
  const getFindings = () => {
    if (step === 4) {
      return {
        title: APP_DATA.labels.given,
        list: comprehendData.given.data
      };
    } else if (step === 5) {
      return {
        title: APP_DATA.labels.given,
        list: comprehendData.given.data
      };
    } else if (step === 6) {
      return {
        title: APP_DATA.labels.findings,
        list: ["Total volume of oil = 500000 cm³"]
      };
    } else if (step === 7) {
      return {
        title: APP_DATA.labels.findings,
        list: [
          "Total volume of oil = 500000 cm³",
          "Capacity of one jerry can = 1,000,000 cm³"
        ]
      };
    } else if (step === 8) {
      return {
        title: APP_DATA.labels.findings,
        list: [
          "Total volume of oil = 500000 cm³",
          "Capacity of one jerry can = 1,000,000 cm³",
          "Number of jerry cans needed = 0.5"
        ]
      };
    }
    return { title: "", list: [] };
  };
  
  // Render right panel content
  const renderRightPanel = () => {
    const findingsData = getFindings();
    const showNumpad = (step === 5 && !calcState.step5Answered) ||
                       (step === 6 && !calcState.step6Answered) ||
                       (step === 7 && showFinalCalcRow && !calcState.step7Answered);
    
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
      // Input div (Numpad)
      showNumpad && React.createElement(
        "div",
        { className: "calc-input-div" },
        React.createElement(Numpad, {
          onNumberClick: handleNumberClick,
          onDecimalClick: step === 7 ? handleDecimalClick : null,
          onClear: handleClear,
          onSubmit: handleSubmit,
          showDecimal: step === 7 && step7Data.numpad.showDecimal
        })
      )
    );
  };
  
  // Render Step 4 - Show volume breakdown
  const renderStep4 = () => {
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
          imageSrc && React.createElement("img", {
            src: imageSrc,
            alt: "Cooking oil",
            className: "calc-image"
          })
        ),
        // Equation row
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            // Label row
            React.createElement("div", { key: "row-label", className: "calc-row calc-label-row" }, 
              step4Data.equationRows[0].text
            ),
            // Equation row with highlight
            React.createElement("div", { key: "row-eq1", className: "calc-row" },
              "= ",
              React.createElement("span", { className: "calc-highlight-cyan" }, "Total volume of oil"),
              " ÷ Capacity of one jerry can"
            ),
            // Volume breakdown row
            React.createElement(
              "div",
              { key: "row-breakdown", className: "calc-row volume-breakdown-row" },
              React.createElement("span", { className: "volume-label" }, step4Data.volumeBreakdown.label),
              React.createElement(
                "div",
                { className: "volume-items-column" },
                step4Data.volumeBreakdown.items.map((item, index) =>
                  React.createElement("span", { key: `item-${index}`, className: "volume-item" }, item)
                )
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  };
  
  // Render Step 5 - Calculate total volume with addition format
  const renderStep5 = () => {
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
          imageSrc && React.createElement("img", {
            src: imageSrc,
            alt: "Cooking oil",
            className: "calc-image"
          })
        ),
        // Equation row
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            // Label row
            React.createElement("div", { key: "row-label", className: "calc-row calc-label-row" }, 
              "Number of jerry cans needed"
            ),
            // Equation row with highlight
            React.createElement("div", { key: "row-eq1", className: "calc-row" },
              "= ",
              React.createElement("span", { className: "calc-highlight-cyan" }, "Total volume of oil"),
              " ÷ Capacity of one jerry can"
            ),
            // Volume calculation row with addition format
            React.createElement(
              "div",
              { key: "row-calc", className: "calc-row volume-calc-row" },
              React.createElement("span", { className: "volume-label" }, step5Data.volumeCalculation.label),
              React.createElement(
                "div",
                { className: "volume-calc-column" },
                step5Data.volumeCalculation.items.map((item, index) =>
                  React.createElement("span", { 
                    key: `calc-${index}`, 
                    className: `volume-calc-item ${index === 0 ? 'first-item' : ''}` 
                  }, item)
                ),
                // Horizontal line
                React.createElement("div", { className: "calc-horizontal-line" }),
                // Input box row
                React.createElement(
                  "div",
                  { className: "calc-result-row" },
                  !calcState.step5Answered ? React.createElement(
                    "span",
                    { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
                    numpadValue || ""
                  ) : React.createElement("span", { className: "calc-result-value" }, calcState.step5Value),
                  " cm³"
                )
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  };
  
  // Render Step 6 - Convert jerry can volume
  const renderStep6 = () => {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel no-image" },
        // Equation row only (no image)
        React.createElement(
          "div",
          { className: "calc-equation-row full-height" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            // Label row
            React.createElement("div", { key: "row-label", className: "calc-row calc-label-row" }, 
              "Number of jerry cans needed"
            ),
            // Equation row with highlight
            React.createElement("div", { key: "row-eq1", className: "calc-row" },
              "= Total volume of oil ÷ ",
              React.createElement("span", { className: "calc-highlight-cyan" }, "Capacity of one jerry can")
            ),
            // Info row
            React.createElement("div", { key: "row-info", className: "calc-row" }, 
              "Capacity of one jerry can = 1 m³"
            ),
            // Conversion row with input
            React.createElement("div", { key: "row-conv", className: "calc-row conversion-row" }, 
              "1 m³ = ",
              !calcState.step6Answered ? React.createElement(
                "span",
                { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
                numpadValue || ""
              ) : React.createElement("span", { className: "calc-result-value" }, calcState.step6Value),
              " cm³"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  };
  
  // Render Step 7 - Substitute values and calculate
  const renderStep7 = () => {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel no-image" },
        // Equation row only (no image)
        React.createElement(
          "div",
          { className: "calc-equation-row full-height" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            // Label row
            React.createElement("div", { key: "row-label", className: "calc-row calc-label-row" }, 
              "Number of jerry cans needed"
            ),
            // Equation row (no highlight)
            React.createElement("div", { key: "row-eq1", className: "calc-row" },
              "= Total volume of oil ÷ Capacity of one jerry can"
            ),
            // Interactive boxes row
            React.createElement("div", { key: "row-interactive", className: "calc-row" },
              "= ",
              React.createElement(
                "span",
                {
                  className: `calc-interactive-box ${box1Clicked ? 'revealed' : 'clickable'}`,
                  onClick: handleBox1Click
                },
                box1Clicked ? step7Data.interactiveRow.box1Value : step7Data.interactiveRow.box1ValueInitial
              ),
              " ÷ ",
              React.createElement(
                "span",
                {
                  className: `calc-interactive-box ${box2Clicked ? 'revealed' : (box1Clicked ? 'clickable' : '')}`,
                  onClick: handleBox2Click
                },
                box2Clicked ? step7Data.interactiveRow.box2Value : step7Data.interactiveRow.box2ValueInitial
              )
            ),
            // Final calculation row (appears after both boxes clicked)
            showFinalCalcRow && React.createElement("div", { key: "row-final", className: "calc-row" },
              "= ",
              !calcState.step7Answered ? React.createElement(
                "span",
                { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
                numpadValue || ""
              ) : React.createElement("span", { className: "calc-result-value" }, calcState.step7Value)
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  };
  
  // Render Step 8 - Final answer
  const renderStep8 = () => {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel no-image final" },
        // Equation row only
        React.createElement(
          "div",
          { className: "calc-equation-row full-height" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            // Label row
            React.createElement("div", { key: "row-label", className: "calc-row calc-label-row" }, 
              "Number of jerry cans needed"
            ),
            // Equation row
            React.createElement("div", { key: "row-eq1", className: "calc-row" },
              "= Total volume of oil ÷ Capacity of one jerry can"
            ),
            // Values row
            React.createElement("div", { key: "row-values", className: "calc-row" },
              "= 500000 ÷ 1000000"
            ),
            // Result row
            React.createElement("div", { key: "row-result", className: "calc-row" },
              "= 0.5"
            ),
            // Final answer div
            React.createElement(
              "div",
              { className: "final-answer-div" },
              APP_DATA.finalAnswer
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  };
  
  // Determine which step to render
  if (step === 4) return renderStep4();
  if (step === 5) return renderStep5();
  if (step === 6) return renderStep6();
  if (step === 7) return renderStep7();
  if (step === 8) return renderStep8();
  
  return null;
};
