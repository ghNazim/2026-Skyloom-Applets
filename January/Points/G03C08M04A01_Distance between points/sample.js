import React, { useState, useRef, useMemo } from "react";

// Configuration updated for 100x70 coordinate system
const VIEWBOX = { w: 100, h: 70 };
// Distance 45, centered: 50 - 22.5 and 50 + 22.5
const P1 = { x: 27.5, y: 35 };
const P2 = { x: 72.5, y: 35 };
const THRESHOLD = 4; // Scaled snapping distance
const ANIMATION_DURATION = 1000; // ms

const App = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [scribble, setScribble] = useState([]);
  const [displayPoints, setDisplayPoints] = useState([]);
  const [isStraight, setIsStraight] = useState(false);
  const [status, setStatus] = useState("Connect the blue points.");
  const [isAnimating, setIsAnimating] = useState(false);
  const [pointsVisible, setPointsVisible] = useState(true);

  const svgRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const startMorphPoints = useRef([]);

  const getCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * VIEWBOX.w,
      y: ((clientY - rect.top) / rect.height) * VIEWBOX.h,
    };
  };

  const getDist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const getPathLength = (points) => {
    let length = 0;
    for (let i = 0; i < points.length - 1; i++) {
      length += getDist(points[i], points[i + 1]);
    }
    return length;
  };

  const handleStart = (e) => {
    if (isStraight || isAnimating) return;
    const coords = getCoords(e);
    const d1 = getDist(coords, P1);
    const d2 = getDist(coords, P2);

    let startPoint = null;
    if (d1 < THRESHOLD) startPoint = P1;
    else if (d2 < THRESHOLD) startPoint = P2;

    if (startPoint) {
      setIsDrawing(true);
      setScribble([startPoint]);
      setDisplayPoints([startPoint]);
      setStatus("Drawing...");
    }
  };

  const handleMove = (e) => {
    if (!isDrawing) return;
    const coords = getCoords(e);
    const lastPoint = scribble[scribble.length - 1];
    if (getDist(lastPoint, coords) > 0.5) {
      const next = [...scribble, coords];
      setScribble(next);
      setDisplayPoints(next);
    }
  };

  const handleEnd = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const lastPoint = scribble[scribble.length - 1];
    const startPoint = scribble[0];
    const targetPoint = getDist(startPoint, P1) < THRESHOLD ? P2 : P1;
    const distToTarget = getDist(lastPoint, targetPoint);

    if (distToTarget < THRESHOLD) {
      const finalScribble = [...scribble, targetPoint];
      setScribble(finalScribble);
      setDisplayPoints(finalScribble);
      setStatus("Connected!");
    } else {
      setScribble([]);
      setDisplayPoints([]);
      setStatus("Missed target.");
    }
  };

  const generateRandomCurve = (side = "any") => {
    if (isAnimating) return;

    const pointsCount = 80;
    const newScribble = [];

    // Scaled frequencies and amplitudes for 100x70
    const freq1 = 1.5 + Math.random() * 2;
    const amp1 = 2 + Math.random() * 3;
    const freq2 = 5 + Math.random() * 5;
    const amp2 = 1 + Math.random() * 2;

    const MIN_GAP = 6; // Scaled gap for 70 height

    const dx = P2.x - P1.x;
    const dy = P2.y - P1.y;
    const angle = Math.atan2(dy, dx);

    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      const lx = P1.x + dx * t;
      const ly = P1.y + dy * t;

      const envelope = Math.sin(t * Math.PI);

      let rawOffset =
        Math.sin(t * Math.PI * freq1) * amp1 +
        Math.sin(t * Math.PI * freq2) * amp2;

      if (side === "upper") {
        rawOffset = -(Math.abs(rawOffset) + MIN_GAP);
      } else if (side === "lower") {
        rawOffset = Math.abs(rawOffset) + MIN_GAP;
      }

      const offset = rawOffset * envelope;
      const px = -Math.sin(angle) * offset;
      const py = Math.cos(angle) * offset;

      if (i === 0) newScribble.push({ ...P1 });
      else if (i === pointsCount) newScribble.push({ ...P2 });
      else newScribble.push({ x: lx + px, y: ly + py });
    }

    setScribble(newScribble);
    setDisplayPoints(newScribble);
    setIsStraight(false);
    setPointsVisible(true);
    setStatus(`${side.charAt(0).toUpperCase() + side.slice(1)} generated.`);
  };

  const getStraightTarget = (points) => {
    if (points.length < 2) return [];
    const totalLength = getPathLength(points);
    const start = points[0];
    const end = points[points.length - 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const directDist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / (directDist || 1);
    const uy = dy / (directDist || 1);
    const cx = (start.x + end.x) / 2;
    const cy = (start.y + end.y) / 2;
    const halfLen = totalLength / 2;
    const lineStart = { x: cx - ux * halfLen, y: cy - uy * halfLen };
    const lineEnd = { x: cx + ux * halfLen, y: cy + uy * halfLen };
    const count = points.length;
    return points.map((_, i) => ({
      x: lineStart.x + (lineEnd.x - lineStart.x) * (i / (count - 1)),
      y: lineStart.y + (lineEnd.y - lineStart.y) * (i / (count - 1)),
    }));
  };

  const animateMorph = (targetIsStraight) => {
    if (scribble.length < 2 || isAnimating) return;
    setIsAnimating(true);
    if (targetIsStraight) setPointsVisible(false);

    setTimeout(() => {
      startMorphPoints.current = [...displayPoints];
      startTimeRef.current = performance.now();
      const targetPoints = targetIsStraight
        ? getStraightTarget(scribble)
        : scribble;

      const step = (timestamp) => {
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
        const ease =
          progress < 0.5
            ? 8 * Math.pow(progress, 4)
            : 1 - Math.pow(-2 * progress + 2, 4) / 2;

        const currentFramePoints = startMorphPoints.current.map((start, i) => {
          const target = targetPoints[i];
          return {
            x: start.x + (target.x - start.x) * ease,
            y: start.y + (target.y - start.y) * ease,
          };
        });

        setDisplayPoints(currentFramePoints);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          setIsAnimating(false);
          setIsStraight(targetIsStraight);
          if (!targetIsStraight) setPointsVisible(true);
          setStatus(targetIsStraight ? "Straightened." : "Restored.");
        }
      };
      animationRef.current = requestAnimationFrame(step);
    }, 100);
  };

  const pathData = useMemo(() => {
    if (displayPoints.length < 2) return "";
    return (
      `M ${displayPoints[0].x.toFixed(2)} ${displayPoints[0].y.toFixed(2)} ` +
      displayPoints
        .slice(1)
        .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ")
    );
  }, [displayPoints]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 p-4 font-sans">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black tracking-tighter text-zinc-900 uppercase">
              Scribble 100
            </h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {status}
            </p>
          </div>
          <button
            onClick={() => {
              setScribble([]);
              setDisplayPoints([]);
              setIsStraight(false);
              setPointsVisible(true);
            }}
            className="text-[10px] font-bold text-zinc-400 hover:text-red-500 uppercase"
          >
            Reset
          </button>
        </div>

        <div className="relative aspect-[100/70] bg-zinc-50 cursor-crosshair touch-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
            className="w-full h-full select-none"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {/* Guide Points */}
            <g
              className={`transition-all duration-300 ${
                pointsVisible
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50 pointer-events-none"
              }`}
            >
              <circle cx={P1.x} cy={P1.y} r="1.5" className="fill-blue-500" />
              <circle cx={P2.x} cy={P2.y} r="1.5" className="fill-blue-500" />
              <circle
                cx={P1.x}
                cy={P1.y}
                r="3"
                className="stroke-blue-200 stroke-[0.5] fill-none animate-pulse"
              />
              <circle
                cx={P2.x}
                cy={P2.y}
                r="3"
                className="stroke-blue-200 stroke-[0.5] fill-none animate-pulse"
              />
            </g>

            {/* The Path */}
            <path
              d={pathData}
              fill="none"
              stroke={isStraight ? "#10b981" : "#18181b"}
              strokeWidth={isStraight ? "1.2" : "0.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-500"
            />
          </svg>
        </div>

        <div className="p-6 bg-white flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => generateRandomCurve("any")}
              disabled={isAnimating}
              className="py-2 text-[10px] font-bold uppercase bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-30"
            >
              Mix
            </button>
            <button
              onClick={() => generateRandomCurve("upper")}
              disabled={isAnimating}
              className="py-2 text-[10px] font-bold uppercase bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-30"
            >
              Upper
            </button>
            <button
              onClick={() => generateRandomCurve("lower")}
              disabled={isAnimating}
              className="py-2 text-[10px] font-bold uppercase bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-30"
            >
              Lower
            </button>
          </div>
          <div className="flex gap-2">
            <button
              disabled={scribble.length < 2 || isStraight || isAnimating}
              onClick={() => animateMorph(true)}
              className="flex-1 py-3 bg-zinc-900 text-white text-xs font-bold uppercase rounded-xl hover:bg-black disabled:opacity-10"
            >
              Straighten
            </button>
            <button
              disabled={!isStraight || isAnimating}
              onClick={() => animateMorph(false)}
              className="flex-1 py-3 border-2 border-zinc-900 text-zinc-900 text-xs font-bold uppercase rounded-xl hover:bg-zinc-50 disabled:opacity-10"
            >
              Scribble
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
        Arc: {scribble.length > 0 ? getPathLength(scribble).toFixed(1) : 0}u |
        Gap: 45u
      </div>
    </div>
  );
};

export default App;
