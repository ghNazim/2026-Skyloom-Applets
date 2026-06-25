// Diagram layout config — tweak point positions and distances here.
// pX/pY = point P; pPrimeX/pPrimeY = point P'; horizontal leg = pPrimeX - pX, vertical leg = pY - pPrimeY
const DIAG = {
  viewW: 100,
  viewH: 100,
  pX: 24,
  pY: 74,
  pPrimeX: 82,
  pPrimeY: 34,
  pointR: 1.8,
  translationLineColor: "#ffd34d",
  hypotenuseColor: "#ffb84c",
  lineWidth: 0.45,
  hypotenuseWidth: 0.85,
  dashArray: "1.8 1.2",
  labelPOffsetY: 6.5,
  labelPPrimeOffsetY: -6,
  labelAOffsetY: 5.5,
  labelBOffsetX: 4.5,
  // Single font size for every SVG label (P, P', a, b) — increase to make all labels bigger
  labelFontSize: 6,
};

const svgLabelTextProps = (x, y, textAnchor) => ({
  x: x,
  y: y,
  textAnchor: textAnchor || "middle",
  dominantBaseline: "middle",
  fontSize: DIAG.labelFontSize,
});

const TranslationDiagram = (props) => {
  const {
    showPinkPoint = false,
    showPinkLabel = false,
    showHorizontalLine = false,
    showVerticalLine = false,
    showLabelA = false,
    showLabelB = false,
    imageLabelMode = "hidden",
    showYellowPoint = false,
    showHypotenuseArrow = false,
    arrowLineDrawing = false,
    arrowGrowProgress = 0,
    arrowHeadVisible = false,
    arrowGlow = false,
    svgDimmed = false,
    highlightPPrimeLabel = false,
    highlightPLabel = false,
    blinkTranslationLines = false,
    blinkPPrimeLabel = false,
    blinkPLabel = false,
    pPrimeCoordsRef,
    pCoordsRef,
    pLabelRef,
    pPrimeLabelRef,
    labelARef,
    labelBRef,
    pLabelFlyTargetRef,
    pPrimeFlyTargetRef,
    labelAFlyTargetRef,
    labelBFlyTargetRef,
    pPrimeSlotXRef,
    pPrimeSlotYRef,
    pPrimeSlotARef,
    pPrimeSlotBRef,
    pPrimeSlotPlus1Ref,
    pPrimeSlotPlus2Ref,
  } = props;

  const labels = APP_DATA.svgLabels;
  const cornerX = DIAG.pPrimeX;
  const cornerY = DIAG.pY;
  const midAX = (DIAG.pX + cornerX) / 2;
  const midBY = (DIAG.pY + DIAG.pPrimeY) / 2;
  const pLabelY = DIAG.pY + DIAG.labelPOffsetY;
  const pPrimeLabelY = DIAG.pPrimeY + DIAG.labelPPrimeOffsetY;

  const arrowEndX = DIAG.pX + (DIAG.pPrimeX - DIAG.pX) * arrowGrowProgress;
  const arrowEndY = DIAG.pY + (DIAG.pPrimeY - DIAG.pY) * arrowGrowProgress;

  const renderFlyTargets = () =>
    React.createElement(
      "g",
      { className: "diag-fly-targets", "aria-hidden": "true" },
      React.createElement(
        "text",
        {
          ref: pLabelFlyTargetRef,
          className: "diag-label-text diag-fly-target",
          ...svgLabelTextProps(DIAG.pX, pLabelY),
        },
        labels.pLabel +
          " " +
          labels.openParen +
          labels.x +
          labels.comma +
          " " +
          labels.y +
          labels.closeParen,
      ),
      React.createElement(
        "text",
        {
          ref: pPrimeFlyTargetRef,
          className: "diag-label-text diag-fly-target",
          ...svgLabelTextProps(DIAG.pPrimeX, pPrimeLabelY),
        },
        labels.pPrime +
          " " +
          labels.openParen +
          labels.underscore +
          labels.comma +
          " " +
          labels.underscore +
          labels.closeParen,
      ),
      React.createElement(
        "text",
        {
          ref: labelAFlyTargetRef,
          className: "diag-label-text diag-fly-target",
          ...svgLabelTextProps(midAX, DIAG.pY + DIAG.labelAOffsetY),
        },
        labels.a,
      ),
      React.createElement(
        "text",
        {
          ref: labelBFlyTargetRef,
          className: "diag-label-text diag-fly-target",
          ...svgLabelTextProps(cornerX + DIAG.labelBOffsetX, midBY, "start"),
        },
        labels.b,
      ),
    );

  const renderPinkLabel = () => {
    if (!showPinkLabel) return null;
    const labelClass =
      "diag-label-group" +
      (svgDimmed && !highlightPLabel ? " diag-dimmable" : "") +
      (highlightPLabel ? " diag-highlight" : "");
    return React.createElement(
      "g",
      {
        ref: pLabelRef,
        className: labelClass,
      },
      React.createElement(
        "text",
        svgLabelTextProps(DIAG.pX, pLabelY),
        React.createElement("tspan", { className: "color-pink" }, labels.pLabel),
        React.createElement(
          "tspan",
          {
            ref: pCoordsRef,
            className: "color-pink" + (blinkPLabel ? " diag-blink" : ""),
          },
          " " + labels.openParen,
          React.createElement(
            "tspan",
            { className: "color-pink", "data-char": "x" },
            labels.x,
          ),
          React.createElement("tspan", { className: "color-pink" }, labels.comma + " "),
          React.createElement(
            "tspan",
            { className: "color-pink", "data-char": "y" },
            labels.y,
          ),
          React.createElement("tspan", { className: "color-pink" }, labels.closeParen),
        ),
      ),
    );
  };

  const renderImageLabel = () => {
    if (imageLabelMode === "hidden") return null;

    const isPlaceholder = imageLabelMode === "placeholder";
    const isFormula = imageLabelMode === "formula";

    const pPrimeClass =
      "diag-label-group" +
      (svgDimmed && !highlightPPrimeLabel ? " diag-dimmable" : "") +
      (highlightPPrimeLabel ? " diag-highlight" : "");

    return React.createElement(
      "g",
      {
        ref: pPrimeLabelRef,
        className: pPrimeClass,
      },
      React.createElement(
        "text",
        svgLabelTextProps(DIAG.pPrimeX, pPrimeLabelY),
        React.createElement("tspan", { className: "color-blue" }, labels.pPrime),
        isPlaceholder
          ? React.createElement(
              "tspan",
              { className: "color-blue" },
              " " +
                labels.openParen +
                labels.underscore +
                labels.comma +
                " " +
                labels.underscore +
                labels.closeParen,
            )
          : null,
        isFormula
          ? React.createElement(
              "tspan",
              {
                ref: pPrimeCoordsRef,
                className: "color-blue" + (blinkPPrimeLabel ? " diag-blink" : ""),
              },
              " " + labels.openParen,
              React.createElement(
                "tspan",
                {
                  ref: pPrimeSlotXRef,
                  className: "color-pink slot-hidden",
                  "data-char": "x",
                },
                labels.x,
              ),
              React.createElement(
                "tspan",
                {
                  ref: pPrimeSlotPlus1Ref,
                  className: "color-white slot-hidden",
                },
                labels.plus,
              ),
              React.createElement(
                "tspan",
                {
                  ref: pPrimeSlotARef,
                  className: "color-yellow slot-hidden",
                  "data-char": "a",
                },
                labels.a,
              ),
              React.createElement("tspan", { className: "color-blue" }, labels.comma + " "),
              React.createElement(
                "tspan",
                {
                  ref: pPrimeSlotYRef,
                  className: "color-pink slot-hidden",
                  "data-char": "y",
                },
                labels.y,
              ),
              React.createElement(
                "tspan",
                {
                  ref: pPrimeSlotPlus2Ref,
                  className: "color-white slot-hidden",
                },
                labels.plus,
              ),
              React.createElement(
                "tspan",
                {
                  ref: pPrimeSlotBRef,
                  className: "color-yellow slot-hidden",
                  "data-char": "b",
                },
                labels.b,
              ),
              labels.closeParen,
            )
          : null,
      ),
    );
  };

  return React.createElement(
    "div",
    { className: "translation-diagram-panel" },
    React.createElement(
      "svg",
      {
        className: "translation-diagram-svg",
        viewBox: "0 0 " + DIAG.viewW + " " + DIAG.viewH,
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "marker",
          {
            id: "diag-hypotenuse-arrowhead",
            markerWidth: 3,
            markerHeight: 3,
            refX: 2.6,
            refY: 1.5,
            orient: "auto",
            markerUnits: "userSpaceOnUse",
          },
          React.createElement("path", {
            d: "M0,0 L3,1.5 L0,3 Z",
            fill: DIAG.hypotenuseColor,
          }),
        ),
      ),
      renderFlyTargets(),
      showHorizontalLine
        ? React.createElement("line", {
            className:
              "diag-line diag-line-h" +
              (blinkTranslationLines ? " diag-blink" : ""),
            x1: DIAG.pX,
            y1: DIAG.pY,
            x2: cornerX,
            y2: cornerY,
            stroke: DIAG.translationLineColor,
            strokeWidth: DIAG.lineWidth,
            strokeDasharray: DIAG.dashArray,
          })
        : null,
      showVerticalLine
        ? React.createElement("line", {
            className:
              "diag-line diag-line-v" +
              (blinkTranslationLines ? " diag-blink" : ""),
            x1: cornerX,
            y1: cornerY,
            x2: DIAG.pPrimeX,
            y2: DIAG.pPrimeY,
            stroke: DIAG.translationLineColor,
            strokeWidth: DIAG.lineWidth,
            strokeDasharray: DIAG.dashArray,
          })
        : null,
      showPinkPoint
        ? React.createElement("circle", {
            className: "diag-point color-pink",
            cx: DIAG.pX,
            cy: DIAG.pY,
            r: DIAG.pointR,
          })
        : null,
      renderPinkLabel(),
      showLabelA
        ? React.createElement(
            "text",
            {
              ref: labelARef,
              className:
                "diag-label-group diag-label-text color-yellow" +
                (blinkTranslationLines ? " diag-blink" : ""),
              "data-char": "a",
              ...svgLabelTextProps(midAX, DIAG.pY + DIAG.labelAOffsetY),
            },
            labels.a,
          )
        : null,
      showLabelB
        ? React.createElement(
            "text",
            {
              ref: labelBRef,
              className:
                "diag-label-group diag-label-text color-yellow" +
                (blinkTranslationLines ? " diag-blink" : ""),
              "data-char": "b",
              ...svgLabelTextProps(cornerX + DIAG.labelBOffsetX, midBY, "start"),
            },
            labels.b,
          )
        : null,
      renderImageLabel(),
      showYellowPoint
        ? React.createElement("circle", {
            className: "diag-point color-orange visible",
            cx: DIAG.pPrimeX,
            cy: DIAG.pPrimeY,
            r: DIAG.pointR,
          })
        : null,
      showHypotenuseArrow
        ? React.createElement(
            "g",
            {
              className:
                "diag-arrow-glow diag-dimmable" +
                (arrowGlow ? " visible" : "") +
                (svgDimmed ? " dimmed" : ""),
            },
            React.createElement("line", {
              className: "diag-arrow-path",
              x1: DIAG.pX,
              y1: DIAG.pY,
              x2: arrowEndX,
              y2: arrowEndY,
              stroke: DIAG.hypotenuseColor,
              strokeWidth: DIAG.hypotenuseWidth,
              strokeDasharray: DIAG.dashArray,
              markerEnd: arrowHeadVisible
                ? "url(#diag-hypotenuse-arrowhead)"
                : undefined,
              opacity: arrowLineDrawing ? 1 : 0,
            }),
          )
        : null,
    ),
  );
};
