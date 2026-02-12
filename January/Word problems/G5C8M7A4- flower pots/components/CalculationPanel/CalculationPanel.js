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
  const calc3Data = APP_DATA.calculation3;
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
  
  // Get MCQ data based on step
  const getMcqData = () => {
    const stepData = APP_DATA.steps[step];
    if (!stepData || !stepData.mcqKey) return null;
    return APP_DATA[stepData.mcqKey];
  };
  
  // Handle interactive box click for Step 5 (perimeter - 4 boxes)
  const handlePerimeterBoxClick = (boxIndex) => {
    // boxIndex should be 0-3 for the 4 side length boxes
    if (boxIndex < 0 || boxIndex > 3) return;
    if (interactiveBoxState1[boxIndex]) return;
    
    // Sequential logic: only allow clicking in order 0 → 1 → 2 → 3
    if (boxIndex > 0 && !interactiveBoxState1[boxIndex - 1]) return;
    
    if (window.playSound) window.playSound("tick");
    
    const newState = { ...interactiveBoxState1, [boxIndex]: true };
    setInteractiveBoxState1(newState);
    
    // Check if all 4 side length boxes are clicked (indices 0-3 only)
    const allClicked = newState[0] && newState[1] && newState[2] && newState[3];
    
    if (allClicked) {
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, calc1BoxesDone: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[5];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    }
  };
  
  // Handle sum box expansion (triggers showing 4 individual boxes)
  const handleSumBoxClick = () => {
    // Set first box to true to indicate expansion, but don't mark it as "clicked" for substitution
    // We'll use a different approach - track expansion separately
    if (!interactiveBoxState1[0] && !interactiveBoxState1[1] && !interactiveBoxState1[2] && !interactiveBoxState1[3]) {
      // First click - just expand, don't mark any box as clicked yet
      // We'll use a special state or just set all to false but show the boxes
      // Actually, let's use index 4 as a flag for expansion
      const newState = { ...interactiveBoxState1, 4: true };
      setInteractiveBoxState1(newState);
      if (window.playSound) window.playSound("tick");
    }
  };
  
  // Handle interactive box click for Step 12 (total cost - 2 boxes)
  const handleTotalCostBoxClick = (boxIndex) => {
    if (interactiveBoxState2[boxIndex]) return;
    
    if (window.playSound) window.playSound("tick");
    
    const newState = { ...interactiveBoxState2, [boxIndex]: true };
    setInteractiveBoxState2(newState);
    
    // Check if both boxes are clicked
    if (newState[0] && newState[1]) {
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, calc3BoxesDone: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[12];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    }
  };
  
  // Handle MCQ option click
  const handleMcqOptionClick = (index, mcqKey) => {
    const mcqData = APP_DATA[mcqKey];
    if (!mcqData) return;
    
    // Check if already answered for this MCQ
    const mcqStateKey = mcqKey === "mcq1" ? "mcq1Answered" : 
                       mcqKey === "mcq2" ? "mcq2Answered" : "mcq3Answered";
    if (calcState[mcqStateKey]) return;
    
    setSelectedMcqOption(index);
    
    if (index === mcqData.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, [mcqStateKey]: true }));
        
        // Step 3: After MCQ1, add findings and show calc rows
        if (step === 3 && mcqKey === "mcq1") {
          setCalcState(prev => ({
            ...prev,
            [mcqStateKey]: true,
            findings: [
              { title: APP_DATA.labels.given, list: APP_DATA.calculation.defaultGiven.step3 },
              { title: APP_DATA.labels.findings, list: APP_DATA.calculation.defaultFindings.step3to4 }
            ]
          }));
          // Remove MCQ after answering
          setTimeout(() => {
            setSelectedMcqOption(null);
            setMcqCorrect(false);
          }, 1000);
        }
        
        // Step 4: After MCQ2, append calc row (handled in render)
        if (step === 4 && mcqKey === "mcq2") {
          // Update findings if needed
          if (!calcState.findings || calcState.findings.length < 2) {
            setCalcState(prev => ({
              ...prev,
              findings: [
                { title: APP_DATA.labels.given, list: APP_DATA.calculation.defaultGiven.step3 },
                { title: APP_DATA.labels.findings, list: APP_DATA.calculation.defaultFindings.step3to4 }
              ]
            }));
          }
        }
        
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[step];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  // Handle numpad input
  const handleNumberClick = (num) => {
    let maxLength = 6;
    if (step === 6) {
      maxLength = calc1Data.numpad.maxLength;
    } else if (step === 8) {
      maxLength = calc2Data.numpad1.maxLength;
    } else if (step === 9) {
      maxLength = calc2Data.numpad2.maxLength;
    } else if (step === 13) {
      maxLength = calc3Data.numpad.maxLength;
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
    let isCorrect = false;
    
    if (step === 6) {
      correctAnswer = calc1Data.numpad.answer;
      isCorrect = numpadValue === correctAnswer;
    } else if (step === 8) {
      correctAnswer = calc2Data.numpad1.answer;
      isCorrect = numpadValue === correctAnswer;
    } else if (step === 9) {
      correctAnswer = calc2Data.numpad2.answer;
      isCorrect = numpadValue === correctAnswer;
    } else if (step === 13) {
      correctAnswer = calc3Data.numpad.answer;
      isCorrect = numpadValue === correctAnswer;
    }
    
    if (isCorrect) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setInputCorrect(false);
        
        if (step === 6) {
          setCalcState(prev => ({ 
            ...prev, 
            calc1NumpadAnswered: true,
            calc1NumpadValue: numpadValue,
            findings: [
              { title: APP_DATA.labels.given, list: APP_DATA.calculation.defaultGiven.step6 },
              { title: APP_DATA.labels.findings, list: [calc1Data.findings.perimeter] }
            ]
          }));
        } else if (step === 8) {
          setCalcState(prev => ({ 
            ...prev, 
            calc2Numpad1Answered: true,
            calc2Numpad1Value: numpadValue
          }));
        } else if (step === 9) {
          setCalcState(prev => ({ 
            ...prev, 
            calc2Numpad2Answered: true,
            calc2Numpad2Value: numpadValue,
            findings: [
              { title: APP_DATA.labels.given, list: APP_DATA.calculation.defaultGiven.step7to13 },
              { title: APP_DATA.labels.findings, list: [calc1Data.findings.perimeter, calc2Data.findings.numberOfPots] }
            ]
          }));
        } else if (step === 13) {
          setCalcState(prev => ({ 
            ...prev, 
            calc3NumpadAnswered: true,
            calc3NumpadValue: numpadValue
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
  
  // Get findings lists based on current step
  const getFindings = () => {
    // Steps 3-6: Show Given and Findings lists
    if (step === 3 || step === 4 || step === 5 || step === 6) {
      if (calcState.findings && Array.isArray(calcState.findings) && calcState.findings.length >= 2) {
        return {
          given: calcState.findings[0],
          findings: calcState.findings[1]
        };
      }
      // Default for step 3-4
      if (step === 3 || step === 4) {
        return {
          given: {
            title: APP_DATA.labels.given,
            list: APP_DATA.calculation.defaultGiven.step3
          },
          findings: calcState.findings && calcState.findings[1] ? calcState.findings[1] : null
        };
      }
      // Step 5: Show side lengths in given
      if (step === 5) {
        return {
          given: {
            title: APP_DATA.labels.given,
            list: APP_DATA.calculation.defaultGiven.step5
          },
          findings: calcState.findings && calcState.findings[1] ? calcState.findings[1] : {
            title: APP_DATA.labels.findings,
            list: APP_DATA.calculation.defaultFindings.step3to4
          }
        };
      }
      // Step 6: Updated given and findings
      if (step === 6) {
        return {
          given: {
            title: APP_DATA.labels.given,
            list: APP_DATA.calculation.defaultGiven.step6
          },
          findings: calcState.findings && calcState.findings[1] ? calcState.findings[1] : null
        };
      }
    }
    // Steps 7-13: Show Given and Findings lists
    else if (step === 7 || step === 8 || step === 9 || step === 10 || step === 11 || step === 12 || step === 13) {
      if (calcState.findings && Array.isArray(calcState.findings) && calcState.findings.length >= 2) {
        return {
          given: calcState.findings[0],
          findings: calcState.findings[1]
        };
      }
      return {
        given: {
          title: APP_DATA.labels.given,
          list: APP_DATA.calculation.defaultGiven.step7to13
        },
        findings: calcState.findings && calcState.findings[1] ? calcState.findings[1] : null
      };
    }
    return { given: null, findings: null };
  };
  
  // Render calculation rows for Step 3 (after MCQ1)
  const renderStep3CalcRows = () => {
    const rows = [];
    const mcq1Answered = calcState.mcq1Answered;
    const calcRows = APP_DATA.calculation.rows;
    
    if (mcq1Answered) {
      rows.push(
        React.createElement("div", { key: "row1", className: "calc-row" },
          calcRows.step3Row1
        ),
        React.createElement("div", { key: "row2", className: "calc-row" },
          calcRows.step3Row2
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 4 (after MCQ2)
  const renderStep4CalcRows = () => {
    const rows = [];
    const mcq2Answered = calcState.mcq2Answered;
    const calcRows = APP_DATA.calculation.rows;
    
    rows.push(
      React.createElement("div", { key: "row1", className: "calc-row" },
        calcRows.step3Row1
      ),
      React.createElement("div", { key: "row2", className: "calc-row" },
        calcRows.step3Row2
      )
    );
    
    if (mcq2Answered) {
      rows.push(
        React.createElement("div", { key: "row3", className: "calc-row" },
          calcRows.step4Row3
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 5 (perimeter with 4 interactive boxes)
  const renderStep5CalcRows = () => {
    const rows = [];
    const perimeterData = calc1Data.perimeterBoxes;
    
    // Check if "Sum of the side lengths" box has been expanded (index 4 is expansion flag)
    const sumBoxExpanded = interactiveBoxState1[4] === true;
    
    const calcRows = APP_DATA.calculation.rows;
    
    if (!sumBoxExpanded) {
      // Show only the row with "[Sum of the side lengths]" box
      rows.push(
        React.createElement("div", { key: "row1", className: "calc-row" },
          calcRows.step5Row1,
          React.createElement(
            "span",
            {
              className: "calc-interactive-box clickable",
              onClick: handleSumBoxClick
            },
            calcRows.step5SumBox
          )
        )
      );
    } else {
      // Show "Sum of the side lengths" substituted
      rows.push(
        React.createElement("div", { key: "row1", className: "calc-row" },
          calcRows.step5Row2
        )
      );
      
      // Show the row with 4 individual boxes (sequential highlighting)
      rows.push(
        React.createElement("div", { key: "row2", className: "calc-row" },
          calcRows.step5Row1,
          ...perimeterData.values.map((val, idx) => {
            const isClicked = interactiveBoxState1[idx];
            // Sequential logic: only make clickable if previous box is clicked (or it's the first box)
            const isClickable = idx === 0 || (idx > 0 && interactiveBoxState1[idx - 1]);
            const shouldBeClickable = !isClicked && isClickable;
            
            return React.createElement(
              React.Fragment,
              { key: `frag-${idx}` },
              idx > 0 && " + ",
              React.createElement(
                "span",
                {
                  className: `calc-interactive-box ${isClicked ? 'revealed' : (shouldBeClickable ? 'clickable' : '')}`,
                  onClick: shouldBeClickable ? () => handlePerimeterBoxClick(idx) : undefined
                },
                isClicked ? val : `[${perimeterData.labels[idx]}]`
              )
            );
          })
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 6 (perimeter numpad)
  const renderStep6CalcRows = () => {
    const rows = [];
    const perimeterData = calc1Data.perimeterBoxes;
    const calcRows = APP_DATA.calculation.rows;
    
    rows.push(
      React.createElement("div", { key: "row1", className: "calc-row" },
        calcRows.step6Row1
      ),
      React.createElement("div", { key: "row2", className: "calc-row" },
        `${calcRows.step6Row2Prefix}${perimeterData.values[0]} + ${perimeterData.values[1]} + ${perimeterData.values[2]} + ${perimeterData.values[3]}`
      )
    );
    
    if (calcState.calc1NumpadAnswered) {
      rows.push(
        React.createElement("div", { key: "row3", className: "calc-row" },
          `${calcRows.step6Row2Prefix}${calcState.calc1NumpadValue} ${calc1Data.numpad.unit || "m"}`
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "row3", className: "calc-row" },
          calcRows.step6Row2Prefix,
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          ),
          " " + (calc1Data.numpad.unit || "m")
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 8 (number of pots - first numpad)
  const renderStep8CalcRows = () => {
    const rows = [];
    const calcRows = APP_DATA.calculation.rows;
    
    rows.push(
      React.createElement("div", { key: "row1", className: "calc-row" },
        calcRows.step8Row1
      )
    );
    
    if (calcState.calc2Numpad1Answered) {
      rows.push(
        React.createElement("div", { key: "row2", className: "calc-row" },
          `${calcRows.step8Row2Prefix}${calcState.calc2Numpad1Value}${calcRows.step8Row2Suffix}`
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "row2", className: "calc-row" },
          calcRows.step8Row2Prefix,
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          ),
          calcRows.step8Row2Suffix
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 9 (number of pots - second numpad)
  const renderStep9CalcRows = () => {
    const rows = [];
    const calcRows = APP_DATA.calculation.rows;
    
    rows.push(
      React.createElement("div", { key: "row1", className: "calc-row" },
        calcRows.step9Row1
      ),
      React.createElement("div", { key: "row2", className: "calc-row" },
        `${calcRows.step9Row2Prefix}${calcState.calc2Numpad1Value}${calcRows.step8Row2Suffix}`
      )
    );
    
    if (calcState.calc2Numpad2Answered) {
      rows.push(
        React.createElement("div", { key: "row3", className: "calc-row" },
          `${calcRows.step9Row3Prefix}${calcState.calc2Numpad2Value}`
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "row3", className: "calc-row" },
          calcRows.step9Row3Prefix,
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          )
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 12 (total cost - interactive boxes)
  const renderStep12CalcRows = () => {
    const rows = [];
    const calcRows = APP_DATA.calculation.rows;
    
    rows.push(
      React.createElement("div", { key: "row1", className: "calc-row" },
        calcRows.step12Row1
      )
    );
    
    if (calcState.calc3BoxesDone) {
      rows.push(
        React.createElement("div", { key: "row2", className: "calc-row" },
          `${calcRows.step12Row2Prefix}${calc3Data.values.numberOfPots}${calcRows.step12Row2Middle}${calc3Data.values.costPerPot}`
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "row2", className: "calc-row" },
          calcRows.step12Row2Prefix,
          React.createElement(
            "span",
            {
              className: `calc-interactive-box ${interactiveBoxState2[0] ? 'revealed' : 'clickable'}`,
              onClick: () => !interactiveBoxState2[0] && handleTotalCostBoxClick(0)
            },
            interactiveBoxState2[0] ? calc3Data.values.numberOfPots : calc3Data.values.initialBox1
          ),
          calcRows.step12Row2Middle,
          React.createElement(
            "span",
            {
              className: `calc-interactive-box ${interactiveBoxState2[1] ? 'revealed' : (interactiveBoxState2[0] ? 'clickable' : '')}`,
              onClick: () => interactiveBoxState2[0] && !interactiveBoxState2[1] && handleTotalCostBoxClick(1)
            },
            interactiveBoxState2[1] ? calc3Data.values.costPerPot : calc3Data.values.initialBox2
          )
        )
      );
    }
    
    return rows;
  };
  
  // Render calculation rows for Step 13 (total cost - numpad)
  const renderStep13CalcRows = () => {
    const rows = [];
    const calcRows = APP_DATA.calculation.rows;
    
    rows.push(
      React.createElement("div", { key: "row1", className: "calc-row" },
        calcRows.step13Row1
      ),
      React.createElement("div", { key: "row2", className: "calc-row" },
        `${calcRows.step13Row2Prefix}${calc3Data.values.numberOfPots}${calcRows.step12Row2Middle}${calc3Data.values.costPerPot}`
      )
    );
    
    if (calcState.calc3NumpadAnswered) {
      rows.push(
        React.createElement("div", { key: "row3", className: "calc-row" },
          `${calcRows.step13Row3Prefix}${calcState.calc3NumpadValue}`
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "row3", className: "calc-row" },
          calcRows.step13Row3Prefix,
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          )
        )
      );
    }
    
    return rows;
  };
  
  // Render right panel content
  const renderRightPanel = () => {
    const findingsData = getFindings();
    
    return React.createElement(
      "div",
      { className: "calc-input-panel" },
      // Findings div with both Given and Findings lists (hidden for step 10)
      (step !== 10 && (findingsData.given || findingsData.findings)) && React.createElement(
        "div",
        { className: "calc-findings-div" },
        // Given list
        findingsData.given && findingsData.given.title && React.createElement(
          React.Fragment,
          null,
          React.createElement("div", { className: "findings-title" }, findingsData.given.title),
          React.createElement(
            "ul",
            { className: "findings-list" },
            findingsData.given.list.map((finding, index) =>
              React.createElement("li", { key: `given-${index}` }, finding)
            )
          )
        ),
        // Findings list
        findingsData.findings && findingsData.findings.title && React.createElement(
          React.Fragment,
          null,
          React.createElement("div", { className: "findings-title" }, findingsData.findings.title),
          React.createElement(
            "ul",
            { className: "findings-list" },
            findingsData.findings.list.map((finding, index) =>
              React.createElement("li", { key: `finding-${index}` }, finding)
            )
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
    const stepData = APP_DATA.steps[step];
    
    // Steps 3, 4, 10: MCQ
    if ((step === 3 || step === 4 || step === 10) && stepData.isMcq) {
      const mcqData = getMcqData();
      if (!mcqData) return null;
      
      const mcqStateKey = stepData.mcqKey === "mcq1" ? "mcq1Answered" : 
                         stepData.mcqKey === "mcq2" ? "mcq2Answered" : "mcq3Answered";
      const isAnswered = calcState[mcqStateKey];
      
      // Step 3: Hide MCQ after answering
      if (step === 3 && isAnswered) {
        return null;
      }
      
      return React.createElement(
        "div",
        { className: "calc-mcq", style: { fontSize: mcqData.fontSize || "inherit" } },
        React.createElement("div", { className: "calc-mcq-title" }, mcqData.title),
        React.createElement(
          "div",
          { className: "calc-mcq-options" },
          mcqData.options.map((option, index) => {
            let className = "calc-mcq-option";
            if (selectedMcqOption === index) {
              className += index === mcqData.answerIndex ? " correct" : " incorrect";
            }
            if (isAnswered && index !== mcqData.answerIndex) {
              className += " disabled";
            }
            
            return React.createElement(
              "button",
              {
                key: `mcq-${index}`,
                className: className,
                onClick: () => handleMcqOptionClick(index, stepData.mcqKey),
                disabled: isAnswered
              },
              option
            );
          })
        )
      );
    }
    
    // Steps 6, 8, 9, 13: Numpad
    if ((step === 6 || step === 8 || step === 9 || step === 13) && stepData.isNumpad) {
      const isAnswered = (step === 6 && calcState.calc1NumpadAnswered) ||
                        (step === 8 && calcState.calc2Numpad1Answered) ||
                        (step === 9 && calcState.calc2Numpad2Answered) ||
                        (step === 13 && calcState.calc3NumpadAnswered);
      
      if (isAnswered) return null;
      
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit
      });
    }
    
    return null;
  };
  
  // Get calculation rows based on step
  const getCalcRows = () => {
    if (step === 3) return renderStep3CalcRows();
    if (step === 4) return renderStep4CalcRows();
    if (step === 5) return renderStep5CalcRows();
    if (step === 6) return renderStep6CalcRows();
    if (step === 8) return renderStep8CalcRows();
    if (step === 9) return renderStep9CalcRows();
    if (step === 12) return renderStep12CalcRows();
    if (step === 13) return renderStep13CalcRows();
    return [];
  };
  
  // Step 14: Final answer display
  if (step === 14) {
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
            alt: APP_DATA.altTexts?.finalAnswer,
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
  
  // Steps 3-13: Calculation panel with image
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
          alt: APP_DATA.altTexts?.calculationVisual,
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
          getCalcRows()
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
