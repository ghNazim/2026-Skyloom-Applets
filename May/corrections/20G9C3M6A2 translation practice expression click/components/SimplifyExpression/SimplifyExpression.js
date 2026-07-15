const HIGHLIGHT_HOLD_MS = 600;
const FINAL_BLINK_MS = 2000;
const REARRANGE_ANIMATION_MS = 980;

function tokenizeRearrangeExpression(text) {
  const matches = String(text || "").match(/\d+[xy]?|[xy]|[()+\-=/]/g);
  return (matches || []).map((value, index) => ({
    value,
    id: "token-" + index + "-" + value,
  }));
}

function buildRearrangeMatches(fromTokens, toTokens) {
  const availableTargets = {};
  toTokens.forEach((token, index) => {
    if (!availableTargets[token.value]) availableTargets[token.value] = [];
    availableTargets[token.value].push(index);
  });

  return fromTokens.map((token) => {
    const targets = availableTargets[token.value];
    return targets && targets.length ? targets.shift() : null;
  });
}

const RearrangeAnimation = ({ from, to, renderText }) => {
  const { useEffect, useMemo, useRef, useState } = React;
  const fromTokens = useMemo(() => tokenizeRearrangeExpression(from), [from]);
  const toTokens = useMemo(() => tokenizeRearrangeExpression(to), [to]);
  const matches = useMemo(
    () => buildRearrangeMatches(fromTokens, toTokens),
    [fromTokens, toTokens],
  );
  const matchedTargets = useMemo(
    () => matches.filter((targetIndex) => targetIndex !== null),
    [matches],
  );
  const oldRefs = useRef([]);
  const targetRefs = useRef([]);
  const [tokenMoves, setTokenMoves] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setTokenMoves(null);

    const measureFrame = requestAnimationFrame(() => {
      const moves = fromTokens.map((token, index) => {
        const targetIndex = matches[index];
        const oldNode = oldRefs.current[index];
        const targetNode =
          targetIndex === null ? null : targetRefs.current[targetIndex];

        if (!oldNode || !targetNode) {
          return { matched: false, x: "0px", y: "0px" };
        }

        const oldRect = oldNode.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();
        return {
          matched: true,
          x: targetRect.left - oldRect.left + "px",
          y: targetRect.top - oldRect.top + "px",
        };
      });

      setTokenMoves(moves);
      requestAnimationFrame(() => setIsPlaying(true));
    });

    return () => cancelAnimationFrame(measureFrame);
  }, [from, to, fromTokens, matches]);

  return React.createElement(
    "span",
    {
      className:
        "rearrange-animation" + (isPlaying ? " is-playing" : ""),
      "aria-label": to,
    },
    React.createElement(
      "span",
      { className: "rearrange-measure-stack", "aria-hidden": "true" },
      React.createElement(
        "span",
        { className: "rearrange-measure-row" },
        fromTokens.map((token, index) =>
          React.createElement(
            "span",
            {
              key: token.id,
              className: "rearrange-token",
            },
            renderText(token.value, "rearrange-source-measure-" + index),
          ),
        ),
      ),
      React.createElement(
        "span",
        { className: "rearrange-measure-row" },
        toTokens.map((token, index) =>
          React.createElement(
            "span",
            {
              key: token.id,
              className: "rearrange-token",
              ref: (node) => {
                targetRefs.current[index] = node;
              },
            },
            renderText(token.value, "rearrange-target-" + index),
          ),
        ),
      ),
    ),
    React.createElement(
      "span",
      { className: "rearrange-old-layer", "aria-hidden": "true" },
      fromTokens.map((token, index) => {
        const move = tokenMoves && tokenMoves[index];
        return React.createElement(
          "span",
          {
            key: token.id,
            className:
              "rearrange-token rearrange-old-token" +
              (move && move.matched ? " is-matched" : " is-removed"),
            ref: (node) => {
              oldRefs.current[index] = node;
            },
            style:
              move && move.matched
                ? { "--move-x": move.x, "--move-y": move.y }
                : undefined,
          },
          renderText(token.value, "rearrange-old-" + index),
        );
      }),
    ),
    React.createElement(
      "span",
      { className: "rearrange-new-layer", "aria-hidden": "true" },
      toTokens.map((token, index) =>
        React.createElement(
          "span",
          {
            key: token.id,
            className:
              "rearrange-token rearrange-new-token" +
              (matchedTargets.includes(index) ? " is-matched" : " is-added"),
          },
          renderText(token.value, "rearrange-new-" + index),
        ),
      ),
    ),
  );
};

