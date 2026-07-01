const RotationFormulaPanel = ({
  formulaState,
  formulaRefs,
  step5Phase,
  step5Selected,
  step5Feedback,
  onStep5Select,
  step6Phase,
  onStep6Apply,
  onFormulaClick,
}) => {
  const f = APP_DATA.formula;
  const mcq = APP_DATA.mcq.step5;
  const apply = APP_DATA.applyPanel;
  const fs = formulaState || {};

  const showApply = step6Phase != null && step6Phase !== "done-phase";
  const showMcq =
    !showApply &&
    step5Phase != null &&
    (step5Phase === "mcq" ||
      step5Phase === "selected" ||
      step5Phase === "wrong" ||
      step5Phase === "rotationFly" ||
      step5Phase === "done");

  const mcqLocked =
    step5Phase === "rotationFly" || step5Phase === "done";

  const renderLegacyPart = (visibleKey, refKey, text, className) => {
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

  const renderCoordSlot = (refKey, value, className, visible) => {
    return React.createElement(
      "span",
      {
        className:
          "rfp-coord-slot " +
          className +
          (visible !== false ? " is-visible" : ""),
        ref: (el) => {
          if (formulaRefs) formulaRefs.current[refKey] = el;
        },
      },
      value,
    );
  };

  const renderObjectGroup = () => {
    const visible = fs.formulaObj !== false;
    return React.createElement(
      "span",
      {
        className:
          "rfp-part rfp-coord-group rfp-object" +
          (visible ? " is-visible" : "") +
          (fs.switching === "formulaObj" ? " is-switching" : ""),
        ref: (el) => {
          if (formulaRefs) formulaRefs.current["formula-obj"] = el;
        },
      },
      "(",
      renderCoordSlot("formula-obj-x", fs.objX || "x", "rfp-object", visible),
      ",",
      renderCoordSlot("formula-obj-y", fs.objY || "y", "rfp-object", visible),
      ")",
    );
  };

  const renderImageGroup = () => {
    const visible = fs.formulaImg !== false;
    const negate = fs.imgNegate !== false;
    return React.createElement(
      "span",
      {
        className:
          "rfp-part rfp-coord-group rfp-image" +
          (visible ? " is-visible" : "") +
          (fs.switching === "formulaImg" ? " is-switching" : ""),
        ref: (el) => {
          if (formulaRefs) formulaRefs.current["formula-img"] = el;
        },
      },
      "(",
      renderCoordSlot(
        "formula-img-y",
        fs.imgSlot1 || "y",
        "rfp-image",
        visible,
      ),
      ",",
      negate
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "rfp-coord-minus" }, "-"),
            renderCoordSlot(
              "formula-img-x",
              fs.imgSlot2 || "x",
              "rfp-image",
              visible,
            ),
          )
        : renderCoordSlot(
            "formula-img-x",
            fs.imgSlot2 || "x",
            "rfp-image",
            visible,
          ),
      ")",
    );
  };

  const renderLegacyFormula = () => {
    const objText =
      fs.objGeneric || fs.useGeneric ? f.objGeneric : f.objNumeric;
    const imgText =
      fs.imgGeneric || fs.useGeneric ? f.imgGeneric : f.imgNumeric;
    return React.createElement(
      React.Fragment,
      null,
      renderLegacyPart("formulaObj", "formula-obj", objText, "rfp-object"),
      renderLegacyPart("formulaArrow", "formula-arrow", "\u2192", "rfp-arrow"),
      renderLegacyPart("formulaImg", "formula-img", imgText, "rfp-image"),
    );
  };

  const renderSplitFormula = () => {
    return React.createElement(
      React.Fragment,
      null,
      renderObjectGroup(),
      renderLegacyPart("formulaArrow", "formula-arrow", "\u2192", "rfp-arrow"),
      renderImageGroup(),
    );
  };

  const picked =
    step5Selected !== null &&
    (step5Phase === "selected" ||
      step5Phase === "wrong" ||
      step5Phase === "rotationFly" ||
      step5Phase === "done");

  const panelClass =
    "rotation-formula-panel" +
    (fs.panelVisible ? " is-visible" : "") +
    (fs.movedUp ? " is-moved-up" : "") +
    (fs.centered ? " is-centered" : "");

  const formulaBoxClass =
    "rfp-formula-box" +
    (fs.clickable ? " is-clickable" : "");

  return React.createElement(
    "div",
    { className: panelClass },
    React.createElement(
      "div",
      {
        className: formulaBoxClass,
        id: fs.clickable ? "rotation-formula-box" : undefined,
        onClick:
          fs.clickable && typeof onFormulaClick === "function"
            ? onFormulaClick
            : undefined,
        role: fs.clickable ? "button" : undefined,
      },
      fs.splitCoords ? renderSplitFormula() : renderLegacyFormula(),
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
                  disabled: mcqLocked,
                  onClick: () => {
                    if (!mcqLocked && typeof onStep5Select === "function") {
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
