const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateTexts, onForceNext } = props;
  const { useState, useEffect, useRef } = React;

  // State
  const [length, setLength] = useState(0); // Slider 1 (Horz)
  const [breadth, setBreadth] = useState(0); // Slider 2 (Vert)
  
  // Step 2 specific
  const [showAreaVisual, setShowAreaVisual] = useState(false); // "Visualize" button clicked

  // Step 3 specific
  const [squaresInRow, setSquaresInRow] = useState(0);
  
  // Step 4 specific
  const [rowsCount, setRowsCount] = useState(1);

  // Step 5-7 Interactivity
  const [formulaStage, setFormulaStage] = useState(0); // 0: initial, 1: expanded, 2: word formula

  const svgRef = useRef(null);

  // Constants
  const GRID_COLS = 14;
  const GRID_ROWS = 9;
  const RECT_START_X = 3; // Grid coords
  const RECT_START_Y = 2; // Grid coords
  const MAX_LENGTH = 8;
  const MAX_BREADTH = 5;
  const CELL_SIZE = 50; 
  const PADDING = 5;
  
  // Calculations for SVG
  const gridWidth = GRID_COLS * CELL_SIZE;
  const gridHeight = GRID_ROWS * CELL_SIZE;
  const viewBoxWidth = gridWidth + PADDING * 2;
  const viewBoxHeight = gridHeight + PADDING * 2;

  const toSvgX = (gx) => PADDING + gx * CELL_SIZE;
  const toSvgY = (gy) => PADDING + (GRID_ROWS - gy) * CELL_SIZE;

  // Effects for Steps initialization
  useEffect(() => {
    // Reset or Initialize based on step
    if (step === 1) {
      setLength(0);
      setBreadth(0);
    }
    if (step === 2) {
       setShowAreaVisual(false);
       onUpdateTexts(APP_DATA.steps[2].navText);
    }
    if (step === 3) {
        setSquaresInRow(0); // Reset slider
        onUpdateTexts(APP_DATA.steps[3].navText);
        onSetNextEnabled(false);
    }
    if (step === 4) {
        setRowsCount(1); // Reset slider (logic says init 1)
        onUpdateTexts(APP_DATA.steps[4].navText);
        onSetNextEnabled(false);
    }
    if (step === 5) {
        setFormulaStage(0);
        onUpdateTexts(APP_DATA.steps[5].navText);
        onSetNextEnabled(false); // User shouldn't click Next manually step 5
    }
    if (step === 6) {
        onUpdateTexts(APP_DATA.steps[6].navText);
        onSetNextEnabled(false); // User shouldn't click Next manually step 6
    }
    if (step === 7) {
        onUpdateTexts(APP_DATA.steps[7].navText);
        onSetNextEnabled(true);
    }
  }, [step]);

  // Validation Effects
  useEffect(() => {
    if (step === 1) {
      if (length > 0 && breadth > 0) {
        onSetNextEnabled(true);
        onUpdateTexts(APP_DATA.steps[1].navNext);
      } else {
        onSetNextEnabled(false);
        onUpdateTexts(APP_DATA.steps[1].navText);
      }
    }
    if (step === 2) {
        if (showAreaVisual) {
            onSetNextEnabled(true);
            onUpdateTexts(APP_DATA.steps[2].navNext);
        } else {
            onSetNextEnabled(false);
            onUpdateTexts(APP_DATA.steps[2].navText);
        }
    }
    if (step === 3) {
        const isCorrect = squaresInRow === length;
        onSetNextEnabled(isCorrect);
        // Only show navNext if correct
        if (isCorrect) {
             onUpdateTexts(APP_DATA.steps[3].navNext);
        } else {
             onUpdateTexts(APP_DATA.steps[3].navText);
        }
    }
    if (step === 4) {
        const isCorrect = rowsCount === breadth;
        onSetNextEnabled(isCorrect);
        if (isCorrect) {
            onUpdateTexts(APP_DATA.steps[4].navNext);
        } else {
            onUpdateTexts(APP_DATA.steps[4].navText);
        }
    }
    if (step === 5) {
        // Nav text updates based on formulaStage
        if (formulaStage === 0) onUpdateTexts(APP_DATA.steps[5].navText);
        if (formulaStage === 1) onUpdateTexts(APP_DATA.steps[5].navNext);
        if (formulaStage === 2) onUpdateTexts(APP_DATA.steps[5].navNext2);
        
        // Disabled next button for step 5 generally, as flow is via clicks
        onSetNextEnabled(false);
    }
     if (step === 6) {
         onSetNextEnabled(false);
     }
     if (step === 7) {
         onSetNextEnabled(true);
     }
  }, [step, length, breadth, showAreaVisual, squaresInRow, rowsCount, formulaStage]);


  // Rendering Helpers
  const renderGrid = () => {
    const lines = [];
    const dots = [];
    
    // Vertical Lines
    for (let c = 0; c <= GRID_COLS; c++) {
      const x = toSvgX(c);
      const y1 = toSvgY(0); // Bottom
      const y2 = toSvgY(GRID_ROWS); // Top
      lines.push(
        React.createElement("line", {
            key: `v-${c}`, x1: x, y1: y1, x2: x, y2: y2,
            stroke: "rgba(255,255,255,0.2)", strokeWidth: 1
        })
      );
      // Dots
      for (let r = 0; r <= GRID_ROWS; r++) {
          const y = toSvgY(r);
          dots.push(React.createElement("circle", {
              key: `d-${c}-${r}`, cx: x, cy: y, r: 2, fill: "rgba(255,255,255,0.3)"
          }));
      }
    }
    // Horizontal Lines
    for (let r = 0; r <= GRID_ROWS; r++) {
        const y = toSvgY(r);
        const x1 = toSvgX(0);
        const x2 = toSvgX(GRID_COLS);
        lines.push(
            React.createElement("line", {
                key: `h-${r}`, x1: x1, y1: y, x2: x2, y2: y,
                stroke: "rgba(255,255,255,0.2)", strokeWidth: 1
            })
        );
    }

    return [...lines, ...dots];
  };

  const renderRectangle = () => {
    const x = toSvgX(RECT_START_X);
    const y = toSvgY(RECT_START_Y + (breadth === 0 && length > 0 ? 0 : breadth)); 
    
    let renderW = length * CELL_SIZE;
    let renderH = breadth * CELL_SIZE;
    let showLine = false;

    if (length > 0 && breadth === 0) {
        renderH = 4; // Small thick line
        showLine = true;
    } else if (breadth > 0 && length === 0) {
        renderW = 4;
        showLine = true;
    } else if (length === 0 && breadth === 0) {
        return null;
    }

    const svgY = toSvgY(RECT_START_Y + breadth);

    if (showLine) {
        if (length > 0 && breadth === 0) {
            return React.createElement("rect", {
                x: toSvgX(RECT_START_X), y: toSvgY(RECT_START_Y) - 2,
                width: renderW, height: 4,
                fill: "white", rx: 2
            });
        }
        if (breadth > 0 && length === 0) {
            return React.createElement("rect", {
                x: toSvgX(RECT_START_X), y: toSvgY(RECT_START_Y + breadth),
                width: 4, height: renderH,
                fill: "white", rx: 2
            });
        }
    }

    return React.createElement("rect", {
        x: x, y: svgY,
        width: renderW, height: renderH,
        fill: "rgba(0, 200, 255, 0.2)",
        stroke: "white", strokeWidth: 2
    });
  };

  const renderUnitSquares = () => {
      // Step 2, filled with counts
      if (step === 2 && showAreaVisual) {
          const squares = [];
          let count = 1;
          for (let r = 0; r < breadth; r++) { // Iterate rows
              for (let c = 0; c < length; c++) { // Iterate cols
                  const gx = RECT_START_X + c;
                  const gy = RECT_START_Y + r;
                  squares.push(
                      React.createElement("g", { key: `s-${r}-${c}` },
                          React.createElement("rect", {
                              x: toSvgX(gx), y: toSvgY(gy + 1),
                              width: CELL_SIZE, height: CELL_SIZE,
                              fill: "transparent", stroke: "white", strokeWidth: 1
                          }),
                          React.createElement("text", {
                              x: toSvgX(gx) + CELL_SIZE/2, y: toSvgY(gy + 1) + CELL_SIZE/2,
                              textAnchor: "middle", dominantBaseline: "middle",
                              fill: "white", fontSize: 24 // Increased 50% from 16
                          }, count++)
                      )
                  );
              }
          }
          return squares;
      }
      return null;
  };

  const renderRowFill = () => {
      // Step 3
      if (step === 3 && squaresInRow > 0) {
          const squares = [];
          const isCorrect = squaresInRow === length;

          for (let i = 1; i <= squaresInRow; i++) {
              let color;
              if (isCorrect) {
                  color = "rgba(16, 185, 129, 0.5)"; // All green if correct
              } else if (squaresInRow < length) {
                  color = "rgba(255, 235, 59, 0.5)"; // All yellow if under
              } else {
                  // Overflow case: Green if inside, Pink if outside
                  color = i <= length ? "rgba(16, 185, 129, 0.5)" : "rgba(233, 30, 99, 0.5)";
              }

              const gx = RECT_START_X + (i-1);
              const gy = RECT_START_Y; // Bottom row
              
              squares.push(
                  React.createElement("g", { key: `rf-${i}` },
                      React.createElement("rect", {
                          x: toSvgX(gx), y: toSvgY(gy + 1),
                          width: CELL_SIZE, height: CELL_SIZE,
                          fill: color, stroke: "white", strokeWidth: 2
                      }),
                      React.createElement("text", {
                          x: toSvgX(gx) + CELL_SIZE/2, y: toSvgY(gy + 1) + CELL_SIZE/2,
                          textAnchor: "middle", dominantBaseline: "middle",
                          fill: "white", fontSize: 24, fontWeight: "bold" // Increased font
                      }, i)
                  )
              );
          }
          return squares;
      }
      return null;
  };

  const renderRowsFill = () => {
    // Step 4
    if (step === 4 && rowsCount > 0) {
        const squares = [];
        const isCorrect = rowsCount === breadth;

        for (let r = 1; r <= rowsCount; r++) { // 1-indexed count
            let color;
            if (isCorrect) {
                 color = "rgba(16, 185, 129, 0.5)";
            } else if (rowsCount < breadth) {
                 color = "rgba(16, 185, 129, 0.5)"; // Instruction says "green as long as value is less than or equal". Wait, checking... "All the small squares... green as long as... less than or equal." OK.
            } else {
                 // Overflow
                 color = r <= breadth ? "rgba(16, 185, 129, 0.5)" : "rgba(233, 30, 99, 0.5)";
            }
            
            const rowLen = length; 
            
            for (let c = 0; c < rowLen; c++) {
                 const gx = RECT_START_X + c;
                 const gy = RECT_START_Y + (r - 1);
                 
                 squares.push(
                    React.createElement("rect", {
                         key: `rr-${r}-${c}`,
                        x: toSvgX(gx), y: toSvgY(gy + 1),
                        width: CELL_SIZE, height: CELL_SIZE,
                        fill: color, stroke: "white", strokeWidth: 1
                    })
                 );
            }
        }
        return squares;
    }
    return null;
  };
  
  const renderFullGridLabeled = () => {
      // Step 5-7
      if (step >= 5) {
          const squares = [];
          let count = 1;
          for (let r = 0; r < breadth; r++) {
              for (let c = 0; c < length; c++) {
                  const gx = RECT_START_X + c;
                  const gy = RECT_START_Y + r;
                   squares.push(
                      React.createElement("g", { key: `s5-${r}-${c}` },
                          React.createElement("rect", {
                              x: toSvgX(gx), y: toSvgY(gy + 1),
                              width: CELL_SIZE, height: CELL_SIZE,
                              fill: "rgba(16, 185, 129, 0.5)", // Green filled
                              stroke: "white", strokeWidth: 1
                          }),
                          React.createElement("text", {
                              x: toSvgX(gx) + CELL_SIZE/2, y: toSvgY(gy + 1) + CELL_SIZE/2,
                              textAnchor: "middle", dominantBaseline: "middle",
                              fill: "white", fontSize: 24 // Increased
                          }, count++)
                      )
                  );
              }
          }
          return squares;
      }
      return null;
  };
  
  /* Helper to check if colors should be applied */
  const shouldColor = () => {
    if (step > 5) return true;
    if (step === 5 && formulaStage >= 2) return true;
    return false;
  };

  // ARROWS
  const renderArrows = () => {
      const arrows = [];
      const ARROW_OFFSET = 30; // Distance from rect
      const ArrowTextSize = 24; 

      const isColored = shouldColor();
      const colorH = isColored ? "#10b981" : "white"; // Green or White
      const colorV = isColored ? "#0ea5e9" : "white"; // Blue or White

      // Marker IDs
      const midH = isColored ? "url(#arrow-green)" : "url(#arrow-white)";
      const misH = isColored ? "url(#arrow-green-rev)" : "url(#arrow-white-rev)";
      const midV = isColored ? "url(#arrow-blue)" : "url(#arrow-white)";
      const misV = isColored ? "url(#arrow-blue-rev)" : "url(#arrow-white-rev)";

      // Step 3+: Horizontal Arrow below rect showing squaresInRow (or length later)
      if (step === 3 && squaresInRow > 0) {
          const y = toSvgY(RECT_START_Y) + ARROW_OFFSET;
          const startX = toSvgX(RECT_START_X);
          const endX = toSvgX(RECT_START_X + squaresInRow);
          
          arrows.push(
              React.createElement("line", {
                  key: "a-h-step3",
                  x1: startX, y1: y, x2: endX, y2: y,
                  stroke: colorH, strokeWidth: 2,
                  markerEnd: midH, markerStart: misH
              }),
              React.createElement("text", {
                  key: "t-h-step3",
                  x: (startX + endX) / 2, y: y + 25,
                  fill: colorH, textAnchor: "middle", fontWeight: "bold", fontSize: ArrowTextSize
              }, squaresInRow)
          );
      }
      
      // Step 4+: Vertical Arrow
      if (step === 4 && rowsCount > 0) {
          const x = toSvgX(RECT_START_X) - ARROW_OFFSET;
          const startY = toSvgY(RECT_START_Y); // Bottom
          const endY = toSvgY(RECT_START_Y + rowsCount); // Top
          
          arrows.push(
               React.createElement("line", {
                  key: "a-v-step4",
                  x1: x, y1: startY, x2: x, y2: endY,
                  stroke: colorV,
                  strokeWidth: 2,
                  markerEnd: midV, markerStart: misV
              }),
               React.createElement("text", {
                  key: "t-v-step4",
                  x: x - 25, y: (startY + endY) / 2,
                  fill: colorV, textAnchor: "middle", fontWeight: "bold", fontSize: ArrowTextSize,
                  transform: `rotate(-90, ${x-25}, ${(startY+endY)/2})`
              }, rowsCount)
          );
          
          // Step 4 also needs the Horizontal arrow to persist
          const yh = toSvgY(RECT_START_Y) + ARROW_OFFSET;
          const startXh = toSvgX(RECT_START_X);
          const endXh = toSvgX(RECT_START_X + length);
           arrows.push(
              React.createElement("line", {
                  key: "a-h-step4-persist",
                  x1: startXh, y1: yh, x2: endXh, y2: yh,
                  stroke: colorH, strokeWidth: 2,
                  markerEnd: midH, markerStart: misH
              }),
              React.createElement("text", {
                  key: "t-h-step4-persist",
                  x: (startXh + endXh) / 2, y: yh + 25,
                  fill: colorH, textAnchor: "middle", fontWeight: "bold", fontSize: ArrowTextSize
              }, length)
          );
      }
      
      if (step >= 5) {
          // In step 7 use word labels "Length" / "Breadth"; otherwise use numeric values
          const vLabel = step === 7 ? APP_DATA.steps[1].sliders.breadth : breadth;
          const hLabel = step === 7 ? APP_DATA.steps[1].sliders.length : length;
          // Both arrows, color coded (or white if not yet colored)
          // Vertical (Blue/White)
           const x = toSvgX(RECT_START_X) - ARROW_OFFSET;
          const startY = toSvgY(RECT_START_Y);
          const endY = toSvgY(RECT_START_Y + breadth);
           arrows.push(
               React.createElement("line", {
                  key: "a-v-final",
                  x1: x, y1: startY, x2: x, y2: endY,
                  stroke: colorV, strokeWidth: 2,
                  markerEnd: midV, markerStart: misV
              }),
               React.createElement("text", {
                  key: "t-v-final",
                  x: x - 25, y: (startY + endY) / 2,
                  fill: colorV, textAnchor: "middle", fontWeight: "bold", fontSize: ArrowTextSize,
                  transform: `rotate(-90, ${x-25}, ${(startY+endY)/2})`
              }, vLabel)
          );
          
          // Horizontal (Green/White)
          const yh = toSvgY(RECT_START_Y) + ARROW_OFFSET;
          const startXh = toSvgX(RECT_START_X);
          const endXh = toSvgX(RECT_START_X + length);
           arrows.push(
              React.createElement("line", {
                  key: "a-h-final",
                  x1: startXh, y1: yh, x2: endXh, y2: yh,
                  stroke: colorH, strokeWidth: 2,
                  markerEnd: midH, markerStart: misH 
              }),
              React.createElement("text", {
                  key: "t-h-final",
                  x: (startXh + endXh) / 2, y: yh + 25,
                  fill: colorH, textAnchor: "middle", fontWeight: "bold", fontSize: ArrowTextSize
              }, hLabel)
          );
          
      // POINTING ARROWS (step 5 stage 2 and step 6 only; hidden in step 7)
      if (step === 6 || (step === 5 && formulaStage >= 2)) {
           
           const PointingArrowFontSize = 20;

           // --- Horizontal Pointing Arrow (SQUARES IN ONE ROW) ---
           // Label is at (hLabelX, hLabelY) = ((startXh+endXh)/2, yh+25)
           // We want pointing arrow to be to the RIGHT of this label, pointing LEFT.
           const hLabelX = (startXh + endXh) / 2;
           const hLabelY = yh + 25;
           
           // Target is the label's right side. Let's estimate label width or just add offset.
           const hGap = 40; 
           const hArrowLen = 60;
           
           const hArrowTipX = hLabelX + hGap; // Tip of arrow
           const hArrowTipY = hLabelY;        // Same Y level as label
           
           const hArrowEndX = hArrowTipX + hArrowLen; // Arrow tail (right side)
           const hArrowEndY = hLabelY;
           
           arrows.push(
                React.createElement("g", { key: "ptr-h" },
                     React.createElement("line", {
                         x1: hArrowEndX, y1: hArrowEndY, x2: hArrowTipX, y2: hArrowTipY,
                         stroke: colorH, strokeWidth: 2,
                         markerEnd: midH // Tip at x2 (Left)
                     }),
                     React.createElement("text", {
                         x: hArrowEndX + 10, y: hArrowEndY,
                         textAnchor: "start", dominantBaseline: "middle", 
                         fill: colorH, fontSize: PointingArrowFontSize, fontWeight: "bold"
                     }, APP_DATA.steps[5].labelSquaresInRow)
                )
           );
           
           // --- Vertical Pointing Arrow (NUMBER OF ROWS) ---
           // Label is at vLabelX, vLabelY = (x-25, (startY+endY)/2)
           // We want pointing arrow to be to the LEFT of this label, pointing RIGHT.
           const vLabelX = x - 25;
           const vLabelY = (startY + endY) / 2;
           
           // Target is the label's left side.
           const vGap = 40; // Gap from label
           const vArrowLen = 60;
           
           const vArrowTipX = vLabelX - vGap; // Tip of arrow (Right end of line)
           const vArrowTipY = vLabelY;
           
           const vArrowStartX = vArrowTipX - vArrowLen; // Tail (Left)
           const vArrowStartY = vLabelY;
           
           arrows.push(
                React.createElement("g", { key: "ptr-v" },
                     React.createElement("line", {
                         x1: vArrowStartX, y1: vArrowStartY, x2: vArrowTipX, y2: vArrowTipY,
                         stroke: colorV, strokeWidth: 2,
                         markerEnd: midV // Tip at x2 (Right)
                     }),
                     React.createElement("text", { 
                         x: vArrowStartX - 10, y: vArrowStartY, // Text to left of arrow tail
                         textAnchor: "end", dominantBaseline: "middle",
                         fill: colorV, fontSize: PointingArrowFontSize, fontWeight: "bold",
                         // No rotation
                     }, APP_DATA.steps[5].labelNumberOfRows)
                )
           );
      }
      }

      return arrows;
  };

  const renderSliders = () => {
    return React.createElement(React.Fragment, null,
      (step === 1 || step === 3) && React.createElement("div", { className: "slider-container-horizontal" },
          React.createElement("input", {
             type: "range", className: "horizontal-slider",
             min: 0, max: step === 1 ? MAX_LENGTH : 10,
             value: step === 1 ? length : squaresInRow,
             onChange: (e) => {
                 const v = parseInt(e.target.value);
                 if (step === 1) setLength(v);
                 if (step === 3) setSquaresInRow(v);
                 if (typeof playSound === "function") playSound("tick");
             }
          }),
          React.createElement("div", { className: "slider-label slider-label-h" }, 
             step === 1 ? `${APP_DATA.steps[1].sliders.length}: ${length}` 
             : `${APP_DATA.steps[3].sliderLabel}: ${squaresInRow}`
          )
      ),
      (step === 1 || step === 4) && React.createElement("div", { className: "slider-container-vertical" },
          React.createElement("input", {
             type: "range", className: "vertical-slider",
             min: 0, max: step === 1 ? MAX_BREADTH : 10,
             value: step === 1 ? breadth : rowsCount,
              onChange: (e) => {
                 const v = parseInt(e.target.value);
                 if (step === 1) setBreadth(v);
                 if (step === 4) setRowsCount(v);
                 if (typeof playSound === "function") playSound("tick");
             }
          }),
           React.createElement("div", { className: "slider-label slider-label-v" }, 
             step === 1 ? `${APP_DATA.steps[1].sliders.breadth}: ${breadth}` 
             : `${APP_DATA.steps[4].sliderLabel}: ${rowsCount}`
          )
      )
    );
  };

  // Action Row Content
  const renderActionRow = () => {
    // Step 2: Button
    if (step === 2) {
        return React.createElement("div", { className: "action-content" },
            !showAreaVisual ? React.createElement("button", { 
                className: "action-btn",
                onClick: () => {
                    setShowAreaVisual(true);
                    if (typeof playSound === "function") playSound("click");
                } 
            }, APP_DATA.steps[2].actionButton) 
            : React.createElement("span", { className: "action-text" }, 
                APP_DATA.steps[2].areaLabel.replace("{{count}}", length * breadth)
            )
        );
    }
    
    // Step 5
    if (step === 5) {
        return React.createElement("div", { className: "action-content" },
            React.createElement("span", { className: "action-text" }, 
                APP_DATA.steps[5].text1,
                // Stage 0 & 1: [ L x B ]
                formulaStage < 2 && React.createElement("span", { 
                    className: "clickable-box",
                    onClick: () => {
                        if (formulaStage === 0) {
                             if (typeof playSound === "function") playSound("click");
                             setFormulaStage(1);
                        } else if (formulaStage === 1) {
                             if (typeof playSound === "function") playSound("click");
                             setFormulaStage(2);
                        }
                    }
                }, 
                     // Colors should be present only if final stage? No, wait.
                     // "Only in step 5's final state... everything be color coded."
                     // BUT, formulaStage < 2 implies NOT final state (final state is 2).
                     // So here it should be WHITE (no highlight class).
                    React.createElement("span", { className: "" }, length),
                    " × ", 
                    React.createElement("span", { className: "" }, breadth)
                ),
                // Stage 1: = Area
                formulaStage === 1 && ` = ${length * breadth}`,
                
                // Stage 2: [ Squares in one row x Number of rows ] (This IS final state of Step 5)
                formulaStage === 2 && React.createElement("span", {
                    className: "clickable-box",
                    onClick: () => {
                        if (typeof playSound === "function") playSound("score");
                        onForceNext(); // Move to next step (Step 6)
                    }
                }, 
                     React.createElement("span", { className: "highlight-green" }, APP_DATA.steps[5].labelSquaresInRow),
                     " × ",
                     React.createElement("span", { className: "highlight-blue" }, APP_DATA.steps[5].labelNumberOfRows)
                )
            )
        );
    }

    if (step === 6) {
        // "Area of rectangle = [ Squares in one row x Number of rows ]"
        return React.createElement("div", { className: "action-content" },
             React.createElement("span", { className: "action-text" }, 
                APP_DATA.steps[6].textBefore,
                React.createElement("span", {
                    className: "clickable-box",
                    onClick: () => {
                        if (typeof playSound === "function") playSound("score");
                        onForceNext(); // Move to next step (Step 7)
                    }
                }, 
                     React.createElement("span", { className: "highlight-green" }, APP_DATA.steps[5].labelSquaresInRow),
                     " × ",
                     React.createElement("span", { className: "highlight-blue" }, APP_DATA.steps[5].labelNumberOfRows)
                )
             )
        );
    }
    
    if (step === 7) {
        // "Area of rectangle = Length × Breadth" — color-coded like step 6 (green=Length, blue=Breadth)
        return React.createElement("div", { className: "action-content" },
            React.createElement("span", { className: "action-text" },
                APP_DATA.steps[6].textBefore,
                React.createElement("span", { className: "highlight-green" }, APP_DATA.steps[1].sliders.length),
                " × ",
                React.createElement("span", { className: "highlight-blue" }, APP_DATA.steps[1].sliders.breadth)
            )
        );
    }

    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    
    // VISUAL ROW
    React.createElement(
      "div",
      { className: "visual-row" },
      React.createElement("div", { className: "grid-wrapper" },
          React.createElement(
               "svg",
               {
                 ref: svgRef,
                 viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
                 className: "grid-svg",
               },
               // ... SVG content ...
               // Defs for arrows
                React.createElement("defs", null,
                    React.createElement("marker", {
                      id: "arrow-green", markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto",
                    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#10b981" })),
                    React.createElement("marker", {
                      id: "arrow-green-rev", markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto-start-reverse",
                    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#10b981" })),
                    React.createElement("marker", {
                      id: "arrow-blue", markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto",
                    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#0ea5e9" })),
                    React.createElement("marker", {
                      id: "arrow-blue-rev", markerWidth: "5", markerHeight: "5", refX: "2.5", refY: "2.5", orient: "auto-start-reverse",
                    }, React.createElement("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "#0ea5e9" }))
                ),
               
               renderGrid(),
               renderRectangle(),
               renderUnitSquares(),
               renderRowFill(),
               renderRowsFill(),
               renderFullGridLabeled(),
               renderArrows()
          ),
          renderSliders()
      )
    ),

    // ACTION ROW
    React.createElement(
      "div",
      { className: "action-row" },
      renderActionRow()
    )
  );
};
