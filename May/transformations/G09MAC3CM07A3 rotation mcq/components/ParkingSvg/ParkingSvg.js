const ParkingSvg = ({ carAngle, showDanger, showCrashEffect }) => {
  const topPt = getPointOnParkingCircle(-90);
  const bottomPt = getPointOnParkingCircle(90);
  const carPt = getPointOnParkingCircle(carAngle);
  const carRot = getCarRotationDeg(carAngle);
  const obstaclePos = getObstacleTopLeft();

  return React.createElement(
    "svg",
    {
      className: "rotation-svg parking-svg",
      viewBox: "0 0 " + VIEW_W + " " + VIEW_H,
      preserveAspectRatio: "xMidYMid meet",
    },
    React.createElement("circle", {
      cx: ANCHOR.x,
      cy: ANCHOR.y,
      r: PARKING_CIRCLE_RADIUS,
      fill: "none",
      stroke: "rgba(255, 255, 255, 0.75)",
      strokeWidth: 0.4,
      strokeDasharray: "1.4 1.1",
    }),
    React.createElement(
      "g",
      { className: "parking-obstacle-group" },
      React.createElement("image", {
        href: "assets/obstacle.png",
        x: obstaclePos.x,
        y: obstaclePos.y,
        width: OBSTACLE_IMG_W,
        height: OBSTACLE_IMG_H,
        preserveAspectRatio: "xMidYMid meet",
      }),
      showDanger
        ? React.createElement(
            "g",
            {
              className: "parking-danger-callout",
              transform:
                "translate(" +
                topPt.x +
                "," +
                (topPt.y - OBSTACLE_IMG_H * 0.15 - 5) +
                ")",
            },
            React.createElement("rect", {
              x: -16,
              y: -8.5,
              width: 30,
              height: 8.5,
              rx: 1.2,
              fill: "rgba(55, 55, 55, 0.92)",
              stroke: "rgba(255,255,255,0.35)",
              strokeWidth: 0.2,
            }),
            React.createElement(
              "text",
              {
                x: 0,
                y: -2.8,
                textAnchor: "middle",
                fill: "#ff3b30",
                fontSize: 5,
                fontWeight: 700,
              },
              APP_DATA.step4.dangerText,
            ),
          )
        : null,
    ),
    showCrashEffect
      ? React.createElement(
          "g",
          {
            className: "parking-crash-effect",
            transform: "translate(" + topPt.x + "," + topPt.y + ")",
          },
          React.createElement("circle", {
            className: "parking-crash-ring ring-1",
            cx: 0,
            cy: 0,
            r: 2.2,
            fill: "none",
            stroke: "#ff5252",
            strokeWidth: 0.55,
          }),
          React.createElement("circle", {
            className: "parking-crash-ring ring-2",
            cx: 0,
            cy: 0,
            r: 2.2,
            fill: "none",
            stroke: "#ff9800",
            strokeWidth: 0.45,
          }),
          React.createElement("circle", {
            className: "parking-crash-ring ring-3",
            cx: 0,
            cy: 0,
            r: 2.2,
            fill: "none",
            stroke: "#ffeb3b",
            strokeWidth: 0.35,
          }),
          React.createElement("text", {
            x: 0,
            y: 0.8,
            textAnchor: "middle",
            fill: "#ff5252",
            fontSize: 4.5,
            fontWeight: 700,
          }, "✦"),
        )
      : null,
    React.createElement("rect", {
      x: bottomPt.x - PARKING_SPOT_W / 2,
      y: bottomPt.y - PARKING_SPOT_H / 2,
      width: PARKING_SPOT_W,
      height: PARKING_SPOT_H,
      fill: "none",
      stroke: COLORS.yellow,
      strokeWidth: 0.45,
      rx: 0.4,
    }),
    React.createElement(
      "g",
      {
        transform:
          "translate(" +
          carPt.x +
          "," +
          carPt.y +
          ") rotate(" +
          carRot +
          ")",
      },
      React.createElement("image", {
        href: "assets/car.png",
        x: -CAR_IMG_W / 2,
        y: -CAR_IMG_H / 2,
        width: CAR_IMG_W,
        height: CAR_IMG_H,
        preserveAspectRatio: "xMidYMid meet",
      }),
    ),
    React.createElement("line", {
      x1: ANCHOR.x - 6,
      y1: ANCHOR.y,
      x2: ANCHOR.x + 6,
      y2: ANCHOR.y,
      stroke: COLORS.guideLine,
      strokeWidth: 0.22,
      strokeDasharray: "0.8 0.6",
    }),
    React.createElement("line", {
      x1: ANCHOR.x,
      y1: ANCHOR.y - 6,
      x2: ANCHOR.x,
      y2: ANCHOR.y + 6,
      stroke: COLORS.guideLine,
      strokeWidth: 0.22,
      strokeDasharray: "0.8 0.6",
    }),
    React.createElement("circle", {
      cx: ANCHOR.x,
      cy: ANCHOR.y,
      r: 1.1,
      fill: COLORS.anchor,
      stroke: "none",
    }),
    React.createElement(
      "text",
      {
        x: ANCHOR.x + 2.2,
        y: ANCHOR.y - 1.6,
        fill: COLORS.anchor,
        fontSize: 3.2,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
      },
      "A",
    ),
  );
};
