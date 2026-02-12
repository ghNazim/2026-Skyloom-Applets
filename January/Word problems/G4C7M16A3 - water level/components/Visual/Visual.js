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
  const onVideoEndedRef = useRef(onVideoEnded);
  const hasCalledEndedRef = useRef(false);
  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");
  
  onVideoEndedRef.current = onVideoEnded;
  
  // Handle video playback control
  useEffect(() => {
    if (videoRef.current && showVideo) {
      if (isVideoPlaying) {
        hasCalledEndedRef.current = false;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoPlaying, showVideo]);
  
  // Attach ended listener when we are in playing state (so it's on the right video at the right time)
  useEffect(() => {
    if (!showVideo || !isVideoPlaying) return;
    const video = videoRef.current;
    if (!video) return;
    
    const handleEnded = () => {
      if (hasCalledEndedRef.current) return;
      hasCalledEndedRef.current = true;
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = video.duration;
      }
      video.pause();
      onVideoEndedRef.current && onVideoEndedRef.current();
    };
    
    const handleTimeUpdate = () => {
      if (video.duration && isFinite(video.duration) && video.currentTime >= video.duration - 0.1) {
        handleEnded();
      }
    };
    
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [showVideo, isVideoPlaying]);
  
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
      preload: "metadata",
      loop: false
    }) : (
      isSvgInline 
        ? React.createElement("div", {
            className: "svg-inline-wrapper", 
            dangerouslySetInnerHTML: { __html: imageSrc } 
          }) 
        : React.createElement("img", {
            src: imageSrc,
            alt: (APP_DATA.labels && APP_DATA.labels.visualRepresentationAlt) || "Visual representation",
            className: "visual-image",
          })
    ),
    // Zoom image - positioned absolute
    zoomImageSrc && showZoomImage && !isVideoPlaying && React.createElement("img", {
      src: zoomImageSrc,
      alt: (APP_DATA.labels && APP_DATA.labels.zoomIndicatorAlt) || "Zoom indicator",
      className: "zoom-img",
      style: {
        position: 'absolute',
        width: '21vw',
        height: '21vw',
        right: '0vw',
        top: '2vw',
        zIndex: 10
      }
    })
  );
};
