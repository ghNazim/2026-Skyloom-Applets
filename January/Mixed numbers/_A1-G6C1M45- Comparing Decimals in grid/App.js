// Comparing Decimals in Grid / App.js

const App = () => {
  const { useState, useEffect, useCallback } = React;

  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState(0); // 0: Start, 1-4: Steps, 5: Final
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [dynamicNavText, setDynamicNavText] = useState("");

  const handleStart = () => {
    playSound("click");
    setQIndex(0);
    setStep(1);
  };

  useEffect(() => {
    setIsNextDisabled(true);
    setDynamicNavText("");
  }, [step, qIndex]);

  const handleNext = () => {
    playSound("click");
    if (step < 6) {
      // Step 4 logic: either go to Step 5 (for Q1) or next question (Q2+)
      if (step === 4) {
         if (qIndex === 0) {
           // For Q1, user wanted step 5 interim screen
           setStep(5);
         } else {
           // For other questions, go to next question Step 3 directly
           if (qIndex < APP_DATA.questions.length - 1) {
             setQIndex(prev => prev + 1);
             setStep(3);
           } else {
             // End of questions -> Step 6
             setStep(6);
           }
         }
      } 
      // Step 5 logic (Interim for Q1): go to next question Step 3
      else if (step === 5) {
         if (qIndex < APP_DATA.questions.length - 1) {
             setQIndex(prev => prev + 1);
             setStep(3);
         } else {
             setStep(6);
         }
      }
      else {
         setStep(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    playSound("click");
    // No back navigation in this applet flow
  };

  const enableNext = useCallback((navOverride) => {
    setIsNextDisabled(false);
    if (navOverride) setDynamicNavText(navOverride);
  }, []);

  const getQuestionText = () => {
    if (step === 0 || step === 5 || step === 6) return "";
    const q = APP_DATA.questions[qIndex];
    if (step === 1) return q.step1.q;
    if (step === 2) return q.step2.q;
    if (step === 3) return q.step3.q;
    if (step === 4) return q.step4.q;
    return "";
  };

  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    if (step === 0 || step === 5 || step === 6) return "";
    const q = APP_DATA.questions[qIndex];
    if (step === 1) return q.step1.nav;
    if (step === 2) return q.step2.nav;
    if (step === 3) return q.step3.nav;
    if (step === 4) return q.step4.nav;
    return "";
  };

  // Step 0, 5, 6 - Fullscreen
  if (step === 0 || step === 5 || step === 6) {
    let screenData;
    if (step === 0) screenData = APP_DATA.start;
    else if (step === 5) screenData = APP_DATA.final;
    else screenData = APP_DATA.step6;

    return React.createElement("div", { className: "applet-container" },
      React.createElement("div", { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: screenData.heading,
          text: screenData.text,
          buttonText: screenData.buttonText,
          onButtonClick: (step === 0 || step === 6) ? handleStart : handleNext, 
        })
      )
    );
  }

  return React.createElement("div", { className: "applet-container" },
    React.createElement(QuestionPanel, { text: getQuestionText(), step: step }),
    React.createElement("div", { className: "app-main-content" },
      React.createElement(MainCanvas, {
        qIndex: qIndex,
        step: step,
        onEnableNext: enableNext,
      })
    ),
    React.createElement("div", { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: true,
        navText: getNavText()
      })
    )
  );
};