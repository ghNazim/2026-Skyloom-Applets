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
  const [eventFlips, setEventFlips] = useState({});
  const [eventGlow, setEventGlow] = useState({ bar: null, total: false, sumKey: null });
  const prevTypeRef = useRef(type);

  const FLIP_MS = 600;
  const GLOW_MS = 450;

  const setFlip = (key, value) => setEventFlips((prev) => ({ ...prev, [key]: value }));
  const isFlipped = (key) => eventFlips[key] === true;

  useEffect(() => {
    setEventFlips({});
    setEventGlow({ bar: null, total: false, sumKey: null });
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
            className: `flip-frac-face flip-frac-front event-reveal-button ftue-target frac-tap ${isActive ? "frac-tap--active" : ""}`,
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

  const flyValue = (sourceSel, targetSel, text, colorClass, cb) => {
    const root = ref.current;
    const source = root?.querySelector(sourceSel);
    const target = root?.querySelector(targetSel);
    if (!source || !target) {
      cb();
      return;
    }
    setEventFlying(true);
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
    setFlip(`${eventKey}-build`, true);
    setTimeout(() => onEventBuildStart(eventKey), FLIP_MS);
  };

  const handleEventSumTapAnimated = (eventKey) => {
    const state = eventState[`event${eventKey}`];
    if (!state.buildComplete || state.sumRevealed || eventFlying || !state.sumPromptReady || isFlipped(`${eventKey}-sum`)) return;
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
      onSpinnerSubmitWrong();
      return;
    }
    flyValueSpinner(
      `[data-freq-preview="${section}"]`,
      "[data-entry-target]",
      expected,
      "ghost-freq",
      onSpinnerSubmitCorrect
    );
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

  const renderTotalTrialsBox = (total, exprParts, options = {}) => {
    const { onClick, clickable, disabled, large, collapsing, blink, glow } = options;
    const inner = [
      React.createElement("span", { key: "label" }, `${T.ui.totalTrials} = `),
      exprParts
        ? exprParts.map((part, i) =>
            React.createElement(
              React.Fragment,
              { key: `part-${i}` },
              i > 0 && React.createElement("span", { key: `plus-${i}`, className: "sum-plus" }, " + "),
              React.createElement(
                "span",
                { key: `val-${i}`, className: part.revealed ? "hl-number" : "sum-unknown" },
                part.text
              )
            )
          )
        : total != null
          ? React.createElement("span", { key: "total", className: "hl-number", "data-total-value": true }, total)
          : React.createElement("span", { key: "unknown", className: "sum-unknown" }, "?"),
    ];

    const boxClass = `total-trials-box ${large ? "total-trials-box--large" : ""} ${collapsing ? "total-trials-box--collapsing" : ""} ${glow ? "total-trials-box--glow" : ""}`;

    if (clickable) {
      return React.createElement(
        "button",
        {
          type: "button",
          className: `total-trials-box total-trials-box--tap ftue-target ${large ? "total-trials-box--large" : ""} ${blink ? "total-trials-box--blink" : ""} ${glow ? "total-trials-box--glow" : ""}`,
          onClick,
          disabled,
        },
        inner
      );
    }

    return React.createElement("div", { className: boxClass }, inner);
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

  const handleQuizSelect = (quizId, choice, quiz) => {
    if (quizFlying) return;
    const selected = spinnerState.quizAnswers[quizId];
    if (selected === quiz.correct) return;
    const root = ref.current;
    const source = root?.querySelector(`[data-quiz-opt="${choice}"]`);
    const target = root?.querySelector("[data-quiz-answer-slot]");
    if (!source || !target) {
      onQuizAnswer(quizId, choice);
      return;
    }
    setQuizFlying(true);
    triggerGhost({
      sourceEl: source,
      targetEl: target,
      text: choice,
      colorClass: choice === quiz.correct ? "ghost-freq" : "ghost-wrong",
      onComplete: () => {
        setQuizFlying(false);
        onQuizAnswer(quizId, choice);
      },
    });
  };

  const renderSpinnerChart = (options = {}) => {
    const { highlightBars, glowBar, dimOthers, previewFreq, emptyExpr, large, confirmedSections } = options;
    const showExpr = spinnerState.showExpr !== false;
    const exprParts = emptyExpr
      ? T.spinnerSections.map(() => ({ text: "?", revealed: false }))
      : spinnerState.sumCollapseParts || spinnerState.exprParts;
    const isEntering = type === "spinnerEnter";
    return React.createElement(
      "div",
      { className: "lesson-panel lesson-panel--chart spinner-chart-panel" },
      React.createElement(BarDiagram, {
        mode: "spinner",
        frequencies: spinnerState.frequencies,
        labels: T.spinnerSections,
        ymax: T.chartMax,
        highlightBars,
        glowBar,
        dimOthers,
        previewFreq,
        showFreqLabels: isEntering || type === "spinnerQuiz",
        confirmedSections: confirmedSections || [],
        chartRef,
      }),
      renderTotalTrialsBox(
        showExpr ? null : spinnerState.totalDisplay,
        showExpr ? exprParts : null,
        {
          large: large || type === "spinnerOverview" || type === "spinnerSumDone" || type === "spinnerSum",
          collapsing: spinnerState.sumCollapseParts != null,
          clickable: type === "spinnerSum",
          onClick: type === "spinnerSum" ? onSumExpressionTap : undefined,
          blink: type === "spinnerSum",
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
        const glowBar = eventGlow.bar ?? (!freqRevealed ? event.flyBar : null);

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
              highlightBars: event.faces,
              glowBar,
              dimOthers: !freqRevealed,
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
      const highlight = state.buildStarted ? event.faces : state.terms.map((t) => t.face);
      const showCompact = state.sumCompact;
      const compoundGlowBar = eventGlow.bar ?? state.animatingFace;

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
            highlightBars: highlight,
            glowBar: compoundGlowBar,
            dimOthers: state.buildStarted,
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
                    { className: "frac-group" },
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
          React.createElement("p", { className: "bridge-text bridge-text--center" }, T.ui.spinnerOverviewBody)
        )
      );
    }

    if (type === "spinnerEnter") {
      const section = stepData.section;
      const confirmed = spinnerState.enteredValues[section] != null;
      const enteredSections = T.spinnerSections.filter((s) => spinnerState.enteredValues[s] != null);
      const hasPreview = spinnerState.preview && !confirmed;
      return React.createElement(
        "div",
        { className: "lesson-grid lesson-grid--spinner" },
        renderSpinnerChart({
          glowBar: confirmed ? null : section,
          highlightBars: enteredSections,
          dimOthers: hasPreview || !confirmed,
          previewFreq: spinnerState.preview,
          confirmedSections: enteredSections,
        }),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--entry entry-panel-fixed" },
          React.createElement(
            "p",
            { className: "entry-label" },
            T.ui.freqOfSection.replace("{section}", section)
          ),
          React.createElement(
            "div",
            {
              className: `entry-slot ${confirmed ? "entry-slot--done" : ""} ${spinnerState.preview?.wrong ? "entry-slot--wrong" : ""} ${hasPreview && !spinnerState.preview?.wrong ? "entry-slot--preview" : ""}`,
              "data-entry-target": true,
            },
            confirmed ? String(spinnerState.enteredValues[section]) : spinnerState.currentInput
          ),
          !confirmed &&
            React.createElement(NumPad, {
              value: spinnerState.currentInput,
              onChange: onSpinnerInputChange,
              onSubmit: handleSpinnerSubmit,
              onKeyTap: onNumpadTap,
              disabled: spinnerFlying,
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
      return React.createElement(
        "div",
        { className: "lesson-grid lesson-grid--spinner" },
        renderSpinnerChart({ large: true }),
        React.createElement(
          "div",
          { className: "lesson-right lesson-right--caption" },
          React.createElement("p", { className: "bridge-text bridge-text--center bridge-text--large" }, T.ui.spinnerSumDone)
        )
      );
    }

    if (type === "spinnerQuiz") {
      const quiz = T.spinnerQuizzes[stepData.quizIndex];
      const selected = spinnerState.quizAnswers[quiz.id];
      const highlight = quiz.highlight || (quiz.section ? [quiz.section] : quiz.labelParts);
      const eventHtml = [T.ui.event1, T.ui.event2, T.ui.event3][stepData.quizIndex];
      return React.createElement(
        "div",
        { className: "lesson-grid lesson-grid--quiz" },
        renderSpinnerChart({ highlightBars: highlight, dimOthers: true }),
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
                  className: `quiz-answer-slot ${selected === quiz.correct ? "quiz-answer-slot--correct" : selected ? "quiz-answer-slot--wrong" : ""}`,
                  "data-quiz-answer-slot": true,
                },
                selected && !quizFlying ? renderVerticalFraction(selected) : "?"
              )
            ),
            React.createElement(
              "div",
              { className: "quiz-options" },
              quiz.options.map((opt) =>
                React.createElement(
                  "button",
                  {
                    key: opt,
                    type: "button",
                    "data-quiz-opt": opt,
                    className: `quiz-option ftue-target ${selected === opt ? (opt === quiz.correct ? "quiz-option--correct" : "quiz-option--wrong") : ""}`,
                    disabled: selected === quiz.correct || quizFlying,
                    onClick: () => handleQuizSelect(quiz.id, opt, quiz),
                  },
                  renderVerticalFraction(opt)
                )
              )
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
