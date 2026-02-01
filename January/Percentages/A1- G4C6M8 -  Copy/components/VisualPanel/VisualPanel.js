const VisualPanel = ({ 
  filledSquares = 0, 
  glowFilledSquares = false, 
  glowAllSquares = false,
  showFilledLabel = true,
  showTotalLabel = true,
  orangeBorder = false,
  step
}) => {
  const { useState, useEffect } = React;
  const [step5State, setStep5State] = useState('idle');

  useEffect(() => {
    if (step === 5) {
        setStep5State('blinking');
        // 3 blinks * 0.5s = 1.5s
        const timer = setTimeout(() => {
            setStep5State('solid');
        }, 1500); 
        return () => clearTimeout(timer);
    } else {
        setStep5State('idle');
    }
  }, [step]);

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

      // Step 5 Animation Logic
      let step5Class = "";
      // Target: Left 2 columns (col 0, 1), filled. In Step 5, 24 squares means col 0, 1 are fully filled.
      if (step === 5 && col < 2 && isFilled) {
         if (step5State === 'blinking') {
             step5Class = " blink-column";
         } else if (step5State === 'solid') {
             // "Have a bottom outline... so column looks like one solid column"
             // "no outline for the bottom cells" -> skip row 9
             if (row !== 9) {
                 step5Class = " outline-solid";
             }
         }
      }
      
      const squareClass = `hundredth-square ${isFilled ? 'filled' : ''} ${shouldGlow ? 'glowing' : ''} ${orangeBorder && isFilled ? 'orange-bordered' : ''}${step5Class}`;
      
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
