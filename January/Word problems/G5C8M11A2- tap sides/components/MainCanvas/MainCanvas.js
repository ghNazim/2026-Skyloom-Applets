const MainCanvas = ({
  step,
  onEnableNext,
  onDisableNext,
  onUpdateTexts,
  onGoToStep,
}) => {
  const { useState, useEffect, useRef, useMemo } = React;

  // Scale and offset for positioning the shape in 500x500 viewBox
  const scale = 8.5;
  const offsetX = 80;
  const offsetY =40;

  // Define points A-H (anticlockwise from top-left)
  const points = useMemo(() => ({
    A: { x: 0 * scale + offsetX, y: 0 * scale + offsetY },
    B: { x: 0 * scale + offsetX, y: 23 * scale + offsetY },
    C: { x: 16 * scale + offsetX, y: 23 * scale + offsetY },
    D: { x: 16 * scale + offsetX, y: 43 * scale + offsetY },
    E: { x: 26 * scale + offsetX, y: 43 * scale + offsetY },
    F: { x: 26 * scale + offsetX, y: 23 * scale + offsetY },
    G: { x: 40 * scale + offsetX, y: 23 * scale + offsetY },
    H: { x: 40 * scale + offsetX, y: 0 * scale + offsetY },
  }), []);

  // UI States
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackClass, setFeedbackClass] = useState("neutral");
  
  // Edge states
  const [edgesYellow, setEdgesYellow] = useState(false);
  const [showCornerLabels, setShowCornerLabels] = useState(false);
  
  // Step 1 states
  const [step1Phase, setStep1Phase] = useState(0);
  const [showABLabel, setShowABLabel] = useState(false);
  const [showCDLabel, setShowCDLabel] = useState(false);
  const [showDELabel, setShowDELabel] = useState(false);
  const [showCFLine, setShowCFLine] = useState(false);
  const [showCFLabel, setShowCFLabel] = useState(false);
  const [showBGLine, setShowBGLine] = useState(false);
  const [showStep1Equation, setShowStep1Equation] = useState(false);
  const [clickedEdges, setClickedEdges] = useState({}); // Track clicked edges to remove circles
  
  // Animation state
  const [animatingLine, setAnimatingLine] = useState(null);
  const animLineRef = useRef(null);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const lastAnimationRef = useRef(null); // { sourceEdge, targetEdge, color } for replay
  
  // Step 2 states
  const [step2Phase, setStep2Phase] = useState(0);
  const [step2FlippedBoxes, setStep2FlippedBoxes] = useState({});
  const [showEquation, setShowEquation] = useState(false);
  const step4CFToDEDoneRef = useRef(false);
  
  // Step 3 & 4 states
  const [inputValue, setInputValue] = useState("");
  const [inputState, setInputState] = useState("");
  const [numpadDisabled, setNumpadDisabled] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);

  // Edges definition
  const edges = useMemo(() => [
    { id: 'AB', p1: 'A', p2: 'B' },
    { id: 'BC', p1: 'B', p2: 'C' },
    { id: 'CD', p1: 'C', p2: 'D' },
    { id: 'DE', p1: 'D', p2: 'E' },
    { id: 'EF', p1: 'E', p2: 'F' },
    { id: 'FG', p1: 'F', p2: 'G' },
    { id: 'GH', p1: 'G', p2: 'H' },
    { id: 'AH', p1: 'A', p2: 'H' },
  ], []);

  // Permanent labels with offsets
  const permanentLabels = useMemo(() => [
    { id: 'AH', text: '40 cm', offsetX: 0, offsetY: -35 },
    { id: 'GH', text: '23 cm', offsetX: 50, offsetY: 0 },
    { id: 'BC', text: '16 cm', offsetX: 0, offsetY: 35 },
    { id: 'FG', text: '14 cm', offsetX: 0, offsetY: 35 },
    { id: 'EF', text: '20 cm', offsetX: 50, offsetY: 0 },
  ], []);

  // Corner label offsets
  const cornerLabelOffsets = useMemo(() => ({
    A: { x: -20, y: -15 },
    B: { x: -20, y: 15 },
    C: { x: -10, y: -20 },
    D: { x: -20, y: 15 },
    E: { x: 20, y: 15 },
    F: { x: 10, y: -20 },
    G: { x: 20, y: 15 },
    H: { x: 20, y: -15 },
  }), []);

  // Initialize step
  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (!stepData) return;

    // Reset all states
    setShowButton(false);
    setButtonText("");
    setShowFeedback(false);
    setFeedbackText("");
    setFeedbackClass("neutral");
    setEdgesYellow(false);
    setShowCornerLabels(false);
    setStep1Phase(0);
    setShowABLabel(false);
    setShowCDLabel(false);
    setShowDELabel(false);
    setShowCFLine(false);
    setShowCFLabel(false);
    setShowBGLine(false);
    setAnimatingLine(null);
    setShowStep1Equation(false);
    setClickedEdges({});
    setStep2Phase(0);
    setStep2FlippedBoxes({});
    setShowEquation(false);
    setInputValue("");
    setInputState("");
    setNumpadDisabled(false);
    setShowNumpad(false);
    setShowReplayButton(false);
    lastAnimationRef.current = null;
    // Clean up circle animations
    Object.values(circleRefs.current).forEach(ref => {
      if (ref?.current && typeof gsap !== 'undefined') {
        gsap.killTweensOf(ref.current);
      }
    });
    circleRefs.current = {};

    onDisableNext();

    switch (step) {
      case 0:
        setShowButton(true);
        setButtonText(stepData.buttonText);
        break;
      case 1:
        setShowButton(true);
        setButtonText(stepData.buttonText);
        break;
      case 2:
        setShowCornerLabels(true);
        setShowABLabel(true);
        setShowCDLabel(true);
        setShowCFLine(true);
        setShowCFLabel(true);
        setShowEquation(true);
        // Note: BG line is NOT shown in step 2 (removed per requirements)
        break;
      case 3:
        setShowCornerLabels(true);
        setShowABLabel(true);
        setShowCDLabel(true);
        setShowCFLine(true);
        // CF label shows "?" until answer is correct
        setShowCFLabel(true);
        setShowEquation(true);
        setShowNumpad(true);
        break;
      case 4:
        setShowCornerLabels(true);
        setShowABLabel(true);
        setShowCDLabel(true);
        setShowDELabel(false); // Will show after CF→DE animation
        setShowCFLine(true);
        setShowCFLabel(true);
        setShowEquation(true);
        setShowNumpad(true);
        step4CFToDEDoneRef.current = false;
        break;
    }
  }, [step]);

  // Step 4: when entering step 4, animate CF line to DE, then show DE label and remove CF label
  useEffect(() => {
    if (step !== 4 || step4CFToDEDoneRef.current) return;
    step4CFToDEDoneRef.current = true;
    animateEdge('CF', 'DE', '#fbbf24', (phase) => {
      if (phase) {
        setShowCFLabel(false);
        setShowCFLine(false);
        setShowDELabel(true);
      }
    }, false);
  }, [step]);

  // Get midpoint of an edge
  const getMidpoint = (edgeId) => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return { x: 0, y: 0 };
    const p1 = points[edge.p1];
    const p2 = points[edge.p2];
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  };

  // Handle button click
  const handleButtonClick = () => {
    playSound("click");
    const stepData = APP_DATA.steps[step];

    switch (step) {
      case 0:
        setShowButton(false);
        setEdgesYellow(true);
        setShowFeedback(true);
        setFeedbackText(stepData.feedback);
        setFeedbackClass("neutral");
        onUpdateTexts(null, stepData.navAfter);
        onEnableNext();
        break;
      case 1:
        setShowButton(false);
        setShowCornerLabels(true);
        setStep1Phase(1);
        onUpdateTexts(stepData.questionAfterButton, stepData.navAfterButton);
        break;
    }
  };

  // Get source line endpoints: HG = H to G, FE = F to E, DE = D to E, AH = A to H, CF = C to F
  const getSourcePoints = (sourceEdge) => {
    if (sourceEdge === 'HG') return { p1: points.H, p2: points.G };
    if (sourceEdge === 'FE') return { p1: points.F, p2: points.E };
    if (sourceEdge === 'CF') return { p1: points.C, p2: points.F };
    const edge = edges.find(e => e.id === sourceEdge);
    if (edge) return { p1: points[edge.p1], p2: points[edge.p2] };
    return { p1: points.A, p2: points.B };
  };

  // Animate edge from source to target position
  const animateEdge = (sourceEdge, targetEdge, color, callback, isReplay) => {
    const { p1: sourceP1, p2: sourceP2 } = getSourcePoints(sourceEdge);
    
    let targetP1, targetP2;
    if (targetEdge === 'AB') {
      targetP1 = points.A;
      targetP2 = points.B;
    } else if (targetEdge === 'CD') {
      targetP1 = points.C;
      targetP2 = points.D;
    } else if (targetEdge === 'CF') {
      targetP1 = points.C;
      targetP2 = points.F;
    } else if (targetEdge === 'BG') {
      targetP1 = points.B;
      targetP2 = points.G;
    } else if (targetEdge === 'DE') {
      targetP1 = points.D;
      targetP2 = points.E;
    }

    setAnimatingLine({
      x1: sourceP1.x,
      y1: sourceP1.y,
      x2: sourceP2.x,
      y2: sourceP2.y,
      targetX1: targetP1.x,
      targetY1: targetP1.y,
      targetX2: targetP2.x,
      targetY2: targetP2.y,
      color: color
    });

    const onAnimComplete = () => {
      setAnimatingLine(null);
      if (isReplay) {
        setShowReplayButton(true);
        return;
      }
      // Show label instantly, then wait 0.5s before moving to next
      if (callback) callback(true); // true = label shown instantly
      setTimeout(() => {
        if (callback) callback(false); // false = now update phase/nav
      }, 500);
    };

    // Use GSAP for animation
    setTimeout(() => {
      const line = animLineRef.current;
      if (line && typeof gsap !== 'undefined') {
        gsap.to(line, {
          attr: {
            x1: targetP1.x,
            y1: targetP1.y,
            x2: targetP2.x,
            y2: targetP2.y
          },
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: onAnimComplete
        });
      } else {
        setTimeout(onAnimComplete, 600);
      }
    }, 50);
  };

  // Handle edge click for step 1
  const handleEdgeClick = (edgeId) => {
    if (step !== 1) return;
    playSound("click");
    setShowReplayButton(false); // Remove replay when user clicks next edge
    setClickedEdges(prev => ({ ...prev, [edgeId]: true })); // Mark edge as clicked to remove circle
    const stepData = APP_DATA.steps[1];

    const runAB = () => {
      lastAnimationRef.current = { sourceEdge: 'HG', targetEdge: 'AB', color: '#fbbf24' };
      animateEdge('HG', 'AB', '#fbbf24', (phase) => {
        if (phase) {
          setShowABLabel(true);
          setShowReplayButton(true);
        } else {
          setStep1Phase(2);
          onUpdateTexts(null, stepData.navAfterAB);
        }
      }, false);
    };
    const runCD = () => {
      lastAnimationRef.current = { sourceEdge: 'FE', targetEdge: 'CD', color: '#fbbf24' };
      animateEdge('FE', 'CD', '#fbbf24', (phase) => {
        if (phase) {
          setShowCDLabel(true);
          setShowReplayButton(true);
        } else {
          setStep1Phase(3);
          onUpdateTexts(null, stepData.navAfterCD);
        }
      }, false);
    };
    const runDE = () => {
      lastAnimationRef.current = { sourceEdge: 'DE', targetEdge: 'CF', color: '#fbbf24' };
      animateEdge('DE', 'CF', '#fbbf24', (phase) => {
        if (phase) {
          setShowCFLine(true);
          setShowCFLabel(true);
          setShowReplayButton(true);
        } else {
          setStep1Phase(4);
          onUpdateTexts(null, stepData.navAfterDE);
        }
      }, false);
    };
    const runAH = () => {
      lastAnimationRef.current = { sourceEdge: 'AH', targetEdge: 'BG', color: '#22c55e' };
      animateEdge('AH', 'BG', '#22c55e', (phase) => {
        if (phase) {
          setShowBGLine(true);
          setShowStep1Equation(true);
          setShowReplayButton(true);
        } else {
          setStep1Phase(5);
          onUpdateTexts(null, stepData.navAfterAH);
          onEnableNext();
        }
      }, false);
    };

    switch (step1Phase) {
      case 1:
        if (edgeId === 'AB') runAB();
        break;
      case 2:
        if (edgeId === 'CD') runCD();
        break;
      case 3:
        if (edgeId === 'DE') runDE();
        break;
      case 4:
        if (edgeId === 'AH') runAH();
        break;
    }
  };

  const handleReplayAnimation = () => {
    if (step !== 1 || !lastAnimationRef.current || animatingLine) return;
    playSound("click");
    const { sourceEdge, targetEdge, color } = lastAnimationRef.current;
    animateEdge(sourceEdge, targetEdge, color, null, true);
  };

  // Check if edge is clickable
  const isEdgeClickable = (edgeId) => {
    if (step !== 1) return false;
    if (step1Phase === 1 && edgeId === 'AB') return true;
    if (step1Phase === 2 && edgeId === 'CD') return true;
    if (step1Phase === 3 && edgeId === 'DE') return true;
    if (step1Phase === 4 && edgeId === 'AH') return true;
    return false;
  };

  // Handle interactive box click in step 2: flip to reveal value, wait 1s, then highlight next
  const FLIP_DURATION_MS = 600;
  const WAIT_AFTER_FLIP_MS = 1000;

  const handleStep2BoxClick = (boxId) => {
    if (step !== 2) return;
    playSound("tick");
    const isActive =
      (step2Phase === 0 && boxId === 'AH') ||
      (step2Phase === 1 && boxId === 'BC') ||
      (step2Phase === 2 && boxId === 'FG') ||
      (step2Phase === 3 && boxId === 'CF');
    if (!isActive || step2FlippedBoxes[boxId]) return;

    // CF: immediate replacement, no flip
    if (boxId === 'CF') {
      setStep2Phase(4);
      onUpdateTexts(null, APP_DATA.steps[2].navAfter);
      onEnableNext();
      return;
    }

    // Other boxes: flip then wait
    setStep2FlippedBoxes(prev => ({ ...prev, [boxId]: true }));

    setTimeout(() => {
      const nextPhase = boxId === 'AH' ? 1 : boxId === 'BC' ? 2 : 3;
      setStep2Phase(nextPhase);
    }, FLIP_DURATION_MS + WAIT_AFTER_FLIP_MS);
  };

  // Handle numpad input
  const handleNumberClick = (num) => {
    if (inputState === "correct" || inputState === "final") return;
    setInputValue(prev => prev + num);
  };

  const handleClear = () => {
    if (inputState === "correct" || inputState === "final") return;
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (inputState === "correct" || inputState === "final") return;
    
    const stepData = APP_DATA.steps[step];
    const correctAnswer = stepData.correctAnswer;
    
    if (parseInt(inputValue) === correctAnswer) {
      playSound("correct");
      setInputState("correct");
      setTimeout(() => {
        setInputState("final");
        setNumpadDisabled(true);
        onEnableNext();
        if (step === 4) {
          onUpdateTexts(stepData.questionFinal, stepData.navFinal);
          confettiBurst();
        } else {
          onUpdateTexts(null, stepData.navAfter);
        }
      }, 500);
    } else {
      playSound("wrong");
      setInputState("wrong");
      setTimeout(() => {
        setInputState("");
        setInputValue("");
      }, 300);
    }
  };

  // Flip box component for step 2: front = label, back = value; flip on click, then advance after delay
  const renderFlipBox = (boxId, label, value, isActive) => {
    const flipped = !!step2FlippedBoxes[boxId];
    return React.createElement(
      "div",
      {
        key: boxId,
        className: `flip-box ${isActive ? 'active' : ''} ${flipped ? 'flipped' : ''}`,
        onClick: isActive && !flipped ? () => handleStep2BoxClick(boxId) : undefined,
        style: { cursor: isActive && !flipped ? 'pointer' : 'default' }
      },
      React.createElement("div", { className: "flip-box-inner" },
        React.createElement("div", { className: "flip-box-front" }, label),
        React.createElement("div", { className: "flip-box-back" }, value)
      )
    );
  };

  // Render step 2 equation
  const s2 = APP_DATA.steps[2];
  const renderStep2Equation = () => {
    if (step2Phase === 0) {
      return React.createElement("div", { className: "equation-row" },
        renderFlipBox('AH', 'AH', '40', true),
        React.createElement("span", { className: "equation-text" }, s2.equationLine0Right)
      );
    }
    if (step2Phase === 1) {
      return React.createElement("div", { className: "equation-row" },
        React.createElement("span", { className: "equation-text" }, s2.equationLine1Left),
        renderFlipBox('BC', 'BC', '16', true),
        React.createElement("span", { className: "equation-text" }, s2.equationLine1Right)
      );
    }
    if (step2Phase === 2) {
      return React.createElement("div", { className: "equation-row" },
        React.createElement("span", { className: "equation-text" }, s2.equationLine2Left),
        renderFlipBox('FG', 'FG', '14', true),
        React.createElement("span", { className: "equation-text" }, s2.equationLine2Right)
      );
    }
    if (step2Phase === 3) {
      return React.createElement("div", { className: "equation-row" },
        React.createElement("span", { className: "equation-text" }, s2.equationLine3Left),
        React.createElement("span", { 
          className: "interactive-box active",
          onClick: () => handleStep2BoxClick('CF')
        }, "CF"),
        React.createElement("span", { className: "equation-text" }, s2.equationLine3Right)
      );
    }
    if (step2Phase === 4) {
      return React.createElement("div", { className: "equation-row" },
        React.createElement("span", { className: "equation-text" }, s2.equationLine4)
      );
    }
    return null;
  };

  // Render math row content
  const renderMathRowContent = () => {
    // Button
    if (showButton) {
      return React.createElement(
        "button",
        { className: "math-button", onClick: handleButtonClick },
        buttonText
      );
    }

    // Feedback
    if (showFeedback && step === 0) {
      return React.createElement(
        "div",
        { className: `feedback-box ${feedbackClass}` },
        feedbackText
      );
    }

    // Step 1 equation
    if (step === 1 && showStep1Equation) {
      return React.createElement("div", { className: "equation-row" },
        React.createElement("span", { className: "equation-text" }, APP_DATA.steps[1].equationText)
      );
    }

    // Step 2 equation
    if (step === 2 && showEquation) {
      return renderStep2Equation();
    }

    // Step 3 equation
    if (step === 3 && showEquation) {
      return React.createElement("div", { className: "equation-row" },
        React.createElement("span", { className: "equation-text" }, APP_DATA.steps[3].equationText),
        React.createElement("span", { 
          className: `input-box ${inputState}`
        }, inputValue || "\u00A0")
      );
    }

    // Step 4 equation
    if (step === 4 && showEquation) {
      return React.createElement("div", { className: "equation-row" },
        React.createElement("span", { className: "equation-text" }, APP_DATA.steps[4].equationText),
        React.createElement("span", { 
          className: `input-box ${inputState}`
        }, inputValue || "\u00A0"),
        React.createElement("span", { className: "equation-text" }, APP_DATA.unitCm)
      );
    }

    return null;
  };

  // Create path data for the T-shape
  const pathData = `M ${points.A.x},${points.A.y} 
    L ${points.B.x},${points.B.y} 
    L ${points.C.x},${points.C.y} 
    L ${points.D.x},${points.D.y} 
    L ${points.E.x},${points.E.y} 
    L ${points.F.x},${points.F.y} 
    L ${points.G.x},${points.G.y} 
    L ${points.H.x},${points.H.y} Z`;

  // Refs for circle radius animation
  const circleRefs = useRef({});

  // Render blinking circle at midpoint of clickable edge (step 1 only)
  const renderEdgeCircle = (edgeId) => {
    if (step !== 1 || !isEdgeClickable(edgeId) || clickedEdges[edgeId]) return null;
    const mid = getMidpoint(edgeId);
    if (!circleRefs.current[edgeId]) {
      circleRefs.current[edgeId] = React.createRef();
    }
    return React.createElement("circle", {
      ref: circleRefs.current[edgeId],
      key: `circle-${edgeId}`,
      cx: mid.x,
      cy: mid.y,
      r: 9,
      fill: "white",
      className: "edge-click-indicator",
      pointerEvents: "none", // Not clickable, doesn't block clicks
    });
  };

  // Animate circle radius (9 to 12) using GSAP
  useEffect(() => {
    if (step !== 1) return;
    
    const circlesToAnimate = Object.keys(circleRefs.current)
      .filter(edgeId => isEdgeClickable(edgeId) && !clickedEdges[edgeId])
      .map(edgeId => circleRefs.current[edgeId]?.current)
      .filter(Boolean);

    if (circlesToAnimate.length === 0) return;

    circlesToAnimate.forEach(circle => {
      if (circle && typeof gsap !== 'undefined') {
        gsap.to(circle, {
          attr: { r: 12 },
          duration: 1,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    });

    return () => {
      circlesToAnimate.forEach(circle => {
        if (circle && typeof gsap !== 'undefined') {
          gsap.killTweensOf(circle);
        }
      });
    };
  }, [step, step1Phase, clickedEdges]);

  // Render edge lines: thick invisible hit area + visible white stroke (no yellow for clickable)
  const renderEdges = () => {
    return edges.map(edge => {
      const p1 = points[edge.p1];
      const p2 = points[edge.p2];
      const clickable = isEdgeClickable(edge.id);
      const strokeColor = edgesYellow ? "#fbbf24" : "white";
      
      return React.createElement(
        "g",
        { key: edge.id, className: clickable ? "edge-group clickable" : "edge-group" },
        // Thick invisible hit area for easier clicking
        React.createElement("line", {
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
          stroke: "transparent",
          strokeWidth: 28,
          strokeLinecap: "round",
          className: "edge-hit",
          onClick: clickable ? () => handleEdgeClick(edge.id) : null,
        }),
        // Visible edge line (white only, never yellow for clickable)
        React.createElement("line", {
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
          stroke: strokeColor,
          strokeWidth: 4,
          strokeLinecap: "round",
          className: "edge-line",
          pointerEvents: "none",
        })
      );
    });
  };

  // Render permanent labels
  const renderPermanentLabels = () => {
    return permanentLabels.map(label => {
      const mid = getMidpoint(label.id);
      return React.createElement("text", {
        key: label.id,
        x: mid.x + label.offsetX,
        y: mid.y + label.offsetY,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "side-label",
        
      }, label.text);
    });
  };

  // Render corner labels
  const renderCornerLabels = () => {
    if (!showCornerLabels) return null;
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return labels.map(label => {
      const p = points[label];
      const offset = cornerLabelOffsets[label];
      return React.createElement("text", {
        key: `corner-${label}`,
        x: p.x + offset.x,
        y: p.y + offset.y,
        textAnchor: "middle",
        dominantBaseline: "middle",
        className: "corner-label",
      }, label);
    });
  };

  // Render AB label
  const renderABLabel = () => {
    if (!showABLabel) return null;
    const mid = getMidpoint('AB');
    return React.createElement("text", {
      key: "AB-label",
      x: mid.x - 50,
      y: mid.y,
      textAnchor: "middle",
      dominantBaseline: "middle",
      className: "side-label",
    }, "23 cm");
  };

  // Render CD label
  const renderCDLabel = () => {
    if (!showCDLabel) return null;
    const mid = getMidpoint('CD');
    return React.createElement("text", {
      key: "CD-label",
      x: mid.x - 50,
      y: mid.y,
      textAnchor: "middle",
      dominantBaseline: "middle",
      className: "side-label",
    }, "20 cm");
  };

  // Render DE label (10 cm, offset below)
  const renderDELabel = () => {
    if (!showDELabel) return null;
    const mid = getMidpoint('DE');
    return React.createElement("text", {
      key: "DE-label",
      x: mid.x,
      y: mid.y + 35,
      textAnchor: "middle",
      dominantBaseline: "middle",
      className: "side-label",
    }, "10 cm");
  };

  // Render CF line
  const renderCFLine = () => {
    if (!showCFLine) return null;
    return React.createElement("line", {
      key: "CF-line",
      x1: points.C.x,
      y1: points.C.y,
      x2: points.F.x,
      y2: points.F.y,
      stroke: "#fbbf24",
      strokeWidth: 3,
    });
  };

  // Render CF label
  const renderCFLabel = () => {
    if (!showCFLabel) return null;
    const midX = (points.C.x + points.F.x) / 2;
    const midY = (points.C.y + points.F.y) / 2;
    // Show "10 cm" from step 3 correct answer or during step 4 (until we remove CF label), otherwise "?"
    const labelText = (step === 3 && inputState === "final") || step === 4 ? "10 cm" : "?";
    const labelClass = (step === 3 && inputState === "final") || step === 4 ? "side-label" : "side-label yellow-label";
    return React.createElement("text", {
      key: "CF-label",
      x: midX,
      y: midY - 30,
      textAnchor: "middle",
      dominantBaseline: "middle",
      className: labelClass,
    }, labelText);
  };

  // Render BG line
  const renderBGLine = () => {
    if (!showBGLine) return null;
    return React.createElement("line", {
      key: "BG-line",
      x1: points.B.x,
      y1: points.B.y,
      x2: points.G.x,
      y2: points.G.y,
      stroke: "#22c55e",
      strokeWidth: 3,
    });
  };

  // Render animating line
  const renderAnimatingLine = () => {
    if (!animatingLine) return null;
    return React.createElement("line", {
      ref: animLineRef,
      key: "animating-line",
      x1: animatingLine.x1,
      y1: animatingLine.y1,
      x2: animatingLine.x2,
      y2: animatingLine.y2,
      stroke: animatingLine.color,
      strokeWidth: 5,
      className: "animating-line",
    });
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container main-canvas-perimeter" },
    // Diagram row (80%)
    React.createElement(
      "div",
      { className: "diagram-row-80" },
      // Replay button (step 1 only, bottom right of diagram area)
      step === 1 && showReplayButton && !animatingLine && React.createElement(
        "button",
        {
          type: "button",
          className: "replay-animation-btn",
          onClick: handleReplayAnimation,
          "aria-label": APP_DATA.replayAriaLabel,
        },
        "⟲"
      ),
      React.createElement(
        "svg",
        { 
          viewBox: "-50 -10 600 470",
          className: "shape-svg",
          preserveAspectRatio: "xMidYMid meet"
        },
        // Shape fill: Cornflower Blue #6495ED at full opacity
        React.createElement("path", {
          d: pathData,
          fill: "#6495ED",
          fillOpacity: 1,
        }),
        // Edge lines
        renderEdges(),
        // Blinking circles for clickable edges (step 1)
        edges.map(edge => renderEdgeCircle(edge.id)).filter(Boolean),
        // CF line (yellow)
        renderCFLine(),
        // BG line (green)
        renderBGLine(),
        // Animating line
        renderAnimatingLine(),
        // Permanent labels
        renderPermanentLabels(),
        // Dynamic labels
        renderABLabel(),
        renderCDLabel(),
        renderDELabel(),
        renderCFLabel(),
        // Corner labels
        renderCornerLabels()
      ),
      // Numpad positioned in diagram area
      showNumpad && React.createElement(
        "div",
        { className: "numpad-wrapper" },
        React.createElement(Numpad, {
          disabled: numpadDisabled,
          onNumberClick: handleNumberClick,
          onClear: handleClear,
          onSubmit: handleSubmit,
        })
      )
    ),
    // Math row (20%)
    React.createElement(
      "div",
      { className: "math-row-20" },
      renderMathRowContent()
    )
  );
};
