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

  const stepData = APP_DATA.steps[step];
  const isConvertFlow = stepData && stepData.isCalcWithQuestion;

  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [mcqCorrect, setMcqCorrect] = useState(false);

  useEffect(() => {
    setSelectedMcqOption(null);
    setMcqCorrect(false);
  }, [step]);

  if (!stepData) return null;

  // Convert mL to L flow (steps 3-7)
  if (isConvertFlow && step >= 3 && step <= 7) {
    const calcQuestionRowText = APP_DATA.questionText || "The water poured into the bucket by Helen is 6340 mL. How do you convert this measurement into liters? Explain it.";
    const handleMcqOptionClick = (index) => {
      const mcqKey = stepData.mcqKey;
      if (!mcqKey) return;
      const mcqData = APP_DATA[mcqKey];
      if (!mcqData || mcqCorrect) return;

      setSelectedMcqOption(index);

      if (index === mcqData.answerIndex) {
        setMcqCorrect(true);
        if (window.playSound) window.playSound("correct");
        setTimeout(() => {
          if (onEnableNext) onEnableNext();
          if (onUpdateNavText) onUpdateNavText(stepData.navTextCorrect);
        }, 500);
      } else {
        if (window.playSound) window.playSound("wrong");
      }
    };

    const getFindings = () => {
      let list = [];
      if (step === 4) list = ["mL is a smaller unit than L"];
      else if (step >= 5) list = ["mL is a smaller unit than L.", "1000 mL = 1 L"];
      return {
        title: APP_DATA.labels.findings,
        list: list
      };
    };

    const getMcqData = () => {
      const mcqKey = stepData.mcqKey;
      return mcqKey ? APP_DATA[mcqKey] : null;
    };

    const renderCalcRows = () => {
      const rows = [];
      rows.push(
        React.createElement("div", { key: "row-initial", className: "calc-row" },
          APP_DATA.calcRowInitial || "Volume of water poured = 6340 mL")
      );
      if (step >= 6) {
        rows.push(
          React.createElement("div", { key: "row-step6", className: "calc-row" },
            APP_DATA.calcRowStep6 || "Volume of water poured = (6340 ÷ 1000) L")
        );
      }
      if (step >= 7) {
        rows.push(
          React.createElement("div", { key: "row-step7", className: "calc-row" },
            APP_DATA.calcRowStep7 || "Volume of water poured = 6.34 L")
        );
      }
      return rows;
    };

    const renderRightPanel = () => {
      const findingsData = getFindings();
      const mcqData = getMcqData();
      const showMcq = (step === 3 || step === 4 || step === 5) && mcqData;

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
          showMcq
            ? React.createElement(
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
                    return React.createElement(
                      "button",
                      {
                        key: `mcq-${index}`,
                        className: className,
                        onClick: () => handleMcqOptionClick(index),
                        disabled: mcqCorrect
                      },
                      option
                    );
                  })
                )
              )
            : null
        )
      );
    };

    // Left panel: question row (20%) + calc rows (80%)
    const leftPanel = React.createElement(
      "div",
      { className: "calc-left-panel with-question-row" },
      React.createElement(
        "div",
        { className: "calc-question-row" },
        calcQuestionRowText
      ),
      React.createElement(
        "div",
        { className: "calc-equation-row" },
        React.createElement(
          "div",
          { className: "calc-rows-container" },
          renderCalcRows()
        ),
        step === 7 &&
          React.createElement(
            "div",
            { className: "final-answer-div" },
            APP_DATA.finalAnswer || "So, the water poured into the bucket by Helen is 6.34 liters."
          )
      )
    );

    return React.createElement(
      "div",
      { className: "calc-panel-container" },
      leftPanel,
      React.createElement("div", { className: "calc-right-panel" }, renderRightPanel())
    );
  }

  return null;
};
