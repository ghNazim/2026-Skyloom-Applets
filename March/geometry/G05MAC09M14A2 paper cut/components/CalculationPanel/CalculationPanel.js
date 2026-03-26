const CalculationPanel = ({
  step,
  onEnableNext,
  onUpdateNavText,
  interactiveBoxState1,
  setInteractiveBoxState1,
  interactiveBoxState2,
  setInteractiveBoxState2,
  calcState,
  setCalcState,
  imageSrc,
  onUpdateTexts,
  onUpdateImage,
}) => {
  const { useState, useEffect } = React;
  const stepData = APP_DATA.steps[step];
  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);

  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
  }, [step]);

  const getBoxStateForCalcKey = (calcKey) => {
    if (calcKey === "calculation1") return interactiveBoxState1;
    if (calcKey === "calculation2") return interactiveBoxState2;
    return interactiveBoxState1;
  };

  const getBoxState = () => (step === 5 ? interactiveBoxState1 : interactiveBoxState2);
  const setBoxState = (nextState) => {
    if (step === 5) setInteractiveBoxState1(nextState);
    if (step === 6) setInteractiveBoxState2(nextState);
  };

  useEffect(() => {
    if (!onUpdateImage) return;
    if (step === 5) {
      const s5 = APP_DATA.steps[5];
      const s = interactiveBoxState1;
      if (!s[0]) onUpdateImage(s5.image);
      else if (!s[1]) onUpdateImage(s5.imageSecondActive);
      else onUpdateImage(s5.imageBothDone);
      return;
    }
    if (step === 6) {
      const s6 = APP_DATA.steps[6];
      const s = interactiveBoxState2;
      if (!s[0]) onUpdateImage(s6.image);
      else if (!s[1]) onUpdateImage(s6.imageSecondActive);
      else onUpdateImage(s6.imageBothDone);
    }
  }, [step, interactiveBoxState1, interactiveBoxState2, onUpdateImage]);

  const handleBoxClick = (boxIndex) => {
    const state = getBoxState();
    const canClick = boxIndex === 0 ? !state[0] : state[0] && !state[1];
    if (!canClick) return;
    if (window.playSound) window.playSound("click");

    const nextState = { ...state, [boxIndex]: true };
    setBoxState(nextState);

    if (step === 6 && boxIndex === 0 && onUpdateTexts) {
      onUpdateTexts(APP_DATA.steps[6].questionTextSecondBox, null);
    }
    if (boxIndex === 0 && onUpdateNavText) {
      onUpdateNavText(stepData.navTextSecondBox);
    }

    if (nextState[0] && nextState[1]) {
      setTimeout(() => {
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) onUpdateNavText(stepData.navTextCorrect);
      }, 200);
    }
  };

  const renderInteractiveEquation = (opts) => {
    opts = opts || {};
    const calcKey = opts.calcKey || stepData.calcKey;
    const forceState = opts.forceState;
    const calcData = APP_DATA[calcKey];
    if (!calcData || !calcData.initialEquation) return null;

    const equation = calcData.initialEquation[0];
    const replacements = calcData.values.boxReplacements;
    const state = forceState != null ? forceState : getBoxStateForCalcKey(calcKey);
    let boxCounter = -1;

    return React.createElement(
      "div",
      { className: "calc-row calc-row-input-boxes" },
      equation.split(/(\[\[.*?\]\])/).map((part, idx) => {
        if (!(part.startsWith("[[") && part.endsWith("]]"))) {
          return React.createElement("span", { key: `txt-${idx}` }, part);
        }
        boxCounter += 1;
        const currentBoxIndex = boxCounter;
        const isClicked = state[currentBoxIndex];
        const isForced = forceState != null;
        const isHighlighted =
          !isForced &&
          !isClicked &&
          (currentBoxIndex === 0 ? !state[0] : state[0] && !state[1]);
        return React.createElement("span", {
          key: `box-${idx}`,
          className: `calc-interactive-box-step5 ${isClicked ? "clicked" : ""} ${isHighlighted ? "highlighted" : ""}`,
          onClick: isForced
            ? undefined
            : () => handleBoxClick(currentBoxIndex),
          dangerouslySetInnerHTML: {
            __html: isClicked
              ? replacements[currentBoxIndex]
              : part.replace(/\[\[|\]\]/g, ""),
          },
        });
      })
    );
  };

  const renderNumpadRow = () =>
    React.createElement(
      "div",
      { className: "calc-row" },
      APP_DATA.calculationFinal.equation,
      React.createElement(
        "span",
        {
          className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrect ? "correct" : ""}`,
        },
        numpadValue || ""
      ),
      APP_DATA.calculationFinal.numpad.unit
    );

  const renderNumpadAnsweredRow = () =>
    React.createElement(
      "div",
      { className: "calc-row" },
      APP_DATA.calculationFinal.equation,
      React.createElement(
        "span",
        { className: "calc-input-box correct" },
        calcState.finalNumpadValue
      ),
      APP_DATA.calculationFinal.numpad.unit
    );

  const handleNumberClick = (num) => {
    if (numpadValue.length < APP_DATA.calculationFinal.numpad.maxLength) {
      setNumpadValue((prev) => prev + num);
    }
  };

  const handleClear = () => {
    setNumpadValue((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (numpadValue === APP_DATA.calculationFinal.numpad.answer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setCalcState((prev) => ({
          ...prev,
          finalNumpadAnswered: true,
          finalNumpadValue: numpadValue,
        }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) onUpdateNavText(stepData.navTextCorrect);
      }, 250);
      return;
    }
    setInputError(true);
    if (window.playSound) window.playSound("wrong");
    setTimeout(() => {
      setInputError(false);
      setNumpadValue("");
    }, 300);
  };

  const renderRightPanel = () =>
    React.createElement(
      "div",
      { className: "calc-input-panel" },
      React.createElement("div", { className: "calc-findings-div" }, ""),
      React.createElement(
        "div",
        { className: "calc-input-div" },
        step === 7 &&
          !calcState.finalNumpadAnswered &&
          React.createElement(
            "div",
            { className: "calc-right-prompt" },
            APP_DATA.calculationFinal.prompt
          ),
        step === 7 &&
          !calcState.finalNumpadAnswered &&
          React.createElement(Numpad, {
            onNumberClick: handleNumberClick,
            onClear: handleClear,
            onSubmit: handleSubmit,
          })
      )
    );

  const calc2CompleteRow = () =>
    renderInteractiveEquation({
      calcKey: "calculation2",
      forceState: { 0: true, 1: true },
    });

  if (step === 8 && stepData && stepData.isFinalStep) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final with-image" },
        React.createElement(
          "div",
          { className: "calc-image-row" },
          React.createElement("img", {
            src: imageSrc,
            alt: APP_DATA.calculation.altTexts.riceField || "Figure",
            className: "calc-image",
          })
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            calc2CompleteRow(),
            React.createElement(
              "div",
              { className: "calc-row" },
              `Remaining area = ${APP_DATA.calculationFinal.numpad.answer}${APP_DATA.calculationFinal.numpad.unit}`
            )
          ),
          React.createElement("div", { className: "final-answer-div" }, APP_DATA.finalAnswer)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  if (step === 5 || step === 6 || step === 7) {
    if (step === 6 && onUpdateTexts) {
      const state = getBoxState();
      if (!state[0]) onUpdateTexts(APP_DATA.steps[6].questionTextFirstBox, null);
    }

    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel with-image" },
        React.createElement(
          "div",
          { className: "calc-image-row" },
          imageSrc &&
            React.createElement("img", {
              src: imageSrc,
              alt: APP_DATA.calculation.altTexts.riceField || "Figure",
              className: "calc-image",
            })
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement(
            "div",
            { className: "calc-rows-container" },
            step === 7
              ? React.createElement(
                  React.Fragment,
                  null,
                  calc2CompleteRow(),
                  !calcState.finalNumpadAnswered
                    ? renderNumpadRow()
                    : renderNumpadAnsweredRow()
                )
              : renderInteractiveEquation()
          )
        )
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  return null;
};
