/**
 * DndQuestion Component
 * Drag and drop decimal point placement question
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
  onUpdateNav
}) => {
  const { useState, useEffect, useRef } = React;
  
  const { num, den, rightNum } = questionData;
  
  // Active decimal position: 0 = left, 1 = middle, 2 = right (initial)
  const [activePosition, setActivePosition] = useState(2);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [showArrows, setShowArrows] = useState(false);
  const [arrowsData, setArrowsData] = useState([]);
  
  // Refs for decimal positions
  const decimalRefs = useRef([null, null, null]);
  const activeDotRef = useRef(null);
  const containerRef = useRef(null);
  const equationRef = useRef(null);
  
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
  
  // Reset state when question changes (only depends on questionIndex)
  useEffect(() => {
    setActivePosition(2);
    setIsChecked(false);
    setIsCorrect(false);
    setFeedbackText("");
    setHoverPosition(null);
    setShowArrows(false);
    setArrowsData([]);
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
      const places = den === 10 ? "one" : "two";
      const result = getDecimalResult(correctPosition);
      let correctFeedback = feedbacks.correct
        .replace("{places}", places)
        .replace("{result}", result);
      setFeedbackText(correctFeedback);
      
      const isLastQuestion = questionIndex >= totalQuestions - 1;
      if (onUpdateNav) {
        onUpdateNav(isLastQuestion ? navTextComplete : navTextAfterCorrect);
      }
      
      if (onCorrectAnswer) {
        onCorrectAnswer();
      }
    } else {
      playSound("wrong");
      setFeedbackText(feedbacks.wrong);
    }
  };
  
  // Handle decimal drag start
  const handleDragStart = (e) => {
    // Don't allow dragging after correct answer
    if (isChecked && isCorrect) return;
    
    e.preventDefault();
    setIsDragging(true);
  };
  
  // Handle decimal drag move
  const handleDragMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    // Don't allow dragging after correct answer
    if (isChecked && isCorrect) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    // Find which position the drag is closest to
    let closestPos = activePosition;
    let minDistance = Infinity;
    
    decimalRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(clientX - centerX);
        if (distance < minDistance) {
          minDistance = distance;
          closestPos = index;
        }
      }
    });
    
    // Update hover position for visual feedback
    setHoverPosition(closestPos);
    
    if (closestPos !== activePosition) {
      setActivePosition(closestPos);
      // Reset checked state and arrows if position changes after wrong answer
      if (isChecked && !isCorrect) {
        setIsChecked(false);
        setFeedbackText("");
        setShowArrows(false);
        setArrowsData([]);
      }
    }
  };
  
  // Handle decimal drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setHoverPosition(null);
    // Play tick sound on drop
    playSound("tick");
  };
  
  // Add global mouse/touch event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const moveHandler = (e) => handleDragMove(e);
      const endHandler = () => handleDragEnd();
      
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', endHandler);
      window.addEventListener('touchmove', moveHandler);
      window.addEventListener('touchend', endHandler);
      
      return () => {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', endHandler);
        window.removeEventListener('touchmove', moveHandler);
        window.removeEventListener('touchend', endHandler);
      };
    }
  }, [isDragging, activePosition, isChecked, isCorrect]);
  
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
    
    for (let i = 0; i < 4; i++) {
      // Digit - always white
      elements.push(
        React.createElement("span", {
          key: `digit-${i}`,
          className: "dnd-digit white"
        }, digits[i])
      );
      
      // Decimal placeholder (after first 3 digits)
      if (i < 3) {
        const isActive = activePosition === i;
        const isHovered = isDragging && hoverPosition === i && !isActive;
        
        const handleSlotClick = () => {
          // Don't allow click after correct answer
          if (isChecked && isCorrect) return;
          if (!isActive) {
            // Play tick sound on click to move
            playSound("tick");
            setActivePosition(i);
            if (isChecked && !isCorrect) {
              setIsChecked(false);
              setFeedbackText("");
              setShowArrows(false);
              setArrowsData([]);
            }
          }
        };
        
        let slotClass = "dnd-decimal-slot";
        if (isActive) {
          slotClass += " active";
        } else {
          slotClass += " placeholder";
          if (isHovered) {
            slotClass += " hover-target";
          }
        }
        
        elements.push(
          React.createElement("span", {
            key: `decimal-${i}`,
            className: slotClass,
            ref: (el) => { decimalRefs.current[i] = el; },
            onMouseDown: isActive ? handleDragStart : handleSlotClick,
            onTouchStart: isActive ? handleDragStart : handleSlotClick,
            onClick: !isDragging ? handleSlotClick : undefined
          },
            isActive && React.createElement("span", {
              className: `dnd-decimal-dot ${isDragging ? 'dragging' : ''}`,
              ref: activeDotRef
            })
          )
        );
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
    { className: `dnd-question-container ${isDragging ? 'is-dragging' : ''}`, ref: containerRef },
    
    // Left Column (75%)
    React.createElement(
      "div",
      { className: "dnd-left-column" },
      
      // Equation row with relative positioning for arrows
      React.createElement(
        "div",
        { className: "dnd-equation-row", ref: equationRef },
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
        
        // Render curved arrows when checked
        showArrows && arrowsData.map((arrow, i) => renderCurvedArrow(arrow, i))
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
        "Check"
      )
    )
  );
};
