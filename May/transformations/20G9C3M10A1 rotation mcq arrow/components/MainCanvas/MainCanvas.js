const MainCanvas = (props) => {
  const {
    question,
    mcqOptions,
    mcqSelectedIndex,
    mcqSelectedIndices,
    mcqResultState,
    mcqShowFeedback,
    mcqFeedbackText,
    mcqFeedbackType,
    mcqDisabled,
    mcqMultiAnswer,
    onMcqSelect,
  } = props;

  if (!question) return null;

  const heading = getQuestionHeading(question);

  return React.createElement(
    "div",
    { className: "main-canvas-container rotation-mcq-layout" },
    React.createElement(
      "div",
      { className: "canvas-left-col" },
      React.createElement(VisualQuestion, {
        heading: heading,
        object: question.object,
        transformation: question.transformation,
        image: question.image,
      }),
    ),
    React.createElement(
      "div",
      { className: "canvas-right-col" },
      React.createElement(McqPanel, {
        options: mcqOptions,
        selectedIndex: mcqSelectedIndex,
        selectedIndices: mcqSelectedIndices,
        resultState: mcqResultState,
        showFeedback: mcqShowFeedback,
        feedbackText: mcqFeedbackText,
        feedbackType: mcqFeedbackType,
        disabled: mcqDisabled,
        multiAnswer: mcqMultiAnswer,
        onSelect: onMcqSelect,
      }),
    ),
  );
};
