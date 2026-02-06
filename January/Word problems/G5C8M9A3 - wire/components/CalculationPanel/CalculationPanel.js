const CalculationPanel = ({ 
  step, 
  onEnableNext, 
  onUpdateNavText,
  calcState,
  setCalcState,
  imageSrc,
  onUpdateImage
}) => {
  const { useState, useEffect, useRef } = React;
  
  const calcData = APP_DATA.calculation;
  const mcqStep3Data = APP_DATA.mcqStep3;
  const mcqStep6Data = APP_DATA.mcqStep6;
  const mcqStep11Data = APP_DATA.mcqStep11;
  const comprehendData = APP_DATA.comprehend;
  
  // Local state for numpad input
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);
  
  // MCQ state
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);
  
  // Step 10 specific - which numpad input is active
  const [step10NumpadIndex, setStep10NumpadIndex] = useState(0);
  
  // Reset states on step change
  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
    setSelectedMcqOption(null);
    setMcqCorrect(false);
    setStep10NumpadIndex(0);
  }, [step]);
  
  // Handle MCQ option click for Step 3
  const handleMcqStep3Click = (index) => {
    if (mcqCorrect) return;
    
    setSelectedMcqOption(index);
    
    if (index === mcqStep3Data.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, mcqStep3Answered: true }));
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
  
  // Handle MCQ option click for Step 6
  const handleMcqStep6Click = (index) => {
    if (calcState.mcqStep6Answered) return;
    
    setSelectedMcqOption(index);
    
    if (index === mcqStep6Data.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, mcqStep6Answered: true }));
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[6];
          onUpdateNavText(stepData.navTextBox);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  // Handle Step 6 box click
  const handleStep6BoxClick = () => {
    if (calcState.step6BoxClicked) return;
    
    if (window.playSound) window.playSound("tick");
    setCalcState(prev => ({ ...prev, step6BoxClicked: true }));
    
    if (onUpdateNavText) {
      const stepData = APP_DATA.steps[6];
      onUpdateNavText(stepData.navTextNumpad);
    }
  };
  
  // Handle MCQ option click for Step 11
  const handleMcqStep11Click = (index) => {
    if (calcState.mcqStep11Answered) return;
    
    setSelectedMcqOption(index);
    
    if (index === mcqStep11Data.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, mcqStep11Answered: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[11];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  // Handle Step 7 interactive box click (3 boxes in sequence)
  const handleStep7BoxClick = (boxIndex) => {
    if (calcState.step7BoxIndex !== boxIndex) return;
    
    if (window.playSound) window.playSound("tick");
    
    const newBoxIndex = boxIndex + 1;
    setCalcState(prev => ({ ...prev, step7BoxIndex: newBoxIndex }));
    
    // Update image based on which box was clicked
    const stepData = APP_DATA.steps[7];
    if (stepData.images && stepData.images[newBoxIndex]) {
      onUpdateImage(stepData.images[newBoxIndex]);
    }
    
    // Check if all boxes are done
    if (newBoxIndex >= 3) {
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, step7AllBoxesDone: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    }
  };
  
  // Handle Step 8 box click
  const handleStep8BoxClick = () => {
    if (calcState.step8BoxClicked) return;
    
    if (window.playSound) window.playSound("tick");
    setCalcState(prev => ({ ...prev, step8BoxClicked: true }));
    
    setTimeout(() => {
      if (onEnableNext) onEnableNext();
      if (onUpdateNavText) {
        const stepData = APP_DATA.steps[8];
        onUpdateNavText(stepData.navTextCorrect);
      }
    }, 500);
  };
  
  // Handle Step 9 box click
  const handleStep9BoxClick = () => {
    if (calcState.step9BoxClicked) return;
    
    if (window.playSound) window.playSound("tick");
    setCalcState(prev => ({ ...prev, step9BoxClicked: true }));
    
    setTimeout(() => {
      if (onEnableNext) onEnableNext();
      if (onUpdateNavText) {
        const stepData = APP_DATA.steps[9];
        onUpdateNavText(stepData.navTextCorrect);
      }
    }, 500);
  };
  
  // Handle Step 12 box click
  const handleStep12BoxClick = () => {
    if (calcState.step12BoxClicked) return;
    
    if (window.playSound) window.playSound("tick");
    setCalcState(prev => ({ ...prev, step12BoxClicked: true }));
    
    if (onUpdateNavText) {
      const stepData = APP_DATA.steps[12];
      onUpdateNavText(stepData.navTextNumpad);
    }
  };
  
  // Handle numpad input
  const handleNumberClick = (num) => {
    let maxLength = 3;
    
    if (step === 6) {
      maxLength = calcData.numpad.step6MaxLength;
    } else if (step === 10) {
      maxLength = step10NumpadIndex === 0 ? calcData.numpad.step10MaxLength1 : calcData.numpad.step10MaxLength2;
    } else if (step === 12) {
      maxLength = calcData.numpad.step12MaxLength;
    }
    
    if (numpadValue.length < maxLength) {
      setNumpadValue(prev => prev + num);
    }
  };
  
  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    let correctAnswer = "";
    
    if (step === 6) {
      correctAnswer = calcData.numpad.step6Answer;
    } else if (step === 10) {
      correctAnswer = step10NumpadIndex === 0 ? calcData.numpad.step10Answer1 : calcData.numpad.step10Answer2;
    } else if (step === 12) {
      correctAnswer = calcData.numpad.step12Answer;
    }
    
    if (numpadValue === correctAnswer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setInputCorrect(false);
        
        if (step === 6) {
          setCalcState(prev => ({ 
            ...prev, 
            step6NumpadAnswered: true,
            step6NumpadValue: numpadValue,
            findings: [APP_DATA.findings.perimeterA]
          }));
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText) {
            const stepData = APP_DATA.steps[6];
            onUpdateNavText(stepData.navTextCorrect);
          }
        } else if (step === 10) {
          if (step10NumpadIndex === 0) {
            // First numpad answered
            setCalcState(prev => ({ 
              ...prev, 
              step10Numpad1Answered: true,
              step10Numpad1Value: numpadValue
            }));
            setNumpadValue("");
            setStep10NumpadIndex(1);
          } else {
            // Second numpad answered
            setCalcState(prev => ({ 
              ...prev, 
              step10Numpad2Answered: true,
              step10Numpad2Value: numpadValue
            }));
            if (onEnableNext) onEnableNext();
            if (onUpdateNavText) {
              const stepData = APP_DATA.steps[10];
              onUpdateNavText(stepData.navTextCorrect);
            }
          }
        } else if (step === 12) {
          setCalcState(prev => ({ 
            ...prev, 
            step12NumpadAnswered: true,
            step12NumpadValue: numpadValue
          }));
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText) {
            const stepData = APP_DATA.steps[12];
            onUpdateNavText(stepData.navTextCorrect);
          }
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
  
  // Get findings based on step
  const getFindings = () => {
    if (step >= 11) {
      return {
        title: APP_DATA.labels.findings,
        list: [APP_DATA.findings.perimeterA, APP_DATA.findings.perimeterB]
      };
    } else if (step >= 7) {
      return {
        title: APP_DATA.labels.findings,
        list: [APP_DATA.findings.perimeterA]
      };
    }
    return { title: "", list: [] };
  };
  
  // Get to find data for step 11+
  const getToFindData = () => {
    if (step >= 11) {
      return APP_DATA.toFindData;
    }
    return null;
  };
  
  // Render MCQ for Step 3
  const renderMcqStep3 = () => {
    return React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, mcqStep3Data.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        mcqStep3Data.options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedMcqOption === index) {
            className += index === mcqStep3Data.answerIndex ? " correct" : " incorrect";
          }
          if (mcqCorrect && index !== mcqStep3Data.answerIndex) {
            className += " disabled";
          }
          
          return React.createElement(
            "button",
            {
              key: `mcq-${index}`,
              className: className,
              onClick: () => handleMcqStep3Click(index),
              disabled: mcqCorrect
            },
            option
          );
        })
      )
    );
  };
  
  // Render MCQ for Step 6
  const renderMcqStep6 = () => {
    return React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, mcqStep6Data.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        mcqStep6Data.options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedMcqOption === index) {
            className += index === mcqStep6Data.answerIndex ? " correct" : " incorrect";
          }
          if ((mcqCorrect || calcState.mcqStep6Answered) && index !== mcqStep6Data.answerIndex) {
            className += " disabled";
          }
          
          return React.createElement(
            "button",
            {
              key: `mcq-${index}`,
              className: className,
              onClick: () => handleMcqStep6Click(index),
              disabled: mcqCorrect || calcState.mcqStep6Answered
            },
            option
          );
        })
      )
    );
  };
  
  // Render MCQ for Step 11
  const renderMcqStep11 = () => {
    return React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, mcqStep11Data.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        mcqStep11Data.options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedMcqOption === index) {
            className += index === mcqStep11Data.answerIndex ? " correct" : " incorrect";
          }
          if ((mcqCorrect || calcState.mcqStep11Answered) && index !== mcqStep11Data.answerIndex) {
            className += " disabled";
          }
          
          return React.createElement(
            "button",
            {
              key: `mcq-${index}`,
              className: className,
              onClick: () => handleMcqStep11Click(index),
              disabled: mcqCorrect || calcState.mcqStep11Answered
            },
            option
          );
        })
      )
    );
  };
  
  // Render calculation rows for Step 5
  const renderStep5Rows = () => {
    const rows = [];
    
    // Equation row with highlighted "Perimeter of A"
    const step5Row = calcData.rows.step5Row;
    const highlightText = calcData.rows.step5HighlightText;
    
    const parts = step5Row.split(highlightText);
    
    rows.push(
      React.createElement("div", { key: "row-eq", className: "calc-row" },
        parts[0],
        React.createElement("span", { className: "calc-highlight-cyan" }, highlightText),
        parts[1]
      )
    );
    
    return rows;
  };
  
  // Render calculation rows for Step 6
  const renderStep6Rows = () => {
    const rows = [];
    
    if (!calcState.mcqStep6Answered) {
      // MCQ not answered yet - show nothing in calc rows
      return rows;
    }
    
    // MCQ answered - show calculation row
    if (!calcState.step6BoxClicked) {
      // Box not clicked yet
      rows.push(
        React.createElement("div", { key: "row-calc", className: "calc-row" },
          calcData.rows.step6CalcRow,
          React.createElement(
            "span",
            {
              className: "calc-interactive-box clickable",
              onClick: handleStep6BoxClick
            },
            calcData.rows.step6SideLengthBox
          )
        )
      );
    } else if (!calcState.step6NumpadAnswered) {
      // Box clicked, show value and numpad input
      rows.push(
        React.createElement("div", { key: "row-calc", className: "calc-row" },
          calcData.rows.step6CalcRow + "18"
        )
      );
      rows.push(
        React.createElement("div", { key: "row-numpad", className: "calc-row" },
          calcData.rows.step6ResultRow,
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          ),
          " " + calcData.units.cm
        )
      );
    } else {
      // All done
      rows.push(
        React.createElement("div", { key: "row-calc", className: "calc-row" },
          calcData.rows.step6CalcRow + "18"
        )
      );
      rows.push(
        React.createElement("div", { key: "row-result", className: "calc-row" },
          calcData.rows.step6ResultRow + calcState.step6NumpadValue + " " + calcData.units.cm
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 7
  const renderStep7Rows = () => {
    const rows = [];
    const values = calcData.rows.step7Values;
    const perimeterBText = calcData.rows.step7PerimeterBText || "Perimeter of B";
    
    // Build the equation row with interactive boxes
    const boxStates = [
      calcState.step7BoxIndex > 0, // box 0 clicked
      calcState.step7BoxIndex > 1, // box 1 clicked
      calcState.step7BoxIndex > 2  // box 2 clicked
    ];
    
    rows.push(
      React.createElement("div", { key: "row-eq", className: "calc-row" },
        React.createElement(
          "span",
          {
            className: `calc-interactive-box ${boxStates[0] ? 'revealed' : (calcState.step7BoxIndex === 0 ? 'clickable' : '')}`,
            onClick: () => calcState.step7BoxIndex === 0 && handleStep7BoxClick(0)
          },
          boxStates[0] ? values.totalWire : calcData.rows.step7Box1Text
        ),
        " = ",
        React.createElement(
          "span",
          {
            className: `calc-interactive-box ${boxStates[1] ? 'revealed' : (calcState.step7BoxIndex === 1 ? 'clickable' : '')}`,
            onClick: () => calcState.step7BoxIndex === 1 && handleStep7BoxClick(1)
          },
          boxStates[1] ? values.perimeterA : calcData.rows.step7Box2Text
        ),
        " + " + perimeterBText + " + ",
        React.createElement(
          "span",
          {
            className: `calc-interactive-box ${boxStates[2] ? 'revealed' : (calcState.step7BoxIndex === 2 ? 'clickable' : '')}`,
            onClick: () => calcState.step7BoxIndex === 2 && handleStep7BoxClick(2)
          },
          boxStates[2] ? values.remaining : calcData.rows.step7Box3Text
        )
      )
    );
    
    return rows;
  };
  
  // Render calculation rows for Step 8
  const renderStep8Rows = () => {
    const rows = [];
    
    if (!calcState.step8BoxClicked) {
      rows.push(
        React.createElement("div", { key: "row-eq", className: "calc-row" },
          React.createElement(
            "span",
            {
              className: "calc-interactive-box clickable",
              onClick: handleStep8BoxClick
            },
            calcData.rows.step8BoxText
          ),
          calcData.rows.step8CalcRow
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "row-eq", className: "calc-row" },
          calcData.rows.step8SubstituteValue + calcData.rows.step8CalcRow
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 9
  const renderStep9Rows = () => {
    const rows = [];
    const perimeterBText = calcData.rows.step9BoxText || "Perimeter of B";
    
    if (!calcState.step9BoxClicked) {
      // Show row with Perimeter of B as interactive box
      const parts = calcData.rows.step9CalcRow1.split(perimeterBText);
      rows.push(
        React.createElement("div", { key: "row-eq", className: "calc-row" },
          parts[0],
          React.createElement(
            "span",
            {
              className: "calc-interactive-box clickable",
              onClick: handleStep9BoxClick
            },
            perimeterBText
          ),
          parts[1]
        )
      );
    } else {
      // Show new calculation row
      rows.push(
        React.createElement("div", { key: "row-result", className: "calc-row" },
          calcData.rows.step9CalcRow2
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 10
  const renderStep10Rows = () => {
    const rows = [];
    
    // First row is always visible
    rows.push(
      React.createElement("div", { key: "row-1", className: "calc-row" },
        calcData.rows.step10CalcRow1
      )
    );
    
    // Second row with first numpad
    if (!calcState.step10Numpad1Answered) {
      rows.push(
        React.createElement("div", { key: "row-2", className: "calc-row" },
          calcData.rows.step10CalcRow2,
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError && step10NumpadIndex === 0 ? 'error shake' : ''} ${inputCorrect && step10NumpadIndex === 0 ? 'correct' : ''}` },
            numpadValue || ""
          ),
          " " + calcData.units.cm
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "row-2", className: "calc-row" },
          calcData.rows.step10CalcRow2 + calcState.step10Numpad1Value + " " + calcData.units.cm
        )
      );
      
      // Third row with second numpad
      if (!calcState.step10Numpad2Answered) {
        rows.push(
          React.createElement("div", { key: "row-3", className: "calc-row" },
            calcData.rows.step10CalcRow3,
            React.createElement(
              "span",
              { className: `calc-input-box ${inputError && step10NumpadIndex === 1 ? 'error shake' : ''} ${inputCorrect && step10NumpadIndex === 1 ? 'correct' : ''}` },
              numpadValue || ""
            ),
            " " + calcData.units.cm
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "row-3", className: "calc-row" },
            calcData.rows.step10CalcRow3 + calcState.step10Numpad2Value + " " + calcData.units.cm
          )
        );
      }
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 11
  const renderStep11Rows = () => {
    const rows = [];
    
    if (calcState.mcqStep11Answered) {
      rows.push(
        React.createElement("div", { key: "row-eq", className: "calc-row" },
          calcData.rows.step11CalcRow
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 12
  const renderStep12Rows = () => {
    const rows = [];
    
    if (!calcState.step12BoxClicked) {
      // Show interactive box
      rows.push(
        React.createElement("div", { key: "row-eq", className: "calc-row" },
          calcData.rows.step12CalcRow1,
          React.createElement(
            "span",
            {
              className: "calc-interactive-box clickable",
              onClick: handleStep12BoxClick
            },
            calcData.rows.step12BoxText
          ),
          calcData.rows.step12CalcRow2
        )
      );
    } else if (!calcState.step12NumpadAnswered) {
      // Box clicked, show substituted value and numpad input
      rows.push(
        React.createElement("div", { key: "row-eq", className: "calc-row" },
          calcData.rows.step12CalcRow1 + calcData.rows.step12SubstituteValue + calcData.rows.step12CalcRow2
        )
      );
      rows.push(
        React.createElement("div", { key: "row-numpad", className: "calc-row" },
          calcData.rows.step12ResultRow,
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          ),
          " " + calcData.units.cm
        )
      );
    } else {
      // All done
      rows.push(
        React.createElement("div", { key: "row-eq", className: "calc-row" },
          calcData.rows.step12CalcRow1 + calcData.rows.step12SubstituteValue + calcData.rows.step12CalcRow2
        )
      );
      rows.push(
        React.createElement("div", { key: "row-result", className: "calc-row" },
          calcData.rows.step12ResultRow + calcState.step12NumpadValue + " " + calcData.units.cm
        )
      );
    }
    
    return rows;
  };
  
  // Render right panel content
  const renderRightPanel = () => {
    const findingsData = getFindings();
    const toFindData = getToFindData();
    
    // Helper function to render Given and To Find lists (for steps before 7)
    const renderComprehendLists = () => {
      return React.createElement(
        "div",
        { className: "calc-input-panel" },
        // Given section
        React.createElement(
          "div",
          { className: "calc-findings-div" },
          React.createElement("div", { className: "findings-title" }, comprehendData.given.title),
          React.createElement(
            "ul",
            { className: "findings-list" },
            comprehendData.given.data.map((item, index) =>
              React.createElement("li", { key: `given-${index}` }, item)
            )
          )
        ),
        // To Find section
        React.createElement(
          "div",
          { className: "calc-findings-div tofind-section" },
          React.createElement("div", { className: "findings-title tofind-title" }, comprehendData.toFind.title),
          React.createElement(
            "ul",
            { className: "findings-list" },
            comprehendData.toFind.data.map((item, index) =>
              React.createElement("li", { key: `tofind-${index}` }, item)
            )
          )
        )
      );
    };
    
    // Step 3 - Show MCQ, when answered show Given/To Find lists
    if (step === 3) {
      const showMcq = !calcState.mcqStep3Answered;
      return React.createElement(
        "div",
        { className: "calc-input-panel" },
        showMcq && React.createElement(
          "div",
          { className: "calc-input-div" },
          renderMcqStep3()
        ),
        !showMcq && renderComprehendLists()
      );
    }
    
    // Step 5 - Show Given/To Find lists (no MCQ or numpad)
    if (step === 5) {
      return renderComprehendLists();
    }
    
    // Step 6 - Show MCQ or numpad when active, otherwise show Given/To Find lists
    if (step === 6) {
      const showMcq = !calcState.mcqStep6Answered;
      const showNumpad = calcState.mcqStep6Answered && calcState.step6BoxClicked && !calcState.step6NumpadAnswered;
      const showLists = !showMcq && !showNumpad;
      
      return React.createElement(
        "div",
        { className: "calc-input-panel" },
        showMcq && React.createElement(
          "div",
          { className: "calc-input-div" },
          renderMcqStep6()
        ),
        showNumpad && React.createElement(
          "div",
          { className: "calc-input-div" },
          React.createElement(Numpad, {
            onNumberClick: handleNumberClick,
            onClear: handleClear,
            onSubmit: handleSubmit
          })
        ),
        showLists && renderComprehendLists()
      );
    }
    
    // Steps 7-10 - Findings only
    if (step >= 7 && step <= 10) {
      return React.createElement(
        "div",
        { className: "calc-input-panel" },
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
        step === 10 && !calcState.step10Numpad2Answered && React.createElement(
          "div",
          { className: "calc-input-div" },
          React.createElement(Numpad, {
            onNumberClick: handleNumberClick,
            onClear: handleClear,
            onSubmit: handleSubmit
          })
        )
      );
    }
    
    // Steps 11-12 - To Find + Findings + MCQ/Numpad
    if (step === 11 || step === 12) {
      return React.createElement(
        "div",
        { className: "calc-input-panel" },
        // To Find section
        toFindData && React.createElement(
          "div",
          { className: "calc-findings-div tofind-section" },
          React.createElement("div", { className: "findings-title tofind-title" }, toFindData.title),
          React.createElement(
            "ul",
            { className: "findings-list" },
            toFindData.list.map((item, index) =>
              React.createElement("li", { key: `tofind-${index}` }, item)
            )
          )
        ),
        // Findings section
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
        // MCQ or Numpad
        React.createElement(
          "div",
          { className: "calc-input-div" },
          step === 11 && !calcState.mcqStep11Answered && renderMcqStep11(),
          step === 12 && calcState.step12BoxClicked && !calcState.step12NumpadAnswered && React.createElement(Numpad, {
            onNumberClick: handleNumberClick,
            onClear: handleClear,
            onSubmit: handleSubmit
          })
        )
      );
    }
    
    // Step 13 - Findings only
    if (step === 13) {
      return React.createElement(
        "div",
        { className: "calc-input-panel" },
        // To Find section
        toFindData && React.createElement(
          "div",
          { className: "calc-findings-div tofind-section" },
          React.createElement("div", { className: "findings-title tofind-title" }, toFindData.title),
          React.createElement(
            "ul",
            { className: "findings-list" },
            toFindData.list.map((item, index) =>
              React.createElement("li", { key: `tofind-${index}` }, item)
            )
          )
        ),
        // Findings section
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
        )
      );
    }
    
    return null;
  };
  
  // Step 13: Final answer display
  if (step === 13) {
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
            alt: calcData.altTexts.triangles,
            className: "calc-image"
          })
        ),
        // Final answer
        React.createElement(
          "div",
          { className: "calc-equation-row" },
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
  
  // Step 3: MCQ only
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
            alt: calcData.altTexts.triangles,
            className: "calc-image"
          })
        ),
        // Empty equation row
        React.createElement(
          "div",
          { className: "calc-equation-row" }
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  }
  
  // Step 5: Display equation with highlighted text
  if (step === 5) {
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
            alt: calcData.altTexts.triangles,
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
            renderStep5Rows()
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
  
  // Steps 6, 7, 8, 9, 10, 11, 12: Calculation with right panel
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
          alt: calcData.altTexts.triangles,
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
          step === 6 && renderStep6Rows(),
          step === 7 && renderStep7Rows(),
          step === 8 && renderStep8Rows(),
          step === 9 && renderStep9Rows(),
          step === 10 && renderStep10Rows(),
          step === 11 && renderStep11Rows(),
          step === 12 && renderStep12Rows()
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
