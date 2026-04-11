const Visual = ({
  imageSrc,
  step,
  substep = 0,
}) => {
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  const altVisual =
    (APP_DATA.altTexts && APP_DATA.altTexts.visualRepresentation) || "";
  const hasImage = imageSrc && imageSrc.trim();

  return React.createElement(
    "div",
    { className: "visual-panel" },
    !hasImage
      ? null
      : isSvgInline
        ? React.createElement("div", {
            className: "svg-inline-wrapper",
            dangerouslySetInnerHTML: { __html: imageSrc },
          })
        : React.createElement("img", {
            src: imageSrc,
            alt: altVisual,
            className: "visual-image",
          }),
  );
};
