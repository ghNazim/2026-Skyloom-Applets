const McqLayover = ({ title, options, correctAnswer, onAnswer, onOptionClick, visible }) => {
  const { useState } = React;
  const [feedback, setFeedback] = useState(null);

  const handleAnswer = (option) => {
    if (feedback) return;
    if (typeof onOptionClick === "function") onOptionClick();
    const isCorrect = option === correctAnswer;
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
        "mcq-layover" + (visible ? " mcq-layover--visible" : ""),
    },
    React.createElement("div", {
      className: "mcq-layover__title",
      dangerouslySetInnerHTML: { __html: title },
    }),
    React.createElement(
      "div",
      { className: "mcq-layover__options" },
      options.map(function (option) {
        var btnClass = "mcq-layover__btn";
        if (feedback === "correct" && option === correctAnswer) {
          btnClass += " mcq-layover__btn--correct";
        }
        if (feedback === "wrong" && option !== correctAnswer) {
          btnClass += " mcq-layover__btn--wrong";
        }
        return React.createElement(
          "button",
          {
            key: option,
            className: btnClass,
            onClick: function () {
              handleAnswer(option);
            },
            disabled: !!feedback,
          },
          option
        );
      })
    )
  );
};
