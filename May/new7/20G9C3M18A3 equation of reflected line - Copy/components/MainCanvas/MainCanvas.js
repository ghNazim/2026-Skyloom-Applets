const MainCanvas = React.forwardRef(({ step, onReadyChange }, ref) => {
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
    xYellow: false,
    yBlue: false,
    yRhs: false,
    yOr: false,
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
  const plainProblem = data.challenge.problem.replace(/&minus;/g, "-");
  const emptyCoordinateParts = {
    xBlue: false,
    xRhs: false,
    xOr: false,
    xYellow: false,
    yBlue: false,
    yRhs: false,
    yOr: false,
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
      setSubValues({ x: "x'", y: "-y'" });
      setBoxStatus({ x: "plain", y: "plain" });
      setSimplifySelected(null);
      setSimplifyStatus("pending");
      setStepFourPhase("idle");
    }

    return clearTimers;
  }, [step, plainProblem, clearTimers, makeReady, queue]);

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
          (char === "x" || char === "y") && !isLetterBefore && !isLetterAfter;
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

  const renderStructuredProblem = () =>
    (() => {
      const problem = normalizeMathText(data.challenge.problem);
      const equation = normalizeMathText(data.challenge.lineEquation);
      const axis = normalizeMathText(data.challenge.reflectionAxis);
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
          { className: "problem-equation-source" },
          renderMathText(equation),
        ),
        renderMathText(
          problem.slice(equationIndex + equation.length, axisIndex),
        ),
        React.createElement(
          "span",
          { className: "problem-axis-source axis-token" },
          renderMathText(axis),
        ),
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

  const captureFormingSources = () => {
    const pairs = [
      [".coord-x-yellow", ".formed-rule-x"],
      [".coord-y-yellow", ".formed-rule-y"],
      [".line-equation-target", ".formed-given-line"],
    ];
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
    const isCorrect = index === step2Data.options.ruleCorrectIndex;
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
        () =>
          animateSelectorClone(".coord-x-blue", ".coord-x-yellow", () => {
            setCoordinateParts((parts) => ({ ...parts, xYellow: true }));
          }),
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
        () =>
          animateSelectorClone(".coord-y-blue", ".coord-y-yellow", () => {
            setCoordinateParts((parts) => ({ ...parts, yYellow: true }));
          }),
        yellow2,
      );
      queue(() => makeReady(true), yellow2 + flyDuration + pause);
    });
  };

  const renderRuleOptions = () =>
    React.createElement(
      "div",
      { className: "line-options no-feedback-options" },
      step2Data.options.rule.map((option, index) => {
        let className = "line-option";
        if (
          ruleSelected === index &&
          index === step2Data.options.ruleCorrectIndex &&
          ruleStatus !== "pending"
        ) {
          className += " is-correct";
        }
        if (
          ruleSelected === index &&
          index !== step2Data.options.ruleCorrectIndex &&
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

  const renderCoordinateColumn = (side) => {
    const isX = side === "x";
    const firstVisible = isX ? coordinateParts.xBlue : coordinateParts.yBlue;
    const rhsVisible = isX ? coordinateParts.xRhs : coordinateParts.yRhs;
    const orVisible = isX ? coordinateParts.xOr : coordinateParts.yOr;
    const thirdVisible = isX
      ? coordinateParts.xYellow
      : coordinateParts.yYellow;
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
        isX
          ? React.createElement(
              React.Fragment,
              null,
              renderMathHtml("x' = "),
              React.createElement(
                "span",
                { className: "coord-x-rhs" },
                rhsVisible ? renderMathText("x") : null,
              ),
            )
          : React.createElement(
              React.Fragment,
              null,
              renderMathHtml("y' = "),
              React.createElement(
                "span",
                { className: "coord-y-rhs" },
                rhsVisible ? renderMathText("-y") : null,
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
            (thirdVisible ? " is-visible" : ""),
        },
        isX ? renderMathHtml("x = x'") : renderMathHtml("y = &minus;y'"),
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
        data.challenge.lineEquation,
        "equation",
      ),
      renderIntroLine(
        2,
        labels.lineReflection,
        data.challenge.reflectionAxis,
        "axis",
      ),
      React.createElement(
        "div",
        { className: "sol-line" + (introLineCount >= 3 ? " is-visible" : "") },
        React.createElement(
          "div",
          { className: "sol-info" },
          renderMathText(labels.ruleAcrossXAxis),
        ),
        React.createElement(
          "div",
          { className: "sol-data intro-rule-answer-target" },
          ruleStatus === "correct"
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement("span", null, "("),
                React.createElement(
                  "span",
                  { className: "rule-x-source" },
                  renderMathText("x"),
                ),
                React.createElement("span", null, ", "),
                React.createElement(
                  "span",
                  { className: "rule-original-y-source" },
                  renderMathText("y"),
                ),
                React.createElement("span", null, ") \u2192 ("),
                React.createElement(
                  "span",
                  { className: "rule-image-x-source" },
                  renderMathText("x"),
                ),
                React.createElement("span", null, ", "),
                React.createElement(
                  "span",
                  { className: "rule-y-source" },
                  renderMathText("-y"),
                ),
                React.createElement("span", null, ")"),
              )
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
    const expected = activeBox === "x" ? "x'" : "-y'";
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
            formedStepThree ? renderMathText("x = x'") : null,
          ),
          React.createElement(
            "span",
            { className: "y-token formed-rule-y" },
            formedStepThree ? renderMathText("y = -y'") : null,
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
          React.createElement("span", null, "3"),
          React.createElement("span", null, "("),
          React.createElement(
            "span",
            { className: "x-token" },
            renderMathText("x"),
          ),
          React.createElement("span", null, ")"),
          React.createElement("span", null, " - 2"),
          React.createElement("span", null, "("),
          React.createElement(
            "span",
            { className: "y-token" },
            renderMathText("y"),
          ),
          React.createElement("span", null, ")"),
          React.createElement("span", null, " = 1"),
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
          React.createElement("span", null, "3"),
          React.createElement("span", { className: "paren" }, "("),
          renderSubBox("x"),
          React.createElement("span", { className: "paren" }, ")"),
          React.createElement("span", null, " - 2"),
          React.createElement("span", { className: "paren" }, "("),
          renderSubBox("y"),
          React.createElement("span", { className: "paren" }, ")"),
          React.createElement("span", null, " = 1"),
        ),
      ),
    );

  const handleSimplifyOption = (index, event) => {
    if (simplifyStatus === "correct") return;
    const isCorrect = index === step4Data.options.simplifyCorrectIndex;
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
      stepFourPhase === "final";
    const final = stepFourPhase === "final";
    const bracketsGone =
      stepFourPhase === "removeBrackets" ||
      final;
    const negativesCombined =
      stepFourPhase === "combineNegatives" ||
      stepFourPhase === "removeBrackets" ||
      final;

    return React.createElement(
      "div",
      {
        className:
          "step4-working-line step4-working-line-target" +
          (visible ? " is-visible" : "") +
          (bracketsGone ? " brackets-gone" : "") +
          (negativesCombined ? " negatives-combined" : "") +
          (final ? " is-final" : ""),
      },
      React.createElement("span", null, "3"),
      React.createElement("span", { className: "working-bracket" }, "("),
      React.createElement("span", { className: "x-token" }, renderMathText("x")),
      React.createElement("span", { className: "working-bracket" }, ")"),
      React.createElement(
        "span",
        { className: "working-operator-slot" },
        React.createElement("span", { className: "working-minus" }, "-"),
        React.createElement("span", { className: "working-plus" }, "+"),
      ),
      React.createElement("span", null, "2"),
      React.createElement("span", { className: "working-bracket" }, "("),
      React.createElement("span", { className: "working-inner-negative" }, "-"),
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
          React.createElement("span", null, "3"),
          React.createElement("span", { className: "paren" }, "("),
          React.createElement(
            "span",
            { className: "sub-box plain x-token" },
            renderMathText("x'"),
          ),
          React.createElement("span", { className: "paren" }, ")"),
          React.createElement("span", null, " - 2"),
          React.createElement("span", { className: "paren" }, "("),
          React.createElement(
            "span",
            { className: "sub-box plain y-token" },
            renderMathText("-y'"),
          ),
          React.createElement("span", { className: "paren" }, ")"),
          React.createElement("span", null, " = 1"),
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
      step4Data.options.simplify.map((option, index) => {
        let className = "line-option";
        if (
          simplifyStatus === "correct" &&
          index !== step4Data.options.simplifyCorrectIndex
        ) {
          className += " is-collapsing";
        }
        if (
          simplifySelected === index &&
          index === step4Data.options.simplifyCorrectIndex &&
          simplifyStatus === "correct"
        ) {
          className += " is-correct";
        }
        if (
          simplifySelected === index &&
          index !== step4Data.options.simplifyCorrectIndex &&
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
          dangerouslySetInnerHTML: { __html: step2Data.rightPanel.ruleQuestion },
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
            "0",
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
