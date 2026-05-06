const MainCanvas = ({ question, onEnableNext }) => {
  const { useState, useCallback } = React;

  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  const handleCorrectDrop = useCallback((text) => {
    setFeedbackType("correct");
    setFeedbackText(text);
  }, []);

  const handleWrongDrop = useCallback((text) => {
    setFeedbackType("wrong");
    setFeedbackText(text);
  }, []);

  const handleAllComplete = useCallback(
    (text) => {
      setFeedbackType("complete");
      setFeedbackText(text);
      if (onEnableNext) onEnableNext();
    },
    [onEnableNext]
  );

  return React.createElement(
    "div",
    { className: "main-canvas-container" },

    // ── Left Panel ────────────────────────────────────────────────
    React.createElement(
      "div",
      { className: "left-panel" },
      React.createElement(
        "div",
        { className: "image-row" },
        question.title
          ? React.createElement(
              "div",
              { className: "title-text" },
              question.title
            )
          : null,
        React.createElement("img", {
          src: question.leftPanelImage,
          className: "left-panel-image",
          alt: "reference",
          draggable: false,
        })
      ),
      React.createElement(
        "div",
        { className: "instruction-row" },
        React.createElement(
          "div",
          { className: "instruction-box" },
          question.instruction
        )
      )
    ),

    // ── Right Panel ───────────────────────────────────────────────
    React.createElement(
      "div",
      { className: "right-panel" },

      React.createElement(
        "div",
        { className: "heading-row" },
        React.createElement("h2", {
          className: "heading-text",
          dangerouslySetInnerHTML: { __html: question.heading },
        })
      ),

      React.createElement(
        "div",
        { className: "scale-row" },
        React.createElement(Scale, {
          question: question,
          onCorrectDrop: handleCorrectDrop,
          onWrongDrop: handleWrongDrop,
          onAllComplete: handleAllComplete,
        })
      ),

      React.createElement(
        "div",
        { className: "feedback-row" },
        feedbackType
          ? React.createElement("div", {
              className: "feedback-box " + feedbackType,
              dangerouslySetInnerHTML: {
                __html: feedbackText.replace(/\n/g, "<br>"),
              },
            })
          : null
      )
    )
  );
};
