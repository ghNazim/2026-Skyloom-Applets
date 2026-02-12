const MainCanvas = ({
  step,
  unfoldValue,
  isUnfolded,
  mcqAnswered,
  onUnfold,
  onMcqCorrect,
  onMcqWrong,
}) => {
  const { useState, useEffect } = React;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [pulsateLabels, setPulsateLabels] = useState(null);

  // Reset MCQ state on step change
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setPulsateLabels(null);
  }, [step]);

  // ---- Determine SquarePyramid visual props based on step ----
  const getVisualProps = () => {
    const baseProps = {
      unfoldValue: step === 1 ? unfoldValue : 1,
      skipCameraAnimation: step > 1,
    };

    switch (step) {
      case 1:
        return {
          ...baseProps,
          labelMode: isUnfolded ? "side" : "none",
          showFoldedStateLabels: !isUnfolded,
        };
      case 2:
        return {
          ...baseProps,
          labelMode: "side",
          baseFillTransparent: true,
        };
      case 3:
        return {
          ...baseProps,
          labelMode: "side",
          baseFillTransparent: true,
          dehighlightFacesFor: isCorrect ? null : "left",
          pulsateLabels: pulsateLabels,
        };
      case 4:
        return {
          ...baseProps,
          labelMode: "side",
          baseFillTransparent: true,
          triangleAreaLabelsInSideMode: true,
        };
      case 5:
        return {
          ...baseProps,
          labelMode: "side",
          baseFillTransparent: false,
          triangleAreaLabelsInSideMode: false,
        };
      case 6:
        return {
          ...baseProps,
          labelMode: "side",
          baseFillTransparent: false,
          baseHighlight: !isCorrect,
          dehighlightTrianglesForBase: !isCorrect,
          pulsateLabels: pulsateLabels,
        };
      case 7:
        return {
          ...baseProps,
          labelMode: "area",
        };
      default:
        return baseProps;
    }
  };

  const showRightPanel = (step === 3 || step === 6) && !isCorrect;

  // ---- MCQ handler ----
  const handleOptionClick = (option) => {
    if (isCorrect) return;

    const stepData = APP_DATA.steps[step];
    if (!stepData || !stepData.options) return;

    const correctOption = stepData.options[stepData.correct];
    setSelectedOption(option);

    if (option === correctOption) {
      setIsCorrect(true);
      setPulsateLabels(null);
      if (typeof playSound === "function") playSound("correct");
      onMcqCorrect();
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
      if (typeof playSound === "function") playSound("wrong");
      if (onMcqWrong) onMcqWrong();

      // Set pulsation for wrong answers
      if (step === 3) {
        setPulsateLabels(["a-left", "l-left"]);
      } else if (step === 6) {
        setPulsateLabels(["a-top", "a-bottom", "a-left", "a-right"]);
      }
    }
  };

  // ---- Equation rendering ----
  const renderEquation = () => {
    switch (step) {
      case 2:
        return React.createElement(
          "div",
          { className: "equation-text" },
          APP_DATA.canvas.lateralSurfaceArea + " = 4 × " + APP_DATA.canvas.areaOfTriangularFace
        );

      case 3:
        if (isCorrect) {
          return React.createElement(
            "div",
            { className: "equation-text" },
            APP_DATA.canvas.lateralSurfaceArea + " = 4 × ",
            React.createElement(
              "span",
              { className: "equation-highlight replaced" },
              "½ × a × l"
            )
          );
        }
        return React.createElement(
          "div",
          { className: "equation-text" },
          APP_DATA.canvas.lateralSurfaceArea + " = 4 × ",
          React.createElement(
            "span",
            { className: "equation-box" },
            APP_DATA.canvas.areaOfTriangularFace
          )
        );

      case 4:
        return React.createElement(
          "div",
          { className: "equation-text" },
          APP_DATA.canvas.lateralSurfaceArea + " = 2 × a × l"
        );

      case 5:
        return React.createElement(
          "div",
          { className: "equation-text" },
          APP_DATA.canvas.totalSurfaceArea + " = " + APP_DATA.canvas.areaOfBase + " + " + APP_DATA.canvas.lateralSurfaceArea
        );

      case 6:
        if (isCorrect) {
          return React.createElement(
            "div",
            { className: "equation-text" },
            APP_DATA.canvas.totalSurfaceArea + " = ",
            React.createElement(
              "span",
              { className: "equation-highlight replaced" },
              "a²"
            ),
            " + " + APP_DATA.canvas.lateralSurfaceArea
          );
        }
        return React.createElement(
          "div",
          { className: "equation-text" },
          APP_DATA.canvas.totalSurfaceArea + " = ",
          React.createElement(
            "span",
            { className: "equation-box" },
            APP_DATA.canvas.areaOfBase
          ),
          " + " + APP_DATA.canvas.lateralSurfaceArea
        );

      case 7:
        return React.createElement(
          "div",
          { className: "equation-text" },
          APP_DATA.canvas.totalSurfaceArea + " = a² + 2al"
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

  const visualProps = getVisualProps();

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    // ==== Main Row (85%) ====
    React.createElement(
      "div",
      { className: "main-row" },

      // ---- Visual panel (65%) ----
      React.createElement(
        "div",
        { className: "visual-panel" },
        React.createElement(SquarePyramid, visualProps)
      ),

      // ---- Step 1 legend (right middle of main-row) ----
      step === 1 &&
        React.createElement("div", {
          className: "step1-legend",
          dangerouslySetInnerHTML: {
            __html: APP_DATA.canvas.legend,
          },
        }),

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

      // Unfold button (step 1, before unfold)
      step === 1 &&
        !isUnfolded &&
        React.createElement(
          "button",
          {
            className: "btn action-btn",
            onClick: onUnfold,
          },
          APP_DATA.canvas.unfoldButton
        ),

      // Equation (steps 2-7)
      renderEquation()
    )
  );
};
