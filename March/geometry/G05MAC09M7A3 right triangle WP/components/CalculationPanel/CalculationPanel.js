const CalculationPanel = ({
  step,
  onEnableNext,
  onUpdateNavText,
  onUpdateQuestionText,
  imageSrc,
  onUpdateImage,
}) => {
  const { useState, useEffect } = React;
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrectFlash, setInputCorrectFlash] = useState(false);

  // Step 3 state
  const [step3Revealed, setStep3Revealed] = useState(false);

  // Step 4 state
  const [step4McqAnswered, setStep4McqAnswered] = useState(false);
  const [step4SelectedOption, setStep4SelectedOption] = useState(null);
  const [step4ReplaceText, setStep4ReplaceText] = useState("");
  const [step4IsWrong, setStep4IsWrong] = useState(false);

  // Step 5 state
  const [step5Answered, setStep5Answered] = useState(false);

  // Step 7 (mcqStep2) state
  const [step7McqAnswered, setStep7McqAnswered] = useState(false);
  const [step7SelectedOption, setStep7SelectedOption] = useState(null);
  const [step7ReplaceText, setStep7ReplaceText] = useState("");
  const [step7IsWrong, setStep7IsWrong] = useState(false);
  const [step7Substep, setStep7Substep] = useState(0);
  // substep 0: MCQ
  // substep 1: interactive row (full row clickable)
  // substep 2: expanded rows (2nd row clickable)
  // substep 3: t = [24 cm² ÷ 5 cm] tap to substitute 4.8 cm
  // substep 4: answered
  const [step7SubstituteDone, setStep7SubstituteDone] = useState(false);

  const stepData = APP_DATA.steps[step] || {};

  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrectFlash(false);
    setStep3Revealed(false);
    setStep4McqAnswered(false);
    setStep4SelectedOption(null);
    setStep4ReplaceText("");
    setStep4IsWrong(false);
    setStep5Answered(false);
    setStep7McqAnswered(false);
    setStep7SelectedOption(null);
    setStep7ReplaceText("");
    setStep7IsWrong(false);
    setStep7Substep(0);
    setStep7SubstituteDone(false);
  }, [step]);

  const resetWrong = () => setTimeout(() => { setInputError(false); setNumpadValue(""); }, 300);

  // =================== STEP 3: Calc with interactive box ===================
  useEffect(() => {
    if (step === 3) {
      const d = APP_DATA.step3Calc;
      onUpdateQuestionText(d.questionText);
      if (step3Revealed) {
        onUpdateNavText(d.navTapSubstitute);
        onEnableNext();
      } else {
        onUpdateNavText(d.navTapHighlight);
      }
    }
  }, [step, step3Revealed]);

  const renderStep3 = () => {
    const d = APP_DATA.step3Calc;
    const interactiveElement = step3Revealed
      ? React.createElement("span", { dangerouslySetInnerHTML: { __html: d.replaceValue } })
      : React.createElement("span", {
          className: "calc-interactive-box clickable",
          onClick: () => {
            if (window.playSound) window.playSound("tick");
            setStep3Revealed(true);
          }
        }, d.interactiveLabel);

    const calcRow = React.createElement("div", { className: "calc-row" },
      d.initialRow, interactiveElement
    );

    // Findings div
    const findingsDiv = React.createElement("div", { className: "calc-findings-div" },
      React.createElement("div", { className: "findings-title" }, d.findingsTitle),
      React.createElement("ul", { className: "findings-list" },
        d.findingsItems.map((item, i) => React.createElement("li", { key: i }, item))
      ),
      React.createElement("div", { className: "findings-title", style: { marginTop: "0.5vw" } }, d.toFindTitle),
      React.createElement("ul", { className: "findings-list" },
        d.toFindItems.map((item, i) => React.createElement("li", { key: `tf-${i}` }, item))
      )
    );

    return React.createElement("div", { className: "calc-panel-container" },
      React.createElement("div", { className: "calc-left-panel with-image" },
        imageSrc && React.createElement("div", { className: "calc-image-row" },
          React.createElement("img", { src: imageSrc, alt: "Diagram", className: "calc-image" })
        ),
        React.createElement("div", { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, calcRow)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" },
        findingsDiv
      )
    );
  };

  // =================== STEP 4: MCQ step ===================
  useEffect(() => {
    if (step === 4) {
      const d = APP_DATA.step4Mcq;
      onUpdateQuestionText(d.questionText);
      if (step4McqAnswered) {
        onUpdateNavText(d.navTapSubstitute);
      } else {
        onUpdateNavText(d.navTapOption);
      }
    }
  }, [step, step4McqAnswered]);

  const handleStep4McqClick = (option, index) => {
    if (step4McqAnswered) return;
    const d = APP_DATA.step4Mcq;
    setStep4SelectedOption(index);

    if (index === d.answerIndex) {
      if (window.playSound) window.playSound("correct");
      setStep4IsWrong(false);
      setStep4ReplaceText(d.answerText);
      const step4Cfg = APP_DATA.steps[4] || {};
      const imgAfterCorrect =
        step4Cfg.imageCorrect || d.correctImage;
      if (onUpdateImage && imgAfterCorrect) onUpdateImage(imgAfterCorrect);
      setTimeout(() => {
        setStep4McqAnswered(true);
        onEnableNext();
        onUpdateNavText(d.navTapSubstitute);
      }, 300);
    } else {
      if (window.playSound) window.playSound("wrong");
      setStep4IsWrong(true);
      setStep4ReplaceText(option);
      if (onUpdateImage) onUpdateImage(d.wrongImage);
    }
  };

  const renderStep4 = () => {
    const d = APP_DATA.step4Mcq;

    // Replace box content
    let replaceBoxContent;
    if (step4ReplaceText) {
      if (step4IsWrong) {
        // Wrong answer - text in red inside box
        replaceBoxContent = React.createElement("span", {
          className: "calc-replace-box",
          style: { color: "#ff4444" }
        }, step4ReplaceText);
      } else {
        if (step4McqAnswered) {
          // Correct answer - just text, no box
          replaceBoxContent = React.createElement("span", { style: { color: "white" } }, step4ReplaceText);
        } else {
          // Correct answer waiting for 300ms
          replaceBoxContent = React.createElement("span", {
            className: "calc-replace-box",
            style: { color: "white" }
          }, step4ReplaceText);
        }
      }
    } else {
      // Default: empty replace box
      replaceBoxContent = React.createElement("span", { className: "calc-replace-box" }, d.replaceBoxLabel);
    }

    const calcRow = React.createElement("div", {
      className: "calc-row",
      dangerouslySetInnerHTML: null
    },
      d.calcRowPrefix, replaceBoxContent,
      React.createElement("span", { dangerouslySetInnerHTML: { __html: d.calcRowSuffix } })
    );

    // MCQ options
    const mcqPanel = !step4McqAnswered ? React.createElement("div", { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-options" },
        d.options.map((opt, index) =>
          React.createElement("button", {
            key: index,
            className: `calc-mcq-option ${step4SelectedOption === index ? (index === d.answerIndex ? "correct" : "incorrect") : ""}`,
            onClick: () => handleStep4McqClick(opt, index),
            disabled: step4McqAnswered
          }, opt)
        )
      )
    ) : null;

    return React.createElement("div", { className: "calc-panel-container" },
      React.createElement("div", { className: "calc-left-panel with-image" },
        imageSrc && React.createElement("div", { className: "calc-image-row" },
          React.createElement("img", { src: imageSrc, alt: "Diagram", className: "calc-image" })
        ),
        React.createElement("div", { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, calcRow)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" },
        React.createElement("div", { className: "calc-input-div" }, mcqPanel)
      )
    );
  };

  // =================== STEP 5: Numpad step ===================
  useEffect(() => {
    if (step === 5) {
      const d = APP_DATA.step5Numpad;
      onUpdateQuestionText(d.questionText);
      if (step5Answered) {
        onUpdateNavText(d.navTapContinue);
      } else {
        onUpdateNavText(d.navUseNumpad);
      }
    }
  }, [step, step5Answered]);

  const handleStep5Submit = () => {
    const d = APP_DATA.step5Numpad;
    if (numpadValue === d.answer) {
      if (window.playSound) window.playSound("correct");
      setInputCorrectFlash(true);
      setTimeout(() => {
        setStep5Answered(true);
        setInputCorrectFlash(false);
        onEnableNext();
        onUpdateNavText(d.navTapContinue);
      }, 300);
    } else {
      if (window.playSound) window.playSound("wrong");
      setInputError(true);
      resetWrong();
    }
  };

  const renderStep5 = () => {
    const d = APP_DATA.step5Numpad;

    const inputBox = step5Answered
      ? d.answer
      : React.createElement("span", {
          className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrectFlash ? "correct" : ""} highlighted`
        }, numpadValue || "");

    const rows = [
      React.createElement("div", { key: "r1", className: "calc-row" }, d.row1),
      React.createElement("div", { key: "r2", className: "calc-row" }, d.row2Prefix, inputBox, d.row2Suffix),
    ];

    const findingsDiv = React.createElement("div", { className: "calc-findings-div" },
      React.createElement("div", { className: "findings-title" }, APP_DATA.step3Calc.findingsTitle),
      React.createElement("ul", { className: "findings-list" },
        APP_DATA.step3Calc.findingsItems.map((item, i) => React.createElement("li", { key: i }, item))
      ),
      React.createElement("div", { className: "findings-title", style: { marginTop: "0.5vw" } }, APP_DATA.step3Calc.toFindTitle),
      React.createElement("ul", { className: "findings-list" },
        APP_DATA.step3Calc.toFindItems.map((item, i) => React.createElement("li", { key: `tf-${i}` }, item))
      )
    );

    const numpad = !step5Answered ? React.createElement(Numpad, {
      onNumberClick: (n) => { if (numpadValue.length < d.numpadMaxLength) setNumpadValue(prev => prev + n); },
      onClear: () => setNumpadValue(prev => prev.slice(0, -1)),
      onSubmit: handleStep5Submit,
    }) : null;

    return React.createElement("div", { className: "calc-panel-container" },
      React.createElement("div", { className: "calc-left-panel with-image" },
        imageSrc && React.createElement("div", { className: "calc-image-row" },
          React.createElement("img", { src: imageSrc, alt: "Diagram", className: "calc-image" })
        ),
        React.createElement("div", { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, rows)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" },
        findingsDiv,
        React.createElement("div", { className: "calc-input-div" }, numpad)
      )
    );
  };

  // =================== STEP 6: Transition step ===================
  useEffect(() => {
    if (step === 6) {
      const d = APP_DATA.step6Transition;
      onUpdateQuestionText(d.questionText);
      onUpdateNavText(d.navText);
      onEnableNext();
    }
  }, [step]);

  const renderStep6 = () => {
    const d = APP_DATA.step6Transition;
    const calcRow = React.createElement("div", { className: "calc-row" }, d.calcRow);

    const findingsDiv = React.createElement("div", { className: "calc-findings-div" },
      React.createElement("div", { className: "findings-title" }, d.findingsTitle),
      React.createElement("ul", { className: "findings-list" },
        d.findingsItems.map((item, i) => React.createElement("li", { key: i }, item))
      )
    );

    return React.createElement("div", { className: "calc-panel-container" },
      React.createElement("div", { className: "calc-left-panel with-image" },
        imageSrc && React.createElement("div", { className: "calc-image-row" },
          React.createElement("img", { src: imageSrc, alt: "Diagram", className: "calc-image" })
        ),
        React.createElement("div", { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, calcRow)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" },
        findingsDiv
      )
    );
  };

  // =================== STEP 7: MCQ + interactive rows + tap substitute ===================
  useEffect(() => {
    if (step === 7) {
      const d = APP_DATA.step6Mcq;
      if (step7Substep === 0) {
        onUpdateQuestionText(d.questionText);
        onUpdateNavText(d.navTapOption);
      }
    }
  }, [step]);

  const handleStep7McqClick = (option, index) => {
    if (step7McqAnswered) return;
    const d = APP_DATA.step6Mcq;
    setStep7SelectedOption(index);

    if (index === d.answerIndex) {
      if (window.playSound) window.playSound("correct");
      setStep7IsWrong(false);
      setStep7ReplaceText(d.answerText);
      const step7Cfg = APP_DATA.steps[7] || {};
      if (onUpdateImage && step7Cfg.imageCorrect) {
        onUpdateImage(step7Cfg.imageCorrect);
      }
      setTimeout(() => {
        setStep7McqAnswered(true);
        setStep7Substep(1);
        onUpdateQuestionText(d.afterCorrectQuestion);
        onUpdateNavText(d.afterCorrectNav);
      }, 300);
    } else {
      if (window.playSound) window.playSound("wrong");
      setStep7IsWrong(true);
      setStep7ReplaceText(option);
    }
  };

  const handleStep7InteractiveRowClick = () => {
    if (window.playSound) window.playSound("tick");
    setStep7Substep(2);
    const d = APP_DATA.step6Mcq;
    onUpdateQuestionText(d.afterExpand2Question);
    onUpdateNavText(d.afterExpand2Nav);
  };

  const handleStep7ExpandedRow2Click = () => {
    if (window.playSound) window.playSound("tick");
    setStep7Substep(3);
    const d = APP_DATA.step6Mcq;
    onUpdateQuestionText(d.afterExpand2Question);
    onUpdateNavText(d.navTapSubstituteAnswer || d.afterExpand2Nav);
  };

  const handleStep7FinalBoxClick = () => {
    if (step7SubstituteDone) return;
    const d = APP_DATA.step6Mcq;
    if (window.playSound) window.playSound("tick");
    setStep7SubstituteDone(true);
    setStep7Substep(4);
    onEnableNext();
    onUpdateNavText(d.navCorrect);
  };

  const renderStep7 = () => {
    const d = APP_DATA.step6Mcq;
    const transition = APP_DATA.step6Transition;

    // Findings div (always shown in step 7)
    const findingsDiv = React.createElement("div", { className: "calc-findings-div" },
      React.createElement("div", { className: "findings-title" }, transition.findingsTitle),
      React.createElement("ul", { className: "findings-list" },
        transition.findingsItems.map((item, i) => React.createElement("li", { key: i }, item))
      )
    );

    // Replace box for MCQ
    let replaceBoxContent;
    if (step7ReplaceText) {
      if (step7IsWrong) {
        replaceBoxContent = React.createElement("span", {
          className: "calc-replace-box",
          style: { color: "#ff4444" }
        }, step7ReplaceText);
      } else {
        if (step7McqAnswered) {
          replaceBoxContent = React.createElement("span", { style: { color: "white" } }, step7ReplaceText);
        } else {
          replaceBoxContent = React.createElement("span", {
            className: "calc-replace-box",
            style: { color: "white" }
          }, step7ReplaceText);
        }
      }
    } else {
      replaceBoxContent = React.createElement("span", { className: "calc-replace-box" }, d.replaceBoxLabel);
    }

    // Build calc rows based on substep
    let calcRows;
    if (step7Substep === 0) {
      // MCQ substep - show one row with replace box
      calcRows = [
        React.createElement("div", { key: "r1", className: "calc-row" },
          d.calcRowPrefix, replaceBoxContent
        )
      ];
    } else if (step7Substep === 1) {
      // Interactive row - entire row clickable
      calcRows = [
        React.createElement("div", { key: "r1", className: "calc-row" },
          React.createElement("span", {
            className: "calc-interactive-box clickable",
            onClick: handleStep7InteractiveRowClick,
          }, d.interactiveRow)
        )
      ];
    } else if (step7Substep === 2) {
      // Two expanded rows, 2nd is clickable
      calcRows = [
        React.createElement("div", { key: "r1", className: "calc-row" }, d.expandedRow1),
        React.createElement("div", { key: "r2", className: "calc-row" },
          React.createElement("span", {
            className: "calc-interactive-box clickable",
            onClick: handleStep7ExpandedRow2Click,
          }, d.expandedRow2)
        )
      ];
    } else if (step7Substep === 3) {
      const boxContent = step7SubstituteDone
        ? React.createElement(
            "span",
            { className: "calc-interactive-box revealed" },
            d.finalSubstituteValue
          )
        : React.createElement(
            "span",
            {
              className: "calc-interactive-box clickable",
              onClick: handleStep7FinalBoxClick,
            },
            d.finalRow3Placeholder
          );

      calcRows = [
        React.createElement("div", { key: "r1", className: "calc-row" }, d.finalRow1),
        React.createElement("div", { key: "r2", className: "calc-row" }, d.finalRow2),
        React.createElement(
          "div",
          { key: "r3", className: "calc-row" },
          React.createElement("span", {
            dangerouslySetInnerHTML: { __html: d.finalRow3Prefix },
          }),
          boxContent,
          d.finalRow3Suffix || null
        ),
      ];
    } else {
      // Answered (substitute done)
      calcRows = [
        React.createElement("div", { key: "r1", className: "calc-row" }, d.finalRow1),
        React.createElement("div", { key: "r2", className: "calc-row" }, d.finalRow2),
        React.createElement(
          "div",
          { key: "r3", className: "calc-row" },
          React.createElement("span", {
            dangerouslySetInnerHTML: { __html: d.finalRow3Prefix },
          }),
          d.finalSubstituteValue,
          d.finalRow3Suffix || null
        ),
      ];
    }

    // MCQ panel for substep 0
    const mcqPanel = step7Substep === 0 && !step7McqAnswered
      ? React.createElement("div", { className: "calc-mcq" },
          React.createElement("div", { className: "calc-mcq-options" },
            d.options.map((opt, index) =>
              React.createElement("button", {
                key: index,
                className: `calc-mcq-option ${step7SelectedOption === index ? (index === d.answerIndex ? "correct" : "incorrect") : ""}`,
                onClick: () => handleStep7McqClick(opt, index),
                disabled: step7McqAnswered
              }, opt)
            )
          )
        )
      : null;

    return React.createElement("div", { className: "calc-panel-container" },
      React.createElement("div", { className: "calc-left-panel with-image" },
        imageSrc && React.createElement("div", { className: "calc-image-row" },
          React.createElement("img", { src: imageSrc, alt: "Diagram", className: "calc-image" })
        ),
        React.createElement("div", { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, calcRows)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" },
        findingsDiv,
        React.createElement("div", { className: "calc-input-div" }, mcqPanel)
      )
    );
  };

  // =================== STEP 8: Final step ===================
  useEffect(() => {
    if (step === 8) {
      onUpdateQuestionText(APP_DATA.steps[8].questionText);
      onUpdateNavText(APP_DATA.steps[8].navText);
    }
  }, [step]);

  const renderStep8 = () => {
    const transition = APP_DATA.step6Transition;
    const findingsDiv = React.createElement("div", { className: "calc-findings-div" },
      React.createElement("div", { className: "findings-title" }, transition.findingsTitle),
      React.createElement("ul", { className: "findings-list" },
        transition.findingsItems.map((item, i) => React.createElement("li", { key: i }, item))
      )
    );

    return React.createElement("div", { className: "calc-panel-container" },
      React.createElement("div", { className: "calc-left-panel with-image" },
        imageSrc && React.createElement("div", { className: "calc-image-row" },
          React.createElement("img", { src: imageSrc, alt: "Diagram", className: "calc-image" })
        ),
        React.createElement("div", { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }),
          React.createElement("div", { className: "final-answer-div" }, APP_DATA.step7Final.finalAnswerText)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" },
        findingsDiv
      )
    );
  };

  // Render based on step
  if (step === 3) return renderStep3();
  if (step === 4) return renderStep4();
  if (step === 5) return renderStep5();
  if (step === 6) return renderStep6();
  if (step === 7) return renderStep7();
  if (step === 8) return renderStep8();

  return null;
};
