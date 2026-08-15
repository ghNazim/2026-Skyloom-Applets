const ChallengeScreen = React.forwardRef((props, ref) => {
  const {
    stepConfig,
    recordedPoints,
    formulaAnswer,
    revealedFreq,
    revealIndex,
    activeRevealRow,
    activeRevealStep,
    revealAnimating,
    changeIndex,
    changeInputs,
    changeFeedback,
    changeAwaitingNext,
    changePanelHold,
    revealTriggered,
    questionAnswers,
    formulaFlyDone,
    formulaBlinkWrong,
    questionBlinkWrong,
    onPointTap,
    onFormulaAnswer,
    onRevealFreq,
    onChangeInput,
    onChangeSubmit,
    onQuestionAnswer,
    onFormulaFlyComplete,
    onHideFtue,
    isWelcome,
  } = props;

  const stepData = stepConfig.stepData || {};
  const type = stepData.type;
  const personId = stepData.person;
  const currentPerson = personId
    ? T.people.find((p) => p.id === personId)
    : null;
  const [activeAnimation, setActiveAnimation] = React.useState(null);
  const [revealOverlayRect, setRevealOverlayRect] = React.useState(null);
  const [revealFlight, setRevealFlight] = React.useState(null);
  const [formulaFlight, setFormulaFlight] = React.useState(null);
  const [revealedParts, setRevealedParts] = React.useState({
    trial: false,
    mult: false,
    rf: false,
    answer: false,
  });

  const REVEAL_FLIGHT_MS = 900;
  const FORMULA_FLIGHT_MS = 1100;
  const GUIDE_DRAW_MS = 700;
  const VALUE_FLIGHT_MS = 900;
  const VALUE_FLIGHT_GAP_MS = 450;
  const REVEAL_FLIGHT_DELAY_MS = 60;
  const REVEAL_FLIGHT_LAND_MS = REVEAL_FLIGHT_DELAY_MS + REVEAL_FLIGHT_MS;
  const REVEAL_ANSWER_DELAY_MS = 450;
  const [settledCells, setSettledCells] = React.useState([]);
  const [landedTrials, setLandedTrials] = React.useState([]);
  const [landedRf, setLandedRf] = React.useState([]);
  const [calloutLayout, setCalloutLayout] = React.useState({
    calloutTop: 0,
    pointerTop: "50%",
    pointerLeft: "68%",
  });

  const tableShellRef = React.useRef(null);
  const calloutRef = React.useRef(null);
  const calloutColumnRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const welcomeSlotRef = React.useRef(null);
  const pendingPointTapsRef = React.useRef(new Set());
  const prevColsRef = React.useRef({ change: false, freq: false });
  const [welcomeTextMounted, setWelcomeTextMounted] = React.useState(true);
  const [welcomeTextCollapsed, setWelcomeTextCollapsed] = React.useState(false);
  const [welcomeSlotHeight, setWelcomeSlotHeight] = React.useState("auto");
  const [formulaColsSwapped, setFormulaColsSwapped] = React.useState(false);
  const swapFirstRectsRef = React.useRef(null);

  const GRAPH_VIEW_W = 150;
  const GRAPH_VIEW_H = 82;
  const GRAPH_AXIS_X = 30;
  const GRAPH_AXIS_RIGHT = 144;
  const GRAPH_AXIS_TOP = 5;
  const GRAPH_AXIS_BOTTOM = 68;
  const GRAPH_PLOT_H = GRAPH_AXIS_BOTTOM - GRAPH_AXIS_TOP;
  const GRAPH_X_LABEL_Y = GRAPH_AXIS_BOTTOM + 5.2;
  const GRAPH_X_TITLE_Y = 79;
  const GRAPH_Y_TITLE_X = 8;
  const GRAPH_X_MAX_TRIAL = 5;

  const getName = (id) => T.peopleText[id];

  const formatRf = (val) =>
    window.APP_LANGUAGE === "id" ? String(val).replace(".", ",") : val;

  const isTrialCellFilled = (personId, trial) =>
    recordedPoints[personId]?.includes(trial) ||
    landedTrials.includes(`${personId}-${trial}`);

  const isRfCellFilled = (personId, trial) =>
    recordedPoints[personId]?.includes(trial) ||
    landedRf.includes(`${personId}-${trial}`);

  const showFreqCol =
    type === "graphRecord" ||
    type === "formula" ||
    type === "revealFreq" ||
    type === "enterChanges" ||
    type === "mistakeQuestion" ||
    type === "explainMistake";
  const showChangeCol =
    type === "enterChanges" ||
    type === "mistakeQuestion" ||
    type === "explainMistake";
  const freqColEntering = type === "formula" && !prevColsRef.current.freq;
  const changeColEntering = showChangeCol && !prevColsRef.current.change;

  React.useLayoutEffect(() => {
    prevColsRef.current = { change: showChangeCol, freq: showFreqCol };
  }, [showChangeCol, showFreqCol]);

  const getTrialX = (trial) =>
    GRAPH_AXIS_X +
    (trial * (GRAPH_AXIS_RIGHT - GRAPH_AXIS_X)) / GRAPH_X_MAX_TRIAL;

  const getSvgCoords = (trial, rf) => {
    const x = getTrialX(trial);
    const y = GRAPH_AXIS_BOTTOM - Number(rf) * GRAPH_PLOT_H;
    return { x, y };
  };

  const updateCalloutLayout = React.useCallback(() => {
    const stage = stageRef.current;
    const shell = tableShellRef.current;
    const callout = calloutRef.current;
    const calloutColumn = calloutColumnRef.current;

    if (type === "revealFreq" && personId && !revealedFreq[personId]) {
      const row1Cell = document.getElementById(`${personId}-freq-1`);
      const row5Cell = document.getElementById(`${personId}-freq-5`);
      const boundsRoot =
        shell || (row1Cell && row1Cell.closest(".data-table-shell"));
      if (row1Cell && row5Cell && boundsRoot) {
        const shellRect = boundsRoot.getBoundingClientRect();
        const r1Rect = row1Cell.getBoundingClientRect();
        const r5Rect = row5Cell.getBoundingClientRect();
        setRevealOverlayRect({
          left: r1Rect.left - shellRect.left,
          top: r1Rect.top - shellRect.top,
          width: r1Rect.width,
          height: r5Rect.bottom - r1Rect.top,
        });
      }
    } else {
      setRevealOverlayRect(null);
    }

    if (!stage || !shell || type !== "enterChanges" || !personId) return;

    const activeIdx = changeIndex[personId];
    const targetCell =
      activeIdx >= 5
        ? shell.querySelector(".change-col-header")
        : (() => {
            const rowEl = document.getElementById(
              `${personId}-change-row-${activeIdx}`,
            );
            return rowEl ? rowEl.querySelector(".change-cell") || rowEl : null;
          })() || shell.querySelector(".change-col-header");

    if (!targetCell || !calloutColumn) return;

    const cellRect = targetCell.getBoundingClientRect();
    const columnRect = calloutColumn.getBoundingClientRect();
    const rowCenter = cellRect.top + cellRect.height / 2;
    const calloutHeight = callout ? callout.offsetHeight : cellRect.height * 4;
    const clampedTop = Math.max(
      0,
      columnRect.height - calloutHeight - 1.5 * (columnRect.height / 100),
    );

    let pointerTop = "50%";
    if (callout && calloutHeight > 0) {
      const pointerPx = rowCenter - columnRect.top - clampedTop;
      pointerTop = `${Math.min(92, Math.max(8, (pointerPx / calloutHeight) * 100))}%`;
    }

    const stageRect = stage.getBoundingClientRect();
    const pointerLeft =
      ((cellRect.left + cellRect.width / 2 - stageRect.left) /
        stageRect.width) *
      100;
    setCalloutLayout({
      calloutTop: clampedTop,
      pointerTop,
      pointerLeft: `${Math.min(92, Math.max(8, pointerLeft))}%`,
    });
  }, [type, personId, changeIndex, changeFeedback, changeInputs, revealedFreq]);

  React.useLayoutEffect(() => {
    updateCalloutLayout();
    const t1 = window.setTimeout(updateCalloutLayout, 50);
    const t2 = window.setTimeout(updateCalloutLayout, 350);
    window.addEventListener("resize", updateCalloutLayout);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", updateCalloutLayout);
    };
  }, [
    updateCalloutLayout,
    changeIndex,
    changeFeedback,
    changeInputs,
    type,
    personId,
  ]);

  React.useEffect(() => {
    pendingPointTapsRef.current.clear();
    setLandedTrials([]);
    setLandedRf([]);
  }, [type, personId]);

  React.useLayoutEffect(() => {
    if (isWelcome) {
      setWelcomeTextMounted(true);
      setWelcomeTextCollapsed(false);
      setWelcomeSlotHeight("auto");
      return;
    }

    if (type !== "intro") {
      setWelcomeTextMounted(false);
      return;
    }

    const el = welcomeSlotRef.current;
    if (!el) return;

    if (welcomeSlotHeight === "auto") {
      setWelcomeSlotHeight(`${el.scrollHeight}px`);
      return;
    }

    if (welcomeSlotHeight !== "0px") {
      const rafId = requestAnimationFrame(() => {
        setWelcomeSlotHeight("0px");
        setWelcomeTextCollapsed(true);
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [isWelcome, type, welcomeSlotHeight]);

  const handleWelcomeSlotTransitionEnd = (event) => {
    if (event.propertyName !== "height") return;
    if (!isWelcome) setWelcomeTextMounted(false);
  };

  React.useEffect(() => {
    if (type !== "formula") {
      setFormulaColsSwapped(false);
      swapFirstRectsRef.current = null;
      return;
    }
    const timer = window.setTimeout(() => {
      const shell = tableShellRef.current;
      if (shell) {
        const cells = shell.querySelectorAll(
          "th:nth-child(2), th:nth-child(3), td:nth-child(2), td:nth-child(3)",
        );
        swapFirstRectsRef.current = Array.from(cells).map((el) => ({
          el,
          rect: el.getBoundingClientRect(),
        }));
      }
      setFormulaColsSwapped(true);
    }, 780);
    return () => window.clearTimeout(timer);
  }, [type]);

  React.useLayoutEffect(() => {
    if (!formulaColsSwapped || type !== "formula") return;
    const first = swapFirstRectsRef.current;
    if (!first || !first.length) return;

    first.forEach(({ el, rect }) => {
      const last = el.getBoundingClientRect();
      const dx = rect.left - last.left;
      const dy = rect.top - last.top;
      if (!dx && !dy) return;
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.getBoundingClientRect();
      requestAnimationFrame(() => {
        el.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.transform = "translate(0, 0)";
      });
    });

    const clearTimer = window.setTimeout(() => {
      first.forEach(({ el }) => {
        el.style.transition = "";
        el.style.transform = "";
      });
      swapFirstRectsRef.current = null;
    }, 750);
    return () => window.clearTimeout(clearTimer);
  }, [formulaColsSwapped, type]);

  const launchRevealFlight = (sourceEl, targetEl, text) => {
    if (!sourceEl || !targetEl) return;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const source = sourceEl.getBoundingClientRect();
    const target = targetEl.getBoundingClientRect();
    setRevealFlight({
      text,
      startX: source.left + source.width / 2 + scrollX,
      startY: source.top + source.height / 2 + scrollY,
      endX: target.left + target.width / 2 + scrollX,
      endY: target.top + target.height / 2 + scrollY,
    });
    setTimeout(() => setRevealFlight(null), REVEAL_FLIGHT_MS);
  };

  React.useEffect(() => {
    if (type !== "revealFreq" || activeRevealRow === null) return;

    let showTimer;
    if (activeRevealStep === 1) {
      setRevealedParts({ trial: false, mult: false, rf: false, answer: false });
      showTimer = setTimeout(
        () => setRevealedParts((prev) => ({ ...prev, trial: true })),
        REVEAL_FLIGHT_LAND_MS,
      );
    } else if (activeRevealStep === 2) {
      showTimer = setTimeout(
        () => setRevealedParts((prev) => ({ ...prev, mult: true })),
        REVEAL_FLIGHT_DELAY_MS,
      );
    } else if (activeRevealStep === 3) {
      showTimer = setTimeout(
        () => setRevealedParts((prev) => ({ ...prev, rf: true })),
        REVEAL_FLIGHT_LAND_MS,
      );
    } else if (activeRevealStep === 4) {
      showTimer = setTimeout(
        () => setRevealedParts((prev) => ({ ...prev, answer: true })),
        REVEAL_FLIGHT_DELAY_MS,
      );
    }

    return () => clearTimeout(showTimer);
  }, [type, activeRevealRow, activeRevealStep]);

  React.useEffect(() => {
    if (type !== "revealFreq" || activeRevealRow === null || !personId) return;

    const trial = activeRevealRow + 1;
    const freqCell = document.getElementById(`${personId}-freq-${trial}`);
    if (!freqCell) return;

    const flightTimer = setTimeout(() => {
      let targetEl = freqCell;
      if (activeRevealStep === 1) {
        targetEl = freqCell.querySelector(".reveal-part--trial") || freqCell;
        const trialCell = document.getElementById(`${personId}-trial-${trial}`);
        launchRevealFlight(trialCell, targetEl, String(trial));
      } else if (activeRevealStep === 2) {
        // × fades in f(H) column only
      } else if (activeRevealStep === 3) {
        targetEl = freqCell.querySelector(".reveal-part--rf") || freqCell;
        const rfCell = document.getElementById(`${personId}-rf-${trial}`);
        const rfSource = rfCell?.querySelector(".rf-value-part") || rfCell;
        const person = T.people.find((p) => p.id === personId);
        if (person && rfSource)
          launchRevealFlight(
            rfSource,
            targetEl,
            formatRf(person.rf[activeRevealRow]),
          );
      } else if (activeRevealStep === 4) {
        // '=' fades in f(H) column only
      }
    }, REVEAL_FLIGHT_DELAY_MS);

    return () => clearTimeout(flightTimer);
  }, [type, personId, activeRevealRow, activeRevealStep]);

  React.useEffect(() => {
    if (type !== "formula" || formulaAnswer !== "right" || formulaFlyDone)
      return;

    const timer = setTimeout(() => {
      const formulaBox = document.querySelector(".formula-option--right");
      const freqHeader =
        document.querySelector(".freq-col-header .col-sub") ||
        document.querySelector(".freq-col-header");
      if (!formulaBox || !freqHeader) {
        onFormulaFlyComplete();
        return;
      }

      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const source = formulaBox.getBoundingClientRect();
      const target = freqHeader.getBoundingClientRect();

      setFormulaFlight({
        html: formulaBox.innerHTML || T.ui.formulaOptionRight,
        startX: source.left + source.width / 2 + scrollX,
        startY: source.top + source.height / 2 + scrollY,
        endX: target.left + target.width / 2 + scrollX,
        endY: target.top + target.height / 2 + scrollY,
      });

      window.setTimeout(() => {
        setFormulaFlight(null);
        onFormulaFlyComplete();
      }, FORMULA_FLIGHT_MS);
    }, 40);

    return () => clearTimeout(timer);
  }, [type, formulaAnswer, formulaFlyDone]);

  const handlePointClick = (person, trial, idx, event) => {
    if (type !== "graphRecord" || person.id !== personId) return;
    if (
      recordedPoints[person.id].includes(trial) ||
      activeAnimation ||
      pendingPointTapsRef.current.has(trial)
    )
      return;

    pendingPointTapsRef.current.add(trial);
    if (typeof onHideFtue === "function") onHideFtue();

    const svgEl = event.currentTarget.ownerSVGElement;
    const point = getSvgCoords(trial, person.rf[idx]);

    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const trialCell = document.getElementById(`${person.id}-trial-${trial}`);
    const rfCell = document.getElementById(`${person.id}-rf-${trial}`);
    if (!trialCell || !rfCell) return;

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
      const rectTarget = event.currentTarget.getBoundingClientRect();
      startX_Trial = rectTarget.left + rectTarget.width / 2 + scrollX;
      startY_Trial = rectTarget.top + rectTarget.height / 2 + scrollY;
      startX_Rf = startX_Trial;
      startY_Rf = startY_Trial;
    }

    setActiveAnimation({
      personId: person.id,
      trial,
      idx,
      showLines: true,
      linesDrawComplete: false,
      pointFilled: false,
      flightX: null,
      flightY: null,
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
              flightX: {
                text: String(trial),
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
      setLandedTrials((prev) => [...prev, `${person.id}-${trial}`]);
      setActiveAnimation((prev) => (prev ? { ...prev, flightX: null } : null));
    }, trialLandAt);

    setTimeout(() => {
      setActiveAnimation((prev) =>
        prev
          ? {
              ...prev,
              flightY: {
                text: formatRf(person.rf[idx]),
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
      setLandedRf((prev) => [...prev, `${person.id}-${trial}`]);
      setActiveAnimation(null);
      pendingPointTapsRef.current.delete(trial);
      onPointTap(person.id, trial);
      setSettledCells((prev) => [...prev, trial]);
      setTimeout(() => {
        setSettledCells((prev) => prev.filter((t) => t !== trial));
      }, 400);
    }, rfLandAt);
  };

  const renderGraph = (person, options = {}) => {
    const {
      compact = false,
      centered = false,
      morph = false,
      dualFade = false,
    } = options;
    const points = person.rf.map((rf, idx) => ({
      trial: idx + 1,
      rf,
      ...getSvgCoords(idx + 1, rf),
    }));
    const path = points.map((p) => `${p.x},${p.y}`).join(" ");
    const isCurrent = person.id === personId;
    const showGuides = type === "graphRecord" && isCurrent;

    return React.createElement(
      "div",
      {
        key: person.id,
        className: [
          "panel graph-panel",
          morph ? "graph-panel--morph" : "",
          compact ? "graph-panel--compact" : "graph-panel--solo",
          centered ? "graph-panel--centered" : "",
          dualFade ? "graph-panel--dual-fade" : "",
        ]
          .filter(Boolean)
          .join(" "),
        style: { "--person-color": person.color },
      },
      React.createElement(
        "div",
        { className: "graph-name", style: { color: person.color } },
        getName(person.id),
      ),
      React.createElement(
        "div",
        { className: "graph-wrapper" },
        React.createElement(
          "svg",
          {
            viewBox: `0 0 ${GRAPH_VIEW_W} ${GRAPH_VIEW_H}`,
            className: "graph-svg",
            preserveAspectRatio: "xMidYMid meet",
          },
          [0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
            const y = GRAPH_AXIS_BOTTOM - val * GRAPH_PLOT_H;
            return React.createElement("line", {
              key: `grid-y-${val}`,
              className: "grid-line",
              x1: GRAPH_AXIS_X,
              y1: y,
              x2: GRAPH_AXIS_RIGHT,
              y2: y,
            });
          }),
          [1, 2, 3, 4, 5].map((trial) => {
            const x = getTrialX(trial);
            return React.createElement("line", {
              key: `grid-x-${trial}`,
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
              { key: `y-${val}` },
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
                  x: GRAPH_AXIS_X - 4,
                  y,
                  fontSize: 5.6,
                  textAnchor: "end",
                  dominantBaseline: "central",
                },
                val === 1 ? "1" : val.toFixed(1),
              ),
            );
          }),
          [1, 2, 3, 4, 5].map((trial) => {
            const x = getTrialX(trial);
            return React.createElement(
              "g",
              { key: `x-${trial}` },
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
                  fontSize: 5.6,
                  textAnchor: "middle",
                  dominantBaseline: "central",
                },
                trial,
              ),
            );
          }),
          React.createElement(
            "text",
            {
              className: "axis-title-text x-axis-title",
              x: (GRAPH_AXIS_X + GRAPH_AXIS_RIGHT) / 2,
              y: GRAPH_X_TITLE_Y,
              fontSize: 5.4,
              textAnchor: "middle",
              dominantBaseline: "central",
            },
            T.ui.trialsLabel,
          ),
          React.createElement(
            "text",
            {
              className: "axis-title-text y-axis-title",
              transform: `rotate(-90 ${GRAPH_Y_TITLE_X} ${GRAPH_AXIS_TOP + GRAPH_PLOT_H / 2})`,
              x: GRAPH_Y_TITLE_X,
              y: GRAPH_AXIS_TOP + GRAPH_PLOT_H / 2,
              fontSize: 5.4,
              textAnchor: "middle",
              dominantBaseline: "central",
            },
            React.createElement("tspan", null, "f"),
            React.createElement(
              "tspan",
              { baselineShift: "sub", fontSize: 3.6, dy: 1.4 },
              "r",
            ),
            React.createElement(
              "tspan",
              { dy: -1.4 },
              window.APP_LANGUAGE === "id" ? "(A)" : "(H)",
            ),
          ),
          React.createElement("polyline", {
            className: "graph-polyline",
            points: path,
          }),
          points.map((p, idx) => {
            const tapped =
              isTrialCellFilled(person.id, p.trial) ||
              (activeAnimation &&
                activeAnimation.personId === person.id &&
                activeAnimation.trial === p.trial &&
                activeAnimation.pointFilled);
            const interactive =
              type === "graphRecord" &&
              isCurrent &&
              !recordedPoints[person.id]?.includes(p.trial) &&
              !pendingPointTapsRef.current.has(p.trial) &&
              !(
                activeAnimation &&
                activeAnimation.personId === person.id &&
                activeAnimation.trial === p.trial
              );
            const isMistake =
              type === "explainMistake" &&
              person.id === "sondang" &&
              p.trial === 5;
            return React.createElement(
              "g",
              { key: p.trial },
              showGuides &&
                (tapped ||
                  (activeAnimation &&
                    activeAnimation.personId === person.id &&
                    activeAnimation.trial === p.trial &&
                    activeAnimation.showLines)) &&
                (() => {
                  const isAnimatingThis =
                    activeAnimation &&
                    activeAnimation.personId === person.id &&
                    activeAnimation.trial === p.trial &&
                    activeAnimation.showLines;
                  const isDrawing =
                    isAnimatingThis && !activeAnimation.linesDrawComplete;
                  return React.createElement(
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
                  );
                })(),
              isMistake &&
                React.createElement(
                  React.Fragment,
                  null,
                  React.createElement("circle", {
                    className: "mistake-ring",
                    cx: p.x,
                    cy: p.y,
                    r: 6.8,
                  }),
                  React.createElement(
                    "text",
                    {
                      className: "mistake-thumbs-down",
                      x: p.x + 5,
                      y: p.y - 4,
                      fontSize: 5.5,
                      textAnchor: "start",
                    },
                    "👎",
                  ),
                ),
              interactive &&
                React.createElement("circle", {
                  className: "graph-point-halo",
                  cx: p.x,
                  cy: p.y,
                  r: 4.2,
                  pointerEvents: "none",
                }),
              React.createElement("circle", {
                className: `graph-point-target ${interactive ? "ftue-target" : ""} ${tapped ? "point-disabled" : ""}`,
                cx: p.x,
                cy: p.y,
                r: interactive ? 4.4 : 2.4,
                onClick: (e) => handlePointClick(person, p.trial, idx, e),
                style: { cursor: interactive ? "pointer" : "default" },
              }),
              React.createElement("circle", {
                className: `graph-point-inner ${tapped ? "point-filled" : ""}`,
                cx: p.x,
                cy: p.y,
                r: 1.8,
                pointerEvents: "none",
              }),
            );
          }),
        ),
      ),
    );
  };

  const getFreqCellClass = (idx) => {
    if (
      type === "revealFreq" &&
      personId &&
      !revealTriggered[personId] &&
      !revealedFreq[personId]
    ) {
      return "cell-pending";
    }
    if (idx < revealIndex) return "cell-revealed";
    if (idx === activeRevealRow)
      return `cell-revealing cell-revealing--step${activeRevealStep}`;
    return "cell-pending";
  };

  const showTableMultSign = () => false;
  const showTableEqualSign = () => false;

  const renderFreqCellValue = (person, idx) => {
    if (type === "graphRecord") return "\u00a0";
    if (
      revealedFreq[person.id] ||
      type === "enterChanges" ||
      ["mistakeQuestion", "explainMistake"].includes(type)
    ) {
      return person.freq[idx];
    }
    if (type === "revealFreq" && !revealTriggered[person.id]) {
      return React.createElement(
        "span",
        { className: "faded-question-mark" },
        "?",
      );
    }
    if (idx < revealIndex) return person.freq[idx];
    if (idx === activeRevealRow) {
      const trial = idx + 1;
      const rf = person.rf[idx];
      const freq = person.freq[idx];
      return React.createElement(
        "span",
        { className: "heads-calc-expr reveal-expr-building" },
        React.createElement(
          "span",
          {
            key: "t",
            className: `reveal-part reveal-part--trial ${revealedParts.trial ? "reveal-part--enter" : "reveal-part--hidden"}`,
          },
          trial,
        ),
        React.createElement(
          "span",
          {
            key: "op",
            className: `calc-op reveal-part reveal-part--mult ${revealedParts.mult ? "reveal-part--enter" : "reveal-part--hidden"}`,
          },
          "×",
        ),
        React.createElement(
          "span",
          {
            key: "rf",
            className: `reveal-part reveal-part--rf ${revealedParts.rf ? "reveal-part--enter" : "reveal-part--hidden"}`,
          },
          formatRf(rf),
        ),
        React.createElement(
          "span",
          {
            key: "eq",
            className: `calc-op reveal-part--eq ${revealedParts.answer ? "reveal-part--enter" : "reveal-part--hidden"}`,
          },
          "=",
        ),
        React.createElement(
          "span",
          {
            key: "ans",
            className: `calc-result reveal-part--answer ${revealedParts.answer ? "reveal-part--enter" : "reveal-part--hidden"}`,
          },
          freq,
        ),
      );
    }
    return React.createElement(
      "span",
      { className: "faded-question-mark" },
      "?",
    );
  };

  const getChangeCellClasses = (person, idx) => {
    const classes = ["change-cell"];
    const activeChange = changeIndex[person.id];
    if (type !== "enterChanges") {
      if (idx < activeChange)
        classes.push(
          person.changes[idx] !== "0"
            ? "change-cell--pos"
            : "change-cell--zero",
        );
      if (person.id === "sondang" && person.changes[idx] === "-1")
        classes.push("cell-mistake");
      return classes;
    }
    if (idx < activeChange) {
      classes.push(
        person.changes[idx] !== "0" ? "change-cell--pos" : "change-cell--zero",
      );
      if (idx === activeChange - 1)
        classes.push("change-cell--recording-active");
    } else {
      classes.push("change-cell--col-focus");
    }
    if (idx === activeChange) classes.push("change-cell--recording-active");
    return classes;
  };

  const getFreqCellClasses = (person, idx) => {
    const classes = [];
    if (type === "enterChanges") {
      const activeChange = changeIndex[person.id];
      if (idx === activeChange) classes.push("heads-cell--record-active");
      else if (idx === activeChange - 1 && activeChange > 0)
        classes.push("heads-cell--record-prev");
    }
    classes.push(getFreqCellClass(idx));
    return classes.filter(Boolean).join(" ");
  };

  const renderTable = (person, options = {}) => {
    const showRf = options.showRf ?? true;
    const showFreq = options.showFreq ?? false;
    const showChange = options.showChange ?? false;
    const collapsed = options.collapsed ?? false;
    const activeChange = changeIndex[person.id];
    const awaitingNext = changeAwaitingNext[person.id];

    const colCount = [true, showRf, showFreq, showChange].filter(
      Boolean,
    ).length;
    const tableClass = [
      "data-table",
      "data-table--gap-style",
      `data-table--cols-${colCount}`,
      `data-table--step-${type}`,
      collapsed ? "data-table--dim-lead" : "",
      type === "enterChanges" ? "data-table--step-recordChange" : "",
      type === "formula" && formulaColsSwapped
        ? "data-table--cols-swapped"
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    const showSubHeading =
      (type === "formula" && formulaAnswer === "right" && formulaFlyDone) ||
      (type === "revealFreq" && (formulaFlyDone || person.id === "sondang")) ||
      ["enterChanges", "mistakeQuestion", "explainMistake"].includes(type);

    const freqHeader = showFreq
      ? React.createElement(
          "th",
          {
            key: "freq-h",
            className: [
              collapsed ? "col-dim" : "",
              "freq-col-header",
              freqColEntering ? "table-col-morph--enter" : "",
              type === "revealFreq" || type === "enterChanges"
                ? "heads-col-header--focus"
                : "",
            ]
              .filter(Boolean)
              .join(" "),
          },
          React.createElement("span", {
            className: "col-main",
            dangerouslySetInnerHTML: { __html: T.ui.freqCol },
          }),
          React.createElement("span", {
            className: `col-sub${showSubHeading ? " col-sub--visible" : ""}`,
            dangerouslySetInnerHTML: { __html: T.ui.formulaOptionRight },
          }),
        )
      : null;
    const rfHeader = showRf
      ? React.createElement("th", {
          key: "rf-h",
          className: collapsed ? "col-dim" : "",
          dangerouslySetInnerHTML: { __html: T.ui.rfCol },
        })
      : null;

    return React.createElement(
      "div",
      {
        className: `data-table-wrap data-table-wrap--morph ${options.wrapClass || ""}`,
      },
      React.createElement(
        "div",
        { className: "data-table-shell", ref: tableShellRef },
        React.createElement(
          "table",
          { className: tableClass },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", { key: "trial-h" }, T.ui.trialCol),
              freqHeader,
              rfHeader,
              showChange &&
                React.createElement("th", {
                  className: [
                    "change-col-header",
                    changeColEntering ? "table-col-morph--enter" : "",
                    type === "enterChanges" ? "change-col-header--focus" : "",
                  ]
                    .filter(Boolean)
                    .join(" "),
                  dangerouslySetInnerHTML: { __html: T.ui.changeCol },
                }),
            ),
          ),
          React.createElement(
            "tbody",
            null,
            [1, 2, 3, 4, 5].map((trial, idx) => {
              const recorded = isTrialCellFilled(person.id, trial);
              const showThisChange = showChange && idx < activeChange;
              const showPendingCorrect =
                showChange && idx === activeChange && awaitingNext;
              const mistake =
                person.id === "sondang" &&
                showThisChange &&
                person.changes[idx] === "-1";
              const justSettled = settledCells.includes(trial);
              const isRevealTrialActive =
                activeRevealRow === idx && activeRevealStep === 1;
              const isRevealRfActive =
                activeRevealRow === idx && activeRevealStep === 3;
              const isChangeRowActive =
                type === "enterChanges" && idx === activeChange;

              return React.createElement(
                "tr",
                {
                  key: trial,
                  id: `${person.id}-change-row-${idx}`,
                  className: [
                    mistake ? "mistake-row" : "",
                    isChangeRowActive ? "row-change-active" : "",
                    type === "enterChanges" && idx < activeChange
                      ? "row-change-explored"
                      : "",
                    revealTriggered[person.id] && activeRevealRow === idx
                      ? `row-reveal-active row-reveal-step-${activeRevealStep}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" "),
                },
                React.createElement(
                  "td",
                  {
                    id: `${person.id}-trial-${trial}`,
                    style: { position: "relative" },
                    className: [
                      isRevealTrialActive ? "cell-highlight-trial" : "",
                      type === "enterChanges" && idx === activeChange
                        ? "heads-cell--record-active"
                        : "",
                      type === "enterChanges" &&
                      idx === activeChange - 1 &&
                      activeChange > 0
                        ? "heads-cell--record-prev"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" "),
                  },
                  isTrialCellFilled(person.id, trial) || type !== "graphRecord"
                    ? trial
                    : "\u00a0",
                ),
                ...(function () {
                  const freqCell = showFreq
                    ? React.createElement(
                        "td",
                        {
                          key: "freq",
                          id: `${person.id}-freq-${trial}`,
                          className: [
                            collapsed ? "col-dim" : "",
                            freqColEntering ? "table-col-morph--enter" : "",
                            getFreqCellClasses(person, idx),
                          ]
                            .filter(Boolean)
                            .join(" "),
                        },
                        renderFreqCellValue(person, idx),
                      )
                    : null;
                  const rfCell = showRf
                    ? React.createElement(
                        "td",
                        {
                          key: "rf",
                          id: `${person.id}-rf-${trial}`,
                          style: { position: "relative" },
                          className: [
                            collapsed ? "col-dim" : "",
                            isRfCellFilled(person.id, trial) ||
                            type !== "graphRecord"
                              ? justSettled
                                ? "cell-flying-settled"
                                : "cell-filled"
                              : "",
                            isRevealRfActive ? "cell-highlight-rf" : "",
                            type === "enterChanges" && idx === activeChange
                              ? "heads-cell--record-active"
                              : "",
                            type === "enterChanges" &&
                            idx === activeChange - 1 &&
                            activeChange > 0
                              ? "heads-cell--record-prev"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" "),
                        },
                        isRfCellFilled(person.id, trial) ||
                          type !== "graphRecord"
                          ? React.createElement(
                              "span",
                              {
                                className: `rf-value-part${justSettled ? " cell-flying-settled" : ""}`,
                              },
                              formatRf(person.rf[idx]),
                            )
                          : "\u00a0",
                      )
                    : null;
                  return [freqCell, rfCell];
                })(),
                showChange &&
                  React.createElement(
                    "td",
                    {
                      className: [
                        changeColEntering ? "table-col-morph--enter" : "",
                        ...getChangeCellClasses(person, idx),
                        type === "enterChanges" &&
                        idx === activeChange &&
                        changeFeedback?.type === "wrong"
                          ? "change-cell--wrong-active"
                          : "",
                        type === "enterChanges" &&
                        idx === activeChange &&
                        changeFeedback?.type === "correct"
                          ? "change-cell--correct-active"
                          : "",
                      ].join(" "),
                    },
                    showThisChange || showPendingCorrect
                      ? React.createElement(
                          React.Fragment,
                          null,
                          person.changes[idx],
                          ["mistakeQuestion", "explainMistake"].includes(
                            type,
                          ) &&
                            questionAnswers[person.id] &&
                            React.createElement(
                              "span",
                              {
                                className: `thumbs-emoji ${person.changes[idx] === "-1" ? "thumbs-emoji--down" : "thumbs-emoji--up"}`,
                              },
                              person.changes[idx] === "-1" ? " 👎" : " 👍",
                            ),
                        )
                      : type === "enterChanges" && idx === activeChange
                        ? changeInputs[person.id]
                        : "?",
                  ),
              );
            }),
          ),
        ),
        type === "revealFreq" &&
          !revealedFreq[person.id] &&
          !revealTriggered[person.id] &&
          React.createElement(
            "div",
            {
              className: `reveal-overlay${revealOverlayRect ? "" : " reveal-overlay--fallback"}`,
              style: revealOverlayRect
                ? {
                    left: `${revealOverlayRect.left}px`,
                    top: `${revealOverlayRect.top}px`,
                    width: `${revealOverlayRect.width}px`,
                    height: `${revealOverlayRect.height}px`,
                  }
                : undefined,
            },
            React.createElement(
              "button",
              {
                type: "button",
                className: `story-action reveal-col-btn ftue-target ${revealAnimating ? "reveal-col-btn--animating" : ""}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onRevealFreq(person.id);
                },
                disabled: revealAnimating,
              },
              T.ui.revealButton,
            ),
          ),
      ),
    );
  };

  const renderFormula = () => {
    const isCorrect = formulaAnswer === "right";
    const showHint = formulaAnswer === "wrong";

    return React.createElement(
      "div",
      { className: `formula-panel${isCorrect ? " formula-panel--done" : ""}` },
      React.createElement("div", {
        className: "formula-title",
        dangerouslySetInnerHTML: { __html: T.ui.formulaQuestion },
      }),
      React.createElement(
        "div",
        {
          className: `formula-hint${showHint ? " formula-hint--visible" : ""}`,
        },
        React.createElement(
          "p",
          { className: "formula-hint-label" },
          T.ui.formulaKnown,
        ),
        React.createElement("div", {
          className: "formula-hint-expr",
          dangerouslySetInnerHTML: { __html: T.ui.formulaKnownExpr },
        }),
      ),
      React.createElement(
        "div",
        { className: "formula-options" },
        React.createElement("button", {
          type: "button",
          className: `quiz-option-btn formula-option${!isCorrect ? " teeter-anim" : ""} ${formulaAnswer === "wrong" ? "quiz-option-btn--wrong" : ""} ${formulaBlinkWrong && formulaAnswer === "wrong" ? "quiz-option-btn--blink" : ""}`,
          onClick: () => onFormulaAnswer("wrong"),
          disabled: isCorrect,
          dangerouslySetInnerHTML: { __html: T.ui.formulaOptionWrong },
        }),
        React.createElement("button", {
          type: "button",
          className: `quiz-option-btn formula-option formula-option--right${!isCorrect ? " teeter-anim" : ""} ${formulaAnswer === "right" ? "quiz-option-btn--correct" : ""}`,
          onClick: () => onFormulaAnswer("right"),
          disabled: isCorrect,
          dangerouslySetInnerHTML: { __html: T.ui.formulaOptionRight },
        }),
      ),
    );
  };

  const renderNumpadCallout = (person) => {
    const idx = changeIndex[person.id];
    const panelHold = changePanelHold[person.id];
    const awaitingNext = changeAwaitingNext[person.id];
    const showPanel = idx < 5 || panelHold;
    if (!showPanel) return null;

    return React.createElement(
      "div",
      {
        ref: calloutRef,
        className: "numpad-callout fade-in",
        style: {
          top: `${calloutLayout.calloutTop}px`,
          "--callout-pointer-top": calloutLayout.pointerTop,
        },
      },
      (idx < 5 || panelHold) &&
        React.createElement(NumPad, {
          value: changeInputs[person.id],
          onChange: (value) => onChangeInput(person.id, value),
          onSubmit: () => onChangeSubmit(person.id),
          disabled: panelHold || awaitingNext,
        }),
      changeFeedback &&
        React.createElement("div", {
          className: `feedback-card feedback-card--${changeFeedback.type} numpad-feedback`,
          dangerouslySetInnerHTML: { __html: changeFeedback.message },
        }),
    );
  };

  const renderQuestion = (person) => {
    const answer = questionAnswers[person.id];
    const expected = person.id === "putu" ? "no" : "yes";
    const isDone = answer === expected;

    return React.createElement(
      "div",
      { className: "question-card" },
      React.createElement(
        "div",
        { className: "question-title" },
        T.ui.mistakeQuestion.replace("{name}", getName(person.id)),
      ),
      isDone &&
        React.createElement("div", {
          className: "feedback-card feedback-card--correct",
          dangerouslySetInnerHTML: {
            __html:
              person.id === "putu"
                ? T.ui.putuCorrectReason
                : T.ui.sondangCorrectReason,
          },
        }),
      React.createElement(
        "div",
        { className: `yes-no-row ${!answer ? "teeter-anim" : ""}` },
        ["no", "yes"].map((choice) =>
          React.createElement(
            "button",
            {
              key: choice,
              type: "button",
              className: [
                "quiz-option-btn yes-no-btn",
                answer === choice
                  ? choice === expected
                    ? "quiz-option-btn--correct"
                    : "quiz-option-btn--wrong"
                  : "",
                questionBlinkWrong && answer === choice && choice !== expected
                  ? "quiz-option-btn--blink"
                  : "",
              ]
                .filter(Boolean)
                .join(" "),
              onClick: () => onQuestionAnswer(person.id, choice),
              disabled: isDone,
            },
            choice === "yes" ? T.ui.yes : T.ui.no,
          ),
        ),
      ),
    );
  };

  const renderPromptBanner = () => {
    if (revealAnimating) return null;

    if (isWelcome) {
      return React.createElement("div", {
        className: "prompt-banner prompt-banner--orange",
        dangerouslySetInnerHTML: { __html: T.ui.readQuestionPrompt },
      });
    }

    if (type === "intro") {
      return React.createElement("div", {
        className: "prompt-banner fade-in",
        dangerouslySetInnerHTML: { __html: T.ui.bothPrompt },
      });
    }

    if (type === "graphRecord" && currentPerson) {
      const graphPrompt =
        currentPerson.id === "sondang"
          ? T.ui.graphPromptSondang
          : T.ui.graphPrompt;
      return React.createElement("div", {
        className: "prompt-banner fade-in",
        dangerouslySetInnerHTML: {
          __html: graphPrompt.replace(
            "{name}",
            `<span class="hl-person" style="color:${currentPerson.color}">${getName(currentPerson.id)}</span>`,
          ),
        },
      });
    }

    if (type === "formula") {
      return React.createElement("div", {
        className: "prompt-banner fade-in",
        dangerouslySetInnerHTML: { __html: T.ui.formulaPrompt },
      });
    }

    if (type === "revealFreq") {
      return React.createElement("div", {
        className: "prompt-banner fade-in",
        dangerouslySetInnerHTML: { __html: T.ui.revealPrompt },
      });
    }

    if (type === "enterChanges") {
      return React.createElement("div", {
        className: "prompt-banner prompt-banner--orange fade-in",
        dangerouslySetInnerHTML: { __html: T.ui.changesPrompt },
      });
    }

    if (type === "mistakeQuestion") {
      return React.createElement("div", {
        className: "prompt-banner prompt-banner--orange fade-in",
        dangerouslySetInnerHTML: { __html: T.ui.answerMainQuestion },
      });
    }

    if (type === "explainMistake") {
      return React.createElement("div", {
        className: "prompt-banner prompt-banner--orange fade-in",
        dangerouslySetInnerHTML: { __html: T.ui.mistakeExplain },
      });
    }

    return null;
  };

  const morphStageMode =
    type === "intro" ||
    type === "graphRecord" ||
    type === "formula" ||
    type === "revealFreq"
      ? "intro-dual"
      : type === "explainMistake"
        ? "split"
        : type === "mistakeQuestion"
          ? "stack-formula"
          : type === "enterChanges"
            ? "callout"
            : "split";

  const graphMorphMode =
    type === "intro" ||
    type === "graphRecord" ||
    type === "formula" ||
    type === "revealFreq"
      ? "center-dual"
      : type === "explainMistake"
        ? "split-left"
        : "off";

  const morphGraphVisible =
    type === "intro" ||
    type === "graphRecord" ||
    type === "formula" ||
    type === "revealFreq" ||
    type === "explainMistake";
  const morphTableHidden =
    type === "intro" ||
    type === "graphRecord" ||
    type === "formula" ||
    type === "revealFreq";
  const showWelcomeQuestion = type === "intro" && welcomeTextMounted;

  const getTableOptions = () => {
    if (!currentPerson) return null;
    const collapsed = type === "mistakeQuestion";
    const showFreq = showFreqCol;
    const showChange = showChangeCol;
    const wrapClass =
      type === "revealFreq"
        ? "data-table-wrap--full"
        : type === "enterChanges"
          ? "data-table-wrap--callout-left"
          : "data-table-wrap--side";

    return {
      person: currentPerson,
      showRf: true,
      showFreq,
      showChange,
      collapsed,
      wrapClass,
    };
  };

  const renderMainStage = () => {
    const tableOpts = getTableOptions();

    return React.createElement(
      "div",
      {
        className: `morph-stage morph-stage--${morphStageMode}`,
        ref: stageRef,
      },
      showWelcomeQuestion &&
        React.createElement(
          "div",
          {
            ref: welcomeSlotRef,
            className: `welcome-question-slot${welcomeTextCollapsed ? " welcome-question-slot--collapsed" : ""}`,
            style: { height: welcomeSlotHeight },
            onTransitionEnd: handleWelcomeSlotTransitionEnd,
          },
          React.createElement("div", {
            className: "welcome-question",
            dangerouslySetInnerHTML: { __html: T.ui.welcomeMessage },
          }),
        ),
      morphGraphVisible &&
        React.createElement(
          "div",
          { className: `morph-graph-slot morph-graph-slot--${graphMorphMode}` },
          type === "intro" ||
          type === "graphRecord" ||
          type === "formula" ||
          type === "revealFreq"
            ? React.createElement(
                "div",
                {
                  className: `morph-dual-graphs${type === "formula" ? " morph-dual-graphs--formula" : ""}${type === "graphRecord" ? " morph-dual-graphs--record" : ""}${type === "revealFreq" ? " morph-dual-graphs--reveal" : ""}`,
                },
                type === "intro"
                  ? T.people.map((p) =>
                      renderGraph(p, {
                        centered: true,
                        morph: true,
                        dualFade: personId && p.id !== personId,
                      }),
                    )
                  : [
                      React.createElement(
                        "div",
                        { key: "pair-graph", className: "pair-graph" },
                        currentPerson &&
                          renderGraph(currentPerson, {
                            centered: true,
                            morph: true,
                          }),
                      ),
                      tableOpts &&
                        React.createElement(
                          "div",
                          {
                            key: "pair-table",
                            className: "morph-pair-table pair-table",
                          },
                          renderTable(tableOpts.person, tableOpts),
                        ),
                      React.createElement(
                        "div",
                        { key: "pair-formula", className: "pair-formula" },
                        type === "formula" && renderFormula(),
                      ),
                    ],
              )
            : currentPerson &&
                renderGraph(currentPerson, { compact: true, morph: true }),
        ),
      React.createElement(
        "div",
        {
          className: [
            "morph-table-area",
            `morph-table-area--${morphStageMode}`,
            morphTableHidden ? "morph-table-area--hidden" : "",
          ]
            .filter(Boolean)
            .join(" "),
        },
        morphTableHidden
          ? null
          : morphStageMode === "callout" && tableOpts
          ? React.createElement(
              "div",
              { className: "morph-table-row" },
              renderTable(tableOpts.person, tableOpts),
              React.createElement(
                "div",
                { className: "callout-column", ref: calloutColumnRef },
                renderNumpadCallout(tableOpts.person),
              ),
            )
          : React.createElement(
              "div",
              { className: "morph-table-inner" },
              tableOpts && renderTable(tableOpts.person, tableOpts),
              type === "mistakeQuestion" &&
                tableOpts &&
                renderQuestion(tableOpts.person),
            ),
      ),
    );
  };

  return React.createElement(
    "div",
    {
      className: `challenge-screen challenge-screen--${type}${isWelcome ? " challenge-screen--welcome" : ""}`,
      ref,
    },
    React.createElement(
      "div",
      { className: "challenge-work-area" },
      renderPromptBanner(),
      renderMainStage(),
    ),
    activeAnimation &&
      activeAnimation.flightX &&
      React.createElement(
        "div",
        {
          className: "flying-element flying-element--trial",
          style: {
            "--start-x": `${activeAnimation.flightX.startX}px`,
            "--start-y": `${activeAnimation.flightX.startY}px`,
            "--end-x": `${activeAnimation.flightX.endX}px`,
            "--end-y": `${activeAnimation.flightX.endY}px`,
          },
        },
        activeAnimation.flightX.text,
      ),
    activeAnimation &&
      activeAnimation.flightY &&
      React.createElement(
        "div",
        {
          className: "flying-element flying-element--rf",
          style: {
            "--start-x": `${activeAnimation.flightY.startX}px`,
            "--start-y": `${activeAnimation.flightY.startY}px`,
            "--end-x": `${activeAnimation.flightY.endX}px`,
            "--end-y": `${activeAnimation.flightY.endY}px`,
          },
        },
        activeAnimation.flightY.text,
      ),
    revealFlight &&
      React.createElement(
        "div",
        {
          className: "flying-element flying-element--reveal",
          style: {
            "--start-x": `${revealFlight.startX}px`,
            "--start-y": `${revealFlight.startY}px`,
            "--end-x": `${revealFlight.endX}px`,
            "--end-y": `${revealFlight.endY}px`,
          },
        },
        revealFlight.text,
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
          dangerouslySetInnerHTML: { __html: formulaFlight.html },
        }
      ),
  );
});
