const EditableColorTable = ({ 
  colors, 
  values, 
  activeRowIndex, 
  cellStates, 
  onCellValueChange 
}) => {
  return React.createElement(
    "div",
    { className: "editable-color-table-wrapper" },
    React.createElement("div", { className: "editable-color-table-title" }, "Color of Shapes Table"),
    React.createElement(
      "table",
      { className: "editable-color-table" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement("th", null, "COLOR"),
          React.createElement("th", null, "NUMBER OF SHAPES")
        )
      ),
      React.createElement(
        "tbody",
        null,
        colors.map((color, rowIndex) => {
          const cellState = cellStates[rowIndex] || 'default'; // 'default', 'active', 'correct', 'wrong'
          const cellValue = values[rowIndex] || '';
          
          return React.createElement(
            "tr",
            { key: `row-${rowIndex}` },
            React.createElement("th", null, color.name),
            React.createElement(
              "td",
              {
                className: `editable-cell ${cellState}`,
                "data-row-index": rowIndex,
              },
              cellValue
            )
          );
        })
      )
    )
  );
};
