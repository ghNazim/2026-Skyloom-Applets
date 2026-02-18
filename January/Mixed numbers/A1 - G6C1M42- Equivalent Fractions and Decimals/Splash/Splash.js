/**
 * Splash Component
 * Used for steps 11-12 (Type 1) and steps 14-15 (Type 2)
 */

// Digit Box Component for equation display
const DigitBox = ({ digit, isHighlighted, isDecimalDigit }) => {
  const boxClass = `splash-digit-box ${isHighlighted ? 'highlighted' : ''} ${isDecimalDigit ? 'decimal-digit' : ''}`;
  return React.createElement(
    "div",
    { className: boxClass },
    digit
  );
};

// Decimal Point Component
const DecimalPoint = () => {
  if (current_language === "id") {
    return React.createElement("img", { 
      src: "assets/pinkComma.svg", 
      alt: ",", 
      className: "splash-decimal-point decimal-comma",
      style: { width: "2vw", height: "2vw" }
    });
  }
  return React.createElement("div", { className: "splash-decimal-point" });
};

// Fraction Component
const SplashFraction = ({ numerator, denominator, pulsateZeros, className }) => {
  const denStr = String(denominator);
  const denElements = [];
  
  for (let i = 0; i < denStr.length; i++) {
    const char = denStr[i];
    if (char === '0' && pulsateZeros) {
      denElements.push(
        React.createElement("span", { 
          key: i, 
          className: "pulsate-zero",
          style: { color: '#ffd54f' }
        }, char)
      );
    } else {
      denElements.push(
        React.createElement("span", { key: i }, char)
      );
    }
  }
  
  return React.createElement(
    "div",
    { className: `splash-fraction ${className || ''}` },
    React.createElement("div", { className: "splash-frac-num" }, numerator),
    React.createElement("div", { className: "splash-frac-line" }),
    React.createElement("div", { className: "splash-frac-den" }, denElements)
  );
};

