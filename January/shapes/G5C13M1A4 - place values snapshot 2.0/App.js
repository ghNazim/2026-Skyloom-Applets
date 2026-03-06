// Place Values up to 1 Million / App.js

const App = () => {
  const { useState } = React;

  // activeStep: -1 means initial (no button clicked yet), 0 to steps.length-1 are the steps
  const [activeStep, setActiveStep] = useState(-1);
  const [animating, setAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleButtonClick = (stepIndex) => {
    if (animating) return;
    playSound("click");
    setActiveStep(stepIndex);
  };

  const onAnimationComplete = (stepIndex) => {
    setCompletedSteps(prev => {
      if (!prev.includes(stepIndex)) return [...prev, stepIndex];
      return prev;
    });
    setAnimating(false);
  };

  return React.createElement("div", { className: "applet-container" },
    React.createElement(QuestionPanel, { text: APP_DATA.questionText }),
    React.createElement("div", { className: "app-main-content" },
      React.createElement(MainCanvas, {
        activeStep: activeStep,
        animating: animating,
        setAnimating: setAnimating,
        completedSteps: completedSteps,
        onButtonClick: handleButtonClick,
        onAnimationComplete: onAnimationComplete,
      })
    ),
    React.createElement("div", { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: () => {},
        isNextDisabled: true,
        isPrevDisabled: true,
        navText: completedSteps.includes(APP_DATA.steps.length - 1) ? APP_DATA.navLast : APP_DATA.navText
      })
    )
  );
};