const LessonScreen = React.forwardRef((props, ref) => {
  const { useState, useEffect, useRef } = React;
  const {
    stepConfig,
    diceState,
    spinnerState,
    eventState,
    feedback,
    onRoll,
    onEventCalcTap,
    onEventBuildStart,
    onEventTermLanded,
    onEventSumTap,
    onSpinnerInputChange,
    onSpinnerSubmitWrong,
    onSpinnerShowSubmitPreview,
    onSpinnerSubmitCorrect,
    onSumExpressionTap,
    onQuizAnswer,
    onQuizWrong,
    onBridgeContinue,
    onNumpadTap,
    handleStartOver,
    startOverButtonRef,
  } = props;

  const stepData = stepConfig.stepData || {};
  const type = stepConfig.type;
  const isEnd = type === "end";
  const chartRef = useRef(null);
  const { ghosts, triggerGhost } = AppletAnimator.useGhostFlight(ref);
  const [eventFlying, setEventFlying] = useState(null);
  const [spinnerFlying, setSpinnerFlying] = useState(false);
  const [bridgeMorph, setBridgeMorph] = useState(false);
  const [quizFlying, setQuizFlying] = useState(false);
  const [quizFlyChoice, setQuizFlyChoice] = useState(null);
  const [quizSlotChoice, setQuizSlotChoice] = useState(null);
  const [quizSlotWrong, setQuizSlotWrong] = useState(false);
  const [quizChartRevealed, setQuizChartRevealed] = useState(false);
  const [eventFlips, setEventFlips] = useState({});
  const [eventGlow, setEventGlow] = useState({ bar: null, total: false, sumKey: null });
  const [dismissedFtueKeys, setDismissedFtueKeys] = useState({});
  const [numpadFreshStart, setNumpadFreshStart] = useState(false);
  const prevTypeRef = useRef(type);

  const FLIP_MS = 600;
  const GLOW_MS = 450;

  const setFlip = (key, value) => setEventFlips((prev) => ({ ...prev, [key]: value }));
  const isFlipped = (key) => eventFlips[key] === true;

  const dismissFtueNow = (key) => {
    const handFtue = document.getElementById("hand-ftue");
    if (handFtue) {
      handFtue.classList.remove("hand-animating");
      handFtue.classList.remove("hand-ftue--edge");
      handFtue.classList.remove("ftue-on-nav");
    }
    if (key) setDismissedFtueKeys((prev) => ({ ...prev, [key]: true }));
  };

  useEffect(() => {
    setEventFlips({});
    setEventGlow({ bar: null, total: false, sumKey: null });
    setDismissedFtueKeys({});
    setNumpadFreshStart(false);
  }, [type, stepData.eventKey, stepData.id]);

  const renderFormulaVar = (suffix = "") =>
    React.createElement(
      "span",
      { className: "frac-var" },
      "f",
      React.createElement("sub", null, "r"),
      suffix
    );

  const renderFormulaEquals = () =>
    React.createElement("span", { className: "frac-eq-sign", "aria-hidden": "true" }, "=");

  const renderFlipSlot = ({
    flipKey,
    frontContent,
    backContent = "",
    revealed,
    filledValue,
    isActive,
    disabled,
    onClick,
    targetAttr,
    doneClass = "",
  }) => {
    if (revealed) {
      return React.createElement(
        "span",
        {
          className: `frac-box frac-tap--done frac-slot-fixed ${doneClass}`,
          ...(targetAttr || {}),
        },
        filledValue
      );
    }

    const flipped = isFlipped(flipKey);
    const showFtue = isActive && flipKey && !dismissedFtueKeys[flipKey];
    return React.createElement(
      "div",
      { className: "flip-frac-slot frac-slot-fixed" },
      React.createElement(
        "div",
        { className: `flip-frac-inner${flipped ? " flip-frac-inner--flipped" : ""}` },
        React.createElement(
          "button",
          {
            type: "button",
            className: `flip-frac-face flip-frac-front event-reveal-button frac-tap ${showFtue ? "ftue-target " : ""}${isActive ? "frac-tap--active" : ""}`,
            disabled: disabled || flipped,
            onClick,
          },
          frontContent
        ),
        React.createElement(
          "span",
          {
            className: "flip-frac-face flip-frac-back",
            ...(targetAttr || {}),
          },
          backContent
        )
      )
    );
  };

  const runFlyReveal = (sourceSel, targetSel, text, onDone) => {
    flyValue(sourceSel, targetSel, text, "", onDone);
  };

  const playSfx = (name) => {
    try {
      const audio = new Audio(T.sfx[name]);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const flyValue = (sourceSel, targetSel, text, colorClass, cb) => {
    const root = ref.current;
    const source = root?.querySelector(sourceSel);
    const target = root?.querySelector(targetSel);
    if (!source || !target) {
      cb();
      return;
    }
    setEventFlying(true);
    playSfx("swoosh");
    triggerGhost({
      sourceEl: source,
      targetEl: target,
      text,
      colorClass,
      duration: 780,
      onComplete: () => {
        setEventFlying(null);
        cb();
      },
    });
  };

  const flyValueSpinner = (sourceSel, targetSel, text, colorClass, cb) => {
    const root = ref.current;
    const source = root?.querySelector(sourceSel);
    const target = root?.querySelector(targetSel);
    if (!source || !target) {
      cb();
      return;
    }
    setSpinnerFlying(true);
    playSfx("swoosh");
    triggerGhost({
      sourceEl: source,
      targetEl: target,
      text,
      colorClass,
      duration: 780,
      onComplete: () => {
        setSpinnerFlying(false);
        cb();
      },
    });
  };

  const handleEventCalcFreqTap = (eventKey) => {
    if (eventKey !== "A") return;
    const state = eventState.eventA;
    if (state.freqRevealed || eventFlying || isFlipped("A-freq")) return;
    dismissFtueNow("A-freq");
    const event = T.diceEvents.A;
    setFlip("A-freq", true);
    setTimeout(() => {
      setEventGlow((prev) => ({ ...prev, bar: event.flyBar }));
      setTimeout(() => {
        runFlyReveal(
          `[data-freq-label="${event.flyBar}"]`,
          "[data-freq-target]",
          String(event.sum),
          () => {
            setEventGlow((prev) => ({ ...prev, bar: null }));
            onEventCalcTap("A", "freq");
          }
        );
      }, GLOW_MS);
    }, FLIP_MS);
  };

  const handleEventCalcTotalTap = (eventKey) => {
    if (eventKey !== "A") return;
    const state = eventState.eventA;
    if (!state.freqRevealed || state.totalRevealed || eventFlying || isFlipped("A-total")) return;
    dismissFtueNow("A-total");
    setFlip("A-total", true);
    setTimeout(() => {
      setEventGlow((prev) => ({ ...prev, total: true }));
      setTimeout(() => {
        runFlyReveal(
          "[data-total-value]",
          "[data-total-target]",
          String(T.diceTotalTrials),
          () => {
            setEventGlow((prev) => ({ ...prev, total: false }));
            onEventCalcTap("A", "total");
          }
        );
      }, GLOW_MS);
    }, FLIP_MS);
  };

  const handleEventBuildStartTap = (eventKey) => {
    const state = eventState[`event${eventKey}`];
    if (state.buildStarted || state.isAnimating || eventFlying || isFlipped(`${eventKey}-build`)) return;
    dismissFtueNow(`${eventKey}-build`);
    setFlip(`${eventKey}-build`, true);
    setTimeout(() => onEventBuildStart(eventKey), FLIP_MS);
  };

  const handleEventSumTapAnimated = (eventKey) => {
    const state = eventState[`event${eventKey}`];
    if (!state.buildComplete || state.sumRevealed || eventFlying || !state.sumPromptReady || isFlipped(`${eventKey}-sum`)) return;
    dismissFtueNow(`${eventKey}-sum`);
    setFlip(`${eventKey}-sum`, true);
    setTimeout(() => onEventSumTap(eventKey), FLIP_MS);
  };

  const renderCompoundNumerator = (event, terms) =>
    React.createElement(
      "span",
      {
        className: "frac-box frac-tap--done event-numerator-slot frac-slot-fixed",
        "data-event-num-target": true,
      },
      event.freqs.map((val, i) =>
        React.createElement(
          React.Fragment,
          { key: `num-term-${i}` },
          i > 0 &&
            React.createElement(
              "span",
              {
                className: `event-num-plus ${terms.length > i ? "event-num-term--visible" : "event-num-term--ghost"}`,
              },
              " + "
            ),
          React.createElement(
            "span",
            {
              className: `event-num-term ${terms.length > i ? "event-num-term--visible" : "event-num-term--ghost"}`,
              "data-event-num-term": i,
            },
            val
          )
        )
      )
    );

  useEffect(() => {
    if (type !== "diceEventCalc") return;
    const eventKey = stepData.eventKey;
    if (eventKey !== "B" && eventKey !== "C") return;
    const state = eventState[`event${eventKey}`];
    const face = state.animatingFace;
    if (!face) return;
    const event = T.diceEvents[eventKey];
    const idx = event.faces.indexOf(face);
    const value = event.freqs[idx];
    const timer = setTimeout(() => {
      setEventGlow((prev) => ({ ...prev, bar: face }));
      setTimeout(() => {
        runFlyReveal(
          `[data-freq-label="${face}"]`,
          `[data-event-num-term="${idx}"]`,
          String(value),
          () => {
            setEventGlow((prev) => ({ ...prev, bar: null }));
            onEventTermLanded(eventKey);
          }
        );
      }, GLOW_MS);
    }, 80);
    return () => clearTimeout(timer);
  }, [eventState.eventB.animatingFace, eventState.eventC.animatingFace, type, stepData.eventKey]);

  const handleSpinnerSubmit = () => {
    const section = stepData.section;
    if (spinnerState.enteredValues[section] != null) return;
    const expected = String(T.spinnerFreq[section]);
    const input = spinnerState.currentInput;
    if (input === "?" || input === "") return;
    onSpinnerShowSubmitPreview();
    if (input !== expected) {
      setNumpadFreshStart(true);
      onSpinnerSubmitWrong();
      return;
    }
    setTimeout(() => onSpinnerSubmitCorrect(), 350);
  };

  const getTitleText = () => {
    if (diceState.rollStage !== "idle") return null;
    let title = T.ui.diceRecordTitle;
    if (type === "diceRollBatch" && diceState.trialCount >= T.diceTotalTrials) title = T.ui.diceRecordedTitle;
    if (type.startsWith("diceEvent")) title = T.ui.diceRecordedTitle;
    if (type === "spinnerBridge") return null;
    if (type === "spinnerOverview") title = T.ui.spinnerOverviewTitle;
    if (type === "spinnerEnter") title = T.ui.spinnerEnterTitle;
    if (type === "spinnerSum" || type === "spinnerSumDone") title = T.ui.spinnerSumTitle;
    if (type === "spinnerQuiz") title = T.ui.spinnerQuizTitle;
    return title;
  };

  const renderTitle = () => {
    const title = getTitleText();
    return React.createElement(
      "div",
      { className: "lesson-title" },
      title != null && React.createElement("span", { className: "lesson-title-text" }, title)
    );
  };

  const renderMergeExpr = (mergeAnim, revealedClass) => {
    const { terms, hiddenPlus, hiddenTerms, phase, mergeLeft, mergeRight } = mergeAnim;
    const isSlide = phase === "slide";
    const exprClass = ["sum-expr", isSlide ? "sum-expr--phase-slide" : ""].filter(Boolean).join(" ");

    const nodes = [];
    terms.forEach((term, i) => {
      if (i > 0) {
        const plusHidden = hiddenPlus[i] || (isSlide && i === mergeRight);
        nodes.push(
          React.createElement(
            "span",
            {
              key: `plus-wrap-${i}`,
              className: ["sum-plus-wrap", plusHidden ? "sum-plus-wrap--hidden" : ""].filter(Boolean).join(" "),
            },
            React.createElement("span", { className: "sum-plus" }, " + ")
          )
        );
      }
      const termHidden = hiddenTerms[i];
      const termHighlight =
        (phase === "highlight" || phase === "slide") && (i === mergeLeft || i === mergeRight);
      const termSlide = isSlide && i === mergeRight;
      const slideStyle = termSlide
        ? { "--merge-shift": `-${(mergeRight - mergeLeft) * 3.2 + 2}vw` }
        : undefined;
      nodes.push(
        React.createElement(
          "span",
          {
            key: `val-wrap-${i}`,
            className: [
              "sum-val-wrap",
              termHidden ? "sum-val-wrap--hidden" : "",
              termHighlight ? "sum-val-wrap--highlight" : "",
              termSlide ? "sum-val-wrap--slide-active" : "",
            ]
              .filter(Boolean)
              .join(" "),
            style: slideStyle,
          },
          React.createElement("span", { className: revealedClass }, term)
        )
      );
    });

    return React.createElement("span", { className: exprClass }, nodes);
  };

  const renderTotalTrialsBox = (total, exprParts, options = {}) => {
    const {
      onClick,
      clickable,
      disabled,
      large,
      blink,
      glow,
      revealedClass = "hl-number",
      mergeAnim = null,
    } = options;
    const inner = [
      React.createElement("span", { key: "label", className: "sum-label" }, `${T.ui.totalTrials} = `),
      mergeAnim
        ? renderMergeExpr(mergeAnim, revealedClass)
        : exprParts
          ? exprParts.map((part, i) =>
              React.createElement(
                React.Fragment,
                { key: `part-${i}` },
                i > 0 && React.createElement("span", { key: `plus-${i}`, className: "sum-plus" }, " + "),
                React.createElement(
                  "span",
                  { key: `val-${i}`, className: part.revealed ? revealedClass : "sum-unknown" },
                  part.text
                )
              )
            )
          : total != null
            ? React.createElement("span", { key: "total", className: revealedClass, "data-total-value": true }, total)
            : React.createElement("span", { key: "unknown", className: "sum-unknown" }, "?"),
    ];

    const boxClass = `total-trials-box ${large ? "total-trials-box--large" : ""} ${mergeAnim ? "total-trials-box--merging" : ""} ${mergeAnim?.phase === "collapse-width" ? "total-trials-box--collapse-width" : ""} ${glow ? "total-trials-box--glow" : ""} ${blink ? "total-trials-box--blink" : ""} ${clickable ? "total-trials-box--tap ftue-target" : ""}`;

    return React.createElement(
      "div",
      {
        className: boxClass,
        onClick: clickable && !disabled ? onClick : undefined,
        role: clickable ? "button" : undefined,
        tabIndex: clickable && !disabled ? 0 : undefined,
        onKeyDown:
          clickable && !disabled
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined,
        "aria-disabled": clickable && disabled ? true : undefined,
      },
      inner
    );
  };

  const renderFormulaBox = () =>
    React.createElement("div", {
      className: "formula-box",
      dangerouslySetInnerHTML: { __html: T.ui.formulaGeneral },
    });

  const renderDicePanel = (options = {}) => {
    const { showRollButton, rollLabel, showOutcomesText, highlightBars, glowBar, dimOthers } = options;
    return React.createElement(
      "div",
      { className: "lesson-panel lesson-panel--chart" },
      React.createElement(BarDiagram, {
        mode: "dice",
        frequencies: diceState.frequencies,
        ymax: T.chartMax,
        highlightBars,
        glowBar,
        dimOthers,
        chartRef,
      }),
      renderTotalTrialsBox(diceState.trialCount),
      showRollButton &&
        React.createElement(
          "div",
          { className: "dice-side-panel" },
          React.createElement(DiceDisplay, {
            value: diceState.dieValue,
            clickable: !diceState.isRolling,
            onClick: onRoll,
            showIdleAnimation: !diceState.isRolling,
            isRolling: diceState.isRolling,
            fastRoll: diceState.fastRoll,
          }),
          React.createElement(
            "button",
            {
              type: "button",
              className: "action-button ftue-target",
              disabled: diceState.isRolling || diceState.trialCount >= T.diceFirstRolls.length,
              onClick: onRoll,
            },
            rollLabel
          ),
          showOutcomesText &&
            React.createElement("div", { className: "outcomes-caption" }, T.ui.outcomesMany)
        )
    );
  };

  const renderEventPanel = (eventKey, eventHtml, children) =>
    React.createElement(
      "div",
      { className: "lesson-panel lesson-panel--formula formula-event-panel equation-panel" },
      React.createElement("div", {
        className: "formula-box formula-box--hero",
        dangerouslySetInnerHTML: { __html: T.ui.formulaGeneral },
      }),
      React.createElement(
        "div",
        { className: "event-card event-card--no-dice" },
        React.createElement("p", {
          className: "event-text",
          dangerouslySetInnerHTML: { __html: eventHtml },
        }),
        children
      )
    );

  const renderFrac = (num, den, numClass = "", denClass = "") =>
    React.createElement(
      "div",
      { className: "frac-line" },
      React.createElement("span", { className: "frac-eq" }, `f${eventState.fracSub}(A) =`.replace("(A)", `(${eventState.fracSub})`)),
      React.createElement(
        "span",
        { className: "frac-group" },
        React.createElement(
          "span",
          { className: `frac-box ${numClass}` },
          num
        ),
        React.createElement("span", { className: "frac-bar" }),
        React.createElement(
          "span",
          { className: `frac-box ${denClass}` },
          den
        )
      )
    );

  const renderVerticalFraction = (fractionStr) => {
    if (!fractionStr || fractionStr === "?") return fractionStr;
    const parts = fractionStr.split("/");
    if (parts.length !== 2) return fractionStr;
    return React.createElement(
      "span",
      { className: "frac-group frac-group--quiz" },
      React.createElement("span", { className: "frac-num" }, parts[0]),
      React.createElement("span", { className: "frac-bar" }),
      React.createElement("span", { className: "frac-den" }, parts[1])
    );
  };

  useEffect(() => {
    if (type === "spinnerBridge" && prevTypeRef.current !== "spinnerBridge") {
      setBridgeMorph(true);
      const timer = setTimeout(() => setBridgeMorph(false), 900);
      return () => clearTimeout(timer);
    }
    prevTypeRef.current = type;
  }, [type]);

  useEffect(() => {
    setQuizFlying(false);
    setQuizFlyChoice(null);
    setQuizSlotChoice(null);
    setQuizSlotWrong(false);
    setQuizChartRevealed(false);
  }, [stepData.id, type]);

  const QUIZ_FLY_MS = 600;
  const QUIZ_HOLD_MS = 600;
  const QUIZ_FLY_BACK_MS = 600;

  const handleQuizSelect = (quizId, choice, quiz) => {
    if (quizFlying) return;
    const selected = spinnerState.quizAnswers[quizId];
    if (selected === quiz.correct) return;
    setQuizChartRevealed(true);
    const root = ref.current;
    const sourceBtn = root?.querySelector(`[data-quiz-opt="${choice}"]`);
    const target = root?.querySelector("[data-quiz-answer-slot]");
    if (!sourceBtn || !target) {
      playSfx(choice === quiz.correct ? "correct" : "wrong");
      if (choice === quiz.correct) onQuizAnswer(quizId, choice);
      else onQuizWrong();
      return;
    }
    setQuizFlying(true);
    setQuizFlyChoice(choice);
    setQuizSlotChoice(null);
    setQuizSlotWrong(false);
    triggerGhost({
      sourceEl: sourceBtn,
      targetEl: target,
      text: choice,
      cloneFromEl: sourceBtn,
      preserveSourceOpacity: true,
      duration: QUIZ_FLY_MS,
      onArrive: () => {
        playSfx(choice === quiz.correct ? "correct" : "wrong");
        setQuizSlotChoice(choice);
        if (choice === quiz.correct) {
          onQuizAnswer(quizId, choice);
          setQuizFlying(false);
          setQuizFlyChoice(null);
          return;
        }
        setQuizSlotWrong(true);
        setTimeout(() => {
          setQuizSlotChoice(null);
          setQuizSlotWrong(false);
          triggerGhost({
            sourceEl: target,
            targetEl: sourceBtn,
            text: choice,
            cloneFromEl: sourceBtn,
            preserveSourceOpacity: true,
            duration: QUIZ_FLY_BACK_MS,
            onArrive: () => {
              setQuizFlying(false);
              setQuizFlyChoice(null);
            },
          });
        }, QUIZ_HOLD_MS);
      },
    });
  };

  const renderSpinnerChart = (options = {}) => {
    const { highlightBars, glowBar, dimOthers, previewFreq, emptyExpr, large, confirmedSections } = options;
    const spinnerChartTypes = ["spinnerOverview", "spinnerEnter", "spinnerSum", "spinnerSumDone", "spinnerQuiz"];
    const useSubYel = ["spinnerEnter", "spinnerSum", "spinnerSumDone", "spinnerQuiz"].includes(type);
    const useExpr = emptyExpr || spinnerState.showExpr;
    const exprParts = emptyExpr
      ? T.spinnerSections.map(() => ({ text: "?", revealed: false }))
      : spinnerState.sumMergeAnim
        ? null
        : spinnerState.exprParts;
    return React.createElement(
      "div",
      { className: "lesson-panel lesson-panel--chart spinner-chart-panel" },
      React.createElement(BarDiagram, {
        mode: "spinner",
        frequencies: spinnerState.frequencies,
        labels: T.spinnerSections,
        ymax: T.chartMax,
        highlightBars: highlightBars || [],
        glowBar: glowBar || null,
        dimOthers: Boolean(dimOthers),
        previewFreq,
        showFreqLabels: type === "spinnerQuiz",
        confirmedSections: confirmedSections || [],
        chartRef,
      }),
      renderTotalTrialsBox(
        useExpr ? null : spinnerState.totalDisplay,
        useExpr ? exprParts : null,
        {
          large: large || spinnerChartTypes.includes(type),
          clickable: type === "spinnerSum",
          onClick: type === "spinnerSum" ? onSumExpressionTap : undefined,
          blink: type === "spinnerSum",
          revealedClass: useSubYel ? "sub-yel" : "hl-number",
          mergeAnim: spinnerState.sumMergeAnim,
        }
      )
    );
  };

  const renderBody = () => {
    if (isEnd) {
      return React.createElement(
        "div",
        { className: "lesson-end-inline" },
        React.createElement("h1", { className: "welcome-title" }, T.ui.endTitle),
        React.createElement("p", {
          className: "welcome-message",
          dangerouslySetInnerHTML: { __html: T.ui.endMessage },
        }),
        React.createElement("p", { className: "tap-start-text" }, T.ui.endTap),
        React.createElement(
          "button",
          { ref: startOverButtonRef, className: "start-over-button ftue-target", onClick: handleStartOver },
          T.ui.startOverButton
        )
      );
    }

    if (type === "diceRoll") {
      const canRoll = diceState.rollStage === "idle" && diceState.trialCount < T.diceFirstRolls.length;
      return React.createElement(
        "div",
        { className: "lesson-grid" },
        React.createElement(
          "div",
          { className: "lesson-left" },
          React.createElement(BarDiagram, {
            mode: "dice",
            frequencies: diceState.frequencies,
            ymax: T.chartMax,
            highlightFace: diceState.highlightFace,
            animateLabels: !diceState.fastRoll,
            chartRef,
          }),
          renderTotalTrialsBox(diceState.trialCount)
        ),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--dice" },
          React.createElement(DiceDisplay, {
            value: diceState.dieValue,
            clickable: canRoll,
            onClick: onRoll,
            showIdleAnimation: canRoll && diceState.trialCount === 0,
            isRolling: diceState.isRolling,
            fastRoll: diceState.fastRoll,
          }),
          React.createElement(
            "button",
            {
              type: "button",
              className: `action-button ftue-target${canRoll ? "" : " action-button--hidden"}`,
              onClick: onRoll,
              disabled: !canRoll,
              "aria-hidden": !canRoll,
            },
            T.ui.rollOnce
          )
        )
      );
    }

    if (type === "diceRollBatch") {
      const batchDone = diceState.trialCount >= T.diceTotalTrials && !diceState.isRolling;
      const showRollButton = !batchDone && diceState.rollStage === "idle";
      return React.createElement(
        "div",
        { className: "lesson-grid" },
        React.createElement(
          "div",
          { className: "lesson-left" },
          React.createElement(BarDiagram, {
            mode: "dice",
            frequencies: diceState.frequencies,
            ymax: T.chartMax,
            highlightFace: diceState.highlightFace,
            animateLabels: !diceState.fastRoll,
            chartRef,
          }),
          renderTotalTrialsBox(diceState.trialCount)
        ),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--dice" },
          React.createElement(DiceDisplay, {
            value: diceState.dieValue,
            clickable: !batchDone && !diceState.isRolling,
            onClick: onRoll,
            isRolling: diceState.isRolling,
            showIdleAnimation: !batchDone && !diceState.isRolling,
            fastRoll: diceState.fastRoll,
          }),
          React.createElement(
            "div",
            { className: "dice-action-slot" },
            React.createElement(
              "button",
              {
                type: "button",
                className: `action-button ftue-target${showRollButton ? "" : " action-button--hidden"}`,
                onClick: onRoll,
                disabled: !showRollButton,
                "aria-hidden": !showRollButton,
              },
              T.ui.rollMany
            ),
            React.createElement(
              "div",
              {
                className: `outcomes-caption outcomes-caption--large${batchDone ? "" : " outcomes-caption--hidden"}`,
                "aria-hidden": !batchDone,
              },
              T.ui.outcomesMany
            )
          )
        )
      );
    }

    if (type === "diceRecorded") {
      return null;
    }

    if (type === "diceEventCalc") {
      const eventKey = stepData.eventKey;
      const event = T.diceEvents[eventKey];
      const eventHtml = eventKey === "A" ? T.ui.eventA : eventKey === "B" ? T.ui.eventB : T.ui.eventC;
      const freqSymbol = T.ui[`freqSymbol${eventKey}`];

      if (eventKey === "A") {
        const { freqRevealed, totalRevealed } = eventState.eventA;
        const freqAnimActive = Boolean(eventGlow.bar) || (eventFlying && !freqRevealed);
        const activeBar = freqAnimActive ? event.flyBar : null;

        return React.createElement(
          "div",
          { className: "lesson-grid" },
          React.createElement(
            "div",
            { className: "lesson-left" },
            React.createElement(BarDiagram, {
              mode: "dice",
              frequencies: diceState.frequencies,
              ymax: T.chartMax,
              highlightBars: activeBar != null ? [activeBar] : [],
              glowBar: activeBar,
              dimOthers: activeBar != null,
              highlightFace: diceState.highlightFace,
              chartRef,
            }),
            renderTotalTrialsBox(diceState.trialCount, null, { glow: eventGlow.total })
          ),
          renderEventPanel(
            "A",
            eventHtml,
            React.createElement(
              "div",
              { className: "event-formula-block" },
              React.createElement(
                "div",
                { className: "frac-line" },
                renderFormulaVar("(A)"),
                renderFormulaEquals(),
                React.createElement(
                  "span",
                  { className: "frac-group" },
                  renderFlipSlot({
                    flipKey: "A-freq",
                    frontContent: freqSymbol,
                    revealed: freqRevealed,
                    filledValue: event.sum,
                    isActive: !freqRevealed,
                    disabled: eventFlying,
                    onClick: () => handleEventCalcFreqTap("A"),
                    targetAttr: { "data-freq-target": true },
                  }),
                  React.createElement("span", { className: "frac-bar" }),
                  renderFlipSlot({
                    flipKey: "A-total",
                    frontContent: T.ui.totalSymbol,
                    revealed: totalRevealed,
                    filledValue: T.diceTotalTrials,
                    isActive: freqRevealed && !totalRevealed,
                    disabled: !freqRevealed || eventFlying,
                    onClick: () => handleEventCalcTotalTap("A"),
                    targetAttr: { "data-total-target": true },
                  })
                )
              )
            )
          )
        );
      }

      const state = eventState[`event${eventKey}`];
      const showCompact = state.sumCompact;
      const buildAnimActive = state.buildStarted && !state.buildComplete;
      const currentGlowBar = eventGlow.bar ?? state.animatingFace ?? null;

      return React.createElement(
        "div",
        { className: "lesson-grid" },
        React.createElement(
          "div",
          { className: "lesson-left" },
          React.createElement(BarDiagram, {
            mode: "dice",
            frequencies: diceState.frequencies,
            ymax: T.chartMax,
            highlightBars: buildAnimActive ? event.faces : [],
            glowBar: buildAnimActive ? currentGlowBar : null,
            dimOthers: buildAnimActive,
            chartRef,
          }),
          renderTotalTrialsBox(diceState.trialCount)
        ),
        renderEventPanel(
          eventKey,
          eventHtml,
          React.createElement(
            "div",
            { className: "event-formula-block" },
            React.createElement(
              "div",
              { className: "frac-line frac-line--compound" },
              renderFormulaVar(`(${eventKey})`),
              renderFormulaEquals(),
              !state.buildStarted
                ? React.createElement(
                    "span",
                    { className: "frac-group event-numerator-group" },
                    renderFlipSlot({
                      flipKey: `${eventKey}-build`,
                      frontContent: freqSymbol,
                      revealed: false,
                      filledValue: freqSymbol,
                      isActive: true,
                      disabled: state.isAnimating || eventFlying,
                      onClick: () => handleEventBuildStartTap(eventKey),
                    }),
                    React.createElement("span", { className: "frac-bar" }),
                    React.createElement(
                      "span",
                      { className: "frac-box frac-tap--done frac-slot-fixed" },
                      T.diceTotalTrials
                    )
                  )
                : showCompact
                  ? React.createElement(
                      "span",
                      { className: "frac-group fraction-result--compact" },
                      React.createElement(
                        "span",
                        { className: "frac-box frac-tap--done fraction-result-value frac-slot-fixed" },
                        event.sum
                      ),
                      React.createElement("span", { className: "frac-bar" }),
                      React.createElement(
                        "span",
                        { className: "frac-box frac-tap--done frac-slot-fixed" },
                        T.diceTotalTrials
                      )
                    )
                  : React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                      "span",
                      { className: "frac-group frac-group--wide event-numerator-group" },
                      renderCompoundNumerator(event, state.terms),
                      React.createElement("span", { className: "frac-bar" }),
                      React.createElement(
                        "span",
                        { className: "frac-box frac-tap--done frac-slot-fixed" },
                        T.diceTotalTrials
                      )
                    ),
                    state.buildComplete &&
                      React.createElement("span", { className: "frac-eq equation-peek" }, "="),
                    state.buildComplete &&
                      React.createElement(
                        "span",
                        { className: "frac-group equation-peek" },
                        state.sumRevealed
                          ? React.createElement(
                              "span",
                              { className: "frac-box frac-tap--done frac-slot-fixed" },
                              event.sum
                            )
                          : renderFlipSlot({
                              flipKey: `${eventKey}-sum`,
                              frontContent: "?",
                              backContent: String(event.sum),
                              revealed: false,
                              filledValue: event.sum,
                              isActive: true,
                              disabled: state.isAnimating || eventFlying || !state.sumPromptReady,
                              onClick: () => handleEventSumTapAnimated(eventKey),
                              doneClass: "event-sum-button",
                            }),
                        React.createElement("span", { className: "frac-bar" }),
                        React.createElement(
                          "span",
                          { className: "frac-box frac-tap--done frac-slot-fixed" },
                          T.diceTotalTrials
                        )
                      )
                  )
            )
          )
        )
      );
    }

    if (type === "spinnerBridge") {
      return React.createElement(
        "div",
        { className: `bridge-layout fade-in ${bridgeMorph ? "bridge-layout--morph" : ""}` },
        React.createElement(
          "div",
          { className: `bridge-chart ${bridgeMorph ? "bridge-chart--morph" : ""}` },
          React.createElement(BarDiagram, {
            mode: "dice",
            frequencies: diceState.frequencies,
            ymax: T.chartMax,
            chartRef,
          })
        ),
        React.createElement(
          "div",
          { className: "bridge-copy" },
          React.createElement("p", { className: "bridge-text" }, T.ui.spinnerBridge1),
          React.createElement("p", { className: "bridge-text" }, T.ui.spinnerBridge2),
          React.createElement(
            "button",
            {
              type: "button",
              className: "action-button bridge-continue-btn ftue-target",
              onClick: onBridgeContinue,
            },
            T.ui.bridgeContinue
          )
        )
      );
    }

    if (type === "spinnerOverview") {
      return React.createElement(
        "div",
        { className: "lesson-grid" },
        renderSpinnerChart({ emptyExpr: true }),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--caption" },
          React.createElement("p", { className: "bridge-text bridge-text--center bridge-text--overview" }, T.ui.spinnerOverviewBody)
        )
      );
    }

    if (type === "spinnerEnter") {
      const section = stepData.section;
      const confirmed = spinnerState.enteredValues[section] != null;
      const enteredSections = T.spinnerSections.filter((s) => spinnerState.enteredValues[s] != null);
      const isWrong = Boolean(spinnerState.preview?.wrong);
      const hasSubmitPreview = Boolean(spinnerState.preview);
      const numpadDisabled = confirmed || spinnerState.correctHold;
      const entryValue = confirmed
        ? String(spinnerState.enteredValues[section])
        : spinnerState.currentInput;
      return React.createElement(
        "div",
        { className: "lesson-grid lesson-grid--spinner" },
        renderSpinnerChart({
          highlightBars: isWrong ? [section] : [],
          glowBar: isWrong ? section : null,
          dimOthers: isWrong,
          previewFreq: hasSubmitPreview ? spinnerState.preview : null,
          confirmedSections: enteredSections,
        }),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--entry entry-panel-fixed" },
          React.createElement(
            "p",
            { className: "entry-label entry-label--large" },
            T.ui.freqOfSection.replace("{section}", section)
          ),
          React.createElement(
            "div",
            {
              className: `entry-slot ${confirmed ? "entry-slot--done" : ""} ${spinnerState.correctHold ? "entry-slot--correct-hold" : ""} ${spinnerState.preview?.wrong && numpadFreshStart ? "entry-slot--wrong" : ""}`,
              "data-entry-target": true,
            },
            entryValue
          ),
          React.createElement(NumPad, {
            value: spinnerState.currentInput,
            onChange: (val) => {
              onSpinnerInputChange(val);
              setNumpadFreshStart(false);
            },
            onSubmit: handleSpinnerSubmit,
            onKeyTap: onNumpadTap,
            disabled: numpadDisabled,
            freshStartOnNextKey: numpadFreshStart,
          })
        )
      );
    }

    if (type === "spinnerSum") {
      return React.createElement(
        "div",
        { className: "lesson-grid lesson-grid--spinner" },
        renderSpinnerChart({}),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--entry entry-panel-fixed" },
          React.createElement("p", { className: "entry-label" }, `${T.ui.freqOfSection.replace("{section}", "D")}`),
          React.createElement("div", { className: "entry-slot entry-slot--done" }, T.spinnerFreq.D)
        )
      );
    }

    if (type === "spinnerSumDone") {
      const showSumDoneText = spinnerState.totalDisplay != null;
      return React.createElement(
        "div",
        { className: "lesson-grid lesson-grid--spinner" },
        renderSpinnerChart({ large: true }),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--caption" },
          showSumDoneText &&
            React.createElement(
              "p",
              { className: "bridge-text bridge-text--center bridge-text--overview" },
              T.ui.spinnerSumDone
            )
        )
      );
    }

    if (type === "spinnerQuiz") {
      const quiz = T.spinnerQuizzes[stepData.quizIndex];
      const selected = spinnerState.quizAnswers[quiz.id];
      const highlightRaw = quiz.highlight || (quiz.section ? [quiz.section] : quiz.labelParts);
      const highlightBars = Array.isArray(highlightRaw) ? highlightRaw : [highlightRaw];
      const showQuizChartHighlight = quizChartRevealed || selected === quiz.correct;
      const eventHtml = [T.ui.event1, T.ui.event2, T.ui.event3][stepData.quizIndex];
      const slotChoice = selected || quizSlotChoice;
      const slotFilled = Boolean(slotChoice);
      return React.createElement(
        "div",
        { className: "lesson-grid lesson-grid--quiz" },
        renderSpinnerChart({
          highlightBars: showQuizChartHighlight ? highlightBars : [],
          dimOthers: showQuizChartHighlight,
        }),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--quiz equation-panel quiz-panel-fixed" },
          React.createElement("div", {
            className: "formula-box formula-box--hero",
            dangerouslySetInnerHTML: { __html: T.ui.formulaGeneral },
          }),
          React.createElement(
            "div",
            { className: "event-card quiz-event-card" },
            React.createElement("p", {
              className: "event-text",
              dangerouslySetInnerHTML: { __html: eventHtml },
            }),
            React.createElement(
              "div",
              { className: "quiz-formula-row" },
              renderFormulaVar(`(${stepData.quizIndex + 1})`),
              renderFormulaEquals(),
              React.createElement(
                "span",
                {
                  className: `quiz-answer-slot ${selected === quiz.correct || quizSlotChoice === quiz.correct ? "quiz-answer-slot--correct" : ""} ${quizSlotWrong ? "quiz-answer-slot--wrong" : ""}`,
                  "data-quiz-answer-slot": true,
                },
                slotFilled ? renderVerticalFraction(slotChoice) : "?"
              )
            ),
            React.createElement(
              "div",
              { className: "quiz-options" },
              quiz.options.map((opt) => {
                const hideOption =
                  (quizFlying && quizFlyChoice === opt) || (selected === opt && opt === quiz.correct);
                const dimOthers =
                  (selected === quiz.correct || quizSlotChoice === quiz.correct) &&
                  opt !== quiz.correct &&
                  !hideOption;
                return React.createElement(
                  "button",
                  {
                    key: opt,
                    type: "button",
                    "data-quiz-opt": opt,
                    className: `quiz-option ftue-target${hideOption ? " quiz-option--moved" : ""}${dimOthers ? " quiz-option--dim" : ""}`,
                    disabled:
                      selected === quiz.correct || (quizFlying && quizFlyChoice === opt),
                    onClick: () => handleQuizSelect(quiz.id, opt, quiz),
                  },
                  React.createElement(
                    "span",
                    { className: "quiz-option-content", "data-quiz-opt-content": opt },
                    renderVerticalFraction(opt)
                  )
                );
              })
            )
          )
        )
      );
    }

    return null;
  };

  return React.createElement(
    "div",
    { className: "lesson-screen", ref },
    !isEnd && renderTitle(),
    React.createElement("div", { className: "lesson-workspace fade-in" }, renderBody()),
    AppletAnimator.GhostFlightLayer({ ghosts })
  );
});
