const Visual = ({ 
  imageSrc, 
  showAreaLabel = false, 
  step, 
  substep = 0, 
  isAnswered = false,
  videoSrc = null,
  showVideo = false,
  isVideoPlaying = false,
  onVideoEnded = null,
  showLastFrame = false,
  zoomImageSrc = null,
  showZoomImage = true
}) => {
  const { useRef, useEffect } = React;
  const videoRef = useRef(null);
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  
  // Handle video playback control
  useEffect(() => {
    if (videoRef.current && showVideo) {
      if (isVideoPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoPlaying, showVideo]);
  
  // Handle video ended event
  useEffect(() => {
    const video = videoRef.current;
    if (video && onVideoEnded) {
      const handleEnded = () => {
        onVideoEnded();
      };
      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, [onVideoEnded]);
  
  // Set video to last frame when showLastFrame is true
  useEffect(() => {
    if (videoRef.current && showLastFrame) {
      videoRef.current.currentTime = videoRef.current.duration || 0;
    }
  }, [showLastFrame]);
  
  return React.createElement(
    "div",
    { className: "visual-panel", style: { position: 'relative' } },
    // Main content - video or image
    showVideo ? React.createElement("video", {
      ref: videoRef,
      src: videoSrc,
      className: "visual-video",
      muted: true,
      playsInline: true,
      preload: "metadata"
    }) : (
      isSvgInline 
        ? React.createElement("div", {
            className: "svg-inline-wrapper", 
            dangerouslySetInnerHTML: { __html: imageSrc } 
          }) 
        : React.createElement("img", {
            src: imageSrc,
            alt: "Visual representation",
            className: "visual-image",
          })
    ),
    // Zoom image - positioned absolute
    zoomImageSrc && showZoomImage && !isVideoPlaying && React.createElement("img", {
      src: zoomImageSrc,
      alt: "Zoom indicator",
      className: "zoom-img",
      style: {
        position: 'absolute',
        width: '25vw',
        height: '25vw',
        right: '-4vw',
        top: '0vw',
        zIndex: 10
      }
    })
  );
};
