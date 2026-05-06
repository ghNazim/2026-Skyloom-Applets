const App = () => {
  const { useState, useMemo, useCallback } = React;

  const questions = APP_DATA.questions;
  const emptyState = () => ({
    input: "",
    feedback: null,
    hintShown: false,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [qStates, setQStates] = useState(() =>
    questions.map(() => emptyState()),
  );

  const resetEverything = useCallback(() => {
    setCurrentStep(0);
    setQuestionIndex(0);
    setQStates(questions.map(() => emptyState()));
  }, [questions]);

  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
    setQuestionIndex(0);
    setQStates(questions.map(() => emptyState()));
  };

  const handleStartOver = () => {
    if (typeof playSound === "function") playSound("click");
    resetEverything();
  };

  const patchQuestionState = useCallback(
    (patch) => {
      setQStates((prev) => {
        const next = prev.slice();
        next[questionIndex] = Object.assign({}, next[questionIndex], patch);
        return next;
      });
    },
    [questionIndex],
  );

  const navText = useMemo(() => {
    if (currentStep !== 1) return "";
    const step1 = APP_DATA.steps[1];
    const s = qStates[questionIndex];
    if (!s) return step1.navTextInitial;
    if (s.feedback === "correct") {
      return questionIndex === questions.length - 1
        ? step1.navTextLast
        : step1.navTextCorrect;
    }
    if (s.feedback === "wrong" && !s.hintShown) return step1.navTextWrong;
    return step1.navTextInitial;
  }, [currentStep, questionIndex, qStates, questions.length]);

  const isNextDisabled =
    currentStep !== 1 ||
    !qStates[questionIndex] ||
    qStates[questionIndex].feedback !== "correct";

  const isPrevDisabled = currentStep !== 1 || questionIndex <= 0;

  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep !== 1) return;
    if (qStates[questionIndex].feedback !== "correct") return;
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");
    if (currentStep === 1 && questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    }
  };

  const questionText = useMemo(() => {
    if (currentStep !== 1) return "";
    const q = questions[questionIndex];
    const tpl = APP_DATA.steps[1].questionTextTemplate;
    const a = q.name.charAt(0);
    const b = q.name.charAt(1);
    return tpl.replace("{0}", a).replace("{1}", b);
  }, [currentStep, questionIndex, questions]);

  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        }),
      ),
    );
  }

  if (currentStep === 2) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleStartOver,
          isFinal: !!APP_DATA.final.imageSrc,
          imageSrc: APP_DATA.final.imageSrc || undefined,
        }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: questionText,
      step: currentStep,
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        question: questions[questionIndex],
        qState: qStates[questionIndex],
        onPatchState: patchQuestionState,
      }),
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) =>
          dir === "next" ? handleNext() : dir === "prev" ? handlePrev() : null,
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: navText,
      }),
    ),
  );
};
