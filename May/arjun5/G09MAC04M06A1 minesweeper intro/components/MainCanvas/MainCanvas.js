const MainCanvas = (props) => {
  const { step, experimentIndex, initialStage, onSetNextEnabled, onUpdateNavText } = props;
  const { useState, useEffect, useRef, createElement: e } = React;

  const HEADER_MS = 700;
  const BURST_MS = 700;
  const FLY_DELAY_AFTER_BURST_MS = 1000;
  const INTRO_REVEAL_START_MS = 350;
  const cellRefs = useRef({});
  const chipRefs = useRef({});
  const rowHeaderRefs = useRef({});
  const colHeaderRefs = useRef({});
  const tableWrapRef = useRef(null);
  const flyLayerRef = useRef(null);
  const timersRef = useRef([]);

  const [cellState, setCellState] = useState({});
  const [lives, setLives] = useState(3);
  const [lifeStatusText, setLifeStatusText] = useState("");
  const [highlightedKey, setHighlightedKey] = useState(null);
  const [nudgeActive, setNudgeActive] = useState(false);
  const [headerHighlight, setHeaderHighlight] = useState(null);
  const [shake, setShake] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showSubText, setShowSubText] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [foundKeys, setFoundKeys] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  const tutorialExperiment = getExperiment(0);
  const experiment = step === 5 ? getExperiment(experimentIndex) : tutorialExperiment;
  const game = experiment;
  const stepData = APP_DATA.steps[step] || {};

  const cellKey = (row, col) => `${row}-${col}`;
  const cellLabel = (row, col) => `${row}, ${col}`;

  const play = (name) => {
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

  const stateFromCells = (cells, type) => {
    const next = {};
    cells.forEach((cell) => {
      next[cellKey(cell.row, cell.col)] = type;
    });
    return next;
  };

  const isSafeCell = (row, col) => {
    return game.safeOutcomes.some((cell) => cell.row === row && cell.col === col);
  };

  const html = (text) => (typeof handleComma === "function" ? handleComma(text) : text);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    clearTimers();
    setFeedback(null);
    setGameOver(false);
    setHeaderHighlight(null);
    setShake(false);
    setLocked(false);

    const isFinal = initialStage === "final";

    if (step === 1) {
      setCellState({});
      setLives(3);
      setLifeStatusText("");
      setHighlightedKey(null);
      setNudgeActive(false);
      setShowSubText(false);
      setFoundKeys([]);
      later(() => onSetNextEnabled(true), 0);
      return;
    }

    if (step === 2) {
      const key = cellKey(tutorialExperiment.step2Cell.row, tutorialExperiment.step2Cell.col);
      setLives(3);
      setFoundKeys([]);
      if (isFinal) {
        setCellState({ [key]: "safe" });
        setHighlightedKey(null);
        setNudgeActive(false);
        setShowSubText(true);
        setLifeStatusText(APP_DATA.steps[2].livesIntact);
        later(() => {
          onUpdateNavText(APP_DATA.steps[2].navTextDone);
          onSetNextEnabled(true);
        }, 0);
      } else {
        setCellState({});
        setHighlightedKey(key);
        setNudgeActive(true);
        setShowSubText(false);
        setLifeStatusText("");
        later(() => {
          onUpdateNavText(APP_DATA.steps[2].navText);
          onSetNextEnabled(false);
        }, 0);
      }
      return;
    }

    if (step === 3) {
      const safeKey = cellKey(tutorialExperiment.step2Cell.row, tutorialExperiment.step2Cell.col);
      const mineKey = cellKey(tutorialExperiment.step3Cell.row, tutorialExperiment.step3Cell.col);
      setShowSubText(true);
      setFoundKeys([]);
      if (isFinal) {
        setCellState({ [safeKey]: "safe", [mineKey]: "mine" });
        setLives(2);
        setHighlightedKey(null);
        setNudgeActive(false);
        setLifeStatusText(APP_DATA.steps[3].lifeLost);
        later(() => {
          onUpdateNavText(APP_DATA.steps[3].navTextDone);
          onSetNextEnabled(true);
        }, 0);
      } else {
        setCellState({ [safeKey]: "safe" });
        setLives(3);
        setHighlightedKey(mineKey);
        setNudgeActive(true);
        setLifeStatusText("");
        later(() => {
          onUpdateNavText(APP_DATA.steps[3].navText);
          onSetNextEnabled(false);
        }, 0);
      }
      return;
    }

    if (step === 5) {
      const intro = stateFromCells(game.introRevealed, "safe");
      const preFound = game.safeOutcomes
        .filter((safe) =>
          game.introRevealed.some((cell) => cell.row === safe.row && cell.col === safe.col),
        )
        .map((cell) => cellKey(cell.row, cell.col));
      setLifeStatusText("");
      setHighlightedKey(null);
      setNudgeActive(false);
      setShowSubText(false);
      if (isFinal) {
        const complete = { ...intro, ...stateFromCells(game.safeOutcomes, "safe") };
        setCellState(complete);
        setLives(3);
        setFoundKeys(game.safeOutcomes.map((cell) => cellKey(cell.row, cell.col)));
        setShowWarning(false);
        setFeedback({ type: "correct", html: APP_DATA.steps[5].feedback.foundAll });
        later(() => {
          onUpdateNavText(experiment.navTextDone);
          onSetNextEnabled(true);
        }, 0);
      } else {
        setCellState({});
        setLives(3);
        setFoundKeys(preFound);
        setShowWarning(false);
        setLocked(true);
        later(() => {
          onUpdateNavText(APP_DATA.steps[5].navText);
          onSetNextEnabled(false);
        }, 0);

        later(() => {
          play("tick");
          setCellState(intro);
          setShowWarning(true);
          setLocked(false);
        }, INTRO_REVEAL_START_MS);
      }
    }
  }, [step, initialStage, experimentIndex]);

  const completeStep2 = () => {
    setShowSubText(true);
    setLifeStatusText(APP_DATA.steps[2].livesIntact);
    setHighlightedKey(null);
    setNudgeActive(false);
    onUpdateNavText(APP_DATA.steps[2].navTextDone);
    onSetNextEnabled(true);
  };

  const completeStep3 = () => {
    setShowSubText(true);
    setLifeStatusText(APP_DATA.steps[3].lifeLost);
    setHighlightedKey(null);
    setNudgeActive(false);
    onUpdateNavText(APP_DATA.steps[3].navTextDone);
    onSetNextEnabled(true);
  };

  const getClickableKeys = () => {
    if (locked || gameOver) return [];
    if (step === 2 && highlightedKey && !cellState[highlightedKey]) return [highlightedKey];
    if (step === 3 && highlightedKey && !cellState[highlightedKey]) return [highlightedKey];
    if (step === 5) {
      if (countSafeFound(foundKeys) >= game.safeOutcomes.length) return [];
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

  const countSafeFound = (keys) =>
    game.safeOutcomes.filter((cell) => keys.indexOf(cellKey(cell.row, cell.col)) !== -1).length;

  const showCorrectFeedback = (count) => {
    const messages = APP_DATA.steps[5].feedback;
    const total = game.safeOutcomes.length;
    if (count >= total) return messages.foundAll;
    if (count === total - 1) {
      if (count === 5) return messages.foundFive;
      return messages.foundThree;
    }
    if (count === 4) return messages.foundFour;
    if (count === 3 && total > 4) {
      return messages.foundTwo.replace("2 ", "3 ");
    }
    if (count === 3) return messages.foundThree;
    if (count === 2) return messages.foundTwo;
    return messages.foundOne;
  };

  const showGameOverFeedback = (count) => {
    const messages = APP_DATA.steps[5].feedback;
    if (count <= 0) return messages.gameOverZero;
    if (count === 1) return messages.gameOverOne;
    if (count === 2) return messages.gameOverTwo;
    if (count === 3) return messages.gameOverThree;
    if (count === 4) return messages.gameOverFour;
    return messages.gameOverFive;
  };

  const flySafeChips = (alreadyFound, onDone) => {
    const remaining = game.safeOutcomes.filter((cell) => alreadyFound.indexOf(cellKey(cell.row, cell.col)) === -1);
    const flyNext = (index) => {
      if (index >= remaining.length) {
        if (onDone) onDone();
        return;
      }
      const cell = remaining[index];
      const key = cellKey(cell.row, cell.col);
      const source = chipRefs.current[key];
      const dest = cellRefs.current[key];
      if (!source || !dest || typeof gsap === "undefined") {
        setFoundKeys((prev) => (prev.indexOf(key) === -1 ? prev.concat(key) : prev));
        setCellState((prev) => ({ ...prev, [key]: "safe" }));
        later(() => flyNext(index + 1), 180);
        return;
      }

      const from = source.getBoundingClientRect();
      const to = dest.getBoundingClientRect();
      const clone = source.cloneNode(true);
      clone.classList.add("flying-safe-clone");
      clone.style.position = "fixed";
      clone.style.left = `${from.left}px`;
      clone.style.top = `${from.top}px`;
      clone.style.width = `${from.width}px`;
      clone.style.height = `${from.height}px`;
      clone.style.margin = "0";
      clone.style.zIndex = "20000";
      clone.style.pointerEvents = "none";
      document.body.appendChild(clone);
      setFoundKeys((prev) => (prev.indexOf(key) === -1 ? prev.concat(key) : prev));

      gsap.to(clone, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        duration: 0.65,
        ease: "power2.inOut",
        onComplete: () => {
          clone.remove();
          setCellState((prev) => ({ ...prev, [key]: "safe" }));
          later(() => flyNext(index + 1), 220);
        },
      });
    };
    flyNext(0);
  };

  const finishGameOver = (found, nextLives) => {
    setGameOver(true);
    setLocked(true);
    setLives(nextLives);
    setShowWarning(false);
    setFeedback({ type: "wrong", html: showGameOverFeedback(countSafeFound(found)) });
    play("gameover");
    later(() => {
      flySafeChips(found, () => {
        onUpdateNavText(experiment.navTextDone);
        onSetNextEnabled(true);
      });
    }, BURST_MS + FLY_DELAY_AFTER_BURST_MS);
  };

  const revealAfterHeader = (row, col, type) => {
    const key = cellKey(row, col);
    setHeaderHighlight(null);
    setCellState((prev) => ({ ...prev, [key]: type }));

    if (step === 2) {
      play("correct");
      setLocked(false);
      completeStep2();
      return;
    }

    if (step === 3) {
      play("bomb");
      setShake(true);
      setLives(2);
      later(() => setShake(false), 450);
      setLocked(false);
      completeStep3();
      return;
    }

    if (step !== 5) {
      setLocked(false);
      return;
    }

    if (type === "safe") {
      play("correct");
      const nextFound = foundKeys.indexOf(key) === -1 ? foundKeys.concat(key) : foundKeys;
      setFoundKeys(nextFound);
      const count = countSafeFound(nextFound);
      setShowWarning(false);
      setFeedback({ type: "correct", html: showCorrectFeedback(count) });
      setLocked(false);
      if (count >= game.safeOutcomes.length) {
        onUpdateNavText(experiment.navTextDone);
        onSetNextEnabled(true);
      }
      return;
    }

    play("bomb");
    setShake(true);
    later(() => setShake(false), 450);
    const nextLives = Math.max(0, lives - 1);
    setLives(nextLives);
    if (nextLives <= 0) {
      finishGameOver(foundKeys, nextLives);
      return;
    }
    setShowWarning(false);
    setFeedback({ type: "wrong", html: APP_DATA.steps[5].feedback.mine });
    setLocked(false);
  };

  const handleCellClick = (row, col) => {
    const key = cellKey(row, col);
    if (locked || gameOver || cellState[key]) return;
    if (getClickableKeys().indexOf(key) === -1) return;

    play("tick");
    setNudgeActive(false);
    setFeedback(null);
    setLocked(true);

    if (step === 5) {
      setHeaderHighlight({ row, col });
      later(() => {
        revealAfterHeader(row, col, isSafeCell(row, col) ? "safe" : "mine");
      }, HEADER_MS);
      return;
    }

    later(() => {
      const type = step === 3 ? "mine" : "safe";
      revealAfterHeader(row, col, type);
    }, step === 2 || step === 3 ? 80 : HEADER_MS);
  };

  const renderSafeChip = (cell) => {
    const key = cellKey(cell.row, cell.col);
    const found = foundKeys.indexOf(key) !== -1;
    return e(
      "div",
      {
        className: `safe-chip${found ? " found" : ""}`,
        key,
        ref: (node) => {
          chipRefs.current[key] = node;
        },
      },
      e("span", { className: "safe-chip-label" }, createOutcomeLabel(e, cell.row, cell.col)),
    );
  };

  const renderRightPanel = () => {
    if (step === 1) {
      return e("p", {
        className: "rt-body",
        dangerouslySetInnerHTML: { __html: html(stepData.rightText) },
      });
    }

    if (step === 2 || step === 3) {
      return e(
        "div",
        { className: "rt-stack" },
        e("div", {
          className: "rt-orange-box",
          dangerouslySetInnerHTML: { __html: html(stepData.boxedText) },
        }),
        showSubText
          ? e("p", {
            className: "rt-subtext",
            dangerouslySetInnerHTML: { __html: html(stepData.subText) },
          })
          : null,
      );
    }

    if (step === 5) {
      return e(
        "div",
        { className: "rt-stack step5-stack" },
        e(
          "div",
          { className: "rt-orange-box safe-box" },
          e("div", {
            className: "safe-box-title",
            dangerouslySetInnerHTML: { __html: html(stepData.boxedText) },
          }),
          e("div", {
            className: `safe-chip-row${
              game.safeOutcomes.length === 6
                ? " many-chips chips-6"
                : game.safeOutcomes.length > 4
                  ? " many-chips"
                  : ""
            }`,
          }, game.safeOutcomes.map(renderSafeChip)),
        ),
        showWarning
          ? e("p", {
            className: "rt-warning",
            dangerouslySetInnerHTML: { __html: html(stepData.warningText) },
          })
          : null,
        e(
          "div",
          {
            className: `rt-feedback${feedback ? " visible" : ""}${feedback && feedback.type === "wrong" ? " wrong" : ""}${feedback && feedback.type === "correct" ? " correct" : ""}`,
          },
          feedback
            ? e("div", { dangerouslySetInnerHTML: { __html: html(feedback.html) } })
            : null,
        ),
      );
    }

    return null;
  };

  const renderGameRow = (options = {}) => {
    return e(GameRow, {
      cellState,
      clickableKeys: options.clickableKeys || getClickableKeys(),
      highlightedKey: options.highlightedKey !== undefined ? options.highlightedKey : highlightedKey,
      showNudge: options.showNudge !== undefined ? options.showNudge : nudgeActive,
      onNudgeDismiss: () => setNudgeActive(false),
      showLives: options.showLives !== false && step !== 1,
      lives,
      maxLives: 3,
      lifeStatusText,
      showGameOver: gameOver,
      headerHighlight,
      shake,
      locked,
      compact: !!options.compact,
      caption: options.caption || "",
      onCellClick: handleCellClick,
      cellRefs,
      rowHeaderRefs,
      colHeaderRefs,
      tableWrapRef,
      table: experiment.table,
      cornerImages: experiment.cornerImages,
    });
  };

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
    e("div", { className: "fly-layer", ref: flyLayerRef }),
  );
};
