const MainCanvas = ({
  step,
  questionIndex,
  onEnableNext,
  onUpdateTexts,
  isAnswered,
  setIsAnswered,
}) => {
  const { useState, useEffect } = React;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  const stepData = APP_DATA.steps[step];
  const questions = stepData?.questions || [];
  const currentQuestion = questions[questionIndex] || null;
  const isLastQuestion = questionIndex === questions.length - 1;

  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    if (stepData) {
      onUpdateTexts(stepData.questionText, null, stepData.navText);
    }
  }, [step, questionIndex]);

  const handleOptionClick = (option) => {
    if (!currentQuestion || isCorrect) return;

    const correctOption = currentQuestion.options[currentQuestion.correct];
    setSelectedOption(option);

    if (option === correctOption) {
      setIsCorrect(true);
      if (typeof playSound === "function") playSound("correct");
      if (typeof confettiBurst === "function") confettiBurst();
      if (setIsAnswered) setIsAnswered(true);
      onEnableNext();
      const navText = isLastQuestion ? stepData.navLast : stepData.navNext;
      onUpdateTexts(null, null, navText);
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
    }
  };

  if (step !== 1 || !currentQuestion) return null;

  const mcqData = {
    title: stepData.mcqTitle,
    options: currentQuestion.options,
    feedbacks: stepData.feedbacks,
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container main-canvas-volume" },
    React.createElement(
      "div",
      { className: "column volume-canvas-column", style: { flex: "0 0 66%" } },
      React.createElement(VolumeCanvas3D, {
        positions: currentQuestion.positions,
        questionKey: questionIndex,
      })
    ),
    React.createElement(
      "div",
      { className: "column mcq-column", style: { flex: "0 0 34%" } },
      React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        onOptionClick: handleOptionClick,
        showFeedback: true,
        shake: wrongShake,
      })
    )
  );
};
