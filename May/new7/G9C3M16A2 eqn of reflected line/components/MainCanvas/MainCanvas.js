const MainCanvas = ({
  currentStep,
  stepOnePhase,
  ruleStatus,
  ruleSelected,
  pointStatuses,
  pointSelected,
  showCoordinateFeedback,
  substitutionStarted,
  substitutionPhase,
  substitutionDone,
  simplifyStatus,
  simplifySelected,
  onRuleSelect,
  onRuleAnimationDone,
  onPointSelect,
  onPointAnimationDone,
  onSubstitute,
  onSubstitutionPhaseChange,
  onSubstitutionDone,
  onSimplifySelect,
  stepTwoEntrySources,
}) => {
  const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

  const [flyClones, setFlyClones] = useState([]);
  const [hintPaths, setHintPaths] = useState([]);
  const [hintLabelPositions, setHintLabelPositions] = useState({ x: null, y: null });
  const [entryCoordinatesVisible, setEntryCoordinatesVisible] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState("substitute");
  const optionRefs = useRef({ rule: {}, A: {}, B: {}, simplify: {} });
  const ruleTargetRef = useRef(null);
  const pointTargetRefs = useRef({ A: null, B: null });
  const coordRefs = useRef({});
  const substRefs = useRef({});
  const formulaPanelRef = useRef(null);
  const hintRefs = useRef({});
  const equationCoordinateLineRef = useRef(null);
  const substitutionTimersRef = useRef([]);
  const substitutionStartedRef = useRef(false);
  const stepTwoEntryStartedRef = useRef(false);

  const points = APP_DATA.problem.points;
  const pointA = points[0];
  const pointB = points[1];

  const setPointTargetRef = (key, el) => {
    pointTargetRefs.current[key] = el;
  };

  const setCoordRef = (key, el) => {
    coordRefs.current[key] = el;
  };

  const setSubstRef = (key, el) => {
    substRefs.current[key] = el;
  };

  const clearFlyClones = useCallback(() => {
    setFlyClones([]);
  }, []);

  const flyFromElementToTarget = useCallback((sourceEl, targetEl, html, className, onDone) => {
    if (!sourceEl || !targetEl) {
      if (typeof onDone === "function") onDone();
      return;
    }

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const dx =
      targetRect.left + targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);
    const dy =
      targetRect.top + targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);

    setFlyClones((clones) =>
      clones.concat({
        id: id,
        html: html || sourceEl.innerHTML.trim(),
        className: className || "",
        left: sourceRect.left + sourceRect.width / 2,
        top: sourceRect.top + sourceRect.height / 2,
        dx: dx,
        dy: dy,
        active: false,
      }),
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlyClones((clones) =>
          clones.map((clone) =>
            clone.id === id ? { ...clone, active: true } : clone,
          ),
        );
      });
    });

    setTimeout(() => {
      setFlyClones((clones) => clones.filter((clone) => clone.id !== id));
      if (typeof onDone === "function") onDone();
    }, 780);
  }, []);

  const flyFromPointToTarget = useCallback((source, targetEl, className, onDone) => {
    if (!source || !targetEl) {
      if (typeof onDone === "function") onDone();
      return;
    }

    const targetRect = targetEl.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const dx = targetRect.left + targetRect.width / 2 - source.left;
    const dy = targetRect.top + targetRect.height / 2 - source.top;

    setFlyClones((clones) =>
      clones.concat({
        id: id,
        html: source.html,
        className: className || "",
        left: source.left,
        top: source.top,
        dx: dx,
        dy: dy,
        active: false,
      }),
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlyClones((clones) =>
          clones.map((clone) =>
            clone.id === id ? { ...clone, active: true } : clone,
          ),
        );
      });
    });

    setTimeout(() => {
      setFlyClones((clones) => clones.filter((clone) => clone.id !== id));
      if (typeof onDone === "function") onDone();
    }, 900);
  }, []);

  const animateOptionToTarget = useCallback((group, index, targetEl, onDone) => {
    flyFromElementToTarget(optionRefs.current[group][index], targetEl, null, "", onDone);
  }, [flyFromElementToTarget]);

  useEffect(() => {
    if (ruleStatus !== "animating") return;
    animateOptionToTarget(
      "rule",
      APP_DATA.problem.ruleCorrectIndex,
      ruleTargetRef.current,
      onRuleAnimationDone,
    );
  }, [ruleStatus, animateOptionToTarget, onRuleAnimationDone]);

  useEffect(() => {
    points.forEach((point) => {
      if (pointStatuses[point.key] !== "animating") return;
      animateOptionToTarget(
        point.key,
        point.correctIndex,
        pointTargetRefs.current[point.key],
        () => onPointAnimationDone(point.key),
      );
    });
  }, [pointStatuses, points, animateOptionToTarget, onPointAnimationDone]);

  useEffect(() => {
    return () => {
      substitutionTimersRef.current.forEach((timer) => clearTimeout(timer));
      substitutionTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!substitutionStarted || substitutionStartedRef.current) return;
    substitutionStartedRef.current = true;
    setRightPanelMode("substitute");

    const run = (delay, fn) => {
      const timer = setTimeout(fn, delay);
      substitutionTimersRef.current.push(timer);
    };

    run(320, () => {
      flyFromElementToTarget(coordRefs.current.x1, substRefs.current.x1Top, pointA.xHtml, "x-one", null);
      flyFromElementToTarget(coordRefs.current.x1, substRefs.current.x1Bottom, pointA.xHtml, "x-one", null);
      flyFromElementToTarget(coordRefs.current.x2, substRefs.current.x2Bottom, pointB.xHtml, "x-two", null);
    });
    run(1120, () => onSubstitutionPhaseChange(2));
    run(1900, () => onSubstitutionPhaseChange(3));
    run(2700, () => onSubstitutionPhaseChange(4));
    run(3500, () => onSubstitutionPhaseChange(5));
    run(4350, () => onSubstitutionPhaseChange(6));
    run(5050, () => {
      onSubstitutionPhaseChange(7);
      flyFromElementToTarget(coordRefs.current.y1, substRefs.current.y1Top, pointA.yHtml, "y-one", null);
      flyFromElementToTarget(coordRefs.current.y1, substRefs.current.y1Bottom, pointA.yHtml, "y-one", null);
      flyFromElementToTarget(coordRefs.current.y2, substRefs.current.y2Bottom, pointB.yHtml, "y-two", null);
    });
    run(5850, () => onSubstitutionPhaseChange(8));
    run(6650, () => onSubstitutionPhaseChange(9));
    run(7450, () => onSubstitutionPhaseChange(10));
    run(8250, () => onSubstitutionPhaseChange(11));
    run(9000, () => {
      setRightPanelMode("simplify");
    });
    run(9300, () => {
      onSubstitutionPhaseChange(12);
      onSubstitutionDone();
      clearFlyClones();
    });
  }, [
    substitutionStarted,
    pointA,
    pointB,
    flyFromElementToTarget,
    onSubstitutionPhaseChange,
    onSubstitutionDone,
    clearFlyClones,
  ]);

  useEffect(() => {
    if (currentStep !== 2 || stepTwoEntryStartedRef.current) return;
    stepTwoEntryStartedRef.current = true;
    setEntryCoordinatesVisible(!stepTwoEntrySources || stepTwoEntrySources.length < 2);
    setRightPanelMode("substitute");

    const timer = setTimeout(() => {
      if (stepTwoEntrySources && stepTwoEntrySources.length >= 2 && equationCoordinateLineRef.current) {
        flyFromPointToTarget(
          stepTwoEntrySources[0],
          equationCoordinateLineRef.current.querySelector("[data-entry-target='A']"),
          "coordinate-entry",
          null,
        );
        flyFromPointToTarget(
          stepTwoEntrySources[1],
          equationCoordinateLineRef.current.querySelector("[data-entry-target='B']"),
          "coordinate-entry",
          () => setEntryCoordinatesVisible(true),
        );
      } else {
        setEntryCoordinatesVisible(true);
      }
    }, 260);

    return () => clearTimeout(timer);
  }, [currentStep, stepTwoEntrySources, flyFromPointToTarget]);

  useEffect(() => {
    if (currentStep !== 2) {
      substitutionTimersRef.current.forEach((timer) => clearTimeout(timer));
      substitutionTimersRef.current = [];
      stepTwoEntryStartedRef.current = false;
      setEntryCoordinatesVisible(false);
      substitutionStartedRef.current = false;
      setRightPanelMode("substitute");
    }
  }, [currentStep]);

  useLayoutEffect(() => {
    const updateHintPaths = () => {
      if (!showCoordinateFeedback || !formulaPanelRef.current) {
        setHintPaths([]);
        setHintLabelPositions({ x: null, y: null });
        return;
      }

      const panelRect = formulaPanelRef.current.getBoundingClientRect();
      const rectFor = (key) => {
        const el = hintRefs.current[key];
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          centerX: rect.left - panelRect.left + rect.width / 2,
          centerY: rect.top - panelRect.top + rect.height / 2,
          top: rect.top - panelRect.top,
          bottom: rect.bottom - panelRect.top,
          width: rect.width,
        };
      };

      const xL = rectFor("xLeft");
      const xR = rectFor("xRight");
      const yL = rectFor("yLeft");
      const yR = rectFor("yRight");
      if (!xL || !xR || !yL || !yR) return;

      const xCenter = (xL.centerX + xR.centerX) / 2;
      const yCenter = (yL.centerX + yR.centerX) / 2;
      const xTextY = Math.min(panelRect.height - 38, Math.max(xL.bottom, xR.bottom) + panelRect.height * 0.2);
      const yTextY = Math.max(48, Math.min(yL.top, yR.top) - panelRect.height * 0.16);

      setHintLabelPositions({
        x: { left: xCenter, top: xTextY },
        y: { left: yCenter, top: yTextY },
      });
      setHintPaths([
        {
          key: "x-left",
          color: "orange",
          d: "M " + (xCenter - 4.5 * panelRect.width / 100) + " " + xTextY + " C " + xL.centerX + " " + xTextY + " " + xL.centerX + " " + (xL.bottom + 18) + " " + xL.centerX + " " + xL.bottom,
        },
        {
          key: "x-right",
          color: "orange",
          d: "M " + (xCenter + 4.5 * panelRect.width / 100) + " " + xTextY + " C " + xR.centerX + " " + xTextY + " " + xR.centerX + " " + (xR.bottom + 18) + " " + xR.centerX + " " + xR.bottom,
        },
        {
          key: "y-left",
          color: "purple",
          d: "M " + (yCenter - 4.5 * panelRect.width / 100) + " " + yTextY + " C " + yL.centerX + " " + yTextY + " " + yL.centerX + " " + (yL.top - 18) + " " + yL.centerX + " " + yL.top,
        },
        {
          key: "y-right",
          color: "purple",
          d: "M " + (yCenter + 4.5 * panelRect.width / 100) + " " + yTextY + " C " + yR.centerX + " " + yTextY + " " + yR.centerX + " " + (yR.top - 18) + " " + yR.centerX + " " + yR.top,
        },
      ]);
    };

    updateHintPaths();
    window.addEventListener("resize", updateHintPaths);
    return () => window.removeEventListener("resize", updateHintPaths);
  }, [showCoordinateFeedback, ruleStatus, stepOnePhase]);

  const htmlSpan = (className, html, extraProps) =>
    React.createElement("span", {
      ...(extraProps || {}),
      className: className,
      dangerouslySetInnerHTML: { __html: formatMathVariablesInHtml(html) },
    });

  const renderRuleFormula = () =>
    React.createElement(
      "div",
      { className: "rule-expression" },
      React.createElement(
        "span",
        { className: "formula-coordinate" },
        "(",
        htmlSpan("math-var", "x", { ref: (el) => { hintRefs.current.xLeft = el; } }),
        ", ",
        htmlSpan("math-var", "y", { ref: (el) => { hintRefs.current.yLeft = el; } }),
        ")",
      ),
      React.createElement("span", { className: "formula-arrow" }, "\u2192"),
      React.createElement(
        "span",
        { className: "formula-answer-slot", ref: ruleTargetRef },
        ruleStatus === "correct"
          ? React.createElement(
              "span",
              { className: "formula-coordinate formula-rhs is-visible" },
              "(",
              htmlSpan("math-var", "&minus;x", { ref: (el) => { hintRefs.current.xRight = el; } }),
              ", ",
              htmlSpan("math-var", "y", { ref: (el) => { hintRefs.current.yRight = el; } }),
              ")",
            )
          : React.createElement("span", { className: "jump-question" }, "?"),
      ),
    );

  const renderPointExpression = (point, active) => {
    const solved = pointStatuses[point.key] === "correct";
    return React.createElement(
      "div",
      {
        className:
          "point-expression" +
          (active ? " is-active" : " is-muted") +
          (solved ? " is-solved" : ""),
      },
      htmlSpan("point-source", point.pointHtml),
      React.createElement("span", { className: "formula-arrow" }, "\u2192"),
      React.createElement(
        "span",
        {
          className: "point-answer-slot",
          ref: (el) => setPointTargetRef(point.key, el),
        },
        solved
          ? htmlSpan("point-answer is-visible", point.answerHtml)
          : React.createElement(
              "span",
              { className: "point-answer-placeholder" },
              htmlSpan("", point.imageLabel + "("),
              React.createElement("span", { className: "jump-question inline" }, "?"),
              React.createElement("span", null, ", "),
              React.createElement("span", { className: "jump-question inline" }, "?"),
              React.createElement("span", null, ")"),
            ),
      ),
    );
  };

  const renderOptions = (group, options, correctIndex, selectedIndex, status, onSelect) =>
    React.createElement(
      "div",
      { className: "reflection-options" },
      options.map((option, index) => {
        const isSelected = selectedIndex === index;
        const isCorrectSelection = isSelected && index === correctIndex;
        const isWrongSelection = isSelected && index !== correctIndex && status === "wrong";
        let className = "reflection-option";
        if (isCorrectSelection && (status === "animating" || status === "correct")) {
          className += " is-correct";
        }
        if (isWrongSelection) className += " is-wrong";

        return React.createElement("button", {
          key: group + "-" + index,
          className: className,
          disabled: status === "animating" || status === "correct",
          ref: (el) => {
            optionRefs.current[group][index] = el;
          },
          onClick: () => onSelect(index),
          dangerouslySetInnerHTML: { __html: formatMathVariablesInHtml(option) },
        });
      }),
    );

  const getStepOneOptions = () => {
    if (stepOnePhase === "rule") {
      return {
        group: "rule",
        options: APP_DATA.ruleOptions,
        correctIndex: APP_DATA.problem.ruleCorrectIndex,
        selectedIndex: ruleSelected,
        status: ruleStatus,
        onSelect: onRuleSelect,
      };
    }

    const activePoint = stepOnePhase === "pointB" ? pointB : pointA;
    return {
      group: activePoint.key,
      options: activePoint.options,
      correctIndex: activePoint.correctIndex,
      selectedIndex: pointSelected[activePoint.key],
      status: pointStatuses[activePoint.key],
      onSelect: (index) => onPointSelect(activePoint.key, index),
    };
  };

  const renderStepOne = () => {
    const options = getStepOneOptions();
    const showRuleHints = showCoordinateFeedback;
    const activePointKey = stepOnePhase === "pointB" ? "B" : "A";

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "reflection-left-column" },
        React.createElement(
          "div",
          {
            className:
              "reflection-rows line-setup" +
              (ruleStatus === "correct" ? " answer-open" : ""),
          },
          React.createElement(
            "section",
            { className: "reflection-row formula-row compact-rule-row", ref: formulaPanelRef },
            showRuleHints
              ? React.createElement(
                  "svg",
                  { className: "hint-paths" },
                  hintPaths.map((path) =>
                    React.createElement("path", {
                      key: path.key,
                      className: "hint-path " + path.color,
                      d: path.d,
                      pathLength: 1,
                      vectorEffect: "non-scaling-stroke",
                    }),
                  ),
                )
              : null,
            showRuleHints
              ? React.createElement(
                  "div",
                  {
                    className: "x-hint",
                    style: hintLabelPositions.x === null
                      ? null
                      : {
                          left: hintLabelPositions.x.left + "px",
                          top: hintLabelPositions.x.top + "px",
                        },
                  },
                  APP_DATA.hints.signChanges,
                )
              : null,
            showRuleHints
              ? React.createElement(
                  "div",
                  {
                    className: "y-hint",
                    style: hintLabelPositions.y === null
                      ? null
                      : {
                          left: hintLabelPositions.y.left + "px",
                          top: hintLabelPositions.y.top + "px",
                        },
                  },
                  APP_DATA.hints.noChange,
                )
              : null,
            React.createElement("div", {
              className: "row-title rule-question-title",
              dangerouslySetInnerHTML: { __html: formatMathVariablesInHtml(APP_DATA.labels.ruleQuestion) },
            }),
            renderRuleFormula(),
          ),
          React.createElement(
            "section",
            { className: "reflection-row answer-row tall-answer-row" },
            React.createElement(
              "div",
              { className: "answer-row-inner" },
              React.createElement(
                "div",
                {
                  className: "row-title answer-title",
                  dangerouslySetInnerHTML: {
                    __html: stepOnePhase === "done"
                      ? APP_DATA.labels.coordinatesReady
                      : APP_DATA.labels.coordinatePrompt,
                  },
                },
              ),
              React.createElement(
                "div",
                { className: "point-expression-list" },
                renderPointExpression(pointA, activePointKey === "A" || stepOnePhase === "done"),
                renderPointExpression(pointB, activePointKey === "B" || stepOnePhase === "done"),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "aside",
        { className: "reflection-right-column" },
        stepOnePhase !== "rule" && showCoordinateFeedback
          ? React.createElement("div", {
              className: "reflection-feedback",
              dangerouslySetInnerHTML: { __html: APP_DATA.feedback.coordinateWrong },
            })
          : stepOnePhase !== "rule"
            ? React.createElement("div", { className: "feedback-spacer" })
            : null,
        stepOnePhase === "done"
          ? React.createElement("div", { className: "feedback-spacer" })
          : renderOptions(
              options.group,
              options.options,
              options.correctIndex,
              options.selectedIndex,
              options.status,
              options.onSelect,
            ),
      ),
    );
  };

  const keyedParts = (parts, prefix) =>
    Array.isArray(parts)
      ? parts.map((part, index) => React.cloneElement(part, { key: prefix + index }))
      : parts;

  const fraction = (numerator, denominator, className) =>
    React.createElement(
      "span",
      { className: "fraction " + (className || "") },
      React.createElement("span", { className: "fraction-num" }, keyedParts(numerator, "n")),
      React.createElement("span", { className: "fraction-bar" }),
      React.createElement("span", { className: "fraction-den" }, keyedParts(denominator, "d")),
    );

  const token = (html, className, refKey) =>
    React.createElement("span", {
      ref: refKey ? (el) => setSubstRef(refKey, el) : null,
      className: className || "",
      dangerouslySetInnerHTML: { __html: formatMathVariablesInHtml(html) },
    });

  const renderTwoPointFormula = (phase, compact) => {
    let leftTop = [
      token("x"),
      token(" &minus; "),
      token("x<sub>1</sub>", phase === 1 ? "sub-box x-one" : "", "x1Top"),
    ];
    let leftBottom = [
      token("x<sub>2</sub>", phase === 1 ? "sub-box x-two" : "", "x2Bottom"),
      token(" &minus; "),
      token("x<sub>1</sub>", phase === 1 ? "sub-box x-one" : "", "x1Bottom"),
    ];
    let rightTop = [
      token("y"),
      token(" &minus; "),
      token("y<sub>1</sub>", phase === 7 ? "sub-box y-one" : "", "y1Top"),
    ];
    let rightBottom = [
      token("y<sub>2</sub>", phase === 7 ? "sub-box y-two" : "", "y2Bottom"),
      token(" &minus; "),
      token("y<sub>1</sub>", phase === 7 ? "sub-box y-one" : "", "y1Bottom"),
    ];

    if (phase >= 2) {
      leftTop = [
        token("x"),
        token(phase >= 3 ? " + " : " &minus; ", phase >= 3 ? "operator-pop" : "operator-old"),
        token("3", phase === 2 ? "sub-box x-one value-landed" : "value-landed"),
      ];
      leftBottom = [
        token("&minus;4", phase === 2 ? "sub-box x-two value-landed" : "value-landed"),
        token(phase >= 3 ? " + " : " &minus; ", phase >= 3 ? "operator-pop" : "operator-old"),
        token("3", phase === 2 ? "sub-box x-one value-landed" : "value-landed"),
      ];
    }

    if (phase === 4) {
      leftBottom = [token("&minus;4 + 3", "sub-box purple-box simplification-box")];
    }

    if (phase === 5) {
      leftBottom = [token("&minus;1", "sub-box purple-box simplification-box simplified-value")];
    }

    if (phase >= 6) {
      leftTop = [token("x"), token(" + "), token("3")];
      leftBottom = [token("&minus;1")];
    }

    if (phase >= 8) {
      rightTop = [
        token("y"),
        token(" &minus; "),
        token("5", phase === 8 ? "sub-box y-one value-landed" : "value-landed"),
      ];
      rightBottom = [
        token("&minus;2", phase === 8 ? "sub-box y-two value-landed" : "value-landed"),
        token(" &minus; "),
        token("5", phase === 8 ? "sub-box y-one value-landed" : "value-landed"),
      ];
    }

    if (phase === 10) {
      rightBottom = [token("&minus;2 &minus; 5", "sub-box purple-box simplification-box")];
    }

    if (phase === 11) {
      rightBottom = [token("&minus;7", "sub-box purple-box simplification-box simplified-value")];
    }

    if (phase >= 12) {
      rightTop = [token("y"), token(" &minus; "), token("5")];
      rightBottom = [token("&minus;7")];
    }

    return React.createElement(
      "div",
      { className: "two-point-equation" + (compact ? " is-compact" : "") },
      fraction(leftTop, leftBottom),
      React.createElement("span", { className: "equation-equals" }, "="),
      fraction(rightTop, rightBottom),
    );
  };

  const renderCoordinateLine = (highlight) =>
    React.createElement(
      "div",
      {
        className:
          "equation-coordinate-line" +
          (entryCoordinatesVisible ? " is-visible" : " is-hidden-for-entry"),
        ref: equationCoordinateLineRef,
      },
      React.createElement(
        "span",
        { "data-entry-target": "A" },
        htmlSpan("", "A&rsquo;("),
        React.createElement("span", {
          ref: (el) => setCoordRef("x1", el),
          className: highlight === "x" ? "coord-box x-one" : "",
          dangerouslySetInnerHTML: { __html: pointA.xHtml },
        }),
        ", ",
        React.createElement("span", {
          ref: (el) => setCoordRef("y1", el),
          className: highlight === "y" ? "coord-box y-one" : "",
          dangerouslySetInnerHTML: { __html: pointA.yHtml },
        }),
        ")",
      ),
      React.createElement("span", { className: "coordinate-and" }, APP_DATA.labels.andWord),
      React.createElement(
        "span",
        { "data-entry-target": "B" },
        htmlSpan("", "B&rsquo;("),
        React.createElement("span", {
          ref: (el) => setCoordRef("x2", el),
          className: highlight === "x" ? "coord-box x-two" : "",
          dangerouslySetInnerHTML: { __html: pointB.xHtml },
        }),
        ", ",
        React.createElement("span", {
          ref: (el) => setCoordRef("y2", el),
          className: highlight === "y" ? "coord-box y-two" : "",
          dangerouslySetInnerHTML: { __html: pointB.yHtml },
        }),
        ")",
      ),
    );

  const renderEquationStep = () => {
    const showRightSimplify = rightPanelMode === "simplify" || substitutionDone;
    const highlight = substitutionPhase >= 1 && substitutionPhase <= 5
      ? "x"
      : substitutionPhase >= 7 && substitutionPhase <= 11
        ? "y"
        : null;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "reflection-left-column equation-left-column fade-panel is-visible" },
        React.createElement(
          "section",
          { className: "equation-heading-row" },
          APP_DATA.labels.equationHeading,
        ),
        React.createElement(
          "section",
          { className: "equation-visual-row" },
          React.createElement("div", { className: "equation-subtitle" }, APP_DATA.labels.equationCoordinatesTitle),
          renderCoordinateLine(highlight),
          React.createElement("div", { className: "two-point-title" }, APP_DATA.labels.twoPointForm),
          renderTwoPointFormula(substitutionPhase, false),
        ),
      ),
      React.createElement(
        "aside",
        { className: "reflection-right-column equation-right-column fade-panel is-visible" },
        showRightSimplify
          ? React.createElement(
              "div",
              { key: "simplify-copy", className: "right-instruction simplify-instruction" },
              React.createElement("div", {
                dangerouslySetInnerHTML: { __html: APP_DATA.equation.simplifyTextTop },
              }),
              React.createElement("div", { className: "standard-form" }, APP_DATA.equation.standardForm),
              React.createElement("div", {
                dangerouslySetInnerHTML: { __html: APP_DATA.equation.simplifyTextBottom },
              }),
            )
          : React.createElement(
              "div",
              { key: "substitute-copy", className: "right-instruction" },
              React.createElement("div", {
                dangerouslySetInnerHTML: { __html: APP_DATA.equation.substituteText },
              }),
              React.createElement(
                "button",
                {
                  id: "substitute-button",
                  className: "substitute-button",
                  onClick: onSubstitute,
                  disabled: substitutionStarted,
                },
                APP_DATA.equation.substituteButton,
              ),
            ),
      ),
    );
  };

  const renderFinalStep = () => {
    const options = {
      group: "simplify",
      options: APP_DATA.problem.simplifyOptions,
      correctIndex: APP_DATA.problem.simplifyCorrectIndex,
      selectedIndex: simplifySelected,
      status: simplifyStatus,
      onSelect: onSimplifySelect,
    };

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "reflection-left-column equation-left-column final-left-column fade-panel is-visible" },
        React.createElement(
          "section",
          { className: "equation-heading-row" },
          APP_DATA.labels.equationHeading,
        ),
        React.createElement(
          "section",
          { className: "equation-visual-row final-equation-row" },
          React.createElement("div", { className: "two-point-title final-formula-title" }, APP_DATA.labels.twoPointForm),
          renderTwoPointFormula(12, true),
          React.createElement("div", { className: "simplify-title" }, APP_DATA.labels.simplifyPrompt),
          React.createElement("div", { className: "standard-form large" }, APP_DATA.equation.standardForm),
        ),
      ),
      React.createElement(
        "aside",
        { className: "reflection-right-column final-right-column" },
        React.createElement("div", { className: "final-mcq-title" }, APP_DATA.labels.finalTitle),
        renderOptions(
          options.group,
          options.options,
          options.correctIndex,
          options.selectedIndex,
          options.status,
          options.onSelect,
        ),
        simplifyStatus === "wrong"
          ? React.createElement("div", {
              className: "simplify-feedback is-wrong-feedback",
              dangerouslySetInnerHTML: { __html: APP_DATA.feedback.simplifyWrong },
            })
          : null,
        simplifyStatus === "correct"
          ? React.createElement("div", {
              className: "simplify-feedback is-correct-feedback",
              dangerouslySetInnerHTML: { __html: APP_DATA.feedback.simplifyCorrect },
            })
          : null,
      ),
    );
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "main-canvas-container" },
      currentStep === 1
        ? renderStepOne()
        : currentStep === 2
          ? renderEquationStep()
          : renderFinalStep(),
    ),
    flyClones.map((clone) =>
      React.createElement("div", {
        key: clone.id,
        className: "reflection-fly-clone " + clone.className,
        style: {
          left: clone.left + "px",
          top: clone.top + "px",
          transform: clone.active
            ? "translate(calc(-50% + " + clone.dx + "px), calc(-50% + " + clone.dy + "px))"
            : "translate(-50%, -50%)",
        },
        dangerouslySetInnerHTML: { __html: formatMathVariablesInHtml(clone.html) },
      }),
    ),
  );
};
