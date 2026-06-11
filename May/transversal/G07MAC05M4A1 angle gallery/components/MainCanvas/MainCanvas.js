/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */
const polarToXY = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const arcPath = (cx, cy, r, startDeg, endDeg) => {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const span = endDeg - startDeg;
  const large = span > 180 ? 1 : 0;
  return [
    "M",
    cx,
    cy,
    "L",
    s.x,
    s.y,
    "A",
    r,
    r,
    0,
    large,
    1,
    e.x,
    e.y,
    "Z",
  ].join(" ");
};
const lineArcPath = (cx, cy, r, startDeg, endDeg) => {
  if (Math.abs(endDeg - startDeg) < 0.1) return "";
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return ["M", s.x, s.y, "A", r, r, 0, large, sweep, e.x, e.y].join(" ");
};
const rotatePoint = (px, py, cx, cy, deg) => {
  const r = (deg * Math.PI) / 180;
  const dx = px - cx,
    dy = py - cy;
  return {
    x: cx + dx * Math.cos(r) - dy * Math.sin(r),
    y: cy + dx * Math.sin(r) + dy * Math.cos(r),
  };
};
const mkr = (id, color, rev) =>
  React.createElement(
    "marker",
    {
      id,
      viewBox: "0 0 10 10",
      refX: rev ? "2" : "8",
      refY: "5",
      markerWidth: "5",
      markerHeight: "5",
      orient: rev ? "auto-start-reverse" : "auto",
    },
    React.createElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }),
  );

/* ═══════════════════════════════════════════════════
   GEOMETRY CONSTANTS
   ═══════════════════════════════════════════════════ */
const AX = 445,
  AY = 175;
const BX = 355,
  BY = 330;
const MX = (AX + BX) / 2,
  MY = (AY + BY) / 2;
const LINE_LEFT = 80,
  LINE_RIGHT = 680;
const ANG_R = 35,
  LABEL_R = 52;
const ARC_R = 65;
const LINEAR_ARC_R = Math.round(ARC_R * 1.2);

const TDX = Math.cos((60 * Math.PI) / 180);
const TDY = Math.sin((60 * Math.PI) / 180);
const EXT = 180;
const TRANS_TOP = {
  x: Math.round(AX + EXT * TDX),
  y: Math.round(AY - EXT * TDY),
};
const TRANS_BOT = {
  x: Math.round(BX - EXT * TDX),
  y: Math.round(BY + EXT * TDY),
};

const COL_PARALLEL = "#FFC000";
const COL_TRANS = "#00B0F0";
const COL_ODD = "#9E63F2";
const COL_EVEN = "#C9A5FC";
const COL_GREY = "#888";

const ANGLE_DATA = [
  { id: 1, cx: AX, cy: AY, start: 180, end: 300, measure: 120 },
  { id: 2, cx: AX, cy: AY, start: 300, end: 360, measure: 60 },
  { id: 3, cx: AX, cy: AY, start: 0, end: 120, measure: 120 },
  { id: 4, cx: AX, cy: AY, start: 120, end: 180, measure: 60 },
  { id: 5, cx: BX, cy: BY, start: 180, end: 300, measure: 120 },
  { id: 6, cx: BX, cy: BY, start: 300, end: 360, measure: 60 },
  { id: 7, cx: BX, cy: BY, start: 0, end: 120, measure: 120 },
  { id: 8, cx: BX, cy: BY, start: 120, end: 180, measure: 60 },
];
const angleColor = (id) => (id % 2 === 1 ? COL_ODD : COL_EVEN);
const angleMeasure = (id) => ANGLE_DATA[id - 1].measure;
const angleDataOf = (id) => ANGLE_DATA[id - 1];

const LINES = {
  topLeftRay: {
    x1: LINE_LEFT,
    y1: AY,
    x2: AX,
    y2: AY,
    color: COL_PARALLEL,
    ms: "url(#a-yel-s)",
    me: "",
  },
  topRightRay: {
    x1: AX,
    y1: AY,
    x2: LINE_RIGHT,
    y2: AY,
    color: COL_PARALLEL,
    ms: "",
    me: "url(#a-yel-e)",
  },
  bottomLeftRay: {
    x1: LINE_LEFT,
    y1: BY,
    x2: BX,
    y2: BY,
    color: COL_PARALLEL,
    ms: "url(#a-yel-s)",
    me: "",
  },
  bottomRightRay: {
    x1: BX,
    y1: BY,
    x2: LINE_RIGHT,
    y2: BY,
    color: COL_PARALLEL,
    ms: "",
    me: "url(#a-yel-e)",
  },
  transversalTop: {
    x1: AX,
    y1: AY,
    x2: TRANS_TOP.x,
    y2: TRANS_TOP.y,
    color: COL_TRANS,
    ms: "",
    me: "url(#a-cyn-e)",
  },
  transversalMid: {
    x1: AX,
    y1: AY,
    x2: BX,
    y2: BY,
    color: COL_TRANS,
    ms: "",
    me: "",
  },
  transversalBot: {
    x1: BX,
    y1: BY,
    x2: TRANS_BOT.x,
    y2: TRANS_BOT.y,
    color: COL_TRANS,
    ms: "",
    me: "url(#a-cyn-e)",
  },
};
const LINE_KEYS = Object.keys(LINES);

const VERTICAL_PAIRS = { 1: 3, 2: 4, 3: 1, 4: 2, 5: 7, 6: 8, 7: 5, 8: 6 };
const LINEAR_PAIRS = { 1: 2, 2: 3, 3: 4, 4: 1, 5: 6, 6: 7, 7: 8, 8: 5 };
const COINTERIOR_PAIRS = { 3: 6, 4: 5, 5: 4, 6: 3 };
const COINTERIOR_IDS = [3, 4, 5, 6];
const COEXTERIOR_PAIRS = { 1: 8, 8: 1, 2: 7, 7: 2 };
const COEXTERIOR_IDS = [1, 2, 7, 8];
const CORRESPONDING_PAIRS = {
  1: 5,
  2: 6,
  3: 7,
  4: 8,
  5: 1,
  6: 2,
  7: 3,
  8: 4,
};
const ALT_INT_PAIRS = { 3: 5, 5: 3, 4: 6, 6: 4 };
const ALT_INT_IDS = [3, 4, 5, 6];
const ALT_EXT_PAIRS = { 1: 7, 7: 1, 2: 8, 8: 2 };
const ALT_EXT_IDS = [1, 2, 7, 8];
const ANGLE_BOUNDARY_LINES = {
  1: ["topLeftRay", "transversalTop"],
  2: ["topRightRay", "transversalTop"],
  3: ["topRightRay", "transversalMid"],
  4: ["topLeftRay", "transversalMid"],
  5: ["bottomLeftRay", "transversalMid"],
  6: ["bottomRightRay", "transversalMid"],
  7: ["bottomRightRay", "transversalBot"],
  8: ["bottomLeftRay", "transversalBot"],
};
const CLONE_PAIR_CARDS = [
  "vertical",
  "corresponding",
  "alternateInterior",
  "alternateExterior",
];
const POINT_OF = {
  1: "A",
  2: "A",
  3: "A",
  4: "A",
  5: "B",
  6: "B",
  7: "B",
  8: "B",
};

const VERTICAL_DEHI_LINES = {
  A: ["bottomLeftRay", "bottomRightRay"],
  B: ["topLeftRay", "topRightRay"],
};

const LINEAR_PAIR_INFO = {
  "1,2": {
    shared: ["transversalTop"],
    line: ["topLeftRay", "topRightRay"],
    arc: { start: 180, end: 360 },
  },
  "2,3": {
    shared: ["topRightRay"],
    line: ["transversalTop", "transversalMid", "transversalBot"],
    arc: { start: 300, end: 480 },
  },
  "3,4": {
    shared: ["transversalMid"],
    line: ["topLeftRay", "topRightRay"],
    arc: { start: 0, end: 180 },
  },
  "4,1": {
    shared: ["topLeftRay"],
    line: ["transversalTop", "transversalMid", "transversalBot"],
    arc: { start: 120, end: 300 },
  },
  "5,6": {
    shared: ["transversalMid"],
    line: ["bottomLeftRay", "bottomRightRay"],
    arc: { start: 180, end: 360 },
  },
  "6,7": {
    shared: ["bottomRightRay"],
    line: ["transversalTop", "transversalMid", "transversalBot"],
    arc: { start: 300, end: 480 },
  },
  "7,8": {
    shared: ["transversalBot"],
    line: ["bottomLeftRay", "bottomRightRay"],
    arc: { start: 0, end: 180 },
  },
  "8,5": {
    shared: ["bottomLeftRay"],
    line: ["transversalTop", "transversalMid", "transversalBot"],
    arc: { start: 120, end: 300 },
  },
};

const COINTERIOR_INFO = {
  "3,6": {
    topRay: "topRightRay",
    botRay: "bottomRightRay",
    arc: { start: 300, end: 480 },
  },
  "4,5": {
    topRay: "topLeftRay",
    botRay: "bottomLeftRay",
    arc: { start: 120, end: 300 },
  },
};

const COEXTERIOR_INFO = {
  "1,8": {
    topParRay: "topLeftRay",
    botParRay: "bottomLeftRay",
    arc: { start: 120, end: 300 },
  },
  "2,7": {
    topParRay: "topRightRay",
    botParRay: "bottomRightRay",
    arc: { start: 300, end: 480 },
  },
};

const getPairCopyOffsets = (pairType) => {
  if (pairType === "coExterior") {
    return {
      dtx: MX - AX,
      dty: MY - AY,
      dbx: MX - BX,
      dby: MY - BY,
    };
  }
  return {
    dtx: MX - AX,
    dty: MY - AY,
    dbx: MX - BX,
    dby: MY - BY,
  };
};

const parRayCopyAt = (rayKey, vcX, vcY) => {
  const ln = LINES[rayKey];
  if (rayKey.includes("Left")) {
    return {
      x1: LINE_LEFT,
      y1: vcY,
      x2: vcX,
      y2: vcY,
      color: ln.color,
      ms: ln.ms,
      me: ln.me,
    };
  }
  return {
    x1: vcX,
    y1: vcY,
    x2: LINE_RIGHT,
    y2: vcY,
    color: ln.color,
    ms: ln.ms,
    me: ln.me,
  };
};

const LABEL_FS_LARGE = 24;
const LABEL_FS_SMALL = 17;
const DIAGRAM_FADE_MS = 500;
const labelPosAt = (cx, cy, start, end, lr) =>
  polarToXY(cx, cy, lr, (start + end) / 2);
const cloneLabelPos = (cx, cy, r, start, end, rot) => {
  const mid = (start + end) / 2;
  const lp = polarToXY(cx, cy, r * 1.2, mid);
  return rotatePoint(lp.x, lp.y, cx, cy, rot);
};

const CARD_KEYS = [
  "linear",
  "vertical",
  "corresponding",
  "alternateInterior",
  "alternateExterior",
  "coInterior",
  "coExterior",
];
const IMPLEMENTED = [
  "linear",
  "vertical",
  "corresponding",
  "alternateInterior",
  "alternateExterior",
  "coInterior",
  "coExterior",
];

const CARD_IMAGES = {
  linear: "assets/linear.png",
  vertical: "assets/vertical.png",
  corresponding: "assets/corresponding.png",
  alternateInterior: "assets/altinterior.png",
  alternateExterior: "assets/altexterior.png",
  coInterior: "assets/cointerior.png",
  coExterior: "assets/coexterior.png",
};

