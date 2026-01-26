const MainCanvas = ({ 
  step, 
  onEnableNext, 
  onUpdateTexts,
  onUpdateImage,
  isAnswered,
  setIsAnswered,
  currentImage,
  comprehendSubstep = 0,
  computeSubstep = 0,
  onUpdateComputeSubstep
}) => {
  const { useState, useEffect, useRef } = React;

  // MCQ States
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  // Reset state when step changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(false);
    setWrongShake(false);

    const stepData = APP_DATA.steps[step];
    if (stepData) {
      // Update texts
      const navText = stepData.navText || "";
      const questionText = stepData.questionText || "";
      onUpdateTexts(questionText, navText);
    }
  }, [step]);

  // Handle MCQ Option Click
  const handleOptionClick = (option) => {
    if (isCorrect) return;

    const stepData = APP_DATA.steps[step];
    if (!stepData || !stepData.mcq) return;

    setSelectedOption(option);

    const correctAnswer = stepData.mcq.answer;
    if (option === correctAnswer) {
      setIsCorrect(true);
      playSound("correct");

      // Set answered immediately so label disappears at the same time as image change
      if (setIsAnswered) setIsAnswered(true);

      // Update image to correct version
      if (stepData.imageCorrect && onUpdateImage) {
        onUpdateImage(`${stepData.imageCorrect}`);
      }

      // Update nav text to correct version
      if (stepData.navTextCorrect) {
        onUpdateTexts(null, stepData.navTextCorrect);
      }

      setTimeout(() => {
        onEnableNext();
      }, 500);
    } else {
      setIsCorrect(false);
      playSound("wrong");
      setWrongShake(true);
      
      // Update image to hint version if available
      if (stepData.imageHint && onUpdateImage) {
        onUpdateImage(`${stepData.imageHint}`);
      }
      
      setTimeout(() => setWrongShake(false), 400);
    }
  };

  // Handle compute completion
  const handleComputeComplete = () => {
    const stepData = APP_DATA.steps[step];
    if (stepData.imageFinal && onUpdateImage) {
      onUpdateImage(`${stepData.imageFinal}`);
    }
  };

  const playSound = (name) => {
    if (window.playSound) window.playSound(name);
  };

  // Get step data
  const stepData = APP_DATA.steps[step];
  if (!stepData) return null;

  // Determine image source
  const getImageSrc = () => {
    if (currentImage) return currentImage;
    if (stepData.image) return `assets/${stepData.image}`;
    return "";
  };

  // Determine what to show in right column
  const renderRightColumn = () => {
    // Comprehend steps (0 and 1)
    if (stepData.isComprehend) {
      return React.createElement(Comprehend, {
        step: step,
        substep: comprehendSubstep
      });
    }
    
    // MCQ steps (3, 4, 6)
    if (stepData.isMcq && stepData.mcq) {
      const mcqData = {
        title: "",
        options: stepData.mcq.options,
        feedbacks: stepData.mcq.feedbacks,
      };
      
      return React.createElement(MCQPanel, {
        mcqData: mcqData,
        selectedOption: selectedOption,
        isCorrect: isCorrect,
        onOptionClick: handleOptionClick,
        showFeedback: true,
        shake: wrongShake,
      });
    }
    
    // Compute step (7)
    if (stepData.isCompute) {
      return React.createElement(Compute, {
        onComplete: handleComputeComplete,
        onEnableNext: onEnableNext,
        onUpdateNavText: (navText) => onUpdateTexts(null, navText)
      });
    }
    
    // Final step (8) - just text
    if (stepData.isFinalStep) {
      return React.createElement(
        "div",
        { className: "final-text-panel" },
        React.createElement(
          "p",
          { className: "final-text" },
          stepData.finalText
        )
      );
    }
    
    return null;
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container two-column" },
    // Left Column - Visual (50%)
    React.createElement(
      "div",
      { className: "column visual-column" },
      React.createElement(Visual, {
        imageSrc: getImageSrc(),
        showAreaLabel: true,
        step: step,
        substep: comprehendSubstep,
        isAnswered: isAnswered,
      })
    ),
    // Right Column - Content (50%)
    React.createElement(
      "div",
      { className: "column content-column" },
      renderRightColumn()
    )
  );
};
