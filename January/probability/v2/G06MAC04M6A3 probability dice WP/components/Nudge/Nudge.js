/**
 * Nudge - Shows a tapping hand (tap.gif) anchored to a target element via ref.
 * Used to hint where the user should tap (e.g. intro button, next button).
 * Rendered as fixed overlay; position derived from target element's bounding rect.
 */
const Nudge = ({ show = false, targetRef = null }) => {
  const { useState, useEffect } = React;
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!show || !targetRef) {
      setPosition(null);
      return;
    }
    const update = () => {
      var el = targetRef.current;
      if (!el) {
        setPosition(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setPosition({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    };
    update();
    var raf = requestAnimationFrame(function () {
      update();
    });
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [show, targetRef]);

  if (!show || !position) return null;

  const { left, top, width, height } = position;
  const style = {
    position: "fixed",
    left: left + width / 2,
    top: top + height / 2,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    zIndex: 1000,
  };

  return React.createElement(
    "div",
    { className: "nudge-overlay", style },
    React.createElement("img", {
      src: "assets/tap.gif",
      alt: "",
      className: "nudge-tap-gif",
    })
  );
};
