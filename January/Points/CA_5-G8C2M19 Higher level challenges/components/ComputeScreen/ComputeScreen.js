// components/ComputeScreen/ComputeScreen.js
const ComputeScreen = ({
  stage,
  isSummary,
  computeInteraction,
  tableAnswer,
  onTableAnswer,
  onTableSubmit,
  computeStepIndex,
  computeMCQAnswers,
  onComputeMCQAnswer,
  onHighlightClick,
  currentFlowStep,
}) => {
  const h = React.createElement;
  const { useState, useRef, useEffect } = React;

  // Render summary screen
  if (isSummary && stage) {
    return h(
      "div",
      { className: "compute-screen" },
      h(
        "div",
        { className: "left-section" },
        h(
          "div",
          { className: "triangle-box" },
          h(ImageVisualization, {
            imageSrc: stage.imageSrc,
          })
        )
      ),
      h(
        "div",
        { className: "right-section" },
        h(
          "div",
          { className: "summary-box" },
          h("h3", null, T.ui.summary.answer),
          ...stage.answers.map((answer, index) =>
            h("div", {
              key: index,
              className: "answer-box",
              style: {
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "2vw",
              },
              dangerouslySetInnerHTML: { __html: answer },
            })
          )
        )
      )
    );
  }

  if (!stage) return null;

  // Get current image based on stage completion
  const getCurrentImage = () => {
    if (stage.finalImageSrc && computeInteraction) {
      return stage.finalImageSrc;
    }
    return stage.imageSrc;
  };

  // Render findBTable step
  if (stage.type === "findBTable") {
    const isComplete = computeInteraction;
    const tableData = stage.tableData;
    const [arrowLabel, setArrowLabel] = useState(tableAnswer || "");
    const [isIncorrect, setIsIncorrect] = useState(false);
    const [showCorrectState, setShowCorrectState] = useState(false);

    // Sync with prop
    useEffect(() => {
      if (tableAnswer !== arrowLabel) {
        setArrowLabel(tableAnswer || "");
      }
    }, [tableAnswer]);

    // Handle correct answer state with 1 second delay before resetting
    useEffect(() => {
      if (isComplete) {
        setShowCorrectState(true);
        const timer = setTimeout(() => {
          setShowCorrectState(false);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setShowCorrectState(false);
      }
    }, [isComplete]);

    const handleNumberClick = (num) => {
      // Only allow one digit - replace instead of append
      const newValue = num;
      setArrowLabel(newValue);
      onTableAnswer(newValue);
      // Clear incorrect state when user enters something new
      setIsIncorrect(false);
    };

    const handleClear = () => {
      setArrowLabel("");
      onTableAnswer("");
      // Clear incorrect state when user clears
      setIsIncorrect(false);
    };

    const handleSubmit = () => {
      if (arrowLabel === tableData.correctAnswer) {
        onTableSubmit();
      } else {
        setIsIncorrect(true);
        playSound("wrong");
        // Don't auto-remove incorrect state - keep it until user enters something
      }
    };

    // Update table rows based on completion
    const tableRows = isComplete
      ? tableData.rowsComplete || tableData.rows
      : tableData.rows;

    return h(
      "div",
      { className: "compute-screen" },
      h(
        "div",
        { className: "left-section" },
        h(
          "div",
          { className: "triangle-box" },
          h(ImageVisualization, {
            imageSrc: getCurrentImage(),
          })
        )
      ),
      h(
        "div",
        { className: "right-section split" },
        h(
          "div",
          { className: "solve-box" },
          h(
            "div",
            { className: "solve-box-content" },
            stage.questionText &&
              h(
                "div",
                { className: "question-text-container" },
                h("p", {
                  className: "question-text",
                  dangerouslySetInnerHTML: { __html: stage.questionText },
                })
              ),
            h(
              "div",
              { className: "numpad-container" },
              h(Numpad, {
                disabled: isComplete,
                onNumberClick: handleNumberClick,
                onClear: handleClear,
                onSubmit: handleSubmit,
              })
            )
          )
        ),
        h(
          "div",
          { className: "steps-box" },
          h(Table, {
            headers: tableData.headers,
            rows: tableRows,
            showArrow: true,
            highlightedCell: null,
            cellUpdate: null,
            showQuestionMarks: false,
            arrowLabel:
              arrowLabel || (isComplete ? tableData.correctAnswer : ""),
            isArrowLabelCorrect: showCorrectState,
            isArrowLabelIncorrect: isIncorrect,
            questionMarkCellCorrect: showCorrectState,
            isFilling: arrowLabel !== "" && !isComplete,
            isTableComplete: isComplete,
          })
        )
      )
    );
  }

  // Render findBResult step
  if (stage.type === "findBResult") {
    return h(
      "div",
      { className: "compute-screen" },
      h(
        "div",
        { className: "left-section" },
        h(
          "div",
          { className: "triangle-box" },
          h(ImageVisualization, {
            imageSrc: getCurrentImage(),
          })
        )
      ),
      h(
        "div",
        { className: "right-section" },
        h(
          "div",
          { className: "result-box" },
          h("p", { dangerouslySetInnerHTML: { __html: stage.equation } })
        )
      )
    );
  }

  // Render MCQ-based compute steps (findAreaCompute1, 2, 3)
  if (stage.steps) {
    const isComplete = computeInteraction;
    const currentStep = !isComplete ? stage.steps[computeStepIndex] : null;
    if (!isComplete && !currentStep) return null;
    const answerKey = !isComplete
      ? `${currentFlowStep}_${computeStepIndex}`
      : null;
    const selectedAnswer =
      !isComplete && answerKey ? computeMCQAnswers[answerKey] : undefined;

    // Render equation with highlights or empty boxes
    const renderEquation = () => {
      if (!currentStep) return null;
      // Use equationX if it exists (for solve box), otherwise use equation
      let equation = currentStep.equationX || currentStep.equation;
      // Convert newlines to <br> tags for HTML rendering
      if (equation.includes("\n")) {
        equation = equation.replace(/\n/g, "<br>");
      }
      const hasHTML =
        equation.includes("<span") ||
        equation.includes("<div") ||
        equation.includes("<br>") ||
        equation.includes("katex") ||
        equation.includes("<svg") ||
        equation.includes("class=");

      // Check if there's a highlight text
      if (currentStep.highlightText && !hasHTML) {
        // Escape special regex characters in highlightText
        const escapedText = currentStep.highlightText.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        // Try matching with or without quotes
        const regexWithQuotes = new RegExp(`("${escapedText}")`, "gi");
        const regexWithoutQuotes = new RegExp(`(${escapedText})`, "gi");
        let regex = regexWithQuotes;
        let matches = equation.match(regex);
        if (!matches) {
          regex = regexWithoutQuotes;
          matches = equation.match(regex);
        }
        if (matches) {
          const parts = equation.split(regex);
          return h(
            "div",
            { className: "equation-container" },
            ...parts.map((part, idx) => {
              const partWithoutQuotes = part.replace(/^"|"$/g, "");
              if (
                partWithoutQuotes.toLowerCase() ===
                  currentStep.highlightText.toLowerCase() ||
                part.toLowerCase() === currentStep.highlightText.toLowerCase()
              ) {
                return h(
                  "span",
                  {
                    key: idx,
                    className: "equation-part highlight clickable",
                    onClick: () => onHighlightClick(),
                    style: { cursor: "pointer" },
                  },
                  part
                );
              }
              return h("span", { key: idx, className: "equation-part" }, part);
            })
          );
        }
      }

      // Check if there's an empty box
      if (equation.includes("{{empty}}")) {
        const parts = equation.split("{{empty}}");
        const filledValue = getFilledValue(computeStepIndex);

        return h(
          "div",
          { className: "equation-container" },
          h(
            "span",
            {
              className: "equation-part",
              dangerouslySetInnerHTML: hasHTML ? { __html: parts[0] } : null,
            },
            hasHTML ? null : parts[0]
          ),
          h(
            "span",
            {
              className: `equation-part empty-box ${
                selectedAnswer !== undefined &&
                selectedAnswer === currentStep.mcq.correctAnswer
                  ? "filled"
                  : ""
              }`,
              style: {
                display: "inline-block",
                minWidth: "60px",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "3px",
                textAlign: "center",
              },
            },
            filledValue || ""
          ),
          h(
            "span",
            {
              className: "equation-part",
              dangerouslySetInnerHTML: hasHTML
                ? { __html: parts[1] || "" }
                : null,
            },
            hasHTML ? null : parts[1] || ""
          )
        );
      }

      // Check if equation contains HTML (like from frac function)
      if (hasHTML) {
        // For HTML with highlight, wrap the highlight text
        if (currentStep.highlightText) {
          const regex = new RegExp(`(${currentStep.highlightText})`, "gi");
          equation = equation.replace(
            regex,
            `<span class="equation-part highlight clickable" style="cursor: pointer; background: rgba(255, 165, 0, 0.3); border: 2px solid #FFA500; border-radius: 0.5vw; padding: 0.3vw 0.8vw;">$1</span>`
          );
        }
        return h(
          "div",
          {
            className: "equation-container",
            onClick: currentStep.highlightText
              ? () => onHighlightClick()
              : null,
          },
          h("span", {
            className: "equation-part",
            dangerouslySetInnerHTML: { __html: equation },
          })
        );
      }

      return h(
        "div",
        { className: "equation-container" },
        h("span", { className: "equation-part" }, equation)
      );
    };

    const getFilledValue = (stepIdx) => {
      const step = stage.steps[stepIdx];
      if (!step || !step.mcq) return "";

      const answerKey = `${currentFlowStep}_${stepIdx}`;
      const selected = computeMCQAnswers[answerKey];
      if (selected === undefined) return "";

      const correct = selected === step.mcq.correctAnswer;
      return correct ? step.mcq.options[selected] : "";
    };

    return h(
      "div",
      { className: "compute-screen" },
      h(
        "div",
        { className: "left-section" },
        h(
          "div",
          { className: "triangle-box" },
          h(ImageVisualization, {
            imageSrc: getCurrentImage(),
          })
        )
      ),
      h(
        "div",
        { className: "right-section split" },
        h(
          "div",
          {
            className: `solve-box ${
              stage.type !== "findBTable" ? "solve-box-mcq" : ""
            }`,
          },
          // Show MCQ if current step has MCQ (keep visible when complete)
          currentStep &&
            currentStep.mcq &&
            h(
              "div",
              { className: "mcq-container" },
              h("h4", null, currentStep.mcq.title),
              h(
                "div",
                { className: "mcq-options-row" },
                (() => {
                  // Check if correct answer has been selected
                  const correctAnswerSelected =
                    selectedAnswer !== undefined &&
                    selectedAnswer === currentStep.mcq.correctAnswer;

                  return currentStep.mcq.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentStep.mcq.correctAnswer;
                    const showCorrect = isSelected && isCorrect;
                    const showWrong = isSelected && !isCorrect;

                    // When correct answer is selected, disable all buttons
                    // Incorrect ones get less opacity, correct one keeps full opacity
                    const shouldDisable = correctAnswerSelected || isComplete;
                    const shouldReduceOpacity =
                      correctAnswerSelected && !isCorrect;

                    return h("button", {
                      key: index,
                      className: `mcq-option ${
                        showCorrect ? "correct" : showWrong ? "wrong" : ""
                      }`,
                      onClick: shouldDisable
                        ? null
                        : () => onComputeMCQAnswer(computeStepIndex, index),
                      disabled: shouldDisable,
                      style: shouldDisable
                        ? {
                            cursor: "not-allowed",
                            opacity: shouldReduceOpacity ? 0.6 : 1,
                          }
                        : {},
                      dangerouslySetInnerHTML: { __html: option },
                    });
                  });
                })()
              )
            ),
          // Show equation if current step has highlightText and not complete
          currentStep && !currentStep.mcq && !isComplete && renderEquation()
        ),
        h(
          "div",
          { className: "steps-box" },
          h("h3", null, T.ui.summary.steps),
          h(
            "div",
            { className: "steps-list" },
            ...stage.steps
              .slice(0, isComplete ? stage.steps.length : computeStepIndex + 1)
              .map((step, idx) => {
                const stepAnswerKey = `${currentFlowStep}_${idx}`;
                const stepSelected = computeMCQAnswers[stepAnswerKey];
                const stepFilled =
                  stepSelected !== undefined &&
                  stepSelected === step.mcq?.correctAnswer;

                let stepEquation = step.equation;
                if (step.mcq && stepFilled) {
                  // Replace {{empty}} with the correct answer
                  stepEquation = stepEquation.replace(
                    "{{empty}}",
                    step.mcq.options[step.mcq.correctAnswer]
                  );
                } else if (step.mcq) {
                  // Replace {{empty}} with yellow bordered box containing "?"
                  stepEquation = stepEquation.replace(
                    "{{empty}}",
                    '<span class="empty-box-yellow">?</span>'
                  );
                }

                return h(
                  "div",
                  { key: idx, className: "step-item" },
                  h("p", { dangerouslySetInnerHTML: { __html: stepEquation } })
                );
              })
          )
        )
      )
    );
  }

  // Render findAreaCompute4 step
  if (stage.type === "findAreaCompute4") {
    return h(
      "div",
      { className: "compute-screen" },
      h(
        "div",
        { className: "left-section" },
        h(
          "div",
          { className: "triangle-box" },
          h(ImageVisualization, {
            imageSrc: getCurrentImage(),
          })
        )
      ),
      h(
        "div",
        { className: "right-section" },
        h(
          "div",
          { className: "result-box" },
          h("p", { dangerouslySetInnerHTML: { __html: stage.equation } })
        )
      )
    );
  }

  return null;
};
