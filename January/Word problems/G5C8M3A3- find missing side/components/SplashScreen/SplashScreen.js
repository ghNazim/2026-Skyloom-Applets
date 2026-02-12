const SplashScreen = ({ imageSrc, text, step, altText = "" }) => {
  return React.createElement(
    "div",
    { className: "splash-screen" },
    // Top row - Image (70% height)
    React.createElement(
      "div",
      { className: "splash-image-container", style: { position: 'relative' } },
      React.createElement("img", {
        src: imageSrc,
        alt: altText || "",
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
