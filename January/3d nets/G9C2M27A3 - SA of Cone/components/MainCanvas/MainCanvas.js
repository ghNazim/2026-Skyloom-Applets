const MainCanvas = ({
  step,
  mediaSrc,
  isVideo,
  preloadVideoSrc,
  onVideoEnded,
  hasUnfoldedOnce,
  showStep1Legend,
  showStep1UnfoldButton,
  onUnfold,
  showStep34Toggle,
  onToggleFold,
  playReverse,
  step34Animating,
  mcqAnswered,
  onMcqCorrect,
  onMcqWrong,
  substitutedTerms,
  onInteractiveTermClick,
  onStep8AnimationComplete,
  step10Correct,
}) => {
  const { useState, useEffect, useRef } = React;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [step8Phase, setStep8Phase] = useState(0);
  const [step7FeedbackSrc, setStep7FeedbackSrc] = useState(null);
  const step8Timeouts = useRef([]);

  useEffect(() => {
    if (step !== 8) {
      setStep8Phase(0);
      step8Timeouts.current.forEach(clearTimeout);
      step8Timeouts.current = [];
      return;
    }
    const t1 = setTimeout(() => setStep8Phase(1), 600);
    const t2 = setTimeout(() => setStep8Phase(2), 1600);
    const t3 = setTimeout(() => {
      setStep8Phase(3);
      if (onStep8AnimationComplete) onStep8AnimationComplete();
    }, 2600);
    step8Timeouts.current = [t1, t2, t3];
    return () => step8Timeouts.current.forEach(clearTimeout);
  }, [step]);

  const stepData = APP_DATA.steps[step];
  const showRightPanel = step === 2 || step === 10;

  const getOptionIndex = (option) => {
    if (!stepData || !stepData.options) return -1;
    return stepData.options.indexOf(option);
  };

  let resolvedMediaSrc = mediaSrc;
  if (step === 7 && step7FeedbackSrc) {
    resolvedMediaSrc = step7FeedbackSrc;
  } else if (step === 2 && isCorrect && stepData.correctFeedbackImage) {
    resolvedMediaSrc = stepData.correctFeedbackImage;
  } else if (
    step === 10 &&
    selectedOption != null &&
    stepData.visualFeedbackPerOption &&
    getOptionIndex(selectedOption) >= 0
  ) {
    resolvedMediaSrc = stepData.visualFeedbackPerOption[getOptionIndex(selectedOption)];
  }

  const handleInteractiveTermClick = (key) => {
    if (onInteractiveTermClick) onInteractiveTermClick(key);
    const term = (stepData.interactiveTerms || []).find((t) => t.key === key);
    if (term && term.feedbackImage) {
      setStep7FeedbackSrc(term.feedbackImage);
    }
  };

  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    setStep7FeedbackSrc(null);
  }, [step]);

  const handleOptionClick = (option) => {
    if (isCorrect) return;
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

  const getMcqData = () => {
    if (!stepData || !stepData.options) return null;
    return {
      title: stepData.mcqTitle,
      options: stepData.options,
    };
  };

  const eq = APP_DATA.equations || {};

  // ---- Equation: fraction (num over den with bar) ----
  const renderFraction = (numContent, denContent) =>
    React.createElement(
      "span",
      { className: "equation-fraction" },
      React.createElement("span", { className: "equation-frac-num" }, numContent),
      React.createElement("span", { className: "equation-frac-bar" }),
      React.createElement("span", { className: "equation-frac-den" }, denContent)
    );

  // ---- Step 6: Area of sector = (Arc length / Circumference of circle) × Area of circle ----
  const renderEquationStep6 = () =>
    React.createElement(
      "div",
      { className: "equation-text" },
      eq.areaOfSector + " = ",
      renderFraction(eq.arcLength, eq.circumferenceOfCircle),
      " × ",
      eq.areaOfCircle
    );

  // ---- Step 7: Interactive boxes ----
  const renderEquationStep7 = () => {
    const terms = stepData.interactiveTerms || [];
    const getLabel = (t) => (t && t.labelKey && eq[t.labelKey]) || (t && t.label) || "";
    return React.createElement(
      "div",
      { className: "equation-text" },
      eq.areaOfSector + " = ",
      renderFraction(
        terms[0]
          ? React.createElement(
              "span",
              {
                className: substitutedTerms.arcLength ? "interactive-box value" : "interactive-box",
                onClick: substitutedTerms.arcLength ? undefined : () => handleInteractiveTermClick("arcLength"),
              },
              substitutedTerms.arcLength ? terms[0].value : getLabel(terms[0])
            )
          : eq.arcLength,
        terms[1]
          ? React.createElement(
              "span",
              {
                className: substitutedTerms.circumference ? "interactive-box value" : "interactive-box",
                onClick: substitutedTerms.circumference ? undefined : () => handleInteractiveTermClick("circumference"),
              },
              substitutedTerms.circumference ? terms[1].value : getLabel(terms[1])
            )
          : eq.circumferenceOfCircle
      ),
      " × ",
      terms[2]
        ? React.createElement(
            "span",
            {
              className: substitutedTerms.areaOfCircle ? "interactive-box value" : "interactive-box",
              onClick: substitutedTerms.areaOfCircle ? undefined : () => handleInteractiveTermClick("areaOfCircle"),
            },
            substitutedTerms.areaOfCircle ? terms[2].value : getLabel(terms[2])
          )
        : eq.areaOfCircle
    );
  };

  // ---- Step 8: Substituted with cross-out then append = πrl = Curved Surface Area ----
  const renderEquationStep8 = () => {
    const showCrossOut = step8Phase >= 1;
    const showFirstAppend = step8Phase >= 2;
    const showSecondAppend = step8Phase >= 3;

    const numContent = showCrossOut
      ? React.createElement(
          "span",
          null,
          React.createElement("span", { className: "cross-out" }, "2π"),
          React.createElement("span", null, "r")
        )
      : "2πr";
    const denContent = showCrossOut
      ? React.createElement(
          "span",
          null,
          React.createElement("span", { className: "cross-out" }, "2π"),
          React.createElement("span", { className: "cross-out" }, "l")
        )
      : "2πl";
    const thirdContent = showCrossOut
      ? React.createElement(
          "span",
          null,
          React.createElement("span", null, "π"),
          React.createElement("span", {}, "l"),
          React.createElement("span", { className: "cross-out cross-out-sup" }, "²")
        )
      : "πl²";

    return React.createElement(
      "div",
      { className: "equation-text equation-step8", id: "equation-step8" },
      eq.areaOfSector + " = ",
      renderFraction(numContent, denContent),
      " × ",
      React.createElement("span", { className: "equation-box-inline" }, thirdContent),
      showFirstAppend && React.createElement("span", { className: "equation-appended" }, " = πrl "),
      showSecondAppend && React.createElement("span", { className: "equation-appended" }, " = "),
      showSecondAppend && React.createElement("span", { className: "equation-box equation-appended" }, eq.curvedSurfaceArea)
    );
  };

  // ---- Step 9 ----
  const renderEquationStep9 = () =>
    React.createElement(
      "div",
      { className: "equation-text" },
      eq.totalSurfaceArea + " = ",
      React.createElement("span", { className: "equation-box" }, eq.areaOfBase),
      " + ",
      eq.curvedSurfaceArea
    );

  // ---- Step 10: only "Area of Base" boxed; substitute with πr² after correct ----
  const renderEquationStep10 = () => {
    if (step10Correct) {
      return React.createElement(
        "div",
        { className: "equation-text" },
        eq.totalSurfaceArea + " = ",
        React.createElement("span", { className: "equation-highlight replaced" }, eq.piRSquared),
        " + ",
        eq.curvedSurfaceArea
      );
    }
    return React.createElement(
      "div",
      { className: "equation-text" },
      eq.totalSurfaceArea + " = ",
      React.createElement("span", { className: "equation-box" }, eq.areaOfBase),
      " + ",
      eq.curvedSurfaceArea
    );
  };

  // ---- Step 11 ----
  const renderEquationStep11 = () =>
    React.createElement(
      "div",
      { className: "equation-text" },
      eq.totalSurfaceArea + " = " + eq.totalFinalFormula
    );

  const renderEquation = () => {
    switch (step) {
      case 6:
        return renderEquationStep6();
      case 7:
        return renderEquationStep7();
      case 8:
        return renderEquationStep8();
      case 9:
        return renderEquationStep9();
      case 10:
        return renderEquationStep10();
      case 11:
        return renderEquationStep11();
      default:
        return null;
    }
  };

  const renderActionButton = () => {
    if (step === 1 && showStep1UnfoldButton && !hasUnfoldedOnce) {
      return React.createElement(
        "button",
        {
          className: "btn action-btn",
          onClick: onUnfold,
          disabled: isVideo,
        },
        APP_DATA.buttons.unfold
      );
    }
    if (showStep34Toggle && onToggleFold) {
      return React.createElement(
        "button",
        {
          className: "btn action-btn",
          onClick: onToggleFold,
          disabled: step34Animating,
        },
        "\u27F2"
      );
    }
    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    React.createElement(
      "div",
      { className: "main-row" },
      React.createElement(
        "div",
        {
          className: "visual-panel",
          style: Object.assign(
            { position: "relative" },
            showRightPanel ? { flex: "0 0 65%" } : { flex: "1" }
          ),
        },
        React.createElement(VisualCanvas, {
          src: resolvedMediaSrc,
          isVideo: isVideo || false,
          preloadVideoSrc: preloadVideoSrc,
          playReverse: playReverse || false,
          onVideoEnded: onVideoEnded,
        }),
        showStep1Legend &&
          stepData.legend &&
          React.createElement("div", {
            className: "legend",
            dangerouslySetInnerHTML: { __html: stepData.legend },
          })
      ),
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

    React.createElement(
      "div",
      { className: "action-row" },
      renderActionButton(),
      renderEquation()
    )
  );
};
