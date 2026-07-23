const MainCanvas = React.forwardRef(({ step, onReadyChange }, ref) => {
  const { useState, useEffect, useRef, useImperativeHandle, useCallback } = React;

  const [typedProblem, setTypedProblem] = useState("");
  const [rightVisible, setRightVisible] = useState(false);
  const [introLineCount, setIntroLineCount] = useState(0);
  const [ruleStatus, setRuleStatus] = useState("pending");
  const [ruleSelected, setRuleSelected] = useState(null);
  const [coordinatePhase, setCoordinatePhase] = useState(0);
  const [formedStepThree, setFormedStepThree] = useState(false);
  const [subValues, setSubValues] = useState({ x: "", y: "" });
  const [activeBox, setActiveBox] = useState("x");
  const [boxStatus, setBoxStatus] = useState({ x: "active", y: "idle" });
  const [numpadFeedback, setNumpadFeedback] = useState("");
  const [simplifySelected, setSimplifySelected] = useState(null);
  const [simplifyStatus, setSimplifyStatus] = useState("pending");
  const [showFinalAnswer, setShowFinalAnswer] = useState(false);
  const [flyClone, setFlyClone] = useState(null);
  const timersRef = useRef([]);

  const data = APP_DATA;
  const plainProblem = data.challenge.problem.replace(/&minus;/g, "-");
  const ruleAnswerHtml = data.options.rule[data.options.ruleCorrectIndex];

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const queue = useCallback((fn, delay) => {
    const timer = setTimeout(fn, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const makeReady = useCallback((ready) => {
    if (typeof onReadyChange === "function") onReadyChange(ready);
  }, [onReadyChange]);

  useImperativeHandle(ref, () => ({
    prepareStepChange: () => {
      clearTimers();
      setFlyClone(null);
    },
  }), [clearTimers]);

  useEffect(() => {
    clearTimers();
    makeReady(false);
    setFlyClone(null);
    setRightVisible(false);

    if (step === 1) {
      setTypedProblem("");
      setIntroLineCount(0);
      setRuleStatus("pending");
      setRuleSelected(null);
      setCoordinatePhase(0);

      let index = 0;
      const typeNext = () => {
        index += 1;
        setTypedProblem(plainProblem.slice(0, index));
        if (index < plainProblem.length) {
          queue(typeNext, 30);
        } else {
          queue(() => setRightVisible(true), 300);
          queue(() => setIntroLineCount(1), 900);
          queue(() => setIntroLineCount(2), 1900);
          queue(() => setIntroLineCount(3), 2900);
          queue(() => makeReady(true), 3900);
        }
      };
      queue(typeNext, 30);
    }

    if (step === 2) {
      setTypedProblem(plainProblem);
      setIntroLineCount(3);
      setRuleStatus("pending");
      setRuleSelected(null);
      setCoordinatePhase(0);
      queue(() => setRightVisible(true), 60);
    }

    if (step === 3) {
      setTypedProblem(plainProblem);
      setFormedStepThree(false);
      setSubValues({ x: "", y: "" });
      setActiveBox("x");
      setBoxStatus({ x: "active", y: "idle" });
      setNumpadFeedback("");
      queue(() => setRightVisible(true), 80);
      queue(() => setFormedStepThree(true), 650);
    }

    if (step === 4) {
      setTypedProblem(plainProblem);
      setRightVisible(true);
      setFormedStepThree(true);
      setSubValues({ x: "x'", y: "-y'" });
      setBoxStatus({ x: "plain", y: "plain" });
      setSimplifySelected(null);
      setSimplifyStatus("pending");
      setShowFinalAnswer(false);
    }

    return clearTimers;
  }, [step, plainProblem, clearTimers, makeReady, queue]);

  const renderMathHtml = (html, className) =>
    React.createElement("span", {
      className: "math-text " + (className || ""),
      dangerouslySetInnerHTML: { __html: html },
    });

  const renderProblemText = (text) =>
    text.split("").map((char, index) =>
      char === "x" || char === "y"
        ? React.createElement("span", { key: index, className: "inline-math-var" }, char)
        : char,
    );

  const renderProblem = () =>
    React.createElement(
      "div",
      { className: "line-problem-card" },
      React.createElement("span", null, renderProblemText(step === 1 ? typedProblem : plainProblem)),
    );

  const renderIntroLine = (index, label, value, kind) => {
    const visible = introLineCount >= index;
    return React.createElement(
      "div",
      { className: "sol-line" + (visible ? " is-visible" : "") },
      React.createElement("div", { className: "sol-info" }, label),
      React.createElement(
        "div",
        { className: "sol-data" },
        kind === "question"
          ? React.createElement("span", { className: "jump-question" }, "??")
          : renderMathHtml(value, kind === "axis" ? "axis-token" : ""),
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
    const dx =
      targetRect.left + targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);
    const dy =
      targetRect.top + targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);
    setFlyClone({
      text: sourceEl.textContent.trim(),
      left: sourceRect.left + sourceRect.width / 2,
      top: sourceRect.top + sourceRect.height / 2,
      dx: dx,
      dy: dy,
      active: false,
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlyClone((clone) => clone ? { ...clone, active: true } : clone));
    });
    queue(() => {
      setFlyClone(null);
      if (typeof onDone === "function") onDone();
    }, 760);
  };

  const handleRuleOption = (index, event) => {
    if (ruleStatus !== "pending") return;
    const isCorrect = index === data.options.ruleCorrectIndex;
    setRuleSelected(index);
    if (typeof playSound === "function") playSound(isCorrect ? "correct" : "wrong");

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
      queue(() => setCoordinatePhase(1), 250);
      queue(() => setCoordinatePhase(2), 900);
      queue(() => setCoordinatePhase(3), 1500);
      queue(() => setCoordinatePhase(4), 2200);
      queue(() => setCoordinatePhase(5), 2850);
      queue(() => setCoordinatePhase(6), 3500);
      queue(() => makeReady(true), 4300);
    });
  };

  const renderRuleOptions = () =>
    React.createElement(
      "div",
      { className: "line-options no-feedback-options" },
      data.options.rule.map((option, index) => {
        let className = "line-option";
        if (ruleSelected === index && index === data.options.ruleCorrectIndex && ruleStatus !== "pending") {
          className += " is-correct";
        }
        if (ruleSelected === index && index !== data.options.ruleCorrectIndex && ruleStatus === "wrong") {
          className += " is-wrong";
        }
        return React.createElement("button", {
          key: index,
          type: "button",
          className: className,
          disabled: ruleStatus !== "pending",
          dangerouslySetInnerHTML: { __html: option },
          onClick: (event) => handleRuleOption(index, event),
        });
      }),
    );

  const renderCoordinateColumn = (side) => {
    const isX = side === "x";
    const phaseOffset = isX ? 0 : 3;
    const firstVisible = coordinatePhase >= 1 + phaseOffset;
    const orVisible = coordinatePhase >= 2 + phaseOffset;
    const thirdVisible = coordinatePhase >= 3 + phaseOffset;
    return React.createElement(
      "div",
      { className: "coordinate-column" },
      React.createElement(
        "div",
        { className: "coordinate-box blue-box" + (firstVisible ? " is-visible" : "") },
        isX
          ? React.createElement(React.Fragment, null, renderMathHtml("x' ="), React.createElement("span", { className: firstVisible ? "" : "invisible" }, " x"))
          : React.createElement(React.Fragment, null, renderMathHtml("y' ="), React.createElement("span", { className: firstVisible ? "" : "invisible" }, " -y")),
      ),
      React.createElement("div", { className: "coordinate-or" + (orVisible ? " is-visible" : "") }, data.labels.or),
      React.createElement(
        "div",
        { className: "coordinate-box yellow-box" + (thirdVisible ? " is-visible" : "") },
        isX ? renderMathHtml("x = x'") : renderMathHtml("y = &minus;y'"),
      ),
    );
  };

  const renderStepOneOrTwoMath = () =>
    React.createElement(
      React.Fragment,
      null,
      renderIntroLine(1, data.labels.equationGivenLine, data.challenge.lineEquation, "equation"),
      renderIntroLine(2, data.labels.lineReflection, data.challenge.reflectionAxis, "axis"),
      React.createElement(
        "div",
        { className: "sol-line" + (introLineCount >= 3 ? " is-visible" : "") },
        React.createElement("div", { className: "sol-info" }, data.labels.ruleAcrossXAxis),
        React.createElement(
          "div",
          { className: "sol-data intro-rule-answer-target" },
          ruleStatus === "correct"
            ? renderMathHtml(ruleAnswerHtml)
            : React.createElement("span", { className: "jump-question" }, "??"),
        ),
      ),
      step === 2 && coordinatePhase > 0
        ? React.createElement(
            "div",
            { className: "sol-card coordinate-card is-visible" },
            React.createElement("div", { className: "sol-card-title" }, data.labels.coordinatesImage),
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
    if (typeof playSound === "function") playSound(isCorrect ? "correct" : "wrong");

    if (!isCorrect) {
      setNumpadFeedback(activeBox === "x" ? data.feedback.wrongX : data.feedback.wrongY);
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
      subValues[name] || (activeBox === name ? React.createElement("span", { className: "caret" }) : ""),
    );

  const renderStepThreeMath = () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "sol-line transform-line" + (formedStepThree ? " is-visible" : "") },
        React.createElement("div", { className: "sol-info" }, data.labels.ruleReflection),
        React.createElement("div", { className: "sol-data rule-pair" },
          React.createElement("span", { className: "x-token" }, "x = x'"),
          React.createElement("span", { className: "y-token" }, "y = -y'"),
        ),
      ),
      React.createElement(
        "div",
        { className: "sol-line transform-line" + (formedStepThree ? " is-visible" : "") },
        React.createElement("div", { className: "sol-info" }, data.labels.givenLine),
        React.createElement("div", { className: "sol-data equation-large" },
          React.createElement("span", null, "3"),
          React.createElement("span", { className: "x-token" }, "( x )"),
          React.createElement("span", null, " - 2"),
          React.createElement("span", { className: "y-token" }, "( y )"),
          React.createElement("span", null, " = 1"),
        ),
      ),
      React.createElement(
        "div",
        { className: "sol-card substitution-card" + (formedStepThree ? " is-visible" : "") },
        React.createElement("div", { className: "sol-card-title" }, data.labels.equationReflectedLine),
        React.createElement(
          "div",
          { className: "substitution-expression" },
          React.createElement("span", null, "3"),
          React.createElement("span", { className: "paren x-token" }, "("),
          renderSubBox("x"),
          React.createElement("span", { className: "paren x-token" }, ")"),
          React.createElement("span", null, " - 2"),
          React.createElement("span", { className: "paren y-token" }, "("),
          renderSubBox("y"),
          React.createElement("span", { className: "paren y-token" }, ")"),
          React.createElement("span", null, " = 1"),
        ),
      ),
    );

  const handleSimplifyOption = (index, event) => {
    if (simplifyStatus === "correct") return;
    const isCorrect = index === data.options.simplifyCorrectIndex;
    setSimplifySelected(index);
    if (typeof playSound === "function") playSound(isCorrect ? "correct" : "wrong");

    if (!isCorrect) {
      setSimplifyStatus("wrong");
      queue(() => {
        setSimplifySelected(null);
        setSimplifyStatus("pending");
      }, 850);
      return;
    }

    setSimplifyStatus("correct");
    const target = document.querySelector(".final-answer-target");
    animateTextClone(event.currentTarget, target, () => {
      setShowFinalAnswer(true);
      makeReady(true);
    });
  };

  const renderStepFourMath = () =>
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "sol-card substitution-card compact is-visible" },
        React.createElement("div", { className: "sol-card-title" }, data.labels.equationReflectedLine),
        React.createElement(
          "div",
          { className: "substitution-expression" },
          React.createElement("span", null, "3"),
          React.createElement("span", { className: "paren x-token" }, "("),
          React.createElement("span", { className: "sub-box plain" }, "x'"),
          React.createElement("span", { className: "paren x-token" }, ")"),
          React.createElement("span", null, " - 2"),
          React.createElement("span", { className: "paren y-token" }, "("),
          React.createElement("span", { className: "sub-box plain" }, "-y'"),
          React.createElement("span", { className: "paren y-token" }, ")"),
          React.createElement("span", null, " = 1"),
        ),
      ),
      React.createElement(
        "div",
        { className: "sol-answer final-answer-target" + (showFinalAnswer ? " is-visible" : "") },
        data.challenge.reflectedEquation,
      ),
    );

  const renderSimplifyOptions = () =>
    React.createElement(
      "div",
      { className: "line-options simplify-options" },
      data.options.simplify.map((option, index) => {
        let className = "line-option";
        if (simplifySelected === index && index === data.options.simplifyCorrectIndex && simplifyStatus === "correct") {
          className += " is-correct";
        }
        if (simplifySelected === index && index !== data.options.simplifyCorrectIndex && simplifyStatus === "wrong") {
          className += " is-wrong";
        }
        return React.createElement("button", {
          key: index,
          type: "button",
          className: className,
          disabled: simplifyStatus === "correct",
          dangerouslySetInnerHTML: { __html: option },
          onClick: (event) => handleSimplifyOption(index, event),
        });
      }),
    );

  const renderRightPanel = () => {
    if (step === 1) {
      return React.createElement("div", {
        className: "right-text-panel" + (rightVisible ? " is-visible" : ""),
        dangerouslySetInnerHTML: { __html: data.rightPanel.exploreDetails },
      });
    }
    if (step === 2) {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className: "right-title",
          dangerouslySetInnerHTML: { __html: data.rightPanel.ruleQuestion },
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
          dangerouslySetInnerHTML: { __html: data.rightPanel.numpadHelp },
        }),
        React.createElement(Numpad, {
          disabled: activeBox === null,
          keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "x'", "0", "y'", "+", "-", "clear", "submit"],
          clearLabel: data.numpad.clearLabel,
          submitLabel: data.numpad.submitLabel,
          plusLabel: data.numpad.plusLabel,
          minusLabel: data.numpad.minusLabel,
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
        { className: "right-feedback-space mcq-feedback " + simplifyStatus },
        simplifyStatus === "wrong"
          ? data.feedback.tryAgain
          : simplifyStatus === "correct"
            ? data.feedback.wellDone
            : "",
      ),
      React.createElement("div", {
        className: "right-title simplify-title",
        dangerouslySetInnerHTML: { __html: data.rightPanel.simplifyTitle },
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
          step <= 2 ? renderStepOneOrTwoMath() : step === 3 ? renderStepThreeMath() : renderStepFourMath(),
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
              transform: flyClone.active
                ? "translate(calc(-50% + " + flyClone.dx + "px), calc(-50% + " + flyClone.dy + "px))"
                : "translate(-50%, -50%)",
            },
          },
          flyClone.text,
        )
      : null,
  );
});
