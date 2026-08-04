const ScenarioTablePanel = ({ scenario, selectedPoint, onComplete, onAnimatingChange }) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;
  const cellRefs = useRef({});
  const xDoneRef = useRef(false);
  const yDoneRef = useRef(false);
  const startedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onAnimatingChangeRef = useRef(onAnimatingChange);
  const pointKey = selectedPoint || scenario.options[0];
  const pointData = scenario.points[pointKey] || scenario.points[scenario.options[0]];
  const dx = pointData.image[0] - pointData.pre[0];
  const dy = pointData.image[1] - pointData.pre[1];
  const formatSigned = (value) => (value > 0 ? String(value) : String(value));
  const tableData = useMemo(
    () => ({
      ...scenario.table,
      pointImage: scenario.pointLabelPrefix + pointKey + scenario.imageMark,
      pointPreImage: scenario.pointLabelPrefix + pointKey,
      imageX: String(pointData.image[0]),
      imageY: String(pointData.image[1]),
      preImageX: String(pointData.pre[0]),
      preImageY: String(pointData.pre[1]),
      revealConfig: {
        ...scenario.table.revealConfig,
        xBase: String(pointData.image[0]),
        xSubtract: String(pointData.pre[0]),
        xResult: formatSigned(dx),
        yBase: String(pointData.image[1]),
        ySubtract: String(pointData.pre[1]),
        yResult: formatSigned(dy),
      },
    }),
    [scenario, pointKey, pointData, dx, dy],
  );
  const revealCfg = tableData.revealConfig;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onAnimatingChangeRef.current = onAnimatingChange;
  }, [onAnimatingChange]);

  const [tableVisible, setTableVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [imageRow, setImageRow] = useState({ label: false, x: false, y: false });
  const [preImageRow, setPreImageRow] = useState({ label: false, x: false, y: false });
  const [translationRow, setTranslationRow] = useState({ visible: false });
  const [rightVisible, setRightVisible] = useState(false);
  const [rightDone, setRightDone] = useState(false);
  const [revealXState, setRevealXState] = useState({ mode: "hidden" });
  const [revealYState, setRevealYState] = useState({ mode: "hidden" });
  const [revealAnimating, setRevealAnimating] = useState(false);
  const [flyClone, setFlyClone] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const setPanelAnimating = useCallback((isAnimating) => {
    if (typeof onAnimatingChangeRef.current === "function") {
      onAnimatingChangeRef.current(isAnimating);
    }
  }, []);

  const animateFly = useCallback((sourceEl, targetEl, options = {}) => {
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }
      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
      const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);
      setFlyClone({
        text: options.text || sourceEl.textContent.trim(),
        colorRole: options.colorRole || "",
        startX: src.left + src.width / 2,
        startY: src.top + src.height / 2,
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
      }, 780);
    });
  }, []);

  const flyFromQuestionToCell = useCallback(
    async (sourceId, targetRefKey, options = {}) => {
      await animateFly(document.getElementById(sourceId), cellRefs.current[targetRefKey], options);
    },
    [animateFly],
  );

  const flyBetweenCells = useCallback(
    async (sourceRefKey, targetRefKey, text) => {
      setHighlightedCell(sourceRefKey);
      await animateFly(cellRefs.current[sourceRefKey], cellRefs.current[targetRefKey], { text: text });
      setHighlightedCell(null);
    },
    [animateFly],
  );

  useEffect(() => {
    startedRef.current = false;
    xDoneRef.current = false;
    yDoneRef.current = false;
    setPanelAnimating(false);
  }, [scenario.id, pointKey, setPanelAnimating]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const run = async () => {
      setPanelAnimating(true);
      setTableVisible(true);
      await delay(350);
      setHeaderVisible(true);
      await delay(450);

      await flyFromQuestionToCell(pointData.imageSourceId, "imageLabel", {
        text: tableData.pointImage,
        colorRole: "image",
      });
      setImageRow((row) => ({ ...row, label: true }));
      await delay(120);
      await flyFromQuestionToCell(pointData.imageXSourceId, "imageX", {
        text: tableData.imageX,
      });
      setImageRow((row) => ({ ...row, x: true }));
      await delay(120);
      await flyFromQuestionToCell(pointData.imageYSourceId, "imageY", {
        text: tableData.imageY,
      });
      setImageRow((row) => ({ ...row, y: true }));
      await delay(300);

      await flyFromQuestionToCell(pointData.preSourceId, "preImageLabel", {
        text: tableData.pointPreImage,
        colorRole: "object",
      });
      setPreImageRow((row) => ({ ...row, label: true }));
      await delay(120);
      await flyFromQuestionToCell(pointData.preXSourceId, "preImageX", {
        text: tableData.preImageX,
      });
      setPreImageRow((row) => ({ ...row, x: true }));
      await delay(120);
      await flyFromQuestionToCell(pointData.preYSourceId, "preImageY", {
        text: tableData.preImageY,
      });
      setPreImageRow((row) => ({ ...row, y: true }));
      await delay(300);

      setRightVisible(true);
      await delay(250);
      setTranslationRow({ visible: true });
      setRevealXState({ mode: "button" });
      setRevealYState({ mode: "hidden" });
      setPanelAnimating(false);
    };
    run();
  }, [scenario.id, pointKey, pointData, tableData, flyFromQuestionToCell, setPanelAnimating]);

  const runRevealAnimation = useCallback(
    async (axis) => {
      const isX = axis === "x";
      const setReveal = isX ? setRevealXState : setRevealYState;
      const baseVal = isX ? revealCfg.xBase : revealCfg.yBase;
      const subtractVal = isX ? revealCfg.xSubtract : revealCfg.ySubtract;
      const resultVal = isX ? revealCfg.xResult : revealCfg.yResult;
      const sourceImage = isX ? "imageX" : "imageY";
      const sourcePreImage = isX ? "preImageX" : "preImageY";
      const targetBase = isX ? "translationX-base" : "translationY-base";
      const targetSubtract = isX ? "translationX-subtract" : "translationY-subtract";

      setPanelAnimating(true);
      setRevealAnimating(true);
      setReveal({
        mode: "expression",
        base: baseVal,
        subtract: subtractVal,
        operator: revealCfg.operator,
        showBase: false,
        showOperator: false,
        showSubtract: false,
      });
      await delay(180);
      await flyBetweenCells(sourceImage, targetBase, baseVal);
      setReveal((prev) => (prev.mode === "expression" ? { ...prev, showBase: true } : prev));
      await delay(180);
      await flyBetweenCells(sourcePreImage, targetSubtract, subtractVal);
      setReveal((prev) =>
        prev.mode === "expression"
          ? { ...prev, showOperator: true, showSubtract: true }
          : prev,
      );
      await delay(380);
      setReveal((prev) => (prev.mode === "expression" ? { ...prev, fadeOut: true } : prev));
      await delay(350);
      setReveal({ mode: "result", text: resultVal, shown: false });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      setReveal({ mode: "result", text: resultVal, shown: true });
      await delay(300);

      if (isX) {
        xDoneRef.current = true;
        setRevealYState({ mode: "button" });
      } else {
        yDoneRef.current = true;
      }

      setRevealAnimating(false);
      setPanelAnimating(false);
      if (xDoneRef.current && yDoneRef.current) {
        setRightDone(true);
        if (typeof onCompleteRef.current === "function") onCompleteRef.current();
      }
    },
    [flyBetweenCells, revealCfg, setPanelAnimating],
  );

  const handleRevealX = () => {
    if (revealAnimating || revealXState.mode !== "button") return;
    if (typeof playSound === "function") playSound("click");
    runRevealAnimation("x");
  };

  const handleRevealY = () => {
    if (revealAnimating || revealYState.mode !== "button") return;
    if (typeof playSound === "function") playSound("click");
    runRevealAnimation("y");
  };

  Object.keys(cellRefs.current).forEach((key) => {
    const el = cellRefs.current[key];
    if (!el) return;
    if (highlightedCell === key) el.classList.add("is-source-highlight");
    else el.classList.remove("is-source-highlight");
  });

  const renderFlyClone = () =>
    flyClone
      ? React.createElement(
          "div",
          {
            className:
              "fly-clone-text" +
              (flyClone.colorRole ? " is-" + flyClone.colorRole + "-text" : "") +
              (flyClone.animating ? " is-animating" : ""),
            style: {
              left: flyClone.startX + "px",
              top: flyClone.startY + "px",
              transform: flyClone.animating
                ? "translate(calc(-50% + " +
                  flyClone.dx +
                  "px), calc(-50% + " +
                  flyClone.dy +
                  "px))"
                : "translate(-50%, -50%)",
            },
          },
          flyClone.text,
        )
      : null;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "main-canvas-left is-visible" },
      React.createElement(CoordinateTable, {
        tableVisible: tableVisible,
        headerVisible: headerVisible,
        imageRow: imageRow,
        preImageRow: preImageRow,
        translationRow: translationRow,
        revealXState:
          revealXState.mode === "button" && revealAnimating
            ? { mode: "button", disabled: true }
            : revealXState,
        revealYState:
          revealYState.mode === "button" && revealAnimating
            ? { mode: "button", disabled: true }
            : revealYState,
        onRevealX: handleRevealX,
        onRevealY: handleRevealY,
        cellRefs: cellRefs.current,
        tableData: tableData,
      }),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right is-visible" },
      React.createElement(RightPanel, {
        text: rightDone ? scenario.resultHtml : APP_DATA.rightPanel.instruction,
        html: rightDone ? scenario.resultHtml : null,
        visible: rightVisible,
      }),
    ),
    renderFlyClone(),
  );
};
