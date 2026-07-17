/* ── Shadow and Pole – Main Canvas ── */

const SVG_VIEWBOX_W = 814;
const SVG_VIEWBOX_H = 637;

const FLY_POSITIONS = {
  300: { x: 288, y: 593 },
  150: { x: 439, y: 447 },
  100: { x: 630, y: 598 },
};

const ANSWER_FLY_POSITION = { x: 86, y: 370 };

const LAYOUT_TRANSITION_MS = 600;
const STEP5_RESULT_DELAY_MS = 800;

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
  const isAnimatingRef = useRef(false);

  const [step2Substep, setStep2Substep] = useState(0);
  const [step3Revealed, setStep3Revealed] = useState(false);
  const [step4Substep, setStep4Substep] = useState(0);
  const [step4Revealed, setStep4Revealed] = useState(false);
  const [visualImage, setVisualImage] = useState("");
  const [flyingClones, setFlyingClones] = useState([]);

  const [eq1, setEq1] = useState({ d: false, n: false, d2: false });
  const [eq2, setEq2] = useState({ mult: false });
  const [eq3, setEq3] = useState({ result: false });
  const [mathPhase, setMathPhase] = useState("eq1");
  const [activeBox, setActiveBox] = useState("eq1-d");
  const [step5ShowInfoPanel, setStep5ShowInfoPanel] = useState(false);
  const [step5Ready, setStep5Ready] = useState(false);
  const [step6Ready, setStep6Ready] = useState(false);

  const problemParts = APP_DATA.problem.statement;
  const step4Data = APP_DATA.step4Substeps;
  const mathData = APP_DATA.math;
  const step3Data = APP_DATA.steps[3];

  const flyClone = useCallback((id, text, from, to, color, fontSize, rotateEnd) => {
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
  }, []);

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

  const registerOverlayNudge = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById("step3-overlay-btn");
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
      onUpdateTexts(undefined, APP_DATA.steps[2].navFindPole);
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

  // ── Step 3 init (sun rays reveal) ──
  useEffect(() => {
    if (step !== 3) return;
    setStep3Revealed(false);
    setVisualImage(step3Data.img);
    onSetNextEnabled(false);
    onSetNextHidden(true);
    onUpdateTexts(step3Data.questionText, step3Data.navText);
    registerOverlayNudge();
  }, [
    step,
    onSetNextEnabled,
    onSetNextHidden,
    onUpdateTexts,
    registerOverlayNudge,
    step3Data,
  ]);

  useEffect(() => {
    if (step !== 3 || step3Revealed) return;
    registerOverlayNudge();
  }, [step, step3Revealed, registerOverlayNudge]);

  const handleStep3OverlayClick = useCallback(() => {
    if (step !== 3 || step3Revealed || isAnimatingRef.current) return;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setStep3Revealed(true);
    setVisualImage(step3Data.imgAfter);
    onUpdateTexts(undefined, step3Data.navAfter);
    onSetNextEnabled(true);
    onSetNextHidden(false);
    registerNextNudge();
  }, [
    step,
    step3Revealed,
    step3Data,
    onHideNudge,
    onUpdateTexts,
    onSetNextEnabled,
    onSetNextHidden,
    registerNextNudge,
  ]);

  const tryAdvanceStep3 = useCallback(() => {
    if (step !== 3 || !step3Revealed) return false;
    onStepChange(4);
    return true;
  }, [step, step3Revealed, onStepChange]);

  // ── Step 4 init (action substeps) ──
  useEffect(() => {
    if (step !== 4) return;
    setStep4Substep(0);
    setStep4Revealed(false);
    setVisualImage(step4Data[0].img);
    onSetNextEnabled(false);
    onSetNextHidden(true);
    onUpdateTexts(APP_DATA.steps[4].questionText, APP_DATA.steps[4].navText);
    registerActionNudge();
  }, [
    step,
    onSetNextEnabled,
    onSetNextHidden,
    onUpdateTexts,
    registerActionNudge,
    step4Data,
  ]);

  useEffect(() => {
    if (step !== 4 || step4Revealed) return;
    registerActionNudge();
  }, [step, step4Substep, step4Revealed, registerActionNudge]);

  const handleActionClick = useCallback(() => {
    if (step !== 4 || step4Revealed || isAnimatingRef.current) return;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    const sub = step4Data[step4Substep];
    setStep4Revealed(true);
    setVisualImage(sub.imgAfter);
    onUpdateTexts(undefined, sub.navAfter);
    onSetNextEnabled(true);
    onSetNextHidden(false);
    registerNextNudge();
  }, [
    step,
    step4Revealed,
    step4Substep,
    step4Data,
    onHideNudge,
    onUpdateTexts,
    onSetNextEnabled,
    onSetNextHidden,
    registerNextNudge,
  ]);

  const tryAdvanceStep4 = useCallback(() => {
    if (step !== 4 || !step4Revealed) return false;
    if (step4Substep < step4Data.length - 1) {
      const next = step4Substep + 1;
      setStep4Substep(next);
      setStep4Revealed(false);
      setVisualImage(step4Data[next].img);
      onSetNextEnabled(false);
      onSetNextHidden(true);
      onUpdateTexts(undefined, APP_DATA.steps[4].navText);
      return true;
    }
    onStepChange(5);
    return true;
  }, [
    step,
    step4Revealed,
    step4Substep,
    step4Data,
    onStepChange,
    onSetNextEnabled,
    onSetNextHidden,
    onUpdateTexts,
  ]);

  // ── Step 5 init (math) ──
  useEffect(() => {
    if (step !== 5) return;
    setVisualImage(APP_DATA.staticImages.ten);
    setEq1({ d: false, n: false, d2: false });
    setEq2({ mult: false });
    setEq3({ result: false });
    setMathPhase("eq1");
    setActiveBox("eq1-d");
    setStep5ShowInfoPanel(false);
    setStep5Ready(false);
    setStep6Ready(false);
    onSetNextEnabled(false);
    onSetNextHidden(true);
    onSetNextLabel("\u00BB");
    onUpdateTexts(APP_DATA.steps[5].questionText, APP_DATA.steps[5].navText);
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
      if (step !== 5 || mathPhase !== "eq1" || activeBox !== boxKey) return;
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      playSnd("click");
      if (onHideNudge) onHideNudge();

      const mapping = {
        "eq1-d": { flyKey: 150, value: mathData.value150, stateKey: "d" },
        "eq1-n": { flyKey: 300, value: mathData.value300, stateKey: "n" },
        "eq1-d2": { flyKey: 100, value: mathData.value100, stateKey: "d2" },
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
    if (step !== 5 || mathPhase !== "eq2" || activeBox !== "eq2-mult") return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    playSnd("click");
    if (onHideNudge) onHideNudge();

    const from = getScreenCenter(document.getElementById("eq1-d-val"));
    const to = getScreenCenter(document.getElementById("eq2-mult"));
    await flyClone(
      `fly-eq2-${Date.now()}`,
      mathData.value150,
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
    if (step !== 5 || mathPhase !== "eq3" || activeBox !== "eq3-result") return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    playSnd("click");
    if (onHideNudge) onHideNudge();
    setActiveBox(null);

    setEq3({ result: true });
    await new Promise((r) => setTimeout(r, STEP5_RESULT_DELAY_MS));

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

    setVisualImage(APP_DATA.staticImages.ans);
    setStep5Ready(true);
    onUpdateTexts(undefined, APP_DATA.steps[5].navAfter);
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

  useEffect(() => {
    if (step !== 6) return;
    setStep5ShowInfoPanel(false);
    setStep6Ready(false);
    onSetNextEnabled(false);
    onSetNextHidden(true);
    onSetNextLabel(APP_DATA.steps[6].nextText);
    onUpdateTexts(
      APP_DATA.steps[6].questionComplete,
      APP_DATA.steps[6].navComplete,
    );

    const showSummary = async () => {
      await new Promise((r) => setTimeout(r, LAYOUT_TRANSITION_MS));
      setStep5ShowInfoPanel(true);
      await new Promise((r) => setTimeout(r, LAYOUT_TRANSITION_MS));
      setStep6Ready(true);
      onSetNextEnabled(true);
      onSetNextHidden(false);
    };

    showSummary();
  }, [
    step,
    onSetNextEnabled,
    onSetNextHidden,
    onSetNextLabel,
    onUpdateTexts,
  ]);

  const tryAdvanceStep5 = useCallback(() => {
    if (step !== 5 || !step5Ready) return false;
    onStepChange(6);
    return true;
  }, [step, step5Ready, onStepChange]);

  const tryAdvanceStep6 = useCallback(() => {
    if (step !== 6 || !step6Ready) return false;
    onRestart();
    return true;
  }, [step, step6Ready, onRestart]);

  useEffect(() => {
    if (!advanceRef) return;
    advanceRef.current = () => {
      if (tryAdvanceStep2()) return true;
      if (tryAdvanceStep3()) return true;
      if (tryAdvanceStep4()) return true;
      if (tryAdvanceStep5()) return true;
      if (tryAdvanceStep6()) return true;
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
    tryAdvanceStep6,
  ]);

  // ── Layout widths ──
  const infoWidth =
    step === 1
      ? "100%"
      : step === 2 || ((step === 5 || step === 6) && step5ShowInfoPanel)
        ? "45%"
        : "0%";
  const visualWidth = step === 1 ? "0%" : "55%";
  const mathWidth =
    (step === 5 || step === 6) && !step5ShowInfoPanel ? "45%" : "0%";
  const visualCentering = step === 3 || step === 4;
  const actionRowHeight = step === 4 ? "15%" : "0%";
  const infoVisible =
    step === 1 ||
    step === 2 ||
    ((step === 5 || step === 6) && step5ShowInfoPanel);
  const mathVisible = (step === 5 || step === 6) && !step5ShowInfoPanel;

  const renderProblemText = () => {
    const activeIdx =
      (step === 5 || step === 6) && step5ShowInfoPanel
        ? GIVEN_COUNT
        : step2Substep < GIVEN_COUNT
          ? step2Substep
          : step2Substep === GIVEN_COUNT
            ? GIVEN_COUNT
            : -1;

    return problemParts.map((part, i) => {
      let className = "problem-muted";
      if (step === 1) {
        className = "";
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

  const currentStep4 = step4Data[step4Substep];

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    React.createElement(
      "div",
      { className: "main-row" + (visualCentering ? " visual-centered" : "") },
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
        visualImage &&
          React.createElement("img", {
            ref: visualImgRef,
            className: "visual-image",
            src: visualImage,
            alt: "",
            draggable: false,
          }),
        step === 3 &&
          !step3Revealed &&
          React.createElement(
            "button",
            {
              id: "step3-overlay-btn",
              className: "visual-overlay-btn",
              onClick: handleStep3OverlayClick,
              type: "button",
            },
            step3Data.buttonText,
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
                React.createElement("span", { className: "math-h" }, mathData.h),
                renderMathBox("eq1-d", eq1.d, mathData.value150, () =>
                  handleEq1BoxClick("eq1-d"),
                ),
              ),
              React.createElement("span", { className: "math-equals" }, "="),
              renderFraction(
                renderMathBox("eq1-n", eq1.n, mathData.value300, () =>
                  handleEq1BoxClick("eq1-n"),
                ),
                renderMathBox("eq1-d2", eq1.d2, mathData.value100, () =>
                  handleEq1BoxClick("eq1-d2"),
                ),
              ),
            ),
            (mathPhase === "eq2" || mathPhase === "eq3" || eq2.mult) &&
              React.createElement(
                "div",
                { className: "math-equation math-eq2" },
                React.createElement("span", { className: "math-h" }, mathData.h),
                React.createElement("span", { className: "math-equals" }, "="),
                React.createElement(
                  "span",
                  { className: "math-frac" },
                  React.createElement(
                    "span",
                    { className: "math-frac-num" },
                    mathData.value300,
                  ),
                  React.createElement("span", { className: "math-frac-bar" }),
                  React.createElement(
                    "span",
                    { className: "math-frac-den" },
                    mathData.value100,
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
                  mathData.value150,
                  handleEq2BoxClick,
                ),
              ),
            (mathPhase === "eq3" || eq3.result) &&
              React.createElement(
                "div",
                { className: "math-equation math-eq3" },
                React.createElement("span", { className: "math-h" }, mathData.h),
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
        className: "action-row" + (step === 4 ? " has-content" : ""),
        style: { flex: "0 0 " + actionRowHeight },
      },
      step === 4 &&
        !step4Revealed &&
        React.createElement(
          "button",
          {
            id: "action-button",
            className: "action-btn",
            onClick: handleActionClick,
          },
          currentStep4.btn,
        ),
      step === 4 &&
        step4Revealed &&
        React.createElement("div", {
          className: "action-text-after",
          dangerouslySetInnerHTML: { __html: currentStep4.textAfter },
        }),
    ),
    renderFlyingClones(),
  );
};
