const Nudge = (props) => {
  const targetRef = props.targetRef;
  const show = props.show !== false;
  const asset = props.asset || "assets/tap.gif";
  const transform = props.transform || "translate(30%, 0%)";
  const verticalDrag = props.verticalDrag || false;
  
  const { useState, useEffect } = React;
  const [position, setPosition] = useState(null);

  useEffect(function () {
    if (!show || !targetRef) {
      setPosition(null);
      return undefined;
    }

    function updatePosition() {
      const el = targetRef.current;
      if (!el) {
        setPosition(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPosition(null);
        return;
      }
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
      });
    }

    updatePosition();
    const intervalId = setInterval(updatePosition, 150);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return function () {
      clearInterval(intervalId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [show, targetRef]);

  if (!show || !position) return null;

  return React.createElement(
    "div",
    {
      className: "nudge-overlay",
      style: {
        position: "fixed",
        left: position.left,
        top: position.top,
        transform: transform,
        pointerEvents: "none",
        zIndex: 10000,
      },
    },
    React.createElement("img", {
      src: asset,
      alt: "",
      className: "nudge-tap-gif" + (verticalDrag ? " vertical-drag" : ""),
    })
  );
};
