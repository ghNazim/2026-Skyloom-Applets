const TABLE_COLORS = {
  preimage: "#E97132",
  image: "#45C6CE",
  translation: "#BD78DD",
  correct: "rgba(38, 95, 52, 0.95)",
  correctBorder: "rgba(140, 220, 165, 0.9)",
};

const PreImageImageTable = ({
  visible,
  showTranslationColumn,
  translationColumnOpen,
  pRowGreen,
  dehighlightQR,
  allHighlighted,
  translationCells,
  translationTopUnknown,
  translationExpr,
  translationMerged,
  hideTransTop,
  hideTransBottom,
  cellRefs,
  refPrefix = "",
  rowHighlight,
  transMiddleHighlight,
  twoColumnOnly,
  qPrimeKnown,
  rKnown,
  qPrimeFill,
  rFill,
  compact,
  contentVisible = true,
  hideFlySources = false,
  hideTranslationColumn = false,
}) => {
  const t = APP_DATA.table;
  const rp = refPrefix;

  const refKey = (key) => rp + key;

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

    const bg = isGreen ? TABLE_COLORS.correct : color + "66";
    const border = isUnknown
      ? "2px dashed " + color
      : isGreen
        ? "2px solid " + TABLE_COLORS.correctBorder
        : "2px solid transparent";

    const style = {
      backgroundColor: bg,
      border: border,
      color: isDimmed ? "rgba(255,255,255,0.35)" : "#ffffff",
      textShadow: isDimmed ? "none" : "0 1px 3px rgba(0,0,0,0.5)",
      opacity: isDimmed ? 0.45 : 1,
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
        className: "piit-cell" + (isUnknown && !fillExpr ? " is-unknown" : ""),
        style: style,
        ref: (el) => {
          if (cellRefs) cellRefs.current[refKey(key)] = el;
        },
      },
      content,
    );
  };

  const renderTranslationCell = (rowIndex) => {
    const transDimDefault = dehighlightQR && rowIndex > 0 && !allHighlighted;
    const isDimmed = rowHighlight
      ? rowIndex !== 1 || !transMiddleHighlight
        ? transDimDefault
        : false
      : transDimDefault;
    const transBright =
      rowHighlight && transMiddleHighlight && rowIndex === 1;

    const color = TABLE_COLORS.translation;
    const cellValue = translationMerged
      ? rowIndex === 1
        ? translationCells
          ? translationCells[1]
          : null
        : null
      : translationCells
        ? translationCells[rowIndex]
        : null;
    const isTopUnknown = translationTopUnknown && rowIndex === 0 && !cellValue;

    let content = null;
    if (translationExpr && rowIndex === 0 && translationExpr.active) {
      const ex = translationExpr;
      content = React.createElement(
        "span",
        {
          className:
            "piit-trans-expr" + (ex.showFinal ? " is-hidden" : ""),
          ref: (el) => {
            if (cellRefs) cellRefs.current[refKey("trans-expr")] = el;
          },
        },
        "(",
        React.createElement(
          "span",
          {
            className: "piit-expr-num" + (ex.show7 ? " is-shown" : ""),
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey("trans-slot-7")] = el;
            },
          },
          "7",
        ),
        React.createElement(
          "span",
          {
            className: "piit-expr-op" + (ex.showMinus1 ? " is-shown" : ""),
          },
          "-",
        ),
        React.createElement(
          "span",
          {
            className: "piit-expr-num" + (ex.show2a ? " is-shown" : ""),
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey("trans-slot-2a")] = el;
            },
          },
          "2",
        ),
        " , ",
        React.createElement(
          "span",
          {
            className: "piit-expr-num" + (ex.show2b ? " is-shown" : ""),
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey("trans-slot-2b")] = el;
            },
          },
          "2",
        ),
        React.createElement(
          "span",
          {
            className: "piit-expr-op" + (ex.showMinus2 ? " is-shown" : ""),
          },
          "-",
        ),
        React.createElement(
          "span",
          {
            className: "piit-expr-num" + (ex.show3 ? " is-shown" : ""),
            ref: (el) => {
              if (cellRefs) cellRefs.current[refKey("trans-slot-3")] = el;
            },
          },
          "3",
        ),
        ")",
      );
      if (ex.showFinal) {
        content = React.createElement(
          React.Fragment,
          null,
          content,
          React.createElement(
            "span",
            {
              className: "piit-trans-final is-shown",
              ref: (el) => {
                if (cellRefs) cellRefs.current[refKey("trans-final")] = el;
              },
            },
            t.translationValue,
          ),
        );
      }
    } else if (cellValue) {
      if (translationMerged && rowIndex === 1) {
        content = React.createElement(
          React.Fragment,
          null,
          "(",
          React.createElement(
            "span",
            {
              ref: (el) => {
                if (cellRefs) cellRefs.current[refKey("trans-merged-x")] = el;
              },
            },
            "5",
          ),
          ",",
          React.createElement(
            "span",
            {
              ref: (el) => {
                if (cellRefs) cellRefs.current[refKey("trans-merged-y")] = el;
              },
            },
            "-1",
          ),
          ")",
        );
      } else {
        content = React.createElement(
          "span",
          {
            ref: (el) => {
              if (cellRefs)
                cellRefs.current[refKey("trans-val-" + rowIndex)] = el;
            },
          },
          cellValue,
        );
      }
    }

    const style = {
      backgroundColor: color + "66",
      border: isTopUnknown
        ? "2px dashed " + color
        : "2px solid transparent",
      color:
        isDimmed && !transBright
          ? "rgba(255,255,255,0.35)"
          : "#ffffff",
      textShadow:
        isDimmed && !transBright ? "none" : "0 1px 3px rgba(0,0,0,0.5)",
      opacity: isDimmed && !transBright ? 0.45 : 1,
    };

    const hideCell =
      (hideTransTop && rowIndex === 0) ||
      (hideTransBottom && rowIndex === 2) ||
      (translationMerged && rowIndex !== 1);

    return React.createElement(
      "div",
      {
        key: "trans-" + rowIndex,
        className:
          "piit-cell piit-trans-cell" +
          (hideCell ? " is-hidden-cell" : ""),
        style: style,
        ref: (el) => {
          if (cellRefs) cellRefs.current[refKey("trans-" + rowIndex)] = el;
        },
      },
      content,
    );
  };

  const dimP = isRowDimmed("p");
  const dimQ = isRowDimmed("q");
  const dimR = isRowDimmed("r");
  const greenP = pRowGreen && !showTranslationColumn;

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
        y: 3,
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
        x: 7,
        y: 2,
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
        x: 7,
        y: 4,
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
        x: qPrimeKnown ? 12 : null,
        y: qPrimeKnown ? 3 : null,
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
        x: rKnown ? 6 : null,
        y: rKnown ? 6 : null,
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
        x: 11,
        y: 5,
        color: TABLE_COLORS.image,
        isUnknown: false,
        isGreen: false,
        isDimmed: dimR,
        xRefKey: "img-r-x",
        yRefKey: "img-r-y",
      }),
    },
  ];

  const transColClass =
    "piit-col-trans" +
    (showTranslationColumn && !twoColumnOnly ? " is-present" : "") +
    (translationColumnOpen ? " is-open" : "") +
    (hideTranslationColumn ? " is-source-hidden" : "");

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

  const transColumn =
    showTranslationColumn && !twoColumnOnly
      ? React.createElement(
          "div",
          { className: "piit-column " + transColClass },
          React.createElement(
            "div",
            {
              className: "piit-header piit-trans-header",
              style: { color: TABLE_COLORS.translation },
            },
            t.translation,
          ),
          [0, 1, 2].map((i) => renderTranslationCell(i)),
        )
      : null;

  return React.createElement(
    "div",
    {
      className:
        "piit-wrap" +
        (visible ? " is-visible" : "") +
        (compact ? " is-compact" : ""),
    },
    React.createElement(
      "div",
      {
        className:
          "piit-table" +
          (showTranslationColumn && !twoColumnOnly ? " has-translation" : "") +
          (translationColumnOpen ? " is-trans-open" : "") +
          (twoColumnOnly ? " is-two-col" : ""),
      },
      React.createElement(
        "div",
        { className: "piit-columns" },
        preColumn,
        transColumn,
        imgColumn,
      ),
    ),
  );
};

const TABLE_THEME = TABLE_COLORS;