const SimplifyExpression = ({
  simplifyConfig,
  phase,
  onHighlightClick,
  onFinalReached,
}) => {
  const { useState, useEffect } = React;

  const [displayPhase, setDisplayPhase] = useState(phase);
  const [borderRemoving, setBorderRemoving] = useState(false);
  const [innerText, setInnerText] = useState(null);
  const [innerSwapping, setInnerSwapping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [holdingAfterSwap, setHoldingAfterSwap] = useState(false);
  const [finalBlinking, setFinalBlinking] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);
  const [rearrangeState, setRearrangeState] = useState(null);

  const phases = simplifyConfig.phases;
  const actions = simplifyConfig.actions;
  const renderText = (text, keyPrefix) =>
    typeof renderMathVars === "function" ? renderMathVars(text, keyPrefix) : text;
  const formatHtml = (html) =>
    typeof formatMathVarsInHtml === "function"
      ? formatMathVarsInHtml(html)
      : html;

  useEffect(() => {
    setDisplayPhase(phase);
    setInnerText(null);
    setBorderRemoving(false);
    setInnerSwapping(false);
    setIsAnimating(false);
    setHoldingAfterSwap(false);
    setFinalBlinking(false);
    setShowConclusion(false);
    setRearrangeState(null);
  }, [phase, simplifyConfig]);

  const runFinalSequence = () => {
    setHoldingAfterSwap(true);
    setFinalBlinking(true);

    setTimeout(() => {
      setShowConclusion(true);
      setHoldingAfterSwap(false);
      setFinalBlinking(false);
      setIsAnimating(false);
      setTimeout(() => {
        if (typeof onFinalReached === "function") onFinalReached();
      }, 450);
    }, FINAL_BLINK_MS);
  };

  const handleClick = () => {
    if (isAnimating || holdingAfterSwap || showConclusion) return;
    const action = actions[displayPhase];
    if (!action) return;

    const config = phases[displayPhase];
    const isFinalClick = action.nextPhase === null;
    setIsAnimating(true);
    setBorderRemoving(true);

    const finishSwap = () => {
      if (isFinalClick) {
        runFinalSequence();
        return;
      }

      setHoldingAfterSwap(true);

      setTimeout(() => {
        setDisplayPhase(action.nextPhase);
        setInnerText(null);
        setBorderRemoving(false);
        setHoldingAfterSwap(false);
        setIsAnimating(false);
        setRearrangeState(null);
        if (typeof onHighlightClick === "function") {
          onHighlightClick(action.nextPhase);
        }
      }, HIGHLIGHT_HOLD_MS);
    };

    if (config && config.type === "r") {
      setRearrangeState({
        from: config.highlight,
        to: action.innerTo,
      });

      setTimeout(() => {
        setInnerText(action.innerTo);
        setRearrangeState(null);
        finishSwap();
      }, REARRANGE_ANIMATION_MS);
      return;
    }

    setTimeout(() => {
      setInnerSwapping(true);
      setTimeout(() => {
        setInnerText(action.innerTo);
        setInnerSwapping(false);
        finishSwap();
      }, 320);
    }, 200);
  };

  if (showConclusion) {
    return React.createElement(
      "div",
      { className: "simplify-expression-box conclusion" },
      React.createElement("div", {
        className: "simplify-expression-inner conclusion-text is-visible",
        dangerouslySetInnerHTML: { __html: formatHtml(simplifyConfig.conclusionText) },
      }),
    );
  }

  const config = phases[displayPhase];
  if (!config) return null;

  if (holdingAfterSwap && innerText !== null) {
    if (finalBlinking) {
      return React.createElement(
        "div",
        { className: "simplify-expression-box" },
        React.createElement(
          "div",
          { className: "simplify-expression-inner final-expression is-blinking" },
          React.createElement(
            "span",
            { className: "simplify-plain" },
            renderText(simplifyConfig.finalExpression, "final-expression"),
          ),
        ),
      );
    }

    return React.createElement(
      "div",
      { className: "simplify-expression-box" },
      React.createElement(
        "div",
        { className: "simplify-expression-inner" },
        config.prefix
          ? React.createElement(
              "span",
              { className: "simplify-plain" },
              renderText(config.prefix, "hold-prefix"),
            )
          : null,
        React.createElement(
          "span",
          { className: "simplify-plain" },
          renderText(innerText, "hold-inner"),
        ),
        config.suffix
          ? React.createElement(
              "span",
              { className: "simplify-plain" },
              renderText(config.suffix, "hold-suffix"),
            )
          : null,
      ),
    );
  }

  const highlightContent = config.highlight;

  const renderHighlight = () => {
    if (!highlightContent) return null;

    return React.createElement(
      "span",
      {
        className:
          "simplify-highlight" +
          (borderRemoving ? " is-removing" : "") +
          (isAnimating ? " is-disabled" : ""),
        onClick: handleClick,
      },
      React.createElement(
        "span",
        {
          className:
            "highlight-inner" + (innerSwapping ? " is-swapping" : " is-visible"),
        },
        rearrangeState
          ? React.createElement(RearrangeAnimation, {
              from: rearrangeState.from,
              to: rearrangeState.to,
              renderText: renderText,
            })
          : renderText(highlightContent, "highlight-" + displayPhase),
      ),
    );
  };

  return React.createElement(
    "div",
    { className: "simplify-expression-box" },
    React.createElement(
      "div",
      { className: "simplify-expression-inner" },
      config.prefix
        ? React.createElement(
            "span",
            { className: "simplify-plain" },
            renderText(config.prefix, "prefix-" + displayPhase),
          )
        : null,
      renderHighlight(),
      config.suffix
        ? React.createElement(
            "span",
            { className: "simplify-plain" },
            renderText(config.suffix, "suffix-" + displayPhase),
          )
        : null,
    ),
  );
};
