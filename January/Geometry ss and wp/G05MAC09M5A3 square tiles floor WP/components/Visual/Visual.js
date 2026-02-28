const Visual = ({ imageSrc, showAreaLabel = false, step, substep = 0, isAnswered = false, videoSrc = "", playVideo = false, onVideoEnded }) => {
  const videoRef = React.useRef(null);
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  const showVideo = playVideo && videoSrc;
  const hasImage = imageSrc && imageSrc.trim();

  React.useEffect(() => {
    if (showVideo && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(function () {});
    }
  }, [showVideo, videoSrc]);

  return React.createElement(
    "div",
    { className: "visual-panel" },
    hasImage && (
      isSvgInline
        ? React.createElement("div", {
            className: "svg-inline-wrapper visual-layer",
            dangerouslySetInnerHTML: { __html: imageSrc },
            style: {
              visibility: showVideo ? "hidden" : "visible",
              zIndex: showVideo ? 0 : 1
            }
          })
        : React.createElement("img", {
            src: imageSrc,
            alt: "Visual representation",
            className: "visual-image visual-layer",
            style: {
              visibility: showVideo ? "hidden" : "visible",
              zIndex: showVideo ? 0 : 1
            }
          })
    ),
    videoSrc && React.createElement("video", {
      ref: videoRef,
      src: videoSrc,
      className: "visual-video visual-layer",
      preload: "auto",
      playsInline: true,
      onEnded: onVideoEnded || (function () {}),
      style: {
        visibility: showVideo ? "visible" : "hidden",
        zIndex: showVideo ? 1 : 0
      }
    })
  );
};
