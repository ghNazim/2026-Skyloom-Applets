// components/ConnectScreen/ConnectScreen.js
const ConnectScreen = ({
  stage,
  connectAnswer,
  onAnswer,
  showHint,
  onToggleHint,
  incorrectAnswer,
}) => {
  const h = React.createElement;
  const { useState, useEffect } = React;

  if (!stage) return null;

  const selected = connectAnswer;
  const isCorrect = selected === stage.correctAnswer;
  const hasAnswered = selected !== undefined;

  // Track hint blink state
  const [blinkHint, setBlinkHint] = useState(false);

  // Trigger hint blink when incorrect answer is selected
  useEffect(() => {
    if (incorrectAnswer) {
      setBlinkHint(true);
      setTimeout(() => setBlinkHint(false), 1500);
    }
  }, [incorrectAnswer]);

  // Determine which image to show
  const imageSrc =
    isCorrect && stage.correctImageSrc ? stage.correctImageSrc : stage.imageSrc;

  // Get hint content
  const hintContent = stage.hint;

  return h(
    "div",
    {
      className: "connect-content",
      style: { position: "relative", width: "100%", height: "100%" },
    },
    h(
      "div",
      { className: "left-section" },
      h(
        "div",
        { className: "triangle-box" },
        h(ImageVisualization, {
          imageSrc: imageSrc,
        })
      )
    ),
    h(
      "div",
      { className: "right-section" },
      // Hint button
      h(
        "button",
        {
          className: `hint-button-connect ${blinkHint ? "blink-hint" : ""}`,
          onClick: onToggleHint,
          title: T.ui.showHint,
        },
        h("img", {
          src: "assets/hint_bulb.png",
          alt: T.ui.hint,
          style: { width: "30px" },
        })
      ),
      // Feedback box - show for both correct and incorrect
      hasAnswered &&
        h(
          "div",
          {
            className: `feedback-box ${isCorrect ? "success" : "error"}`,
          },
          h(
            "p",
            null,
            isCorrect ? stage.correctFeedback : stage.incorrectFeedback
          )
        ),
      h("div", { className: "question-text" }, stage.stageTitle),
      h(
        "div",
        { className: "ratio-buttons" },
        ...stage.options.map((option, index) => {
          const isSelected = selected === index;
          const showCorrect = isSelected && isCorrect;
          const showWrong = isSelected && !isCorrect;
          const isCorrectOption = index === stage.correctAnswer;

          // When correct answer is selected, disable all buttons
          // Incorrect ones get less opacity, correct one keeps full opacity
          const shouldDisable = isCorrect;
          const shouldReduceOpacity = isCorrect && !isCorrectOption;

          return h("button", {
            key: index,
            className: `ratio-button ${
              showCorrect ? "correct" : showWrong ? "wrong" : ""
            }`,
            onClick: shouldDisable ? null : () => onAnswer(index),
            disabled: shouldDisable,
            style: shouldDisable
              ? {
                  cursor: "not-allowed",
                  opacity: shouldReduceOpacity ? 0.6 : 1,
                }
              : {},
            dangerouslySetInnerHTML: { __html: option },
          });
        })
      ),
      // Hint overlay
      showHint &&
        hintContent &&
        h(HintOverlay, {
          hint: { type: "text", content: hintContent },
          onClose: onToggleHint,
        })
    )
  );
};
