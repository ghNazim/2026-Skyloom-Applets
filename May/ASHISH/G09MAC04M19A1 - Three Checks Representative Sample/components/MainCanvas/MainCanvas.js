var SVG_W = 760;
var POP_SVG_H = 400;
var SAM_SVG_H = 270;
var ML = 70;
var MR = 16;
var MT = 12;
var MB = 58;
var XMIN = 0;
var XMAX = 12.7;
var AXIS_LABEL_SIZE = 24;
var Y_TICK_STROKE = 2.4;

function toData(values) {
  var out = [];
  for (var i = 0; i < values.length; i++) {
    out.push({ x: i + 1, y: values[i] });
  }
  return out;
}

function dataRange(values) {
  var min = null;
  var max = null;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > 0) {
      var x = i + 1;
      if (min === null) min = x;
      max = x;
    }
  }
  return { min: min, max: max, result: max - min };
}

function meanStats(values) {
  var bars = [];
  var sumXF = 0;
  var sumF = 0;
  for (var i = 0; i < values.length; i++) {
    var f = values[i];
    if (!f) continue;
    var x = i + 1;
    bars.push({ x: x, f: f, xf: x * f });
    sumXF += x * f;
    sumF += f;
  }
  return {
    bars: bars,
    sumXF: sumXF,
    sumF: sumF,
    mean: Math.round((sumXF / sumF) * 10) / 10,
  };
}

function fmtNum(val) {
  var s = val === null || val === undefined ? "" : String(val);
  if (typeof current_language !== "undefined" && current_language === "id") {
    // Indonesian: use comma for decimals
    if (s.indexOf(".") !== -1) s = s.replace(/\./g, ",");
  }
  return s;
}

function cloneMeanTerms(terms) {
  return (terms || []).map(function (term) {
    return Object.assign({}, term);
  });
}

function emptyNumTerm(open) {
  return { x: "", f: "", visX: 0, visF: 0, open: !!open };
}

function emptyDenTerm(open) {
  return { f: "", visF: 0, open: !!open };
}

var EMPTY_MEAN_EQ = {
  terms: [],
  t: "",
  visT: 0,
  visInner: 0,
  sumOnly: false,
};

var ARROW_Y_POP = 10.25;
var ARROW_Y_SAMPLE = 4.35;
var GRAPH_HIDE_MS = 450;
var GRAPH_SLIDE_MS = 700;

function graphLayout(svgH, yMax) {
  var pW = SVG_W - ML - MR;
  var pH = svgH - MT - MB;
  var xSc = pW / (XMAX - XMIN);
  var ySc = pH / yMax;
  var barW = Math.round(xSc * 0.64);
  function xP(x) {
    return ML + (x - XMIN) * xSc;
  }
  function yP(y) {
    return MT + (yMax - y) * ySc;
  }
  return {
    pW: pW,
    pH: pH,
    xSc: xSc,
    ySc: ySc,
    barW: barW,
    xP: xP,
    yP: yP,
    baseY: yP(0),
    svgH: svgH,
    yMax: yMax,
  };
}

function getPathPoints(data, layout) {
  var nonzero = data.filter(function (d) {
    return d.y > 0;
  });
  var n = nonzero.length;
  if (n === 0) return [];
  var bars = nonzero.map(function (d) {
    return {
      bl: layout.xP(d.x) - layout.barW / 2,
      br: layout.xP(d.x) + layout.barW / 2,
      bt: layout.yP(d.y),
      h: d.y,
    };
  });
  function pushPt(pts, x, y) {
    var last = pts[pts.length - 1];
    if (!last || last[0] !== x || last[1] !== y) pts.push([x, y]);
  }
  var pts = [];
  var curX = bars[0].bl;
  var curY = bars[0].bt;
  pushPt(pts, curX, curY);
  for (var i = 0; i < n - 1; i++) {
    var b = bars[i];
    var next = bars[i + 1];
    if (next.h > b.h) {
      pushPt(pts, next.bl, next.bt);
      curX = next.bl;
      curY = next.bt;
    } else if (next.h < b.h) {
      if (curX !== b.br || curY !== b.bt) {
        pushPt(pts, b.br, b.bt);
        curX = b.br;
        curY = b.bt;
      }
      pushPt(pts, next.bl, next.bt);
      curX = next.bl;
      curY = next.bt;
    } else {
      pushPt(pts, next.bl, next.bt);
      curX = next.bl;
      curY = next.bt;
    }
  }
  var lastBar = bars[n - 1];
  if (curX !== lastBar.br || curY !== lastBar.bt) {
    pushPt(pts, lastBar.br, lastBar.bt);
  }
  return pts;
}

function ptsToPathD(pts) {
  if (!pts.length) return "";
  return (
    "M " +
    pts[0][0] +
    " " +
    pts[0][1] +
    pts
      .slice(1)
      .map(function (p) {
        return " L " + p[0] + " " + p[1];
      })
      .join("")
  );
}

function fillPathD(pts, baseY) {
  if (!pts.length) return "";
  var first = pts[0];
  var last = pts[pts.length - 1];
  return (
    "M " +
    first[0] +
    " " +
    baseY +
    pts
      .map(function (p) {
        return " L " + p[0] + " " + p[1];
      })
      .join("") +
    " L " +
    last[0] +
    " " +
    baseY +
    " Z"
  );
}

function originRect(svgEl) {
  if (!svgEl) return null;
  var origin = svgEl.querySelector(".plot-origin");
  return origin
    ? origin.getBoundingClientRect()
    : svgEl.getBoundingClientRect();
}

function pixelsPerY(svgEl) {
  if (!svgEl) return 1;
  var origin = svgEl.querySelector(".plot-origin");
  var unit = svgEl.querySelector(".plot-y-unit");
  if (!origin || !unit) return 1;
  return Math.abs(
    origin.getBoundingClientRect().top - unit.getBoundingClientRect().top,
  );
}

