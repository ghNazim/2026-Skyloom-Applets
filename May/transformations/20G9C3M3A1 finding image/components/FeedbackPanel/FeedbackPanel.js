const FeedbackPanel = ({ feedback }) => {
  if (!feedback) {
    return React.createElement("div", { className: "feedback-panel" });
  }

  const feedbackClass =
    "locate-feedback " +
    (feedback.type === "wrong" ? "is-wrong" : "is-correct");

  return React.createElement(
    "div",
    { className: "feedback-panel" },
    React.createElement(
      "div",
      { className: feedbackClass },
      feedback.text,
    ),
  );
};
