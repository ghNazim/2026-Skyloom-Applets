const Table = ({
  headers,
  rows,
  highlightedColumn,
  cellUpdate,
  showQuestionMarks,
  showArrow,
  arrowLabel,
  isArrowLabelCorrect,
  isArrowLabelIncorrect,
  isArrowLabelNeutral,
  questionMarkCellCorrect,
  isFilling,
  isTableComplete,
  arrowColumnIndex = 0, // 0 = left column (default), 2 = right column (ratio table)
  columnColorVariant = "default", // "default" | "ratio" (AE=orange, ED=teal, DA=blue)
}) => {
  const { useState, useEffect, useRef } = React;

  const [tableData, setTableData] = useState(rows);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const labelRef = useRef(null);

  // Initialize table data from rows prop
  useEffect(() => {
    setTableData(rows);
  }, [rows]);

  // Update cell value when cellUpdate changes
  useEffect(() => {
    if (
      cellUpdate &&
      cellUpdate.rowIndex !== undefined &&
      cellUpdate.colIndex !== undefined
    ) {
      setTableData((prev) => {
        const newData = prev.map((row, rIdx) => {
          if (rIdx === cellUpdate.rowIndex) {
            return row.map((cell, cIdx) => {
              if (cIdx === cellUpdate.colIndex) {
                return cellUpdate.value;
              }
              return cell;
            });
          }
          return row;
        });
        return newData;
      });
    }
  }, [cellUpdate]);

  // Draw arrow using SVG (similar to TablePanel)
  const drawArrow = () => {
    const svg = svgRef.current;
    const container = containerRef.current;
    const labelBox = labelRef.current;

    if (!svg || !container || !showArrow) {
      if (svg) svg.innerHTML = "";
      return;
    }

    svg.innerHTML = ""; // Clear previous arrow

    const col = arrowColumnIndex;
    const startCell = document.getElementById(`table-cell-0-${col}`);
    const endCell = document.getElementById(`table-cell-1-${col}`);

    if (!startCell || !endCell) return;

    const containerRect = container.getBoundingClientRect();
    const startCellRect = startCell.getBoundingClientRect();
    const endCellRect = endCell.getBoundingClientRect();

    const isRightColumn = col === 2;
    const arrowOffsetPx = 40;

    let startX, startY, endX, endY, turnPointX, turnPointY1, turnPointY2;

    if (isRightColumn) {
      startX = startCellRect.right - containerRect.left;
      startY = startCellRect.top - containerRect.top + startCellRect.height / 2;
      endX = endCellRect.right - containerRect.left;
      endY = endCellRect.top - containerRect.top + endCellRect.height / 2;
      turnPointX = startX + arrowOffsetPx;
      turnPointY1 = startY;
      turnPointY2 = endY;
    } else {
      startX = startCellRect.left - containerRect.left;
      startY = startCellRect.top - containerRect.top + startCellRect.height / 2;
      endX = endCellRect.left - containerRect.left;
      endY = endCellRect.top - containerRect.top + endCellRect.height / 2;
      turnPointX = startX - arrowOffsetPx;
      turnPointY1 = startY;
      turnPointY2 = endY;
    }

    const polyline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    polyline.setAttribute(
      "points",
      `${startX},${startY} ${turnPointX},${turnPointY1} ${turnPointX},${turnPointY2} ${endX},${endY}`
    );
    polyline.setAttribute("class", "arrow-path");
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", isRightColumn ? "#f97315" : "white");
    polyline.setAttribute("stroke-width", "0.2vw");
    svg.appendChild(polyline);

    if (!containerRef.current) return;
    const containerRectForHead = containerRef.current.getBoundingClientRect();
    const arrowHeadWidth = containerRectForHead.width * 0.012;
    const arrowHeadHeight = arrowHeadWidth / 2;

    const arrowHead = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    if (isRightColumn) {
      arrowHead.setAttribute(
        "points",
        `${endX},${endY} ${endX - arrowHeadWidth},${endY - arrowHeadHeight} ${endX - arrowHeadWidth},${endY + arrowHeadHeight}`
      );
    } else {
      arrowHead.setAttribute(
        "points",
        `${endX - arrowHeadWidth},${endY - arrowHeadHeight} ${endX},${endY} ${endX - arrowHeadWidth},${endY + arrowHeadHeight}`
      );
    }
    arrowHead.setAttribute("class", "arrow-head");
    arrowHead.setAttribute("fill", isRightColumn ? "#f97315" : "white");
    svg.appendChild(arrowHead);

    if (labelBox) {
      labelBox.style.display = "block";
      const labelX = turnPointX;
      const labelY = startY + (endY - startY) / 2;
      labelBox.style.left = `${(labelX / containerRect.width) * 100}%`;
      labelBox.style.top = `${(labelY / containerRect.height) * 100}%`;
    }
  };

  // Redraw arrow when needed
  useEffect(() => {
    if (showArrow) {
      const timer = setTimeout(() => {
        drawArrow();
      }, 0);
      window.addEventListener("resize", drawArrow);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", drawArrow);
      };
    } else {
      // Clear arrow when showArrow is false
      if (svgRef.current) {
        svgRef.current.innerHTML = "";
      }
      // Hide label when showArrow is false
      if (labelRef.current) {
        labelRef.current.style.display = "none";
      }
    }
  }, [showArrow, tableData, cellUpdate, arrowLabel, arrowColumnIndex]);

  const isColumnHighlighted = (colIndex) => {
    return highlightedColumn !== null && highlightedColumn !== undefined && colIndex === highlightedColumn;
  };

  const getCellClassName = (rowIndex, colIndex, cellValue) => {
    let className = "table-cell";

    if (rowIndex === 0) {
      className += " table-header";
    }

    // Add column color classes
    if (columnColorVariant === "ratio") {
      if (colIndex === 0) className += " table-col-ae";
      else if (colIndex === 1) className += " table-col-ed";
      else if (colIndex === 2) className += " table-col-da";
    } else {
      if (colIndex === 0) className += " table-col-blue";
      else if (colIndex === 1) className += " table-col-purple";
      else if (colIndex === 2) className += " table-col-yellow";
    }

    if (showQuestionMarks && cellValue === "?") {
      className += " table-question-mark";
    } else if (isColumnHighlighted(colIndex)) {
      const isBottomRow = rowIndex === rows.length - 1;
      className += isBottomRow ? " table-cell-active-highlight" : " table-col-border-highlight";
    }

    if (questionMarkCellCorrect && rowIndex === 1 && colIndex === 2) {
      className += " table-cell-correct";
    }

    return className;
  };

  const getCellStyle = (rowIndex, colIndex, cellValue) => {
    // Only style the bottom row right cell (row 1, col 2)
    // Check position, not cell value, because value changes from "?" to answer when correct
    if (rowIndex === 1 && colIndex === 2) {
      // State 2: Correct - green bg, green border, white text (when showCorrectState is true)
      // Note: CSS class .table-cell-correct also applies with !important, but we add inline styles for border
      if (questionMarkCellCorrect) {
        return {
          outlineColor: "#28a745",
          outlineWidth: "0.15vw",
          outlineStyle: "solid",
        };
      }
      // State 1: Initial - white bg, black text (when step is not complete and cell value is "?")
      // This applies initially and when user is filling
      // Need to override the yellow background from .table-col-yellow class
      if (!isTableComplete && cellValue === "?") {
        return { backgroundColor: "white", color: "black" };
      }
      // State 3: After delay - default yellow bg, white text (handled by CSS class)
      // Return null to use default styling when complete and not showing correct state
    }
    return null;
  };

  return React.createElement(
    "div",
    {
      className: "table-wrapper",
      style: { position: "relative" },
      ref: containerRef,
    },
    React.createElement("svg", {
      className: "table-arrow-svg",
      ref: svgRef,
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      },
    }),
    React.createElement(
      "table",
      { className: "data-table" },
      // Header row
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          headers.map((header, index) => {
            let headerClassName = "table-header";
            if (columnColorVariant === "ratio") {
              if (index === 0) headerClassName += " table-col-ae";
              else if (index === 1) headerClassName += " table-col-ed";
              else if (index === 2) headerClassName += " table-col-da";
            } else {
              if (index === 0) headerClassName += " table-col-blue";
              else if (index === 1) headerClassName += " table-col-purple";
              else if (index === 2) headerClassName += " table-col-yellow";
            }
            if (isColumnHighlighted(index)) {
              headerClassName += " table-col-border-highlight";
            }
            return React.createElement(
              "th",
              { key: `header-${index}`, className: headerClassName },
              header
            );
          })
        )
      ),
      // Data rows
      React.createElement(
        "tbody",
        null,
        tableData.map((row, rowIndex) =>
          React.createElement(
            "tr",
            { key: `row-${rowIndex}` },
            row.map((cell, colIndex) => {
              // Check if cell contains HTML (like KaTeX or fraction HTML)
              const hasHTML =
                typeof cell === "string" &&
                (cell.includes("<span") ||
                  cell.includes("<div") ||
                  cell.includes("<svg") ||
                  cell.includes("katex"));

              const cellStyle = getCellStyle(rowIndex, colIndex, cell);

              return React.createElement(
                colIndex === 0 ? "th" : "td",
                {
                  key: `cell-${rowIndex}-${colIndex}`,
                  id: `table-cell-${rowIndex}-${colIndex}`,
                  className: getCellClassName(rowIndex, colIndex, cell),
                  style: cellStyle,
                  dangerouslySetInnerHTML: hasHTML ? { __html: cell } : null,
                },
                hasHTML ? null : cell
              );
            })
          )
        )
      )
    ),
    // Label for arrow
    showArrow &&
      React.createElement(
        "span",
        {
          ref: labelRef,
          id: "table-arrow-label",
          className: `table-arrow-label ${
            !arrowLabel && !isArrowLabelCorrect && !isArrowLabelNeutral ? "pulsating" : ""
          } ${isArrowLabelCorrect ? "correct" : ""} ${
            isArrowLabelIncorrect ? "incorrectCell" : ""
          } ${isArrowLabelNeutral ? "neutral" : ""}`,
          style: {
            position: "absolute",
            pointerEvents: "none",
            zIndex: 20,
            transform: "translate(-50%, -50%)",
          },
        },
        arrowLabel ? `×${arrowLabel}` : ""
      )
  );
};
