const MainCanvas = ({
  step,
  mcqAnswered,
  mcq14Answered,
  isAnimating,
  onVisualise,
  onAnimationComplete,
  onMcqCorrect,
  onMcq14Correct,
  onMcqWrong,
  actionBtnText,
  hemisphereAction,
}) => {
  const { useState, useEffect, useRef } = React;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  
  // Internal hemisphere action state
  const [hemiAction, setHemiAction] = useState(null);
  const actionKeyRef = useRef(0);
  const [hemiLabelMode, setHemiLabelMode] = useState("initial");

  // Reset MCQ state on step change
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
  }, [step]);

  // ---- Show right MCQ panel only on steps 10 and 14 ----
  const showRightPanel = step === 10 || step === 14;

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
      if (step === 14) {
        onMcq14Correct();
      } else {
        onMcqCorrect();
      }
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
      if (typeof playSound === "function") playSound("wrong");
      if (onMcqWrong) onMcqWrong();
    }
  };

  // ---- Handle the Visualise button click for step 1 ----
  const handleVisualiseClick = () => {
    if (step === 1) {
      actionKeyRef.current += 1;
      setHemiAction({
        type: "horizontal",
        key: actionKeyRef.current,
      });
      setHemiLabelMode("initial");
    }
    onVisualise();
  };

  // ---- Handle hemisphere animation complete ----
  const handleHemiAnimComplete = () => {
    setHemiLabelMode("hemispheres");
    onAnimationComplete();
  };

  // ---- Determine visual component ----
  const renderVisual = () => {
    // Step 1: HemisphereVisual (3D sphere split)
    if (step === 1) {
      return React.createElement(HemisphereVisual, {
        action: hemiAction,
        labelMode: hemiLabelMode,
        onAnimationComplete: handleHemiAnimComplete,
      });
    }

    // Steps 2-5: SphereVisual (sphere -> labels -> cylinder -> rectangle)
    if (step >= 2 && step <= 5) {
      // Map our steps 2-5 to SphereVisual internal steps 1-4
      const sphereStep = step - 1;
      return React.createElement(SphereVisual, {
        step: sphereStep,
        onAnimationComplete: onAnimationComplete,
      });
    }

    // Steps 6-8: SphereStill (static sphere + rectangle)
    if (step >= 6 && step <= 8) {
      return React.createElement(SphereStill, {});
    }

    // Steps 9-16: HemisphereStill
    if (step >= 9 && step <= 16) {
      return React.createElement(HemisphereStill, {
        highlightBase: step === 14 && !isCorrect,
      });
    }

    return null;
  };

  // ---- Equation rendering (from APP_DATA.equations) ----
  const renderEquation = () => {
    const eq = APP_DATA.equations && APP_DATA.equations[step];
    if (!eq) return null;

    const box = (text, className) =>
      React.createElement("span", { className: className || "equation-box", dangerouslySetInnerHTML: { __html: text } });

    // Three boxes: box1 = box2 = box3
    if (eq.box3) {
      return React.createElement(
        "div",
        { className: "equation-text" },
        box(eq.box1),
        " = ",
        box(eq.box2),
        " = ",
        box(eq.box3)
      );
    }

    // Two boxes with optional highlight (step 10)
    if (eq.box2Highlight) {
      return React.createElement(
        "div",
        { className: "equation-text" },
        box(eq.box1),
        " = ",
        React.createElement(
          "span",
          { className: "equation-box" },
          eq.box2Prefix,
          React.createElement("y", null, eq.box2Highlight)
        )
      );
    }

    // Two boxes: box1 = box2
    if (eq.box2) {
      return React.createElement(
        "div",
        { className: "equation-text" },
        box(eq.box1),
        " = ",
        box(eq.box2)
      );
    }

    // Full line (steps 13, 15, 16)
    if (eq.full) {
      return React.createElement("div", { className: "equation-text" }, eq.full);
    }

    // Step 14: prefix + [box or boxReplaced] + suffix
    if (eq.prefix !== undefined) {
      return React.createElement(
        "div",
        { className: "equation-text" },
        eq.prefix,
        isCorrect ? box(eq.boxReplaced, "equation-box replaced") : box(eq.box),
        eq.suffix
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

  // ---- Action button rendering (step 1: Visualize/Reset, step 2: Unfold) ----
  const renderActionButton = () => {
    if (step === 1) {
      return React.createElement(
        "button",
        {
          className: "btn action-btn",
          onClick: handleVisualiseClick,
          disabled: isAnimating,
        },
        actionBtnText
      );
    }
    // Step 2: Unfold button
    if (step === 2) {
      return React.createElement(
        "button",
        {
          className: "btn action-btn",
          onClick: onVisualise,
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
        renderVisual()
      ),

      // ---- Right panel (MCQ) - steps 10 and 14 ----
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

      // Action button (step 1-2)
      renderActionButton(),

      // Equation (steps 6-16)
      renderEquation()
    )
  );
};
