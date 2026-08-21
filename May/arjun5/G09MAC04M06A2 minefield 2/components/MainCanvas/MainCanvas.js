const MainCanvas = (props) => {
  const { step, experimentIndex, initialStage, onSetNextEnabled, onUpdateNavText } = props;
  const { useState, useEffect, useRef, createElement: e } = React;

  const HEADER_MS = 700;
  const OVERLAY_MS = 0.55;
  const cellRefs = useRef({});
  const rowHeaderRefs = useRef({});
  const colHeaderRefs = useRef({});
  const tableWrapRef = useRef(null);
  const overlayLayerRef = useRef(null);
  const yellowBoxRefs = useRef({});
  const actionBtnRef = useRef(null);
  const timersRef = useRef([]);
  const phaseRef = useRef("idle");
  const foundKeysRef = useRef([]);
  const livesRef = useRef(3);

  const [cellState, setCellState] = useState({});
  const [lives, setLives] = useState(3);
  const [lifeStatusText, setLifeStatusText] = useState("");
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [nudgeActive, setNudgeActive] = useState(false);
  const [headerHighlight, setHeaderHighlight] = useState(null);
  const [glowingCols, setGlowingCols] = useState([]);
  const [glowingRows, setGlowingRows] = useState([]);
  const [shake, setShake] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showSubText, setShowSubText] = useState(false);
  const [subTextHtml, setSubTextHtml] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [foundKeys, setFoundKeys] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [overlays, setOverlays] = useState([]);
  const [yellowBoxes, setYellowBoxes] = useState([]);
  const [yellowNudgeKey, setYellowNudgeKey] = useState(null);
  const [actionBtn, setActionBtn] = useState(null);
  const [actionNudge, setActionNudge] = useState(false);
  const [phase, setPhase] = useState("idle");

  const tutorialExperiment = getExperiment(0);
  const experiment = step === 5 ? getExperiment(experimentIndex || 0) : tutorialExperiment;
  const teach = tutorialExperiment.teach;
  const play = experiment.play;
  const stepData = APP_DATA.steps[step] || {};
  const safeOutcomes = step === 5 ? play.safeOutcomes : teach.safeOutcomes;

  const cellKey = (row, col) => `${row}-${col}`;
  const cellLabel = (row, col) => `${row}, ${col}`;

  const playSoundName = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const html = (text) => (typeof handleComma === "function" ? handleComma(text) : text);

  const fillTemplate = (template, map) => {
    let out = template || "";
    Object.keys(map).forEach((key) => {
      out = out.split(`{${key}}`).join(String(map[key]));
    });
    return out;
  };

  const isSafeCell = (row, col, list = safeOutcomes) =>
    list.some((cell) => cell.row === row && cell.col === col);

  const countSafeFound = (keys, list = safeOutcomes) =>
    list.filter((cell) => keys.indexOf(cellKey(cell.row, cell.col)) !== -1).length;

  const setPhaseSafe = (next) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const getBaseRect = () => {
    const base = overlayLayerRef.current;
    if (!base) return null;
    return base.getBoundingClientRect();
  };

  const relRect = (el) => {
    const base = getBaseRect();
    if (!base || !el) return null;
    const r = el.getBoundingClientRect();
    return {
      left: r.left - base.left,
      top: r.top - base.top,
      width: r.width,
      height: r.height,
    };
  };

  const getColumnOverlayRect = (col) => {
    const header = colHeaderRefs.current[col];
    const rows = experiment.table.rowItems;
    const lastCell = cellRefs.current[cellKey(rows[rows.length - 1], col)];
    const a = relRect(header);
    const b = relRect(lastCell);
    if (!a || !b) return null;
    return {
      left: a.left,
      top: a.top,
      width: a.width,
      height: b.top + b.height - a.top,
    };
  };

  const getRowOverlayRect = (row) => {
    const header = rowHeaderRefs.current[String(row)];
    const cols = experiment.table.columnItems;
    const lastCell = cellRefs.current[cellKey(row, cols[cols.length - 1])];
    const a = relRect(header);
    const b = relRect(lastCell);
    if (!a || !b) return null;
    return {
      left: a.left,
      top: a.top,
      height: a.height,
      width: b.left + b.width - a.left,
    };
  };

  const getCellBoxRect = (row, col) => {
    const cell = cellRefs.current[cellKey(row, col)];
    const r = relRect(cell);
    if (!r) return null;
    const pad = 1;
    return {
      left: r.left - pad,
      top: r.top - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    };
  };

  const animateOverlay = (overlay, onDone) => {
    later(() => {
      const node = overlayLayerRef.current
        ? overlayLayerRef.current.querySelector(`[data-overlay-id="${overlay.id}"]`)
        : null;
      playSoundName("fill");
      if (!node || typeof gsap === "undefined") {
        setOverlays((prev) =>
          prev.map((item) => (item.id === overlay.id ? { ...item, grown: true } : item)),
        );
        if (onDone) onDone();
        return;
      }

      const from =
        overlay.type === "col"
          ? { scaleY: 0, transformOrigin: "top center" }
          : { scaleX: 0, transformOrigin: "left center" };
      const to =
        overlay.type === "col"
          ? { scaleY: 1, transformOrigin: "top center" }
          : { scaleX: 1, transformOrigin: "left center" };

      gsap.fromTo(node, from, {
        ...to,
        duration: OVERLAY_MS,
        ease: "power2.out",
        onComplete: () => {
          setOverlays((prev) =>
            prev.map((item) => (item.id === overlay.id ? { ...item, grown: true } : item)),
          );
          if (onDone) onDone();
        },
      });
    }, 30);
  };

  const addColumnOverlay = (col, onDone) => {
    const rect = getColumnOverlayRect(col);
    if (!rect) {
      if (onDone) onDone();
      return;
    }
    const overlay = {
      id: `col-${col}`,
      type: "col",
      ...rect,
      grown: false,
    };
    setOverlays((prev) => prev.concat(overlay));
    animateOverlay(overlay, () => {
      setGlowingCols((prev) => (prev.indexOf(col) === -1 ? prev.concat(col) : prev));
      if (onDone) onDone();
    });
  };

  const addRowOverlay = (row, onDone) => {
    const rect = getRowOverlayRect(row);
    if (!rect) {
      if (onDone) onDone();
      return;
    }
    const overlay = {
      id: `row-${row}`,
      type: "row",
      ...rect,
      grown: false,
    };
    setOverlays((prev) => prev.concat(overlay));
    animateOverlay(overlay, () => {
      setGlowingRows((prev) =>
        prev.some((r) => String(r) === String(row)) ? prev : prev.concat(row),
      );
      if (onDone) onDone();
    });
  };

  const addRowOverlaysSequential = (rows, index, onDone) => {
    if (index >= rows.length) {
      if (onDone) onDone();
      return;
    }
    addRowOverlay(rows[index], () => {
      later(() => addRowOverlaysSequential(rows, index + 1, onDone), 120);
    });
  };

  const addColumnOverlaysSequential = (cols, index, onDone) => {
    if (index >= cols.length) {
      if (onDone) onDone();
      return;
    }
    addColumnOverlay(cols[index], () => {
      later(() => addColumnOverlaysSequential(cols, index + 1, onDone), 120);
    });
  };

  const buildYellowBoxes = (cells) => {
    const boxes = [];
    cells.forEach((cell) => {
      const rect = getCellBoxRect(cell.row, cell.col);
      if (!rect) return;
      boxes.push({
        key: cellKey(cell.row, cell.col),
        row: cell.row,
        col: cell.col,
        ...rect,
      });
    });
    return boxes;
  };

  const renderOrangeBox = (eventText) =>
    e(
      "div",
      { className: "rt-orange-box event-box" },
      e("div", {
        className: "event-box-title",
        dangerouslySetInnerHTML: { __html: html(stepData.boxedTitle) },
      }),
      e("div", {
        className: "event-box-label",
        dangerouslySetInnerHTML: { __html: html(stepData.boxedLabel) },
      }),
      e("div", {
        className: "event-box-event",
        dangerouslySetInnerHTML: { __html: html(eventText) },
      }),
    );

  const resetVisualState = () => {
    setCellState({});
    setLives(3);
    livesRef.current = 3;
    setLifeStatusText("");
    setHighlightedKey(null);
    setNudgeActive(false);
    setHeaderHighlight(null);
    setGlowingCols([]);
    setGlowingRows([]);
    setShake(false);
    setLocked(false);
    setShowSubText(false);
    setSubTextHtml("");
    setFeedback(null);
    setGameOver(false);
    setFoundKeys([]);
    foundKeysRef.current = [];
    setShowWarning(false);
    setOverlays([]);
    setYellowBoxes([]);
    setYellowNudgeKey(null);
    setActionBtn(null);
    setActionNudge(false);
    setPhaseSafe("idle");
    yellowBoxRefs.current = {};
  };

  const restoreTeachFinal = () => {
    const cols = teach.selectCols;
    const rows = teach.selectRows;
    const safeState = {};
    teach.safeOutcomes.forEach((cell) => {
      safeState[cellKey(cell.row, cell.col)] = "safe";
    });
    const mine = teach.demoMine;
    safeState[cellKey(mine.row, mine.col)] = "mine";

    setCellState(safeState);
    setLives(2);
    livesRef.current = 2;
    setGlowingCols(cols.slice());
    setGlowingRows(rows.slice());
    setLifeStatusText(APP_DATA.steps[3].lifeLost);
    setFeedback({
      type: "wrong",
      html: fillTemplate(APP_DATA.steps[3].mineFeedback, {
        outcome: cellLabel(mine.row, mine.col),
      }),
    });
    setShowSubText(true);
    setSubTextHtml(APP_DATA.steps[3].overlapHint);
    setFoundKeys(teach.safeOutcomes.map((c) => cellKey(c.row, c.col)));
    foundKeysRef.current = teach.safeOutcomes.map((c) => cellKey(c.row, c.col));
    setPhaseSafe("done");
    setLocked(true);

    later(() => {
      const colOverlays = cols
        .map((col) => {
          const rect = getColumnOverlayRect(col);
          if (!rect) return null;
          return {
            id: `col-${col}`,
            type: "col",
            ...rect,
            grown: true,
          };
        })
        .filter(Boolean);
      const rowOverlays = rows
        .map((row) => {
          const rect = getRowOverlayRect(row);
          if (!rect) return null;
          return {
            id: `row-${row}`,
            type: "row",
            ...rect,
            grown: true,
          };
        })
        .filter(Boolean);
      setOverlays(colOverlays.concat(rowOverlays));
      onUpdateNavText(APP_DATA.steps[3].navTextDone);
      onSetNextEnabled(true);
    }, 40);
  };

  const restorePlayFinal = () => {
    const complete = {};
    play.safeOutcomes.forEach((cell) => {
      complete[cellKey(cell.row, cell.col)] = "safe";
    });
    setCellState(complete);
    setLives(3);
    livesRef.current = 3;
    setFoundKeys(play.safeOutcomes.map((c) => cellKey(c.row, c.col)));
    foundKeysRef.current = play.safeOutcomes.map((c) => cellKey(c.row, c.col));
    setGlowingCols(play.selectCols.slice());
    setGlowingRows(play.selectRows.slice());
    setShowWarning(false);
    setShowSubText(true);
    setSubTextHtml(APP_DATA.steps[5].allFound);
    setFeedback({
      type: "correct",
      html: fillTemplate(play.matchFeedback, {
        outcome: cellLabel(
          play.safeOutcomes[play.safeOutcomes.length - 1].row,
          play.safeOutcomes[play.safeOutcomes.length - 1].col,
        ),
      }),
    });
    setPhaseSafe("playDone");
    setLocked(true);
    later(() => {
      onUpdateNavText(experiment.navTextDone);
      onSetNextEnabled(true);
    }, 0);
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    clearTimers();
    resetVisualState();
    const isFinal = initialStage === "final";

    if (step === 1) {
      later(() => onSetNextEnabled(true), 0);
      return;
    }

    if (step === 2) {
      setShowWarning(true);
      later(() => {
        onUpdateNavText(APP_DATA.steps[2].navText);
        onSetNextEnabled(true);
      }, 0);
      return;
    }

    if (step === 3) {
      if (isFinal) {
        later(() => restoreTeachFinal(), 60);
        return;
      }
      setPhaseSafe("selectTails");
      setActionBtn({
        label: APP_DATA.steps[3].btnSelectTails,
        kind: "selectTails",
      });
      setActionNudge(true);
      later(() => {
        onUpdateNavText(APP_DATA.steps[3].navText);
        onSetNextEnabled(false);
      }, 0);
      return;
    }

    if (step === 5) {
      if (isFinal) {
        later(() => restorePlayFinal(), 0);
        return;
      }
      setShowWarning(true);
      setPhaseSafe("play");
      later(() => {
        onUpdateNavText(APP_DATA.steps[5].navText);
        onSetNextEnabled(false);
      }, 0);
    }
  }, [step, initialStage, experimentIndex]);

  useEffect(() => {
    foundKeysRef.current = foundKeys;
  }, [foundKeys]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  const startSelectOdds = () => {
    setPhaseSafe("selectOdds");
    setActionBtn({
      label: APP_DATA.steps[3].btnSelectOdds,
      kind: "selectOdds",
    });
    setActionNudge(true);
    onUpdateNavText(APP_DATA.steps[3].navSelectOdds);
  };

  const startSelectOverlaps = () => {
    setPhaseSafe("selectOverlaps");
    setActionBtn({
      label: APP_DATA.steps[3].btnSelectOverlaps,
      kind: "selectOverlaps",
    });
    setActionNudge(true);
    onUpdateNavText(APP_DATA.steps[3].navSelectOverlaps);
  };

  const handleActionClick = () => {
    if (!actionBtn || locked) return;
    playSoundName("click");
    setActionNudge(false);
    setLocked(true);

    if (actionBtn.kind === "selectTails") {
      setActionBtn(null);
      setPhaseSafe("animatingCol");
      addColumnOverlaysSequential(teach.selectCols, 0, () => {
        setLocked(false);
        startSelectOdds();
      });
      return;
    }

    if (actionBtn.kind === "selectOdds") {
      setActionBtn(null);
      setPhaseSafe("animatingRows");
      addRowOverlaysSequential(teach.selectRows, 0, () => {
        setLocked(false);
        startSelectOverlaps();
      });
      return;
    }

    if (actionBtn.kind === "selectOverlaps") {
      setActionBtn(null);
      later(() => {
        const boxes = buildYellowBoxes(teach.safeOutcomes);
        setYellowBoxes(boxes);
        setPhaseSafe("tapOverlaps");
        setActionNudge(false);
        later(() => {
          if (boxes[0]) setYellowNudgeKey(boxes[0].key);
          setLocked(false);
          onUpdateNavText(APP_DATA.steps[3].navTapHighlights);
        }, 40);
      }, 80);
    }
  };

  const revealTeachSafe = (row, col) => {
    const key = cellKey(row, col);
    if (foundKeysRef.current.indexOf(key) !== -1 || phaseRef.current !== "tapOverlaps") return;
    if (!isSafeCell(row, col, teach.safeOutcomes)) return;

    playSoundName("correct");
    setYellowBoxes((prev) => prev.filter((box) => box.key !== key));
    setYellowNudgeKey(null);
    setCellState((prev) => ({ ...prev, [key]: "safe" }));
    const nextFound = foundKeysRef.current.concat(key);
    foundKeysRef.current = nextFound;
    setFoundKeys(nextFound);
    setFeedback({
      type: "correct",
      html: fillTemplate(APP_DATA.steps[3].matchFeedback, {
        outcome: cellLabel(row, col),
      }),
    });

    const remaining = teach.safeOutcomes.filter(
      (cell) => nextFound.indexOf(cellKey(cell.row, cell.col)) === -1,
    );

    if (remaining.length === 0) {
      setShowSubText(true);
      setSubTextHtml(APP_DATA.steps[3].allFound);
      setLifeStatusText(APP_DATA.steps[3].livesIntact);
      setPhaseSafe("tapMine");
      onUpdateNavText(APP_DATA.steps[3].navTapMine);
      return;
    }

    later(() => {
      const nextKey = cellKey(remaining[0].row, remaining[0].col);
      setYellowNudgeKey(nextKey);
    }, 200);
  };

  const finishTeachMine = (row, col) => {
    playSoundName("bomb");
    setShake(true);
    later(() => setShake(false), 450);
    setLives(2);
    livesRef.current = 2;
    setCellState((prev) => ({ ...prev, [cellKey(row, col)]: "mine" }));
    setFeedback({
      type: "wrong",
      html: fillTemplate(APP_DATA.steps[3].mineFeedback, {
        outcome: cellLabel(row, col),
      }),
    });
    setShowSubText(true);
    setSubTextHtml(APP_DATA.steps[3].overlapHint);
    setLifeStatusText(APP_DATA.steps[3].lifeLost);
    setPhaseSafe("done");
    setLocked(true);
    onUpdateNavText(APP_DATA.steps[3].navTextDone);
    onSetNextEnabled(true);
  };

  const runGameOverReveal = (alreadyFound) => {
    setFeedback(null);
    setShowSubText(false);
    setSubTextHtml("");
    setHeaderHighlight(null);
    setPhaseSafe("autoReveal");

    const cols = play.selectCols;
    const rows = play.selectRows;

    addColumnOverlaysSequential(cols, 0, () => {
      addRowOverlaysSequential(rows, 0, () => {
        const boxes = buildYellowBoxes(play.safeOutcomes);
        setYellowBoxes(boxes);
        later(() => {
          const remaining = play.safeOutcomes.filter(
            (cell) => alreadyFound.indexOf(cellKey(cell.row, cell.col)) === -1,
          );
          remaining.forEach((cell, index) => {
            later(() => {
              const key = cellKey(cell.row, cell.col);
              setCellState((prev) => ({ ...prev, [key]: "safe" }));
              setFoundKeys((prev) => (prev.indexOf(key) === -1 ? prev.concat(key) : prev));
              if (index === remaining.length - 1) {
                later(() => {
                  setYellowBoxes([]);
                  setShowSubText(true);
                  setSubTextHtml(play.revealSummary);
                  onUpdateNavText(experiment.navTextDone);
                  onSetNextEnabled(true);
                  setPhaseSafe("playDone");
                }, 350);
              }
            }, index * 280);
          });
          if (remaining.length === 0) {
            later(() => {
              setYellowBoxes([]);
              setShowSubText(true);
              setSubTextHtml(play.revealSummary);
              onUpdateNavText(experiment.navTextDone);
              onSetNextEnabled(true);
              setPhaseSafe("playDone");
            }, 350);
          }
        }, 350);
      });
    });
  };

  const revealPlayCell = (row, col, type) => {
    const key = cellKey(row, col);
    setCellState((prev) => ({ ...prev, [key]: type }));

    if (type === "safe") {
      setHeaderHighlight(null);
      playSoundName("correct");
      const nextFound =
        foundKeysRef.current.indexOf(key) === -1
          ? foundKeysRef.current.concat(key)
          : foundKeysRef.current;
      foundKeysRef.current = nextFound;
      setFoundKeys(nextFound);
      setShowWarning(false);
      setFeedback({
        type: "correct",
        html: fillTemplate(play.matchFeedback, {
          outcome: cellLabel(row, col),
        }),
      });
      setShowSubText(false);
      setSubTextHtml("");
      setLocked(false);
      const count = countSafeFound(nextFound, play.safeOutcomes);
      if (count >= play.safeOutcomes.length) {
        setShowSubText(true);
        setSubTextHtml(APP_DATA.steps[5].allFound);
        setGlowingCols(play.selectCols.slice());
        setGlowingRows(play.selectRows.slice());
        onUpdateNavText(experiment.navTextDone);
        onSetNextEnabled(true);
        setPhaseSafe("playDone");
        setLocked(true);
      }
      return;
    }

    playSoundName("bomb");
    setShake(true);
    later(() => setShake(false), 450);
    const nextLives = Math.max(0, livesRef.current - 1);
    setLives(nextLives);
    livesRef.current = nextLives;
    setShowWarning(false);
    setFeedback({
      type: "wrong",
      html: fillTemplate(play.mineFeedback, {
        outcome: cellLabel(row, col),
      }),
    });
    setShowSubText(false);
    setSubTextHtml("");

    if (nextLives <= 0) {
      setShowSubText(true);
      setSubTextHtml(
        fillTemplate(APP_DATA.steps[5].gameOverFound, {
          found: countSafeFound(foundKeysRef.current, play.safeOutcomes),
          total: play.safeOutcomes.length,
        }),
      );
      setGameOver(true);
      setLocked(true);
      playSoundName("gameover");
      later(() => runGameOverReveal(foundKeysRef.current.slice()), 900);
      return;
    }
    setLocked(false);
  };

  const handleCellClick = (row, col) => {
    const key = cellKey(row, col);
    if (locked || gameOver || cellState[key]) return;

    if (step === 3 && phaseRef.current === "tapMine") {
      if (isSafeCell(row, col, teach.safeOutcomes)) return;
      if (cellState[key]) return;
      playSoundName("tick");
      setFeedback(null);
      setShowSubText(false);
      setSubTextHtml("");
      setLifeStatusText("");
      setLocked(true);
      later(() => finishTeachMine(row, col), 80);
      return;
    }

    if (step === 5 && phaseRef.current === "play") {
      playSoundName("tick");
      setFeedback(null);
      setShowSubText(false);
      setSubTextHtml("");
      setLocked(true);
      setHeaderHighlight({ row, col });
      later(() => {
        revealPlayCell(row, col, isSafeCell(row, col, play.safeOutcomes) ? "safe" : "mine");
      }, HEADER_MS);
    }
  };

  const handleYellowBoxClick = (row, col) => {
    if (step !== 3 || phaseRef.current !== "tapOverlaps") return;
    revealTeachSafe(row, col);
  };

  const getClickableKeys = () => {
    if (locked || gameOver) return [];
    if (step === 3 && phase === "tapMine") {
      const keys = [];
      experiment.table.rowItems.forEach((row) => {
        experiment.table.columnItems.forEach((col) => {
          const key = cellKey(row, col);
          if (!cellState[key] && !isSafeCell(row, col, teach.safeOutcomes)) keys.push(key);
        });
      });
      return keys;
    }
    if (step === 5 && phase === "play") {
      const keys = [];
      experiment.table.rowItems.forEach((row) => {
        experiment.table.columnItems.forEach((col) => {
          const key = cellKey(row, col);
          if (!cellState[key]) keys.push(key);
        });
      });
      return keys;
    }
    return [];
  };

  const renderRightPanel = () => {
    if (step === 1) {
      return e("p", {
        className: "rt-body",
        dangerouslySetInnerHTML: { __html: html(stepData.rightText) },
      });
    }

    if (step === 2) {
      return e(
        "div",
        { className: "rt-stack" },
        renderOrangeBox(teach.eventText),
        showWarning
          ? e("p", {
              className: "rt-warning",
              dangerouslySetInnerHTML: { __html: html(stepData.warningText) },
            })
          : null,
      );
    }

    if (step === 3) {
      return e(
        "div",
        { className: "rt-stack step3-stack" },
        renderOrangeBox(teach.eventText),
        actionBtn
          ? e(
              "button",
              {
                type: "button",
                className: "btn action-btn",
                ref: actionBtnRef,
                onClick: handleActionClick,
                dangerouslySetInnerHTML: { __html: html(actionBtn.label) },
              },
            )
          : null,
        e(
          "div",
          {
            className: `rt-feedback${feedback ? " visible" : ""}${
              feedback && feedback.type === "wrong" ? " wrong" : ""
            }${feedback && feedback.type === "correct" ? " correct" : ""}`,
          },
          feedback
            ? e("div", { dangerouslySetInnerHTML: { __html: html(feedback.html) } })
            : null,
        ),
        showSubText
          ? e("p", {
              className: "rt-subtext",
              dangerouslySetInnerHTML: { __html: html(subTextHtml) },
            })
          : null,
        e(Nudge, {
          targetRef: actionBtnRef,
          active: !!actionBtn && actionNudge,
          onDismiss: () => setActionNudge(false),
        }),
      );
    }

    if (step === 5) {
      return e(
        "div",
        { className: "rt-stack step5-stack" },
        renderOrangeBox(play.eventText),
        showWarning
          ? e("p", {
              className: "rt-warning",
              dangerouslySetInnerHTML: { __html: html(stepData.warningText) },
            })
          : null,
        e(
          "div",
          {
            className: `rt-feedback${feedback ? " visible" : ""}${
              feedback && feedback.type === "wrong" ? " wrong" : ""
            }${feedback && feedback.type === "correct" ? " correct" : ""}`,
          },
          feedback
            ? e("div", { dangerouslySetInnerHTML: { __html: html(feedback.html) } })
            : null,
        ),
        showSubText
          ? e("p", {
              className: "rt-subtext",
              dangerouslySetInnerHTML: { __html: html(subTextHtml) },
            })
          : null,
      );
    }

    return null;
  };

  const renderGameRow = () =>
    e(GameRow, {
      cellState,
      clickableKeys: getClickableKeys(),
      highlightedKey,
      showNudge: nudgeActive,
      onNudgeDismiss: () => setNudgeActive(false),
      showLives: step !== 1,
      lives,
      maxLives: 3,
      lifeStatusText,
      showGameOver: gameOver,
      headerHighlight,
      glowingCols,
      glowingRows,
      shake,
      locked,
      onCellClick: handleCellClick,
      cellRefs,
      rowHeaderRefs,
      colHeaderRefs,
      tableWrapRef,
      overlayLayerRef,
      yellowBoxRefs,
      overlays,
      yellowBoxes,
      onYellowBoxClick: handleYellowBoxClick,
      yellowNudgeKey,
      table: experiment.table,
      cornerImages: experiment.cornerImages,
    });

  return e(
    "div",
    { className: "main-canvas-container" },
    e(
      "div",
      { className: "visual-panel" },
      e("div", {
        className: "title-row",
        dangerouslySetInnerHTML: { __html: experiment.visualTitle },
      }),
      e("div", { className: "game-row-shell" }, renderGameRow()),
    ),
    e("div", { className: "text-panel" }, renderRightPanel()),
  );
};
