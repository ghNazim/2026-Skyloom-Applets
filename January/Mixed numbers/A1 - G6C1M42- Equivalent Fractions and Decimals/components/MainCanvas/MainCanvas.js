const MainCanvas = ({
  step,
  questionIndex = 0,
  isLastQuestion = false,
  onEnableNext,
  onAdvanceStep,
  onUpdateTexts,
  isAnswered,
  setIsAnswered,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const gsap = window.gsap;

  // Step 2 MCQ states
  const [step2Selected, setStep2Selected] = useState(null);
  const [step2Correct, setStep2Correct] = useState(false);

  // Step 3 MCQ states
  const [step3Selected, setStep3Selected] = useState(null);
  const [step3Correct, setStep3Correct] = useState(false);

  // Step 4: numpad input
  const [numpadInput, setNumpadInput] = useState("");
  const [inputCorrect, setInputCorrect] = useState(false);
  const [inputWrong, setInputWrong] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const [numpadDisabled, setNumpadDisabled] = useState(false);
  const [numpadFeedback, setNumpadFeedback] = useState(null);
  const [numpadFeedbackType, setNumpadFeedbackType] = useState(null);

  // Step 5: animation states
  const [resultAnimDone, setResultAnimDone] = useState(false);
  const [vanishAnimDone, setVanishAnimDone] = useState(false);

  // Step 6: MCQ
  const [step6Selected, setStep6Selected] = useState(null);
  const [step6Correct, setStep6Correct] = useState(false);
  const [step6WrongShake, setStep6WrongShake] = useState(false);
  const [decimalBoxWrong, setDecimalBoxWrong] = useState(false);
  const [decimalBoxCorrect, setDecimalBoxCorrect] = useState(false);
  const [wrongDenominator, setWrongDenominator] = useState(false);
  const [wrongNumerator, setWrongNumerator] = useState(false);
  const [decimalFilled, setDecimalFilled] = useState(false);

  // Refs for step 5 animation
  const inputFractionContainerRef = useRef(null);
  const equalSign2Ref = useRef(null);
  const equalSignAfterRef = useRef(null); // Ref for the equals sign AFTER input
  const resultFractionRef = useRef(null);
  const resultNumRef = useRef(null);
  const resultDenRef = useRef(null);
  const inputNumRowRef = useRef(null); // Ref for the whole numerator row
  const inputDenRowRef = useRef(null); // Ref for the whole denominator row

  // Get stepData (needed for hooks below)
  const stepData = getStepData(step, questionIndex);
  const q = APP_DATA.questions ? APP_DATA.questions[questionIndex] : null;

  // Reset states when step or question changes
  useEffect(() => {
    setStep2Selected(null);
    setStep2Correct(false);
    setStep3Selected(null);
    setStep3Correct(false);
    setNumpadInput("");
    setInputCorrect(false);
    setInputWrong(false);
    setInputShake(false);
    setNumpadDisabled(false);
    setNumpadFeedback(null);
    setNumpadFeedbackType(null);
    setResultAnimDone(false);
    setVanishAnimDone(false);
    setStep6Selected(null);
    setStep6Correct(false);
    setStep6WrongShake(false);
    setDecimalBoxWrong(false);
    setDecimalBoxCorrect(false);
    setWrongDenominator(false);
    setWrongNumerator(false);
    setDecimalFilled(false);

    const sd = getStepData(step, questionIndex);
    if (sd) {
      onUpdateTexts(sd.questionText, "", sd.navText);
    }
  }, [step, questionIndex]);

  // STEP 1: Just show fraction, next enabled
  useEffect(() => {
    if (step === 1) {
      // Small timeout to ensure parent App effect (which disables next) runs first causes this to re-enable
      const timer = setTimeout(() => {
        onEnableNext();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [step, questionIndex, onEnableNext]);

  // STEP 5: Animation sequence - Phase 1 (Clones)
  useEffect(() => {
    if (step !== 5) return;

    const timer1 = setTimeout(() => {
      // Use the ROWS now instead of just inputs
      const numInputRow = inputNumRowRef.current;
      const denInputRow = inputDenRowRef.current;
      const resultNum = resultNumRef.current;
      const resultDen = resultDenRef.current;

      if (numInputRow && denInputRow && resultNum && resultDen) {
        const numClone = numInputRow.cloneNode(true);
        const denClone = denInputRow.cloneNode(true);

        [numClone, denClone].forEach((clone) => {
          clone.style.position = "fixed";
          clone.style.zIndex = "1000";
          clone.style.transition = "none";
          clone.style.pointerEvents = "none";
          // Fix flex alignment in clone
          clone.style.display = "flex";
          clone.style.alignItems = "center";
          clone.style.justifyContent = "center";
          clone.style.gap = "0.5vw";
          document.body.appendChild(clone);
        });

        const numRect = numInputRow.getBoundingClientRect();
        const denRect = denInputRow.getBoundingClientRect();
        const resultNumRect = resultNum.getBoundingClientRect();
        const resultDenRect = resultDen.getBoundingClientRect();

        // Calculate scale to fit clone into result
        // Result is usually smaller single digit, row is wide equation
        // We want to shrink it into the result number
        const scaleX = resultNumRect.width / numRect.width; 
        const scaleY = resultNumRect.height / numRect.height;
        // Use a reasonable scale, maybe not full squash
        const targetScale = 0.5;

        numClone.style.left = numRect.left + "px";
        numClone.style.top = numRect.top + "px";
        numClone.style.width = numRect.width + "px";
        numClone.style.height = numRect.height + "px";
        // Copy typography from one of the children or use current
        // numClone.style.fontSize = window.getComputedStyle(numInputRow).fontSize;

        denClone.style.left = denRect.left + "px";
        denClone.style.top = denRect.top + "px";
        denClone.style.width = denRect.width + "px";
        denClone.style.height = denRect.height + "px";

        const tl = gsap.timeline({
          onComplete: () => {
            if (document.body.contains(numClone))
              document.body.removeChild(numClone);
            if (document.body.contains(denClone))
              document.body.removeChild(denClone);
            setResultAnimDone(true);
          },
        });

        tl.to(
          numClone,
          {
            left: resultNumRect.left + resultNumRect.width / 2 - numRect.width / 2, // Center it
            top: resultNumRect.top + resultNumRect.height / 2 - numRect.height / 2,
            scale: targetScale,
            opacity: 0, // Fade out as it merges
            duration: 0.8,
            ease: "power2.inOut",
          },
          0
        );
        tl.to(
          denClone,
          {
            left: resultDenRect.left + resultDenRect.width / 2 - denRect.width / 2,
            top: resultDenRect.top + resultDenRect.height / 2 - denRect.height / 2,
            scale: targetScale,
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          0
        );
      } else {
        setResultAnimDone(true);
      }
    }, 600);

    return () => clearTimeout(timer1);
  }, [step, questionIndex]);

  // STEP 5: Phase 2 - vanish input container and AFTER equal sign
  useEffect(() => {
    if (step !== 5 || !resultAnimDone) return;

    const timer2 = setTimeout(() => {
      const inputContainer = inputFractionContainerRef.current;
      const equalSignAfter = equalSignAfterRef.current;

      if (inputContainer && equalSignAfter) {
        const tl = gsap.timeline({
          onComplete: () => {
             // Clear props to avoid interference if reused (though we unmount them)
             gsap.set([inputContainer, equalSignAfter], { clearProps: "all" });
             setVanishAnimDone(true);
             setTimeout(() => {
               onAdvanceStep();
             }, 1000);
          },
        });

        tl.to([inputContainer, equalSignAfter], {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "back.in(1.7)",
        });
      } else {
        setVanishAnimDone(true);
        setTimeout(() => {
          onAdvanceStep();
        }, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer2);
  }, [step, questionIndex, resultAnimDone]);

  // Early return after all hooks
  if (!stepData || !q) return null;

  // =============================================
  // STEP 2: MCQ - Which denominator?
  // =============================================
  const handleStep2Option = (option) => {
    if (step2Correct) return;
    setStep2Selected(option);

    if (option === stepData.mcqAnswer) {
      setStep2Correct(true);
      playSound("correct");
      onEnableNext();
      onUpdateTexts(null, null, stepData.navAfterCorrect);
    } else {
      playSound("wrong");
    }
  };

  // =============================================
  // STEP 3: MCQ - Multiply or Divide?
  // =============================================
  const handleStep3Option = (option) => {
    if (step3Correct) return;
    setStep3Selected(option);

    if (option === stepData.mcqAnswer) {
      setStep3Correct(true);
      playSound("correct");
      onEnableNext();
      onUpdateTexts(null, null, stepData.navAfterCorrect);
    } else {
      playSound("wrong");
    }
  };

  // =============================================
  // STEP 4: Numpad callbacks
  // =============================================
  const handleNumpadNumber = (num) => {
    if (inputCorrect || numpadDisabled) return;
    setNumpadInput((prev) => prev + num);
  };

  const handleNumpadClear = () => {
    if (inputCorrect || numpadDisabled) return;
    setNumpadInput((prev) => prev.slice(0, -1));
  };

  const handleNumpadSubmit = () => {
    if (inputCorrect || numpadDisabled) return;
    const correctVal = String(stepData.multiplier);

    if (numpadInput === correctVal) {
      playSound("correct");
      setInputCorrect(true);
      setNumpadDisabled(true);
      setNumpadFeedback(stepData.correctFeedback);
      setNumpadFeedbackType("correct");
      // Auto advance after 3 seconds
      setTimeout(() => {
        onAdvanceStep();
      }, 3000);
    } else {
      playSound("wrong");
      setInputWrong(true);
      setInputShake(true);
      setNumpadFeedback(stepData.wrongFeedback);
      setNumpadFeedbackType("incorrect");
      setTimeout(() => {
        setInputShake(false);
        setInputWrong(false);
        setNumpadInput("");
      }, 500);
    }
  };

  // =============================================
  // STEP 6: MCQ - Decimal form
  // =============================================
  const handleStep6Option = (option) => {
    if (step6Correct) return;

    setWrongDenominator(false);
    setWrongNumerator(false);
    setDecimalBoxWrong(false);

    setStep6Selected(option);
    const index = stepData.mcqOptions.indexOf(option);

    if (index === stepData.mcqAnswerIndex) {
      setStep6Correct(true);
      setDecimalBoxCorrect(true);
      setDecimalFilled(true);
      playSound("correct");
      onEnableNext();
      onUpdateTexts(
        stepData.questionAfterCorrect,
        null,
        stepData.navAfterCorrect
      );
    } else {
      playSound("wrong");
      setDecimalBoxWrong(true);
      setStep6WrongShake(true);

      if (stepData.wrongHighlights && stepData.wrongHighlights[index]) {
        if (stepData.wrongHighlights[index] === "denominator") {
          setWrongDenominator(true);
        } else if (stepData.wrongHighlights[index] === "numerator") {
          setWrongNumerator(true);
        }
      }

      setTimeout(() => {
        setStep6WrongShake(false);
      }, 500);
    }
  };

  // =============================================
  // HELPER: Render fraction box
  // =============================================
  const renderFractionBox = (num, den, extraClass, numClass, denClass) => {
    return React.createElement(
      "div",
      { className: "fraction-box " + (extraClass || "") },
      React.createElement(
        "div",
        { className: "fraction-num " + (numClass || "") },
        num
      ),
      React.createElement("div", { className: "fraction-line" }),
      React.createElement(
        "div",
        { className: "fraction-den " + (denClass || "") },
        den
      )
    );
  };

  // =============================================
  // LEFT PANEL RENDERING
  // =============================================
  const renderLeftPanel = () => {
    // ===== STEP 1: Show fraction only =====
    if (step === 1) {
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row flex-start" },
          renderFractionBox(q.numerator, q.denominator, "fraction-box-orange")
        )
      );
    }

    // ===== STEP 2: Show fraction (left same as step 1) =====
    if (step === 2) {
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row flex-start" },
          renderFractionBox(q.numerator, q.denominator, "fraction-box-orange")
        )
      );
    }

    // ===== STEP 3: Same left =====
    if (step === 3) {
      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row flex-start" },
          renderFractionBox(q.numerator, q.denominator, "fraction-box-orange")
        )
      );
    }

    // ===== STEP 4: fraction = input fraction container =====
    if (step === 4) {
      const opSymbol = q.operationSymbol;

      return React.createElement(
        "div",
        { className: "left-panel-content" },
        React.createElement(
          "div",
          { className: "main-row flex-start" },
          renderFractionBox(q.numerator, q.denominator, "fraction-box-orange"),
          React.createElement(
            "span",
            { className: "equals-sign" },
            stepData.equalsSign
          ),
          React.createElement(
            "div",
            { className: "input-fraction-container" },
            React.createElement(
              "div",
              { className: "input-fraction-row" },
              React.createElement(
                "span",
                { className: "multiply-operand" },
                q.numerator
              ),
              React.createElement(
                "span",
                { className: "multiply-sign" },
                opSymbol
              ),
              React.createElement(
                "div",
                {
                  className:
                    "input-box" +
                    (!inputCorrect && !inputWrong ? " highlighted" : "") +
                    (inputCorrect ? " correct" : "") +
                    (inputWrong ? " wrong" : "") +
                    (inputShake ? " input-shake" : ""),
                },
                numpadInput || "\u00A0"
              )
            ),
            React.createElement("div", { className: "input-fraction-line" }),
            React.createElement(
              "div",
              { className: "input-fraction-row" },
              React.createElement(
                "span",
                { className: "multiply-operand" },
                q.denominator
              ),
              React.createElement(
                "span",
                { className: "multiply-sign" },
                opSymbol
              ),
              React.createElement(
                "div",
                {
                  className:
                    "input-box" +
                    (!inputCorrect && !inputWrong ? " highlighted" : "") +
                    (inputCorrect ? " correct" : "") +
                    (inputWrong ? " wrong" : "") +
                    (inputShake ? " input-shake" : ""),
                },
                numpadInput || "\u00A0"
              )
            )
          )
        )
      );
    }

    // ===== STEP 5: fraction = input-frac = result-frac, then vanish =====
    if (step === 5) {
      const opSymbol = q.operationSymbol;

      if (vanishAnimDone) {
        // After vanish: [num/den] = [result]
        return React.createElement(
          "div",
          { className: "left-panel-content", key: "step5-final" },
          React.createElement(
            "div",
            { className: "main-row flex-start" },
            renderFractionBox(
              q.numerator,
              q.denominator,
              "fraction-box-orange"
            ),
            React.createElement(
              "span",
              { className: "equals-sign" },
              stepData.equalsSign
            ),
            // Ensure this result box has a unique key or same key as before to prevent issues
            React.createElement(
               "div",
              { className: "fraction-box fraction-box-correct", key: "result-box" },
               React.createElement("div", { className: "fraction-num" }, q.convertedNumerator),
               React.createElement("div", { className: "fraction-line" }),
               React.createElement("div", { className: "fraction-den" }, q.convertedDenominator)
            )
          )
        );
      }

      // Before vanish: full equation with input calc and result
      return React.createElement(
        "div",
        { className: "left-panel-content", key: "step5-initial" },
        React.createElement(
          "div",
          { className: "main-row flex-start" },
          renderFractionBox(q.numerator, q.denominator, "fraction-box-orange"),
          React.createElement(
            "span",
            { className: "equals-sign", ref: equalSign2Ref },
            stepData.equalsSign
          ),
          React.createElement(
            "div",
            {
              className: "input-fraction-container step5-calc",
              ref: inputFractionContainerRef,
            },
            React.createElement(
              "div",
              { className: "input-fraction-row", ref: inputNumRowRef },
              React.createElement(
                "span",
                { className: "multiply-operand" },
                q.numerator
              ),
              React.createElement(
                "span",
                { className: "multiply-sign" },
                opSymbol
              ),
              React.createElement(
                "div",
                { className: "input-box correct" },
                q.multiplier
              )
            ),
            React.createElement("div", { className: "input-fraction-line" }),
            React.createElement(
              "div",
              { className: "input-fraction-row", ref: inputDenRowRef },
              React.createElement(
                "span",
                { className: "multiply-operand" },
                q.denominator
              ),
              React.createElement(
                "span",
                { className: "multiply-sign" },
                opSymbol
              ),
              React.createElement(
                "div",
                { className: "input-box correct" },
                q.multiplier
              )
            )
          ),
          // THIS is the equals sign we want to vanish
          React.createElement(
            "span",
            { className: "equals-sign", ref: equalSignAfterRef },
            stepData.equalsSign
          ),
          React.createElement(
            "div",
            {
              className:
                "fraction-box " +
                (resultAnimDone
                  ? "fraction-box-correct"
                  : "fraction-box-orange"),
              ref: resultFractionRef,
              key: "result-box"
            },
            React.createElement(
              "div",
              { className: "fraction-num", ref: resultNumRef },
              resultAnimDone ? q.convertedNumerator : "\u00A0"
            ),
            React.createElement("div", { className: "fraction-line" }),
            React.createElement(
              "div",
              { className: "fraction-den", ref: resultDenRef },
              resultAnimDone ? q.convertedDenominator : "\u00A0"
            )
          )
        )
      );
    }

    // ===== STEP 6: fraction = result-frac = decimal-box =====
    if (step === 6) {
      return React.createElement(
        "div",
        { className: "left-panel-content", key: "step6" },
        React.createElement(
          "div",
          { className: "main-row flex-start" },
          renderFractionBox(q.numerator, q.denominator, "fraction-box-orange"),
          React.createElement(
            "span",
            { className: "equals-sign" },
            stepData.equalsSign
          ),
          renderFractionBox(
            q.convertedNumerator,
            q.convertedDenominator,
            "fraction-box-orange", /* Using orange to start, or keep request to have result fraction correct from before?
              User says "Remove the green bg from result fraction" in request Step 5.
              So returning "fraction-box-orange" here is correct.
             */
            wrongNumerator ? "text-red" : "",
            wrongDenominator ? "text-red" : ""
          ),
          React.createElement(
            "span",
            { className: "equals-sign" },
            stepData.equalsSign
          ),
          React.createElement(
            "div",
            {
              className:
                "result-decimal-box" +
                (decimalBoxCorrect ? " correct" : "") +
                (decimalBoxWrong ? " wrong" : "") +
                (step6WrongShake ? " shake-it" : ""),
            },
            decimalFilled
              ? React.createElement(
                  "span",
                  { className: "decimal-value" },
                  q.decimalValue
                )
              : React.createElement("span", {
                  className: "decimal-placeholder",
                })
          )
        )
      );
    }

    return null;
  };

  // =============================================
  // RIGHT PANEL RENDERING
  // =============================================
  const getRightPanel = () => {
    // Step 2: MCQ for target denominator
    if (step === 2 && stepData.mcqOptions) {
      const mcqData = {
        title: "",
        options: stepData.mcqOptions.map(String),
        feedbacks: {
          correct: stepData.mcqCorrectFeedback,
          wrong: stepData.mcqWrongFeedback,
        },
      };
      return React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: step2Selected !== null ? String(step2Selected) : null,
        isCorrect: step2Correct,
        onOptionClick: (option) => {
          handleStep2Option(Number(option));
        },
        showFeedback: true,
        shake: false,
      });
    }

    // Step 3: MCQ for multiply/divide
    if (step === 3 && stepData.mcqOptions) {
      const mcqData = {
        title: "",
        options: stepData.mcqOptions,
        feedbacks: {
          correct: stepData.mcqCorrectFeedback,
          wrong: stepData.mcqWrongFeedback,
        },
      };
      return React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: step3Selected,
        isCorrect: step3Correct,
        onOptionClick: (option) => {
          handleStep3Option(option);
        },
        showFeedback: true,
        shake: false,
        extraText: stepData.extraText,
      });
    }

    // Step 4: Numpad with feedback
    if (step === 4) {
      return React.createElement(
        "div",
        { className: "numpad-with-feedback" },
        React.createElement(
          "div",
          {
            className:
              "numpad-feedback-box" +
              (numpadFeedbackType ? " " + numpadFeedbackType : " hidden"),
          },
          numpadFeedback
        ),
        React.createElement(Numpad, {
          disabled: numpadDisabled,
          onNumberClick: handleNumpadNumber,
          onClear: handleNumpadClear,
          onSubmit: handleNumpadSubmit,
        })
      );
    }

    // Step 6: MCQ for decimal form
    if (step === 6 && stepData.mcqOptions) {
      const mcqData = {
        title: "",
        options: stepData.mcqOptions,
        feedbacks: stepData.mcqFeedbacks,
      };
      return React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: step6Selected,
        isCorrect: step6Correct,
        onOptionClick: (option) => {
          handleStep6Option(option);
        },
        showFeedback: true,
        shake: step6WrongShake,
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
