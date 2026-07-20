const LottiePanel = ({
  onReady,
  onUnmount,
  onLeftPanelClick,
  leftPanelClickable,
  showReplay,
  onReplay,
}) => {
  const { useRef, useEffect } = React;
  const containerRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(function () {
    if (!containerRef.current || typeof lottie === "undefined" || !data) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "html",
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
      loop: false,
      autoplay: false,
      animationData: data,
    });

    const controller = createLottieController(anim, data);
    controllerRef.current = controller;
    let readyFrameId = null;

    const relaxRendererOverflow = function () {
      if (!containerRef.current) return;
      containerRef.current.querySelectorAll("div").forEach(function (el) {
        el.style.setProperty("overflow", "visible", "important");
      });
    };

    const handleLoaded = function () {
      readyFrameId = requestAnimationFrame(function () {
        readyFrameId = null;
        relaxRendererOverflow();
        anim.resize();
        controller.goToMarker(0);
        if (typeof onReady === "function") {
          onReady(controller);
        }
      });
    };

    const handleResize = function () {
      relaxRendererOverflow();
      anim.resize();
    };

    anim.addEventListener("DOMLoaded", handleLoaded);
    window.addEventListener("resize", handleResize);

    return function () {
      if (readyFrameId) {
        cancelAnimationFrame(readyFrameId);
        readyFrameId = null;
      }
      controller.cancelAnimation();
      anim.removeEventListener("DOMLoaded", handleLoaded);
      window.removeEventListener("resize", handleResize);
      anim.destroy();
      controllerRef.current = null;
      if (typeof onUnmount === "function") {
        onUnmount(controller);
      }
    };
  }, [onReady, onUnmount]);

  return React.createElement(
    "div",
    {
      className:
        "lottie-panel" + (leftPanelClickable ? " lottie-panel-clickable" : ""),
      onClick: leftPanelClickable ? onLeftPanelClick : undefined,
      id: "lottie-visual-panel",
    },
    React.createElement("div", {
      ref: containerRef,
      className: "lottie-container",
      id: "lottie",
    }),
    showReplay
      ? React.createElement(
          "button",
          {
            type: "button",
            className: "replay-button",
            id: "replay-button",
            onClick: function (e) {
              e.stopPropagation();
              if (typeof onReplay === "function") onReplay();
            },
          },
          "\u21BB",
        )
      : null,
  );
};
