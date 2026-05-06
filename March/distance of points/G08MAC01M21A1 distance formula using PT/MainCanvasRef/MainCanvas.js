const MainCanvas = (props) => {
  const { question, qState, onPatchState } = props;
  var input = qState.input;
  var feedback = qState.feedback;
  var hintShown = qState.hintShown;

  var point1Color = "#FFD700";
  var point2Color = "#5DADE2";
  var gridMajor = "rgba(255,255,255,0.22)";
  var axisColor = "#ffffff";

  var unit = 46;
  var leftPad = 52;
  var rightPad = 28;
  var topPad = 36;
  var bottomPad = 48;
  var plotUnits = 10;
  var plotW = plotUnits * unit;
  var plotH = plotUnits * unit;
  var svgW = leftPad + plotW + rightPad;
  var svgH = topPad + plotH + bottomPad;

  var originX = leftPad;
  var originY = topPad + plotH;

  function toSvg(mx, my) {
    return { x: originX + mx * unit, y: originY - my * unit };
  }

  var x1 = question.point1[0];
  var y1 = question.point1[1];
  var x2 = question.point2[0];
  var y2 = question.point2[1];
  var label1 = question.name.charAt(0);
  var label2 = question.name.charAt(1);
  var coordinateOffset = question.coordinateOffset || [0, 0];
  var nameOffset = question.nameOffset || [0, 0];

  var p1s = toSvg(x1, y1);
  var p2s = toSvg(x2, y2);

  var vx = p2s.x - p1s.x;
  var vy = p2s.y - p1s.y;
  var segLen = Math.hypot(vx, vy) || 1;
  var nx = -vy / segLen;
  var ny = vx / segLen;
  var midx = (p1s.x + p2s.x) / 2;
  var midy = (p1s.y + p2s.y) / 2;
  var formulaOff = 48;
  var fx = midx + nx * formulaOff;
  var fy = midy + ny * formulaOff;
  var formulaCenterX = 54;
  var angleDeg = (Math.atan2(vy, vx) * 180) / Math.PI;
  var formulaAngleDeg = angleDeg + (question.flip ? 180 : 0);

  var bulbOff = 52;
  var bx = midx - nx * bulbOff;
  var by = midy - ny * bulbOff;

  var numpadDisabled = feedback === "correct";
  var showBulb = feedback === "wrong" && !hintShown;
  var showHint = hintShown;

  function handleDigit(d) {
    if (numpadDisabled) return;
    var digitCount = (input.match(/\d/g) || []).length;
    if (feedback !== "wrong" && digitCount >= 2) return;
    if (feedback === "wrong") {
      onPatchState({ input: String(d), feedback: null });
      return;
    }
    onPatchState({ input: input + String(d), feedback: null });
  }

  function handleClear() {
    if (numpadDisabled) return;
    if (feedback === "wrong") {
      onPatchState({ input: "", feedback: null });
      return;
    }
    onPatchState({ input: input.slice(0, -1), feedback: null });
  }

  function handleSqrt() {
    if (numpadDisabled) return;
    if (feedback === "wrong") {
      onPatchState({ input: "\u221a", feedback: null });
      return;
    }
    onPatchState({ input: input + "\u221a", feedback: null });
  }

  function handleSubmit() {
    if (numpadDisabled) return;
    var normUser = normalizeRadicalAnswer(input);
    var normExp = normalizeRadicalAnswer(question.ans);
    if (normUser !== "" && normUser === normExp) {
      if (typeof playSound === "function") playSound("correct");
      onPatchState({ feedback: "correct", hintShown: true });
    } else {
      if (typeof playSound === "function") playSound("wrong");
      onPatchState({ feedback: "wrong" });
    }
  }

  function handleBulbClick() {
    if (typeof playSound === "function") playSound("click");
    onPatchState({ hintShown: true, feedback: null, input: "" });
  }

  var gridEls = [];
  var gi;
  for (gi = 0; gi <= plotUnits; gi++) {
    var xi = originX + gi * unit;
    gridEls.push(
      React.createElement("line", {
        key: "gv-" + gi,
        x1: xi,
        y1: topPad,
        x2: xi,
        y2: originY,
        stroke: gridMajor,
        strokeWidth: 1,
      }),
    );
    var yi = originY - gi * unit;
    gridEls.push(
      React.createElement("line", {
        key: "gh-" + gi,
        x1: originX,
        y1: yi,
        x2: originX + plotW,
        y2: yi,
        stroke: gridMajor,
        strokeWidth: 1,
      }),
    );
  }

  var axisTicks = [];
  for (gi = 0; gi <= plotUnits; gi++) {
    var px = originX + gi * unit;
    axisTicks.push(
      React.createElement(
        "text",
        {
          key: "tx-" + gi,
          x: px,
          y: originY + 22,
          fill: "#fff",
          fontSize: 23,
          fontWeight: "bold",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        String(gi),
      ),
    );
    var py = originY - gi * unit;
    if (gi !== 0) {
      axisTicks.push(
        React.createElement(
          "text",
          {
            key: "ty-" + gi,
            x: originX - 18,
            y: py + 5,
            fill: "#fff",
            fontSize: 23,
            fontWeight: "bold",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(gi),
        ),
      );
    }
  }

  var white = "#ffffff";
  var hintTextProps = {
    fontSize: 28,
    fontFamily: "Georgia, 'Times New Roman', serif",
    textAnchor: "start",
    dominantBaseline: "middle",
  };

  function formulaTerm(char, subscript, color) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("tspan", { fill: color }, char),
      React.createElement(
        "tspan",
        { fill: color, fontSize: "70%", baselineShift: "sub" },
        subscript,
      ),
    );
  }

  function hintFormulaGroup() {
    if (!showHint) return null;
    var c2 = point2Color;
    var c1 = point1Color;
    return React.createElement(
      "g",
      {
        transform:
          "translate(" +
          fx +
          "," +
          fy +
          ") rotate(" +
          formulaAngleDeg +
          ") translate(" +
          -formulaCenterX +
          ",-6)",
        pointerEvents: "none",
      },
      React.createElement("path", {
        d: "M-56,10 L-46,20 L-34,-12 L164,-12",
        fill: "none",
        stroke: white,
        strokeWidth: 2.5,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }),
      React.createElement(
        "text",
        Object.assign({}, hintTextProps, { x: -30, y: 4 }),
        React.createElement("tspan", { fill: white }, "("),
        formulaTerm("x", "2", c2),
        React.createElement("tspan", { fill: white }, "\u2212"),
        formulaTerm("x", "1", c1),
        React.createElement("tspan", { fill: white }, ")\u00b2+("),
        formulaTerm("y", "2", c2),
        React.createElement("tspan", { fill: white }, "\u2212"),
        formulaTerm("y", "1", c1),
        React.createElement("tspan", { fill: white }, ")\u00b2"),
      ),
    );
  }

  function coordLabel(cx, cy, x, y, subPlacement) {
    var coordStr = "(" + x + ", " + y + ")";
    var subs = showHint
      ? subPlacement === "below"
        ? React.createElement(
            "g",
            {
              pointerEvents: "none",
              transform: "translate(" + cx + "," + (cy + 26) + ")",
            },
            React.createElement(
              "text",
              {
                x: -14,
                y: 0,
                fill: point1Color,
                fontSize: 17,
                fontFamily: "Georgia, serif",
                textAnchor: "middle",
              },
              React.createElement("tspan", null, "x"),
              React.createElement(
                "tspan",
                { fontSize: "70%", baselineShift: "sub" },
                "1",
              ),
            ),
            React.createElement(
              "text",
              {
                x: 14,
                y: 0,
                fill: point1Color,
                fontSize: 17,
                fontFamily: "Georgia, serif",
                textAnchor: "middle",
              },
              React.createElement("tspan", null, "y"),
              React.createElement(
                "tspan",
                { fontSize: "70%", baselineShift: "sub" },
                "1",
              ),
            ),
          )
        : React.createElement(
            "g",
            {
              pointerEvents: "none",
              transform: "translate(" + cx + "," + (cy - 34) + ")",
            },
            React.createElement(
              "text",
              {
                x: -14,
                y: 0,
                fill: point2Color,
                fontSize: 17,
                fontFamily: "Georgia, serif",
                textAnchor: "middle",
              },
              React.createElement("tspan", null, "x"),
              React.createElement(
                "tspan",
                { fontSize: "70%", baselineShift: "sub" },
                "2",
              ),
            ),
            React.createElement(
              "text",
              {
                x: 14,
                y: 0,
                fill: point2Color,
                fontSize: 17,
                fontFamily: "Georgia, serif",
                textAnchor: "middle",
              },
              React.createElement("tspan", null, "y"),
              React.createElement(
                "tspan",
                { fontSize: "70%", baselineShift: "sub" },
                "2",
              ),
            ),
          )
      : null;

    return React.createElement(
      "g",
      null,
      React.createElement(
        "text",
        {
          x: cx,
          y: cy,
          fill: "#ffffff",
          fontSize: 24,
          fontWeight: "600",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
          pointerEvents: "none",
        },
        coordStr,
      ),
      subs,
    );
  }

  var marginAxes = 8;
  var svgContent = React.createElement(
    "g",
    null,
    React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "arrow-dist",
          markerWidth: 8,
          markerHeight: 8,
          refX: 6,
          refY: 4,
          orient: "auto",
          markerUnits: "strokeWidth",
        },
        React.createElement("path", {
          d: "M0,0 L8,4 L0,8 z",
          fill: axisColor,
        }),
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
      markerEnd: "url(#arrow-dist)",
    }),
    React.createElement("line", {
      x1: originX,
      y1: originY + marginAxes,
      x2: originX,
      y2: topPad - marginAxes,
      stroke: axisColor,
      strokeWidth: 2,
      markerEnd: "url(#arrow-dist)",
    }),
    axisTicks,
    React.createElement("line", {
      x1: p1s.x,
      y1: p1s.y,
      x2: p2s.x,
      y2: p2s.y,
      stroke: "#ffffff",
      strokeWidth: 2.5,
      pointerEvents: "none",
    }),
    hintFormulaGroup(),
    showBulb
      ? React.createElement("image", {
          href: "assets/bulb.png",
          x: bx - 26,
          y: by - 26,
          width: 52,
          height: 52,
          className: "distance-hint-bulb",
          onClick: handleBulbClick,
          style: { cursor: "pointer" },
        })
      : null,
    React.createElement("circle", {
      cx: p1s.x,
      cy: p1s.y,
      r: 9,
      fill: point1Color,
      stroke: "#222",
      strokeWidth: 1,
    }),
    React.createElement("circle", {
      cx: p2s.x,
      cy: p2s.y,
      r: 9,
      fill: point2Color,
      stroke: "#222",
      strokeWidth: 1,
    }),
    React.createElement(
      "text",
      {
        x:
          p1s.x <= p2s.x
            ? p1s.x - 22 + nameOffset[0]
            : p1s.x + 22 + nameOffset[0],
        y: p1s.y + 6 + nameOffset[1],
        fill: point1Color,
        fontSize: 33,
        fontWeight: "bold",
        fontFamily: "system-ui, sans-serif",
        textAnchor: p1s.x <= p2s.x ? "end" : "start",
        pointerEvents: "none",
      },
      label1,
    ),
    React.createElement(
      "text",
      {
        x:
          p2s.x >= p1s.x
            ? p2s.x + 22 + nameOffset[0]
            : p2s.x - 22 + nameOffset[0],
        y: p2s.y + 6 + nameOffset[1],
        fill: point2Color,
        fontSize: 33,
        fontWeight: "bold",
        fontFamily: "system-ui, sans-serif",
        textAnchor: p2s.x >= p1s.x ? "start" : "end",
        pointerEvents: "none",
      },
      label2,
    ),
    coordLabel(
      p1s.x + coordinateOffset[0],
      p1s.y + 36 + coordinateOffset[1],
      x1,
      y1,
      "below",
    ),
    coordLabel(
      p2s.x + coordinateOffset[0],
      p2s.y - 26 + coordinateOffset[1],
      x2,
      y2,
      "above",
    ),
  );

  var boxClass = "distance-answer-box";
  if (feedback === "wrong") boxClass += " wrong";
  if (feedback === "correct") boxClass += " correct";

  var submitLbl = (APP_DATA.labels && APP_DATA.labels.numpadSubmit) || "Submit";

  return React.createElement(
    "div",
    { className: "main-canvas-container distance-applet-canvas" },
    React.createElement(
      "div",
      { className: "distance-visual-column" },
      React.createElement(
        "svg",
        {
          viewBox: "0 0 " + svgW + " " + svgH,
          className: "grid-svg distance-coordinate-svg",
          preserveAspectRatio: "xMidYMid meet",
        },
        svgContent,
      ),
    ),
    React.createElement(
      "div",
      { className: "distance-action-column" },
      React.createElement(
        "div",
        { className: "distance-input-row" },
        React.createElement(
          "span",
          { className: "distance-segment-wrap" },
          React.createElement(
            "span",
            { className: "distance-segment-overline" },
            question.name,
          ),
        ),
        React.createElement("span", { className: "distance-equals" }, "="),
        React.createElement(
          "span",
          { className: boxClass },
          input === "" ? "\u00a0" : input,
        ),
      ),
      React.createElement(
        "div",
        { className: "distance-numpad-wrap" },
        React.createElement(Numpad, {
          disabled: numpadDisabled,
          submitLabel: submitLbl,
          onNumberClick: handleDigit,
          onClear: handleClear,
          onSqrt: handleSqrt,
          onSubmit: handleSubmit,
        }),
      ),
    ),
  );
};
