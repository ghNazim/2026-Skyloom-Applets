const LottiePanel = ({
  onReady,
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
      loop: false,
      autoplay: false,
      animationData: data,
    });

    const controller = createLottieController(anim, data);
    controllerRef.current = controller;

    const handleLoaded = function () {
      controller.goToMarker(0);
      if (typeof onReady === "function") {
        onReady(controller);
      }
    };

    anim.addEventListener("DOMLoaded", handleLoaded);

    return function () {
      controller.cancelAnimation();
      anim.removeEventListener("DOMLoaded", handleLoaded);
      anim.destroy();
      controllerRef.current = null;
    };
  }, [onReady]);

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
