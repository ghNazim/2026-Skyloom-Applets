const CoordinateTable = ({
  step,
  tableVisible,
  headerVisible,
  row3Ready,
  row4RevealReady,
  row2Cells,
  dndPlacements,
  dndHoveredZone,
  dndWrongZone,
  dndWrongItemId,
  showDndGreen,
  revealXState,
  revealYState,
  onRevealX,
  onRevealY,
  cellRefs,
}) => {
  const t = APP_DATA.table;

  const renderDropZone = (zoneId) => {
    const placed = dndPlacements[zoneId];
    const isHovered = dndHoveredZone === zoneId && !placed;
    const isWrong = dndWrongZone === zoneId && dndWrongItemId;
    const isFilled = !!placed;

    let cls = "coord-table-drop";
    if (isHovered) cls += " is-hovered";
    if (isFilled && showDndGreen) cls += " is-correct";
    if (isFilled && !showDndGreen) cls += " is-filled";
    if (isWrong) cls += " is-wrong-drop";

    return React.createElement(
      "div",
      {
        key: zoneId,
        className: cls,
        "data-zoneid": zoneId,
        ref: (el) => {
          if (cellRefs) cellRefs["drop-" + zoneId] = el;
        },
      },
      isWrong
        ? React.createElement("span", null, dndWrongItemId)
        : placed
          ? React.createElement("span", null, placed)
          : null,
    );
  };

  const renderRevealCell = (col, state, onClick, refKey) => {
    const baseRef = refKey + "-base";
    const plusRef = refKey + "-plus";
    const transRef = refKey + "-trans";

    let cellClass = "coord-table-cell coord-table-data";
    let content = null;
    let onCellClick = null;

    if (!row4RevealReady || !state || state.mode === "hidden") {
      content = null;
    } else if (state.mode === "button") {
      cellClass += " is-reveal-clickable";
      if (state && state.disabled) cellClass += " is-reveal-disabled";
      onCellClick = state && state.disabled ? null : onClick;
      content = t.reveal;
    } else if (state.mode === "expression") {
      cellClass += " is-reveal-active";
      const partClass = (shown) =>
        "reveal-expr-part" + (shown ? " is-shown" : "");
      const exprClass =
        "reveal-expression" + (state.fadeOut ? " is-fading-out" : "");
      content = React.createElement(
        "span",
        { className: exprClass },
        React.createElement(
          "span",
          {
            className: partClass(state.showBase),
            ref: (el) => {
              if (cellRefs) cellRefs[baseRef] = el;
            },
          },
          state.base,
        ),
        React.createElement(
          "span",
          {
            className: partClass(state.showPlus),
            ref: (el) => {
              if (cellRefs) cellRefs[plusRef] = el;
            },
          },
          " + ",
        ),
        React.createElement(
          "span",
          {
            className: partClass(state.showTrans),
            ref: (el) => {
              if (cellRefs) cellRefs[transRef] = el;
            },
          },
          state.trans,
        ),
      );
    } else if (state.mode === "result") {
      const resultClass =
        "reveal-result" + (state.shown !== false ? " is-shown" : "");
      content = React.createElement(
        "span",
        { className: resultClass },
        state.text || "",
      );
    }

    return React.createElement(
      "div",
      {
        key: "reveal-" + col,
        id:
          state.mode === "button" && !(state && state.disabled)
            ? col === "x"
              ? "reveal-x-btn"
              : "reveal-y-btn"
            : undefined,
        className: cellClass,
        onClick: onCellClick,
        role: onCellClick ? "button" : undefined,
        ref: (el) => {
          if (cellRefs) cellRefs[refKey] = el;
        },
      },
      content,
    );
  };

  const textClass = (visible) => "cell-text" + (visible ? " is-shown" : "");

  return React.createElement(
    "div",
    { className: "coord-table-wrap" + (tableVisible ? " is-visible" : "") },
    React.createElement(
      "div",
      { className: "coord-table" },
      React.createElement(
        "div",
        { className: "coord-table-row" },
        React.createElement("div", {
          className: "coord-table-cell coord-table-corner",
        }),
        React.createElement(
          "div",
          {
            className: "coord-table-cell coord-table-header",
            ref: (el) => {
              if (cellRefs) cellRefs.headerX = el;
            },
          },
          React.createElement(
            "span",
            { className: textClass(headerVisible) },
            t.x,
          ),
        ),
        React.createElement(
          "div",
          {
            className: "coord-table-cell coord-table-header",
            ref: (el) => {
              if (cellRefs) cellRefs.headerY = el;
            },
          },
          React.createElement(
            "span",
            { className: textClass(headerVisible) },
            t.y,
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "coord-table-row" },
        React.createElement(
          "div",
          {
            className: "coord-table-cell coord-table-label",
            ref: (el) => {
              if (cellRefs) cellRefs.row2Label = el;
            },
          },
          React.createElement(
            "span",
            { className: textClass(row2Cells.labelVisible) },
            t.pointP,
          ),
        ),
        React.createElement(
          "div",
          {
            className: "coord-table-cell coord-table-data",
            ref: (el) => {
              if (cellRefs) cellRefs.row2X = el;
            },
          },
          React.createElement(
            "span",
            { className: textClass(row2Cells.xVisible) },
            "2",
          ),
        ),
        React.createElement(
          "div",
          {
            className: "coord-table-cell coord-table-data",
            ref: (el) => {
              if (cellRefs) cellRefs.row2Y = el;
            },
          },
          React.createElement(
            "span",
            { className: textClass(row2Cells.yVisible) },
            "1",
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "coord-table-row" },
        React.createElement(
          "div",
          {
            className: "coord-table-cell coord-table-label",
            ref: (el) => {
              if (cellRefs) cellRefs.row3Label = el;
            },
          },
          React.createElement(
            "span",
            { className: textClass(row3Ready) },
            t.translation,
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "coord-table-cell coord-table-data coord-table-drop-cell",
            ref: (el) => {
              if (cellRefs) cellRefs.row3X = el;
            },
          },
          step === 2 && row3Ready
            ? renderDropZone("x")
            : step === 3
              ? React.createElement(
                  "span",
                  { className: textClass(true) },
                  "+6",
                )
              : null,
        ),
        React.createElement(
          "div",
          {
            className:
              "coord-table-cell coord-table-data coord-table-drop-cell",
            ref: (el) => {
              if (cellRefs) cellRefs.row3Y = el;
            },
          },
          step === 2 && row3Ready
            ? renderDropZone("y")
            : step === 3
              ? React.createElement(
                  "span",
                  { className: textClass(true) },
                  "+2",
                )
              : null,
        ),
      ),
      React.createElement(
        "div",
        { className: "coord-table-row" },
        React.createElement(
          "div",
          {
            className: "coord-table-cell coord-table-label",
            ref: (el) => {
              if (cellRefs) cellRefs.row4Label = el;
            },
          },
          React.createElement(
            "span",
            { className: textClass(row4RevealReady) },
            t.pointPPrime,
          ),
        ),
        renderRevealCell("x", revealXState, onRevealX, "revealX"),
        renderRevealCell("y", revealYState, onRevealY, "revealY"),
      ),
    ),
  );
};
