const MainCanvas = ({ step, questionIndex = 0, isLastQuestion = false, startCompleted = false, onNavChange }) => {
  const {
    useCallback,
    useEffect,
    useRef,
    useState,
  } = React;
  const d = APP_DATA.reflection;
  const h = React.createElement;
  const challenge = d.challenges[questionIndex] || d.challenges[0];
  const isHorizontal = challenge.line.axis === "y";
  const orientation = isHorizontal ? "horizontal" : "vertical";
  const lineAxis = challenge.line.axis;
  const parameterVar = isHorizontal ? "k" : "h";
  const pointText = "A(" + challenge.point.x + "," + challenge.point.y + ")";
  const lineText = lineAxis + " = " + challenge.line.value;
  const imageText = "A'(" + challenge.answer.x + "," + challenge.answer.y + ")";
  const questionText = d.questionTemplate
    .replace("{point}", pointText)
    .replace("{line}", lineText);
  const dropAnswers = {
    x: String(challenge.point.x),
    y: String(challenge.point.y),
    param: String(challenge.line.value),
  };
  const draggableValues = [
    String(challenge.point.x),
    String(challenge.line.value),
    String(challenge.point.y),
  ];
  const correctOptionIndex = isHorizontal ? 1 : 3;

  const [typedChars, setTypedChars] = useState(0);
  const [rightMode, setRightMode] = useState("empty");
  const [rightSliding, setRightSliding] = useState(false);
  const [rightStage, setRightStage] = useState(0);
  const [visualStage, setVisualStage] = useState(0);
  const [step1OptionsEnabled, setStep1OptionsEnabled] = useState(false);
  const [wrongOptions, setWrongOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(false);
  const [mcqFeedback, setMcqFeedback] = useState("");
  const [flyClones, setFlyClones] = useState([]);

  const [rowStage, setRowStage] = useState(0);
  const [visibleParts, setVisibleParts] = useState(0);
  const [dropValues, setDropValues] = useState({ x: "", y: "", param: "" });
  const [hiddenValues, setHiddenValues] = useState([]);
  const [shakeZone, setShakeZone] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [substituteDone, setSubstituteDone] = useState(false);

  const [activeBox, setActiveBox] = useState(null);
  const [answerInputs, setAnswerInputs] = useState({ x: "", y: "" });
  const [answerStatus, setAnswerStatus] = useState({ x: "", y: "" });
  const [answerAdvancing, setAnswerAdvancing] = useState(false);
  const [answersPlain, setAnswersPlain] = useState(false);
  const [finalStage, setFinalStage] = useState(0);
  const [finalImageVisible, setFinalImageVisible] = useState(false);
  const [finalBoxed, setFinalBoxed] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  const questionPointRef = useRef(null);
  const questionLineRef = useRef(null);
  const rightPointRef = useRef(null);
  const rightLineRef = useRef(null);
  const finalImageRef = useRef(null);
  const row3FinalRef = useRef(null);
  const zoneRefs = {
    x: useRef(null),
    y: useRef(null),
    param: useRef(null),
  };
  const timeoutsRef = useRef([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      const id = setTimeout(resolve, ms);
      timeoutsRef.current.push(id);
    });
  }, []);

  const nav = useCallback(
    (text, nextEnabled, animating) => {
      onNavChange &&
        onNavChange({
          text: text || "",
          nextEnabled: !!nextEnabled,
          animating: !!animating,
        });
    },
    [onNavChange],
  );

  const math = (text, className) =>
    h("span", { className: "math-var " + (className || "") }, text);

  const play = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const getCompletedState = (completedStep) => {
    const base = {
      typedChars: questionText.length,
      rightMode: "empty",
      rightSliding: false,
      rightStage: 0,
      visualStage: 0,
      step1OptionsEnabled: false,
      wrongOptions: [],
      correctOption: false,
      mcqFeedback: "",
      flyClones: [],
      rowStage: 0,
      visibleParts: 0,
      dropValues: { x: "", y: "", param: "" },
      hiddenValues: [],
      shakeZone: null,
      dragging: null,
      substituteDone: false,
      activeBox: null,
      answerInputs: { x: "", y: "" },
      answerStatus: { x: "", y: "" },
      answerAdvancing: false,
      answersPlain: false,
      finalStage: 0,
      finalImageVisible: false,
      finalBoxed: false,
      finalizing: false,
      navText: "",
      nextEnabled: false,
    };

    if (completedStep === 1) {
      return {
        ...base,
        rightMode: "hint",
        rightStage: 2,
        visualStage: 5,
        step1OptionsEnabled: true,
        correctOption: true,
        mcqFeedback: d.correctFeedback,
        navText: d.nav.substitute,
        nextEnabled: true,
      };
    }

    if (completedStep === 2) {
      return {
        ...base,
        rightMode: "substitute",
        rightStage: 2,
        rowStage: 3,
        visibleParts: 9,
        dropValues: dropAnswers,
        hiddenValues: draggableValues.slice(),
        substituteDone: true,
        navText: d.nav.simplify,
        nextEnabled: true,
      };
    }

    return {
      ...base,
      rightMode: "final",
      rightStage: 0,
      rowStage: 3,
      visibleParts: 9,
      dropValues: dropAnswers,
      hiddenValues: draggableValues.slice(),
      substituteDone: true,
      answerInputs: { x: String(challenge.answer.x), y: String(challenge.answer.y) },
      answerStatus: { x: "correct", y: "correct" },
      answersPlain: true,
      finalStage: 1,
      finalImageVisible: true,
      finalBoxed: true,
      navText: isLastQuestion ? d.nav.summarize : d.nav.nextChallenge,
      nextEnabled: true,
    };
  };

  const applyCompletedState = useCallback(
    (completedStep) => {
      const completed = getCompletedState(completedStep);
      setTypedChars(completed.typedChars);
      setRightMode(completed.rightMode);
      setRightSliding(completed.rightSliding);
      setRightStage(completed.rightStage);
      setVisualStage(completed.visualStage);
      setStep1OptionsEnabled(completed.step1OptionsEnabled);
      setWrongOptions(completed.wrongOptions);
      setCorrectOption(completed.correctOption);
      setMcqFeedback(completed.mcqFeedback);
      setFlyClones(completed.flyClones);
      setRowStage(completed.rowStage);
      setVisibleParts(completed.visibleParts);
      setDropValues(completed.dropValues);
      setHiddenValues(completed.hiddenValues);
      setShakeZone(completed.shakeZone);
      setDragging(completed.dragging);
      setSubstituteDone(completed.substituteDone);
      setActiveBox(completed.activeBox);
      setAnswerInputs(completed.answerInputs);
      setAnswerStatus(completed.answerStatus);
      setAnswerAdvancing(completed.answerAdvancing);
      setAnswersPlain(completed.answersPlain);
      setFinalStage(completed.finalStage);
      setFinalImageVisible(completed.finalImageVisible);
      setFinalBoxed(completed.finalBoxed);
      setFinalizing(completed.finalizing);
      nav(completed.navText, completed.nextEnabled, false);
    },
    [questionText, d.correctFeedback, d.nav.substitute, d.nav.simplify, d.nav.summarize, d.nav.nextChallenge, isLastQuestion, nav],
  );

  const flyClone = useCallback((sourceEl, targetEl, content, duration = 850) => {
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }
      const src = sourceEl.getBoundingClientRect();
      const dst = targetEl.getBoundingClientRect();
      if (!src.width || !src.height || !dst.width || !dst.height) {
        resolve();
        return;
      }

      const id = "fly-" + Date.now() + "-" + Math.random();
      const startX = src.left + src.width / 2;
      const startY = src.top + src.height / 2;
      const dx = dst.left + dst.width / 2 - startX;
      const dy = dst.top + dst.height / 2 - startY;
      const computed = window.getComputedStyle(sourceEl);

      setFlyClones((clones) =>
        clones.concat({
          id,
          content,
          startX,
          startY,
          dx,
          dy,
          duration,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight || "500",
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
        resolve();
      }, duration);
    });
  }, []);

  useEffect(() => {
    clearTimers();
    setTypedChars(step === 1 ? 0 : questionText.length);
    setRightMode("empty");
    setRightSliding(false);
    setRightStage(0);
    setVisualStage(0);
    setStep1OptionsEnabled(false);
    setWrongOptions([]);
    setCorrectOption(false);
    setMcqFeedback("");
    setFlyClones([]);
    setRowStage(0);
    setVisibleParts(0);
    setDropValues({ x: "", y: "", param: "" });
    setHiddenValues([]);
    setShakeZone(null);
    setDragging(null);
    setSubstituteDone(false);
    setActiveBox(null);
    setAnswerInputs({ x: "", y: "" });
    setAnswerStatus({ x: "", y: "" });
    setAnswerAdvancing(false);
    setAnswersPlain(false);
    setFinalStage(0);
    setFinalImageVisible(false);
    setFinalBoxed(false);
    setFinalizing(false);
    if (startCompleted) {
      setTimeout(() => applyCompletedState(step), 0);
    }
    return clearTimers;
  }, [step, questionText, startCompleted, applyCompletedState]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (step !== 1) return;
      if (startCompleted) return;
      nav("", false, true);
      for (let i = 1; i <= questionText.length; i++) {
        if (cancelled) return;
        setTypedChars(i);
        await delay(30);
      }
      setRightMode("given");
      await delay(600);
      setRightStage(1);
      await delay(200);
      await flyClone(questionPointRef.current, rightPointRef.current, pointText);
      if (cancelled) return;
      setRightStage(2);
      await delay(600);
      setRightStage(3);
      await delay(200);
      await flyClone(
        questionLineRef.current,
        rightLineRef.current,
        '<span class="math-var">' + lineAxis + "</span> = " + challenge.line.value,
      );
      if (cancelled) return;
      setRightStage(4);
      await delay(300);
      setRightStage(5);
      await delay(500);
      setVisualStage(1);
      await delay(350);
      for (let i = 2; i <= 5; i++) {
        if (cancelled) return;
        setVisualStage(i);
        await delay(260);
      }
      await delay(1500);
      setRightSliding(true);
      await delay(520);
      setRightMode("hint");
      setRightStage(0);
      setMcqFeedback("");
      setRightSliding(false);
      await delay(520);
      setRightStage(1);
      await delay(200);
      setRightStage(2);
      setStep1OptionsEnabled(true);
      nav(d.nav.chooseOption, false, false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [step, questionText, pointText, lineAxis, challenge.line.value, startCompleted]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (step !== 2) return;
      if (startCompleted) return;
      nav("", false, true);
      setRightMode("substitute");
      await delay(300);
      setRowStage(1);
      await delay(500);
      setRowStage(2);
      for (let i = 1; i <= 9; i++) {
        if (cancelled) return;
        setVisibleParts(i);
        await delay(135);
      }
      await delay(250);
      setRowStage(3);
      await delay(400);
      setRightStage(1);
      nav(d.nav.drag, false, false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [step, startCompleted]);

  useEffect(() => {
    if (step === 3 && !startCompleted) {
      setRightMode("calculate");
      setRightStage(1);
      nav(d.nav.tapBox, false, false);
    }
  }, [step, startCompleted]);

  useEffect(() => {
    if (step !== 2 || substituteDone) return;
    if (dropValues.x && dropValues.y && dropValues.param) {
      setSubstituteDone(true);
      setRightStage(2);
      play("correct");
      nav(d.nav.simplify, true, false);
    }
  }, [dropValues, step, substituteDone]);

  const finalizeStep3 = useCallback(async () => {
    setFinalizing(true);
    nav("", false, true);
    setActiveBox(null);
    await delay(250);
    setAnswersPlain(true);
    await delay(250);
    setRightSliding(true);
    await delay(520);
    setRightMode("final");
    setRightStage(0);
    setRightSliding(false);
    await delay(520);
    setFinalStage(1);
    await delay(250);
    await flyClone(row3FinalRef.current, finalImageRef.current, imageText, 900);
      setFinalImageVisible(true);
    await delay(180);
    setFinalBoxed(true);
    play("congrats");
    nav(isLastQuestion ? d.nav.summarize : d.nav.nextChallenge, true, false);
    setFinalizing(false);
  }, [d.nav.nextChallenge, d.nav.summarize, delay, flyClone, imageText, isLastQuestion, nav]);

  useEffect(() => {
    if (
      step === 3 &&
      !finalizing &&
      answerStatus.x === "correct" &&
      answerStatus.y === "correct" &&
      !answerAdvancing &&
      !finalImageVisible
    ) {
      finalizeStep3();
    }
  }, [answerStatus, step, finalizing, answerAdvancing, finalImageVisible, finalizeStep3]);

  useEffect(() => {
    if (!dragging) return undefined;

    const move = (event) => {
      event.preventDefault();
      setDragging((drag) =>
        drag
          ? {
              ...drag,
              x: event.clientX,
              y: event.clientY,
            }
          : drag,
      );
    };

    const up = (event) => {
      event.preventDefault();
      const answers = dropAnswers;
      let hitKey = null;
      Object.keys(zoneRefs).forEach((key) => {
        const el = zoneRefs[key].current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          hitKey = key;
        }
      });

      if (hitKey && answers[hitKey] === dragging.value) {
        setDropValues((values) => ({ ...values, [hitKey]: dragging.value }));
        setHiddenValues((values) => values.concat(dragging.value));
        play("correct");
      } else {
        if (hitKey) {
          setShakeZone(hitKey);
          setTimeout(() => setShakeZone(null), 450);
        }
        play("wrong");
      }
      setDragging(null);
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up, { passive: false });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging]);

  const renderSegmentedQuestion = () => {
    const beforePoint = questionText.split(pointText)[0];
    const afterPoint = questionText.split(pointText)[1] || "";
    const beforeLine = afterPoint.split(lineText)[0];
    const afterLine = afterPoint.split(lineText)[1] || "";
    const parts = [
      { text: beforePoint },
      { text: pointText, ref: questionPointRef },
      { text: beforeLine },
      { text: lineText, ref: questionLineRef, line: true },
      { text: afterLine },
    ];
    let remaining = typedChars;

    return parts.map((part, index) => {
      const shown = part.text.slice(0, Math.max(0, Math.min(remaining, part.text.length)));
      remaining -= part.text.length;
      if (!shown) return null;
      return h(
        "span",
        {
          key: index,
          ref: shown.length === part.text.length ? part.ref : null,
          className: part.ref ? "question-source-token" : "",
        },
        part.line && shown.length === part.text.length
          ? [math(lineAxis), " = " + challenge.line.value]
          : shown,
      );
    });
  };

  const renderGivenPanel = () =>
    h(
      "div",
      { className: "given-panel" },
      h("div", { className: "given-title fade-step " + (rightStage >= 1 ? "show" : "") }, d.givenPointTitle),
      h(
        "div",
        {
          ref: rightPointRef,
          className: "given-point fade-step " + (rightStage >= 2 ? "show" : ""),
        },
        pointText,
      ),
      h("div", { className: "given-title line-title fade-step " + (rightStage >= 3 ? "show" : "") }, d.givenLineTitle),
      h(
        "div",
        {
          ref: rightLineRef,
          className: "given-line fade-step " + (rightStage >= 4 ? "show" : ""),
        },
        math(lineAxis),
        " = " + challenge.line.value,
      ),
      h(
        "div",
        { className: "given-line-type fade-step " + (rightStage >= 5 ? "show" : "") },
        "( ",
        math(lineAxis),
        " = ",
        math(parameterVar),
        " )",
      ),
    );

  const renderHintPanel = () =>
    h(
      "div",
      { className: "hint-panel" },
      h("img", {
        className: "hint-bulb fade-step " + (rightStage >= 1 ? "show" : ""),
        src: "assets/bulb.png",
        alt: "",
      }),
      h(
        "div",
        { className: "hint-box fade-step " + (rightStage >= 2 ? "show" : "") },
        h("div", null, d.hintTitle),
        h("div", null, math(lineAxis), " = ", math(parameterVar), ","),
        h("div", null, d.hint[orientation].body1),
        h("div", null, d.hint[orientation].body2),
      ),
      mcqFeedback
        ? h("div", {
            className:
              "mcq-feedback " + (correctOption ? "correct-feedback" : "wrong-feedback"),
            dangerouslySetInnerHTML: { __html: mcqFeedback },
          })
        : null,
    );

  const renderSubstitutePanel = () =>
    h(
      "div",
      { className: "substitute-panel" },
      h("div", {
        className: "side-instruction fade-step " + (rightStage >= 1 ? "show" : ""),
        dangerouslySetInnerHTML: { __html: d.substitutePrompt },
      }),
      substituteDone
        ? h("div", {
            className: "substitute-feedback correct-feedback",
            dangerouslySetInnerHTML: { __html: d.substituteFeedback },
          })
        : null,
    );

  const renderCalculatePanel = () =>
    h(
      "div",
      { className: "calculate-panel" },
      h("div", {
        className: "calculate-prompt",
        dangerouslySetInnerHTML: { __html: d.calculatePrompt },
      }),
      h(Numpad, {
        disabled: !activeBox || finalizing || finalImageVisible || answerAdvancing,
        submitLabel: d.numpad.submitLabel,
        backspaceLabel: d.numpad.backspaceLabel,
        plusLabel: d.numpad.plusLabel,
        minusLabel: d.numpad.minusLabel,
        onNumberClick: handleNumpadInput,
        onBackspace: handleNumpadBackspace,
        onSubmit: handleNumpadSubmit,
      }),
    );

  const renderFinalPanel = () =>
    h(
      "div",
      { className: "given-panel final-panel" },
      h("div", { className: "given-title show" }, d.givenPointTitle),
      h("div", { className: "given-point show" }, pointText),
      h("div", { className: "given-title line-title show" }, d.givenLineTitle),
      h("div", { className: "given-line show" }, math(lineAxis), " = " + challenge.line.value),
      h(
        "div",
        { className: "final-image-box " + (finalBoxed ? "boxed" : "") },
        h("div", { className: "given-title show" }, d.imageTitle),
        h(
          "div",
          {
            ref: finalImageRef,
            className: "final-image-text " + (finalImageVisible ? "show" : ""),
          },
          imageText,
        ),
      ),
    );

  const renderRightPanel = () => {
    const content =
      rightMode === "given"
        ? renderGivenPanel()
        : rightMode === "hint"
          ? renderHintPanel()
          : rightMode === "substitute"
            ? renderSubstitutePanel()
            : rightMode === "calculate"
              ? renderCalculatePanel()
              : rightMode === "final"
                ? renderFinalPanel()
                : null;
    return h(
      "aside",
      { className: "reflection-right-panel" + (rightSliding ? " slide-out" : "") },
      content,
    );
  };

  const renderFlyClones = () =>
    flyClones.map((clone) =>
      h("div", {
        key: clone.id,
        className: "reflection-fly-clone",
        style: {
          left: clone.startX + "px",
          top: clone.startY + "px",
          fontSize: clone.fontSize,
          fontWeight: clone.fontWeight,
          transition:
            "transform " +
            clone.duration +
            "ms cubic-bezier(0.35, 0, 0.15, 1)",
          transform: clone.active
            ? "translate(calc(-50% + " +
              clone.dx +
              "px), calc(-50% + " +
              clone.dy +
              "px))"
            : "translate(-50%, -50%)",
        },
        dangerouslySetInnerHTML: { __html: clone.content },
      }),
    );

  const optionFormula = (index) => {
    const formulas = isHorizontal
      ? [
          ["-", "x", ", ", "y", " + 2", parameterVar],
          ["x", ", -", "y", " + 2", parameterVar],
          ["x", " + 2", parameterVar, ", -", "y"],
          ["-", "x", " + 2", parameterVar, ", ", "y"],
        ]
      : [
          ["-", "x", ", ", "y", " + 2", parameterVar],
          ["x", ", -", "y", " + 2", parameterVar],
          ["x", " + 2", parameterVar, ", -", "y"],
          ["-", "x", " + 2", parameterVar, ", ", "y"],
        ];
    const parts = formulas[index];
    return h(
      React.Fragment,
      null,
      "A(",
      math("x"),
      ",",
      math("y"),
      ") \u2192 A'(",
      parts.map((part, i) => {
        if (part === "x") return math("x", "color-x");
        if (part === "y") return math("y", "color-y");
        if (part === parameterVar) return math(parameterVar, "color-k");
        return h("span", { key: i }, part);
      }),
      ")",
    );
  };

  const handleOption = (index) => {
    if (correctOption || visualStage < 5) return;
    if (index === correctOptionIndex) {
      setCorrectOption(true);
      setMcqFeedback(d.correctFeedback);
      play("correct");
      nav(d.nav.substitute, true, false);
    } else {
      setWrongOptions((items) => (items.indexOf(index) >= 0 ? items : items.concat(index)));
      setMcqFeedback(d.hint[orientation].wrong);
      play("wrong");
    }
  };

  const renderStep1Visual = () =>
    h(
      "div",
      { className: "mcq-wrap" },
      visualStage >= 1
        ? h(
            "h2",
            null,
            d.mcqTitleTemplate.split("{lineType}")[0],
            math(lineAxis),
            " = ",
            math(parameterVar),
            d.mcqTitleTemplate.split("{lineType}")[1],
          )
        : null,
      h(
        "div",
        { className: "mcq-options" },
        [0, 1, 2, 3].map((index) => {
          const visible = visualStage >= index + 2;
          const classes = [
            "mcq-option",
            visible ? "visible" : "",
            wrongOptions.indexOf(index) >= 0 ? "wrong" : "",
            correctOption && index === correctOptionIndex ? "correct" : "",
          ].join(" ");
          return h(
            "button",
            {
              key: index,
              className: classes,
              onClick: () => handleOption(index),
              disabled: !visible || !step1OptionsEnabled,
            },
            optionFormula(index),
          );
        }),
      ),
    );

  const renderRuleRow = () =>
    isHorizontal
      ? h(
          "div",
          { className: "formula-row rule-row" },
          h("span", null, d.ruleLabel + "\u00a0 A("),
          math("x"),
          h("span", null, ","),
          math("y"),
          h("span", null, ") \u2192 A'("),
          math("x", "color-x"),
          h("span", null, ", -"),
          math("y", "color-y"),
          h("span", null, " + 2"),
          math(parameterVar, "color-k"),
          h("span", null, ")"),
        )
      : h(
          "div",
          { className: "formula-row rule-row" },
          h("span", null, d.ruleLabel + "\u00a0 A("),
          math("x"),
          h("span", null, ","),
          math("y"),
          h("span", null, ") \u2192 A'(-"),
          math("x", "color-x"),
          h("span", null, " + 2"),
          math(parameterVar, "color-k"),
          h("span", null, ", "),
          math("y", "color-y"),
          h("span", null, ")"),
        );

  const dropBox = (key) =>
    h(
      "span",
      {
        ref: zoneRefs[key],
        className:
          "drop-box " +
          "drop-" + key + " " +
          (dropValues[key] ? "filled " : "") +
          (shakeZone === key ? "shake" : ""),
      },
      dropValues[key],
    );

  const renderPart = (index, content) =>
    h(
      "span",
      { key: index, className: "equation-part " + (visibleParts >= index ? "show" : "") },
      content,
    );

  const renderDropEquation = () =>
    isHorizontal
      ? h(
          "div",
          { className: "formula-row drop-equation" },
          [
            renderPart(1, pointText),
            renderPart(2, "\u2192"),
            renderPart(3, "A'("),
            renderPart(4, dropBox("x")),
            renderPart(5, ", -"),
            renderPart(6, dropBox("y")),
            renderPart(7, " + 2 \u00d7 "),
            renderPart(8, dropBox("param")),
            renderPart(9, ")"),
          ],
        )
      : h(
          "div",
          { className: "formula-row drop-equation" },
          [
            renderPart(1, pointText),
            renderPart(2, "\u2192"),
            renderPart(3, "A'(-"),
            renderPart(4, dropBox("x")),
            renderPart(5, " + 2 \u00d7 "),
            renderPart(6, dropBox("param")),
            renderPart(7, ", "),
            renderPart(8, dropBox("y")),
            renderPart(9, ")"),
          ],
        );

  const startDrag = (event, value) => {
    if (hiddenValues.indexOf(value) >= 0 || substituteDone) return;
    event.preventDefault();
    play("click");
    setDragging({ value, x: event.clientX, y: event.clientY });
  };

  const renderDraggables = () =>
    h(
      "div",
      { className: "draggable-row" },
      draggableValues.map((value) =>
        hiddenValues.indexOf(value) >= 0 || (dragging && dragging.value === value)
          ? h("span", { key: value, className: "drag-placeholder" })
          : h(
              "button",
              {
                key: value,
                className: "drag-value",
                onPointerDown: (event) => startDrag(event, value),
              },
              value,
            ),
      ),
    );

  const renderStep2Visual = () =>
    h(
      "div",
      { className: "substitution-work" },
      rowStage >= 1 ? renderRuleRow() : null,
      rowStage >= 2 ? renderDropEquation() : null,
      rowStage >= 3 ? renderDraggables() : null,
      dragging
        ? h(
            "div",
            {
              className: "drag-ghost",
              style: { left: dragging.x + "px", top: dragging.y + "px" },
            },
            dragging.value,
          )
        : null,
    );

  function handleNumpadInput(value) {
    if (!activeBox || finalizing || finalImageVisible || answerAdvancing) return;
    setAnswerStatus((status) => ({ ...status, [activeBox]: "" }));
    setAnswerInputs((inputs) => {
      const current = inputs[activeBox] || "";
      const unsigned = current.replace(/^[+-]/, "");
      if ((value >= "0" && value <= "9") && unsigned.length >= 2) {
        return inputs;
      }
      const next =
        value === "-"
          ? current.startsWith("-")
            ? current.slice(1)
            : "-" + current.replace(/^\+/, "")
          : value === "+"
            ? "+" + current.replace(/^[+-]/, "")
          : current + value;
      return { ...inputs, [activeBox]: next };
    });
  }

  function handleNumpadBackspace() {
    if (!activeBox || finalizing || finalImageVisible || answerAdvancing) return;
    setAnswerStatus((status) => ({ ...status, [activeBox]: "" }));
    setAnswerInputs((inputs) => ({
      ...inputs,
      [activeBox]: (inputs[activeBox] || "").slice(0, -1),
    }));
  }

  function handleNumpadSubmit() {
    if (!activeBox || finalizing || finalImageVisible || answerAdvancing) return;
    const expected = activeBox === "x" ? String(challenge.answer.x) : String(challenge.answer.y);
    const normalizeSigned = (value) => {
      const trimmed = String(value || "").trim();
      if (trimmed === "") return "";
      return trimmed.replace(/^\+/, "");
    };
    if (normalizeSigned(answerInputs[activeBox]) === normalizeSigned(expected)) {
      play("correct");
      const currentBox = activeBox;
      setAnswerStatus((status) => ({ ...status, [activeBox]: "correct" }));
      setAnswerAdvancing(true);
      setTimeout(() => {
        setActiveBox((box) =>
          currentBox === "x" && answerStatus.y !== "correct"
            ? "y"
            : currentBox === "y" && answerStatus.x !== "correct"
              ? "x"
              : null,
        );
        setAnswerAdvancing(false);
      }, 800);
    } else {
      play("wrong");
      const wrongBox = activeBox;
      setAnswerStatus((status) => ({ ...status, [wrongBox]: "wrong" }));
      setTimeout(() => {
        setAnswerInputs((inputs) => ({ ...inputs, [wrongBox]: "" }));
        setAnswerStatus((status) => ({ ...status, [wrongBox]: "" }));
        setActiveBox(wrongBox);
        nav(d.nav.useNumpad, false, false);
      }, 500);
    }
  }

  const activateAnswerBox = (box) => {
    if (finalizing || finalImageVisible || answerStatus[box] === "correct") return;
    setActiveBox(box);
    nav(d.nav.useNumpad, false, false);
  };

  const answerBox = (box) =>
    answersPlain
      ? h("span", { className: "plain-answer" }, box === "x" ? challenge.answer.x : challenge.answer.y)
      : h(
          "button",
          {
            className:
              "answer-box " +
              (activeBox === box ? "active " : "") +
              (answerStatus[box] || ""),
            onClick: () => activateAnswerBox(box),
          },
          answerInputs[box],
        );

  const renderPlainSubstitution = () =>
    isHorizontal
      ? h(
          "div",
          { className: "formula-row plain-substitution" },
          h("span", null, pointText + " \u2192 A'( "),
          h("span", { className: activeBox === "x" ? "highlight-calc" : "" }, String(challenge.point.x)),
          h("span", null, " , "),
          h(
            "span",
            { className: activeBox === "y" ? "highlight-calc" : "" },
            "-(" + challenge.point.y + ") + 2\u00d7(" + challenge.line.value + ")",
          ),
          h("span", null, " )"),
        )
      : h(
          "div",
          { className: "formula-row plain-substitution" },
          h("span", null, pointText + " \u2192 A'( "),
          h(
            "span",
            { className: activeBox === "x" ? "highlight-calc" : "" },
            "-(" + challenge.point.x + ") + 2\u00d7(" + challenge.line.value + ")",
          ),
          h("span", null, " , "),
          h("span", { className: activeBox === "y" ? "highlight-calc" : "" }, String(challenge.point.y)),
          h("span", null, " )"),
        );

  const renderAnswerEquation = () =>
    answersPlain
      ? h(
          "div",
          { className: "formula-row answer-equation" },
          pointText + " \u2192 ",
          h("span", { ref: row3FinalRef }, imageText),
        )
      : h(
          "div",
          { className: "formula-row answer-equation" },
          pointText + " \u2192 A'(",
          h(
            "span",
            { className: activeBox === "x" ? "highlight-calc inline" : "" },
            answerBox("x"),
          ),
          ", ",
          answerBox("y"),
          ")",
        );

  const renderStep3Visual = () =>
    h(
      "div",
      { className: "solve-work" },
      renderRuleRow(),
      renderPlainSubstitution(),
      renderAnswerEquation(),
    );

  const renderVisual = () => {
    if (step === 1) return renderStep1Visual();
    if (step === 2) return renderStep2Visual();
    return renderStep3Visual();
  };

  return h(
    "div",
    { className: "reflection-canvas" },
    h(
      "section",
      { className: "reflection-left" },
      h("div", { className: "question-row" }, renderSegmentedQuestion()),
      h("div", { className: "visual-row" }, renderVisual()),
    ),
    renderRightPanel(),
    renderFlyClones(),
  );
};
