const MainCanvas = (props) => {
  const {
    step,
    initialStage,
    showNudges,
    onSetNextEnabled,
    onUpdateNavText,
    onUpdateQuestionText,
    onGoToStep,
  } = props;
  const e = React.createElement;
  const sharedProps = {
    initialStage: initialStage || "start",
    showNudges: showNudges !== false,
    onSetNextEnabled: onSetNextEnabled,
    onUpdateNavText: onUpdateNavText,
    onUpdateQuestionText: onUpdateQuestionText,
  };

  if (step === 1) {
    return e(Mode, sharedProps);
  }

  if (step === 8 || step === 9) {
    return e(Mean, Object.assign({ step: step }, sharedProps));
  }

  return e(Median, Object.assign({ step: step, onGoToStep: onGoToStep }, sharedProps));
};
