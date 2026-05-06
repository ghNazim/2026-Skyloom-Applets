/**
 * Step4Layout – split layout (grid left, calc panel right)
 * Handles step 4 interactive calc AND step 5 fly-to-hypotenuse animation.
 *
 * Props: svgElement, s4Phase, onS4PhaseAdvance, isStep5, onS5AnimDone
 */
const Step4Layout = (props) => {
  const { useEffect, useRef, useState } = React;
  const { svgElement, s4Phase, onS4PhaseAdvance, isStep5, onS5AnimDone } = props;

  const d4 = APP_DATA.steps[4];
  const pinkColor = "#E879A0";
  const threeColor = "#34d399";   // green (vertical "3 units")
  const fourColor = "#c084fc";    // purple (horizontal "4 units")
  const white = "#ffffff";

  const containerRef = useRef(null);
  const flyThreeRef = useRef(null);
  const flyFourRef = useRef(null);
  const flyFiveRef = useRef(null);

  const [animReady, setAnimReady] = useState(false);
  const [calcVisible, setCalcVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [sqrtBaseVisible, setSqrtBaseVisible] = useState(false);
  const [threeFlying, setThreeFlying] = useState(false);
  const [threeArrived, setThreeArrived] = useState(false);
  const [threeSquared, setThreeSquared] = useState(false);
  const [plusVisible, setPlusVisible] = useState(false);
  const [fourFlying, setFourFlying] = useState(false);
  const [fourArrived, setFourArrived] = useState(false);
  const [fourSquared, setFourSquared] = useState(false);

  /* ── Phase 0: build-up animation timeline ── */
  useEffect(() => {
    if (isStep5 || s4Phase !== 0) return;
    setAnimReady(false); setCalcVisible(false); setTitleVisible(false);
    setSqrtBaseVisible(false);
    setThreeFlying(false); setThreeArrived(false); setThreeSquared(false);
    setPlusVisible(false);
    setFourFlying(false); setFourArrived(false); setFourSquared(false);

    const timers = [];
    const t = (fn, ms) => { timers.push(setTimeout(fn, ms)); };

    t(() => setAnimReady(true), 50);
    t(() => setCalcVisible(true), 850);
    t(() => setTitleVisible(true), 1250);
    t(() => setSqrtBaseVisible(true), 1750);
    t(() => setThreeFlying(true), 2350);
    t(() => setThreeSquared(true), 3150);
    t(() => setPlusVisible(true), 3550);
    t(() => setFourFlying(true), 3950);
    t(() => {
      setFourSquared(true);
      setTimeout(() => {
        if (typeof onS4PhaseAdvance === "function") onS4PhaseAdvance(1);
      }, 500);
    }, 4750);

    return () => timers.forEach(clearTimeout);
  }, [s4Phase, isStep5]);

  /* ── Step 5 init: ensure calc panel is visible ── */
  useEffect(() => {
    if (!isStep5) return;
    setAnimReady(true);
    setCalcVisible(true);
    setTitleVisible(true);
    setSqrtBaseVisible(true);
    setThreeArrived(true); setThreeSquared(true);
    setPlusVisible(true);
    setFourArrived(true); setFourSquared(true);
  }, [isStep5]);

  /* ── GSAP flying clone: "3" ── */
  useEffect(() => {
    if (!threeFlying || !containerRef.current || !flyThreeRef.current) return;
    const srcEl = document.getElementById("s4-src-3");
    const tgtEl = containerRef.current.querySelector(".s4-sqrt-content");
    if (!srcEl || !tgtEl) { setThreeFlying(false); setThreeArrived(true); return; }

    const cRect = containerRef.current.getBoundingClientRect();
    const srcText = srcEl.querySelector("text");
    const sRect = (srcText || srcEl).getBoundingClientRect();
    const tRect = tgtEl.getBoundingClientRect();
    const el = flyThreeRef.current;

    gsap.set(el, {
      left: sRect.left + sRect.width / 2 - cRect.left,
      top: sRect.top + sRect.height / 2 - cRect.top,
      opacity: 0.9, scale: 1.4, display: "block",
    });
    gsap.to(el, {
      left: tRect.left + 24 - cRect.left,
      top: tRect.top + tRect.height / 2 - cRect.top,
      opacity: 1, scale: 1, duration: 0.6, ease: "power2.out",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        setThreeFlying(false); setThreeArrived(true);
      },
    });
  }, [threeFlying]);

  /* ── GSAP flying clone: "4" ── */
  useEffect(() => {
    if (!fourFlying || !containerRef.current || !flyFourRef.current) return;
    const srcEl = document.getElementById("s4-src-4");
    const tgtEl = containerRef.current.querySelector(".s4-sqrt-content");
    if (!srcEl || !tgtEl) { setFourFlying(false); setFourArrived(true); return; }

    const cRect = containerRef.current.getBoundingClientRect();
    const srcText = srcEl.querySelector("text");
    const sRect = (srcText || srcEl).getBoundingClientRect();
    const tRect = tgtEl.getBoundingClientRect();
    const el = flyFourRef.current;

    gsap.set(el, {
      left: sRect.left + sRect.width / 2 - cRect.left,
      top: sRect.top + sRect.height / 2 - cRect.top,
      opacity: 0.9, scale: 1.4, display: "block",
    });
    gsap.to(el, {
      left: tRect.right - 30 - cRect.left,
      top: tRect.top + tRect.height / 2 - cRect.top,
      opacity: 1, scale: 1, duration: 0.6, ease: "power2.out",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        setFourFlying(false); setFourArrived(true);
      },
    });
  }, [fourFlying]);

  /* ── Step 5: GSAP flying "5" from calc line to SVG hypotenuse ── */
  useEffect(() => {
    if (!isStep5 || !containerRef.current || !flyFiveRef.current) return;

    // Wait a beat for layout to settle
    const timer = setTimeout(() => {
      const el = flyFiveRef.current;
      const cRect = containerRef.current.getBoundingClientRect();

      // Source: the "5" in the last calc line
      const srcEl = containerRef.current.querySelector(".s4-line4-five");
      // Target: hypotenuse label on the SVG
      const tgtEl = containerRef.current.querySelector(".s4-hyp-label");

      if (!srcEl || !tgtEl) {
        if (typeof onS5AnimDone === "function") onS5AnimDone();
        return;
      }

      const sRect = srcEl.getBoundingClientRect();
      const tRect = tgtEl.getBoundingClientRect();

      gsap.set(el, {
        left: sRect.left + sRect.width / 2 - cRect.left,
        top: sRect.top + sRect.height / 2 - cRect.top,
        opacity: 1, scale: 1, display: "block",
      });
      gsap.to(el, {
        left: tRect.left + tRect.width / 2 - cRect.left,
        top: tRect.top + tRect.height / 2 - cRect.top,
        scale: 0.9, duration: 0.8, ease: "power2.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
          if (typeof onS5AnimDone === "function") onS5AnimDone();
        },
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [isStep5]);

  /* ── Click handlers ── */
  const handleClick3Sq = () => { if (s4Phase !== 1) return; if (typeof playSound === "function") playSound("click"); onS4PhaseAdvance(2); };
  const handleClick4Sq = () => { if (s4Phase !== 2) return; if (typeof playSound === "function") playSound("click"); onS4PhaseAdvance(3); };
  const handleClickPlus = () => { if (s4Phase !== 3) return; if (typeof playSound === "function") playSound("click"); onS4PhaseAdvance(4); };
  const handleClick25 = () => { if (s4Phase !== 4) return; if (typeof playSound === "function") playSound("click"); onS4PhaseAdvance(5); };

  /** Square-root SVG overlay */
  function sqrtOverlay() {
    return React.createElement("svg", {
      className: "s4-sqrt-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none",
    }, React.createElement("path", {
      d: "M 0 55 L 5 45 L 12 97 L 14 4 L 100 4",
      stroke: white, strokeWidth: 3, fill: "none",
      strokeLinejoin: "round", strokeLinecap: "round",
      vectorEffect: "non-scaling-stroke",
    }));
  }

  function sqrtWrap(children, minW) {
    return React.createElement("span", { className: "s4-sqrt-wrap" },
      sqrtOverlay(),
      React.createElement("span", {
        className: "s4-sqrt-content",
        style: minW ? { minWidth: minW } : undefined,
      }, ...children),
    );
  }

  /* ── Build calculation lines ── */
  function renderCalcContent() {
    const lines = [];
    const effectivePhase = isStep5 ? 5 : s4Phase;

    /* LINE 1: d = √(3² + 4²) */
    if (sqrtBaseVisible || effectivePhase >= 1) {
      const inner = [];
      if (threeSquared || effectivePhase >= 1) {
        const clickable = !isStep5 && s4Phase === 1;
        inner.push(React.createElement("span", {
          key: "3sq",
          className: clickable ? "s4-clickable s4-clickable-nudge" : "s4-calc-num",
          onClick: clickable ? handleClick3Sq : undefined,
          style: { color: threeColor, cursor: clickable ? "pointer" : "default" },
        }, "3", React.createElement("sup", null, "2")));
      } else if (threeArrived) {
        inner.push(React.createElement("span", { key: "3a", style: { color: threeColor } }, "3"));
      }

      if (plusVisible || effectivePhase >= 1) {
        inner.push(React.createElement("span", { key: "plus", style: { color: white, margin: "0 0.3em" } }, "+"));
      }

      if (fourSquared || effectivePhase >= 1) {
        const clickable = !isStep5 && s4Phase === 2;
        inner.push(React.createElement("span", {
          key: "4sq",
          className: clickable ? "s4-clickable s4-clickable-nudge" : "s4-calc-num",
          onClick: clickable ? handleClick4Sq : undefined,
          style: { color: fourColor, cursor: clickable ? "pointer" : "default" },
        }, "4", React.createElement("sup", null, "2")));
      } else if (fourArrived) {
        inner.push(React.createElement("span", { key: "4a", style: { color: fourColor } }, "4"));
      }

      lines.push(React.createElement("div", { key: "line1", className: "s4-calc-line s4-fade-in" },
        React.createElement("span", { className: "s4-d-eq" }, "d"),
        React.createElement("span", { style: { margin: "0 0.4em" } }, "="),
        sqrtWrap(inner, "5.5em"),
      ));
    }

    /* LINE 2: d = √(9 + 16) */
    if (effectivePhase >= 2) {
      const inner2 = [];
      inner2.push(React.createElement("span", { key: "9", style: { color: threeColor } }, "9"));
      inner2.push(React.createElement("span", {
        key: "plus2",
        className: !isStep5 && s4Phase === 3 ? "s4-clickable s4-clickable-nudge" : "",
        onClick: !isStep5 && s4Phase === 3 ? handleClickPlus : undefined,
        style: { color: white, margin: "0 0.3em", cursor: !isStep5 && s4Phase === 3 ? "pointer" : "default" },
      }, "+"));
      if (effectivePhase >= 3) {
        inner2.push(React.createElement("span", { key: "16", style: { color: fourColor } }, "16"));
      }
      lines.push(React.createElement("div", { key: "line2", className: "s4-calc-line s4-fade-in" },
        React.createElement("span", { className: "s4-d-eq" }, "d"),
        React.createElement("span", { style: { margin: "0 0.4em" } }, "="),
        sqrtWrap(inner2, "5em"),
      ));
    }

    /* LINE 3: d = √25 */
    if (effectivePhase >= 4) {
      const inner3 = [React.createElement("span", {
        key: "25",
        className: !isStep5 && s4Phase === 4 ? "s4-clickable s4-clickable-nudge" : "",
        onClick: !isStep5 && s4Phase === 4 ? handleClick25 : undefined,
        style: { color: pinkColor, cursor: !isStep5 && s4Phase === 4 ? "pointer" : "default" },
      }, "25")];
      lines.push(React.createElement("div", { key: "line3", className: "s4-calc-line s4-fade-in" },
        React.createElement("span", { className: "s4-d-eq" }, "d"),
        React.createElement("span", { style: { margin: "0 0.4em" } }, "="),
        sqrtWrap(inner3, null),
      ));
    }

    /* LINE 4: d = 5 (no click – just display) */
    if (effectivePhase >= 5) {
      lines.push(React.createElement("div", { key: "line4", className: "s4-calc-line s4-fade-in" },
        React.createElement("span", { className: "s4-d-eq" }, "d"),
        React.createElement("span", { style: { margin: "0 0.4em" } }, "="),
        React.createElement("span", {
          className: "s4-line4-five",
          style: { color: pinkColor, fontWeight: "700" },
        }, "5"),
      ));
    }

    return lines;
  }

  /* ── Render ── */
  return React.createElement(
    "div",
    { ref: containerRef, className: "main-canvas-container distance-applet-canvas s4-split-layout" },

    /* Left: coordinate grid */
    React.createElement("div",
      { className: "s4-grid-wrapper" + (animReady ? " s4-grid-shifted" : "") },
      React.createElement("div", { className: "single-svg-canvas s4-svg-inner" }, svgElement),
    ),

    /* Flying clone "3" */
    React.createElement("span", {
      ref: flyThreeRef, className: "s4-flying-clone",
      style: { color: threeColor, display: "none" },
    }, "3"),

    /* Flying clone "4" */
    React.createElement("span", {
      ref: flyFourRef, className: "s4-flying-clone",
      style: { color: fourColor, display: "none" },
    }, "4"),

    /* Flying clone "5" (step 5: flies to hypotenuse) */
    React.createElement("span", {
      ref: flyFiveRef, className: "s4-flying-clone",
      style: { color: pinkColor, display: "none" },
    }, "5"),

    /* Right: calculation panel */
    React.createElement("div",
      { className: "s4-calc-panel" + (calcVisible ? " s4-calc-visible" : "") },
      (titleVisible || s4Phase >= 1 || isStep5)
        ? React.createElement("div", { className: "s4-calc-title s4-fade-in" }, d4.calcTitle)
        : null,
      React.createElement("div", { className: "s4-calc-lines" }, ...renderCalcContent()),
    ),
  );
};
