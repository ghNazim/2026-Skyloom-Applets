const MainCanvas = (props) => {
  const { question, onSetNextEnabled, onUpdateTexts } = props;
  const { useState, useEffect, useCallback } = React;

  const [resolved, setResolved] = useState(null);
  const [lastChosen, setLastChosen] = useState(null);

  useEffect(() => {
    setResolved(null);
    setLastChosen(null);
    onSetNextEnabled(false);
  }, [question, onSetNextEnabled]);

  const splitWeightText = (text) => {
    if (!text) return [];
    const re = /(\d+(?:[.,]\d+)?)/g;
    const out = [];
    let last = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) {
        out.push({ type: "text", value: text.slice(last, m.index) });
      }
      out.push({ type: "num", value: m[1] });
      last = m.index + m[1].length;
    }
    if (last < text.length) {
      out.push({ type: "text", value: text.slice(last) });
    }
    return out;
  };

  const renderWeightParts = (text) => {
    const parts = splitWeightText(text);
    return parts.map((p, i) => {
      if (p.type === "num") {
        return React.createElement(
          "span",
          { className: "weight-value-badge", key: "w-" + i },
          p.value,
        );
      }
      return React.createElement("span", {
        key: "t-" + i,
        dangerouslySetInnerHTML: { __html: handleComma(p.value) },
      });
    });
  };

  const feedbackHtml = (multiline) => {
    if (!multiline) return "";
    return multiline
      .split("\n")
      .map((line) => handleComma(line))
      .join("<br>");
  };

  const handleChoice = useCallback(
    (side) => {
      if (!question) return;
      if (resolved === "correct") return;

      const isCorrect = side === question.correct;

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setResolved("correct");
        setLastChosen(side);
        onSetNextEnabled(true);
        onUpdateTexts(question.navCorrect);
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setResolved("wrong");
        setLastChosen(side);
      }
    },
    [question, resolved, onSetNextEnabled, onUpdateTexts],
  );

  const cardClass = (side) => {
    var cls = "comparison-card";
    if (resolved === "correct" && side === question.correct) {
      cls += " comparison-card--correct";
    } else if (resolved === "wrong" && lastChosen === side) {
      cls += " comparison-card--wrong";
    }
    return cls;
  };

  const buttonClass = (side) => {
    var cls = "compare-option-btn";
    if (resolved === "correct" && side === question.correct) {
      cls += " compare-option-btn--correct";
    } else if (resolved === "wrong" && lastChosen === side) {
      cls += " compare-option-btn--wrong";
    }
    return cls;
  };

  const feedbackBox =
    resolved === null
      ? null
      : React.createElement(
          "div",
          {
            className:
              "feedback-box " +
              (resolved === "correct"
                ? "feedback-box--correct"
                : "feedback-box--wrong"),
          },
          React.createElement("div", {
            className: "feedback-box__inner",
            dangerouslySetInnerHTML: {
              __html: feedbackHtml(
                resolved === "correct"
                  ? question.correctFeedback
                  : question.wrongFeedback,
              ),
            },
          }),
        );

  return React.createElement(
    "div",
    { className: "main-canvas-weight" },
    React.createElement(
      "div",
      { className: "weight-main-row" },
      React.createElement(
        "div",
        { className: "visual-column" },
        React.createElement(
          "div",
          { className: cardClass("l") },
          React.createElement(
            "div",
            { className: "card-row card-row--image" },
            React.createElement("img", {
              className: "compare-image",
              src: question.imageLeft,
              alt: "",
            }),
          ),
          React.createElement(
            "div",
            { className: "card-row card-row--weight" },
            React.createElement(
              "div",
              { className: "weight-line" },
              renderWeightParts(question.weightTextLeft),
            ),
          ),
          React.createElement(
            "div",
            { className: "card-row card-row--button" },
            React.createElement(
              "button",
              {
                type: "button",
                className: buttonClass("l"),
                onClick: function () {
                  handleChoice("l");
                },
              },
              question.buttonTextLeft,
            ),
          ),
        ),
        React.createElement(
          "div",
          { className: cardClass("r") },
          React.createElement(
            "div",
            { className: "card-row card-row--image" },
            React.createElement("img", {
              className: "compare-image",
              src: question.imageRight,
              alt: "",
            }),
          ),
          React.createElement(
            "div",
            { className: "card-row card-row--weight" },
            React.createElement(
              "div",
              { className: "weight-line" },
              renderWeightParts(question.weightTextRight),
            ),
          ),
          React.createElement(
            "div",
            { className: "card-row card-row--button" },
            React.createElement(
              "button",
              {
                type: "button",
                className: buttonClass("r"),
                onClick: function () {
                  handleChoice("r");
                },
              },
              question.buttonTextRight,
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "feedback-column" },
        feedbackBox,
      ),
    ),
  );
};
