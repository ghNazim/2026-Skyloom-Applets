const MainCanvas = ({
  step,
  question,
  questionIndex,
  totalQuestions,
  isCorrectCurrent,
  selectedRow,
  arrangement,
  feedbackType,
  showHint,
  isHintMode,
  hasSubmittedWrong,
  onRowClick,
  onSwap,
  onCheck,
  onHint,
  correctFeedbackText,
  wrongFeedbackText,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef } = React;
  const [hintPulse, setHintPulse] = useState(false);

  // Animation refs
  // Store DOM elements: { [num]: element }
  const rowRefs = useRef({});
  // Store previous positions: { [num]: { top, left } }
  const prevPosRef = useRef({});

  // Pulse hint button
  useEffect(() => {
    if (showHint && !isHintMode) {
      setHintPulse(true);
      const t = setTimeout(() => setHintPulse(false), 2000);
      return () => clearTimeout(t);
    }
  }, [showHint, questionIndex]);

  // Track previous question index to prevent animation on question change
  const prevQuestionIndex = useRef(questionIndex);

  // -- FLIP Animation Logic --
  useLayoutEffect(() => {
    const isNewQuestion = prevQuestionIndex.current !== questionIndex;
    
    // Current positions
    const currentPositions = {};
    const gsapLib = typeof gsap !== "undefined" ? gsap : window.gsap;

    // Measure new positions
    arrangement.forEach((num) => {
      const el = rowRefs.current[num];
      if (el) {
        const rect = el.getBoundingClientRect();
        currentPositions[num] = { top: rect.top, left: rect.left };
      }
    });

    // Animate only if not a new question (and not hint mode change arguably, but let's keep it simple)
    // Actually, hint mode change also re-renders. We probably shouldn't animate layout change.
    // But within hint mode, swapping works.
    if (gsapLib && !isNewQuestion) {
      arrangement.forEach((num) => {
        const el = rowRefs.current[num];
        const prev = prevPosRef.current[num];
        const current = currentPositions[num];

        if (el && prev && current) {
          const deltaX = prev.left - current.left;
          const deltaY = prev.top - current.top;

          // Only animate if there is a significant change
          if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
            gsapLib.fromTo(
              el,
              { x: deltaX, y: deltaY },
              { x: 0, y: 0, duration: 0.5, ease: "power2.out" }
            );
          }
        }
      });
    }

    // Update refs for next render
    prevPosRef.current = currentPositions;
    prevQuestionIndex.current = questionIndex;
    
    // Clear refs if switching question (technically already handled by creating new object above, 
    // but ensures we don't keep old keys)
    if (isNewQuestion) {
        // We just reset prevPosRef effectively by assigning currentPositions
    }
  }, [arrangement, isHintMode, questionIndex]); // add questionIndex dependency


  if (step !== 1) {
    return React.createElement("div", { className: "main-canvas-container order-canvas" });
  }

  const sep = decimal[current_language] || ".";

  // -------- Helpers --------
  const padNumber = (numStr, maxIntLen, maxDecLen) => {
    const parts = numStr.split(".");
    let intPart = parts[0];
    let decPart = parts[1] || "";
    while (intPart.length < maxIntLen) intPart = "0" + intPart;
    while (decPart.length < maxDecLen) decPart = decPart + "0";
    return { intPart, decPart };
  };

  const getHeadings = (maxIntLen, maxDecLen) => {
    const h = APP_DATA.placeHeadings;
    const intHeadings = [];
    if (maxIntLen >= 2) intHeadings.push(h.tens);
    if (maxIntLen >= 1) intHeadings.push(h.ones);
    const decHeadings = [];
    if (maxDecLen >= 1) decHeadings.push(h.tenths);
    if (maxDecLen >= 2) decHeadings.push(h.hundredths);
    return { intHeadings, decHeadings };
  };

  const colColors = {
    tens: { bg: "rgba(186, 104, 120, 0.6)", border: "#d4728a" },
    ones: { bg: "rgba(186, 104, 120, 0.6)", border: "#d4728a" },
    tenths: { bg: "rgba(160, 140, 80, 0.6)", border: "#c4b44c" },
    hundredths: { bg: "rgba(128, 80, 168, 0.6)", border: "#a060d0" },
  };



  const maxIntLen = Math.max(
    ...arrangement.map((n) => n.toString().split(".")[0].length)
  );
  const maxDecLen = Math.max(
    ...arrangement.map((n) => {
      const parts = n.toString().split(".");
      return parts[1] ? parts[1].length : 0;
    })
  );

  const getRowFeedbackClass = () => {
    if (feedbackType === "correct") return " row-correct";
    if (feedbackType === "wrong") return " row-wrong";
    return "";
  };

  // ============================================
  //  SMALL TABLE LAYOUT
  // ============================================
  const renderSmallTable = () => {
    return React.createElement(
      "div",
      { className: "small-table-layout" },
      arrangement.map((num, i) => {
        const isSelected = selectedRow === i;
        const numStr = num.toString();
        const chars = numStr.split("");
        const rowClass =
          "small-number-card" +
          (isSelected ? " row-selected" : "") +
          (isCorrectCurrent ? " row-no-click" : "") +
          getRowFeedbackClass();

        return React.createElement(
          "div",
          {
            key: num, // Unique key for animation
            className: "small-row-wrapper",
            ref: (el) => (rowRefs.current[num] = el), // Ref for animation
          },
          // Swap button on LEFT
          selectedRow !== null &&
            selectedRow !== i &&
            !isCorrectCurrent
            ? React.createElement(
                "button",
                {
                  className: "swap-btn swap-btn-left",
                  onClick: (e) => {
                    e.stopPropagation();
                    onSwap(i);
                  },
                },
                APP_DATA.placeHereBtn
              )
            : null,
          React.createElement(
            "div",
            {
              className: rowClass,
              onClick: () => onRowClick(i),
            },
            chars.map((ch, ci) => {
              const isDecChar = ch === ".";
              const displayChar = isDecChar ? sep : ch;
              return React.createElement(
                "span",
                {
                  key: ci,
                  className:
                    "small-digit" +
                    (isDecChar ? " small-decimal-char" : "") +
                    (isDecChar && current_language === "id" ? " cm" : ""),
                },
                displayChar
              );
            })
          )
        );
      })
    );
  };

  // ============================================
  //  BIG TABLE LAYOUT
  // ============================================
  const renderBigTable = () => {
    const allColKeys = [];
    if (maxIntLen >= 2) allColKeys.push("tens");
    if (maxIntLen >= 1) allColKeys.push("ones");
    allColKeys.push("decimal");
    if (maxDecLen >= 1) allColKeys.push("tenths");
    if (maxDecLen >= 2) allColKeys.push("hundredths");

    const getGridCols = () => {
      const cols = [];
      if (maxIntLen >= 2) cols.push("1fr");
      if (maxIntLen >= 1) cols.push("1fr");
      cols.push("0.4fr");
      if (maxDecLen >= 1) cols.push("1fr");
      if (maxDecLen >= 2) cols.push("1fr");
      return cols.join(" ");
    };

    const headingRow = React.createElement(
      "div",
      { className: "big-table-heading-row", style: { gridTemplateColumns: getGridCols() } },
      allColKeys.map((key, ci) => {
        if (key === "decimal")
          return React.createElement("div", {
            key: "heading-dec",
            className: "big-heading-cell big-heading-decimal",
          });
        return React.createElement(
          "div",
          {
            key: "heading-" + key,
            className: "big-heading-cell",
            style: { backgroundColor: colColors[key].bg },
          },
          APP_DATA.placeHeadings[key]
        );
      })
    );

    const dataRows = arrangement.map((num, rowIdx) => {
      const numStr = num.toString();
      const { intPart, decPart } = padNumber(numStr, maxIntLen, maxDecLen);
      const isSelected = selectedRow === rowIdx;
      const rowClass =
        "big-table-row" +
        (isSelected ? " row-selected" : "") +
        (isCorrectCurrent ? " row-no-click" : "") +
        getRowFeedbackClass();

      const cells = [];
      for (let d = 0; d < intPart.length; d++) {
        const key = d === 0 && maxIntLen >= 2 ? "tens" : "ones";
        cells.push(
          React.createElement(
            "div",
            {
              key: "int-" + d,
              className: "big-digit-cell",
              style: { backgroundColor: colColors[key].bg },
            },
            intPart[d]
          )
        );
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
        cells.push(
          React.createElement(
            "div",
            {
              key: "dec-" + d,
              className: "big-digit-cell",
              style: { backgroundColor: colColors[key].bg },
            },
            decPart[d]
          )
        );
      }

      return React.createElement(
        "div",
        {
          key: num, // Unique key for animation
          className: "big-row-wrapper",
          ref: (el) => (rowRefs.current[num] = el), // Ref
        },
        // Swap button on LEFT
        selectedRow !== null &&
          selectedRow !== rowIdx &&
          !isCorrectCurrent
          ? React.createElement(
              "button",
              {
                className: "swap-btn swap-btn-left",
                onClick: (e) => {
                  e.stopPropagation();
                  onSwap(rowIdx);
                },
              },
              APP_DATA.placeHereBtn
            )
          : null,
        React.createElement(
          "div",
          {
            className: rowClass,
            onClick: () => onRowClick(rowIdx),
            style: { gridTemplateColumns: getGridCols() },
          },
          ...cells
        )
      );
    });

    return React.createElement(
      "div",
      { className: "big-table-layout" },
      headingRow,
      ...dataRows
    );
  };

  const renderFeedback = () => {
    if (!feedbackType) return React.createElement("div", { className: "feedback-box-empty" });
    const fbClass =
      "feedback-box" +
      (feedbackType === "correct" ? " feedback-correct" : "") +
      (feedbackType === "wrong" ? " feedback-wrong" : "");
    const text = feedbackType === "correct" ? correctFeedbackText : wrongFeedbackText;
    return React.createElement(
      "div",
      { className: fbClass },
      React.createElement("span", { className: "feedback-text" }, text)
    );
  };

  const renderActionColumn = () => {
    return React.createElement(
      "div",
      { className: "action-column" },
      renderFeedback(),
      showHint && !isHintMode
        ? React.createElement(
            "button",
            {
              className: "hint-btn" + (hintPulse ? " hint-pulse" : ""),
              onClick: onHint,
            },
            React.createElement("img", {
              src: "assets/hint.png",
              alt: "Hint",
              className: "hint-img",
            })
          )
        : null,
      React.createElement(
        "button",
        {
          className: "check-btn",
          onClick: onCheck,
          disabled: isCorrectCurrent,
        },
        APP_DATA.checkBtn
      )
    );
  };

  const renderOrderingIndicator = () => {
    const isS2L = question.arrangement === "s2l";
    const topLabel = isS2L ? APP_DATA.labels.smallest : APP_DATA.labels.largest;
    const bottomLabel = isS2L ? APP_DATA.labels.largest : APP_DATA.labels.smallest;
    const pointsS2L = "50,0 100,400 0,400";
    const pointsL2S = "0,0 100,0 50,400";
    const points = isS2L ? pointsS2L : pointsL2S;

    return React.createElement(
      "div",
      { className: "ordering-indicator" },
      React.createElement("div", { className: "indicator-label top" }, topLabel),
      React.createElement(
        "svg",
        {
          className: "indicator-triangle",
          viewBox: "0 0 100 400",
          preserveAspectRatio: "none",
        },
        React.createElement("polygon", { points: points, fill: "#fdd835" })
      ),
      React.createElement("div", { className: "indicator-label bottom" }, bottomLabel)
    );
  };

  const renderVisualColumn = () => {
    return React.createElement(
      "div",
      { className: "visual-column" },
      React.createElement(
        "div",
        { className: "visual-table-area" }, // Padding handling in CSS
        isHintMode ? renderBigTable() : renderSmallTable()
      ),
      React.createElement(
        "div",
        { className: "visual-indicator-area" },
        renderOrderingIndicator()
      )
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container order-canvas" },
    renderVisualColumn(),
    renderActionColumn()
  );
};
