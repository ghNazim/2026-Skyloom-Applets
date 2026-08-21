const GameRow = (props) => {
  const {
    cellState = {},
    clickableKeys = [],
    highlightedKey = null,
    showNudge = false,
    onNudgeDismiss,
    showLives = false,
    lives = 3,
    maxLives = 3,
    lifeStatusText = "",
    showGameOver = false,
    glowingCols = [],
    glowingRows = [],
    headerHighlight = null,
    shake = false,
    locked = false,
    compact = false,
    caption = "",
    onCellClick,
    cellRefs,
    rowHeaderRefs,
    colHeaderRefs,
    tableWrapRef,
    overlayLayerRef,
    yellowBoxRefs,
    overlays = [],
    yellowBoxes = [],
    onYellowBoxClick,
    yellowNudgeKey = null,
    table: propsTable,
    cornerImages: propsCornerImages,
  } = props;

  const { useRef, useEffect, useState, createElement: e } = React;
  const highlightedCellRef = useRef(null);
  const yellowNudgeRef = useRef(null);
  const [burstKeys, setBurstKeys] = useState({});
  const prevExplodedRef = useRef({});
  const burstSeededRef = useRef(false);
  const prevLivesRef = useRef(lives);
  const [breakingIndex, setBreakingIndex] = useState(null);

  const fallbackExperiment = getExperiment(0);
  const table = propsTable || fallbackExperiment.table;
  const cornerImages = propsCornerImages || fallbackExperiment.cornerImages;
  const rowItems = table.rowItems;
  const colItems = table.columnItems;
  const extraWideTable = !compact && colItems.length >= 6;
  const wideTable = !compact && colItems.length > 2 && !extraWideTable;
  const layout = compact
    ? {
        fixedColumnWidth: "3.8vw",
        eventColumnWidth: extraWideTable ? "4vw" : wideTable ? "5.2vw" : "6.8vw",
        headerRowHeight: 4.6,
        dataRowHeight: 5.8,
      }
    : extraWideTable
      ? {
          fixedColumnWidth: "2.6vw",
          eventColumnWidth: "3.9vw",
          headerRowHeight: 4.2,
          dataRowHeight: 5.1,
        }
      : wideTable
        ? {
            fixedColumnWidth: "3.4vw",
            eventColumnWidth: "5.4vw",
            headerRowHeight: 4.8,
            dataRowHeight: 5.8,
          }
        : {
            fixedColumnWidth: "4.2vw",
            eventColumnWidth: "7.8vw",
            headerRowHeight: 5,
            dataRowHeight: 6.2,
          };

  const cellKey = (row, col) => `${row}-${col}`;
  const renderOutcomeLabel = (row, col) =>
    typeof createOutcomeLabel === "function"
      ? createOutcomeLabel(e, row, col)
      : `${row}, ${col}`;

  const isColGlowing = (col) => {
    if (glowingCols.indexOf(col) !== -1) return true;
    if (headerHighlight && headerHighlight.col === col) return true;
    return false;
  };

  const isRowGlowing = (row) => {
    if (glowingRows.some((r) => String(r) === String(row))) return true;
    if (headerHighlight && String(headerHighlight.row) === String(row)) return true;
    return false;
  };

  const makeBurstParticles = () => {
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    return angles.map((deg, index) => {
      const rad = (deg * Math.PI) / 180;
      const dist = 4 + Math.random() * 2;
      return {
        id: index,
        tx: `${Math.cos(rad) * dist}vw`,
        ty: `${Math.sin(rad) * dist}vw`,
      };
    });
  };

  useEffect(() => {
    if (!burstSeededRef.current) {
      burstSeededRef.current = true;
      const seeded = {};
      Object.keys(cellState).forEach((key) => {
        if (cellState[key] === "mine") seeded[key] = true;
      });
      prevExplodedRef.current = seeded;
      return;
    }

    setBurstKeys((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.keys(cellState).forEach((key) => {
        if (
          cellState[key] === "mine" &&
          !prevExplodedRef.current[key] &&
          !next[key]
        ) {
          next[key] = makeBurstParticles();
          changed = true;
        }
      });
      return changed ? next : prev;
    });

    const exploded = {};
    Object.keys(cellState).forEach((key) => {
      if (cellState[key] === "mine") exploded[key] = true;
    });
    prevExplodedRef.current = exploded;
  }, [cellState]);

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      setBreakingIndex(lives);
    }
    prevLivesRef.current = lives;
  }, [lives]);

  const isClickable = (key) => {
    if (locked) return false;
    if (cellState[key]) return false;
    return clickableKeys.indexOf(key) !== -1;
  };

  const handleClick = (row, col) => {
    const key = cellKey(row, col);
    if (!isClickable(key) || typeof onCellClick !== "function") return;
    onCellClick(row, col);
  };

  const assignRef = (bag, key, node) => {
    if (!bag) return;
    bag.current[key] = node;
  };

  const columnTracks = [
    layout.fixedColumnWidth,
    layout.fixedColumnWidth,
    ...colItems.map(() => layout.eventColumnWidth),
  ].join(" ");

  const rowWeights = [
    layout.headerRowHeight,
    layout.headerRowHeight,
    ...rowItems.map(() => layout.dataRowHeight),
  ]
    .map((w) => `${w}fr`)
    .join(" ");

  const renderBurst = (key) => {
    const particles = burstKeys[key];
    if (!particles) return null;
    return e(
      "div",
      { className: "burst" },
      e("div", { className: "burst-ring" }),
      e("div", { className: "burst-ring" }),
      e("div", { className: "burst-ring" }),
      particles.map((p) =>
        e("div", {
          className: "burst-particle",
          key: `burst-${key}-${p.id}`,
          style: { "--tx": p.tx, "--ty": p.ty },
        }),
      ),
    );
  };

  const renderEventCell = (row, col, rowIndex, colIndex) => {
    const key = cellKey(row, col);
    const state = cellState[key];
    const highlighted = highlightedKey === key && !state;
    const headerOn =
      headerHighlight &&
      String(headerHighlight.row) === String(row) &&
      headerHighlight.col === col;
    const clickable = isClickable(key);
    const isLastRow = rowIndex === rowItems.length - 1;
    const isLastCol = colIndex === colItems.length - 1;
    let className = "box event-cell texture-grass";
    if (isLastRow) className += " last-row";
    if (isLastCol) className += " last-col";
    if (state === "safe") className += " revealed";
    if (state === "mine") className += " exploded";
    if (highlighted) className += " highlighted";
    if (clickable) className += " clickable";
    if (headerOn && !state) className += " pending-reveal";

    return e(
      "div",
      {
        className,
        key,
        style: {
          gridRow: String(3 + rowIndex),
          gridColumn: String(3 + colIndex),
        },
        onClick: () => handleClick(row, col),
        ref: (node) => {
          assignRef(cellRefs, key, node);
          if (highlighted) highlightedCellRef.current = node;
        },
      },
      e("div", {
        className: `cell-fire texture-fire${state === "mine" ? " visible" : ""}`,
      }),
      e(
        "div",
        {
          className: `cell-content texture-dirt${state === "safe" ? " visible" : ""}`,
        },
        renderOutcomeLabel(row, col),
      ),
      e("div", {
        className: `cell-cover texture-grass${state ? " hidden" : ""}`,
      }),
      e(
        "div",
        { className: `cell-bomb${state === "mine" ? " visible" : ""}` },
        e(
          "div",
          { className: "bomb-wrap" },
          e("div", { className: "bomb-spark" }),
          e("span", { className: "bomb-icon" }, "💣"),
        ),
      ),
      state === "mine" ? renderBurst(key) : null,
    );
  };

  const hearts = [];
  for (let i = 0; i < maxLives; i += 1) {
    const remainingFromTop = i < lives;
    const breaking = !remainingFromTop && breakingIndex === i;
    hearts.push(
      e(
        "div",
        {
          className: `life-heart${remainingFromTop ? "" : " broken"}${breaking ? " breaking" : ""}`,
          key: `heart-${i}`,
          onAnimationEnd: breaking
            ? () => {
                if (breakingIndex === i) setBreakingIndex(null);
              }
            : undefined,
        },
        e(
          "svg",
          { viewBox: "0 0 32 32", className: "life-heart-svg" },
          e("path", {
            d: "M16 28s-9.2-6.4-13.2-12.2C0.4 11.4 1.6 5.8 7 4.2c3.1-.9 6.1.4 7.6 3 1.5-2.6 4.5-3.9 7.6-3 5.4 1.6 6.6 7.2 4.2 11.6C25.2 21.6 16 28 16 28z",
          }),
        ),
      ),
    );
  }

  const gridChildren = [
    e(
      "div",
      {
        className: "corner-cell box",
        key: "corner",
        style: {
          gridRow: "1 / 3",
          gridColumn: "1 / 3",
          minHeight: 0,
          minWidth: 0,
        },
      },
      e(
        "div",
        { className: "corner-frame texture-grass-frame" },
        e(
          "div",
          { className: "corner-inner texture-dirt" },
          e(
            "div",
            { className: "corner-half corner-half-bl texture-dirt" },
            e("img", {
              className: "corner-icon corner-icon-dice",
              src: cornerImages.row,
              alt: "",
              draggable: false,
            }),
          ),
          e(
            "div",
            { className: "corner-half corner-half-tr texture-dirt" },
            e("img", {
              className: "corner-icon corner-icon-coin",
              src: cornerImages.col,
              alt: "",
              draggable: false,
            }),
          ),
          e("div", { className: "corner-diagonal texture-grass" }),
        ),
      ),
    ),
    e(
      "div",
      {
        key: "col-title",
        className: "mc-framed texture-grass-frame box header-rotor",
        style: { gridRow: "1", gridColumn: `3 / ${3 + colItems.length}` },
      },
      e("div", { className: "mc-inner texture-dirt" }, table.columnLabel),
    ),
  ];

  colItems.forEach((col, colIndex) => {
    const glow = isColGlowing(col) ? " header-glow" : "";
    gridChildren.push(
      e(
        "div",
        {
          key: `col-${col}`,
          className: `mc-framed texture-grass-frame box header-col${glow}`,
          style: { gridRow: "2", gridColumn: String(3 + colIndex) },
          ref: (el) => assignRef(colHeaderRefs, col, el),
        },
        e("div", { className: "mc-inner texture-dirt" }, col),
      ),
    );
  });

  gridChildren.push(
    e(
      "div",
      {
        key: "row-title",
        className: "mc-framed texture-grass-frame box header-row-title",
        style: { gridRow: `3 / ${3 + rowItems.length}`, gridColumn: "1" },
      },
      e("div", { className: "mc-inner texture-dirt" }, table.rowLabel),
    ),
  );

  rowItems.forEach((row, rowIndex) => {
    const glow = isRowGlowing(row) ? " header-glow" : "";
    gridChildren.push(
      e(
        "div",
        {
          key: `row-${row}`,
          className: `mc-framed texture-grass-frame box header-row${glow}`,
          style: { gridRow: String(3 + rowIndex), gridColumn: "2" },
          ref: (el) => assignRef(rowHeaderRefs, String(row), el),
        },
        e("div", { className: "mc-inner texture-dirt" }, String(row)),
      ),
    );

    colItems.forEach((col, colIndex) => {
      gridChildren.push(renderEventCell(row, col, rowIndex, colIndex));
    });
  });

  const renderOverlays = () =>
    overlays.map((item) =>
      e("div", {
        key: item.id,
        className: `white-overlay white-overlay-${item.type}${item.grown ? " grown" : ""}`,
        "data-overlay-id": item.id,
        style: {
          left: `${item.left}px`,
          top: `${item.top}px`,
          width: `${item.width}px`,
          height: `${item.height}px`,
        },
      }),
    );

  const renderYellowBoxes = () =>
    yellowBoxes.map((box) =>
      e("div", {
        key: `yb-${box.key}`,
        className: "yellow-overlap-box",
        style: {
          left: `${box.left}px`,
          top: `${box.top}px`,
          width: `${box.width}px`,
          height: `${box.height}px`,
        },
        onClick: (evt) => {
          evt.stopPropagation();
          if (typeof onYellowBoxClick === "function") onYellowBoxClick(box.row, box.col);
        },
        ref: (node) => {
          if (yellowBoxRefs) yellowBoxRefs.current[box.key] = node;
          if (yellowNudgeKey === box.key) yellowNudgeRef.current = node;
        },
      }),
    );

  const nudgeTargetRef = yellowNudgeKey ? yellowNudgeRef : highlightedCellRef;
  const nudgeActive =
    (showNudge && !!highlightedKey && !cellState[highlightedKey]) ||
    (!!yellowNudgeKey && yellowBoxes.some((b) => b.key === yellowNudgeKey));

  return e(
    "div",
    { className: `game-row${compact ? " compact" : ""}` },
    e(
      "div",
      {
        className: `event-table-wrap${shake ? " shake" : ""}`,
        ref: tableWrapRef,
      },
      e(
        "div",
        {
          className: `grid-container${extraWideTable ? " extra-wide" : ""}`,
          style: {
            gridTemplateColumns: columnTracks,
            gridTemplateRows: rowWeights,
            position: "relative",
          },
        },
        gridChildren,
        e(
          "div",
          { className: "overlay-layer", ref: overlayLayerRef },
          renderOverlays(),
          renderYellowBoxes(),
        ),
      ),
      caption
        ? e("p", {
            className: "table-caption",
            dangerouslySetInnerHTML: {
              __html:
                typeof handleComma === "function"
                  ? handleComma(caption)
                  : caption,
            },
          })
        : null,
    ),
    showLives
      ? e(
          "div",
          { className: "life-store" },
          e("div", { className: "life-store-box" }, hearts),
          showGameOver
            ? e(
                "div",
                { className: "life-status game-over-text " + current_language },
                APP_DATA.steps[5].gameOver,
              )
            : lifeStatusText
              ? e("div", {
                  className: "life-status",
                  dangerouslySetInnerHTML: { __html: lifeStatusText },
                })
              : null,
        )
      : null,
    e(Nudge, {
      targetRef: nudgeTargetRef,
      active: nudgeActive,
      onDismiss: onNudgeDismiss,
    }),
  );
};