// Single U-shaped bracket SVG (wraps one digit box from below)
const BracketUnderDigit = () =>
  React.createElement(
    "svg",
    {
      className: "bracket-svg",
      viewBox: "0 0 100 25",
      preserveAspectRatio: "none"
    },
    React.createElement("path", {
      d: "M 2 2 L 2 20 L 98 20 L 98 2",
      fill: "none",
      stroke: "yellow",
      strokeWidth: "4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  );

// Type 1 Equation Row (for steps 11-12)
const Type1EquationRow = ({ digits, decimalPosition, numerator, denominator, pulsateZeros, bracketCount }) => {
  const elements = [];
  
  // Which digit indices get a bracket: first bracketCount digits after decimal (indices decimalPosition .. decimalPosition+bracketCount-1)
  const hasBracket = (index) =>
    bracketCount > 0 &&
    index >= decimalPosition &&
    index < decimalPosition + bracketCount;
  const bracketLabel = (index) => index - decimalPosition + 1;

  // Build digit boxes with decimal point; one bracket per digit box where needed
  digits.forEach((digit, index) => {
    if (index === decimalPosition) {
      elements.push(
        React.createElement(
          "div",
          { key: `dec-${index}`, className: "splash-decimal-point-wrap" },
          React.createElement(DecimalPoint, {})
        )
      );
    }
    const isDecimalDigit = index >= decimalPosition;
    const isHighlighted = digit !== '0' && isDecimalDigit;
    const showBracket = hasBracket(index);

    const slotContent = [
      React.createElement(DigitBox, {
        key: "box",
        digit,
        isHighlighted,
        isDecimalDigit
      })
    ];
    if (showBracket) {
      slotContent.push(
        React.createElement(
          "div",
          { key: "bracket", className: "bracket-container" },
          React.createElement(BracketUnderDigit),
          React.createElement("div", { className: "bracket-numbers" },
            React.createElement("span", { className: "bracket-num" }, bracketLabel(index))
          )
        )
      );
    }

    elements.push(
      React.createElement(
        "div",
        { key: `digit-${index}`, className: "digit-slot" },
        slotContent
      )
    );
  });

  return React.createElement(
    "div",
    { className: "splash-equation-row" },
    React.createElement("div", { className: "splash-digits-container" }, elements),
    React.createElement("span", { className: "splash-equals" }, "="),
    React.createElement(SplashFraction, { numerator, denominator, pulsateZeros })
  );
};

// Type 2 Equation Row (for steps 14-15) - Fraction to Decimal with arrows
const Type2EquationRow = ({ 
  numerator, 
  denominator, 
  decimalDisplay,
  arrowCount,
  feedbackText,
  numeratorLabel,
  denominatorLabel
}) => {
  const { useState, useEffect, useRef } = React;
  
  // Refs for positions
  const containerRef = useRef(null);
  const dotRefs = useRef([]);
  const numeratorRef = useRef(null);
  const denominatorRef = useRef(null);
  const digitThreeRef = useRef(null);
  const arrowLabelRefs = useRef([]); // To store positions of arrow labels
  
  // State for arrow positions
  const [arrowsData, setArrowsData] = useState([]);
  const [straightArrowsData, setStraightArrowsData] = useState(null);
  
  // Calculate arrow positions after render
  useEffect(() => {
    const calculateArrows = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const vwInPx = window.innerWidth / 100;
      
      // Get positions of all dots
      const dotPositions = [];
      dotRefs.current.forEach((dotEl, index) => {
        if (dotEl) {
          const rect = dotEl.getBoundingClientRect();
          dotPositions.push({
            index,
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.bottom - containerRect.top // Bottom of the dot for below-curve
          });
        }
      });
      
      // Calculate curved arrows between dots (curving BELOW)
      const arrows = [];
      const numDots = dotPositions.length;
      
      for (let i = 0; i < arrowCount && i < numDots - 1; i++) {
        const startIdx = numDots - 1 - i;
        const endIdx = startIdx - 1;
        
        const startDot = dotPositions[startIdx];
        const endDot = dotPositions[endIdx];
        
        if (startDot && endDot) {
          arrows.push({
            startX: startDot.x,
            startY: startDot.y + 0.5 * vwInPx, // Below the dot
            endX: endDot.x,
            endY: endDot.y + 0.5 * vwInPx,
            label: String(i + 1),
            id: `decimal-arrow-${i}`
          });
        }
      }
      
      setArrowsData(arrows);
      
      // Calculate straight arrows
      if (numeratorRef.current && digitThreeRef.current && denominatorRef.current) {
        const numRect = numeratorRef.current.getBoundingClientRect();
        const threeRect = digitThreeRef.current.getBoundingClientRect();
        const denRect = denominatorRef.current.getBoundingClientRect();
        
        // Find the last arrow label position (for denominator arrow target)
        // The last arrow is the one with the highest label number
        const lastArrowIndex = arrowCount - 1;
        let lastArrowLabelPos = null;
        
        if (arrows.length > 0) {
          const lastArrow = arrows[lastArrowIndex];
          if (lastArrow) {
            // Label is at the center bottom of the curve
            lastArrowLabelPos = {
              x: (lastArrow.startX + lastArrow.endX) / 2,
              y: Math.max(lastArrow.startY, lastArrow.endY) + 3.5 * vwInPx // Below curve peak + label offset
            };
          }
        }
        
        setStraightArrowsData({
          numerator: {
            // Start from top middle of numerator
            startX: numRect.left + numRect.width / 2 - containerRect.left,
            startY: numRect.top - containerRect.top,
            endX: threeRect.left + threeRect.width / 2 - containerRect.left,
            endY: threeRect.top - containerRect.top - 0.5 * vwInPx
          },
          denominator: lastArrowLabelPos ? {
            // Start from bottom middle of denominator
            startX: denRect.left + denRect.width / 2 - containerRect.left,
            startY: denRect.bottom - containerRect.top,
            endX: lastArrowLabelPos.x - 1.5 * vwInPx,
            endY: lastArrowLabelPos.y
          } : null
        });
      }
    };
    
    // Delay to ensure DOM is rendered
    const timer = setTimeout(calculateArrows, 200);
    window.addEventListener('resize', calculateArrows);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateArrows);
    };
  }, [arrowCount, decimalDisplay]);
  
  // Render curved arrow SVG (curving BELOW)
  const renderCurvedArrow = (arrowData, index) => {
    if (!arrowData) return null;
    
    const { startX, startY, endX, endY, label } = arrowData;
    const vwInPx = window.innerWidth / 100;
    const curveHeight = 3 * vwInPx;
    
    // Control point BELOW the line (curve downward)
    const controlX = (startX + endX) / 2;
    const controlY = Math.max(startY, endY) + curveHeight;
    
    // Calculate SVG bounds
    const padding = 2 * vwInPx;
    const minX = Math.min(startX, endX, controlX) - padding;
    const minY = Math.min(startY, endY) - padding;
    const maxX = Math.max(startX, endX, controlX) + padding;
    const maxY = controlY + padding + 2 * vwInPx; // Extra space for label
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;
    
    // Translate to SVG coordinates
    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX;
    const svgEndY = endY - minY;
    const svgControlX = controlX - minX;
    const svgControlY = controlY - minY;
    
    // Arrow head - calculate angle at end point
    const arrowSize = 10;
    const angle = Math.atan2(svgEndY - svgControlY, svgEndX - svgControlX);
    const arrowX1 = svgEndX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = svgEndY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = svgEndX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = svgEndY - arrowSize * Math.sin(angle + Math.PI / 6);
    
    // Label position (at the bottom of curve)
    const labelX = svgControlX;
    const labelY = svgControlY + 0.5 * vwInPx;
    
    return React.createElement(
      "div",
      {
        key: `arrow-${index}`,
        className: "curved-arrow-wrapper",
        style: {
          position: "absolute",
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          pointerEvents: "none",
          zIndex: 100
        }
      },
      React.createElement(
        "svg",
        { width: svgWidth, height: svgHeight, style: { overflow: "visible" } },
        // Curved path
        React.createElement("path", {
          d: `M ${svgStartX} ${svgStartY} Q ${svgControlX} ${svgControlY} ${svgEndX} ${svgEndY}`,
          stroke: "#ffd54f",
          strokeWidth: 2.5,
          fill: "none"
        }),
        // Arrow head
        React.createElement("path", {
          d: `M ${svgEndX} ${svgEndY} L ${arrowX1} ${arrowY1} M ${svgEndX} ${svgEndY} L ${arrowX2} ${arrowY2}`,
          stroke: "#ffd54f",
          strokeWidth: 2.5,
          fill: "none"
        }),
        // Label circle
        React.createElement("circle", {
          cx: labelX,
          cy: labelY,
          r: 1 * vwInPx,
          fill: "#ffd54f"
        }),
        // Label text
        React.createElement("text", {
          x: labelX,
          y: labelY,
          fill: "#333",
          fontSize: `${1.2 * vwInPx}px`,
          fontWeight: "bold",
          textAnchor: "middle",
          dominantBaseline: "middle"
        }, label)
      )
    );
  };
  
  // Render numerator arrow (from top middle, up, right, down to "3")
  const renderNumeratorArrow = () => {
    if (!straightArrowsData || !straightArrowsData.numerator) return null;
    
    const { startX, startY, endX, endY } = straightArrowsData.numerator;
    const vwInPx = window.innerWidth / 100;
    
    // Path: go up from top of numerator, go right, go down to "3"
    const topY = startY - 2 * vwInPx;
    
    const padding = 2 * vwInPx;
    const minX = Math.min(startX, endX) - padding;
    const minY = topY - padding;
    const maxX = Math.max(startX, endX) + padding;
    const maxY = Math.max(startY, endY) + padding;
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;
    
    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX;
    const svgEndY = endY - minY + 1.4*vwInPx;
    const svgTopY = topY - minY;
    
    return React.createElement(
      "div",
      {
        className: "straight-arrow-wrapper",
        style: {
          position: "absolute",
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          pointerEvents: "none",
          zIndex: 50
        }
      },
      React.createElement(
        "svg",
        { width: svgWidth, height: svgHeight, style: { overflow: "visible" } },
        // Arrow marker definition
        React.createElement("defs", null,
          React.createElement("marker", {
            id: "arrow-num-head",
            markerWidth: "5",
            markerHeight: "6",
            refX: "0",
            refY: "3",
            orient: "auto"
          },
            React.createElement("polygon", {
              points: "0 0, 5 3, 0 6",
              fill: "white"
            })
          )
        ),
        // Path: up, right, down - solid white 2px
        React.createElement("path", {
          d: `M ${svgStartX} ${svgStartY} L ${svgStartX} ${svgTopY} L ${svgEndX} ${svgTopY} L ${svgEndX} ${svgEndY}`,
          stroke: "white",
          strokeWidth: 2,
          fill: "none",
          markerEnd: "url(#arrow-num-head)"
        })
      )
    );
  };
  
  // Render denominator arrow (from bottom, down, right, to arrow label)
  const renderDenominatorArrow = () => {
    if (!straightArrowsData || !straightArrowsData.denominator) return null;
    
    const { startX, startY, endX, endY } = straightArrowsData.denominator;
    const vwInPx = window.innerWidth / 100;
    
    // Path: go down from bottom of denominator, then go right to the label
    const bottomY = endY; // The Y level to turn at (same as target)
    
    const padding = 2 * vwInPx;
    const minX = Math.min(startX, endX) - padding;
    const minY = Math.min(startY, endY) - padding;
    const maxX = Math.max(startX, endX) + padding;
    const maxY = Math.max(startY, endY) + padding;
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;
    
    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX -8;
    const svgEndY = endY - minY;
    const svgBottomY = bottomY - minY;
    
    return React.createElement(
      "div",
      {
        className: "straight-arrow-wrapper",
        style: {
          position: "absolute",
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          pointerEvents: "none",
          zIndex: 50
        }
      },
      React.createElement(
        "svg",
        { width: svgWidth, height: svgHeight, style: { overflow: "visible" } },
        // Arrow marker definition
        React.createElement("defs", null,
          React.createElement("marker", {
            id: "arrow-den-head",
            markerWidth: "5",
            markerHeight: "6",
            refX: "0",
            refY: "3",
            orient: "auto"
          },
            React.createElement("polygon", {
              points: "0 0, 5 3, 0 6",
              fill: "#ffd54f"
            })
          )
        ),
        // Path: down, then right - solid white 2px
        React.createElement("path", {
          d: `M ${svgStartX} ${svgStartY} L ${svgStartX} ${svgBottomY} L ${svgEndX} ${svgEndY}`,
          stroke: "#ffd54f",
          strokeWidth: 2,
          fill: "none",
          markerEnd: "url(#arrow-den-head)"
        })
      )
    );
  };
  
  // Render the decimal display
  const renderDecimalDisplay = () => {
    let currentDotIndex = 0;
    
    return decimalDisplay.map((item, idx) => {
      if (item.type === 'dot') {
        const thisIndex = currentDotIndex;
        currentDotIndex++;
        if (current_language === "id") {
          return React.createElement("span", { 
            key: idx, 
            className: `type2-dot ${item.active ? 'active' : 'inactive'}`,
            ref: (el) => { dotRefs.current[thisIndex] = el; },
            style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.5vw", height: "4vw", margin: "0 0.2vw" }
          },
            React.createElement("img", {
              src: "assets/pinkComma.svg",
              alt: ",",
              style: { 
                width: "2vw", 
                height: "2vw",
                opacity: item.active ? 1 : 0.4
              },
              className: "decimal-comma"
            })
          );
        }
        return React.createElement("span", { 
          key: idx, 
          className: `type2-dot ${item.active ? 'active' : 'inactive'}`,
          ref: (el) => { dotRefs.current[thisIndex] = el; }
        });
      } else {
        const isThree = item.value === '3';
        let colorClass = 'char-grey';
        if (item.color === 'yellow') colorClass = 'char-yellow';
        else if (item.color === 'white') colorClass = 'char-white';
        
        return React.createElement("span", { 
          key: idx, 
          className: `type2-char ${colorClass}`,
          ref: isThree ? (el) => { digitThreeRef.current = el; } : null
        }, item.value);
      }
    });
  };
  
  return React.createElement(
    "div",
    { className: "splash-type2-content", ref: containerRef },
    // Left side - Equation (70%)
    React.createElement(
      "div",
      { className: "splash-type2-equation" },
      // Top annotation box
      React.createElement(
        "div",
        { className: "type2-numerator-annotation" },
        React.createElement("div", { className: "annotation-box" }, numeratorLabel)
      ),
      // Main equation row
      React.createElement(
        "div",
        { className: "type2-main-row" },
        // Fraction container
        React.createElement(
          "div",
          { className: "type2-fraction-wrapper" },
          // Fraction
          React.createElement(
            "div",
            { className: "splash-fraction type2-frac" },
            React.createElement("div", { 
              className: "splash-frac-num",
              ref: numeratorRef
            }, numerator),
            React.createElement("div", { className: "splash-frac-line" }),
            React.createElement("div", { 
              className: "splash-frac-den",
              ref: denominatorRef
            }, 
              String(denominator).split('').map((char, idx) => 
                React.createElement("span", { 
                  key: idx, 
                  className: char === '0' ? 'den-zero' : ''
                }, char)
              )
            )
          ),
          // Denominator annotation
          React.createElement(
            "div",
            { className: "type2-denominator-annotation" },
            React.createElement("div", { className: "annotation-box denom-box" }, denominatorLabel)
          )
        ),
        // Equals sign
        React.createElement("span", { className: "splash-equals type2-equals" }, "="),
        // Decimal display
        React.createElement(
          "div",
          { className: "type2-decimal-wrapper" },
          React.createElement(
            "div",
            { className: "type2-decimal-display" },
            renderDecimalDisplay()
          )
        )
      ),
      // Render curved arrows (below decimal)
      arrowsData.map((arrow, i) => renderCurvedArrow(arrow, i)),
      // Render straight arrows
      renderNumeratorArrow(),
      renderDenominatorArrow()
    ),
    // Right side - Feedback (30%)
    React.createElement(
      "div",
      { className: "splash-type2-feedback" },
      React.createElement(
        "div",
        { className: "type2-feedback-box" },
        React.createElement("p", { dangerouslySetInnerHTML: { __html: feedbackText } })
      )
    )
  );
};

