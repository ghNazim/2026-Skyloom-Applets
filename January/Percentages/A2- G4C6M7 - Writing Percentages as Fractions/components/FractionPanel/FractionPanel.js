const FractionPanel = ({
  percentNumber = "",
  percentSymbol = "%",
  showPercent = true,
  showEquals = true,
  showFraction = false,
  numerator = "",
  denominator = "100",
  highlightNumerator = false,
  highlightDenominator = false,
  pulsateNumber = false,
  pulsatePercent = false,
  pulsateNumerator = false,
  pulsateDenominator = false,
  numberColor = "#4fc3f7", // Bluish
  percentColor = "white",
  fractionHidden = false,
  decimalHidden = false, // Control opacity of decimal/equals part
  showArrowToDenominator = false,
  showArrowToNumerator = false,
  arrowAnnotationTop = "",
  arrowAnnotationBottom = "",
  wide = false,
  step =0,
}) => {
  // Classes for pulsate animation
  const numberClass = "";
  const percentClass = "";
  const numeratorClass = ``;
  const denominatorClass = ``;

  // Panel class based on width mode
  const panelClass = `fraction-panel ${wide ? "fraction-panel-wide" : ""}`;

  // Arrow to Denominator (White)
  // From Denominator (Bottom Left) -> Percent Symbol (Right)
  // Coordinates are roughly percentages of the container
  const arrowToDenominator = showArrowToDenominator && React.createElement(
    "svg",
    { 
      className: "arrow-to-denominator",
      viewBox: "0 0 100 100",
      preserveAspectRatio: "none"
    },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrowhead-denom",
        markerWidth: "5",
        markerHeight: "6",
        refX: "0",
        refY: "3",
        orient: "auto"
      },
        React.createElement("polygon", {
          points: "0 0, 5 3, 0 6",
          fill: "#ffffff"
        })
      )
    ),
    React.createElement("path", {
      // M 28,68 (Bottom of Denom) -> Down to 90 -> Right to 90 -> Up to 68 (Bottom of %)
      d: "M 28 72 L 28 78 L 76 78 L 76 62", 
      stroke: "#ffffff",
      strokeWidth: "2",
      fill: "none",
      markerEnd: "url(#arrowhead-denom)",
      vectorEffect: "non-scaling-stroke"
    })
  );

  // Arrow to Numerator (Blue)
  // From Numerator (Top Left) -> Number (Right)
  const arrowToNumerator = showArrowToNumerator && React.createElement(
    "svg",
    { 
      className: "arrow-to-numerator",
      viewBox: "0 0 100 100",
      preserveAspectRatio: "none"
    },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrowhead-numer",
        markerWidth: "5",
        markerHeight: "6",
        refX: "0",
        refY: "3",
        orient: "auto"
      },
        React.createElement("polygon", {
          points: "0 0, 5 3, 0 6",
          fill: "#4fc3f7"
        })
      )
    ),
    React.createElement("path", {
      // M 28,32 (Top of Num) -> Up to 15 -> Right to 75 -> Down to 27 (Top of Number)
      d: "M 30 32 L 30 25 L 65 25 L 65 40",
      stroke: "#4fc3f7",
      strokeWidth: "2",
      fill: "none",
      markerEnd: "url(#arrowhead-numer)",
      vectorEffect: "non-scaling-stroke"
    })
  );

  return React.createElement(
    "div",
    { className: panelClass },
    // Arrows container (positioned absolutely)
    (showArrowToDenominator || showArrowToNumerator) && React.createElement(
      "div",
      { className: "arrows-container" },
      // Text annotations
      showArrowToNumerator && arrowAnnotationTop && React.createElement("div", { className: "annotation-box top-annotation" }, arrowAnnotationTop),
      showArrowToDenominator && arrowAnnotationBottom && React.createElement("div", { className: "annotation-box bottom-annotation" }, arrowAnnotationBottom),
      arrowToNumerator,
      arrowToDenominator
    ),
    React.createElement(
      "div",
      { className: "fraction-equation-row" },
      // Fraction Box
      showFraction && React.createElement(
        "div",
        { 
          className: "fraction-box",
          style: { opacity: fractionHidden ? 0 : 1 }
        },
        React.createElement(
          "div",
          { className: "fraction-display" },
          React.createElement(
            "span",
            { 
              className: `fraction-numerator ${numeratorClass}`,
              style: { color: highlightNumerator ? numberColor : "white" }
            },
            numerator
          ),
          React.createElement("div", { className: "fraction-line-green" }),
          React.createElement(
            "span",
            { className: `fraction-denominator ${denominatorClass}` },
            denominator
          )
        )
      ),
      // Equals Sign
      showEquals && React.createElement(
        "span",
        { 
          className: "fraction-equals-sign",
          style: { opacity: decimalHidden ? 0 : 1 }
        },
        "="
      ),
      // Decimal/Percent Box
      showPercent && React.createElement(
        "div",
        { 
          className: "decimal-box" + (step !=4 ? " bordered" : ""),
          style: { opacity: decimalHidden ? 0 : 1 }
        },
        React.createElement(
          "span",
          { 
            className: `percent-number ${numberClass}`,
            style: { color: numberColor }
          },
          percentNumber
        ),
        React.createElement(
          "span",
          { 
            className: `percent-symbol ${percentClass}`,
            style: { color: percentColor }
          },
          percentSymbol
        )
      )
    )
  );
};
