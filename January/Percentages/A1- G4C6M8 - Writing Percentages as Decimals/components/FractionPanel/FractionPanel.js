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
  step = 0,
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
        id: "arrow-decimal-head", markerWidth: "5", markerHeight: "6", refX: "0", refY: "3", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 5 3, 0 6", fill: "#4fc3f7" }))
    ),
    React.createElement("path", {
      d: "M 35 35 L 35 15 L 80 15 L 80 40", 
      stroke: "#4fc3f7", strokeWidth: "2", fill: "none", markerEnd: "url(#arrow-decimal-head)", vectorEffect: "non-scaling-stroke"
    })
  );

  // Arrow 2: Label (Left) -> Symbol (Right) [Standard Layout]
  const arrowToPercentVisual = showArrowToPercent && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-percent-head", markerWidth: "5", markerHeight: "6", refX: "0", refY: "3", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 5 3, 0 6", fill: "white" }))
    ),
    React.createElement("path", {
      d: "M 44 75 L 44 85 L 85 85 L 85 63",
      stroke: "white", strokeWidth: "2", fill: "none", markerEnd: "url(#arrow-percent-head)", vectorEffect: "non-scaling-stroke"
    })
  );

  // Arrow 3: Decimal (Right) -> Number (Left) [Reversed Layout]
  const arrowRightToLeftUpper = showArrowRightToLeft && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-rev-upper-head", markerWidth: "5", markerHeight: "6", refX: "0", refY: "3", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 5 3, 0 6", fill: "#4fc3f7" }))
    ),
    React.createElement("path", {
      d: "M 72 35 L 72 15 L 17 15 L 17 39", // Up from right, left, down to left
      stroke: "#4fc3f7", strokeWidth: "2", fill: "none", markerEnd: "url(#arrow-rev-upper-head)", vectorEffect: "non-scaling-stroke"
    })
  );

  // Arrow 4: Label (Right) -> Symbol (Left) [Reversed Layout]
  const arrowRightToLeftLower = showArrowRightToLeft && React.createElement(
    "svg",
    { className: "arrow-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    React.createElement("defs", null,
      React.createElement("marker", {
        id: "arrow-rev-lower-head", markerWidth: "5", markerHeight: "6", refX: "0", refY: "3", orient: "auto"
      }, React.createElement("polygon", { points: "0 0, 5 3, 0 6", fill: "white" }))
    ),
    React.createElement("path", {
      d: "M 88 70 L 88 85 L 24 85 L 24 62", // Down from right, left, up to left
      stroke: "white", strokeWidth: "2", fill: "none", markerEnd: "url(#arrow-rev-lower-head)", vectorEffect: "non-scaling-stroke"
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
        decimalSymbol,
        React.createElement("span", { style: { color: "#4fc3f7" } }, decimalPart)
      );
    }
    return React.createElement("span", { className: "decimal-text" , dangerouslySetInnerHTML: { __html: handleComma(decimalValue) } },);
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
       // Render decimal point or comma based on language
       const decimalPointElement = decimalSymbol === "," 
         ? React.createElement("div", { className: "decimal-point-4" },
             React.createElement("img", { src: "assets/comma.svg", alt: "," })
           )
         : React.createElement("div", { className: "decimal-point-4" });
       
       return React.createElement("div", { className: "breakdown-container-4" },
          React.createElement("div", { className: "decimal-box-4-wrapper ones-box" },
             React.createElement("div", { className: "decimal-box-4" }, integerPart),
             React.createElement("div", { className: "box-label-4 ones-label" }, APP_DATA.labels.ones)
          ),
          decimalPointElement,
          React.createElement("div", { className: "group-col-wrapper" },
              React.createElement("div", { className: "dashed-blue-box" },
                  React.createElement("div", { className: tenthsClass }, tenths),
                  React.createElement("div", { className: hundredthsClass }, hundredths)
              ),
              React.createElement("div", { className: "group-labels-row" },
                  React.createElement("div", { className: "label-wrapper" }, 
                      React.createElement("div", { className: labelTenthsClass }, APP_DATA.labels.tenths)
                  ),
                  React.createElement("div", { className: "label-wrapper" }, 
                      React.createElement("div", { className: labelHundredthsClass, id: "label-hundredths" }, APP_DATA.labels.hundredths)
                  )
              )
          )
       );
    }
    
    // Ungrouped Layout (Steps 2-5, Individual Boxes)
    // Render decimal point or comma based on language
    const decimalPointElement = decimalSymbol === "," 
      ? React.createElement("div", { className: "decimal-point-4" },
          React.createElement("img", { src: "assets/comma.svg", alt: "," })
        )
      : React.createElement("div", { className: "decimal-point-4" });
    
    return React.createElement("div", { className: "breakdown-container-4" },
       // Ones
       React.createElement("div", { className: "decimal-box-4-wrapper" },
          React.createElement("div", { 
            className: onesClass,
          }, integerPart),
          React.createElement("div", { className: labelOnesClass }, APP_DATA.labels.ones)
       ),
       
       // Dot or Comma
       decimalPointElement,
       
       // Tenths
       React.createElement("div", { className: "decimal-box-4-wrapper" },
          React.createElement("div", { 
            className: tenthsClass, 
          }, tenths), 
          React.createElement("div", { className: labelTenthsClass }, APP_DATA.labels.tenths)
       ),
       
       // Hundredths
       React.createElement("div", { className: "decimal-box-4-wrapper" },
          React.createElement("div", { 
            className: hundredthsClass, 
          }, hundredths), 
          React.createElement("div", { className: labelHundredthsClass }, APP_DATA.labels.hundredths)
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
          className: "decimal-box" + (step === 8 ? " bordered" : ""), 
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
      showArrowToDecimal && React.createElement("div", { className: "annotation-box top-annotation" }, APP_DATA.arrowAnnotations.numberOfHundredthsEqualsNumber),
      showArrowToPercent && React.createElement("div", { className: "annotation-box bottom-annotation" }, APP_DATA.arrowAnnotations.hundredthsEqualsOutOf100),
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
      React.createElement("div", { className: "annotation-box top-annotation" }, APP_DATA.arrowAnnotations.numberEqualsNumberOfHundredths),
      React.createElement("div", { className: "annotation-box bottom-annotation" }, APP_DATA.arrowAnnotations.percentOutOf100EqualsHundredths),
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
