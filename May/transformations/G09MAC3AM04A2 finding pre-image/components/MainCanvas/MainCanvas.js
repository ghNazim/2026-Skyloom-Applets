const MainCanvas = (props) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const {
    step,
    step2Phase,
    step3Phase,
    dndPlacements,
    dndSourceItems,
    dndWrongItemId,
    dndWrongZone,
    onDndDrop,
    onDndDragStart,
    onStep2AnimComplete,
    onRevealComplete,
    onRevealNudgeDismiss,
    graphPoints,
    graphSegments,
    feedback,
    step4LinePhase,
    draggableSegment,
    onSegmentDrop,
    segmentDragEnabled,
    placedClone,
    onSnapBackComplete,
    step5Phase,
    step5CurrentPoint,
    step5Placed,
    step5WrongPoint,
    step5VertexLabels,
    onPointDrop,
    onStep5SnapBackComplete,
    step6Phase,
    step6Offset,
    step6SnapBack,
    step6FigureColor,
    step6Vertices,
    onFigureDragMove,
    onFigureDrop,
    onStep6SnapBackComplete,
  } = props;

  const cellRefs = useRef({});
  const animStartedRef = useRef(false);
  const step3AnimStartedRef = useRef(false);
  const xRevealedRef = useRef(false);
  const yRevealedRef = useRef(false);
  const tableData = APP_DATA.table;
  const revealCfg = tableData.revealConfig;

  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [row2Cells, setRow2Cells] = useState({
    labelVisible: false,
    xVisible: false,
    yVisible: false,
  });
  const [row3Ready, setRow3Ready] = useState(false);
  const [row4RevealReady, setRow4RevealReady] = useState(false);
  const [actionPanelVisible, setActionPanelVisible] = useState(false);
  const [flyClone, setFlyClone] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null);

  const [revealXState, setRevealXState] = useState({ mode: "button" });
  const [revealYState, setRevealYState] = useState({ mode: "button" });
  const [revealAnimating, setRevealAnimating] = useState(false);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });

  const draggedItemRef = useRef(null);
  const isDraggingRef = useRef(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
        isYellow: !!options.isYellow,
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
    if (step !== 1 && step !== 2 && step !== 3) return;
    if (step === 1) {
      setLeftVisible(true);
      setRightVisible(true);
      setTableVisible(false);
      setHeaderVisible(false);
      setRow2Cells({ labelVisible: false, xVisible: false, yVisible: false });
      setRow3Ready(false);
      setRow4RevealReady(false);
      setActionPanelVisible(false);
      animStartedRef.current = false;
      return;
    }
    if (step === 2 && !animStartedRef.current) {
      animStartedRef.current = true;
      const runStep2Intro = async () => {
        setLeftVisible(true);
        setTableVisible(true);
        await delay(450);
        setHeaderVisible(true);
        await delay(550);

        await flyFromQuestionToCell("fly-point-q", "row2Label", {
          text: tableData.pointImage,
          isYellow: true,
        });
        setRow2Cells((c) => ({ ...c, labelVisible: true }));
        await delay(150);

        await flyFromQuestionToCell("fly-x", "row2X", {
          text: tableData.imageX,
        });
        setRow2Cells((c) => ({ ...c, xVisible: true }));
        await delay(150);

        await flyFromQuestionToCell("fly-y", "row2Y", {
          text: tableData.imageY,
        });
        setRow2Cells((c) => ({ ...c, yVisible: true }));
        await delay(400);

        setRow3Ready(true);
        await delay(500);

        setRightVisible(true);
        setActionPanelVisible(true);
        await delay(450);

        if (typeof onStep2AnimComplete === "function") onStep2AnimComplete();
      };
      runStep2Intro();
    }
  }, [step, flyFromQuestionToCell, onStep2AnimComplete]);

  useEffect(() => {
    if (step === 2 && step2Phase === "done") {
      setLeftVisible(true);
      setRightVisible(true);
      setTableVisible(true);
      setHeaderVisible(true);
      setRow2Cells({ labelVisible: true, xVisible: true, yVisible: true });
      setRow3Ready(true);
      setRow4RevealReady(false);
      setActionPanelVisible(false);
    }
    if (step !== 3) {
      setRow4RevealReady(false);
      setRevealXState({ mode: "button" });
      setRevealYState({ mode: "hidden" });
      xRevealedRef.current = false;
      yRevealedRef.current = false;
      step3AnimStartedRef.current = false;
      return;
    }
    if (step3AnimStartedRef.current) return;
    step3AnimStartedRef.current = true;

    setLeftVisible(true);
    setRightVisible(true);
    setTableVisible(true);
    setHeaderVisible(true);
    setRow2Cells({ labelVisible: true, xVisible: true, yVisible: true });
    setRow3Ready(true);
    setActionPanelVisible(false);
    if (step3Phase === "done") {
      setRevealXState({ mode: "result", text: revealCfg.resultX, shown: true });
      setRevealYState({ mode: "result", text: revealCfg.resultY, shown: true });
      xRevealedRef.current = true;
      yRevealedRef.current = true;
    } else {
      setRevealXState({ mode: "button" });
      setRevealYState({ mode: "hidden" });
      xRevealedRef.current = false;
      yRevealedRef.current = false;
    }
    setRow4RevealReady(true);
  }, [step, step2Phase, step3Phase]);

  const runRevealAnimation = useCallback(
    async (axis) => {
      const isX = axis === "x";
      const setReveal = isX ? setRevealXState : setRevealYState;
      const baseVal = isX ? revealCfg.imageX : revealCfg.imageY;
      const transVal = isX ? revealCfg.transX : revealCfg.transY;
      const transFlyText = isX ? revealCfg.transXFly : revealCfg.transYFly;
      const resultVal = isX ? revealCfg.resultX : revealCfg.resultY;
      const sourceRow2 = isX ? "row2X" : "row2Y";
      const sourceRow3 = isX ? "row3X" : "row3Y";
      const targetBase = isX ? "revealX-base" : "revealY-base";
      const targetTrans = isX ? "revealX-trans" : "revealY-trans";

      const exprState = {
        mode: "expression",
        base: baseVal,
        trans: transVal,
        operator: revealCfg.operator,
        showBase: false,
        showOperator: false,
        showTrans: false,
      };

      setRevealAnimating(true);
      setReveal(exprState);
      await delay(200);

      await flyBetweenCells(sourceRow2, targetBase, baseVal);
      setReveal((prev) =>
        prev.mode === "expression" ? { ...prev, showBase: true } : prev,
      );
      await delay(200);

      await flyBetweenCells(sourceRow3, targetTrans, transFlyText);
      setReveal((prev) =>
        prev.mode === "expression"
          ? { ...prev, showOperator: true, showTrans: true }
          : prev,
      );
      await delay(350);

      setReveal((prev) =>
        prev.mode === "expression" ? { ...prev, fadeOut: true } : prev,
      );
      await delay(400);

      setReveal({ mode: "result", text: resultVal, shown: false });
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
      setReveal({ mode: "result", text: resultVal, shown: true });
      await delay(400);

      setReveal({ mode: "result", text: resultVal, shown: true });
      setRevealAnimating(false);

      if (isX) {
        xRevealedRef.current = true;
        setRevealYState({ mode: "button" });
      } else {
        yRevealedRef.current = true;
      }

      if (typeof onRevealComplete === "function") {
        onRevealComplete(axis, xRevealedRef.current, yRevealedRef.current);
      }
    },
    [flyBetweenCells, onRevealComplete, revealCfg],
  );

  const handleRevealX = useCallback(() => {
    if (revealAnimating || revealXState.mode !== "button" || step !== 3) return;
    if (typeof onRevealNudgeDismiss === "function") onRevealNudgeDismiss();
    if (typeof playSound === "function") playSound("click");
    runRevealAnimation("x");
  }, [
    revealAnimating,
    revealXState,
    step,
    runRevealAnimation,
    onRevealNudgeDismiss,
  ]);

  const handleRevealY = useCallback(() => {
    if (revealAnimating || revealYState.mode !== "button" || step !== 3) return;
    if (typeof onRevealNudgeDismiss === "function") onRevealNudgeDismiss();
    if (typeof playSound === "function") playSound("click");
    runRevealAnimation("y");
  }, [
    revealAnimating,
    revealYState,
    step,
    runRevealAnimation,
    onRevealNudgeDismiss,
  ]);

  const findZoneAtPoint = useCallback((x, y) => {
    const zones = document.querySelectorAll(".coord-table-drop");
    let found = null;
    zones.forEach((zone) => {
      const rect = zone.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        found = zone.dataset.zoneid;
      }
    });
    return found;
  }, []);

  const handlePointerDown = (e, itemId) => {
    if (step !== 2 || step2Phase !== "dnd" || dndWrongItemId) return;
    e.preventDefault();
    if (typeof onDndDragStart === "function") onDndDragStart();
    const rect = e.currentTarget.getBoundingClientRect();
    setGhostSize({ width: rect.width, height: rect.height });
    draggedItemRef.current = itemId;
    isDraggingRef.current = true;
    setDraggedItem(itemId);
    setIsDragging(true);
    setDragPosition({ x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ignore */
    }
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || !draggedItemRef.current) return;
      setDragPosition({ x: e.clientX, y: e.clientY });
      setHoveredZone(findZoneAtPoint(e.clientX, e.clientY));
    },
    [findZoneAtPoint],
  );

  const finishDrag = useCallback(
    (e) => {
      if (!isDraggingRef.current || !draggedItemRef.current) return;
      const itemId = draggedItemRef.current;
      const zoneId = findZoneAtPoint(e.clientX, e.clientY);
      if (zoneId && typeof onDndDrop === "function") {
        onDndDrop(itemId, zoneId);
      }
      draggedItemRef.current = null;
      isDraggingRef.current = false;
      setDraggedItem(null);
      setIsDragging(false);
      setHoveredZone(null);
    },
    [findZoneAtPoint, onDndDrop],
  );

  useEffect(() => {
    if (!isDragging) return undefined;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
    };
  }, [isDragging, handlePointerMove, finishDrag]);

  const renderDragGhost = () => {
    if (!isDragging || !draggedItem) return null;
    return React.createElement(
      "div",
      {
        className: "action-dnd-chip action-dnd-ghost",
        style: {
          left: dragPosition.x,
          top: dragPosition.y,
          width: ghostSize.width ? ghostSize.width + "px" : undefined,
          height: ghostSize.height ? ghostSize.height + "px" : undefined,
          transform: "translate(-50%, -50%)",
        },
      },
      draggedItem,
    );
  };

  const renderFlyClone = () => {
    if (!flyClone) return null;
    return React.createElement(
      "div",
      {
        className:
          "fly-clone-text" +
          (flyClone.isYellow ? " is-yellow" : "") +
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

  const showDndPanel = step === 2 && step2Phase === "dnd";
  const showRightInstruction = step === 3;
  const rightPanelText =
    step === 3
      ? step3Phase === "done"
        ? APP_DATA.rightPanel.step3Result
        : APP_DATA.rightPanel.step3Instruction
      : APP_DATA.rightPanel.step2Question;

  const columnsHidden = step === 1;
  const showDndGreen = step === 2 && step2Phase !== "initial";

  Object.keys(cellRefs.current).forEach((key) => {
    const el = cellRefs.current[key];
    if (!el) return;
    if (highlightedCell === key) el.classList.add("is-source-highlight");
    else el.classList.remove("is-source-highlight");
  });

  if (step === 6) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(TriangleDragGraphPanel, {
          vertices: step6Vertices || [],
          offset: step6Offset || { dx: 0, dy: 0 },
          figureColor: step6FigureColor || "#c9a0e8",
          dragEnabled: step6Phase === "drag" && !step6SnapBack,
          snapBackActive: step6SnapBack,
          onDragMove: onFigureDragMove,
          onFigureDrop: onFigureDrop,
          onSnapBackComplete: onStep6SnapBackComplete,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(FeedbackPanel, { feedback: feedback }),
      ),
    );
  }

  if (step === 5) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(FigureGraphPanel, {
          originalVertices: {
            A: { x: 2, y: 6 },
            B: { x: 6, y: 6 },
            C: { x: 6, y: 4 },
            D: { x: 2, y: 4 },
          },
          polygonOrder: ["A", "B", "C", "D"],
          placedPoints: step5Placed || [],
          showGreenPolygon: step5Phase === "done",
          draggablePointId:
            step5Phase === "drag" && !step5WrongPoint
              ? step5CurrentPoint
              : null,
          vertexLabels: step5VertexLabels || {},
          wrongPoint: step5WrongPoint,
          onPointDrop: onPointDrop,
          onSnapBackComplete: onStep5SnapBackComplete,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(FeedbackPanel, { feedback: feedback }),
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
        React.createElement(GraphPanel, {
          points: graphPoints || [],
          segments: graphSegments || [],
          interactive: false,
          draggableSegment: draggableSegment,
          onSegmentDrop: onSegmentDrop,
          segmentDragEnabled: segmentDragEnabled,
          placedClone: placedClone,
          onSnapBackComplete: onSnapBackComplete,
          showDragPathNudge: true,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(FeedbackPanel, { feedback: feedback }),
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
          (leftVisible && !columnsHidden ? " is-visible" : "") +
          (columnsHidden ? " is-hidden-step1" : ""),
      },
      step >= 2
        ? React.createElement(CoordinateTable, {
            step: step,
            tableVisible: tableVisible,
            headerVisible: headerVisible,
            row3Ready: row3Ready,
            row4RevealReady: row4RevealReady,
            row2Cells: row2Cells,
            dndPlacements: dndPlacements,
            dndHoveredZone: hoveredZone,
            dndWrongZone: dndWrongZone,
            dndWrongItemId: dndWrongItemId,
            showDndGreen: showDndGreen,
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
          (rightVisible && !columnsHidden ? " is-visible" : "") +
          (columnsHidden ? " is-hidden-step1" : ""),
      },
      showDndPanel
        ? React.createElement(ActionDndPanel, {
            title: APP_DATA.rightPanel.step2Question,
            sourceItems: dndSourceItems,
            onPointerDown: handlePointerDown,
            draggedItem: draggedItem,
            dragGhost: renderDragGhost(),
            visible: actionPanelVisible,
          })
        : showRightInstruction
          ? React.createElement(RightPanel, {
              text: rightPanelText,
              visible: rightVisible,
            })
          : null,
    ),
    renderFlyClone(),
  );
};
