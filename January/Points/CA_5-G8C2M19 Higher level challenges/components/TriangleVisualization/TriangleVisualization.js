// components/TriangleVisualization/TriangleVisualization.js
const TriangleVisualization = ({
  showTower,
  showLadders,
  showTriangle,
  heightMarked,
  leftBaseMarked,
  rightBaseMarked,
  subStep,
  onMarkHeight,
  onMarkLeftBase,
  onMarkRightBase,
}) => {
  const h = React.createElement;

  const viewBox = { width: 1600, height: 1000 };

  // Ground plane position
  const groundY = 850;
  const groundWidth = 1200;
  const groundX = (viewBox.width - groundWidth) / 2;

  // Tower position (centered) - Made bigger
  const towerWidth = 600; // Increased from 100
  const towerHeight = 700; // Increased from 600
  const towerX = viewBox.width / 2 - towerWidth / 2;
  const towerY = groundY - towerHeight;
  const towerCenterX = towerX + towerWidth / 2; // Tower center (bottom midpoint)

  // Tower middle point (for right ladder top)
  const towerMiddleY = towerY + towerHeight / 2;
  const towerTopCenter = { x: towerCenterX, y: towerY }; // Tower top center
  const towerMiddleCenter = { x: towerCenterX, y: towerMiddleY }; // Tower middle center

  // Angle in radians
  const angle60Rad = (60 * Math.PI) / 180;

  // Left triangle calculations
  // Left ladder: from tower top center to ground left, 60° angle with ground
  // Both triangles start from tower center (bottom midpoint)
  const leftLadderTop = towerTopCenter; // Tower top center
  const leftLadderBaseDistance = towerHeight / Math.tan(angle60Rad); // Distance from tower center base to ladder base
  const leftLadderBaseX = towerCenterX - leftLadderBaseDistance;
  const leftLadderBase = { x: leftLadderBaseX, y: groundY };

  // Right triangle calculations
  // Right ladder: top point is 20% below left ladder top (same vertical line), 60° angle with ground
  // Ladder should be scaled 0.7
  const rightLadderTopY = towerY + towerHeight * 0.2; // 20% below tower top
  const rightLadderTop = { x: towerCenterX, y: rightLadderTopY }; // Same vertical line as left ladder
  const rightLadderHeight = groundY - rightLadderTopY; // Height from right ladder top to ground
  const rightLadderBaseDistance = rightLadderHeight / Math.tan(angle60Rad); // Distance from tower center base to ladder base
  const rightLadderBaseX = towerCenterX + rightLadderBaseDistance;
  const rightLadderBase = { x: rightLadderBaseX, y: groundY };

  // Color map
  const colors = {
    blueish: "#4a90e2",
    orangish: "#ff6b35",
    yellowish: "#ffd700",
    white: "#ffffff",
    greenish: "#68F76C",
  };
  const lightColors = {
    blueish: "#64B5F6",
    orangish: "#FFA500",
    yellowish: "#FFE44D",
    greenish: "#35FF3C",
  };

  // Render ground using image
  const renderGround = () => {
    return h("image", {
      href: "assets/ground.png",
      x: groundX - 180,
      y: groundY - 180,
      width: groundWidth + 360,
      height: 250,
      preserveAspectRatio: "none",
      opacity: 0.8,
    });
  };

  // Render tower using image
  const renderTower = () => {
    if (!showTower) return null;

    return h("image", {
      key: "tower",
      href: "assets/tower.png",
      x: towerX,
      y: towerY,
      width: towerWidth,
      height: towerHeight,
      preserveAspectRatio: "xMidYMax meet",
    });
  };

  // Render left ladder
  const renderLeftLadder = () => {
    if (!showLadders) return null;

    const dx = leftLadderTop.x - leftLadderBase.x;
    const dy = leftLadderTop.y - leftLadderBase.y;
    const ladderLength = Math.sqrt(dx * dx + dy * dy);
    const ladderAngleRad = Math.atan2(dy, dx);
    const ladderAngleDeg = (ladderAngleRad * 180) / Math.PI;
    const ladderWidth = 40;

    return h("image", {
      key: "left-ladder",
      href: "assets/ladder.png",
      x: leftLadderBase.x,
      y: leftLadderBase.y,
      width: ladderWidth,
      height: ladderLength,
      preserveAspectRatio: "none",
      transform: `rotate(${ladderAngleDeg - 90}, ${leftLadderBase.x}, ${
        leftLadderBase.y
      })`,
      transformOrigin: `${leftLadderBase.x} ${leftLadderBase.y}`,
      opacity: 0.95,
    });
  };

  // Render right ladder
  const renderRightLadder = () => {
    if (!showLadders) return null;

    const dx = rightLadderTop.x - rightLadderBase.x;
    const dy = rightLadderTop.y - rightLadderBase.y;
    const ladderLength = Math.sqrt(dx * dx + dy * dy);
    const ladderAngleRad = Math.atan2(dy, dx);
    const ladderAngleDeg = (ladderAngleRad * 180) / Math.PI;
    const ladderWidth = 40;
    const scale = 0.85; // Scale right ladder to 0.7

    return h("image", {
      key: "right-ladder",
      href: "assets/ladder.png",
      x: rightLadderBase.x,
      y: rightLadderBase.y,
      width: ladderWidth * scale,
      height: ladderLength * scale,
      preserveAspectRatio: "none",
      transform: `rotate(${ladderAngleDeg - 90}, ${rightLadderBase.x}, ${
        rightLadderBase.y
      })`,
      transformOrigin: `${rightLadderBase.x} ${rightLadderBase.y}`,
      opacity: 0.95,
    });
  };

  // Render triangles
  const renderTriangles = () => {
    if (!showTriangle) return null;

    const arcRadius = 50;

    return h(
      "g",
      { key: "triangles" },
      // Left triangle - Height (vertical tower line from center)
      h("line", {
        x1: towerCenterX,
        y1: groundY,
        x2: towerCenterX,
        y2: towerY,
        stroke: heightMarked ? colors.blueish : lightColors.blueish,
        strokeWidth: heightMarked ? 14 : 12,
        className: heightMarked ? "" : "clickable-side",
        style: { cursor: heightMarked ? "default" : "pointer" },
        onClick: onMarkHeight,
      }),
      // Left triangle - Base (from tower center to left ladder base)
      h("line", {
        x1: towerCenterX,
        y1: groundY,
        x2: leftLadderBase.x,
        y2: leftLadderBase.y,
        stroke: leftBaseMarked ? colors.orangish : lightColors.orangish,
        strokeWidth: leftBaseMarked ? 14 : 12,
        className: leftBaseMarked ? "" : "clickable-side",
        style: { cursor: leftBaseMarked ? "default" : "pointer" },
        onClick: onMarkLeftBase,
      }),
      // Left triangle - Hypotenuse (left ladder)
      h("line", {
        x1: leftLadderBase.x,
        y1: leftLadderBase.y,
        x2: towerCenterX,
        y2: towerY,
        stroke: lightColors.yellowish,
        strokeWidth: 8,
        strokeDasharray: "20, 8",
      }),
      // Right triangle - Base (from tower center to right ladder base)
      h("line", {
        x1: towerCenterX,
        y1: groundY,
        x2: rightLadderBase.x,
        y2: rightLadderBase.y,
        stroke: rightBaseMarked ? colors.greenish : lightColors.greenish,
        strokeWidth: rightBaseMarked ? 14 : 12,
        className: rightBaseMarked ? "" : "clickable-side",
        style: { cursor: rightBaseMarked ? "default" : "pointer" },
        onClick: onMarkRightBase,
      }),
      // Right triangle - Hypotenuse (right ladder)
      h("line", {
        x1: rightLadderBase.x - 15,
        y1: rightLadderBase.y,
        x2: rightLadderTop.x,
        y2: rightLadderTop.y + 40,
        stroke: lightColors.yellowish,
        strokeWidth: 8,
        strokeDasharray: "20, 8",
      }),

      // Left 60° angle arc (at left ladder base)
      h("path", {
        d: (() => {
          const startX = leftLadderBase.x + arcRadius;
          const startY = leftLadderBase.y;
          const endX = leftLadderBase.x + arcRadius * Math.cos(angle60Rad);
          const endY = leftLadderBase.y - arcRadius * Math.sin(angle60Rad);
          return `M ${leftLadderBase.x} ${leftLadderBase.y} L ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 0 ${endX} ${endY} Z`;
        })(),
        fill: colors.white,
        stroke: colors.white,
        strokeWidth: 6,
      }),
      // Nudge circles (not clickable)
      !heightMarked &&
        onMarkHeight &&
        h("circle", {
          cx: towerCenterX,
          cy: (groundY + towerY) / 2,
          r: 25,
          fill: "rgba(74, 144, 226, 0.6)",
          stroke: "rgba(74, 144, 226, 1)",
          strokeWidth: 3,
          strokeDasharray: "8, 8",
          className: "clickable-circle",
          style: { pointerEvents: "none" },
        }),
      !leftBaseMarked &&
        onMarkLeftBase &&
        h("circle", {
          cx: (towerCenterX + leftLadderBase.x) / 2,
          cy: groundY,
          r: 25,
          fill: "rgba(255, 107, 53, 0.6)",
          stroke: "rgba(255, 107, 53, 1)",
          strokeWidth: 3,
          strokeDasharray: "8, 8",
          className: "clickable-circle",
          style: { pointerEvents: "none" },
        }),
      !rightBaseMarked &&
        onMarkRightBase &&
        h("circle", {
          cx: (towerCenterX + rightLadderBase.x) / 2,
          cy: groundY,
          r: 25,
          fill: "rgba(104, 247, 108, 0.6)",
          stroke: "rgba(104, 247, 108, 1)",
          strokeWidth: 3,
          strokeDasharray: "8, 8",
          className: "clickable-circle",
          style: { pointerEvents: "none" },
        }),

      // Labels
      heightMarked &&
        subStep >= 3 &&
        h(
          "text",
          {
            x: towerCenterX - 80,
            y: (groundY + towerY) / 2,
            fill: colors.blueish,
            fontSize: "48",
            fontWeight: "bold",
            textAnchor: "middle",
          },
          "150 m"
        ),
      leftBaseMarked &&
        subStep >= 4 &&
        h(
          "text",
          {
            x: (towerCenterX + leftLadderBase.x) / 2,
            y: groundY + 60,
            fill: colors.orangish,
            fontSize: "48",
            fontWeight: "bold",
            textAnchor: "middle",
          },
          "a"
        ),
      rightBaseMarked &&
        subStep >= 5 &&
        h(
          "text",
          {
            x: (towerCenterX + rightLadderBase.x) / 2,
            y: groundY + 60,
            fill: colors.greenish,
            fontSize: "48",
            fontWeight: "bold",
            textAnchor: "middle",
          },
          "b"
        ),

      // Angle labels - only for left triangle
      h(
        "text",
        {
          x: leftLadderBase.x + 50,
          y: leftLadderBase.y - 30,
          fill: colors.white,
          fontSize: "46",
          fontWeight: "bold",
        },
        "60°"
      ),

      // Right angle markers - only for left triangle
      h("path", {
        d: `M ${towerCenterX + 40} ${groundY} L ${towerCenterX + 40} ${
          groundY - 40
        } L ${towerCenterX} ${groundY - 40}`,
        stroke: "white",
        strokeWidth: 6,
        fill: "none",
      })
    );
  };

  return h(
    "div",
    { className: "triangle-visualization" },
    h(
      "svg",
      {
        viewBox: `0 0 ${viewBox.width} ${viewBox.height}`,
        style: { width: "100%", height: "100%" },
      },
      renderGround(),
      renderTower(),
      renderLeftLadder(),
      renderRightLadder(),
      renderTriangles()
    )
  );
};
