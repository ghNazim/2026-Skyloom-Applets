const RectangleSliderPanel = ({ onComplete }) => {
  const { useState, useRef } = React;
  const r = APP_DATA.rectangle;
  const colors = APP_DATA.colors;
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value)));
  const finishIfCorrect = (nextDx, nextDy) => {
    if (nextDx === 4 && nextDy === 2 && !doneRef.current) {
      doneRef.current = true;
      setDone(true);
      if (typeof playSound === "function") playSound("congrats");
      if (typeof onComplete === "function") onComplete();
    }
  };

  const updateDx = (value) => {
    if (done) return;
    const next = Math.round(clamp(value, -4, 4));
    setStarted(true);
    setDx(next);
  };

  const updateDy = (value) => {
    if (done) return;
    const next = Math.round(clamp(value, -3, 3));
    setStarted(true);
    setDy(next);
  };

  const releaseDx = (value) => {
    if (done) return;
    const next = Math.round(clamp(value, -4, 4));
    setDx(next);
    finishIfCorrect(next, dy);
  };

  const releaseDy = (value) => {
    if (done) return;
    const next = Math.round(clamp(value, -3, 3));
    setDy(next);
    finishIfCorrect(dx, next);
  };

  const sliderPct = (value, min, max) => ((value - min) / (max - min)) * 100;

  const renderSlider = ({
    value,
    min,
    max,
    onChange,
    onRelease,
    leftText,
    rightText,
    labels,
  }) =>
    React.createElement(
      "div",
      { className: "rect-slider-control" },
      React.createElement(
        "div",
        { className: "rect-slider-line" },
        React.createElement("span", { className: "rect-slider-side left" }, leftText),
        React.createElement(
          "div",
          { className: "rect-slider-track" },
          React.createElement("div", { className: "rect-slider-track-active" }),
          React.createElement(
            "div",
            {
              className: "rect-slider-thumb",
              style: { left: sliderPct(value, min, max) + "%" },
            },
            value > 0 ? "+" + value : String(value),
          ),
          React.createElement("input", {
            type: "range",
            min: min,
            max: max,
            step: 1,
            value: value,
            disabled: done,
            onInput: (e) => onChange(e.target.value),
            onChange: (e) => onChange(e.target.value),
            onMouseUp: (e) => onRelease(e.target.value),
            onTouchEnd: (e) => onRelease(e.target.value),
            onPointerUp: (e) => onRelease(e.target.value),
          }),
        ),
        React.createElement("span", { className: "rect-slider-side right" }, rightText),
      ),
      React.createElement(
        "div",
        { className: "rect-slider-labels" },
        labels.map((label, index) =>
          React.createElement("span", { key: index }, label),
        ),
      ),
    );

  const rectangles = [
    {
      id: "object",
      x: 4,
      y: 3,
      width: 3,
      height: 2,
      fill: colors.object,
      fillOpacity: 1,
      stroke: "#ffffff",
    },
    {
      id: "image",
      x: 8,
      y: 5,
      width: 3,
      height: 2,
      fill: colors.image,
      fillOpacity: done ? 1 : 0.2,
      stroke: "#ffffff",
      strokeOpacity: 1,
      html: r.imagePositionText,
      textColor: "#ffffff",
      textOpacity: 1,
      fontSize: 17,
    },
  ];

  if (started && !done) {
    rectangles.push({
      id: "clone",
      x: 4 + dx,
      y: 3 + dy,
      width: 3,
      height: 2,
      fill: "#c8b84e",
      fillOpacity: 0.88,
      stroke: "#ffffff",
    });
  }

  const paths = done
    ? [
        {
          id: "translation-path",
          from: { x: 7, y: 3 },
          via: { x: 11, y: 3 },
          to: { x: 11, y: 5 },
          color: "#98d84e",
          dashed: true,
          strokeWidth: 2.5,
        },
      ]
    : [];

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "main-canvas-left is-visible" },
      React.createElement(ActivityGraph, {
        rectangles: rectangles,
        paths: paths,
      }),
    ),
    React.createElement(
      "div",
      { className: "main-canvas-right is-visible" },
      React.createElement(
        "div",
        { className: "rectangle-slider-panel" },
        renderSlider({
          value: dx,
          min: -4,
          max: 4,
          onChange: updateDx,
          onRelease: releaseDx,
          leftText: r.leftLabel,
          rightText: r.rightLabel,
          labels: ["4", "3", "2", "1", "0", "1", "2", "3", "4"],
        }),
        renderSlider({
          value: dy,
          min: -3,
          max: 3,
          onChange: updateDy,
          onRelease: releaseDy,
          leftText: r.downLabel,
          rightText: r.upLabel,
          labels: ["3", "2", "1", "0", "1", "2", "3"],
        }),
        done
          ? React.createElement("div", {
              className: "rectangle-feedback",
              dangerouslySetInnerHTML: { __html: r.feedbackCorrect },
            })
          : null,
      ),
    ),
  );
};
