const MathPanel = ({
  texts,
  equationVisible,
  equationCollapsed,
  line1Visible,
  line1Text,
  line2Visible,
  line2Text,
  equationParts,
  highlightVar,
  xClickable,
  equationClickable,
  onXClick,
  onYClick,
  onEquationClick,
  objectTitleVisible,
  objectRowHidden,
  objectPoints,
  onObjectPointClick,
  line3Visible,
  line3Hidden,
  line3PrefixVisible,
  line3VectorVisible,
  line3VectorInstant,
  imageTitleVisible,
  imagePoints,
  onImagePointClick,
  formulaVisible,
  formulaVarsYellow,
  formulaClickable,
  formulaGlow,
  formulaComplete,
  simplifyStep,
  simplifyAnimPhase,
  onFormulaClick,
  onFormulaSimplifyClick,
}) => {
  const line2Match = line2Text.match(/^(.*?)(\d+)\s*$/);
  const line2Prefix = line2Match ? line2Match[1] : line2Text;
  const line2Value = line2Match ? line2Match[2] : "0";

  const renderEquation = () => {
    if (!equationParts) return null;

    if (equationParts.mode === "simplified") {
      const leftClass =
        equationParts.left === "x" || equationParts.left === "y"
          ? "math-eq-part math-var"
          : "math-eq-part";
      return React.createElement(
        "span",
        { className: "math-eq-inner", id: "math-equation-box" },
        React.createElement(
          "span",
          { className: leftClass, id: "eq-part-y" },
          equationParts.left,
        ),
        React.createElement("span", null, " = "),
        React.createElement(
          "span",
          { className: "math-eq-part", id: "eq-part-two" },
          equationParts.right,
        ),
      );
    }

    const parts = [];

    const renderVar = (varName, id) => {
      if (highlightVar === varName) {
        const handler = varName === "x" ? onXClick : onYClick;
        const clickId =
          varName === "x" ? "math-x-highlight" : "math-y-highlight";
        return React.createElement(
          "span",
          {
            key: id,
            id: clickId,
            className: "math-var-highlight math-var",
            onClick: handler,
          },
          varName,
        );
      }
      return React.createElement(
        "span",
        { key: id, className: "math-eq-part math-var", id: id },
        varName,
      );
    };

    if (equationParts.left !== undefined) {
      if (equationParts.left === "x" || equationParts.left === "y") {
        parts.push(renderVar(equationParts.left, "eq-part-left"));
      } else {
        parts.push(
          React.createElement(
            "span",
            {
              key: "left",
              className:
                "math-eq-part" + (equationParts.fadeLeft ? " is-faded" : ""),
              id: "eq-part-left",
            },
            equationParts.left,
          ),
        );
      }
    }

    if (equationParts.showPlus) {
      parts.push(
        React.createElement(
          "span",
          {
            key: "plus",
            className:
              "math-eq-part" + (equationParts.fadePlus ? " is-faded" : ""),
            id: "eq-part-plus",
          },
          " + ",
        ),
      );
    }

    if (equationParts.middle !== undefined) {
      if (equationParts.middle === "x" || equationParts.middle === "y") {
        parts.push(renderVar(equationParts.middle, "eq-part-middle"));
      } else {
        parts.push(
          React.createElement(
            "span",
            {
              key: "middle",
              className:
                "math-eq-part" + (equationParts.fadeMiddle ? " is-faded" : ""),
              id: "eq-part-middle",
            },
            equationParts.middle,
          ),
        );
      }
    }

    parts.push(React.createElement("span", { key: "eq" }, " = "));

    parts.push(
      React.createElement(
        "span",
        {
          key: "right",
          className: "math-eq-part",
          id: "eq-part-two",
        },
        equationParts.right,
      ),
    );

    return React.createElement("span", { className: "math-eq-inner" }, parts);
  };

  const renderVarSub = (letter, num, yellow, id) =>
    React.createElement(
      "span",
      {
        className: "math-formula-var" + (yellow ? " is-yellow" : ""),
        id: id || undefined,
      },
      React.createElement("span", { className: "math-formula-italic" }, letter),
      num ? React.createElement("sub", null, num) : null,
    );

  const renderNum = (val, id) => {
    const text = String(val);
    if (/[xy]/.test(text)) {
      return React.createElement(
        "span",
        { id: id, className: "math-formula-num" },
        renderMathVars(text),
      );
    }
    return React.createElement(
      "span",
      { id: id, className: "math-formula-num" },
      val,
    );
  };

  const renderSubstituteBox = (oldContent, newContent, phase) => {
    const boxClass = "math-formula-highlight-box is-animating is-substituting";

    if (phase === "fade-out") {
      return React.createElement(
        "span",
        { id: "formula-highlight-box", className: boxClass },
        React.createElement(
          "span",
          { className: "math-formula-highlight-inner is-leaving" },
          oldContent,
        ),
      );
    }

    if (phase === "hold") {
      return React.createElement(
        "span",
        {
          id: "formula-highlight-box",
          className: boxClass + " is-held",
        },
        React.createElement(
          "span",
          { className: "math-formula-highlight-inner is-visible" },
          newContent,
        ),
      );
    }

    return React.createElement(
      "span",
      { id: "formula-highlight-box", className: boxClass },
      React.createElement(
        "span",
        { className: "math-formula-highlight-inner is-entering" },
        newContent,
      ),
    );
  };

  const renderHighlight = (content, active, innerAnim) => {
    if (!active && !innerAnim) return content;
    return React.createElement(
      "span",
      {
        id: "formula-highlight-box",
        className:
          "math-formula-highlight-box" + (innerAnim ? " is-animating" : ""),
        onClick: active ? onFormulaSimplifyClick : undefined,
      },
      React.createElement(
        "span",
        {
          className:
            "math-formula-highlight-inner" +
            (innerAnim === "fade-out" ? " is-fade-out" : "") +
            (innerAnim === "fade-in" ? " is-fade-in" : ""),
        },
        content,
      ),
    );
  };

  const hlSegment = (forStep, oldContent, newContent) => {
    const anim = simplifyAnimPhase;
    const step = simplifyStep;
    const showHL =
      anim === "idle" &&
      typeof onFormulaSimplifyClick === "function" &&
      step >= 0 &&
      step < 6;

    if (anim === "fade-out" && step === forStep) {
      return renderSubstituteBox(oldContent, newContent, "fade-out");
    }
    if (anim === "fade-in" && step === forStep) {
      return renderSubstituteBox(oldContent, newContent, "fade-in");
    }
    if (anim === "hold" && step === forStep) {
      return renderSubstituteBox(oldContent, newContent, "hold");
    }
    if (showHL && step === forStep) {
      return renderHighlight(oldContent, true, null);
    }
    if (step > forStep) {
      return newContent;
    }
    return oldContent;
  };

  const rhsNegXPlus2 = () =>
    React.createElement(
      "span",
      { className: "math-formula-eq-row" },
      renderNum("-x"),
      " + ",
      renderNum("2"),
    );

  const lhsYMinus3 = () =>
    React.createElement(
      "span",
      null,
      renderVarSub("y", "", false),
      " \u2212 ",
      renderNum("3"),
    );

  const rhsParenX2 = () =>
    renderParenMinus(renderVarSub("x", "", false), renderNum("2"), false);

  const distGroup = () =>
    React.createElement(
      "span",
      { className: "math-formula-dist-group" },
      renderNum("-1"),
      renderParenMinus(renderVarSub("x", "", false), renderNum("2"), false),
    );

  const rowY3EqNegX2 = () =>
    React.createElement(
      "span",
      { className: "math-formula-eq-row" },
      renderVarSub("y", "", false),
      " \u2212 ",
      renderNum("3"),
      " = ",
      renderNum("-x"),
      " + ",
      renderNum("2"),
    );

  const rowXYEq32 = () =>
    React.createElement(
      "span",
      { className: "math-formula-eq-row" },
      renderVarSub("x", "", false),
      " + ",
      renderVarSub("y", "", false),
      " = ",
      renderNum("3"),
      " + ",
      renderNum("2"),
    );

  const minusGroup34 = () =>
    React.createElement(
      "span",
      { className: "math-formula-minus-group" },
      renderNum("3"),
      " + ",
      renderNum("2"),
    );

  const renderMinusGroup = (left, right, highlight) =>
    React.createElement(
      "span",
      { className: "math-formula-minus-group" },
      left,
      " \u2212 ",
      right,
    );

  const renderParenMinus = (left, right, highlight) =>
    React.createElement(
      "span",
      { className: "math-formula-paren-group" },
      "(",
      renderMinusGroup(left, right, highlight),
      ")",
    );

  const renderFraction = (num, den) =>
    React.createElement(
      "span",
      { className: "math-formula-fraction" },
      React.createElement(
        "span",
        { className: "math-formula-fraction-num" },
        num,
      ),
      React.createElement("span", { className: "math-formula-fraction-bar" }),
      React.createElement(
        "span",
        { className: "math-formula-fraction-den" },
        den,
      ),
    );

  const renderFormula = () => {
    const anim = simplifyAnimPhase;
    const step = simplifyStep;

    if (simplifyStep < 0) {
      const yellow = formulaVarsYellow;
      return React.createElement(
        "span",
        { className: "math-formula-eq-inner" },
        renderVarSub("y", "", false),
        " \u2212 ",
        React.createElement(
          "span",
          { id: "formula-sub-y1" },
          renderVarSub("y", "1", yellow),
        ),
        " = ",
        renderFraction(
          React.createElement(
            "span",
            null,
            React.createElement(
              "span",
              { id: "formula-sub-y2" },
              renderVarSub("y", "2", yellow),
            ),
            " \u2212 ",
            React.createElement(
              "span",
              { id: "formula-sub-y1-frac" },
              renderVarSub("y", "1", yellow),
            ),
          ),
          React.createElement(
            "span",
            null,
            React.createElement(
              "span",
              { id: "formula-sub-x2" },
              renderVarSub("x", "2", yellow),
            ),
            " \u2212 ",
            React.createElement(
              "span",
              { id: "formula-sub-x1-den" },
              renderVarSub("x", "1", yellow),
            ),
          ),
        ),
        React.createElement(
          "span",
          { className: "math-formula-paren-group" },
          "(",
          renderVarSub("x", "", false),
          " \u2212 ",
          React.createElement(
            "span",
            { id: "formula-sub-x1-rhs" },
            renderVarSub("x", "1", yellow),
          ),
          ")",
        ),
      );
    }

    if (step >= 6) {
      return React.createElement(
        "span",
        { className: "math-formula-eq-inner math-formula-final" },
        renderVarSub("x", "", false),
        " + ",
        renderVarSub("y", "", false),
        " = ",
        renderNum("5"),
      );
    }

    if (step === 5) {
      return React.createElement(
        "span",
        { className: "math-formula-eq-inner" },
        renderVarSub("x", "", false),
        " + ",
        renderVarSub("y", "", false),
        " = ",
        hlSegment(5, minusGroup34(), renderNum("5")),
      );
    }

    if (step === 4 || (anim === "fade-in" && step === 4)) {
      return hlSegment(4, rowY3EqNegX2(), rowXYEq32());
    }

    if (step === 3) {
      const substituting =
        anim === "fade-out" || anim === "fade-in" || anim === "hold";
      if (substituting) {
        return React.createElement(
          "span",
          { className: "math-formula-eq-inner" },
          lhsYMinus3(),
          " = ",
          hlSegment(3, distGroup(), rhsNegXPlus2()),
        );
      }
      return React.createElement(
        "span",
        { className: "math-formula-eq-inner" },
        lhsYMinus3(),
        " = ",
        hlSegment(3, distGroup(), rowY3EqNegX2()),
      );
    }

    if (step === 2 || (anim === "fade-in" && step === 2)) {
      return React.createElement(
        "span",
        { className: "math-formula-eq-inner" },
        lhsYMinus3(),
        " = ",
        hlSegment(
          2,
          renderFraction(renderNum("-2"), renderNum("2")),
          distGroup(),
        ),
        anim === "fade-in" && step === 2 ? null : rhsParenX2(),
      );
    }

    if (step === 1 || (anim === "fade-in" && step === 1)) {
      return React.createElement(
        "span",
        { className: "math-formula-eq-inner" },
        lhsYMinus3(),
        " = ",
        renderFraction(
          renderNum("-2"),
          hlSegment(
            1,
            renderMinusGroup(renderNum("4"), renderNum("2"), false),
            renderNum("2"),
          ),
        ),
        rhsParenX2(),
      );
    }

    if (step === 0 || (anim === "fade-in" && step === 0)) {
      return React.createElement(
        "span",
        { className: "math-formula-eq-inner" },
        lhsYMinus3(),
        " = ",
        renderFraction(
          hlSegment(
            0,
            renderMinusGroup(renderNum("1"), renderNum("3"), false),
            renderNum("-2"),
          ),
          renderMinusGroup(renderNum("4"), renderNum("2"), false),
        ),
        rhsParenX2(),
      );
    }

    return React.createElement(
      "span",
      { className: "math-formula-eq-inner math-formula-final" },
      renderVarSub("x", "", false),
      " + ",
      renderVarSub("y", "", false),
      " = ",
      renderNum("5"),
    );
  };

  const parseCoordPair = (text) => {
    const match = String(text).match(/\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (match) return [match[1], match[2]];
    return ["0", "0"];
  };

  const renderCoordPair = (box, showContent) =>
    React.createElement(
      "span",
      {
        className:
          "math-coord-content" + (showContent ? "" : " is-placeholder"),
      },
      "(",
      React.createElement(
        "span",
        { id: box.id + "-d0" },
        parseCoordPair(box.text)[0],
      ),
      ", ",
      React.createElement(
        "span",
        { id: box.id + "-d1" },
        parseCoordPair(box.text)[1],
      ),
      ")",
    );

  const renderCoordContent = (box) => {
    if (box.mode === "named") {
      return React.createElement(
        "span",
        { className: "math-coord-content math-coord-named" },
        renderVarSub("x", box.pointNum, true),
        "=",
        React.createElement(
          "span",
          { id: box.id + "-x-val", className: "math-coord-val" },
          box.xVal,
        ),
        " , ",
        renderVarSub("y", box.pointNum, true),
        "=",
        React.createElement(
          "span",
          { id: box.id + "-y-val", className: "math-coord-val" },
          box.yVal,
        ),
      );
    }
    if (box.mode === "coords") {
      const showContent = box.contentVisible !== false && box.visible;
      return renderCoordPair(box, showContent);
    }
    if (box.mode === "calc") {
      return React.createElement(
        "span",
        {
          className:
            "math-coord-content" + (box.contentFading ? " is-fading" : ""),
        },
        "(",
        React.createElement(
          "span",
          { id: box.calcIds && box.calcIds[0] },
          box.calcLeft,
        ),
        React.createElement(
          "span",
          {
            id: box.calcIds && box.calcIds[1],
            className:
              "math-calc-purple" +
              (box.plus2Visible ? " is-visible" : "") +
              (box.plus2Instant ? " is-instant" : ""),
          },
          "+2",
        ),
        ", ",
        React.createElement(
          "span",
          { id: box.calcIds && box.calcIds[2] },
          box.calcRight,
        ),
        React.createElement(
          "span",
          {
            id: box.calcIds && box.calcIds[3],
            className:
              "math-calc-purple" +
              (box.plus1Visible ? " is-visible" : "") +
              (box.plus1Instant ? " is-instant" : ""),
          },
          "+1",
        ),
        ")",
      );
    }
    if (box.mode === "result") {
      return React.createElement(
        "span",
        {
          className:
            "math-coord-content" +
            (box.contentFading ? " is-fading" : "") +
            (box.resultVisible ? "" : ""),
          style: box.resultVisible ? undefined : { opacity: 0 },
        },
        box.text,
      );
    }
    if (box.mode === "empty") {
      const placeholderText = box.text || "(0, 0)";
      return renderCoordPair({ id: box.id, text: placeholderText }, false);
    }
    return "";
  };

  return React.createElement(
    "div",
    { className: "math-panel" },
    React.createElement(
      "div",
      {
        className:
          "math-equation-section" + (equationCollapsed ? " is-collapsed" : ""),
      },
      React.createElement(
        "div",
        {
          className: "math-line" + (line1Visible ? " is-visible" : ""),
          id: "math-line-1",
        },
        renderMathVars(line1Text),
      ),
      React.createElement(
        "div",
        {
          className:
            "math-line is-yellow" + (line2Visible ? " is-visible" : ""),
          id: "math-line-2",
        },
        line2Prefix ? renderMathVars(line2Prefix) : null,
        React.createElement("span", { id: "math-line2-val" }, line2Value),
      ),
      React.createElement(
        "div",
        {
          className:
            "math-equation-box" +
            (equationVisible ? " is-visible" : "") +
            (equationClickable ? " is-clickable" : ""),
          id: "math-equation-box",
          onClick: equationClickable ? onEquationClick : undefined,
        },
        renderEquation(),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "math-points-block" + (objectRowHidden ? " is-hidden" : ""),
        id: "math-object-block",
      },
      React.createElement(
        "div",
        {
          className:
            "math-points-title" + (objectTitleVisible ? " is-visible" : ""),
          id: "math-object-title",
        },
        texts.objectPointsTitle,
      ),
      React.createElement(
        "div",
        { className: "math-points-row" },
        objectPoints.map((box, i) =>
          React.createElement(
            "div",
            {
              key: box.id,
              id: box.id,
              className:
                "math-coord-box is-object" +
                (box.visible ? " is-visible" : "") +
                (box.clickable ? " is-clickable" : "") +
                (box.instant ? " is-instant" : ""),
              onClick: box.clickable ? () => onObjectPointClick(i) : undefined,
            },
            renderCoordContent(box),
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className:
          "math-line3" +
          (line3Visible ? " is-visible" : "") +
          (line3Hidden ? " is-hidden" : ""),
        id: "math-line-3",
      },
      line3PrefixVisible ? texts.line3Prefix + " " : "",
      React.createElement(
        "span",
        {
          id: "math-line3-vector",
          className:
            "math-line3-vector" +
            (line3VectorVisible ? " is-visible" : "") +
            (line3VectorInstant ? " is-instant" : ""),
        },
        "(",
        React.createElement(
          "span",
          { id: "math-fly-plus2", className: "math-fly-src" },
          "+2",
        ),
        ", ",
        React.createElement(
          "span",
          { id: "math-fly-plus1", className: "math-fly-src" },
          "+1",
        ),
        ")",
      ),
    ),
    React.createElement(
      "div",
      { className: "math-points-block", id: "math-image-block" },
      React.createElement(
        "div",
        {
          className:
            "math-points-title" + (imageTitleVisible ? " is-visible" : ""),
          id: "math-image-title",
        },
        texts.imagePointsTitle,
      ),
      React.createElement(
        "div",
        { className: "math-points-row" },
        imagePoints.map((box, i) =>
          React.createElement(
            "div",
            {
              key: box.id,
              id: box.id,
              className:
                "math-coord-box is-image" +
                (box.visible ? " is-visible" : "") +
                (box.clickable ? " is-clickable" : "") +
                (box.instant ? " is-instant" : ""),
              onClick: box.clickable ? () => onImagePointClick(i) : undefined,
            },
            renderCoordContent(box),
          ),
        ),
      ),
    ),
    formulaVisible
      ? React.createElement(
          "div",
          {
            className: "math-formula-section is-visible",
            id: "math-formula-section",
          },
          React.createElement(
            "div",
            { className: "math-formula-title", id: "math-formula-title" },
            formulaComplete
              ? texts.formulaTitleTranslated || texts.formulaTitle
              : texts.formulaTitle,
          ),
          React.createElement(
            "div",
            {
              className:
                "math-formula-box" +
                (formulaClickable ? " is-clickable" : "") +
                (formulaGlow ? " is-glow" : "") +
                (formulaComplete ? " is-complete" : ""),
              id: "math-formula-box",
              onClick: formulaClickable ? onFormulaClick : undefined,
            },
            React.createElement(
              "div",
              { className: "math-formula-eq" },
              renderFormula(),
            ),
          ),
        )
      : null,
  );
};
