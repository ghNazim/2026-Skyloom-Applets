const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  
  // Substep for comprehend step
  const [comprehendSubstep, setComprehendSubstep] = useState(0);
  
  // Dynamic text state
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");
  
  // Highlight state for question panel
  const [currentHighlights, setCurrentHighlights] = useState(null);
  const [highlightColor, setHighlightColor] = useState(null);
  
  // Image state for visual panel
  const [currentImage, setCurrentImage] = useState("");
  
  // Calculation state (persistent across steps)
  const [calcState, setCalcState] = useState({
    // Step 3 MCQ
    mcqStep3Answered: false,
    // Step 6 MCQ + calc
    mcqStep6Answered: false,
    step6BoxClicked: false,
    step6NumpadAnswered: false,
    step6NumpadValue: "",
    // Step 7 interactive boxes
    step7BoxIndex: 0,
    step7AllBoxesDone: false,
    // Step 8 conversion
    step8BoxClicked: false,
    // Step 9 setup
    step9BoxClicked: false,
    // Step 10 numpad
    step10Numpad1Answered: false,
    step10Numpad1Value: "",
    step10Numpad2Answered: false,
    step10Numpad2Value: "",
    // Step 11 MCQ
    mcqStep11Answered: false,
    // Step 12 calc
    step12BoxClicked: false,
    step12NumpadAnswered: false,
    step12NumpadValue: "",
    // Findings
    findings: []
  });

  const handleRestart = () => {
    if (window.playSound) window.playSound("click");
    setCurrentStep(0);
    setIsNextDisabled(true);
    setComprehendSubstep(0);
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    setCurrentImage("");
    setCalcState({
      mcqStep3Answered: false,
      mcqStep6Answered: false,
      step6BoxClicked: false,
      step6NumpadAnswered: false,
      step6NumpadValue: "",
      step7BoxIndex: 0,
      step7AllBoxesDone: false,
      step8BoxClicked: false,
      step9BoxClicked: false,
      step10Numpad1Answered: false,
      step10Numpad1Value: "",
      step10Numpad2Answered: false,
      step10Numpad2Value: "",
      mcqStep11Answered: false,
      step12BoxClicked: false,
      step12NumpadAnswered: false,
      step12NumpadValue: "",
      findings: []
    });
  };

  // Reset state for going back to a target step
  const resetStateForStep = (targetStep) => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);

    if (targetStep <= 0) {
      setComprehendSubstep(0);
      setCalcState({
        mcqStep3Answered: false,
        mcqStep6Answered: false,
        step6BoxClicked: false,
        step6NumpadAnswered: false,
        step6NumpadValue: "",
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep === 1) {
      setComprehendSubstep(0);
      setCalcState({
        mcqStep3Answered: false,
        mcqStep6Answered: false,
        step6BoxClicked: false,
        step6NumpadAnswered: false,
        step6NumpadValue: "",
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep <= 2) {
      setCalcState({
        mcqStep3Answered: false,
        mcqStep6Answered: false,
        step6BoxClicked: false,
        step6NumpadAnswered: false,
        step6NumpadValue: "",
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep === 3) {
      setCalcState({
        mcqStep3Answered: false,
        mcqStep6Answered: false,
        step6BoxClicked: false,
        step6NumpadAnswered: false,
        step6NumpadValue: "",
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: []
      });
      return;
    }

    if (targetStep === 4) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: false,
        step6BoxClicked: false,
        step6NumpadAnswered: false,
        step6NumpadValue: "",
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: []
      }));
      return;
    }

    if (targetStep === 5) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: false,
        step6BoxClicked: false,
        step6NumpadAnswered: false,
        step6NumpadValue: "",
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: []
      }));
      return;
    }

    if (targetStep === 6) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: false,
        step6BoxClicked: false,
        step6NumpadAnswered: false,
        step6NumpadValue: "",
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: []
      }));
      return;
    }

    if (targetStep === 7) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: true,
        step6BoxClicked: true,
        step6NumpadAnswered: true,
        step6NumpadValue: APP_DATA.calculation.numpad.step6Answer,
        step7BoxIndex: 0,
        step7AllBoxesDone: false,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: [APP_DATA.findings.perimeterA]
      }));
      return;
    }

    if (targetStep === 8) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: true,
        step6BoxClicked: true,
        step6NumpadAnswered: true,
        step6NumpadValue: APP_DATA.calculation.numpad.step6Answer,
        step7BoxIndex: 3,
        step7AllBoxesDone: true,
        step8BoxClicked: false,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: [APP_DATA.findings.perimeterA]
      }));
      return;
    }

    if (targetStep === 9) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: true,
        step6BoxClicked: true,
        step6NumpadAnswered: true,
        step6NumpadValue: APP_DATA.calculation.numpad.step6Answer,
        step7BoxIndex: 3,
        step7AllBoxesDone: true,
        step8BoxClicked: true,
        step9BoxClicked: false,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: [APP_DATA.findings.perimeterA]
      }));
      return;
    }

    if (targetStep === 10) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: true,
        step6BoxClicked: true,
        step6NumpadAnswered: true,
        step6NumpadValue: APP_DATA.calculation.numpad.step6Answer,
        step7BoxIndex: 3,
        step7AllBoxesDone: true,
        step8BoxClicked: true,
        step9BoxClicked: true,
        step10Numpad1Answered: false,
        step10Numpad1Value: "",
        step10Numpad2Answered: false,
        step10Numpad2Value: "",
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: [APP_DATA.findings.perimeterA]
      }));
      return;
    }

    if (targetStep === 11) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: true,
        step6BoxClicked: true,
        step6NumpadAnswered: true,
        step6NumpadValue: APP_DATA.calculation.numpad.step6Answer,
        step7BoxIndex: 3,
        step7AllBoxesDone: true,
        step8BoxClicked: true,
        step9BoxClicked: true,
        step10Numpad1Answered: true,
        step10Numpad1Value: APP_DATA.calculation.numpad.step10Answer1,
        step10Numpad2Answered: true,
        step10Numpad2Value: APP_DATA.calculation.numpad.step10Answer2,
        mcqStep11Answered: false,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: [APP_DATA.findings.perimeterA, APP_DATA.findings.perimeterB]
      }));
      return;
    }

    if (targetStep === 12) {
      setCalcState(prev => ({
        ...prev,
        mcqStep3Answered: true,
        mcqStep6Answered: true,
        step6BoxClicked: true,
        step6NumpadAnswered: true,
        step6NumpadValue: APP_DATA.calculation.numpad.step6Answer,
        step7BoxIndex: 3,
        step7AllBoxesDone: true,
        step8BoxClicked: true,
        step9BoxClicked: true,
        step10Numpad1Answered: true,
        step10Numpad1Value: APP_DATA.calculation.numpad.step10Answer1,
        step10Numpad2Answered: true,
        step10Numpad2Value: APP_DATA.calculation.numpad.step10Answer2,
        mcqStep11Answered: true,
        step12BoxClicked: false,
        step12NumpadAnswered: false,
        step12NumpadValue: "",
        findings: [APP_DATA.findings.perimeterA, APP_DATA.findings.perimeterB]
      }));
      return;
    }
  };
  
  // Calculate total comprehend substeps
  const getTotalComprehendSubsteps = () => {
    const comprehendData = APP_DATA.comprehend;
    return comprehendData.given.data.length + comprehendData.toFind.data.length;
  };
  
  // Reset next button and dynamic texts on step change
  useEffect(() => {
    setDynamicQuestionText("");
    setDynamicNavText("");
    setCurrentHighlights(null);
    setHighlightColor(null);
    
    const stepData = APP_DATA.steps[currentStep];
    if (!stepData) return;
    
    // Set initial image
    if (stepData.image) {
      setCurrentImage(`${stepData.image}`);
    } else if (stepData.images) {
      setCurrentImage(`${stepData.images[0]}`);
    }
    
    // Handle next button state based on step type
    if (stepData.nextEnabled) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
    
    // Reset comprehend substep when entering step 1
    if (currentStep === 1) {
      setComprehendSubstep(0);
    }
  }, [currentStep]);

  // Update nav text for comprehend substeps
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = APP_DATA.steps[1];
      const total = getTotalComprehendSubsteps();
      const comprehendData = APP_DATA.comprehend;
      const givenCount = comprehendData.given.data.length;
      
      // Update highlights based on substep - one at a time
      if (comprehendSubstep < givenCount) {
        // Given items - show orange highlight for current item
        setCurrentHighlights([comprehendData.given.highlights[comprehendSubstep]]);
        setHighlightColor("orange");
      } else if (comprehendSubstep === givenCount) {
        // First toFind item - show purple highlight
        setCurrentHighlights(comprehendData.toFind.highlights);
        setHighlightColor("purple");
      } else {
        // Remove highlights for subsequent substeps
        setCurrentHighlights(null);
        setHighlightColor(null);
      }
      
      // Update image based on substep
      if (comprehendData.images && comprehendData.images[comprehendSubstep]) {
        setCurrentImage(comprehendData.images[comprehendSubstep]);
      }
      
      // Enable next button for comprehend substeps
      setIsNextDisabled(false);
      
      // Update nav text based on substep
      const isLastSubstep = comprehendSubstep === total - 1;
      const isLastGivenStep = comprehendSubstep === givenCount - 1;
      
      if (isLastSubstep) {
        // Last substep - show navTextCorrect
        if (stepData.navTextCorrect) {
          setDynamicNavText(stepData.navTextCorrect);
        }
      } else if (isLastGivenStep) {
        // Last given step - show navToFind
        if (stepData.navToFind) {
          setDynamicNavText(stepData.navToFind);
        }
      } else {
        // Given steps - show navText
        if (stepData.navText) {
          setDynamicNavText(stepData.navText);
        }
      }
    }
  }, [currentStep, comprehendSubstep]);

  const handleNext = () => {
    const stepData = APP_DATA.steps[currentStep];
    
    // Handle step 1 - comprehend with substeps
    if (currentStep === 1 && stepData.isSubstepComprehend) {
      const totalSubsteps = getTotalComprehendSubsteps();
      if (comprehendSubstep < totalSubsteps - 1) {
        // Move to next substep
        if (window.playSound) window.playSound("click");
        setComprehendSubstep(prev => prev + 1);
        return;
      }
    }
    
    // Final step - restart
    if (currentStep === 13) {
      handleRestart();
    } else {
      // Play congrats sound when reaching final step
      if (currentStep === 12) {
        if (window.playSound) window.playSound("congrats");
      } else {
        if (window.playSound) window.playSound("click");
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (window.playSound) window.playSound("click");
    
    // Handle step 1 - comprehend with substeps
    if (currentStep === 1) {
      if (comprehendSubstep > 0) {
        setComprehendSubstep(prev => prev - 1);
        return;
      }
    }
    
    if (currentStep <= 0) return;
    
    const targetStep = currentStep - 1;
    resetStateForStep(targetStep);
    setCurrentStep(targetStep);
    // Next button: enabled only if target step has nextEnabled (e.g. steps 0, 2, 5, 13)
    const targetStepData = APP_DATA.steps[targetStep];
    setIsNextDisabled(targetStepData ? !targetStepData.nextEnabled : true);
  };

  // Callback from components to enable Next button
  const enableNext = useCallback(() => {
    setIsNextDisabled(false);
  }, []);

  // Callback to update image
  const updateImage = useCallback((imageSrc) => {
    setCurrentImage(imageSrc);
  }, []);

  // Handlers for dynamic text updates
  const updateTexts = useCallback((question, nav) => {
    if (question !== undefined && question !== null) setDynamicQuestionText(question);
    if (nav !== undefined && nav !== null) setDynamicNavText(nav);
  }, []);

  // Content Selection
  const getQuestionText = () => {
    if (dynamicQuestionText) return dynamicQuestionText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.questionText : "";
  };
  
  const getNavText = () => {
    if (dynamicNavText) return dynamicNavText;
    const stepData = APP_DATA.steps[currentStep];
    return stepData ? stepData.navText : "";
  };
  
  // Get highlights for current step
  const getHighlights = () => {
    if (currentStep === 1) {
      return currentHighlights;
    }
    return null;
  };
  
  // Get highlight color for current step
  const getHighlightColor = () => {
    if (currentStep === 1) {
      return highlightColor;
    }
    return null;
  };

  const stepData = APP_DATA.steps[currentStep];

  // Splash Steps
  if (stepData?.isSplash) {
    const splashKey = stepData.splashKey;
    const splashData = APP_DATA.splash[splashKey];
    
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
        step: currentStep,
      }),
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(SplashScreen, {
          imageSrc: `${splashData.image}`,
          text: splashData.text,
          step: currentStep,
        })
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
          isNextDisabled: isNextDisabled,
          isPrevDisabled: currentStep <= 0,
          navText: getNavText(),
          nextSymbol: "»"
        })
      )
    );
  }

  // Step 0: Comprehend question only - full width content column with image
  if (currentStep === 0 && stepData?.isComprehendQuestion) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(QuestionPanel, {
        text: getQuestionText(),
        step: currentStep,
      }),
      React.createElement(
        "div",
        { className: "app-main-content" },
        React.createElement(
          "div",
          { className: "full-width-content-column" },
          React.createElement(
            "div",
            { className: "step0-content" },
            React.createElement(
              "div",
              { className: "comprehend-question-text" },
              APP_DATA.questionText
            ),
            React.createElement(
              "div",
              { className: "step0-image-container" },
              React.createElement("img", {
                src: stepData.questionImage,
                alt: APP_DATA.calculation.altTexts.triangles,
                className: "step0-image"
              })
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "lower-panel" },
        React.createElement(Navigation, {
          onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
          isNextDisabled: isNextDisabled,
          isPrevDisabled: currentStep <= 0,
          navText: getNavText(),
          nextSymbol: "»"
        })
      )
    );
  }

  // Main Canvas Steps
  return React.createElement(
    "div",
    { className: "applet-container" },
    React.createElement(QuestionPanel, {
      text: getQuestionText(),
      step: currentStep,
      highlights: getHighlights(),
      highlightColor: getHighlightColor()
    }),
    React.createElement(
      "div",
      { className: "app-main-content" },
      React.createElement(MainCanvas, {
        step: currentStep,
        onEnableNext: enableNext,
        onUpdateTexts: updateTexts,
        onUpdateImage: updateImage,
        currentImage: currentImage,
        comprehendSubstep: comprehendSubstep,
        calcState: calcState,
        setCalcState: setCalcState
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => dir === 'next' ? handleNext() : handlePrev(),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: currentStep <= 0,
        navText: getNavText(),
        nextSymbol: currentStep === 13 ? APP_DATA.start_over : "»"
      })
    )
  );
};
