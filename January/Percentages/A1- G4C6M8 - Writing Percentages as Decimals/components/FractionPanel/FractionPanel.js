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
  numberColor = "#4fc3f7", 
  percentColor = "white",
  fractionHidden = false,
  decimalHidden = false, 
  showArrowToDenominator = false,
  showArrowToNumerator = false,
  showArrowToDecimal = false, 
  showArrowToPercent = false, 
  showArrowRightToLeft = false, // New prop for reversed arrows
  wide = false,
  leftSideType = "fraction", 
  decimalValue = "0.27",
  reversedLayout = false, 
  pulsateTenths = false,
  pulsateHundredths = false,
  highlightOnes = false,
  highlightTenths = false,
  highlightHundredths = false,
  activeLabels = false,
  equalsHidden = false,
  groupedBreakdown = false, // Toggle for grouped vs individual layout
}) => {
  const numberClass = "";
  const percentClass = "";
  const panelClass = `fraction-panel ${wide ? "fraction-panel-wide" : ""}`;

  // --- ARROWS ---

  // Arrow 1: Decimal (Left) -> Number (Right) [Standard Layout]
  const arrowToDecimalVisual = showArrowToDecimal && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-decimal-head", markerWidth: "4", markerHeight: "3", refX: "0.5", refY: "1.5", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 4 1.5, 0 3", fill: "#4fc3f7" }))
    ),
    React.createElement("path", {
      d: "M 35 35 L 35 15 L 80 15 L 80 40", 
      stroke: "#4fc3f7", strokeWidth: "1", fill: "none", markerEnd: "url(#arrow-decimal-head)"
    })
  );

  // Arrow 2: Label (Left) -> Symbol (Right) [Standard Layout]
  const arrowToPercentVisual = showArrowToPercent && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-percent-head", markerWidth: "4", markerHeight: "3", refX: "0.5", refY: "1.5", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 4 1.5, 0 3", fill: "white" }))
    ),
    React.createElement("path", {
      d: "M 44 75 L 44 85 L 85 85 L 85 63",
      stroke: "white", strokeWidth: "1", fill: "none", markerEnd: "url(#arrow-percent-head)"
    })
  );

  // Arrow 3: Decimal (Right) -> Number (Left) [Reversed Layout]
  const arrowRightToLeftUpper = showArrowRightToLeft && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-rev-upper-head", markerWidth: "4", markerHeight: "3", refX: "0.5", refY: "1.5", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 4 1.5, 0 3", fill: "#4fc3f7" }))
    ),
    React.createElement("path", {
      d: "M 72 35 L 72 15 L 17 15 L 17 39", // Up from right, left, down to left
      stroke: "#4fc3f7", strokeWidth: "1", fill: "none", markerEnd: "url(#arrow-rev-upper-head)"
    })
  );

  // Arrow 4: Label (Right) -> Symbol (Left) [Reversed Layout]
  const arrowRightToLeftLower = showArrowRightToLeft && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-rev-lower-head", markerWidth: "4", markerHeight: "3", refX: "0.5", refY: "1.5", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 4 1.5, 0 3", fill: "white" }))
    ),
    React.createElement("path", {
      d: "M 88 75 L 88 85 L 24 85 L 24 62", // Down from right, left, up to left
      stroke: "white", strokeWidth: "1", fill: "none", markerEnd: "url(#arrow-rev-lower-head)"
    })
  );

  // --- RENDER HELPERS ---

  const renderDecimalBox = () => {
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
    const parts = decimalValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || "00";
    const tenths = decimalPart[0];
    const hundredths = decimalPart[1];

    const tenthsClass = `decimal-box-4 text-blue ${pulsateTenths ? "pulsate" : ""} ${highlightTenths ? "decimal-highlight" : ""}`;
    const hundredthsClass = `decimal-box-4 text-blue ${pulsateHundredths ? "pulsate" : ""} ${highlightHundredths ? "decimal-highlight" : ""}`;
    const onesClass = `decimal-box-4 ${highlightOnes ? "white-box" : ""}`;
    
    // Labels
    const labelOnesClass = `box-label-4 ${highlightOnes ? "" : ""}`;
    const labelTenthsClass = `box-label-4 ${activeLabels ? "active" : ""} ${highlightTenths ? "label-highlight" : ""}`;
    const labelHundredthsClass = `box-label-4 ${activeLabels ? "active" : ""} ${highlightHundredths ? "label-highlight" : ""}`;

    // Grouped Layout (Step 6)
    if (groupedBreakdown) {
       return React.createElement("div", { className: "breakdown-container-4" },
          React.createElement("div", { className: "decimal-box-4-wrapper" },
             React.createElement("div", { className: "decimal-box-4" }, integerPart),
             React.createElement("div", { className: "box-label-4" }, "Ones")
          ),
          React.createElement("div", { className: "decimal-point-4" }),
          React.createElement("div", { className: "group-col-wrapper" },
              React.createElement("div", { className: "dashed-blue-box" },
                  React.createElement("div", { className: tenthsClass }, tenths),
                  React.createElement("div", { className: hundredthsClass }, hundredths)
              ),
              React.createElement("div", { className: "group-labels-row" },
                  React.createElement("div", { className: "label-wrapper" }, 
                      React.createElement("div", { className: labelTenthsClass }, "Tenths")
                  ),
                  React.createElement("div", { className: "label-wrapper" }, 
                      React.createElement("div", { className: labelHundredthsClass, id: "label-hundredths" }, "Hundredths")
                  )
              )
          )
       );
    }
    
    // Ungrouped Layout (Steps 2-5, Individual Boxes)
    return React.createElement("div", { className: "breakdown-container-4" },
       // Ones
       React.createElement("div", { className: "decimal-box-4-wrapper" },
          React.createElement("div", { 
            className: onesClass,
          }, integerPart),
          React.createElement("div", { className: labelOnesClass }, "Ones")
       ),
       
       // Dot
       React.createElement("div", { className: "decimal-point-4" }),
       
       // Tenths
       React.createElement("div", { className: "decimal-box-4-wrapper" },
          React.createElement("div", { 
            className: tenthsClass, 
          }, tenths), 
          React.createElement("div", { className: labelTenthsClass }, "Tenths")
       ),
       
       // Hundredths
       React.createElement("div", { className: "decimal-box-4-wrapper" },
          React.createElement("div", { 
            className: hundredthsClass, 
          }, hundredths), 
          React.createElement("div", { className: labelHundredthsClass }, "Hundredths")
       )
    );
  };
 
  const renderLeftSideContent = () => {
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
    }
    
    return React.createElement(
        "div",
        { 
          className: "decimal-val-box",
          style: { opacity: fractionHidden ? 0 : 1 }
        },
        renderDecimalBox()
    );
  };

  const renderPercentBox = () => {
    return React.createElement(
        "div",
        { 
          className: "decimal-box", 
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

    // Reversed Arrows container
    showArrowRightToLeft && React.createElement(
      "div",
      { className: "arrows-container" },
       // Note: Annotations positions might need tuning for reversed layout. 
       // I'll reuse the class names but we might need new CSS classes if they overlap.
       // For now assuming existing classes might just work or need minor CSS tweak.
      React.createElement("div", { className: "annotation-box top-annotation" }, "Number = Number of Hundredths"),
      React.createElement("div", { className: "annotation-box bottom-annotation" }, "% (out of 100) = Hundredths"),
      arrowRightToLeftUpper,
      arrowRightToLeftLower
    ),

    React.createElement(
      "div",
      { className: "fraction-equation-row" },
      
      // Item 1 (Left by default)
      reversedLayout && showPercent ? renderPercentBox() : renderLeftSideContent(),

      // Equals Sign
      showEquals && React.createElement(
        "span",
        { 
          className: "fraction-equals-sign",
          style: { opacity: equalsHidden || decimalHidden ? 0 : 1 }
        },
        "="
      ),

      // Item 2 (Right by default)
      reversedLayout && showPercent ? renderLeftSideContent() : (showPercent && renderPercentBox())
    )
  );
};
