const Visual = ({
  imageSrc,
  showAreaLabel = false,
  step,
  substep = 0,
  isAnswered = false,
  showFloorButtonClicked,
  showFloorVideoEnded,
  onVideoEnded,
  comprehendTileMagnifyClicked,
  onTileMagnifyClick
}) => {
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  const comprehendData = APP_DATA.comprehend || {};
  const altVisual = (APP_DATA.altTexts && APP_DATA.altTexts.visualRepresentation) || "";
  const altMagnify = (APP_DATA.altTexts && APP_DATA.altTexts.magnifyTile) || "";

  // Step 1, substep 0: show video when "Show Floor" clicked until ended, then image
  if (step === 1 && substep === 0) {
    if (showFloorButtonClicked && !showFloorVideoEnded && comprehendData.videoShowFloor) {
      return React.createElement(
        "div",
        { className: "visual-panel" },
        React.createElement("video", {
          className: "visual-video",
          src: comprehendData.videoShowFloor,
          autoPlay: true,
          playsInline: true,
          onEnded: onVideoEnded || (function() {})
        })
      );
    }
    if (showFloorVideoEnded && imageSrc) {
      return React.createElement(
        "div",
        { className: "visual-panel" },
        React.createElement("img", {
          src: imageSrc,
          alt: altVisual,
          className: "visual-image"
        })
      );
    }
  }

  // Step 1, substep 3: show image + clickable tile overlay until magnify clicked
  if (step === 1 && substep === 3) {
    const showTileOverlay = !comprehendTileMagnifyClicked && imageSrc;
    return React.createElement(
      "div",
      { className: "visual-panel visual-panel-relative" },
      imageSrc && React.createElement("img", {
        src: imageSrc,
        alt: "Visual representation",
        className: "visual-image"
      }),
      showTileOverlay && onTileMagnifyClick && React.createElement("div", {
        className: "visual-tile-magnify",
        onClick: () => {
          if (window.playSound) window.playSound("click");
          onTileMagnifyClick();
        },
        role: "button",
        "aria-label": "Magnify tile"
      })
    );
  }

  // Default: image or SVG
  return React.createElement(
    "div",
    { className: "visual-panel" },
    !imageSrc || !imageSrc.trim()
      ? null
      : isSvgInline
        ? React.createElement("div", {
            className: "svg-inline-wrapper",
            dangerouslySetInnerHTML: { __html: imageSrc }
          })
        : React.createElement("img", {
            src: imageSrc,
            alt: altVisual,
            className: "visual-image"
          })
  );
};
