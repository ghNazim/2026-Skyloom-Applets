const Summary = ({ question, onContinue }) => {
  const { useState, useEffect, useRef } = React;
  
  if (!question) return null;

  const q = question;
  
  // Refs for decimal points and arrows
  const cardContainerRef = useRef(null);
  const decimalContainerRef = useRef(null);
  const dotRefs = useRef([]);
  const [arrowsData, setArrowsData] = useState([]);
  // Get common text/data
  const steps = APP_DATA.summaryCardTexts || [];
  
  // Replace dynamic values in step descriptions
  const step1Text = steps[0] ? steps[0].replace("{{targetDen}}", q.targetDenominator) : "";
  const step2Text = steps[1] || "";

  // Helper for subheading
  const subheading = APP_DATA.summarySubheading 
    ? APP_DATA.summarySubheading.replace("{{targetDen}}", q.targetDenominator) 
    : "";

  // The operation symbol (x or ÷)
  const opSymbol = q.operationSymbol; 
  // Wait, the images show 'x'. For division questions (30/60 -> 5/10), it will use '÷'. 
  // My previous code handled this via q.operationSymbol.

  // Render Functions

  // 1. Initial Fraction (Card 1)
  const renderCard1 = () => {
    return React.createElement(
      "div",
      { className: "summary-card" },
      React.createElement(
        "div",
        { className: "summary-fraction" },
        React.createElement("div", { className: "summary-fraction-num text-white" }, q.numerator),
        React.createElement("div", { className: "summary-fraction-line" }),
        React.createElement("div", { className: "summary-fraction-den text-white" }, q.denominator)
      )
    );
  };

  // 2. Operation Step (Card 2)
  const renderCard2 = () => {
    // Left side: 2 x 2 / 5 x 2
    // Right side: = 4 / 10

    // Colors:
    // Numerator op/mult: purple
    // Denominator op/mult: orange
    // Result Numerator: purple
    // Result Denominator: orange
    
    // Note: The base number (2 and 5) seem to be white in the image for the left side
    // and the multiplier and operator are colored.
    // Let's assume:
    // Num: [2 (white)] [x 2 (purple)]
    // Den: [5 (white)] [x 2 (orange)]

    return React.createElement(
      "div",
      { className: "summary-card summary-card-wide" },
      // Left Fraction: Operation
      React.createElement(
        "div",
        { className: "summary-fraction" },
        React.createElement(
          "div",
          { className: "summary-fraction-num" },
          React.createElement("span", { className: "text-white" }, q.numerator),
          React.createElement("span", { className: "text-purple" }, opSymbol + q.multiplier)
        ),
        React.createElement("div", { className: "summary-fraction-line" }),
        React.createElement(
          "div",
          { className: "summary-fraction-den" },
          React.createElement("span", { className: "text-white" }, q.denominator),
          React.createElement("span", { className: "text-orange" }, opSymbol + q.multiplier)
        )
      ),
      // Equals
      React.createElement("div", { className: "fraction-eq-sign" }, "="),
      // Right Fraction: Result
      React.createElement(
        "div",
        { className: "summary-fraction" },
        React.createElement("div", { className: "summary-fraction-num text-purple" }, q.convertedNumerator),
        React.createElement("div", { className: "summary-fraction-line" }),
        React.createElement("div", { className: "summary-fraction-den text-orange" }, q.convertedDenominator)
      )
    );
  };

  // Calculate arrow positions for decimal display
  useEffect(() => {
    const calculateArrows = () => {
      if (!cardContainerRef.current) {
        setTimeout(calculateArrows, 50);
        return;
      }
      
      // Wait for all dot refs to be set
      const allDotsReady = dotRefs.current.every((ref, idx) => {
        const expectedCount = String(q.decimalValue).split(".")[1]?.length || 0;
        return idx < expectedCount + 1; // +1 for the final dot
      });
      
      const dotElements = dotRefs.current.filter(el => el !== null && el !== undefined);
      if (dotElements.length === 0 || !allDotsReady) {
        setTimeout(calculateArrows, 50);
        return;
      }
      
      const cardRect = cardContainerRef.current.getBoundingClientRect();
      const vwInPx = window.innerWidth / 100;
      
      // Get positions of all dots relative to the card
      const dotPositions = [];
      dotRefs.current.forEach((dotEl, index) => {
        if (dotEl) {
          try {
            const rect = dotEl.getBoundingClientRect();
            dotPositions.push({
              index,
              x: rect.left + rect.width / 2 - cardRect.left,
              y: rect.bottom - cardRect.top
            });
          } catch (e) {
            console.warn('Error getting dot position:', e);
          }
        }
      });
      
      // Calculate curved arrows between dots (from rightmost to leftmost)
      const arrows = [];
      const numDots = dotPositions.length;
      const decimalDigits = String(q.decimalValue).split(".")[1] || "";
      const arrowCount = decimalDigits.length; // 1 or 2
      
      // Arrows go from last dot to first dot
      // For 1 digit: arrow from dot[1] to dot[0] with label "1"
      // For 2 digits: arrow from dot[2] to dot[1] with label "1", arrow from dot[1] to dot[0] with label "2"
      for (let i = 0; i < arrowCount && i < numDots - 1; i++) {
        const startIdx = numDots - 1 - i; // Start from rightmost
        const endIdx = startIdx - 1; // End at next dot to the left
        
        const startDot = dotPositions[startIdx];
        const endDot = dotPositions[endIdx];
        
        if (startDot && endDot && startDot.x && endDot.x) {
          arrows.push({
            startX: startDot.x,
            startY: startDot.y + 0.2 * vwInPx, // Moved up - reduced from 0.5
            endX: endDot.x,
            endY: endDot.y + 0.2 * vwInPx, // Moved up - reduced from 0.5
            label: String(i + 1), // Label: 1, 2, etc.
            id: `summary-arrow-${i}`
          });
        }
      }
      
      if (arrows.length > 0) {
        setArrowsData(arrows);
      }
    };
    
    // Clear previous refs when question changes
    dotRefs.current = [];
    setArrowsData([]);
    
    // Delay to ensure DOM is rendered
    const timer = setTimeout(calculateArrows, 100);
    const timer2 = setTimeout(calculateArrows, 300); // Second attempt
    window.addEventListener('resize', calculateArrows);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener('resize', calculateArrows);
    };
  }, [q.decimalValue]);

  // Render curved arrow SVG - rebuilt from scratch
  const renderCurvedArrow = (arrowData, index) => {
    if (!arrowData || arrowData.startX === undefined || arrowData.endX === undefined) {
      return null;
    }
    
    const { startX, startY, endX, endY, label } = arrowData;
    const vwInPx = window.innerWidth / 100;
    const curveHeight = 2.5 * vwInPx; // Reduced curve height to bring arrow up
    
    // Control point for the quadratic curve (below the line, creating downward curve)
    const controlX = (startX + endX) / 2;
    const controlY = Math.max(startY, endY) + curveHeight;
    
    // Calculate bounding box with padding
    const padding = 2 * vwInPx;
    const minX = Math.min(startX, endX, controlX) - padding;
    const minY = Math.min(startY, endY) - padding;
    const maxX = Math.max(startX, endX, controlX) + padding;
    const maxY = controlY + padding + 2 * vwInPx; // Reduced extra space for label
    
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;
    
    // Convert to SVG coordinate system
    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX;
    const svgEndY = endY - minY;
    const svgControlX = controlX - minX;
    const svgControlY = controlY - minY;
    
    // Calculate arrowhead at the end point
    const arrowSize = 16; // Increased arrowhead size
    // Direction from control point to end point
    const dx = svgEndX - svgControlX;
    const dy = svgEndY - svgControlY;
    const angle = Math.atan2(dy, dx);
    
    const arrowX1 = svgEndX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = svgEndY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = svgEndX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = svgEndY - arrowSize * Math.sin(angle + Math.PI / 6);
    
    // Label position at the bottom of the curve - moved closer
    const labelX = svgControlX;
    const labelY = svgControlY + 0.3 * vwInPx; // Moved closer - reduced from 1 * vwInPx
    const labelRadius = 1.2 * vwInPx;
    
    return React.createElement(
      "div",
      {
        key: `arrow-${index}-${arrowData.id || index}`,
        className: "summary-curved-arrow-wrapper",
        style: {
          position: "absolute",
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          pointerEvents: "none",
          zIndex: 1000,
          overflow: "visible"
        }
      },
      React.createElement(
        "svg",
        { 
          width: svgWidth, 
          height: svgHeight, 
          style: { 
            overflow: "visible",
            position: "absolute",
            top: 0,
            left: 0
          } 
        },
        // Curved arrow path (quadratic bezier)
        React.createElement("path", {
          d: `M ${svgStartX} ${svgStartY} Q ${svgControlX} ${svgControlY} ${svgEndX} ${svgEndY}`,
          stroke: "#ffd54f",
          strokeWidth: 2.5,
          fill: "none",
          strokeLinecap: "round"
        }),
        // Arrowhead
        React.createElement("path", {
          d: `M ${svgEndX} ${svgEndY} L ${arrowX1} ${arrowY1} M ${svgEndX} ${svgEndY} L ${arrowX2} ${arrowY2}`,
          stroke: "#ffd54f",
          strokeWidth: 2.5,
          fill: "none",
          strokeLinecap: "round"
        }),
        // Label circle background
        React.createElement("circle", {
          cx: labelX,
          cy: labelY,
          r: labelRadius,
          fill: "#ffd54f",
          stroke: "none"
        }),
        // Label text
        React.createElement("text", {
          x: labelX,
          y: labelY,
          fill: "#1a1a2e",
          fontSize: `${1.3 * vwInPx}px`,
          fontWeight: "bold",
          textAnchor: "middle",
          dominantBaseline: "middle",
          style: { userSelect: "none" }
        }, label)
      )
    );
  };

  // 3. Final Decimal (Card 3)
  const renderCard3 = () => {
    const valStr = String(q.decimalValue);
    const parts = valStr.split(".");
    const whole = parts[0];
    const decimal = parts[1] || "";
    const decimalDigits = decimal.split("");
    
    // Determine number of decimal points needed
    // For 1 digit: 2 dots (between 0 and 4, after 4)
    // For 2 digits: 3 dots (between 0 and 3, between 3 and 2, after 2)
    const numDots = decimalDigits.length + 1;
    const activeDotIndex = 0; // Leftmost dot is always active
    
    let currentDotIndex = 0;
    
    return React.createElement(
      "div",
      { 
        className: "summary-card", 
        ref: cardContainerRef,
        style: { position: "relative", overflow: "visible", paddingBottom: "3vw" } 
      },
      React.createElement(
        "div",
        { 
          className: "summary-final-decimal",
          ref: decimalContainerRef,
          style: { position: "relative" }
        },
        // Whole number part
        React.createElement("span", { className: "text-white" }, whole),
        // Decimal points and digits
        decimalDigits.map((digit, idx) => {
          const elements = [];
          
          // Decimal point before this digit
          const dotIndex = currentDotIndex;
          currentDotIndex++;
          const isActive = dotIndex === activeDotIndex;
          
          // For Indonesian, use comma with font style; for English, use dot
          if (current_language === "id") {
            elements.push(
              React.createElement("span", {
                key: `dot-${idx}`,
                className: `summary-decimal-dot ${isActive ? 'active' : 'inactive'}`,
                ref: (el) => { 
                  if (el) {
                    dotRefs.current[dotIndex] = el;
                  }
                },
                style: {
                  fontFamily: "var(--font-family-comma, Georgia, sans-serif)",
                  fontSize: "3.5vw",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.5vw",
                  height: "4vw",
                  margin: "0 0.2vw"
                }
              }, ",")
            );
          } else {
            elements.push(
              React.createElement("span", {
                key: `dot-${idx}`,
                className: `summary-decimal-dot ${isActive ? 'active' : 'inactive'}`,
                ref: (el) => { 
                  if (el) {
                    dotRefs.current[dotIndex] = el;
                  }
                }
              })
            );
          }
          
          // Digit
          elements.push(
            React.createElement("span", {
              key: `digit-${idx}`,
              className: "text-purple"
            }, digit)
          );
          
          return elements;
        }),
        // Final decimal point after last digit
        current_language === "id"
          ? React.createElement("span", {
              key: "dot-final",
              className: `summary-decimal-dot inactive`,
              ref: (el) => { 
                if (el) {
                  dotRefs.current[currentDotIndex] = el;
                }
              },
              style: {
                fontFamily: "var(--font-family-comma, Georgia, sans-serif)",
                fontSize: "3.5vw",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.5vw",
                height: "4vw",
                margin: "0 0.2vw"
              }
            }, ",")
          : React.createElement("span", {
              key: "dot-final",
              className: `summary-decimal-dot inactive`,
              ref: (el) => { 
                if (el) {
                  dotRefs.current[currentDotIndex] = el;
                }
              }
            })
      ),
      // Render curved arrows as siblings to the decimal container
      arrowsData && arrowsData.length > 0 
        ? arrowsData.map((arrow, i) => {
            const rendered = renderCurvedArrow(arrow, i);
            return rendered;
          })
        : null
    );
  };

  // Step Bubble & Text
  const renderStepInfo = (num, text) => {
    return React.createElement(
      "div",
      { className: "summary-step-container "+"num"+num },
       React.createElement(
        "div",
        { className: "summary-step-text-box" },
        text
      ),
      React.createElement(
        "div",
        { className: "summary-step-bubble" },
        num
      )
    );
  };

  return React.createElement(
    "div",
    { className: "summary-panel" },
    React.createElement(
      "p",
      { className: "summary-subheading" , dangerouslySetInnerHTML: { __html: subheading } },

    ),
    React.createElement(
      "div",
      { className: "summary-layout" },
      // Col 1: Original
      React.createElement(
        "div",
         { className: "summary-column" },
         renderCard1()
      ),
      // Arrow
      React.createElement(
        "div",
        { className: "summary-arrow" },
        "→"
      ),
      // Col 2: Operation (Center)
      React.createElement(
        "div",
         { className: "summary-column" },
         renderCard2(),
         renderStepInfo(1, step1Text)
      ),
      // Arrow
       React.createElement(
        "div",
        { className: "summary-arrow" },
        "→"
      ),
      // Col 3: Result
      React.createElement(
         "div",
         { className: "summary-column" },
         renderCard3(),
         renderStepInfo(2, step2Text)
      )
    ),
    React.createElement(
      "button",
      {
        className: "btn fullscreen-button summary-continue-btn",
        onClick: () => {
          playSound("click");
          if (typeof onContinue === "function") onContinue();
        },
      },
      APP_DATA.summaryContinueButton
    )
  );
};
