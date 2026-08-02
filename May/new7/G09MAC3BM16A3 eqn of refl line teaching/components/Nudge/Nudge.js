const Nudge = ({ show = false, position = null }) => {
  if (!show || !position) return null;

  const style = {
    position: "fixed",
    left: position.left + position.width / 2,
    top: position.top + position.height / 2,
    pointerEvents: "none",
    zIndex: 10001,
  };

  return React.createElement(
    "div",
    { className: "nudge-overlay", style: style },
    React.createElement("img", {
      src: "assets/tap.gif",
      alt: "",
      className: "nudge-tap-gif",
    }),
  );
};
