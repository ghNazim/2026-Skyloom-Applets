const Summary = ({ question, onContinue }) => {
  if (!question) return null;

  const q = question;
  const skipStep2 = q.skipStep2;
  const subheading = skipStep2
    ? APP_DATA.summarySubheadingNoConvert
    : APP_DATA.summarySubheadingWithConvert;
  const cardTexts = skipStep2
    ? APP_DATA.summaryCardTextsNoConvert
    : APP_DATA.summaryCardTexts;

  // Helper to render decimal with colored point/digit and digits (supports . and , for id locale)
  const renderColoredDecimal = (val, digitColorClass = "") => {
    const sep = val.includes(",") ? "," : ".";
    const parts = val.split(sep);
    if (parts.length !== 2) return val;
    const separatorEl =
      current_language === "id"
        ? React.createElement("cm", { className: "summary-decimal-comma text-pink" }, ",")
        : React.createElement("span", { className: "summary-decimal-point text-pink" }, ".");
    return React.createElement(
      React.Fragment,
      null,
      parts[0],
      separatorEl,
      React.createElement("span", { className: digitColorClass }, parts[1])
    );
  };

  // Helper to render decimal with one small bracket below each digit after decimal (for Card 3)
  const renderColoredDecimalWithBrackets = (val, digitColorClass = "") => {
    const sep = val.includes(",") ? "," : ".";
    const parts = val.split(sep);
    if (parts.length !== 2) return val;
    const decimalDigits = parts[1];
    const separatorEl =
      current_language === "id"
        ? React.createElement("cm", { className: "summary-decimal-comma text-pink" }, ",")
        : React.createElement("span", { className: "summary-decimal-point text-pink" }, ".");
    return React.createElement(
      React.Fragment,
      null,
      parts[0],
      separatorEl,
      ...decimalDigits.split("").map((digit, i) =>
        React.createElement(
          "span",
          { key: i, className: "summary-decimal-digit-with-bracket" },
          React.createElement("span", { className: digitColorClass }, digit),
          React.createElement("span", { className: "summary-decimal-bracket text-orange" })
        )
      )
    );
  };

  const renderDescription = (index) => {
    if (index >= cardTexts.length) return null;
    return React.createElement(
      "div",
      { className: "summary-step-container" },
      React.createElement(
        "div",
        { className: "summary-step-number" },
        index + 1
      ),
      React.createElement(
        "div",
        { className: "summary-step-text" },
        cardTexts[index]
      )
    );
  };

  const renderArrow = (key) => {
    return React.createElement(
      "div",
      { className: "summary-arrow-col", key: key },
      React.createElement("div", { className: "summary-arrow" }, "→")
    );
  };

  const renderColumns = () => {
    const columns = [];

    // --- CASE 1: 4 Cards (skipStep2 = false) ---
    if (!skipStep2) {
      // Column 1: Card 1 (Mixed Fraction with Multiplier) - No Description
      columns.push(
        React.createElement(
          "div",
          { className: "summary-column", key: "col1" },
          React.createElement(
            "div",
            { className: "summary-card" },
            React.createElement(
              "div",
              { className: "summary-card-visual" },
              React.createElement("span", { className: "summary-whole" }, q.whole),
              React.createElement(
                "div",
                { className: "summary-fraction" },
                React.createElement(
                  "div",
                  { className: "summary-fraction-num" },
                  React.createElement("span", null, q.numerator),
                  React.createElement("span", { className: "summary-multiplier text-green" }, "×" + q.multiplier)
                ),
                React.createElement("div", { className: "summary-fraction-line" }),
                React.createElement(
                  "div",
                  { className: "summary-fraction-den text-orange" },
                  React.createElement("span", null, q.denominator),
                  React.createElement("span", { className: "summary-multiplier text-orange" }, "×" + q.multiplier)
                )
              )
            )
          ),
          // Spacer to match description height if needed, or just empty
          React.createElement("div", { className: "summary-step-spacer" })
        )
      );

      columns.push(renderArrow("arr1"));

      // Column 2: Card 2 (Whole + Converted Fraction) + Desc 1
      columns.push(
        React.createElement(
          "div",
          { className: "summary-column", key: "col2" },
          React.createElement(
            "div",
            { className: "summary-card" },
            React.createElement(
              "div",
              { className: "summary-card-visual" },
              React.createElement("span", { className: "summary-whole" }, q.whole),
              React.createElement("span", { className: "summary-and" }, APP_DATA.andText),
              React.createElement(
                "div",
                { className: "summary-fraction" },
                React.createElement(
                  "div",
                  { className: "summary-fraction-num" },
                  React.createElement("span", { className: "summary-converted text-green" }, q.convertedNumerator)
                ),
                React.createElement("div", { className: "summary-fraction-line" }),
                React.createElement(
                  "div",
                  { className: "summary-fraction-den text-orange" },
                  React.createElement("span", null, q.convertedDenominator)
                )
              )
            )
          ),
          renderDescription(0)
        )
      );

      columns.push(renderArrow("arr2"));

      // Column 3: Card 3 (Whole + Decimal) + Desc 2
      columns.push(
        React.createElement(
          "div",
          { className: "summary-column", key: "col3" },
          React.createElement(
            "div",
            { className: "summary-card" },
            React.createElement(
              "div",
              { className: "summary-card-visual" },
              React.createElement("span", { className: "summary-whole" }, q.whole),
              React.createElement("span", { className: "summary-and" }, APP_DATA.andText),
              React.createElement(
                "span",
                { className: "summary-decimal" },
                renderColoredDecimalWithBrackets(q.decimalValue, "text-green")
              )
            )
          ),
          renderDescription(1)
        )
      );

      columns.push(renderArrow("arr3"));

      // Column 4: Card 4 (Final Decimal) + Desc 3
      columns.push(
        React.createElement(
          "div",
          { className: "summary-column", key: "col4" },
          React.createElement(
            "div",
            { className: "summary-card summary-card-final" },
            React.createElement(
              "div",
              { className: "summary-card-visual" },
              React.createElement(
                "span",
                { className: "summary-final-decimal" },
                renderColoredDecimal(q.finalDecimal, "text-green")
              )
            )
          ),
          renderDescription(2)
        )
      );
    } 
    // --- CASE 2: 3 Cards (skipStep2 = true) ---
    else {
      // Column 1: Card 1 (Mixed Fraction) - No Description
      columns.push(
        React.createElement(
          "div",
          { className: "summary-column", key: "col1" },
          React.createElement(
            "div",
            { className: "summary-card" },
            React.createElement(
              "div",
              { className: "summary-card-visual" },
              React.createElement("span", { className: "summary-whole" }, q.whole),
              React.createElement(
                "div",
                { className: "summary-fraction" },
                React.createElement(
                  "div",
                  { className: "summary-fraction-num" },
                  React.createElement("span", { className: "text-green" }, q.numerator)
                ),
                React.createElement("div", { className: "summary-fraction-line" }),
                React.createElement(
                  "div",
                  { className: "summary-fraction-den text-orange" },
                  React.createElement("span", null, q.denominator)
                )
              )
            )
          ),
          React.createElement("div", { className: "summary-step-spacer" })
        )
      );

      columns.push(renderArrow("arr1"));

      // Column 2: Card 2 (Whole + Decimal) + Desc 1
      columns.push(
        React.createElement(
          "div",
          { className: "summary-column", key: "col2" },
          React.createElement(
            "div",
            { className: "summary-card" },
            React.createElement(
              "div",
              { className: "summary-card-visual" },
              React.createElement("span", { className: "summary-whole" }, q.whole),
              React.createElement("span", { className: "summary-and" }, APP_DATA.andText),
              React.createElement(
                "span",
                { className: "summary-decimal" },
                renderColoredDecimalWithBrackets(q.decimalValue, "text-green")
              )
            )
          ),
          renderDescription(0)
        )
      );

      columns.push(renderArrow("arr2"));

      // Column 3: Card 3 (Final Decimal) + Desc 2
      columns.push(
        React.createElement(
          "div",
          { className: "summary-column", key: "col3" },
          React.createElement(
            "div",
            { className: "summary-card summary-card-final" },
            React.createElement(
              "div",
              { className: "summary-card-visual" },
              React.createElement(
                "span",
                { className: "summary-final-decimal" },
                 renderColoredDecimal(q.finalDecimal, "text-green")
              )
            )
          ),
          renderDescription(1)
        )
      );
    }

    return columns;
  };

  return React.createElement(
    "div",
    { className: "summary-panel" },
    React.createElement(
      "p",
      { className: "summary-subheading" , dangerouslySetInnerHTML: { __html: subheading } },
      
    ),
    React.createElement(
      "div",
      { className: "summary-layout" },
      renderColumns()
    ),
    React.createElement("button", {
      className: "btn fullscreen-button summary-continue-btn",
      onClick: () => {
        playSound("click");
        if (typeof onContinue === "function") onContinue();
      },
    }, APP_DATA.summaryContinueButton)
  );
};
