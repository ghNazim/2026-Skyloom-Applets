const AppMainContentMiddle = ({ svgLeft, svgRight, tableComponent, instructionRow, buttonsRow }) => {
  return React.createElement(
    "div",
    { className: "app-main-content-middle" },
    // SVG Column
    React.createElement(
      "div",
      { className: "svg-column" },
      React.createElement(
        "div",
        { className: "svg-left" },
        svgLeft
      ),
      React.createElement(
        "div",
        { className: "svg-right" },
        svgRight
      )
    ),
    // Table Column
    React.createElement(
      "div",
      { className: "table-column" },
      // Table Row
      React.createElement(
        "div",
        { className: "table-row" },
        tableComponent
      ),
      // Instruction Row
      React.createElement("div", { className: "instruction-row" }, instructionRow || ""),
      // Buttons Row
      React.createElement(
        "div",
        { className: "buttons-row" },
        buttonsRow
      )
    )
  );
};
