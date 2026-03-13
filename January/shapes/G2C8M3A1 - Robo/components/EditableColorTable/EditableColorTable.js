const EditableColorTable = ({ 
  title,
  headers,
  colors, 
  showColorNames = true,
  tallyHtmls,
  tallyCellStates,
  onTallyCellClick,
  values, 
  activeRowIndex, 
  cellStates, 
  onCellValueChange 
}) => {
  const tableTitle = title != null ? title : "Color of Shapes Table";
  const tableHeaders = headers && headers.length >= 3 ? headers : 
    (headers && headers.length >= 2 ? [headers[0], "TALLY MARKS", headers[1]] : 
    ["COLOR", "TALLY MARKS", "NUMBER OF SHAPES"]);

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
          tableHeaders.map((h, i) => React.createElement("th", { key: i }, h))
        )
      ),
      React.createElement(
        "tbody",
        null,
        colors.map((color, rowIndex) => {
          const countState = cellStates ? (cellStates[rowIndex] || 'default') : 'default';
          const cellValue = values ? (values[rowIndex] || '') : '';

          const colorCell = React.createElement("th", { key: 'c0' }, showColorNames ? color.name : '');

          let tallyCell;
          if (tallyHtmls) {
            const tallyState = tallyCellStates ? (tallyCellStates[rowIndex] || 'default') : 'default';
            const isClickable = onTallyCellClick && tallyState === 'active';
            tallyCell = React.createElement("td", {
              key: 'c1',
              className: `editable-color-table-tally-cell tally-state-${tallyState}${isClickable ? ' tally-clickable' : ''}`,
              dangerouslySetInnerHTML: { __html: tallyHtmls[rowIndex] || '' },
              onClick: isClickable ? () => onTallyCellClick(rowIndex) : undefined,
            });
          } else {
            const count = parseInt(cellValue, 10) || 0;
            const tallyHtml = typeof showTally === "function" ? showTally(count) : "";
            tallyCell = React.createElement("td", {
              key: 'c1',
              className: "editable-color-table-tally-cell",
              dangerouslySetInnerHTML: { __html: tallyHtml },
            });
          }

          const countCell = React.createElement("td", {
            key: 'c2',
            className: `editable-cell ${countState}`,
            "data-row-index": rowIndex,
          }, cellValue);

          return React.createElement("tr", { key: `row-${rowIndex}` }, colorCell, tallyCell, countCell);
        })
      )
    )
  );
};
