const Table = ({
  headers,
  rows,
  highlightedCell,
  cellUpdate,
  showQuestionMarks,
  showArrow,
  arrowLabel,
  isArrowLabelCorrect,
  isArrowLabelIncorrect,
  questionMarkCellCorrect,
  isFilling,
  isTableComplete,
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

    // Get the left column cells (row 0 and row 1, col 0) - first data row to second data row
    const startCell = document.getElementById("table-cell-0-0");
    const endCell = document.getElementById("table-cell-1-0");

    if (!startCell || !endCell) return;

    const containerRect = container.getBoundingClientRect();
    const startCellRect = startCell.getBoundingClientRect();
    const endCellRect = endCell.getBoundingClientRect();

    // Calculate positions relative to container
    const startX = startCellRect.left - containerRect.left;
    const startY =
      startCellRect.top - containerRect.top + startCellRect.height / 2;
    const endX = endCellRect.left - containerRect.left;
    const endY = endCellRect.top - containerRect.top + endCellRect.height / 2;

    // Offset to the left of the cell for the vertical line
    const arrowOffsetX = -40; // Distance in pixels to the left

    // Create L-shaped path with 3 segments:
    // 1. Horizontal line from cell middle to the left
    // 2. Vertical line down to the level of next cell
    // 3. Horizontal line from left to the next cell middle
    const turnPointX = startX + arrowOffsetX; // X position for vertical line
    const turnPointY1 = startY; // Y position at start cell level
    const turnPointY2 = endY; // Y position at end cell level

    // Create arrow path (L-shaped: horizontal, vertical, horizontal)
    const polyline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    // Points: start cell middle -> left -> down to end cell level -> right to end cell middle
    polyline.setAttribute(
      "points",
      `${startX},${startY} ${turnPointX},${turnPointY1} ${turnPointX},${turnPointY2} ${endX},${endY}`
    );
    polyline.setAttribute("class", "arrow-path");
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "white");
    polyline.setAttribute("stroke-width", "0.2vw");
    svg.appendChild(polyline);

    // Create arrowhead at the end (pointing right into the cell)
    if (!containerRef.current) return;
    const containerRectForHead = containerRef.current.getBoundingClientRect();
    const arrowHeadWidth = containerRectForHead.width * 0.012;
    const arrowHeadHeight = arrowHeadWidth / 2;

    const arrowHead = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    // Arrowhead pointing right (into the cell)
    // Base is to the left of the tip, so tip points right
    arrowHead.setAttribute(
      "points",
      `${endX - arrowHeadWidth},${endY - arrowHeadHeight} ${endX},${endY} ${
        endX - arrowHeadWidth
      },${endY + arrowHeadHeight}`
    );
    arrowHead.setAttribute("class", "arrow-head");
    arrowHead.setAttribute("fill", "white");
    svg.appendChild(arrowHead);

    // Position label in the middle of the vertical segment
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
  }, [showArrow, tableData, cellUpdate, arrowLabel]);

  const isCellHighlighted = (rowIndex, colIndex) => {
    if (!highlightedCell) return false;
    return highlightedCell.row === rowIndex && highlightedCell.col === colIndex;
  };

  const getCellClassName = (rowIndex, colIndex, cellValue) => {
    let className = "table-cell";

    if (rowIndex === 0) {
      className += " table-header";
    }

    // Add column color classes
    if (colIndex === 0) {
      className += " table-col-blue";
    } else if (colIndex === 1) {
      className += " table-col-purple";
    } else if (colIndex === 2) {
      className += " table-col-yellow";
    }

    // If showQuestionMarks is true (step 4), highlight all "?" cells
    // Otherwise, only highlight the specific cell that should be highlighted
    if (showQuestionMarks && cellValue === "?") {
      className += " table-question-mark";
    } else if (isCellHighlighted(rowIndex, colIndex)) {
      className += " table-cell-highlighted";
    }

    // Make the bottom row right cell green when correct answer is submitted
    // Check position, not cell value, because value changes from "?" to answer when correct
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
            // Apply column color classes to headers too
            let headerClassName = "table-header";
            if (index === 0) {
              headerClassName += " table-col-blue";
            } else if (index === 1) {
              headerClassName += " table-col-purple";
            } else if (index === 2) {
              headerClassName += " table-col-yellow";
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
            !arrowLabel && !isArrowLabelCorrect ? "pulsating" : ""
          } ${isArrowLabelCorrect ? "correct" : ""} ${
            isArrowLabelIncorrect ? "incorrect" : ""
          }`,
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
