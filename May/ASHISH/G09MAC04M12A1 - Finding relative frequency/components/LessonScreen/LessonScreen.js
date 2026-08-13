const LessonScreen = React.forwardRef((props, ref) => {
  const { useEffect, useState } = React;
  const {
    stepConfig,
    marbleState,
    machineState,
    spinnerState,
    eventProgress,
    onFill,
    onDraw,
    onMarbleServed,
    onSpin,
    onRevealEventPart,
    onInteractionBusyChange,
    handleStartOver,
    startOverButtonRef,
  } = props;
  const { ghosts, triggerGhost } = AppletAnimator.useGhostFlight(ref);
  const [isFlying, setIsFlying] = useState(false);
  const [revealPhase, setRevealPhase] = useState(null);
  const [compoundTerms, setCompoundTerms] = useState([]);
  const [flyingLabel, setFlyingLabel] = useState(null);
  const [tableGlowBusy, setTableGlowBusy] = useState(false);

  const playSfx = (name) => {
    try {
      const audio = new Audio(T.sfx[name]);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const stepData = stepConfig.stepData || {};
  const type = stepConfig.type;
  const isEnd = type === "end";

  useEffect(() => {
    if (onInteractionBusyChange) onInteractionBusyChange(isFlying);
    return () => {
      if (onInteractionBusyChange) onInteractionBusyChange(false);
    };
  }, [isFlying, onInteractionBusyChange]);

  useEffect(() => {
    setCompoundTerms([]);
    setFlyingLabel(null);
    setRevealPhase(null);
    setIsFlying(false);
  }, [stepConfig.step, stepData.id]);

  useEffect(() => {
    if (type !== "marbleDraw" && type !== "spinnerSpin") return undefined;
    const hasOutcome =
      (type === "marbleDraw" && marbleState.draws > 0) ||
      (type === "spinnerSpin" && spinnerState.spins > 0);
    if (!hasOutcome) return undefined;
    setTableGlowBusy(true);
    const timer = setTimeout(() => setTableGlowBusy(false), 1100);
    return () => clearTimeout(timer);
  }, [type, marbleState.draws, spinnerState.spins]);

  const colorNames = {
    red: { en: "Red", id: "Merah" },
    yellow: { en: "Yellow", id: "Kuning" },
    blue: { en: "Blue", id: "Biru" },
    green: { en: "Green", id: "Hijau" },
  };

  const currentLang = window.APP_LANGUAGE === "id" ? "id" : "en";
  const nameFor = (color) => colorNames[color]?.[currentLang] || color;
  const totalFor = (counts) =>
    Object.keys(counts).reduce((sum, key) => sum + counts[key], 0);
  const getEvent = () =>
    stepData.experiment === "spinner"
      ? T.ui.spinnerEvents[stepData.eventKey]
      : T.ui.marbleEvents[stepData.eventKey];
  const getProgress = () =>
    eventProgress[`${stepData.experiment}-${stepData.eventKey}`] || {};

  const isExperimentTotalKnown = () => {
    if (stepData.experiment !== "marble" && stepData.experiment !== "spinner") return false;
    const firstKey = `${stepData.experiment}-A`;
    return !!(eventProgress[firstKey] || {}).total;
  };

  const getEffectiveProgress = () => {
    const progress = getProgress();
    if (stepData.eventKey !== "A" && isExperimentTotalKnown() && !progress.total) {
      return { ...progress, total: true };
    }
    return progress;
  };

  const finishReveal = (part) => {
    onRevealEventPart(part);
    setRevealPhase(null);
    setIsFlying(false);
  };

  const flipThenReveal = (part) => {
    if (isFlying) return;
    setIsFlying(true);
    setRevealPhase(part);
    setTimeout(() => finishReveal(part), 340);
  };

  const flyThenReveal = (sourceSelectors, targetSelector, texts, part, colorClasses = []) => {
    if (isFlying) return;
    setIsFlying(true);
    setRevealPhase(part);

    setTimeout(() => {
      const root = ref.current;
      const target = root?.querySelector(targetSelector);
      const sources = sourceSelectors
        .map((selector) => root?.querySelector(selector))
        .filter(Boolean);

      if (!target || sources.length !== sourceSelectors.length) {
        finishReveal(part);
        return;
      }

      playSfx("swoosh");
      let completedFlights = 0;
      sources.forEach((source, index) => {
        setTimeout(() => {
          triggerGhost({
            sourceEl: source,
            targetEl: target,
            text: texts[index],
            duration: 780,
            colorClass: colorClasses[index] || (part === "total" ? "ghost-total" : "ghost-freq"),
            onComplete: () => {
              completedFlights += 1;
              if (completedFlights === sources.length) finishReveal(part);
            },
          });
        }, index * 160);
      });
    }, 360);
  };

  const flyNextCompoundTerm = (event, index) => {
    const root = ref.current;
    const label = event.labels[index];
    const source = root?.querySelector(`[data-freq-label="${label}"]`);
    const target = root?.querySelector("[data-freq-target]");
    if (!source || !target) {
      finishReveal("freq");
      return;
    }
    setFlyingLabel(label);
    playSfx("swoosh");
    triggerGhost({
      sourceEl: source,
      targetEl: target,
      text: String(event.parts[index]),
      duration: 780,
      colorClass: `ghost-freq ghost-freq--${label}`,
      onComplete: () => {
        setCompoundTerms((prev) => [...prev, { label, value: event.parts[index] }]);
        setFlyingLabel(null);
        if (index + 1 < event.labels.length) {
          setTimeout(() => flyNextCompoundTerm(event, index + 1), 450);
        } else {
          finishReveal("freq");
        }
      },
    });
  };

  const startCompoundFly = (event) => {
    if (isFlying) return;
    setIsFlying(true);
    setRevealPhase("freq");
    setCompoundTerms([]);
    setFlyingLabel(null);
    playSfx("click");
    setTimeout(() => flyNextCompoundTerm(event, 0), 360);
  };

  const renderTitle = () => {
    if (isEnd) return null;
    const experimentBusy =
      machineState.isFilling ||
      marbleState.isDrawing ||
      spinnerState.isSpinning ||
      isFlying ||
      tableGlowBusy;
    if (type === "marbleDraw" || type === "marbleReady") {
      const isComplete = marbleState.draws >= T.marbleSequence.length;
      return React.createElement(
        "div",
        { className: `lesson-title ${experimentBusy ? "lesson-title--quiet" : ""}` },
        experimentBusy ? "" : isComplete ? T.ui.outcomes10 : T.ui.drawTitle,
      );
    }
    if (type === "spinnerSpin" || type === "spinnerReady") {
      const isComplete = spinnerState.spins >= T.spinnerSequence.length;
      return React.createElement(
        "div",
        { className: `lesson-title ${experimentBusy ? "lesson-title--quiet" : ""}` },
        experimentBusy ? "" : isComplete ? T.ui.outcomes8 : T.ui.spinTitle,
      );
    }
    return React.createElement(
      "div",
      { className: `lesson-title ${isFlying ? "lesson-title--quiet" : ""}` },
      !isFlying && React.createElement(
        React.Fragment,
        null,
      React.createElement("span", null, `${T.ui.formulaTitlePrefix} `),
      React.createElement(
        "span",
        { className: "title-fr-symbol" },
        "( ",
        React.createElement("span", { className: "frac-eq" }, "f"),
        React.createElement("sub", null, "r"),
        " )",
      ),
      React.createElement("span", null, ` ${T.ui.formulaTitleSuffix || ""}`),
      ),
    );
  };

  const renderTable = ({
    counts,
    labels,
    xTitle,
    total,
    highlight = [],
    glow = null,
    glowKey = 0,
    showRows = true,
    transferLabels = [],
    transferTotal = false,
  }) =>
    !showRows
      ? null
      :
    React.createElement(
      "div",
      { className: "rf-table-wrap" },
      React.createElement(
        "div",
        { className: "frequency-table" },
        React.createElement(
          "div",
          { className: "freq-heading-row" },
          React.createElement("span", null, xTitle),
          React.createElement("span", null, T.ui.frequency),
        ),
        showRows &&
          labels.map((label) =>
            React.createElement(
              "div",
              {
                // Remount the active row for every completed trial so its CSS
                // pulse restarts even when consecutive outcomes share a color.
                key: Array.isArray(glow) && glow.includes(label) ? `${label}-${glowKey}` : glow === label ? `${label}-${glowKey}` : label,
                className: `freq-card-row ${highlight.includes(label) ? "row-highlight" : ""} ${(Array.isArray(glow) ? glow.includes(label) : glow === label) ? "row-glow" : ""} ${transferLabels.includes(label) ? "row-transfer" : ""}`,
              },
              React.createElement(
                "span",
                { className: `freq-card-cell color-text-${label}` },
                nameFor(label),
              ),
              React.createElement(
                "span",
                {
                  className: `freq-card-cell color-text-${label}`,
                  "data-freq-label": label,
                },
                counts[label] || 0,
              ),
            ),
          ),
        showRows &&
          React.createElement(
            "div",
            { className: `freq-card-row freq-card-row--total ${transferTotal ? "row-transfer" : ""}` },
            React.createElement("span", { className: "freq-card-cell" }, T.ui.total),
            React.createElement(
              "span",
              { className: "freq-card-cell", "data-total-value": true },
              total,
            ),
          ),
      ),
    );

  const renderMachine = () =>
    React.createElement(
      "div",
      { className: "machine-zone" },
      React.createElement(MachineVisual, {
        tubeColors: ["red", "red", "blue", "yellow"],
        serveSequence: [T.marbleSequence[marbleState.draws] || "red"],
        autoFill: false,
        machineFilled: machineState.machineFilled,
        triggerFill: machineState.fillTrigger,
        triggerServe: marbleState.machineTrigger,
        inactive: false,
        onFill,
        onDraw,
        onServesDone: onMarbleServed,
        fillLabel: T.ui.fillButton,
        drawLabel: T.ui.drawButton,
        canFill:
          !machineState.machineFilled &&
          !machineState.isFilling &&
          marbleState.draws === 0,
        canDraw:
          machineState.machineFilled &&
          !marbleState.isDrawing &&
          marbleState.draws < T.marbleSequence.length,
      }),
    );

  const renderSpinner = () =>
    React.createElement(
      "button",
      {
        type: "button",
        className: `spinner-button ${spinnerState.isSpinning || spinnerState.spins >= T.spinnerSequence.length ? "spinner-button--inactive" : "ftue-target"}`,
        disabled:
          spinnerState.isSpinning ||
          spinnerState.spins >= T.spinnerSequence.length,
        onClick: onSpin,
        "aria-label": T.ui.spinButton,
      },
      React.createElement(
        "div",
        {
          className: "spinner-wheel",
        },
        T.spinnerColors.map((color, index) =>
          React.createElement(
            "span",
            { key: color, className: `spinner-label spinner-label-${index}` },
            nameFor(color),
          ),
        ),
      ),
      React.createElement("div", {
        className: "spinner-pointer",
        style: { transform: `translateX(-50%) rotate(${35 + spinnerState.angle}deg)` },
      }),
    );

  const renderExperiment = (kind, ready) => {
    const isSpinner = kind === "spinner";
    const counts = isSpinner ? spinnerState.counts : marbleState.counts;
    const labels = isSpinner ? T.spinnerColors : T.marbleColors;
    const total = isSpinner ? spinnerState.spins : marbleState.draws;
    const showRows = isSpinner || machineState.machineFilled;
    return React.createElement(
      "div",
      { className: "storyboard-grid" },
      React.createElement(
        "div",
        { className: "storyboard-panel data-panel" },
        renderTable({
          counts,
          labels,
          xTitle: isSpinner ? T.ui.spinnerColor : T.ui.marbleColor,
          total,
          glow: isSpinner ? spinnerState.last : marbleState.last,
          glowKey: total,
          showRows,
        }),
      ),
      React.createElement(
        "div",
        { className: "storyboard-panel visual-panel" },
        isSpinner ? renderSpinner() : renderMachine(),
      ),
    );
  };

  const renderFormulaFraction = (event, progress) => {
    const showNumerator = progress.freq;
    const needsSum = event.parts?.length > 1;
    const sumReady = !needsSum || progress.sum;
    const totalKnown = progress.total;
    const showDecimalSlot = progress.freq && totalKnown && sumReady;
    const showPercentageSlot = progress.decimal;
    const shiftForDecimal = progress.decimal;
    const shiftForPercentage = progress.percentage;
    const receivingFreq = revealPhase === "freq";
    const receivingTotal = revealPhase === "total";
    const receivingSum = revealPhase === "sum";
    const receivingDecimal = revealPhase === "decimal";
    const receivingPercentage = revealPhase === "percentage";
    const totalIsPreset = stepData.eventKey !== "A" && isExperimentTotalKnown();
    const buildingCompound = needsSum && compoundTerms.length > 0 && !progress.freq;

    const numeratorContent = receivingFreq && !buildingCompound
      ? "\u00a0"
      : !showNumerator
        ? `f(${stepData.eventKey})`
      : buildingCompound
        ? React.createElement(
            "span",
            { className: "compound-numerator" },
            compoundTerms.map((term, index) =>
              React.createElement(
                React.Fragment,
                { key: `${term.label}-${index}` },
                index > 0 && React.createElement("span", { className: "compound-plus" }, " + "),
                React.createElement(
                  "span",
                  { className: `color-text-${term.label}` },
                  term.value,
                ),
              ),
            ),
          )
      : needsSum && !progress.sum
        ? React.createElement(
            "span",
            { className: "compound-numerator" },
            event.parts.map((value, index) =>
              React.createElement(
                React.Fragment,
                { key: `${value}-${index}` },
                index > 0 && React.createElement("span", { className: "compound-plus" }, " + "),
                React.createElement(
                  "span",
                  { className: `color-text-${event.labels[index]}` },
                  value,
                ),
              ),
            ),
            React.createElement("span", { className: "compound-equals" }, " = "),
            React.createElement("span", null, receivingSum ? "\u00a0" : "?"),
          )
        : needsSum
          ? React.createElement(
              "span",
              { className: "compound-numerator" },
              event.parts.map((value, index) =>
                React.createElement(
                  React.Fragment,
                  { key: `${value}-${index}` },
                  index > 0 && React.createElement("span", { className: "compound-plus" }, " + "),
                  React.createElement(
                    "span",
                    { className: `color-text-${event.labels[index]}` },
                    value,
                  ),
                ),
              ),
              React.createElement("span", { className: "compound-equals" }, " = "),
              React.createElement("span", null, event.numerator),
            )
          : React.createElement("span", { className: `color-text-${event.labels[0]}` }, event.numerator);

    return React.createElement(
      "div",
      { className: "event-formula-block" },
      React.createElement(
        "div",
        { className: `frac-line ${shiftForDecimal ? "frac-line--has-decimal" : ""} ${shiftForPercentage ? "frac-line--has-percentage" : ""}` },
        React.createElement(
          "span",
          { className: "frac-primary" },
          React.createElement(
            "span",
            { className: "fr-symbol" },
            React.createElement("span", { className: "frac-eq" }, "f"),
            React.createElement("sub", null, "r"),
          ),
          React.createElement(
            "span",
            { className: "frac-eq" },
            `(${stepData.eventKey}) =`,
          ),
          React.createElement(
            "span",
            { className: "frac-group" },
            React.createElement(
              "button",
              {
                type: "button",
                className: `frac-tap ftue-target ${progress.freq && sumReady ? "frac-tap--done" : "frac-tap--active"} ${receivingFreq || receivingSum ? "reveal-control--receiving" : ""}`,
                "data-freq-target": true,
                disabled: (progress.freq && sumReady) || isFlying,
                onClick: () =>
                  progress.freq && needsSum && !progress.sum
                    ? flipThenReveal("sum")
                    : needsSum
                      ? startCompoundFly(event)
                      : flyThenReveal(
                        event.labels.map((label) => `[data-freq-label="${label}"]`),
                        "[data-freq-target]",
                        [String(event.numerator)],
                        "freq",
                        [`ghost-freq ghost-freq--${event.labels[0]}`],
                      ),
              },
              numeratorContent,
            ),
            React.createElement("span", { className: "frac-bar" }),
            totalIsPreset || totalKnown
              ? React.createElement(
                  "span",
                  { className: "frac-box frac-tap--done" },
                  event.denominator,
                )
              : React.createElement(
              React.Fragment,
              null,
              !totalKnown && progress.freq && sumReady &&
                React.createElement("span", { className: "total-bridge-arrow", "aria-hidden": "true" }, "→"),
              React.createElement(
              "button",
              {
                type: "button",
                className: `frac-tap ftue-target ${totalKnown ? "frac-tap--done" : progress.freq && sumReady ? "frac-tap--active" : ""} ${receivingTotal ? "reveal-control--receiving" : ""}`,
                "data-total-target": true,
                disabled: !progress.freq || !sumReady || totalKnown || isFlying,
                onClick: () =>
                  flyThenReveal(
                    ["[data-total-value]"],
                    "[data-total-target]",
                    [String(event.denominator)],
                    "total",
                    ["ghost-total"],
                  ),
              },
              receivingTotal ? "\u00a0" : totalKnown ? event.denominator : "n",
            ),
            ),
          ),
        ),

        showDecimalSlot && React.createElement("span", { className: "frac-eq" }, "="),
        showDecimalSlot && React.createElement(
          "div",
          { className: "inline-pill-container" },
          React.createElement("span", { className: "inline-label" }, T.ui.decimal),
          React.createElement(
            "button",
            {
              type: "button",
              className: `reveal-pill ftue-target ${progress.decimal ? "reveal-pill--done" : ""} ${receivingDecimal ? "reveal-control--receiving" : ""}`,
              disabled: progress.decimal || isFlying,
              onClick: () => flipThenReveal("decimal"),
            },
            receivingDecimal ? "\u00a0" : progress.decimal ? event.decimal : "?",
          ),
          !progress.decimal &&
            React.createElement("div", { className: "shoutout-callout" }, T.ui.shoutOut),
        ),

        showPercentageSlot && React.createElement("span", { className: "frac-eq" }, "="),
        showPercentageSlot && React.createElement(
          "div",
          { className: "inline-pill-container" },
          React.createElement("span", { className: "inline-label" }, T.ui.percentage),
          React.createElement(
            "button",
            {
              type: "button",
              className: `reveal-pill ftue-target ${progress.percentage ? "reveal-pill--done" : ""} ${receivingPercentage ? "reveal-control--receiving" : ""}`,
              disabled: !progress.decimal || progress.percentage || isFlying,
              onClick: () => flipThenReveal("percentage"),
            },
            receivingPercentage ? "\u00a0" : progress.percentage ? event.percentage : "?",
          ),
          !progress.percentage &&
            React.createElement("div", { className: "shoutout-callout" }, T.ui.shoutOut),
        )
      ),
      needsSum && showNumerator && !progress.sum && !receivingSum &&
        React.createElement("div", { className: "shoutout-callout shoutout-callout--sum" }, T.ui.shoutOut),
    );
  };

  const renderRelativeEvent = () => {
    const isSpinner = stepData.experiment === "spinner";
    const event = getEvent();
    const progress = getEffectiveProgress();
    const counts = isSpinner ? T.spinnerFinal : T.marbleFinal;
    const labels = isSpinner ? T.spinnerColors : T.marbleColors;
    const showSameTotalNote =
      stepData.eventKey === "B" && isExperimentTotalKnown();
    return React.createElement(
      "div",
      { className: "storyboard-grid storyboard-grid--event" },
      React.createElement(
        "div",
        { className: "storyboard-panel data-panel" },
        renderTable({
          counts,
          labels,
          total: event.denominator,
          xTitle: isSpinner ? T.ui.spinnerColor : T.ui.marbleColor,
          highlight: event.labels,
          glow: !progress.freq ? event.labels : flyingLabel || null,
          transferLabels:
            flyingLabel
              ? [flyingLabel]
              : revealPhase === "freq"
                ? event.labels
                : revealPhase === "total"
                  ? []
                  : [],
          transferTotal: revealPhase === "total",
        }),
      ),
      React.createElement(
        "div",
        { className: "storyboard-panel equation-panel" },
        React.createElement("div", {
          className: "formula-box formula-box--hero",
          dangerouslySetInnerHTML: { __html: T.ui.formulaGeneral },
        }),
        React.createElement(
          "div",
          { className: "event-card" },
          React.createElement("p", {
            className: "event-text",
            dangerouslySetInnerHTML: { __html: event.label },
          }),
          showSameTotalNote &&
            React.createElement("p", { className: "event-note" }, T.ui.instructionEventSameTotal),
          renderFormulaFraction(event, progress),
        ),
      ),
    );
  };

  const renderBody = () => {
    if (isEnd) {
      return React.createElement(
        "div",
        { className: "lesson-end-inline" },
        React.createElement(
          "h1",
          { className: "welcome-title" },
          T.ui.endTitle,
        ),
        React.createElement("p", {
          className: "welcome-message",
          dangerouslySetInnerHTML: { __html: T.ui.endMessage },
        }),
        React.createElement("p", { className: "tap-start-text" }, T.ui.endTap),
        React.createElement(
          "button",
          {
            ref: startOverButtonRef,
            className: "start-over-button ftue-target",
            onClick: handleStartOver,
          },
          T.ui.startOverButton,
        ),
      );
    }
    if (type === "marbleDraw")
      return renderExperiment(
        "marble",
        marbleState.draws >= T.marbleSequence.length,
      );
    if (type === "marbleReady") return renderExperiment("marble", true);
    if (type === "spinnerSpin")
      return renderExperiment(
        "spinner",
        spinnerState.spins >= T.spinnerSequence.length,
      );
    if (type === "spinnerReady") return renderExperiment("spinner", true);
    if (type === "relativeEvent") return renderRelativeEvent();
    return null;
  };

  return React.createElement(
    "div",
    { className: "lesson-screen", ref },
    renderTitle(),
    React.createElement(
      "div",
      { className: "lesson-workspace fade-in" },
      renderBody(),
    ),
    AppletAnimator.GhostFlightLayer({ ghosts }),
  );
});
