/**
 * Nudge - Shows a tapping hand (tap.gif) at a given position.
 * Used to hint where the user should tap (start or next button).
 */
const Nudge = ({ show = false, position = null }) => {
  if (!show || !position) return null;

  const { left, top, width, height } = position;
  const style = {
    position: "fixed",
    left: left + width / 2,
    top: top + height / 2,
    transform: "translate(-50%, 0%)",
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
