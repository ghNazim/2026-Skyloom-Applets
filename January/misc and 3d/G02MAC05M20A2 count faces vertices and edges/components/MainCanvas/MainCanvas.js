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

  const [sliderValue, setSliderValue] = useState(0);
  const [inputState, setInputState] = useState("normal");
  const [hasMovedSlider, setHasMovedSlider] = useState(false);
  const [step2Answered, setStep2Answered] = useState(false);

  useEffect(() => {
    setButtonStates({});
    setStep1Disabled(false);
    setSliderValue(0);
    setInputState("normal");
    setHasMovedSlider(false);
    setStep2Answered(false);
  }, [questionIndex, step]);

  const handleStep1Click = useCallback(
    (option) => {
      if (step1Disabled) return;

      if (option === currentQuestion.step1Answer) {
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
      playSound('tick')
      setSliderValue(val);
      if (!hasMovedSlider) setHasMovedSlider(true);
      if (inputState === "wrong") setInputState("normal");
      else if (inputState !== "normal") setInputState("normal");
    },
    [step2Answered, hasMovedSlider, inputState]
  );

  const handleCheck = useCallback(() => {
    if (step2Answered || !hasMovedSlider) return;

    if (sliderValue === currentQuestion.answer) {
      if (typeof playSound === "function") playSound("correct");
      setInputState("correct");
      setStep2Answered(true);
      onStep2Correct();
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setInputState("wrong");
    }
  }, [step2Answered, hasMovedSlider, sliderValue, currentQuestion, onStep2Correct]);

  const dims = currentQuestion.dims;

  const renderActionRow = () => {
    if (step === 1) {
      return React.createElement(
        "div",
        { className: "step1-buttons" },
        APP_DATA.step1Options.map((option, idx) => {
          const state = buttonStates[option] || "default";
          return React.createElement(
            "button",
            {
              key: idx,
              className: "choice-btn choice-btn-" + state,
              onClick: () => handleStep1Click(option),
              disabled: step1Disabled,
            },
            option
          );
        })
      );
    }

    return React.createElement(
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
