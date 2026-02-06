const PlaceValuePanel = ({ 
  step, 
  onEnableNext, 
  onDisableNext,
  onAdvanceStep,
  mcqIsCorrect,
  mcqSelectedOption,
  mcqActive,
  onAnimationComplete,
  onUpdateTexts,
  substep,
  setSubstep,
  pulsateZeros = false
}) => {
  const { useState, useEffect, useRef, useCallback } = React;

  // Position of digit 3 (0=H, 1=T, 2=O, 3=t, 4=h)
  const [pos, setPos] = useState(0);
  // Separate position states for each box to update colors independently
  const [placeValuePos, setPlaceValuePos] = useState(0);
  const [standardFormPos, setStandardFormPos] = useState(0);
  const [expandedFormPos, setExpandedFormPos] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  
  // Arrow visibility state - separate data for each arrow
  const [showDigitSwapArrow, setShowDigitSwapArrow] = useState(false);
  const [showDecimalArrow, setShowDecimalArrow] = useState(false);
  const [digitSwapArrowData, setDigitSwapArrowData] = useState(null);
  const [decimalArrowData, setDecimalArrowData] = useState(null);
  
  // Persistent arrows for steps 8-10 (store multiple arrow data)
  const [persistentDigitArrows, setPersistentDigitArrows] = useState([]);
  const [persistentDecimalArrows, setPersistentDecimalArrows] = useState([]);
  
  // Arrow animation state
  const [shouldBlinkArrows, setShouldBlinkArrows] = useState(false);
  
  // Nav buttons visibility
  const [showNavButtons, setShowNavButtons] = useState(true);
  const [leftNavDisabled, setLeftNavDisabled] = useState(true);
  const [rightNavDisabled, setRightNavDisabled] = useState(false);
  
  // Track if user has interacted in step 10
  const [hasInteractedStep10, setHasInteractedStep10] = useState(false);
  
  // Internal substep state (used if not passed from parent)
  const [internalSubstep, setInternalSubstep] = useState(1);
  const currentSubstep = substep !== undefined ? substep : internalSubstep;
  const updateSubstep = setSubstep || setInternalSubstep;

  // Refs for animations
  const containerRef = useRef(null);
  const decimalRef = useRef(null);
  const digit3Ref = useRef(null);
  const digit0Refs = useRef([]);
  const slotsRef = useRef([]);
  const expandedZeroRefs = useRef([]);
  const expandedMainPartRef = useRef(null); // Ref for the "1" in 3×1
  const expandedThreeRef = useRef(null); // Ref for the "3" in 3×1
  const expandedContentRef = useRef(null); // Ref for expanded content wrapper
  const fractionWrapRef = useRef(null); // Ref for fraction wrapper (for fade-in animation)
  const placeValueBoxRef = useRef(null);
  const standardFormBoxRef = useRef(null);
  
  // Track which arrows have been animated (to prevent re-animation on state changes)
  const animatedArrowsRef = useRef(new Set());
  
  // Box highlighting state for sequential animation
  const [highlightedBox, setHighlightedBox] = useState(null); // 'placeValue', 'standardForm', 'expanded', or null
  
  // Ref for expanded form box
  const expandedFormBoxRef = useRef(null);
  
  // State for expanded form transition animation
  const [expandedFormTransition, setExpandedFormTransition] = useState(null); // 'toFraction' or 'toMultiply' or null
  const threeCloneAnimationRef = useRef(null); // Store clone animation data for 2→3 transition
  
  // Track previous position for determining which zeros are new
  const prevPosRef = useRef(pos);
  const [newZeroIndices, setNewZeroIndices] = useState([]); // Indices of zeros that should fade in

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
      const checkGsap = setInterval(() => {
        if (window.gsap) {
          setGsapLoaded(true);
          clearInterval(checkGsap);
        }
      }, 100);
      return () => clearInterval(checkGsap);
    }
  }, []);

  // Enable/disable next button based on step and substep
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1 || step === 3 || step === 4) {
        onEnableNext && onEnableNext();
      } else if (step === 5) {
        onEnableNext && onEnableNext();
      } else if (step === 6) {
        // Step 6: Next disabled initially, enabled after substep 3
        if (currentSubstep === 3) {
          onEnableNext && onEnableNext();
        } else {
          onDisableNext && onDisableNext();
        }
      } else if (step === 7) {
        onEnableNext && onEnableNext();
      } else if (step === 8 || step === 9) {
        if (mcqIsCorrect) {
          onEnableNext && onEnableNext();
        } else {
          onDisableNext && onDisableNext();
        }
      } else if (step === 10) {
        if (hasInteractedStep10) {
          onEnableNext && onEnableNext();
        } else {
          onDisableNext && onDisableNext();
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [step, pos, currentSubstep, mcqIsCorrect, hasInteractedStep10, onEnableNext, onDisableNext]);

  // Track previous step for position carry-over
  const prevStepRef = useRef(step);

  // Reset position and state when step changes
  useEffect(() => {
    const prevStep = prevStepRef.current;
    prevStepRef.current = step;
    
    // Kill any ongoing GSAP animations when step changes
    if (window.gsap) {
      // Kill all animations on digit and decimal refs
      if (digit3Ref.current) window.gsap.killTweensOf(digit3Ref.current);
      digit0Refs.current.forEach(ref => {
        if (ref) window.gsap.killTweensOf(ref);
      });
      if (decimalRef.current) window.gsap.killTweensOf(decimalRef.current);
      // Clear any transforms
      if (digit3Ref.current) window.gsap.set(digit3Ref.current, { clearProps: "transform,x,y" });
      digit0Refs.current.forEach(ref => {
        if (ref) window.gsap.set(ref, { clearProps: "transform,x,y" });
      });
      if (decimalRef.current) window.gsap.set(decimalRef.current, { clearProps: "transform,x,y" });
    }
    
    // Reset single arrow visibility (persistent arrows kept separately)
    setIsMoving(false);
    setShowDigitSwapArrow(false);
    setShowDecimalArrow(false);
    setDigitSwapArrowData(null);
    setDecimalArrowData(null);
    setHasInteractedStep10(false);
    setHighlightedBox(null); // Reset box highlighting on step change
    
    // Clear animated arrows tracking on step change, EXCEPT when going from step 8 to step 9
    // (to keep the step 8 arrows from re-animating)
    // When going back (step 9 to step 8), we want to reset everything
    if (!(prevStep === 8 && step === 9)) {
      animatedArrowsRef.current = new Set();
    }
    
    // Setup for specific steps
    if (step < 6) {
      setPos(0);
      setPlaceValuePos(0);
      setStandardFormPos(0);
      setExpandedFormPos(0);
      setPersistentDigitArrows([]);
      setPersistentDecimalArrows([]);
      setShouldBlinkArrows(false);
    } else if (step === 6) {
      setPos(0);
      setPlaceValuePos(0);
      setStandardFormPos(0);
      setExpandedFormPos(0);
      setShowNavButtons(true);
      setLeftNavDisabled(true);
      setRightNavDisabled(false);
      setPersistentDigitArrows([]);
      setPersistentDecimalArrows([]);
      setShouldBlinkArrows(false);
      setInternalSubstep(1);
    } else if (step === 7) {
      // Position at 2 (from step 6 substep 3)
      setPos(2);
      setPlaceValuePos(2);
      setStandardFormPos(2);
      setExpandedFormPos(2);
      setShowNavButtons(false);
      setShouldBlinkArrows(true);
      // Clear persistent (will use combined arrows instead)
      setPersistentDigitArrows([]);
      setPersistentDecimalArrows([]);
    } else if (step === 8) {
      // Start at position 2
      setPos(2);
      setPlaceValuePos(2);
      setStandardFormPos(2);
      setExpandedFormPos(2);
      setShowNavButtons(true);
      setLeftNavDisabled(true);
      setRightNavDisabled(false);
      setPersistentDigitArrows([]);
      setPersistentDecimalArrows([]);
      setShouldBlinkArrows(false);
    } else if (step === 9) {
      // Position 3 from step 8, keep arrows from step 8
      setPos(3);
      setPlaceValuePos(3);
      setStandardFormPos(3);
      setExpandedFormPos(3);
      setShowNavButtons(true);
      setLeftNavDisabled(true);
      setRightNavDisabled(false);
      // Don't clear persistent arrows - they carry over from step 8
      setShouldBlinkArrows(true);
    } else if (step === 10) {
      // Start fresh at position 0 for explore mode
      setPos(0);
      setPlaceValuePos(0);
      setStandardFormPos(0);
      setExpandedFormPos(0);
      setShowNavButtons(true);
      setLeftNavDisabled(true); // Can't go left from position 0
      setRightNavDisabled(false);
      // Clear persistent arrows for explore mode
      setPersistentDigitArrows([]);
      setPersistentDecimalArrows([]);
      setShouldBlinkArrows(false);
    }
    
    // Reset all zero opacities
    expandedZeroRefs.current.forEach(ref => {
      if (ref && window.gsap) {
        window.gsap.set(ref, { opacity: 1 });
      }
    });
  }, [step]);

  // Clear single arrows when moving to step 6 substep 3 (show combined arrows instead)
  useEffect(() => {
    if (step === 6) {
      if (currentSubstep === 3) {
        setShowDigitSwapArrow(false);
        setShowDecimalArrow(false);
        setDigitSwapArrowData(null);
        setDecimalArrowData(null);
        setShowNavButtons(false); // Hide nav buttons in substep 3
      } else {
        // Ensure nav buttons are shown for substeps 1 and 2
        setShowNavButtons(true);
      }
    }
  }, [step, currentSubstep]);

  // Update nav button states based on MCQ active status and step state
  useEffect(() => {
    if (mcqActive) {
      setLeftNavDisabled(true);
      setRightNavDisabled(true);
    } else if (step === 6) {
      // In substep 3, nav buttons are hidden anyway
      if (currentSubstep < 3) {
        setLeftNavDisabled(true);
        setRightNavDisabled(false);
      }
    } else if (step === 8 || step === 9) {
      // After MCQ is correct (mcqIsCorrect), keep nav button disabled - user should click Next
      if (mcqIsCorrect) {
        setLeftNavDisabled(true);
        setRightNavDisabled(true);
      } else {
        setLeftNavDisabled(true);
        setRightNavDisabled(placeValuePos === 4);
      }
    } else if (step === 10) {
      setLeftNavDisabled(true);
      setRightNavDisabled(placeValuePos === 4);
    }
  }, [mcqActive, mcqIsCorrect, step, currentSubstep, placeValuePos]);

  // Handle fraction fade-in animation when transitioning from multiply to fraction form
  useEffect(() => {
    if (expandedFormTransition === 'toFraction' && pos >= 3 && fractionWrapRef.current && window.gsap) {
      const gsap = window.gsap;
      const fractionWrap = fractionWrapRef.current;
      
      // Check if we need to animate the "3" and "10" clones (transitioning from pos 2)
      if (threeCloneAnimationRef.current && pos === 3) {
        const cloneData = threeCloneAnimationRef.current;
        const fracNum = fractionWrap.querySelector('.frac-num');
        const fracDen = fractionWrap.querySelector('.frac-den');
        
        if (fracNum && fracDen) {
          // Get actual target positions
          const numTargetRect = fracNum.getBoundingClientRect();
          const denTargetRect = fracDen.getBoundingClientRect();
          
          // Initially hide the fraction
          gsap.set(fractionWrap, { opacity: 0 });
          
          // Create clone of "3" for numerator
          const threeClone = document.createElement('span');
          threeClone.textContent = '3';
          threeClone.style.cssText = `
            position: fixed;
            left: ${cloneData.three.startX}px;
            top: ${cloneData.three.startY}px;
            font-size: ${cloneData.three.fontSize};
            color: ${cloneData.three.color};
            font-weight: ${cloneData.three.fontWeight};
            z-index: 10000;
            pointer-events: none;
            opacity: 1;
          `;
          document.body.appendChild(threeClone);
          
          // Create clone of "10" (from "1" position) for denominator
          const tenClone = document.createElement('span');
          tenClone.textContent = '10';
          tenClone.style.cssText = `
            position: fixed;
            left: ${cloneData.one.startX}px;
            top: ${cloneData.one.startY}px;
            font-size: ${cloneData.one.fontSize};
            color: ${cloneData.one.color};
            font-weight: ${cloneData.one.fontWeight};
            z-index: 10000;
            pointer-events: none;
            opacity: 1;
          `;
          document.body.appendChild(tenClone);
          
          // Hide original "3" and crossed out "1" now that clones are created and about to start moving
          const threeEl = expandedThreeRef.current;
          if (threeEl) {
            gsap.set(threeEl, { opacity: 0 });
          }
          
          // Hide the crossed out "1"
          if (cloneData.one.mainPartEl) {
            gsap.set(cloneData.one.mainPartEl, { opacity: 0 });
            // Remove strikethrough line
            if (cloneData.one.strike && cloneData.one.strike.parentNode) {
              cloneData.one.strike.remove();
            }
          }
          
          // Animate both clones simultaneously
          const timeline = gsap.timeline({
            onComplete: () => {
              // Remove clones
              if (threeClone.parentNode) threeClone.remove();
              if (tenClone.parentNode) tenClone.remove();
              
              // Show the fraction
              gsap.set(fractionWrap, { opacity: 1 });
              gsap.set(fracNum, { opacity: 1, borderBottomColor: 'var(--white)' });
              gsap.set(fracDen, { opacity: 1 });
              
              // Fade in zeros if any
              expandedZeroRefs.current.forEach((ref) => {
                if (ref) {
                  gsap.set(ref, { opacity: 1 });
                }
              });
              
              // Clear transition state
              threeCloneAnimationRef.current = null;
              setTimeout(() => {
                setExpandedFormTransition(null);
              }, 50);
            }
          });
          
          // Animate "3" clone to numerator
          timeline.to(threeClone, {
            left: numTargetRect.left,
            top: numTargetRect.top,
            duration: 0.5,
            ease: "power2.inOut"
          }, 0); // Start at time 0
          
          // Animate "10" clone to denominator (simultaneously)
          timeline.to(tenClone, {
            left: denTargetRect.left,
            top: denTargetRect.top,
            duration: 0.5,
            ease: "power2.inOut"
          }, 0); // Start at time 0 (same time as "3" clone)
        } else {
          // Fallback if fracNum or fracDen not found
          threeCloneAnimationRef.current = null;
          gsap.set(fractionWrap, { opacity: 1 });
          setTimeout(() => {
            setExpandedFormTransition(null);
          }, 50);
        }
      } else {
        // Normal fraction show (not from 2→3 transition)
        const fracNum = fractionWrap.querySelector('.frac-num');
        const fracDen = fractionWrap.querySelector('.frac-den');
        
        gsap.set(fractionWrap, { opacity: 1 });
        if (fracNum) {
          gsap.set(fracNum, { opacity: 1, borderBottomColor: 'var(--white)' });
        }
        if (fracDen) {
          gsap.set(fracDen, { opacity: 1 });
        }
        
        expandedZeroRefs.current.forEach((ref) => {
          if (ref) {
            gsap.set(ref, { opacity: 1 });
          }
        });
        
        setTimeout(() => {
          setExpandedFormTransition(null);
        }, 50);
      }
    } else if (expandedFormTransition === 'toMultiply') {
      // Clear transition state for multiply form
      const timer = setTimeout(() => {
        setExpandedFormTransition(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pos, expandedFormTransition]);

  // Update zero opacities when position changes
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

  // Helper function to animate arrow path from 0 to full length
  const animateArrowPath = (pathElement, arrowHeadElement, arrowId, wrapperElement, labelElement, enableBlink, callback) => {
    if (!pathElement || !window.gsap) {
      if (callback) callback();
      return;
    }
    
    // Check if already animated
    if (animatedArrowsRef.current.has(arrowId)) {
      // Already animated - don't re-animate
      return;
    }
    
    // Mark as being animated
    animatedArrowsRef.current.add(arrowId);
    
    const length = pathElement.getTotalLength();
    
    // Immediately set initial state (hidden)
    window.gsap.set(pathElement, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1
    });
    
    // Play swoosh sound when arrow starts animating
    if (window.playSound) window.playSound("swoosh");
    
    // Animate the path drawing
    window.gsap.to(pathElement, {
      strokeDashoffset: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        // Show arrow head after path completes
        if (arrowHeadElement) {
          window.gsap.fromTo(arrowHeadElement, 
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: "power2.out" }
          );
        }
        
        // Show label after arrow head
        if (labelElement) {
          window.gsap.to(labelElement, { opacity: 1, duration: 0.3, delay: 0.1 });
        }
        
        // After ALL animations complete, add blink class directly via DOM (not via React state)
        // This avoids re-render during animation
        if (enableBlink && wrapperElement && step < 10) {
          setTimeout(() => {
            wrapperElement.classList.add('blink-arrow');
          }, 300); // Wait for arrow head + label animations to finish
        }
        
        if (callback) callback();
      }
    });
  };

  // Calculate digit swap arrow data
  // Arrow shows movement of "3": start = old position (where 3 was), end = new position (where 3 is going).
  // Moving left: start at right cell, end at left. Moving right: start at left, end at right.
  const calculateDigitSwapArrowData = (oldPos, newPos, label = null) => {
    if (!placeValueBoxRef.current) return null;
    
    const chartGrid = placeValueBoxRef.current.querySelector('.chart-grid');
    if (!chartGrid) return null;
    
    const digitCells = Array.from(chartGrid.querySelectorAll('.digit-cell'));
    const startCell = digitCells[oldPos];
    const endCell = digitCells[newPos];
    
    if (startCell && endCell && placeValueBoxRef.current) {
      const startRect = startCell.getBoundingClientRect();
      const endRect = endCell.getBoundingClientRect();
      const containerRect = placeValueBoxRef.current.getBoundingClientRect();

      return {
        startX: startRect.left + startRect.width / 2 - containerRect.left,
        startY: startRect.top - containerRect.top,
        endX: endRect.left + endRect.width / 2 - containerRect.left,
        endY: endRect.top - containerRect.top,
        type: 'digitSwap',
        label: label,
        id: `digit-${oldPos}-${newPos}`
      };
    }
    return null;
  };

  // Calculate decimal arrow data
  const calculateDecimalArrowData = (oldPos, newPos, label = null) => {
    if (!standardFormBoxRef.current) return null;
    
    const containerRect = standardFormBoxRef.current.getBoundingClientRect();
    const vwInPx = window.innerWidth / 100;
    
    const standardDisplay = standardFormBoxRef.current.querySelector('.standard-display');
    if (!standardDisplay) return null;
    const displayRect = standardDisplay.getBoundingClientRect();
    
    const displayOffsetX = displayRect.left - containerRect.left;
    const oldDotIndex = dotIndices[oldPos];
    const newDotIndex = dotIndices[newPos];
    
    const oldX = displayOffsetX + (oldDotIndex * SLOT_WIDTH * vwInPx);
    const newX = displayOffsetX + (newDotIndex * SLOT_WIDTH * vwInPx);
    
    const allSlots = standardDisplay.querySelectorAll('.char-slot');
    let slotBottom = displayRect.bottom - containerRect.top;
    if (allSlots[0]) {
      slotBottom = allSlots[0].getBoundingClientRect().bottom - containerRect.top;
    }
    
    // ARROW VERTICAL POSITION: Adjust this multiplier to move arrows up/down
    // - Decrease (e.g., 0) to move arrows UP (closer to digits)
    // - Increase (e.g., 1) to move arrows DOWN
    const arrowY = slotBottom - 0.8 * vwInPx;

    return {
      startX: oldX,
      startY: arrowY,
      endX: newX,
      endY: arrowY,
      type: 'decimal',
      label: label,
      id: `decimal-${oldPos}-${newPos}`
    };
  };

  // Animation: Move digit 3 to new position (SEQUENTIAL - one box at a time)
  const triggerTransition = (newPos) => {
    if (!window.gsap || isMoving) return;
    setIsMoving(true);

    // Hide previous single arrows when starting new animation
    setShowDigitSwapArrow(false);
    setShowDecimalArrow(false);

    const gsap = window.gsap;
    const duration = 0.7;
    const ease = "power2.inOut";
    const oldPos = pos;
    
    // Determine arrow label based on step and position
    let arrowLabel = null;
    if (step === 6 && currentSubstep < 3) {
      arrowLabel = "÷ 10";
    } else if (step === 8) {
      arrowLabel = "1";
    } else if (step === 9) {
      if (persistentDigitArrows.length === 0) {
        arrowLabel = "1"; // First arrow from step 8 carry-over
      } else {
        arrowLabel = "2"; // Second arrow
      }
    } else if (step === 10) {
      // Label based on destination position (decimal places)
      if (newPos === 3) {
        arrowLabel = "1";
      } else if (newPos === 4) {
        arrowLabel = "2";
      }
      // No label for positions 0, 1, 2
    }

    const activeBox = digit3Ref.current;
    const targetBox = digit0Refs.current[newPos];

    // ========== PHASE 1: Highlight Place Value Box, dehighlight others ==========
    setHighlightedBox('placeValue');
    // Play click sound when box is highlighted
    if (window.playSound) window.playSound("click");

    // Calculate arrow data BEFORE animation starts (to ensure correct direction)
    const digitArrowData = calculateDigitSwapArrowData(oldPos, newPos, arrowLabel);

    // Wait 1 second after highlighting so user can see the highlighted box before animation starts
    setTimeout(() => {
      // 1. Swap Animation Logic (Place Value Chart)
      if (activeBox && targetBox) {
        const activeRect = activeBox.getBoundingClientRect();
        const targetRect = targetBox.getBoundingClientRect();
        const deltaX = targetRect.left - activeRect.left;

        gsap.to(activeBox, { x: deltaX, duration, ease });
        gsap.to(targetBox, { 
          x: -deltaX, 
          duration, 
          ease,
          onComplete: () => {
            // Clear transforms immediately so visual position matches logical position
            gsap.set([activeBox, targetBox], {
              clearProps: "transform,x,y",
            });
            
            // Update place value position immediately after place value animation completes and transforms are cleared
            setPlaceValuePos(newPos);
            
            // Show digit swap arrow after swap animation completes
            if (digitArrowData) {
              setDigitSwapArrowData(digitArrowData);
              setShowDigitSwapArrow(true);
            }
            
            // ========== PHASE 2: Wait 2 seconds after animation completes, then highlight Standard Form Box ==========
            setTimeout(() => {
              setHighlightedBox('standardForm');
              // Play click sound when box is highlighted
              if (window.playSound) window.playSound("click");
              
              // Wait 1 second after highlighting so user can see the highlighted box before animation starts
              setTimeout(() => {
                // 2. Decimal Arc Animation (Standard Form Box)
                const dot = decimalRef.current;
                if (dot) {
                  // Calculate shift based on slot indices and SLOT_WIDTH (matching initial positioning)
                  // This ensures exact alignment without pixel rounding issues
                  const vwInPx = window.innerWidth / 100;
                  const currentDotIndex = dotIndices[pos];
                  const nextDotIndex = dotIndices[newPos];
                  const totalShift = (nextDotIndex - currentDotIndex) * SLOT_WIDTH * vwInPx;

                  gsap.set(dot, { x: 0, y: 0 });
                  const tl = gsap.timeline();
                  tl.to(dot, {
                    x: totalShift,
                    y: "2.5vw",
                    duration: duration / 2,
                    ease: "power1.out",
                  }).to(dot, {
                    y: 0,
                    duration: duration / 2,
                    ease: "power1.in",
                    onComplete: () => {
                      // Update standard form position immediately after standard form animation completes
                      setStandardFormPos(newPos);
                      
                      // Update the left style to match the new position (before clearing transforms)
                      // This ensures the decimal point ends up exactly in the center between digits
                      const newLeftValue = dotIndices[newPos] * SLOT_WIDTH;
                      gsap.set(dot, { left: `${newLeftValue}vw` });
                      
                      // Clear transforms so the decimal point uses the new left position
                      gsap.set(dot, { clearProps: "transform,x,y" });
                      
                      // Calculate and show decimal arrow
                      const decimalArrowDat = calculateDecimalArrowData(oldPos, newPos, arrowLabel);
                      if (decimalArrowDat) {
                        setDecimalArrowData(decimalArrowDat);
                        setShowDecimalArrow(true);
                      }
                      
                      // ========== PHASE 3: Wait 2 seconds after animation completes, then highlight Expanded Form Box ==========
                      setTimeout(() => {
                        setHighlightedBox('expanded');
                        // Play click sound when box is highlighted
                        if (window.playSound) window.playSound("click");
                        
                        // Wait 1 second after highlighting so user can see the highlighted box before animation starts
                        setTimeout(() => {
                          // 3. Expanded Form Animation (with strikethrough effects)
                          handleExpandedFormAnimation(oldPos, newPos);
                          
                          // Calculate expanded animation duration based on the type
                          let expandedAnimDuration = 600; // default
                          if (oldPos === 2 && newPos === 3) {
                            expandedAnimDuration = 1000; // toFraction is longer
                          } else if (oldPos < 2 && newPos > oldPos) {
                            expandedAnimDuration = 700; // strikethrough + fade
                          }
                          
                          // Update expanded form position immediately after expanded form animation completes
                          setTimeout(() => {
                            setExpandedFormPos(newPos);
                          }, expandedAnimDuration);
                          
                          // ========== PHASE 4: Animation complete - clear highlights and finalize ==========
                          setTimeout(() => {
                            // Update position (placeValuePos and standardFormPos already updated, now update pos)
                            setPos(newPos);
                            // Transforms already cleared after each animation phase, no need to clear again
                            
                            // Remove all highlights
                            setHighlightedBox(null);
                            setIsMoving(false);
                            
                            // NOW trigger post-animation tasks (MCQ, nav button, nav text changes)
                            handlePostAnimationSequential(oldPos, newPos, arrowLabel);
                          }, expandedAnimDuration);
                        }, 1000); // Wait 1 second after highlighting before starting expanded animation
                      }, 2000); // Wait 2 seconds after decimal animation completes
                    }
                  });
                } else {
                  // Fallback if dot not found
                  handleFallbackSequential(oldPos, newPos, arrowLabel, activeBox, targetBox);
                }
              }, 1000); // Wait 1 second after highlighting before starting decimal animation
            }, 2000); // Wait 2 seconds after place value animation completes
          }
        });
      } else {
        // Fallback if boxes not found
        handleFallbackSequential(oldPos, newPos, arrowLabel, activeBox, targetBox);
      }
    }, 1000); // Wait 1 second after highlighting before starting place value animation
  };
  
  // Handle post-animation tasks after sequential animations complete
  const handlePostAnimationSequential = (oldPos, newPos, arrowLabel) => {
    setTimeout(() => {
      if (step === 6) {
        if (currentSubstep < 3) {
          // Trigger MCQ callback
          setTimeout(() => {
            if (onAnimationComplete) {
              onAnimationComplete(currentSubstep);
            }
          }, 100);
        }
      } else if (step === 8) {
        // Store arrows persistently and trigger callback
        const digitArrowData = calculateDigitSwapArrowData(oldPos, newPos, "1");
        const decimalArrowDat = calculateDecimalArrowData(oldPos, newPos, "1");
        if (digitArrowData) setPersistentDigitArrows([digitArrowData]);
        if (decimalArrowDat) setPersistentDecimalArrows([decimalArrowDat]);
        setShouldBlinkArrows(true);
        // Hide single arrows when using persistent
        setShowDigitSwapArrow(false);
        setShowDecimalArrow(false);
        
        setTimeout(() => {
          if (onAnimationComplete) {
            onAnimationComplete(step);
          }
        }, 100);
      } else if (step === 9) {
        // Add second arrow to persistent storage
        const newDigitArrow = calculateDigitSwapArrowData(oldPos, newPos, "2");
        const newDecimalArrow = calculateDecimalArrowData(oldPos, newPos, "2");
        
        if (newDigitArrow) {
          setPersistentDigitArrows(prev => [...prev, newDigitArrow]);
        }
        if (newDecimalArrow) {
          setPersistentDecimalArrows(prev => [...prev, newDecimalArrow]);
        }
        setShouldBlinkArrows(true);
        // Hide single arrows when using persistent
        setShowDigitSwapArrow(false);
        setShowDecimalArrow(false);
        
        setTimeout(() => {
          if (onAnimationComplete) {
            onAnimationComplete(step);
          }
        }, 100);
      } else if (step === 10) {
        // Handle step 10 arrows
        if (newPos === 3) {
          const digitArrowData = calculateDigitSwapArrowData(oldPos, newPos, "1");
          const decimalArrowDat = calculateDecimalArrowData(oldPos, newPos, "1");
          if (digitArrowData) setPersistentDigitArrows([digitArrowData]);
          if (decimalArrowDat) setPersistentDecimalArrows([decimalArrowDat]);
          setShowDigitSwapArrow(false);
          setShowDecimalArrow(false);
          setShouldBlinkArrows(true);
        } else if (newPos === 4) {
          const newDigitArrow = calculateDigitSwapArrowData(oldPos, newPos, "2");
          const newDecimalArrow = calculateDecimalArrowData(oldPos, newPos, "2");
          
          if (newDigitArrow) {
            setPersistentDigitArrows(prev => [...prev, newDigitArrow]);
          }
          if (newDecimalArrow) {
            setPersistentDecimalArrows(prev => [...prev, newDecimalArrow]);
          }
          setShowDigitSwapArrow(false);
          setShowDecimalArrow(false);
          setShouldBlinkArrows(true);
        } else {
          // For other positions, clear persistent and keep single arrows
          setPersistentDigitArrows([]);
          setPersistentDecimalArrows([]);
          setShouldBlinkArrows(false);
        }
        
        // Update interaction state for step 10
        if (!hasInteractedStep10) {
          setHasInteractedStep10(true);
          if (onUpdateTexts) {
            const stepData = APP_DATA.steps[10];
            onUpdateTexts(stepData.questionText, null, stepData.navTextAfterInteraction);
          }
        }
      }
      
      // Handle zero count animation
      handleZeroFadeIn(oldPos, newPos);
    }, 100);
  };
  
  // Fallback handler for sequential animations
  const handleFallbackSequential = (oldPos, newPos, arrowLabel, activeBox, targetBox) => {
    // Update all positions immediately in fallback
    setPlaceValuePos(newPos);
    setStandardFormPos(newPos);
    
    // Run expanded animation
    handleExpandedFormAnimation(oldPos, newPos);
    
    setTimeout(() => {
      setExpandedFormPos(newPos);
      setPos(newPos);
      setIsMoving(false);
      setHighlightedBox(null);
      if (window.gsap) {
        window.gsap.set([activeBox, targetBox], {
          clearProps: "transform,x,y",
        });
      }
      handlePostAnimationSequential(oldPos, newPos, arrowLabel);
    }, 800);
  };

  // Handle zero fade in after position update
  const handleZeroFadeIn = (oldPos, newPos) => {
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
    if (newZeroCount > oldZeroCount && window.gsap) {
      setTimeout(() => {
        for (let i = oldZeroCount; i < newZeroCount; i++) {
          const zeroRef = expandedZeroRefs.current[i];
          if (zeroRef) {
            window.gsap.to(zeroRef, {
              opacity: 1, 
              duration: 0.4, 
              ease: "power2.out",
              onComplete: () => {
                // Clear new zero indices after animation
                setNewZeroIndices([]);
              }
            });
          }
        }
      }, 50);
    }
  };

  // Handle expanded form animation with strikethrough effects
  const handleExpandedFormAnimation = (oldPos, newPos) => {
    if (!window.gsap) return;
    
    const gsap = window.gsap;
    const movingRight = newPos > oldPos;
    
    // Special case: transition from multiply form to fraction form (2→3)
    if (oldPos === 2 && newPos === 3) {
      const contentEl = expandedContentRef.current;
      const threeEl = expandedThreeRef.current;
      const mainPartEl = expandedMainPartRef.current;
      const multiplySign = contentEl ? contentEl.querySelector('.multiply-sign') : null;
      
      if (contentEl && threeEl && mainPartEl) {
        // Get "3" position for clone
        const threeRect = threeEl.getBoundingClientRect();
        const threeStyle = window.getComputedStyle(threeEl);
        
        // Get "1" position for clone (will become "10")
        const oneRect = mainPartEl.getBoundingClientRect();
        const oneStyle = window.getComputedStyle(mainPartEl);
        
        // Step 1: Cross out the "1"
        const strike = document.createElement('span');
        strike.className = 'strikethrough-line';
        strike.style.cssText = 'position:absolute;left:0;right:0;top:50%;height:0.25vw;background:#ff4444;transform:scaleX(0);transform-origin:left;z-index:10;';
        mainPartEl.style.position = 'relative';
        mainPartEl.appendChild(strike);
        
        // Store clone data for animation after position updates
        threeCloneAnimationRef.current = {
          three: {
            startX: threeRect.left,
            startY: threeRect.top,
            fontSize: threeStyle.fontSize,
            color: threeStyle.color,
            fontWeight: threeStyle.fontWeight
          },
          one: {
            startX: oneRect.left,
            startY: oneRect.top,
            fontSize: oneStyle.fontSize,
            color: oneStyle.color,
            fontWeight: oneStyle.fontWeight,
            mainPartEl: mainPartEl,
            strike: strike
          }
        };
        
        // Play swoosh sound when strikethrough starts
        if (window.playSound) window.playSound("swoosh");
        
        // Animate strikethrough on "1"
        gsap.to(strike, {
          scaleX: 1,
          duration: 0.25,
          ease: "power2.out",
          onComplete: () => {
            // Step 2: Fade out multiply symbol only (keep "1" visible with strikethrough)
            if (multiplySign) {
              gsap.to(multiplySign, {
                opacity: 0,
                duration: 0.2
              });
            }
            
            // Step 3: Don't hide "3" or "1" yet - they will be hidden when clones start moving
            // Position will update to 3, then animate clones in useEffect
            setExpandedFormTransition('toFraction');
          }
        });
      } else {
        // Fallback if refs not available
        setExpandedFormTransition('toFraction');
      }
      return;
    }
    
    // Special case: transition from fraction form to multiply form (3→2)
    if (oldPos === 3 && newPos === 2) {
      setExpandedFormTransition('toMultiply');
      return;
    }
    
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
    
    // Moving right within multiply form (0→1, 1→2): strikethrough then fade out zeros
    if (movingRight && oldPos < 2 && oldZeroCount > newZeroCount) {
      for (let i = newZeroCount; i < oldZeroCount; i++) {
        const zeroRef = expandedZeroRefs.current[i];
        if (zeroRef) {
          // Add strikethrough line
          const strike = document.createElement('span');
          strike.className = 'strikethrough-line';
          strike.style.cssText = 'position:absolute;left:0;right:0;top:50%;height:0.25vw;background:#ff4444;transform:scaleX(0);transform-origin:left;';
          zeroRef.style.position = 'relative';
          zeroRef.appendChild(strike);
          
          // Play swoosh sound when strikethrough starts
          if (window.playSound) window.playSound("swoosh");
          
          // Animate strikethrough then fade
          gsap.to(strike, {
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(zeroRef, {
                opacity: 0,
                duration: 0.25,
                delay: 0.1,
                onComplete: () => {
                  if (strike.parentNode) strike.remove();
                }
              });
            }
          });
        }
      }
      return;
    }
    
    // Moving right within fraction form (3→4): mark new zeros for fade-in
    if (movingRight && oldPos >= 3 && newZeroCount > oldZeroCount) {
      // Mark which zeros are new (they should start at opacity 0 and fade in)
      const newIndices = [];
      for (let i = oldZeroCount; i < newZeroCount; i++) {
        newIndices.push(i);
      }
      setNewZeroIndices(newIndices);
      return;
    }
    
    // Moving left within fraction form (4→3): fade out zeros
    if (!movingRight && oldPos > 3 && oldZeroCount > newZeroCount) {
      for (let i = newZeroCount; i < oldZeroCount; i++) {
        const zeroRef = expandedZeroRefs.current[i];
        if (zeroRef) {
          gsap.to(zeroRef, { opacity: 0, duration: 0.35 });
        }
      }
      return;
    }
    
    // Moving left within multiply form (2→1, 1→0): fade in new zeros (handled after pos update)
    // Default: fade out zeros for other cases
    if (oldZeroCount > newZeroCount) {
      for (let i = newZeroCount; i < oldZeroCount; i++) {
        const zeroRef = expandedZeroRefs.current[i];
        if (zeroRef) {
          window.gsap.to(zeroRef, {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
          });
        }
      }
    }
  };

  // Handle arrow click (nav buttons)
  const move = (direction) => {
    if (step === 5) return;
    if (mcqActive) return;
    
    const next = direction === "right" ? pos + 1 : pos - 1;
    if (next >= 0 && next <= 4) {
      // playSound && playSound("click");
      triggerTransition(next);
    }
  };

  // Get digit color for standard form display
  const getDigitColor = (idx) => {
    // Use standardFormPos for standard form box colors
    const currentPos = standardFormPos;
    const dotIdx = dotIndices[currentPos];
    const isThree = idx === 2;
    
    if (isThree) return "var(--white)";
    
    if (currentPos === 0) {
      if (idx < 2) return "var(--white-dim)";
      if (idx > 2 && idx < dotIdx) return "var(--yellow)";
      if (idx >= dotIdx && idx < dotIdx + 2) return "var(--white)";
      return "var(--white-dim)";
    } else if (currentPos === 1) {
      if (idx < 2) return "var(--white-dim)";
      if (idx === 3) return "var(--yellow)";
      if (idx >= dotIdx && idx < dotIdx + 2) return "var(--white)";
      return "var(--white-dim)";
    } else if (currentPos === 2) {
      if (idx < 2) return "var(--white-dim)";
      if (idx >= dotIdx && idx < dotIdx + 2) return "var(--white)";
      return "var(--white-dim)";
    } else if (currentPos === 3) {
      if (idx === 0) return "var(--white-dim)";
      if (idx === 1) return "var(--yellow)";
      if (idx > 2) return "var(--white-dim)";
      return "var(--white-dim)";
    } else if (currentPos === 4) {
      if (idx === 0) return "var(--yellow)";
      if (idx === 1) return "var(--yellow)";
      if (idx > 2) return "var(--white-dim)";
      return "var(--white-dim)";
    }
    
    return "var(--white-dim)";
  };

  // Get expanded form value based on position
  const getExpandedFormValue = () => {
    if (pos <= 2) {
      return Math.pow(10, 2 - pos);
    } else {
      return Math.pow(10, pos - 2);
    }
  };

  // Header and digit cell styling functions
  const shouldHighlightHeader = (index) => {
    if (step === 1) return false;
    else if (step === 2) {
      if (mcqSelectedOption !== null) return index === 0;
      return false;
    } else if (step === 3 || step === 4) {
      return index === 0 || index === 1 || index === 2;
    } else if (step === 5) {
      return index === 0;
    } else if (step >= 6 && step <= 10) {
      // Use placeValuePos for place value box header colors
      return index === placeValuePos;
    }
    return false;
  };

  const shouldHighlightDigit = (index) => {
    if (step === 1) return false;
    else if (step === 2) {
      if (mcqSelectedOption !== null) {
        if (mcqIsCorrect) return index === 0 || index === 1 || index === 2;
        else return index === 0;
      }
      return false;
    } else if (step === 3 || step === 4) {
      return index === 0 || index === 1 || index === 2;
    } else if (step === 5) {
      return index === 0;
    } else if (step >= 6 && step <= 10) {
      // Use placeValuePos for place value box digit colors
      return index === placeValuePos;
    }
    return false;
  };

  const getHeaderCellClass = (index) => {
    if (step === 2 && mcqSelectedOption !== null) {
      if (index === 0) {
        if (mcqIsCorrect) return "cell header-cell header-active-green";
        else return "cell header-cell cell-wrong";
      }
      return "cell header-cell";
    }
    
    if (!shouldHighlightHeader(index)) return "cell header-cell";
    
    if (step === 3 || step === 4) {
      if (index === 0) return "cell header-cell header-active";
      if (index === 1 || index === 2) return "cell header-cell header-active-yellow";
    } else if (step === 5) {
      if (index === 0) return "cell header-cell header-active";
    } else if (step >= 6 && step <= 10) {
      // Use placeValuePos for place value box header colors
      if (index === placeValuePos) return "cell header-cell header-active";
    }
    return "cell header-cell";
  };

  const getDigitCellClass = (index) => {
    if (step === 2 && mcqSelectedOption !== null) {
      if (mcqIsCorrect) {
        if (index === 0 || index === 1 || index === 2) return "cell digit-cell active-cell-green";
      } else {
        if (index === 0) return "cell digit-cell cell-wrong";
      }
      return "cell digit-cell";
    }
    
    if (!shouldHighlightDigit(index)) return "cell digit-cell";
    
    if (step === 3 || step === 4) {
      if (index === 0) return "cell digit-cell active-cell";
      if (index === 1 || index === 2) return "cell digit-cell active-cell-yellow";
    } else if (step === 5) {
      if (index === 0) return "cell digit-cell active-cell";
    } else if (step >= 6 && step <= 10) {
      // Use placeValuePos for place value box digit colors
      if (index === placeValuePos) return "cell digit-cell active-cell";
    }
    return "cell digit-cell";
  };

  // Box visibility helpers
  const shouldShowStandardForm = () => step >= 1;
  const getStandardFormOpacity = () => {
    if (step === 1 || step === 2) return 0;
    return 1;
  };
  const getExpandedFormOpacity = () => {
    if (step <= 3) return 0;
    return 1;
  };

  // Render curved arrow SVG
  const renderCurvedArrow = (arrowData, keyPrefix, isAbove = true, shouldAnimate = true, enableBlinkAfterAnimation = true) => {
    if (!arrowData) return null;

    const { startX, startY, endX, endY, label, id } = arrowData;
    const arrowId = `${keyPrefix}-${id || 'arrow'}`;
    const vwInPx = window.innerWidth / 100;
    const curveOffset = 3 * vwInPx;

    const controlX = (startX + endX) / 2;
    const controlY = isAbove ? Math.min(startY, endY) - curveOffset : Math.max(startY, endY) + curveOffset;

    const padding = 30;
    const minX = Math.min(startX, endX) - padding;
    const minY = isAbove ? controlY - padding : Math.min(startY, endY) - padding;
    const maxX = Math.max(startX, endX) + padding;
    const maxY = isAbove ? Math.max(startY, endY) + padding : controlY + padding;
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;

    const svgStartX = startX - minX;
    const svgStartY = startY - minY;
    const svgEndX = endX - minX;
    const svgEndY = endY - minY;
    const svgControlX = controlX - minX;
    const svgControlY = controlY - minY;

    const arrowSize = 14;
    const angle = Math.atan2(svgEndY - svgControlY, svgEndX - svgControlX);
    const arrowX1 = svgEndX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = svgEndY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = svgEndX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = svgEndY - arrowSize * Math.sin(angle + Math.PI / 6);

    const labelX = svgControlX;
    // LABEL VERTICAL POSITION:
    // - For arrows ABOVE (place value box): positive offset pushes label DOWN (below curve peak)
    // - For arrows BELOW (standard form box): negative offset pushes label DOWN (further below curve)
    const labelY = svgControlY + (isAbove ? 3 * vwInPx : .1 * vwInPx);

    // Check if this arrow has already been animated
    const alreadyAnimated = animatedArrowsRef.current.has(arrowId);
    // For non-animated arrows that should blink, apply blink class immediately
    // For animated arrows, blink class will be added via DOM after animation completes
    const shouldBlinkImmediately = step < 10 && enableBlinkAfterAnimation && !shouldAnimate;
    const blinkClass = shouldBlinkImmediately ? "blink-arrow" : "";
    const isNumberLabel = label === "1" || label === "2";
    
    // Refs to store elements for animation
    let wrapperRef = null;
    let pathRef = null;
    let arrowHeadRef = null;
    let labelRef = null;

    return React.createElement(
      "div",
      {
        key: arrowId,
        className: `arrow-wrapper ${blinkClass}`,
        style: {
          position: "absolute",
          left: `${minX}px`,
          top: `${minY}px`,
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          pointerEvents: "none",
          zIndex: 200,
        },
        ref: (el) => {
          if (el) {
            wrapperRef = el;
          }
        }
      },
      React.createElement(
        "svg",
        {
          width: svgWidth,
          height: svgHeight,
          style: { overflow: "visible" },
        },
        // Main curved path
        React.createElement("path", {
          d: `M ${svgStartX} ${svgStartY} Q ${svgControlX} ${svgControlY} ${svgEndX} ${svgEndY}`,
          stroke: "#ffd700",
          strokeWidth: 3.5,
          fill: "none",
          style: (shouldAnimate && !alreadyAnimated) ? { opacity: 0 } : {},
          ref: (el) => {
            if (el) {
              pathRef = el;
              if (shouldAnimate && !alreadyAnimated) {
                // Trigger animation after a small delay to ensure all refs are set
                setTimeout(() => {
                  animateArrowPath(el, arrowHeadRef, arrowId, wrapperRef, labelRef, enableBlinkAfterAnimation);
                }, 10);
              }
            }
          }
        }),
        // Arrow head
        React.createElement("path", {
          d: `M ${svgEndX} ${svgEndY} L ${arrowX1} ${arrowY1} M ${svgEndX} ${svgEndY} L ${arrowX2} ${arrowY2}`,
          stroke: "#ffd700",
          strokeWidth: 3.5,
          fill: "none",
          style: (shouldAnimate && !alreadyAnimated) ? { opacity: 0 } : {},
          ref: (el) => {
            if (el) {
              arrowHeadRef = el;
            }
          }
        }),
        // Text label (for "÷ 10" etc.)
        label && !isNumberLabel && React.createElement(
          "text",
          {
            x: labelX,
            y: labelY,
            fill: "#ffd700",
            fontSize: "1.3vw",
            fontWeight: "bold",
            textAnchor: "middle",
            dominantBaseline: "middle",
            style: { 
              textShadow: "0 0 0.5vw rgba(255, 215, 0, 0.8)",
              opacity: (shouldAnimate && !alreadyAnimated) ? 0 : 1
            },
            ref: (el) => {
              if (el) {
                labelRef = el;
              }
            }
          },
          label
        ),
        // Numbered label in circle (for "1", "2")
        label && isNumberLabel && React.createElement(
          "g",
          {
            style: { opacity: (shouldAnimate && !alreadyAnimated) ? 0 : 1 },
            ref: (el) => {
              if (el) {
                labelRef = el;
              }
            }
          },
          React.createElement("circle", {
            cx: labelX,
            cy: labelY,
            r: 1 * vwInPx,
            fill: "#ffd700",
            stroke: "#fff",
            strokeWidth: 1
          }),
          React.createElement(
            "text",
            {
              x: labelX,
              y: labelY,
              fill: "#1a1a2e",
              fontSize: "1.5vw",
              fontWeight: "bold",
              textAnchor: "middle",
              dominantBaseline: "middle"
            },
            label
          )
        )
      )
    );
  };

  // Render single digit swap arrow
  const renderDigitSwapArrow = () => {
    if (!showDigitSwapArrow || !digitSwapArrowData) return null;
    // Enable blinking after animation for steps before 10
    return renderCurvedArrow(digitSwapArrowData, 'digit-swap', true, true, step < 10);
  };

  // Render single decimal arrow
  const renderDecimalArrow = () => {
    if (!showDecimalArrow || !decimalArrowData) return null;
    // Enable blinking after animation for steps before 10
    return renderCurvedArrow(decimalArrowData, 'decimal', false, true, step < 10);
  };

  // Render persistent digit arrows (for steps 8-9 and step 10)
  const renderPersistentDigitArrows = () => {
    if (persistentDigitArrows.length === 0) return null;
    // Persistent arrows animate on first render, tracking prevents re-animation
    // For step 10, also enable blinking
    const enableBlink = step < 10 || step === 10;
    return persistentDigitArrows.map((arrowData, index) => 
      renderCurvedArrow(arrowData, `persistent-digit-${index}`, true, true, enableBlink)
    );
  };

  // Render persistent decimal arrows (for steps 8-9 and step 10)
  const renderPersistentDecimalArrows = () => {
    if (persistentDecimalArrows.length === 0) return null;
    // Persistent arrows animate on first render, tracking prevents re-animation
    // For step 10, also enable blinking
    const enableBlink = step < 10 || step === 10;
    return persistentDecimalArrows.map((arrowData, index) => 
      renderCurvedArrow(arrowData, `persistent-decimal-${index}`, false, true, enableBlink)
    );
  };

  // Render combined arrows for step 6 substep 3 and step 7 (both transitions: 0->1 and 1->2)
  const renderCombinedDigitArrows = () => {
    if ((step !== 6 || currentSubstep !== 3) && step !== 7) return null;
    if (!placeValueBoxRef.current) return null;
    
    const arrows = [];
    // Combined arrows should blink immediately (no animation), but only before step 10
    const enableBlink = step < 10;
    
    const chartGrid = placeValueBoxRef.current.querySelector('.chart-grid');
    if (!chartGrid) return null;
    
    const digitCells = Array.from(chartGrid.querySelectorAll('.digit-cell'));
    const containerRect = placeValueBoxRef.current.getBoundingClientRect();
    
    // Arrow 1: pos 0 -> 1
    if (digitCells[0] && digitCells[1]) {
      const leftRect = digitCells[0].getBoundingClientRect();
      const rightRect = digitCells[1].getBoundingClientRect();
      
      const arrow1Data = {
        startX: leftRect.left + leftRect.width / 2 - containerRect.left,
        startY: leftRect.top - containerRect.top,
        endX: rightRect.left + rightRect.width / 2 - containerRect.left,
        endY: rightRect.top - containerRect.top,
        type: 'digitSwap',
        label: "÷10",
        id: 'combined-digit-0-1'
      };
      arrows.push(renderCurvedArrow(arrow1Data, 'combined-digit-1', true, false, enableBlink));
    }
    
    // Arrow 2: pos 1 -> 2
    if (digitCells[1] && digitCells[2]) {
      const leftRect = digitCells[1].getBoundingClientRect();
      const rightRect = digitCells[2].getBoundingClientRect();
      
      const arrow2Data = {
        startX: leftRect.left + leftRect.width / 2 - containerRect.left,
        startY: leftRect.top - containerRect.top,
        endX: rightRect.left + rightRect.width / 2 - containerRect.left,
        endY: rightRect.top - containerRect.top,
        type: 'digitSwap',
        label: "÷ 10",
        id: 'combined-digit-1-2'
      };
      arrows.push(renderCurvedArrow(arrow2Data, 'combined-digit-2', true, false, enableBlink));
    }
    
    return arrows;
  };

  // Render combined decimal arrows for step 6 substep 3 and step 7
  const renderCombinedDecimalArrows = () => {
    if ((step !== 6 || currentSubstep !== 3) && step !== 7) return null;
    if (!standardFormBoxRef.current) return null;
    
    const arrows = [];
    // Combined arrows should blink immediately (no animation), but only before step 10
    const enableBlink = step < 10;
    
    // Labels shown only in step 7, hidden in step 6 substep 3
    const showLabel = step === 7;
    
    const containerRect = standardFormBoxRef.current.getBoundingClientRect();
    const vwInPx = window.innerWidth / 100;
    const standardDisplay = standardFormBoxRef.current.querySelector('.standard-display');
    
    if (!standardDisplay) return null;
    
    const displayRect = standardDisplay.getBoundingClientRect();
    const displayOffsetX = displayRect.left - containerRect.left;
    const allSlots = standardDisplay.querySelectorAll('.char-slot');
    let slotBottom = displayRect.bottom - containerRect.top;
    if (allSlots[0]) {
      slotBottom = allSlots[0].getBoundingClientRect().bottom - containerRect.top;
    }
    // ARROW VERTICAL POSITION: Adjust this multiplier to move arrows up/down
    // - Decrease (e.g., 0.5) to move arrows UP
    // - Increase (e.g., 2) to move arrows DOWN
    const arrowY = slotBottom - .8 * vwInPx;
    
    // Decimal arrow 1: pos 0 -> 1
    const decArrow1Data = {
      startX: displayOffsetX + (dotIndices[0] * SLOT_WIDTH * vwInPx),
      startY: arrowY,
      endX: displayOffsetX + (dotIndices[1] * SLOT_WIDTH * vwInPx),
      endY: arrowY,
      type: 'decimal',
      label: showLabel ? "÷ 10" : null,
      id: 'combined-decimal-0-1'
    };
    arrows.push(renderCurvedArrow(decArrow1Data, 'combined-decimal-1', false, false, enableBlink));
    
    // Decimal arrow 2: pos 1 -> 2
    const decArrow2Data = {
      startX: displayOffsetX + (dotIndices[1] * SLOT_WIDTH * vwInPx),
      startY: arrowY,
      endX: displayOffsetX + (dotIndices[2] * SLOT_WIDTH * vwInPx),
      endY: arrowY,
      type: 'decimal',
      label: showLabel ? "÷ 10" : null,
      id: 'combined-decimal-1-2'
    };
    arrows.push(renderCurvedArrow(decArrow2Data, 'combined-decimal-2', false, false, enableBlink));
    
    return arrows;
  };

  // Render expanded form content
  const renderExpandedForm = () => {
    const value = getExpandedFormValue();
    
    if (pos <= 2) {
      const valueStr = value.toString();
      const mainPart = valueStr.charAt(0);
      const zeros = valueStr.slice(1);
      
      return React.createElement(
        "div",
        { 
          className: "expanded-content",
          ref: expandedContentRef
        },
        React.createElement(
          "div",
          { className: "equation" },
          React.createElement("span", { 
            ref: (el) => { if (el) expandedThreeRef.current = el; },
            style: { color: "var(--white)" } 
          }, "3"),
          React.createElement("span", { className: "multiply-sign", style: { color: "var(--white)" } }, "×"),
          React.createElement(
            "span",
            { className: "value-text" },
            // Main part (the "1" in "3×1" when pos=2)
            React.createElement(
              "span", 
              { 
                ref: (el) => { if (el) expandedMainPartRef.current = el; },
                style: { color: "var(--white)", position: "relative", display: "inline-block" } 
              }, 
              mainPart
            ),
            zeros.split("").map((z, i) =>
              React.createElement(
                "span",
                {
                  key: `zero-${i}`,
                  ref: (el) => { if (el) expandedZeroRefs.current[i] = el; },
                  style: { color: "var(--yellow)", position: "relative", display: "inline-block" },
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
      const valueStr = value.toString();
      const mainPart = valueStr.charAt(0);
      const zeros = valueStr.slice(1);
      
      // Check if we just transitioned to fraction mode (for fade-in animation)
      const isFreshFraction = expandedFormTransition === 'toFraction';
      
      return React.createElement(
        "div",
        { className: "expanded-content fraction-mode" },
        React.createElement(
          "div",
          { 
            className: "fraction-wrap",
            ref: fractionWrapRef,
            style: { opacity: isFreshFraction ? 0 : 1 }
          },
          React.createElement("div", { className: "frac-num", style: { color: "var(--white)" } }, "3"),
          React.createElement(
            "div",
            { className: "frac-den" },
            React.createElement("span", { style: { color: "var(--white)" } }, mainPart),
            zeros.split("").map((z, i) => {
              // Check if this zero is new and should fade in
              const isNewZero = newZeroIndices.includes(i);
              return React.createElement(
                "span",
                {
                  key: `zero-${i}`,
                  ref: (el) => { if (el) expandedZeroRefs.current[i] = el; },
                  className: pulsateZeros ? "pulsate-zero" : "",
                  style: { color: "var(--yellow)", opacity: (isFreshFraction || isNewZero) ? 0 : 1 },
                },
                z
              );
            })
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

  // Determine if nav buttons should be shown
  const shouldShowNavButtons = () => {
    if (step >= 6 && step <= 10) {
      if (step === 6 && currentSubstep === 3) return false;
      if (step === 7) return false;
      return showNavButtons;
    }
    return step === 6;
  };

  // Get right nav button classes
  const getRightNavClass = () => {
    let className = "nav-btn";
    if (rightNavDisabled || placeValuePos === 4 || mcqActive) {
      className += " disabled";
    } else if (!leftNavDisabled || step === 10) {
      // No pulse if both buttons enabled
    } else {
      className += " pulse";
    }
    return className;
  };

  return React.createElement(
    "div",
    { ref: containerRef, className: "place-value-panel" },
    
    // Place Value Chart Box (Top)
    React.createElement(
      "div",
      { 
        ref: placeValueBoxRef,
        className: `box place-value-box ${highlightedBox === 'placeValue' ? 'box-highlighted' : ''} ${highlightedBox && highlightedBox !== 'placeValue' ? 'box-dehighlighted' : ''}`,
        style: { position: "relative" },
      },
      React.createElement("div", { className: "box-label" }, APP_DATA.labels.placeValueChart),
      React.createElement(
        "div",
        { className: "chart-grid" },
        // Header row
        placeSymbols.map((s, i) =>
          React.createElement(
            React.Fragment,
            { key: `h-${i}` },
            i === 3 &&
              React.createElement(
                "div",
                { className: "dot-marker" },
                current_language === "id" 
                  ? React.createElement("img", { 
                      src: "assets/blueComma.svg", 
                      alt: ",", 
                      style: { width: "1vw", height: "1vw" },
                      className: "decimal-comma"
                    })
                  : React.createElement("div", { className: "dot-circle" })
              ),
            React.createElement(
              "div",
              { className: getHeaderCellClass(i) },
              s
            )
          )
        ),
        // Digit row
        placeSymbols.map((_, i) =>
          React.createElement(
            React.Fragment,
            { key: `d-${i}` },
            i === 3 &&
              React.createElement(
                "div",
                { className: "dot-marker" },
                current_language === "id" 
                  ? React.createElement("img", { 
                      src: "assets/blueComma.svg", 
                      alt: ",", 
                      style: { width: "1vw", height: "1vw" },
                      className: "decimal-comma"
                    })
                  : React.createElement("div", { className: "dot-circle" })
              ),
            React.createElement(
              "div",
              {
                ref: (el) =>
                  i === placeValuePos
                    ? (digit3Ref.current = el)
                    : (digit0Refs.current[i] = el),
                className: getDigitCellClass(i),
              },
              i === placeValuePos ? "3" : "0",
              // Nav buttons below active digit
              i === placeValuePos && shouldShowNavButtons() && !isMoving && gsapLoaded &&
                React.createElement(
                  "div",
                  { className: "arrow-container" },
                  React.createElement(
                    "button",
                    {
                      onClick: () => move("left"),
                      className: `nav-btn ${leftNavDisabled || placeValuePos === 0 || mcqActive ? "disabled" : ""}`,
                      disabled: leftNavDisabled || placeValuePos === 0 || mcqActive,
                    },
                    React.createElement("span", { className: "arrow-icon" }, "‹")
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => move("right"),
                      className: getRightNavClass(),
                      disabled: rightNavDisabled || placeValuePos === 4 || mcqActive,
                    },
                    React.createElement("span", { className: "arrow-icon" }, "›")
                  )
                )
            )
          )
        )
      ),
      // Digit swap arrows
      renderDigitSwapArrow(),
      renderPersistentDigitArrows(),
      renderCombinedDigitArrows()
    ),
    
    // Bottom row: Standard Form Box and Expanded Form Box
    shouldShowStandardForm() && React.createElement(
      "div",
      { className: "bottom-row" },
      
      // Standard Form Box
      React.createElement(
        "div",
        { 
          ref: standardFormBoxRef,
          className: `box standard-form-box ${highlightedBox === 'standardForm' ? 'box-highlighted' : ''} ${highlightedBox && highlightedBox !== 'standardForm' ? 'box-dehighlighted' : ''}`,
          style: { 
            position: "relative",
            opacity: highlightedBox ? undefined : getStandardFormOpacity(),
            transition: "opacity 0.4s"
          },
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
          current_language === "id"
            ? React.createElement("img", {
                ref: decimalRef,
                src: "assets/blueComma.svg",
                alt: ",",
                className: "decimal-point decimal-comma",
                style: { 
                  left: `${dotIndices[standardFormPos] * SLOT_WIDTH}vw`,
                  width: "0.9vw",
                  height: "0.9vw",
                  position: "absolute",
                  top: "65%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 20
                }
              })
            : React.createElement("div", {
                ref: decimalRef,
                className: "decimal-point",
                style: { left: `${dotIndices[standardFormPos] * SLOT_WIDTH}vw` },
              })
        ),
        // Decimal arrows
        renderDecimalArrow(),
        renderPersistentDecimalArrows(),
        renderCombinedDecimalArrows()
      ),
      
      // Expanded Form Box
      React.createElement(
        "div",
        { 
          ref: expandedFormBoxRef,
          className: `box expanded-form-box ${highlightedBox === 'expanded' ? 'box-highlighted' : ''} ${highlightedBox && highlightedBox !== 'expanded' ? 'box-dehighlighted' : ''}`,
          style: { opacity: highlightedBox ? undefined : getExpandedFormOpacity(), transition: "opacity 0.4s" }
        },
        React.createElement("div", { className: "box-label" }, APP_DATA.labels.expandedForm),
        renderExpandedForm()
      )
    )
  );
};
