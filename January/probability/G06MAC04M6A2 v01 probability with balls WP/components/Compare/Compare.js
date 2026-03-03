const Compare = ({ compareIndex, onCorrect }) => {
  const { useState, useEffect } = React;
  const data = APP_DATA.compare;
  const comparison = data.compareData[compareIndex];

  const [filledOperator, setFilledOperator] = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [shakingBtn, setShakingBtn] = useState(null);
  const [boxShaking, setBoxShaking] = useState(false);

  useEffect(() => {
    setFilledOperator(null);
    setAnswerState(null);
    setShakingBtn(null);
    setBoxShaking(false);
  }, [compareIndex]);

  const handleOperatorClick = (op) => {
    if (answerState === "correct") return;

    setFilledOperator(op);

    if (op === comparison.correctOperator) {
      setAnswerState("correct");
      playSound("correct");
      onCorrect();
    } else {
      setAnswerState("wrong");
      playSound("wrong");
      setShakingBtn(op);
      setBoxShaking(true);
      setTimeout(() => {
        setShakingBtn(null);
        setBoxShaking(false);
      }, 300);
    }
  };

  const getButtonClass = (op) => {
    var cls = "compare-btn";
    if (answerState === "correct" && filledOperator === op) cls += " btn-correct";
    if (answerState === "wrong" && filledOperator === op) cls += " btn-wrong";
    if (shakingBtn === op) cls += " shake";
    return cls;
  };

  const operatorBoxClass =
    "operator-box" +
    (answerState === "correct" ? " operator-correct" : "") +
    (answerState === "wrong" ? " operator-wrong" : "") +
    (boxShaking ? " shake" : "");

  return React.createElement(
    "div",
    { className: "compare-container" },

    React.createElement("div", {
      className: "total-info-div",
      dangerouslySetInnerHTML: { __html: data.totalInfoText },
    }),

    React.createElement("div", {
      className: "compare-instruction",
      dangerouslySetInnerHTML: { __html: data.instructionText },
    }),

    React.createElement(
      "div",
      { className: "compare-scale-wrapper" },
      React.createElement(Scale, {
        allVisible: true,
        customImages: APP_DATA.scaleImages,
      })
    ),

    React.createElement(
      "div",
      { className: "compare-row" },
      React.createElement("img", {
        src: comparison.img1,
        className: "compare-ball",
        draggable: false,
      }),
      React.createElement(
        "div",
        { className: operatorBoxClass },
        filledOperator
      ),
      React.createElement("img", {
        src: comparison.img2,
        className: "compare-ball",
        draggable: false,
      })
    ),

    React.createElement(
      "div",
      { className: "compare-buttons-row" },
      ["<", "=", ">"].map((op) =>
        React.createElement(
          "button",
          {
            key: op,
            className: getButtonClass(op),
            onClick: () => handleOperatorClick(op),
            disabled: answerState === "correct",
          },
          op
        )
      )
    ),

    answerState !== null
      ? React.createElement("div", {
          className:
            "feedback-row " +
            (answerState === "correct"
              ? "feedback-correct"
              : "feedback-incorrect"),
          dangerouslySetInnerHTML: {
            __html:
              answerState === "correct"
                ? data.correctFeedback
                : data.wrongFeedback,
          },
        })
      : null
  );
};
