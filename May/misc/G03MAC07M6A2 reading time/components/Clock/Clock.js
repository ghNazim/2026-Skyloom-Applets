const Clock = ({
  time = { hours: 6, minutes: 13 },
  showCircles = 1,
  sector = null,
  extraSectors = [],
  showNumCircles = false,
  onNumCircleClick = null,
  numCircleRefs = null,
}) => {
  const { hours, minutes } = time;

  const minuteRotation = minutes * 6;
  const hourRotation = (hours % 12) * 30 + minutes * 0.5;

  const circles = [];
  const circleRadius = 50;

  for (let i = 0; i < showCircles; i++) {
    const num = i * 5;
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x = 50 + circleRadius * Math.cos(angle);
    const y = 50 + circleRadius * Math.sin(angle);

    circles.push(
      React.createElement(
        "div",
        {
          key: "c-" + i,
          className: "clock-circle",
          style: { left: x + "%", top: y + "%" },
        },
        num
      )
    );
  }

  const numCircles = [];
  if (showNumCircles) {
    const numCircleRadius = 32;
    for (let n = 1; n <= 12; n++) {
      const angle = (n * 30 - 90) * (Math.PI / 180);
      const x = 50 + numCircleRadius * Math.cos(angle);
      const y = 50 + numCircleRadius * Math.sin(angle);

      numCircles.push(
        React.createElement(
          "div",
          {
            key: "n-" + n,
            className: "num-circle",
            ref: numCircleRefs && numCircleRefs[n] ? numCircleRefs[n] : null,
            style: { left: x + "%", top: y + "%" },
            onClick: () => onNumCircleClick && onNumCircleClick(n),
          }
        )
      );
    }
  }

  const renderSectorPath = (sec, key) => {
    if (!sec || sec.start === sec.end) return null;

    const startAngle = (sec.start * 6 - 90) * (Math.PI / 180);
    const endAngle = (sec.end * 6 - 90) * (Math.PI / 180);
    const radius = sec.radius != null ? sec.radius : 42;

    const x1 = 50 + radius * Math.cos(startAngle);
    const y1 = 50 + radius * Math.sin(startAngle);
    const x2 = 50 + radius * Math.cos(endAngle);
    const y2 = 50 + radius * Math.sin(endAngle);

    const largeArcFlag = ((sec.end - sec.start + 60) % 60) > 30 ? 1 : 0;
    const pathData = `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    const fill = sec.color || "rgba(255, 215, 0, 0.5)";

    return React.createElement("path", {
      key: key,
      d: pathData,
      fill: fill,
      stroke: "black",
      strokeWidth: "0.2",
      strokeLinejoin: "round",
    });
  };

  const sectorPaths = [];
  if (sector) {
    const p = renderSectorPath(sector, "sector-main");
    if (p) sectorPaths.push(p);
  }
  extraSectors.forEach((sec, i) => {
    const p = renderSectorPath(sec, "sector-extra-" + i);
    if (p) sectorPaths.push(p);
  });

  const sectorSvg =
    sectorPaths.length > 0
      ? React.createElement(
          "svg",
          {
            viewBox: "0 0 100 100",
            className: "clock-sector-svg",
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
              pointerEvents: "none",
            },
          },
          ...sectorPaths
        )
      : null;

  return React.createElement(
    "div",
    { className: "clock-wrapper" },
    React.createElement(
      "div",
      { className: "clock-container" },
      React.createElement("img", { src: "assets/clock.png", className: "clock-body", alt: "clock" }),
      sectorSvg,
      ...numCircles,
      ...circles,
      React.createElement("img", {
        src: "assets/hhand.png",
        className: "clock-hand hour-hand",
        style: { transform: `rotate(${hourRotation}deg)` },
        alt: "hour hand",
      }),
      React.createElement("img", {
        src: "assets/mhand.png",
        className: "clock-hand minute-hand",
        style: { transform: `rotate(${minuteRotation}deg)` },
        alt: "minute hand",
      })
    )
  );
};
