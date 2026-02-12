const Final = ({ onRestart }) => {
  // Replace <y>...</y> with styled span for highlight
  const textHtml = (APP_DATA.final.text || "")
    .replace(/<y>/g, '<span class="final-highlight">')
    .replace(/<\/y>/g, "</span>");

  return React.createElement(
    "div",
    { className: "final-panel" },

    // Heading
    React.createElement(
      "p",
      { className: "heading" },
      APP_DATA.final.heading
    ),

    // Content: left (image) + right (text)
    React.createElement(
      "div",
      { className: "final-content-rows final-split" },

      // Left: Image
      React.createElement(
        "div",
        { className: "final-left" },
        React.createElement("img", {
          src: "assets/final.png",
          alt: APP_DATA.final.imageAlt,
          className: "final-image-row",
        })
      ),

      // Right: Text
      React.createElement(
        "div",
        { className: "final-right" },
        React.createElement("div", {
          className: "final-text",
          dangerouslySetInnerHTML: { __html: textHtml },
        })
      )
    ),

    // Button
    React.createElement(
      "button",
      {
        className: "btn fullscreen-button",
        onClick: onRestart,
      },
      APP_DATA.final.buttonText
    )
  );
};
