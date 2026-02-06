const MainCanvas = ({
  step,
  onEnableNext,
  onDisableNext,
  onUpdateTexts,
  onGoToStep,
  onSetStep2Retry,
  step2RetryFlag,
  step2RetryTrigger,
}) => {
  const { useState, useEffect, useRef } = React;

  // Canvas states
  const canvasRef = useRef(null);
  const [canvasState, setCanvasState] = useState('idle'); // 'idle', 'splitting', 'returning'
  const [selectedAxis, setSelectedAxis] = useState(null);
  const [offset, setOffset] = useState(0);
  
  // Refs to persist state across step transitions
  const preserveCanvasState = useRef(false);
  const savedCanvasState = useRef({ axis: null, offset: 0 });
  
  // UI states
  const [highlightBoundary, setHighlightBoundary] = useState(false);
  const [highlightAF, setHighlightAF] = useState(false);
  const [highlightBC, setHighlightBC] = useState(false);
  const [showSplitLines, setShowSplitLines] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackClass, setFeedbackClass] = useState("neutral");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [showEquationRow1, setShowEquationRow1] = useState(false);
  const [showEquationRow2, setShowEquationRow2] = useState(false);
  const [showTapGif, setShowTapGif] = useState(false);
  const [step2WrongAttempt, setStep2WrongAttempt] = useState(false);
  const [step2Correct, setStep2Correct] = useState(false);
  
  // Step 5 states
  const [equationRow1Clicked, setEquationRow1Clicked] = useState(false);
  const [substitutedSides, setSubstitutedSides] = useState({});
  const [currentSideIndex, setCurrentSideIndex] = useState(0);
  const [showFinalAnswer, setShowFinalAnswer] = useState(false);
  const [showFCLabel, setShowFCLabel] = useState(true);

  // Shape points
  const points = [
    { x: -80, y: -120 }, // Top Left A (index 0)
    { x: 40, y: -120 },  // Top Right B (index 1)
    { x: 40, y: 0 },     // Inner corner C (index 2)
    { x: 120, y: 0 },    // Far Right D (index 3)
    { x: 40, y: 100 },   // Bottom Point E (index 4)
    { x: -80, y: 0 }    // Side corner F (index 5)
  ];

  // Split lines
  const splitLines = [
    { id: 'horizontal', x1: -150, y1: 0, x2: 200, y2: 0 },
    { id: 'diag1', x1: 150, y1: -150, x2: -150, y2: 150 },
    { id: 'diag2', x1: -150, y1: -150, x2: 150, y2: 150 }
  ];

  // Side labels: midpoint from points + shift (AB up, CD down so visible in bottom half, DE right, EF left - keep your amounts)
  const sideLabels = [
    { id: 'AB', text: '24 cm', mx: (points[0].x + points[1].x) / 2, my: (points[0].y + points[1].y) / 2 - 18 },
    { id: 'CD', text: '20 cm', mx: (points[2].x + points[3].x) / 2, my: (points[2].y + points[3].y) / 2 + 15 },
    { id: 'DE', text: '25 cm', mx: (points[3].x + points[4].x) / 2 + 50, my: (points[3].y + points[4].y) / 2 },
    { id: 'EF', text: '25 cm', mx: (points[4].x + points[5].x) / 2 - 50, my: (points[4].y + points[5].y) / 2 }
  ];

  // Step 3 extra labels: BC (shifted right + up), FA (shifted left + up), FC (shifted down then offset up); all offset upwards from midpoint so they sit with piece1; same positions used after combine (step >= 4)
  const up = 20; // upward offset so labels are not placed too low
  const step3Piece1ExtraLabels = [
    { id: 'BC', text: '24 cm', mx: (points[1].x + points[2].x) / 2 + 35, my: (points[1].y + points[2].y) / 2 - up },
    { id: 'FA', text: '24 cm', mx: (points[5].x + points[0].x) / 2 - 35, my: (points[5].y + points[0].y) / 2 - up },
    { id: 'FC', text: '24 cm', mx: (points[5].x + points[2].x) / 2, my: (points[5].y + points[2].y) / 2 + 5 - up }
  ];
  const postCombineLabels = [step3Piece1ExtraLabels[0], step3Piece1ExtraLabels[1]];

  // Corner labels (A→P, B→Q, C→R, D→S, E→T, F→U), positioned outside the shape; shown from step 4 onward
  const cornerLabelTexts = ['A', 'D', 'C', 'F', 'E', 'B'];
  const cornerLabelOffset = 18;
  const cornerLabels = points.map((p, i) => {
    const len = Math.sqrt(p.x * p.x + p.y * p.y) || 1;
    return {
      id: ['A', 'B', 'C', 'D', 'E', 'F'][i],
      text: cornerLabelTexts[i],
      mx: p.x + (cornerLabelOffset * p.x) / len,
      my: p.y + (cornerLabelOffset * p.y) / len + (i===2?-20:0)
    };
  });

  // Tick marks (2 parallel small lines) on AB, BC, FA at midpoints - geometry convention for equal sides. Hidden from step 3 onward (when square is clicked).
  const abMid = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
  const bcMid = { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2 };
  const faMid = { x: (points[5].x + points[0].x) / 2, y: (points[5].y + points[0].y) / 2 };
  const tickLen = 8;
  const tickGap = 4;
  const tickMarkSegments = [
    [ [abMid.x - tickGap/2, abMid.y, abMid.x - tickGap/2, abMid.y - tickLen], [abMid.x + tickGap/2, abMid.y, abMid.x + tickGap/2, abMid.y - tickLen] ],
    [ [bcMid.x, bcMid.y - tickGap/2, bcMid.x + tickLen, bcMid.y - tickGap/2], [bcMid.x, bcMid.y + tickGap/2, bcMid.x + tickLen, bcMid.y + tickGap/2] ],
    [ [faMid.x - tickLen, faMid.y - tickGap/2, faMid.x, faMid.y - tickGap/2], [faMid.x - tickLen, faMid.y + tickGap/2, faMid.x, faMid.y + tickGap/2] ]
  ];

  // Which labels move with which half when splitting. piece1 = first drawn piece (positive normal), piece2 = second (negative normal). For horizontal: piece1 = bottom half, piece2 = top half.
  const splitLabelAssignment = {
    horizontal: { piece1: ['CD', 'DE', 'EF'], piece2: ['AB'], remove: [] },
    diag1: { piece1: ['AB'], piece2: ['CD', 'DE'], remove: ['EF'] },
    diag2: { piece1: ['EF'], piece2: ['AB', 'CD'], remove: ['DE'] }
  };

  const substituteMap = { AB: 24, BE: 25, EF: 25, FC: 20, CD: 24, AD: 24 };
  const sides = ["AB", "BE", "EF", "FC", "CD", "AD"];

  // When user clicks Next after wrong split: start combine animation (step2RetryTrigger incremented by App)
  useEffect(() => {
    if (step === 2 && step2WrongAttempt && step2RetryTrigger > 0) {
      setCanvasState('returning');
    }
  }, [step2RetryTrigger]);

  const resetStep2 = () => {
    setCanvasState('idle');
    setSelectedAxis(null);
    setOffset(0);
    setShowSplitLines(true);
    setShowFeedback(false);
    setFeedbackText("");
    setStep2WrongAttempt(false);
    setStep2Correct(false);
    onDisableNext();
    onUpdateTexts(null, APP_DATA.steps[2].navText);
  };

  // Initialize step
  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (!stepData) return;

    // Check if we should preserve canvas state (going from step 2 to 3)
    if (step === 3 && preserveCanvasState.current) {
      // Restore the split state
      setSelectedAxis(savedCanvasState.current.axis);
      setOffset(savedCanvasState.current.offset);
      setCanvasState('splitting'); // Keep in split state
      preserveCanvasState.current = false;
      
      // Set up step 3
      setHighlightBoundary(false);
      setHighlightAF(false);
      setHighlightBC(false);
      setShowSplitLines(false);
      setFeedbackText("");
      setFeedbackClass("neutral");
      setShowFeedback(false);
      setShowTapGif(false);
      setStep2WrongAttempt(false);
      setStep2Correct(false);
      setShowEquationRow1(false);
      setShowEquationRow2(false);
      setEquationRow1Clicked(false);
      setSubstitutedSides({});
      setCurrentSideIndex(0);
      setShowFinalAnswer(false);
      
      setShowButton(true);
      setButtonText(stepData.buttonText);
      onDisableNext();
      return;
    }

    // Reset all states for other step transitions
    setHighlightBoundary(false);
    setHighlightAF(false);
    setHighlightBC(false);
    setShowSplitLines(false);
    setFeedbackText("");
    setFeedbackClass("neutral");
    setShowFeedback(false);
    setShowButton(false);
    setButtonText("");
    setShowEquationRow1(false);
    setShowEquationRow2(false);
    setShowTapGif(false);
    setStep2WrongAttempt(false);
    setStep2Correct(false);
    setEquationRow1Clicked(false);
    setSubstitutedSides({});
    setCurrentSideIndex(0);
    setShowFinalAnswer(false);
    setCanvasState('idle');
    setSelectedAxis(null);
    setOffset(0);

    onDisableNext();

    switch (step) {
      case 0:
        setShowButton(true);
        setButtonText(stepData.buttonText);
        setShowFCLabel(true);
        break;
      case 1:
        setShowButton(true);
        setButtonText(stepData.buttonText);
        setHighlightAF(true);
        setHighlightBC(true);
        break;
      case 2:
        setShowSplitLines(true);
        break;
      case 3:
        // This case is handled above for preserved state
        setShowButton(true);
        setButtonText(stepData.buttonText);
        break;
      case 4:
        setShowButton(true);
        setButtonText(stepData.buttonText);
        break;
      case 5:
        setShowEquationRow1(true);
        onUpdateTexts(null, stepData.navText1);
        break;
      case 6:
        setShowEquationRow1(true);
        setShowEquationRow2(true);
        setShowFinalAnswer(true);
        onEnableNext();
        break;
    }
  }, [step]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (canvasState === 'idle') {
        // Draw the solid shape at the center
        drawShape(ctx, cx, cy, points, highlightBoundary);
        
        // Draw split lines if needed
        if (showSplitLines && !step2Correct) {
          splitLines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(cx + line.x1, cy + line.y1);
            ctx.lineTo(cx + line.x2, cy + line.y2);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.stroke();
          });
        }

        // Highlight FA and BC (step 1 – missing sides)
        if (highlightAF) {
          ctx.beginPath();
          ctx.moveTo(cx + points[5].x, cy + points[5].y); // F
          ctx.lineTo(cx + points[0].x, cy + points[0].y); // A
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 6;
          ctx.stroke();
        }
        if (highlightBC) {
          ctx.beginPath();
          ctx.moveTo(cx + points[1].x, cy + points[1].y); // B
          ctx.lineTo(cx + points[2].x, cy + points[2].y); // C
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 6;
          ctx.stroke();
        }

        // Draw all side labels (idle state); from step 4 onward also BC and FA (after combine)
        const idleLabels = step >= 4 ? sideLabels.concat(postCombineLabels) : sideLabels;
        drawLabelsAt(ctx, cx, cy, idleLabels);

        if (step >= 4) drawCornerLabels(ctx, cx, cy);
        if (step <= 2) drawTickMarks(ctx, cx, cy);
      } else if (canvasState === 'splitting' || canvasState === 'returning') {
        // Splitting or returning animation
        const line = splitLines.find(l => l.id === selectedAxis);
        if (!line) {
          animationFrame = requestAnimationFrame(draw);
          return;
        }

        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len;
        const ny = dx / len;

        const assignment = splitLabelAssignment[selectedAxis] || { piece1: [], piece2: [], remove: [] };
        const labelsPiece1 = sideLabels.filter((l) => assignment.piece1.includes(l.id));
        const labelsPiece2 = sideLabels.filter((l) => assignment.piece2.includes(l.id));
        // BC/FA (and FC until combine) visible throughout step 3 including during combine animation
        const step3ExtraLabels = step === 3 && selectedAxis === 'horizontal'
          ? (showFCLabel ? step3Piece1ExtraLabels : step3Piece1ExtraLabels.filter((l) => l.id !== 'FC'))
          : [];

        // Piece 1 - no stroke on split halves; draw labels that belong to this half (only those inside the clip)
        ctx.save();
        ctx.translate(cx + nx * offset, cy + ny * offset);
        applyLocalClip(ctx, line, nx, ny, true);
        drawShape(ctx, 0, 0, points, false, true);
        drawLabelsAt(ctx, 0, 0, labelsPiece1);
        ctx.restore();

        // Step 3 extra labels (BC, FA, FC): draw with piece1 transform but WITHOUT clip so BC/FA (which sit in top half) are not masked; they still move with the bottom piece
        if (step3ExtraLabels.length) {
          ctx.save();
          ctx.translate(cx + nx * offset, cy + ny * offset);
          drawLabelsAt(ctx, 0, 0, step3ExtraLabels);
          ctx.restore();
        }

        // Piece 2 - no stroke on split halves; draw labels that belong to this half (remove-labels are not drawn)
        ctx.save();
        ctx.translate(cx - nx * offset, cy - ny * offset);
        applyLocalClip(ctx, line, nx, ny, false);
        drawShape(ctx, 0, 0, points, false, true);
        drawLabelsAt(ctx, 0, 0, labelsPiece2);
        if (step <= 2) drawTickMarks(ctx, 0, 0);
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const drawShape = (ctx, x, y, pts, highlight, noStroke) => {
      ctx.beginPath();
      ctx.moveTo(x + pts[0].x, y + pts[0].y);
      pts.forEach((p, i) => { if (i > 0) ctx.lineTo(x + p.x, y + p.y); });
      ctx.closePath();
      
      // Fill with bluish color, opacity 0.5
      ctx.fillStyle = 'rgba(100, 149, 237, 0.5)';
      ctx.fill();
      
      // Border - skip stroke for split halves
      if (!noStroke) {
        ctx.strokeStyle = highlight ? '#fbbf24' : 'rgba(100, 149, 237, 1)';
        ctx.lineWidth = highlight ? 4 : 2;
        ctx.stroke();
      }
    };

    const applyLocalClip = (ctx, line, nx, ny, towardNormal) => {
      const dist = 2000;
      ctx.beginPath();
      const x1 = line.x1;
      const y1 = line.y1;
      const x2 = line.x2;
      const y2 = line.y2;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      const side = towardNormal ? 1 : -1;
      ctx.lineTo(x2 + nx * side * dist, y2 + ny * side * dist);
      ctx.lineTo(x1 + nx * side * dist, y1 + ny * side * dist);
      
      ctx.closePath();
      ctx.clip();
    };

    const drawLabelsAt = (ctx, ox, oy, labelsToDraw) => {
      if (!labelsToDraw.length) return;
      ctx.save();
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      labelsToDraw.forEach((l) => {
        ctx.fillText(l.text, ox + l.mx, oy + l.my);
      });
      ctx.restore();
    };

    const drawTickMarks = (ctx, ox, oy) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      tickMarkSegments.forEach((pair) => {
        pair.forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath();
          ctx.moveTo(ox + x1, oy + y1);
          ctx.lineTo(ox + x2, oy + y2);
          ctx.stroke();
        });
      });
      ctx.restore();
    };

    const drawCornerLabels = (ctx, ox, oy) => {
      ctx.save();
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      cornerLabels.forEach((l) => {
        ctx.fillText(l.text, ox + l.mx, oy + l.my);
      });
      ctx.restore();
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [canvasState, offset, selectedAxis, highlightBoundary, highlightAF, highlightBC, showSplitLines, step2Correct, step, showFCLabel]);

  // Animation loop for splitting/returning
  useEffect(() => {
    let timer;
    if (canvasState === 'splitting') {
      if (offset < 20) {
        timer = requestAnimationFrame(() => setOffset(prev => prev + 2));
      } else {
        // Split animation complete
        if (step === 2 && !step2Correct && !step2WrongAttempt) {
          // Check if correct split
          if (selectedAxis === 'horizontal') {
            setStep2Correct(true);
            const stepData = APP_DATA.steps[2];
            setShowFeedback(true);
            setFeedbackText(stepData.feedbackCorrect);
            setFeedbackClass("correct");
            if (typeof playSound === "function") playSound("correct");
            if (typeof confettiBurst === "function") confettiBurst();
            onUpdateTexts(null, stepData.navCorrect);
            // Show tap gif on top half
            setShowTapGif(true);
          } else {
            // Wrong split: show feedback, enable next; don't call onSetStep2Retry here (only sets flag when Next is clicked)
            setStep2WrongAttempt(true);
            const stepData = APP_DATA.steps[2];
            setShowFeedback(true);
            setFeedbackText(stepData.feedbackWrong);
            setFeedbackClass("incorrect");
            if (typeof playSound === "function") playSound("wrong");
            onUpdateTexts(null, stepData.navWrong);
            onEnableNext();
            onSetStep2Retry(); // Tell App we're in wrong state so Next will trigger step2RetryTrigger
          }
        }
      }
    } else if (canvasState === 'returning') {
      if (offset > 0) {
        timer = requestAnimationFrame(() => setOffset(prev => Math.max(0, prev - 2)));
      } else {
        setCanvasState('idle');
        setSelectedAxis(null);
        if (step === 2) {
          // Step 2 retry: combine done, reset to show lines again
          resetStep2();
        } else if (step === 3) {
          setTimeout(() => {
            onGoToStep(4);
          }, 300);
        }
      }
    }
    return () => cancelAnimationFrame(timer);
  }, [canvasState, offset, step, selectedAxis, step2Correct, step2WrongAttempt]);

  // Handle canvas click
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX - canvas.width / 2;
    const y = (e.clientY - rect.top) * scaleY - canvas.height / 2;

    // Step 2: Click split lines
    if (step === 2 && canvasState === 'idle' && showSplitLines && !step2Correct && !step2WrongAttempt) {
      for (const line of splitLines) {
        const dist = distanceToLine(x, y, line.x1, line.y1, line.x2, line.y2);
        if (dist < 25) {
          setSelectedAxis(line.id);
          setCanvasState('splitting');
          if (typeof playSound === "function") playSound("click");
          break;
        }
      }
    }

    // Step 2: Click top half (ABCF square) after correct split
    if (step === 2 && step2Correct && showTapGif && selectedAxis === 'horizontal') {
      if (pointInABCFSquare(x, y, offset)) {
        setShowTapGif(false);
        if (typeof playSound === "function") playSound("click");
        preserveCanvasState.current = true;
        savedCanvasState.current = { axis: selectedAxis, offset: offset };
        onGoToStep(3);
      }
    }
  };

  // Top half when split by horizontal line is square A-B-C-F. Piece 2 (top) is drawn at translate(cx, cy - offset), so in center coords y is negative (above center).
  const pointInABCFSquare = (px, py, topOffset) => {
    // Square A(-80,-120), B(40,-120), C(40,0), F(-80,0) in local coords; drawn at (0, -offset) in center space
    const ax = -80, ay = -120 - topOffset;
    const bx = 40, by = -120 - topOffset;
    const cx = 40, cy = -topOffset;
    const fx = -80, fy = -topOffset;
    return pointInPolygon(px, py, [ax, ay, bx, by, cx, cy, fx, fy]);
  };

  const pointInPolygon = (px, py, polygon) => {
    const n = polygon.length / 2;
    let inside = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = polygon[i * 2], yi = polygon[i * 2 + 1];
      const xj = polygon[j * 2], yj = polygon[j * 2 + 1];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  };

  const distanceToLine = (px, py, x1, y1, x2, y2) => {
    const l2 = (x2-x1)**2 + (y2-y1)**2;
    if (l2 === 0) return Math.sqrt((px-x1)**2 + (py-y1)**2);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * (x2 - x1)))**2 + (py - (y1 + t * (y2 - y1)))**2);
  };

  // Button click handlers
  const handleButtonClick = () => {
    if (typeof playSound === "function") playSound("click");
    const stepData = APP_DATA.steps[step];
    
    switch (step) {
      case 0:
        // Highlight boundary
        setHighlightBoundary(true);
        setShowButton(false);
        setShowFeedback(true);
        setFeedbackText(stepData.feedback);
        setFeedbackClass("neutral");
        onUpdateTexts(null, stepData.navAfter);
        onEnableNext();
        break;
      case 1:
        // Highlights already on from start of step 1; just show feedback and enable next
        setShowButton(false);
        setShowFeedback(true);
        setFeedbackText(stepData.feedback);
        setFeedbackClass("neutral");
        onUpdateTexts(null, stepData.navAfter);
        onEnableNext();
        break;
      case 3:
        // Combine: remove FC label when animation starts; BC and FA stay and persist after
        setShowFCLabel(false);
        setShowButton(false);
        setCanvasState('returning');
        break;
      case 4:
        // Go to step 5
        onGoToStep(5);
        break;
    }
  };

  // Equation row 1 box click
  const handleEquationRow1BoxClick = () => {
    if (step !== 5 || equationRow1Clicked) return;
    if (typeof playSound === "function") playSound("click");
    setEquationRow1Clicked(true);
    setShowEquationRow2(true);
    onUpdateTexts(null, APP_DATA.steps[5].navText2);
  };

  // Equation row 2 side click
  const handleSideClick = (side) => {
    if (step !== 5) return;
    if (currentSideIndex >= sides.length) return;
    if (side !== sides[currentSideIndex]) return;
    
    if (typeof playSound === "function") playSound("tick");
    
    setSubstitutedSides(prev => ({ ...prev, [side]: substituteMap[side] }));
    
    if (currentSideIndex === sides.length - 1) {
      // All sides substituted
      onUpdateTexts(null, APP_DATA.steps[5].navCorrect);
      onEnableNext();
    }
    
    setCurrentSideIndex(prev => prev + 1);
  };

  // Render equation row 1
  const renderEquationRow1 = () => {
    const stepData = APP_DATA.steps[5];
    
    if (showFinalAnswer) {
      // Step 6: show first row as plain text (no interactive box)
      return React.createElement(
        "div",
        { className: "equation-row" },
        stepData.equationRow1,
        stepData.equationRow1Box
      );
    }
    
    return React.createElement(
      "div",
      { className: "equation-row" },
      React.createElement("span", { className: "equation-text" }, stepData.equationRow1),
      equationRow1Clicked
        ? React.createElement("span", { className: "equation-text" }, stepData.equationRow1Box)
        : React.createElement(
            "span",
            {
              className: "interactive-box active",
              onClick: handleEquationRow1BoxClick,
            },
            stepData.equationRow1Box
          )
    );
  };

  // Render equation row 2
  const renderEquationRow2 = () => {
    if (!showEquationRow2 && !showFinalAnswer) return null;
    
    if (showFinalAnswer) {
      // Step 6: replace second row with final answer only
      return React.createElement(
        "div",
        { className: "equation-row equation-row-final" },
        APP_DATA.steps[6].finalAnswer
      );
    }

    const stepData = APP_DATA.steps[5];
    const elements = [
      React.createElement("span", { key: "label", className: "equation-text" }, stepData.equationRow2)
    ];

    sides.forEach((side, index) => {
      if (index > 0) {
        elements.push(React.createElement("span", { key: `plus-${index}`, className: "equation-text" }, " + "));
      }
      
      const isSubstituted = substitutedSides[side] !== undefined;
      const isActive = index === currentSideIndex && !isSubstituted;
      
      elements.push(
        React.createElement(
          "span",
          {
            key: side,
            className: `interactive-box ${isActive ? 'active' : ''} ${isSubstituted ? 'substituted' : ''}`,
            onClick: isActive ? () => handleSideClick(side) : null,
          },
          isSubstituted ? substitutedSides[side] : side
        )
      );
    });

    return React.createElement(
      "div",
      { className: "equation-row" },
      ...elements
    );
  };

  // Render math row content based on step
  const renderMathRowContent = () => {
    // Button
    if (showButton) {
      return React.createElement(
        "button",
        { className: "math-button", onClick: handleButtonClick },
        buttonText
      );
    }

    // Feedback only (no equation rows)
    if (showFeedback && !showEquationRow1) {
      return React.createElement(
        "div",
        { className: `feedback-box ${feedbackClass}` },
        feedbackText
      );
    }

    // Equation rows
    if (showEquationRow1) {
      return React.createElement(
        "div",
        { className: "equation-container" },
        renderEquationRow1(),
        renderEquationRow2()
      );
    }

    return null;
  };

  // Calculate tap gif position (center of top half)
  const getTapGifStyle = () => {
    if (!showTapGif) return { display: 'none' };
    return {
      position: 'absolute',
      top: '25%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '4vw',
      pointerEvents: 'none',
      zIndex: 10,
    };
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container main-canvas-perimeter" },
    // Diagram row (70%)
    React.createElement(
      "div",
      { className: "diagram-row" },
      React.createElement(
        "div",
        { className: "canvas-wrapper" },
        React.createElement("canvas", {
          ref: canvasRef,
          width: 340,
          height: 340,
          onClick: handleCanvasClick,
          className: `shape-canvas ${(step === 2 && showSplitLines && !step2Correct && !step2WrongAttempt) || (step === 2 && step2Correct && showTapGif) ? 'clickable' : ''}`,
        }),
        showTapGif && React.createElement("img", {
          src: "assets/tap.gif",
          alt: "tap",
          style: getTapGifStyle(),
        })
      )
    ),
    // Math row (30%)
    React.createElement(
      "div",
      { className: "math-row" },
      renderMathRowContent()
    )
  );
};
