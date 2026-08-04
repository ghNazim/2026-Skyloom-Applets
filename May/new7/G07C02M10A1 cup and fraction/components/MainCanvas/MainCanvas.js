const KLEPON_VB_W = 1600;
const KLEPON_VB_H = 620;
const NL_START = 90;
const NL_END = 1510;
const NL_LEN = NL_END - NL_START;
const ORANGE = "#ff9f19";
const LINE_TAN = "#b59670";
const GREEN = "#86d06d";
const YELLOW = "#fff600";
const DARK_PANEL = "rgba(0, 12, 20, 0.78)";

function xForNumber(value) {
  return NL_START + NL_LEN * value;
}

function interpolateYAtX(x, start, end) {
  const dx = end.x - start.x;
  if (Math.abs(dx) < 0.001) return start.y;
  const t = Math.max(0, Math.min(1, (x - start.x) / dx));
  return start.y + (end.y - start.y) * t;
}

function labelForBenchmark(value) {
  if (value === 0) return "0";
  if (value === 1) return "1";
  if (value === 0.25) return "1/4";
  if (value === 1 / 3) return "1/3";
  if (value === 0.5) return "1/2";
  return String(value);
}

function FractionSvg({ x, y, num, den, color = ORANGE, fontSize = 42 }) {
  return React.createElement(
    "g",
    { className: "svg-fraction", transform: `translate(${x}, ${y})` },
    React.createElement(
      "text",
      {
        x: 0,
        y: -fontSize * 0.42,
        fill: color,
        fontSize,
        fontWeight: 800,
        fontFamily: "Georgia, serif",
        textAnchor: "middle",
        dominantBaseline: "middle",
      },
      num,
    ),
    React.createElement("line", {
      x1: -fontSize * 0.42,
      y1: 0,
      x2: fontSize * 0.42,
      y2: 0,
      stroke: color,
      strokeWidth: Math.max(4, fontSize * 0.08),
      strokeLinecap: "round",
    }),
    React.createElement(
      "text",
      {
        x: 0,
        y: fontSize * 0.47,
        fill: color,
        fontSize,
        fontWeight: 800,
        fontFamily: "Georgia, serif",
        textAnchor: "middle",
        dominantBaseline: "middle",
      },
      den,
    ),
  );
}

function NumberLine({ y, color = LINE_TAN, fullTenths = true, benchmarkValues = null, showEndLabels = true, divisions = 10 }) {
  const ticks = fullTenths
    ? Array.from({ length: divisions + 1 }, (_, i) => i / divisions)
    : benchmarkValues;

  return React.createElement(
    "g",
    { className: "number-line" },
    React.createElement("line", {
      x1: NL_START - 52,
      y1: y,
      x2: NL_END + 52,
      y2: y,
      stroke: color,
      strokeWidth: 5,
      markerStart: "url(#arrow-start)",
      markerEnd: "url(#arrow-end)",
    }),
    ticks.map((value) =>
      React.createElement("line", {
        key: `tick-${value}`,
        x1: xForNumber(value),
        y1: y - 19,
        x2: xForNumber(value),
        y2: y + 19,
        stroke: color === GREEN ? GREEN : ORANGE,
        strokeWidth: 3,
      }),
    ),
    showEndLabels ? React.createElement(
      "text",
      {
        x: xForNumber(0),
        y: y + 56,
        fill: ORANGE,
        fontSize: 44,
        fontWeight: 800,
        fontFamily: "Georgia, serif",
        textAnchor: "middle",
      },
      "0",
    ) : null,
    showEndLabels ? React.createElement(
      "text",
      {
        x: xForNumber(1),
        y: y + 56,
        fill: ORANGE,
        fontSize: 44,
        fontWeight: 800,
        fontFamily: "Georgia, serif",
        textAnchor: "middle",
      },
      "1",
    ) : null,
  );
}