const GALLERY_POS = [
  { l: 5, t: 8, w: 21, h: 40 },
  { l: 27, t: 8, w: 21, h: 40 },
  { l: 51, t: 8, w: 21, h: 40 },
  { l: 74, t: 8, w: 21, h: 40 },
  { l: 14, t: 53, w: 21, h: 40 },
  { l: 38, t: 53, w: 21, h: 40 },
  { l: 62, t: 53, w: 21, h: 40 },
];
const STRIP_POS = [
  { l: 93.5, t: 2, w: 5.8, h: 12 },
  { l: 93.5, t: 15, w: 5.8, h: 12 },
  { l: 93.5, t: 28, w: 5.8, h: 12 },
  { l: 93.5, t: 41, w: 5.8, h: 12 },
  { l: 93.5, t: 54, w: 5.8, h: 12 },
  { l: 93.5, t: 67, w: 5.8, h: 12 },
  { l: 93.5, t: 80, w: 5.8, h: 12 },
];

const PAIR_EQUAL = [
  "vertical",
  "corresponding",
  "alternateInterior",
  "alternateExterior",
];
const PAIR_SUM_180 = ["linear", "coInterior", "coExterior"];
const LEFT_ANGLES = [1, 4, 5, 8];

const getFeedbackPositionClass = (angleIds) => {
  const ids = angleIds.filter((id) => id >= 1 && id <= 8);
  if (!ids.length) return "";

  const leftInvolved = ids.filter((id) => LEFT_ANGLES.includes(id));
  if (leftInvolved.length > 0) {
    const smallestLeft = Math.min(...leftInvolved);
    if (smallestLeft === 1) return "left-top";
    if (smallestLeft === 4 || smallestLeft === 5) return "left-middle";
    if (smallestLeft === 8) return "left-bottom";
  }

  const highest = Math.max(...ids);
  if (highest === 2) return "";
  if (highest === 3 || highest === 6) return "right-middle";
  if (highest === 7) return "right-bottom";
  return "";
};
const SUMMARY_EQUAL_POS = [
  { l: 22, t: 10, w: 17.5, h: 38 },
  { l: 41, t: 10, w: 17.5, h: 38 },
  { l: 60, t: 10, w: 17.5, h: 38 },
  { l: 79, t: 10, w: 17.5, h: 38 },
];
const SUMMARY_SUM180_POS = [
  { l: 26, t: 55, w: 20, h: 38 },
  { l: 49, t: 55, w: 20, h: 38 },
  { l: 72, t: 55, w: 20, h: 38 },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
const MainCanvas = (props) => {
  const {
    step,
    onSetNextEnabled,
    onUpdateTexts,
    onSetNextButtonText,
    onSetCanvasNudge,
    onStartOver,
    nextTrigger,
  } = props;
  const h = React.createElement;
  const { useState, useEffect, useLayoutEffect, useRef, useCallback } = React;

  const [mode, setMode] = useState("initialAnim");
  const [selectedCard, setSelectedCard] = useState(null);
  const [visitedCards, setVisitedCards] = useState([]);
  const [greyedAngles, setGreyedAngles] = useState([]);
  const [feedbackText, setFeedbackText] = useState(null);
  const [feedbackPositionClass, setFeedbackPositionClass] = useState("");
  const [cloneAngle, setCloneAngle] = useState(null);
  const [arcAnim, setArcAnim] = useState(null);
  const [arcClickable, setArcClickable] = useState(false);
  const [floatingLabel, setFloatingLabel] = useState(null);
  const [coInteriorCopies, setCoInteriorCopies] = useState(null);
  const [dehiLines, setDehiLines] = useState([]);
  const [dehiAngles, setDehiAngles] = useState([]);
  const [hiddenNumbers, setHiddenNumbers] = useState(false);
  const [degreeLabels, setDegreeLabels] = useState({});
  const [degreeLabelStyle, setDegreeLabelStyle] = useState(null);
  const [floatingDegreeLabels, setFloatingDegreeLabels] = useState([]);
  const [smallLabels, setSmallLabels] = useState(false);
  const [anglesClickable, setAnglesClickable] = useState([]);
  const [diagramOpacity, setDiagramOpacity] = useState(0);
  const [galleryBgVisible, setGalleryBgVisible] = useState(true);
  const [showAngles, setShowAngles] = useState(false);
  const [angleRadii, setAngleRadii] = useState(null);
  const [initialAnimReady, setInitialAnimReady] = useState(false);
  const [inStrip, setInStrip] = useState(false);
  const [showSummaryTitles, setShowSummaryTitles] = useState(false);

  const animatingRef = useRef(false);
  const cardRefs = useRef([]);
  const svgRef = useRef(null);
  const galleryBgRef = useRef(null);
  const initialAnimDoneRef = useRef(false);
  const prevNextTrigger = useRef(0);
  const greyedAnglesRef = useRef([]);
  useEffect(() => {
    greyedAnglesRef.current = greyedAngles;
  }, [greyedAngles]);
  const selectedCardRef = useRef(null);
  useEffect(() => {
    selectedCardRef.current = selectedCard;
  }, [selectedCard]);
  const activePairRef = useRef(null);
  const pairExploredRef = useRef(false);
  const hasShownInitialGalleryRef = useRef(false);
  const semicirclePhaseRef = useRef(false);
  const nudgeRefreshTimerRef = useRef(null);
  const modeRef = useRef(mode);
  const inStripRef = useRef(inStrip);
  const showSummaryTitlesRef = useRef(showSummaryTitles);
  const visitedCardsRef = useRef(visitedCards);
  const arcClickableRef = useRef(arcClickable);
  const arcAnimRef = useRef(arcAnim);
  const anglesClickableRef = useRef([]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    inStripRef.current = inStrip;
  }, [inStrip]);
  useEffect(() => {
    showSummaryTitlesRef.current = showSummaryTitles;
  }, [showSummaryTitles]);
  useEffect(() => {
    visitedCardsRef.current = visitedCards;
  }, [visitedCards]);
  useEffect(() => {
    arcClickableRef.current = arcClickable;
  }, [arcClickable]);
  useEffect(() => {
    arcAnimRef.current = arcAnim;
  }, [arcAnim]);
  useEffect(() => {
    anglesClickableRef.current = anglesClickable;
  }, [anglesClickable]);

  const playSnd = (s) => {
    if (typeof playSound === "function") playSound(s);
  };

  const clearNudge = useCallback(() => {
    if (onSetCanvasNudge) onSetCanvasNudge(null);
  }, [onSetCanvasNudge]);

  const getNudgeRect = (el) => {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width >= 2 && rect.height >= 2) {
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
    if (typeof el.getBBox === "function" && el.ownerSVGElement) {
      const bbox = el.getBBox();
      const svg = el.ownerSVGElement;
      const vb = svg.viewBox.baseVal;
      const svgRect = svg.getBoundingClientRect();
      const scaleX = svgRect.width / (vb.width || 800);
      const scaleY = svgRect.height / (vb.height || 500);
      const cx = svgRect.left + (bbox.x + bbox.width / 2) * scaleX;
      const cy = svgRect.top + (bbox.y + bbox.height / 2) * scaleY;
      const size = Math.max(bbox.width * scaleX, bbox.height * scaleY, 36);
      return {
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
      };
    }
    return {
      left: rect.left,
      top: rect.top,
      width: Math.max(rect.width, 36),
      height: Math.max(rect.height, 36),
    };
  };

  const setNudgeOnElement = useCallback(
    (el) => {
      const rect = getNudgeRect(el);
      if (!rect || !onSetCanvasNudge) return false;
      onSetCanvasNudge(rect);
      return true;
    },
    [onSetCanvasNudge],
  );

  const getGalleryCardElement = (key) => {
    const byData = document.querySelector('[data-card-key="' + key + '"]');
    if (byData) return byData;
    const idx = CARD_KEYS.indexOf(key);
    return idx >= 0 ? cardRefs.current[idx] : null;
  };

  const svgPointToScreenRect = (svg, x, y, size = 52) => {
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const screen = pt.matrixTransform(ctm);
    return {
      left: screen.x - size / 2,
      top: screen.y - size / 2,
      width: size,
      height: size,
    };
  };

  const getArcMidpointDeg = (startDeg, endDeg) => {
    const large = Math.abs(endDeg - startDeg) > 180;
    if (large) {
      const span = 360 - Math.abs(endDeg - startDeg);
      return endDeg > startDeg
        ? startDeg - span / 2
        : startDeg + span / 2;
    }
    return (startDeg + endDeg) / 2;
  };

  const getSemicircleNudgeRect = () => {
    const svg = document.querySelector(".diagram-svg");
    if (!svg) return null;

    const arcPathEl = document.querySelector(".semicircle-arc-visible");
    if (arcPathEl && typeof arcPathEl.getTotalLength === "function") {
      const len = arcPathEl.getTotalLength();
      if (len > 0) {
        const mid = arcPathEl.getPointAtLength(len / 2);
        const rect = svgPointToScreenRect(svg, mid.x, mid.y);
        if (rect) return rect;
      }
    }

    const arc = arcAnimRef.current;
    if (!arc) return null;
    const cardType = selectedCardRef.current;
    const arcR = cardType === "linear" ? LINEAR_ARC_R : ARC_R;
    const endDeg = arc.finalEnd != null ? arc.finalEnd : arc.end;
    const midDeg = getArcMidpointDeg(arc.start, endDeg);
    const tip = polarToXY(arc.cx, arc.cy, arcR, midDeg);
    return svgPointToScreenRect(svg, tip.x, tip.y);
  };

  const enterSemicirclePhase = () => {
    semicirclePhaseRef.current = true;
    anglesClickableRef.current = [];
  };

  const exitSemicirclePhase = () => {
    semicirclePhaseRef.current = false;
    arcAnimRef.current = null;
    arcClickableRef.current = false;
  };

  const refreshNudgeRef = useRef(() => {});

  refreshNudgeRef.current = () => {
    if (animatingRef.current) {
      clearNudge();
      return;
    }

    const currentMode = modeRef.current;
    const cardType = selectedCardRef.current;
    const isSum180 = PAIR_SUM_180.includes(cardType);

    if (currentMode === "diagram") {
      const inSemicirclePhase =
        isSum180 &&
        (semicirclePhaseRef.current ||
          activePairRef.current ||
          arcAnimRef.current ||
          arcClickableRef.current);

      if (inSemicirclePhase) {
        if (arcClickableRef.current) {
          const arcRect = getSemicircleNudgeRect();
          if (arcRect && onSetCanvasNudge) {
            onSetCanvasNudge(arcRect);
            return;
          }
          const arcEl =
            document.querySelector(".semicircle-arc-visible") ||
            document.querySelector(".semicircle-arc-hit");
          if (setNudgeOnElement(arcEl)) return;
        }
        clearNudge();
        return;
      }

      if (
        !pairExploredRef.current &&
        greyedAnglesRef.current.length === 0 &&
        anglesClickableRef.current.length > 0
      ) {
        const id = anglesClickableRef.current[0];
        const angleEl = document.querySelector(".angle-group-" + id);
        if (setNudgeOnElement(angleEl)) return;
      }

      clearNudge();
      return;
    }

    if (
      currentMode === "gallery" &&
      !inStripRef.current &&
      !showSummaryTitlesRef.current &&
      !IMPLEMENTED.every((c) => visitedCardsRef.current.includes(c))
    ) {
      const isFirstGallery = !hasShownInitialGalleryRef.current;
      const targetKey = isFirstGallery
        ? "vertical"
        : CARD_KEYS.find(
            (k) =>
              IMPLEMENTED.includes(k) &&
              !visitedCardsRef.current.includes(k),
          );
      if (targetKey) {
        const cardEl = getGalleryCardElement(targetKey);
        if (setNudgeOnElement(cardEl)) {
          if (isFirstGallery) hasShownInitialGalleryRef.current = true;
          return;
        }
      }
    }

    clearNudge();
  };

  const scheduleNudgeRefresh = useCallback((delay = 150) => {
    if (nudgeRefreshTimerRef.current)
      clearTimeout(nudgeRefreshTimerRef.current);
    nudgeRefreshTimerRef.current = setTimeout(() => {
      refreshNudgeRef.current();
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (nudgeRefreshTimerRef.current)
        clearTimeout(nudgeRefreshTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (step !== 1) return;
    scheduleNudgeRefresh(150);
    const onResize = () => refreshNudgeRef.current();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [
    step,
    mode,
    inStrip,
    visitedCards,
    anglesClickable,
    arcClickable,
    arcAnim,
    greyedAngles,
    showSummaryTitles,
    scheduleNudgeRefresh,
  ]);

  const allCardsVisited = useCallback(
    () => IMPLEMENTED.every((c) => visitedCards.includes(c)),
    [visitedCards],
  );

  const getSummaryPosForCard = (key) => {
    if (PAIR_EQUAL.includes(key)) {
      return SUMMARY_EQUAL_POS[PAIR_EQUAL.indexOf(key)];
    }
    if (PAIR_SUM_180.includes(key)) {
      return SUMMARY_SUM180_POS[PAIR_SUM_180.indexOf(key)];
    }
    return GALLERY_POS[CARD_KEYS.indexOf(key)];
  };

  const smoothRestoreHighlights = (onComplete) => {
    const tl = gsap.timeline();
    tl.call(() => {
      setDehiLines([]);
      setDehiAngles([]);
    });
    tl.to({}, { duration: 0.5 });
    tl.call(() => {
      if (onComplete) onComplete();
    });
    return tl;
  };

  const fadeOutCoInteriorCopies = (onComplete) => {
    const root = document.querySelector(".co-interior-copies");
    if (!root) {
      if (onComplete) onComplete();
      return gsap.timeline();
    }
    return gsap.to(root, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete,
    });
  };

  const finishPairInteraction = (type, newGreyed, feedbackMsg, pairIds) => {
    pairExploredRef.current = true;
    const ids =
      pairIds && pairIds.length
        ? pairIds
        : activePairRef.current
          ? [activePairRef.current.a, activePairRef.current.b]
          : [];
    setFeedbackPositionClass(getFeedbackPositionClass(ids));
    setFeedbackText(feedbackMsg);
    gsap.fromTo(
      ".feedback-box",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4 },
    );
    setTimeout(() => {
      animatingRef.current = false;
      updateNavAfterPair(type, newGreyed);
    }, 300);
  };

  const tweenDegreeLabelStyles = (configs, duration, onComplete) => {
    const proxy = { t: 0 };
    return gsap.to(proxy, {
      t: 1,
      duration,
      ease: "power2.inOut",
      onUpdate: () => {
        const styles = {};
        configs.forEach(
          ({ id, cx, cy, start, end, fromR, toR, fromFs, toFs }) => {
            const r = fromR + (toR - fromR) * proxy.t;
            const fs = fromFs + (toFs - fromFs) * proxy.t;
            const p = labelPosAt(cx, cy, start, end, r);
            styles[id] = { x: p.x, y: p.y, fontSize: fs, opacity: 1 };
          },
        );
        setDegreeLabelStyle(styles);
      },
      onComplete: () => {
        if (onComplete) onComplete();
        else setDegreeLabelStyle(null);
      },
    });
  };

  const tweenLabelsToSmall = (ids, duration, onComplete) => {
    const configs = ids.map((id) => {
      const a = angleDataOf(id);
      return {
        id,
        cx: a.cx,
        cy: a.cy,
        start: a.start,
        end: a.end,
        fromR: LABEL_R,
        toR: LABEL_R * 0.55,
        fromFs: LABEL_FS_LARGE,
        toFs: LABEL_FS_SMALL,
      };
    });
    return tweenDegreeLabelStyles(configs, duration, onComplete);
  };

  const tweenCopyLabelsToSmall = (duration, onComplete) => {
    const proxy = { t: 0 };
    return gsap.to(proxy, {
      t: 1,
      duration,
      ease: "power2.inOut",
      onUpdate: () => {
        const lr = LABEL_R + (LABEL_R * 0.55 - LABEL_R) * proxy.t;
        const fs = LABEL_FS_LARGE + (LABEL_FS_SMALL - LABEL_FS_LARGE) * proxy.t;
        setCoInteriorCopies(
          (prev) =>
            prev && {
              ...prev,
              topLabel: { ...prev.topLabel, lr, fontSize: fs },
              botLabel: { ...prev.botLabel, lr, fontSize: fs },
            },
        );
      },
      onComplete,
    });
  };

  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        left: GALLERY_POS[i].l + "%",
        top: GALLERY_POS[i].t + "%",
        width: GALLERY_POS[i].w + "%",
        height: GALLERY_POS[i].h + "%",
        padding: "0.6vw",
        opacity: 0,
      });
    });
  }, []);

  /* ═══════════════════════════════════════════════════
     TEXT TRANSITIONS
     ═══════════════════════════════════════════════════ */
  const fadeText = (selector, newText, cb) => {
    const el = document.querySelector(selector);
    if (!el) {
      if (cb) cb();
      return;
    }
    gsap.to(el, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        if (typeof newText === "function") newText();
        gsap.to(el, { opacity: 1, duration: 0.25, onComplete: cb });
      },
    });
  };
  const setQuestionText = (txt, cb) => {
    fadeText(".question-panel h2", () => onUpdateTexts(undefined, txt), cb);
  };
  const setNavText = (txt, cb) => {
    fadeText(".nav-text-container", () => onUpdateTexts(txt), cb);
  };
  const fadeOutTexts = (cb) => {
    clearNudge();
    gsap.killTweensOf(".question-panel h2");
    gsap.killTweensOf(".nav-text-container");
    gsap.to(".question-panel h2", {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(".nav-text-container", {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: cb,
    });
  };
  const fadeInTexts = () => {
    gsap.killTweensOf(".question-panel h2");
    gsap.killTweensOf(".nav-text-container");
    gsap.to(".question-panel h2", {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(".nav-text-container", {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const animateQuestionIn = (cb) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.querySelector(".question-panel h2");
        if (!el) {
          if (cb) cb();
          return;
        }
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
            onComplete: cb,
          },
        );
      });
    });
  };

  const revealQuestionText = (txt, cb) => {
    onUpdateTexts(undefined, txt);
    animateQuestionIn(cb);
  };

  const fadeInNavAndQuestion = (navTxt, questionTxt) => {
    onUpdateTexts(navTxt, questionTxt);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.killTweensOf(".question-panel h2");
        gsap.killTweensOf(".nav-text-container");
        gsap.fromTo(
          ".question-panel h2",
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out", overwrite: true },
        );
        gsap.fromTo(
          ".nav-text-container",
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out", overwrite: true },
        );
      });
    });
  };

  const updateGalleryNavState = (visitedOverride) => {
    const visited = visitedOverride || visitedCards;
    const allVisited = IMPLEMENTED.every((c) => visited.includes(c));
    if (allVisited) {
      fadeInNavAndQuestion(
        APP_DATA.gallery.allVisitedText,
        APP_DATA.step1.questionText,
      );
      onSetNextEnabled(true);
    } else {
      fadeInNavAndQuestion(
        APP_DATA.gallery.selectText,
        APP_DATA.step1.questionText,
      );
      onSetNextEnabled(false);
    }
  };

  const hideFeedback = () => {
    const el = document.querySelector(".feedback-box");
    if (!el) {
      setFeedbackText(null);
      setFeedbackPositionClass("");
      return;
    }
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setFeedbackText(null);
        setFeedbackPositionClass("");
      },
    });
  };

  /* ═══════════════════════════════════════════════════
     GALLERY ↔ STRIP ANIMATIONS
     ═══════════════════════════════════════════════════ */
  const animateToStrip = (onDone) => {
    const tl = gsap.timeline({
      onComplete: () => {
        setInStrip(true);
        if (onDone) onDone();
      },
    });
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const lbl = el.querySelector(".card-label");
      if (lbl) tl.to(lbl, { opacity: 0, duration: 0.2 }, 0);
      tl.to(
        el,
        {
          left: STRIP_POS[i].l + "%",
          top: STRIP_POS[i].t + "%",
          width: STRIP_POS[i].w + "%",
          height: STRIP_POS[i].h + "%",
          borderRadius: "0.4vw",
          duration: 0.6,
          ease: "power2.inOut",
        },
        0.15,
      );
    });
  };

  const animateToGallery = (onDone, useSummaryLayout) => {
    setInStrip(false);
    const tl = gsap.timeline({ onComplete: onDone });
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const key = CARD_KEYS[i];
      const pos = useSummaryLayout
        ? getSummaryPosForCard(key)
        : GALLERY_POS[i];
      tl.to(
        el,
        {
          left: pos.l + "%",
          top: pos.t + "%",
          width: pos.w + "%",
          height: pos.h + "%",
          padding: "0.6vw",
          borderRadius: "0.8vw",
          duration: 0.6,
          ease: "power2.inOut",
        },
        0,
      );
      const lbl = el.querySelector(".card-label");
      if (lbl) tl.to(lbl, { opacity: 1, duration: 0.25 }, 0.5);
    });
  };

  const animateToSummary = (onDone) => {
    setShowSummaryTitles(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const tl = gsap.timeline({ onComplete: onDone });
        tl.to(
          ".summary-row-title",
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          0,
        );
        CARD_KEYS.forEach((key, i) => {
          const el = cardRefs.current[i];
          if (!el) return;
          const pos = getSummaryPosForCard(key);
          tl.to(
            el,
            {
              left: pos.l + "%",
              top: pos.t + "%",
              width: pos.w + "%",
              height: pos.h + "%",
              padding: "0.6vw",
              borderRadius: "0.8vw",
              duration: 0.8,
              ease: "power2.inOut",
            },
            0,
          );
        });
      });
    });
  };

  const animateToGalleryFromSummary = (onDone) => {
    gsap.to(".summary-row-title", {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setShowSummaryTitles(false),
    });
    const tl = gsap.timeline({ onComplete: onDone });
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(
        el,
        {
          left: GALLERY_POS[i].l + "%",
          top: GALLERY_POS[i].t + "%",
          width: GALLERY_POS[i].w + "%",
          height: GALLERY_POS[i].h + "%",
          padding: "0.6vw",
          borderRadius: "0.8vw",
          duration: 0.8,
          ease: "power2.inOut",
        },
        0,
      );
    });
  };

  const showDiagram = () => {
    setGalleryBgVisible(false);
    setShowAngles(true);
    setAngleRadii(null);
    gsap.set(".line-segment", { clearProps: "all" });
    setDiagramOpacity(0);
    requestAnimationFrame(() => {
      setDiagramOpacity(1);
    });
  };

  const hideDiagram = (cb) => {
    setDiagramOpacity(0);
    setTimeout(() => {
      if (cb) cb();
    }, DIAGRAM_FADE_MS);
  };

  /* ═══════════════════════════════════════════════════
     CARD CLICK → ENTER DIAGRAM
     ═══════════════════════════════════════════════════ */
  const handleCardClick = (type, idx) => {
    if (animatingRef.current) return;
    if (inStrip) return;
    if (mode === "completed" || showSummaryTitles) return;
    if (!IMPLEMENTED.includes(type)) {
      playSnd("click");
      return;
    }
    animatingRef.current = true;
    playSnd("click");
    clearNudge();
    setSelectedCard(type);
    pairExploredRef.current = false;

    fadeOutTexts();
    onSetNextEnabled(false);
    resetDiagramState();

    animateToStrip(() => {
      showDiagram();
      setTimeout(() => {
        enterDiagramForType(type);
        animatingRef.current = false;
      }, 400);
    });
  };

  /* ═══════════════════════════════════════════════════
     NEXT TRIGGER → RETURN TO GALLERY
     ═══════════════════════════════════════════════════ */
  useEffect(() => {
    if (nextTrigger === 0 || nextTrigger === prevNextTrigger.current) return;
    prevNextTrigger.current = nextTrigger;
    if (mode === "diagram") returnToGallery();
    else if (mode === "gallery" && allCardsVisited()) runSummaryAnimation();
    else if (mode === "completed") startOver();
  }, [nextTrigger, mode, allCardsVisited]);

  const runSummaryAnimation = () => {
    animatingRef.current = true;
    clearNudge();
    onSetNextEnabled(false);
    setSelectedCard(null);
    fadeOutTexts();
    animateToSummary(() => {
      setMode("completed");
      if (onSetNextButtonText) onSetNextButtonText(APP_DATA.gallery.startOverText);
      fadeInNavAndQuestion(
        APP_DATA.gallery.completedNavText,
        APP_DATA.gallery.summaryQuestionText,
      );
      onSetNextEnabled(true);
      animatingRef.current = false;
    });
  };

  const startOver = () => {
    if (onStartOver) onStartOver();
  };

  const returnToGallery = () => {
    animatingRef.current = true;
    onSetNextEnabled(false);
    setFeedbackText(null);
    setFeedbackPositionClass("");
    fadeOutTexts();
    const returningToSummary = showSummaryTitles;
    const completedCard = selectedCardRef.current;
    const shouldMarkVisited = pairExploredRef.current;
    let nextVisited = visitedCards;
    if (shouldMarkVisited && completedCard) {
      nextVisited = visitedCards.includes(completedCard)
        ? visitedCards
        : [...visitedCards, completedCard];
    }

    hideDiagram(() => {
      setGalleryBgVisible(true);
      setShowAngles(false);
      setAngleRadii(null);
      resetDiagramState();
      setSelectedCard(null);
      pairExploredRef.current = false;
      animateToGallery(() => {
        if (shouldMarkVisited && completedCard) {
          setVisitedCards(nextVisited);
        }
        if (returningToSummary) {
          setMode("completed");
          fadeInNavAndQuestion(
            APP_DATA.gallery.completedNavText,
            APP_DATA.gallery.summaryQuestionText,
          );
          onSetNextEnabled(true);
        } else {
          setMode("gallery");
          updateGalleryNavState(nextVisited);
          scheduleNudgeRefresh(200);
        }
        animatingRef.current = false;
      }, returningToSummary);
    });
  };

  /* ═══════════════════════════════════════════════════
     RESET DIAGRAM STATE
     ═══════════════════════════════════════════════════ */
  const resetDiagramState = () => {
    setGreyedAngles([]);
    setFeedbackText(null);
    setFeedbackPositionClass("");
    setCloneAngle(null);
    setArcAnim(null);
    setArcClickable(false);
    setFloatingLabel(null);
    setFloatingDegreeLabels([]);
    setCoInteriorCopies(null);
    setDehiLines([]);
    setDehiAngles([]);
    setHiddenNumbers(false);
    setDegreeLabels({});
    setDegreeLabelStyle(null);
    setSmallLabels(false);
    setAnglesClickable([]);
    activePairRef.current = null;
    exitSemicirclePhase();
    anglesClickableRef.current = [];
  };

  /* ═══════════════════════════════════════════════════
     ENTER DIAGRAM FOR TYPE
     ═══════════════════════════════════════════════════ */
  const enterDiagramForType = (type) => {
    setMode("diagram");
    const data = APP_DATA[type];
    if (!data) return;

    setQuestionText(data.questionText, () => {
      setNavText(data.navText, () => {
        if (type === "vertical") {
          setAnglesClickable([1, 2, 3, 4, 5, 6, 7, 8]);
        } else if (type === "corresponding") {
          setAnglesClickable([1, 2, 3, 4, 5, 6, 7, 8]);
        } else if (type === "alternateInterior") {
          setAnglesClickable(ALT_INT_IDS.slice());
        } else if (type === "alternateExterior") {
          setAnglesClickable(ALT_EXT_IDS.slice());
        } else if (type === "coInterior") {
          setAnglesClickable(COINTERIOR_IDS.slice());
        } else if (type === "coExterior") {
          setAnglesClickable(COEXTERIOR_IDS.slice());
        } else if (type === "linear") {
          setAnglesClickable([1, 2, 3, 4, 5, 6, 7, 8]);
        }
        scheduleNudgeRefresh(200);
      });
    });
  };

  const prepareInitialAnimElements = () => {
    ["topLeftRay", "topRightRay", "bottomLeftRay", "bottomRightRay"].forEach(
      (key) => {
        const el = document.querySelector(".line-" + key);
        if (el) gsap.set(el, { opacity: 0, x: -600 });
      },
    );
    ["transversalTop", "transversalMid", "transversalBot"].forEach((key) => {
      const el = document.querySelector(".line-" + key);
      if (el) gsap.set(el, { opacity: 0, y: -400 });
    });
  };

  const animateInitialAngles = (onGrowComplete) => {
    const startR = ANG_R * 0.1;
    const initial = {};
    ANGLE_DATA.forEach((a) => {
      initial[a.id] = startR;
    });
    setAngleRadii(initial);
    setShowAngles(true);

    const proxy = { r: startR };
    return gsap.to(proxy, {
      r: ANG_R,
      duration: 0.7,
      ease: "none",
      onUpdate: () => {
        const next = {};
        ANGLE_DATA.forEach((a) => {
          next[a.id] = proxy.r;
        });
        setAngleRadii(next);
      },
      onComplete: () => {
        setAngleRadii(null);
        if (onGrowComplete) onGrowComplete();
      },
    });
  };

  const showGalleryAfterInitialAnim = () => {
    initialAnimDoneRef.current = true;
    gsap.set(".line-segment", { clearProps: "all" });
    setAngleRadii(null);
    setDiagramOpacity(0);
    setTimeout(() => {
      setShowAngles(false);
      setGalleryBgVisible(true);
      setMode("gallery");
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          left: GALLERY_POS[i].l + "%",
          top: GALLERY_POS[i].t + "%",
          width: GALLERY_POS[i].w + "%",
          height: GALLERY_POS[i].h + "%",
          padding: "0.6vw",
        });
        gsap.to(el, { opacity: 1, duration: 0.4, delay: i * 0.06 });
        const lbl = el.querySelector(".card-label");
        if (lbl) gsap.set(lbl, { opacity: 1 });
      });
      fadeInNavAndQuestion(
        APP_DATA.gallery.selectText,
        APP_DATA.step1.questionText,
      );
      scheduleNudgeRefresh(900);
    }, DIAGRAM_FADE_MS);
  };

  /* ═══════════════════════════════════════════════════
     STEP 1 — INITIAL ANIMATION
     ═══════════════════════════════════════════════════ */
  useLayoutEffect(() => {
    if (step !== 1) return;
    if (initialAnimDoneRef.current) {
      setMode("gallery");
      setGalleryBgVisible(true);
      setShowAngles(false);
      setAngleRadii(null);
      setInitialAnimReady(true);
      fadeInNavAndQuestion(
        APP_DATA.gallery.selectText,
        APP_DATA.step1.questionText,
      );
      scheduleNudgeRefresh(200);
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          left: GALLERY_POS[i].l + "%",
          top: GALLERY_POS[i].t + "%",
          width: GALLERY_POS[i].w + "%",
          height: GALLERY_POS[i].h + "%",
          padding: "0.6vw",
          opacity: 1,
        });
        const lbl = el.querySelector(".card-label");
        if (lbl) gsap.set(lbl, { opacity: 1 });
      });
      return;
    }
    runInitialAnimation();
  }, [step]);

  const runInitialAnimation = () => {
    gsap.set(".question-panel h2", { opacity: 0 });
    onUpdateTexts("", "");
    setMode("initialAnim");
    setDiagramOpacity(1);
    setGalleryBgVisible(false);
    setShowAngles(false);
    setAngleRadii(null);
    setInitialAnimReady(false);

    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0 });
    });
    prepareInitialAnimElements();
    setInitialAnimReady(true);

    onUpdateTexts("", APP_DATA.step1.questionText);

    const tl = gsap.timeline();

    tl.call(() => {
      animateQuestionIn();
    });
    tl.to({}, { duration: 0.5 });

    const topLine = document.querySelector(".line-topLeftRay");
    const topLine2 = document.querySelector(".line-topRightRay");
    if (topLine)
      tl.to(
        topLine,
        { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
        0.6,
      );
    if (topLine2)
      tl.to(
        topLine2,
        { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
        0.6,
      );

    const botLine = document.querySelector(".line-bottomLeftRay");
    const botLine2 = document.querySelector(".line-bottomRightRay");
    if (botLine)
      tl.to(
        botLine,
        { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
        1.1,
      );
    if (botLine2)
      tl.to(
        botLine2,
        { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" },
        1.1,
      );

    const transTop = document.querySelector(".line-transversalTop");
    const transMid = document.querySelector(".line-transversalMid");
    const transBot = document.querySelector(".line-transversalBot");
    if (transTop)
      tl.to(
        transTop,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        1.8,
      );
    if (transMid)
      tl.to(
        transMid,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        1.8,
      );
    if (transBot)
      tl.to(
        transBot,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        1.8,
      );

    tl.to({}, { duration: 0.5 });
    tl.call(() => {
      animateInitialAngles(() => {
        gsap.delayedCall(1.2, showGalleryAfterInitialAnim);
      });
    });
  };

  const revealNavText = (txt, cb) => {
    const el = document.querySelector(".nav-text-container");
    onUpdateTexts(txt);
    if (!el) {
      if (cb) cb();
      return;
    }
    gsap.set(el, { opacity: 0 });
    requestAnimationFrame(() => {
      gsap.to(el, { opacity: 1, duration: 0.25, onComplete: cb });
    });
  };

  const enableArcInteraction = (navText) => {
    animatingRef.current = false;
    arcClickableRef.current = true;
    setArcClickable(true);
    revealNavText(navText, () => {
      refreshNudgeRef.current();
      setTimeout(() => refreshNudgeRef.current(), 400);
    });
  };

  const handleArcResultClick = () => {
    clearNudge();
    semicirclePhaseRef.current = false;
    arcClickableRef.current = false;
    const type = selectedCardRef.current;
    if (type === "linear") handleLinearResultClick();
    else if (type === "coInterior") handleCoPairResultClick("coInterior");
    else if (type === "coExterior") handleCoPairResultClick("coExterior");
  };
  /* ═══════════════════════════════════════════════════
     ANGLE CLICK DISPATCHER
     ═══════════════════════════════════════════════════ */
  const handleAngleClick = (id) => {
    if (arcClickable && activePairRef.current) {
      const ap = activePairRef.current;
      if (id === ap.a || id === ap.b) {
        handleArcResultClick();
        return;
      }
    }
    if (animatingRef.current) return;
    if (greyedAnglesRef.current.includes(id)) return;
    if (!anglesClickableRef.current.includes(id)) return;
    clearNudge();
    const type = selectedCardRef.current;
    if (type === "vertical") handleVerticalClick(id);
    else if (type === "corresponding")
      handleTranslateCloneClick(
        id,
        CORRESPONDING_PAIRS,
        "corresponding",
        false,
      );
    else if (type === "alternateInterior")
      handleTranslateCloneClick(id, ALT_INT_PAIRS, "alternateInterior", true);
    else if (type === "alternateExterior")
      handleTranslateCloneClick(id, ALT_EXT_PAIRS, "alternateExterior", true);
    else if (type === "coInterior") handleCoPairClick(id, "coInterior");
    else if (type === "coExterior") handleCoPairClick(id, "coExterior");
    else if (type === "linear") handleLinearClick(id);
  };

  const updateNavAfterPair = (type, newGreyed) => {
    const data = APP_DATA[type];
    if (!data) return;
    revealQuestionText(data.questionText);
    const allClickable =
      type === "coInterior"
        ? COINTERIOR_IDS
        : type === "coExterior"
          ? COEXTERIOR_IDS
          : type === "alternateInterior"
            ? ALT_INT_IDS
            : type === "alternateExterior"
              ? ALT_EXT_IDS
              : [1, 2, 3, 4, 5, 6, 7, 8];
    const remaining = allClickable.filter((a) => !newGreyed.includes(a));
    if (remaining.length === 0) {
      setNavText(data.navTextDone);
      onSetNextEnabled(true);
      setAnglesClickable([]);
    } else {
      setNavText(data.navTextAfter);
      onSetNextEnabled(true);
      setAnglesClickable(remaining);
    }
  };

  const beginPairExploration = () => {
    onSetNextEnabled(false);
    hideFeedback();
    clearNudge();
  };

  /* ═══════════════════════════════════════════════════
     VERTICAL ANGLE HANDLER
     ═══════════════════════════════════════════════════ */
  const handleVerticalClick = (id) => {
    animatingRef.current = true;
    playSnd("click");
    beginPairExploration();
    setAnglesClickable([]);
    const pair = VERTICAL_PAIRS[id];
    const pt = POINT_OF[id];
    const otherAngles = [1, 2, 3, 4, 5, 6, 7, 8].filter(
      (a) => a !== id && a !== pair,
    );
    const dehiL = VERTICAL_DEHI_LINES[pt];

    fadeOutTexts();

    setDehiAngles(otherAngles);
    setDehiLines(dehiL);
    setHiddenNumbers(true);
    const labels = {};
    greyedAnglesRef.current.forEach((a) => {
      labels[a] = angleMeasure(a) + "\u00B0";
    });
    labels[id] = angleMeasure(id) + "\u00B0";
    setDegreeLabels(labels);
    setSmallLabels(false);

    const a = angleDataOf(id);
    const mid = (a.start + a.end) / 2;

    const tl = gsap.timeline();
    tl.to({}, { duration: 0.6 });

    tl.call(() => {
      setCloneAngle({
        cx: a.cx,
        cy: a.cy,
        start: a.start,
        end: a.end,
        r: ANG_R,
        rot: 0,
        color: angleColor(id),
        labelText: angleMeasure(id) + "\u00B0",
        labelX: 0,
        labelY: 0,
      });
    });

    const proxy = { r: ANG_R, rot: 0 };
    const peakR = ANG_R * 3.5;

    tl.to(proxy, {
      r: peakR,
      duration: 0.4,
      onUpdate: () => {
        const lp = polarToXY(a.cx, a.cy, proxy.r * 1.2, mid);
        const rp = rotatePoint(lp.x, lp.y, a.cx, a.cy, proxy.rot);
        setCloneAngle(
          (prev) => prev && { ...prev, r: proxy.r, labelX: rp.x, labelY: rp.y },
        );
      },
    });

    tl.to(proxy, {
      rot: 180,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const lp = polarToXY(a.cx, a.cy, proxy.r * 1.2, mid);
        const rp = rotatePoint(lp.x, lp.y, a.cx, a.cy, proxy.rot);
        setCloneAngle(
          (prev) =>
            prev && { ...prev, rot: proxy.rot, labelX: rp.x, labelY: rp.y },
        );
      },
    });

    tl.to(proxy, {
      r: ANG_R,
      duration: 0.4,
      onUpdate: () => {
        const lp = polarToXY(a.cx, a.cy, proxy.r * 1.2, mid);
        const rp = rotatePoint(lp.x, lp.y, a.cx, a.cy, proxy.rot);
        setCloneAngle(
          (prev) => prev && { ...prev, r: proxy.r, labelX: rp.x, labelY: rp.y },
        );
      },
    });

    tl.call(() => {
      setCloneAngle(null);
      const blinkLabels = {};
      greyedAnglesRef.current.forEach((a) => {
        blinkLabels[a] = angleMeasure(a) + "\u00B0";
      });
      blinkLabels[id] = angleMeasure(id) + "\u00B0";
      blinkLabels[pair] = angleMeasure(pair) + "\u00B0";
      setDegreeLabels(blinkLabels);

      const blinkProxy = { opacity: 1 };
      const blinkSel =
        ".angle-group-" +
        id +
        " .vblink-label, .angle-group-" +
        pair +
        " .vblink-label";
      gsap.to(blinkProxy, {
        opacity: 0.2,
        duration: 0.2,
        yoyo: true,
        repeat: 5,
        onUpdate: () => {
          document.querySelectorAll(blinkSel).forEach((el) => {
            el.style.opacity = blinkProxy.opacity;
          });
        },
        onComplete: () => {
          document.querySelectorAll(blinkSel).forEach((el) => {
            el.style.opacity = 1;
          });
          finishVertical(id, pair);
        },
      });
    });
  };

  const finishVertical = (id, pair) => {
    setCloneAngle(null);
    const newGreyed = [...greyedAnglesRef.current, id, pair];

    const allLabels = {};
    newGreyed.forEach((a) => {
      allLabels[a] = angleMeasure(a) + "\u00B0";
    });
    setDegreeLabels(allLabels);

    const initStyles = {};
    [id, pair].forEach((aid) => {
      const ad = angleDataOf(aid);
      const p = labelPosAt(ad.cx, ad.cy, ad.start, ad.end, LABEL_R);
      initStyles[aid] = {
        x: p.x,
        y: p.y,
        fontSize: LABEL_FS_LARGE,
        opacity: 1,
      };
    });
    setDegreeLabelStyle(initStyles);

    tweenLabelsToSmall([id, pair], 0.5, () => {
      setDegreeLabelStyle(null);
      setGreyedAngles(newGreyed);
      setSmallLabels(true);
      smoothRestoreHighlights(() => {
        setHiddenNumbers(false);
        finishPairInteraction(
          "vertical",
          newGreyed,
          APP_DATA.vertical.feedback,
          [id, pair],
        );
      });
    });
  };

  /* ═══════════════════════════════════════════════════
     CORRESPONDING / ALTERNATE CLONE HANDLER
     (grow → translate → optional rotate → shrink)
     ═══════════════════════════════════════════════════ */
  const finishClonePair = (id, pair, cardType) => {
    setCloneAngle(null);
    const newGreyed = [...greyedAnglesRef.current, id, pair];

    const allLabels = {};
    newGreyed.forEach((a) => {
      allLabels[a] = angleMeasure(a) + "\u00B0";
    });
    setDegreeLabels(allLabels);

    const initStyles = {};
    [id, pair].forEach((aid) => {
      const ad = angleDataOf(aid);
      const p = labelPosAt(ad.cx, ad.cy, ad.start, ad.end, LABEL_R);
      initStyles[aid] = {
        x: p.x,
        y: p.y,
        fontSize: LABEL_FS_LARGE,
        opacity: 1,
      };
    });
    setDegreeLabelStyle(initStyles);

    tweenLabelsToSmall([id, pair], 0.5, () => {
      setDegreeLabelStyle(null);
      setGreyedAngles(newGreyed);
      setSmallLabels(true);
      smoothRestoreHighlights(() => {
        setHiddenNumbers(false);
        finishPairInteraction(
          cardType,
          newGreyed,
          APP_DATA[cardType].feedback,
          [id, pair],
        );
      });
    });
  };

  const handleTranslateCloneClick = (id, pairMap, cardType, rotateToAlign) => {
    animatingRef.current = true;
    playSnd("click");
    beginPairExploration();
    setAnglesClickable([]);
    const pair = pairMap[id];
    const src = angleDataOf(id);
    const dst = angleDataOf(pair);
    const srcMid = (src.start + src.end) / 2;
    const dstMid = (dst.start + dst.end) / 2;
    const rotTarget = rotateToAlign ? dstMid - srcMid : 0;

    fadeOutTexts();

    const otherAngles = [1, 2, 3, 4, 5, 6, 7, 8].filter(
      (a) => a !== id && a !== pair,
    );
    const keepLines = [
      ...ANGLE_BOUNDARY_LINES[id],
      ...ANGLE_BOUNDARY_LINES[pair],
    ];
    setDehiLines(LINE_KEYS.filter((k) => !keepLines.includes(k)));
    setDehiAngles(otherAngles);
    setHiddenNumbers(true);
    const labels = {};
    greyedAnglesRef.current.forEach((a) => {
      labels[a] = angleMeasure(a) + "\u00B0";
    });
    labels[id] = angleMeasure(id) + "\u00B0";
    setDegreeLabels(labels);
    setSmallLabels(false);

    const updateClone = (proxy) => {
      const pos = cloneLabelPos(
        proxy.cx,
        proxy.cy,
        proxy.r,
        src.start,
        src.end,
        proxy.rot,
      );
      setCloneAngle({
        cx: proxy.cx,
        cy: proxy.cy,
        start: src.start,
        end: src.end,
        r: proxy.r,
        rot: proxy.rot,
        color: angleColor(id),
        labelText: angleMeasure(id) + "\u00B0",
        labelX: pos.x,
        labelY: pos.y,
      });
    };

    const tl = gsap.timeline();
    tl.to({}, { duration: 0.6 });

    const proxy = { r: ANG_R, cx: src.cx, cy: src.cy, rot: 0 };
    const peakR = ANG_R * 3.5;

    tl.call(() => updateClone(proxy));

    tl.to(proxy, {
      r: peakR,
      duration: 0.4,
      onUpdate: () => updateClone(proxy),
    });

    tl.to(proxy, {
      cx: dst.cx,
      cy: dst.cy,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => updateClone(proxy),
    });

    if (rotateToAlign && rotTarget !== 0) {
      tl.to(proxy, {
        rot: rotTarget,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => updateClone(proxy),
      });
    }

    tl.to(proxy, {
      r: ANG_R,
      duration: 0.4,
      onUpdate: () => updateClone(proxy),
    });

    tl.call(() => {
      setCloneAngle(null);
      const blinkLabels = {};
      greyedAnglesRef.current.forEach((a) => {
        blinkLabels[a] = angleMeasure(a) + "\u00B0";
      });
      blinkLabels[id] = angleMeasure(id) + "\u00B0";
      blinkLabels[pair] = angleMeasure(pair) + "\u00B0";
      setDegreeLabels(blinkLabels);

      const blinkProxy = { opacity: 1 };
      const blinkSel =
        ".angle-group-" +
        id +
        " .vblink-label, .angle-group-" +
        pair +
        " .vblink-label";
      gsap.to(blinkProxy, {
        opacity: 0.2,
        duration: 0.2,
        yoyo: true,
        repeat: 5,
        onUpdate: () => {
          document.querySelectorAll(blinkSel).forEach((el) => {
            el.style.opacity = blinkProxy.opacity;
          });
        },
        onComplete: () => {
          document.querySelectorAll(blinkSel).forEach((el) => {
            el.style.opacity = 1;
          });
          finishClonePair(id, pair, cardType);
        },
      });
    });
  };

  /* ═══════════════════════════════════════════════════
     CO-INTERIOR / CO-EXTERIOR HANDLERS
     ═══════════════════════════════════════════════════ */
  const handleCoPairClick = (id, pairType) => {
    animatingRef.current = true;
    playSnd("click");
    beginPairExploration();
    enterSemicirclePhase();
    setAnglesClickable([]);
    const pairs =
      pairType === "coExterior" ? COEXTERIOR_PAIRS : COINTERIOR_PAIRS;
    const infoMap =
      pairType === "coExterior" ? COEXTERIOR_INFO : COINTERIOR_INFO;
    const pair = pairs[id];
    const pairKey = [Math.min(id, pair), Math.max(id, pair)].join(",");
    const info = infoMap[pairKey];
    if (!info) {
      animatingRef.current = false;
      semicirclePhaseRef.current = false;
      return;
    }
    activePairRef.current = { a: id, b: pair };

    fadeOutTexts();

    const keepLineKeys =
      pairType === "coExterior"
        ? ["transversalMid", "transversalTop", "transversalBot"]
        : ["transversalMid"];
    setDehiLines(LINE_KEYS.filter((k) => !keepLineKeys.includes(k)));
    setDehiAngles([1, 2, 3, 4, 5, 6, 7, 8]);
    setHiddenNumbers(true);
    setSmallLabels(false);

    const topId = POINT_OF[id] === "A" ? id : pair;
    const botId = POINT_OF[id] === "B" ? id : pair;
    const topA = angleDataOf(topId);
    const botA = angleDataOf(botId);

    setDegreeLabels({});

    const topRayKey = info.topParRay || info.topRay;
    const botRayKey = info.botParRay || info.botRay;
    const topRayData =
      pairType === "coExterior"
        ? parRayCopyAt(topRayKey, topA.cx, topA.cy)
        : { ...LINES[topRayKey] };
    const botRayData =
      pairType === "coExterior"
        ? parRayCopyAt(botRayKey, botA.cx, botA.cy)
        : { ...LINES[botRayKey] };

    const { dtx, dty, dbx, dby } = getPairCopyOffsets(pairType);

    setCoInteriorCopies({
      variant: pairType,
      topAngle: {
        id: topId,
        cx: topA.cx,
        cy: topA.cy,
        start: topA.start,
        end: topA.end,
        color: angleColor(topId),
      },
      botAngle: {
        id: botId,
        cx: botA.cx,
        cy: botA.cy,
        start: botA.start,
        end: botA.end,
        color: angleColor(botId),
      },
      topRay: { ...topRayData },
      botRay: { ...botRayData },
      tx: 0,
      ty: 0,
      bx: 0,
      by: 0,
      topLabel: {
        text: angleMeasure(topId) + "\u00B0",
        lr: LABEL_R,
        fontSize: LABEL_FS_LARGE,
        hide: false,
      },
      botLabel: {
        text: angleMeasure(botId) + "\u00B0",
        lr: LABEL_R,
        fontSize: LABEL_FS_LARGE,
        hide: false,
      },
    });

    const tl = gsap.timeline();
    tl.to({}, { duration: 0.5 });

    const proxy = { t: 0 };
    tl.to(proxy, {
      t: 1,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        setCoInteriorCopies(
          (prev) =>
            prev && {
              ...prev,
              tx: dtx * proxy.t,
              ty: dty * proxy.t,
              bx: dbx * proxy.t,
              by: dby * proxy.t,
            },
        );
      },
      onComplete: () => {
        setCoInteriorCopies(
          (prev) =>
            prev && {
              ...prev,
              tx: dtx,
              ty: dty,
              bx: dbx,
              by: dby,
            },
        );
      },
    });

    tl.add(tweenCopyLabelsToSmall(0.5));

    tl.call(() => {
      const arcData = {
        cx: MX,
        cy: MY,
        start: info.arc.start,
        end: info.arc.start,
        finalEnd: info.arc.end,
      };
      arcAnimRef.current = arcData;
      setArcAnim(arcData);
      const ap = { a: info.arc.start };
      gsap.to(ap, {
        a: info.arc.end,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () =>
          setArcAnim((prev) => {
            if (!prev) return prev;
            const next = { ...prev, end: ap.a };
            arcAnimRef.current = next;
            return next;
          }),
        onComplete: () => {
          enableArcInteraction(APP_DATA[pairType].navTextWait);
        },
      });
    });
  };

  const handleCoPairResultClick = (pairType) => {
    if (!arcClickable) return;
    animatingRef.current = true;
    setArcClickable(false);
    playSnd("click");
    fadeOutTexts();

    const copies = coInteriorCopies;
    if (!copies || !arcAnim) return;
    const topId = copies.topAngle.id,
      botId = copies.botAngle.id;
    const topA = copies.topAngle,
      botA = copies.botAngle;
    const { dtx, dty, dbx, dby } = getPairCopyOffsets(pairType);

    const arcData = arcAnim;
    const midAng = (arcData.start + arcData.finalEnd) / 2;
    const mergePos = polarToXY(arcData.cx, arcData.cy, ARC_R + 35, midAng);

    const topMid = (topA.start + topA.end) / 2;
    const botMid = (botA.start + botA.end) / 2;
    const topLr = copies.topLabel.lr || LABEL_R * 0.55;
    const botLr = copies.botLabel.lr || LABEL_R * 0.55;
    const topFs = copies.topLabel.fontSize || LABEL_FS_SMALL;
    const botFs = copies.botLabel.fontSize || LABEL_FS_SMALL;

    const topStart = labelPosAt(
      topA.cx + copies.tx,
      topA.cy + copies.ty,
      topA.start,
      topA.end,
      topLr,
    );
    const botStart = labelPosAt(
      botA.cx + copies.bx,
      botA.cy + copies.by,
      botA.start,
      botA.end,
      botLr,
    );
    const topOrigSmall = labelPosAt(
      topA.cx,
      topA.cy,
      topA.start,
      topA.end,
      LABEL_R * 0.55,
    );
    const botOrigSmall = labelPosAt(
      botA.cx,
      botA.cy,
      botA.start,
      botA.end,
      LABEL_R * 0.55,
    );

    setCoInteriorCopies(
      (prev) =>
        prev && {
          ...prev,
          topLabel: { ...prev.topLabel, hide: true },
          botLabel: { ...prev.botLabel, hide: true },
        },
    );

    setFloatingDegreeLabels([
      {
        key: "top",
        x: topStart.x,
        y: topStart.y,
        text: copies.topLabel.text,
        fontSize: topFs,
        opacity: 1,
      },
      {
        key: "bot",
        x: botStart.x,
        y: botStart.y,
        text: copies.botLabel.text,
        fontSize: botFs,
        opacity: 1,
      },
    ]);

    const tl = gsap.timeline();
    const mergeProxy = { t: 0 };

    tl.to(mergeProxy, {
      t: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = mergeProxy.t;
        setFloatingDegreeLabels([
          {
            key: "top",
            text: copies.topLabel.text,
            fontSize: topFs,
            x: topStart.x + (mergePos.x - topStart.x) * t,
            y: topStart.y + (mergePos.y - topStart.y) * t,
            opacity: 1 - t,
          },
          {
            key: "bot",
            text: copies.botLabel.text,
            fontSize: botFs,
            x: botStart.x + (mergePos.x - botStart.x) * t,
            y: botStart.y + (mergePos.y - botStart.y) * t,
            opacity: 1 - t,
          },
        ]);
        if (t > 0.75) {
          setFloatingLabel({
            text: "180\u00B0",
            x: mergePos.x,
            y: mergePos.y,
            opacity: (t - 0.75) / 0.25,
          });
        }
      },
      onComplete: () => {
        setFloatingDegreeLabels([]);
        setFloatingLabel({
          text: "180\u00B0",
          x: mergePos.x,
          y: mergePos.y,
          opacity: 1,
        });
      },
    });

    const blinkProxy = { op: 1 };
    tl.to(blinkProxy, {
      op: 0.2,
      duration: 0.2,
      yoyo: true,
      repeat: 5,
      onUpdate: () => {
        setFloatingLabel((prev) => prev && { ...prev, opacity: blinkProxy.op });
      },
    });
    tl.call(() => setFloatingLabel((prev) => prev && { ...prev, opacity: 1 }));

    tl.to({}, { duration: 0.5 });

    tl.call(() => {
      setFloatingLabel(null);
      setArcAnim(null);
      setFloatingDegreeLabels([
        {
          key: "top",
          x: mergePos.x,
          y: mergePos.y,
          text: copies.topLabel.text,
          fontSize: LABEL_FS_SMALL,
          opacity: 0,
        },
        {
          key: "bot",
          x: mergePos.x,
          y: mergePos.y,
          text: copies.botLabel.text,
          fontSize: LABEL_FS_SMALL,
          opacity: 0,
        },
      ]);
    });

    const returnProxy = { t: 1 };
    tl.to(returnProxy, {
      t: 0,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = returnProxy.t;
        const labelP = 1 - t;
        setCoInteriorCopies(
          (prev) =>
            prev && {
              ...prev,
              tx: dtx * t,
              ty: dty * t,
              bx: dbx * t,
              by: dby * t,
              topLabel: { ...prev.topLabel, hide: true },
              botLabel: { ...prev.botLabel, hide: true },
            },
        );
        setFloatingDegreeLabels([
          {
            key: "top",
            text: copies.topLabel.text,
            fontSize: LABEL_FS_SMALL,
            x: mergePos.x + (topOrigSmall.x - mergePos.x) * labelP,
            y: mergePos.y + (topOrigSmall.y - mergePos.y) * labelP,
            opacity: labelP,
          },
          {
            key: "bot",
            text: copies.botLabel.text,
            fontSize: LABEL_FS_SMALL,
            x: mergePos.x + (botOrigSmall.x - mergePos.x) * labelP,
            y: mergePos.y + (botOrigSmall.y - mergePos.y) * labelP,
            opacity: labelP,
          },
        ]);
      },
    });

    let newGreyedResult = [];
    tl.call(() => {
      setFloatingDegreeLabels([]);
      setSmallLabels(true);

      newGreyedResult = [...greyedAnglesRef.current, topId, botId];
      setGreyedAngles(newGreyedResult);

      const pauseLabels = {};
      greyedAnglesRef.current.forEach((a) => {
        pauseLabels[a] = angleMeasure(a) + "\u00B0";
      });
      setDegreeLabels(pauseLabels);

      setCoInteriorCopies(
        (prev) =>
          prev && {
            ...prev,
            tx: 0,
            ty: 0,
            bx: 0,
            by: 0,
            topLabel: {
              text: angleMeasure(topId) + "\u00B0",
              lr: LABEL_R * 0.55,
              fontSize: LABEL_FS_SMALL,
              hide: false,
            },
            botLabel: {
              text: angleMeasure(botId) + "\u00B0",
              lr: LABEL_R * 0.55,
              fontSize: LABEL_FS_SMALL,
              hide: false,
            },
          },
      );
    });

    tl.to({}, { duration: 0.6 });

    tl.add(smoothRestoreHighlights());

    tl.add(fadeOutCoInteriorCopies());
    tl.call(() => {
      setCoInteriorCopies(null);
      const allLabels = {};
      newGreyedResult.forEach((a) => {
        allLabels[a] = angleMeasure(a) + "\u00B0";
      });
      setDegreeLabels(allLabels);
      setHiddenNumbers(false);
      finishPairInteraction(
        pairType,
        newGreyedResult,
        APP_DATA[pairType].feedback,
        [topId, botId],
      );
    });
  };

  /* ═══════════════════════════════════════════════════
     LINEAR PAIR HANDLER
     ═══════════════════════════════════════════════════ */
  const handleLinearClick = (id) => {
    animatingRef.current = true;
    playSnd("click");
    beginPairExploration();
    enterSemicirclePhase();
    setAnglesClickable([]);
    const pair = LINEAR_PAIRS[id];
    const pairKey = id + "," + pair;
    const info = LINEAR_PAIR_INFO[pairKey];
    if (!info) {
      animatingRef.current = false;
      semicirclePhaseRef.current = false;
      return;
    }
    activePairRef.current = { a: id, b: pair };

    fadeOutTexts();

    const revivedGreyed = greyedAnglesRef.current.filter(
      (a) => a !== id && a !== pair,
    );
    setGreyedAngles(revivedGreyed);

    const keepAngles = [id, pair];
    const keepLines = [...info.shared, ...info.line];
    setDehiAngles(
      [1, 2, 3, 4, 5, 6, 7, 8].filter((a) => !keepAngles.includes(a)),
    );
    setDehiLines(LINE_KEYS.filter((k) => !keepLines.includes(k)));
    setHiddenNumbers(true);
    setSmallLabels(false);
    const linearLabels = {};
    revivedGreyed.forEach((a) => {
      linearLabels[a] = angleMeasure(a) + "\u00B0";
    });
    linearLabels[id] = angleMeasure(id) + "\u00B0";
    linearLabels[pair] = angleMeasure(pair) + "\u00B0";
    setDegreeLabels(linearLabels);

    const pt = POINT_OF[id];
    const cx = pt === "A" ? AX : BX,
      cy = pt === "A" ? AY : BY;

    const tl = gsap.timeline();
    tl.to({}, { duration: 0.4 });

    const blinkSel = [id, pair]
      .map((a) => ".angle-group-" + a + " path")
      .join(", ");
    tl.to(blinkSel, {
      fillOpacity: 0.15,
      duration: 0.2,
      yoyo: true,
      repeat: 5,
    });

    tl.to({}, { duration: 0.3 });

    tl.call(() => {
      const arcData = {
        cx,
        cy,
        start: info.arc.start,
        end: info.arc.start,
        finalEnd: info.arc.end,
      };
      arcAnimRef.current = arcData;
      setArcAnim(arcData);
      const ap = { a: info.arc.start };
      gsap.to(ap, {
        a: info.arc.end,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () =>
          setArcAnim((prev) => {
            if (!prev) return prev;
            const next = { ...prev, end: ap.a };
            arcAnimRef.current = next;
            return next;
          }),
        onComplete: () => {
          enableArcInteraction(APP_DATA.linear.navTextWait);
        },
      });
    });
  };

  const handleLinearResultClick = () => {
    if (!arcClickable) return;
    if (!selectedCardRef.current) return;
    const isLinear = selectedCardRef.current === "linear";
    const isCoInt = selectedCardRef.current === "coInterior";
    const isCoExt = selectedCardRef.current === "coExterior";
    if (isCoInt) {
      handleCoPairResultClick("coInterior");
      return;
    }
    if (isCoExt) {
      handleCoPairResultClick("coExterior");
      return;
    }
    if (!isLinear) return;

    animatingRef.current = true;
    setArcClickable(false);
    playSnd("click");
    fadeOutTexts();

    const ap = activePairRef.current;
    if (!ap || !arcAnim) {
      animatingRef.current = false;
      return;
    }
    const clickedId = ap.a,
      pairId = ap.b;
    const ids = [clickedId, pairId];

    const arcData = arcAnim;
    const midAng = (arcData.start + arcData.finalEnd) / 2;
    const mergePos = polarToXY(
      arcData.cx,
      arcData.cy,
      LINEAR_ARC_R + 35,
      midAng,
    );

    const labelStarts = ids.map((id) => {
      const a = angleDataOf(id);
      const p = labelPosAt(a.cx, a.cy, a.start, a.end, LABEL_R);
      return { id, x: p.x, y: p.y, text: angleMeasure(id) + "\u00B0" };
    });

    setDegreeLabels({});
    setDegreeLabelStyle(null);
    setFloatingDegreeLabels(
      labelStarts.map((s) => ({
        key: String(s.id),
        x: s.x,
        y: s.y,
        text: s.text,
        fontSize: LABEL_FS_LARGE,
        opacity: 1,
      })),
    );

    const tl = gsap.timeline();
    const mergeProxy = { t: 0 };

    tl.to(mergeProxy, {
      t: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = mergeProxy.t;
        setFloatingDegreeLabels(
          labelStarts.map((s) => ({
            key: String(s.id),
            text: s.text,
            fontSize: LABEL_FS_LARGE,
            x: s.x + (mergePos.x - s.x) * t,
            y: s.y + (mergePos.y - s.y) * t,
            opacity: 1 - t,
          })),
        );
        if (t > 0.75) {
          setFloatingLabel({
            text: "180\u00B0",
            x: mergePos.x,
            y: mergePos.y,
            opacity: (t - 0.75) / 0.25,
          });
        }
      },
      onComplete: () => {
        setFloatingDegreeLabels([]);
        setFloatingLabel({
          text: "180\u00B0",
          x: mergePos.x,
          y: mergePos.y,
          opacity: 1,
        });
      },
    });

    const blinkProxy = { op: 1 };
    tl.to(blinkProxy, {
      op: 0.2,
      duration: 0.2,
      yoyo: true,
      repeat: 5,
      onUpdate: () => {
        setFloatingLabel((prev) => prev && { ...prev, opacity: blinkProxy.op });
      },
    });
    tl.call(() => setFloatingLabel((prev) => prev && { ...prev, opacity: 1 }));

    tl.to({}, { duration: 0.5 });

    tl.call(() => {
      setFloatingLabel(null);
      setArcAnim(null);
      setFloatingDegreeLabels(
        ids.map((id) => {
          const a = angleDataOf(id);
          const dest = labelPosAt(a.cx, a.cy, a.start, a.end, LABEL_R * 0.55);
          return {
            key: String(id),
            x: mergePos.x,
            y: mergePos.y,
            text: angleMeasure(id) + "\u00B0",
            fontSize: LABEL_FS_SMALL,
            opacity: 0,
            destX: dest.x,
            destY: dest.y,
          };
        }),
      );
    });

    const returnProxy = { t: 0 };
    tl.to(returnProxy, {
      t: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => {
        const t = returnProxy.t;
        setFloatingDegreeLabels(
          ids.map((id) => {
            const a = angleDataOf(id);
            const dest = labelPosAt(a.cx, a.cy, a.start, a.end, LABEL_R * 0.55);
            return {
              key: String(id),
              text: angleMeasure(id) + "\u00B0",
              fontSize: LABEL_FS_SMALL,
              x: mergePos.x + (dest.x - mergePos.x) * t,
              y: mergePos.y + (dest.y - mergePos.y) * t,
              opacity: t,
            };
          }),
        );
      },
    });

    let newGreyedResult = [];
    tl.call(() => {
      setFloatingDegreeLabels([]);
      setSmallLabels(true);
      newGreyedResult = [
        ...new Set([...greyedAnglesRef.current, clickedId, pairId]),
      ];
      setGreyedAngles(newGreyedResult);

      const allLabels = {};
      newGreyedResult.forEach((a) => {
        allLabels[a] = angleMeasure(a) + "\u00B0";
      });
      setDegreeLabels(allLabels);
    });

    tl.add(
      smoothRestoreHighlights(() => {
        setHiddenNumbers(false);
        finishPairInteraction(
          "linear",
          newGreyedResult,
          APP_DATA.linear.feedback,
          [clickedId, pairId],
        );
      }),
    );
  };

  /* ═══════════════════════════════════════════════════
     RENDER: SVG DEFS
     ═══════════════════════════════════════════════════ */
  const renderDefs = () =>
    h(
      "defs",
      null,
      mkr("a-yel-s", COL_PARALLEL, true),
      mkr("a-yel-e", COL_PARALLEL, false),
      mkr("a-cyn-s", COL_TRANS, true),
      mkr("a-cyn-e", COL_TRANS, false),
      mkr("a-gry-s", "#555", true),
      mkr("a-gry-e", "#555", false),
      h(
        "marker",
        {
          id: "a-wht-e",
          viewBox: "0 0 10 10",
          refX: "8",
          refY: "5",
          markerWidth: "5",
          markerHeight: "5",
          orient: "auto",
        },
        h("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "white" }),
      ),
    );

  /* ═══════════════════════════════════════════════════
     RENDER: LINES
     ═══════════════════════════════════════════════════ */
  const renderLines = () =>
    h(
      "g",
      null,
      LINE_KEYS.map((key) => {
        const ln = LINES[key];
        const dehi = dehiLines.includes(key);
        return h(
          "g",
          {
            key,
            className: "line-segment line-" + key + (dehi ? " dehi" : ""),
          },
          h("line", {
            x1: ln.x1,
            y1: ln.y1,
            x2: ln.x2,
            y2: ln.y2,
            stroke: ln.color,
            strokeWidth: 3,
            markerStart: ln.ms,
            markerEnd: ln.me,
          }),
        );
      }),
    );

  /* ═══════════════════════════════════════════════════
     RENDER: ANGLES
     ═══════════════════════════════════════════════════ */
  const renderAngles = () => {
    if (!showAngles) return null;
    return h(
      "g",
      null,
      ANGLE_DATA.map((a) => {
        const dehi = dehiAngles.includes(a.id);
        const grey = greyedAngles.includes(a.id);
        const isArcTarget =
          arcClickable &&
          activePairRef.current &&
          (a.id === activePairRef.current.a ||
            a.id === activePairRef.current.b);
        const clickable =
          (anglesClickable.includes(a.id) && !animatingRef.current) ||
          isArcTarget;
        const col = grey ? COL_GREY : angleColor(a.id);
        const mid = (a.start + a.end) / 2;
        const arcR = angleRadii ? angleRadii[a.id] : ANG_R;
        const nlp = polarToXY(a.cx, a.cy, LABEL_R, mid);
        const labelSmall = grey || smallLabels;
        const dlp = polarToXY(
          a.cx,
          a.cy,
          labelSmall ? LABEL_R * 0.55 : LABEL_R,
          mid,
        );
        const hasDegreeLbl = degreeLabels[a.id];
        const styled = degreeLabelStyle && degreeLabelStyle[a.id];
        const showNumber =
          mode !== "initialAnim" && !hiddenNumbers && !hasDegreeLbl;
        const useBlinkClass = CLONE_PAIR_CARDS.includes(selectedCard) && !grey;

        return h(
          "g",
          {
            key: "ang-" + a.id,
            className:
              "angle-group angle-group-" +
              a.id +
              (dehi ? " dehi" : "") +
              (grey ? " grey" : "") +
              (clickable ? " clickable" : ""),
            onClick: clickable ? () => handleAngleClick(a.id) : undefined,
          },
          h("path", {
            d: arcPath(a.cx, a.cy, arcR, a.start, a.end),
            fill: col,
            fillOpacity: grey ? 0.4 : 0.7,
          }),
          showNumber &&
            h(
              "text",
              {
                x: nlp.x,
                y: nlp.y,
                className: "angle-number " + (a.id % 2 === 1 ? "odd" : "even"),
              },
              String(a.id),
            ),
          hasDegreeLbl &&
            !styled &&
            h(
              "text",
              {
                x: dlp.x,
                y: dlp.y,
                className:
                  "degree-label" +
                  (labelSmall ? " small" : "") +
                  (useBlinkClass ? " vblink-label" : ""),
              },
              hasDegreeLbl,
            ),
          styled &&
            h(
              "text",
              {
                x: styled.x,
                y: styled.y,
                fill: "white",
                fontSize: styled.fontSize,
                fontWeight: "bold",
                textAnchor: "middle",
                dominantBaseline: "central",
                opacity: styled.opacity != null ? styled.opacity : 1,
                className:
                  "degree-label" + (useBlinkClass ? " vblink-label" : ""),
              },
              hasDegreeLbl,
            ),
        );
      }),
    );
  };

  const renderCloneAngle = () => {
    if (!cloneAngle) return null;
    const { cx, cy, r, start, end, rot, color, labelText, labelX, labelY } =
      cloneAngle;
    const d = arcPath(cx, cy, r, start, end);
    return h(
      "g",
      null,
      h(
        "g",
        {
          style: {
            transform: "rotate(" + rot + "deg)",
            transformOrigin: cx + "px " + cy + "px",
          },
        },
        h("path", { d, fill: color, fillOpacity: 0.5 }),
      ),
      labelX !== 0 &&
        h(
          "text",
          { x: labelX, y: labelY, className: "clone-label vblink-label" },
          labelText,
        ),
    );
  };

  const renderArc = () => {
    if (!arcAnim) return null;
    const arcR = selectedCardRef.current === "linear" ? LINEAR_ARC_R : ARC_R;
    const d = lineArcPath(
      arcAnim.cx,
      arcAnim.cy,
      arcR,
      arcAnim.start,
      arcAnim.end,
    );
    return h(
      "g",
      {
        className:
          "semicircle-arc" + (arcClickable ? " semicircle-arc-active" : ""),
        onClick: arcClickable ? () => handleArcResultClick() : undefined,
      },
      h("path", {
        d,
        fill: "none",
        stroke: "transparent",
        strokeWidth: 24,
        pointerEvents: "stroke",
        className: "semicircle-arc-hit",
      }),
      h("path", {
        d,
        fill: "none",
        stroke: "white",
        strokeWidth: 3,
        markerEnd: "url(#a-wht-e)",
        pointerEvents: "none",
        className: "semicircle-arc-visible",
      }),
    );
  };

  const renderArcPairHits = () => {
    if (!arcClickable || !activePairRef.current) return null;
    if (
      selectedCardRef.current === "coInterior" ||
      selectedCardRef.current === "coExterior"
    ) {
      if (!coInteriorCopies) return null;
      const c = coInteriorCopies;
      const hits = [
        { angle: c.topAngle, tx: c.tx, ty: c.ty },
        { angle: c.botAngle, tx: c.bx, ty: c.by },
      ];
      return h(
        "g",
        { className: "arc-pair-hits" },
        hits.map((hit, i) =>
          h(
            "g",
            {
              key: "co-hit-" + i,
              transform: "translate(" + hit.tx + " " + hit.ty + ")",
            },
            h("path", {
              d: arcPath(
                hit.angle.cx,
                hit.angle.cy,
                ANG_R,
                hit.angle.start,
                hit.angle.end,
              ),
              fill: "rgba(0,0,0,0.001)",
              className: "clickable",
              onClick: () => handleArcResultClick(),
            }),
          ),
        ),
      );
    }
    const ids = [activePairRef.current.a, activePairRef.current.b];
    return h(
      "g",
      { className: "arc-pair-hits" },
      ids.map((id) => {
        const a = angleDataOf(id);
        return h("path", {
          key: "arc-hit-" + id,
          d: arcPath(a.cx, a.cy, ANG_R, a.start, a.end),
          fill: "rgba(0,0,0,0.001)",
          className: "clickable",
          onClick: () => handleArcResultClick(),
        });
      }),
    );
  };

  const renderFloatingDegreeLabels = () => {
    if (!floatingDegreeLabels.length) return null;
    return h(
      "g",
      null,
      floatingDegreeLabels.map((lbl) =>
        h(
          "text",
          {
            key: lbl.key,
            x: lbl.x,
            y: lbl.y,
            fill: "white",
            fontSize: lbl.fontSize || LABEL_FS_LARGE,
            fontWeight: "bold",
            textAnchor: "middle",
            dominantBaseline: "central",
            opacity: lbl.opacity != null ? lbl.opacity : 1,
            className: "degree-label",
          },
          lbl.text,
        ),
      ),
    );
  };

  const renderFloatingLabel = () => {
    if (!floatingLabel) return null;
    return h(
      "text",
      {
        x: floatingLabel.x,
        y: floatingLabel.y,
        fill: "white",
        fontSize: 28,
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "central",
        opacity: floatingLabel.opacity,
      },
      floatingLabel.text,
    );
  };

  const renderCoInteriorCopies = () => {
    if (!coInteriorCopies) return null;
    const c = coInteriorCopies;
    const isCoExt = c.variant === "coExterior";
    const topA = c.topAngle,
      botA = c.botAngle;
    const topLr = c.topLabel.lr != null ? c.topLabel.lr : LABEL_R;
    const botLr = c.botLabel.lr != null ? c.botLabel.lr : LABEL_R;
    const topLp = labelPosAt(topA.cx, topA.cy, topA.start, topA.end, topLr);
    const botLp = labelPosAt(botA.cx, botA.cy, botA.start, botA.end, botLr);

    const renderLine = (ray) =>
      h("line", {
        x1: ray.x1,
        y1: ray.y1,
        x2: ray.x2,
        y2: ray.y2,
        stroke: ray.color,
        strokeWidth: 3,
        markerStart: ray.ms,
        markerEnd: ray.me,
      });

    return h(
      "g",
      { className: "co-interior-copies" },
      isCoExt &&
        h(
          "g",
          { className: "co-exterior-fixed-trans" },
          renderLine(LINES.transversalTop),
          renderLine(LINES.transversalBot),
        ),
      h(
        "g",
        { transform: "translate(" + c.tx + " " + c.ty + ")" },
        h("path", {
          d: arcPath(topA.cx, topA.cy, ANG_R, topA.start, topA.end),
          fill: topA.color,
          fillOpacity: 0.7,
          className: arcClickable ? "clickable" : "",
          onClick: arcClickable ? () => handleArcResultClick() : undefined,
        }),
        renderLine(c.topRay),
        !c.topLabel.hide &&
          h(
            "text",
            {
              x: topLp.x,
              y: topLp.y,
              fill: "white",
              fontSize: c.topLabel.fontSize || LABEL_FS_LARGE,
              fontWeight: "bold",
              textAnchor: "middle",
              dominantBaseline: "central",
              className: "degree-label",
            },
            c.topLabel.text,
          ),
      ),
      h(
        "g",
        { transform: "translate(" + c.bx + " " + c.by + ")" },
        h("path", {
          d: arcPath(botA.cx, botA.cy, ANG_R, botA.start, botA.end),
          fill: botA.color,
          fillOpacity: 0.7,
          className: arcClickable ? "clickable" : "",
          onClick: arcClickable ? () => handleArcResultClick() : undefined,
        }),
        renderLine(c.botRay),
        !c.botLabel.hide &&
          h(
            "text",
            {
              x: botLp.x,
              y: botLp.y,
              fill: "white",
              fontSize: c.botLabel.fontSize || LABEL_FS_LARGE,
              fontWeight: "bold",
              textAnchor: "middle",
              dominantBaseline: "central",
              className: "degree-label",
            },
            c.botLabel.text,
          ),
      ),
    );
  };

  /* ═══════════════════════════════════════════════════
     RENDER: GALLERY CARDS (using image assets)
     ═══════════════════════════════════════════════════ */
  const renderCards = () =>
    CARD_KEYS.map((key, i) => {
      const isSelected = selectedCard === key;
      const isVisited = visitedCards.includes(key);
      const cardsLocked =
        inStrip || mode === "completed" || showSummaryTitles;
      let cls = "gallery-card";
      if (inStrip) cls += " in-strip";
      if (mode === "completed" || showSummaryTitles) cls += " summary-locked";
      if (isVisited) {
        if (PAIR_EQUAL.includes(key)) cls += " visited-pair-equal";
        else if (PAIR_SUM_180.includes(key)) cls += " visited-pair-sum-180";
      }
      if (isSelected) cls += " selected";

      return h(
        "div",
        {
          key,
          "data-card-key": key,
          ref: (el) => (cardRefs.current[i] = el),
          className: cls,
          onClick: cardsLocked ? undefined : () => handleCardClick(key, i),
          style: {
            position: "absolute",
            cursor: cardsLocked ? "default" : "pointer",
          },
        },
        h(
          "div",
          { className: "card-thumb" },
          h("img", { src: CARD_IMAGES[key], alt: APP_DATA.cards[key] }),
        ),
        h("div", { className: "card-label" }, APP_DATA.cards[key]),
      );
    });

  const renderSummaryTitles = () => {
    if (!showSummaryTitles) return null;
    return h(
      React.Fragment,
      null,
      h(
        "div",
        { className: "summary-row-title summary-row-title-top" },
        APP_DATA.gallery.equalRowTitle,
      ),
      h(
        "div",
        { className: "summary-row-title summary-row-title-bottom" },
        APP_DATA.gallery.sum180RowTitle,
      ),
    );
  };

  const renderFeedback = () => {
    if (!feedbackText) return null;
    const cls =
      "feedback-box" +
      (feedbackPositionClass ? " " + feedbackPositionClass : "");
    return h("div", { className: cls }, feedbackText);
  };

  /* ═══════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════ */
  return h(
    "div",
    { className: "main-canvas-container" },
    h(
      "div",
      {
        className:
          "diagram-layer" +
          (mode === "initialAnim" && !initialAnimReady
            ? " initial-anim-pending"
            : "") +
          (mode === "initialAnim" ? " initial-anim-active" : ""),
        style: { opacity: diagramOpacity },
      },
      h(
        "svg",
        { className: "diagram-svg", viewBox: "0 0 800 500", ref: svgRef },
        renderDefs(),
        renderLines(),
        renderAngles(),
        renderCloneAngle(),
        renderCoInteriorCopies(),
        renderArc(),
        renderArcPairHits(),
        renderFloatingDegreeLabels(),
        renderFloatingLabel(),
      ),
    ),
    galleryBgVisible &&
      h("div", { className: "gallery-bg", ref: galleryBgRef }),
    renderSummaryTitles(),
    renderCards(),
    renderFeedback(),
  );
};
