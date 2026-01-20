const FractionPanel = ({
  percentNumber = "",
  percentSymbol = "%",
  showPercent = true,
  showEquals = true,
  showFraction = false, // Kept for backward compat if needed, but we mostly use leftSideType now
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
  showArrowToDecimal = false, // New arrow for Step 4
  showArrowToPercent = false, // New arrow for Step 4
  wide = false,
  leftSideType = "fraction", // "fraction" | "decimal" | "decimal-highlight" | "decimal-breakdown"
  decimalValue = "0.27",
}) => {
  // Classes for pulsate animation
  const numberClass = "";
  const percentClass = "";

  // Panel class based on width mode
  const panelClass = `fraction-panel ${wide ? "fraction-panel-wide" : ""}`;

  // --- ARROWS ---

  // Arrow 1: From Blue Box (Decimal breakdown) to Percent Number
  const arrowToDecimalVisual = showArrowToDecimal && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-decimal-head", markerWidth: "4", markerHeight: "3", refX: "0.5", refY: "1.5", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 4 1.5, 0 3", fill: "#4fc3f7" }))
    ),
    React.createElement("path", {
      d: "M 35 35 L 35 15 L 80 15 L 80 40", // Up from box, right, down to number
      stroke: "#4fc3f7", strokeWidth: "1", fill: "none", markerEnd: "url(#arrow-decimal-head)"
    })
  );

  // Arrow 2: From Hundredths Label to Percent Symbol
  const arrowToPercentVisual = showArrowToPercent && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-percent-head", markerWidth: "4", markerHeight: "3", refX: "0.5", refY: "1.5", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 4 1.5, 0 3", fill: "white" }))
    ),
    React.createElement("path", {
      d: "M 44 75 L 44 85 L 85 85 L 85 63", // Down from label, right, up to symbol
      stroke: "white", strokeWidth: "1", fill: "none", markerEnd: "url(#arrow-percent-head)"
    })
  );

  // --- RENDER HELPERS ---

  const renderDecimalBox = () => {
    // Check if we need to highlight "27" in "0.27"
    const parts = decimalValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    if (leftSideType === "decimal-highlight" && decimalPart) {
      return React.createElement("span", { className: "decimal-text" },
        integerPart,
        ".",
        React.createElement("span", { style: { color: "#4fc3f7" } }, decimalPart)
      );
    }
    return React.createElement("span", { className: "decimal-text" }, decimalValue);
  };

  const renderBreakdown = () => {
    // 0 . [2 7] matches reference style
    const parts = decimalValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || "00";
    const tenths = decimalPart[0];
    const hundredths = decimalPart[1];

    return React.createElement("div", { className: "breakdown-container-4" },
       
       // Ones Column
       React.createElement("div", { className: "decimal-box-4-wrapper" },
          React.createElement("div", { className: "decimal-box-4" }, integerPart),
          React.createElement("div", { className: "box-label-4" }, "Ones")
       ),
       
       // Decimal Point
       React.createElement("div", { className: "decimal-point-4" }),

       // Tenths/Hundredths Group
       React.createElement("div", { className: "group-col-wrapper" },
           // Dashed Box around Numbers
           React.createElement("div", { className: "dashed-blue-box" },
               React.createElement("div", { className: "decimal-box-4 text-blue" }, tenths),
               React.createElement("div", { className: "decimal-box-4 text-blue" }, hundredths)
           ),
           // Labels below
           React.createElement("div", { className: "group-labels-row" },
               React.createElement("div", { className: "label-wrapper" }, 
                   React.createElement("div", { className: "box-label-4" }, "Tenths")
               ),
               React.createElement("div", { className: "label-wrapper" }, 
                   React.createElement("div", { className: "box-label-4", id: "label-hundredths" }, "Hundredths")
               )
           )
       )
    );
  };
 
  const renderLeftSide = () => {
    if (leftSideType === "fraction") {
       return React.createElement(
        "div",
        { 
          className: "fraction-box",
          style: { opacity: fractionHidden ? 0 : 1 }
        },
        React.createElement(
          "div",
          { className: "fraction-display" },
          React.createElement("span", { className: `fraction-numerator`, style: { color: highlightNumerator ? numberColor : "white" } }, numerator),
          React.createElement("div", { className: "fraction-line-green" }),
          React.createElement("span", { className: `fraction-denominator` }, denominator)
        )
      );
    }

    if (leftSideType === "decimal-breakdown") {
      return renderBreakdown();
    } // ... rest of function remains same (will be preserved by replace_file_content context matching? No, I need to include the rest of renderLeftSide to be safe or target carefully)
    
    // Default: Decimal Box (Simple or Highlight)
    return React.createElement(
        "div",
        { 
          className: "decimal-val-box",
          style: { opacity: fractionHidden ? 0 : 1 }
        },
        renderDecimalBox()
    );
  };


  return React.createElement(
    "div",
    { className: panelClass },
    
    // Arrows container
    (showArrowToDecimal || showArrowToPercent) && React.createElement(
      "div",
      { className: "arrows-container" },
      showArrowToDecimal && React.createElement("div", { className: "annotation-box top-annotation" }, "Number of Hundredths = Number"),
      showArrowToPercent && React.createElement("div", { className: "annotation-box bottom-annotation" }, "Hundredths = out of 100"),
      arrowToDecimalVisual,
      arrowToPercentVisual
    ),

    React.createElement(
      "div",
      { className: "fraction-equation-row" },
      
      // Left Side (Fraction or Decimal)
      renderLeftSide(),

      // Equals Sign
      showEquals && React.createElement(
        "span",
        { 
          className: "fraction-equals-sign",
          style: { opacity: decimalHidden ? 0 : 1 }
        },
        "="
      ),

      // Right Side (Percent Box)
      showPercent && React.createElement(
        "div",
        { 
          className: "decimal-box", // Keeping class name 'decimal-box' for the Percent Box on right
          style: { opacity: decimalHidden ? 0 : 1 }
        },
        React.createElement(
          "span",
          { 
            className: `percent-number ${numberClass}`,
            style: { color: numberColor } // Driven by highlightNumerator prop in data (bluish)
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
