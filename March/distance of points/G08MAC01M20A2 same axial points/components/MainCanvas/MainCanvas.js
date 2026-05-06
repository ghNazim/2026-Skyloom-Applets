const MainCanvas = (props) => {
  const { useEffect, useState } = React;
  const {
    step,
    step1Phase,
    step2Phase,
    step3Phase,
    step4Question,
    step4Revealed,
    step5Revealed,
    step7Phase,
    step8Phase,
    step9Phase,
    step10Question,
    step10Revealed,
    step11Revealed,
    onQuestionMarkClick,
    onStep1RevealStart,
    onStep1RevealDone,
    onStep1Correct,
    onStep2RevealStart,
    onStep2RevealDone,
    onStep3RevealDone,
    onStep4RevealDone,
    onStep5RevealDone,
    onStep7RevealStart,
    onStep7RevealDone,
    onStep7Correct,
    onStep8RevealStart,
    onStep8RevealDone,
    onStep9RevealDone,
    onStep10RevealDone,
    onStep11RevealDone,
  } = props;

  const [step1Curves, setStep1Curves] = useState(0);
  const [step2Curves, setStep2Curves] = useState(0);
  const [step7Curves, setStep7Curves] = useState(0);
  const [step8Curves, setStep8Curves] = useState(0);
  const [wrongShakeBtn, setWrongShakeBtn] = useState(null);

  const point1Color = "#FFD34D";
  const point2Color = "#64C7FF";
  const gridMajor = "rgba(255,255,255,0.22)";
  const axisColor = "#ffffff";
  const white = "#ffffff";

  const unit = 46;
  const leftPad = 52;
  const rightPad = 28;
  const topPad = 36;
  const bottomPad = 48;
  const plotUnits = 10;
  const plotW = plotUnits * unit;
  const plotH = plotUnits * unit;
  const svgW = leftPad + plotW + rightPad;
  const svgH = topPad + plotH + bottomPad;
  const originX = leftPad;
  const originY = topPad + plotH;

  function toSvg(mx, my) {
    return { x: originX + mx * unit, y: originY - my * unit };
  }

  const p34 = toSvg(3, 4);
  const p84 = toSvg(8, 4);
  const p38 = toSvg(3, 8);
  const p64 = toSvg(6, 4);
  const p68 = toSvg(6, 8);

  useEffect(() => {
    setStep1Curves(0);
    setStep2Curves(0);
    setStep7Curves(0);
    setStep8Curves(0);
    setWrongShakeBtn(null);
  }, [step]);

  useEffect(() => {
    if (step !== 1 || step1Phase !== "revealing") return;
    let c = 0;
    const timer = setInterval(() => {
      c += 1;
      if (typeof playSound === "function") playSound("tick");
      setStep1Curves(c);
      if (c >= 3) {
        clearInterval(timer);
        onStep1RevealDone();
      }
    }, 320);
    return () => clearInterval(timer);
  }, [step, step1Phase, onStep1RevealDone]);

  useEffect(() => {
    if (step !== 2 || step2Phase !== "revealing") return;
    let c = 0;
    const timer = setInterval(() => {
      c += 1;
      if (typeof playSound === "function") playSound("tick");
      setStep2Curves(c);
      if (c >= 8) {
        clearInterval(timer);
        onStep2RevealDone();
      }
    }, 220);
    return () => clearInterval(timer);
  }, [step, step2Phase, onStep2RevealDone]);

  useEffect(() => {
    if (step !== 7 || step7Phase !== "revealing") return;
    let c = 0;
    const timer = setInterval(() => {
      c += 1;
      if (typeof playSound === "function") playSound("tick");
      setStep7Curves(c);
      if (c >= 4) {
        clearInterval(timer);
        onStep7RevealDone();
      }
    }, 320);
    return () => clearInterval(timer);
  }, [step, step7Phase, onStep7RevealDone]);

  useEffect(() => {
    if (step !== 8 || step8Phase !== "revealing") return;
    let c = 0;
    const timer = setInterval(() => {
      c += 1;
      if (typeof playSound === "function") playSound("tick");
      setStep8Curves(c);
      if (c >= 8) {
        clearInterval(timer);
        onStep8RevealDone();
      }
    }, 220);
    return () => clearInterval(timer);
  }, [step, step8Phase, onStep8RevealDone]);

  const gridEls = [];
  for (let i = 0; i <= plotUnits; i++) {
    const xi = originX + i * unit;
    gridEls.push(
      React.createElement("line", {
        key: "gv-" + i,
        x1: xi,
        y1: topPad,
        x2: xi,
        y2: originY,
        stroke: gridMajor,
        strokeWidth: 1,
      }),
    );
    const yi = originY - i * unit;
    gridEls.push(
      React.createElement("line", {
        key: "gh-" + i,
        x1: originX,
        y1: yi,
        x2: originX + plotW,
        y2: yi,
        stroke: gridMajor,
        strokeWidth: 1,
      }),
    );
  }

  const axisTicks = [];
  for (let i = 0; i <= plotUnits; i++) {
    const px = originX + i * unit;
    axisTicks.push(
      React.createElement(
        "text",
        {
          key: "tx-" + i,
          x: px,
          y: originY + 22,
          fill: "#fff",
          fontSize: 23,
          fontWeight: "bold",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        String(i),
      ),
    );
    if (i !== 0) {
      const py = originY - i * unit;
      axisTicks.push(
        React.createElement(
          "text",
          {
            key: "ty-" + i,
            x: originX - 18,
            y: py + 5,
            fill: "#fff",
            fontSize: 23,
            fontWeight: "bold",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }
  }

  function drawCurveArrows(count, color, y, labelY) {
    const items = [];
    for (let i = 0; i < count; i++) {
      const xStart = originX + i * unit;
      const xEnd = xStart + unit;
      const midX = (xStart + xEnd) / 2;
      items.push(
        React.createElement(
          "g",
          { key: "c-" + i },
          React.createElement("path", {
            d:
              "M " +
              xStart +
              " " +
              y +
              " Q " +
              midX +
              " " +
              (y - 28) +
              " " +
              xEnd +
              " " +
              y,
            fill: "none",
            stroke: color,
            strokeWidth: 3,
            markerEnd: "url(#curve-arrow-" + color.replace("#", "") + ")",
          }),
          React.createElement(
            "text",
            {
              x: midX - 2,
              y: labelY,
              fill: color,
              fontSize: 24,
              textAnchor: "middle",
              fontFamily: "system-ui, sans-serif",
            },
            String(i + 1),
          ),
        ),
      );
    }
    return items;
  }

  function drawVerticalCurveArrows(count, color, x, fromY, side = 1) {
    const items = [];
    for (let i = 0; i < count; i++) {
      const yStart = fromY - i * unit;
      const yEnd = yStart - unit;
      const midY = (yStart + yEnd) / 2;
      items.push(
        React.createElement(
          "g",
          { key: "vc-" + i },
          React.createElement("path", {
            d:
              "M " +
              x +
              " " +
              yStart +
              " Q " +
              (x + 20 * side) +
              " " +
              midY +
              " " +
              x +
              " " +
              yEnd,
            fill: "none",
            stroke: color,
            strokeWidth: 3,
            markerEnd: "url(#curve-arrow-" + color.replace("#", "") + ")",
          }),
          React.createElement(
            "text",
            {
              x: x + 28 * side,
              y: midY + 7,
              fill: color,
              fontSize: 24,
              textAnchor: "middle",
              fontFamily: "system-ui, sans-serif",
            },
            String(i + 1),
          ),
        ),
      );
    }
    return items;
  }

  function coordinateLabel(x, y, emphasizeX, xColor) {
    return React.createElement(
      "text",
      {
        x: x,
        y: y,
        fill: "#ffffff",
        fontSize: 34,
        fontFamily: "system-ui, sans-serif",
        textAnchor: "start",
      },
      React.createElement("tspan", null, "("),
      React.createElement(
        "tspan",
        {
          fill: emphasizeX ? xColor : "#ffffff",
          fontWeight: emphasizeX ? "700" : "500",
          fontSize: emphasizeX ? 37 : 34,
        },
        "x".replace("x", String(x === p34.x + 20 ? 3 : 8)),
      ),
      React.createElement("tspan", null, ", 4)"),
    );
  }

  function clickStep1Choice(choice) {
    if (step1Phase !== "choose") return;
    if (choice === "x") {
      if (typeof playSound === "function") playSound("correct");
      onStep1Correct();
      return;
    }
    if (typeof playSound === "function") playSound("wrong");
    setWrongShakeBtn("y");
    setTimeout(() => setWrongShakeBtn(null), 500);
  }

  function clickStep7Choice(choice) {
    if (step7Phase !== "choose") return;
    if (choice === "y") {
      if (typeof playSound === "function") playSound("correct");
      onStep7Correct();
      return;
    }
    if (typeof playSound === "function") playSound("wrong");
    setWrongShakeBtn("x");
    setTimeout(() => setWrongShakeBtn(null), 500);
  }

  function clickQuestionMark(onReveal) {
    if (typeof onQuestionMarkClick === "function") onQuestionMarkClick();
    if (typeof playSound === "function") playSound("click");
    onReveal();
  }

  function renderStep1() {
    const isInitial = step1Phase === "initial";
    const isRevealing = step1Phase === "revealing";
    const isChoose = step1Phase === "choose";
    const isDone = step1Phase === "done";
    const isAfterReveal = isChoose || isDone;
    const qBoxText = isAfterReveal ? "3" : "?";

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", {
        cx: p34.x,
        cy: p34.y,
        r: 8,
        fill: point1Color,
      }),
      React.createElement(
        "text",
        { x: p34.x + 20, y: p34.y + 8, fill: white, fontSize: 34 },
        React.createElement("tspan", null, "("),
        React.createElement(
          "tspan",
          { fill: isDone ? point1Color : white, fontSize: isDone ? 37 : 34, fontWeight: "700" },
          "3",
        ),
        React.createElement("tspan", null, ", 4)"),
      ),
      isInitial
        ? React.createElement("line", {
            x1: originX + 6,
            y1: p34.y,
            x2: p34.x - 6,
            y2: p34.y,
            stroke: point1Color,
            strokeWidth: 3,
            markerStart: "url(#arrow-yellow-start)",
            markerEnd: "url(#arrow-yellow-end)",
            className: "blink-line",
          })
        : null,
      (isRevealing || isAfterReveal) ? drawCurveArrows(step1Curves, point1Color, p34.y, p34.y - 20) : null,
      React.createElement(
        "g",
        {
          onClick: !isAfterReveal ? () => clickQuestionMark(onStep1RevealStart) : undefined,
          className: isInitial ? "q-box-clickable" : "",
        },
        React.createElement("rect", {
          x: originX + unit * 1.2,
          y: p34.y + 16,
          width: 46,
          height: 44,
          rx: 6,
          fill: "rgba(255,211,77,0.12)",
          stroke: point1Color,
          strokeWidth: 2,
          strokeDasharray: "5,4",
        }),
        React.createElement(
          "text",
          {
            x: originX + unit * 1.2 + 23,
            y: p34.y + 38,
            fill: point1Color,
            fontSize: 34,
            fontWeight: "700",
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          qBoxText,
        ),
      ),
      isAfterReveal
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("line", {
              x1: originX + unit * 3.2,
              y1: p34.y - 95,
              x2: p34.x + 34,
              y2: p34.y - 10,
              stroke: "rgba(255,255,255,0.7)",
              strokeWidth: 1,
            }),
            React.createElement("line", {
              x1: originX + unit * 5.2,
              y1: p34.y + 120,
              x2: p34.x + 86,
              y2: p34.y - 10,
              stroke: "rgba(255,255,255,0.7)",
              strokeWidth: 1,
            }),
            React.createElement(
              "g",
              {
                onClick: () => clickStep1Choice("x"),
                className:
                  "coord-btn " +
                  (isDone ? "coord-btn-correct" : "") +
                  (wrongShakeBtn === "x" ? " coord-btn-wrong" : ""),
              },
              React.createElement("rect", {
                x: originX + unit * 2.8,
                y: p34.y - 130,
                width: 220,
                height: 48,
                rx: 8,
              }),
              React.createElement(
                "text",
                {
                  x: originX + unit * 2.8 + 110,
                  y: p34.y - 98,
                  textAnchor: "middle",
                  fontSize: 34,
                },
                APP_DATA.steps[1].xCoordinateBtn,
              ),
            ),
            React.createElement(
              "g",
              {
                onClick: () => clickStep1Choice("y"),
                className:
                  "coord-btn " +
                  (wrongShakeBtn === "y" ? "coord-btn-wrong coord-btn-shake" : ""),
              },
              React.createElement("rect", {
                x: originX + unit * 4.8,
                y: p34.y + 96,
                width: 210,
                height: 48,
                rx: 8,
              }),
              React.createElement(
                "text",
                {
                  x: originX + unit * 4.8 + 105,
                  y: p34.y + 128,
                  textAnchor: "middle",
                  fontSize: 34,
                },
                APP_DATA.steps[1].yCoordinateBtn,
              ),
            ),
          )
        : null,
    );
  }

  function renderStep2() {
    const isInitial = step2Phase === "initial";
    const isRevealing = step2Phase === "revealing";
    const isDone = step2Phase === "done";
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: p84.x, cy: p84.y, r: 8, fill: point2Color }),
      React.createElement(
        "text",
        { x: p84.x + 20, y: p84.y + 8, fill: white, fontSize: 34 },
        React.createElement("tspan", null, "("),
        React.createElement(
          "tspan",
          { fill: isDone ? point2Color : white, fontSize: isDone ? 37 : 34, fontWeight: "700" },
          "8",
        ),
        React.createElement("tspan", null, ", 4)"),
      ),
      isInitial
        ? React.createElement("line", {
            x1: originX + 6,
            y1: p84.y,
            x2: p84.x - 6,
            y2: p84.y,
            stroke: point2Color,
            strokeWidth: 3,
            markerStart: "url(#arrow-blue-start)",
            markerEnd: "url(#arrow-blue-end)",
            className: "blink-line",
          })
        : null,
      (isRevealing || isDone) ? drawCurveArrows(step2Curves, point2Color, p84.y, p84.y - 20) : null,
      !isDone
        ? React.createElement(
            "g",
            {
              onClick: step2Phase === "initial" ? () => clickQuestionMark(onStep2RevealStart) : undefined,
              className: step2Phase === "initial" ? "q-box-clickable" : "",
            },
            React.createElement("rect", {
              x: originX + unit * 4.2,
              y: p84.y + 16,
              width: 46,
              height: 44,
              rx: 6,
              fill: "rgba(100,199,255,0.12)",
              stroke: point2Color,
              strokeWidth: 2,
              strokeDasharray: "5,4",
            }),
            React.createElement(
              "text",
              {
                x: originX + unit * 4.2 + 23,
                y: p84.y + 38,
                fill: point2Color,
                fontSize: 34,
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              "?",
            ),
          )
        : React.createElement(
            "g",
            null,
            React.createElement("rect", {
              x: originX + unit * 4.2,
              y: p84.y + 16,
              width: 46,
              height: 44,
              rx: 6,
              fill: "rgba(100,199,255,0.12)",
              stroke: point2Color,
              strokeWidth: 2,
              strokeDasharray: "5,4",
            }),
            React.createElement(
              "text",
              {
                x: originX + unit * 4.2 + 23,
                y: p84.y + 38,
                fill: point2Color,
                fontSize: 34,
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              "8",
            ),
          ),
    );
  }

  function renderStep3() {
    const isDone = step3Phase === "done";
    const p34LabelY = p34.y + 52;
    const p84LabelY = p84.y + 52;
    const blueLineY = p84.y + 73;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: p34.x, cy: p34.y, r: 8, fill: point1Color }),
      React.createElement("circle", { cx: p84.x, cy: p84.y, r: 8, fill: point2Color }),
      React.createElement(
        "text",
        { x: p34.x, y: p34LabelY, fill: white, fontSize: 34, textAnchor: "middle" },
        React.createElement("tspan", null, "("),
        React.createElement(
          "tspan",
          { fill: isDone ? point1Color : white, fontSize: isDone ? 37 : 34, fontWeight: isDone ? "700" : "500" },
          "3",
        ),
        React.createElement("tspan", null, ", 4)"),
      ),
      React.createElement(
        "text",
        { x: p84.x, y: p84LabelY, fill: white, fontSize: 34, textAnchor: "middle" },
        React.createElement("tspan", null, "("),
        React.createElement(
          "tspan",
          { fill: isDone ? point2Color : white, fontSize: isDone ? 37 : 34, fontWeight: isDone ? "700" : "500" },
          "8",
        ),
        React.createElement("tspan", null, ", 4)"),
      ),
      !isDone
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("line", {
              x1: originX + 6,
              y1: p34.y,
              x2: p34.x - 6,
              y2: p34.y,
              stroke: point1Color,
              strokeWidth: 3,
              markerStart: "url(#arrow-yellow-start)",
              markerEnd: "url(#arrow-yellow-end)",
            }),
            React.createElement(
              "text",
              { x: originX + (p34.x - originX) / 2, y: p34.y - 18, fill: point1Color, fontSize: 30, textAnchor: "middle" },
              "3",
            ),
            React.createElement("line", {
              x1: originX + 6,
              y1: blueLineY,
              x2: p84.x - 6,
              y2: blueLineY,
              stroke: point2Color,
              strokeWidth: 3,
              markerStart: "url(#arrow-blue-start)",
              markerEnd: "url(#arrow-blue-end)",
            }),
            React.createElement(
              "text",
              { x: originX + (p84.x - originX) / 2, y: blueLineY + 30, fill: point2Color, fontSize: 30, textAnchor: "middle" },
              "8",
            ),
          )
        : null,
      React.createElement("line", {
        x1: p34.x,
        y1: p34.y,
        x2: p84.x,
        y2: p84.y,
        stroke: white,
        strokeWidth: 3,
        markerStart: "url(#arrow-white-start)",
        markerEnd: "url(#arrow-white-end)",
        className: isDone ? "" : "blink-line",
      }),
      !isDone
        ? React.createElement(
            "g",
            { onClick: () => clickQuestionMark(onStep3RevealDone), className: "q-box-clickable" },
            React.createElement("rect", {
              x: (p34.x + p84.x) / 2 - 23,
              y: p34.y - 78,
              width: 46,
              height: 44,
              rx: 6,
              fill: "rgba(255,255,255,0.12)",
              stroke: white,
              strokeWidth: 2,
              strokeDasharray: "5,4",
            }),
            React.createElement(
              "text",
              {
                x: (p34.x + p84.x) / 2,
                y: p34.y - 56,
                fill: white,
                fontSize: 34,
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              "?",
            ),
          )
        : React.createElement(
            "g",
            null,
            React.createElement("rect", {
              x: (p34.x + p84.x) / 2 - 82,
              y: p34.y - 78,
              width: 164,
              height: 46,
              rx: 6,
              fill: "rgba(255,255,255,0.12)",
              stroke: white,
              strokeWidth: 2,
              strokeDasharray: "5,4",
            }),
            React.createElement(
              "text",
              { x: (p34.x + p84.x) / 2, y: p34.y - 46, textAnchor: "middle", fontSize: 30, fill: white },
              React.createElement("tspan", { fill: point2Color }, "8"),
              React.createElement("tspan", { fill: white }, " - "),
              React.createElement("tspan", { fill: point1Color }, "3"),
              React.createElement("tspan", { fill: white }, " = 5"),
            ),
          ),
    );
  }

  function renderStep7() {
    const isInitial = step7Phase === "initial";
    const isRevealing = step7Phase === "revealing";
    const isChoose = step7Phase === "choose";
    const isDone = step7Phase === "done";
    const isAfterReveal = isChoose || isDone;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: p64.x, cy: p64.y, r: 8, fill: point1Color }),
      React.createElement(
        "text",
        { x: p64.x - 57, y: p64.y + 8, fill: white, fontSize: 34, textAnchor: "middle" },
        React.createElement("tspan", null, "("),
        React.createElement("tspan", null, "6, "),
        React.createElement(
          "tspan",
          { fill: isDone ? point1Color : white, fontSize: isDone ? 37 : 34, fontWeight: isDone ? "700" : "500" },
          "4",
        ),
        React.createElement("tspan", null, ")"),
      ),
      isInitial
        ? React.createElement("line", {
            x1: p64.x,
            y1: originY - 6,
            x2: p64.x,
            y2: p64.y + 6,
            stroke: point1Color,
            strokeWidth: 3,
            markerStart: "url(#arrow-yellow-start)",
            markerEnd: "url(#arrow-yellow-end)",
            className: "blink-line",
          })
        : null,
      (isRevealing || isAfterReveal)
        ? drawVerticalCurveArrows(step7Curves, point1Color, p64.x, originY, -1)
        : null,
      React.createElement(
        "g",
        {
          onClick: !isAfterReveal ? () => clickQuestionMark(onStep7RevealStart) : undefined,
          className: isInitial ? "q-box-clickable" : "",
        },
        React.createElement("rect", {
          x: p64.x + 18,
          y: (originY + p64.y) / 2 - 20,
          width: 46,
          height: 44,
          rx: 6,
          fill: "rgba(255,211,77,0.12)",
          stroke: point1Color,
          strokeWidth: 2,
          strokeDasharray: "5,4",
        }),
        React.createElement(
          "text",
          {
            x: p64.x + 41,
            y: (originY + p64.y) / 2 + 2,
            fill: point1Color,
            fontSize: 34,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          isAfterReveal ? "4" : "?",
        ),
      ),
      isAfterReveal
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("line", {
              x1: p64.x - 48,
              y1: p64.y - 76,
              x2: p64.x - 74,
              y2: p64.y - 4,
              stroke: "rgba(255,255,255,0.7)",
              strokeWidth: 1,
            }),
            React.createElement("line", {
              x1: p64.x + 170,
              y1: p64.y + 120,
              x2: p64.x - 40,
              y2: p64.y - 4,
              stroke: "rgba(255,255,255,0.7)",
              strokeWidth: 1,
            }),
            React.createElement(
              "g",
              {
                onClick: () => clickStep7Choice("x"),
                className:
                  "coord-btn " +
                  (wrongShakeBtn === "x" ? "coord-btn-wrong coord-btn-shake" : ""),
              },
              React.createElement("rect", {
                x: p64.x - 130,
                y: p64.y - 112,
                width: 220,
                height: 48,
                rx: 8,
              }),
              React.createElement(
                "text",
                { x: p64.x - 20, y: p64.y - 80, textAnchor: "middle", fontSize: 34 },
                APP_DATA.steps[7].xCoordinateBtn,
              ),
            ),
            React.createElement(
              "g",
              {
                onClick: () => clickStep7Choice("y"),
                className: "coord-btn " + (isDone ? "coord-btn-correct" : ""),
              },
              React.createElement("rect", {
                x: p64.x + 96,
                y: p64.y + 96,
                width: 210,
                height: 48,
                rx: 8,
              }),
              React.createElement(
                "text",
                { x: p64.x + 201, y: p64.y + 128, textAnchor: "middle", fontSize: 34 },
                APP_DATA.steps[7].yCoordinateBtn,
              ),
            ),
          )
        : null,
    );
  }

  function renderStep8() {
    const isInitial = step8Phase === "initial";
    const isRevealing = step8Phase === "revealing";
    const isDone = step8Phase === "done";
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: p68.x, cy: p68.y, r: 8, fill: point2Color }),
      React.createElement(
        "text",
        { x: p68.x - 57, y: p68.y + 8, fill: white, fontSize: 34, textAnchor: "middle" },
        React.createElement("tspan", null, "("),
        React.createElement("tspan", null, "6, "),
        React.createElement(
          "tspan",
          { fill: isDone ? point2Color : white, fontSize: isDone ? 37 : 34, fontWeight: isDone ? "700" : "500" },
          "8",
        ),
        React.createElement("tspan", null, ")"),
      ),
      isInitial
        ? React.createElement("line", {
            x1: p68.x,
            y1: originY - 6,
            x2: p68.x,
            y2: p68.y + 6,
            stroke: point2Color,
            strokeWidth: 3,
            markerStart: "url(#arrow-blue-start)",
            markerEnd: "url(#arrow-blue-end)",
            className: "blink-line",
          })
        : null,
      (isRevealing || isDone)
        ? drawVerticalCurveArrows(step8Curves, point2Color, p68.x, originY, -1)
        : null,
      React.createElement(
        "g",
        {
          onClick: !isDone && step8Phase === "initial" ? () => clickQuestionMark(onStep8RevealStart) : undefined,
          className: step8Phase === "initial" ? "q-box-clickable" : "",
        },
        React.createElement("rect", {
          x: p68.x + 18,
          y: (originY + p68.y) / 2 - 20,
          width: 46,
          height: 44,
          rx: 6,
          fill: "rgba(100,199,255,0.12)",
          stroke: point2Color,
          strokeWidth: 2,
          strokeDasharray: "5,4",
        }),
        React.createElement(
          "text",
          {
            x: p68.x + 41,
            y: (originY + p68.y) / 2 + 2,
            fill: point2Color,
            fontSize: 34,
            textAnchor: "middle",
            dominantBaseline: "middle",
          },
          isDone ? "8" : "?",
        ),
      ),
    );
  }

  function renderStep9() {
    const isDone = step9Phase === "done";
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: p64.x, cy: p64.y, r: 8, fill: point1Color }),
      React.createElement("circle", { cx: p68.x, cy: p68.y, r: 8, fill: point2Color }),
      React.createElement(
        "text",
        { x: p64.x - 57, y: p64.y + 8, fill: white, fontSize: 34, textAnchor: "middle" },
        React.createElement("tspan", null, "(6, "),
        React.createElement("tspan", { fill: isDone ? point1Color : white, fontSize: isDone ? 37 : 34 }, "4"),
        React.createElement("tspan", null, ")"),
      ),
      React.createElement(
        "text",
        { x: p68.x - 57, y: p68.y + 8, fill: white, fontSize: 34, textAnchor: "middle" },
        React.createElement("tspan", null, "(6, "),
        React.createElement("tspan", { fill: isDone ? point2Color : white, fontSize: isDone ? 37 : 34 }, "8"),
        React.createElement("tspan", null, ")"),
      ),
      !isDone
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("line", {
              x1: p64.x,
              y1: originY - 6,
              x2: p64.x,
              y2: p64.y + 6,
              stroke: point1Color,
              strokeWidth: 3,
              markerStart: "url(#arrow-yellow-start)",
              markerEnd: "url(#arrow-yellow-end)",
            }),
            React.createElement(
              "text",
              { x: p64.x - 22, y: (originY + p64.y) / 2, fill: point1Color, fontSize: 30, textAnchor: "middle" },
              "4",
            ),
            React.createElement("line", {
              x1: p68.x + 38,
              y1: originY - 6,
              x2: p68.x + 38,
              y2: p68.y + 6,
              stroke: point2Color,
              strokeWidth: 3,
              markerStart: "url(#arrow-blue-start)",
              markerEnd: "url(#arrow-blue-end)",
            }),
            React.createElement(
              "text",
              { x: p68.x + 60, y: (originY + p68.y) / 2, fill: point2Color, fontSize: 30, textAnchor: "middle" },
              "8",
            ),
          )
        : null,
      React.createElement("line", {
        x1: p64.x,
        y1: p64.y,
        x2: p68.x,
        y2: p68.y,
        stroke: white,
        strokeWidth: 3,
        markerStart: "url(#arrow-white-start)",
        markerEnd: "url(#arrow-white-end)",
        className: isDone ? "" : "blink-line",
      }),
      !isDone
        ? React.createElement(
            "g",
            { onClick: () => clickQuestionMark(onStep9RevealDone), className: "q-box-clickable" },
            React.createElement("rect", {
              x: p64.x - 70,
              y: (p64.y + p68.y) / 2 - 22,
              width: 46,
              height: 44,
              rx: 6,
              fill: "rgba(255,255,255,0.12)",
              stroke: white,
              strokeWidth: 2,
              strokeDasharray: "5,4",
            }),
            React.createElement(
              "text",
              { x: p64.x - 47, y: (p64.y + p68.y) / 2 + 1, fill: white, fontSize: 34, textAnchor: "middle", dominantBaseline: "middle" },
              "?",
            ),
          )
        : renderExpressionBox(p64.x - 112, (p64.y + p68.y) / 2, "numeric", 4, 8),
    );
  }

  function renderPointCoordinateLabel(point, labelColor, xVal, yVal, emphasize) {
    return React.createElement(
      "text",
      { x: point.x, y: point.y + 44, fill: white, fontSize: 34, textAnchor: "middle" },
      React.createElement("tspan", null, "("),
      React.createElement(
        "tspan",
        {
          fill: emphasize ? labelColor : white,
          fontSize: emphasize ? 37 : 34,
          fontWeight: emphasize ? "700" : "500",
        },
        String(xVal),
      ),
      React.createElement("tspan", null, ", " + String(yVal) + ")"),
    );
  }

  function renderExpressionBox(cx, cy, exprType, x1, x2) {
    let content = null;
    if (exprType === "numeric") {
      content = React.createElement(
        React.Fragment,
        null,
        React.createElement("tspan", { fill: point2Color }, String(x2)),
        React.createElement("tspan", { fill: white }, " - "),
        React.createElement("tspan", { fill: point1Color }, String(x1)),
        React.createElement("tspan", { fill: white }, " = " + String(x2 - x1)),
      );
    } else if (exprType === "symbolic") {
      content = React.createElement(
        React.Fragment,
        null,
        React.createElement("tspan", { fill: point2Color }, "x₂"),
        React.createElement("tspan", { fill: white }, " - "),
        React.createElement("tspan", { fill: point1Color }, "x₁"),
      );
    } else {
      content = React.createElement(
        React.Fragment,
        null,
        React.createElement("tspan", { fill: white }, "| "),
        React.createElement("tspan", { fill: point2Color }, "x₂"),
        React.createElement("tspan", { fill: white }, " - "),
        React.createElement("tspan", { fill: point1Color }, "x₁"),
        React.createElement("tspan", { fill: white }, " |"),
      );
    }

    return React.createElement(
      "g",
      null,
      React.createElement("rect", {
        x: cx - 82,
        y: cy - 22,
        width: 164,
        height: 46,
        rx: 6,
        fill: "rgba(255,255,255,0.12)",
        stroke: white,
        strokeWidth: 2,
        strokeDasharray: "5,4",
      }),
      React.createElement(
        "text",
        { x: cx, y: cy + 9, textAnchor: "middle", fontSize: 34, fill: white },
        content,
      ),
    );
  }

  function renderHorizontalDistanceScene(config) {
    const { p1, p2, revealed, onReveal, expressionType, symbolicLabel } = config;
    const s1 = toSvg(p1[0], p1[1]);
    const s2 = toSvg(p2[0], p2[1]);
    const midX = (s1.x + s2.x) / 2;
    const midY = s1.y;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: s1.x, cy: s1.y, r: 8, fill: point1Color }),
      React.createElement("circle", { cx: s2.x, cy: s2.y, r: 8, fill: point2Color }),
      symbolicLabel
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "text",
              { x: s1.x, y: s1.y + 44, fill: white, fontSize: 38, textAnchor: "middle" },
              React.createElement("tspan", null, "("),
              React.createElement("tspan", { fill: point1Color }, "x"),
              React.createElement("tspan", { fill: point1Color, fontSize: "70%", baselineShift: "sub" }, "1"),
              React.createElement("tspan", null, ", y)"),
            ),
            React.createElement(
              "text",
              { x: s2.x, y: s2.y + 44, fill: white, fontSize: 38, textAnchor: "middle" },
              React.createElement("tspan", null, "("),
              React.createElement("tspan", { fill: point2Color }, "x"),
              React.createElement("tspan", { fill: point2Color, fontSize: "70%", baselineShift: "sub" }, "2"),
              React.createElement("tspan", null, ", y)"),
            ),
          )
        : React.createElement(
            React.Fragment,
            null,
            renderPointCoordinateLabel(s1, point1Color, p1[0], p1[1], revealed),
            renderPointCoordinateLabel(s2, point2Color, p2[0], p2[1], revealed),
          ),
      React.createElement("line", {
        x1: s1.x + 6,
        y1: s1.y,
        x2: s2.x - 6,
        y2: s2.y,
        stroke: white,
        strokeWidth: 3,
        markerStart: "url(#arrow-white-start)",
        markerEnd: "url(#arrow-white-end)",
        className: revealed ? "" : "blink-line",
      }),
      !revealed
        ? React.createElement(
            "g",
            { onClick: () => clickQuestionMark(onReveal), className: "q-box-clickable" },
            React.createElement("rect", {
              x: midX - 23,
              y: midY - 78,
              width: 46,
              height: 44,
              rx: 6,
              fill: "rgba(255,255,255,0.12)",
              stroke: white,
              strokeWidth: 2,
              strokeDasharray: "5,4",
            }),
            React.createElement(
              "text",
              {
                x: midX,
                y: midY - 56,
                fill: white,
                fontSize: 34,
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              "?",
            ),
          )
        : renderExpressionBox(midX, midY - 56, expressionType, p1[0], p2[0]),
    );
  }

  function renderExpressionBoxY(cx, cy, exprType, y1, y2) {
    let content = null;
    if (exprType === "numeric") {
      content = React.createElement(
        React.Fragment,
        null,
        React.createElement("tspan", { fill: point2Color }, String(y2)),
        React.createElement("tspan", { fill: white }, " - "),
        React.createElement("tspan", { fill: point1Color }, String(y1)),
        React.createElement("tspan", { fill: white }, " = " + String(y2 - y1)),
      );
    } else if (exprType === "symbolic") {
      content = React.createElement(
        React.Fragment,
        null,
        React.createElement("tspan", { fill: point2Color }, "y₂"),
        React.createElement("tspan", { fill: white }, " - "),
        React.createElement("tspan", { fill: point1Color }, "y₁"),
      );
    } else {
      content = React.createElement(
        React.Fragment,
        null,
        React.createElement("tspan", { fill: white }, "| "),
        React.createElement("tspan", { fill: point2Color }, "y₂"),
        React.createElement("tspan", { fill: white }, " - "),
        React.createElement("tspan", { fill: point1Color }, "y₁"),
        React.createElement("tspan", { fill: white }, " |"),
      );
    }
    return React.createElement(
      "g",
      null,
      React.createElement("rect", {
        x: cx - 82,
        y: cy - 22,
        width: 164,
        height: 46,
        rx: 6,
        fill: "rgba(255,255,255,0.12)",
        stroke: white,
        strokeWidth: 2,
        strokeDasharray: "5,4",
      }),
      React.createElement(
        "text",
        { x: cx, y: cy + 9, textAnchor: "middle", fontSize: 34, fill: white },
        content,
      ),
    );
  }

  function renderVerticalDistanceScene(config) {
    const { p1, p2, revealed, onReveal, expressionType, symbolicLabel } = config;
    const s1 = toSvg(p1[0], p1[1]);
    const s2 = toSvg(p2[0], p2[1]);
    const lowerIsP1 = p1[1] <= p2[1];
    const lowerPoint = lowerIsP1 ? s1 : s2;
    const higherPoint = lowerIsP1 ? s2 : s1;
    const yLow = Math.min(p1[1], p2[1]);
    const yHigh = Math.max(p1[1], p2[1]);
    const midY = (lowerPoint.y + higherPoint.y) / 2;
    const x = lowerPoint.x;
    const labelOffsetNumeric = 66;
    const labelOffsetSymbolic = 76;

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("circle", { cx: lowerPoint.x, cy: lowerPoint.y, r: 8, fill: point1Color }),
      React.createElement("circle", { cx: higherPoint.x, cy: higherPoint.y, r: 8, fill: point2Color }),
      symbolicLabel
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "text",
              { x: lowerPoint.x + labelOffsetSymbolic, y: lowerPoint.y + 8, fill: white, fontSize: 38, textAnchor: "middle" },
              React.createElement("tspan", null, "(x, "),
              React.createElement("tspan", { fill: point1Color }, "y"),
              React.createElement("tspan", { fill: point1Color, fontSize: "70%", baselineShift: "sub" }, "1"),
              React.createElement("tspan", null, ")"),
            ),
            React.createElement(
              "text",
              { x: higherPoint.x + labelOffsetSymbolic, y: higherPoint.y + 8, fill: white, fontSize: 38, textAnchor: "middle" },
              React.createElement("tspan", null, "(x, "),
              React.createElement("tspan", { fill: point2Color }, "y"),
              React.createElement("tspan", { fill: point2Color, fontSize: "70%", baselineShift: "sub" }, "2"),
              React.createElement("tspan", null, ")"),
            ),
          )
        : React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "text",
              { x: lowerPoint.x + labelOffsetNumeric, y: lowerPoint.y + 8, fill: white, fontSize: 34, textAnchor: "middle" },
              React.createElement("tspan", null, "(" + p1[0] + ", "),
              React.createElement("tspan", { fill: revealed ? point1Color : white, fontSize: revealed ? 37 : 34 }, String(yLow)),
              React.createElement("tspan", null, ")"),
            ),
            React.createElement(
              "text",
              { x: higherPoint.x + labelOffsetNumeric, y: higherPoint.y + 8, fill: white, fontSize: 34, textAnchor: "middle" },
              React.createElement("tspan", null, "(" + p2[0] + ", "),
              React.createElement("tspan", { fill: revealed ? point2Color : white, fontSize: revealed ? 37 : 34 }, String(yHigh)),
              React.createElement("tspan", null, ")"),
            ),
          ),
      React.createElement("line", {
        x1: x,
        y1: lowerPoint.y - 6,
        x2: x,
        y2: higherPoint.y + 6,
        stroke: white,
        strokeWidth: 3,
        markerStart: "url(#arrow-white-start)",
        markerEnd: "url(#arrow-white-end)",
        className: revealed ? "" : "blink-line",
      }),
      !revealed
        ? React.createElement(
            "g",
            { onClick: () => clickQuestionMark(onReveal), className: "q-box-clickable" },
            React.createElement("rect", {
              x: x + 24,
              y: midY - 22,
              width: 46,
              height: 44,
              rx: 6,
              fill: "rgba(255,255,255,0.12)",
              stroke: white,
              strokeWidth: 2,
              strokeDasharray: "5,4",
            }),
            React.createElement(
              "text",
              {
                x: x + 47,
                y: midY + 1,
                fill: white,
                fontSize: 34,
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              "?",
            ),
          )
        : renderExpressionBoxY(x + 102, midY, expressionType, yLow, yHigh),
    );
  }

  const marginAxes = 8;
  return React.createElement(
    "div",
    { className: "main-canvas-container distance-applet-canvas single-svg-canvas" },
    React.createElement(
      "svg",
      {
        viewBox: "0 0 " + svgW + " " + svgH,
        className: "grid-svg distance-coordinate-svg",
        preserveAspectRatio: "xMidYMid meet",
      },
      React.createElement(
        "defs",
        null,
        ["yellow", "blue", "white"].map((name) =>
          React.createElement(
            "marker",
            {
              id: "arrow-" + name + "-end",
              key: "m-end-" + name,
              markerWidth: 6,
              markerHeight: 6,
              refX: 5,
              refY: 3,
              orient: "auto",
              markerUnits: "strokeWidth",
            },
            React.createElement("path", {
              d: "M0,0 L6,3 L0,6 z",
              fill: name === "yellow" ? point1Color : name === "blue" ? point2Color : white,
            }),
          ),
        ),
        ["yellow", "blue", "white"].map((name) =>
          React.createElement(
            "marker",
            {
              id: "arrow-" + name + "-start",
              key: "m-start-" + name,
              markerWidth: 6,
              markerHeight: 6,
              refX: 1,
              refY: 3,
              orient: "auto",
              markerUnits: "strokeWidth",
            },
            React.createElement("path", {
              d: "M6,0 L0,3 L6,6 z",
              fill: name === "yellow" ? point1Color : name === "blue" ? point2Color : white,
            }),
          ),
        ),
        [point1Color, point2Color].map((col) =>
          React.createElement(
            "marker",
            {
              key: "c-" + col,
              id: "curve-arrow-" + col.replace("#", ""),
              markerWidth: 8,
              markerHeight: 8,
              refX: 7,
              refY: 3,
              orient: "auto",
            },
            React.createElement("path", { d: "M0,0 L8,3 L0,6 z", fill: col }),
          ),
        ),
      ),
      gridEls,
      React.createElement("line", {
        x1: originX - marginAxes,
        y1: originY,
        x2: originX + plotW + marginAxes,
        y2: originY,
        stroke: axisColor,
        strokeWidth: 2,
        markerEnd: "url(#arrow-white-end)",
      }),
      React.createElement("line", {
        x1: originX,
        y1: originY + marginAxes,
        x2: originX,
        y2: topPad - marginAxes,
        stroke: axisColor,
        strokeWidth: 2,
        markerEnd: "url(#arrow-white-end)",
      }),
      axisTicks,
      step === 1 ? renderStep1() : null,
      step === 2 ? renderStep2() : null,
      step === 3 ? renderStep3() : null,
      step === 4
        ? renderHorizontalDistanceScene({
            p1: step4Question.p1,
            p2: step4Question.p2,
            revealed: step4Revealed,
            onReveal: onStep4RevealDone,
            expressionType: "numeric",
            symbolicLabel: false,
          })
        : null,
      step === 5
        ? renderHorizontalDistanceScene({
            p1: [4, 5],
            p2: [9, 5],
            revealed: step5Revealed,
            onReveal: onStep5RevealDone,
            expressionType: "symbolic",
            symbolicLabel: true,
          })
        : null,
      step === 6
        ? renderHorizontalDistanceScene({
            p1: [4, 5],
            p2: [9, 5],
            revealed: true,
            onReveal: () => null,
            expressionType: "absolute",
            symbolicLabel: true,
          })
        : null,
      step === 7 ? renderStep7() : null,
      step === 8 ? renderStep8() : null,
      step === 9 ? renderStep9() : null,
      step === 10
        ? renderVerticalDistanceScene({
            p1: step10Question.p1,
            p2: step10Question.p2,
            revealed: step10Revealed,
            onReveal: onStep10RevealDone,
            expressionType: "numeric",
            symbolicLabel: false,
          })
        : null,
      step === 11
        ? renderVerticalDistanceScene({
            p1: [5, 2],
            p2: [5, 8],
            revealed: step11Revealed,
            onReveal: onStep11RevealDone,
            expressionType: "symbolic",
            symbolicLabel: true,
          })
        : null,
      step === 12
        ? renderVerticalDistanceScene({
            p1: [5, 2],
            p2: [5, 8],
            revealed: true,
            onReveal: () => null,
            expressionType: "absolute",
            symbolicLabel: true,
          })
        : null,
      React.createElement("text", { x: originX + plotW + 16, y: originY + 12, fill: "orange", fontSize: 20, fontWeight: "700" }, "X"),
      React.createElement("text", { x: originX - 12, y: topPad - 12, fill: "orange", fontSize: 20, fontWeight: "700" }, "Y"),
    ),
  );
};
