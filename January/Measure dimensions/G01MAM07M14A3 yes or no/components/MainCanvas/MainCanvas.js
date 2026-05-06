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
  const texts = stepData?.texts || {};
  const currentQuestion = questions[questionIndex] || null;
  const isLastQuestion = questionIndex === questions.length - 1;
  const appOptions =
    Array.isArray(APP_DATA?.options) && APP_DATA.options.length
      ? APP_DATA.options
      : ["Yes", "No"];

  const getText = (key) => (key ? texts[key] || "" : "");
  const normalizeYesNo = (value) => {
    const normalized = String(value || "")
      .trim()
      .toLowerCase();

    if (normalized === "yes" || normalized === "ya") return "yes";
    if (normalized === "no" || normalized === "tidak") return "no";
    return normalized;
  };
  const ct = getText(currentQuestion?.ctKey);
  const navDefault = getText(stepData?.nKey || "nav_default");
  const navCorrect = getText(currentQuestion?.navCorrectKey);

  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);
    if (stepData) {
      onUpdateTexts(null, null, navDefault);
    }
  }, [step, questionIndex]);

  const getCharacterImage = () => {
    if (!isCorrect && selectedOption === null) return "chardefault.png";
    if (isCorrect) return "charhappy.png";
    if (selectedOption !== null && !isCorrect) return "charsad.png";
    return "chardefault.png";
  };

  const getImageSrc = () => {
    if (!currentQuestion) return null;
    if (selectedOption === null) return currentQuestion.image;
    if (isCorrect && currentQuestion.imageCorrect) return currentQuestion.imageCorrect;
    if (!isCorrect && currentQuestion.imageWrong) return currentQuestion.imageWrong;
    return currentQuestion.image;
  };

  const getVisualText = () => {
    if (!currentQuestion) return "";
    if (selectedOption === null) return getText(currentQuestion.vtKey);
    if (isCorrect && currentQuestion.vtCorrectKey) return getText(currentQuestion.vtCorrectKey);
    if (!isCorrect && currentQuestion.vtWrongKey) return getText(currentQuestion.vtWrongKey);
    return getText(currentQuestion.vtKey);
  };

  const handleOptionClick = (option) => {
    if (!currentQuestion || isCorrect) return;

    const correct =
      normalizeYesNo(currentQuestion.ans) === normalizeYesNo(option);
    setSelectedOption(option);

    if (correct) {
      setIsCorrect(true);
      if (typeof playSound === "function") playSound("correct");
      if (typeof confettiBurst === "function") confettiBurst();
      if (setIsAnswered) setIsAnswered(true);
      onEnableNext();
      onUpdateTexts(null, null, navCorrect);
    } else {
      if (typeof playSound === "function") playSound("wrong");
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
    }
  };

  if (step !== 1 || !currentQuestion) return null;

  const mcqData = {
    options: appOptions,
    feedbacks: {
      correct: getText(currentQuestion.feedbackCorrectKey),
      wrong: getText(currentQuestion.feedbackWrongKey),
    },
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container main-canvas-measure" },
    React.createElement(
      "div",
      { className: "column character-column", style: { width: "25%" } },
      React.createElement(CharacterPanel, {
        characterImage: getCharacterImage(),
        characterText: ct,
      })
    ),
    React.createElement(
      "div",
      { className: "column visual-column", style: { width: "50%" } },
      React.createElement(Visual, {
        imageSrc: getImageSrc(),
        visualCharacterSrc: currentQuestion.visualCharacter,
        visualText: getVisualText(),
      })
    ),
    React.createElement(
      "div",
      { className: "column mcq-column", style: { width: "25%" } },
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
