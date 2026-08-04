const ScenarioChoicePanel = ({ scenario, onReady, onSelect }) => {
  const { useState, useEffect, useRef } = React;
  const intro = APP_DATA.scenarioIntro;
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    setShowLeft(false);
    setShowRight(false);
    const leftTimer = setTimeout(() => setShowLeft(true), 700);
    const rightTimer = setTimeout(() => setShowRight(true), 1500);
    const readyTimer = setTimeout(() => {
      if (typeof onReadyRef.current === "function") onReadyRef.current();
    }, 2200);
    return () => {
      clearTimeout(leftTimer);
      clearTimeout(rightTimer);
      clearTimeout(readyTimer);
    };
  }, [scenario.id]);

  const choose = (option) => {
    if (typeof playSound === "function") playSound("click");
    if (typeof onSelect === "function") onSelect(option);
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "main-canvas-left is-visible" },
      React.createElement("div", {
        className: "scenario-explanation" + (showLeft ? " is-visible" : ""),
        dangerouslySetInnerHTML: { __html: intro.explanation },
      }),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right is-visible" },
      React.createElement(
        "div",
        { className: "scenario-choice" + (showRight ? " is-visible" : "") },
        React.createElement("div", {
          className: "scenario-choice-prompt",
          dangerouslySetInnerHTML: { __html: intro.choicePrompt },
        }),
        React.createElement(
          "div",
          { className: "scenario-choice-options" },
          scenario.options.map((option) =>
            React.createElement(
              "button",
              {
                key: option,
                type: "button",
                className: "scenario-choice-option",
                onClick: () => choose(option),
              },
              option,
            ),
          ),
        ),
      ),
    ),
  );
};
