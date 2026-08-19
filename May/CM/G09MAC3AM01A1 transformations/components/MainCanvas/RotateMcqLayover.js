const RotateMcqLayover = ({
  title,
  options,
  correctAnswer,
  onAnswer,
  onOptionClick,
  visible,
  yesShapeContent,
  noShapeContent,
}) => {
  const { useState } = React;
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = function (option) {
    if (feedback) return;
    if (typeof onOptionClick === "function") onOptionClick(option);
    var isCorrect = option === correctAnswer;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (typeof playSound === "function") {
      playSound(isCorrect ? "correct" : "wrong");
    }
    setTimeout(function () {
      onAnswer(isCorrect, option);
      setFeedback(null);
    }, isCorrect ? 400 : 800);
  };

  return React.createElement(
    "div",
    {
      className:
        "mcq-layover mcq-layover--rotate" +
        (visible ? " mcq-layover--visible" : ""),
    },
    React.createElement("div", { className: "mcq-layover--rotate__spacer" }),
    React.createElement(
      "div",
      { className: "mcq-layover--rotate__content" },
      React.createElement("div", {
        className: "mcq-layover__title",
        dangerouslySetInnerHTML: { __html: title },
      }),
      React.createElement(
        "div",
        { className: "mcq-layover__options mcq-layover__options--rotate" },
        options.map(function (option, i) {
          var btnClass = "mcq-layover__btn";
          if (feedback === "correct" && option === correctAnswer) {
            btnClass += " mcq-layover__btn--correct";
          }
          if (feedback === "wrong" && option !== correctAnswer) {
            btnClass += " mcq-layover__btn--wrong";
          }
          var shapeContent = i === 0 ? yesShapeContent : noShapeContent;
          return React.createElement(
            "div",
            { key: option, className: "mcq-layover__option-col" },
            React.createElement(
              "div",
              { className: "mcq-layover__grey-shape-slot" },
              shapeContent
            ),
            React.createElement(
              "button",
              {
                className: btnClass,
                onClick: function () {
                  handleAnswer(option);
                },
                disabled: !!feedback,
              },
              option
            )
          );
        })
      )
    )
  );
};
