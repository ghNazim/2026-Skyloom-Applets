function renderCoordPair(leftParts) {
  return React.createElement(
    "span",
    { className: "action-coord" },
    React.createElement("span", null, "("),
    React.createElement("span", { className: "x-val" }, leftParts.x),
    React.createElement("span", null, ", " + leftParts.y + ")"),
  );
}

function renderCoordPairY(x, y) {
  return React.createElement(
    "span",
    { className: "action-coord" },
    React.createElement("span", null, "("),
    React.createElement("span", null, x + ", "),
    React.createElement("span", { className: "y-val" }, y),
    React.createElement("span", null, ")"),
  );
}

function renderCoordExpr(baseX, change, y, phase) {
  if (phase === "merged") {
    return React.createElement(
      "span",
      { className: "action-coord" },
      React.createElement("span", null, "("),
      React.createElement("span", { className: "x-val" }, String(baseX + change)),
      React.createElement("span", null, ", " + y + ")"),
    );
  }
  const changeStr = change >= 0 ? "+" + change : "+(" + change + ")";
  return React.createElement(
    "span",
    { className: "action-coord" },
    React.createElement("span", null, "("),
    React.createElement("span", { className: "x-val" }, String(baseX)),
    React.createElement("span", { className: "change-val" }, changeStr),
    React.createElement("span", null, ", " + y + ")"),
  );
}

function renderCoordExprY(baseX, baseY, change, phase) {
  if (phase === "merged") {
    return React.createElement(
      "span",
      { className: "action-coord" },
      React.createElement("span", null, "("),
      React.createElement("span", null, baseX + ", "),
      React.createElement("span", { className: "y-val" }, String(baseY + change)),
      React.createElement("span", null, ")"),
    );
  }
  const changeStr = change >= 0 ? "+" + change : "+(" + change + ")";
  return React.createElement(
    "span",
    { className: "action-coord" },
    React.createElement("span", null, "("),
    React.createElement("span", null, baseX + ", "),
    React.createElement("span", { className: "y-val" }, String(baseY)),
    React.createElement("span", { className: "change-val-y" }, changeStr),
    React.createElement("span", null, ")"),
  );
}

function renderArrowBlock(label, extraClass) {
  return React.createElement(
    "div",
    { className: "action-arrow-block" + (extraClass ? " " + extraClass : "") },
    label
      ? React.createElement(
          "span",
          { className: "action-arrow-label" },
          typeof label === "string" ? label : label,
        )
      : null,
    React.createElement(
      "svg",
      {
        className: "action-arrow-svg",
        viewBox: "0 0 95 20",
        preserveAspectRatio: "none",
        "aria-hidden": "true",
      },
      React.createElement("line", {
        x1: 0,
        y1: 10,
        x2: 88,
        y2: 10,
        stroke: "#ffffff",
        strokeWidth: 2.5,
        vectorEffect: "non-scaling-stroke",
      }),
      React.createElement("polygon", {
        points: "95,10 88,5 88,15",
        fill: "#ffffff",
      }),
    ),
  );
}

function renderHorizontalFormulaBox(xaRef) {
  return React.createElement(
    "div",
    { className: "formula-row-box" },
    React.createElement(
      "span",
      { className: "formula-coord" },
      React.createElement("span", null, "("),
      React.createElement("span", { className: "x-val" }, "x"),
      React.createElement("span", null, ", "),
      React.createElement("span", { className: "y-val" }, "y"),
      React.createElement("span", null, ")"),
    ),
    renderArrowBlock(null, "formula-arrow"),
    React.createElement(
      "span",
      { className: "formula-coord" },
      React.createElement("span", null, "("),
      React.createElement(
        "span",
        { ref: xaRef, className: "fly-source-xa" },
        React.createElement("span", { className: "x-val" }, "x"),
        React.createElement("span", { className: "change-val" }, "+a"),
      ),
      React.createElement("span", null, ", "),
      React.createElement("span", { className: "y-val" }, "y"),
      React.createElement("span", null, ")"),
    ),
  );
}

function renderVerticalFormulaBox(ybRef) {
  return React.createElement(
    "div",
    { className: "formula-row-box" },
    React.createElement(
      "span",
      { className: "formula-coord" },
      React.createElement("span", null, "("),
      React.createElement("span", { className: "x-val" }, "x"),
      React.createElement("span", null, ", "),
      React.createElement("span", { className: "y-val" }, "y"),
      React.createElement("span", null, ")"),
    ),
    renderArrowBlock(null, "formula-arrow"),
    React.createElement(
      "span",
      { className: "formula-coord" },
      React.createElement("span", null, "(x, "),
      React.createElement(
        "span",
        { ref: ybRef, className: "fly-source-yb" },
        React.createElement("span", { className: "y-val" }, "y"),
        React.createElement("span", { className: "change-val-y" }, "+b"),
      ),
      React.createElement("span", null, ")"),
    ),
  );
}

