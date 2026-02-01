const SplashScreen = ({ imageSrc, text, step, questionStatement = null }) => {
  const showQuestionInsteadOfImage = !imageSrc && questionStatement;

  return React.createElement(
    "div",
    { className: "splash-screen" },
    // Top row - Image or question text (70% height)
    React.createElement(
      "div",
      { className: "splash-image-container", style: { position: "relative" } },
      showQuestionInsteadOfImage
        ? React.createElement("div", {
            className: "splash-question-statement",
            dangerouslySetInnerHTML: { __html: questionStatement },
          })
        : imageSrc
          ? React.createElement("img", {
              src: imageSrc,
              alt: "Summary visual",
              className: "splash-image",
            })
          : null
    ),
    // Bottom row - Text (30% height)
    React.createElement(
      "div",
      {
        className: "splash-text-container",
        dangerouslySetInnerHTML: { __html: text },
      }
    )
  );
};
