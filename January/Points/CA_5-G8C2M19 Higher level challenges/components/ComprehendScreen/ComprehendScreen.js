// components/ComprehendScreen/ComprehendScreen.js
const ComprehendScreen = ({
  subStep,
  stage,
  videoPlayed,
  onShowPyramid,
  onVideoEnd,
}) => {
  const h = React.createElement;
  const { useState, useRef, useEffect } = React;

  if (!stage) return null;

  const videoRef = useRef(null);
  const shouldPauseRef = useRef(true); // Track if we should pause the video
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // Reset videoEnded when stage changes
  useEffect(() => {
    setVideoEnded(false);
    setIsPlayingVideo(false);
    setButtonDisabled(false);
    shouldPauseRef.current = true; // Reset pause flag when stage changes
  }, [stage]);

  // Handle video loading and ensure it starts paused at 0
  useEffect(() => {
    if (stage.type === "showPyramid" && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedData = () => {
        if (shouldPauseRef.current) {
          video.currentTime = 0;
          video.pause();
        }
      };

      const handleCanPlay = () => {
        if (shouldPauseRef.current) {
          video.currentTime = 0;
          video.pause();
        }
      };

      // Set initial state
      if (video.readyState >= 2) {
        // Video data is already loaded
        if (shouldPauseRef.current) {
          video.currentTime = 0;
          video.pause();
        }
      } else {
        // Wait for video to load
        video.addEventListener("loadeddata", handleLoadedData);
      }

      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [stage]);

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;
    if (video && isPlayingVideo) {
      const handleEnded = () => {
        setVideoEnded(true);
        setIsPlayingVideo(false);
        onVideoEnd();
      };
      video.addEventListener("ended", handleEnded);
      return () => {
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [isPlayingVideo, onVideoEnd]);

  // Render left panel with image or video
  const renderLeftPanel = () => {
    return h(
      "div",
      { className: "left-panel" },
      h(
        "div",
        { className: "visualization-box" },
        stage.type === "showPyramid" && stage.videoSrc
          ? h("video", {
              ref: videoRef,
              src: stage.videoSrc,
              className: "pyramid-video",
              preload: "auto",
              style: {
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              },
            })
          : h(ImageVisualization, {
              imageSrc: stage.imageSrc,
            })
      )
    );
  };

  // Render right panel with buttons
  const renderRightPanel = () => {
    if (stage.type === "showPyramid") {
      if (videoPlayed) {
        return null; // Video already played, no button needed
      }
      return h(
        "div",
        { className: "right-panel" },
        h(
          "button",
          {
            className: "action-button",
            disabled: buttonDisabled,
            onClick: () => {
              setButtonDisabled(true);
              setIsPlayingVideo(true);
              shouldPauseRef.current = false; // Don't pause after this
              onShowPyramid();
              // Play video after a short delay to ensure it's mounted and loaded
              setTimeout(() => {
                if (videoRef.current) {
                  const video = videoRef.current;
                  // Ensure video is at the start
                  video.currentTime = 0;
                  // Try to play the video
                  const playPromise = video.play();
                  if (playPromise !== undefined) {
                    playPromise
                      .then(() => {
                        // Video is playing
                      })
                      .catch((error) => {
                        // Auto-play was prevented or failed
                        console.error("Video play failed:", error);
                        // Try again
                        setTimeout(() => {
                          if (videoRef.current) {
                            videoRef.current.play().catch((e) => {
                              console.error("Retry play also failed:", e);
                            });
                          }
                        }, 100);
                      });
                  }
                }
              }, 100);
            },
          },
          T.ui.showPyramidButton
        )
      );
    }

    if (stage.type === "showLabelled") {
      // Step -1: No text in right panel
      return null;
    }

    if (stage.type === "findB" || stage.type === "findArea") {
      return h(
        "div",
        { className: "right-panel" },
        h(
          "div",
          { className: "comprehend-text" },
          stage.instruction
            .split("\n")
            .map((line, idx) =>
              h("p", { key: idx, style: { margin: "10px 0" } }, line)
            )
        )
      );
    }

    return null;
  };

  return h(
    "div",
    { className: "comprehend-screen" },
    renderLeftPanel(),
    renderRightPanel()
  );
};