const MainCanvas = ({
  step,
  ingredientIndex = 0,
  onSetNextEnabled,
  onUpdateTexts,
  onCompleteTenthsPlacement,
  onHideNudge,
  onShowNudgeAtElement,
}) => {
  const { useState, useEffect, useRef, useCallback } = React;
  const svgRef = useRef(null);
  const dragRef = useRef(false);
  const correctTimerRef = useRef(null);
  const animationTimerRef = useRef(null);
  const cloneTimerRef = useRef(null);
  const cloneFrameRef = useRef(null);

  const [mark, setMark] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState(null);
  const [benchmarkFeedback, setBenchmarkFeedback] = useState(null);
  const [isBenchmarkAnimating, setIsBenchmarkAnimating] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [clonePoint, setClonePoint] = useState(null);
  const flow = APP_DATA.ingredientFlows[ingredientIndex] || APP_DATA.ingredientFlows[0];
  const isLocateStep = (step - 1) % 3 === 1;
  const isBenchmarkStep = (step - 1) % 3 === 2;
  const fractionValue = flow.numerator / flow.denominator;
  const isLastIngredient = ingredientIndex >= APP_DATA.ingredientFlows.length - 1;

  const playSnd = (name) => {
    if (typeof playSound === "function") playSound(name);
  };

  const svgPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * KLEPON_VB_W,
      y: ((clientY - rect.top) / rect.height) * KLEPON_VB_H,
    };
  }, []);

  const snapToMark = useCallback((x) => {
    const raw = Math.round(((x - NL_START) / NL_LEN) * flow.denominator);
    return Math.max(0, Math.min(flow.denominator, raw));
  }, [flow.denominator]);

  useEffect(() => {
    window.clearTimeout(correctTimerRef.current);
    window.clearTimeout(animationTimerRef.current);
    window.clearTimeout(cloneTimerRef.current);
    window.cancelAnimationFrame(cloneFrameRef.current);
    setMark(isBenchmarkStep ? flow.numerator : 0);
    setIsDragging(false);
    setHasDropped(false);
    setFeedback(null);
    setShowBenchmarks(false);
    setSelectedBenchmark(null);
    setBenchmarkFeedback(null);
    setIsBenchmarkAnimating(false);
    setAnimationDone(false);
    setClonePoint(null);

    if (isLocateStep) {
      onSetNextEnabled(false);
      onUpdateTexts(flow.placeQuestion, flow.placeNav);
    }

    if (isBenchmarkStep) {
      onSetNextEnabled(false);
      onUpdateTexts(flow.benchmarkQuestion, APP_DATA.steps[3].navText);
    }

    return () => {
      window.clearTimeout(correctTimerRef.current);
      window.clearTimeout(animationTimerRef.current);
      window.clearTimeout(cloneTimerRef.current);
      window.cancelAnimationFrame(cloneFrameRef.current);
    };
  }, [flow, isBenchmarkStep, isLocateStep, onSetNextEnabled, onUpdateTexts, step]);

  useEffect(() => {
    if (!isDragging) return undefined;
    const onMove = (e) => {
      e.preventDefault();
      const pt = svgPoint(e);
      setMark(snapToMark(pt.x));
      setHasDropped(false);
      setFeedback(null);
    };
    const onUp = (e) => {
      e.preventDefault();
      dragRef.current = false;
      setIsDragging(false);
      const pt = svgPoint(e);
      const nextMark = snapToMark(pt.x);
      setMark(nextMark);
      setHasDropped(true);
      if (nextMark === flow.numerator) {
        playSnd("correct");
        setFeedback({ type: "correct", text: flow.placeCorrect });
        if (onCompleteTenthsPlacement) onCompleteTenthsPlacement();
      } else {
        playSnd("wrong");
        setFeedback({ type: "wrong", text: flow.placeWrong });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { passive: false });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [flow, isDragging, snapToMark, svgPoint, onCompleteTenthsPlacement]);

  const startDrag = (e) => {
    if (!isLocateStep) return;
    e.preventDefault();
    dragRef.current = true;
    setIsDragging(true);
    if (onHideNudge) onHideNudge();
  };

  const handleShowBenchmarks = () => {
    playSnd("click");
    setShowBenchmarks(true);
    setBenchmarkFeedback(null);
    if (onHideNudge) onHideNudge();
    onUpdateTexts(undefined, APP_DATA.steps[3].navChoose);
  };

  const handleBenchmarkClick = (value) => {
    if (isBenchmarkAnimating || animationDone) return;
    setSelectedBenchmark(value);
    if (Math.abs(value - flow.correctBenchmark) > 0.0001) {
      playSnd("wrong");
      const halfwayWrong =
        flow.halfwayRoundUp && Math.abs(value - 0.5) < 0.0001 && flow.halfwayWrong;
      setBenchmarkFeedback({
        type: "wrong",
        text: halfwayWrong || (value === 0 ? APP_DATA.steps[3].wrongZero : APP_DATA.steps[3].wrongOther),
      });
      return;
    }

    playSnd("correct");
    if (onHideNudge) onHideNudge();
    setBenchmarkFeedback(null);
    setIsBenchmarkAnimating(true);
    setClonePoint(null);
    cloneTimerRef.current = window.setTimeout(() => {
      const pathPoints = clonePathPoints;
      const segments = pathPoints.slice(1).map((pt, index) => {
        const from = pathPoints[index];
        return {
          from,
          to: pt,
          length: Math.hypot(pt.x - from.x, pt.y - from.y),
        };
      });
      const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0);
      const duration = 850;
      const startTime = performance.now();
      const moveClone = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        let remaining = totalLength * t;
        let current = segments[segments.length - 1];
        for (const segment of segments) {
          if (remaining <= segment.length) {
            current = segment;
            break;
          }
          remaining -= segment.length;
        }
        const localT = current.length === 0 ? 1 : Math.min(1, remaining / current.length);
        setClonePoint({
          x: current.from.x + (current.to.x - current.from.x) * localT,
          y: current.from.y + (current.to.y - current.from.y) * localT,
        });
        if (t < 1) {
          cloneFrameRef.current = window.requestAnimationFrame(moveClone);
        }
      };
      setClonePoint({ x: topFractionX, y: topY });
      cloneFrameRef.current = window.requestAnimationFrame(moveClone);
    }, 1500);
    animationTimerRef.current = window.setTimeout(() => {
      setAnimationDone(true);
      setIsBenchmarkAnimating(false);
      setClonePoint(null);
      setBenchmarkFeedback({ type: "correct", text: flow.benchmarkCorrect });
      onUpdateTexts(undefined, isLastIngredient ? APP_DATA.steps[3].navFinish : APP_DATA.steps[3].navDone);
      onSetNextEnabled(true);
      if (onShowNudgeAtElement) {
        window.setTimeout(() => onShowNudgeAtElement("next-button"), 200);
      }
    }, 2600);
  };

  const renderDefs = () =>
    React.createElement(
      "defs",
      null,
      React.createElement(
        "marker",
        {
          id: "arrow-end",
          markerWidth: 6,
          markerHeight: 6,
          refX: 3.4,
          refY: 3,
          orient: "auto",
          markerUnits: "strokeWidth",
        },
        React.createElement("path", { d: "M0,0.7 L5,3 L0,5.3 Z", fill: "context-stroke" }),
      ),
      React.createElement(
        "marker",
        {
          id: "arrow-start",
          markerWidth: 6,
          markerHeight: 6,
          refX: 1.6,
          refY: 3,
          orient: "auto",
          markerUnits: "strokeWidth",
        },
        React.createElement("path", { d: "M5,0.7 L0,3 L5,5.3 Z", fill: "context-stroke" }),
      ),
    );

  const renderDot = (x, y, draggable) =>
    React.createElement(
      "g",
      { className: "yellow-dot-group" },
      React.createElement("circle", {
        cx: x,
        cy: y,
        r: 22,
        fill: "rgba(255, 246, 0, 0.22)",
      }),
      React.createElement("circle", {
        id: isLocateStep ? "tenths-dot" : undefined,
        cx: x,
        cy: y,
        r: 13,
        fill: YELLOW,
        stroke: "rgba(255, 246, 0, 0.55)",
        strokeWidth: 3,
        style: { cursor: draggable ? "grab" : "default" },
        onPointerDown: draggable ? startDrag : undefined,
      }),
    );

  const renderStep2 = () => {
    const y = 302;
    const x = xForNumber(mark / flow.denominator);
    const showFraction = mark > 0 && mark < flow.denominator;
    const boxColor = feedback && feedback.type === "correct" ? GREEN : "#ff2626";
    const fractionText = flow.numerator + "/" + flow.denominator;
    const topText =
      APP_DATA.steps[2].topLead.replace("{splitName}", flow.splitName) + "<br>" +
      "<y>" + APP_DATA.steps[2].topQuestion.replace("{fraction}", fractionText) + "</y>";

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", {
        className: "canvas-top-text",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(topText) },
      }),
      React.createElement(
        "svg",
        {
          ref: svgRef,
          className: "main-svg",
          viewBox: `0 0 ${KLEPON_VB_W} ${KLEPON_VB_H}`,
          preserveAspectRatio: "none",
        },
        renderDefs(),
        React.createElement(NumberLine, { y, color: LINE_TAN, fullTenths: true, divisions: flow.denominator }),
        showFraction && hasDropped
          ? React.createElement("rect", {
              x: x - 40,
              y: y - 122,
              width: 80,
              height: 150,
              rx: 12,
              fill: feedback && feedback.type === "correct" ? "rgba(72, 114, 59, 0.45)" : "rgba(77, 52, 70, 0.65)",
              stroke: boxColor,
              strokeWidth: 2,
            })
          : null,
        showFraction
          ? React.createElement(FractionSvg, {
              x,
              y: y - 75,
              num: mark,
              den: flow.denominator,
              color: hasDropped ? boxColor : ORANGE,
              fontSize: 42,
            })
          : null,
        renderDot(x, y, true),
      ),
      feedback
        ? React.createElement("div", {
            className: "feedback-box " + feedback.type,
            dangerouslySetInnerHTML: { __html: formatFractionsInText(feedback.text) },
          })
        : null,
    );
  };

  const benchmarkValues = flow.benchmarkValues || [0, 0.25, 1 / 3, 0.5, 1];
  const topY = 125;
  const bottomY = 365;
  const topFractionX = xForNumber(fractionValue);
  const pairIndex = benchmarkValues.findIndex((value, index) => {
    const next = benchmarkValues[index + 1];
    return next !== undefined && fractionValue >= value && fractionValue <= next;
  });
  const lowerBenchmark = pairIndex >= 0 ? benchmarkValues[pairIndex] : benchmarkValues[benchmarkValues.length - 2];
  const upperBenchmark = pairIndex >= 0 ? benchmarkValues[pairIndex + 1] : benchmarkValues[benchmarkValues.length - 1];
  const comparisonA = xForNumber(lowerBenchmark);
  const comparisonB = xForNumber(upperBenchmark);
  const comparisonMidX = lowerBenchmark === 0
    ? xForNumber(0)
    : xForNumber((lowerBenchmark + upperBenchmark) / 2);
  const targetBenchmarkX = xForNumber(flow.correctBenchmark);
  const comparisonStart = { x: comparisonMidX, y: topY + 8 };
  const comparisonEndForTarget = {
    x: targetBenchmarkX,
    y: bottomY - 45,
  };
  const comparisonTargetY = interpolateYAtX(targetBenchmarkX, comparisonStart, comparisonEndForTarget);
  const yellowPathGap = 16;
  const isHalfwayRoundUp = !!flow.halfwayRoundUp;
  const yellowPathBend = {
    x: topFractionX,
    y: interpolateYAtX(topFractionX, comparisonStart, comparisonEndForTarget) - yellowPathGap,
  };
  const yellowPathBeforeDrop = {
    x: targetBenchmarkX,
    y: comparisonTargetY - yellowPathGap,
  };
  const comparisonSlope =
    Math.abs(targetBenchmarkX - comparisonStart.x) < 0.001
      ? 0
      : (comparisonEndForTarget.y - comparisonStart.y) / (targetBenchmarkX - comparisonStart.x);
  const halfwayPathBend = {
    x: targetBenchmarkX,
    y: topY + comparisonSlope * (targetBenchmarkX - topFractionX),
  };
  const yellowPath = isHalfwayRoundUp
    ? `M ${topFractionX} ${topY} L ${halfwayPathBend.x} ${halfwayPathBend.y} L ${targetBenchmarkX} ${bottomY}`
    : `M ${topFractionX} ${topY} L ${yellowPathBend.x} ${yellowPathBend.y} L ${yellowPathBeforeDrop.x} ${yellowPathBeforeDrop.y} L ${targetBenchmarkX} ${bottomY}`;
  const clonePathPoints = isHalfwayRoundUp
    ? [
        { x: topFractionX, y: topY },
        halfwayPathBend,
        { x: targetBenchmarkX, y: bottomY },
      ]
    : [
        { x: topFractionX, y: topY },
        yellowPathBend,
        yellowPathBeforeDrop,
        { x: targetBenchmarkX, y: bottomY },
      ];

  const renderBenchmarkBox = (value) => {
    const x = xForNumber(value);
    const label = labelForBenchmark(value);
    const isSelected = selectedBenchmark === value;
    const isCorrectSelected = animationDone && Math.abs(value - flow.correctBenchmark) < 0.0001;
    const dimmed = animationDone && Math.abs(value - flow.correctBenchmark) > 0.0001;
    const id = Math.abs(value - flow.correctBenchmark) < 0.0001 ? "benchmark-correct" : undefined;
    const isFraction = label.indexOf("/") > -1;
    const parts = isFraction ? label.split("/") : null;

    return React.createElement(
      "button",
      {
        key: label,
        id,
        className:
          "benchmark-box" +
          (isSelected ? " selected" : "") +
          (isSelected && Math.abs(value - flow.correctBenchmark) < 0.0001 && isBenchmarkAnimating ? " pending-correct" : "") +
          (isCorrectSelected ? " correct" : "") +
          (dimmed ? " dimmed" : ""),
        style: { left: `calc(${(x / KLEPON_VB_W) * 100}% - 2.72vw)` },
        onClick: () => handleBenchmarkClick(value),
      },
      isFraction
        ? React.createElement("span", {
            dangerouslySetInnerHTML: { __html: fractionHTML(parts[0], parts[1]) },
          })
        : label,
    );
  };

  const renderStep3 = () => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "svg",
        {
          ref: svgRef,
          className: "main-svg",
          viewBox: `0 0 ${KLEPON_VB_W} ${KLEPON_VB_H}`,
          preserveAspectRatio: "none",
        },
        renderDefs(),
        React.createElement(
          "g",
          { className: "top-number-line-group" },
          React.createElement(NumberLine, { y: topY, color: LINE_TAN, fullTenths: true, divisions: flow.denominator }),
          React.createElement(FractionSvg, {
            x: topFractionX,
            y: topY - 78,
            num: flow.numerator,
            den: flow.denominator,
            color: ORANGE,
            fontSize: 42,
          }),
          renderDot(topFractionX, topY, false),
        ),
        showBenchmarks
          ? React.createElement(NumberLine, {
              y: bottomY,
              color: GREEN,
              fullTenths: false,
              benchmarkValues,
              showEndLabels: false,
            })
          : null,
        (isBenchmarkAnimating || animationDone)
          ? React.createElement(
              "g",
              { className: "benchmark-animation-layer" },
              React.createElement("line", {
                className: "comparison-line comparison-line-left",
                x1: comparisonMidX,
                y1: topY + 8,
                x2: comparisonA,
                y2: bottomY - 45,
                stroke: "rgba(185, 185, 185, 0.72)",
                strokeWidth: 3,
              }),
              React.createElement("line", {
                className: "comparison-line comparison-line-right",
                x1: comparisonMidX,
                y1: topY + 8,
                x2: comparisonB,
                y2: bottomY - 45,
                stroke: "rgba(185, 185, 185, 0.72)",
                strokeWidth: 3,
              }),
              React.createElement(
                "mask",
                { id: "nearest-path-mask", maskUnits: "userSpaceOnUse" },
                React.createElement("path", {
                  className: "nearest-path-mask-line",
                  d: yellowPath,
                  fill: "none",
                  stroke: "#ffffff",
                  strokeWidth: 10,
                  pathLength: 1,
                }),
              ),
              React.createElement("path", {
                className: "nearest-path",
                d: yellowPath,
                fill: "none",
                stroke: YELLOW,
                strokeWidth: 3,
                strokeDasharray: "8 9",
                mask: "url(#nearest-path-mask)",
              }),
              clonePoint
                ? React.createElement(
                    "g",
                    { className: "moving-clone-dot" },
                    React.createElement("circle", {
                      cx: clonePoint.x,
                      cy: clonePoint.y,
                      r: 22,
                      fill: "rgba(255, 246, 0, 0.22)",
                    }),
                    React.createElement("circle", {
                      cx: clonePoint.x,
                      cy: clonePoint.y,
                      r: 13,
                      fill: YELLOW,
                      stroke: "rgba(255, 246, 0, 0.55)",
                      strokeWidth: 3,
                    }),
                  )
                : null,
              animationDone ? renderDot(targetBenchmarkX, bottomY, false) : null,
            )
          : null,
      ),
      !showBenchmarks
        ? React.createElement(
            "button",
            {
              id: "show-benchmarks-button",
              className: "show-benchmarks-button",
              onClick: handleShowBenchmarks,
            },
            APP_DATA.steps[3].showBenchmarks,
          )
        : null,
      showBenchmarks
        ? React.createElement(
            "div",
            { className: "benchmark-box-layer" },
            benchmarkValues.map(renderBenchmarkBox),
          )
        : null,
      benchmarkFeedback
        ? React.createElement("div", {
            className: "feedback-box benchmark-feedback " + benchmarkFeedback.type,
            dangerouslySetInnerHTML: { __html: formatFractionsInText(benchmarkFeedback.text) },
          })
        : null,
    );
  };

  return React.createElement(
    "div",
    { className: "main-canvas-container" },
    isLocateStep ? renderStep2() : renderStep3(),
  );
};
