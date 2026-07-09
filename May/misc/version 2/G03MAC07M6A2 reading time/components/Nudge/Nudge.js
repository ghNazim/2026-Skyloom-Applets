/**
 * Nudge - Shows a tapping hand (tap.gif) at a given position.
 * Used to hint where the user should tap (e.g. step 2: fractional digits, step 5: and button).
 * Rendered as fixed/absolute overlay from App; position comes from target element rect.
 */
const Nudge = ({ show = false, position = null }) => {
  if (!show || !position) return null;

  const { left, top, width, height } = position;
  // Center the gif on the target element (approximate gif size in px for centering)
  const gifWidth = 48;
  const gifHeight = 48;
  const style = {
    position: "fixed",
    left: left + (width / 2),
    top: top + (height/2 ),
    pointerEvents: "none",
    zIndex: 1000,
  };

  return React.createElement(
    "div",
    { className: "nudge-overlay", style },
    React.createElement("img", {
      src: "assets/tapgrey.gif",
      alt: "",
      className: "nudge-tap-gif",
    })
  );
};
