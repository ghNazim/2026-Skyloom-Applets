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

function NumberLine({ y, color = LINE_TAN, fullTenths = true, benchmarkValues = null }) {
  const ticks = fullTenths
    ? Array.from({ length: 11 }, (_, i) => i / 10)
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
    React.createElement(
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
    ),
    React.createElement(
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
    ),
  );
}

const MainCanvas = ({
  step,
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

  const [mark, setMark] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState(null);
  const [benchmarkFeedback, setBenchmarkFeedback] = useState(null);
  const [isBenchmarkAnimating, setIsBenchmarkAnimating] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

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
    const raw = Math.round(((x - NL_START) / NL_LEN) * 10);
    return Math.max(0, Math.min(10, raw));
  }, []);

  useEffect(() => {
    window.clearTimeout(correctTimerRef.current);
    window.clearTimeout(animationTimerRef.current);
    setMark(step === 3 ? 9 : 0);
    setIsDragging(false);
    setHasDropped(false);
    setFeedback(null);
    setShowBenchmarks(false);
    setSelectedBenchmark(null);
    setBenchmarkFeedback(null);
    setIsBenchmarkAnimating(false);
    setAnimationDone(false);

    if (step === 2) {
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[2].questionText, APP_DATA.steps[2].navText);
    }

    if (step === 3) {
      onSetNextEnabled(false);
      onUpdateTexts(APP_DATA.steps[3].questionText, APP_DATA.steps[3].navText);
    }

    return () => {
      window.clearTimeout(correctTimerRef.current);
      window.clearTimeout(animationTimerRef.current);
    };
  }, [step, onSetNextEnabled, onUpdateTexts]);

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
      if (nextMark === 9) {
        playSnd("correct");
        setFeedback({ type: "correct", text: APP_DATA.steps[2].correctFeedback });
        if (onCompleteTenthsPlacement) onCompleteTenthsPlacement();
      } else {
        playSnd("wrong");
        setFeedback({ type: "wrong", text: APP_DATA.steps[2].wrongFeedback });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { passive: false });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging, snapToMark, svgPoint, onCompleteTenthsPlacement]);

  const startDrag = (e) => {
    if (step !== 2) return;
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
    window.setTimeout(() => {
      if (onShowNudgeAtElement) onShowNudgeAtElement("benchmark-1");
    }, 250);
  };

  const handleBenchmarkClick = (value) => {
    if (isBenchmarkAnimating || animationDone) return;
    setSelectedBenchmark(value);
    if (value !== 1) {
      playSnd("wrong");
      setBenchmarkFeedback({
        type: "wrong",
        text: value === 0 ? APP_DATA.steps[3].wrongZero : APP_DATA.steps[3].wrongOther,
      });
      return;
    }

    playSnd("correct");
    if (onHideNudge) onHideNudge();
    setBenchmarkFeedback(null);
    setIsBenchmarkAnimating(true);
    animationTimerRef.current = window.setTimeout(() => {
      setAnimationDone(true);
      setIsBenchmarkAnimating(false);
      setBenchmarkFeedback({ type: "correct", text: APP_DATA.steps[3].correctFeedback });
      onUpdateTexts(undefined, APP_DATA.steps[3].navDone);
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
          markerWidth: 13,
          markerHeight: 13,
          refX: 10,
          refY: 5,
          orient: "auto",
          markerUnits: "strokeWidth",
        },
        React.createElement("path", { d: "M0,0 L10,5 L0,10 Z", fill: "context-stroke" }),
      ),
      React.createElement(
        "marker",
        {
          id: "arrow-start",
          markerWidth: 13,
          markerHeight: 13,
          refX: 0,
          refY: 5,
          orient: "auto",
          markerUnits: "strokeWidth",
        },
        React.createElement("path", { d: "M10,0 L0,5 L10,10 Z", fill: "context-stroke" }),
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
        id: step === 2 ? "tenths-dot" : undefined,
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
    const x = xForNumber(mark / 10);
    const showFraction = mark > 0 && mark < 10;
    const boxColor = feedback && feedback.type === "correct" ? GREEN : "#ff2626";

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("div", {
        className: "canvas-top-text",
        dangerouslySetInnerHTML: { __html: formatFractionsInText(APP_DATA.steps[2].topText) },
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
        React.createElement(NumberLine, { y, color: LINE_TAN, fullTenths: true }),
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
              den: 10,
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

  const benchmarkValues = [0, 0.25, 1 / 3, 0.5, 1];
  const topY = 125;
  const bottomY = 365;
  const nineX = xForNumber(0.9);
  const threeQuarterX = xForNumber(0.75);
  const halfX = xForNumber(0.5);
  const oneX = xForNumber(1);
  const yellowPath = `M ${nineX} ${topY} L ${nineX} 215 L ${oneX - 12} 294 L ${oneX - 12} ${bottomY}`;

  const renderBenchmarkBox = (value) => {
    const x = xForNumber(value);
    const label = labelForBenchmark(value);
    const isSelected = selectedBenchmark === value;
    const isCorrectSelected = animationDone && value === 1;
    const dimmed = animationDone && value !== 1;
    const id = value === 1 ? "benchmark-1" : undefined;
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
          (isSelected && value === 1 && isBenchmarkAnimating ? " pending-correct" : "") +
          (isCorrectSelected ? " correct" : "") +
          (dimmed ? " dimmed" : ""),
        style: { left: `calc(${(x / KLEPON_VB_W) * 100}% - 3.2vw)` },
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
        React.createElement(NumberLine, { y: topY, color: LINE_TAN, fullTenths: true }),
        React.createElement(FractionSvg, {
          x: nineX,
          y: topY - 78,
          num: 9,
          den: 10,
          color: ORANGE,
          fontSize: 42,
        }),
        renderDot(nineX, topY, false),
        showBenchmarks
          ? React.createElement(NumberLine, {
              y: bottomY,
              color: GREEN,
              fullTenths: false,
              benchmarkValues,
            })
          : null,
        (isBenchmarkAnimating || animationDone)
          ? React.createElement(
              "g",
              { className: "benchmark-animation-layer" },
              React.createElement("line", {
                className: "comparison-line comparison-line-left",
                x1: threeQuarterX,
                y1: topY + 8,
                x2: halfX + 28,
                y2: bottomY - 45,
                stroke: "rgba(185, 185, 185, 0.72)",
                strokeWidth: 3,
              }),
              React.createElement("line", {
                className: "comparison-line comparison-line-right",
                x1: threeQuarterX,
                y1: topY + 8,
                x2: oneX - 28,
                y2: bottomY - 45,
                stroke: "rgba(185, 185, 185, 0.72)",
                strokeWidth: 3,
              }),
              React.createElement("path", {
                className: "nearest-path",
                d: yellowPath,
                fill: "none",
                stroke: YELLOW,
                strokeWidth: 3,
                strokeDasharray: "8 9",
              }),
              isBenchmarkAnimating
                ? React.createElement(
                    "circle",
                    { r: 12, fill: YELLOW },
                    React.createElement("animateMotion", {
                      dur: "1.75s",
                      begin: "0.8s",
                      fill: "freeze",
                      path: yellowPath,
                    }),
                  )
                : null,
              animationDone ? renderDot(oneX, bottomY, false) : null,
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
    step === 2 ? renderStep2() : renderStep3(),
  );
};
