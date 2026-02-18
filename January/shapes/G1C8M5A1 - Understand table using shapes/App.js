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
    
    // If step 9, handle next row logic
    if (currentStep === 9) {
      const stepData = APP_DATA.steps[9];
      if (activeColorRow < stepData.colors.length - 1) {
        // Move to next row
        const nextRow = activeColorRow + 1;
        setActiveColorRow(nextRow);
        setColorFeedback({ show: false, type: null, message: '' });
        // Reset previous row to default, set new row to active
        setColorCellStates(prev => {
          const newStates = [...prev];
          newStates[activeColorRow] = 'default'; // Reset to default
          newStates[nextRow] = 'active';
          return newStates;
        });
        // Remove highlighting from all shapes and restore default order
        removeShapeHighlighting();
      } else {
        // All rows filled, move to next step
        removeShapeHighlighting();
        setCurrentStep(prev => prev + 1);
      }
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
  }, [currentStep, feedbackType, activeColorRow, colorCellStates, hasTappedOkThisStep, selectedShapeIds.length]);

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
  }, [filledHouseShapes, currentStep]);

  // Function to highlight shapes by color (and bring them on top so others don't show through)
  const highlightShapesByColor = useCallback((targetColorHex) => {
    if (!houseSvgRef.current) return;
    
    const svgContainer = houseSvgRef.current;
    const allShapes = svgContainer.querySelectorAll('.square, .rectangle, .circle, .triangle');
    const parent = svgContainer.querySelector('svg');
    if (!parent) return;

    // Store current DOM order so we can restore it when removing highlight
    Array.from(allShapes).forEach((shape, index) => {
      shape.setAttribute('data-order-index', String(index));
    });

    const highlighted = [];
    allShapes.forEach(shape => {
      const fill = shape.style.fill || shape.getAttribute('fill');
      const normalizedFill = normalizeColorToHex(fill);
      const normalizedTarget = normalizeColorToHex(targetColorHex);
      
      if (normalizedFill === normalizedTarget) {
        highlighted.push(shape);
        shape.style.filter = 'drop-shadow(0 0 0.5vw white) drop-shadow(0 0 1vw white)';
        shape.style.transform = 'scale(1.01)';
        shape.style.transformOrigin = 'center';
        shape.style.transition = 'filter 0.3s ease, transform 0.3s ease, opacity 0.3s ease';
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
      shape.style.transform = '';
      shape.style.opacity = '1';
    });

    // Restore original DOM order so highlighted shapes don't stay on top
    const sorted = Array.from(allShapes).sort((a, b) => {
      const i = parseInt(a.getAttribute('data-order-index') || '0', 10);
      const j = parseInt(b.getAttribute('data-order-index') || '0', 10);
      return i - j;
    });
    sorted.forEach(shape => parent.appendChild(shape));
  }, []);

  // Effect to initialize step 9 and count colors
  useEffect(() => {
    if (currentStep === 9) {
      // Count colors in house
      const counts = countShapesByColor();
      setColorCounts(counts);
      
      // Initialize table values and states
      const stepData = APP_DATA.steps[9];
      const initialValues = new Array(stepData.colors.length).fill('');
      const initialStates = new Array(stepData.colors.length).fill('default');
      initialStates[0] = 'active'; // First row is active
      setColorTableValues(initialValues);
      setColorCellStates(initialStates);
      setActiveColorRow(0);
      setColorFeedback({ show: false, type: null, message: '' });
      // Remove any highlighting when step 9 starts
      removeShapeHighlighting();
    }
  }, [currentStep, countShapesByColor, removeShapeHighlighting]);

  // Step 9: Handle numpad number click
  const handleColorTableNumberClick = (num) => {
    if (currentStep !== 9) return;
    
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
    if (currentStep !== 9) return;
    
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

  // Step 9: Handle numpad submit
  const handleColorTableSubmit = () => {
    if (currentStep !== 9) return;
    
    const stepData = APP_DATA.steps[9];
    const currentColor = stepData.colors[activeColorRow];
    const userAnswer = parseInt(colorTableValues[activeColorRow] || '0');
    const correctCount = colorCounts[normalizeColorToHex(currentColor.hex)] || 0;
    
    if (userAnswer === correctCount) {
      // Correct!
      playSound("correct");
      setColorCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'correct';
        return newStates;
      });
      setColorFeedback({
        show: true,
        type: 'correct',
        message: APP_DATA.common.correctCountMessage
          .replace(/\{count\}/g, correctCount)
          .replace(/\{color\}/g, currentColor.name.toLowerCase())
      });
      // Highlight shapes of this color
      highlightShapesByColor(currentColor.hex);
    } else {
      // Wrong
      playSound("wrong");
      setColorCellStates(prev => {
        const newStates = [...prev];
        newStates[activeColorRow] = 'wrong';
        return newStates;
      });
      setColorFeedback({
        show: true,
        type: 'wrong',
        message: APP_DATA.common.wrongCountMessage
      });
      // Remove highlighting on wrong answer
      removeShapeHighlighting();
    }
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
          headers: [APP_DATA.common.color, APP_DATA.common.numberOfShapes],
          rows: filledRows,
        });
      } else if (stepData.tableData) {
        rightVisual = React.createElement(ShapesTable, {
          title: APP_DATA.common.shapesTable,
          headers: stepData.tableData.headers,
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
            headers: stepData.tableData.headers,
            rows: stepData.tableData.rows,
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

  // Step 9: Color Counting Layout
  if (stepData && stepData.layout === "color-counting") {
    const currentColor = stepData.colors[activeColorRow];
    const isCorrect = colorCellStates[activeColorRow] === 'correct';
    const isLastRow = activeColorRow === stepData.colors.length - 1;
    const canProceed = isCorrect;
    // Check if all rows are complete (all have 'correct' state)
    const allComplete = stepData.colors.every((_, idx) => colorCellStates[idx] === 'correct');
    
    // Question text
    const questionText = APP_DATA.common.howManyShapesColor.replace(/\{color\}/g, currentColor.name.toLowerCase());
    // Nav text
    let navText = APP_DATA.common.useNumberPadToAnswer;
    if (allComplete || (isCorrect && isLastRow)) {
      navText = APP_DATA.common.tapNextToContinue;
    } else if (isCorrect && !isLastRow) {
      const nextColor = stepData.colors[activeColorRow + 1];
      navText = APP_DATA.common.tapNextToCount.replace(/\{color\}/g, nextColor.name.toLowerCase());
    }
    
    // Numpad disabled when correct
    const numpadDisabled = isCorrect;
    // Next button enabled when: (correct and not last row) OR (all rows are complete)
    const nextEnabled = canProceed || allComplete;
    
    // Create table rows
    const tableRows = stepData.colors.map((color, idx) => [
      color.name,
      colorTableValues[idx] || ''
    ]);
    
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "color-counting-layout" },
        React.createElement(QuestionPanelTop, {
          text: questionText,
        }),
        React.createElement(
          "div",
          { className: "color-counting-main" },
          // Left: House SVG (40%)
          React.createElement(
            "div",
            { className: "color-counting-left" },
            React.createElement("div", {
              ref: houseSvgRef,
              dangerouslySetInnerHTML: { __html: house_svg },
            })
          ),
          // Right: Table and Numpad (60%)
          React.createElement(
            "div",
            { className: "color-counting-right" },
            // Table column
            React.createElement(
              "div",
              { className: "color-counting-table-col" },
              React.createElement(EditableColorTable, {
                title: APP_DATA.common.colorOfShapesTable,
                headers: [APP_DATA.common.color, APP_DATA.common.numberOfShapes],
                colors: stepData.colors,
                values: colorTableValues,
                activeRowIndex: activeColorRow,
                cellStates: colorCellStates,
              })
            ),
            // Numpad column
            React.createElement(
              "div",
              { className: "color-counting-numpad-col" },
              // Feedback box (always present with fixed height)
              React.createElement(
                "div",
                {
                  className: `color-feedback-box ${colorFeedback.show ? 'show' : ''} ${colorFeedback.type || ''}`,
                  style: { opacity: colorFeedback.show ? 1 : 0 },
                  dangerouslySetInnerHTML: { 
                    __html: colorFeedback.message ? colorFeedback.message.replace(/\n/g, '<br>') : '&nbsp;'
                  }
                }
              ),
              // Numpad
              React.createElement(Numpad, {
                disabled: numpadDisabled,
                onNumberClick: handleColorTableNumberClick,
                onClear: handleColorTableClear,
                onSubmit: handleColorTableSubmit,
                submitButtonRef: undefined,
              }),
              // Next button
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
        React.createElement(NavigationBottom, {
          text: navText,
        })
      ),
      React.createElement(Nudge, { show: !!nudgePosition, position: nudgePosition })
    );
  }

  return null;
};
