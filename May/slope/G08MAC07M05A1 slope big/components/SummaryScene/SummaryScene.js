const SummaryScene = ({ onComplete }) => {
  const { useEffect, useMemo, useRef, useState } = React;

  const VIEWBOX_WIDTH = 1000;
  const VIEWBOX_HEIGHT = 520;
  const MOUNTAIN_NATIVE_WIDTH = 544;
  const MOUNTAIN_NATIVE_HEIGHT = 1536;
  const mountainWidth =
    VIEWBOX_HEIGHT * (MOUNTAIN_NATIVE_WIDTH / MOUNTAIN_NATIVE_HEIGHT);
  const mountainRightNudge = 0;
  const mountainStartX = 930;
  const zeroRideStartX = 650;
  const zeroRideEndX = mountainStartX - 70;
  const climbX = mountainStartX + 24;
  const flatY = 425;

  const segments = useMemo(
    () => [
      {
        from: { x: 50, y: 394 },
        to: { x: 440, y: 220 },
        duration: 2300,
        label: "positive",
      },
      {
        from: { x: 440, y: 220 },
        to: { x: 612, y: 388 },
        duration: 1800,
        label: "negative",
      },
      {
        from: { x: zeroRideStartX, y: flatY },
        to: { x: zeroRideEndX, y: flatY },
        duration: 1400,
        label: "zero",
      },
      {
        from: { x: climbX, y: flatY },
        to: { x: climbX, y: 105 },
        duration: 2200,
        label: "undefined",
      },
    ],
    [zeroRideStartX, zeroRideEndX, climbX, flatY],
  );
  const svgRef = useRef(null);
  const [mountainRightEdge, setMountainRightEdge] = useState(VIEWBOX_WIDTH);

  const [segmentIndex, setSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shownLabels, setShownLabels] = useState([]);
  const [cycleFrame, setCycleFrame] = useState(0);
  const [climbFrame, setClimbFrame] = useState(0);
  const [summaryStarted, setSummaryStarted] = useState(false);
  const cycleFrames = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) =>
        "assets/cycle/" + String(index).padStart(2, "0") + ".png",
      ),
    [],
  );
  const climbFrames = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) =>
        "assets/climb/" + String(index).padStart(2, "0") + ".png",
      ),
    [],
  );

  useEffect(() => {
    let frameId = null;
    let timeoutId = null;
    let mounted = true;

    setSummaryStarted(false);
    setCycleFrame(0);
    setClimbFrame(0);

    const playSegment = (index) => {
      if (!mounted) return;
      if (index >= segments.length) {
        if (typeof onComplete === "function") onComplete();
        return;
      }

      setSegmentIndex(index);
      setProgress(0);
      if (index < 3) {
        setCycleFrame(0);
      } else {
        setClimbFrame(0);
      }
      const start = performance.now();
      const duration = segments[index].duration;

      const tick = (now) => {
        const raw = Math.min(1, (now - start) / duration);
        setProgress(raw);
        if (raw < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setProgress(1);
          setShownLabels((prev) =>
            prev.includes(segments[index].label)
              ? prev
              : [...prev, segments[index].label],
          );
          timeoutId = setTimeout(() => playSegment(index + 1), 650);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    timeoutId = setTimeout(() => {
      if (!mounted) return;
      setSummaryStarted(true);
      playSegment(0);
    }, 600);

    return () => {
      mounted = false;
      if (frameId) cancelAnimationFrame(frameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [segments, onComplete]);

  useEffect(() => {
    const updateWallEdge = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const canvasWidth = svg.clientWidth;
      const canvasHeight = svg.clientHeight;
      if (!canvasWidth || !canvasHeight) return;
      const scale = Math.min(
        canvasWidth / VIEWBOX_WIDTH,
        canvasHeight / VIEWBOX_HEIGHT,
      );
      const visibleWidth = canvasWidth / scale;
      const extra = Math.max(0, visibleWidth - VIEWBOX_WIDTH);
      setMountainRightEdge(VIEWBOX_WIDTH + extra / 2 + mountainRightNudge);
    };

    updateWallEdge();
    window.addEventListener("resize", updateWallEdge);
    return () => window.removeEventListener("resize", updateWallEdge);
  }, [mountainRightNudge]);

  const activeSegment = segments[Math.min(segmentIndex, segments.length - 1)];
  const point = {
    x: activeSegment.from.x + (activeSegment.to.x - activeSegment.from.x) * progress,
    y: activeSegment.from.y + (activeSegment.to.y - activeSegment.from.y) * progress,
  };
  const angle =
    (Math.atan2(
      activeSegment.to.y - activeSegment.from.y,
      activeSegment.to.x - activeSegment.from.x,
    ) *
      180) /
    Math.PI;
  const showCycle = segmentIndex < 3;
  const showEmptyCycle = segmentIndex >= 3 || shownLabels.includes("undefined");
  const cycleMoving = summaryStarted && segmentIndex < 3 && progress < 1;
  const climbMoving = summaryStarted && segmentIndex === 3 && progress < 1;
  const climberPoint =
    segmentIndex === 3
      ? point
      : shownLabels.includes("undefined")
        ? segments[3].to
        : segments[3].from;

  useEffect(() => {
    if (!cycleMoving) return undefined;
    const intervalId = setInterval(() => {
      setCycleFrame((prev) => (prev + 1) % cycleFrames.length);
    }, 1000 / 30);
    return () => clearInterval(intervalId);
  }, [cycleMoving, cycleFrames.length]);

  useEffect(() => {
    if (!climbMoving) return undefined;
    const intervalId = setInterval(() => {
      setClimbFrame((prev) => (prev + 1) % climbFrames.length);
    }, 1000 / 30);
    return () => clearInterval(intervalId);
  }, [climbMoving, climbFrames.length]);

  const getArrowGeometry = (start, end, headLength, headWidth) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (!length) return null;
    const ux = dx / length;
    const uy = dy / length;
    const shaftEnd = {
      x: end.x - ux * headLength,
      y: end.y - uy * headLength,
    };
    const halfWidth = headWidth / 2;
    const left = {
      x: shaftEnd.x - uy * halfWidth,
      y: shaftEnd.y + ux * halfWidth,
    };
    const right = {
      x: shaftEnd.x + uy * halfWidth,
      y: shaftEnd.y - ux * halfWidth,
    };
    return {
      shaftEnd,
      headPoints:
        end.x +
        "," +
        end.y +
        " " +
        left.x +
        "," +
        left.y +
        " " +
        right.x +
        "," +
        right.y,
    };
  };

  const renderDoubleHeadArrow = (start, end, className) => {
    const headLength = 18;
    const headWidth = 18;
    const forward = getArrowGeometry(start, end, headLength, headWidth);
    const backward = getArrowGeometry(end, start, headLength, headWidth);
    if (!forward || !backward) return null;
    return React.createElement(
      "g",
      null,
      React.createElement("line", {
        x1: backward.shaftEnd.x,
        y1: backward.shaftEnd.y,
        x2: forward.shaftEnd.x,
        y2: forward.shaftEnd.y,
        className: className,
      }),
      React.createElement("polygon", {
        points: forward.headPoints,
        className: className + "-head",
      }),
      React.createElement("polygon", {
        points: backward.headPoints,
        className: className + "-head",
      }),
    );
  };

  const labelVisible = (name) => shownLabels.includes(name);
  const cycleWidth = 150;
  const cycleHeight = 120;
  const parkedCycleX = zeroRideEndX - cycleWidth * 0.53;
  const parkedCycleY = 425 - cycleHeight + 6;
  const terrainPath =
    "M -400 594 L 440 220 L 650 425 L 1400 425 L 1400 900 L -400 900 Z";
  const cycleRad = (angle * Math.PI) / 180;
  const cycleLift = segmentIndex === 1 ? 8 : -6;
  const cycleDraw = {
    x: point.x - Math.sin(cycleRad) * cycleLift,
    y: point.y - Math.cos(cycleRad) * cycleLift,
  };

  return React.createElement(
    "div",
    { className: "summary-scene-wrap" },
    React.createElement(
      "svg",
      {
        className: "summary-scene-svg",
        viewBox: "0 0 " + VIEWBOX_WIDTH + " " + VIEWBOX_HEIGHT,
        preserveAspectRatio: "xMidYMid meet",
        ref: svgRef,
      },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "pattern",
          {
            id: "summaryGrassPattern",
            width: "70",
            height: "70",
            patternUnits: "userSpaceOnUse",
          },
          React.createElement("rect", { width: "70", height: "70", fill: "#98cc4e" }),
          React.createElement("path", {
            d: "M0 20 C16 12 30 17 45 10 C58 5 64 9 70 4 L70 24 C55 31 42 24 28 34 C15 42 7 36 0 43 Z",
            fill: "#dce75b",
            opacity: "0.72",
          }),
          React.createElement("path", {
            d: "M0 55 C15 47 29 51 45 44 C56 39 63 40 70 36 L70 70 L0 70 Z",
            fill: "#5c9f42",
            opacity: "0.62",
          }),
          React.createElement("circle", { cx: "14", cy: "12", r: "1.2", fill: "#476f34", opacity: "0.45" }),
          React.createElement("circle", { cx: "42", cy: "35", r: "1.1", fill: "#476f34", opacity: "0.4" }),
        ),
        React.createElement("marker", {
          id: "summaryArrowGreen",
          markerWidth: "18",
          markerHeight: "18",
          refX: "15",
          refY: "9",
          orient: "auto-start-reverse",
          markerUnits: "userSpaceOnUse",
        }, React.createElement("path", { d: "M 0 0 L 18 9 L 0 18 z", fill: "#8bf281" })),
        React.createElement("marker", {
          id: "summaryArrowOrange",
          markerWidth: "18",
          markerHeight: "18",
          refX: "15",
          refY: "9",
          orient: "auto-start-reverse",
          markerUnits: "userSpaceOnUse",
        }, React.createElement("path", { d: "M 0 0 L 18 9 L 0 18 z", fill: "#ff7f37" })),
        React.createElement("marker", {
          id: "summaryArrowBlue",
          markerWidth: "18",
          markerHeight: "18",
          refX: "15",
          refY: "9",
          orient: "auto-start-reverse",
          markerUnits: "userSpaceOnUse",
        }, React.createElement("path", { d: "M 0 0 L 18 9 L 0 18 z", fill: "#8fdcff" })),
        React.createElement("marker", {
          id: "summaryArrowYellow",
          markerWidth: "18",
          markerHeight: "18",
          refX: "15",
          refY: "9",
          orient: "auto-start-reverse",
          markerUnits: "userSpaceOnUse",
        }, React.createElement("path", { d: "M 0 0 L 18 9 L 0 18 z", fill: "#f7c534" })),
        React.createElement(
          "clipPath",
          { id: "summaryTerrainClip" },
          React.createElement("path", {
            d: terrainPath,
          }),
        ),
      ),
      React.createElement("rect", {
        x: -800,
        y: -200,
        width: 2600,
        height: 1000,
        className: "summary-sky",
      }),
      React.createElement("path", {
        d: terrainPath,
        fill: "url(#summaryGrassPattern)",
        className: "summary-ground",
      }),
      React.createElement(
        "g",
        { clipPath: "url(#summaryTerrainClip)" },
        React.createElement("path", {
          d: "M -220 530 C 40 410 240 290 440 220 L 560 325 C 350 300 160 390 10 470 C -90 510 -150 530 -220 530 Z",
          className: "summary-mountain-band",
        }),
        React.createElement("path", {
          d: "M 90 410 C 230 338 395 330 535 358 C 465 398 335 418 148 420 C 120 420 100 416 90 410 Z",
          className: "summary-mountain-band yellow",
        }),
      ),
      React.createElement("image", {
        href: "assets/mountainxs.png",
        x: 0,
        y: 0,
        width: mountainRightEdge,
        height: VIEWBOX_HEIGHT,
        preserveAspectRatio: "xMaxYMid meet",
        className: "summary-wall",
      }),
      labelVisible("positive")
        ? React.createElement(
            "g",
            { className: "summary-label-group fade-in" },
            renderDoubleHeadArrow(
              { x: 42, y: 391 },
              { x: 394, y: 234 },
              "summary-slope-arrow positive",
            ),
            React.createElement(
              "text",
              {
                x: 211,
                y: 298,
                className: "summary-slope-label positive",
                transform: "rotate(-24 211 298)",
              },
              "positive",
            ),
          )
        : null,
      labelVisible("negative")
        ? React.createElement(
            "g",
            { className: "summary-label-group fade-in" },
            renderDoubleHeadArrow(
              { x: 454, y: 232 },
              { x: 638, y: 414 },
              "summary-slope-arrow negative",
            ),
            React.createElement(
              "text",
              {
                x: 556,
                y: 312,
                className: "summary-slope-label negative",
                transform: "rotate(44 556 312)",
              },
              "negative",
            ),
          )
        : null,
      labelVisible("zero")
        ? React.createElement(
            "g",
            { className: "summary-label-group fade-in" },
            renderDoubleHeadArrow(
              { x: 668, y: 452 },
              { x: 876, y: 452 },
              "summary-slope-arrow zero",
            ),
            React.createElement(
              "text",
              { x: 772, y: 478, className: "summary-slope-label zero" },
              "zero",
            ),
          )
        : null,
      labelVisible("undefined")
        ? React.createElement(
            "g",
            { className: "summary-label-group fade-in" },
            renderDoubleHeadArrow(
              { x: climbX - 40, y: 430 },
              { x: climbX - 40, y: 115 },
              "summary-slope-arrow undefined",
            ),
            React.createElement(
              "text",
              {
                x: climbX - 68,
                y: 270,
                className: "summary-slope-label undefined",
                transform: "rotate(-90 " + (climbX - 68) + " 270)",
              },
              "undefined",
            ),
          )
        : null,
      showEmptyCycle
        ? React.createElement("image", {
            href: "assets/cycle_without_rider.png",
            x: parkedCycleX,
            y: parkedCycleY,
            width: cycleWidth,
            height: cycleHeight,
            className: "summary-empty-cycle fade-in",
          })
        : null,
      showCycle
        ? React.createElement("image", {
            href: cycleFrames[cycleFrame] || cycleFrames[0],
            x: cycleDraw.x - cycleWidth * 0.53,
            y: cycleDraw.y - cycleHeight,
            width: cycleWidth,
            height: cycleHeight,
            transform:
              "rotate(" +
              angle +
              " " +
              cycleDraw.x +
              " " +
              cycleDraw.y +
              ")",
            className: "summary-cycle",
          })
        : null,
      segmentIndex >= 3 || labelVisible("undefined")
        ? React.createElement("image", {
            href: climbFrames[climbFrame] || climbFrames[0],
            x: climberPoint.x - 90,
            y: climberPoint.y - 105,
            width: 108,
            height: 150,
            className: "summary-climber scene-climber-sprite",
          })
        : null,
    ),
  );
};
