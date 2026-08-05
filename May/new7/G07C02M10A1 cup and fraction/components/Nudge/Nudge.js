/**
 * Nudge - Shows a tap or drag hint at a given position.
 * Used to hint where the user should tap (e.g. step 2: fractional digits, step 5: and button).
 * Rendered as fixed/absolute overlay from App; position comes from target element rect.
 */
const Nudge = ({ show = false, position = null, kind = "tap" }) => {
  if (!show || !position) return null;

  const { left, top, width, height } = position;
  const style = {
    position: "fixed",
    left: left + (width / 2),
    top: top + (height/2 ),
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    zIndex: 1000,
  };

  return React.createElement(
    "div",
    { className: "nudge-overlay nudge-" + kind, style },
    React.createElement("img", {
      src: kind === "drag" ? "assets/verticalDrag.gif" : "assets/tap.gif",
      alt: "",
      className: "nudge-gif",
    })
  );
};
