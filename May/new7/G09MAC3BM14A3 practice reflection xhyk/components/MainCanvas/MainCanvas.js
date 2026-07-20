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
  const draggableItemsByKey = {
    x: { key: "x", value: String(challenge.point.x), colorClass: "drag-x" },
    y: { key: "y", value: String(challenge.point.y), colorClass: "drag-y" },
    param: { key: "param", value: String(challenge.line.value), colorClass: "drag-param" },
  };
  const draggableOrder = challenge.draggableOrder || ["x", "y", "param"];
  const draggableItems = draggableOrder
    .map((key) => draggableItemsByKey[key])
    .filter(Boolean);
  const draggableValues = draggableItems.map((item) => item.value);
  const mcqOptionOrder = challenge.mcqOptionOrder || [0, 1, 2, 3];
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
  const [feedbackPanelMode, setFeedbackPanelMode] = useState(null);
  const [flyClones, setFlyClones] = useState([]);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintBlinkKey, setHintBlinkKey] = useState(0);
  const [hintBlinking, setHintBlinking] = useState(false);

  const [rowStage, setRowStage] = useState(0);
  const [visibleParts, setVisibleParts] = useState(0);
  const [dropValues, setDropValues] = useState({ x: "", y: "", param: "" });
  const [hiddenValues, setHiddenValues] = useState([]);
  const [shakeZone, setShakeZone] = useState(null);
  const [hoverDropZone, setHoverDropZone] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragStarted, setDragStarted] = useState(false);
  const [dragNudgePath, setDragNudgePath] = useState(null);
  const [substituteDone, setSubstituteDone] = useState(false);

  const [activeBox, setActiveBox] = useState(null);
  const [answerInputs, setAnswerInputs] = useState({ x: "", y: "" });
  const [answerStatus, setAnswerStatus] = useState({ x: "", y: "" });
  const [answerAdvancing, setAnswerAdvancing] = useState(false);
  const [answerNudgesDismissed, setAnswerNudgesDismissed] = useState(false);
  const [answerNudgePositions, setAnswerNudgePositions] = useState([]);
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
  const dragValueRefs = {
    x: useRef(null),
    y: useRef(null),
    param: useRef(null),
  };
  const answerBoxRefs = {
    x: useRef(null),
    y: useRef(null),
  };
  const zoneRefs = {
    x: useRef(null),
    y: useRef(null),
    param: useRef(null),
  };
  const draggingRef = useRef(null);
  const timeoutsRef = useRef([]);
  const hintBlinkTimerRef = useRef(null);

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
      feedbackPanelMode: null,
      flyClones: [],
      hintVisible: false,
      hintBlinkKey: 0,
      hintBlinking: false,
      rowStage: 0,
      visibleParts: 0,
      dropValues: { x: "", y: "", param: "" },
      hiddenValues: [],
      shakeZone: null,
      hoverDropZone: null,
      dragging: null,
      dragStarted: false,
      dragNudgePath: null,
      substituteDone: false,
      activeBox: null,
      answerInputs: { x: "", y: "" },
      answerStatus: { x: "", y: "" },
      answerAdvancing: false,
      answerNudgesDismissed: false,
      answerNudgePositions: [],
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
        feedbackPanelMode: "hint",
        hintVisible: true,
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
        dragStarted: true,
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
      dragStarted: true,
      substituteDone: true,
      answerInputs: { x: String(challenge.answer.x), y: String(challenge.answer.y) },
      answerStatus: { x: "correct", y: "correct" },
      answerNudgesDismissed: true,
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
      setFeedbackPanelMode(completed.feedbackPanelMode);
      setFlyClones(completed.flyClones);
      setHintVisible(completed.hintVisible);
      setHintBlinkKey(completed.hintBlinkKey);
      setHintBlinking(completed.hintBlinking);
      setRowStage(completed.rowStage);
      setVisibleParts(completed.visibleParts);
      setDropValues(completed.dropValues);
      setHiddenValues(completed.hiddenValues);
      setShakeZone(completed.shakeZone);
      setHoverDropZone(completed.hoverDropZone);
      setDragging(completed.dragging);
      setDragStarted(completed.dragStarted);
      setDragNudgePath(completed.dragNudgePath);
      setSubstituteDone(completed.substituteDone);
      setActiveBox(completed.activeBox);
      setAnswerInputs(completed.answerInputs);
      setAnswerStatus(completed.answerStatus);
      setAnswerAdvancing(completed.answerAdvancing);
      setAnswerNudgesDismissed(completed.answerNudgesDismissed);
      setAnswerNudgePositions(completed.answerNudgePositions);
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
      const targetComputed = window.getComputedStyle(targetEl);

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
          targetFontSize: targetComputed.fontSize || computed.fontSize,
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
    setFeedbackPanelMode(null);
    setFlyClones([]);
    setHintVisible(false);
    setHintBlinkKey(0);
    setHintBlinking(false);
    setRowStage(0);
    setVisibleParts(0);
    setDropValues({ x: "", y: "", param: "" });
    setHiddenValues([]);
    setShakeZone(null);
    setHoverDropZone(null);
    draggingRef.current = null;
    setDragging(null);
    setDragStarted(false);
    setDragNudgePath(null);
    setSubstituteDone(false);
    setActiveBox(null);
    setAnswerInputs({ x: "", y: "" });
    setAnswerStatus({ x: "", y: "" });
    setAnswerAdvancing(false);
    setAnswerNudgesDismissed(false);
    setAnswerNudgePositions([]);
    setAnswersPlain(false);
    setFinalStage(0);
    setFinalImageVisible(false);
    setFinalBoxed(false);
    setFinalizing(false);
    if (startCompleted) {
      applyCompletedState(step);
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
      setAnswerNudgesDismissed(false);
      nav(d.nav.tapBox, false, false);
    }
  }, [step, startCompleted]);

  useEffect(() => {
    const shouldShow =
      step === 3 &&
      !startCompleted &&
      !answerNudgesDismissed &&
      !activeBox &&
      !answersPlain &&
      !finalizing &&
      !finalImageVisible;

    const updateNudges = () => {
      if (!shouldShow) {
        setAnswerNudgePositions([]);
        return;
      }

      const nudgeBox =
        answerStatus.x !== "correct"
          ? "x"
          : answerStatus.y !== "correct"
            ? "y"
            : null;
      const positions = nudgeBox
        ? [answerBoxRefs[nudgeBox].current]
            .filter(Boolean)
            .map((el) => el.getBoundingClientRect())
        : [];
      setAnswerNudgePositions(positions);
    };

    const id = setTimeout(updateNudges, 0);
    window.addEventListener("resize", updateNudges);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", updateNudges);
    };
  }, [step, startCompleted, answerNudgesDismissed, activeBox, answersPlain, finalizing, finalImageVisible, answerStatus]);

  useEffect(() => {
    const shouldShow =
      step === 2 &&
      rowStage >= 3 &&
      !dragStarted &&
      !dragging &&
      !substituteDone;

    const updatePath = () => {
      if (!shouldShow) {
        setDragNudgePath(null);
        return;
      }
      const fromEl = dragValueRefs.x.current;
      const toEl = zoneRefs.x.current;
      if (!fromEl || !toEl) {
        setDragNudgePath(null);
        return;
      }
      const from = fromEl.getBoundingClientRect();
      const to = toEl.getBoundingClientRect();
      setDragNudgePath({
        startX: from.left + from.width / 2,
        startY: from.top + from.height / 2,
        dx: to.left + to.width / 2 - (from.left + from.width / 2),
        dy: to.top + to.height / 2 - (from.top + from.height / 2),
      });
    };

    const id = setTimeout(updatePath, 0);
    window.addEventListener("resize", updatePath);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", updatePath);
    };
  }, [step, rowStage, dragStarted, dragging, substituteDone]);

  const toggleHintPanel = useCallback(async () => {
    if (rightSliding || rightMode !== "given" && rightMode !== "hint") return;
    play("tick");
    setMcqFeedback("");
    setFeedbackPanelMode(null);
    setRightSliding(true);
    await delay(520);
    if (rightMode === "given") {
      setRightMode("hint");
      setRightStage(2);
      setHintVisible(true);
    } else {
      setRightMode("given");
      setRightStage(5);
      setHintVisible(false);
    }
    setRightSliding(false);
  }, [delay, rightMode, rightSliding]);

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
      !startCompleted &&
      !finalizing &&
      answerStatus.x === "correct" &&
      answerStatus.y === "correct" &&
      !answerAdvancing &&
      !finalImageVisible
    ) {
      finalizeStep3();
    }
  }, [answerStatus, step, startCompleted, finalizing, answerAdvancing, finalImageVisible, finalizeStep3]);

  useEffect(() => {
    if (!dragging) return undefined;

    const getHitKey = (event) => {
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
      return hitKey;
    };

    const move = (event) => {
      event.preventDefault();
      setHoverDropZone(getHitKey(event));
      setDragging((drag) => {
        if (!drag) return drag;
        const nextDrag = {
          ...drag,
          x: event.clientX,
          y: event.clientY,
        };
        draggingRef.current = nextDrag;
        return nextDrag;
      });
    };

    const up = (event) => {
      event.preventDefault();
      const answers = dropAnswers;
      const hitKey = getHitKey(event);
      const droppedItem = draggingRef.current;

      if (hitKey && droppedItem && answers[hitKey] === droppedItem.value) {
        setDropValues((values) => ({ ...values, [hitKey]: droppedItem.value }));
        setHiddenValues((values) => values.concat(droppedItem.value));
        play("correct");
      } else {
        if (hitKey) {
          setShakeZone(hitKey);
          setTimeout(() => setShakeZone(null), 450);
        }
        play("wrong");
      }
      setHoverDropZone(null);
      draggingRef.current = null;
      setDragging(null);
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up, { passive: false });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [!!dragging]);

  const numberToken = (value, className) =>
    h("span", { className: "question-number " + className }, String(value));

  const renderPointToken = () =>
    h(
      React.Fragment,
      null,
      "A(",
      numberToken(challenge.point.x, "color-x"),
      ",",
      numberToken(challenge.point.y, "color-y"),
      ")",
    );

  const renderLineToken = () =>
    h(
      React.Fragment,
      null,
      math(lineAxis),
      " = ",
      numberToken(challenge.line.value, "color-k"),
    );

  const renderSegmentedQuestion = () => {
    const beforePoint = questionText.split(pointText)[0];
    const afterPoint = questionText.split(pointText)[1] || "";
    const beforeLine = afterPoint.split(lineText)[0];
    const afterLine = afterPoint.split(lineText)[1] || "";
    const colorQuestionNumbers = step >= 2;
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
        part.ref && shown.length === part.text.length && colorQuestionNumbers
          ? part.line
            ? renderLineToken()
            : renderPointToken()
          : part.line && shown.length === part.text.length
            ? [math(lineAxis), " = " + challenge.line.value]
            : shown,
      );
    });
  };

  const renderHintBulbButton = (visible, label) =>
    h(
      "button",
      {
        className:
          "hint-bulb-button fade-step " +
          (visible ? "show " : "") +
          (hintBlinking ? "blink-hint" : ""),
        onClick: toggleHintPanel,
        disabled: !visible || rightSliding,
        key: "hint-bulb-" + hintBlinkKey,
        "aria-label": label,
      },
      h("img", {
        className: "hint-bulb",
        src: "assets/bulb.png",
        alt: "",
      }),
    );

  const renderMcqFeedback = (panelMode) =>
    mcqFeedback && feedbackPanelMode === panelMode
      ? h("div", {
          className:
            "mcq-feedback " + (correctOption ? "correct-feedback" : "wrong-feedback"),
          dangerouslySetInnerHTML: { __html: mcqFeedback },
        })
      : null;

  const renderGivenPanel = () =>
    h(
      "div",
      { className: "given-panel" },
      renderHintBulbButton(step1OptionsEnabled, "Show hint panel"),
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
      renderMcqFeedback("given"),
    );

  const renderHintPanel = () =>
    h(
      "div",
      { className: "hint-panel" },
      renderHintBulbButton(rightStage >= 1, "Show given panel"),
      h(
        "div",
        { className: "hint-box fade-step " + (rightMode === "hint" && hintVisible ? "show" : "") },
        h("div", null, d.hintTitle),
        h("div", null, math(lineAxis), " = ", math(parameterVar), ","),
        h("div", null, d.hint[orientation].body1),
        h("div", null, d.hint[orientation].body2),
      ),
      renderMcqFeedback("hint"),
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
          fontWeight: clone.fontWeight,
          transition:
            "transform " +
            clone.duration +
            "ms cubic-bezier(0.35, 0, 0.15, 1), font-size " +
            clone.duration +
            "ms cubic-bezier(0.35, 0, 0.15, 1)",
          fontSize: clone.active ? clone.targetFontSize : clone.fontSize,
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
      setFeedbackPanelMode(rightMode);
      play("correct");
      nav(d.nav.substitute, true, false);
    } else {
      setWrongOptions((items) => (items.indexOf(index) >= 0 ? items : items.concat(index)));
      setMcqFeedback(d.hint[orientation].wrong);
      setFeedbackPanelMode(rightMode);
      setHintBlinkKey((key) => key + 1);
      setHintBlinking(true);
      if (hintBlinkTimerRef.current) clearTimeout(hintBlinkTimerRef.current);
      const blinkId = setTimeout(() => {
        setHintBlinking(false);
        hintBlinkTimerRef.current = null;
      }, 1700);
      hintBlinkTimerRef.current = blinkId;
      timeoutsRef.current.push(blinkId);
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
        mcqOptionOrder.map((optionIndex, displayIndex) => {
          const visible = visualStage >= displayIndex + 2;
          const classes = [
            "mcq-option",
            visible ? "visible" : "",
            wrongOptions.indexOf(optionIndex) >= 0 ? "wrong" : "",
            correctOption && optionIndex === correctOptionIndex ? "correct" : "",
          ].join(" ");
          return h(
            "button",
            {
              key: optionIndex,
              className: classes,
              onClick: () => handleOption(optionIndex),
              disabled: !visible || !step1OptionsEnabled,
            },
            optionFormula(optionIndex),
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
          (hoverDropZone === key ? "hovered " : "") +
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

  const startDrag = (event, item) => {
    if (hiddenValues.indexOf(item.value) >= 0 || substituteDone) return;
    event.preventDefault();
    play("click");
    setDragStarted(true);
    const nextDrag = {
      value: item.value,
      colorClass: item.colorClass,
      x: event.clientX,
      y: event.clientY,
    };
    draggingRef.current = nextDrag;
    setDragging(nextDrag);
  };

  const renderDraggables = () =>
    h(
      "div",
      { className: "draggable-row" },
      draggableItems.map((item) =>
        hiddenValues.indexOf(item.value) >= 0 || (dragging && dragging.value === item.value)
          ? h("span", { key: item.key, className: "drag-placeholder" })
          : h(
              "button",
              {
                key: item.key,
                ref: dragValueRefs[item.key],
                className: "drag-value " + item.colorClass,
                onPointerDown: (event) => startDrag(event, item),
              },
              item.value,
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
              className: "drag-ghost " + (dragging.colorClass || ""),
              style: { left: dragging.x + "px", top: dragging.y + "px" },
            },
            dragging.value,
          )
        : null,
      dragNudgePath
        ? h("img", {
            className: "drag-path-nudge",
            src: "assets/tap.png",
            alt: "",
            style: {
              left: dragNudgePath.startX + "px",
              top: dragNudgePath.startY + "px",
              "--drag-nudge-x": dragNudgePath.dx + "px",
              "--drag-nudge-y": dragNudgePath.dy + "px",
            },
          })
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
        setActiveBox(null);
        if (
          currentBox === "x" && answerStatus.y !== "correct" ||
          currentBox === "y" && answerStatus.x !== "correct"
        ) {
          setAnswerNudgesDismissed(false);
          nav(d.nav.tapBox, false, false);
        }
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
    if (box === "y" && answerStatus.x !== "correct") return;
    setAnswerNudgesDismissed(true);
    setActiveBox(box);
    nav(d.nav.useNumpad, false, false);
  };

  const answerBox = (box) =>
    answersPlain
      ? h("span", { className: "plain-answer" }, box === "x" ? challenge.answer.x : challenge.answer.y)
      : h(
          "button",
          {
            ref: answerBoxRefs[box],
            className:
              "answer-box " +
              (activeBox === box ? "active " : "") +
              (box === "y" && answerStatus.x !== "correct" ? "disabled " : "") +
              (answerStatus[box] || ""),
            disabled: box === "y" && answerStatus.x !== "correct",
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
    answerNudgePositions.map((position, index) =>
      h(Nudge, { key: "answer-nudge-" + index, show: true, position }),
    ),
  );
};
