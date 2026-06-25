const useNudgePosition = function (targetRef, active, containerRef, updateKey) {
  const { useState, useEffect } = React;
  const [position, setPosition] = useState(null);

  useEffect(
    function () {
      if (!active || !targetRef || !targetRef.current) {
        setPosition(null);
        return;
      }

      function update() {
        var el = targetRef.current;
        var container =
          containerRef && containerRef.current
            ? containerRef.current
            : document.querySelector(".applet-container");
        if (!el || !container) return;
        var rect = el.getBoundingClientRect();
        var cRect = container.getBoundingClientRect();
        setPosition({
          top: rect.top - cRect.top + rect.height / 2,
          left: rect.left - cRect.left + rect.width / 2,
        });
      }

      update();
      window.addEventListener("resize", update);
      return function () {
        window.removeEventListener("resize", update);
      };
    },
    [active, targetRef, containerRef, updateKey]
  );

  return position;
};

const Nudge = function ({ visible, top, left, className }) {
  if (!visible || top == null || left == null) return null;

  return React.createElement("img", {
    src: "assets/tap.gif",
    alt: "",
    className: "nudge" + (className ? " " + className : ""),
    style: { top: top + "px", left: left + "px" },
  });
};

const NudgeAtTarget = function ({
  targetRef,
  active,
  containerRef,
  updateKey,
  className,
}) {
  var position = useNudgePosition(targetRef, active, containerRef, updateKey);
  return React.createElement(Nudge, {
    visible: active && !!position,
    top: position ? position.top : null,
    left: position ? position.left : null,
    className: className,
  });
};
