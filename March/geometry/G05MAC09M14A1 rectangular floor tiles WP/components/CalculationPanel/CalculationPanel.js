const CalculationPanel = ({
  step,
  onEnableNext,
  onUpdateNavText,
  onUpdateQuestionText,
  calcState,
  setCalcState,
  imageSrc,
}) => {
  const { useState, useEffect } = React;
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrectFlash, setInputCorrectFlash] = useState(false);
  const [step6SelectedOption, setStep6SelectedOption] = useState(null);
  const stepData = APP_DATA.steps[step] || {};
  const hideImage = stepData.hideImage === true;

  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrectFlash(false);
    setStep6SelectedOption(null);
  }, [step]);

  const resetWrong = () => setTimeout(() => { setInputError(false); setNumpadValue(""); }, 300);

  const submitSimpleAnswer = (keyAnswered, keyValue, answer, doneNav) => {
    if (numpadValue === answer) {
      if (window.playSound) window.playSound("correct");
      setInputCorrectFlash(true);
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, [keyAnswered]: true, [keyValue]: numpadValue }));
        setInputCorrectFlash(false);
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) onUpdateNavText(doneNav);
      }, 300);
    } else {
      if (window.playSound) window.playSound("wrong");
      setInputError(true);
      resetWrong();
    }
  };

  useEffect(() => {
    if (step === 4) {
      onUpdateQuestionText(APP_DATA.step4Calc.questionText);
      if (calcState.step4Answered) onUpdateNavText(APP_DATA.step4Calc.navTapContinue);
      else if (calcState.step4Revealed) onUpdateNavText(APP_DATA.step4Calc.navUseNumpad);
      else onUpdateNavText(APP_DATA.step4Calc.navTapVariable);
    }
    if (step === 5) {
      onUpdateQuestionText(APP_DATA.step5Calc.questionText);
      if (calcState.step5Answered) onUpdateNavText(APP_DATA.step5Calc.navTapContinue);
      else if (calcState.step5Revealed) onUpdateNavText(APP_DATA.step5Calc.navUseNumpad);
      else onUpdateNavText(APP_DATA.step5Calc.navTapVariable);
    }
    if (step === 6) {
      onUpdateQuestionText(APP_DATA.step6Calc.questionText);
      onUpdateNavText(calcState.step6McqAnswered ? APP_DATA.step6Calc.navTapContinue : APP_DATA.step6Calc.navTapOption);
    }
    if (step === 7) {
      if (calcState.step7Simplified) {
        onUpdateQuestionText(APP_DATA.step7Calc.questionTextAfterAnswer);
        onUpdateNavText(APP_DATA.step7Calc.navTapContinue);
      } else if (calcState.step7NumpadAnswered) {
        onUpdateQuestionText(APP_DATA.step7Calc.questionTextAfterAnswer);
        onUpdateNavText(APP_DATA.step7Calc.navTapSimplify);
      } else {
        onUpdateQuestionText(APP_DATA.step7Calc.questionText);
        onUpdateNavText(APP_DATA.step7Calc.navUseNumpad);
      }
    }
    if (step === 8) {
      onUpdateQuestionText(APP_DATA.step8Calc.questionText);
      onUpdateNavText(calcState.step8NumpadAnswered ? APP_DATA.step8Calc.navTapContinue : APP_DATA.step8Calc.navUseNumpad);
    }
  }, [step, calcState]);

  const renderStep4Row = () => {
    const d = APP_DATA.step4Calc;
    const areaFloorText = calcState.step4Answered
      ? d.answerWithUnit
      : calcState.step4Revealed
        ? React.createElement("span", { className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrectFlash ? "correct" : ""} highlighted ${!numpadValue ? "placeholder" : ""}` }, numpadValue || d.placeholder)
        : React.createElement("span", { className: "calc-interactive-box clickable", onClick: () => { if (window.playSound) window.playSound("tick"); setCalcState(prev => ({ ...prev, step4Revealed: true })); } }, d.interactiveLabel);
    return React.createElement("div", { className: "calc-row" }, d.rowPrefix, areaFloorText, d.rowSuffix);
  };

  const renderStep5Row = () => {
    const d = APP_DATA.step5Calc;
    const oneTileText = calcState.step5Answered
      ? d.answerWithUnit
      : calcState.step5Revealed
        ? React.createElement("span", { className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrectFlash ? "correct" : ""} highlighted ${!numpadValue ? "placeholder" : ""}` }, numpadValue || d.placeholder)
        : React.createElement("span", { className: "calc-interactive-box clickable", onClick: () => { if (window.playSound) window.playSound("tick"); setCalcState(prev => ({ ...prev, step5Revealed: true })); } }, d.interactiveLabel);
    return React.createElement("div", { className: "calc-row" }, d.rowPrefix, oneTileText);
  };

  const renderStep6Row = () => React.createElement("div", { className: "calc-row" }, APP_DATA.step6Calc.calcRow);

  const renderStep7Rows = () => {
    const d = APP_DATA.step7Calc;
    const conversionValue = calcState.step7NumpadAnswered ? (calcState.step7Value || d.numpadAnswer) : React.createElement("span", { className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrectFlash ? "correct" : ""}` }, numpadValue || "");
    const secondRow = calcState.step7Simplified ? d.rowAfterSimplify : [d.rowBeforeBoxPrefix, conversionValue, d.rowBeforeBoxSuffix];
    return [
      React.createElement("div", { key: "s7r1", className: "calc-row" }, d.existingRow),
      React.createElement("div", { key: "s7r2", className: "calc-row" }, secondRow),
    ];
  };

  const renderStep8Rows = () => {
    const d = APP_DATA.step8Calc;
    return [
      React.createElement("div", { key: "s8r1", className: "calc-row" }, d.prevRow1),
      React.createElement("div", { key: "s8r2", className: "calc-row" }, d.prevRow2),
      React.createElement("div", { key: "s8r3", className: "calc-row" }, d.answerRowPrefix, calcState.step8NumpadAnswered ? (calcState.step8Value || d.numpadAnswer) : React.createElement("span", { className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrectFlash ? "correct" : ""}` }, numpadValue || "")),
    ];
  };

  const renderRows = () => {
    if (step === 4) return [renderStep4Row()];
    if (step === 5) return [renderStep5Row()];
    if (step === 6) return [renderStep6Row()];
    if (step === 7) return renderStep7Rows();
    if (step === 8 || step === 9) return renderStep8Rows();
    return [];
  };

  const handleStep6McqClick = (index) => {
    if (calcState.step6McqAnswered) return;
    setStep6SelectedOption(index);
    if (index === APP_DATA.step6Calc.mcqAnswerIndex) {
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, step6McqAnswered: true }));
        onEnableNext();
        onUpdateNavText(APP_DATA.step6Calc.navTapContinue);
      }, 300);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  const renderInput = () => {
    if (step === 4 && calcState.step4Revealed && !calcState.step4Answered) {
      return React.createElement(Numpad, {
        onNumberClick: (n) => setNumpadValue(prev => prev + n),
        onClear: () => setNumpadValue(prev => prev.slice(0, -1)),
        onSubmit: () => submitSimpleAnswer("step4Answered", "step4Value", APP_DATA.step4Calc.answer, APP_DATA.step4Calc.navTapContinue),
      });
    }
    if (step === 5 && calcState.step5Revealed && !calcState.step5Answered) {
      return React.createElement(Numpad, {
        onNumberClick: (n) => setNumpadValue(prev => prev + n),
        onClear: () => setNumpadValue(prev => prev.slice(0, -1)),
        onSubmit: () => submitSimpleAnswer("step5Answered", "step5Value", APP_DATA.step5Calc.answer, APP_DATA.step5Calc.navTapContinue),
      });
    }
    if (step === 6) {
      return React.createElement("div", { className: "calc-mcq" },
        React.createElement("div", { className: "calc-mcq-title" }, APP_DATA.step6Calc.mcqQuestion),
        React.createElement("div", { className: "calc-mcq-options" },
          APP_DATA.step6Calc.mcqOptions.map((opt, index) =>
            React.createElement("button", {
              key: index,
              className: `calc-mcq-option ${step6SelectedOption === index ? (index === APP_DATA.step6Calc.mcqAnswerIndex ? "correct" : "incorrect") : ""}`,
              onClick: () => handleStep6McqClick(index),
              disabled: calcState.step6McqAnswered
            }, opt)
          )
        )
      );
    }
    if (step === 7) {
      if (!calcState.step7NumpadAnswered) {
        return React.createElement(Numpad, {
          onNumberClick: (n) => { if (numpadValue.length < APP_DATA.step7Calc.numpadMaxLength) setNumpadValue(prev => prev + n); },
          onClear: () => setNumpadValue(prev => prev.slice(0, -1)),
          onSubmit: () => {
            if (numpadValue === APP_DATA.step7Calc.numpadAnswer) {
              if (window.playSound) window.playSound("correct");
              setInputCorrectFlash(true);
              setTimeout(() => {
                setCalcState(prev => ({ ...prev, step7NumpadAnswered: true, step7Value: numpadValue }));
                setInputCorrectFlash(false);
                onUpdateNavText(APP_DATA.step7Calc.navTapSimplify);
                onUpdateQuestionText(APP_DATA.step7Calc.questionTextAfterAnswer);
              }, 300);
            } else {
              if (window.playSound) window.playSound("wrong");
              setInputError(true);
              resetWrong();
            }
          },
        });
      }
      if (!calcState.step7Simplified) {
        return React.createElement("button", { className: "calc-mcq-option", onClick: () => { if (window.playSound) window.playSound("click"); setCalcState(prev => ({ ...prev, step7Simplified: true })); onEnableNext(); onUpdateNavText(APP_DATA.step7Calc.navTapContinue); } }, APP_DATA.step7Calc.simplifyButtonLabel);
      }
    }
    if (step === 8 && !calcState.step8NumpadAnswered) {
      return React.createElement(Numpad, {
        onNumberClick: (n) => { if (numpadValue.length < APP_DATA.step8Calc.numpadMaxLength) setNumpadValue(prev => prev + n); },
        onClear: () => setNumpadValue(prev => prev.slice(0, -1)),
        onSubmit: () => submitSimpleAnswer("step8NumpadAnswered", "step8Value", APP_DATA.step8Calc.numpadAnswer, APP_DATA.step8Calc.navTapContinue),
      });
    }
    return null;
  };

  const showFindings = step >= 7;
  const findingsData = APP_DATA.step7Calc.findings;

  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    React.createElement(
      "div",
      { className: `calc-left-panel ${hideImage ? "no-image" : "with-image"}` },
      !hideImage && imageSrc && React.createElement("div", { className: "calc-image-row" }, React.createElement("img", { src: imageSrc, alt: (APP_DATA.altTexts && APP_DATA.altTexts.diagram) || "", className: "calc-image" })),
      React.createElement("div", { className: "calc-equation-row" }, React.createElement("div", { className: "calc-rows-container" }, renderRows())),
      step === 9 && React.createElement("div", { className: "final-answer-div" }, APP_DATA.step9Final.finalAnswerText),
    ),
    React.createElement(
      "div",
      { className: "calc-right-panel" },
      showFindings && React.createElement("div", { className: "calc-findings-div" },
        React.createElement("div", { className: "findings-title" }, findingsData.title),
        React.createElement("ul", { className: "findings-list" }, findingsData.items.map((item, i) => React.createElement("li", { key: i }, item)))
      ),
      React.createElement("div", { className: "calc-input-div" }, renderInput())
    )
  );
};
