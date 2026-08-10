const ActivityScreen = React.forwardRef((props, ref) => {
  const {
    stepConfig = { type: "intro", stepData: {} },
    tappedPoints = [],
    quizAnswer = null,
    quizFeedback = "",
    quizBlinkWrong = false,
    formulaFlyDone = false,
    headsRevealed = 0,
    revealTriggered = false,
    activeRevealRow = null,
    activeRevealStep = 0,
    headsExplored = 0,
    outcomesRevealed = 0,
    changesRecorded = 0,
    revealAnimating = false,
    recordAnimating = false,
    activeRecordRow = null,
    onPointTap,
    onPointClickStart,
    onQuizAnswer,
    onFormulaFlyComplete,
    onHeadsReveal,
    onWhatDoesTellUs,
    onDeduceCalloutNext,
    showWhatDoesTellUs = false,
  } = props || {};

  const stepData = stepConfig.stepData || {};
  const { type } = stepData;
  const trials = T.trialsData;

  const [activeAnimation, setActiveAnimation] = React.useState(null);
  const [formulaFlight, setFormulaFlight] = React.useState(null);
  const deduceIntroRef = React.useRef(false);
  const [deduceCalloutReady, setDeduceCalloutReady] = React.useState(false);
  const [settledCells, setSettledCells] = React.useState([]);
  const [landedTrials, setLandedTrials] = React.useState([]);
  const [landedRf, setLandedRf] = React.useState([]);
  const [colSwapAnimating, setColSwapAnimating] = React.useState(false);
  const [quizExitAnimating, setQuizExitAnimating] = React.useState(false);
  const [quizExitActive, setQuizExitActive] = React.useState(false);
  const [formulaTransformDone, setFormulaTransformDone] = React.useState(false);
  const [quizOptionsDimmed, setQuizOptionsDimmed] = React.useState(false);
  const [calloutLayout, setCalloutLayout] = React.useState({
    calloutTop: 0,
    pointerTop: "50%",
    pointerLeft: "68%",
    pointer2Left: null,
    revealColLeft: "62%",
  });

  const tableShellRef = React.useRef(null);
  const knownFormulaRef = React.useRef(null);
  const denOrigRef = React.useRef(null);
  const denFlyRef = React.useRef(null);
  const multRef = React.useRef(null);
  const fractionWrapRef = React.useRef(null);
  const fhRhsRef = React.useRef(null);
  const rhsWrapRef = React.useRef(null);
  const flySourceRef = React.useRef(null);
  const formulaTransformTlRef = React.useRef(null);
  const sideCalloutRef = React.useRef(null);
  const stackCalloutRef = React.useRef(null);
  const calloutColumnRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const pendingPointTapsRef = React.useRef(new Set());

  const rfFloats = [1.0, 0.5, 0.66, 0.5, 0.6];
  const isQuizCorrect = quizAnswer === "option2";
  const isQuizWrong = quizAnswer && quizAnswer !== "option2";
  const fSymbolHtml = window.APP_LANGUAGE === "id" ? "f(A)" : "f(H)";
  const rfSymbolHtml =
    window.APP_LANGUAGE === "id" ? "f<sub>r</sub>(A)" : "f<sub>r</sub>(H)";
  const formulaFlyTextHtml = `${rfSymbolHtml} × n`;

  const formatRf = (val) =>
    window.APP_LANGUAGE === "id" ? String(val).replace(".", ",") : val;

  const GRAPH_AXIS_X = 6;
  const GRAPH_AXIS_RIGHT = 92;
  const GRAPH_AXIS_TOP = 10;
  const GRAPH_AXIS_BOTTOM = 76;
  const GRAPH_PLOT_H = GRAPH_AXIS_BOTTOM - GRAPH_AXIS_TOP;
  const GRAPH_X_LABEL_Y = GRAPH_AXIS_BOTTOM + 6.2;
  const GRAPH_X_TITLE_Y = 88.5;
  const GRAPH_Y_TITLE_X = -12;

  const getTrialX = (trial) => {
    const plotWidth = GRAPH_AXIS_RIGHT - GRAPH_AXIS_X;
    return GRAPH_AXIS_X + (trial / 5) * plotWidth;
  };

  const getSvgCoords = (trial, rfVal) => {
    const x = getTrialX(trial);
    const y = GRAPH_AXIS_BOTTOM - rfVal * GRAPH_PLOT_H;
    return { x, y };
  };

  const GUIDE_DRAW_MS = 700;
  const VALUE_FLIGHT_MS = 900;
  const VALUE_FLIGHT_GAP_MS = 450;
  const FORMULA_FLIGHT_MS = 1100;
  const FORMULA_FLY_HOLD_MS = 600;
  const REVEAL_FLASH_MS = 500;

  const isTrialCellFilled = (trialNum) => landedTrials.includes(trialNum);

  const isRfCellFilled = (trialNum) => landedRf.includes(trialNum);

  const points = trials.map((row, idx) => ({
    trial: row.trial,
    rf: row.rf,
    floatVal: rfFloats[idx],
    ...getSvgCoords(row.trial, rfFloats[idx]),
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const MORPH_MS = 650;

  const showGraph = [
    "intro",
    "tableIntro",
    "pointsInteraction",
    "formulaQuiz",
    "calculateHeads",
  ].includes(type);
  const showTable = true;
  const morphStageMode =
    type === "intro"
      ? "intro"
      : ["tableIntro", "pointsInteraction"].includes(type)
        ? "split"
        : type === "formulaQuiz" && quizExitAnimating
          ? "split"
          : type === "deduceOutcomes" && outcomesRevealed > 0
            ? "callout"
            : ["recordChange", "summary"].includes(type)
              ? "stack"
              : ["formulaQuiz", "calculateHeads"].includes(type)
                ? "table-only"
                : "table-center";

  const graphMorphMode = ["intro", "tableIntro", "pointsInteraction"].includes(
    type,
  )
    ? "split-left"
    : type === "formulaQuiz" && quizExitAnimating
      ? quizExitActive
        ? "exit"
        : "split-left"
      : type === "calculateHeads"
        ? "center-exit"
        : "off";

  const morphGraphVisible = showGraph && graphMorphMode !== "off";
  const isStackStage = morphStageMode === "stack";
  const isCalloutStage = morphStageMode === "callout";

  const showHeadsCol = [
    "tableIntro",
    "pointsInteraction",
    "formulaQuiz",
    "calculateHeads",
    "deduceOutcomes",
    "recordChange",
    "summary",
  ].includes(type);

  const showHeadsValues = [
    "calculateHeads",
    "deduceOutcomes",
    "recordChange",
    "summary",
  ].includes(type)
    ? true
    : type === "formulaQuiz"
      ? headsRevealed > 0
      : false;
  const showOutcomeCol = ["deduceOutcomes", "recordChange", "summary"].includes(
    type,
  );
  const showChangeCol = ["recordChange", "summary"].includes(type);
  const dimLeadCols = ["recordChange", "summary"].includes(type);
  const prevColsRef = React.useRef({ change: false, outcome: false });
  const changeColEntering = showChangeCol && !prevColsRef.current.change;
  const outcomeColEntering = showOutcomeCol && !prevColsRef.current.outcome;

  React.useLayoutEffect(() => {
    prevColsRef.current = { change: showChangeCol, outcome: showOutcomeCol };
  }, [showChangeCol, showOutcomeCol]);

  React.useEffect(() => {
    if (type !== "deduceOutcomes") {
      deduceIntroRef.current = false;
      setDeduceCalloutReady(false);
    }

    if (type === "deduceOutcomes") {
      if (outcomesRevealed <= 0) {
        setDeduceCalloutReady(false);
        return;
      }

      if (!deduceIntroRef.current) {
        deduceIntroRef.current = true;
        setDeduceCalloutReady(false);
        const timer = setTimeout(() => setDeduceCalloutReady(true), 550);
        return () => clearTimeout(timer);
      }

      setDeduceCalloutReady(true);
      return;
    }

    if (calloutColumnRef.current) {
      calloutColumnRef.current.style.height = "";
      calloutColumnRef.current.style.minHeight = "";
    }

    if (stackCalloutRef.current) {
      stackCalloutRef.current.style.height = "";
      stackCalloutRef.current.style.minHeight = "";
      stackCalloutRef.current.style.top = "";
    }
  }, [type, outcomesRevealed]);

  React.useEffect(() => {
    if (type !== "formulaQuiz") {
      setQuizExitAnimating(false);
      setQuizExitActive(false);
      setColSwapAnimating(false);
      return;
    }

    setQuizExitAnimating(true);
    setQuizExitActive(false);
    setColSwapAnimating(false);

    let exitTimer;
    let swapTimer;
    let raf2;

    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setQuizExitActive(true));
    });

    exitTimer = setTimeout(() => {
      setQuizExitAnimating(false);
      setQuizExitActive(false);
      setColSwapAnimating(true);
      swapTimer = setTimeout(() => setColSwapAnimating(false), MORPH_MS);
    }, MORPH_MS);

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(exitTimer);
      clearTimeout(swapTimer);
    };
  }, [type]);

  React.useEffect(() => {
    if (type !== "formulaQuiz") {
      setFormulaTransformDone(false);
      setQuizOptionsDimmed(false);
      if (formulaTransformTlRef.current) {
        formulaTransformTlRef.current.kill();
        formulaTransformTlRef.current = null;
      }
    }
  }, [type]);

  const runFormulaTransform = React.useCallback(() => {
    if (formulaTransformDone) return;

    const gsap = window.gsap;
    if (!gsap) {
      setFormulaTransformDone(true);
      return;
    }

    const denOrig = denOrigRef.current;
    const denFly = denFlyRef.current;
    const mult = multRef.current;
    const fraction = fractionWrapRef.current;
    const fh = fhRhsRef.current;
    const flySource = flySourceRef.current;

    if (!denOrig || !denFly || !mult || !fraction || !fh) {
      setFormulaTransformDone(true);
      return;
    }

    if (formulaTransformTlRef.current) {
      formulaTransformTlRef.current.kill();
    }

    const N_FLY_DUR = 0.62;
    const RHS_FADE_OUT = 0.4;
    const RHS_FADE_IN = 0.45;

    gsap.set(mult, { opacity: 0 });
    gsap.set(denFly, { opacity: 0 });
    gsap.set(fh, { opacity: 0 });
    if (flySource) gsap.set(flySource, { opacity: 0 });
    gsap.set(denOrig, { x: 0, y: 0, opacity: 1, scale: 1 });
    gsap.set(fraction, { opacity: 1, scale: 1 });

    const origRect = denOrig.getBoundingClientRect();
    const flyRect = denFly.getBoundingClientRect();
    const dx = flyRect.left - origRect.left;
    const dy = flyRect.top - origRect.top;

    const snapLeftSide = () => {
      gsap.set(denOrig, {
        opacity: 0,
        x: 0,
        y: 0,
        scale: 1,
        clearProps: "transform",
      });
      gsap.set(mult, { opacity: 1 });
      gsap.set(denFly, { opacity: 1 });
    };

    const tl = gsap.timeline({
      onComplete: () => {
        snapLeftSide();
        gsap.set(fraction, { opacity: 0, scale: 1, clearProps: "transform" });
        gsap.set(fh, { opacity: 1, clearProps: "transform" });
        setFormulaTransformDone(true);
        formulaTransformTlRef.current = null;
      },
    });

    formulaTransformTlRef.current = tl;

    // Right: subtle crossfade while n travels
    tl.to(
      fraction,
      { opacity: 0, scale: 0.97, duration: RHS_FADE_OUT, ease: "power2.inOut" },
      0.06,
    );
    tl.to(
      fh,
      { opacity: 1, duration: RHS_FADE_IN, ease: "power2.inOut" },
      0.12,
    );

    // n flies from denominator to its final left position
    tl.to(
      denOrig,
      { x: dx, y: dy, duration: N_FLY_DUR, ease: "power3.out" },
      0,
    );

    // Snap left side the moment n lands — × and n appear together
    tl.add(snapLeftSide, N_FLY_DUR);
  }, [formulaTransformDone]);

  React.useEffect(() => {
    if (
      type !== "formulaQuiz" ||
      quizAnswer !== "option2" ||
      formulaTransformDone
    )
      return;

    const dimTimer = setTimeout(() => setQuizOptionsDimmed(true), 600);
    const transformTimer = setTimeout(() => runFormulaTransform(), 750);

    return () => {
      clearTimeout(dimTimer);
      clearTimeout(transformTimer);
    };
  }, [type, quizAnswer, formulaTransformDone, runFormulaTransform]);

  React.useEffect(() => {
    if (type !== "formulaQuiz" || !revealTriggered || activeRevealRow === null)
      return;

    const trial = activeRevealRow + 1;
    let cellEl = null;

    if (activeRevealStep === 1) {
      cellEl = document.getElementById(`trial-cell-${trial}`);
    } else if (activeRevealStep === 3) {
      cellEl = document.getElementById(`rf-cell-${trial}`);
    } else if (activeRevealStep === 5) {
      cellEl = document.getElementById(`heads-cell-${trial}`);
    }

    if (!cellEl) return;

    cellEl.classList.remove("cell-reveal-flash");
    void cellEl.offsetWidth;

    const startTimer = requestAnimationFrame(() => {
      cellEl.classList.add("cell-reveal-flash");
    });

    const endTimer = setTimeout(() => {
      cellEl.classList.remove("cell-reveal-flash");
    }, REVEAL_FLASH_MS);

    return () => {
      cancelAnimationFrame(startTimer);
      clearTimeout(endTimer);
      cellEl.classList.remove("cell-reveal-flash");
    };
  }, [type, revealTriggered, activeRevealRow, activeRevealStep]);

  React.useEffect(() => {
    if (type !== "recordChange" || activeRecordRow === null) return;

    const flashCells = [];
    const activeCell = document.getElementById(`heads-cell-${activeRecordRow + 1}`);
    if (activeCell) flashCells.push(activeCell);

    if (activeRecordRow > 0) {
      const prevCell = document.getElementById(`heads-cell-${activeRecordRow}`);
      if (prevCell) flashCells.push(prevCell);
    }

    const timers = [];
    flashCells.forEach((cellEl) => {
      cellEl.classList.remove("cell-reveal-flash");
      void cellEl.offsetWidth;
      const startTimer = requestAnimationFrame(() => {
        cellEl.classList.add("cell-reveal-flash");
      });
      const endTimer = setTimeout(() => {
        cellEl.classList.remove("cell-reveal-flash");
      }, REVEAL_FLASH_MS);
      timers.push(startTimer, endTimer);
    });

    return () => {
      timers.forEach((id) => {
        if (typeof id === "number") cancelAnimationFrame(id);
        else clearTimeout(id);
      });
      flashCells.forEach((cellEl) => {
        cellEl.classList.remove("cell-reveal-flash");
      });
    };
  }, [type, activeRecordRow]);

  const usePreSwapColumnOrder =
    ["tableIntro", "pointsInteraction"].includes(type) ||
    (type === "formulaQuiz" && (quizExitAnimating || colSwapAnimating));
  const showPromptBanner = ![
    "deduceOutcomes",
    "recordChange",
    "summary",
  ].includes(type);

  const showRevealOverlay =
    type === "formulaQuiz" &&
    isQuizCorrect &&
    formulaFlyDone &&
    !revealTriggered &&
    headsRevealed < 5 &&
    !revealAnimating;

  const getOutcomeLabel = (row) =>
    window.APP_LANGUAGE === "id" ? row.outcomeId : row.outcome;

  const isHeadsOutcome = (row) => {
    const label = getOutcomeLabel(row);
    return label === "H" || label === "A";
  };

  const isFreqUnchanged = (idx) =>
    idx > 0 && trials[idx].heads === trials[idx - 1].heads;

  const getHeadsCellClasses = (row, idx) => {
    const classes = ["heads-cell", "col-heads"];

    if (type === "formulaQuiz") {
      if (isQuizCorrect) classes.push("heads-cell--quiz-col");
      if (revealTriggered) {
        if (idx < headsRevealed) classes.push("heads-cell--quiz-revealed");
        if (activeRevealRow === idx) classes.push("heads-cell--reveal-active");
      } else {
        if (idx < headsRevealed) classes.push("heads-cell--quiz-revealed");
        else classes.push("heads-cell--quiz-pending");
      }
      if (isQuizWrong) classes.push("heads-cell--quiz-wrong");
      return classes;
    }

    if (type === "calculateHeads") {
      if (idx < headsExplored) classes.push("heads-cell--calc-explored");
      if (headsExplored > 0 && idx === headsExplored - 1)
        classes.push("heads-cell--calc-active");
      return classes;
    }

    if (type === "deduceOutcomes" && idx < outcomesRevealed) {
      const activeIdx = outcomesRevealed - 1;
      if (idx === activeIdx) {
        classes.push(
          isFreqUnchanged(idx)
            ? "heads-cell--deduce-same-freq"
            : "heads-cell--deduce-active",
        );
      } else if (idx === activeIdx - 1 && activeIdx > 0) {
        if (
          isHeadsOutcome(trials[activeIdx]) &&
          trials[activeIdx].heads > row.heads
        ) {
          classes.push("heads-cell--deduce-prev");
        } else if (isFreqUnchanged(activeIdx)) {
          classes.push("heads-cell--deduce-prev");
        }
      }
      return classes;
    }

    if (type === "recordChange" || type === "summary") {
      if (type === "summary") {
        classes.push("heads-cell--summary-col");
        return classes;
      }
      const activeIdx =
        activeRecordRow !== null && activeRecordRow !== undefined
          ? activeRecordRow
          : changesRecorded > 0
            ? changesRecorded - 1
            : -1;
      if (activeIdx >= 0) {
        if (idx === activeIdx) {
          classes.push("heads-cell--record-active");
        } else if (idx === activeIdx - 1 && activeIdx > 0) {
          if (
            isHeadsOutcome(trials[activeIdx]) &&
            trials[activeIdx].heads > row.heads
          ) {
            classes.push("heads-cell--record-prev");
          } else if (isFreqUnchanged(activeIdx)) {
            classes.push("heads-cell--record-prev");
          }
        }
      }
      return classes;
    }

    return classes;
  };

  const getOutcomeCellClasses = (row, idx) => {
    const classes = ["outcome-cell"];
    if (idx >= outcomesRevealed) return classes;

    if (type === "deduceOutcomes") {
      const activeIdx = outcomesRevealed - 1;
      if (idx !== activeIdx) return classes;
      if (isHeadsOutcome(row)) {
        classes.push("outcome-cell--deduce-h");
      } else {
        classes.push("outcome-cell--deduce-noth");
        if (isFreqUnchanged(idx))
          classes.push("outcome-cell--deduce-same-freq");
      }
    } else if (type === "summary") {
      classes.push(
        isHeadsOutcome(row)
          ? "outcome-cell--summary-h"
          : "outcome-cell--summary-noth",
      );
    }

    return classes;
  };

  const getChangeCellClasses = (row, idx) => {
    const classes = ["change-cell"];
    if (type === "recordChange") {
      if (idx < changesRecorded) {
        classes.push(
          row.change !== "0" ? "change-cell--pos" : "change-cell--zero",
        );
        if (idx === changesRecorded - 1) {
          classes.push("change-cell--recording-active");
        }
      } else {
        classes.push("change-cell--col-focus");
      }
    } else if (type === "summary") {
      classes.push(
        isHeadsOutcome(row)
          ? "change-cell--summary-h"
          : "change-cell--summary-noth",
      );
      classes.push(
        row.change !== "0" ? "change-cell--pos" : "change-cell--zero",
      );
    }
    return classes;
  };

  const handlePointClick = (trialNum, idx, e) => {
    if (
      type !== "pointsInteraction" ||
      tappedPoints.includes(trialNum) ||
      activeAnimation ||
      pendingPointTapsRef.current.has(trialNum)
    ) {
      return;
    }

    pendingPointTapsRef.current.add(trialNum);
    if (onPointClickStart) onPointClickStart();

    const trialCell = document.getElementById(`trial-cell-${trialNum}`);
    const rfCell = document.getElementById(`rf-cell-${trialNum}`);
    if (!trialCell || !rfCell) {
      pendingPointTapsRef.current.delete(trialNum);
      return;
    }

    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const point = points[idx];
    const svgEl = e.currentTarget.ownerSVGElement;

    const rectTrial = trialCell.getBoundingClientRect();
    const rectRf = rfCell.getBoundingClientRect();
    const endX_Trial = rectTrial.left + rectTrial.width / 2 + scrollX;
    const endY_Trial = rectTrial.top + rectTrial.height / 2 + scrollY;
    const endX_Rf = rectRf.left + rectRf.width / 2 + scrollX;
    const endY_Rf = rectRf.top + rectRf.height / 2 + scrollY;

    let startX_Trial = 0;
    let startY_Trial = 0;
    let startX_Rf = 0;
    let startY_Rf = 0;

    if (svgEl && svgEl.createSVGPoint) {
      const svgPt = svgEl.createSVGPoint();
      const ctm = svgEl.getScreenCTM();
      if (ctm) {
        svgPt.x = point.x;
        svgPt.y = GRAPH_X_LABEL_Y;
        const screenPtX = svgPt.matrixTransform(ctm);
        startX_Trial = screenPtX.x + scrollX;
        startY_Trial = screenPtX.y + scrollY;

        svgPt.x = GRAPH_AXIS_X;
        svgPt.y = point.y;
        const screenPtY = svgPt.matrixTransform(ctm);
        startX_Rf = screenPtY.x + scrollX;
        startY_Rf = screenPtY.y + scrollY;
      }
    }

    if (!startX_Trial) {
      const rectTarget = e.currentTarget.getBoundingClientRect();
      startX_Trial = rectTarget.left + rectTarget.width / 2 + scrollX;
      startY_Trial = rectTarget.top + rectTarget.height / 2 + scrollY;
      startX_Rf = startX_Trial;
      startY_Rf = startY_Trial;
    }

    setActiveAnimation({
      trial: trialNum,
      idx,
      showLines: true,
      linesDrawComplete: false,
      pointFilled: false,
      flightTrial: null,
      flightRf: null,
    });

    const trialFlightStart = GUIDE_DRAW_MS;
    const rfFlightStart =
      trialFlightStart + VALUE_FLIGHT_MS + VALUE_FLIGHT_GAP_MS;
    const trialLandAt = trialFlightStart + VALUE_FLIGHT_MS;
    const rfLandAt = rfFlightStart + VALUE_FLIGHT_MS;

    setTimeout(() => {
      setActiveAnimation((prev) =>
        prev
          ? {
              ...prev,
              linesDrawComplete: true,
              pointFilled: true,
              flightTrial: {
                text: String(trialNum),
                startX: startX_Trial,
                startY: startY_Trial,
                endX: endX_Trial,
                endY: endY_Trial,
              },
            }
          : null,
      );
    }, trialFlightStart);

    setTimeout(() => {
      setLandedTrials((prev) => [...prev, trialNum]);
      setActiveAnimation((prev) =>
        prev ? { ...prev, flightTrial: null } : null,
      );
    }, trialLandAt);

    setTimeout(() => {
      setActiveAnimation((prev) =>
        prev
          ? {
              ...prev,
              flightRf: {
                text: formatRf(trials[idx].rf),
                startX: startX_Rf,
                startY: startY_Rf,
                endX: endX_Rf,
                endY: endY_Rf,
              },
            }
          : null,
      );
    }, rfFlightStart);

    setTimeout(() => {
      setLandedRf((prev) => [...prev, trialNum]);
      setActiveAnimation(null);
      pendingPointTapsRef.current.delete(trialNum);
      onPointTap(trialNum);
      setSettledCells((prev) => [...prev, trialNum]);
      setTimeout(() => {
        setSettledCells((prev) => prev.filter((t) => t !== trialNum));
      }, 400);
    }, rfLandAt);
  };

  React.useEffect(() => {
    if (
      type !== "formulaQuiz" ||
      quizAnswer !== "option2" ||
      !formulaTransformDone ||
      formulaFlyDone
    )
      return;

    let flightTimer;

    const holdTimer = setTimeout(() => {
      const formulaSource =
        flySourceRef.current || document.querySelector(".formula-fly-source");
      const headsHeader = document.querySelector(".heads-col-header");
      if (!formulaSource || !headsHeader) {
        onFormulaFlyComplete();
        return;
      }

      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const source = formulaSource.getBoundingClientRect();
      const target = headsHeader.getBoundingClientRect();

      setFormulaFlight({
        text: formulaFlyTextHtml,
        isHtml: true,
        startX: source.left + source.width / 2 + scrollX,
        startY: source.top + source.height / 2 + scrollY,
        endX: target.left + target.width / 2 + scrollX,
        endY: target.top + target.height / 2 + scrollY,
      });

      flightTimer = setTimeout(() => {
        setFormulaFlight(null);
        onFormulaFlyComplete();
      }, FORMULA_FLIGHT_MS);
    }, FORMULA_FLY_HOLD_MS);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(flightTimer);
    };
  }, [
    type,
    quizAnswer,
    formulaTransformDone,
    formulaFlyDone,
    formulaFlyTextHtml,
  ]);

  const getSideCalloutHtml = () => {
    if (type === "deduceOutcomes" && outcomesRevealed > 0) {
      return T.ui[`trial${outcomesRevealed}OutcomeMsg`] || "";
    }
    return "";
  };

  const getBottomCalloutHtml = () => {
    if (type === "recordChange") {
      return changesRecorded === 0 && !recordAnimating
        ? T.ui.changeIntroMsg
        : T.ui.changeIntroMsgRecording;
    }
    return "";
  };

  const updateCalloutLayout = React.useCallback(() => {
    const stage = stageRef.current;
    const shell = tableShellRef.current;
    const callout = sideCalloutRef.current;
    const calloutColumn = calloutColumnRef.current;
    if (!stage || !shell) return;

    const stageRect = stage.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();

    if (
      type === "formulaQuiz" &&
      isQuizCorrect &&
      formulaFlyDone &&
      !revealTriggered
    ) {
      const headsHeader = shell.querySelector(".heads-col-header");
      const headsCells = shell.querySelectorAll(
        "tbody td.heads-cell--quiz-pending",
      );
      if (headsHeader && headsCells.length) {
        const headerRect = headsHeader.getBoundingClientRect();
        const lastCell = headsCells[headsCells.length - 1];
        const lastRect = lastCell.getBoundingClientRect();
        const overlayTop = headerRect.top - shellRect.top;
        const overlayLeft = headerRect.left - shellRect.left;
        const overlayWidth = headerRect.width;
        const overlayHeight = lastRect.bottom - headerRect.top;
        const overlay = shell.querySelector(".reveal-overlay");
        if (overlay) {
          overlay.style.top = `${overlayTop}px`;
          overlay.style.left = `${overlayLeft}px`;
          overlay.style.width = `${overlayWidth}px`;
          overlay.style.height = `${overlayHeight}px`;
        }
      }
      return;
    }

    if (type === "formulaQuiz" && isQuizCorrect && headsRevealed < 5) {
      const headsHeader = shell.querySelector(".heads-col-header");
      if (headsHeader) {
        const headerRect = headsHeader.getBoundingClientRect();
        const left =
          ((headerRect.left + headerRect.width / 2 - shellRect.left) /
            shellRect.width) *
          100;
        setCalloutLayout((prev) => ({
          ...prev,
          revealColLeft: `${Math.min(92, Math.max(8, left))}%`,
        }));
      }
      return;
    }

    if (type === "deduceOutcomes" && outcomesRevealed > 0) {
      const rowIdx = outcomesRevealed - 1;
      const rowEl = document.getElementById(`table-row-${rowIdx}`);
      if (!rowEl || !calloutColumn) return;

      const tableHeight = shell.offsetHeight;
      if (tableHeight > 0) {
        calloutColumn.style.height = `${tableHeight}px`;
        calloutColumn.style.minHeight = `${tableHeight}px`;
      }

      const columnRect = calloutColumn.getBoundingClientRect();
      const trialNum = outcomesRevealed;
      const outcomeCell =
        document.getElementById(`outcome-cell-${trialNum}`) ||
        rowEl.querySelector(".outcome-cell");

      let targetY =
        rowEl.getBoundingClientRect().top +
        rowEl.getBoundingClientRect().height / 2;
      if (outcomeCell) {
        const outcomeRect = outcomeCell.getBoundingClientRect();
        targetY = outcomeRect.top + outcomeRect.height / 2;
      }

      const calloutRect = callout
        ? callout.getBoundingClientRect()
        : columnRect;
      const calloutHeight = calloutRect.height || callout?.offsetHeight || 1;
      const pointerPx = targetY - calloutRect.top;
      const pointerPercent = Math.min(
        95,
        Math.max(5, (pointerPx / calloutHeight) * 100),
      );
      const pointerTop = `${pointerPercent}%`;

      setCalloutLayout({
        calloutTop: 0,
        pointerTop,
        pointerLeft: null,
        pointer2Left: null,
        revealColLeft: "62%",
      });
      return;
    }

    if (type === "recordChange") {
      const callout = stackCalloutRef.current;
      const targetCell = shell.querySelector(".change-col-header");
      if (!targetCell || !callout) return;
      const calloutRect = callout.getBoundingClientRect();
      const cellRect = targetCell.getBoundingClientRect();
      const pointerLeft =
        ((cellRect.left + cellRect.width / 2 - calloutRect.left) /
          calloutRect.width) *
        100;
      setCalloutLayout({
        calloutTop: 0,
        pointerTop: null,
        pointerLeft: `${Math.min(92, Math.max(8, pointerLeft))}%`,
        pointer2Left: null,
        revealColLeft: "62%",
      });
      return;
    }

    if (type === "summary") {
      const callout = stackCalloutRef.current;
      const changeHeader = shell.querySelector(".change-col-header");
      const outcomeHeader = shell.querySelector(".outcome-col-header");
      if (!callout || !changeHeader || !outcomeHeader) return;

      const calloutRect = callout.getBoundingClientRect();
      const changeRect = changeHeader.getBoundingClientRect();
      const outcomeRect = outcomeHeader.getBoundingClientRect();
      const pointerLeft =
        ((changeRect.left + changeRect.width / 2 - calloutRect.left) /
          calloutRect.width) *
        100;
      const pointer2Left =
        ((outcomeRect.left + outcomeRect.width / 2 - calloutRect.left) /
          calloutRect.width) *
        100;

      setCalloutLayout({
        calloutTop: 0,
        pointerTop: null,
        pointerLeft: `${Math.min(92, Math.max(8, pointerLeft))}%`,
        pointer2Left: `${Math.min(92, Math.max(8, pointer2Left))}%`,
        revealColLeft: "62%",
      });
    }
  }, [
    type,
    outcomesRevealed,
    changesRecorded,
    isQuizCorrect,
    headsRevealed,
    formulaFlyDone,
    revealTriggered,
    recordAnimating,
    activeRecordRow,
  ]);

  React.useLayoutEffect(() => {
    if (type !== "recordChange" && type !== "summary") return;

    const el = stackCalloutRef.current;
    if (!el) return;

    el.style.height = "";
    el.style.minHeight = "";
    el.style.top = "";
    updateCalloutLayout();
  }, [type, morphStageMode, changesRecorded, updateCalloutLayout]);

  React.useLayoutEffect(() => {
    updateCalloutLayout();
    const t1 = window.setTimeout(updateCalloutLayout, 50);
    const t2 = window.setTimeout(updateCalloutLayout, 350);
    const t3 = window.setTimeout(updateCalloutLayout, 600);
    window.addEventListener("resize", updateCalloutLayout);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("resize", updateCalloutLayout);
    };
  }, [
    updateCalloutLayout,
    type,
    headsRevealed,
    headsExplored,
    revealAnimating,
    recordAnimating,
    activeRecordRow,
    outcomesRevealed,
    changesRecorded,
  ]);

  React.useEffect(() => {
    pendingPointTapsRef.current.clear();
    setLandedTrials([]);
    setLandedRf([]);
  }, [type]);

  const renderGraph = () =>
    React.createElement(
      "div",
      {
        className: [
          "panel graph-panel graph-panel--morph",
          type === "intro"
            ? "graph-panel--border-yellow"
            : "graph-panel--border-grey",
        ].join(" "),
      },
      React.createElement(
        "div",
        { className: "graph-wrapper" },
        React.createElement(
          "svg",
          {
            className: "graph-svg",
            viewBox: "0 0 100 92",
            preserveAspectRatio: "xMidYMid meet",
          },
          Array.from({ length: 10 }, (_, i) => (i + 1) * 0.1).map((val) => {
            const y = GRAPH_AXIS_BOTTOM - val * GRAPH_PLOT_H;
            return React.createElement("line", {
              key: val,
              className: "grid-line",
              x1: GRAPH_AXIS_X,
              y1: y,
              x2: GRAPH_AXIS_RIGHT,
              y2: y,
            });
          }),
          [1, 2, 3, 4, 5].map((t) => {
            const x = getTrialX(t);
            return React.createElement("line", {
              key: t,
              className: "grid-line",
              x1: x,
              y1: GRAPH_AXIS_TOP,
              x2: x,
              y2: GRAPH_AXIS_BOTTOM,
            });
          }),
          React.createElement("line", {
            className: "axis-line",
            x1: GRAPH_AXIS_X,
            y1: GRAPH_AXIS_BOTTOM,
            x2: GRAPH_AXIS_RIGHT + 2,
            y2: GRAPH_AXIS_BOTTOM,
          }),
          React.createElement("line", {
            className: "axis-line",
            x1: GRAPH_AXIS_X,
            y1: GRAPH_AXIS_TOP - 2,
            x2: GRAPH_AXIS_X,
            y2: GRAPH_AXIS_BOTTOM + 2,
          }),
          [0, 0.2, 0.4, 0.6, 0.8, 1].map((val) => {
            const y = GRAPH_AXIS_BOTTOM - val * GRAPH_PLOT_H;
            return React.createElement(
              "g",
              { key: val },
              React.createElement("line", {
                className: "axis-tick",
                x1: GRAPH_AXIS_X - 2,
                y1: y,
                x2: GRAPH_AXIS_X,
                y2: y,
              }),
              React.createElement(
                "text",
                {
                  className: "axis-label y-axis-label",
                  x: GRAPH_AXIS_X - 3,
                  y,
                  fontSize: 3.5,
                  textAnchor: "end",
                },
                val.toFixed(1),
              ),
            );
          }),
          [1, 2, 3, 4, 5].map((t) => {
            const x = getTrialX(t);
            return React.createElement(
              "g",
              { key: t },
              React.createElement("line", {
                className: "axis-tick",
                x1: x,
                y1: GRAPH_AXIS_BOTTOM,
                x2: x,
                y2: GRAPH_AXIS_BOTTOM + 2,
              }),
              React.createElement(
                "text",
                {
                  className: "axis-label x-axis-label",
                  x,
                  y: GRAPH_X_LABEL_Y,
                  fontSize: 3.5,
                  textAnchor: "middle",
                },
                t,
              ),
            );
          }),
          React.createElement(
            "text",
            {
              className: "axis-title-text x-axis-title",
              x: (GRAPH_AXIS_X + GRAPH_AXIS_RIGHT) / 2,
              y: GRAPH_X_TITLE_Y,
              fontSize: 6,
              textAnchor: "middle",
            },
            T.ui.trialLabel,
          ),
          React.createElement(
            "text",
            {
              className: "axis-title-text y-axis-title",
              transform: `rotate(-90 ${GRAPH_Y_TITLE_X} ${GRAPH_AXIS_TOP + GRAPH_PLOT_H / 2})`,
              x: GRAPH_Y_TITLE_X,
              y: GRAPH_AXIS_TOP + GRAPH_PLOT_H / 2,
              fontSize: 6,
              textAnchor: "middle",
            },
            T.ui.rfLabel,
          ),
          React.createElement("polyline", {
            className: "graph-polyline",
            points: polylinePoints,
          }),
          points.map((p, idx) => {
            const isTapped = tappedPoints.includes(p.trial);
            const isAnimatingThis =
              activeAnimation &&
              activeAnimation.trial === p.trial &&
              activeAnimation.showLines;
            const isDrawing =
              isAnimatingThis && !activeAnimation.linesDrawComplete;
            const isPendingTap = pendingPointTapsRef.current.has(p.trial);
            const isClickable =
              type === "pointsInteraction" &&
              !isTapped &&
              !isPendingTap &&
              !activeAnimation;
            const showYellowGlow =
              type === "pointsInteraction" && !isTapped && !isPendingTap;
            return React.createElement(
              "g",
              { key: p.trial },
              isTapped &&
                React.createElement(
                  React.Fragment,
                  null,
                  React.createElement("line", {
                    className: "guide-line-dotted",
                    x1: p.x,
                    y1: p.y,
                    x2: GRAPH_AXIS_X,
                    y2: p.y,
                  }),
                  React.createElement("line", {
                    className: "guide-line-dotted",
                    x1: p.x,
                    y1: p.y,
                    x2: p.x,
                    y2: GRAPH_AXIS_BOTTOM,
                  }),
                ),
              isAnimatingThis &&
                React.createElement(
                  React.Fragment,
                  null,
                  React.createElement("line", {
                    className: isDrawing
                      ? "guide-line-draw"
                      : "guide-line-dotted",
                    pathLength: isDrawing ? 100 : undefined,
                    x1: p.x,
                    y1: p.y,
                    x2: GRAPH_AXIS_X,
                    y2: p.y,
                  }),
                  React.createElement("line", {
                    className: isDrawing
                      ? "guide-line-draw"
                      : "guide-line-dotted",
                    pathLength: isDrawing ? 100 : undefined,
                    x1: p.x,
                    y1: p.y,
                    x2: p.x,
                    y2: GRAPH_AXIS_BOTTOM,
                  }),
                ),
              showYellowGlow &&
                React.createElement("circle", {
                  className: "graph-point-glow",
                  cx: p.x,
                  cy: p.y,
                  r: "5",
                }),
              React.createElement("circle", {
                className: `graph-point-target ${isClickable ? "ftue-target" : ""} ${isTapped || isAnimatingThis ? "point-disabled" : ""}`,
                cx: p.x,
                cy: p.y,
                r: isClickable ? "3.2" : "2.4",
                onClick: (e) => handlePointClick(p.trial, idx, e),
                style: { cursor: isClickable ? "pointer" : "default" },
              }),
              React.createElement("circle", {
                className: `graph-point-inner ${isTapped || (isAnimatingThis && activeAnimation.pointFilled) ? "point-filled" : ""}`,
                cx: p.x,
                cy: p.y,
                r: "1.8",
                pointerEvents: "none",
              }),
            );
          }),
        ),
      ),
    );

  const renderTrialCell = (row, idx) => {
    if (type === "tableIntro") return "";
    if (type === "pointsInteraction") {
      return isTrialCellFilled(row.trial) ? row.trial : "";
    }
    return row.trial;
  };

  const renderRfCell = (row, idx) => {
    const justSettled = settledCells.includes(row.trial);
    if (type === "tableIntro") return "";
    if (type === "pointsInteraction") {
      return isRfCellFilled(row.trial)
        ? React.createElement(
            "span",
            { className: justSettled ? "cell-flying-settled" : "" },
            formatRf(row.rf),
          )
        : "";
    }
    if (type === "calculateHeads" && idx < headsExplored) {
      return React.createElement(
        "span",
        { className: "heads-calc-part" },
        React.createElement("span", { className: "calc-op" }, "×"),
        React.createElement("span", null, row.rf),
      );
    }
    if (type === "formulaQuiz" && revealTriggered) {
      return React.createElement(
        "span",
        { className: "rf-value-part" },
        formatRf(row.rf),
      );
    }
    if (showHeadsValues || type === "formulaQuiz") return formatRf(row.rf);
    return isRfCellFilled(row.trial) ? formatRf(row.rf) : "";
  };

  const renderHeadsCell = (row, idx) => {
    if (!showHeadsCol) return "";

    if (type === "formulaQuiz") {
      if (revealTriggered) {
        const valueClass =
          idx < headsRevealed
            ? "heads-value"
            : activeRevealRow === idx
              ? "heads-value heads-value--active-reveal"
              : "heads-value heads-value--pre-reveal";
        return React.createElement(
          "span",
          { className: valueClass },
          row.heads,
        );
      }
      if (idx < headsRevealed) {
        return React.createElement(
          "span",
          { className: "heads-value" },
          row.heads,
        );
      }
      return React.createElement(
        "span",
        {
          className: `heads-quiz-qmark ${isQuizWrong ? "heads-quiz-qmark--wrong" : ""}`,
        },
        "?",
      );
    }

    if (!showHeadsValues) return "";

    if (type === "calculateHeads") {
      if (idx < headsExplored) {
        return React.createElement(
          "span",
          { className: "heads-calc-part calc-result" },
          row.heads,
        );
      }
      return row.heads;
    }

    return row.heads;
  };

  const renderOutcomeCell = (row, idx) => {
    if (!showOutcomeCol) return "";
    if (idx < outcomesRevealed) {
      const label = getOutcomeLabel(row);
      return label;
    }
    return "";
  };

  const renderChangeCell = (row, idx) => {
    if (!showChangeCol) return "";
    if (idx < changesRecorded) return row.change;
    return "";
  };

  const renderTable = () => {
    const highlightHeadsCol =
      type === "calculateHeads" || (type === "formulaQuiz" && isQuizCorrect);
    const highlightChangeCol = type === "recordChange";
    const cols3Class = usePreSwapColumnOrder
      ? "data-table--cols-3"
      : "data-table--cols-3-swapped";
    const tableClass = [
      "data-table",
      `data-table--step-${type}`,
      dimLeadCols ? "data-table--dim-lead" : "",
      type === "summary" ? "data-table--summary" : "",
      showOutcomeCol || showChangeCol
        ? usePreSwapColumnOrder
          ? "data-table--cols-5"
          : "data-table--cols-5-swapped"
        : showHeadsCol
          ? cols3Class
          : "data-table--cols-2",
      colSwapAnimating ? "data-table--col-swap-anim" : "",
      outcomeColEntering ? "data-table--outcome-col-intro" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const renderTrialsTh = () =>
      React.createElement(
        "th",
        {
          className: [dimLeadCols ? "col-dim" : "", "col-trials"]
            .filter(Boolean)
            .join(" "),
        },
        T.ui.colTrials,
      );

    const renderHeadsTh = () =>
      React.createElement(
        "th",
        {
          className: `heads-col-header col-heads ${highlightHeadsCol ? "heads-col-header--focus" : ""}`,
        },
        React.createElement("span", {
          dangerouslySetInnerHTML: { __html: T.ui.colHeads },
        }),
        (showHeadsValues ||
          (type === "formulaQuiz" && isQuizCorrect && formulaFlyDone)) &&
          React.createElement("span", {
            className: "col-sub",
            dangerouslySetInnerHTML: { __html: T.ui.colHeadsSub },
          }),
      );

    const renderRfTh = () =>
      React.createElement(
        "th",
        {
          className: [dimLeadCols ? "col-dim" : "", "col-rf"]
            .filter(Boolean)
            .join(" "),
        },
        React.createElement("span", {
          dangerouslySetInnerHTML: { __html: T.ui.colRf },
        }),
      );

    const renderChangeTh = () =>
      showChangeCol
        ? React.createElement(
            "th",
            {
              className: [
                "change-col-header",
                changeColEntering ? "table-col-morph--enter" : "",
                highlightChangeCol ? "change-col-header--focus" : "",
                type === "summary" ? "change-col-header--summary" : "",
              ]
                .filter(Boolean)
                .join(" "),
            },
            React.createElement("span", {
              dangerouslySetInnerHTML: { __html: T.ui.colChange },
            }),
          )
        : null;

    const renderOutcomeTh = () =>
      showOutcomeCol
        ? React.createElement(
            "th",
            {
              className: [
                "outcome-col-header",
                outcomeColEntering ? "table-col-morph--enter" : "",
                type === "summary" ? "outcome-col-header--summary" : "",
              ]
                .filter(Boolean)
                .join(" "),
            },
            T.ui.colOutcome,
          )
        : null;

    const headMiddleCols = usePreSwapColumnOrder
      ? [renderHeadsTh(), renderRfTh()]
      : [renderRfTh(), renderHeadsTh()];

    const renderTrialsTd = (row, idx) =>
      React.createElement(
        "td",
        {
          id: `trial-cell-${row.trial}`,
          className: ["col-trials", dimLeadCols ? "col-dim" : ""]
            .filter(Boolean)
            .join(" "),
        },
        renderTrialCell(row, idx),
      );

    const renderHeadsTd = (row, idx) =>
      React.createElement(
        "td",
        {
          id: `heads-cell-${row.trial}`,
          className: getHeadsCellClasses(row, idx).join(" "),
        },
        renderHeadsCell(row, idx),
      );

    const renderRfTd = (row, idx) =>
      React.createElement(
        "td",
        {
          id: `rf-cell-${row.trial}`,
          className: [
            "col-rf",
            dimLeadCols ? "col-dim" : "",
            isRfCellFilled(row.trial) ? "cell-filled" : "",
          ]
            .filter(Boolean)
            .join(" "),
        },
        renderRfCell(row, idx),
      );

    const renderChangeTd = (row, idx) =>
      showChangeCol
        ? React.createElement(
            "td",
            {
              className: [
                changeColEntering ? "table-col-morph--enter" : "",
                ...getChangeCellClasses(row, idx),
              ]
                .filter(Boolean)
                .join(" "),
            },
            renderChangeCell(row, idx),
          )
        : null;

    const renderOutcomeTd = (row, idx) =>
      showOutcomeCol
        ? React.createElement(
            "td",
            {
              id: `outcome-cell-${row.trial}`,
              className: [
                outcomeColEntering ? "table-col-morph--enter" : "",
                ...getOutcomeCellClasses(row, idx),
              ]
                .filter(Boolean)
                .join(" "),
            },
            renderOutcomeCell(row, idx),
          )
        : null;

    const isStackLayout = morphStageMode === "stack";

    return React.createElement(
      "div",
      {
        className: [
          "data-table-wrap",
          "data-table-wrap--morph",
          isStackLayout ? "data-table-wrap--stack-top" : "",
          outcomeColEntering ? "data-table-wrap--outcome-intro" : "",
        ]
          .filter(Boolean)
          .join(" "),
      },
      React.createElement(
        "div",
        {
          className: `data-table-shell ${type === "tableIntro" ? "data-table-shell--border-yellow" : ""}`,
          ref: tableShellRef,
        },
        React.createElement(
          "table",
          { className: tableClass },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              renderTrialsTh(),
              ...headMiddleCols,
              renderChangeTh(),
              renderOutcomeTh(),
            ),
          ),
          React.createElement(
            "tbody",
            null,
            trials.map((row, idx) => {
              const isCalcActive =
                type === "calculateHeads" &&
                headsExplored > 0 &&
                idx === headsExplored - 1;
              const isCalcDimmed =
                type === "calculateHeads" &&
                headsExplored > 0 &&
                idx >= headsExplored;

              const isRowRevealed =
                type === "formulaQuiz" && idx < headsRevealed;
              const isRowActive =
                type === "formulaQuiz" && activeRevealRow === idx;
              const isRowDimmed =
                type === "formulaQuiz" &&
                revealTriggered &&
                !isRowRevealed &&
                !isRowActive;
              const showMultOp =
                type === "formulaQuiz" &&
                (isRowRevealed || (isRowActive && activeRevealStep >= 2));
              const showEqOp =
                type === "formulaQuiz" &&
                (isRowRevealed || (isRowActive && activeRevealStep >= 4));
              const multHighlight = isRowActive && activeRevealStep === 2;
              const multSettled =
                showMultOp &&
                (isRowRevealed || (isRowActive && activeRevealStep >= 3));
              const eqHighlight = isRowActive && activeRevealStep === 4;
              const eqSettled =
                showEqOp &&
                (isRowRevealed || (isRowActive && activeRevealStep >= 5));

              const middleTds = usePreSwapColumnOrder
                ? [renderHeadsTd(row, idx), renderRfTd(row, idx)]
                : [renderRfTd(row, idx), renderHeadsTd(row, idx)];

              return React.createElement(
                "tr",
                {
                  key: row.trial,
                  id: `table-row-${idx}`,
                  className: [
                    isCalcActive ? "row-calc-active" : "",
                    isCalcDimmed ? "row-dimmed" : "",
                    type === "calculateHeads" && idx < headsExplored - 1
                      ? "row-calc-explored"
                      : "",
                    type === "deduceOutcomes" && idx === outcomesRevealed - 1
                      ? "row-deduce-active"
                      : "",
                    type === "recordChange" && idx === changesRecorded - 1
                      ? "row-change-active"
                      : "",
                    isRowDimmed ? "row-reveal-dimmed" : "",
                    isRowRevealed ? "row-reveal-done" : "",
                    isRowActive
                      ? `row-reveal-active row-reveal-step-${activeRevealStep}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" "),
                },
                renderTrialsTd(row, idx),
                ...middleTds,
                renderChangeTd(row, idx),
                renderOutcomeTd(row, idx),
                type === "formulaQuiz" &&
                  revealTriggered &&
                  React.createElement(
                    "span",
                    {
                      className: [
                        "reveal-row-op",
                        "reveal-row-op--mult",
                        showMultOp ? "reveal-row-op--visible" : "",
                        multHighlight ? "reveal-row-op--highlight" : "",
                        multSettled ? "reveal-row-op--settled" : "",
                      ]
                        .filter(Boolean)
                        .join(" "),
                    },
                    "×",
                  ),
                type === "formulaQuiz" &&
                  revealTriggered &&
                  React.createElement(
                    "span",
                    {
                      className: [
                        "reveal-row-op",
                        "reveal-row-op--eq",
                        showEqOp ? "reveal-row-op--visible" : "",
                        eqHighlight ? "reveal-row-op--highlight" : "",
                        eqSettled ? "reveal-row-op--settled" : "",
                      ]
                        .filter(Boolean)
                        .join(" "),
                    },
                    "=",
                  ),
              );
            }),
          ),
        ),
        showRevealOverlay &&
          React.createElement(
            "div",
            { className: "reveal-overlay ftue-target", onClick: onHeadsReveal },
            React.createElement(
              "button",
              {
                type: "button",
                className: `story-action reveal-col-btn ${revealAnimating ? "reveal-col-btn--animating" : ""}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onHeadsReveal();
                },
                disabled: revealAnimating,
              },
              T.ui.revealButton,
            ),
          ),
      ),
    );
  };

  const renderKnownFormulaBox = () =>
    React.createElement(
      "div",
      {
        className: [
          "formula-box formula-box--known",
          isQuizWrong ? "formula-box--blink-wrong" : "",
          formulaTransformDone ? "formula-box--transformed" : "",
          formulaFlight ? "formula-box--flying" : "",
        ]
          .filter(Boolean)
          .join(" "),
      },
      React.createElement(
        "div",
        { className: "formula-expr", ref: knownFormulaRef },
        React.createElement(
          "span",
          { className: "formula-inline-start" },
          React.createElement("span", {
            className: "formula-rf",
            dangerouslySetInnerHTML: { __html: rfSymbolHtml },
          }),
          React.createElement(
            "span",
            { className: "formula-mult", ref: multRef },
            " ×",
          ),
          React.createElement(
            "span",
            { className: "formula-den-fly", ref: denFlyRef },
            "n",
          ),
          React.createElement("span", {
            className: "formula-fly-source",
            ref: flySourceRef,
            dangerouslySetInnerHTML: { __html: formulaFlyTextHtml },
          }),
        ),
        React.createElement("span", { className: "formula-eq" }, " = "),
        React.createElement(
          "span",
          { className: "formula-rhs-wrap", ref: rhsWrapRef },
          React.createElement(
            "span",
            { className: "formula-rhs-block", ref: fractionWrapRef },
            React.createElement(
              "span",
              { className: "vfrac" },
              React.createElement("span", {
                className: "vfrac-num",
                dangerouslySetInnerHTML: { __html: fSymbolHtml },
              }),
              React.createElement("span", { className: "vfrac-bar" }),
              React.createElement(
                "span",
                { className: "vfrac-den" },
                React.createElement(
                  "span",
                  { className: "formula-den-orig", ref: denOrigRef },
                  "n",
                ),
              ),
            ),
          ),
          React.createElement("span", {
            className: "formula-fh-final",
            ref: fhRhsRef,
            dangerouslySetInnerHTML: { __html: fSymbolHtml },
          }),
        ),
      ),
    );

  const renderQuizPanel = () => {
    if (type !== "formulaQuiz") return null;

    return React.createElement(
      "div",
      { className: "formula-panel" },
      React.createElement(
        "div",
        { className: "formula-panel-inner" },
        React.createElement(
          "div",
          { className: "formula-side formula-side--known" },
          React.createElement(
            "p",
            { className: "formula-side-title" },
            `${T.ui.weKnow} ${T.ui.relativeFrequency}`,
          ),
          renderKnownFormulaBox(),
        ),
        React.createElement(
          "div",
          {
            className: [
              "formula-side formula-side--quiz",
              quizOptionsDimmed ? "formula-side--quiz-dimmed" : "",
            ]
              .filter(Boolean)
              .join(" "),
          },
          React.createElement("p", {
            className: "formula-question",
            dangerouslySetInnerHTML: { __html: T.ui.formulaQuestion },
          }),
          React.createElement(
            "div",
            {
              className: [
                "quiz-options-row",
                quizOptionsDimmed ? "quiz-options-row--dimmed" : "",
              ]
                .filter(Boolean)
                .join(" "),
            },
            React.createElement("button", {
              type: "button",
              className: [
                "quiz-option-btn",
                !isQuizCorrect && !quizOptionsDimmed && !quizAnswer
                  ? "teeter-anim"
                  : "",
                quizAnswer === "option1" ? "quiz-option-btn--wrong" : "",
                quizBlinkWrong ? "quiz-option-btn--blink" : "",
                isQuizCorrect ? "quiz-option-btn--disabled" : "",
              ]
                .filter(Boolean)
                .join(" "),
              onClick: () => onQuizAnswer("option1"),
              disabled: isQuizCorrect,
              dangerouslySetInnerHTML: { __html: T.ui.formulaOption1 },
            }),
            React.createElement("button", {
              type: "button",
              className: [
                "quiz-option-btn",
                !isQuizCorrect && !quizOptionsDimmed && !isQuizWrong
                  ? "teeter-anim"
                  : "",
                quizAnswer === "option2" ? "quiz-option-btn--correct" : "",
                isQuizCorrect ? "quiz-option-btn--disabled" : "",
              ]
                .filter(Boolean)
                .join(" "),
              onClick: () => onQuizAnswer("option2"),
              disabled: isQuizCorrect,
              dangerouslySetInnerHTML: { __html: T.ui.formulaOption2 },
            }),
          ),
        ),
      ),
    );
  };

  const renderPromptBanner = () => {
    if (!showPromptBanner) return null;

    if (type === "formulaQuiz") {
      if (showWhatDoesTellUs) {
        return React.createElement(
          "div",
          { className: "prompt-banner fade-in" },
          React.createElement("button", {
            type: "button",
            className: "story-action what-does-tell-us-btn ftue-target",
            onClick: onWhatDoesTellUs,
            dangerouslySetInnerHTML: { __html: T.ui.whatDoesThisTellUsButton },
          }),
        );
      }
      return React.createElement(
        "div",
        { className: "prompt-banner fade-in" },
        renderQuizPanel(),
      );
    }

    if (type === "calculateHeads") {
      return React.createElement("div", { className: "prompt-banner fade-in" });
    }

    let html = "";
    if (type === "intro") html = T.ui.introPrompt;
    else if (type === "tableIntro") html = T.ui.tableIntroPrompt;
    else if (type === "pointsInteraction" && tappedPoints.length === 5) {
      html = T.ui.recordedAllPrompt;
    } else if (type === "pointsInteraction") {
      html = T.ui.recordDataPrompt;
    }

    if (!html) return null;
    return React.createElement(
      "div",
      { className: "prompt-banner fade-in" },
      React.createElement("div", {
        className: "prompt-banner-text",
        dangerouslySetInnerHTML: { __html: html },
      }),
    );
  };

  const renderSideCallout = () => {
    const html = getSideCalloutHtml();
    if (!html) return null;
    if (type === "deduceOutcomes" && !deduceCalloutReady) return null;

    const isDeduceCallout = type === "deduceOutcomes";

    return React.createElement(
      "div",
      {
        ref: sideCalloutRef,
        className: [
          "callout-box",
          "callout-box--side",
          "fade-in",
          isDeduceCallout ? "callout-box--deduce" : "",
        ]
          .filter(Boolean)
          .join(" "),
        style: isDeduceCallout
          ? {
              "--callout-pointer-top": calloutLayout.pointerTop,
            }
          : {
              top: `${calloutLayout.calloutTop}px`,
              "--callout-pointer-top": calloutLayout.pointerTop,
            },
      },
      isDeduceCallout
        ? React.createElement(
            "div",
            { className: "callout-box__body" },
            React.createElement("div", {
              className: "callout-box__text",
              dangerouslySetInnerHTML: { __html: html },
            }),
            React.createElement(
              "button",
              {
                type: "button",
                className: "callout-box__next ftue-target",
                onClick: onDeduceCalloutNext,
                "aria-label": T.ui.nextButton,
              },
              T.ui.nextButton,
            ),
          )
        : React.createElement("div", {
            className: "callout-box__text",
            dangerouslySetInnerHTML: { __html: html },
          }),
    );
  };

  const renderBottomCallout = () => {
    if (type === "summary") {
      return React.createElement(
        "div",
        {
          key: "stack-bottom-callout",
          ref: stackCalloutRef,
          className:
            "summary-callout stack-callout stack-callout--yellow stack-callout--dual fade-in",
          style: {
            "--callout-pointer-left": calloutLayout.pointerLeft,
            "--callout-pointer2-left": calloutLayout.pointer2Left,
          },
        },
        React.createElement(
          "p",
          { className: "summary-rule summary-rule--yellow" },
          T.ui.summaryText1,
        ),
        React.createElement(
          "p",
          { className: "summary-rule summary-rule--blue" },
          T.ui.summaryText2,
        ),
      );
    }

    if (type === "recordChange") {
      const html = getBottomCalloutHtml();
      if (!html) return null;
      return React.createElement("div", {
        key: "stack-bottom-callout",
        ref: stackCalloutRef,
        className:
          "summary-callout stack-callout stack-callout--yellow fade-in",
        style: { "--callout-pointer-left": calloutLayout.pointerLeft },
        dangerouslySetInnerHTML: { __html: html },
      });
    }

    return null;
  };

  const renderMainStage = () =>
    React.createElement(
      "div",
      {
        className: [
          `morph-stage morph-stage--${morphStageMode}`,
          quizExitActive && quizExitAnimating ? "morph-stage--graph-exiting" : "",
        ]
          .filter(Boolean)
          .join(" "),
        ref: stageRef,
      },
      morphGraphVisible &&
        React.createElement(
          "div",
          { className: `morph-graph-slot morph-graph-slot--${graphMorphMode}` },
          renderGraph(),
        ),
      React.createElement(
        "div",
        {
          className: [
            "morph-table-area",
            `morph-table-area--${morphStageMode}`,
          ].join(" "),
        },
        isCalloutStage
          ? React.createElement(
              "div",
              { key: "morph-callout-layout", className: "morph-table-row" },
              renderTable(),
              React.createElement(
                "div",
                {
                  key: "deduce-callout-column",
                  className: "callout-column",
                  ref: calloutColumnRef,
                },
                renderSideCallout(),
              ),
            )
          : isStackStage
            ? React.createElement(
                "div",
                {
                  key: "morph-stack-layout",
                  className: "morph-table-inner morph-table-inner--stack",
                },
                renderTable(),
                (type === "recordChange" || type === "summary") &&
                  renderBottomCallout(),
              )
            : renderTable(),
      ),
    );

  return React.createElement(
    "div",
    { className: `activity-screen activity-screen--${type}`, ref },
    React.createElement(
      "div",
      {
        className: `work-area ${showPromptBanner ? "" : "work-area--no-banner"}`,
      },
      React.createElement(
        "div",
        { className: "morph-stage-container" },
        renderMainStage(),
      ),
      showPromptBanner &&
        React.createElement(
          "div",
          { className: "prompt-banner-container" },
          renderPromptBanner(),
        ),
    ),
    activeAnimation?.flightTrial &&
      React.createElement(
        "div",
        {
          className: "flying-element flying-element--trial",
          style: {
            "--start-x": `${activeAnimation.flightTrial.startX}px`,
            "--start-y": `${activeAnimation.flightTrial.startY}px`,
            "--end-x": `${activeAnimation.flightTrial.endX}px`,
            "--end-y": `${activeAnimation.flightTrial.endY}px`,
          },
        },
        activeAnimation.flightTrial.text,
      ),
    activeAnimation?.flightRf &&
      React.createElement(
        "div",
        {
          className: "flying-element flying-element--rf",
          style: {
            "--start-x": `${activeAnimation.flightRf.startX}px`,
            "--start-y": `${activeAnimation.flightRf.startY}px`,
            "--end-x": `${activeAnimation.flightRf.endX}px`,
            "--end-y": `${activeAnimation.flightRf.endY}px`,
          },
        },
        activeAnimation.flightRf.text,
      ),
    formulaFlight &&
      React.createElement(
        "div",
        {
          className: "flying-element flying-element--formula",
          style: {
            "--start-x": `${formulaFlight.startX}px`,
            "--start-y": `${formulaFlight.startY}px`,
            "--end-x": `${formulaFlight.endX}px`,
            "--end-y": `${formulaFlight.endY}px`,
          },
        },
        formulaFlight.isHtml
          ? React.createElement("span", {
              dangerouslySetInnerHTML: { __html: formulaFlight.text },
            })
          : formulaFlight.text,
      ),
  );
});
