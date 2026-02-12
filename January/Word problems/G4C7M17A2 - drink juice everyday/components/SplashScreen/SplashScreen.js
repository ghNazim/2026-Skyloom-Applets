const SplashScreen = ({ imageSrc, text, step, showQuestion, questionText }) => {
  // If showQuestion is true, show question text instead of image
  if (showQuestion) {
    return React.createElement(
      "div",
      { className: "splash-screen" },
      // Top row - Question text (70% height)
      React.createElement(
        "div",
        { className: "splash-question-container" },
        React.createElement(
          "div",
          { className: "splash-question-text" },
          questionText
        )
      ),
      // Bottom row - Text (30% height)
      React.createElement(
        "div",
        { 
          className: "splash-text-container",
          dangerouslySetInnerHTML: { __html: text }
        }
      )
    );
  }
  
  // Default: show image
  return React.createElement(
    "div",
    { className: "splash-screen" },
    // Top row - Image (70% height)
    React.createElement(
      "div",
      { className: "splash-image-container", style: { position: 'relative' } },
      React.createElement("img", {
        src: imageSrc,
        alt: APP_DATA.labels.altSummaryVisual,
        className: "splash-image",
      })
    ),
    // Bottom row - Text (30% height)
    React.createElement(
      "div",
      { 
        className: "splash-text-container",
        dangerouslySetInnerHTML: { __html: text }
      }
    )
  );
};
