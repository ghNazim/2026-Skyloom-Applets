const TABLE_COLORS = {
  preimage: "#E97132",
  image: "#45C6CE",
  rotation: "#BD78DD",
  correct: "rgba(38, 95, 52, 0.95)",
  correctBorder: "rgba(140, 220, 165, 0.9)",
};

const PreImageImageTable = ({
  visible,
  showRotationColumn,
  rotationColumnOpen,
  pRowGreen,
  dehighlightQR,
  allHighlighted,
  rotationCells,
  rotationMerged,
  hideRotTop,
  hideRotBottom,
  cellRefs,
  refPrefix = "",
  rowHighlight,
  rotMiddleHighlight,
  twoColumnOnly,
  qPrimeKnown,
  rKnown,
  qPrimeFill,
  rFill,
  compact,
  contentVisible = true,
  revealedCells,
  blinkCell,
  rotationFirstDashed,
  hideFlySources = false,
  hideRotationColumn = false,
  wrapRefKey,
  prepInvisible = false,
  cellHighlight,
  hideUnknownBorders = false,
}) => {
  const t = APP_DATA.table;
  const rp = refPrefix;

  const refKey = (key) => rp + key;

  const isCellRevealed = (key) => {
    if (!revealedCells) return contentVisible;
    return !!revealedCells[key];
  };

  const isRowDimmed = (row) => {
    if (!rowHighlight) {
      if (row === "q" || row === "r") return dehighlightQR && !allHighlighted;
      return false;
    }
    return !rowHighlight[row];
  };

  const renderFillExpr = (expr, slotPrefix) => {
    if (!expr || !expr.active) return null;
    if (expr.showBrackets && !expr.showExpr && !expr.showFinal) {
      return React.createElement(
        "span",
        { className: "piit-fill-brackets" },
        "( \u00a0 , \u00a0 )",
      );
    }
    if (expr.showNamed) {
      return expr.prefix + " " + expr.finalValue;
    }

    const renderExprBody = (ex, slotPrefix) =>
      React.createElement(
        "span",
        { className: "piit-trans-expr" + (ex.hideExpr ? " is-hidden" : "") },
        "(",
        React.createElement(
          "span",
          {
            className: "piit-expr-num" + (ex.showA1 ? " is-shown" : ""),
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey(slotPrefix + "-a1")] = el;
            },
          },
          ex.a1 || "",
        ),
        React.createElement(
          "span",
          {
            className: "piit-expr-op" + (ex.showOp1 ? " is-shown" : ""),
          },
          ex.op1 || "",
        ),
        React.createElement(
          "span",
          {
            className: "piit-expr-num" + (ex.showA2 ? " is-shown" : ""),
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey(slotPrefix + "-a2")] = el;
            },
          },
          ex.a2 || "",
        ),
        " , ",
        React.createElement(
          "span",
          {
            className: "piit-expr-num" + (ex.showB1 ? " is-shown" : ""),
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey(slotPrefix + "-b1")] = el;
            },
          },
          ex.b1 || "",
        ),
        React.createElement(
          "span",
          {
            className: "piit-expr-op" + (ex.showOp2 ? " is-shown" : ""),
          },
          ex.op2 || "",
        ),
        ex.wrapB2
          ? React.createElement(
              React.Fragment,
              null,
              ex.showB2Wrap
                ? React.createElement(
                    "span",
                    {
                      className:
                        "piit-expr-paren" + (ex.showB2Wrap ? " is-shown" : ""),
                    },
                    "(",
                  )
                : null,
              React.createElement(
                "span",
                {
                  className: "piit-expr-num" + (ex.showB2 ? " is-shown" : ""),
                  ref: (el) => {
                    if (cellRefs)
                      cellRefs.current[refKey(slotPrefix + "-b2")] = el;
                  },
                },
                ex.b2 || "",
              ),
              ex.showB2Wrap
                ? React.createElement(
                    "span",
                    {
                      className:
                        "piit-expr-paren" + (ex.showB2Wrap ? " is-shown" : ""),
                    },
                    ")",
                  )
                : null,
            )
          : React.createElement(
              "span",
              {
                className: "piit-expr-num" + (ex.showB2 ? " is-shown" : ""),
                ref: (el) => {
                  if (cellRefs)
                    cellRefs.current[refKey(slotPrefix + "-b2")] = el;
                },
              },
              ex.b2 || "",
            ),
        ")",
      );

    if (expr.showExpr || expr.showFinal) {
      return React.createElement(
        "span",
        { className: "piit-fill-stage" },
        expr.showExpr ? renderExprBody(expr, slotPrefix) : null,
        expr.showFinal
          ? React.createElement(
              "span",
              {
                className:
                  "piit-trans-final" +
                  (expr.showFinalVisible ? " is-shown" : ""),
                ref: (el) => {
                  if (cellRefs)
                    cellRefs.current[refKey(slotPrefix + "-final")] = el;
                },
              },
              expr.finalValue,
            )
          : null,
      );
    }
    return null;
  };

  const renderCoordCell = (opts) => {
    const {
      refKey: key,
      prefix,
      x,
      y,
      color,
      isUnknown,
      isGreen,
      isDimmed,
      xRefKey,
      yRefKey,
      fillExpr,
      fillSlotPrefix,
      knownText,
    } = opts;

    const revealed = isCellRevealed(key);
    const isBlinking = blinkCell === key;
    const isStep9Highlight = cellHighlight === key;

    const bg = isGreen ? TABLE_COLORS.correct : color + "66";
    const noUnknownBorder =
      hideUnknownBorders && (key === "pre-r" || key === "img-q");
    const border = noUnknownBorder
      ? "2px solid transparent"
      : isUnknown
        ? "2px dashed " + color
        : isGreen
          ? "2px solid " + TABLE_COLORS.correctBorder
          : "2px solid transparent";

    const style = {
      backgroundColor: bg,
      border: border,
      color: isDimmed ? "rgba(255,255,255,0.35)" : "#ffffff",
      textShadow: isDimmed ? "none" : "0 1px 3px rgba(0,0,0,0.5)",
      opacity: isDimmed ? 0.45 : revealed ? 1 : 0,
    };

    let content = null;
    if (fillExpr && fillExpr.active) {
      content = renderFillExpr(fillExpr, fillSlotPrefix);
    } else if (knownText) {
      content = knownText;
    } else if (isUnknown || x == null) {
      content = prefix + " " + t.unknown;
    } else {
      content = React.createElement(
        React.Fragment,
        null,
        prefix,
        " (",
        React.createElement(
          "span",
          {
            ref: (el) => {
              if (cellRefs && xRefKey)
                cellRefs.current[refKey(xRefKey)] = el;
            },
          },
          String(x),
        ),
        ",",
        React.createElement(
          "span",
          {
            ref: (el) => {
              if (cellRefs && yRefKey)
                cellRefs.current[refKey(yRefKey)] = el;
            },
          },
          String(y),
        ),
        ")",
      );
    }

    return React.createElement(
      "div",
      {
        key: key,
        className:
          "piit-cell" +
          (isUnknown && !fillExpr && !noUnknownBorder ? " is-unknown" : "") +
          (isBlinking ? " is-blinking" : "") +
          (isStep9Highlight ? " is-step9-highlight" : ""),
        style: style,
        ref: (el) => {
          if (cellRefs) cellRefs.current[refKey(key)] = el;
        },
      },
      content,
    );
  };

  const renderRotationCell = (rowIndex) => {
    const rotMiddleIndex = rotationMerged ? 1 : 0;
    const rotDimDefault = dehighlightQR && rowIndex > 0 && !allHighlighted;
    const isDimmed = rowHighlight
      ? rowIndex !== rotMiddleIndex || !rotMiddleHighlight
        ? rotDimDefault
        : false
      : rotDimDefault;
    const rotBright =
      rowHighlight && rotMiddleHighlight && rowIndex === rotMiddleIndex;

    const color = TABLE_COLORS.rotation;
    const cellValue = rotationMerged
      ? rowIndex === 1
        ? rotationCells
          ? rotationCells[1]
          : null
        : null
      : rotationCells
        ? rotationCells[rowIndex]
        : null;

    const isFirstDashed =
      rotationFirstDashed && rowIndex === 0 && cellValue && !rotationMerged;

    let content = null;
    if (cellValue) {
      content = React.createElement(
        "span",
        {
          ref: (el) => {
            if (cellRefs)
              cellRefs.current[refKey("rot-val-" + rowIndex)] = el;
          },
        },
        cellValue,
      );
    }

    const style = {
      backgroundColor: color + "66",
      border: isFirstDashed
        ? "2px dashed " + color
        : "2px solid transparent",
      color:
        isDimmed && !rotBright
          ? "rgba(255,255,255,0.35)"
          : "#ffffff",
      textShadow:
        isDimmed && !rotBright ? "none" : "0 1px 3px rgba(0,0,0,0.5)",
      opacity: isDimmed && !rotBright ? 0.45 : 1,
    };

    const hideCell =
      (hideRotTop && rowIndex === 0) ||
      (hideRotBottom && rowIndex === 2) ||
      (rotationMerged && rowIndex !== 1);

    const showArrow = rotationMerged && rowIndex === 1 && !hideCell;

    const cellEl = React.createElement(
      "div",
      {
        className:
          "piit-cell piit-trans-cell" +
          (hideCell ? " is-hidden-cell" : ""),
        style: style,
        ref: (el) => {
          if (cellRefs) cellRefs.current[refKey("rot-" + rowIndex)] = el;
        },
      },
      content,
    );

    if (!showArrow) {
      return React.createElement(
        "div",
        { key: "rot-" + rowIndex },
        cellEl,
      );
    }

    return React.createElement(
      "div",
      {
        key: "rot-" + rowIndex,
        className: "piit-rot-cell-slot",
      },
      cellEl,
      React.createElement(
        "svg",
        {
          className: "piit-rot-arrow",
          viewBox: "0 0 120 14",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-hidden": "true",
        },
        React.createElement("line", {
          x1: 4,
          y1: 7,
          x2: 102,
          y2: 7,
          stroke: "#ffffff",
          strokeWidth: 2,
          strokeLinecap: "round",
        }),
        React.createElement("polygon", {
          points: "102,2 118,7 102,12",
          fill: "#ffffff",
        }),
      ),
    );
  };

  const dimP = isRowDimmed("p");
  const dimQ = isRowDimmed("q");
  const dimR = isRowDimmed("r");
  const greenP = pRowGreen && !showRotationColumn;

  const qPrimeText = qPrimeKnown
    ? t.qPrime + " " + t.qPrimeValue
    : null;
  const rText = rKnown ? t.r + " " + t.rValue : null;

  const rows = [
    {
      pre: renderCoordCell({
        refKey: "pre-p",
        prefix: t.p,
        x: 2,
        y: 1,
        color: TABLE_COLORS.preimage,
        isUnknown: false,
        isGreen: greenP,
        isDimmed: dimP,
        xRefKey: "pre-p-x",
        yRefKey: "pre-p-y",
      }),
      img: renderCoordCell({
        refKey: "img-p",
        prefix: t.pPrime,
        x: 1,
        y: -2,
        color: TABLE_COLORS.image,
        isUnknown: false,
        isGreen: greenP,
        isDimmed: dimP,
        xRefKey: "img-p-x",
        yRefKey: "img-p-y",
      }),
    },
    {
      pre: renderCoordCell({
        refKey: "pre-q",
        prefix: t.q,
        x: 4,
        y: 3,
        color: TABLE_COLORS.preimage,
        isUnknown: false,
        isGreen: false,
        isDimmed: dimQ,
        xRefKey: "pre-q-x",
        yRefKey: "pre-q-y",
      }),
      img: renderCoordCell({
        refKey: "img-q",
        prefix: t.qPrime,
        x: qPrimeKnown ? 3 : null,
        y: qPrimeKnown ? -4 : null,
        color: TABLE_COLORS.image,
        isUnknown: !qPrimeKnown && !qPrimeFill,
        isGreen: false,
        isDimmed: dimQ,
        fillExpr: qPrimeFill,
        fillSlotPrefix: "qprime",
        knownText: qPrimeText,
      }),
    },
    {
      pre: renderCoordCell({
        refKey: "pre-r",
        prefix: t.r,
        x: rKnown ? 3 : null,
        y: rKnown ? 4 : null,
        color: TABLE_COLORS.preimage,
        isUnknown: !rKnown && !rFill,
        isGreen: false,
        isDimmed: dimR,
        fillExpr: rFill,
        fillSlotPrefix: "rfill",
        knownText: rText,
      }),
      img: renderCoordCell({
        refKey: "img-r",
        prefix: t.rPrime,
        x: 4,
        y: -3,
        color: TABLE_COLORS.image,
        isUnknown: false,
        isGreen: false,
        isDimmed: dimR,
        xRefKey: "img-r-x",
        yRefKey: "img-r-y",
      }),
    },
  ];

  const rotColClass =
    "piit-col-trans" +
    (showRotationColumn && !twoColumnOnly ? " is-present" : "") +
    (rotationColumnOpen ? " is-open" : "") +
    (hideRotationColumn ? " is-source-hidden" : "");

  const colClass = (kind) =>
    "piit-column piit-col-" +
    kind +
    (!contentVisible ? " is-content-hidden" : "") +
    (hideFlySources && (kind === "pre" || kind === "img")
      ? " is-source-hidden"
      : "");

  const preColumn = React.createElement(
    "div",
    {
      className: colClass("pre"),
      ref: (el) => {
        if (cellRefs) cellRefs.current[refKey("col-pre")] = el;
      },
    },
    React.createElement(
      "div",
      {
        className: "piit-header",
        style: { color: TABLE_COLORS.preimage },
      },
      t.preImage,
    ),
    rows.map((row) => row.pre),
  );

  const imgColumn = React.createElement(
    "div",
    {
      className: colClass("img"),
      ref: (el) => {
        if (cellRefs) cellRefs.current[refKey("col-img")] = el;
      },
    },
    React.createElement(
      "div",
      {
        className: "piit-header",
        style: { color: TABLE_COLORS.image },
      },
      t.image,
    ),
    rows.map((row) => row.img),
  );

  const rotColumn =
    showRotationColumn && !twoColumnOnly
      ? React.createElement(
          "div",
          {
            className: "piit-column " + rotColClass,
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey("col-rot")] = el;
            },
          },
          React.createElement(
            "div",
            {
              className: "piit-header piit-trans-header",
              style: { color: TABLE_COLORS.rotation },
            },
            t.rotation,
          ),
          [0, 1, 2].map((i) => renderRotationCell(i)),
        )
      : null;

  return React.createElement(
    "div",
    {
      className:
        "piit-wrap" +
        (visible ? " is-visible" : "") +
        (prepInvisible ? " is-prep-invisible" : "") +
        (compact ? " is-compact" : ""),
      ref: (el) => {
        if (cellRefs && wrapRefKey) cellRefs.current[wrapRefKey] = el;
      },
    },
    React.createElement(
      "div",
      {
        className:
          "piit-table" +
          (showRotationColumn && !twoColumnOnly ? " has-translation" : "") +
          (rotationColumnOpen ? " is-trans-open" : "") +
          (rotationMerged ? " is-rot-merged" : "") +
          (twoColumnOnly ? " is-two-col" : ""),
      },
      React.createElement(
        "div",
        { className: "piit-columns" },
        preColumn,
        rotColumn,
        imgColumn,
      ),
    ),
  );
};

const TABLE_THEME = TABLE_COLORS;
