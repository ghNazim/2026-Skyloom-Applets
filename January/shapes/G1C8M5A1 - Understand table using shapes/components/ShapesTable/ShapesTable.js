const ShapesTable = ({ title, headers, rows }) => {
  return React.createElement(
    "div",
    { className: "shapes-table-wrapper" },
    React.createElement("div", { className: "shapes-table-title" }, title),
    React.createElement(
      "table",
      { className: "shapes-table" },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          headers.map((header, index) =>
            React.createElement("th", { key: `header-${index}` }, header)
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        rows.map((row, rowIndex) =>
          React.createElement(
            "tr",
            { key: `row-${rowIndex}` },
            row.map((cell, colIndex) =>
              React.createElement(
                colIndex === 0 ? "th" : "td",
                { key: `cell-${rowIndex}-${colIndex}` },
                cell
              )
            )
          )
        )
      )
    )
  );
};
