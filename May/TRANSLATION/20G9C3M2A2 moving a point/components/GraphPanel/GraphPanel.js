const GraphPanel = (props) => {
  const { useMemo, useRef, useCallback } = React;
  const {
    baseX = 3,
    baseY = 3,
    moveAxis = "x",
    hValue = 0,
    vValue = 0,
    hMin = -3,
    hMax = 3,
    vMin = -3,
    vMax = 3,
    hEnabled = true,
    vEnabled = false,
    hLocked = false,
    vLocked = false,
    hMode = "both",
    vMode = "both",
    isDragging = false,
    highlightX = false,
    highlightY = false,
    showGhost = false,
    showConnector = false,
    showDistanceLabel = false,
    staticCoordMode = "numeric",
    dynamicCoordMode = null,
    dynamicCoordPhase = null,
    snappedH = 0,
    snappedV = 0,
    symbolicMode = false,
    symbolicVar = "a",
    useEdgeCoordBox = false,
    hideAxisNumbers = false,
    showHNudge = false,
    showVNudge = false,
    onHChange,
    onHRelease,
    onHDragStart,
    onVChange,
    onVRelease,
    onVDragStart,
  } = props;

  const isVertical = moveAxis === "y";
  const sliderVal = isVertical ? vValue : hValue;
  const snappedVal = isVertical ? snappedV : snappedH;

  const SLIDER_MIN = -3;
  const SLIDER_MAX = 3;
  const GRID_UNITS = 6;
  const UNIT = 52;
  const LEFT_PAD = 44;
  const RIGHT_PAD = 38;
  const TOP_PAD = 36;
  const BOTTOM_PAD = 52;
  const AXIS_NEG_EXT = 18;
  const AXIS_POS_GAP = 16;
  const AXIS_POS_EXT = 8;
  const PLOT_W = GRID_UNITS * UNIT;
  const PLOT_H = GRID_UNITS * UNIT;
  const SVG_W = LEFT_PAD + PLOT_W + RIGHT_PAD;
  const SVG_H = TOP_PAD + PLOT_H + BOTTOM_PAD;
  const ORIGIN_X = LEFT_PAD;
  const ORIGIN_Y = TOP_PAD + PLOT_H;

  const YELLOW = "#FFD700";
  const GREEN = "#FFD700";
  const PURPLE = "#B56CFF";
  const OBJECT_COLOR = "#fb9b5b";
  const IMAGE_COLOR = "#46c5ce";
  const GRID_COLOR = "#1A4B6D";
  const AXIS_COLOR = "#ffffff";
  const BOX_BG = "#2C5D75";
  const WHITE = "#ffffff";
  const CHANGE_COLOR = PURPLE;

  const hTrackRef = useRef(null);
  const hNudgeClass =
    "gp-slider-nudge horizontal " +
    (hMode === "negative" ? "move-left" : "move-right");
  const vNudgeClass =
    "gp-slider-nudge vertical " +
    (vMode === "negative" ? "move-down" : "move-up");
  const variableTextStyle = {
    fontFamily: '"Times New Roman", Times, serif',
    fontStyle: "italic",
  };

  const toSvg = useCallback(
    (mx, my) => ({
      x: ORIGIN_X + mx * UNIT,
      y: ORIGIN_Y - my * UNIT,
    }),
    [ORIGIN_X, ORIGIN_Y, UNIT],
  );

  const currentX = baseX + (isVertical ? 0 : hValue);
  const currentY = baseY + (isVertical ? vValue : 0);
  const ghostPt = toSvg(baseX, baseY);
  const currentPt = toSvg(currentX, currentY);

  const pctFromValue = (val, min, max) => ((val - min) / (max - min)) * 100;

  const renderTrackSegments = (orientation, mode, enabled, value) => {
    if (!enabled) {
      return React.createElement("div", {
        className:
          "gp-slider-track-bg " + orientation + " gp-slider-track-inactive",
        style:
          orientation === "horizontal" ? { width: "100%" } : { height: "100%" },
      });
    }

    const mid = 50;
    const pct = pctFromValue(value, SLIDER_MIN, SLIDER_MAX);

    if (orientation === "horizontal") {
      if (mode === "positive") {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className:
              "gp-slider-track-bg horizontal gp-slider-track-inactive gp-track-seg-left",
            style: { left: 0, width: mid + "%" },
          }),
          React.createElement("div", {
            className:
              "gp-slider-track-bg horizontal gp-slider-track-active gp-track-seg-right",
            style: { left: mid + "%", width: 100 - mid + "%" },
          }),
        );
      }
      if (mode === "negative") {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className:
              "gp-slider-track-bg horizontal gp-slider-track-active gp-track-seg-left",
            style: { left: 0, width: mid + "%" },
          }),
          React.createElement("div", {
            className:
              "gp-slider-track-bg horizontal gp-slider-track-inactive gp-track-seg-right",
            style: { left: mid + "%", width: 100 - mid + "%" },
          }),
        );
      }
      if (mode === "both") {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement("div", {
            className:
              "gp-slider-track-bg horizontal gp-slider-track-active gp-track-seg-left",
            style: { left: 0, width: mid + "%" },
          }),
          React.createElement("div", {
            className:
              "gp-slider-track-bg horizontal gp-slider-track-active gp-track-seg-right",
            style: { left: mid + "%", width: 100 - mid + "%" },
          }),
        );
      }
      return null;
    }

    if (mode === "positive") {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className:
            "gp-slider-track-bg vertical gp-slider-track-inactive gp-track-seg-bottom",
          style: { bottom: 0, height: mid + "%" },
        }),
        React.createElement("div", {
          className:
            "gp-slider-track-bg vertical gp-slider-track-active gp-track-seg-top",
          style: { bottom: mid + "%", height: 100 - mid + "%" },
        }),
      );
    }
    if (mode === "negative") {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className:
            "gp-slider-track-bg vertical gp-slider-track-active gp-track-seg-bottom",
          style: { bottom: 0, height: mid + "%" },
        }),
        React.createElement("div", {
          className:
            "gp-slider-track-bg vertical gp-slider-track-inactive gp-track-seg-top",
          style: { bottom: mid + "%", height: 100 - mid + "%" },
        }),
      );
    }
    if (mode === "both") {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement("div", {
          className:
            "gp-slider-track-bg vertical gp-slider-track-active gp-track-seg-bottom",
          style: { bottom: 0, height: mid + "%" },
        }),
        React.createElement("div", {
          className:
            "gp-slider-track-bg vertical gp-slider-track-active gp-track-seg-top",
          style: { bottom: mid + "%", height: 100 - mid + "%" },
        }),
      );
    }
    return React.createElement("div", {
      className: "gp-slider-track-bg vertical gp-slider-track-inactive",
      style: { height: "100%" },
    });
  };

  const clampHInput = (raw) => {
    let v = parseFloat(raw);
    if (isNaN(v)) v = 0;
    if (hMode === "positive") v = Math.max(0, v);
    if (hMode === "negative") v = Math.min(0, v);
    return Math.max(hMin, Math.min(hMax, v));
  };

  const clampVInput = (raw) => {
    let v = parseFloat(raw);
    if (isNaN(v)) v = 0;
    if (vMode === "positive") v = Math.max(0, v);
    if (vMode === "negative") v = Math.min(0, v);
    return Math.max(vMin, Math.min(vMax, v));
  };

  const handleHInput = (e) => {
    if (hLocked || !hEnabled) return;
    const v = snapNearInteger(clampHInput(e.target.value), hMode);
    if (typeof onHChange === "function") onHChange(v, true);
  };

  const handleVInput = (e) => {
    if (vLocked || !vEnabled) return;
    const v = snapNearInteger(clampVInput(e.target.value), vMode);
    if (typeof onVChange === "function") onVChange(v, true);
  };

  const handleHPointerDown = () => {
    if (hLocked || !hEnabled) return;
    if (typeof startSliderDragSound === "function") startSliderDragSound();
    if (typeof onHDragStart === "function") onHDragStart();
  };

  const handleVPointerDown = () => {
    if (vLocked || !vEnabled) return;
    if (typeof startSliderDragSound === "function") startSliderDragSound();
    if (typeof onVDragStart === "function") onVDragStart();
  };

  const handleHPointerUp = (e) => {
    if (typeof stopSliderDragSound === "function") stopSliderDragSound();
    if (hLocked || !hEnabled) return;
    const v = finalizeSliderValue(clampHInput(e.target.value), hMode);
    if (typeof onHRelease === "function") onHRelease(v);
  };

  const handleVPointerUp = (e) => {
    if (typeof stopSliderDragSound === "function") stopSliderDragSound();
    if (vLocked || !vEnabled) return;
    const v = finalizeSliderValue(clampVInput(e.target.value), vMode);
    if (typeof onVRelease === "function") onVRelease(v);
  };

  const formatDistanceLabel = () => {
    if (symbolicMode) return "+" + symbolicVar;
    const n = getSliderDisplayValue(sliderVal);
    if (n === 0) return "";
    return n > 0 ? "+" + n : String(n);
  };

  const getCoordBoxWidth = (text) => {
    const extra = Math.max(0, text.length - 5);
    return 55 + extra * 8;
  };

  const getCoordDisplayText = (mode, phase) => {
    const symVar = symbolicVar;
    if (mode === "symbolic") {
      if (isVertical) {
        return phase === "dest" ? "(x, y+" + symVar + ")" : "(x, y)";
      }
      return phase === "dest" ? "(x+" + symVar + ", y)" : "(x, y)";
    }
    if (mode === "dynamic") {
      const delta =
        phase === "expression" ? getSliderDisplayValue(sliderVal) : snappedVal;
      if (isVertical) {
        if (phase === "merged") {
          return "(" + baseX + ", " + (baseY + delta) + ")";
        }
        if (phase === "minus") {
          return "(" + baseX + ", " + baseY + delta + ")";
        }
        const changeStr = delta >= 0 ? "+" + delta : "+(" + delta + ")";
        return "(" + baseX + ", " + baseY + changeStr + ")";
      }
      if (phase === "merged") {
        return "(" + (baseX + delta) + ", " + baseY + ")";
      }
      if (phase === "minus") {
        return "(" + baseX + delta + ", " + baseY + ")";
      }
      const changeStr = delta >= 0 ? "+" + delta : "+(" + delta + ")";
      return "(" + baseX + changeStr + ", " + baseY + ")";
    }
    return "(" + baseX + ", " + baseY + ")";
  };

  const renderCoordText = (mode, phase, offset) => {
    const isFadingIn = typeof phase === "string" && phase.endsWith("-fade-in");
    const isFadingOut =
      typeof phase === "string" && phase.endsWith("-fade") && !isFadingIn;
    const renderPhase = isFadingIn
      ? phase.slice(0, -8)
      : isFadingOut
        ? phase.slice(0, -5)
        : phase;
    const displayText = getCoordDisplayText(mode, renderPhase);
    const boxW = getCoordBoxWidth(displayText);
    const boxH = 30;
    const pt = offset || currentPt;
    const coordDelta =
      renderPhase === "expression" ? getSliderDisplayValue(sliderVal) : snappedVal;
    const shiftOneUnitRight =
      useEdgeCoordBox && mode === "dynamic" && !isVertical && coordDelta === 1;
    const shiftOneUnitLeft =
      useEdgeCoordBox && mode === "dynamic" && !isVertical && coordDelta === -1;
    const coordBoxShiftX = shiftOneUnitRight
      ? boxW / 2
      : shiftOneUnitLeft
        ? -boxW / 2
        : 0;
    const bx = isVertical ? pt.x + 14 : pt.x - boxW / 2;
    const by = pt.y - 38;
    const textX = isVertical ? pt.x + 14 + boxW / 2 : pt.x;
    const fs = 17;

    let textContent = null;

    if (mode === "symbolic") {
      if (isVertical) {
        textContent = React.createElement(
          "text",
          {
            x: textX,
            y: by + 20,
            textAnchor: "middle",
            fontSize: fs,
            fontFamily: "system-ui, sans-serif",
          },
          React.createElement("tspan", { fill: WHITE }, "("),
          React.createElement("tspan", { fill: WHITE, style: variableTextStyle }, "x"),
          React.createElement("tspan", { fill: WHITE }, ", "),
          React.createElement("tspan", { fill: GREEN, fontWeight: "700", style: variableTextStyle }, "y"),
          renderPhase === "dest"
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "tspan",
                  { fill: PURPLE, fontWeight: "700" },
                  "+" + symbolicVar,
                ),
                React.createElement("tspan", { fill: WHITE }, ")"),
              )
            : React.createElement("tspan", { fill: WHITE }, ")"),
        );
      } else {
        textContent = React.createElement(
          "text",
          {
            x: textX,
            y: by + 20,
            textAnchor: "middle",
            fontSize: fs,
            fontFamily: "system-ui, sans-serif",
          },
          React.createElement("tspan", { fill: WHITE }, "("),
          React.createElement("tspan", { fill: GREEN, fontWeight: "700", style: variableTextStyle }, "x"),
          renderPhase === "dest"
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "tspan",
                  { fill: PURPLE, fontWeight: "700" },
                  "+" + symbolicVar,
                ),
                React.createElement("tspan", { fill: WHITE }, ", "),
                React.createElement("tspan", { fill: WHITE, style: variableTextStyle }, "y"),
                React.createElement("tspan", { fill: WHITE }, ")"),
              )
            : React.createElement(
                React.Fragment,
                null,
                React.createElement("tspan", { fill: WHITE }, ", "),
                React.createElement("tspan", { fill: WHITE, style: variableTextStyle }, "y"),
                React.createElement("tspan", { fill: WHITE }, ")"),
              ),
        );
      }
    } else if (mode === "dynamic") {
      const delta =
        renderPhase === "expression" ? getSliderDisplayValue(sliderVal) : snappedVal;
      const isStep1BuildPhase =
        !isVertical &&
        (renderPhase === "step1-shell" ||
          renderPhase === "step1-x" ||
          renderPhase === "step1-xchange" ||
          renderPhase === "step1-expression");
      const isStep2BuildPhase =
        !isVertical &&
        (renderPhase === "step2-shell" ||
          renderPhase === "step2-x" ||
          renderPhase === "step2-xchange" ||
          renderPhase === "step2-expression");
      const isStep3BuildPhase =
        isVertical &&
        (renderPhase === "step3-shell" ||
          renderPhase === "step3-x" ||
          renderPhase === "step3-y" ||
          renderPhase === "step3-expression");
      const isStep4BuildPhase =
        isVertical &&
        (renderPhase === "step4-shell" ||
          renderPhase === "step4-x" ||
          renderPhase === "step4-y" ||
          renderPhase === "step4-expression");
      if (isVertical) {
        if (renderPhase === "merged") {
          textContent = React.createElement(
            "text",
            {
              x: textX,
              y: by + 20,
              textAnchor: "middle",
              fontSize: fs,
              fontFamily: "system-ui, sans-serif",
            },
            React.createElement("tspan", { fill: WHITE }, "(" + baseX + ", "),
            React.createElement(
              "tspan",
              { fill: GREEN, fontWeight: "700", "data-role": "graph-dynamic-y" },
              String(baseY + delta),
            ),
            React.createElement("tspan", { fill: WHITE }, ")"),
          );
        } else if (renderPhase === "minus") {
          textContent = React.createElement(
            "text",
            {
              x: textX,
              y: by + 20,
              textAnchor: "middle",
              fontSize: fs,
              fontFamily: "system-ui, sans-serif",
            },
            React.createElement("tspan", { fill: WHITE }, "(" + baseX + ", "),
            React.createElement(
              "tspan",
              { fill: GREEN, fontWeight: "700", "data-role": "graph-dynamic-y" },
              String(baseY),
            ),
            React.createElement(
              "tspan",
              { fill: PURPLE, fontWeight: "700", "data-role": "graph-dynamic-change-y" },
              String(delta),
            ),
            React.createElement("tspan", { fill: WHITE }, ")"),
          );
        } else if (isStep3BuildPhase || isStep4BuildPhase) {
          const changeStr = delta >= 0 ? "+" + delta : "+(" + delta + ")";
          const showX =
            renderPhase === "step3-x" ||
            renderPhase === "step3-y" ||
            renderPhase === "step3-expression" ||
            renderPhase === "step4-x" ||
            renderPhase === "step4-y" ||
            renderPhase === "step4-expression";
          const showChange =
            renderPhase === "step3-expression" || renderPhase === "step4-expression";
          const showY =
            renderPhase === "step3-y" ||
            renderPhase === "step3-expression" ||
            renderPhase === "step4-y" ||
            renderPhase === "step4-expression";
          const isStep4 = isStep4BuildPhase;
          const negativeStr = String(delta);

          textContent = React.createElement(
            "text",
            {
              x: textX,
              y: by + 20,
              textAnchor: "middle",
              fontSize: fs,
              fontFamily: "system-ui, sans-serif",
            },
            React.createElement("tspan", { fill: WHITE }, "("),
            React.createElement(
              "tspan",
              {
                fill: WHITE,
                fontWeight: "400",
                opacity: showX ? 1 : 0,
                "data-role": "graph-dynamic-x",
              },
              String(baseX),
            ),
            React.createElement(
              "tspan",
              { fill: WHITE, opacity: showX ? 1 : 0 },
              ", ",
            ),
            React.createElement(
              "tspan",
              {
                fill: GREEN,
                fontWeight: "700",
                opacity: showY ? 1 : 0,
                "data-role": "graph-dynamic-y",
              },
              String(baseY),
            ),
            isStep4
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement(
                    "tspan",
                    {
                      fill: PURPLE,
                      fontWeight: "700",
                      opacity: showChange ? 1 : 0,
                    },
                    "+(",
                  ),
                  React.createElement(
                    "tspan",
                    {
                      fill: PURPLE,
                      fontWeight: "700",
                      opacity: showChange ? 1 : 0,
                      "data-role": "graph-dynamic-change-y",
                    },
                    negativeStr,
                  ),
                  React.createElement(
                    "tspan",
                    {
                      fill: PURPLE,
                      fontWeight: "700",
                      opacity: showChange ? 1 : 0,
                    },
                    ")",
                  ),
                )
              : React.createElement(
                  "tspan",
                  {
                    fill: PURPLE,
                    fontWeight: "700",
                    opacity: showChange ? 1 : 0,
                    "data-role": "graph-dynamic-change-y",
                  },
                  changeStr,
                ),
            React.createElement("tspan", { fill: WHITE }, ")"),
          );
        } else {
          const changeStr = delta >= 0 ? "+" + delta : "+(" + delta + ")";
          textContent = React.createElement(
            "text",
            {
              x: textX,
              y: by + 20,
              textAnchor: "middle",
              fontSize: fs,
              fontFamily: "system-ui, sans-serif",
            },
            React.createElement("tspan", { fill: WHITE }, "(" + baseX + ", "),
            React.createElement(
              "tspan",
              { fill: GREEN, fontWeight: "700", "data-role": "graph-dynamic-y" },
              String(baseY),
            ),
            React.createElement(
              "tspan",
              { fill: PURPLE, fontWeight: "700", "data-role": "graph-dynamic-change-y" },
              changeStr,
            ),
            React.createElement("tspan", { fill: WHITE }, ")"),
          );
        }
      } else if (renderPhase === "merged") {
        textContent = React.createElement(
          "text",
          {
            x: textX,
            y: by + 20,
            textAnchor: "middle",
            fontSize: fs,
            fontFamily: "system-ui, sans-serif",
          },
          React.createElement("tspan", { fill: WHITE }, "("),
          React.createElement(
            "tspan",
            { fill: GREEN, fontWeight: "700", "data-role": "graph-dynamic-x" },
            String(baseX + delta),
          ),
          React.createElement("tspan", { fill: WHITE }, ", " + baseY + ")"),
        );
      } else if (isStep1BuildPhase || isStep2BuildPhase) {
        const changeStr = delta >= 0 ? "+" + delta : "+(" + delta + ")";
        const showX =
          renderPhase === "step1-x" ||
          renderPhase === "step1-xchange" ||
          renderPhase === "step1-expression" ||
          renderPhase === "step2-x" ||
          renderPhase === "step2-xchange" ||
          renderPhase === "step2-expression";
        const showChange =
          renderPhase === "step1-xchange" ||
          renderPhase === "step1-expression" ||
          renderPhase === "step2-xchange" ||
          renderPhase === "step2-expression";
        const showY =
          renderPhase === "step1-expression" || renderPhase === "step2-expression";
        const isStep2 = isStep2BuildPhase;
        const negativeStr = String(delta);

        textContent = React.createElement(
          "text",
          {
            x: textX,
            y: by + 20,
            textAnchor: "middle",
            fontSize: fs,
            fontFamily: "system-ui, sans-serif",
          },
          React.createElement("tspan", { fill: WHITE }, "("),
          React.createElement(
            "tspan",
            {
              fill: GREEN,
              fontWeight: "700",
              opacity: showX ? 1 : 0,
              "data-role": "graph-dynamic-x",
            },
            String(baseX),
          ),
          isStep2
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "tspan",
                  {
                    fill: PURPLE,
                    fontWeight: "700",
                    opacity: showChange ? 1 : 0,
                  },
                  "+(",
                ),
                React.createElement(
                  "tspan",
                  {
                    fill: PURPLE,
                    fontWeight: "700",
                    opacity: showChange ? 1 : 0,
                    "data-role": "graph-dynamic-change",
                  },
                  negativeStr,
                ),
                React.createElement(
                  "tspan",
                  {
                    fill: PURPLE,
                    fontWeight: "700",
                    opacity: showChange ? 1 : 0,
                  },
                  ")",
                ),
              )
            : React.createElement(
                "tspan",
                {
                  fill: PURPLE,
                  fontWeight: "700",
                  opacity: showChange ? 1 : 0,
                  "data-role": "graph-dynamic-change",
                },
                changeStr,
              ),
          React.createElement(
            "tspan",
            { fill: WHITE, opacity: showY ? 1 : 0 },
            ", ",
          ),
          React.createElement(
            "tspan",
            {
              fill: WHITE,
              fontWeight: "400",
              opacity: showY ? 1 : 0,
              "data-role": "graph-dynamic-y",
            },
            String(baseY),
          ),
          React.createElement(
            "tspan",
            { fill: WHITE },
            ")",
          ),
        );
      } else if (renderPhase === "minus") {
        textContent = React.createElement(
          "text",
          {
            x: textX,
            y: by + 20,
            textAnchor: "middle",
            fontSize: fs,
            fontFamily: "system-ui, sans-serif",
          },
          React.createElement("tspan", { fill: WHITE }, "("),
          React.createElement(
            "tspan",
            { fill: GREEN, fontWeight: "700" },
            String(baseX),
          ),
          React.createElement(
            "tspan",
            { fill: PURPLE, fontWeight: "700" },
            String(delta),
          ),
          React.createElement("tspan", { fill: WHITE }, ", " + baseY + ")"),
        );
      } else {
        const changeStr = delta >= 0 ? "+" + delta : "+(" + delta + ")";
        textContent = React.createElement(
          "text",
          {
            x: textX,
            y: by + 20,
            textAnchor: "middle",
            fontSize: fs,
            fontFamily: "system-ui, sans-serif",
          },
          React.createElement("tspan", { fill: WHITE }, "("),
          React.createElement(
            "tspan",
            { fill: GREEN, fontWeight: "700" },
            String(baseX),
          ),
          React.createElement(
            "tspan",
            { fill: PURPLE, fontWeight: "700" },
            changeStr,
          ),
          React.createElement("tspan", { fill: WHITE }, ", " + baseY + ")"),
        );
      }
    } else if (isVertical) {
      textContent = React.createElement(
        "text",
        {
          x: textX,
          y: by + 20,
          textAnchor: "middle",
          fontSize: fs,
          fontFamily: "system-ui, sans-serif",
        },
        React.createElement("tspan", { fill: WHITE }, "("),
        React.createElement(
          "tspan",
          {
            fill: WHITE,
            fontWeight: "400",
            "data-role": "graph-static-x",
          },
          String(baseX),
        ),
        React.createElement("tspan", { fill: WHITE }, ", "),
        React.createElement(
          "tspan",
          {
            fill: highlightY ? GREEN : WHITE,
            fontWeight: highlightY ? "700" : "400",
            "data-role": "graph-static-y",
          },
          String(baseY),
        ),
        React.createElement("tspan", { fill: WHITE }, ")"),
      );
    } else {
      textContent = React.createElement(
        "text",
        {
          x: textX,
          y: by + 20,
          textAnchor: "middle",
          fontSize: fs,
          fontFamily: "system-ui, sans-serif",
        },
        React.createElement("tspan", { fill: WHITE }, "("),
        React.createElement(
          "tspan",
          {
            fill: highlightX ? GREEN : WHITE,
            fontWeight: highlightX ? "700" : "400",
            "data-role": "graph-static-x",
          },
          String(baseX),
        ),
        React.createElement("tspan", { fill: WHITE }, ", "),
        React.createElement(
          "tspan",
          {
            fill: WHITE,
            fontWeight: "400",
            "data-role": "graph-static-y",
          },
          String(baseY),
        ),
        React.createElement("tspan", { fill: WHITE }, ")"),
      );
    }

    const blinkClass =
      renderPhase === "merged" && mode === "dynamic" && !isFadingOut
        ? snappedVal < 0
          ? " blink"
          : " blink-once"
        : "";

    return React.createElement(
      "g",
      {
        className:
          "gp-coord-box" +
          blinkClass +
          (isFadingOut ? " fade-out" : "") +
          (isFadingIn ? " fade-in" : ""),
        key: mode + "-" + renderPhase,
        style: {
          transform: "translateX(" + coordBoxShiftX + "px)",
        },
        "data-role":
          mode === "numeric"
            ? "graph-static-coord"
            : mode === "dynamic"
              ? "graph-dynamic-coord"
              : null,
      },
      React.createElement("rect", {
        className: "gp-coord-box-rect",
        x: bx,
        y: by,
        width: boxW,
        height: boxH,
        rx: 6,
        fill: BOX_BG,
      }),
      textContent,
    );
  };

  const gridEls = useMemo(() => {
    const els = [];
    for (let i = 0; i <= GRID_UNITS; i++) {
      const xi = ORIGIN_X + i * UNIT;
      els.push(
        React.createElement("line", {
          key: "gv-" + i,
          x1: xi,
          y1: TOP_PAD,
          x2: xi,
          y2: ORIGIN_Y,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
      const yi = ORIGIN_Y - i * UNIT;
      els.push(
        React.createElement("line", {
          key: "gh-" + i,
          x1: ORIGIN_X,
          y1: yi,
          x2: ORIGIN_X + PLOT_W,
          y2: yi,
          stroke: GRID_COLOR,
          strokeWidth: 1,
        }),
      );
    }
    return els;
  }, [ORIGIN_X, ORIGIN_Y, TOP_PAD, PLOT_W, UNIT]);

  const axisLabels = useMemo(() => {
    const numberEls = [];
    for (let i = 1; i <= GRID_UNITS; i++) {
      const px = ORIGIN_X + i * UNIT;
      numberEls.push(
        React.createElement(
          "text",
          {
            key: "tx-" + i,
            x: px,
            y: ORIGIN_Y + 26,
            fill: AXIS_COLOR,
            fontSize: 16,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
      const py = ORIGIN_Y - i * UNIT;
      numberEls.push(
        React.createElement(
          "text",
          {
            key: "ty-" + i,
            x: ORIGIN_X - 22,
            y: py + 5,
            fill: AXIS_COLOR,
            fontSize: 16,
            fontWeight: "600",
            textAnchor: "middle",
            fontFamily: "system-ui, sans-serif",
          },
          String(i),
        ),
      );
    }
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "g",
        {
          className: "gp-axis-number-group",
          style: { opacity: hideAxisNumbers ? 0 : 1 },
        },
        numberEls,
      ),
      React.createElement(
        "text",
        {
          key: "origin",
          x: ORIGIN_X - 28,
          y: ORIGIN_Y + 26,
          fill: AXIS_COLOR,
          fontSize: 14,
          fontWeight: "600",
          textAnchor: "middle",
          fontFamily: "system-ui, sans-serif",
        },
        "(0,0)",
      ),
    );
  }, [AXIS_COLOR, GRID_UNITS, ORIGIN_X, ORIGIN_Y, UNIT, hideAxisNumbers]);

  const hPct = pctFromValue(hValue, SLIDER_MIN, SLIDER_MAX);
  const vPct = pctFromValue(vValue, SLIDER_MIN, SLIDER_MAX);
  const thumbH = formatSliderThumbValue(
    hValue,
    symbolicMode && !isVertical ? symbolicVar : null,
  );
  const thumbV = formatSliderThumbValue(
    vValue,
    symbolicMode && isVertical ? symbolicVar : null,
  );

  const distLabelX = isVertical
    ? ghostPt.x - 14
    : (ghostPt.x + currentPt.x) / 2;
  const distLabelY = isVertical
    ? (ghostPt.y + currentPt.y) / 2 + 5
    : ghostPt.y + 22;

  return React.createElement(
    "div",
    { className: "graph-panel" },
    React.createElement(
      "div",
      { className: "graph-panel-inner" },
      React.createElement(
        "div",
        { className: "graph-row" },
        React.createElement(
          "div",
          { className: "graph-v-slider-wrap" },
          React.createElement(
            "div",
            { className: "gp-slider-track-wrap vertical" },
            renderTrackSegments("vertical", vMode, vEnabled, vValue),
            React.createElement(
              "span",
              { className: "gp-slider-sign top" },
              "+",
            ),
            React.createElement(
              "span",
              { className: "gp-slider-sign bottom" },
              "-",
            ),
            React.createElement(
              "div",
              {
                className:
                  "gp-slider-thumb vertical" +
                  (!vEnabled
                    ? " is-disabled"
                    : vLocked
                      ? " is-locked"
                      : ""),
                style: { bottom: (vEnabled ? vPct : 50) + "%" },
              },
              showVNudge
                ? React.createElement("img", {
                    className: vNudgeClass,
                    src: "assets/tap.png",
                    alt: "",
                  })
                : null,
              vEnabled ? thumbV : "0",
            ),
            React.createElement("input", {
              type: "range",
              className: "gp-range-input vertical",
              min: SLIDER_MIN,
              max: SLIDER_MAX,
              step: 0.01,
              value: vValue,
              disabled: !vEnabled || vLocked,
              onMouseDown: handleVPointerDown,
              onTouchStart: handleVPointerDown,
              onInput: handleVInput,
              onChange: handleVInput,
              onMouseUp: handleVPointerUp,
              onTouchEnd: handleVPointerUp,
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "graph-svg-wrap" },
          React.createElement(
            "svg",
            {
              viewBox: "0 0 " + SVG_W + " " + SVG_H,
              className: "graph-coordinate-svg",
              preserveAspectRatio: "xMidYMid meet",
            },
            React.createElement(
              "defs",
              null,
              React.createElement(
                "marker",
                {
                  id: "gp-arrow-end",
                  markerWidth: 8,
                  markerHeight: 8,
                  refX: 6,
                  refY: 3,
                  orient: "auto",
                  markerUnits: "strokeWidth",
                },
                React.createElement("path", {
                  d: "M0,0 L6,3 L0,6 z",
                  fill: AXIS_COLOR,
                }),
              ),
              React.createElement(
                "marker",
                {
                  id: "gp-arrow-start",
                  markerWidth: 8,
                  markerHeight: 8,
                  refX: 0,
                  refY: 3,
                  orient: "auto-start-reverse",
                  markerUnits: "strokeWidth",
                },
                React.createElement("path", {
                  d: "M0,0 L6,3 L0,6 z",
                  fill: AXIS_COLOR,
                }),
              ),
            ),
            gridEls,
            React.createElement("line", {
              x1: ORIGIN_X - AXIS_NEG_EXT,
              y1: ORIGIN_Y,
              x2: ORIGIN_X + PLOT_W + AXIS_POS_GAP + AXIS_POS_EXT,
              y2: ORIGIN_Y,
              stroke: AXIS_COLOR,
              strokeWidth: 2,
              markerStart: "url(#gp-arrow-start)",
              markerEnd: "url(#gp-arrow-end)",
            }),
            React.createElement("line", {
              x1: ORIGIN_X,
              y1: ORIGIN_Y + AXIS_NEG_EXT,
              x2: ORIGIN_X,
              y2: TOP_PAD - AXIS_POS_GAP - AXIS_POS_EXT,
              stroke: AXIS_COLOR,
              strokeWidth: 2,
              markerStart: "url(#gp-arrow-start)",
              markerEnd: "url(#gp-arrow-end)",
            }),
            axisLabels,
            showConnector &&
              (ghostPt.x !== currentPt.x || ghostPt.y !== currentPt.y)
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement("line", {
                    x1: ghostPt.x,
                    y1: ghostPt.y,
                    x2: currentPt.x,
                    y2: currentPt.y,
                    stroke: CHANGE_COLOR,
                    strokeWidth: 2.5,
                  }),
                  showDistanceLabel && formatDistanceLabel()
                    ? React.createElement(
                        "text",
                        {
                          x: distLabelX,
                          y: distLabelY + (isVertical ? 5 : 0),
                          fill: CHANGE_COLOR,
                          fontSize: 18,
                          fontWeight: "700",
                          textAnchor: isVertical ? "end" : "middle",
                          fontFamily: "system-ui, sans-serif",
                          "data-role": "graph-distance-label",
                        },
                        formatDistanceLabel(),
                      )
                    : null,
                )
              : null,
            renderCoordText(staticCoordMode, "static", ghostPt),
            dynamicCoordMode
              ? renderCoordText(dynamicCoordMode, dynamicCoordPhase, currentPt)
              : null,
            showGhost
              ? React.createElement("circle", {
                  cx: ghostPt.x,
                  cy: ghostPt.y,
                  r: 7,
                  fill: OBJECT_COLOR,
                })
              : null,
            React.createElement("circle", {
              cx: currentPt.x,
              cy: currentPt.y,
              r: 7,
              fill: showGhost ? IMAGE_COLOR : OBJECT_COLOR,
            }),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "graph-h-slider-wrap" },
        React.createElement(
          "div",
          { className: "gp-slider-track-wrap horizontal", ref: hTrackRef },
          renderTrackSegments("horizontal", hMode, hEnabled, hValue),
          React.createElement(
            "span",
            { className: "gp-slider-sign left" },
            "-",
          ),
          React.createElement(
            "span",
            { className: "gp-slider-sign right" },
            "+",
          ),
          React.createElement(
            "div",
            {
              className:
                "gp-slider-thumb horizontal" +
                (!hEnabled
                  ? " is-disabled"
                  : hLocked
                    ? " is-locked"
                    : ""),
              style: { left: (hEnabled ? hPct : 50) + "%" },
            },
            showHNudge
              ? React.createElement("img", {
                  className: hNudgeClass,
                  src: "assets/tap.png",
                  alt: "",
                })
              : null,
            hEnabled ? thumbH : "0",
          ),
          React.createElement("input", {
            type: "range",
            className: "gp-range-input",
            min: SLIDER_MIN,
            max: SLIDER_MAX,
            step: 0.01,
            value: hValue,
            disabled: !hEnabled || hLocked,
            onMouseDown: handleHPointerDown,
            onTouchStart: handleHPointerDown,
            onInput: handleHInput,
            onChange: handleHInput,
            onMouseUp: handleHPointerUp,
            onTouchEnd: handleHPointerUp,
          }),
        ),
      ),
    ),
  );
};
