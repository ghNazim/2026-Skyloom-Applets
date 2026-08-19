const getProblemSolverFinalState = (problem) => {
  const identified = {};
  problem.classify.forEach((item) => {
    identified[item.field] =
      item.answer === "notGiven"
        ? T.ui.notGiven
        : item.answer === "toFind"
          ? T.ui.toFind
          : window.localizeNumberText
            ? window.localizeNumberText(item.answer)
            : String(item.answer);
    if (!["notGiven", "toFind"].includes(item.answer)) {
      identified[`fade-${item.answer}`] = true;
    }
  });
  const solved = {};
  problem.solve.forEach((step) => {
    solved[step.field] = step.answer;
  });
  return {
    phase: "done",
    classifyIndex: Math.max(0, problem.classify.length - 1),
    identified,
    solveIndex: Math.max(0, problem.solve.length - 1),
    formulaChosen: false,
    solved,
    questionShifted: true,
    skipAnimations: true,
  };
};

const ProblemSolver = ({ problem, onComplete, onInstruction, playSfx, initialState }) => {
  const h = React.createElement;
  const { useEffect, useMemo, useState, useRef } = React;
  const resume = initialState || {};
  const containerRef = useRef(null);
  const { ghosts, triggerGhost } = AppletAnimator.useGhostFlight(containerRef);
  const [phase, setPhase] = useState(resume.phase || "read");
  const [classifyIndex, setClassifyIndex] = useState(resume.classifyIndex || 0);
  const [identified, setIdentified] = useState(resume.identified || {});
  const [solveIndex, setSolveIndex] = useState(resume.solveIndex || 0);
  const [formulaChosen, setFormulaChosen] = useState(!!resume.formulaChosen);
  const [solved, setSolved] = useState(resume.solved || {});
  const [wrongChoices, setWrongChoices] = useState({});
  const [wrongAttempt, setWrongAttempt] = useState(null);
  const [attemptingChoice, setAttemptingChoice] = useState("");
  const [correctCell, setCorrectCell] = useState("");
  const [flipping, setFlipping] = useState(false);
  const [flipResultField, setFlipResultField] = useState("");
  const [flyingToken, setFlyingToken] = useState(null);
  const [pendingField, setPendingField] = useState("");
  const [solveLandingFeedback, setSolveLandingFeedback] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState([]);
  const [statusOptionsVisible, setStatusOptionsVisible] = useState(false);
  const [questionShifted, setQuestionShifted] = useState(!!resume.questionShifted);
  const [dockSnapped, setDockSnapped] = useState(!!resume.skipAnimations);
  const [tableRevealStarted, setTableRevealStarted] = useState(!!resume.skipAnimations);
  const [revealedPanels, setRevealedPanels] = useState({});
  const [revealedRows, setRevealedRows] = useState({});
  const [classifyInteractionReady, setClassifyInteractionReady] =
    useState(!!resume.skipAnimations);
  const nextTokenId = useRef(0);
  const classifyStartedRef = useRef(!!resume.skipAnimations);
  const tableRevealTimersRef = useRef([]);

  const question = T.ui[`question_${problem.id}`];
  const highlights = problem.highlights || [];
  const currentClassify = problem.classify[classifyIndex];
  const currentSolve = problem.solve[solveIndex];
  const localizeMathText = (value) => {
    const text = String(value ?? "");
    return T.ui.decimalSeparator === ","
      ? text.replace(/(\d)\.(\d)/g, "$1,$2")
      : text;
  };
  const translateAnswer = (answer) =>
    answer === "notGiven"
      ? T.ui.notGiven
      : answer === "toFind"
        ? T.ui.toFind
        : localizeMathText(answer);

  useEffect(() => {
    let text = T.ui.identifyPrompt;
    if (phase === "classify")
      text = classifyInteractionReady ? T.ui.chooseOption : " ";
    if (phase === "classified") text = T.ui.classificationCompletePrompt;
    if (phase === "explain") text = T.ui.startFinding;
    if (phase === "solve")
      text =
        formulaChosen && currentSolve && solved[currentSolve.field]
          ? " "
          : formulaChosen
            ? formatText(T.ui.revealPrompt, {
                equation: localizeMathText(currentSolve.display),
              })
            : T.ui.chooseOption;
    if (phase === "done") text = T.ui.nextProblem;
    onInstruction(text);
    onComplete(phase === "done");
  }, [phase, classifyIndex, solveIndex, formulaChosen, statusOptionsVisible, solved, classifyInteractionReady]);

  const renderQuestionCopy = () => {
    if (!highlights.length) return question;
    const countValues = new Set(
      [problem.values?.aN, problem.values?.bN, problem.values?.finalN]
        .filter((value) => value !== undefined && value !== null)
        .map((value) => String(value)),
    );
    const localizedHighlights = highlights.map((v) => localizeMathText(v));
    const allVariants = [...new Set([...highlights, ...localizedHighlights])];
    const sortedHighlights = [...allVariants].sort(
      (a, b) => b.length - a.length,
    );
    const pattern = new RegExp(
      `(${sortedHighlights.map((v) => v.replace(/[.,]/g, "\\$&")).join("|")})`,
      "g",
    );
    const parts = question.split(pattern);
    const originalValueFor = (part) => {
      const idx = localizedHighlights.indexOf(part);
      return idx !== -1 ? highlights[idx] : part;
    };
    return parts.map((part, index) => {
      const isHighlight =
        sortedHighlights.includes(part) || highlights.includes(part);
      if (!isHighlight) return part;
      const originalValue = originalValueFor(part);
      const tone = countValues.has(originalValue) ? "count" : "mean";
      return h(
        "span",
        {
          key: index,
          className: `question-highlight question-highlight--${tone}`,
          "data-highlight-value": originalValue,
        },
        localizeMathText(originalValue),
      );
    });
  };

  const runNumberFlyIn = () => {
    const root = containerRef.current;
    if (!root) {
      setStatusOptionsVisible(true);
      return;
    }
    const sources = [...root.querySelectorAll(".question-highlight")];
    if (!sources.length) {
      setStatusOptionsVisible(true);
      return;
    }

    const flyDuration = 700;
    const gapBetween = 380;
    const flownValues = new Set();

    const flyOne = (index) => {
      if (index >= sources.length) {
        setStatusOptionsVisible(true);
        return;
      }
      const source = sources[index];
      const value = source.getAttribute("data-highlight-value");
      const target = root.querySelector(
        `.option-button--number[data-option-value="${value}"]`,
      );
      if (!target || flownValues.has(value)) {
        flyOne(index + 1);
        return;
      }
      flownValues.add(value);
      playSfx("swoosh");
      triggerGhost({
        sourceEl: source,
        targetEl: target,
        text: source.textContent,
        colorClass: "ghost-number",
        duration: flyDuration,
        onComplete: () => {
          setVisibleOptions((prev) =>
            prev.includes(value) ? prev : [...prev, value],
          );
          setTimeout(() => flyOne(index + 1), gapBetween);
        },
      });
    };

    flyOne(0);
  };

  const startClassifying = () => {
    if (classifyStartedRef.current) return;
    classifyStartedRef.current = true;
    playSfx("click");
    setQuestionShifted(true);
    setDockSnapped(false);
    setPhase("classify");
    setTimeout(() => setDockSnapped(true), 480);
    setTimeout(() => runNumberFlyIn(), 560);
  };

  const classifyOptions = useMemo(() => {
    if (!currentClassify) return [];
    const numeric = problem.classify
      .filter((item) => !["notGiven", "toFind"].includes(item.answer))
      .map((item) => item.answer);
    return [...Array.from(new Set(numeric)), "notGiven", "toFind"].slice(0, 6);
  }, [classifyIndex]);

  useEffect(() => {
    tableRevealTimersRef.current.forEach(clearTimeout);
    tableRevealTimersRef.current = [];

    if (phase !== "classify") {
      setTableRevealStarted(false);
      setRevealedPanels({});
      setRevealedRows({});
      setClassifyInteractionReady(false);
      return undefined;
    }

    setTableRevealStarted(false);
    setRevealedPanels({});
    setRevealedRows({});
    setClassifyInteractionReady(false);

    if (!statusOptionsVisible) return undefined;

    const panelSequence = [
      {
        tone: "a",
        fields: problem.panelFields?.a || ["aN", "aTotal", "aMean"],
      },
      {
        tone: "b",
        fields: problem.panelFields?.b || ["bN", "bTotal", "bMean"],
      },
      {
        tone: "final",
        fields: problem.panelFields?.final || [
          "finalN",
          "finalTotal",
          "finalMean",
        ],
      },
    ];

    tableRevealTimersRef.current.push(
      setTimeout(() => setTableRevealStarted(true), 350),
    );

    panelSequence.forEach((panel, panelIndex) => {
      const panelStart = 350 + panelIndex * 1000;
      tableRevealTimersRef.current.push(
        setTimeout(() => {
          setRevealedPanels((prev) => ({ ...prev, [panel.tone]: true }));
        }, panelStart),
      );

      panel.fields.forEach((field, rowIndex) => {
        tableRevealTimersRef.current.push(
          setTimeout(
            () => {
              playSfx("tick");
              setRevealedRows((prev) => ({ ...prev, [field]: true }));
            },
            panelStart + (rowIndex + 1) * 250,
          ),
        );
      });
    });

    tableRevealTimersRef.current.push(
      setTimeout(
        () => {
          setClassifyInteractionReady(true);
        },
        350 + panelSequence.length * 1000,
      ),
    );

    return () => {
      tableRevealTimersRef.current.forEach(clearTimeout);
      tableRevealTimersRef.current = [];
    };
  }, [phase, statusOptionsVisible, problem.panelFields]);

  const triggerFlyAnimation = (
    elementText,
    startElement,
    targetFieldId,
    className,
    onCompleteAnim,
    isWrong = false,
  ) => {
    if (!startElement) {
      onCompleteAnim();
      return;
    }
    const targetCell = document.getElementById(`cell-${targetFieldId}`);
    if (!targetCell) {
      onCompleteAnim();
      return;
    }
    const startRect = startElement.getBoundingClientRect();
    const targetRect = targetCell.getBoundingClientRect();

    const token = {
      text: elementText,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: targetRect.left + targetRect.width / 2,
      endY: targetRect.top + targetRect.height / 2,
      className,
      width: isWrong ? targetRect.width : startRect.width,
      height: isWrong ? targetRect.height : startRect.height,
      scaleX: isWrong ? 1 : targetRect.width / Math.max(startRect.width, 1),
      scaleY: isWrong ? 1 : targetRect.height / Math.max(startRect.height, 1),
      isWrong,
      key: nextTokenId.current++,
    };
    setFlyingToken(token);
    setTimeout(() => {
      setFlyingToken(null);
      onCompleteAnim();
    }, 550);
  };

  const hideSourceNow = (element) => {
    if (!element) return;
    element.style.transition = "none";
    element.style.opacity = "0";
    element.style.pointerEvents = "none";
  };
  const restoreSource = (element) => {
    if (!element) return;
    element.style.transition = "";
    element.style.opacity = "";
    element.style.pointerEvents = "";
  };

  const animateWrongChoice = ({
    choice,
    displayText,
    event,
    field,
    solveKey = "",
    playLandSound = false,
  }) => {
    const sourceElement = event?.currentTarget;
    hideSourceNow(sourceElement);
    if (solveKey) setWrongChoices((prev) => ({ ...prev, [solveKey]: true }));
    setAttemptingChoice(choice);
    setPendingField(field);
    triggerFlyAnimation(
      displayText,
      sourceElement,
      field,
      sourceElement?.className || "",
      () => {
        setWrongAttempt({ field, text: displayText });
        if (playLandSound) playSfx("wrong");
        setTimeout(() => {
          const dockedAttempt = containerRef.current?.querySelector(
            `#cell-${field} .value-attempt`,
          );
          if (!dockedAttempt || !sourceElement) {
            restoreSource(sourceElement);
            setWrongAttempt(null);
            setPendingField("");
            setAttemptingChoice("");
            return;
          }
          triggerGhost({
            sourceEl: dockedAttempt,
            targetEl: sourceElement,
            text: displayText,
            colorClass: "ghost-wrong-return",
            duration: 520,
            onComplete: () => {
              restoreSource(sourceElement);
              setPendingField("");
              setAttemptingChoice("");
            },
          });
          setWrongAttempt(null);
        }, 1000);
      },
      true,
    );
  };

  const chooseClassification = (answer, e) => {
    if (answer !== currentClassify.answer) {
      animateWrongChoice({
        choice: answer,
        displayText: translateAnswer(answer),
        event: e,
        field: currentClassify.field,
        playLandSound: true,
      });
      return;
    }

    const startBtn = e?.currentTarget;
    hideSourceNow(startBtn);
    const currentTargetField = currentClassify.field;
    const isSpecial = ["notGiven", "toFind"].includes(answer);
    const originalClassName = startBtn ? startBtn.className : "";

    setAttemptingChoice(answer);
    triggerFlyAnimation(
      translateAnswer(answer),
      startBtn,
      currentTargetField,
      originalClassName,
      () => {
        playSfx("correct");
        if (!isSpecial) {
          setIdentified((state) => ({ ...state, [`fade-${answer}`]: true }));
        } else {
          restoreSource(startBtn);
        }
        setAttemptingChoice("");
        setIdentified((state) => ({
          ...state,
          [currentTargetField]: translateAnswer(answer),
        }));
        setCorrectCell(currentTargetField);
        setTimeout(() => setCorrectCell(""), 900);

        if (classifyIndex === problem.classify.length - 1)
          setPhase("classified");
        else setClassifyIndex((value) => value + 1);
      },
    );
  };

  const startSolving = () => {
    playSfx("click");
    setPhase("solve");
  };
  const showExplanation = () => {
    playSfx("click");
    setPhase("explain");
  };

  const formulaChoices = useMemo(() => {
    if (!currentSolve) return [];
    const match = currentSolve.display.match(/^(.+?)\s([×+−÷])\s(.+)$/);
    if (!match) return [currentSolve.display];
    const [, left, , right] = match;
    return ["×", "+", "−", "÷"].map(
      (operator) => `${left} ${operator} ${right}`,
    );
  }, [solveIndex]);

  const chooseFormula = (choice, e) => {
    if (choice !== currentSolve.display) {
      animateWrongChoice({
        choice,
        displayText: localizeMathText(choice),
        event: e,
        field: currentSolve.field,
        solveKey: `solve-${solveIndex}-${choice}`,
        playLandSound: true,
      });
      return;
    }
    const startBtn = e?.currentTarget;
    hideSourceNow(startBtn);
    const currentTargetField = currentSolve.field;
    const originalClassName = startBtn ? startBtn.className : "";
    setPendingField(currentTargetField);
    setAttemptingChoice(choice);

    triggerFlyAnimation(
      localizeMathText(choice),
      startBtn,
      currentTargetField,
      originalClassName,
      () => {
        setFormulaChosen(true);
        setSolveLandingFeedback({
          field: currentTargetField,
          text: localizeMathText(choice),
        });
        setCorrectCell(currentTargetField);
        playSfx("correct");
        setTimeout(() => {
          setSolveLandingFeedback(null);
          setPendingField("");
          setAttemptingChoice("");
          setTimeout(() => setCorrectCell(""), 900);
        }, 500);
      },
    );
  };

  const reveal = () => {
    playSfx("split");
    setFlipping(true);
    setTimeout(() => {
      setSolved((state) => ({
        ...state,
        [currentSolve.field]: currentSolve.answer,
      }));
      setFlipping(false);
      setFlipResultField(currentSolve.field);
      setTimeout(() => {
        setFlipResultField("");
        setPendingField("");
        setFormulaChosen(false);
        if (solveIndex === problem.solve.length - 1) setPhase("done");
        else setSolveIndex((value) => value + 1);
      }, 1100);
    }, 300);
  };

  const fieldValue = (field) => {
    const hasValue = identified[field] || solved[field];
    if (!hasValue) {
      const isActiveField =
        (currentClassify?.field === field && phase === "classify") ||
        (currentSolve?.field === field && phase === "solve");
      if (isActiveField) return "";
      return "";
    }
    return localizeMathText(solved[field] ?? identified[field] ?? "");
  };

  const row = (field, tone) => {
    const classification = problem.classify.find(
      (item) => item.field === field,
    );

    if (
      (phase === "solve" || phase === "done") &&
      classification?.answer === "notGiven"
    ) {
      const isNeeded = problem.solve.some((s) => s.field === field);
      if (!isNeeded) return null;
    }

    const active =
      (currentClassify?.field === field &&
        phase === "classify" &&
        classifyInteractionReady) ||
      (currentSolve?.field === field && phase === "solve");
    const knownKind =
      identified[field] || solved[field] ? classification?.kind : "";
    const isEmpty = active && !identified[field] && !solved[field];
    const isResolved = Boolean(identified[field] || solved[field]);
    const isRevealed = phase !== "classify" || revealedRows[field];
    const isPendingField =
      pendingField === field &&
      phase === "solve" &&
      !formulaChosen &&
      !flipResultField;
    const isSolveLandingField = solveLandingFeedback?.field === field;
    const valueContent =
      wrongAttempt?.field === field
        ? h(
            "span",
            { className: "value-attempt choice--wrong" },
            wrongAttempt.text,
          )
        : isSolveLandingField
          ? h(
              "span",
              { className: "placed-value solve-landing-correct" },
              solveLandingFeedback.text,
            )
          : isPendingField
            ? null
            : phase === "solve" &&
                currentSolve?.field === field &&
                formulaChosen &&
                !solved[field]
              ? h(
                  "button",
                  {
                    className: `inline-reveal ftue-target ${flipping ? "inline-reveal--flipping" : ""}`,
                    onClick: reveal,
                  },
                  localizeMathText(currentSolve.display),
                )
              : flipResultField === field
                ? h(
                    "span",
                    { className: "value-flip-result" },
                    fieldValue(field),
                  )
                : h("span", { className: "placed-value" }, fieldValue(field));
    const rawLabel = T.ui[`field_${field}`];

    return h(
      "div",
      {
        key: field,
        className: `data-row ${active ? "data-row--active" : ""} ${knownKind ? `data-row--${knownKind}` : ""} ${correctCell === field ? "data-row--correct" : ""} ${isEmpty ? "data-row--empty-active" : ""} ${isResolved ? "data-row--resolved" : ""} ${isRevealed ? "data-row--revealed" : ""}`,
      },
      h("span", {
        className: "data-label",
        dangerouslySetInnerHTML: { __html: `${rawLabel} =` },
      }),
      h(
        "span",
        {
          id: `cell-${field}`,
          className: `data-value ${isEmpty ? "data-value--active-empty" : ""}`,
        },
        valueContent,
      ),
    );
  };

  const panel = (title, fields, tone) => {
    const renderedRows = fields
      .map((field) => row(field, tone))
      .filter(Boolean);
    if (renderedRows.length === 0) return null;
    const isRevealed = phase !== "classify" || revealedPanels[tone];
    return h(
      "section",
      {
        className: `data-panel data-panel--${tone} ${isRevealed ? "data-panel--revealed" : ""}`,
      },
      h("h3", null, title),
      h("div", { className: "data-panel__rows" }, renderedRows),
    );
  };
  const panelFields = problem.panelFields || {
    a: ["aN", "aTotal", "aMean"],
    b: ["bN", "bTotal", "bMean"],
    final: ["finalN", "finalTotal", "finalMean"],
  };
  const panelTitles = T.ui[`panelTitles_${problem.id}`] || [
    T.ui.groupAName,
    T.ui.groupBName,
    T.ui.combinedName,
  ];
  const table = () =>
    h(
      "div",
      {
        className: `problem-table problem-table--${problem.id} ${phase === "classify" ? "problem-table--staged" : ""} ${phase === "classify" && !tableRevealStarted ? "problem-table--pre-reveal" : ""} ${phase === "classify" && classifyInteractionReady ? "problem-table--interactive" : ""}`,
      },
      panel(panelTitles[0], panelFields.a, "a"),
      panel(panelTitles[1], panelFields.b, "b"),
      panel(panelTitles[2], panelFields.final, "final"),
    );

  const getScreenTitle = () => {
    if (phase === "read") return { __html: T.ui.readCarefully };
    if (phase === "classify" && !classifyInteractionReady) {
      return { __html: " " };
    }
    if (phase === "classify" || phase === "classified") {
      return {
        __html: formatText(T.ui.identifyField, {
          field: T.ui[`field_${currentClassify.field}`],
        }),
      };
    }
    if (phase === "explain") return { __html: T.ui.understandNeed };
    if (phase === "solve") {
      const hasMadeMistake = Object.keys(wrongChoices).some((key) =>
        key.startsWith(`solve-${solveIndex}-`),
      );
      const fieldLabel = T.ui[`field_${currentSolve.field}`];
      const symbolicEquationFor = (step) => {
        const label = T.ui[`field_${step.field}`];
        const symbolic = step.formula.replace(
          /\b(aN|aTotal|aMean|bN|bTotal|bMean|finalN|finalTotal|finalMean)\b/g,
          (token) => T.ui[`field_${token}`],
        );
        return `${label} = ${symbolic}`;
      };
      const revealedFormulaHtml = (step) =>
        formatText(T.ui.revealedFormulaTitle, {
          equation: symbolicEquationFor(step),
          formula: localizeMathText(step.display),
          value: localizeMathText(step.answer),
        });
      const equation = symbolicEquationFor(currentSolve);
      const classification = problem.classify.find(
        (item) => item.field === currentSolve.field,
      );
      const status = String(
        translateAnswer(classification?.answer || "notGiven"),
      ).toLowerCase();
      const previousSolve =
        solveIndex > 0 ? problem.solve[solveIndex - 1] : null;

      if (hasMadeMistake && !formulaChosen) {
        return { __html: formatText(T.ui.rememberFormula, { equation }) };
      }
      if (formulaChosen) {
        if (solved[currentSolve.field]) {
          if (solveIndex === problem.solve.length - 1)
            return { __html: T.ui[`answer_${problem.id}`] };
          return { __html: revealedFormulaHtml(currentSolve) };
        }
        return {
          __html: formatText(T.ui.correctFormulaTitle, {
            equation,
            formula: localizeMathText(currentSolve.display),
          }),
        };
      }
      const prompt = formatText(
        previousSolve ? T.ui.findFieldPromptNext : T.ui.findFieldPrompt,
        { status, field: fieldLabel },
      );
      if (previousSolve) {
        return {
          __html: `<div class="storyboard-title__stack"><div>${revealedFormulaHtml(previousSolve)}</div><div>${prompt}</div></div>`,
        };
      }
      return { __html: prompt };
    }
    return { __html: T.ui[`answer_${problem.id}`] };
  };

  const targetTone =
    currentClassify?.field?.startsWith("a") ||
    currentSolve?.field?.startsWith("a")
      ? "a"
      : currentClassify?.field?.startsWith("b") ||
          currentSolve?.field?.startsWith("b")
        ? "b"
        : "final";

  const renderFlyingToken = () => {
    if (!flyingToken) return null;
    const startX = `${(flyingToken.startX / window.innerWidth) * 100}vw`;
    const startY = `${(flyingToken.startY / window.innerHeight) * 100}vh`;
    const endX = `${(flyingToken.endX / window.innerWidth) * 100}vw`;
    const endY = `${(flyingToken.endY / window.innerHeight) * 100}vh`;
    const style = {
      position: "fixed",
      left: 0,
      top: 0,
      width: `${flyingToken.width}px`,
      height: `${flyingToken.height}px`,
      boxSizing: "border-box",
      transform: `translate(${startX}, ${startY}) translate(-50%, -50%) scale(1, 1)`,
      animation: "flyToTarget 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards",
      zIndex: 9999,
      pointerEvents: "none",
      "--start-x": startX,
      "--start-y": startY,
      "--end-x": endX,
      "--end-y": endY,
      "--end-scale-x": flyingToken.scaleX,
      "--end-scale-y": flyingToken.scaleY,
    };
    return h(
      "div",
      {
        style,
        className: `${flyingToken.className} option-button--flying${flyingToken.isWrong ? " option-button--flying-wrap" : ""}`,
      },
      flyingToken.text,
    );
  };

  return h(
    "section",
    {
      ref: containerRef,
      className: `lesson-screen problem-solver problem-solver--${phase} problem-solver--target-${targetTone} ${questionShifted ? "problem-solver--shifted" : ""} fade-in`,
    },
    h("div", {
      className: "storyboard-title",
      dangerouslySetInnerHTML: getScreenTitle(),
    }),
    (phase === "read" || phase === "classify" || phase === "classified") &&
      h(
        "div",
        { className: "problem-question" },
        h(
          "div",
          { className: "problem-question__line" },
          h("b", null, T.ui.questionLabel),
          h(
            "span",
            { className: "problem-question__copy" },
            renderQuestionCopy(),
          ),
        ),
        phase === "read" &&
          h(
            "button",
            {
              className: "story-action ftue-target",
              onClick: startClassifying,
            },
            T.ui.identifyPrompt,
          ),
      ),
    phase !== "read" && table(),
    phase === "classified" &&
      h(
        "button",
        {
          className: "story-action classified-action ftue-target",
          onClick: showExplanation,
        },
        T.ui.classificationCompletePrompt,
      ),
    phase === "classify" &&
      h(
        "div",
        {
          className: `interaction-dock interaction-dock--${targetTone} ${dockSnapped ? "interaction-dock--snapped" : ""} ${statusOptionsVisible ? "interaction-dock--visible" : visibleOptions.length ? "interaction-dock--partial" : ""}`,
        },
        h(
          "div",
          { className: "option-row" },
          classifyOptions.map((option) => {
            const isFaded = identified[`fade-${option}`];
            const isStatus = option === "notGiven" || option === "toFind";
            const isVisible = isStatus
              ? statusOptionsVisible
              : visibleOptions.includes(option);
            return h(
              "button",
              {
                key: option,
                "data-option-value": isStatus ? undefined : option,
                className: `option-button ${option === "notGiven" ? "option-button--not-given" : option === "toFind" ? "option-button--to-find" : "option-button--number"} ${attemptingChoice === option ? "choice--attempting" : ""} ${isFaded ? "option-button--faded" : ""} ${!isVisible ? "option-button--hidden" : ""} ${statusOptionsVisible && isStatus ? "option-button--status-in" : ""}`,
                disabled:
                  isFaded ||
                  !!flyingToken ||
                  !!attemptingChoice ||
                  !isVisible ||
                  !classifyInteractionReady,
                onClick: (e) => chooseClassification(option, e),
              },
              translateAnswer(option),
            );
          }),
        ),
      ),
    phase === "explain" &&
      (() => {
        const toFindField =
          problem.classify.find(
            (c) => c.answer === "toFind" || c.kind === "toFind",
          )?.field || "";
        const toFindTone = toFindField.startsWith("a")
          ? "a"
          : toFindField.startsWith("b")
            ? "b"
            : "final";
        return h(
          "div",
          {
            className: `explain-card explain-card--field-${toFindField} explain-card--target-${toFindTone}`,
          },
          h("img", {
            className: `explain-arrow${problem.id === "domi" ? " problem3" : ""}`,
            src: problem.id === "domi" ? "./assets/arrow2.png" : "./assets/arrow.svg",
            alt: "",
          }),
          h("p", {
            dangerouslySetInnerHTML: { __html: T.ui[`explain_${problem.id}`] },
          }),
          h(
            "button",
            { className: "story-action ftue-target", onClick: startSolving },
            T.ui.startFinding,
          ),
        );
      })(),
    phase === "solve" &&
      !formulaChosen &&
      h(
        "div",
        { className: "solve-controls-wrapper" },
        h(
          "div",
          { className: `interaction-dock interaction-dock--${targetTone}` },
          h(
            "div",
            { className: "formula-grid" },
            formulaChoices.map((choice) => {
              const isCorrect =
                formulaChosen && choice === currentSolve.display;
              const solveKind = problem.classify.find(
                (item) => item.field === currentSolve.field,
              )?.kind;
              return h(
                "button",
                {
                  key: choice,
                  className: `formula-option ${solveKind === "toFind" ? "formula-option--to-find" : ""} ${isCorrect ? "choice--correct" : ""} ${attemptingChoice === choice ? "choice--attempting" : ""}`,
                  disabled:
                    formulaChosen || !!flyingToken || !!attemptingChoice,
                  onClick: (e) => chooseFormula(choice, e),
                },
                localizeMathText(choice),
              );
            }),
          ),
        ),
      ),
    AppletAnimator.GhostFlightLayer({ ghosts }),
    renderFlyingToken(),
  );
};
