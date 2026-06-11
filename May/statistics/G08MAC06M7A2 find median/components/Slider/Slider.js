const CustomSlider = ({ min, max, step, value, onChange }) => {
  var useRef = React.useRef;
  var useEffect = React.useEffect;
  var useState = React.useState;
  var trackRef = useRef(null);
  var isDragging = useRef(false);
  var _showDragHint = useState(true);
  var showDragHint = _showDragHint[0];
  var setShowDragHint = _showDragHint[1];

  var steps = [];
  for (var v = min; v <= max; v += step) steps.push(v);
  var totalSteps = steps.length - 1;

  var currentIdx = 0;
  for (var si = 0; si < steps.length; si++) {
    if (steps[si] === value) { currentIdx = si; break; }
  }
  var pct = totalSteps > 0 ? (currentIdx / totalSteps) * 100 : 0;

  function getValueFromX(clientX) {
    var track = trackRef.current;
    if (!track) return value;
    var rect = track.getBoundingClientRect();
    var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    var idx = Math.round(ratio * totalSteps);
    return steps[idx];
  }

  function dismissDragHint() {
    setShowDragHint(false);
  }

  function handlePointerDown(e) {
    e.preventDefault();
    isDragging.current = true;
    dismissDragHint();
    var cx = e.touches ? e.touches[0].clientX : e.clientX;
    var newVal = getValueFromX(cx);
    if (newVal !== value) {
      if (typeof playSound === "function") playSound("click");
      onChange(newVal);
    }
  }

  useEffect(function () {
    function onMove(e) {
      if (!isDragging.current) return;
      e.preventDefault();
      dismissDragHint();
      var cx = e.touches ? e.touches[0].clientX : e.clientX;
      var newVal = getValueFromX(cx);
      if (newVal !== value) {
        if (typeof playSound === "function") playSound("click");
        onChange(newVal);
      }
    }
    function onUp() { isDragging.current = false; }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onUp);
    return function () {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [value, onChange]);

  return React.createElement(
    "div",
    {
      className: "custom-slider",
      ref: trackRef,
      onMouseDown: handlePointerDown,
      onTouchStart: handlePointerDown,
    },
    React.createElement("div", { className: "slider-track" },
      React.createElement("div", {
        className: "slider-fill",
        style: { width: pct + "%" },
      })
    ),
    React.createElement(
      "div",
      {
        className: "slider-thumb",
        style: { left: pct + "%" },
      },
      React.createElement("span", { className: "slider-thumb-value" }, value),
      showDragHint
        ? React.createElement("img", {
            src: "assets/horizontalDrag.gif",
            alt: "",
            className: "slider-drag-hint",
          })
        : null
    )
  );
};
