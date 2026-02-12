const Visual = ({ imageSrc, showAreaLabel = false, step, substep = 0, isAnswered = false }) => {
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  
  return React.createElement(
    "div",
    { className: "visual-panel" },
    isSvgInline 
      ? React.createElement("div", {
          className: "svg-inline-wrapper", 
          dangerouslySetInnerHTML: { __html: imageSrc } 
        }) 
      : React.createElement("img", {
          src: imageSrc,
          alt: APP_DATA?.altTexts?.visualRepresentation,
          className: "visual-image",
        })
  );
};
