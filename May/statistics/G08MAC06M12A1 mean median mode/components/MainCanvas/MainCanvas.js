const MainCanvas = (props) => {
  const { step, onSetNextEnabled, onUpdateNavText, onUpdateQuestionText, onGoToStep } = props;
  const e = React.createElement;

  if (step === 1) {
    return e(Mode, {
      onSetNextEnabled: onSetNextEnabled,
      onUpdateNavText: onUpdateNavText,
      onUpdateQuestionText: onUpdateQuestionText,
    });
  }

  if (step === 8 || step === 9) {
    return e(Mean, {
      step: step,
      onSetNextEnabled: onSetNextEnabled,
      onUpdateNavText: onUpdateNavText,
      onUpdateQuestionText: onUpdateQuestionText,
    });
  }

  return e(Median, {
    step: step,
    onSetNextEnabled: onSetNextEnabled,
    onUpdateNavText: onUpdateNavText,
    onUpdateQuestionText: onUpdateQuestionText,
    onGoToStep: onGoToStep,
  });
};
