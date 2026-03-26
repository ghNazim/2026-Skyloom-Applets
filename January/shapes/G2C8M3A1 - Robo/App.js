const App = () => {
  const { useState, useEffect, useLayoutEffect, useCallback, useRef } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [selectedShapeIds, setSelectedShapeIds] = useState([]); // Track by index for persistence
  const [feedbackType, setFeedbackType] = useState(null); // null, 'moreSelected', 'lessSelected', 'wrongSelected', 'correct'
  const [canSelect, setCanSelect] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [disappearedShapeIds, setDisappearedShapeIds] = useState([]); // Track disappeared shapes by unique ID
  const [filledHouseShapes, setFilledHouseShapes] = useState([]); // Track filled shapes in house_svg with colors
  
  // Step 9 state
  const [colorTableValues, setColorTableValues] = useState([]); // Array of values for each color row
  const [activeColorRow, setActiveColorRow] = useState(0); // Index of active row (0-5)
  const [colorCellStates, setColorCellStates] = useState([]); // 'default', 'active', 'correct', 'wrong' for each row
  const [colorFeedback, setColorFeedback] = useState({ show: false, type: null, message: '' }); // Feedback for step 9
  const [colorCounts, setColorCounts] = useState({}); // Store actual color counts
  const [colorSubstep, setColorSubstep] = useState(1);
  const [tallyValues, setTallyValues] = useState([]);
  const [tallyCellStates, setTallyCellStates] = useState([]);
  
  // Refs for SVG containers
  const scrambledSvgRef = useRef(null);
  const houseSvgRef = useRef(null);
  const nudgeTargetRef = useRef(null);
  const [nudgePosition, setNudgePosition] = React.useState(null);
  const jiggleTimeoutRef = useRef(null);
  const [hasTappedOkThisStep, setHasTappedOkThisStep] = useState(false);

  // Helper function to generate unique ID for a shape element
  const getShapeId = (element, index) => {
    const d = element.getAttribute('d');
    const cx = element.getAttribute('cx');
    const cy = element.getAttribute('cy');
    const x = element.getAttribute('x');
    const y = element.getAttribute('y');
    return `${d || ''}-${cx || ''}-${cy || ''}-${x || ''}-${y || ''}-${index}`;
  };

  const handleStart = () => {
    playSound("click");
    setCurrentStep(1);
  };

  const handleNext = () => {
    playSound("click");
    setFeedbackType(null);
    setSelectedShapes([]);
    setSelectedShapeIds([]);
    setCanSelect(false);
    
    if (currentStep === 9 && colorSubstep === 4) {
      const stepData = APP_DATA.steps[9];
      if (activeColorRow < stepData.colors.length - 1) {
        const nextRow = activeColorRow + 1;
        setActiveColorRow(nextRow);
        setColorFeedback({ show: false, type: null, message: '' });
        setColorCellStates(prev => {
          const newStates = [...prev];
          newStates[activeColorRow] = 'default';
          newStates[nextRow] = 'active';
          return newStates;
        });
        removeShapeHighlighting();
      } else {
        removeShapeHighlighting();
        setCurrentStep(prev => prev + 1);
      }
    } else if (currentStep === 9) {
      return;
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Function to count shapes by color in house_svg
  const countShapesByColor = useCallback(() => {
    if (!houseSvgRef.current) return {};
    
    const svgContainer = houseSvgRef.current;
    const allShapes = svgContainer.querySelectorAll('.square, .rectangle, .circle, .triangle');
    const colorMap = {};
    
    allShapes.forEach(shape => {
      const fill = shape.style.fill || shape.getAttribute('fill');
      if (fill && fill !== 'none' && fill !== '#D9D9D9' && fill !== 'rgba(217, 217, 217, 0.01)') {
        // Normalize color to hex format for comparison
        const normalizedColor = normalizeColorToHex(fill);
        colorMap[normalizedColor] = (colorMap[normalizedColor] || 0) + 1;
      }
    });
    
    return colorMap;
  }, []);

  // Helper to normalize color to hex
  const normalizeColorToHex = (color) => {
    if (!color) return '';
    // If already hex, return uppercase
    if (color.startsWith('#')) {
      return color.toUpperCase();
    }
    // Handle rgb/rgba
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0]).toString(16).padStart(2, '0');
        const g = parseInt(matches[1]).toString(16).padStart(2, '0');
        const b = parseInt(matches[2]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
      }
    }
    return color.toUpperCase();
  };

  // Get feedback message based on type
  const getFeedbackMessage = (type, shapeClass) => {
    const plural = shapeClass + 's';
    const t = APP_DATA.feedback[type];
    return t ? t.replace(/\{shape\}/g, plural) : "";
  };

  // Get nav text based on state
  const getNavText = (stepData) => {
    if (feedbackType === 'correct') {
      return stepData.navCorrect;
    }
    if (feedbackType && feedbackType !== 'correct') {
      return APP_DATA.common.tapResetToTryAgain;
    }
    return stepData.navText;
  };

  // Get question text based on state
  const getQuestionText = (stepData) => {
    if (feedbackType === 'correct') {
      return stepData.questionCorrect;
    }
    return stepData.questionText;
  };

  const handleOK = () => {
    setHasTappedOkThisStep(true);
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;

    const shapeClass = stepData.shapeClass;
    const requiredCount = stepData.requiredCount;

    // Count selected shapes of correct type
    const correctSelected = selectedShapes.filter(el => 
      el.classList.contains(shapeClass)
    );
    const wrongSelected = selectedShapes.filter(el => 
      !el.classList.contains(shapeClass)
    );

    if (wrongSelected.length > 0) {
      // User selected wrong shape types
      playSound("wrong");
      setFeedbackType('wrongSelected');
      setCanSelect(false);
    } else if (correctSelected.length > requiredCount) {
      // Too many selected
      playSound("wrong");
      setFeedbackType('moreSelected');
      setCanSelect(false);
    } else if (correctSelected.length < requiredCount) {
      // Too few selected
      playSound("wrong");
      setFeedbackType('lessSelected');
      setCanSelect(false);
    } else {
      // Correct!
      playSound("correct");
      setFeedbackType('correct');
      setCanSelect(false);

      // Get colors from selected shapes
      const colors = selectedShapes.map(el => el.getAttribute('fill'));

      // Add selected shape IDs to disappeared list
      setDisappearedShapeIds(prev => [...prev, ...selectedShapeIds]);

      // Fill house shapes with same colors
      setFilledHouseShapes(prev => [
        ...prev,
        { shapeClass, colors }
      ]);
      
      // Clear selection immediately so they vanish without selected state
      setSelectedShapes([]);
      setSelectedShapeIds([]);
    }
  };

  const handleReset = () => {
    playSound("click");
    // Deselect all shapes visually
    if (scrambledSvgRef.current) {
      const shapes = scrambledSvgRef.current.querySelectorAll('.shape-selected');
      shapes.forEach(el => {
        el.classList.remove('shape-selected');
      });
    }
    setSelectedShapes([]);
    setSelectedShapeIds([]);
    setFeedbackType(null);
    setCanSelect(true);
  };

  // Measure nudge target for positioning the tap hint
  useEffect(() => {
    if (!nudgeTargetRef.current) {
      setNudgePosition(null);
      return;
    }
    const el = nudgeTargetRef.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      setNudgePosition({ left: r.left, top: r.top, width: r.width, height: r.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [currentStep, feedbackType, activeColorRow, colorCellStates, hasTappedOkThisStep, selectedShapeIds.length, colorSubstep, tallyCellStates]);

  // Reset "nudge OK once" when entering a new step (2–5)
  useEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (stepData && stepData.layout === "without-character") {
      setHasTappedOkThisStep(false);
    }
  }, [currentStep]);

  // Effect to handle jiggling at step start (shake after 5s inactivity only). Selection is enabled immediately.
  useLayoutEffect(() => {
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData || stepData.layout !== "without-character") return;

    setIsJiggling(false);
    setCanSelect(true);

    jiggleTimeoutRef.current = setTimeout(() => {
      setIsJiggling(true);
    }, 5000);

    return () => {
      if (jiggleTimeoutRef.current) clearTimeout(jiggleTimeoutRef.current);
    };
  }, [currentStep]);

  // Effect to setup click handlers and apply visual states on scrambled SVG
  useEffect(() => {
    if (!scrambledSvgRef.current) return;

    const stepData = APP_DATA.steps[currentStep];
    if (!stepData || stepData.layout !== "without-character") return;

    const svgContainer = scrambledSvgRef.current;
    const shapeClass = stepData.shapeClass;
    const allShapes = svgContainer.querySelectorAll('.square, .rectangle, .circle, .triangle');
    const targetShapes = svgContainer.querySelectorAll(`.${shapeClass}`);

    // Apply jiggle class to target shapes
    targetShapes.forEach(shape => {
      if (isJiggling) {
        shape.classList.add('shape-jiggle');
      } else {
        shape.classList.remove('shape-jiggle');
      }
    });

    // Apply disappeared state to previously disappeared shapes
    allShapes.forEach((shape, index) => {
      const shapeId = getShapeId(shape, index);
      
      // Re-apply disappeared state
      if (disappearedShapeIds.includes(shapeId)) {
        shape.classList.add('shape-disappear');
      }

      // Re-apply selected state
      if (selectedShapeIds.includes(shapeId)) {
        shape.classList.add('shape-selected');
      } else {
        shape.classList.remove('shape-selected');
      }
    });


    // Setup click handlers
    const handleShapeClick = (e) => {
      if (!canSelect) {
        if (jiggleTimeoutRef.current) {
          clearTimeout(jiggleTimeoutRef.current);
          jiggleTimeoutRef.current = null;
        }
        setCanSelect(true);
        return;
      }

      if (jiggleTimeoutRef.current) {
        clearTimeout(jiggleTimeoutRef.current);
        jiggleTimeoutRef.current = null;
      }
      setIsJiggling(false);

      const shape = e.currentTarget;
      const shapeId = getShapeId(shape, Array.from(allShapes).indexOf(shape));

      // Don't allow selecting disappeared shapes
      if (disappearedShapeIds.includes(shapeId)) return;

      if (shape.classList.contains('shape-selected')) {
        shape.classList.remove('shape-selected');
        setSelectedShapes(prev => prev.filter(el => el !== shape));
        setSelectedShapeIds(prev => prev.filter(id => id !== shapeId));
      } else {
        shape.classList.add('shape-selected');
        setSelectedShapes(prev => [...prev, shape]);
        setSelectedShapeIds(prev => [...prev, shapeId]);
      }
      playSound("click");
    };

    allShapes.forEach(shape => {
      shape.style.cursor = canSelect ? 'pointer' : 'default';
      shape.removeEventListener('click', shape._clickHandler);
      shape._clickHandler = handleShapeClick;
      shape.addEventListener('click', handleShapeClick);
    });

    return () => {
      allShapes.forEach(shape => {
        if (shape._clickHandler) {
          shape.removeEventListener('click', shape._clickHandler);
        }
      });
    };
  }, [canSelect, isJiggling, currentStep, feedbackType, disappearedShapeIds, selectedShapeIds]);

  // Effect to fill house shapes with colors
  useEffect(() => {
    if (!houseSvgRef.current || filledHouseShapes.length === 0) return;

    const svgContainer = houseSvgRef.current;
    
    // Track which shapes have been filled for each class
    const filledCounts = {};
    
    filledHouseShapes.forEach(({ shapeClass, colors }) => {
      const houseShapes = svgContainer.querySelectorAll(`.${shapeClass}`);
      const startIndex = filledCounts[shapeClass] || 0;
      
      colors.forEach((color, i) => {
        const shapeIndex = startIndex + i;
        if (houseShapes[shapeIndex] && color) {
          const shape = houseShapes[shapeIndex];
          shape.style.transition = 'fill 0.5s ease, fill-opacity 0.5s ease, stroke 0.3s ease';
          shape.style.fill = color;
          shape.style.fillOpacity = '1';
          shape.style.stroke = 'black';
        }
      });
      
      filledCounts[shapeClass] = startIndex + colors.length;
    });
  }, [filledHouseShapes, currentStep, colorSubstep]);

  // Function to highlight shapes by color (and bring them on top so others don't show through)
  const highlightShapesByColor = useCallback((targetColorHex) => {
    if (!houseSvgRef.current) return;
    
    const svgContainer = houseSvgRef.current;
    const parent = svgContainer.querySelector('svg');
    if (!parent) return;
    const allShapes = parent.querySelectorAll('.square, .rectangle, .circle, .triangle');

    // Store ORIGINAL DOM order once so we can always restore it.
    // If we rewrite these indices on every highlight, the "baseline" order drifts
    // because highlighted shapes are appended to the end for z-ordering.
    Array.from(allShapes).forEach((shape, index) => {
      if (!shape.hasAttribute('data-order-index')) {
        shape.setAttribute('data-order-index', String(index));
      }
    });

    const highlighted = [];
    allShapes.forEach(shape => {
      const fill = shape.style.fill || shape.getAttribute('fill');
      const normalizedFill = normalizeColorToHex(fill);
      const normalizedTarget = normalizeColorToHex(targetColorHex);
      
      if (normalizedFill === normalizedTarget) {
        highlighted.push(shape);
        shape.style.filter = 'drop-shadow(0 0 0.5vw white) drop-shadow(0 0 1vw white)';
        shape.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
        shape.style.opacity = '1';
      } else {
        shape.style.opacity = '0.4';
        shape.style.transition = 'opacity 0.3s ease';
      }
    });
    // Move highlighted shapes to end of SVG so they render on top (higher z-order)
    highlighted.forEach(shape => parent.appendChild(shape));
  }, []);

  // Function to remove all highlighting and restore shapes to default DOM order
  const removeShapeHighlighting = useCallback(() => {
    if (!houseSvgRef.current) return;
    
    const svgContainer = houseSvgRef.current;
    const parent = svgContainer.querySelector('svg');
    if (!parent) return;
    const allShapes = parent.querySelectorAll('.square, .rectangle, .circle, .triangle');
    
    allShapes.forEach(shape => {
      shape.style.filter = '';
      shape.style.transition = '';
      shape.style.opacity = '1';
    });

    // Restore original DOM order so highlighted shapes return to their exact positions
    const sorted = Array.from(allShapes).sort((a, b) => {
      const i = parseInt(a.getAttribute('data-order-index') || '0', 10);
      const j = parseInt(b.getAttribute('data-order-index') || '0', 10);
      return i - j;
    });
    // Use insertBefore so each node is placed at the correct index (avoids appendChild reorder quirks with SVG)
    sorted.forEach((shape, i) => {
      const ref = i === 0 ? parent.firstChild : sorted[i - 1].nextSibling;
      parent.insertBefore(shape, ref);
    });
  }, []);

  // Effect to initialize step 9 and count colors
  useEffect(() => {
    if (currentStep === 9) {
      const counts = countShapesByColor();
      setColorCounts(counts);
      
      const stepData = APP_DATA.steps[9];
      const numColors = stepData.colors.length;
      
      setColorSubstep(1);
      setTallyValues(new Array(numColors).fill(0));
      setTallyCellStates(new Array(numColors).fill('default'));
      setColorTableValues(new Array(numColors).fill(''));
      setColorCellStates(new Array(numColors).fill('default'));
      setActiveColorRow(0);
      setColorFeedback({ show: false, type: null, message: '' });
      removeShapeHighlighting();
    }
  }, [currentStep, countShapesByColor, removeShapeHighlighting]);

  // Step 9: Handle numpad number click
  const handleColorTableNumberClick = (num) => {
    if (currentStep !== 9 || colorSubstep !== 4) return;
    
    setColorTableValues(prev => {
      const newValues = [...prev];
      // Replace current value with new digit (single digit only)
      newValues[activeColorRow] = num;
      return newValues;
    });
    
    // Reset cell state to active if it was wrong
    setColorCellStates(prev => {
      const newStates = [...prev];
      if (newStates[activeColorRow] === 'wrong') {
        newStates[activeColorRow] = 'active';
      }
      return newStates;
    });
    
    // Hide feedback when user starts typing again
    setColorFeedback({ show: false, type: null, message: '' });
    // Remove highlighting when user starts typing
    removeShapeHighlighting();
  };

  // Step 9: Handle numpad clear
  const handleColorTableClear = () => {
    if (currentStep !== 9 || colorSubstep !== 4) return;
    
    setColorTableValues(prev => {
      const newValues = [...prev];
      newValues[activeColorRow] = '';
      return newValues;
    });
    
    // Reset cell state to active if it was wrong
    setColorCellStates(prev => {
      const newStates = [...prev];
      if (newStates[activeColorRow] === 'wrong') {
        newStates[activeColorRow] = 'active';
      }
      return newStates;
    });
    
    // Hide feedback when user clears (especially if it was wrong)
    setColorFeedback({ show: false, type: null, message: '' });
    // Remove highlighting when user clears
    removeShapeHighlighting();
  };

  // Step 9 Substep 4: Handle numpad submit
  const handleColorTableSubmit = () => {
    if (currentStep !== 9 || colorSubstep !== 4) return;
    
    const stepData = APP_DATA.steps[9];
    const currentColor = stepData.colors[activeColorRow];
    const userAnswer = parseInt(colorTableValues[activeColorRow] || '0');
    const correctCount = colorCounts[normalizeColorToHex(currentColor.hex)] || 0;
    
    if (userAnswer === correctCount) {
      playSound("correct");
      setColorCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'correct';
        return newStates;
      });
      setColorFeedback({
        show: true,
        type: 'correct',
        message: APP_DATA.common.step9CountCorrectFeedback
          .replace(/\{count\}/g, correctCount)
          .replace(/\{color\}/g, currentColor.name.toLowerCase())
      });
      highlightShapesByColor(currentColor.hex);
    } else {
      playSound("wrong");
      setColorCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'wrong';
        return newStates;
      });
      setColorFeedback({
        show: true,
        type: 'wrong',
        message: APP_DATA.common.step9CountWrongFeedback
      });
      removeShapeHighlighting();
    }
  };

  // Step 9 Substep 1: Fill first column
  const handleSubstep1Fill = () => {
    playSound("click");
    setColorSubstep(2);
    setTallyCellStates(prev => {
      const newStates = [...prev];
      newStates[0] = 'active';
      return newStates;
    });
    setActiveColorRow(0);
  };

  // Step 9 Substep 2: Tally cell click (increment)
  const handleTallyCellClick = (rowIndex) => {
    if (rowIndex !== activeColorRow) return;
    playSound("tick");
    setTallyValues(prev => {
      const newValues = [...prev];
      newValues[rowIndex] = (newValues[rowIndex] + 1) % 11;
      return newValues;
    });
    setTallyCellStates(prev => {
      const newStates = [...prev];
      if (newStates[rowIndex] === 'wrong') {
        newStates[rowIndex] = 'active';
      }
      return newStates;
    });
    setColorFeedback({ show: false, type: null, message: '' });
  };

  // Step 9 Substep 2: Check tally
  const handleTallyCheck = () => {
    const stepData = APP_DATA.steps[9];
    const currentColor = stepData.colors[activeColorRow];
    const userTally = tallyValues[activeColorRow];
    const correctCount = colorCounts[normalizeColorToHex(currentColor.hex)] || 0;
    
    if (userTally === correctCount) {
      playSound("correct");
      setTallyCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'correct';
        return newStates;
      });
      setColorFeedback({
        show: true,
        type: 'correct',
        message: APP_DATA.common.step9TallyCorrectFeedback
          .replace(/\{color\}/g, currentColor.name.toLowerCase())
      });
      highlightShapesByColor(currentColor.hex);
    } else {
      playSound("wrong");
      setTallyCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'wrong';
        return newStates;
      });
      setColorFeedback({
        show: true,
        type: 'wrong',
        message: APP_DATA.common.step9TallyWrongFeedback
      });
    }
  };

  // Step 9 Substep 2: Reset tally
  const handleTallyReset = () => {
    playSound("click");
    setTallyValues(prev => {
      const newValues = [...prev];
      newValues[activeColorRow] = 0;
      return newValues;
    });
    setTallyCellStates(prev => {
      const newStates = [...prev];
      newStates[activeColorRow] = 'active';
      return newStates;
    });
    setColorFeedback({ show: false, type: null, message: '' });
  };

  // Step 9 Substep 2: Next tally row or move to substep 3
  const handleTallyNext = () => {
    playSound("click");
    removeShapeHighlighting();
    setColorFeedback({ show: false, type: null, message: '' });
    
    const stepData = APP_DATA.steps[9];
    if (activeColorRow < stepData.colors.length - 1) {
      const nextRow = activeColorRow + 1;
      setActiveColorRow(nextRow);
      setTallyCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'default';
        newStates[nextRow] = 'active';
        return newStates;
      });
    } else {
      setTallyCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'default';
        return newStates;
      });
      setColorSubstep(3);
    }
  };

  // Step 9 Substep 3: Next button to move to substep 4
  const handleSubstep3Next = () => {
    playSound("click");
    setColorSubstep(4);
    setActiveColorRow(0);
    setColorCellStates(prev => {
      const newStates = new Array(prev.length).fill('default');
      newStates[0] = 'active';
      return newStates;
    });
    setColorFeedback({ show: false, type: null, message: '' });
  };

  // Step 11: Handle start over (reset all state)
  const handleStartOver = () => {
    playSound("click");
    setCurrentStep(0);
    setSelectedShapes([]);
    setSelectedShapeIds([]);
    setFeedbackType(null);
    setCanSelect(false);
    setIsJiggling(false);
    setDisappearedShapeIds([]);
    setFilledHouseShapes([]);
    setColorTableValues([]);
    setActiveColorRow(0);
    setColorCellStates([]);
    setColorFeedback({ show: false, type: null, message: '' });
    setColorCounts({});
    setColorSubstep(1);
    setTallyValues([]);
    setTallyCellStates([]);
  };

  // Step 0: Start Fullscreen
  if (currentStep === 0) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "applet-container" },
        React.createElement(
          "div",
          { className: "app-main-content", style: { position: "relative" } },
          React.createElement(Fullscreen, {
            heading: APP_DATA.start.heading,
            text: APP_DATA.start.text,
            buttonText: APP_DATA.start.buttonText,
            onButtonClick: handleStart,
            buttonRef: nudgeTargetRef,
          })
        )
      ),
      React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  const stepData = APP_DATA.steps[currentStep];

  // Step 7, 11: Fullscreen Layout
  if (stepData && stepData.layout === "fullscreen") {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "applet-container" },
        React.createElement(
          "div",
          { className: "app-main-content", style: { position: "relative" } },
          React.createElement(Fullscreen, {
            heading: stepData.heading,
            text: stepData.text,
            buttonText: stepData.buttonText,
            onButtonClick: currentStep === 11 ? handleStartOver : handleNext,
            showCharacter: currentStep === 11,
            characterImage: currentStep === 11 ? "boyCelebration.png" : null,
            buttonRef: nudgeTargetRef,
          })
        )
      ),
      React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  // Step 1, 6, 8, 10: With Character Layout
  if (stepData && stepData.layout === "with-character") {
    // Step 6: Show house_svg (colored) on left and table on right
    // Step 8: Show only house_svg (colored) on left, no right visual
    // Step 1: Show scrambled.svg on left and table on right
    // Step 10: Show house_svg (colored) on left and filled color table on right
    const showHouseSvg = currentStep === 6 || currentStep === 8 || currentStep === 10;
    const showRightVisual = currentStep !== 8;
    
    // For step 10, create filled table from step 9 data
    let rightVisual = null;
    if (showRightVisual) {
      if (currentStep === 10) {
        // Create filled table from step 9
        const step9Data = APP_DATA.steps[9];
        const filledRows = step9Data.colors.map((color, index) => [
          color.name,
          colorTableValues[index] || ''
        ]);
        rightVisual = React.createElement(ShapesTable, {
          title: APP_DATA.common.colorOfShapesTable,
          headers: [APP_DATA.common.color, APP_DATA.common.tallyMarks, APP_DATA.common.numberOfShapes],
          rows: filledRows,
        });
      } else if (stepData.tableData) {
        rightVisual = React.createElement(ShapesTable, {
          title: APP_DATA.common.shapesTable,
          headers: [stepData.tableData.headers[0], APP_DATA.common.tallyMarks, stepData.tableData.headers[1]],
          rows: stepData.tableData.rows,
        });
      }
    }
    
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "applet-container" },
        React.createElement(
          "div",
          { className: "with-character-layout" },
          React.createElement(CharacterPanel, {
          characterImage: stepData.characterImage,
          characterText: stepData.characterText,
        }),
        React.createElement(ContentPanel, {
          mainVisualLeft: showHouseSvg 
            ? React.createElement("div", {
                ref: houseSvgRef,
                dangerouslySetInnerHTML: { __html: house_svg },
              })
            : React.createElement("img", {
                src: "assets/scrambled.svg",
                alt: APP_DATA.common.altScrambledShapes,
              }),
          mainVisualRight: rightVisual,
          buttonText: APP_DATA.common.next,
          onButtonClick: handleNext,
          bottomText: stepData.bottomText,
          buttonRef: nudgeTargetRef,
        })
      )),
      React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  // Step 2-5: Without Character Layout (shape selection steps)
  if (stepData && stepData.layout === "without-character") {
    const isCorrect = feedbackType === 'correct';
    const isWrong = feedbackType && feedbackType !== 'correct';
    
    // Determine which button is active
    const okDisabled = isCorrect || isWrong;
    const resetDisabled = !isWrong;
    const nextDisabled = !isCorrect;

    // Nudge on OK only in step 2, only after user has selected exactly 4 squares, and only until OK is clicked once
    const correctSelectedCount = selectedShapes.filter(el => el.classList.contains(stepData.shapeClass)).length;
    const wrongSelectedCount = selectedShapes.filter(el => !el.classList.contains(stepData.shapeClass)).length;
    const hasCorrectSelection = wrongSelectedCount === 0 && correctSelectedCount === stepData.requiredCount;
    const showNudgeOnOk = currentStep === 2 && !hasTappedOkThisStep && hasCorrectSelection && !okDisabled;

    // Create instruction row content
    const instructionContent = feedbackType 
      ? React.createElement(
          "div",
          { className: `feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}` },
          getFeedbackMessage(feedbackType, stepData.shapeClass)
        )
      : "";

    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "without-character-layout" },
        React.createElement(QuestionPanelTop, {
          text: getQuestionText(stepData),
        }),
        React.createElement(AppMainContentMiddle, {
          svgLeft: React.createElement("div", {
            ref: houseSvgRef,
            dangerouslySetInnerHTML: { __html: house_svg },
          }),
          svgRight: React.createElement("div", {
            ref: scrambledSvgRef,
            className: "scrambled-svg-container",
            dangerouslySetInnerHTML: { __html: scrambled_svg },
          }),
          tableComponent: React.createElement(ShapesTable, {
            title: APP_DATA.common.shapesTable,
            headers: [stepData.tableData.headers[0], APP_DATA.common.tallyMarks, stepData.tableData.headers[1]],
            rows: stepData.tableData.rows,
            highlightedRowIndex: currentStep - 2,
          }),
          instructionRow: instructionContent,
          buttonsRow: React.createElement(
            React.Fragment,
            null,
            React.createElement(Button, {
              ref: showNudgeOnOk ? nudgeTargetRef : undefined,
              text: APP_DATA.common.ok,
              onClick: handleOK,
              className: "action-button",
              disabled: okDisabled,
            }),
            React.createElement(Button, {
              ref: !resetDisabled ? nudgeTargetRef : undefined,
              text: APP_DATA.common.reset,
              onClick: handleReset,
              className: "action-button",
              disabled: resetDisabled,
            }),
            React.createElement(Button, {
              ref: !nextDisabled ? nudgeTargetRef : undefined,
              text: APP_DATA.common.next,
              onClick: handleNext,
              className: "action-button",
              disabled: nextDisabled,
            })
          ),
        }),
        React.createElement(NavigationBottom, {
          text: getNavText(stepData),
        })
      ),
      React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  // Step 9: Color Counting Layout (4 substeps)
  if (stepData && stepData.layout === "color-counting") {
    const stepColors = stepData.colors;
    const currentColor = stepColors[activeColorRow];

    const createHouseLeft = () => React.createElement(
      "div",
      { className: "color-counting-left" },
      React.createElement("div", {
        ref: houseSvgRef,
        dangerouslySetInnerHTML: { __html: house_svg },
      })
    );

    const createFeedbackBox = () => React.createElement(
      "div",
      {
        className: `color-feedback-box ${colorFeedback.show ? 'show' : ''} ${colorFeedback.type || ''}`,
        style: { opacity: colorFeedback.show ? 1 : 0 },
        dangerouslySetInnerHTML: {
          __html: colorFeedback.message ? colorFeedback.message.replace(/\n/g, '<br>') : '&nbsp;'
        }
      }
    );

    // ---- SUBSTEP 1: Empty table, fill button ----
    if (colorSubstep === 1) {
      return React.createElement(
        "div", { className: "applet-container" },
        React.createElement(
          "div", { className: "color-counting-layout" },
          React.createElement(QuestionPanelTop, { text: APP_DATA.common.step9FillColumnQuestion }),
          React.createElement(
            "div", { className: "color-counting-main" },
            createHouseLeft(),
            React.createElement(
              "div", { className: "color-counting-right single-col" },
              React.createElement(
                "div", { className: "color-counting-table-col single-col" },
                React.createElement(
                  "div", { className: "color-counting-table-wrap" },
                  React.createElement(EditableColorTable, {
                    title: APP_DATA.common.colorOfShapesTable,
                    headers: [APP_DATA.common.color, APP_DATA.common.tallyMarks, APP_DATA.common.numberOfShapes],
                    colors: stepColors,
                    showColorNames: false,
                    tallyHtmls: new Array(stepColors.length).fill(''),
                    tallyCellStates: new Array(stepColors.length).fill('default'),
                    values: new Array(stepColors.length).fill(''),
                    cellStates: new Array(stepColors.length).fill('default'),
                  })
                ),
                React.createElement(
                  "div", { className: "color-counting-feedback-wrap" },
                  createFeedbackBox()
                ),
                React.createElement(
                  "div", { className: "color-counting-controls" },
                  React.createElement(Button, {
                    ref: nudgeTargetRef,
                    text: APP_DATA.common.step9FillColumnButton,
                    onClick: handleSubstep1Fill,
                    className: "substep1-fill-btn",
                  })
                )
              )
            )
          ),
          React.createElement(NavigationBottom, { text: " " })
        ),
        React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
      );
    }

    // ---- SUBSTEP 2: Tally marking ----
    if (colorSubstep === 2) {
      const questionText = APP_DATA.common.howManyShapesColor.replace(/\{color\}/g, currentColor.name.toLowerCase());
      const tallyHtmls = stepColors.map((_, idx) =>
        typeof showGreyWhiteTally === "function" ? showGreyWhiteTally(tallyValues[idx]) : ""
      );
      const currentTallyState = tallyCellStates[activeColorRow] || 'default';
      const isCorrect = currentTallyState === 'correct';
      const isWrong = currentTallyState === 'wrong';
      const checkDisabled = isCorrect || isWrong;
      const resetDisabled = isCorrect;
      const nextDisabled = !isCorrect;
      const navText = isWrong
        ? APP_DATA.common.step9TallyTapResetToEnter
        : isCorrect
          ? APP_DATA.common.step9TallyTapNextToContinue
          : APP_DATA.common.step9TallyBottomText.replace(/\{color\}/g, currentColor.name.toLowerCase());

      return React.createElement(
        "div", { className: "applet-container" },
        React.createElement(
          "div", { className: "color-counting-layout" },
          React.createElement(QuestionPanelTop, { text: questionText }),
          React.createElement(
            "div", { className: "color-counting-main" },
            createHouseLeft(),
            React.createElement(
              "div", { className: "color-counting-right single-col" },
              React.createElement(
                "div", { className: "color-counting-table-col single-col" },
                React.createElement(
                  "div", { className: "color-counting-table-wrap" },
                  React.createElement(EditableColorTable, {
                    title: APP_DATA.common.colorOfShapesTable,
                    headers: [APP_DATA.common.color, APP_DATA.common.tallyMarks, APP_DATA.common.numberOfShapes],
                    colors: stepColors,
                    showColorNames: true,
                    tallyHtmls: tallyHtmls,
                    tallyCellStates: tallyCellStates,
                    onTallyCellClick: handleTallyCellClick,
                    values: new Array(stepColors.length).fill(''),
                    cellStates: new Array(stepColors.length).fill('default'),
                  })
                ),
                React.createElement(
                  "div", { className: "color-counting-feedback-wrap" },
                  createFeedbackBox()
                ),
                React.createElement(
                  "div", { className: "color-counting-controls" },
                  React.createElement(
                    "div", { className: "tally-action-buttons-row" },
                    React.createElement(Button, {
                      text: "✓",
                      onClick: handleTallyCheck,
                      className: "tally-action-btn check-btn",
                      disabled: checkDisabled,
                    }),
                    React.createElement(Button, {
                      ref: isWrong ? nudgeTargetRef : undefined,
                      text: "↻",
                      onClick: handleTallyReset,
                      className: "tally-action-btn reset-btn",
                      disabled: resetDisabled,
                    }),
                    React.createElement(Button, {
                      ref: !nextDisabled ? nudgeTargetRef : undefined,
                      text: ">",
                      onClick: handleTallyNext,
                      className: "tally-action-btn next-btn",
                      disabled: nextDisabled,
                    })
                  )
                )
              )
            )
          ),
          React.createElement(NavigationBottom, { text: navText })
        ),
        React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
      );
    }

    // ---- SUBSTEP 3: Show actual tally, empty counts, Next button ----
    if (colorSubstep === 3) {
      const tallyHtmls = stepColors.map((_, idx) =>
        typeof showTally === "function" ? showTally(tallyValues[idx]) : ""
      );

      return React.createElement(
        "div", { className: "applet-container" },
        React.createElement(
          "div", { className: "color-counting-layout" },
          React.createElement(QuestionPanelTop, { text: APP_DATA.common.step9EnterThirdColumnQuestion }),
          React.createElement(
            "div", { className: "color-counting-main" },
            createHouseLeft(),
            React.createElement(
              "div", { className: "color-counting-right single-col" },
              React.createElement(
                "div", { className: "color-counting-table-col single-col" },
                React.createElement(
                  "div", { className: "color-counting-table-wrap" },
                  React.createElement(EditableColorTable, {
                    title: APP_DATA.common.colorOfShapesTable,
                    headers: [APP_DATA.common.color, APP_DATA.common.tallyMarks, APP_DATA.common.numberOfShapes],
                    colors: stepColors,
                    showColorNames: true,
                    tallyHtmls: tallyHtmls,
                    tallyCellStates: new Array(stepColors.length).fill('default'),
                    values: new Array(stepColors.length).fill(''),
                    cellStates: new Array(stepColors.length).fill('default'),
                  })
                ),
                React.createElement(
                  "div", { className: "color-counting-feedback-wrap" },
                  createFeedbackBox()
                ),
                React.createElement(
                  "div", { className: "color-counting-controls" },
                  React.createElement(Button, {
                    ref: nudgeTargetRef,
                    text: APP_DATA.common.next,
                    onClick: handleSubstep3Next,
                    className: "color-counting-next-button",
                  })
                )
              )
            )
          ),
          React.createElement(NavigationBottom, { text: APP_DATA.common.step9EnterThirdColumnBottomText })
        ),
        React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
      );
    }

    // ---- SUBSTEP 4: Fill count column with numpad ----
    if (colorSubstep === 4) {
      const isCorrect = colorCellStates[activeColorRow] === 'correct';
      const isLastRow = activeColorRow === stepColors.length - 1;
      const allComplete = stepColors.every((_, idx) => colorCellStates[idx] === 'correct');
      const questionText = APP_DATA.common.howManyShapesColor.replace(/\{color\}/g, currentColor.name.toLowerCase());
      let navText = APP_DATA.common.useNumberPadToAnswer;
      if (allComplete || (isCorrect && isLastRow)) {
        navText = APP_DATA.common.tapNextToContinue;
      } else if (isCorrect && !isLastRow) {
        const nextColor = stepColors[activeColorRow + 1];
        navText = APP_DATA.common.tapNextToCount.replace(/\{color\}/g, nextColor.name.toLowerCase());
      }
      const numpadDisabled = isCorrect;
      const nextEnabled = isCorrect || allComplete;
      const tallyHtmls = stepColors.map((_, idx) =>
        typeof showTally === "function" ? showTally(tallyValues[idx]) : ""
      );

      return React.createElement(
        "div", { className: "applet-container" },
        React.createElement(
          "div", { className: "color-counting-layout" },
          React.createElement(QuestionPanelTop, { text: questionText }),
          React.createElement(
            "div", { className: "color-counting-main no-left" },
            React.createElement(
              "div", { className: "color-counting-right" },
              React.createElement(
                "div", { className: "color-counting-table-col" },
                React.createElement(EditableColorTable, {
                  title: APP_DATA.common.colorOfShapesTable,
                  headers: [APP_DATA.common.color, APP_DATA.common.tallyMarks, APP_DATA.common.numberOfShapes],
                  colors: stepColors,
                  showColorNames: true,
                  tallyHtmls: tallyHtmls,
                  tallyCellStates: new Array(stepColors.length).fill('default'),
                  values: colorTableValues,
                  activeRowIndex: activeColorRow,
                  cellStates: colorCellStates,
                })
              ),
              React.createElement(
                "div", { className: "color-counting-numpad-col" },
                createFeedbackBox(),
                React.createElement(Numpad, {
                  disabled: numpadDisabled,
                  onNumberClick: handleColorTableNumberClick,
                  onClear: handleColorTableClear,
                  onSubmit: handleColorTableSubmit,
                }),
                React.createElement(Button, {
                  ref: nextEnabled ? nudgeTargetRef : undefined,
                  text: APP_DATA.common.next,
                  onClick: handleNext,
                  className: "color-counting-next-button",
                  disabled: !nextEnabled,
                })
              )
            )
          ),
          React.createElement(NavigationBottom, { text: navText })
        ),
        React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
      );
    }
  }

  return null;
};
