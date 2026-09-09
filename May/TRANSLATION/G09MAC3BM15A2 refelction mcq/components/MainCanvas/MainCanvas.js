const MainCanvas = ({
  question,
  ruleStatus,
  ruleSelected,
  coordinateStatus,
  coordinateSelected,
  showCoordinateFeedback,
  onRuleSelect,
  onRuleAnimationDone,
  onCoordinateSelect,
  onCoordinateAnimationDone,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

  const [flyClone, setFlyClone] = useState(null);
  const [hintPaths, setHintPaths] = useState([]);
  const [hintLabelPositions, setHintLabelPositions] = useState({
    x: null,
    y: null,
  });

  const optionRefs = useRef({ rule: {}, coordinates: {} });
  const formulaAnswerRef = useRef(null);
  const coordinateAnswerRef = useRef(null);
  const formulaPanelRef = useRef(null);
  const noChangeRef = useRef(null);
  const signChangeRef = useRef(null);
  const formulaXLeftRef = useRef(null);
  const formulaXRightRef = useRef(null);
  const formulaYLeftRef = useRef(null);
  const formulaYRightRef = useRef(null);

  const ruleSolved = ruleStatus === "correct";
  const answerRowOpen = ruleStatus === "hold" || ruleStatus === "correct";
  const ruleRevealed = ruleStatus === "hold" || ruleStatus === "correct";
  const coordinateSolved = coordinateStatus === "correct";
  const coordinatePhaseActive = ruleStatus === "correct";
  const showHints = showCoordinateFeedback;
  const showConnectorHints = showHints && question.hints.type === "connectors";
  const showSwapHints = showHints && question.hints.type === "swap";

  const animateOptionToTarget = useCallback((group, index, targetRef, onDone) => {
    const sourceEl = optionRefs.current[group][index];
    const targetEl = targetRef.current;
    if (!sourceEl || !targetEl) {
      if (typeof onDone === "function") onDone();
      return;
    }

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const html = sourceEl.innerHTML.trim();
    const dx =
      targetRect.left + targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);
    const dy =
      targetRect.top + targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);

    setFlyClone({
      id: Date.now(),
      html: html,
      left: sourceRect.left + sourceRect.width / 2,
      top: sourceRect.top + sourceRect.height / 2,
      dx: dx,
      dy: dy,
      active: false,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlyClone((clone) => clone ? { ...clone, active: true } : clone);
      });
    });

    setTimeout(() => {
      setFlyClone(null);
      if (typeof onDone === "function") onDone();
    }, 780);
  }, []);

  useEffect(() => {
    if (ruleStatus !== "animating") return;
    animateOptionToTarget(
      "rule",
      question.ruleCorrectIndex,
      formulaAnswerRef,
      onRuleAnimationDone,
    );
  }, [question, ruleStatus, animateOptionToTarget, onRuleAnimationDone]);

  useEffect(() => {
    if (coordinateStatus !== "animating") return;
    animateOptionToTarget(
      "coordinates",
      question.coordinateCorrectIndex,
      coordinateAnswerRef,
      onCoordinateAnimationDone,
    );
  }, [question, coordinateStatus, animateOptionToTarget, onCoordinateAnimationDone]);

  useLayoutEffect(() => {
    const updateHintPaths = () => {
      if (!showConnectorHints || !formulaPanelRef.current) {
        setHintPaths([]);
        setHintLabelPositions({ x: null, y: null });
        return;
      }

      const panelRect = formulaPanelRef.current.getBoundingClientRect();
      const rectFor = (ref) => {
        if (!ref.current) return null;
        const rect = ref.current.getBoundingClientRect();
        return {
          left: rect.left - panelRect.left,
          right: rect.right - panelRect.left,
          top: rect.top - panelRect.top,
          bottom: rect.bottom - panelRect.top,
          width: rect.width,
          height: rect.height,
          centerX: rect.left - panelRect.left + rect.width / 2,
          centerY: rect.top - panelRect.top + rect.height / 2,
        };
      };

      const noChange = rectFor(noChangeRef);
      const signChange = rectFor(signChangeRef);
      const xLeft = rectFor(formulaXLeftRef);
      const xRight = rectFor(formulaXRightRef);
      const yLeft = rectFor(formulaYLeftRef);
      const yRight = rectFor(formulaYRightRef);
      const labelGap = panelRect.width * 0.012;

      const nextPaths = [];
      if (noChange && xLeft && xRight) {
        const xLabelCenter = (xLeft.centerX + xRight.centerX) / 2;
        const xLabelHalfWidth = noChange.width / 2;
        const topY = noChange.centerY;
        const xTargetY = xLeft.top;
        nextPaths.push({
          key: "x-left",
          color: "orange",
          d:
            "M " + (xLabelCenter - xLabelHalfWidth - labelGap) + " " + topY +
            " H " + xLeft.centerX +
            " V " + xTargetY,
        });
        nextPaths.push({
          key: "x-right",
          color: "orange",
          d:
            "M " + (xLabelCenter + xLabelHalfWidth + labelGap) + " " + topY +
            " H " + xRight.centerX +
            " V " + xTargetY,
        });
      }

      if (signChange && yLeft && yRight) {
        const yLabelCenter = (yLeft.centerX + yRight.centerX) / 2;
        const yLabelHalfWidth = signChange.width / 2;
        const bottomY = signChange.centerY;
        const yTargetY = yLeft.bottom;
        nextPaths.push({
          key: "y-left",
          color: "purple",
          d:
            "M " + (yLabelCenter - yLabelHalfWidth - labelGap) + " " + bottomY +
            " H " + yLeft.centerX +
            " V " + yTargetY,
        });
        nextPaths.push({
          key: "y-right",
          color: "purple",
          d:
            "M " + (yLabelCenter + yLabelHalfWidth + labelGap) + " " + bottomY +
            " H " + yRight.centerX +
            " V " + yTargetY,
        });
      }

      setHintLabelPositions({
        x: noChange && xLeft && xRight ? (xLeft.centerX + xRight.centerX) / 2 : null,
        y: signChange && yLeft && yRight ? (yLeft.centerX + yRight.centerX) / 2 : null,
      });
      setHintPaths(nextPaths);
    };

    updateHintPaths();
    window.addEventListener("resize", updateHintPaths);
    return () => window.removeEventListener("resize", updateHintPaths);
  }, [showConnectorHints]);

  const renderVariableToken = (variable, ref, colorClass) =>
    React.createElement(
      "span",
      {
        ref: ref,
        className:
          "math-var" + (showConnectorHints ? " " + colorClass : ""),
      },
      variable,
    );

  const renderRulePart = (part) => {
    const ref = part.variable === "x" ? formulaXRightRef : formulaYRightRef;
    const colorClass = part.variable === "x" ? "x-token" : "y-token";
    return React.createElement(
      React.Fragment,
      null,
      part.prefix || "",
      renderVariableToken(part.variable, ref, colorClass),
      part.suffix || "",
    );
  };

  const renderSymbolicFormula = () =>
    React.createElement(
      "div",
      { className: "formula-expression" },
      React.createElement(
        "span",
        { className: "formula-coordinate" },
        "(",
        renderVariableToken("x", formulaXLeftRef, "x-token"),
        ", ",
        renderVariableToken("y", formulaYLeftRef, "y-token"),
        ")",
      ),
      React.createElement("span", { className: "formula-arrow" }, "\u2192"),
      React.createElement(
        "span",
        { className: "formula-answer-slot", ref: formulaAnswerRef },
        React.createElement(
          "span",
          {
            className:
              "formula-coordinate formula-rhs" +
              (ruleRevealed ? " is-visible" : ""),
          },
          "(",
          renderRulePart(question.rule.first),
          ", ",
          renderRulePart(question.rule.second),
          ")",
        ),
        !ruleRevealed
          ? React.createElement("span", { className: "jump-question" }, "?")
          : null,
      ),
    );

  const renderCoordinateFormula = () =>
    React.createElement(
      "div",
      { className: "coordinate-expression" },
      React.createElement("span", { className: "formula-coordinate" }, question.point),
      React.createElement("span", { className: "formula-arrow" }, "\u2192"),
      React.createElement(
        "span",
        { className: "formula-answer-slot", ref: coordinateAnswerRef },
        React.createElement(
          "span",
          {
            className:
              "formula-coordinate formula-rhs" +
              (coordinateSolved ? " is-visible" : ""),
          },
          question.answer,
        ),
        !coordinateSolved
          ? React.createElement("span", { className: "jump-question" }, "?")
          : null,
      ),
    );

  const renderOptions = () => {
    const group = coordinatePhaseActive ? "coordinates" : "rule";
    const options = coordinatePhaseActive ? question.coordinateOptions : question.ruleOptions;
    const correctIndex = coordinatePhaseActive
      ? question.coordinateCorrectIndex
      : question.ruleCorrectIndex;
    const selectedIndex = coordinatePhaseActive ? coordinateSelected : ruleSelected;
    const status = coordinatePhaseActive ? coordinateStatus : ruleStatus;
    const disabled =
      status === "animating" ||
      status === "hold" ||
      status === "correct" ||
      (!coordinatePhaseActive && status === "wrong") ||
      (coordinatePhaseActive && ruleStatus !== "correct");

    return React.createElement(
      "div",
      { className: "reflection-options" },
      options.map((option, index) => {
        const isSelected = selectedIndex === index;
        const isCorrectSelection = isSelected && index === correctIndex;
        const isWrongSelection =
          isSelected &&
          index !== correctIndex &&
          (status === "wrong" ||
            status === "animating" ||
            status === "hold" ||
            status === "correct");

        let className = "reflection-option";
        if (isCorrectSelection && (status === "animating" || status === "hold" || status === "correct")) {
          className += " is-correct";
        }
        if (isWrongSelection) className += " is-wrong";

        return React.createElement("button", {
          key: group + "-" + index,
          className: className,
          disabled: disabled,
          ref: (el) => {
            optionRefs.current[group][index] = el;
          },
          onClick: () => {
            if (coordinatePhaseActive) onCoordinateSelect(index);
            else onRuleSelect(index);
          },
          dangerouslySetInnerHTML: { __html: formatMathVariables(option) },
        });
      }),
    );
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "reflection-left-column" },
        React.createElement(
          "div",
          { className: "reflection-rows" + (answerRowOpen ? " answer-open" : "") },
          React.createElement(
            "section",
            { className: "reflection-row formula-row", ref: formulaPanelRef },
            showConnectorHints
              ? React.createElement(
                  "svg",
                  { className: "hint-paths" },
                  hintPaths.map((path) =>
                    React.createElement("path", {
                      key: path.key,
                      className: "hint-path " + path.color,
                      d: path.d,
                      vectorEffect: "non-scaling-stroke",
                    }),
                  ),
                )
              : null,
            React.createElement("div", { className: "row-title" }, APP_DATA.labels.rule),
            showConnectorHints
              ? React.createElement(
                  "div",
                  {
                    className: "x-hint",
                    ref: noChangeRef,
                    style: hintLabelPositions.x === null ? null : { left: hintLabelPositions.x + "px" },
                  },
                  question.hints.x,
                )
              : null,
            showSwapHints
              ? React.createElement("div", { className: "swap-hint swap-hint-top" }, question.hints.top)
              : null,
            renderSymbolicFormula(),
            showConnectorHints
              ? React.createElement(
                  "div",
                  {
                    className: "y-hint",
                    ref: signChangeRef,
                    style: hintLabelPositions.y === null ? null : { left: hintLabelPositions.y + "px" },
                  },
                  question.hints.y,
                )
              : null,
            showSwapHints
              ? React.createElement("div", { className: "swap-hint swap-hint-bottom" }, question.hints.bottom)
              : null,
          ),
          React.createElement(
            "section",
            { className: "reflection-row answer-row" },
            React.createElement(
              "div",
              { className: "answer-row-inner" },
              React.createElement("div", { className: "row-title answer-title" }, APP_DATA.labels.coordinatesPrompt),
              renderCoordinateFormula(),
            ),
          ),
        ),
      ),
      React.createElement(
        "aside",
        { className: "reflection-right-column" },
        React.createElement(
          "div",
          { className: "mcq-title" },
          coordinatePhaseActive
            ? APP_DATA.labels.chooseCoordinate
            : APP_DATA.labels.chooseRule,
        ),
        coordinatePhaseActive
          ? showCoordinateFeedback
            ? React.createElement("div", {
                className: "reflection-feedback",
                dangerouslySetInnerHTML: {
                  __html: APP_DATA.feedback.coordinateWrong,
                },
              })
            : React.createElement("div", { className: "feedback-spacer" })
          : null,
        renderOptions(),
      ),
    ),
    flyClone
      ? React.createElement("div", {
          className: "reflection-fly-clone",
          style: {
            left: flyClone.left + "px",
            top: flyClone.top + "px",
            transform: flyClone.active
              ? "translate(calc(-50% + " + flyClone.dx + "px), calc(-50% + " + flyClone.dy + "px))"
              : "translate(-50%, -50%)",
          },
          dangerouslySetInnerHTML: { __html: flyClone.html },
        })
      : null,
  );
};
