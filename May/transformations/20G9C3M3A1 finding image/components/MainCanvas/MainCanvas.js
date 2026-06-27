const MainCanvas = (props) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const {
    step,
    step2Phase,
    step3Phase,
    step3To4Transition,
    step4Phase,
    dndPlacements,
    dndSourceItems,
    dndWrongItemId,
    dndWrongZone,
    onDndDrop,
    onDndDragStart,
    onStep2AnimComplete,
    onRevealComplete,
    onRevealNudgeDismiss,
    onStep3To4Complete,
    graphPoints,
    graphSegments,
    onGridClick,
    locateTitle,
    highlightTarget,
    feedback,
    splashText,
    nudgeTarget,
    step6Phase,
    step7Phase,
    draggableSegment,
    onSegmentDrop,
    segmentDragEnabled,
    placedClone,
    onSnapBackComplete,
    step9Phase,
    step9CurrentPoint,
    step9Placed,
    step9WrongPoint,
    step9VertexLabels,
    onPointDrop,
    onStep9SnapBackComplete,
    step10Phase,
    step10Offset,
    step10SnapBack,
    step10FigureColor,
    step10Vertices,
    onFigureDragMove,
    onFigureDrop,
    onStep10SnapBackComplete,
  } = props;

  const cellRefs = useRef({});
  const locateRefs = useRef({});
  const animStartedRef = useRef(false);
  const step3AnimStartedRef = useRef(false);
  const step3TransitionStartedRef = useRef(false);
  const xRevealedRef = useRef(false);
  const yRevealedRef = useRef(false);

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
  const [transitionFlyClones, setTransitionFlyClones] = useState([]);
  const [leftPanelHiding, setLeftPanelHiding] = useState(false);
  const [locateCellVisible, setLocateCellVisible] = useState(null);
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

  const STEP3_TO4_FLY_MS = 780;
  const STEP3_TO4_HIDDEN = {
    title: false,
    pLabel: false,
    pValue: false,
    transLabel: false,
    transValue: false,
    pprimeLabel: false,
    pprimeValue: false,
    feedback: false,
  };

  const animateTransitionFly = useCallback((sourceEl, targetEl, options = {}) => {
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }
      const flyId = options.id || "fly-" + Date.now();
      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const dx = tgt.left + tgt.width / 2 - (src.left + src.width / 2);
      const dy = tgt.top + tgt.height / 2 - (src.top + src.height / 2);

      setTransitionFlyClones((prev) =>
        prev.concat([
          {
            id: flyId,
            text: options.text || sourceEl.textContent.trim(),
            isYellow: !!options.isYellow,
            startX: src.left + src.width / 2,
            startY: src.top + src.height / 2,
            dx: dx,
            dy: dy,
            animating: false,
          },
        ]),
      );

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionFlyClones((prev) =>
            prev.map((c) =>
              c.id === flyId ? { ...c, animating: true } : c,
            ),
          );
        });
      });

      setTimeout(() => {
        setTransitionFlyClones((prev) => prev.filter((c) => c.id !== flyId));
        resolve();
      }, STEP3_TO4_FLY_MS);
    });
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

        await flyFromQuestionToCell("fly-point-p", "row2Label", {
          text: APP_DATA.table.pointP,
          isYellow: true,
        });
        setRow2Cells((c) => ({ ...c, labelVisible: true }));
        await delay(150);

        await flyFromQuestionToCell("fly-x", "row2X", { text: "2" });
        setRow2Cells((c) => ({ ...c, xVisible: true }));
        await delay(150);

        await flyFromQuestionToCell("fly-y", "row2Y", { text: "1" });
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
      setRevealXState({ mode: "result", text: "8", shown: true });
      setRevealYState({ mode: "result", text: "3", shown: true });
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

  useEffect(() => {
    if (step !== 3 || !step3To4Transition) {
      if (step !== 3) {
        step3TransitionStartedRef.current = false;
        setLeftPanelHiding(false);
        setLocateCellVisible(null);
        setTransitionFlyClones([]);
      }
      return;
    }
    if (step3TransitionStartedRef.current) return;
    step3TransitionStartedRef.current = true;

    setLocateCellVisible({ ...STEP3_TO4_HIDDEN });
    setLeftPanelHiding(false);
    setTransitionFlyClones([]);

    const flies = [
      {
        id: "fly-p-label",
        sourceKey: "row2Label",
        targetKey: "pLabel",
        text: APP_DATA.table.pointP,
        isYellow: true,
        revealKey: "pLabel",
      },
      {
        id: "fly-p-x",
        sourceKey: "row2X",
        targetKey: "pValue",
        text: "2",
        revealKey: "pValue",
        group: "pValue",
      },
      {
        id: "fly-p-y",
        sourceKey: "row2Y",
        targetKey: "pValue",
        text: "1",
        revealKey: "pValue",
        group: "pValue",
      },
      {
        id: "fly-t-label",
        sourceKey: "row3Label",
        targetKey: "transLabel",
        text: APP_DATA.table.translation,
        isYellow: true,
        revealKey: "transLabel",
      },
      {
        id: "fly-t-x",
        sourceKey: "row3X",
        targetKey: "transValue",
        text: "+6",
        revealKey: "transValue",
        group: "transValue",
      },
      {
        id: "fly-t-y",
        sourceKey: "row3Y",
        targetKey: "transValue",
        text: "+2",
        revealKey: "transValue",
        group: "transValue",
      },
      {
        id: "fly-pp-label",
        sourceKey: "row4Label",
        targetKey: "pprimeLabel",
        text: APP_DATA.table.pointPPrime,
        isYellow: true,
        revealKey: "pprimeLabel",
      },
      {
        id: "fly-pp-x",
        sourceKey: "revealX",
        targetKey: "pprimeValue",
        text: "8",
        revealKey: "pprimeValue",
        group: "pprimeValue",
      },
      {
        id: "fly-pp-y",
        sourceKey: "revealY",
        targetKey: "pprimeValue",
        text: "3",
        revealKey: "pprimeValue",
        group: "pprimeValue",
      },
    ];

    const groupCounts = {};
    flies.forEach((fly) => {
      if (fly.group) {
        groupCounts[fly.group] = (groupCounts[fly.group] || 0) + 1;
      }
    });
    const groupArrived = {};

    const markReveal = (fly) => {
      if (fly.group) {
        groupArrived[fly.group] = (groupArrived[fly.group] || 0) + 1;
        if (groupArrived[fly.group] >= groupCounts[fly.group]) {
          setLocateCellVisible((prev) => ({
            ...(prev || STEP3_TO4_HIDDEN),
            [fly.revealKey]: true,
          }));
        }
      } else {
        setLocateCellVisible((prev) => ({
          ...(prev || STEP3_TO4_HIDDEN),
          [fly.revealKey]: true,
        }));
      }
    };

    const runTransition = async () => {
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
      await delay(120);
      setLeftPanelHiding(true);

      await Promise.all(
        flies.map(async (fly) => {
          const sourceEl = cellRefs.current[fly.sourceKey];
          const targetEl = locateRefs.current[fly.targetKey];
          await animateTransitionFly(sourceEl, targetEl, {
            id: fly.id,
            text: fly.text,
            isYellow: fly.isYellow,
          });
          markReveal(fly);
        }),
      );

      setLocateCellVisible((prev) => ({
        ...(prev || STEP3_TO4_HIDDEN),
        title: true,
        feedback: true,
      }));
      await delay(250);

      if (typeof onStep3To4Complete === "function") {
        onStep3To4Complete();
      }
    };

    runTransition();
  }, [step, step3To4Transition, animateTransitionFly, onStep3To4Complete]);

  const runRevealAnimation = useCallback(
    async (axis) => {
      const isX = axis === "x";
      const setReveal = isX ? setRevealXState : setRevealYState;
      const baseVal = isX ? "2" : "1";
      const transVal = isX ? "6" : "2";
      const transFlyText = isX ? "+6" : "+2";
      const resultVal = isX ? "8" : "3";
      const sourceRow2 = isX ? "row2X" : "row2Y";
      const sourceRow3 = isX ? "row3X" : "row3Y";
      const targetBase = isX ? "revealX-base" : "revealY-base";
      const targetTrans = isX ? "revealX-trans" : "revealY-trans";

      const exprState = {
        mode: "expression",
        base: baseVal,
        trans: transVal,
        showBase: false,
        showPlus: false,
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
          ? { ...prev, showPlus: true, showTrans: true }
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
    [flyBetweenCells, onRevealComplete],
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

  const renderTransitionFlyClones = () =>
    transitionFlyClones.map((clone) =>
      React.createElement(
        "div",
        {
          key: clone.id,
          className:
            "fly-clone-text" +
            (clone.isYellow ? " is-yellow" : "") +
            (clone.animating ? " is-animating" : ""),
          style: {
            left: clone.startX + "px",
            top: clone.startY + "px",
            transform: clone.animating
              ? "translate(calc(-50% + " +
                clone.dx +
                "px), calc(-50% + " +
                clone.dy +
                "px))"
              : "translate(-50%, -50%)",
          },
        },
        clone.text,
      ),
    );

  const showDndPanel = step === 2 && step2Phase === "dnd";
  const inStep3To4Transition = step === 3 && step3To4Transition;
  const showRightInstruction = step === 3 && !step3To4Transition;
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

  if (step === 5 || step === 8) {
    return React.createElement(
      "div",
      { className: "main-canvas-container main-canvas-splash" },
      React.createElement(TextSplash, { content: splashText }),
    );
  }

  if (step === 10) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(TriangleDragGraphPanel, {
          vertices: step10Vertices || [],
          offset: step10Offset || { dx: 0, dy: 0 },
          figureColor: step10FigureColor || "#c9a0e8",
          dragEnabled: step10Phase === "drag" && !step10SnapBack,
          snapBackActive: step10SnapBack,
          onDragMove: onFigureDragMove,
          onFigureDrop: onFigureDrop,
          onSnapBackComplete: onStep10SnapBackComplete,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(FeedbackPanel, { feedback: feedback }),
      ),
    );
  }

  if (step === 9) {
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
          placedPoints: step9Placed || [],
          showGreenPolygon: step9Phase === "done",
          draggablePointId:
            step9Phase === "drag" && !step9WrongPoint
              ? step9CurrentPoint
              : null,
          vertexLabels: step9VertexLabels || {},
          wrongPoint: step9WrongPoint,
          onPointDrop: onPointDrop,
          onSnapBackComplete: onStep9SnapBackComplete,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(FeedbackPanel, { feedback: feedback }),
      ),
    );
  }

  if (step === 7) {
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

  if (step === 6) {
    return React.createElement(
      "div",
      { className: "main-canvas-container" },
      React.createElement(
        "div",
        { className: "main-canvas-left is-visible" },
        React.createElement(GraphPanel, {
          points: graphPoints || [],
          segments: graphSegments || [],
          onGridClick: onGridClick,
          interactive:
            step6Phase === "placeAPrime" || step6Phase === "placeBPrime",
          nudgeTarget: nudgeTarget,
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
          onGridClick: onGridClick,
          interactive: step4Phase === "placeP" || step4Phase === "placePPrime",
          nudgeTarget: nudgeTarget,
        }),
      ),
      React.createElement(
        "div",
        { className: "main-canvas-right is-visible" },
        React.createElement(LocatePanel, {
          title: locateTitle,
          highlightTarget: highlightTarget,
          feedback: feedback,
          titleBlink:
            step4Phase === "placeP" || step4Phase === "placePPrime",
          cellRefs: locateRefs.current,
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
          (leftVisible && !columnsHidden && !inStep3To4Transition
            ? " is-visible"
            : inStep3To4Transition && !leftPanelHiding
              ? " is-visible"
              : "") +
          (leftPanelHiding ? " is-hiding" : "") +
          (columnsHidden ? " is-hidden-step1" : ""),
      },
      step >= 2 && !inStep3To4Transition
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
        : inStep3To4Transition
          ? React.createElement(CoordinateTable, {
              step: 3,
              tableVisible: true,
              headerVisible: true,
              row3Ready: true,
              row4RevealReady: true,
              row2Cells: {
                labelVisible: true,
                xVisible: true,
                yVisible: true,
              },
              dndPlacements: dndPlacements,
              dndHoveredZone: hoveredZone,
              dndWrongZone: dndWrongZone,
              dndWrongItemId: dndWrongItemId,
              showDndGreen: false,
              revealXState: { mode: "result", text: "8", shown: true },
              revealYState: { mode: "result", text: "3", shown: true },
              onRevealX: function () {},
              onRevealY: function () {},
              cellRefs: cellRefs.current,
            })
          : null,
    ),
    React.createElement(
      "div",
      {
        className:
          "main-canvas-right" +
          (inStep3To4Transition
            ? " is-visible is-transition-panel"
            : rightVisible && !columnsHidden
              ? " is-visible"
              : "") +
          (columnsHidden ? " is-hidden-step1" : ""),
      },
      inStep3To4Transition
        ? React.createElement(LocatePanel, {
            title: locateTitle,
            highlightTarget: null,
            feedback: null,
            titleBlink: false,
            cellVisible: locateCellVisible || STEP3_TO4_HIDDEN,
            cellRefs: locateRefs.current,
          })
        : showDndPanel
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
    renderTransitionFlyClones(),
  );
};
