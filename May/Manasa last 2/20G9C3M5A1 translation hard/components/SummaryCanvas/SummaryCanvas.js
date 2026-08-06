const SUMMARY_ANIM_DELAY_MS = 800;

const renderSummaryEquation = (equation) => {
  const tokens = equation.match(/([xy])|([+\-=])|(\d+)/g) || [];
  return React.createElement(
    "span",
    { className: "summary-eq-inner" },
    tokens.map((token, index) => {
      if (token === "x" || token === "y") {
        return React.createElement(
          "span",
          { key: index, className: "summary-math-var" },
          token,
        );
      }
      return React.createElement(
        "span",
        { key: index, className: "summary-eq-token" },
        token,
      );
    }),
  );
};

const SummaryCanvas = ({
  step,
  texts,
  translation,
  onNavChange,
  onStepAdvance,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;

  const [phase, setPhase] = useState(0);
  const animStartedRef = useRef(false);
  const cancelledRef = useRef(false);

  const dx = translation.dx;
  const dy = translation.dy;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const runAnimation = async () => {
      if (typeof onNavChange === "function") {
        onNavChange({ text: "", hidden: true, nudgeId: null });
      }

      setPhase(1);
      await delay(SUMMARY_ANIM_DELAY_MS);
      if (cancelledRef.current) return;

      setPhase(2);
      await delay(SUMMARY_ANIM_DELAY_MS);
      if (cancelledRef.current) return;

      setPhase(3);
      await delay(SUMMARY_ANIM_DELAY_MS);
      if (cancelledRef.current) return;

      setPhase(4);
      if (cancelledRef.current) return;

      setPhase(5);

      if (typeof onNavChange === "function") {
        onNavChange({
          text: APP_DATA.steps[11].navTapExplore,
          hidden: false,
          nudgeId: "summary-translated-box",
        });
      }
    };

    runAnimation();
  }, [step, onNavChange]);

  useEffect(() => {
    if (step !== 11) {
      animStartedRef.current = false;
      setPhase(0);
    }
  }, [step]);

  const handleTranslatedClick = useCallback(() => {
    if (phase < 5) return;
    if (typeof playSound === "function") playSound("click");
    if (typeof onStepAdvance === "function") onStepAdvance(12);
  }, [phase, onStepAdvance]);

  if (step === 11) {
    return React.createElement(
      "div",
      { className: "summary-canvas" },
      React.createElement(
        "div",
        { className: "summary-flow" },
        React.createElement(
          "span",
          {
            className:
              "summary-label is-yellow summary-cell-label-top" +
              (phase >= 1 ? " is-visible" : ""),
          },
          texts.originalLabel,
        ),
        React.createElement(
          "div",
          {
            className:
              "summary-eq-box is-yellow summary-cell-box-top" +
              (phase >= 1 ? " is-visible" : ""),
          },
          renderSummaryEquation(texts.originalEquation),
        ),
        React.createElement(
          "div",
          {
            className:
              "summary-arrow-block summary-cell-arrow" +
              (phase >= 2 ? " is-visible" : ""),
          },
          React.createElement(
            "div",
            { className: "summary-arrow-col" },
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
              React.createElement(
                "span",
                { className: "summary-coord-pink" },
                "+ " + dx,
              ),
              ", ",
              React.createElement(
                "span",
                { className: "summary-coord-orange" },
                "+ " + dy,
              ),
              ")",
            ),
          ),
        ),
        React.createElement(
          "span",
          {
            className:
              "summary-label is-green summary-cell-label-bottom" +
              (phase >= 3 ? " is-visible" : ""),
          },
          texts.translatedLabel,
        ),
        React.createElement(
          "div",
          {
            className:
              "summary-eq-box is-green summary-cell-box-bottom" +
              (phase >= 3 ? " is-visible" : "") +
              (phase >= 5 ? " is-clickable" : ""),
            id: "summary-translated-box",
            onClick: handleTranslatedClick,
          },
          renderSummaryEquation(texts.translatedEquation),
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "summary-bottom-text" + (phase >= 4 ? " is-visible" : ""),
          dangerouslySetInnerHTML: { __html: texts.bottomText },
        },
      ),
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
