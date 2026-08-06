const MathPanel = ({
  texts,
  equationVisible,
  equationCollapsed,
  line1Visible,
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
  formulaVisible,
}) => {
  const line2Match = line2Text.match(/^(.*?)(\d+)\s*$/);
  const line2Prefix = line2Match ? line2Match[1] : line2Text;
  const line2Value = line2Match ? line2Match[2] : "0";

  const renderEquation = () => {
    if (!equationParts) return null;

    if (equationParts.mode === "simplified") {
      return React.createElement(
        "span",
        { className: "math-eq-inner", id: "math-equation-box" },
        React.createElement(
          "span",
          { className: "math-eq-part", id: "eq-part-y" },
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
        const clickId = varName === "x" ? "math-x-highlight" : "math-y-highlight";
        return React.createElement(
          "span",
          {
            key: id,
            id: clickId,
            className: "math-var-highlight",
            onClick: handler,
          },
          varName,
        );
      }
      return React.createElement(
        "span",
        { key: id, className: "math-eq-part", id: id },
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
                "math-eq-part" +
                (equationParts.fadeLeft ? " is-faded" : ""),
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
                "math-eq-part" +
                (equationParts.fadeMiddle ? " is-faded" : ""),
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

  const renderVarSub = (letter, num) =>
    React.createElement(
      "span",
      { className: "math-formula-var" },
      React.createElement("span", { className: "math-formula-italic" }, letter),
      React.createElement("sub", null, num),
    );

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
      React.createElement("span", { id: box.id + "-d0" }, parseCoordPair(box.text)[0]),
      ", ",
      React.createElement("span", { id: box.id + "-d1" }, parseCoordPair(box.text)[1]),
      ")",
    );

  const renderCoordContent = (box) => {
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
        React.createElement("span", { id: box.calcIds && box.calcIds[0] }, box.calcLeft),
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
        React.createElement("span", { id: box.calcIds && box.calcIds[2] }, box.calcRight),
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
      return renderCoordPair(
        { id: box.id, text: placeholderText },
        false,
      );
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
          "math-equation-section" +
          (equationCollapsed ? " is-collapsed" : ""),
      },
      React.createElement(
        "div",
        {
          className: "math-line" + (line1Visible ? " is-visible" : ""),
          id: "math-line-1",
        },
        texts.line1,
      ),
      React.createElement(
        "div",
        {
          className:
            "math-line is-yellow" + (line2Visible ? " is-visible" : ""),
          id: "math-line-2",
        },
        line2Prefix,
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
        className:
          "math-points-block" + (objectRowHidden ? " is-hidden" : ""),
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
              onClick: box.clickable
                ? () => onObjectPointClick(i)
                : undefined,
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
        imagePoints.map((box) =>
          React.createElement(
            "div",
            {
              key: box.id,
              id: box.id,
              className:
                "math-coord-box is-image" +
                (box.visible ? " is-visible" : "") +
                (box.instant ? " is-instant" : ""),
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
            { className: "math-formula-title" },
            texts.formulaTitle,
          ),
          React.createElement(
            "div",
            { className: "math-formula-box" },
            React.createElement(
              "div",
              { className: "math-formula-eq" },
              renderVarSub("y", ""),
              " \u2212 ",
              renderVarSub("y", "1"),
              " = ",
              React.createElement(
                "span",
                { className: "math-formula-fraction" },
                React.createElement(
                  "span",
                  { className: "math-formula-fraction-num" },
                  renderVarSub("y", "2"),
                  " \u2212 ",
                  renderVarSub("y", "1"),
                ),
                React.createElement("span", {
                  className: "math-formula-fraction-bar",
                }),
                React.createElement(
                  "span",
                  { className: "math-formula-fraction-den" },
                  renderVarSub("x", "2"),
                  " \u2212 ",
                  renderVarSub("x", "1"),
                ),
              ),
              "(",
              renderVarSub("x", ""),
              " \u2212 ",
              renderVarSub("x", "1"),
              ")",
            ),
          ),
        )
      : null,
  );
};
