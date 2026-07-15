// Shared transform-card geometry — mirrors MainCanvas constants and completed-state layout.
const TransformCards = (function () {
  const VB_W = 1000;
  const VB_H = 562;
  const CENTER_CARD_W = VB_W * 0.2;
  const BIG_CARD_W = VB_W * 0.35;
  const BIG_CARD_H = VB_H * 0.45;
  const CARD_RX = 14;
  const CARD_GAP_FROM_CENTER = 22;
  const CENTER_X = VB_W / 2;
  const LEFT_BIG_X =
    CENTER_X - CENTER_CARD_W / 2 - CARD_GAP_FROM_CENTER - BIG_CARD_W / 2;
  const RIGHT_BIG_X =
    CENTER_X + CENTER_CARD_W / 2 + CARD_GAP_FROM_CENTER + BIG_CARD_W / 2;

  const CARD_CENTERS = {
    translation: { x: LEFT_BIG_X, y: 150 },
    reflection: { x: RIGHT_BIG_X, y: 150 },
    bottomLeft: { x: LEFT_BIG_X, y: 412 },
    bottomRight: { x: RIGHT_BIG_X, y: 412 },
  };

  const COLORS = {
    card: "#1c3358",
    cardStroke: "#2a4a75",
    triBlue: "#6ecfff",
    triGreen: "#8ef58e",
    axisPurple: "#c77dff",
    heading: "#f5c542",
  };

  const TRI_LEG = CENTER_CARD_W * 0.42 * 1.2;
  const CARD_PAD_X = 0.11;
  const CARD_PAD_Y = 0.11;
  const HEADING_PAD_TOP = 0.2;
  const CONTENT_TOP = 0.28;
  const DILATION_SCALE = 1.25;
  const ROTATION_DEGREES = 60;
  const PIVOT_R = 5;

  const getCardRect = (cx, cy, w, h) => ({
    x: cx - w / 2,
    y: cy - h / 2,
    width: w,
    height: h,
  });

  const getTriOriginBottom = (cx, cy, w, h, leg, side) => {
    const rect = getCardRect(cx, cy, w, h);
    const padX = w * CARD_PAD_X;
    const padY = h * CARD_PAD_Y;
    if (side === "left") {
      return { x: rect.x + padX, y: rect.y + rect.height - padY };
    }
    if (side === "right") {
      return {
        x: rect.x + rect.width - padX - leg,
        y: rect.y + rect.height - padY,
      };
    }
    return {
      x: rect.x + (rect.width - leg) / 2,
      y: rect.y + rect.height - padY,
    };
  };

  const getReflBlueOrigin = (cx, cy, w, h, leg) => {
    const rect = getCardRect(cx, cy, w, h);
    const padY = h * CARD_PAD_Y;
    return { x: cx - leg, y: rect.y + rect.height - padY };
  };

  const getReflAxisX = (blueOrigin, leg) => blueOrigin.x + leg;

  const getRotBlueOrigin = (cx, cy, w, h, leg) => {
    const rect = getCardRect(cx, cy, w, h);
    const padY = h * CARD_PAD_Y;
    return { x: cx - leg / 2, y: rect.y + rect.height - padY };
  };

  const getTopVertex = (ox, oy, leg) => ({ x: ox, y: oy - leg });

  const getDilBlueOrigin = (cx, cy, w, h, leg) => {
    const rect = getCardRect(cx, cy, w, h);
    const padY = h * CARD_PAD_Y;
    const scaledWidth = leg * DILATION_SCALE;
    return {
      x: cx - scaledWidth / 2,
      y: rect.y + rect.height - padY,
    };
  };

  const triPoints = (ox, oy, leg) => [
    { x: ox, y: oy },
    { x: ox + leg, y: oy },
    { x: ox, y: oy - leg },
  ];

  const triPointsStr = (ox, oy, leg) =>
    triPoints(ox, oy, leg)
      .map((p) => p.x + "," + p.y)
      .join(" ");

  const reflectTriPointsHoriz = (ox, oy, leg, axisX) =>
    triPoints(ox, oy, leg).map((p) => ({
      x: 2 * axisX - p.x,
      y: p.y,
    }));

  const reflectPointsStr = (pts) =>
    pts.map((p) => p.x + "," + p.y).join(" ");

  const rotatePtCcw = (p, pivot, degrees) => {
    const rad = (degrees * Math.PI) / 180;
    const dx = p.x - pivot.x;
    const dy = p.y - pivot.y;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: pivot.x + dx * cos + dy * sin,
      y: pivot.y - dx * sin + dy * cos,
    };
  };

  const rotateTriPointsCcw = (ox, oy, leg, pivot, degrees) =>
    triPoints(ox, oy, leg).map((p) => rotatePtCcw(p, pivot, degrees));

  const scaleTriPoints = (ox, oy, leg, anchor, scale) =>
    triPoints(ox, oy, leg).map((p) => ({
      x: anchor.x + scale * (p.x - anchor.x),
      y: anchor.y + scale * (p.y - anchor.y),
    }));

  const getHeadingY = (cardRect) => cardRect.y + BIG_CARD_H * HEADING_PAD_TOP;

  const renderCardBackground = (key) => {
    const center = CARD_CENTERS[key];
    const rect = getCardRect(center.x, center.y, BIG_CARD_W, BIG_CARD_H);
    return React.createElement("rect", {
      key: "card-bg",
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      rx: CARD_RX,
      ry: CARD_RX,
      fill: COLORS.card,
      stroke: COLORS.cardStroke,
      strokeWidth: 1.5,
    });
  };

  const renderHeading = (key, text) => {
    const center = CARD_CENTERS[key];
    const cardRect = getCardRect(center.x, center.y, BIG_CARD_W, BIG_CARD_H);
    return React.createElement(
      "text",
      {
        key: "heading",
        x: center.x,
        y: getHeadingY(cardRect),
        textAnchor: "middle",
        fill: COLORS.heading,
        fontSize: BIG_CARD_W * 0.08,
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
      },
      text
    );
  };

  const renderTriangle = (ox, oy, leg, color, key, extra) =>
    React.createElement(
      "polygon",
      Object.assign(
        {
          key: key,
          points: triPointsStr(ox, oy, leg),
          fill: color,
          stroke: "none",
        },
        extra || {}
      )
    );

  const renderPivotDot = (x, y, key) =>
    React.createElement("circle", {
      key: key,
      cx: x,
      cy: y,
      r: PIVOT_R,
      fill: COLORS.axisPurple,
    });

  const createCompletedCardElements = (key, headingText) => {
    const cx = CARD_CENTERS[key].x;
    const cy = CARD_CENTERS[key].y;
    const cardRect = getCardRect(cx, cy, BIG_CARD_W, BIG_CARD_H);
    const elements = [renderCardBackground(key)];

    if (key === "translation") {
      const blueEnd = getTriOriginBottom(
        cx,
        cy,
        BIG_CARD_W,
        BIG_CARD_H,
        TRI_LEG,
        "left"
      );
      const greenEnd = getTriOriginBottom(
        cx,
        cy,
        BIG_CARD_W,
        BIG_CARD_H,
        TRI_LEG,
        "right"
      );
      elements.push(
        renderTriangle(blueEnd.x, blueEnd.y, TRI_LEG, COLORS.triBlue, "blue"),
        renderTriangle(
          greenEnd.x,
          greenEnd.y,
          TRI_LEG,
          COLORS.triGreen,
          "green"
        ),
        renderHeading(key, headingText)
      );
      return elements;
    }

    if (key === "reflection") {
      const blueEnd = getReflBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);
      const axisX = getReflAxisX(blueEnd, TRI_LEG);
      const greenPts = reflectTriPointsHoriz(
        blueEnd.x,
        blueEnd.y,
        TRI_LEG,
        axisX
      );
      elements.push(
        renderTriangle(blueEnd.x, blueEnd.y, TRI_LEG, COLORS.triBlue, "blue"),
        React.createElement("polygon", {
          key: "green",
          points: reflectPointsStr(greenPts),
          fill: COLORS.triGreen,
        }),
        React.createElement("line", {
          key: "axis",
          x1: axisX,
          y1: cardRect.y + BIG_CARD_H * CONTENT_TOP,
          x2: axisX,
          y2: cardRect.y + cardRect.height - BIG_CARD_H * CARD_PAD_Y,
          stroke: COLORS.axisPurple,
          strokeWidth: 2,
          strokeDasharray: "8 6",
        }),
        renderHeading(key, headingText)
      );
      return elements;
    }

    if (key === "bottomRight") {
      const blueEnd = getRotBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);
      const pivot = getTopVertex(blueEnd.x, blueEnd.y, TRI_LEG);
      const greenPts = rotateTriPointsCcw(
        blueEnd.x,
        blueEnd.y,
        TRI_LEG,
        pivot,
        ROTATION_DEGREES
      );
      elements.push(
        renderTriangle(blueEnd.x, blueEnd.y, TRI_LEG, COLORS.triBlue, "blue"),
        React.createElement("polygon", {
          key: "green",
          points: reflectPointsStr(greenPts),
          fill: COLORS.triGreen,
        }),
        renderPivotDot(pivot.x, pivot.y, "pivot"),
        renderHeading(key, headingText)
      );
      return elements;
    }

    if (key === "bottomLeft") {
      const blueEnd = getDilBlueOrigin(cx, cy, BIG_CARD_W, BIG_CARD_H, TRI_LEG);
      const anchor = { x: blueEnd.x, y: blueEnd.y };
      const greenPts = scaleTriPoints(
        blueEnd.x,
        blueEnd.y,
        TRI_LEG,
        anchor,
        DILATION_SCALE
      );
      elements.push(
        renderTriangle(blueEnd.x, blueEnd.y, TRI_LEG, COLORS.triBlue, "blue"),
        React.createElement("polygon", {
          key: "green",
          points: reflectPointsStr(greenPts),
          fill: COLORS.triGreen,
          fillOpacity: 0.5,
        }),
        renderPivotDot(anchor.x, anchor.y, "pivot"),
        renderHeading(key, headingText)
      );
      return elements;
    }

    return elements;
  };

  const getCardViewBox = (key) => {
    const center = CARD_CENTERS[key];
    const rect = getCardRect(center.x, center.y, BIG_CARD_W, BIG_CARD_H);
    return rect.x + " " + rect.y + " " + rect.width + " " + rect.height;
  };

  return {
    BIG_CARD_W,
    BIG_CARD_H,
    getCardViewBox,
    createCompletedCardElements,
  };
})();
