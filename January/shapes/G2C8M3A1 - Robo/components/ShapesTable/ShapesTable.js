const hasMultipleWords = (text) => {
  if (text == null || typeof text !== "string") return false;
  return text.trim().split(/\s+/).length > 1;
};

const ShapesTable = ({ title, headers, rows, highlightedRowIndex }) => {
  const hasTallyColumn = headers && headers.length === 3;
  const displayHeaders = headers || [];
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
          displayHeaders.map((header, index) =>
            React.createElement(
              "th",
              {
                key: `header-${index}`,
                className: hasMultipleWords(String(header)) ? "cell-multi-word" : "",
              },
              header
            )
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        rows.map((row, rowIndex) => {
          const isHighlighted = highlightedRowIndex !== undefined && highlightedRowIndex === rowIndex;
          const rowClassName = isHighlighted ? "shapes-table-row-highlighted" : "";
          if (hasTallyColumn && row.length >= 2) {
            const count = parseInt(row[1], 10) || 0;
            const tallyHtml = typeof showTally === "function" ? showTally(count) : "";
            return React.createElement(
              "tr",
              { key: `row-${rowIndex}`, className: rowClassName },
              React.createElement(
                "th",
                {
                  key: "cell-0",
                  className: hasMultipleWords(String(row[0])) ? "cell-multi-word" : "",
                },
                row[0]
              ),
              React.createElement(
                "td",
                {
                  key: "cell-1",
                  className: "shapes-table-tally-cell",
                  dangerouslySetInnerHTML: { __html: tallyHtml },
                }
              ),
              React.createElement(
                "td",
                {
                  key: "cell-2",
                  className: hasMultipleWords(String(row[1])) ? "cell-multi-word" : "",
                },
                String(row[1])
              )
            );
          }
          return React.createElement(
            "tr",
            { key: `row-${rowIndex}`, className: rowClassName },
            row.map((cell, colIndex) => {
              const Tag = colIndex === 0 ? "th" : "td";
              const cellText = String(cell);
              return React.createElement(
                Tag,
                {
                  key: `cell-${rowIndex}-${colIndex}`,
                  className: hasMultipleWords(cellText) ? "cell-multi-word" : "",
                },
                cellText
              );
            })
          );
        })
      )
    )
  );
};
