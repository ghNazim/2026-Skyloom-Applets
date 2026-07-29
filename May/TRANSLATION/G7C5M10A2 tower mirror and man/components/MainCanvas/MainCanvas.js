/* ── Tower, Mirror and Man – Main Canvas ── */

const SVG_VIEWBOX_W = 814;
const SVG_VIEWBOX_H = 548;

const FLY_POSITIONS = {
  1.8: { x: 715, y: 330 },
  500: { x: 284, y: 452 },
  2.75: { x: 568, y: 452 },
};

const ANSWER_FLY_POSITION = { x: 37.12, y: 219.35 };

const GIVEN_COUNT = APP_DATA.problem.statement.filter(
  (p) => p.type === "given",
).length;

function playSnd(name) {
  if (typeof playSound === "function") playSound(name);
}

function getScreenCenter(el) {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function getPointFromViewbox(imgEl, vx, vy, vbW, vbH) {
  if (!imgEl) return null;
  const rect = imgEl.getBoundingClientRect();
  const imgAspect = vbW / vbH;
  const rectAspect = rect.width / rect.height;
  let renderW;
  let renderH;
  let offsetX;
  let offsetY;
  if (rectAspect > imgAspect) {
    renderH = rect.height;
    renderW = renderH * imgAspect;
    offsetX = (rect.width - renderW) / 2;
    offsetY = 0;
  } else {
    renderW = rect.width;
    renderH = renderW / imgAspect;
    offsetX = 0;
    offsetY = (rect.height - renderH) / 2;
  }
  return {
    x: rect.left + offsetX + (vx / vbW) * renderW,
    y: rect.top + offsetY + (vy / vbH) * renderH,
  };
}

const MainCanvas = (props) => {
  const {
    step,
    advanceRef,
    onSetNextEnabled,
    onSetNextHidden,
    onUpdateTexts,
    onSetNextLabel,
    onStepChange,
    onRestart,
    onRegisterNudgeTarget,
    onHideNudge,
  } = props;
  const { useState, useEffect, useCallback, useRef } = React;

  const visualImgRef = useRef(null);
  const visualInnerRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const [step2Substep, setStep2Substep] = useState(0);
  const [step3Substep, setStep3Substep] = useState(0);
  const [step3Revealed, setStep3Revealed] = useState(false);
  const [step3Ready, setStep3Ready] = useState(false);
  const [visualImage, setVisualImage] = useState("");
  const [flyingClones, setFlyingClones] = useState([]);

  const [eq1, setEq1] = useState({ d: false, n: false, d2: false });
  const [eq2, setEq2] = useState({ mult: false });
  const [eq3, setEq3] = useState({ result: false });
  const [mathPhase, setMathPhase] = useState("eq1");
  const [activeBox, setActiveBox] = useState("eq1-d");
  const [step4Complete, setStep4Complete] = useState(false);

  const problemParts = APP_DATA.problem.statement;
  const step3Data = APP_DATA.step3Substeps;
  const mathData = APP_DATA.math;

  const flyClone = useCallback(
    (id, text, from, to, color, fontSize, rotateEnd) => {
      return new Promise((resolve) => {
        if (!from || !to) {
          resolve();
          return;
        }
        const fs = fontSize || "2.5vw";
        const endRot = rotateEnd || 0;
        setFlyingClones((prev) => [
          ...prev,
          {
            id,
            text,
            from,
            to,
            color: color || "#ffffff",
            t: 0,
            fontSize: fs,
            rotateEnd: endRot,
          },
        ]);
        const anim = { t: 0 };
        gsap.to(anim, {
          t: 1,
          duration: 0.55,
          ease: "power2.inOut",
          onUpdate: () => {
            setFlyingClones((prev) =>
              prev.map((c) => (c.id === id ? { ...c, t: anim.t } : c)),
            );
          },
          onComplete: () => {
            setFlyingClones((prev) => prev.filter((c) => c.id !== id));
            resolve();
          },
        });
      });
    },
    [],
  );

  const getVisualFlyStart = useCallback((key) => {
    const pos = FLY_POSITIONS[key];
    if (!pos) return null;
    return getPointFromViewbox(
      visualImgRef.current,
      pos.x,
      pos.y,
      SVG_VIEWBOX_W,
      SVG_VIEWBOX_H,
    );
  }, []);

  const registerBoxNudge = useCallback(
    (boxId) => {
      setTimeout(() => {
        const el = document.getElementById(boxId);
        if (el && onRegisterNudgeTarget) onRegisterNudgeTarget(el);
      }, 350);
    },
    [onRegisterNudgeTarget],
  );

  const registerNextNudge = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById("next-button");
      if (el && onRegisterNudgeTarget) {
        onRegisterNudgeTarget(el, { immediate: true });
      }
    }, 350);
  }, [onRegisterNudgeTarget]);

  const registerActionNudge = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById("action-button");
      if (el && onRegisterNudgeTarget) onRegisterNudgeTarget(el);
    }, 400);
  }, [onRegisterNudgeTarget]);

  // ── Step 1 ──
  useEffect(() => {
    if (step !== 1) return;
    onSetNextEnabled(true);
    onSetNextHidden(false);
    onUpdateTexts(undefined, null);
  }, [step, onSetNextEnabled, onSetNextHidden, onUpdateTexts]);

  // ── Step 2 init ──
  useEffect(() => {
    if (step !== 2) return;
    setStep2Substep(0);
    setVisualImage(problemParts[0].image);
    onSetNextEnabled(true);
    onSetNextHidden(false);
    onUpdateTexts(undefined, APP_DATA.steps[2].navText);
  }, [step, onSetNextEnabled, onSetNextHidden, onUpdateTexts, problemParts]);

  // Update step 2 highlight / image / nav when substep changes
  useEffect(() => {
    if (step !== 2) return;
    const idx = step2Substep;
    if (idx < GIVEN_COUNT) {
      setVisualImage(problemParts[idx].image);
      if (idx === GIVEN_COUNT - 1) {
        onUpdateTexts(undefined, APP_DATA.steps[2].navToFind);
      } else {
        onUpdateTexts(undefined, APP_DATA.steps[2].navText);
      }
    } else if (idx === GIVEN_COUNT) {
      setVisualImage(problemParts[GIVEN_COUNT].image);
      onUpdateTexts(undefined, APP_DATA.steps[2].navFindH);
    }
    onSetNextEnabled(true);
  }, [step, step2Substep, onUpdateTexts, onSetNextEnabled, problemParts]);

  const tryAdvanceStep2 = useCallback(() => {
    if (step !== 2) return false;
    if (step2Substep < GIVEN_COUNT) {
      setStep2Substep((s) => s + 1);
      return true;
    }
    if (step2Substep === GIVEN_COUNT) {
      onStepChange(3);
      return true;
    }
    return false;
  }, [step, step2Substep, onStepChange]);

  // ── Step 3 init ──
  useEffect(() => {
    if (step !== 3) return;
    setStep3Substep(0);
    setStep3Revealed(false);
    setStep3Ready(false);
    setVisualImage(problemParts[GIVEN_COUNT].image);
    onSetNextEnabled(false);
    onSetNextHidden(true);
    onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navText);
  }, [
    step,
    onSetNextEnabled,
    onSetNextHidden,
    onUpdateTexts,
    problemParts,
    GIVEN_COUNT,
    step3Data,
  ]);

  useEffect(() => {
    if (step !== 3 || !step3Ready || step3Revealed) return;
    registerActionNudge();
  }, [step, step3Ready, step3Substep, step3Revealed, registerActionNudge]);

  useEffect(() => {
    if (step !== 3 || step3Ready) return;

    const target = visualInnerRef.current;
    const finishTransition = () => {
      setVisualImage(step3Data[step3Substep].img);
      setStep3Ready(true);
    };

    if (!target) {
      finishTransition();
      return;
    }

    let done = false;
    const complete = () => {
      if (done) return;
      done = true;
      target.removeEventListener("transitionend", onTransitionEnd);
      clearTimeout(fallbackId);
      finishTransition();
    };

    const onTransitionEnd = (event) => {
      if (event.target !== target || event.propertyName !== "width") return;
      complete();
    };

    const fallbackId = setTimeout(complete, 700);
    target.addEventListener("transitionend", onTransitionEnd);

    return () => {
      done = true;
      target.removeEventListener("transitionend", onTransitionEnd);
      clearTimeout(fallbackId);
    };
  }, [step, step3Ready, step3Substep, step3Data]);

  const handleActionClick = useCallback(() => {
    if (step !== 3 || !step3Ready || step3Revealed || isAnimatingRef.current)
      return;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    const sub = step3Data[step3Substep];
    setStep3Revealed(true);
    setVisualImage(sub.imgAfter);
    onUpdateTexts(undefined, sub.navAfter);
    onSetNextEnabled(true);
    onSetNextHidden(false);
    registerNextNudge();
  }, [
    step,
    step3Ready,
    step3Revealed,
    step3Substep,
    step3Data,
    onHideNudge,
    onUpdateTexts,
    onSetNextEnabled,
    onSetNextHidden,
    registerNextNudge,
  ]);

  const tryAdvanceStep3 = useCallback(() => {
    if (step !== 3 || !step3Revealed) return false;
    if (step3Substep < step3Data.length - 1) {
      const next = step3Substep + 1;
      setStep3Substep(next);
      setStep3Revealed(false);
      setStep3Ready(true);
      setVisualImage(step3Data[next].img);
      onSetNextEnabled(false);
      onSetNextHidden(true);
      onUpdateTexts(undefined, APP_DATA.steps[3].navText);
      return true;
    }
    onStepChange(4);
    return true;
  }, [
    step,
    step3Revealed,
    step3Substep,
    step3Data,
    onStepChange,
    onSetNextEnabled,
    onSetNextHidden,
    onUpdateTexts,
  ]);

  // ── Step 4 init ──
  useEffect(() => {
    if (step !== 4) return;
    setVisualImage(APP_DATA.defaultImages[8]);
    setEq1({ d: false, n: false, d2: false });
    setEq2({ mult: false });
    setEq3({ result: false });
    setMathPhase("eq1");
    setActiveBox("eq1-d");
    setStep4Complete(false);
    onSetNextEnabled(false);
    onSetNextHidden(true);
    onSetNextLabel("\u00BB");
    onUpdateTexts(APP_DATA.steps[4].questionText, APP_DATA.steps[4].navText);
    registerBoxNudge("eq1-d");
  }, [
    step,
    onSetNextEnabled,
    onSetNextHidden,
    onSetNextLabel,
    onUpdateTexts,
    registerBoxNudge,
  ]);

  const handleEq1BoxClick = useCallback(
    async (boxKey) => {
      if (step !== 4 || mathPhase !== "eq1" || activeBox !== boxKey) return;
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      playSnd("click");
      if (onHideNudge) onHideNudge();

      const mapping = {
        "eq1-d": { flyKey: "1.8", value: mathData.value18, stateKey: "d" },
        "eq1-n": { flyKey: "500", value: mathData.value500, stateKey: "n" },
        "eq1-d2": {
          flyKey: "2.75",
          value: mathData.value275,
          stateKey: "d2",
        },
      };
      const m = mapping[boxKey];
      const from = getVisualFlyStart(m.flyKey);
      const to = getScreenCenter(document.getElementById(boxKey));
      await flyClone(
        `fly-${boxKey}-${Date.now()}`,
        m.value,
        from,
        to,
        "#ffffff",
      );
      setEq1((prev) => ({ ...prev, [m.stateKey]: true }));

      const nextBoxes = {
        "eq1-d": "eq1-n",
        "eq1-n": "eq1-d2",
        "eq1-d2": null,
      };
      const next = nextBoxes[boxKey];
      if (next) {
        setActiveBox(next);
        registerBoxNudge(next);
      } else {
        setMathPhase("eq2");
        setActiveBox("eq2-mult");
        registerBoxNudge("eq2-mult");
      }
      isAnimatingRef.current = false;
    },
    [
      step,
      mathPhase,
      activeBox,
      mathData,
      getVisualFlyStart,
      flyClone,
      onHideNudge,
      registerBoxNudge,
    ],
  );

  const handleEq2BoxClick = useCallback(async () => {
    if (step !== 4 || mathPhase !== "eq2" || activeBox !== "eq2-mult") return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    playSnd("click");
    if (onHideNudge) onHideNudge();

    const from = getScreenCenter(document.getElementById("eq1-d-val"));
    const to = getScreenCenter(document.getElementById("eq2-mult"));
    await flyClone(
      `fly-eq2-${Date.now()}`,
      mathData.value18,
      from,
      to,
      "#ffffff",
    );
    setEq2({ mult: true });
    setMathPhase("eq3");
    setActiveBox("eq3-result");
    registerBoxNudge("eq3-result");
    isAnimatingRef.current = false;
  }, [
    step,
    mathPhase,
    activeBox,
    mathData,
    flyClone,
    onHideNudge,
    registerBoxNudge,
  ]);

  const handleEq3BoxClick = useCallback(async () => {
    if (step !== 4 || mathPhase !== "eq3" || activeBox !== "eq3-result") return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setActiveBox(null);

    setEq3({ result: true });
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );
    await new Promise((r) => setTimeout(r, 1000));

    const from = getScreenCenter(document.getElementById("eq3-result-val"));
    const to = getPointFromViewbox(
      visualImgRef.current,
      ANSWER_FLY_POSITION.x,
      ANSWER_FLY_POSITION.y,
      SVG_VIEWBOX_W,
      SVG_VIEWBOX_H,
    );
    await flyClone(
      `fly-answer-${Date.now()}`,
      mathData.result,
      from,
      to,
      "#ffffff",
      "2.5vw",
      -90,
    );

    setVisualImage(APP_DATA.defaultImages.ans);
    setStep4Complete(true);
    onUpdateTexts(
      APP_DATA.steps[4].questionComplete,
      APP_DATA.steps[4].navSummary,
    );
    onSetNextLabel("\u00BB");
    onSetNextEnabled(true);
    onSetNextHidden(false);
    registerNextNudge();
    isAnimatingRef.current = false;
  }, [
    step,
    mathPhase,
    activeBox,
    mathData,
    flyClone,
    onHideNudge,
    onUpdateTexts,
    onSetNextLabel,
    onSetNextEnabled,
    onSetNextHidden,
    registerNextNudge,
  ]);

  const tryAdvanceStep4 = useCallback(() => {
    if (step !== 4 || !step4Complete) return false;
    onStepChange(5);
    return true;
  }, [step, step4Complete, onStepChange]);

  useEffect(() => {
    if (step !== 5) return;
    setVisualImage(APP_DATA.defaultImages.ans);
    onSetNextEnabled(true);
    onSetNextHidden(false);
    onSetNextLabel(APP_DATA.steps[5].nextText);
    onUpdateTexts(APP_DATA.steps[5].questionText, APP_DATA.steps[5].navText);
    registerNextNudge();
  }, [
    step,
    onSetNextEnabled,
    onSetNextHidden,
    onSetNextLabel,
    onUpdateTexts,
    registerNextNudge,
  ]);

  const tryAdvanceStep5 = useCallback(() => {
    if (step !== 5) return false;
    onRestart();
    return true;
  }, [step, onRestart]);

  useEffect(() => {
    if (!advanceRef) return;
    advanceRef.current = () => {
      if (tryAdvanceStep2()) return true;
      if (tryAdvanceStep3()) return true;
      if (tryAdvanceStep4()) return true;
      if (tryAdvanceStep5()) return true;
      return false;
    };
    return () => {
      advanceRef.current = null;
    };
  }, [
    advanceRef,
    tryAdvanceStep2,
    tryAdvanceStep3,
    tryAdvanceStep4,
    tryAdvanceStep5,
  ]);

  // ── Layout widths ──
  const infoWidth =
    step === 1 ? "100%" : step === 2 || step === 5 ? "45%" : "0%";
  const visualWidth = step === 1 ? "0%" : step === 3 ? "100%" : "55%";
  const visualInnerWidth = step === 3 ? "55%" : "100%";
  const mathWidth = step === 4 ? "45%" : "0%";
  const actionRowHeight = step === 3 ? "15%" : "0%";
  const infoVisible = step === 1 || step === 2 || step === 5;
  const mathVisible = step === 4;

  const renderProblemText = () => {
    const activeIdx =
      step2Substep < GIVEN_COUNT
        ? step2Substep
        : step2Substep === GIVEN_COUNT
          ? GIVEN_COUNT
          : -1;

    return problemParts.map((part, i) => {
      let className = "problem-muted";
      if (step === 1) {
        className = "";
      } else if (step === 5) {
        className = part.type === "tofind" ? "to-find-hl" : "problem-muted";
      } else if (i === activeIdx) {
        className = part.type === "tofind" ? "to-find-hl" : "given-hl";
      }
      return React.createElement(
        "span",
        { key: part.key, className: className },
        part.text,
      );
    });
  };

  const renderMathBox = (id, filled, value, onClick) => {
    if (filled) {
      return React.createElement(
        "span",
        { id: id + "-val", className: "math-value" },
        value,
      );
    }
    return React.createElement(
      "button",
      {
        id: id,
        className: "math-box" + (activeBox === id ? " math-box-active" : ""),
        onClick: onClick,
        type: "button",
      },
      "?",
    );
  };

  const renderFraction = (numerator, denominator) => {
    return React.createElement(
      "span",
      { className: "math-frac" },
      React.createElement("span", { className: "math-frac-num" }, numerator),
      React.createElement("span", { className: "math-frac-bar" }),
      React.createElement("span", { className: "math-frac-den" }, denominator),
    );
  };

  const renderFlyingClones = () => {
    if (flyingClones.length === 0) return null;
    return React.createElement(
      "div",
      { className: "flying-clones-layer" },
      flyingClones.map((c) => {
        const x = c.from.x + (c.to.x - c.from.x) * c.t;
        const y = c.from.y + (c.to.y - c.from.y) * c.t;
        const rotate = (c.rotateEnd || 0) * c.t;
        return React.createElement(
          "span",
          {
            key: c.id,
            className: "flying-clone",
            style: {
              left: x + "px",
              top: y + "px",
              color: c.color,
              fontSize: c.fontSize,
              transform: "translate(-50%, -50%) rotate(" + rotate + "deg)",
            },
          },
          c.text,
        );
      }),
    );
  };

  const currentStep3 = step3Data[step3Substep];

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-row" },
      React.createElement(
        "div",
        {
          className:
            "canvas-column info-column" + (infoVisible ? " visible" : ""),
          style: { width: infoWidth },
        },
        React.createElement(
          "div",
          { className: "info-content" },
          React.createElement(
            "p",
            { className: "problem-statement" },
            renderProblemText(),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "canvas-column visual-column",
          style: { width: visualWidth },
        },
        React.createElement(
          "div",
          {
            className: "visual-column-inner",
            style: { width: visualInnerWidth },
            ref: visualInnerRef,
          },
          visualImage &&
            React.createElement("img", {
              ref: visualImgRef,
              className: "visual-image",
              src: visualImage,
              alt: "",
              draggable: false,
            }),
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "canvas-column math-column" + (mathVisible ? " visible" : ""),
          style: { width: mathWidth },
        },
        mathVisible &&
          React.createElement(
            "div",
            { className: "math-content" },
            React.createElement("div", {
              className: "math-title",
              dangerouslySetInnerHTML: { __html: mathData.title },
            }),
            React.createElement(
              "div",
              { className: "math-equation math-eq1" },
              renderFraction(
                React.createElement("span", { className: "math-h" }, mathData.heightVar),
                renderMathBox("eq1-d", eq1.d, mathData.value18, () =>
                  handleEq1BoxClick("eq1-d"),
                ),
              ),
              React.createElement("span", { className: "math-equals" }, "="),
              renderFraction(
                renderMathBox("eq1-n", eq1.n, mathData.value500, () =>
                  handleEq1BoxClick("eq1-n"),
                ),
                renderMathBox("eq1-d2", eq1.d2, mathData.value275, () =>
                  handleEq1BoxClick("eq1-d2"),
                ),
              ),
            ),
            (mathPhase === "eq2" || mathPhase === "eq3" || eq2.mult) &&
              React.createElement(
                "div",
                { className: "math-equation math-eq2" },
                React.createElement("span", { className: "math-h" }, mathData.heightVar),
                React.createElement("span", { className: "math-equals" }, "="),
                React.createElement(
                  "span",
                  { className: "math-frac" },
                  React.createElement(
                    "span",
                    { className: "math-frac-num" },
                    mathData.value500,
                  ),
                  React.createElement("span", { className: "math-frac-bar" }),
                  React.createElement(
                    "span",
                    { className: "math-frac-den" },
                    mathData.value275,
                  ),
                ),
                React.createElement(
                  "span",
                  { className: "math-times" },
                  "\u00D7",
                ),
                renderMathBox(
                  "eq2-mult",
                  eq2.mult,
                  mathData.value18,
                  handleEq2BoxClick,
                ),
              ),
            (mathPhase === "eq3" || eq3.result) &&
              React.createElement(
                "div",
                { className: "math-equation math-eq3" },
                React.createElement("span", { className: "math-h" }, mathData.heightVar),
                React.createElement("span", { className: "math-equals" }, "="),
                eq3.result
                  ? React.createElement(
                      "span",
                      { id: "eq3-result-val", className: "math-value" },
                      mathData.result,
                    )
                  : renderMathBox(
                      "eq3-result",
                      false,
                      mathData.result,
                      handleEq3BoxClick,
                    ),
              ),
          ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "action-row" + (step === 3 ? " has-content" : ""),
        style: { flex: "0 0 " + actionRowHeight },
      },
      step === 3 &&
        step3Ready &&
        !step3Revealed &&
        React.createElement(
          "button",
          {
            id: "action-button",
            className: "action-btn",
            onClick: handleActionClick,
          },
          currentStep3.btn,
        ),
      step === 3 &&
        step3Revealed &&
        React.createElement("div", {
          className: "action-text-after",
          dangerouslySetInnerHTML: { __html: currentStep3.textAfter },
        }),
    ),
    renderFlyingClones(),
  );
};
