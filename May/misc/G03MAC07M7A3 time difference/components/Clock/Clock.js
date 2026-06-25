const Clock = ({ time = { hours: 6, minutes: 13 }, showCircles = 3, sector = { start: 0, end: 15, radius: 42 } }) => {
  const { hours, minutes } = time;

  const minuteRotation = minutes * 6;
  const hourRotation = (hours % 12) * 30 + (minutes * 0.5);

  const circles = [];
  // Adjust this value to push the circles further out or pull them closer in.
  // 50 means the circles sit on the edge of the 100% width container.
  const circleRadius = 50; 
  
  for (let i = 0; i < showCircles; i++) {
    const num = i * 5;
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x = 50 + circleRadius * Math.cos(angle);
    const y = 50 + circleRadius * Math.sin(angle);
    
    circles.push(
      React.createElement("div", {
        key: i,
        className: "clock-circle",
        style: {
          left: `${x}%`,
          top: `${y}%`,
        }
      }, num)
    );
  }

  let sectorSvg = null;
  if (sector && sector.start !== sector.end) {
    const startAngle = (sector.start * 6 - 90) * (Math.PI / 180);
    const endAngle = (sector.end * 6 - 90) * (Math.PI / 180);
    
    const x1 = 50 + sector.radius * Math.cos(startAngle);
    const y1 = 50 + sector.radius * Math.sin(startAngle);
    
    const x2 = 50 + sector.radius * Math.cos(endAngle);
    const y2 = 50 + sector.radius * Math.sin(endAngle);
    
    const largeArcFlag = ((sector.end - sector.start + 60) % 60) > 30 ? 1 : 0;
    const pathData = `M 50 50 L ${x1} ${y1} A ${sector.radius} ${sector.radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    sectorSvg = React.createElement(
      "svg",
      { 
        viewBox: "0 0 100 100", 
        className: "clock-sector-svg",
        style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5, pointerEvents: "none" }
      },
      React.createElement("path", {
        d: pathData,
        fill: "rgba(255, 215, 0, 0.5)",
        stroke: "black",
        strokeWidth: "0.2",
        strokeLinejoin: "round"
      })
    );
  }

  return React.createElement(
    "div",
    { className: "clock-wrapper" },
    React.createElement(
      "div",
      { className: "clock-container" },
      React.createElement("img", { src: "assets/clock.png", className: "clock-body", alt: "clock" }),
      sectorSvg,
      ...circles,
      React.createElement("img", { 
        src: "assets/hhand.png", 
        className: "clock-hand hour-hand", 
        style: { transform: `rotate(${hourRotation}deg)` },
        alt: "hour hand" 
      }),
      React.createElement("img", { 
        src: "assets/mhand.png", 
        className: "clock-hand minute-hand", 
        style: { transform: `rotate(${minuteRotation}deg)` },
        alt: "minute hand" 
      })
    )
  );
};
