/**
 * DndQuestion Component
 * Tap-to-place decimal point: tap an inactive slot and a copy of the decimal flies in an arc to fill it.
 */

const DndQuestion = ({
  questionData,
  questionIndex,
  totalQuestions,
  onCorrectAnswer,
  onNextQuestion,
  feedbacks,
  navText,
  navTextAfterCorrect,
  navTextComplete,
  checkButton = "Check",
  places = { one: "one", two: "two" },
  onUpdateNav
}) => {
  const { useState, useEffect, useRef } = React;
  
  const { num, den, rightNum } = questionData;
  
  // Active decimal position: 0 = left, 1 = middle, 2 = right (initial)
  const [activePosition, setActivePosition] = useState(2);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showArrows, setShowArrows] = useState(false);
  const [arrowsData, setArrowsData] = useState([]);
  const [hideArrowsAndPlaceholders, setHideArrowsAndPlaceholders] = useState(false);
  // Flying clone: when user taps an inactive slot, a clone flies in an arc to that slot
  const [flyingToPosition, setFlyingToPosition] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for decimal positions and flying clone
  const decimalRefs = useRef([null, null, null]);
  const activeDotRef = useRef(null);
  const containerRef = useRef(null);
  const equationRef = useRef(null);
  const flyingCloneRef = useRef(null);
  
  // Digits from rightNum: "0080" => ['0', '0', '8', '0']
  const digits = rightNum.split('');
  
  // Correct position based on denominator
  // den = 10 -> middle (1), den = 100 -> left (0)
  const correctPosition = den === 10 ? 1 : 0;
  
  // Starting position is always 2 (rightmost)
  const startPosition = 2;
  
  // Get decimal result string based on position (formatted nicely)
  const getDecimalResult = (pos) => {
    if (pos === 0) {
      const intPart = digits[0];
      const decPart = digits[1] + digits[2];
      const cleanDecPart = decPart.replace(/0+$/, '') || '0';
      return `${intPart}.${cleanDecPart}`;
    } else if (pos === 1) {
      const intPart = parseInt(digits[0] + digits[1], 10);
      const decPart = digits[2];
      return `${intPart}.${decPart}`;
    } else {
      const intPart = parseInt(digits[0] + digits[1] + digits[2], 10);
      return `${intPart}.${digits[3]}`;
    }
  };
  
  // Get which digits should be visible when cleaning up display
  const getVisibleDigits = () => {
    if (!hideArrowsAndPlaceholders) {
      // Show all digits normally
      return { showDigit: [true, true, true, true], decimalPosition: activePosition };
    }
    
    // Determine which digit indices are before and after decimal based on activePosition
    let beforeDecimalIndices = [];
    let afterDecimalIndices = [];
    
    if (activePosition === 0) {
      // Format: d[0] . d[1] d[2] d[3]
      beforeDecimalIndices = [0];
      afterDecimalIndices = [1, 2, 3];
    } else if (activePosition === 1) {
      // Format: d[0] d[1] . d[2] d[3]
      beforeDecimalIndices = [0, 1];
      afterDecimalIndices = [2, 3];
    } else {
      // Format: d[0] d[1] d[2] . d[3]
      beforeDecimalIndices = [0, 1, 2];
      afterDecimalIndices = [3];
    }
    
    // Remove trailing zeros from after decimal (remove from right)
    const cleanedAfterIndices = [...afterDecimalIndices];
    while (cleanedAfterIndices.length > 0 && digits[cleanedAfterIndices[cleanedAfterIndices.length - 1]] === '0') {
      cleanedAfterIndices.pop();
    }
    
    // Remove leading zeros from before decimal (remove from left)
    // But if all digits before decimal are zero, keep one 0 (the leftmost one)
    const hasNonZeroBeforeDecimal = beforeDecimalIndices.some(i => digits[i] !== '0');
    const cleanedBeforeIndices = [...beforeDecimalIndices];
    if (hasNonZeroBeforeDecimal) {
      // Remove all leading zeros
      while (cleanedBeforeIndices.length > 1 && digits[cleanedBeforeIndices[0]] === '0') {
        cleanedBeforeIndices.shift();
      }
    } else {
      // All zeros before decimal, keep the leftmost one (first index)
      cleanedBeforeIndices.splice(1);
    }
    
    // Build the showDigit array
    const showDigit = [false, false, false, false];
    cleanedBeforeIndices.forEach(idx => { showDigit[idx] = true; });
    cleanedAfterIndices.forEach(idx => { showDigit[idx] = true; });
    
    return { showDigit, decimalPosition: activePosition };
  };
  
  // Reset state when question changes (only depends on questionIndex)
  useEffect(() => {
    setActivePosition(2);
    setIsChecked(false);
    setIsCorrect(false);
    setFeedbackText("");
    setShowArrows(false);
    setArrowsData([]);
    setHideArrowsAndPlaceholders(false);
    setFlyingToPosition(null);
    setIsAnimating(false);
    if (onUpdateNav) {
      onUpdateNav(navText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex]);
  
  // Calculate curved arrows between decimal positions
  const calculateArrows = () => {
    if (!equationRef.current) return;
    
    const containerRect = equationRef.current.getBoundingClientRect();
    const vwInPx = window.innerWidth / 100;
    
    // Get positions of all decimal slots
    const dotPositions = [];
    decimalRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        dotPositions.push({
          index,
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.bottom - containerRect.top + 0.5 * vwInPx
        });
      }
    });
    
    // Calculate arrows from start position to current position
    const arrows = [];
    const moveCount = startPosition - activePosition;
    
    for (let i = 0; i < moveCount; i++) {
      const startIdx = startPosition - i;
      const endIdx = startIdx - 1;
      
      const startDot = dotPositions[startIdx];
      const endDot = dotPositions[endIdx];
      
      if (startDot && endDot) {
        arrows.push({
          startX: startDot.x,
          startY: startDot.y,
          endX: endDot.x,
          endY: endDot.y,
          label: String(i + 1),
          id: `arrow-${i}`
        });
      }
    }
    
    setArrowsData(arrows);
  };
  
  // Handle check button click
  const handleCheck = () => {
    if (isChecked && isCorrect) return;
    
    const correct = activePosition === correctPosition;
    setIsChecked(true);
    setIsCorrect(correct);
    setShowArrows(true);
    
    // Calculate arrows for visual feedback
    setTimeout(calculateArrows, 50);
    
    if (correct) {
      playSound("correct");
      const placesText = den === 10 ? places.one : places.two;
      const result = getDecimalResult(correctPosition);
      let correctFeedback = feedbacks.correct
        .replace("{places}", placesText)
        .replace("{result}", result);
      setFeedbackText(correctFeedback);
      
      const isLastQuestion = questionIndex >= totalQuestions - 1;
      if (onUpdateNav) {
        onUpdateNav(isLastQuestion ? navTextComplete : navTextAfterCorrect);
      }
      
      // After 1 second, hide arrows and placeholder decimal points (show cleaned result)
      // Only enable next button after the result is shown
      setTimeout(() => {
        setHideArrowsAndPlaceholders(true);
        setShowArrows(false);
        setArrowsData([]);
        // Enable next button only after the result is displayed
        if (onCorrectAnswer) {
          onCorrectAnswer();
        }
      }, 1000);
    } else {
      playSound("wrong");
      setFeedbackText(feedbacks.wrong);
    }
  };
  
  // Tap on an inactive decimal slot: fly a clone in an arc to that slot, then make it active
  const handleSlotTap = (targetIndex) => {
    if (isChecked && isCorrect) return;
    if (isAnimating) return;
    if (activePosition === targetIndex) return;
    setIsAnimating(true);
    setFlyingToPosition(targetIndex);
    if (isChecked && !isCorrect) {
      setIsChecked(false);
      setFeedbackText("");
      setShowArrows(false);
      setArrowsData([]);
    }
  };

  // Arc animation: flying clone from active slot to clicked slot (decimal "leaves" old slot and moves to new one)
  useEffect(() => {
    if (flyingToPosition == null || !equationRef.current || !flyingCloneRef.current || !window.gsap) {
      return;
    }
    const gsap = window.gsap;
    const cloneEl = flyingCloneRef.current;
    const equationEl = equationRef.current;
    const containerRect = equationEl.getBoundingClientRect();
    const vwInPx = window.innerWidth / 100;

    // Start from the currently active slot (decimal "leaves" from there)
    const fromSlot = decimalRefs.current[activePosition];
    const targetSlot = decimalRefs.current[flyingToPosition];
    if (!fromSlot || !targetSlot) {
      setActivePosition(flyingToPosition);
      setFlyingToPosition(null);
      setIsAnimating(false);
      playSound("tick");
      return;
    }

    const fromRect = fromSlot.getBoundingClientRect();
    const startX = fromRect.left - containerRect.left + fromRect.width / 2;
    const startY = fromRect.bottom - containerRect.top - 1.2 * vwInPx;

    const toRect = targetSlot.getBoundingClientRect();
    const endX = toRect.left - containerRect.left + toRect.width / 2;
    const endY = toRect.bottom - containerRect.top - 1.2 * vwInPx;

    gsap.set(cloneEl, { x: startX, y: startY, opacity: 1 });
    const duration = 0.4;
    const easeOut = "power1.out";
    const easeIn = "power1.in";
    const arcPeak = 2.5 * vwInPx;
    const midX = (startX + endX) / 2;
    const midY = Math.max(startY, endY) + arcPeak;

    const tl = gsap.timeline({
      onComplete: () => {
        setActivePosition(flyingToPosition);
        setFlyingToPosition(null);
        setIsAnimating(false);
        playSound("tick");
      }
    });
    tl.to(cloneEl, {
      x: midX,
      y: midY,
      duration: duration / 2,
      ease: easeOut
    }).to(cloneEl, {
      x: endX,
      y: endY,
      duration: duration / 2,
      ease: easeIn
    });
  }, [flyingToPosition, activePosition]);
  
  // Render curved arrow SVG
  const renderCurvedArrow = (arrowData, index) => {
    if (!arrowData || !equationRef.current) return null;
    
    const { startX, startY, endX, endY, label } = arrowData;
    const vwInPx = window.innerWidth / 100;
    const curveHeight = 2.5 * vwInPx;
    
    // Control point BELOW the line (curve downward)
    const controlX = (startX + endX) / 2;
    const controlY = Math.max(startY, endY) + curveHeight;
    
    // Calculate SVG bounds
    const padding = 2 * vwInPx;
    const minX = Math.min(startX, endX, controlX) - padding;
    const minY = Math.min(startY, endY) - padding;
    const maxX = Math.max(startX, endX, controlX) + padding;
    const maxY = controlY + padding + 2 * vwInPx;
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;
    
    // Translate to SVG coordinates
    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX;
    const svgEndY = endY - minY;
    const svgControlX = controlX - minX;
    const svgControlY = controlY - minY;
    
    // Arrow head
    const arrowSize = 8;
    const angle = Math.atan2(svgEndY - svgControlY, svgEndX - svgControlX);
    const arrowX1 = svgEndX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = svgEndY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = svgEndX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = svgEndY - arrowSize * Math.sin(angle + Math.PI / 6);
    
    // Label position
    const labelX = svgControlX;
    const labelY = svgControlY + 0.5 * vwInPx;
    
    // Arrow color based on correct/wrong
    const arrowColor = isCorrect ? "#4caf50" : "#f44336";
    
    return React.createElement(
      "div",
      {
        key: `arrow-${index}`,
        className: "dnd-curved-arrow-wrapper",
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
          stroke: arrowColor,
          strokeWidth: 2.5,
          fill: "none"
        }),
        // Arrow head
        React.createElement("path", {
          d: `M ${svgEndX} ${svgEndY} L ${arrowX1} ${arrowY1} M ${svgEndX} ${svgEndY} L ${arrowX2} ${arrowY2}`,
          stroke: arrowColor,
          strokeWidth: 2.5,
          fill: "none"
        }),
        // Label circle
        React.createElement("circle", {
          cx: labelX,
          cy: labelY,
          r: 1 * vwInPx,
          fill: arrowColor
        }),
        // Label text
        React.createElement("text", {
          x: labelX,
          y: labelY,
          fill: "white",
          fontSize: `${1.2 * vwInPx}px`,
          fontWeight: "bold",
          textAnchor: "middle",
          dominantBaseline: "middle"
        }, label)
      )
    );
  };
  
  // Render decimal display with draggable dot
  const renderDecimalDisplay = () => {
    const elements = [];
    const { showDigit } = getVisibleDigits();
    
    for (let i = 0; i < 4; i++) {
      // Digit - hide if not in showDigit array when cleaning up
      const shouldShowDigit = !hideArrowsAndPlaceholders || showDigit[i];
      elements.push(
        React.createElement("span", {
          key: `digit-${i}`,
          className: "dnd-digit white",
          style: shouldShowDigit ? {} : { display: 'none' }
        }, digits[i])
      );
      
      // Decimal placeholder (after first 3 digits)
      if (i < 3) {
        // Show dot only when this slot is active AND we're not flying (so it feels like the dot left and is moving)
        const isActive = activePosition === i && flyingToPosition == null;
        
        // Hide placeholder decimals when hideArrowsAndPlaceholders is true
        if (hideArrowsAndPlaceholders && !isActive) {
          // Still create the slot for ref purposes, but make it invisible
          elements.push(
            React.createElement("span", {
              key: `decimal-${i}`,
              className: "dnd-decimal-slot",
              ref: (el) => { decimalRefs.current[i] = el; },
              style: { display: 'none' }
            })
          );
        } else {
          let slotClass = "dnd-decimal-slot";
          if (isActive) {
            slotClass += " active";
          } else {
            slotClass += " placeholder";
          }
          
          elements.push(
            React.createElement("span", {
              key: `decimal-${i}`,
              className: slotClass,
              ref: (el) => { decimalRefs.current[i] = el; },
              onClick: () => handleSlotTap(i)
            },
              isActive && (current_language === "id"
                ? React.createElement("img", {
                    src: "assets/pinkComma.svg",
                    alt: ",",
                    className: "dnd-decimal-dot decimal-comma",
                    ref: activeDotRef,
                    style: { 
                      width: "1.2vw", 
                      height: "1.2vw",
                      transition: "transform 0.1s ease, opacity 0.1s ease",
                      zIndex: 10
                    }
                  })
                : React.createElement("span", {
                    className: "dnd-decimal-dot",
                    ref: activeDotRef
                  }))
            )
          );
        }
      }
    }
    
    return elements;
  };
  
  // Render denominator with colored zeros when checked
  const renderDenominator = () => {
    const denStr = String(den);
    return denStr.split('').map((char, idx) => {
      const isZero = char === '0';
      const shouldHighlight = isChecked && isZero;
      return React.createElement("span", {
        key: idx,
        className: shouldHighlight ? "dnd-den-zero-highlight" : ""
      }, char);
    });
  };
  
  // Determine feedback visibility
  const showFeedback = isChecked && feedbackText;
  
  return React.createElement(
    "div",
    { className: "dnd-question-container", ref: containerRef },
    
    // Left Column (75%)
    React.createElement(
      "div",
      { className: "dnd-left-column" },
      
      // Equation row with relative positioning for arrows and flying clone
      React.createElement(
        "div",
        { className: "dnd-equation-row", ref: equationRef },
        // Flying clone: decimal dot that arcs from below to the tapped slot
        flyingToPosition != null && React.createElement(
          "div",
          {
            ref: flyingCloneRef,
            className: "dnd-flying-clone",
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              pointerEvents: "none",
              zIndex: 150,
              opacity: 0
            }
          },
          current_language === "id"
            ? React.createElement("img", {
                src: "assets/pinkComma.svg",
                alt: "",
                className: "dnd-decimal-dot decimal-comma dnd-flying-clone-dot",
                style: {
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "1.2vw",
                  height: "1.2vw"
                }
              })
            : React.createElement("span", {
                className: "dnd-decimal-dot dnd-flying-clone-dot",
                style: {
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)"
                }
              })
        ),
        // Boxed fraction
        React.createElement(
          "div",
          { className: "dnd-fraction-box" },
          React.createElement(
            "div",
            { className: "dnd-fraction" },
            React.createElement("div", { className: "dnd-frac-num" }, num),
            React.createElement("div", { className: "dnd-frac-line" }),
            React.createElement("div", { className: "dnd-frac-den" }, renderDenominator())
          )
        ),
        
        // Equals sign
        React.createElement("span", { className: "dnd-equals" }, "="),
        
        // Decimal display with draggable dot
        React.createElement(
          "div",
          { className: "dnd-decimal-display" },
          renderDecimalDisplay()
        ),
        
        // Render curved arrows when checked and not hidden
        showArrows && !hideArrowsAndPlaceholders && arrowsData.map((arrow, i) => renderCurvedArrow(arrow, i))
      )
    ),
    
    // Right Column
    React.createElement(
      "div",
      { className: "dnd-right-column" },
      
      // Feedback box - visibility controlled like MCQ panel
      React.createElement(
        "div",
        { 
          className: `dnd-feedback-box ${showFeedback ? (isCorrect ? 'correct visible' : 'wrong visible') : ''}`
        },
        React.createElement("p", null, feedbackText || "\u00A0")
      ),
      
      // Check button
      React.createElement(
        "button",
        { 
          className: `dnd-check-button ${isChecked && isCorrect ? 'disabled' : ''}`,
          onClick: handleCheck,
          disabled: isChecked && isCorrect
        },
        checkButton
      )
    )
  );
};
