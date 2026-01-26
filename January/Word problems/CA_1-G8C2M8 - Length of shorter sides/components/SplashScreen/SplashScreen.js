const SplashScreen = ({ imageSrc, text, step }) => {
  // Show area label only in step 2
  const showAreaLabel = step === 2;
  
  return React.createElement(
    "div",
    { className: "splash-screen" },
    // Top row - Image (70% height)
    React.createElement(
      "div",
      { className: "splash-image-container", style: { position: 'relative' } },
      React.createElement("img", {
        src: imageSrc,
        alt: "Summary visual",
        className: "splash-image",
      }),
      showAreaLabel && React.createElement("span", {
        className: "splash-area-label"
      }, APP_DATA.label)
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
