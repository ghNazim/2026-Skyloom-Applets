const MainCanvas = ({
  step,
  mcqAnswered,
  isAnimating,
  onUnfold,
  onAnimationComplete,
  onMcqCorrect,
  onMcqWrong,
}) => {
  const { useState, useEffect } = React;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  // Reset MCQ state on step change
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
  }, [step]);

  // ---- Show right MCQ panel only on step 5 ----
  const showRightPanel = step === 5;

  // ---- MCQ handler ----
  const handleOptionClick = (option) => {
    if (isCorrect) return;

    const stepData = APP_DATA.steps[step];
    if (!stepData || !stepData.options) return;

    const correctOption = stepData.options[stepData.correct];
    setSelectedOption(option);

    if (option === correctOption) {
      setIsCorrect(true);
      if (typeof playSound === "function") playSound("correct");
      onMcqCorrect();
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
      if (typeof playSound === "function") playSound("wrong");
      if (onMcqWrong) onMcqWrong();
    }
  };

  // ---- Equation rendering (steps 5-6 only) ----
  const renderEquation = () => {
    const eq = APP_DATA.equations;

    const eqSep = eq.equationEquals != null ? eq.equationEquals : " = ";
    if (step === 5) {
      if (isCorrect) {
        return React.createElement(
          "div",
          { className: "equation-text" },
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.surfaceArea
          ),
          eqSep,
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.areaOfRectangle
          ),
          eqSep,
          React.createElement(
            "span",
            { className: "equation-highlight replaced" },
            eq.twoPiRTimesTwoR
          )
        );
      }
      return React.createElement(
        "div",
        { className: "equation-text" },
        React.createElement(
          "span",
          { className: "equation-box" },
          eq.surfaceArea
        ),
        eqSep,
        React.createElement(
          "span",
          { className: "equation-box" },
          eq.areaOfRectangle
        ),
        eqSep,
        React.createElement(
          "span",
          { className: "equation-box", dangerouslySetInnerHTML: { __html: eq.lengthTimesBreadth } },
        )
      );
    }

    if (step === 6) {
      return React.createElement(
        "div",
        { className: "equation-text" },
        React.createElement(
          "span",
          { className: "equation-box" },
          eq.surfaceArea
        ),
        eqSep,
        React.createElement(
          "span",
          { className: "equation-box" },
          eq.areaOfRectangle
        ),
        eqSep,
        React.createElement(
          "span",
          { className: "equation-box" },
          eq.fourPiRSquared
        )
      );
    }

    return null;
  };

  // ---- MCQ data ----
  const getMcqData = () => {
    const stepData = APP_DATA.steps[step];
    if (!stepData || !stepData.options) return null;
    return {
      title: stepData.mcqTitle,
      options: stepData.options,
    };
  };

  // ---- Action button rendering (step 1: Unfold) ----
  const renderActionButton = () => {
    if (step === 1) {
      return React.createElement(
        "button",
        {
          className: "btn action-btn",
          onClick: onUnfold,
          disabled: isAnimating,
        },
        APP_DATA.buttons.unfold
      );
    }
    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    // ==== Main Row (85%) ====
    React.createElement(
      "div",
      { className: "main-row" },

      // ---- Visual panel ----
      React.createElement(
        "div",
        {
          className: "visual-panel",
          style: showRightPanel ? { flex: "0 0 65%" } : { flex: "1" },
        },
        // Steps 1-4: SphereVisual, Steps 5-6: SphereStill
        step >= 1 && step <= 4
          ? React.createElement(SphereVisual, {
              step: step,
              onAnimationComplete: onAnimationComplete,
            })
          : React.createElement(SphereStill, {})
      ),

      // ---- Right panel (MCQ) - step 5 only ----
      showRightPanel &&
        React.createElement(
          "div",
          { className: "right-panel" },
          React.createElement(MCQPanel, {
            mcqData: getMcqData(),
            selectedOption: selectedOption,
            isCorrect: isCorrect,
            onOptionClick: handleOptionClick,
            showFeedback: false,
            shake: wrongShake,
          })
        )
    ),

    // ==== Action Row (15%) ====
    React.createElement(
      "div",
      { className: "action-row" },

      // Action button (step 1)
      renderActionButton(),

      // Equation (steps 5-6)
      renderEquation()
    )
  );
};
