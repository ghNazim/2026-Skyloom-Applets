const SplashScreen = ({ imageSrc, text, step }) => {
  const { useRef, useEffect } = React;
  const videoRef = useRef(null);
  
  // Get splash data to check if we should use video
  const splashData = APP_DATA.splash[`step${step}`];
  const useVideoLastFrame = splashData && splashData.useVideoLastFrame;
  const videoSrc = splashData && splashData.videoSrc;
  const zoomImageSrc = splashData && splashData.zoomImageSrc;
  
  // Set video to last frame when component mounts
  useEffect(() => {
    if (videoRef.current && useVideoLastFrame) {
      const video = videoRef.current;
      const setToLastFrame = () => {
        video.currentTime = video.duration;
      };
      
      if (video.readyState >= 1) {
        setToLastFrame();
      } else {
        video.addEventListener('loadedmetadata', setToLastFrame);
        return () => video.removeEventListener('loadedmetadata', setToLastFrame);
      }
    }
  }, [useVideoLastFrame]);
  
  return React.createElement(
    "div",
    { className: "splash-screen" },
    // Top row - Video last frame or Image (70% height)
    React.createElement(
      "div",
      { className: "splash-image-container", style: { position: 'relative' } },
      useVideoLastFrame ? React.createElement("video", {
        ref: videoRef,
        src: videoSrc,
        className: "splash-image",
        muted: true,
        playsInline: true,
        preload: "metadata"
      }) : React.createElement("img", {
        src: imageSrc,
        alt: "Summary visual",
        className: "splash-image",
      }),
      // Zoom image for splash screen
      zoomImageSrc && React.createElement("img", {
        src: zoomImageSrc,
        alt: "Zoom indicator",
        className: "zoom-img",
        style: {
          position: 'absolute',
          width: '25vw',
          height: '25vw',
          right: '10vw',
          top: '0vw',
          zIndex: 10
        }
      })
    ),
    // Bottom row - Text (30% height)
    React.createElement(
      "div",
      { 
        className: "splash-text-container",
        dangerouslySetInnerHTML: { __html: text }
      }
    )
  );
};
