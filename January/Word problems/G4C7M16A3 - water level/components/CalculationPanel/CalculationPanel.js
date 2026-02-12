const CalculationPanel = ({ 
  step, 
  calcPhase, 
  onEnableNext, 
  onUpdateNavText,
  // State passed from parent for persistence
  interactiveBoxState,
  setInteractiveBoxState,
  calcState,
  setCalcState,
  imageSrc
}) => {
  const { useState, useEffect, useRef } = React;
  const videoRef = useRef(null);
  
  const calcData = APP_DATA.calculation;
  const comprehendData = APP_DATA.comprehend;
  
  // Get step data for video configuration
  const stepData = APP_DATA.steps[step];
  const useVideoLastFrame = stepData && stepData.useVideoLastFrame;
  const videoSrc = stepData && stepData.videoSrc;
  const zoomImageSrc = stepData && stepData.zoomImageSrc;
  
  // Local state for numpad input
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  
  // Set video to last frame when component mounts
  useEffect(() => {
    if (videoRef.current && useVideoLastFrame) {
      const video = videoRef.current;
      const setToLastFrame = () => {
        video.currentTime = video.duration;
      };
      
      if (video.readyState >= 1) {
        setToLastFrame();
      } else {
        video.addEventListener('loadedmetadata', setToLastFrame);
        return () => video.removeEventListener('loadedmetadata', setToLastFrame);
      }
    }
  }, [useVideoLastFrame]);
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
  
  // Handle interactive box click (Step 4)
  const handleInteractiveBoxClick = (boxIndex) => {
    if (interactiveBoxState[boxIndex]) return;
    
    if (window.playSound) window.playSound("tick");
    
    const newState = { ...interactiveBoxState, [boxIndex]: true };
    setInteractiveBoxState(newState);
    
    // Check if both boxes are clicked
    if (newState[0] && newState[1]) {
      setTimeout(() => {
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[4];
          onUpdateNavText(stepData.navTextCorrect);
        }
      }, 500);
    }
  };
  
  // Handle MCQ option click
  const handleMcqOptionClick = (index, mcqKey) => {
    if (mcqCorrect) return;
    
    const mcqData = mcqKey === "mcq1" ? calcData.mcq1 : calcData.mcq2;
    setSelectedMcqOption(index);
    
    if (index === mcqData.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      // Update calc state - wait 0.5 sec before proceeding
      if (mcqKey === "mcq1") {
        setTimeout(() => {
          setCalcState(prev => ({ 
            ...prev, 
            mcq1Answered: true,
            showNumpad1: true,
            findings: [...(prev.findings || []), calcData.mcq1.finding]
          }));
          if (onUpdateNavText) {
            const stepData = APP_DATA.steps[5];
            onUpdateNavText(stepData.navTextNumpad);
          }
        }, 500);
      } else if (mcqKey === "mcq2") {
        setTimeout(() => {
          setCalcState(prev => ({ 
            ...prev, 
            mcq2Answered: true,
            showFinalRow: true
          }));
          setTimeout(() => {
            if (onEnableNext) onEnableNext();
            if (onUpdateNavText) {
              const stepData = APP_DATA.steps[8];
              onUpdateNavText(stepData.navTextCorrect);
            }
          }, 500);
        }, 500);
      }
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };
  
  // Handle numpad input
  const handleNumberClick = (num) => {
    // Determine which numpad is active based on step and state
    const isStep5Numpad = step === 5 && calcState.mcq1Answered && !calcState.numpad1Answered;
    const maxLength = isStep5Numpad ? calcData.numpad1.maxLength : calcData.numpad2.maxLength;
    if (numpadValue.length < maxLength) {
      setNumpadValue(prev => prev + num);
    }
  };
  
  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    // Determine which numpad answer to check based on step
    const isStep5Numpad = step === 5 && calcState.mcq1Answered && !calcState.numpad1Answered;
    const isStep6Numpad = step === 6 && !calcState.numpad2Answered;
    
    const correctAnswer = isStep5Numpad ? calcData.numpad1.answer : calcData.numpad2.answer;
    
    if (numpadValue === correctAnswer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      
      setTimeout(() => {
        setInputCorrect(false);
        
        if (isStep5Numpad) {
          setCalcState(prev => ({ 
            ...prev, 
            numpad1Answered: true,
            numpad1Value: numpadValue
          }));
        } else if (isStep6Numpad) {
          setCalcState(prev => ({ 
            ...prev, 
            numpad2Answered: true,
            numpad2Value: numpadValue
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
  
  const renderCalculationRows = () => {
    const rows = [];
    const initialEq = calcData.initialEquation || [];
    rows.push(
      React.createElement("div", { key: "row-label", className: "calc-row" }, 
        initialEq[0] || "Volume of water left in the tank"
      )
    );
    rows.push(
      React.createElement("div", { key: "row-eq1", className: "calc-row" }, 
        initialEq[1] || "= Initial volume of water – Volume of water used"
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
              className: `calc-interactive-box ${interactiveBoxState[0] ? 'revealed' : 'clickable'}`,
              onClick: () => !interactiveBoxState[0] && handleInteractiveBoxClick(0)
            },
            interactiveBoxState[0] ? calcData.values.initialVolume : calcData.values.initial1
          ),
          " – ",
          React.createElement(
            "span",
            {
              className: `calc-interactive-box ${interactiveBoxState[1] ? 'revealed' : (interactiveBoxState[0] ? 'clickable' : '')}`,
              onClick: () => interactiveBoxState[0] && !interactiveBoxState[1] && handleInteractiveBoxClick(1)
            },
            interactiveBoxState[1] ? calcData.values.usedVolume : calcData.values.initial2
          )
        )
      );
    }
    
    // Step 5+: Show values row
    if (step >= 5) {
      rows.push(
        React.createElement("div", { key: "row-values", className: "calc-row" },
          `= ${calcData.values.initialVolume} – ${calcData.values.usedVolume}`
        )
      );
    }
    
    const rowTemplates = calcData.rows || [];
    const resultMl = calcData.resultMl != null ? calcData.resultMl : "1249.675 mL";
    const resultCm3 = calcData.resultCm3 != null ? calcData.resultCm3 : "1249.675 cm³";

    if (step === 5 && calcState.mcq1Answered && !calcState.numpad1Answered) {
      const template = rowTemplates[1] || "= (2.225 × [box]) mL – 975.325 mL";
      const parts = template.split('[box]');
      rows.push(
        React.createElement("div", { key: "row-conv1", className: "calc-row" },
          parts[0] || "= (2.225 × ",
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          ),
          parts[1] || ") mL – 975.325 mL"
        )
      );
    }
    
    if (calcState.numpad1Answered || step >= 6) {
      const template = rowTemplates[1] || "= (2.225 × [box]) mL – 975.325 mL";
      const val = calcState.numpad1Value || calcData.numpad1.answer;
      rows.push(
        React.createElement("div", { key: "row-conv1-done", className: "calc-row" },
          template.replace('[box]', val)
        )
      );
    }
    
    if (step === 6 && !calcState.numpad2Answered) {
      const template = rowTemplates[2] || "= [box] mL – 975.325 mL";
      const parts = template.split('[box]');
      rows.push(
        React.createElement("div", { key: "row-conv2", className: "calc-row" },
          parts[0] || "= ",
          React.createElement(
            "span",
            { className: `calc-input-box ${inputError ? 'error shake' : ''} ${inputCorrect ? 'correct' : ''}` },
            numpadValue || ""
          ),
          parts[1] || " mL – 975.325 mL"
        )
      );
    }
    
    if (calcState.numpad2Answered || step >= 7) {
      const template = rowTemplates[2] || "= [box] mL – 975.325 mL";
      const val = calcState.numpad2Value || calcData.numpad2.answer;
      rows.push(
        React.createElement("div", { key: "row-conv2-done", className: "calc-row" },
          template.replace('[box]', val)
        )
      );
    }
    
    if (step >= 7) {
      rows.push(
        React.createElement("div", { key: "row-result", className: "calc-row" },
          resultMl.indexOf("=") === 0 ? resultMl : "= " + resultMl
        )
      );
    }
    
    if (calcState.showFinalRow || step >= 9) {
      rows.push(
        React.createElement("div", { key: "row-cm3", className: "calc-row" },
          resultCm3.indexOf("=") === 0 ? resultCm3 : "= " + resultCm3
        )
      );
    }
    
    return rows;
  };
  
  // Render right panel content
  const renderRightPanel = () => {
    // Step 4: Show comprehend data (given and to find)
    if (step === 4) {
      return React.createElement(
        "div",
        { className: "calc-comprehend-panel" },
        // Given section
        React.createElement(
          "div",
          { className: "comprehend-section given-section" },
          React.createElement("div", { className: "section-border given-border" }),
          React.createElement(
            "div",
            { className: "section-content" },
            React.createElement("h4", { className: "section-title given-title" }, comprehendData.given.title),
            React.createElement(
              "ul",
              { className: "section-list" },
              comprehendData.given.data.map((item, index) => 
                React.createElement("li", { key: `given-${index}`, className: "section-list-item" }, item)
              )
            )
          )
        ),
        // To Find section
        React.createElement(
          "div",
          { className: "comprehend-section tofind-section" },
          React.createElement("div", { className: "section-border tofind-border" }),
          React.createElement(
            "div",
            { className: "section-content" },
            React.createElement("h4", { className: "section-title tofind-title" }, comprehendData.toFind.title),
            React.createElement(
              "ul",
              { className: "section-list" },
              comprehendData.toFind.data.map((item, index) => 
                React.createElement("li", { key: `tofind-${index}`, className: "section-list-item tofind-item" }, item)
              )
            )
          )
        )
      );
    }
    
    // Steps 5-9: Show findings and input panel
    return React.createElement(
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
          (calcState.findings || []).map((finding, index) =>
            React.createElement("li", { key: `finding-${index}` }, finding)
          )
        )
      ),
      // Input div (MCQ or Numpad)
      React.createElement(
        "div",
        { className: "calc-input-div" },
        renderInputContent()
      )
    );
  };
  
  // Render input content (MCQ or Numpad)
  const renderInputContent = () => {
    // Step 5: MCQ first, then numpad
    if (step === 5) {
      if (!calcState.mcq1Answered) {
        return renderMcq(calcData.mcq1, "mcq1");
      } else if (!calcState.numpad1Answered) {
        return React.createElement(Numpad, {
          onNumberClick: handleNumberClick,
          onClear: handleClear,
          onSubmit: handleSubmit
        });
      }
      return null;
    }
    
    // Step 6: Numpad only
    if (step === 6 && !calcState.numpad2Answered) {
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit
      });
    }
    
    // Step 8: MCQ
    if (step === 8 && !calcState.mcq2Answered) {
      return renderMcq(calcData.mcq2, "mcq2");
    }
    
    return null;
  };
  
  // Render MCQ
  const renderMcq = (mcqData, mcqKey) => {
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
              onClick: () => handleMcqOptionClick(index, mcqKey),
              disabled: mcqCorrect
            },
            option
          );
        })
      )
    );
  };
  
  // Step 9: Final answer display
  if (step === 9) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final" },
        React.createElement(
          "div",
          { className: "calc-rows-container" },
          renderCalculationRows()
        ),
        React.createElement(
          "div",
          { className: "final-answer-div" },
          calcData.finalAnswer
        )
      ),
      React.createElement(
        "div",
        { className: "calc-right-panel" },
        renderRightPanel()
      )
    );
  }
  
  // Step 4: Show image in left panel with equation below
  if (step === 4) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel step4-left" },
        // Image row (65% height)
        React.createElement(
          "div",
          { className: "calc-image-row", style: { position: 'relative' } },
          useVideoLastFrame ? React.createElement("video", {
            ref: videoRef,
            src: videoSrc,
            className: "calc-image",
            muted: true,
            playsInline: true,
            preload: "metadata"
          }) : (imageSrc && React.createElement("img", {
            src: imageSrc,
            alt: (APP_DATA.labels && APP_DATA.labels.waterTankAlt) || "Water tank",
            className: "calc-image"
          })),
          zoomImageSrc && React.createElement("img", {
            src: zoomImageSrc,
            alt: (APP_DATA.labels && APP_DATA.labels.zoomIndicatorAlt) || "Zoom indicator",
            className: "zoom-img",
            style: {
              position: 'absolute',
              width: '22vw',
              height: '22vw',
              right: '-2vw',
              top: '-2vw',
              zIndex: 10
            }
          })
        ),
        // Equation row (rest height)
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            renderCalculationRows()
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
        renderCalculationRows()
      )
    ),
    React.createElement(
      "div",
      { className: "calc-right-panel" },
      renderRightPanel()
    )
  );
};
