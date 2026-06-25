const DILATION_GRID_COLS = 14;
const DILATION_GRID_ROWS = 10;

const CARD_IDS = ["outside", "inside", "onedge"];

const CARD_IMAGES = {
  outside: "assets/outside.svg",
  inside: "assets/inside.svg",
  onedge: "assets/onedge.svg",
};

const CARD_GEOMETRY = {
  outside: {
    center: { x: 2.5, y: 5.5 },
    triangle: [
      { x: 6.5, y: 8.5 },
      { x: 4, y: 3 },
      { x: 10.5, y: 4 },
    ],
  },
  inside: {
    center: { x: 7, y: 5 },
    triangle: [
      { x: 7, y: 7.5 },
      { x: 5, y: 4 },
      { x: 9, y: 4.5 },
    ],
  },
  onedge: {
    triangle: [
      { x: 6.5, y: 8.5 },
      { x: 2.5, y: 3 },
      { x: 10.5, y: 4 },
    ],
  },
};

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function getCardGeometry(cardId) {
  const geom = CARD_GEOMETRY[cardId];
  if (!geom) return null;
  if (cardId === "onedge") {
    return {
      center: midpoint(geom.triangle[0], geom.triangle[1]),
      triangle: geom.triangle,
    };
  }
  return { center: geom.center, triangle: geom.triangle };
}

const FREE_EXPLORE_GEOMETRY = {
  center: { x: 2.5, y: 5.5 },
  triangle: CARD_GEOMETRY.outside.triangle,
};
