const CalculationPanel = ({
  step,
  onEnableNext,
  onUpdateNavText,
  calcState,
  setCalcState,
  imageSrc,
  onUpdateImage
}) => {
  const { useState, useEffect } = React;

  const findingsFormat = APP_DATA.findingsFormat || {};
  const triangleMcqData = APP_DATA.triangleMcq || {};
  const formulaMcqData = APP_DATA.formulaMcq || {};
  const perimeterCalc = APP_DATA.perimeterCalc || {};

  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);

  const [selectedTriangleMcq, setSelectedTriangleMcq] = useState(null);
  const [triangleMcqCorrect, setTriangleMcqCorrect] = useState(false);
  const [selectedFormulaMcq, setSelectedFormulaMcq] = useState(null);
  const [formulaMcqCorrect, setFormulaMcqCorrect] = useState(false);

  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
    setSelectedTriangleMcq(null);
    setTriangleMcqCorrect(false);
    setSelectedFormulaMcq(null);
    setFormulaMcqCorrect(false);
  }, [step]);

  const handleTriangleMcqClick = (index) => {
    if (triangleMcqCorrect) return;
    setSelectedTriangleMcq(index);
    if (index === triangleMcqData.answerIndex) {
      setTriangleMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, triangleMcqAnswered: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[3].navTextCorrect);
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  const handleFormulaMcqClick = (index) => {
    if (formulaMcqCorrect) return;
    setSelectedFormulaMcq(index);
    if (index === formulaMcqData.answerIndex) {
      setFormulaMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setCalcState(prev => ({ ...prev, formulaRowAdded: true, formulaMcqAnswered: true }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[4].navTextCorrect);
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  const handleNumberClick = (num) => {
    const isStep5 = step === 5;
    const maxLength = isStep5 ? (perimeterCalc.numpad1MaxLength || 2) : (perimeterCalc.numpad2MaxLength || 2);
    if (numpadValue.length < maxLength) {
      setNumpadValue(prev => prev + num);
    }
  };

  const handleClear = () => {
    setNumpadValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const isStep5 = step === 5;
    const correctAnswer = isStep5 ? perimeterCalc.numpad1Answer : perimeterCalc.numpad2Answer;

    if (numpadValue === correctAnswer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setInputCorrect(false);
        if (isStep5) {
          setCalcState(prev => ({
            ...prev,
            numpad1Answered: true,
            numpad1Value: numpadValue
          }));
        } else {
          setCalcState(prev => ({
            ...prev,
            numpad2Answered: true,
            numpad2Value: numpadValue
          }));
        }
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) onUpdateNavText(APP_DATA.steps[step].navTextCorrect);
      }, 300);
    } else {
      setInputError(true);
      if (window.playSound) window.playSound("wrong");
      setTimeout(() => {
        setInputError(false);
        setNumpadValue("");
      }, 300);
    }
  };

  // Findings div: INFORMATION ANALYSIS format
  const renderFindingsDiv = () => {
    const title = findingsFormat.title || "INFORMATION ANALYSIS";
    const givenLabel = findingsFormat.givenLabel || "Given:";
    const givenList = findingsFormat.givenList || [];
    const toFindLabel = findingsFormat.toFindLabel || "To Find:";
    const toFindList = findingsFormat.toFindList || [];

    return React.createElement(
      "div",
      { className: "calc-findings-div findings-format" },
      React.createElement("div", { className: "findings-format-title" }, title),
      React.createElement("div", { className: "findings-format-section" },
        React.createElement("div", { className: "findings-format-label" }, givenLabel),
        React.createElement("ul", { className: "findings-list" },
          givenList.map((item, i) => React.createElement("li", { key: `g-${i}` }, item))
        )
      ),
      React.createElement("div", { className: "findings-format-section" },
        React.createElement("div", { className: "findings-format-label" }, toFindLabel),
        React.createElement("ul", { className: "findings-list" },
          toFindList.map((item, i) => React.createElement("li", { key: `t-${i}` }, item))
        )
      )
    );
  };

  const renderTriangleMcq = () => {
    const options = triangleMcqData.options || [];
    return React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, triangleMcqData.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedTriangleMcq === index) {
            className += index === triangleMcqData.answerIndex ? " correct" : " incorrect";
          }
          if (triangleMcqCorrect && index !== triangleMcqData.answerIndex) className += " disabled";
          return React.createElement(
            "button",
            {
              key: `mcq-${index}`,
              className: className,
              onClick: () => handleTriangleMcqClick(index),
              disabled: triangleMcqCorrect
            },
            option
          );
        })
      )
    );
  };

  const renderFormulaMcq = () => {
    const options = formulaMcqData.options || [];
    return React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, formulaMcqData.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedFormulaMcq === index) {
            className += index === formulaMcqData.answerIndex ? " correct" : " incorrect";
          }
          if (formulaMcqCorrect && index !== formulaMcqData.answerIndex) className += " disabled";
          return React.createElement(
            "button",
            {
              key: `fmcq-${index}`,
              className: className,
              onClick: () => handleFormulaMcqClick(index),
              disabled: formulaMcqCorrect
            },
            option
          );
        })
      )
    );
  };

  const renderCalcRows = () => {
    const rows = [];

    if (calcState.formulaRowAdded) {
      rows.push(
        React.createElement("div", { key: "formula", className: "calc-row" },
          formulaMcqData.formulaRow || "Perimeter of equilateral triangle = 3 × Side"
        )
      );
    }

    if (step === 5) {
      if (!calcState.numpad1Answered) {
        rows.push(
          React.createElement("div", { key: "numpad1", className: "calc-row" },
            "= 3 × ",
            React.createElement("span", {
              className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrect ? "correct" : ""}`
            }, numpadValue || "")
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "val1", className: "calc-row" },
            "= 3 × " + calcState.numpad1Value
          )
        );
      }
    }

    if (step === 6) {
      rows.push(
        React.createElement("div", { key: "val1", className: "calc-row" },
          "= 3 × " + (calcState.numpad1Value || perimeterCalc.numpad1Answer)
        )
      );
      if (!calcState.numpad2Answered) {
        rows.push(
          React.createElement("div", { key: "numpad2", className: "calc-row" },
            "= ",
            React.createElement("span", {
              className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrect ? "correct" : ""}`
            }, numpadValue || "")
          )
        );
      } else {
        rows.push(
          React.createElement("div", { key: "val2", className: "calc-row" },
            "= " + calcState.numpad2Value
          )
        );
      }
    }

    if (step === 7) {
      rows.push(
        React.createElement("div", { key: "val1", className: "calc-row" },
          "= 3 × " + (calcState.numpad1Value || perimeterCalc.numpad1Answer)
        )
      );
      rows.push(
        React.createElement("div", { key: "val2", className: "calc-row" },
          "= " + (calcState.numpad2Value || perimeterCalc.numpad2Answer)
        )
      );
    }

    return rows;
  };

  const renderRightPanelContent = () => {
    if (step === 3) return renderTriangleMcq();
    if (step === 4) return renderFormulaMcq();
    if (step === 5 || step === 6) {
      const disabled = (step === 5 && calcState.numpad1Answered) || (step === 6 && calcState.numpad2Answered);
      return React.createElement(Numpad, {
        onNumberClick: handleNumberClick,
        onClear: handleClear,
        onSubmit: handleSubmit,
        disabled: disabled
      });
    }
    return null;
  };

  const renderRightPanel = () => {
    return React.createElement(
      "div",
      { className: "calc-input-panel" },
      renderFindingsDiv(),
      React.createElement(
        "div",
        { className: "calc-input-div" },
        renderRightPanelContent()
      )
    );
  };

  // Step 7: Final step - image + final answer only (no calculation rows)
  if (step === 7) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final with-image" },
        React.createElement("div", { className: "calc-image-row" },
          imageSrc && React.createElement("img", { src: imageSrc, alt: "Triangle", className: "calc-image" })
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement("div", { className: "final-answer-div" }, APP_DATA.finalAnswer)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  // Steps 3–6: Left = image (50%) + calc rows; Right = findings + MCQ or numpad
  const showCalcRows = step >= 4 && (calcState.formulaRowAdded || step >= 5);
  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    React.createElement(
      "div",
      { className: "calc-left-panel with-image" },
      React.createElement("div", { className: "calc-image-row" },
        imageSrc && React.createElement("img", { src: imageSrc, alt: "Triangle", className: "calc-image" })
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        showCalcRows && React.createElement("div", { className: "calc-rows-container" }, renderCalcRows())
      )
    ),
    React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
  );
};
