const MainCanvas = ({
  step,
  question,
  questionIndex,
  totalQuestions,
  selectedOperator,
  isCorrectCurrent,
  onOperatorSelect,
  onCorrectAnimationComplete,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef } = React;

  const [correctPhase, setCorrectPhase] = useState(0); // 0 none, 1 first feedback, 2 second feedback, 3 done (box filled)
  const [cloneFlying, setCloneFlying] = useState(false);
  const [cloneStyle, setCloneStyle] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [wrongPulsateActive, setWrongPulsateActive] = useState(true); // red pulsate for 3–4 cycles then stop
  const [showWiggle, setShowWiggle] = useState(false);

  const STEP_DELAY_MS = 3500;
  const WRONG_PULSATE_DURATION_MS = 3200; // 4 × 0.8s
  const WIGGLE_DURATION_MS = 300;

  const operatorBoxRef = useRef(null);
  const correctButtonRef = useRef(null);
  const cloneRef = useRef(null);

  const isCorrectChoice = selectedOperator === question.operator;
  const inCorrectFlow = selectedOperator !== null && isCorrectChoice && !isCorrectCurrent;

  // Reset phase when question changes
  useEffect(() => {
    setCorrectPhase(0);
    setCloneFlying(false);
    setCloneStyle(null);
    setFeedbackVisible(false);
    setWrongPulsateActive(true);
    setShowWiggle(false);
  }, [questionIndex]);

  // Wrong answer: red pulsate for 3–4 cycles then keep only red highlight
  useEffect(() => {
    const isWrong = selectedOperator !== null && selectedOperator !== question.operator;
    if (!isWrong) {
      setWrongPulsateActive(true);
      return;
    }
    setWrongPulsateActive(true);
    const t = setTimeout(() => setWrongPulsateActive(false), WRONG_PULSATE_DURATION_MS);
    return () => clearTimeout(t);
  }, [selectedOperator, question.operator]);

  // Wrong answer: wiggle buttons strip once per wrong selection
  useEffect(() => {
    const isWrong = selectedOperator !== null && selectedOperator !== question.operator;
    if (isWrong) setShowWiggle(true);
  }, [selectedOperator, question.operator]);
  useEffect(() => {
    if (!showWiggle) return;
    const t = setTimeout(() => setShowWiggle(false), WIGGLE_DURATION_MS);
    return () => clearTimeout(t);
  }, [showWiggle]);

  // Enter phase 1 when user selects correct operator; trigger feedback transition for wrong
  useEffect(() => {
    if (selectedOperator === null) return;
    if (inCorrectFlow) {
      if (correctPhase === 0) {
        setCorrectPhase(1);
        setFeedbackVisible(false);
        requestAnimationFrame(() => setFeedbackVisible(true));
      }
    } else {
      setCorrectPhase(0);
      setFeedbackVisible(false);
      requestAnimationFrame(() => setFeedbackVisible(true));
    }
  }, [inCorrectFlow, selectedOperator]);

  // Phase 1 -> Phase 2 after STEP_DELAY_MS
  useEffect(() => {
    if (correctPhase !== 1) return;
    const t = setTimeout(() => setCorrectPhase(2), STEP_DELAY_MS);
    return () => clearTimeout(t);
  }, [correctPhase]);

  // Phase 2 -> start clone animation after STEP_DELAY_MS
  useEffect(() => {
    if (correctPhase !== 2) return;
    const t = setTimeout(() => setCloneFlying(true), STEP_DELAY_MS);
    return () => clearTimeout(t);
  }, [correctPhase]);

  // Clone fly animation with GSAP when cloneFlying becomes true
  // useLayoutEffect ensures refs are set and we run before paint; rAF defers tween so clone is laid out
  useLayoutEffect(() => {
    if (!cloneFlying || !operatorBoxRef.current || !correctButtonRef.current) return;

    const box = operatorBoxRef.current;
    const btn = correctButtonRef.current;
    const boxRect = box.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;
    const endX = boxRect.left + boxRect.width / 2;
    const endY = boxRect.top + boxRect.height / 2;

    const initialStyle = {
      left: startX + "px",
      top: startY + "px",
      transform: "translate(-50%, -50%)",
    };
    setCloneStyle(initialStyle);

    const gsapLib = typeof gsap !== "undefined" ? gsap : window.gsap;
    if (!gsapLib) {
      const fallback = setTimeout(() => {
        setCloneFlying(false);
        setCorrectPhase(3);
        onCorrectAnimationComplete && onCorrectAnimationComplete();
      }, 500);
      return () => clearTimeout(fallback);
    }

    // Start tween on next frame so clone is in DOM and ref is set
    let tween = null;
    const rafId = requestAnimationFrame(() => {
      const cloneEl = cloneRef.current;
      if (!cloneEl) {
        setCloneFlying(false);
        setCorrectPhase(3);
        onCorrectAnimationComplete && onCorrectAnimationComplete();
        return;
      }
      gsapLib.set(cloneEl, { left: startX, top: startY, xPercent: -50, yPercent: -50 });
      tween = gsapLib.to(cloneEl, {
        left: endX,
        top: endY,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          setCloneFlying(false);
          setCloneStyle(null);
          setCorrectPhase(3);
          onCorrectAnimationComplete && onCorrectAnimationComplete();
        },
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (tween && tween.kill) tween.kill();
      if (cloneRef.current && gsapLib.killTweensOf) gsapLib.killTweensOf(cloneRef.current);
    };
  }, [cloneFlying, onCorrectAnimationComplete]);

  const renderDecimalNumber = (numStr) => {
    const chars = numStr.split("");
    const highlightIndex = question.highlightIndex;
    const hasAnswered = selectedOperator !== null;
    const isWrong = hasAnswered && !isCorrectChoice;
    const isRight = isCorrectCurrent;
    const phase1Blue = inCorrectFlow && (correctPhase === 1 || correctPhase === 2);
    const phase2Green = inCorrectFlow && correctPhase >= 2 && !cloneFlying;

    return React.createElement(
      "div",
      { className: "fraction-box compare-decimal-box" },
      ...chars.map((ch, i) => {
        const isDecimal = ch === "." || ch === ",";
        const isHighlight = i === highlightIndex;
        let spanClass = "decimal-digit";
        if (isDecimal) {
          spanClass += " decimal-char" ;
          if(ch === ",") spanClass += " cm";
        } else {
          if (isHighlight && isWrong) {
            spanClass += " digit-highlight-wrong";
            if (wrongPulsateActive) spanClass += " red-pulsate";
          } else if (isHighlight && phase1Blue && correctPhase === 1) spanClass += " blue-pulsate";
          else if (isHighlight && (phase2Green || isRight)) spanClass += " digit-highlight-correct";
        }
        return React.createElement("span", { key: i, className: spanClass }, ch);
      })
    );
  };

  const getFeedbackContent = () => {
    if (selectedOperator === null) return null;

    const steps = question.correctFeedbackSteps;
    const isWrong = selectedOperator !== question.operator;
    const neutralOrPhase1 = inCorrectFlow && correctPhase === 1;
    const phase2 = inCorrectFlow && correctPhase === 2;
    const phase3 = correctPhase === 3 || isCorrectCurrent;

    let text = null;
    let bubbleClass = "feedback-bubble";
    if (isWrong) {
      text = question.wrongFeedback;
      bubbleClass += " feedback-wrong";
    } else if (neutralOrPhase1 && steps && steps[0]) {
      text = steps[0];
      bubbleClass += " feedback-neutral";
    } else if (phase2 && steps && steps[1]) {
      text = steps[1];
      bubbleClass += " feedback-correct";
    } else if ((phase3 || isCorrectCurrent) && steps && steps[2]) {
      text = steps[2];
      bubbleClass += " feedback-correct";
    }
    if (!text) return null;
    if (feedbackVisible || !inCorrectFlow) bubbleClass += " feedback-visible";
    return React.createElement("div", { className: bubbleClass }, text);
  };

  // When wrong: show selected operator in box immediately. When correct: only after phase 3 / isCorrectCurrent.
  const showOperatorInBox = (correctPhase === 3 || isCorrectCurrent) && isCorrectChoice;
  const operatorBoxContent =
    selectedOperator !== null && !isCorrectChoice
      ? selectedOperator
      : showOperatorInBox
        ? question.operator
        : "";

  const operatorBoxClass = [
    "operator-box",
    selectedOperator && !isCorrectChoice ? "operator-box-wrong" : "",
    showOperatorInBox ? "operator-box-correct" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const getButtonClass = (op) => {
    if (selectedOperator !== op) return "operator-btn";
    if (!isCorrectChoice) return "operator-btn operator-btn-wrong";
    return "operator-btn operator-btn-correct";
  };

  const setCorrectButtonRef = (el, op) => {
    if (op === question.operator) correctButtonRef.current = el;
  };

  if (step !== 1) {
    return React.createElement("div", { className: "main-canvas-container compare-canvas" });
  }

  const cloneEl = cloneFlying
    ? React.createElement(
        "div",
        {
          ref: cloneRef,
          className: "operator-btn-clone",
          style: cloneStyle || {},
        },
        question.operator
      )
    : null;

  const usePortal = cloneEl && typeof ReactDOM !== "undefined" && ReactDOM.createPortal;
  return React.createElement(
    React.Fragment,
    null,
    usePortal ? ReactDOM.createPortal(cloneEl, document.body) : null,
    React.createElement(
      "div",
      { className: "main-canvas-container compare-canvas" },
      !usePortal && cloneEl,
      React.createElement(
        "div",
        { className: "compare-canvas-inner" },
      React.createElement(
        "div",
        { className: "feedback-row" },
        getFeedbackContent()
      ),
      React.createElement(
        "div",
        { className: "main-row" },
        renderDecimalNumber(question.num1),
        React.createElement(
          "div",
          { className: "operator-box-wrapper" },
          React.createElement(
            "div",
            {
              ref: operatorBoxRef,
              className: operatorBoxClass,
            },
            operatorBoxContent
          ),
          (isCorrectCurrent ? null : React.createElement(
            "div",
            {
              className: "buttons-strip"
                + (inCorrectFlow ? " buttons-strip-disabled" : "")
                + (selectedOperator !== null && !isCorrectChoice && showWiggle ? " buttons-strip-wiggle" : ""),
            },
            React.createElement(
              "button",
              {
                type: "button",
                ref: (el) => setCorrectButtonRef(el, ">"),
                className: getButtonClass(">"),
                onClick: () => onOperatorSelect(">"),
                disabled: isCorrectCurrent,
              },
              ">"
            ),
            React.createElement(
              "button",
              {
                type: "button",
                ref: (el) => setCorrectButtonRef(el, "="),
                className: getButtonClass("="),
                onClick: () => onOperatorSelect("="),
                disabled: isCorrectCurrent,
              },
              "="
            ),
            React.createElement(
              "button",
              {
                type: "button",
                ref: (el) => setCorrectButtonRef(el, "<"),
                className: getButtonClass("<"),
                onClick: () => onOperatorSelect("<"),
                disabled: isCorrectCurrent,
              },
              "<"
            )
          ))
        ),
        renderDecimalNumber(question.num2)
      )
    )
    )
  );
};
