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
}) => {
  // Classes for pulsate animation
  const numberClass = pulsateNumber ? "pulsate" : "";
  const percentClass = pulsatePercent ? "pulsate" : "";
  const numeratorClass = `${highlightNumerator ? "highlight-box" : ""} ${pulsateNumerator ? "pulsate" : ""}`;
  const denominatorClass = `${highlightDenominator ? "highlight-box" : ""} ${pulsateDenominator ? "pulsate" : ""}`;

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
        markerWidth: "6",
        markerHeight: "4",
        refX: "1",
        refY: "2",
        orient: "auto"
      },
        React.createElement("polygon", {
          points: "0 0, 6 2, 0 4",
          fill: "rgba(255, 255, 255, 1)"
        })
      )
    ),
    React.createElement("path", {
      d: "M 5 5 L 5 50 L 90 50",
      stroke: "#ffffff",
      strokeWidth: "3",
      fill: "none",
      markerEnd: "url(#arrowhead-denom)"
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
        markerWidth: "6",
        markerHeight: "4",
        refX: "1",
        refY: "2",
        orient: "auto"
      },
        React.createElement("polygon", {
          points: "0 0, 6 2, 0 4",
          fill: "rgba(79, 195, 247, 1)"
        })
      )
    ),
    React.createElement("path", {
      d: "M 5 55 L 5 10 L 90 10",
      stroke: "#4fc3f7",
      strokeWidth: "3",
      fill: "none",
      markerEnd: "url(#arrowhead-numer)"
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
        { className: "decimal-box" },
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
            numerator
          ),
          React.createElement("div", { className: "fraction-line-green" }),
          React.createElement(
            "span",
            { className: `fraction-denominator ${denominatorClass}` },
            denominator
          )
        )
      )
    )
  );
};
