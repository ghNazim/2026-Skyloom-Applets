const VisualCanvas = ({ src, isVideo = false, playReverse = false, onVideoEnded, preloadVideoSrc }) => {
  const { useRef, useEffect } = React;
  const videoRef = useRef(null);
  const reverseIntervalRef = useRef(null);
  const videoUrl = isVideo ? src : (preloadVideoSrc || "");
  const showVideo = isVideo;
  const showImage = !isVideo && src;

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    const video = videoRef.current;

    if (playReverse) {
      const runReverse = () => {
        if (video.duration && isFinite(video.duration)) {
          video.currentTime = video.duration;
          const step = 1 / 30;
          reverseIntervalRef.current = setInterval(() => {
            video.currentTime = Math.max(0, video.currentTime - step);
            if (video.currentTime <= 0) {
              if (reverseIntervalRef.current) clearInterval(reverseIntervalRef.current);
              reverseIntervalRef.current = null;
              if (onVideoEnded) onVideoEnded();
            }
          }, 33);
        }
      };
      if (video.readyState >= 1) {
        runReverse();
      } else {
        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          runReverse();
        };
        video.addEventListener("loadedmetadata", onLoaded);
        return () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          if (reverseIntervalRef.current) clearInterval(reverseIntervalRef.current);
        };
      }
      return () => {
        if (reverseIntervalRef.current) clearInterval(reverseIntervalRef.current);
      };
    }

    video.currentTime = 0;
    video.play().catch(() => {});
  }, [showVideo, playReverse, src]);

  useEffect(() => {
    return () => {
      if (reverseIntervalRef.current) clearInterval(reverseIntervalRef.current);
    };
  }, []);

  const handleVideoEnded = () => {
    if (!playReverse && onVideoEnded) onVideoEnded();
  };

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
        onEnded: showVideo ? handleVideoEnded : undefined,
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
