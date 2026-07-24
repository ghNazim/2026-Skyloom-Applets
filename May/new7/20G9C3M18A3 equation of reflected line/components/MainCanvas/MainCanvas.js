function tokenizeReflectionExpression(text) {
  const matches = String(text || "").match(/\d+|[xyk]|[()+\-\u2212=\u00d7]/g);
  return (matches || []).map((value, index) => ({
    value: value === "-" ? "\u2212" : value,
    id: "reflection-token-" + index + "-" + value,
  }));
}

function buildReflectionTokenMatches(fromTokens, toTokens) {
  const availableTargets = {};
  toTokens.forEach((token, index) => {
    if (!availableTargets[token.value]) availableTargets[token.value] = [];
    availableTargets[token.value].push(index);
  });

  return fromTokens.map((token) => {
    const targets = availableTargets[token.value];
    if (!targets || !targets.length) return null;
    let bestListIndex = 0;
    let bestDistance = Math.abs(targets[0] - fromTokens.indexOf(token));
    targets.forEach((targetIndex, listIndex) => {
      const distance = Math.abs(targetIndex - fromTokens.indexOf(token));
      if (distance < bestDistance) {
        bestDistance = distance;
        bestListIndex = listIndex;
      }
    });
    return targets.splice(bestListIndex, 1)[0];
  });
}

const ReflectionRearrangeAnimation = ({ from, to, renderText }) => {
  const { useEffect, useMemo, useRef, useState } = React;
  const fromTokens = useMemo(() => tokenizeReflectionExpression(from), [from]);
  const toTokens = useMemo(() => tokenizeReflectionExpression(to), [to]);
  const matches = useMemo(
    () => buildReflectionTokenMatches(fromTokens, toTokens),
    [fromTokens, toTokens],
  );
  const matchedTargets = useMemo(
    () => matches.filter((targetIndex) => targetIndex !== null),
    [matches],
  );
  const oldRefs = useRef([]);
  const targetRefs = useRef([]);
  const [tokenMoves, setTokenMoves] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setTokenMoves(null);

    const measureFrame = requestAnimationFrame(() => {
      const moves = fromTokens.map((token, index) => {
        const targetIndex = matches[index];
        const oldNode = oldRefs.current[index];
        const targetNode =
          targetIndex === null ? null : targetRefs.current[targetIndex];

        if (!oldNode || !targetNode) {
          return { matched: false, x: "0px", y: "0px" };
        }

        const oldRect = oldNode.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();
        return {
          matched: true,
          x: targetRect.left - oldRect.left + "px",
          y: targetRect.top - oldRect.top + "px",
        };
      });

      setTokenMoves(moves);
      requestAnimationFrame(() => setIsPlaying(true));
    });

    return () => cancelAnimationFrame(measureFrame);
  }, [from, to, fromTokens, matches]);

  return React.createElement(
    "span",
    {
      className:
        "reflection-rearrange-animation" + (isPlaying ? " is-playing" : ""),
      "aria-label": to,
    },
    React.createElement(
      "span",
      { className: "reflection-rearrange-measure-stack", "aria-hidden": "true" },
      React.createElement(
        "span",
        { className: "reflection-rearrange-measure-row" },
        fromTokens.map((token, index) =>
          React.createElement(
            "span",
            { key: token.id, className: "reflection-rearrange-token" },
            renderText(token.value, "reflection-source-measure-" + index),
          ),
        ),
      ),
      React.createElement(
        "span",
        { className: "reflection-rearrange-measure-row" },
        toTokens.map((token, index) =>
          React.createElement(
            "span",
            {
              key: token.id,
              className: "reflection-rearrange-token",
              ref: (node) => {
                targetRefs.current[index] = node;
              },
            },
            renderText(token.value, "reflection-target-" + index),
          ),
        ),
      ),
    ),
    React.createElement(
      "span",
      { className: "reflection-rearrange-old-layer", "aria-hidden": "true" },
      fromTokens.map((token, index) => {
        const move = tokenMoves && tokenMoves[index];
        return React.createElement(
          "span",
          {
            key: token.id,
            className:
              "reflection-rearrange-token reflection-rearrange-old-token" +
              (move && move.matched ? " is-matched" : " is-removed"),
            ref: (node) => {
              oldRefs.current[index] = node;
            },
            style:
              move && move.matched
                ? { "--move-x": move.x, "--move-y": move.y }
                : undefined,
          },
          renderText(token.value, "reflection-old-" + index),
        );
      }),
    ),
    React.createElement(
      "span",
      { className: "reflection-rearrange-new-layer", "aria-hidden": "true" },
      toTokens.map((token, index) =>
        React.createElement(
          "span",
          {
            key: token.id,
            className:
              "reflection-rearrange-token reflection-rearrange-new-token" +
              (matchedTargets.includes(index) ? " is-matched" : " is-added"),
          },
          renderText(token.value, "reflection-new-" + index),
        ),
      ),
    ),
  );
};

