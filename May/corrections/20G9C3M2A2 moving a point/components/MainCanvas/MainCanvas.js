function renderCoordPair(leftParts) {
  return React.createElement(
    "span",
    { className: "action-coord action-coord-x" },
    React.createElement("span", null, "("),
    React.createElement("span", { className: "x-val" }, leftParts.x),
    React.createElement("span", null, ", " + leftParts.y + ")"),
  );
}

function renderCoordPairY(x, y) {
  return React.createElement(
    "span",
    { className: "action-coord action-coord-y" },
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
      { className: "action-coord action-coord-x" },
      React.createElement("span", null, "("),
      React.createElement("span", { className: "x-val" }, String(baseX + change)),
      React.createElement("span", null, ", " + y + ")"),
    );
  }
  const changeStr = change >= 0 ? "+" + change : "+(" + change + ")";
  return React.createElement(
    "span",
    { className: "action-coord action-coord-x" },
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
      { className: "action-coord action-coord-y" },
      React.createElement("span", null, "("),
      React.createElement("span", null, baseX + ", "),
      React.createElement("span", { className: "y-val" }, String(baseY + change)),
      React.createElement("span", null, ")"),
    );
  }
  const changeStr = change >= 0 ? "+" + change : "+(" + change + ")";
  return React.createElement(
    "span",
    { className: "action-coord action-coord-y" },
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

function renderFormulaLabel(text) {
  const parts = String(text || "").split(/('(?:a|b) (?:units|satuan)')/g);
  return parts.map((part, index) =>
    /^'(?:a|b) (?:units|satuan)'$/.test(part)
      ? React.createElement(
          "span",
          { key: index, className: "formula-label-unit" },
          part,
        )
      : part,
  );
}

function renderHorizontalFormulaBox(xaRef) {
  return React.createElement(
    "div",
    { className: "formula-row-box" },
    React.createElement(
      "span",
      { className: "formula-coord formula-coord-x" },
      React.createElement("span", null, "("),
      React.createElement("span", { className: "x-val" }, "x"),
      React.createElement("span", null, ", "),
      React.createElement("span", { className: "y-val" }, "y"),
      React.createElement("span", null, ")"),
    ),
    renderArrowBlock(null, "formula-arrow"),
    React.createElement(
      "span",
      { className: "formula-coord formula-coord-x" },
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
      { className: "formula-coord formula-coord-y" },
      React.createElement("span", null, "("),
      React.createElement("span", { className: "x-val" }, "x"),
      React.createElement("span", null, ", "),
      React.createElement("span", { className: "y-val" }, "y"),
      React.createElement("span", null, ")"),
    ),
    renderArrowBlock(null, "formula-arrow"),
    React.createElement(
      "span",
      { className: "formula-coord formula-coord-y" },
      React.createElement("span", null, "("),
      React.createElement("span", { className: "x-val" }, "x"),
      React.createElement("span", null, ", "),
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
    showSliderNudge,
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
    onStep1AnimationComplete,
    onStep2AnimationComplete,
    onStep3AnimationComplete,
    onStep4AnimationComplete,
    exploreH,
    exploreV,
    step6Dragging,
    step6LinePhase,
    step6BaseX,
    step6BaseY,
    step6HMin,
    step6HMax,
    step6VMin,
    step6VMax,
    step6PointDraggable,
    step6HasSliderInput,
    onExploreHChange,
    onExploreVChange,
    onExploreHDragStart,
    onExploreVDragStart,
    onExploreHRelease,
    onExploreVRelease,
    onStep6PointDragStart,
    onStep6PointChange,
    onStep6PointDragEnd,
  } = props;

  const row1XaRef = useRef(null);
  const row2YbRef = useRef(null);
  const row3XaRef = useRef(null);
  const row3YbRef = useRef(null);
  const combineAnimStartedRef = useRef(false);
  const step1AnimStartedRef = useRef(false);
  const step2AnimStartedRef = useRef(false);
  const step3AnimStartedRef = useRef(false);
  const step4AnimStartedRef = useRef(false);

  const step1ActionCoordRef = useRef(null);
  const step1ActionArrowLabelRef = useRef(null);
  const step1ActionImageXRef = useRef(null);
  const step1ActionImageChangeRef = useRef(null);
  const step1ActionImageYRef = useRef(null);
  const step2ActionCoordRef = useRef(null);
  const step2ActionArrowLabelRef = useRef(null);
  const step2ActionImageXRef = useRef(null);
  const step2ActionImageChangeRef = useRef(null);
  const step2ActionImageYRef = useRef(null);
  const step3ActionCoordRef = useRef(null);
  const step3ActionArrowLabelRef = useRef(null);
  const step3ActionImageXRef = useRef(null);
  const step3ActionImageChangeRef = useRef(null);
  const step3ActionImageYRef = useRef(null);
  const step4ActionCoordRef = useRef(null);
  const step4ActionArrowLabelRef = useRef(null);
  const step4ActionImageXRef = useRef(null);
  const step4ActionImageChangeRef = useRef(null);
  const step4ActionImageYRef = useRef(null);

  const [showCombinedLeft, setShowCombinedLeft] = useState(false);
  const [showCombinedArrow, setShowCombinedArrow] = useState(false);
  const [showCombinedXa, setShowCombinedXa] = useState(false);
  const [showCombinedYb, setShowCombinedYb] = useState(false);
  const [showCombinedArrowLabel, setShowCombinedArrowLabel] = useState(false);
  const [flyClone, setFlyClone] = useState(null);
  const [step1GraphPhase, setStep1GraphPhase] = useState("step1-shell");
  const [step2GraphPhase, setStep2GraphPhase] = useState("step2-shell");
  const [step3GraphPhase, setStep3GraphPhase] = useState("step3-shell");
  const [step4GraphPhase, setStep4GraphPhase] = useState("step4-shell");
  const [step1ActionPrepared, setStep1ActionPrepared] = useState(false);
  const [step1ActionVisible, setStep1ActionVisible] = useState({
    object: false,
    arrowLabel: false,
    arrow: false,
    imageShell: false,
    imageX: false,
    imageChange: false,
    imageY: false,
  });
  const [step2ActionPrepared, setStep2ActionPrepared] = useState(false);
  const [step2ActionVisible, setStep2ActionVisible] = useState({
    object: false,
    arrowLabel: false,
    arrow: false,
    imageShell: false,
    imageX: false,
    imageChange: false,
    imageY: false,
  });
  const [step3ActionPrepared, setStep3ActionPrepared] = useState(false);
  const [step3ActionVisible, setStep3ActionVisible] = useState({
    object: false,
    arrowLabel: false,
    arrow: false,
    imageShell: false,
    imageX: false,
    imageChange: false,
    imageY: false,
  });
  const [step4ActionPrepared, setStep4ActionPrepared] = useState(false);
  const [step4ActionVisible, setStep4ActionVisible] = useState({
    object: false,
    arrowLabel: false,
    arrow: false,
    imageShell: false,
    imageX: false,
    imageChange: false,
    imageY: false,
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const STEP1_GAP = 400;
  const STEP1_SHORT_WAIT = 300;
  const STEP1_FLY_DURATION = 1000;
  const STEP2_SIMPLIFY_FADE = 380;
  const STEP2_SIMPLIFY_GAP = 500;

  const resetCombineAnim = () => {
    combineAnimStartedRef.current = false;
    setShowCombinedLeft(false);
    setShowCombinedArrow(false);
    setShowCombinedXa(false);
    setShowCombinedYb(false);
    setShowCombinedArrowLabel(false);
    setFlyClone(null);
  };

  const resetStep1Anim = () => {
    step1AnimStartedRef.current = false;
    setStep1GraphPhase("step1-shell");
    setStep1ActionPrepared(false);
    setStep1ActionVisible({
      object: false,
      arrowLabel: false,
      arrow: false,
      imageShell: false,
      imageX: false,
      imageChange: false,
      imageY: false,
    });
    setFlyClone(null);
  };

  const resetStep2Anim = () => {
    step2AnimStartedRef.current = false;
    setStep2GraphPhase("step2-shell");
    setStep2ActionPrepared(false);
    setStep2ActionVisible({
      object: false,
      arrowLabel: false,
      arrow: false,
      imageShell: false,
      imageX: false,
      imageChange: false,
      imageY: false,
    });
    setFlyClone(null);
  };

  const resetStep3Anim = () => {
    step3AnimStartedRef.current = false;
    setStep3GraphPhase("step3-shell");
    setStep3ActionPrepared(false);
    setStep3ActionVisible({
      object: false,
      arrowLabel: false,
      arrow: false,
      imageShell: false,
      imageX: false,
      imageChange: false,
      imageY: false,
    });
    setFlyClone(null);
  };

  const resetStep4Anim = () => {
    step4AnimStartedRef.current = false;
    setStep4GraphPhase("step4-shell");
    setStep4ActionPrepared(false);
    setStep4ActionVisible({
      object: false,
      arrowLabel: false,
      arrow: false,
      imageShell: false,
      imageX: false,
      imageChange: false,
      imageY: false,
    });
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

  const animateFlyBetweenElements = (sourceEl, targetEl, content, className) => {
    return new Promise((resolve) => {
      if (!sourceEl || !targetEl) {
        resolve();
        return;
      }

      const src = sourceEl.getBoundingClientRect();
      const tgt = targetEl.getBoundingClientRect();
      const dx = tgt.left - src.left;
      const dy = tgt.top - src.top;

      setFlyClone({
        content,
        className,
        startX: src.left,
        startY: src.top,
        dx,
        dy,
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
      }, STEP1_FLY_DURATION);
    });
  };

  const getByRole = (role) => document.querySelector('[data-role="' + role + '"]');

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

  useEffect(() => {
    if (step !== 1) {
      resetStep1Anim();
      return;
    }

    if (step1Phase === "initial") {
      resetStep1Anim();
      return;
    }

    if (step1Phase === "done") {
      setStep1GraphPhase("merged");
      setStep1ActionPrepared(true);
      setStep1ActionVisible({
        object: true,
        arrowLabel: true,
        arrow: true,
        imageShell: true,
        imageX: true,
        imageChange: true,
        imageY: true,
      });
      return;
    }

    if (step1Phase !== "animating" || step1AnimStartedRef.current) return;

    step1AnimStartedRef.current = true;

    const runStep1Sequence = async () => {
      const snappedText = step1Snapped > 0 ? "+" + step1Snapped : String(step1Snapped);

      setStep1GraphPhase("step1-shell");
      await delay(STEP1_GAP);

      await animateFlyBetweenElements(
        getByRole("graph-static-x"),
        getByRole("graph-dynamic-x"),
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep1GraphPhase("step1-x");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        getByRole("graph-dynamic-change"),
        React.createElement("span", { className: "change-val" }, snappedText),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep1GraphPhase("step1-xchange");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-static-y"),
        getByRole("graph-dynamic-y"),
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep1GraphPhase("step1-expression");

      await delay(STEP1_SHORT_WAIT);
      setStep1GraphPhase("step1-expression-fade");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep1GraphPhase("merged-fade-in");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep1GraphPhase("merged");

      await delay(STEP1_SHORT_WAIT);
      setStep1ActionPrepared(true);
      await delay(80);

      await animateFlyBetweenElements(
        getByRole("graph-static-coord"),
        step1ActionCoordRef.current,
        React.createElement(
          "span",
          { className: "action-coord" },
          React.createElement("span", null, "("),
          React.createElement("span", { className: "x-val" }, String(BASE_X)),
          React.createElement("span", null, ", "),
          React.createElement("span", { className: "y-val" }, String(BASE_Y)),
          React.createElement("span", null, ")"),
        ),
        "step1-fly-clone action-coord",
      );
      setStep1ActionVisible((prev) => ({ ...prev, object: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        step1ActionArrowLabelRef.current,
        React.createElement("span", { className: "change-val" }, snappedText),
        "step1-fly-clone",
      );
      setStep1ActionVisible((prev) => ({ ...prev, arrowLabel: true }));

      await delay(STEP1_GAP);
      setStep1ActionVisible((prev) => ({ ...prev, arrow: true }));

      await delay(STEP1_GAP);
      setStep1ActionVisible((prev) => ({ ...prev, imageShell: true }));
      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step1ActionCoordRef.current
          ? step1ActionCoordRef.current.querySelector('[data-role="action-object-x"]')
          : null,
        step1ActionImageXRef.current,
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone action-coord",
      );
      setStep1ActionVisible((prev) => ({ ...prev, imageX: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step1ActionArrowLabelRef.current,
        step1ActionImageChangeRef.current,
        React.createElement("span", { className: "change-val" }, snappedText),
        "step1-fly-clone action-coord",
      );
      setStep1ActionVisible((prev) => ({ ...prev, imageChange: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step1ActionCoordRef.current
          ? step1ActionCoordRef.current.querySelector('[data-role="action-object-y"]')
          : null,
        step1ActionImageYRef.current,
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone action-coord",
      );
      setStep1ActionVisible((prev) => ({ ...prev, imageY: true }));

      if (typeof onStep1AnimationComplete === "function") {
        onStep1AnimationComplete();
      }
    };

    runStep1Sequence();
  }, [step, step1Phase, step1Snapped, onStep1AnimationComplete]);

  useEffect(() => {
    if (step !== 2) {
      resetStep2Anim();
      return;
    }

    if (step2Phase === "initial") {
      resetStep2Anim();
      return;
    }

    if (step2Phase === "done" || step2Phase === "ruleShown" || step2Phase === "animating") {
      setStep2GraphPhase("merged");
      setStep2ActionPrepared(true);
      setStep2ActionVisible({
        object: true,
        arrowLabel: true,
        arrow: true,
        imageShell: true,
        imageX: true,
        imageChange: true,
        imageY: true,
      });
      return;
    }

    if (step2Phase !== "building" || step2AnimStartedRef.current) return;

    step2AnimStartedRef.current = true;

    const runStep2Sequence = async () => {
      const snappedText = String(step2Snapped);

      setStep2GraphPhase("step2-shell");
      await delay(STEP1_GAP);

      await animateFlyBetweenElements(
        getByRole("graph-static-x"),
        getByRole("graph-dynamic-x"),
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep2GraphPhase("step2-x");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        getByRole("graph-dynamic-change"),
        React.createElement("span", { className: "change-val" }, snappedText),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep2GraphPhase("step2-xchange");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-static-y"),
        getByRole("graph-dynamic-y"),
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep2GraphPhase("step2-expression");

      await delay(STEP1_SHORT_WAIT);
      setStep2GraphPhase("step2-expression-fade");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep2GraphPhase("minus-fade");
      await delay(80);
      setStep2GraphPhase("minus");

      await delay(STEP2_SIMPLIFY_GAP);
      setStep2GraphPhase("minus-fade");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep2GraphPhase("merged-fade");
      await delay(80);
      setStep2GraphPhase("merged");

      await delay(STEP2_SIMPLIFY_GAP);
      setStep2ActionPrepared(true);
      await delay(80);

      await animateFlyBetweenElements(
        getByRole("graph-static-coord"),
        step2ActionCoordRef.current,
        React.createElement(
          "span",
          { className: "action-coord" },
          React.createElement("span", null, "("),
          React.createElement("span", { className: "x-val" }, String(BASE_X)),
          React.createElement("span", null, ", "),
          React.createElement("span", { className: "y-val" }, String(BASE_Y)),
          React.createElement("span", null, ")"),
        ),
        "step1-fly-clone action-coord",
      );
      setStep2ActionVisible((prev) => ({ ...prev, object: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        step2ActionArrowLabelRef.current,
        React.createElement("span", { className: "change-val" }, snappedText),
        "step1-fly-clone",
      );
      setStep2ActionVisible((prev) => ({ ...prev, arrowLabel: true }));

      await delay(STEP1_GAP);
      setStep2ActionVisible((prev) => ({ ...prev, arrow: true }));

      await delay(STEP1_GAP);
      setStep2ActionVisible((prev) => ({ ...prev, imageShell: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step2ActionCoordRef.current
          ? step2ActionCoordRef.current.querySelector('[data-role="action-object-x"]')
          : null,
        step2ActionImageXRef.current,
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone action-coord",
      );
      setStep2ActionVisible((prev) => ({ ...prev, imageX: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step2ActionArrowLabelRef.current,
        step2ActionImageChangeRef.current,
        React.createElement("span", { className: "change-val" }, snappedText),
        "step1-fly-clone action-coord",
      );
      setStep2ActionVisible((prev) => ({ ...prev, imageChange: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step2ActionCoordRef.current
          ? step2ActionCoordRef.current.querySelector('[data-role="action-object-y"]')
          : null,
        step2ActionImageYRef.current,
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone action-coord",
      );
      setStep2ActionVisible((prev) => ({ ...prev, imageY: true }));

      if (typeof onStep2AnimationComplete === "function") {
        onStep2AnimationComplete();
      }
    };

    runStep2Sequence();
  }, [step, step2Phase, step2Snapped, onStep2AnimationComplete]);

  useEffect(() => {
    if (step !== 3) {
      resetStep3Anim();
      return;
    }

    if (step3Phase === "initial") {
      resetStep3Anim();
      return;
    }

    if (step3Phase === "done") {
      setStep3GraphPhase("merged");
      setStep3ActionPrepared(true);
      setStep3ActionVisible({
        object: true,
        arrowLabel: true,
        arrow: true,
        imageShell: true,
        imageX: true,
        imageChange: true,
        imageY: true,
      });
      return;
    }

    if (step3Phase !== "building" || step3AnimStartedRef.current) return;

    step3AnimStartedRef.current = true;

    const runStep3Sequence = async () => {
      const snappedText = step3Snapped > 0 ? "+" + step3Snapped : String(step3Snapped);

      setStep3GraphPhase("step3-shell");
      await delay(STEP1_GAP);

      await animateFlyBetweenElements(
        getByRole("graph-static-x"),
        getByRole("graph-dynamic-x"),
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep3GraphPhase("step3-x");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-static-y"),
        getByRole("graph-dynamic-y"),
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep3GraphPhase("step3-y");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        getByRole("graph-dynamic-change-y"),
        React.createElement("span", { className: "change-val-y" }, snappedText),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep3GraphPhase("step3-expression");

      await delay(STEP1_SHORT_WAIT);
      setStep3GraphPhase("step3-expression-fade");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep3GraphPhase("merged-fade-in");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep3GraphPhase("merged");

      await delay(STEP1_SHORT_WAIT);
      setStep3ActionPrepared(true);
      await delay(80);

      await animateFlyBetweenElements(
        getByRole("graph-static-coord"),
        step3ActionCoordRef.current,
        React.createElement(
          "span",
          { className: "action-coord" },
          React.createElement("span", null, "("),
          React.createElement("span", { className: "x-val" }, String(BASE_X)),
          React.createElement("span", null, ", "),
          React.createElement("span", { className: "y-val" }, String(BASE_Y)),
          React.createElement("span", null, ")"),
        ),
        "step1-fly-clone action-coord",
      );
      setStep3ActionVisible((prev) => ({ ...prev, object: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        step3ActionArrowLabelRef.current,
        React.createElement("span", { className: "change-val-y" }, snappedText),
        "step1-fly-clone",
      );
      setStep3ActionVisible((prev) => ({ ...prev, arrowLabel: true }));

      await delay(STEP1_GAP);
      setStep3ActionVisible((prev) => ({ ...prev, arrow: true }));

      await delay(STEP1_GAP);
      setStep3ActionVisible((prev) => ({ ...prev, imageShell: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step3ActionCoordRef.current
          ? step3ActionCoordRef.current.querySelector('[data-role="action-object-x"]')
          : null,
        step3ActionImageXRef.current,
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone action-coord",
      );
      setStep3ActionVisible((prev) => ({ ...prev, imageX: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step3ActionCoordRef.current
          ? step3ActionCoordRef.current.querySelector('[data-role="action-object-y"]')
          : null,
        step3ActionImageYRef.current,
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone action-coord",
      );
      setStep3ActionVisible((prev) => ({ ...prev, imageY: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step3ActionArrowLabelRef.current,
        step3ActionImageChangeRef.current,
        React.createElement("span", { className: "change-val-y" }, snappedText),
        "step1-fly-clone action-coord",
      );
      setStep3ActionVisible((prev) => ({ ...prev, imageChange: true }));

      if (typeof onStep3AnimationComplete === "function") {
        onStep3AnimationComplete();
      }
    };

    runStep3Sequence();
  }, [step, step3Phase, step3Snapped, onStep3AnimationComplete]);

  useEffect(() => {
    if (step !== 4) {
      resetStep4Anim();
      return;
    }

    if (step4Phase === "initial") {
      resetStep4Anim();
      return;
    }

    if (step4Phase === "done" || step4Phase === "ruleShown" || step4Phase === "animating") {
      setStep4GraphPhase("merged");
      setStep4ActionPrepared(true);
      setStep4ActionVisible({
        object: true,
        arrowLabel: true,
        arrow: true,
        imageShell: true,
        imageX: true,
        imageChange: true,
        imageY: true,
      });
      return;
    }

    if (step4Phase !== "building" || step4AnimStartedRef.current) return;

    step4AnimStartedRef.current = true;

    const runStep4Sequence = async () => {
      const snappedText = String(step4Snapped);

      setStep4GraphPhase("step4-shell");
      await delay(STEP1_GAP);

      await animateFlyBetweenElements(
        getByRole("graph-static-x"),
        getByRole("graph-dynamic-x"),
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep4GraphPhase("step4-x");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-static-y"),
        getByRole("graph-dynamic-y"),
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep4GraphPhase("step4-y");

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        getByRole("graph-dynamic-change-y"),
        React.createElement("span", { className: "change-val-y" }, snappedText),
        "step1-fly-clone step1-graph-fly-clone action-coord",
      );
      setStep4GraphPhase("step4-expression");

      await delay(STEP1_SHORT_WAIT);
      setStep4GraphPhase("step4-expression-fade");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep4GraphPhase("minus-fade");
      await delay(80);
      setStep4GraphPhase("minus");

      await delay(STEP2_SIMPLIFY_GAP);
      setStep4GraphPhase("minus-fade");
      await delay(STEP2_SIMPLIFY_FADE);
      setStep4GraphPhase("merged-fade");
      await delay(80);
      setStep4GraphPhase("merged");

      await delay(STEP2_SIMPLIFY_GAP);
      setStep4ActionPrepared(true);
      await delay(80);

      await animateFlyBetweenElements(
        getByRole("graph-static-coord"),
        step4ActionCoordRef.current,
        React.createElement(
          "span",
          { className: "action-coord" },
          React.createElement("span", null, "("),
          React.createElement("span", { className: "x-val" }, String(BASE_X)),
          React.createElement("span", null, ", "),
          React.createElement("span", { className: "y-val" }, String(BASE_Y)),
          React.createElement("span", null, ")"),
        ),
        "step1-fly-clone action-coord",
      );
      setStep4ActionVisible((prev) => ({ ...prev, object: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        getByRole("graph-distance-label"),
        step4ActionArrowLabelRef.current,
        React.createElement("span", { className: "change-val-y" }, snappedText),
        "step1-fly-clone",
      );
      setStep4ActionVisible((prev) => ({ ...prev, arrowLabel: true }));

      await delay(STEP1_GAP);
      setStep4ActionVisible((prev) => ({ ...prev, arrow: true }));

      await delay(STEP1_GAP);
      setStep4ActionVisible((prev) => ({ ...prev, imageShell: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step4ActionCoordRef.current
          ? step4ActionCoordRef.current.querySelector('[data-role="action-object-x"]')
          : null,
        step4ActionImageXRef.current,
        React.createElement("span", { className: "x-val" }, String(BASE_X)),
        "step1-fly-clone action-coord",
      );
      setStep4ActionVisible((prev) => ({ ...prev, imageX: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step4ActionCoordRef.current
          ? step4ActionCoordRef.current.querySelector('[data-role="action-object-y"]')
          : null,
        step4ActionImageYRef.current,
        React.createElement("span", { className: "y-val" }, String(BASE_Y)),
        "step1-fly-clone action-coord",
      );
      setStep4ActionVisible((prev) => ({ ...prev, imageY: true }));

      await delay(STEP1_GAP);
      await animateFlyBetweenElements(
        step4ActionArrowLabelRef.current,
        step4ActionImageChangeRef.current,
        React.createElement("span", { className: "change-val-y" }, snappedText),
        "step1-fly-clone action-coord",
      );
      setStep4ActionVisible((prev) => ({ ...prev, imageChange: true }));

      if (typeof onStep4AnimationComplete === "function") {
        onStep4AnimationComplete();
      }
    };

    runStep4Sequence();
  }, [step, step4Phase, step4Snapped, onStep4AnimationComplete]);

  const BASE_X = 3;
  const BASE_Y = 3;

  const renderStep1AnimatedRow = () => {
    const arrowLabel = APP_DATA.steps[1].unitsRight.replace(
      "{n}",
      String(Math.abs(step1Snapped)),
    );
    return React.createElement(
      "div",
      {
        className:
          "action-row action-row-step1" + (step1ActionPrepared ? " is-prepared" : ""),
      },
      React.createElement(
        "span",
        {
          ref: step1ActionCoordRef,
          className:
            "action-coord action-coord-x staged-action-part" +
            (step1ActionVisible.object ? " is-visible" : ""),
        },
        React.createElement("span", null, "("),
        React.createElement(
          "span",
          { className: "x-val", "data-role": "action-object-x" },
          String(BASE_X),
        ),
        React.createElement("span", null, ", "),
        React.createElement(
          "span",
          { className: "y-val", "data-role": "action-object-y" },
          String(BASE_Y),
        ),
        React.createElement("span", null, ")"),
      ),
      React.createElement(
        "div",
        {
          className:
            "action-arrow-block staged-arrow-block" +
            (step1ActionVisible.arrow ? " is-visible" : ""),
        },
        React.createElement(
          "span",
          {
            ref: step1ActionArrowLabelRef,
            className:
              "action-arrow-label staged-action-part" +
              (step1ActionVisible.arrowLabel ? " is-visible" : ""),
          },
          arrowLabel,
        ),
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
      ),
      React.createElement(
        "span",
        { className: "action-coord action-coord-x" },
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step1ActionVisible.imageShell ? " is-visible" : ""),
          },
          "(",
        ),
        React.createElement(
          "span",
          {
            ref: step1ActionImageXRef,
            className:
              "x-val staged-action-part" +
              (step1ActionVisible.imageX ? " is-visible" : ""),
          },
          String(BASE_X),
        ),
        React.createElement(
          "span",
          {
            ref: step1ActionImageChangeRef,
            className:
              "change-val staged-action-part" +
              (step1ActionVisible.imageChange ? " is-visible" : ""),
          },
          "+" + step1Snapped,
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step1ActionVisible.imageShell ? " is-visible" : ""),
          },
          ", ",
        ),
        React.createElement(
          "span",
          {
            ref: step1ActionImageYRef,
            className:
              "y-val staged-action-part" +
              (step1ActionVisible.imageY ? " is-visible" : ""),
          },
          String(BASE_Y),
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step1ActionVisible.imageShell ? " is-visible" : ""),
          },
          ")",
        ),
      ),
    );
  };

  const renderStep2AnimatedRow = () => {
    const arrowLabel = APP_DATA.steps[2].unitsLeft.replace(
      "{n}",
      String(Math.abs(step2Snapped)),
    );

    return React.createElement(
      "div",
      {
        className:
          "action-row action-row-step1" + (step2ActionPrepared ? " is-prepared" : ""),
        key: "row-left",
      },
      React.createElement(
        "span",
        {
          ref: step2ActionCoordRef,
          className:
            "action-coord action-coord-x staged-action-part" +
            (step2ActionVisible.object ? " is-visible" : ""),
        },
        React.createElement("span", null, "("),
        React.createElement(
          "span",
          { className: "x-val", "data-role": "action-object-x" },
          String(BASE_X),
        ),
        React.createElement("span", null, ", "),
        React.createElement(
          "span",
          { className: "y-val", "data-role": "action-object-y" },
          String(BASE_Y),
        ),
        React.createElement("span", null, ")"),
      ),
      React.createElement(
        "div",
        {
          className:
            "action-arrow-block staged-arrow-block" +
            (step2ActionVisible.arrow ? " is-visible" : ""),
        },
        React.createElement(
          "span",
          {
            ref: step2ActionArrowLabelRef,
            className:
              "action-arrow-label staged-action-part" +
              (step2ActionVisible.arrowLabel ? " is-visible" : ""),
          },
          arrowLabel,
        ),
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
      ),
      React.createElement(
        "span",
        { className: "action-coord action-coord-x" },
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step2ActionVisible.imageShell ? " is-visible" : ""),
          },
          "(",
        ),
        React.createElement(
          "span",
          {
            ref: step2ActionImageXRef,
            className:
              "x-val staged-action-part" +
              (step2ActionVisible.imageX ? " is-visible" : ""),
          },
          String(BASE_X),
        ),
        React.createElement(
          "span",
          {
            className:
              "change-val staged-action-part" +
              (step2ActionVisible.imageChange ? " is-visible" : ""),
          },
          "+(",
        ),
        React.createElement(
          "span",
          {
            ref: step2ActionImageChangeRef,
            className:
              "change-val staged-action-part" +
              (step2ActionVisible.imageChange ? " is-visible" : ""),
          },
          String(step2Snapped),
        ),
        React.createElement(
          "span",
          {
            className:
              "change-val staged-action-part" +
              (step2ActionVisible.imageChange ? " is-visible" : ""),
          },
          ")",
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step2ActionVisible.imageShell ? " is-visible" : ""),
          },
          ", ",
        ),
        React.createElement(
          "span",
          {
            ref: step2ActionImageYRef,
            className:
              "y-val staged-action-part" +
              (step2ActionVisible.imageY ? " is-visible" : ""),
          },
          String(BASE_Y),
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step2ActionVisible.imageShell ? " is-visible" : ""),
          },
          ")",
        ),
      ),
    );
  };

  const renderStep3AnimatedRow = () => {
    const arrowLabel = APP_DATA.steps[3].unitsUp.replace(
      "{n}",
      String(Math.abs(step3Snapped)),
    );

    return React.createElement(
      "div",
      {
        className:
          "action-row action-row-step1" + (step3ActionPrepared ? " is-prepared" : ""),
      },
      React.createElement(
        "span",
        {
          ref: step3ActionCoordRef,
          className:
            "action-coord action-coord-y staged-action-part" +
            (step3ActionVisible.object ? " is-visible" : ""),
        },
        React.createElement("span", null, "("),
        React.createElement(
          "span",
          { className: "x-val", "data-role": "action-object-x" },
          String(BASE_X),
        ),
        React.createElement("span", null, ", "),
        React.createElement(
          "span",
          { className: "y-val", "data-role": "action-object-y" },
          String(BASE_Y),
        ),
        React.createElement("span", null, ")"),
      ),
      React.createElement(
        "div",
        {
          className:
            "action-arrow-block staged-arrow-block" +
            (step3ActionVisible.arrow ? " is-visible" : ""),
        },
        React.createElement(
          "span",
          {
            ref: step3ActionArrowLabelRef,
            className:
              "action-arrow-label staged-action-part" +
              (step3ActionVisible.arrowLabel ? " is-visible" : ""),
          },
          arrowLabel,
        ),
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
      ),
      React.createElement(
        "span",
        { className: "action-coord action-coord-y" },
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step3ActionVisible.imageShell ? " is-visible" : ""),
          },
          "(",
        ),
        React.createElement(
          "span",
          {
            ref: step3ActionImageXRef,
            className:
              "x-val staged-action-part" +
              (step3ActionVisible.imageX ? " is-visible" : ""),
          },
          String(BASE_X),
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step3ActionVisible.imageShell ? " is-visible" : ""),
          },
          ", ",
        ),
        React.createElement(
          "span",
          {
            ref: step3ActionImageYRef,
            className:
              "y-val staged-action-part" +
              (step3ActionVisible.imageY ? " is-visible" : ""),
          },
          String(BASE_Y),
        ),
        React.createElement(
          "span",
          {
            ref: step3ActionImageChangeRef,
            className:
              "change-val-y staged-action-part" +
              (step3ActionVisible.imageChange ? " is-visible" : ""),
          },
          "+" + step3Snapped,
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step3ActionVisible.imageShell ? " is-visible" : ""),
          },
          ")",
        ),
      ),
    );
  };

  const renderStep4AnimatedRow = () => {
    const arrowLabel = APP_DATA.steps[4].unitsDown.replace(
      "{n}",
      String(Math.abs(step4Snapped)),
    );

    return React.createElement(
      "div",
      {
        className:
          "action-row action-row-step1" + (step4ActionPrepared ? " is-prepared" : ""),
        key: "row-down",
      },
      React.createElement(
        "span",
        {
          ref: step4ActionCoordRef,
          className:
            "action-coord action-coord-y staged-action-part" +
            (step4ActionVisible.object ? " is-visible" : ""),
        },
        React.createElement("span", null, "("),
        React.createElement(
          "span",
          { className: "x-val", "data-role": "action-object-x" },
          String(BASE_X),
        ),
        React.createElement("span", null, ", "),
        React.createElement(
          "span",
          { className: "y-val", "data-role": "action-object-y" },
          String(BASE_Y),
        ),
        React.createElement("span", null, ")"),
      ),
      React.createElement(
        "div",
        {
          className:
            "action-arrow-block staged-arrow-block" +
            (step4ActionVisible.arrow ? " is-visible" : ""),
        },
        React.createElement(
          "span",
          {
            ref: step4ActionArrowLabelRef,
            className:
              "action-arrow-label staged-action-part" +
              (step4ActionVisible.arrowLabel ? " is-visible" : ""),
          },
          arrowLabel,
        ),
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
      ),
      React.createElement(
        "span",
        { className: "action-coord action-coord-y" },
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step4ActionVisible.imageShell ? " is-visible" : ""),
          },
          "(",
        ),
        React.createElement(
          "span",
          {
            ref: step4ActionImageXRef,
            className:
              "x-val staged-action-part" +
              (step4ActionVisible.imageX ? " is-visible" : ""),
          },
          String(BASE_X),
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step4ActionVisible.imageShell ? " is-visible" : ""),
          },
          ", ",
        ),
        React.createElement(
          "span",
          {
            ref: step4ActionImageYRef,
            className:
              "y-val staged-action-part" +
              (step4ActionVisible.imageY ? " is-visible" : ""),
          },
          String(BASE_Y),
        ),
        React.createElement(
          "span",
          {
            className:
              "change-val-y staged-action-part" +
              (step4ActionVisible.imageChange ? " is-visible" : ""),
          },
          "+(",
        ),
        React.createElement(
          "span",
          {
            ref: step4ActionImageChangeRef,
            className:
              "change-val-y staged-action-part" +
              (step4ActionVisible.imageChange ? " is-visible" : ""),
          },
          String(step4Snapped),
        ),
        React.createElement(
          "span",
          {
            className:
              "change-val-y staged-action-part" +
              (step4ActionVisible.imageChange ? " is-visible" : ""),
          },
          ")",
        ),
        React.createElement(
          "span",
          {
            className:
              "staged-action-part" +
              (step4ActionVisible.imageShell ? " is-visible" : ""),
          },
          ")",
        ),
      ),
    );
  };

  const renderActionColumn = () => {
    if (step === 1 && (step1Phase === "animating" || step1Phase === "done")) {
      return renderStep1AnimatedRow();
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
        step2Phase === "animating" ||
        step2Phase === "building"
      ) {
        rows.push(
          step2Phase === "building"
            ? renderStep2AnimatedRow()
            : React.createElement(
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
            React.createElement(
              "div",
              { className: "rule-then-row" },
              React.createElement("p", { className: "rule-intro rule-then-label" }, s2.ruleThen),
            React.createElement(
              "div",
              { className: "rule-formula-box rule-formula-x" },
              React.createElement("span", null, "("),
              React.createElement("span", { className: "x-val" }, "x"),
              React.createElement("span", null, ", "),
              React.createElement("span", { className: "y-val" }, "y"),
              React.createElement("span", null, ") → ("),
              React.createElement("span", { className: "x-val" }, "x"),
              React.createElement("span", { className: "change-val" }, "+a"),
              React.createElement("span", null, ", "),
              React.createElement("span", { className: "y-val" }, "y"),
              React.createElement("span", null, ")"),
              ),
            ),
          ),
        );
      }

      return rows.length ? rows : null;
    }

    if (step === 3 && (step3Phase === "building" || step3Phase === "done")) {
      const s3 = APP_DATA.steps[3];
      return step3Phase === "building"
        ? renderStep3AnimatedRow()
        : React.createElement(
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
        step4Phase === "animating" ||
        step4Phase === "building"
      ) {
        rows.push(
          step4Phase === "building"
            ? renderStep4AnimatedRow()
            : React.createElement(
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
            React.createElement(
              "div",
              { className: "rule-then-row" },
              React.createElement("p", { className: "rule-intro rule-then-label" }, s4.ruleThen),
            React.createElement(
              "div",
              { className: "rule-formula-box rule-formula-y" },
              React.createElement("span", null, "("),
              React.createElement("span", { className: "x-val" }, "x"),
              React.createElement("span", null, ", "),
              React.createElement("span", { className: "y-val" }, "y"),
              React.createElement("span", null, ") → ("),
              React.createElement("span", { className: "x-val" }, "x"),
              React.createElement("span", null, ", "),
              React.createElement("span", { className: "y-val" }, "y"),
              React.createElement("span", { className: "change-val-y" }, "+b"),
              React.createElement("span", null, ")"),
              ),
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
    step === 1 && step1Phase === "animating"
      ? step1GraphPhase
      : step === 2 && step2Phase === "building"
        ? step2GraphPhase
      : step === 3 && step3Phase === "building"
        ? step3GraphPhase
      : step === 4 && step4Phase === "building"
        ? step4GraphPhase
      : symbolicMode && (step2Phase === "ruleShown" || step4Phase === "ruleShown")
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
  const useEdgeCoordBox =
    step === 1 ||
    (step === 2 &&
      step2Phase !== "animating" &&
      step2Phase !== "ruleShown");

  const renderFormulaColumn = () => {
    const s5 = APP_DATA.steps[5];

    return React.createElement(
      "div",
      { className: "formula-column" },
      React.createElement(
        "div",
        { className: "formula-row" },
        React.createElement(
          "p",
          { className: "formula-row-label" },
          renderFormulaLabel(s5.horizontalLabel),
        ),
        renderHorizontalFormulaBox(row1XaRef),
      ),
      React.createElement(
        "div",
        { className: "formula-row" },
        React.createElement(
          "p",
          { className: "formula-row-label" },
          renderFormulaLabel(s5.verticalLabel),
        ),
        renderVerticalFormulaBox(row2YbRef),
      ),
      React.createElement(
        "div",
        { className: "formula-row formula-row-combined" },
        step5Phase === "initial"
          ? null
          : React.createElement(
              "p",
              { className: "formula-row-label" },
              renderFormulaLabel(s5.combinedLabel),
            ),
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
                    "formula-coord formula-coord-xy combined-part combined-left" +
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
                { className: "formula-coord formula-coord-xy combined-dest" },
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
    const flyAxisClass =
      step === 1 || step === 2
        ? " action-coord-x"
        : step === 3 || step === 4
          ? " action-coord-y"
          : step === 5 && flyClone.type === "xa"
            ? " formula-coord-x"
            : step === 5 && flyClone.type === "yb"
              ? " formula-coord-y"
              : "";
    const content =
      flyClone.content
        ? flyClone.content
        : flyClone.type === "xa"
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
        className:
          "fly-clone formula-coord" +
          flyAxisClass +
          (flyClone.className ? " " + flyClone.className : ""),
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
        baseX: step6BaseX,
        baseY: step6BaseY,
        hValue: exploreH,
        vValue: exploreV,
        hMin: step6HMin,
        hMax: step6HMax,
        vMin: step6VMin,
        vMax: step6VMax,
        isDragging: step6Dragging,
        linePhase: step6LinePhase,
        pointDraggable: step6PointDraggable,
        hasSliderInteraction: step6HasSliderInput,
        onHChange: onExploreHChange,
        onVChange: onExploreVChange,
        onHDragStart: onExploreHDragStart,
        onVDragStart: onExploreVDragStart,
        onHRelease: onExploreHRelease,
        onVRelease: onExploreVRelease,
        onPointDragStart: onStep6PointDragStart,
        onPointChange: onStep6PointChange,
        onPointDragEnd: onStep6PointDragEnd,
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
        useEdgeCoordBox: useEdgeCoordBox,
        showHNudge: showSliderNudge && (step === 1 || step === 2),
        showVNudge: showSliderNudge && (step === 3 || step === 4),
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
    renderFlyClone(),
  );
};
