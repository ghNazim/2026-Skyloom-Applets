const MainCanvas = ({
  step,
  currentQuestion,
  questionIndex,
  onStep1Correct,
  onStep2Correct,
}) => {
  const { useState, useEffect, useCallback } = React;

  const [buttonStates, setButtonStates] = useState({});
  const [step1Disabled, setStep1Disabled] = useState(false);
  const [step1Feedback, setStep1Feedback] = useState(null);

  const [sliderValue, setSliderValue] = useState(0);
  const [inputState, setInputState] = useState("normal");
  const [hasMovedSlider, setHasMovedSlider] = useState(false);
  const [step2Answered, setStep2Answered] = useState(false);
  const [step2Feedback, setStep2Feedback] = useState(null);

  useEffect(() => {
    setButtonStates({});
    setStep1Disabled(false);
    setStep1Feedback(null);
    setSliderValue(0);
    setInputState("normal");
    setHasMovedSlider(false);
    setStep2Answered(false);
    setStep2Feedback(null);
  }, [questionIndex, step]);

  const handleStep1Click = useCallback(
    (option, optionIdx) => {
      if (step1Disabled) return;

      const feedbacks = currentQuestion.feedbacks;
      const isCorrect = option === currentQuestion.step1Answer;
      const feedbackText = feedbacks && feedbacks[optionIdx] ? feedbacks[optionIdx] : "";
      setStep1Feedback({
        type: isCorrect ? "correct" : "incorrect",
        text: feedbackText,
      });

      if (isCorrect) {
        if (typeof playSound === "function") playSound("correct");
        setButtonStates({ [option]: "correct" });
        setStep1Disabled(true);
        onStep1Correct();
      } else {
        if (typeof playSound === "function") playSound("wrong");
        setStep1Disabled(true);
        setButtonStates({ [option]: "wrong" });
        setTimeout(() => {
          setButtonStates({});
          setStep1Disabled(false);
        }, 500);
      }
    },
    [step1Disabled, currentQuestion, onStep1Correct]
  );

  const handleSliderChange = useCallback(
    (e) => {
      if (step2Answered) return;
      const val = parseInt(e.target.value, 10);
      if (typeof playSound === "function") playSound("tick");
      setSliderValue(val);
      if (!hasMovedSlider) setHasMovedSlider(true);
      if (inputState === "wrong") {
        setInputState("normal");
        setStep2Feedback(null);
      }
    },
    [step2Answered, hasMovedSlider, inputState]
  );

  const handleCheck = useCallback(() => {
    if (step2Answered || !hasMovedSlider) return;

    const step2Feedbacks = currentQuestion.step2Feedbacks;

    if (sliderValue === currentQuestion.answer) {
      if (typeof playSound === "function") playSound("correct");
      setInputState("correct");
      setStep2Answered(true);
      setStep2Feedback(
        step2Feedbacks?.correct
          ? { type: "correct", text: step2Feedbacks.correct }
          : null
      );
      onStep2Correct();
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setInputState("wrong");
      setStep2Feedback(
        step2Feedbacks?.incorrect
          ? { type: "incorrect", text: step2Feedbacks.incorrect }
          : null
      );
    }
  }, [step2Answered, hasMovedSlider, sliderValue, currentQuestion, onStep2Correct]);

  const dims = currentQuestion.dims;

  const renderActionRow = () => {
    if (step === 1) {
      return React.createElement(
        "div",
        { className: "step1-action-wrap" },
        React.createElement(
          "div",
          { className: "step1-buttons" },
          APP_DATA.step1Options.map((option, idx) => {
            const state = buttonStates[option] || "default";
            return React.createElement(
              "button",
              {
                key: idx,
                className: "choice-btn choice-btn-" + state,
                onClick: () => handleStep1Click(option, idx),
                disabled: step1Disabled,
              },
              option
            );
          })
        ),
        React.createElement(
          "div",
          { className: "feedback-row" },
          React.createElement("div", {
            className: "mcq-feedback " + (step1Feedback ? step1Feedback.type : "hidden"),
            dangerouslySetInnerHTML: step1Feedback
              ? { __html: step1Feedback.text }
              : { __html: "&nbsp;" },
          })
        )
      );
    }

    return React.createElement(
      "div",
      { className: "step2-action-wrap" },
      React.createElement(
        "div",
        { className: "step2-controls" },
        React.createElement(
          "button",
          {
            className: "check-btn",
            onClick: handleCheck,
            disabled: step2Answered || !hasMovedSlider,
          },
          APP_DATA.checkText
        ),
        React.createElement(
          "div",
          { className: "slider-input-group" },
          React.createElement("input", {
            type: "text",
            className: "answer-input answer-input-" + inputState,
            value: hasMovedSlider ? sliderValue : "",
            readOnly: true,
          }),
          React.createElement("input", {
            type: "range",
            min: 0,
            max: APP_DATA.sliderMax,
            value: sliderValue,
            onChange: handleSliderChange,
            disabled: step2Answered,
            className: "answer-slider",
          })
        )
      ),
      React.createElement(
        "div",
        { className: "feedback-row" },
        React.createElement("div", {
          className: "mcq-feedback " + (step2Feedback ? step2Feedback.type : "hidden"),
          dangerouslySetInnerHTML: step2Feedback
            ? { __html: step2Feedback.text }
            : { __html: "&nbsp;" },
        })
      )
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-wrapper" },
    React.createElement(
      "div",
      { className: "visual-row" },
      React.createElement(Shape, { dims: dims })
    ),
    React.createElement(
      "div",
      { className: "action-row" },
      renderActionRow()
    )
  );
};
