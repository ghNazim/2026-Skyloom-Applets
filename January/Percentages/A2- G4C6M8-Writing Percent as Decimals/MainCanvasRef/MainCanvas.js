const MainCanvas = ({
  step,
  question,
  questionIndex,
  totalQuestions,
  onMcqAnswer,
  stepStates,
  isCorrect,
}) => {
  const { useState, useEffect, useRef } = React;

  const [selectedMcqOption, setSelectedMcqOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [filledValues, setFilledValues] = useState({
    ones: null,
    tenths: null,
    hundredths: null,
  });
  const [vibratingBox, setVibratingBox] = useState(null);
  const [prevStep, setPrevStep] = useState(step);
  const [showOnesSuccess, setShowOnesSuccess] = useState(false);
  const [showStep6Correct, setShowStep6Correct] = useState(false);
  const [showOnesHighlight, setShowOnesHighlight] = useState(false);

  // State Reset Pattern: Handle step changes immediately during render to prevent "flash" of stale data
  if (prevStep !== step) {
    setPrevStep(step);
    // If returning to a visited step, restore state; otherwise reset
    const savedState = stepStates[step];
    setSelectedMcqOption(savedState ? savedState.selectedOption : null);
    setShowFeedback(!!savedState);
    setVibratingBox(null);
  }

  const tenthsBoxRef = useRef(null);
  const onesBoxRef = useRef(null);
  const hundredthsBoxRef = useRef(null);

  // Reset filled values only when question changes
  useEffect(() => {
    setFilledValues({ ones: null, tenths: null, hundredths: null });
  }, [questionIndex]);

  // Update MCQ state when step or stepStates changes
  useEffect(() => {
    if (step >= 2 && step <= 6) {
      const stepState = stepStates[step];
      if (stepState) {
        setSelectedMcqOption(stepState.selectedOption);
        setShowFeedback(true);
      } else {
        setSelectedMcqOption(null);
        setShowFeedback(false);
      }
    } else {
      setSelectedMcqOption(null);
      setShowFeedback(false);
    }
  }, [step, stepStates]);

  // Reset ones highlight when step changes to 6
  useEffect(() => {
    if (step === 6) {
      setShowOnesHighlight(true);
    } else {
      setShowOnesHighlight(false);
    }
  }, [step]);

  // Handle ones box success highlight - show for 1 second then remove
  useEffect(() => {
    if (step === 6 && isCorrect[6]) {
      setShowOnesSuccess(true);
      setShowStep6Correct(true);
      const timer = setTimeout(() => {
        setShowOnesSuccess(false);
        setShowStep6Correct(false);
        setShowOnesHighlight(false); // Remove the orange highlight too
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowOnesSuccess(false);
      setShowStep6Correct(false);
    }
  }, [step, isCorrect]);

  // Update filled values based on step states and correct answers
  // useEffect(() => {
  //    // If user is revisiting or state needs to be synced
  //    if (isCorrect[4]) {
  //        setFilledValues(prev => ({ ...prev, tenths: Math.floor(question.num / 10) }));
  //    } else {
  //        // Reset if not correct (e.g. new question or reset)
  //        setFilledValues(prev => ({ ...prev, tenths: null }));
  //    }

  //    if (isCorrect[5]) {
  //        setFilledValues(prev => ({ ...prev, hundredths: question.num % 10 }));
  //    } else {
  //        setFilledValues(prev => ({ ...prev, hundredths: null }));
  //    }

  //    if (isCorrect[6]) {
  //        setFilledValues(prev => ({ ...prev, ones: 0 }));
  //    } else {
  //        setFilledValues(prev => ({ ...prev, ones: null }));
  //    }
  // }, [isCorrect, question.num, step]); // Sync when step changes to ensure persistence

  const handleMcqOptionClick = (option) => {
    if (isCorrect[step]) return;

    setSelectedMcqOption(option);
    setShowFeedback(true);

    const mcqData = getMcqData();
    if (!mcqData) return;

    let correctAnswer = mcqData.correct;

    // Determine dynamic correct answers
    if (step === 3) correctAnswer = question.num; // Just checking numerator value
    if (step === 4) correctAnswer = Math.floor(question.num / 10);
    if (step === 5) correctAnswer = question.num % 10;

    // Normalize comparison
    const correct = option == correctAnswer; // Loose equality for string/number match

    // Visual feedback (Vibration only)
    if (step === 4 && !correct) {
      setVibratingBox("tenths");
      setTimeout(() => setVibratingBox(null), 400);
    }
    if (step === 5 && !correct) {
      setVibratingBox("hundredths");
      setTimeout(() => setVibratingBox(null), 400);
    }
    if (step === 6 && !correct) {
      setVibratingBox("ones");
      setTimeout(() => setVibratingBox(null), 400);
    }

    if (onMcqAnswer) {
      onMcqAnswer(step, option, correct);
    }
  };

  const getMcqData = () => {
    if (step === 2) return APP_DATA.step2.mcq;
    if (step === 3) {
      return {
        ...APP_DATA.step3.mcq,
        options: question.step3Options,
        correct: question.num,
      };
    }
    if (step === 4) {
      return {
        ...APP_DATA.step4.mcq,
        options: question.step4Options,
        correct: Math.floor(question.num / 10),
      };
    }
    if (step === 5) {
      return {
        ...APP_DATA.step5.mcq,
        options: question.step5Options,
        correct: question.num % 10,
      };
    }
    if (step === 6) return APP_DATA.step6.mcq;
    return null;
  };

  const getFeedbackText = () => {
    if (!showFeedback || selectedMcqOption === null) return null;

    const mcqData = getMcqData();
    if (!mcqData) return null;

    let correctAnswer = mcqData.correct;

    if (step === 3) correctAnswer = question.num;
    if (step === 4) correctAnswer = Math.floor(question.num / 10);
    if (step === 5) correctAnswer = question.num % 10;

    const correct = selectedMcqOption == correctAnswer;

    const feedbackSource = correct
      ? mcqData.feedbacks.correct
      : mcqData.feedbacks.wrong;

    if (typeof feedbackSource === "function") {
      const tenthCount = Math.floor(question.num / 10);
      const hundCount = question.num % 10;
      return feedbackSource({
        num: question.num,
        tenthCount,
        hundCount,
        userAnswer: selectedMcqOption,
      });
    }

    let feedbackText = feedbackSource;

    // Legacy fallback for string replacement if needed
    if (typeof feedbackText === "string") {
      const tenthCount = Math.floor(question.num / 10);
      const hundCount = question.num % 10;
      feedbackText = feedbackText
        .replace(/{num}/g, question.num)
        .replace(/{tenthCount}/g, tenthCount)
        .replace(/{hundCount}/g, hundCount)
        .replace(/{userAnswer}/g, selectedMcqOption);
    }

    return feedbackText;
  };

  const getVisualPanelClass = () => {
    let classes = ["visual-panel"];

    // Add step-specific classes for CSS styling overrides if needed
    if (step >= 2) classes.push(`step${step}-active`);

    if (step === 2) {
      if (isCorrect[2]) classes.push("step2-correct");
      else if (selectedMcqOption !== null && !isCorrect[2])
        classes.push("step2-wrong");
    }
    if (step === 3) {
      if (isCorrect[3]) classes.push("step3-correct");
      else if (selectedMcqOption !== null && !isCorrect[3])
        classes.push("step3-wrong");
    }
    if (step === 4) {
      if (isCorrect[4]) classes.push("step4-correct");
      else if (selectedMcqOption !== null && !isCorrect[4])
        classes.push("step4-wrong");
    }
    if (step === 5) {
      if (isCorrect[5]) classes.push("step5-correct");
      else if (selectedMcqOption !== null && !isCorrect[5])
        classes.push("step5-wrong");
    }
    if (step === 6) {
      if (showStep6Correct) classes.push("step6-correct");
      else if (selectedMcqOption !== null && !isCorrect[6])
        classes.push("step6-wrong");
    }

    return classes.join(" ");
  };

  const renderFractionBox = () => {
    // Numerator highlight: Step 3 and 4
    const highlightNumerator = step === 3 || step === 4;
    const numeratorCorrect =
      (step === 3 && isCorrect[3]) || (step === 4 && isCorrect[4]) || (step === 5 && isCorrect[5]);

    const numeratorClass = `fraction-number numerator ${
      highlightNumerator ? "text-highlight" : ""
    } ${numeratorCorrect ? "text-success" : ""}`;

    // Denominator highlight: Step 2 and 5
    const highlightDenominator = step === 2 || step === 5;
    const denominatorCorrect =
      (step === 2 && isCorrect[2]);

    const denominatorClass = `fraction-number denominator ${
      highlightDenominator ? "text-highlight" : ""
    } ${denominatorCorrect ? "text-success" : ""}`;

    return React.createElement(
      "div",
      { className: "fraction-box" },
      React.createElement("span", { className: numeratorClass }, question.num),
      React.createElement("div", { className: "fraction-line" }),
      React.createElement("span", { className: denominatorClass }, question.den)
    );
  };

  // Helper to determine what to show in a decimal box
  const getBoxValue = (boxStep, correctValue) => {
    // If the step for this box is completed correctly, show correct value
    if (isCorrect[boxStep]) return correctValue;

    // If we are currently on this step, show the selected option (if any)
    if (step === boxStep && selectedMcqOption !== null) {
      // Special case for Step 6: Don't show wrong answer text ("Yes")
      if (boxStep === 6) return "";
      return selectedMcqOption;
    }

    // Otherwise empty
    return "";
  };

  const renderDecimalBoxes = () => {
    const onesValue = getBoxValue(6, 0);
    const tenthsValue = getBoxValue(4, Math.floor(question.num / 10));
    const hundredthsValue = getBoxValue(5, question.num % 10);

    const onesBoxClass = `decimal-box ones-box ${
      showOnesHighlight ? "box-highlight" : ""
    } ${
      step === 6 && selectedMcqOption !== null && !isCorrect[6]
        ? "box-error"
        : step === 6 && showOnesSuccess
        ? "box-success"
        : ""
    }`;

    const tenthsBoxClass = `decimal-box tenths-box ${
      step === 4 ? "box-highlight" : ""
    } ${
      step === 4 && selectedMcqOption !== null && !isCorrect[4]
        ? "box-error"
        : step === 4 && isCorrect[4]
        ? "box-success"
        : ""
    } ${vibratingBox === "tenths" ? "vibrate" : ""}`;

    const hundredthsBoxClass = `decimal-box hundredths-box ${
      step === 5 ? "box-highlight" : ""
    } ${
      step === 5 && selectedMcqOption !== null && !isCorrect[5]
        ? "box-error"
        : step === 5 && isCorrect[5]
        ? "box-success"
        : ""
    } ${vibratingBox === "hundredths" ? "vibrate" : ""}`;

    const getLabelClass = (labelStep, labelName) => {
      // Step 2 logic: wrong option makes label red
      const step2WrongOption =
        step === 2 && selectedMcqOption !== null && !isCorrect[2]
          ? selectedMcqOption
          : null;
      const isError =
        step2WrongOption === labelName ||
        step2WrongOption === APP_DATA.labels[labelName.toLowerCase()];

      let className = "box-label";
      if (isError) className += " label-error";

      // Green label on correctness
      // Only active when we are ON the specific step (e.g. Step 2 for Hundredths label)
      if (
        labelStep === step &&
        isCorrect[labelStep] &&
        labelStep === 2 &&
        labelName === "Hundredths"
      )
        className += " label-active";

      return className;
    };

    return React.createElement(
      "div",
      { className: "decimal-boxes-container" },
      // Ones box
      React.createElement(
        "div",
        { className: "decimal-box-wrapper" },
        React.createElement(
          "div",
          { className: onesBoxClass, ref: onesBoxRef },
          onesValue
        ),
        React.createElement(
          "div",
          { className: getLabelClass(6, "Ones") },
          APP_DATA.labels.ones
        )
      ),
      // Decimal point
      current_language === "id"
        ? React.createElement(
            "div",
            {
              className: "decimal-point-id",
            },
            React.createElement("img", {
              src: "assets/comma.svg",
              className: "comma-image",
              alt: ",",
            })
          )
        : React.createElement("div", { className: "decimal-point" }),
      // Tenths box
      React.createElement(
        "div",
        { className: "decimal-box-wrapper" },
        React.createElement(
          "div",
          { className: tenthsBoxClass, ref: tenthsBoxRef },
          tenthsValue
        ),
        React.createElement(
          "div",
          { className: getLabelClass(4, "Tenths") },
          APP_DATA.labels.tenths
        )
      ),
      // Hundredths box
      React.createElement(
        "div",
        { className: "decimal-box-wrapper" },
        React.createElement(
          "div",
          { className: hundredthsBoxClass, ref: hundredthsBoxRef },
          hundredthsValue
        ),
        React.createElement(
          "div",
          { className: getLabelClass(2, "Hundredths") },
          APP_DATA.labels.hundredths
        )
      )
    );
  };

  const renderVisualPanel = () => {
    return React.createElement(
      "div",
      { className: getVisualPanelClass() },
      renderFractionBox(),
      React.createElement("div", { className: "equals-sign" }, "="),
      renderDecimalBoxes()
    );
  };

  const renderMcqPanel = () => {
    if (step === 1) return null;

    const mcqData = getMcqData();
    if (!mcqData) return null;

    let correctAnswer = mcqData.correct;
    // same logic as above
    if (step === 3) correctAnswer = question.num;
    if (step === 4) correctAnswer = Math.floor(question.num / 10);
    if (step === 5) correctAnswer = question.num % 10;

    // Only check against correctness logic, loose equality
    const correct = isCorrect[step];

    return React.createElement(MCQPanel, {
      content: null,
      mcqData: mcqData,
      selectedOption: selectedMcqOption,
      isCorrect: correct,
      onOptionClick: handleMcqOptionClick,
      showFeedback: showFeedback,
      feedbackOverride: getFeedbackText(),
    });
  };

  const showMcqPanel = step >= 2 && step <= 6;

  return React.createElement(
    "div",
    { className: `main-canvas-container ${showMcqPanel ? "" : "full-visual"}` },
    React.createElement(
      "div",
      {
        className: `main-canvas-column left-column ${
          showMcqPanel ? "" : "full-width"
        }`,
      },
      renderVisualPanel()
    ),
    showMcqPanel &&
      React.createElement(
        "div",
        { className: "main-canvas-column right-column" },
        renderMcqPanel()
      )
  );
};
