const MainCanvas = ({
  btn1Enabled,
  btn2Enabled,
  btn1Clicked,
  btn2Clicked,
  text1Visible,
  text1Display,
  text2Visible,
  text2Display,
  unfoldValue,
  isUnfolded,
  baseFillTransparent,
  labelMode,
  formula1Visible,
  formula2Visible,
  showTap1,
  showTap2,
  highlightTrigger,
  showFoldedLabelsVisible,
  onHighlightAnimationComplete,
  onBtn1Click,
  onBtn2Click,
  greenColor,
  blueColor,
}) => {
  // ===== LEFT COLUMN: BUTTONS =====
  const buttonsColumn = React.createElement(
    "div",
    { className: "buttons-column" },

    // ---- Top Row: LSA Button + Text ----
    React.createElement(
      "div",
      { className: "button-row" },
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          {
            className:
              "action-button green-btn" + (btn1Clicked ? " clicked" : ""),
            onClick: onBtn1Click,
            disabled: !btn1Enabled,
          },
          APP_DATA.buttons[0].label
        ),
        showTap1 &&
          React.createElement("img", {
            src: "assets/tap.gif",
            className: "tap-gif",
            alt: "tap",
          })
      ),
      React.createElement(
        "div",
        { className: "text-box" + (text1Visible ? " visible" : "") },
        text1Display
      )
    ),

    // ---- Bottom Row: TSA Button + Text ----
    React.createElement(
      "div",
      { className: "button-row" },
      React.createElement(
        "div",
        { className: "btn-wrapper" },
        React.createElement(
          "button",
          {
            className:
              "action-button blue-btn" + (btn2Clicked ? " clicked" : ""),
            onClick: onBtn2Click,
            disabled: !btn2Enabled,
          },
          APP_DATA.buttons[1].label
        ),
        showTap2 &&
          React.createElement("img", {
            src: "assets/tap.gif",
            className: "tap-gif",
            alt: "tap",
          })
      ),
      React.createElement(
        "div",
        { className: "text-box" + (text2Visible ? " visible" : "") },
        text2Display
      )
    )
  );

  // ===== RIGHT COLUMN: VISUAL =====
  const visualColumn = React.createElement(
    "div",
    { className: "visual-column" },

    // ---- Pyramid Area (80%) ----
    React.createElement(
      "div",
      { className: "pyramid-area" },
      React.createElement(SquarePyramid, {
        unfoldValue: unfoldValue,
        skipCameraAnimation: false,
        labelMode: labelMode,
        showFoldedStateLabels: true,
        showFoldedLabelsVisible: showFoldedLabelsVisible,
        baseFillTransparent: baseFillTransparent,
        highlightAnimationTrigger: highlightTrigger,
        onHighlightAnimationComplete: onHighlightAnimationComplete,
      })
    ),

    // ---- Formula Area (20%) ----
    React.createElement(
      "div",
      { className: "formula-area" },

      // Formula Row 1: LSA = 2al
      React.createElement(
        "div",
        { className: "formula-row" + (formula1Visible ? " visible" : "") },
        React.createElement(
          "span",
          { className: "formula-text", style: { color: greenColor } },
          APP_DATA.formulas[0]
        )
      ),

      // Formula Row 2: TSA = a² + 2al
      React.createElement(
        "div",
        { className: "formula-row" + (formula2Visible ? " visible" : "") },
        React.createElement(
          "span",
          { className: "formula-text", style: { color: blueColor } },
          APP_DATA.formulas[1]
        )
      )
    )
  );

  // ===== MAIN LAYOUT =====
  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    buttonsColumn,
    visualColumn
  );
};
