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
  const comprehendData = APP_DATA.comprehend;
  const calcDisplayData = APP_DATA.calculation;
  const stepData = APP_DATA.steps[step];

  // Local state for numpad input (step 5)
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);

  // Reset states on step change
  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
  }, [step]);

  // Handle numpad input (step 5)
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
  
  // Get findings list based on current step (steps 4, 5, 6)
  const getFindings = () => {
    if (step === 4) {
      return {
        title: APP_DATA.labels.given,
        list: comprehendData.given.data
      };
    }
    if (step === 5) {
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
    }
    if (step === 6) {
      return {
        title: APP_DATA.labels.findings,
        list: calcState.findings || [calc1Data.findings.areaFinding]
      };
    }
    return { title: "", list: [] };
  };

  // Detect single interactive box (e.g. [[Side length × Side length]]) vs two boxes ([[Length]] [[Breadth]])
  const hasSingleInteractiveBox = () => {
    const initialEquation = calc1Data.initialEquation && calc1Data.initialEquation[0];
    if (!initialEquation) return false;
    const matches = initialEquation.match(/\[\[.*?\]\]/g);
    return matches && matches.length === 1 && calc1Data.values && calc1Data.values.singleBoxReplacement;
  };

  // Render calculation rows for steps 4, 5, 6
  const renderCalc1Rows = () => {
    const rows = [];
    const singleBox = hasSingleInteractiveBox();

    // Steps 4, 5, 6: Interactive box row then (from step 5) numpad row
    if (step === 4 || step === 5 || step === 6) {
      const initialEquation = calc1Data.initialEquation[0] || "";
      const parts = initialEquation.split(/(\[\[.*?\]\])/);

      rows.push(
        React.createElement("div", { key: "row-interactive", className: "calc-row calc-row-input-boxes" },
          parts.map((part, idx) => {
            if (part.startsWith("[[") && part.endsWith("]]")) {
              const boxIndex = 0;
              const isClicked = interactiveBoxState1[boxIndex];
              const isHighlighted = !isClicked && step === 4;
              const replacement = singleBox && calc1Data.values.singleBoxReplacement
                ? calc1Data.values.singleBoxReplacement
                : (calc1Data.values.lengthFinal || part.replace(/\[\[|\]\]/g, ""));

              return React.createElement(
                "span",
                {
                  key: `box-${idx}`,
                  className: `calc-interactive-box-step5 ${isClicked ? "clicked" : ""} ${isHighlighted ? "highlighted" : ""}`,
                  onClick: () => {
                    if (!isClicked && step === 4) {
                      if (window.playSound) window.playSound("click");
                      setInteractiveBoxState1(prev => ({ ...prev, [boxIndex]: true }));
                      setTimeout(() => {
                        setCalcState(prev => ({ ...prev, calc1BoxesDone: true }));
                        if (onEnableNext) onEnableNext();
                        if (onUpdateNavText) {
                          const s = APP_DATA.steps[step];
                          if (s && s.navTextCorrect) onUpdateNavText(s.navTextCorrect);
                        }
                      }, 300);
                    }
                  }
                },
                isClicked ? replacement : part.replace(/\[\[|\]\]/g, "")
              );
            }
            return React.createElement("span", { key: `text-${idx}` }, part);
          })
        )
      );
    }

    // Step 5, 6: Numpad row (Area of the square floor = [input] m²)
    if (step === 5 || step === 6) {
      const unit = calc1Data.numpad.unit || " m²";
      if (step === 5 && !calcState.calc1NumpadAnswered) {
        rows.push(
          React.createElement("div", { key: "row-numpad", className: "calc-row" },
            React.createElement("span", { className: "calc-hidden-text" }, calcDisplayData.rows.calc1Label),
            " = ",
            React.createElement(
              "span",
              { className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrect ? "correct" : ""}` },
              numpadValue || ""
            ),
            unit
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "row-result", className: "calc-row" },
            React.createElement("span", { className: "calc-hidden-text" }, calcDisplayData.rows.calc1Label),
            " = ",
            calcState.calc1NumpadValue,
            unit
          )
        );
      }
    }

    return rows;
  };
  
  // Render right panel content
  const renderRightPanel = () => {
    const findingsData = getFindings();
    
    // Steps 4, 5, 7 - Show findings and no input (or numpad for step 5)
    // Steps 8 - Show findings and numpad
    // Step 9 - Show findings and MCQ
    // Step 10 - Show findings only
    
    const findingsDivClass = "calc-findings-div" + (step === 5 || step === 6 ? " findings-hidden" : "");
    return React.createElement(
      "div",
      { className: "calc-input-panel" },
      // Findings div (opacity 0 on steps 5 and 6)
      React.createElement(
        "div",
        { className: findingsDivClass },
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
  
  // Render input content (Numpad on step 5)
  const renderInputContent = () => {
    if (!stepData) return null;
    if (step === 5 && !calcState.calc1NumpadAnswered) {
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit
      });
    }
    return null;
  };

  // Step 6: Final answer display (if isFinalStep)
  if (step === 6 && stepData && stepData.isFinalStep) {
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
            alt: calcDisplayData.altTexts.squareFloor || calcDisplayData.altTexts.riceField || "Square floor",
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
  
  // Steps 4-5: Interactive box and numpad (with image)
  if (step === 4 || (step === 5 && stepData && !stepData.isFinalStep)) {
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
            alt: calcDisplayData.altTexts.squareFloor || calcDisplayData.altTexts.riceField || "Square floor",
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
