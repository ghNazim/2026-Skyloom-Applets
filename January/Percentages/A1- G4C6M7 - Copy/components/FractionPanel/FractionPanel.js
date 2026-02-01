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
  showArrowToDenominator = false,
  showArrowToNumerator = false,
  wide = false,
  step = 0,
}) => {
  // Classes for pulsate animation
  const numberClass = pulsateNumber ? "pulsate" : "";
  const percentClass = pulsatePercent ? "pulsate" : "";
  const numeratorClass = `${highlightNumerator ? "highlight-box" : ""} `;
  const denominatorClass = `${highlightDenominator ? "highlight-box" : ""} `;

  // Panel class based on width mode
  const panelClass = `fraction-panel ${wide ? "fraction-panel-wide" : ""}`;

  // Arrow to Denominator (from % symbol, goes down then right)
  const arrowToDenominator = showArrowToDenominator && React.createElement(
    "svg",
    { 
      className: "arrow-to-denominator",
      viewBox: "0 0 100 60",
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
      d: "M 5 5 L 5 50 L 94 50",
      stroke: "#ffffff",
      strokeWidth: "2",
      fill: "none",
      markerEnd: "url(#arrowhead-denom)",
      vectorEffect: "non-scaling-stroke"
    })
  );

  // Arrow to Numerator (from number, goes up then right)
  const arrowToNumerator = showArrowToNumerator && React.createElement(
    "svg",
    { 
      className: "arrow-to-numerator",
      viewBox: "0 0 100 60",
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
      d: "M 8 55 L 8 30 L 105 30",
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
      arrowToNumerator,
      arrowToDenominator
    ),
    React.createElement(
      "div",
      { className: "fraction-equation-row" },
      // Decimal/Percent Box
      showPercent && React.createElement(
        "div",
        { className: "decimal-box" + (step===1 ? " bordered" : "") },
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
      ),
      // Equals Sign
      showEquals && React.createElement(
        "span",
        { className: "fraction-equals-sign" },
        "="
      ),
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
            React.createElement("span", { className: "fraction-numerator-text" + (pulsateNumerator ? " pulsate" : "") }, numerator),
            
          ),
          React.createElement("div", { className: "fraction-line-green" }),
          React.createElement(
            "span",
            { className: `fraction-denominator ${denominatorClass}` },
            React.createElement("span", { className: "fraction-denominator-text" + (pulsateDenominator ? " pulsate" : "") }, denominator),
          )
        )
      )
    )
  );
};
