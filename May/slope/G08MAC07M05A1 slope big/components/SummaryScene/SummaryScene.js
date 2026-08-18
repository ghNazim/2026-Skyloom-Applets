const SummaryScene = ({ onComplete }) => {
  const { useEffect, useMemo, useState } = React;

  const segments = useMemo(
    () => [
      {
        from: { x: 74, y: 425 },
        to: { x: 520, y: 220 },
        duration: 2300,
        label: "positive",
      },
      {
        from: { x: 520, y: 220 },
        to: { x: 755, y: 425 },
        duration: 1800,
        label: "negative",
      },
      {
        from: { x: 755, y: 425 },
        to: { x: 890, y: 425 },
        duration: 1100,
        label: "zero",
      },
      {
        from: { x: 900, y: 425 },
        to: { x: 900, y: 105 },
        duration: 2200,
        label: "undefined",
      },
    ],
    [],
  );

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

  return React.createElement(
    "div",
    { className: "summary-scene-wrap" },
    React.createElement(
      "svg",
      {
        className: "summary-scene-svg",
        viewBox: "0 0 1000 520",
        preserveAspectRatio: "xMidYMid meet",
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
        }, React.createElement("path", { d: "M 0 0 L 18 9 L 0 18 z", fill: "#9bd24c" })),
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
      ),
      React.createElement("rect", {
        x: 0,
        y: 0,
        width: 1000,
        height: 520,
        className: "summary-sky",
      }),
      React.createElement("path", {
        d: "M 34 452 L 520 220 L 755 425 L 892 425 L 892 560 L 0 560 L 0 470 Z",
        fill: "url(#summaryGrassPattern)",
        className: "summary-ground",
      }),
      React.createElement("path", {
        d: "M 205 372 C 320 302 410 275 520 220 L 640 325 C 530 305 430 344 335 358 C 285 365 246 357 205 372 Z",
        className: "summary-mountain-band",
      }),
      React.createElement("path", {
        d: "M 300 385 C 410 326 533 338 655 358 C 585 398 455 418 330 405 C 315 403 307 395 300 385 Z",
        className: "summary-mountain-band yellow",
      }),
      React.createElement("image", {
        href: "assets/mountain.png",
        x: 892,
        y: 15,
        width: 108,
        height: 545,
        preserveAspectRatio: "none",
        className: "summary-wall",
      }),
      labelVisible("positive")
        ? React.createElement(
            "g",
            { className: "summary-label-group fade-in" },
            renderDoubleHeadArrow(
              { x: 58, y: 436 },
              { x: 512, y: 228 },
              "summary-slope-arrow positive",
            ),
            React.createElement(
              "text",
              {
                x: 256,
                y: 330,
                className: "summary-slope-label positive",
                transform: "rotate(-25 256 330)",
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
              { x: 536, y: 232 },
              { x: 742, y: 414 },
              "summary-slope-arrow negative",
            ),
            React.createElement(
              "text",
              {
                x: 650,
                y: 314,
                className: "summary-slope-label negative",
                transform: "rotate(42 650 314)",
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
              { x: 762, y: 452 },
              { x: 884, y: 452 },
              "summary-slope-arrow zero",
            ),
            React.createElement(
              "text",
              { x: 820, y: 478, className: "summary-slope-label zero" },
              "zero",
            ),
          )
        : null,
      labelVisible("undefined")
        ? React.createElement(
            "g",
            { className: "summary-label-group fade-in" },
            renderDoubleHeadArrow(
              { x: 850, y: 430 },
              { x: 850, y: 115 },
              "summary-slope-arrow undefined",
            ),
            React.createElement(
              "text",
              {
                x: 822,
                y: 270,
                className: "summary-slope-label undefined",
                transform: "rotate(-90 822 270)",
              },
              "undefined",
            ),
          )
        : null,
      showEmptyCycle
        ? React.createElement("image", {
            href: "assets/cycle_without_rider.png",
            x: 828,
            y: 362,
            width: 88,
            height: 72,
            className: "summary-empty-cycle fade-in",
          })
        : null,
      showCycle
        ? React.createElement("image", {
            href: cycleFrames[cycleFrame] || cycleFrames[0],
            x: point.x - 46,
            y: point.y - 65,
            width: 92,
            height: 76,
            transform:
              "rotate(" +
              angle +
              " " +
              point.x +
              " " +
              point.y +
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