const MainCanvas = React.forwardRef(({ step, question, onReadyChange }, ref) => {
  const {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useImperativeHandle,
    useCallback,
  } = React;

  const [typedProblem, setTypedProblem] = useState("");
  const [rightVisible, setRightVisible] = useState(false);
  const [introLineCount, setIntroLineCount] = useState(0);
  const [introDataCount, setIntroDataCount] = useState(0);
  const [ruleStatus, setRuleStatus] = useState("pending");
  const [ruleSelected, setRuleSelected] = useState(null);
  const [coordinatePhase, setCoordinatePhase] = useState(0);
  const [coordinateParts, setCoordinateParts] = useState({
    xBlue: false,
    xRhs: false,
    xOr: false,
    xYellowBox: false,
    xYellow: false,
    yBlue: false,
    yRhs: false,
    yOr: false,
    yYellowBox: false,
    yYellow: false,
  });
  const [formedStepThree, setFormedStepThree] = useState(false);
  const [showStepThreeCard, setShowStepThreeCard] = useState(false);
  const [formingPhase, setFormingPhase] = useState(false);
  const [collapseBeforeFinal, setCollapseBeforeFinal] = useState(false);
  const [subValues, setSubValues] = useState({ x: "", y: "" });
  const [activeBox, setActiveBox] = useState("x");
  const [boxStatus, setBoxStatus] = useState({ x: "active", y: "idle" });
  const [numpadFeedback, setNumpadFeedback] = useState("");
  const [simplifySelected, setSimplifySelected] = useState(null);
  const [simplifyStatus, setSimplifyStatus] = useState("pending");
  const [stepFourPhase, setStepFourPhase] = useState("idle");
  const [flyClone, setFlyClone] = useState(null);
  const [flyClones, setFlyClones] = useState([]);
  const [formingSources, setFormingSources] = useState([]);
  const timersRef = useRef([]);

  const data = APP_DATA;
  const labels = data.common.labels;
  const numpad = data.common.numpad;
  const step1Data = data.steps.step1;
  const step2Data = data.steps.step2;
  const step3Data = data.steps.step3;
  const step4Data = data.steps.step4;
  const activeQuestion = question || data.questions[0];
  const plainProblem = activeQuestion.problem.replace(/&minus;/g, "-");
  const emptyCoordinateParts = {
    xBlue: false,
    xRhs: false,
    xOr: false,
    xYellowBox: false,
    xYellow: false,
    yBlue: false,
    yRhs: false,
    yOr: false,
    yYellowBox: false,
    yYellow: false,
  };

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

  useImperativeHandle(
    ref,
    () => ({
      prepareStepChange: () => {
        clearTimers();
        setFlyClone(null);
        if (step === 2) {
          setFormedStepThree(false);
          setShowStepThreeCard(false);
          captureFormingSources();
        }
        if (step === 3) {
          setCollapseBeforeFinal(true);
          return 430;
        }
        return 0;
      },
    }),
    [clearTimers, step],
  );

  useEffect(() => {
    clearTimers();
    makeReady(false);
    setFlyClone(null);
    setRightVisible(false);

    if (step === 1) {
      setTypedProblem("");
      setIntroLineCount(0);
      setIntroDataCount(0);
      setRuleStatus("pending");
      setRuleSelected(null);
      setCoordinatePhase(0);
      setCoordinateParts(emptyCoordinateParts);

      let index = 0;
      const typeNext = () => {
        index += 1;
        setTypedProblem(plainProblem.slice(0, index));
        if (index < plainProblem.length) {
          queue(typeNext, 30);
        } else {
          queue(() => setRightVisible(true), 300);
          queue(() => {
            setIntroLineCount(1);
            queue(
              () =>
                animateSelectorClone(
                  ".problem-equation-source",
                  ".line-equation-target",
                  () => setIntroDataCount(1),
                ),
              120,
            );
          }, 900);
          queue(() => {
            setIntroLineCount(2);
            queue(
              () =>
                animateSelectorClone(
                  ".problem-axis-source",
                  ".line-axis-target",
                  () => setIntroDataCount(2),
                ),
              120,
            );
          }, 2100);
          queue(() => {
            setIntroLineCount(3);
            queue(() => setIntroDataCount(3), 250);
          }, 3300);
          queue(() => makeReady(true), 4350);
        }
      };
      queue(typeNext, 30);
    }

    if (step === 2) {
      setTypedProblem(plainProblem);
      setIntroLineCount(3);
      setIntroDataCount(3);
      setRuleStatus("pending");
      setRuleSelected(null);
      setCoordinatePhase(0);
      setCoordinateParts(emptyCoordinateParts);
      queue(() => setRightVisible(true), 60);
    }

    if (step === 3) {
      setTypedProblem(plainProblem);
      setFormedStepThree(false);
      setShowStepThreeCard(false);
      setFormingPhase(flyClones.length > 0);
      setCollapseBeforeFinal(false);
      setSubValues({ x: "", y: "" });
      setActiveBox("x");
      setBoxStatus({ x: "active", y: "idle" });
      setNumpadFeedback("");
      queue(() => setRightVisible(true), 80);
      queue(
        () => {
          setFlyClones([]);
          setFormingPhase(false);
          setFormedStepThree(true);
          queue(() => setShowStepThreeCard(true), 500);
        },
        formingSources.length > 0 ? 920 : 650,
      );
    }

    if (step === 4) {
      setTypedProblem(plainProblem);
      setRightVisible(true);
      setFormedStepThree(true);
      setShowStepThreeCard(false);
      setFormingPhase(false);
      setCollapseBeforeFinal(false);
      setSubValues(activeQuestion.step3.answers);
      setBoxStatus({ x: "plain", y: "plain" });
      setSimplifySelected(null);
      setSimplifyStatus("pending");
      setStepFourPhase("idle");
    }

    return clearTimers;
  }, [step, plainProblem, activeQuestion, clearTimers, makeReady, queue]);

  useLayoutEffect(() => {
    if (step !== 3) return;
    setFormedStepThree(false);
    setShowStepThreeCard(false);
  }, [step]);

  useLayoutEffect(() => {
    if (step !== 3 || formingSources.length === 0) return;
    const nextClones = [];
    formingSources.forEach((source, index) => {
      const targetEl = document.querySelector(source.targetSelector);
      if (!targetEl) return;
      const targetRect = targetEl.getBoundingClientRect();
      const targetFontSize =
        parseFloat(window.getComputedStyle(targetEl).fontSize) ||
        source.sourceFontSize ||
        42;
      nextClones.push({
        id: "forming-" + index,
        text: source.text,
        left: source.left,
        top: source.top,
        dx: targetRect.left + targetRect.width / 2 - source.left,
        dy: targetRect.top + targetRect.height / 2 - source.top,
        sourceFontSize: source.sourceFontSize || targetFontSize,
        targetFontSize: targetFontSize,
        active: false,
      });
    });
    setFlyClones(nextClones);
    setFormingSources([]);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlyClones((clones) =>
          clones.map((clone) => ({ ...clone, active: true })),
        );
      });
    });
  }, [step, formingSources]);

  const renderMathHtml = (html, className) =>
    React.createElement(
      "span",
      { className: className || "" },
      renderMathText(html),
    );

  const normalizeMathText = (text) =>
    text.replace(/&minus;/g, "-").replace(/&rarr;/g, "\u2192");

  const renderMathText = (text) =>
    normalizeMathText(text)
      .split("")
      .map((char, index, chars) => {
        const prev = chars[index - 1] || "";
        const next = chars[index + 1] || "";
        const isLetterBefore = /[A-Za-z]/.test(prev);
        const isLetterAfter = /[A-Za-z]/.test(next);
        const isMathVariable =
          (char === "x" || char === "y" || char === "k") &&
          !isLetterBefore &&
          !isLetterAfter;
        if (isMathVariable) {
          return React.createElement(
            "span",
            { key: index, className: "math-var" },
            char,
          );
        }
        return char === "-" ? "\u2212" : char;
      });

  const renderProblemText = (text) => renderMathText(text);

  const renderRuleTuple = (answer) =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement("span", null, "("),
      React.createElement("span", null, renderMathText(answer.left[0])),
      React.createElement("span", null, ", "),
      React.createElement("span", null, renderMathText(answer.left[1])),
      React.createElement("span", null, ") \u2192 ("),
      React.createElement(
        "span",
        { className: "rule-x-source" },
        renderMathText(answer.right[0]),
      ),
      React.createElement("span", null, ", "),
      React.createElement(
        "span",
        { className: "rule-y-source" },
        renderMathText(answer.right[1]),
      ),
      React.createElement("span", null, ")"),
    );

  const renderFormulaParts = (parts, options = {}) =>
    parts.map((part, index) => {
      if (part.var) {
        return React.createElement(
          "span",
          { key: index, className: part.var + "-token" },
          renderMathText(part.var),
        );
      }
      if (part.box) {
        return React.createElement(
          React.Fragment,
          { key: index },
          React.createElement("span", { className: "paren" }, "("),
          renderSubBox(part.box),
          React.createElement("span", { className: "paren" }, ")"),
        );
      }
      if (part.value) {
        return React.createElement(
          React.Fragment,
          { key: index },
          React.createElement("span", { className: "paren" }, "("),
          React.createElement(
            "span",
            { className: "sub-box plain " + part.color + "-token" },
            renderMathText(part.value),
          ),
          React.createElement("span", { className: "paren" }, ")"),
        );
      }
      return React.createElement("span", { key: index }, renderMathText(part.text || ""));
    });

  const renderStructuredProblem = () =>
    (() => {
      const problem = normalizeMathText(activeQuestion.problem);
      const equation = normalizeMathText(activeQuestion.lineEquation);
      const axis = normalizeMathText(activeQuestion.reflectionAxis);
      const axisValue = activeQuestion.reflectionAxisValue
        ? normalizeMathText(activeQuestion.reflectionAxisValue)
        : "";
      const equationIndex = problem.indexOf(equation);
      const axisIndex = problem.indexOf(axis, equationIndex + equation.length);
      if (equationIndex < 0 || axisIndex < 0) {
        return React.createElement("span", null, renderMathText(problem));
      }
      const axisValueIndex = axisValue ? axis.indexOf(axisValue) : -1;
      const renderedAxis =
        axisValueIndex >= 0
          ? React.createElement(
              "span",
              { className: "problem-axis-source axis-token" },
              renderMathText(axis.slice(0, axisValueIndex)),
              React.createElement(
                "span",
                { className: "axis-value-source" },
                renderMathText(axisValue),
              ),
              renderMathText(axis.slice(axisValueIndex + axisValue.length)),
            )
          : React.createElement(
              "span",
              { className: "problem-axis-source axis-token" },
              renderMathText(axis),
            );
      return React.createElement(
        "span",
        null,
        renderMathText(problem.slice(0, equationIndex)),
        React.createElement(
          "span",
          { className: "problem-equation-source" },
          renderMathText(equation),
        ),
        renderMathText(
          problem.slice(equationIndex + equation.length, axisIndex),
        ),
        renderedAxis,
        renderMathText(problem.slice(axisIndex + axis.length)),
      );
    })();

  const renderProblem = () =>
    React.createElement(
      "div",
      { className: "line-problem-card" },
      step === 1 && typedProblem.length < plainProblem.length
        ? React.createElement("span", null, renderProblemText(typedProblem))
        : renderStructuredProblem(),
    );

  const renderIntroLine = (index, label, value, kind) => {
    const visible = introLineCount >= index;
    return React.createElement(
      "div",
      { className: "sol-line" + (visible ? " is-visible" : "") },
      React.createElement(
        "div",
        { className: "sol-info" },
        renderMathText(label),
      ),
      React.createElement(
        "div",
        {
          className:
            "sol-data " +
            (kind === "equation"
              ? "line-equation-target"
              : kind === "axis"
                ? "line-axis-target"
                : ""),
        },
        kind === "question"
          ? React.createElement("span", { className: "jump-question" }, "??")
          : introDataCount >= index
            ? renderMathHtml(value, kind === "axis" ? "axis-token" : "")
            : null,
      ),
    );
  };

  const animateTextClone = (sourceEl, targetEl, onDone) => {
    if (!sourceEl || !targetEl) {
      if (typeof onDone === "function") onDone();
      return;
    }
    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const sourceFontSize =
      parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
    const targetFontSize =
      parseFloat(window.getComputedStyle(targetEl).fontSize) || sourceFontSize;
    const dx =
      targetRect.left +
      targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);
    const dy =
      targetRect.top +
      targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);
    setFlyClone({
      text: sourceEl.textContent.trim(),
      left: sourceRect.left + sourceRect.width / 2,
      top: sourceRect.top + sourceRect.height / 2,
      dx: dx,
      dy: dy,
      sourceFontSize: sourceFontSize,
      targetFontSize: targetFontSize,
      active: false,
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() =>
        setFlyClone((clone) => (clone ? { ...clone, active: true } : clone)),
      );
    });
    queue(() => {
      setFlyClone(null);
      if (typeof onDone === "function") onDone();
    }, 760);
  };

  const animateSelectorClone = (sourceSelector, targetSelector, onDone) => {
    animateTextClone(
      document.querySelector(sourceSelector),
      document.querySelector(targetSelector),
      onDone,
    );
  };

  const animateTokenClones = (pairs, onDone) => {
    const nextClones = [];
    pairs.forEach(([sourceSelector, targetSelector], index) => {
      const sourceEl = document.querySelector(sourceSelector);
      const targetEl = document.querySelector(targetSelector);
      if (!sourceEl || !targetEl || !sourceEl.textContent.trim()) return;
      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const sourceFontSize =
        parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
      const targetFontSize =
        parseFloat(window.getComputedStyle(targetEl).fontSize) || sourceFontSize;
      nextClones.push({
        id: "token-clone-" + Date.now() + "-" + index,
        text: sourceEl.textContent.trim(),
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
        active: false,
      });
    });

    if (nextClones.length === 0) {
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
          (clone) => !nextClones.some((nextClone) => nextClone.id === clone.id),
        ),
      );
      if (typeof onDone === "function") onDone();
    }, 780);
  };

  const animateYellowCoordinateBox = (side, onDone) => {
    const isX = side === "x";
    const yellowBoxKey = isX ? "xYellowBox" : "yYellowBox";
    const yellowDoneKey = isX ? "xYellow" : "yYellow";
    const sourcePrefix = ".coord-" + side + "-blue-";
    const targetPrefix = ".coord-" + side + "-yellow-";
    const card = activeQuestion.coordinateCard;
    const coordinateTokens = splitCoordinateSide(
      isX ? card.xBlue : card.yBlue,
      isX ? card.xYellow : card.yYellow,
    );
    setCoordinateParts((parts) => ({ ...parts, [yellowBoxKey]: true }));
    queue(() => {
      const simplePairs =
        coordinateTokens.rhs.length > 1 && coordinateTokens.yellowRhs.length > 1
          ? [
              [
                sourcePrefix + "rhs-token-" + (coordinateTokens.rhs.length - 1),
                targetPrefix + "lhs-token-0",
              ],
              [sourcePrefix + "eq", targetPrefix + "eq"],
              [sourcePrefix + "rhs-token-0", targetPrefix + "rhs-token-0"],
              [
                sourcePrefix + "image-var",
                targetPrefix + "rhs-token-" + (coordinateTokens.yellowRhs.length - 1),
              ],
            ]
          : [
              [sourcePrefix + "rhs-token-0", targetPrefix + "lhs-token-0"],
              [sourcePrefix + "eq", targetPrefix + "eq"],
              [sourcePrefix + "image-var", targetPrefix + "rhs-token-0"],
            ];
      const pairs =
        activeQuestion.step4.simplifyKind === "verticalLineK" && side === "x"
          ? [
              [sourcePrefix + "rhs-token-1", targetPrefix + "lhs-token-0"],
              [sourcePrefix + "eq", targetPrefix + "eq"],
              [sourcePrefix + "rhs-token-0", targetPrefix + "rhs-token-1"],
              [sourcePrefix + "rhs-token-3", targetPrefix + "rhs-token-0"],
              [sourcePrefix + "image-var", targetPrefix + "rhs-token-2"],
            ]
          : simplePairs;
      animateTokenClones(pairs, () => {
        setCoordinateParts((parts) => ({
          ...parts,
          [yellowDoneKey]: true,
        }));
        if (typeof onDone === "function") onDone();
      });
    }, 80);
  };

  const captureFormingSources = () => {
    const rulePairs =
      activeQuestion.step4.simplifyKind === "reflectNegativeDiagonal"
        ? [
            [".coord-y-yellow", ".formed-rule-x"],
            [".coord-x-yellow", ".formed-rule-y"],
          ]
        : [
            [".coord-x-yellow", ".formed-rule-x"],
            [".coord-y-yellow", ".formed-rule-y"],
          ];
    const pairs = [...rulePairs, [".line-equation-target", ".formed-given-line"]];
    const nextSources = [];
    pairs.forEach(([sourceSelector, targetSelector], index) => {
      const sourceEl = document.querySelector(sourceSelector);
      if (!sourceEl) return;
      const sourceRect = sourceEl.getBoundingClientRect();
      const sourceFontSize =
        parseFloat(window.getComputedStyle(sourceEl).fontSize) || 42;
      nextSources.push({
        id: "forming-" + index,
        text: sourceEl.textContent.trim(),
        left: sourceRect.left + sourceRect.width / 2,
        top: sourceRect.top + sourceRect.height / 2,
        sourceFontSize: sourceFontSize,
        targetSelector: targetSelector,
      });
    });
    setFormingSources(nextSources);
  };

  const handleRuleOption = (index, event) => {
    if (ruleStatus !== "pending") return;
    const isCorrect = index === activeQuestion.ruleCorrectIndex;
    setRuleSelected(index);
    if (typeof playSound === "function")
      playSound(isCorrect ? "correct" : "wrong");

    if (!isCorrect) {
      setRuleStatus("wrong");
      queue(() => {
        setRuleSelected(null);
        setRuleStatus("pending");
      }, 650);
      return;
    }

    setRuleStatus("animating");
    makeReady(false);
    const target = document.querySelector(".intro-rule-answer-target");
    animateTextClone(event.currentTarget, target, () => {
      setRuleStatus("correct");
      const cardDelay = 600;
      const pause = 500;
      const flyDuration = 760;
      const start1 = cardDelay;
      const fly1 = start1 + pause;
      const or1 = fly1 + flyDuration + pause;
      const yellow1 = or1 + pause;
      const start2 = yellow1 + flyDuration + pause;
      const fly2 = start2 + pause;
      const or2 = fly2 + flyDuration + pause;
      const yellow2 = or2 + pause;

      queue(() => {
        setCoordinatePhase(1);
        setCoordinateParts((parts) => ({ ...parts, xBlue: true }));
      }, start1);
      queue(
        () =>
          animateSelectorClone(".rule-x-source", ".coord-x-rhs", () => {
            setCoordinateParts((parts) => ({ ...parts, xRhs: true }));
          }),
        fly1,
      );
      queue(
        () => setCoordinateParts((parts) => ({ ...parts, xOr: true })),
        or1,
      );
      queue(
        () => animateYellowCoordinateBox("x"),
        yellow1,
      );
      queue(
        () => setCoordinateParts((parts) => ({ ...parts, yBlue: true })),
        start2,
      );
      queue(
        () =>
          animateSelectorClone(".rule-y-source", ".coord-y-rhs", () => {
            setCoordinateParts((parts) => ({ ...parts, yRhs: true }));
          }),
        fly2,
      );
      queue(
        () => setCoordinateParts((parts) => ({ ...parts, yOr: true })),
        or2,
      );
      queue(
        () => animateYellowCoordinateBox("y"),
        yellow2,
      );
      queue(() => makeReady(true), yellow2 + flyDuration + pause);
    });
  };

  const renderRuleOptions = () =>
    React.createElement(
      "div",
      { className: "line-options no-feedback-options" },
      activeQuestion.ruleOptions.map((option, index) => {
        let className = "line-option";
        if (
          ruleSelected === index &&
          index === activeQuestion.ruleCorrectIndex &&
          ruleStatus !== "pending"
        ) {
          className += " is-correct";
        }
        if (
          ruleSelected === index &&
          index !== activeQuestion.ruleCorrectIndex &&
          ruleStatus === "wrong"
        ) {
          className += " is-wrong";
        }
        return React.createElement("button", {
          key: index,
          type: "button",
          className: className,
          disabled: ruleStatus !== "pending",
          children: renderMathText(option.replace(/&rarr;/g, "\u2192")),
          onClick: (event) => handleRuleOption(index, event),
        });
      }),
    );

  const splitCoordinateSide = (blueParts, yellowText) => {
    const imageVar = normalizeMathText(blueParts[0]).split("=")[0].trim();
    const rhs = normalizeMathText(blueParts[1]).trim();
    const yellowPieces = normalizeMathText(yellowText).split("=");
    const yellowLhs = (yellowPieces[0] || "").trim();
    const yellowRhs = (yellowPieces[1] || "").trim();
    const splitTerm = (term) =>
      (term.match(/2k|[xy]'?|k|[+\-\u2212]/g) || [term]).map((token) =>
        token === "-" ? "\u2212" : token,
      );
    return {
      imageVar: imageVar,
      rhs: splitTerm(rhs),
      yellowLhs: splitTerm(yellowLhs),
      yellowRhs: splitTerm(yellowRhs),
    };
  };

  const renderCoordinateToken = (text, className, visible = true) =>
    React.createElement(
      "span",
      { className: "coord-token " + className + (visible ? "" : " is-pending") },
      text ? renderMathText(text) : "",
    );

  const renderCoordinateTokens = (tokens, prefix, visible = true) =>
    tokens.map((token, index) =>
      renderCoordinateToken(token, prefix + "token-" + index, visible),
    );

  const renderCoordinateColumn = (side) => {
    const isX = side === "x";
    const card = activeQuestion.coordinateCard;
    const blueParts = isX ? card.xBlue : card.yBlue;
    const yellowText = isX ? card.xYellow : card.yYellow;
    const coordinateTokens = splitCoordinateSide(blueParts, yellowText);
    const firstVisible = isX ? coordinateParts.xBlue : coordinateParts.yBlue;
    const rhsVisible = isX ? coordinateParts.xRhs : coordinateParts.yRhs;
    const orVisible = isX ? coordinateParts.xOr : coordinateParts.yOr;
    const yellowBoxVisible = isX
      ? coordinateParts.xYellowBox || coordinateParts.xYellow
      : coordinateParts.yYellowBox || coordinateParts.yYellow;
    const thirdVisible = isX
      ? coordinateParts.xYellow
      : coordinateParts.yYellow;
    const bluePrefix = "coord-" + side + "-blue-";
    const yellowPrefix = "coord-" + side + "-yellow-";
    return React.createElement(
      "div",
      { className: "coordinate-column" },
      React.createElement(
        "div",
        {
          className:
            "coordinate-box blue-box " +
            (isX ? "coord-x-blue" : "coord-y-blue") +
            (firstVisible ? " is-visible" : ""),
        },
        React.createElement(
          React.Fragment,
          null,
          renderCoordinateToken(
            coordinateTokens.imageVar,
            bluePrefix + "image-var " + bluePrefix + "image-token-0",
          ),
          renderCoordinateToken("=", bluePrefix + "eq"),
          React.createElement(
            "span",
            { className: isX ? "coord-x-rhs" : "coord-y-rhs" },
            rhsVisible
              ? React.createElement(
                  React.Fragment,
                  null,
                  renderCoordinateTokens(coordinateTokens.rhs, bluePrefix + "rhs-"),
                )
              : null,
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "coordinate-or" + (orVisible ? " is-visible" : "") },
        labels.or,
      ),
      React.createElement(
        "div",
        {
          className:
            "coordinate-box yellow-box " +
            (isX ? "coord-x-yellow" : "coord-y-yellow") +
            (yellowBoxVisible ? " is-visible" : ""),
        },
        React.createElement(
          React.Fragment,
          null,
          renderCoordinateTokens(
            coordinateTokens.yellowLhs,
            yellowPrefix + "lhs-",
            thirdVisible,
          ),
          renderCoordinateToken("=", yellowPrefix + "eq", thirdVisible),
          renderCoordinateTokens(
            coordinateTokens.yellowRhs,
            yellowPrefix + "rhs-",
            thirdVisible,
          ),
        ),
      ),
    );
  };

  const renderStepOneOrTwoMath = () =>
    React.createElement(
      React.Fragment,
      null,
      renderIntroLine(
        1,
        labels.equationGivenLine,
        activeQuestion.lineEquation,
        "equation",
      ),
      renderIntroLine(
        2,
        labels.lineReflection,
        activeQuestion.reflectionAxis,
        "axis",
      ),
      React.createElement(
        "div",
        { className: "sol-line" + (introLineCount >= 3 ? " is-visible" : "") },
        React.createElement(
          "div",
          { className: "sol-info" },
          renderMathText(activeQuestion.ruleLineLabel),
        ),
        React.createElement(
          "div",
          { className: "sol-data intro-rule-answer-target" },
          ruleStatus === "correct"
            ? renderRuleTuple(activeQuestion.ruleAnswer)
            : React.createElement("span", { className: "jump-question" }, "??"),
        ),
      ),
      step === 2 && coordinatePhase > 0
        ? React.createElement(
            "div",
            { className: "sol-card coordinate-card is-visible" },
            React.createElement(
              "div",
              { className: "sol-card-title" },
              renderMathText(labels.coordinatesImage),
            ),
            React.createElement(
              "div",
              { className: "coordinate-card-grid" },
              renderCoordinateColumn("x"),
              renderCoordinateColumn("y"),
            ),
          )
        : null,
    );

  const handleNumpadValue = (value) => {
    if (!activeBox || boxStatus[activeBox] === "correct") return;
    setNumpadFeedback("");
    setBoxStatus((prev) => ({ ...prev, [activeBox]: "active" }));
    setSubValues((prev) => ({ ...prev, [activeBox]: prev[activeBox] + value }));
  };

  const handleNumpadClear = () => {
    if (!activeBox || boxStatus[activeBox] === "correct") return;
    if (typeof playSound === "function") playSound("click");
    setNumpadFeedback("");
    setBoxStatus((prev) => ({ ...prev, [activeBox]: "active" }));
    setSubValues((prev) => ({ ...prev, [activeBox]: "" }));
  };

  const handleNumpadSubmit = () => {
    if (!activeBox || boxStatus[activeBox] === "correct") return;
    const expected = activeQuestion.step3.answers[activeBox];
    const userValue = subValues[activeBox].replace(/\s/g, "");
    const isCorrect = userValue === expected;
    if (typeof playSound === "function")
      playSound(isCorrect ? "correct" : "wrong");

    if (!isCorrect) {
      setNumpadFeedback(
        activeBox === "x" ? step3Data.feedback.wrongX : step3Data.feedback.wrongY,
      );
      setBoxStatus((prev) => ({ ...prev, [activeBox]: "wrong" }));
      queue(() => {
        setSubValues((prev) => ({ ...prev, [activeBox]: "" }));
        setBoxStatus((prev) => ({ ...prev, [activeBox]: "active" }));
      }, 650);
      return;
    }

    setNumpadFeedback("");
    setSubValues((prev) => ({ ...prev, [activeBox]: expected }));
    if (activeBox === "x") {
      setBoxStatus({ x: "correct", y: "active" });
      setActiveBox("y");
    } else {
      setBoxStatus({ x: "correct", y: "correct" });
      setActiveBox(null);
      makeReady(true);
    }
  };

  const renderSubBox = (name) =>
    React.createElement(
      "span",
      {
        className:
          "sub-box " +
          name +
          "-token " +
          (boxStatus[name] || "idle") +
          (activeBox === name ? " is-active" : ""),
      },
      subValues[name]
        ? renderMathText(subValues[name])
        : activeBox === name
          ? React.createElement("span", { className: "caret" })
          : "",
    );

  const renderStepThreeMath = () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          className:
            "sol-line transform-line collapsible-line" +
            (formedStepThree ? " is-visible" : "") +
            (collapseBeforeFinal ? " is-collapsing" : ""),
        },
        React.createElement(
          "div",
          { className: "sol-info" },
          renderMathText(labels.ruleReflection),
        ),
        React.createElement(
          "div",
          { className: "sol-data rule-pair" },
          React.createElement(
            "span",
            { className: "x-token formed-rule-x" },
            formedStepThree ? renderMathText(activeQuestion.step3.ruleX) : null,
          ),
          React.createElement(
            "span",
            { className: "y-token formed-rule-y" },
            formedStepThree ? renderMathText(activeQuestion.step3.ruleY) : null,
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "sol-line transform-line collapsible-line" +
            (formedStepThree ? " is-visible" : "") +
            (collapseBeforeFinal ? " is-collapsing" : ""),
        },
        React.createElement(
          "div",
          { className: "sol-info" },
          renderMathText(labels.givenLine),
        ),
        React.createElement(
          "div",
          { className: "sol-data equation-large formed-given-line" },
          renderFormulaParts(activeQuestion.step3.givenParts),
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "sol-card substitution-card" +
            (showStepThreeCard ? " is-visible" : ""),
        },
        React.createElement(
          "div",
          { className: "sol-card-title" },
          renderMathText(labels.equationReflectedLine),
        ),
        React.createElement(
          "div",
          { className: "substitution-expression" },
          renderFormulaParts(activeQuestion.step3.answerParts),
        ),
      ),
    );

  const handleSimplifyOption = (index, event) => {
    if (simplifyStatus === "correct") return;
    const isCorrect = index === activeQuestion.step4.correctIndex;
    setSimplifySelected(index);
    if (typeof playSound === "function")
      playSound(isCorrect ? "correct" : "wrong");

    if (!isCorrect) {
      setSimplifyStatus("wrong");
      queue(() => {
        setSimplifySelected(null);
        setSimplifyStatus("pending");
      }, 850);
      return;
    }

    setSimplifyStatus("correct");
    setStepFourPhase("selected");
    queue(() => setStepFourPhase("feedbackCollapsed"), 600);
    queue(() => {
      setStepFourPhase("building");
      animateSelectorClone(".step4-substitution-expression", ".step4-working-line-target", () => {
        setStepFourPhase("copied");
        if (activeQuestion.step4.simplifyKind === "verticalLineK") {
          queue(
            () =>
              animateSelectorClone(".axis-value-source", ".q4-k-target", () => {
                setStepFourPhase("replaceK");
              }),
            850,
          );
          queue(() => setStepFourPhase("simplifyK"), 2400);
          queue(() => {
            setStepFourPhase("distributePrep");
            queue(
              () =>
                animateTokenClones(
                  [
                    [".q4-distribute-source", ".q4-distribute-target-a"],
                    [".q4-distribute-source", ".q4-distribute-target-b"],
                  ],
                  () => setStepFourPhase("distribute"),
                ),
              140,
            );
          }, 3700);
          queue(() => setStepFourPhase("substitute8"), 5600);
          queue(() => setStepFourPhase("cleanSigns"), 7100);
          queue(() => setStepFourPhase("rearrangeFinal"), 8600);
          queue(() => setStepFourPhase("combineConstants"), 10100);
          queue(() => {
            setStepFourPhase("final");
            if (typeof playSound === "function") playSound("congrats");
            makeReady(true);
          }, 11700);
          return;
        }
        if (activeQuestion.step4.simplifyKind === "reflectNegativeDiagonal") {
          queue(() => setStepFourPhase("combineNegatives"), 900);
          queue(() => setStepFourPhase("removeBrackets"), 2400);
          queue(() => setStepFourPhase("rearrangeFinal"), 3600);
          queue(() => {
            setStepFourPhase("final");
            if (typeof playSound === "function") playSound("congrats");
            makeReady(true);
          }, 5000);
          return;
        }
        queue(() => setStepFourPhase("combineNegatives"), 900);
        queue(() => setStepFourPhase("removeBrackets"), 2100);
        queue(() => {
          setStepFourPhase("final");
          if (typeof playSound === "function") playSound("congrats");
          makeReady(true);
        }, 3600);
      });
    }, 1300);
  };

  const renderStepFourWorkingLine = () => {
    const visible =
      stepFourPhase === "copied" ||
      stepFourPhase === "removeBrackets" ||
      stepFourPhase === "combineNegatives" ||
      stepFourPhase === "rearrangeFinal" ||
      stepFourPhase === "replaceK" ||
      stepFourPhase === "simplifyK" ||
      stepFourPhase === "distributePrep" ||
      stepFourPhase === "distribute" ||
      stepFourPhase === "substitute8" ||
      stepFourPhase === "cleanSigns" ||
      stepFourPhase === "combineConstants" ||
      stepFourPhase === "final";
    const final = stepFourPhase === "final";
    const bracketsGone =
      stepFourPhase === "removeBrackets" ||
      stepFourPhase === "rearrangeFinal" ||
      final;
    const negativesCombined =
      stepFourPhase === "combineNegatives" ||
      stepFourPhase === "removeBrackets" ||
      stepFourPhase === "rearrangeFinal" ||
      final;

    const className =
      "step4-working-line step4-working-line-target " +
      activeQuestion.step4.simplifyKind +
      (visible ? " is-visible" : "") +
      (bracketsGone ? " brackets-gone" : "") +
      (negativesCombined ? " negatives-combined" : "") +
      (final ? " is-final" : "");

    if (activeQuestion.step4.simplifyKind === "plusNegative") {
      return React.createElement(
        "div",
        { className: className },
        React.createElement("span", null, "4"),
        React.createElement("span", { className: "working-bracket" }, "("),
        React.createElement("span", { className: "x-token" }, renderMathText("x")),
        React.createElement("span", { className: "working-bracket" }, ")"),
        React.createElement(
          "span",
          { className: "working-operator-slot" },
          React.createElement("span", { className: "working-plus-original" }, "+"),
          React.createElement("span", { className: "working-minus-result" }, "\u2212"),
        ),
        React.createElement("span", { className: "working-bracket" }, "("),
        React.createElement("span", { className: "working-inner-negative" }, "\u2212"),
        React.createElement("span", { className: "y-token" }, renderMathText("y")),
        React.createElement("span", { className: "working-bracket" }, ")"),
        React.createElement("span", null, " = 6"),
      );
    }

    if (activeQuestion.step4.simplifyKind === "verticalLineK") {
      if (final) {
        return React.createElement(
          "div",
          { className: className },
          renderMathText(activeQuestion.step4.finalAnswer),
        );
      }
      if (stepFourPhase === "rearrangeFinal") {
        return React.createElement(
          "div",
          { className: className },
          React.createElement(ReflectionRearrangeAnimation, {
            from: "8+2x\u2212y+1=0",
            to: "2x\u2212y+8+1=0",
            renderText: renderMathText,
          }),
        );
      }
      if (stepFourPhase === "combineConstants") {
        return React.createElement(
          "div",
          { className: className + " q4-phase-line" },
          renderMathText("2x\u2212y+"),
          React.createElement(
            "span",
            { className: "q4-fade-swap" },
            React.createElement(
              "span",
              { className: "q4-fade-out" },
              renderMathText("8+1"),
            ),
            React.createElement(
              "span",
              { className: "q4-fade-in" },
              renderMathText("9"),
            ),
          ),
          renderMathText("=0"),
        );
      }
      if (stepFourPhase === "substitute8") {
        return React.createElement(
          "div",
          { className: className + " q4-phase-line" },
          React.createElement(
            "span",
            { className: "q4-fade-swap" },
            React.createElement(
              "span",
              { className: "q4-fade-out" },
              renderMathText("\u22122\u00d7\u22124"),
            ),
            React.createElement(
              "span",
              { className: "q4-fade-in" },
              renderMathText("8"),
            ),
          ),
          renderMathText("\u2212(\u22122)x\u2212(y)+1=0"),
        );
      }
      if (stepFourPhase === "cleanSigns") {
        return React.createElement(
          "div",
          { className: className + " q4-phase-line" },
          React.createElement(
            "span",
            { className: "q4-fade-swap" },
            React.createElement(
              "span",
              { className: "q4-fade-out" },
              renderMathText("8\u2212(\u22122)x\u2212(y)+1=0"),
            ),
            React.createElement(
              "span",
              { className: "q4-fade-in" },
              renderMathText("8+2x\u2212y+1=0"),
            ),
          ),
        );
      }
      if (stepFourPhase === "distributePrep") {
        return React.createElement(
          "div",
          { className: className + " q4-phase-line q4-distribute-stage" },
          React.createElement(
            "span",
            { className: "q4-visible-source-line" },
            React.createElement(
              "span",
              { className: "q4-distribute-source" },
              renderMathText("\u22122"),
            ),
            renderMathText("(\u22124\u2212x)\u2212(y)+1=0"),
          ),
          React.createElement(
            "span",
            { className: "q4-hidden-target-line", "aria-hidden": "true" },
            React.createElement("span", null, "("),
            React.createElement(
              "span",
              { className: "q4-distribute-target-a" },
              renderMathText("\u22122"),
            ),
            renderMathText("\u00d7\u22124\u2212("),
            React.createElement(
              "span",
              { className: "q4-distribute-target-b" },
              renderMathText("\u22122"),
            ),
            renderMathText(")x)\u2212(y)+1=0"),
          ),
        );
      }
      if (stepFourPhase === "distribute") {
        return React.createElement(
          "div",
          { className: className + " q4-phase-line" },
          renderMathText("(\u22122\u00d7\u22124\u2212(\u22122)x)\u2212(y)+1=0"),
        );
      }
      if (stepFourPhase === "simplifyK") {
        return React.createElement(
          "div",
          { className: className + " q4-phase-line" },
          renderMathText("\u22122("),
          React.createElement(
            "span",
            { className: "q4-fade-swap" },
            React.createElement(
              "span",
              { className: "q4-fade-out" },
              renderMathText("2\u00d7(\u22122)"),
            ),
            React.createElement(
              "span",
              { className: "q4-fade-in" },
              renderMathText("\u22124"),
            ),
          ),
          renderMathText("\u2212x)\u2212(y)+1=0"),
        );
      }
      if (stepFourPhase === "replaceK") {
        return React.createElement(
          "div",
          { className: className + " q4-phase-line" },
          renderMathText("\u22122(2\u00d7(\u22122)\u2212x)\u2212(y)+1=0"),
        );
      }
      return React.createElement(
        "div",
        { className: className + " q4-phase-line" },
        React.createElement("span", null, "\u22122(2"),
        React.createElement("span", { className: "q4-k-target" }, renderMathText("k")),
        React.createElement("span", null, "\u2212"),
        React.createElement("span", { className: "x-token" }, renderMathText("x")),
        React.createElement("span", null, ")\u2212("),
        React.createElement("span", { className: "y-token" }, renderMathText("y")),
        React.createElement("span", null, ")+1=0"),
      );
    }

    if (activeQuestion.step4.simplifyKind === "reflectNegativeDiagonal") {
      const multiplied =
        stepFourPhase === "combineNegatives" ||
        stepFourPhase === "removeBrackets";
      if (final) {
        return React.createElement(
          "div",
          { className: className },
          renderMathText(activeQuestion.step4.finalAnswer),
        );
      }
      if (stepFourPhase === "rearrangeFinal") {
        return React.createElement(
          "div",
          { className: className },
          React.createElement(ReflectionRearrangeAnimation, {
            from: "\u22125y\u2212x\u22126=0",
            to: "x+5y+6=0",
            renderText: renderMathText,
          }),
        );
      }
      if (stepFourPhase === "combineNegatives") {
        return React.createElement(
          "div",
          { className: className },
          React.createElement(ReflectionRearrangeAnimation, {
            from: "5(\u2212y)+(\u2212x)\u22126=0",
            to: "\u22125(y)\u2212(x)\u22126=0",
            renderText: renderMathText,
          }),
        );
      }
      return React.createElement(
        "div",
        { className: className + (multiplied ? " diagonal-multiplied" : "") },
        multiplied
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement("span", { className: "working-leading-negative" }, "\u2212"),
              React.createElement("span", null, "5"),
              React.createElement("span", { className: "working-bracket" }, "("),
              React.createElement("span", { className: "y-token" }, renderMathText("y")),
              React.createElement("span", { className: "working-bracket" }, ")"),
              React.createElement("span", null, " \u2212 "),
              React.createElement("span", { className: "working-bracket" }, "("),
              React.createElement("span", { className: "x-token" }, renderMathText("x")),
              React.createElement("span", { className: "working-bracket" }, ")"),
              React.createElement("span", null, " \u2212 6 = 0"),
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement("span", null, "5"),
              React.createElement("span", { className: "working-bracket" }, "("),
              React.createElement("span", { className: "working-inner-negative" }, "\u2212"),
              React.createElement("span", { className: "y-token" }, renderMathText("y")),
              React.createElement("span", { className: "working-bracket" }, ")"),
              React.createElement("span", null, " + "),
              React.createElement("span", { className: "working-bracket" }, "("),
              React.createElement("span", { className: "working-inner-negative" }, "\u2212"),
              React.createElement("span", { className: "x-token" }, renderMathText("x")),
              React.createElement("span", { className: "working-bracket" }, ")"),
              React.createElement("span", null, " \u2212 6 = 0"),
            ),
      );
    }

    return React.createElement(
      "div",
      { className: className },
      React.createElement("span", null, "3"),
      React.createElement("span", { className: "working-bracket" }, "("),
      React.createElement("span", { className: "x-token" }, renderMathText("x")),
      React.createElement("span", { className: "working-bracket" }, ")"),
      React.createElement(
        "span",
        { className: "working-operator-slot" },
        React.createElement("span", { className: "working-minus" }, "\u2212"),
        React.createElement("span", { className: "working-plus" }, "+"),
      ),
      React.createElement("span", null, "2"),
      React.createElement("span", { className: "working-bracket" }, "("),
      React.createElement("span", { className: "working-inner-negative" }, "\u2212"),
      React.createElement("span", { className: "y-token" }, renderMathText("y")),
      React.createElement("span", { className: "working-bracket" }, ")"),
      React.createElement("span", null, " = 1"),
    );
  };

  const renderStepFourMath = () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "sol-card substitution-card compact is-visible" },
        React.createElement(
          "div",
          { className: "sol-card-title" },
          renderMathText(labels.equationReflectedLine),
        ),
        React.createElement(
          "div",
          { className: "substitution-expression step4-substitution-expression" },
          renderFormulaParts(activeQuestion.step4.substitutionParts),
        ),
      ),
      renderStepFourWorkingLine(),
    );

  const renderSimplifyOptions = () =>
    React.createElement(
      "div",
      {
        className:
          "line-options simplify-options" +
          (simplifyStatus === "correct" ? " is-pruning" : ""),
      },
      activeQuestion.step4.options.map((option, index) => {
        let className = "line-option";
        if (
          simplifyStatus === "correct" &&
          index !== activeQuestion.step4.correctIndex
        ) {
          className += " is-collapsing";
        }
        if (
          simplifySelected === index &&
          index === activeQuestion.step4.correctIndex &&
          simplifyStatus === "correct"
        ) {
          className += " is-correct";
        }
        if (
          simplifySelected === index &&
          index !== activeQuestion.step4.correctIndex &&
          simplifyStatus === "wrong"
        ) {
          className += " is-wrong";
        }
        return React.createElement("button", {
          key: index,
          type: "button",
          className: className,
          disabled: simplifyStatus === "correct" || className.indexOf("is-collapsing") >= 0,
          children: renderMathText(option),
          onClick: (event) => handleSimplifyOption(index, event),
        });
      }),
    );

  const renderRightPanel = () => {
    if (step === 1) {
      return React.createElement("div", {
        className: "right-text-panel" + (rightVisible ? " is-visible" : ""),
        dangerouslySetInnerHTML: { __html: step1Data.rightPanel.exploreDetails },
      });
    }
    if (step === 2) {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className: "right-title",
          dangerouslySetInnerHTML: { __html: activeQuestion.ruleQuestion },
        }),
        renderRuleOptions(),
      );
    }
    if (step === 3) {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className: "right-feedback-space",
          dangerouslySetInnerHTML: { __html: numpadFeedback },
        }),
        React.createElement("div", {
          className: "right-title compact-title",
          dangerouslySetInnerHTML: { __html: step3Data.rightPanel.numpadHelp },
        }),
        React.createElement(Numpad, {
          disabled: activeBox === null,
          keys: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "2k",
            "x'",
            "y'",
            "+",
            "-",
            "clear",
            "submit",
          ],
          clearLabel: numpad.clearLabel,
          submitLabel: numpad.submitLabel,
          plusLabel: numpad.plusLabel,
          minusLabel: numpad.minusLabel,
          onValue: handleNumpadValue,
          onClear: handleNumpadClear,
          onSubmit: handleNumpadSubmit,
        }),
      );
    }
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          className:
            "right-feedback-space mcq-feedback " +
            simplifyStatus +
            (stepFourPhase !== "idle" && stepFourPhase !== "selected"
              ? " is-collapsed"
              : ""),
        },
        simplifyStatus === "wrong"
          ? step4Data.feedback.tryAgain
          : "",
      ),
      React.createElement("div", {
        className: "right-title simplify-title",
        dangerouslySetInnerHTML: { __html: step4Data.rightPanel.simplifyTitle },
      }),
      renderSimplifyOptions(),
    );
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "main-canvas-container line-reflection-canvas" },
      React.createElement(
        "section",
        { className: "math-column" },
        renderProblem(),
        React.createElement(
          "div",
          { className: "solution-row" },
          step <= 2
            ? renderStepOneOrTwoMath()
            : step === 3
              ? renderStepThreeMath()
              : renderStepFourMath(),
        ),
      ),
      React.createElement(
        "aside",
        { className: "action-column" },
        renderRightPanel(),
      ),
    ),
    flyClone
      ? React.createElement(
          "div",
          {
            className: "reflection-fly-clone",
            style: {
              left: flyClone.left + "px",
              top: flyClone.top + "px",
              fontSize:
                (flyClone.active
                  ? flyClone.targetFontSize
                  : flyClone.sourceFontSize) + "px",
              transform: flyClone.active
                ? "translate(calc(-50% + " +
                  flyClone.dx +
                  "px), calc(-50% + " +
                  flyClone.dy +
                  "px))"
                : "translate(-50%, -50%)",
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
          className: "reflection-fly-clone",
          style: {
            left: clone.left + "px",
            top: clone.top + "px",
            fontSize:
              (clone.active ? clone.targetFontSize : clone.sourceFontSize) +
              "px",
            transform: clone.active
              ? "translate(calc(-50% + " +
                clone.dx +
                "px), calc(-50% + " +
                clone.dy +
                "px))"
              : "translate(-50%, -50%)",
          },
        },
        renderMathText(clone.text),
      ),
    ),
  );
});
