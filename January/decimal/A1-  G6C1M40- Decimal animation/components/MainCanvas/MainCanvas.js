const MainCanvas = ({ step, onEnableNext, onAdvanceStep, onUpdateTexts, onDisableNext }) => {
  const { useState, useEffect, useCallback } = React;

  // Play sound helper
  const playSound = (name) => {
    if (window.playSound) window.playSound(name);
  };

  // Update texts based on step
  useEffect(() => {
    const stepData = APP_DATA.steps[step];
    if (!stepData) return;

    let q = stepData.questionText || "";
    let n = stepData.navText || "";

    onUpdateTexts(q, null, n);
  }, [step, onUpdateTexts]);

  // For steps 5 and 6, render the PlaceValuePanel
  if (step === 5 || step === 6) {
    return React.createElement(
      "div",
      { className: "main-canvas-container place-value-canvas" },
      React.createElement(PlaceValuePanel, {
        step: step,
        onEnableNext: onEnableNext,
        onDisableNext: onDisableNext,
        onAdvanceStep: onAdvanceStep,
      })
    );
  }

  // Default: return empty container for other steps
  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    null
  );
};
