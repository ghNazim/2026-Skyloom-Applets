const HINT_COLOR_FILL = "#e8d48b";
const HINT_COLOR_GREEN = "#90ee90";
const HINT_ARC_RADIUS = 28;
const HINT_VIEWBOX = "0 0 280 220";

const HINT_PQRS = {
  P: { x: 140, y: 42 },
  Q: { x: 52, y: 108 },
  R: { x: 88, y: 178 },
  S: { x: 218, y: 168 },
};

function hintCentroid(pts) {
  const keys = Object.keys(pts);
  let x = 0;
  let y = 0;
  keys.forEach((k) => {
    x += pts[k].x;
    y += pts[k].y;
  });
  return { x: x / keys.length, y: y / keys.length };
}

function hintLabelPos(vertex, centroid, dist) {
  const dx = vertex.x - centroid.x;
  const dy = vertex.y - centroid.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: vertex.x + (dx / len) * dist,
    y: vertex.y + (dy / len) * dist,
  };
}

function hintPolar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function hintArcPath(vertex, adj1, adj2) {
  const v1 = { x: adj1.x - vertex.x, y: adj1.y - vertex.y };
  const v2 = { x: adj2.x - vertex.x, y: adj2.y - vertex.y };
  let a1 = (Math.atan2(v1.y, v1.x) * 180) / Math.PI;
  let a2 = (Math.atan2(v2.y, v2.x) * 180) / Math.PI;
  let diff = a2 - a1;
  while (diff <= -180) diff += 360;
  while (diff > 180) diff -= 360;
  if (diff < 0) {
    const t = a1;
    a1 = a2;
    a2 = t;
  }
  const start = a1 + 90;
  const end = a2 + 90;
  const s = hintPolar(vertex.x, vertex.y, HINT_ARC_RADIUS, end);
  const e = hintPolar(vertex.x, vertex.y, HINT_ARC_RADIUS, start);
  const large = end - start <= 180 ? "0" : "1";
  return `M${vertex.x} ${vertex.y} L${s.x} ${s.y} A${HINT_ARC_RADIUS} ${HINT_ARC_RADIUS} 0 ${large} 0 ${e.x} ${e.y} Z`;
}

const Hint = ({ onClose }) => {
  const c = hintCentroid(HINT_PQRS);
  const order = ["P", "Q", "R", "S"];
  const path =
    `M${HINT_PQRS.P.x} ${HINT_PQRS.P.y} ` +
    order
      .slice(1)
      .map((k) => `L${HINT_PQRS[k].x} ${HINT_PQRS[k].y}`)
      .join(" ") +
    " Z";

  const angleDefs = [
    { k: "P", adj: ["S", "Q"] },
    { k: "Q", adj: ["P", "R"] },
    { k: "R", adj: ["Q", "S"] },
    { k: "S", adj: ["R", "P"] },
  ];

  return React.createElement(
    "div",
    { className: "hint-overlay" },
    React.createElement("h2", { className: "hint-title" }, APP_DATA.hint.title),
    React.createElement(
      "div",
      { className: "hint-content" },
      React.createElement(
        "div",
        { className: "hint-visual-col" },
        React.createElement(
          "svg",
          {
            className: "hint-svg",
            viewBox: HINT_VIEWBOX,
            preserveAspectRatio: "xMidYMid meet",
          },
          React.createElement("path", {
            d: path,
            fill: HINT_COLOR_FILL,
            stroke: "#ffffff",
            strokeWidth: 3,
            strokeLinejoin: "round",
          }),
          angleDefs.map(({ k, adj }) =>
            React.createElement("path", {
              key: `hint-arc-${k}`,
              d: hintArcPath(
                HINT_PQRS[k],
                HINT_PQRS[adj[0]],
                HINT_PQRS[adj[1]],
              ),
              fill: HINT_COLOR_GREEN,
              stroke: "#ffffff",
              strokeWidth: 1.5,
            }),
          ),
          order.map((k) => {
            const pos = hintLabelPos(HINT_PQRS[k], c, 22);
            return React.createElement(
              "text",
              {
                key: `hint-v-${k}`,
                x: pos.x,
                y: pos.y,
                fill: "#ffffff",
                fontSize: 18,
                fontWeight: 700,
                textAnchor: "middle",
                dominantBaseline: "middle",
              },
              k,
            );
          }),
        ),
      ),
      React.createElement("div", {
        className: "hint-text-col",
        dangerouslySetInnerHTML: { __html: APP_DATA.hint.body },
      }),
    ),
    React.createElement(
      "button",
      { className: "hint-close-btn", onClick: onClose },
      APP_DATA.hint.closeButton,
    ),
  );
};
