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
  onUpdateImage
}) => {
  const { useState, useEffect } = React;

  const calc1Data = APP_DATA.calculation1;
  const mcqData = APP_DATA.conversionMcq;
  const givenList = APP_DATA.dragDrop1.findingsList;
  const conversionRow = APP_DATA.conversionRow || {};
  const conversionResult = APP_DATA.conversionResult || {};

  const [numpadValue, setNumpadValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [inputCorrect, setInputCorrect] = useState(false);
  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);
  const [conversionBoxSubstituted, setConversionBoxSubstituted] = useState(false);

  useEffect(() => {
    setNumpadValue("");
    setInputError(false);
    setInputCorrect(false);
    setSelectedMcqOption(null);
    setMcqCorrect(false);
    if (step === 6) setConversionBoxSubstituted(false);
  }, [step]);

  // Step 6: MCQ - on correct, append finding and show calc row with interactive box
  const handleMcqOptionClick = (index) => {
    if (mcqCorrect) return;
    setSelectedMcqOption(index);
    if (index === mcqData.answerIndex) {
      setMcqCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setCalcState(prev => ({
          ...prev,
          mcqAnswered: true,
          findings: APP_DATA.findingsAfterMcq || []
        }));
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[6];
          onUpdateNavText(stepData.navTextInteractiveBox || stepData.navTextCorrect);
        }
      }, 500);
    } else {
      if (window.playSound) window.playSound("wrong");
    }
  };

  // Step 6: Click on interactive box to substitute value, then enable next
  const handleConversionBoxClick = () => {
    if (conversionBoxSubstituted) return;
    if (window.playSound) window.playSound("tick");
    setConversionBoxSubstituted(true);
    setTimeout(() => {
      if (onEnableNext) onEnableNext();
      if (onUpdateNavText) {
        const stepData = APP_DATA.steps[6];
        onUpdateNavText(stepData.navTextCorrect);
      }
    }, 300);
  };

  const handleNumberClick = (num) => {
    if (step !== 5) return;
    const maxLength = calc1Data.numpad.maxLength;
    if (numpadValue.length < maxLength) setNumpadValue(prev => prev + num);
  };

  const handleClear = () => setNumpadValue(prev => prev.slice(0, -1));

  const handleSubmit = () => {
    if (step !== 5) return;
    const correctAnswer = calc1Data.numpad.answer;
    if (numpadValue === correctAnswer) {
      setInputCorrect(true);
      if (window.playSound) window.playSound("correct");
      setTimeout(() => {
        setInputCorrect(false);
        setCalcState(prev => ({
          ...prev,
          calc1NumpadAnswered: true,
          calc1NumpadValue: numpadValue,
          findings: APP_DATA.findingsAfterNumpad || []
        }));
        if (onEnableNext) onEnableNext();
        if (onUpdateNavText) {
          const stepData = APP_DATA.steps[5];
          onUpdateNavText(stepData.navTextCorrect);
        }
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

  const getFindings = () => {
    if (step === 5) {
      return { title: APP_DATA.labels.given, list: givenList };
    }
    // Step 6, 7, 8: Findings (step 6 starts with previous finding from step 5)
    return {
      title: APP_DATA.labels.findings,
      list: calcState.findings && calcState.findings.length > 0 ? calcState.findings : (APP_DATA.findingsDefault || [])
    };
  };

  // Step 5: Three calc rows + numpad (all strings from data)
  const renderStep5Rows = () => {
    const eq = calc1Data.initialEquation || [];
    const numpadRow = calc1Data.numpadRow || { prefix: "", suffix: "" };
    const rows = [
      eq[0] && React.createElement("div", { key: "r0", className: "calc-row" }, eq[0]),
      eq[1] && React.createElement("div", { key: "r1", className: "calc-row" }, eq[1])
    ].filter(Boolean);
    if (!calcState.calc1NumpadAnswered) {
      rows.push(
        React.createElement("div", { key: "r2", className: "calc-row" },
          numpadRow.prefix,
          React.createElement("span", {
            className: `calc-input-box ${inputError ? "error shake" : ""} ${inputCorrect ? "correct" : ""}`
          }, numpadValue || ""),
          numpadRow.suffix
        )
      );
    } else {
      rows.push(
        React.createElement("div", { key: "r2", className: "calc-row" },
          numpadRow.prefix,
          calcState.calc1NumpadValue,
          numpadRow.suffix
        )
      );
    }
    return rows;
  };

  // Step 6: After MCQ correct - one calc row with interactive box (strings from data)
  const renderStep6Rows = () => {
    if (!calcState.mcqAnswered) return [];
    const prefix = conversionRow.prefix || "";
    const suffix = conversionRow.suffix || "";
    const initialLabel = conversionRow.initialBoxLabel || "";
    const substitutedValue = conversionRow.substitutedValue || "";
    return [
      React.createElement("div", { key: "conv", className: "calc-row" },
        prefix,
        React.createElement(
          "span",
          {
            className: `calc-interactive-box ${conversionBoxSubstituted ? "revealed" : "clickable"}`,
            onClick: () => !conversionBoxSubstituted && handleConversionBoxClick()
          },
          conversionBoxSubstituted ? substitutedValue : initialLabel
        ),
        suffix
      )
    ];
  };

  // Step 7 & 8: Calc rows from data (conversionResult)
  const renderStep7Rows = () => [
    React.createElement("div", { key: "div", className: "calc-row" }, conversionResult.line1 || ""),
    React.createElement("div", { key: "ans", className: "calc-row" },
      conversionResult.line2Prefix || "",
      React.createElement("span", { className: "calc-highlight-yellow" }, conversionResult.line2Highlight || ""),
      conversionResult.line2Suffix || ""
    )
  ];

  const renderStep8Rows = () => [
    React.createElement("div", { key: "div", className: "calc-row" }, conversionResult.line1 || ""),
    React.createElement("div", { key: "ans", className: "calc-row" },
      conversionResult.line2Prefix || "",
      React.createElement("span", { className: "calc-highlight-yellow" }, conversionResult.line2Highlight || ""),
      conversionResult.line2Suffix || ""
    )
  ];

  const renderLeftPanelCalcRows = () => {
    if (step === 5) return renderStep5Rows();
    if (step === 6) return renderStep6Rows();
    if (step === 7) return renderStep7Rows();
    if (step === 8) return renderStep8Rows();
    return [];
  };

  const renderRightPanel = () => {
    const findingsData = getFindings();
    return React.createElement(
      "div",
      { className: "calc-input-panel" },
      React.createElement(
        "div",
        { className: "calc-findings-div" },
        React.createElement("div", { className: "findings-title" }, findingsData.title),
        React.createElement(
          "ul",
          { className: "findings-list" },
          findingsData.list.map((finding, index) =>
            React.createElement("li", { key: `finding-${index}` }, finding)
          )
        )
      ),
      React.createElement(
        "div",
        { className: "calc-input-div" },
        step === 5 && !calcState.calc1NumpadAnswered && React.createElement(Numpad, {
          onNumberClick: handleNumberClick,
          onClear: handleClear,
          onSubmit: handleSubmit
        }),
        step === 6 && !calcState.mcqAnswered && renderMcq()
      )
    );
  };

  const renderMcq = () =>
    React.createElement(
      "div",
      { className: "calc-mcq" },
      React.createElement("div", { className: "calc-mcq-title" }, mcqData.title),
      React.createElement(
        "div",
        { className: "calc-mcq-options" },
        mcqData.options.map((option, index) => {
          let className = "calc-mcq-option";
          if (selectedMcqOption === index) {
            className += index === mcqData.answerIndex ? " correct" : " incorrect";
          }
          if (mcqCorrect && index !== mcqData.answerIndex) className += " disabled";
          return React.createElement("button", {
            key: `mcq-${index}`,
            className,
            onClick: () => handleMcqOptionClick(index),
            disabled: mcqCorrect
          }, option);
        })
      )
    );

  // Step 8: Final step with final answer div
  if (step === 8) {
    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      React.createElement(
        "div",
        { className: "calc-left-panel final with-image" },
        React.createElement(
          "div",
          { className: "calc-image-row" },
          imageSrc && React.createElement("img", { src: imageSrc, alt: "Milk cartons", className: "calc-image" })
        ),
        React.createElement(
          "div",
          { className: "calc-equation-row" },
          React.createElement("div", { className: "calc-rows-container" }, renderStep8Rows()),
          React.createElement("div", { className: "final-answer-div" }, APP_DATA.finalAnswer)
        )
      ),
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  // Steps 5, 6, 7
  return React.createElement(
    "div",
    { className: "calc-panel-container" },
    React.createElement(
      "div",
      { className: "calc-left-panel with-image" },
      React.createElement(
        "div",
        { className: "calc-image-row" },
        imageSrc && React.createElement("img", { src: imageSrc, alt: "Milk cartons", className: "calc-image" })
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        React.createElement("div", { className: "calc-rows-container" }, renderLeftPanelCalcRows())
      )
    ),
    React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
  );
};
