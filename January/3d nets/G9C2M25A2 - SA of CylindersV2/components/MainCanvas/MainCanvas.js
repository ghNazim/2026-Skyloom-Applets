const MainCanvas = ({
  step,
  unfoldValue,
  isUnfolded,
  mcqAnswered,
  isAnimating,
  hasUnfoldedOnce,
  showUnfoldButton,
  highlightPhase,
  onUnfold,
  onToggle,
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

  // ---- Determine CylinderVisual props based on step ----
  const getVisualProps = () => {
    const baseProps = {
      unfoldValue: step === 1 || step === 3 ? unfoldValue : 1,
      showRectBorders: true,
      highlightPhase: highlightPhase || undefined,
    };

    switch (step) {
      case 1:
        return {
          ...baseProps,
          showFoldedLabels: true,
          showUnfoldedLabels: isUnfolded,
        };
      case 2:
        return {
          ...baseProps,
          showUnfoldedLabels: true,
          showCircumferenceLabels: true,
        };
      case 3:
        return {
          ...baseProps,
          showFoldedLabels: true,
          showUnfoldedLabels: true,
          showSurfaceWidthLabel: true,
        };
      case 4:
        return {
          ...baseProps,
          showUnfoldedLabels: true,
          showSurfaceWidthLabel: true,
          dehighlightBases: true,
          blinkSurfaceEdges: !isCorrect,
        };
      case 5:
        return {
          ...baseProps,
          showUnfoldedLabels: true,
          showSurfaceWidthLabel: true,
        };
      case 6:
        return {
          ...baseProps,
          showUnfoldedLabels: true,
          showSurfaceWidthLabel: true,
          highlightTopOnly: true,
        };
      case 7:
      case 8:
        return {
          ...baseProps,
          showUnfoldedLabels: true,
          showSurfaceWidthLabel: true,
        };
      default:
        return baseProps;
    }
  };

  // ---- Show right panel for MCQ steps (keep visible even after answering) ----
  const showRightPanel = step === 4 || step === 6;

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

  // ---- Equation rendering ----
  const renderEquation = () => {
    const eq = APP_DATA.equations;
    switch (step) {
      case 4:
        if (isCorrect) {
          return React.createElement(
            "div",
            { className: "equation-text" },
            React.createElement(
              "span",
              { className: "equation-box" },
              eq.curvedSurfaceArea
            ),
            " = ",
            React.createElement(
              "span",
              { className: "equation-box" },
              eq.areaOfRectangle
            ),
            " = ",
            React.createElement(
              "span",
              { className: "equation-highlight replaced" },
              eq.twoPiRTimesH
            )
          );
        }
        return React.createElement(
          "div",
          { className: "equation-text" },
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.curvedSurfaceArea
          ),
          " = ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.areaOfRectangle
          ),
          " = ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.lengthTimesBreadth
          )
        );

      case 5:
        return React.createElement(
          "div",
          { className: "equation-text" },
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.totalSurfaceArea
          ),
          " = ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.twoTimesAreaOfCircularBase
          ),
          " + ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.curvedSurfaceAreaShort
          )
        );

      case 6:
        if (isCorrect) {
          return React.createElement(
            "div",
            { className: "equation-text" },
            React.createElement(
              "span",
              { className: "equation-box" },
              eq.totalSurfaceArea
            ),
            " = ",
            React.createElement(
              "span",
              { className: "equation-highlight replaced" },
              eq.twoTimesPiRSquared
            ),
            " + ",
            React.createElement(
              "span",
              { className: "equation-box" },
              eq.curvedSurfaceAreaShort
            )
          );
        }
        return React.createElement(
          "div",
          { className: "equation-text" },
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.totalSurfaceArea
          ),
          " = ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.twoTimesAreaOfCircularBase
          ),
          " + ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.curvedSurfaceAreaShort
          )
        );

      case 7:
        return React.createElement(
          "div",
          { className: "equation-text" },
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.totalSurfaceArea
          ),
          " = ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.twoTimesPiRSquared
          ),
          " + ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.twoTimesPiRH
          )
        );

      case 8:
        return React.createElement(
          "div",
          { className: "equation-text" },
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.totalSurfaceArea
          ),
          " = ",
          React.createElement(
            "span",
            { className: "equation-box" },
            eq.twoTimesPiRTimesRPlusH
          )
        );

      default:
        return null;
    }
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

  // ---- Action button rendering ----
  const renderActionButton = () => {
    if (step === 1) {
      // During highlight animation, show nothing in the action row
      if (highlightPhase) return null;
      if (!hasUnfoldedOnce && showUnfoldButton) {
        // "Unfold" button (shown only after highlight sequence completes)
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
      if (hasUnfoldedOnce) {
        // Toggle button "⟲"
        return React.createElement(
          "button",
          {
            className: "btn action-btn",
            onClick: onToggle,
            disabled: isAnimating,
          },
          "\u27F2"
        );
      }
      return null;
    }

    if (step === 3) {
      // Toggle button "⟲"
      return React.createElement(
        "button",
        {
          className: "btn action-btn",
          onClick: onToggle,
          disabled: isAnimating,
        },
        "\u27F2"
      );
    }

    return null;
  };

  const visualProps = getVisualProps();

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
        { className: showRightPanel ? "visual-panel" : "visual-panel", style: showRightPanel ? { flex: "0 0 65%" } : { flex: "1" } },
        React.createElement(CylinderVisual, visualProps)
      ),

      // ---- Right panel (35%) - MCQ ----
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

      // Action button (steps 1, 3)
      renderActionButton(),

      // Equation (steps 4-8)
      renderEquation()
    )
  );
};
