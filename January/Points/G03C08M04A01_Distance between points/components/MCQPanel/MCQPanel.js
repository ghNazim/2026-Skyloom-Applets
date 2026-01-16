const MCQPanel = ({
  content,
  showActionButton,
  actionButtonText,
  actionButtonDisabled,
  onActionButtonClick,
  step1Phase,
  step2Phase,
}) => {
  const { useState, useEffect } = React;

  // Determine panel style
  const panelClassName = "mcq-panel mcq-panel-text-only";

  return React.createElement(
    "div",
    { className: panelClassName },
    // Show text content
    content &&
      React.createElement("div", {
        className: "mcq-panel-text",
        dangerouslySetInnerHTML: { __html: content },
      }),
    // Show action button if provided
    showActionButton &&
      actionButtonText &&
      React.createElement(
        "div",
        {
          style: {
            position: "relative",
            display: "inline-block",
            marginTop: "1.5vw",
            width: "100%",
          },
        },
        React.createElement(
          "button",
          {
            id: "action-button",
            className: "compare-button",
            onClick: onActionButtonClick,
            disabled: actionButtonDisabled,
            style: {
              padding: "1vw 2vw",
              fontSize: "2vw",
              fontWeight: "600",
              cursor: actionButtonDisabled ? "not-allowed" : "pointer",
              border: "none",
              background: actionButtonDisabled
                ? "linear-gradient(145deg, #9e9e9e, #757575)"
                : "linear-gradient(145deg, #ffeb3b, #ff9800)",
              color: actionButtonDisabled ? "#ccc" : "black",
              borderRadius: "0.8vw",
              transition: "all 0.3s ease",
              textAlign: "center",
              boxShadow: actionButtonDisabled
                ? "none"
                : "0 0.4vh 0.8vh rgba(0, 0, 0, 0.2)",
              width: "100%",
              opacity: actionButtonDisabled ? 0.5 : 1,
              whiteSpace: "pre-line",
            },
          },
          actionButtonText
        ),
        !actionButtonDisabled &&
          React.createElement("img", {
            src: "assets/tap.gif",
            alt: "Tap hint",
            className: "compare-tap-gif",
            style: {
              position: "absolute",
              top: "70%",
              left: "90%",
              transform: "translate(-50%, -50%)",
              width: "5vw",
              height: "5vw",
              pointerEvents: "none",
              zIndex: 10,
            },
          })
      )
  );
};
