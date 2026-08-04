const CoordinateTable = ({
  tableVisible,
  headerVisible,
  imageRow,
  preImageRow,
  translationRow,
  revealXState,
  revealYState,
  onRevealX,
  onRevealY,
  cellRefs,
  tableData,
}) => {
  const t = tableData || APP_DATA.table;

  const textClass = (visible, colorClass) =>
    "cell-text" +
    (colorClass ? " " + colorClass : "") +
    (visible ? " is-shown" : "");

  const setRef = (key) => (el) => {
    if (cellRefs) cellRefs[key] = el;
  };

  const renderRevealCell = (col, state, onClick, refKey) => {
    const baseRef = refKey + "-base";
    const subtractRef = refKey + "-subtract";

    let cellClass = "coord-table-cell coord-table-data";
    let content = null;
    let onCellClick = null;

    if (!translationRow.visible || !state || state.mode === "hidden") {
      content = null;
    } else if (state.mode === "button") {
      cellClass += " is-reveal-clickable";
      if (state.disabled) cellClass += " is-reveal-disabled";
      onCellClick = state.disabled ? null : onClick;
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
          { className: partClass(state.showBase), ref: setRef(baseRef) },
          state.base,
        ),
        React.createElement(
          "span",
          { className: partClass(state.showOperator) },
          state.operator,
        ),
        React.createElement(
          "span",
          { className: partClass(state.showSubtract), ref: setRef(subtractRef) },
          state.subtract,
        ),
      );
    } else if (state.mode === "result") {
      content = React.createElement(
        "span",
        { className: "reveal-result" + (state.shown ? " is-shown" : "") },
        state.text,
      );
    }

    return React.createElement(
      "div",
      {
        key: refKey,
        id:
          state && state.mode === "button" && !state.disabled
            ? col === "x"
              ? "reveal-x-btn"
              : "reveal-y-btn"
            : undefined,
        className: cellClass,
        onClick: onCellClick,
        role: onCellClick ? "button" : undefined,
        ref: setRef(refKey),
      },
      content,
    );
  };

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
          { className: "coord-table-cell coord-table-header", ref: setRef("headerX") },
          React.createElement(
            "span",
            { className: textClass(headerVisible, "coord-table-math-var") },
            t.x,
          ),
        ),
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-header", ref: setRef("headerY") },
          React.createElement(
            "span",
            { className: textClass(headerVisible, "coord-table-math-var") },
            t.y,
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "coord-table-row" },
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-label", ref: setRef("imageLabel") },
          React.createElement(
            "span",
            { className: textClass(imageRow.label, "is-image-text") },
            t.pointImage,
          ),
        ),
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-data", ref: setRef("imageX") },
          React.createElement("span", { className: textClass(imageRow.x) }, t.imageX),
        ),
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-data", ref: setRef("imageY") },
          React.createElement("span", { className: textClass(imageRow.y) }, t.imageY),
        ),
      ),
      React.createElement(
        "div",
        { className: "coord-table-row" },
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-label", ref: setRef("preImageLabel") },
          React.createElement(
            "span",
            { className: textClass(preImageRow.label, "is-object-text") },
            t.pointPreImage,
          ),
        ),
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-data", ref: setRef("preImageX") },
          React.createElement("span", { className: textClass(preImageRow.x) }, t.preImageX),
        ),
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-data", ref: setRef("preImageY") },
          React.createElement("span", { className: textClass(preImageRow.y) }, t.preImageY),
        ),
      ),
      React.createElement(
        "div",
        { className: "coord-table-row" },
        React.createElement(
          "div",
          { className: "coord-table-cell coord-table-label", ref: setRef("translationLabel") },
          React.createElement(
            "span",
            { className: textClass(translationRow.visible, "is-transformation-text") },
            t.translation,
          ),
        ),
        renderRevealCell("x", revealXState, onRevealX, "translationX"),
        renderRevealCell("y", revealYState, onRevealY, "translationY"),
      ),
    ),
  );
};
