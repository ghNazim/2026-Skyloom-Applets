const MainCanvas = ({
  step,
  step2Phase,
  step3Phase,
  onStep2Ready,
  onRevealStart,
  onRevealComplete,
  onTranslate,
  onTranslateComplete,
  onStep4Complete,
  onStep5Complete,
  onChoiceReady,
  onChoiceSelect,
  onScenarioTableComplete,
  onScenarioTableAnimating,
  selectedTrianglePoint,
  selectedLinePoint,
  onLineVerificationComplete,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const cellRefs = useRef({});
  const introStartedRef = useRef(false);
  const xRevealedRef = useRef(false);
  const yRevealedRef = useRef(false);
  const tableData = APP_DATA.table;
  const revealCfg = tableData.revealConfig;

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [imageRow, setImageRow] = useState({ label: false, x: false, y: false });
  const [preImageRow, setPreImageRow] = useState({
    label: false,
    x: false,
    y: false,
  });
  const [translationRow, setTranslationRow] = useState({ visible: false });
  const [revealXState, setRevealXState] = useState({ mode: "hidden" });
  const [revealYState, setRevealYState] = useState({ mode: "hidden" });
  const [revealAnimating, setRevealAnimating] = useState(false);
  const [flyClone, setFlyClone] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const resetStep2View = useCallback(() => {
    setLeftVisible(false);
    setRightVisible(false);
    setTableVisible(false);
    setHeaderVisible(false);
    setImageRow({ label: false, x: false, y: false });
    setPreImageRow({ label: false, x: false, y: false });
    setTranslationRow({ visible: false });
    setRevealXState({ mode: "hidden" });
    setRevealYState({ mode: "hidden" });
    setRevealAnimating(false);
    setFlyClone(null);
    setHighlightedCell(null);
    xRevealedRef.current = false;
    yRevealedRef.current = false;
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
      const sourceEl = document.getElementById(sourceId);
      const targetEl = cellRefs.current[targetRefKey];
      await animateFly(sourceEl, targetEl, options);
    },
    [animateFly],
  );

  const flyBetweenCells = useCallback(
    async (sourceRefKey, targetRefKey, text) => {
      const sourceEl = cellRefs.current[sourceRefKey];
      const targetEl = cellRefs.current[targetRefKey];
      setHighlightedCell(sourceRefKey);
      await animateFly(sourceEl, targetEl, { text: text });
      setHighlightedCell(null);
    },
    [animateFly],
  );

  useEffect(() => {
    if (step === 1) {
      introStartedRef.current = false;
      resetStep2View();
      return;
    }

    if (step !== 2) return;

    if (step2Phase === "done") {
      setLeftVisible(true);
      setRightVisible(true);
      setTableVisible(true);
      setHeaderVisible(true);
      setImageRow({ label: true, x: true, y: true });
      setPreImageRow({ label: true, x: true, y: true });
      setTranslationRow({ visible: true });
      setRevealXState({ mode: "result", text: revealCfg.xResult, shown: true });
      setRevealYState({ mode: "result", text: revealCfg.yResult, shown: true });
      xRevealedRef.current = true;
      yRevealedRef.current = true;
      return;
    }

    if (introStartedRef.current) return;
    introStartedRef.current = true;

    const runIntro = async () => {
      resetStep2View();
      setLeftVisible(true);
      setTableVisible(true);
      await delay(350);
      setHeaderVisible(true);
      await delay(450);

      await flyFromQuestionToCell("fly-image-label", "imageLabel", {
        text: tableData.pointImage,
        colorRole: "image",
      });
      setImageRow((row) => ({ ...row, label: true }));
      await delay(120);

      await flyFromQuestionToCell("fly-image-x", "imageX", {
        text: tableData.imageX,
      });
      setImageRow((row) => ({ ...row, x: true }));
      await delay(120);

      await flyFromQuestionToCell("fly-image-y", "imageY", {
        text: tableData.imageY,
      });
      setImageRow((row) => ({ ...row, y: true }));
      await delay(300);

      await flyFromQuestionToCell("fly-pre-label", "preImageLabel", {
        text: tableData.pointPreImage,
        colorRole: "object",
      });
      setPreImageRow((row) => ({ ...row, label: true }));
      await delay(120);

      await flyFromQuestionToCell("fly-pre-x", "preImageX", {
        text: tableData.preImageX,
      });
      setPreImageRow((row) => ({ ...row, x: true }));
      await delay(120);

      await flyFromQuestionToCell("fly-pre-y", "preImageY", {
        text: tableData.preImageY,
      });
      setPreImageRow((row) => ({ ...row, y: true }));
      await delay(300);

      setRightVisible(true);
      await delay(250);
      setTranslationRow({ visible: true });
      setRevealXState({ mode: "button" });
      setRevealYState({ mode: "hidden" });

      if (typeof onStep2Ready === "function") onStep2Ready();
    };

    runIntro();
  }, [
    step,
    step2Phase,
    tableData,
    revealCfg,
    resetStep2View,
    flyFromQuestionToCell,
    onStep2Ready,
  ]);

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
      const targetSubtract = isX
        ? "translationX-subtract"
        : "translationY-subtract";

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
      setReveal((prev) =>
        prev.mode === "expression" ? { ...prev, showBase: true } : prev,
      );
      await delay(180);

      await flyBetweenCells(sourcePreImage, targetSubtract, subtractVal);
      setReveal((prev) =>
        prev.mode === "expression"
          ? { ...prev, showOperator: true, showSubtract: true }
          : prev,
      );
      await delay(380);

      setReveal((prev) =>
        prev.mode === "expression" ? { ...prev, fadeOut: true } : prev,
      );
      await delay(350);
      setReveal({ mode: "result", text: resultVal, shown: false });
      await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });
      setReveal({ mode: "result", text: resultVal, shown: true });
      await delay(300);

      if (isX) {
        xRevealedRef.current = true;
        setRevealYState({ mode: "button" });
      } else {
        yRevealedRef.current = true;
      }

      setRevealAnimating(false);
      if (typeof onRevealComplete === "function") {
        onRevealComplete(axis, xRevealedRef.current, yRevealedRef.current);
      }
    },
    [flyBetweenCells, onRevealComplete, revealCfg],
  );

  const handleRevealX = useCallback(() => {
    if (revealAnimating || revealXState.mode !== "button") return;
    if (typeof playSound === "function") playSound("click");
    if (typeof onRevealStart === "function") onRevealStart();
    runRevealAnimation("x");
  }, [revealAnimating, revealXState.mode, runRevealAnimation, onRevealStart]);

  const handleRevealY = useCallback(() => {
    if (revealAnimating || revealYState.mode !== "button") return;
    if (typeof playSound === "function") playSound("click");
    if (typeof onRevealStart === "function") onRevealStart();
    runRevealAnimation("y");
  }, [revealAnimating, revealYState.mode, runRevealAnimation, onRevealStart]);

  Object.keys(cellRefs.current).forEach((key) => {
    const el = cellRefs.current[key];
    if (!el) return;
    if (highlightedCell === key) el.classList.add("is-source-highlight");
    else el.classList.remove("is-source-highlight");
  });

  const renderFlyClone = () => {
    if (!flyClone) return null;
    return React.createElement(
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
    );
  };

  if (step === 3) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(TranslationGraphPanel, {
          phase: step3Phase,
          onAnimationComplete: onTranslateComplete,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(RightPanel, {
          html: APP_DATA.rightPanel.resultHtml,
          visible: true,
          buttonText: APP_DATA.rightPanel.translateButton,
          buttonId: "translate-button",
          onButtonClick: onTranslate,
          buttonDisabled: step3Phase !== "ready",
          buttonVisible: true,
        }),
      ),
    );
  }

  if (step === 4) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(ActivityGraph, {
          points: [
            {
              id: "practice-object-a",
              x: 3,
              y: 4,
              color: APP_DATA.colors.object,
              labelColor: APP_DATA.colors.object,
              label: "A (3, 4)",
              labelDx: 10,
              labelDy: -18,
              labelAnchor: "middle",
            },
            {
              id: "practice-image-a",
              x: 9,
              y: 6,
              color: APP_DATA.colors.image,
              labelColor: APP_DATA.colors.image,
              label: "A' (9,6)",
              labelDy: -20,
            },
          ],
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(TranslationNumpadPanel, {
          onComplete: onStep4Complete,
        }),
      ),
    );
  }

  if (step === 5) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(RectangleSliderPanel, {
        onComplete: onStep5Complete,
      }),
    );
  }

  if (step === 6 || step === 9) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement("div", { className: "main-canvas-left is-hidden-step1" }),
      React.createElement("div", { className: "main-canvas-right is-hidden-step1" }),
    );
  }

  if (step === 7 || step === 10) {
    const scenario =
      step === 7 ? APP_DATA.scenarios.triangle : APP_DATA.scenarios.line;
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(ScenarioChoicePanel, {
        scenario: scenario,
        onReady: () =>
          typeof onChoiceReady === "function" ? onChoiceReady(step) : null,
        onSelect: onChoiceSelect,
      }),
    );
  }

  if (step === 8 || step === 11) {
    const scenario =
      step === 8 ? APP_DATA.scenarios.triangle : APP_DATA.scenarios.line;
    const selectedPoint =
      step === 8 ? selectedTrianglePoint || "P" : selectedLinePoint || "M";
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(ScenarioTablePanel, {
        scenario: scenario,
        selectedPoint: selectedPoint,
        onComplete: () =>
          typeof onScenarioTableComplete === "function"
            ? onScenarioTableComplete(step)
            : null,
        onAnimatingChange: (isAnimating) =>
          typeof onScenarioTableAnimating === "function"
            ? onScenarioTableAnimating(step, isAnimating)
            : null,
      }),
    );
  }

  if (step === 12) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(LineVerificationGraphPanel, {
          onComplete: onLineVerificationComplete,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(RightPanel, {
          html: APP_DATA.verification.ruleHtml,
          visible: true,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      {
        className:
          "main-canvas-left" +
          (leftVisible && step !== 1 ? " is-visible" : "") +
          (step === 1 ? " is-hidden-step1" : ""),
      },
      step === 2
        ? React.createElement(CoordinateTable, {
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
          })
        : null,
    ),
    React.createElement(
      "div",
      {
        className:
          "main-canvas-right" +
          (rightVisible && step !== 1 ? " is-visible" : "") +
          (step === 1 ? " is-hidden-step1" : ""),
      },
      step === 2
        ? React.createElement(RightPanel, {
            text:
              step2Phase === "done"
                ? APP_DATA.rightPanel.resultHtml
                : APP_DATA.rightPanel.instruction,
            html: step2Phase === "done" ? APP_DATA.rightPanel.resultHtml : null,
            visible: rightVisible,
          })
        : null,
    ),
    renderFlyClone(),
  );
};
