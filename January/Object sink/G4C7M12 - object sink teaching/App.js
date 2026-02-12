const App = () => {
  const { useState, useEffect, useCallback } = React;

  // Step states: 0 = start fullscreen, 1 = select & drop object, 2 = calculation, 3 = final fullscreen
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);

  // Object selection state
  const [currentObject, setCurrentObject] = useState(null);
  const [dropProgress, setDropProgress] = useState(0); // 0–1, next enabled only at 1
  const [completedObjects, setCompletedObjects] = useState([]);

  // Calculation substep state (0-3 for step 2)
  const [calculationSubstep, setCalculationSubstep] = useState(0);
  const [visibleCalculationLines, setVisibleCalculationLines] = useState(2);

  // Dynamic text states
  const [dynamicQuestionText, setDynamicQuestionText] = useState("");
  const [dynamicNavText, setDynamicNavText] = useState("");

  // Get step data
  const getStepData = (step) => APP_DATA.steps[step] || {};

  // Handle start button click
  const handleStart = () => {
    if (typeof playSound === "function") playSound("click");
    setCurrentStep(1);
  };

  // Handle restart button click
  const handleRestart = () => {
    if (typeof playSound === "function") playSound("click");
    // Reset all states
    setCurrentStep(0);
    setCurrentObject(null);
    setDropProgress(0);
    setCompletedObjects([]);
    setCalculationSubstep(0);
    setVisibleCalculationLines(2);
    setIsNextDisabled(true);
    setIsPrevDisabled(true);
    setDynamicQuestionText("");
    setDynamicNavText("");
  };

  // Handle object selection
  const handleSelectObject = (obj) => {
    setCurrentObject(obj);
    setDropProgress(0);
    // Update nav text to prompt moving slider
    const stepData = getStepData(1);
    setDynamicNavText(stepData.navAfterSelect || "");
    setIsNextDisabled(true); // Disable next until slider is at max
  };

  // Handle slider progress (0–1); enable next only when at 1
  const handleDropProgressChange = (value) => {
    setDropProgress(value);
    if (value >= 1) {
      const stepData = getStepData(1);
      setDynamicNavText(stepData.navAfterDrop || "");
      setIsNextDisabled(false);
    } else {
      const stepData = getStepData(1);
      setDynamicNavText(stepData.navAfterSelect || "");
      setIsNextDisabled(true);
    }
  };

  // Handle next button
  const handleNext = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 1) {
      // Move to step 2 (calculation)
      setCurrentStep(2);
      setCalculationSubstep(0);
      setVisibleCalculationLines(2);
      setIsNextDisabled(false);
      setIsPrevDisabled(false);
    } else if (currentStep === 2) {
      const texts = APP_DATA.calculationTexts[currentObject];
      const totalLines = texts ? texts.length : 5;
      const navTexts = getStepData(2).navTexts || [];

      if (calculationSubstep < 3) {
        // Show more calculation lines
        setCalculationSubstep((prev) => prev + 1);

        // Determine how many lines to show
        if (calculationSubstep === 0) {
          setVisibleCalculationLines(2); // Already showing 2
        } else if (calculationSubstep === 1) {
          setVisibleCalculationLines(3);
        } else if (calculationSubstep === 2) {
          setVisibleCalculationLines(4);
        }

        // Update lines based on substep progression
        const nextSubstep = calculationSubstep + 1;
        if (nextSubstep === 1) {
          setVisibleCalculationLines(3);
        } else if (nextSubstep === 2) {
          setVisibleCalculationLines(4);
        } else if (nextSubstep === 3) {
          setVisibleCalculationLines(5);
        }

        // Update nav text
        if (navTexts[nextSubstep]) {
          setDynamicNavText(navTexts[nextSubstep]);
        }
      } else {
        // All calculation lines shown, complete this object
        const newCompleted = [...completedObjects, currentObject];
        setCompletedObjects(newCompleted);

        // Check if all objects are done
        const allObjects = ["coconut", "pumpkin", "watermelon"];
        const allDone = allObjects.every((obj) => newCompleted.includes(obj));

        if (allDone) {
          // Go to final screen
          setCurrentStep(3);
        } else {
          // Reset for next object selection
          setCurrentStep(1);
          setCurrentObject(null);
          setDropProgress(0);
          setCalculationSubstep(0);
          setVisibleCalculationLines(2);
          setIsNextDisabled(true);
          const stepData = getStepData(1);
          setDynamicQuestionText(stepData.questionText || "");
          setDynamicNavText(stepData.navText || "");
        }
      }
    }
  };

  // Handle previous button
  const handlePrev = () => {
    if (typeof playSound === "function") playSound("click");

    if (currentStep === 2) {
      if (calculationSubstep > 0) {
        // Go back in calculation substeps
        const newSubstep = calculationSubstep - 1;
        setCalculationSubstep(newSubstep);

        // Update visible lines
        if (newSubstep === 0) {
          setVisibleCalculationLines(2);
        } else if (newSubstep === 1) {
          setVisibleCalculationLines(3);
        } else if (newSubstep === 2) {
          setVisibleCalculationLines(4);
        }

        // Update nav text
        const navTexts = getStepData(2).navTexts || [];
        if (navTexts[newSubstep]) {
          setDynamicNavText(navTexts[newSubstep]);
        }
      } else {
        // Go back to step 1
        setCurrentStep(1);
        setDropProgress(1); // Keep object fully dropped
        const stepData = getStepData(1);
        setDynamicNavText(stepData.navAfterDrop || "");
      }
    } else if (currentStep === 1 && currentObject && dropProgress >= 1) {
      // Can't go back from dropped state to pre-drop in step 1
      setIsPrevDisabled(true);
    }
  };

  // Update texts and button states when step changes
  useEffect(() => {
    if (currentStep === 1) {
      const stepData = getStepData(1);
      setDynamicQuestionText(stepData.questionText || "");

      if (!currentObject) {
        setDynamicNavText(stepData.navText || "");
        setIsNextDisabled(true);
        setIsPrevDisabled(true);
      } else if (dropProgress < 1) {
        setDynamicNavText(stepData.navAfterSelect || "");
        setIsNextDisabled(true);
        setIsPrevDisabled(false);
      } else {
        setDynamicNavText(stepData.navAfterDrop || "");
        setIsNextDisabled(false);
        setIsPrevDisabled(false);
      }
    } else if (currentStep === 2) {
      const stepData = getStepData(2);
      setDynamicQuestionText(stepData.questionText || "");
      const navTexts = stepData.navTexts || [];
      const allObjects = ["coconut", "pumpkin", "watermelon"];
      const isLastSubstepAndAllDone =
        calculationSubstep === 3 && completedObjects.length === 2;
      const navText = isLastSubstepAndAllDone
        ? (stepData.navTextFinal || navTexts[calculationSubstep] || "")
        : (navTexts[calculationSubstep] || "");
      setDynamicNavText(navText);
      setIsNextDisabled(false);
      setIsPrevDisabled(false);
    }
  }, [currentStep, currentObject, dropProgress, calculationSubstep, completedObjects.length]);

  // Get question text
  const getQuestionText = () => {
    return dynamicQuestionText || "";
  };

  // Get nav text
  const getNavText = () => {
    return dynamicNavText || "";
  };

  // Step 0: Start fullscreen
  if (currentStep === 0) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.start.heading,
          text: APP_DATA.start.text,
          buttonText: APP_DATA.start.buttonText,
          onButtonClick: handleStart,
        })
      )
    );
  }

  // Step 3: Final fullscreen
  if (currentStep === 3) {
    return React.createElement(
      "div",
      { className: "applet-container" },
      React.createElement(
        "div",
        { className: "app-main-content", style: { position: "relative" } },
        React.createElement(Fullscreen, {
          heading: APP_DATA.final.heading,
          text: APP_DATA.final.text,
          buttonText: APP_DATA.final.buttonText,
          onButtonClick: handleRestart,
        })
      )
    );
  }

  // Steps 1 & 2: Main canvas + navigation
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
      React.createElement(MainCanvas, {
        step: currentStep,
        currentObject: currentObject,
        onSelectObject: handleSelectObject,
        dropProgress: dropProgress,
        onDropProgressChange: handleDropProgressChange,
        completedObjects: completedObjects,
        calculationSubstep: calculationSubstep,
        visibleCalculationLines: visibleCalculationLines,
      })
    ),
    React.createElement(
      "div",
      { className: "lower-panel" },
      React.createElement(Navigation, {
        onNav: (dir) => (dir === "next" ? handleNext() : handlePrev()),
        isNextDisabled: isNextDisabled,
        isPrevDisabled: isPrevDisabled,
        navText: getNavText(),
        nextSymbol: "»",
      })
    )
  );
};
