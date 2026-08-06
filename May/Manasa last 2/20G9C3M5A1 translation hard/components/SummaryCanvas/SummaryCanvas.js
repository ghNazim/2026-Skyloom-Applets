const SUMMARY_ANIM_DELAY_MS = 800;

const createInitialBottomEq = () => ({
  mode: "simple",
  rhsFiveVisible: true,
  fadingFive: false,
  interaction: "idle",
  colored: { rhs2: false, rhsPlus2: false, rhsPlus1: false },
  hiddenTargets: { rhs2: false, rhsPlus2: false, rhsPlus1: false },
  lhsGap2: false,
  lhsGap1: false,
  lhsGap2Open: false,
  lhsGap1Open: false,
  lhsMinus2: false,
  lhsMinus1: false,
  rhsPlus2Gone: false,
  rhsPlus1Gone: false,
  brackets: false,
  hideVerticalArrow: false,
  arrowCompareMode: false,
  showSpotlights: false,
  spotlightsVisible: false,
  morphActive: false,
  morphFlip: false,
  generalized: false,
});

const SummaryCanvas = ({
  step,
  texts,
  translation,
  colors,
  onNavChange,
}) => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;

  const [introPhase, setIntroPhase] = useState(0);
  const [bottomEq, setBottomEq] = useState(createInitialBottomEq);
  const [bottomTextKey, setBottomTextKey] = useState("initial");
  const [bottomTextVisible, setBottomTextVisible] = useState(false);
  const [flyClones, setFlyClones] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animStartedRef = useRef(false);
  const cancelledRef = useRef(false);
  const canvasRef = useRef(null);
  const flowRef = useRef(null);
  const [spotlightPoints, setSpotlightPoints] = useState(null);

  const dx = translation.dx;

  const fullTexts = useMemo(
    () => ({
      ...texts,
      navTapExplore: APP_DATA.steps[11].navTapExplore,
      navTapRewrite: APP_DATA.steps[11].navTapRewrite,
      navTapCompare: APP_DATA.steps[11].navTapCompare,
      navTapGeneralize: APP_DATA.steps[11].navTapGeneralize,
      navTapSummarize: APP_DATA.steps[11].navTapSummarize,
    }),
    [texts],
  );
  const dy = translation.dy;

  const palette = colors || {
    yellow: "#ffd34d",
    pink: "#e85d8a",
    orange: "#fb9b5b",
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const isCancelled = () => cancelledRef.current;

  const animCtx = useMemo(
    () => ({
      setBottomEq,
      setFlyClones,
      onNavChange,
      isCancelled,
      texts: fullTexts,
      colors: palette,
      setBottomTextKey,
      setBottomTextVisible,
    }),
    [onNavChange, fullTexts, palette],
  );

  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (step !== 11) return;
    if (animStartedRef.current) return;
    animStartedRef.current = true;

    const runIntro = async () => {
      onNavChange({ text: "", hidden: true, nudgeId: null });

      setIntroPhase(1);
      await delay(SUMMARY_ANIM_DELAY_MS);
      if (isCancelled()) return;

      setIntroPhase(2);
      await delay(SUMMARY_ANIM_DELAY_MS);
      if (isCancelled()) return;

      setIntroPhase(3);
      await delay(SUMMARY_ANIM_DELAY_MS);
      if (isCancelled()) return;

      setIntroPhase(4);
      setBottomTextVisible(true);
      if (isCancelled()) return;

      setIntroPhase(5);
      onNavChange({
        text: APP_DATA.steps[11].navTapExplore,
        hidden: false,
        nudgeId: "summary-translated-box",
      });
    };

    runIntro();
  }, [step, onNavChange]);

  useEffect(() => {
    if (step !== 11) {
      animStartedRef.current = false;
      setIntroPhase(0);
      setBottomEq(createInitialBottomEq());
      setBottomTextKey("initial");
      setBottomTextVisible(false);
      setFlyClones([]);
      setIsAnimating(false);
    }
  }, [step]);

  const updateSpotlights = useCallback(() => {
    const container = flowRef.current;
    if (!container || !bottomEq.showSpotlights) return;

    const cRect = container.getBoundingClientRect();
    const makeBeam = (sourceId, targetId) => {
      const src = document.getElementById(sourceId);
      const tgt = document.getElementById(targetId);
      if (!src || !tgt) return null;

      const s = src.getBoundingClientRect();
      const t = tgt.getBoundingClientRect();
      const sx = s.left + s.width / 2 - cRect.left;
      const sy = s.bottom - cRect.top;
      const topHalf = Math.max(s.width * 0.4, 5);
      const blx = t.left - cRect.left - 8;
      const brx = t.right - cRect.left + 8;
      const by = t.bottom - cRect.top + 6;

      return (
        sx -
        topHalf +
        "," +
        sy +
        " " +
        (sx + topHalf) +
        "," +
        sy +
        " " +
        brx +
        "," +
        by +
        " " +
        blx +
        "," +
        by
      );
    };

    setSpotlightPoints({
      x: makeBeam("summary-top-var-x", "grp-x"),
      y: makeBeam("summary-top-var-y", "grp-y"),
    });
  }, [bottomEq.showSpotlights]);

  useEffect(() => {
    if (!bottomEq.showSpotlights) {
      setSpotlightPoints(null);
      return undefined;
    }

    const measure = () => requestAnimationFrame(updateSpotlights);
    const timeoutId = setTimeout(measure, 60);
    window.addEventListener("resize", updateSpotlights);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateSpotlights);
    };
  }, [
    bottomEq.showSpotlights,
    bottomEq.spotlightsVisible,
    bottomEq.arrowCompareMode,
    bottomEq.brackets,
    updateSpotlights,
  ]);

  const handleTranslatedClick = useCallback(async () => {
    if (introPhase < 5 || isAnimating) return;
    if (typeof playSound === "function") playSound("click");

    if (bottomEq.interaction === "idle") {
      setIsAnimating(true);
      await runSummaryExpandAndFly(animCtx);
      setIsAnimating(false);
      return;
    }

    if (bottomEq.interaction === "expandDone") {
      setIsAnimating(true);
      await runSummaryRewrite(animCtx);
      setIsAnimating(false);
      return;
    }

    if (bottomEq.interaction === "rewriteDone") {
      setIsAnimating(true);
      await runSummaryCompare(animCtx);
      setIsAnimating(false);
      return;
    }

    if (bottomEq.interaction === "compareDone") {
      setIsAnimating(true);
      await runSummaryGeneralize(animCtx);
      setIsAnimating(false);
    }
  }, [introPhase, isAnimating, bottomEq.interaction, animCtx]);

  const renderVar = (name, id) =>
    React.createElement(
      "span",
      { key: id || name, id: id, className: "summary-math-var" },
      name,
    );

  const renderOp = (text, key) =>
    React.createElement(
      "span",
      { key: key, className: "summary-eq-token summary-eq-gap" },
      text,
    );

  const renderTerm = (text, id, opts) => {
    const options = opts || {};
    const classes = ["summary-eq-token"];
    if (options.color === "yellow") classes.push("is-color-yellow");
    if (options.color === "pink") classes.push("is-color-pink");
    if (options.color === "orange") classes.push("is-color-orange");
    if (options.hidden) classes.push("is-target-hidden");
    if (options.fadingOut) classes.push("is-fading-out");
    return React.createElement(
      "span",
      { key: id, id: id, className: classes.join(" ") },
      text,
    );
  };

  const renderMorphTerm = (fromText, toText, flipped, id, opts) => {
    const options = opts || {};
    const classes = ["summary-eq-token", "summary-morph-term"];
    if (options.color === "yellow") classes.push("is-color-yellow");
    if (options.color === "pink") classes.push("is-color-pink");
    if (options.color === "orange") classes.push("is-color-orange");

    return React.createElement(
      "span",
      { key: id, id: id, className: classes.join(" ") },
      React.createElement(
        "span",
        {
          className: "summary-morph-from" + (flipped ? " is-out" : " is-in"),
        },
        fromText,
      ),
      React.createElement(
        "span",
        {
          className: "summary-morph-to" + (flipped ? " is-in" : " is-out"),
        },
        toText,
      ),
    );
  };

  const renderValueTerm = (numericText, letterText, id, opts) => {
    if (bottomEq.generalized) {
      return renderTerm(letterText, id, opts);
    }
    if (bottomEq.morphActive) {
      return renderMorphTerm(numericText, letterText, bottomEq.morphFlip, id, opts);
    }
    return renderTerm(numericText, id, opts);
  };

  const renderLhsSlot = (
    slotKey,
    anchorId,
    filled,
    slotOpen,
    minusNumeric,
    minusLetter,
    color,
  ) => {
    let slotClass = "summary-eq-lhs-slot";
    if (filled) slotClass += " is-filled";
    else if (slotOpen) slotClass += " is-open";
    else slotClass += " is-closed";

    return React.createElement(
      "span",
      { key: slotKey, className: slotClass },
      filled
        ? renderValueTerm(minusNumeric, minusLetter, anchorId, { color: color })
        : React.createElement("span", {
            id: anchorId,
            className: "summary-eq-slot-anchor",
          }),
    );
  };

  const renderLhsGroup = (
    varName,
    bracketKey,
    anchorId,
    minusNumeric,
    minusLetter,
    color,
    config,
  ) => {
    const inner = [renderVar(varName, bracketKey + "-var")];
    if (config.showSlot) {
      inner.push(
        renderLhsSlot(
          bracketKey + "-slot",
          anchorId,
          config.filled,
          config.slotOpen,
          minusNumeric,
          minusLetter,
          color,
        ),
      );
    } else if (config.filled) {
      inner.push(
        renderValueTerm(minusNumeric, minusLetter, anchorId, { color: color }),
      );
    }

    return React.createElement(
      "span",
      {
        key: bracketKey,
        id: bracketKey,
        className:
          "summary-eq-group" + (config.brackets ? " is-bracketed" : ""),
      },
      React.createElement("span", { className: "summary-eq-bracket is-left" }, "("),
      React.createElement("span", { className: "summary-eq-group-inner" }, inner),
      React.createElement("span", { className: "summary-eq-bracket is-right" }, ")"),
    );
  };

  const renderBracketGroup = (varName, minusText, color, bracketKey, anchorId) => {
    const inner = [
      renderVar(varName, bracketKey + "-var"),
      renderTerm(minusText, anchorId, { color: color }),
    ];
    if (!bottomEq.brackets) {
      return React.createElement(
        "span",
        { key: bracketKey, className: "summary-eq-group" },
        inner,
      );
    }
    return React.createElement(
      "span",
      {
        key: bracketKey,
        className: "summary-eq-group is-bracketed",
      },
      React.createElement("span", { className: "summary-eq-bracket is-left" }, "("),
      React.createElement("span", { className: "summary-eq-group-inner" }, inner),
      React.createElement("span", { className: "summary-eq-bracket is-right" }, ")"),
    );
  };

  const renderBottomEquation = () => {
    const be = bottomEq;
    const parts = [];
    const useLhsGroups =
      be.lhsGap2 ||
      be.lhsGap1 ||
      be.lhsMinus2 ||
      be.lhsMinus1 ||
      be.brackets;

    const rewrittenInteractions = [
      "rewriting",
      "bracketing",
      "rewriteDone",
      "comparing",
      "compareDone",
      "generalizing",
      "summarizeReady",
    ];

    if (be.mode === "expanded" || rewrittenInteractions.indexOf(be.interaction) !== -1) {
      if (useLhsGroups) {
        parts.push(
          renderLhsGroup("x", "grp-x", "summary-bottom-lhs-minus2", "- 2", "- a", "pink", {
            showSlot: be.lhsGap2 || be.lhsMinus2,
            slotOpen: be.lhsGap2Open || be.lhsMinus2,
            filled: be.lhsMinus2,
            brackets: be.brackets,
          }),
        );
        parts.push(renderOp("+", "bot-op1"));
        parts.push(
          renderLhsGroup("y", "grp-y", "summary-bottom-lhs-minus1", "- 1", "- b", "orange", {
            showSlot: be.lhsGap1 || be.lhsMinus1,
            slotOpen: be.lhsGap1Open || be.lhsMinus1,
            filled: be.lhsMinus1,
            brackets: be.brackets,
          }),
        );
      } else {
        parts.push(renderVar("x", "summary-bottom-lhs-x"));
        parts.push(renderOp("+", "bot-op1"));
        parts.push(renderVar("y", "summary-bottom-lhs-y"));
      }
      parts.push(renderOp("=", "bot-eq"));
      parts.push(
        React.createElement(
          "span",
          { key: "rhs", className: "summary-eq-rhs is-expanded" },
          renderValueTerm("2", "c", be.rhsPlus2Gone ? "summary-bottom-rhs-final" : "summary-bottom-rhs-2-first", {
            color: be.colored.rhs2 ? "yellow" : null,
            hidden: be.hiddenTargets.rhs2,
          }),
          !be.rhsPlus2Gone
            ? renderTerm("+ 2", "summary-bottom-rhs-plus2", {
                color: be.colored.rhsPlus2 ? "pink" : null,
                hidden: be.hiddenTargets.rhsPlus2,
              })
            : null,
          !be.rhsPlus1Gone
            ? renderTerm("+ 1", "summary-bottom-rhs-plus1", {
                color: be.colored.rhsPlus1 ? "orange" : null,
                hidden: be.hiddenTargets.rhsPlus1,
              })
            : null,
        ),
      );
    } else if (be.mode === "flat") {
      parts.push(renderVar("x", "summary-bottom-lhs-x"));
      parts.push(renderLhsSlot("lhs-slot2", "summary-bottom-lhs-minus2", true, true, "- 2", "- a", "pink"));
      parts.push(renderOp("+", "bot-op1"));
      parts.push(renderVar("y", "summary-bottom-lhs-y"));
      parts.push(renderLhsSlot("lhs-slot1", "summary-bottom-lhs-minus1", true, true, "- 1", "- b", "orange"));
      parts.push(renderOp("=", "bot-eq"));
      parts.push(
        React.createElement(
          "span",
          { key: "rhs", className: "summary-eq-rhs" },
          renderTerm("2", "summary-bottom-rhs-final", {
            color: be.colored.rhs2 ? "yellow" : null,
          }),
        ),
      );
    } else {
      parts.push(renderVar("x"));
      parts.push(renderOp("+", "bot-op1"));
      parts.push(renderVar("y"));
      parts.push(renderOp("=", "bot-eq"));
      parts.push(
        React.createElement(
          "span",
          { key: "rhs", className: "summary-eq-rhs" },
          be.rhsFiveVisible
            ? renderTerm("5", "summary-bottom-rhs-5", {
                fadingOut: be.fadingFive,
              })
            : null,
        ),
      );
    }

    return React.createElement("span", { className: "summary-eq-inner" }, parts);
  };

  const isClickable =
    introPhase >= 5 &&
    !isAnimating &&
    (bottomEq.interaction === "idle" ||
      bottomEq.interaction === "expandDone" ||
      bottomEq.interaction === "rewriteDone" ||
      bottomEq.interaction === "compareDone");

  const flyCloneEls = flyClones.map((clone) => {
    const content = clone.signFlip
      ? [
          React.createElement(
            "span",
            {
              key: "from",
              className:
                "summary-fly-sign" +
                (clone.signFlipped ? " is-out" : " is-in"),
            },
            clone.signFlip.from,
          ),
          React.createElement(
            "span",
            {
              key: "to",
              className:
                "summary-fly-sign" +
                (clone.signFlipped ? " is-in" : " is-out"),
            },
            clone.signFlip.to,
          ),
        ]
      : clone.text;

    return React.createElement(
      "div",
      {
        key: clone.id,
        className:
          "summary-fly-clone" +
          (clone.signFlip ? " has-sign-flip" : "") +
          (clone.animating ? " is-animating" : ""),
        style: {
          left: clone.startX + "px",
          top: clone.startY + "px",
          color: clone.color,
          fontSize: clone.fontSize,
          fontFamily: clone.fontFamily,
          fontStyle: clone.fontStyle,
          fontWeight: clone.fontWeight,
          "--fly-dx": clone.dx + "px",
          "--fly-dy": clone.dy + "px",
        },
      },
      content,
    );
  });

  const bottomTextHtml =
    bottomTextKey === "pattern"
      ? texts.bottomTextPattern
      : bottomTextKey === "generalForm"
        ? texts.bottomTextGeneralForm
        : texts.bottomText;

  const renderCoordValue = (numeric, letter, colorClass, id) => {
    const content = bottomEq.morphActive
      ? React.createElement(
          "span",
          { className: "summary-morph-term" },
          React.createElement(
            "span",
            {
              className:
                "summary-morph-from" + (bottomEq.morphFlip ? " is-out" : " is-in"),
            },
            "+ " + numeric,
          ),
          React.createElement(
            "span",
            {
              className:
                "summary-morph-to" + (bottomEq.morphFlip ? " is-in" : " is-out"),
            },
            "+ " + letter,
          ),
        )
      : bottomEq.generalized
        ? "+ " + letter
        : "+ " + numeric;

    return React.createElement(
      "span",
      { className: colorClass, id: id },
      content,
    );
  };

  if (step === 11) {
    return React.createElement(
      "div",
      { className: "summary-canvas", ref: canvasRef },
      React.createElement(
        "div",
        { className: "summary-flow", ref: flowRef },
        spotlightPoints
          ? React.createElement(
              "svg",
              {
                className:
                  "summary-spotlights" +
                  (bottomEq.spotlightsVisible ? " is-visible" : ""),
              },
              spotlightPoints.x
                ? React.createElement("polygon", {
                    className: "summary-spotlight summary-spotlight-x",
                    points: spotlightPoints.x,
                  })
                : null,
              spotlightPoints.y
                ? React.createElement("polygon", {
                    className: "summary-spotlight summary-spotlight-y",
                    points: spotlightPoints.y,
                  })
                : null,
            )
          : null,
        React.createElement(
          "span",
          {
            className:
              "summary-label is-yellow summary-cell-label-top" +
              (introPhase >= 1 ? " is-visible" : ""),
          },
          texts.originalLabel,
        ),
        React.createElement(
          "div",
          {
            className:
              "summary-eq-box is-yellow summary-cell-box-top" +
              (introPhase >= 1 ? " is-visible" : ""),
          },
          React.createElement(
            "span",
            { className: "summary-eq-inner", id: "summary-top-eq" },
            renderVar("x", "summary-top-var-x"),
            renderOp("+", "top-op1"),
            renderVar("y", "summary-top-var-y"),
            renderOp("=", "top-eq"),
            renderValueTerm("2", "c", "summary-top-rhs-2", { color: "yellow" }),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "summary-arrow-block summary-cell-arrow" +
              (introPhase >= 2 ? " is-visible" : "") +
              (bottomEq.arrowCompareMode ? " is-compare-mode" : "") +
              (bottomEq.hideVerticalArrow ? " is-vertical-hidden" : ""),
          },
          React.createElement(
            "div",
            {
              className:
                "summary-arrow-col" +
                (bottomEq.hideVerticalArrow ? " is-hidden" : ""),
            },
            React.createElement("div", { className: "summary-arrow-line" }),
            React.createElement("div", { className: "summary-arrow-head" }),
          ),
          React.createElement(
            "div",
            { className: "summary-arrow-labels" },
            React.createElement("span", null, texts.translatesLabel),
            React.createElement(
              "span",
              { className: "summary-arrow-coords" },
              "(",
              renderCoordValue(dx, "a", "summary-coord-pink", "summary-arrow-dx"),
              ", ",
              renderCoordValue(dy, "b", "summary-coord-orange", "summary-arrow-dy"),
              ")",
            ),
          ),
        ),
        React.createElement(
          "span",
          {
            className:
              "summary-label is-green summary-cell-label-bottom" +
              (introPhase >= 3 ? " is-visible" : ""),
          },
          texts.translatedLabel,
        ),
        React.createElement(
          "div",
          {
            className:
              "summary-eq-box is-green summary-cell-box-bottom" +
              (introPhase >= 3 ? " is-visible" : "") +
              (bottomEq.mode !== "simple" ? " is-wide-content" : "") +
              (isClickable ? " is-clickable" : ""),
            id: "summary-translated-box",
            onClick: handleTranslatedClick,
          },
          renderBottomEquation(),
        ),
      ),
      React.createElement("div", {
        className:
          "summary-bottom-text" +
          (introPhase >= 4 && bottomTextVisible ? " is-visible" : "") +
          (!bottomTextVisible ? " is-fading-out" : ""),
        dangerouslySetInnerHTML: { __html: bottomTextHtml },
      }),
      flyCloneEls,
    );
  }

  return React.createElement(
    "div",
    { className: "summary-canvas" },
    React.createElement(
      "div",
      {
        style: {
          fontSize: "2vw",
          color: "rgba(255,255,255,0.5)",
          fontStyle: "italic",
        },
      },
      "Step " + step + " — coming soon",
    ),
  );
};
