const Final = ({ onRestart }) => {
  // Replace <y>...</y> with styled span for highlight
  const text2Html = (APP_DATA.final.text2 || "")
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

    // Content rows: text1, image, text2
    React.createElement(
      "div",
      { className: "final-content-rows" },

      // Text 1
      React.createElement(
        "p",
        { className: "final-text" },
        APP_DATA.final.text1
      ),

      // Image
      React.createElement("img", {
        src: "assets/final.png",
        alt: APP_DATA.final.imageAlt,
        className: "final-image-row",
      }),

      // Text 2 (with formula highlight)
      React.createElement("div", {
        className: "final-text",
        dangerouslySetInnerHTML: { __html: text2Html },
      })
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
