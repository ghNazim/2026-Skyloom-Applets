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

  useEffect(() => {
    let frameId = null;
    let timeoutId = null;
    let mounted = true;

    const playSegment = (index) => {
      if (!mounted) return;
      if (index >= segments.length) {
        if (typeof onComplete === "function") onComplete();
        return;
      }

      setSegmentIndex(index);
      setProgress(0);
      const start = performance.now();
      const duration = segments[index].duration;

      const tick = (now) => {
        const raw = Math.min(1, (now - start) / duration);
        const eased = raw < 0.5
          ? 2 * raw * raw
          : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        setProgress(eased);
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

    playSegment(0);

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
  const showEmptyCycle = segmentIndex >= 3 || shownLabels.includes("zero");
  const climberPoint =
    segmentIndex === 3
      ? point
      : shownLabels.includes("undefined")
        ? segments[3].to
        : segments[3].from;

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
        React.createElement(
          "pattern",
          {
            id: "summaryRockPattern",
            width: "88",
            height: "88",
            patternUnits: "userSpaceOnUse",
          },
          React.createElement("rect", { width: "88", height: "88", fill: "#8b6a4d" }),
          React.createElement("path", {
            d: "M4 18 C20 2 38 8 50 20 C65 35 77 22 90 35 L90 57 C73 48 62 68 45 57 C31 48 20 62 5 52 Z",
            fill: "#b18760",
            opacity: "0.86",
          }),
          React.createElement("path", {
            d: "M-4 78 C12 62 30 72 43 62 C58 51 74 64 92 56 L92 90 L-4 90 Z",
            fill: "#624838",
            opacity: "0.74",
          }),
          React.createElement("path", {
            d: "M22 0 L12 88 M50 0 L40 88 M76 0 L65 88",
            stroke: "#3e3027",
            strokeWidth: "3",
            opacity: "0.36",
          }),
          React.createElement("path", {
            d: "M62 20 C68 10 78 9 84 15 C76 16 75 25 68 30 Z",
            fill: "#72a34e",
            opacity: "0.7",
          }),
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
        d: "M 34 452 L 520 220 L 755 425 L 892 425 L 892 490 L 0 490 L 0 470 Z",
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
      React.createElement("rect", {
        x: 892,
        y: 15,
        width: 104,
        height: 475,
        fill: "url(#summaryRockPattern)",
        className: "summary-wall",
      }),
      labelVisible("positive")
        ? React.createElement(
            "g",
            { className: "summary-label-group fade-in" },
            React.createElement("line", {
              x1: 58,
              y1: 436,
              x2: 512,
              y2: 228,
              className: "summary-slope-arrow positive",
              markerStart: "url(#summaryArrowGreen)",
              markerEnd: "url(#summaryArrowGreen)",
            }),
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
            React.createElement("line", {
              x1: 536,
              y1: 232,
              x2: 742,
              y2: 414,
              className: "summary-slope-arrow negative",
              markerStart: "url(#summaryArrowOrange)",
              markerEnd: "url(#summaryArrowOrange)",
            }),
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
            React.createElement("line", {
              x1: 762,
              y1: 452,
              x2: 884,
              y2: 452,
              className: "summary-slope-arrow zero",
              markerStart: "url(#summaryArrowBlue)",
              markerEnd: "url(#summaryArrowBlue)",
            }),
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
            React.createElement("line", {
              x1: 850,
              y1: 430,
              x2: 850,
              y2: 115,
              className: "summary-slope-arrow undefined",
              markerStart: "url(#summaryArrowYellow)",
              markerEnd: "url(#summaryArrowYellow)",
            }),
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
            href: "assets/cycle.png",
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
            href: "assets/guy.png",
            x: climberPoint.x - 90,
            y: climberPoint.y - 105,
            width: 108,
            height: 150,
            className: "summary-climber",
          })
        : null,
    ),
  );
};
