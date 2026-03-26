const Visual = ({
  imageSrc,
  showAreaLabel = false,
  step,
  substep = 0,
  isAnswered = false,
  cutMode = false,
  cutVideoSrc = "",
  cutCutterSrc = "",
  cutKey = 0,
  onCutVideoEnded,
}) => {
  const { useRef, useLayoutEffect, useEffect, useState, useCallback } = React;
  const videoRef = useRef(null);
  const firstFrameFallbackRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  const prepareFirstFrame = useCallback((el) => {
    if (!el) return;
    el.pause();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (firstFrameFallbackRef.current) {
        window.clearTimeout(firstFrameFallbackRef.current);
        firstFrameFallbackRef.current = null;
      }
      setFirstFrameReady(true);
    };

    firstFrameFallbackRef.current = window.setTimeout(finish, 1800);

    try {
      const t0 =
        el.seekable && el.seekable.length > 0 ? el.seekable.start(0) : 0;

      el.addEventListener(
        "seeked",
        () => {
          requestAnimationFrame(() => requestAnimationFrame(finish));
        },
        { once: true },
      );

      el.currentTime = t0;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (settled) return;
          if (el.readyState >= 2 && Math.abs(el.currentTime - t0) < 0.05) {
            finish();
          }
        });
      });
    } catch (_) {
      finish();
    }
  }, []);

  useLayoutEffect(() => {
    if (!cutMode || !cutVideoSrc) return;
    setVideoPlaying(false);
    setVideoEnded(false);
    setFirstFrameReady(false);
    const v = videoRef.current;
    if (v) v.pause();
  }, [cutMode, cutKey, cutVideoSrc]);

  useEffect(() => {
    return () => {
      if (firstFrameFallbackRef.current) {
        window.clearTimeout(firstFrameFallbackRef.current);
        firstFrameFallbackRef.current = null;
      }
    };
  }, []);

  const handleCutterClick = useCallback(() => {
    if (!cutMode || !firstFrameReady || videoPlaying || videoEnded) return;
    const v = videoRef.current;
    if (!v) return;
    if (window.playSound) window.playSound("click");
    v.currentTime = 0;
    setVideoPlaying(true);
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [cutMode, firstFrameReady, videoPlaying, videoEnded]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration) && v.duration > 0) {
      v.pause();
      v.currentTime = Math.max(0, v.duration - 0.04);
    }
    setVideoPlaying(false);
    setVideoEnded(true);
    if (onCutVideoEnded) onCutVideoEnded();
  }, [onCutVideoEnded]);

  const isSvgInline = imageSrc && imageSrc.trim().startsWith("<svg");

  if (cutMode && cutVideoSrc) {
    return React.createElement(
      "div",
      { className: "visual-panel visual-panel--cut" },
      React.createElement(
        "div",
        { className: "visual-cut-stack" },
        React.createElement("video", {
          key: `cut-video-${cutKey}`,
          ref: videoRef,
          className:
            "visual-cut-video" +
            (firstFrameReady ? "" : " visual-cut-video--waiting"),
          src: cutVideoSrc,
          playsInline: true,
          preload: "auto",
          muted: false,
          onLoadedData: (e) => prepareFirstFrame(e.target),
          onEnded: handleVideoEnded,
        }),
        !videoPlaying &&
          !videoEnded &&
          firstFrameReady &&
          cutCutterSrc &&
          React.createElement("img", {
            src: cutCutterSrc,
            alt: "Cutter",
            className: "visual-cutter",
            onClick: handleCutterClick,
            role: "button",
            tabIndex: 0,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCutterClick();
              }
            },
          }),
      ),
    );
  }

  return React.createElement(
    "div",
    { className: "visual-panel" },
    !imageSrc || !imageSrc.trim() || substep < 0
      ? null
      : isSvgInline
        ? React.createElement("div", {
            className: "svg-inline-wrapper",
            dangerouslySetInnerHTML: { __html: imageSrc },
          })
        : React.createElement("img", {
            src: imageSrc,
            alt: "Visual representation",
            className: "visual-image",
          }),
  );
};
