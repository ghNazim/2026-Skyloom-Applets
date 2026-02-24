const Visual = ({ imageSrc, showAreaLabel = false, step, substep = 0, isAnswered = false, videoSrc = "", playVideo = false, onVideoEnded }) => {
  const videoRef = React.useRef(null);
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");

  React.useEffect(() => {
    if (playVideo && videoSrc && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(function () {});
    }
  }, [playVideo, videoSrc]);

  if (playVideo && videoSrc) {
    return React.createElement(
      "div",
      { className: "visual-panel" },
      React.createElement("video", {
        ref: videoRef,
        src: videoSrc,
        className: "visual-video",
        playsInline: true,
        onEnded: onVideoEnded || (function () {}),
      })
    );
  }

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
            alt: "Visual representation",
            className: "visual-image",
          })
  );
};
