const Mcq = ({
  title,
  options,
  optionHtml,
  answer,
  onCorrect,
  onWrong,
  wrongFeedback,
  correctFeedback,
  feedbackInPlace,
}) => {
  const { useState } = React;
  const [wrongOptions, setWrongOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(null);

  const getOptionLabel = (option) => {
    if (optionHtml && optionHtml[option]) return optionHtml[option];
    return option;
  };

  const getHeaderHtml = () => {
    if (feedbackInPlace && feedbackMode === "wrong") return wrongFeedback;
    if (feedbackInPlace && feedbackMode === "correct") return correctFeedback;
    return title;
  };

  const getHeaderClass = () => {
    if (!feedbackInPlace || !feedbackMode) return "mcq-title";
    return "mcq-title " + feedbackMode;
  };

  const handleOptionClick = (option) => {
    if (answered) return;

    if (option === answer) {
      setAnswered(true);
      if (feedbackInPlace) setFeedbackMode("correct");
      if (typeof playSound === "function") playSound("correct");
      if (typeof onCorrect === "function") onCorrect();
      return;
    }

    if (typeof playSound === "function") playSound("wrong");
    setWrongOptions((prev) =>
      prev.includes(option) ? prev : prev.concat(option)
    );
    if (feedbackInPlace) setFeedbackMode("wrong");
    if (typeof onWrong === "function") onWrong();
  };

  const headerHtml = getHeaderHtml();
  const processedHeader =
    typeof handleComma === "function" ? handleComma(headerHtml) : headerHtml;

  return React.createElement(
    "div",
    { className: "mcq-component" },
    React.createElement("div", {
      className: getHeaderClass(),
      dangerouslySetInnerHTML: { __html: processedHeader },
    }),
    React.createElement(
      "div",
      { className: "mcq-options-container" },
      options.map((option) => {
        const isWrong = wrongOptions.includes(option);
        const isCorrect = answered && option === answer;
        return React.createElement(
          "button",
          {
            key: option,
            type: "button",
            className:
              "mcq-option-button" +
              (isWrong ? " incorrect" : "") +
              (isCorrect ? " correct" : ""),
            onClick: () => handleOptionClick(option),
            disabled: answered,
            dangerouslySetInnerHTML: {
              __html:
                typeof handleComma === "function"
                  ? handleComma(getOptionLabel(option))
                  : getOptionLabel(option),
            },
          }
        );
      })
    )
  );
};
