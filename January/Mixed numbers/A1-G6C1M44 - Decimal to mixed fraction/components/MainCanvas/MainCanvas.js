const MainCanvas = ({
  step,
  questionIndex = -1,
  isLastQuestion = false,
  onEnableNext,
  onAdvanceStep,
  onUpdateTexts,
  isAnswered,
  setIsAnswered,
  onNudgeShow,
  onNudgePosition,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const gsap = window.gsap;

  // MCQ States (for step 3)
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [mcqAnswered, setMcqAnswered] = useState(false);

  // Step 2: decimal part tapped
  const [decimalTapped, setDecimalTapped] = useState(false);

  // Step 3: wrong answer visual feedback
  const [wrongVisual, setWrongVisual] = useState(false);
  // Step 3: correct answer visual feedback  
  const [correctVisual, setCorrectVisual] = useState(false);

  // Step 4: numpad states
  const [numeratorInput, setNumeratorInput] = useState("");
  const [denominatorInput, setDenominatorInput] = useState("");
  const [activeInput, setActiveInput] = useState("numerator"); // "numerator" or "denominator"
  const [numeratorCorrect, setNumeratorCorrect] = useState(false);
  const [denominatorCorrect, setDenominatorCorrect] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const [inputWrong, setInputWrong] = useState(false);

  // Step 5: and button (first question) or MCQ (later questions)
  const [andClicked, setAndClicked] = useState(false);
  const [showMixedFraction, setShowMixedFraction] = useState(false);
  const [selectedStep5Option, setSelectedStep5Option] = useState(null);
  const [step5Correct, setStep5Correct] = useState(false);
  const [step5WrongShake, setStep5WrongShake] = useState(false);

  // Refs for Step 5 animation
  const andButtonRef = useRef(null);
  const andTextRef = useRef(null); // when "and" is text (questionIndex >= 0)
  const wholePartRef = useRef(null);
  const fractionPartRef = useRef(null);
  // Ref for Step 2 nudge target (fractional-digits clickable)
  const fractionalDigitsRef = useRef(null);

  // Reset states when step changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setMcqAnswered(false);
    setDecimalTapped(false);
    setWrongVisual(false);
    setCorrectVisual(false);
    setNumeratorInput("");
    setDenominatorInput("");
    setActiveInput("numerator");
    setNumeratorCorrect(false);
    setDenominatorCorrect(false);
    setInputShake(false);
    setInputWrong(false);
    setAndClicked(false);
    setShowMixedFraction(false);
    setSelectedStep5Option(null);
    setStep5Correct(false);
    setStep5WrongShake(false);

    const stepData = getStepData(step, questionIndex);
    if (stepData) {
      onUpdateTexts(stepData.questionText, "", stepData.navText);
    }

    // Nudge: hide when leaving step 2 or 5
    if (onNudgeShow && step !== 2 && step !== 5) {
      onNudgeShow(false);
    }
    // Nudge: show at target when entering step 2 or 5 (step 5 nudge only for first question)
    let timeoutId;
    if (onNudgeShow && onNudgePosition && step === 2) {
      const measure = () => {
        const el = fractionalDigitsRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          onNudgePosition({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
          onNudgeShow(true);
        }
      };
      timeoutId = setTimeout(measure, 100);
    } else if (onNudgeShow && onNudgePosition && step === 5 && questionIndex === -1) {
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

  // Handle decimal part tap in step 2
  const handleDecimalTap = () => {
    if (step === 2 && !decimalTapped) {
      if (onNudgeShow) onNudgeShow(false);
      playSound("click");
      setDecimalTapped(true);
      // Auto advance to step 3
      setTimeout(() => {
        onAdvanceStep();
      }, 600);
    }
  };

  // Handle MCQ option click in step 3
  const handleOptionClick = (option) => {
    if (isCorrect) return;

    const stepData = getStepData(3, questionIndex);
    if (!stepData || !stepData.mcq) return;

    setSelectedOption(option);

    if (option === stepData.mcq.answer) {
      setIsCorrect(true);
      setMcqAnswered(true);
      setCorrectVisual(true);
      setWrongVisual(false);
      playSound("correct");

      // Update nav text
      if (stepData.navTextCorrect) {
        onUpdateTexts(null, null, stepData.navTextCorrect);
      }

      setTimeout(() => {
        onEnableNext();
        if (setIsAnswered) setIsAnswered(true);
      }, 500);
    } else {
      setIsCorrect(false);
      setWrongVisual(true);
      playSound("wrong");
      setWrongShake(true);
      setTimeout(() => {
        setWrongShake(false);
        setWrongVisual(false);
      }, 800);
    }
  };

  // Handle numpad input for step 4
  const handleNumpadNumber = (num) => {
    if (activeInput === "numerator" && !numeratorCorrect) {
      setNumeratorInput(prev => prev + num);
    } else if (activeInput === "denominator" && !denominatorCorrect) {
      setDenominatorInput(prev => prev + num);
    }
  };

  const handleNumpadClear = () => {
    if (activeInput === "numerator" && !numeratorCorrect) {
      setNumeratorInput(prev => prev.slice(0, -1));
    } else if (activeInput === "denominator" && !denominatorCorrect) {
      setDenominatorInput(prev => prev.slice(0, -1));
    }
  };

  const handleNumpadSubmit = () => {
    const stepData = getStepData(4, questionIndex);
    if (!stepData) return;

    if (activeInput === "numerator" && !numeratorCorrect) {
      if (numeratorInput === stepData.simplifiedNumerator) {
        playSound("correct");
        setNumeratorCorrect(true);
        setActiveInput("denominator");
      } else {
        playSound("wrong");
        setInputWrong(true);
        setInputShake(true);
        setTimeout(() => {
          setInputShake(false);
          setInputWrong(false);
          setNumeratorInput("");
        }, 300);
      }
    } else if (activeInput === "denominator" && !denominatorCorrect) {
      if (denominatorInput === stepData.simplifiedDenominator) {
        playSound("correct");
        setDenominatorCorrect(true);
        // Both correct - auto advance after 2 sec
        setTimeout(() => {
          onAdvanceStep();
        }, 2000);
      } else {
        playSound("wrong");
        setInputWrong(true);
        setInputShake(true);
        setTimeout(() => {
          setInputShake(false);
          setInputWrong(false);
          setDenominatorInput("");
        }, 300);
      }
    }
  };

  // Shared combine animation (vanish "and" element, move boxes, then show mixed fraction)
  const runCombineAnimation = (vanishElement) => {
    if (!vanishElement || !wholePartRef.current || !fractionPartRef.current) return;
    const sd = getStepData(5, questionIndex);
    const navText = (questionIndex >= 0 && isLastQuestion && sd && sd.navTextLast)
      ? sd.navTextLast
      : (sd && sd.navTextComplete) ? sd.navTextComplete : "";

    const tl = gsap.timeline({
      onComplete: () => {
        setShowMixedFraction(true);
        playSound("correct");
        if (typeof confettiBurst === "function") confettiBurst();
        if (sd && sd.questionTextComplete != null) {
          onUpdateTexts(sd.questionTextComplete, null, navText);
        }
        onEnableNext();
      },
    });

    tl.set([wholePartRef.current, fractionPartRef.current, vanishElement], { transition: "none" });
    tl.to(vanishElement, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(1.7)" });
    tl.to(wholePartRef.current, { x: "100%", duration: 0.5, ease: "power2.inOut" }, "move");
    tl.to(fractionPartRef.current, { x: "-100%", duration: 0.5, ease: "power2.inOut" }, "move");
    tl.to([wholePartRef.current, fractionPartRef.current], {
      scale: 0.5,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  };

  // Handle "and" button click in step 5 (first question only)
  const handleAndClick = () => {
    if (andClicked) return;
    if (onNudgeShow) onNudgeShow(false);
    setAndClicked(true);
    playSound("click");
    runCombineAnimation(andButtonRef.current);
  };

  // Handle step 5 MCQ option (later questions: choose correct mixed number)
  const handleStep5McqSelect = (option) => {
    if (step5Correct) return;
    const sd = getStepData(5, questionIndex);
    if (!sd || !sd.step5Mcq) return;
    setSelectedStep5Option(option);
    const correctOption = sd.step5Mcq.options[sd.step5Mcq.answerIndex];
    if (option === correctOption) {
      setStep5Correct(true);
      playSound("correct");
      runCombineAnimation(andTextRef.current);
    } else {
      playSound("wrong");
      setStep5WrongShake(true);
      setTimeout(() => setStep5WrongShake(false), 800);
    }
  };

  // Get step data (first question from APP_DATA.steps, later from questions array via getStepData)
  const stepData = getStepData(step, questionIndex);
  if (!stepData) return null;

  // Determine right panel content
  const getRightPanel = () => {
    if (step === 3 && stepData.mcq) {
      // MCQ panel
      const mcqData = {
        title: "",
        options: stepData.mcq.options,
        feedbacks: stepData.mcq.feedbacks,
      };
      return React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        onOptionClick: handleOptionClick,
        showFeedback: true,
        shake: wrongShake,
      });
    }
    if (step === 4) {
      // Numpad panel
      const numpadDisabled = numeratorCorrect && denominatorCorrect;
      return React.createElement(Numpad, {
        disabled: numpadDisabled,
        onNumberClick: handleNumpadNumber,
        onClear: handleNumpadClear,
        onSubmit: handleNumpadSubmit,
      });
    }
    if (step === 5 && questionIndex >= 0 && stepData.step5Mcq) {
      // Step 5 MCQ (mixed number choice) for questions from array
      const mcqData = {
        title: "",
        options: stepData.step5Mcq.options,
        feedbacks: { correct: "Correct!", wrong: "Not quite." },
      };
      return React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: selectedStep5Option,
        isCorrect: step5Correct,
        onOptionClick: handleStep5McqSelect,
        showFeedback: true,
        shake: step5WrongShake,
      });
    }
    // Steps 1, 2, 5 (first question): blank
    return null;
  };

  // Helper: render fraction element (numerator / denominator)
  const renderFraction = (num, den, className) => {
    return React.createElement(
      "div",
      { className: "fraction-display " + (className || "") },
      React.createElement("span", { className: "fraction-num" }, num),
      React.createElement("span", { className: "fraction-line" }),
      React.createElement("span", { className: "fraction-den" }, den)
    );
  };

  // Helper: render mixed fraction (e.g., 3 1/4)
  const renderMixedFraction = (whole, num, den) => {
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

  // === LEFT PANEL CONTENT ===
  const renderLeftPanel = () => {
    // Step 1: Single centered decimal number box
    if (step === 1) {
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row centered" },
          React.createElement(
            "div",
            { className: "mixed-number-box big" },
            React.createElement("span", { className: "integer-part" }, stepData.integerPart),
            React.createElement("span", { className: "decimal-point" }, stepData.decimalPoint),
            React.createElement("span", { className: "fractional-digits" }, stepData.fractionalDigits)
          )
        )
      );
    }

    // Step 2: Single centered decimal number box with clickable decimal
    if (step === 2) {
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row centered" },
          React.createElement(
            "div",
            { className: "mixed-number-box big" + (decimalTapped ? " tapped" : "") },
            React.createElement("span", { className: "integer-part" }, stepData.integerPart),
            React.createElement("span", {
              className: "decimal-point clickable" + (decimalTapped ? " tapped" : ""),
              onClick: handleDecimalTap,
            }, stepData.decimalPoint),
            React.createElement("span", {
              ref: fractionalDigitsRef,
              className: "fractional-digits clickable" + (decimalTapped ? " tapped" : ""),
              onClick: handleDecimalTap,
            }, stepData.fractionalDigits)
          )
        )
      );
    }

    // Step 3: [3.25] = [3] and [0.25] with labels
    if (step === 3) {
      const decimalPartContent = correctVisual
        ? renderFraction(stepData.fractionNumerator, stepData.fractionDenominator)
        : React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "decimal-zero" , dangerouslySetInnerHTML: { __html: "0" + handleComma(stepData.decimalPoint) } },),
            React.createElement("span", {
              className: "decimal-digits" + (wrongVisual ? " wrong-visual" : ""),
            }, stepData.decimalPartDigits)
          );

      const labelText = correctVisual ? stepData.labelFractional : stepData.labelDecimal;

      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row" },
          // [3.25]
          React.createElement(
            "div",
            { className: "mixed-number-box" },
            React.createElement("span", { className: "integer-part" }, stepData.integerPart),
            React.createElement("span", { className: "decimal-point" }, stepData.decimalPoint),
            React.createElement("span", { className: "fractional-digits" }, stepData.fractionalDigits)
          ),
          // =
          React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
          // [3] with label
          React.createElement(
            "div",
            { className: "labeled-box-container" },
            React.createElement(
              "div",
              { className: "whole-part-box" },
              stepData.wholePart
            ),
            React.createElement(
              "div",
              { className: "box-label" },
              stepData.labelWhole
            )
          ),
          // and
          React.createElement("span", { className: "and-text" }, stepData.andText),
          // [0.25] with label
          React.createElement(
            "div",
            { className: "labeled-box-container" },
            React.createElement(
              "div",
              {
                className: "decimal-part-box" +
                  (correctVisual ? " correct" : "") +
                  (!correctVisual && !wrongVisual ? " pulsate" : ""),
              },
              decimalPartContent
            ),
            React.createElement(
              "div",
              { className: "box-label" },
              labelText
            )
          )
        )
      );
    }

    // Step 4: Two rows
    if (step === 4) {
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        // First row: [3.25] = [3] and [25/100]
        React.createElement(
          "div",
          { className: "main-row" },
          // [3.25]
          React.createElement(
            "div",
            { className: "mixed-number-box" },
            React.createElement("span", { className: "integer-part" }, stepData.integerPart),
            React.createElement("span", { className: "decimal-point" }, stepData.decimalPoint),
            React.createElement("span", { className: "fractional-digits" }, stepData.fractionalDigits)
          ),
          // =
          React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
          // [3]
          React.createElement(
            "div",
            { className: "labeled-box-container" },
            React.createElement(
              "div",
              { className: "whole-part-box" },
              stepData.wholePart
            ),
            React.createElement(
              "div",
              { className: "box-label" },
              stepData.labelWhole
            )
          ),
          // and
          React.createElement("span", { className: "and-text" }, stepData.andText),
          // [25/100]
          React.createElement(
            "div",
            { className: "labeled-box-container" },
            React.createElement(
              "div",
              { className: "decimal-part-box" },
              renderFraction(stepData.fractionNumerator, stepData.fractionDenominator)
            ),
            React.createElement(
              "div",
              { className: "box-label" },
              stepData.labelFractional
            )
          )
        ),
        // Second row: [3.25(invisible)] = [3] + input/input
        React.createElement(
          "div",
          { className: "main-row second-row" },
          // [3.25] invisible placeholder
          React.createElement(
            "div",
            { className: "mixed-number-box invisible-placeholder" },
            React.createElement("span", { className: "integer-part" }, stepData.integerPart),
            React.createElement("span", { className: "decimal-point" }, stepData.decimalPoint),
            React.createElement("span", { className: "fractional-digits" }, stepData.fractionalDigits)
          ),
          // =
          React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
          // [3]
          React.createElement(
            "div",
            { className: "whole-part-box" },
            stepData.wholePart
          ),
          // +
          React.createElement("span", { className: "plus-sign" }, stepData.plusSign),
          // Input fraction boxes (cancel tags positioned absolute on input boxes when both correct)
          React.createElement(
            "div",
            { className: "input-fraction-container" },
            React.createElement(
              "div",
              { className: "input-box-wrap" },
              React.createElement(
                "div",
                {
                  className: "input-box" +
                    (activeInput === "numerator" && !numeratorCorrect ? " highlighted" : "") +
                    (numeratorCorrect ? " correct" : "") +
                    (inputShake && activeInput === "numerator" ? " input-shake" : "") +
                    (inputWrong && activeInput === "numerator" ? " wrong" : ""),
                },
                numeratorInput || "\u00A0"
              ),
              numeratorCorrect && denominatorCorrect && stepData.cancelTag
                ? React.createElement("span", { className: "input-cancel-tag" }, stepData.cancelTag)
                : null
            ),
            React.createElement("div", { className: "input-fraction-line" }),
            React.createElement(
              "div",
              { className: "input-box-wrap" },
              React.createElement(
                "div",
                {
                  className: "input-box" +
                    (activeInput === "denominator" && !denominatorCorrect ? " highlighted" : "") +
                    (denominatorCorrect ? " correct" : "") +
                    (inputShake && activeInput === "denominator" ? " input-shake" : "") +
                    (inputWrong && activeInput === "denominator" ? " wrong" : ""),
                },
                denominatorInput || "\u00A0"
              ),
              numeratorCorrect && denominatorCorrect && stepData.cancelTag
                ? React.createElement("span", { className: "input-cancel-tag" }, stepData.cancelTag)
                : null
            )
          )
        )
      );
    }

    // Step 5: [3.25] = [3] and [1/4] → mixed fraction
    if (step === 5) {
      if (showMixedFraction) {
        // After and button animation - show final mixed fraction
        return React.createElement(
          "div",
          { className: "left-panel-content" },
          React.createElement(
            "div",
            { className: "main-row centered" },
            // [3.25]
            React.createElement(
              "div",
              { className: "mixed-number-box" },
              React.createElement("span", { className: "integer-part" }, stepData.integerPart),
              React.createElement("span", { className: "decimal-point" }, stepData.decimalPoint),
              React.createElement("span", { className: "fractional-digits" }, stepData.fractionalDigits)
            ),
            // =
            React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
            // Mixed fraction box
            React.createElement(
              "div",
              { className: "mixed-fraction-box fade-in" },
              renderMixedFraction(stepData.mixedWhole, stepData.mixedNumerator, stepData.mixedDenominator)
            )
          )
        );
      }

      // Before combine: whole + "and" (button or text) + fraction
      const andClickedOrMcqCorrect = andClicked || step5Correct;
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row" },
          // [decimal]
          React.createElement(
            "div",
            { className: "mixed-number-box" },
            React.createElement("span", { className: "integer-part" }, stepData.integerPart),
            React.createElement("span", { className: "decimal-point" }, stepData.decimalPoint),
            React.createElement("span", { className: "fractional-digits" }, stepData.fractionalDigits)
          ),
          React.createElement("span", { className: "equals-sign" }, stepData.equalsSign),
          React.createElement(
            "div",
            { className: "labeled-box-container", ref: wholePartRef },
            React.createElement(
              "div",
              { className: "whole-part-box" },
              stepData.wholePart
            ),
            React.createElement(
              "div",
              { className: "box-label" },
              stepData.labelWhole
            )
          ),
          // "and" as button (first question) or text (later questions)
          questionIndex === -1
            ? React.createElement("button", {
                className: "and-button" + (andClicked ? " clicked" : ""),
                onClick: handleAndClick,
                ref: andButtonRef,
              }, stepData.andText)
            : React.createElement("span", {
                className: "and-text",
                ref: andTextRef,
              }, stepData.andText),
          React.createElement(
            "div",
            { className: "labeled-box-container", ref: fractionPartRef },
            React.createElement(
              "div",
              { className: "decimal-part-box correct" },
              renderFraction(stepData.simplifiedNumerator, stepData.simplifiedDenominator)
            ),
            React.createElement(
              "div",
              { className: "box-label" },
              stepData.labelFractional
            )
          )
        )
      );
    }

    // Step 6: placeholder (content to be defined later)
    if (step === 6) {
      return React.createElement("div", { className: "left-panel-content" });
    }

    return null;
  };

  const rightPanel = getRightPanel();

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    // Left Column (73%)
    React.createElement(
      "div",
      { className: "column left-column" },
      renderLeftPanel()
    ),
    // Right Column (27%)
    React.createElement(
      "div",
      { className: "column right-column" + (rightPanel ? "" : " empty") },
      rightPanel
    )
  );
};
