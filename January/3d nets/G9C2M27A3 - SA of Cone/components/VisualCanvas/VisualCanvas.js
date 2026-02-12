const VisualCanvas = ({ src, isVideo = false, onVideoEnded, preloadVideoSrc }) => {
  const { useRef, useEffect } = React;
  const videoRef = useRef(null);
  const videoUrl = isVideo ? src : (preloadVideoSrc || "");
  const showVideo = isVideo;
  const showImage = !isVideo && src;

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    const video = videoRef.current;
    video.play().catch(() => {});
  }, [showVideo]);

  if (!src && !videoUrl) return null;

  return React.createElement(
    "div",
    { className: "visual-canvas", style: { position: "relative" } },
    showImage &&
      React.createElement("img", {
        className: "visual-canvas-media",
        style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "contain" },
        src: src,
        alt: "",
      }),
    (showVideo || preloadVideoSrc) &&
      React.createElement("video", {
        ref: videoRef,
        className: "visual-canvas-media",
        src: videoUrl,
        preload: "auto",
        playsInline: true,
        onEnded: showVideo ? onVideoEnded : undefined,
        style: {
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          visibility: showVideo ? "visible" : "hidden",
          zIndex: showVideo ? 1 : -1,
        },
      })
  );
};
