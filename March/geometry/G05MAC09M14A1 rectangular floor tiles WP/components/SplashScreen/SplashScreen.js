const SplashScreen = ({ imageSrc, text, step, alt }) => {
  const imageAlt = alt || (APP_DATA.altTexts && APP_DATA.altTexts.splashImage) || "";
  return React.createElement(
    "div",
    { className: "splash-screen" },
    React.createElement(
      "div",
      { className: "splash-image-container", style: { position: 'relative' } },
      React.createElement("img", {
        src: imageSrc,
        alt: imageAlt,
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
