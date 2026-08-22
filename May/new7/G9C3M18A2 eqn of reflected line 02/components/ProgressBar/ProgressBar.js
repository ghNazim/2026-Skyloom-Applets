const ProgressBar = function (props) {
  var show = props.show;
  var progress =
    props.progress == null ? 0 : Math.max(0, Math.min(1, props.progress));

  if (!show) return null;

  return React.createElement(
    "div",
    {
      className: "anim-progress-bar",
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(progress * 100),
    },
    React.createElement("div", {
      className: "anim-progress-bar-fill",
      style: { width: progress * 100 + "%" },
    }),
  );
};
