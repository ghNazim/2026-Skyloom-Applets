const HIGHLIGHT_HOLD_MS = 600;
const FINAL_BLINK_MS = 2000;

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

  const phases = simplifyConfig.phases;
  const actions = simplifyConfig.actions;

  useEffect(() => {
    setDisplayPhase(phase);
    setInnerText(null);
    setBorderRemoving(false);
    setInnerSwapping(false);
    setIsAnimating(false);
    setHoldingAfterSwap(false);
    setFinalBlinking(false);
    setShowConclusion(false);
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

    const isFinalClick = action.nextPhase === null;
    setIsAnimating(true);
    setBorderRemoving(true);

    setTimeout(() => {
      setInnerSwapping(true);
      setTimeout(() => {
        setInnerText(action.innerTo);
        setInnerSwapping(false);

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
          if (typeof onHighlightClick === "function") {
            onHighlightClick(action.nextPhase);
          }
        }, HIGHLIGHT_HOLD_MS);
      }, 320);
    }, 200);
  };

  if (showConclusion) {
    return React.createElement(
      "div",
      { className: "simplify-expression-box conclusion" },
      React.createElement("div", {
        className: "simplify-expression-inner conclusion-text is-visible",
        dangerouslySetInnerHTML: { __html: simplifyConfig.conclusionText },
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
            simplifyConfig.finalExpression,
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
          ? React.createElement("span", { className: "simplify-plain" }, config.prefix)
          : null,
        React.createElement("span", { className: "simplify-plain" }, innerText),
        config.suffix
          ? React.createElement("span", { className: "simplify-plain" }, config.suffix)
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
        highlightContent,
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
        ? React.createElement("span", { className: "simplify-plain" }, config.prefix)
        : null,
      renderHighlight(),
      config.suffix
        ? React.createElement("span", { className: "simplify-plain" }, config.suffix)
        : null,
    ),
  );
};
