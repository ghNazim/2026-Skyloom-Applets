const OptionsQuiz = ({
  questionIndex,
  correctAnswer,
  feedback,
  leftImg,
  rightImg,
  onLeftClick,
  onRightClick,
  labelTaller,
  labelShorter,
}) => {
  const ce = React.createElement;
  const clickable = feedback !== "correct";

  // q1, q3, q4: left is taller; q2: right is taller
  const leftIsTaller = questionIndex !== 1;
  const leftLabel = feedback === "correct" ? (leftIsTaller ? labelTaller : labelShorter) : null;
  const rightLabel = feedback === "correct" ? (leftIsTaller ? labelShorter : labelTaller) : null;

  const getLeftImage = () => {
    if (!feedback) return leftImg;
    if (feedback === "wrong") return leftImg.replace(".svg", "wrong.svg");
    if (feedback === "correct")
      return correctAnswer === "left"
        ? leftImg.replace(".svg", "correct.svg")
        : leftImg;
    return leftImg;
  };

  const getRightImage = () => {
    if (!feedback) return rightImg;
    if (feedback === "wrong") return rightImg.replace(".svg", "wrong.svg");
    if (feedback === "correct")
      return correctAnswer === "right"
        ? rightImg.replace(".svg", "correct.svg")
        : rightImg;
    return rightImg;
  };

  return ce(
    "div",
    { className: "options-quiz" },
    ce(
      "div",
      {
        className: "option-column left-option",
        onClick: clickable ? onLeftClick : undefined,
        style: { cursor: clickable ? "pointer" : "default" },
      },
      leftLabel &&
        ce("div", {
          className: "option-label",
          dangerouslySetInnerHTML: { __html: leftLabel },
        }),
      ce("img", {
        src: "assets/" + getLeftImage(),
        alt: "Left option",
        className: "option-image",
      }),
    ),
    ce(
      "div",
      {
        className: "option-column right-option",
        onClick: clickable ? onRightClick : undefined,
        style: { cursor: clickable ? "pointer" : "default" },
      },
      rightLabel &&
        ce("div", {
          className: "option-label",
          dangerouslySetInnerHTML: { __html: rightLabel },
        }),
      ce("img", {
        src: "assets/" + getRightImage(),
        alt: "Right option",
        className: "option-image",
      }),
    ),
  );
};
