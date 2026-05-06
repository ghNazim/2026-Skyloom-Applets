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
  comprehendTileMagnifyVideoEnded,
  onTileMagnifyClick,
  onTileMagnifyVideoEnded,
}) => {
  const videoRef = React.useRef(null);
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  const comprehendData = APP_DATA.comprehend || {};
  const altVisual =
    (APP_DATA.altTexts && APP_DATA.altTexts.visualRepresentation) || "";
  const altMagnify = (APP_DATA.altTexts && APP_DATA.altTexts.magnifyTile) || "";

  let showVideo = false;
  let videoSrc = "";
  let videoHasEnded = false;
  let videoOnEnded = function () {};

  if (step === 1 && substep === 0) {
    videoSrc = comprehendData.videoShowFloor || "";
    // Keep video visible (showVideo = true) even after it ends — the paused last
    // frame stays on screen until the user navigates to the next substep.
    showVideo = showFloorButtonClicked;
    videoHasEnded = showFloorVideoEnded;
    videoOnEnded = onVideoEnded || function () {};
  } else if (step === 1 && substep === 2) {
    videoSrc = comprehendData.videoSubstep2 || comprehendData.videoSubstep3 || "";
    showVideo = comprehendTileMagnifyClicked;
    videoHasEnded = comprehendTileMagnifyVideoEnded;
    videoOnEnded = onTileMagnifyVideoEnded || function () {};
  }

  const hasVideo = !!videoSrc;
  const hasImage = imageSrc && imageSrc.trim();
  const imageRef = React.useRef(null);
  const videoEndFiredRef = React.useRef(false);

  React.useEffect(() => {
    if (showVideo && !videoHasEnded && videoRef.current) {
      // Fresh playback (video not yet ended for this substep visit).
      videoEndFiredRef.current = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(function () {});
    }
    // If videoHasEnded is true (e.g. navigating back to this substep), the video
    // element is already paused on the last frame — do nothing.
  }, [showVideo, videoSrc, videoHasEnded]);

  const pinVideoToLastFrame = function () {
    if (!videoRef.current || !videoHasEnded) return;
    const video = videoRef.current;
    if (!video.duration || Number.isNaN(video.duration)) return;
    video.pause();
    // Use a tiny epsilon to avoid browser snapping to frame 0.
    video.currentTime = Math.max(video.duration - 0.04, 0);
  };

  const handleVideoEnd = function () {
    if (videoEndFiredRef.current) return;
    videoEndFiredRef.current = true;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    // Just notify the parent to enable Next. No image switch — the paused last
    // frame stays visible until the user navigates away.
    videoOnEnded();
  };

  const handleTimeUpdate = function () {
    if (!videoRef.current || videoEndFiredRef.current) return;
    const video = videoRef.current;
    if (video.duration && video.currentTime >= video.duration - 0.05) {
      handleVideoEnd();
    }
  };

  const handleVideoEnded = function () {
    handleVideoEnd();
  };

  const handleLoadedMetadata = function () {
    pinVideoToLastFrame();
  };

  const showTileOverlay =
    step === 1 &&
    substep === 2 &&
    !comprehendTileMagnifyClicked &&
    imageSrc &&
    onTileMagnifyClick;

  if (hasVideo) {
    return React.createElement(
      "div",
      { className: "visual-panel visual-panel-relative" },
      hasImage &&
        (isSvgInline
          ? React.createElement("div", {
              ref: imageRef,
              className: "svg-inline-wrapper visual-layer",
              dangerouslySetInnerHTML: { __html: imageSrc },
              style: {
                visibility: showVideo ? "hidden" : "visible",
                zIndex: showVideo ? 0 : 1,
              },
            })
          : React.createElement("img", {
              ref: imageRef,
              src: imageSrc,
              alt: altVisual,
              className: "visual-image visual-layer",
              style: {
                visibility: showVideo ? "hidden" : "visible",
                zIndex: showVideo ? 0 : 1,
              },
            })),
      React.createElement("video", {
        ref: videoRef,
        src: videoSrc,
        className: "visual-video visual-layer",
        preload: "auto",
        playsInline: true,
        onTimeUpdate: handleTimeUpdate,
        onEnded: handleVideoEnded,
        onLoadedMetadata: handleLoadedMetadata,
        style: {
          visibility: showVideo ? "visible" : "hidden",
          zIndex: showVideo ? 1 : 0,
        },
      }),
      showTileOverlay &&
        React.createElement("div", {
          className:
            "visual-tile-magnify" + (current_language === "id" ? " id" : ""),
          onClick: () => {
            if (window.playSound) window.playSound("click");
            onTileMagnifyClick();
          },
          role: "button",
          "aria-label": altMagnify,
          style: { zIndex: 2 },
        }),
    );
  }

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
