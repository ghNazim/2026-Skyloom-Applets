const VisualPanel = ({ 
  filledSquares = 0, 
  glowFilledSquares = false, 
  glowAllSquares = false,
  showFilledLabel = true,
  showTotalLabel = true 
}) => {
  const renderGrid = () => {
    const squares = [];
    const totalSquares = 100;
    
    for (let i = 0; i < totalSquares; i++) {
      // Grid flows row by row (left to right, top to bottom)
      // Index i: col = i % 10, row = floor(i / 10)
      const col = i % 10;
      const row = Math.floor(i / 10);
      
      // Fill from bottom-left, going up (within column), then right
      // Fill position: col * 10 + (9 - row)
      // This means row 9 (bottom) in col 0 is filled first, then row 8, etc.
      const fillPosition = col * 10 + (9 - row);
      const isFilled = fillPosition < filledSquares;
      const isLastFilled = fillPosition === filledSquares - 1;
      
      // Top-right corner is col=9, row=0, which is index 9
      const isTopRight = i === 9;
      
      // Determine glow state
      let shouldGlow = false;
      if (glowAllSquares) {
        shouldGlow = true;
      } else if (glowFilledSquares && isFilled) {
        shouldGlow = true;
      }
      
      const squareClass = `hundredth-square ${isFilled ? 'filled' : ''} ${shouldGlow ? 'glowing' : ''}`;
      
      squares.push(
        React.createElement(
          "div",
          { 
            key: i, 
            className: squareClass,
          },
          // Show filled count label on last filled square
          isLastFilled && showFilledLabel && React.createElement(
            "span",
            { className: "square-label filled-label" },
            filledSquares.toString()
          ),
          // Show total count label on top right square
          isTopRight && showTotalLabel && React.createElement(
            "span",
            { className: "square-label total-label" },
            "100"
          )
        )
      );
    }
    
    return React.createElement(
      "div",
      { className: "hundredth-grid visual-grid" },
      squares
    );
  };

  return React.createElement(
    "div",
    { className: "visual-panel" },
    React.createElement(
      "div",
      { className: "visual-content visual-flex-center" },
      React.createElement(
        "div",
        { className: "grid-wrapper visual-grid-wrapper" },
        renderGrid()
      )
    )
  );
};
