const MainCanvas = ({
  step,
  question,
  questionIndex,
  totalQuestions,
  alignPhase,
  compareIndex,
  comparisonOperator,
  comparisonDone,
  feedbackText,
  showFeedbackBox,
  feedbackBoxCorrect,
  buttonsDisabled,
  leftOperatorValue,
  animatingSymbol,
  onDecimalBoxClick,
  onComparisonSelect,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef } = React;

  const sep = decimal[current_language] || ".";

  const comparisonBoxRef = useRef(null);
  const leftOperatorBoxRef = useRef(null);
  const cloneRef = useRef(null);

  const placeColorMap = {
    tens: { cell: "var(--blue-2)", header: "var(--blue-3)", comparison: "var(--blue-2)" },
    ones: { cell: "var(--pink-2)", header: "var(--pink-3)", comparison: "var(--pink-2)" },
    tenths: { cell: "var(--gold-2)", header: "var(--gold-3)", comparison: "var(--gold-2)" },
    hundredths: { cell: "var(--purple-2)", header: "var(--purple-3)", comparison: "var(--purple-2)" },
  };

  // Clone fly animation
  useLayoutEffect(() => {
    if (!animatingSymbol) return;
    if (!comparisonBoxRef.current || !leftOperatorBoxRef.current) return;

    const srcRect = comparisonBoxRef.current.getBoundingClientRect();
    const destRect = leftOperatorBoxRef.current.getBoundingClientRect();

    const gsapLib = typeof gsap !== "undefined" ? gsap : window.gsap;
    if (!gsapLib || !cloneRef.current) return;

    const startX = srcRect.left + srcRect.width / 2;
    const startY = srcRect.top + srcRect.height / 2;
    const endX = destRect.left + destRect.width / 2;
    const endY = destRect.top + destRect.height / 2;

    gsapLib.set(cloneRef.current, {
      left: startX,
      top: startY,
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
    });

    gsapLib.to(cloneRef.current, {
      left: endX,
      top: endY,
      duration: 0.7,
      ease: "power2.inOut",
    });
  }, [animatingSymbol]);

  // ========================
  //  RENDER DECIMAL BOX (left column)
  // ========================
  const renderDecimalBox = (numStr, boxIndex) => {
    const displayStr = formatDecimal(numStr);
    const chars = displayStr.split("");

    // Determine highlighting for step 3
    let highlightDigitIndex = null; // index in the chars array to highlight
    let dehighlightOthers = false;

    if (step === 3 && !comparisonDone) {
      dehighlightOthers = true;
      // Map compareIndex to char position in the display string
      const q = question;
      const place = q.places[compareIndex];
      // Find the position in display string
      const tableStr = boxIndex === 0 ? q.table1 : q.table2;
      // Count through table digits to find position
      let placeDigitPos = 0;
      let digitCount = 0;
      for (let i = 0; i < tableStr.length; i++) {
        if (tableStr[i] === ".") continue;
        if (digitCount === compareIndex) {
          placeDigitPos = i;
          break;
        }
        digitCount++;
      }
      // Map from table position to display position
      const origStr = numStr;
      const origParts = origStr.split(".");
      const tableParts = tableStr.split(".");
      const intOffset = tableParts[0].length - origParts[0].length;

      if (placeDigitPos < tableParts[0].length) {
        // Integer part
        const mappedPos = placeDigitPos - intOffset;
        if (mappedPos >= 0 && mappedPos < origParts[0].length) {
          highlightDigitIndex = mappedPos;
        }
      } else {
        // Decimal part (after the dot)
        const decPos = placeDigitPos - tableParts[0].length - 1; // position in decimal part
        highlightDigitIndex = origParts[0].length + 1 + decPos; // +1 for the dot
      }
    }

    // Highlight border for step 2
    let boxClass = "compare-decimal-box";
    if (step === 2) {
      if (alignPhase === 0 && boxIndex === 0) {
        boxClass += " decimal-box-highlighted";
      } else if (alignPhase === 1 && boxIndex === 1) {
        boxClass += " decimal-box-highlighted";
      }
    }

    const clickable = step === 2 && (
      (alignPhase === 0 && boxIndex === 0) ||
      (alignPhase === 1 && boxIndex === 1)
    );

    return React.createElement(
      "div",
      {
        className: boxClass,
        onClick: clickable ? () => onDecimalBoxClick(boxIndex) : undefined,
        style: clickable ? { cursor: "pointer" } : {},
      },
      ...chars.map((ch, i) => {
        const isDecimal = ch === "." || ch === ",";
        let spanClass = "decimal-digit";
        if (isDecimal) {
          spanClass += " decimal-char";
          if (ch === ",") spanClass += " cm";
        } else if (step === 3 && dehighlightOthers && !comparisonDone) {
          if (i === highlightDigitIndex) {
            spanClass += " digit-active";
          } else {
            spanClass += " digit-dimmed";
          }
        }
        return React.createElement("span", { key: i, className: spanClass }, ch);
      })
    );
  };

  // ========================
  //  RENDER OPERATOR BOX (left column)
  // ========================
  const renderLeftOperatorBox = () => {
    let boxClass = "left-operator-box";
    if (leftOperatorValue) {
      boxClass += " operator-box-correct";
    }

    return React.createElement(
      "div",
      {
        ref: leftOperatorBoxRef,
        className: boxClass,
      },
      leftOperatorValue || ""
    );
  };

  // ========================
  //  RENDER BIG TABLE (right column)
  // ========================
  const renderBigTable = () => {
    const q = question;
    const allColKeys = [];
    if (q.maxInt >= 2) allColKeys.push("tens");
    if (q.maxInt >= 1) allColKeys.push("ones");
    allColKeys.push("decimal");
    if (q.maxDec >= 1) allColKeys.push("tenths");
    if (q.maxDec >= 2) allColKeys.push("hundredths");



    const getGridCols = () => {
      const cols = [];
      if (q.maxInt >= 2) cols.push("1fr");
      if (q.maxInt >= 1) cols.push("1fr");
      cols.push("0.4fr");
      if (q.maxDec >= 1) cols.push("1fr");
      if (q.maxDec >= 2) cols.push("1fr");
      return cols.join(" ");
    };

    // Determine which columns are highlighted in step 3
    const getColHighlight = (key, colIdx) => {
      if (step !== 3 || comparisonDone) return "";
      if (key === "decimal") return "";
      // Find which non-decimal column index matches compareIndex
      let digitColIdx = 0;
      for (let k = 0; k < allColKeys.length; k++) {
        if (allColKeys[k] === "decimal") continue;
        if (allColKeys[k] === key) {
          if (digitColIdx === compareIndex) return " col-highlighted";
          else return " col-dimmed";
        }
        digitColIdx++;
      }
      return " col-dimmed";
    };

    // Heading row
    const headingRow = React.createElement(
      "div",
      {
        className: "big-table-heading-row",
        style: { gridTemplateColumns: getGridCols() },
      },
      ...allColKeys.map((key) => {
        if (key === "decimal")
          return React.createElement("div", {
            key: "heading-dec",
            className: "big-heading-cell big-heading-decimal",
          });
        const highlight = getColHighlight(key);
        return React.createElement(
          "div",
          {
            key: "heading-" + key,
            className: "big-heading-cell" + highlight,
            style: { backgroundColor: placeColorMap[key].header },
          },
          APP_DATA.placeHeadings[key]
        );
      })
    );

    // Arrow label
    const arrowLabel = alignPhase === 2 ? React.createElement(
      "div",
      { className: "table-arrow-label" },
      React.createElement("span", null, APP_DATA.tableArrowLabel),
      React.createElement("img", {
        src: "assets/thickArrow.svg",
        alt: "Compare",
        className: "thick-arrow-img",
      })
    ) : null;

    // Data rows
    const renderDataRow = (tableStr, rowIdx) => {
      const parts = tableStr.split(".");
      const intPart = parts[0];
      const decPart = parts[1] || "";

      const cells = [];
      let digitIdx = 0;
      for (let d = 0; d < intPart.length; d++) {
        const key = d === 0 && q.maxInt >= 2 ? "tens" : "ones";
        const highlight = getColHighlight(key);
        cells.push(
          React.createElement(
            "div",
            {
              key: "int-" + d,
              className: "big-digit-cell" + highlight,
              style: { backgroundColor: placeColorMap[key].cell },
            },
            intPart[d]
          )
        );
        digitIdx++;
      }
      cells.push(
        React.createElement(
          "div",
          {
            key: "dec-sep",
            className: "big-decimal-cell" + (current_language === "id" ? " cm" : ""),
          },
          sep
        )
      );
      for (let d = 0; d < decPart.length; d++) {
        const key = d === 0 ? "tenths" : "hundredths";
        const highlight = getColHighlight(key);
        cells.push(
          React.createElement(
            "div",
            {
              key: "dec-" + d,
              className: "big-digit-cell" + highlight,
              style: { backgroundColor: placeColorMap[key].cell },
            },
            decPart[d]
          )
        );
      }

      return React.createElement(
        "div",
        {
          key: "row-" + rowIdx,
          className: "big-table-row",
          style: { gridTemplateColumns: getGridCols() },
        },
        ...cells
      );
    };

    // Determine which rows to show based on alignment phase
    const showRow1 = step === 2 ? alignPhase >= 1 : true;
    const showRow2 = step === 2 ? alignPhase >= 2 : true;

    return React.createElement(
      "div",
      { className: "big-table-layout" },
      arrowLabel,
      headingRow,
      showRow1 ? renderDataRow(q.table1, 0) : null,
      showRow2 ? renderDataRow(q.table2, 1) : null
    );
  };

  // ========================
  //  RENDER COMPARISON ROW (below table in right column)
  // ========================
  const renderComparisonRow = () => {
    if (step !== 3) return null;

    const q = question;
    const place = q.places[compareIndex];
    const d1 = place.d1;
    const d2 = place.d2;

    // Determine correct operator for feedback
    let correctOp;
    if (d1 > d2) correctOp = ">";
    else if (d1 < d2) correctOp = "<";
    else correctOp = "=";

    const operatorBoxClass = "comparison-operator-box" +
      (comparisonOperator && comparisonOperator === correctOp ? " operator-box-correct" : "") +
      (comparisonOperator && comparisonOperator !== correctOp ? " operator-box-wrong" : "");

    const getButtonClass = (op) => {
      if (comparisonOperator !== op) return "operator-btn";
      if (comparisonOperator === correctOp) return "operator-btn operator-btn-correct";
      return "operator-btn operator-btn-wrong";
    };

    const currentPlaceColor = placeColorMap[place.name] ? placeColorMap[place.name].comparison : "rgba(80, 80, 100, 0.6)";

    return React.createElement(
      "div",
      { className: "comparison-row" },
      // Digit 1
      React.createElement(
        "div",
        {
          className: "comparison-digit-box",
          style: { backgroundColor: currentPlaceColor },
        },
        d1.toString()
      ),
      // Operator box
      React.createElement(
        "div",
        { className: "comparison-operator-wrapper" },
        React.createElement(
          "div",
          {
            ref: comparisonBoxRef,
            className: operatorBoxClass,
          },
          comparisonOperator || ""
        ),
        // Buttons strip
        !comparisonDone
          ? React.createElement(
              "div",
              {
                className: "buttons-strip" + (buttonsDisabled ? " buttons-strip-disabled" : ""),
              },
              React.createElement(
                "button",
                {
                  type: "button",
                  className: getButtonClass(">"),
                  onClick: () => onComparisonSelect(">"),
                  disabled: buttonsDisabled,
                },
                ">"
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: getButtonClass("="),
                  onClick: () => onComparisonSelect("="),
                  disabled: buttonsDisabled,
                },
                "="
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: getButtonClass("<"),
                  onClick: () => onComparisonSelect("<"),
                  disabled: buttonsDisabled,
                },
                "<"
              )
            )
          : null,
        // Feedback box
        showFeedbackBox && !comparisonDone
          ? React.createElement(
              "div",
              {
                className: "mini-feedback-box" + (feedbackBoxCorrect ? " mini-feedback-correct" : " mini-feedback-wrong"),
              },
              feedbackBoxCorrect ? APP_DATA.step3.feedbackAwesome : APP_DATA.step3.feedbackTryAgain
            )
          : null
      ),
      // Digit 2
      React.createElement(
        "div",
        {
          className: "comparison-digit-box",
          style: { backgroundColor: currentPlaceColor },
        },
        d2.toString()
      )
    );
  };

  // ========================
  //  RENDER TEXT ROW
  // ========================
  const renderTextRow = () => {
    if (!feedbackText) return React.createElement("div", { className: "text-row" });
    return React.createElement(
      "div",
      { className: "text-row" },
      React.createElement(
        "div",
        { className: "text-row-content" },
        feedbackText
      )
    );
  };

  // ========================
  //  FLYING CLONE
  // ========================
  const renderClone = () => {
    if (!animatingSymbol) return null;
    const q = question;
    const place = q.places[compareIndex];
    const d1 = place.d1;
    const d2 = place.d2;
    let correctOp;
    if (d1 > d2) correctOp = ">";
    else if (d1 < d2) correctOp = "<";
    else correctOp = "=";

    return ReactDOM.createPortal(
      React.createElement(
        "div",
        {
          ref: cloneRef,
          className: "operator-btn-clone",
        },
        correctOp
      ),
      document.body
    );
  };

  // ========================
  //  MAIN RENDER
  // ========================
  const showRightColumn = step >= 2;
  const showTable = step >= 2 && (step === 3 || alignPhase >= 1);
  const showComparisonRow = step === 3;

  return React.createElement(
    React.Fragment,
    null,
    renderClone(),
    React.createElement(
      "div",
      { className: "main-canvas-container compare-canvas" },
      // Main row (90%)
      React.createElement(
        "div",
        { className: "main-row" },
        // Left column (50%)
        React.createElement(
          "div",
          { className: "left-column" },
          React.createElement(
            "div",
            { className: "decimal-comparison-row" },
            renderDecimalBox(question.display1, 0),
            renderLeftOperatorBox(),
            renderDecimalBox(question.display2, 1)
          )
        ),
        // Right column (50%)
        React.createElement(
          "div",
          { className: "right-column" },
          showTable ? renderBigTable() : null,
          showComparisonRow ? renderComparisonRow() : null
        )
      ),
      // Text row (rest)
      renderTextRow()
    )
  );
};
