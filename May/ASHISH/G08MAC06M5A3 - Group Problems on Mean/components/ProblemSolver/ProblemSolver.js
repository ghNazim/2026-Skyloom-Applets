const ProblemSolver = ({ problem, onComplete, onInstruction, playSfx }) => {
  const h = React.createElement;
  const { useEffect, useMemo, useState, useRef, useCallback } = React;
  const containerRef = useRef(null);
  const { ghosts, triggerGhost } = AppletAnimator.useGhostFlight(containerRef);
  const [phase, setPhase] = useState("read");
  const [classifyIndex, setClassifyIndex] = useState(0);
  const [identified, setIdentified] = useState({});
  const [solveIndex, setSolveIndex] = useState(0);
  const [formulaChosen, setFormulaChosen] = useState(false);
  const [solved, setSolved] = useState({});
  const [wrongChoices, setWrongChoices] = useState({});
  const [wrongAttempt, setWrongAttempt] = useState(null);
  const [attemptingChoice, setAttemptingChoice] = useState("");
  const [correctChoice, setCorrectChoice] = useState("");
  const [correctCell, setCorrectCell] = useState("");
  const [flipping, setFlipping] = useState(false);
  const [flipResultField, setFlipResultField] = useState("");
  const [flyingToken, setFlyingToken] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState([]);
  const [statusOptionsVisible, setStatusOptionsVisible] = useState(false);
  const [questionShifted, setQuestionShifted] = useState(false);
  const [dockSnapped, setDockSnapped] = useState(false);
  const nextTokenId = useRef(0);
  const classifyStartedRef = useRef(false);

  const question = T.ui[`question_${problem.id}`];
  const highlights = problem.highlights || [];
  const currentClassify = problem.classify[classifyIndex];
  const currentSolve = problem.solve[solveIndex];
  const localizeMathText = (value) => {
    const text = String(value ?? "");
    return T.ui.decimalSeparator === "," ? text.replace(/(\d)\.(\d)/g, "$1,$2") : text;
  };
  const translateAnswer = (answer) => answer === "notGiven"
    ? T.ui.notGiven
    : answer === "toFind"
      ? T.ui.toFind
      : localizeMathText(answer);

  const burstConfetti = useCallback(() => {
    if (typeof confetti !== "function") return;
    try {
      const audio = new Audio(T.sfx.confetti);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (_) {}

    const subtle = {
      particleCount: 2,
      spread: 38,
      startVelocity: 20,
      scalar: 0.7,
      ticks: 70,
      gravity: 0.85,
      decay: 0.93,
      zIndex: 40,
    };

    const duration = 800;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        ...subtle,
        angle: 62,
        origin: { x: 0.05, y: 0.96 },
      });
      confetti({
        ...subtle,
        angle: 118,
        origin: { x: 0.95, y: 0.96 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  useEffect(() => {
    let text = T.ui.identifyPrompt;
    if (phase === "classify") text = statusOptionsVisible ? T.ui.chooseOption : "";
    if (phase === "classified") text = T.ui.classificationCompletePrompt;
    if (phase === "explain") text = T.ui.startFinding;
    if (phase === "solve") text = formulaChosen
      ? formatText(T.ui.revealPrompt, { equation: localizeMathText(currentSolve.display) })
      : T.ui.chooseOption;
    if (phase === "done") text = T.ui.nextProblem;
    onInstruction(text);
    onComplete(phase === "done");
  }, [phase, classifyIndex, solveIndex, formulaChosen, statusOptionsVisible]);

  const renderQuestionCopy = () => {
    if (!highlights.length) return question;
    const countValues = new Set(
      [problem.values?.aN, problem.values?.bN, problem.values?.finalN]
        .filter((value) => value !== undefined && value !== null)
        .map((value) => String(value))
    );
    const sortedHighlights = [...highlights].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${sortedHighlights.map((v) => v.replace(".", "\\.")).join("|")})`, "g");
    const parts = question.split(pattern);
    return parts.map((part, index) => {
      const isHighlight = sortedHighlights.includes(part) || highlights.includes(part);
      if (!isHighlight) return part;
      const tone = countValues.has(part) ? "count" : "mean";
      return h("span", {
        key: index,
        className: `question-highlight question-highlight--${tone}`,
        "data-highlight-value": part,
      }, localizeMathText(part));
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

    const flyOne = (index) => {
      if (index >= sources.length) {
        setStatusOptionsVisible(true);
        return;
      }
      const source = sources[index];
      const value = source.getAttribute("data-highlight-value");
      const target = root.querySelector(`.option-button--number[data-option-value="${value}"]`);
      if (!target) {
        flyOne(index + 1);
        return;
      }
      triggerGhost({
        sourceEl: source,
        targetEl: target,
        text: source.textContent,
        colorClass: "ghost-number",
        duration: flyDuration,
        onComplete: () => {
          setVisibleOptions((prev) => (prev.includes(value) ? prev : [...prev, value]));
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
    const numeric = problem.classify.filter((item) => !["notGiven", "toFind"].includes(item.answer)).map((item) => item.answer);
    return [...Array.from(new Set(numeric)), "notGiven", "toFind"].slice(0, 6);
  }, [classifyIndex]);

  const triggerFlyAnimation = (elementText, startElement, targetFieldId, className, onCompleteAnim) => {
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
      key: nextTokenId.current++,
    };
    setFlyingToken(token);
    setTimeout(() => {
      setFlyingToken(null);
      onCompleteAnim();
    }, 550);
  };

  const animateWrongChoice = ({ choice, displayText, event, field, solveKey = "" }) => {
    const sourceElement = event?.currentTarget;
    if (solveKey) setWrongChoices((prev) => ({ ...prev, [solveKey]: true }));
    setAttemptingChoice(choice);
    triggerFlyAnimation(displayText, sourceElement, field, sourceElement?.className || "", () => {
      setWrongAttempt({ field, text: displayText });
      setTimeout(() => {
        const dockedAttempt = containerRef.current?.querySelector(`#cell-${field} .value-attempt`);
        if (!dockedAttempt || !sourceElement) {
          setWrongAttempt(null);
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
            setWrongAttempt(null);
            setAttemptingChoice("");
          },
        });
      }, 1000);
    });
  };

  const chooseClassification = (answer, e) => {
    if (answer !== currentClassify.answer) {
      playSfx("wrong");
      animateWrongChoice({
        choice: answer,
        displayText: translateAnswer(answer),
        event: e,
        field: currentClassify.field,
      });
      return;
    }
    playSfx("correct");
    if (answer === "notGiven") burstConfetti();
    setCorrectChoice(answer);

    const startBtn = e?.currentTarget;
    const currentTargetField = currentClassify.field;
    const isSpecial = ["notGiven", "toFind"].includes(answer);
    const originalClassName = startBtn ? startBtn.className : "";

    setTimeout(() => {
      triggerFlyAnimation(translateAnswer(answer), startBtn, currentTargetField, originalClassName, () => {
        setCorrectChoice("");
        setIdentified((state) => ({ ...state, [currentTargetField]: translateAnswer(answer) }));
        setCorrectCell(currentTargetField);
        setTimeout(() => setCorrectCell(""), 900);

        if (!isSpecial) {
          setIdentified((state) => ({ ...state, [`fade-${answer}`]: true }));
        }
        if (classifyIndex === problem.classify.length - 1) setPhase("classified");
        else setClassifyIndex((value) => value + 1);
      });
    }, 200);
  };

  const startSolving = () => { playSfx("click"); setPhase("solve"); };
  const showExplanation = () => { playSfx("click"); setPhase("explain"); };

  const formulaChoices = useMemo(() => {
    if (!currentSolve) return [];
    const match = currentSolve.display.match(/^(.+?)\s([×+−÷])\s(.+)$/);
    if (!match) return [currentSolve.display];
    const [, left, , right] = match;
    return ["×", "+", "−", "÷"].map((operator) => `${left} ${operator} ${right}`);
  }, [solveIndex]);

  const chooseFormula = (choice, e) => {
    if (choice !== currentSolve.display) {
      playSfx("wrong");
      animateWrongChoice({
        choice,
        displayText: localizeMathText(choice),
        event: e,
        field: currentSolve.field,
        solveKey: `solve-${solveIndex}-${choice}`,
      });
      return;
    }
    playSfx("correct");
    setCorrectChoice(choice);

    const startBtn = e?.currentTarget;
    const currentTargetField = currentSolve.field;
    const originalClassName = startBtn ? startBtn.className : "";

    setTimeout(() => {
      triggerFlyAnimation(localizeMathText(choice), startBtn, currentTargetField, originalClassName, () => {
        setCorrectChoice("");
        setFormulaChosen(true);
        setCorrectCell(currentTargetField);
        setTimeout(() => setCorrectCell(""), 900);
      });
    }, 200);
  };

  const reveal = () => {
    playSfx("split");
    setFlipping(true);
    setTimeout(() => {
      setSolved((state) => ({ ...state, [currentSolve.field]: currentSolve.answer }));
      setFlipping(false);
      setFlipResultField(currentSolve.field);
      setTimeout(() => {
        setFlipResultField("");
        setFormulaChosen(false);
        if (solveIndex === problem.solve.length - 1) setPhase("done");
        else setSolveIndex((value) => value + 1);
      }, 350);
    }, 300);
  };

  const fieldValue = (field) => {
    const hasValue = identified[field] || solved[field];
    if (!hasValue) {
      const isActiveField = (currentClassify?.field === field && phase === "classify")
        || (currentSolve?.field === field && phase === "solve");
      if (isActiveField) return "";
    }
    return localizeMathText(solved[field] ?? identified[field] ?? T.ui.blank);
  };

  const row = (field) => {
    const classification = problem.classify.find((item) => item.field === field);

    if ((phase === "solve" || phase === "done") && classification?.answer === "notGiven") {
      const isNeeded = problem.solve.some((s) => s.field === field);
      if (!isNeeded) return null;
    }

    const active = (currentClassify?.field === field && phase === "classify") || (currentSolve?.field === field && phase === "solve");
    const knownKind = identified[field] || solved[field] ? classification?.kind : "";
    const isEmpty = active && !identified[field] && !solved[field];
    const valueContent = wrongAttempt?.field === field
      ? h("span", { className: "value-attempt choice--wrong" }, wrongAttempt.text)
      : phase === "solve" && currentSolve?.field === field && formulaChosen && !solved[field]
      ? h("button", { className: `inline-reveal ftue-target ${flipping ? "inline-reveal--flipping" : ""}`, onClick: reveal }, localizeMathText(currentSolve.display))
      : flipResultField === field
        ? h("span", { className: "value-flip-result" }, fieldValue(field))
        : fieldValue(field);
    const rawLabel = T.ui[`field_${field}`];

    return h("div", {
      key: field,
      className: `data-row ${active ? "data-row--active" : ""} ${knownKind ? `data-row--${knownKind}` : ""} ${correctCell === field ? "data-row--correct" : ""} ${isEmpty ? "data-row--empty-active" : ""}`,
    },
      h("span", { className: "data-label", dangerouslySetInnerHTML: { __html: `${rawLabel} =` } }),
      h("span", { id: `cell-${field}`, className: `data-value ${isEmpty ? "data-value--active-empty" : ""}` }, valueContent)
    );
  };

  const panel = (title, fields, tone) => {
    const renderedRows = fields.map(row).filter(Boolean);
    if (renderedRows.length === 0) return null;
    return h("section", { className: `data-panel data-panel--${tone}` }, h("h3", null, title), h("div", { className: "data-panel__rows" }, renderedRows));
  };
  const panelFields = problem.panelFields || { a: ["aN", "aTotal", "aMean"], b: ["bN", "bTotal", "bMean"], final: ["finalN", "finalTotal", "finalMean"] };
  const panelTitles = T.ui[`panelTitles_${problem.id}`] || [T.ui.groupAName, T.ui.groupBName, T.ui.combinedName];
  const table = () => h("div", { className: `problem-table problem-table--${problem.id}` },
    panel(panelTitles[0], panelFields.a, "a"),
    panel(panelTitles[1], panelFields.b, "b"),
    panel(panelTitles[2], panelFields.final, "final")
  );

  const getScreenTitle = () => {
    if (phase === "read") return { __html: T.ui.readCarefully };
    if (phase === "classify" || phase === "classified") {
      return { __html: formatText(T.ui.identifyField, { field: T.ui[`field_${currentClassify.field}`] }) };
    }
    if (phase === "explain") return { __html: T.ui.understandNeed };
    if (phase === "solve") {
      const hasMadeMistake = Object.keys(wrongChoices).some((key) => key.startsWith(`solve-${solveIndex}-`));
      const fieldLabel = T.ui[`field_${currentSolve.field}`];
      const symbolicFormula = currentSolve.formula.replace(
        /\b(aN|aTotal|aMean|bN|bTotal|bMean|finalN|finalTotal|finalMean)\b/g,
        (token) => T.ui[`field_${token}`]
      );
      const equation = `${fieldLabel} = ${symbolicFormula}`;
      const classification = problem.classify.find((item) => item.field === currentSolve.field);
      const status = translateAnswer(classification?.answer || "notGiven");

      if (hasMadeMistake && !formulaChosen) {
        return { __html: formatText(T.ui.rememberFormula, { equation }) };
      }
      if (formulaChosen) {
        return {
          __html: formatText(T.ui.correctFormulaTitle, {
            formula: localizeMathText(currentSolve.display),
            value: localizeMathText(currentSolve.answer),
          }),
        };
      }
      return { __html: formatText(T.ui.findFieldPrompt, { status, field: fieldLabel }) };
    }
    return { __html: T.ui[`answer_${problem.id}`] };
  };

  const targetTone = currentClassify?.field?.startsWith("a") || currentSolve?.field?.startsWith("a") ? "a"
    : currentClassify?.field?.startsWith("b") || currentSolve?.field?.startsWith("b") ? "b" : "final";

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
      transform: `translate(${startX}, ${startY}) translate(-50%, -50%) scale(1)`,
      animation: "flyToTarget 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards",
      zIndex: 9999,
      pointerEvents: "none",
      "--start-x": startX,
      "--start-y": startY,
      "--end-x": endX,
      "--end-y": endY,
    };
    return h("div", { style, className: `${flyingToken.className} option-button--flying` }, flyingToken.text);
  };

  return h("section", {
    ref: containerRef,
    className: `lesson-screen problem-solver problem-solver--${phase} problem-solver--target-${targetTone} ${questionShifted ? "problem-solver--shifted" : ""} fade-in`,
  },
    h("h2", { className: "storyboard-title", dangerouslySetInnerHTML: getScreenTitle() }),
    (phase === "read" || phase === "classify" || phase === "classified") && h("div", { className: "problem-question" },
      h("div", { className: "problem-question__line" },
        h("b", null, T.ui.questionLabel),
        h("span", { className: "problem-question__copy" }, renderQuestionCopy())
      ),
      phase === "read" && h("button", { className: "story-action ftue-target", onClick: startClassifying }, T.ui.identifyPrompt)
    ),
    phase !== "read" && table(),
    phase === "classified" && h("button", {
      className: "story-action classified-action ftue-target",
      onClick: showExplanation,
    }, T.ui.classificationCompletePrompt),
    phase === "classify" && h("div", { className: `interaction-dock interaction-dock--${targetTone} ${dockSnapped ? "interaction-dock--snapped" : ""} ${statusOptionsVisible ? "interaction-dock--visible" : visibleOptions.length ? "interaction-dock--partial" : ""}` },
      h("div", { className: "option-row" }, classifyOptions.map((option) => {
        const isFaded = identified[`fade-${option}`];
        const isStatus = option === "notGiven" || option === "toFind";
        const isVisible = isStatus ? statusOptionsVisible : visibleOptions.includes(option);
        return h("button", {
          key: option,
          "data-option-value": isStatus ? undefined : option,
          className: `option-button ${option === "notGiven" ? "option-button--not-given" : option === "toFind" ? "option-button--to-find" : "option-button--number"} ${correctChoice === option ? "choice--correct" : ""} ${attemptingChoice === option ? "choice--attempting" : ""} ${isFaded ? "option-button--faded" : ""} ${!isVisible ? "option-button--hidden" : ""} ${statusOptionsVisible && isStatus ? "option-button--status-in" : ""}`,
          disabled: isFaded || !!correctChoice || !!flyingToken || !!attemptingChoice || !isVisible,
          onClick: (e) => chooseClassification(option, e),
        }, translateAnswer(option));
      }))
    ),
    phase === "explain" && (() => {
      const toFindField = problem.classify.find((c) => c.answer === "toFind" || c.kind === "toFind")?.field || "";
      const toFindTone = toFindField.startsWith("a") ? "a" : toFindField.startsWith("b") ? "b" : "final";
      return h("div", { className: `explain-card explain-card--field-${toFindField} explain-card--target-${toFindTone}` },
        h("div", { className: "explain-arrow" }),
        h("p", { dangerouslySetInnerHTML: { __html: T.ui[`explain_${problem.id}`] } }),
        h("button", { className: "story-action ftue-target", onClick: startSolving }, T.ui.startFinding)
      );
    })(),
    phase === "solve" && !formulaChosen && h("div", { className: "solve-controls-wrapper" },
      h("div", { className: `interaction-dock interaction-dock--${targetTone}` },
        h("div", { className: "formula-grid" }, formulaChoices.map((choice) => {
          const isCorrect = correctChoice === choice || (formulaChosen && choice === currentSolve.display);
          return h("button", {
            key: choice,
            className: `formula-option ${isCorrect ? "choice--correct" : ""} ${attemptingChoice === choice ? "choice--attempting" : ""}`,
            disabled: formulaChosen || !!correctChoice || !!flyingToken || !!attemptingChoice,
            onClick: (e) => chooseFormula(choice, e),
          }, localizeMathText(choice));
        }))
      )
    ),
    AppletAnimator.GhostFlightLayer({ ghosts }),
    renderFlyingToken()
  );
};
