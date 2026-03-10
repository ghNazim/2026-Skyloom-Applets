const Visual = ({
  imageSrc,
  visualCharacterSrc,
  visualText,
}) => {
  const renderVisualText = (text) => {
    if (!text) return null;
    const html = String(text)
      .replace(/<green>/g, '<span class="vt-highlight vt-green">')
      .replace(/<\/green>/g, "</span>")
      .replace(/<red>/g, '<span class="vt-highlight vt-red">')
      .replace(/<\/red>/g, "</span>");
    return React.createElement("div", {
      className: "visual-text-box",
      dangerouslySetInnerHTML: { __html: html },
    });
  };

  return React.createElement(
    "div",
    { className: "visual-component" },
    React.createElement(
      "div",
      { className: "visual-top-row" },
      React.createElement("img", {
        src: imageSrc ? `assets/${imageSrc}?t=${Date.now()}` : "",
        alt: "Question",
        className: "visual-question-image",
      })
    ),
    React.createElement(
      "div",
      { className: "visual-bottom-row" },
      React.createElement("img", {
        src: visualCharacterSrc ? `assets/${visualCharacterSrc}` : "",
        alt: "Character",
        className: "visual-character",
      }),
      renderVisualText(visualText)
    )
  );
};
