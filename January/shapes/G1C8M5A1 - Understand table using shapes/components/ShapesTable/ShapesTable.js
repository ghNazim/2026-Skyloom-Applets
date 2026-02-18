const hasMultipleWords = (text) => {
  if (text == null || typeof text !== "string") return false;
  return text.trim().split(/\s+/).length > 1;
};

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
        rows.map((row, rowIndex) =>
          React.createElement(
            "tr",
            { key: `row-${rowIndex}` },
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
          )
        )
      )
    )
  );
};
