const TEACHING_FLY_MS = 1120;
const TEACHING_PAUSE_MS = 500;

const teachingNormalizeMathText = (text) =>
  String(text || "")
    .replace(/&minus;/g, "-")
    .replace(/&rarr;/g, "\u2192")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'");

const teachingNormalizeCloneText = (text) =>
  teachingNormalizeMathText(text).replace(/-/g, "\u2212");

const teachingGetTokenClass = (el) => {
  if (!el) return null;
  if (el.classList.contains("x-token")) return "x-token";
  if (el.classList.contains("y-token")) return "y-token";
  if (
    el.classList.contains("teach-express-x-prime") ||
    el.classList.contains("teach-express-y-prime")
  )
    return "teach-express-fly";
  return null;
};

const teachingGetCloneFontStyle = (el) => {
  if (!el) {
    return { fontFamily: "inherit", fontStyle: "normal", fontWeight: "400" };
  }
  const style = window.getComputedStyle(el);
  return {
    fontFamily: style.fontFamily,
    fontStyle: style.fontStyle,
    fontWeight: style.fontWeight,
  };
};

const MainCanvas0 = React.forwardRef(
  (
    {
      step,
      onReadyChange,
      onAutoAdvance,
      onNavTextChange,
      onNudgeTargetsChange,
    },
    ref,
  ) => {
    const { useState, useEffect, useRef, useImperativeHandle, useCallback } =
      React;

    const data = APP_DATA.teaching;
    const [introCount, setIntroCount] = useState(0);
    const [introDataCount, setIntroDataCount] = useState(0);
    const [rightVisible, setRightVisible] = useState(false);
    const [ruleSelected, setRuleSelected] = useState(null);
    const [ruleStatus, setRuleStatus] = useState("pending");
    const [showRuleCard, setShowRuleCard] = useState(false);
    const [cPhase, setCPhase] = useState("idle");
    const [dPhase, setDPhase] = useState("idle");
    const [flyClone, setFlyClone] = useState(null);
    const [flyClones, setFlyClones] = useState([]);
    const timersRef = useRef([]);

    const clearTimers = useCallback(() => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    }, []);

    const queue = useCallback((fn, delay) => {
      const timer = setTimeout(fn, delay);
      timersRef.current.push(timer);
      return timer;
    }, []);

    const makeReady = useCallback(
      (ready) => {
        if (typeof onReadyChange === "function") onReadyChange(ready);
      },
      [onReadyChange],
    );

    const setNav = useCallback(
      (text) => {
        if (typeof onNavTextChange === "function") onNavTextChange(text || "");
      },
      [onNavTextChange],
    );

    useImperativeHandle(
      ref,
      () => ({
        prepareStepChange: () => {
          clearTimers();
          setFlyClone(null);
          setFlyClones([]);
          return 0;
        },
      }),
      [clearTimers],
    );

    const reportNudgeTargets = useCallback(() => {
      if (typeof onNudgeTargetsChange !== "function") return;
      const targets = [];
      const pushEl = (el) => {
        if (!el || el.disabled) return;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) targets.push(rect);
      };

      if (step === "C" && cPhase === "idle") {
        pushEl(document.getElementById("teach-express-button"));
      }
      if (step === "D") {
        if (dPhase === "idle") {
          pushEl(document.getElementById("teach-substitute-button"));
        }
        if (dPhase === "final") {
          pushEl(document.getElementById("teach-generalize-equation-card"));
        }
      }

      onNudgeTargetsChange(targets);
    }, [step, cPhase, dPhase, onNudgeTargetsChange]);

    useEffect(() => {
      const update = () => requestAnimationFrame(() => reportNudgeTargets());
      update();
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("resize", update);
        if (typeof onNudgeTargetsChange === "function")
          onNudgeTargetsChange([]);
      };
    }, [reportNudgeTargets, onNudgeTargetsChange]);

    useEffect(() => {
      clearTimers();
      makeReady(false);
      setNav("");
      setIntroCount(0);
      setIntroDataCount(0);
      setRightVisible(false);
      setRuleSelected(null);
      setRuleStatus("pending");
      setShowRuleCard(false);
      setCPhase("idle");
      setDPhase("idle");
      setFlyClone(null);
      setFlyClones([]);

      if (step === "A") {
        setNav(data.stepA.nav.animating);
        queue(() => setRightVisible(true), 220);
        queue(() => setIntroCount(1), 520);
        queue(
          () =>
            animateSelectorClone(
              ".teach-problem-equation",
              ".teach-equation-target",
              () => setIntroDataCount(1),
              { targetAlign: "center" },
            ),
          1200,
        );
        queue(
          () => setIntroCount(2),
          1200 + TEACHING_FLY_MS + TEACHING_PAUSE_MS,
        );
        queue(
          () =>
            animateSelectorClone(
              ".teach-problem-axis",
              ".teach-axis-target",
              () => setIntroDataCount(2),
              { targetAlign: "center" },
            ),
          1200 + TEACHING_FLY_MS + TEACHING_PAUSE_MS + 650,
        );
        queue(
          () => setIntroCount(3),
          1200 + TEACHING_FLY_MS * 2 + TEACHING_PAUSE_MS * 2 + 650,
        );
        queue(
          () => {
            makeReady(true);
            setNav(data.stepA.nav.ready);
          },
          1200 + TEACHING_FLY_MS * 2 + TEACHING_PAUSE_MS * 3 + 900,
        );
      }

      if (step === "B") {
        setIntroCount(3);
        setIntroDataCount(2);
        setRightVisible(true);
        setNav(data.stepB.nav.chooseRule);
      }

      if (step === "C") {
        setIntroCount(3);
        setIntroDataCount(2);
        setRightVisible(true);
        setRuleStatus("correct");
        setNav(data.stepC.nav.tapButton);
      }

      if (step === "D") {
        setIntroCount(3);
        setIntroDataCount(2);
        setRightVisible(true);
        setRuleStatus("correct");
        setNav(data.stepD.nav.tapSubstitute);
      }

      if (step === "E") {
        setNav(data.stepE.nav.ready);
        makeReady(true);
      }

      return clearTimers;
    }, [step, data, clearTimers, makeReady, queue, setNav]);

    const renderMathText = (text) =>
      teachingNormalizeMathText(text)
        .split("")
        .map((char, index, chars) => {
          const prev = chars[index - 1] || "";
          const next = chars[index + 1] || "";
          const isVariable =
            (char === "x" || char === "y") &&
            /[0-9\s+\-\u2212=(),']/.test(prev || " ") &&
            /[0-9\s+\-\u2212=(),']/.test(next || " ");
          if (isVariable) {
            return React.createElement(
              "span",
              { key: index, className: "math-var" },
              char,
            );
          }
          return char === "-" ? "\u2212" : char;
        });

    const renderRichMathText = (html) => {
      const parts = String(html || "").split(/(<br>|<y>|<\/y>)/g);
      let highlighted = false;
      return parts.map((part, index) => {
        if (!part) return null;
        if (part === "<br>") return React.createElement("br", { key: index });
        if (part === "<y>") {
          highlighted = true;
          return null;
        }
        if (part === "</y>") {
          highlighted = false;
          return null;
        }
        return React.createElement(
          highlighted ? "y" : "span",
          { key: index },
          renderMathText(part),
        );
      });
    };

    const renderRuleFormula = (className) =>
      React.createElement(
        "span",
        { className: className || "" },
        React.createElement("span", null, "("),
        React.createElement("span", null, renderMathText("x")),
        React.createElement("span", null, ", "),
        React.createElement("span", null, renderMathText("y")),
        React.createElement("span", null, ") \u2192 ("),
        React.createElement(
          "span",
          { className: "teach-rule-rhs-x x-token" },
          renderMathText("x"),
        ),
        React.createElement("span", null, ", "),
        React.createElement(
          "span",
          { className: "teach-rule-rhs-y y-token" },
          renderMathText("\u2212y"),
        ),
        React.createElement("span", null, ")"),
      );

    const renderStructuredProblem = () => {
      const problem = teachingNormalizeMathText(data.problem);
      const equation = teachingNormalizeMathText(data.lineEquation);
      const axis = teachingNormalizeMathText(data.reflectionAxis);
      const equationIndex = problem.indexOf(equation);
      const axisIndex = problem.indexOf(axis, equationIndex + equation.length);

      if (equationIndex < 0 || axisIndex < 0) {
        return React.createElement("span", null, renderMathText(problem));
      }

      return React.createElement(
        "span",
        null,
        renderMathText(problem.slice(0, equationIndex)),
        React.createElement(
          "span",
          { className: "teach-problem-equation" },
          renderMathText(equation),
        ),
        renderMathText(
          problem.slice(equationIndex + equation.length, axisIndex),
        ),
        React.createElement(
          "span",
          { className: "teach-problem-axis axis-token" },
          renderMathText(axis),
        ),
        renderMathText(problem.slice(axisIndex + axis.length)),
      );
    };

    const animateTextClone = (sourceEl, targetEl, onDone, options = {}) => {
      if (!sourceEl || !targetEl) {
        if (typeof onDone === "function") onDone();
        return;
      }
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const sourceFontSize =
        parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
      const targetFontSize =
        parseFloat(window.getComputedStyle(targetEl).fontSize) ||
        sourceFontSize;
      const targetPaddingLeft =
        parseFloat(window.getComputedStyle(targetEl).paddingLeft) || 0;
      const targetCenterX =
        options.targetAlign === "left"
          ? targetRect.left + targetPaddingLeft + sourceRect.width / 2
          : targetRect.left + targetRect.width / 2;

      const cloneFont = teachingGetCloneFontStyle(sourceEl);
      setFlyClone({
        text: teachingNormalizeCloneText(sourceEl.textContent.trim()),
        tokenClass: teachingGetTokenClass(sourceEl),
        left: sourceRect.left + sourceRect.width / 2,
        top: sourceRect.top + sourceRect.height / 2,
        dx: targetCenterX - (sourceRect.left + sourceRect.width / 2),
        dy:
          targetRect.top +
          targetRect.height / 2 -
          (sourceRect.top + sourceRect.height / 2),
        sourceFontSize: sourceFontSize,
        targetFontSize: targetFontSize,
        fontFamily: cloneFont.fontFamily,
        fontStyle: cloneFont.fontStyle,
        fontWeight: cloneFont.fontWeight,
        active: false,
        duration: options.duration || TEACHING_FLY_MS,
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() =>
          setFlyClone((clone) => (clone ? { ...clone, active: true } : clone)),
        );
      });

      queue(() => {
        setFlyClone(null);
        if (typeof onDone === "function") onDone();
      }, options.duration || TEACHING_FLY_MS);
    };

    const animateSelectorClone = (
      sourceSelector,
      targetSelector,
      onDone,
      options,
    ) =>
      animateTextClone(
        document.querySelector(sourceSelector),
        document.querySelector(targetSelector),
        onDone,
        options,
      );

    const animateTokenClones = (pairs, onDone, options = {}) => {
      const duration = options.duration || TEACHING_FLY_MS;
      const nextClones = [];
      pairs.forEach(([sourceSelector, targetSelector], index) => {
        const sourceEl = document.querySelector(sourceSelector);
        const targetEl = document.querySelector(targetSelector);
        if (!sourceEl || !targetEl) return;
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const sourceFontSize =
          parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
        const targetFontSize =
          parseFloat(window.getComputedStyle(targetEl).fontSize) ||
          sourceFontSize;
        const cloneFont = teachingGetCloneFontStyle(sourceEl);
        nextClones.push({
          id: "teach-fly-" + Date.now() + "-" + index,
          text: teachingNormalizeCloneText(sourceEl.textContent.trim()),
          tokenClass: teachingGetTokenClass(sourceEl),
          left: sourceRect.left + sourceRect.width / 2,
          top: sourceRect.top + sourceRect.height / 2,
          dx:
            targetRect.left +
            targetRect.width / 2 -
            (sourceRect.left + sourceRect.width / 2),
          dy:
            targetRect.top +
            targetRect.height / 2 -
            (sourceRect.top + sourceRect.height / 2),
          sourceFontSize: sourceFontSize,
          targetFontSize: targetFontSize,
          fontFamily: cloneFont.fontFamily,
          fontStyle: cloneFont.fontStyle,
          fontWeight: cloneFont.fontWeight,
          active: false,
          duration: duration,
        });
      });

      if (!nextClones.length) {
        if (typeof onDone === "function") onDone();
        return;
      }

      setFlyClones((clones) => [...clones, ...nextClones]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClones((clones) =>
            clones.map((clone) =>
              nextClones.some((nextClone) => nextClone.id === clone.id)
                ? { ...clone, active: true }
                : clone,
            ),
          );
        });
      });
      queue(() => {
        setFlyClones((clones) =>
          clones.filter(
            (clone) =>
              !nextClones.some((nextClone) => nextClone.id === clone.id),
          ),
        );
        if (typeof onDone === "function") onDone();
      }, duration);
    };

    const handleRuleOption = (index, event) => {
      if (ruleStatus !== "pending") return;
      const isCorrect = index === data.ruleCorrectIndex;
      setRuleSelected(index);
      if (typeof playSound === "function")
        playSound(isCorrect ? "correct" : "wrong");

      if (!isCorrect) {
        setRuleStatus("wrong");
        queue(() => {
          setRuleSelected(null);
          setRuleStatus("pending");
        }, 700);
        return;
      }

      setRuleStatus("animating");
      const sourceEl =
        event.currentTarget.querySelector(".teaching-option-answer") ||
        event.currentTarget;
      // Wait for formula-only target (opacity 0) to mount before measuring the fly.
      queue(() => {
        const targetEl = document.querySelector(".teaching-rule-formula");
        animateTextClone(sourceEl, targetEl, () => {
          setRuleStatus("correct");
          queue(() => setShowRuleCard(true), TEACHING_PAUSE_MS);
          queue(() => {
            if (typeof onAutoAdvance === "function") onAutoAdvance();
          }, TEACHING_PAUSE_MS + 1700);
        });
      }, 40);
    };

    const handleExpress = () => {
      if (cPhase !== "idle") return;
      if (typeof playSound === "function") playSound("click");
      setCPhase("animating");
      queue(
        () =>
          animateTokenClones(
            [
              [".teach-express-x-prime", ".teach-c-x-lhs"],
              [".teach-express-y-prime", ".teach-c-y-lhs"],
            ],
            () => {
              setCPhase("lhs");
              queue(
                () =>
                  animateTokenClones(
                    [
                      [".teach-rule-rhs-x", ".teach-c-x-rhs"],
                      [".teach-rule-rhs-y", ".teach-c-y-rhs"],
                    ],
                    () => {
                      setCPhase("rhs");
                      queue(() => setCPhase("callout"), TEACHING_PAUSE_MS);
                      queue(
                        () => setCPhase("yellowBox"),
                        TEACHING_PAUSE_MS + 850,
                      );
                      queue(
                        () =>
                          animateTokenClones(
                            [
                              [".teach-c-x-rhs", ".teach-c-x-yellow-lhs"],
                              [".teach-c-x-eq", ".teach-c-x-yellow-eq"],
                              [".teach-c-x-lhs", ".teach-c-x-yellow-rhs"],
                              [".teach-c-y-rhs-var", ".teach-c-y-yellow-lhs"],
                              [".teach-c-y-eq", ".teach-c-y-yellow-eq"],
                              [
                                ".teach-c-y-rhs-sign",
                                ".teach-c-y-yellow-rhs-sign",
                              ],
                              [".teach-c-y-lhs", ".teach-c-y-yellow-rhs-var"],
                            ],
                            () => setCPhase("yellow"),
                          ),
                        TEACHING_PAUSE_MS + 1400,
                      );
                      queue(
                        () => {
                          if (typeof onAutoAdvance === "function")
                            onAutoAdvance();
                        },
                        TEACHING_PAUSE_MS + 1400 + TEACHING_FLY_MS + 1300,
                      );
                    },
                  ),
                TEACHING_PAUSE_MS,
              );
            },
          ),
        40,
      );
    };

    const handleSubstitute = () => {
      if (dPhase !== "idle") return;
      if (typeof playSound === "function") playSound("click");
      setDPhase("copying");
      queue(
        () =>
          animateSelectorClone(
            ".teaching-equation-summary .teaching-summary-value",
            ".teach-d-equation-target",
            () => {
              setDPhase("line");
              queue(
                () =>
                  animateSelectorClone(
                    ".teach-d-x-rhs-source",
                    ".teach-d-eq-x",
                    () => {
                      setDPhase("x");
                      queue(
                        () =>
                          animateSelectorClone(
                            ".teach-d-y-rhs-source",
                            ".teach-d-eq-y",
                            () => {
                              setDPhase("y");
                              queue(
                                () => setDPhase("prime"),
                                TEACHING_PAUSE_MS + 450,
                              );
                              queue(() => {
                                setDPhase("final");
                                setNav(data.stepD.nav.tapGeneralize);
                              }, TEACHING_PAUSE_MS + 1250);
                            },
                          ),
                        TEACHING_PAUSE_MS,
                      );
                    },
                  ),
                TEACHING_PAUSE_MS,
              );
            },
          ),
        140,
      );
    };

    const handleGeneralize = () => {
      if (dPhase !== "final") return;
      if (typeof playSound === "function") playSound("click");
      if (typeof onAutoAdvance === "function") onAutoAdvance();
    };

    const renderProblem = () =>
      React.createElement(
        "div",
        { className: "teaching-problem-card" },
        renderStructuredProblem(),
      );

    const renderSummaryCard = (kind, visible = true) => {
      const isEquation = kind === "equation";
      const showEquationValue = introDataCount >= 1 || step !== "A";
      const showRuleLine =
        (introDataCount >= 2 && introCount >= 3) || step !== "A";
      return React.createElement(
        "div",
        {
          className:
            "teaching-summary-card " +
            (isEquation
              ? "teaching-equation-summary"
              : "teaching-reflection-summary") +
            (visible ? " is-visible" : ""),
        },
        isEquation
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "teaching-summary-title" },
                data.summary.equationGivenLine,
              ),
              React.createElement(
                "div",
                {
                  className:
                    "teaching-summary-value teach-equation-target" +
                    (showEquationValue ? "" : " is-hidden-content"),
                },
                renderMathText(data.lineEquation),
              ),
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "div",
                { className: "teaching-reflection-line" },
                React.createElement(
                  "span",
                  null,
                  data.summary.lineReflection + " ",
                ),
                React.createElement(
                  "span",
                  {
                    className:
                      "axis-token teach-axis-target" +
                      (introDataCount >= 2 || step !== "A"
                        ? ""
                        : " is-placeholder"),
                  },
                  renderMathText(data.reflectionAxis),
                ),
              ),
              React.createElement(
                "div",
                {
                  className:
                    "teaching-rule-line" +
                    (ruleStatus === "animating" || ruleStatus === "correct"
                      ? " is-formula-only"
                      : "") +
                    (showRuleLine ? "" : " is-hidden-content"),
                },
                ruleStatus === "animating" || ruleStatus === "correct"
                  ? renderRuleFormula(
                      "teaching-rule-formula" +
                        (ruleStatus === "correct" ? "" : " is-hidden-content"),
                    )
                  : React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(
                        "span",
                        { className: "teaching-rule-label" },
                        renderMathText(data.ruleLineLabel),
                      ),
                      React.createElement(
                        "span",
                        { className: "teaching-rule-target" },
                        React.createElement(
                          "span",
                          { className: "jump-question" },
                          data.stepA.rulePlaceholder,
                        ),
                      ),
                    ),
              ),
            ),
      );
    };

    const renderTopStack = (showProblem) =>
      React.createElement(
        "div",
        { className: "teaching-top-stack" },
        showProblem ? renderProblem() : null,
        renderSummaryCard("equation", introCount >= 1 || step !== "A"),
        renderSummaryCard("reflection", introCount >= 2 || step !== "A"),
      );

    const renderRuleOptions = () =>
      React.createElement(
        "div",
        { className: "teaching-options" },
        data.ruleOptions.map((option, index) => {
          let className = "line-option teaching-option";
          if (
            ruleSelected === index &&
            index === data.ruleCorrectIndex &&
            ruleStatus !== "pending"
          ) {
            className += " is-correct";
          }
          if (
            ruleSelected === index &&
            index !== data.ruleCorrectIndex &&
            ruleStatus === "wrong"
          ) {
            className += " is-wrong";
          }
          return React.createElement("button", {
            key: index,
            type: "button",
            className: className,
            disabled: ruleStatus !== "pending",
            children: React.createElement(
              "span",
              { className: "teaching-option-answer" },
              renderMathText(option),
            ),
            onClick: (event) => handleRuleOption(index, event),
          });
        }),
      );

    const renderCoordinateTeachingCard = () => {
      const showBlueBox = cPhase !== "idle" && cPhase !== "yellow";
      const showLhs = cPhase !== "idle" && cPhase !== "animating";
      const showRhs =
        cPhase === "rhs" ||
        cPhase === "callout" ||
        cPhase === "yellowBox" ||
        cPhase === "yellow";
      const hasYellowBox = cPhase === "yellowBox" || cPhase === "yellow";
      const hasYellowContent = cPhase === "yellow";

      const blueBox = (side) => {
        const isX = side === "x";
        return React.createElement(
          "div",
          {
            className:
              "coordinate-box blue-box teaching-coordinate-blue" +
              (showBlueBox ? " is-visible" : ""),
          },
          React.createElement(
            "span",
            {
              className:
                "teach-c-" +
                side +
                "-lhs" +
                (showLhs ? "" : " is-hidden-content"),
            },
            renderMathText(isX ? "x'" : "y'"),
          ),
          React.createElement(
            "span",
            {
              className:
                "teach-c-" +
                side +
                "-eq" +
                (showLhs ? "" : " is-hidden-content"),
            },
            "=",
          ),
          React.createElement(
            "span",
            {
              className:
                "teach-c-" +
                side +
                "-rhs" +
                (isX ? " x-token" : " y-token") +
                (showRhs ? "" : " is-hidden-content"),
            },
            isX
              ? renderMathText("x")
              : React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "span",
                    { className: "teach-c-y-rhs-sign" },
                    renderMathText("-"),
                  ),
                  React.createElement(
                    "span",
                    { className: "teach-c-y-rhs-var" },
                    renderMathText("y"),
                  ),
                ),
          ),
        );
      };

      const yellowBox = (side) => {
        const isX = side === "x";
        return React.createElement(
          "div",
          {
            className:
              "coordinate-box yellow-box teaching-coordinate-yellow " +
              "teach-c-" +
              side +
              "-yellow" +
              (hasYellowBox ? " is-visible" : ""),
          },
          React.createElement(
            "span",
            {
              className:
                "teach-c-" +
                side +
                "-yellow-lhs" +
                (hasYellowContent ? "" : " is-hidden-content"),
            },
            renderMathText(isX ? "x" : "y"),
          ),
          React.createElement(
            "span",
            {
              className:
                "teach-c-" +
                side +
                "-yellow-eq" +
                (hasYellowContent ? "" : " is-hidden-content"),
            },
            "=",
          ),
          React.createElement(
            "span",
            {
              className:
                "teach-c-" +
                side +
                "-yellow-rhs" +
                (isX ? " x-token" : " y-token") +
                (hasYellowContent ? "" : " is-hidden-content"),
            },
            isX
              ? renderMathText("x'")
              : React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "span",
                    { className: "teach-c-y-yellow-rhs-sign" },
                    renderMathText("-"),
                  ),
                  React.createElement(
                    "span",
                    { className: "teach-c-y-yellow-rhs-var" },
                    renderMathText("y'"),
                  ),
                ),
          ),
        );
      };

      return React.createElement(
        "div",
        { className: "teaching-sol-card teaching-c-card" },
        React.createElement(
          "div",
          { className: "teaching-coordinate-grid" },
          React.createElement(
            "div",
            {
              className:
                "teaching-coordinate-column" +
                (showBlueBox ? "" : " is-hiding-blue"),
            },
            blueBox("x"),
            yellowBox("x"),
          ),
          React.createElement(
            "div",
            {
              className:
                "teaching-coordinate-column" +
                (showBlueBox ? "" : " is-hiding-blue"),
            },
            blueBox("y"),
            yellowBox("y"),
          ),
        ),
      );
    };

    const renderYellowRules = () =>
      React.createElement(
        "div",
        { className: "teaching-d-rules" },
        React.createElement(
          "div",
          {
            className:
              "coordinate-box yellow-box teaching-d-rule teach-d-x-source",
          },
          React.createElement("span", null, renderMathText("x = ")),
          React.createElement(
            "span",
            { className: "teach-d-x-rhs-source x-token" },
            renderMathText("x'"),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "coordinate-box yellow-box teaching-d-rule teach-d-y-source",
          },
          React.createElement("span", null, renderMathText("y = ")),
          React.createElement(
            "span",
            { className: "teach-d-y-rhs-source y-token" },
            renderMathText("-y'"),
          ),
        ),
      );

    const renderDEquation = () => {
      const hasLine =
        dPhase === "copying" ||
        dPhase === "line" ||
        dPhase === "x" ||
        dPhase === "y";
      if (!hasLine) return null;
      return React.createElement(
        "div",
        {
          className:
            "teaching-d-equation teach-d-equation-target" +
            (dPhase === "copying" ? " is-placeholder" : ""),
        },
        React.createElement("span", null, renderMathText("2")),
        React.createElement(
          "span",
          {
            className:
              "teach-d-eq-x x-token" + (dPhase === "line" ? " is-dimmed" : ""),
          },
          renderMathText(dPhase === "line" ? "x" : "x'"),
        ),
        React.createElement(
          "span",
          {
            className:
              "teach-d-eq-plus" + (dPhase === "y" ? " is-hidden-op" : ""),
          },
          renderMathText(" + "),
        ),
        React.createElement(
          "span",
          {
            className:
              "teach-d-eq-y y-token" +
              (dPhase === "line" || dPhase === "x" ? " is-dimmed" : ""),
          },
          renderMathText(dPhase === "y" ? "-y'" : "y"),
        ),
        React.createElement("span", null, renderMathText(" = 4")),
      );
    };

    const renderDFinalCard = () => {
      if (dPhase !== "prime" && dPhase !== "final") return null;
      return React.createElement(
        "button",
        {
          type: "button",
          id: "teach-generalize-equation-card",
          className:
            "teaching-final-equation-card" +
            (dPhase === "final" ? " is-clickable" : ""),
          onClick: handleGeneralize,
        },
        React.createElement("div", null, data.stepD.equationTitle),
        React.createElement(
          "div",
          { className: "teaching-final-equation" },
          renderMathText("2"),
          renderMathText("x"),
          React.createElement(
            "span",
            {
              className:
                "teach-d-prime" + (dPhase === "final" ? " is-gone" : ""),
            },
            "'",
          ),
          renderMathText(" \u2212 "),
          renderMathText("y"),
          React.createElement(
            "span",
            {
              className:
                "teach-d-prime" + (dPhase === "final" ? " is-gone" : ""),
            },
            "'",
          ),
          renderMathText(" = 4"),
        ),
      );
    };

    const renderStepDCard = () =>
      React.createElement(
        "div",
        {
          className:
            "teaching-sol-card teaching-d-card" +
            (dPhase === "prime" || dPhase === "final" ? " is-final" : ""),
        },
        dPhase === "prime" || dPhase === "final"
          ? renderDFinalCard()
          : React.createElement(
              React.Fragment,
              null,
              renderYellowRules(),
              renderDEquation(),
            ),
      );

    const renderRightPanel = () => {
      if (step === "A") {
        return React.createElement("div", {
          className:
            "right-text-panel teaching-right-text" +
            (rightVisible ? " is-visible" : ""),
          dangerouslySetInnerHTML: { __html: data.stepA.rightPanel },
        });
      }
      if (step === "B") {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className: "right-title teaching-rule-question",
            dangerouslySetInnerHTML: { __html: data.ruleQuestion },
          }),
          renderRuleOptions(),
        );
      }
      if (step === "C") {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className: "right-title teaching-explain-text",
            dangerouslySetInnerHTML: { __html: data.stepC.rightPanel },
          }),
          React.createElement("button", {
            type: "button",
            id: "teach-express-button",
            className: "btn teaching-action-button",
            disabled: cPhase !== "idle",
            onClick: handleExpress,
            dangerouslySetInnerHTML: {
              __html: data.stepC.buttonText
                .replace(
                  "x&rsquo;",
                  '<span class="teach-express-x-prime"><span class="math-var">x</span>\'</span>',
                )
                .replace(
                  "y&rsquo;",
                  '<span class="teach-express-y-prime"><span class="math-var">y</span>\'</span>',
                ),
            },
          }),
        );
      }
      if (step === "D") {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className:
              "right-title teaching-explain-text" +
              (dPhase === "prime" || dPhase === "final" ? " is-found" : ""),
            dangerouslySetInnerHTML: {
              __html:
                dPhase === "prime" || dPhase === "final"
                  ? data.stepD.foundPanel
                  : data.stepD.rightPanel,
            },
          }),
          dPhase === "prime" || dPhase === "final"
            ? null
            : React.createElement("button", {
                type: "button",
                id: "teach-substitute-button",
                className: "btn teaching-action-button",
                disabled: dPhase !== "idle",
                onClick: handleSubstitute,
                dangerouslySetInnerHTML: { __html: data.stepD.buttonText },
              }),
        );
      }
      return null;
    };

    const renderStepE = () =>
      React.createElement(
        "div",
        { className: "teaching-generalize-screen" },
        React.createElement("div", {
          className: "teaching-generalize-title",
          dangerouslySetInnerHTML: { __html: data.stepE.title },
        }),
        React.createElement(
          "div",
          { className: "teaching-generalize-box" },
          React.createElement("div", {
            className: "teaching-step-label",
            dangerouslySetInnerHTML: { __html: data.stepE.box1.title },
          }),
          React.createElement("div", {
            className: "teaching-step-text",
            dangerouslySetInnerHTML: { __html: data.stepE.box1.text },
          }),
          React.createElement(
            "div",
            { className: "teaching-step-formula" },
            renderMathText(data.stepE.box1.formula),
          ),
        ),
        React.createElement(
          "div",
          { className: "teaching-generalize-box" },
          React.createElement("div", {
            className: "teaching-step-label",
            dangerouslySetInnerHTML: { __html: data.stepE.box2.title },
          }),
          React.createElement(
            "div",
            { className: "teaching-step-text" },
            renderRichMathText(data.stepE.box2.text),
          ),
        ),
        React.createElement("div", {
          className: "teaching-generalize-footer",
          dangerouslySetInnerHTML: { __html: data.stepE.footer },
        }),
      );

    const renderMainContent = () => {
      if (step === "E") return renderStepE();

      return React.createElement(
        "div",
        { className: "main-canvas-container teaching-canvas" },
        React.createElement(
          "section",
          { className: "teaching-math-column" },
          renderTopStack(true),
          step === "B" && showRuleCard
            ? React.createElement("div", {
                className: "teaching-sol-card teaching-b-card is-visible",
              })
            : null,
          step === "C"
            ? React.createElement(
                React.Fragment,
                null,
                renderCoordinateTeachingCard(),
                cPhase === "callout" ||
                  cPhase === "yellowBox" ||
                  cPhase === "yellow"
                  ? React.createElement("div", {
                      className: "teaching-callout",
                      dangerouslySetInnerHTML: { __html: data.stepC.callout },
                    })
                  : null,
              )
            : null,
          step === "D" ? renderStepDCard() : null,
        ),
        React.createElement(
          "aside",
          { className: "action-column teaching-action-column" },
          renderRightPanel(),
        ),
      );
    };

    return React.createElement(
      React.Fragment,
      null,
      renderMainContent(),
      flyClone
        ? React.createElement(
            "div",
            {
              className:
                "reflection-fly-clone teaching-fly-clone" +
                (flyClone.tokenClass ? " " + flyClone.tokenClass : ""),
              style: {
                left: flyClone.left + "px",
                top: flyClone.top + "px",
                fontSize:
                  (flyClone.active
                    ? flyClone.targetFontSize
                    : flyClone.sourceFontSize) + "px",
                fontFamily: flyClone.fontFamily,
                fontStyle: flyClone.fontStyle,
                fontWeight: flyClone.fontWeight,
                transform: flyClone.active
                  ? "translate(calc(-50% + " +
                    flyClone.dx +
                    "px), calc(-50% + " +
                    flyClone.dy +
                    "px))"
                  : "translate(-50%, -50%)",
                transitionDuration:
                  (flyClone.duration || TEACHING_FLY_MS) / 1000 + "s",
              },
            },
            renderMathText(flyClone.text),
          )
        : null,
      flyClones.map((clone) =>
        React.createElement(
          "div",
          {
            key: clone.id,
            className:
              "reflection-fly-clone teaching-fly-clone" +
              (clone.tokenClass ? " " + clone.tokenClass : ""),
            style: {
              left: clone.left + "px",
              top: clone.top + "px",
              fontSize:
                (clone.active ? clone.targetFontSize : clone.sourceFontSize) +
                "px",
              fontFamily: clone.fontFamily,
              fontStyle: clone.fontStyle,
              fontWeight: clone.fontWeight,
              transform: clone.active
                ? "translate(calc(-50% + " +
                  clone.dx +
                  "px), calc(-50% + " +
                  clone.dy +
                  "px))"
                : "translate(-50%, -50%)",
              transitionDuration:
                (clone.duration || TEACHING_FLY_MS) / 1000 + "s",
            },
          },
          renderMathText(clone.text),
        ),
      ),
    );
  },
);
