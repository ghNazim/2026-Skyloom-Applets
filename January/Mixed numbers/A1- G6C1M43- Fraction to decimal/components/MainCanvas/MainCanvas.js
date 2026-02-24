const MainCanvas = ({
  step,
  questionIndex = 0,
  isLastQuestion = false,
  onEnableNext,
  onAdvanceStep,
  onSkipToStep3,
  onUpdateTexts,
  isAnswered,
  setIsAnswered,
  onNudgeShow,
  onNudgePosition,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const gsap = window.gsap;

  // Step 1: which part tapped
  const [fractionalTapped, setFractionalTapped] = useState(false);
  const [wholeTappedWrong, setWholeTappedWrong] = useState(false);

  // Step 2: numpad states (single shared value for both numerator and denominator boxes)
  const [multiplierInput, setMultiplierInput] = useState("");
  const [denominatorCorrect, setDenominatorCorrect] = useState(false);
  const [numeratorCorrect, setNumeratorCorrect] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const [inputWrong, setInputWrong] = useState(false);
  const [multiplyAnimDone, setMultiplyAnimDone] = useState(false);

  // Step 3: MCQ states
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [mcqAnswered, setMcqAnswered] = useState(false);
  const [wrongDenominator, setWrongDenominator] = useState(false);
  const [wrongNumerator, setWrongNumerator] = useState(false);
  const [correctFraction, setCorrectFraction] = useState(false);
  const [morphedToDecimal, setMorphedToDecimal] = useState(false);

  // Step 4: and button
  const [andClicked, setAndClicked] = useState(false);
  const [showFinalDecimal, setShowFinalDecimal] = useState(false);

  // Refs for Step 4 animation
  const andButtonRef = useRef(null);
  const wholePartRef = useRef(null);
  const decimalPartRef = useRef(null);

  // Ref for step 1 nudge (fractional part)
  const fractionalPartRef = useRef(null);

  // Refs for Step 2 animation
  const numOperandRef = useRef(null);
  const numInputRef = useRef(null);
  const denOperandRef = useRef(null);
  const denInputRef = useRef(null);
  const multiplySignsRef = useRef([]);

  // Reset states when step or question changes
  useEffect(() => {
    setFractionalTapped(false);
    setWholeTappedWrong(false);
    setMultiplierInput("");
    setDenominatorCorrect(false);
    setNumeratorCorrect(false);
    setInputShake(false);
    setInputWrong(false);
    setMultiplyAnimDone(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setMcqAnswered(false);
    setWrongDenominator(false);
    setWrongNumerator(false);
    setCorrectFraction(false);
    setMorphedToDecimal(false);
    setAndClicked(false);
    setShowFinalDecimal(false);

    const stepData = getStepData(step, questionIndex);
    if (stepData) {
      onUpdateTexts(stepData.questionText, "", stepData.navText);
    }

    // Nudge: hide when leaving step 1 or 4
    if (onNudgeShow && step !== 1 && step !== 4) {
      onNudgeShow(false);
    }

    // Show nudge only on step 4 (and button)
    let timeoutId;
    if (onNudgeShow && onNudgePosition && step === 4) {
      const measure = () => {
        const el = andButtonRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          onNudgePosition({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
          onNudgeShow(true);
        }
      };
      timeoutId = setTimeout(measure, 100);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [step, questionIndex]);

  const stepData = getStepData(step, questionIndex);
  if (!stepData) return null;

  // ========== STEP 1: Tap fractional part ==========
  const handleFractionalTap = () => {
    if (fractionalTapped) return;
    if (onNudgeShow) onNudgeShow(false);
    playSound("correct");
    setFractionalTapped(true);

    // Update nav text
    const navFinal = stepData.navTextFinal;
    if (navFinal !== undefined && navFinal !== "") {
      onUpdateTexts(null, null, navFinal);
      onEnableNext();
    } else if (navFinal === "") {
      // skipStep2 case: blank nav, wait .5s then jump to step 3
      onUpdateTexts(null, null, "");
      setTimeout(() => {
        onSkipToStep3();
      }, 500);
    }
  };

  const handleWholeTap = () => {
    if (fractionalTapped || wholeTappedWrong) return;
    playSound("wrong");
    setWholeTappedWrong(true);
    setTimeout(() => {
      setWholeTappedWrong(false);
    }, 300);
  };

  // ========== STEP 2: Numpad (single value fills both numerator and denominator boxes) ==========
  const handleNumpadNumber = (num) => {
    if (!denominatorCorrect && !numeratorCorrect) {
      setMultiplierInput(prev => (prev.length < 2 ? prev + num : prev));
    }
  };

  const handleNumpadClear = () => {
    if (!denominatorCorrect && !numeratorCorrect) {
      setMultiplierInput(prev => prev.slice(0, -1));
    }
  };

  const handleNumpadSubmit = () => {
    if (!stepData) return;
    const correctMultiplier = String(stepData.multiplier);
    const bothCorrect = denominatorCorrect && numeratorCorrect;

    if (bothCorrect) return;

    if (multiplierInput === correctMultiplier) {
      playSound("correct");
      setDenominatorCorrect(true);
      setNumeratorCorrect(true);
      // Both correct: hold state for 0.5s, then animate merge
      setTimeout(() => {
        const numOp = numOperandRef.current;
        const numIn = numInputRef.current;
        const denOp = denOperandRef.current;
        const denIn = denInputRef.current;
        const signs = multiplySignsRef.current;

        const tl = gsap.timeline({
          onComplete: () => {
            setMultiplyAnimDone(true);
            setTimeout(() => onAdvanceStep(), 1000);
          },
        });

        // Fade out and collapse multiply signs so the gap closes
        if (signs && signs.length) {
          tl.to(signs, {
            opacity: 0,
            scale: 0,
            duration: 0.25,
            ease: "power2.in",
          });
        }

        // Merge: operand moves right, input moves left so they meet in the middle
        const mergeDistance = "5.5vw";
        if (numOp && numIn) {
          tl.to(
            [numOp, numIn],
            {
              x: (i) => (i === 0 ? mergeDistance : "-" + mergeDistance),
              scale: 0.85,
              duration: 0.5,
              ease: "power2.inOut",
              overwrite: true,
            },
            "-=0.15"
          );
        }
        if (denOp && denIn) {
          tl.to(
            [denOp, denIn],
            {
              x: (i) => (i === 0 ? mergeDistance : "-" + mergeDistance),
              scale: 0.85,
              duration: 0.5,
              ease: "power2.inOut",
              overwrite: true,
            },
            "-=0.5"
          );
        }
      }, 500);
    } else {
      playSound("wrong");
      setInputWrong(true);
      setInputShake(true);
      setTimeout(() => {
        setInputShake(false);
        setInputWrong(false);
        setMultiplierInput("");
      }, 300);
    }
  };

  // ========== STEP 3: MCQ ==========
  const handleOptionClick = (option, index) => {
    if (isCorrect) return;

    // Reset previous wrong states
    setWrongDenominator(false);
    setWrongNumerator(false);

    setSelectedOption(option);

    if (index === stepData.mcqAnswerIndex) {
      setIsCorrect(true);
      setMcqAnswered(true);
      setWrongDenominator(false);
      playSound("correct");

      // Green the fraction box, then morph to decimal
      setCorrectFraction(true);
      setTimeout(() => {
        setMorphedToDecimal(true);
        // Wait 1 second then auto advance
        setTimeout(() => {
          onAdvanceStep();
        }, 1000);
      }, 500);
    } else {
      setIsCorrect(false);
      
      // Feedback logic:
      // Index 1, 2 -> Denominator wrong (reddish)
      // Index 3 -> Numerator wrong (reddish)
      if (index === 1 || index === 2) {
        setWrongDenominator(true);
      } else if (index === 3) {
        setWrongNumerator(true);
      }
      
      playSound("wrong");
      setWrongShake(true);
      setTimeout(() => {
        setWrongShake(false);
        // Do NOT clear wrong highlights here - keep them until next click
      }, 500);
    }
  };

  // Ref for the leading zero of decimal value
  const decimalZeroRef = useRef(null);
  const decimalRestRef = useRef(null);

  // ========== STEP 4: And button + combine ==========
  const handleAndClick = () => {
    if (andClicked) return;
    if (onNudgeShow) onNudgeShow(false);
    setAndClicked(true);
    playSound("click");

    // Run combine animation
    const vanishElement = andButtonRef.current;
    const wholeEl = wholePartRef.current;
    const decimalEl = decimalPartRef.current;
    const zeroEl = decimalZeroRef.current;
    const restEl = decimalRestRef.current;
    if (!vanishElement || !wholeEl || !decimalEl) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setShowFinalDecimal(true);
        playSound("correct");
        if (typeof confettiBurst === "function") confettiBurst();
        // Update texts
        if (stepData.questionTextComplete) {
          onUpdateTexts(stepData.questionTextComplete, null, stepData.navTextComplete);
        }
        onEnableNext();
      },
    });

    // Disable CSS transitions
    tl.set([wholeEl, decimalEl, vanishElement], { transition: "none" });

    // 1. Vanish the "and" button
    tl.to(vanishElement, { scale: 0, opacity: 0, duration: 0.4, ease: "back.in(1.7)" });

    // 2. Immediately strip background/border from both boxes (plain text)
    tl.set(wholeEl, {
      background: "none",
      border: "none",
      boxShadow: "none",
      padding: 0,
      minWidth: "auto",
    });
    tl.set(decimalEl, {
      background: "none",
      border: "none",
      boxShadow: "none",
      padding: 0,
      minWidth: "auto",
    });

    // 3. Calculate position and animate AFTER the set() calls have been applied
    tl.add(() => {
      const wholeRect = wholeEl.getBoundingClientRect();
      const decimalRect = decimalEl.getBoundingClientRect();
      // We want the decimal part's left edge to be right at the whole part's right edge
      const moveX = wholeRect.right - decimalRect.left;

      // Move decimal part towards whole AND fade out leading "0" simultaneously
      tl.to(decimalEl, {
        x: moveX,
        duration: 1,
        ease: "power2.inOut",
      }, "slide");

      // Fade out the leading "0" during the slide (starts slightly after, ends before slide finishes)
      if (zeroEl) {
        tl.to(zeroEl, {
          opacity: 0,
          width: 0,
          duration: 0.6,
          ease: "power2.in",
          overflow: "hidden",
        }, "slide+=0.15");
      }

      // 5. Brief hold then show result
      tl.to({}, { duration: 0.5 });
    });
  };

  // Helper: render fraction (numerator / denominator)
  const renderFraction = (num, den, containerClass, numClass, denClass) => {
    return React.createElement(
      "div",
      { className: "fraction-display " + (containerClass || "") },
      React.createElement("div", { className: "fraction-num " + (numClass || "") }, num),
      React.createElement("div", { className: "fraction-line" }),
      React.createElement("div", { className: "fraction-den " + (denClass || "") }, den)
    );
  };

  // Helper: render mixed fraction (whole + fraction)
  const renderMixedFractionDisplay = (whole, num, den) => {
    return React.createElement(
      "div",
      { className: "mixed-fraction-display" },
      React.createElement("span", { className: "mixed-whole" }, whole),
      React.createElement(
        "div",
        { className: "mixed-fraction-part" },
        React.createElement("span", { className: "fraction-num" }, num),
        React.createElement("span", { className: "fraction-line" }),
        React.createElement("span", { className: "fraction-den" }, den)
      )
    );
  };

  // ===== LEFT PANEL CONTENT =====
  const renderLeftPanel = () => {
    const q = APP_DATA.questions[questionIndex];

    // ===== STEP 1: Mixed fraction box, tap fractional part =====
    if (step === 1) {
      if (!fractionalTapped) {
        // Show mixed fraction box with clickable whole and fractional
        return React.createElement(
          "div",
          { className: "left-panel-content" },
          React.createElement(
            "div",
            { className: "main-row centered" },
            React.createElement(
              "div",
              { className: "mixed-number-box step1 pulsate" },
              React.createElement("span", {
                className: "whole-part clickable" + (wholeTappedWrong ? " wrong shake-it" : ""),
                onClick: handleWholeTap,
              }, q.whole),
              React.createElement(
                "div",
                {
                  className: "fraction-part-inline clickable",
                  onClick: handleFractionalTap,
                  ref: fractionalPartRef,
                },
                React.createElement("span", { className: "fraction-num" }, q.numerator),
                React.createElement("span", { className: "fraction-line" }),
                React.createElement("span", { className: "fraction-den" }, q.denominator)
              )
            )
          )
        );
      } else {
        // After tapping fractional: show [whole num/den] = whole and [num/den]
        return React.createElement(
          "div",
          { className: "left-panel-content" },
          React.createElement(
            "div",
            { className: "main-row centered" },
            React.createElement(
              "div",
              { className: "mixed-number-box" },
              React.createElement("span", { className: "whole-part" }, q.whole),
              React.createElement(
                "div",
                { className: "fraction-part-inline" },
                React.createElement("span", { className: "fraction-num" }, q.numerator),
                React.createElement("span", { className: "fraction-line" }),
                React.createElement("span", { className: "fraction-den" }, q.denominator)
              )
            ),
            React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
            React.createElement("span", { className: "whole-number-text" }, q.whole),
            React.createElement("span", { className: "and-text" }, stepData.andText),
            React.createElement(
              "div",
              { className: "decimal-part-box fraction-box-highlighted" },
              renderFraction(q.numerator, q.denominator)
            )
          )
        );
      }
    }

    // ===== STEP 2: Numpad input for multiplier =====
    if (step === 2) {
      if (multiplyAnimDone) {
        // Show result after animation: whole num/den = whole and [convertedNum/convertedDen]
        return React.createElement(
          "div",
          { className: "left-panel-content" },
          React.createElement(
            "div",
            { className: "main-row centered" },
            React.createElement(
              "div",
              { className: "mixed-number-box" },
              React.createElement("span", { className: "whole-part" }, q.whole),
              React.createElement(
                "div",
                { className: "fraction-part-inline" },
                React.createElement("span", { className: "fraction-num" }, q.numerator),
                React.createElement("span", { className: "fraction-line" }),
                React.createElement("span", { className: "fraction-den" }, q.denominator)
              )
            ),
            React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
            React.createElement("span", { className: "whole-number-text" }, q.whole),
            React.createElement("span", { className: "and-text" }, stepData.andText),
            React.createElement(
              "div",
              { className: "decimal-part-box fade-in", key: "step2-result" },
              renderFraction(q.convertedNumerator, q.convertedDenominator)
            )
          )
        );
      }

      // Show input: [whole num/den] = whole and [ (num × [input]) / (den × [input]) ]
      const bothHighlighted = !denominatorCorrect && !numeratorCorrect;
      const numBoxClass =
        "input-box" +
        (bothHighlighted ? " highlighted" : "") +
        (numeratorCorrect ? " correct" : "") +
        (inputShake ? " input-shake" : "") +
        (inputWrong ? " wrong" : "");
      const denBoxClass =
        "input-box" +
        (bothHighlighted ? " highlighted" : "") +
        (denominatorCorrect ? " correct" : "") +
        (inputShake ? " input-shake" : "") +
        (inputWrong ? " wrong" : "");

      const numContent = numeratorCorrect && denominatorCorrect
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "multiply-operand", ref: numOperandRef }, q.numerator),
            React.createElement("span", {
              className: "multiply-sign",
              ref: el => multiplySignsRef.current[0] = el
            }, stepData.multiplySign),
            React.createElement("div", { ref: numInputRef, className: numBoxClass }, multiplierInput || "\u00A0")
          )
        : React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "multiply-operand" }, q.numerator),
            React.createElement("span", { className: "multiply-sign" }, stepData.multiplySign),
            React.createElement("div", { className: numBoxClass }, multiplierInput || "\u00A0")
          );

      const denContent = numeratorCorrect && denominatorCorrect
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "multiply-operand", ref: denOperandRef }, q.denominator),
            React.createElement("span", {
              className: "multiply-sign",
              ref: el => multiplySignsRef.current[1] = el
            }, stepData.multiplySign),
            React.createElement("div", { ref: denInputRef, className: denBoxClass }, multiplierInput || "\u00A0")
          )
        : React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "multiply-operand" }, q.denominator),
            React.createElement("span", { className: "multiply-sign" }, stepData.multiplySign),
            React.createElement("div", { className: denBoxClass }, multiplierInput || "\u00A0")
          );

      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row centered" },
          React.createElement(
            "div",
            { className: "mixed-number-box" },
            React.createElement("span", { className: "whole-part" }, q.whole),
            React.createElement(
              "div",
              { className: "fraction-part-inline" },
              React.createElement("span", { className: "fraction-num" }, q.numerator),
              React.createElement("span", { className: "fraction-line" }),
              React.createElement("span", { className: "fraction-den" }, q.denominator)
            )
          ),
          React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
          React.createElement("span", { className: "whole-number-text" }, q.whole),
          React.createElement("span", { className: "and-text" }, stepData.andText),
          React.createElement(
            "div",
            { className: "input-fraction-container" },
            React.createElement(
              "div",
              { className: "input-fraction-row" },
              numContent
            ),
            React.createElement("div", { className: "input-fraction-line" }),
            React.createElement(
              "div",
              { className: "input-fraction-row" },
              denContent
            )
          )
        )
      );
    }

    // ===== STEP 3: MCQ for decimal form =====
    if (step === 3) {
      const fractionContent = morphedToDecimal
        ? (current_language === "id"
            ? React.createElement("span", {
                className: "decimal-morphed",
                dangerouslySetInnerHTML: { __html: handleComma(stepData.decimalValue) },
              })
            : React.createElement("span", { className: "decimal-morphed" }, stepData.decimalValue))
        : renderFraction(
            q.convertedNumerator,
            q.convertedDenominator,
            "",
            wrongNumerator ? "text-red" : "",
            wrongDenominator ? "text-red" : ""
          );

      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row centered" },
          React.createElement(
            "div",
            { className: "mixed-number-box" },
            React.createElement("span", { className: "whole-part" }, q.whole),
            React.createElement(
              "div",
              { className: "fraction-part-inline" },
              React.createElement("span", { className: "fraction-num" }, q.numerator),
              React.createElement("span", { className: "fraction-line" }),
              React.createElement("span", { className: "fraction-den" }, q.denominator)
            )
          ),
          React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
          React.createElement("span", { className: "whole-number-text" }, q.whole),
          React.createElement("span", { className: "and-text" }, stepData.andText),
          React.createElement(
            "div",
            {
              className: "decimal-part-box" +
                (correctFraction ? " correct" : "") +
                (!correctFraction && !wrongDenominator && !wrongNumerator ? " pulsate" : "") +
                (wrongDenominator || wrongNumerator ? " wrong-shake" : ""),
            },
            fractionContent
          )
        )
      );
    }

    // ===== STEP 4: And button to combine =====
    if (step === 4) {
      if (showFinalDecimal) {
        // After combine animation: show final decimal
        return React.createElement(
          "div",
          { className: "left-panel-content" },
          React.createElement(
            "div",
            { className: "main-row centered" },
            React.createElement(
              "div",
              { className: "mixed-number-box" },
              React.createElement("span", { className: "whole-part" }, q.whole),
              React.createElement(
                "div",
                { className: "fraction-part-inline" },
                React.createElement("span", { className: "fraction-num" }, q.numerator),
                React.createElement("span", { className: "fraction-line" }),
                React.createElement("span", { className: "fraction-den" }, q.denominator)
              )
            ),
            React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
            React.createElement(
              "div",
              { className: "final-decimal-box" },
              current_language === "id"
                ? React.createElement("span", {
                    className: "final-decimal-value",
                    dangerouslySetInnerHTML: { __html: handleComma(stepData.finalDecimal) },
                  })
                : React.createElement("span", { className: "final-decimal-value" }, stepData.finalDecimal)
            )
          )
        );
      }

      // Before combine: whole and [decimal] with and button
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row centered" },
          React.createElement(
            "div",
            { className: "mixed-number-box" },
            React.createElement("span", { className: "whole-part" }, q.whole),
            React.createElement(
              "div",
              { className: "fraction-part-inline" },
              React.createElement("span", { className: "fraction-num" }, q.numerator),
              React.createElement("span", { className: "fraction-line" }),
              React.createElement("span", { className: "fraction-den" }, q.denominator)
            )
          ),
          React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
          React.createElement(
            "div",
            { className: "whole-part-box", ref: wholePartRef },
            q.whole
          ),
          React.createElement("button", {
            className: "and-button" + (andClicked ? " clicked" : ""),
            onClick: handleAndClick,
            ref: andButtonRef,
          }, stepData.andText),
          React.createElement(
            "div",
            { className: "decimal-part-box correct", ref: decimalPartRef },
            // Split decimal value: "0.12" or "0,12" -> "0" + ".12" or ",12"
            React.createElement("span", {
              ref: decimalZeroRef,
              className: "decimal-leading-zero",
              style: { display: "inline-block" },
            }, stepData.decimalValue.charAt(0)),
            current_language === "id"
              ? React.createElement("span", {
                  ref: decimalRestRef,
                  className: "decimal-rest",
                  dangerouslySetInnerHTML: { __html: handleComma(stepData.decimalValue.substring(1)) },
                })
              : React.createElement("span", {
                  ref: decimalRestRef,
                  className: "decimal-rest",
                }, stepData.decimalValue.substring(1))
          )
        )
      );
    }

    return null;
  };

  // ===== RIGHT PANEL =====
  const getRightPanel = () => {
    if (step === 2) {
      const numpadDisabled = numeratorCorrect && denominatorCorrect;
      return React.createElement(Numpad, {
        disabled: numpadDisabled,
        onNumberClick: handleNumpadNumber,
        onClear: handleNumpadClear,
        onSubmit: handleNumpadSubmit,
      });
    }
    if (step === 3 && stepData.mcqOptions) {
      const mcqData = {
        title: "",
        options: stepData.mcqOptions,
        feedbacks: stepData.mcqFeedbacks,
      };
      return React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        onOptionClick: (option) => {
          const index = stepData.mcqOptions.indexOf(option);
          handleOptionClick(option, index);
        },
        showFeedback: true,
        shake: wrongShake,
      });
    }
    return null;
  };

  const rightPanel = getRightPanel();

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "column left-column" },
      renderLeftPanel()
    ),
    React.createElement(
      "div",
      { className: "column right-column" + (rightPanel ? "" : " empty") },
      rightPanel
    )
  );
};