const MainCanvas = (props) => {
  var step = props.step;
  var startAtFinal = props.startAtFinal;
  var onSetNextEnabled = props.onSetNextEnabled;
  var onSetNavLocked = props.onSetNavLocked;
  var onUpdateNavText = props.onUpdateNavText;
  var onUpdateQuestionText = props.onUpdateQuestionText;
  var onSelectTest = props.onSelectTest;
  var remainingTests = props.remainingTests || [];
  var completedTests = props.completedTests || [];

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useLayoutEffect = React.useLayoutEffect;
  var useRef = React.useRef;
  var e = React.createElement;

  var copy = APP_DATA;
  var stepCopy = copy.steps[step] || {};
  var btns = copy.buttons;
  var colors = GRAPH_COLORS;
  var PATH_W = colors.pathStrokeWidth;

  var popData = toData(GRAPH_DATA.population);
  var s1Data = toData(GRAPH_DATA.sample1);
  var s2Data = toData(GRAPH_DATA.sample2);

  var popLayout = graphLayout(POP_SVG_H, GRAPH_DATA.popYRange.max);
  var samLayout = graphLayout(SAM_SVG_H, GRAPH_DATA.sampleYRange.max);

  var RANGE_CFG = {
    pop: {
      id: "pop",
      graph: "left",
      hideSample: true,
      hidePop: false,
      min: dataRange(GRAPH_DATA.population).min,
      max: dataRange(GRAPH_DATA.population).max,
      result: dataRange(GRAPH_DATA.population).result,
      arrow: "#8fd4ee",
      vline: "#7ee7f2",
      valueFill: "#1d4e89",
      resultClass: "result-blue",
    },
    s1: {
      id: "s1",
      graph: "left",
      hideSample: false,
      hidePop: true,
      min: dataRange(GRAPH_DATA.sample1).min,
      max: dataRange(GRAPH_DATA.sample1).max,
      result: dataRange(GRAPH_DATA.sample1).result,
      arrow: "#f07090",
      vline: "#ff9ec8",
      valueFill: "#c4455c",
      resultClass: "result-s1",
    },
    s2: {
      id: "s2",
      graph: "right",
      hideSample: false,
      hidePop: true,
      min: dataRange(GRAPH_DATA.sample2).min,
      max: dataRange(GRAPH_DATA.sample2).max,
      result: dataRange(GRAPH_DATA.sample2).result,
      arrow: "#f0a030",
      vline: "#ffe066",
      valueFill: "#c4841a",
      resultClass: "result-s2",
    },
  };

  var popMean = meanStats(GRAPH_DATA.population);
  var s1Mean = meanStats(GRAPH_DATA.sample1);
  var s2Mean = meanStats(GRAPH_DATA.sample2);
  var MEAN_CFG = {
    pop: {
      id: "pop",
      graph: "left",
      hideSample: true,
      hidePop: false,
      bars: popMean.bars,
      sumXF: popMean.sumXF,
      sumF: popMean.sumF,
      mean: popMean.mean,
      line: "#7ee7f2",
      valueFill: "#1d4e89",
      resultClass: "result-blue",
      bright: "#7ec8e3",
    },
    s1: {
      id: "s1",
      graph: "left",
      hideSample: false,
      hidePop: true,
      bars: s1Mean.bars,
      sumXF: s1Mean.sumXF,
      sumF: s1Mean.sumF,
      mean: s1Mean.mean,
      line: "#ff9ec8",
      valueFill: "#c4455c",
      resultClass: "result-s1",
      bright: "#ff8aa0",
    },
    s2: {
      id: "s2",
      graph: "right",
      hideSample: false,
      hidePop: true,
      bars: s2Mean.bars,
      sumXF: s2Mean.sumXF,
      sumF: s2Mean.sumF,
      mean: s2Mean.mean,
      line: "#ffe066",
      valueFill: "#c4841a",
      resultClass: "result-s2",
      bright: "#ffd166",
    },
  };

  var popPts = getPathPoints(popData, popLayout);
  var s1Pts = getPathPoints(s1Data, popLayout);
  var s2Pts = getPathPoints(s2Data, popLayout);
  var popPathD = ptsToPathD(popPts);
  var s1PathD = ptsToPathD(s1Pts);
  var s2PathD = ptsToPathD(s2Pts);
  var popFillD = fillPathD(popPts, popLayout.baseY);
  var s1FillD = fillPathD(s1Pts, popLayout.baseY);
  var s2FillD = fillPathD(s2Pts, popLayout.baseY);

  var isStep2 = step === 2;
  var isA1 = step === "A1";
  var isA2 = step === "A2";
  var isA3 = step === "A3";
  var isC1 = step === "C1";
  var isC2 = step === "C2";
  var isC3 = step === "C3";
  var isB1 = step === "B1";
  var isB2 = step === "B2";
  var isB3 = step === "B3";
  var isStep3 = step === 3;
  var isMcqStep = isA2 || isC2 || isB2;
  var showOverlapDefault =
    startAtFinal ||
    isA1 ||
    isA2 ||
    isA3 ||
    isC1 ||
    isC2 ||
    isC3 ||
    isB1 ||
    isB2 ||
    isB3 ||
    isStep3 ||
    (isStep2 && startAtFinal);

  var _leftPop = useState(step !== 1 && showOverlapDefault);
  var leftPopVisible = _leftPop[0];
  var setLeftPopVisible = _leftPop[1];

  var _intro = useState(step === 1 || (isStep2 && !startAtFinal));
  var showIntro = _intro[0];
  var setShowIntro = _intro[1];

  var _samples = useState(step === 1 || (isStep2 && !startAtFinal));
  var showSamplesPanel = _samples[0];
  var setShowSamplesPanel = _samples[1];

  var _overlap = useState(showOverlapDefault);
  var showOverlap = _overlap[0];
  var setShowOverlap = _overlap[1];

  var _buttons = useState(
    (isStep2 && startAtFinal) ||
      isA1 ||
      isA2 ||
      isA3 ||
      isC1 ||
      isC2 ||
      isC3 ||
      isB1 ||
      isB2 ||
      isB3 ||
      isStep3,
  );
  var showButtonRows = _buttons[0];
  var setShowButtonRows = _buttons[1];

  var _mainNudges = useState(false);
  var showMainNudges = _mainNudges[0];
  var setShowMainNudges = _mainNudges[1];

  var _pendingExplored = useState(null);
  var pendingExplored = _pendingExplored[0];
  var setPendingExplored = _pendingExplored[1];

  var _drawNudges = useState(false);
  var showDrawNudges = _drawNudges[0];
  var setShowDrawNudges = _drawNudges[1];

  var _drawnPop = useState((isA1 && startAtFinal) || isA2);
  var drawnPop = _drawnPop[0];
  var setDrawnPop = _drawnPop[1];
  var _drawnS1 = useState((isA1 && startAtFinal) || isA2);
  var drawnS1 = _drawnS1[0];
  var setDrawnS1 = _drawnS1[1];
  var _drawnS2 = useState((isA1 && startAtFinal) || isA2);
  var drawnS2 = _drawnS2[0];
  var setDrawnS2 = _drawnS2[1];

  var _drawReady = useState(false);
  var drawReady = _drawReady[0];
  var setDrawReady = _drawReady[1];

  var _drawing = useState(false);
  var isDrawing = _drawing[0];
  var setIsDrawing = _drawing[1];

  var _drawFocus = useState(null);
  var drawFocus = _drawFocus[0];
  var setDrawFocus = _drawFocus[1];

  var _mcqTarget = useState(isMcqStep && startAtFinal ? "done" : "s1");
  var mcqTarget = _mcqTarget[0];
  var setMcqTarget = _mcqTarget[1];

  var _s1Sel = useState(isMcqStep && startAtFinal ? "fail" : null);
  var s1Selected = _s1Sel[0];
  var setS1Selected = _s1Sel[1];
  var _s2Sel = useState(isMcqStep && startAtFinal ? "pass" : null);
  var s2Selected = _s2Sel[0];
  var setS2Selected = _s2Sel[1];

  var _s1Retry = useState(false);
  var s1Retry = _s1Retry[0];
  var setS1Retry = _s1Retry[1];
  var _s2Retry = useState(false);
  var s2Retry = _s2Retry[0];
  var setS2Retry = _s2Retry[1];

  var _s1Lock = useState(!!(isMcqStep && startAtFinal));
  var s1Locked = _s1Lock[0];
  var setS1Locked = _s1Lock[1];
  var _s2Lock = useState(!!(isMcqStep && startAtFinal));
  var s2Locked = _s2Lock[0];
  var setS2Locked = _s2Lock[1];

  var _fb = useState(null);
  var feedbackSide = _fb[0];
  var setFeedbackSide = _fb[1];

  var _s1Box = useState(
    !!(isA2 && startAtFinal) ||
      isA3 ||
      isStep3 ||
      completedTests.indexOf("shape") !== -1,
  );
  var showShapeS1Box = _s1Box[0];
  var setShowShapeS1Box = _s1Box[1];
  var _s2Box = useState(
    !!(isA2 && startAtFinal) ||
      isA3 ||
      isStep3 ||
      completedTests.indexOf("shape") !== -1,
  );
  var showShapeS2Box = _s2Box[0];
  var setShowShapeS2Box = _s2Box[1];

  var _busy = useState(false);
  var mcqBusy = _busy[0];
  var setMcqBusy = _busy[1];

  var _hideSampleSources = useState(false);
  var hideSampleSources = _hideSampleSources[0];
  var setHideSampleSources = _hideSampleSources[1];

  var c1Final = isC1 && startAtFinal;
  var rangeDoneInit = c1Final || isC2 || isC3;

  var _centerLeft = useState(false);
  var centerLeft = _centerLeft[0];
  var setCenterLeft = _centerLeft[1];
  var _centerRight = useState(false);
  var centerRight = _centerRight[0];
  var setCenterRight = _centerRight[1];
  var _hideLeftGraph = useState(false);
  var hideLeftGraph = _hideLeftGraph[0];
  var setHideLeftGraph = _hideLeftGraph[1];
  var _hideRightGraph = useState(false);
  var hideRightGraph = _hideRightGraph[0];
  var setHideRightGraph = _hideRightGraph[1];
  var _hideLeftSample = useState(false);
  var hideLeftSample = _hideLeftSample[0];
  var setHideLeftSample = _hideLeftSample[1];
  var _hideRightSample = useState(false);
  var hideRightSample = _hideRightSample[0];
  var setHideRightSample = _hideRightSample[1];

  var _rangeActive = useState(null);
  var rangeActive = _rangeActive[0];
  var setRangeActive = _rangeActive[1];
  var _rangePending = useState(null);
  var rangePending = _rangePending[0];
  var setRangePending = _rangePending[1];
  var _rangeStage = useState("idle");
  var rangeStage = _rangeStage[0];
  var setRangeStage = _rangeStage[1];
  var _rangeBusy = useState(false);
  var rangeBusy = _rangeBusy[0];
  var setRangeBusy = _rangeBusy[1];
  var _highClicked = useState(false);
  var highClicked = _highClicked[0];
  var setHighClicked = _highClicked[1];
  var _lowClicked = useState(false);
  var lowClicked = _lowClicked[0];
  var setLowClicked = _lowClicked[1];
  var _highValue = useState(null);
  var highValue = _highValue[0];
  var setHighValue = _highValue[1];
  var _lowValue = useState(null);
  var lowValue = _lowValue[0];
  var setLowValue = _lowValue[1];
  var _showAnswerSlot = useState(false);
  var showAnswerSlot = _showAnswerSlot[0];
  var setShowAnswerSlot = _showAnswerSlot[1];
  var _answerFlipped = useState(false);
  var answerFlipped = _answerFlipped[0];
  var setAnswerFlipped = _answerFlipped[1];
  var _rangeCollapsed = useState(false);
  var rangeCollapsed = _rangeCollapsed[0];
  var setRangeCollapsed = _rangeCollapsed[1];
  var _rangeReady = useState(false);
  var rangeReady = _rangeReady[0];
  var setRangeReady = _rangeReady[1];
  var _showRangeNudges = useState(false);
  var showRangeNudges = _showRangeNudges[0];
  var setShowRangeNudges = _showRangeNudges[1];
  var _showHighNudge = useState(false);
  var showHighNudge = _showHighNudge[0];
  var setShowHighNudge = _showHighNudge[1];
  var _showLowNudge = useState(false);
  var showLowNudge = _showLowNudge[0];
  var setShowLowNudge = _showLowNudge[1];
  var _showAnswerNudge = useState(false);
  var showAnswerNudge = _showAnswerNudge[0];
  var setShowAnswerNudge = _showAnswerNudge[1];

  var _rangeGone = useState({
    pop: rangeDoneInit,
    s1: rangeDoneInit,
    s2: rangeDoneInit,
  });
  var rangeGone = _rangeGone[0];
  var setRangeGone = _rangeGone[1];
  var _rangeCompleted = useState({
    pop: rangeDoneInit,
    s1: rangeDoneInit,
    s2: rangeDoneInit,
  });
  var rangeCompleted = _rangeCompleted[0];
  var setRangeCompleted = _rangeCompleted[1];
  var _rangeAllDone = useState(rangeDoneInit);
  var rangeAllDone = _rangeAllDone[0];
  var setRangeAllDone = _rangeAllDone[1];

  var _popArrow = useState({
    left: rangeDoneInit && !isC3,
    right: rangeDoneInit && !isC3,
  });
  var popArrow = _popArrow[0];
  var setPopArrow = _popArrow[1];
  var _popMaxLine = useState({
    left: rangeDoneInit && !isC3,
    right: rangeDoneInit && !isC3,
  });
  var popMaxLine = _popMaxLine[0];
  var setPopMaxLine = _popMaxLine[1];
  var _popMinLine = useState({
    left: rangeDoneInit && !isC3,
    right: rangeDoneInit && !isC3,
  });
  var popMinLine = _popMinLine[0];
  var setPopMinLine = _popMinLine[1];
  var _popLabel = useState({
    left: rangeDoneInit && !isC3 ? RANGE_CFG.pop.result : null,
    right: rangeDoneInit && !isC3 ? RANGE_CFG.pop.result : null,
  });
  var popLabel = _popLabel[0];
  var setPopLabel = _popLabel[1];

  var _s1Arrow = useState(rangeDoneInit && !isC3);
  var s1Arrow = _s1Arrow[0];
  var setS1Arrow = _s1Arrow[1];
  var _s1MaxLine = useState(rangeDoneInit && !isC3);
  var s1MaxLine = _s1MaxLine[0];
  var setS1MaxLine = _s1MaxLine[1];
  var _s1MinLine = useState(rangeDoneInit && !isC3);
  var s1MinLine = _s1MinLine[0];
  var setS1MinLine = _s1MinLine[1];
  var _s1Label = useState(rangeDoneInit && !isC3 ? RANGE_CFG.s1.result : null);
  var s1Label = _s1Label[0];
  var setS1Label = _s1Label[1];

  var _s2Arrow = useState(rangeDoneInit && !isC3);
  var s2Arrow = _s2Arrow[0];
  var setS2Arrow = _s2Arrow[1];
  var _s2MaxLine = useState(rangeDoneInit && !isC3);
  var s2MaxLine = _s2MaxLine[0];
  var setS2MaxLine = _s2MaxLine[1];
  var _s2MinLine = useState(rangeDoneInit && !isC3);
  var s2MinLine = _s2MinLine[0];
  var setS2MinLine = _s2MinLine[1];
  var _s2Label = useState(rangeDoneInit && !isC3 ? RANGE_CFG.s2.result : null);
  var s2Label = _s2Label[0];
  var setS2Label = _s2Label[1];

  var _spreadS1Box = useState(
    !!(isC2 && startAtFinal) ||
      isC3 ||
      isStep3 ||
      completedTests.indexOf("spread") !== -1,
  );
  var showSpreadS1Box = _spreadS1Box[0];
  var setShowSpreadS1Box = _spreadS1Box[1];
  var _spreadS2Box = useState(
    !!(isC2 && startAtFinal) ||
      isC3 ||
      isStep3 ||
      completedTests.indexOf("spread") !== -1,
  );
  var showSpreadS2Box = _spreadS2Box[0];
  var setShowSpreadS2Box = _spreadS2Box[1];

  var b1Final = isB1 && startAtFinal;
  var meanDoneInit = b1Final || isB2 || isB3;

  var _hidePopBars = useState(false);
  var hidePopBars = _hidePopBars[0];
  var setHidePopBars = _hidePopBars[1];
  var _meanActive = useState(null);
  var meanActive = _meanActive[0];
  var setMeanActive = _meanActive[1];
  var _meanPending = useState(null);
  var meanPending = _meanPending[0];
  var setMeanPending = _meanPending[1];
  var _meanStage = useState("idle");
  var meanStage = _meanStage[0];
  var setMeanStage = _meanStage[1];
  var _meanBusy = useState(false);
  var meanBusy = _meanBusy[0];
  var setMeanBusy = _meanBusy[1];
  var _meanReady = useState(false);
  var meanReady = _meanReady[0];
  var setMeanReady = _meanReady[1];
  var _meanNumFlipped = useState(false);
  var meanNumFlipped = _meanNumFlipped[0];
  var setMeanNumFlipped = _meanNumFlipped[1];
  var _meanDenFlipped = useState(false);
  var meanDenFlipped = _meanDenFlipped[0];
  var setMeanDenFlipped = _meanDenFlipped[1];
  var _meanAnsFlipped = useState(false);
  var meanAnsFlipped = _meanAnsFlipped[0];
  var setMeanAnsFlipped = _meanAnsFlipped[1];
  var _meanShowAnswer = useState(false);
  var meanShowAnswer = _meanShowAnswer[0];
  var setMeanShowAnswer = _meanShowAnswer[1];
  var _meanCollapsed = useState(false);
  var meanCollapsed = _meanCollapsed[0];
  var setMeanCollapsed = _meanCollapsed[1];
  var _meanNumDone = useState(false);
  var meanNumDone = _meanNumDone[0];
  var setMeanNumDone = _meanNumDone[1];
  var _meanDenDone = useState(false);
  var meanDenDone = _meanDenDone[0];
  var setMeanDenDone = _meanDenDone[1];
  var _showMeanNudges = useState(false);
  var showMeanNudges = _showMeanNudges[0];
  var setShowMeanNudges = _showMeanNudges[1];
  var _showMeanNumNudge = useState(false);
  var showMeanNumNudge = _showMeanNumNudge[0];
  var setShowMeanNumNudge = _showMeanNumNudge[1];
  var _showMeanDenNudge = useState(false);
  var showMeanDenNudge = _showMeanDenNudge[0];
  var setShowMeanDenNudge = _showMeanDenNudge[1];
  var _showMeanAnsNudge = useState(false);
  var showMeanAnsNudge = _showMeanAnsNudge[0];
  var setShowMeanAnsNudge = _showMeanAnsNudge[1];
  var _meanGone = useState({
    pop: meanDoneInit,
    s1: meanDoneInit,
    s2: meanDoneInit,
  });
  var meanGone = _meanGone[0];
  var setMeanGone = _meanGone[1];
  var _meanAllDone = useState(meanDoneInit);
  var meanAllDone = _meanAllDone[0];
  var setMeanAllDone = _meanAllDone[1];
  var _meanEq = useState(EMPTY_MEAN_EQ);
  var meanEq = _meanEq[0];
  var setMeanEq = _meanEq[1];
  var _meanDenEq = useState(EMPTY_MEAN_EQ);
  var meanDenEq = _meanDenEq[0];
  var setMeanDenEq = _meanDenEq[1];
  var _meanHighlight = useState(null);
  var meanHighlight = _meanHighlight[0];
  var setMeanHighlight = _meanHighlight[1];
  var _meanDimBars = useState(false);
  var meanDimBars = _meanDimBars[0];
  var setMeanDimBars = _meanDimBars[1];
  var _meanGuide = useState(null);
  var meanGuide = _meanGuide[0];
  var setMeanGuide = _meanGuide[1];
  var _meanFiLabels = useState({});
  var meanFiLabels = _meanFiLabels[0];
  var setMeanFiLabels = _meanFiLabels[1];
  var _popMeanMark = useState({
    left: meanDoneInit && !isB3,
    right: meanDoneInit && !isB3,
  });
  var popMeanMark = _popMeanMark[0];
  var setPopMeanMark = _popMeanMark[1];
  var _s1MeanMark = useState(meanDoneInit && !isB3);
  var s1MeanMark = _s1MeanMark[0];
  var setS1MeanMark = _s1MeanMark[1];
  var _s2MeanMark = useState(meanDoneInit && !isB3);
  var s2MeanMark = _s2MeanMark[0];
  var setS2MeanMark = _s2MeanMark[1];
  var _centreS1Box = useState(
    !!(isB2 && startAtFinal) ||
      isB3 ||
      isStep3 ||
      completedTests.indexOf("centre") !== -1,
  );
  var showCentreS1Box = _centreS1Box[0];
  var setShowCentreS1Box = _centreS1Box[1];
  var _centreS2Box = useState(
    !!(isB2 && startAtFinal) ||
      isB3 ||
      isStep3 ||
      completedTests.indexOf("centre") !== -1,
  );
  var showCentreS2Box = _centreS2Box[0];
  var setShowCentreS2Box = _centreS2Box[1];

  var _step3TableVisible = useState(false);
  var step3TableVisible = _step3TableVisible[0];
  var setStep3TableVisible = _step3TableVisible[1];
  var _step3AnimDone = useState(false);
  var step3AnimDone = _step3AnimDone[0];
  var setStep3AnimDone = _step3AnimDone[1];
  var _step3SelectedGraph = useState(null);
  var step3SelectedGraph = _step3SelectedGraph[0];
  var setStep3SelectedGraph = _step3SelectedGraph[1];
  var _step3Feedback = useState(null);
  var step3Feedback = _step3Feedback[0];
  var setStep3Feedback = _step3Feedback[1];
  var _step3Correct = useState(false);
  var step3Correct = _step3Correct[0];
  var setStep3Correct = _step3Correct[1];
  var _step3HideMainBtns = useState(false);
  var step3HideMainBtns = _step3HideMainBtns[0];
  var setStep3HideMainBtns = _step3HideMainBtns[1];

  var step3TableRef = useRef(null);
  var step3ColOverlayRef = useRef(null);
  var step3AnimTriesRef = useRef(0);
  var leftHalfRef = useRef(null);
  var rightHalfRef = useRef(null);

  var introRef = useRef(null);
  var leftSvgRef = useRef(null);
  var rightSvgRef = useRef(null);
  var s1SvgRef = useRef(null);
  var s2SvgRef = useRef(null);

  var leftPopPathRef = useRef(null);
  var leftPopFillRef = useRef(null);
  var leftPopClipRef = useRef(null);
  var leftSamPathRef = useRef(null);
  var leftSamFillRef = useRef(null);
  var leftSamClipRef = useRef(null);
  var rightPopPathRef = useRef(null);
  var rightPopFillRef = useRef(null);
  var rightPopClipRef = useRef(null);
  var rightSamPathRef = useRef(null);
  var rightSamFillRef = useRef(null);
  var rightSamClipRef = useRef(null);

  var shapeBtnRef = useRef(null);
  var centreBtnRef = useRef(null);
  var spreadBtnRef = useRef(null);
  var drawPopBtnRef = useRef(null);
  var drawS1BtnRef = useRef(null);
  var drawS2BtnRef = useRef(null);
  var s1FailBtnRef = useRef(null);
  var s2PassBtnRef = useRef(null);
  var mcqS1HalfRef = useRef(null);
  var mcqS2HalfRef = useRef(null);
  var mcqIdleTimerRef = useRef(null);
  var mcqTargetRef = useRef(mcqTarget);
  mcqTargetRef.current = mcqTarget;
  var mcqBusyRef = useRef(mcqBusy);
  mcqBusyRef.current = mcqBusy;
  var shapeS1BoxRef = useRef(null);
  var shapeS2BoxRef = useRef(null);
  var spreadS1BoxRef = useRef(null);
  var spreadS2BoxRef = useRef(null);
  var rangePopBtnRef = useRef(null);
  var rangeS1BtnRef = useRef(null);
  var rangeS2BtnRef = useRef(null);
  var highBtnRef = useRef(null);
  var lowBtnRef = useRef(null);
  var answerBtnRef = useRef(null);
  var meanPopBtnRef = useRef(null);
  var meanS1BtnRef = useRef(null);
  var meanS2BtnRef = useRef(null);
  var meanNumBtnRef = useRef(null);
  var meanDenBtnRef = useRef(null);
  var meanAnsBtnRef = useRef(null);
  var eqARef = useRef(null);
  var eqMRef = useRef(null);
  var eqDenARef = useRef(null);
  var meanNumLhsRef = useRef(null);
  var meanDenLhsRef = useRef(null);
  var centreS1BoxRef = useRef(null);
  var centreS2BoxRef = useRef(null);

  var cloneElsRef = useRef([]);
  var mountedRef = useRef(true);
  var drawEmergedRef = useRef(false);
  var rangeEmergedRef = useRef(false);
  var meanEmergedRef = useRef(false);
  var meanCompletedRef = useRef({
    pop: meanDoneInit,
    s1: meanDoneInit,
    s2: meanDoneInit,
  });
  var growArrowRef = useRef(null);
  var growVlineRef = useRef(null);
  var growMeanLineRef = useRef(null);
  var drawnRef = useRef({
    pop: (isA1 && startAtFinal) || isA2,
    s1: (isA1 && startAtFinal) || isA2,
    s2: (isA1 && startAtFinal) || isA2,
  });
  var rangeCompletedRef = useRef({
    pop: rangeDoneInit,
    s1: rangeDoneInit,
    s2: rangeDoneInit,
  });
  var timersRef = useRef([]);

  function addTimer(id) {
    timersRef.current.push(id);
    return id;
  }

  function resetGraphLayout() {
    setCenterLeft(false);
    setCenterRight(false);
    setHideLeftGraph(false);
    setHideRightGraph(false);
  }

  function waitMs(ms, fn) {
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        fn();
      }, ms),
    );
  }

  function runGraphFocusIn(kind, onDone) {
    function done() {
      if (onDone) onDone();
    }
    if (kind === "pop") {
      setHideLeftSample(true);
      setHideRightSample(true);
      setHidePopBars(false);
      setHideLeftGraph(false);
      setHideRightGraph(false);
      waitMs(GRAPH_HIDE_MS, function () {
        setCenterLeft(true);
        setCenterRight(true);
        waitMs(GRAPH_SLIDE_MS, function () {
          setHideRightGraph(true);
          waitMs(GRAPH_HIDE_MS, done);
        });
      });
      return;
    }
    if (kind === "s1") {
      setHidePopBars(true);
      setHideLeftSample(false);
      setHideRightSample(true);
      setHideRightGraph(true);
      setHideLeftGraph(false);
      waitMs(GRAPH_HIDE_MS, function () {
        setCenterLeft(true);
        waitMs(GRAPH_SLIDE_MS, done);
      });
      return;
    }
    setHidePopBars(true);
    setHideRightSample(false);
    setHideLeftSample(true);
    setHideLeftGraph(true);
    setHideRightGraph(false);
    waitMs(GRAPH_HIDE_MS, function () {
      setCenterRight(true);
      waitMs(GRAPH_SLIDE_MS, done);
    });
  }

  function runGraphFocusOut(kind, onDone) {
    function done() {
      if (onDone) onDone();
    }
    if (kind === "pop") {
      setHideRightGraph(false);
      waitMs(GRAPH_HIDE_MS, function () {
        setCenterLeft(false);
        setCenterRight(false);
        waitMs(GRAPH_SLIDE_MS, function () {
          setHideLeftSample(false);
          setHideRightSample(false);
          waitMs(GRAPH_HIDE_MS, done);
        });
      });
      return;
    }
    if (kind === "s1") {
      setCenterLeft(false);
      waitMs(GRAPH_SLIDE_MS, function () {
        setHidePopBars(false);
        setHideRightGraph(false);
        setHideRightSample(false);
        waitMs(GRAPH_HIDE_MS, done);
      });
      return;
    }
    setCenterRight(false);
    waitMs(GRAPH_SLIDE_MS, function () {
      setHidePopBars(false);
      setHideLeftGraph(false);
      setHideLeftSample(false);
      waitMs(GRAPH_HIDE_MS, done);
    });
  }

  function clearMcqIdleTimer() {
    if (mcqIdleTimerRef.current) {
      clearTimeout(mcqIdleTimerRef.current);
      mcqIdleTimerRef.current = null;
    }
  }

  function activeMcqHalfEl() {
    if (mcqTargetRef.current === "s1") return mcqS1HalfRef.current;
    if (mcqTargetRef.current === "s2") return mcqS2HalfRef.current;
    return null;
  }

  function scheduleMcqIdleTeeter() {
    clearMcqIdleTimer();
    mcqIdleTimerRef.current = addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        if (mcqTargetRef.current === "done") return;
        if (mcqBusyRef.current) {
          scheduleMcqIdleTeeter();
          return;
        }
        playTeeter(activeMcqHalfEl());
        scheduleMcqIdleTeeter();
      }, 5000),
    );
  }

  function playTeeter(el, short) {
    if (!el) return;
    el.classList.remove("teeter", "teeter-short");
    void el.offsetWidth;
    el.classList.add("teeter");
    if (short) el.classList.add("teeter-short");
    function onEnd(ev) {
      if (ev.target !== el) return;
      el.classList.remove("teeter", "teeter-short");
      el.removeEventListener("animationend", onEnd);
    }
    el.addEventListener("animationend", onEnd);
  }

  function flyThumbToBox(fromEl, toEl, emoji, done) {
    if (!fromEl || !toEl) {
      if (done) done();
      return;
    }
    var fromRect = fromEl.getBoundingClientRect();
    var toRect = toEl.getBoundingClientRect();
    var clone = document.createElement("div");
    clone.className = "flying-thumb";
    clone.textContent = emoji;
    clone.style.left = fromRect.left + fromRect.width / 2 + "px";
    clone.style.top = fromRect.top + fromRect.height / 2 + "px";
    document.body.appendChild(clone);
    cloneElsRef.current.push(clone);
    gsap.fromTo(
      clone,
      { xPercent: -50, yPercent: -50, scale: 1.15, opacity: 1 },
      {
        left: toRect.left + toRect.width / 2,
        top: toRect.top + toRect.height / 2,
        scale: 0.72,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: function () {
          if (clone.parentNode) clone.parentNode.removeChild(clone);
          var idx = cloneElsRef.current.indexOf(clone);
          if (idx !== -1) cloneElsRef.current.splice(idx, 1);
          if (mountedRef.current && done) done();
        },
      },
    );
  }

  function flyAxisLabel(svgEl, xNum, destEl, done) {
    if (!svgEl || !destEl) {
      if (done) done();
      return;
    }
    var src = svgEl.querySelector(".x-label-" + xNum);
    if (!src) {
      if (done) done();
      return;
    }
    var srcRect = src.getBoundingClientRect();
    var destRect = destEl.getBoundingClientRect();
    var destSize = parseFloat(window.getComputedStyle(destEl).fontSize) || 22;
    var clone = document.createElement("div");
    clone.className = "flying-axis-label";
    clone.textContent = String(xNum);
    clone.style.left = srcRect.left + srcRect.width / 2 + "px";
    clone.style.top = srcRect.top + srcRect.height / 2 + "px";
    clone.style.fontSize = Math.max(srcRect.height * 0.72, 12) + "px";
    document.body.appendChild(clone);
    cloneElsRef.current.push(clone);
    if (typeof playSound === "function") playSound("swoosh");
    gsap.to(clone, {
      left: destRect.left + destRect.width / 2,
      top: destRect.top + destRect.height / 2,
      fontSize: destSize + "px",
      duration: 0.95,
      ease: "power2.inOut",
      onComplete: function () {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        var idx = cloneElsRef.current.indexOf(clone);
        if (idx !== -1) cloneElsRef.current.splice(idx, 1);
        if (mountedRef.current && done) done();
      },
    });
  }

  function flyNumberToEl(fromEl, toEl, text, done) {
    if (!fromEl || !toEl) {
      if (done) done();
      return;
    }
    var fromRect = fromEl.getBoundingClientRect();
    var toRect = toEl.getBoundingClientRect();
    var startSize = parseFloat(window.getComputedStyle(fromEl).fontSize) || 22;
    var clone = document.createElement("div");
    clone.className = "flying-axis-label";
    clone.textContent = String(text);
    clone.style.left = fromRect.left + fromRect.width / 2 + "px";
    clone.style.top = fromRect.top + fromRect.height / 2 + "px";
    clone.style.fontSize = startSize + "px";
    document.body.appendChild(clone);
    cloneElsRef.current.push(clone);
    if (typeof playSound === "function") playSound("swoosh");
    gsap.to(clone, {
      left: toRect.left + toRect.width / 2,
      top: toRect.top + toRect.height / 2,
      fontSize: "1.7vw",
      duration: 1.05,
      ease: "power2.inOut",
      onComplete: function () {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        var idx = cloneElsRef.current.indexOf(clone);
        if (idx !== -1) cloneElsRef.current.splice(idx, 1);
        if (mountedRef.current && done) done();
      },
    });
  }

  function flyFromEl(fromEl, toEl, text, done) {
    if (!fromEl || !toEl) {
      if (done) done();
      return;
    }
    var fromRect = fromEl.getBoundingClientRect();
    var toRect = toEl.getBoundingClientRect();
    var startSize = Math.max(fromRect.height * 0.72, 12);
    var destSize = parseFloat(window.getComputedStyle(toEl).fontSize) || 18;
    var clone = document.createElement("div");
    clone.className = "flying-axis-label";
    clone.textContent = String(text);
    clone.style.left = fromRect.left + fromRect.width / 2 + "px";
    clone.style.fontSize = startSize + "px";
    clone.style.top = fromRect.top + fromRect.height / 2 + "px";
    document.body.appendChild(clone);
    cloneElsRef.current.push(clone);
    if (typeof playSound === "function") playSound("swoosh");
    gsap.to(clone, {
      left: toRect.left + toRect.width / 2,
      top: toRect.top + toRect.height / 2,
      fontSize: destSize + "px",
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: function () {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        var idx = cloneElsRef.current.indexOf(clone);
        if (idx !== -1) cloneElsRef.current.splice(idx, 1);
        if (mountedRef.current && done) done();
      },
    });
  }

  function clearClones() {
    cloneElsRef.current.forEach(function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    cloneElsRef.current = [];
  }

  function appendClone(svgEl) {
    var rect = svgEl.getBoundingClientRect();
    var clone = svgEl.cloneNode(true);
    clone.classList.add("flying-clone");
    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.margin = "0";
    clone.style.padding = "0";
    clone.style.zIndex = "400";
    clone.style.pointerEvents = "none";
    clone.style.transformOrigin = "0 0";
    document.body.appendChild(clone);
    cloneElsRef.current.push(clone);
    return { clone: clone, rect: rect };
  }

  function showOutlineNow(pathEl, fillEl, clipEl, stroke) {
    if (pathEl) {
      pathEl.classList.remove("blink-green", "blink-red");
      gsap.set(pathEl, {
        opacity: 1,
        attr: {
          stroke: stroke,
          "stroke-width": PATH_W,
          "stroke-dashoffset": 0,
          "stroke-dasharray": "none",
        },
      });
    }
    if (fillEl) gsap.set(fillEl, { opacity: 1 });
    if (clipEl) gsap.set(clipEl, { attr: { height: POP_SVG_H } });
  }

  function hideOutline(pathEl, fillEl, clipEl) {
    if (pathEl) {
      pathEl.classList.remove("blink-green", "blink-red");
      gsap.set(pathEl, { opacity: 0 });
    }
    if (fillEl) gsap.set(fillEl, { opacity: 0 });
    if (clipEl) gsap.set(clipEl, { attr: { height: 0 } });
  }

  function applyBlink(pathEl, fillEl, mode, normalStroke) {
    if (!pathEl) return;
    pathEl.classList.remove("blink-green", "blink-red");
    if (mode === "red") {
      gsap.to(pathEl, {
        attr: { stroke: colors.blinkRed, "stroke-width": PATH_W },
        duration: 0.35,
      });
      pathEl.classList.add("blink-red");
    } else if (mode === "green") {
      gsap.to(pathEl, {
        attr: { stroke: colors.blinkGreen, "stroke-width": PATH_W },
        duration: 0.35,
      });
      pathEl.classList.add("blink-green");
    } else {
      gsap.to(pathEl, {
        attr: { stroke: normalStroke, "stroke-width": PATH_W },
        duration: 0.35,
      });
    }
  }

  function animateOutline(pathEl, fillEl, clipEl, done, withSound) {
    if (!pathEl) {
      if (done) done();
      return;
    }
    var len = pathEl.getTotalLength();
    gsap.set(pathEl, {
      attr: { "stroke-dasharray": len, "stroke-dashoffset": len },
      opacity: 1,
    });
    if (withSound && typeof playSound === "function") playSound("zoom");
    var tl = gsap.timeline({
      onComplete: function () {
        if (done) done();
      },
    });
    tl.to(pathEl, {
      attr: { "stroke-dashoffset": 0 },
      duration: 1.2,
      ease: "none",
    });
    tl.call(
      function () {
        if (fillEl) gsap.set(fillEl, { opacity: 1 });
        if (withSound && typeof playSound === "function") playSound("fill");
      },
      null,
      "+=0.4",
    );
    if (clipEl) {
      tl.to(clipEl, {
        attr: { height: POP_SVG_H },
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }

  function revealAllOutlines() {
    showOutlineNow(
      leftPopPathRef.current,
      leftPopFillRef.current,
      leftPopClipRef.current,
      colors.popStroke,
    );
    showOutlineNow(
      rightPopPathRef.current,
      rightPopFillRef.current,
      rightPopClipRef.current,
      colors.popStroke,
    );
    showOutlineNow(
      leftSamPathRef.current,
      leftSamFillRef.current,
      leftSamClipRef.current,
      colors.s1Stroke,
    );
    showOutlineNow(
      rightSamPathRef.current,
      rightSamFillRef.current,
      rightSamClipRef.current,
      colors.s2Stroke,
    );
  }

  function clearAllOutlines() {
    hideOutline(
      leftPopPathRef.current,
      leftPopFillRef.current,
      leftPopClipRef.current,
    );
    hideOutline(
      rightPopPathRef.current,
      rightPopFillRef.current,
      rightPopClipRef.current,
    );
    hideOutline(
      leftSamPathRef.current,
      leftSamFillRef.current,
      leftSamClipRef.current,
    );
    hideOutline(
      rightSamPathRef.current,
      rightSamFillRef.current,
      rightSamClipRef.current,
    );
  }

  useEffect(function () {
    mountedRef.current = true;
    return function () {
      mountedRef.current = false;
      timersRef.current.forEach(function (id) {
        clearTimeout(id);
      });
      clearClones();
    };
  }, []);

  useEffect(
    function () {
      if (step === 1) {
        onSetNextEnabled(true);
        onSetNavLocked(false);
        return;
      }

      if (isStep2) {
        onSetNextEnabled(false);
        setPendingExplored(null);
        setDrawFocus(null);
        drawnRef.current = { pop: false, s1: false, s2: false };
        setDrawnPop(false);
        setDrawnS1(false);
        setDrawnS2(false);
        setDrawReady(false);
        drawEmergedRef.current = false;
        rangeEmergedRef.current = false;
        setRangeReady(false);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setShowDrawNudges(false);
        setShowMainNudges(false);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
          }, 40),
        );
        if (startAtFinal) {
          setLeftPopVisible(true);
          setShowIntro(false);
          setShowSamplesPanel(false);
          setShowOverlap(true);
          setShowButtonRows(true);
          onSetNavLocked(false);
          onUpdateQuestionText(copy.steps[2].afterAnimQuestion);
          onUpdateNavText(copy.steps[2].afterAnimNav);
          addTimer(
            setTimeout(function () {
              setShowMainNudges(true);
            }, 200),
          );
          return;
        }
        onSetNavLocked(true);
        onUpdateNavText(" ");
        addTimer(setTimeout(runStep2Animation, 140));
        return;
      }

      if (isA1) {
        setLeftPopVisible(true);
        setShowIntro(false);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        onSetNextEnabled(false);
        setPendingExplored(null);
        setDrawFocus(null);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        drawEmergedRef.current = false;
        drawnRef.current = { pop: false, s1: false, s2: false };
        setDrawnPop(false);
        setDrawnS1(false);
        setDrawnS2(false);
        setDrawReady(false);
        setShowDrawNudges(false);
        setRangeAllDone(true);
        setPopArrow({ left: false, right: false });
        setPopMaxLine({ left: false, right: false });
        setPopMinLine({ left: false, right: false });
        setPopLabel({ left: null, right: null });
        setS1Arrow(false);
        setS1MaxLine(false);
        setS1MinLine(false);
        setS1Label(null);
        setS2Arrow(false);
        setS2MaxLine(false);
        setS2MinLine(false);
        setS2Label(null);
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        setMeanHighlight(null);
        setMeanDimBars(false);
        setMeanGuide(null);
        setMeanFiLabels({});
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
            setLeftPathsBlink("normal");
            setRightPathsBlink("normal");
          }, 40),
        );
        if (startAtFinal) {
          drawnRef.current = { pop: true, s1: true, s2: true };
          setDrawnPop(true);
          setDrawnS1(true);
          setDrawnS2(true);
          setDrawReady(true);
          drawEmergedRef.current = true;
          addTimer(
            setTimeout(function () {
              revealAllOutlines();
              onUpdateQuestionText(copy.steps.A1.afterAllDrawnQuestion);
              onUpdateNavText(copy.steps.A1.afterAllDrawnNav);
              onSetNextEnabled(true);
              onSetNavLocked(false);
            }, 80),
          );
          return;
        }
        onSetNavLocked(true);
        onUpdateNavText(" ");
        return;
      }

      if (isA2) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        setPopArrow({ left: false, right: false });
        setPopMaxLine({ left: false, right: false });
        setPopMinLine({ left: false, right: false });
        setPopLabel({ left: null, right: null });
        setS1Arrow(false);
        setS1MaxLine(false);
        setS1MinLine(false);
        setS1Label(null);
        setS2Arrow(false);
        setS2MaxLine(false);
        setS2MinLine(false);
        setS2Label(null);
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        if (!startAtFinal) {
          setMcqTarget("s1");
          setS1Selected(null);
          setS2Selected(null);
          setS1Retry(false);
          setS2Retry(false);
          setS1Locked(false);
          setS2Locked(false);
          setFeedbackSide(null);
          setMcqBusy(false);
          setShowShapeS1Box(false);
          setShowShapeS2Box(false);
        } else {
          setMcqTarget("done");
          setS1Selected("fail");
          setS2Selected("pass");
          setS1Locked(true);
          setS2Locked(true);
          setShowShapeS1Box(true);
          setShowShapeS2Box(true);
        }
        addTimer(
          setTimeout(function () {
            revealAllOutlines();
            if (startAtFinal) {
              setLeftPathsBlink("red");
              setRightPathsBlink("green");
            }
          }, 80),
        );
        if (startAtFinal) {
          onUpdateQuestionText(copy.steps.A2.afterBothQuestion);
          onUpdateNavText(
            completedTests.length >= 2
              ? copy.steps[3].allDoneNav
              : copy.steps.A2.afterBothNav,
          );
          onSetNextEnabled(true);
          onSetNavLocked(false);
          return;
        }
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.A2.questionText);
        onUpdateNavText(copy.steps.A2.navText);
        return;
      }

      if (isA3) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        setShowShapeS1Box(true);
        setShowShapeS2Box(true);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
          }, 80),
        );
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.A3.questionText);
        onUpdateNavText(null);
        return;
      }

      if (isC1) {
        setLeftPopVisible(true);
        setShowIntro(false);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        onSetNextEnabled(false);
        setPendingExplored(null);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        addTimer(setTimeout(function () {
          clearAllOutlines();
          setLeftPathsBlink("normal");
          setRightPathsBlink("normal");
        }, 40));
        rangeEmergedRef.current = false;
        setShowRangeNudges(false);
        setRangeActive(null);
        setRangePending(null);
        setRangeStage("idle");
        setRangeBusy(false);
        setHighClicked(false);
        setLowClicked(false);
        setHighValue(null);
        setLowValue(null);
        setShowAnswerSlot(false);
        setAnswerFlipped(false);
        setRangeCollapsed(false);
        setShowHighNudge(false);
        setShowLowNudge(false);
        setShowAnswerNudge(false);
        onUpdateQuestionText(copy.steps.C1.questionText);
        if (startAtFinal) {
          rangeEmergedRef.current = true;
          setRangeReady(true);
          setRangeGone({ pop: true, s1: true, s2: true });
          setRangeCompleted({ pop: true, s1: true, s2: true });
          rangeCompletedRef.current = { pop: true, s1: true, s2: true };
          setRangeAllDone(true);
          setPopArrow({ left: true, right: true });
          setPopMaxLine({ left: true, right: true });
          setPopMinLine({ left: true, right: true });
          setPopLabel({
            left: RANGE_CFG.pop.result,
            right: RANGE_CFG.pop.result,
          });
          setS1Arrow(true);
          setS1MaxLine(true);
          setS1MinLine(true);
          setS1Label(RANGE_CFG.s1.result);
          setS2Arrow(true);
          setS2MaxLine(true);
          setS2MinLine(true);
          setS2Label(RANGE_CFG.s2.result);
          onUpdateNavText(copy.steps.C1.afterAllNav);
          onSetNextEnabled(true);
          onSetNavLocked(false);
          return;
        }
        setRangeReady(false);
        setRangeAllDone(false);
        setRangeGone({ pop: false, s1: false, s2: false });
        setRangeCompleted({ pop: false, s1: false, s2: false });
        rangeCompletedRef.current = { pop: false, s1: false, s2: false };
        setPopArrow({ left: false, right: false });
        setPopMaxLine({ left: false, right: false });
        setPopMinLine({ left: false, right: false });
        setPopLabel({ left: null, right: null });
        setS1Arrow(false);
        setS1MaxLine(false);
        setS1MinLine(false);
        setS1Label(null);
        setS2Arrow(false);
        setS2MaxLine(false);
        setS2MinLine(false);
        setS2Label(null);
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
            setLeftPathsBlink("normal");
            setRightPathsBlink("normal");
          }, 40),
        );
        onSetNavLocked(true);
        onUpdateNavText(" ");
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current || startAtFinal) return;
            if (!rangeEmergedRef.current) {
              runRangeButtonsEmerge();
            }
          }, 60),
        );
        return;
      }

      if (isC2) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        addTimer(setTimeout(function () { clearAllOutlines(); }, 40));
        setRangeAllDone(true);
        setRangeGone({ pop: true, s1: true, s2: true });
        setPopArrow({ left: true, right: true });
        setPopMaxLine({ left: true, right: true });
        setPopMinLine({ left: true, right: true });
        setPopLabel({
          left: RANGE_CFG.pop.result,
          right: RANGE_CFG.pop.result,
        });
        setS1Arrow(true);
        setS1MaxLine(true);
        setS1MinLine(true);
        setS1Label(RANGE_CFG.s1.result);
        setS2Arrow(true);
        setS2MaxLine(true);
        setS2MinLine(true);
        setS2Label(RANGE_CFG.s2.result);
        if (!startAtFinal) {
          setMcqTarget("s1");
          setS1Selected(null);
          setS2Selected(null);
          setS1Retry(false);
          setS2Retry(false);
          setS1Locked(false);
          setS2Locked(false);
          setFeedbackSide(null);
          setMcqBusy(false);
          setShowSpreadS1Box(false);
          setShowSpreadS2Box(false);
        } else {
          setMcqTarget("done");
          setS1Selected("fail");
          setS2Selected("pass");
          setS1Locked(true);
          setS2Locked(true);
          setShowSpreadS1Box(true);
          setShowSpreadS2Box(true);
        }
        if (startAtFinal) {
          onUpdateQuestionText(copy.steps.C2.afterBothQuestion);
          onUpdateNavText(
            completedTests.length >= 2
              ? copy.steps[3].allDoneNav
              : copy.steps.C2.afterBothNav,
          );
          onSetNextEnabled(true);
          onSetNavLocked(false);
          return;
        }
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.C2.questionText);
        onUpdateNavText(copy.steps.C2.navText);
        return;
      }

      if (isC3) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setRangeAllDone(true);
        setPopArrow({ left: false, right: false });
        setPopMaxLine({ left: false, right: false });
        setPopMinLine({ left: false, right: false });
        setPopLabel({ left: null, right: null });
        setS1Arrow(false);
        setS1MaxLine(false);
        setS1MinLine(false);
        setS1Label(null);
        setS2Arrow(false);
        setS2MaxLine(false);
        setS2MinLine(false);
        setS2Label(null);
        setShowSpreadS1Box(true);
        setShowSpreadS2Box(true);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
            setLeftPathsBlink("normal");
            setRightPathsBlink("normal");
          }, 80),
        );
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.C3.questionText);
        onUpdateNavText(null);
        return;
      }

      if (isB1) {
        setLeftPopVisible(true);
        setShowIntro(false);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        onSetNextEnabled(false);
        setPendingExplored(null);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        setPopArrow({ left: false, right: false });
        setPopMaxLine({ left: false, right: false });
        setPopMinLine({ left: false, right: false });
        setPopLabel({ left: null, right: null });
        setS1Arrow(false);
        setS1MaxLine(false);
        setS1MinLine(false);
        setS1Label(null);
        setS2Arrow(false);
        setS2MaxLine(false);
        setS2MinLine(false);
        setS2Label(null);
        addTimer(setTimeout(function () {
          clearAllOutlines();
          setLeftPathsBlink("normal");
          setRightPathsBlink("normal");
        }, 40));
        meanEmergedRef.current = false;
        setShowMeanNudges(false);
        setMeanActive(null);
        setMeanPending(null);
        setMeanStage("idle");
        setMeanBusy(false);
        setMeanNumFlipped(false);
        setMeanDenFlipped(false);
        setMeanAnsFlipped(false);
        setMeanShowAnswer(false);
        setMeanCollapsed(false);
        setMeanNumDone(false);
        setMeanDenDone(false);
        setShowMeanNumNudge(false);
        setShowMeanDenNudge(false);
        setShowMeanAnsNudge(false);
        setMeanEq(EMPTY_MEAN_EQ);
        setMeanDenEq(EMPTY_MEAN_EQ);
        setMeanHighlight(null);
        setMeanDimBars(false);
        setMeanGuide(null);
        setMeanFiLabels({});
        onUpdateQuestionText(copy.steps.B1.questionText);
        if (startAtFinal) {
          meanEmergedRef.current = true;
          setMeanReady(true);
          setMeanGone({ pop: true, s1: true, s2: true });
          meanCompletedRef.current = { pop: true, s1: true, s2: true };
          setMeanAllDone(true);
          setPopMeanMark({ left: true, right: true });
          setS1MeanMark(true);
          setS2MeanMark(true);
          onUpdateNavText(copy.steps.B1.afterAllNav);
          onSetNextEnabled(true);
          onSetNavLocked(false);
          return;
        }
        setMeanReady(false);
        setMeanAllDone(false);
        setMeanGone({ pop: false, s1: false, s2: false });
        meanCompletedRef.current = { pop: false, s1: false, s2: false };
        meanEmergedRef.current = false;
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
            setLeftPathsBlink("normal");
            setRightPathsBlink("normal");
          }, 40),
        );
        onSetNavLocked(true);
        onUpdateNavText(" ");
        return;
      }

      if (isB2) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        setPopArrow({ left: false, right: false });
        setPopMaxLine({ left: false, right: false });
        setPopMinLine({ left: false, right: false });
        setPopLabel({ left: null, right: null });
        setS1Arrow(false);
        setS1MaxLine(false);
        setS1MinLine(false);
        setS1Label(null);
        setS2Arrow(false);
        setS2MaxLine(false);
        setS2MinLine(false);
        setS2Label(null);
        setMeanAllDone(true);
        setMeanGone({ pop: true, s1: true, s2: true });
        setPopMeanMark({ left: true, right: true });
        setS1MeanMark(true);
        setS2MeanMark(true);
        addTimer(setTimeout(function () { clearAllOutlines(); }, 40));
        if (!startAtFinal) {
          setMcqTarget("s1");
          setS1Selected(null);
          setS2Selected(null);
          setS1Retry(false);
          setS2Retry(false);
          setS1Locked(false);
          setS2Locked(false);
          setFeedbackSide(null);
          setMcqBusy(false);
          setShowCentreS1Box(false);
          setShowCentreS2Box(false);
        } else {
          setMcqTarget("done");
          setS1Selected("fail");
          setS2Selected("pass");
          setS1Locked(true);
          setS2Locked(true);
          setShowCentreS1Box(true);
          setShowCentreS2Box(true);
        }
        if (startAtFinal) {
          onUpdateQuestionText(copy.steps.B2.afterBothQuestion);
          onUpdateNavText(
            completedTests.length >= 2
              ? copy.steps[3].allDoneNav
              : copy.steps.B2.afterBothNav,
          );
          onSetNextEnabled(true);
          onSetNavLocked(false);
          return;
        }
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.B2.questionText);
        onUpdateNavText(copy.steps.B2.navText);
        return;
      }

      if (isB3) {
        setLeftPopVisible(true);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        setMeanAllDone(true);
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        setMeanHighlight(null);
        setMeanDimBars(false);
        setMeanGuide(null);
        setMeanFiLabels({});
        setShowCentreS1Box(true);
        setShowCentreS2Box(true);
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
            setLeftPathsBlink("normal");
            setRightPathsBlink("normal");
          }, 80),
        );
        onSetNextEnabled(false);
        onSetNavLocked(false);
        onUpdateQuestionText(copy.steps.B3.questionText);
        onUpdateNavText(null);
      }

      if (isStep3) {
        setLeftPopVisible(true);
        setShowIntro(false);
        setShowSamplesPanel(false);
        setShowOverlap(true);
        setShowButtonRows(true);
        resetGraphLayout();
        setHideLeftSample(false);
        setHideRightSample(false);
        setHidePopBars(false);
        setShowShapeS1Box(true);
        setShowShapeS2Box(true);
        setShowCentreS1Box(true);
        setShowCentreS2Box(true);
        setShowSpreadS1Box(true);
        setShowSpreadS2Box(true);
        setPopArrow({ left: false, right: false });
        setPopMaxLine({ left: false, right: false });
        setPopMinLine({ left: false, right: false });
        setPopLabel({ left: null, right: null });
        setS1Arrow(false);
        setS1MaxLine(false);
        setS1MinLine(false);
        setS1Label(null);
        setS2Arrow(false);
        setS2MaxLine(false);
        setS2MinLine(false);
        setS2Label(null);
        setPopMeanMark({ left: false, right: false });
        setS1MeanMark(false);
        setS2MeanMark(false);
        setStep3TableVisible(false);
        setStep3AnimDone(false);
        setStep3SelectedGraph(null);
        setStep3Feedback(null);
        setStep3Correct(false);
        setStep3HideMainBtns(false);
        step3AnimTriesRef.current = 0;
        onSetNextEnabled(false);
        onSetNavLocked(true);
        onUpdateQuestionText(copy.steps[3].questionText);
        onUpdateNavText(" ");
        addTimer(
          setTimeout(function () {
            clearAllOutlines();
            setLeftPathsBlink("normal");
            setRightPathsBlink("normal");
          }, 80),
        );
      }
    },
    [step, startAtFinal],
  );

  useLayoutEffect(
    function () {
      var overlay = step3ColOverlayRef.current;
      if (!overlay) return;
      if (!step3SelectedGraph || !step3TableRef.current) {
        overlay.style.display = "none";
        return;
      }
      var colIdx = step3SelectedGraph === "s1" ? 1 : 2;
      var tableRect = step3TableRef.current.getBoundingClientRect();
      var rows = step3TableRef.current.querySelectorAll(
        ".step3-header-row, .step3-data-row",
      );
      if (!rows.length) {
        overlay.style.display = "none";
        return;
      }
      var firstCell = rows[0].children[colIdx];
      var lastCell = rows[rows.length - 1].children[colIdx];
      if (!firstCell || !lastCell) {
        overlay.style.display = "none";
        return;
      }
      var topRect = firstCell.getBoundingClientRect();
      var botRect = lastCell.getBoundingClientRect();
      var left = topRect.left - tableRect.left;
      var top = topRect.top - tableRect.top;
      var width = topRect.width;
      var height = botRect.top + botRect.height - topRect.top;
      overlay.style.display = "block";
      overlay.style.left = left + "px";
      overlay.style.top = top + "px";
      overlay.style.width = width + "px";
      overlay.style.height = height + "px";
      overlay.style.borderColor = step3Correct
        ? "rgba(124, 252, 0, 0.95)"
        : "rgba(255, 82, 82, 0.95)";
      playTeeter(overlay, true);
    },
    [step3SelectedGraph, step3Correct, step3TableVisible],
  );

  useEffect(
    function () {
      if (!isStep3) return;
      var startId = setTimeout(function () {
        runStep3Animation();
      }, 800);
      addTimer(startId);
      return function () {
        clearTimeout(startId);
      };
    },
    [isStep3],
  );

  useLayoutEffect(
    function () {
      if (!isStep3 || !step3AnimDone) return;
      playTeeter(leftHalfRef.current);
      playTeeter(rightHalfRef.current);
    },
    [isStep3, step3AnimDone],
  );

  useEffect(
    function () {
      if (!isMcqStep || startAtFinal || mcqTarget === "done") {
        clearMcqIdleTimer();
        return;
      }
      var appearId = setTimeout(function () {
        if (!mountedRef.current) return;
        playTeeter(activeMcqHalfEl());
      }, 300);
      addTimer(appearId);
      scheduleMcqIdleTeeter();
      return function () {
        clearTimeout(appearId);
        clearMcqIdleTimer();
      };
    },
    [isMcqStep, mcqTarget, startAtFinal],
  );

  useLayoutEffect(
    function () {
      if (!isA1 || startAtFinal) return;
      if (drawEmergedRef.current) return;
      runDrawButtonsEmerge();
    },
    [isA1, startAtFinal],
  );

  useLayoutEffect(
    function () {
      if (!isC1 || startAtFinal) return;
      if (rangeEmergedRef.current) return;
      runRangeButtonsEmerge();
    },
    [isC1, startAtFinal],
  );

  useLayoutEffect(
    function () {
      if (!isB1 || startAtFinal) return;
      if (meanEmergedRef.current) return;
      runMeanButtonsEmerge();
    },
    [isB1, startAtFinal],
  );

  useLayoutEffect(
    function () {
      var info = growArrowRef.current;
      if (!info) return;
      growArrowRef.current = null;
      var svg = info.side === "left" ? leftSvgRef.current : rightSvgRef.current;
      var g = svg ? svg.querySelector(".range-arrow-grow-" + info.id) : null;
      if (!svg || !g) {
        if (info.onDone) info.onDone();
        return;
      }
      var cfg = RANGE_CFG[info.id];
      var yVal = info.id === "pop" ? ARROW_Y_POP : ARROW_Y_SAMPLE;
      var x0 = popLayout.xP(cfg.min);
      var ay = popLayout.yP(yVal);
      gsap.fromTo(
        g,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power2.out",
          svgOrigin: x0 + " " + ay,
          onComplete: function () {
            if (info.onDone) info.onDone();
          },
        },
      );
    },
    [popArrow, s1Arrow, s2Arrow],
  );

  useLayoutEffect(
    function () {
      var info = growVlineRef.current;
      if (!info) return;
      growVlineRef.current = null;
      var svg = info.side === "left" ? leftSvgRef.current : rightSvgRef.current;
      var line = svg
        ? svg.querySelector(".range-vline-grow-" + info.kind + "-" + info.id)
        : null;
      if (!svg || !line) {
        if (info.onDone) info.onDone();
        return;
      }
      var yVal = info.id === "pop" ? ARROW_Y_POP : ARROW_Y_SAMPLE;
      var ay = popLayout.yP(yVal);
      var baseY = popLayout.baseY;
      gsap.fromTo(
        line,
        { attr: { y1: baseY, y2: baseY } },
        {
          attr: { y1: baseY, y2: ay },
          duration: 0.55,
          ease: "power2.out",
          onComplete: function () {
            if (info.onDone) info.onDone();
          },
        },
      );
    },
    [popMaxLine, popMinLine, s1MaxLine, s1MinLine, s2MaxLine, s2MinLine],
  );

  useLayoutEffect(
    function () {
      var info = growMeanLineRef.current;
      if (!info) return;
      growMeanLineRef.current = null;
      var svg = info.side === "left" ? leftSvgRef.current : rightSvgRef.current;
      var line = svg
        ? svg.querySelector(".mean-vline-grow-" + info.id + "-" + info.side)
        : null;
      if (!svg || !line) {
        if (info.onDone) info.onDone();
        return;
      }
      var baseY = popLayout.baseY;
      var yEnd = Number(line.getAttribute("y2"));
      if (!isFinite(yEnd)) yEnd = popLayout.yP(popLayout.yMax);
      gsap.fromTo(
        line,
        { attr: { y1: baseY, y2: baseY } },
        {
          attr: { y1: baseY, y2: yEnd },
          duration: 0.7,
          ease: "power2.out",
          onComplete: function () {
            if (info.onDone) info.onDone();
          },
        },
      );
    },
    [popMeanMark, s1MeanMark, s2MeanMark],
  );

  function runStep2Animation() {
    var intro = introRef.current;
    var tl = gsap.timeline({
      onComplete: function () {
        if (!mountedRef.current) return;
        setShowIntro(false);
        flyPopulationClone(function () {
          if (!mountedRef.current) return;
          flySampleClones(function () {
            if (!mountedRef.current) return;
            setShowOverlap(true);
            setShowSamplesPanel(false);
            setShowButtonRows(true);
            onUpdateQuestionText(copy.steps[2].afterAnimQuestion);
            onUpdateNavText(copy.steps[2].afterAnimNav);
            onSetNavLocked(false);
            setShowMainNudges(true);
          });
        });
      },
    });
    if (intro) {
      tl.to(intro, {
        x: "-120%",
        opacity: 0,
        duration: 0.55,
        ease: "power2.in",
      });
    } else {
      tl.to({}, { duration: 0.05 });
    }
  }

  function flyPopulationClone(done) {
    var src = rightSvgRef.current;
    var tgt = leftSvgRef.current;
    if (!src || !tgt) {
      setLeftPopVisible(true);
      if (done) done();
      return;
    }
    var packed = appendClone(src);
    var so = originRect(src);
    var to = originRect(tgt);
    gsap.to(packed.clone, {
      x: to.left - so.left,
      y: to.top - so.top,
      duration: 0.85,
      ease: "power2.inOut",
      onComplete: function () {
        setLeftPopVisible(true);
        gsap.to(packed.clone, {
          opacity: 0,
          duration: 0.18,
          onComplete: function () {
            if (packed.clone.parentNode)
              packed.clone.parentNode.removeChild(packed.clone);
            if (done) done();
          },
        });
      },
    });
  }

  function flyOneSample(srcSvg, tgtSvg, onStart, done) {
    if (!srcSvg || !tgtSvg) {
      if (done) done();
      return;
    }
    var packed = appendClone(srcSvg);
    if (onStart) onStart();
    var so = originRect(srcSvg);
    var to = originRect(tgtSvg);
    var scaleY = pixelsPerY(tgtSvg) / Math.max(pixelsPerY(srcSvg), 0.001);
    var originX = so.left - packed.rect.left;
    var originY = so.top - packed.rect.top;
    gsap.set(packed.clone, {
      transformOrigin: originX + "px " + originY + "px",
    });
    gsap.to(packed.clone, {
      x: to.left - so.left,
      y: to.top - so.top,
      scaleY: scaleY,
      duration: 1.05,
      ease: "power2.inOut",
      onComplete: function () {
        if (packed.clone.parentNode)
          packed.clone.parentNode.removeChild(packed.clone);
        if (done) done();
      },
    });
  }

  function flySampleClones(done) {
    var pending = 2;
    function oneDone() {
      pending -= 1;
      if (pending <= 0 && done) done();
    }
    var started = false;
    function hideSources() {
      if (started) return;
      started = true;
      setHideSampleSources(true);
    }
    flyOneSample(s1SvgRef.current, leftSvgRef.current, hideSources, oneDone);
    flyOneSample(s2SvgRef.current, rightSvgRef.current, hideSources, oneDone);
  }

  function runDrawButtonsEmerge() {
    var shape = shapeBtnRef.current;
    var buttons = [
      drawPopBtnRef.current,
      drawS1BtnRef.current,
      drawS2BtnRef.current,
    ];
    if (!shape || !buttons[0] || !buttons[1] || !buttons[2]) {
      setDrawReady(true);
      setShowDrawNudges(true);
      onUpdateNavText(copy.steps.A1.afterButtonsNav);
      onSetNavLocked(false);
      return;
    }

    drawEmergedRef.current = true;
    gsap.killTweensOf(buttons);
    gsap.set(buttons, { x: 0, y: 0, scale: 1, clearProps: "transform" });

    var sr = shape.getBoundingClientRect();
    var sx = sr.left + sr.width / 2;
    var sy = sr.top + sr.height / 2;

    var deltas = buttons.map(function (btn) {
      var r = btn.getBoundingClientRect();
      return {
        x: sx - (r.left + r.width / 2),
        y: sy - (r.top + r.height / 2),
      };
    });

    buttons.forEach(function (btn, i) {
      gsap.set(btn, {
        x: deltas[i].x,
        y: deltas[i].y,
        scale: 0,
        opacity: 0,
        visibility: "visible",
        transformOrigin: "50% 50%",
      });
    });
    var drawRow = buttons[0].parentNode;
    if (drawRow) drawRow.style.visibility = "visible";

    gsap.to(buttons, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.75,
      ease: "power2.out",
      stagger: 0.07,
      overwrite: true,
      onComplete: function () {
        if (!mountedRef.current) return;
        gsap.set(buttons, { clearProps: "transform,opacity,visibility" });
        setDrawReady(true);
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current) return;
            setShowDrawNudges(true);
          }, 500),
        );
        onUpdateNavText(copy.steps.A1.afterButtonsNav);
        onSetNavLocked(false);
      },
    });
  }

  function runRangeButtonsEmerge() {
    var spread = spreadBtnRef.current;
    var buttons = [
      rangePopBtnRef.current,
      rangeS1BtnRef.current,
      rangeS2BtnRef.current,
    ];
    if (!spread || !buttons[0] || !buttons[1] || !buttons[2]) {
      setRangeReady(true);
      setShowRangeNudges(true);
      onUpdateNavText(copy.steps.C1.afterButtonsNav);
      onSetNavLocked(false);
      return;
    }

    rangeEmergedRef.current = true;
    gsap.killTweensOf(buttons);
    gsap.set(buttons, { x: 0, y: 0, scale: 1, clearProps: "transform" });

    var sr = spread.getBoundingClientRect();
    var sx = sr.left + sr.width / 2;
    var sy = sr.top + sr.height / 2;

    var deltas = buttons.map(function (btn) {
      var r = btn.getBoundingClientRect();
      return {
        x: sx - (r.left + r.width / 2),
        y: sy - (r.top + r.height / 2),
      };
    });

    buttons.forEach(function (btn, i) {
      gsap.set(btn, {
        x: deltas[i].x,
        y: deltas[i].y,
        scale: 0,
        opacity: 0,
        visibility: "visible",
        transformOrigin: "50% 50%",
      });
    });
    var rangeRow = buttons[0].parentNode;
    if (rangeRow) rangeRow.style.visibility = "visible";

    gsap.to(buttons, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.75,
      ease: "power2.out",
      stagger: 0.07,
      overwrite: true,
      onComplete: function () {
        if (!mountedRef.current) return;
        gsap.set(buttons, { clearProps: "transform,opacity,visibility" });
        setRangeReady(true);
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current) return;
            setShowRangeNudges(true);
          }, 500),
        );
        onUpdateNavText(copy.steps.C1.afterButtonsNav);
        onSetNavLocked(false);
      },
    });
  }

  function runMeanButtonsEmerge() {
    var centre = centreBtnRef.current;
    var buttons = [
      meanPopBtnRef.current,
      meanS1BtnRef.current,
      meanS2BtnRef.current,
    ];
    if (!centre || !buttons[0] || !buttons[1] || !buttons[2]) {
      setMeanReady(true);
      setShowMeanNudges(true);
      onUpdateNavText(copy.steps.B1.afterButtonsNav);
      onSetNavLocked(false);
      return;
    }

    meanEmergedRef.current = true;
    gsap.killTweensOf(buttons);
    gsap.set(buttons, { x: 0, y: 0, scale: 1, clearProps: "transform" });

    var sr = centre.getBoundingClientRect();
    var sx = sr.left + sr.width / 2;
    var sy = sr.top + sr.height / 2;

    var deltas = buttons.map(function (btn) {
      var r = btn.getBoundingClientRect();
      return {
        x: sx - (r.left + r.width / 2),
        y: sy - (r.top + r.height / 2),
      };
    });

    buttons.forEach(function (btn, i) {
      gsap.set(btn, {
        x: deltas[i].x,
        y: deltas[i].y,
        scale: 0,
        opacity: 0,
        visibility: "visible",
        transformOrigin: "50% 50%",
      });
    });
    var meanRow = buttons[0].parentNode;
    if (meanRow) meanRow.style.visibility = "visible";

    gsap.to(buttons, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.75,
      ease: "power2.out",
      stagger: 0.07,
      overwrite: true,
      onComplete: function () {
        if (!mountedRef.current) return;
        gsap.set(buttons, { clearProps: "transform,opacity,visibility" });
        setMeanReady(true);
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current) return;
            setShowMeanNudges(true);
          }, 500),
        );
        onUpdateNavText(copy.steps.B1.afterButtonsNav);
        onSetNavLocked(false);
      },
    });
  }

  function finishDraw() {
    if (!mountedRef.current) return;
    setIsDrawing(false);
    setDrawFocus(null);
    onSetNavLocked(false);
    if (drawnRef.current.pop && drawnRef.current.s1 && drawnRef.current.s2) {
      onUpdateQuestionText(copy.steps.A1.afterAllDrawnQuestion);
      onUpdateNavText(copy.steps.A1.afterAllDrawnNav);
      onSetNextEnabled(true);
    } else {
      // In Step A1, restore the "afterButtonsNav" prompt after each individual draw,
      // and re-enable nudges so the user knows which remaining draw buttons to tap next.
      onUpdateNavText(copy.steps.A1.afterButtonsNav);
      setShowDrawNudges(true);
      onSetNextEnabled(false);
    }
  }

  function handleDraw(kind) {
    if (isDrawing || drawnRef.current[kind]) return;
    if (typeof playSound === "function") playSound("click");
    setShowDrawNudges(false);
    setIsDrawing(true);
    setDrawFocus(kind);
    drawnRef.current[kind] = true;
    if (kind === "pop") setDrawnPop(true);
    if (kind === "s1") setDrawnS1(true);
    if (kind === "s2") setDrawnS2(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    if (kind === "pop") {
      var pending = 2;
      function oneDone() {
        pending -= 1;
        if (pending <= 0) finishDraw();
      }
      animateOutline(
        leftPopPathRef.current,
        leftPopFillRef.current,
        leftPopClipRef.current,
        oneDone,
        true,
      );
      animateOutline(
        rightPopPathRef.current,
        rightPopFillRef.current,
        rightPopClipRef.current,
        oneDone,
        false,
      );
      return;
    }
    if (kind === "s1") {
      animateOutline(
        leftSamPathRef.current,
        leftSamFillRef.current,
        leftSamClipRef.current,
        function () {
          finishDraw();
        },
        true,
      );
      return;
    }
    animateOutline(
      rightSamPathRef.current,
      rightSamFillRef.current,
      rightSamClipRef.current,
      function () {
        finishDraw();
      },
      true,
    );
  }

  function handleMainClick(id) {
    if (isStep2 || isA3 || isC3 || isB3) {
      if (remainingTests.indexOf(id) === -1) return;
      if (pendingExplored) return;
      if (typeof playSound === "function") playSound("click");
      setShowMainNudges(false);
      setPendingExplored(id);
      onSetNavLocked(true);
      onUpdateNavText(" ");
      addTimer(
        setTimeout(function () {
          if (!mountedRef.current) return;
          if (onSelectTest) onSelectTest(id);
        }, 450),
      );
    }
  }

  function rangeBtnRefFor(id) {
    if (id === "pop") return rangePopBtnRef;
    if (id === "s1") return rangeS1BtnRef;
    return rangeS2BtnRef;
  }

  function patchSide(setter, side, value) {
    setter(function (prev) {
      var next = Object.assign({}, prev);
      next[side] = value;
      return next;
    });
  }

  function handleRangeClick(id) {
    if (
      !isC1 ||
      rangeBusy ||
      rangeActive ||
      rangePending ||
      rangeGone[id] ||
      !rangeReady
    )
      return;
    if (typeof playSound === "function") playSound("click");
    var cfg = RANGE_CFG[id];
    setShowRangeNudges(false);
    setRangeBusy(true);
    setHighClicked(false);
    setLowClicked(false);
    setHighValue(null);
    setLowValue(null);
    setShowAnswerSlot(false);
    setAnswerFlipped(false);
    setRangeCollapsed(false);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    runGraphFocusIn(id, function () {
      if (!mountedRef.current) return;
      function afterArrow() {
        if (!mountedRef.current) return;
        setRangeActive(id);
        setRangePending(null);
        setRangeStage("high");
        onUpdateNavText(copy.steps.C1.navHighest);
        setShowHighNudge(true);
        setRangeBusy(false);
        onSetNavLocked(false);
      }
      growArrowRef.current = {
        id: id,
        side: cfg.graph,
        onDone: afterArrow,
      };
      if (id === "pop") patchSide(setPopArrow, "left", true);
      else if (id === "s1") setS1Arrow(true);
      else setS2Arrow(true);
    });
  }

  function startVlineGrow(cfg, kind, onDone) {
    growVlineRef.current = {
      id: cfg.id,
      kind: kind,
      side: cfg.graph,
      onDone: onDone,
    };
    if (kind === "max") {
      if (cfg.id === "pop") patchSide(setPopMaxLine, "left", true);
      else if (cfg.id === "s1") setS1MaxLine(true);
      else setS2MaxLine(true);
    } else if (cfg.id === "pop") patchSide(setPopMinLine, "left", true);
    else if (cfg.id === "s1") setS1MinLine(true);
    else setS2MinLine(true);
  }

  function handleHighestTap() {
    if (
      rangeBusy ||
      rangeStage !== "high" ||
      highValue !== null ||
      !rangeActive
    )
      return;
    if (typeof playSound === "function") playSound("click");
    var cfg = RANGE_CFG[rangeActive];
    var svg = cfg.graph === "left" ? leftSvgRef.current : rightSvgRef.current;
    setShowHighNudge(false);
    setHighClicked(true);
    setRangeBusy(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        startVlineGrow(cfg, "max", function () {
          if (!mountedRef.current) return;
          flyAxisLabel(svg, cfg.max, highBtnRef.current, function () {
            if (!mountedRef.current) return;
            setHighValue(cfg.max);
            addTimer(
              setTimeout(function () {
                if (!mountedRef.current) return;
                setRangeStage("low");
                onUpdateNavText(copy.steps.C1.navLowest);
                setShowLowNudge(true);
                setRangeBusy(false);
                onSetNavLocked(false);
              }, 600),
            );
          });
        });
      }, 550),
    );
  }

  function handleLowestTap() {
    if (rangeBusy || rangeStage !== "low" || lowValue !== null || !rangeActive)
      return;
    if (typeof playSound === "function") playSound("click");
    var cfg = RANGE_CFG[rangeActive];
    var svg = cfg.graph === "left" ? leftSvgRef.current : rightSvgRef.current;
    setShowLowNudge(false);
    setLowClicked(true);
    setRangeBusy(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        startVlineGrow(cfg, "min", function () {
          if (!mountedRef.current) return;
          flyAxisLabel(svg, cfg.min, lowBtnRef.current, function () {
            if (!mountedRef.current) return;
            setLowValue(cfg.min);
            addTimer(
              setTimeout(function () {
                if (!mountedRef.current) return;
                setShowAnswerSlot(true);
                setRangeStage("answer");
                onUpdateNavText(copy.steps.C1.navReveal);
                setShowAnswerNudge(true);
                setRangeBusy(false);
                onSetNavLocked(false);
              }, 600),
            );
          });
        });
      }, 550),
    );
  }

  function handleAnswerTap() {
    if (rangeBusy || rangeStage !== "answer" || answerFlipped || !rangeActive)
      return;
    if (typeof playSound === "function") playSound("click");
    setShowAnswerNudge(false);
    setAnswerFlipped(true);
    setRangeBusy(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        setRangeCollapsed(true);
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current) return;
            finishRangeFly();
          }, 1000),
        );
      }, 1050),
    );
  }

  function finishRangeFly() {
    var id = rangeActive;
    if (!id) return;
    var cfg = RANGE_CFG[id];
    var svg = cfg.graph === "left" ? leftSvgRef.current : rightSvgRef.current;
    var dest = svg ? svg.querySelector(".range-label-anchor-" + cfg.id) : null;
    flyNumberToEl(answerBtnRef.current, dest, fmtNum(cfg.result), function () {
      if (!mountedRef.current) return;
      if (id === "pop") {
        patchSide(setPopLabel, "left", cfg.result);
        patchSide(setPopArrow, "right", true);
        patchSide(setPopMaxLine, "right", true);
        patchSide(setPopMinLine, "right", true);
        patchSide(setPopLabel, "right", cfg.result);
      } else if (id === "s1") setS1Label(cfg.result);
      else setS2Label(cfg.result);
      addTimer(
        setTimeout(function () {
          if (!mountedRef.current) return;
          setRangeGone(function (prev) {
            var next = Object.assign({}, prev);
            next[id] = true;
            return next;
          });
          setRangeCompleted(function (prev) {
            var next = Object.assign({}, prev);
            next[id] = true;
            rangeCompletedRef.current = next;
            return next;
          });
          runGraphFocusOut(id, function () {
            if (!mountedRef.current) return;
            setRangeActive(null);
            setRangePending(null);
            setRangeStage("idle");
            setShowAnswerSlot(false);
            setAnswerFlipped(false);
            setRangeCollapsed(false);
            setHighClicked(false);
            setLowClicked(false);
            setHighValue(null);
            setLowValue(null);
            setRangeBusy(false);
            onSetNavLocked(false);
            var completedNow = rangeCompletedRef.current;
            if (completedNow.pop && completedNow.s1 && completedNow.s2) {
              setRangeAllDone(true);
              onUpdateNavText(copy.steps.C1.afterAllNav);
              onSetNextEnabled(true);
            } else {
              onUpdateNavText(copy.steps.C1.navRemaining);
              setShowRangeNudges(true);
            }
          });
        }, 500),
      );
    });
  }

  function meanBtnRefFor(id) {
    if (id === "pop") return meanPopBtnRef;
    if (id === "s1") return meanS1BtnRef;
    return meanS2BtnRef;
  }

  function meanActiveSvg(cfg) {
    return cfg.graph === "left" ? leftSvgRef.current : rightSvgRef.current;
  }

  function dimPrevFiLabels() {
    setMeanFiLabels(function (prev) {
      var next = {};
      Object.keys(prev).forEach(function (k) {
        next[k] = Object.assign({}, prev[k], { dim: true });
      });
      return next;
    });
  }

  function highlightMeanBar(bar) {
    setMeanHighlight(bar.x);
    setMeanGuide({ x: bar.x, f: bar.f });
    setMeanFiLabels(function (prev) {
      var next = Object.assign({}, prev);
      next[bar.x] = { value: bar.f, dim: false };
      return next;
    });
  }

  function undimAllFiLabels() {
    setMeanFiLabels(function (prev) {
      var next = {};
      Object.keys(prev).forEach(function (k) {
        next[k] = Object.assign({}, prev[k], { dim: false });
      });
      return next;
    });
  }

  function handleMeanClick(id) {
    if (
      !isB1 ||
      meanBusy ||
      meanActive ||
      meanPending ||
      meanGone[id] ||
      !meanReady
    )
      return;
    if (typeof playSound === "function") playSound("click");
    var cfg = MEAN_CFG[id];
    setShowMeanNudges(false);
    setMeanBusy(true);
    setMeanNumFlipped(false);
    setMeanDenFlipped(false);
    setMeanAnsFlipped(false);
    setMeanShowAnswer(false);
    setMeanCollapsed(false);
    setMeanNumDone(false);
    setMeanDenDone(false);
    setMeanEq(EMPTY_MEAN_EQ);
    setMeanDenEq(EMPTY_MEAN_EQ);
    setMeanHighlight(null);
    setMeanDimBars(false);
    setMeanGuide(null);
    setMeanFiLabels({});
    onSetNavLocked(true);
    onUpdateNavText(" ");
    runGraphFocusIn(id, function () {
      if (!mountedRef.current) return;
      setMeanActive(id);
      setMeanPending(null);
      setMeanStage("num");
      onUpdateNavText(copy.steps.B1.navNumerator);
      setShowMeanNumNudge(true);
      setMeanBusy(false);
      onSetNavLocked(false);
    });
  }

  function handleMeanNumTap() {
    if (meanBusy || meanStage !== "num" || meanNumFlipped || !meanActive)
      return;
    if (typeof playSound === "function") playSound("click");
    setShowMeanNumNudge(false);
    setMeanNumFlipped(true);
    setMeanBusy(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    setMeanDimBars(true);
    setMeanEq(EMPTY_MEAN_EQ);
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        runNumeratorBar(MEAN_CFG[meanActive], 0, 0, function () {
          if (!mountedRef.current) return;
          addTimer(
            setTimeout(function () {
              if (!mountedRef.current) return;
              setMeanNumDone(true);
              setMeanHighlight(null);
              setMeanGuide(null);
              setMeanDimBars(false);
              undimAllFiLabels();
              setMeanStage("den");
              onUpdateNavText(copy.steps.B1.navDenominator);
              setShowMeanDenNudge(true);
              setMeanBusy(false);
              onSetNavLocked(false);
            }, 600),
          );
        });
      }, 550),
    );
  }

  function patchLastNumTerm(patch, extra) {
    setMeanEq(function (prev) {
      var terms = cloneMeanTerms(prev.terms);
      if (terms.length) Object.assign(terms[terms.length - 1], patch);
      return Object.assign({}, prev, extra || {}, { terms: terms });
    });
  }

  function runNumeratorBar(cfg, index, running, done) {
    var bars = cfg.bars;
    var bar = bars[index];
    dimPrevFiLabels();
    setMeanGuide(null);
    addTimer(
      setTimeout(
        function () {
          if (!mountedRef.current) return;
          highlightMeanBar(bar);
          addTimer(
            setTimeout(function () {
              if (!mountedRef.current) return;
              var svg = meanActiveSvg(cfg);
              var xEl = svg ? svg.querySelector(".x-label-" + bar.x) : null;
              var fiEl = svg ? svg.querySelector(".mean-fi-" + bar.x) : null;
              var newTotal = running + bar.xf;

              function startNumFly() {
                if (!mountedRef.current) return;
                var left = 2;
                function landed() {
                  left -= 1;
                  if (left > 0) return;
                  patchLastNumTerm(
                    {
                      x: String(bar.x),
                      f: String(bar.f),
                      visX: 1,
                      visF: 1,
                      open: true,
                    },
                    { t: String(newTotal), visT: 1, visInner: 1 },
                  );
                  continueNum(cfg, index, newTotal, done);
                }
                flyFromEl(xEl, eqARef.current, bar.x, function () {
                  patchLastNumTerm({ x: String(bar.x), visX: 1 });
                  landed();
                });
                flyFromEl(fiEl, eqMRef.current, bar.f, function () {
                  patchLastNumTerm({ f: String(bar.f), visF: 1 });
                  landed();
                });
              }

              if (index === 0) {
                setMeanEq({
                  terms: [emptyNumTerm(true)],
                  t: "",
                  visT: 0,
                  visInner: 1,
                  sumOnly: false,
                });
                addTimer(setTimeout(startNumFly, 40));
              } else {
                setMeanEq(function (prev) {
                  return Object.assign({}, prev, {
                    terms: cloneMeanTerms(prev.terms).concat([
                      emptyNumTerm(false),
                    ]),
                    visInner: 1,
                  });
                });
                addTimer(
                  setTimeout(function () {
                    if (!mountedRef.current) return;
                    patchLastNumTerm({ open: true });
                    addTimer(setTimeout(startNumFly, 420));
                  }, 30),
                );
              }
            }, 280),
          );
        },
        index === 0 ? 80 : 220,
      ),
    );
  }

  function continueNum(cfg, index, newTotal, done) {
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        if (index + 1 >= cfg.bars.length) {
          addTimer(
            setTimeout(function () {
              if (!mountedRef.current) return;
              setMeanEq(
                Object.assign({}, EMPTY_MEAN_EQ, {
                  t: String(cfg.sumXF),
                  visT: 1,
                  visInner: 1,
                  sumOnly: true,
                }),
              );
              if (typeof playSound === "function") playSound("correct");
              setMeanHighlight(null);
              setMeanGuide(null);
              if (done) done();
            }, 600),
          );
          return;
        }
        runNumeratorBar(cfg, index + 1, newTotal, done);
      }, 350),
    );
  }

  function handleMeanDenTap() {
    if (meanBusy || meanStage !== "den" || meanDenFlipped || !meanActive)
      return;
    if (typeof playSound === "function") playSound("click");
    setShowMeanDenNudge(false);
    setMeanDenFlipped(true);
    setMeanBusy(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    setMeanDimBars(true);
    setMeanHighlight(null);
    setMeanGuide(null);
    dimPrevFiLabels();
    setMeanDenEq(EMPTY_MEAN_EQ);
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        runDenominatorBar(MEAN_CFG[meanActive], 0, 0, function () {
          if (!mountedRef.current) return;
          addTimer(
            setTimeout(function () {
              if (!mountedRef.current) return;
              setMeanDenDone(true);
              setMeanHighlight(null);
              setMeanGuide(null);
              setMeanDimBars(false);
              setMeanFiLabels({});
              setMeanShowAnswer(true);
              setMeanStage("answer");
              onUpdateNavText(copy.steps.B1.navReveal);
              setShowMeanAnsNudge(true);
              setMeanBusy(false);
              onSetNavLocked(false);
            }, 600),
          );
        });
      }, 550),
    );
  }

  function patchLastDenTerm(patch, extra) {
    setMeanDenEq(function (prev) {
      var terms = cloneMeanTerms(prev.terms);
      if (terms.length) Object.assign(terms[terms.length - 1], patch);
      return Object.assign({}, prev, extra || {}, { terms: terms });
    });
  }

  function runDenominatorBar(cfg, index, running, done) {
    var bars = cfg.bars;
    var bar = bars[index];
    dimPrevFiLabels();
    setMeanGuide(null);
    addTimer(
      setTimeout(
        function () {
          if (!mountedRef.current) return;
          highlightMeanBar(bar);
          addTimer(
            setTimeout(function () {
              if (!mountedRef.current) return;
              var svg = meanActiveSvg(cfg);
              var fiEl = svg ? svg.querySelector(".mean-fi-" + bar.x) : null;
              var newTotal = running + bar.f;

              function removeFiSource() {
                setMeanFiLabels(function (prev) {
                  var next = Object.assign({}, prev);
                  delete next[bar.x];
                  return next;
                });
              }

              function startDenFly() {
                if (!mountedRef.current) return;
                flyFromEl(fiEl, eqDenARef.current, bar.f, function () {
                  patchLastDenTerm(
                    { f: String(bar.f), visF: 1, open: true },
                    { t: String(newTotal), visT: 1, visInner: 1 },
                  );
                  continueDen(cfg, index, newTotal, done);
                });
                removeFiSource();
              }

              if (index === 0) {
                setMeanDenEq({
                  terms: [emptyDenTerm(true)],
                  t: "",
                  visT: 0,
                  visInner: 1,
                  sumOnly: false,
                });
                addTimer(setTimeout(startDenFly, 40));
              } else {
                setMeanDenEq(function (prev) {
                  return Object.assign({}, prev, {
                    terms: cloneMeanTerms(prev.terms).concat([
                      emptyDenTerm(false),
                    ]),
                    visInner: 1,
                  });
                });
                addTimer(
                  setTimeout(function () {
                    if (!mountedRef.current) return;
                    patchLastDenTerm({ open: true });
                    addTimer(setTimeout(startDenFly, 420));
                  }, 30),
                );
              }
            }, 280),
          );
        },
        index === 0 ? 80 : 220,
      ),
    );
  }

  function continueDen(cfg, index, newTotal, done) {
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        if (index + 1 >= cfg.bars.length) {
          addTimer(
            setTimeout(function () {
              if (!mountedRef.current) return;
              setMeanDenEq(
                Object.assign({}, EMPTY_MEAN_EQ, {
                  t: String(cfg.sumF),
                  visT: 1,
                  visInner: 1,
                  sumOnly: true,
                }),
              );
              if (typeof playSound === "function") playSound("correct");
              setMeanHighlight(null);
              setMeanGuide(null);
              if (done) done();
            }, 600),
          );
          return;
        }
        runDenominatorBar(cfg, index + 1, newTotal, done);
      }, 280),
    );
  }

  function handleMeanAnsTap() {
    if (meanBusy || meanStage !== "answer" || meanAnsFlipped || !meanActive)
      return;
    if (typeof playSound === "function") playSound("click");
    setShowMeanAnsNudge(false);
    setMeanAnsFlipped(true);
    setMeanBusy(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    addTimer(
      setTimeout(function () {
        if (!mountedRef.current) return;
        setMeanCollapsed(true);
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current) return;
            finishMeanFly();
          }, 1000),
        );
      }, 1050),
    );
  }

  function finishMeanFly() {
    var id = meanActive;
    if (!id) return;
    var cfg = MEAN_CFG[id];
    var svg = meanActiveSvg(cfg);
    var dest = svg
      ? svg.querySelector(".mean-label-anchor-" + cfg.id + "-" + cfg.graph)
      : null;
    function afterLabel() {
      if (!mountedRef.current) return;
      growMeanLineRef.current = {
        id: cfg.id,
        side: cfg.graph,
        onDone: function () {
          if (!mountedRef.current) return;
          if (id === "pop") {
            patchSide(setPopMeanMark, "right", true);
          }
          addTimer(
            setTimeout(function () {
              if (!mountedRef.current) return;
              setMeanGone(function (prev) {
                var next = Object.assign({}, prev);
                next[id] = true;
                return next;
              });
              meanCompletedRef.current[id] = true;
              runGraphFocusOut(id, function () {
                if (!mountedRef.current) return;
                setMeanActive(null);
                setMeanPending(null);
                setMeanStage("idle");
                setMeanShowAnswer(false);
                setMeanAnsFlipped(false);
                setMeanCollapsed(false);
                setMeanNumFlipped(false);
                setMeanDenFlipped(false);
                setMeanBusy(false);
                onSetNavLocked(false);
                var completedNow = meanCompletedRef.current;
                if (completedNow.pop && completedNow.s1 && completedNow.s2) {
                  setMeanAllDone(true);
                  onUpdateNavText(copy.steps.B1.afterAllNav);
                  onSetNextEnabled(true);
                } else {
                  onUpdateNavText(copy.steps.B1.navRemaining);
                  setShowMeanNudges(true);
                }
              });
            }, 500),
          );
        },
      };
      if (id === "pop") patchSide(setPopMeanMark, "left", true);
      else if (id === "s1") setS1MeanMark(true);
      else setS2MeanMark(true);
    }

    if (!dest) {
      afterLabel();
      return;
    }
    flyNumberToEl(meanAnsBtnRef.current, dest, fmtNum(cfg.mean), afterLabel);
  }

  function setLeftPathsBlink(mode) {
    applyBlink(
      leftPopPathRef.current,
      leftPopFillRef.current,
      mode,
      colors.popStroke,
    );
    applyBlink(
      leftSamPathRef.current,
      leftSamFillRef.current,
      mode,
      colors.s1Stroke,
    );
  }

  function setRightPathsBlink(mode) {
    applyBlink(
      rightPopPathRef.current,
      rightPopFillRef.current,
      mode,
      colors.popStroke,
    );
    applyBlink(
      rightSamPathRef.current,
      rightSamFillRef.current,
      mode,
      colors.s2Stroke,
    );
  }

  function handleMcq(side, option) {
    if (mcqBusy) return;
    var mcqCopy = isC2 ? copy.steps.C2 : isB2 ? copy.steps.B2 : copy.steps.A2;
    var s1BoxEl = isC2
      ? spreadS1BoxRef.current
      : isB2
        ? centreS1BoxRef.current
        : shapeS1BoxRef.current;
    var s2BoxEl = isC2
      ? spreadS2BoxRef.current
      : isB2
        ? centreS2BoxRef.current
        : shapeS2BoxRef.current;
    var setS1BoxVisible = isC2
      ? setShowSpreadS1Box
      : isB2
        ? setShowCentreS1Box
        : setShowShapeS1Box;
    var setS2BoxVisible = isC2
      ? setShowSpreadS2Box
      : isB2
        ? setShowCentreS2Box
        : setShowShapeS2Box;
    var isShapeMcq = isA2;
    if (side === "s1") {
      if (s1Locked || mcqTarget !== "s1") return;
      if (s1Retry && option !== "fail") return;
      if (typeof playSound === "function") playSound("click");
      scheduleMcqIdleTeeter();
      setS1Selected(option);
      if (option !== "fail") {
        if (typeof playSound === "function") playSound("wrong");
        if (isShapeMcq) setLeftPathsBlink("red");
        setS1Retry(true);
        setFeedbackSide("right");
        return;
      }
      if (typeof playSound === "function") playSound("correct");
      if (isShapeMcq) setLeftPathsBlink("red");
      setFeedbackSide(null);
      setS1Locked(true);
      setMcqBusy(true);
      onSetNavLocked(true);
      onUpdateNavText(" ");
      flyThumbToBox(s1FailBtnRef.current, s1BoxEl, "👎", function () {
        if (!mountedRef.current) return;
        setS1BoxVisible(true);
        addTimer(
          setTimeout(function () {
            if (!mountedRef.current) return;
            if (isShapeMcq) setLeftPathsBlink("normal");
            setMcqTarget("s2");
            onUpdateQuestionText(mcqCopy.questionTextS2);
            onUpdateNavText(mcqCopy.navText);
            setMcqBusy(false);
            onSetNavLocked(false);
          }, 1000),
        );
      });
      return;
    }

    if (s2Locked || mcqTarget !== "s2") return;
    if (s2Retry && option !== "pass") return;
    if (typeof playSound === "function") playSound("click");
    scheduleMcqIdleTeeter();
    setS2Selected(option);
    if (option !== "pass") {
      if (typeof playSound === "function") playSound("wrong");
      if (isShapeMcq) setRightPathsBlink("green");
      setS2Retry(true);
      setFeedbackSide("left");
      return;
    }
    if (typeof playSound === "function") playSound("correct");
    if (isShapeMcq) setRightPathsBlink("green");
    setFeedbackSide(null);
    setS2Locked(true);
    setMcqBusy(true);
    onSetNavLocked(true);
    onUpdateNavText(" ");
    flyThumbToBox(s2PassBtnRef.current, s2BoxEl, "👍", function () {
      if (!mountedRef.current) return;
      setS2BoxVisible(true);
      setMcqTarget("done");
      if (isShapeMcq) setLeftPathsBlink("red");
      if (isShapeMcq) setRightPathsBlink("green");
      onUpdateQuestionText(mcqCopy.afterBothQuestion);
      var allTestsDone = completedTests.length >= 2;
      onUpdateNavText(
        allTestsDone ? copy.steps[3].allDoneNav : mcqCopy.afterBothNav,
      );
      onSetNextEnabled(true);
      setMcqBusy(false);
      onSetNavLocked(false);
    });
  }

  function renderAxes(layout, yStep, dimXOpts) {
    var items = [];
    items.push(
      e("line", {
        key: "ya",
        x1: ML,
        y1: layout.yP(layout.yMax),
        x2: ML,
        y2: layout.baseY,
        stroke: "white",
        strokeWidth: 1.5,
      }),
    );
    items.push(
      e("line", {
        key: "xa",
        x1: ML,
        y1: layout.baseY,
        x2: ML + layout.pW,
        y2: layout.baseY,
        stroke: "white",
        strokeWidth: 1.5,
      }),
    );
    for (var yv = 0; yv <= layout.yMax; yv += yStep) {
      var yy = layout.yP(yv);
      items.push(
        e(
          "text",
          {
            key: "yl" + yv,
            x: ML - 12,
            y: yy + 8,
            textAnchor: "end",
            fill: "#ffffff",
            fontSize: AXIS_LABEL_SIZE,
            fontWeight: 600,
          },
          yv,
        ),
      );
      items.push(
        e("line", {
          key: "yt" + yv,
          x1: ML - 8,
          y1: yy,
          x2: ML,
          y2: yy,
          stroke: "white",
          strokeWidth: Y_TICK_STROKE,
        }),
      );
    }
    for (var xv = 1; xv <= 12; xv++) {
      var xLabelFill = "#ffffff";
      if (dimXOpts && dimXOpts.dim) {
        xLabelFill = xv === dimXOpts.highlightX ? "#ffffff" : "rgba(255,255,255,0.22)";
      }
      items.push(
        e(
          "text",
          {
            key: "xl" + xv,
            className: "x-label x-label-" + xv,
            x: layout.xP(xv),
            y: layout.baseY + 30,
            textAnchor: "middle",
            fill: xLabelFill,
            fontSize: AXIS_LABEL_SIZE,
            fontWeight: 600,
          },
          xv,
        ),
      );
    }
    items.push(
      e("circle", {
        key: "origin",
        className: "plot-origin",
        cx: ML,
        cy: layout.baseY,
        r: 0.5,
        fill: "none",
        opacity: 0,
      }),
    );
    items.push(
      e("circle", {
        key: "yunit",
        className: "plot-y-unit",
        cx: ML,
        cy: layout.yP(1),
        r: 0.5,
        fill: "none",
        opacity: 0,
      }),
    );
    return items;
  }

  function renderBars(data, layout, color, keyPrefix, opts) {
    var prefix = keyPrefix || "b";
    opts = opts || {};
    return data.map(function (d, i) {
      if (!d.y) return null;
      var isHi = opts.highlightX === d.x;
      var opacity = opts.dim ? (isHi ? 1 : 0.22) : 1;
      return e("rect", {
        key: prefix + i,
        className: "mean-bar mean-bar-" + d.x,
        x: layout.xP(d.x) - layout.barW / 2,
        y: layout.yP(d.y),
        width: layout.barW,
        height: d.y * layout.ySc,
        fill: isHi && opts.bright ? opts.bright : color,
        opacity: opacity,
      });
    });
  }

  function arrowHead(x, y, dir, color, key) {
    var s = 20;
    return e("polygon", {
      key: key,
      points: [x, y, x - dir * s, y - 10, x - dir * s, y + 10].join(" "),
      fill: color,
    });
  }

  function renderRangeOverlay(cfg, yVal, showArrow, showMax, showMin, label) {
    if (
      !showArrow &&
      !showMax &&
      !showMin &&
      (label === null || label === undefined)
    ) {
      return null;
    }
    var x0 = popLayout.xP(cfg.min);
    var x1 = popLayout.xP(cfg.max);
    var ay = popLayout.yP(yVal);
    var vlineColor = cfg.vline || "#7ee7f2";
    var kids = [];
    if (showMax) {
      kids.push(
        e("line", {
          key: "vmax",
          className: "range-vline-grow-max-" + cfg.id,
          x1: x1,
          y1: popLayout.baseY,
          x2: x1,
          y2: ay,
          stroke: vlineColor,
          strokeWidth: 4,
          strokeDasharray: "10 7",
        }),
      );
    }
    if (showMin) {
      kids.push(
        e("line", {
          key: "vmin",
          className: "range-vline-grow-min-" + cfg.id,
          x1: x0,
          y1: popLayout.baseY,
          x2: x0,
          y2: ay,
          stroke: vlineColor,
          strokeWidth: 4,
          strokeDasharray: "10 7",
        }),
      );
    }
    if (showArrow) {
      kids.push(
        e(
          "g",
          { key: "arrow", className: "range-arrow-grow-" + cfg.id },
          e("line", {
            x1: x0 + 18,
            y1: ay,
            x2: x1 - 18,
            y2: ay,
            stroke: cfg.arrow,
            strokeWidth: 5,
            strokeDasharray: "12 9",
          }),
          arrowHead(x0, ay, -1, cfg.arrow, "hl"),
          arrowHead(x1, ay, 1, cfg.arrow, "hr"),
        ),
      );
    }
    var w = 80;
    var h = 46;
    var fontSize = 33;
    var cx = (x0 + x1) / 2;
    var cy = ay - h / 2 - 8;
    kids.push(
      e("circle", {
        key: "anchor",
        className: "range-label-anchor-" + cfg.id,
        cx: cx,
        cy: cy,
        r: 2,
        fill: "none",
      }),
    );
    if (label !== null && label !== undefined) {
      kids.push(
        e("rect", {
          key: "vb",
          x: cx - w / 2,
          y: cy - h / 2,
          width: w,
          height: h,
          rx: 12,
          fill: cfg.valueFill,
          stroke: "rgba(255,255,255,0.72)",
          strokeWidth: 1.8,
        }),
      );
      kids.push(
        e(
          "text",
          {
            key: "vt",
            x: cx,
            y: cy + 12,
            textAnchor: "middle",
            fill: "#ffffff",
            fontSize: fontSize,
            fontWeight: 700,
          },
          fmtNum(label),
        ),
      );
    }
    return e("g", { key: "range-" + cfg.id }, kids);
  }

  function renderMeanOverlay(cfg, show, side) {
    var x = popLayout.xP(cfg.mean);
    var yTop = popLayout.yP(popLayout.yMax);
    var yBot = popLayout.baseY;
    var w = cfg.id === "pop" ? 86 : 80;
    var h = 43;
    var fontSize = 30;
    var labelY =
      cfg.id === "pop"
        ? yTop + h / 2 + 4
        : popLayout.yP(11) + h / 2 + 4;
    var dash = cfg.id === "s1" ? "12 6 3 6" : "12 9";
    var kids = [];

    var shiftX = w * 0.47;
    var boxX =
      cfg.id === "pop"
        ? x - w / 2 - shiftX
        : x - w / 2 + shiftX;
    var textX = boxX + w / 2;
    var boxTop = labelY - h / 2;
    var boxBottom = boxTop + h;

    kids.push(
      e("circle", {
        key: "anchor",
        className: "mean-label-anchor-" + cfg.id + "-" + side,
        cx: textX,
        cy: labelY,
        r: 2,
        fill: "none",
      }),
    );
    if (!show) {
      return e("g", { key: "mean-" + cfg.id + "-" + side }, kids);
    }
    kids.push(
      e("line", {
        key: "mv",
        className: "mean-vline-grow-" + cfg.id + "-" + side,
        x1: x,
        y1: yBot,
        x2: x,
        y2: boxBottom,
        stroke: cfg.line,
        strokeWidth: 4.4,
        strokeDasharray: dash,
      }),
    );
    kids.push(
      e("rect", {
        key: "vb",
        x: boxX,
        y: boxTop,
        width: w,
        height: h,
        rx: 12,
        fill: cfg.valueFill,
        stroke: "rgba(255,255,255,0.72)",
        strokeWidth: 1.8,
      }),
    );
    kids.push(
      e(
        "text",
        {
          key: "vt",
          x: textX,
          y: labelY + 11,
          textAnchor: "middle",
          fill: "#ffffff",
          fontSize: fontSize,
          fontWeight: 700,
        },
        fmtNum(cfg.mean),
      ),
    );
    return e("g", { key: "mean-" + cfg.id + "-" + side }, kids);
  }

  function renderMeanGuides(layout, cfg) {
    if (!cfg) return null;
    var kids = [];
    if (meanGuide && meanGuide.x) {
      var gy = layout.yP(meanGuide.f);
      kids.push(
        e("line", {
          key: "guide",
          x1: ML,
          y1: gy,
          x2: layout.xP(meanGuide.x) - layout.barW / 2,
          y2: gy,
          stroke: "#ffffff",
          strokeWidth: 1.6,
        }),
      );
    }
    Object.keys(meanFiLabels).forEach(function (k) {
      var info = meanFiLabels[k];
      var x = Number(k);
      kids.push(
        e(
          "text",
          {
            key: "fi" + k,
            className: "mean-fi mean-fi-" + x,
            x: layout.xP(x),
            y: layout.yP(info.value) - 8,
            textAnchor: "middle",
            fill: info.dim ? "rgba(255,255,255,0.42)" : "#ffffff",
            fontSize: AXIS_LABEL_SIZE,
            fontWeight: 700,
          },
          String(info.value),
        ),
      );
    });
    if (!kids.length) return null;
    return e("g", { key: "mean-guides" }, kids);
  }

  function renderSampleGraph(kind) {
    var isS1 = kind === "s1";
    var data = isS1 ? s1Data : s2Data;
    var color = isS1 ? colors.s1Bar : colors.s2Bar;
    var svgRef = isS1 ? s1SvgRef : s2SvgRef;
    var ch = renderAxes(samLayout, GRAPH_DATA.sampleYRange.step);
    ch.push.apply(ch, renderBars(data, samLayout, color, kind + "-b"));
    return e(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_W + " " + SAM_SVG_H,
        className: "bar-graph-svg",
        preserveAspectRatio: "none",
      },
      ch,
    );
  }

  function renderPopGraph(side) {
    var isLeft = side === "left";
    var svgRef = isLeft ? leftSvgRef : rightSvgRef;
    var sampleData = isLeft ? s1Data : s2Data;
    var sampleColor = isLeft ? colors.s1Bar : colors.s2Bar;
    var sampleStroke = isLeft ? colors.s1Stroke : colors.s2Stroke;
    var sampleFill = isLeft ? colors.s1Fill : colors.s2Fill;
    var samplePathD = isLeft ? s1PathD : s2PathD;
    var sampleFillD = isLeft ? s1FillD : s2FillD;
    var popPathRef = isLeft ? leftPopPathRef : rightPopPathRef;
    var popFillRef = isLeft ? leftPopFillRef : rightPopFillRef;
    var popClipRef = isLeft ? leftPopClipRef : rightPopClipRef;
    var samPathRef = isLeft ? leftSamPathRef : rightSamPathRef;
    var samFillRef = isLeft ? leftSamFillRef : rightSamFillRef;
    var samClipRef = isLeft ? leftSamClipRef : rightSamClipRef;
    var popClipId = "pop-clip-" + side;
    var samClipId = "sam-clip-" + side;

    var ch = [];
    ch.push(
      e(
        "defs",
        { key: "defs" },
        e(
          "clipPath",
          { id: popClipId },
          e("rect", {
            ref: popClipRef,
            x: 0,
            y: 0,
            width: SVG_W,
            height: 0,
          }),
        ),
        e(
          "clipPath",
          { id: samClipId },
          e("rect", {
            ref: samClipRef,
            x: 0,
            y: 0,
            width: SVG_W,
            height: 0,
          }),
        ),
      ),
    );
    var popBarOpts = {};
    var sampleBarOpts = {};
    var workingMean = meanActive || meanPending;
    var axisDimOpts = null;
    var isDenStage = meanStage === "den" || meanStage === "answer";
    if (meanDimBars && workingMean === "pop") {
      popBarOpts.dim = true;
      popBarOpts.highlightX = meanHighlight;
      popBarOpts.bright = MEAN_CFG.pop.bright;
      axisDimOpts = { dim: true, highlightX: isDenStage ? null : meanHighlight };
    }
    if (
      meanDimBars &&
      ((workingMean === "s1" && isLeft) || (workingMean === "s2" && !isLeft))
    ) {
      sampleBarOpts.dim = true;
      sampleBarOpts.highlightX = meanHighlight;
      sampleBarOpts.bright = MEAN_CFG[workingMean].bright;
      axisDimOpts = { dim: true, highlightX: isDenStage ? null : meanHighlight };
    }
    ch.push.apply(ch, renderAxes(popLayout, GRAPH_DATA.popYRange.step, axisDimOpts));
    var hideSample =
      (isLeft && hideLeftSample) || (!isLeft && hideRightSample);
    var dimPop =
      (drawFocus === "s1" && isLeft) || (drawFocus === "s2" && !isLeft);
    var dimSample = drawFocus === "pop";
    var popSeriesOp = hidePopBars ? 0 : dimPop ? 0.2 : 1;
    var samSeriesOp = hideSample ? 0 : dimSample ? 0.2 : 1;
    function seriesStyle(op) {
      return { opacity: op, transition: "opacity 0.4s ease" };
    }
    ch.push(
      e(
        "g",
        { key: "pop-series", style: seriesStyle(popSeriesOp) },
        renderBars(popData, popLayout, colors.popBar, "pop-b", popBarOpts),
        e("path", {
          key: "pf",
          ref: popFillRef,
          d: popFillD,
          fill: colors.popFill,
          opacity: 0,
          clipPath: "url(#" + popClipId + ")",
        }),
      ),
    );
    if (showOverlap) {
      ch.push(
        e(
          "g",
          { key: "sam-series", style: seriesStyle(samSeriesOp) },
          renderBars(
            sampleData,
            popLayout,
            sampleColor,
            "sam-b",
            sampleBarOpts,
          ),
          e("path", {
            key: "sf",
            ref: samFillRef,
            d: sampleFillD,
            fill: sampleFill,
            opacity: 0,
            clipPath: "url(#" + samClipId + ")",
          }),
        ),
      );
    }
    ch.push(
      e(
        "g",
        { key: "pop-outline", style: seriesStyle(popSeriesOp) },
        e("path", {
          key: "pp",
          ref: popPathRef,
          d: popPathD,
          fill: "none",
          stroke: colors.popStroke,
          strokeWidth: PATH_W,
          strokeLinejoin: "round",
          strokeLinecap: "round",
          opacity: 0,
        }),
      ),
    );
    ch.push(
      e(
        "g",
        { key: "sam-outline", style: seriesStyle(samSeriesOp) },
        e("path", {
          key: "sp",
          ref: samPathRef,
          d: samplePathD,
          fill: "none",
          stroke: sampleStroke,
          strokeWidth: PATH_W,
          strokeLinejoin: "round",
          strokeLinecap: "round",
          opacity: 0,
        }),
      ),
    );

    if (isLeft) {
      ch.push(
        e(
          "g",
          {
            key: "range-pop-left",
            style: {
              opacity: hidePopBars ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderRangeOverlay(
            RANGE_CFG.pop,
            ARROW_Y_POP,
            popArrow.left,
            popMaxLine.left,
            popMinLine.left,
            popLabel.left,
          ),
        ),
      );
      ch.push(
        e(
          "g",
          {
            key: "range-s1-left",
            style: {
              opacity: hideLeftSample ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderRangeOverlay(
            RANGE_CFG.s1,
            ARROW_Y_SAMPLE,
            s1Arrow,
            s1MaxLine,
            s1MinLine,
            s1Label,
          ),
        ),
      );
      var leftMeanCfg =
        workingMean === "pop"
          ? MEAN_CFG.pop
          : workingMean === "s1"
            ? MEAN_CFG.s1
            : null;
      ch.push(renderMeanGuides(popLayout, leftMeanCfg));
      ch.push(
        e(
          "g",
          {
            key: "mean-pop-left",
            style: {
              opacity: hidePopBars ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderMeanOverlay(MEAN_CFG.pop, popMeanMark.left, "left"),
        ),
      );
      ch.push(
        e(
          "g",
          {
            key: "mean-s1-left",
            style: {
              opacity: hideLeftSample ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderMeanOverlay(MEAN_CFG.s1, s1MeanMark, "left"),
        ),
      );
    } else {
      ch.push(
        e(
          "g",
          {
            key: "range-pop-right",
            style: {
              opacity: hidePopBars ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderRangeOverlay(
            RANGE_CFG.pop,
            ARROW_Y_POP,
            popArrow.right,
            popMaxLine.right,
            popMinLine.right,
            popLabel.right,
          ),
        ),
      );
      ch.push(
        e(
          "g",
          {
            key: "range-s2-right",
            style: {
              opacity: hideRightSample ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderRangeOverlay(
            RANGE_CFG.s2,
            ARROW_Y_SAMPLE,
            s2Arrow,
            s2MaxLine,
            s2MinLine,
            s2Label,
          ),
        ),
      );
      var rightMeanCfg =
        workingMean === "pop"
          ? MEAN_CFG.pop
          : workingMean === "s2"
            ? MEAN_CFG.s2
            : null;
      ch.push(renderMeanGuides(popLayout, rightMeanCfg));
      ch.push(
        e(
          "g",
          {
            key: "mean-pop-right",
            style: {
              opacity: hidePopBars ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderMeanOverlay(MEAN_CFG.pop, popMeanMark.right, "right"),
        ),
      );
      ch.push(
        e(
          "g",
          {
            key: "mean-s2-right",
            style: {
              opacity: hideRightSample ? 0 : 1,
              transition: "opacity 0.4s ease",
            },
          },
          renderMeanOverlay(MEAN_CFG.s2, s2MeanMark, "right"),
        ),
      );
    }

    return e(
      "svg",
      {
        ref: svgRef,
        viewBox: "0 0 " + SVG_W + " " + (POP_SVG_H+6),
        className: "bar-graph-svg",
        preserveAspectRatio: "none",
      },
      ch,
    );
  }

  function mcqBtnClass(side, option) {
    var cls = "mcq-btn";
    var selected = side === "s1" ? s1Selected : s2Selected;
    var retry = side === "s1" ? s1Retry : s2Retry;
    var locked = side === "s1" ? s1Locked : s2Locked;
    var correct = side === "s1" ? "fail" : "pass";
    if (selected === option) {
      cls += option === correct ? " correct" : " wrong";
    }
    if (retry && option !== correct) cls += " wrong";
    if (locked || isDrawing || mcqBusy) cls += " disabled";
    return cls;
  }

  function mcqDisabled(side, option) {
    if (isDrawing || mcqBusy) return true;
    if (side === "s1") {
      if (s1Locked || mcqTarget !== "s1") return true;
      if (s1Retry && option !== "fail") return true;
      return false;
    }
    if (s2Locked || mcqTarget !== "s2") return true;
    if (s2Retry && option !== "pass") return true;
    return false;
  }

  function renderMcqHalf(side) {
    var dim = mcqTarget !== "done" && side !== mcqTarget;
    var cls = "mcq-half";
    if (dim) cls += " is-dim";
    return e(
      "div",
      {
        className: cls,
        ref: side === "s1" ? mcqS1HalfRef : mcqS2HalfRef,
      },
      e(
        "button",
        {
          ref: side === "s1" ? undefined : s2PassBtnRef,
          className: mcqBtnClass(side, "pass"),
          disabled: mcqDisabled(side, "pass"),
          onClick: mcqDisabled(side, "pass")
            ? undefined
            : function () {
                handleMcq(side, "pass");
              },
        },
        btns.pass,
      ),
      e(
        "button",
        {
          ref: side === "s1" ? s1FailBtnRef : undefined,
          className: mcqBtnClass(side, "fail"),
          disabled: mcqDisabled(side, "fail"),
          onClick: mcqDisabled(side, "fail")
            ? undefined
            : function () {
                handleMcq(side, "fail");
              },
        },
        btns.fail,
      ),
    );
  }

  function runStep3Animation() {
    if (!mountedRef.current) return;
    var tableEl = step3TableRef.current;
    var shapeEl = shapeBtnRef.current;
    var centreEl = centreBtnRef.current;
    var spreadEl = spreadBtnRef.current;
    var rows = tableEl ? tableEl.querySelectorAll(".step3-data-row") : [];
    if (!tableEl || !shapeEl || !centreEl || !spreadEl || rows.length < 3) {
      if (step3AnimTriesRef.current < 40) {
        step3AnimTriesRef.current += 1;
        addTimer(setTimeout(runStep3Animation, 80));
      }
      return;
    }
    var srcEls = [shapeEl, centreEl, spreadEl];
    var clones = [];
    srcEls.forEach(function (srcEl, i) {
      var destEl = rows[i];
      var srcRect = srcEl.getBoundingClientRect();
      var destRect = destEl.getBoundingClientRect();
      if (srcRect.width < 2 || destRect.width < 2) return;
      var clone = srcEl.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.left = srcRect.left + "px";
      clone.style.top = srcRect.top + "px";
      clone.style.width = srcRect.width + "px";
      clone.style.height = srcRect.height + "px";
      clone.style.margin = "0";
      clone.style.zIndex = "9999";
      clone.style.pointerEvents = "none";
      clone.style.transition = "none";
      clone.style.opacity = "1";
      clone.style.visibility = "visible";
      document.body.appendChild(clone);
      cloneElsRef.current.push(clone);
      clones.push({ clone: clone, dest: destRect });
    });
    if (!clones.length) {
      setStep3HideMainBtns(true);
      setStep3TableVisible(true);
      setStep3AnimDone(true);
      onUpdateNavText(copy.steps[3].navText);
      onSetNavLocked(false);
      return;
    }
    setStep3HideMainBtns(true);
    clones.forEach(function (item) {
      gsap.to(item.clone, {
        left: item.dest.left,
        top: item.dest.top,
        width: item.dest.width,
        height: item.dest.height,
        duration: 0.75,
        ease: "power2.inOut",
      });
    });
    addTimer(
      setTimeout(function () {
        clones.forEach(function (item) {
          if (item.clone.parentNode)
            item.clone.parentNode.removeChild(item.clone);
          var idx = cloneElsRef.current.indexOf(item.clone);
          if (idx !== -1) cloneElsRef.current.splice(idx, 1);
        });
        if (!mountedRef.current) return;
        setStep3TableVisible(true);
        setStep3AnimDone(true);
        onUpdateNavText(copy.steps[3].navText);
        onSetNavLocked(false);
      }, 780),
    );
  }

  function handleStep3GraphClick(which) {
    if (step3Correct) return;
    if (which === "s1") {
      if (typeof playSound === "function") playSound("wrong");
      setStep3SelectedGraph("s1");
      setStep3Feedback("wrong");
    } else {
      if (typeof playSound === "function") playSound("correct");
      setStep3SelectedGraph("s2");
      setStep3Feedback("correct");
      setStep3Correct(true);
      onSetNextEnabled(true);
      onUpdateQuestionText(copy.steps[3].afterCorrectQuestion);
      onUpdateNavText(copy.steps[3].afterCorrectNav);
    }
  }

  var leftDim = isMcqStep && mcqTarget === "s2";
  var rightDim = isMcqStep && mcqTarget === "s1";
  var mcqCopy = isC2 ? copy.steps.C2 : isB2 ? copy.steps.B2 : copy.steps.A2;

  var shapeDone = completedTests.indexOf("shape") !== -1 || isA3;
  var spreadDone = completedTests.indexOf("spread") !== -1 || isC3;
  var centreDone = completedTests.indexOf("centre") !== -1 || isB3;
  var shapeActive = isA1 || isA2;
  var spreadActive = isC1 || isC2;
  var centreActive = isB1 || isB2;
  var anyTestActive = shapeActive || spreadActive || centreActive;
  var showShapeResultBoxes = isA2 || isA3 || shapeDone || isStep3;
  var showSpreadResultBoxes = isC2 || isC3 || spreadDone || isStep3;
  var showCentreResultBoxes = isB2 || isB3 || centreDone || isStep3;

  function mainBtnClass(id) {
    var cls = "main-btn " + id;
    if (isStep3) {
      cls += " explored";
      return cls;
    }
    var isPending = pendingExplored === id;
    var isActive =
      (id === "shape" && shapeActive) ||
      (id === "spread" && spreadActive) ||
      (id === "centre" && centreActive);
    var isDone =
      (id === "shape" && shapeDone) ||
      (id === "spread" && spreadDone) ||
      (id === "centre" && centreDone);
    if (isActive || isPending) cls += " explored";
    else if (isDone) cls += " explored dehighlighted";
    else if (anyTestActive || pendingExplored) cls += " dehighlighted";
    return cls;
  }

  function canClickMain(id) {
    if (pendingExplored) return false;
    if (isStep2) return true;
    if (isA3 || isC3 || isB3) return remainingTests.indexOf(id) !== -1;
    return false;
  }

  var leftHalfClass = "graph-half";
  if (centerLeft) leftHalfClass += " is-centered";
  if (hideLeftGraph) leftHalfClass += " is-hidden-graph";
  var rightHalfClass = "graph-half";
  if (centerRight) rightHalfClass += " is-centered-from-right";
  if (hideRightGraph) rightHalfClass += " is-hidden-graph";

  var step3LeftBorder =
    isStep3 && step3AnimDone
      ? step3SelectedGraph === "s1"
        ? "0.25vw solid #ff5252"
        : "0.25vw solid #F2C94C"
      : undefined;
  var step3RightBorder =
    isStep3 && step3AnimDone
      ? step3Correct
        ? "0.25vw solid #7CFC00"
        : "0.25vw solid #F2C94C"
      : undefined;
  var step3SelectedColumn =
    step3SelectedGraph === "s1"
      ? "sample1"
      : step3SelectedGraph === "s2"
        ? "sample2"
        : null;

  var graphRow = e(
    "div",
    { className: "graph-row" + (isStep3 ? " step3-layout" : "") },
    e(
      "div",
      {
        ref: leftHalfRef,
        className: leftHalfClass,
        style:
          isStep3 && step3AnimDone
            ? {
                border: step3LeftBorder,
                borderRadius: "1vw",
                cursor: step3Correct ? "default" : "pointer",
                zIndex: centerLeft ? 2 : undefined,
              }
            : centerLeft
              ? { zIndex: 2 }
              : undefined,
        onClick:
          isStep3 && step3AnimDone && !step3Correct
            ? function () {
                handleStep3GraphClick("s1");
              }
            : undefined,
      },
      e(
        "div",
        {
          className: "graph-dim-wrap",
          style: {
            opacity: leftPopVisible
              ? drawFocus === "s2" || leftDim
                ? 0.2
                : 1
              : 0,
          },
        },
        renderPopGraph("left"),
      ),
      showIntro
        ? e("div", {
            className: "intro-text-box",
            ref: introRef,
            dangerouslySetInnerHTML: { __html: copy.introBoxText },
          })
        : null,
      isMcqStep && feedbackSide === "left"
        ? e("div", { className: "feedback-box" }, mcqCopy.feedbackS2)
        : null,
    ),
    e(
      "div",
      {
        ref: rightHalfRef,
        className: rightHalfClass,
        style:
          isStep3 && step3AnimDone
            ? {
                border: step3RightBorder,
                borderRadius: "1vw",
                cursor: step3Correct ? "default" : "pointer",
              }
            : undefined,
        onClick:
          isStep3 && step3AnimDone && !step3Correct
            ? function () {
                handleStep3GraphClick("s2");
              }
            : undefined,
      },
      e(
        "div",
        {
          className: "graph-dim-wrap",
          style: {
            opacity: drawFocus === "s1" || rightDim ? 0.2 : 1,
          },
        },
        renderPopGraph("right"),
      ),
      isMcqStep && feedbackSide === "right"
        ? e("div", { className: "feedback-box" }, mcqCopy.feedbackS1)
        : null,
    ),
  );

  var samplesRow = e(
    "div",
    {
      className: "samples-panel",
      style: hideSampleSources ? { opacity: 0 } : undefined,
    },
    e(
      "div",
      { className: "graph-half" },
      e("div", { className: "sample-label" }, copy.sample1Label),
      renderSampleGraph("s1"),
    ),
    e(
      "div",
      { className: "graph-half" },
      e("div", { className: "sample-label" }, copy.sample2Label),
      renderSampleGraph("s2"),
    ),
  );

  var drawBtnsHidden = isA1 && !drawReady && !drawEmergedRef.current && !startAtFinal;
  var drawButtons = e(
    "div",
    {
      className: "action-buttons-row",
      key: "action-btns",
      style: drawBtnsHidden ? { visibility: "hidden" } : undefined,
    },
    e("button", {
      ref: drawPopBtnRef,
      className: "draw-btn draw-pop" + (drawnPop ? " is-hidden" : ""),
      disabled: isDrawing || drawnPop || !drawReady,
      onClick:
        drawnPop || isDrawing || !drawReady
          ? undefined
          : function () {
              handleDraw("pop");
            },
      dangerouslySetInnerHTML: { __html: btns.drawPopulation },
    }),
    e("button", {
      ref: drawS1BtnRef,
      className: "draw-btn draw-s1" + (drawnS1 ? " is-hidden" : ""),
      disabled: isDrawing || drawnS1 || !drawReady,
      onClick:
        drawnS1 || isDrawing || !drawReady
          ? undefined
          : function () {
              handleDraw("s1");
            },
      dangerouslySetInnerHTML: { __html: btns.drawSample1 },
    }),
    e("button", {
      ref: drawS2BtnRef,
      className: "draw-btn draw-s2" + (drawnS2 ? " is-hidden" : ""),
      disabled: isDrawing || drawnS2 || !drawReady,
      onClick:
        drawnS2 || isDrawing || !drawReady
          ? undefined
          : function () {
              handleDraw("s2");
            },
      dangerouslySetInnerHTML: { __html: btns.drawSample2 },
    }),
  );

  var mcqRow = e(
    "div",
    { className: "action-buttons-row mcq-row", key: "mcq-row" },
    renderMcqHalf("s1"),
    renderMcqHalf("s2"),
  );

  function renderRangeBtn(id) {
    var labels = {
      pop: btns.rangePopulation,
      s1: btns.rangeSample1,
      s2: btns.rangeSample2,
    };
    var cfg = RANGE_CFG[id];
    var gone = rangeGone[id];
    var active = rangeActive === id;
    var cls = "range-btn range-" + id;
    if (gone) cls += " is-gone";
    if (active) cls += " is-expanded";
    if (active && showAnswerSlot) cls += " has-answer";
    if (active && rangeCollapsed) cls += " is-collapsed";
    var workingId = rangeActive || rangePending;
    if (workingId && workingId !== id && !gone) cls += " is-dim";
    var title = e("span", {
      className: "range-btn-title",
      dangerouslySetInnerHTML: { __html: labels[id] },
    });
    var kids = [title];
    if (active && !gone) {
      kids.push(e("span", { className: "range-eq", key: "eq1" }, "="));
      function renderRangeValFlip(
        key,
        ref,
        flipped,
        frontChild,
        backText,
        onClick,
      ) {
        return e(
          "div",
          {
            key: key,
            ref: ref,
            className: "range-val-btn",
            onClick: onClick,
          },
          e(
            "div",
            {
              className: "range-flip-inner" + (flipped ? " is-flipped" : ""),
            },
            e(
              "div",
              { className: "range-flip-face range-flip-front" },
              frontChild,
            ),
            e(
              "div",
              { className: "range-flip-face range-flip-back" },
              backText,
            ),
          ),
        );
      }
      var midKids = [
        renderRangeValFlip(
          "high",
          highBtnRef,
          highClicked,
          e("span", {
            dangerouslySetInnerHTML: { __html: btns.highestValue },
          }),
          highValue !== null ? String(highValue) : "",
          highValue === null ? handleHighestTap : undefined,
        ),
        e("span", { className: "range-minus", key: "minus" }, "−"),
        renderRangeValFlip(
          "low",
          lowBtnRef,
          lowClicked,
          e("span", {
            dangerouslySetInnerHTML: { __html: btns.lowestValue },
          }),
          lowValue !== null ? String(lowValue) : "",
          lowValue === null ? handleLowestTap : undefined,
        ),
      ];
      if (showAnswerSlot) {
        midKids.push(e("span", { className: "range-eq", key: "eq2" }, "="));
      }
      kids.push(
        e("div", { key: "mid", className: "range-formula-mid" }, midKids),
      );
      if (showAnswerSlot) {
        kids.push(
          e(
            "div",
            {
              key: "ans",
              ref: answerBtnRef,
              className: "range-val-btn range-ans-keep",
              onClick: answerFlipped ? undefined : handleAnswerTap,
            },
            e(
              "div",
              {
                className:
                  "range-flip-inner" + (answerFlipped ? " is-flipped" : ""),
              },
              e("div", { className: "range-flip-face range-flip-front" }, "?"),
              e(
                "div",
                { className: "range-flip-face range-flip-back" },
                fmtNum(cfg.result),
              ),
            ),
          ),
        );
      }
    }
    return e(
      "div",
      {
        key: "range-" + id,
        ref: rangeBtnRefFor(id),
        className: cls,
        onClick:
          !gone && !rangeActive && !rangePending && rangeReady && !rangeBusy
            ? function () {
                handleRangeClick(id);
              }
            : undefined,
      },
      kids,
    );
  }

  var rangeBtnsHidden = isC1 && !rangeReady && !rangeEmergedRef.current && !startAtFinal;
  var rangeButtons = e(
    "div",
    {
      className: "action-buttons-row",
      key: "range-btns",
      style: rangeBtnsHidden ? { visibility: "hidden" } : undefined,
    },
    renderRangeBtn("pop"),
    renderRangeBtn("s1"),
    renderRangeBtn("s2"),
  );

  function renderMeanEq(eq, kind) {
    if (eq.sumOnly) {
      return e("span", { className: "mean-eq-sum" }, eq.t);
    }
    var terms = eq.terms || [];
    var lhsKids = [];
    var last = terms.length - 1;
    terms.forEach(function (term, i) {
      var filled =
        kind === "den"
          ? !!(term.visF && term.f !== "")
          : !!(term.visX && term.x !== "" && term.visF && term.f !== "");
      var pending = i > 0 && !filled;
      var isLast = i === last;
      var termKids;
      if (kind === "den") {
        termKids = [
          e(
            "span",
            {
              key: "f",
              ref: isLast ? eqDenARef : undefined,
              className: "mean-eq-slot",
              style: { opacity: term.visF && term.f !== "" ? 1 : 0 },
            },
            term.f || "\u00a0",
          ),
        ];
      } else {
        termKids = [
          e(
            "span",
            {
              key: "x",
              ref: isLast ? eqARef : undefined,
              className: "mean-eq-slot",
              style: { opacity: term.visX && term.x !== "" ? 1 : 0 },
            },
            term.x || "\u00a0",
          ),
          e(
            "span",
            {
              key: "times",
              className: "mean-eq-op",
              style: { opacity: filled ? 1 : 0 },
            },
            "×",
          ),
          e(
            "span",
            {
              key: "f",
              ref: isLast ? eqMRef : undefined,
              className: "mean-eq-slot",
              style: { opacity: term.visF && term.f !== "" ? 1 : 0 },
            },
            term.f || "\u00a0",
          ),
        ];
      }
      var termEl = e(
        "span",
        {
          key: "term-" + i,
          className: "mean-eq-term" + (pending ? " is-pending" : ""),
        },
        termKids,
      );
      if (i === 0) {
        lhsKids.push(termEl);
      } else {
        lhsKids.push(
          e(
            "span",
            {
              key: "chunk-" + i,
              className: "mean-eq-chunk" + (term.open ? " is-open" : ""),
            },
            e(
              "span",
              { className: "mean-eq-chunk-inner" },
              e("span", { className: "mean-eq-op" }, "+"),
              termEl,
            ),
          ),
        );
      }
    });
    return e(
      "span",
      {
        className: "mean-eq-line" + (eq.visInner ? " is-on" : ""),
      },
      e(
        "span",
        {
          className: "mean-eq-lhs",
          ref: kind === "den" ? meanDenLhsRef : meanNumLhsRef,
        },
        e("span", { className: "mean-eq-lhs-inner" }, lhsKids),
      ),
      e(
        "span",
        {
          className: "mean-eq-op mean-eq-eq",
          style: { opacity: eq.visT && eq.t !== "" ? 1 : 0 },
        },
        "=",
      ),
      e(
        "span",
        {
          className: "mean-eq-slot mean-eq-rhs",
          style: { opacity: eq.visT && eq.t !== "" ? 1 : 0 },
        },
        eq.t || "\u00a0",
      ),
    );
  }

  function renderMeanFlip(
    key,
    ref,
    flipped,
    frontHtml,
    backChild,
    onClick,
    notTappable,
  ) {
    var cls = "range-val-btn mean-frac-btn";
    if (notTappable) cls += " not-tappable";
    return e(
      "div",
      {
        key: key,
        ref: ref,
        className: cls,
        onClick: onClick,
      },
      e(
        "div",
        {
          className: "range-flip-inner" + (flipped ? " is-flipped" : ""),
        },
        e("div", {
          className: "range-flip-face range-flip-front",
          dangerouslySetInnerHTML: { __html: frontHtml },
        }),
        e("div", { className: "range-flip-face range-flip-back" }, backChild),
      ),
    );
  }

  function renderMeanBtn(id) {
    var labels = {
      pop: btns.meanPopulation,
      s1: btns.meanSample1,
      s2: btns.meanSample2,
    };
    var cfg = MEAN_CFG[id];
    var gone = meanGone[id];
    var active = meanActive === id;
    var cls = "mean-btn mean-" + id;
    if (gone) cls += " is-gone";
    if (active) cls += " is-expanded";
    if (active && meanShowAnswer) cls += " has-answer";
    if (active && meanCollapsed) cls += " is-collapsed";
    var workingId = meanActive || meanPending;
    if (workingId && workingId !== id && !gone) cls += " is-dim";
    var title = e("span", {
      className: "mean-btn-title",
      dangerouslySetInnerHTML: { __html: labels[id] },
    });
    var kids = [title];
    if (active && !gone) {
      kids.push(e("span", { className: "range-eq", key: "eq1" }, "="));
      kids.push(
        e(
          "div",
          { key: "frac", className: "mean-fraction" },
          renderMeanFlip(
            "num",
            meanNumBtnRef,
            meanNumFlipped,
            btns.meanNumerator,
            renderMeanEq(meanEq, "num"),
            !meanNumFlipped && meanStage === "num"
              ? handleMeanNumTap
              : undefined,
          ),
          e("div", { key: "bar", className: "mean-frac-bar" }),
          renderMeanFlip(
            "den",
            meanDenBtnRef,
            meanDenFlipped,
            btns.meanDenominator,
            renderMeanEq(meanDenEq, "den"),
            !meanDenFlipped && meanStage === "den"
              ? handleMeanDenTap
              : undefined,
            !meanDenFlipped && meanStage === "num",
          ),
        ),
      );
      var ansKids = [];
      if (meanShowAnswer) {
        ansKids.push(e("span", { className: "range-eq", key: "eq2" }, "="));
      }
      kids.push(
        e("div", { key: "mid", className: "mean-formula-mid" }, ansKids),
      );
      if (meanShowAnswer) {
        kids.push(
          e(
            "div",
            {
              key: "ans",
              ref: meanAnsBtnRef,
              className: "range-val-btn range-ans-keep",
              onClick: meanAnsFlipped ? undefined : handleMeanAnsTap,
            },
            e(
              "div",
              {
                className:
                  "range-flip-inner" + (meanAnsFlipped ? " is-flipped" : ""),
              },
              e("div", { className: "range-flip-face range-flip-front" }, "?"),
              e(
                "div",
                { className: "range-flip-face range-flip-back" },
                fmtNum(cfg.mean),
              ),
            ),
          ),
        );
      }
    }
    return e(
      "div",
      {
        key: "mean-" + id,
        ref: meanBtnRefFor(id),
        className: cls,
        onClick:
          !gone && !meanActive && !meanPending && meanReady && !meanBusy
            ? function () {
                handleMeanClick(id);
              }
            : undefined,
      },
      kids,
    );
  }

  var meanBtnsHidden = isB1 && !meanReady && !meanEmergedRef.current && !startAtFinal;
  var meanButtons = e(
    "div",
    {
      className: "action-buttons-row",
      key: "mean-btns",
      style: meanBtnsHidden ? { visibility: "hidden" } : undefined,
    },
    renderMeanBtn("pop"),
    renderMeanBtn("s1"),
    renderMeanBtn("s2"),
  );

  var mainButtons = e(
    "div",
    { className: "main-buttons-row", key: "main-btns" },
    e(
      "button",
      {
        ref: shapeBtnRef,
        className: mainBtnClass("shape"),
        onClick: canClickMain("shape")
          ? function () {
              handleMainClick("shape");
            }
          : undefined,
      },
      e(
        "span",
        { className: "main-btn-label" },
        showShapeResultBoxes ? btns.shapeWithColon : btns.shape,
      ),
      showShapeResultBoxes
        ? e(
            "span",
            {
              ref: shapeS1BoxRef,
              className: "result-box s1",
              style: { opacity: showShapeS1Box || isStep3 ? 1 : 0 },
            },
            btns.s1Fail,
          )
        : null,
      showShapeResultBoxes
        ? e(
            "span",
            {
              ref: shapeS2BoxRef,
              className: "result-box s2",
              style: { opacity: showShapeS2Box || isStep3 ? 1 : 0 },
            },
            btns.s2Pass,
          )
        : null,
    ),
    e(
      "button",
      {
        ref: centreBtnRef,
        className: mainBtnClass("centre"),
        onClick: canClickMain("centre")
          ? function () {
              handleMainClick("centre");
            }
          : undefined,
      },
      e(
        "span",
        { className: "main-btn-label" },
        showCentreResultBoxes ? btns.centreWithColon : btns.centre,
      ),
      showCentreResultBoxes
        ? e(
            "span",
            {
              ref: centreS1BoxRef,
              className: "result-box s1",
              style: { opacity: showCentreS1Box || isStep3 ? 1 : 0 },
            },
            btns.s1Fail,
          )
        : null,
      showCentreResultBoxes
        ? e(
            "span",
            {
              ref: centreS2BoxRef,
              className: "result-box s2",
              style: { opacity: showCentreS2Box || isStep3 ? 1 : 0 },
            },
            btns.s2Pass,
          )
        : null,
    ),
    e(
      "button",
      {
        ref: spreadBtnRef,
        className: mainBtnClass("spread"),
        onClick: canClickMain("spread")
          ? function () {
              handleMainClick("spread");
            }
          : undefined,
      },
      e(
        "span",
        { className: "main-btn-label" },
        showSpreadResultBoxes ? btns.spreadWithColon : btns.spread,
      ),
      showSpreadResultBoxes
        ? e(
            "span",
            {
              ref: spreadS1BoxRef,
              className: "result-box s1",
              style: { opacity: showSpreadS1Box || isStep3 ? 1 : 0 },
            },
            btns.s1Fail,
          )
        : null,
      showSpreadResultBoxes
        ? e(
            "span",
            {
              ref: spreadS2BoxRef,
              className: "result-box s2",
              style: { opacity: showSpreadS2Box || isStep3 ? 1 : 0 },
            },
            btns.s2Pass,
          )
        : null,
    ),
  );

  var step3Table = isStep3
    ? e(
        "div",
        {
          ref: step3TableRef,
          className: "step3-table",
          style: {
            opacity: step3TableVisible ? 1 : 0,
            position: "absolute",
            width: "34vw",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          },
        },
        e(
          "div",
          { className: "step3-header-row" },
          e("div", {
            className: "step3-cell step3-cell-label step3-cell-empty",
          }),
          e(
            "div",
            {
              className: "step3-cell step3-sample-col step3-sample1-col",
            },
            copy.sample1Label.replace(":", ""),
          ),
          e(
            "div",
            {
              className: "step3-cell step3-sample-col step3-sample2-col",
            },
            copy.sample2Label.replace(":", ""),
          ),
        ),
        e(
          "div",
          { className: "step3-data-row" },
          e("div", { className: "step3-cell step3-cell-label" }, btns.shape),
          e(
            "div",
            {
              className:
                "step3-cell step3-fail step3-sample-col step3-sample1-col" + "",
            },
            btns.fail,
          ),
          e(
            "div",
            {
              className:
                "step3-cell step3-pass step3-sample-col step3-sample2-col" + "",
            },
            btns.pass,
          ),
        ),
        e(
          "div",
          { className: "step3-data-row" },
          e("div", { className: "step3-cell step3-cell-label" }, btns.centre),
          e(
            "div",
            {
              className:
                "step3-cell step3-fail step3-sample-col step3-sample1-col" + "",
            },
            btns.fail,
          ),
          e(
            "div",
            {
              className:
                "step3-cell step3-pass step3-sample-col step3-sample2-col" + "",
            },
            btns.pass,
          ),
        ),
        e(
          "div",
          { className: "step3-data-row" },
          e("div", { className: "step3-cell step3-cell-label" }, btns.spread),
          e(
            "div",
            {
              className:
                "step3-cell step3-fail step3-sample-col step3-sample1-col" + "",
            },
            btns.fail,
          ),
          e(
            "div",
            {
              className:
                "step3-cell step3-pass step3-sample-col step3-sample2-col" + "",
            },
            btns.pass,
          ),
        ),
        e("div", {
          ref: step3ColOverlayRef,
          className: "step3-col-overlay",
          style: { display: "none" },
        }),
      )
    : null;

  var step3FeedbackBox =
    isStep3 && step3Feedback
      ? e(
          "div",
          {
            className:
              "step3-feedback-box " +
              (step3Feedback === "correct" ? "correct" : "wrong"),
            style: {
              position: "absolute",
              right: "2vw",
              top: "50%",
              transform: "translateY(-50%)",
              width: "22vw",
            },
          },
          step3Feedback === "correct"
            ? copy.steps[3].correctS2Feedback
            : copy.steps[3].wrongS1Feedback,
        )
      : null;

  var actionInner = null;
  if (isStep3) {
    var placeholderTopRow = e("div", {
      className: "action-buttons-row",
      key: "action-empty",
      style: { visibility: "hidden" },
    });
    var step3MainBtnsWrapper = e(
      "div",
      {
        key: "main-btns-s3-wrap",
        style: step3HideMainBtns
          ? {
              opacity: 0,
              pointerEvents: "none",
              transition: "opacity 0.3s ease",
            }
          : { transition: "opacity 0.3s ease" },
      },
      mainButtons,
    );
    actionInner = [
      placeholderTopRow,
      step3MainBtnsWrapper,
      step3Table,
      step3FeedbackBox,
    ];
  } else if (showSamplesPanel) {
    actionInner = samplesRow;
  } else if (showButtonRows) {
    var topRow = null;
    if (isA1) topRow = drawButtons;
    else if (isA2 || isC2 || isB2) topRow = mcqRow;
    else if (isC1 && !rangeAllDone) topRow = rangeButtons;
    else if (isB1 && !meanAllDone) topRow = meanButtons;
    else
      topRow = e("div", {
        className: "action-buttons-row",
        key: "action-empty",
      });
    actionInner = [topRow, mainButtons];
  }

  var nudges = [];
  if (showMainNudges && isStep2) {
    nudges.push(
      e(Nudge, {
        key: "n-shape",
        targetRef: shapeBtnRef,
        active: true,
        onDismiss: function () {
          setShowMainNudges(false);
        },
      }),
      e(Nudge, {
        key: "n-centre",
        targetRef: centreBtnRef,
        active: true,
        onDismiss: function () {
          setShowMainNudges(false);
        },
      }),
      e(Nudge, {
        key: "n-spread",
        targetRef: spreadBtnRef,
        active: true,
        onDismiss: function () {
          setShowMainNudges(false);
        },
      }),
    );
  }
  if (showDrawNudges && isA1 && !isDrawing) {
    nudges.push(
      e(Nudge, {
        key: "n-draw-pop",
        targetRef: drawPopBtnRef,
        active: !drawnPop,
      }),
      e(Nudge, {
        key: "n-draw-s1",
        targetRef: drawS1BtnRef,
        active: !drawnS1,
      }),
      e(Nudge, {
        key: "n-draw-s2",
        targetRef: drawS2BtnRef,
        active: !drawnS2,
      }),
    );
  }
  if (showRangeNudges && isC1 && !rangeBusy && !rangeActive && !rangePending) {
    nudges.push(
      e(Nudge, {
        key: "n-range-pop",
        targetRef: rangePopBtnRef,
        active: !rangeGone.pop,
      }),
      e(Nudge, {
        key: "n-range-s1",
        targetRef: rangeS1BtnRef,
        active: !rangeGone.s1,
      }),
      e(Nudge, {
        key: "n-range-s2",
        targetRef: rangeS2BtnRef,
        active: !rangeGone.s2,
      }),
    );
  }
  if (isC1 && showHighNudge) {
    nudges.push(
      e(Nudge, { key: "n-high", targetRef: highBtnRef, active: true }),
    );
  }
  if (isC1 && showLowNudge) {
    nudges.push(e(Nudge, { key: "n-low", targetRef: lowBtnRef, active: true }));
  }
  if (isC1 && showAnswerNudge) {
    nudges.push(
      e(Nudge, { key: "n-ans", targetRef: answerBtnRef, active: true }),
    );
  }
  if (showMeanNudges && isB1 && !meanBusy && !meanActive && !meanPending) {
    nudges.push(
      e(Nudge, {
        key: "n-mean-pop",
        targetRef: meanPopBtnRef,
        active: !meanGone.pop,
      }),
      e(Nudge, {
        key: "n-mean-s1",
        targetRef: meanS1BtnRef,
        active: !meanGone.s1,
      }),
      e(Nudge, {
        key: "n-mean-s2",
        targetRef: meanS2BtnRef,
        active: !meanGone.s2,
      }),
    );
  }
  if (isB1 && showMeanNumNudge) {
    nudges.push(
      e(Nudge, { key: "n-mean-num", targetRef: meanNumBtnRef, active: true }),
    );
  }
  if (isB1 && showMeanDenNudge) {
    nudges.push(
      e(Nudge, { key: "n-mean-den", targetRef: meanDenBtnRef, active: true }),
    );
  }
  if (isB1 && showMeanAnsNudge) {
    nudges.push(
      e(Nudge, {
        key: "n-mean-ans",
        targetRef: meanAnsBtnRef,
        active: true,
        delay: 550,
      }),
    );
  }
  if (isA3) {
    if (remainingTests.indexOf("centre") !== -1) {
      nudges.push(
        e(Nudge, { key: "n-a3-centre", targetRef: centreBtnRef, active: true }),
      );
    }
    if (remainingTests.indexOf("spread") !== -1) {
      nudges.push(
        e(Nudge, { key: "n-a3-spread", targetRef: spreadBtnRef, active: true }),
      );
    }
  }
  if (isC3) {
    if (remainingTests.indexOf("shape") !== -1) {
      nudges.push(
        e(Nudge, { key: "n-c3-shape", targetRef: shapeBtnRef, active: true }),
      );
    }
    if (remainingTests.indexOf("centre") !== -1) {
      nudges.push(
        e(Nudge, { key: "n-c3-centre", targetRef: centreBtnRef, active: true }),
      );
    }
  }
  if (isB3) {
    if (remainingTests.indexOf("shape") !== -1) {
      nudges.push(
        e(Nudge, { key: "n-b3-shape", targetRef: shapeBtnRef, active: true }),
      );
    }
    if (remainingTests.indexOf("spread") !== -1) {
      nudges.push(
        e(Nudge, { key: "n-b3-spread", targetRef: spreadBtnRef, active: true }),
      );
    }
  }

  return e(
    "div",
    { className: "main-canvas-container" },
    graphRow,
    e("div", { className: "action-row" }, actionInner),
    nudges,
  );
};
