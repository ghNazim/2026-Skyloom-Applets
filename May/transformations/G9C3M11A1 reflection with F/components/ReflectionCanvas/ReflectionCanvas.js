const ReflectionCanvas = ({
  leftPanel,
  textHtml,
  actionButton,
  actionButtonVisible,
  contentVisible,
  showPartialDuringAnim,
  partialTextHtml,
  showStep3Overlays,
  step3LineLabel,
}) => {
  const displayHtml =
    !contentVisible && showPartialDuringAnim && partialTextHtml
      ? partialTextHtml
      : textHtml;

  const isVisible = contentVisible || showPartialDuringAnim;

  return React.createElement(
    "div",
    { className: "step1-canvas-container reflection-canvas" },
    React.createElement(
      "div",
      { className: "step1-visual-column reflection-visual-slot" },
      leftPanel,
      showStep3Overlays
        ? React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "p",
              { className: "step3-line-label" },
              step3LineLabel,
            ),
            React.createElement("img", {
              className: "step3-curve-image",
              src: "assets/curve.png",
              alt: "",
            }),
          )
        : null,
    ),
    React.createElement(
      "div",
      {
        className:
          "step1-text-column reflection-text-column" +
          (isVisible ? " visible" : " hidden"),
      },
      React.createElement(
        "div",
        {
          className: "step1-text-box reflection-text-box" + (displayHtml ? " filled" : ""),
        },
        displayHtml
          ? React.createElement("div", {
              dangerouslySetInnerHTML: { __html: displayHtml },
            })
          : null,
        actionButton
          ? React.createElement(
              "div",
              {
                className:
                  "reflection-action-btn" +
                  (actionButtonVisible ? " visible" : " hidden"),
              },
              actionButton,
            )
          : null,
      ),
    ),
  );
};
