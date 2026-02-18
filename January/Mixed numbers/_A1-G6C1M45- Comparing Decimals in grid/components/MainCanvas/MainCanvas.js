// Comparing Decimals in Grid / components/MainCanvas/MainCanvas.js

const MainCanvas = ({ qIndex, step, onEnableNext }) => {
  const { useState, useEffect, useRef } = React;

  const qData = APP_DATA.questions[qIndex];

  // ── Num1 (left) states ──
  const [ones1, setOnes1] = useState(1);
  const [tenths1, setTenths1] = useState(0);
  const [hundredths1, setHundredths1] = useState(0);
  const [isNum1Correct, setIsNum1Correct] = useState(false);
  const [showNum1Feedback, setShowNum1Feedback] = useState(false);
  const [shake1, setShake1] = useState(false);

  // ── Num2 (right) states ──
  const [ones2, setOnes2] = useState(1);
  const [tenths2, setTenths2] = useState(0);
  const [hundredths2, setHundredths2] = useState(0);
  const [isNum2Correct, setIsNum2Correct] = useState(false);
  const [showNum2Feedback, setShowNum2Feedback] = useState(false);
  const [shake2, setShake2] = useState(false);

  // ── Feedback row state ──
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "correct" | "warn" | ""

  // ── Step 3 operator buttons state ──
  const [operatorSelected, setOperatorSelected] = useState(null);
  const [operatorCorrect, setOperatorCorrect] = useState(false);
  const [shakeOperator, setShakeOperator] = useState(null); // which operator is shaking

  // ── Step 4 animation done ──
  const [animDone, setAnimDone] = useState(false);
  const [showFinalOperator, setShowFinalOperator] = useState(false); // For step 4 result

  // ── Show number display flags ──
  const [showNum1Display, setShowNum1Display] = useState(false);
  const [showNum2Display, setShowNum2Display] = useState(false);

  // ── Show check button ──
  const [showCheckBtn, setShowCheckBtn] = useState(true);

  // ── Refs for animation ──
  const rotorRef = useRef(null);
  const animRunningRef = useRef(false);

  // Reset on step change
  useEffect(() => {
    setFeedbackText("");
    setFeedbackType("");
    setShakeOperator(null);
    setOperatorSelected(null);
    setOperatorCorrect(false);
    setAnimDone(false);
    setShowFinalOperator(false);
    animRunningRef.current = false;

    if (step === 1) {
      setOnes1(1);
      setTenths1(0);
      setHundredths1(0);
      setIsNum1Correct(false);
      setShowNum1Feedback(false);
      setShake1(false);
      setShowNum1Display(false);
      setShowNum2Display(false);
      setShowCheckBtn(true);
    }
    else if (step === 2) {
      setOnes2(1);
      setTenths2(0);
      setHundredths2(0);
      setIsNum2Correct(false);
      setShowNum2Feedback(false);
      setShake2(false);
      setShowNum2Display(false);
      setShowCheckBtn(true);
    }
    else if (step === 3) {
      // If we jumped to step 3 (e.g. for Q2+), we need to ensure the values are set correctly
      // For Q1, they are already set by user interaction.
      // For Q2+, we initialize them from data.
      if (qIndex > 0) {
        setOnes1(qData.num1.ones);
        setTenths1(qData.num1.tenths);
        setHundredths1(qData.num1.hundredths);
        
        setOnes2(qData.num2.ones);
        setTenths2(qData.num2.tenths);
        setHundredths2(qData.num2.hundredths);
      }
    }

    if (step === 4) {
      // Start animation if not running
      if (!animRunningRef.current) {
        animRunningRef.current = true;
        // Small delay before start to let user see initial state
        setTimeout(() => {
            runComparisonAnimation();
        }, 1000);
      }
    }
  }, [step, qIndex]);

  // ── Animation Logic ──
  const runComparisonAnimation = async () => {
    // Helper to get element
    const getEl = (id) => document.getElementById(id);

    // Initial counts (from data, assuming user filled correctly)
    // We maintain local counters to track logic, and update React state for visuals
    let cOnes1 = qData.num1.ones;
    let cOnes2 = qData.num2.ones;
    let cTenths1 = qData.num1.tenths;
    let cTenths2 = qData.num2.tenths;
    let cHunds1 = qData.num1.hundredths;
    let cHunds2 = qData.num2.hundredths;

    const tl = gsap.timeline();

    // 1. Compare Ones
    const moveOnes = Math.min(cOnes1, cOnes2);
    if (moveOnes > 0) {
      await animateMoveToRotor("one", moveOnes, cOnes1, cOnes2);
      cOnes1 -= moveOnes;
      cOnes2 -= moveOnes;
      setOnes1(cOnes1);
      setOnes2(cOnes2);
    }

    // Check inequality
    if (cOnes1 > 0 || cOnes2 > 0) { // If either has leftovers (since min removed, at least one is 0)
      finishAnimation();
      return;
    }

    // 2. Compare Tenths (if ones equal)
    // Wait a bit?
    await new Promise(r => setTimeout(r, 500));
    const moveTenths = Math.min(cTenths1, cTenths2);
    if (moveTenths > 0) {
      await animateMoveToRotor("tenth", moveTenths, cTenths1, cTenths2);
      cTenths1 -= moveTenths;
      cTenths2 -= moveTenths;
      setTenths1(cTenths1);
      setTenths2(cTenths2);
    }

    if (cTenths1 > 0 || cTenths2 > 0) {
      finishAnimation();
      return;
    }

    // 3. Compare Hundredths (if tenths equal)
    await new Promise(r => setTimeout(r, 500));
    const moveHunds = Math.min(cHunds1, cHunds2);
    if (moveHunds > 0) {
      await animateMoveToRotor("hundredth", moveHunds, cHunds1, cHunds2);
      cHunds1 -= moveHunds;
      cHunds2 -= moveHunds;
      setHundredths1(cHunds1);
      setHundredths2(cHunds2);
    }

    finishAnimation();
  };

  const finishAnimation = () => {
    setAnimDone(true);
    setShowFinalOperator(true);
    if (qData.step4 && qData.step4.feedbackAfterAnimation) {
       setFeedbackText(qData.step4.feedbackAfterAnimation);
       setFeedbackType("correct");
    }
    onEnableNext(qData.step4.nAfterAnimation);
  };

  const animateMoveToRotor = (type, count, currentCount1, currentCount2) => {
    return new Promise((resolve) => {
      const elementsToMove = [];
      
      // Identify Left Elements (top 'count' items)
      // Stacked squares (type="one") are indexed 0..N-1 (0 is bottom). Top is N-1.
      // So range: [currentCount1 - count, currentCount1 - 1]
      for (let i = 0; i < count; i++) {
        const idx = currentCount1 - 1 - i; 
        const el = document.getElementById(`sq-${type}-left-${idx}`);
        if (el) elementsToMove.push({ el, side: 'left' });
      }

      // Identify Right Elements
      for (let i = 0; i < count; i++) {
        const idx = currentCount2 - 1 - i;
        const el = document.getElementById(`sq-${type}-right-${idx}`);
        if (el) elementsToMove.push({ el, side: 'right' });
      }

      const rotorEl = rotorRef.current;
      if (!rotorEl || elementsToMove.length === 0) {
        resolve();
        return;
      }

      const rotorRect = rotorEl.getBoundingClientRect();
      const rotorCenterX = rotorRect.left + rotorRect.width / 2;
      const rotorCenterY = rotorRect.top + rotorRect.height / 2;

      // Create Clones
      const clones = elementsToMove.map(item => {
        const rect = item.el.getBoundingClientRect();
        const clone = item.el.cloneNode(true);
        
        // Remove IDs from clones to avoid duplicate ID issues
        clone.removeAttribute('id');
        
        // Compute style
        clone.style.position = 'absolute';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.margin = '0'; // clear margins
        clone.style.transform = 'none'; // clear CSS transforms
        clone.style.zIndex = '1000';
        clone.classList.add('clone-anim');
        document.body.appendChild(clone);

        // Hide original
        item.el.style.opacity = '0';

        return clone;
      });

      // Animate
      gsap.to(clones, {
        duration: 1.5,
        x: (i) => rotorCenterX - parseFloat(clones[i].style.left) - parseFloat(clones[i].style.width)/2,
        y: (i) => rotorCenterY - parseFloat(clones[i].style.top) - parseFloat(clones[i].style.height)/2,
        scale: 0.5,
        opacity: 0,
        ease: "power2.inOut",
        stagger: 0.05,
        onComplete: () => {
          clones.forEach(c => c.remove());
          resolve();
        }
      });
    });
  };

  // ── Check handler for step 1 (num1) ──
  const handleCheckNum1 = () => {
    const correct = ones1 === qData.num1.ones && tenths1 === qData.num1.tenths && hundredths1 === qData.num1.hundredths;
    setIsNum1Correct(correct);
    setShowNum1Feedback(true);
    if (correct) {
      playSound("correct");
      setFeedbackText(qData.step1.correct);
      setFeedbackType("correct");
      // setShowCheckBtn(false); // Valid: keep visible but disabled
      setShowNum1Display(true);
      onEnableNext(qData.step1.nAfterCorrect);
    } else {
      playSound("wrong");
      setFeedbackText(qData.step1.wrong);
      setFeedbackType("warn");
      setShake1(true);
      setTimeout(() => setShake1(false), 300);
    }
  };

  // ── Check handler for step 2 (num2) ──
  const handleCheckNum2 = () => {
    const correct = ones2 === qData.num2.ones && tenths2 === qData.num2.tenths && hundredths2 === qData.num2.hundredths;
    setIsNum2Correct(correct);
    setShowNum2Feedback(true);
    if (correct) {
      playSound("correct");
      setFeedbackText(qData.step2.correct);
      setFeedbackType("correct");
      // setShowCheckBtn(false); // Valid: keep visible but disabled
      setShowNum2Display(true);
      onEnableNext(qData.step2.nAfterCorrect);
    } else {
      playSound("wrong");
      setFeedbackText(qData.step2.wrong);
      setFeedbackType("warn");
      setShake2(true);
      setTimeout(() => setShake2(false), 300);
    }
  };

  // ── Operator button click (step 3) ──
  const handleOperatorClick = (op) => {
    if (operatorCorrect) return;
    const correctOp = qData.step3.correctOperator;
    if (op === correctOp) {
      playSound("correct");
      setOperatorSelected(op);
      setOperatorCorrect(true);
      setFeedbackText(qData.step3.correctFeedback);
      setFeedbackType("correct");
      onEnableNext(qData.step3.nAfterCorrect);
    } else {
      playSound("wrong");
      // If specific wrong feedback is defined, use it, else default? 
      // User provided specific wrong feedback for each question in request.
      if (qData.step3.wrongFeedback) {
          setFeedbackText(qData.step3.wrongFeedback);
          setFeedbackType("warn");
      }
      setShakeOperator(op);
      setTimeout(() => setShakeOperator(null), 300);
    }
  };

  // ══════════════════════════════════════════
  // RENDER VISUAL CONTAINER (step11-like)
  // ══════════════════════════════════════════
  const renderVisualContainer = (side) => {
    const isLeft = side === "left";
    const numData = isLeft ? qData.num1 : qData.num2;

    // Values to display
    let vOnes, vTenths, vHunds;
    let showSliders = false;
    let disableSliders = false;

    if (isLeft) {
      if (step === 1) {
        vOnes = ones1; vTenths = tenths1; vHunds = hundredths1;
        showSliders = true;
        disableSliders = isNum1Correct;
      } else {
        if (step === 4) {
           vOnes = ones1; vTenths = tenths1; vHunds = hundredths1;
        } else {
           vOnes = numData.ones; vTenths = numData.tenths; vHunds = numData.hundredths;
        }
      }
    } else {
      if (step === 2) {
        vOnes = ones2; vTenths = tenths2; vHunds = hundredths2;
        showSliders = true;
        disableSliders = isNum2Correct;
      } else if (step >= 3) {
         if (step === 4) {
            vOnes = ones2; vTenths = tenths2; vHunds = hundredths2;
         } else {
            vOnes = numData.ones; vTenths = numData.tenths; vHunds = numData.hundredths;
         }
      } else {
        vOnes = 0; vTenths = 0; vHunds = 0;
      }
    }

    const shaking = isLeft ? shake1 : shake2;

    // Determine whether to show number display
    const showDisplay = isLeft ? showNum1Display : showNum2Display;
    // After step1 is correct, always show num1 display in later steps
    const alwaysShowDisplay = isLeft ? (step >= 2) : (step >= 3);
    const shouldShowDisplay = showDisplay || alwaysShowDisplay;

    // parse the val string to get digits
    const valStr = numData.val.replace(",", ".");
    const parts = valStr.split(".");
    const wholeDigit = parts[0];
    const decDigits = parts[1] || "00";

    // handlers
    const setOnes = isLeft ? setOnes1 : setOnes2;
    const setTenths = isLeft ? setTenths1 : setTenths2;
    const setHundredths = isLeft ? setHundredths1 : setHundredths2;

    return React.createElement("div", { className: "visual-container" },
      React.createElement("div", {
        className: "step11-container-compact",
        style: { pointerEvents: (showSliders && disableSliders) ? 'none' : 'auto' }
      },
        // Left sub-column: stacked squares
        React.createElement("div", { className: "step11-col" },
          React.createElement("div", { className: `stacked-squares-compact ${shaking ? "shake" : ""}` },
            Array.from({ length: vOnes }).map((_, i) =>
              React.createElement("div", { 
                  key: i, 
                  id: `sq-one-${side}-${i}`, 
                  className: "stacked-sq" 
                },
                i === vOnes - 1 && React.createElement("div", { className: "sq-label" }, vOnes)
              )
            )
          ),
          showSliders && React.createElement("div", { className: "slider-h-compact" },
            React.createElement("input", {
              className: "horizontal-slider",
              type: "range",
              min: 0,
              max: 9,
              value: isLeft ? ones1 : ones2,
              onChange: (e) => { playSound("tick"); setOnes(parseInt(e.target.value)); }
            })
          )
        ),
        // Right sub-column: grid
        React.createElement("div", { className: "step11-col" },
          React.createElement("div", { className: `grid-compact ${shaking ? "shake" : ""}` },
            // Tenth bars
            React.createElement("div", { className: "tenth-bars-compact" },
              Array.from({ length: 10 }).map((_, i) =>
                React.createElement("div", {
                  key: i,
                  id: `sq-tenth-${side}-${i}`, 
                  className: `tenth-bar-c ${i < vTenths ? "filled" : ""}`,
                  style: { opacity: i < vTenths ? 1 : 0.2 }
                }, i === vTenths - 1 && React.createElement("div", { className: "bar-label" }, vTenths))
              )
            ),
            // Hundredth grid
            React.createElement("div", { className: "hundredth-grid-compact" },
              Array.from({ length: 100 }).map((_, i) => {
                const col = Math.floor(i / 10);
                const row = i % 10;
                const isFilled = (col === vTenths && (9 - row) < vHunds);
                const isLast = (col === vTenths && (9 - row) === vHunds - 1);
                
                // Calculate logical index 'k' if filled
                let logicalId = null;
                if (isFilled) {
                    logicalId = 9 - row; 
                }

                return React.createElement("div", {
                  key: i,
                  id: isFilled ? `sq-hundredth-${side}-${logicalId}` : undefined,
                  className: `hundredth-sq-c ${isFilled ? "filled" : ""}`,
                  style: { opacity: isFilled ? 1 : 0.2 }
                }, isLast && React.createElement("div", { className: "grid-label" }, vHunds));
              })
            ),
            // Vertical slider for hundredths
            showSliders && React.createElement("div", { className: "slider-v-compact" },
              React.createElement("input", {
                className: "vertical-slider",
                type: "range",
                min: 0,
                max: 9,
                value: isLeft ? hundredths1 : hundredths2,
                onChange: (e) => { playSound("tick"); setHundredths(Math.min(9, parseInt(e.target.value))); }
              })
            )
          ),
          // Horizontal slider for tenths
          showSliders && React.createElement("div", { className: "slider-h-compact" },
            React.createElement("input", {
              className: "horizontal-slider",
              type: "range",
              min: 0,
              max: 9,
              value: isLeft ? tenths1 : tenths2,
              onChange: (e) => { playSound("tick"); setTenths(Math.min(9, parseInt(e.target.value))); }
            })
          )
        )
      ),
      // Number display - Always rendered, control opacity
      React.createElement("div", { 
          className: "number-display",
          style: { opacity: shouldShowDisplay ? 1 : 0, transition: 'opacity 0.5s' }
      },
        React.createElement("div", { className: "num-box" }, wholeDigit),
        React.createElement("div", { className: "num-dot" }, "."),
        React.createElement("div", { className: "num-box" }, decDigits[0]),
        React.createElement("div", { className: "num-box" }, decDigits[1])
      )
    );
  };

  // ══════════════════════════════════════════
  // RENDER OPERATOR BUTTONS (step 3)
  // ══════════════════════════════════════════
  const renderOperatorButtons = () => {
    const operators = [">", "=", "<"];
    return React.createElement("div", { className: "operator-buttons-container" },
      operators.map(op => {
        let btnClass = "operator-btn";
        if (operatorCorrect && operatorSelected === op) btnClass += " correct";
        if (shakeOperator === op) btnClass += " shake-red";
        if (operatorCorrect) btnClass += " disabled";
        return React.createElement("button", {
          key: op,
          className: btnClass,
          onClick: () => handleOperatorClick(op),
          disabled: operatorCorrect,
        }, op);
      })
    );
  };

  // ══════════════════════════════════════════
  // MAIN RENDER
  // ══════════════════════════════════════════

  // Determine which columns are visible
  const showLeftVisual = step >= 1;
  const showRightVisual = step >= 2;
  const showOperators = step === 3;
  const showRotor = step === 4;

  const isCurrentCorrect = step === 1 ? isNum1Correct : isNum2Correct;

  return React.createElement("div", { className: "main-canvas-comparing" },
    // ── VISUAL ROW (85%) ──
    React.createElement("div", { className: "visual-row" },
      // Left column (num1) - 44%
      React.createElement("div", { className: "vis-col vis-col-left" },
        showLeftVisual && renderVisualContainer("left")
      ),
      // Middle column (operators) - 12%
      React.createElement("div", { className: "vis-col vis-col-middle" },
        showOperators && renderOperatorButtons(),
        showRotor && React.createElement("div", { className: "rotor-container", ref: rotorRef },
           showFinalOperator && React.createElement("div", {
               className: "final-operator-display",
           }, qData.step3.correctOperator),
          React.createElement("img", { src: "assets/rotor.gif", className: "rotor-gif" })
        )
      ),
      // Right column (num2) - 44%
      React.createElement("div", { className: "vis-col vis-col-right" },
        showRightVisual && renderVisualContainer("right")
      )
    ),
    // ── FEEDBACK ROW (15%) ──
    React.createElement("div", { className: "feedback-row" },
      // Step 1 and 2: check-feedback (80% feedback + 20% check)
      (step === 1 || step === 2) && React.createElement("div", { className: "feedback-row-inner check-feedback" },
        React.createElement("div", { className: "feedback-box-area" },
          feedbackText && React.createElement("div", {
            className: `feedback-text-bar ${feedbackType}`,
            dangerouslySetInnerHTML: { __html: handleComma(feedbackText) }
          })
        ),
        showCheckBtn && React.createElement("div", { className: "check-btn-area" },
          React.createElement("button", {
            className: "action-button check-button",
            onClick: step === 1 ? handleCheckNum1 : handleCheckNum2,
            disabled: isCurrentCorrect,
            style: { 
              opacity: isCurrentCorrect ? 0.5 : 1, 
              cursor: isCurrentCorrect ? 'default' : 'pointer' 
            }
          }, APP_DATA.check)
        )
      ),
      // Step 3 (operators) OR Step 4 (animation result): only-feedback
      ((step === 3 || step === 4) && feedbackText) && React.createElement("div", { className: "feedback-row-inner only-feedback" },
        React.createElement("div", { className: "feedback-box-area full" },
          React.createElement("div", {
            className: `feedback-text-bar ${feedbackType}`,
            dangerouslySetInnerHTML: { __html: handleComma(feedbackText.replace(/\n/g, "<br>")) }
          })
        )
      ),
      // Step 4: empty feedback row only if no feedback text (should not happen if data is correct)
      (step === 4 && !feedbackText) && null
    )
  );
};