// Main Splash Component
const Splash = ({ 
  heading, 
  type,
  equationData,
  feedbackText,
  buttonText, 
  onButtonClick 
}) => {
  
  if (type === 'type1') {
    return React.createElement(
      "div",
      { className: "splash-panel type1" },
      React.createElement("p", { 
        className: "splash-heading",
        dangerouslySetInnerHTML: { __html: heading }
      }),
      React.createElement(
        "div",
        { className: "splash-content-box" },
        React.createElement(Type1EquationRow, {
          digits: equationData.digits,
          decimalPosition: equationData.decimalPosition,
          numerator: equationData.numerator,
          denominator: equationData.denominator,
          pulsateZeros: equationData.pulsateZeros,
          bracketCount: equationData.bracketCount || 0
        }),
        React.createElement(
          "div",
          { className: "splash-feedback-box" },
          React.createElement("p", { 
            dangerouslySetInnerHTML: { __html: feedbackText }
          })
        )
      ),
      React.createElement(Button, {
        text: buttonText,
        onClick: onButtonClick,
        className: "splash-button"
      })
    );
  }
  
  if (type === 'type2') {
    return React.createElement(
      "div",
      { className: "splash-panel type2" },
      React.createElement("p", { 
        className: "splash-heading",
        dangerouslySetInnerHTML: { __html: heading }
      }),
      React.createElement(
        "div",
        { className: "splash-content-box type2-box" },
        React.createElement(Type2EquationRow, {
          numerator: equationData.numerator,
          denominator: equationData.denominator,
          decimalDisplay: equationData.decimalDisplay,
          arrowCount: equationData.arrowCount,
          feedbackText: feedbackText,
          numeratorLabel: equationData.numeratorLabel,
          denominatorLabel: equationData.denominatorLabel
        })
      ),
      React.createElement(Button, {
        text: buttonText,
        onClick: onButtonClick,
        className: "splash-button"
      })
    );
  }
  
  // Default fallback
  return React.createElement(
    "div",
    { className: "splash-panel" },
    React.createElement("p", { className: "splash-heading" }, heading),
    React.createElement(Button, {
      text: buttonText,
      onClick: onButtonClick,
      className: "splash-button"
    })
  );
};
