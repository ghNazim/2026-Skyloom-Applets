const MainCanvas = ({
  selectedButton,
  isAnimating,
  onLateralClick,
  onTotalClick,
  unfoldValue,
  showHeightArrow,
  showWidthArrow,
  showLateralLabel,
  showCurvedAreaLabel,
  showBaseLabel,
  showBaseAreaLabel,
  dehighlightBases,
  dehighlightSurface,
  formulaRows,
  showLateralText,
  lateralTextChars,
  showTotalText,
  totalTextChars,
}) => {
  const lateralFullText = APP_DATA.textboxes.lateral;
  const totalFullText = APP_DATA.textboxes.total;

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    // ==== Left column - Buttons (35%) ====
    React.createElement(
      "div",
      { className: "buttons-column" },

      // ---- Lateral button row ----
      React.createElement(
        "div",
        { className: "button-row" },
        React.createElement(
          "button",
          {
            className:
              "btn sa-btn" +
              (selectedButton === "lateral" ? " selected" : ""),
            onClick: onLateralClick,
            disabled: isAnimating || selectedButton === "lateral",
          },
          APP_DATA.buttons.lateral
        ),
        React.createElement(
          "div",
          {
            className: "button-textbox",
            style: { opacity: showLateralText ? 1 : 0 },
          },
          lateralFullText.substring(0, lateralTextChars)
        )
      ),

      // ---- Total button row ----
      React.createElement(
        "div",
        { className: "button-row" },
        React.createElement(
          "button",
          {
            className:
              "btn sa-btn" +
              (selectedButton === "total" ? " selected" : ""),
            onClick: onTotalClick,
            disabled: isAnimating || selectedButton === "total",
          },
          APP_DATA.buttons.total
        ),
        React.createElement(
          "div",
          {
            className: "button-textbox",
            style: { opacity: showTotalText ? 1 : 0 },
          },
          totalFullText.substring(0, totalTextChars)
        )
      )
    ),

    // ==== Right column - Visual (65%) ====
    React.createElement(
      "div",
      { className: "visual-column" },

      // ---- Cylinder visual (80%) ----
      React.createElement(
        "div",
        { className: "cylinder-area" },
        React.createElement(CylinderVisual, {
          unfoldValue,
          showRectBorders: true,
          showHeightArrow,
          showWidthArrow,
          showLateralLabel,
          showCurvedAreaLabel,
          showBaseLabel,
          showBaseAreaLabel,
          dehighlightBases,
          dehighlightSurface,
        })
      ),

      // ---- Formula box (20%) ----
      React.createElement(
        "div",
        { className: "formula-box" },
        formulaRows.map((row, rowIdx) =>
          React.createElement(
            "div",
            { className: "formula-row", key: "fr-" + rowIdx },
            row.parts.map((part, partIdx) =>
              React.createElement(
                "span",
                {
                  key: "fp-" + partIdx,
                  className: "formula-part",
                  style: { color: row.color },
                },
                part
              )
            )
          )
        )
      )
    )
  );
};
