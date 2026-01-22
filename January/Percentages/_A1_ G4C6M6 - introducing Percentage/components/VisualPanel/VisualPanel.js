const VisualPanel = ({
  step,
  subStep,
  showBigSquare,
  showGrid,
  gridBlinking,
  selectedSquareIndex,  // Now passed from parent
  sliderH,
  sliderV,
  showSliderH,
  showSliderV,
  disableSliderH,
  disableSliderV,
  onSliderChange,
  onSquareClick,
  showSliderHNudge,
  showSliderVNudge,
  showTapGifOnSquares,
}) => {
  const { useState, useEffect } = React;
  
  const handleSquareClick = (index) => {
    if (!gridBlinking) return;
    if (onSquareClick) onSquareClick(index);
  };
  
  // Render big square (step 1 phase 0) - WITHOUT button (button is now in MCQ panel)
  const renderBigSquare = () => {
    return React.createElement(
      "div",
      { className: "visual-content visual-flex-container" },
      React.createElement("div", {
        className: "big-square big-square-style",
      })
    );
  };
  
  // Calculate total filled count and last filled cell index
  const calculateFillInfo = () => {
    const fillH = sliderH || 0;
    const fillV = sliderV || 0;
    const totalFilled = fillH * 10 + fillV;
    
    // Find the index of the last filled cell
    // Grid fills column by column (left to right), then within column from bottom to top
    // Last filled cell: if fillV > 0, it's in column fillH at row (10 - fillV)
    // If fillV == 0 and fillH > 0, it's the last cell of the previous column (fillH-1), row 0
    let lastFilledIndex = -1;
    if (totalFilled > 0) {
      if (fillV > 0) {
        // Last filled is in column fillH, row (10 - fillV)
        lastFilledIndex = fillH * 10 + (10 - fillV);
      } else if (fillH > 0) {
        // Last filled is in column (fillH - 1), row 0 (bottom of the column)
        lastFilledIndex = (fillH - 1) * 10 + 0;
      }
    }
    
    return { totalFilled, lastFilledIndex };
  };
  
  // Render hundredths grid
  const renderGrid = () => {
    const squares = [];
    const fillH = sliderH || 0;
    const fillV = sliderV || 0;
    const { totalFilled, lastFilledIndex } = calculateFillInfo();
    
    for (let c = 0; c < 10; c++) {
      for (let r = 0; r < 10; r++) {
        const index = c * 10 + r;
        let filled = false;
        let isHorizontalFill = false;
        let isVerticalFill = false;
        let showLabel = false;
        let labelText = "";
        
        // Normal fill logic based on sliders
        if (c < fillH) {
          filled = true;
          isHorizontalFill = true;
        }
        if (c === fillH && r >= 10 - fillV) {
          filled = true;
          isVerticalFill = true;
        }
        
        // Special case: single selected square in step 1 after click
        if (step === 1 && selectedSquareIndex !== null && !gridBlinking) {
          filled = index === selectedSquareIndex;
          isVerticalFill = false;
          isHorizontalFill = false;
          
          // Show "1 Percent" label in the clicked cell
          if (index === selectedSquareIndex) {
            showLabel = true;
            labelText = "1 " + APP_DATA.labels.percent;
          }
        }
        
        // For steps 2, 3, 4: Show count in the last filled cell
        if (step >= 2 && step <= 4 && totalFilled > 0 && index === lastFilledIndex) {
          showLabel = true;
          labelText = String(totalFilled);
        }
        
        // Determine color
        let bgColor = "rgba(33, 150, 243, 1)"; // Default blue
        if (filled) {
          if (isVerticalFill) {
            bgColor = "#2196f3"; // Pink for vertical
          } else if (isHorizontalFill) {
            bgColor = "#2196f3"; // Blue for horizontal
          } else {
            bgColor = "#2196f3"; // Blue for single selected
          }
        }
        
        // Apply opacity: 
        // When grid is blinking (step 1 phase 1, before click), all squares are full opacity
        // When a square is clicked in step 1, only the selected square is filled (opacity 1), others are 0.2
        // Otherwise, filled squares are full opacity, others are reduced
        let opacity;
        if (gridBlinking && selectedSquareIndex === null) {
          // Grid is blinking - all squares at full opacity
          opacity = 1;
        } else {
          // Normal behavior: filled squares full opacity, others reduced
          opacity = filled ? 1 : 0.2;
        }
        
        const style = {
          opacity: opacity,
          backgroundColor: bgColor,
          cursor: gridBlinking ? "pointer" : "default",
        };
        
        squares.push(
          React.createElement(
            "div",
            {
              key: `${c}-${r}`,
              className: `hundredth-square ${filled ? "filled" : ""}`,
              style: style,
              onClick: () => handleSquareClick(index),
            },
            // Add label text inside the cell if needed
            showLabel && React.createElement(
              "span",
              { className: "cell-label " + (step === 1 ? "cell-label1":"") },
              labelText
            ),
            // Show tap.gif on one square in the middle of the grid (step 1 phase 1)
            // Middle position: column 5, row 5 (index 55)
            showTapGifOnSquares && gridBlinking && index === 55 && React.createElement(
              "img",
              {
                src: "assets/tap.gif",
                className: "nudge-gif nudge-tap-square",
              }
            )
          )
        );
      }
    }
    
    // Add grid-blinking class when blinking and no square is selected yet
    // Add interactive class to grid when blinking (clickable)
    const shouldBlinkGrid = gridBlinking && selectedSquareIndex === null;
    const gridClass = `hundredth-grid ${shouldBlinkGrid ? "grid-blinking" : ""} ${gridBlinking ? "interactive" : ""}`;
    return React.createElement("div", { className: gridClass }, squares);
  };
  
  // Render sliders
  const renderSliders = () => {
    return React.createElement(
      React.Fragment,
      null,
      showSliderH &&
        React.createElement(
          "div",
          { className: "slider-container-horizontal" },
          React.createElement("input", {
            type: "range",
            min: "0",
            max: "10",
            value: sliderH,
            disabled: disableSliderH,
            onChange: (e) => onSliderChange(e, "h"),
            className: "horizontal-slider",
          }),
          showSliderHNudge &&
            React.createElement("img", {
              src: "assets/horizontalDrag.gif",
              className: "nudge-gif nudge-h-drag",
            })
        ),
      showSliderV &&
        React.createElement(
          "div",
          { className: "slider-container-vertical" },
          React.createElement("input", {
            type: "range",
            min: "0",
            max: "10",
            value: sliderV,
            disabled: disableSliderV,
            onChange: (e) => onSliderChange(e, "v"),
            className: "vertical-slider",
          }),
          showSliderVNudge &&
            React.createElement("img", {
              src: "assets/verticalDrag.gif",
              className: "nudge-gif nudge-v-drag",
            })
        )
    );
  };
  
  // Main render logic
  if (showBigSquare && !showGrid) {
    return renderBigSquare();
  }
  
  return React.createElement(
    "div",
    { className: "visual-content visual-flex-center" },
    React.createElement(
      "div",
      { className: "grid-wrapper visual-grid-wrapper" },
      renderGrid(),
      renderSliders()
    )
  );
};
