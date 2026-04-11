/**
 * Nudge - Shows a hand hint (tap / tap-grey / drag) at a given position.
 * Rendered as fixed overlay from App; position comes from target element rect.
 * @param {"tap"|"tapGrey"|"drag"} [variant="tap"] - tapGrey: visible on light backgrounds (e.g. step 11 ruler); drag: step 12 slider
 */
const Nudge = ({ show = false, position = null, variant = "tap" }) => {
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

  const gif =
    variant === "tapGrey"
      ? { src: "assets/tapgrey.gif", className: "nudge-tap-grey-gif" }
      : variant === "drag"
        ? { src: "assets/drag.gif", className: "nudge-drag-gif" }
        : { src: "assets/tap.gif", className: "nudge-tap-gif" };

  return React.createElement(
    "div",
    { className: "nudge-overlay", style },
    React.createElement("img", {
      src: gif.src,
      alt: "",
      className: gif.className,
    }),
  );
};
