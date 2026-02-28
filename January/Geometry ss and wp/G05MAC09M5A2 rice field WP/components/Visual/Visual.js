const Visual = ({ imageSrc, showAreaLabel = false, step, substep = 0, isAnswered = false }) => {
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  
  return React.createElement(
    "div",
    { className: "visual-panel" },
    !imageSrc || !imageSrc.trim() || substep < 0
      ? null
      : isSvgInline
        ? React.createElement("div", {
            className: "svg-inline-wrapper",
            dangerouslySetInnerHTML: { __html: imageSrc }
          })
        : React.createElement("img", {
            src: imageSrc,
            alt: "Visual representation",
            className: "visual-image",
          })
  );
};
