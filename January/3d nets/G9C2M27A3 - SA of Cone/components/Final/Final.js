const Final = ({ onRestart }) => {
  // Replace <y>...</y> with styled span for highlight
  const finalHtml = (APP_DATA.final.text || "")
    .replace(/<y>/g, '<span class="final-highlight">')
    .replace(/<\/y>/g, "</span>");

  return React.createElement(
    "div",
    { className: "final-panel" },

    React.createElement(
      "p",
      { className: "heading" },
      APP_DATA.final.heading
    ),

    React.createElement(
      "div",
      { className: "final-content" },

      // Left: image
      React.createElement(
        "div",
        { className: "final-left" },
        React.createElement("img", {
          src: APP_DATA.final.imageSrc || "assets/unfolded.png",
          alt: APP_DATA.final.imageAlt,
          className: "final-image",
        })
      ),

      // Right: text block
      React.createElement("div", {
        className: "final-right final-text-block",
        dangerouslySetInnerHTML: { __html: `<div>${finalHtml}</div>` },
      })
    ),

    React.createElement("button", {
      className: "btn fullscreen-button",
      onClick: onRestart,
    }, APP_DATA.final.buttonText)
  );
};
