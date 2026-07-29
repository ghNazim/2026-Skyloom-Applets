const SEQ_GRAPH = {
  xMin: -2,
  xMax: 10,
  yMin: -6,
  yMax: 6,
  padX: 24,
  padY: 20,
  gridWidth: 540,
  gridHeight: 540,
};

const SequenceTransformCanvas = ({
  stageKey,
  preservedPoints = {},
  onStageComplete,
}) => {
  const {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
  } = React;

  const stage = APP_DATA.stages[stageKey];
  const fields = useMemo(() => {
    const list = [];
    stage.answerKeys.forEach((key) => {
      list.push({ pointKey: key, axis: "x", id: key + "-x" });
      list.push({ pointKey: key, axis: "y", id: key + "-y" });
    });
    return list;
  }, [stage]);

  const [activeIndex, setActiveIndex] = useState(null);
  const [focusPointKey, setFocusPointKey] = useState(stage.answerKeys[0]);
  const [values, setValues] = useState({});
  const [statuses, setStatuses] = useState({});
  const [showRuleHint, setShowRuleHint] = useState(false);
  const [blinkBulb, setBlinkBulb] = useState(false);
  const [plotted, setPlotted] = useState({});
  const [coordLabels, setCoordLabels] = useState({});
  const [demoPoint, setDemoPoint] = useState(null);
  const [translationLines, setTranslationLines] = useState([]);
  const [completePolygon, setCompletePolygon] = useState(false);
  const [calloutPos, setCalloutPos] = useState(null);
  const [flyClone, setFlyClone] = useState(null);
  const [connectors, setConnectors] = useState([]);

  const rootRef = useRef(null);
  const graphRef = useRef(null);
  const inputRefs = useRef({});
  const coordRefs = useRef({});
  const hintRef = useRef(null);
  const hintTokenRefs = useRef({});
  const timeoutRefs = useRef([]);

  const unitX = SEQ_GRAPH.gridWidth / (SEQ_GRAPH.xMax - SEQ_GRAPH.xMin);
  const unitY = SEQ_GRAPH.gridHeight / (SEQ_GRAPH.yMax - SEQ_GRAPH.yMin);
  const svgWidth = SEQ_GRAPH.gridWidth + SEQ_GRAPH.padX * 2;
  const svgHeight = SEQ_GRAPH.gridHeight + SEQ_GRAPH.padY * 2;
  const origin = {
    x: SEQ_GRAPH.padX + (0 - SEQ_GRAPH.xMin) * unitX,
    y: SEQ_GRAPH.padY + (SEQ_GRAPH.yMax - 0) * unitY,
  };

  const toSvg = useCallback(
    (pt) => ({
      x: SEQ_GRAPH.padX + (pt.x - SEQ_GRAPH.xMin) * unitX,
      y: SEQ_GRAPH.padY + (SEQ_GRAPH.yMax - pt.y) * unitY,
    }),
    [unitX, unitY],
  );

  const pointScreenPosition = useCallback(
    (pt) => {
      const graphRect = graphRef.current && graphRef.current.getBoundingClientRect();
      if (!graphRect || !rootRef.current) return null;
      const rootRect = rootRef.current.getBoundingClientRect();
      const pos = toSvg(pt);
      return {
        x:
          graphRect.left -
          rootRect.left +
          (pos.x / svgWidth) * graphRect.width,
        y:
          graphRect.top -
          rootRect.top +
          (pos.y / svgHeight) * graphRect.height,
      };
    },
    [svgHeight, svgWidth, toSvg],
  );

  const clearTimers = useCallback(() => {
    timeoutRefs.current.forEach((id) => clearTimeout(id));
    timeoutRefs.current = [];
  }, []);

  const setLater = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutRefs.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    clearTimers();
    setActiveIndex(null);
    setFocusPointKey(stage.answerKeys[0]);
    setValues({});
    setStatuses({});
    setShowRuleHint(false);
    setBlinkBulb(false);
    setPlotted({});
    setCoordLabels({});
    setDemoPoint(null);
    setTranslationLines([]);
    setCompletePolygon(false);
    setCalloutPos(null);
    setFlyClone(null);
    setConnectors([]);
    setLater(() => setActiveIndex(0), 1000);
    return clearTimers;
  }, [stageKey, clearTimers, setLater]);

  const activeField = activeIndex == null ? null : fields[activeIndex];

  const allGraphPoints = useMemo(() => {
    const base = {};
    Object.keys(APP_DATA.originalPoints).forEach((key) => {
      base[key] = {
        key: key,
        label: key,
        point: APP_DATA.originalPoints[key],
        color: "#ffffff",
        labelColor: "#ffffff",
        labelPlacement: key === "A" ? "left" : "right",
        dotted: true,
      };
    });
    Object.keys(preservedPoints).forEach((key) => {
      base[key] = preservedPoints[key];
    });
    Object.keys(plotted).forEach((key) => {
      base[key] = plotted[key];
    });
    return base;
  }, [plotted, preservedPoints]);

  const positionCallout = useCallback(() => {
    if (!activeField || !rootRef.current) {
      setCalloutPos(null);
      return;
    }
    const target = inputRefs.current[activeField.id];
    if (!target) return;
    const rootRect = rootRef.current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const width = rootRect.width * 0.27;
    const gap = rootRect.width * 0.016;
    const top =
      targetRect.top -
      rootRect.top +
      targetRect.height * 0.5;
    const showOnRight = activeIndex < 3;
    let left = showOnRight
      ? targetRect.right - rootRect.left + gap
      : targetRect.left - rootRect.left - width - gap;

    left = Math.max(12, Math.min(rootRect.width - width - 12, left));

    setCalloutPos({
      left,
      top,
      width,
      side: showOnRight ? "right" : "left",
    });
  }, [activeField]);

  useLayoutEffect(() => {
    positionCallout();
    window.addEventListener("resize", positionCallout);
    return () => window.removeEventListener("resize", positionCallout);
  }, [positionCallout]);

  const calculateConnectors = useCallback(() => {
    if (!showRuleHint || !activeField || !hintRef.current) {
      setConnectors([]);
      return;
    }
    const hintRect = hintRef.current.getBoundingClientRect();
    const pair =
      stage.connectorMode === "rotate90Clockwise"
        ? activeField.axis === "x"
          ? ["lhs-y", "rhs-x"]
          : ["lhs-x", "rhs-y"]
        : activeField.axis === "x"
          ? ["lhs-x", "rhs-x"]
          : ["lhs-y", "rhs-y"];
    const points = pair.map((id) => {
      const el = hintTokenRefs.current[id];
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - hintRect.left + rect.width / 2,
        y: rect.top - hintRect.top,
      };
    });
    if (points[0] && points[1]) {
      const lift = Math.min(points[0].y, points[1].y) - hintRect.height * 0.18;
      const connectorColor =
        pair[0].indexOf("x") !== -1 ? "#ff7a33" : "#c96ee7";
      setConnectors([
        {
          d:
            "M " +
            points[0].x +
            " " +
            points[0].y +
            " L " +
            points[0].x +
            " " +
            lift +
            " L " +
            points[1].x +
            " " +
            lift +
            " L " +
            points[1].x +
            " " +
            points[1].y,
          color: connectorColor,
        },
      ]);
    }
  }, [activeField, showRuleHint, stage.connectorMode]);

  useLayoutEffect(() => {
    calculateConnectors();
    window.addEventListener("resize", calculateConnectors);
    return () => window.removeEventListener("resize", calculateConnectors);
  }, [calculateConnectors]);

  const blinkHintBulb = () => {
    setBlinkBulb(false);
    requestAnimationFrame(() => setBlinkBulb(true));
    setLater(() => setBlinkBulb(false), 900);
  };

  const pointIsComplete = (pointKey, nextStatuses) =>
    nextStatuses[pointKey + "-x"] === "correct" &&
    nextStatuses[pointKey + "-y"] === "correct";

  const startPointAnimation = (pointKey) => {
    const coordEl = coordRefs.current[pointKey];
    const target = pointScreenPosition(stage.answers[pointKey]);
    if (coordEl && target && rootRef.current) {
      const rootRect = rootRef.current.getBoundingClientRect();
      const source = coordEl.getBoundingClientRect();
      const start = {
        x: source.left - rootRect.left + source.width / 2,
        y: source.top - rootRect.top + source.height / 2,
      };
      setFlyClone({
        text: formatCoord(pointKey, stage.answers[pointKey]),
        start,
        end: target,
        color: stage.answerColor,
        moving: false,
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() =>
          setFlyClone((clone) => (clone ? { ...clone, moving: true } : null)),
        );
      });
    }

    setLater(() => {
      setFlyClone(null);
      setPlotted((prev) => ({
        ...prev,
        [pointKey]: {
          key: pointKey,
          label: formatCoord(pointKey, stage.answers[pointKey]),
          shortLabel: pointKey,
          point: stage.answers[pointKey],
          color: stage.answerColor,
          labelColor: stage.answerColor,
          labelPlacement: pointKey.indexOf("C") === 0 ? "right" : "left",
        },
      }));
      setCoordLabels((prev) => ({ ...prev, [pointKey]: true }));
    }, 780);

    if (stageKey === "rotation") {
      setLater(() => setDemoPoint(pointKey), 1650);
      setLater(() => {
        setDemoPoint(null);
        setCoordLabels((prev) => ({ ...prev, [pointKey]: false }));
        setPlotted((prev) => ({
          ...prev,
          [pointKey]: { ...prev[pointKey], label: pointKey },
        }));
        advanceAfterPoint(pointKey);
      }, 3050);
    } else {
      setLater(() => {
        setTranslationLines((prev) => prev.concat([pointKey]));
      }, 1180);
      setLater(() => {
        setCoordLabels((prev) => ({ ...prev, [pointKey]: false }));
        setPlotted((prev) => ({
          ...prev,
          [pointKey]: { ...prev[pointKey], label: pointKey },
        }));
        advanceAfterPoint(pointKey);
      }, 1900);
    }
  };

  const advanceAfterPoint = (pointKey) => {
    const pointIndex = stage.answerKeys.indexOf(pointKey);
    if (pointIndex === stage.answerKeys.length - 1) {
      setCompletePolygon(true);
      setLater(() => {
        if (typeof playSound === "function") playSound("congrats");
        onStageComplete && onStageComplete(stageKey, getCompletedPoints());
      }, 900);
      return;
    }
    setShowRuleHint(false);
    setFocusPointKey(stage.answerKeys[pointIndex + 1]);
    setActiveIndex((pointIndex + 1) * 2);
  };

  const getCompletedPoints = () => {
    const completed = {};
    stage.answerKeys.forEach((key) => {
      completed[key] = {
        key: key,
        label: key,
        shortLabel: key,
        point: stage.answers[key],
        color: stage.answerColor,
        labelColor: stage.answerColor,
        labelPlacement: key.indexOf("C") === 0 ? "right" : "left",
      };
    });
    return completed;
  };

  const submitValue = () => {
    if (!activeField) return;
    const raw = values[activeField.id] || "";
    if (raw === "" || raw === "+" || raw === "-") {
      blinkHintBulb();
      return;
    }
    const expected = stage.answers[activeField.pointKey][activeField.axis];
    if (parseInt(raw, 10) !== expected) {
      if (typeof playSound === "function") playSound("wrong");
      setStatuses((prev) => ({ ...prev, [activeField.id]: "wrong" }));
      blinkHintBulb();
      setLater(() => {
        setValues((prev) => ({ ...prev, [activeField.id]: "" }));
        setStatuses((prev) => ({ ...prev, [activeField.id]: "idle" }));
      }, 520);
      return;
    }

    if (typeof playSound === "function") playSound("correct");
    const nextStatuses = { ...statuses, [activeField.id]: "correct" };
    setStatuses(nextStatuses);
    setShowRuleHint(false);
    if (pointIsComplete(activeField.pointKey, nextStatuses)) {
      setActiveIndex(null);
      setLater(() => startPointAnimation(activeField.pointKey), 250);
      return;
    }
    setLater(() => setActiveIndex((index) => index + 1), 350);
  };

  const typeValue = (token) => {
    if (!activeField) return;
    setValues((prev) => {
      const current = prev[activeField.id] || "";
      let next = current;
      if (token === "+") next = current.replace("-", "");
      else if (token === "-") next = current.charAt(0) === "-" ? current : "-" + current.replace("+", "");
      else if (/^\d$/.test(token)) next = current === "0" ? token : current + token;
      if (next.length > 3) next = next.slice(0, 3);
      return { ...prev, [activeField.id]: next };
    });
  };

  const backspaceValue = () => {
    if (!activeField) return;
    setValues((prev) => ({
      ...prev,
      [activeField.id]: (prev[activeField.id] || "").slice(0, -1),
    }));
  };

  const highlightFor = (pointKey) => {
    return focusPointKey && focusPointKey.charAt(0) === pointKey.charAt(0)
      ? " is-active-point"
      : " is-muted";
  };

  const renderCoordBox = (pointKey, pt, mode) =>
    React.createElement(
      "div",
      {
        key: pointKey,
        className:
          "seq-coordinate-card" +
          (mode === "given" ? " is-given" : " is-answer") +
          highlightFor(pointKey),
      },
      React.createElement(
        "span",
        { className: "seq-point-name" },
        pointKey,
        "(",
      ),
      mode === "given"
        ? [
            React.createElement("span", { key: "x", className: "seq-given-value" }, pt.x),
            React.createElement("span", { key: "comma" }, ","),
            React.createElement("span", { key: "y", className: "seq-given-value" }, pt.y),
          ]
        : [
            renderInput(pointKey, "x"),
            React.createElement("span", { key: "comma" }, ","),
            renderInput(pointKey, "y"),
          ],
      React.createElement("span", null, ")"),
    );

  const renderInput = (pointKey, axis) => {
    const id = pointKey + "-" + axis;
    const status = statuses[id] || "idle";
    const isActive = activeField && activeField.id === id;
    return React.createElement(
      "span",
      {
        key: id,
        ref: (el) => {
          inputRefs.current[id] = el;
        },
        className:
          "seq-answer-input" +
          (isActive ? " is-active" : "") +
          (status === "correct" ? " is-correct" : "") +
          (status === "wrong" ? " is-wrong" : ""),
      },
      values[id] || "",
    );
  };

  const renderHint = () =>
    React.createElement(
      "div",
      { className: "seq-hint-card", ref: hintRef },
      showRuleHint ? renderRuleHint() : React.createElement("span", null, APP_DATA.hints[stage.defaultHintKey]),
      connectors.length
        ? React.createElement(
            "svg",
            { className: "seq-hint-connectors" },
            connectors.map((connector, index) =>
              React.createElement("path", {
                key: index,
                d: connector.d,
                fill: "none",
                stroke: connector.color,
                strokeWidth: "3",
                strokeLinejoin: "round",
                strokeLinecap: "round",
              }),
            ),
          )
        : null,
      React.createElement("button", {
        type: "button",
        className: "seq-bulb-button" + (blinkBulb ? " is-blinking" : ""),
        onClick: () => setShowRuleHint((show) => !show),
        "aria-label": APP_DATA.common.hint,
      }, React.createElement("img", { src: "assets/bulb.png", alt: "" })),
    );

  const tokenClass = (id) => {
    if (!showRuleHint || !activeField) return "";
    const active =
      stage.connectorMode === "rotate90Clockwise"
        ? activeField.axis === "x"
          ? id === "lhs-y" || id === "rhs-x"
          : id === "lhs-x" || id === "rhs-y"
        : activeField.axis === "x"
          ? id === "lhs-x" || id === "rhs-x"
          : id === "lhs-y" || id === "rhs-y";
    return active ? " is-rule-active" : " is-rule-muted";
  };

  const hintToken = (id, text, className) =>
    React.createElement(
      "span",
      {
        ref: (el) => {
          hintTokenRefs.current[id] = el;
        },
        className: "seq-rule-token " + className + tokenClass(id),
      },
      text,
    );

  const renderRuleHint = () => {
    if (stageKey === "rotation") {
      return React.createElement(
        "span",
        { className: "seq-rule" },
        APP_DATA.hints[stage.ruleHintKey],
        " (",
        hintToken("lhs-x", "x", "is-x"),
        " , ",
        hintToken("lhs-y", "y", "is-y"),
        ") \u2192 (",
        hintToken("rhs-x", "y", "is-y"),
        " , ",
        hintToken("rhs-y", "-x", "is-x"),
        ")",
      );
    }
    return React.createElement(
      "span",
      { className: "seq-rule" },
      APP_DATA.hints[stage.ruleHintKey],
      " (",
      hintToken("lhs-x", "x", "is-x"),
      " , ",
      hintToken("lhs-y", "y", "is-y"),
      ") \u2192 (",
      hintToken("rhs-x", "x+2", "is-x"),
      " , ",
      hintToken("rhs-y", "y+3", "is-y"),
      ")",
    );
  };

  const renderGraph = () => {
    const points = Object.values(allGraphPoints);
    const originalOrder = ["A", "B", "C"];
    return React.createElement(
      "div",
      { className: "seq-graph-panel" },
      React.createElement(
        "svg",
        {
          ref: graphRef,
          className: "seq-graph-svg",
          viewBox: "0 0 " + svgWidth + " " + svgHeight,
          preserveAspectRatio: "xMidYMid meet",
        },
        React.createElement(
          "defs",
          null,
          React.createElement(
            "marker",
            {
              id: "seq-arrow-end",
              markerWidth: "10",
              markerHeight: "10",
              refX: "6",
              refY: "3",
              orient: "auto",
              markerUnits: "strokeWidth",
            },
            React.createElement("path", { d: "M0,0 L6,3 L0,6 z", fill: "#9fb0ba" }),
          ),
          React.createElement(
            "marker",
            {
              id: "seq-arrow-start",
              markerWidth: "10",
              markerHeight: "10",
              refX: "0",
              refY: "3",
              orient: "auto-start-reverse",
              markerUnits: "strokeWidth",
            },
            React.createElement("path", { d: "M0,0 L6,3 L0,6 z", fill: "#9fb0ba" }),
          ),
        ),
        renderGrid(),
        renderOriginalSegments(originalOrder),
        renderPreservedSegments(),
        renderTranslationLines(),
        completePolygon ? renderCompletedPolygon() : null,
        demoPoint ? renderRotationDemo(demoPoint) : null,
        points.map(renderGraphPoint),
      ),
    );
  };

  const renderGrid = () => {
    const els = [];
    const left = SEQ_GRAPH.padX;
    const right = SEQ_GRAPH.padX + SEQ_GRAPH.gridWidth;
    const top = SEQ_GRAPH.padY;
    const bottom = SEQ_GRAPH.padY + SEQ_GRAPH.gridHeight;
    const axisArrowInset = 0;
    for (let x = SEQ_GRAPH.xMin; x <= SEQ_GRAPH.xMax; x++) {
      const px = SEQ_GRAPH.padX + (x - SEQ_GRAPH.xMin) * unitX;
      els.push(React.createElement("line", { key: "vx" + x, x1: px, y1: top, x2: px, y2: bottom, className: "seq-grid-line" }));
      els.push(
        x === 0 || x === SEQ_GRAPH.xMin || x === SEQ_GRAPH.xMax
          ? null
          : React.createElement("text", { key: "xl" + x, x: px, y: origin.y + 23, className: "seq-axis-number", textAnchor: "middle" }, x),
      );
    }
    for (let y = SEQ_GRAPH.yMin; y <= SEQ_GRAPH.yMax; y++) {
      const py = SEQ_GRAPH.padY + (SEQ_GRAPH.yMax - y) * unitY;
      els.push(React.createElement("line", { key: "hy" + y, x1: left, y1: py, x2: right, y2: py, className: "seq-grid-line" }));
      els.push(
        y === 0 || y === SEQ_GRAPH.yMin || y === SEQ_GRAPH.yMax
          ? null
          : React.createElement("text", { key: "yl" + y, x: origin.x + 23, y: py + 6, className: "seq-axis-number", textAnchor: "middle" }, y),
      );
    }
    els.push(React.createElement("line", { key: "x-axis", x1: left + axisArrowInset, y1: origin.y, x2: right - axisArrowInset, y2: origin.y, className: "seq-axis-line", markerStart: "url(#seq-arrow-start)", markerEnd: "url(#seq-arrow-end)" }));
    els.push(React.createElement("line", { key: "y-axis", x1: origin.x, y1: top + axisArrowInset, x2: origin.x, y2: bottom - axisArrowInset, className: "seq-axis-line", markerStart: "url(#seq-arrow-start)", markerEnd: "url(#seq-arrow-end)" }));
    els.push(React.createElement("text", { key: "origin", x: origin.x - 14, y: origin.y + 12, className: "seq-origin-label" }, APP_DATA.graph.origin));
    els.push(React.createElement("text", { key: "x-label", x: right - 8, y: origin.y - 10, className: "seq-axis-name", textAnchor: "start" }, APP_DATA.graph.xAxis));
    els.push(React.createElement("text", { key: "y-label", x: origin.x, y: top - 8, className: "seq-axis-name", textAnchor: "middle" }, APP_DATA.graph.yAxis));
    return els;
  };

  const renderOriginalSegments = (order) =>
    order.map((key, index) => {
      const a = APP_DATA.originalPoints[key];
      const b = APP_DATA.originalPoints[order[(index + 1) % order.length]];
      return renderLine("orig-" + key, a, b, "#ffffff", true, "seq-original-line");
    });

  const renderPreservedSegments = () => {
    const keys = Object.keys(preservedPoints);
    if (keys.length < 3) return null;
    return keys.map((key, index) =>
      renderLine(
        "preserved-" + key,
        preservedPoints[key].point,
        preservedPoints[keys[(index + 1) % keys.length]].point,
        preservedPoints[key].color,
        true,
        "seq-preserved-line",
      ),
    );
  };

  const renderTranslationLines = () =>
    translationLines.map((key) =>
      React.createElement(
        "g",
        { key: "translation-" + key },
        renderLine(
          "translation-grow-" + key,
          stage.points[key.replace("''", "'")],
          stage.answers[key],
          "#ffffff",
          false,
          "seq-translation-grow",
        ),
        renderLine(
          "translation-dash-" + key,
          stage.points[key.replace("''", "'")],
          stage.answers[key],
          "#ffffff",
          true,
          "seq-translation-line",
        ),
      ),
    );

  const renderCompletedPolygon = () =>
    stage.answerKeys.map((key, index) =>
      renderLine(
        "complete-" + key,
        stage.answers[key],
        stage.answers[stage.answerKeys[(index + 1) % stage.answerKeys.length]],
        stage.finalPolygonColor,
        false,
        "seq-complete-line",
      ),
    );

  const renderLine = (key, from, to, color, dashed, className) => {
    const a = toSvg(from);
    const b = toSvg(to);
    return React.createElement("line", {
      key,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      stroke: color,
      strokeWidth: className === "seq-complete-line" ? 4 : 2.5,
      strokeDasharray: dashed ? "4 5" : undefined,
      className,
    });
  };

  const renderGraphPoint = (item) => {
    const pos = toSvg(item.point);
    const label = coordLabels[item.key] ? formatCoord(item.key, item.point) : item.label;
    const labelPos = getLabelPos(item, pos);
    return React.createElement(
      "g",
      { key: item.key, className: "seq-graph-point" },
      React.createElement("circle", {
        cx: pos.x,
        cy: pos.y,
        r: 8.5,
        fill: item.color,
        stroke: item.color === "#ffffff" ? "#ffffff" : "none",
        className: item.key.indexOf("'") !== -1 ? "seq-new-point" : "",
      }),
      React.createElement(
        "text",
        {
          x: labelPos.x,
          y: labelPos.y,
          fill: item.labelColor || "#ffffff",
          textAnchor: labelPos.anchor,
          className: "seq-point-label",
        },
        label,
      ),
    );
  };

  const renderRotationDemo = (pointKey) => {
    const originalKey = pointKey.charAt(0);
    const original = APP_DATA.originalPoints[originalKey];
    const from = toSvg(original);
    const arc = makeArc(origin, from, toSvg(stage.answers[pointKey]), 58);
    return React.createElement(
      "g",
      { className: "seq-rotation-demo" },
      React.createElement("line", { x1: origin.x, y1: origin.y, x2: from.x, y2: from.y, className: "seq-radius-line" }),
      React.createElement("path", { d: arc.d, className: "seq-angle-arc" }),
      React.createElement("text", { x: arc.label.x, y: arc.label.y, className: "seq-angle-label" }, "90\u00b0"),
      React.createElement(
        "g",
        {
          className: "seq-rotating-arm",
          style: { transformOrigin: origin.x + "px " + origin.y + "px" },
        },
        React.createElement("line", { x1: origin.x, y1: origin.y, x2: from.x, y2: from.y, className: "seq-moving-line" }),
        React.createElement("circle", { cx: from.x, cy: from.y, r: 8.5, fill: "#ffffff" }),
      ),
    );
  };

  const getLabelPos = (item, pos) => {
    if (item.labelPlacement === "left") return { x: pos.x - 14, y: pos.y - 12, anchor: "end" };
    if (item.labelPlacement === "right") return { x: pos.x + 13, y: pos.y - 12, anchor: "start" };
    return { x: pos.x, y: pos.y - 18, anchor: "middle" };
  };

  const makeArc = (center, start, end, radius) => {
    const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
    const a = {
      x: center.x + Math.cos(startAngle) * radius,
      y: center.y + Math.sin(startAngle) * radius,
    };
    const b = {
      x: center.x + Math.cos(endAngle) * radius,
      y: center.y + Math.sin(endAngle) * radius,
    };
    const mid = (startAngle + endAngle) / 2;
    return {
      d: "M " + a.x + " " + a.y + " A " + radius + " " + radius + " 0 0 1 " + b.x + " " + b.y,
      label: {
        x: center.x + Math.cos(mid) * (radius + 22),
        y: center.y + Math.sin(mid) * (radius + 22),
      },
    };
  };

  const formatCoord = (key, pt) => key + "(" + pt.x + "," + pt.y + ")";

  return React.createElement(
    "div",
    { className: "seq-canvas", ref: rootRef },
    React.createElement(
      "div",
      { className: "seq-math-column" },
      React.createElement(
        "div",
        { className: "seq-row seq-given-row" },
        stage.givenKeys.map((key) => renderCoordBox(key, stage.points[key], "given")),
      ),
      renderHint(),
      React.createElement(
        "div",
        { className: "seq-row seq-answer-row" },
        stage.answerKeys.map((key) =>
          React.createElement(
            "div",
            {
              key: key,
              ref: (el) => {
                coordRefs.current[key] = el;
              },
            },
            renderCoordBox(key, stage.answers[key], "answer"),
          ),
        ),
      ),
    ),
    React.createElement("div", { className: "seq-graph-column" }, renderGraph()),
    activeField && calloutPos
      ? React.createElement(
          "div",
          {
            className:
              "seq-numpad-callout" +
              (calloutPos.side === "right"
                ? " is-pointing-left"
                : " is-pointing-right"),
            style: {
              left: calloutPos.left + "px",
              top: calloutPos.top + "px",
              width: calloutPos.width + "px",
            },
          },
          React.createElement(Numpad, {
            backspaceLabel: APP_DATA.common.backspace,
            submitLabel: APP_DATA.common.enter,
            plusLabel: APP_DATA.common.plus,
            minusLabel: APP_DATA.common.minus,
            onNumberClick: typeValue,
            onBackspace: backspaceValue,
            onSubmit: submitValue,
          }),
        )
      : null,
    flyClone
      ? React.createElement(
          "div",
          {
            className: "seq-fly-clone" + (flyClone.moving ? " is-moving" : ""),
            style: {
              left: flyClone.start.x + "px",
              top: flyClone.start.y + "px",
              color: flyClone.color,
              "--dx": flyClone.end.x - flyClone.start.x + "px",
              "--dy": flyClone.end.y - flyClone.start.y + "px",
            },
          },
          flyClone.text,
        )
      : null,
  );
};
