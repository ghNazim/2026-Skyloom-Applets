const MainCanvas = ({
  step,
  rotationAngle,
  showPathFeedback,
  showClockwiseArrow,
  arrowDrawProgress,
  mcq,
  mcqWrongIndices,
  mcqCorrectIndex,
  mcqAnswered,
  feedbackText,
  feedbackType,
  onMcqSelect,
  carAngle,
  showDanger,
  showCrashEffect,
  step4Direction,
  step4Angle,
  step4ShowFeedback,
  step4FeedbackText,
  step4FeedbackType,
  step4DirectionEnabled,
  step4SliderEnabled,
  step4ActionEnabled,
  step4ActionLabel,
  step4Locked,
  onStep4DirectionSelect,
  onStep4AngleChange,
  onStep4Action,
}) => {
  const isStep4 = step === 4;

  return React.createElement(
    "div",
    { className: "main-canvas-container rotation-mcq-layout" },
    React.createElement(
      "div",
      { className: "rotation-left-col" },
      React.createElement(
        "div",
        { className: "rotation-svg-wrap" },
        isStep4
          ? React.createElement(ParkingSvg, {
              carAngle: carAngle,
              showDanger: showDanger,
              showCrashEffect: showCrashEffect,
            })
          : React.createElement(RotationSvg, {
              step: step,
              rotationAngle: rotationAngle,
              showPathFeedback: showPathFeedback,
              showClockwiseArrow: showClockwiseArrow,
              arrowDrawProgress: arrowDrawProgress,
            }),
      ),
    ),
    React.createElement(
      "div",
      { className: "rotation-right-col" },
      React.createElement(
        "div",
        { className: "rotation-right-inner" },
        isStep4
          ? React.createElement(DescribeRotationPanel, {
              direction: step4Direction,
              angle: step4Angle,
              showFeedback: step4ShowFeedback,
              feedbackText: step4FeedbackText,
              feedbackType: step4FeedbackType,
              directionEnabled: step4DirectionEnabled,
              sliderEnabled: step4SliderEnabled,
              actionEnabled: step4ActionEnabled,
              actionLabel: step4ActionLabel,
              locked: step4Locked,
              onDirectionSelect: onStep4DirectionSelect,
              onAngleChange: onStep4AngleChange,
              onAction: onStep4Action,
            })
          : React.createElement(McqPanel, {
              mcq: mcq,
              wrongIndices: mcqWrongIndices,
              correctIndex: mcqCorrectIndex,
              answered: mcqAnswered,
              feedbackText: feedbackText,
              feedbackType: feedbackType,
              onSelect: onMcqSelect,
            }),
      ),
    ),
  );
};
