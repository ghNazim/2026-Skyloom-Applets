// components/ImageVisualization/ImageVisualization.js
const ImageVisualization = ({ imageSrc }) => {
  const h = React.createElement;

  // Check if the image source is an SVG string (starts with <svg>)
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");

  return h(
    "div",
    {
      className: "image-visualization",
    },
    isSvgInline
      ? h("div", {
          className: "svg-inline-wrapper",
          dangerouslySetInnerHTML: { __html: imageSrc },
        })
      : h("img", {
          src: imageSrc,
          alt: "Visualization",
          style: {
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          },
        })
  );
};
