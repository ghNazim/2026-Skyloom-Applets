/**
 * Nudge - Shows a tapping hand (tap.gif) at a given position.
 * Used to hint where the user should tap (e.g. step 2: fractional digits, step 5: and button).
 * Rendered as fixed/absolute overlay from App; position comes from target element rect.
 * @param {boolean} centerOnTarget - If true, centers the nudge on the position using a fixed tap size.
 */
const Nudge = ({ show = false, position = null, centerOnTarget = false }) => {
  if (!show || !position) return null;

  const { left, top, width, height } = position;
  const TAP_SIZE_PX = 48; // approximate visual size of tap gif

  const style = {
    position: "fixed",
    left: left + (width / 2),
    top: top + (height/2 ),
    pointerEvents: "none",
    zIndex: 1000,
  };

  if (centerOnTarget) {
    style.transform = "translate(-550%, -50%)";
  } 

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
