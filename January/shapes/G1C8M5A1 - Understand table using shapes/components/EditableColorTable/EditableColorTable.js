const EditableColorTable = ({ 
  title,
  headers,
  colors, 
  values, 
  activeRowIndex, 
  cellStates, 
  onCellValueChange 
}) => {
  const tableTitle = title != null ? title : "Color of Shapes Table";
  const tableHeaders = headers && headers.length >= 2 ? headers : ["COLOR", "NUMBER OF SHAPES"];
  return React.createElement(
    "div",
    { className: "editable-color-table-wrapper" },
    React.createElement("div", { className: "editable-color-table-title" }, tableTitle),
    React.createElement(
      "table",
      { className: "editable-color-table" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement("th", null, tableHeaders[0]),
          React.createElement("th", null, tableHeaders[1])
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