const MainCanvas = (props) => {
  const { useState, useRef, useEffect } = React;
  const {
    step,
    step1Phase,
    step2Phase,
    step3Phase,
    step4Phase,
    step5Phase,
    hValue,
    vValue,
    snappedH,
    snappedV,
    isDragging,
    sliderLocked,
    showDynamicBox,
    dynamicCoordPhase,
    symbolicMode,
    step1Snapped,
    step2Snapped,
    step3Snapped,
    step4Snapped,
    highlightStaticX,
    highlightStaticY,
    onHChange,
    onHRelease,
    onHDragStart,
    onVChange,
    onVRelease,
    onVDragStart,
    onGeneralRuleClick,
    onCombineClick,
    onCombineComplete,
    exploreH,
    exploreV,
    step6Dragging,
    step6LinePhase,
    onExploreHChange,
    onExploreVChange,
    onExploreHDragStart,
    onExploreVDragStart,
    onExploreHRelease,
    onExploreVRelease,
  } = props;

  const row1XaRef = useRef(null);
  const row2YbRef = useRef(null);
  const row3XaRef = useRef(null);
  const row3YbRef = useRef(null);
  const combineAnimStartedRef = useRef(false);

  const [showCombinedLeft, setShowCombinedLeft] = useState(false);
  const [showCombinedArrow, setShowCombinedArrow] = useState(false);
  const [showCombinedXa, setShowCombinedXa] = useState(false);
  const [showCombinedYb, setShowCombinedYb] = useState(false);
  const [showCombinedArrowLabel, setShowCombinedArrowLabel] = useState(false);
  const [flyClone, setFlyClone] = useState(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const resetCombineAnim = () => {
    combineAnimStartedRef.current = false;
    setShowCombinedLeft(false);
    setShowCombinedArrow(false);
    setShowCombinedXa(false);
    setShowCombinedYb(false);
    setShowCombinedArrowLabel(false);
    setFlyClone(null);
  };

  const animateFly = (sourceRef, targetRef, type) => {
    return new Promise((resolve) => {
      if (!sourceRef.current || !targetRef.current) {
        resolve();
        return;
      }
      const src = sourceRef.current.getBoundingClientRect();
      const tgt = targetRef.current.getBoundingClientRect();
      const dx = tgt.left - src.left;
      const dy = tgt.top - src.top;

      setFlyClone({
        type: type,
        startX: src.left,
        startY: src.top,
        dx: dx,
        dy: dy,
        animating: false,
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyClone((prev) => (prev ? { ...prev, animating: true } : null));
        });
      });

      setTimeout(() => {
        setFlyClone(null);
        resolve();
      }, 850);
    });
  };

  useEffect(() => {
    if (step !== 5) {
      resetCombineAnim();
      return;
    }
    if (step5Phase === "initial") {
      resetCombineAnim();
      return;
    }
    if (step5Phase !== "combining" || combineAnimStartedRef.current) return;

    combineAnimStartedRef.current = true;

    const runCombineSequence = async () => {
      await delay(80);
      setShowCombinedLeft(true);
      setShowCombinedArrow(true);
      await delay(650);
      await animateFly(row1XaRef, row3XaRef, "xa");
      setShowCombinedXa(true);
      await delay(250);
      await animateFly(row2YbRef, row3YbRef, "yb");
      setShowCombinedYb(true);
      await delay(250);
      setShowCombinedArrowLabel(true);
      await delay(650);
      if (typeof onCombineComplete === "function") onCombineComplete();
    };

    runCombineSequence();
  }, [step, step5Phase, onCombineComplete]);

  const BASE_X = 3;
  const BASE_Y = 3;

  const renderActionColumn = () => {
    if (step === 1 && step1Phase === "done") {
      const s1 = APP_DATA.steps[1];
      const n = Math.abs(step1Snapped);
      return React.createElement(
        "div",
        { className: "action-row" },
        renderCoordPair({ x: "3", y: "3" }),
        renderArrowBlock(s1.unitsRight.replace("{n}", String(n))),
        renderCoordExpr(BASE_X, step1Snapped, BASE_Y, "expression"),
      );
    }

    if (step === 2) {
      const s2 = APP_DATA.steps[2];
      const rows = [];

      if (step1Snapped !== 0) {
        rows.push(
          React.createElement(
            "div",
            { className: "action-row", key: "row-right" },
            renderCoordPair({ x: "3", y: "3" }),
            renderArrowBlock(
              APP_DATA.steps[1].unitsRight.replace("{n}", String(Math.abs(step1Snapped))),
            ),
            renderCoordExpr(BASE_X, step1Snapped, BASE_Y, "expression"),
          ),
        );
      }

      if (
        step2Phase === "done" ||
        step2Phase === "ruleShown" ||
        step2Phase === "animating"
      ) {
        rows.push(
          React.createElement(
            "div",
            { className: "action-row", key: "row-left" },
            renderCoordPair({ x: "3", y: "3" }),
            renderArrowBlock(s2.unitsLeft.replace("{n}", String(Math.abs(step2Snapped)))),
            renderCoordExpr(BASE_X, step2Snapped, BASE_Y, "expression"),
          ),
        );
      }

      if (step2Phase === "done") {
        rows.push(
          React.createElement(
            "button",
            { key: "rule-btn", className: "btn general-rule-btn", id: "general-rule-button", onClick: onGeneralRuleClick },
            s2.generalRuleBtn,
          ),
        );
      }

      if (step2Phase === "ruleShown") {
        rows.push(
          React.createElement(
            "div",
            { className: "rule-text-block", key: "rule-text" },
            React.createElement(
              "p",
              { className: "rule-intro" },
              s2.ruleIntro + " ",
              React.createElement("span", { className: "highlight-a" }, s2.ruleUnits),
              React.createElement("span", { className: "rule-intro" }, s2.ruleUnitsHorizontal),
            ),
            React.createElement("p", { className: "rule-intro" }, s2.ruleThen),
            React.createElement(
              "div",
              { className: "rule-formula-box" },
              React.createElement("span", null, "("),
              React.createElement("span", { className: "x-val" }, "x"),
              React.createElement("span", null, ", y) → ("),
              React.createElement("span", { className: "x-val" }, "x"),
              React.createElement("span", { className: "change-val" }, "+a"),
              React.createElement("span", null, ", y)"),
            ),
          ),
        );
      }

      return rows.length ? rows : null;
    }

    if (step === 3 && step3Phase === "done") {
      const s3 = APP_DATA.steps[3];
      return React.createElement(
        "div",
        { className: "action-row" },
        renderCoordPairY("3", "3"),
        renderArrowBlock(s3.unitsUp.replace("{n}", String(Math.abs(step3Snapped)))),
        renderCoordExprY(BASE_X, BASE_Y, step3Snapped, "expression"),
      );
    }

    if (step === 4) {
      const s4 = APP_DATA.steps[4];
      const rows = [];

      if (step3Snapped !== 0) {
        rows.push(
          React.createElement(
            "div",
            { className: "action-row", key: "row-up" },
            renderCoordPairY("3", "3"),
            renderArrowBlock(
              APP_DATA.steps[3].unitsUp.replace("{n}", String(Math.abs(step3Snapped))),
            ),
            renderCoordExprY(BASE_X, BASE_Y, step3Snapped, "expression"),
          ),
        );
      }

      if (
        step4Phase === "done" ||
        step4Phase === "ruleShown" ||
        step4Phase === "animating"
      ) {
        rows.push(
          React.createElement(
            "div",
            { className: "action-row", key: "row-down" },
            renderCoordPairY("3", "3"),
            renderArrowBlock(s4.unitsDown.replace("{n}", String(Math.abs(step4Snapped)))),
            renderCoordExprY(BASE_X, BASE_Y, step4Snapped, "expression"),
          ),
        );
      }

      if (step4Phase === "done") {
        rows.push(
          React.createElement(
            "button",
            { key: "rule-btn", className: "btn general-rule-btn", id: "general-rule-button", onClick: onGeneralRuleClick },
            s4.generalRuleBtn,
          ),
        );
      }

      if (step4Phase === "ruleShown") {
        rows.push(
          React.createElement(
            "div",
            { className: "rule-text-block", key: "rule-text" },
            React.createElement(
              "p",
              { className: "rule-intro" },
              s4.ruleIntro + " ",
              React.createElement("span", { className: "highlight-b" }, s4.ruleUnits),
              React.createElement("span", { className: "rule-intro" }, s4.ruleUnitsVertical),
            ),
            React.createElement("p", { className: "rule-intro" }, s4.ruleThen),
            React.createElement(
              "div",
              { className: "rule-formula-box" },
              React.createElement("span", null, "("),
              React.createElement("span", null, "x, "),
              React.createElement("span", { className: "y-val" }, "y"),
              React.createElement("span", null, ") → (x, "),
              React.createElement("span", { className: "y-val" }, "y"),
              React.createElement("span", { className: "change-val-y" }, "+b"),
              React.createElement("span", null, ")"),
            ),
          ),
        );
      }

      return rows.length ? rows : null;
    }

    return null;
  };

  const isVertical = step === 3 || step === 4;
  const sliderVal = isVertical ? vValue : hValue;

  const hMode =
    step === 1
      ? "positive"
      : step === 2 &&
          (step2Phase === "animating" || step2Phase === "ruleShown")
        ? "both"
        : step === 2
          ? "negative"
          : "both";

  const vMode =
    step === 3
      ? "positive"
      : step === 4 &&
          (step4Phase === "animating" || step4Phase === "ruleShown")
        ? "both"
        : step === 4
          ? "negative"
          : "both";

  const showGhost =
    (step === 1 && (isDragging || showDynamicBox || step1Phase === "done")) ||
    (step === 2 &&
      (isDragging ||
        showDynamicBox ||
        step2Phase === "done" ||
        step2Phase === "animating" ||
        step2Phase === "ruleShown")) ||
    (step === 3 && (isDragging || showDynamicBox || step3Phase === "done")) ||
    (step === 4 &&
      (isDragging ||
        showDynamicBox ||
        step4Phase === "done" ||
        step4Phase === "animating" ||
        step4Phase === "ruleShown"));

  const showConnector = showGhost && Math.abs(sliderVal) > 0.05;
  const showDistanceLabel =
    showConnector &&
    Math.abs(sliderVal) > 0.08 &&
    (isDragging ||
      showDynamicBox ||
      (step === 1 && step1Phase === "done") ||
      (step === 2 &&
        (step2Phase === "done" ||
          step2Phase === "animating" ||
          step2Phase === "ruleShown")) ||
      (step === 3 && step3Phase === "done") ||
      (step === 4 &&
        (step4Phase === "done" ||
          step4Phase === "animating" ||
          step4Phase === "ruleShown")));

  const staticCoordMode = symbolicMode ? "symbolic" : "numeric";
  const dynamicCoordMode =
    (step === 1 && (showDynamicBox || step1Phase === "done")) ||
    (step === 2 &&
      (showDynamicBox ||
        step2Phase === "done" ||
        step2Phase === "animating" ||
        step2Phase === "ruleShown")) ||
    (step === 3 && (showDynamicBox || step3Phase === "done")) ||
    (step === 4 &&
      (showDynamicBox ||
        step4Phase === "done" ||
        step4Phase === "animating" ||
        step4Phase === "ruleShown"))
      ? symbolicMode
        ? "symbolic"
        : "dynamic"
      : null;

  const dynamicPhase =
    symbolicMode && (step2Phase === "ruleShown" || step4Phase === "ruleShown")
      ? "dest"
      : dynamicCoordPhase;

  const hLocked =
    sliderLocked ||
    (step === 1 && step1Phase === "done") ||
    (step === 2 &&
      (step2Phase === "done" ||
        step2Phase === "animating" ||
        step2Phase === "ruleShown"));

  const vLocked =
    sliderLocked ||
    (step === 3 && step3Phase === "done") ||
    (step === 4 &&
      (step4Phase === "done" ||
        step4Phase === "animating" ||
        step4Phase === "ruleShown"));

  const hEnabled = step === 1 || step === 2;
  const vEnabled = step === 3 || step === 4;

  const renderFormulaColumn = () => {
    const s5 = APP_DATA.steps[5];

    return React.createElement(
      "div",
      { className: "formula-column" },
      React.createElement(
        "div",
        { className: "formula-row" },
        React.createElement("p", { className: "formula-row-label" }, s5.horizontalLabel),
        renderHorizontalFormulaBox(row1XaRef),
      ),
      React.createElement(
        "div",
        { className: "formula-row" },
        React.createElement("p", { className: "formula-row-label" }, s5.verticalLabel),
        renderVerticalFormulaBox(row2YbRef),
      ),
      React.createElement(
        "div",
        { className: "formula-row formula-row-combined" },
        step5Phase === "initial"
          ? React.createElement(
              "button",
              {
                className: "btn general-rule-btn combine-btn",
                id: "combine-button",
                onClick: onCombineClick,
              },
              s5.combineBtn,
            )
          : React.createElement(
              "div",
              { className: "formula-row-box combined-formula-box" },
              React.createElement(
                "span",
                {
                  className:
                    "formula-coord combined-part combined-left" +
                    (showCombinedLeft ? " visible" : ""),
                },
                React.createElement("span", null, "("),
                React.createElement("span", { className: "x-val" }, "x"),
                React.createElement("span", null, ", "),
                React.createElement("span", { className: "y-val" }, "y"),
                React.createElement("span", null, ")"),
              ),
              React.createElement(
                "div",
                {
                  className:
                    "combined-arrow-wrap combined-part" +
                    (showCombinedArrow ? " visible" : ""),
                },
                renderArrowBlock(
                  React.createElement(
                    React.Fragment,
                    null,
                    "(",
                    React.createElement("span", { className: "change-val" }, "a"),
                    ", ",
                    React.createElement("span", { className: "change-val-y" }, "b"),
                    ")",
                  ),
                  "formula-arrow combined-arrow" +
                    (showCombinedArrowLabel ? " label-visible" : ""),
                ),
              ),
              React.createElement(
                "span",
                { className: "formula-coord combined-dest" },
                React.createElement(
                  "span",
                  {
                    ref: row3XaRef,
                    className:
                      "combined-part combined-xa" +
                      (showCombinedXa ? " visible" : ""),
                  },
                  React.createElement("span", null, "("),
                  React.createElement("span", { className: "x-val" }, "x"),
                  React.createElement("span", { className: "change-val" }, "+a"),
                ),
                React.createElement(
                  "span",
                  {
                    ref: row3YbRef,
                    className:
                      "combined-part combined-yb" +
                      (showCombinedYb ? " visible" : ""),
                  },
                  React.createElement("span", null, ", "),
                  React.createElement("span", { className: "y-val" }, "y"),
                  React.createElement("span", { className: "change-val-y" }, "+b"),
                  React.createElement("span", null, ")"),
                ),
              ),
            ),
      ),
    );
  };

  const renderFlyClone = () => {
    if (!flyClone) return null;
    const content =
      flyClone.type === "xa"
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "x-val" }, "x"),
            React.createElement("span", { className: "change-val" }, "+a"),
          )
        : React.createElement(
            React.Fragment,
            null,
            React.createElement("span", { className: "y-val" }, "y"),
            React.createElement("span", { className: "change-val-y" }, "+b"),
          );

    return React.createElement(
      "div",
      {
        className: "fly-clone formula-coord",
        style: {
          left: flyClone.startX + "px",
          top: flyClone.startY + "px",
          transform: flyClone.animating
            ? "translate(" + flyClone.dx + "px, " + flyClone.dy + "px)"
            : "none",
        },
      },
      content,
    );
  };

  if (step === 6) {
    return React.createElement(
      "div",
      { className: "main-canvas-container step6-layout" },
      React.createElement(InteractiveGraphPanel, {
        hValue: exploreH,
        vValue: exploreV,
        isDragging: step6Dragging,
        linePhase: step6LinePhase,
        onHChange: onExploreHChange,
        onVChange: onExploreVChange,
        onHDragStart: onExploreHDragStart,
        onVDragStart: onExploreVDragStart,
        onHRelease: onExploreHRelease,
        onVRelease: onExploreVRelease,
      }),
    );
  }

  if (step === 5) {
    return React.createElement(
      "div",
      { className: "main-canvas-container step5-layout" },
      renderFormulaColumn(),
      renderFlyClone(),
    );
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-canvas-left" },
      React.createElement(GraphPanel, {
        baseX: BASE_X,
        baseY: BASE_Y,
        moveAxis: isVertical ? "y" : "x",
        hValue: hValue,
        vValue: vValue,
        hMin: step === 1 ? 0 : -3,
        hMax: 3,
        vMin: step === 3 ? 0 : -3,
        vMax: 3,
        hEnabled: hEnabled,
        vEnabled: vEnabled,
        hLocked: hLocked,
        vLocked: vLocked,
        hMode: hMode,
        vMode: vMode,
        isDragging: isDragging,
        highlightX: highlightStaticX,
        highlightY: highlightStaticY,
        showGhost: showGhost,
        showConnector: showConnector,
        showDistanceLabel: showDistanceLabel,
        staticCoordMode: staticCoordMode,
        dynamicCoordMode: dynamicCoordMode,
        dynamicCoordPhase: dynamicPhase,
        snappedH: snappedH,
        snappedV: snappedV,
        symbolicMode: symbolicMode,
        symbolicVar: step === 3 || step === 4 ? "b" : "a",
        onHChange: onHChange,
        onHRelease: onHRelease,
        onHDragStart: onHDragStart,
        onVChange: onVChange,
        onVRelease: onVRelease,
        onVDragStart: onVDragStart,
      }),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right" },
      renderActionColumn(),
    ),
  );
};
