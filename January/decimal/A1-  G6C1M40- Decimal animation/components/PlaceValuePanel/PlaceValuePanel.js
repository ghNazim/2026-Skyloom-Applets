const PlaceValuePanel = ({ 
  step, 
  onEnableNext, 
  onDisableNext,
  onAdvanceStep 
}) => {
  const { useState, useEffect, useRef } = React;

  // Position of digit 3 (0=H, 1=T, 2=O, 3=t, 4=h)
  const [pos, setPos] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  
  // Arrow visibility state - separate data for each arrow
  const [showDigitSwapArrow, setShowDigitSwapArrow] = useState(false);
  const [showDecimalArrow, setShowDecimalArrow] = useState(false);
  const [digitSwapArrowData, setDigitSwapArrowData] = useState(null);
  const [decimalArrowData, setDecimalArrowData] = useState(null);

  // Refs for animations
  const containerRef = useRef(null);
  const decimalRef = useRef(null);
  const digit3Ref = useRef(null);
  const digit0Refs = useRef([]);
  const slotsRef = useRef([]);
  const expandedZeroRefs = useRef([]);
  const placeValueBoxRef = useRef(null);
  const standardFormBoxRef = useRef(null);

  // Constants
  const placeSymbols = APP_DATA.placeLabels; // ["H", "T", "O", "t", "h"]
  const placeNames = APP_DATA.placeNames; // ["hundreds", "tens", "ones", "tenths", "hundredths"]
  const baseDigits = ["0", "0", "3", "0", "0", "0", "0"]; // 7 digits: 6 zeros + 1 three
  const SLOT_WIDTH = 4.5; // vw
  const dotIndices = [5, 4, 3, 2, 1]; // Decimal position index in baseDigits array for each pos

  // Check if GSAP is loaded
  useEffect(() => {
    if (window.gsap) {
      setGsapLoaded(true);
    } else {
      // GSAP should already be loaded via packages, but check anyway
      const checkGsap = setInterval(() => {
        if (window.gsap) {
          setGsapLoaded(true);
          clearInterval(checkGsap);
        }
      }, 100);
      return () => clearInterval(checkGsap);
    }
  }, []);

  // Enable next button based on step
  // Use setTimeout to ensure this runs after parent's useEffect that resets the button
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 5) {
        // Step 5: Next is enabled immediately
        onEnableNext && onEnableNext();
      } else if (step === 6) {
        // Step 6: Next is enabled only when user reaches the last position (h)
        if (pos === 4) {
          onEnableNext && onEnableNext();
        } else {
          onDisableNext && onDisableNext();
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [step, pos, onEnableNext, onDisableNext]);

  // Reset position when step changes
  useEffect(() => {
    setPos(0);
    setIsMoving(false);
    setShowDigitSwapArrow(false);
    setShowDecimalArrow(false);
    setDigitSwapArrowData(null);
    setDecimalArrowData(null);
    // Reset all zero opacities
    expandedZeroRefs.current.forEach(ref => {
      if (ref && window.gsap) {
        window.gsap.set(ref, { opacity: 1 });
      }
    });
  }, [step]);

  // Update zero opacities when position changes (only if not animating)
  useEffect(() => {
    if (!window.gsap || isMoving) return;
    
    const getZeroCount = (position) => {
      if (position <= 2) {
        const value = Math.pow(10, 2 - position);
        return value.toString().slice(1).length;
      } else {
        const value = Math.pow(10, position - 2);
        return value.toString().length - 1;
      }
    };
    
    const currentZeroCount = getZeroCount(pos);
    
    // Set initial opacity for all zero refs (animations will handle transitions)
    setTimeout(() => {
      expandedZeroRefs.current.forEach((ref, index) => {
        if (ref) {
          if (index < currentZeroCount) {
            window.gsap.set(ref, { opacity: 1 });
          } else {
            window.gsap.set(ref, { opacity: 0 });
          }
        }
      });
    }, 100);
  }, [pos, isMoving]);

  // Helper function to calculate and show digit swap arrow
  const calculateAndShowDigitSwapArrow = (oldPos, newPos) => {
    if (!placeValueBoxRef.current) return;
    
    // Wait for DOM to update after position change and animation completes
    setTimeout(() => {
      // Get the chart grid to find cells by their position
      const chartGrid = placeValueBoxRef.current.querySelector('.chart-grid');
      if (!chartGrid) return;
      
      // Get all digit cells (they maintain their DOM order even after swap)
      const digitCells = Array.from(chartGrid.querySelectorAll('.digit-cell'));
      
      // Position mapping: 0=H, 1=T, 2=O, 3=t, 4=h
      // In grid: [0, 1, 2, dot, 3, 4] - but dot is not a cell
      // So digitCells array: [pos0, pos1, pos2, pos3, pos4]
      
      // Arrow should always go from LEFT cell to RIGHT cell (the two cells that were swapped)
      // When moving right: oldPos < newPos, so oldPos is left, newPos is right
      // When moving left: oldPos > newPos, so newPos is left, oldPos is right
      const leftPos = Math.min(oldPos, newPos);
      const rightPos = Math.max(oldPos, newPos);
      const leftCell = digitCells[leftPos];
      const rightCell = digitCells[rightPos];
      
      if (leftCell && rightCell && placeValueBoxRef.current) {
        const leftRect = leftCell.getBoundingClientRect();
        const rightRect = rightCell.getBoundingClientRect();
        const containerRect = placeValueBoxRef.current.getBoundingClientRect();

        // Calculate arrow positions (from left cell to right cell)
        // Arrow should be at the top midpoint of each cell (top edge, horizontally centered)
        const startX = leftRect.left + leftRect.width / 2 - containerRect.left;
        const startY = leftRect.top - containerRect.top; // Top edge of left cell
        const endX = rightRect.left + rightRect.width / 2 - containerRect.left;
        const endY = rightRect.top - containerRect.top; // Top edge of right cell

        setDigitSwapArrowData({
          startX,
          startY,
          endX,
          endY,
        });
        setShowDigitSwapArrow(true);
      }
    }, 250);
  };

  // Helper function to calculate and show decimal arrow
  const calculateAndShowDecimalArrow = (oldPos, newPos, capturedOldSlotRect, capturedNewSlotRect) => {
    if (!standardFormBoxRef.current) return;
    
    // Wait for DOM to update after position change and animation completes
    setTimeout(() => {
      const containerRect = standardFormBoxRef.current.getBoundingClientRect();
      const vwInPx = window.innerWidth / 100;
      
      // Get the standard-display to calculate offset
      const standardDisplay = standardFormBoxRef.current.querySelector('.standard-display');
      if (!standardDisplay) return;
      const displayRect = standardDisplay.getBoundingClientRect();
      
      // Calculate X positions based on how the decimal is actually positioned:
      // The decimal point uses: left = dotIndices[pos] * SLOT_WIDTH (in vw)
      // We need to convert this to pixels and add the display's offset within the container
      const displayOffsetX = displayRect.left - containerRect.left;
      const oldDotIndex = dotIndices[oldPos];
      const newDotIndex = dotIndices[newPos];
      
      // Calculate pixel positions: dotIndex * SLOT_WIDTH(vw) converted to px, plus display offset
      const oldX = displayOffsetX + (oldDotIndex * SLOT_WIDTH * vwInPx);
      const newX = displayOffsetX + (newDotIndex * SLOT_WIDTH * vwInPx);
      
      // Y position: below the digits, where the decimal point arc goes (closer to decimal)
      // Use slot rectangle for Y calculation (vertical position of digits)
      let slotBottom;
      if (capturedOldSlotRect) {
        slotBottom = capturedOldSlotRect.bottom - containerRect.top;
      } else {
        const allSlots = standardDisplay.querySelectorAll('.char-slot');
        if (allSlots[0]) {
          slotBottom = allSlots[0].getBoundingClientRect().bottom - containerRect.top;
        } else {
          slotBottom = displayRect.bottom - containerRect.top;
        }
      }
      
      // Position arrow closer to the decimal (reduced from 2.5vw to 1vw)
      const arrowY = slotBottom + 1 * vwInPx;

      setDecimalArrowData({
        startX: oldX,
        startY: arrowY,
        endX: newX,
        endY: arrowY,
      });
      setShowDecimalArrow(true);
    }, 250);
  };

  // Animation: Move digit 3 to new position
  const triggerTransition = (newPos) => {
    if (!window.gsap || isMoving) return;
    setIsMoving(true);

    // Hide previous arrows when starting new animation
    setShowDigitSwapArrow(false);
    setShowDecimalArrow(false);

    const gsap = window.gsap;
    const duration = 0.7;
    const ease = "power2.inOut";
    const oldPos = pos;
    
    // Capture slot positions BEFORE animation starts for accurate arrow positioning
    let oldSlotRect = null;
    let newSlotRect = null;
    if (standardFormBoxRef.current) {
      const standardDisplay = standardFormBoxRef.current.querySelector('.standard-display');
      if (standardDisplay) {
        const allSlots = standardDisplay.querySelectorAll('.char-slot');
        const oldSlotIndex = dotIndices[oldPos];
        const newSlotIndex = dotIndices[newPos];
        if (allSlots[oldSlotIndex]) oldSlotRect = allSlots[oldSlotIndex].getBoundingClientRect();
        if (allSlots[newSlotIndex]) newSlotRect = allSlots[newSlotIndex].getBoundingClientRect();
      }
    }

    // 1. Swap Animation Logic (Place Value Chart)
    const activeBox = digit3Ref.current;
    const targetBox = digit0Refs.current[newPos];

    if (activeBox && targetBox) {
      const activeRect = activeBox.getBoundingClientRect();
      const targetRect = targetBox.getBoundingClientRect();
      const deltaX = targetRect.left - activeRect.left;

      gsap.to(activeBox, { x: deltaX, duration, ease });
      gsap.to(targetBox, { x: -deltaX, duration, ease });
    }

    // 2. Decimal Arc Animation (Standard Form Box)
    const dot = decimalRef.current;
    if (dot) {
      const currentSlot = slotsRef.current[dotIndices[pos]];
      const nextSlot = slotsRef.current[dotIndices[newPos]];
      if (currentSlot && nextSlot) {
        const startRect = currentSlot.getBoundingClientRect();
        const endRect = nextSlot.getBoundingClientRect();
        const totalShift = endRect.left - startRect.left;

        gsap.set(dot, { x: 0, y: 0 });
        const tl = gsap.timeline();
        tl.to(dot, {
          x: totalShift,
          y: "2.5vw", // Arc underneath
          duration: duration / 2,
          ease: "power1.out",
        }).to(dot, {
          y: 0,
          duration: duration / 2,
          ease: "power1.in",
          onComplete: () => {
            // Sync state and reset transforms
            setPos(newPos);
            setIsMoving(false);
            gsap.set([activeBox, targetBox, dot], {
              clearProps: "transform,x,y",
            });
            
            // Show arrows AFTER animation completes
            calculateAndShowDigitSwapArrow(oldPos, newPos);
            calculateAndShowDecimalArrow(oldPos, newPos, oldSlotRect, newSlotRect);
            
            // Fade in new zeros after position update
            const getZeroCount = (position) => {
              if (position <= 2) {
                const value = Math.pow(10, 2 - position);
                return value.toString().slice(1).length;
              } else {
                const value = Math.pow(10, position - 2);
                return value.toString().length - 1;
              }
            };
            const oldZeroCount = getZeroCount(oldPos);
            const newZeroCount = getZeroCount(newPos);
            if (newZeroCount > oldZeroCount) {
              setTimeout(() => {
                for (let i = oldZeroCount; i < newZeroCount; i++) {
                  const zeroRef = expandedZeroRefs.current[i];
                  if (zeroRef) {
                    gsap.fromTo(zeroRef, 
                      { opacity: 0 },
                      { opacity: 1, duration: 0.35, ease: "power2.out" }
                    );
                  }
                }
              }, 50);
            }
          },
        });
      } else {
        // If decimal animation doesn't run, delay position update to allow fade-out to be visible
        const getZeroCount = (position) => {
          if (position <= 2) {
            const value = Math.pow(10, 2 - position);
            return value.toString().slice(1).length;
          } else {
            const value = Math.pow(10, position - 2);
            return value.toString().length - 1;
          }
        };
        const oldZeroCount = getZeroCount(oldPos);
        const newZeroCount = getZeroCount(newPos);
        const hasFadeOut = oldZeroCount > newZeroCount;
        
        // Delay position update if there's a fade-out animation
        const updateDelay = hasFadeOut ? 350 : 0;
        
        setTimeout(() => {
          setPos(newPos);
          setIsMoving(false);
          gsap.set([activeBox, targetBox], {
            clearProps: "transform,x,y",
          });
          calculateAndShowDigitSwapArrow(oldPos, newPos);
          calculateAndShowDecimalArrow(oldPos, newPos, oldSlotRect, newSlotRect);
          
          // Fade in new zeros after position update
          if (newZeroCount > oldZeroCount) {
            setTimeout(() => {
              for (let i = oldZeroCount; i < newZeroCount; i++) {
                const zeroRef = expandedZeroRefs.current[i];
                if (zeroRef) {
                  gsap.fromTo(zeroRef, 
                    { opacity: 0 },
                    { opacity: 1, duration: 0.35, ease: "power2.out" }
                  );
                }
              }
            }, 50);
          }
        }, updateDelay);
      }
    } else {
      // If no decimal, delay position update to allow fade-out to be visible
      const getZeroCount = (position) => {
        if (position <= 2) {
          const value = Math.pow(10, 2 - position);
          return value.toString().slice(1).length;
        } else {
          const value = Math.pow(10, position - 2);
          return value.toString().length - 1;
        }
      };
      const oldZeroCount = getZeroCount(oldPos);
      const newZeroCount = getZeroCount(newPos);
      const hasFadeOut = oldZeroCount > newZeroCount;
      
      // Delay position update if there's a fade-out animation
      const updateDelay = hasFadeOut ? 350 : 0;
      
      setTimeout(() => {
        setPos(newPos);
        setIsMoving(false);
        gsap.set([activeBox, targetBox], {
          clearProps: "transform,x,y",
        });
        calculateAndShowDigitSwapArrow(oldPos, newPos);
        
        // Fade in new zeros after position update
        if (newZeroCount > oldZeroCount) {
          setTimeout(() => {
            for (let i = oldZeroCount; i < newZeroCount; i++) {
              const zeroRef = expandedZeroRefs.current[i];
              if (zeroRef) {
                gsap.fromTo(zeroRef, 
                  { opacity: 0 },
                  { opacity: 1, duration: 0.35, ease: "power2.out" }
                );
              }
            }
          }, 50);
        }
      }, updateDelay);
    }

    // 3. Expanded Form Zero Opacity Animation
    // Fade out zeros that are being removed BEFORE position update, fade in zeros AFTER position update
    if (window.gsap) {
      const gsap = window.gsap;
      
      // Get zero count for a position
      const getZeroCount = (position) => {
        if (position <= 2) {
          const value = Math.pow(10, 2 - position);
          return value.toString().slice(1).length; // Number of zeros after "1"
        } else {
          const value = Math.pow(10, position - 2);
          return value.toString().length - 1; // Number of zeros in denominator after "1"
        }
      };
      
      const oldZeroCount = getZeroCount(oldPos);
      const newZeroCount = getZeroCount(newPos);
      
      // Fade out zeros that are being removed BEFORE position update (so refs are still valid)
      if (oldZeroCount > newZeroCount) {
        for (let i = newZeroCount; i < oldZeroCount; i++) {
          const zeroRef = expandedZeroRefs.current[i];
          if (zeroRef) {
            gsap.to(zeroRef, {
              opacity: 0,
              duration: 0.35,
              ease: "power2.out",
            });
          }
        }
      }
      // Fade in of new zeros is handled in the onComplete callbacks above
    }
  };

  // Handle arrow click
  const move = (direction) => {
    if (step === 5) return; // No interaction in step 5
    const next = direction === "right" ? pos + 1 : pos - 1;
    if (next >= 0 && next <= 4) {
      playSound && playSound("click");
      triggerTransition(next);
    }
  };

  // Get digit color for standard form display
  // Based on 5 positions with specific color rules
  const getDigitColor = (idx) => {
    const dotIdx = dotIndices[pos]; // Decimal position index
    const isThree = idx === 2; // The "3" digit
    
    // The "3" is always white
    if (isThree) return "var(--white)";
    
    // Position-specific color rules
    if (pos === 0) {
      // 00(grey)3(white)00(yellow).(blue)00(white)
      if (idx < 2) return "var(--white-dim)"; // First two zeros: grey
      if (idx > 2 && idx < dotIdx) return "var(--yellow)"; // Zeros before decimal: yellow
      if (idx >= dotIdx && idx < dotIdx + 2) return "var(--white)"; // Two after decimal: white
      return "var(--white-dim)"; // Rest: grey
    } else if (pos === 1) {
      // 00(grey)3(white)0(yellow).(blue)00(white)0(grey)
      if (idx < 2) return "var(--white-dim)"; // First two zeros: grey
      if (idx === 3) return "var(--yellow)"; // Zero before decimal: yellow
      if (idx >= dotIdx && idx < dotIdx + 2) return "var(--white)"; // Two after decimal: white
      return "var(--white-dim)"; // Rest: grey
    } else if (pos === 2) {
      // 00(grey)3(white).(blue)00(white)00(grey)
      if (idx < 2) return "var(--white-dim)"; // First two zeros: grey
      if (idx >= dotIdx && idx < dotIdx + 2) return "var(--white)"; // Two after decimal: white
      return "var(--white-dim)"; // Rest: grey
    } else if (pos === 3) {
      // 0(grey)0(yellow).(blue)3(white)0000(grey)
      // dotIdx = 2, so decimal is at index 2, 3 is at index 2
      if (idx === 0) return "var(--white-dim)"; // First zero: grey
      if (idx === 1) return "var(--yellow)"; // Zero before decimal: yellow
      // idx 2 is the 3 (already handled by isThree check above) - white
      // All zeros after the 3 (idx 3, 4, 5, 6) should be grey
      if (idx > 2) return "var(--white-dim)"; // All zeros after 3: grey
      return "var(--white-dim)"; // Default: grey
    } else if (pos === 4) {
      // 0(yellow).(blue)0(yellow)3(white)0000(grey)
      // dotIdx = 1, so decimal is at index 1, 3 is at index 2
      // Display: idx 0 (0), [decimal at 1], idx 1 (0), idx 2 (3), idx 3-6 (0000)
      if (idx === 0) return "var(--yellow)"; // Zero before decimal: yellow
      if (idx === 1) return "var(--yellow)"; // Zero after decimal (before 3): yellow
      // idx 2 is the 3 (already handled by isThree check above) - white
      // All zeros after the 3 (idx 3, 4, 5, 6) should be grey
      if (idx > 2) return "var(--white-dim)"; // All zeros after 3: grey
      return "var(--white-dim)"; // Default: grey
    }
    
    return "var(--white-dim)"; // Default: grey
  };

  // Get expanded form value based on position
  const getExpandedFormValue = () => {
    if (pos <= 2) {
      // Whole number positions: hundreds, tens, ones
      return Math.pow(10, 2 - pos); // 100, 10, 1
    } else {
      // Decimal positions: tenths, hundredths
      return Math.pow(10, pos - 2); // 10, 100 (as denominator)
    }
  };

  // Render arrow for digit swap (left to right)
  const renderDigitSwapArrow = () => {
    if (step !== 6 || !showDigitSwapArrow || !digitSwapArrowData) return null;

    const { startX, startY, endX, endY } = digitSwapArrowData;
    const vwInPx = window.innerWidth / 100;
    const curveOffset = 3 * vwInPx;

    // Control point for curve (above the midpoint)
    const controlX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - curveOffset;

    // Calculate bounding box with padding
    const padding = 20;
    const minX = Math.min(startX, endX) - padding;
    const minY = controlY - padding;
    const maxX = Math.max(startX, endX) + padding;
    const maxY = Math.max(startY, endY) + padding;
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;

    // Adjust coordinates relative to SVG
    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX;
    const svgEndY = endY - minY;
    const svgControlX = controlX - minX;
    const svgControlY = controlY - minY;

    // Arrow head size
    const arrowSize = 14;
    const angle = Math.atan2(svgEndY - svgControlY, svgEndX - svgControlX);

    // Arrow head points
    const arrowX1 = svgEndX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = svgEndY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = svgEndX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = svgEndY - arrowSize * Math.sin(angle + Math.PI / 6);

    return React.createElement(
      "div",
      {
        className: "digit-swap-arrow",
        style: {
          position: "absolute",
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          pointerEvents: "none",
          zIndex: 200,
          transform: "none",
        },
      },
      React.createElement(
        "svg",
        {
          width: svgWidth,
          height: svgHeight,
          style: { overflow: "visible" },
        },
        // Curved path
        React.createElement("path", {
          d: `M ${svgStartX} ${svgStartY} Q ${svgControlX} ${svgControlY} ${svgEndX} ${svgEndY}`,
          stroke: "#ffd700",
          strokeWidth: 3.5,
          fill: "none",
        }),
        // Arrow head
        React.createElement("path", {
          d: `M ${svgEndX} ${svgEndY} L ${arrowX1} ${arrowY1} M ${svgEndX} ${svgEndY} L ${arrowX2} ${arrowY2}`,
          stroke: "#ffd700",
          strokeWidth: 3.5,
          fill: "none",
        })
      )
    );
  };

  // Render arrow for decimal movement (right to left, curved below)
  const renderDecimalArrow = () => {
    if (step !== 6 || !showDecimalArrow || !decimalArrowData) return null;

    const { startX, startY, endX, endY } = decimalArrowData;
    const vwInPx = window.innerWidth / 100;
    const curveOffset = 3 * vwInPx;

    // Control point for curve (below the midpoint, moved down for arc)
    const controlX = (startX + endX) / 2;
    const controlY = Math.max(startY, endY) + curveOffset;

    // Calculate bounding box with padding
    const padding = 20;
    const minX = Math.min(startX, endX) - padding;
    const minY = Math.min(startY, endY) - padding;
    const maxX = Math.max(startX, endX) + padding;
    const maxY = controlY + padding;
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;

    // Adjust coordinates relative to SVG
    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX;
    const svgEndY = endY - minY;
    const svgControlX = controlX - minX;
    const svgControlY = controlY - minY;

    // Arrow head size
    const arrowSize = 14;
    const angle = Math.atan2(svgEndY - svgControlY, svgEndX - svgControlX);

    // Arrow head points (pointing left)
    const arrowX1 = svgEndX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = svgEndY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = svgEndX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = svgEndY - arrowSize * Math.sin(angle + Math.PI / 6);

    return React.createElement(
      "div",
      {
        className: "decimal-arrow",
        style: {
          position: "absolute",
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          pointerEvents: "none",
          zIndex: 200,
          transform: "none",
        },
      },
      React.createElement(
        "svg",
        {
          width: svgWidth,
          height: svgHeight,
          style: { overflow: "visible" },
        },
        // Curved path (right to left, below)
        React.createElement("path", {
          d: `M ${svgStartX} ${svgStartY} Q ${svgControlX} ${svgControlY} ${svgEndX} ${svgEndY}`,
          stroke: "#ffd700",
          strokeWidth: 3.5,
          fill: "none",
        }),
        // Arrow head
        React.createElement("path", {
          d: `M ${svgEndX} ${svgEndY} L ${arrowX1} ${arrowY1} M ${svgEndX} ${svgEndY} L ${arrowX2} ${arrowY2}`,
          stroke: "#ffd700",
          strokeWidth: 3.5,
          fill: "none",
        })
      )
    );
  };

  // Render expanded form content
  const renderExpandedForm = () => {
    const value = getExpandedFormValue();
    
    if (pos <= 2) {
      // Whole numbers: 3 × 100, 3 × 10, 3 × 1
      const valueStr = value.toString();
      const mainPart = valueStr.charAt(0); // "1"
      const zeros = valueStr.slice(1); // "00" or "0" or ""
      
      return React.createElement(
        "div",
        { className: "expanded-content" },
        React.createElement(
          "div",
          { className: "equation" },
          React.createElement("span", { style: { color: "var(--white)" } }, "3"),
          React.createElement("span", { className: "multiply-sign", style: { color: "var(--white)" } }, "×"),
          React.createElement(
            "span",
            { className: "value-text" },
            React.createElement("span", { style: { color: "var(--white)" } }, mainPart),
            zeros.split("").map((z, i) =>
              React.createElement(
                "span",
                {
                  key: `zero-${i}`,
                  ref: (el) => {
                    if (el) expandedZeroRefs.current[i] = el;
                  },
                  style: { 
                    color: "var(--yellow)",
                    opacity: 1,
                    transition: "opacity 0.35s ease",
                  },
                },
                z
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "ex-text", style: { color: "var(--yellow)" } },
          "3 " + placeNames[pos]
        )
      );
    } else {
      // Fractions: 3/10, 3/100
      const valueStr = value.toString();
      const mainPart = valueStr.charAt(0); // "1"
      const zeros = valueStr.slice(1); // "0" or "00"
      
      return React.createElement(
        "div",
        { className: "expanded-content fraction-mode" },
        React.createElement(
          "div",
          { className: "fraction-wrap" },
          React.createElement("div", { className: "frac-num", style: { color: "var(--white)" } }, "3"),
          React.createElement(
            "div",
            { className: "frac-den" },
            React.createElement("span", { style: { color: "var(--white)" } }, mainPart),
            zeros.split("").map((z, i) =>
              React.createElement(
                "span",
                {
                  key: `zero-${i}`,
                  ref: (el) => {
                    if (el) expandedZeroRefs.current[i] = el;
                  },
                  style: { 
                    color: "var(--yellow)",
                    opacity: 1,
                    transition: "opacity 0.35s ease",
                  },
                },
                z
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "ex-text", style: { color: "var(--yellow)" } },
          "3 " + placeNames[pos]
        )
      );
    }
  };

  return React.createElement(
    "div",
    { ref: containerRef, className: "place-value-panel" },
    
    // Place Value Chart Box (Top)
    React.createElement(
      "div",
      { 
        ref: placeValueBoxRef,
        className: "box place-value-box",
        style: { position: "relative" },
      },
      React.createElement("div", { className: "box-label" }, APP_DATA.labels.placeValueChart),
      React.createElement(
        "div",
        { className: "chart-grid" },
        // Header row (H, T, O, ., t, h)
        placeSymbols.map((s, i) =>
          React.createElement(
            React.Fragment,
            { key: `h-${i}` },
            // Decimal point after O (index 2)
            i === 3 &&
              React.createElement(
                "div",
                { className: "dot-marker" },
                React.createElement("div", { className: "dot-circle" })
              ),
            React.createElement(
              "div",
              {
                className: `cell header-cell ${i === pos ? "header-active" : ""}`,
              },
              s
            )
          )
        ),
        // Digit row (3, 0, 0, ., 0, 0)
        placeSymbols.map((_, i) =>
          React.createElement(
            React.Fragment,
            { key: `d-${i}` },
            // Decimal point after O (index 2)
            i === 3 &&
              React.createElement(
                "div",
                { className: "dot-marker" },
                React.createElement("div", { className: "dot-circle" })
              ),
            React.createElement(
              "div",
              {
                ref: (el) =>
                  i === pos
                    ? (digit3Ref.current = el)
                    : (digit0Refs.current[i] = el),
                className: `cell digit-cell ${i === pos ? "active-cell" : ""}`,
              },
              i === pos ? "3" : "0",
              // Arrows below the active digit (only in step 6)
              i === pos && step === 6 && !isMoving && gsapLoaded &&
                React.createElement(
                  "div",
                  { className: "arrow-container" },
                  React.createElement(
                    "button",
                    {
                      onClick: () => move("left"),
                      className: `nav-btn ${pos === 0 ? "disabled" : ""}`,
                      disabled: pos === 0,
                    },
                    React.createElement("span", { className: "arrow-icon" }, "‹")
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => move("right"),
                      className: `nav-btn ${pos === 4 ? "disabled" : ""} ${pos < 4 ? "pulse" : ""}`,
                      disabled: pos === 4,
                    },
                    React.createElement("span", { className: "arrow-icon" }, "›")
                  )
                )
            )
          )
        )
      ),
      // Digit swap arrow
      renderDigitSwapArrow()
    ),
    
    // Bottom row: Standard Form Box and Expanded Form Box
    React.createElement(
      "div",
      { className: "bottom-row" },
      
      // Standard Form Box (Left)
      React.createElement(
        "div",
        { 
          ref: standardFormBoxRef,
          className: "box standard-form-box",
          style: { position: "relative" },
        },
        React.createElement("div", { className: "box-label" }, APP_DATA.labels.standardForm),
        React.createElement(
          "div",
          { className: "standard-display" },
          baseDigits.map((char, idx) =>
            React.createElement(
              "div",
              {
                key: idx,
                ref: (el) => (slotsRef.current[idx] = el),
                className: "char-slot",
              },
              React.createElement(
                "span",
                {
                  style: {
                    color: getDigitColor(idx),
                    transition: "color 0.4s",
                  },
                },
                char
              )
            )
          ),
          // Decimal point (animated)
          React.createElement("div", {
            ref: decimalRef,
            className: "decimal-point",
            style: { left: `${dotIndices[pos] * SLOT_WIDTH}vw` },
          })
        ),
        // Decimal movement arrow
        renderDecimalArrow()
      ),
      
      // Expanded Form Box (Right)
      React.createElement(
        "div",
        { className: "box expanded-form-box" },
        React.createElement("div", { className: "box-label" }, APP_DATA.labels.expandedForm),
        renderExpandedForm()
      )
    )
  );
};
