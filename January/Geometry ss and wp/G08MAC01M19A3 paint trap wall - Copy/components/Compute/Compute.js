const Compute = ({ onComplete, onEnableNext, onUpdateNavText }) => {
  const { useState, useEffect } = React;
  
  const computeData = APP_DATA.compute;
  
  // State for compute progression
  const [currentPhase, setCurrentPhase] = useState(0);
  // Phase 0: Initial row with button
  // Phase 1: Two rows, interactive boxes
  // Phase 2: AB clicked
  // Phase 3: AC clicked  
  // Phase 4: BC clicked (all clicked, show calculate button)
  // Phase 5: Third row added
  // Phase 6: Fourth row (sqrt) added
  // Phase 7: Final result shown
  
  const [clickedBoxes, setClickedBoxes] = useState({
    AB: false,
    AC: false,
    BC: false
  });
  
  const handleSubstituteClick = () => {
    if (window.playSound) window.playSound("click");
    setCurrentPhase(1);
  };
  
  const handleBoxClick = (boxType) => {
    if (currentPhase < 1 || currentPhase > 3) return;
    
    // Sequential logic: Only allow clicking in order AB → AC → BC
    if (boxType === "AC" && !clickedBoxes.AB) return;
    if (boxType === "BC" && (!clickedBoxes.AB || !clickedBoxes.AC)) return;
    
    if (window.playSound) window.playSound("click");
    setClickedBoxes(prev => ({
      ...prev,
      [boxType]: true
    }));
    
    // Check if all boxes will be clicked after this
    const newClicked = { ...clickedBoxes, [boxType]: true };
    if (newClicked.AB && newClicked.AC && newClicked.BC) {
      setCurrentPhase(4);
    }
  };
  
  const handleCalculateClick = () => {
    if (window.playSound) window.playSound("click");
    setCurrentPhase(5);
  };
  
  const handleSqrtClick = () => {
    if (window.playSound) window.playSound("click");
    setCurrentPhase(6);
  };
  
  const handleFinalClick = () => {
    if (window.playSound) window.playSound("click");
    setCurrentPhase(7);
    // Notify parent that compute is complete
    if (onComplete) onComplete();
    if (onEnableNext) onEnableNext();
    if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[7].navTextComplete);
  };
  
  // Render a compute box
  const renderBox = (text, colorType, isInteractive = false, isClicked = false, onClick = null, transparent = false, textColor = null) => {
    let className = "compute-box";
    if (colorType === "blue") className += " box-blue";
    if (colorType === "red") className += " box-red";
    if (colorType === "yellow") className += " box-yellow";
    if (isInteractive && !isClicked) className += " box-interactive";
    if (transparent) className += " box-transparent";
    
    const style = textColor ? { color: textColor } : {};
    
    return React.createElement(
      "div",
      { 
        className,
        style,
        onClick: isInteractive && !isClicked ? onClick : null,
        dangerouslySetInnerHTML: { __html: text }
      },
      // text
    );
  };
  
  // Render a row of boxes
  const renderRow = (rowData, rowIndex) => {
    return React.createElement(
      "div",
      { className: "compute-row", key: `row-${rowIndex}` },
      rowData.map((item, index) => {
        if (item.isOperator) {
          const operatorStyle = item.textColor ? { color: item.textColor } : {};
          return React.createElement(
            "span",
            { className: "compute-operator", key: `op-${index}`, style: operatorStyle },
            item.text
          );
        }
        return React.createElement(
          React.Fragment,
          { key: `box-${index}` },
          renderBox(
            item.text, 
            item.color, 
            item.interactive, 
            item.clicked, 
            item.onClick,
            item.transparent,
            item.textColor
          )
        );
      })
    );
  };
  
  // Build rows based on current phase
  const buildRows = () => {
    const rows = [];
    
    // Row 1: Always visible - AB² = AC² - BC²
    rows.push([
      { text: "AB²", color: "blue" },
      { isOperator: true, text: "=" },
      { text: "AC²", color: "red" },
      { isOperator: true, text: "-" },
      { text: "BC²", color: "yellow" }
    ]);
    
    // Row 2: Interactive row (phase 1+)
    if (currentPhase >= 1) {
      const ABText = clickedBoxes.AB ? "a²" : "AB²";
      const ACText = clickedBoxes.AC ? "338" : "AC²";
      const BCText = clickedBoxes.BC ? "7²" : "BC²";
      
      rows.push([
        { 
          text: ABText, 
          color: "blue", 
          interactive: currentPhase < 4 && !clickedBoxes.AB,
          clicked: clickedBoxes.AB,
          onClick: () => handleBoxClick("AB")
        },
        { isOperator: true, text: "=" },
        { 
          text: ACText, 
          color: "red", 
          interactive: currentPhase < 4 && !clickedBoxes.AC && clickedBoxes.AB,
          clicked: clickedBoxes.AC,
          onClick: () => handleBoxClick("AC")
        },
        { isOperator: true, text: "-" },
        { 
          text: BCText, 
          color: "yellow", 
          interactive: currentPhase < 4 && !clickedBoxes.BC && clickedBoxes.AB && clickedBoxes.AC,
          clicked: clickedBoxes.BC,
          onClick: () => handleBoxClick("BC")
        }
      ]);
    }
    
    // Row 3: a² = 338 - 49 (phase 5+)
    if (currentPhase >= 5) {
      rows.push([
        { text: "a²", color: "blue" },
        { isOperator: true, text: "=" },
        { text: "338", transparent: true },
        { isOperator: true, text: "-" },
        { text: "49", transparent: true }
      ]);
    }
    
    // Row 4: a = √289 = 17 cm (phase 6+)
    if (currentPhase >= 6) {
      if (currentPhase === 6) {
        // Phase 6: all texts in #5EB2E7
        rows.push([
          { text: "a", transparent: true, textColor: "#5EB2E7" },
          { isOperator: true, text: "=", textColor: "#5EB2E7" },
          { text: sqrt("289"), transparent: true, textColor: "#5EB2E7" }
        ]);
      } else {
        // Phase 7: a and 17 cm in #5EB2E7
        rows.push([
          { text: "a", transparent: true, textColor: "#5EB2E7" },
          { isOperator: true, text: "=" },
          { text: sqrt("289"), transparent: true },
          { isOperator: true, text: "=" },
          { text: "17 cm", color: "result", textColor: "#5EB2E7" }
        ]);
      }
    }
    
    return rows;
  };
  
  // Get current button text and handler
  const getButton = () => {
    if (currentPhase === 0) {
      return { text: computeData.buttons.substitute, onClick: handleSubstituteClick };
    }
    if (currentPhase === 4) {
      return { text: computeData.buttons.calculate, onClick: handleCalculateClick };
    }
    if (currentPhase === 5) {
      return { text: computeData.buttons.sqrt, onClick: handleSqrtClick };
    }
    if (currentPhase === 6) {
      return { text: computeData.buttons.final, onClick: handleFinalClick };
    }
    return null;
  };
  
  const rows = buildRows();
  const button = getButton();
  
  return React.createElement(
    "div",
    { className: "compute-panel" },
    React.createElement(
      "div",
      { className: "compute-rows-container" },
      rows.map((row, index) => renderRow(row, index))
    ),
    button && React.createElement(
      "button",
      { 
        className: "compute-action-button glow-pulse",
        onClick: button.onClick,
        dangerouslySetInnerHTML: { __html: button.text }
      },
      // button.text
    )
  );
};
