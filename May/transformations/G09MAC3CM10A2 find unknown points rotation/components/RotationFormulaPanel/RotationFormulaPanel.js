const RotationFormulaPanel = ({
  formulaState,
  formulaRefs,
  step5Phase,
  step5Selected,
  onStep5Select,
  step6Phase,
  onStep6Apply,
}) => {
  const f = APP_DATA.formula;
  const mcq = APP_DATA.mcq.step5;
  const apply = APP_DATA.applyPanel;
  const fs = formulaState || {};

  const showApply = step6Phase != null;
  const showMcq =
    !showApply &&
    (step5Phase === "mcq" ||
      step5Phase === "selected" ||
      step5Phase === "rotationFly" ||
      step5Phase === "done");
  const mcqDisabled =
    step5Phase === "rotationFly" || step5Phase === "done" || step5Selected !== null;

  const renderFormulaPart = (visibleKey, refKey, text, className) => {
    const visible = fs[visibleKey];
    return React.createElement(
      "span",
      {
        className:
          "rfp-part " +
          className +
          (visible ? " is-visible" : "") +
          (fs.switching === visibleKey ? " is-switching" : ""),
        ref: (el) => {
          if (formulaRefs) formulaRefs.current[refKey] = el;
        },
      },
      text,
    );
  };

  const objText = fs.useGeneric ? f.objGeneric : f.objNumeric;
  const imgText = fs.useGeneric ? f.imgGeneric : f.imgNumeric;

  const picked =
    step5Selected !== null &&
    (step5Phase === "selected" ||
      step5Phase === "rotationFly" ||
      step5Phase === "done");
  const isCorrect = step5Selected === mcq.correctIndex && picked;

  return React.createElement(
    "div",
    {
      className:
        "rotation-formula-panel" +
        (fs.panelVisible ? " is-visible" : "") +
        (fs.movedUp ? " is-moved-up" : ""),
    },
    React.createElement(
      "div",
      { className: "rfp-formula-box" },
      renderFormulaPart("formulaObj", "formula-obj", objText, "rfp-object"),
      renderFormulaPart("formulaArrow", "formula-arrow", "\u2192", "rfp-arrow"),
      renderFormulaPart("formulaImg", "formula-img", imgText, "rfp-image"),
    ),
    showMcq && !showApply
      ? React.createElement(
          "div",
          { className: "rfp-mcq-section" + (fs.movedUp ? " is-visible" : "") },
          React.createElement(
            "div",
            { className: "rfp-mcq-title" },
            mcq.title,
          ),
          React.createElement(
            "div",
            { className: "rfp-mcq-options" },
            mcq.options.map((opt, index) => {
              let cls = "rfp-mcq-option";
              const showResult = step5Selected === index && picked;
              if (showResult && index !== mcq.correctIndex) cls += " wrong";
              if (showResult && index === mcq.correctIndex) cls += " correct";
              return React.createElement(
                "button",
                {
                  key: index,
                  id: "rotation-mcq-opt-" + index,
                  className: cls,
                  disabled: mcqDisabled,
                  onClick: () => {
                    if (!mcqDisabled && typeof onStep5Select === "function") {
                      onStep5Select(index);
                    }
                  },
                },
                opt,
              );
            }),
          ),
        )
      : null,
    showApply
      ? React.createElement(
          "div",
          { className: "rfp-apply-section" },
          React.createElement("p", { className: "rfp-apply-text" }, apply.text),
          React.createElement(
            "button",
            {
              className: "rfp-apply-btn",
              id: "apply-rotation-btn",
              disabled: step6Phase !== "initial",
              onClick: onStep6Apply,
            },
            apply.buttonText,
          ),
        )
      : null,
  );
};
